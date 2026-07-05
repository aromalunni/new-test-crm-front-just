import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

// One or two line series with a small axis and an optional dashed target line.
//   series: [{ key, color, label? }]
function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-inkSoft">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold text-ink">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function LineTrend({
  data,
  xKey = 'label',
  series = [{ key: 'value', color: '#F26B3A', label: 'Value' }],
  target,
  height = 220,
  grid = true,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" stroke="#ECE7E1" vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#5B6675' }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#5B6675' }}
          width={36}
        />
        <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#ECE7E1' }} />
        {target != null && (
          <ReferenceLine
            y={target}
            stroke="#5B6675"
            strokeDasharray="5 4"
            label={{ value: `Target ${target}`, position: 'right', fontSize: 10, fill: '#5B6675' }}
          />
        )}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label || s.key}
            stroke={s.color}
            strokeWidth={2.5}
            strokeDasharray={s.dash ? '5 4' : undefined}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
