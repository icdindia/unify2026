import { useState } from 'react'
import { BrandButton, IconButton, buttonIcons } from '../../components/buttons'
import { Tooltip, TooltipBubble, overlayIcons, type TooltipArrow } from '../../components/overlays'
import microphone from '../../assets/chrome/microphone.svg'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './overlays-gallery.css'

export const meta: GalleryMeta = {
  title: 'Tooltip',
  figmaNodeIds: ['9860:712340', '10247:284177', '3780:177208', '7418:306089'],
  group: 'Overlays',
  description:
    'Tooltip / Supporting text=False in every arrow position, with the optional leading icon and shortcut chip. Live: opens ' +
    'after 400ms of hover (at once when moving from one tooltip to the next), at once on keyboard focus; Escape closes it; ' +
    'it flips to the other side and slides along the edge when the viewport is too small.',
}

const ARROWS: { arrow: TooltipArrow; label: string; node: string }[] = [
  { arrow: 'bottom-center', label: 'Arrow=Bottom center', node: '9860:712342' },
  { arrow: 'top-center', label: 'Arrow=Top center', node: '9860:712344' },
  { arrow: 'top-left', label: 'Arrow=Top left', node: '9860:712346' },
  { arrow: 'none', label: 'Arrow=None', node: '9860:712343' },
  { arrow: 'top-right', label: 'Arrow=Top right', node: '9860:712345' },
  { arrow: 'bottom-left', label: 'Arrow=Bottom left', node: '9860:712347' },
  { arrow: 'bottom-right', label: 'Arrow=Bottom right', node: '9860:712350' },
  { arrow: 'left', label: 'Arrow=Left', node: '9860:712348' },
  { arrow: 'right', label: 'Arrow=Right', node: '9860:712349' },
]

export default function TooltipGallery() {
  const [pinned, setPinned] = useState(true)
  return (
    <>
      <GallerySection title="Arrow" description="Set 9860:712340, Supporting text=False. Bottom center, Top center, Top left and None are the ones the journeys use.">
        <Specimens min="sm">
          {ARROWS.map(({ arrow, label, node }) => (
            <Specimen key={arrow} label={label} nodeId={node} surface="primary">
              <TooltipBubble text="Enhance with AI" arrow={arrow} />
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>

      <GallerySection title="Content" description="The instances in the journeys, and the hidden parts of the component switched on.">
        <Specimens min="md">
          <Specimen label="Enhance with AI (enhance-prompt 03)" nodeId="10247:284177" surface="primary">
            <TooltipBubble text="Enhance with AI" arrow="bottom-center" />
          </Specimen>
          <Specimen label="Icon=True: Co-create with an Agent (artifacts-landing 05)" nodeId="3780:177208" surface="primary">
            <TooltipBubble text="Co-create with an Agent" icon={overlayIcons.stars02} arrow="bottom-center" />
          </Specimen>
          <Specimen label="Shortcuts=True: ⌘ ⇧ C chip" nodeId="3780:177208" surface="primary">
            <TooltipBubble text="Co-create with an Agent" icon={overlayIcons.stars02} shortcut="⌘ ⇧ C" arrow="bottom-center" />
          </Specimen>
          <Specimen label="Top left, wrapping: the full artifact name (artifact-view-editor-main 03)" nodeId="7418:306089" surface="primary">
            <TooltipBubble text="all header icons for reference all header icons for reference chmbXcbmXMBZC mxsbz cmbX .xls" arrow="top-left" />
          </Specimen>
          <Specimen label="Stop generating (queue-1)" surface="primary">
            <TooltipBubble text="Stop generating" arrow="bottom-center" />
          </Specimen>
          <Specimen label="Add message to queue ↵ (queue-1)" surface="primary">
            <TooltipBubble text="Add message to queue" shortcut="↵" arrow="bottom-center" />
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection
        title="Live"
        description="Hover or Tab onto the controls. Scroll the edges stage up to the top of the window and hover Top left: the bubble flips below its trigger. Bottom right sits by the right edge: the bubble slides left to stay 8px inside and keeps its arrow on the trigger."
      >
        <Specimens min="md">
          <Specimen label="Icon button, Arrow=Bottom center" surface="primary" overflow="visible">
            <Tooltip text="Enhance with AI" arrow="bottom-center">
              <IconButton size="md" round icon={overlayIcons.stars02} aria-label="Enhance with AI" />
            </Tooltip>
          </Specimen>
          <Specimen label="Button with icon + shortcut chip" surface="primary" overflow="visible">
            <Tooltip text="Co-create with an Agent" icon={overlayIcons.stars02} shortcut="⌘ ⇧ C" arrow="bottom-center">
              <BrandButton size="md" icon={buttonIcons.plusWhite14} label="New Artifact" />
            </Tooltip>
          </Specimen>
          <Specimen label="Arrow=Top left under a truncated name" surface="primary" overflow="visible">
            <Tooltip text="all header icons for reference all header icons for reference chmbXcbmXMBZC mxsbz cmbX .xls" arrow="top-left">
              <button type="button" className="ovg-choice ovg-trunc">all header icons for reference all header…</button>
            </Tooltip>
          </Specimen>
          <Specimen label="Arrow=Right (beside the trigger)" surface="primary" overflow="visible">
            <Tooltip text="Voice" arrow="right" side="left">
              <IconButton size="md" icon={microphone} aria-label="Voice input" />
            </Tooltip>
          </Specimen>
          <Specimen label="Pinned open (review state hover=…)" surface="primary" overflow="visible">
            <div className="ovg-row">
              <Tooltip text="Stop generating" arrow="bottom-center" open={pinned}>
                <IconButton size="md" round icon={overlayIcons.closeLg} aria-label="Stop generating" />
              </Tooltip>
              <button type="button" className="ovg-choice" aria-pressed={pinned} onClick={() => setPinned(p => !p)}>
                {pinned ? 'Unpin' : 'Pin'}
              </button>
            </div>
          </Specimen>
          <Specimen label="Edges: flips and slides" surface="primary">
            <div className="ovg-edges">
              <Tooltip text="Flips below near the top of the window" arrow="bottom-center">
                <button type="button" className="ovg-choice ovg-edges__tl">Top left</button>
              </Tooltip>
              <Tooltip text="Slides left at the right edge of the window" arrow="bottom-center">
                <button type="button" className="ovg-choice ovg-edges__br">Bottom right</button>
              </Tooltip>
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
