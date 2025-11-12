# backend/app/chatbot/core/rag_pipeline.py
from typing import List
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import logging

from app.chatbot.crud.embedding import get_all_embeddings

logger = logging.getLogger(__name__)

class RAGPipeline:
    """
    Pipeline RAG complet :
    - Index FAISS local
    - Embeddings avec SentenceTransformers
    - Génération de réponse via LLM (OpenRouter ou autre)
    """

    def __init__(self, db: Session, embedding_model: str = 'all-MiniLM-L6-v2'):
        self.db = db
        self.embedding_model = SentenceTransformer(embedding_model)
        self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        self.embeddings_map = {}  # id -> text
        self._load_embeddings_from_db()

    def _load_embeddings_from_db(self):
        embeddings = get_all_embeddings(self.db)
        for emb in embeddings:
            vector = np.array(emb.vector, dtype='float32').reshape(1, -1)
            self.index.add(vector)
            self.embeddings_map[emb.id] = emb.content
        logger.info(f"FAISS index reconstruit avec {len(self.embeddings_map)} embeddings")

    def _embed(self, text: str) -> np.ndarray:
        vec = self.embedding_model.encode([text])
        return np.array(vec, dtype='float32')

    def search(self, query: str, top_k: int = 5) -> List[str]:
        query_vector = self._embed(query)
        distances, indices = self.index.search(query_vector, top_k)
        results = []
        for idx in indices[0]:
            if idx < len(self.embeddings_map):
                emb_id = list(self.embeddings_map.keys())[idx]
                results.append(self.embeddings_map[emb_id])
        return results

    def ask(self, question: str, top_k: int = 5, llm=None) -> str:
        """
        Renvoie la réponse finale générée par un LLM.
        Si aucun LLM n'est fourni, renvoie juste le contexte + question.
        """
        context_texts = self.search(question, top_k=top_k)
        context = "\n---\n".join(context_texts)
        prompt = f"Voici le contexte:\n{context}\n\nQuestion: {question}"

        if llm:
            # Si c'est un LLM OpenRouter, transformer le prompt en message chat
            if hasattr(llm, "generate"):
                messages = [{"role": "user", "content": prompt}]
                return llm.generate(messages)
            else:
                raise ValueError("LLM fourni doit avoir une méthode `.generate(messages: List[Dict])`")
        else:
            # fallback : juste renvoyer le prompt brut
            return prompt

