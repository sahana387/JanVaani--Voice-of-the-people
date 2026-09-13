from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import AlertNotification

router = APIRouter(prefix="/alerts", tags=["Policy Monitoring & Alerts"])

@router.get("")
def list_alerts(category: Optional[str] = None, alert_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AlertNotification).filter(AlertNotification.is_active == True)

    if category and category != "All":
        query = query.filter(AlertNotification.category.ilike(f"%{category}%"))

    if alert_type and alert_type != "All":
        query = query.filter(AlertNotification.alert_type == alert_type)

    alerts = query.order_by(AlertNotification.id.desc()).all()

    results = []
    for a in alerts:
        results.append({
            "id": a.id,
            "title": a.title,
            "message": a.message,
            "alert_type": a.alert_type,
            "policy_id": a.policy_id,
            "category": a.category,
            "event_date": a.event_date,
            "created_at": a.created_at.strftime("%Y-%m-%d") if a.created_at else "2026-09-13"
        })

    return {"count": len(results), "alerts": results}
