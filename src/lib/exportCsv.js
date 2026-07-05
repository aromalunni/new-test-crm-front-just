// Client-side CSV export. Turns an array of row objects into a real .csv file
// the browser downloads — no backend. Used by every "Export" / "Report" button.

function escapeCell(value) {
  if (value == null) return ''
  const s = String(value)
  // Quote if the cell contains a comma, quote, or newline; double inner quotes.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// rows: array of plain objects. columns (optional): [{ key, header }] to control
// order/labels; defaults to the keys of the first row. filename: without extension.
export function exportToCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) return false

  const cols =
    columns ?? Object.keys(rows[0]).map((key) => ({ key, header: key }))

  const head = cols.map((c) => escapeCell(c.header)).join(',')
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c.key])).join(','))
    .join('\n')

  const csv = `${head}\n${body}`
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return true
}
