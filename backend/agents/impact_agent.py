from typing import Dict, Any, List

class ImpactAnalysisAgent:
    """
    Evaluates evidence-backed policy impacts on citizens, households,
    traffic, commercial corridors, and ward environment.
    """

    @staticmethod
    def analyze_local_impact(policy: Dict[str, Any], ward_name: str) -> Dict[str, Any]:
        category = policy.get("category", "General")
        
        impact_dimensions = {
            "residential": {
                "level": "High" if "Zoning" in category or "Housing" in category else "Medium",
                "headline": "Changes to residential building permits & living density",
                "details": policy.get("positive_impacts", "Residential standards updated.")
            },
            "mobility_traffic": {
                "level": "High" if "Transit" in category or "Road" in category or "Transport" in category else "Low",
                "headline": "Commute patterns, public transit access, and road widths",
                "details": "Potential shifts in lane allocations and feeder bus connections in " + ward_name
            },
            "environmental": {
                "level": "High" if "Waste" in category or "Environment" in category or "Solar" in category else "Medium",
                "headline": "Rooftop green energy mandates & waste management compliance",
                "details": policy.get("negative_impacts", "Mandatory compliance required for bulk waste generators.")
            },
            "financial": {
                "level": "Medium",
                "headline": "Property taxes, betterment levies, and penalty structures",
                "details": "Compliance timeline and financial impact on local property owners."
            }
        }

        return {
            "policy_title": policy.get("title"),
            "ward_name": ward_name,
            "category": category,
            "overall_impact_score": 8.4 if "Zoning" in category else 7.2,
            "dimensions": impact_dimensions,
            "practical_advice": "Residents in " + ward_name + " should review section deadlines and check if their property falls within the notified buffer zone."
        }
