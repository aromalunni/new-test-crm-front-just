import { useState, useMemo } from 'react'
import clsx from 'clsx'
import { ArrowUp, ChevronDown, Plus } from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import KpiCard from '../../components/KpiCard.jsx'
import Sparkline from '../../components/Sparkline.jsx'
import DataTable from '../../components/DataTable.jsx'
import DonutChart from '../../components/DonutChart.jsx'
import LineTrend from '../../components/LineTrend.jsx'
import PipelineFunnel from '../../components/PipelineFunnel.jsx'
import ChevronFunnel from '../../components/ChevronFunnel.jsx'
import Modal from '../../components/Modal.jsx'
import { useShell } from '../../context/shell.jsx'
import { repTabs, reps } from '../../data/teamDrilldown.js'

const RANGE_OPTIONS = [
  { key: '14', label: 'Last 14 days' },
  { key: '7', label: 'Last 7 days' },
  { key: '30', label: 'Last 30 days' },
]

const ACH_TONES = {
  amber: 'bg-amberSoft text-[#B97A1C]',
  blue: 'bg-blue/10 text-blue',
  green: 'bg-greenSoft text-green',
}

// Static score ring — big number + caps caption over an orange arc.
function ScoreRing({ value, max = 100, size = 96, stroke = 8 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECE7E1" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F26B3A"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
        />
      </svg>
      <span className="absolute flex flex-col items-center leading-none">
        <span className="text-2xl font-bold text-ink">{value}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-inkSoft">Score</span>
      </span>
    </div>
  )
}

// A label + big % + green delta + grey "vs team avg" tile (conversion overview).
function StatTile({ label, value, delta, teamAvg }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-canvas/40 p-4">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">{label}</span>
      <span className="mt-2 text-2xl font-bold leading-none text-ink">{value}</span>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green">
        <ArrowUp className="h-3.5 w-3.5" />
        {delta}
      </span>
      <span className="mt-1 text-xs font-medium text-inkSoft">{teamAvg}</span>
    </div>
  )
}

function DropFilter({ value, onChange, options }) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-xl border border-border bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas focus:border-brand-orange/40 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
    </div>
  )
}

export default function Drilldown() {
  const { toast: notify } = useShell()
  const [activeRep, setActiveRep] = useState('ravi')
  const [range, setRange] = useState('14')
  const [extraNotes, setExtraNotes] = useState({}) // { [repKey]: note[] }
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [listModal, setListModal] = useState(null) // 'notes' | 'achievements' | 'won' | null

  const data = reps[activeRep]
  const rep = data.header
  const {
    kpis,
    personalFunnel,
    conversionRate,
    responseTrend,
    activityLog,
    leadSources,
    leadStatus,
    conversionTiles,
    conversionFunnel,
    achievements,
    wonDeals,
  } = data

  const coachingNotes = useMemo(
    () => [...(extraNotes[activeRep] || []), ...data.coachingNotes],
    [extraNotes, activeRep, data.coachingNotes],
  )

  function saveNote() {
    if (!noteText.trim()) return
    const note = { id: `nx-${Date.now()}`, date: 'Today', author: 'Suresh Jayan', text: noteText.trim() }
    setExtraNotes((prev) => ({ ...prev, [activeRep]: [note, ...(prev[activeRep] || [])] }))
    setNoteText('')
    setNoteOpen(false)
    notify(`Coaching note added — ${rep.name}`)
  }

  const activityColumns = [
    { key: 'date', header: 'Date', className: 'font-semibold' },
    { key: 'leads', header: 'Leads', align: 'right', className: 'tabular-nums' },
    { key: 'calls', header: 'Calls', align: 'right', className: 'tabular-nums' },
    { key: 'visits', header: 'Visits', align: 'right', className: 'tabular-nums' },
    { key: 'proposals', header: 'Proposals', align: 'right', className: 'tabular-nums' },
    { key: 'conversions', header: 'Conversions', align: 'right', className: 'tabular-nums' },
    { key: 'revenue', header: 'Revenue', align: 'right', className: 'font-semibold tabular-nums' },
    {
      key: 'sla',
      header: 'SLA %',
      align: 'right',
      render: (row) => (
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums',
            row.sla >= 90 ? 'bg-greenSoft text-green' : 'bg-amberSoft text-[#B97A1C]',
          )}
        >
          {row.sla}%
        </span>
      ),
    },
  ]

  const wonColumns = [
    { key: 'lead', header: 'Lead', className: 'font-semibold' },
    { key: 'customer', header: 'Customer' },
    { key: 'size', header: 'System Size', className: 'tabular-nums' },
    { key: 'close', header: 'Close Date', className: 'tabular-nums' },
    { key: 'revenue', header: 'Revenue', align: 'right', className: 'font-semibold tabular-nums' },
  ]

  return (
    <div className="space-y-4">
      {/* 1 — Rep tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border">
        {repTabs.map((t) => {
          const isActive = activeRep === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveRep(t.key)}
              className={clsx(
                '-mb-px border-b-2 pb-3 text-sm font-bold tracking-tight transition-colors',
                isActive
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-inkSoft hover:text-ink',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* 2 — Header card */}
      <Card className="!p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={rep.name} initials={rep.initials} color={rep.color} size="lg" className="!h-16 !w-16 !text-xl" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-ink">{rep.name}</h2>
              <div className="mt-1 text-sm font-semibold text-inkSoft">{rep.badges}</div>
              <p className="mt-1.5 text-sm italic text-inkSoft">“{rep.quote}”</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
            <ScoreRing value={rep.score} />
            <div className="flex flex-col">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-green">
                <ArrowUp className="h-4 w-4" />
                {rep.scoreDelta.replace('↑ ', '')}
              </span>
              <span className="text-xs font-medium text-inkSoft">{rep.scoreNote}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 — KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaDirection={k.dir}
            deltaNote={k.note}
            icon={k.icon}
          />
        ))}
      </div>

      {/* 4 — Personal funnel + response trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="!p-5" title="Personal Funnel">
          <PipelineFunnel stages={personalFunnel} />
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">Conversion Rate</div>
              <div className="mt-1 text-3xl font-bold leading-none text-green">{conversionRate.value}</div>
              <div className="mt-1.5 text-xs font-medium text-inkSoft">{conversionRate.teamAvg}</div>
            </div>
            <Sparkline data={conversionRate.spark} width={120} height={40} color="#1FA463" strokeWidth={2} />
          </div>
        </Card>

        <Card
          className="!p-5"
          title="Response Time Trend - 14d"
          right={
            <DropFilter
              value={range}
              onChange={(v) => {
                setRange(v)
                notify(`Range: ${RANGE_OPTIONS.find((o) => o.key === v).label}`)
              }}
              options={RANGE_OPTIONS}
            />
          }
        >
          <LineTrend data={responseTrend.data} series={responseTrend.series} height={220} />
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {responseTrend.series.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-inkSoft">
                <span
                  className="inline-block h-0.5 w-5"
                  style={{
                    backgroundColor: s.color,
                    ...(s.dash ? { backgroundImage: 'none', borderTop: `2px dashed ${s.color}`, height: 0 } : {}),
                  }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* 5 — Activity log */}
      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-ink">Activity Log - Last 7 Days</h3>
        </div>
        <DataTable columns={activityColumns} rows={activityLog} pageSize={10} className="!rounded-none !border-0" />
      </Card>

      {/* 6 — Donuts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="!p-5" title="Top Lead Sources">
          <DonutChart
            data={leadSources.data}
            centerValue={leadSources.centerValue}
            centerCaption={leadSources.centerCaption}
          />
        </Card>
        <Card className="!p-5" title="Lead Status Breakdown">
          <DonutChart
            data={leadStatus.data}
            centerValue={leadStatus.centerValue}
            centerCaption={leadStatus.centerCaption}
          />
        </Card>
      </div>

      {/* 7 — Conversion overview */}
      <Card className="!p-5" title="Conversion Overview">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {conversionTiles.map((t) => (
            <StatTile key={t.id} label={t.label} value={t.value} delta={t.delta} teamAvg={t.teamAvg} />
          ))}
        </div>
      </Card>

      {/* 8 — Conversion funnel */}
      <Card className="!p-5" title="Conversion Funnel">
        <ChevronFunnel stages={conversionFunnel} />
      </Card>

      {/* 9 — Coaching notes + achievements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          className="!p-5"
          title="Coaching Notes"
          right={
            <button
              type="button"
              onClick={() => {
                setNoteText('')
                setNoteOpen(true)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Note
            </button>
          }
        >
          <div className="space-y-3">
            {coachingNotes.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-canvas/40 p-3">
                <div className="text-xs font-bold text-ink">
                  {n.date} · {n.author}
                </div>
                <p className="mt-1 text-sm text-inkSoft">{n.text}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setListModal('notes')}
            className="mt-4 text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
          >
            View all notes →
          </button>
        </Card>

        <Card className="!p-5" title="Recent Achievements">
          <div className="space-y-3">
            {achievements.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-canvas/40 p-3">
                  <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', ACH_TONES[a.tone])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{a.text}</span>
                  <span className="shrink-0 text-xs font-medium text-inkSoft">{a.date}</span>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setListModal('achievements')}
            className="mt-4 text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
          >
            View all achievements →
          </button>
        </Card>
      </div>

      {/* 10 — Top won deals */}
      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-ink">Top Won Deals</h3>
        </div>
        <DataTable columns={wonColumns} rows={wonDeals} pageSize={10} className="!rounded-none !border-0" />
        <div className="border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={() => setListModal('won')}
            className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
          >
            View all won deals →
          </button>
        </div>
      </Card>

      {/* Add coaching note modal */}
      <Modal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        title="Add coaching note"
        subtitle={`Note for ${rep.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setNoteOpen(false)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteText.trim()}
              onClick={saveNote}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save note
            </button>
          </>
        }
      >
        <textarea
          autoFocus
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Share feedback or a coaching tip…"
          className="w-full resize-none rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
        />
      </Modal>

      {/* View all (notes / achievements / won deals) modal */}
      <Modal
        open={!!listModal}
        onClose={() => setListModal(null)}
        width="max-w-lg"
        title={
          listModal === 'notes'
            ? 'All coaching notes'
            : listModal === 'achievements'
              ? 'All achievements'
              : 'All won deals'
        }
        subtitle={rep.name}
      >
        {listModal === 'notes' && (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {coachingNotes.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-canvas/40 p-3">
                <div className="text-xs font-bold text-ink">
                  {n.date} · {n.author}
                </div>
                <p className="mt-1 text-sm text-inkSoft">{n.text}</p>
              </div>
            ))}
          </div>
        )}

        {listModal === 'achievements' && (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {achievements.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-canvas/40 p-3">
                  <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', ACH_TONES[a.tone])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold text-ink">{a.text}</span>
                  <span className="shrink-0 text-xs font-medium text-inkSoft">{a.date}</span>
                </div>
              )
            })}
          </div>
        )}

        {listModal === 'won' && (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {wonDeals.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-canvas/40 p-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">{d.customer}</div>
                  <div className="text-xs font-medium text-inkSoft">
                    {d.lead} · {d.size} · {d.close}
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-ink tabular-nums">{d.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
