import clsx from 'clsx'
import { Flame } from 'lucide-react'

// Rounded pill with a color pair per status. Label defaults to a prettified
// version of the variant key; pass children to override.
const VARIANTS = {
  // ── Canonical 14 lifecycle stages (see src/config/stages.js) ──────────────
  new: 'bg-[#EFEDE9] text-[#5B6675]',
  contacted: 'bg-[#E7EEFD] text-[#2F6FED]',
  qualified: 'bg-[#E4F0FB] text-[#1E72B8]',
  'survey-scheduled': 'bg-[#FDEFE2] text-[#C9791E]',
  'survey-completed': 'bg-[#FCE9E1] text-[#E2552A]',
  'proposal-sent': 'bg-amberSoft text-[#B97A1C]',
  negotiation: 'bg-[#FBEAD7] text-[#A86518]',
  'booking-confirmed': 'bg-greenSoft text-green',
  'agreement-generated': 'bg-[#ECEAFB] text-[#5B53C9]',
  'loan-processing': 'bg-[#EAE6FB] text-[#6A4FC2]',
  'project-execution': 'bg-[#E4EEFC] text-[#2F6FED]',
  'documentation-subsidy': 'bg-[#DFF1F0] text-[#0E8C86]',
  'handover-complete': 'bg-[#D3EAD9] text-[#0F7A45]',
  'after-sales-active': 'bg-[#E0F2EA] text-[#0B7A56]',
  // ── Legacy 9-stage keys (kept so existing datasets keep rendering) ────────
  'site-visited': 'bg-[#FCE9E1] text-[#E2552A]',
  'advance-paid': 'bg-greenSoft text-green',
  docs: 'bg-[#ECEAFB] text-[#5B53C9]',
  subsidy: 'bg-[#DFF1F0] text-[#0E8C86]',
  kseb: 'bg-greenSoft text-green',
  commissioned: 'bg-[#D3EAD9] text-[#0F7A45]',
  won: 'bg-greenSoft text-green',
  stalled: 'bg-redSoft text-red',
  active: 'bg-greenSoft text-green',
  elite: 'bg-[#FCE9E1] text-[#E2552A]',
  performer: 'bg-amberSoft text-[#B97A1C]',
  starter: 'bg-[#EFEDE9] text-[#5B6675]',
  breached: 'bg-redSoft text-red',
  'awaiting-accept': 'bg-amberSoft text-[#B97A1C]',
  'awaiting-call': 'bg-[#FCE9E1] text-[#E2552A]',
  accepted: 'bg-greenSoft text-green',
}

const ICONS = {
  elite: Flame,
}

function labelFor(variant) {
  return variant.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function StatusBadge({ variant = 'new', children, className }) {
  const classes = VARIANTS[variant] || VARIANTS.new
  const Icon = ICONS[variant]

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        classes,
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children ?? labelFor(variant)}
    </span>
  )
}
