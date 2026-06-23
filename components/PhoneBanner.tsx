'use client'
import { useState } from 'react'

export default function PhoneBanner() {
  const [show, setShow]   = useState(true)
  const [open, setOpen]   = useState(false)
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  if (!show) return null

  async function save() {
    if (!phone.trim()) return
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    })
    setShow(false)
  }

  return (
    <>
      <div className="phone-banner">
        <span className="phone-banner-icon">📱</span>
        <div className="phone-banner-text">
          Add your phone for SMS reminders
        </div>
        <button className="phone-banner-btn" id="btn-add-phone-banner" onClick={() => setOpen(true)}>
          Add
        </button>
        <button onClick={() => setShow(false)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', marginLeft: 4 }}>
          ✕
        </button>
      </div>

      {open && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <h2 className="modal-title">Add Phone Number 📱</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 20 }}>
              We'll send SMS reminders before your tasks are due.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="phone-input">Phone Number (with country code)</label>
              <input id="phone-input" className="form-input" placeholder="+1 555 000 0000"
                value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoFocus />
            </div>
            <button id="btn-save-phone-banner" className="btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save & Continue 🌿'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
