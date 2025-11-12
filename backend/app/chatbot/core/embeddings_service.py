# backend/app/chatbot/core/embeddings_service.py
import logging
from typing import List, Optional
from datetime import datetime
import numpy as np
from sqlalchemy.orm import Session

from sentence_transformers import SentenceTransformer

from app.chatbot.models.embedding import Embedding
from app.chatbot.crud.embedding import create_embedding_record  # nouveau wrapper

import faiss

logger = logging.getLogger(__name__)

class EmbeddingsService:
    """
    Service pour créer et gérer des embeddings :
    - Création via SentenceTransformers
    - Stockage en BDD
    - Indexation dans FAISS pour recherche rapide
    """
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        self.embeddings_map = {}  # mapping id -> vector

    def _compute_embedding(self, text: str) -> List[float]:
        """Génère un embedding localement via SentenceTransformers"""
        vector = self.model.encode([text])[0]
        return vector.tolist()

    def add_embedding(
        self,
        db: Session,
        text: str,
        source: str,
        reference_id: Optional[str] = None
    ) -> str:
        """Génère un embedding, le stocke en BDD et dans FAISS"""
        vector = self._compute_embedding(text)
        embedding_id = reference_id or str(datetime.utcnow().timestamp()).replace('.', '')

        # Stockage en BDD via le wrapper
        embedding_record = Embedding(
            id=embedding_id,
            vector=vector,
            content=text,
            source=source,
            reference_id=reference_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        create_embedding_record(db, embedding_record)  # <- corrige l'appel

        # Ajout à FAISS
        vector_np = np.array([vector], dtype='float32')
        self.index.add(vector_np)
        self.embeddings_map[embedding_id] = vector_np

        logger.info(f"Embedding ajouté: {embedding_id} source={source}")
        return embedding_id

    def search(self, query: str, top_k: int = 5) -> List[str]:
        """Recherche les embeddings les plus proches dans FAISS et retourne leurs ids"""
        query_vector = np.array([self._compute_embedding(query)], dtype='float32')
        distances, indices = self.index.search(query_vector, top_k)
        results = []
        for idx in indices[0]:
            if idx < len(self.embeddings_map):
                emb_id = list(self.embeddings_map.keys())[idx]
                results.append(emb_id)
        return results

    def build_index_from_db(self, db: Session):
        """Reconstruit l'index FAISS à partir de la BDD (utile au démarrage)"""
        embeddings = db.query(Embedding).all()
        for emb in embeddings:
            vector_np = np.array([emb.vector], dtype='float32')
            self.index.add(vector_np)
            self.embeddings_map[emb.id] = vector_np
        logger.info(f"Index FAISS reconstruit avec {len(embeddings)} embeddings")
