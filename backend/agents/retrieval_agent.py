from typing import List, Dict, Any, Optional
from backend.rag.vector_store import vector_store

class RetrievalAgent:
    """
    Retrieval Agent for JanVaani RAG pipeline.
    Ensures that any AI response is strictly grounded in official documents,
    extracts citations, computes confidence, and enforces zero-hallucination guardrails.
    """

    MIN_CONFIDENCE_THRESHOLD = 20.0

    @classmethod
    def search_evidence(
        cls,
        query: str,
        policy_id: Optional[int] = None,
        top_k: int = 4
    ) -> Dict[str, Any]:
        results = vector_store.search(
            query=query,
            top_k=top_k,
            policy_id=policy_id,
            min_confidence=0.10
        )

        if not results:
            return {
                "has_sufficient_evidence": False,
                "confidence_score": 0.0,
                "evidence_chunks": [],
                "citations": [],
                "grounded_context": "",
                "message": "I couldn't find enough evidence in the available official documents to answer this confidently."
            }

        top_confidence = results[0]["confidence_pct"]
        has_sufficient = top_confidence >= cls.MIN_CONFIDENCE_THRESHOLD

        citations = []
        context_parts = []
        for r in results:
            citation_label = f"{r['document_title']} (Page {r['page_number']}, {r['section_title']})"
            citations.append({
                "source": r["document_title"],
                "department": r["department"],
                "page": r["page_number"],
                "section": r["section_title"],
                "citation": citation_label,
                "confidence": r["confidence_pct"],
                "snippet": r["content"][:240] + "..." if len(r["content"]) > 240 else r["content"]
            })
            context_parts.append(f"[Source: {citation_label}]\n{r['content']}")

        grounded_context = "\n\n".join(context_parts)

        return {
            "has_sufficient_evidence": has_sufficient,
            "confidence_score": top_confidence,
            "evidence_chunks": results,
            "citations": citations,
            "grounded_context": grounded_context,
            "message": "Sufficient official evidence retrieved." if has_sufficient else "Limited evidence found in official documents."
        }
