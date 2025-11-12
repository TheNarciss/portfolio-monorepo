# backend/app/seed.py

from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import get_db, engine
from app.models import education as education_model, experience as experience_model, project as project_model, skill as skill_model
from app.crud import education as crud_education, experience as crud_experience, project as crud_project, skill as crud_skill
from app.schemas import education as education_schemas, experience as experience_schemas, project as project_schemas, skill as skill_schemas
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

    # --- Skills ---
    skills = [
        "Python", "C", "C#", "C++", "React", "JavaScript", "Docker",
        "SQL", "HTML", "CSS", "Statistics", "Probability",
        "Machine Learning", "Artificial Intelligence", "Data Science",
        "Project Management"
    ]
    for s in skills:
        if not db.query(skill_model.Skill).filter(skill_model.Skill.name == s).first():
            crud_skill.create_skill(db, skill_schemas.SkillCreate(name=s, level=5, category="Technical"))
    print("Skills seeded.")

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

    # --- Experiences ---
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
        ),
        experience_schemas.ExperienceCreate(
            title="Student Research Assistant | Prototyping",
            company="Imperial College / E.S.I.L.V.",
            start_date=datetime(2024, 6, 1),
            end_date=datetime(2024, 9, 30),
            description="Prototyping with 3D printing and SolidWorks for testing purposes. Collaboration on thesis project automating welding of plastic sheets."
        )
    ]
    for exp in experiences:
        crud_experience.create_experience(db, exp)
    print("Experiences seeded.")

    # --- Projects ---
    projects = [
        project_schemas.ProjectCreate(
            title="AI Disease Diagnosis App",
            description="AI-powered application to assist medical diagnosis using Python, SQL, SwiftUI.",
            tech_stack="Python, SQL, SwiftUI",
            github_url=None,
            live_url=None,
            image_url=None,
            is_featured=True
        ),
        project_schemas.ProjectCreate(
            title="AI Connect Four",
            description="AI-powered Connect Four game using C# and VBA.",
            tech_stack="C#, VBA",
            github_url=None,
            live_url=None,
            image_url=None,
            is_featured=False
        )
    ]
    for proj in projects:
        crud_project.create_project(db, proj)
    print("Projects seeded.")

if __name__ == "__main__":
    from app.db.base import Base
    from app.db.session import engine
    from sqlalchemy.orm import Session

    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    seed_data(db)
    db.close()
