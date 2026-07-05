// Mock data for the Admin "Online Queue" screen — the live lead-assignment
// engine, SLA countdowns, queue rows, and the recent assignment log.
// Frontend-only; SLA timers tick from these seed values in the browser.

import { reps } from './reps.js'

const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
function repMeta(name) {
  const r = repByName[name]
  return { rep: name, repInitials: r?.initials, repColor: r?.avatarColor }
}

// ── Block 1 — status strip ──────────────────────────────────────────────────
// `pill` renders a small status pill; `chip` renders a filled red delta chip.
// The server-time card is special-cased in the page (live ticking clock).
export const statusCards = [
  {
    id: 'pending-accept',
    icon: 'Clock',
    tile: 'amber',
    label: 'Pending Accept',
    value: '3',
    pill: { tone: 'red', text: 'Live' },
    sub: 'Leads awaiting acceptance',
  },
  {
    id: 'pending-call',
    icon: 'Phone',
    tile: 'blue',
    label: 'Pending First Call',
    value: '1',
    pill: { tone: 'green', text: 'Safe' },
    sub: 'Leads waiting for first call',
  },
  {
    id: 'breaches',
    icon: 'AlarmClock',
    tile: 'red',
    label: 'SLA Breaches (24h)',
    value: '2',
    chip: '+1',
    sub: 'Require immediate attention',
  },
  {
    id: 'reassigns',
    icon: 'RefreshCw',
    tile: 'indigo',
    label: 'Auto-Reassigns (24h)',
    value: '5',
    pill: { tone: 'green', text: 'Healthy' },
    sub: 'System reassignments',
  },
  {
    id: 'server-time',
    icon: 'Clock',
    tile: 'navy',
    label: 'Server Time · Kerala',
    clock: true,
    sub: '24 April 2026 · Friday',
  },
]

// ── Block 2 — assignment engine config ──────────────────────────────────────
export const engine = {
  status: 'RUNNING',
  mode: 'Performance-Weighted Round Robin',
  modeDetail: '70% score + 30% availability',
  rotation: ['Ravi Kumar', 'Priya Nair', 'Sneha Thomas', 'Meera Rajan', 'Vinod Jose'].map(
    (name) => ({ name, ...repMeta(name) }),
  ),
  rotationExtra: 3, // "+3" chip after the visible avatars
  workingHours: '09:00 - 18:00',
  workingHoursDetail: 'After-hours → on-shift rep',
}

// ── Block 3 — live queue rows ───────────────────────────────────────────────
// SLA cell states: 'running' (ticks down from `seconds` over `budget`),
// 'waiting' (not started), 'accepted' (green check), 'breached' (red, overdue).
const ACCEPT_BUDGET = 15 * 60 // 15 min
const CALL_BUDGET = 30 * 60 // 30 min

export const queueRows = [
  {
    id: 'L-1098', name: 'Hari Krishnan', district: 'Thrissur', sizeKw: 6, source: 'Website',
    ...repMeta('Sneha Thomas'),
    accept: { state: 'running', seconds: 12 * 60, budget: ACCEPT_BUDGET },
    firstCall: { state: 'waiting', budget: CALL_BUDGET },
    reassigns: 0, reassignsMax: null,
    status: 'awaiting-accept',
  },
  {
    id: 'L-1091', name: 'Radhika Menon', district: 'Ernakulam', sizeKw: 6, source: 'Google Ads',
    ...repMeta('Priya Nair'),
    accept: { state: 'running', seconds: 3 * 60, budget: ACCEPT_BUDGET },
    firstCall: { state: 'waiting', budget: CALL_BUDGET },
    reassigns: 0, reassignsMax: null,
    status: 'awaiting-accept',
  },
  {
    id: 'L-1085', name: 'Sreeja Menon', district: 'Thrissur', sizeKw: 3, source: 'Facebook',
    ...repMeta('Sneha Thomas'),
    accept: { state: 'accepted' },
    firstCall: { state: 'running', seconds: 7 * 60, budget: CALL_BUDGET },
    reassigns: 0, reassignsMax: null,
    status: 'awaiting-call',
  },
  {
    id: 'L-1099', name: 'Pradeep Varma', district: 'Ernakulam', sizeKw: 5, source: 'Google Ads',
    ...repMeta('Vinod Jose'),
    accept: { state: 'running', seconds: 9 * 60, budget: ACCEPT_BUDGET },
    firstCall: { state: 'waiting', budget: CALL_BUDGET },
    reassigns: 1, reassignsMax: 3,
    status: 'awaiting-accept',
  },
  {
    id: 'L-1100', name: 'Mini Joseph', district: 'Kollam', sizeKw: 4, source: 'Website',
    ...repMeta('Meera Rajan'),
    accept: { state: 'breached', seconds: 28 * 60 + 40, budget: ACCEPT_BUDGET },
    firstCall: { state: 'breached', seconds: 37 * 60, budget: CALL_BUDGET },
    reassigns: 0, reassignsMax: null,
    status: 'breached',
  },
]

export const STATUS_LABELS = {
  'awaiting-accept': 'AWAITING ACCEPT',
  'awaiting-call': 'AWAITING CALL',
  accepted: 'ACCEPTED',
  breached: 'BREACHED',
}

// ── Block 4 — recent assignment history ─────────────────────────────────────
export const historyEvents = [
  { time: '14:26', bold: 'Ravi Kumar', text: 'accepted L-1099 in 54s' },
  { time: '14:24', bold: 'System', text: 'auto-reassigned L-1099 → Vinod Jose (Priya offline)' },
  { time: '14:20', bold: 'Priya Nair', text: 'accepted L-1091 in 1:12' },
  { time: '14:18', bold: 'Sneha Thomas', text: 'first call made for L-1085 in 4:32' },
  { time: '14:11', bold: 'System', text: 'captured 4 new Google Ads leads' },
]
