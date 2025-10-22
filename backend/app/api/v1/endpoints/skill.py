from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import skill as crud_skill
from app.schemas.skill import SkillCreate, SkillRead, SkillUpdate
from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=SkillRead)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_skill.create_skill(db, skill)

@router.get("/", response_model=List[SkillRead])
def read_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_skill.get_skills(db=db, skip=skip, limit=limit)

@router.get("/{skill_id}", response_model=SkillRead)
def read_skill(skill_id: str, db: Session = Depends(get_db)):
    db_skill = crud_skill.get_skill(db, skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.put("/{skill_id}", response_model=SkillRead)
def update_skill(skill_id: str, skill: SkillUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_skill = crud_skill.update_skill(db, skill_id, skill)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.delete("/{skill_id}", response_model=SkillRead)
def delete_skill(skill_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_skill = crud_skill.delete_skill(db, skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill
