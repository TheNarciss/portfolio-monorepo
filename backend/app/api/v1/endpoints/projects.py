# backend/app/api/v1/endpoints/projects.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectRead
from app.crud import project as crud_project
from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud_project.create_project(db, project)

@router.get("/", response_model=List[ProjectRead])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_project.get_projects(db=db, skip=skip, limit=limit)

@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.put("/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_project = crud_project.update_project(db, project_id, project)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.delete("/{project_id}", response_model=ProjectRead)
def delete_project(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_project = crud_project.delete_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project
