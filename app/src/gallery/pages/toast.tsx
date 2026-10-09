import { useState } from 'react'
import { ModalButton, Toast, ToastProvider, useToast } from '../../components/overlays'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './overlays-gallery.css'

export const meta: GalleryMeta = {
  title: 'Toast',
  figmaNodeIds: [],
  group: 'Overlays',
  description:
    'Not drawn in Figma: the gaps the plan fills with toasts (Q35 invite, Q37 remove access, Q44 clear queue, Q57 delete, ' +
    'Q59 clone, Q60 publish). Built on the Tooltip\'s dark surface. In the app it is fix "toast-feedback": toasts show only ' +
    'with "With fixes" on; on this page they always show. Bottom centre, newest last, at most three; paused while hovered ' +
    'or focused; Escape inside one dismisses it.',
}

const noop = () => {}

export default function ToastGallery() {
  return (
    <ToastProvider gated={false}>
      <GallerySection title="Variants">
        <Specimens min="md">
          <Specimen label="Message" surface="primary">
            <Toast message="Link copied" />
          </Specimen>
          <Specimen label="With Undo" surface="primary">
            <Toast message="Q3 Forecast deleted" action={{ label: 'Undo', onClick: noop }} onDismiss={noop} />
          </Specimen>
          <Specimen label="With close" surface="primary">
            <Toast message="Invited Olivia and Phoenix as Commenters" onDismiss={noop} />
          </Specimen>
          <Specimen label="With Open (clone)" surface="primary">
            <Toast message="Q3 Forecast (copy) created" action={{ label: 'Open', onClick: noop }} onDismiss={noop} />
          </Specimen>
          <Specimen label="Error" surface="primary">
            <Toast tone="error" message="Couldn't publish. Check your connection and try again." onDismiss={noop} />
          </Specimen>
          <Specimen label="Wrapping at narrow widths" surface="primary">
            <div className="ovg-narrow">
              <Toast message="Candice Wu no longer has access to Pipeline Command" action={{ label: 'Undo', onClick: noop }} onDismiss={noop} />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Live" description="Each button raises a real toast from useToast().">
        <LiveButtons />
      </GallerySection>
    </ToastProvider>
  )
}

function LiveButtons() {
  const toast = useToast()
  const [members, setMembers] = useState(3)
  return (
    <div className="ovg-live">
      <ModalButton kind="secondary" label="Copy link" onClick={() => toast.show({ message: 'Link copied' })} />
      <ModalButton
        kind="secondary" label={`Remove access (${members} with access)`} disabled={members === 0}
        onClick={() => {
          setMembers(m => m - 1)
          toast.show({ id: 'remove', message: 'Access removed', action: { label: 'Undo', onClick: () => setMembers(m => m + 1) } })
        }}
      />
      <ModalButton kind="secondary" label="Error" onClick={() => toast.show({ tone: 'error', message: "Couldn't publish. Try again." })} />
      <ModalButton kind="secondary" label="Sticky (until closed)" onClick={() => toast.show({ message: 'Request sent to your workspace admin', duration: Infinity })} />
      <ModalButton kind="tertiary" label="Clear all" onClick={() => toast.clear()} />
    </div>
  )
}
