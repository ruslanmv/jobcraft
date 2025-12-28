from pydantic import BaseModel, Field

class Profile(BaseModel):
    full_name: str | None = None
    email: str | None = None
    location: str | None = None
    desired_roles: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    summary: str | None = None
