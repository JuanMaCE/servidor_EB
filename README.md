<h1 align="center">EB Music Studio</h1>

<p align="center">
  Web platform for centralizing audio sequences, lyrics, and music repertoire.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

## About the project

EB Music Studio was created to solve a specific problem: keeping the resources that make up a music repertoire organized, accessible, and connected.

The application provides a visual interface for managing songs, artists, sequence files, and lyrics in one place. The project is built as a full-stack solution, with a React client consuming a REST API developed with FastAPI and PostgreSQL for persistence.

> Status: under active development. Sequence and lyrics management are already implemented; new views, such as charts, are part of the roadmap.

## Features

- Create, view, edit, and delete songs.
- Associate artists with songs through a many-to-many relationship.
- Upload sequences in `.mid`, `.midi`, `.mp3`, and `.wav` formats.
- Validate file types and sizes on both the client and server.
- Import lyrics from `.txt` and `.lrc` files or edit them directly.
- Preserve lyrics when a sequence is deleted, and vice versa.
- Download stored files from the library.
- Explore and test the API through FastAPI's interactive documentation.
- Navigate a responsive interface with animations and loading, error, and empty states.

## Architecture

```text
Browser
   |
   v
React + TypeScript + Vite
   |
   | HTTP / JSON / multipart-form-data
   v
FastAPI + Pydantic
   |                    |
   v                    v
PostgreSQL         Local sequence
SQLAlchemy         storage
```

The frontend separates pages, reusable components, hooks, types, and HTTP services. The backend organizes its logic into routers, validation schemas, and persistence models. Alembic provides database schema versioning.

## Technologies

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| UI | CSS, Framer Motion, Lucide React |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Data | PostgreSQL, SQLAlchemy, Alembic, Psycopg |
| Quality | ESLint, typed validation, and OpenAPI documentation |

## Getting started

### Requirements

- Node.js 20.19 or later.
- Python 3.12 or later.
- PostgreSQL.

### 1. Clone the repository

```bash
git clone git@github.com:JuanMaCE/servidor_EB.git
cd servidor_EB
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` with the PostgreSQL connection string:

```env
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/eb_music
```

Apply the migrations and start the API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with its interactive documentation at `http://127.0.0.1:8000/docs`.

### 3. Set up the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`. During development, Vite automatically proxies `/api` requests to the local backend.

To consume an API hosted at a different address, create `frontend/.env.local`:

```env
VITE_API_URL=https://api.example.com
```

## API REST

| Resource | Responsibility |
| --- | --- |
| `/songs/` | CRUD operations for songs, sequences, and lyrics |
| `/artists/` | CRUD operations for artists |
| `/song-artists/` | Management of song-artist relationships |
| `/files/sequences/` | Upload and download of sequence files |

List endpoints support pagination through the `skip` and `limit` parameters. FastAPI exposes the complete OpenAPI contract at `/docs` and `/redoc`.

## Project structure

```text
servidor_EB/
├── backend/
│   ├── alembic/             # Database migrations
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routers/         # API endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── database.py      # Connection and sessions
│   │   └── main.py          # FastAPI entry point
│   ├── storage/sequences/   # Stored music files
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── hooks/           # State and library access
    │   ├── pages/           # Home, sequences, and lyrics
    │   ├── services/        # API client
    │   ├── styles/          # Global and page styles
    │   └── types/           # TypeScript contracts
    └── package.json
```

## Verification

From `frontend/`:

```bash
npm run lint
npm run build
```

## Roadmap

- Add the charts view.
- Add authentication and per-user libraries.
- Expand automated test coverage.
- Prepare file storage for a production environment.

## Author

Developed by [JuanMaCE](https://github.com/JuanMaCE) as a full-stack portfolio project.
