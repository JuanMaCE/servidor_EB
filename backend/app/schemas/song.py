from pydantic import BaseModel

class SongCreate(BaseModel):
    name: str
    file_seq: str
    file_lyric: str


class SongResponse(BaseModel):
    id: int
    name: str
    file_seq: str
    file_lyric: str

    class Config:
        from_attributes = True