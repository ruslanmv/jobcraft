from __future__ import annotations

from fastapi import APIRouter, HTTPException
from backend.services.browser_assist import open_in_browser

router = APIRouter(prefix='/assist', tags=['assist'])

@router.post('/open')
async def assist_open(url: str):
    try:
        status = await open_in_browser(url)
        return {'status': status}
    except Exception as e:
        raise HTTPException(400, str(e))
