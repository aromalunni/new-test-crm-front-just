import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Users,
  UserPlus,
  MapPin,
  FileText,
  CheckCircle2,
  TrendingUp,
  ArrowUp,
  ChevronDown,
  Calendar,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  Bookmark,
  Upload,
  List,
  LayoutGrid,
  Zap,
  Megaphone,
  Facebook,
  Share2,
  PhoneCall,
  Globe,
  DoorOpen,
  Phone,
  MessageCircle,
  Eye,
  Repeat,
  UserX,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import Modal from '../../components/Modal.jsx'
import Menu from '../../components/Menu.jsx'
import { useShell } from '../../context/shell.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
import {
  adminLeads,
  leadKpis,
  stageOptions,
  sourceOptions,
  repOptions,
  typeOptions,
  STAGE_LABELS,
} from '../../data/adminLeads.js'
import { normalizeStage } from '../../config/stages.js'

// ── KPI strip ───────────────────────────────────────────────────────────────
const KPI_ICONS = { Users, UserPlus, MapPin, FileText, CheckCircle2, TrendingUp }

function KpiCard({ kpi }) {
  const Icon = KPI_ICONS[kpi.icon]
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
        <ArrowUp className="h-3.5 w-3.5 text-green" />
        <span className="font-bold text-green tabular-nums">{kpi.delta}</span>
        <span className="font-medium text-inkSoft">vs last month</span>
      </p>
    </Card>
  )
}

// ── Source icons / type badge ───────────────────────────────────────────────
const SOURCE_ICONS = {
  'Google Ads': Megaphone,
  Facebook: Facebook,
  Referral: Share2,
  'Cold Call': PhoneCall,
  Website: Globe,
  'Walk-in': DoorOpen,
}

function TypeBadge({ type }) {
  const online = type === 'online'
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        online ? 'bg-[#E7EEFD] text-[#2F6FED]' : 'bg-[#EFEDE9] text-[#5B6675]',
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', online ? 'bg-[#2F6FED]' : 'bg-[#8A93A3]')} />
      {online ? 'Online' : 'Manual'}
    </span>
  )
}

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

// Small icon button used in the ACTIONS column.
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

// A labelled field used inside the forms / detail modal.
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-inkSoft">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20'

// Reps available to assign (drop the leading "all" option).
const ASSIGNABLE_REPS = repOptions.filter((r) => r.key !== 'all')
const FORM_STAGES = stageOptions.filter((s) => s.key !== 'all')
const FORM_SOURCES = sourceOptions.filter((s) => s.key !== 'all')

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

const DATE_RANGES = [
  { value: 'Today', label: 'Today' },
  { value: 'This week', label: 'This week' },
  { value: 'Jun 25, 2025', label: 'Jun 25, 2025' },
  { value: 'This month', label: 'This month' },
  { value: 'This quarter', label: 'This quarter' },
]

const EMPTY_FORM = {
  name: '',
  phone: '',
  district: '',
  sizeKw: '',
  amount: '',
  stage: 'new',
  source: 'Website',
  type: 'manual',
  rep: ASSIGNABLE_REPS[0]?.label ?? 'Unassigned',
}

export default function AllLeads() {
  const { toast: notify, search } = useShell()
  const navigate = useNavigate()
  const [leadList, setLeadList] = useState(adminLeads)
  const [nameQuery, setNameQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [source, setSource] = useState('all')
  const [rep, setRep] = useState('all')
  const [type, setType] = useState('all')
  const [district, setDistrict] = useState('all')
  const [view, setView] = useState('table') // 'table' | 'grid'
  const [dateRange, setDateRange] = useState('Jun 25, 2025')
  const [savedViews, setSavedViews] = useState(0)

  // Modal state
  const [moreOpen, setMoreOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [reassign, setReassign] = useState(null) // the row being reassigned
  const [reassignTo, setReassignTo] = useState('')
  const [scheduleFor, setScheduleFor] = useState(null)
  const [scheduleAt, setScheduleAt] = useState('')

  // Unique districts for the "More Filters" panel.
  const districtOptions = useMemo(() => {
    const set = Array.from(new Set(adminLeads.map((l) => l.district).filter(Boolean))).sort()
    return [{ key: 'all', label: 'All Districts' }, ...set.map((d) => ({ key: d, label: d }))]
  }, [])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const name = nameQuery.trim().toLowerCase()
    return leadList.filter(
      (l) =>
        (stage === 'all' ||
          (normalizeStage(l.stage) ?? l.stage) === (normalizeStage(stage) ?? stage)) &&
        (source === 'all' || l.source === source) &&
        (rep === 'all' || l.rep === rep) &&
        (type === 'all' || l.type === type) &&
        (district === 'all' || l.district === district) &&
        (!name || l.name.toLowerCase().includes(name)) &&
        (!q ||
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.rep?.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q)),
    )
  }, [leadList, nameQuery, stage, source, rep, type, district, search])

  // ── Actions ──────────────────────────────────────────────────────────────
  function handleExport(list, name) {
    const ok = exportToCsv(
      name,
      list.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        district: l.district,
        sizeKw: l.sizeKw,
        stage: STAGE_LABELS[l.stage] || l.stage,
        source: l.source,
        type: l.type,
        rep: l.rep,
        age: l.age == null ? '' : `${l.age}d`,
        amount: l.amount,
      })),
      [
        { key: 'id', header: 'Lead ID' },
        { key: 'name', header: 'Name' },
        { key: 'phone', header: 'Phone' },
        { key: 'district', header: 'District' },
        { key: 'sizeKw', header: 'Size (kW)' },
        { key: 'stage', header: 'Stage' },
        { key: 'source', header: 'Source' },
        { key: 'type', header: 'Type' },
        { key: 'rep', header: 'Rep' },
        { key: 'age', header: 'Age' },
        { key: 'amount', header: 'Amount' },
      ],
    )
    notify(ok ? `Exported ${list.length} leads` : 'Nothing to export')
  }

  function openReassign(row) {
    setReassign(row)
    setReassignTo(row.rep && row.rep !== 'Unassigned' ? row.rep : ASSIGNABLE_REPS[0]?.label ?? '')
  }
  function confirmReassign() {
    const name = reassignTo
    setLeadList((list) =>
      list.map((l) =>
        l.id === reassign.id
          ? { ...l, rep: name, repInitials: initialsOf(name), repColor: colorFor(name) }
          : l,
      ),
    )
    notify(`${reassign.name} reassigned to ${name}`)
    setReassign(null)
  }
  function unassign(row) {
    setLeadList((list) =>
      list.map((l) =>
        l.id === row.id
          ? { ...l, rep: 'Unassigned', repInitials: 'UA', repColor: '#8A93A3' }
          : l,
      ),
    )
    notify(`${row.name} unassigned`)
  }

  function submitNewLead(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const size = Number(form.sizeKw) || 0
    const amt = Number(String(form.amount).replace(/[^\d.]/g, '')) || 0
    const lead = {
      id: `L${1000 + leadList.length + 1}`,
      name: form.name.trim(),
      initials: initialsOf(form.name.trim()),
      color: colorFor(form.name.trim()),
      phone: form.phone.trim() || '—',
      district: form.district.trim() || '—',
      sizeKw: size,
      stage: form.stage,
      source: form.source,
      type: form.type,
      rep: form.rep,
      repInitials: initialsOf(form.rep),
      repColor: colorFor(form.rep),
      age: 0,
      action: 'Lead created',
      actionTime: 'just now',
      amount: amt ? `₹${amt}` : '—',
      amountValue: amt,
    }
    setLeadList((list) => [lead, ...list])
    notify(`Lead "${lead.name}" created`)
    setNewOpen(false)
    setForm(EMPTY_FORM)
  }

  function openDetail(row) {
    navigate(`/admin/all-leads/${row.id}`)
  }

  function call(row) {
    window.open(`tel:${String(row.phone).replace(/\s/g, '')}`)
    notify(`Calling ${row.name}`)
  }
  function whatsapp(row) {
    const num = String(row.phone).replace(/[^\d]/g, '')
    window.open(`https://wa.me/${num}`, '_blank', 'noopener')
    notify(`WhatsApp ${row.name}`)
  }
  function confirmSchedule() {
    notify(scheduleAt ? `Scheduled ${scheduleFor.name} for ${scheduleAt}` : `Scheduled ${scheduleFor.name}`)
    setScheduleFor(null)
    setScheduleAt('')
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
            <div className="text-xs font-medium text-inkSoft">
              {row.id} · {row.phone}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: 'district',
      header: 'District',
      sortable: true,
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
          <Zap className="h-3.5 w-3.5 text-inkSoft" />
          {row.sizeKw}kW
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
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
        <span className="inline-flex items-center gap-2">
          <Avatar name={row.rep} initials={row.repInitials} color={row.repColor} size="sm" />
          <span className="text-ink">{row.rep}</span>
        </span>
      ),
    },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      align: 'right',
      sortAccessor: (row) => (row.age == null ? -1 : row.age),
      render: (row) => (
        <span className="tabular-nums text-inkSoft">{row.age == null ? '—' : `${row.age}d`}</span>
      ),
    },
    {
      key: 'action',
      header: 'Last Action',
      render: (row) => (
        <div className="min-w-0">
          <div className="truncate text-ink">{row.action}</div>
          <div className="text-xs text-inkSoft">{row.actionTime}</div>
        </div>
      ),
    },
    {
      key: 'amountValue',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-ink tabular-nums">{row.amount}</span>,
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
          <IconAction icon={Calendar} label="Schedule" onClick={() => setScheduleFor(row)} />
        </div>
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
      {/* Page header — subtitle + page actions (title lives in the shared top bar) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-inkSoft">
          Manage and track all your leads in one place.
        </p>
        <div className="flex items-center gap-2">
          <Menu
            label={
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-inkSoft" />
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
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_FORM)
              setNewOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk"
          >
            <Plus className="h-4 w-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* 1 — KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {leadKpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

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
            <FilterSelect value={stage} onChange={setStage} options={stageOptions} />
            <FilterSelect value={source} onChange={setSource} options={sourceOptions} />
            <FilterSelect value={rep} onChange={setRep} options={repOptions} />
            <FilterSelect value={type} onChange={setType} options={typeOptions} />
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={clsx(
                'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors',
                district !== 'all'
                  ? 'border-brand-orange/40 bg-brand-orange/5 text-brand-orange'
                  : 'border-border bg-white text-ink hover:bg-canvas',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {district !== 'all' && (
                <span className="ml-0.5 rounded-full bg-brand-orange px-1.5 text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSavedViews((n) => n + 1)
                notify('View saved')
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
            >
              <Bookmark className="h-3.5 w-3.5 text-inkSoft" />
              Save View{savedViews > 0 ? ` (${savedViews})` : ''}
            </button>
            <button
              type="button"
              onClick={() => handleExport(rows, 'all-leads')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
            >
              <Upload className="h-3.5 w-3.5 text-inkSoft" />
              Export
            </button>
            <div className="flex items-center rounded-xl border border-border bg-white p-0.5">
              <button
                type="button"
                aria-label="Table view"
                onClick={() => setView('table')}
                className={clsx(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  view === 'table'
                    ? 'bg-brand-orange text-white'
                    : 'text-inkSoft hover:bg-canvas hover:text-ink',
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView('grid')}
                className={clsx(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                  view === 'grid'
                    ? 'bg-brand-orange text-white'
                    : 'text-inkSoft hover:bg-canvas hover:text-ink',
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {view === 'table' ? (
          <DataTable
            columns={columns}
            rows={rows}
            selectable
            rowActions={rowActions}
            pageSize={10}
            className="!rounded-none !border-0"
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {rows.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-inkSoft">No leads match.</p>
            )}
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => openDetail(row)}
                className="rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-brand-orange/40 hover:bg-canvas/40"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={row.name} initials={row.initials} color={row.color} size="md" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-ink">{row.name}</div>
                    <div className="text-xs text-inkSoft">{row.id} · {row.phone}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge variant={row.stage}>{STAGE_LABELS[row.stage] || row.stage}</StatusBadge>
                  <span className="text-sm font-bold text-ink tabular-nums">{row.amount}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-inkSoft">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {row.district}
                  </span>
                  <span>{row.rep}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* ── New Lead modal ─────────────────────────────────────────────────── */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Lead"
        subtitle="Add a lead manually. It appears at the top of the list."
        width="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setNewOpen(false)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-lead-form"
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Create lead
            </button>
          </>
        }
      >
        <form id="new-lead-form" onSubmit={submitNewLead} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Customer name"
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
              placeholder="+91 …"
            />
          </Field>
          <Field label="District">
            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className={inputCls}
              placeholder="District"
            />
          </Field>
          <Field label="Size (kW)">
            <input
              inputMode="numeric"
              value={form.sizeKw}
              onChange={(e) => setForm({ ...form, sizeKw: e.target.value })}
              className={inputCls}
              placeholder="5"
            />
          </Field>
          <Field label="Stage">
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className={inputCls}
            >
              {FORM_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className={inputCls}
            >
              {FORM_SOURCES.map((s) => (
                <option key={s.key} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputCls}
            >
              <option value="manual">Manual</option>
              <option value="online">Online</option>
            </select>
          </Field>
          <Field label="Assign to">
            <select
              value={form.rep}
              onChange={(e) => setForm({ ...form, rep: e.target.value })}
              className={inputCls}
            >
              {ASSIGNABLE_REPS.map((r) => (
                <option key={r.key} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Estimated amount (₹)">
              <input
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={inputCls}
                placeholder="420000"
              />
            </Field>
          </div>
        </form>
      </Modal>

      {/* ── More Filters modal ─────────────────────────────────────────────── */}
      <Modal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More Filters"
        subtitle="Refine the list further."
        width="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setDistrict('all')
                notify('Filters cleared')
              }}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Apply
            </button>
          </>
        }
      >
        <Field label="District">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={inputCls}
          >
            {districtOptions.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
      </Modal>

      {/* ── Reassign modal ─────────────────────────────────────────────────── */}
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
        <Field label="Assign to">
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            className={inputCls}
          >
            {ASSIGNABLE_REPS.map((r) => (
              <option key={r.key} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
      </Modal>

      {/* ── Schedule modal ─────────────────────────────────────────────────── */}
      <Modal
        open={!!scheduleFor}
        onClose={() => setScheduleFor(null)}
        title="Schedule follow-up"
        subtitle={scheduleFor ? `For ${scheduleFor.name}` : ''}
        width="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setScheduleFor(null)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmSchedule}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Schedule
            </button>
          </>
        }
      >
        <Field label="Date & time">
          <input
            type="datetime-local"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            className={inputCls}
          />
        </Field>
      </Modal>
    </div>
  )
}
