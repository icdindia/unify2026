import { Fragment, type ReactNode } from 'react'
import { TertiaryButton } from '../buttons/TertiaryButton'
import { cx } from '../buttons/cx'
import slash from '../../assets/chrome/bc-slash.svg'
import chevronDown from '../../assets/chrome/bc-chevron-down.svg'
import './breadcrumb.css'

export type Crumb = {
  label: string
  onClick?: () => void
  /** The page you are on: primary text colour. */
  current?: boolean
  /** Shows a chevron-down (the crumb opens a switcher menu). */
  menu?: boolean
  /** Accessible name when the label alone is not enough. */
  'aria-label'?: string
}

export type BreadcrumbProps = {
  items: Crumb[]
  /** Optional right-hand controls (other screens put Share, avatars or icon buttons here). */
  actions?: ReactNode
  /** Figma node of this ES Breadcrumb instance; defaults to the one in "Dashboard" 14045:584747. */
  nodeId?: string
  className?: string
}

/**
 * ES Breadcrumb: "Projects / <project name> ⌄".
 *
 * Text-box quirk: in the file the project crumb's text box is "New Project Name " with a trailing space, and
 * Figma counts that space in the button width. The crumb with a menu therefore renders its label plus one
 * space, and .tbtn__t is white-space: pre so the space keeps its width.
 */
export function Breadcrumb({ items, actions, nodeId = 'I14045:584747;12085:586906', className }: BreadcrumbProps) {
  return (
    <nav className={cx('crumbs', className)} aria-label="Breadcrumb" data-node-id={nodeId}>
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <img alt="" src={slash} className="crumbs__slash" />}
          <TertiaryButton
            label={c.menu ? c.label + ' ' : c.label}
            strong={c.current}
            trailingIcon={c.menu ? chevronDown : undefined}
            className={c.current ? 'crumbs__current' : undefined}
            aria-current={c.current ? 'page' : undefined}
            aria-haspopup={c.menu ? 'menu' : undefined}
            aria-label={c['aria-label']}
            onClick={c.onClick}
          />
        </Fragment>
      ))}
      {actions && <div className="crumbs__actions">{actions}</div>}
    </nav>
  )
}
