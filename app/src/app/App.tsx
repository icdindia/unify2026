import { useEffect, useState } from 'react'
import { navigate, useRoute } from '../router/router'
import { navMode, rail, useStore } from './store'
import { screenNav } from './screenNav'
import { AppShell } from '../shell/AppShell'
import { navKeyForPath, type NavKey } from '../shell/nav'
import { ReviewBar } from '../review/ReviewBar'
import { reviewStateOf } from '../review/reviewState'
import { frameForRoute } from '../figma/frames'
import { drawnHref, ignoredKeysOf, screenFor } from './routes'
import { ScreenBoundary } from './ScreenBoundary'
import { usePageFocusAndTitle } from './pageFocus'

// The route table is in ./routes.tsx (screenFor): add new screens there, above the not-built placeholder.

export function App() {
  const route = useRoute()
  // The rail and nav stores fill the shell keys a URL leaves out, so the frame match (the shell's data-node-id, the
  // placeholder's frame) changes with them: re-render on either switch.
  useStore(rail)
  useStore(navMode)
  const screen = screenFor(route)
  const redirect = screen.kind === 'redirect' ? screen.redirect : null

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true })
  }, [redirect])

  usePageFocusAndTitle(redirect ? null : route.path, screen.kind === 'redirect' ? null : screen.title)

  // Nav selection follows the route (Q21 default): Projects for every /projects page, New Session on /new, nothing on
  // pages that are not a nav destination (the gallery) unless the screen names the row its frames draw selected (the
  // chat: New Session; app/screenNav.ts). A row with no page (Meetings) can still be selected, as in the HTML prototype;
  // the next route change takes it back. aria-current stays with the route's destination.
  const routeKey = navKeyForPath(route.path) ?? null
  const screenKey = useStore(screenNav)
  const pageKey = screenKey !== undefined ? screenKey : routeKey
  const [picked, setPicked] = useState<{ path: string; key: NavKey } | null>(null)
  if (picked && picked.path !== route.path) setPicked(null) // a route change takes a picked row back
  const selected = picked && picked.path === route.path ? picked.key : pageKey

  const review = reviewStateOf(route)

  // The shell is tagged with the frame on screen: the route without the keys its screen does not draw (a built screen
  // that has no menu= or hover= yet), the live rail and nav filling the keys the hash leaves out.
  const undrawn = ignoredKeysOf(screen)

  return (
    <AppShell
      bar={screen.kind === 'redirect' ? undefined : screen.bar}
      tools={<ReviewBar undrawn={undrawn} />}
      selected={selected}
      current={routeKey}
      onSelect={key => setPicked({ path: route.path, key })}
      onNavigate={path => navigate(path)}
      pinFigmaHovers={review === 'frame' || review === 'landing'}
      nodeId={frameForRoute(drawnHref(route, screen))?.nodeId}
      fill={screen.kind === 'screen' && !!screen.fill}
    >
      <ScreenBoundary resetKey={route.href}>{screen.kind === 'redirect' ? null : screen.content}</ScreenBoundary>
    </AppShell>
  )
}
