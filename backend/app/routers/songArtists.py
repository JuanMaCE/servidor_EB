from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.artist import Artist
from app.models.song import Song
from app.models.songArtist import SongArtist
from app.schemas.songArtist import SongArtistCreate, SongArtistResponse


router = APIRouter(
    prefix="/song-artists",
    tags=["song-artists"]
)


@router.post("/", response_model=SongArtistResponse, status_code=status.HTTP_201_CREATED)
def create_song_artist(song_artist: SongArtistCreate, db: Session = Depends(get_db)):
    if not db.query(Song).filter(Song.id == song_artist.song_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    if not db.query(Artist).filter(Artist.id == song_artist.artist_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artist not found")
    existing_relation = db.query(SongArtist).filter(
        SongArtist.song_id == song_artist.song_id,
        SongArtist.artist_id == song_artist.artist_id,
    ).first()
    if existing_relation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Song-artist relationship already exists",
        )

    new_song_artist = SongArtist(**song_artist.model_dump())
    db.add(new_song_artist)
    db.commit()
    db.refresh(new_song_artist)
    return new_song_artist


@router.get("/", response_model=List[SongArtistResponse], status_code=status.HTTP_200_OK)
def get_song_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    song_artists = db.query(SongArtist).offset(skip).limit(limit).all()
    return song_artists


@router.get("/{song_artist_id}", response_model=SongArtistResponse, status_code=status.HTTP_200_OK)
def get_song_artist(song_artist_id: int, db: Session = Depends(get_db)):
    song_artist = db.query(SongArtist).filter(SongArtist.id == song_artist_id).first()
    if not song_artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SongArtist not found")
    return song_artist


@router.put("/{song_artist_id}", response_model=SongArtistResponse, status_code=status.HTTP_200_OK)
def update_song_artist(
    song_artist_id: int,
    song_artist_update: SongArtistCreate,
    db: Session = Depends(get_db),
):
    song_artist = db.query(SongArtist).filter(SongArtist.id == song_artist_id).first()
    if not song_artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SongArtist not found")
    if not db.query(Song).filter(Song.id == song_artist_update.song_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    if not db.query(Artist).filter(Artist.id == song_artist_update.artist_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artist not found")
    existing_relation = db.query(SongArtist).filter(
        SongArtist.song_id == song_artist_update.song_id,
        SongArtist.artist_id == song_artist_update.artist_id,
        SongArtist.id != song_artist_id,
    ).first()
    if existing_relation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Song-artist relationship already exists",
        )

    for key, value in song_artist_update.model_dump().items():
        setattr(song_artist, key, value)

    db.commit()
    db.refresh(song_artist)
    return song_artist


@router.delete("/{song_artist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_song_artist(song_artist_id: int, db: Session = Depends(get_db)):
    song_artist = db.query(SongArtist).filter(SongArtist.id == song_artist_id).first()
    if not song_artist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SongArtist not found")
    db.delete(song_artist)
    db.commit()
    return None
