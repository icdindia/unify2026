// People-with-access popover (BUILD-PLAN row 39): read-only list under the chat header's avatar stack.
// One implementation: components/chat-header/AccessPopover (ChatHeader opens it in chat-artifact 15), re-exported here
// with its fixture adapter and the helpers the gallery uses. Gallery: #/gallery/access-popover.
export { AccessPopover, type AccessPopoverProps, type AccessPerson } from '../chat-header/AccessPopover'
export { useAccessPeople } from '../chat-header/data'
export { useAccessOptions, useHoverPopover, ACCESS_POPOVER_NODE, type AccessEntry } from './AccessPopover'
