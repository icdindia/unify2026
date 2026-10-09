import { useState } from 'react'
import {
  BrandButton, Button, ButtonGroup, FilterButton, IconButton, SecondaryButton, Tabs, TertiaryButton,
  buttonIcons, tabIcons, toolbarIcons, type ButtonKind, type ButtonSize, type IconButtonSize,
} from '../../components/buttons'
import { overlayIcons } from '../../components/overlays'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Buttons',
  figmaNodeIds: ['11750:511612', '11932:738003', '9918:392657'],
  group: 'Buttons',
  description:
    'Buttons/Button Brand, Button Neutral and Button Error. Button is the general one (modal footers, empty states); ' +
    'IconButton, TertiaryButton, SecondaryButton, BrandButton, FilterButton and Tabs are the page-chrome buttons measured on ' +
    'the Projects screens (14045:584747, 15054:105151). Sizes: xs 24, sm 28, md 32 everywhere.',
}

const KINDS: ButtonKind[] = ['primary', 'secondary', 'tertiary', 'destructive']
const SIZES: ButtonSize[] = ['sm', 'md']
const LABEL: Record<ButtonKind, string> = { primary: 'Publish', secondary: 'Cancel', tertiary: 'Unpublish', destructive: 'Delete' }
/** The State=Focused variant of each kind and size (Icon=Default). */
const FOCUSED: Record<ButtonKind, Record<ButtonSize, string>> = {
  primary: { sm: '11750:511719', md: '11750:511718' },
  secondary: { sm: '11932:738161', md: '11932:738160' },
  tertiary: { sm: '11932:738066', md: '11932:738094' },
  destructive: { sm: '9918:392746', md: '9918:392786' },
}

export default function ButtonsGallery() {
  const [tab, setTab] = useState('chats')
  const [pill, setPill] = useState('chats')
  const tabs = [
    { id: 'chats', label: 'Chats', icon: tabIcons.chats }, { id: 'routines', label: 'Routines', icon: tabIcons.routines },
    { id: 'artifacts', label: 'Artifacts', icon: tabIcons.artifacts }, { id: 'files', label: 'Files', icon: tabIcons.files },
  ]
  return (
    <>
      <GallerySection
        title="Button: kind × size × state"
        description="Hover and Focused are pinned with .is-hover / .is-focus here; real :hover and keyboard focus (Tab) draw the same. Disabled is the native attribute. With fixes on, Focused also draws the app's 2px brand-500 ring around the halo (fix button-focus-ring-3-to-1)."
      >
        <Specimens min="lg">
          {SIZES.flatMap(size => KINDS.map(kind => (
            <Specimen key={`${size}-${kind}`} label={`${kind}, Size=${size}: Default / Hover / Focused / Disabled`} nodeId={FOCUSED[kind][size]} surface="primary">
              <ButtonGroup style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button kind={kind} size={size} label={LABEL[kind]} />
                <Button kind={kind} size={size} label={LABEL[kind]} className="is-hover" />
                <Button kind={kind} size={size} label={LABEL[kind]} className="is-focus" />
                <Button kind={kind} size={size} label={LABEL[kind]} disabled />
              </ButtonGroup>
            </Specimen>
          )))}
          <Specimen label="Leading icon (Copy Link, Unpublish)" surface="primary">
            <ButtonGroup>
              <Button kind="secondary" size="md" icon={overlayIcons.link01} label="Copy Link" />
              <Button kind="tertiary" icon={overlayIcons.slashCircle} label="Unpublish" />
            </ButtonGroup>
          </Specimen>
          <Specimen label="fill: takes the row's width" surface="primary">
            <div style={{ width: '100%' }}><Button kind="secondary" size="md" label="Copy Link" icon={overlayIcons.link01} fill /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Page-chrome buttons (Projects screens)">
        <Specimens min="md">
          {(['xs', 'sm', 'md'] as IconButtonSize[]).map(size => (
            <Specimen key={size} label={`IconButton, Size=${size}`} surface="primary">
              <IconButton size={size} icon={buttonIcons.moreVertical16} aria-label="More" />
            </Specimen>
          ))}
          <Specimen label="IconButton round (composer +)" surface="primary">
            <IconButton round icon={buttonIcons.moreVertical16} aria-label="More" />
          </Specimen>
          <Specimen label="TertiaryButton (crumb), strong" surface="primary">
            <ButtonGroup><TertiaryButton label="Projects" /><TertiaryButton label="Client Onboarding" strong /></ButtonGroup>
          </Specimen>
          <Specimen label="SecondaryButton xs / sm" surface="primary">
            <ButtonGroup><SecondaryButton label="Share" /><SecondaryButton size="sm" label="Share" /></ButtonGroup>
          </Specimen>
          <Specimen label="BrandButton md (New Project)" surface="primary">
            <BrandButton size="md" icon={buttonIcons.plusWhite14} label="New Project" />
          </Specimen>
          <Specimen label="BrandButton sm Primary / Secondary / with chevron" surface="primary">
            <ButtonGroup>
              <BrandButton variant="primary" label="Chats" />
              <BrandButton label="Routines" />
              <BrandButton label="All" chevron />
              <BrandButton label="Newest" chevron chevronPadding="sm" />
            </ButtonGroup>
          </Specimen>
          <Specimen label="FilterButton xs / sm" surface="primary">
            <ButtonGroup>
              <FilterButton size="xs" icon={toolbarIcons.filter16} label="All Types" />
              <FilterButton icon={toolbarIcons.sort14} label="Newest" />
            </ButtonGroup>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Tabs" description="A WAI-ARIA tablist: one Tab stop; arrow keys, Home and End move and select.">
        <Specimens min="lg">
          <Specimen label="variant=underline (inside page option 1)" surface="primary">
            <Tabs items={tabs} selected={tab} onSelect={setTab} aria-label="Project content" />
          </Specimen>
          <Specimen label="variant=pill (inside page option 2)" surface="primary">
            <Tabs variant="pill" items={tabs.map(({ icon: _icon, ...t }) => t)} selected={pill} onSelect={setPill} aria-label="Project content" />
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
