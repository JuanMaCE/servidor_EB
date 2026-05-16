from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, index=True, nullable=False)

    song_artists = relationship(
        "SongArtist",
        back_populates="artist"
    )