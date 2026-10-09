import {
  createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState,
  type KeyboardEvent, type PointerEvent, type ReactNode,
} from 'react'
import { cx } from '../buttons/cx'
import { rail } from '../../app/store'
import './split-view.css'

/** Chat column defaults (BUILD-PLAN Q8, accepted): 440 wide, resizable 360-650. */
export const CHAT_WIDTH = { default: 440, min: 360, max: 650 } as const
/** The artifact keeps at least this much when the window is narrow (the chat gives way first). */
export const MIN_ARTIFACT_WIDTH = 480
/** Below this split width (a 1024 window minus the 56 rail) the artifact opens over the chat (Appendix B, 768-1023). */
export const STACK_BELOW = 968
/**
 * The files dropdown over the chat column while an artifact is open (chat-artifact 19 13722:383349, annotation "when a
 * artifact is open - fixed height 720"): 384 wide, its top 2px under the 40px chat header, 12px in from the column's right.
 * SplitView's `chatOverlay` slot is placed there; the panel inside fills it (height 100%) and scrolls itself.
 */
export const SPLIT_FILES_DROPDOWN = { top: 42, right: 12, width: 384, height: 720 } as const

type SplitState = { full: boolean; stacked: boolean; chatWidth: number }
const SplitContext = createContext<SplitState | null>(null)

/** The enclosing split's state (null outside a SplitView): the artifact panel reads full / stacked from it. */
export function useSplitView(): SplitState | null {
  return useContext(SplitContext)
}

/**
 * Collapse the rail while `active` (the split is open), as BUILD-PLAN Q9 accepted: the rail is the user's choice and
 * auto-collapses when the split opens. On close it goes back to expanded, unless the user changed it meanwhile.
 * (router.ts rewrites a rail=… key the hash pins, so the URL keeps describing the screen.)
 */
export function useRailAutoCollapse(active = true) {
  useEffect(() => {
    if (!active || rail.get() !== 'expanded') return
    rail.set('collapsed')
    let userChanged = false
    const stop = rail.subscribe(() => { userChanged = true })
    return () => {
      stop()
      if (!userChanged && rail.get() === 'collapsed') rail.set('expanded')
    }
  }, [active])
}

export type SplitViewProps = {
  /** The chat column: its header, thread and composer (the screens build it; "Frame 2147266136" 6213:501974). */
  chat: ReactNode
  /** The artifact side: usually <ArtifactPanel header={<ArtifactHeader …/>}><ArtifactCanvas …/></ArtifactPanel>. */
  artifact: ReactNode
  /** Floats over the chat column at SPLIT_FILES_DROPDOWN (the files dropdown, step 19). */
  chatOverlay?: ReactNode
  /** The artifact is expanded over the chat (step 22, full=1): the chat stays mounted but hidden. */
  full?: boolean
  /** Controlled chat width (the review key cw=650). Omit to let the split own it, starting at `defaultChatWidth`. */
  chatWidth?: number
  defaultChatWidth?: number
  /** Called while dragging / on each key step, with the clamped width. */
  onChatWidthChange?: (width: number) => void
  minChatWidth?: number
  maxChatWidth?: number
  /** Collapse the rail while the split is open (default true; gallery specimens turn it off). */
  autoCollapseRail?: boolean
  /** Accessible name of the chat column. */
  chatLabel?: string
  nodeId?: string
  className?: string
}

const STEP = 10
const BIG_STEP = 50

/**
 * Chat + artifact split ("Frame 2147265764" 1809:488482): the chat column on the left (default 440) and the artifact
 * panel on the right, with a drag handle (1809:488594) between them. The handle is a vertical separator: drag it, or
 * focus it and use ← → (Shift for 50px), Home / End, and double-click it to go back to 440. Widths are clamped to
 * 360-650 and never squeeze the artifact under 480. Under 968px of width the artifact opens over the chat instead.
 */
export function SplitView({
  chat, artifact, chatOverlay, full = false, chatWidth, defaultChatWidth = CHAT_WIDTH.default, onChatWidthChange,
  minChatWidth = CHAT_WIDTH.min, maxChatWidth = CHAT_WIDTH.max, autoCollapseRail = true, chatLabel = 'Chat', nodeId, className,
}: SplitViewProps) {
  const chatId = useId()
  const root = useRef<HTMLDivElement>(null)
  const [inner, setInner] = useState(defaultChatWidth)
  const [rootWidth, setRootWidth] = useState(0)
  const [dragging, setDragging] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => setRootWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stacked = rootWidth > 0 && rootWidth < STACK_BELOW
  useRailAutoCollapse(autoCollapseRail)

  // the room the artifact needs caps the chat before maxChatWidth does
  const max = Math.max(minChatWidth, Math.min(maxChatWidth, rootWidth ? rootWidth - MIN_ARTIFACT_WIDTH : maxChatWidth))
  const clamp = useCallback((w: number) => Math.round(Math.min(max, Math.max(minChatWidth, w))), [max, minChatWidth])
  const width = clamp(chatWidth ?? inner)

  const set = useCallback((w: number) => {
    const next = clamp(w)
    setInner(next)
    onChatWidthChange?.(next)
  }, [clamp, onChatWidthChange])

  const drag = useRef<{ x: number; w: number } | null>(null)
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus({ preventScroll: true })
    drag.current = { x: e.clientX, w: width }
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    set(drag.current.w + e.clientX - drag.current.x)
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? BIG_STEP : STEP
    let next: number
    if (e.key === 'ArrowLeft') next = width - step
    else if (e.key === 'ArrowRight') next = width + step
    else if (e.key === 'Home') next = minChatWidth
    else if (e.key === 'End') next = max
    else if (e.key === 'Enter') next = defaultChatWidth
    else return
    e.preventDefault()
    set(next)
  }

  const showChat = !full && !stacked
  return (
    <SplitContext.Provider value={{ full: full || stacked, stacked, chatWidth: width }}>
      <div
        ref={root}
        className={cx('split', (full || stacked) && 'split--full', stacked && 'split--stacked', dragging && 'is-resizing', className)}
        data-node-id={nodeId ?? '1809:488482'}
      >
        <section id={chatId} className="split__chat" aria-label={chatLabel} hidden={!showChat} style={{ width }} data-node-id="6213:501974">
          {chat}
          {chatOverlay && showChat && <div className="split__overlay">{chatOverlay}</div>}
        </section>
        {showChat && (
          <div
            role="separator" aria-orientation="vertical" aria-label="Resize chat" aria-controls={chatId}
            aria-valuenow={width} aria-valuemin={minChatWidth} aria-valuemax={max} tabIndex={0}
            className="split__handle" style={{ left: width }} data-node-id="1809:488594"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
            onLostPointerCapture={endDrag} onDoubleClick={() => set(defaultChatWidth)} onKeyDown={onKeyDown}
          />
        )}
        <div className="split__art">{artifact}</div>
      </div>
    </SplitContext.Provider>
  )
}
