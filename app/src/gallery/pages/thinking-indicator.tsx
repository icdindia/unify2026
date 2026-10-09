import { ThinkingIndicator } from '../../components/agent'
import { COT_LABELS } from '../../fixtures'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './agent-gallery.css'

export const meta: GalleryMeta = {
  title: 'Thinking indicator',
  figmaNodeIds: ['484:117565', '3518:217899', '7534:291688'],
  group: 'Agent',
  description:
    'The row under a message while the Assistant works: its avatar, 8px, then "Thinking..." (Text sm/Regular, #737373) ' +
    'with a light band sweeping across it every 0.8s (thinking state, Q24 default). It is a live region; reduced motion ' +
    'and at= renders hold the band off the text.',
}

export default function ThinkingIndicatorGallery() {
  return (
    <>
      <GallerySection title="Labels" description="Agent COT / Type=Step 1 and Step 2. The round avatar is the Q24 default. The thread places the row; measured from the bubble's bottom edge: 18px in thinking 02, 30px in input-large 14, 40px under Matt's in chat-artifact 14, 80px in chat-artifact 04-08.">
        <Specimens min="lg">
          <Specimen label="Step 1 — Thinking... (animated)" nodeId="8863:218608" surface="primary">
            <ThinkingIndicator />
          </Specimen>
          <Specimen label="Step 2 — Consulting the knowledge repository... (animated)" nodeId="8863:218615" surface="primary">
            <ThinkingIndicator label={COT_LABELS.consulting} />
          </Specimen>
          <Specimen label="still (an at= render): the band rests off the text" nodeId="484:117564" surface="primary">
            <ThinkingIndicator still />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Glyph" description="glyph=bare (thinking 01): the Agent COT set's own 84px GIF of the dot grid, no circle, 28px at -4,-4.">
        <Specimens min="lg">
          <Specimen label="glyph=round (Q24 default, thinking 02)" nodeId="10139:466731" surface="primary">
            <ThinkingIndicator />
          </Specimen>
          <Specimen label="glyph=bare (thinking 01)" nodeId="8863:220940" surface="primary">
            <ThinkingIndicator glyph="bare" />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
