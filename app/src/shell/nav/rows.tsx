import { useState, type MouseEvent, type ReactNode } from 'react'
import { useProjectFix } from '../../fixes/projects'
import { DARK, LIGHT } from './icons'
import { NAV_PAGES, STATUS_LABEL, type ChatStatus, type NavKey, type NavMode, type NavSelectionProps } from './model'

// Building blocks for the expanded nav. Class names are the HTML prototype's, so nav.css applies as-is.

export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ')

/** What a destination row needs from the nav: the highlighted row, the page on screen, and how to activate a key. */
export type Destinations = {
  selected: NavKey | null | undefined
  /** gets aria-current="page" */
  current: NavKey | null | undefined
  hrefFor: (key: NavKey) => string | undefined
  activate: (key: NavKey) => void
}

/** Selection + routing wiring shared by Nav and Rail. */
export function destinations({ selected, current, onSelect, onNavigate, pages = NAV_PAGES }: NavSelectionProps): Destinations {
  return {
    selected,
    current: current === undefined ? selected : current,
    // hash routes (see src/router/router.ts), so a middle-click / "open in new tab" lands on the page
    hrefFor: key => (pages[key] ? '#' + pages[key] : undefined),
    activate: key => {
      onSelect?.(key)
      const path = pages[key]
      if (path) onNavigate?.(path)
    },
  }
}

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

/** A row that does something when pressed: a link when it has a page, a button otherwise.
 *  Rows without a page never navigate (no bare href="#"). */
export function RowAction({ className, href, current, label, title, onActivate, children }: {
  className: string
  href?: string
  current?: boolean
  label?: string
  title?: string
  onActivate?: () => void
  children: ReactNode
}) {
  const ariaCurrent = current ? 'page' : undefined
  if (href) {
    const go = (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainClick(e)) return
      e.preventDefault() // the caller routes via onNavigate
      onActivate?.()
    }
    return (
      <a className={className} href={href} aria-current={ariaCurrent} aria-label={label} title={title} onClick={go}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={className} aria-current={ariaCurrent} aria-label={label} title={title} onClick={onActivate}>
      {children}
    </button>
  )
}

/** Nav_menu/Main row: icon + label. Pass `to` for a destination row (selectable, may navigate). */
export function NavRow({ tone, to, nav, icon, label, className, innerClassName, labelClassName, hover }: {
  tone: NavMode
  to?: NavKey
  nav?: Destinations
  icon: string
  label: string
  className?: string
  innerClassName?: string
  labelClassName?: string
  hover?: boolean
}) {
  const selected = !!to && nav?.selected === to
  return (
    <RowAction
      className={cx(tone === 'dark' ? 'nrow' : 'lrow', className, selected && 'is-selected', hover && 'is-hover')}
      href={to && nav?.hrefFor(to)}
      current={!!to && nav?.current === to}
      onActivate={to && nav ? () => nav.activate(to) : undefined}
    >
      <span className={cx('nrow__in', innerClassName)}>
        <img alt="" src={icon} className="ni" />
        <span className={cx(tone === 'dark' ? 'nt' : 'lt', labelClassName)}>{label}</span>
      </span>
    </RowAction>
  )
}

/** Nav_menu/Agent row: 20px agent avatar + name. */
export function AgentRow({ tone, avatar, name, labelClassName }: {
  tone: NavMode
  avatar: string
  name: string
  labelClassName?: string
}) {
  return (
    <RowAction className={tone === 'dark' ? 'nagent' : 'lagent'}>
      <img alt="" src={avatar} className="nav-av" />
      <span className={cx(tone === 'dark' ? 'nt' : 'lt', labelClassName)}>{name}</span>
    </RowAction>
  )
}

/** Accessible name of a chat row: title, then status and age when shown. */
const chatLabel = (title: string, status?: ChatStatus, time?: string) =>
  [title.trim(), status && STATUS_LABEL[status], time].filter(Boolean).join(', ')

/** The file's static dot for each status (unread has none: it is drawn by the nav-unread-dot fix only). */
const STATIC_DOT: Record<NavMode, Record<Exclude<ChatStatus, 'unread'>, string>> = {
  dark: { progress: DARK.dotProgress, waiting: DARK.dotWaiting, failed: DARK.dotFailed },
  light: { progress: LIGHT.dotRing, waiting: LIGHT.dotFilled, failed: LIGHT.dotRing },
}

/**
 * Status dot. As designed: the file's static dots (dark: gradient ring, 4px white dot, red ring; light: a grey ring,
 * or a filled dot for waiting). With the nav-status-dots-animated fix, animated in CSS: ring spin (progress), pulse
 * (waiting), brighter red ring (failed). Unread is a static 6px dot either way (it only shows with nav-unread-dot).
 */
function StatusDot({ status, tone, className }: { status: ChatStatus; tone: NavMode; className?: string }) {
  const animated = useProjectFix('nav-status-dots-animated')
  if (!animated && status !== 'unread') return <img alt="" src={STATIC_DOT[tone][status]} className={cx(className, 'sdot-img')} />
  return <span className={cx(className, 'sdot', `sdot--${status}`, tone === 'light' && 'sdot--lt')} />
}

/* Chat rows hold two controls (open the chat, and the ⋯ menu), so the row is a <div> with a
   transparent "open" button stretched over it and the ⋯ button stacked above that. The visible
   text is aria-hidden because the open button's label already says it. */

/** Nav_menu/Chat_history, dark: status dot at rest; on hover the row lights up and ⋯ replaces the dot. */
export function ChatRow({ title, status, time, className, preserveSpaces, hover }: {
  title: string
  status?: ChatStatus
  time?: string
  className?: string
  /** keep runs of spaces as drawn ("follow-up  meeting") */
  preserveSpaces?: boolean
  hover?: boolean
}) {
  // the file draws no unread dot; the nav-unread-dot fix adds it (and its "Unread" in the row's name)
  const unread = useProjectFix('nav-unread-dot')
  const shown = status === 'unread' && !unread ? undefined : status
  return (
    <div className={cx('nchat', className, hover && 'is-hover')}>
      <button type="button" className="nchat__open" aria-label={chatLabel(title, shown, time)} />
      <span className={cx('nt', preserveSpaces && 'nt--pre')} aria-hidden="true">{title}</span>
      <span className="ndot" aria-hidden="true">{shown && <StatusDot status={shown} tone="dark" />}</span>
      {time && <span className="ntime" aria-hidden="true">{time}</span>}
      <button type="button" className="nmore" aria-label={`More actions for ${title.trim()}`}>
        <img alt="" src={DARK.more} />
      </button>
    </div>
  )
}

/** Light chat row: dot before the title. `dot: 'ring'` is the file's static ring (not animated).
 *  `more` shows the always-visible ⋯ of the History rows; `time` the trailing age. */
export function LightChatRow({ title, dot, more, time, className }: {
  title: string
  dot: ChatStatus | 'ring'
  more?: boolean
  time?: string
  className?: string
}) {
  const status = dot === 'ring' ? undefined : dot
  return (
    <div className={cx('lchat', className)}>
      <button type="button" className="lchat__open" aria-label={chatLabel(title, status, time)} />
      <span className="lchat__in" aria-hidden="true">
        {status ? <StatusDot status={status} tone="light" className="ldot" /> : <img alt="" src={LIGHT.dotRing} className="ldot" />}
        <span className="lt lt--2">{title}</span>
      </span>
      {more && (
        <button type="button" className="lmore" aria-label={`More actions for ${title.trim()}`}>
          <img alt="" src={LIGHT.more} />
        </button>
      )}
      {time && <span className="ltime" aria-hidden="true">{time}</span>}
    </div>
  )
}

/** A titled group whose chevron collapses / expands its rows. The trailing divider stays visible. */
export function NavSection({ tone, title, className, headerClassName, divider, children }: {
  tone: NavMode
  title: string
  className: string
  headerClassName: string
  /** draw the 1px rule after the group */
  divider?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  const icons = tone === 'dark' ? DARK : LIGHT
  return (
    <div className={cx(className, !open && 'is-collapsed')}>
      <div className={headerClassName}>
        <span className={tone === 'dark' ? 'nsub__t' : 'lsub__t'}>{title}</span>
        <button
          type="button"
          className="nsub__chev"
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${title}`}
          onClick={() => setOpen(o => !o)}
        >
          <img alt="" src={open ? icons.sectionOpen : icons.sectionClosed} />
        </button>
      </div>
      {open && children}
      {divider && <NavDivider tone={tone} />}
    </div>
  )
}

/** The 250px rule between groups. */
export function NavDivider({ tone }: { tone: NavMode }) {
  return <div className="nsep"><span className={tone === 'dark' ? 'nline' : 'lline'} /></div>
}
