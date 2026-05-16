from pydantic import BaseModel

class SongArtistCreate(BaseModel):
    song_id: int
    artist_id: int

class SongArtistResponse(BaseModel):
    id: int
    song_id: int
    artist_id: int

    class Config:
        from_attributes = True
