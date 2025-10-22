from sqlalchemy.orm import Session
from app.models.education import Education
from app.schemas.education import EducationCreate, EducationUpdate

def create_education(db: Session, edu: EducationCreate) -> Education:
    db_edu = Education(**edu.dict())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

def get_educations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Education).offset(skip).limit(limit).all()

def get_education(db: Session, edu_id: str):
    return db.query(Education).filter(Education.id == edu_id).first()

def update_education(db: Session, edu_id: str, edu_update: EducationUpdate):
    db_edu = get_education(db, edu_id)
    if not db_edu:
        return None
    for key, value in edu_update.dict(exclude_unset=True).items():
        setattr(db_edu, key, value)
    db.commit()
    db.refresh(db_edu)
    return db_edu

def delete_education(db: Session, edu_id: str):
    db_edu = get_education(db, edu_id)
    if not db_edu:
        return None
    db.delete(db_edu)
    db.commit()
    return db_edu
