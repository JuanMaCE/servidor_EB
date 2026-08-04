from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.song import Song
from app.models.artist import Artist
from app.models.songArtist import SongArtist
from app.schemas.song import SongCreate, SongResponse
from app.schemas.artist import ArtistResponse, ArtistCreate

router = APIRouter(
    prefix="/songs",
    tags=["songs"]
)

STORAGE_ROOT = Path("storage")


def _delete_sequence_file(file_seq: str | None) -> None:
    if not file_seq:
        return
    storage_root = STORAGE_ROOT.resolve()
    file_path = (storage_root / file_seq).resolve()
    if file_path.is_relative_to(storage_root):
        file_path.unlink(missing_ok=True)


@router.post("/", response_model=SongResponse, status_code=status.HTTP_201_CREATED)
def create_song(song_data: SongCreate, db: Session = Depends(get_db)):
    try:
        with db.begin():
            song = Song(
                name=song_data.name,
                file_seq=song_data.file_seq,
                file_lyric=song_data.file_lyric,
            )
            db.add(song)
            db.flush()

            artists = []

            if song_data.artist_ids:
                artists = list(
                    db.scalars(
                        select(Artist).where(Artist.id.in_(song_data.artist_ids))
                    )
                )
                found_ids = {artist.id for artist in artists}
                missing_ids = set(song_data.artist_ids) - found_ids
                if missing_ids:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Artists with IDs {sorted(missing_ids)} not found",
                    )

            for artist_data in song_data.new_artists:
                artist = Artist(name=artist_data.name)
                db.add(artist)
                artists.append(artist)

            db.flush()
            db.add_all(
                SongArtist(song_id=song.id, artist_id=artist.id)
                for artist in artists
            )

        db.refresh(song)
        return song

    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Could not create the song and its artist relationships",
        ) from error


@router.get("/", response_model=List[SongResponse], status_code=status.HTTP_200_OK)
def get_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
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
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    old_file_seq = song.file_seq
    new_file_seq = song_update.file_seq

    try:
        song.name = song_update.name
        song.file_seq = new_file_seq
        song.file_lyric = song_update.file_lyric
        db.commit()
    except Exception:
        db.rollback()
        raise

    if old_file_seq and old_file_seq != new_file_seq:
        _delete_sequence_file(old_file_seq)

    db.refresh(song)
    return song


@router.delete("/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    if song.song_artists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a song with artist relationships",
        )

    old_file_seq = song.file_seq

    try:
        db.delete(song)
        db.commit()
    except Exception:
        db.rollback()
        raise

    _delete_sequence_file(old_file_seq)
    return None
