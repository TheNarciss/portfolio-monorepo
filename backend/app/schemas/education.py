from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EducationBase(BaseModel):
    degree: str
    school: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    school: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None

class EducationRead(EducationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
