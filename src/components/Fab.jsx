import clsx from 'clsx'
import { Plus } from 'lucide-react'

// Floating action button — primary "add" action, bottom-right of the shell.
// Defaults to a Plus icon but accepts overrides so other screens can reuse it.
export default function Fab({ icon: Icon = Plus, label = 'Add new', onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={clsx(
        'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30 transition-colors hover:bg-brand-orangeDk',
        className,
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={2.5} />
    </button>
  )
}
