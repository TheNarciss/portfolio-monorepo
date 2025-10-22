# backend/app/seed.py

from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import get_db, engine
from app.models import education as education_model, experience as experience_model, project as project_model
from app.crud import education as crud_education, experience as crud_experience, project as crud_project
from app.schemas import education as education_schemas, experience as experience_schemas, project as project_schemas
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data(db: Session):
    # --- Admin user ---
    if not db.query(User).filter(User.email == "clement.gardair@example.com").first():
        admin_user = User(
            email="clement.gardair@example.com",
            hashed_password=pwd_context.hash("Password123!"),
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("Admin user created.")

    # --- Education ---
    educations = [
        education_schemas.EducationCreate(
            degree="Engineering Degree (Master’s level), Generalist Engineering",
            school="E.S.I.L.V.",
            start_date=datetime(2023, 9, 1),
            end_date=datetime(2026, 6, 30),
            description="Machine learning, Artificial intelligence, Data science, Project Management"
        ),
        education_schemas.EducationCreate(
            degree="Master of Science (MSc)",
            school="E.S.I.L.V.",
            start_date=datetime(2024, 9, 1),
            end_date=datetime(2026, 6, 30),
            description="Python, C, C#, C++, React, JS, Docker, Statistics, Probability, HTML, CSS, SQL"
        )
    ]

    for edu in educations:
        crud_education.create_education(db, edu)
    print("Educations seeded.")

    # --- Experience ---
    experiences = [
        experience_schemas.ExperienceCreate(
            title="Full stack developer | A.I.",
            company="A.C.O.S.S.",
            start_date=datetime(2025, 4, 1),
            end_date=datetime(2025, 9, 30),
            description="Développement d'un assistant juridique intelligent avec RAG pipeline. Frontend React/Node.js, Backend FastAPI, PostgreSQL, LLM local, FAISS, PDF extraction."
        ),
        experience_schemas.ExperienceCreate(
            title="Research internship | A.I.",
            company="Imperial College London",
            start_date=datetime(2024, 6, 1),
            end_date=datetime(2024, 9, 30),
            description="Analyse de signaux ECG avec Kernel Mode Decomposition pour extraire des patterns et anomalies cardiaques."
        ),
        experience_schemas.ExperienceCreate(
            title="CDD - Operations & Training",
            company="Creative Commerce & Partners",
            start_date=datetime(2022, 6, 1),
            end_date=datetime(2022, 8, 31),
            description="Gestion des containers, procédures légales, formation Zoom."
        )
    ]

    for exp in experiences:
        crud_experience.create_experience(db, exp)
    print("Experiences seeded.")

    # --- Projects ---
    projects = [
        project_schemas.ProjectCreate(
            title="AI Disease Diagnosis App",
            description="Application d'IA pour assister au diagnostic médical. Python, SQL, SwiftUI.",
            tech_stack="Python, SQL, SwiftUI",
            github_url=None,
            live_url=None,
            image_url=None,
            is_featured=True
        ),
        project_schemas.ProjectCreate(
            title="AI Connect Four",
            description="Application IA pour jouer au Puissance 4. C# et VBA.",
            tech_stack="C#, VBA",
            github_url=None,
            live_url=None,
            image_url=None,
            is_featured=False
        )
    ]   


if __name__ == "__main__":
    from app.db.base import Base
    from app.db.session import engine

    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    seed_data(db)
    db.close()
