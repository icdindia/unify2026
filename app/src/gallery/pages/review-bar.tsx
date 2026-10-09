import { ReviewBar } from '../../review/ReviewBar'
import { VIEWPORT_PRESETS } from '../../review/viewport'
import { buildUrl, UI_KEY_DOCS, UI_KEYS } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './review-bar.css'

export const meta: GalleryMeta = {
  title: 'Review bar and URL state',
  figmaNodeIds: [],
  group: 'Review harness',
  description:
    'Prototype-only controls (not part of the design): As designed / With fixes, nav mode, the journey stepper in Figma ' +
    'order, a Figma link for every frame the screen reproduces, and viewport presets. Below: the URL keys every screen reads.',
}

const EXAMPLE = buildUrl('/chat/commit', { seed: ['shared-2', 'access-link'], at: 'joined', modal: ['share', 'invite', 'role'], rail: 'c' })

export default function ReviewBarPage() {
  return (
    <>
      <GallerySection
        title="Folding"
        description="The live bar, in rooms of five widths. It folds when the strip is too narrow: first to the switches and the stepper (the Figma links and the viewport presets move into the Review ▾ popover; the project dashboard shows this at 1440), then to the stepper and the Figma links (the switches move too), then to ‹ › Review ▾ (stepping stays one click away), then to Review ▾ alone. The popover always holds every control. This page reproduces no Figma frame, so its bar has no Figma links."
      >
        <Specimens min="lg">
          <Specimen label="Full bar (1200 px room; it scrolls here when the page is narrower)" wide>
            <div className="rb-room rb-room--full"><ReviewBar /></div>
          </Specimen>
          <Specimen label="Folded: switches, stepper, Review ▾ (640 px room)" wide overflow="visible">
            <div className="rb-room rb-room--main"><ReviewBar /></div>
          </Specimen>
          <Specimen label="Folded: stepper, Figma links, Review ▾ (400 px room)" wide overflow="visible">
            <div className="rb-room rb-room--core"><ReviewBar /></div>
          </Specimen>
          <Specimen label="Folded: ‹ › Review ▾ (200 px room)" overflow="visible">
            <div className="rb-room rb-room--steps"><ReviewBar /></div>
          </Specimen>
          <Specimen label="Folded: Review ▾ (96 px room)" overflow="visible">
            <div className="rb-room rb-room--button"><ReviewBar /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection
        title="Stepper"
        description="‹ and › walk every journey's steps in Figma order, across journeys; the picker lists them all, grouped by journey (alias steps say which URL they share; steps that are not screens are listed but disabled). Several steps can share one URL, so the bar remembers the step you chose. “≈” marks the closest frame when no frame matches the URL exactly (a pinned hover, the rail, the nav mode or the width differ)."
      />

      <GallerySection
        title="Viewport presets"
        description={<>Open the current screen in a popup window {VIEWPORT_PRESETS.join(' / ')} px wide (one window per width), with the rail, nav mode and fixes carried over in the URL. The window's own width is underlined; the width Figma draws the frame at carries a dot (an extra preset appears for a frame drawn wider than 1440, such as 1728). Where pop-ups are blocked, the bar says so and shows the URL to open in a window of that width, or resize this one (DevTools device toolbar).</>}
      />

      <GallerySection
        title="URL keys"
        description={<>Every designed state is one URL: <code>#/&lt;path&gt;?&lt;key&gt;=&lt;value&gt;</code>, keys in this order (<code>buildUrl</code>, <code>withUi</code>, <code>canonicalHref</code> write it; <code>useUiParam</code>, <code>useUi</code> read it; all in src/router/uiParams.ts). Example: <code>#{EXAMPLE}</code></>}
      >
        <dl className="rb-keys">
          {UI_KEYS.map(k => (
            <div key={k} className="rb-keys__row">
              <dt><code>{k}</code></dt>
              <dd>{UI_KEY_DOCS[k]}</dd>
            </div>
          ))}
        </dl>
      </GallerySection>
    </>
  )
}
