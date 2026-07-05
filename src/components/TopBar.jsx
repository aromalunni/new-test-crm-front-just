import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Search,
  X,
  Bell,
  LayoutGrid,
  RotateCw,
  ChevronDown,
  Settings,
  Users,
  BarChart3,
  Inbox,
  Trophy,
  CalendarCheck,
} from 'lucide-react'

import Avatar from './Avatar.jsx'
import { useShell } from '../context/shell.jsx'

// Mock notifications for the bell dropdown.
const NOTIFICATIONS = [
  { id: 'n1', title: '4 unclosed leads stalled 7+ days', time: '10m ago', tone: 'red' },
  { id: 'n2', title: 'Priya Nair closed Thomas Residence', time: '1h ago', tone: 'green' },
  { id: 'n3', title: 'New online lead assigned to Ravi', time: '3h ago', tone: 'blue' },
]

const APPS = [
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'queue', label: 'Queue', icon: Inbox },
  { id: 'perf', label: 'Performance', icon: BarChart3 },
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'board', label: 'Leaderboard', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const TONE_DOT = { red: 'bg-red', green: 'bg-green', blue: 'bg-blue' }

// Small dropdown wrapper that closes on outside click / Escape.
function Dropdown({ open, onClose, align = 'right', children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      ref={ref}
      className={clsx(
        'absolute top-11 z-30 overflow-hidden rounded-xl border border-border bg-white shadow-lg',
        align === 'right' ? 'right-0' : 'left-0',
      )}
    >
      {children}
    </div>
  )
}

// Sticky white top bar: page title, center search, and right-side actions.
// The user chip + per-page bell count come from the active role (AppShell);
// there is no role switcher and no demo-mode toggle.
export default function TopBar({ title, user, notifications, role }) {
  const navigate = useNavigate()
  const { search, setSearch, toast, refresh } = useShell()
  const [notifList, setNotifList] = useState(NOTIFICATIONS)
  const [cleared, setCleared] = useState(false)
  const bellCount = cleared ? 0 : notifications ?? user?.notifications ?? notifList.length

  const [menu, setMenu] = useState(null) // 'bell' | 'apps' | 'account' | null
  const [spinning, setSpinning] = useState(false)

  function toggle(name) {
    setMenu((m) => (m === name ? null : name))
  }

  function onRefresh() {
    setSpinning(true)
    refresh()
    toast('Refreshed')
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-white px-4 lg:px-6">
      {/* Page title */}
      <h1 className="shrink-0 text-lg font-bold text-ink">{title}</h1>

      {/* Center search */}
      <div className="mx-auto hidden w-full max-w-md md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, reps, notes…"
            className="h-9 w-full rounded-xl border border-border bg-canvas pl-9 pr-9 text-sm text-ink placeholder:text-inkSoft focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-inkSoft transition-colors hover:bg-border/60 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => toggle('bell')}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
          >
            <Bell className="h-[18px] w-[18px]" />
            {bellCount ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {bellCount}
              </span>
            ) : (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white" />
            )}
          </button>
          <Dropdown open={menu === 'bell'} onClose={() => setMenu(null)}>
            <div className="w-72">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-sm font-bold text-ink">Notifications</span>
                <button
                  type="button"
                  onClick={() => {
                    setNotifList([])
                    setCleared(true)
                    toast('All notifications marked read')
                  }}
                  className="text-xs font-semibold text-brand-orange hover:text-brand-orangeDk"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {notifList.length === 0 && (
                  <li className="px-4 py-6 text-center text-xs font-medium text-inkSoft">
                    You're all caught up.
                  </li>
                )}
                {notifList.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifList((l) => l.filter((x) => x.id !== n.id))
                        toast('Opening notification')
                        setMenu(null)
                      }}
                      className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-canvas"
                    >
                      <span className={clsx('mt-1.5 h-2 w-2 shrink-0 rounded-full', TONE_DOT[n.tone])} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">{n.title}</span>
                        <span className="block text-xs text-inkSoft">{n.time}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Dropdown>
        </div>

        {/* Apps */}
        <div className="relative">
          <button
            type="button"
            aria-label="Apps"
            onClick={() => toggle('apps')}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
          >
            <LayoutGrid className="h-[18px] w-[18px]" />
          </button>
          <Dropdown open={menu === 'apps'} onClose={() => setMenu(null)}>
            <div className="w-60 p-2">
              <div className="grid grid-cols-3 gap-1">
                {APPS.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      toast(`Opening ${app.label}`)
                      setMenu(null)
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors hover:bg-canvas"
                  >
                    <app.icon className="h-5 w-5 text-inkSoft" />
                    <span className="text-[11px] font-semibold text-ink">{app.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Dropdown>
        </div>

        {/* Refresh */}
        <button
          type="button"
          aria-label="Refresh"
          onClick={onRefresh}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
        >
          <RotateCw className={clsx('h-[18px] w-[18px] transition-transform', spinning && 'animate-spin')} />
        </button>

        {/* Account — admin gets a Settings menu; lead/rep show the avatar only. */}
        {user && role?.key === 'admin' && (
          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => toggle('account')}
              className="ml-1 flex items-center gap-1 rounded-xl p-0.5 transition-colors hover:bg-canvas"
            >
              <span className="relative">
                <Avatar name={user.name} initials={user.initials} color={user.color} size="md" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green ring-2 ring-white" />
              </span>
              <ChevronDown className="h-4 w-4 text-inkSoft" />
            </button>
            <Dropdown open={menu === 'account'} onClose={() => setMenu(null)}>
              <div className="w-56">
                <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                  <Avatar name={user.name} initials={user.initials} color={user.color} size="md" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-ink">{user.name}</div>
                    <div className="truncate text-xs font-medium text-inkSoft">{user.roleText}</div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`${role.base}/settings`)
                      setMenu(null)
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-canvas"
                  >
                    <Settings className="h-4 w-4 text-inkSoft" />
                    Settings
                  </button>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
        {user && role?.key !== 'admin' && (
          <span className="relative ml-1 p-0.5">
            <Avatar name={user.name} initials={user.initials} color={user.color} size="md" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green ring-2 ring-white" />
          </span>
        )}
      </div>
    </header>
  )
}
