import { useEffect, useState } from 'react';
import { healthCheck } from '../api/tasks';

export function Header() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');

  useEffect(() => {
    // check api health on mount
    healthCheck()
      .then(() => setStatus('healthy'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <header className="header">
      <h1>📋 Task Manager</h1>
      <p className="subtitle">khoury kaleidoscope service demo</p>
      <div className={`status-badge ${status}`}>
        {status === 'checking' && '⏳ checking api...'}
        {status === 'healthy' && '✅ api connected'}
        {status === 'error' && '❌ api unavailable'}
      </div>
    </header>
  );
}