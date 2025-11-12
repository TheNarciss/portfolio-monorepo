# backend/app/chatbot/schemas/chatbot.py
from pydantic import BaseModel, Field
from typing import Optional, List

class ChatbotQuestion(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="La question posée par l'utilisateur")
    context: Optional[List[str]] = Field(None, description="Contexte supplémentaire à prendre en compte dans la réponse")
    top_k: Optional[int] = Field(5, gt=0, description="Nombre de documents similaires à récupérer")

class ChatbotAnswer(BaseModel):
    answer: str = Field(..., description="Réponse générée par le chatbot")
    source_ids: Optional[List[str]] = Field(None, description="IDs des documents utilisés pour générer la réponse")
    score: Optional[float] = Field(None, description="Score de confiance de la réponse, si disponible")
