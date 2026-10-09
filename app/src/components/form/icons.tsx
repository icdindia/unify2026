// Stroke icons of the form and people primitives, rebuilt from the vectorPaths of the Figma instances
// (figma-console, 2026-10-08; exportAsync was stalled by other agents, so each path is the node's own vector data,
// translated to its offset inside the icon frame). Every icon strokes currentColor so the component's CSS colours it
// per state with the DS icon tokens. All are decorative: the control that holds one carries the accessible name.
import type { SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>

const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const

/** check, 12px (_Checkbox base Size=sm 80:43616; Dropdown list item Selected=On 11750:513458). */
export const Check12 = (p: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" strokeWidth={1} {...base} {...p}><path d="M10 3L4.5 8.5L2 6" /></svg>
)

/** check, 10px (_Checkbox base Size=xs 80:43617). */
export const Check10 = (p: IconProps) => (
  <svg width="10" height="10" viewBox="0 0 10 10" strokeWidth={1} {...base} {...p}><path d="M8.3333 2.5L3.75 7.0833L1.6667 5" /></svg>
)

/** check, 16px (Input dropdown Menu Item Selected=True 11831:300414). */
export const Check16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...base} {...p}><path d="M13.3333 4L6 11.3333L2.6667 8" /></svg>
)

/** minus, 12px (_Checkbox base Indeterminate=True 80:43618). The xs box draws it at 10px. */
export const Minus = ({ size = 12, ...p }: IconProps & { size?: 10 | 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" strokeWidth={12 / size} {...base} {...p}><path d="M2.5 6H9.5" /></svg>
)

/** x, 8px (Tag remove, Small Icon Button xxs 11991:750617). */
export const X8 = (p: IconProps) => (
  <svg width="8" height="8" viewBox="0 0 8 8" strokeWidth={1} {...base} {...p}><path d="M6.6667 1.3333L1.3333 6.6667M1.3333 1.3333L6.6667 6.6667" /></svg>
)

/**
 * chevron-down, 12px (80:49995; the share invite's role button "Commenter ⌄", 11991:750624): a 6 x 3.5 vector at 3, 4.25.
 * Not ChevronDownSm scaled down: that glyph is drawn for a 20px frame and shrinks to 3 x 2 at 12px.
 */
export const ChevronDown12 = (p: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" strokeWidth={1} {...base} {...p}><path d="M3 4.25L6 7.75L9 4.25" /></svg>
)

/** chevron-down-sm, 20px (Input dropdown_outline 11832:31925). */
export const ChevronDownSm = (p: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" strokeWidth={1} {...base} {...p}><path d="M7.5 8.1611L10.2395 11.4944L12.9167 8.1611" /></svg>
)

/** user-01z (Avatar Type=Icon 8007:429003). One path scaled to 20 / 16 / 10px with a 1px stroke at every size. */
export const User = ({ size = 20, ...p }: IconProps & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" strokeWidth={20 / size} {...base} {...p}>
    <path d="M10 10C12.0711 10 13.75 8.3211 13.75 6.25C13.75 4.1789 12.0711 2.5 10 2.5C7.9289 2.5 6.25 4.1789 6.25 6.25C6.25 8.3211 7.9289 10 10 10Z" />
    <path d="M16.6667 17.5C16.6667 16.337 16.6667 15.7555 16.5231 15.2824C16.1999 14.217 15.3663 13.3834 14.3009 13.0602C13.8278 12.9167 13.2463 12.9167 12.0833 12.9167H7.9167C6.7537 12.9167 6.1722 12.9167 5.6991 13.0602C4.6337 13.3834 3.8001 14.217 3.4769 15.2824C3.3333 15.7555 3.3333 16.337 3.3333 17.5" />
  </svg>
)

/** eye, 14px (Toggle group, preview 13722:383356). */
export const Eye14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" strokeWidth={1} {...base} {...p}>
    <g transform="translate(1.258 2.917)">
      <path d="M0.1539 4.4994C0.0745 4.3736 0.0348 4.3107 0.0125 4.2137C-0.0042 4.1408 -0.0042 4.0259 0.0125 3.953C0.0348 3.856 0.0745 3.7931 0.1539 3.6673C0.8104 2.6278 2.7645 0 5.7424 0C8.7203 0 10.6744 2.6278 11.3309 3.6673C11.4104 3.7931 11.4501 3.856 11.4723 3.953C11.489 4.0259 11.489 4.1408 11.4723 4.2137C11.4501 4.3107 11.4104 4.3736 11.3309 4.4994C10.6744 5.5388 8.7203 8.1667 5.7424 8.1667C2.7645 8.1667 0.8104 5.5388 0.1539 4.4994Z" />
      <path d="M5.7424 5.8333C6.7089 5.8333 7.4924 5.0498 7.4924 4.0833C7.4924 3.1168 6.7089 2.3333 5.7424 2.3333C4.7759 2.3333 3.9924 3.1168 3.9924 4.0833C3.9924 5.0498 4.7759 5.8333 5.7424 5.8333Z" />
    </g>
  </svg>
)

/** code-01, 14px (Toggle group, code 13722:383356). */
export const Code14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" strokeWidth={1} {...base} {...p}>
    <path d="M9.3333 10.5L12.8333 7L9.3333 3.5M4.6667 3.5L1.1667 7L4.6667 10.5" />
  </svg>
)

/** currency-dollar, 16px (Input field_outline Icon leading, cost 08 6802:236151). */
export const Dollar16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.25} {...base} {...p}>
    <path d="M4 10.6667C4 12.1394 5.1939 13.3333 6.6667 13.3333H9.3333C10.8061 13.3333 12 12.1394 12 10.6667C12 9.1939 10.8061 8 9.3333 8H6.6667C5.1939 8 4 6.8061 4 5.3333C4 3.8606 5.1939 2.6667 6.6667 2.6667H9.3333C10.8061 2.6667 12 3.8606 12 5.3333M8 1.3333V14.6667" />
  </svg>
)

/** plus, 16px (the DS plus glyph; _Avatar add button 8007:430923 draws it inside the dashed-free circle). */
export const Plus16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...base} {...p}><path d="M8 3.3333V12.6667M3.3333 8H12.6667" /></svg>
)

/** alert-circle, 16px (Input field_outline Destructive=True). */
export const AlertCircle16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...base} {...p}>
    <path d="M8 5.3333V8M8 10.6667H8.0067M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.3333 11.6819 1.3333 8C1.3333 4.3181 4.3181 1.3333 8 1.3333C11.6819 1.3333 14.6667 4.3181 14.6667 8Z" />
  </svg>
)

/** list, 14px (files panel view toggle, Toggle group 14607:405531; vectorPaths translated by 1.75, 2.917). */
export const List14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" strokeWidth={1} {...base} {...p}>
    <path d="M12.25 7H5.25M12.25 3.5H5.25M12.25 10.5H5.25" />
    <circle cx="2.3333" cy="3.5" r="0.5833" />
    <circle cx="2.3333" cy="7" r="0.5833" />
    <circle cx="2.3333" cy="10.5" r="0.5833" />
  </svg>
)

/** grid-01, 14px (files panel view toggle, Toggle group 14607:405531): four 4.08px squares, 0.93px corners. */
export const Grid14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" strokeWidth={1} {...base} {...p}>
    <rect x="1.75" y="1.75" width="4.0833" height="4.0833" rx="0.9333" />
    <rect x="8.1667" y="1.75" width="4.0833" height="4.0833" rx="0.9333" />
    <rect x="8.1667" y="8.1667" width="4.0833" height="4.0833" rx="0.9333" />
    <rect x="1.75" y="8.1667" width="4.0833" height="4.0833" rx="0.9333" />
  </svg>
)
