import {
  createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore,
  type ComponentPropsWithRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { cx } from '../../buttons/cx'
import { useOverlayFix } from '../fixes'
import { overlayIcons } from '../icons'
import { overlayLayer } from '../layer'
import '../overlays.css'
import './toast.css'

// Toast (+ Undo). Not drawn in Figma: the plan fills these gaps with toasts (Q35 invite, Q37 remove access, Q44 clear
// queue, Q57 delete artifact, Q59 clone, Q60 publish). It is fix "toast-feedback" (overlays/fixes.ts), so in-app toasts
// show only in "With fixes" mode; the actions themselves happen either way.
// Look: the DS's dark floating surface, the same as the Tooltip (bg-base-dark, 1px utility-gray-700 inside).
//
//   const toast = useToast()
//   toast.show({ message: 'Artifact deleted', action: { label: 'Undo', onClick: restore } })

export type ToastAction = { label: string; onClick: () => void }

export type ToastOptions = {
  message: ReactNode
  /** One action button (Undo, Open). Choosing it runs onClick and dismisses the toast. */
  action?: ToastAction
  /** ms before it goes; paused while hovered or focused. Default 5000, 8000 with an action; Infinity = until closed. */
  duration?: number
  /** 'error' is announced assertively (role=alert). */
  tone?: 'neutral' | 'error'
  /** Leading 16px icon URL. */
  icon?: string
  /** Reuse an id to replace a toast in place (e.g. a second Delete before the first Undo expired). */
  id?: string
}

export type ToastItem = ToastOptions & { id: string }

export type ToastApi = {
  show: (options: ToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

const MAX_VISIBLE = 3

type ToastStore = ToastApi & { get: () => ToastItem[]; subscribe: (l: () => void) => () => void }

function createToastStore(): ToastStore {
  let items: ToastItem[] = []
  let seq = 0
  const listeners = new Set<() => void>()
  const emit = () => listeners.forEach(l => l())
  return {
    get: () => items,
    subscribe: l => { listeners.add(l); return () => { listeners.delete(l) } },
    show: options => {
      seq += 1
      const id = options.id ?? `toast-${seq}`
      const item = { ...options, id }
      items = items.some(t => t.id === id) ? items.map(t => (t.id === id ? item : t)) : [...items, item].slice(-MAX_VISIBLE)
      emit()
      return id
    },
    dismiss: id => { items = items.filter(t => t.id !== id); emit() },
    clear: () => { items = []; emit() },
  }
}

const ToastContext = createContext<ToastStore | null>(null)

// Without a provider, toasts go to one app-wide region mounted on first use (its own small React root in the
// overlay layer), so a screen can call useToast() before the app shell mounts <ToastProvider>.
let globalStore: ToastStore | null = null
function globalToasts(): ToastStore {
  if (!globalStore) {
    globalStore = createToastStore()
    const host = document.createElement('div')
    overlayLayer().appendChild(host)
    createRoot(host).render(<ToastRegion store={globalStore} />)
  }
  return globalStore
}

/** show / dismiss / clear toasts: from the nearest ToastProvider, else the app-wide region. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  return useMemo(() => {
    if (ctx) return { show: ctx.show, dismiss: ctx.dismiss, clear: ctx.clear }
    return {
      show: (o: ToastOptions) => globalToasts().show(o),
      dismiss: (id: string) => globalToasts().dismiss(id),
      clear: () => globalToasts().clear(),
    }
  }, [ctx])
}

export type ToastProviderProps = {
  children?: ReactNode
  /** Show toasts only with fixes on (fix "toast-feedback"). Default true; the gallery turns it off to demo them. */
  gated?: boolean
}

/** Holds the toasts for its subtree and renders their region (bottom centre of the viewport, in the overlay layer). */
export function ToastProvider({ children, gated = true }: ToastProviderProps) {
  const [store] = useState(createToastStore)
  return (
    <ToastContext value={store}>
      {children}
      <ToastRegion store={store} gated={gated} />
    </ToastContext>
  )
}

function ToastRegion({ store, gated = true }: { store: ToastStore; gated?: boolean }) {
  const items = useSyncExternalStore(store.subscribe, store.get)
  const fixOn = useOverlayFix('toast-feedback')
  const visible = !gated || fixOn
  const [paused, setPaused] = useState(false)
  const returnTo = useRef<HTMLElement | null>(null) // where focus was before it entered the region
  const region = useRef<HTMLDivElement>(null)

  // gated off: requested toasts are dropped, not queued for later
  useEffect(() => { if (!visible && items.length) store.clear() }, [visible, items.length, store])

  const dismiss = (id: string) => {
    const hadFocus = region.current?.contains(document.activeElement)
    store.dismiss(id)
    if (hadFocus) {
      // focus moves to the next toast's first control, else back to where it came from
      requestAnimationFrame(() => {
        const next = region.current?.querySelector<HTMLElement>('button')
        if (next) next.focus()
        else if (returnTo.current?.isConnected) returnTo.current.focus({ preventScroll: true })
      })
    }
  }

  return createPortal(
    <section
      ref={region}
      className="toast-region"
      aria-label="Notifications"
      data-overlay-keep-focus=""
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={e => {
        setPaused(true)
        const from = e.relatedTarget
        if (from instanceof HTMLElement && !region.current?.contains(from)) returnTo.current = from
      }}
      onBlur={e => { if (!region.current?.contains(e.relatedTarget as Node | null)) setPaused(false) }}
    >
      <ol className="toast-region__list" aria-live="polite">
        {visible && items.map(t => <LiveToast key={t.id} item={t} paused={paused} onDismiss={() => dismiss(t.id)} />)}
      </ol>
    </section>,
    overlayLayer(),
  )
}

function LiveToast({ item, paused, onDismiss }: { item: ToastItem; paused: boolean; onDismiss: () => void }) {
  const duration = item.duration ?? (item.action ? 8000 : 5000)
  const left = useRef(duration)
  const onDismissRef = useRef(onDismiss)
  useEffect(() => { onDismissRef.current = onDismiss })
  useEffect(() => { left.current = duration }, [item, duration]) // a replaced toast starts its time again
  useEffect(() => {
    if (paused || !Number.isFinite(duration)) return
    const started = Date.now()
    const timer = window.setTimeout(() => onDismissRef.current(), left.current)
    return () => {
      window.clearTimeout(timer)
      left.current = Math.max(0, left.current - (Date.now() - started))
    }
  }, [paused, duration, item])
  return (
    <li className="toast-region__item">
      <Toast {...item} onDismiss={onDismiss} />
    </li>
  )
}

export type ToastProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & Omit<ToastOptions, 'id' | 'duration'> & {
  /** The close button (and Escape inside the toast). Without it the toast has no close button. */
  onDismiss?: () => void
  dismissLabel?: string
}

/**
 * One toast: icon, message, action, close. Static in the gallery; ToastProvider renders it live inside its polite live
 * region (an error toast is role=alert, announced at once).
 */
export function Toast({ message, action, tone = 'neutral', icon, onDismiss, dismissLabel = 'Dismiss', className, onKeyDown, ...rest }: ToastProps) {
  const handleKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.key === 'Escape' && onDismiss && !e.defaultPrevented) {
      e.preventDefault() // marks the native event handled too, so a modal underneath stays open
      onDismiss()
    }
  }
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cx('toast', tone === 'error' && 'toast--error', className)}
      onKeyDown={handleKey}
      {...rest}
    >
      {icon && <img alt="" src={icon} className="toast__icon" />}
      <span className="toast__msg">{message}</span>
      {(action || onDismiss) && (
        <span className="toast__acts">
          {action && (
            <button type="button" className="toast__action" onClick={() => { action.onClick(); onDismiss?.() }}>
              {action.label}
            </button>
          )}
          {onDismiss && (
            <button type="button" className="toast__close" aria-label={dismissLabel} onClick={onDismiss}>
              <img alt="" src={overlayIcons.closeLgLight} />
            </button>
          )}
        </span>
      )}
    </div>
  )
}
