// Chat header (ES Breadcrumb of a chat; inventory rows 4 and 39): the strip, its cost pill and the people-with-access
// popover. The title menu is components/chat-title-menu, the share modal components/share-modal.
// Gallery: #/gallery/chat-header (?sheet=default is header-dropdowns c06).
export {
  ChatHeader, ES_BREADCRUMB_SET, CHAT_HEADER_INSTANCES,
  type ChatHeaderProps, type ChatHeaderPerson, type ChatHeaderHover, type ChatHeaderTitleMenu, type ChatHeaderAccess,
} from './ChatHeader'
export { CostPill, COST_RING_FRACTION, type CostPillProps, type CostRingState } from './CostPill'
export { AccessPopover, type AccessPopoverProps, type AccessPerson } from './AccessPopover'
export { CHAT_CHROME_FIXES, useChatChromeFix, type ChatChromeFixId } from './fixes'
export * as chatHeaderIcons from './icons'
export { useHeaderPeople, useAccessPeople } from './data'
