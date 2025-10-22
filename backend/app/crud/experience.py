from sqlalchemy.orm import Session
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate

def create_experience(db: Session, exp: ExperienceCreate) -> Experience:
    db_exp = Experience(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

def get_experiences(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Experience).offset(skip).limit(limit).all()

def get_experience(db: Session, exp_id: str):
    return db.query(Experience).filter(Experience.id == exp_id).first()

def update_experience(db: Session, exp_id: str, exp_update: ExperienceUpdate):
    db_exp = get_experience(db, exp_id)
    if not db_exp:
        return None
    for key, value in exp_update.dict(exclude_unset=True).items():
        setattr(db_exp, key, value)
    db.commit()
    db.refresh(db_exp)
    return db_exp

def delete_experience(db: Session, exp_id: str):
    db_exp = get_experience(db, exp_id)
    if not db_exp:
        return None
    db.delete(db_exp)
    db.commit()
    return db_exp
