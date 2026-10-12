import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { navMode, rail, useStore } from '../app/store'
import { Nav, Rail, requestNavFocus, type NavKey, type NavPages } from './nav'
import { useMediaQuery } from './useMediaQuery'
import './app-shell.css'

/** Below this width the nav auto-collapses to the rail; expanding it then overlays the page with a scrim. */
export const NARROW_QUERY = '(max-width: 1199.98px)'

// Menus are absolutely positioned inside the page's scroll area, so they scroll with the content and the
// flip / clamp in DropdownMenu keeps them inside what is visible of it. Screens get that element from here.
const MenuLayerContext = createContext<HTMLElement | null>(null)

/** The positioned scroll area that page menus render into (DropdownMenu portalTo) and measure against (relativeBox). */
export function useMenuLayer(): HTMLElement | null {
  return useContext(MenuLayerContext)
}

export type AppShellProps = {
  /** Contents of the 40px strip across the top of the main area (the breadcrumb). Empty on the Projects landing. */
  bar?: ReactNode
  /** Prototype-only controls (the review bar): drawn at the right end of the strip, last in the Tab order. */
  tools?: ReactNode
  /** The page. It scrolls; the strip and the nav stay put. */
  children: ReactNode
  /** Highlighted nav destination. */
  selected: NavKey | null
  /** Destination of the page on screen, announced as aria-current="page" (the highlight can rest on a row with no page). */
  current?: NavKey | null
  onSelect: (key: NavKey) => void
  /** A nav destination with a page was pressed. */
  onNavigate: (path: string) => void
  /** Destinations with a page (defaults to NAV_PAGES). */
  pages?: NavPages
  /** Rows without a page are inert (unbuilt screens hidden). */
  hideUnbuilt?: boolean
  /** Review harness (?state=frame / landing): pin the nav hovers drawn in the Figma frame. */
  pinFigmaHovers?: boolean
  /** Figma frame the current route reproduces (see figma/frames.ts). */
  nodeId?: string
  /**
   * The page draws its own top strip (the chat header, the artifact split) or none (the landing): it fills the whole main
   * area, nothing is drawn in the 40px strip, and the prototype tools float at the bottom-right corner (below the docked
   * composer) instead of taking the strip's right end, where the chat header's actions are.
   */
  fill?: boolean
  /**
   * A standalone page with no app nav (the artifact opened on its own, /view/:id: every frame of it is drawn full width
   * with no rail). Implies `fill`.
   */
  standalone?: boolean
}

/**
 * App frame: main navigation (280 expanded / 56 rail, full height, its own scroll area) beside the main area
 * (breadcrumb strip over the scrolling page). Nav mode and the user's rail choice come from app/store.ts.
 * Whenever the nav, rail or overlay is swapped out while it holds keyboard focus (a toggle, Esc, the scrim, a
 * destination chosen in the overlay, the window crossing 1200), focus lands on the toggle that replaces it.
 */
export function AppShell({ bar, tools, children, selected, current, onSelect, onNavigate, pages, hideUnbuilt, pinFigmaHovers, nodeId, fill = false, standalone = false }: AppShellProps) {
  const mode = useStore(navMode)
  const railChoice = useStore(rail)
  const narrow = useMediaQuery(NARROW_QUERY)

  // Below 1200 the nav shows as the rail whatever the user chose; expanding it opens an overlay instead of
  // changing that choice. Crossing the breakpoint in either direction closes the overlay.
  const [overlay, setOverlay] = useState(false)
  const [wasNarrow, setWasNarrow] = useState(narrow)
  if (wasNarrow !== narrow) {
    setWasNarrow(narrow)
    setOverlay(false)
  }
  const overlayOpen = narrow && overlay
  const collapsed = narrow || railChoice === 'collapsed'

  const closeOverlay = () => {
    requestNavFocus('rail-expand') // keyboard users land back on the rail's expand button
    setOverlay(false)
  }

  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      requestNavFocus('rail-expand')
      setOverlay(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlayOpen])

  const [menuLayer, setMenuLayer] = useState<HTMLElement | null>(null)

  const nav = {
    mode,
    selected,
    current,
    onSelect,
    pages,
    hideUnbuilt,
    onNavigate: (path: string) => {
      if (overlayOpen) closeOverlay() // a destination chosen in the overlay closes it, like Esc or the scrim
      onNavigate(path)
    },
  }

  return (
    <div
      className={fill || standalone ? 'shell shell--fill' : 'shell'} data-node-id={nodeId} data-nav-mode={mode}
      data-rail={collapsed ? 'collapsed' : 'expanded'} data-standalone={standalone || undefined}
    >
      {!standalone && (
        <div className="shell__nav" inert={overlayOpen}>
          {collapsed ? (
            <Rail {...nav} onExpand={() => (narrow ? setOverlay(true) : rail.set('expanded'))} />
          ) : (
            <Nav {...nav} onCollapse={() => rail.set('collapsed')} pinFigmaHovers={pinFigmaHovers} />
          )}
        </div>
      )}

      {!standalone && overlayOpen && (
        <>
          <div className="shell__scrim" aria-hidden="true" onClick={closeOverlay} />
          <div className="shell__overlay">
            <Nav {...nav} onCollapse={() => setOverlay(false)} pinFigmaHovers={pinFigmaHovers} />
          </div>
        </>
      )}

      <div className="shell__main" inert={!standalone && overlayOpen}>
        {!fill && <div className="shell__bar">{bar}</div>}
        <main className="shell__scroll" ref={setMenuLayer}>
          <MenuLayerContext value={menuLayer}>{children}</MenuLayerContext>
        </main>
        {tools && <div className="shell__tools">{tools}</div>}
      </div>
    </div>
  )
}
