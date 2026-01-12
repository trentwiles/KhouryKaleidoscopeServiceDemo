import { type Note } from '../types'
import { NoteCard } from './NoteCard'

interface Props {
  notes: Note[]
  onDelete: (id: string) => void
}

export function NoteList({ notes, onDelete }: Props) {
  if (notes.length === 0) {
    return <p className="empty">No notes yet. Create one above!</p>
  }

  return (
    <div className="note-list">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  )
}