'use client'
import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import TaskCard     from '@/components/TaskCard'
import ProgressRing from '@/components/ProgressRing'
import AddTaskModal from '@/components/AddTaskModal'
import BottomNav    from '@/components/BottomNav'
import PhoneBanner  from '@/components/PhoneBanner'
import useTasks     from '@/hooks/useTasks'

const QUOTES = [
  'Small steps still move you forward. 🌿',
  'Today is a fresh page. Write something gentle. ☕',
  'Rest is also part of the journey. 🌙',
  'You don\'t have to do it all. Just begin. 🌸',
  'Progress over perfection, always. 🕊️',
  'One task at a time. Breathe. 🍃',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning ☀️'
  if (h < 17) return 'Good Afternoon 🌿'
  return 'Good Evening 🌙'
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function TodayPage() {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [water,     setWater]     = useState(0)
  const [habits,    setHabits]    = useState<Record<string,boolean>>({
    '💧 Water': false, '🧘 Meditate': false, '📖 Read': false,
  })
  const [musicOn, setMusicOn] = useState(false)
  const [dismissGuest, setDismissGuest] = useState(false)
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const { tasks, loading, refresh, toggle, remove, addGuestTask, isGuest } = useTasks(todayStr())
  const done  = tasks.filter(t => t.completed).length
  const total = tasks.length

  const userName = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="app-shell">
      {/* Guest sign-in banner */}
      {isGuest && !dismissGuest && (
        <div style={{
          margin: '12px 16px 0',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #A68A72, #C98B73)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'white',
        }}>
          <span style={{ fontSize: 20 }}>🪺</span>
          <div style={{ flex: 1, fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>
            You're in guest mode. Tasks saved in your browser.
          </div>
          <button
            id="btn-signin-banner"
            onClick={() => signIn('google', { callbackUrl: '/today' })}
            style={{
              background: 'rgba(255,255,255,0.25)', border: 'none',
              borderRadius: 8, color: 'white', fontFamily: 'Nunito, sans-serif',
              fontSize: 11, fontWeight: 700, padding: '5px 10px',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </button>
          <button onClick={() => setDismissGuest(true)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14 }}>
            ✕
          </button>
        </div>
      )}

      {/* Greeting */}
      <div className="greeting-section">
        <h1>{getGreeting()}{!isGuest ? `, ${userName}` : ''}</h1>
        <p className="greeting-date">{formatDate(new Date())}</p>
        <p className="greeting-quote">"{quote}"</p>
      </div>

      {/* Phone number banner (signed-in only) */}
      {session && !(session.user as any).phoneNumber && <PhoneBanner />}

      {/* Progress Ring */}
      <div style={{ padding: '12px 16px 0' }}>
        <ProgressRing done={done} total={total} />
      </div>

      {/* Widget strip */}
      <div className="widget-strip">
        <div className="widget-card" id="widget-water" onClick={() => setWater(w => Math.min(w + 1, 8))}>
          <div className="widget-icon">💧</div>
          <div className="widget-label">Water</div>
          <div className="widget-value">{water}/8</div>
        </div>
        <div className="widget-card" id="widget-habits">
          <div className="widget-icon">☕</div>
          <div className="widget-label">Habits</div>
          <div className="widget-value">{Object.values(habits).filter(Boolean).length}/{Object.keys(habits).length}</div>
        </div>
        {Object.entries(habits).map(([h, done]) => (
          <div key={h} className="widget-card" id={`habit-${h}`}
            onClick={() => setHabits(p => ({ ...p, [h]: !p[h] }))}
            style={{ opacity: done ? 1 : 0.6 }}>
            <div className="widget-icon">{h.split(' ')[0]}</div>
            <div className="widget-label">{h.split(' ').slice(1).join(' ')}</div>
            <div className="widget-value" style={{ fontSize: 14 }}>{done ? '✓' : '○'}</div>
          </div>
        ))}
        <div className="widget-card" id="widget-music"
          onClick={() => setMusicOn(m => !m)}
          style={{ background: musicOn ? 'var(--sage)' : 'var(--surface)' }}>
          <div className="widget-icon">🎵</div>
          <div className="widget-label">Focus</div>
          <div className="widget-value" style={{ fontSize: 13, color: musicOn ? '#3B5E40' : 'var(--accent)' }}>
            {musicOn ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="section-header">
        <span className="section-title">Today's Tasks</span>
        <span className="section-count">{total} task{total !== 1 ? 's' : ''}</span>
      </div>

      <div className="task-list">
        {loading && <p className="text-muted text-sm" style={{ padding: '8px 4px' }}>Loading tasks…</p>}
        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <p>No tasks for today.</p>
            <p style={{ marginTop: 4, fontSize: 12 }}>Tap + to add one.</p>
          </div>
        )}
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} />
        ))}
      </div>

      {/* FAB */}
      <button className="fab" id="btn-add-task" onClick={() => setShowModal(true)} aria-label="Add task">+</button>

      {showModal && (
        <AddTaskModal
          defaultDate={todayStr()}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); refresh() }}
          onGuestAdd={isGuest ? (task) => { addGuestTask(task); setShowModal(false) } : undefined}
        />
      )}

      <BottomNav />
    </div>
  )
}
