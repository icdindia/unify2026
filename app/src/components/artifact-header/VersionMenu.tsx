import { useLayoutEffect, useState } from 'react'
import { DropdownMenu, relativeBox, type MenuFocus, type MenuPosition } from '../dropdown-menu'
import { cx } from '../buttons/cx'
import type { HeaderIcon } from '../../fixtures/artifacts'
import { useFixPredicate } from '../../fixtures/drift'
import { useArtifactFix } from './fixes'
import { TYPE_ICONS } from './typeIcons'

/** One row of the version list, newest first (fixtures ArtifactVersion, resolved). */
export type ArtifactVersionRow = { n: number; label: string; when: string }

export type VersionMenuProps = {
  versions: readonly ArtifactVersionRow[]
  /** The version on the canvas (its row is Selected=On). */
  current: number
  onSelect: (n: number) => void
  onClose: () => void
  /** The "v3" button: the menu hangs from it, presses on it are not "outside", focus returns to it. */
  anchor: HTMLElement
  /** Positioned element the menu renders into (the artifact panel). */
  container: HTMLElement
  /** The artifact's type mark; as designed every row draws the Spreadsheets mark (see below). */
  icon: HeaderIcon
  autoFocus?: MenuFocus | boolean
}

const WIDTH = 280 // Version History 7416:161222
const OVERHANG = 58 // as drawn: menu right 1248, button right 1190 (fix version-menu-under-button)
const GAP = 4 // button bottom 42, menu top 46

/** "Today • Latest": the "Latest" part is Text xs/Medium in steel-blue-500 (I7416:161226;40570:40163). */
function When({ text }: { text: string }) {
  const parts = text.split(/( • )/)
  return (
    <>
      {parts.map((p, i) => (p === 'Latest' ? <span key={i} className="vmenu__latest">{p}</span> : p))}
    </>
  )
}

/**
 * Version History (7416:161222, chat-artifact 21 1795:359260): a Dropdown Menu 280 wide, radius 10, its rows
 * "Dropdown list item / Supporting Text=On, Size=sm" (11750:513458 Selected=On, 11750:513448 Off): a 14px type mark,
 * the version's name (12/16) over "when" (12/16 text-tertiary, "Latest" in steel-blue-500). Picking a row selects that
 * version and closes the menu; arrows / Home / End / Escape / Tab come from DropdownMenu.
 */
export function VersionMenu({ versions, current, onSelect, onClose, anchor, container, icon, autoFocus }: VersionMenuProps) {
  const underButton = useArtifactFix('version-menu-under-button')
  // As designed every row draws "Artifact-Icons / Type=Spreadsheets" (12910:607509) while the header draws a document:
  // the same mismatch fix panel-name-matches-card resolves for the names, so it follows that fix.
  const applies = useFixPredicate()
  const rowIcon = applies('panel-name-matches-card') ? icon : 'Spreadsheets'

  const [position, setPosition] = useState<MenuPosition>({ left: 0, top: 0 })
  useLayoutEffect(() => {
    const place = () => {
      const b = relativeBox(anchor, container)
      const right = underButton ? b.right : b.right + OVERHANG
      setPosition({ left: right - WIDTH, top: b.bottom + GAP, above: b.top - GAP })
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(container)
    return () => ro.disconnect()
  }, [anchor, container, underButton])

  return (
    <DropdownMenu
      className="dd--r10 vmenu" nodeId="7416:161222" width={WIDTH} position={position} anchor={anchor} portalTo={container}
      autoFocus={autoFocus} onClose={onClose} aria-label="Version history"
    >
      {versions.map(v => {
        const selected = v.n === current
        return (
          <button
            key={v.n} type="button" role="menuitemradio" aria-checked={selected}
            className={cx('vmenu__row', selected && 'is-selected')}
            data-node-id={selected ? '11750:513458' : '11750:513448'}
            onClick={() => { onSelect(v.n); onClose() }}
          >
            <span className="vmenu__in">
              <span className="vmenu__icon"><img alt="" src={TYPE_ICONS[rowIcon]} /></span>
              <span className="vmenu__tw">
                <span className="vmenu__t">{v.label}</span>
                <span className="vmenu__d"><When text={v.when} /></span>
              </span>
            </span>
          </button>
        )
      })}
    </DropdownMenu>
  )
}
