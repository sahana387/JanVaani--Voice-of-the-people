import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import Policy, PolicyClause, PolicyWardMapping, Ward
from backend.agents.translation_agent import TranslationAgent
from backend.agents.comparison_agent import ComparisonAgent
from backend.agents.report_agent import ReportAgent
from backend.agents.impact_agent import ImpactAnalysisAgent

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.get("")
def list_policies(
    category: Optional[str] = None,
    ward_number: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    lang: str = "en",
    db: Session = Depends(get_db)
):
    query = db.query(Policy)

    if category and category != "All":
        query = query.filter(Policy.category.ilike(f"%{category}%"))

    if status and status != "All":
        query = query.filter(Policy.status == status)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Policy.title.ilike(search_fmt)) |
            (Policy.code.ilike(search_fmt)) |
            (Policy.summary_simple.ilike(search_fmt)) |
            (Policy.department.ilike(search_fmt))
        )

    policies = query.order_by(Policy.id.desc()).all()

    # Filter by ward if provided
    if ward_number:
        ward = db.query(Ward).filter(Ward.ward_number == ward_number).first()
        if ward:
            mapped_policy_ids = [
                m.policy_id for m in db.query(PolicyWardMapping).filter(PolicyWardMapping.ward_id == ward.id).all()
            ]
            policies = [p for p in policies if p.id in mapped_policy_ids]

    results = []
    for p in policies:
        p_dict = {
            "id": p.id,
            "code": p.code,
            "title": p.title,
            "department": p.department,
            "status": p.status,
            "effective_date": p.effective_date,
            "consultation_deadline": p.consultation_deadline,
            "category": p.category,
            "summary_simple": p.summary_simple,
            "summary_official": p.summary_official,
            "what_changed": p.what_changed,
            "who_affected": p.who_affected,
            "where_applies": p.where_applies,
            "positive_impacts": p.positive_impacts,
            "negative_impacts": p.negative_impacts,
            "key_statistics": p.key_statistics,
            "is_demo": p.is_demo
        }
        if lang in ["hi", "kn"]:
            p_dict = TranslationAgent.translate_policy_summary(p_dict, lang)
        results.append(p_dict)

    return {"count": len(results), "policies": results}


@router.get("/{policy_id}")
def get_policy_detail(policy_id: int, lang: str = "en", db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    clauses = db.query(PolicyClause).filter(PolicyClause.policy_id == policy_id).all()
    clause_list = []
    for c in clauses:
        c_dict = {
            "id": c.id,
            "section_number": c.section_number,
            "title": c.title,
            "official_text": c.official_text,
            "simple_text": c.simple_text,
            "page_number": c.page_number,
            "clause_type": c.clause_type,
            "old_value": c.old_value,
            "new_value": c.new_value,
            "practical_impact": c.practical_impact,
            "source_citation": c.source_citation
        }
        if lang in ["hi", "kn"]:
            c_dict["simple_text"] = TranslationAgent.translate_text(c.simple_text, lang)["translated_text"]
        clause_list.append(c_dict)

    definitions = {}
    if policy.definitions_json:
        try:
            definitions = json.loads(policy.definitions_json)
        except Exception:
            definitions = {}

    p_dict = {
        "id": policy.id,
        "code": policy.code,
        "title": policy.title,
        "department": policy.department,
        "jurisdiction": policy.jurisdiction,
        "status": policy.status,
        "effective_date": policy.effective_date,
        "consultation_deadline": policy.consultation_deadline,
        "category": policy.category,
        "summary_official": policy.summary_official,
        "summary_simple": policy.summary_simple,
        "what_changed": policy.what_changed,
        "who_affected": policy.who_affected,
        "where_applies": policy.where_applies,
        "when_takes_effect": policy.when_takes_effect,
        "key_requirements": policy.key_requirements,
        "positive_impacts": policy.positive_impacts,
        "negative_impacts": policy.negative_impacts,
        "key_statistics": policy.key_statistics,
        "definitions": definitions,
        "clauses": clause_list,
        "is_demo": policy.is_demo
    }

    if lang in ["hi", "kn"]:
        p_dict = TranslationAgent.translate_policy_summary(p_dict, lang)

    return p_dict


@router.get("/{policy_id}/report")
def get_citizen_impact_report(policy_id: int, lang: str = "en", db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    clauses = db.query(PolicyClause).filter(PolicyClause.policy_id == policy_id).all()
    clause_dicts = [{"title": c.title, "clause_type": c.clause_type} for c in clauses]

    p_dict = {
        "code": policy.code,
        "title": policy.title,
        "department": policy.department,
        "status": policy.status,
        "effective_date": policy.effective_date,
        "consultation_deadline": policy.consultation_deadline,
        "summary_official": policy.summary_official,
        "summary_simple": policy.summary_simple,
        "what_changed": policy.what_changed,
        "who_affected": policy.who_affected,
        "where_applies": policy.where_applies,
        "positive_impacts": policy.positive_impacts,
        "negative_impacts": policy.negative_impacts,
        "definitions_json": policy.definitions_json
    }

    report = ReportAgent.generate_impact_report(p_dict, clause_dicts)
    return report


@router.get("/{policy_id}/compare")
def compare_policy_versions(policy_id: int, db: Session = Depends(get_db)):
    new_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not new_policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    clauses = db.query(PolicyClause).filter(PolicyClause.policy_id == policy_id).all()
    clause_list = [
        {
            "section_number": c.section_number,
            "title": c.title,
            "official_text": c.official_text,
            "simple_text": c.simple_text,
            "page_number": c.page_number,
            "clause_type": c.clause_type,
            "old_value": c.old_value,
            "new_value": c.new_value,
            "practical_impact": c.practical_impact,
            "source_citation": c.source_citation
        }
        for c in clauses
    ]

    old_policy_dict = {
        "title": f"Previous Master Plan ({new_policy.previous_version_code or 'Pre-2026'})",
        "code": new_policy.previous_version_code or "BBMP-2020-OLD"
    }
    new_policy_dict = {
        "title": new_policy.title,
        "code": new_policy.code
    }

    diff_summary = ComparisonAgent.compare_policies(old_policy_dict, new_policy_dict, clause_list)
    return diff_summary


@router.get("/{policy_id}/local-impact")
def get_ward_specific_impact(policy_id: int, ward_name: str = "Indiranagar", db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    p_dict = {
        "title": policy.title,
        "category": policy.category,
        "positive_impacts": policy.positive_impacts,
        "negative_impacts": policy.negative_impacts
    }

    impact = ImpactAnalysisAgent.analyze_local_impact(p_dict, ward_name)
    return impact
