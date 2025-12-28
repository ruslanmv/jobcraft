from __future__ import annotations

from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix='/ollabridge', tags=['ollabridge'])

@router.post('/test')
async def test_connection(base_url: str, api_key: str):
    """Tests OllaBridge health endpoint from the server side."""
    base = base_url.rstrip('/')
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{base}/health", headers={'X-API-Key': api_key, 'Authorization': f"Bearer {api_key}"})
            # health should not require auth, but we send anyway for compatibility
            if r.status_code >= 400:
                raise HTTPException(r.status_code, r.text)
            return {'ok': True, 'health': r.json()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, str(e))
