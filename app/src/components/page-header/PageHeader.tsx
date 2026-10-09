import type { MouseEvent, ReactNode, Ref } from 'react'
import { IconButton } from '../buttons/IconButton'
import { SecondaryButton } from '../buttons/SecondaryButton'
import { cx } from '../buttons/cx'
import { openMenuOnArrowDown } from '../dropdown-menu/DropdownMenu'
import pinXs from '../../assets/chrome/hdr-pin.svg'
import moreXs from '../../assets/chrome/hdr-dots-vertical.svg'
import pinSm from '../../assets/chrome/o2-pin.svg'
import moreSm from '../../assets/chrome/o2-dots.svg'
import './page-header.css'

// Option 1 uses the 24px exports (padding baked in, filled pin); option 2 the 16px black outline pin-02 and dots.
const ICONS = { xs: { pin: pinXs, more: moreXs }, sm: { pin: pinSm, more: moreSm } }

export type PageHeaderProps = {
  title: string
  description?: ReactNode
  /** Action button size: xs 24px (inside page option 1) or sm 28px (option 2, Secondary Share). */
  size?: 'xs' | 'sm'
  onPin?: (e: MouseEvent<HTMLButtonElement>) => void
  /** When given, the pin button reports it as aria-pressed. */
  pinned?: boolean
  /** Opens the header menu. Position it from e.currentTarget (see relativeBox / DropdownMenu); keyboardFocus(e) tells a
   *  keyboard open (Enter, Space, or ArrowDown, which clicks the button) so the menu can take focus. */
  onMore?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Whether the header menu is open: keeps the ⋮ highlighted and sets aria-expanded. */
  moreExpanded?: boolean
  moreRef?: Ref<HTMLButtonElement>
  onShare?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Figma node id, when the header is its own node on the screen. */
  nodeId?: string
  className?: string
}

/** Page title (Spectral Display md) with pin / more / Share, over a description. */
export function PageHeader({
  title, description, size = 'xs', onPin, pinned, onMore, moreExpanded = false, moreRef, onShare, nodeId, className,
}: PageHeaderProps) {
  const icons = ICONS[size]
  return (
    <div className={cx('page__head', className)} data-node-id={nodeId}>
      <div className="page__titlerow">
        <h1 className="page__title" tabIndex={-1}>{title}</h1>
        <div className="page__acts">
          <IconButton size={size} icon={icons.pin} aria-label="Pin" aria-pressed={pinned} onClick={onPin} />
          <IconButton size={size} icon={icons.more} aria-label="More" aria-haspopup="menu" aria-expanded={moreExpanded}
                      ref={moreRef} onClick={onMore} onKeyDown={openMenuOnArrowDown} />
          <SecondaryButton size={size} label="Share" onClick={onShare} />
        </div>
      </div>
      {description && <p className="page__desc">{description}</p>}
    </div>
  )
}
