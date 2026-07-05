import clsx from 'clsx'

// Small bold section title with an optional count chip and a right-aligned action.
export default function SectionHeader({ title, count, action, className }) {
  return (
    <div className={clsx('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {count != null && (
          <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-semibold text-inkSoft">
            {count}
          </span>
        )}
      </div>
      {action != null && <div className="shrink-0">{action}</div>}
    </div>
  )
}
