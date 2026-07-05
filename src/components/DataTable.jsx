import { useState, useMemo, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'

// Generic client-side table. Columns may declare `sortable` and a `render`.
//   columns: [{ key, header, sortable?, align?, className?, render?(row,value), sortAccessor?(row) }]
// Extras: leading checkbox column (`selectable`), per-row ⋮ menu (`rowActions`),
// sortable headers, and a pagination footer with a page-size selector.
function getValue(row, col) {
  if (col.sortAccessor) return col.sortAccessor(row)
  return row[col.key]
}

function pageList(current, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(count - 1, current + 1); i += 1) {
    pages.push(i)
  }
  if (current < count - 2) pages.push('…')
  pages.push(count)
  return pages
}

export default function DataTable({
  columns,
  rows,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  selectable = false,
  rowActions,
  rowKey = (row, i) => row.id ?? i,
  onSelectionChange,
  selectionResetKey,
  className,
}) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)
  const [selected, setSelected] = useState(() => new Set())
  const [openMenu, setOpenMenu] = useState(null)
  const menuRef = useRef(null)
  const selChange = useRef(onSelectionChange)
  selChange.current = onSelectionChange

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Notify the parent when the selection changes (ref avoids re-render loops).
  useEffect(() => {
    selChange.current?.([...selected])
  }, [selected])

  // Allow the parent to clear selection after a bulk action.
  useEffect(() => {
    if (selectionResetKey !== undefined) setSelected(new Set())
  }, [selectionResetKey])

  const sorted = useMemo(() => {
    if (!sort.key) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = getValue(a, col)
      const bv = getValue(b, col)
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return av - bv
      return String(av).localeCompare(String(bv), undefined, { numeric: true })
    })
    if (sort.dir === 'desc') copy.reverse()
    return copy
  }, [rows, sort, columns])

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / size))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * size
  const pageRows = sorted.slice(start, start + size)
  const from = total === 0 ? 0 : start + 1
  const to = Math.min(start + size, total)

  function toggleSort(col) {
    if (!col.sortable) return
    setPage(1)
    setSort((s) =>
      s.key === col.key
        ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' },
    )
  }

  const pageKeys = pageRows.map((row, i) => rowKey(row, start + i))
  const allOnPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k))

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) pageKeys.forEach((k) => next.delete(k))
      else pageKeys.forEach((k) => next.add(k))
      return next
    })
  }

  function toggleRow(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const colSpan = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)

  return (
    <div className={clsx('overflow-hidden rounded-2xl border border-border bg-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-canvas/60">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    className="h-3.5 w-3.5 rounded border-border accent-brand-orange"
                    aria-label="Select all on page"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sort.key === col.key
                return (
                  <th
                    key={col.key}
                    className={clsx(
                      'px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-inkSoft',
                      col.align === 'right' ? 'text-right' : 'text-left',
                      col.sortable && 'cursor-pointer select-none hover:text-ink',
                      col.headerClassName,
                    )}
                    onClick={() => toggleSort(col)}
                  >
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1',
                        col.align === 'right' && 'flex-row-reverse',
                      )}
                    >
                      {col.header}
                      {col.sortable &&
                        (isSorted ? (
                          sort.dir === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5 text-brand-orange" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-brand-orange" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 text-inkSoft/50" />
                        ))}
                    </span>
                  </th>
                )
              })}
              {rowActions && <th className="w-12 px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-inkSoft">
                  No records to show.
                </td>
              </tr>
            )}
            {pageRows.map((row, i) => {
              const key = pageKeys[i]
              const isSelected = selected.has(key)
              return (
                <tr
                  key={key}
                  className={clsx(
                    'border-b border-border last:border-0 transition-colors hover:bg-canvas/50',
                    isSelected && 'bg-brand-orange/[0.04]',
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        className="h-3.5 w-3.5 rounded border-border accent-brand-orange"
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = row[col.key]
                    return (
                      <td
                        key={col.key}
                        className={clsx(
                          'px-4 py-3 text-ink',
                          col.align === 'right' ? 'text-right' : 'text-left',
                          col.className,
                        )}
                      >
                        {col.render ? col.render(row, value) : value}
                      </td>
                    )
                  })}
                  {rowActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block" ref={openMenu === key ? menuRef : null}>
                        <button
                          type="button"
                          aria-label="Row actions"
                          onClick={() => setOpenMenu(openMenu === key ? null : key)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenu === key && (
                          <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
                            {(typeof rowActions === 'function' ? rowActions(row) : rowActions).map(
                              (action) => (
                                <button
                                  key={action.label}
                                  type="button"
                                  onClick={() => {
                                    action.onClick?.(row)
                                    setOpenMenu(null)
                                  }}
                                  className={clsx(
                                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-canvas',
                                    action.danger ? 'text-red' : 'text-ink',
                                  )}
                                >
                                  {action.icon && <action.icon className="h-4 w-4" />}
                                  {action.label}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-inkSoft sm:flex-row">
        <div className="flex items-center gap-3">
          <span>
            Showing {from} to {to} of {total}
          </span>
          <span className="flex items-center gap-1">
            <span>Rows</span>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value))
                setPage(1)
              }}
              className="rounded-lg border border-border bg-white px-1.5 py-1 text-xs text-ink focus:border-brand-orange/40 focus:outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-inkSoft transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageList(current, pageCount).map((p, idx) =>
            p === '…' ? (
              <span key={`gap-${idx}`} className="px-1.5 text-inkSoft">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={clsx(
                  'flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors',
                  p === current
                    ? 'bg-brand-orange text-white'
                    : 'border border-border text-inkSoft hover:bg-canvas',
                )}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={current >= pageCount}
            onClick={() => setPage(current + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-inkSoft transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
