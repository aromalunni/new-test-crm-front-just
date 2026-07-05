// Team Lead dashboard (Ernakulam) — mock data for /lead/dashboard.
// Pipeline counts come from data/pipeline.js (leadErnakulamPipeline); this file
// holds the KPI tiles, team roster rows, and bottleneck alerts for the page.

// Headline KPI tiles (icon resolved to a lucide component in the page).
export const kpis = [
  { id: 'team', icon: 'team', label: 'Team Size — Ernakulam', value: '5 reps' },
  { id: 'active', icon: 'leads', label: 'Active Leads', value: '182', chip: '+8', sub: 'vs last 7 days' },
  { id: 'conv', icon: 'funnel', label: 'Conversions MTD', value: '32', chip: '+12%', sub: 'vs last month' },
  { id: 'resp', icon: 'time', label: 'Avg Response', value: '13 min', pill: 'Healthy' },
]

// Team roster — Ernakulam. `status` maps to a StatusBadge variant; `trend` picks
// the mini sparkline shape/color in the page.
export const roster = [
  { id: 'R-1', name: 'Ravi Kumar', initials: 'RK', color: '#F26B3A', status: 'elite', leads: 58, closed: 12, resp: '8m', score: 94, trend: 'up' },
  { id: 'R-2', name: 'Priya Nair', initials: 'PN', color: '#2F6FED', status: 'performer', leads: 52, closed: 9, resp: '12m', score: 86, trend: 'up' },
  { id: 'R-4', name: 'Arun Menon', initials: 'AM', color: '#F1A33B', status: 'active', leads: 41, closed: 5, resp: '18m', score: 72, trend: 'flat' },
  { id: 'R-5', name: 'Vinod Jose', initials: 'VJ', color: '#7C5CFC', status: 'active', leads: 35, closed: 5, resp: '20m', score: 70, trend: 'up' },
  { id: 'R-9', name: 'Sanjay K', initials: 'SK', color: '#5B6675', status: 'new', leads: 18, closed: 1, resp: '25m', score: 48, trend: 'down' },
]

// Pipeline bottlenecks — colored accent + stage transition + metric.
export const bottlenecks = [
  { id: 'b1', tone: 'orange', title: 'Site Visited → Proposal Sent', sub: 'Average delay: 4.2 days' },
  { id: 'b2', tone: 'amber', title: 'Proposal Sent → Advance Paid', sub: 'Conversion drop: 58%' },
  { id: 'b3', tone: 'red', title: 'New → Contacted', sub: '5 leads past 48h' },
]

// Display labels + explicit funnel percentages (paired by index with
// leadErnakulamPipeline in data/pipeline.js).
export const pipelineLabels = ['New', 'Contacted', 'Site Visit', 'Proposal', 'Advance', 'Docs', 'Subsidy', 'KSEB', 'Commissioned']
export const pipelinePct = [18, 14, 9, 6, 4, 3, 2, 2, 1]

// Mini sparkline series keyed by trend direction.
export const TREND_SERIES = {
  up: [4, 6, 5, 8, 9, 12],
  flat: [6, 6, 7, 6, 7, 6],
  down: [12, 9, 8, 6, 5, 3],
}
