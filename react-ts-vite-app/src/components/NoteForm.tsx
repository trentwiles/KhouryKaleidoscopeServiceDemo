import { useState } from 'react'

interface Props {
  onSubmit: (title: string, content: string) => Promise<void>
}

export function NoteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setSubmitting(true)
    try {
      await onSubmit(title, content)
      setTitle('')
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={submitting}
      />
      <textarea
        placeholder="Content (optional)"
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Adding...' : 'Add Note'}
      </button>
    </form>
  )
}