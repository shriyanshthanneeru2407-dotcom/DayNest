'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/today',    icon: '🏠', label: 'Today'    },
  { href: '/tasks',    icon: '📝', label: 'Tasks'    },
  { href: '/calendar', icon: '📅', label: 'Calendar' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV.map(n => (
        <Link
          key={n.href}
          href={n.href}
          id={`nav-${n.label.toLowerCase()}`}
          className={`nav-item${path.startsWith(n.href) ? ' active' : ''}`}
        >
          <span style={{ fontSize: 22 }}>{n.icon}</span>
          <span>{n.label}</span>
        </Link>
      ))}
    </nav>
  )
}
