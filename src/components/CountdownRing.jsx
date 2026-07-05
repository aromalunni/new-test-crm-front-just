import { useState, useEffect } from 'react'
import clsx from 'clsx'

// Circular SVG ring + mm:ss label that ticks down once a second and turns red
// when it nears zero. Optional `icon` renders a glyph above the time (e.g. an
// hourglass); `dashed` draws the ring as a dashed circle instead of a draining
// solid arc.
export default function CountdownRing({
  seconds = 120,
  size = 64,
  stroke = 6,
  warnAt = 15,
  icon: Icon,
  dashed = false,
  onComplete,
  className,
}) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id)
          onComplete?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // Restart whenever the configured duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds])

  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = seconds > 0 ? remaining / seconds : 0
  const warn = remaining <= warnAt
  const color = warn ? '#E0533D' : '#F26B3A'
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {dashed ? (
          // Decorative dashed ring — the time label carries the countdown.
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray="3 5"
            style={{ transition: 'stroke 0.3s linear' }}
          />
        ) : (
          <>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECE7E1" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </>
        )}
      </svg>
      <span
        className={clsx(
          'absolute flex flex-col items-center leading-none',
          warn ? 'text-red' : 'text-ink',
        )}
      >
        {Icon && <Icon className={clsx('mb-0.5 h-4 w-4', warn ? 'text-red' : 'text-brand-orange')} strokeWidth={2} />}
        <span className="text-sm font-bold tabular-nums">
          {mm}:{ss}
        </span>
      </span>
    </div>
  )
}
