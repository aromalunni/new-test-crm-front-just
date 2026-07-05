// Mock data for the Admin "Settings" screen — assignment engine, SLA config,
// shift schedule, and gamification tiers. Frontend-only.

// ── Left sub-nav ────────────────────────────────────────────────────────────
// `section` links an item to a stacked section id on the right (for scroll +
// active highlight). Items without a section just toast "coming soon".
export const settingsNav = [
  { key: 'assignment',   label: 'Assignment Engine',         icon: 'Zap',          section: 'assignment' },
  { key: 'sla',          label: 'SLA Configuration',         icon: 'Clock',        section: 'sla' },
  { key: 'gamification', label: 'Gamification Tiers',        icon: 'Trophy',       section: 'gamification' },
  { key: 'shift',        label: 'Shift Schedule',            icon: 'CalendarDays', section: 'shift' },
  { key: 'discount',     label: 'Discount Authority',        icon: 'ShieldCheck' },
  { key: 'integrations', label: 'Integrations (n8n / WhatsApp)', icon: 'Link2' },
  { key: 'users',        label: 'Users & Permissions',       icon: 'Users' },
]

// ── A. Assignment Engine — selectable mode cards ────────────────────────────
export const assignmentModes = [
  {
    key: 'weighted',
    icon: 'Zap',
    title: 'Performance-Weighted Round Robin',
    badge: 'DEFAULT',
    sub: 'Combines performance score + availability + fairest balance + recommended',
    slider: true,
  },
  {
    key: 'availability',
    icon: 'Clock',
    title: 'Pure Availability',
    sub: 'Whoever accepted last lead most recently gets next one.',
  },
  {
    key: 'best',
    icon: 'Trophy',
    title: 'Best Performer First',
    sub: 'Highest scorer always gets first pick. ',
    risk: 'Risk: hoarding.',
  },
]

// ── B. SLA Configuration — 2×2 grid of fields ───────────────────────────────
export const slaFields = [
  { key: 'accept',   label: 'Accept SLA (minutes)',     type: 'input',  value: '15' },
  { key: 'firstcall',label: 'First Call SLA (minutes)', type: 'input',  value: '30' },
  { key: 'maxreass', label: 'Max Reassignments / Lead', type: 'input',  value: '3' },
  { key: 'autoreass',label: 'Auto-reassign on Breach',  type: 'select', value: '✓ Enabled' },
]

// ── C. Shift Schedule — grid table ──────────────────────────────────────────
export const shiftDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const shiftRows = [
  { shift: 'Morning',   time: '09–13', days: ['Ravi', 'Priya', 'Arun', 'Sneha', 'Ravi', 'Priya', 'Anjali'] },
  { shift: 'Afternoon', time: '13–17', days: ['Meera', 'Vinod', 'Sneha', 'Arun', 'Vinod', 'Meera', '—'] },
  { shift: 'Evening',   time: '17–20', days: ['Anjali', 'Anjali', '—', 'Anjali', 'Anjali', '—', '—'] },
  { shift: 'Sunday',    time: '09–14', days: ['—', '—', '—', '—', '—', '—', 'Rahul'] },
]

// ── D. Gamification Tiers — table; `variant` is a StatusBadge key ────────────
export const gamificationTiers = [
  { variant: 'starter',   emoji: '🥉', label: 'STARTER',   threshold: '0 – 2 / month',  boost: 'Base', authority: 'None' },
  { variant: 'active',    emoji: '🥈', label: 'ACTIVE',    threshold: '3 – 5 / month',  boost: '+5%',  authority: 'Up to 5%' },
  { variant: 'performer', emoji: '🥇', label: 'PERFORMER', threshold: '6 – 9 / month',  boost: '+10%', authority: 'Up to 10%' },
  { variant: 'elite',     emoji: '🔥', label: 'ELITE',     threshold: '10+ / month',    boost: '+15%', authority: 'Up to 15%' },
]
