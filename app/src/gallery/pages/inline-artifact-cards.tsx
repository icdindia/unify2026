import { useState } from 'react'
import { InlineArtifactCard, useArtifactCard, type ArtifactGlyph, type InlineArtifactCardProps } from '../../components/inline-artifact-card'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-surfaces-gallery.css'

export const meta: GalleryMeta = {
  title: 'Inline artifact card',
  figmaNodeIds: ['5288:119600', '15219:419822', '15219:109634', '15219:419811'],
  group: 'Artifacts',
  description:
    'Inline Artifact Cards: the artifact an answer produced. Every type on the 15a sheet (3211:70049) and the newer 16a spec ' +
    '(14876:285160, new PDF mark, 50px sheet, Download bordered at rest). The whole card opens the artifact; Download is its ' +
    'own button. Hover fans a second sheet out and borders Download (16); 15a’s "card hover" keeps it a text button. Split ' +
    'and files-panel rows take a download icon instead.',
  sheets: [
    { id: 'all-types', label: 'Every type (15a)' },
    { id: 'v2', label: 'New PDF mark (16a)' },
  ],
}

type Row = Pick<InlineArtifactCardProps, 'name' | 'meta' | 'glyph' | 'state' | 'hoverDownload'> & { key: string; node: string; label: string }

/** The ten cards of 15a, top to bottom (instances 5288:119601 … 10157:488545). */
const SHEET_15A: Row[] = [
  { key: 'doc', name: 'Pipeline Command', meta: 'Document • DOCX', glyph: 'doc', node: '5288:119601', label: 'State=DOC' },
  { key: 'xls', name: 'Pipeline Command', meta: 'Sheets • XLSX', glyph: 'xls', node: '5288:119602', label: 'State=XLS' },
  { key: 'ppt', name: 'Pipeline Command', meta: 'Presentation • PPTX', glyph: 'ppt', node: '5288:119603', label: 'State=PPT' },
  { key: 'pdf-card', name: 'Pipeline Command', meta: 'Document • PDF', glyph: 'pdf', state: 'hover', hoverDownload: 'text', node: '5288:119604', label: 'State=PDF, card hover' },
  { key: 'pdf-button', name: 'Pipeline Command', meta: 'Document • PDF', glyph: 'pdf', state: 'button-hover', hoverDownload: 'text', node: '6279:114623', label: 'State=PDF, button hover' },
  { key: 'md', name: 'Pipeline Command', meta: 'Document • MD', glyph: 'md', node: '5288:119605', label: 'State=Markdown' },
  { key: 'html', name: 'Pipeline Command', meta: 'Interactive HTML', glyph: 'html', node: '5288:119606', label: 'State=Application-HTML' },
  { key: 'csv', name: 'Pipeline Command', meta: 'Table • CSV', glyph: 'csv', node: '6190:143209', label: 'Table CSV' },
  { key: 'flow', name: 'Connector App', meta: 'Flow Diagram', glyph: 'flow', node: '8589:239203', label: 'Flow Diagram' },
  { key: 'json', name: 'JSON', meta: 'Document • JSON', glyph: 'json', node: '10157:488545', label: 'JSON' },
]

const GLYPH_ROWS: { glyph: ArtifactGlyph; meta: string }[] = [
  { glyph: 'html-window', meta: 'Interactive HTML • 123 KB • Version 1' },
  { glyph: 'doc', meta: 'Document • DOCX • V3' },
  { glyph: 'pdf-v2', meta: 'Document • PDF' },
]

function useLog() {
  const [last, setLast] = useState('none')
  return { last, log: (what: string) => () => setLast(what) }
}

function Sheet15a() {
  const { last, log } = useLog()
  return (
    <>
      <GallerySection
        title="15a — every type"
        description="Pinned as the sheet draws them: the 4th card in card hover (Download stays a text button, as 15a draws it), the 5th in button hover. Hover any card for the live state."
      >
        <Specimens min="lg">
          <Specimen label={`Inline Artifact Cards, 520 wide, 8 apart (3211:70049) — last action: ${last}`} nodeId="3211:70049" surface="primary" wide>
            <div className="iacg-stack" data-gallery-sheet="15a">
              {SHEET_15A.map(r => (
                <InlineArtifactCard
                  key={r.key} name={r.name} meta={r.meta} glyph={r.glyph} state={r.state} hoverDownload={r.hoverDownload}
                  nodeId={r.node} onOpen={log(`open ${r.label}`)} onDownload={log(`download ${r.label}`)}
                />
              ))}
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
      <JourneyCards />
      <GallerySection title="Variants" description="chat (520 max, Download text button) · split (fills the 408 chat column of the split, 20) · panel (files panel rows, 358, 17).">
        <Specimens min="lg">
          <Specimen label="variant=chat, default / hover / button-hover" surface="primary" wide>
            <div className="iacg-stack">
              <InlineArtifactCard name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="html-window" />
              <InlineArtifactCard name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="html-window" state="hover" />
              <InlineArtifactCard name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="html-window" state="button-hover" />
            </div>
          </Specimen>
          <Specimen label="variant=split, 408 (1809:488480)" nodeId="1809:488480" surface="primary">
            <div className="iacg-split">
              <InlineArtifactCard variant="split" name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="doc" />
              <InlineArtifactCard variant="split" name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="html-window" state="hover" />
            </div>
          </Specimen>
          <Specimen label="variant=panel, 358 (5975:413714): default / hover" nodeId="15219:419824" surface="primary">
            <div className="iacg-panel">
              {GLYPH_ROWS.slice(0, 2).map(r => <InlineArtifactCard key={r.glyph} variant="panel" name="Pipeline Command" meta={r.meta} glyph={r.glyph} />)}
              <InlineArtifactCard variant="panel" name="Pipeline Command" meta="Document • PDF • V1" glyph="pdf" state="hover" />
            </div>
          </Specimen>
          <Specimen label="Long name: one line, ellipsis, full name in the title" surface="primary">
            <div className="iacg-split">
              <InlineArtifactCard variant="split" name="Q3 2026 Revenue Forecast & Budget Reconciliation — Meridian" meta="Document • DOCX • 123 KB • Version 3" glyph="doc" />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}

/** The commit chat's card as each journey frame draws it (useArtifactCard: drift resolves with the review bar's switch). */
function JourneyCards() {
  const step15 = useArtifactCard('pipeline-command', { glyph: 'html', meta: 'Interactive HTML' })
  const step16 = useArtifactCard('pipeline-command')
  const step20 = useArtifactCard('pipeline-command', { glyph: 'doc' })
  return (
    <GallerySection title="In the journey" description="useArtifactCard('pipeline-command', drawn): As designed reproduces each frame; With fixes, one mark and the full meta line.">
      <Specimens min="lg">
        <Specimen label="15 — at rest (1768:356654)" nodeId="1768:356654" surface="primary" wide>
          <div className="iacg-stack"><InlineArtifactCard {...step15} /></div>
        </Specimen>
        <Specimen label="16 — card hover (1809:363799)" nodeId="1809:363799" surface="primary" wide>
          <div className="iacg-stack"><InlineArtifactCard {...step16} state="hover" /></div>
        </Specimen>
        <Specimen label="20 — split column (1809:488480)" nodeId="1809:488480" surface="primary" wide>
          <div className="iacg-split"><InlineArtifactCard variant="split" {...step20} /></div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

function SheetV2() {
  const { last, log } = useLog()
  return (
    <GallerySection
      title="16a — new PDF mark"
      description="generation=v2: 50px sheet, the newer PDF mark (Artifact Icon / Type=PDFs 15193:1281891) and Download bordered at rest. Top: default; bottom: card hover."
    >
      <Specimens min="lg">
        <Specimen label={`generation=v2 (14876:285160) — last action: ${last}`} nodeId="14876:285160" surface="primary" wide>
          <div className="iacg-stack" data-gallery-sheet="16a">
            <InlineArtifactCard generation="v2" name="Pipeline Command" meta="Document • PDF" glyph="pdf-v2" onOpen={log('open')} onDownload={log('download')} />
            <InlineArtifactCard generation="v2" name="Pipeline Command" meta="Document • PDF" glyph="pdf-v2" state="hover" onOpen={log('open')} onDownload={log('download')} />
          </div>
        </Specimen>
        <Specimen label="generation=v2, other types (centred in the 50px sheet)" surface="primary" wide>
          <div className="iacg-stack">
            <InlineArtifactCard generation="v2" name="Pipeline Command" meta="Interactive HTML • 123 KB • Version 1" glyph="html-window" />
            <InlineArtifactCard generation="v2" name="Pipeline Command" meta="Sheets • XLSX" glyph="xls" />
          </div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

export default function InlineArtifactCardsGallery() {
  const [sheet] = useUiParam('sheet')
  return sheet === 'v2' ? <SheetV2 /> : <Sheet15a />
}
