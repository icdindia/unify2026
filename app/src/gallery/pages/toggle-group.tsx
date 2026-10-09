import { useState } from 'react'
import { ToggleGroup, formIcons } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Toggle group (icon only)',
  figmaNodeIds: ['94:113940', '94:113093'],
  group: 'Forms',
  description: 'A radio group: one Tab stop, arrow keys move and choose. Artifact header preview / code; files panel list / grid.',
}

export default function ToggleGroupGallery() {
  const [mode, setMode] = useState<'preview' | 'code'>('preview')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [three, setThree] = useState<'a' | 'b' | 'c'>('b')
  return (
    <GallerySection title="Type=Default, Style=Icon only, Size=xs">
      <Specimens min="sm">
        <Specimen label={`Preview / code (${mode})`} nodeId="13722:383356" surface="primary">
          <ToggleGroup aria-label="Artifact view" value={mode} onChange={setMode} options={[
            { value: 'preview', label: 'Preview', icon: <formIcons.Eye14 /> },
            { value: 'code', label: 'Code', icon: <formIcons.Code14 /> },
          ]} />
        </Specimen>
        <Specimen label={`List / grid (${view})`} nodeId="14607:405531" surface="primary">
          <ToggleGroup aria-label="Files view" value={view} onChange={setView} options={[
            { value: 'list', label: 'List', icon: <formIcons.List14 /> },
            { value: 'grid', label: 'Grid', icon: <formIcons.Grid14 /> },
          ]} />
        </Specimen>
        <Specimen label="Three segments, last disabled" surface="primary">
          <ToggleGroup aria-label="Three" value={three} onChange={setThree} options={[
            { value: 'a', label: 'List', icon: <formIcons.List14 /> },
            { value: 'b', label: 'Grid', icon: <formIcons.Grid14 /> },
            { value: 'c', label: 'Code', icon: <formIcons.Code14 />, disabled: true },
          ]} />
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
