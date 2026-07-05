// "Unclosed Leads" screen data for the Team Lead (Suresh Jayan).
// Frontend-only mock — unclosed leads assigned to CRS reps that have stalled
// and can be claimed or reassigned by the Team Lead.

// Left-column filter chips. `key` drives the (visual) stall filter.
export const filterTabs = [
  { key: 'all', label: 'All unclosed' },
  { key: 's3', label: 'Stalled 3+ days' },
  { key: 's7', label: 'Stalled 7+ days' },
  { key: 's14', label: 'Stalled 14+ days' },
]

// Stage badge tones: site visited = in-progress (orange), stalled = red.
export const leads = [
  {
    id: 'U-1054',
    name: 'Rajesh Chandran',
    district: 'Ernakulam',
    sizeKw: 6,
    source: 'Google Ads',
    stage: 'SITE VISITED',
    badge: 'orange',
    days: 4,
    owner: 'Ravi Kumar',
    amount: '₹4.1 L',
    locked: false,
  },
  {
    id: 'U-1071',
    name: 'Deepa Thomas',
    district: 'Thrissur',
    sizeKw: 3,
    source: 'Facebook',
    stage: 'STALLED',
    badge: 'red',
    days: 18,
    owner: 'Rahul Varma',
    amount: '₹2.1 L',
    locked: false,
  },
  {
    id: 'U-1088',
    name: 'Fathima Beevi',
    district: 'Ernakulam',
    sizeKw: 5,
    source: 'Website',
    stage: 'SITE VISITED',
    badge: 'orange',
    days: 3,
    owner: 'Vinod Jose',
    amount: '₹3.4 L',
    locked: false,
  },
  {
    id: 'U-1054b',
    name: 'Rajesh Chandran',
    district: 'Ernakulam',
    sizeKw: 6,
    source: 'Google Ads',
    stage: 'SITE VISITED',
    badge: 'orange',
    days: 4,
    owner: 'Ravi Kumar',
    amount: '₹4.1 L',
    locked: false,
  },
  {
    id: 'U-1071b',
    name: 'Deepa Thomas',
    district: 'Thrissur',
    sizeKw: 3,
    source: 'Facebook',
    stage: 'STALLED',
    badge: 'red',
    days: 18,
    owner: 'Rahul Varma',
    amount: '₹2.1 L',
    locked: false,
  },
]

// Right-side donut: a single orange arc at 68% over a faint track.
export const workload = {
  centerValue: '68%',
  centerCaption: 'BALANCED',
  note: 'Avg 36 leads per rep. No rep overloaded.',
  data: [
    { name: 'Balanced', value: 68, color: '#F26B3A' },
    { name: 'Headroom', value: 32, color: '#F1E4DE' },
  ],
}

// Right-side quick stats — label + count.
export const quickStats = [
  { key: 's3', label: 'Unclosed 3+ days', value: 3 },
  { key: 's7', label: 'Unclosed 7+ days', value: 1 },
  { key: 's14', label: 'Unclosed 14+ days', value: 1 },
]
