import type { NavMode } from './model'
import './logo.css'

// The UnifyApps mark is a spiral of 22 nested pieces. The light version exports as one ~180KB SVG,
// so both tones use the 22 pieces from the file, each placed at its Figma offset (see logo.css).
const darkPieces = import.meta.glob<string>('../../assets/nav/logo/logo-*.svg', { eager: true, import: 'default' })
const lightPieces = import.meta.glob<string>('../../assets/nav/logo/lt-logo-*.svg', { eager: true, import: 'default' })

const inOrder = (pieces: Record<string, string>) => Object.keys(pieces).sort().map(path => pieces[path])
const PIECES: Record<NavMode, string[]> = { dark: inOrder(darkPieces), light: inOrder(lightPieces) }

/** The 32x32 logo spiral. Decorative: the wordmark (or the button around it) carries the name. */
export function LogoSpiral({ tone }: { tone: NavMode }) {
  return (
    <span className="logo-g" aria-hidden="true">
      {PIECES[tone].map((src, i) => (
        <img key={i} alt="" src={src} className={`lg lg${String(i).padStart(2, '0')}`} />
      ))}
    </span>
  )
}
