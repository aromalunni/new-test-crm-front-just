import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// Donut with a center label (big number + caption) and a legend listing each
// segment's count and share. data: [{ name, value, color }].
export default function DonutChart({
  data,
  centerValue,
  centerCaption,
  size = 168,
  thickness = 24,
  legend = true,
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={size / 2 - thickness}
              outerRadius={size / 2}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none text-ink">{centerValue ?? total}</span>
          {centerCaption && (
            <span className="mt-1 text-[11px] font-medium text-inkSoft">{centerCaption}</span>
          )}
        </div>
      </div>

      {legend && (
        <ul className="flex-1 space-y-2">
          {data.map((d) => {
            const pct = total ? Math.round((d.value / total) * 100) : 0
            return (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate text-inkSoft">{d.name}</span>
                <span className="ml-auto font-semibold text-ink">{d.value}</span>
                <span className="w-9 text-right text-xs text-inkSoft">{pct}%</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
