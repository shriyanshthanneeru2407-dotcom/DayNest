'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-logo">🪺</div>
      <h1 className="login-title">DayNest</h1>
      <p className="login-subtitle">
        A calm place for your tasks.<br />
        Gentle. Cozy. Yours.
      </p>

      <button
        id="btn-google-signin"
        className="btn-google"
        onClick={() => signIn('google', { callbackUrl: '/today' })}
      >
        <span className="btn-google-icon">🌐</span>
        Continue with Google
      </button>

      <p style={{ marginTop: 32, fontSize: 12, color: 'var(--text-muted)', maxWidth: 260, lineHeight: 1.6 }}>
        We use Google to send you gentle reminders via Gmail when your tasks are due.
      </p>
    </div>
  )
}
