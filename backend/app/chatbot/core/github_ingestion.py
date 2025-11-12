import requests
from typing import List
from app.chatbot.core.embeddings_service import EmbeddingsService
import numpy as np
import base64
import logging
from dotenv import load_dotenv
import os

# Charger les variables .env
load_dotenv()

GITHUB_USER = os.getenv("GITHUB_USER")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH")  # peut rester vide pour auto-détection

emb_service = EmbeddingsService()
GITHUB_API = "https://api.github.com"

logging.basicConfig(level=logging.INFO)


def get_default_branch(user: str, repo: str, token: str = GITHUB_TOKEN) -> str:
    """Récupère la branche par défaut d'un repo GitHub."""
    headers = {"Authorization": f"token {token}"} if token else {}
    url = f"{GITHUB_API}/repos/{user}/{repo}"
    try:
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        default_branch = resp.json().get("default_branch", "main")
        logging.info(f"Branche par défaut de {user}/{repo}: {default_branch}")
        return default_branch
    except requests.HTTPError as e:
        logging.warning(f"Impossible de récupérer la branche par défaut de {user}/{repo}: {e}")
        return "main"  # fallback


def fetch_github_files(user: str = GITHUB_USER,
                       repo: str = None,
                       branch: str = None,
                       token: str = GITHUB_TOKEN) -> List[str]:
    """Récupère tous les fichiers .md, .py, .txt d'un repo GitHub (y compris privé)."""
    if not repo:
        raise ValueError("Le nom du repo doit être fourni")

    if not branch:
        branch = get_default_branch(user, repo, token)

    headers = {"Authorization": f"token {token}"} if token else {}

    api_url = f"{GITHUB_API}/repos/{user}/{repo}/git/trees/{branch}?recursive=1"
    try:
        r = requests.get(api_url, headers=headers)
        r.raise_for_status()
    except requests.HTTPError as e:
        if r.status_code in [403, 404]:
            logging.warning(f"Repo inaccessible {user}/{repo}: {e}")
            return []  # on continue, repo ignoré
        else:
            raise

    files = r.json().get("tree", [])
    contents = []
    for file in files:
        if file["path"].endswith((".md", ".py", ".txt")) and file["type"] == "blob":
            blob_url = file["url"]
            try:
                blob_resp = requests.get(blob_url, headers=headers)
                blob_resp.raise_for_status()
                content = base64.b64decode(blob_resp.json()["content"]).decode("utf-8")
                contents.append(content)
                logging.info(f"Fichier récupéré : {file['path']}")
            except requests.HTTPError as e:
                logging.warning(f"Impossible de récupérer {file['path']} dans {user}/{repo}: {e}")
    return contents


def vectorize_github_repo(repo: str, user: str = GITHUB_USER,
                          branch: str = None,
                          token: str = GITHUB_TOKEN) -> List[np.ndarray]:
    """Récupère les fichiers GitHub et retourne leurs embeddings."""
    texts = fetch_github_files(user=user, repo=repo, branch=branch, token=token)
    if not texts:
        logging.warning(f"Aucun fichier trouvé dans {user}/{repo}")
        return []

    # Vérifie si create_embeddings existe, sinon fallback sur _compute_embedding
    if hasattr(emb_service, "create_embeddings"):
        embeddings = emb_service.create_embeddings(texts)
    else:
        embeddings = [emb_service._compute_embedding(text) for text in texts]
    logging.info(f"{len(embeddings)} embeddings générés pour {user}/{repo}")
    return embeddings


if __name__ == "__main__":
    repo_name = "nom_du_repo"  # Remplacer par ton repo
    files = fetch_github_files(repo=repo_name)
    print(f"{len(files)} fichiers récupérés")
    vectors = vectorize_github_repo(repo=repo_name)
    print(f"{len(vectors)} embeddings créés")
