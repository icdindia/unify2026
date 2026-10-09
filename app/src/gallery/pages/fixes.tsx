import { fixesMode, useStore } from '../../app/store'
import { FIX_SOURCES, FIXES, type Fix } from '../../fixes/fixes'
import { FigmaLink } from '../../review/FigmaLink'
import { navigate } from '../../router/router'
import { GallerySection } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './fixes.css'

export const meta: GalleryMeta = {
  title: 'Fixes ledger',
  figmaNodeIds: [],
  group: 'Review harness',
  description:
    'Every deliberate departure from the Figma file, with what Figma draws, what the prototype does instead and why. ' +
    '"With fixes" in the review bar switches all of them on; "As designed" renders the frames as drawn. Approved fixes are ' +
    'copied to the "Prototype fixes" page in Figma.',
}

function FixCard({ fix }: { fix: Fix }) {
  const mode = useStore(fixesMode)
  const show = () => { fixesMode.set('on'); navigate(fix.route) }
  return (
    <article className="fx" data-fix={fix.id} aria-labelledby={`fx-${fix.id}`}>
      <header className="fx__head">
        <h3 id={`fx-${fix.id}`} className="fx__title">{fix.title}</h3>
        <code className="fx__id">{fix.id}</code>
        <span className={`fx__status fx__status--${fix.status}`}>{fix.status}</span>
      </header>
      <dl className="fx__body">
        <dt>As designed</dt><dd>{fix.before}</dd>
        <dt>With the fix</dt><dd>{fix.after}</dd>
        <dt>Why</dt><dd>{fix.why}</dd>
      </dl>
      <footer className="fx__foot">
        {fix.figmaNodeIds.length > 0 && (
          <span className="fx__nodes">
            <span className="gallery-page__k">Figma</span>
            {fix.figmaNodeIds.map(id => <FigmaLink key={id} nodeId={id} className="gallery-page__node">{id} ↗</FigmaLink>)}
          </span>
        )}
        <button type="button" className="fx__show" onClick={show}>
          {mode === 'on' ? 'Open' : 'Open with fixes on'}: <code>#{fix.route}</code>
        </button>
      </footer>
    </article>
  )
}

export default function FixesLedger() {
  return (
    <>
      <p>{FIXES.length} fixes, all <b>{[...new Set(FIXES.map(f => f.status))].join(' / ')}</b>. Each module writes its own list; src/fixes/fixes.ts gathers them.</p>
      {FIX_SOURCES.map(s => (
        <GallerySection key={s.id} title={`${s.label} (${s.fixes.length})`} description={<code>{s.file}</code>}>
          <div className="fx-list">
            {s.fixes.map(f => <FixCard key={f.id} fix={f} />)}
          </div>
        </GallerySection>
      ))}
    </>
  )
}
