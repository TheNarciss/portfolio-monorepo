# backend/app/models/skill.py

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid
from app.db.base import Base 

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    level = Column(Integer, nullable=True)  # Niveau de 1 à 5 par exemple
    category = Column(String, nullable=True)  # ex: "Programming", "Framework", "Tool"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
