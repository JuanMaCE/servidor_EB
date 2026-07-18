from fastapi import FastAPI
from app import models
from app.routers import artists, songArtists, songs

app = FastAPI()

app.include_router(songs.router)
app.include_router(artists.router)
app.include_router(songArtists.router)
