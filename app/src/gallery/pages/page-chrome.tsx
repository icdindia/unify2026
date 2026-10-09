import { useState } from 'react'
import { Breadcrumb, PageHeader, SecondaryButton } from '../../components'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Breadcrumb and page header',
  figmaNodeIds: ['5865:366539', '14045:584747', '15054:105151'],
  group: 'Shell',
  description:
    'ES Breadcrumb (the 40px strip over every page) and the page header of the Projects dashboard (Spectral Display md ' +
    'title, pin / more / Share), at xs (inside page option 1) and sm (option 2). The chat header (ES Breadcrumb with ' +
    'avatars, cost pill and icons) is wave 2.1.',
}

export default function PageChromeGallery() {
  const [pinned, setPinned] = useState(false)
  return (
    <>
      <GallerySection title="ES Breadcrumb">
        <Specimens min="lg">
          <Specimen label="Projects / <project> ⌄ (I14045:584747;12085:586906)" nodeId="5865:366539" surface="workspace" wide>
            <Breadcrumb items={[{ label: 'Projects' }, { label: 'Client Onboarding', current: true, menu: true }]} />
          </Specimen>
          <Specimen label="With actions (the slot later screens fill)" surface="workspace" wide>
            <Breadcrumb items={[{ label: 'Projects' }, { label: 'Client Onboarding', current: true }]} actions={<SecondaryButton label="Share" />} />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Page header">
        <Specimens min="lg">
          <Specimen label="size=xs (inside page option 1)" nodeId="14045:584747" surface="workspace" wide>
            <div style={{ width: '100%' }}>
              <PageHeader title="Client Onboarding" description="Everything about onboarding new clients: kickoff notes, plans and the weekly digest."
                          pinned={pinned} onPin={() => setPinned(p => !p)} />
            </div>
          </Specimen>
          <Specimen label="size=sm (inside page option 2)" nodeId="15054:105151" surface="workspace" wide>
            <div style={{ width: '100%' }}>
              <PageHeader size="sm" title="Client Onboarding" description="Onboarding new clients." pinned={pinned} onPin={() => setPinned(p => !p)} />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
