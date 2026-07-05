import { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import {
  Globe,
  MapPin,
  Phone,
  Zap,
  IndianRupee,
  Hourglass,
  Lightbulb,
  Check,
  Info,
  Clock,
  LayoutGrid,
  List,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import Avatar from '../../components/Avatar.jsx'
import CountdownRing from '../../components/CountdownRing.jsx'
import { stageTabs, focus as initialFocus, queue as initialQueue } from '../../data/myIncoming.js'

function OutlinePill({ icon: Icon, tone, children }) {
  const tones = {
    orange: 'border-[#F26A3E]/30 bg-[#FFF5F0] text-[#d95a2b]',
    green: 'border-green-100 bg-green-50 text-green-700',
    neutral: 'border-gray-200 bg-gray-50 text-gray-600',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold', tones[tone])}>
      {Icon && <Icon className="h-4 w-4" strokeWidth={2.5} />}
      {children}
    </span>
  )
}

function QueueCard({ lead, onAccept, onDetails }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <Avatar name={lead.name} initials={lead.initials} size="md" />
        <div className="min-w-0">
          <div className="truncate font-bold text-sm text-gray-900">{lead.name}</div>
          <div className="truncate text-xs font-medium text-gray-500">
            {lead.district} · {lead.sizeKw}kW · {lead.source}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400">{lead.id}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
          <Clock className="h-3.5 w-3.5" />
          {lead.time}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAccept(lead)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#F26A3E]/40 bg-[#FFF5F0] px-2.5 py-1.5 text-xs font-bold text-[#d95a2b] transition-all hover:bg-[#FFEBE1]"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Accept
        </button>
        <button
          type="button"
          onClick={() => onDetails(lead.name)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          <Info className="h-3.5 w-3.5" />
          Details
        </button>
      </div>
    </div>
  )
}

export default function Incoming() {
  const [tab, setTab] = useState('all')
  const [view, setView] = useState('card')
  const [toast, setToast] = useState(null)
  const [isQueueOpen, setIsQueueOpen] = useState(true)

  // Manage data flows locally to handle modifications safely
  const [currentFocus, setCurrentFocus] = useState(initialFocus)
  const [leadQueue, setLeadQueue] = useState(initialQueue)

  // Timer run loop conditions
  const [seconds, setSeconds] = useState(initialFocus?.secondsLeft || 120)
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  // Modal display configuration states
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineReason, setDeclineReason] = useState('')

  useEffect(() => {
    if (!isTimerRunning || seconds <= 0 || !currentFocus) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleAutoExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, isTimerRunning, currentFocus])

  const notify = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const handleAutoExpire = () => {
    notify(`Lead template ${currentFocus?.name || ''} reassigned — timer expired`)
    rotateToNextLead()
  }

  const rotateToNextLead = () => {
    if (leadQueue.length > 0) {
      const nextLead = leadQueue[0]
      const updatedQueue = leadQueue.slice(1)

      setLeadQueue(updatedQueue)
      setCurrentFocus({
        id: nextLead.id,
        name: nextLead.name,
        district: nextLead.district,
        sizeKw: nextLead.sizeKw,
        source: nextLead.source,
        phone: '91' + Math.floor(1000000000 + Math.random() * 9000000000), 
        systemLabel: 'ON-GRID SYSTEM',
        estAmount: '₹' + (nextLead.amount || '1,85,000'),
        secondsLeft: 120
      })
      setSeconds(120)
      setIsTimerRunning(true)
    } else {
      setCurrentFocus(null)
      setIsTimerRunning(false)
    }
  }

  const handleAcceptMainLead = () => {
    if (!currentFocus) return
    setIsTimerRunning(false)
    notify(`Accepted ${currentFocus.name}`)
    
    setTimeout(() => {
      rotateToNextLead()
    }, 400)
  }

  const handleAcceptQueueLead = (selectedLead) => {
    notify(`Accepted ${selectedLead.name}`)
    setLeadQueue((prev) => prev.filter((item) => item.id !== selectedLead.id))
  }

  const triggerDeclineFlow = () => {
    if (!currentFocus) return
    setIsTimerRunning(false)
    setShowDeclineModal(true)
  }

  const submitDecline = (e) => {
    e.preventDefault()
    if (!declineReason.trim()) return

    setShowDeclineModal(false)
    notify(`Declined ${currentFocus.name}: ${declineReason}`)
    setDeclineReason('')
    
    rotateToNextLead()
  }

  const cancelDecline = () => {
    setShowDeclineModal(false)
    if (seconds > 0) {
      setIsTimerRunning(true)
    }
  }

  return (
    <div className="w-full px-6 pt-4 pb-32 space-y-4 antialiased text-gray-900 bg-[#FCFCFC]">
      
      {/* Utility Filtering Tab Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        
        <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-0.5">
          <button
            type="button"
            aria-label="Card view"
            onClick={() => setView('card')}
            className={clsx(
              'flex h-8 w-9 items-center justify-center rounded-lg transition-colors',
              view === 'card' ? 'bg-[#F26A3E] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700',
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setView('list')}
            className={clsx(
              'flex h-8 w-9 items-center justify-center rounded-lg transition-colors',
              view === 'list' ? 'bg-[#F26A3E] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700',
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Structural Layout Grid */}
      <div className={clsx(
        'grid gap-4 w-full items-start',
        view === 'card' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
      )}>
        
        {/* Left Column / Workspace Area */}
        <div className={clsx(view === 'card' ? 'lg:col-span-2' : 'col-span-1', 'space-y-4')}>
          {currentFocus ? (
            <Card className="!p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                  <Globe className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {currentFocus.source}
                </span>
                <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-bold text-gray-400">
                  Lead ID: {currentFocus.id}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">{currentFocus.name}</h2>

              <div className="mt-1 flex items-center gap-1.5 text-sm">
                <MapPin className="h-4 w-4 text-[#F26A3E]" strokeWidth={2.5} />
                <span className="font-extrabold text-[#F26A3E]">{currentFocus.district}</span>
                <span className="text-gray-400 font-bold">·</span>
                <span className="text-gray-500 font-medium">{currentFocus.sizeKw}kW System</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <OutlinePill icon={Phone} tone="neutral">{currentFocus.phone}</OutlinePill>
                <OutlinePill icon={Zap} tone="orange">{currentFocus.systemLabel}</OutlinePill>
                <OutlinePill icon={IndianRupee} tone="green">{currentFocus.estAmount}</OutlinePill>
              </div>

              {/* Time tracker module */}
              <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-[#F26A3E]/20 bg-[#FFF5F0] p-4 sm:flex-row sm:items-stretch">
                <div className="flex flex-col items-center justify-center gap-1.5 sm:px-2 shrink-0">
                  <CountdownRing
                    seconds={seconds}
                    size={76}
                    stroke={5}
                    warnAt={60}
                    dashed
                    icon={Hourglass}
                    onComplete={handleAutoExpire}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Time Remaining</span>
                </div>
                
                <div className="flex flex-1 items-start gap-2.5 rounded-xl border border-[#FCECD3] bg-[#FFF8EC] px-4 py-3 text-xs text-gray-700 font-medium">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#B97A1C]" strokeWidth={2.5} fill="none" />
                  <span>
                    <span className="font-black text-[#B97A1C] uppercase tracking-wide">Tip — </span>
                    Accept this lead before the timer expires to secure it for yourself.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAcceptMainLead}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F26A3E] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#d95a2b] active:scale-[0.99]"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                Accept this lead
              </button>
              
              <button
                type="button"
                onClick={triggerDeclineFlow}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-all hover:bg-gray-50 active:scale-[0.99]"
              >
                Decline with reason
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs font-medium text-gray-400 border-t border-gray-50 pt-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span>
                  Accepting locks this lead to you once you make the first call. Declining or ignoring will reassign to
                  the next rep in the queue.
                </span>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center border border-gray-200 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-gray-800">All caught up!</h3>
              <p className="text-sm text-gray-400 mt-1">There are no incoming leads remaining in your queue.</p>
            </Card>
          )}
        </div>

        {/* Right Column / Sidebar Container */}
        <div className="col-span-1">
          <Card className="!p-0 border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setIsQueueOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2 p-4 text-left transition-colors hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <span aria-hidden className="text-base">📋</span>
                <span>Also in Queue</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
                  {leadQueue.length}
                </span>
              </div>
              <span className={clsx('text-xs font-bold text-gray-400 transition-transform duration-200', isQueueOpen && 'rotate-180')}>
                ▼
              </span>
            </button>

            {isQueueOpen && (
              <div className="p-4 pt-0 space-y-3 border-t border-gray-50 max-h-[600px] overflow-y-auto">
                {leadQueue.length > 0 ? (
                  leadQueue.map((lead) => (
                    <QueueCard 
                      key={lead.id} 
                      lead={lead} 
                      onAccept={handleAcceptQueueLead}
                      onDetails={(name) => notify(`Showing Details for ${name}`)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6 font-medium">Queue is empty</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal Rejection Wrapper */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Decline Lead</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium"> Please specify your reason for declining {currentFocus?.name}.</p>
            
            <form onSubmit={submitDecline} className="mt-4 space-y-4">
              <textarea
                required
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Type your explanation here..."
                className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F26A3E] focus:ring-1 focus:ring-[#F26A3E] resize-none"
              />
              
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDecline}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#F26A3E] hover:bg-[#d95a2b] rounded-xl transition-all shadow-sm"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast}
        </div>
      )}
    </div>
  )
}