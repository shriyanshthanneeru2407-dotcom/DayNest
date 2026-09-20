'use client'

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-ornament">
        <span className="footer-ornament-icon">🌱</span>
        <span className="footer-ornament-dot">✦</span>
        <span className="footer-ornament-icon">🪺</span>
        <span className="footer-ornament-dot">✦</span>
        <span className="footer-ornament-icon">☕</span>
      </div>

      <div className="footer-brand">
        <h3 className="footer-brand-title">DayNest</h3>
        <p className="footer-tagline">
          Where mindful productivity meets calm living.
        </p>
      </div>

      <div className="footer-credit-card">
        <div className="footer-credit-label">ENGINEERED & DESIGNED BY</div>
        <div className="footer-author-name">Shriyansh Thanneeru</div>
        <p className="footer-author-desc">
          Crafting calm digital spaces & mindful slow-living software.
        </p>
      </div>

      <div className="footer-meta">
        <p className="footer-rights">
          © {new Date().getFullYear()} DayNest. All Rights Reserved.
        </p>
        <p className="footer-motto">
          Gentle task care • Calendar rhythms • Quiet reminders
        </p>
      </div>
    </footer>
  )
}
