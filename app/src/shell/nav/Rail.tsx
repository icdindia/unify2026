import { useRef } from 'react'
import { requestFocus, useFocusHandoffOnUnmount, useFocusRequest } from './focusHandoff'
import { RAIL_DARK, RAIL_LIGHT } from './icons'
import { LogoSpiral } from './LogoSpiral'
import { NODE, type NavKey, type NavMode, type NavSelectionProps } from './model'
import { cx, destinations, RowAction } from './rows'
import { useSignedInUser } from './user'
import './rail.css'

export type RailProps = NavSelectionProps & {
  mode: NavMode
  /** The logo ("Expand navigation") was pressed. Focus then moves to the Nav's "Collapse navigation". */
  onExpand?: () => void
}

type RailItem = { label: string; icon: string; to?: NavKey }

// Icon-only items, in the order drawn. Search and Agents have no destination key, so they never
// select (as in the file's prototype). The light rail has no Search.
const ITEMS: Record<NavMode, RailItem[]> = {
  dark: [
    { label: 'New Session', icon: RAIL_DARK.newSession, to: 'new' },
    { label: 'Search', icon: RAIL_DARK.search },
    { label: 'Projects', icon: RAIL_DARK.projects, to: 'projects' },
    { label: 'Routines', icon: RAIL_DARK.routines, to: 'routines' },
    { label: 'Meetings', icon: RAIL_DARK.meetings, to: 'meetings' },
    { label: 'Artifacts', icon: RAIL_DARK.artifacts, to: 'artifacts' },
    { label: 'Agents', icon: RAIL_DARK.agents },
  ],
  light: [
    { label: 'New Session', icon: RAIL_LIGHT.newSession, to: 'new' },
    { label: 'Projects', icon: RAIL_LIGHT.projects, to: 'projects' },
    { label: 'Routines', icon: RAIL_LIGHT.routines, to: 'routines' },
    { label: 'Meetings', icon: RAIL_LIGHT.meetings, to: 'meetings' },
    { label: 'Artifacts', icon: RAIL_LIGHT.artifacts, to: 'artifacts' },
    { label: 'Agents', icon: RAIL_LIGHT.agents },
  ],
}

/** Collapsed main navigation, 56px wide. Dark = Main_nav_compact 226:81199, light = 9721:595036. */
export function Rail({ mode, onExpand, ...selection }: RailProps) {
  const nav = destinations(selection)
  const user = useSignedInUser()
  const root = useRef<HTMLElement>(null)
  const expandRef = useRef<HTMLButtonElement>(null)
  useFocusRequest('rail-expand', expandRef)
  useFocusHandoffOnUnmount(root)

  const expand = () => {
    requestFocus('nav-collapse')
    onExpand?.()
  }

  return (
    <nav ref={root} className={cx('rail', `rail--${mode}`)} data-node-id={mode === 'dark' ? NODE.railDark : NODE.railLight} aria-label="Main (collapsed)">
      <div className="rail__nav">
        <button ref={expandRef} type="button" className="rail__logo" aria-label="Expand navigation" title="Expand navigation" onClick={expand}>
          <LogoSpiral tone={mode} />
        </button>
        <div className="rail__items">
          {ITEMS[mode].map(({ label, icon, to }) => {
            return (
              <RowAction
                key={label}
                className={cx('ritem', to && `ritem--${to}`, !!to && nav.selected === to && 'is-selected')}
                href={to && nav.hrefFor(to)}
                current={!!to && nav.current === to}
                label={label}
                title={label}
                onActivate={to ? () => nav.activate(to) : undefined}
                inert={!!to && nav.inert(to)}
              >
                <img alt="" src={icon} />
              </RowAction>
            )
          })}
        </div>
      </div>
      <div className="rail__foot"><span className="rail__av">{user.initial}</span></div>
    </nav>
  )
}
