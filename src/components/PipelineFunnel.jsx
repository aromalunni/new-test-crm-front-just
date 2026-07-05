import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Horizontal row of colored segments, each stacking a white caps label over a
// number, with a tiny % beneath the row. Warm gradient left → right.
//   stages: [{ label, value, pct?, color? }]
// The card stays a fixed width; when the pipeline is longer than fits (e.g. the
// full 14-stage lifecycle) the segments overflow and are paged with the arrows.
const GRADIENT = [
  '#E0533D', // red-orange
  '#F26B3A', // orange
  '#F1843A',
  '#F1A33B', // amber
  '#D7B53C', // yellow-green
  '#A9C13E', // lime
  '#6FB648',
  '#3FA45C', // green
  '#1FA463', // green
  '#138A52', // deep green
]

// Hoisted to module scope so it keeps a stable component identity across renders
// — defined inline it would remount both buttons every render, dropping focus and
// restarting the opacity fade.
function Arrow({ side, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Scroll pipeline left' : 'Scroll pipeline right'}
      className={clsx(
        'absolute top-[26px] z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-opacity',
        side === 'left' ? 'left-0' : 'right-0',
        disabled ? 'pointer-events-none opacity-0' : 'opacity-100 hover:bg-canvas',
      )}
    >
      {side === 'left' ? (
        <ChevronLeft className="h-4 w-4 text-ink" />
      ) : (
        <ChevronRight className="h-4 w-4 text-ink" />
      )}
    </button>
  )
}

export default function PipelineFunnel({ stages, className, compact = false }) {
  const total = stages.reduce((sum, s) => sum + s.value, 0)
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  // Each segment keeps a readable min width and scrolls instead of squashing.
  // `compact` packs more stages into a narrow card before paging kicks in.
  const segment = clsx(compact ? 'min-w-[62px]' : 'min-w-[84px]', 'flex-1')

  function refresh() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 1)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    refresh()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', refresh, { passive: true })
    window.addEventListener('resize', refresh)
    return () => {
      el.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
    }
  }, [stages.length])

  // Page roughly three segments at a time.
  function scrollByAmount(dir) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 264, behavior: 'smooth' })
  }

  return (
    <div className={clsx('relative', className)}>
      <Arrow side="left" disabled={!canLeft} onClick={() => scrollByAmount(-1)} />
      <Arrow side="right" disabled={!canRight} onClick={() => scrollByAmount(1)} />

      <div ref={scrollRef} className="no-scrollbar overflow-x-auto scroll-smooth">
        <div className="min-w-max">
          <div className="flex gap-1 overflow-hidden rounded-xl">
            {stages.map((stage, i) => (
              <div
                key={stage.label}
                className={clsx(
                  segment,
                  'flex flex-col items-center justify-center text-center',
                  compact ? 'px-1.5 py-2.5' : 'px-2 py-3',
                )}
                style={{ backgroundColor: stage.color || GRADIENT[i % GRADIENT.length] }}
              >
                <span className="text-[10px] font-bold uppercase leading-tight tracking-wide text-white/90">
                  {stage.label}
                </span>
                <span
                  className={clsx('font-bold leading-tight text-white', compact ? 'text-base' : 'text-lg')}
                >
                  {stage.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            {stages.map((stage) => {
              const pct =
                stage.pct != null ? stage.pct : total ? Math.round((stage.value / total) * 100) : 0
              return (
                <div
                  key={stage.label}
                  className={clsx(segment, 'text-center text-[11px] font-medium text-inkSoft')}
                >
                  {pct}%
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
