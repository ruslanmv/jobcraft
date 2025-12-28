from pydantic import BaseModel

class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    location: str | None = None
    remote: bool | None = None
    url: str
    description: str | None = None
    source: str | None = None
    posted_at: str | None = None
    country: str | None = None
