import type { SVGProps } from 'react'

// Line icons of the artifact surfaces, from the vectorPaths of the instances (figma-console 2026-10-09). They take
// currentColor, so the button around them sets the colour (icon-secondary #6a6662 at rest).

type IconProps = SVGProps<SVGSVGElement>
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const

/** download-01, 16 (files panel rows I14604:278351, split card): 12 x 12 glyph at 2, 2, stroke 1. */
export const Download16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...base} {...p}>
    <path d="M11.3333 6.6667L8 10L4.6667 6.6667" />
    <path d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.0799 14 3.5198 14 3.092 13.782C2.7157 13.5903 2.4097 13.2843 2.218 12.908C2 12.4802 2 11.9201 2 10.8V10M8 10V2" />
  </svg>
)

/** download-01, 12 ("Download All" I14604:278289): 9 x 9 glyph at 1.5, 1.5, stroke 1.25. */
export const Download12 = (p: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" strokeWidth={1.25} {...base} {...p}>
    <path d="M8.5 5L6 7.5L3.5 5" />
    <path d="M10.5 7.5V8.1C10.5 8.9401 10.5 9.3601 10.3365 9.681C10.1927 9.9632 9.9632 10.1927 9.681 10.3365C9.3601 10.5 8.9401 10.5 8.1 10.5H3.9C3.0599 10.5 2.6399 10.5 2.319 10.3365C2.0368 10.1927 1.8073 9.9632 1.6635 9.681C1.5 9.3601 1.5 8.9401 1.5 8.1V7.5M6 7.5V1.5" />
  </svg>
)

/** clipboard, 16 (the chat header files button I7062:513765;12909:604991): 9.33 x 12 glyph at 3.33, 2, stroke 1.25. */
export const Clipboard16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.25} {...base} {...p}>
    <path d="M5.6667 2.96C5.6667 2.624 5.6667 2.4559 5.7302 2.3276C5.7862 2.2147 5.8754 2.1229 5.9852 2.0654C6.11 2 6.2733 2 6.6 2H9.4C9.7267 2 9.89 2 10.0148 2.0654C10.1246 2.1229 10.2138 2.2147 10.2698 2.3276C10.3333 2.4559 10.3333 2.624 10.3333 2.96V3.44C10.3333 3.776 10.3333 3.9441 10.2698 4.0724C10.2138 4.1853 10.1246 4.2771 10.0148 4.3346C9.89 4.4 9.7267 4.4 9.4 4.4H6.6C6.2733 4.4 6.11 4.4 5.9852 4.3346C5.8754 4.2771 5.7862 4.1853 5.7302 4.0724C5.6667 3.9441 5.6667 3.776 5.6667 3.44V2.96Z" />
    <path d="M10.3333 3.2C10.8758 3.2 11.1471 3.2 11.3696 3.2613C11.9735 3.4278 12.4452 3.913 12.607 4.5341C12.6667 4.763 12.6667 5.042 12.6667 5.6V11.12C12.6667 12.1281 12.6667 12.6321 12.4759 13.0172C12.3081 13.3559 12.0404 13.6312 11.7111 13.8038C11.3368 14 10.8467 14 9.8667 14H6.1333C5.1532 14 4.6632 14 4.2888 13.8038C3.9596 13.6312 3.6918 13.3559 3.5241 13.0172C3.3333 12.6321 3.3333 12.1281 3.3333 11.12V5.6C3.3333 5.042 3.3333 4.763 3.393 4.5341C3.5548 3.913 4.0265 3.4278 4.6304 3.2613C4.8529 3.2 5.1242 3.2 5.6667 3.2" />
  </svg>
)
