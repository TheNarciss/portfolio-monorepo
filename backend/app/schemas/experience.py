from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExperienceBase(BaseModel):
    title: str
    company: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None

class ExperienceRead(ExperienceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
