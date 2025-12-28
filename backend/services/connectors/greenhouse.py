from __future__ import annotations
import httpx

# Greenhouse job boards: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs

async def list_jobs(board_token: str) -> list[dict]:
    url = f"https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs"
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()
        return data.get('jobs', [])
