import { scrollbar } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Scroll bar',
  figmaNodeIds: ['9893:411267', '89:89910'],
  group: 'Foundations',
  description: 'Styled native scrollbars, not a component: className={scrollbar(\'md\')} on any scrolling element (overflow included).',
}

const LINES = Array.from({ length: 30 }, (_, i) => `Row ${i + 1}: Coverage by rep is the number I would act on.`)

function Box({ cls }: { cls: string }) {
  return (
    <div className={cls} tabIndex={0} role="region" aria-label="Scrolling sample" style={{
      width: '100%', maxWidth: 320, height: 180, padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)',
      background: 'var(--colors-background-bg-primary)', boxShadow: 'inset 0 0 0 1px var(--colors-border-border-tertiary)',
      color: 'var(--colors-text-text-secondary-700)', whiteSpace: 'nowrap',
    }}>
      {LINES.map(l => <p key={l}>{l} {l}</p>)}
    </div>
  )
}

export default function ScrollbarGallery() {
  return (
    <GallerySection title="Orientation=Vertical (horizontal follows)">
      <Specimens min="md">
        <Specimen label="Size=md, Bg=False: 16px gutter, 8px thumb, gray-300 60%" nodeId="9893:411268"><Box cls={scrollbar('md')} /></Specimen>
        <Specimen label="Size=sm, Bg=False: 8px gutter, 4px thumb, gray-200 60%" nodeId="89:89911"><Box cls={scrollbar('sm')} /></Specimen>
        <Specimen label="Size=md, Bg=true"><Box cls={scrollbar('md', { bg: true })} /></Specimen>
      </Specimens>
    </GallerySection>
  )
}
