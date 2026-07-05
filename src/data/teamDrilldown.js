// "Performance Drilldown" screen data for the Team Lead (Suresh Jayan) viewing
// an individual rep's deep-dive. Frontend-only mock. Each rep tab resolves to a
// full dataset built from a handful of core numbers, so switching tabs changes
// every chart/table on the page. `all` aggregates the whole Ernakulam team.

import {
  ClipboardList,
  Repeat,
  Clock,
  IndianRupee,
  Trophy,
  Zap,
  CheckCircle2,
} from 'lucide-react'

// 1 — Rep tabs (underline). `all` is the "+ All Team" pseudo-tab.
export const repTabs = [
  { key: 'ravi', label: 'Ravi Kumar' },
  { key: 'priya', label: 'Priya Nair' },
  { key: 'arun', label: 'Arun Menon' },
  { key: 'vinod', label: 'Vinod Jose' },
  { key: 'all', label: '+ All Team' },
]

// Team-wide averages (constant) used for the "vs team" comparisons.
const TEAM = { overall: 15.4, v2p: 62.1, p2w: 50.8 }

const SOURCE_META = [
  { name: 'Website', ratio: 0.42, color: '#F26B3A' },
  { name: 'Referral', ratio: 0.28, color: '#2F6FED' },
  { name: 'Facebook', ratio: 0.15, color: '#1FA463' },
  { name: 'Walk-in', ratio: 0.1, color: '#F1A33B' },
  { name: 'Others', ratio: 0.05, color: '#94A3B8' },
]

const STATUS_META = [
  { name: 'New', ratio: 0.45, color: '#2F6FED' },
  { name: 'Contacted', ratio: 0.25, color: '#F1A33B' },
  { name: 'Proposal Sent', ratio: 0.15, color: '#7C5CD6' },
  { name: 'Negotiation', ratio: 0.1, color: '#F26B3A' },
  { name: 'Won', ratio: 0.05, color: '#1FA463' },
]

const TREND_LABELS = [
  '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun',
  '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun',
]
const PERS_OFFSET = [3, 2, 1, 2, 0, 1, -1, 0, -2, 0, -1, 1, -1, 0, 0]
const TEAM_TREND = [14, 13, 14, 12, 13, 15, 13, 12, 14, 13, 12, 14, 13, 12, 13]

const ACT_BASE = [
  { date: '18 Apr', l: 9, c: 20, v: 2, p: 2, co: 0, rev: 6.4 },
  { date: '19 Apr', l: 6, c: 16, v: 0, p: 1, co: 1, rev: 6.7 },
  { date: '20 Apr', l: 8, c: 13, v: 0, p: 2, co: 1, rev: 3.1 },
  { date: '21 Apr', l: 9, c: 19, v: 1, p: 2, co: 0, rev: 5.7 },
  { date: '22 Apr', l: 7, c: 21, v: 1, p: 1, co: 1, rev: 5.2 },
  { date: '23 Apr', l: 5, c: 21, v: 2, p: 1, co: 0, rev: 6.6 },
  { date: '24 Apr', l: 5, c: 19, v: 1, p: 2, co: 1, rev: 5.9 },
]

const pct1 = (a, b) => (b ? ((a / b) * 100).toFixed(1) : '0.0')

// Split a total into segments by ratio, last segment absorbs the rounding drift.
function split(total, meta) {
  let used = 0
  return meta.map((m, i) => {
    const value = i === meta.length - 1 ? total - used : Math.round(total * m.ratio)
    used += value
    return { name: m.name, value, color: m.color }
  })
}

function spark(end) {
  const out = []
  for (let i = 9; i >= 0; i -= 1) out.push(Math.max(1, Math.round(end - i * 0.9)))
  return out
}

function buildRep(cfg) {
  const { leads, called, visits, proposals, closed, resp, revenue, slaBase } = cfg
  const factor = leads / 58
  const overall = Number(pct1(closed, leads))
  const v2p = Number(pct1(proposals, visits))
  const p2w = Number(pct1(closed, proposals))

  return {
    header: {
      name: cfg.name,
      initials: cfg.initials,
      color: cfg.color,
      badges: cfg.badges,
      quote: cfg.quote,
      score: cfg.score,
      scoreDelta: String(cfg.scoreDelta),
      scoreNote: 'vs last 14 days',
    },
    kpis: [
      { id: 'leads', label: 'Leads Handled', value: String(leads), delta: cfg.d.leads, dir: 'up', note: 'vs last 14 days', icon: ClipboardList },
      { id: 'conv', label: 'Conversions', value: String(closed), delta: cfg.d.conv, dir: 'up', note: 'vs last 14 days', icon: Repeat },
      { id: 'resp', label: 'Response Time', value: `${resp}m`, delta: cfg.d.resp, dir: 'down', note: 'vs last 14 days', icon: Clock },
      { id: 'rev', label: 'Revenue', value: `₹${revenue.toFixed(1)} L`, delta: cfg.d.rev, dir: 'up', note: 'vs last 14 days', icon: IndianRupee },
    ],
    personalFunnel: [
      { label: 'Leads', value: leads, pct: 100 },
      { label: 'Called', value: called, pct: Math.round((called / leads) * 100) },
      { label: 'Visits', value: visits, pct: Math.round((visits / leads) * 100) },
      { label: 'Proposals', value: proposals, pct: Math.round((proposals / leads) * 100) },
      { label: 'Closed', value: closed, pct: Math.round((closed / leads) * 100) },
    ],
    conversionRate: {
      value: `${overall}%`,
      teamAvg: `vs team avg ${TEAM.overall}%`,
      spark: spark(overall),
    },
    responseTrend: {
      series: [
        { key: 'personal', color: '#F26B3A', label: `Personal avg: ${resp}m` },
        { key: 'team', color: '#94A3B8', label: 'Team avg: 13m', dash: true },
      ],
      data: TREND_LABELS.map((label, i) => ({
        label,
        personal: Math.max(2, resp + PERS_OFFSET[i]),
        team: TEAM_TREND[i],
      })),
    },
    activityLog: ACT_BASE.map((r, i) => ({
      id: `a${i}`,
      date: r.date,
      leads: Math.max(1, Math.round(r.l * factor)),
      calls: Math.max(1, Math.round(r.c * factor)),
      visits: r.v,
      proposals: r.p,
      conversions: r.co,
      revenue: `₹${(r.rev * factor).toFixed(1)} L`,
      sla: Math.min(99, slaBase + (i % 4) * 2),
    })),
    leadSources: {
      centerValue: String(leads),
      centerCaption: 'Total Leads',
      data: split(leads, SOURCE_META),
    },
    leadStatus: {
      centerValue: String(leads),
      centerCaption: 'Total Leads',
      data: split(leads, STATUS_META),
    },
    conversionTiles: [
      { id: 'overall', label: 'Overall Conversion Rate', value: `${overall}%`, delta: `${(overall - TEAM.overall).toFixed(1)}%`, teamAvg: `vs team ${TEAM.overall}%` },
      { id: 'v2p', label: 'Visit to Proposal', value: `${v2p}%`, delta: `${(v2p - TEAM.v2p).toFixed(1)}%`, teamAvg: `vs team ${TEAM.v2p}%` },
      { id: 'p2w', label: 'Proposal to Win', value: `${p2w}%`, delta: `${(p2w - TEAM.p2w).toFixed(1)}%`, teamAvg: `vs team ${TEAM.p2w}%` },
      { id: 'l2w', label: 'Lead to Win', value: `${overall}%`, delta: `${(overall - TEAM.overall).toFixed(1)}%`, teamAvg: `vs team ${TEAM.overall}%` },
    ],
    conversionFunnel: [
      { label: 'Leads', value: leads, pct: 100 },
      { label: 'Called', value: called, pct: Number(pct1(called, leads)) },
      { label: 'Visits', value: visits, pct: Number(pct1(visits, called)) },
      { label: 'Proposals', value: proposals, pct: Number(pct1(proposals, visits)) },
      { label: 'Won', value: closed, pct: Number(pct1(closed, proposals)) },
    ],
    coachingNotes: cfg.notes,
    achievements: cfg.achievements,
    wonDeals: cfg.wonDeals,
  }
}

const RAVI = buildRep({
  name: 'Ravi Kumar', initials: 'RK', color: '#F26B3A',
  badges: '🔥 ELITE · Ernakulam Team · 3-month streak 🔥',
  quote: 'Consistency over streaks — one call at a time.',
  score: 94, scoreDelta: 8,
  leads: 58, called: 142, visits: 24, proposals: 18, closed: 12, resp: 8, revenue: 42.0, slaBase: 85,
  d: { leads: '12%', conv: '9%', resp: '2m', rev: '18%' },
  notes: [
    { id: 'n1', date: '12 Apr', author: 'Suresh Jayan', text: 'Great recovery on Malabar Villas lead. Consider shadowing for newer reps.' },
    { id: 'n2', date: '5 Apr', author: 'Suresh Jayan', text: 'Follow up on 2 stalled proposals. Push client call by Friday.' },
    { id: 'n3', date: '28 Mar', author: 'Suresh Jayan', text: 'Good job maintaining response time!' },
  ],
  achievements: [
    { id: 'ach1', icon: Trophy, tone: 'amber', text: 'Closed 5+ deals in a week', date: '21 Apr 2025' },
    { id: 'ach2', icon: Zap, tone: 'blue', text: 'Maintained 90%+ SLA for 7 days', date: '19 Apr 2025' },
    { id: 'ach3', icon: CheckCircle2, tone: 'green', text: 'Top performer in conversion rate', date: '16 Apr 2025' },
  ],
  wonDeals: [
    { id: 'L-1084', lead: 'L-1084', customer: 'Malabar Villas', size: '6kW', close: '22 Apr 2025', revenue: '₹2.1 L' },
    { id: 'L-1096', lead: 'L-1096', customer: 'Thomas Residence', size: '8kW', close: '19 Apr 2025', revenue: '₹2.2 L' },
    { id: 'L-1068', lead: 'L-1068', customer: 'Greenview Apartments', size: '5kW', close: '14 Apr 2025', revenue: '₹1.8 L' },
  ],
})

const PRIYA = buildRep({
  name: 'Priya Nair', initials: 'PN', color: '#2F6FED',
  badges: '⭐ PERFORMER · Ernakulam Team · steady',
  quote: 'Listen first, pitch second.',
  score: 88, scoreDelta: 5,
  leads: 49, called: 118, visits: 20, proposals: 15, closed: 9, resp: 11, revenue: 33.5, slaBase: 82,
  d: { leads: '7%', conv: '6%', resp: '1m', rev: '11%' },
  notes: [
    { id: 'n1', date: '11 Apr', author: 'Suresh Jayan', text: 'Strong rapport with referral leads. Convert quicker on warm proposals.' },
    { id: 'n2', date: '2 Apr', author: 'Suresh Jayan', text: 'Tighten follow-up window to under 12 minutes.' },
    { id: 'n3', date: '25 Mar', author: 'Suresh Jayan', text: 'Excellent documentation on Kakkanad deals.' },
  ],
  achievements: [
    { id: 'ach1', icon: Trophy, tone: 'amber', text: 'Highest referral conversion this month', date: '20 Apr 2025' },
    { id: 'ach2', icon: CheckCircle2, tone: 'green', text: 'Zero dropped leads in 2 weeks', date: '15 Apr 2025' },
    { id: 'ach3', icon: Zap, tone: 'blue', text: 'Fastest proposal turnaround', date: '9 Apr 2025' },
  ],
  wonDeals: [
    { id: 'L-1102', lead: 'L-1102', customer: 'Kakkanad Heights', size: '7kW', close: '20 Apr 2025', revenue: '₹2.4 L' },
    { id: 'L-1077', lead: 'L-1077', customer: 'Pillai Residence', size: '5kW', close: '12 Apr 2025', revenue: '₹1.7 L' },
    { id: 'L-1059', lead: 'L-1059', customer: 'Marine Apartments', size: '6kW', close: '6 Apr 2025', revenue: '₹1.9 L' },
  ],
})

const ARUN = buildRep({
  name: 'Arun Menon', initials: 'AM', color: '#1FA463',
  badges: '✅ ACTIVE · Ernakulam Team',
  quote: 'Every site visit is a story.',
  score: 79, scoreDelta: 4,
  leads: 41, called: 96, visits: 16, proposals: 11, closed: 7, resp: 13, revenue: 24.8, slaBase: 78,
  d: { leads: '5%', conv: '4%', resp: '1m', rev: '8%' },
  notes: [
    { id: 'n1', date: '10 Apr', author: 'Suresh Jayan', text: 'Good site-visit conversion. Work on proposal speed.' },
    { id: 'n2', date: '1 Apr', author: 'Suresh Jayan', text: 'Two leads idle 5+ days — re-engage this week.' },
    { id: 'n3', date: '24 Mar', author: 'Suresh Jayan', text: 'Nice teamwork supporting Vinod on Aluva cluster.' },
  ],
  achievements: [
    { id: 'ach1', icon: CheckCircle2, tone: 'green', text: 'Most site visits this fortnight', date: '18 Apr 2025' },
    { id: 'ach2', icon: Zap, tone: 'blue', text: 'Improved response time by 3m', date: '11 Apr 2025' },
    { id: 'ach3', icon: Trophy, tone: 'amber', text: 'First commissioned deal of the month', date: '7 Apr 2025' },
  ],
  wonDeals: [
    { id: 'L-1090', lead: 'L-1090', customer: 'Aluva Greens', size: '5kW', close: '17 Apr 2025', revenue: '₹1.6 L' },
    { id: 'L-1063', lead: 'L-1063', customer: 'Menon Villa', size: '4kW', close: '9 Apr 2025', revenue: '₹1.4 L' },
    { id: 'L-1041', lead: 'L-1041', customer: 'Riverside Homes', size: '6kW', close: '3 Apr 2025', revenue: '₹1.8 L' },
  ],
})

const VINOD = buildRep({
  name: 'Vinod Jose', initials: 'VJ', color: '#7C5CD6',
  badges: '✅ ACTIVE · Ernakulam Team · rising',
  quote: 'Follow-ups win deals.',
  score: 73, scoreDelta: 6,
  leads: 37, called: 88, visits: 14, proposals: 9, closed: 6, resp: 14, revenue: 21.2, slaBase: 75,
  d: { leads: '9%', conv: '7%', resp: '2m', rev: '13%' },
  notes: [
    { id: 'n1', date: '9 Apr', author: 'Suresh Jayan', text: 'Big improvement in follow-up discipline. Keep it up.' },
    { id: 'n2', date: '31 Mar', author: 'Suresh Jayan', text: 'Aim for one extra site visit per day.' },
    { id: 'n3', date: '23 Mar', author: 'Suresh Jayan', text: 'Watch SLA on evening enquiries.' },
  ],
  achievements: [
    { id: 'ach1', icon: Zap, tone: 'blue', text: 'Most improved rep this month', date: '16 Apr 2025' },
    { id: 'ach2', icon: CheckCircle2, tone: 'green', text: '7-day active streak', date: '10 Apr 2025' },
    { id: 'ach3', icon: Trophy, tone: 'amber', text: 'First 5kW+ close', date: '4 Apr 2025' },
  ],
  wonDeals: [
    { id: 'L-1085', lead: 'L-1085', customer: 'Jose Residence', size: '5kW', close: '15 Apr 2025', revenue: '₹1.6 L' },
    { id: 'L-1058', lead: 'L-1058', customer: 'Tripunithura Flats', size: '4kW', close: '8 Apr 2025', revenue: '₹1.3 L' },
    { id: 'L-1037', lead: 'L-1037', customer: 'Hilltop Villas', size: '6kW', close: '2 Apr 2025', revenue: '₹1.7 L' },
  ],
})

const ALL = buildRep({
  name: 'Ernakulam Team', initials: 'ET', color: '#0E1B2E',
  badges: 'Ernakulam Team · 4 reps · combined',
  quote: 'One team, one target.',
  score: 84, scoreDelta: 6,
  leads: 185, called: 444, visits: 74, proposals: 53, closed: 34, resp: 11, revenue: 121.5, slaBase: 80,
  d: { leads: '8%', conv: '7%', resp: '2m', rev: '13%' },
  notes: [
    { id: 'n1', date: '12 Apr', author: 'Suresh Jayan', text: 'Team converting referrals well — push online-lead speed next.' },
    { id: 'n2', date: '4 Apr', author: 'Suresh Jayan', text: '6 leads stalled across reps. Daily standup to clear the backlog.' },
    { id: 'n3', date: '27 Mar', author: 'Suresh Jayan', text: 'Great month — revenue up 14% over target.' },
  ],
  achievements: [
    { id: 'ach1', icon: Trophy, tone: 'amber', text: 'Team beat monthly revenue target', date: '21 Apr 2025' },
    { id: 'ach2', icon: Zap, tone: 'blue', text: 'Avg response time under 12m', date: '17 Apr 2025' },
    { id: 'ach3', icon: CheckCircle2, tone: 'green', text: '34 deals closed this cycle', date: '14 Apr 2025' },
  ],
  wonDeals: [
    { id: 'L-1102', lead: 'L-1102', customer: 'Kakkanad Heights', size: '7kW', close: '20 Apr 2025', revenue: '₹2.4 L' },
    { id: 'L-1096', lead: 'L-1096', customer: 'Thomas Residence', size: '8kW', close: '19 Apr 2025', revenue: '₹2.2 L' },
    { id: 'L-1084', lead: 'L-1084', customer: 'Malabar Villas', size: '6kW', close: '22 Apr 2025', revenue: '₹2.1 L' },
  ],
})

export const reps = { ravi: RAVI, priya: PRIYA, arun: ARUN, vinod: VINOD, all: ALL }
