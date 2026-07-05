import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import Fab from './Fab.jsx'
import Modal from './Modal.jsx'
import { ShellProvider, useShell } from '../context/shell.jsx'
import { getRoleFromPath, getPageTitle, getNotificationCount } from '../config/nav.js'

// Shared shell for every role. Role + sidebar + user chip are derived from the
// URL prefix automatically — there is no role switcher and no demo-mode toggle.
function ShellInner() {
  const { pathname } = useLocation()
  const role = getRoleFromPath(pathname)
  const title = getPageTitle(role, pathname)
  const notifications = getNotificationCount(role, pathname)
  const { setSearch, refreshKey, toast } = useShell()

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', district: 'Ernakulam', sizeKw: '' })

  // Clear the search box whenever the route changes.
  useEffect(() => {
    setSearch('')
  }, [pathname, setSearch])

  function submitLead(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setAddOpen(false)
    toast(`Lead created — ${form.name.trim()}`)
    setForm({ name: '', district: 'Ernakulam', sizeKw: '' })
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar role={role} />

      <div className="flex min-h-screen flex-col pl-16 lg:pl-[230px]">
        <TopBar title={title} user={role.user} notifications={notifications} role={role} />
        <main className="flex-1 bg-canvas p-6">
          {/* Bumping refreshKey remounts the page subtree — a real "reload". */}
          <div key={refreshKey}>
            <Outlet />
          </div>
        </main>
      </div>

      <Fab label="Add lead" onClick={() => setAddOpen(true)} />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add new lead"
        subtitle="Create a lead in the Ernakulam pipeline"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-lead-form"
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orangeDk"
            >
              Create lead
            </button>
          </>
        }
      >
        <form id="add-lead-form" onSubmit={submitLead} className="space-y-3.5">
          <label className="block">
            <span className="text-xs font-semibold text-inkSoft">Customer name</span>
            <input
              type="text"
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Rajesh Chandran"
              className="mt-1 h-10 w-full rounded-xl border border-border bg-canvas px-3 text-sm text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-inkSoft">District</span>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-canvas px-3 text-sm text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-inkSoft">System size (kW)</span>
              <input
                type="number"
                min="1"
                value={form.sizeKw}
                onChange={(e) => setForm((f) => ({ ...f, sizeKw: e.target.value }))}
                placeholder="6"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-canvas px-3 text-sm text-ink focus:border-brand-orange/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/15"
              />
            </label>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default function AppShell() {
  return (
    <ShellProvider>
      <ShellInner />
    </ShellProvider>
  )
}
