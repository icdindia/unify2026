import { useState } from 'react'
import { TagsField, formIcons, type TagsFieldItem } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Tags field',
  figmaNodeIds: ['11832:31637', '166:43302'],
  group: 'Forms',
  description: 'Chips that wrap to more rows, then a text input: Enter or "," adds the typed text, Backspace removes the last chip.',
}

const INVITE: TagsFieldItem[] = [
  { id: 'olivia', label: 'olivia@untitled.com', avatar: { name: 'olivia@untitled.com' } },
  { id: 'phoenix', label: 'Phoenix', avatar: { name: 'Phoenix' } },
]
const FIVE: TagsFieldItem[] = [
  ...INVITE,
  { id: 'natali', label: 'Natali', avatar: { name: 'Natali' } },
  { id: 'candice', label: 'Candice', avatar: { name: 'Candice' } },
  { id: 'andi', label: 'Andi', avatar: { name: 'Andi' } },
]

/**
 * The invite role button drawn in the field (Buttons/Button Neutral xs Tertiary 11991:750624: padding 4, gap 2, the
 * label in a 2px "Text padding" frame, then the 12px chevron-down); the share modal owns its menu. 92 wide in the file,
 * so "Commenter" starts at 324 and the chevron glyph spans 397-403 of the 416 field.
 */
function RoleButton() {
  return (
    <button type="button" aria-haspopup="menu" style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xxs)', padding: 'var(--spacing-xs)', borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-xs-medium-font-size)', fontWeight: 'var(--text-xs-medium-font-weight)', lineHeight: 'var(--text-xs-medium-line-height)',
      color: 'var(--component-buttons-neutral-tertiary-button-neutral-tertiary-fg)',
    }}>
      <span style={{ padding: '0 var(--spacing-xxs)' }}>Commenter</span>
      <formIcons.ChevronDown12 />
    </button>
  )
}

export default function TagsFieldGallery() {
  const [two, setTwo] = useState(INVITE)
  const [five, setFive] = useState(FIVE)
  const [empty, setEmpty] = useState<TagsFieldItem[]>([])
  return (
    <GallerySection title="Type=Tags">
      <Specimens min="lg">
        <Specimen label="Share invite: two chips + role (1819:316471)" nodeId="11991:750617" surface="primary" wide>
          <div style={{ width: '100%', maxWidth: 416 }}>
            <TagsField aria-label="Invite people and groups" value={two} onChange={setTwo} trailing={<RoleButton />} />
          </div>
        </Specimen>
        <Specimen label="Five chips wrap to a second row (1819:316531)" surface="primary" wide>
          <div style={{ width: '100%', maxWidth: 416 }}>
            <TagsField aria-label="Invite people and groups" value={five} onChange={setFive} trailing={<RoleButton />} />
          </div>
        </Specimen>
        <Specimen label="Empty, placeholder; type an email and press Enter" surface="primary" wide>
          <div style={{ width: '100%', maxWidth: 416 }}>
            <TagsField aria-label="Invite people and groups" placeholder="Invite people and groups" value={empty} onChange={setEmpty} />
          </div>
        </Specimen>
        <Specimen label="Disabled" surface="primary" wide>
          <div style={{ width: '100%', maxWidth: 416 }}>
            <TagsField aria-label="Invite people and groups" value={INVITE} onChange={() => {}} disabled />
          </div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
