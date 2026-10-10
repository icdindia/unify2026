import { useEffect, useRef, useState } from 'react'
import {
  ArtifactCanvas, ArtifactHeader, ArtifactPanel, DropdownItem, DropdownMenu, DropdownSeparator, Modal, ModalActions, ModalButton,
  ModalHeader, VersionMenu, menuIcons, relativeBox, useToast, type MenuFocus, type MenuPosition,
} from '../../components'
import { useMenuLayer } from '../../shell/AppShell'
import { useScreenNav } from '../../app/screenNav'
import { navigate } from '../../router/router'
import { setUi } from '../../router/uiParams'
import { ARTIFACT_TYPES } from '../../fixtures/artifacts'
import { useResolved } from '../../fixtures/drift'
import { whenFontsReady } from '../../review/reviewState'
import { artifactHref, chatHref } from './ArtifactsPage'
import { cloneArtifact, deleteArtifact, entryOf, renameArtifact, restoreArtifact, useArtifactSession, type ArtifactEntry } from './collection'
import './artifact-page.css'

const NAME_MENU_WIDTH = 188 // the name menu of 13750:301988 (x 306-494, right edge on the name button's)

/** What the artifact page's URL asks for (artifact-full-editor, cloned-artifact 02-03, artifact-view-editor-main 01). */
export type ArtifactPageState = {
  /** /view/:id (opened from the Artifacts page as the main view) rather than /artifacts/:id (the full editor). */
  view: boolean
  /** from=artifacts: Back returns to the landing. */
  fromArtifacts: boolean
  /** menu=name (and name>versions) */
  menu: 'name' | 'versions' | null
  /** edit=name */
  editing: boolean
  /** hover=back (01a) */
  hoverBack: boolean
  /** modal=delete:<id> */
  deleting: boolean
}

/**
 * The artifact on its own page: the full header over the canvas. Opened from a card (from=artifacts) it is the page
 * view: Back, the type mark and the name with its menu (Rename, Clone, Versions, Delete), "Edit with Chat" (or "Start
 * Chat" for a fresh clone), refresh, Publish, comments and download (7809:278865, 13750:301988). Without from= it is the
 * full editor (7809:273518..273559): copy, refresh, the version menu, Publish, comments, download, collapse (back to the
 * chat split) and close.
 */
export function ArtifactPage({ id, state }: { id: string; state: ArtifactPageState }) {
  useScreenNav('artifacts')
  const session = useArtifactSession()
  const entry = entryOf(id, session)
  if (!entry) return <DeletedArtifact />
  return <ArtifactPageBody key={id} entry={entry} state={state} />
}

function ArtifactPageBody({ entry, state }: { entry: ArtifactEntry; state: ArtifactPageState }) {
  const a = useResolved(entry)
  const layer = useMenuLayer()
  const toast = useToast()
  const gap = (what: string) => toast.show({ message: `${what}: not drawn in Figma yet` })

  const page = state.view || state.fromArtifacts
  const name = a.headerName ?? a.name
  const icon = a.headerIcon ?? ARTIFACT_TYPES[a.type].headerIcon
  const latestN = typeof a.version === 'number' ? a.version : 1
  const versions = a.versions ?? [{ n: latestN, label: name, when: 'Today • Latest' }]
  const newest = Math.max(...versions.map(v => v.n))
  const [version, setVersion] = useState(newest)

  // ---- the name menu (and its Versions list), anchored on the name button
  const nameBtn = useRef<HTMLElement | null>(null)
  const [menu, setMenu] = useState<{ kind: 'name' | 'versions'; position: MenuPosition; focus?: MenuFocus } | null>(null)
  const openMenu = (kind: 'name' | 'versions', anchor: HTMLElement, focus?: MenuFocus) => {
    if (!layer) return
    nameBtn.current = anchor
    const b = relativeBox(anchor, layer)
    setMenu({ kind, focus, position: { left: Math.max(b.left, b.right - NAME_MENU_WIDTH), top: b.bottom + 2, above: b.top - 2 } })
  }
  const closeMenu = () => { setMenu(null); if (state.menu) setUi({ menu: null }) }

  // a review URL opens the menu (menu=name, 13750:301988) once the fonts have set the header
  useEffect(() => {
    if (!state.menu || !layer) return
    return whenFontsReady(() => {
      const btn = document.querySelector<HTMLElement>('.apage .ahdr__name')
      if (btn) openMenu(state.menu === 'versions' ? 'versions' : 'name', btn)
    })
  }, [state.menu, layer]) // eslint-disable-line react-hooks/exhaustive-deps

  const [editing, setEditing] = useState(state.editing)
  useEffect(() => { setEditing(state.editing) }, [state.editing])

  const run = (fn: () => void) => () => { closeMenu(); fn() }
  const back = () => navigate('/artifacts')
  const clone = () => {
    const cloneId = cloneArtifact(a.id)
    navigate(artifactHref(cloneId))
    toast.show({ message: `Cloned “${a.name}”` })
  }
  const confirmDelete = () => {
    deleteArtifact(a.id)
    navigate('/artifacts')
    const id = a.id
    toast.show({ id: 'delete', message: `${a.name} deleted`, action: { label: 'Undo', onClick: () => restoreArtifact(id) } })
  }
  const chat = () => navigate(a.chat ? chatHref(a.id) : '/new')

  return (
    <div className="apage">
      <h1 className="apage__h1" tabIndex={-1}>{name}</h1>
      <ArtifactPanel
        full label={name}
        header={
          <div className="apage__hdr">
            <ArtifactHeader
              variant="full" page={page} name={name} icon={icon} interactive={a.type === 'application'}
              versions={versions} version={version} onVersionChange={setVersion}
              editing={editing} onEditingChange={e => { setEditing(e); if (!e && state.editing) setUi({ edit: null }) }}
              onRename={n => renameArtifact(a.id, n)}
              onBack={state.fromArtifacts ? back : undefined} backHover={state.hoverBack}
              cta={page ? { label: a.chat ? 'Edit with Chat' : 'Start Chat', onClick: chat } : undefined}
              onNameMenu={(anchor, focus) => (menu ? closeMenu() : openMenu('name', anchor, focus))} nameMenuOpen={!!menu}
              onToggleFull={a.chat ? chat : back}
              onClose={!page || state.view ? back : undefined}
              onCopy={() => toast.show({ message: 'Copied' })}
              onRefresh={() => gap('Refresh')}
              onPublish={() => gap('Publish')}
              onComment={() => gap('Comments')}
              onCommentMenu={() => gap('Comment options')}
              onDownload={() => gap('Download')}
            />
          </div>
        }
      >
        <ArtifactCanvas kind={a.canvas} name={name} full />
      </ArtifactPanel>

      {menu?.kind === 'name' && nameBtn.current && (
        <DropdownMenu
          nodeId="13750:301988" width={NAME_MENU_WIDTH} shadow="small" position={menu.position} anchor={nameBtn.current}
          autoFocus={menu.focus} portalTo={layer} onClose={closeMenu} aria-label={`${name}: options`}
        >
          <DropdownItem icon={menuIcons.pencil} label="Rename" onClick={run(() => setEditing(true))} />
          <DropdownItem icon={menuIcons.copy} label="Clone" onClick={run(clone)} />
          {versions.length > 1 && (
            <DropdownItem
              icon={menuIcons.archive} label="Versions" shortcut="›"
              onClick={() => nameBtn.current && openMenu('versions', nameBtn.current)}
            />
          )}
          <DropdownSeparator />
          <DropdownItem icon={menuIcons.trash} label="Delete" danger onClick={run(() => setUi({ modal: `delete:${a.id}`, menu: null }))} />
        </DropdownMenu>
      )}
      {menu?.kind === 'versions' && nameBtn.current && layer && (
        <VersionMenu
          versions={versions} current={version} icon={icon} anchor={nameBtn.current} container={layer}
          autoFocus={menu.focus} onSelect={n => { setVersion(n); closeMenu() }} onClose={closeMenu}
        />
      )}

      <Modal open={state.deleting} onClose={() => setUi({ modal: null })} width={360} radius={10} scrim="slate-25" nodeId="12057:581132">
        <ModalHeader title="Delete Artifact" subtitle="This will delete the artifact forever. It cannot be undone." hideClose titleWeight="regular" />
        <ModalActions>
          <ModalButton kind="secondary" label="Cancel" onClick={() => setUi({ modal: null })} />
          <ModalButton kind="destructive" label="Delete" onClick={confirmDelete} />
        </ModalActions>
      </Modal>
    </div>
  )
}

/** An artifact deleted this session (a stale link or Back after Delete). */
function DeletedArtifact() {
  useEffect(() => { navigate('/artifacts', { replace: true }) }, [])
  return null
}
