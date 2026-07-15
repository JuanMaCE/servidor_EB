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

@router.get("/", response_model=List[SongResponse], status_code=status.HTTP_200_OK)
def get_songs(skip: int = 0, limit: int = 10, db):
    songs = db.query(Song).offset(skip).limit(limit).all()
    return songs

@router.get("/{song_id}", response_model=SongResponse, status_code=status.HTTP_200_OK)
def get_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return song


@router.put("/{song_id}", response_model=SongResponse, status_code=status.HTTP_200_OK)
def update_song(song_id: int, song_update: SongCreate, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song-id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    for key, value in song_update.model_dump().items():
        setattr(song, key, value)
    
    db.commit()
    db.refresh(song)
    return song


@router.delete("/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    db.delete(song)
    db.commit()
    return None 

    
