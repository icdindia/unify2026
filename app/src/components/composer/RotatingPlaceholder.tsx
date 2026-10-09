import { useEffect, useState } from 'react'
import { cx } from '../buttons/cx'
import './rotating-placeholder.css'

/** The four hints of the landing composer, in the order _Text animate Desktop shows them (instance copy). */
export const COMPOSER_HINTS = [
  'Use /skill to give your agent a capability.',
  'Use @name to bring an agent or colleague here.',
  'Use + to connect the necessary apps.',
  'Describe the outcome — I will build the steps.',
]

/** _Text animate Desktop (5546:212948) timing: each hint holds 4.5s, the field stays blank 0.2s, every change is a 300ms smart animate. */
export const HINT_TIMING = { hold: 4500, gap: 200, fade: 300 }

type Props = {
  hints: string[]
  /** Freeze on one hint (review frames, the gallery). */
  index?: number
  className?: string
}

/**
 * The rotating placeholder of the empty composer ("Animated text in input box", input-large 01): prop=01 → Break1 →
 * prop=02 → … → Break4 → prop=01. Each hint fades in (300ms ease-in-out), holds 4.5s, fades out, and the field stays
 * empty for 0.2s before the next. Decorative: the field's accessible name stays the composer label, and the first
 * hint is given to assistive tech as the field's description by the composer.
 * With reduced motion the hints still change, without the fade.
 */
export function RotatingPlaceholder({ hints, index, className }: Props) {
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(true)
  const frozen = index !== undefined || hints.length < 2

  useEffect(() => {
    if (frozen) return
    let t: number
    if (shown) {
      // fade in (300) + hold (4.5s), then start the fade out
      t = window.setTimeout(() => setShown(false), HINT_TIMING.fade + HINT_TIMING.hold)
    } else {
      // fade out (300) + the 0.2s break, then the next hint fades in
      t = window.setTimeout(() => {
        setI(n => (n + 1) % hints.length)
        setShown(true)
      }, HINT_TIMING.fade + HINT_TIMING.gap)
    }
    return () => window.clearTimeout(t)
  }, [shown, frozen, hints.length])

  const current = index ?? i
  return (
    <span className={cx('crot', className)} aria-hidden="true" data-node-id="5546:212948">
      {hints.map((h, n) => (
        <span key={h + n} className={cx('crot__hint', n === current % hints.length && (frozen || shown) && 'is-on')}>{h}</span>
      ))}
    </span>
  )
}
