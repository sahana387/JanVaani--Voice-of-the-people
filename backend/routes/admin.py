import os
import shutil
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.config import UPLOAD_DIR
from backend.database.db import get_db
from backend.database.models import Document, DocumentChunk, Policy, QuadraticVote, SentimentVote
from backend.agents.ingestion_agent import DocumentIngestionAgent
from backend.rag.vector_store import vector_store

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

ingestion_agent = DocumentIngestionAgent()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_docs = db.query(Document).count()
    total_policies = db.query(Policy).count()
    total_chunks = db.query(DocumentChunk).count()
    total_votes = db.query(QuadraticVote).count()
    total_sentiment = db.query(SentimentVote).count()

    return {
        "total_documents": total_docs,
        "total_policies": total_policies,
        "total_chunks": total_chunks,
        "total_quadratic_votes": total_votes,
        "total_sentiment_votes": total_sentiment,
        "vector_store_indexed_chunks": len(vector_store.chunks),
        "system_status": "Operational - High Grounding Integrity"
    }

@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.id.desc()).all()
    results = []
    for d in docs:
        results.append({
            "id": d.id,
            "title": d.title,
            "filename": d.filename,
            "department": d.department,
            "date_published": d.date_published,
            "file_size": d.file_size,
            "mime_type": d.mime_type,
            "status": d.status,
            "chunk_count": d.chunk_count,
            "is_demo": d.is_demo,
            "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if d.created_at else "2026-09-13"
        })
    return {"documents": results}

@router.get("/documents/{document_id}/chunks")
def get_document_chunks(document_id: int, db: Session = Depends(get_db)):
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).all()
    results = []
    for c in chunks:
        results.append({
            "id": c.id,
            "chunk_index": c.chunk_index,
            "page_number": c.page_number,
            "section_title": c.section_title,
            "token_count": c.token_count,
            "content": c.content
        })
    return {"document_id": document_id, "count": len(results), "chunks": results}

@router.post("/upload")
async def upload_and_ingest_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    department: str = Form("Municipal Administration"),
    category: str = Form("Zoning & Planning"),
    db: Session = Depends(get_db)
):
    # Save file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    # Register in DB
    new_doc = Document(
        title=title,
        filename=file.filename,
        file_path=str(file_path),
        file_size=file_size,
        mime_type=file.content_type or "application/pdf",
        department=department,
        date_published="2026-09-13",
        status="processing",
        is_demo=False
    )
    db.add(new_doc)
    db.flush()

    try:
        # Ingest and chunk
        ingest_res = ingestion_agent.ingest_document(
            file_path=str(file_path),
            department_hint=department,
            doc_id=new_doc.id
        )

        chunks_data = ingest_res.get("chunks", [])
        for c in chunks_data:
            chunk_rec = DocumentChunk(
                document_id=new_doc.id,
                chunk_index=c["chunk_index"],
                page_number=c["page_number"],
                section_title=c["section_title"],
                content=c["content"],
                token_count=c["token_count"],
                metadata_json=json.dumps(c["metadata"])
            )
            db.add(chunk_rec)

        new_doc.status = "indexed"
        new_doc.chunk_count = len(chunks_data)
        db.commit()

        return {
            "status": "success",
            "message": f"Successfully processed and indexed {len(chunks_data)} chunks from {file.filename}.",
            "document_id": new_doc.id,
            "chunks_indexed": len(chunks_data)
        }

    except Exception as e:
        new_doc.status = "error"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
