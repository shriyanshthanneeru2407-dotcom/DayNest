'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="login-page">
      <div className="login-logo">🪺</div>
      <h1 className="login-title">DayNest</h1>
      <p className="login-subtitle">
        A calm place for your tasks.<br />
        Gentle. Cozy. Yours.
      </p>

      {/* Google Sign In */}
      <button
        id="btn-google-signin"
        className="btn-google"
        onClick={() => signIn('google', { callbackUrl: '/today' })}
      >
        <span className="btn-google-icon">🌐</span>
        Continue with Google
      </button>

      <p style={{ margin: '16px 0 8px', fontSize: 12, color: 'var(--text-muted)' }}>— or —</p>

      {/* Guest Mode */}
      <button
        id="btn-guest"
        onClick={() => router.push('/today')}
        style={{
          background: 'none',
          border: '1.5px solid var(--beige-dark)',
          borderRadius: 'var(--radius-md)',
          padding: '13px 32px',
          fontFamily: 'Nunito, sans-serif',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: 320,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = 'var(--accent)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--beige-dark)'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        🌿 Try as Guest
      </button>

      <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)', maxWidth: 280, lineHeight: 1.7, textAlign: 'center' }}>
        <strong>Guest mode</strong>: tasks saved in your browser.<br />
        Sign in with Google to enable Gmail & SMS reminders.
      </p>
    </div>
  )
}
