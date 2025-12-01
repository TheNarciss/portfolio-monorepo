# backend/app/chatbot/api/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
import requests
import os

from app.db.session import get_db
from app.chatbot.core.rag_pipeline import RAGPipeline
from app.chatbot.schemas.chatbot import ChatbotQuestion, ChatbotAnswer

logger = logging.getLogger(__name__)
router = APIRouter()

# Clé API et paramètres OpenRouter
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "x-ai/grok-4.1-fast:free"  # modèle gratuit compatible chat



class OpenRouterLLM:
    """
    Petit wrapper pour appeler OpenRouter en mode chat-compatible.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate(self, messages):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "extra_headers": {
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "MonPortfolio"
            }
        }

        try:
            response = requests.post(
                OPENROUTER_BASE_URL,
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except requests.RequestException as e:
            logger.error(f"Erreur OpenRouter: {e}")
            raise HTTPException(status_code=500, detail="Erreur lors de l'appel à OpenRouter")


@router.post("/ask", response_model=ChatbotAnswer)
def ask_question(payload: ChatbotQuestion, db: Session = Depends(get_db)):
    """
    Endpoint principal : question -> RAG -> LLM (OpenRouter)
    """
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="Clé API OpenRouter manquante")

    # Initialiser le pipeline et le LLM
    rag = RAGPipeline(db=db)
    llm = OpenRouterLLM(api_key=OPENROUTER_API_KEY)

    # Préparer la question pour le LLM
    messages = [{"role": "user", "content": payload.question}]

    # Générer la réponse
    try:
        answer_text = rag.ask(payload.question, top_k=5, llm=llm)
        return ChatbotAnswer(answer=answer_text)
    except Exception as e:
        logger.error(f"Erreur RAGPipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))
