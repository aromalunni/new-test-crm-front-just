import clsx from 'clsx'

// Circle with initials. Background color is derived from a hash of the name
// unless an explicit `color` is given.
const PALETTE = [
  '#F26B3A',
  '#2F6FED',
  '#1FA463',
  '#F1A33B',
  '#E0533D',
  '#7C5CD6',
  '#0E8C86',
  '#0E1B2E',
]

const SIZES = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
}

function hashColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/)
  const text = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
  return text || '?'
}

export default function Avatar({ name = '', initials, color, size = 'md', className }) {
  const bg = color || hashColor(name)

  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        SIZES[size] || SIZES.md,
        className,
      )}
      style={{ backgroundColor: bg }}
      title={name || undefined}
    >
      {initials || initialsOf(name)}
    </span>
  )
}
