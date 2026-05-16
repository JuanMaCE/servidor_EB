from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class SongArtist(Base):
    __tablename__ = "song_artist"

    id = Column(Integer, primary_key=True, index=True)

    song_id = Column(
        Integer,
        ForeignKey("songs.id"),
        nullable=False
    )

    artist_id = Column(
        Integer,
        ForeignKey("artists.id"),
        nullable=False
    )

    song = relationship(
        "Song",
        back_populates="song_artists"
    )

    artist = relationship(
        "Artist",
        back_populates="song_artists"
    )