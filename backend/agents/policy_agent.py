import re
import json
from typing import Dict, Any, List

class PolicyAnalysisAgent:
    """
    Analyzes municipal policies, bylaws, and planning notifications to extract
    structured metadata, obligations, key numbers, affected groups, and definitions.
    """

    @staticmethod
    def analyze_document_text(text: str, title: str = "") -> Dict[str, Any]:
        # Extract numerical statistics/thresholds (e.g., 15m, 24m, 100 sq.m, 20%, Rs. 5000)
        num_patterns = re.findall(r"(\d+(?:\.\d+)?\s*(?:m|meters|sq\.m|sqft|%|percent|rupees|Rs\.?|crore|lakh|days|months|years|km))", text, re.IGNORECASE)
        unique_numbers = list(dict.fromkeys(num_patterns))[:8]

        # Extract dates and deadlines
        dates = re.findall(r"(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}-\d{2}-\d{2})", text, re.IGNORECASE)
        unique_dates = list(dict.fromkeys(dates))

        # Detect affected groups
        stakeholders = []
        lowered = text.lower()
        if "residential" in lowered or "homeowner" in lowered or "resident" in lowered:
            stakeholders.append("Residential Property Owners & Tenants")
        if "commercial" in lowered or "business" in lowered or "retail" in lowered:
            stakeholders.append("Commercial Establishments & Small Businesses")
        if "builder" in lowered or "developer" in lowered or "construction" in lowered:
            stakeholders.append("Real Estate Developers & Contractors")
        if "vehicle" in lowered or "traffic" in lowered or "commuter" in lowered:
            stakeholders.append("Daily Commuters & Vehicle Owners")
        if "vendor" in lowered or "street" in lowered:
            stakeholders.append("Street Vendors & Local Traders")
        if not stakeholders:
            stakeholders.append("General Public & Ward Residents")

        # Extract difficult terms glossary
        glossary = {}
        if "far" in lowered or "floor area ratio" in lowered:
            glossary["Floor Area Ratio (FAR)"] = "The ratio of a building's total floor area to the size of the piece of land upon which it is built. Higher FAR allows taller buildings."
        if "setback" in lowered:
            glossary["Setback"] = "The minimum open distance required between a building structure and the property boundary or street line."
        if "zoning" in lowered:
            glossary["Zoning"] = "Municipal division of land into zones where specific land uses (residential, commercial, industrial) are permitted or prohibited."
        if "betterment levy" in lowered:
            glossary["Betterment Levy"] = "A municipal tax imposed on property owners whose property value increased due to public infrastructure development."
        if "wet waste" in lowered or "segregation" in lowered:
            glossary["Source Segregation"] = "Separating waste into biodegradable (wet), recyclable (dry), and sanitary categories right at home before handover."

        return {
            "title": title,
            "key_statistics": unique_numbers,
            "key_dates": unique_dates,
            "stakeholders": stakeholders,
            "glossary": glossary
        }
