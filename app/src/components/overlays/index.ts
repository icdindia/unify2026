// Overlay primitives (wave 1, agent 1.3; inventory rows 9 and 12): Modal, Tooltip, anchored Popover, Toast.
// Gallery pages: src/gallery/pages/{modal,tooltip,popover,toast}.tsx.
export {
  Modal, ModalSurface, ModalHeader, ModalBody, ModalActions, ModalButton, useModalLayer,
  type ModalProps, type ModalSurfaceProps, type ModalHeaderProps, type ModalBodyProps, type ModalActionsProps,
  type ModalButtonProps, type ModalButtonKind, type ModalSize, type ModalRadius, type ModalScrim,
} from './modal/Modal'
export {
  Tooltip, TooltipBubble, useTooltip,
  type TooltipProps, type TooltipBubbleProps, type TooltipOptions, type TooltipArrow, type TooltipSide,
} from './tooltip/Tooltip'
export { Popover, type PopoverProps, type PopoverPlacement, type PopoverCloseReason } from './popover/Popover'
export {
  ToastProvider, Toast, useToast,
  type ToastProviderProps, type ToastProps, type ToastOptions, type ToastAction, type ToastApi, type ToastItem,
} from './toast/Toast'
export { overlayIcons } from './icons'
export { OVERLAY_FIXES, useOverlayFix, type OverlayFixId } from './fixes'
export { overlayLayer, useModalStack } from './layer'
