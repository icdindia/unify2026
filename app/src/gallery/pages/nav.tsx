import { useState } from 'react'
import { Nav, Rail, type NavKey, type NavMode } from '../../shell/nav'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './nav.css'

export const meta: GalleryMeta = {
  title: 'Navigation and rail',
  figmaNodeIds: ['226:81201', '226:81200', '226:81199', '9721:594967', '9721:595036'],
  group: 'Shell',
  description:
    'Main_nav expanded (280) and collapsed (the 56px rail), dark and light, as the shell draws them (nav modes frame ' +
    '14992:112150). Selecting a row here only moves the highlight. The footer names the signed-in user: Anurag Kashyap as ' +
    'drawn, Roger Bennett with fixes (persona-signed-in). Pinned items, statuses and drag are wave 5.',
}

const MODES: NavMode[] = ['dark', 'light']

export default function NavGallery() {
  const [selected, setSelected] = useState<NavKey | null>('projects')
  const sel = { selected, current: null, onSelect: setSelected, onNavigate: () => {} }
  return (
    <GallerySection title="Main_nav types=Expanded | collapsed × mode">
      <Specimens min="md">
        {MODES.map(mode => (
          <Specimen key={`nav-${mode}`} label={`Expanded, ${mode}`} nodeId={mode === 'dark' ? '226:81200' : '9721:594967'} surface="workspace">
            <div className="gnav-stage gnav-stage--nav"><Nav mode={mode} {...sel} /></div>
          </Specimen>
        ))}
      </Specimens>
      <Specimens min="sm">
        {MODES.map(mode => (
          <Specimen key={`rail-${mode}`} label={`Collapsed (rail), ${mode}`} nodeId={mode === 'dark' ? '226:81199' : '9721:595036'} surface="workspace">
            <div className="gnav-stage gnav-stage--rail"><Rail mode={mode} {...sel} /></div>
          </Specimen>
        ))}
      </Specimens>
    </GallerySection>
  )
}
