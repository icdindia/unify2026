import { useRef } from 'react'
import { requestFocus, useFocusHandoffOnUnmount, useFocusRequest } from './focusHandoff'
import { DARK, LIGHT } from './icons'
import { LogoSpiral } from './LogoSpiral'
import { NODE, type NavMode, type NavSelectionProps } from './model'
import { DarkNavItems, LightNavItems } from './NavItems'
import { cx, destinations } from './rows'
import { useSignedInUser } from './user'
import './nav.css'

export type NavProps = NavSelectionProps & {
  mode: NavMode
  /** "Collapse navigation" was pressed. Focus then moves to the Rail's "Expand navigation" button. */
  onCollapse?: () => void
  /** Footer bell (dark mode only; the light footer has no bell). */
  onNotifications?: () => void
  /** Footer account chevron. */
  onAccountMenu?: () => void
  /** Diff harness: pin the hover states drawn in the dashboard frame (dark mode), like ?state=frame
   *  in the HTML prototype. Never set in normal use. */
  pinFigmaHovers?: boolean
}

/** Expanded main navigation, 280px wide, filling its column's height; the item list scrolls.
 *  Dark = Main_nav 226:81200, light = 9721:594967. */
export function Nav({ mode, onCollapse, onNotifications, onAccountMenu, pinFigmaHovers, ...selection }: NavProps) {
  const dark = mode === 'dark'
  const icons = dark ? DARK : LIGHT
  const nav = destinations(selection)
  const user = useSignedInUser()
  const root = useRef<HTMLElement>(null)
  const collapseRef = useRef<HTMLButtonElement>(null)
  useFocusRequest('nav-collapse', collapseRef)
  useFocusHandoffOnUnmount(root)

  const collapse = () => {
    requestFocus('rail-expand')
    onCollapse?.()
  }

  return (
    <nav ref={root} className={cx('nav', dark ? 'nav--dark' : 'nav--light')} data-node-id={dark ? NODE.navDark : NODE.navLight} aria-label="Main">
      <div className="nav__top">
        <div className={cx('nav__head', !dark && 'lnav__head')}>
          <div className="nav__logo">
            <LogoSpiral tone={mode} />
            <span className="nav__word"><img alt="UnifyApps" src={icons.wordmark} /></span>
          </div>
          <div className="nav__tools">
            <button type="button" className={cx('nbtn', !dark && 'lbtn')} aria-label="Search">
              <img alt="" src={icons.search} />
            </button>
            <button ref={collapseRef} type="button" className={cx('nbtn', !dark && 'lbtn')} aria-label="Collapse navigation" onClick={collapse}>
              <img alt="" src={icons.collapse} />
            </button>
          </div>
        </div>

        <div className="nav__scroll">
          {dark ? <DarkNavItems nav={nav} pinFigmaHovers={pinFigmaHovers} /> : <LightNavItems nav={nav} />}
        </div>
      </div>

      {dark ? (
        <div className="nfoot" data-node-id={NODE.navDarkFooter}>
          <span className="nfoot__av">{user.initial}</span>
          <span className="nfoot__name">{user.name}</span>
          <span className="nfoot__btns">
            <button type="button" className="nfbtn" aria-label="Notifications" onClick={onNotifications}>
              <img alt="" src={DARK.bell} />
            </button>
            <button type="button" className="nfbtn" aria-label="Account menu" onClick={onAccountMenu}>
              <img alt="" src={DARK.accountMenu} />
            </button>
          </span>
        </div>
      ) : (
        <div className="lfoot">
          <span className="lfoot__av">{user.initial}</span>
          <span className="lfoot__name">{user.name}</span>
          <button type="button" className="lfoot__chev" aria-label="Account menu" onClick={onAccountMenu}>
            <img alt="" src={LIGHT.accountMenu} />
          </button>
        </div>
      )}
    </nav>
  )
}
