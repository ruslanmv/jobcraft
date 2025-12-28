from __future__ import annotations
from backend.app.schemas.job import JobPosting

def to_jobposting_from_greenhouse(j: dict) -> JobPosting:
    loc = (j.get('location') or {}).get('name')
    return JobPosting(
        id=str(j.get('id')),
        title=j.get('title', ''),
        company=j.get('company', ''),
        location=loc,
        url=j.get('absolute_url') or j.get('url') or '',
        description=None,
        source='greenhouse',
        posted_at=j.get('updated_at') or j.get('created_at'),
        country=None,
        remote=None,
    )

def to_jobposting_from_lever(j: dict, company: str) -> JobPosting:
    loc = (j.get('categories') or {}).get('location')
    return JobPosting(
        id=j.get('id') or j.get('text') or j.get('hostedUrl') or j.get('applyUrl') or 'lever',
        title=j.get('text', ''),
        company=company,
        location=loc,
        url=j.get('hostedUrl') or j.get('applyUrl') or '',
        description=j.get('descriptionPlain') or None,
        source='lever',
        posted_at=j.get('createdAt') and str(j.get('createdAt')),
        country=None,
        remote=None,
    )
