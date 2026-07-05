import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import {
  Search,
  Phone,
  MessageCircle,
  MoreHorizontal,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Plus,
  Pin,
  MoreVertical,
  Calendar,
  FileText,
  Clock,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ListChecks,
  Activity,
  LayoutGrid,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import DonutChart from '../../components/DonutChart.jsx'
import Modal from '../../components/Modal.jsx'
import { useShell } from '../../context/shell.jsx'
import {
  detailLeads,
  totalLeadCount,
  getDetailLead,
  OUTCOME_TONE,
} from '../../data/leadDetail.js'
import { stageLabel, stageVariant } from '../../config/stages.js'

const TABS = ['Overview', 'Timeline', 'Calls', 'WhatsApp', 'Notes', 'Tasks', 'Documents']

const DIRECTION_META = {
  Outgoing: { icon: PhoneOutgoing, cls: 'bg-blue-50 text-blue-600' },
  Incoming: { icon: PhoneIncoming, cls: 'bg-green-50 text-green-600' },
  Missed: { icon: PhoneMissed, cls: 'bg-red-50 text-red-600' },
}

const OUTCOME_CLS = {
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-gray-500',
  red: 'bg-red-50 text-red-600',
}

// ── Left rail ───────────────────────────────────────────────────────────────
function RailCard({ lead, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
        selected
          ? 'border-brand-orange/40 bg-[#FFF5F0] ring-1 ring-brand-orange/30'
          : 'border-transparent hover:border-border hover:bg-canvas',
      )}
    >
      <Avatar name={lead.name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-ink">{lead.name}</div>
        <div className="truncate text-xs font-medium text-inkSoft">{lead.district}</div>
        <div className="mt-1">
          <StatusBadge variant={stageVariant(lead.stage)}>{stageLabel(lead.stage)}</StatusBadge>
        </div>
      </div>
      <span
        className={clsx(
          'shrink-0 text-sm font-bold tabular-nums',
          selected ? 'text-brand-orange' : 'text-inkSoft',
        )}
      >
        {lead.score}
      </span>
    </button>
  )
}

function LeftRail({ activeId, onSelect }) {
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(6)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return detailLeads
    return detailLeads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.district.toLowerCase().includes(q),
    )
  }, [query])

  const visible = filtered.slice(0, shown)

  return (
    <aside className="flex w-[290px] shrink-0 flex-col rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="border-b border-border px-4 py-3.5">
        <h2 className="text-sm font-bold text-ink">My Leads</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads…"
            className="h-9 w-full rounded-xl border border-border bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-inkSoft focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-inkSoft">
          <span>Leads ({totalLeadCount})</span>
          <span>Sort: Recent</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-2 py-2">
        {visible.map((lead) => (
          <RailCard
            key={lead.id}
            lead={lead}
            selected={lead.id === activeId}
            onClick={() => onSelect(lead.id)}
          />
        ))}
        {visible.length === 0 && (
          <p className="px-3 py-6 text-center text-xs font-medium text-inkSoft">No leads found.</p>
        )}
      </div>

      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={() => setShown((n) => (n >= filtered.length ? 6 : filtered.length))}
          className="w-full rounded-xl border border-border bg-white py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
        >
          {shown >= filtered.length ? 'Show fewer' : 'Load more leads'}
        </button>
      </div>
    </aside>
  )
}

// ── Header ──────────────────────────────────────────────────────────────────
function TagItem({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-canvas px-2.5 py-1 text-xs font-medium text-inkSoft">
      {label && <span className="text-inkSoft/70">{label}:</span>}
      <span className="font-semibold text-ink">{value}</span>
    </span>
  )
}

function LeadHeader({ lead, onCall, onWhatsApp, onMore }) {
  return (
    <Card className="!p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar name={lead.name} size="lg" className="!h-14 !w-14 !text-base" />
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-ink">{lead.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-sm font-bold text-brand-orange tabular-nums">
                {lead.score}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-inkSoft">
              {lead.phone} · {lead.location}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge variant={stageVariant(lead.stage)}>{stageLabel(lead.stage)}</StatusBadge>
              <TagItem label="Lead Source" value={lead.source} />
              <TagItem label="Created" value={lead.created} />
              <TagItem label="Owner" value={lead.owner} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCall}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk"
          >
            <Phone className="h-4 w-4" />
            Call
          </button>
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={onMore}
            aria-label="More"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Card>
  )
}

// ── Calls tab ───────────────────────────────────────────────────────────────
function CallRow({ call }) {
  const meta = DIRECTION_META[call.direction] || DIRECTION_META.Outgoing
  const Icon = meta.icon
  const tone = OUTCOME_TONE[call.outcome] || 'gray'
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', meta.cls)}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          {call.direction}
          <span className="text-xs font-medium text-inkSoft">· {call.duration}</span>
        </div>
        <div className="text-xs font-medium text-inkSoft">
          {call.day}, {call.time}
        </div>
      </div>
      <span
        className={clsx(
          'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
          OUTCOME_CLS[tone],
        )}
      >
        {call.outcome}
      </span>
    </div>
  )
}

const CALL_PREVIEW = 3

function CallHistory({ lead, notify }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = lead.calls.length > CALL_PREVIEW
  const visible = expanded ? lead.calls : lead.calls.slice(0, CALL_PREVIEW)
  return (
    <Card
      className="!p-0 overflow-hidden"
      bodyClassName=""
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <h3 className="text-sm font-bold text-ink">Call History</h3>
        <button
          type="button"
          onClick={() => notify('Filter: All Calls')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
        >
          All Calls
        </button>
      </div>
      <div className="divide-y divide-border">
        {visible.map((call) => (
          <CallRow key={call.id} call={call} />
        ))}
      </div>
      {hasMore && (
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
          >
            {expanded ? 'Show less' : `View all calls (${lead.calls.length})`}
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 rotate-180 transition-transform" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      )}
    </Card>
  )
}

function NoteCard({ note, onPin, onOptions }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar name="Ravi Kumar" size="sm" />
          <div>
            <div className="text-xs font-bold text-ink">{note.author}</div>
            <div className="text-[11px] font-medium text-inkSoft">{note.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPin}
            aria-label="Pin note"
            className={clsx(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-canvas',
              note.pinned ? 'text-brand-orange' : 'text-inkSoft',
            )}
          >
            <Pin className={clsx('h-3.5 w-3.5', note.pinned && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={onOptions}
            aria-label="Note options"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-inkSoft transition-colors hover:bg-canvas"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink">{note.text}</p>
      {note.followUp && (
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-amberSoft px-2.5 py-1 text-[11px] font-semibold text-[#B97A1C]">
          <Clock className="h-3 w-3" />
          Follow-up {note.followUp}
        </span>
      )}
    </div>
  )
}

const NOTE_PREVIEW = 2

function NotesPanel({ notes, onAdd, onPin, notify }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = notes.length > NOTE_PREVIEW
  const visible = expanded ? notes : notes.slice(0, NOTE_PREVIEW)
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <h3 className="text-sm font-bold text-ink">Notes</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-orangeDk"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Note
        </button>
      </div>
      <div className="space-y-2.5 px-4 py-3.5">
        {visible.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPin={() => onPin(note.id)}
            onOptions={() => notify('Note options')}
          />
        ))}
      </div>
      {hasMore && (
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
          >
            {expanded ? 'Show less' : `View all notes (${notes.length})`}
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 rotate-180 transition-transform" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      )}
    </Card>
  )
}

// ── Bottom strip ────────────────────────────────────────────────────────────
function FollowUpCard({ lead, notify }) {
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-inkSoft">
        <Calendar className="h-4 w-4 text-brand-orange" />
        Next Follow-up
      </div>
      <div className="mt-3 text-lg font-bold text-ink">
        {lead.followUp.date}, {lead.followUp.time}
      </div>
      <p className="mt-1.5 text-sm font-medium text-inkSoft">{lead.followUp.task}</p>
      <button
        type="button"
        onClick={() => notify('Change follow-up')}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
      >
        Change
      </button>
    </Card>
  )
}

function ScoreCard({ lead, notify }) {
  const data = [
    { name: 'Score', value: lead.score, color: '#F26B3A' },
    { name: 'Remaining', value: 100 - lead.score, color: '#F1ECE8' },
  ]
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-inkSoft">
        <TrendingUp className="h-4 w-4 text-brand-orange" />
        Lead Score
      </div>
      <div className="mt-2 flex items-center gap-4">
        <div className="shrink-0">
          <DonutChart
            data={data}
            centerValue={lead.score}
            size={104}
            thickness={14}
            legend={false}
          />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full bg-greenSoft px-2.5 py-0.5 text-xs font-bold text-green">
            {lead.scoreLabel}
          </div>
          <p className="mt-1.5 text-sm font-medium text-inkSoft">{lead.scoreNote}</p>
          <button
            type="button"
            onClick={() => notify('Lead score details')}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
          >
            View details
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}

function QuickActions({ onCall, onWhatsApp, onSchedule, notify }) {
  const actions = [
    { label: 'Call', icon: Phone, onClick: onCall },
    { label: 'WhatsApp', icon: MessageCircle, onClick: onWhatsApp },
    { label: 'Schedule', icon: Calendar, onClick: onSchedule },
    { label: 'Proposal', icon: FileText, onClick: () => notify('Create proposal') },
    { label: 'More', icon: MoreHorizontal, onClick: () => notify('More actions') },
  ]
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-inkSoft">
        <ListChecks className="h-4 w-4 text-brand-orange" />
        Quick Actions
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-white px-2 py-3 text-xs font-semibold text-ink transition-colors hover:border-brand-orange/40 hover:bg-[#FFF5F0]"
            >
              <Icon className="h-4 w-4 text-brand-orange" />
              {a.label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

// Simple empty state for tabs that aren't part of the screenshot spec.
function TabPlaceholder({ icon: Icon, label }) {
  return (
    <Card className="!p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-inkSoft">
          <Icon className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-xs font-medium text-inkSoft">Nothing here yet for this lead.</p>
      </div>
    </Card>
  )
}

const TAB_PLACEHOLDER = {
  Overview: { icon: LayoutGrid, label: 'Overview' },
  Timeline: { icon: Activity, label: 'Timeline' },
  WhatsApp: { icon: MessageCircle, label: 'WhatsApp conversation' },
  Tasks: { icon: ListChecks, label: 'Tasks' },
  Documents: { icon: FileText, label: 'Documents' },
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { toast: notify } = useShell()

  // Role-aware base path: strip the trailing :id segment so rail selection stays
  // within the current role (/admin/all-leads, /lead/all-leads, /rep/leads).
  const basePath = pathname.replace(/\/[^/]+$/, '')

  const lead = getDetailLead(id)
  const [tab, setTab] = useState('Calls')
  const [notes, setNotes] = useState(lead.notes || [])
  const [addOpen, setAddOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  // Reset notes/scroll when navigating to a different lead.
  const activeId = lead.id
  useEffect(() => {
    setNotes(lead.notes || [])
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  function call() {
    const num = (lead.phone || '').replace(/\s|\+/g, '')
    window.location.href = `tel:${num}`
  }
  function whatsApp() {
    const num = (lead.phone || '').replace(/\s|\+/g, '')
    const msg = encodeURIComponent(`Hello ${lead.name}, connecting regarding your solar query.`)
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank')
  }
  function selectLead(nextId) {
    navigate(`${basePath}/${nextId}`)
  }
  function pinNote(noteId) {
    setNotes((list) => list.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n)))
  }
  function submitNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return
    setNotes((list) => [
      {
        id: `N-${Date.now()}`,
        author: 'Ravi Kumar (You)',
        time: 'Just now',
        text: noteText.trim(),
        pinned: false,
      },
      ...list,
    ])
    setNoteText('')
    setAddOpen(false)
    notify('Note added')
  }

  // Sorted: pinned first.
  const orderedNotes = useMemo(
    () => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [notes],
  )

  return (
    <div className="flex gap-5">
      <LeftRail activeId={activeId} onSelect={selectLead} />

      <div className="min-w-0 flex-1 space-y-5">
        <LeadHeader
          lead={lead}
          onCall={call}
          onWhatsApp={whatsApp}
          onMore={() => notify('More options')}
        />

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-px">
          {TABS.map((t) => {
            const active = tab === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={clsx(
                  'relative rounded-t-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'text-brand-orange'
                    : 'text-inkSoft hover:text-ink',
                )}
              >
                {t}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-orange" />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {tab === 'Calls' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
            <CallHistory lead={lead} notify={notify} />
            <NotesPanel
              notes={orderedNotes}
              onAdd={() => setAddOpen(true)}
              onPin={pinNote}
              notify={notify}
            />
          </div>
        )}

        {tab === 'Notes' && (
          <div className="max-w-2xl">
            <NotesPanel
              notes={orderedNotes}
              onAdd={() => setAddOpen(true)}
              onPin={pinNote}
              notify={notify}
            />
          </div>
        )}

        {TAB_PLACEHOLDER[tab] && (
          <TabPlaceholder icon={TAB_PLACEHOLDER[tab].icon} label={TAB_PLACEHOLDER[tab].label} />
        )}

        {/* Bottom strip */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FollowUpCard lead={lead} notify={notify} />
          <ScoreCard lead={lead} notify={notify} />
          <QuickActions
            onCall={call}
            onWhatsApp={whatsApp}
            onSchedule={() => notify('Schedule follow-up')}
            notify={notify}
          />
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add note"
        subtitle={`For ${lead.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-note-form"
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Save note
            </button>
          </>
        }
      >
        <form id="add-note-form" onSubmit={submitNote}>
          <textarea
            autoFocus
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note about this lead…"
            className="w-full rounded-xl border border-border bg-canvas p-3 text-sm text-ink placeholder:text-inkSoft focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
          />
        </form>
      </Modal>
    </div>
  )
}
