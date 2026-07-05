// "My Leads" screen data for the CRS rep (Ravi Kumar).
// Frontend-only mock — a small curated set matching the rep/leads screen spec.
// (The richer, general-purpose dataset lives in leads.js and feeds the
// future All-Leads screens; this file is scoped to the rep's own pipeline.)
// IDs are reused from today.js where the same person appears, so the two rep
// screens stay consistent (Rajesh = L-1054, Anil = L-1068).

// Pipeline stages, in order. Each lead sits at one of these codes; the
// stage-step row fills every pill up to and including the current one.
export const stages = ['N', 'C', 'SV', 'PS', 'AP', 'DC', 'SF', 'KA', 'CM']

// Stage filter pills shown above the list. Counts are illustrative — selecting
// a tab is a visual highlight only (the small mock set is always shown).
export const stageTabs = [
  { key: 'all', label: 'All', count: 3 },
  { key: 'new', label: 'New', count: 0 },
  { key: 'contacted', label: 'Contacted', count: 1 },
  { key: 'proposal', label: 'Proposal', count: 1 },
  { key: 'stalled', label: 'Stalled', count: 0 },
]

// Two ownership buckets, each a collapsible section of lead cards.
// `icon`/`tone` are resolved to lucide components in the page.
// Chips: { tone: 'green' | 'orange', icon, label } — icon is a key mapped in the page.
// actions: ordered list of button keys ('call' | 'wa' | 'sched').
export const sections = [
  {
    key: 'online',
    icon: 'globe',
    tone: 'blue',
    title: 'Online · System-Assigned',
    sub: 'Leads from Google Ads, Facebook, Website. SLA-tracked.',
    leads: [
      {
        id: 'L-1054',
        name: 'Rajesh Chandran',
        district: 'Ernakulam',
        sizeKw: 6,
        amount: '₹4.1 L',
        stage: 'SV',
        chips: [{ tone: 'orange', icon: 'send', label: 'Send proposal' }],
        actions: ['call', 'wa'],
      },
      {
        id: 'L-1068',
        name: 'Anil Kumar',
        district: 'Ernakulam',
        sizeKw: 5,
        amount: '₹3.4 L',
        stage: 'AP',
        chips: [
          { tone: 'green', icon: 'check', label: 'Advance' },
          { tone: 'orange', icon: 'clipboard', label: 'Collect remaining documents' },
        ],
        actions: ['call', 'sched'],
      },
    ],
  },
  {
    key: 'sourced',
    icon: 'user',
    tone: 'ink',
    title: 'My Sourced · Manual / Referral',
    sub: 'Owner locked. Only you can share these leads.',
    leads: [
      {
        id: 'L-1080',
        name: 'Biju Paul',
        district: 'Ernakulam',
        sizeKw: 8,
        amount: '₹5.4 L',
        stage: 'KA',
        chips: [
          { tone: 'green', icon: 'zap', label: 'KSEB OK' },
          { tone: 'orange', icon: 'wrench', label: 'Schedule installation' },
        ],
        actions: ['call', 'sched'],
      },
    ],
  },
]
