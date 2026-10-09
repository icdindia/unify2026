import { useState } from 'react'
import { AvatarGroup, type AvatarGroupPerson, type AvatarGroupSize } from '../../components/avatar'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Avatar group',
  figmaNodeIds: ['8020:431296', '8007:430922'],
  group: 'People',
  description: 'Overlapping faces with a white separating stroke, a "+N" face and an optional add button. Header: up to 10 + N; bar: 3 + N (Q40).',
}

// The set's own sample fills and letters, in order, then "+5" (Avatar group / Size=xs 8020:431297; every size draws the same)
const SET_SAMPLE: AvatarGroupPerson[] = [
  { name: 'Olivia Rhye', colour: 'brand-300' },
  { name: 'Tomás Reyes', colour: 'error-300' },
  { name: 'Riya Shah', colour: 'steel-blue-200' },
  { name: 'Emma Clarke', colour: 'plum-300' },
  { name: 'Quinn Adler', colour: 'success-300' },
  { name: 'Lana Steiner', colour: 'rose-300' },
  { name: 'Demi Wilkinson', colour: 'warm-blue-300' },
  { name: 'Wes Morgan', colour: 'lime-300' },
  { name: 'Candice Wu', colour: 'warning-300' },
  { name: 'Zoe Hart', colour: 'brand-secondary-500' },
  ...Array.from({ length: 5 }, (_, i) => ({ name: `Colleague ${i + 1}`, colour: 'brand-300' as const })),
]
// The crowded chat header (collab-chat 09, 8222:490604): ten faces in these fills, then "+21"
const CROWD: AvatarGroupPerson[] = [
  { name: 'Matt Rivera', colour: 'plum-300' },
  { name: 'John Whitaker', colour: 'rose-300' },
  { name: 'Grace Coleman', colour: 'warm-blue-300' },
  { name: 'Emma Clarke', colour: 'plum-300' },
  { name: 'Quinn Adler', colour: 'success-300' },
  { name: 'Lana Steiner', colour: 'rose-300' },
  { name: 'Demi Wilkinson', colour: 'warm-blue-300' },
  { name: 'Wes Morgan', colour: 'lime-300' },
  { name: 'Candice Wu', colour: 'warning-300' },
  { name: 'Zoe Hart', colour: 'brand-secondary-500' },
  ...Array.from({ length: 21 }, (_, i) => ({ name: `Colleague ${i + 1}`, colour: 'brand-300' as const })),
]
// The chat header stack in chat-artifact 15 (1768:356654): M plum-700, J error-300, G steel-blue-200
const TRIO: AvatarGroupPerson[] = [
  { name: 'Matt Rivera', colour: 'plum-700' },
  { name: 'John Whitaker', colour: 'error-300' },
  { name: 'Grace Coleman', colour: 'steel-blue-200' },
]
const SIZES: AvatarGroupSize[] = ['xxs', 'xs', 'sm', 'md']
const ADD_STATES: { label: string; node: string; props?: { className?: string; disabled?: boolean } }[] = [
  { label: 'Default', node: '8007:430924' },
  { label: 'Hover', node: '8007:430936', props: { className: 'is-hover' } },
  { label: 'Focus', node: '8007:430928', props: { className: 'is-focus' } },
  { label: 'Disabled', node: '8007:430932', props: { disabled: true } },
]

export default function AvatarGroupGallery() {
  const [added, setAdded] = useState(0)
  return (
    <>
      <GallerySection title="Size" description="Overlap 4 (xxs, xs), 8 (sm), 12 (md); stroke 1px inside at xxs / xs, 1.5px outside at sm / md. The set's own sample: 10 faces + 5.">
        <Specimens min="lg">
          {SIZES.map(s => (
            <Specimen key={s} label={`Size=${s}, max 10`} nodeId={{ xs: '8020:431297', xxs: '8020:431298', sm: '8020:431299', md: '8020:431300' }[s]} surface="primary">
              <AvatarGroup people={SET_SAMPLE} size={s} max={10} />
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>
      <GallerySection title="As used">
        <Specimens min="md">
          <Specimen label="Chat header, 3 people (chat-artifact 15)" nodeId="1768:356654" surface="primary"><AvatarGroup people={TRIO} size="xs" /></Specimen>
          <Specimen label="Crowded header, 10 + 21 (collab 09)" nodeId="8222:490604" surface="primary"><AvatarGroup people={CROWD} size="xs" max={10} /></Specimen>
          <Specimen label="Collaborative bar, 3 + N (xxs, White +N)" surface="primary"><AvatarGroup people={CROWD.slice(0, 8)} size="xxs" max={3} /></Specimen>
          <Specimen label={`Add more button (clicked ${added}×)`} nodeId="8007:430924" surface="primary">
            <AvatarGroup people={TRIO} size="sm" onAdd={() => setAdded(n => n + 1)} />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection
        title="Add more button: state"
        description="_Avatar add button 8007:430922, Size=sm. Hover and Focus are pinned with .is-hover / .is-focus here; real :hover and keyboard focus work too. Focus at md is a 4px #98a2b3 14% ring. With fixes on, Focus also draws the app's 2px brand-500 ring (fix button-focus-ring-3-to-1)."
      >
        <Specimens min="sm">
          {ADD_STATES.map(st => (
            <Specimen key={st.label} label={`State=${st.label}`} nodeId={st.node} surface="primary">
              <AvatarGroup people={TRIO.slice(0, 1)} size="sm" onAdd={() => setAdded(n => n + 1)} addProps={st.props} />
            </Specimen>
          ))}
          <Specimen label="Size=md, State=Focus" nodeId="8007:430929" surface="primary">
            <AvatarGroup people={TRIO.slice(0, 1)} size="md" onAdd={() => setAdded(n => n + 1)} addProps={{ className: 'is-focus' }} />
          </Specimen>
          <Specimen label="Size=md, State=Disabled" nodeId="8007:430933" surface="primary">
            <AvatarGroup people={TRIO.slice(0, 1)} size="md" onAdd={() => setAdded(n => n + 1)} addProps={{ disabled: true }} />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
