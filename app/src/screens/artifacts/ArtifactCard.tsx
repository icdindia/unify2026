import type { MouseEvent, Ref } from 'react'
import { cx, openMenuOnArrowDown } from '../../components'
import { TYPE_ICONS } from '../../components/artifact-header'
import { Link } from '../../router/Link'
import { ARTIFACT_TYPES, type StatusIcon } from '../../fixtures/artifacts'
import { useResolved } from '../../fixtures/drift'
import { person } from '../../fixtures/people'
import type { ArtifactEntry } from './collection'
import { thumbOf } from './thumbs'
import pinIcon from '../../assets/projects/pc-pin.svg'
import lockIcon from '../../assets/projects/pc-lock.svg'
import globeIcon from '../../assets/projects/pc-globe.svg'
import usersIcon from '../../assets/projects/pc-users.svg'
import moreIcon from '../../assets/projects/pc-more.svg'
import './artifact-card.css'

/** "artifacts" card set: Property 1=full image (7907:305066) / hover 2 (8412:196459). */
export const ARTIFACT_CARD_NODE = '7907:305066'

export const STATUS_ICON: Record<StatusIcon, { src: string; label: string }> = {
  pin: { src: pinIcon, label: 'Pinned' },
  lock: { src: lockIcon, label: 'Private' },
  users: { src: usersIcon, label: 'Shared' },
  globe: { src: globeIcon, label: 'Published' },
}

/** "2h ago" as every card draws it; 0 is "now" (the clone, 13750:280936). */
export function ago(minutes = 120): string {
  if (minutes <= 0) return 'now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`
  return `${Math.round(minutes / 60 / 24)}d ago`
}

export type ArtifactCardProps = {
  entry: ArtifactEntry
  /** Where the card opens (the artifact page). */
  to: string
  /** Its ⋯ menu is open: the card keeps its hover look and the ⋯ stays visible. */
  menuOpen?: boolean
  onMore: (e: MouseEvent<HTMLButtonElement>) => void
  moreRef?: Ref<HTMLButtonElement>
  /** Review only: draw the hover state (hover 2). */
  pinnedHover?: boolean
}

/**
 * Artifact card, 288 x 260 at 1440 (three to a row in the 928 column): the type-tinted thumbnail area (164, pad 12) holding
 * the canvas image (262 x 140, radius 4, soft shadow), then the mono type label, the title (two lines) and author · time
 * with the status glyphs. The whole card opens the artifact (a link stretched over it); hover shows the ⋯ menu button.
 */
export function ArtifactCard({ entry, to, menuOpen = false, onMore, moreRef, pinnedHover }: ArtifactCardProps) {
  const a = useResolved(entry)
  const spec = ARTIFACT_TYPES[a.type]
  const thumb = thumbOf(entry)
  const author = a.author ? person(a.author).name : ''
  return (
    <div
      className={cx('acard', (pinnedHover || menuOpen) && 'is-hover', menuOpen && 'is-active')}
      data-node-id={a.figma[0] ?? ARTIFACT_CARD_NODE}
    >
      <Link className="acard__open" to={to} aria-label={`Open ${a.name}`} />
      <div className="acard__thumb" style={{ background: `var(${spec.tint})` }}>
        {thumb ? (
          <span className="acard__img"><img alt="" src={thumb} /></span>
        ) : (
          <span className="acard__img acard__img--empty" data-node-id="8412:194488" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 9" />
            </svg>
          </span>
        )}
        <button
          ref={moreRef} type="button" className="acard__more" aria-label={`${a.name}: actions`} aria-haspopup="menu" aria-expanded={menuOpen}
          onClick={onMore} onKeyDown={openMenuOnArrowDown}
        >
          <img alt="" src={moreIcon} />
        </button>
      </div>
      <div className="acard__body">
        <p className="acard__type">
          <img alt="" src={TYPE_ICONS[spec.headerIcon]} />
          <span>{spec.card}</span>
        </p>
        <div className="acard__txt">
          <p className="acard__title">{a.name}</p>
          <div className="acard__meta">
            <span className="acard__who">
              <span className="acard__name">{author}</span>
              <span className="acard__dot" aria-hidden="true">·</span>
              <span className="acard__when">{ago(a.minutesAgo)}</span>
            </span>
            <span className="acard__status">
              {(a.iconsAsDrawn ?? []).map(i => (
                <img key={i} alt={STATUS_ICON[i].label} title={STATUS_ICON[i].label} src={STATUS_ICON[i].src} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
