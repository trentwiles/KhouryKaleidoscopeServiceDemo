import { type Task, type TaskCreate, type TaskUpdate } from '../types';

// base url - uses vite's env variable or falls back to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// fetch all tasks
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('failed to fetch tasks');
  return res.json();
}

// fetch single task by id
export async function getTask(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  if (!res.ok) throw new Error('failed to fetch task');
  return res.json();
}

// create a new task
export async function createTask(task: TaskCreate): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('failed to create task');
  return res.json();
}

// update an existing task
export async function updateTask(id: number, task: TaskUpdate): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('failed to update task');
  return res.json();
}

// delete a task
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('failed to delete task');
}

// health check endpoint
export async function healthCheck(): Promise<{ status: string; database: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('health check failed');
  return res.json();
}