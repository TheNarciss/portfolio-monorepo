# backend/app/db/base.py

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from .session import engine

Base = declarative_base()

def init_db():
    """
    Crée toutes les tables définies dans les modèles.
    """
    # Importer TOUTES les tables ici
    from ..models import user, project, contact, education, experience, skill
    from ..chatbot.models import embedding  # Nouveau modèle Embedding

    Base.metadata.create_all(bind=engine)