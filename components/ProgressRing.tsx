'use client'

interface Props {
  done: number
  total: number
}

export default function ProgressRing({ done, total }: Props) {
  const pct     = total === 0 ? 0 : Math.round((done / total) * 100)
  const r       = 34
  const circ    = 2 * Math.PI * r
  const offset  = circ - (pct / 100) * circ
  const emoji   = pct === 100 ? '🌟' : pct >= 60 ? '🌱' : pct >= 30 ? '☀️' : '🌙'

  return (
    <div className="progress-ring-wrap">
      <svg className="progress-ring-svg" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--beige)" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke="var(--accent)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 16, fill: 'var(--accent)', fontFamily: 'Nunito', fontWeight: 700 }}>
          {pct}%
        </text>
      </svg>
      <div className="progress-text">
        <strong>{done}/{total} {emoji}</strong>
        {pct === 100
          ? 'All done! Amazing work today ✨'
          : pct >= 60
          ? `${pct}% done today — keep going!`
          : `${pct}% done today — you've got this!`}
      </div>
    </div>
  )
}
