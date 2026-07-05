// Sales reps (CRS) — Kerala solar team.
// Tiers: Elite > Performer > Active > Starter (by performance score).
// status: active | break | offline | field
// revenue is in ₹ Lakhs. avatarColor is a hex used for avatar backgrounds.

export const reps = [
  {
    id: 'R-1',
    name: 'Ravi Kumar',
    initials: 'RK',
    tier: 'Elite',
    score: 94,
    conversions: 38,
    revenue: 142.5,
    district: 'Ernakulam',
    shift: 'Morning',
    status: 'field',
    streakMonths: 3,
    avatarColor: '#F26B3A',
  },
  {
    id: 'R-2',
    name: 'Priya Nair',
    initials: 'PN',
    tier: 'Performer',
    score: 86,
    conversions: 31,
    revenue: 118.2,
    district: 'Thrissur',
    shift: 'Morning',
    status: 'active',
    streakMonths: 1,
    avatarColor: '#2F6FED',
  },
  {
    id: 'R-3',
    name: 'Meera Rajan',
    initials: 'MR',
    tier: 'Performer',
    score: 81,
    conversions: 28,
    revenue: 104.7,
    district: 'Kollam',
    shift: 'Evening',
    status: 'active',
    streakMonths: 0,
    avatarColor: '#1FA463',
  },
  {
    id: 'R-4',
    name: 'Arun Menon',
    initials: 'AM',
    tier: 'Active',
    score: 72,
    conversions: 22,
    revenue: 81.4,
    district: 'Alappuzha',
    shift: 'Morning',
    status: 'break',
    streakMonths: 0,
    avatarColor: '#F1A33B',
  },
  {
    id: 'R-5',
    name: 'Vinod Jose',
    initials: 'VJ',
    tier: 'Active',
    score: 70,
    conversions: 21,
    revenue: 77.9,
    district: 'Trivandrum',
    shift: 'Evening',
    status: 'field',
    streakMonths: 0,
    avatarColor: '#7C5CFC',
  },
  {
    id: 'R-6',
    name: 'Sneha Thomas',
    initials: 'ST',
    tier: 'Active',
    score: 68,
    conversions: 19,
    revenue: 71.3,
    district: 'Kozhikode',
    shift: 'Morning',
    status: 'active',
    streakMonths: 0,
    avatarColor: '#E0533D',
  },
  {
    id: 'R-7',
    name: 'Rahul Varma',
    initials: 'RV',
    tier: 'Starter',
    score: 54,
    conversions: 12,
    revenue: 44.6,
    district: 'Palakkad',
    shift: 'Evening',
    status: 'offline',
    streakMonths: 0,
    avatarColor: '#5B6675',
  },
  {
    id: 'R-8',
    name: 'Anjali Pillai',
    initials: 'AP',
    tier: 'Starter',
    score: 48,
    conversions: 9,
    revenue: 33.1,
    district: 'Ernakulam',
    shift: 'Morning',
    status: 'active',
    streakMonths: 0,
    avatarColor: '#C2410C',
  },
]

// ---- Helpers ----

export function getRepById(id) {
  return reps.find((rep) => rep.id === id) || null
}

export function getRepsByTier(tier) {
  return reps.filter((rep) => rep.tier === tier)
}

export function getRepsByDistrict(district) {
  return reps.filter((rep) => rep.district === district)
}

// Reps sorted by score, highest first (leaderboard order).
export function getRepsRanked() {
  return [...reps].sort((a, b) => b.score - a.score)
}

export default reps
