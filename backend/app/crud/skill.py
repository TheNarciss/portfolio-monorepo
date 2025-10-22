from sqlalchemy.orm import Session
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate

def create_skill(db: Session, skill: SkillCreate) -> Skill:
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def get_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Skill).offset(skip).limit(limit).all()

def get_skill(db: Session, skill_id: str):
    return db.query(Skill).filter(Skill.id == skill_id).first()

def update_skill(db: Session, skill_id: str, skill_update: SkillUpdate):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return None
    for key, value in skill_update.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: str):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return None
    db.delete(db_skill)
    db.commit()
    return db_skill
