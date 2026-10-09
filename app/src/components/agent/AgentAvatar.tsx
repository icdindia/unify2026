import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import thinkingDots from '../../assets/agent/thinking-dots.gif'
import { AiAvatarGlyph, DotRing } from './icons'
import './agent-avatar.css'

/** Figma component set "Agent_Avatar" 5129:473331. The chat rows use Size=xs, Type=Custom resized to a 20px circle. */
export const AGENT_AVATAR_SET = '5129:473331'

/**
 * Which avatar the Assistant row shows:
 * - `thinking`: the round #112d06 avatar with the white dot grid, while a turn runs (chat-artifact 04-07, 14; the
 *   instance fill of Agent_Avatar in those frames, Q24 default).
 * - `done`: the same avatar in #364a3b once the turn has finished (Agent COT / Type=Complete 2, chat-artifact 08).
 * - `spinner`: the ring of eight dots that ticks round while the answer still streams in (input-large 24).
 * - `bare`: the animated dot grid with no circle, the GIF of Agent COT / Type=Step 1 (thinking 01, `glyph=bare`).
 */
export type AgentAvatarTone = 'thinking' | 'done' | 'spinner' | 'bare'

const NODE: Record<AgentAvatarTone, string> = {
  thinking: '5129:473347', // Agent_Avatar Size=xs, Type=Custom, fill overridden to #112d06 (1713:246600)
  done: '5129:473347', // the same, fill #364a3b (Agent COT / Type=Complete 2, 8863:219519)
  spinner: '7534:295000', // Agent COT (older set 7534:294991) / Type=Complete 1, its ".variants" dot ring
  bare: '8863:218613', // "icon animation2 84px 1" in Agent COT / Type=Step 1
}

export type AgentAvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  tone?: AgentAvatarTone
  /** Hold every animation (an `at=` render for diffs). The GIF of `bare` cannot be paused, so it is swapped for its first frame's look: the static grid. */
  still?: boolean
}

/** The Assistant's 20px avatar in a chat row. Decorative: the row beside it carries the text. */
export function AgentAvatar({ tone = 'done', still = false, className, ...rest }: AgentAvatarProps) {
  return (
    <span className={cx('agent-avatar', `agent-avatar--${tone}`, still && 'is-still', className)} data-node-id={NODE[tone]} aria-hidden="true" {...rest}>
      {tone === 'thinking' || tone === 'done' ? <AiAvatarGlyph className="agent-avatar__glyph" /> :
        tone === 'spinner' ? <DotRing className="agent-avatar__ring" /> :
          <>
            <AiAvatarGlyph className="agent-avatar__still" />
            {!still && <img className="agent-avatar__gif" src={thinkingDots} alt="" />}
          </>}
    </span>
  )
}
