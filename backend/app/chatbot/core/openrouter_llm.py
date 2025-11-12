# backend/app/chatbot/core/openrouter_llm.py
import requests
import json
import logging
from typing import List, Dict, Optional
import os
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


logger = logging.getLogger(__name__)

class OpenRouterLLM:
    """
    Wrapper simple pour utiliser l'API OpenRouter
    """
    def __init__(self, api_key: str = OPENROUTER_API_KEY, model: str = "openai/gpt-4o"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    def generate(self, messages: List[Dict[str, str]]) -> str:
        """
        messages = [{"role": "user", "content": "Question ici"}]
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
       

        payload = {
            "model": self.model,
            "messages": messages
        }

        try:
            response = requests.post(self.base_url, headers=headers, data=json.dumps(payload), timeout=15)
            response.raise_for_status()
            data = response.json()
            # Récupération du texte généré
            return data["choices"][0]["message"]["content"]
        except requests.RequestException as e:
            logger.error(f"Erreur OpenRouter LLM: {e}")
            raise RuntimeError("Impossible de générer la réponse via OpenRouter") from e
