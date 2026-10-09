import { useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../buttons/cx'
import { scrollbar } from '../form/scrollbar'
import { ArtifactPanelContext, type ArtifactView } from '../artifact-header/ArtifactHeader'
import { useArtifactFix } from '../artifact-header/fixes'
import type { CanvasKind } from '../../fixtures/artifacts'
import { AcmeDashboard } from './acme/AcmeDashboard'
import { acmeSource } from './source'
import './artifact-canvas.css'

/** The Acme dashboard's own width: the image's content (x 14-1136), drawn 1:1 in the full-screen frame. */
export const ACME_WIDTH = 1122

export type ArtifactCanvasProps = {
  /** Which sample renders (fixtures Artifact.canvas). Only 'acme-dashboard' is rebuilt; other kinds get a short sample page. */
  kind: CanvasKind
  /** preview (the artifact) or code (its source), from the header's toggle. */
  view?: ArtifactView
  /** The artifact's name: names the scroll region and heads the sample page. */
  name: string
  /** Expanded (step 22): no frame border, the page centred at its own width. Default: from the enclosing ArtifactPanel. */
  full?: boolean
  nodeId?: string
}

/**
 * The artifact body ("Main" 1809:488587): a scroll area (Scroll bar sm) holding the page frame ("Frame 2147266806"
 * 1809:488589: bg warm-blue-25, 1px border-secondary, 16px padding). As designed the Acme page is laid out at its own
 * 1122px and zoomed to the frame (0.80 in the 440 split, 0.59 beside a 650 chat), as Figma scales its image; with fix
 * artifact-canvas-reflow it lays out at the frame's width instead. Full screen it sits centred at up to 100%.
 */
export function ArtifactCanvas({ kind, view = 'preview', name, full, nodeId }: ArtifactCanvasProps) {
  const panel = useContext(ArtifactPanelContext)
  const isFull = full ?? panel?.full ?? false
  const reflow = useArtifactFix('artifact-canvas-reflow')
  const frame = useRef<HTMLDivElement>(null)
  const [inner, setInner] = useState(0)

  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => {
      const cs = getComputedStyle(el)
      setInner(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const acme = kind === 'acme-dashboard'
  // As drawn in the split, the image's content runs from 2.4px inside the frame's left padding to its right padding
  // (20: x 523.4-1414 in a 521-1414 box), so the page is inset 3px before zoom and scaled to the rest.
  const inset = isFull ? 0 : 3
  const zoom = !acme || reflow || inner <= 0 ? 1 : isFull ? Math.min(1, inner / ACME_WIDTH) : (inner - inset * 0.8) / ACME_WIDTH
  const pageStyle: CSSProperties | undefined = acme && !reflow ? { width: ACME_WIDTH, zoom, marginLeft: isFull ? undefined : inset } : undefined

  return (
    <div
      className={cx('acanvas', scrollbar('sm'))} role="region" aria-label={`${name}, ${view === 'code' ? 'source' : 'content'}`} tabIndex={0}
      data-node-id={nodeId ?? '1809:488587'}
    >
      <div
        ref={frame} className={cx('acanvas__frame', isFull && 'acanvas__frame--full', view === 'code' && 'acanvas__frame--code')}
        data-node-id="1809:488589"
      >
        {view === 'code' ? (
          <pre className="acanvas__code" aria-label={`${name} source`}>
            <code>
              {acmeSource(name).map((line, i) => (
                <span key={i} className="acanvas__line"><span className="acanvas__ln" aria-hidden="true">{i + 1}</span>{line || ' '}</span>
              ))}
            </code>
          </pre>
        ) : (
          <div className={cx('acanvas__page', reflow && 'acanvas__page--reflow')} style={pageStyle}>
            {acme ? <AcmeDashboard /> : <SamplePage name={name} kind={kind} />}
          </div>
        )}
      </div>
    </div>
  )
}

/** Short placeholder content for the kinds Figma draws as blank pages (Q55: doc / pdf / md / ppt / json / flow / sheet). */
function SamplePage({ name, kind }: { name: string; kind: CanvasKind }) {
  return (
    <article className="acanvas__doc" data-kind={kind}>
      <h3 className="acanvas__doc-title">{name}</h3>
      <p>This {kind.replace('-', ' ')} artifact is a placeholder in the prototype: Figma draws its canvas as a blank page.</p>
      <p>Commit is $8.4M against a $9.2M quota with 34 days left. The gap is $0.8M, and six open deals carry it.</p>
    </article>
  )
}
