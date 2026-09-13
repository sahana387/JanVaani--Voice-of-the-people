import re
from typing import List, Dict, Any

class DocumentChunker:
    """
    Splits municipal document pages into contextual chunks with sentence awareness,
    overlap, and comprehensive source grounding metadata (page, section, dept, date).
    """

    def __init__(self, target_chunk_size: int = 450, overlap: int = 80):
        self.target_chunk_size = target_chunk_size  # words approx
        self.overlap = overlap

    def chunk_document(self, processed_doc: Dict[str, Any], doc_id: int = None, policy_id: int = None) -> List[Dict[str, Any]]:
        chunks = []
        doc_meta = processed_doc.get("metadata", {})
        pages = processed_doc.get("pages", [])
        chunk_idx = 0

        for page in pages:
            page_num = page.get("page_number", 1)
            sections = page.get("sections", [])
            
            for section in sections:
                sec_title = section.get("title", f"Page {page_num}")
                sec_text = section.get("text", "")
                
                if not sec_text.strip():
                    continue

                words = sec_text.split()
                if len(words) <= self.target_chunk_size:
                    chunk_idx += 1
                    chunks.append(self._create_chunk_entry(
                        chunk_idx=chunk_idx,
                        page_num=page_num,
                        sec_title=sec_title,
                        text=sec_text,
                        doc_meta=doc_meta,
                        doc_id=doc_id,
                        policy_id=policy_id
                    ))
                else:
                    # Slide window with overlap
                    start = 0
                    while start < len(words):
                        end = min(start + self.target_chunk_size, len(words))
                        chunk_words = words[start:end]
                        chunk_str = " ".join(chunk_words)
                        
                        chunk_idx += 1
                        chunks.append(self._create_chunk_entry(
                            chunk_idx=chunk_idx,
                            page_num=page_num,
                            sec_title=sec_title,
                            text=chunk_str,
                            doc_meta=doc_meta,
                            doc_id=doc_id,
                            policy_id=policy_id
                        ))
                        
                        if end == len(words):
                            break
                        start += (self.target_chunk_size - self.overlap)

        return chunks

    def _create_chunk_entry(
        self,
        chunk_idx: int,
        page_num: int,
        sec_title: str,
        text: str,
        doc_meta: Dict[str, Any],
        doc_id: int = None,
        policy_id: int = None
    ) -> Dict[str, Any]:
        token_count = len(text.split())
        source_citation = f"{doc_meta.get('title', 'Document')}, Page {page_num} ({sec_title})"

        metadata = {
            "document_title": doc_meta.get("title", "Municipal Document"),
            "department": doc_meta.get("department", "Municipal Corporation"),
            "date_published": doc_meta.get("date_published", "2026"),
            "source_url": doc_meta.get("source_url", ""),
            "page_number": page_num,
            "section_title": sec_title,
            "source_citation": source_citation,
            "doc_id": doc_id,
            "policy_id": policy_id
        }

        return {
            "chunk_index": chunk_idx,
            "page_number": page_num,
            "section_title": sec_title,
            "content": text.strip(),
            "token_count": token_count,
            "metadata": metadata,
            "source_citation": source_citation
        }
