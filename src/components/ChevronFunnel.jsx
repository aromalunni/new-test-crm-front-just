// Horizontal chevron/arrow funnel (used by the Performance Drilldown). Each
// stage is a right-pointing chevron with label + number, and a % beneath.
//   stages: [{ label, value, pct? }]
const PALE_GREEN = [
  '#E5F4EC',
  '#D2EDDD',
  '#BFE6CE',
  '#ACDFBF',
  '#99D8B0',
  '#86D1A1',
  '#73CA92',
  '#60C383',
]

export default function ChevronFunnel({ stages, className }) {
  const base = stages[0]?.value || 1

  return (
    <div className={className}>
      <div className="flex">
        {stages.map((stage, i) => {
          const isFirst = i === 0
          const clip = isFirst
            ? 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)'
            : 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)'
          return (
            <div
              key={stage.label}
              className="relative flex-1"
              style={{ marginLeft: isFirst ? 0 : -12, zIndex: stages.length - i }}
            >
              <div
                className="flex flex-col items-center justify-center px-3 py-4 text-center"
                style={{
                  backgroundColor: PALE_GREEN[i % PALE_GREEN.length],
                  clipPath: clip,
                }}
              >
                <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-[#2C6E49]">
                  {stage.label}
                </span>
                <span className="text-xl font-bold leading-tight text-ink">{stage.value}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-1 flex">
        {stages.map((stage) => {
          const pct = stage.pct != null ? stage.pct : Math.round((stage.value / base) * 100)
          return (
            <div key={stage.label} className="flex-1 text-center text-[11px] font-medium text-inkSoft">
              {pct}%
            </div>
          )
        })}
      </div>
    </div>
  )
}
