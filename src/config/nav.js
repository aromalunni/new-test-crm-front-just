// Per-role shell configuration: nav items, role label, and the signed-in user.
// Role is derived ONLY from the URL prefix (/admin, /lead, /rep). There is no
// role switcher anywhere in the UI.

import {
  LayoutDashboard,
  Users,
  Inbox,
  BarChart3,
  Trophy,
  UsersRound,
  Settings,
  UserCheck,
  AlertCircle,
  CalendarCheck,
  PhoneIncoming,
  PhoneCall,
  TrendingUp,
} from 'lucide-react'

export const ROLES = {
  admin: {
    key: 'admin',
    label: 'ADMIN',
    base: '/admin',
    user: {
      name: 'Aditya Menon',
      roleText: 'Regional Admin',
      initials: 'AM',
      color: '#0E1B2E',
    },
    nav: [
      { path: '/admin/dashboard', label: 'Dashboard', title: 'Admin Dashboard', icon: LayoutDashboard },
      { path: '/admin/all-leads', label: 'All Leads', title: 'All Leads', icon: Users },
      { path: '/admin/queue', label: 'Online Queue', icon: Inbox, badge: 8 },
      { path: '/admin/call-logs', label: 'Call Logs', title: 'Call Logs', icon: PhoneCall },
      { path: '/admin/performance', label: 'Team Performance', icon: BarChart3 },
      { path: '/admin/tv', label: 'TV Leaderboard', icon: Trophy },
      { path: '/admin/workforce', label: 'Workforce', icon: UsersRound, notifications: 3 },
      { path: '/admin/settings', label: 'Settings', icon: Settings, notifications: 2 },
    ],
  },

  lead: {
    key: 'lead',
    label: 'TEAM LEAD',
    base: '/lead',
    user: {
      name: 'Suresh Jayan',
      roleText: 'Projects · Dept Head',
      dept: 'Projects',
      initials: 'SJ',
      color: '#2F6FED',
    },
    nav: [
      { path: '/lead/dashboard', label: 'Dashboard', title: 'Team Dashboard', icon: LayoutDashboard },
      { path: '/lead/all-leads', label: 'All Leads', title: 'Team — All Leads', icon: Users },
      { path: '/lead/my-leads', label: 'My Leads', icon: UserCheck },
      { path: '/lead/unclosed', label: 'Unclosed Leads', icon: AlertCircle },
      { path: '/lead/call-logs', label: 'Call Logs', title: 'Team — Call Logs', icon: PhoneCall },
      { path: '/lead/performance', label: 'Performance Drilldown', icon: BarChart3 },
    ],
  },

  rep: {
    key: 'rep',
    label: 'CRS REP',
    base: '/rep',
    user: {
      name: 'Ravi Kumar',
      roleText: 'CRS Rep · Elite',
      initials: 'RK',
      color: '#F26B3A',
    },
    nav: [
      { path: '/rep/today', label: "Today's Work", icon: CalendarCheck },
      { path: '/rep/leads', label: 'My Leads', icon: Users, notifications: 3 },
      { path: '/rep/incoming', label: 'Incoming', icon: PhoneIncoming, notifications: 1 },
      { path: '/rep/performance', label: 'Performance', icon: TrendingUp },
    ],
  },
}

// Resolve the active role config from a pathname prefix.
export function getRoleFromPath(pathname) {
  if (pathname.startsWith('/admin')) return ROLES.admin
  if (pathname.startsWith('/lead')) return ROLES.lead
  return ROLES.rep
}

// True when `pathname` is the nav item's path or a descendant of it. Matches on
// a segment boundary (exact, or followed by "/") so a detail page like
// /rep/leads/123 still resolves to /rep/leads, while a future sibling such as
// /admin/all-leads-archive is NOT captured by /admin/all-leads.
function isUnderNavPath(pathname, path) {
  return pathname === path || pathname.startsWith(path + '/')
}

// Find the page title for the current path (falls back to the role's first item).
export function getPageTitle(role, pathname) {
  const match = role.nav.find((item) => isUnderNavPath(pathname, item.path))
  return match ? match.title ?? match.label : role.nav[0].label
}

// Per-page notification count for the bell badge. Returns a number to show a
// count, or undefined to fall back to the plain dot. Driven by the active nav
// item so each screen can carry its own count (no role switcher involved).
export function getNotificationCount(role, pathname) {
  const match = role.nav.find((item) => isUnderNavPath(pathname, item.path))
  return match?.notifications
}
