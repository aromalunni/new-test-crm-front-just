// Company-wide call logs for the Admin / Team Lead "Call Logs" screen.
// Every rep's calls across all departments roll up here so leadership can audit
// activity in one place. Frontend-only mock — a designed set of recent calls
// followed by deterministic filler so pagination reads realistically.

import { reps } from './reps.js'

// ── Departments ──────────────────────────────────────────────────────────────
// Solar org structure. Each rep belongs to exactly one department.
export const DEPARTMENTS = [
  'Residential Sales',
  'Commercial Sales',
  'Projects',
  'Service & Support',
]

const REP_DEPARTMENT = {
  'Ravi Kumar': 'Residential Sales',
  'Sneha Thomas': 'Residential Sales',
  'Anjali Pillai': 'Residential Sales',
  'Priya Nair': 'Commercial Sales',
  'Vinod Jose': 'Commercial Sales',
  'Meera Rajan': 'Projects',
  'Arun Menon': 'Projects',
  'Rahul Varma': 'Service & Support',
}

const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
function repMeta(name) {
  const r = repByName[name]
  return {
    rep: name,
    repInitials: r?.initials,
    repColor: r?.avatarColor,
    department: REP_DEPARTMENT[name] || 'Residential Sales',
  }
}

// ── Direction / outcome presentation ─────────────────────────────────────────
// direction: Outgoing | Incoming | Missed
export const DIRECTIONS = ['Outgoing', 'Incoming', 'Missed']

// outcome → tone bucket used for the result badge color.
export const OUTCOME_TONE = {
  Interested: 'green',
  Connected: 'green',
  'Callback Requested': 'amber',
  Busy: 'amber',
  'No Answer': 'gray',
  Voicemail: 'gray',
  'Not Interested': 'red',
}

export const OUTCOMES = Object.keys(OUTCOME_TONE)

// ── Designed recent calls (top of the list, exact) ───────────────────────────
const designedLogs = [
  {
    id: 'CL-2001', leadId: 'L-1202', leadName: 'George Abraham', phone: '+91 98470 91092',
    ...repMeta('Sneha Thomas'), direction: 'Outgoing', duration: '7:13', durationSec: 433,
    outcome: 'Interested', day: 'Today', time: '08:55 AM',
    note: 'Quoted 7kW over phone, sending full details on WhatsApp.',
  },
  {
    id: 'CL-2002', leadId: 'L-1190', leadName: 'Radhika Menon', phone: '+91 98470 81091',
    ...repMeta('Rahul Varma'), direction: 'Outgoing', duration: '1:58', durationSec: 118,
    outcome: 'Callback Requested', day: 'Today', time: '02:48 PM',
    note: 'First contact, requested a callback tomorrow morning.',
  },
  {
    id: 'CL-2003', leadId: 'L-1158', leadName: 'Lakshmi Devi', phone: '+91 98470 41087',
    ...repMeta('Arun Menon'), direction: 'Outgoing', duration: '2:34', durationSec: 154,
    outcome: 'Interested', day: 'Today', time: '12:15 PM',
    note: 'Considering 3kW, worried about budget — shared low-cost option.',
  },
  {
    id: 'CL-2004', leadId: 'L-1112', leadName: 'Rajesh Chandran', phone: '+91 98470 11084',
    ...repMeta('Ravi Kumar'), direction: 'Outgoing', duration: '6:42', durationSec: 402,
    outcome: 'Interested', day: 'Today', time: '11:20 AM',
    note: 'Walked through 12kW commercial quote, sending revised pricing.',
  },
  {
    id: 'CL-2005', leadId: 'L-1131', leadName: 'Anil Kumar', phone: '+91 98470 51068',
    ...repMeta('Vinod Jose'), direction: 'Outgoing', duration: '5:27', durationSec: 327,
    outcome: 'Callback Requested', day: 'Today', time: '09:40 AM',
    note: 'Wants EMI/loan options before deciding.',
  },
  {
    id: 'CL-2006', leadId: 'L-1127', leadName: 'Vinod Pillai', phone: '+91 98470 31066',
    ...repMeta('Sneha Thomas'), direction: 'Outgoing', duration: '4:51', durationSec: 291,
    outcome: 'Interested', day: 'Today', time: '10:02 AM',
    note: 'Explained PM Surya Ghar subsidy, keen to proceed.',
  },
  {
    id: 'CL-2007', leadId: 'L-1206', leadName: 'Deepa Thomas', phone: '+91 98470 61069',
    ...repMeta('Vinod Jose'), direction: 'Outgoing', duration: '0:00', durationSec: 0,
    outcome: 'Not Interested', day: 'Today', time: '01:05 PM',
    note: 'Said they already installed solar last year.',
  },
  {
    id: 'CL-2008', leadId: 'L-1182', leadName: 'Fathima Beevi', phone: '+91 98471 01095',
    ...repMeta('Meera Rajan'), direction: 'Incoming', duration: '3:42', durationSec: 222,
    outcome: 'Interested', day: 'Yesterday', time: '10:18 AM',
    note: 'Wants a weekend site visit, shadow concerns on roof.',
  },
  {
    id: 'CL-2009', leadId: 'L-1127', leadName: 'Vinod Pillai', phone: '+91 98470 31066',
    ...repMeta('Sneha Thomas'), direction: 'Missed', duration: '0:00', durationSec: 0,
    outcome: 'No Answer', day: 'Yesterday', time: '01:12 PM',
    note: 'No answer, will retry in the evening.',
  },
  {
    id: 'CL-2010', leadId: 'L-1112', leadName: 'Rajesh Chandran', phone: '+91 98470 11084',
    ...repMeta('Ravi Kumar'), direction: 'Outgoing', duration: '3:15', durationSec: 195,
    outcome: 'Callback Requested', day: 'Yesterday', time: '04:05 PM',
    note: 'Busy at work, asked to call back after 11 AM.',
  },
  {
    id: 'CL-2011', leadId: 'L-1190', leadName: 'Radhika Menon', phone: '+91 98470 81091',
    ...repMeta('Rahul Varma'), direction: 'Missed', duration: '0:00', durationSec: 0,
    outcome: 'No Answer', day: 'Yesterday', time: '11:30 AM',
    note: 'Missed call, no voicemail.',
  },
  {
    id: 'CL-2012', leadId: 'L-1135', leadName: 'Suresh Jayan', phone: '+91 98470 71090',
    ...repMeta('Anjali Pillai'), direction: 'Outgoing', duration: '4:09', durationSec: 249,
    outcome: 'Callback Requested', day: '2 days ago', time: '06:02 PM',
    note: 'Referred by colleague, scheduling weekend callback.',
  },
]

// ── Filler so the log reads as the full company book ─────────────────────────
export const TOTAL_CALLS = 1248

const F_LEADS = [
  'Arun Pillai', 'Nisha Raj', 'Manoj Kurian', 'Reena George', 'Sajan Thomas',
  'Bindu Nair', 'Praveen Das', 'Asha Menon', 'Vijay Krishnan', 'Smitha Varma',
  'Hari Govind', 'Leela Mathew', 'Roy Sebastian', 'Divya Pillai', 'Tom Joseph',
  'Anitha Suresh', 'Gokul Nath', 'Remya Raj', 'Felix D Souza', 'Jaya Kumari',
]
const F_REPS = reps.map((r) => r.name)
const F_DIR = ['Outgoing', 'Outgoing', 'Outgoing', 'Incoming', 'Missed']
const F_DAYS = ['2 days ago', '3 days ago', '4 days ago', 'Last week', 'Last week']
const F_TIMES = ['09:15 AM', '10:40 AM', '11:55 AM', '01:20 PM', '03:05 PM', '04:30 PM', '05:48 PM']
// outcomes weighted toward connected calls for outgoing/incoming
const CONNECTED_OUTCOMES = ['Interested', 'Connected', 'Callback Requested', 'Busy', 'Not Interested']
const MISSED_OUTCOMES = ['No Answer', 'Voicemail']

function pad2(n) {
  return String(n).padStart(2, '0')
}

function fillerLog(i) {
  const leadName = F_LEADS[i % F_LEADS.length]
  const repName = F_REPS[i % F_REPS.length]
  const direction = F_DIR[i % F_DIR.length]
  const missed = direction === 'Missed'
  const outcome = missed
    ? MISSED_OUTCOMES[i % MISSED_OUTCOMES.length]
    : CONNECTED_OUTCOMES[i % CONNECTED_OUTCOMES.length]
  const notInterested = outcome === 'Not Interested'
  const durationSec = missed || notInterested ? 0 : 60 + ((i * 53) % 480) // up to ~9 min
  const mins = Math.floor(durationSec / 60)
  const secs = durationSec % 60
  return {
    id: `CL-${3000 + i}`,
    leadId: `L-${2000 + (i % 400)}`,
    leadName,
    phone: `+91 9847${pad2(i % 100)} ${pad2((i * 7) % 100)}${pad2((i * 3) % 100)}`,
    ...repMeta(repName),
    direction,
    duration: `${mins}:${pad2(secs)}`,
    durationSec,
    outcome,
    day: F_DAYS[i % F_DAYS.length],
    time: F_TIMES[i % F_TIMES.length],
    note: '',
  }
}

// A call has a recording only when someone actually talked (connected calls with
// real talk time). Missed / no-answer / not-interested-hangups have none.
function withRecording(c) {
  const hasRecording = c.durationSec > 0
  return {
    ...c,
    hasRecording,
    recordingName: hasRecording ? `${c.id}.mp3` : null,
  }
}

export const callLogs = [
  ...designedLogs,
  ...Array.from({ length: 60 }, (_, i) => fillerLog(i)),
].map(withRecording)

// Deterministic mock waveform for the recording player. Returns `bars` peak
// heights (0..1) derived from the call id so each recording looks distinct but
// stable across renders. No randomness — index + char-code arithmetic only.
export function recordingWaveform(id, bars = 56) {
  let seed = 0
  for (let i = 0; i < id.length; i += 1) seed = (seed * 31 + id.charCodeAt(i)) % 100000
  return Array.from({ length: bars }, (_, i) => {
    const a = Math.sin((i + 1) * (0.45 + (seed % 7) * 0.03))
    const b = Math.sin((i + 1) * 0.17 + seed)
    const v = (a * 0.6 + b * 0.4 + 1) / 2 // → 0..1
    return 0.18 + v * 0.82 // keep a visible floor
  })
}

// ── Filter option lists ──────────────────────────────────────────────────────
export const departmentOptions = [
  { key: 'all', label: 'All Departments' },
  ...DEPARTMENTS.map((d) => ({ key: d, label: d })),
]

export const directionOptions = [
  { key: 'all', label: 'All Directions' },
  ...DIRECTIONS.map((d) => ({ key: d, label: d })),
]

export const outcomeOptions = [
  { key: 'all', label: 'All Outcomes' },
  ...OUTCOMES.map((o) => ({ key: o, label: o })),
]

export const repOptions = [
  { key: 'all', label: 'All Reps' },
  ...F_REPS.map((r) => ({ key: r, label: r })),
]

// ── KPI strip ────────────────────────────────────────────────────────────────
export const callKpis = [
  { id: 'total', icon: 'Phone', label: 'Total Calls', value: '1,248', delta: '9%' },
  { id: 'connected', icon: 'PhoneCall', label: 'Connected', value: '912', delta: '6%' },
  { id: 'missed', icon: 'PhoneMissed', label: 'Missed / No Answer', value: '214', delta: '3%' },
  { id: 'talktime', icon: 'Clock', label: 'Total Talk Time', value: '86h', delta: '11%' },
  { id: 'avg', icon: 'Activity', label: 'Avg Call Time', value: '4:08', delta: '4%' },
]
