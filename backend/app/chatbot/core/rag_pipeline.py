# backend/app/chatbot/core/rag_pipeline.py
from typing import List
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import logging
import re

from app.chatbot.crud.embedding import get_all_embeddings

logger = logging.getLogger(__name__)

# Sources prioritaires pour le boost
PRIORITY_SOURCES = {"skill", "project", "experience", "education"}

# Catégorisation automatique
CATEGORY_KEYWORDS = {
    "education": [
        r"école", r"dipl[oô]me", r"formation", r"université", r"lycée",
        r"master", r"licence", r"bts", r"études", r"bac"
    ],
    "experience": [
        r"expérience", r"travail", r"poste", r"job", r"stage", r"alternance"
    ],
    "project": [
        r"projet", r"github", r"repo", r"application", r"app", r"site web"
    ],
    "skill": [
        r"compétence", r"skill", r"stack", r"techno", r"langage", r"framework"
    ],
    "identity": [
        r"qui est", r"présente", r"profil", r"clement gardair"
    ]
}


def detect_category(query: str) -> List[str]:
    """
    Détecte automatiquement les catégories pertinentes.
    Combine intelligemment identity + autre catégorie.
    """
    query = query.lower()
    matched = []

    for category, patterns in CATEGORY_KEYWORDS.items():
        for pat in patterns:
            if re.search(pat, query):
                matched.append(category)
                break

    # Si rien détecté → catégorie générale
    if not matched:
        return ["irrelevant"]

    # Si seulement 'identity' → on NE FILTRE PAS
    if matched == ["identity"]:
        logger.info("🎯 Identity seule détectée → aucun filtrage de source")
        return ["irrelevant"]  # => pas de filtre

    # Si identity + autres catégories → on retire identity
    if "identity" in matched and len(matched) > 1:
        matched = [c for c in matched if c != "identity"]

    return matched


class RAGPipeline:
    """
    Pipeline RAG optimisé avec :
    - détection automatique de catégorie
    - filtrage de embeddings par catégorie
    - boost des sources importantes
    """

    def __init__(self, db: Session, embedding_model: str = 'all-MiniLM-L6-v2'):
        self.db = db
        self.embedding_model = SentenceTransformer(embedding_model)
        self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatL2(self.embedding_dim)

        # Map ID → {content, source}
        self.embeddings_map = {}
        self.id_list = []

        self._load_embeddings_from_db()

    def _load_embeddings_from_db(self):
        embeddings = get_all_embeddings(self.db)

        for emb in embeddings:
            vector = np.array(emb.vector, dtype='float32').reshape(1, -1)
            self.index.add(vector)

            self.embeddings_map[emb.id] = {
                "content": emb.content,
                "source": emb.source,
            }
            self.id_list.append(emb.id)

        logger.info(f"FAISS index reconstruit avec {len(self.embeddings_map)} embeddings")

    def _embed(self, text: str) -> np.ndarray:
        vec = self.embedding_model.encode([text])
        return np.array(vec, dtype='float32')

    def search(self, query: str, top_k: int = 5) -> List[str]:
        """
        Recherche avec :
        - Détection de catégorie
        - Filtrage par catégorie
        - Boost des sources importantes
        """
        categories = detect_category(query)
        query_vector = self._embed(query)

        distances, indices = self.index.search(query_vector, top_k * 6)

        logger.info(f"🔍 [RAG SEARCH] Query = {query}")
        logger.info(f"Indices FAISS bruts : {indices[0]}")
        logger.info(f"Distances FAISS : {distances[0]}")

        scored_results = []

        for faiss_idx, dist in zip(indices[0], distances[0]):
            if faiss_idx >= len(self.id_list):
                continue

            emb_id = self.id_list[faiss_idx]
            info = self.embeddings_map[emb_id]

            content = info["content"]
            source = info["source"]
            original_dist = float(dist)

            # ❌ Filtrer par catégorie détectée
            if "irrelevant" not in categories:
                if source not in categories:
                    continue  # 🔥 on skip tout ce qui ne correspond pas

            # BOOST sources prioritaires
            boosted = False
            if source in PRIORITY_SOURCES:
                dist *= 0.4
                boosted = True

            scored_results.append((dist, content, source, original_dist, boosted))

            logger.info(
                f" - Embedding ID={emb_id}, src='{source}', "
                f"dist={original_dist:.4f} → {dist:.4f}, boosted={boosted}"
            )

        # Tri final
        scored_results.sort(key=lambda x: x[0])

        logger.info("📊 Classement final :")
        for rank, (dist, content, source, original, boosted) in enumerate(scored_results[:top_k], 1):
            logger.info(
                f" #{rank} | source={source} | dist={dist:.4f} | orig={original:.4f} | boosted={boosted}"
            )

        return [content for dist, content, src, orig, boosted in scored_results[:top_k]]

    def ask(self, question: str, top_k: int = 15, llm=None) -> str:
        """
        Génère la réponse finale avec le contexte filtré.
        """
        context_texts = self.search(question, top_k=top_k)
        context = "\n---\n".join(context_texts)

        prompt = f"""
Tu es un assistant spécialisé dans la connaissance du profil professionnel de **Clément Gardair**.
Ta mission est de répondre aux questions avec exactitude en utilisant **uniquement le contexte fourni**.
Tu génères des réponses fiables, structurées, concises et factuelles.

🎯 RÈGLES IMPORTANTES :
- Tu ne dois **jamais inventer** une information qui n'apparaît pas dans le contexte.
- Si une information manque, tu dis explicitement : *"Cette information n’apparaît pas dans les données fournies."*
- Le contexte provient de : mon CV, mes expériences, mes projets GitHub, mes compétences et mes formations.
- Si la question est technique : fournis un exemple de code **court, fonctionnel et pertinent** (mais jamais inventé si absent du contexte).
- Si la question concerne mon identité, parcours ou valeurs personnelles : reste strictement factuel selon les données disponibles.
- Si le contexte est vide : donne une réponse courte expliquant l'absence d'informations.

🧩 CONTEXTE RAG (extraits de mon CV / projets / expériences) :
{context}

❓ QUESTION :
{question}

💬 RÉPONSE DE L’ASSISTANT :
"""

        logger.info("🧠 Prompt envoyé au LLM :")
        logger.info(prompt)

        if llm:
            if hasattr(llm, "generate"):
                return llm.generate([{"role": "user", "content": prompt}])
            raise ValueError("Le LLM doit posséder une méthode `.generate(messages)`")

        return prompt
