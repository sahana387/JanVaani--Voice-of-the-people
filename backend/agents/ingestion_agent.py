from typing import Dict, Any
from backend.document_processing.pdf_processor import PDFProcessor
from backend.document_processing.chunker import DocumentChunker
from backend.rag.vector_store import vector_store

class DocumentIngestionAgent:
    """
    Ingests municipal documents (PDF/TXT), performs text extraction,
    OCR fallbacks, preserves page numbering, generates chunks,
    and indexes chunks into the hybrid vector retrieval engine.
    """

    def __init__(self):
        self.chunker = DocumentChunker(target_chunk_size=400, overlap=60)

    def ingest_document(self, file_path: str, department_hint: str = None, doc_id: int = None, policy_id: int = None) -> Dict[str, Any]:
        # 1. Extract text and metadata
        processed = PDFProcessor.process_file(file_path, department_hint)

        # 2. Chunk with page preservation
        chunks = self.chunker.chunk_document(processed, doc_id=doc_id, policy_id=policy_id)

        # 3. Index in vector store
        vector_store.add_chunks(chunks)

        return {
            "status": "success",
            "metadata": processed["metadata"],
            "total_pages": processed["total_pages"],
            "total_chunks": len(chunks),
            "chunks": chunks
        }
