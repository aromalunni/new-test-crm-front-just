// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL LIFECYCLE STAGES — single source of truth.
//
// The CRM tracks one customer record across 14 lifecycle stages, exactly as in
// the Goldenray CRM proposal (enquiry → survey → quote → booking → loan →
// installation → subsidy → handover → after-sales). Every screen that renders a
// stage badge, funnel, filter, or step row should resolve labels/colors through
// the helpers below instead of hard-coding its own map.
//
// Each stage:
//   key     – canonical kebab id (also the StatusBadge variant key)
//   label   – full display label (proposal wording)
//   short   – compact code for dense step rows / chips
//   owner   – main department responsible (proposal "Main Owner")
//
// Legacy encodings (Title-Case labels, the old 9 kebab keys, short codes) are
// normalised to a canonical key via ALIASES + normalizeStage(), so existing
// mock data keeps rendering correct badges during the migration.
// ─────────────────────────────────────────────────────────────────────────────

export const STAGES = [
  { key: 'new',                   label: 'New Lead',                short: 'NEW',   owner: 'Sales' },
  { key: 'contacted',             label: 'Contacted',               short: 'CONT',  owner: 'Sales' },
  { key: 'qualified',             label: 'Qualified',               short: 'QUAL',  owner: 'Sales' },
  { key: 'survey-scheduled',      label: 'Survey Scheduled',        short: 'SCHD',  owner: 'Sales / Project Coordination' },
  { key: 'survey-completed',      label: 'Survey Completed',        short: 'SURV',  owner: 'Project / Technical' },
  { key: 'proposal-sent',         label: 'Proposal / Quote Sent',   short: 'QUOTE', owner: 'Sales' },
  { key: 'negotiation',           label: 'Negotiation',             short: 'NEGO',  owner: 'Sales' },
  { key: 'booking-confirmed',     label: 'Booking Confirmed',       short: 'BOOK',  owner: 'Sales / Accounts' },
  { key: 'agreement-generated',   label: 'Agreement Generated',     short: 'AGR',   owner: 'CRM Automation / Sales' },
  { key: 'loan-processing',       label: 'Loan Processing',         short: 'LOAN',  owner: 'Sales / Finance' },
  { key: 'project-execution',     label: 'Project Execution',       short: 'EXEC',  owner: 'Project Team' },
  { key: 'documentation-subsidy', label: 'Documentation & Subsidy', short: 'SUBS',  owner: 'Documentation Team' },
  { key: 'handover-complete',     label: 'Handover Complete',       short: 'HAND',  owner: 'Project / Service' },
  { key: 'after-sales-active',    label: 'After-Sales Active',      short: 'SVC',   owner: 'Service Team' },
]

// Ordered list of just the canonical keys (pipeline order).
export const STAGE_KEYS = STAGES.map((s) => s.key)

// key -> stage object, for O(1) lookups.
const BY_KEY = Object.fromEntries(STAGES.map((s) => [s.key, s]))

// Legacy / alternate encoding -> canonical key. Covers the original 9-stage
// Title-Case labels, the old kebab variant keys, and the short codes used by the
// My Leads step row. Keys are matched case-insensitively (see normalizeStage).
const ALIASES = {
  // already-canonical Title-Case labels
  'new lead': 'new',
  'contacted': 'contacted',
  'qualified': 'qualified',
  'survey scheduled': 'survey-scheduled',
  'survey completed': 'survey-completed',
  'proposal / quote sent': 'proposal-sent',
  'proposal sent': 'proposal-sent',
  'negotiation': 'negotiation',
  'booking confirmed': 'booking-confirmed',
  'agreement generated': 'agreement-generated',
  'loan processing': 'loan-processing',
  'project execution': 'project-execution',
  'documentation & subsidy': 'documentation-subsidy',
  'handover complete': 'handover-complete',
  'after-sales active': 'after-sales-active',

  // legacy 9-stage labels / kebab keys mapped onto the 14-stage model
  'new': 'new',
  'site visited': 'survey-completed',
  'site-visited': 'survey-completed',
  'interested': 'qualified',
  'advance paid': 'booking-confirmed',
  'advance-paid': 'booking-confirmed',
  'docs': 'loan-processing',
  'docs complete': 'loan-processing',
  'subsidy': 'documentation-subsidy',
  'kseb approved': 'project-execution',
  'kseb': 'project-execution',
  'commissioned': 'handover-complete',

  // short codes (My Leads step row)
  'n': 'new',
  'c': 'contacted',
  'sv': 'survey-completed',
  'ps': 'proposal-sent',
  'ap': 'booking-confirmed',
  'dc': 'loan-processing',
  'sf': 'documentation-subsidy',
  'ka': 'project-execution',
  'cm': 'handover-complete',
}

// Resolve any stage encoding (canonical key, Title-Case label, legacy key, or
// short code) to a canonical key. Returns undefined for non-stage statuses
// (e.g. 'stalled', 'lost') so callers can treat those separately.
export function normalizeStage(value) {
  if (!value) return undefined
  const raw = String(value).trim()
  if (BY_KEY[raw]) return raw
  return ALIASES[raw.toLowerCase()]
}

// Full stage object for any encoding, or undefined.
export function stageMeta(value) {
  const key = normalizeStage(value)
  return key ? BY_KEY[key] : undefined
}

// Display label for any encoding. Falls back to the raw value so non-stage
// statuses still render something readable.
export function stageLabel(value) {
  return stageMeta(value)?.label ?? value
}

// StatusBadge variant key for any encoding (canonical key), or 'new' as a
// safe default so a badge always has a colour.
export function stageVariant(value) {
  return normalizeStage(value) ?? 'new'
}

// Compact code for dense rows/chips.
export function stageShort(value) {
  return stageMeta(value)?.short ?? value
}

// Zero-based pipeline position (for ordering / aging), or -1 if not a stage.
export function stageIndex(value) {
  const key = normalizeStage(value)
  return key ? STAGE_KEYS.indexOf(key) : -1
}
