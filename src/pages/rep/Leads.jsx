import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Globe,
  User,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List,
  MoreVertical,
  Phone,
  MessageCircle,
  Calendar,
  Send,
  CheckCircle2,
  ClipboardList,
  Zap,
  Wrench,
  Clock,
  Eye,
  X,
  MapPin,
  BarChart3,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import { stages, stageTabs, sections as initialSections } from '../../data/myLeads.js'

const CHIP_ICONS = { send: Send, check: CheckCircle2, clipboard: ClipboardList, zap: Zap, wrench: Wrench }
const SECTION_ICONS = { globe: Globe, user: User }

// Stage code -> StatusBadge variant key / uppercased label for the list view.
const CODE_TO_STAGE = {
  N: 'new',
  C: 'contacted',
  SV: 'site-visited',
  PS: 'proposal-sent',
  AP: 'advance-paid',
  DC: 'docs',
  SF: 'subsidy',
  KA: 'kseb',
  CM: 'commissioned',
}
const CODE_STAGE_LABELS = {
  N: 'NEW',
  C: 'CONTACTED',
  SV: 'SITE VISITED',
  PS: 'PROPOSAL SENT',
  AP: 'ADVANCE PAID',
  DC: 'DOCS COMPLETE',
  SF: 'SUBSIDY FILED',
  KA: 'KSEB APPROVED',
  CM: 'COMMISSIONED',
}

function amountValue(amount) {
  return typeof amount === 'number'
    ? amount
    : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0
}
function amountText(amount) {
  return typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount
}

const STAGE_DROPDOWN_OPTIONS = [
  { key: 'all', label: 'All Stages' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'site visited', label: 'Site Visited' },
  { key: 'proposal sent', label: 'Proposal Sent' },
  { key: 'advance paid', label: 'Advance Paid' },
  { key: 'docs complete', label: 'Docs Complete' },
  { key: 'subsidy filed', label: 'Subsidy Filed' },
  { key: 'kseb approved', label: 'KSEB Approved' },
  { key: 'commissioned', label: 'Commissioned' }
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Sort: Newest' },
  { key: 'age', label: 'Sort: Age' },
  { key: 'amount', label: 'Sort: Amount' }
]

// Leads store a short stage code ('SV', 'AP', …) but the filter UIs speak two
// other vocabularies: the tabs use brief keys ('proposal') and the dropdown
// uses full phrases ('proposal sent'). Map each code to every key it satisfies
// so a single code matches in both. Codes with no listed key (none here) and
// the 'stalled' tab simply match nothing.
const STAGE_CODE_KEYS = {
  N: ['new'],
  C: ['contacted'],
  SV: ['site visited'],
  PS: ['proposal', 'proposal sent'],
  AP: ['advance paid'],
  DC: ['docs complete'],
  SF: ['subsidy filed'],
  KA: ['kseb approved'],
  CM: ['commissioned'],
}

function StageSteps({ current }) {
  const idx = stages.indexOf(current)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {stages.map((code, i) => {
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

function LeadCard({ lead, notify, onScheduleInit }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const openDetail = () => navigate(`/rep/leads/${lead.id}`)

  useEffect(() => {
    if (!menuOpen) return undefined
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleCall = (e) => {
    e?.stopPropagation()
    const targetPhone = lead.phone || '9876543210'
    window.location.href = `tel:${targetPhone}`
  }

  const handleWhatsApp = (e) => {
    e?.stopPropagation()
    const targetPhone = lead.phone || '9876543210'
    const msg = encodeURIComponent(`Hello ${lead.name}, connecting regarding your solar solution query.`)
    window.open(`https://wa.me/91${targetPhone}?text=${msg}`, '_blank')
  }

  const menuItems = [
    { label: 'View details', icon: Eye, onClick: () => openDetail() },
    { label: 'Call', icon: Phone, onClick: () => handleCall() },
    { label: 'WhatsApp', icon: MessageCircle, onClick: () => handleWhatsApp() },
    { label: 'Schedule', icon: Calendar, onClick: () => onScheduleInit(lead) },
    { label: 'Mark as lost', icon: X, danger: true, onClick: () => notify(`Marked ${lead.name} as lost`) },
  ]

  return (
    <Card
      onClick={openDetail}
      className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="md" />
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-gray-900 tracking-tight">{lead.name}</div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                {lead.district} · {lead.sizeKw}kW · {typeof lead.amount === 'number' ? `₹${lead.amount.toLocaleString('en-IN')}` : lead.amount}
              </div>
            </div>
          </div>
          <div className="relative -mr-1.5 -mt-1" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen((o) => !o)
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 min-w-[176px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(false)
                        item.onClick()
                      }}
                      className={clsx(
                        'flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-bold transition-colors',
                        item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      <Icon
                        className={clsx('h-3.5 w-3.5 shrink-0', item.danger ? 'text-red-500' : 'text-gray-400')}
                        strokeWidth={2.5}
                      />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pt-0.5">
          <StageSteps current={lead.stage} />
        </div>

        {lead.schedule && (
          <div className="p-3 rounded-xl border border-amber-100 bg-[#FFFBEB] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#B97A1C] tracking-wide">
              <Clock className="h-3.5 w-3.5" />
              <span>Scheduled: {lead.schedule.date} @ {lead.schedule.time}</span>
            </div>
            {lead.schedule.note && (
              <p className="text-gray-600 font-medium pl-5 truncate">"{lead.schedule.note}"</p>
            )}
          </div>
        )}

        {lead.chips && lead.chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {lead.chips.map((c) => (
              <Chip key={c.label} tone={c.tone} icon={c.icon} label={c.label} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-gray-50">
        <button
          type="button"
          onClick={handleCall}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
        >
          <Phone className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.5} />
          Call
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-white py-2 text-xs font-bold text-green-600 hover:bg-green-50 hover:border-green-300 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="h-3.5 w-3.5 text-green-600" strokeWidth={2.5} />
          WA
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onScheduleInit(lead)
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent bg-[#FFF5F0] px-2.5 py-2 text-xs font-bold text-[#d95a2b] hover:bg-[#FFEBE1] transition-all active:scale-[0.98]"
        >
          <Calendar className="h-3.5 w-3.5 text-[#F26B3A]" strokeWidth={2.5} />
          Sched
        </button>
      </div>
    </Card>
  )
}

function Section({ section, view, notify, onScheduleInit }) {
  const [open, setOpen] = useState(true)
  const Icon = SECTION_ICONS[section.icon]
  const navigate = useNavigate()

  if (section.leads.length === 0) return null

  function callLead(lead) {
    window.location.href = `tel:${lead.phone || '9876543210'}`
  }
  function whatsappLead(lead) {
    const msg = encodeURIComponent(`Hello ${lead.name}, connecting regarding your solar solution query.`)
    window.open(`https://wa.me/91${lead.phone || '9876543210'}?text=${msg}`, '_blank')
  }

  // List view renders the same All Leads style table (DataTable) instead of cards.
  const listColumns = [
    {
      key: 'name',
      header: 'Lead',
      sortable: true,
      render: (lead) => (
        <button
          type="button"
          onClick={() => navigate(`/rep/leads/${lead.id}`)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar name={lead.name} size="md" />
          <div className="min-w-0">
            <div className="font-semibold text-ink hover:text-brand-orange">{lead.name}</div>
            <div className="text-xs font-medium text-inkSoft">{lead.id}</div>
          </div>
        </button>
      ),
    },
    {
      key: 'district',
      header: 'District',
      render: (lead) => (
        <span className="inline-flex items-center gap-1.5 text-ink">
          <MapPin className="h-3.5 w-3.5 text-inkSoft" />
          {lead.district}
        </span>
      ),
    },
    {
      key: 'sizeKw',
      header: 'Size',
      sortable: true,
      render: (lead) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink tabular-nums">
          <BarChart3 className="h-3.5 w-3.5 text-inkSoft" />
          {lead.sizeKw}kW
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      sortAccessor: (lead) => amountValue(lead.amount),
      render: (lead) => <span className="font-semibold text-ink tabular-nums">{amountText(lead.amount)}</span>,
    },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
      sortAccessor: (lead) => stages.indexOf(lead.stage),
      render: (lead) => (
        <StatusBadge variant={CODE_TO_STAGE[lead.stage] || 'new'}>
          {CODE_STAGE_LABELS[lead.stage] || lead.stage}
        </StatusBadge>
      ),
    },
    {
      key: 'chips',
      header: 'Next action',
      render: (lead) =>
        lead.chips && lead.chips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {lead.chips.map((c) => (
              <Chip key={c.label} tone={c.tone} icon={c.icon} label={c.label} />
            ))}
          </div>
        ) : (
          <span className="text-inkSoft">—</span>
        ),
    },
  ]

  const listRowActions = (lead) => [
    { label: 'View details', icon: Eye, onClick: () => navigate(`/rep/leads/${lead.id}`) },
    { label: 'Call', icon: Phone, onClick: () => callLead(lead) },
    { label: 'WhatsApp', icon: MessageCircle, onClick: () => whatsappLead(lead) },
    { label: 'Schedule', icon: Calendar, onClick: () => onScheduleInit(lead) },
    { label: 'Mark as lost', icon: X, danger: true, onClick: () => notify(`Marked ${lead.name} as lost`) },
  ]

  return (
    <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm w-full space-y-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left group"
      >
        <div className="flex items-start gap-3">
          <div className={clsx('mt-0.5 rounded-xl p-2 bg-gray-50 group-hover:bg-gray-100 transition-colors', section.tone === 'blue' && 'bg-blue-50/70 group-hover:bg-blue-50')}>
            <Icon
              className={clsx('h-5 w-5 shrink-0', section.tone === 'blue' ? 'text-blue-600' : 'text-gray-700')}
              strokeWidth={2}
            />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-gray-900">{section.title}</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                {section.leads.length}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-500 tracking-wide">{section.sub}</p>
          </div>
        </div>
        <div className="p-1 rounded-lg hover:bg-gray-50 transition-colors mt-1">
          <ChevronUp
            className={clsx('h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', !open && 'rotate-180')}
          />
        </div>
      </button>

      {open && view === 'grid' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {section.leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} notify={notify} onScheduleInit={onScheduleInit} />
          ))}
        </div>
      )}

      {open && view === 'list' && (
        <DataTable
          columns={listColumns}
          rows={section.leads}
          rowActions={listRowActions}
          rowKey={(row) => row.id}
          pageSize={10}
        />
      )}
    </Card>
  )
}

export default function Leads() {
  const [tab, setTab] = useState('all')
  const [view, setView] = useState('grid')
  const [stageFilter, setStageFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [toast, setToast] = useState(null)
  const [sectionsData, setSectionsData] = useState(initialSections)

  const [activeSchedulingLead, setActiveSchedulingLead] = useState(null)
  const [dateVal, setDateVal] = useState('')
  const [timeVal, setTimeVal] = useState('')
  const [noteVal, setNoteVal] = useState('')

  const notify = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const filteredSections = useMemo(() => {
    return sectionsData.map((sect) => {
      let segmentLeads = [...sect.leads]

      if (tab !== 'all') {
        segmentLeads = segmentLeads.filter((l) => STAGE_CODE_KEYS[l.stage]?.includes(tab))
      }

      if (stageFilter !== 'all') {
        segmentLeads = segmentLeads.filter((l) => STAGE_CODE_KEYS[l.stage]?.includes(stageFilter))
      }

      segmentLeads.sort((a, b) => {
        const numA = typeof a.amount === 'number' ? a.amount : parseInt(String(a.amount).replace(/[^0-9]/g, '')) || 0
        const numB = typeof b.amount === 'number' ? b.amount : parseInt(String(b.amount).replace(/[^0-9]/g, '')) || 0
        
        const ageA = a.createdDaysAgo || parseInt(String(a.id).replace(/[^0-9]/g, '')) || 0
        const ageB = b.createdDaysAgo || parseInt(String(b.id).replace(/[^0-9]/g, '')) || 0

        if (sortOrder === 'amount') return numB - numA
        if (sortOrder === 'age') return ageA - ageB
        return ageB - ageA
      })

      return { ...sect, leads: segmentLeads }
    })
  }, [sectionsData, tab, stageFilter, sortOrder])

  const handleOpenScheduler = (lead) => {
    setActiveSchedulingLead(lead)
    setDateVal(lead.schedule?.date || '')
    setTimeVal(lead.schedule?.time || '')
    setNoteVal(lead.schedule?.note || '')
  }

  const handleCommitSchedule = (e) => {
    e.preventDefault()
    if (!activeSchedulingLead) return

    setSectionsData((prevSections) =>
      prevSections.map((sect) => ({
        ...sect,
        leads: sect.leads.map((l) =>
          l.id === activeSchedulingLead.id
            ? { ...l, schedule: { date: dateVal, time: timeVal, note: noteVal } }
            : l
        )
      }))
    )

    notify(`Appointment saved for ${activeSchedulingLead.name}`)
    setActiveSchedulingLead(null)
  }

  return (
    <div className="w-full px-8 pt-6 pb-32 space-y-6 antialiased text-gray-900 bg-[#FCFCFC]">
      
      <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-100 pb-3">
        {stageTabs.map((t) => {
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
                {t.count}
              </span>
            </button>
          )
        })}
      </div>

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

      <div className="space-y-6 w-full">
        {filteredSections.map((section) => (
          <Section 
            key={section.key} 
            section={section} 
            view={view} 
            notify={notify} 
            onScheduleInit={handleOpenScheduler}
          />
        ))}
      </div>

      {activeSchedulingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-gray-900 tracking-tight">Schedule Follow-up Task</h3>
                <p className="text-xs font-medium text-gray-400">Setting up roadmap events for {activeSchedulingLead.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSchedulingLead(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCommitSchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Date</label>
                  <input
                    type="date"
                    required
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F26B3A] bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Time</label>
                  <input
                    type="time"
                    required
                    value={timeVal}
                    onChange={(e) => setTimeVal(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F26B3A] bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Agenda Notes</label>
                <textarea
                  rows={3}
                  value={noteVal}
                  onChange={(e) => setNoteVal(e.target.value)}
                  placeholder="Mention pipeline target benchmarks or details about this appointment frame..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F26B3A] bg-gray-50 focus:bg-white resize-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveSchedulingLead(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#F26B3A] hover:bg-[#d95a2b] rounded-xl transition-all shadow-sm active:scale-[0.98]"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast}
        </div>
      )}
    </div>
  )
}