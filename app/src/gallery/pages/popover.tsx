import { useState } from 'react'
import { Popover, type PopoverPlacement } from '../../components/overlays'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './overlays-gallery.css'

export const meta: GalleryMeta = {
  title: 'Popover',
  figmaNodeIds: ['6077:427694', '6077:427693'],
  group: 'Overlays',
  description:
    'A floating card anchored to its trigger, placed by the same rules as every menu (dropdown-menu/placement.ts): its ' +
    'preferred side, flipped when it does not fit, clamped 8px inside the visible area. Not modal: Escape, a press outside ' +
    'and focus moving away close it; Escape hands focus back to the trigger. Surfaces: Dropdown Menu Type=Small (menu), ' +
    'Type=Full shadow (full), or none (the content brings its own card).',
}

const PLACEMENTS: PopoverPlacement[] = ['bottom-start', 'bottom-end', 'bottom-center', 'top-start', 'top-end', 'right-start', 'left-start']

/** A trigger and its popover. */
function Demo({ label, placement = 'bottom-start', surface = 'menu', width, className }: {
  label: string; placement?: PopoverPlacement; surface?: 'menu' | 'full' | 'plain'; width?: number; className?: string
}) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  return (
    <>
      <button
        ref={setAnchor} type="button" className={'ovg-choice ' + (className ?? '')} aria-expanded={open} aria-haspopup="dialog"
        onClick={e => { setKeyboard(e.detail === 0); setOpen(o => !o) }}
      >
        {label}
      </button>
      <Popover
        open={open} anchor={anchor} placement={placement} surface={surface} width={width} autoFocus={keyboard}
        onClose={() => setOpen(false)} aria-label={`${label} details`}
      >
        <div className={surface === 'plain' ? 'ovg-pop ovg-pop--own' : 'ovg-pop'}>
          <p className="ovg-pop__title">People with access</p>
          <ul className="ovg-pop-list">
            <li>Roger Bennett (you) · Owner</li>
            <li>Candice Wu · Commenter</li>
            <li>Natali Craig · Commenter</li>
          </ul>
          <button type="button" className="ovg-choice" onClick={() => setOpen(false)}>Manage access</button>
        </div>
      </Popover>
    </>
  )
}

export default function PopoverGallery() {
  return (
    <>
      <GallerySection title="Placement" description="Click a trigger (Enter / Space opens it with focus inside).">
        <Specimens min="sm">
          {PLACEMENTS.map(p => (
            <Specimen key={p} label={p} surface="primary" overflow="visible">
              <Demo label={p} placement={p} />
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>

      <GallerySection title="Surface">
        <Specimens min="sm">
          <Specimen label="menu: Dropdown Menu / Type=Small" nodeId="6077:427694" surface="primary" overflow="visible">
            <Demo label="menu" surface="menu" width={260} />
          </Specimen>
          <Specimen label="full: Type=Full shadow" surface="primary" overflow="visible">
            <Demo label="full" surface="full" width={260} />
          </Specimen>
          <Specimen label="plain: the content is the card (Input Menu Dropdown)" nodeId="6077:427693" surface="primary" overflow="visible">
            <Demo label="plain" surface="plain" width={225} />
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection
        title="Flip and clamp"
        description="Triggers in the corners of a wide stage. Near the window's bottom a bottom-* popover opens upward; near its right edge it slides left to stay 8px inside."
      >
        <Specimens min="lg">
          <Specimen label="Corners" wide surface="primary" overflow="visible">
            <div className="ovg-corners">
              <Demo label="Top left" className="ovg-corners__tl" placement="top-start" />
              <Demo label="Top right" className="ovg-corners__tr" placement="bottom-start" />
              <Demo label="Bottom left" className="ovg-corners__bl" placement="left-start" />
              <Demo label="Bottom right" className="ovg-corners__br" placement="right-start" />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
