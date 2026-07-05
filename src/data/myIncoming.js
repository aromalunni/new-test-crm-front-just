// "Incoming Queue" screen data for the CRS rep (Ravi Kumar).
// Frontend-only mock — curated to match the rep/incoming screen spec.
// IDs are reused from today.js where the same person appears so the rep
// screens stay consistent (Hari = L-1098, Radhika = L-1091).

// Stage filter pills above the queue. Counts are illustrative — selecting a
// tab is a visual highlight only (the small mock set is always shown).
export const stageTabs = [
  { key: 'all', label: 'All', count: 1 },
  { key: 'new', label: 'New', count: 0 },
  { key: 'contacted', label: 'Contacted', count: 1 },
  { key: 'proposal', label: 'Proposal', count: 1 },
  { key: 'stalled', label: 'Stalled', count: 0 },
]

// The lead currently in focus (the big left card). secondsLeft drives the
// CountdownRing; the SLA window is 6 minutes.
export const focus = {
  id: 'L-1098',
  name: 'Hari Krishnan',
  source: 'WEBSITE LEAD',
  district: 'Thrissur, Kerala',
  sizeKw: 6,
  phone: '+91 70123 45678',
  systemLabel: '6kW Residential',
  estAmount: 'Est. ₹3.9 L',
  secondsLeft: 6 * 60,
}

// The rest of the queue (right column compact cards).
export const queue = [
  {
    id: 'L-1091',
    name: 'Radhika Menon',
    initials: 'RM',
    district: 'Ernakulam',
    sizeKw: 6,
    source: 'Google Ads',
    time: '12:00',
  },
  {
    id: 'L-1099',
    name: 'Pradeep Varma',
    initials: 'PV',
    district: 'Ernakulam',
    sizeKw: 5,
    source: 'Google Ads',
    time: '12:45',
  },
]
