import { useState, useCallback } from 'react'
import {
  Sun,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Sparkles,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Navigation,
  CalendarDays,
  Star,
  PlayCircle,
  Plus,
  FileText,
  XCircle,
  X
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import Modal from '../../components/Modal.jsx'

const todayData = {
  statusStrip: { text: 'Within working hours  ·  You are active  ·  Auto-assignment enabled' },
  greeting: {
    greeting: 'GOOD MORNING, RAVI ',
    headline: 'You’re on fire — 3-month Elite streak ',
    subline: 'Today: 3 follow-ups  ·  2 new leads  ·  1 overdue  ·  Est. 4h 30m of work',
    thisMonth: 12,
    tierGoal: 10
  },
  overdue: {
    id: 'L-1021',
    name: 'Deepa Thomas',
    phone: '9876543210',
    sizeKw: 3,
    reason: 'Promised call yesterday 16:00 — OVERDUE',
    amount: 211000
  },
  followUps: [
    { id: 'L-1066', name: 'Vinod Pillai', phone: '9876543211', sizeKw: 10, time: '10:30', task: 'Review revised quote' },
    { id: 'L-1097', name: 'Aswathy Nair', phone: '9876543212', sizeKw: 3, time: '11:15', task: 'Confirm site visit Friday' }
  ],
  anilFollowUp: { 
    id: 'L-1068', 
    name: 'Anil Kumar', 
    phone: '9876543213',
    sizeKw: 5, 
    time: '15:00', 
    task: 'Collect remaining advance' 
  },
  newLeads: [
    { id: 'L-1091', name: 'Radhika Menon', phone: '9876543214', source: 'Google Ads', sizeKw: 6, timeLeft: '14 min left' },
    { id: 'L-1098', name: 'Hari Krishnan', phone: '9876543215', source: 'Website', sizeKw: 6, timeLeft: '9 min left' }
  ],
  inProgress: [
    { id: 'L-1054', name: 'Rajesh Chandran', phone: '9876543216', sizeKw: 6, stage: 'Site Visited', suggestion: 'AI suggestion: Prepare proposal — high intent' },
    { id: 'L-1053', name: 'Fathima Beevi', phone: '9876543217', sizeKw: 5, stage: 'Site Visited', suggestion: 'AI suggestion: Send 3 quote options' }
  ],
  siteVisits: [
    { id: 'L-1097', name: 'Aswathy Nair', location: 'Kollam, Kerala', sizeKw: 5, time: '14:00' }
  ],
  summary: {
    overdue: 1,
    followUps: 3,
    newLeads: 2,
    visits: 1,
    workLeft: '2h 44m'
  }
}

const inr = (n) => `₹${n.toLocaleString('en-IN')}`

function ActionButton({ children, icon: Icon, onClick, variant = 'ghost', className = '' }) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-150 active:scale-[0.99]"
  const variants = {
    primary: "bg-[#F26B3A] text-white hover:bg-[#e05a2b] shadow-xs border border-transparent",
    ghost: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
  }
  
  return (
    <button type="button" onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      {children}
    </button>
  )
}

function DoneToggle({ onClick, label, isCompleted }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 ${
        isCompleted 
          ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-xs" 
          : "border-gray-200 bg-white text-gray-400 hover:border-emerald-500 hover:text-emerald-600"
      }`}
    >
      <CheckCircle className="h-4.5 w-4.5" fill={isCompleted ? "currentColor" : "none"} strokeWidth={1.75} />
    </button>
  )
}

function SectionHeading({ icon: Icon, iconColor, title, count }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4 mt-10">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
        {title}
      </span>
      {count !== undefined && (
        <span className="rounded-md bg-gray-100/80 px-2 py-0.5 text-[11px] font-bold text-gray-500 border border-gray-200/40">
          {count}
        </span>
      )}
    </div>
  )
}

function TimeChip({ children, variant = 'neutral' }) {
  const styles = {
    neutral: 'border border-gray-200 bg-gray-50 text-gray-600',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-tight ${styles[variant]}`}>
      <Clock className="h-3 w-3" strokeWidth={2} />
      {children}
    </span>
  )
}

function StatItem({ value, label, highlightClass = 'text-gray-900' }) {
  return (
    <div className="text-left py-1 px-1">
      <div className={`text-base font-bold tracking-tight leading-none ${highlightClass}`}>{value}</div>
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

export default function Today() {
  const [toast, setToast] = useState(null)
  const [completedTasks, setCompletedTasks] = useState({})

  const [newLeadsList, setNewLeadsList] = useState(todayData.newLeads)
  const [detailsLead, setDetailsLead] = useState(null)
  const [actionLead, setActionLead] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', source: 'Website', value: '' })

  const [activeSchedulingLead, setActiveSchedulingLead] = useState(null)
  const [dateVal, setDateVal] = useState('')
  const [timeVal, setTimeVal] = useState('')
  const [noteVal, setNoteVal] = useState('')

  const showFeedback = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const handleCall = (phone, name) => {
    window.location.href = `tel:${phone || '9876543210'}`
  }

  const handleWhatsApp = (phone, name) => {
    const msg = encodeURIComponent(`Hello ${name}, connecting regarding your solar pipeline query.`)
    window.open(`https://wa.me/91${phone || '9876543210'}?text=${msg}`, '_blank')
  }

  const handleOpenMaps = (location) => {
    const query = encodeURIComponent(location)
    window.open(`https://maps.google.com/?q=${query}`, '_blank')
  }

  const handleOpenScheduler = (lead) => {
    setActiveSchedulingLead(lead)
    setDateVal('')
    setTimeVal('')
    setNoteVal('')
  }

  const handleCommitSchedule = (e) => {
    e.preventDefault()
    if (!activeSchedulingLead) return
    showFeedback(`Rescheduled ${activeSchedulingLead.name} for ${dateVal} @ ${timeVal}`)
    setActiveSchedulingLead(null)
  }

  const toggleTaskDone = (id, name) => {
    setCompletedTasks(prev => {
      const state = !prev[id]
      showFeedback(state ? `Marked ${name} as completed` : `Reopened task for ${name}`)
      return { ...prev, [id]: state }
    })
  }

  const handleAddLead = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      showFeedback('Please enter a name')
      return
    }
    const id = `L-${Math.floor(1000 + Math.random() * 9000)}`
    const lead = {
      id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      source: form.source,
      sizeKw: '—',
      value: form.value.trim(),
      timeLeft: 'just added',
    }
    setNewLeadsList((prev) => [lead, ...prev])
    showFeedback(`Added lead ${lead.name}`)
    setAddOpen(false)
    setForm({ name: '', phone: '', source: 'Website', value: '' })
  }

  // Concrete next actions offered by the in-progress "Take Action" sheet.
  const actionOptions = actionLead
    ? [
        { label: 'Call', icon: Phone, onClick: () => handleCall(actionLead.phone, actionLead.name) },
        { label: 'Schedule follow-up', icon: Clock, onClick: () => handleOpenScheduler(actionLead) },
        { label: 'Add note', icon: FileText, onClick: () => showFeedback(`Note added for ${actionLead.name}`) },
        { label: 'Mark won', icon: CheckCircle, onClick: () => showFeedback(`Marked ${actionLead.name} as won`) },
        { label: 'Mark lost', icon: XCircle, danger: true, onClick: () => showFeedback(`Marked ${actionLead.name} as lost`) },
      ]
    : []

  const { statusStrip, greeting, overdue, followUps, anilFollowUp, inProgress, siteVisits, summary } = todayData

  return (
    <div className="w-full px-8 pt-6 pb-36 space-y-6 antialiased text-gray-800 bg-[#FBFBFB] max-w-7xl mx-auto">
      
      {/* 1 — Active Status Banner */}
      <div className="w-full flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-2xs">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="tracking-tight">{statusStrip.text}</span>
      </div>

      {/* 2 — Engagement Hero Widget */}
      <div className="w-full rounded-xl bg-white p-6 border border-gray-200 shadow-2xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {greeting.greeting}
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
              {greeting.headline}
            </h1>
            <p className="text-xs text-gray-400 tracking-tight">{greeting.subline}</p>
          </div>
          
          <div className="flex gap-6 border-t border-gray-100 pt-3 md:border-0 md:pt-0 shrink-0">
            <div>
              <div className="text-2xl font-bold tracking-tight text-[#F26B3A]">{greeting.thisMonth}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">This month</div>
            </div>
            <div className="border-l border-gray-200 pl-6">
              <div className="text-2xl font-bold tracking-tight text-gray-900">{greeting.tierGoal}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Tier goal</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 — Urgent & Overdue Actions */}
      <section className="w-full space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-red-600">
          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
          Urgent · Overdue
        </div>
        <Card className="!p-4 border border-red-200/70 rounded-xl bg-red-50/20 shadow-2xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <Avatar name={overdue.name} color="#DF4E36" size="md" className="rounded-lg" />
              <div className="space-y-0.5">
                <div className="font-bold text-gray-900 text-sm tracking-tight">
                  {overdue.name} <span className="text-gray-400 font-medium ml-1.5 text-xs">{overdue.sizeKw} kW</span>
                </div>
                <div className="text-xs font-medium text-red-600 tracking-tight">{overdue.reason}</div>
                <div className="text-[11px] text-gray-400 font-medium">
                  Amount: <span className="font-semibold text-gray-900">{inr(overdue.amount)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <ActionButton icon={Phone} variant="primary" onClick={() => handleCall(overdue.phone, overdue.name)}>Call now</ActionButton>
              <ActionButton icon={Clock} onClick={() => handleOpenScheduler(overdue)}>Reschedule</ActionButton>
            </div>
          </div>
        </Card>
      </section>

      {/* 4 — Scheduled Follow-ups */}
      <section className="w-full">
        <SectionHeading icon={CalendarDays} iconColor="text-slate-400" title="Today's Follow-ups" count={summary.followUps} />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {followUps.map((f) => {
            const isCompleted = !!completedTasks[f.id]
            return (
              <Card key={f.id} className={`bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all ${isCompleted ? 'opacity-50 bg-gray-50/50' : ''}`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={f.name} size="md" className="rounded-lg" />
                      <span className={`font-bold text-sm tracking-tight ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>{f.name}</span>
                    </div>
                    <TimeChip>{f.time}</TimeChip>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{f.id}  ·  {f.sizeKw}kW</div>
                  <p className="text-xs font-medium text-gray-600 tracking-tight leading-relaxed">{f.task}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <ActionButton icon={Phone} variant="primary" className="flex-1" onClick={() => handleCall(f.phone, f.name)}>Call</ActionButton>
                  <ActionButton icon={MessageCircle} onClick={() => handleWhatsApp(f.phone, f.name)}>WhatsApp</ActionButton>
                  <DoneToggle isCompleted={isCompleted} label="Mark done" onClick={() => toggleTaskDone(f.id, f.name)} />
                </div>
              </Card>
            )
          })}
        </div>

        {anilFollowUp && (() => {
          const isAnilCompleted = !!completedTasks[anilFollowUp.id]
          return (
            <Card className={`mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-4 hover:border-gray-300 transition-all ${isAnilCompleted ? 'opacity-50 bg-gray-50/50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={anilFollowUp.name} size="md" className="rounded-lg" />
                  <div className="space-y-0.5">
                    <span className={`font-bold text-sm tracking-tight ${isAnilCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>{anilFollowUp.name}</span>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{anilFollowUp.id}  ·  {anilFollowUp.sizeKw}kW</div>
                  </div>
                </div>
                <TimeChip>{anilFollowUp.time}</TimeChip>
              </div>
              <p className="text-xs font-medium text-gray-600 tracking-tight">{anilFollowUp.task}</p>
              
              <div className="pt-3.5 border-t border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <StatItem value={summary.overdue} label="Overdue" highlightClass="text-red-600" />
                  <div className="h-5 w-px bg-gray-200 self-center hidden xs:block" />
                  <StatItem value={summary.followUps} label="Follow-ups" highlightClass="text-amber-600" />
                  <div className="h-5 w-px bg-gray-200 self-center hidden xs:block" />
                  <StatItem value={summary.newLeads} label="New" highlightClass="text-gray-700" />
                  <div className="h-5 w-px bg-gray-200 self-center hidden xs:block" />
                  <StatItem value={summary.visits} label="Visits" highlightClass="text-emerald-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <ActionButton icon={Phone} variant="primary" onClick={() => handleCall(anilFollowUp.phone, anilFollowUp.name)}>Call</ActionButton>
                  <DoneToggle isCompleted={isAnilCompleted} label="Mark done" onClick={() => toggleTaskDone(anilFollowUp.id, anilFollowUp.name)} />
                </div>
              </div>
            </Card>
          )
        })()}
      </section>

      {/* 5 — Inbound New Leads Stream */}
      <section className="w-full">
        <SectionHeading icon={Star} iconColor="text-slate-400" title="New Leads Assigned" count={summary.newLeads} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {newLeadsList.map((l) => (
            <Card key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={l.name} size="md" className="rounded-lg" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-gray-900 tracking-tight">{l.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{l.id}  ·  {l.source}  ·  {l.sizeKw}kW</div>
                  </div>
                </div>
                <TimeChip variant="amber">{l.timeLeft}</TimeChip>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <ActionButton icon={Phone} variant="primary" className="flex-1" onClick={() => {
                  showFeedback(`Accepting lead for ${l.name}`);
                  handleCall(l.phone, l.name);
                }}>Accept & Call</ActionButton>
                <ActionButton onClick={() => setDetailsLead(l)}>Details</ActionButton>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6 — Pipelines in Progress & AI Suggestion Panels */}
      <section className="w-full">
        <SectionHeading icon={PlayCircle} iconColor="text-slate-400" title="In Progress · Next Action" count={inProgress.length} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {inProgress.map((p) => (
            <Card key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} size="md" className="rounded-lg" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-gray-900 tracking-tight">{p.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{p.id}  ·  {p.sizeKw}kW  ·  Stage: <span className="text-gray-600 font-semibold">{p.stage}</span></div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-200/60 p-3 text-xs text-slate-700 font-medium tracking-tight">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" fill="currentColor" />
                  <span>{p.suggestion}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <ActionButton icon={ArrowRight} variant="primary" className="flex-1" onClick={() => setActionLead(p)}>Take Action</ActionButton>
                <ActionButton icon={Phone} onClick={() => handleCall(p.phone, p.name)}>Call</ActionButton>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7 — Site Visits Deployment Map */}
      <section className="w-full">
        <SectionHeading icon={MapPin} iconColor="text-slate-400" title="Site Visits Today" count={siteVisits.length} />
        <div className="w-full">
          {siteVisits.map((v) => (
            <Card key={v.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:border-gray-300 transition-all">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-slate-50 shadow-inner">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
                        backgroundSize: '10px 10px',
                      }}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="h-4 w-4 text-slate-400" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-gray-900 tracking-tight">{v.name}</div>
                    <div className="text-xs font-medium text-gray-500 tracking-tight">{v.location}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{v.sizeKw}kW  ·  {v.id}</div>
                    <div className="pt-1">
                      <TimeChip variant="green">{v.time}</TimeChip>
                    </div>
                  </div>
                </div>
                
                <ActionButton icon={Navigation} className="self-end sm:self-center" onClick={() => handleOpenMaps(v.location)}>
                  Open in Maps
                </ActionButton>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8 — Global Base Info & Action Sticky Bar */}
      <div className="fixed bottom-0 left-0 md:left-16 lg:left-64 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md px-8 py-3.5 shadow-xs">
        <div className="w-full flex items-center justify-between gap-5 max-w-7xl mx-auto">
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-red-600 text-sm">{summary.overdue}</span>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Overdue</span>
            </div>
            <span className="text-gray-200 hidden xs:inline">·</span>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#F26B3A] text-sm">{summary.followUps}</span>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Follow-ups</span>
            </div>
            <span className="text-gray-200 hidden xs:inline">·</span>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-gray-900 text-sm">{summary.newLeads}</span>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">New</span>
            </div>
            <span className="text-gray-200 hidden xs:inline">·</span>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-emerald-600 text-sm">{summary.visits}</span>
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Visits</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 tracking-tight">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {summary.workLeft} left
            </span>
            
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 shadow-xs transition-all duration-150 active:scale-95 shrink-0"
              aria-label="Create lead link"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
          
        </div>
      </div>

      {/* Reschedule Modal Layer */}
      {activeSchedulingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">Reschedule Follow-up</h3>
                <p className="text-[11px] text-gray-400 tracking-tight">Update timeline details for {activeSchedulingLead.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSchedulingLead(null)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleCommitSchedule} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</label>
                  <input
                    type="date"
                    required
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Time</label>
                  <input
                    type="time"
                    required
                    value={timeVal}
                    onChange={(e) => setTimeVal(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Notes</label>
                <textarea
                  rows={3}
                  value={noteVal}
                  onChange={(e) => setNoteVal(e.target.value)}
                  placeholder="Add scheduling context or client requests..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white resize-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveSchedulingLead(null)}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all shadow-2xs active:scale-[0.99]"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New-lead Details Modal */}
      <Modal
        open={!!detailsLead}
        onClose={() => setDetailsLead(null)}
        title={detailsLead?.name}
        subtitle={detailsLead ? `${detailsLead.id} · New lead` : ''}
        footer={
          detailsLead && (
            <>
              <button
                type="button"
                onClick={() => setDetailsLead(null)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCall(detailsLead.phone, detailsLead.name)
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#F26B3A] hover:bg-[#e05a2b] rounded-lg transition-all shadow-xs active:scale-[0.99]"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                Call
              </button>
            </>
          )
        }
      >
        {detailsLead && (
          <dl className="divide-y divide-gray-100 text-sm">
            {[
              { label: 'Source', value: detailsLead.source },
              { label: 'Phone', value: detailsLead.phone },
              { label: 'System size', value: detailsLead.sizeKw ? `${detailsLead.sizeKw} kW` : '—' },
              detailsLead.value ? { label: 'Est. value', value: detailsLead.value } : null,
              { label: 'Status', value: detailsLead.timeLeft },
            ]
              .filter(Boolean)
              .map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{row.label}</dt>
                  <dd className="font-semibold text-gray-800 tracking-tight text-right">{row.value || '—'}</dd>
                </div>
              ))}
          </dl>
        )}
      </Modal>

      {/* In-progress "Take Action" sheet */}
      <Modal
        open={!!actionLead}
        onClose={() => setActionLead(null)}
        title="Next action"
        subtitle={actionLead ? `${actionLead.name} · ${actionLead.stage}` : ''}
        width="max-w-sm"
      >
        <div className="space-y-1.5">
          {actionOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  setActionLead(null)
                  opt.onClick()
                }}
                className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm font-semibold tracking-tight transition-all active:scale-[0.99] ${
                  opt.danger
                    ? 'border-red-200/70 text-red-600 hover:bg-red-50'
                    : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${opt.danger ? 'text-red-500' : 'text-gray-400'}`} strokeWidth={2} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </Modal>

      {/* Add Lead Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Lead"
        subtitle="Manually ingest a new lead into your pipeline"
        width="max-w-sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-lead-form"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#F26B3A] hover:bg-[#e05a2b] rounded-lg transition-all shadow-xs active:scale-[0.99]"
            >
              Add Lead
            </button>
          </>
        }
      >
        <form id="add-lead-form" onSubmit={handleAddLead} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="9876543210"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all"
              >
                <option>Website</option>
                <option>Google Ads</option>
                <option>Facebook</option>
                <option>Referral</option>
                <option>Walk-in</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Est. value</label>
            <input
              type="text"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="e.g. ₹3.5 L"
              className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300"
            />
          </div>
        </form>
      </Modal>

      {/* Floating Action Feedback Layers */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-3.5 py-2 text-[11px] font-semibold text-white shadow-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toast}
        </div>
      )}
      
    </div>
  )
}