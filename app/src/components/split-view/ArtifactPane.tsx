import { useRef, useState } from 'react'
import { ArtifactHeader, type ArtifactView } from '../artifact-header/ArtifactHeader'
import { VersionBanner } from '../artifact-header/VersionBanner'
import { ArtifactCanvas } from '../artifact-canvas/ArtifactCanvas'
import { ARTIFACT_TYPES, artifact, type ArtifactId } from '../../fixtures/artifacts'
import { useFixPredicate, useResolved } from '../../fixtures/drift'
import { ArtifactPanel } from './ArtifactPanel'

/** What 21b (6405:308388) has typed into the rename field: shown when the route opens straight into edit=name. */
export const RENAME_DRAFT_AS_DRAWN = 'Untitled name here.xls'

export type ArtifactPaneProps = {
  /** The fixture artifact (fixtures/artifacts.ts), e.g. 'pipeline-command'. */
  id: ArtifactId
  /** Expanded over the chat (full=1). Default: from the enclosing SplitView. */
  full?: boolean
  /** The version menu (URL menu=version). Pass with onMenuOpenChange to keep it in the URL; omit for local state. */
  menuOpen?: boolean
  onMenuOpenChange?: (open: boolean) => void
  /** The rename field (URL edit=name). When it opens without the user clicking the name (a review URL), as designed the
   *  field shows what 21b has typed, "Untitled name here.xls". */
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  /** Pin the name's hover (URL hover=artifact-name, 21a). */
  nameHover?: boolean
  /** Focus the rename field when it opens (default true). */
  focusOnEdit?: boolean
  /** Preview / code. Omit for local state. */
  view?: ArtifactView
  onViewChange?: (view: ArtifactView) => void
  /** A committed rename (the pane shows the new name either way). */
  onRename?: (name: string) => void
  onToggleFull?: () => void
  onClose?: () => void
  onCopy?: () => void
  onRefresh?: () => void
  onPublish?: () => void
  commentsOn?: boolean
  onComment?: () => void
  onCommentMenu?: (anchor: HTMLElement) => void
  onDownload?: (anchor: HTMLElement) => void
}

/**
 * The artifact side of the split, wired from the fixtures: ArtifactPanel + ArtifactHeader + the "Viewing vN" banner +
 * ArtifactCanvas, for one artifact. Resolves the fixture's drift (as designed "Untitled.xls" with a document mark and
 * the drawn version names; with fixes "Pipeline Command" with the App mark), keeps the rename, the picked version and
 * preview / code locally unless the screen controls them, and passes every other action up. Its data-node-id is
 * ArtifactPanel's ("Canvas" 4376:395815); the header and the canvas carry their own.
 */
export function ArtifactPane({
  id, full, menuOpen, onMenuOpenChange, editing, onEditingChange, nameHover, focusOnEdit, view: viewProp, onViewChange, onRename,
  onToggleFull, onClose, onCopy, onRefresh, onPublish, commentsOn, onComment, onCommentMenu, onDownload,
}: ArtifactPaneProps) {
  const a = useResolved(artifact(id))
  const applies = useFixPredicate()
  const [renamed, setRenamed] = useState<string | null>(null)
  const name = renamed ?? a.headerName ?? a.name
  const icon = a.headerIcon ?? ARTIFACT_TYPES[a.type].headerIcon
  const latestN = typeof a.version === 'number' ? a.version : 1
  const versions = a.versions ?? [{ n: latestN, label: name, when: 'Today • Latest' }]
  const newest = Math.max(...versions.map(v => v.n))
  const [version, setVersion] = useState(newest)
  const shown = versions.find(v => v.n === version)
  const [viewLocal, setViewLocal] = useState<ArtifactView>('preview')
  const view = viewProp ?? viewLocal

  // a rename the user starts by clicking starts from the name; one opened by the URL (review step 21b) shows the draft
  const userEdit = useRef(false)
  // (as designed only: with fix panel-name-matches-card the artifact is "Pipeline Command", which that draft does not fit)
  const draft = editing && !userEdit.current && !applies('panel-name-matches-card') && !renamed ? RENAME_DRAFT_AS_DRAWN : undefined

  return (
    <ArtifactPanel
      label={name} full={full}
      header={
        <ArtifactHeader
          name={name} icon={icon} interactive={a.type === 'application'} variant={full === undefined ? undefined : full ? 'full' : 'split'}
          versions={versions} version={version} onVersionChange={setVersion}
          menuOpen={menuOpen} onMenuOpenChange={onMenuOpenChange}
          editing={editing} draft={draft} nameHover={nameHover} focusOnEdit={focusOnEdit}
          onEditingChange={e => { userEdit.current = e; onEditingChange?.(e) }}
          onRename={n => { setRenamed(n); onRename?.(n) }}
          view={view} onViewChange={v => { setViewLocal(v); onViewChange?.(v) }}
          onToggleFull={onToggleFull} onClose={onClose} onCopy={onCopy} onRefresh={onRefresh} onPublish={onPublish}
          commentsOn={commentsOn} onComment={onComment} onCommentMenu={onCommentMenu} onDownload={onDownload}
        />
      }
      banner={version !== newest && shown ? <VersionBanner version={version} when={shown.when} onLatest={() => setVersion(newest)} /> : undefined}
    >
      <ArtifactCanvas kind={a.canvas} view={view} name={name} full={full} />
    </ArtifactPanel>
  )
}
