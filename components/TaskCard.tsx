'use client'

interface Task {
  id: string
  title: string
  notes?: string
  date?: string
  time?: string
  priority: string
  category: string
  completed: boolean
}

const TAG_CLASS: Record<string,string> = {
  Personal: 'tag-personal',
  Work:     'tag-work',
  Health:   'tag-health',
  Study:    'tag-study',
  Home:     'tag-home',
}

interface Props {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <div className={`task-card${task.completed ? ' completed' : ''}`} id={`task-${task.id}`}>
      <button
        id={`check-${task.id}`}
        className={`task-check${task.completed ? ' checked' : ''}`}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</span>}
      </button>

      <div style={{ flex: 1 }}>
        <div className="task-title">{task.title}</div>
        {task.notes && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{task.notes}</div>
        )}
        <div className="task-meta">
          <span className={`tag ${TAG_CLASS[task.category] || 'tag-personal'}`}>{task.category}</span>
          <span className={`priority-dot priority-${task.priority}`} title={task.priority} />
          {task.time && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              🕐 {task.time}
            </span>
          )}
        </div>
      </div>

      <button
        id={`delete-${task.id}`}
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
                 color: 'var(--text-muted)', padding: '4px', borderRadius: 6,
                 transition: 'all 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#C97070')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        ✕
      </button>
    </div>
  )
}
