import './scrollbar.css'

/** "Scroll bar" sets: md 9893:411267 (menus), sm 89:89910 (artifact canvases and panels). */
export const SCROLLBAR_SETS = { md: '9893:411267', sm: '89:89910' } as const

/**
 * Class names for a scrolling element styled with the DS scroll bar (overflow: auto included).
 *   <div className={scrollbar('md')}>…</div>
 */
export const scrollbar = (size: 'sm' | 'md' = 'md', opts: { bg?: boolean } = {}) =>
  `scroll-${size}${opts.bg ? ' scroll-bg' : ''}`
