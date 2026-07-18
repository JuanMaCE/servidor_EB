from pydantic import BaseModel, Field, model_validator


class NewArtist(BaseModel):
    name: str


class SongCreate(BaseModel):
    name: str
    file_seq: str | None = None
    file_lyric: str | None = None
    artist_ids: list[int] = Field(default_factory=list)
    new_artists: list[NewArtist] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_song(self):
        if not self.file_seq and not self.file_lyric:
            raise ValueError("file_seq or file_lyric is required")
        if not self.artist_ids and not self.new_artists:
            raise ValueError("At least one artist is required")
        return self


class SongResponse(BaseModel):
    id: int
    name: str
    file_seq: str | None
    file_lyric: str | None

    class Config:
        from_attributes = True