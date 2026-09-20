'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import TaskCard     from '@/components/TaskCard'
import ProgressRing from '@/components/ProgressRing'
import AddTaskModal from '@/components/AddTaskModal'
import BottomNav    from '@/components/BottomNav'
import PhoneBanner  from '@/components/PhoneBanner'
import AppFooter    from '@/components/AppFooter'
import useTasks     from '@/hooks/useTasks'
import { toggleFocusSound } from '@/lib/soundscape'

const QUOTES = [
  'Small steps still move you forward. 🌿',
  'Today is a fresh page. Write something gentle. ☕',
  'Rest is also part of the journey. 🌙',
  'You don\'t have to do it all. Just begin. 🌸',
  'Progress over perfection, always. 🕊️',
  'One task at a time. Breathe. 🍃',
]

const WEATHERS = [
  { icon: '🌤️', temp: '22°C', label: 'Gentle Sun' },
  { icon: '🍃', temp: '19°C', label: 'Soft Breeze' },
  { icon: '🌧️', temp: '18°C', label: 'Cozy Rain' },
  { icon: '✨', temp: '20°C', label: 'Clear Sky' },
]

const MOODS = [
  '🕊️ Peaceful',
  '⚡ Focused',
  '☕ Reflective',
  '🌱 Creative',
  '🌸 Grateful',
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
  const [weatherIdx, setWeatherIdx] = useState(0)
  const [selectedMood, setSelectedMood] = useState('🕊️ Peaceful')
  const [habits,    setHabits]    = useState<Record<string,boolean>>({
    '💧 Water': false, '🧘 Meditate': false, '📖 Read': false, '🌿 Walk': false,
  })
  const [musicOn, setMusicOn] = useState(false)
  const [dismissGuest, setDismissGuest] = useState(false)
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const { tasks, loading, refresh, toggle, remove, addGuestTask, isGuest } = useTasks(todayStr())
  const done  = tasks.filter(t => t.completed).length
  const total = tasks.length

  const userName = session?.user?.name?.split(' ')[0] || 'there'
  const currentWeather = WEATHERS[weatherIdx]

  // Stop ambient sound on component unmount
  useEffect(() => {
    return () => {
      toggleFocusSound(false)
    }
  }, [])

  function handleMusicToggle() {
    const nextState = !musicOn
    const ok = toggleFocusSound(nextState)
    setMusicOn(nextState && ok)
  }

  return (
    <div className="app-shell">
      {/* Brand Header & Tagline */}
      <header className="main-brand-header">
        <div className="brand-badge">
          <span className="brand-badge-icon">🪺</span>
          <span className="brand-badge-name">DayNest</span>
        </div>
        <p className="brand-main-tagline">
          Where mindful productivity meets calm living — caring for your day, not completing a checklist.
        </p>
      </header>

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
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontSize: 20 }}>🪺</span>
          <div style={{ flex: 1, fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>
            You're browsing in guest mode. Tasks are saved safely in your browser.
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

      {/* About DayNest Story Section */}
      <section className="about-nest-section">
        <div className="about-nest-header">
          <h2 className="about-nest-title">About DayNest</h2>
          <span className="about-nest-chip">Slow Living</span>
        </div>
        <p className="about-nest-tagline">
          A vintage journal-inspired productivity sanctuary.
        </p>
        <p className="about-nest-desc">
          DayNest is crafted to transform task management into a peaceful, intentional ritual. Inspired by classic paper notebooks and slow living, DayNest blends minimal productivity with gentle notifications via Gmail &amp; SMS so you never miss what matters without feeling rushed.
        </p>

        <div className="about-pillars">
          <div className="about-pillar-card">
            <span className="about-pillar-icon">🕊️</span>
            <div>
              <span className="about-pillar-title">Calm Flow</span>
              <span className="about-pillar-sub">Warm ivory, paper texture &amp; distraction-free focus</span>
            </div>
          </div>
          <div className="about-pillar-card">
            <span className="about-pillar-icon">📅</span>
            <div>
              <span className="about-pillar-title">Monthly Rhythm</span>
              <span className="about-pillar-sub">Sage dot indicators connecting each day's pace</span>
            </div>
          </div>
          <div className="about-pillar-card">
            <span className="about-pillar-icon">💌</span>
            <div>
              <span className="about-pillar-title">Quiet Reminders</span>
              <span className="about-pillar-sub">Gentle Gmail &amp; SMS notifications when events are due</span>
            </div>
          </div>
          <div className="about-pillar-card">
            <span className="about-pillar-icon">🌿</span>
            <div>
              <span className="about-pillar-title">Care Trackers</span>
              <span className="about-pillar-sub">Hydration, mindful habits, weather &amp; ambient rain audio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}{!isGuest ? `, ${userName}` : ''}</h1>
        <p className="greeting-date">{formatDate(new Date())}</p>
        <p className="greeting-quote">"{quote}"</p>
      </div>

      {/* Mindful Daily Energy / Mood Chips */}
      <div className="mood-section">
        <div className="mood-title">Today's Mindful Energy</div>
        <div className="mood-chips">
          {MOODS.map(m => (
            <button
              key={m}
              type="button"
              className={`mood-chip${selectedMood === m ? ' active' : ''}`}
              onClick={() => setSelectedMood(selectedMood === m ? '' : m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Phone number banner (signed-in only) */}
      {session && !(session.user as any).phoneNumber && <PhoneBanner />}

      {/* Progress Ring */}
      <div style={{ padding: '12px 16px 0' }}>
        <ProgressRing done={done} total={total} />
      </div>

      {/* Widget strip */}
      <div className="widget-strip">
        {/* Weather Widget */}
        <div
          className="widget-card"
          id="widget-weather"
          onClick={() => setWeatherIdx(i => (i + 1) % WEATHERS.length)}
          title="Tap to cycle weather mood"
        >
          <div className="widget-icon">{currentWeather.icon}</div>
          <div className="widget-label">{currentWeather.label}</div>
          <div className="widget-value">{currentWeather.temp}</div>
        </div>

        {/* Water Tracker Widget */}
        <div className="widget-card" id="widget-water" onClick={() => setWater(w => Math.min(w + 1, 8))}>
          <div className="widget-icon">💧</div>
          <div className="widget-label">Water</div>
          <div className="widget-value">{water}/8</div>
        </div>

        {/* Habits Summary Widget */}
        <div className="widget-card" id="widget-habits">
          <div className="widget-icon">☕</div>
          <div className="widget-label">Habits</div>
          <div className="widget-value">{Object.values(habits).filter(Boolean).length}/{Object.keys(habits).length}</div>
        </div>

        {/* Individual Habit Checkers */}
        {Object.entries(habits).map(([h, habitDone]) => (
          <div key={h} className="widget-card" id={`habit-${h}`}
            onClick={() => setHabits(p => ({ ...p, [h]: !p[h] }))}
            style={{ opacity: habitDone ? 1 : 0.6 }}>
            <div className="widget-icon">{h.split(' ')[0]}</div>
            <div className="widget-label">{h.split(' ').slice(1).join(' ')}</div>
            <div className="widget-value" style={{ fontSize: 14 }}>{habitDone ? '✓' : '○'}</div>
          </div>
        ))}

        {/* Focus Ambient Music Widget with Real Web Audio */}
        <div
          className="widget-card"
          id="widget-music"
          onClick={handleMusicToggle}
          title={musicOn ? 'Click to pause ambient sound' : 'Click to play ambient rain soundscape'}
          style={{ background: musicOn ? 'var(--sage)' : 'var(--surface)' }}
        >
          <div className="widget-icon">🎵</div>
          <div className="widget-label">Focus Sound</div>
          <div className="widget-value" style={{ fontSize: 12, color: musicOn ? '#2A4E30' : 'var(--accent)' }}>
            {musicOn ? 'Rain On' : 'Start'}
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
            <p style={{ marginTop: 4, fontSize: 12 }}>Tap the + button below to add one with gentle care.</p>
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

      {/* Bottom Footer with Rights Reserved & Credits */}
      <AppFooter />

      <BottomNav />
    </div>
  )
}
