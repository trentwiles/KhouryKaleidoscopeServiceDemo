import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { type Task, type TaskCreate } from './types';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('failed to load tasks. is the api running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (taskData: TaskCreate) => {
    const newTask = await createTask(taskData);
    // add to beginning of list
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const updated = await updateTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <Header />
      <main className="container">
        <TaskForm onSubmit={handleCreate} />
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadTasks}>retry</button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </main>
      <footer className="footer">
        <p>built with fastapi + react + postgresql</p>
      </footer>
    </div>
  );
}

export default App;