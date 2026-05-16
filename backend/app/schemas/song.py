from sqlalchemy import Column, Integer, String
from app.database import Base

class Song(Base):
    __tablename__ = 'songs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    file_seq = Column(String, index=True)
    file_lyric = Column(String, index=True)
    


