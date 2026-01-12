import os
from contextlib import asynccontextmanager
from datetime import datetime
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg

DATABASE_URL = os.environ["DATABASE_URL"]

# Connection pool
pool: asyncpg.Pool | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    # Create table if not exists
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        """)
    
    yield
    
    await pool.close()

app = FastAPI(title="Notes API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_conn():
    async with pool.acquire() as conn:
        yield conn

class NoteCreate(BaseModel):
    title: str
    content: str

class Note(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime

@app.get("/")
def health():
    return {"status": "ok", "service": "notes-api"}

@app.get("/api/notes", response_model=list[Note])
async def get_notes(conn: asyncpg.Connection = Depends(get_conn)):
    rows = await conn.fetch("SELECT * FROM notes ORDER BY created_at DESC")
    return [dict(r) for r in rows]

@app.post("/api/notes", response_model=Note)
async def create_note(note: NoteCreate, conn: asyncpg.Connection = Depends(get_conn)):
    note_id = str(uuid4())
    row = await conn.fetchrow(
        "INSERT INTO notes (id, title, content) VALUES ($1, $2, $3) RETURNING *",
        note_id, note.title, note.content
    )
    return dict(row)

@app.get("/api/notes/{note_id}", response_model=Note)
async def get_note(note_id: str, conn: asyncpg.Connection = Depends(get_conn)):
    row = await conn.fetchrow("SELECT * FROM notes WHERE id = $1", note_id)
    if not row:
        raise HTTPException(status_code=404, detail="Note not found")
    return dict(row)

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str, conn: asyncpg.Connection = Depends(get_conn)):
    result = await conn.execute("DELETE FROM notes WHERE id = $1", note_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Note not found")
    return {"deleted": True}