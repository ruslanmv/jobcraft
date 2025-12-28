from __future__ import annotations

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
import uuid

from backend.core.settings import settings
from backend.services.cv_parser import parse_cv
from backend.crews.jobcraft_crew import build_application_packet

router = APIRouter(prefix='/jobcraft', tags=['jobcraft'])

@router.post('/packet')
async def create_packet(
    provider: str = Form('ollabridge'),
    job_title: str = Form(...),
    company: str = Form(...),
    job_description: str = Form(...),
    country: str = Form('IT'),
    cv_file: UploadFile = File(...),
):
    try:
        tmp = settings.DATA_DIR / f"cv_{uuid.uuid4()}_{cv_file.filename}"
        with tmp.open('wb') as f:
            f.write(await cv_file.read())
        profile_text = parse_cv(tmp)
        result = await build_application_packet(provider, profile_text, job_title, company, job_description, country=country)
        return {'packet_markdown': result.markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
