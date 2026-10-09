import type { ComponentType } from 'react'
import { FRAMES, type FrameRef } from '../figma/frames'

// The component gallery (/gallery, /gallery/<page>): the dev team's lookup of every primitive in isolation, with its
// Figma component set and link. Pages are discovered, not registered: drop a file in ./pages/<kebab-name>.tsx that
//   - default-exports a React component showing every variant / state side by side (the GalleryPage layout adds the
//     title, the group and the Figma links around it; Specimen / Specimens / GallerySection help lay it out), and
//   - exports `meta: GalleryMeta`.
// The page is then at #/gallery/<kebab-name>; ?sheet=<id> selects one of its `sheets` (read it with useUiParam('sheet')).

export type GalleryMeta = {
  title: string
  /** Figma component set / instance ids the page shows (first one first). */
  figmaNodeIds: string[]
  /** Index heading the page is listed under, e.g. 'Overlays', 'Forms', 'Composer'. */
  group: string
  /** One line under the title. */
  description?: string
  /** Named reference sheets or states, shown as tabs (?sheet=<id>); the first is the default. */
  sheets?: { id: string; label: string }[]
}

type GalleryModule = { default?: ComponentType; meta?: Partial<GalleryMeta> }

export type GalleryEntry = {
  slug: string
  meta: GalleryMeta
  Component: ComponentType
  /** Frames of the Figma page that the plan routes to this gallery page (reference sheets, kind G). */
  frames: FrameRef[]
}

const modules = import.meta.glob<GalleryModule>('./pages/*.tsx', { eager: true })

const slugOf = (file: string) => file.replace(/^.*\//, '').replace(/\.tsx$/, '')
const titleOf = (slug: string) => slug.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())

/** Frames routed to /gallery/<slug> (with or without ?sheet=). */
export const galleryFrames = (slug: string) =>
  FRAMES.filter(f => f.route === `/gallery/${slug}` || f.route.startsWith(`/gallery/${slug}?`))

const Missing: ComponentType = () => null

export const GALLERY_PAGES: GalleryEntry[] = Object.entries(modules)
  .map(([file, mod]): GalleryEntry => {
    const slug = slugOf(file)
    const meta = mod.meta ?? {}
    if (!mod.default || !mod.meta) console.warn(`gallery/pages/${slug}.tsx: expected a default export and a \`meta\` export`)
    return {
      slug,
      meta: {
        title: meta.title ?? titleOf(slug),
        figmaNodeIds: Array.isArray(meta.figmaNodeIds) ? meta.figmaNodeIds : [],
        group: meta.group ?? 'Ungrouped',
        description: meta.description,
        sheets: meta.sheets,
      },
      Component: mod.default ?? Missing,
      frames: galleryFrames(slug),
    }
  })
  .sort((a, b) => a.meta.group.localeCompare(b.meta.group) || a.meta.title.localeCompare(b.meta.title))

export const galleryPage = (slug: string) => GALLERY_PAGES.find(p => p.slug === slug)

/** Gallery slugs the plan routes reference sheets to (kind G) that no page file provides yet. */
export const PLANNED_PAGES: { slug: string; frames: FrameRef[] }[] = (() => {
  const slugs = new Set<string>()
  for (const f of FRAMES) {
    const m = /^\/gallery\/([^/?]+)/.exec(f.route)
    if (m) slugs.add(m[1])
  }
  return [...slugs].filter(s => !galleryPage(s)).map(slug => ({ slug, frames: galleryFrames(slug) }))
})()
