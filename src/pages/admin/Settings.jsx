import { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  Zap,
  Clock,
  Trophy,
  CalendarDays,
  ShieldCheck,
  Link2,
  Users,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react'

import Card from '../../components/Card.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useShell } from '../../context/shell.jsx'
import {
  settingsNav,
  assignmentModes,
  slaFields,
  shiftDays,
  shiftRows,
  gamificationTiers,
} from '../../data/settings.js'

const ICONS = { Zap, Clock, Trophy, CalendarDays, ShieldCheck, Link2, Users }

// Small lettered badge (A/B/C/D) used in each section header for hierarchy.
function SectionTitle({ letter, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-xs font-bold text-brand-orange">
        {letter}
      </span>
      <h3 className="text-sm font-bold text-ink">{children}</h3>
    </div>
  )
}

// ── Left sub-nav column ─────────────────────────────────────────────────────
function SubNav({ active, onSelect }) {
  return (
    <Card className="!p-0 lg:sticky lg:top-5 self-start" bodyClassName="p-2">
      <div className="px-3 pb-2 pt-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-inkSoft">Settings</h3>
      </div>
      <nav className="space-y-0.5">
        {settingsNav.map((item, i) => {
          const Icon = ICONS[item.icon]
          const isActive = active === item.key
          // Divider before the first "coming soon" (section-less) item.
          const showDivider = !item.section && settingsNav[i - 1]?.section
          return (
            <div key={item.key}>
              {showDivider && <div className="my-2 mx-3 border-t border-border" />}
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={clsx(
                  'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-inkSoft hover:bg-canvas hover:text-ink',
                )}
              >
                <Icon
                  className={clsx(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-brand-orange' : 'text-inkSoft/70 group-hover:text-ink',
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          )
        })}
      </nav>
    </Card>
  )
}

// ── A. Assignment Engine ────────────────────────────────────────────────────
function AssignmentSection({ selected, onSelect, weight, onWeight }) {
  return (
    <Card
      title={<SectionTitle letter="A">Assignment Engine</SectionTitle>}
      right={<StatusBadge variant="active">ACTIVE</StatusBadge>}
    >
      <div className="space-y-3">
        {assignmentModes.map((mode) => {
          const Icon = ICONS[mode.icon]
          const isOn = selected === mode.key
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => onSelect(mode.key)}
              className={clsx(
                'block w-full rounded-xl border p-4 text-left transition-all',
                isOn
                  ? 'border-brand-orange bg-brand-orange/[0.04] ring-1 ring-brand-orange/30'
                  : 'border-border hover:border-inkSoft/30 hover:bg-canvas/40',
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={clsx(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                    isOn ? 'bg-brand-orange text-white' : 'bg-canvas text-inkSoft',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink">{mode.title}</span>
                    {mode.badge && (
                      <span className="rounded-full bg-[#EFEDE9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5B6675]">
                        {mode.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-inkSoft">
                    {mode.sub}
                    {mode.risk && <span className="font-semibold text-red"> {mode.risk}</span>}
                  </p>

                  {mode.slider && isOn && (
                    <div className="mt-4 rounded-lg border border-border bg-white p-3">
                      <div className="mb-2.5 flex items-center justify-between text-xs font-semibold">
                        <span className="text-brand-orange">Score weight: {weight}%</span>
                        <span className="text-inkSoft">Availability: {100 - weight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={weight}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onWeight(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-canvas accent-brand-orange"
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

// ── B. SLA Configuration ────────────────────────────────────────────────────
function SlaSection() {
  return (
    <Card title={<SectionTitle letter="B">SLA Configuration</SectionTitle>}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {slaFields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-inkSoft">
              {f.label}
            </label>
            {f.type === 'select' ? (
              <div className="relative">
                <select
                  defaultValue={f.value}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                >
                  <option>✓ Enabled</option>
                  <option>Disabled</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
              </div>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                defaultValue={f.value}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── C. Shift Schedule ───────────────────────────────────────────────────────
function ShiftSection({ onAdd }) {
  return (
    <Card
      title={<SectionTitle letter="C">Shift Schedule</SectionTitle>}
      right={
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Shift
        </button>
      }
    >
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full border-collapse overflow-hidden rounded-xl text-sm">
          <thead>
            <tr className="bg-[#0E1B2E] text-white">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                Shift
              </th>
              {shiftDays.map((d) => (
                <th
                  key={d}
                  className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftRows.map((row) => (
              <tr
                key={row.shift}
                className="border-b border-border transition-colors last:border-0 hover:bg-canvas/50"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="font-bold text-ink">{row.shift}</div>
                  <div className="text-xs tabular-nums text-inkSoft">{row.time}</div>
                </td>
                {row.days.map((name, i) => (
                  <td
                    key={i}
                    className={clsx(
                      'px-3 py-3 text-center text-sm',
                      name === '—' ? 'text-inkSoft/40' : 'font-medium text-ink',
                    )}
                  >
                    {name}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── D. Gamification Tiers ───────────────────────────────────────────────────
function GamificationSection() {
  return (
    <Card title={<SectionTitle letter="D">Gamification Tiers</SectionTitle>}>
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full border-collapse overflow-hidden rounded-xl text-sm">
          <thead>
            <tr className="border-b border-border bg-canvas/60">
              {['Tier', 'Threshold', 'Commission Boost', 'Discount Authority'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-inkSoft"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gamificationTiers.map((t) => (
              <tr
                key={t.variant}
                className="border-b border-border transition-colors last:border-0 hover:bg-canvas/50"
              >
                <td className="px-4 py-3">
                  <StatusBadge variant={t.variant}>
                    <span>{t.emoji}</span>
                    {t.label}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 font-medium tabular-nums text-ink">{t.threshold}</td>
                <td className="px-4 py-3 font-semibold text-ink">{t.boost}</td>
                <td className="px-4 py-3 text-inkSoft">{t.authority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function Settings() {
  const { toast: notify } = useShell()
  const [activeNav, setActiveNav] = useState('assignment')
  const [mode, setMode] = useState('weighted')
  const [weight, setWeight] = useState(70)

  // One ref per stacked section so the sub-nav can scroll to it.
  const refs = {
    assignment: useRef(null),
    sla: useRef(null),
    gamification: useRef(null),
    shift: useRef(null),
  }

  function handleNav(item) {
    setActiveNav(item.key)
    if (item.section && refs[item.section]?.current) {
      refs[item.section].current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (!item.section) {
      notify(`${item.label} — coming soon`)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Left sub-nav */}
        <SubNav active={activeNav} onSelect={handleNav} />

        {/* Right content */}
        <div className="space-y-6">
          <div ref={refs.assignment} className="scroll-mt-5">
            <AssignmentSection
              selected={mode}
              onSelect={setMode}
              weight={weight}
              onWeight={setWeight}
            />
          </div>
          <div ref={refs.sla} className="scroll-mt-5">
            <SlaSection />
          </div>
          <div ref={refs.shift} className="scroll-mt-5">
            <ShiftSection onAdd={() => notify('Add shift')} />
          </div>
          <div ref={refs.gamification} className="scroll-mt-5">
            <GamificationSection />
          </div>

          {/* Footer action bar — sticks to the bottom of the viewport */}
          <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 rounded-2xl border border-border bg-card/95 px-5 py-4 shadow-[0_-1px_3px_rgba(0,0,0,0.04)] backdrop-blur">
            <button
              type="button"
              onClick={() => {
                setMode('weighted')
                setWeight(70)
                notify('Reset to defaults')
              }}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Reset to defaults
            </button>
            <button
              type="button"
              onClick={() => notify('Settings saved')}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-orangeDk"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
