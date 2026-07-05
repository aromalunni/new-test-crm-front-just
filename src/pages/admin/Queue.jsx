import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Clock,
  Phone,
  AlarmClock,
  RefreshCw,
  Globe,
  Megaphone,
  Facebook,
  Share2,
  PhoneCall,
  DoorOpen,
  Check,
  Repeat,
  Eye,
  UserX,
  ChevronDown,
  CircleDot,
  CheckCircle2,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import Modal from '../../components/Modal.jsx'
import { useShell } from '../../context/shell.jsx'
import {
  statusCards,
  engine,
  queueRows,
  STATUS_LABELS,
  historyEvents,
} from '../../data/onlineQueue.js'

const PALETTE = ['#0E1B2E', '#2F6FED', '#F26B3A', '#0F7A45', '#5B53C9', '#B97A1C', '#0E8C86']
function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
function colorFor(name) {
  let h = 0
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

const inputCls =
  'w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20'

// ── Block 1 — status cards ──────────────────────────────────────────────────
const CARD_ICONS = { Clock, Phone, AlarmClock, RefreshCw }

const TILE_STYLES = {
  amber: 'bg-amberSoft text-[#B97A1C]',
  blue: 'bg-[#E7EEFD] text-[#2F6FED]',
  red: 'bg-redSoft text-red',
  indigo: 'bg-[#ECEAFB] text-[#5B53C9]',
  navy: 'bg-[#E8EBF0] text-[#0E1B2E]',
}

const PILL_STYLES = {
  red: 'bg-redSoft text-red',
  green: 'bg-greenSoft text-green',
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

// Live server clock (Kerala / IST), ticking once a second.
function useKeralaClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-GB', {
    hour12: false,
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return time
}

function StatusCard({ card }) {
  const clock = useKeralaClock()
  const Icon = CARD_ICONS[card.icon] || Clock
  return (
    <Card className="!p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            TILE_STYLES[card.tile] || TILE_STYLES.navy,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {card.pill && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              PILL_STYLES[card.pill.tone],
            )}
          >
            {card.pill.tone === 'red' && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
            )}
            {card.pill.text}
          </span>
        )}
        {card.chip && (
          <span className="inline-flex items-center rounded-md bg-red px-1.5 py-0.5 text-[10px] font-bold text-white">
            {card.chip}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase leading-tight tracking-wide text-inkSoft">
        {card.label}
      </p>
      <p
        className={clsx(
          'mt-1 font-bold leading-none text-ink tabular-nums',
          card.clock ? 'text-xl' : 'text-2xl',
        )}
      >
        {card.clock ? clock : card.value}
      </p>
      <p className="mt-2 text-xs font-medium text-inkSoft">{card.sub}</p>
    </Card>
  )
}

// ── Block 3 — SLA countdown bar (horizontal, ticks down live) ───────────────
function fmt(seconds) {
  return `${pad2(Math.floor(seconds / 60))}:${pad2(seconds % 60)}`
}

function SlaBar({ cell }) {
  const isRunning = cell.state === 'running'
  const [remaining, setRemaining] = useState(cell.seconds ?? 0)

  useEffect(() => {
    if (!isRunning) return undefined
    setRemaining(cell.seconds)
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1))
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.seconds, isRunning])

  if (cell.state === 'waiting') {
    return <span className="text-xs font-medium italic text-inkSoft">Waiting…</span>
  }

  if (cell.state === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green">
        <Check className="h-4 w-4" strokeWidth={3} />
        Accepted
      </span>
    )
  }

  const breached = cell.state === 'breached'
  const warn = !breached && remaining <= 60
  const pct = breached ? 100 : Math.max(0, Math.min(100, (remaining / cell.budget) * 100))
  const color = breached || warn ? 'bg-red' : 'bg-brand-orange'

  return (
    <div className="w-32">
      <div className="mb-1 flex items-center justify-between">
        <span
          className={clsx(
            'text-xs font-bold tabular-nums',
            breached || warn ? 'text-red' : 'text-ink',
          )}
        >
          {fmt(breached ? cell.seconds : remaining)}
        </span>
        {breached && (
          <span className="text-[10px] font-bold uppercase text-red">Over</span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className={clsx('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const SOURCE_ICONS = {
  'Google Ads': Megaphone,
  Facebook: Facebook,
  Referral: Share2,
  'Cold Call': PhoneCall,
  Website: Globe,
  'Walk-in': DoorOpen,
}

export default function Queue() {
  const { toast: notify, search, refresh } = useShell()
  const navigate = useNavigate()
  const [queueList, setQueueList] = useState(queueRows)
  const [reassign, setReassign] = useState(null) // row being (force) reassigned
  const [reassignTo, setReassignTo] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)

  function openDetail(row) {
    navigate(`/admin/all-leads/${row.id}`)
  }

  // Pool of reps that can receive a lead (rotation + anyone already assigned).
  const repPool = useMemo(() => {
    const names = new Set()
    queueRows.forEach((r) => r.rep && names.add(r.rep))
    engine.rotation.forEach((r) => names.add(r.name))
    return Array.from(names)
  }, [])

  function openReassign(row) {
    setReassign(row)
    setReassignTo(repPool.find((n) => n !== row.rep) ?? repPool[0] ?? '')
  }
  function confirmReassign() {
    const name = reassignTo
    setQueueList((list) =>
      list.map((r) =>
        r.id === reassign.id
          ? {
              ...r,
              rep: name,
              repInitials: initialsOf(name),
              repColor: colorFor(name),
              reassigns: (r.reassigns ?? 0) + 1,
            }
          : r,
      ),
    )
    notify(`${reassign.name} reassigned to ${name}`)
    setReassign(null)
  }
  function unassign(row) {
    setQueueList((list) =>
      list.map((r) =>
        r.id === row.id
          ? { ...r, rep: 'Unassigned', repInitials: 'UA', repColor: '#8A93A3' }
          : r,
      ),
    )
    notify(`${row.name} unassigned`)
  }
  function refreshQueue() {
    refresh()
    notify('Queue refreshed')
  }

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return queueList
    return queueList.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.rep?.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q),
    )
  }, [queueList, search])

  const columns = [
    {
      key: 'name',
      header: 'Lead',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row)}
          className="min-w-0 text-left"
        >
          <div className="font-semibold text-ink hover:text-brand-orange">{row.name}</div>
          <div className="text-xs font-medium text-inkSoft">
            {row.id} · {row.district} · {row.sizeKw}kW
          </div>
        </button>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (row) => {
        const Icon = SOURCE_ICONS[row.source] || Globe
        return (
          <span className="inline-flex items-center gap-1.5 text-ink">
            <Icon className="h-3.5 w-3.5 text-inkSoft" />
            {row.source}
          </span>
        )
      },
    },
    {
      key: 'rep',
      header: 'Assigned To',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="sm" />
          <span className="text-ink">{row.rep}</span>
        </span>
      ),
    },
    {
      key: 'accept',
      header: 'Accept SLA (15min)',
      render: (row) => <SlaBar cell={row.accept} />,
    },
    {
      key: 'firstCall',
      header: 'First Call SLA (30min)',
      render: (row) => <SlaBar cell={row.firstCall} />,
    },
    {
      key: 'reassigns',
      header: 'Reassigns',
      align: 'right',
      render: (row) =>
        row.reassigns > 0 ? (
          <span className="inline-flex items-center rounded-md bg-amberSoft px-2 py-0.5 text-xs font-bold text-[#B97A1C] tabular-nums">
            {row.reassigns}
            {row.reassignsMax ? `/${row.reassignsMax}` : ''}
          </span>
        ) : (
          <span className="text-sm font-semibold text-inkSoft tabular-nums">0</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge variant={row.status}>{STATUS_LABELS[row.status]}</StatusBadge>
      ),
    },
    {
      key: 'force',
      header: 'Actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => openReassign(row)}
          className="text-xs font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
        >
          Force Reassign
        </button>
      ),
    },
  ]

  const rowActions = (row) => [
    { label: 'View lead', icon: Eye, onClick: () => openDetail(row) },
    { label: 'Reassign', icon: Repeat, onClick: () => openReassign(row) },
    { label: 'Unassign', icon: UserX, danger: true, onClick: () => unassign(row) },
  ]

  return (
    <div className="space-y-4">
      {/* Subtitle (title lives in the shared top bar) */}
      <p className="text-sm font-medium text-inkSoft">
        Monitor and manage live assignments in real-time.
      </p>

      {/* 1 — status strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {statusCards.map((card) => (
          <StatusCard key={card.id} card={card} />
        ))}
      </div>

      {/* 2 — assignment engine · live */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5 lg:w-56 lg:shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-greenSoft text-green">
              <RefreshCw className="h-[18px] w-[18px]" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink">Assignment Engine</div>
              <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-greenSoft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                Running
              </span>
            </div>
          </div>

          <div className="hidden w-px self-stretch bg-border lg:block" />

          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Mode */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">Mode</p>
              <p className="mt-1 text-sm font-bold text-ink">{engine.mode}</p>
              <p className="text-xs font-medium text-inkSoft">{engine.modeDetail}</p>
            </div>

            {/* Next in rotation */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">
                Next in Rotation
              </p>
              <div className="mt-2 flex items-center">
                {engine.rotation.map((r, i) => (
                  <span
                    key={r.name}
                    className={clsx('rounded-full ring-2 ring-white', i > 0 && '-ml-2')}
                    style={{ zIndex: engine.rotation.length - i }}
                    title={r.name}
                  >
                    <Avatar name={r.name} initials={r.repInitials} color={r.repColor} size="sm" />
                  </span>
                ))}
                {engine.rotationExtra > 0 && (
                  <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-[10px] font-bold text-inkSoft ring-2 ring-white">
                    +{engine.rotationExtra}
                  </span>
                )}
              </div>
            </div>

            {/* Working hours */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">
                Working Hours
              </p>
              <p className="mt-1 text-sm font-bold text-ink tabular-nums">{engine.workingHours}</p>
              <p className="text-xs font-medium text-inkSoft">{engine.workingHoursDetail}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 — live queue */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <CircleDot className="h-4 w-4 text-green" />
            Live Queue
          </h3>
          <button
            type="button"
            onClick={refreshQueue}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
          >
            <RefreshCw className="h-3.5 w-3.5 text-inkSoft" />
            Refresh
          </button>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowActions={rowActions}
          pageSize={10}
          className="!rounded-none !border-0"
        />
      </Card>

      {/* 4 — recent assignment history */}
      <Card
        title="Recent Assignment History"
        right={
          <div className="flex items-center gap-3 text-xs">
            <span className="font-medium text-inkSoft">Last 20 events</span>
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="font-semibold text-brand-orange transition-colors hover:text-brand-orangeDk"
            >
              View All
            </button>
          </div>
        }
      >
        <ul className="space-y-1">
          {historyEvents.map((e, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-canvas/60"
            >
              <span className="w-12 shrink-0 text-xs font-bold tabular-nums text-inkSoft">
                {e.time}
              </span>
              <span className="min-w-0 flex-1 text-sm text-ink">
                <span className="font-bold">{e.bold}</span> {e.text}
              </span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green" />
            </li>
          ))}
        </ul>
      </Card>

      {/* ── Reassign / Force-reassign modal ────────────────────────────────── */}
      <Modal
        open={!!reassign}
        onClose={() => setReassign(null)}
        title="Reassign lead"
        subtitle={reassign ? `Move ${reassign.name} to another rep.` : ''}
        width="max-w-sm"
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
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Reassign
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-inkSoft">
            Assign to
          </span>
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            className={inputCls}
          >
            {repPool.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </Modal>

      {/* ── Full assignment history modal ──────────────────────────────────── */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Assignment History"
        subtitle="All recent assignment events"
        width="max-w-lg"
        footer={
          <button
            type="button"
            onClick={() => setHistoryOpen(false)}
            className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
          >
            Close
          </button>
        }
      >
        <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
          {historyEvents.map((e, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-canvas/60">
              <span className="w-12 shrink-0 text-xs font-bold tabular-nums text-inkSoft">
                {e.time}
              </span>
              <span className="min-w-0 flex-1 text-sm text-ink">
                <span className="font-bold">{e.bold}</span> {e.text}
              </span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green" />
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
