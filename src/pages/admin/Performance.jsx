import { useState } from 'react'
import clsx from 'clsx'
import {
  Trophy,
  CalendarDays,
  Flame,
  ChevronDown,
  Upload,
  Zap,
  IndianRupee,
  TrendingUp,
  MapPin,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import LineTrend from '../../components/LineTrend.jsx'
import Tabs from '../../components/Tabs.jsx'
import Menu from '../../components/Menu.jsx'
import { useShell } from '../../context/shell.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
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
  commissionRows,
  badges,
} from '../../data/teamPerformance.js'

const TABS = [
  { value: 'leaderboard', label: 'Leaderboard' },
  { value: 'funnel', label: 'Funnel by Rep' },
  { value: 'response', label: 'Response Time' },
  { value: 'commissions', label: 'Commissions' },
  { value: 'badges', label: 'Badges' },
]

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const DATE_RANGES = [
  { value: 'Today', label: 'Today' },
  { value: 'This week', label: 'This week' },
  { value: 'Jun 25, 2025', label: 'Jun 25, 2025' },
  { value: 'This month', label: 'This month' },
  { value: 'This quarter', label: 'This quarter' },
]

const TEAM_FILTERS = [
  { value: 'all', label: 'All Teams' },
  { value: 'elite', label: 'Elite tier' },
  { value: 'performer', label: 'Performer tier' },
  { value: 'active', label: 'Active tier' },
  { value: 'starter', label: 'Starter tier' },
]

const BADGE_ICONS = { Trophy, Zap, Flame, IndianRupee, TrendingUp, MapPin }
const BADGE_TONES = {
  amber: 'bg-amberSoft text-[#B97A1C]',
  orange: 'bg-[#FCE9E1] text-[#E2552A]',
  red: 'bg-redSoft text-red',
  green: 'bg-greenSoft text-green',
  blue: 'bg-[#E7EEFD] text-[#2F6FED]',
  indigo: 'bg-[#ECEAFB] text-[#5B53C9]',
}

// ── Block 2 — champion + challenge ──────────────────────────────────────────
function ChampionCard() {
  return (
    <Card className="!p-5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-orange">
        <Trophy className="h-3.5 w-3.5" />
        This Month's Champion
      </span>

      <div className="mt-4 flex items-center gap-3.5">
        <Avatar
          name={champion.rep}
          initials={champion.repInitials}
          color={champion.repColor}
          size="lg"
        />
        <div className="min-w-0">
          <div className="text-lg font-bold text-ink">{champion.rep}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <StatusBadge variant="elite">{champion.badges[0]}</StatusBadge>
            <span className="inline-flex items-center gap-1 rounded-full bg-amberSoft px-2 py-0.5 text-[11px] font-semibold text-[#B97A1C]">
              <Flame className="h-3 w-3" />
              {champion.badges[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
        {champion.stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-xl font-bold text-ink tabular-nums">{s.value}</div>
            <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-inkSoft">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ChallengeCard() {
  const pct = Math.round((challenge.closed / challenge.target) * 100)
  return (
    <Card className="!p-5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECEAFB] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5B53C9]">
        <CalendarDays className="h-3.5 w-3.5" />
        April Team Challenge
      </span>

      <p className="mt-4 text-base font-bold leading-snug text-ink">{challenge.title}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
          <span className="text-ink">Progress: {challenge.closed} closed</span>
          <span className="text-inkSoft tabular-nums">
            {challenge.closed}/{challenge.target}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              backgroundImage: 'linear-gradient(90deg, #7C5CD6 0%, #F26B3A 100%)',
            }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-inkSoft">{challenge.note}</p>
    </Card>
  )
}

// ── Block 4 left — horizontal stacked conversion funnel ─────────────────────
function FunnelCard() {
  return (
    <Card title="Conversion Funnel — Top 5 Reps">
      <div className="space-y-3">
        {funnelReps.map((rep) => {
          const total = FUNNEL_LEGEND.reduce((sum, seg) => sum + rep.segments[seg.key], 0)
          return (
            <div key={rep.rep} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-xs font-semibold text-ink">
                {rep.rep}
              </span>
              <div className="flex h-6 flex-1 overflow-hidden rounded-md">
                {FUNNEL_LEGEND.map((seg) => {
                  const value = rep.segments[seg.key]
                  const width = total ? (value / total) * 100 : 0
                  return (
                    <div
                      key={seg.key}
                      className="flex items-center justify-center text-[10px] font-bold text-white"
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

      {/* Legend */}
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

// ── Block 4 right — response time trend ─────────────────────────────────────
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
        height={240}
      />
      <p className="mt-1 text-center text-[11px] font-medium text-inkSoft">April 12 – 25</p>
    </Card>
  )
}

export default function Performance() {
  const { toast: notify } = useShell()
  const [tab, setTab] = useState('leaderboard')
  const [dateRange, setDateRange] = useState('Jun 25, 2025')
  const [team, setTeam] = useState('all')

  const visibleLeaderboard =
    team === 'all' ? leaderboardRows : leaderboardRows.filter((r) => r.tier === team)

  function exportLeaderboard() {
    const ok = exportToCsv(
      'rep-leaderboard',
      visibleLeaderboard.map((r) => ({
        rank: r.rank,
        rep: r.rep,
        tier: TIER_LABELS[r.tier] || r.tier,
        leads: r.leads,
        calls: r.calls,
        visits: r.visits,
        proposals: r.proposals,
        conv: r.conv,
        convPct: `${r.convPct}%`,
        resp: r.resp,
        revenue: r.revenue,
        score: r.score,
      })),
      [
        { key: 'rank', header: 'Rank' },
        { key: 'rep', header: 'Rep' },
        { key: 'tier', header: 'Tier' },
        { key: 'leads', header: 'Leads' },
        { key: 'calls', header: 'Calls' },
        { key: 'visits', header: 'Visits' },
        { key: 'proposals', header: 'Proposals' },
        { key: 'conv', header: 'Conversions' },
        { key: 'convPct', header: 'Conv %' },
        { key: 'resp', header: 'Resp (min)' },
        { key: 'revenue', header: 'Revenue' },
        { key: 'score', header: 'Score' },
      ],
    )
    notify(ok ? `Exported ${visibleLeaderboard.length} reps` : 'Nothing to export')
  }

  // Leaderboard table columns
  const num = (key, header) => ({
    key,
    header,
    sortable: true,
    align: 'right',
    render: (row) => <span className="tabular-nums text-ink">{row[key]}</span>,
  })

  const leaderboardColumns = [
    {
      key: 'rank',
      header: '#',
      sortable: true,
      render: (row) =>
        MEDALS[row.rank] ? (
          <span className="text-base leading-none">{MEDALS[row.rank]}</span>
        ) : (
          <span className="pl-1 font-bold text-inkSoft tabular-nums">{row.rank}</span>
        ),
    },
    {
      key: 'rep',
      header: 'Rep',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="sm" />
          <span className="font-semibold text-ink">{row.rep}</span>
          {row.tier === 'elite' && <Flame className="h-3.5 w-3.5 text-brand-orange" />}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => <StatusBadge variant={row.tier}>{TIER_LABELS[row.tier]}</StatusBadge>,
    },
    num('leads', 'Leads'),
    num('calls', 'Calls'),
    num('visits', 'Visits'),
    num('proposals', 'Proposals'),
    num('conv', 'Conv.'),
    {
      key: 'convPct',
      header: 'Conv.%',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.convPct}%</span>,
    },
    num('resp', 'Resp (min)'),
    {
      key: 'revenueValue',
      header: 'Revenue',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-ink tabular-nums">{row.revenue}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-brand-orange tabular-nums">{row.score}</span>,
    },
  ]

  const commissionColumns = [
    {
      key: 'rep',
      header: 'Rep',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="sm" />
          <span className="font-semibold text-ink">{row.rep}</span>
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => <StatusBadge variant={row.tier}>{TIER_LABELS[row.tier]}</StatusBadge>,
    },
    {
      key: 'base',
      header: 'Base Commission',
      align: 'right',
      render: (row) => <span className="tabular-nums text-ink">{row.base}</span>,
    },
    {
      key: 'boost',
      header: 'Tier Boost',
      align: 'right',
      render: (row) => <span className="font-semibold text-green tabular-nums">{row.boost}</span>,
    },
    {
      key: 'streak',
      header: 'Streak Bonus',
      align: 'right',
      render: (row) =>
        row.streak === '—' ? (
          <span className="text-inkSoft">—</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-semibold text-[#B97A1C] tabular-nums">
            {row.streak}
            {row.streakFire && <Flame className="h-3.5 w-3.5 text-brand-orange" />}
          </span>
        ),
    },
    {
      key: 'totalValue',
      header: 'Total',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-ink tabular-nums">{row.total}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge variant="won">APPROVED</StatusBadge>,
    },
  ]

  return (
    <div className="space-y-4">
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

      {/* 1 — sub-tabs */}
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {/* Leaderboard tab → champion + challenge + rep leaderboard */}
      {tab === 'leaderboard' && (
        <div className="space-y-4">
          {/* 2 — champion + challenge */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChampionCard />
            <ChallengeCard />
          </div>

          {/* 3 — rep leaderboard */}
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold text-ink">Rep Leaderboard — April</h3>
              <div className="flex items-center gap-2">
                <Menu
                  label={TEAM_FILTERS.find((t) => t.value === team)?.label ?? 'All Teams'}
                  value={team}
                  options={TEAM_FILTERS}
                  onSelect={setTeam}
                  align="right"
                />
                <button
                  type="button"
                  onClick={exportLeaderboard}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
                >
                  <Upload className="h-3.5 w-3.5 text-inkSoft" />
                  Export
                </button>
              </div>
            </div>
            <DataTable
              columns={leaderboardColumns}
              rows={visibleLeaderboard}
              pageSize={10}
              className="!rounded-none !border-0"
            />
          </Card>
        </div>
      )}

      {/* Funnel by Rep tab */}
      {tab === 'funnel' && <FunnelCard />}

      {/* Response Time tab */}
      {tab === 'response' && <ResponseCard />}

      {/* Commissions tab */}
      {tab === 'commissions' && (
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-bold text-ink">Monthly Commission Payouts — April</h3>
          </div>
          <DataTable
            columns={commissionColumns}
            rows={commissionRows}
            pageSize={10}
            className="!rounded-none !border-0"
          />
        </Card>
      )}

      {/* Badges tab */}
      {tab === 'badges' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {badges.map((b) => {
            const Icon = BADGE_ICONS[b.icon] || Trophy
            return (
              <Card key={b.id} className="!p-5">
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      BADGE_TONES[b.tone],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink">{b.title}</div>
                    <div className="text-xs font-medium text-inkSoft">{b.holder}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-inkSoft">{b.note}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
