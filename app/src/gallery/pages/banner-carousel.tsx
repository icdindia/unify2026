import { BannerCarousel, BANNER_THREE_APPS } from '../../screens/landing/BannerCarousel'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Banner carousel',
  // literal ids: the gallery suite reads them from this source (BANNER_CAROUSEL_SET, BANNER_THREE_APPS, the 01 instance)
  figmaNodeIds: ['387:149552', '387:149553', '2532:73193'],
  group: 'Landing',
  description:
    'The "Connect apps" banner under the landing composer (Banner carousel / Property 1=Three apps; chat-artifact 01-02). ' +
    'Figma draws only this slide, so the three pager dots are a picture of the carousel, not controls. Under 560px the app ' +
    'tiles drop out and the card keeps its text (the prototype\'s rule: no frame draws the landing that narrow).',
}

export default function BannerCarouselGallery() {
  return (
    <GallerySection title="Property 1=Three apps" description="534 x 102: the 520 card at top 4, then the dots 4 under the clip.">
      <Specimens min="lg">
        <Specimen label="chat-artifact 01 (instance 2532:73193, x 481 y 782 at 1440)" nodeId="2532:73193" wide>
          <BannerCarousel nodeId="2532:73193" />
        </Specimen>
        <Specimen label="In a 360px column (phone width)" nodeId={BANNER_THREE_APPS}>
          <div style={{ width: 360, maxWidth: '100%' }}><BannerCarousel /></div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
