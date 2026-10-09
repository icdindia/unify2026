import type { SVGProps } from 'react'

// Icons of the chat header (ES Breadcrumb, set 1097:162688) and its menus, drawn inline in currentColor so the CSS
// colours them. Geometry from the Figma vectors (instance names in brackets) and measured from the 1440 reference PNGs
// of chat-artifact 03-20.

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>

/** SVG attributes; `nodeId` is the Figma icon instance the glyph was read from (data-node-id). */
const svg = (size: [number, number], props: IconProps, nodeId?: string) => ({
  width: size[0], height: size[1], viewBox: `0 0 ${size[0]} ${size[1]}`, fill: 'none', 'aria-hidden': true as const,
  focusable: false as const, 'data-node-id': nodeId, ...props,
})

/** chevron-down 14 (the title's trailing "clock" swap, I1731:255804;1097:162629;17992:18393): a 4 x 2 stroke. */
export function ChevronDown14(props: IconProps) {
  return (
    <svg {...svg([14, 14], props, 'I1731:255804;1097:162629;17992:18393')}>
      <path d="M5.25 5.71L7.17 8.05L9.04 5.71" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** lock-03 14: Share before the chat is shared (chat-artifact 03, 08, 09). */
export function Lock14(props: IconProps) {
  return (
    <svg {...svg([14, 14], props)}>
      <path
        d="M9.92 6.42V4.67C9.92 3.06 8.61 1.75 7 1.75C5.39 1.75 4.08 3.06 4.08 4.67V6.42M5.13 12.25H8.87C9.85 12.25 10.34 12.25 10.71 12.06C11.04 11.89 11.31 11.62 11.48 11.29C11.67 10.92 11.67 10.43 11.67 9.45V9.22C11.67 8.24 11.67 7.75 11.48 7.37C11.31 7.04 11.04 6.78 10.71 6.61C10.34 6.42 9.85 6.42 8.87 6.42H5.13C4.15 6.42 3.66 6.42 3.29 6.61C2.96 6.78 2.69 7.04 2.52 7.37C2.33 7.75 2.33 8.24 2.33 9.22V9.45C2.33 10.43 2.33 10.92 2.52 11.29C2.69 11.62 2.96 11.89 3.29 12.06C3.66 12.25 4.15 12.25 5.13 12.25Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/** users-01 14: Share once people joined (I1731:255804;5865:363674;17992:18390, chat-artifact 10-20). */
export function Users14(props: IconProps) {
  return (
    <svg {...svg([14, 14], props, 'I1731:255804;5865:363674;17992:18390')}>
      <path
        d="M12.83 12.25V11.08C12.83 10 12.09 9.08 11.08 8.82M9.04 1.92C9.9 2.27 10.5 3.1 10.5 4.08C10.5 5.06 9.9 5.9 9.04 6.25M9.92 12.25C9.92 11.16 9.92 10.62 9.74 10.19C9.5 9.62 9.05 9.16 8.48 8.93C8.05 8.75 7.5 8.75 6.42 8.75H4.67C3.58 8.75 3.04 8.75 2.61 8.93C2.04 9.16 1.58 9.62 1.34 10.19C1.17 10.62 1.17 11.16 1.17 12.25M7.88 4.08C7.88 5.37 6.83 6.42 5.54 6.42C4.25 6.42 3.21 5.37 3.21 4.08C3.21 2.79 4.25 1.75 5.54 1.75C6.83 1.75 7.88 2.79 7.88 4.08Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * clipboard 16 (I1731:255804;12909:604991;17992:18508, vector 9 x 12 at 3,2): the files button. Rebuilt from the
 * reference PNG (body 3.35-12.65 x 3.4-13.9, tab 5.3-10.7 x 2-4.3), stroke 1.25.
 */
export function Clipboard16(props: IconProps) {
  return (
    <svg {...svg([16, 16], props, 'I1731:255804;12909:604991;17992:18508')}>
      <path
        d="M10.7 3.35C11.33 3.35 11.64 3.35 11.9 3.42C12.29 3.53 12.55 3.79 12.62 4.18C12.65 4.4 12.65 4.69 12.65 5.25V11.9C12.65 12.6 12.65 12.95 12.51 13.22C12.39 13.45 12.2 13.64 11.97 13.76C11.7 13.9 11.35 13.9 10.65 13.9H5.35C4.65 13.9 4.3 13.9 4.03 13.76C3.8 13.64 3.61 13.45 3.49 13.22C3.35 12.95 3.35 12.6 3.35 11.9V5.25C3.35 4.69 3.35 4.4 3.38 4.18C3.45 3.79 3.71 3.53 4.1 3.42C4.36 3.35 4.67 3.35 5.3 3.35M6.07 4.3H9.93C10.2 4.3 10.33 4.3 10.43 4.25C10.52 4.2 10.6 4.13 10.64 4.04C10.7 3.94 10.7 3.8 10.7 3.53V2.77C10.7 2.5 10.7 2.37 10.64 2.27C10.6 2.18 10.52 2.1 10.43 2.06C10.33 2 10.2 2 9.93 2H6.07C5.8 2 5.67 2 5.57 2.06C5.48 2.1 5.4 2.18 5.36 2.27C5.3 2.37 5.3 2.5 5.3 2.77V3.53C5.3 3.8 5.3 3.94 5.36 4.04C5.4 4.13 5.48 4.2 5.57 4.25C5.67 4.3 5.8 4.3 6.07 4.3Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/** "Textarea input field" 16 (message bubble; I1731:255804;5865:363677;17992:18508): the comments button. */
export function Comment16(props: IconProps) {
  return (
    <svg {...svg([16, 16], props, 'I1731:255804;5865:363677;17992:18508')}>
      <path
        d="M2 5.2C2 4.08 2 3.52 2.22 3.09C2.41 2.72 2.72 2.41 3.09 2.22C3.52 2 4.08 2 5.2 2H10.8C11.92 2 12.48 2 12.91 2.22C13.28 2.41 13.59 2.72 13.78 3.09C14 3.52 14 4.08 14 5.2V8.8C14 9.92 14 10.48 13.78 10.91C13.59 11.28 13.28 11.59 12.91 11.78C12.48 12 11.92 12 10.8 12H9.12C8.71 12 8.5 12 8.3 12.04C8.12 12.08 7.95 12.14 7.79 12.22C7.61 12.31 7.45 12.44 7.12 12.7L5.53 13.97C5.26 14.2 5.12 14.31 5 14.31C4.9 14.31 4.8 14.26 4.74 14.18C4.67 14.09 4.67 13.91 4.67 13.56V12C4.05 12 3.74 12 3.48 11.93C2.79 11.75 2.25 11.21 2.07 10.52C2 10.26 2 9.95 2 9.33V5.2Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * cost_loader 14 (I1731:255804;5865:363673;17992:18390): "Loading circle" = a border-primary track (Background, 11 x 11
 * at 1,1; stroke set by .chh-ring__track) under the budget arc (Line, currentColor), stroke 1, from 12 o'clock clockwise.
 * `fraction` 0-1.
 */
export function CostRing14({ fraction, ...props }: IconProps & { fraction: number }) {
  const r = 5.5
  const c = 2 * Math.PI * r
  const f = Math.max(0, Math.min(1, fraction))
  return (
    <svg {...svg([14, 14], props, 'I1731:255804;5865:363673;17992:18390')}>
      <circle className="chh-ring__track" cx="7" cy="7" r={r} strokeWidth="1" />
      {f > 0 && (
        <circle
          cx="7" cy="7" r={r} stroke="currentColor" strokeWidth="1" strokeLinecap={f < 1 ? 'round' : undefined}
          strokeDasharray={`${c * f} ${c}`} transform="rotate(-90 7 7)"
        />
      )}
    </svg>
  )
}

/** lock-01 16: the general-access avatar while access is Restricted (I11991:746310;2533:410661;59936:35027). */
export function Lock16(props: IconProps) {
  return (
    <svg {...svg([16, 16], props)}>
      <path
        d="M11.33 6.67V5.33C11.33 3.49 9.84 2 8 2C6.16 2 4.67 3.49 4.67 5.33V6.67M8 9.67V11M5.87 14H10.13C11.25 14 11.81 14 12.24 13.78C12.62 13.59 12.92 13.28 13.12 12.91C13.33 12.48 13.33 11.92 13.33 10.8V9.87C13.33 8.75 13.33 8.19 13.12 7.76C12.92 7.38 12.62 7.08 12.24 6.88C11.81 6.67 11.25 6.67 10.13 6.67H5.87C4.75 6.67 4.19 6.67 3.76 6.88C3.38 7.08 3.08 7.38 2.88 7.76C2.67 8.19 2.67 8.75 2.67 9.87V10.8C2.67 11.92 2.67 12.48 2.88 12.91C3.08 13.28 3.38 13.59 3.76 13.78C4.19 14 4.75 14 5.87 14Z"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/** building-05 16: "Everyone at UnifyApps" in the general-access menu (share-artifact 03-04). */
export function Building16(props: IconProps) {
  return (
    <svg {...svg([16, 16], props)}>
      <path
        d="M8.67 7.33H11.87C12.61 7.33 12.99 7.33 13.27 7.48C13.52 7.61 13.72 7.81 13.85 8.06C14 8.34 14 8.72 14 9.47V14M8.67 14V4.13C8.67 3.39 8.67 3.01 8.52 2.73C8.39 2.48 8.19 2.28 7.94 2.15C7.66 2 7.28 2 6.53 2H4.13C3.39 2 3.01 2 2.73 2.15C2.48 2.28 2.28 2.48 2.15 2.73C2 3.01 2 3.39 2 4.13V14M14.67 14H1.33M4.33 4.67H6.33M4.33 7.33H6.33M4.33 10H6.33"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/** globe-01 16: "Anyone with the link". */
export function Globe16(props: IconProps) {
  return (
    <svg {...svg([16, 16], props)}>
      <path
        d="M1.33 8H14.67M1.33 8C1.33 11.68 4.32 14.67 8 14.67M1.33 8C1.33 4.32 4.32 1.33 8 1.33M14.67 8C14.67 11.68 11.68 14.67 8 14.67M14.67 8C14.67 4.32 11.68 1.33 8 1.33M8 1.33C9.67 3.16 10.62 5.53 10.67 8C10.62 10.47 9.67 12.84 8 14.67M8 1.33C6.33 3.16 5.38 5.53 5.33 8C5.38 10.47 6.33 12.84 8 14.67"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * chevron-down 14 with the 7 x 4 vector at 4,5 ("clock" swap I11991:746310;11933:740705): "Restricted ⌄" and the
 * member role buttons in the share modal.
 */
export function ChevronDown14Md(props: IconProps) {
  return (
    <svg {...svg([14, 14], props, 'I11991:746310;11933:740705')}>
      <path d="M4 5L7.5 9L11 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
