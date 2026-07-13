from fastapi import FastAPI
from app import models
from app.routers import songs

app = FastAPI()

app.include_router(songs.router)