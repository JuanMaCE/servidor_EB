from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class SongArtist(Base):
    __tablename__ = 'song_artist'

    id = Column(Integer, primary_key=True, index=True)
    song_id = Column(Integer, index=True)
    artist_id = Column(Integer, index=True)

    song = relationship("Song", back_populates="song_artists")
    artist = relationship("Artist", back_populates="song_artists")
    