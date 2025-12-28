from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlmodel import select
from backend.services.emailer import send_email
from backend.core.db import session
from backend.app.models.db import JobRecord

router = APIRouter(prefix='/digest', tags=['digest'])

@router.post('/email')
async def email_digest(to_email: str, subject: str = 'JobCraft Digest'):
    try:
        with session() as s:
            rows = s.exec(select(JobRecord).order_by(JobRecord.updated_at.desc())).all()
        lines = [f"{r.status.upper()} | {r.company} — {r.title} | {r.url}" for r in rows[:200]]
        body = "\n".join(lines) if lines else "No tracked jobs yet."
        await send_email(to_email, subject, body)
        return {'sent': True}
    except Exception as e:
        raise HTTPException(500, str(e))
