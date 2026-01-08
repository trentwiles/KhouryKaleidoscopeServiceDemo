// task model matching the backend schema
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// for creating new tasks
export interface TaskCreate {
  title: string;
  description?: string;
}

// for updating existing tasks
export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}