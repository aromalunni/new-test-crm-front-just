import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import {
  Phone,
  PhoneCall,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  Activity,
  ChevronDown,
  Upload,
  Eye,
  MessageCircle,
  Play,
  AudioLines,
} from 'lucide-react'

import Card from '../components/Card.jsx'
import Avatar from '../components/Avatar.jsx'
import DataTable from '../components/DataTable.jsx'
import CallRecordingModal from '../components/CallRecordingModal.jsx'
import { useShell } from '../context/shell.jsx'
import { exportToCsv } from '../lib/exportCsv.js'
import {
  callLogs,
  callKpis,
  departmentOptions,
  directionOptions,
  outcomeOptions,
  repOptions,
  OUTCOME_TONE,
} from '../data/callLogs.js'

// ── KPI strip ─────────────────────────────────────────────────────────────────
const KPI_ICONS = { Phone, PhoneCall, PhoneMissed, Clock, Activity }

function KpiCard({ kpi }) {
  const Icon = KPI_ICONS[kpi.icon] || Phone
  return (
    <Card className="!p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-inkSoft">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-inkSoft">
          {kpi.label}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold leading-none text-ink">{kpi.value}</p>
      <p className="mt-2 flex items-center gap-1 text-xs">
        <span className="font-bold text-green tabular-nums">▲ {kpi.delta}</span>
        <span className="font-medium text-inkSoft">vs last month</span>
      </p>
    </Card>
  )
}

// ── Direction / outcome cells ───────────────────────────────────────────────
const DIRECTION_META = {
  Outgoing: { icon: PhoneOutgoing, cls: 'bg-[#E7EEFD] text-[#2F6FED]' },
  Incoming: { icon: PhoneIncoming, cls: 'bg-greenSoft text-green' },
  Missed: { icon: PhoneMissed, cls: 'bg-redSoft text-red' },
}

const OUTCOME_CLS = {
  green: 'bg-greenSoft text-green',
  amber: 'bg-amberSoft text-[#B97A1C]',
  gray: 'bg-[#EFEDE9] text-[#5B6675]',
  red: 'bg-redSoft text-red',
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-xl border border-border bg-canvas pl-3 pr-9 text-sm font-semibold text-ink transition-colors hover:border-inkSoft/40 focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
    </div>
  )
}

function IconAction({ icon: Icon, label, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        'flex h-7 w-7 items-center justify-center rounded-lg text-inkSoft transition-colors hover:bg-canvas hover:text-ink',
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export default function CallLogs() {
  const { toast: notify, search } = useShell()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Role-aware: lead-detail base path follows the current role's URL prefix so
  // clicking a lead opens the right detail route. Role is decided ONLY by URL.
  const leadBase = pathname.startsWith('/lead') ? '/lead/all-leads' : '/admin/all-leads'

  const [dept, setDept] = useState('all')
  const [direction, setDirection] = useState('all')
  const [outcome, setOutcome] = useState('all')
  const [rep, setRep] = useState('all')
  const [recording, setRecording] = useState(null)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return callLogs.filter(
      (c) =>
        (dept === 'all' || c.department === dept) &&
        (direction === 'all' || c.direction === direction) &&
        (outcome === 'all' || c.outcome === outcome) &&
        (rep === 'all' || c.rep === rep) &&
        (!q ||
          c.leadName.toLowerCase().includes(q) ||
          c.leadId.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.rep?.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)),
    )
  }, [dept, direction, outcome, rep, search])

  function openDetail(row) {
    navigate(`${leadBase}/${row.leadId}`)
  }
  function call(row) {
    window.open(`tel:${String(row.phone).replace(/\s/g, '')}`)
    notify(`Calling ${row.leadName}`)
  }
  function whatsapp(row) {
    const num = String(row.phone).replace(/[^\d]/g, '')
    window.open(`https://wa.me/${num}`, '_blank', 'noopener')
    notify(`WhatsApp ${row.leadName}`)
  }
  function playRecording(row) {
    if (!row.hasRecording) {
      notify('No recording for this call')
      return
    }
    setRecording(row)
  }
  function downloadRecording(row) {
    notify(`Downloading ${row.recordingName}`)
  }

  function handleExport() {
    const ok = exportToCsv(
      'call-logs',
      rows.map((c) => ({
        id: c.id,
        leadId: c.leadId,
        leadName: c.leadName,
        phone: c.phone,
        rep: c.rep,
        department: c.department,
        direction: c.direction,
        duration: c.duration,
        outcome: c.outcome,
        when: `${c.day}, ${c.time}`,
      })),
      [
        { key: 'id', header: 'Call ID' },
        { key: 'leadId', header: 'Lead ID' },
        { key: 'leadName', header: 'Lead' },
        { key: 'phone', header: 'Phone' },
        { key: 'rep', header: 'Rep' },
        { key: 'department', header: 'Department' },
        { key: 'direction', header: 'Direction' },
        { key: 'duration', header: 'Duration' },
        { key: 'outcome', header: 'Outcome' },
        { key: 'when', header: 'When' },
      ],
    )
    notify(ok ? `Exported ${rows.length} calls` : 'Nothing to export')
  }

  const columns = [
    {
      key: 'leadName',
      header: 'Lead',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar name={row.leadName} size="md" />
          <div className="min-w-0">
            <div className="font-semibold text-ink hover:text-brand-orange">{row.leadName}</div>
            <div className="text-xs font-medium text-inkSoft">
              {row.leadId} · {row.phone}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: 'rep',
      header: 'Rep',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="sm" />
          <span className="text-ink">{row.rep}</span>
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (row) => <span className="text-ink">{row.department}</span>,
    },
    {
      key: 'direction',
      header: 'Direction',
      sortable: true,
      render: (row) => {
        const meta = DIRECTION_META[row.direction] || DIRECTION_META.Outgoing
        const Icon = meta.icon
        return (
          <span className="inline-flex items-center gap-2 text-ink">
            <span className={clsx('flex h-7 w-7 items-center justify-center rounded-full', meta.cls)}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            {row.direction}
          </span>
        )
      },
    },
    {
      key: 'durationSec',
      header: 'Duration',
      sortable: true,
      render: (row) =>
        row.hasRecording ? (
          <button
            type="button"
            onClick={() => playRecording(row)}
            title="Play recording"
            className="group inline-flex items-center gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-inkSoft transition-colors group-hover:bg-brand-orange group-hover:text-white">
              <Play className="h-3.5 w-3.5 translate-x-[1px]" />
            </span>
            <span className="tabular-nums font-semibold text-ink group-hover:text-brand-orange">
              {row.duration}
            </span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-inkSoft">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas/60">
              <AudioLines className="h-3.5 w-3.5 opacity-40" />
            </span>
            <span className="tabular-nums">—</span>
          </span>
        ),
    },
    {
      key: 'outcome',
      header: 'Outcome',
      sortable: true,
      render: (row) => (
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            OUTCOME_CLS[OUTCOME_TONE[row.outcome] || 'gray'],
          )}
        >
          {row.outcome}
        </span>
      ),
    },
    {
      key: 'day',
      header: 'When',
      render: (row) => (
        <div className="min-w-0">
          <div className="text-ink">{row.day}</div>
          <div className="text-xs text-inkSoft">{row.time}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-0.5">
          <IconAction icon={Phone} label="Call" onClick={() => call(row)} />
          <IconAction
            icon={MessageCircle}
            label="WhatsApp"
            onClick={() => whatsapp(row)}
            className="hover:text-green"
          />
        </div>
      ),
    },
  ]

  const rowActions = (row) => [
    { label: 'View lead', icon: Eye, onClick: () => openDetail(row) },
    ...(row.hasRecording
      ? [{ label: 'Play recording', icon: Play, onClick: () => playRecording(row) }]
      : []),
    { label: 'Call', icon: Phone, onClick: () => call(row) },
  ]

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-inkSoft">
          Every call across all departments, in one place.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
        >
          <Upload className="h-4 w-4 text-inkSoft" />
          Export
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {callKpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Filter bar + table */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-5 py-4">
          <FilterSelect value={dept} onChange={setDept} options={departmentOptions} />
          <FilterSelect value={direction} onChange={setDirection} options={directionOptions} />
          <FilterSelect value={outcome} onChange={setOutcome} options={outcomeOptions} />
          <FilterSelect value={rep} onChange={setRep} options={repOptions} />
          <span className="ml-auto text-xs font-semibold text-inkSoft">
            {rows.length} call{rows.length === 1 ? '' : 's'}
          </span>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowActions={rowActions}
          pageSize={10}
          rowKey={(row) => row.id}
          className="!rounded-none !border-0"
        />
      </Card>

      <CallRecordingModal
        call={recording}
        onClose={() => setRecording(null)}
        onDownload={downloadRecording}
      />
    </div>
  )
}
