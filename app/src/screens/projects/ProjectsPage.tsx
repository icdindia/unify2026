import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  BrandButton, DropdownItem, cx, DropdownMenu, DropdownSeparator, FilterButton, buttonIcons, keyboardFocus, menuIcons, moveTabFocus, relativeBox,
  toolbarIcons, type MenuFocus, type MenuPosition,
} from '../../components'
import { useMenuLayer } from '../../shell/AppShell'
import { PROJECT_CARDS, type Project } from '../../data/projects'
import { useProjectFixes } from '../../fixes/projects'
import { whenFontsReady, type ReviewState } from '../../review/reviewState'
import { ProjectCard } from './ProjectCard'
import { ProjectSearch } from './ProjectSearch'
import gridIcon from '../../assets/projects/pl-view-grid-on.svg'
import listIcon from '../../assets/projects/pl-view-list.svg'
import './projects-page.css'

const CARD_MENU_WIDTH = 140 // Dropdown Menu 4767:135942

type CardMenu = { slug: string; anchor: HTMLElement; position: MenuPosition; focus?: MenuFocus }

/**
 * Projects landing, "Dashboard" 11657:386523 (Projects list): title + New Project, the All / Yours / Shared tabs,
 * search / type / sort / view controls, and a grid of project cards. A card opens its dashboard; its ⋯ opens the
 * Pin / Edit Project / Share Project / Delete menu. Tabs, type, sort and the view toggle are drawn but not wired,
 * as in the HTML prototype. "With fixes": the search folds to an icon and type / sort turn tertiary and flush
 * (fixes landing-search-icon and landing-controls-tertiary in src/fixes/projects.ts).
 */
export function ProjectsPage({ review }: { review: ReviewState | null }) {
  const layer = useMenuLayer()
  const fx = useProjectFixes()
  const [query, setQuery] = useState('')
  const [menu, setMenu] = useState<CardMenu | null>(null)
  const moreButtons = useRef(new Map<string, HTMLButtonElement>())

  const q = query.trim().toLowerCase()
  const shown = q ? PROJECT_CARDS.filter(p => p.name.toLowerCase().includes(q)) : PROJECT_CARDS

  const openMenu = (project: Project, button: HTMLElement, focus?: MenuFocus) => {
    if (!layer) return
    // the file: menu's right edge on the button's right edge, 5.5px below it (bottom-row cards open upward)
    const b = relativeBox(button, layer)
    setMenu({ slug: project.slug, anchor: button, focus, position: { left: b.right - CARD_MENU_WIDTH, top: b.bottom + 5.5, above: b.top - 5.5 } })
  }
  const toggleMenu = (project: Project) => (e: MouseEvent<HTMLButtonElement>) => {
    if (menu?.slug === project.slug) setMenu(null)
    else openMenu(project, e.currentTarget, keyboardFocus(e))
  }

  // the grid reflows when the window resizes, so an open menu would be left behind: close it, as native menus do
  const menuOpen = !!menu
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenu(null)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [menuOpen])

  // ?state=landing: card 2 hovered with its menu open, as drawn in the file (measured once the web fonts have loaded)
  const pinned = review === 'landing'
  useEffect(() => {
    if (!pinned || !layer) return
    return whenFontsReady(() => {
      const card = PROJECT_CARDS[1]
      const button = moreButtons.current.get(card.slug)
      if (button) openMenu(card, button)
    })
  }, [pinned, layer]) // runs once the menu layer exists; openMenu is recreated each render on purpose

  return (
    <section className={cx('pl', fx('landing-controls-tertiary') && 'pl--fx-controls')} data-node-id="11657:386523">
      <div className="pl__head">
        <h1 className="pl__title" tabIndex={-1}>Projects</h1>
        <BrandButton size="md" icon={buttonIcons.plusWhite14} label="New Project" />
      </div>

      <div className="pl__filters">
        {/* a roving tablist: Tab reaches the current tab, the arrow keys the others (only "All" is designed so far) */}
        <div className="btabs" role="tablist" aria-label="Show projects" onKeyDown={moveTabFocus}>
          <button type="button" className="btab is-current" role="tab" aria-selected="true">All</button>
          <button type="button" className="btab" role="tab" aria-selected="false" tabIndex={-1}>Yours</button>
          <button type="button" className="btab" role="tab" aria-selected="false" tabIndex={-1}>Shared with you</button>
        </div>
        <div className="pl__right">
          <ProjectSearch value={query} onChange={setQuery} collapsible={fx('landing-search-icon')} />
          <FilterButton size="xs" icon={toolbarIcons.filter16} label="All Types" className="pl__types" />
          <FilterButton size="xs" icon={toolbarIcons.sort16} label="Newest" />
          <div className="vtoggle" role="group" aria-label="View">
            <button type="button" className="vtoggle__i vtoggle__i--on" aria-pressed="true" aria-label="Grid view"><img alt="" src={gridIcon} /></button>
            <button type="button" className="vtoggle__i" aria-pressed="false" aria-label="List view"><img alt="" src={listIcon} /></button>
          </div>
        </div>
      </div>

      <div className="pgrid">
        {shown.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            menuOpen={menu?.slug === p.slug}
            onMore={toggleMenu(p)}
            moreRef={el => {
              if (el) moreButtons.current.set(p.slug, el)
              else moreButtons.current.delete(p.slug)
            }}
            pinnedHover={pinned && i === 1 && !q}
          />
        ))}
        {!shown.length && <p className="pgrid__empty">{`No projects match “${query.trim()}”`}</p>}
      </div>

      {menu && (
        <DropdownMenu
          nodeId="4767:135942"
          width={CARD_MENU_WIDTH}
          shadow="small"
          position={menu.position}
          anchor={menu.anchor}
          autoFocus={menu.focus}
          portalTo={layer}
          onClose={() => setMenu(null)}
          aria-label="Project actions"
        >
          <DropdownItem icon={menuIcons.pin} label="Pin" className={pinned ? 'is-hover' : undefined} onClick={() => setMenu(null)} />
          <DropdownItem icon={menuIcons.pencil} label="Edit Project" onClick={() => setMenu(null)} />
          <DropdownItem icon={menuIcons.users} label="Share Project" onClick={() => setMenu(null)} />
          <DropdownSeparator />
          <DropdownItem icon={menuIcons.trash} label="Delete" danger onClick={() => setMenu(null)} />
        </DropdownMenu>
      )}
    </section>
  )
}
