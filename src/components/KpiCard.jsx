import clsx from 'clsx'
import { ArrowUp, ArrowDown } from 'lucide-react'

import ProgressBar from './ProgressBar.jsx'

// Headline metric: tiny caps label, big number, optional delta line and icon,
// optional mini progress bar at the bottom.
export default function KpiCard({
  label,
  value,
  delta,
  deltaDirection = 'up',
  deltaNote,
  icon: Icon,
  progress,
  className,
}) {
  const down = deltaDirection === 'down'

  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-inkSoft">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className="mt-2 text-3xl font-bold leading-none text-ink">{value}</p>

      {delta != null && (
        <p
          className={clsx(
            'mt-2 flex items-center gap-1 text-xs font-semibold',
            down ? 'text-red' : 'text-green',
          )}
        >
          {down ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
          {delta}
          {deltaNote && <span className="font-medium text-inkSoft">{deltaNote}</span>}
        </p>
      )}

      {progress != null && <ProgressBar value={progress} className="mt-3" />}
    </div>
  )
}
