import { useEffect, useState } from 'react'
import { useMediaQuery } from '../shell/useMediaQuery'
import { FIGMA_TIMING } from './timing'

/**
 * The thinking glyph's two frames (`thinking state` 484:117565 / `_thinking state` 3518:217901: State=1 <-> State=2
 * every 0.8s). Returns 1 or 2. Holds on 1 when inactive, when `still` (an `at=` render for diffs), and for people who
 * prefer reduced motion.
 */
export function useThinkingLoop(active: boolean, still = false): 1 | 2 {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const run = active && !still && !reduced
  const [frame, setFrame] = useState<1 | 2>(1)
  useEffect(() => {
    if (!run) return
    const t = window.setInterval(() => setFrame(f => (f === 1 ? 2 : 1)), FIGMA_TIMING.thinkingLoopMs)
    return () => { window.clearInterval(t); setFrame(1) }
  }, [run])
  return run ? frame : 1
}
