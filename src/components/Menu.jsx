import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

// Reusable dropdown menu. Renders a trigger button; on click, opens a panel of
// options below it. Closes on outside-click / Escape / option-select.
//
// Props:
//   label    — trigger text (string or node)
//   icon     — optional leading lucide icon component for the trigger
//   value    — currently selected option value (shows a check + active style)
//   options  — [{ value, label, icon?, danger? }]
//   onSelect — (value) => void
//   align    — 'left' | 'right' (panel alignment), default 'left'
//   chevron  — show the trailing chevron on the trigger, default true
//   className, panelClassName — extra classes
export default function Menu({
  label,
  icon: Icon,
  value,
  options = [],
  onSelect,
  align = 'left',
  chevron = true,
  className,
  panelClassName,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
        {chevron && (
          <ChevronDown
            className={clsx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          />
        )}
      </button>

      {open && (
        <div
          className={clsx(
            'absolute top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {options.map((opt) => {
            const OptIcon = opt.icon
            const isActive = value != null && opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelect?.(opt.value)
                  setOpen(false)
                }}
                className={clsx(
                  'flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors',
                  opt.danger
                    ? 'font-semibold text-red hover:bg-redSoft/40'
                    : isActive
                      ? 'font-semibold text-brand-orange'
                      : 'text-ink hover:bg-canvas',
                )}
              >
                {OptIcon && <OptIcon className="h-4 w-4 shrink-0 text-inkSoft" />}
                <span className="flex-1">{opt.label}</span>
                {isActive && <span className="text-brand-orange">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
