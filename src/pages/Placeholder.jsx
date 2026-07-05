import { useLocation } from 'react-router-dom'
import { getRoleFromPath, getPageTitle } from '../config/nav.js'

// Generic placeholder content for every shell route until real screens land.
export default function Placeholder() {
  const { pathname } = useLocation()
  const role = getRoleFromPath(pathname)
  const title = getPageTitle(role, pathname)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
        {role.label}
      </p>
      <h2 className="mt-1 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-inkSoft">
        Placeholder — this screen will be built in a later phase.
      </p>
    </div>
  )
}
