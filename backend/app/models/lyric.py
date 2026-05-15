from sqlalchemy import Column, Integer, String
from database import Base

class Lyric(Base):
    __tablename__ = 'lyrics'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
