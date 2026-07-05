import { useState, useMemo } from 'react'
import {
  CalendarDays,
  RefreshCw,
  Circle,
  Clock,
  Power,
  MapPin,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import DataTable from '../../components/DataTable.jsx'
import Tabs from '../../components/Tabs.jsx'
import Modal from '../../components/Modal.jsx'
import Menu from '../../components/Menu.jsx'
import { useShell } from '../../context/shell.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
import {
  statusCards,
  liveStatusRows,
  STATUS_LABELS,
  mapPins,
  pendingCheckouts,
  attendanceRows,
} from '../../data/workforce.js'

const TABS = [
  { value: 'live', label: 'Live Status' },
  { value: 'map', label: 'Field Activity Map' },
  { value: 'attendance', label: 'Attendance & Travel' },
]

const DATE_RANGES = [
  { value: 'Today', label: 'Today' },
  { value: 'This week', label: 'This week' },
  { value: 'Jun 25, 2025', label: 'Jun 25, 2025' },
  { value: 'This month', label: 'This month' },
  { value: 'This quarter', label: 'This quarter' },
]

const STATUS_ICONS = { Circle, Clock, Power, MapPin }
const STATUS_TONES = {
  green: 'bg-greenSoft text-green',
  amber: 'bg-amberSoft text-[#B97A1C]',
  grey: 'bg-[#EFEDE9] text-[#5B6675]',
  orange: 'bg-[#FCE9E1] text-[#E2552A]',
}

// ── Block 2 — status summary cards ──────────────────────────────────────────
function StatusCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statusCards.map((c) => {
        const Icon = STATUS_ICONS[c.icon] || Circle
        return (
          <Card key={c.key} className="!p-5">
            <div className="flex items-start gap-3.5">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${STATUS_TONES[c.tone]}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wide text-inkSoft">
                  {c.label}
                </div>
                <div className="mt-0.5 text-3xl font-bold text-ink tabular-nums">{c.value}</div>
                <div className="mt-0.5 text-xs font-medium text-inkSoft">{c.sub}</div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ── Block 4 left — stylized Kerala field map ────────────────────────────────
function FieldMapCard() {
  return (
    <Card
      title="Field Activity Map — Today"
      right={<span className="text-xs font-medium text-inkSoft">Pins represent check-ins</span>}
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-[#F4F7FB]">
        {/* Stylized Kerala silhouette — visual only, not geographic. */}
        <svg viewBox="0 0 100 130" className="h-[320px] w-full" preserveAspectRatio="xMidYMid meet">
          <path
            d="M62 6 C66 16 60 24 58 32 C56 40 64 44 62 52 C60 60 50 62 48 70 C46 80 52 86 48 96 C44 106 40 112 38 122 C30 118 30 108 33 100 C36 90 30 84 34 74 C38 64 44 58 42 48 C40 38 44 30 48 24 C52 16 54 10 62 6 Z"
            fill="#DCE7F2"
            stroke="#C2D2E4"
            strokeWidth="1"
          />
        </svg>

        {/* Orange check-in pins, positioned by relative %. */}
        {mapPins.map((pin) => (
          <span
            key={pin.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            title={pin.label}
          >
            <MapPin className="h-6 w-6 fill-brand-orange text-white drop-shadow" />
          </span>
        ))}

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
          Kerala · {mapPins.length} active pins
        </span>
      </div>
    </Card>
  )
}

// ── Block 4 right — pending check-outs ──────────────────────────────────────
function PendingCheckoutsCard({ onPing }) {
  return (
    <Card title="Pending Check-outs">
      <div className="space-y-3">
        {pendingCheckouts.map((p) => (
          <div key={p.rep} className="flex items-center gap-3">
            <Avatar name={p.rep} initials={p.repInitials} color={p.repColor} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-ink">{p.rep}</div>
              <div className="truncate text-xs font-medium text-inkSoft">{p.detail}</div>
            </div>
            <button
              type="button"
              onClick={() => onPing(p.rep)}
              className="shrink-0 rounded-xl border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Ping
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function Workforce() {
  const { toast: notify, refresh } = useShell()
  const [tab, setTab] = useState('live')
  const [dateRange, setDateRange] = useState('Jun 25, 2025')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewRep, setViewRep] = useState(null) // live-status detail
  const [detailRep, setDetailRep] = useState(null) // attendance detail

  // Status filter options for the "All Teams" dropdown (built from live data).
  const statusFilters = useMemo(() => {
    const keys = Array.from(new Set(liveStatusRows.map((r) => r.status)))
    return [
      { value: 'all', label: 'All Teams' },
      ...keys.map((k) => ({ value: k, label: STATUS_LABELS[k]?.label ?? k })),
    ]
  }, [])

  const liveRows = useMemo(
    () =>
      statusFilter === 'all'
        ? liveStatusRows
        : liveStatusRows.filter((r) => r.status === statusFilter),
    [statusFilter],
  )

  function refreshLive() {
    refresh()
    notify('Refreshing…')
  }

  function generateClaimReport() {
    const ok = exportToCsv(
      'travel-claim-report',
      attendanceRows.map((r) => ({
        rep: r.rep,
        days: r.days,
        hours: r.hours,
        km: r.km,
        claim: r.claim,
        visits: r.visits,
      })),
      [
        { key: 'rep', header: 'Rep' },
        { key: 'days', header: 'Days Present' },
        { key: 'hours', header: 'Total Hours' },
        { key: 'km', header: 'KM Travelled' },
        { key: 'claim', header: 'Travel Claim' },
        { key: 'visits', header: 'Site Visits' },
      ],
    )
    notify(ok ? `Travel claim report — ${attendanceRows.length} reps` : 'Nothing to export')
  }

  // ── Live Status table ─────────────────────────────────────────────────────
  const liveColumns = [
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
    { key: 'shift', header: 'Shift', render: (row) => <span className="text-ink">{row.shift}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const s = STATUS_LABELS[row.status]
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.dot }} />
            {s.label}
          </span>
        )
      },
    },
    {
      key: 'login',
      header: 'Login',
      render: (row) => <span className="tabular-nums text-ink">{row.login}</span>,
    },
    {
      key: 'activity',
      header: 'Last Activity',
      render: (row) => <span className="text-inkSoft">{row.activity}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) =>
        row.location === '—' ? (
          <span className="text-inkSoft">—</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-ink">
            <MapPin className="h-3.5 w-3.5 text-inkSoft" />
            {row.location}
          </span>
        ),
    },
    {
      key: 'checkins',
      header: 'Check-ins Today',
      align: 'right',
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.checkins}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewRep(row)}
          className="text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
        >
          View
        </button>
      ),
    },
  ]

  // ── Attendance & Travel table ─────────────────────────────────────────────
  const attendanceColumns = [
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
      key: 'days',
      header: 'Days Present',
      sortable: true,
      align: 'right',
      render: (row) => <span className="tabular-nums text-ink">{row.days}</span>,
    },
    {
      key: 'hours',
      header: 'Total Hours',
      align: 'right',
      render: (row) => <span className="tabular-nums text-ink">{row.hours}</span>,
    },
    {
      key: 'kmValue',
      header: 'KM Travelled',
      sortable: true,
      align: 'right',
      render: (row) => <span className="tabular-nums text-ink">{row.km}</span>,
    },
    {
      key: 'claimValue',
      header: 'Travel Claim',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-ink tabular-nums">{row.claim}</span>,
    },
    {
      key: 'visits',
      header: 'Site Visits',
      sortable: true,
      align: 'right',
      render: (row) => <span className="tabular-nums text-ink">{row.visits}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDetailRep(row)}
          className="text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
        >
          Details
        </button>
      ),
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

      {/* Live Status tab */}
      {tab === 'live' && (
        <div className="space-y-4">
          {/* 2 — status summary cards */}
          <StatusCards />

          {/* 3 — live status table */}
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold text-ink">Live Status — All Reps</h3>
              <div className="flex items-center gap-2">
                <Menu
                  label={statusFilters.find((s) => s.value === statusFilter)?.label ?? 'All Teams'}
                  value={statusFilter}
                  options={statusFilters}
                  onSelect={setStatusFilter}
                  align="right"
                />
                <button
                  type="button"
                  onClick={refreshLive}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-inkSoft" />
                  Refresh
                </button>
              </div>
            </div>
            <DataTable
              columns={liveColumns}
              rows={liveRows}
              pageSize={10}
              rowKey={(row) => row.rep}
              className="!rounded-none !border-0"
            />
          </Card>
        </div>
      )}

      {/* Field Activity Map tab */}
      {tab === 'map' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FieldMapCard />
          <PendingCheckoutsCard onPing={(name) => notify(`Pinged ${name}`)} />
        </div>
      )}

      {/* Attendance & Travel tab */}
      {tab === 'attendance' && (
        <Card className="!p-0 overflow-hidden">
          <div className="flex flex-col items-start justify-between gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
            <h3 className="text-sm font-bold text-ink">Attendance &amp; Travel — April 1–24</h3>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                defaultValue="dd-mm-yyyy"
                onFocus={(e) => e.target.select()}
                className="w-28 rounded-xl border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-inkSoft focus:border-brand-orange/40 focus:outline-none"
              />
              <span className="text-xs text-inkSoft">–</span>
              <input
                type="text"
                defaultValue="dd-mm-yyyy"
                onFocus={(e) => e.target.select()}
                className="w-28 rounded-xl border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-inkSoft focus:border-brand-orange/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={generateClaimReport}
                className="rounded-xl bg-brand-orange px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeDk"
              >
                Generate Travel Claim Report
              </button>
            </div>
          </div>
          <DataTable
            columns={attendanceColumns}
            rows={attendanceRows}
            pageSize={10}
            rowKey={(row) => row.rep}
            className="!rounded-none !border-0"
          />
        </Card>
      )}

      {/* ── Live-status detail modal ───────────────────────────────────────── */}
      <Modal
        open={!!viewRep}
        onClose={() => setViewRep(null)}
        title={viewRep?.rep}
        subtitle={viewRep ? STATUS_LABELS[viewRep.status]?.label : ''}
        width="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                notify(`Pinged ${viewRep.rep}`)
                setViewRep(null)
              }}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Ping
            </button>
            <button
              type="button"
              onClick={() => setViewRep(null)}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Close
            </button>
          </>
        }
      >
        {viewRep && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {[
              ['Shift', viewRep.shift],
              ['Login', viewRep.login],
              ['Last activity', viewRep.activity],
              ['Location', viewRep.location],
              ['Check-ins today', viewRep.checkins],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-inkSoft">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      {/* ── Attendance detail modal ────────────────────────────────────────── */}
      <Modal
        open={!!detailRep}
        onClose={() => setDetailRep(null)}
        title={detailRep?.rep}
        subtitle="Attendance & travel — April 1–24"
        width="max-w-md"
        footer={
          <button
            type="button"
            onClick={() => setDetailRep(null)}
            className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
          >
            Close
          </button>
        }
      >
        {detailRep && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {[
              ['Days present', detailRep.days],
              ['Total hours', detailRep.hours],
              ['KM travelled', detailRep.km],
              ['Travel claim', detailRep.claim],
              ['Site visits', detailRep.visits],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-inkSoft">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  )
}
