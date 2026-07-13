from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.song import Song
from app.schemas.song import SongCreate, SongResponse


router = APIRouter(
    prefix="/songs",
    tags=["songs"]
)

@router.post("/", response_model=SongResponse, status_code=status.HTTP_201_CREATED)
def create_song(song: SongCreate, db: Session = Depends(get_db)):
    new_song = Song(**song.model_dump())
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song
    
