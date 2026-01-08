import { useState } from 'react';
import { type Task } from '../types';

interface Props {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setLoading(false);
    }
  };

  // format the date nicely
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${loading ? 'loading' : ''}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            disabled={loading}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-details">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <span className="task-date">created {formatDate(task.created_at)}</span>
        </div>
      </div>
      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={loading}
        aria-label="delete task"
      >
        🗑️
      </button>
    </div>
  );
}