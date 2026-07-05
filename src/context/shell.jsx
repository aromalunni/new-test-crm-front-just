import { createContext, useContext, useState, useCallback, useRef } from 'react'

// App-shell level state shared between the TopBar and the page content:
//  - toast(msg): fire a transient bottom-center toast (replaces per-page toasts)
//  - search / setSearch: the TopBar search term; pages filter their lists by it
//  - refresh() / refreshKey: bumps a key that remounts the active page (a real
//    "reload" — restores mock data and clears local edits)
const ShellContext = createContext(null)

export function useShell() {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within a ShellProvider')
  return ctx
}

export function ShellProvider({ children }) {
  const [toastMsg, setToastMsg] = useState(null)
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const timer = useRef(null)

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
    setSearch('')
  }, [])

  return (
    <ShellContext.Provider value={{ toast, search, setSearch, refresh, refreshKey }}>
      {children}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-xl">
          {toastMsg}
        </div>
      )}
    </ShellContext.Provider>
  )
}
