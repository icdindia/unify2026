import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import {
  BrandButton, Button, DropdownItem, DropdownMenu, DropdownSeparator, EmptyState, FilterButton, Modal, ModalActions, ModalButton, ModalHeader,
  Tooltip, buttonIcons, cx, keyboardFocus, menuBelow, menuIcons, moveTabFocus, overlayIcons, relativeBox, toolbarIcons,
  useToast, type MenuFocus, type MenuPosition,
} from '../../components'
import { TYPE_ICONS } from '../../components/artifact-header'
import { useMenuLayer } from '../../shell/AppShell'
import { navigate } from '../../router/router'
import { buildUrl, setUi } from '../../router/uiParams'
import { ARTIFACT_TYPES, TYPE_FILTER, type ArtifactType } from '../../fixtures/artifacts'
import { useFixPredicate, pick } from '../../fixtures/drift'
import { ME } from '../../fixtures/people'
import { whenFontsReady } from '../../review/reviewState'
import { ProjectSearch } from '../projects/ProjectSearch'
import { ArtifactCard, STATUS_ICON } from './ArtifactCard'
import {
  cloneArtifact, deleteArtifact, entryOf, landingIds, restoreArtifact, setPinned, useArtifactSession,
  type ArtifactEntry, type LandingSeed,
} from './collection'
import { FILTER_ICONS } from './filterIcons'
import gridIcon from '../../assets/projects/pl-view-grid-on.svg'
import listIcon from '../../assets/projects/pl-view-list.svg'
import gridOff from '../../assets/artifact-filter/view-grid-off.svg'
import listOn from '../../assets/artifact-filter/view-list-on.svg'
import rowMore from '../../assets/chrome/row-dots-vertical.svg'
import docThumb from '../../assets/artifact-types/thumb-doc.png'
import '../projects/projects-page.css' // the shared filter strip: .btabs, .psearch, .vtoggle
import './artifacts-page.css'

const CARD_MENU_WIDTH = 140 // Dropdown Menu 12057:581998
const TYPE_MENU_WIDTH = 190 // the "All Types" list, Menu items 12266:650710

/** What the landing's URL asks for (artifacts-landing 01-06, cloned-artifact 01). */
export type ArtifactsLandingState = {
  seed: LandingSeed
  list: boolean
  search: boolean
  /** menu=type-filter | card:<id> */
  menu: { kind: 'type' } | { kind: 'card'; id: string } | null
  /** modal=delete:<id> */
  deleting: string | null
  /** hover=new-artifact: the tooltip pinned (05) */
  hoverNew: boolean
}

type Tab = 'all' | 'yours' | 'shared'
type CardMenu = { id: string; anchor: HTMLElement; position: MenuPosition; focus?: MenuFocus }

/** Where a card opens: the artifact's main view with Back to the landing (cloned-artifact 02: /view/<id>?from=artifacts). */
export const artifactHref = (id: string) => buildUrl(`/view/${id}`, { from: 'artifacts' })

/** The chat an artifact was made in, with the artifact open beside it ("Edit with Chat"). Only the commit chat is built. */
export const chatHref = (id: string) => buildUrl(`/chat/commit/${id}`, { at: 'artifact' })

/**
 * Artifacts landing (artifacts-landing 01-06, cloned-artifact 01): title + New Artifact, the All / Yours / Shared tabs,
 * search / All Types / Newest / grid-list, and the cards (or the list). A card opens the artifact page; its ⋯ menu pins,
 * edits with chat, clones (the clone joins the grid), downloads, shares and deletes (after the Delete Artifact modal).
 */
export function ArtifactsPage({ state }: { state: ArtifactsLandingState }) {
  const layer = useMenuLayer()
  const applies = useFixPredicate()
  const toast = useToast()
  const session = useArtifactSession()
  const gap = (what: string) => toast.show({ message: `${what}: not drawn in Figma yet` })

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [type, setType] = useState<ArtifactType | 'all'>('all')
  const [cardMenu, setCardMenu] = useState<CardMenu | null>(null)
  const [typeMenu, setTypeMenu] = useState<{ position: MenuPosition; focus?: MenuFocus } | null>(null)
  const typeBtn = useRef<HTMLButtonElement>(null)
  const moreButtons = useRef(new Map<string, HTMLButtonElement>())

  const entries = useMemo(
    () => landingIds(state.seed, state.list, applies, session).map(id => entryOf(id, session)).filter((e): e is ArtifactEntry => !!e),
    [state.seed, state.list, applies, session],
  )
  const q = query.trim().toLowerCase()
  const nameOf = (e: ArtifactEntry) => pick(e.name, applies)
  const authorOf = (e: ArtifactEntry) => (e.author ? pick(e.author, applies) : null)
  const shown = entries.filter(e =>
    (type === 'all' || e.type === type)
    && (tab === 'all' || (tab === 'yours' ? authorOf(e) === ME : authorOf(e) !== ME))
    && (!q || nameOf(e).toLowerCase().includes(q)))
  const empty = state.seed === 'empty' || !entries.length

  // ---- menus
  const openCardMenu = (id: string, button: HTMLElement, focus?: MenuFocus) => {
    if (!layer) return
    // 12057:581998: the menu's right edge 8px right of the ⋯ (on the card's edge), 3px below it
    const b = relativeBox(button, layer)
    setTypeMenu(null)
    setCardMenu({ id, anchor: button, focus, position: { left: b.right + 8 - CARD_MENU_WIDTH, top: b.bottom + 3, above: b.top - 3 } })
  }
  const toggleCardMenu = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    if (cardMenu?.id === id) setCardMenu(null)
    else openCardMenu(id, e.currentTarget, keyboardFocus(e))
  }
  const openTypeMenu = (focus?: MenuFocus) => {
    if (!layer || !typeBtn.current) return
    setCardMenu(null)
    setTypeMenu({ position: menuBelow(relativeBox(typeBtn.current, layer), TYPE_MENU_WIDTH), focus })
  }

  // the grid reflows on resize: close an open menu, as native menus do
  const anyMenu = !!cardMenu || !!typeMenu
  useEffect(() => {
    if (!anyMenu) return
    const close = () => { setCardMenu(null); setTypeMenu(null) }
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [anyMenu])

  // a review URL opens a menu (menu=type-filter, menu=card:<id>) once the fonts have set the layout
  const urlMenu = state.menu
  useEffect(() => {
    if (!urlMenu || !layer) return
    return whenFontsReady(() => {
      if (urlMenu.kind === 'type') openTypeMenu()
      else {
        const b = moreButtons.current.get(urlMenu.id)
        if (b) openCardMenu(urlMenu.id, b)
      }
    })
  }, [urlMenu?.kind, urlMenu && 'id' in urlMenu ? urlMenu.id : null, layer]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- actions
  const menuEntry = cardMenu ? entries.find(e => e.id === cardMenu.id) ?? null : null
  const run = (fn: () => void) => () => { setCardMenu(null); fn() }
  const clone = (e: ArtifactEntry) => {
    const id = cloneArtifact(e.id)
    toast.show({ message: `Cloned “${nameOf(e)}”`, action: { label: 'Open', onClick: () => navigate(artifactHref(id)) } })
  }
  const askDelete = (id: string) => setUi({ modal: `delete:${id}`, menu: null })
  const deleting = state.deleting ? entryOf(state.deleting, session) : null
  const confirmDelete = () => {
    if (!deleting) return
    const { id } = deleting
    deleteArtifact(id)
    setUi({ modal: null })
    toast.show({ id: 'delete', message: `${nameOf(deleting)} deleted`, action: { label: 'Undo', onClick: () => restoreArtifact(id) } })
  }

  const newArtifact = (
    <Tooltip text="Co-create with an Agent" icon={overlayIcons.stars02} arrow="bottom-center" open={state.hoverNew || undefined} nodeId="3780:177208">
      <BrandButton size="md" icon={buttonIcons.plusWhite14} label="New Artifact" className={state.hoverNew ? 'is-hover' : undefined} onClick={() => navigate('/new')} />
    </Tooltip>
  )

  return (
    <section className="art" data-node-id={empty ? '3780:177209' : state.list ? '12868:502599' : '7907:305055'}>
      <div className="art__head">
        <h1 className="art__title" tabIndex={-1}>Artifacts</h1>
        {newArtifact}
      </div>

      {empty ? (
        <EmptyState
          className="art__empty" nodeId="6660:536040"
          title="Create an Artifact"
          description="Personalize templates for doc, presentations and data management."
          actions={<Button kind="secondary" size="md" icon={menuIcons.plus} label="New Artifact" onClick={() => navigate('/new')} />}
        />
      ) : (
        <>
          <div className="art__filters">
            <div className="btabs" role="tablist" aria-label="Show artifacts" onKeyDown={moveTabFocus}>
              {([['all', 'All'], ['yours', 'Yours'], ['shared', 'Shared with you']] as const).map(([id, label]) => (
                <button
                  key={id} type="button" role="tab" aria-selected={tab === id} tabIndex={tab === id ? 0 : -1}
                  className={cx('btab', tab === id && 'is-current')} onClick={() => setTab(id)}
                >{label}</button>
              ))}
            </div>
            <div className="art__right">
              <ProjectSearch value={query} onChange={setQuery} defaultOpen={state.search} label="Search artifacts" />
              <FilterButton
                ref={typeBtn} size="xs" icon={toolbarIcons.filter16}
                label={type === 'all' ? 'All Types' : TYPE_FILTER.find(t => t.id === type)?.label ?? 'All Types'}
                className={cx('art__types', typeMenu && 'is-hover')} aria-haspopup="menu" aria-expanded={!!typeMenu}
                onClick={e => (typeMenu ? setTypeMenu(null) : openTypeMenu(keyboardFocus(e)))}
              />
              <FilterButton size="xs" icon={toolbarIcons.sort16} label="Newest" className="art__sort" onClick={() => gap('Sort')} />
              <div className="vtoggle" role="group" aria-label="View">
                <button
                  type="button" className={cx('vtoggle__i', !state.list && 'vtoggle__i--on')} aria-pressed={!state.list} aria-label="Grid view"
                  onClick={() => setUi({ view: null, menu: null })}
                ><img alt="" src={state.list ? gridOff : gridIcon} /></button>
                <button
                  type="button" className={cx('vtoggle__i', state.list && 'vtoggle__i--on')} aria-pressed={state.list} aria-label="List view"
                  onClick={() => setUi({ view: 'list', menu: null })}
                ><img alt="" src={state.list ? listOn : listIcon} /></button>
              </div>
            </div>
          </div>

          {state.list ? (
            <ArtifactList entries={shown} menuId={cardMenu?.id ?? null} onMore={toggleCardMenu} moreButtons={moreButtons.current} />
          ) : (
            <div className="art__grid">
              {shown.map(e => (
                <ArtifactCard
                  key={e.id} entry={e} to={artifactHref(e.id)} menuOpen={cardMenu?.id === e.id} onMore={toggleCardMenu(e.id)}
                  moreRef={el => { if (el) moreButtons.current.set(e.id, el); else moreButtons.current.delete(e.id) }}
                />
              ))}
            </div>
          )}
          {!shown.length && <p className="art__none">{q ? `No artifacts match “${query.trim()}”` : 'No artifacts here yet'}</p>}
        </>
      )}

      {typeMenu && typeBtn.current && (
        <DropdownMenu
          nodeId="11648:688356" width={TYPE_MENU_WIDTH} shadow="small" position={typeMenu.position} anchor={typeBtn.current}
          autoFocus={typeMenu.focus} portalTo={layer} onClose={() => setTypeMenu(null)} aria-label="Artifact type"
        >
          {TYPE_FILTER.map(t => (
            <DropdownItem
              key={t.id} label={t.label} selected={type === t.id}
              icon={FILTER_ICONS[t.id]}
              onClick={() => { setType(t.id); setTypeMenu(null) }}
            />
          ))}
        </DropdownMenu>
      )}

      {cardMenu && menuEntry && (
        <DropdownMenu
          nodeId="12057:581998" width={CARD_MENU_WIDTH} shadow="small" position={cardMenu.position} anchor={cardMenu.anchor}
          autoFocus={cardMenu.focus} portalTo={layer} onClose={() => setCardMenu(null)} aria-label={`${nameOf(menuEntry)}: actions`}
        >
          <DropdownItem
            icon={menuEntry.pinned ? menuIcons.unpin : menuIcons.pin} label={menuEntry.pinned ? 'Unpin' : 'Pin'}
            onClick={run(() => setPinned(menuEntry.id, !menuEntry.pinned))}
          />
          <DropdownItem
            icon={menuIcons.aiEdit} label="Edit with Chat"
            onClick={run(() => (menuEntry.chat ? navigate(chatHref(menuEntry.id)) : navigate(artifactHref(menuEntry.id))))}
          />
          <DropdownItem icon={menuIcons.copy} label="Clone" onClick={run(() => clone(menuEntry))} />
          <DropdownItem icon={menuIcons.download} label="Download" onClick={run(() => gap('Download'))} />
          <DropdownItem icon={menuIcons.users} label="Share" onClick={run(() => gap('Share'))} />
          <DropdownSeparator />
          <DropdownItem icon={menuIcons.trash} label="Delete" danger onClick={run(() => askDelete(menuEntry.id))} />
        </DropdownMenu>
      )}

      <Modal open={!!deleting} onClose={() => setUi({ modal: null })} width={360} radius={10} scrim="slate-25" nodeId="12057:581132">
        <ModalHeader title="Delete Artifact" subtitle="This will delete the artifact forever. It cannot be undone." hideClose titleWeight="regular" />
        <ModalActions>
          <ModalButton kind="secondary" label="Cancel" onClick={() => setUi({ modal: null })} />
          <ModalButton kind="destructive" label="Delete" onClick={confirmDelete} />
        </ModalActions>
      </Modal>
    </section>
  )
}

/** List view (12868:502599): NAME (thumbnail + Spectral title), TYPE (mark + label), STATUS (one glyph), and a ⋮ column. */
function ArtifactList({ entries, menuId, onMore, moreButtons }: {
  entries: ArtifactEntry[]; menuId: string | null
  onMore: (id: string) => (e: MouseEvent<HTMLButtonElement>) => void
  moreButtons: Map<string, HTMLButtonElement>
}) {
  const applies = useFixPredicate()
  return (
    <div className="alist" role="table" aria-label="Artifacts">
      <div className="alist__head" role="row">
        <span role="columnheader">Name</span>
        <span role="columnheader">Type</span>
        <span role="columnheader">Status</span>
        <span role="columnheader" aria-label="Actions" />
      </div>
      {entries.map(e => {
        const spec = ARTIFACT_TYPES[e.type]
        const vis = e.visibility ? pick(e.visibility, applies) : 'private'
        const status = STATUS_ICON[vis === 'published' ? 'globe' : vis === 'shared' ? 'users' : 'lock']
        const name = pick(e.name, applies)
        return (
          <div key={e.id} className={cx('alist__row', menuId === e.id && 'is-active')} role="row">
            <a className="alist__open" href={'#' + artifactHref(e.id)} aria-label={`Open ${name}`} />
            <span className="alist__name" role="cell">
              <span className="alist__thumb" style={{ background: `var(${spec.tint})` }}><img alt="" src={docThumb} /></span>
              <span className="alist__title">{name}</span>
            </span>
            <span className="alist__type" role="cell"><img alt="" src={TYPE_ICONS[spec.headerIcon]} />{spec.list}</span>
            <span className="alist__status" role="cell"><img alt={status.label} title={status.label} src={status.src} /></span>
            <span className="alist__act" role="cell">
              <button
                ref={el => { if (el) moreButtons.set(e.id, el); else moreButtons.delete(e.id) }}
                type="button" className="alist__more" aria-label={`${name}: actions`} aria-haspopup="menu" aria-expanded={menuId === e.id}
                onClick={onMore(e.id)}
              ><img alt="" src={rowMore} /></button>
            </span>
          </div>
        )
      })}
    </div>
  )
}
