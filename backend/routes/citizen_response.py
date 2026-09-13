from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import Policy, CitizenResponseDraft
from backend.agents.response_agent import CitizenResponseAgent

router = APIRouter(prefix="/citizen-response", tags=["Citizen Response Assistant"])

class GenerateDraftRequest(BaseModel):
    policy_id: int
    session_token: str
    response_type: str  # feedback, objection, support, rti, email
    citizen_position: str
    concerns: str
    user_ward: Optional[str] = "Bengaluru Resident"
    specific_points: Optional[str] = ""

@router.post("/generate")
def generate_civic_draft(payload: GenerateDraftRequest, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == payload.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    draft_result = CitizenResponseAgent.generate_draft(
        policy_title=policy.title,
        policy_code=policy.code,
        department=policy.department,
        response_type=payload.response_type,
        citizen_position=payload.citizen_position,
        concerns=payload.concerns,
        user_ward=payload.user_ward or "Bengaluru Resident",
        specific_points=payload.specific_points or ""
    )

    # Save draft record
    saved_record = CitizenResponseDraft(
        policy_id=policy.id,
        session_token=payload.session_token,
        response_type=payload.response_type,
        citizen_position=payload.citizen_position,
        concerns=payload.concerns,
        user_ward=payload.user_ward,
        generated_draft=draft_result["full_draft"]
    )
    db.add(saved_record)
    db.commit()

    return draft_result
