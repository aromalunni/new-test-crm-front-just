import { useState, useMemo } from 'react'
import clsx from 'clsx'
import {
  Clock,
  ChevronDown,
  Upload,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import DonutChart from '../../components/DonutChart.jsx'
import Modal from '../../components/Modal.jsx'
import { exportToCsv } from '../../lib/exportCsv.js'
import { useShell } from '../../context/shell.jsx'
import { filterTabs, leads, workload, quickStats } from '../../data/teamUnclosed.js'

const REASSIGN_REPS = ['Ravi Kumar', 'Priya Nair', 'Arun Menon', 'Vinod Jose', 'Rahul Varma']
const PAGE_SIZE = 4

// Minimum stall-days for each filter tab.
const STALL_MIN = { all: 0, s3: 3, s7: 7, s14: 14 }

// Stage badge tones — site visited (in progress) vs stalled (overdue).
const BADGE_TONES = {
  orange: 'bg-[#FFEDE4] text-[#d95a2b]',
  red: 'bg-redSoft text-red',
}

function InfoField({ label, children }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</div>
      <div className="mt-0.5 truncate text-sm font-bold text-gray-800">{children}</div>
    </div>
  )
}

function LeadCard({ lead, onClaim, onReassign, onNote }) {
  return (
    <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Top row: identity + stage badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="md" />
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-gray-900 tracking-tight">{lead.name}</div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                {lead.district} · {lead.sizeKw}kW · {lead.source}
              </div>
            </div>
          </div>
          <span
            className={clsx(
              'shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider',
              BADGE_TONES[lead.badge],
            )}
          >
            {lead.stage}
          </span>
        </div>

        {/* 3-field info strip */}
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-100 bg-[#FAFAFB] px-4 py-3">
          <InfoField label="Unclosed">
            <span className={clsx(lead.badge === 'red' && 'text-red')}>{lead.days} days</span>
          </InfoField>
          <InfoField label="Owner">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.5} />
              {lead.owner}
            </span>
          </InfoField>
          <InfoField label="Amount">{lead.amount}</InfoField>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onClaim(lead)}
          className="flex-1 rounded-xl bg-[#F26B3A] py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#E2552A] active:scale-[0.98]"
        >
          Claim
        </button>
        <button
          type="button"
          onClick={() => onReassign(lead)}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
        >
          Reassign
        </button>
        <button
          type="button"
          aria-label={`Note — ${lead.name}`}
          onClick={() => onNote(lead)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

function DropFilter({ value, onChange, options }) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px] cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-9 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 focus:border-[#F26B3A] focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  )
}

export default function Unclosed() {
  const { toast: notify, search } = useShell()
  const [filter, setFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [leadList, setLeadList] = useState(leads)
  const [reassign, setReassign] = useState(null) // lead | null
  const [targetRep, setTargetRep] = useState(REASSIGN_REPS[0])
  const [noteFor, setNoteFor] = useState(null) // lead | null
  const [noteText, setNoteText] = useState('')

  // Owner / stage dropdown options derived from the live data.
  const ownerOptions = useMemo(
    () => [
      { key: 'all', label: 'All Owners' },
      ...[...new Set(leadList.map((l) => l.owner))].map((o) => ({ key: o, label: o })),
    ],
    [leadList],
  )
  const stageOptions = useMemo(
    () => [
      { key: 'all', label: 'All Stages' },
      ...[...new Set(leadList.map((l) => l.stage))].map((s) => ({ key: s, label: s })),
    ],
    [leadList],
  )

  const display = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leadList.filter(
      (l) =>
        l.days >= STALL_MIN[filter] &&
        (ownerFilter === 'all' || l.owner === ownerFilter) &&
        (stageFilter === 'all' || l.stage === stageFilter) &&
        (!q || l.name.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q)),
    )
  }, [leadList, filter, ownerFilter, stageFilter, search])

  const pageCount = Math.max(1, Math.ceil(display.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * PAGE_SIZE
  const pageItems = display.slice(start, start + PAGE_SIZE)
  const from = display.length === 0 ? 0 : start + 1
  const to = Math.min(start + PAGE_SIZE, display.length)

  function claim(lead) {
    setLeadList((prev) => prev.filter((l) => l.id !== lead.id))
    notify(`Claimed ${lead.name}`)
  }

  function openReassign(lead) {
    setTargetRep(REASSIGN_REPS.find((r) => r !== lead.owner) || REASSIGN_REPS[0])
    setReassign(lead)
  }

  function confirmReassign() {
    setLeadList((prev) => prev.map((l) => (l.id === reassign.id ? { ...l, owner: targetRep } : l)))
    notify(`Reassigned ${reassign.name} → ${targetRep}`)
    setReassign(null)
  }

  function openNote(lead) {
    setNoteText('')
    setNoteFor(lead)
  }

  function saveNote() {
    notify(`Note added — ${noteFor.name}`)
    setNoteFor(null)
  }

  return (
    <div className="w-full space-y-5">
      {/* 1 — Banner */}
      <Card className="!p-4 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500">
            <Clock className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="text-sm font-medium text-gray-600 pt-1">
            <span className="font-bold text-gray-900">Stalled leads that need attention.</span> Claim a lead to
            work it yourself, or reassign it to keep the pipeline moving.
          </p>
        </div>
      </Card>

      {/* 2 — Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {filterTabs.map((t) => {
            const isActive = filter === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setFilter(t.key)
                  setPage(1)
                }}
                className={clsx(
                  'inline-flex items-center rounded-full px-4 py-2 text-sm font-bold tracking-tight transition-all active:scale-[0.98]',
                  isActive
                    ? 'bg-[#F26B3A] text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <DropFilter
            value={ownerFilter}
            onChange={(v) => {
              setOwnerFilter(v)
              setPage(1)
            }}
            options={ownerOptions}
          />
          <DropFilter
            value={stageFilter}
            onChange={(v) => {
              setStageFilter(v)
              setPage(1)
            }}
            options={stageOptions}
          />
          <button
            type="button"
            onClick={() => {
              exportToCsv('unclosed-leads', display, [
                { key: 'id', header: 'Lead ID' },
                { key: 'name', header: 'Name' },
                { key: 'district', header: 'District' },
                { key: 'sizeKw', header: 'Size (kW)' },
                { key: 'source', header: 'Source' },
                { key: 'stage', header: 'Stage' },
                { key: 'days', header: 'Days Unclosed' },
                { key: 'owner', header: 'Owner' },
                { key: 'amount', header: 'Amount' },
              ])
              notify(`Exported ${display.length} unclosed leads`)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
          >
            <Upload className="h-4 w-4 text-gray-500" strokeWidth={2.5} />
            Export
          </button>
        </div>
      </div>

      {/* 3 — Main grid: cards (≈66%) + side panel (≈34%) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[66fr_34fr]">
        {/* Left — unclosed lead cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pageItems.length === 0 && (
            <Card className="!p-10 border border-gray-100 rounded-2xl bg-white shadow-sm text-center md:col-span-2">
              <p className="text-sm font-semibold text-gray-500">No unclosed leads match these filters.</p>
            </Card>
          )}
          {pageItems.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClaim={claim}
              onReassign={openReassign}
              onNote={openNote}
            />
          ))}
        </div>

        {/* Right — side panel */}
        <div className="space-y-5">
          <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm" title="Team Workload">
            <DonutChart
              data={workload.data}
              centerValue={workload.centerValue}
              centerCaption={workload.centerCaption}
              size={150}
              thickness={22}
              legend={false}
            />
            <p className="mt-4 text-xs font-medium text-gray-500 leading-relaxed">{workload.note}</p>
          </Card>

          <Card className="!p-5 border border-gray-100 rounded-2xl bg-white shadow-sm" title="Quick Stats">
            <ul className="space-y-1">
              {quickStats.map((row) => (
                <li
                  key={row.key}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-600">{row.label}</span>
                  <span className="inline-flex min-w-[1.75rem] justify-center rounded-lg bg-gray-100 px-2 py-0.5 text-sm font-bold text-gray-800 tabular-nums">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* 4 — Footer: count + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-sm font-medium text-gray-500">
          Showing {from} to {to} of {display.length} leads
        </p>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors',
                p === current
                  ? 'bg-[#F26B3A] text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700',
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={current >= pageCount}
            onClick={() => setPage(current + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reassign modal */}
      <Modal
        open={!!reassign}
        onClose={() => setReassign(null)}
        title="Reassign lead"
        subtitle={reassign ? `${reassign.name} · currently ${reassign.owner}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setReassign(null)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmReassign}
              className="rounded-xl bg-[#F26B3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E2552A]"
            >
              Reassign
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
            {REASSIGN_REPS.filter((r) => r !== reassign?.owner).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </Modal>

      {/* Note modal */}
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
    </div>
  )
}
