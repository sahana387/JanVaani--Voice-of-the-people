from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import Policy, SentimentVote, Ward
from backend.agents.sentiment_agent import SentimentAgent

router = APIRouter(prefix="/sentiment", tags=["Public Sentiment"])

class SentimentSubmission(BaseModel):
    policy_id: int
    stance: str  # support, oppose, neutral
    comment: Optional[str] = None
    ward_number: Optional[int] = None
    session_token: str

@router.get("/{policy_id}")
def get_policy_sentiment(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    votes = db.query(SentimentVote).filter(SentimentVote.policy_id == policy_id).all()
    vote_dicts = [
        {
            "stance": v.stance,
            "comment": v.comment,
            "timestamp": v.timestamp.strftime("%Y-%m-%d %H:%M") if v.timestamp else "Recent"
        }
        for v in votes
    ]

    aggregated = SentimentAgent.aggregate_sentiment(vote_dicts, policy.title)
    return aggregated

@router.post("")
def submit_sentiment(payload: SentimentSubmission, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == payload.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    stance_clean = payload.stance.lower().strip()
    if stance_clean not in ["support", "oppose", "neutral"]:
        raise HTTPException(status_code=400, detail="Stance must be support, oppose, or neutral")

    # Check duplicate submission in current session
    existing = db.query(SentimentVote).filter(
        SentimentVote.policy_id == payload.policy_id,
        SentimentVote.session_token == payload.session_token
    ).first()

    ward_id = None
    if payload.ward_number:
        ward = db.query(Ward).filter(Ward.ward_number == payload.ward_number).first()
        if ward:
            ward_id = ward.id

    if existing:
        existing.stance = stance_clean
        if payload.comment:
            existing.comment = payload.comment
        db.commit()
        return {"status": "updated", "message": "Your anonymous civic stance was updated."}

    new_vote = SentimentVote(
        policy_id=payload.policy_id,
        session_token=payload.session_token,
        stance=stance_clean,
        comment=payload.comment,
        ward_id=ward_id
    )
    db.add(new_vote)
    db.commit()

    return {"status": "success", "message": "Your anonymous civic stance was securely recorded."}
