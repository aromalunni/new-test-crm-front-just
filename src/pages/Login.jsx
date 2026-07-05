import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Users, User, Lock, Sun, ArrowRight } from 'lucide-react'
import { setSession } from '../lib/auth.js'

// Shared demo password for all roles. Selecting a role + this password signs in
// and routes to that role's default landing screen.
const PASSWORD = 'admin'

const ROLE_OPTIONS = [
  {
    key: 'admin',
    label: 'Admin',
    desc: 'Full access — all leads, reps & reports',
    icon: Crown,
    to: '/admin/dashboard',
    accent: '#E8682A',
    tint: '#FFF0E6',
  },
  {
    key: 'lead',
    label: 'Team Lead',
    desc: 'Your team — reassign & drill down',
    icon: Users,
    to: '/lead/dashboard',
    accent: '#2F6FED',
    tint: '#E9F0FE',
  },
  {
    key: 'rep',
    label: 'CRS Person',
    desc: 'Your own leads & daily work queue',
    icon: User,
    to: '/rep/today',
    accent: '#D09008',
    tint: '#FFF8E2',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const selected = ROLE_OPTIONS.find((r) => r.key === role)

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== PASSWORD) {
      setError('Incorrect password. Hint: the password is "admin".')
      return
    }
    setSession(role)
    navigate(selected.to, { replace: true })
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange shadow-lg shadow-brand-orange/30">
            <Sun className="h-7 w-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Flarize Solar CRM</h1>
          <p className="mt-1 text-sm text-inkSoft">Sign in to continue</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(30,45,64,0.08),0_10px_30px_rgba(30,45,64,0.06)]"
        >
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-inkSoft">
            Select your role
          </label>

          <div className="space-y-2.5">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = opt.key === role
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setRole(opt.key)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                    active
                      ? 'border-transparent ring-2'
                      : 'border-border hover:border-inkSoft/30'
                  }`}
                  style={active ? { backgroundColor: opt.tint, boxShadow: `0 0 0 2px ${opt.accent}` } : undefined}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: active ? opt.accent : opt.tint }}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={2.2}
                      style={{ color: active ? '#fff' : opt.accent }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">{opt.label}</span>
                    <span className="block truncate text-xs text-inkSoft">{opt.desc}</span>
                  </span>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${active ? '' : 'border-border'}`}
                    style={active ? { borderColor: opt.accent, backgroundColor: opt.accent } : undefined}
                  />
                </button>
              )
            })}
          </div>

          {/* Password */}
          <label className="mb-2 mt-5 block text-xs font-bold uppercase tracking-wide text-inkSoft">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter password"
              autoFocus
              className="w-full rounded-xl border border-border bg-canvas py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          {error && <p className="mt-2 text-xs font-semibold text-red">{error}</p>}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/25 transition hover:bg-brand-orangeDk active:scale-[0.99]"
          >
            Sign in as {selected.label}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <p className="mt-4 text-center text-xs text-inkSoft">
            Demo access — password for every role is <span className="font-bold text-ink">admin</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-inkSoft">
          Flarize Technologies Pvt Ltd · Solar EPC, Kerala
        </p>
      </div>
    </div>
  )
}
