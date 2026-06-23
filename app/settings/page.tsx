'use client'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import BottomNav from '@/components/BottomNav'

const ACCENTS = [
  { name: 'Terracotta', value: '#C98B73' },
  { name: 'Sage',       value: '#7D9B74' },
  { name: 'Lavender',   value: '#8B78C2' },
  { name: 'Rose',       value: '#C27888' },
  { name: 'Slate',      value: '#6B8CAE' },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [phone,         setPhone]         = useState(user?.phoneNumber || '')
  const [notifyMin,     setNotifyMin]     = useState(user?.notifyMinutes || 15)
  const [darkMode,      setDarkMode]      = useState(user?.darkMode || false)
  const [accent,        setAccent]        = useState(user?.accentColor || '#C98B73')
  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [phoneSaving,   setPhoneSaving]   = useState(false)
  const [phoneSaved,    setPhoneSaved]    = useState(false)

  async function savePhone() {
    setPhoneSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    })
    setPhoneSaving(false)
    setPhoneSaved(true)
    setTimeout(() => setPhoneSaved(false), 2000)
  }

  async function saveSettings(patch: Record<string,any>) {
    setSaving(true)
    // Apply theme immediately
    if (patch.darkMode !== undefined) {
      document.documentElement.dataset.theme = patch.darkMode ? 'dark' : ''
      setDarkMode(patch.darkMode)
    }
    if (patch.accentColor !== undefined) {
      document.documentElement.style.setProperty('--accent', patch.accentColor)
      setAccent(patch.accentColor)
    }
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="app-shell">
      <div className="greeting-section">
        <h1>Settings</h1>
      </div>

      {/* Profile */}
      <div className="settings-section">
        <p className="settings-label">Profile</p>
        <div className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar"
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{session?.user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{session?.user?.email}</div>
            </div>
          </div>
        </div>

        {/* Phone number */}
        <p className="settings-label">Phone Number (for SMS reminders)</p>
        <div className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              id="input-phone"
              className="form-input"
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ flex: 1 }}
            />
            <button id="btn-save-phone" onClick={savePhone} disabled={phoneSaving}
              className="btn-primary"
              style={{ width: 'auto', padding: '0 20px', marginTop: 0 }}>
              {phoneSaved ? '✓ Saved' : phoneSaving ? '…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <p className="settings-label">Notify me before</p>
        <div className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[5, 15, 30, 60].map(m => (
              <button key={m} id={`notify-${m}`}
                onClick={() => { setNotifyMin(m); saveSettings({ notifyMinutes: m }) }}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  border: notifyMin === m ? 'none' : '1.5px solid var(--border)',
                  background: notifyMin === m ? 'var(--accent)' : 'var(--beige)',
                  color: notifyMin === m ? 'white' : 'var(--text-muted)',
                  fontFamily: 'Nunito', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {m} min
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <p className="settings-label">Appearance</p>
        <div className="settings-item">
          <div className="settings-item-left">
            <span className="settings-item-icon">🌙</span>
            <div>
              <div className="settings-item-title">Warm Dark Mode</div>
              <div className="settings-item-sub">Easy on the eyes at night</div>
            </div>
          </div>
          <label className="toggle">
            <input id="toggle-dark-mode" type="checkbox" checked={darkMode}
              onChange={e => saveSettings({ darkMode: e.target.checked })} />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Accent color */}
        <div className="card" style={{ marginTop: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>
            ACCENT COLOR
          </p>
          <div className="accent-swatches">
            {ACCENTS.map(a => (
              <button key={a.value} id={`accent-${a.name.toLowerCase()}`}
                className={`swatch${accent === a.value ? ' active' : ''}`}
                style={{ background: a.value }}
                title={a.name}
                onClick={() => saveSettings({ accentColor: a.value })}
              />
            ))}
          </div>
        </div>

        {saved && (
          <p style={{ color: 'var(--sage)', fontSize: 13, textAlign: 'center', marginTop: 12 }}>
            ✓ Settings saved
          </p>
        )}

        {/* Sign out */}
        <p className="settings-label">Account</p>
        <div className="settings-item" style={{ cursor: 'pointer' }}
          onClick={() => signOut({ callbackUrl: '/login' })} id="btn-signout">
          <div className="settings-item-left">
            <span className="settings-item-icon">🚪</span>
            <div className="settings-item-title" style={{ color: '#C97070' }}>Sign Out</div>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
