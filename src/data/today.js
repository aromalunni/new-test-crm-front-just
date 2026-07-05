// "Today's Work" screen data for the CRS rep (Ravi Kumar).
// Frontend-only mock — exact content matches the rep/today screen spec.
// Amounts are full ₹ values; times are 24h "HH:MM" labels.

export const statusStrip = {
  text: 'Within working hours · You are active · Auto-assignment enabled',
}

export const greeting = {
  greeting: 'GOOD MORNING, RAVI',
  headline: "You're on fire — 3-month Elite streak",
  subline: 'Today: 3 follow-ups · 2 new leads · 1 overdue · Est. 4h 30m of work',
  thisMonth: 12,
  tierGoal: 10,
}

export const overdue = {
  id: 'L-1061',
  name: 'Deepa Thomas',
  sizeKw: 3,
  reason: 'Promised call yesterday 16:00 — OVERDUE',
  amount: 211000,
}

export const followUps = [
  { id: 'L-1066', name: 'Vinod Pillai', sizeKw: 10, task: 'Review revised quote', time: '10:30' },
  { id: 'L-1097', name: 'Aswathy Nair', sizeKw: 3, task: 'Confirm site visit Friday', time: '11:15' },
  { id: 'L-1068', name: 'Anil Kumar', sizeKw: 5, task: 'Collect remaining advance', time: '15:00' },
]

export const newLeads = [
  { id: 'L-1091', name: 'Radhika Menon', source: 'Google Ads', sizeKw: 6, timeLeft: '14 min left', secondsLeft: 14 * 60 },
  { id: 'L-1098', name: 'Hari Krishnan', source: 'Website', sizeKw: 6, timeLeft: '9 min left', secondsLeft: 9 * 60 },
]

export const inProgress = [
  {
    id: 'L-1054',
    name: 'Rajesh Chandran',
    sizeKw: 6,
    stage: 'Site Visited',
    suggestion: 'AI suggestion: Prepare proposal — high intent',
  },
  {
    id: 'L-1053',
    name: 'Fathima Beevi',
    sizeKw: 5,
    stage: 'Site Visited',
    suggestion: 'AI suggestion: Send 3 quote options',
  },
]

export const siteVisits = [
  {
    id: 'L-1097',
    name: 'Aswathy Nair',
    location: 'Kollam, Kerala',
    sizeKw: 5,
    time: '14:00',
  },
]

// Footer / summary tallies — same set is shown under follow-ups and in the sticky bar.
export const summary = {
  overdue: 1,
  followUps: 3,
  newLeads: 2,
  visits: 1,
  workLeft: '2h 44m of work today',
}
