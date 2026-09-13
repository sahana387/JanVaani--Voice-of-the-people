import json
from typing import Dict, Any, List

class ReportAgent:
    """
    Assembles comprehensive, structured Citizen Impact Reports
    with sections grounded in official citations, positive/negative impact assessments,
    and civic response guidance.
    """

    @classmethod
    def generate_impact_report(cls, policy_dict: Dict[str, Any], clauses: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        clauses = clauses or []

        definitions = {}
        if policy_dict.get("definitions_json"):
            try:
                definitions = json.loads(policy_dict["definitions_json"])
            except Exception:
                definitions = {}

        report_sections = [
            {
                "section_id": "overview",
                "title": "1. Policy Overview & Official Context",
                "content": policy_dict.get("summary_official", ""),
                "citation": f"Notification {policy_dict.get('code', 'BBMP-2026')}, {policy_dict.get('department', 'BBMP')}"
            },
            {
                "section_id": "simple_summary",
                "title": "2. Citizen Summary (Plain Language)",
                "content": policy_dict.get("summary_simple", ""),
                "citation": "JanVaani Plain Language Synthesis"
            },
            {
                "section_id": "what_changed",
                "title": "3. What Changed from Previous Regulations",
                "content": policy_dict.get("what_changed", ""),
                "citation": "Clause Comparison Section"
            },
            {
                "section_id": "stakeholders",
                "title": "4. Who Is Affected",
                "content": policy_dict.get("who_affected", ""),
                "citation": "Impact Assessment Section 2"
            },
            {
                "section_id": "geography",
                "title": "5. Geographic Scope & Applicable Wards",
                "content": policy_dict.get("where_applies", ""),
                "citation": "Municipal Jurisdiction Gazettes"
            },
            {
                "section_id": "positive_impacts",
                "title": "6. Potential Positive Impacts & Benefits",
                "content": policy_dict.get("positive_impacts", ""),
                "citation": "Economic & Infrastructure Evaluation"
            },
            {
                "section_id": "concerns",
                "title": "7. Potential Concerns & Public Nuances",
                "content": policy_dict.get("negative_impacts", ""),
                "citation": "Ward Feedback & Civic Review"
            },
            {
                "section_id": "deadlines",
                "title": "8. Key Dates, Milestones & Deadlines",
                "content": f"Effective Date: {policy_dict.get('effective_date', 'Immediate')} | Public Consultation Deadline: {policy_dict.get('consultation_deadline', 'None')}",
                "citation": "Gazette Timeline Clause"
            },
            {
                "section_id": "action_guide",
                "title": "9. What Citizens Should Know & How to Respond",
                "content": "Citizens may submit public comments, file objections at their local Ward Committee meetings, or participate in the JanVaani quadratic voting portal to signal civic priority.",
                "citation": "Citizen Participation Guidelines"
            }
        ]

        return {
            "report_title": f"Citizen Impact Report: {policy_dict.get('title')}",
            "policy_code": policy_dict.get("code"),
            "department": policy_dict.get("department"),
            "effective_date": policy_dict.get("effective_date"),
            "consultation_deadline": policy_dict.get("consultation_deadline"),
            "status": policy_dict.get("status"),
            "definitions": definitions,
            "sections": report_sections,
            "clauses_count": len(clauses),
            "generated_at": "2026-09-13",
            "is_authoritative_source": False,
            "authoritative_source_note": f"Original document published by {policy_dict.get('department')} is the legal authority."
        }
