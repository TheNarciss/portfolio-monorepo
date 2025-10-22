# backend/app/schemas/user.py



from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: str
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = {
        "from_attributes": True  # Active la compatibilité ORM
    }
