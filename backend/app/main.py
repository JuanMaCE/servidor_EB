from pathlib import Path

from fastapi import FastAPI

from app import models
from app.routers import artists, files, songArtists, songs

Path("storage/sequences").mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.include_router(songs.router)
app.include_router(artists.router)
app.include_router(songArtists.router)
app.include_router(files.router)