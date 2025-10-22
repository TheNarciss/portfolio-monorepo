from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SkillBase(BaseModel):
    name: str
    level: Optional[int] = None
    category: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    category: Optional[str] = None

class SkillRead(SkillBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}  # pour compatibilité ORM
