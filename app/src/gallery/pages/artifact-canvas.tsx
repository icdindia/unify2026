import { ArtifactCanvas, AcmeDashboard, ACME_WIDTH } from '../../components/artifact-canvas'
import { ArtifactPanel } from '../../components/split-view'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-panel.css'

export const meta: GalleryMeta = {
  title: 'Artifact canvas',
  figmaNodeIds: ['1809:488587', '1809:488589', '1809:488590'],
  group: 'Artifacts',
  description:
    'The artifact body: a scroll area holding the page frame. The Acme Inc. dashboard (a flat image in Figma) is real ' +
    'HTML at its own 1122px: as designed it is zoomed to the panel the way Figma scales the image (0.80 in the 440 split); ' +
    'with fix artifact-canvas-reflow it reflows instead. Its tabs, 3M / 6M / 12M ranges and pager work.',
  sheets: [
    { id: 'default', label: 'In the panel' },
    { id: 'dashboard', label: 'Dashboard at 1:1' },
  ],
}

function Panel({ w, h, full, view, kind = 'acme-dashboard', name = 'Untitled.xls' }: {
  w: number; h: number; full?: boolean; view?: 'preview' | 'code'; kind?: 'acme-dashboard' | 'doc'; name?: string
}) {
  return (
    <div className="apg-frame" style={{ width: w, maxWidth: '100%', height: h, padding: full ? 0 : 'var(--spacing-md)' }}>
      <ArtifactPanel label={name} full={full} header={null}>
        <ArtifactCanvas kind={kind} view={view} name={name} full={full} />
      </ArtifactPanel>
    </div>
  )
}

export default function ArtifactCanvasGallery() {
  const [sheet] = useUiParam('sheet')
  if (sheet === 'dashboard') {
    return (
      <GallerySection title={`Acme dashboard, ${ACME_WIDTH}px`} description="1:1 with the image's content (x 14-1136 of the 1136 × 4096 export).">
        <Specimens>
          <Specimen wide label="image 19 (1809:488590)" nodeId="1809:488590">
            <div className="apg-frame" data-specimen="acme-1to1" style={{ width: ACME_WIDTH, background: 'var(--colors-utility-warm-blue-utility-warm-blue-25)' }}>
              <AcmeDashboard />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    )
  }
  return (
    <>
      <GallerySection title="In the panel">
        <Specimens>
          <Specimen wide label="Split beside a 440 chat: 927 card, page zoomed to 0.80 (20)" nodeId="1809:488589">
            <Panel w={943} h={640} />
          </Specimen>
          <Specimen wide label="Expanded: centred at 100% (22)" nodeId="1809:488587">
            <Panel w={1168} h={640} full />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Other views">
        <Specimens>
          <Specimen label="Code (the preview / code toggle)"><Panel w={560} h={420} view="code" /></Specimen>
          <Specimen label="Blank kinds get a short sample page"><Panel w={560} h={420} kind="doc" name="Untitled.doc" /></Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
