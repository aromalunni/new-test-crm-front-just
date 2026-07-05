import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Users,
  UserRound,
  Filter,
  Clock,
  ArrowUp,
  AlertTriangle,
  Download,
  Plus,
  Check,
  Eye,
  Repeat,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import Sparkline from '../../components/Sparkline.jsx'
import DataTable from '../../components/DataTable.jsx'
import PipelineFunnel from '../../components/PipelineFunnel.jsx'
import Modal from '../../components/Modal.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
import { useShell } from '../../context/shell.jsx'
import { leadErnakulamPipeline } from '../../data/pipeline.js'
import { stageLabel } from '../../config/stages.js'
import {
  kpis,
  roster,
  bottlenecks,
  TREND_SERIES,
} from '../../data/teamDashboard.js'

const REP_OPTIONS = ['Ravi Kumar', 'Priya Nair', 'Arun Menon', 'Vinod Jose']

const KPI_ICONS = { team: Users, leads: UserRound, funnel: Filter, time: Clock }

const STATUS_LABELS = { elite: 'Elite', performer: 'Performer', active: 'Active', new: 'New' }

const TREND_COLORS = { up: '#1FA463', flat: '#5B6675', down: '#E0533D' }

const BOTTLENECK_TONES = {
  orange: { accent: 'border-l-brand-orange', tint: 'bg-brand-orange/[0.05]', icon: 'text-brand-orange', Icon: ArrowUpRight },
  amber: { accent: 'border-l-amber', tint: 'bg-amberSoft/60', icon: 'text-[#B97A1C]', Icon: TrendingDown },
  red: { accent: 'border-l-red', tint: 'bg-redSoft/60', icon: 'text-red', Icon: AlertTriangle },
}

// Pair pipeline.js counts with canonical 14-stage labels (src/config/stages.js).
// Percentages are computed by PipelineFunnel from the values.
const funnelStages = leadErnakulamPipeline.map((row) => ({
  label: stageLabel(row.stage),
  value: row.count,
}))

function KpiTile({ kpi }) {
  const Icon = KPI_ICONS[kpi.icon] || Users
  return (
    <Card className="!p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-inkSoft">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">{kpi.label}</p>
          <p className="mt-1.5 text-2xl font-bold leading-none text-ink">{kpi.value}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {kpi.chip && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-greenSoft px-1.5 py-0.5 text-[11px] font-bold text-green">
                <ArrowUp className="h-3 w-3" />
                {kpi.chip}
              </span>
            )}
            {kpi.pill && (
              <span className="inline-flex items-center rounded-full bg-greenSoft px-2.5 py-0.5 text-[11px] font-semibold text-green">
                {kpi.pill}
              </span>
            )}
            {kpi.sub && <span className="text-xs font-medium text-inkSoft">{kpi.sub}</span>}
          </div>
        </div>
      </div>
    </Card>
  )
}

function BottleneckRow({ item, onReview }) {
  const tone = BOTTLENECK_TONES[item.tone] || BOTTLENECK_TONES.orange
  const Icon = tone.Icon
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-border border-l-4 ${tone.accent} ${tone.tint} p-3`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ${tone.icon}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-ink">{item.title}</div>
        <div className="truncate text-xs font-medium text-inkSoft">{item.sub}</div>
      </div>
      <button
        type="button"
        onClick={() => onReview(item.title)}
        className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
      >
        Review
      </button>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast: notify, search } = useShell()
  const [following, setFollowing] = useState(() => new Set())
  const [reassign, setReassign] = useState(null) // { name } | null
  const [targetRep, setTargetRep] = useState(REP_OPTIONS[0])

  function toggleFollow(name) {
    setFollowing((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
        notify(`Unfollowed ${name}`)
      } else {
        next.add(name)
        notify(`Following ${name}`)
      }
      return next
    })
  }

  function openReassign(name) {
    setTargetRep(REP_OPTIONS.find((r) => r !== name) || REP_OPTIONS[0])
    setReassign({ name })
  }

  function confirmReassign() {
    notify(`Reassigned ${reassign.name}'s leads → ${targetRep}`)
    setReassign(null)
  }

  const filteredRoster = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return roster
    return roster.filter((r) => r.name.toLowerCase().includes(q))
  }, [search])

  const rosterColumns = [
    {
      key: 'name',
      header: 'Rep',
      sortable: true,
      render: (row) => {
        const isFollowing = following.has(row.name)
        return (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.name} initials={row.initials} color={row.color} size="md" />
            <span className="font-semibold text-ink">{row.name}</span>
            <button
              type="button"
              aria-label={isFollowing ? `Unfollow ${row.name}` : `Follow ${row.name}`}
              onClick={() => toggleFollow(row.name)}
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                isFollowing
                  ? 'border-brand-orange bg-brand-orange text-white'
                  : 'border-border text-inkSoft hover:border-brand-orange hover:text-brand-orange',
              )}
            >
              {isFollowing ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </button>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) =>
        row.status === 'new' ? (
          <StatusBadge variant="new">
            <span className="inline-flex items-center gap-0.5">
              <Plus className="h-3 w-3" />
              NEW
            </span>
          </StatusBadge>
        ) : (
          <StatusBadge variant={row.status}>{(STATUS_LABELS[row.status] || row.status).toUpperCase()}</StatusBadge>
        ),
    },
    { key: 'leads', header: 'Leads', sortable: true, align: 'right', className: 'font-semibold tabular-nums' },
    { key: 'closed', header: 'Closed', sortable: true, align: 'right', className: 'font-semibold tabular-nums' },
    { key: 'resp', header: 'Resp. Time', align: 'right', className: 'tabular-nums text-inkSoft' },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="inline-flex min-w-[2.5rem] justify-center rounded-lg bg-canvas px-2 py-1 text-sm font-bold text-ink tabular-nums">
          {row.score}
        </span>
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (row) => <Sparkline data={TREND_SERIES[row.trend]} color={TREND_COLORS[row.trend]} />,
    },
  ]

  const rowActions = (row) => [
    { label: 'View profile', icon: Eye, onClick: () => navigate('/lead/performance') },
    { label: 'Reassign leads', icon: Repeat, onClick: () => openReassign(row.name) },
  ]

  return (
    <div className="space-y-4">
      {/* 1 — KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* 2 — Team alert banner */}
      <Card className="!p-4 border-l-4 border-l-red bg-redSoft/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wide text-red">Team Alert</div>
              <div className="mt-0.5 text-sm font-semibold text-ink">
                4 unclosed online leads stalled 7+ days — review and reassign
              </div>
              <div className="mt-0.5 text-xs font-medium text-inkSoft">
                These were assigned to CRS reps but not moved in a week. You can reassign or claim them.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/lead/unclosed')}
            className="shrink-0 self-start rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orangeDk sm:self-center"
          >
            Review Unclosed Leads
          </button>
        </div>
      </Card>

      {/* 3 — Main grid: roster (≈62%) + bottlenecks (≈38%) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[62fr_38fr]">
        {/* Team roster */}
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h3 className="text-sm font-bold text-ink">Team Roster — Ernakulam</h3>
            <button
              type="button"
              onClick={() => {
                exportToCsv('team-roster-ernakulam', filteredRoster, [
                  { key: 'name', header: 'Rep' },
                  { key: 'status', header: 'Status' },
                  { key: 'leads', header: 'Leads' },
                  { key: 'closed', header: 'Closed' },
                  { key: 'resp', header: 'Resp. Time' },
                  { key: 'score', header: 'Score' },
                ])
                notify(`Exported ${filteredRoster.length} reps`)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkSoft transition-colors hover:text-ink"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
          <DataTable
            columns={rosterColumns}
            rows={filteredRoster}
            rowActions={rowActions}
            pageSize={10}
            className="!rounded-none !border-0"
          />
        </Card>

        {/* Bottlenecks */}
        <Card
          className="!p-5"
          title="Bottlenecks"
          right={
            <span className="inline-flex items-center rounded-full bg-redSoft px-2.5 py-0.5 text-[11px] font-bold text-red">
              2 ALERTS
            </span>
          }
        >
          <div className="space-y-3">
            {bottlenecks.map((item) => (
              <BottleneckRow key={item.id} item={item} onReview={() => navigate('/lead/unclosed')} />
            ))}
          </div>
        </Card>
      </div>

      {/* 4 — Team pipeline */}
      <Card className="!p-5" title="Team Pipeline — Ernakulam">
        <PipelineFunnel stages={funnelStages} />
      </Card>

      {/* Reassign leads modal */}
      <Modal
        open={!!reassign}
        onClose={() => setReassign(null)}
        title="Reassign leads"
        subtitle={reassign ? `Move open leads from ${reassign.name}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setReassign(null)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmReassign}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Reassign
            </button>
          </>
        }
      >
        <label className="block">
          <span className="text-xs font-semibold text-inkSoft">Assign to</span>
          <select
            value={targetRep}
            onChange={(e) => setTargetRep(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-border bg-canvas px-3 text-sm font-semibold text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
          >
            {REP_OPTIONS.filter((r) => r !== reassign?.name).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </Modal>
    </div>
  )
}
