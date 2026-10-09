import { useCallback, useEffect, useMemo, useState } from 'react'
import { resolveDrift, useFixPredicate, type Resolved } from '../fixtures/drift'
import type { Beat, ChatScript, UserAction } from '../fixtures/script'
import { parseSeeds, scenarioOf, type Scenario, type SeedSet } from '../fixtures/seeds'
import { beatIndex, stateAt } from './engine'
import { viewOf, type ChatView } from './view'

export type PlayerOptions = {
  /**
   * Render this beat instantly: no timers, no animation (the `at=` URL key, for reviews and diffs).
   * Unknown ids are ignored. `play()` or `advance()` continue live from it.
   */
  at?: string | null
  /** Start playing on mount when no `at` is given. Default true. */
  autoplay?: boolean
  /** Stop on this beat (id or alias) instead of playing on. */
  until?: string
  /** Time multiplier: 1 = the Figma timings, 2 = twice as fast. */
  speed?: number
  /** The `seed=` flags: a comma list, or an already parsed set. */
  seeds?: string | SeedSet | null
}

export type BeatPlayer = {
  script: ChatScript
  beats: Beat[]
  index: number
  beat: Beat
  /** The next beat, or null at the end. */
  next: Beat | null
  /** The chat at the current beat, with seeds applied and every Drift resolved for the fixes switch. */
  view: Resolved<ChatView>
  scenario: Scenario
  /** Rendering a beat statically (`at=` or seek): nothing animates until play() / advance(). */
  instant: boolean
  playing: boolean
  /** The next beat waits for this user action (only while live). */
  waitingFor: { action: UserAction; hint: string } | null
  /** Epoch ms at which the next timed beat plays, while one is pending. */
  dueAt: number | null
  /** Release a user gate (or skip a pending timer). Returns false when the next beat waits for another action. */
  advance: (action?: UserAction) => boolean
  play: () => void
  pause: () => void
  /** Back to the first beat, live. */
  reset: () => void
  /** Jump to a beat, statically. */
  seek: (id: string) => void
}

type Mode = { index: number; live: boolean; playing: boolean }

function initialMode(script: ChatScript, at: string | null | undefined, autoplay: boolean): Mode {
  const i = beatIndex(script, at)
  return i >= 0 ? { index: i, live: false, playing: false } : { index: 0, live: true, playing: autoplay }
}

/**
 * Plays a chat script with the Figma timings: each beat whose trigger is `time` follows the previous one after
 * its delay (COT Step 1 → 4s → Step 2 → 2.5s → … ); a `user` beat waits for advance(action).
 */
export function useBeatPlayer(script: ChatScript, opts: PlayerOptions = {}): BeatPlayer {
  const { at = null, autoplay = true, until, speed = 1, seeds = null } = opts
  const [mode, setMode] = useState<Mode>(() => initialMode(script, at, autoplay))
  const [dueAt, setDueAt] = useState<number | null>(null)

  // A new script or a new `at` starts over (state adjusted during render, not in an effect).
  const key = `${script.chat}|${at ?? ''}`
  const [modeKey, setModeKey] = useState(key)
  if (modeKey !== key) {
    setModeKey(key)
    setMode(initialMode(script, at, autoplay))
  }

  const { index, live, playing } = mode
  const beats = script.beats
  const beat = beats[Math.min(index, beats.length - 1)]
  const next = beats[index + 1] ?? null
  const untilIndex = until ? beatIndex(script, until) : -1
  const stopped = !next || (untilIndex >= 0 && index >= untilIndex)

  // The timer for the next timed beat.
  useEffect(() => {
    if (!live || !playing || stopped || !next || next.trigger.after !== 'time') {
      setDueAt(null)
      return
    }
    const ms = Math.max(0, next.trigger.ms / (speed > 0 ? speed : 1))
    setDueAt(Date.now() + ms)
    const from = index
    const t = window.setTimeout(() => {
      setMode(m => (m.index === from && m.live && m.playing ? { ...m, index: from + 1 } : m))
    }, ms)
    return () => window.clearTimeout(t)
  }, [live, playing, stopped, next, index, speed])

  const advance = useCallback((action?: UserAction) => {
    const n = beats[index + 1]
    if (!n) return false
    if (n.trigger.after === 'user' && action && action !== n.trigger.action) return false
    setMode({ index: index + 1, live: true, playing: true })
    return true
  }, [beats, index])

  const play = useCallback(() => setMode(m => ({ ...m, live: true, playing: true })), [])
  const pause = useCallback(() => setMode(m => ({ ...m, playing: false })), [])
  const reset = useCallback(() => setMode({ index: 0, live: true, playing: true }), [])
  const seek = useCallback((id: string) => {
    const i = beatIndex(script, id)
    if (i >= 0) setMode({ index: i, live: false, playing: false })
  }, [script])

  const seedSet = useMemo(() => (typeof seeds === 'string' || seeds == null ? parseSeeds(seeds) : seeds), [seeds])
  const scenario = useMemo(() => scenarioOf(seedSet), [seedSet])
  const applies = useFixPredicate()
  const view = useMemo(() => resolveDrift(viewOf(stateAt(script, index), scenario), applies), [script, index, scenario, applies])

  const waitingFor = live && !stopped && next && next.trigger.after === 'user'
    ? { action: next.trigger.action, hint: next.trigger.hint }
    : null

  return {
    script, beats, index, beat, next, view, scenario,
    instant: !live, playing: live && playing && !stopped, waitingFor, dueAt,
    advance, play, pause, reset, seek,
  }
}
