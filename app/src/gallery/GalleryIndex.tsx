import { stepName } from '../figma/frames'
import { FigmaLink } from '../review/FigmaLink'
import { Link } from '../router/Link'
import { GALLERY_PAGES, PLANNED_PAGES } from './registry'
import './gallery.css'

/** The heading id of a group section: "Review harness" -> "g-review-harness" (no spaces, so it is a single IDREF). */
const groupId = (group: string) => `g-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

/** /gallery: every page in ./pages, grouped, then the Figma reference sheets that are planned but have no page yet. */
export function GalleryIndex() {
  const groups = new Map<string, typeof GALLERY_PAGES>()
  for (const page of GALLERY_PAGES) groups.set(page.meta.group, [...(groups.get(page.meta.group) ?? []), page])

  return (
    <article className="gallery-page gallery-index">
      <header className="gallery-page__head">
        <p className="gallery-page__group">Enterprise Brain prototype</p>
        <h1 className="gallery-page__title" tabIndex={-1}>Component gallery</h1>
        <p className="gallery-page__desc">
          Every primitive in isolation, with its Figma component set. {GALLERY_PAGES.length} page{GALLERY_PAGES.length === 1 ? '' : 's'}.
          Add one by dropping a file in <code>src/gallery/pages/</code> (see <code>src/gallery/registry.ts</code>).
        </p>
      </header>

      {[...groups].map(([group, pages]) => (
        // an id is one IDREF token: "Review harness" would make aria-labelledby point at two missing ids
        <section key={group} className="gallery-section" aria-labelledby={groupId(group)}>
          <h2 id={groupId(group)} className="gallery-section__title">{group}</h2>
          <ul className="gallery-index__list">
            {pages.map(p => (
              <li key={p.slug} className="gallery-index__item">
                <Link className="gallery-index__link" to={`/gallery/${p.slug}`}>{p.meta.title}</Link>
                {p.meta.description && <p className="gallery-index__desc">{p.meta.description}</p>}
                <p className="gallery-index__meta">
                  <code>#/gallery/{p.slug}</code>
                  {p.meta.figmaNodeIds.length > 0 && <span>{p.meta.figmaNodeIds.length} Figma node{p.meta.figmaNodeIds.length === 1 ? '' : 's'}</span>}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {PLANNED_PAGES.length > 0 && (
        <section className="gallery-section" aria-labelledby="g-planned">
          <h2 id="g-planned" className="gallery-section__title">Reference sheets not built yet</h2>
          <p className="gallery-section__desc">Routed in the plan (kind G); each URL shows its Figma reference until the page exists.</p>
          <ul className="gallery-index__list">
            {PLANNED_PAGES.map(p => (
              <li key={p.slug} className="gallery-index__item">
                <Link className="gallery-index__link" to={p.frames[0]?.route ?? `/gallery/${p.slug}`}>{p.slug}</Link>
                <p className="gallery-index__meta">
                  {p.frames.map(f => (
                    <FigmaLink key={f.nodeId} nodeId={f.nodeId} className="gallery-page__node" title={f.label}>{stepName(f)} ↗</FigmaLink>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
