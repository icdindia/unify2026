import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import { CostRing14 } from './icons'
import { useChatChromeFix } from './fixes'

/** Budget state of a chat (fixtures/cost.ts BudgetState): within below $2, approaching from $2, over from $5 (Q33). */
export type CostRingState = 'within' | 'approaching' | 'over'

/**
 * How much of the ring each state draws, as the frames do (the ring is a state glyph, not a gauge): within = the dark
 * partial arc of cost 01 / 04, approaching = the orange two-thirds ring of chat-artifact 03-20 and cost 02 / 05
 * (0° to about 235° clockwise, measured), over = the full red ring of cost 03 / 06.
 */
export const COST_RING_FRACTION: Record<CostRingState, number> = { within: 0.375, approaching: 0.65, over: 1 }

export type CostPillProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** "$1.23" */
  label: string
  /** The chat's budget state (costFor(...).state). */
  state: CostRingState
  /**
   * The ring the frame draws when it disagrees with `state` (fix header-cost-ring-state): chat-artifact draws "$1.23"
   * with the 'approaching' ring although $1.23 is within budget. Rendered while fixes are off.
   */
  ringAsDrawn?: CostRingState
  /** Ring fill 0-1; default COST_RING_FRACTION[ring state]. */
  fraction?: number
  /** The cost popover is open (keeps the hover fill, aria-expanded). */
  open?: boolean
  nodeId?: string
}

/**
 * Cost pill of the chat header: Buttons/Button Neutral sm tertiary (I1731:255804;5865:363673), padding 6 8 4 8, the
 * 14px "cost_loader" ring and the amount in Spectral SemiBold 14/18. Hover (cost 04-06): bg-tertiary.
 * It is a button: the cost popover (CostPopover, inventory row 37) opens on hover and pins on click; wire it through
 * onClick / onPointerEnter / onPointerLeave and give it aria-controls when the popover is open.
 */
export function CostPill({ label, state, ringAsDrawn, fraction, open, nodeId = 'I1731:255804;5865:363673', className, type = 'button', ...rest }: CostPillProps) {
  const fixed = useChatChromeFix('header-cost-ring-state')
  const ring = fixed || !ringAsDrawn ? state : ringAsDrawn
  return (
    <button
      type={type}
      className={cx('chh-cost', `chh-cost--${ring}`, className)}
      aria-expanded={open}
      aria-label={`Cost of this chat: ${label}`}
      data-node-id={nodeId}
      {...rest}
    >
      <CostRing14 className="chh-cost__ring" fraction={fraction ?? COST_RING_FRACTION[ring]} />
      <span className="chh-cost__t">{label}</span>
    </button>
  )
}
