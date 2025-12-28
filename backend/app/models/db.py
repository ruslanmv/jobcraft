from __future__ import annotations

from datetime import datetime
from sqlmodel import SQLModel, Field

class JobRecord(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str
    company: str
    url: str
    location: str | None = None
    country: str | None = None
    source: str | None = None
    posted_at: str | None = None

    score: int | None = None
    status: str = 'discovered'  # discovered|shortlisted|packet_ready|submitted_user_confirmed|rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
