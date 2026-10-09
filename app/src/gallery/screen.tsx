import type { ReactNode } from 'react'
import { matchPath, type Route } from '../router/router'
import { Link } from '../router/Link'
import { notBuiltScreen } from '../review/NotBuilt'
import { framesForRoute } from '../figma/frames'
import { GalleryIndex } from './GalleryIndex'
import { GalleryPage } from './GalleryPage'
import { galleryPage } from './registry'
import './gallery.css'

/** `placeholder`: the "Not built yet" record of a reference sheet the plan routes here before its page exists. */
export type GalleryScreen = { title: string; bar: ReactNode; content: ReactNode; placeholder?: boolean }

/** "Gallery / <page>" in the shell's top strip. */
function GalleryCrumbs({ title }: { title?: string }) {
  return (
    <nav className="gallery-crumbs" aria-label="Breadcrumb">
      {title ? <Link to="/gallery">Gallery</Link> : <span aria-current="page">Gallery</span>}
      {title && (
        <>
          <span className="gallery-crumbs__slash" aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </>
      )}
    </nav>
  )
}

/**
 * The /gallery routes: the index, a page from ./pages, the "Not built yet" placeholder for a Figma reference sheet the
 * plan routes here before its page exists, or a short notice for an unknown page. null for any other path.
 */
export function galleryScreen(route: Route): GalleryScreen | null {
  if (route.path === '/gallery') return { title: 'Gallery', bar: <GalleryCrumbs />, content: <GalleryIndex /> }
  const m = matchPath('/gallery/:page', route.path)
  if (!m) return null
  const entry = galleryPage(m.page)
  if (entry) {
    return { title: `${entry.meta.title} · Gallery`, bar: <GalleryCrumbs title={entry.meta.title} />, content: <GalleryPage key={entry.slug} entry={entry} /> }
  }
  if (framesForRoute(route.href).length) {
    const placeholder = notBuiltScreen(route)
    if (placeholder) return { ...placeholder, bar: <GalleryCrumbs title={m.page} />, placeholder: true }
  }
  return {
    title: 'Gallery',
    bar: <GalleryCrumbs title={m.page} />,
    content: (
      <article className="gallery-page">
        <h1 className="gallery-page__title" tabIndex={-1}>No gallery page named “{m.page}”</h1>
        <p className="gallery-page__desc">
          Pages live in <code>src/gallery/pages/{m.page}.tsx</code>. <Link to="/gallery">See every page</Link>.
        </p>
      </article>
    ),
  }
}
