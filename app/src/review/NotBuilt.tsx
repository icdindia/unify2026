import type { ReactNode } from 'react'
import { buildUrl, canonicalHref } from '../router/uiParams'
import { framesForRoute, journeyById, stepName, type FrameKind, type FrameMatch } from '../figma/frames'
import { Link } from '../router/Link'
import { matchPath, type Route } from '../router/router'
import { FigmaLink } from './FigmaLink'
import { RefImage } from './RefImage'
import './not-built.css'

// Screens of the Chat + Artifacts plan that no agent has built yet still resolve: their URL renders this placeholder
// with the frame record (journey and step, what Figma shows, the reference PNG, the Figma link) instead of bouncing to
// the Projects page. App.tsx falls back to it after every built route. Prototype chrome, not part of the design.

/** Screen templates of BUILD-PLAN 2.1. A URL on one of these paths is a planned screen even when no frame matches it. */
const TEMPLATES: { pattern: string; name: string }[] = [
  { pattern: '/new', name: 'Landing (New Session)' },
  { pattern: '/chat/:chat', name: 'Chat' },
  { pattern: '/chat/:chat/:artifact', name: 'Chat + artifact split' },
  { pattern: '/artifacts', name: 'Artifacts landing' },
  { pattern: '/artifacts/:artifact', name: 'Artifact full view (in the shell)' },
  { pattern: '/view/:artifact', name: 'Artifact standalone (no shell)' },
  { pattern: '/routines', name: 'Routines landing' },
  { pattern: '/gallery/:sheet', name: 'Component gallery sheet' },
]

const KIND: Record<FrameKind, string> = {
  N: 'new screen', S: 'same screen, UI state', T: 'same screen, time passing', R: 'responsive width',
  G: 'reference sheet', A: 'alias of another step', '-': 'not a screen',
}

export const templateFor = (path: string) => TEMPLATES.find(t => matchPath(t.pattern, path))

export type PlaceholderScreen = { title: string; content: ReactNode }

/** The placeholder for a route no screen handles yet, or null when the route is neither a frame nor a planned template. */
export function notBuiltScreen(route: Route): PlaceholderScreen | null {
  const matches = framesForRoute(route.href)
  const template = templateFor(route.path)
  if (!matches.length && !template) return null
  const first = matches[0]?.frame
  const title = first ? `Not built yet: ${first.journey} step ${first.stepId ?? first.step}` : `Not built yet: ${template!.name}`
  return { title, content: <NotBuilt route={route} matches={matches} templateName={template?.name} title={title} /> }
}

type Props = { route: Route; matches: FrameMatch[]; templateName?: string; title: string }

export function NotBuilt({ route, matches, templateName, title }: Props) {
  const first = matches[0]?.frame
  const journey = first ? journeyById(first.journey) : undefined
  const exact = matches.some(m => m.exact)
  return (
    <section className="not-built" data-frame={first?.nodeId} aria-labelledby="not-built-title">
      <header className="not-built__head">
        <p className="not-built__eyebrow">Prototype placeholder</p>
        <h1 id="not-built-title" className="not-built__title" tabIndex={-1}>{title}</h1>
        <p className="not-built__lede">
          {first ? (
            <>
              {journey ? <>{journey.title} · </> : null}
              {templateName ?? 'Screen'} template. {exact
                ? 'This URL is the canonical prototype URL of the frame below; the screen has not been built yet.'
                : 'No frame is drawn for exactly this state; the closest frame is shown (a pinned hover, the rail, the nav mode or the width differ).'}
            </>
          ) : (
            <>This URL is on the {templateName} template, which has not been built yet, and no Figma frame is drawn for this state.</>
          )}
        </p>
        <p className="not-built__url">
          <span className="not-built__k">URL</span> <code>#{canonicalHref(route.href)}</code>
        </p>
      </header>

      {matches.map(m => (
        <FrameCard key={`${m.frame.journey}/${m.frame.step}`} match={m} />
      ))}

      <p className="not-built__foot">
        Step through the journey with ‹ › in the review bar, or see every frame on the <Link to={buildUrl('/gallery/frame-map', first ? { sheet: first.journey } : {})}>frame map</Link>.
      </p>
    </section>
  )
}

function FrameCard({ match: { frame, exact } }: { match: FrameMatch }) {
  const journey = journeyById(frame.journey)
  return (
    <article className="not-built__frame" data-frame={frame.nodeId} aria-label={stepName(frame)}>
      <div className="not-built__meta">
        <h2 className="not-built__step">{stepName(frame)}{exact ? '' : ' (closest)'}</h2>
        {frame.kind && <span className="not-built__kind" title={KIND[frame.kind]}>{frame.kind} · {KIND[frame.kind]}</span>}
        {frame.size && <span className="not-built__size">{frame.size[0]}×{frame.size[1]}{frame.viewport ? ` · drawn at ${frame.viewport} px wide` : ''}</span>}
        <FigmaLink nodeId={frame.nodeId} title={journey?.title}>Open {frame.nodeId} in Figma ↗</FigmaLink>
      </div>
      <p className="not-built__label">{frame.label}</p>
      {(frame.aliasOf || frame.note) && (
        <p className="not-built__note">
          {frame.aliasOf && <>Same URL as {frame.aliasOf}. </>}
          {frame.note && frame.note.replace(/^\(|\)$/g, '')}
        </p>
      )}
      <div className="not-built__ref">
        <RefImage frame={frame} alt={`Figma reference for ${stepName(frame)}: ${frame.label}`} />
      </div>
    </article>
  )
}
