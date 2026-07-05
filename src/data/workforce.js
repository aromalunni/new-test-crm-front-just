// Mock data for the Admin "Workforce & Field Tracking" screen — live rep status,
// field check-ins, pending check-outs, and attendance/travel. Frontend-only.

import { reps } from './reps.js'

const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
function repMeta(name) {
  const r = repByName[name]
  return { rep: name, repInitials: r?.initials, repColor: r?.avatarColor }
}

// ── Block 2 — status summary cards ──────────────────────────────────────────
// tone drives the colored icon tile; value '—' renders as a dash.
export const statusCards = [
  { key: 'active',  icon: 'Circle',   tone: 'green', label: 'Active Now', value: '6', sub: 'Reps on duty' },
  { key: 'break',   icon: 'Clock',    tone: 'amber', label: 'On Break',   value: '1', sub: 'Taking break' },
  { key: 'offline', icon: 'Power',    tone: 'grey',  label: 'Offline',    value: '—', sub: 'Not logged in' },
  { key: 'field',   icon: 'MapPin',   tone: 'orange', label: 'In Field',  value: '3', sub: 'On field visit' },
]

// ── Block 3 — live status table ─────────────────────────────────────────────
// status: active | break | offline → colored dot + word in the table.
export const liveStatusRows = [
  { ...repMeta('Ravi Kumar'),   shift: 'Morning',   status: 'active',  login: '08:55', activity: 'Site visit · Kochi', location: 'Palarivattom', checkins: 2 },
  { ...repMeta('Priya Nair'),   shift: 'Morning',   status: 'active',  login: '09:02', activity: 'Call logged',        location: 'Edappally',    checkins: 2 },
  { ...repMeta('Arun Menon'),   shift: 'Morning',   status: 'break',   login: '09:08', activity: 'Lunch break',        location: '—',            checkins: 0 },
  { ...repMeta('Sneha Thomas'), shift: 'Afternoon', status: 'active',  login: '13:02', activity: 'Proposal sent',      location: 'Thrissur Town', checkins: 3 },
  { ...repMeta('Rahul Varma'),  shift: 'Morning',   status: 'offline', login: '—',     activity: 'Yesterday 18:04',    location: '—',            checkins: 0 },
  { ...repMeta('Meera Rajan'),  shift: 'Afternoon', status: 'active',  login: '12:58', activity: 'Call logged',        location: 'Kollam',       checkins: 2 },
  { ...repMeta('Vinod Jose'),   shift: 'Afternoon', status: 'active',  login: '13:04', activity: 'Site visit prep',    location: 'Aluva',        checkins: 2 },
  { ...repMeta('Anjali Pillai'),shift: 'Evening',   status: 'active',  login: '17:00', activity: 'Lead accepted',      location: 'Trivandrum',   checkins: 3 },
]

export const STATUS_LABELS = {
  active: { label: 'Active', dot: '#1FA463' },
  break: { label: 'Break', dot: '#F1A33B' },
  offline: { label: 'Offline', dot: '#5B6675' },
}

// ── Block 4 left — field activity map pins (relative %, top-left origin) ─────
// Stylized Kerala layout; coordinates are visual, not geographic.
export const mapPins = [
  { id: 'p1', label: 'Palarivattom', x: 58, y: 46 },
  { id: 'p2', label: 'Edappally',    x: 50, y: 41 },
  { id: 'p3', label: 'Thrissur',     x: 44, y: 30 },
  { id: 'p4', label: 'Kollam',       x: 40, y: 72 },
  { id: 'p5', label: 'Aluva',        x: 54, y: 38 },
]

// ── Block 4 right — pending check-outs ──────────────────────────────────────
export const pendingCheckouts = [
  { ...repMeta('Ravi Kumar'),  detail: 'Checked in 3h ago · Palarivattom' },
  { ...repMeta('Vinod Jose'),  detail: 'Checked in 2h ago · Aluva' },
  { ...repMeta('Sneha Thomas'),detail: 'Checked in 1h ago · Thrissur' },
]

// ── Block 5 — attendance & travel ───────────────────────────────────────────
// kmValue / claimValue drive numeric sort; display strings carry units.
export const attendanceRows = [
  { ...repMeta('Ravi Kumar'),  days: 21, hours: '189h', km: '630 km', kmValue: 630, claim: '₹3,121', claimValue: 3121, visits: 24 },
  { ...repMeta('Priya Nair'),  days: 21, hours: '188h', km: '485 km', kmValue: 485, claim: '₹4,904', claimValue: 4904, visits: 18 },
  { ...repMeta('Arun Menon'),  days: 21, hours: '184h', km: '782 km', kmValue: 782, claim: '₹4,732', claimValue: 4732, visits: 12 },
  { ...repMeta('Sneha Thomas'),days: 20, hours: '194h', km: '504 km', kmValue: 504, claim: '₹4,926', claimValue: 4926, visits: 10 },
  { ...repMeta('Rahul Varma'), days: 22, hours: '185h', km: '494 km', kmValue: 494, claim: '₹2,575', claimValue: 2575, visits: 5 },
]
