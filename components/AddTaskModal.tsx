'use client'
import { useState } from 'react'

const CATEGORIES = ['Personal', 'Work', 'Health', 'Study', 'Home']
const PRIORITIES  = ['low', 'medium', 'high']

interface Props {
  onClose: () => void
  onSaved: () => void
  defaultDate?: string
  /** If provided, saves guest task via localStorage instead of API */
  onGuestAdd?: (task: { title: string; notes: string; date: string; time: string; priority: string; category: string; completed: boolean }) => void
}

export default function AddTaskModal({ onClose, onSaved, defaultDate, onGuestAdd }: Props) {
  const [title,    setTitle]    = useState('')
  const [notes,    setNotes]    = useState('')
  const [date,     setDate]     = useState(defaultDate || '')
  const [time,     setTime]     = useState('')
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium')
  const [category, setCategory] = useState('Personal')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Please add a title 🌿'); return }
    setSaving(true)

    // Guest mode: no API call
    if (onGuestAdd) {
      onGuestAdd({ title, notes, date, time, priority, category, completed: false })
      onSaved()
      return
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, notes, date, time, priority, category }),
      })
      if (!res.ok) throw new Error('Failed')
      onSaved()
    } catch {
      setError('Could not save. Try again.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet" role="dialog" aria-modal="true" aria-label="Add new task">
        <div className="modal-handle" />
        <h2 className="modal-title">New Task 🌱</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title</label>
            <input id="task-title" className="form-input" placeholder="What needs doing?" value={title}
              onChange={e => setTitle(e.target.value)} autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-notes">Notes</label>
            <textarea id="task-notes" className="form-textarea" placeholder="Any details..." value={notes}
              onChange={e => setNotes(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-date">Date</label>
              <input id="task-date" type="date" className="form-input" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-time">Time</label>
              <input id="task-time" type="time" className="form-input" value={time}
                onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-row">
              {PRIORITIES.map(p => (
                <button key={p} type="button" id={`priority-${p}`}
                  className={`priority-btn${priority === p ? ` selected-${p}` : ''}`}
                  onClick={() => setPriority(p as any)}>
                  {p === 'low' ? '🌿 Low' : p === 'medium' ? '☀️ Medium' : '🔥 High'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="cat-row">
              {CATEGORIES.map(c => (
                <button key={c} type="button" id={`cat-${c.toLowerCase()}`}
                  className={`cat-btn${category === c ? ' selected' : ''}`}
                  onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#C97070', fontSize: 13, marginBottom: 8 }}>{error}</p>}

          <button id="btn-save-task" type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Task 🪺'}
          </button>
        </form>
      </div>
    </div>
  )
}
