from __future__ import annotations

from sqlmodel import SQLModel, Session, create_engine
from backend.core.settings import settings

def get_database_url() -> str:
    if settings.DATABASE_URL:
        return settings.DATABASE_URL
    return f"sqlite:///{settings.DATA_DIR / 'jobcraft.sqlite'}"

engine = create_engine(get_database_url(), echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

def session():
    return Session(engine)
