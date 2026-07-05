import clsx from 'clsx'

// Track + orange fill. Optional label row above the bar; optional % readout.
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  className,
  barClassName,
}) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0))

  return (
    <div className={className}>
      {(label != null || showValue) && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-inkSoft">
          <span>{label}</span>
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={clsx('h-full rounded-full bg-brand-orange', barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
