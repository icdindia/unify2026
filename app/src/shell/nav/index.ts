// Main navigation: <Nav> (expanded, 280) and <Rail> (collapsed, 56), dark and light.
// Both are presentational: the caller owns mode, collapsed state and selection (see app/store.ts for
// the navMode and rail stores). Typical wiring:
//
//   const collapsed = useStore(rail) === 'collapsed'
//   const props = { mode, selected, onSelect: setSelected, onNavigate: navigate }
//   collapsed
//     ? <Rail {...props} onExpand={() => rail.set('expanded')} />
//     : <Nav {...props} onCollapse={() => rail.set('collapsed')} />
//
// Focus moves to the counterpart toggle on its own after either press.
export { Nav, type NavProps } from './Nav'
export { Rail, type RailProps } from './Rail'
export { LogoSpiral } from './LogoSpiral'
/** For a layout that closes the nav itself (scrim click, Esc): ask for focus to land on the rail's expand button. */
export { requestFocus as requestNavFocus } from './focusHandoff'
export {
  NAV_PAGES,
  NODE as NAV_NODE,
  STATUS_LABEL,
  navKeyForPath,
  type ChatStatus,
  type NavKey,
  type NavMode,
  type NavPages,
  type NavSelectionProps,
} from './model'
