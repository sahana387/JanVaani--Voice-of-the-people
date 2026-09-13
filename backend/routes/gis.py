import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import Ward, Policy, PolicyWardMapping
from backend.agents.geospatial_agent import GeospatialAgent

router = APIRouter(prefix="/gis", tags=["GIS & Map Layers"])

@router.get("/geojson")
def get_geojson_layers():
    return GeospatialAgent.get_geojson_feature_collection()

@router.get("/wards")
def list_wards(db: Session = Depends(get_db)):
    wards = db.query(Ward).order_by(Ward.ward_number).all()
    results = []
    for w in wards:
        results.append({
            "id": w.id,
            "ward_number": w.ward_number,
            "name": w.name,
            "zone": w.zone,
            "city": w.city,
            "pin_codes": w.pin_codes,
            "population": w.population,
            "area_sq_km": w.area_sq_km,
            "center": [w.center_lat, w.center_lng]
        })
    return {"wards": results}

@router.get("/wards/{ward_number}/policies")
def get_ward_policies(ward_number: int, db: Session = Depends(get_db)):
    ward = db.query(Ward).filter(Ward.ward_number == ward_number).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    mappings = db.query(PolicyWardMapping).filter(PolicyWardMapping.ward_id == ward.id).all()
    policy_ids = [m.policy_id for m in mappings]
    policies = db.query(Policy).filter(Policy.id.in_(policy_ids)).all()

    mapping_by_policy = {m.policy_id: m for m in mappings}

    policy_results = []
    for p in policies:
        m = mapping_by_policy.get(p.id)
        policy_results.append({
            "id": p.id,
            "code": p.code,
            "title": p.title,
            "category": p.category,
            "status": p.status,
            "effective_date": p.effective_date,
            "impact_level": m.impact_level if m else "Medium",
            "impact_summary": m.impact_summary if m else p.summary_simple,
            "summary_simple": p.summary_simple
        })

    return {
        "ward": {
            "ward_number": ward.ward_number,
            "name": ward.name,
            "zone": ward.zone,
            "pin_codes": ward.pin_codes,
            "center": [ward.center_lat, ward.center_lng]
        },
        "affected_policies_count": len(policy_results),
        "policies": policy_results
    }
