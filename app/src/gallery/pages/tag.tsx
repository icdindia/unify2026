import { useState } from 'react'
import { Tag } from '../../components/pill'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Tag',
  figmaNodeIds: ['166:43302', '89:89890'],
  group: 'Badges',
  description: 'Chips with an optional 16px avatar and an X close button: the invite field\'s people and addresses.',
}

export default function TagGallery() {
  const [removed, setRemoved] = useState<string[]>([])
  const remove = (l: string) => setRemoved(r => [...r, l])
  const row = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' } as const
  return (
    <GallerySection title="Variants" description="Remove buttons are real buttons named &quot;Remove <label>&quot;.">
      <Specimens min="md">
        <Specimen label="sm, Icon=Avatar, X close, Type=Solid" nodeId="11991:750617" surface="primary">
          <Tag label="olivia@untitled.com" avatar={{ name: 'olivia@untitled.com' }} onRemove={() => remove('olivia')} />
        </Specimen>
        <Specimen label="sm, Icon=Avatar, X close, Type=Outline" nodeId="11991:750619" surface="primary">
          <Tag label="Natali" type="outline" avatar={{ name: 'Natali' }} onRemove={() => remove('natali')} />
        </Specimen>
        <Specimen label="xs, X close, Type=Outline" nodeId="89:89891" surface="primary">
          <Tag label="Label" size="xs" onRemove={() => remove('label')} />
        </Specimen>
        <Specimen label="sm, Solid, no avatar, no close" surface="primary"><Tag label="Phoenix" /></Specimen>
        <Specimen label="Long label truncates in a narrow container" surface="primary">
          <span style={{ ...row, width: 160 }}><Tag label="aman.baldha@partner.unifyapps.com" avatar={{ name: 'Aman' }} onRemove={() => remove('aman')} /></span>
        </Specimen>
        <Specimen label={`Removed: ${removed.length ? removed.join(', ') : 'none'}`} surface="primary">
          <span style={row}>Press a tag's × to log it here</span>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
