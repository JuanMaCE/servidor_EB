import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

router = APIRouter(prefix="/files/sequences", tags=["files"])

STORAGE_ROOT = Path("storage")
SEQUENCES_SUBDIR = "sequences"
ALLOWED_EXTENSIONS = {".wav", ".mid", ".midi", ".mp3"}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_sequence(file: UploadFile = File(...)):
    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed types: .wav, .mid, .midi, .mp3",
        )

    safe_name = f"{uuid.uuid4().hex}{extension}"
    relative_path = Path(SEQUENCES_SUBDIR) / safe_name
    destination = STORAGE_ROOT / relative_path

    size = 0
    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    destination.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File too large",
                    )
                buffer.write(chunk)
    finally:
        await file.close()

    return {"filename": safe_name, "file_seq": str(relative_path)}


@router.get("/{path:path}")
def download_sequence(path: str):
    storage_root = STORAGE_ROOT.resolve()
    requested = (storage_root / path).resolve()

    stored_name = requested.name

    file = db.query(Song).filter(
        FileModel.stored_name == stored_name
    ).first()

    if not file:
            raise HTTPException(404, "File not found")


    if not requested.is_relative_to(storage_root):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if not requested.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(
        path=requested,
        media_type="application/octet-stream",
        filename=requested.name,
        headers={"Content-Disposition": f"attachment; filename={requested.name}"},
    )
