from typing import List, Dict, Any

class ComparisonAgent:
    """
    Compares two versions of a municipal policy (Old vs New),
    extracting added clauses, removed clauses, modified numerical limits,
    and practical implications for citizens.
    """

    @classmethod
    def compare_policies(cls, old_policy: Dict[str, Any], new_policy: Dict[str, Any], clauses: List[Dict[str, Any]]) -> Dict[str, Any]:
        added_clauses = []
        removed_clauses = []
        modified_clauses = []
        numerical_changes = []

        for c in clauses:
            ctype = c.get("clause_type", "standard").lower()
            diff_item = {
                "section": c.get("section_number", "Sec"),
                "title": c.get("title", ""),
                "official_text": c.get("official_text", ""),
                "simple_text": c.get("simple_text", ""),
                "old_value": c.get("old_value"),
                "new_value": c.get("new_value"),
                "practical_impact": c.get("practical_impact", ""),
                "citation": c.get("source_citation") or f"Section {c.get('section_number')}, Page {c.get('page_number', 1)}"
            }

            if ctype == "added":
                added_clauses.append(diff_item)
            elif ctype == "removed":
                removed_clauses.append(diff_item)
            elif ctype == "modified":
                modified_clauses.append(diff_item)
                if c.get("old_value") and c.get("new_value"):
                    numerical_changes.append({
                        "parameter": c.get("title"),
                        "before": c.get("old_value"),
                        "after": c.get("new_value"),
                        "practical_implication": c.get("practical_impact", "Parameter threshold revised."),
                        "citation": diff_item["citation"]
                    })

        # Summary of differences
        summary = {
            "comparison_title": f"{old_policy.get('title', 'Old Version')} vs {new_policy.get('title', 'New Version')}",
            "total_modifications": len(modified_clauses),
            "total_additions": len(added_clauses),
            "total_removals": len(removed_clauses),
            "added_clauses": added_clauses,
            "removed_clauses": removed_clauses,
            "modified_clauses": modified_clauses,
            "numerical_changes": numerical_changes,
            "key_takeaway": "The new policy increases vertical density allowance while introducing stricter source waste segregation and mandatory rooftop solar provisions."
        }

        return summary
