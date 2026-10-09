import type { ComponentPropsWithRef } from 'react'
import { COT_LABELS } from '../../fixtures/copy'
import { useThinkingLoop } from '../../playback/useThinkingLoop'
import { cx } from '../buttons/cx'
import { AgentAvatar } from './AgentAvatar'
import './thinking-indicator.css'

/** Figma component set "thinking state" 484:117565 (State=1 <-> State=2 every 0.8s, the Q24 default loop). */
export const THINKING_STATE_SET = '484:117565'

export type ThinkingIndicatorProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** The label. Default "Thinking..." (Agent COT / Type=Step 1); Step 2 passes COT_LABELS.consulting. */
  label?: string
  /** `round` (default, Q24): the #112d06 avatar with the white dot grid. `bare`: the animated dot grid (glyph=bare, thinking 01). */
  glyph?: 'round' | 'bare'
  /** Hold the shimmer on its first frame (an `at=` render for diffs). Reduced motion holds it too. */
  still?: boolean
  /** Figma node of this row. Default: the thinking-state set. */
  nodeId?: string
}

/**
 * The Assistant's "Thinking..." row: avatar, 8px, then the label (4px in) with the light band of `thinking state`
 * sweeping across it every 0.8s. A live region, so the label is announced once when the row appears or changes.
 */
export function ThinkingIndicator({
  label = COT_LABELS.thinking, glyph = 'round', still = false, nodeId = THINKING_STATE_SET, className, ...rest
}: ThinkingIndicatorProps) {
  const frame = useThinkingLoop(true, still)
  return (
    <div className={cx('agent-thinking', className)} role="status" data-node-id={nodeId} {...rest}>
      <AgentAvatar tone={glyph === 'bare' ? 'bare' : 'thinking'} still={still} />
      <span className="agent-thinking__label" data-frame={frame}>{label}</span>
    </div>
  )
}
