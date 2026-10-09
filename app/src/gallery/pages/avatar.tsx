import { Avatar, type AvatarPersonFill, type AvatarSize, type AvatarTone } from '../../components/avatar'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import sampleImage from '../../assets/forms/avatar-image-sample.svg'

export const meta: GalleryMeta = {
  title: 'Avatar',
  figmaNodeIds: ['8007:428847', '250:177364'],
  group: 'People',
  description: 'Letter, icon or image in a circle: five sizes, the set\'s colours, the per-person fills the frames override, and the hover / selected rings.',
}

const SIZES: AvatarSize[] = ['xxs', 'xs', 'sm', 'md', 'lg']
const TONES: { tone: AvatarTone; node: string; label: string }[] = [
  { tone: 'brand-solid', node: '8007:429010', label: 'Colour=Brand Solid' },
  { tone: 'gray', node: '8007:428926', label: 'Colour=Gray' },
  { tone: 'brand-secondary', node: '8007:428927', label: 'Colour=Brand Secondary' },
  { tone: 'white', node: '8007:428928', label: 'Colour=White' },
  { tone: 'brand-subtle', node: '250:178902', label: 'Colour=Brand Subtle (older set)' },
]
const PEOPLE: { name: string; fill: AvatarPersonFill; where: string }[] = [
  { name: 'Roger Bennett', fill: 'brand-500', where: 'access list' },
  { name: 'Matt Rivera', fill: 'plum-700', where: 'messages, access list' },
  { name: 'John Whitaker', fill: 'error-600', where: 'messages, access list' },
  { name: 'Grace Coleman', fill: 'warm-blue-700', where: 'messages, access list' },
  { name: 'Natali Craig', fill: 'brand-tertiary-800', where: 'access list' },
  { name: 'Lana Steiner', fill: 'brand-300', where: 'group sample' },
  { name: 'Emma Clarke', fill: 'plum-300', where: 'crowd header' },
  { name: 'Quinn Adler', fill: 'success-300', where: 'crowd header' },
  { name: 'Riya Shah', fill: 'steel-blue-200', where: 'typing bar' },
  { name: 'Tomás Reyes', fill: 'rose-300', where: 'typing bar' },
  { name: 'Wes Morgan', fill: 'lime-300', where: 'crowd header' },
  { name: 'Candice Wu', fill: 'warning-300', where: 'share list' },
  { name: 'Zoe Hart', fill: 'brand-secondary-500', where: 'crowd header' },
  { name: 'Olivia Park', fill: 'success-400', where: 'typing bar' },
  { name: 'Demi Wilkinson', fill: 'warm-blue-300', where: 'share search' },
  { name: 'Anuj Mittal', fill: 'pigeon-blue-400', where: 'comments' },
  { name: 'Saumya Pandey', fill: 'royal-violet-300', where: 'comments' },
  { name: 'Gaurav Singh', fill: 'brand-tertiary-500', where: 'commenters menu' },
  { name: 'Anirudha Roy', fill: 'error-300', where: 'group sample' },
]

const row = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', flexWrap: 'wrap' } as const

export default function AvatarGallery() {
  return (
    <>
      <GallerySection title="Size × Colour" description="Type=Letter, State=Default. Letters are Text xxs / xs / sm / md Medium (lg 17/20).">
        <Specimens min="md">
          {TONES.map(t => (
            <Specimen key={t.tone} label={t.label} nodeId={t.node} surface="primary">
              <div style={row}>{SIZES.map(s => <Avatar key={s} name="Olivia Rhye" size={s} colour={t.tone} />)}</div>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>

      <GallerySection title="Type=Icon" description="The user-01z glyph at 10 / 16 / 20 / 24 / 28 with a 1px stroke.">
        <Specimens min="md">
          {(['gray', 'brand-secondary', 'white', 'brand-solid'] as AvatarTone[]).map(t => (
            <Specimen key={t} label={`Type=Icon, Colour=${t}`} nodeId="8007:429003" surface="primary">
              <div style={row}>{SIZES.map(s => <Avatar key={s} name="Unknown person" type="icon" size={s} colour={t} />)}</div>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>

      <GallerySection
        title="type=&quot;image&quot;"
        description="Not a variant of the set (it has Type=Letter and Type=Icon only, and no journey draws a photo): the component takes a src for people who have a picture. The image covers the circle; rings and group strokes work the same."
      >
        <Specimens min="md">
          <Specimen label="Sizes" surface="primary">
            <div style={row}>{SIZES.map(s => <Avatar key={s} name="Sample person" type="image" src={sampleImage} size={s} />)}</div>
          </Specimen>
          <Specimen label="State=Selected (sm), State=Hover (md)" surface="primary">
            <div style={row}><Avatar name="Sample person" type="image" src={sampleImage} size="sm" ring="selected" /><Avatar name="Sample person" type="image" src={sampleImage} size="md" ring="hover" /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="State" description="Hover Ring and Select Ring: a 1px ring 2px outside the face.">
        <Specimens min="sm">
          <Specimen label="State=Default" nodeId="8007:428988" surface="primary"><Avatar name="Olivia Rhye" size="sm" /></Specimen>
          <Specimen label="State=Hover" nodeId="8007:428981" surface="primary"><Avatar name="Olivia Rhye" size="sm" ring="hover" /></Specimen>
          <Specimen label="State=Selected" nodeId="8007:428992" surface="primary"><Avatar name="Olivia Rhye" size="sm" ring="selected" /></Specimen>
          <Specimen label="Selected, xs" surface="primary"><Avatar name="Matt Rivera" size="xs" colour="plum-700" ring="selected" /></Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Per-person fills" description="Colour=Brand Solid with the fill overridden per person (keys of AvatarColour in src/fixtures/people.ts).">
        <Specimens min="sm">
          {PEOPLE.map(p => (
            <Specimen key={p.fill} label={`${p.fill} · ${p.where}`} surface="primary">
              <div style={row}><Avatar name={p.name} size="xxs" colour={p.fill} /><Avatar name={p.name} size="xs" colour={p.fill} /><Avatar name={p.name} size="sm" colour={p.fill} /></div>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>
    </>
  )
}
