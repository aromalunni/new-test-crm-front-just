import { NavLink, useNavigate } from 'react-router-dom'
import { Sun, LogOut } from 'lucide-react'
import clsx from 'clsx'

import { useShell } from '../context/shell.jsx'
import { clearSession } from '../lib/auth.js'

// Dark navy fixed sidebar. Collapses to an icon-only rail below the lg breakpoint.
// Orange is used ONLY for the active nav pill. No role switcher, no demo dropdown.
export default function Sidebar({ role }) {
  const { user } = role
  const navigate = useNavigate()
  const { toast } = useShell()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col bg-sidebar-bg lg:w-[230px]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-3 lg:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/15">
          <Sun className="h-5 w-5 text-brand-orange" strokeWidth={2.5} />
        </span>
        <div className="hidden min-w-0 lg:block">
          <div className="text-[15px] font-bold leading-tight text-white">Flarize</div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sidebar-text">
            Solar Energy CRM
          </div>
        </div>
      </div>

      {/* Role section label */}
      <div className="mt-2 px-3 lg:px-5">
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-text/70 lg:block">
          {role.label}
        </span>
        <div className="h-px bg-white/5 lg:mt-2" />
      </div>

      {/* Nav */}
      <nav className="mt-3 flex flex-1 flex-col gap-1 px-2 lg:px-3">
        {role.nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  'justify-center lg:justify-start',
                  isActive
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-sidebar-text hover:bg-sidebar-bgAlt hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative shrink-0">
                    <Icon className="h-[18px] w-[18px]" />
                    {item.badge != null && (
                      <span
                        className={clsx(
                          'absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold leading-none ring-2 ring-sidebar-bg lg:hidden',
                          isActive ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <span className="hidden truncate lg:inline">{item.label}</span>
                  {item.badge != null && (
                    <span
                      className={clsx(
                        'ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none lg:inline-flex',
                        isActive ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer: user chip + logout */}
      <div className="mt-auto border-t border-white/5 p-2 lg:p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 lg:px-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </span>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-[13px] font-semibold text-white">{user.name}</div>
            <div className="truncate text-[11px] text-sidebar-text">{user.roleText}</div>
          </div>
        </div>

        <button
          type="button"
          title="Logout"
          onClick={() => {
            toast('Signing out…')
            clearSession()
            navigate('/login')
          }}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-text transition-colors hover:bg-sidebar-bgAlt hover:text-white justify-center lg:justify-start"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  )
}
