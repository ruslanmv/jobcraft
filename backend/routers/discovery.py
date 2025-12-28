from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from backend.core.safety import parse_countries
from backend.core.settings import settings
from backend.services.connectors.greenhouse import list_jobs as gh_list
from backend.services.connectors.lever import list_jobs as lever_list
from backend.services.job_discovery import to_jobposting_from_greenhouse, to_jobposting_from_lever

router = APIRouter(prefix='/discover', tags=['discovery'])

@router.get('/greenhouse/{board_token}')
async def greenhouse(board_token: str, countries: str = Query(default=settings.DEFAULT_COUNTRIES)):
    try:
        jobs = await gh_list(board_token)
        out = [to_jobposting_from_greenhouse(j).model_dump() for j in jobs]
        wanted = set(parse_countries(countries))
        if wanted:
            filtered = []
            for jp in out:
                loc = (jp.get('location') or '').upper()
                if any(c in loc for c in wanted) or not loc:
                    filtered.append(jp)
            out = filtered
        return {'jobs': out[:100]}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get('/lever/{company}')
async def lever(company: str, countries: str = Query(default=settings.DEFAULT_COUNTRIES)):
    try:
        jobs = await lever_list(company)
        out = [to_jobposting_from_lever(j, company).model_dump() for j in jobs]
        wanted = set(parse_countries(countries))
        if wanted:
            filtered = []
            for jp in out:
                loc = (jp.get('location') or '').upper()
                if any(c in loc for c in wanted) or not loc:
                    filtered.append(jp)
            out = filtered
        return {'jobs': out[:100]}
    except Exception as e:
        raise HTTPException(500, str(e))
