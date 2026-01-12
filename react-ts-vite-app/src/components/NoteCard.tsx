import { type Note } from '../types'

interface Props {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: Props) {
  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <button 
          className="delete-btn"
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
        >
          ×
        </button>
      </div>
      {note.content && <p>{note.content}</p>}
      <small>{new Date(note.created_at).toLocaleString()}</small>
    </div>
  )
}