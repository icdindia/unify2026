// Stroke icons of the artifact header, rebuilt from the vectorPaths of the "Arifact Header" instances (figma-console,
// 2026-10-09: 3838:245967 copy-01; 4376:395816 refresh-ccw-02, chevron-down-sm, play-solid, the comment glyph,
// download-01, maximize-01, close; 3805:106484 minimize-01). Each path sits at its offset inside the icon frame.
// Strokes and fills are currentColor so the header's CSS colours them; all are decorative (the button is named).
import type { SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>

const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const

/** copy-01 16 (I3838:245967;6424:330782). */
export const Copy16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...stroke} {...p}>
    <g transform="translate(1.333 1.333)">
      <path d="M4.6667 6.8C4.6667 6.0533 4.6667 5.6799 4.812 5.3947C4.9398 5.1438 5.1438 4.9398 5.3947 4.812C5.6799 4.6667 6.0533 4.6667 6.8 4.6667H11.2C11.9467 4.6667 12.3201 4.6667 12.6053 4.812C12.8562 4.9398 13.0602 5.1438 13.188 5.3947C13.3333 5.6799 13.3333 6.0533 13.3333 6.8V11.2C13.3333 11.9467 13.3333 12.3201 13.188 12.6053C13.0602 12.8562 12.8562 13.0602 12.6053 13.188C12.3201 13.3333 11.9467 13.3333 11.2 13.3333H6.8C6.0533 13.3333 5.6799 13.3333 5.3947 13.188C5.1438 13.0602 4.9398 12.8562 4.812 12.6053C4.6667 12.3201 4.6667 11.9467 4.6667 11.2V6.8Z" />
      <path d="M2 8.6667C1.3787 8.6667 1.0681 8.6667 0.8231 8.5652C0.4964 8.4298 0.2368 8.1703 0.1015 7.8436C0 7.5985 0 7.2879 0 6.6667V2.1333C0 1.3866 0 1.0132 0.1453 0.728C0.2732 0.4771 0.4771 0.2732 0.728 0.1453C1.0132 0 1.3866 0 2.1333 0H6.6667C7.2879 0 7.5985 0 7.8436 0.1015C8.1703 0.2368 8.4298 0.4964 8.5652 0.8231C8.6667 1.0681 8.6667 1.3787 8.6667 2" />
    </g>
  </svg>
)

/** refresh-ccw-02 16 (I4376:395816;6944:509804). */
export const Refresh16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...stroke} {...p}>
    <g transform="translate(1.333 2)">
      <path d="M13.3333 11.3333V7.3333H9.3333" />
      <path d="M0 0.6667V4.6667H4" />
      <path d="M0 4.6667C0 4.6667 0.0809 4.1005 2.424 1.7574C4.7672 -0.5858 8.5662 -0.5858 10.9093 1.7574C11.7395 2.5875 12.2755 3.6005 12.5174 4.6667M13.3333 7.3333C13.3333 7.3333 13.2525 7.8995 10.9093 10.2426C8.5662 12.5858 4.7672 12.5858 2.424 10.2426C1.5938 9.4125 1.0578 8.3995 0.8159 7.3333" />
    </g>
  </svg>
)

/** chevron-down-sm 12 (the "v3" button and the comments split, I4376:395816;3792:244988;17992:18646). */
export const ChevronDown12 = (p: IconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" strokeWidth={1} {...stroke} {...p}>
    <path d="M4.5 4.896L6.1437 6.896L7.75 4.896" />
  </svg>
)

/** chevron-down-sm 14 (the name button's trailing chevron, Buttons/Button Neutral 17992:18393): the 16px glyph at 14. */
export const ChevronDown14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 16 16" strokeWidth={1.1667} {...stroke} {...p}>
    <path d="M6 6.5288L8.1916 9.1955L10.3333 6.5288" />
  </svg>
)

/** play-solid 14, filled (Publish, I4376:395816;3792:244997;8928:7590). */
export const Play14 = (p: IconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path transform="translate(3.207 1.674)" d="M0 1.2369C0 0.6704 0 0.3871 0.1181 0.231C0.221 0.0949 0.3783 0.0108 0.5486 0.0006C0.744 -0.0111 0.9797 0.1461 1.4511 0.4603L7.5851 4.5497C7.9746 4.8093 8.1694 4.9392 8.2372 5.1028C8.2965 5.2459 8.2965 5.4067 8.2372 5.5497C8.1694 5.7134 7.9746 5.8432 7.5851 6.1028L1.4511 10.1922C0.9797 10.5065 0.744 10.6636 0.5486 10.6519C0.3783 10.6418 0.221 10.5576 0.1181 10.4216C0 10.2654 0 9.9822 0 9.4157V1.2369Z" />
  </svg>
)

/** message-square 16, the comments button's glyph ("Textarea input field" I4376:395816;13610:411698). */
export const Comment16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...stroke} {...p}>
    <path transform="translate(2 2)" d="M0 3.2C0 2.0799 0 1.5198 0.218 1.092C0.4097 0.7157 0.7157 0.4097 1.092 0.218C1.5198 0 2.0799 0 3.2 0H8.8C9.9201 0 10.4802 0 10.908 0.218C11.2843 0.4097 11.5903 0.7157 11.782 1.092C12 1.5198 12 2.0799 12 3.2V6.8C12 7.9201 12 8.4802 11.782 8.908C11.5903 9.2843 11.2843 9.5903 10.908 9.782C10.4802 10 9.9201 10 8.8 10H7.1225C6.7065 10 6.4984 10 6.2995 10.0408C6.123 10.0771 5.9521 10.137 5.7917 10.219C5.6108 10.3114 5.4483 10.4413 5.1235 10.7012L3.5332 11.9735C3.2558 12.1954 3.1171 12.3063 3.0004 12.3065C2.8988 12.3066 2.8028 12.2604 2.7395 12.1811C2.6667 12.0899 2.6667 11.9122 2.6667 11.557V10C2.0467 10 1.7367 10 1.4824 9.9319C0.7922 9.7469 0.2531 9.2078 0.0681 8.5176C0 8.2633 0 7.9533 0 7.3333V3.2Z" />
  </svg>
)

/** download-01 16 (I4376:395816;13610:411342). */
export const Download16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...stroke} {...p}>
    <g transform="translate(2 2)">
      <path d="M9.3333 4.6667L6 8L2.6667 4.6667" />
      <path d="M12 8V8.8C12 9.9201 12 10.4802 11.782 10.908C11.5903 11.2843 11.2843 11.5903 10.908 11.782C10.4802 12 9.9201 12 8.8 12H3.2C2.0799 12 1.5198 12 1.092 11.782C0.7157 11.5903 0.4097 11.2843 0.218 10.908C0 10.4802 0 9.9201 0 8.8V8M6 8V0" />
    </g>
  </svg>
)

/** maximize-01 16, Expand (I4376:395816;3792:244998). */
export const Maximize16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1} {...stroke} {...p}>
    <g transform="translate(3 3)">
      <path d="M6.6667 0H10V3.3333" />
      <path d="M3.3333 10H0V6.6667" />
      <path d="M6.1111 3.8889L10 0M3.8889 6.1111L0 10" />
    </g>
  </svg>
)

/** minimize-01 16, Collapse (I3805:106484;3792:244998, the full-screen header). */
export const Minimize16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.25} {...stroke} {...p}>
    <g transform="translate(3 3)">
      <path d="M0.5556 6.1111H3.8889V9.4444" />
      <path d="M9.4444 3.8889H6.1111V0.5556" />
      <path d="M3.8889 6.1111L0 10M6.1111 3.8889L10 0" />
    </g>
  </svg>
)

/** close 16, stroke 1.25 (I4376:395816;3792:244999). */
export const Close16 = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.25} {...stroke} {...p}>
    <path transform="translate(2.667 2.667)" d="M10.6667 0L0 10.6667M0 0L10.6667 10.6667" />
  </svg>
)
