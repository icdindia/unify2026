import { useId, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { cx } from '../buttons/cx'
import { Popover, type PopoverCloseReason } from '../overlays/popover/Popover'
import { IconButton } from '../buttons/IconButton'
import { CodePill } from '../pill/Pill'
import { ToggleGroup } from '../form/ToggleGroup'
import { Grid14, List14 } from '../form/icons'
import { scrollbar } from '../form/scrollbar'
import { InlineArtifactCard } from '../inline-artifact-card/InlineArtifactCard'
import { Download12, Download16 } from '../inline-artifact-card/icons'
import type { ChatFile } from '../../fixtures/artifacts'
import { FILE_ICON, FILE_THUMB, type FilesPanelArtifact, type FilesPanelView } from './data'
import './files-panel.css'

/** The files panel card as the chat draws it ("aritfacts and uploads access - option 1"): 14604:278262 in 5975:413714
 *  (list), 14607:405457 in 14607:403125 (grid). Detached layers in Figma, no component set. */
export const FILES_PANEL_NODE = { list: '14604:278262', grid: '14607:405457', dropdown: '14612:410631' } as const

export type FilesPanelProps = {
  artifacts: FilesPanelArtifact[]
  /** The count beside "Artifacts" (useFilesPanelData gives 3, as drawn). Default: artifacts.length. */
  artifactCount?: number
  files: ChatFile[]
  /** The count beside "Files". Default: files.length. */
  fileCount?: number
  view: FilesPanelView
  onViewChange: (view: FilesPanelView) => void
  onOpenArtifact?: (row: FilesPanelArtifact) => void
  onDownloadArtifact?: (row: FilesPanelArtifact) => void
  onDownloadAll?: () => void
  onDownloadFile?: (file: ChatFile) => void
  /** Escape inside the panel (the trigger gets focus back from the caller). */
  onClose?: () => void
  /** Pinned hover for review (5975:413714 hovers the Screenshot row, 14607:403125 the JSON tile). */
  hoverFile?: string | null
  /** Card height. 720 in the chat (17, 18) and as the split dropdown (19: "fixed height 720"). */
  height?: number
  /** Figma node of this instance; defaults to the card of 17 (list) / 18 (grid). */
  nodeId?: string
  id?: string
  className?: string
  style?: CSSProperties
}

/**
 * Files panel: the chat's artifacts (each opens in the split; Download, Download All) and its uploaded files as a list or
 * a 2-column grid. A 384 x 720 card that scrolls inside; the caller places it (a 400px column with 8px padding beside the
 * chat in 17 / 18, or a Popover under the files button in the split, 19).
 */
export function FilesPanel({
  artifacts, artifactCount, files, fileCount, view, onViewChange, onOpenArtifact, onDownloadArtifact, onDownloadAll,
  onDownloadFile, onClose, hoverFile, height = 720, nodeId, id, className, style,
}: FilesPanelProps) {
  const uid = useId()
  const artId = `${uid}-art`
  const fileId = `${uid}-files`
  const keyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape' && onClose && !e.defaultPrevented) { e.preventDefault(); onClose() }
  }
  return (
    <section
      id={id} className={cx('fp', className)} aria-label="Files in this chat" data-node-id={nodeId ?? FILES_PANEL_NODE[view]}
      style={{ ...style, height }} onKeyDown={keyDown}
    >
      <div className={cx('fp__scroll', scrollbar('md'))}>
        <div className="fp__section" role="group" aria-labelledby={artId}>
          <div className="fp__head fp__head--artifacts">
            <h2 className="fp__title" id={artId}>
              <span className="fp__title-t">Artifacts</span><CodePill size="xxs" aria-label={`${artifactCount ?? artifacts.length} artifacts`}>{artifactCount ?? artifacts.length}</CodePill>
            </h2>
            <button type="button" className="fp__all" data-node-id="11932:738079" onClick={() => onDownloadAll?.()}>
              <Download12 /><span className="fp__all-t">Download All</span>
            </button>
          </div>
          <ul className="fp__list" aria-label="Artifacts">
            {artifacts.map(row => (
              <li key={row.id}>
                <InlineArtifactCard
                  variant="panel" name={row.name} meta={row.meta} glyph={row.glyph}
                  onOpen={() => onOpenArtifact?.(row)} onDownload={() => onDownloadArtifact?.(row)}
                  nodeId="15219:419824"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="fp__section" role="group" aria-labelledby={fileId}>
          <div className="fp__head fp__head--files">
            <h2 className="fp__title" id={fileId}>
              <span className="fp__title-t">Files</span><CodePill size="xxs" aria-label={`${fileCount ?? files.length} files`}>{fileCount ?? files.length}</CodePill>
            </h2>
            <ToggleGroup
              aria-label="Files view" value={view} onChange={onViewChange} nodeId="14322:742285"
              options={[{ value: 'list', label: 'List view', icon: <List14 /> }, { value: 'grid', label: 'Grid view', icon: <Grid14 /> }]}
            />
          </div>
          {view === 'list' ? (
            <ul className="fp__list" aria-label="Files">
              {files.map(f => <li key={f.id}><FileRow file={f} hover={hoverFile === f.id} onDownload={onDownloadFile} /></li>)}
            </ul>
          ) : (
            <ul className="fp__grid" aria-label="Files">
              {files.map(f => <li key={f.id}><FileTile file={f} hover={hoverFile === f.id} onDownload={onDownloadFile} /></li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

type FileProps = { file: ChatFile; hover?: boolean; onDownload?: (file: ChatFile) => void }

/** A file of the list view (Inline Cards frame 14604:278341): File type icon/Label at 36, name, size, download on hover. */
export function FileRow({ file, hover, onDownload }: FileProps) {
  const icon = FILE_ICON[file.kind]
  const click = (e: MouseEvent) => { e.stopPropagation(); onDownload?.(file) }
  return (
    <div className={cx('fr', hover && 'is-hover')} data-node-id="14604:278341">
      <span className="fr__icon" data-node-id={icon.nodeId}><img src={icon.url} alt="" draggable={false} /></span>
      <span className="fr__text">
        <span className="fr__name" title={file.name}>{file.name}</span>
        <span className="fr__size">{file.size}</span>
      </span>
      <IconButton size="sm" className="fr__dl" aria-label={`Download ${file.name}`} onClick={click}>
        <Download16 />
      </IconButton>
    </div>
  )
}

/** A file of the grid view (14607:405534): thumbnail, type chip (Pill squared xs, Icon leading), download on hover. */
export function FileTile({ file, hover, onDownload }: FileProps) {
  const icon = FILE_ICON[file.kind]
  const click = (e: MouseEvent) => { e.stopPropagation(); onDownload?.(file) }
  return (
    <div className={cx('ft', hover && 'is-hover')} role="group" aria-label={file.name} data-node-id="14607:405534">
      <img className="ft__thumb" src={FILE_THUMB[file.kind]} alt="" draggable={false} />
      <span className="ft__chip" data-node-id="9806:508355">
        <img src={icon.url} alt="" draggable={false} />
        <span>{file.kind}</span>
      </span>
      <button type="button" className="ft__dl" aria-label={`Download ${file.name}`} data-node-id="11932:738171" onClick={click}>
        <Download12 />
      </button>
    </div>
  )
}

export type FilesPanelPopoverProps = Omit<FilesPanelProps, 'onClose'> & {
  open: boolean
  /** The header's FilesButton. */
  anchor: HTMLElement | null
  onClose: (reason: PopoverCloseReason) => void
  /** Move focus into the panel on open (a keyboard open). */
  autoFocus?: boolean
}

/**
 * The files panel as a dropdown from the chat header's files button, as the split view draws it (19, 14612:410631 in 13722:383349:
 * "when a artifact is open - fixed height 720"): 8 below the button, right edges aligned. Escape, a press outside and
 * focus leaving close it; Escape hands focus back to the button.
 */
export function FilesPanelPopover({ open, anchor, onClose, autoFocus, ...panel }: FilesPanelPopoverProps) {
  return (
    <Popover
      open={open} anchor={anchor} onClose={onClose} placement="bottom-end" gap={8} surface="plain" width={384}
      autoFocus={autoFocus ? 'first' : false} aria-label="Files in this chat"
    >
      <FilesPanel nodeId={FILES_PANEL_NODE.dropdown} {...panel} />
    </Popover>
  )
}
