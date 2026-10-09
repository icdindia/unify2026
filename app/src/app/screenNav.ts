import { useLayoutEffect } from 'react'
import type { NavKey } from '../shell/nav'
import { createStore } from './store'

// The nav row a screen highlights when its path is not a nav destination. App.tsx selects the route's destination
// (navKeyForPath: Projects on /projects, New Session on /new); a screen that is reached from a destination but lives on
// its own path (the chat, reached from New Session) says which row the frames draw selected. undefined: no say.
export const screenNav = createStore<NavKey | null | undefined>(undefined)

/** React: while this screen is mounted, the nav highlights `key` (null: nothing). */
export function useScreenNav(key: NavKey | null) {
  useLayoutEffect(() => {
    screenNav.set(key)
  }, [key])
  useLayoutEffect(() => () => screenNav.set(undefined), [])
}
