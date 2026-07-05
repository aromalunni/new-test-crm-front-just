import { useState } from 'react'
import { CalendarDays, Flame, Trophy, User, TrendingUp } from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import LineTrend from '../../components/LineTrend.jsx'
import Menu from '../../components/Menu.jsx'
import { useShell } from '../../context/shell.jsx'
import {
  champion,
  challenge,
  leaderboardRows,
  TIER_LABELS,
  funnelReps,
  FUNNEL_LEGEND,
  responseTrend,
  responseTeamAvg,
  responseTarget,
  tvTicker,
} from '../../data/teamPerformance.js'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }
const TICKER_ICONS = { User, Flame, TrendingUp, Trophy }

const DATE_RANGES = [
  { value: 'Today', label: 'Today' },
  { value: 'This week', label: 'This week' },
  { value: 'Jun 25, 2025', label: 'Jun 25, 2025' },
  { value: 'This month', label: 'This month' },
  { value: 'This quarter', label: 'This quarter' },
]

// Big-screen rankings show only the top 6 reps (spec block 2).
const rankingRows = leaderboardRows.slice(0, 6)

// ── Block 1 left — champion ─────────────────────────────────────────────────
function ChampionCard() {
  return (
    <Card className="!p-6">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-orange">
        <Trophy className="h-4 w-4" />
        This Month's Champion
      </span>

      <div className="mt-5 flex items-center gap-4">
        <Avatar
          name={champion.rep}
          initials={champion.repInitials}
          color={champion.repColor}
          size="lg"
          className="!h-16 !w-16 !text-lg"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-2xl font-bold text-ink">
            {champion.rep}
            <Flame className="h-5 w-5 text-brand-orange" />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge variant="elite">{champion.badges[0]}</StatusBadge>
            <span className="inline-flex items-center gap-1 rounded-full bg-amberSoft px-2 py-0.5 text-xs font-semibold text-[#B97A1C]">
              <Flame className="h-3 w-3" />
              {champion.badges[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
        {champion.stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-ink tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-inkSoft">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Block 1 right — team challenge ──────────────────────────────────────────
function ChallengeCard() {
  const pct = Math.round((challenge.closed / challenge.target) * 100)
  return (
    <Card className="!p-6">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECEAFB] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5B53C9]">
        <CalendarDays className="h-4 w-4" />
        April Team Challenge
      </span>

      <p className="mt-5 text-xl font-bold leading-snug text-ink">{challenge.title}</p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold">
          <span className="text-ink">Progress: {challenge.closed} closed</span>
          <span className="text-inkSoft tabular-nums">Goal: {challenge.target} deals</span>
        </div>
        <div className="h-3.5 w-full overflow-hidden rounded-full bg-canvas">
          <div className="h-full rounded-full bg-brand-orange" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-inkSoft">{challenge.note}</p>
    </Card>
  )
}

// ── Block 3 left — horizontal stacked conversion funnel ─────────────────────
function FunnelCard() {
  return (
    <Card title="Conversion Funnel — Top 5 Reps">
      <div className="space-y-3.5">
        {funnelReps.map((rep) => {
          const total = FUNNEL_LEGEND.reduce((sum, seg) => sum + rep.segments[seg.key], 0)
          return (
            <div key={rep.rep} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-sm font-semibold text-ink">
                {rep.rep}
              </span>
              <div className="flex h-7 flex-1 overflow-hidden rounded-md">
                {FUNNEL_LEGEND.map((seg) => {
                  const value = rep.segments[seg.key]
                  const width = total ? (value / total) * 100 : 0
                  return (
                    <div
                      key={seg.key}
                      className="flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ width: `${width}%`, backgroundColor: seg.color }}
                      title={`${seg.label}: ${value}`}
                    >
                      {width > 9 ? value : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
        {FUNNEL_LEGEND.map((seg) => (
          <span key={seg.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-inkSoft">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>
    </Card>
  )
}

// ── Block 3 right — response time trend ─────────────────────────────────────
function ResponseCard() {
  return (
    <Card
      title="Response Time Trend"
      right={<span className="text-xs font-medium text-inkSoft">Last 14 days</span>}
    >
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5 text-inkSoft">
          <span className="h-2 w-2 rounded-full bg-inkSoft/60" />
          Team avg: <span className="font-semibold text-ink">{responseTeamAvg} min</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-inkSoft">
          <span className="inline-block h-0 w-4 border-t-2 border-dashed border-inkSoft/60" />
          Target: <span className="font-semibold text-ink">{responseTarget} min</span>
        </span>
      </div>
      <LineTrend
        data={responseTrend}
        series={[{ key: 'value', color: '#F26B3A', label: 'Response (min)' }]}
        target={responseTarget}
        height={230}
      />
      <p className="mt-1 text-center text-[11px] font-medium text-inkSoft">April 12 – 25</p>
    </Card>
  )
}

// ── Block 4 — bottom highlight ticker (scrolling) ───────────────────────────
function Ticker() {
  // Duplicate the cells so the marquee can loop seamlessly.
  const cells = [...tvTicker, ...tvTicker]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0E1B2E] py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <style>{`@keyframes tv-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max gap-10 px-6" style={{ animation: 'tv-marquee 24s linear infinite' }}>
        {cells.map((cell, i) => {
          const Icon = TICKER_ICONS[cell.icon] || Trophy
          return (
            <span key={i} className="inline-flex shrink-0 items-center gap-2.5 text-base">
              <Icon className="h-5 w-5 shrink-0 text-brand-orange" />
              <span className="font-bold text-white">{cell.lead}</span>
              {cell.rest && <span className="font-medium text-white/55">/ {cell.rest}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function Tv() {
  const { toast: notify } = useShell()
  const [dateRange, setDateRange] = useState('Jun 25, 2025')

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      render: (row) =>
        MEDALS[row.rank] ? (
          <span className="text-2xl leading-none">{MEDALS[row.rank]}</span>
        ) : (
          <span className="pl-1.5 text-xl font-bold text-inkSoft tabular-nums">{row.rank}</span>
        ),
    },
    {
      key: 'rep',
      header: 'Rep',
      render: (row) => (
        <span className="inline-flex items-center gap-3">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="md" />
          <span className="text-lg font-bold text-ink">{row.rep}</span>
          {row.rank <= 3 && <Flame className="h-5 w-5 text-brand-orange" />}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => <StatusBadge variant={row.tier}>{TIER_LABELS[row.tier]}</StatusBadge>,
    },
    {
      key: 'leads',
      header: 'Leads',
      align: 'right',
      render: (row) => <span className="text-lg font-semibold text-ink tabular-nums">{row.leads}</span>,
    },
    {
      key: 'calls',
      header: 'Calls',
      align: 'right',
      render: (row) => <span className="text-lg font-semibold text-ink tabular-nums">{row.calls}</span>,
    },
    {
      key: 'conv',
      header: 'Conversions',
      align: 'right',
      render: (row) => <span className="text-lg font-semibold text-ink tabular-nums">{row.conv}</span>,
    },
    {
      key: 'revenueValue',
      header: 'Revenue',
      align: 'right',
      render: (row) => <span className="text-lg font-bold text-ink tabular-nums">{row.revenue}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      align: 'right',
      render: (row) => (
        <span className="text-2xl font-bold text-brand-orange tabular-nums">{row.score}</span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Date pill (title lives in the shared top bar) */}
      <div className="flex justify-end">
        <Menu
          label={
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-inkSoft" />
              {dateRange}
            </span>
          }
          value={dateRange}
          options={DATE_RANGES}
          onSelect={(v) => {
            setDateRange(v)
            notify(`Date range: ${v}`)
          }}
          align="right"
          className="[&>button]:px-3 [&>button]:py-2 [&>button]:text-sm"
        />
      </div>

      {/* 1 — champion + challenge */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChampionCard />
        <ChallengeCard />
      </div>

      {/* 2 — live rankings (large table) */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h3 className="text-base font-bold uppercase tracking-wide text-ink">Rankings</h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-redSoft px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-red">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
            Live
          </span>
        </div>
        <DataTable
          columns={columns}
          rows={rankingRows}
          pageSize={10}
          rowKey={(row) => row.rep}
          className="!rounded-none !border-0 [&_tbody_td]:py-4 [&_thead_th]:text-xs [&_thead_th]:py-4"
        />
      </Card>

      {/* 3 — funnel + response */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FunnelCard />
        <ResponseCard />
      </div>

      {/* 4 — bottom ticker */}
      <Ticker />
    </div>
  )
}
