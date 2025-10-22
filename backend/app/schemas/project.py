from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    is_featured: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    is_featured: Optional[bool] = None

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}  # ORM compatible
