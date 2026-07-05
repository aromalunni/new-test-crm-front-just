import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Info,
  ChevronDown,
  Search,
  Upload,
  MapPin,
  BarChart3,
  Megaphone,
  Share2,
  Globe,
  User,
  Lock,
  Repeat,
  Eye,
  UserX,
  X,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import Modal from '../../components/Modal.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
import { useShell } from '../../context/shell.jsx'
import { normalizeStage } from '../../config/stages.js'
import {
  teamLeads,
  stageOptions,
  sourceOptions,
  repOptions,
  typeOptions,
  deptOptions,
  STAGE_LABELS,
} from '../../data/teamLeads.js'

const REASSIGN_REPS = ['Ravi Kumar', 'Priya Nair', 'Arun Menon', 'Vinod Jose']

const SOURCE_ICONS = { 'Google Ads': Megaphone, Referral: Share2, Website: Globe }

// Columns used for both the header (full filtered list) and bulk (selected) CSV export.
const EXPORT_COLUMNS = [
  { key: 'id', header: 'Lead ID' },
  { key: 'name', header: 'Lead' },
  { key: 'dept', header: 'Dept' },
  { key: 'district', header: 'District' },
  { key: 'sizeKw', header: 'Size (kW)' },
  { key: 'amount', header: 'Amount' },
  { key: 'stage', header: 'Stage' },
  { key: 'source', header: 'Source' },
  { key: 'type', header: 'Type' },
  { key: 'rep', header: 'Rep' },
  { key: 'age', header: 'Age (days)' },
]

// Native <select> styled to the token palette with a trailing chevron.
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

function TypeBadge({ type }) {
  if (type === 'owner-locked') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#EFEDE9] px-2.5 py-0.5 text-[11px] font-semibold text-[#5B6675]">
        <Lock className="h-3 w-3" />
        OWNER-LOCKED
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#E7EEFD] px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6FED]">
      <Globe className="h-3 w-3" />
      ONLINE
    </span>
  )
}

export default function AllLeads() {
  const { toast: notify, search } = useShell()
  const navigate = useNavigate()
  const [leadRows, setLeadRows] = useState(teamLeads)
  const [nameQuery, setNameQuery] = useState('')
  const [dept, setDept] = useState('all')
  const [stage, setStage] = useState('all')
  const [source, setSource] = useState('all')
  const [rep, setRep] = useState('all')
  const [type, setType] = useState('all')
  const [date, setDate] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [resetKey, setResetKey] = useState(0)
  const [reassign, setReassign] = useState(null) // { ids:[], label } | null
  const [targetRep, setTargetRep] = useState(REASSIGN_REPS[0])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const name = nameQuery.trim().toLowerCase()
    return leadRows.filter(
      (l) =>
        (dept === 'all' || l.dept === dept) &&
        (stage === 'all' ||
          (normalizeStage(l.stage) ?? l.stage) === (normalizeStage(stage) ?? stage)) &&
        (source === 'all' || l.source === source) &&
        (rep === 'all' || l.rep === rep) &&
        (type === 'all' || l.type === type) &&
        (!name || l.name.toLowerCase().includes(name)) &&
        (!q ||
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.rep.toLowerCase().includes(q)),
    )
  }, [leadRows, nameQuery, dept, stage, source, rep, type, search])

  function openDetail(row) {
    navigate(`/lead/all-leads/${row.id}`)
  }

  // Open the reassign modal for a single lead (owner-locked ones are blocked).
  function openReassign(row) {
    if (row.type === 'owner-locked') {
      notify(`${row.name} is owner-locked — cannot reassign`)
      return
    }
    setTargetRep(REASSIGN_REPS.find((r) => r !== row.rep) || REASSIGN_REPS[0])
    setReassign({ ids: [row.id], label: row.name })
  }

  // Open the reassign modal for the current multi-select (skips locked leads).
  function openBulkReassign() {
    const eligible = leadRows.filter(
      (l) => selectedIds.includes(l.id) && l.type !== 'owner-locked',
    )
    if (eligible.length === 0) {
      notify('No reassignable leads selected (owner-locked excluded)')
      return
    }
    setTargetRep(REASSIGN_REPS[0])
    setReassign({ ids: eligible.map((l) => l.id), label: `${eligible.length} leads` })
  }

  function confirmReassign() {
    const ids = new Set(reassign.ids)
    setLeadRows((prev) => prev.map((l) => (ids.has(l.id) ? { ...l, rep: targetRep } : l)))
    notify(`Reassigned ${reassign.label} → ${targetRep}`)
    setReassign(null)
    clearSelection()
  }

  function unassign(row) {
    if (row.type === 'owner-locked') {
      notify(`${row.name} is owner-locked — cannot unassign`)
      return
    }
    setLeadRows((prev) => prev.map((l) => (l.id === row.id ? { ...l, rep: 'Unassigned' } : l)))
    notify(`Unassigned ${row.name}`)
  }

  function clearSelection() {
    setSelectedIds([])
    setResetKey((k) => k + 1)
  }

  const columns = [
    {
      key: 'name',
      header: 'Lead',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar name={row.name} initials={row.initials} color={row.color} size="md" />
          <div className="min-w-0">
            <div className="font-semibold text-ink hover:text-brand-orange">{row.name}</div>
            <div className="text-xs font-medium text-inkSoft">{row.id}</div>
          </div>
        </button>
      ),
    },
    {
      key: 'dept',
      header: 'Dept',
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-[#EEF1F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#42506A]">
          {row.dept}
        </span>
      ),
    },
    {
      key: 'district',
      header: 'District',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-ink">
          <MapPin className="h-3.5 w-3.5 text-inkSoft" />
          {row.district}
        </span>
      ),
    },
    {
      key: 'sizeKw',
      header: 'Size',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink tabular-nums">
          <BarChart3 className="h-3.5 w-3.5 text-inkSoft" />
          {row.sizeKw}kW
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (row) => (
        <StatusBadge variant={row.stage}>{STAGE_LABELS[row.stage] || row.stage}</StatusBadge>
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
      key: 'type',
      header: 'Type',
      render: (row) => <TypeBadge type={row.type} />,
    },
    {
      key: 'rep',
      header: 'Rep',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-ink">
          <User className="h-3.5 w-3.5 text-inkSoft" />
          {row.rep}
        </span>
      ),
    },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      align: 'right',
      render: (row) => <span className="tabular-nums text-inkSoft">{row.age}d</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) =>
        row.type === 'owner-locked' ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs font-semibold text-inkSoft">
            <Lock className="h-3.5 w-3.5" />
            Locked
          </span>
        ) : (
          <button
            type="button"
            onClick={() => openReassign(row)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
          >
            <Repeat className="h-3.5 w-3.5" />
            Reassign
          </button>
        ),
    },
  ]

  const rowActions = (row) => [
    { label: 'View lead', icon: Eye, onClick: () => openDetail(row) },
    { label: 'Reassign', icon: Repeat, onClick: () => openReassign(row) },
    {
      label: 'Unassign',
      icon: UserX,
      danger: true,
      onClick: () => unassign(row),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1 — Scope banner */}
      <Card className="!p-4 border-l-4 border-l-blue bg-[#F1F4F9]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue">
            <Info className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-ink">
            <span className="font-bold">Company-wide — every department.</span> Owner-locked leads
            can only be shared by the owning rep. Use the Department filter to narrow by team.
          </p>
        </div>
      </Card>

      {/* 2 + 3 — Filter bar and table in one card */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
              <input
                type="text"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Filter by lead name…"
                className="h-9 w-56 rounded-xl border border-border bg-canvas pl-9 pr-8 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-inkSoft transition-colors hover:border-inkSoft/40 focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
              />
              {nameQuery && (
                <button
                  type="button"
                  aria-label="Clear name filter"
                  onClick={() => setNameQuery('')}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-inkSoft transition-colors hover:bg-border/60 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <FilterSelect value={dept} onChange={setDept} options={deptOptions} />
            <FilterSelect value={stage} onChange={setStage} options={stageOptions} />
            <FilterSelect value={source} onChange={setSource} options={sourceOptions} />
            <FilterSelect value={rep} onChange={setRep} options={repOptions} />
            <FilterSelect value={type} onChange={setType} options={typeOptions} />
            <div className="relative inline-block">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 cursor-pointer rounded-xl border border-border bg-canvas pl-3 pr-3 text-sm font-semibold text-ink transition-colors hover:border-inkSoft/40 focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              exportToCsv('all-leads', rows, EXPORT_COLUMNS)
              notify(`Exported ${rows.length} leads`)
            }}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas lg:self-auto"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </button>
        </div>

        {/* Bulk action bar — appears when rows are selected */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-brand-orange/[0.06] px-5 py-3">
            <span className="text-sm font-semibold text-ink">{selectedIds.length} selected</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openBulkReassign}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeDk"
              >
                <Repeat className="h-3.5 w-3.5" />
                Reassign selected
              </button>
              <button
                type="button"
                onClick={() => {
                  const selected = leadRows.filter((l) => selectedIds.includes(l.id))
                  exportToCsv('selected-leads', selected, EXPORT_COLUMNS)
                  notify(`Exported ${selected.length} selected leads`)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
              >
                <Upload className="h-3.5 w-3.5" />
                Export
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-inkSoft transition-colors hover:bg-canvas"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          rows={rows}
          selectable
          rowActions={rowActions}
          onSelectionChange={setSelectedIds}
          selectionResetKey={resetKey}
          pageSize={10}
          className="!rounded-none !border-0"
        />
      </Card>

      {/* Reassign modal */}
      <Modal
        open={!!reassign}
        onClose={() => setReassign(null)}
        title="Reassign lead"
        subtitle={reassign ? `Reassigning ${reassign.label}` : ''}
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
          <span className="text-xs font-semibold text-inkSoft">Assign to rep</span>
          <select
            value={targetRep}
            onChange={(e) => setTargetRep(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-border bg-canvas px-3 text-sm font-semibold text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
          >
            {REASSIGN_REPS.map((r) => (
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
