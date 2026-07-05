import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Play, Pause, RotateCcw, RotateCw, Download, Gauge } from 'lucide-react'

import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'
import { recordingWaveform, OUTCOME_TONE } from '../data/callLogs.js'

const OUTCOME_CLS = {
  green: 'bg-greenSoft text-green',
  amber: 'bg-amberSoft text-[#B97A1C]',
  gray: 'bg-[#EFEDE9] text-[#5B6675]',
  red: 'bg-redSoft text-red',
}

const SPEEDS = [1, 1.5, 2]

function fmt(sec) {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Mock audio player. There's no real audio file behind a frontend demo, so
// playback is simulated with a ticking clock — the waveform fills, the clock
// advances, and speed/seek behave as a real player would.
export default function CallRecordingModal({ call, onClose, onDownload }) {
  const open = Boolean(call)
  const duration = call?.durationSec || 0

  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)
  const timer = useRef(null)

  const bars = useMemo(() => (call ? recordingWaveform(call.id) : []), [call])

  // Reset whenever a different recording is opened.
  useEffect(() => {
    setT(0)
    setRate(1)
    setPlaying(open)
  }, [call?.id, open])

  // Simulated transport: advance the clock while playing.
  useEffect(() => {
    if (!playing) return undefined
    const step = 0.1
    timer.current = setInterval(() => {
      setT((prev) => {
        const next = prev + step * rate
        if (next >= duration) {
          setPlaying(false)
          return duration
        }
        return next
      })
    }, 100)
    return () => clearInterval(timer.current)
  }, [playing, rate, duration])

  if (!call) return null

  const progress = duration ? t / duration : 0

  function toggle() {
    if (t >= duration) setT(0)
    setPlaying((p) => !p)
  }
  function seekTo(ratio) {
    const clamped = Math.min(1, Math.max(0, ratio))
    setT(clamped * duration)
  }
  function skip(delta) {
    setT((prev) => Math.min(duration, Math.max(0, prev + delta)))
  }
  function cycleSpeed() {
    setRate((r) => SPEEDS[(SPEEDS.indexOf(r) + 1) % SPEEDS.length])
  }

  const tone = OUTCOME_CLS[OUTCOME_TONE[call.outcome] || 'gray']

  return (
    <Modal open={open} onClose={onClose} title="Call Recording" subtitle={call.recordingName} width="max-w-lg">
      {/* Who / what */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={call.leadName} size="md" />
          <div className="min-w-0">
            <div className="font-semibold text-ink">{call.leadName}</div>
            <div className="text-xs font-medium text-inkSoft">
              {call.leadId} · {call.phone}
            </div>
          </div>
        </div>
        <span className={clsx('inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', tone)}>
          {call.outcome}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-inkSoft">
        <span>
          Rep: <span className="text-ink">{call.rep}</span>
        </span>
        <span>
          {call.department} · {call.direction}
        </span>
        <span>
          {call.day}, {call.time}
        </span>
      </div>

      {/* Waveform (click / drag to seek) */}
      <button
        type="button"
        aria-label="Seek"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          seekTo((e.clientX - r.left) / r.width)
        }}
        className="mt-4 flex h-20 w-full items-center gap-[2px] rounded-xl bg-canvas px-3"
      >
        {bars.map((h, i) => {
          const filled = i / bars.length <= progress
          return (
            <span
              key={i}
              className={clsx(
                'flex-1 rounded-full transition-colors',
                filled ? 'bg-brand-orange' : 'bg-border',
              )}
              style={{ height: `${Math.round(h * 100)}%` }}
            />
          )
        })}
      </button>

      {/* Scrubber + times */}
      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand-orange"
          aria-label="Recording position"
        />
        <div className="mt-1 flex justify-between text-xs font-semibold tabular-nums text-inkSoft">
          <span>{fmt(t)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Back 10 seconds"
          title="Back 10s"
          onClick={() => skip(-10)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-sm transition-colors hover:bg-brand-orangeDk"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
        <button
          type="button"
          aria-label="Forward 10 seconds"
          title="Forward 10s"
          onClick={() => skip(10)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-inkSoft transition-colors hover:bg-canvas hover:text-ink"
        >
          <RotateCw className="h-[18px] w-[18px]" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        <button
          type="button"
          onClick={cycleSpeed}
          title="Playback speed"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
        >
          <Gauge className="h-4 w-4 text-inkSoft" />
          {rate}×
        </button>
        <button
          type="button"
          onClick={() => onDownload?.(call)}
          title="Download recording"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
        >
          <Download className="h-4 w-4 text-inkSoft" />
          Save
        </button>
      </div>

      {/* Transcript note, if any */}
      {call.note && (
        <div className="mt-4 rounded-xl border border-border bg-canvas px-3.5 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-inkSoft">Rep note</div>
          <p className="mt-1 text-sm text-ink">{call.note}</p>
        </div>
      )}
    </Modal>
  )
}
