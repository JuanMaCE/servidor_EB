from pydantic import BaseModel

class ArtistBase(BaseModel):
    name: str