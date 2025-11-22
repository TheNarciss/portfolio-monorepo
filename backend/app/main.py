# backend/app/main.py


from fastapi import FastAPI
from app.api.v1.endpoints import contact, projects, auth, education, experience, skill
from app.chatbot.api import router as chatbot_router
from fastapi.middleware.cors import CORSMiddleware
from app.chatbot.api.router import router as chatbot_router


from app.db.base import init_db
import logging



app = FastAPI(title="Portfolio API")

# CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ton frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(contact.router, prefix="/api/v1/contact", tags=["contact"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(education.router, prefix="/api/v1/education", tags=["education"])
app.include_router(experience.router, prefix="/api/v1/experience", tags=["experience"])
app.include_router(skill.router, prefix="/api/v1/skill", tags=["skill"])
app.include_router(chatbot_router, prefix="/api/v1/chatbot", tags=["chatbot"])
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)