# backend/app/chatbot/models/embedding.py
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import ARRAY, FLOAT
from datetime import datetime
import uuid
from app.db.base import Base

class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vector = Column(ARRAY(FLOAT), nullable=False, index=True)  # index pour accélérer la recherche
    content = Column(Text, nullable=False)
    source = Column(String, nullable=False)  # ex: 'github', 'bdd', 'pdf'
    reference_id = Column(String, nullable=True)  # pour relier à un id externe si besoin
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Embedding id={self.id} source={self.source} content_len={len(self.content)}>"

