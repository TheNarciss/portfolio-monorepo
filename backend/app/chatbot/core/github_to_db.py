import os
import requests
from sqlalchemy.orm import Session
from app.chatbot.core.github_ingestion import fetch_github_files, vectorize_github_repo
from app.chatbot.models.embedding import Embedding
from app.chatbot.crud.embedding import create_embedding_record
from app.db.session import SessionLocal
from dotenv import load_dotenv
import numpy as np
import logging

load_dotenv()

GITHUB_USER = os.getenv("GITHUB_USER2")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN2")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH")

GITHUB_API = "https://api.github.com"

# Liste des repos à ignorer
REPOS_IGNORE = ["CreaScore"]

logging.basicConfig(level=logging.INFO)


def list_user_repos(user: str = GITHUB_USER, token: str = GITHUB_TOKEN) -> list[str]:
    """Récupère tous les repos d'un utilisateur (publics et privés)."""
    headers = {"Authorization": f"token {token}"} if token else {}

    repos = []
    page = 1
    per_page = 100
    while True:
        url = f"{GITHUB_API}/user/repos?per_page={per_page}&page={page}"
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        for repo in data:
            repos.append(repo["name"])
        page += 1
    logging.info(f"{len(repos)} repos trouvés pour {user}")
    return repos


def ingest_github_repo(repo_name: str, user: str = GITHUB_USER):
    """Récupère tous les fichiers du repo et les insère dans la BDD."""
    if repo_name in REPOS_IGNORE:
        logging.info(f"🚫 Ignoré le repo {repo_name}")
        return

    db: Session = SessionLocal()
    contents = fetch_github_files(user=user, repo=repo_name, token=GITHUB_TOKEN)
    if not contents:
        logging.warning(f"Aucun fichier trouvé ou repo inaccessible: {user}/{repo_name}")
        db.close()
        return

    embeddings = vectorize_github_repo(user=user, repo=repo_name, token=GITHUB_TOKEN)
    for content, vector in zip(contents, embeddings):
        emb_record = Embedding(
            vector=vector.tolist() if isinstance(vector, np.ndarray) else vector,
            content=content,
            source="github",
            reference_id=f"{user}/{repo_name}"
        )
        create_embedding_record(db, emb_record)

    db.close()
    logging.info(f"✅ {len(contents)} fichiers de {user}/{repo_name} ingérés dans la BDD")


def ingest_all_repos(user: str = GITHUB_USER):
    """Récupère tous les repos GitHub de l'utilisateur et les insère dans la BDD."""
    repos = list_user_repos(user=user)
    for repo_name in repos:
        logging.info(f"➡️  Ingestion du repo {repo_name}")
        try:
            ingest_github_repo(repo_name, user=user)
        except Exception as e:
            logging.error(f"Erreur sur le repo {repo_name}: {e}")


if __name__ == "__main__":
    ingest_all_repos()
