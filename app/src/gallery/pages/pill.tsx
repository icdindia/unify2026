import { CodePill, Dot, Pill, PillSquared } from '../../components/pill'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Pill, Code Pill, Dot',
  figmaNodeIds: ['1421:317764', '9806:508154', '19:19293', '13750:263005', '3:1104', '5220:198528'],
  group: 'Badges',
  description: 'Count chips, role and status badges, the mono code pill and the unread dot.',
}

const row = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' } as const

export default function PillGallery() {
  return (
    <>
      <GallerySection title="Pill solid" description="Size=xxs, Type=Pill color, Color=Gray: the queue count and header badges.">
        <Specimens min="sm">
          <Specimen label="1" nodeId="1421:317874" surface="primary"><Pill aria-label="1 queued message">1</Pill></Specimen>
          <Specimen label="4 (Queue 4)" surface="primary"><span style={row}>Queue <Pill aria-label="4 queued messages">4</Pill></span></Specimen>
          <Specimen label="21" surface="primary"><Pill>21</Pill></Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Pill squared">
        <Specimens min="md">
          <Specimen label="xxs, Pill Clear, Gray, mono (access list role)" nodeId="9806:508414" surface="primary">
            <span style={row}><PillSquared type="clear" mono>Owner</PillSquared><PillSquared type="clear" mono>Editor</PillSquared><PillSquared type="clear" mono>Viewer</PillSquared></span>
          </Specimen>
          <Specimen label="xxs, Pill color, Success (memory &quot;New&quot;)" nodeId="9806:508405" surface="primary"><PillSquared colour="success">New</PillSquared></Specimen>
          <Specimen label="xs, Pill color, Gray (dropdown item badge)" surface="primary"><PillSquared size="xs">Label</PillSquared></Specimen>
          <Specimen label="sm, Pill Clear, Gray" nodeId="20:11323" surface="primary"><PillSquared size="sm" type="clear">Label</PillSquared></Specimen>
          <Specimen label="sm, Pill Clear, Icon=Dot, Success" nodeId="5220:200567" surface="primary"><PillSquared size="sm" type="clear" dot="success">Label</PillSquared></Specimen>
          <Specimen label="sm, Pill color, Gray" surface="primary"><PillSquared size="sm">Label</PillSquared></Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Code Pill" description="Color=Gray, JetBrains Mono 11/12.">
        <Specimens min="sm">
          <Specimen label="Size=xs" nodeId="13750:263016" surface="primary"><CodePill>Label</CodePill></Specimen>
          <Specimen label="As drawn in the files panel (16px)" nodeId="14612:410640" surface="primary"><span style={row}>Artifacts <CodePill size="xxs">3</CodePill></span></Specimen>
          <Specimen label="File type" surface="primary"><span style={row}><CodePill>XLS</CodePill><CodePill>PDF</CodePill><CodePill>HTML</CodePill></span></Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Dot" description="Outline=False. md is the comments unread dot; sm sits inside Pill squared Icon=Dot.">
        <Specimens min="sm">
          <Specimen label="Size=md, Colour=Brand" nodeId="3:1123" surface="primary"><span style={row}><Dot label="Unread" /> 1 reply</span></Specimen>
          <Specimen label="Size=sm, Colour=Success" nodeId="5220:198537" surface="primary"><Dot size="sm" colour="success" /></Specimen>
          <Specimen label="md: success, error, warning, gray" surface="primary">
            <span style={row}><Dot colour="success" /><Dot colour="error" /><Dot colour="warning" /><Dot colour="gray" /></span>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
