from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import experience as crud_exp
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate
from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=ExperienceRead)
def create_experience(exp: ExperienceCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud_exp.create_experience(db, exp)

@router.get("/", response_model=List[ExperienceRead])
def read_experiences(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_exp.get_experiences(db, skip=skip, limit=limit)

@router.get("/{exp_id}", response_model=ExperienceRead)
def read_experience(exp_id: str, db: Session = Depends(get_db)):
    db_exp = crud_exp.get_experience(db, exp_id)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp

@router.put("/{exp_id}", response_model=ExperienceRead)
def update_experience(exp_id: str, exp: ExperienceUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_exp = crud_exp.update_experience(db, exp_id, exp)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp

@router.delete("/{exp_id}", response_model=ExperienceRead)
def delete_experience(exp_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_exp = crud_exp.delete_experience(db, exp_id)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp
