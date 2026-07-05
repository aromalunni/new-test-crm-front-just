import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  User,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List,
  MoreVertical,
  Send,
  CheckCircle2,
  ClipboardList,
  Zap,
  Wrench,
  Repeat,
  StickyNote,
  ArrowUpCircle,
  UserCog,
  Eye,
  Trash2,
  MapPin,
  BarChart3,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import Modal from '../../components/Modal.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import { useShell } from '../../context/shell.jsx'
import { teamLeads, CURRENT_DEPT, STAGE_CODE, STAGE_LABELS } from '../../data/teamLeads.js'
import { STAGES, normalizeStage } from '../../config/stages.js'

// Pipeline stage codes, in canonical order — drives the stage-step row and
// stage sorting. Derived from the 14-stage config (single source of truth).
const STAGE_ORDER = STAGES.map((s) => s.short)

// A chip is derived from the lead's pipeline stage so every card shows its
// current "next action" at a glance, keyed by canonical stage. tone: 'green' | 'orange'.
const CHIP_BY_STAGE = {
  new: { tone: 'orange', icon: 'clipboard', label: 'Call now' },
  contacted: { tone: 'orange', icon: 'clipboard', label: 'Follow up' },
  qualified: { tone: 'orange', icon: 'clipboard', label: 'Schedule survey' },
  'survey-scheduled': { tone: 'orange', icon: 'clipboard', label: 'Survey booked' },
  'survey-completed': { tone: 'orange', icon: 'send', label: 'Send proposal' },
  'proposal-sent': { tone: 'orange', icon: 'send', label: 'Awaiting decision' },
  negotiation: { tone: 'orange', icon: 'clipboard', label: 'In negotiation' },
  'booking-confirmed': { tone: 'green', icon: 'check', label: 'Booking confirmed' },
  'agreement-generated': { tone: 'green', icon: 'check', label: 'Agreement ready' },
  'loan-processing': { tone: 'orange', icon: 'clipboard', label: 'Loan processing' },
  'project-execution': { tone: 'green', icon: 'zap', label: 'Installation' },
  'documentation-subsidy': { tone: 'orange', icon: 'clipboard', label: 'Subsidy filed' },
  'handover-complete': { tone: 'green', icon: 'check', label: 'Handover done' },
  'after-sales-active': { tone: 'green', icon: 'wrench', label: 'Service active' },
}

// Map a master lead into the card shape this screen renders.
function toCard(l) {
  const chip = CHIP_BY_STAGE[normalizeStage(l.stage) ?? l.stage]
  return {
    id: l.id,
    name: l.name,
    initials: l.initials,
    color: l.color,
    district: l.district,
    sizeKw: l.sizeKw,
    amount: l.amount,
    rep: l.rep,
    stage: STAGE_CODE[l.stage],
    stageKey: l.stage,
    chips: chip ? [chip] : [],
  }
}

// The signed-in dept head's department slice of the master dataset.
const DEPT_LEADS = teamLeads.filter((l) => l.dept === CURRENT_DEPT)
const INITIAL_LEADS = DEPT_LEADS.map(toCard)

// Reps you can hand a lead to — the reps working in this department.
const DEPT_REPS = [...new Set(DEPT_LEADS.map((l) => l.rep))]

const CHIP_ICONS = { send: Send, check: CheckCircle2, clipboard: ClipboardList, zap: Zap, wrench: Wrench }

// Top filter pills — broad stage buckets, with counts derived from the data.
const BUCKETS = [
  { key: 'all', label: 'All', codes: STAGE_ORDER },
  { key: 'active', label: 'Active', codes: ['NEW', 'CONT', 'QUAL', 'SCHD', 'SURV'] },
  { key: 'proposal', label: 'Proposal', codes: ['QUOTE', 'NEGO', 'BOOK'] },
  { key: 'closing', label: 'Closing', codes: ['AGR', 'LOAN', 'EXEC', 'SUBS'] },
  { key: 'done', label: 'Complete', codes: ['HAND', 'SVC'] },
]

// Values are the compact stage codes (they match a card's `stage`); labels are
// the full canonical names. Derived from the config so all 14 stages are here.
const STAGE_DROPDOWN_OPTIONS = [
  { key: 'all', label: 'All Stages' },
  ...STAGES.map((s) => ({ key: s.short, label: s.label })),
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Sort: Newest' },
  { key: 'amount', label: 'Sort: Amount' },
  { key: 'stage', label: 'Sort: Stage' },
]

// Management actions shown at the bottom of every owned-lead card.
const MGMT_ACTIONS = [
  { key: 'transfer', label: 'Transfer to rep', icon: Repeat },
  { key: 'note', label: 'Add note', icon: StickyNote },
  { key: 'escalate', label: 'Escalate', icon: ArrowUpCircle },
  { key: 'reassign', label: 'Reassign', icon: UserCog },
]

function StageSteps({ current }) {
  const idx = STAGE_ORDER.indexOf(current)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {STAGE_ORDER.map((code, i) => {
        const active = i === idx
        const done = i < idx
        return (
          <span
            key={code}
            className={clsx(
              'inline-flex h-6 min-w-[28px] items-center justify-center rounded-md px-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors',
              active && 'bg-[#F26B3A] text-white',
              done && 'bg-[#FBD9CC] text-[#d95a2b]',
              !active && !done && 'border border-gray-200 bg-white text-gray-400',
            )}
          >
            {code}
          </span>
        )
      })}
    </div>
  )
}

function Chip({ tone, icon, label }) {
  const Icon = CHIP_ICONS[icon]
  const tones = {
    green: 'bg-green-50 text-green-700 border border-green-100/70',
    orange: 'bg-[#FFEDE4] text-[#d95a2b]',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold tracking-wide', tones[tone])}>
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {label}
    </span>
  )
}

function CardMenu({ onView, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="relative -mr-1.5 -mt-1" ref={ref}>
      <button
        type="button"
        aria-label="Lead options"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onView()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 text-gray-400" />
            View profile
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onRemove()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red transition-colors hover:bg-redSoft/40"
          >
            <Trash2 className="h-4 w-4" />
            Remove from my leads
          </button>
        </div>
      )}
    </div>
  )
}

function LeadCard({ lead, onAction }) {
  return (
    <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="md" />
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-gray-900 tracking-tight">{lead.name}</div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                {lead.district} · {lead.sizeKw}kW · {lead.amount}
              </div>
            </div>
          </div>
          <CardMenu
            onView={() => onAction('view', lead)}
            onRemove={() => onAction('remove', lead)}
          />
        </div>

        <div className="pt-0.5">
          <StageSteps current={lead.stage} />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
            <User className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.5} />
            {lead.rep}
          </span>
          {lead.chips.map((c) => (
            <Chip key={c.label} tone={c.tone} icon={c.icon} label={c.label} />
          ))}
        </div>
      </div>

      {/* Management action row — dept head controls over the team's leads */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-50">
        {MGMT_ACTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onAction(key, lead)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            <Icon className="h-3.5 w-3.5 text-gray-500" strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}

export default function MyLeads() {
  const navigate = useNavigate()
  const { toast: notify, search } = useShell()
  const [tab, setTab] = useState('all')
  const [view, setView] = useState('list')
  const [stageFilter, setStageFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [noteFor, setNoteFor] = useState(null) // lead | null
  const [noteText, setNoteText] = useState('')
  const [transferFor, setTransferFor] = useState(null) // { lead, mode } | null
  const [targetRep, setTargetRep] = useState(DEPT_REPS[0])

  function removeLead(id) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  function handleAction(key, lead) {
    switch (key) {
      case 'view':
        navigate('/lead/performance')
        break
      case 'remove':
        removeLead(lead.id)
        notify(`Removed ${lead.name}`)
        break
      case 'note':
        setNoteText('')
        setNoteFor(lead)
        break
      case 'transfer':
      case 'reassign':
        setTargetRep(DEPT_REPS.find((r) => r !== lead.rep) || DEPT_REPS[0])
        setTransferFor({ lead, mode: key })
        break
      case 'escalate':
        notify(`Escalated ${lead.name} to manager`)
        break
      default:
        break
    }
  }

  function saveNote() {
    notify(`Note added — ${noteFor.name}`)
    setNoteFor(null)
    setNoteText('')
  }

  function confirmTransfer() {
    const verb = transferFor.mode === 'transfer' ? 'Transferred' : 'Reassigned'
    if (transferFor.mode === 'transfer') {
      // Transfer hands the lead to another rep — it leaves this list.
      removeLead(transferFor.lead.id)
    } else {
      // Reassign keeps the lead in the department, just changes the owning rep.
      setLeads((prev) =>
        prev.map((l) => (l.id === transferFor.lead.id ? { ...l, rep: targetRep } : l)),
      )
    }
    notify(`${verb} ${transferFor.lead.name} → ${targetRep}`)
    setTransferFor(null)
  }

  // List view renders the same All Leads style table (DataTable) instead of cards.
  const listColumns = [
    {
      key: 'name',
      header: 'Lead',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => handleAction('view', row)}
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
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      sortAccessor: (row) => parseFloat(String(row.amount).replace(/[^0-9.]/g, '')) || 0,
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.amount}</span>,
    },
    {
      key: 'stageKey',
      header: 'Stage',
      sortable: true,
      sortAccessor: (row) => STAGE_ORDER.indexOf(row.stage),
      render: (row) => (
        <StatusBadge variant={row.stageKey}>{STAGE_LABELS[row.stageKey] || row.stageKey}</StatusBadge>
      ),
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
  ]

  const listRowActions = (row) => [
    { label: 'View profile', icon: Eye, onClick: () => handleAction('view', row) },
    { label: 'Transfer to rep', icon: Repeat, onClick: () => handleAction('transfer', row) },
    { label: 'Add note', icon: StickyNote, onClick: () => handleAction('note', row) },
    { label: 'Escalate', icon: ArrowUpCircle, onClick: () => handleAction('escalate', row) },
    { label: 'Reassign', icon: UserCog, onClick: () => handleAction('reassign', row) },
    {
      label: 'Remove from my leads',
      icon: Trash2,
      danger: true,
      onClick: () => handleAction('remove', row),
    },
  ]

  // Counts for the bucket pills — from the full department list, ignoring filters.
  const bucketCounts = useMemo(() => {
    const counts = {}
    for (const b of BUCKETS) {
      counts[b.key] = leads.filter((l) => b.codes.includes(l.stage)).length
    }
    return counts
  }, [leads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const bucket = BUCKETS.find((b) => b.key === tab)
    let list = leads.filter((l) => {
      if (tab !== 'all' && bucket && !bucket.codes.includes(l.stage)) return false
      if (stageFilter !== 'all' && l.stage !== stageFilter) return false
      if (q && !l.name.toLowerCase().includes(q)) return false
      return true
    })

    list = [...list].sort((a, b) => {
      const numA = parseFloat(String(a.amount).replace(/[^0-9.]/g, '')) || 0
      const numB = parseFloat(String(b.amount).replace(/[^0-9.]/g, '')) || 0
      if (sortOrder === 'amount') return numB - numA
      if (sortOrder === 'stage') return STAGE_ORDER.indexOf(b.stage) - STAGE_ORDER.indexOf(a.stage)
      return 0
    })

    return list
  }, [leads, tab, stageFilter, sortOrder, search])

  const [open, setOpen] = useState(true)

  return (
    <div className="w-full space-y-6">
      {/* Stage bucket tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-100 pb-3">
        {BUCKETS.map((t) => {
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-tight transition-all active:scale-[0.98]',
                isActive
                  ? 'bg-[#F26B3A] text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700',
              )}
            >
              {t.label}
              <span className={clsx('text-xs font-bold rounded-md px-1.5 py-0.5', isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400')}>
                {bucketCounts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Control row: stage dropdown + sort, and grid/list toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative inline-block">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-3 pr-9 py-2 text-sm font-bold focus:outline-none focus:border-[#F26B3A] focus:bg-white cursor-pointer hover:border-gray-300 transition-all"
            >
              {STAGE_DROPDOWN_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative inline-block">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-3 pr-9 py-2 text-sm font-bold focus:outline-none focus:border-[#F26B3A] focus:bg-white cursor-pointer hover:border-gray-300 transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-inner">
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setView('grid')}
            className={clsx(
              'flex h-8 w-9 items-center justify-center rounded-lg transition-all',
              view === 'grid' ? 'bg-[#F26B3A] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700',
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setView('list')}
            className={clsx(
              'flex h-8 w-9 items-center justify-center rounded-lg transition-all',
              view === 'list' ? 'bg-[#F26B3A] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700',
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Header note card — department scope */}
      <Card className="!p-4 border border-gray-100 rounded-2xl bg-[#FAFAFB] shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-600">
            <User className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-gray-600 pt-1">
            <span className="font-bold text-gray-900">{CURRENT_DEPT} Department</span> — every lead owned
            by the team you head. Open <span className="font-semibold text-gray-900">All Leads</span> to see all departments.
          </p>
        </div>
      </Card>

      {/* Department leads */}
      <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm w-full space-y-5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-start justify-between gap-3 text-left group"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl p-2 bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 shrink-0 text-gray-700" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-gray-900">{CURRENT_DEPT} · My Leads</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                  {filtered.length}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 tracking-wide">
                Leads owned by the {CURRENT_DEPT} department.
              </p>
            </div>
          </div>
          <div className="p-1 rounded-lg hover:bg-gray-50 transition-colors mt-1">
            <ChevronUp
              className={clsx('h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', !open && 'rotate-180')}
            />
          </div>
        </button>

        {open && filtered.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onAction={handleAction} />
            ))}
          </div>
        )}

        {open && filtered.length > 0 && view === 'list' && (
          <DataTable
            columns={listColumns}
            rows={filtered}
            rowActions={listRowActions}
            pageSize={10}
          />
        )}

        {open && filtered.length === 0 && (
          <p className="py-8 text-center text-sm font-semibold text-gray-500">
            No leads in this department match the current filters.
          </p>
        )}
      </Card>

      {/* Add note modal */}
      <Modal
        open={!!noteFor}
        onClose={() => setNoteFor(null)}
        title="Add note"
        subtitle={noteFor ? `Note for ${noteFor.name}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setNoteFor(null)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteText.trim()}
              onClick={saveNote}
              className="rounded-xl bg-[#F26B3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E2552A] disabled:cursor-not-allowed disabled:opacity-50"
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
          placeholder="Add a note about this lead…"
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-[#F26B3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F26B3A]/15"
        />
      </Modal>

      {/* Transfer / reassign modal */}
      <Modal
        open={!!transferFor}
        onClose={() => setTransferFor(null)}
        title={transferFor?.mode === 'transfer' ? 'Transfer to rep' : 'Reassign lead'}
        subtitle={transferFor ? transferFor.lead.name : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setTransferFor(null)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmTransfer}
              className="rounded-xl bg-[#F26B3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E2552A]"
            >
              {transferFor?.mode === 'transfer' ? 'Transfer' : 'Reassign'}
            </button>
          </>
        }
      >
        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Assign to rep</span>
          <select
            value={targetRep}
            onChange={(e) => setTargetRep(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 focus:border-[#F26B3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F26B3A]/15"
          >
            {DEPT_REPS.map((r) => (
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
