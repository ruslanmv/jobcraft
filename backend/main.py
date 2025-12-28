from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.health import router as health_router
from backend.routers.meta import router as meta_router
from backend.routers.ollabridge_connect import router as ollabridge_router
from backend.routers.jobcraft import router as jobcraft_router
from backend.routers.discovery import router as discovery_router
from backend.routers.tracker import router as tracker_router
from backend.routers.digest import router as digest_router
from backend.routers.assist import router as assist_router
from backend.core.db import init_db

app = FastAPI(title='JobCraft Copilot API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
def _startup():
    init_db()

app.include_router(health_router)
app.include_router(meta_router, prefix='/api')
app.include_router(ollabridge_router, prefix='/api')
app.include_router(jobcraft_router, prefix='/api')
app.include_router(discovery_router, prefix='/api')
app.include_router(tracker_router, prefix='/api')
app.include_router(digest_router, prefix='/api')
app.include_router(assist_router, prefix='/api')

def start():
    import uvicorn
    uvicorn.run('backend.main:app', host='0.0.0.0', port=8000, reload=True)
