import { Textarea } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Textarea',
  figmaNodeIds: ['172:61281'],
  group: 'Forms',
  description: 'Textarea input field: Placeholder, Filled, Focused (brand-secondary ring, live), Disabled, Destructive; height from rows.',
}

export default function TextareaGallery() {
  return (
    <GallerySection title="Type=Default">
      <Specimens min="md">
        <Specimen label="State=Placeholder, 2 rows (the set, 56px)" nodeId="172:61282" surface="primary">
          <Textarea label="Description" placeholder="Enter a description..." hint="This is a hint text to help user." />
        </Specimen>
        <Specimen label="Share invite note, 4 rows (96px, 1819:316471)" nodeId="11991:750166" surface="primary">
          <Textarea aria-label="Personalised note" placeholder="Type a personalized invite message..." rows={4} />
        </Specimen>
        <Specimen label="State=Filled" nodeId="178:43911" surface="primary">
          <Textarea label="Why" rows={3} defaultValue="A little about the company and the team that you'll be working with." />
        </Specimen>
        <Specimen label="Destructive=True" nodeId="178:43931" surface="primary">
          <Textarea label="Why" rows={2} defaultValue="Too short" error="Give a reason of at least 20 characters." />
        </Specimen>
        <Specimen label="State=Disabled" nodeId="178:43871" surface="primary">
          <Textarea label="Description" placeholder="Enter a description..." disabled />
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
