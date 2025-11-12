import faiss
import numpy as np
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.chatbot.models.embedding import Embedding

logger = logging.getLogger(__name__)

class FAISSIndex:
    def __init__(self, embedding_dim: Optional[int] = None, index_path: Optional[str] = None):
        """
        Gestion d'un index FAISS avec persistance optionnelle.
        """
        self.embedding_dim = embedding_dim
        if self.embedding_dim is None:
            raise ValueError("embedding_dim doit être fourni pour initialiser FAISSIndex")
        
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        self.index_path = index_path
        self.embeddings_map: dict[str, np.ndarray] = {}

        if index_path:
            self.load_index()

    def add_vector(self, emb_id: str, vector: List[float]):
        vector_np = np.array([vector], dtype="float32")
        self.index.add(vector_np)
        self.embeddings_map[emb_id] = vector_np
        logger.debug(f"Vector ajouté à FAISS: {emb_id}")

    def search(self, query_vector: List[float], top_k: int = 5) -> List[str]:
        if self.index.ntotal == 0:
            logger.warning("Index FAISS vide")
            return []

        query_np = np.array([query_vector], dtype="float32")
        distances, indices = self.index.search(query_np, top_k)
        all_keys = list(self.embeddings_map.keys())
        results = []
        for idx in indices[0]:
            if idx < len(all_keys):
                results.append(all_keys[idx])
        return results

    def build_index_from_db(self, db: Session):
        embeddings = db.query(Embedding).all()
        for emb in embeddings:
            self.add_vector(emb.id, emb.vector)
        logger.info(f"Index FAISS reconstruit avec {len(embeddings)} embeddings")

    def save_index(self):
        if self.index_path:
            faiss.write_index(self.index, self.index_path)
            logger.info(f"Index FAISS sauvegardé sur {self.index_path}")

    def load_index(self):
        try:
            self.index = faiss.read_index(self.index_path)
            logger.info(f"Index FAISS chargé depuis {self.index_path}")
        except Exception:
            logger.warning(f"Impossible de charger l'index depuis {self.index_path}, création d'un index vide")
            self.index = faiss.IndexFlatL2(self.embedding_dim)
