// Data for the rep "Lead Details" screen (/rep/leads/:id).
// Frontend-only mock. The left-rail list is the canonical set of leads the
// rep can open; the first one (Arun Joseph) is the screenshot default.
// Call rows reuse the same shape as data/calls.js
// (direction | duration | outcome | timeLabel).

// ── Left rail: "My Leads" list ──────────────────────────────────────────────
export const detailLeads = [
  {
    id: 'arun-joseph',
    name: 'Arun Joseph',
    district: 'Kochi',
    stage: 'Interested',
    score: 85,
    phone: '+91 98765 43210',
    location: 'Kochi, Kerala',
    source: 'Website',
    created: '23 Jun 2025',
    owner: 'Ravi Kumar',
    scoreLabel: 'High',
    scoreNote: 'Engagement is high',
    followUp: { date: '28 Jun 2025', time: '11:00 AM', task: 'Call customer and share quotation' },
    calls: [
      { id: 'AJ-1', direction: 'Outgoing', duration: '08:12', outcome: 'Interested', day: 'Today', time: '11:24 AM' },
      { id: 'AJ-2', direction: 'Incoming', duration: '02:51', outcome: 'Callback Requested', day: 'Yesterday', time: '04:35 PM' },
      { id: 'AJ-3', direction: 'Missed', duration: '—', outcome: 'No Answer', day: 'Yesterday', time: '11:10 AM' },
      { id: 'AJ-4', direction: 'Outgoing', duration: '05:18', outcome: 'Not Interested', day: '21 Jun', time: '03:22 PM' },
      { id: 'AJ-5', direction: 'Outgoing', duration: '11:08', outcome: 'Interested', day: '20 Jun', time: '10:05 AM' },
    ],
    notes: [
      {
        id: 'N-1',
        author: 'Ravi Kumar (You)',
        time: 'Today, 11:30 AM',
        text: 'Customer is very interested in the 5kW system. Wants to proceed after checking subsidy eligibility — shared the PM Surya Ghar details.',
        followUp: '28 Jun, 11:00 AM',
        pinned: true,
      },
      {
        id: 'N-2',
        author: 'Ravi Kumar (You)',
        time: 'Yesterday, 4:40 PM',
        text: 'Discussed financing options. Prefers EMI over full payment — need to share loan partner details next call.',
        pinned: false,
      },
      {
        id: 'N-3',
        author: 'Ravi Kumar (You)',
        time: '20 Jun, 10:15 AM',
        text: 'Initial call — found us via the website. Roof is south-facing, good for solar. Asked for a quotation.',
        pinned: false,
      },
    ],
  },
  { id: 'neha-menon', name: 'Neha Menon', district: 'Thrissur', stage: 'Proposal Sent', score: 78 },
  { id: 'sajan-mathew', name: 'Sajan Mathew', district: 'Kollam', stage: 'Contacted', score: 64 },
  { id: 'priya-nair', name: 'Priya Nair', district: 'Trivandrum', stage: 'Site Visited', score: 81 },
  { id: 'vinu-varghese', name: 'Vinu Varghese', district: 'Kottayam', stage: 'New', score: 52 },
  { id: 'ramesh-kumar', name: 'Ramesh Kumar', district: 'Kochi', stage: 'Advance Paid', score: 90 },
  { id: 'deepa-suresh', name: 'Deepa Suresh', district: 'Kannur', stage: 'Contacted', score: 58 },
]

// Total shown in the rail header ("Leads (128) · Sort: Recent").
export const totalLeadCount = 128

// Map a lead stage label → StatusBadge variant (color only; label is overridden).
export const STAGE_VARIANT = {
  New: 'new',
  Contacted: 'contacted',
  'Site Visited': 'site-visited',
  Interested: 'site-visited',
  'Proposal Sent': 'proposal-sent',
  'Advance Paid': 'advance-paid',
}

// Call-outcome → tone for the Call History rows.
export const OUTCOME_TONE = {
  Interested: 'green',
  'Callback Requested': 'amber',
  'No Answer': 'gray',
  'Not Interested': 'red',
}

// Sensible defaults so any lead (only Arun is fully fleshed out) renders without
// gaps. Derived values reuse the lead's own name/district/score.
function withDefaults(lead) {
  const scoreLabel =
    lead.scoreLabel || (lead.score >= 75 ? 'High' : lead.score >= 50 ? 'Medium' : 'Low')
  return {
    phone: '+91 98765 43210',
    location: `${lead.district}, Kerala`,
    source: 'Website',
    created: '23 Jun 2025',
    owner: 'Ravi Kumar',
    scoreLabel,
    scoreNote:
      lead.scoreNote ||
      (lead.score >= 75
        ? 'Engagement is high'
        : lead.score >= 50
          ? 'Engagement is steady'
          : 'Needs follow-up'),
    followUp: lead.followUp || {
      date: '30 Jun 2025',
      time: '10:00 AM',
      task: 'Follow up and share next steps',
    },
    calls: lead.calls || [
      { id: `${lead.id}-c1`, direction: 'Outgoing', duration: '04:20', outcome: 'Interested', day: 'Today', time: '10:00 AM' },
      { id: `${lead.id}-c2`, direction: 'Missed', duration: '—', outcome: 'No Answer', day: 'Yesterday', time: '03:15 PM' },
    ],
    notes: lead.notes || [
      {
        id: `${lead.id}-n1`,
        author: 'Ravi Kumar (You)',
        time: 'Today, 10:05 AM',
        text: `First contact with ${lead.name}. Captured requirements and shared an overview.`,
        pinned: false,
      },
    ],
    ...lead,
  }
}

export function getDetailLead(id) {
  const found = detailLeads.find((l) => l.id === id) || detailLeads[0]
  return withDefaults(found)
}

export default detailLeads
