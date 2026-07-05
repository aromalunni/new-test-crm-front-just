import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Users,
  Filter,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
  Trophy,
  Settings,
  Cog,
  ChevronRight as ChevronR,
  MoreHorizontal,
  Inbox,
  BarChart3,
  UsersRound,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DonutChart from '../../components/DonutChart.jsx'
import PipelineFunnel from '../../components/PipelineFunnel.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import Menu from '../../components/Menu.jsx'
import { useShell } from '../../context/shell.jsx'
import { adminPipeline } from '../../data/pipeline.js'
import { stageLabel } from '../../config/stages.js'
import { reps } from '../../data/reps.js'

// ── KPI row ───────────────────────────────────────────────────────────────
const KPIS = [
  {
    id: 'leads',
    icon: Users,
    label: 'Total Leads',
    value: '1,493',
    sub: 'vs last 14 days',
    chip: { tone: 'green', icon: ArrowUp, text: '+12%' },
  },
  {
    id: 'pipeline',
    icon: Filter,
    label: 'Active Pipeline',
    value: '₹2.4 Cr',
    sub: 'vs target',
    chip: { tone: 'orange', text: 'Target: ₹3 Cr' },
  },
  {
    id: 'conv',
    icon: TrendingUp,
    label: 'Conversions (MTD)',
    value: '18 / 40',
    sub: '45% of target',
    progress: 45,
  },
  {
    id: 'resp',
    icon: Clock,
    label: 'Avg Response Time',
    value: '12 min',
    sub: 'vs last 14 days',
    chip: { tone: 'green', icon: ArrowDown, text: '3 min' },
  },
]

const CHIP_TONES = {
  green: 'bg-greenSoft text-green',
  orange: 'bg-brand-orange/10 text-brand-orange',
}

function KpiTile({ kpi }) {
  const Icon = kpi.icon
  const Chip = kpi.chip?.icon
  return (
    <Card className="!p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-inkSoft">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">{kpi.label}</p>
          <p className="mt-1.5 text-2xl font-bold leading-none text-ink">{kpi.value}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {kpi.chip && (
              <span
                className={clsx(
                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold',
                  CHIP_TONES[kpi.chip.tone],
                )}
              >
                {Chip && <Chip className="h-3 w-3" />}
                {kpi.chip.text}
              </span>
            )}
            {kpi.sub && <span className="text-xs font-medium text-inkSoft">{kpi.sub}</span>}
          </div>
          {kpi.progress != null && <ProgressBar value={kpi.progress} className="mt-3" />}
        </div>
      </div>
    </Card>
  )
}

// ── SLA + Lead Source legends ───────────────────────────────────────────────
const SLA_DATA = [
  { name: 'Within SLA', value: 1403, color: '#1FA463' },
  { name: 'Breached', value: 90, color: '#E0533D' },
  { name: 'Pending', value: 0, color: '#E2E6EC' },
]
const SLA_LEGEND = [
  { name: 'Within SLA', color: '#1FA463', pct: '94%', count: '1,403' },
  { name: 'Breached', color: '#E0533D', pct: '6%', count: '90' },
  { name: 'Pending', color: '#E2E6EC', pct: '—', count: '0' },
]

const SOURCE_DATA = [
  { name: 'Google Ads', value: 672, color: '#2F6FED' },
  { name: 'Facebook', value: 329, color: '#7C5CD6' },
  { name: 'Referrals', value: 269, color: '#1FA463' },
  { name: 'Direct', value: 223, color: '#F1A33B' },
]
const SOURCE_LEGEND = [
  { name: 'Google Ads', color: '#2F6FED', pct: '45%', count: '672' },
  { name: 'Facebook', color: '#7C5CD6', pct: '22%', count: '329' },
  { name: 'Referrals', color: '#1FA463', pct: '18%', count: '269' },
  { name: 'Direct', color: '#F1A33B', pct: '15%', count: '223' },
]

function Legend({ rows }) {
  return (
    <ul className="flex-1 space-y-2.5">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
          <span className="truncate text-inkSoft">{r.name}</span>
          <span className="ml-auto font-semibold text-ink tabular-nums">{r.pct}</span>
          <span className="w-12 text-right text-xs text-inkSoft tabular-nums">({r.count})</span>
        </li>
      ))}
    </ul>
  )
}

// ── Pipeline funnel ─────────────────────────────────────────────────────────
// Labels come from the canonical 14-stage model (src/config/stages.js).
const funnelStages = adminPipeline.map((row) => ({
  label: stageLabel(row.stage),
  value: row.count,
}))

// ── Recent activity ─────────────────────────────────────────────────────────
const TAG_TONES = {
  green: 'bg-greenSoft text-green',
  blue: 'bg-[#E7EEFD] text-blue',
  grey: 'bg-canvas text-inkSoft border border-border',
}
const ACTIVITY = [
  { id: 'a1', initials: 'RK', color: '#F26B3A', name: 'Ravi Kumar', rest: ' closed a deal for 12kW System in Kochi', tag: 'WON', tone: 'green', time: '2 min ago' },
  { id: 'a2', initials: 'PN', color: '#2F6FED', name: 'Priya Nair', rest: " scheduled a Site Audit for 'Malabar Villas'", tag: 'MEETING', tone: 'blue', time: '18 min ago' },
  { id: 'a3', system: true, name: 'System', rest: ' captured 24 new leads from Google Ads', tag: 'AUTO', tone: 'grey', time: '42 min ago' },
  { id: 'a4', initials: 'AM', color: '#F1A33B', name: 'Arun Menon', rest: ' moved lead L-1084 to Proposal Sent', tag: 'STAGE', tone: 'grey', time: '1 hour ago' },
  { id: 'a5', initials: 'ST', color: '#E0533D', name: 'Sneha Thomas', rest: ' accepted lead L-1095 within 2 min', tag: 'NOTE ACCEPTED', tone: 'green', time: '3 hours ago' },
]

function ActivityRow({ item }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      {item.system ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-inkSoft">
          <Cog className="h-[18px] w-[18px]" />
        </span>
      ) : (
        <Avatar name={item.name} initials={item.initials} color={item.color} size="md" />
      )}
      <p className="min-w-0 flex-1 truncate text-sm text-inkSoft">
        <span className="font-semibold text-ink">{item.name}</span>
        {item.rest}
      </p>
      <span
        className={clsx(
          'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
          TAG_TONES[item.tone],
        )}
      >
        {item.tag}
      </span>
      <span className="w-20 shrink-0 text-right text-xs font-medium text-inkSoft">{item.time}</span>
    </li>
  )
}

// ── Top performers ──────────────────────────────────────────────────────────
const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
const PERFORMERS = [
  { name: 'Ravi Kumar', tier: 'elite', revenue: '₹42.0 L', closed: 12 },
  { name: 'Priya Nair', tier: 'performer', revenue: '₹38.0 L', closed: 9 },
  { name: 'Meera Rajan', tier: 'performer', revenue: '₹27.0 L', closed: 7 },
  { name: 'Arun Menon', tier: 'active', revenue: '₹19.0 L', closed: 5 },
  { name: 'Vinod Jose', tier: 'active', revenue: '₹18.0 L', closed: 5 },
]

function PerformerRow({ rank, p }) {
  const rep = repByName[p.name]
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="w-4 shrink-0 text-center text-sm font-bold text-inkSoft tabular-nums">{rank}</span>
      <Avatar name={p.name} initials={rep?.initials} color={rep?.avatarColor} size="md" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-semibold text-ink">{p.name}</span>
        <StatusBadge variant={p.tier}>{p.tier.toUpperCase()}</StatusBadge>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-ink tabular-nums">{p.revenue}</div>
        <div className="text-[11px] font-medium text-inkSoft">{p.closed} Closed</div>
      </div>
    </li>
  )
}

// ── Quick links ─────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'All Leads', icon: Users, path: '/admin/all-leads' },
  { label: 'Online Queue', icon: Inbox, path: '/admin/queue' },
  { label: 'Team Performance', icon: BarChart3, path: '/admin/performance' },
  { label: 'TV Leaderboard', icon: Trophy, path: '/admin/tv' },
  { label: 'Workforce', icon: UsersRound, path: '/admin/workforce' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useShell()
  const [period, setPeriod] = useState('This Month')

  return (
    <div className="space-y-4">
      {/* 1 — KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* 2 — Challenge banner + SLA */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[64fr_36fr]">
        {/* April Team Challenge */}
        <Card className="!p-6 border-brand-orange/20 bg-gradient-to-br from-[#FFF1E9] via-[#FFE4D6] to-[#FBD3C2]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full bg-brand-orange px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Active Challenge
              </span>
              <h3 className="mt-3 text-xl font-bold text-ink">April Team Challenge</h3>
              <p className="mt-1 text-sm font-medium text-inkSoft">
                Close 40 deals this month to unlock regional bonus pool
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-right">
              <div>
                <div className="text-2xl font-bold leading-none text-brand-orangeDk">₹5,00,000</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-inkSoft">
                  Bonus Pool
                </div>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
                <Trophy className="h-6 w-6" />
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink">
              <span>Progress: 18 / 40</span>
              <span className="text-inkSoft">Goal: 40 deals</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full bg-brand-orange" style={{ width: '45%' }} />
            </div>
          </div>
        </Card>

        {/* SLA Compliance */}
        <Card title="SLA Compliance Today">
          <div className="flex items-center gap-5">
            <DonutChart
              data={SLA_DATA}
              centerValue="94%"
              centerCaption="Healthy"
              size={150}
              thickness={22}
              legend={false}
            />
            <Legend rows={SLA_LEGEND} />
          </div>
          <p className="mt-4 rounded-xl bg-canvas px-3 py-2 text-xs font-medium text-inkSoft">
            Load response within 15-min target. 6 items pending.
          </p>
        </Card>
      </div>

      {/* 3 — Pipeline funnel + Lead source */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[64fr_36fr]">
        <Card
          className="min-w-0"
          title="Sales Pipeline Funnel"
          right={
            <div className="text-right">
              <div className="text-[11px] font-medium uppercase tracking-wide text-inkSoft">
                Total Pipeline Value
              </div>
              <div className="text-sm font-bold text-ink">₹2.4 Cr</div>
            </div>
          }
        >
          <PipelineFunnel stages={funnelStages} compact />
        </Card>

        <Card className="min-w-0" title="Lead Source">
          <div className="flex items-center gap-5">
            <DonutChart
              data={SOURCE_DATA}
              centerValue="1,493"
              centerCaption="TOTAL"
              size={150}
              thickness={22}
              legend={false}
            />
            <Legend rows={SOURCE_LEGEND} />
          </div>
        </Card>
      </div>

      {/* 4 — Recent activity + Top performers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Recent Activity"
          right={
            <Menu
              label={<MoreHorizontal className="h-4 w-4" />}
              chevron={false}
              align="right"
              options={[
                { value: 'refresh', label: 'Mark all as read' },
                { value: 'filter', label: 'Filter activity' },
                { value: 'export', label: 'Export activity' },
              ]}
              onSelect={(v) =>
                toast(
                  v === 'refresh'
                    ? 'Activity marked read'
                    : v === 'filter'
                      ? 'Filter activity'
                      : 'Activity exported',
                )
              }
              className="[&>button]:h-7 [&>button]:w-7 [&>button]:justify-center [&>button]:border-0 [&>button]:bg-transparent [&>button]:px-0 [&>button]:py-0 [&>button]:text-inkSoft"
            />
          }
        >
          <ul className="divide-y divide-border">
            {ACTIVITY.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/admin/all-leads')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
          >
            View all activity
            <ChevronR className="h-3.5 w-3.5" />
          </button>
        </Card>

        <Card
          title="Top Performers"
          right={
            <Menu
              label={period}
              value={period}
              align="right"
              options={[
                { value: 'This Week', label: 'This Week' },
                { value: 'This Month', label: 'This Month' },
                { value: 'This Quarter', label: 'This Quarter' },
                { value: 'This Year', label: 'This Year' },
              ]}
              onSelect={(v) => {
                setPeriod(v)
                toast(`Top performers — ${v}`)
              }}
              className="[&>button]:px-2.5 [&>button]:py-1"
            />
          }
        >
          <ul className="divide-y divide-border">
            {PERFORMERS.map((p, i) => (
              <PerformerRow key={p.name} rank={i + 1} p={p} />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/admin/performance')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
          >
            View full leaderboard
            <ChevronR className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      {/* 5 — Quick links */}
      <Card title="Quick Links">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left transition-colors hover:border-brand-orange/40 hover:bg-canvas"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-inkSoft">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-sm font-semibold text-ink">{link.label}</span>
                <ChevronR className="h-4 w-4 text-inkSoft" />
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
