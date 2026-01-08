from pydantic import BaseModel, ConfigDict
from datetime import datetime


# base schema with common fields
class TaskBase(BaseModel):
    title: str
    description: str | None = None


# schema for creating a task
class TaskCreate(TaskBase):
    pass


# schema for updating a task (all fields optional)
class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None


# schema for task response (includes db fields)
class TaskResponse(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    # allow orm mode for sqlalchemy models
    model_config = ConfigDict(from_attributes=True)


# health check response
class HealthResponse(BaseModel):
    status: str
    database: str
    environment: str