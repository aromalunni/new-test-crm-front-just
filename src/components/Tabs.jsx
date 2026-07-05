import clsx from 'clsx'

// Underline tabs. Active tab gets an orange underline + ink text. Each tab can
// be a string or { value, label, count }.
export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={clsx('flex items-center gap-6 border-b border-border', className)}>
      {tabs.map((tab) => {
        const key = typeof tab === 'string' ? tab : tab.value
        const label = typeof tab === 'string' ? tab : tab.label
        const count = typeof tab === 'object' ? tab.count : undefined
        const active = key === value

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            className={clsx(
              '-mb-px flex items-center gap-1.5 border-b-2 pb-2.5 pt-1 text-sm font-semibold transition-colors',
              active
                ? 'border-brand-orange text-ink'
                : 'border-transparent text-inkSoft hover:text-ink',
            )}
          >
            {label}
            {count != null && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  active ? 'bg-brand-orange/10 text-brand-orange' : 'bg-canvas text-inkSoft',
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
