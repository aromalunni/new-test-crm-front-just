// Master lead dataset for the Admin "All Leads" screen (company-wide).
// The first 10 rows are the exact designed records shown on page 1; the list is
// then padded to TOTAL_LEADS so the table footer / pagination read realistically
// ("Showing 1 to 10 of 1,493 leads" across 150 pages). Frontend-only mock.

import { reps } from './reps.js'
import { STAGES } from '../config/stages.js'

// Stage variant key -> uppercased label shown in the STAGE column (StatusBadge).
// Derived from the canonical 14-stage config so the table can label every
// lifecycle stage (Negotiation, Booking Confirmed, …). The legacy kebab keys
// still present in the mock rows below, plus the non-pipeline 'stalled' status,
// are kept so existing records keep their exact designed labels.
export const STAGE_LABELS = {
  ...Object.fromEntries(STAGES.map((s) => [s.key, s.label.toUpperCase()])),
  'site-visited': 'SITE VISITED',
  'advance-paid': 'ADVANCE PAID',
  docs: 'DOCS COMPLETE',
  stalled: 'STALLED',
}

const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
function repMeta(name) {
  const r = repByName[name]
  return { rep: name, repInitials: r?.initials, repColor: r?.avatarColor }
}

// ── Page-1 records (exact, in order) ────────────────────────────────────────
export const designedLeads = [
  {
    id: 'L-1084', name: 'Rajesh Chandran', initials: 'RC', color: '#F26B3A',
    phone: '+91 98470 11084', district: 'Ernakulam', sizeKw: 6, stage: 'site-visited',
    source: 'Google Ads', type: 'online', ...repMeta('Ravi Kumar'), age: 4,
    action: 'Called', actionTime: '09:30 am', amount: '₹4.1 L', amountValue: 4.1,
  },
  {
    id: 'L-1085', name: 'Sreeja Menon', initials: 'SM', color: '#2F6FED',
    phone: '+91 98470 21085', district: 'Thrissur', sizeKw: 3, stage: 'new',
    source: 'Facebook', type: 'online', ...repMeta('Sneha Thomas'), age: 5,
    action: 'Assigned', actionTime: '24 min ago', amount: '₹2.2 L', amountValue: 2.2,
  },
  {
    id: 'L-1066', name: 'Vinod Pillai', initials: 'VP', color: '#1FA463',
    phone: '+91 98470 31066', district: 'Ernakulam', sizeKw: 10, stage: 'proposal-sent',
    source: 'Referral', type: 'manual', ...repMeta('Priya Nair'), age: 7,
    action: 'Follow-up scheduled', actionTime: 'tomorrow', amount: '₹6.7 L', amountValue: 6.7,
  },
  {
    id: 'L-1087', name: 'Lakshmi Devi', initials: 'LD', color: '#F1A33B',
    phone: '+91 98470 41087', district: 'Kollam', sizeKw: 4, stage: 'contacted',
    source: 'Cold Call', type: 'manual', ...repMeta('Meera Rajan'), age: null,
    action: 'Called', actionTime: '1 hour ago', amount: '₹2.8 L', amountValue: 2.8,
  },
  {
    id: 'L-1068', name: 'Anil Kumar', initials: 'AK', color: '#7C5CD6',
    phone: '+91 98470 51068', district: 'Ernakulam', sizeKw: 5, stage: 'advance-paid',
    source: 'Website', type: 'online', ...repMeta('Ravi Kumar'), age: null,
    action: 'Advance received ₹50,000', actionTime: '2d ago', amount: '₹3.4 L', amountValue: 3.4,
  },
  {
    id: 'L-1069', name: 'Deepa Thomas', initials: 'DT', color: '#E0533D',
    phone: '+91 98470 61069', district: 'Thrissur', sizeKw: 3, stage: 'stalled',
    source: 'Facebook', type: 'online', ...repMeta('Rahul Varma'), age: null,
    action: 'No response', actionTime: '14d', amount: '₹2.1 L', amountValue: 2.1,
  },
  {
    id: 'L-1090', name: 'Suresh Jayan', initials: 'SJ', color: '#0E8C86',
    phone: '+91 98470 71090', district: 'Trivandrum', sizeKw: 8, stage: 'docs',
    source: 'Referral', type: 'manual', ...repMeta('Anjali Pillai'), age: null,
    action: 'Filed KSEB application', actionTime: '2d ago', amount: '₹5.2 L', amountValue: 5.2,
  },
  {
    id: 'L-1091', name: 'Radhika Menon', initials: 'RM', color: '#F26B3A',
    phone: '+91 98470 81091', district: 'Ernakulam', sizeKw: 6, stage: 'new',
    source: 'Google Ads', type: 'online', ...repMeta('Priya Nair'), age: null,
    action: 'Assigned', actionTime: '4 min ago', amount: '₹4.2 L', amountValue: 4.2,
  },
  {
    id: 'L-1092', name: 'George Abraham', initials: 'GA', color: '#2F6FED',
    phone: '+91 98470 91092', district: 'Kollam', sizeKw: 12, stage: 'proposal-sent',
    source: 'Walk-in', type: 'manual', ...repMeta('Meera Rajan'), age: null,
    action: 'Awaiting customer decision', actionTime: '3d ago', amount: '₹7.9 L', amountValue: 7.9,
  },
  {
    id: 'L-1095', name: 'Fathima Beevi', initials: 'FB', color: '#7C5CD6',
    phone: '+91 98471 01095', district: 'Kozhikode', sizeKw: 5, stage: 'site-visited',
    source: 'Website', type: 'online', ...repMeta('Ravi Kumar'), age: 3,
    action: 'Site visit completed', actionTime: '2d ago', amount: '₹3.6 L', amountValue: 3.6,
  },
]

// ── Filler so the dataset reads as the full company book ─────────────────────
export const TOTAL_LEADS = 1493

const F_NAMES = [
  'Arun Pillai', 'Nisha Raj', 'Manoj Kurian', 'Reena George', 'Sajan Thomas',
  'Bindu Nair', 'Praveen Das', 'Asha Menon', 'Vijay Krishnan', 'Smitha Varma',
  'Hari Govind', 'Leela Mathew', 'Roy Sebastian', 'Divya Pillai', 'Tom Joseph',
  'Anitha Suresh', 'Gokul Nath', 'Remya Raj', 'Felix D Souza', 'Jaya Kumari',
]
const F_DISTRICTS = ['Ernakulam', 'Thrissur', 'Kollam', 'Trivandrum', 'Kozhikode', 'Kottayam', 'Alappuzha', 'Palakkad']
const F_STAGES = ['new', 'contacted', 'site-visited', 'proposal-sent', 'advance-paid', 'docs', 'stalled']
const F_SOURCES = ['Google Ads', 'Facebook', 'Referral', 'Cold Call', 'Website', 'Walk-in']
const MANUAL_SOURCES = new Set(['Referral', 'Cold Call', 'Walk-in'])
const F_REPS = reps.map((r) => r.name)
const F_SIZES = [3, 4, 5, 6, 8, 10, 12]
const F_ACTIONS = [
  ['Called', '2 hours ago'], ['Assigned', '12 min ago'], ['Quote sent', '1d ago'],
  ['Site visit booked', '3d ago'], ['Follow-up scheduled', 'tomorrow'], ['No response', '9d'],
  ['Documents requested', '4d ago'], ['Advance discussed', '6h ago'],
]

function pad2(n) {
  return String(n).padStart(2, '0')
}

function fillerLead(i) {
  const idx = i // 0-based within filler block
  const name = F_NAMES[idx % F_NAMES.length]
  const source = F_SOURCES[idx % F_SOURCES.length]
  const sizeKw = F_SIZES[idx % F_SIZES.length]
  const amt = 2 + ((idx * 37) % 90) / 10 // 2.0 – 10.9
  const repName = F_REPS[idx % F_REPS.length]
  const [action, actionTime] = F_ACTIONS[idx % F_ACTIONS.length]
  const age = idx % 4 === 0 ? null : (idx % 21) + 1
  return {
    id: `L-${2000 + idx}`,
    name,
    phone: `+91 9847${pad2(idx % 100)} ${pad2((idx * 7) % 100)}${pad2((idx * 3) % 100)}`,
    district: F_DISTRICTS[idx % F_DISTRICTS.length],
    sizeKw,
    stage: F_STAGES[idx % F_STAGES.length],
    source,
    type: MANUAL_SOURCES.has(source) ? 'manual' : 'online',
    ...repMeta(repName),
    age,
    action,
    actionTime,
    amount: `₹${amt.toFixed(1)} L`,
    amountValue: amt,
  }
}

export const adminLeads = [
  ...designedLeads,
  ...Array.from({ length: TOTAL_LEADS - designedLeads.length }, (_, i) => fillerLead(i)),
]

// ── Filter option lists (derived where possible) ────────────────────────────
// All 14 canonical lifecycle stages (filter dropdown + add-lead form), plus the
// non-pipeline 'stalled' status used by legacy mock rows.
export const stageOptions = [
  { key: 'all', label: 'All Stages' },
  ...STAGES.map((s) => ({ key: s.key, label: s.label })),
  { key: 'stalled', label: 'Stalled' },
]

export const sourceOptions = [
  { key: 'all', label: 'All Sources' },
  ...F_SOURCES.map((s) => ({ key: s, label: s })),
]

export const repOptions = [
  { key: 'all', label: 'All Reps' },
  ...F_REPS.map((r) => ({ key: r, label: r })),
]

export const typeOptions = [
  { key: 'all', label: 'All Types' },
  { key: 'online', label: 'Online' },
  { key: 'manual', label: 'Manual' },
]

// KPI strip — caps label + big number + green delta vs last month.
export const leadKpis = [
  { id: 'total', icon: 'Users', label: 'Total Leads', value: '1,493', delta: '12%' },
  { id: 'new', icon: 'UserPlus', label: 'New Leads', value: '597', delta: '8%' },
  { id: 'visits', icon: 'MapPin', label: 'Site Visits', value: '188', delta: '6%' },
  { id: 'proposals', icon: 'FileText', label: 'Proposals', value: '94', delta: '15%' },
  { id: 'converted', icon: 'CheckCircle2', label: 'Converted', value: '40', delta: '15%' },
  { id: 'rate', icon: 'TrendingUp', label: 'Conversion Rate', value: '12.1%', delta: '2.3%' },
]
