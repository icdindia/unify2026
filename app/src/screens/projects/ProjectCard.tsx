import type { MouseEvent, Ref } from 'react'
import { cx, openMenuOnArrowDown } from '../../components'
import { Link } from '../../router/Link'
import type { Project } from '../../data/projects'
import folderIcon from '../../assets/projects/pc-folder.svg'
import pinIcon from '../../assets/projects/pc-pin.svg'
import lockIcon from '../../assets/projects/pc-lock.svg'
import globeIcon from '../../assets/projects/pc-globe.svg'
import usersIcon from '../../assets/projects/pc-users.svg'
import moreIcon from '../../assets/projects/pc-more.svg'
import './project-card.css'

export type ProjectCardProps = {
  project: Project
  /** Its ⋯ menu is open: the card keeps its hover look and the ⋯ stays visible. */
  menuOpen?: boolean
  onMore: (e: MouseEvent<HTMLButtonElement>) => void
  moreRef?: Ref<HTMLButtonElement>
  /** Review harness only (?state=landing): draw the card in its hover state. */
  pinnedHover?: boolean
}

/**
 * Project card (Property 1=default / hover). The whole card opens the project: a link stretched over it, so
 * Cmd/Ctrl-click opens a new tab and the ⋯ button above it is not nested inside another control.
 */
export function ProjectCard({ project, menuOpen = false, onMore, moreRef, pinnedHover }: ProjectCardProps) {
  return (
    <div className={cx('pcard', pinnedHover && 'is-hover', menuOpen && 'is-active')}>
      <Link className="pcard__open" to={`/projects/${project.slug}`} aria-label={`Open project ${project.name}`} />
      <div className="pcard__body">
        <div className="pcard__icon"><img alt="" src={folderIcon} /></div>
        <div className="pcard__txt">
          <div>
            <p className="pcard__title">{project.name}</p>
            <p className="pcard__count">{project.items} items</p>
          </div>
          <div className="pcard__meta">
            <span className="pcard__who">
              <span className="pcard__name">{project.owner}</span>
              <span className="pcard__dot">·</span>
              <span className="pcard__date">{project.updated}</span>
            </span>
            <span className="pcard__icons">
              <img alt="Pinned" src={pinIcon} />
              <img alt="Private" src={lockIcon} />
              <img alt="Public link" src={globeIcon} />
              <img alt="Shared" src={usersIcon} />
            </span>
          </div>
        </div>
      </div>
      <button ref={moreRef} type="button" className="pcard__more" aria-label={`Actions for ${project.name}`}
              aria-haspopup="menu" aria-expanded={menuOpen} onClick={onMore} onKeyDown={openMenuOnArrowDown}>
        <img alt="" src={moreIcon} />
      </button>
    </div>
  )
}
