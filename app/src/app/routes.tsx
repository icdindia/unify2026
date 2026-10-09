import type { ReactNode } from 'react'
import { matchPath, type Route } from '../router/router'
import { withUi } from '../router/uiParams'
import { pageOptionOf, reviewStateOf } from '../review/reviewState'
import { galleryScreen } from '../gallery/screen'
import { notBuiltScreen } from '../review/NotBuilt'
import { projectBySlug } from '../data/projects'
import { ProjectsPage } from '../screens/projects/ProjectsPage'
import { ProjectDashboard } from '../screens/project-dashboard/ProjectDashboard'
import { ProjectCrumbs } from '../screens/project-dashboard/ProjectCrumbs'
import { LandingPage } from '../screens/landing/LandingPage'
import { landingState } from '../screens/landing/route'
import { ChatScreen } from '../screens/chat/ChatScreen'
import { chatPathOf, chatRouteState } from '../screens/chat/route'
import { journeyFrameOf } from '../screens/chat/drawn'
import { SCRIPTS } from '../fixtures/scripts'

// The route table (hash routes, see router/router.ts). Kept apart from App.tsx so the review harness (the build
// coverage page, the regression suite through it) can ask how any URL resolves without rendering the app.

export const HOME = '/projects' // the only designed landing so far

/** What a route renders: a built screen ('screen'), a gallery page, the not-built placeholder, or a redirect. */
export type ScreenKind = 'screen' | 'gallery' | 'placeholder' | 'redirect'

export type Screen =
  | {
      kind: Exclude<ScreenKind, 'redirect'>
      title: string
      bar?: ReactNode
      content: ReactNode
      /**
       * Built screens only: the keys of the URL the screen does not draw (a menu, a pinned hover, a seed it has no data
       * for yet). The screen shows the route without them, so the review bar calls the frame a closest match ("≈"),
       * the shell is tagged with the frame that is drawn, and build coverage does not count the frame as built.
       */
      ignored?: string[]
      /** The screen draws its own top strip (or none) and fills the main area; the review tools float (AppShell `fill`). */
      fill?: boolean
    }
  | { kind: 'redirect'; redirect: string }

/**
 * Keys every screen carries without drawing them itself: the shell's rail and nav (router.ts applies them), the width a
 * frame is drawn at, and the prototype switches read before the '#' (app/store.ts).
 */
const SHELL_KEYS = new Set(['rail', 'nav', 'vw', 'mode', 'fixes'])

/** The keys of `route` that a screen reading only `reads` (and the shell keys) leaves undrawn, in URL order. */
const ignoredBy = (route: Route, reads: readonly string[]): string[] =>
  [...new Set(route.query.keys())].filter(k => !SHELL_KEYS.has(k) && !reads.includes(k))

// The URL keys each built screen draws. Add a key here when the screen starts to read it (for the Projects landing,
// menu=card:<slug> and hover=menu:pin would make pinning 02 an exact frame).
const PROJECTS_READS = ['state'] as const // the review states (review/reviewState.ts)
const DASHBOARD_READS = ['state', 'opt'] as const // the review states and the inside-page option

/**
 * The screen for a route. Order matters: the gallery, then the built screens, then (last) the "Not built yet"
 * placeholder for any URL that is a Figma frame or sits on a planned template path. New screens go above the placeholder.
 */
export function screenFor(route: Route): Screen {
  const review = reviewStateOf(route)
  const gallery = galleryScreen(route) // '/gallery' and '/gallery/:page' (gallery/screen.tsx)
  if (gallery) return { kind: gallery.placeholder ? 'placeholder' : 'gallery', ...gallery }
  if (route.path === '/projects') {
    return { kind: 'screen', title: 'Projects', content: <ProjectsPage review={review} />, ignored: ignoredBy(route, PROJECTS_READS) }
  }
  const dashboard = matchPath('/projects/:slug', route.path)
  if (dashboard) {
    const project = projectBySlug(dashboard.slug)
    if (!project) return { kind: 'redirect', redirect: HOME }
    return {
      kind: 'screen',
      title: project.name,
      bar: <ProjectCrumbs project={project} />,
      // keyed by project and option, so switching either starts with every menu closed (as the prototype's setOpt)
      content: <ProjectDashboard key={`${project.slug}:${pageOptionOf(route)}`} project={project} option={pageOptionOf(route)} review={review} />,
      ignored: ignoredBy(route, DASHBOARD_READS),
    }
  }
  // New Session (chat-artifact 01-02). Instance ids of the frame on screen go on its parts.
  if (route.path === '/new') {
    const s = landingState(route)
    const href = withUi(route.href, Object.fromEntries(s.ignored.map(k => [k, null])))
    const frame = journeyFrameOf(href)
    const instances = frame?.stepId === '01' ? { composer: '5546:229297', banner: '2532:73193', mark: '3494:215623' }
      : frame?.stepId === '02' ? { composer: '5546:229571', banner: '2532:73269', mark: '3494:215679' } : undefined
    return {
      kind: 'screen', title: 'New Session', fill: true, ignored: s.ignored,
      content: <LandingPage compose={s.compose} hover={s.hover} noChips={s.noChips} instances={instances} />,
    }
  }
  // The commit chat (chat-artifact 03-18) and its artifact split (19-22). One component for both paths, so opening the
  // artifact keeps the chat's playback; keyed by nothing else.
  const chat = chatPathOf(route.path)
  if (chat) {
    const s = chatRouteState(route, chat.artifact)
    const href = withUi(route.href, Object.fromEntries(s.ignored.map(k => [k, null])))
    const title = typeof SCRIPTS.commit.title === 'string' ? SCRIPTS.commit.title : SCRIPTS.commit.title.designed
    return {
      kind: 'screen', title, fill: true, ignored: s.ignored,
      content: <ChatScreen state={s} frame={journeyFrameOf(href)} />,
    }
  }
  // Keep this fallback last: a planned screen that is not built yet shows its frame record (review/NotBuilt.tsx).
  const placeholder = notBuiltScreen(route)
  if (placeholder) return { kind: 'placeholder', ...placeholder }
  return { kind: 'redirect', redirect: HOME } // '/', unknown paths, and slugs that cannot be decoded
}

/** How a URL resolves, without rendering it. */
export const screenKindOf = (route: Route): ScreenKind => screenFor(route).kind

/** The keys of the route its screen does not draw ([] for gallery pages, placeholders and redirects). */
export const ignoredKeysOf = (screen: Screen): string[] => (screen.kind === 'screen' && screen.ignored) || []

/** The route as its screen draws it: without the keys the screen ignores (what the shell's data-node-id goes by). */
export function drawnHref(route: Route, screen: Screen = screenFor(route)): string {
  const ignored = ignoredKeysOf(screen)
  return ignored.length ? withUi(route.href, Object.fromEntries(ignored.map(k => [k, null]))) : route.href
}
