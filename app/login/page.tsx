'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AppFooter from '@/components/AppFooter'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="login-page">
      <div className="login-logo">🪺</div>
      <h1 className="login-title">DayNest</h1>
      <p className="login-subtitle">
        Where mindful productivity meets calm living.<br />
        A gentle, cozy sanctuary for your daily rhythm.
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
        🌿 Try as Guest (No Login Required)
      </button>

      <p style={{ marginTop: 18, fontSize: 12, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.7, textAlign: 'center' }}>
        <strong>Guest mode</strong> saves tasks directly in your browser.<br />
        Connect with Google to unlock gentle Gmail &amp; SMS notifications.
      </p>

      {/* About the app summary */}
      <div style={{
        marginTop: 32,
        maxWidth: 360,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        textAlign: 'left',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>🌱</span>
          <strong style={{ fontFamily: 'Playfair Display, serif', fontSize: 15 }}>About DayNest</strong>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Inspired by vintage paper journals and slow living, DayNest turns task planning into a relaxing ritual with ivory palettes, calendar rhythms, and distraction-free mindfulness.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 440, marginTop: 24 }}>
        <AppFooter />
      </div>
    </div>
  )
}
