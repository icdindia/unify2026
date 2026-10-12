import { matchPath, type Route } from '../../router/router'
import { uiValue } from '../../router/uiParams'
import type { Screen } from '../../app/routes'
import { ArtifactsPage, type ArtifactsLandingState } from './ArtifactsPage'
import { ArtifactPage, type ArtifactPageState } from './ArtifactPage'
import { entryOf, type LandingSeed } from './collection'

// The Artifacts area: the landing (/artifacts, artifacts-landing 01-06, cloned-artifact 01) and the artifact page
// (/artifacts/:id, artifact-full-editor 01-06; /view/:id, cloned-artifact 02-03 and artifact-view-editor-main 01).
// Each reads the URL keys listed here; any other key on the route is reported as not drawn (Screen.ignored).

const SHELL = new Set(['rail', 'nav', 'vw', 'mode', 'fixes'])
const SEEDS: Record<string, LandingSeed> = { empty: 'empty', 'all-types': 'all-types', cloned: 'cloned' }

/** Keys present on the route that the screen does not draw, in URL order. */
const unread = (route: Route, read: Set<string>) => [...new Set(route.query.keys())].filter(k => !SHELL.has(k) && !read.has(k))

function landing(route: Route): Screen {
  const get = (k: string) => uiValue(route.query, k)
  const read = new Set<string>()
  const take = (k: string, ok: boolean) => { if (get(k) !== null && ok) read.add(k); return ok }

  const seedRaw = get('seed')
  const seed: LandingSeed = seedRaw && take('seed', seedRaw in SEEDS) ? SEEDS[seedRaw] : 'grid'
  const list = take('view', get('view') === 'list')
  const search = take('search', get('search') === 'open')
  const menuRaw = get('menu')
  // one menu at a time; the composite review sheet (05, pinning 01: three menus at once) is not drawn
  const menu: ArtifactsLandingState['menu'] = menuRaw === 'type-filter' && take('menu', true) ? { kind: 'type' }
    : menuRaw?.startsWith('card:') && !menuRaw.includes('+') && take('menu', true) ? { kind: 'card', id: menuRaw.slice(5) }
    : null
  const modalRaw = get('modal')
  const deleting = modalRaw?.startsWith('delete:') && take('modal', !!entryOf(modalRaw.slice(7))) ? modalRaw.slice(7) : null
  const hoverNew = take('hover', get('hover') === 'new-artifact')

  return {
    kind: 'screen', title: 'Artifacts', ignored: unread(route, read),
    content: <ArtifactsPage state={{ seed, list, search, menu, deleting, hoverNew }} />,
  }
}

function artifactPage(route: Route, id: string, view: boolean): Screen | null {
  const get = (k: string) => uiValue(route.query, k)
  const role = get('role')
  // the viewer / commenter views (artifact-view-viewer, commenters) are their own journeys, not built yet
  if (view && role && role !== 'editor') return null
  const entry = entryOf(id)
  if (!entry) return { kind: 'redirect', redirect: '/artifacts' }
  const read = new Set<string>(['role'].filter(k => get(k) === 'editor'))
  const take = (k: string, ok: boolean) => { if (get(k) !== null && ok) read.add(k); return ok }
  const menuRaw = get('menu')
  const state: ArtifactPageState = {
    view,
    fromArtifacts: take('from', get('from') === 'artifacts'),
    menu: menuRaw === 'name' && take('menu', true) ? 'name' : menuRaw === 'name>versions' && take('menu', true) ? 'versions' : null,
    editing: take('edit', get('edit') === 'name'),
    hoverBack: take('hover', get('hover') === 'back'),
    deleting: take('modal', get('modal') === `delete:${id}`),
  }
  const name = typeof entry.name === 'string' ? entry.name : entry.name.designed
  // /view/:id stands alone (no app nav: every frame of it is drawn full width); /artifacts/:id sits in the app shell
  return { kind: 'screen', title: name, fill: true, standalone: view, ignored: unread(route, read), content: <ArtifactPage id={id} state={state} /> }
}

/** The Artifacts screens for a route, or null when the route is not theirs. */
export function artifactsScreen(route: Route): Screen | null {
  if (route.path === '/artifacts') return landing(route)
  const full = matchPath('/artifacts/:id', route.path)
  if (full) return artifactPage(route, full.id, false)
  const view = matchPath('/view/:id', route.path)
  if (view) return artifactPage(route, view.id, true)
  return null
}
