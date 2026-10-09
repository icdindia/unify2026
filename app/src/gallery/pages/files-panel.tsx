import { useState } from 'react'
import {
  FilesButton, FilesPanel, FilesPanelPopover, useFilesPanelData, type FilesPanelView,
} from '../../components/files-panel'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-surfaces-gallery.css'

export const meta: GalleryMeta = {
  title: 'Files panel',
  figmaNodeIds: ['14604:278262', '14607:405457', '13722:383349', '5975:413709'],
  group: 'Artifacts',
  description:
    'The chat’s artifacts and uploaded files: "Artifacts 3" + Download All (each row opens the artifact), "Files 8" as a ' +
    'list (download on hover) or a 2-column grid of tiles. A 384 x 720 card that scrolls inside: docked beside the chat ' +
    '(17, 18) or dropped from the header’s files button over the split (19). The files button carries the count badge (16).',
}

/** A docked panel with its own view state, as 17 (list) / 18 (grid). */
function Docked({ initial, hoverFile }: { initial: FilesPanelView; hoverFile?: string }) {
  const [view, setView] = useState<FilesPanelView>(initial)
  const [last, setLast] = useState('none')
  const data = useFilesPanelData(view)
  return (
    <div className="iacg-dock">
      <div>
        <FilesPanel
          {...data} view={view} onViewChange={setView} hoverFile={hoverFile}
          onOpenArtifact={r => setLast(`open ${r.name} (${r.meta})`)} onDownloadArtifact={r => setLast(`download ${r.name}`)}
          onDownloadAll={() => setLast('download all')} onDownloadFile={f => setLast(`download ${f.name}`)}
        />
        <p className="iacg-note">Last action: {last}</p>
      </div>
    </div>
  )
}

/** The split's dropdown (19): the files button opens the panel under it. */
function Dropdown() {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const [view, setView] = useState<FilesPanelView>('list')
  const data = useFilesPanelData(view)
  return (
    <div className="iacg-hdr">
      <FilesButton
        ref={setAnchor} open={open} aria-controls="gallery-files-dropdown"
        onClick={e => { setKeyboard(e.detail === 0); setOpen(o => !o) }}
      />
      <FilesPanelPopover
        id="gallery-files-dropdown" open={open} anchor={anchor} autoFocus={keyboard}
        onClose={() => setOpen(false)} {...data} view={view} onViewChange={setView}
      />
    </div>
  )
}

export default function FilesPanelGallery() {
  return (
    <>
      <GallerySection title="In the chat" description="Docked: the 400px column beside the chat (card at 8, 8). Toggle list / grid; hover a file for its download button.">
        <Specimens min="lg">
          <Specimen label="17 — list, Screenshot row hovered (5975:413714)" nodeId="5975:413714" surface="workspace">
            <Docked initial="list" hoverFile="f-screenshot" />
          </Specimen>
          <Specimen label="18 — grid, JSON tile hovered (14607:403125)" nodeId="14607:403125" surface="workspace">
            <Docked initial="grid" hoverFile="f-json" />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Files button" description="The chat header’s clipboard button: the count badge of 16, and the pressed look while the panel is open (17, 19).">
        <Specimens min="sm">
          <Specimen label="Default" nodeId="11932:738077" surface="workspace"><FilesButton /></Specimen>
          <Specimen label="Badge 2 (1809:363799)" nodeId="5975:413709" surface="workspace"><FilesButton count={2} /></Specimen>
          <Specimen label="Hover" surface="workspace"><FilesButton hover /></Specimen>
          <Specimen label="Open (5975:413714)" nodeId="11932:738091" surface="workspace"><FilesButton open /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Over the split" description="19 (13722:383349): the panel drops from the files button at a fixed 720, 8 below it, right edges aligned. Escape, a press outside or Tab past it closes it.">
        <Specimens min="lg">
          <Specimen label="Files button + FilesPanelPopover" nodeId="13722:383349" surface="workspace" overflow="visible" wide>
            <Dropdown />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
