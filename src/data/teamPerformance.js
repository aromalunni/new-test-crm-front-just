// Mock data for the Admin "Team Performance" screen — leaderboard, conversion
// funnel, response-time trend, and commission payouts. Frontend-only.

import { reps } from './reps.js'

const repByName = Object.fromEntries(reps.map((r) => [r.name, r]))
function repMeta(name) {
  const r = repByName[name]
  return { rep: name, repInitials: r?.initials, repColor: r?.avatarColor }
}

// ── Block 2 — champion + challenge ──────────────────────────────────────────
export const champion = {
  ...repMeta('Ravi Kumar'),
  tier: 'elite',
  badges: ['ELITE', '3 MONTH STREAK'],
  stats: [
    { label: 'Conversions', value: '12' },
    { label: 'Revenue', value: '₹42.0 L' },
    { label: 'Score', value: '94' },
  ],
}

export const challenge = {
  title: 'Close 40 deals → unlock ₹5,00,000 bonus pool',
  closed: 18,
  target: 40,
  note: 'Every rep must contribute 1 conversion to qualify.',
}

// ── Block 3 — rep leaderboard ───────────────────────────────────────────────
// tier is a StatusBadge variant key; revenueValue drives numeric sort.
export const leaderboardRows = [
  { rank: 1, ...repMeta('Ravi Kumar'),    tier: 'elite',     leads: 58, calls: 142, visits: 24, proposals: 18, conv: 12, convPct: 21, resp: 8,  revenue: '₹42.0 L', revenueValue: 42.0, score: 94 },
  { rank: 2, ...repMeta('Priya Nair'),    tier: 'performer', leads: 52, calls: 120, visits: 18, proposals: 14, conv: 9,  convPct: 17, resp: 12, revenue: '₹38.0 L', revenueValue: 38.0, score: 86 },
  { rank: 3, ...repMeta('Meera Rajan'),   tier: 'performer', leads: 46, calls: 102, visits: 15, proposals: 12, conv: 7,  convPct: 15, resp: 14, revenue: '₹27.0 L', revenueValue: 27.0, score: 81 },
  { rank: 4, ...repMeta('Arun Menon'),    tier: 'active',    leads: 41, calls: 88,  visits: 12, proposals: 9,  conv: 5,  convPct: 15, resp: 18, revenue: '₹19.0 L', revenueValue: 19.0, score: 72 },
  { rank: 5, ...repMeta('Vinod Jose'),    tier: 'active',    leads: 35, calls: 72,  visits: 11, proposals: 7,  conv: 5,  convPct: 14, resp: 20, revenue: '₹18.0 L', revenueValue: 18.0, score: 70 },
  { rank: 6, ...repMeta('Sneha Thomas'),  tier: 'active',    leads: 38, calls: 79,  visits: 10, proposals: 8,  conv: 4,  convPct: 13, resp: 22, revenue: '₹15.0 L', revenueValue: 15.0, score: 68 },
  { rank: 7, ...repMeta('Rahul Varma'),   tier: 'starter',   leads: 34, calls: 45,  visits: 6,  proposals: 5,  conv: 3,  convPct: 8,  resp: 9,  revenue: '₹7.8 L',  revenueValue: 7.8,  score: 54 },
  { rank: 8, ...repMeta('Anjali Pillai'), tier: 'starter',   leads: 18, calls: 32,  visits: 3,  proposals: 2,  conv: 1,  convPct: 6,  resp: 40, revenue: '₹4.2 L',  revenueValue: 4.2,  score: 48 },
]

export const TIER_LABELS = {
  elite: 'ELITE',
  performer: 'PERFORMER',
  active: 'ACTIVE',
  starter: 'STARTER',
}

// ── Block 4 left — conversion funnel (top 5 reps) ───────────────────────────
// Each rep's bar splits into 4 stacked segments. Legend order matches FUNNEL_LEGEND.
export const FUNNEL_LEGEND = [
  { key: 'leads', label: 'Leads', color: '#2F6FED' },
  { key: 'proposals', label: 'Proposals', color: '#F1A33B' },
  { key: 'visits', label: 'Visits', color: '#F26B3A' },
  { key: 'closed', label: 'Closed', color: '#1FA463' },
]

export const funnelReps = ['Ravi Kumar', 'Priya Nair', 'Arun Menon', 'Sneha Thomas', 'Meera Rajan'].map(
  (name) => {
    const row = leaderboardRows.find((r) => r.rep === name)
    return {
      ...repMeta(name),
      segments: {
        leads: row.leads,
        proposals: row.proposals,
        visits: row.visits,
        closed: row.conv,
      },
    }
  },
)

// ── Block 4 right — response-time trend (last 14 days, 12–25 Apr) ────────────
export const responseTrend = [
  { label: '12', value: 18 },
  { label: '13', value: 17 },
  { label: '14', value: 16 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 14 },
  { label: '18', value: 13 },
  { label: '19', value: 15 },
  { label: '20', value: 14 },
  { label: '21', value: 12 },
  { label: '22', value: 13 },
  { label: '23', value: 14 },
  { label: '24', value: 13 },
  { label: '25', value: 12 },
]
export const responseTeamAvg = 14
export const responseTarget = 15

// ── Block 5 — monthly commission payouts ────────────────────────────────────
export const commissionRows = [
  { ...repMeta('Ravi Kumar'),   tier: 'elite',     base: '₹60,000', boost: '+15%', streak: '+2%', streakFire: true,  total: '₹70,200', totalValue: 70200, status: 'APPROVED' },
  { ...repMeta('Priya Nair'),   tier: 'performer', base: '₹45,000', boost: '+10%', streak: '—',   streakFire: false, total: '₹49,500', totalValue: 49500, status: 'APPROVED' },
  { ...repMeta('Arun Menon'),   tier: 'active',    base: '₹25,000', boost: '+5%',  streak: '—',   streakFire: false, total: '₹26,250', totalValue: 26250, status: 'APPROVED' },
  { ...repMeta('Sneha Thomas'), tier: 'active',    base: '₹20,000', boost: '+5%',  streak: '—',   streakFire: false, total: '₹21,000', totalValue: 21000, status: 'APPROVED' },
  { ...repMeta('Rahul Varma'),  tier: 'starter',   base: '₹10,000', boost: '+0%',  streak: '—',   streakFire: false, total: '₹10,000', totalValue: 10000, status: 'APPROVED' },
  { ...repMeta('Meera Rajan'),  tier: 'performer', base: '₹35,000', boost: '+10%', streak: '—',   streakFire: false, total: '₹38,500', totalValue: 38500, status: 'APPROVED' },
]

// ── TV Leaderboard — bottom highlight ticker ────────────────────────────────
// Each cell shows an icon + a bold lead line and a softer trailing detail.
export const tvTicker = [
  { icon: 'User',       lead: 'Ravi Kumar closed 12kW',         rest: 'System in Kochi' },
  { icon: 'Flame',      lead: 'Priya Nair now at 12 conversions', rest: '(Performer tier)' },
  { icon: 'TrendingUp', lead: 'Team Kollam up 18%',             rest: 'this week' },
  { icon: 'Trophy',     lead: 'Champion spotlight: Ravi Kumar', rest: '' },
]

// ── Badges tab — achievement grid (not detailed in spec; reasonable mock) ────
export const badges = [
  { id: 'top-closer', icon: 'Trophy', tone: 'amber',  title: 'Top Closer',    holder: 'Ravi Kumar',   note: '12 conversions this month' },
  { id: 'speed',      icon: 'Zap',    tone: 'orange', title: 'Speed Demon',   holder: 'Rahul Varma',  note: 'Fastest 9 min avg response' },
  { id: 'streak',     icon: 'Flame',  tone: 'red',    title: 'Streak Master', holder: 'Ravi Kumar',   note: '3-month winning streak' },
  { id: 'rev',        icon: 'IndianRupee', tone: 'green', title: 'Revenue King', holder: 'Ravi Kumar', note: '₹42.0 L booked' },
  { id: 'rising',     icon: 'TrendingUp', tone: 'blue', title: 'Rising Star',  holder: 'Meera Rajan',  note: '+6 ranks since March' },
  { id: 'visits',     icon: 'MapPin', tone: 'indigo', title: 'Field Leader',  holder: 'Priya Nair',   note: '18 site visits logged' },
]
