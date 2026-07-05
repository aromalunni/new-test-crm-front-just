// Recent activity feed — shown on dashboards.
// tag: WON | MEETING | AUTO | NOTE | ACCEPTED
//   WON      — a deal closed / commissioned
//   MEETING  — a site visit or customer meeting
//   AUTO     — system-generated (auto-assignment, reminders)
//   NOTE     — a rep logged a note
//   ACCEPTED — a rep accepted an assigned lead
// repId links to reps.js; leadId (when present) links to leads.js.

export const activity = [
  {
    id: 'A-1',
    repId: 'R-1',
    leadId: 'L-1084',
    action: 'Closed Joseph Mathew — 5kW system commissioned in Ernakulam',
    tag: 'WON',
    timeAgo: '12m ago',
  },
  {
    id: 'A-2',
    repId: 'R-2',
    leadId: 'L-1150',
    action: 'Received ₹29,000 advance from Radhika Nair',
    tag: 'WON',
    timeAgo: '38m ago',
  },
  {
    id: 'A-3',
    repId: 'R-6',
    leadId: 'L-1146',
    action: 'Sent proposal to Shabeer Ali for 11kW setup',
    tag: 'NOTE',
    timeAgo: '52m ago',
  },
  {
    id: 'A-4',
    repId: 'R-5',
    leadId: 'L-1154',
    action: 'Completed site visit for Pradeep Kumar in Trivandrum',
    tag: 'MEETING',
    timeAgo: '1h ago',
  },
  {
    id: 'A-5',
    repId: 'R-3',
    leadId: 'L-1138',
    action: 'Auto-assigned new Google Ads lead — Nisha Raj',
    tag: 'AUTO',
    timeAgo: '1h ago',
  },
  {
    id: 'A-6',
    repId: 'R-8',
    leadId: 'L-1135',
    action: 'Accepted assigned lead Biju Pavithran',
    tag: 'ACCEPTED',
    timeAgo: '2h ago',
  },
  {
    id: 'A-7',
    repId: 'R-1',
    leadId: 'L-1112',
    action: 'Logged note: George Varghese reviewing 12kW commercial quote',
    tag: 'NOTE',
    timeAgo: '2h ago',
  },
  {
    id: 'A-8',
    repId: 'R-2',
    leadId: 'L-1123',
    action: 'Booked site visit with Reji Thomas for tomorrow',
    tag: 'MEETING',
    timeAgo: '3h ago',
  },
  {
    id: 'A-9',
    repId: 'R-6',
    leadId: 'L-1170',
    action: 'KSEB approval received for Vijayan Nambiar',
    tag: 'WON',
    timeAgo: '3h ago',
  },
  {
    id: 'A-10',
    repId: 'R-4',
    leadId: 'L-1142',
    action: 'Auto-assigned Facebook lead — Thomas Kurian',
    tag: 'AUTO',
    timeAgo: '4h ago',
  },
  {
    id: 'A-11',
    repId: 'R-5',
    leadId: 'L-1131',
    action: 'Logged note: Deepa Suresh asked for EMI options',
    tag: 'NOTE',
    timeAgo: '4h ago',
  },
  {
    id: 'A-12',
    repId: 'R-7',
    leadId: 'L-1119',
    action: 'Accepted cold-call lead Mohan Das',
    tag: 'ACCEPTED',
    timeAgo: '5h ago',
  },
  {
    id: 'A-13',
    repId: 'R-1',
    leadId: 'L-1194',
    action: 'Received advance from Felix D Souza — 8kW booked',
    tag: 'WON',
    timeAgo: '6h ago',
  },
  {
    id: 'A-14',
    repId: 'R-3',
    leadId: 'L-1182',
    action: 'Logged note: Sulaikha Beevi wants a weekend site visit',
    tag: 'NOTE',
    timeAgo: '7h ago',
  },
  {
    id: 'A-15',
    repId: 'R-6',
    leadId: 'L-1202',
    action: 'Called Noushad K — quoted 7kW over phone',
    tag: 'MEETING',
    timeAgo: '8h ago',
  },
]

// ---- Helpers ----

export function getActivityByRep(repId) {
  return activity.filter((item) => item.repId === repId)
}

export function getActivityByTag(tag) {
  return activity.filter((item) => item.tag === tag)
}

export function getRecentActivity(limit = 10) {
  return activity.slice(0, limit)
}

export default activity
