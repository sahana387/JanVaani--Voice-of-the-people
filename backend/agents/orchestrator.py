from typing import Dict, Any, Optional
from backend.agents.retrieval_agent import RetrievalAgent
from backend.agents.translation_agent import TranslationAgent
from backend.agents.explanation_agent import CitizenExplanationAgent
from backend.config import settings

class OrchestratorAgent:
    """
    Central Orchestrator Agent.
    Coordinates multi-agent workflows, enforces grounded retrieval,
    executes RAG generation, attaches citations and confidence badges,
    and applies multilingual translations.
    """

    @classmethod
    def answer_question(
        cls,
        question: str,
        policy_id: Optional[int] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        
        # Step 1: Retrieval Agent finds grounded evidence
        retrieval_res = RetrievalAgent.search_evidence(query=question, policy_id=policy_id, top_k=4)

        if not retrieval_res["has_sufficient_evidence"] or not retrieval_res["evidence_chunks"]:
            base_msg = "I couldn't find enough evidence in the available official documents to answer this confidently."
            translated = TranslationAgent.translate_text(base_msg, language)
            return {
                "answer": translated["translated_text"],
                "confidence_score": retrieval_res["confidence_score"],
                "has_sufficient_evidence": False,
                "citations": [],
                "grounded_context": "",
                "disclaimer": translated["disclaimer"],
                "language": language
            }

        top_chunks = retrieval_res["evidence_chunks"]
        citations = retrieval_res["citations"]

        # Step 2: Synthesis over retrieved official chunks
        # Synthesize clear answer grounded in official text
        primary_chunk = top_chunks[0]
        grounded_answer = cls._synthesize_grounded_answer(question, top_chunks)

        # Step 3: Multilingual translation if requested
        if language in ["hi", "kn"]:
            trans_res = TranslationAgent.translate_text(grounded_answer, language)
            final_answer = trans_res["translated_text"]
            disclaimer = trans_res["disclaimer"]
        else:
            final_answer = grounded_answer
            disclaimer = "Answer grounded in official municipal gazette chunks."

        return {
            "answer": final_answer,
            "confidence_score": retrieval_res["confidence_score"],
            "has_sufficient_evidence": True,
            "citations": citations,
            "grounded_context": retrieval_res["grounded_context"][:400] + "...",
            "disclaimer": disclaimer,
            "language": language
        }

    @classmethod
    def _synthesize_grounded_answer(cls, question: str, chunks: list) -> str:
        q_lower = question.lower()
        top_text = chunks[0]["content"]
        sec_title = chunks[0]["section_title"]
        page_no = chunks[0]["page_number"]
        doc_title = chunks[0]["document_title"]

        # Clean synthesis
        first_few_sentences = ". ".join(top_text.split(". ")[:3])
        if not first_few_sentences.endswith("."):
            first_few_sentences += "."

        return (
            f"According to {doc_title} (Page {page_no}, {sec_title}):\n\n"
            f"{first_few_sentences}\n\n"
            f"This is an official requirement published under municipal jurisdiction."
        )
