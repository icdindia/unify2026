// Menu placement helpers. Menus are absolutely positioned inside a positioned container (the caller's choice:
// usually the main area or the page). Coordinates are in that container's content space, so they stay right
// when the container scrolls.

export type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number }

/** An element's box relative to `container` (a positioned ancestor), including the container's scroll offset. */
export function relativeBox(el: Element, container: HTMLElement): Box {
  const c = container.getBoundingClientRect()
  const b = el.getBoundingClientRect()
  const x = c.left + container.clientLeft - container.scrollLeft
  const y = c.top + container.clientTop - container.scrollTop
  return { left: b.left - x, top: b.top - y, right: b.right - x, bottom: b.bottom - y, width: b.width, height: b.height }
}

/** Where a menu wants to go, in container coordinates. */
export type MenuPosition = {
  left: number
  top: number
  /** Bottom edge to use if the menu has to open upward instead (usually the trigger's top minus the gap). */
  above?: number
  /** Right edge to use if the menu has to open leftward instead (a submenu flipping to the other side of its parent). */
  before?: number
  /**
   * A submenu's fallback for when it fits on neither side of its parent (a phone-width page): stacked under the
   * parent from `top`, or over it ending at `above`, starting at `left`. Without it such a menu is clamped to the
   * view, which can land it on top of the parent's own items.
   */
  stack?: { left: number; top: number; above: number }
}

/** The space a menu may occupy, in container coordinates: what is currently visible of the container. */
export type View = { left: number; top: number; right: number; bottom: number }

export const MENU_EDGE = 8 // px kept clear of the container's edges (the prototype's EDGE)

/**
 * Vertical placement, as placeV() in prototypes/project-dashboard/app.js: a menu that would run past the bottom
 * of the view opens upward from `above` when it fits there, otherwise it is clamped to `edge` above the bottom.
 */
export function placeV(top: number, height: number, view: View, above?: number, edge = MENU_EDGE): number {
  if (top + height <= view.bottom - edge) return top
  if (above !== undefined && above - height >= view.top + edge) return above - height
  return Math.max(view.top + edge, view.bottom - edge - height)
}

/** Horizontal placement without clamping: `left` if the menu fits there, else `before - width` if it fits there, else null. */
function fitH(left: number, width: number, view: View, before?: number, edge = MENU_EDGE): number | null {
  if (left + width <= view.right - edge) return left
  if (before !== undefined && before - width >= view.left + edge) return before - width
  return null
}

/** Horizontal counterpart (new in the React port, for narrow viewports): flip to `before`, else clamp. */
export function placeH(left: number, width: number, view: View, before?: number, edge = MENU_EDGE): number {
  return fitH(left, width, view, before, edge) ?? Math.max(view.left + edge, view.right - edge - width)
}

/**
 * Where a menu of this size lands in `view`: beside its anchor (flipping up or left as needed), or, for a submenu that
 * fits on neither side of its parent, stacked under or over the parent (`position.stack`).
 */
export function placeMenu(position: MenuPosition, width: number, height: number, view: View, edge = MENU_EDGE): { left: number; top: number } {
  const beside = fitH(position.left, width, view, position.before, edge)
  if (beside === null && position.stack) {
    const { stack } = position
    return { left: placeH(stack.left, width, view, undefined, edge), top: placeV(stack.top, height, view, stack.above, edge) }
  }
  return { left: beside ?? placeH(position.left, width, view, position.before, edge), top: placeV(position.top, height, view, position.above, edge) }
}

/** The visible part of a menu's positioned container, in that container's coordinates. */
export function viewOf(container: HTMLElement): View {
  if (container === document.body || container === document.documentElement) {
    return { left: window.scrollX, top: window.scrollY, right: window.scrollX + window.innerWidth, bottom: window.scrollY + window.innerHeight }
  }
  return {
    left: container.scrollLeft, top: container.scrollTop,
    right: container.scrollLeft + container.clientWidth, bottom: container.scrollTop + container.clientHeight,
  }
}

/**
 * The usual anchor for a trigger-opened menu: below the trigger by `gap`, opening upward above it if needed.
 * align 'right' lines the menu's right edge up with the trigger's (row ⋮, card ⋯); 'left' its left edge.
 */
export function menuBelow(trigger: Box, width: number, { gap = 4, align = 'right' }: { gap?: number; align?: 'left' | 'right' } = {}): MenuPosition {
  return { left: align === 'right' ? trigger.right - width : trigger.left, top: trigger.bottom + gap, above: trigger.top - gap }
}
