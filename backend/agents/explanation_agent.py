from typing import Dict, Any

class CitizenExplanationAgent:
    """
    Converts dense bureaucratic, legal, and municipal language into clear,
    accessible, grade-school English while strictly retaining factual accuracy.
    """

    SIMPLIFICATION_RULES = [
        (r"\bpursuant to section\b", "under rule"),
        (r"\binter alia\b", "among other things"),
        (r"\bnotwithstanding anything contained in\b", "regardless of"),
        (r"\bheretofore\b", "before this"),
        (r"\bhereinabove\b", "mentioned above"),
        (r"\baforesaid\b", "the mentioned"),
        (r"\bcontravention thereof\b", "breaking this rule"),
        (r"\bpecuniary penalty\b", "fine / monetary charge"),
        (r"\bdemarcated ingress/egress\b", "designated entry and exit points"),
        (r"\bstatutory compliance\b", "mandatory government requirement"),
        (r"\bnull and void\b", "no longer legally valid"),
        (r"\bamenity space reservation\b", "dedicated open space for parks and community facilities")
    ]

    @classmethod
    def simplify_clause(cls, legal_text: str) -> str:
        simplified = legal_text
        import re
        for pattern, replacement in cls.SIMPLIFICATION_RULES:
            simplified = re.sub(pattern, replacement, simplified, flags=re.IGNORECASE)
        return simplified.strip()

    @classmethod
    def generate_citizen_breakdown(cls, policy_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a structured 'Explain Like I'm a Citizen' package.
        """
        return {
            "summary_simple": policy_data.get("summary_simple", ""),
            "what_changed": policy_data.get("what_changed", ""),
            "who_affected": policy_data.get("who_affected", ""),
            "where_applies": policy_data.get("where_applies", ""),
            "when_takes_effect": policy_data.get("when_takes_effect", ""),
            "positive_impacts": policy_data.get("positive_impacts", ""),
            "negative_impacts": policy_data.get("negative_impacts", ""),
            "requirements": policy_data.get("key_requirements", ""),
            "definitions": policy_data.get("definitions_json", "{}")
        }
