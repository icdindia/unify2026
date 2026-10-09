// Glyphs of the Acme dashboard (sample artifact content), redrawn from the flat image of 1809:488590 at its 1:1 size.
// Decorative: every one sits beside text that names it. Colours come from currentColor (set in acme-dashboard.css).
import type { SVGProps } from 'react'

type P = Omit<SVGProps<SVGSVGElement>, 'children'>
const s = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const
const f = { fill: 'currentColor', 'aria-hidden': true, focusable: false } as const

/** The header's back chevron: an 8 x 16 glyph (image x 24-32, y 34-50). */
export const ChevronLeft = (p: P) => <svg width="10" height="18" viewBox="0 0 10 18" strokeWidth={1.5} {...s} {...p}><path d="M8.5 1.5L1.5 9l7 7.5" /></svg>
export const ChevronLeftSm = (p: P) => <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.5} {...s} {...p}><path d="M10 3.5L5.5 8l4.5 4.5" /></svg>
export const ChevronRightSm = (p: P) => <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.5} {...s} {...p}><path d="M6 3.5L10.5 8 6 12.5" /></svg>
export const ArrowUpRight = (p: P) => <svg width="10" height="10" viewBox="0 0 10 10" strokeWidth={1.2} {...s} {...p}><path d="M2.5 7.5l5-5M3.5 2.5h4v4" /></svg>
export const ArrowDownRight = (p: P) => <svg width="10" height="10" viewBox="0 0 10 10" strokeWidth={1.2} {...s} {...p}><path d="M2.5 2.5l5 5M7.5 3.5v4h-4" /></svg>

/** The Acme logo: a blue disc with two slanted white bars. */
export const AcmeLogo = (p: P) => (
  <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden focusable={false} {...p}>
    <circle cx="15" cy="15" r="15" fill="currentColor" />
    <path d="M10.2 10.6h11l-1.3 3H9.9a1.2 1.2 0 0 1-1.1-1.6l.3-.6a1.2 1.2 0 0 1 1.1-.8Z" fill="#fff" />
    <path d="M10 15.6h8.4l-1.3 3H9.6l-1.4 3.2H6.9l2-5a1.3 1.3 0 0 1 1.1-1.2Z" fill="#fff" />
  </svg>
)

/** The "30 • AT RISK" pill's gauge. */
export const Gauge = (p: P) => (
  <svg width="12" height="12" viewBox="0 0 12 12" {...f} {...p}>
    <path d="M6 2a5 5 0 0 0-5 5c0 1 .3 1.9.8 2.7.2.2.4.3.7.3h7c.3 0 .5-.1.7-.3.5-.8.8-1.7.8-2.7a5 5 0 0 0-5-5Zm.6 5.6a.9.9 0 1 1-1.2-1.3L8 4.5l-1.4 3.1Z" />
  </svg>
)

/** KPI disc glyphs (white on the periwinkle disc). */
export const KpiGlyph = ({ kind, ...p }: P & { kind: 'dollar' | 'chart' | 'star' | 'percent' | 'clock' | 'user' }) => {
  switch (kind) {
    case 'dollar': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><circle cx="6" cy="6" r="5" fill="#fff" fillOpacity=".55" /><path d="M7.3 4.6c-.2-.5-.7-.8-1.3-.8-.8 0-1.3.4-1.3 1 0 1.3 2.7.7 2.7 2 0 .6-.6 1.1-1.4 1.1-.6 0-1.2-.3-1.4-.8M6 3.2v.6m0 4.4v.6" stroke="#fff" strokeWidth=".9" strokeLinecap="round" fill="none" /></svg>
    case 'chart': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><rect x="1.5" y="1.5" width="9" height="9" rx="2" fill="#fff" fillOpacity=".55" /><path d="M3.5 8l1.8-2 1.4 1.2L8.6 4.5" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    case 'star': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><path d="M6 1.3l1.4 2.9 3.2.4-2.3 2.2.6 3.2L6 8.5 3.1 10l.6-3.2-2.3-2.2 3.2-.4L6 1.3Z" fill="#fff" /></svg>
    case 'percent': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><circle cx="6" cy="6" r="5" fill="#fff" fillOpacity=".55" /><path d="M8 4L4 8" stroke="#fff" strokeWidth="1" strokeLinecap="round" /><circle cx="4.3" cy="4.3" r=".8" fill="#fff" /><circle cx="7.7" cy="7.7" r=".8" fill="#fff" /></svg>
    case 'clock': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><circle cx="6" cy="6" r="5" fill="#fff" fillOpacity=".55" /><path d="M6 3.5V6l1.6 1" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" /></svg>
    case 'user': return <svg width="12" height="12" viewBox="0 0 12 12" {...p} aria-hidden focusable={false}><circle cx="6" cy="4.2" r="2.2" fill="#fff" /><path d="M2 10.5c.4-2 2-3.2 4-3.2s3.6 1.2 4 3.2" fill="#fff" /></svg>
  }
}

/** Tab glyphs: Health (heart + pulse), Journey (map), Strategy (lines + bolt), Intelligence (sparkle), Actions (cog). */
export const TabGlyph = ({ tab, ...p }: P & { tab: 'health' | 'journey' | 'strategy' | 'intelligence' | 'actions' }) => {
  switch (tab) {
    case 'health': return <svg width="16" height="16" viewBox="0 0 16 16" {...f} {...p}><path d="M8 14.2S1.5 10.3 1.5 5.8A3.3 3.3 0 0 1 8 4.1a3.3 3.3 0 0 1 6.5 1.7C14.5 10.3 8 14.2 8 14.2Z" /><path d="M3.5 8h2l1.2-1.8 1.6 3 1.2-1.7h3" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    case 'journey': return <svg width="16" height="16" viewBox="0 0 16 16" {...f} {...p}><path d="M1.5 3.6l4-1.6v11l-4 1.6v-11ZM6.6 2l2.8 1.4v11L6.6 13V2ZM10.5 3.4l4-1.4v11l-4 1.4v-11Z" /></svg>
    case 'strategy': return <svg width="16" height="16" viewBox="0 0 16 16" {...p} aria-hidden focusable={false}><path d="M1.5 4h5M1.5 8h3.5M1.5 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M10.6 1.5L7.5 8.6h3l-1 5.9 4.6-8h-3.2l1.3-5Z" fill="currentColor" /></svg>
    case 'intelligence': return <svg width="16" height="16" viewBox="0 0 16 16" {...f} {...p}><path d="M8 1c.5 3.6 2.4 5.5 7 7-4.6 1.5-6.5 3.4-7 7-.5-3.6-2.4-5.5-7-7 4.6-1.5 6.5-3.4 7-7Z" /></svg>
    case 'actions': return <svg width="16" height="16" viewBox="0 0 16 16" {...f} {...p}><path d="M6.6 1.5h2.8l.4 2 1.6.9 1.9-.7 1.4 2.4-1.5 1.3v1.8l1.5 1.3-1.4 2.4-1.9-.7-1.6.9-.4 2H6.6l-.4-2-1.6-.9-1.9.7-1.4-2.4 1.5-1.3V7.4L1.3 6.1l1.4-2.4 1.9.7 1.6-.9.4-2Z" /></svg>
  }
}

export const ThumbUp = (p: P) => <svg width="14" height="14" viewBox="0 0 14 14" {...f} {...p}><path d="M1.5 6.2h2.2v6.3H1.5zM5 12.5h5.4c.8 0 1.4-.5 1.6-1.2l.9-3.6c.2-.9-.4-1.7-1.3-1.7H8.6l.4-2.4c.1-.8-.5-1.6-1.3-1.6L5 6v6.5Z" /></svg>
export const ThumbDown = (p: P) => <ThumbUp {...p} style={{ transform: 'rotate(180deg)', ...p.style }} />

/** Next Action sparkle. */
export const Sparkle = (p: P) => <svg width="14" height="14" viewBox="0 0 14 14" {...f} {...p}><path d="M7 .8c.4 3.1 2.1 4.8 6.2 6.2C9.1 8.4 7.4 10.1 7 13.2 6.6 10.1 4.9 8.4.8 7 4.9 5.6 6.6 3.9 7 .8Z" /></svg>
