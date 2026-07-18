from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.artist import Artist
from app.schemas.artist import ArtistCreate, ArtistResponse


router = APIRouter(
    prefix="/artists",
    tags=["artists"]
)


@router.post("/", response_model=ArtistResponse, status_code=status.HTTP_201_CREATED)
def create_artist(artist: ArtistCreate, db: Session = Depends(get_db)):
    new_artist = Artist(**artist.model_dump())
    db.add(new_artist)
    db.commit()
    db.refresh(new_artist)
    return new_artist


@router.get("/", response_model=List[ArtistResponse], status_code=status.HTTP_200_OK)
def get_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    artists = db.query(Artist).offset(skip).limit(limit).all()
    return artists


@router.get("/{artist_id}", response_model=ArtistResponse, status_code=status.HTTP_200_OK)
def get_artist(artist_id: int, db: Session = Depends(get_db)):
    artist = db.query(Artist).filter(Artist.id == artist_id).first()
    if not artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artist not found")
    return artist


@router.put("/{artist_id}", response_model=ArtistResponse, status_code=status.HTTP_200_OK)
def update_artist(artist_id: int, artist: ArtistCreate, db: Session = Depends(get_db)):
    db_artist = db.query(Artist).filter(Artist.id == artist_id).first()
    if not db_artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artist not found")
    for key, value in artist.model_dump().items():
        setattr(db_artist, key, value)
    db.commit()
    db.refresh(db_artist)
    return db_artist


@router.delete("/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artist(artist_id: int, db: Session = Depends(get_db)):
    db_artist = db.query(Artist).filter(Artist.id == artist_id).first()
    if not db_artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artist not found")
    if db_artist.song_artists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete an artist with song relationships",
        )
    db.delete(db_artist)
    db.commit()
    return None
