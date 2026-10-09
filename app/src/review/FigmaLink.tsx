import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { figmaUrl } from '../figma/frames'
import './figma-link.css'

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

type Props = {
  nodeId: string
  /** Visible text; defaults to "Figma <node> ↗". */
  children?: ReactNode
  /** Tooltip, e.g. the step and what the frame shows. */
  title?: string
  /** Accessible name when the visible text is only a node id. */
  label?: string
  className?: string
}

/**
 * A link to a Figma node that opens in a new tab. A sandboxed preview pane without allow-popups blocks new tabs, and an
 * <a target="_blank"> fails silently there, so a plain click opens the tab from script, which reports the block. When
 * blocked, the URL is copied to the clipboard, or, where that is blocked too, shown selected for copying. Escape (or
 * Enter) on that field turns it back into the link and puts focus on the link, so keyboard users are not dropped on
 * <body>; tabbing or clicking away just turns it back.
 */
export function FigmaLink({ nodeId, children, title, label, className }: Props) {
  const url = figmaUrl(nodeId)
  const [fallback, setFallback] = useState<'copied' | 'show' | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const refocus = useRef(false) // the field was dismissed from the keyboard: focus the link that replaces it

  useLayoutEffect(() => {
    if (fallback === 'show' || !refocus.current) return
    refocus.current = false
    linkRef.current?.focus()
  }, [fallback])

  useEffect(() => {
    if (fallback !== 'copied') return
    const t = window.setTimeout(() => setFallback(null), 2500)
    return () => window.clearTimeout(t)
  }, [fallback])

  const open = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return // new-tab gestures stay with the browser
    e.preventDefault()
    const tab = window.open(url, '_blank')
    if (tab) {
      try { tab.opener = null } catch { /* already cross-origin: nothing to cut */ }
      return
    }
    if (!navigator.clipboard) return setFallback('show')
    navigator.clipboard.writeText(url).then(() => setFallback('copied'), () => setFallback('show'))
  }

  if (fallback === 'show') {
    return (
      <input
        className="figma-link__url"
        readOnly
        value={url}
        aria-label={`Figma link to node ${nodeId} (new tabs are blocked here: copy it)`}
        onFocus={e => e.currentTarget.select()}
        onBlur={() => setFallback(null)}
        onKeyDown={e => {
          if (e.key !== 'Escape' && e.key !== 'Enter') return
          e.preventDefault() // Escape must not also close the review popover around it
          refocus.current = true
          setFallback(null)
        }}
        autoFocus
      />
    )
  }
  return (
    <a ref={linkRef} className={className ?? 'figma-link'} href={url} target="_blank" rel="noreferrer" onClick={open} title={title}
       aria-label={fallback === 'copied' ? undefined : label}>
      {fallback === 'copied' ? 'Figma link copied' : (children ?? `Figma ${nodeId} ↗`)}
    </a>
  )
}
