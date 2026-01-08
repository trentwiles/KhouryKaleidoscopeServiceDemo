import { useState } from 'react';
import { type TaskCreate } from '../types';

interface Props {
  onSubmit: (task: TaskCreate) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      // clear form on success
      setTitle('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
      />
      <textarea
        placeholder="description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
        rows={2}
      />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'adding...' : '+ add task'}
      </button>
    </form>
  );
}