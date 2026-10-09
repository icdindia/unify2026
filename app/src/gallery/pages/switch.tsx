import { useState } from 'react'
import { Switch, type SwitchSize } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Switch (Toggle)',
  figmaNodeIds: ['1188:177241', '1188:177120'],
  group: 'Forms',
  description: 'role="switch" with aria-checked; the label is a <label> for it. Assistant Replies uses xxxs; memory uses xs.',
}

const SIZES: { size: SwitchSize; on: string; off: string }[] = [
  { size: 'xxxs', on: '1188:177150', off: '1188:177176' },
  { size: 'xxs', on: '1188:177149', off: '1188:177175' },
  { size: 'xs', on: '1188:177148', off: '1188:177174' },
  { size: 'sm', on: '1188:177135', off: '1188:177157' },
]

type LiveProps = { size: SwitchSize; initial?: boolean; disabled?: boolean; label?: string; hint?: string; labelPosition?: 'left' | 'right' }

function Live({ size, initial = false, disabled = false, label, hint, labelPosition }: LiveProps) {
  const [on, setOn] = useState(initial)
  return (
    <Switch
      size={size} checked={on} onChange={setOn} disabled={disabled} label={label} hint={hint} labelPosition={labelPosition}
      aria-label={label ? undefined : `${size} switch`}
    />
  )
}

export default function SwitchGallery() {
  return (
    <>
      <GallerySection title="Size × Pressed" description="Click, Space or Enter. Hover darkens the track; Tab shows the focus ring.">
        <Specimens min="sm">
          {SIZES.map(s => (
            <Specimen key={`${s.size}-off`} label={`Size=${s.size}, Pressed=False`} nodeId={s.off} surface="primary"><Live size={s.size} /></Specimen>
          ))}
          {SIZES.map(s => (
            <Specimen key={`${s.size}-on`} label={`Size=${s.size}, Pressed=True`} nodeId={s.on} surface="primary"><Live size={s.size} initial /></Specimen>
          ))}
          <Specimen label="xs, Disabled, off" nodeId="1188:177178" surface="primary"><Live size="xs" disabled /></Specimen>
          <Specimen label="xs, Disabled, on" nodeId="1188:177158" surface="primary"><Live size="xs" initial disabled /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="With text" description="Label Position=Left (every use in the file).">
        <Specimens min="md">
          <Specimen label="xxxs, Text=True (collaborative bar)" surface="primary"><Live size="xxxs" label="Assistant Replies" /></Specimen>
          <Specimen label="xs, Text=True" surface="primary"><Live size="xs" initial label="Reference saved memories" /></Specimen>
          <Specimen label="sm, Text=True, Hint" nodeId="1188:177241" surface="primary">
            <Live size="sm" label="Remember me" hint="Save my login details for next time." />
          </Specimen>
          <Specimen label="Label right" surface="primary"><Live size="xs" initial labelPosition="right" label="Label after the track" /></Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
