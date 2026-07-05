// Master lead dataset for the Team Lead screens.
// "All Leads" renders this whole list (every department, company-wide).
// "My Leads" renders the subset belonging to the signed-in dept head's
// department (CURRENT_DEPT) — so My Leads is always a slice of All Leads.

import { STAGES, normalizeStage } from '../config/stages.js'

// Departments a team lead can head. The signed-in lead heads CURRENT_DEPT.
export const DEPARTMENTS = ['Projects', 'Residential', 'Commercial', 'Service']
export const CURRENT_DEPT = 'Projects'

// Canonical stage key -> compact code for the My Leads stage-step row. Derived
// from the 14-stage config so every lifecycle stage has a step code; the legacy
// kebab keys still used by the mock rows below resolve to the code of the
// canonical stage they map to (site-visited -> SURV, advance-paid -> BOOK, …).
const SHORT_BY_KEY = Object.fromEntries(STAGES.map((s) => [s.key, s.short]))
const LEGACY_STAGE_KEYS = ['site-visited', 'advance-paid', 'docs', 'subsidy', 'kseb', 'commissioned']
export const STAGE_CODE = {
  ...SHORT_BY_KEY,
  ...Object.fromEntries(LEGACY_STAGE_KEYS.map((k) => [k, SHORT_BY_KEY[normalizeStage(k)]])),
}

export const teamLeads = [
  // ── Projects (the signed-in dept head's department) ──────────────────────
  { id: 'L-1084', name: 'Rajesh Chandran', initials: 'RC', color: '#F26B3A', dept: 'Projects', district: 'Ernakulam', sizeKw: 6,  amount: '₹4.1 L',  stage: 'site-visited',  source: 'Google Ads', type: 'online',       rep: 'Ravi Kumar',  age: 4 },
  { id: 'L-1066', name: 'Vinod Pillai',    initials: 'VP', color: '#2F6FED', dept: 'Projects', district: 'Ernakulam', sizeKw: 10, amount: '₹6.7 L',  stage: 'proposal-sent', source: 'Referral',   type: 'owner-locked', rep: 'Priya Nair',  age: 7 },
  { id: 'L-1080', name: 'Biju Paul',       initials: 'BP', color: '#5B6675', dept: 'Projects', district: 'Ernakulam', sizeKw: 8,  amount: '₹5.4 L',  stage: 'kseb',          source: 'Referral',   type: 'owner-locked', rep: 'Ravi Kumar',  age: 14 },
  { id: 'L-1110', name: 'Suresh Menon',    initials: 'SM', color: '#0E8C86', dept: 'Projects', district: 'Trivandrum', sizeKw: 8, amount: '₹5.2 L',  stage: 'docs',          source: 'Website',    type: 'online',       rep: 'Priya Nair',  age: 9 },
  { id: 'L-1102', name: 'Lakshmi Devi',    initials: 'LD', color: '#B97A1C', dept: 'Projects', district: 'Kollam',    sizeKw: 4,  amount: '₹2.8 L',  stage: 'contacted',     source: 'Google Ads', type: 'online',       rep: 'Ravi Kumar',  age: 2 },
  { id: 'L-1124', name: 'Thomas Varghese', initials: 'TV', color: '#7C5CFC', dept: 'Projects', district: 'Ernakulam', sizeKw: 12, amount: '₹8.1 L',  stage: 'advance-paid',  source: 'Website',    type: 'online',       rep: 'Priya Nair',  age: 5 },

  // ── Residential ──────────────────────────────────────────────────────────
  { id: 'L-1091', name: 'Radhika Menon',   initials: 'RM', color: '#7C5CFC', dept: 'Residential', district: 'Ernakulam', sizeKw: 6, amount: '₹4.0 L', stage: 'new',          source: 'Google Ads', type: 'online', rep: 'Arun Menon',  age: 0 },
  { id: 'L-1053', name: 'Fathima Beevi',   initials: 'FB', color: '#B97A1C', dept: 'Residential', district: 'Ernakulam', sizeKw: 5, amount: '₹3.4 L', stage: 'site-visited', source: 'Website',    type: 'online', rep: 'Vinod Jose',  age: 3 },
  { id: 'L-1130', name: 'Anil Kumar',      initials: 'AK', color: '#0E8C86', dept: 'Residential', district: 'Thrissur',  sizeKw: 5, amount: '₹3.3 L', stage: 'advance-paid', source: 'Website',    type: 'online', rep: 'Vinod Jose',  age: 12 },
  { id: 'L-1142', name: 'Geetha Nair',     initials: 'GN', color: '#F26B3A', dept: 'Residential', district: 'Alappuzha', sizeKw: 3, amount: '₹2.0 L', stage: 'commissioned', source: 'Referral',   type: 'online', rep: 'Arun Menon',  age: 22 },

  // ── Commercial ───────────────────────────────────────────────────────────
  { id: 'L-1150', name: 'Cochin Spices Ltd', initials: 'CS', color: '#2F6FED', dept: 'Commercial', district: 'Ernakulam', sizeKw: 45, amount: '₹31.5 L', stage: 'proposal-sent', source: 'Google Ads', type: 'online',       rep: 'Rahul Varma',  age: 6 },
  { id: 'L-1158', name: 'Marian School',     initials: 'MS', color: '#5B6675', dept: 'Commercial', district: 'Kottayam',  sizeKw: 30, amount: '₹21.0 L', stage: 'site-visited',  source: 'Website',    type: 'online',       rep: 'Rahul Varma',  age: 8 },
  { id: 'L-1163', name: 'Travancore Mills',  initials: 'TM', color: '#0E8C86', dept: 'Commercial', district: 'Kollam',    sizeKw: 60, amount: '₹42.0 L', stage: 'advance-paid',  source: 'Referral',   type: 'owner-locked', rep: 'Deepa Thomas', age: 15 },
  { id: 'L-1170', name: 'GreenLeaf Resort',  initials: 'GR', color: '#7C5CFC', dept: 'Commercial', district: 'Idukki',    sizeKw: 25, amount: '₹17.5 L', stage: 'new',           source: 'Google Ads', type: 'online',       rep: 'Deepa Thomas', age: 1 },

  // ── Service ──────────────────────────────────────────────────────────────
  { id: 'L-1180', name: 'Mohan Das',       initials: 'MD', color: '#F26B3A', dept: 'Service', district: 'Ernakulam',  sizeKw: 5, amount: '₹3.4 L', stage: 'commissioned', source: 'Website',    type: 'online', rep: 'Anjali Raj',    age: 40 },
  { id: 'L-1184', name: 'Salim Kumar',     initials: 'SK', color: '#2F6FED', dept: 'Service', district: 'Thrissur',   sizeKw: 6, amount: '₹4.0 L', stage: 'docs',         source: 'Referral',   type: 'online', rep: 'Manoj Kurian',  age: 11 },
  { id: 'L-1190', name: 'Priya Varma',     initials: 'PV', color: '#0E8C86', dept: 'Service', district: 'Trivandrum', sizeKw: 4, amount: '₹2.7 L', stage: 'subsidy',      source: 'Website',    type: 'online', rep: 'Anjali Raj',    age: 9 },
  { id: 'L-1196', name: 'Hari Krishnan',   initials: 'HK', color: '#B97A1C', dept: 'Service', district: 'Palakkad',   sizeKw: 7, amount: '₹4.6 L', stage: 'kseb',         source: 'Google Ads', type: 'online', rep: 'Manoj Kurian',  age: 13 },
]

// Filter dropdown — all 14 canonical lifecycle stages (keys double as
// StatusBadge variants), derived from the config so new stages appear here too.
export const stageOptions = [
  { key: 'all', label: 'All Stages' },
  ...STAGES.map((s) => ({ key: s.key, label: s.label })),
]

export const sourceOptions = [
  { key: 'all', label: 'All Sources' },
  { key: 'Google Ads', label: 'Google Ads' },
  { key: 'Referral', label: 'Referral' },
  { key: 'Website', label: 'Website' },
]

// Department filter for the All Leads table.
export const deptOptions = [
  { key: 'all', label: 'All Departments' },
  ...DEPARTMENTS.map((d) => ({ key: d, label: d })),
]

// Rep filter — derived from the data so every owning rep appears.
export const repOptions = [
  { key: 'all', label: 'All Reps' },
  ...[...new Set(teamLeads.map((l) => l.rep))].map((r) => ({ key: r, label: r })),
]

export const typeOptions = [
  { key: 'all', label: 'All Types' },
  { key: 'online', label: 'Online' },
  { key: 'owner-locked', label: 'Owner-Locked' },
]

// StatusBadge variant -> uppercased label shown in the STAGE column. Derived
// from the canonical 14-stage config; the legacy kebab keys still present in the
// mock rows above are kept so those records keep their exact designed labels.
export const STAGE_LABELS = {
  ...Object.fromEntries(STAGES.map((s) => [s.key, s.label.toUpperCase()])),
  'site-visited': 'SITE VISITED',
  'advance-paid': 'ADVANCE PAID',
  docs: 'DOCS COMPLETE',
  subsidy: 'SUBSIDY FILED',
  kseb: 'KSEB APPROVED',
  commissioned: 'COMMISSIONED',
}
