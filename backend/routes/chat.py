from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.agents.orchestrator import OrchestratorAgent

router = APIRouter(prefix="/chat", tags=["Chat & RAG Assistant"])

class ChatRequest(BaseModel):
    question: str
    policy_id: Optional[int] = None
    language: str = "en"  # en, hi, kn

@router.post("")
def ask_janvaani(payload: ChatRequest, db: Session = Depends(get_db)):
    result = OrchestratorAgent.answer_question(
        question=payload.question,
        policy_id=payload.policy_id,
        language=payload.language
    )
    return result
