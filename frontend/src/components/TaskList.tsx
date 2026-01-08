import { type Task } from '../types';
import { TaskItem } from './TaskItem';

interface Props {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ tasks, loading, onToggle, onDelete }: Props) {
  if (loading) {
    return <div className="task-list-message">loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-message">
        <p>no tasks yet!</p>
        <p className="hint">add your first task above ☝️</p>
      </div>
    );
  }

  // separate completed and incomplete tasks
  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="task-list">
      {incomplete.length > 0 && (
        <section>
          <h2>to do ({incomplete.length})</h2>
          {incomplete.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </section>
      )}
      {completed.length > 0 && (
        <section>
          <h2>completed ({completed.length})</h2>
          {completed.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </section>
      )}
    </div>
  );
}