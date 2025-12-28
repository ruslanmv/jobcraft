from __future__ import annotations
import httpx

# Lever postings API: https://api.lever.co/v0/postings/{company}?mode=json

async def list_jobs(company: str) -> list[dict]:
    url = f"https://api.lever.co/v0/postings/{company}?mode=json"
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()
        return data if isinstance(data, list) else []
