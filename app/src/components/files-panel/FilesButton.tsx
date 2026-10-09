import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import { IconButton } from '../buttons/IconButton'
import { Clipboard16 } from '../inline-artifact-card/icons'
import './files-button.css'

export type FilesButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label'> & {
  /** Badge count (16: "2"); none when 0 or absent. */
  count?: number
  /** The panel is open (17, 19): the pressed look (bg-tertiary, pigeon-blue icon). Also sets aria-expanded. */
  open?: boolean
  /** Pinned hover for review. */
  hover?: boolean
  'aria-label'?: string
  nodeId?: string
}

/**
 * The chat header's files button (ES Breadcrumb: Buttons/Button Neutral sm Tertiary Icon=Only, clipboard 16) with its
 * count badge (Pill solid xxs 5975:413709: a 12px steel-blue-400 disc, 0.75px gray-25 ring, white 8.25 Geist Medium).
 * It toggles the files panel: give it aria-controls={panel id}.
 */
export function FilesButton({
  count, open = false, hover, 'aria-label': label, nodeId = '11932:738077', className, ...rest
}: FilesButtonProps) {
  const name = label ?? (count ? `Files in this chat (${count})` : 'Files in this chat')
  return (
    <span className="filesbtn-wrap">
      <IconButton
        size="sm" aria-label={name} aria-expanded={open} nodeId={nodeId}
        className={cx('filesbtn', open && 'is-open', hover && 'is-hover', className)} {...rest}
      >
        <Clipboard16 />
      </IconButton>
      {!!count && <span className="filesbtn__badge" aria-hidden="true" data-node-id="5975:413709">{count}</span>}
    </span>
  )
}
