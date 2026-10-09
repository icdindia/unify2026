import { useState, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { ArtifactPanelContext } from '../artifact-header/ArtifactHeader'
import { useSplitView } from './SplitView'

export type ArtifactPanelProps = {
  /** The bar: <ArtifactHeader …/>. It reads full / stacked and its menu container from this panel. */
  header: ReactNode
  /** The body: <ArtifactCanvas …/>. It fills the height left under the header and scrolls itself. */
  children: ReactNode
  /** Accessible name of the region, e.g. the artifact's name. */
  label: string
  /** Between the header and the canvas (e.g. the "Viewing v2" bar). */
  banner?: ReactNode
  /** Expanded over the chat. Default: from the enclosing SplitView. */
  full?: boolean
  nodeId?: string
  className?: string
}

/**
 * The artifact side of the split ("Frame 2147266834" 4376:395812 + "Canvas" 4376:395815): a card 8px in from the
 * column (927 x 884 at 1440 beside a 440 chat), radius 12, a 1px border-primary ring drawn over its content, a soft
 * 0 4 4 shadow, bg-workspace. Expanded (full) it loses the card and becomes the page under its header (step 22).
 * Menus the header opens render inside it, so they scroll and clamp with the panel.
 */
export function ArtifactPanel({ header, children, label, banner, full, nodeId, className }: ArtifactPanelProps) {
  const split = useSplitView()
  const isFull = full ?? split?.full ?? false
  const stacked = split?.stacked ?? false
  const [el, setEl] = useState<HTMLElement | null>(null)
  return (
    <ArtifactPanelContext.Provider value={{ container: el, full: isFull, stacked }}>
      <section
        ref={setEl} aria-label={label} className={cx('apanel', isFull && 'apanel--full', className)}
        data-node-id={nodeId ?? '4376:395815'}
      >
        {header}
        {banner}
        <div className="apanel__body">{children}</div>
      </section>
    </ArtifactPanelContext.Provider>
  )
}
