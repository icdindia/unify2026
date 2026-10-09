import type { ComponentPropsWithRef, KeyboardEventHandler, Ref } from 'react'
import { DropdownItem, DropdownMenu, DropdownSeparator, menuIcons, type MenuFocus, type MenuPosition } from '../../components'
import { MOVE_TARGETS } from '../../data/projects'
import { useProjectFix } from '../../fixes/projects'

// The dashboard's three designed menus. Each is presentational: the page owns which is open, where it goes and
// what choosing an item does. All render into the shell's menu layer (`layer`) so they scroll with the page.

type MenuBase = {
  position: MenuPosition
  /** The trigger: presses on it are not "outside", and focus returns to it when the menu closes. */
  anchor: HTMLElement | null
  /** Opened from the keyboard: focus moves into the menu (see keyboardFocus). */
  autoFocus?: MenuFocus
  layer: HTMLElement | null
  /** Esc, or a press outside every open menu. */
  onClose?: () => void
  /** Any item was chosen (none has a designed destination yet). */
  onChoose: () => void
  /** Review harness only (?state=menus): draw the first item hovered, as in the file. */
  pinnedHover?: boolean
}

/** Header ⋮ menu, 11715:646185: Edit Details / Archive / Delete. Type=Full shadow, 170 wide. */
export function HeaderMenu({ position, anchor, autoFocus, layer, onClose, onChoose, pinnedHover }: MenuBase) {
  return (
    <DropdownMenu nodeId="11715:646185" width={170} position={position} anchor={anchor} autoFocus={autoFocus} portalTo={layer} onClose={onClose}
                  aria-label="Project actions">
      <DropdownItem icon={menuIcons.pencil} label="Edit Details" className={pinnedHover ? 'is-hover' : undefined} onClick={onChoose} />
      <DropdownSeparator size="md" />
      <DropdownItem icon={menuIcons.archive} label="Archive" onClick={onChoose} />
      <DropdownItem icon={menuIcons.trash} label="Delete" danger onClick={onChoose} />
    </DropdownMenu>
  )
}

type Hover = Pick<ComponentPropsWithRef<'button'>, 'onMouseEnter'>

/**
 * Table row ⋮ menu, 14045:569050, Type=Small shadow, 170 wide: Pin / Rename / Add to Project › / divider / Log out, as
 * drawn. With the "row-menu-move-to-project" fix: Pin / Rename / Move to project › (no Log out).
 */
export function RowMenu({
  position, anchor, autoFocus, layer, onClose, onChoose, menuRef, moveRef, siblingProps, moveProps,
}: Omit<MenuBase, 'pinnedHover'> & {
  menuRef: Ref<HTMLDivElement>
  /** The "Move to project" item, which the submenu is placed against. */
  moveRef: Ref<HTMLButtonElement>
  /** useSubmenu().siblingProps: hovering another item closes the submenu. */
  siblingProps: Hover
  /** useSubmenu().triggerProps for "Move to project". */
  moveProps: Hover & Pick<ComponentPropsWithRef<'button'>, 'onMouseLeave' | 'onClick' | 'onKeyDown'> & { open: boolean }
}) {
  const fixed = useProjectFix('row-menu-move-to-project')
  return (
    <DropdownMenu ref={menuRef} nodeId="14045:569050" width={170} shadow="small" position={position} anchor={anchor} autoFocus={autoFocus}
                  portalTo={layer} onClose={onClose} aria-label="Chat actions">
      <DropdownItem icon={menuIcons.pin} label="Pin" {...siblingProps} onClick={onChoose} />
      <DropdownItem icon={menuIcons.pencil} label="Rename" {...siblingProps} onClick={onChoose} />
      <DropdownItem ref={moveRef} icon={menuIcons.folder} label={fixed ? 'Move to project' : 'Add to Project'} submenu {...moveProps} />
      {!fixed && <DropdownSeparator />}
      {!fixed && <DropdownItem icon={menuIcons.logout} label="Log out" {...siblingProps} onClick={onChoose} />}
    </DropdownMenu>
  )
}

/** "Add to Project" ("Move to project" with the fix) submenu, 14045:569049: search, the user's projects, New Project. Type=Full shadow, 197 wide. */
export function MoveToProjectMenu({
  position, anchor, autoFocus, layer, onClose, onChoose, query, onQuery, menuRef, onKeyDown, onMouseEnter, onMouseLeave,
}: Omit<MenuBase, 'pinnedHover'> & {
  query: string
  onQuery: (q: string) => void
  menuRef: Ref<HTMLDivElement>
  /** useSubmenu().menuProps.onKeyDown: ArrowLeft goes back to "Move to project". */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const fixed = useProjectFix('row-menu-move-to-project')
  const q = query.trim().toLowerCase()
  const targets = q ? MOVE_TARGETS.filter(t => t.toLowerCase().includes(q)) : MOVE_TARGETS
  return (
    <DropdownMenu ref={menuRef} nodeId="14045:569049" width={197} position={position} anchor={anchor} autoFocus={autoFocus} portalTo={layer}
                  onClose={onClose} search={{ placeholder: 'Search', 'aria-label': 'Search projects', value: query, onChange: onQuery }}
                  onKeyDown={onKeyDown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} aria-label={fixed ? 'Move to project' : 'Add to Project'}>
      {targets.map(t => <DropdownItem key={t} icon={menuIcons.folderSolid} label={t} onClick={onChoose} />)}
      {targets.length > 0 && <DropdownSeparator />}
      <DropdownItem icon={menuIcons.plus} label="New Project" onClick={onChoose} />
    </DropdownMenu>
  )
}
