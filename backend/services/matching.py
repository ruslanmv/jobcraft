from __future__ import annotations
from rapidfuzz import fuzz

def score_job(profile_text: str, job_text: str) -> int:
    """Simple, fast baseline score. Replace with embeddings later."""
    if not profile_text or not job_text:
        return 0
    return int(fuzz.token_set_ratio(profile_text, job_text))
