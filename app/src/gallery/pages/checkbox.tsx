import { useState } from 'react'
import { Checkbox } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Checkbox',
  figmaNodeIds: ['321:86462', '80:43599'],
  group: 'Forms',
  description: 'A native checkbox under the drawn box: Space toggles, the label clicks through, indeterminate reads "mixed".',
}

export default function CheckboxGallery() {
  const [notify, setNotify] = useState(false)
  const [items, setItems] = useState([true, false, true])
  const all = items.every(Boolean)
  const some = !all && items.some(Boolean)
  return (
    <>
      <GallerySection title="Size × Checked" description="Hover and focus are live: point at or Tab to any specimen.">
        <Specimens min="sm">
          <Specimen label="sm, Checked=False" nodeId="80:43600" surface="primary"><Checkbox aria-label="Unchecked sm" /></Specimen>
          <Specimen label="sm, Checked=True" nodeId="80:43616" surface="primary"><Checkbox aria-label="Checked sm" defaultChecked /></Specimen>
          <Specimen label="sm, Indeterminate=True" nodeId="80:43618" surface="primary"><Checkbox aria-label="Mixed sm" indeterminate /></Specimen>
          <Specimen label="sm, Disabled" nodeId="80:43604" surface="primary"><Checkbox aria-label="Disabled sm" disabled /></Specimen>
          <Specimen label="sm, Checked, Disabled" nodeId="80:43622" surface="primary"><Checkbox aria-label="Checked disabled sm" disabled defaultChecked /></Specimen>
          <Specimen label="xs, Checked=False" nodeId="80:43601" surface="primary"><Checkbox size="xs" aria-label="Unchecked xs" /></Specimen>
          <Specimen label="xs, Checked=True" nodeId="80:43617" surface="primary"><Checkbox size="xs" aria-label="Checked xs" defaultChecked /></Specimen>
          <Specimen label="xs, Indeterminate=True" nodeId="80:43619" surface="primary"><Checkbox size="xs" aria-label="Mixed xs" indeterminate /></Specimen>
          <Specimen label="xs, Disabled" nodeId="80:43605" surface="primary"><Checkbox size="xs" aria-label="Disabled xs" disabled /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="With text">
        <Specimens min="md">
          <Specimen label="sm, Text=True (share invite 1819:316471)" nodeId="11991:750165" surface="primary">
            <Checkbox label="Notify people" checked={notify} onChange={e => setNotify(e.target.checked)} />
          </Specimen>
          <Specimen label="sm, Text=True, Hint Text=True" nodeId="321:86535" surface="primary">
            <Checkbox label="Remember me" hint="Save my login details for next time." />
          </Specimen>
          <Specimen label="xs, Text=True" nodeId="321:86538" surface="primary"><Checkbox size="xs" label="Send to Agent" /></Specimen>
          <Specimen label="Parent + children (indeterminate follows)" surface="primary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Checkbox label="All files" checked={all} indeterminate={some} onChange={e => setItems(items.map(() => e.target.checked))} />
              {items.map((on, i) => (
                <span key={i} style={{ paddingLeft: 'var(--spacing-3xl)' }}>
                  <Checkbox size="xs" label={`File ${i + 1}`} checked={on} onChange={e => setItems(items.map((v, j) => (j === i ? e.target.checked : v)))} />
                </span>
              ))}
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
