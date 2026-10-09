import { useState } from 'react'
import { OptionMenu, nextOptionId, optionDomId, type OptionMenuOption } from '../../components/option-menu'
import { InputField } from '../../components/form'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Option menu',
  figmaNodeIds: ['11832:31551', '11831:300292', '9893:411267'],
  group: 'People',
  description: 'Input Menu Dropdown + Input dropdown Menu Item: avatar-leading rows (single / double line), section label, trailing role, selected check, scroll. A listbox driven by aria-activedescendant.',
}

const ACCESS: OptionMenuOption[] = [
  { id: 'roger', label: 'Roger Bennett', suffix: ' (You)', avatar: { name: 'Roger Bennett', colour: 'brand-500' }, role: 'Owner' },
  { id: 'matt', label: 'Matt Rivera', avatar: { name: 'Matt Rivera', colour: 'plum-700' }, role: 'Editor' },
  { id: 'john', label: 'John Whitaker', avatar: { name: 'John Whitaker', colour: 'error-600' }, role: 'Editor' },
  { id: 'grace', label: 'Grace Coleman', avatar: { name: 'Grace Coleman', colour: 'warm-blue-700' }, role: 'Editor' },
  { id: 'natali', label: 'Natali Craig', avatar: { name: 'Natali Craig', colour: 'brand-tertiary-800' }, role: 'Viewer' },
]

/** The Assistant's dot-grid mark in a 18px dark circle, as the mention list draws it (collab 03). */
const AssistantMark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="currentColor" />
    {[6.5, 11.5].flatMap(x => [6.5, 11.5].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" fill="white" />))}
  </svg>
)

const MENTION: OptionMenuOption[] = [
  { id: 'assistant', label: 'Assistant', leading: <span style={{ color: 'var(--colors-text-text-primary-900)', display: 'flex' }}><AssistantMark /></span> },
  { id: 'matt', label: 'Matt Rivera', avatar: { name: 'Matt Rivera', colour: 'plum-300' } },
  { id: 'john', label: 'John Whitaker', avatar: { name: 'John Whitaker', colour: 'rose-300' } },
  { id: 'grace', label: 'Grace Coleman', avatar: { name: 'Grace Coleman', colour: 'warm-blue-300' } },
]

const PEOPLE: OptionMenuOption[] = [
  ['aman', 'Aman Baldha', 'aman.baldha@partner.unifyapps.com'],
  ['saurav', 'Saurav', 'saurav@unifyapps.com'],
  ['lana', 'Lana Steiner', 'lanasteiner@unifyapps.com'],
  ['demi', 'Demi Wilkinson', 'demiwilkinson@unifyapps.com'],
  ['candice', 'Candice Wu', 'candicewu@unifyapps.com'],
  ['natali', 'Natali Craig', 'natalicraig@unifyapps.com'],
  ['drew', 'Drew Cano', 'drewcano@unifyapps.com'],
  ['orlando', 'Orlando Diggs', 'orlandodiggs@unifyapps.com'],
  ['andi', 'Andi Lane', 'andi@unifyapps.com'],
].map(([id, label, email]) => ({ id, label, supporting: email, avatar: { name: label, colour: 'brand-500' as const } }))

const SAMPLE: OptionMenuOption[] = [
  { id: 'olivia', label: 'Olivia Rhye', supporting: '@olivia', avatar: { name: 'Olivia Rhye' } },
  { id: 'phoenix', label: 'Phoenix Baker', supporting: '@phoenix', avatar: { name: 'Phoenix Baker' } },
  { id: 'lana', label: 'Lana Steiner', supporting: '@lana', avatar: { name: 'Lana Steiner' }, disabled: true },
]

/** People search: the input keeps focus and drives the list (combobox pattern). */
function PeopleSearch() {
  const [q, setQ] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const shown = PEOPLE.filter(p => !q || `${p.label} ${p.supporting}`.toLowerCase().includes(q.toLowerCase()))
  const menuId = 'gallery-people-search'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', width: '100%', maxWidth: 416 }}>
      <InputField
        aria-label="Invite people and groups" placeholder="Invite people and groups" value={q}
        role="combobox" aria-expanded aria-controls={menuId} aria-autocomplete="list"
        aria-activedescendant={active ? optionDomId(menuId, active) : undefined}
        onChange={e => { setQ(e.target.value); setActive(null) }}
        onKeyDown={e => {
          const move = e.key === 'ArrowDown' ? 'next' : e.key === 'ArrowUp' ? 'prev' : null
          if (move) { e.preventDefault(); setActive(nextOptionId(shown, active, move)) }
          if (e.key === 'Enter' && active) { e.preventDefault(); setPicked(active) }
        }}
      />
      <OptionMenu
        id={menuId} items={shown} size="md" stacking="double" maxHeight={372} focusable={false} aria-label="People"
        activeId={active} onActiveChange={setActive} onSelect={o => setPicked(o.id)} style={{ marginInline: 'var(--spacing-xs)' }}
      />
      <span>Picked: {picked ?? 'none'}</span>
    </div>
  )
}

export default function OptionMenuGallery() {
  const [mention, setMention] = useState<string | null>(null)
  const [sample, setSample] = useState<string | null>('phoenix')
  return (
    <>
      <GallerySection title="As used in the journeys">
        <Specimens min="md">
          <Specimen label="Access popover: section label, roles, read-only (1809:365546)" nodeId="1809:365546" surface="workspace">
            <OptionMenu items={ACCESS} label="People with Access" readOnly spaced style={{ width: 225 }} />
          </Specimen>
          <Specimen label={`Mention list, sm single (8202:478758) — chosen: ${mention ?? 'none'}`} surface="workspace">
            <OptionMenu items={MENTION} aria-label="Mention" onSelect={o => setMention(o.label)} style={{ width: 176 }} />
          </Specimen>
          <Specimen label="People search, md double line, md scroll bar (1819:316469)" nodeId="1819:316469" surface="workspace" wide>
            <PeopleSearch />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Variants" description="Click a row, or Tab into a list and use ↑ ↓ Home End Enter.">
        <Specimens min="md">
          <Specimen label="sm, Avatar leading, Single Line, supporting mono; Selected; Disabled" nodeId="11831:300414" surface="workspace">
            <OptionMenu items={SAMPLE} aria-label="People" selectedId={sample} onSelect={o => setSample(o.id)} style={{ width: 320 }} />
          </Specimen>
          <Specimen label="md, Avatar leading, Single Line" nodeId="11831:300357" surface="workspace">
            <OptionMenu items={SAMPLE.slice(0, 2)} size="md" aria-label="People" style={{ width: 320 }} />
          </Specimen>
          <Specimen label="md, Double Line, Selected=True" nodeId="11831:300331" surface="workspace">
            <OptionMenu items={PEOPLE.slice(0, 3)} size="md" stacking="double" selectedId="aman" aria-label="People" style={{ width: 320 }} />
          </Specimen>
          <Specimen label="State=Hover (activeId pinned)" nodeId="11831:300419" surface="workspace">
            <OptionMenu items={SAMPLE.slice(0, 2)} activeId="olivia" aria-label="People" style={{ width: 320 }} />
          </Specimen>
          <Specimen label="Type=Default rows (no leading)" nodeId="11831:300373" surface="workspace">
            <OptionMenu items={[{ id: 'a', label: 'Olivia Rhye', supporting: '@olivia' }, { id: 'b', label: 'Phoenix Baker', supporting: '@phoenix' }]} selectedId="b" aria-label="People" style={{ width: 320 }} />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
