// Icons the overlay primitives use, rebuilt from the Figma vectors (vectorPaths + stroke) of the instances named
// below, with the instance colours. Vite inlines each as a data URI.
import closeLg from '../../assets/overlays/close-lg.svg'
import closeLgLight from '../../assets/overlays/close-lg-light.svg'
import chevronLeft24 from '../../assets/overlays/chevron-left-sm-24.svg'
import link01 from '../../assets/overlays/link-01.svg'
import slashCircle from '../../assets/overlays/slash-circle-01.svg'
import stars02 from '../../assets/overlays/stars-02.svg'

export const overlayIcons = {
  /** close-lg 16, icon-secondary: the modal header X (I12294:613168;17992:18693). */
  closeLg,
  /** close-lg 16 in icon-tertiary, for the dark toast. */
  closeLgLight,
  /** chevron-left-sm 20 inside a 24px Small Icon Button lg (2px padding baked in, for IconButton xs): the header back. */
  chevronLeft24,
  /** link-01 14: Share's "Copy Link" (I11991:747113;2533:410663;27368:31031;59271:250880). */
  link01,
  /** slash-circle-01 14: Publish's "Unpublish" (I12294:613847;27368:31028;17992:18390). */
  slashCircle,
  /** stars-02 12, icon-tertiary: the tooltip's leading icon on "Co-create with an Agent" (I3780:177208;11103:2512). */
  stars02,
}
