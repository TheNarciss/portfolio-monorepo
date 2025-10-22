from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import education as crud_edu
from app.schemas.education import EducationCreate, EducationRead, EducationUpdate
from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.post("/", response_model=EducationRead)
def create_education(edu: EducationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud_edu.create_education(db, edu)



@router.get("/", response_model=List[EducationRead])
def read_educations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_edu.get_educations(db, skip=skip, limit=limit)


@router.get("/{edu_id}", response_model=EducationRead)
def read_education(edu_id: str, db: Session = Depends(get_db)):
    db_edu = crud_edu.get_education(db, edu_id)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu



@router.put("/{edu_id}", response_model=EducationRead)
def update_education(edu_id: str, edu: EducationUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_edu = crud_edu.update_education(db, edu_id, edu)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu



@router.delete("/{edu_id}", response_model=EducationRead)
def delete_education(edu_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_edu = crud_edu.delete_education(db, edu_id)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu
