from fastapi import APIRouter
from backend.core.router import router as llm_router
from backend.core.settings import settings

router = APIRouter()

@router.get('/providers')
async def providers():
    return {'providers': llm_router.list(), 'default_provider': settings.DEFAULT_PROVIDER}

@router.get('/regions')
async def regions():
    return {
        'default_countries': settings.DEFAULT_COUNTRIES,
        'supported': ['IT', 'DE', 'GB', 'CH'],
        'timezone': settings.DEFAULT_TIMEZONE,
        'locale': settings.DEFAULT_LOCALE,
    }
