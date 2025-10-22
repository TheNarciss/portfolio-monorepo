from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/portfolio_db")

engine = create_engine(
    DATABASE_URL,
    echo=True,  # affiche les requêtes SQL (pratique en dev)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency pour FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
