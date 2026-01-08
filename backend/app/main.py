from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .config import get_settings
from .database import engine, get_db, Base
from .models import Task
from .schemas import TaskCreate, TaskUpdate, TaskResponse, HealthResponse

# create tables on startup
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="Task Manager API",
    description="khoury kaleidoscope service demo - fastapi + postgresql",
    version="1.0.0",
)

# configure cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check(db: Session = Depends(get_db)):
    # verify database connection
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    
    return HealthResponse(
        status="healthy",
        database=db_status,
        environment=settings.environment,
    )


# get all tasks
@app.get("/tasks", response_model=list[TaskResponse], tags=["tasks"])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    # return tasks ordered by creation date (newest first)
    tasks = (
        db.query(Task)
        .order_by(Task.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return tasks


# get single task by id
@app.get("/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"task with id {task_id} not found",
        )
    return task


# create new task
@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["tasks"])
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    task = Task(
        title=task_data.title,
        description=task_data.description,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# update existing task
@app.put("/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"task with id {task_id} not found",
        )
    
    # only update fields that were provided
    update_fields = task_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task


# delete task
@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"task with id {task_id} not found",
        )
    
    db.delete(task)
    db.commit()
    return None


# root endpoint
@app.get("/", tags=["root"])
def root():
    return {
        "message": "task manager api",
        "docs": "/docs",
        "health": "/health",
    }