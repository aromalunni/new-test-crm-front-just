// Tiny inline SVG line for table cells. Pass an array of numbers.
export default function Sparkline({
  data,
  width = 72,
  height = 24,
  color = '#F26B3A',
  strokeWidth = 1.5,
}) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const points = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * (height - 2) - 1).toFixed(1)}`)
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      className="inline-block overflow-visible align-middle"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
