import { InputField, formIcons, type InputFieldSize } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Input field',
  figmaNodeIds: ['1407:188084'],
  group: 'Forms',
  description: 'Input field_outline: four sizes, icon leading, label and hint; Focused, Disabled and Destructive are live states.',
}

const SIZES: { size: InputFieldSize; h: number }[] = [{ size: 'lg', h: 36 }, { size: 'md', h: 32 }, { size: 'sm', h: 28 }, { size: 'xs', h: 24 }]

export default function InputFieldGallery() {
  return (
    <>
      <GallerySection title="Size" description="Type=Default, State=Placeholder. Click into a field for the Focused ring.">
        <Specimens min="md">
          {SIZES.map(s => (
            <Specimen key={s.size} label={`Size=${s.size} (${s.h}px)`} surface="primary">
              <InputField size={s.size} aria-label={`${s.size} field`} placeholder="olivia@untitledui.com" />
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>
      <GallerySection title="Type and state">
        <Specimens min="md">
          <Specimen label="lg, Icon leading, Filled, with label (usage request 6802:236151)" nodeId="1407:188105" surface="primary">
            <InputField label="How much more" icon={<formIcons.Dollar16 />} defaultValue="100" inputMode="decimal" />
          </Specimen>
          <Specimen label="lg, Icon leading, Placeholder" surface="primary">
            <InputField aria-label="Amount" icon={<formIcons.Dollar16 />} placeholder="Amount" />
          </Specimen>
          <Specimen label="lg, with hint" surface="primary">
            <InputField label="Email" placeholder="olivia@untitledui.com" hint="This is a hint text to help user." />
          </Specimen>
          <Specimen label="lg, Destructive=True, Filled" surface="primary">
            <InputField label="Email" defaultValue="olivia@untitled" error="Enter a full email address." />
          </Specimen>
          <Specimen label="lg, State=Disabled" surface="primary">
            <InputField label="Email" defaultValue="olivia@untitledui.com" disabled />
          </Specimen>
          <Specimen label="lg, State=Read Only" surface="primary">
            <InputField label="Link" defaultValue="https://unify.app/a/pipeline-command" readOnly />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
