# backend/app/models/education.py

from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime
import uuid
from app.db.base import Base 

class Education(Base):
    __tablename__ = "educations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    degree = Column(String, nullable=False)  # ex: MSc in Engineering
    school = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
