import clsx from 'clsx'

// Base surface used by almost every screen: white, rounded-2xl, soft shadow.
// Optional `title` (left) + `right` slot render a header row above the body.
export default function Card({ title, right, children, className, bodyClassName, ...rest }) {
  const hasHeader = title != null || right != null

  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title != null &&
            (typeof title === 'string' ? (
              <h3 className="text-sm font-bold text-ink">{title}</h3>
            ) : (
              title
            ))}
          {right != null && <div className="shrink-0">{right}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
