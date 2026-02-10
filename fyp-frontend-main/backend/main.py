from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from starlette.requests import Request
from routes import localize, navigate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(localize.router)
app.include_router(navigate.router)


DIST_DIR = (Path(__file__).resolve().parent.parent / "dist").resolve()
ASSETS_DIR = (DIST_DIR / "assets").resolve()

if DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="frontend")


@app.exception_handler(404)
async def spa_404_handler(request: Request, exc):
    index_file = DIST_DIR / "index.html"
    accept = request.headers.get("accept", "")
    if request.method == "GET" and "text/html" in accept and index_file.exists():
        return FileResponse(str(index_file))
    return exc
