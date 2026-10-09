import { AgentAvatar, type AgentAvatarTone } from '../../components/agent'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './agent-gallery.css'

export const meta: GalleryMeta = {
  title: 'Agent avatar',
  figmaNodeIds: ['5129:473331', '5129:473347'],
  group: 'Agent',
  description:
    'The Assistant\'s 20px avatar in the chat rows: Agent_Avatar Size=xs, Type=Custom resized to a circle, its fill set ' +
    'per state, with the AI Avatar dot grid in white; the streaming dot ring; and the bare animated grid.',
}

const TONES: { tone: AgentAvatarTone; label: string; node: string }[] = [
  { tone: 'thinking', label: 'thinking — #112d06 (bg-brand-solid), a turn is running (chat-artifact 04-07, 14)', node: '5129:473347' },
  { tone: 'done', label: 'done — #364a3b (utility-brand-400), the turn finished (chat-artifact 08)', node: '8863:219519' },
  { tone: 'spinner', label: 'spinner — eight dots tick 45° every 0.5s while the answer streams (input-large 24)', node: '7534:295000' },
  { tone: 'bare', label: 'bare — the animated dot grid GIF (glyph=bare, thinking 01)', node: '8863:218613' },
]

export default function AgentAvatarGallery() {
  return (
    <GallerySection title="Tones" description="Decorative: the row beside the avatar carries the text. Reduced motion holds the ring and swaps the GIF for the still grid.">
      <Specimens min="md">
        {TONES.map(t => (
          <Specimen key={t.tone} label={t.label} nodeId={t.node} surface="primary">
            <div className="agent-g-row">
              <AgentAvatar tone={t.tone} />
              <AgentAvatar tone={t.tone} still />
              <span className="agent-g-note">live · still</span>
            </div>
          </Specimen>
        ))}
      </Specimens>
    </GallerySection>
  )
}
