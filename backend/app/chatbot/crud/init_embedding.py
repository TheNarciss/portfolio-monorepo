# backend/app/chatbot/core/init_embeddings.py
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.chatbot.core.embeddings_service import EmbeddingsService

# Exemple de documents de départ (on pourra plus tard remplacer par GitHub, PDF, etc.)
INITIAL_DOCS = [
    {"content": "FastAPI est un framework Python pour créer des APIs.", "source": "docs", "reference_id": "doc1"},
    {"content": "SQLAlchemy est un ORM pour Python.", "source": "docs", "reference_id": "doc2"},
    {"content": "FAISS est une librairie pour la recherche vectorielle rapide.", "source": "docs", "reference_id": "doc3"},
]

def init_embeddings():
    db: Session = SessionLocal()
    service = EmbeddingsService(model_name='all-MiniLM-L6-v2')

    for doc in INITIAL_DOCS:
        service.add_embedding(
            db=db,
            text=doc["content"],
            source=doc["source"],
            reference_id=doc["reference_id"]
        )
    db.close()
    print("✅ Embeddings initiaux créés et index FAISS construit.")

if __name__ == "__main__":
    init_embeddings()
