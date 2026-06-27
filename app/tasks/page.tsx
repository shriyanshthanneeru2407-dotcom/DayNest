'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import TaskCard     from '@/components/TaskCard'
import AddTaskModal from '@/components/AddTaskModal'
import BottomNav    from '@/components/BottomNav'
import useTasks     from '@/hooks/useTasks'

const CATS = ['All', 'Personal', 'Work', 'Health', 'Study', 'Home']

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false)
  const [filter,    setFilter]    = useState('All')
  const { tasks, loading, refresh, toggle, remove, addGuestTask, isGuest } = useTasks()

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.category === filter)
  const done     = tasks.filter(t => t.completed).length

  return (
    <div className="app-shell">
      <div className="greeting-section">
        <h1>All Tasks</h1>
        <p className="greeting-date" style={{ marginTop: 4 }}>
          {done}/{tasks.length} completed
          {isGuest && (
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
              · Guest Mode
            </span>
          )}
        </p>
      </div>

      {isGuest && (
        <div style={{ padding: '4px 16px 8px' }}>
          <button
            onClick={() => signIn('google', { callbackUrl: '/tasks' })}
            style={{
              fontSize: 12, color: 'var(--accent)', fontWeight: 700,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', padding: 0,
            }}>
            🌐 Sign in with Google to sync across devices & get reminders →
          </button>
        </div>
      )}

      {/* Category filter pills */}
      <div className="widget-strip" style={{ padding: '8px 16px 8px' }}>
        {CATS.map(c => (
          <button key={c} id={`filter-${c.toLowerCase()}`}
            onClick={() => setFilter(c)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              border: filter === c ? 'none' : '1.5px solid var(--border)',
              background: filter === c ? 'var(--accent)' : 'var(--surface)',
              color: filter === c ? 'white' : 'var(--text-muted)',
              fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
            }}>
            {c}
          </button>
        ))}
      </div>

      <div className="task-list" style={{ marginTop: 4 }}>
        {loading && <p className="text-muted text-sm" style={{ padding: 8 }}>Loading…</p>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No tasks here yet.</p>
          </div>
        )}
        {filtered.map(t => (
          <TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} />
        ))}
      </div>

      <button className="fab" id="btn-add-task-all" onClick={() => setShowModal(true)} aria-label="Add task">+</button>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); refresh() }}
          onGuestAdd={isGuest ? (task) => { addGuestTask(task); setShowModal(false) } : undefined}
        />
      )}

      <BottomNav />
    </div>
  )
}
