import { AssistantMark } from '../../components/agent'
import { LogoSpiral } from '../../shell/nav/LogoSpiral'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './agent-gallery.css'

export const meta: GalleryMeta = {
  title: 'Assistant mark',
  figmaNodeIds: ['3506:216405', '3494:215623'],
  group: 'Agent',
  description:
    'EB-Assistant/AI: the 70x70 ring of 54 dots above "Hello Roger" on the landing page (chat-artifact 01-02). Still while ' +
    'the page idles (Q23 default). It is a different artwork from the rail logo (LogoSpiral), shown beside it for comparison.',
}

export default function AssistantMarkGallery() {
  return (
    <GallerySection title="Mark" description="Decorative (aria-hidden): the greeting under it is the heading.">
      <Specimens min="md">
        <Specimen label="EB-Assistant/AI, 70x70 (landing, x 713 y 200 at 1440)" nodeId="3494:215623" surface="primary">
          <span data-diff="mark"><AssistantMark nodeId="3494:215623" /></span>
        </Specimen>
        <Specimen label="Not the same as LogoSpiral: the rail's 32px UnifyApps spiral (Component 2)" nodeId="226:81201" surface="primary">
          <div className="agent-g-row">
            <div className="agent-g-cell">
              <AssistantMark />
              <span className="agent-g-note">EB-Assistant/AI — 54 solid #112d06 dots</span>
            </div>
            <div className="agent-g-cell">
              <span className="agent-g-rail"><LogoSpiral tone="dark" /></span>
              <span className="agent-g-note">LogoSpiral — 22 cream pieces, 25-100% opacity</span>
            </div>
          </div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
