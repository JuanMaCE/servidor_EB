<h1 align="center">EB Music Studio</h1>

<p align="center">
  Plataforma web para centralizar secuencias de audio, letras y repertorio musical.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

## Sobre el proyecto

EB Music Studio nace para resolver un problema concreto: mantener organizados, accesibles y relacionados los recursos que forman parte de un repertorio musical.

La aplicación ofrece una interfaz visual para administrar canciones, artistas, archivos de secuencia y letras desde un único lugar. El proyecto está construido como una solución full stack, con un cliente React que consume una API REST desarrollada con FastAPI y persistencia en PostgreSQL.

> Estado: proyecto en desarrollo activo. La gestión de secuencias y letras ya está implementada; nuevas vistas, como charts, forman parte del roadmap.

## Funcionalidades

- Crear, consultar, editar y eliminar canciones.
- Asociar artistas con canciones mediante una relación muchos a muchos.
- Subir secuencias en formatos `.mid`, `.midi`, `.mp3` y `.wav`.
- Validar el tipo y tamaño de los archivos tanto en el cliente como en el servidor.
- Importar letras desde archivos `.txt` y `.lrc`, o editarlas directamente.
- Conservar la letra cuando se elimina una secuencia, y viceversa.
- Descargar los archivos almacenados desde la biblioteca.
- Consultar y probar la API desde la documentación interactiva de FastAPI.
- Navegar por una interfaz responsive con animaciones y estados de carga, error y contenido vacío.

## Arquitectura

```text
Navegador
   |
   v
React + TypeScript + Vite
   |
   | HTTP / JSON / multipart-form-data
   v
FastAPI + Pydantic
   |                    |
   v                    v
PostgreSQL         Almacenamiento local
SQLAlchemy         de secuencias
```

El frontend separa páginas, componentes reutilizables, hooks, tipos y servicios HTTP. El backend organiza la lógica en routers, esquemas de validación y modelos de persistencia. Alembic mantiene versionado el esquema de la base de datos.

## Tecnologías

| Área | Tecnologías |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| UI | CSS, Framer Motion, Lucide React |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Datos | PostgreSQL, SQLAlchemy, Alembic, Psycopg |
| Calidad | ESLint, validación tipada y documentación OpenAPI |

## Puesta en marcha

### Requisitos

- Node.js 20.19 o superior.
- Python 3.12 o superior.
- PostgreSQL.

### 1. Clonar el repositorio

```bash
git clone git@github.com:JuanMaCE/servidor_EB.git
cd servidor_EB
```

### 2. Configurar el backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Crea `backend/.env` con la conexión a PostgreSQL:

```env
DATABASE_URL=postgresql+psycopg://usuario:contrasena@localhost:5432/eb_music
```

Aplica las migraciones e inicia la API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

La API estará disponible en `http://127.0.0.1:8000` y su documentación interactiva en `http://127.0.0.1:8000/docs`.

### 3. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`. Durante el desarrollo, Vite redirige automáticamente las peticiones de `/api` al backend local.

Para consumir una API alojada en otra dirección, crea `frontend/.env.local`:

```env
VITE_API_URL=https://api.example.com
```

## API REST

| Recurso | Responsabilidad |
| --- | --- |
| `/songs/` | CRUD de canciones, secuencias y letras |
| `/artists/` | CRUD de artistas |
| `/song-artists/` | Gestión de relaciones entre canciones y artistas |
| `/files/sequences/` | Carga y descarga de archivos de secuencia |

Los listados aceptan paginación mediante los parámetros `skip` y `limit`. FastAPI expone el contrato OpenAPI completo en `/docs` y `/redoc`.

## Estructura del proyecto

```text
servidor_EB/
├── backend/
│   ├── alembic/             # Migraciones de base de datos
│   ├── app/
│   │   ├── models/          # Modelos SQLAlchemy
│   │   ├── routers/         # Endpoints de la API
│   │   ├── schemas/         # Esquemas Pydantic
│   │   ├── database.py      # Conexión y sesiones
│   │   └── main.py          # Entrada de FastAPI
│   ├── storage/sequences/   # Archivos musicales almacenados
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── hooks/           # Estado y acceso a la biblioteca
    │   ├── pages/           # Inicio, secuencias y letras
    │   ├── services/        # Cliente de la API
    │   ├── styles/          # Estilos globales y de páginas
    │   └── types/           # Contratos TypeScript
    └── package.json
```

## Verificación

Desde `frontend/`:

```bash
npm run lint
npm run build
```

## Próximos pasos

- Incorporar la vista de charts.
- Añadir autenticación y bibliotecas por usuario.
- Ampliar la cobertura de pruebas automáticas.
- Preparar almacenamiento de archivos para un entorno de producción.

## Autor

Desarrollado por [JuanMaCE](https://github.com/JuanMaCE) como proyecto full stack para portfolio.
