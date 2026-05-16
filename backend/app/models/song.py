from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class Song(Base):
    __tablename__ = 'songs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    file_seq = Column(String, index=True)
    file_lyric = Column(String, index=True, nullable=False)

    song_artists = relationship(
        "SongArtist",
        back_populates="song"
    )


