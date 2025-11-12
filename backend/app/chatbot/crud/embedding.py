# backend/app/chatbot/crud/embedding.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime
from app.chatbot.models.embedding import Embedding

# ------------------ CREATE ------------------ #
def create_embedding_record(db: Session, embedding: Embedding) -> Embedding:
    """
    Wrapper pour créer un embedding directement depuis un objet Embedding
    """
    db.add(embedding)
    db.commit()
    db.refresh(embedding)
    return embedding

# ------------------ READ ------------------ #
def get_embedding_by_id(db: Session, embedding_id: str) -> Optional[Embedding]:
    """
    Récupère un embedding via son ID
    """
    return db.query(Embedding).filter(Embedding.id == embedding_id).first()

def get_embeddings_by_source(db: Session, source: str) -> List[Embedding]:
    """
    Récupère tous les embeddings d'une source spécifique
    """
    return db.query(Embedding).filter(Embedding.source == source).all()

def get_all_embeddings(db: Session) -> List[Embedding]:
    """
    Récupère tous les embeddings en BDD
    """
    return db.query(Embedding).all()

# ------------------ UPDATE ------------------ #
def update_embedding(
    db: Session,
    embedding_id: str,
    vector: Optional[list[float]] = None,
    content: Optional[str] = None,
    source: Optional[str] = None,
    reference_id: Optional[str] = None
) -> Optional[Embedding]:
    """
    Met à jour un embedding existant
    """
    embedding = get_embedding_by_id(db, embedding_id)
    if not embedding:
        return None

    if vector is not None:
        embedding.vector = vector
    if content is not None:
        embedding.content = content
    if source is not None:
        embedding.source = source
    if reference_id is not None:
        embedding.reference_id = reference_id

    embedding.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(embedding)
    return embedding

# ------------------ DELETE ------------------ #
def delete_embedding(db: Session, embedding_id: str) -> bool:
    """
    Supprime un embedding par ID
    """
    embedding = get_embedding_by_id(db, embedding_id)
    if not embedding:
        return False
    db.delete(embedding)
    db.commit()
    return True

# ------------------ SEARCH / FILTER ------------------ #
def search_embeddings_by_content(db: Session, query: str, limit: int = 5) -> List[Embedding]:
    """
    Recherche simple par contenu (LIKE) – pour fallback si FAISS pas disponible
    """
    return db.query(Embedding).filter(Embedding.content.ilike(f"%{query}%")).limit(limit).all()
