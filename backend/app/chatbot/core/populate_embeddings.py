# backend/app/chatbot/core/populate_embeddings.py

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.chatbot.core.embeddings_service import EmbeddingsService
from app.models.education import Education
from app.models.experience import Experience
from app.models.project import Project
from app.models.skill import Skill

def ingest_existing_data(db: Session, embeddings_service: EmbeddingsService):
    # EDUCATIONS
    educations = db.query(Education).all()
    for edu in educations:
        text = f"{edu.degree} at {edu.school} ({edu.start_date} - {edu.end_date}) {edu.description or ''}"
        embeddings_service.add_embedding(db, text, source="education", reference_id=edu.id)

    # EXPERIENCES
    experiences = db.query(Experience).all()
    for exp in experiences:
        text = f"{exp.title} at {exp.company} ({exp.start_date} - {exp.end_date}) {exp.description or ''}"
        embeddings_service.add_embedding(db, text, source="experience", reference_id=exp.id)

    # PROJECTS
    projects = db.query(Project).all()
    for proj in projects:
        text = f"{proj.title}: {proj.description or ''}. Tech stack: {proj.tech_stack or ''}"
        embeddings_service.add_embedding(db, text, source="project", reference_id=str(proj.id))

    # SKILLS
    skills = db.query(Skill).all()
    for skill in skills:
        text = f"{skill.name}, level {skill.level or 'N/A'}, category: {skill.category or 'N/A'}"
        embeddings_service.add_embedding(db, text, source="skill", reference_id=skill.id)

def main():
    db = SessionLocal()
    embeddings_service = EmbeddingsService(model_name="all-MiniLM-L6-v2")

    print("🚀 Ingestion des données existantes dans le RAG...")
    ingest_existing_data(db, embeddings_service)

    # Facultatif : sauvegarde de l'index FAISS
    embeddings_service.index.save_index = getattr(embeddings_service.index, "save_index", None)
    print("✅ Ingestion terminée.")

if __name__ == "__main__":
    main()
