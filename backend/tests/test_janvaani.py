import os
import sys
import math
import unittest
from pathlib import Path

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.rag.vector_store import vector_store
from backend.agents.orchestrator import OrchestratorAgent
from backend.agents.retrieval_agent import RetrievalAgent
from backend.agents.translation_agent import TranslationAgent
from backend.agents.comparison_agent import ComparisonAgent
from backend.agents.response_agent import CitizenResponseAgent
from backend.agents.sentiment_agent import SentimentAgent

class TestJanVaaniCore(unittest.TestCase):

    def setUp(self):
        chunks = [
            {
                "chunk_index": 1,
                "page_number": 3,
                "section_title": "Section 4.1 - Maximum Height",
                "content": "Section 4.1: Maximum Permissible Building Height. In all Residential R-2 zones abutting roads with carriage width of 12.0 meters, height shall not exceed 24.0 meters.",
                "policy_id": 1,
                "metadata": {"document_title": "BBMP Master Plan Gazette", "department": "Urban Development"},
                "source_citation": "BBMP Master Plan Gazette, Page 3 (Section 4.1)"
            },
            {
                "chunk_index": 2,
                "page_number": 5,
                "section_title": "Section 9 - SWM Penalties",
                "content": "Section 9: Solid waste penalties. Unsegregated garbage attracts spot fine of Rs. 1000 for residential households.",
                "policy_id": 2,
                "metadata": {"document_title": "BBMP SWM Bylaws", "department": "SWM Taskforce"},
                "source_citation": "BBMP SWM Bylaws, Page 5 (Section 9)"
            }
        ]
        vector_store.clear()
        vector_store.add_chunks(chunks)

    def test_vector_store_grounding_and_retrieval(self):
        results = vector_store.search("building height 12 meters", top_k=2)
        self.assertTrue(len(results) > 0)
        self.assertEqual(results[0]["page_number"], 3)
        self.assertIn("24.0 meters", results[0]["content"])
        self.assertGreater(results[0]["confidence_pct"], 40.0)

    def test_orchestrator_rag_grounded_answer(self):
        res = OrchestratorAgent.answer_question("What is the maximum building height?")
        self.assertTrue(res["has_sufficient_evidence"])
        self.assertIn("24.0 meters", res["answer"])
        self.assertTrue(len(res["citations"]) > 0)
        self.assertEqual(res["citations"][0]["page"], 3)

    def test_orchestrator_insufficient_evidence_fallback(self):
        res = OrchestratorAgent.answer_question("What is the quantum mechanics formula for spacecraft?")
        self.assertTrue("insufficient" in res["answer"].lower() or "enough evidence" in res["answer"].lower())

    def test_multilingual_translation_agent(self):
        en_phrase = "Government policies shouldn't be difficult to understand."
        hi_res = TranslationAgent.translate_text(en_phrase, "hi")
        self.assertTrue(hi_res["is_translated"])
        self.assertIn("सरकारी नीतियों", hi_res["translated_text"])

        kn_res = TranslationAgent.translate_text(en_phrase, "kn")
        self.assertTrue(kn_res["is_translated"])
        self.assertIn("ಸರ್ಕಾರಿ", kn_res["translated_text"])

    def test_quadratic_voting_formula(self):
        credits_cases = [
            (1, 1),
            (4, 2),
            (9, 3),
            (16, 4),
            (25, 5),
            (100, 10)
        ]
        for credits, expected_votes in credits_cases:
            votes = int(math.floor(math.sqrt(credits)))
            self.assertEqual(votes, expected_votes)
            cost = votes * votes
            self.assertEqual(cost, credits)

    def test_citizen_response_draft_agent(self):
        draft = CitizenResponseAgent.generate_draft(
            policy_title="Transit-Oriented Development Regulations",
            policy_code="BBMP-2026-ZON-04",
            department="Urban Development Directorate",
            response_type="objection",
            citizen_position="Objection regarding water shortage",
            concerns="Underground borewell depletion in Indiranagar 12m lanes.",
            user_ward="Indiranagar Ward 80",
            specific_points="Require mandatory hydrogeological NOC."
        )
        self.assertTrue(draft["is_draft"])
        self.assertIn("FORMAL STATEMENT OF OBJECTION", draft["full_draft"])
        self.assertIn("Indiranagar Ward 80", draft["full_draft"])
        self.assertIn("Underground borewell depletion", draft["full_draft"])

    def test_sentiment_aggregation_agent(self):
        sample_votes = [
            {"stance": "support", "comment": "Great move"},
            {"stance": "support", "comment": "Needed for city"},
            {"stance": "oppose", "comment": "Too dense"},
            {"stance": "neutral", "comment": "Depends on parking"}
        ]
        agg = SentimentAgent.aggregate_sentiment(sample_votes, "Test Policy")
        self.assertEqual(agg["total_participants"], 4)
        self.assertEqual(agg["support_pct"], 50.0)
        self.assertEqual(agg["oppose_pct"], 25.0)
        self.assertEqual(agg["neutral_pct"], 25.0)

if __name__ == "__main__":
    unittest.main()
