from __future__ import annotations

from datetime import datetime
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from backend.core.db import session
from backend.app.models.db import JobRecord

router = APIRouter(prefix='/tracker', tags=['tracker'])

@router.get('/jobs')
async def list_jobs():
    try:
        with session() as s:
            rows = s.exec(select(JobRecord).order_by(JobRecord.created_at.desc())).all()
            return {'jobs': [r.model_dump() for r in rows]}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post('/jobs')
async def upsert_job(job: JobRecord):
    try:
        with session() as s:
            existing = s.get(JobRecord, job.id)
            if existing:
                for k, v in job.model_dump().items():
                    setattr(existing, k, v)
                existing.updated_at = datetime.utcnow()
                s.add(existing)
            else:
                s.add(job)
            s.commit()
            return {'ok': True}
    except Exception as e:
        raise HTTPException(500, str(e))
