from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class LyricArtist(Base):
    __tablename__ = 'lyric_artist'

    id = Column(Integer, primary_key=True, index=True)
    lyric_id = Column(Integer, index=True)
    artist_id = Column(Integer, index=True)

    lyric = relationship("Lyric", back_populates="lyric_artists")
    artist = relationship("Artist", back_populates="lyric_artists")
    