# app/schemas/contact.py
from pydantic import BaseModel, EmailStr

# Pour la création d'un contact
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

# Pour la lecture d'un contact (réponse)
class Contact(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str

    class Config:
        from_attributes = True  # équivalent de orm_mode en Pydantic v1
