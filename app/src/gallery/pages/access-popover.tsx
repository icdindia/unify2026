import { useState } from 'react'
import { AccessPopover, useAccessOptions, useAccessPeople, useHoverPopover } from '../../components/access-popover'
import { AvatarGroup } from '../../components/avatar'
import { OptionMenu } from '../../components/option-menu'
import { avatarOn, type PersonId } from '../../fixtures/people'
import { pick, useFixPredicate } from '../../fixtures/drift'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-surfaces-gallery.css'

export const meta: GalleryMeta = {
  title: 'Access popover',
  figmaNodeIds: ['1809:365546', '6077:427693', '1768:356654'],
  group: 'Artifacts',
  description:
    'People with access: a read-only list under the chat header’s avatar stack (15). Opens on hover (150ms) and stays open ' +
    'while the pointer is over the stack or the card; a click pins it; Enter / Space opens it with focus inside; Escape, ' +
    'a press outside or Tab away close it. With fixes on (access-popover-manage), "Manage access" opens the Share modal (Q41). ' +
    'The same component ChatHeader opens (components/chat-header/AccessPopover).',
}

const STACK: PersonId[] = ['matt-rivera', 'john-whitaker', 'grace-coleman']

/** The header's avatar stack (xs, as 15 draws it) as the trigger. */
function Live() {
  const applies = useFixPredicate()
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [last, setLast] = useState('none')
  const { open, keyboard, close, triggerProps, popoverProps } = useHoverPopover()
  const access = useAccessPeople()
  const people = STACK.map(id => {
    const a = avatarOn(id, 'header')
    return { name: pick(a.name, applies), initial: a.initial, colour: pick(a.colour, applies) }
  })
  return (
    <div className="iacg-hdr">
      <span className="iacg-note">Last action: {last}</span>
      <button ref={setAnchor} type="button" aria-label="People with access" className="iacg-trigger" {...triggerProps}>
        <AvatarGroup people={people} size="xs" titles={false} />
      </button>
      <AccessPopover
        open={open} anchor={anchor} people={access} onClose={close} autoFocus={keyboard} {...popoverProps}
        onManage={() => { close(); setLast('manage access → Share modal') }}
      />
    </div>
  )
}

/** The card alone, as 15 draws it open (the popover is this list in a Popover). */
function Static() {
  const options = useAccessOptions()
  return <OptionMenu items={options.slice(0, 5)} label="People with Access" readOnly spaced style={{ width: 225 }} />
}

export default function AccessPopoverGallery() {
  return (
    <GallerySection title="People with access" description="As designed: the access surface’s spelling and fills (John Whitake). With fixes: John Whitaker, one fill per person, and Manage access.">
      <Specimens min="md">
        <Specimen label="Live: hover or click the avatar stack (1768:356654)" nodeId="1809:365546" surface="primary" overflow="visible" wide>
          <Live />
        </Specimen>
        <Specimen label="Open, as drawn (6077:427693)" nodeId="6077:427693" surface="workspace">
          <Static />
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
