import math
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import QuadraticTopic, QuadraticVote

router = APIRouter(prefix="/quadratic-voting", tags=["Quadratic Voting"])

MAX_SESSION_CREDITS = 100

class VoteAllocation(BaseModel):
    topic_id: int
    credits_allocated: int  # e.g., 1, 4, 9, 16, 25, 36, 49, 64, 81, 100

class CastVotesRequest(BaseModel):
    session_token: str
    allocations: List[VoteAllocation]

@router.get("/topics")
def get_quadratic_topics(session_token: str = "guest", db: Session = Depends(get_db)):
    topics = db.query(QuadraticTopic).filter(QuadraticTopic.is_active == True).all()
    
    # Fetch user's existing votes in this session
    user_votes = db.query(QuadraticVote).filter(QuadraticVote.session_token == session_token).all()
    user_vote_map = {v.topic_id: {"credits": v.credits_spent, "votes": v.votes_awarded} for v in user_votes}

    results = []
    total_spent_by_user = sum(v.credits_spent for v in user_votes)

    for t in topics:
        user_alloc = user_vote_map.get(t.id, {"credits": 0, "votes": 0})
        results.append({
            "id": t.id,
            "policy_id": t.policy_id,
            "title": t.title,
            "description": t.description,
            "category": t.category,
            "total_credits_spent": t.total_credits_spent,
            "total_votes_cast": t.total_votes_cast,
            "user_credits_spent": user_alloc["credits"],
            "user_votes_awarded": user_alloc["votes"]
        })

    return {
        "max_credits": MAX_SESSION_CREDITS,
        "credits_used": total_spent_by_user,
        "credits_remaining": max(0, MAX_SESSION_CREDITS - total_spent_by_user),
        "formula": "votes = floor(sqrt(credits_spent)) | cost = votes^2",
        "topics": results
    }

@router.post("/cast")
def cast_quadratic_votes(payload: CastVotesRequest, db: Session = Depends(get_db)):
    # Validate quadratic credit constraints
    total_credits = sum(a.credits_allocated for a in payload.allocations if a.credits_allocated > 0)
    if total_credits > MAX_SESSION_CREDITS:
        raise HTTPException(
            status_code=400,
            detail=f"Total allocated credits ({total_credits}) exceeds maximum allowance ({MAX_SESSION_CREDITS})."
        )

    # Clear previous session allocations for fresh update
    db.query(QuadraticVote).filter(QuadraticVote.session_token == payload.session_token).delete()

    processed_topics = []
    for alloc in payload.allocations:
        if alloc.credits_allocated <= 0:
            continue

        credits = alloc.credits_allocated
        votes = int(math.floor(math.sqrt(credits)))

        topic = db.query(QuadraticTopic).filter(QuadraticTopic.id == alloc.topic_id).first()
        if not topic:
            continue

        new_vote = QuadraticVote(
            topic_id=alloc.topic_id,
            session_token=payload.session_token,
            credits_spent=credits,
            votes_awarded=votes
        )
        db.add(new_vote)

        topic.total_credits_spent += credits
        topic.total_votes_cast += votes
        processed_topics.append({
            "topic_id": topic.id,
            "title": topic.title,
            "credits_spent": credits,
            "votes_awarded": votes
        })

    db.commit()

    return {
        "status": "success",
        "message": "Quadratic votes successfully cast.",
        "credits_spent": total_credits,
        "credits_remaining": MAX_SESSION_CREDITS - total_credits,
        "allocations": processed_topics
    }
