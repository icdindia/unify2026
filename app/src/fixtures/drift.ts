import { useCallback, useMemo } from 'react'
import { fixesMode, useStore } from '../app/store'
import { fixById, fixRenders } from '../fixes/fixes'

// Copy drift between Figma frames (BUILD-PLAN Q2: "one coherent script, each change logged as a fix").
// A value that Figma draws differently from the coherent script is a Drift: the frame's value ("designed")
// and the script's value ("fixed"), tied to a FIXES id. "As designed" renders `designed`, so every frame can be
// diffed 1:1; "With fixes" renders `fixed`. Consumers never see a Drift: the player and the fixture hooks resolve
// the whole tree first (see `resolveDrift`).

export type Drift<T = string> = { readonly __drift: true; readonly designed: T; readonly fixed: T; readonly fix: string }

/** A string that may drift between frames. */
export type Text = string | Drift<string>

/** `d('John Whitake', 'John Whitaker', 'name-john-whitaker')` */
export function d<T>(designed: T, fixed: T, fix: string): Drift<T> {
  return { __drift: true, designed, fixed, fix }
}

export function isDrift(v: unknown): v is Drift<unknown> {
  return typeof v === 'object' && v !== null && (v as { __drift?: unknown }).__drift === true
}

/** The type a fixture has once every Drift in it is resolved. */
export type Resolved<T> =
  T extends Drift<infer U> ? Resolved<U>
    : T extends string | number | boolean | null | undefined ? T
      : T extends readonly (infer E)[] ? Resolved<E>[]
        : T extends object ? { [K in keyof T]: Resolved<T[K]> }
          : T

const unknownReported = new Set<string>()

/** Whether a fix id renders: fixes are on and the fix (in the FIXES ledger) is not rejected. A Drift naming an id
 *  the ledger does not have still renders its fixed value, and is reported once on the console (the build-coverage
 *  page and the regression suite list such ids). */
export function fixApplies(id: string, mode: 'on' | 'off'): boolean {
  if (mode !== 'on') return false
  const fix = fixById(id)
  if (!fix) {
    if (!unknownReported.has(id)) { unknownReported.add(id); console.error(`Drift names fix "${id}", which is not in FIXES`) }
    return true
  }
  return fixRenders(fix, mode)
}

/** Resolve every Drift in a value (deep). Plain data only: arrays, plain objects, primitives. */
export function resolveDrift<T>(value: T, applies: (fix: string) => boolean): Resolved<T> {
  const walk = (v: unknown): unknown => {
    if (isDrift(v)) return walk(applies(v.fix) ? v.fixed : v.designed)
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {}
      for (const [k, x] of Object.entries(v)) out[k] = walk(x)
      return out
    }
    return v
  }
  return walk(value) as Resolved<T>
}

/** Resolve one Text (or any drifting value) without walking a tree. */
export function pick<T>(v: T | Drift<T>, applies: (fix: string) => boolean): T {
  return isDrift(v) ? (applies(v.fix) ? v.fixed : v.designed) : v
}

/** React: the current fix predicate, following the review bar's "As designed / With fixes" switch. */
export function useFixPredicate(): (fix: string) => boolean {
  const mode = useStore(fixesMode)
  return useCallback((fix: string) => fixApplies(fix, mode), [mode])
}

/** React: resolve a fixture against the current fixes mode (memoised on the value and the mode). */
export function useResolved<T>(value: T): Resolved<T> {
  const applies = useFixPredicate()
  return useMemo(() => resolveDrift(value, applies), [value, applies])
}
