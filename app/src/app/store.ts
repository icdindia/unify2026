import { useSyncExternalStore } from 'react'

// A tiny observable value: prototype-wide switches (nav mode, rail, fixes on/off) live in these,
// so any component can read them without prop drilling or a state library.
export type Store<T> = { get: () => T; set: (next: T) => void; subscribe: (listener: () => void) => () => void }

export function createStore<T>(initial: T): Store<T> {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set: next => {
      if (Object.is(next, value)) return
      value = next
      listeners.forEach(l => l())
    },
    subscribe: listener => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get)
}

// Startup values can be pinned from the page URL (?mode=light&rail=collapsed&fixes=on) for reviews and diffs.
const params = new URLSearchParams(location.search)
const pick = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  const v = params.get(key) as T | null
  return v && allowed.includes(v) ? v : fallback
}

export const navMode = createStore(pick('mode', ['dark', 'light'] as const, 'dark'))
export const rail = createStore(pick('rail', ['expanded', 'collapsed'] as const, 'expanded'))
export const fixesMode = createStore(pick('fixes', ['off', 'on'] as const, 'off'))
