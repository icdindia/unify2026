import type { ReactNode } from 'react'
import { stepName } from '../figma/frames'
import { FigmaLink } from '../review/FigmaLink'
import { Link } from '../router/Link'
import { buildUrl, useUiParam } from '../router/uiParams'
import type { GalleryEntry } from './registry'
import './gallery.css'

/**
 * Layout of one gallery page: group, title, description, the Figma component sets it shows (each a link), the Figma
 * reference sheets the plan routes here, the sheet tabs, then the page's own specimens. Prototype chrome.
 */
export function GalleryPage({ entry }: { entry: GalleryEntry }) {
  const { slug, meta, Component, frames } = entry
  const [sheet] = useUiParam('sheet')
  const current = sheet ?? meta.sheets?.[0]?.id ?? null
  return (
    <article className="gallery-page" data-gallery-page={slug}>
      <header className="gallery-page__head">
        <p className="gallery-page__group">{meta.group}</p>
        <h1 className="gallery-page__title" tabIndex={-1}>{meta.title}</h1>
        {meta.description && <p className="gallery-page__desc">{meta.description}</p>}
        {meta.figmaNodeIds.length > 0 && (
          <p className="gallery-page__links">
            <span className="gallery-page__k">Figma</span>
            {meta.figmaNodeIds.map(id => <FigmaLink key={id} nodeId={id} className="gallery-page__node">{id} ↗</FigmaLink>)}
          </p>
        )}
        {frames.length > 0 && (
          <p className="gallery-page__links">
            <span className="gallery-page__k">Reference sheets</span>
            {frames.map(f => (
              <FigmaLink key={f.nodeId} nodeId={f.nodeId} className="gallery-page__node" title={f.label}>{stepName(f)} ↗</FigmaLink>
            ))}
          </p>
        )}
        {meta.sheets && meta.sheets.length > 1 && (
          <nav className="gallery-page__sheets" aria-label="Sheets">
            {meta.sheets.map((s, i) => (
              <Link key={s.id} to={buildUrl(`/gallery/${slug}`, { sheet: i === 0 ? null : s.id })} replace
                    aria-current={current === s.id ? 'page' : undefined}>
                {s.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <div className="gallery-page__body">
        <Component />
      </div>
    </article>
  )
}

/** A titled block of specimens on a gallery page. */
export function GallerySection({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="gallery-section">
      <h2 className="gallery-section__title">{title}</h2>
      {description && <p className="gallery-section__desc">{description}</p>}
      {children}
    </section>
  )
}

/** Specimens side by side: a fluid grid that wraps down to one column at phone width. */
export function Specimens({ children, min = 'md' }: { children: ReactNode; min?: 'sm' | 'md' | 'lg' }) {
  return <div className={`gallery-specimens gallery-specimens--${min}`}>{children}</div>
}

type SpecimenProps = {
  /** Variant / state name as Figma spells it, e.g. "Size=sm, State=Hover". */
  label: string
  /** Figma node of the variant, linked under the specimen. */
  nodeId?: string
  /** Span the whole row (wide components). */
  wide?: boolean
  /** Surface behind the specimen. Default: the workspace grey. */
  surface?: 'workspace' | 'primary' | 'dark'
  /** 'visible' lets a menu or popover opened in the specimen spill out of its stage (default: the stage scrolls). */
  overflow?: 'auto' | 'visible'
  children: ReactNode
}

/** One variant or state in isolation, captioned with its Figma name and node link. */
export function Specimen({ label, nodeId, wide, surface = 'workspace', overflow = 'auto', children }: SpecimenProps) {
  return (
    <figure className={'gallery-specimen' + (wide ? ' gallery-specimen--wide' : '')}>
      <div className={`gallery-specimen__stage gallery-specimen__stage--${surface}` + (overflow === 'visible' ? ' gallery-specimen__stage--spill' : '')}>
        {children}
      </div>
      <figcaption className="gallery-specimen__cap">
        <span className="gallery-specimen__label">{label}</span>
        {nodeId && <FigmaLink nodeId={nodeId} className="gallery-page__node">{nodeId} ↗</FigmaLink>}
      </figcaption>
    </figure>
  )
}
