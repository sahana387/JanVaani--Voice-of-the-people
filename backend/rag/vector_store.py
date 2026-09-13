import re
import math
from collections import Counter
from typing import List, Dict, Any, Optional

class VectorStore:
    """
    Pure-Python Hybrid Vector Store and Retrieval Engine.
    Zero C-extension dependency for universal cross-platform compatibility.
    Combines TF-IDF cosine similarity, BM25 term weighting, and metadata filtering
    to retrieve grounded evidence chunks with exact page numbers and confidence metrics.
    """

    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.idf_dict: Dict[str, float] = {}
        self.doc_vectors: List[Dict[str, float]] = []
        self.total_docs: int = 0
        self.avg_doc_len: float = 0.0

    def add_chunks(self, new_chunks: List[Dict[str, Any]]):
        self.chunks.extend(new_chunks)
        self._reindex()

    def clear(self):
        self.chunks = []
        self.idf_dict = {}
        self.doc_vectors = []
        self.total_docs = 0
        self.avg_doc_len = 0.0

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        return [w for w in cleaned.split() if len(w) > 1]

    def _reindex(self):
        if not self.chunks:
            return

        self.total_docs = len(self.chunks)
        doc_tokens_list = [
            self._tokenize(
                c["content"] + " " +
                c.get("section_title", "") + " " +
                c.get("metadata", {}).get("document_title", "")
            )
            for c in self.chunks
        ]

        total_len = sum(len(t) for t in doc_tokens_list)
        self.avg_doc_len = total_len / max(self.total_docs, 1)

        # Compute document frequencies
        doc_freq = Counter()
        for tokens in doc_tokens_list:
            doc_freq.update(set(tokens))

        # BM25-style IDF calculation
        self.idf_dict = {}
        for term, df in doc_freq.items():
            self.idf_dict[term] = math.log((self.total_docs - df + 0.5) / (df + 0.5) + 1.0)

        # Build normalized TF-IDF sparse dictionary vectors
        self.doc_vectors = []
        k1 = 1.5
        b = 0.75

        for tokens in doc_tokens_list:
            tf = Counter(tokens)
            doc_len = len(tokens)
            vec = {}
            sum_sq = 0.0

            for term, count in tf.items():
                idf = self.idf_dict.get(term, 0.1)
                tf_bm25 = (count * (k1 + 1)) / (count + k1 * (1 - b + b * (doc_len / (self.avg_doc_len or 1))))
                weight = tf_bm25 * idf
                vec[term] = weight
                sum_sq += weight * weight

            norm = math.sqrt(sum_sq)
            if norm > 0:
                for term in vec:
                    vec[term] /= norm

            self.doc_vectors.append(vec)

    def search(
        self,
        query: str,
        top_k: int = 5,
        policy_id: Optional[int] = None,
        category: Optional[str] = None,
        min_confidence: float = 0.10
    ) -> List[Dict[str, Any]]:
        if not self.chunks or not self.doc_vectors:
            return []

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        # Build query vector
        q_tf = Counter(query_tokens)
        q_vec = {}
        sum_sq = 0.0
        for term, count in q_tf.items():
            idf = self.idf_dict.get(term, 0.5)
            weight = (count / len(query_tokens)) * idf
            q_vec[term] = weight
            sum_sq += weight * weight

        q_norm = math.sqrt(sum_sq)
        if q_norm > 0:
            for term in q_vec:
                q_vec[term] /= q_norm

        scored_results = []
        query_set = set(query_tokens)

        for idx, doc_vec in enumerate(self.doc_vectors):
            chunk = self.chunks[idx]
            meta = chunk.get("metadata", {})

            # Filter by policy if requested
            if policy_id is not None:
                c_pol = chunk.get("policy_id") or meta.get("policy_id")
                if c_pol is not None and c_pol != policy_id:
                    continue

            # Sparse dot product (cosine similarity)
            cosine_score = sum(doc_vec.get(term, 0.0) * q_weight for term, q_weight in q_vec.items())

            # Keyword overlap ratio
            content_lower = chunk["content"].lower()
            keyword_hits = sum(1 for q in query_set if q in content_lower)
            keyword_ratio = keyword_hits / max(len(query_set), 1)

            # Combined hybrid score (0.0 to 1.0)
            hybrid_score = (0.65 * cosine_score) + (0.35 * keyword_ratio)

            # Confidence scaled
            confidence_pct = min(100.0, max(0.0, (hybrid_score * 100) + (15 if keyword_hits >= 2 else 0)))

            if hybrid_score >= min_confidence or keyword_hits > 0:
                scored_results.append({
                    "chunk_id": chunk.get("chunk_index", idx + 1),
                    "document_title": meta.get("document_title", "Official Policy Record"),
                    "department": meta.get("department", "Municipal Corporation"),
                    "page_number": chunk.get("page_number", 1),
                    "section_title": chunk.get("section_title", "Section Record"),
                    "content": chunk.get("content", ""),
                    "source_citation": chunk.get("source_citation") or f"{meta.get('document_title', 'Document')}, Page {chunk.get('page_number', 1)}",
                    "score": round(hybrid_score, 4),
                    "confidence_pct": round(confidence_pct, 1),
                    "policy_id": chunk.get("policy_id") or meta.get("policy_id")
                })

        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]

# Global singleton instance
vector_store = VectorStore()
