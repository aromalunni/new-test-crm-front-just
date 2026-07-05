import clsx from 'clsx'

// Small neutral label pill (with an optional leading icon).
export default function Pill({ children, icon: Icon, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border border-border bg-canvas px-2.5 py-0.5 text-[11px] font-medium text-inkSoft',
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}
