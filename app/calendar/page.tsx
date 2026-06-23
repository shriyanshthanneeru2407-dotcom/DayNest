'use client'
import { useState, useEffect } from 'react'
import BottomNav    from '@/components/BottomNav'
import AddTaskModal from '@/components/AddTaskModal'
import TaskCard     from '@/components/TaskCard'
import useTasks     from '@/hooks/useTasks'

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

export default function CalendarPage() {
  const now      = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState<string | null>(
    toDateStr(now.getFullYear(), now.getMonth(), now.getDate())
  )
  const [showModal, setShowModal] = useState(false)
  const [taskDates, setTaskDates] = useState<Set<string>>(new Set())

  // Fetch all tasks to know which dates have dots
  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then((tasks: any[]) => {
        const dates = tasks.filter(t => t.date).map(t => t.date as string)
        setTaskDates(new Set(dates))
      })
      .catch(() => {})
  }, [])

  const { tasks, loading, refresh, toggle, remove } = useTasks(selected || undefined)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Build grid
  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  return (
    <div className="app-shell">
      {/* Month header */}
      <div className="calendar-header">
        <button className="cal-nav-btn" id="btn-prev-month" onClick={prevMonth} aria-label="Previous month">◀</button>
        <span>{MONTHS[month]} {year}</span>
        <button className="cal-nav-btn" id="btn-next-month" onClick={nextMonth} aria-label="Next month">▶</button>
      </div>

      {/* Day names */}
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}

        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const ds     = toDateStr(year, month, day)
          const isToday    = ds === todayStr
          const isSelected = ds === selected
          const hasTasks   = taskDates.has(ds)
          return (
            <div key={ds}
              id={`cal-day-${ds}`}
              className={`cal-day${isToday ? ' today' : ''}${isSelected && !isToday ? ' selected' : ''}`}
              onClick={() => setSelected(ds)}>
              {day}
              {hasTasks && <span className="cal-dot" />}
            </div>
          )
        })}
      </div>

      {/* Selected day tasks */}
      {selected && (
        <>
          <div className="section-header">
            <span className="section-title">
              {new Date(selected + 'T12:00:00').toLocaleDateString('en-US',{ month:'short', day:'numeric' })}
            </span>
            <span className="section-count">{tasks.length} tasks</span>
          </div>
          <div className="task-list">
            {loading && <p className="text-muted text-sm" style={{ padding: 8 }}>Loading…</p>}
            {!loading && tasks.length === 0 && (
              <div className="empty-state" style={{ padding: '24px 16px' }}>
                <div className="empty-icon">📅</div>
                <p>No tasks this day.</p>
              </div>
            )}
            {tasks.map(t => (
              <TaskCard key={t.id} task={t}
                onToggle={(id, val) => { toggle(id, val); }}
                onDelete={id => { remove(id); }} />
            ))}
          </div>
        </>
      )}

      <button className="fab" id="btn-add-cal-task" onClick={() => setShowModal(true)} aria-label="Add task">+</button>

      {showModal && (
        <AddTaskModal
          defaultDate={selected || ''}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            refresh()
            if (selected) setTaskDates(p => new Set([...p, selected]))
          }}
        />
      )}

      <BottomNav />
    </div>
  )
}
