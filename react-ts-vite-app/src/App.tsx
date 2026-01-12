import { useState, useEffect } from 'react'
import { NoteForm } from './components/NoteForm'
import { NoteList } from './components/NoteList'
import { type Note } from './types'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes`)
      if (!res.ok) throw new Error('Failed to fetch')
      setNotes(await res.json())
      setError('')
    } catch {
      setError('Could not connect to API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const createNote = async (title: string, content: string) => {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    if (!res.ok) throw new Error('Failed to create')
    fetchNotes()
  }

  const deleteNote = async (id: string) => {
    await fetch(`${API_URL}/api/notes/${id}`, { method: 'DELETE' })
    fetchNotes()
  }

  return (
    <div className="container">
      <h1>📝 Notes Demo</h1>
      <p className="subtitle">Backend: {API_URL}</p>
      
      {error && <p className="error">{error}</p>}
      
      <NoteForm onSubmit={createNote} />
      
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <NoteList notes={notes} onDelete={deleteNote} />
      )}
    </div>
  )
}