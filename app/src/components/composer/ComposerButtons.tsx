import type { ComponentPropsWithRef, MouseEvent, ReactElement, ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { Tooltip } from '../overlays'
import { AiStarsIcon, ArrowUpIcon, QueueIcon, StopIcon } from './icons'
import type { ComposerTip, RenderTooltip } from './types'
import './composer-buttons.css'

/** The default tooltip: the overlay Tooltip, opened by hover / focus, or pinned open by a review `hover=` state. */
export const overlayTooltip = (trigger: ReactElement, tip: ComposerTip & { open?: boolean }) => (
  <Tooltip text={tip.label} shortcut={tip.shortcut} arrow={tip.arrow ?? 'bottom-center'} open={tip.open || undefined}>{trigger}</Tooltip>
)

/** Wraps a trigger in its tooltip: `renderTooltip`, the overlay Tooltip by default, or nothing for 'native' (see titleOf). */
export function withTip(trigger: ReactElement, tip: ComposerTip | undefined, renderTooltip?: RenderTooltip, open?: boolean): ReactNode {
  if (!tip || renderTooltip === 'native') return trigger
  return (renderTooltip ?? overlayTooltip)(trigger, { ...tip, open })
}

/** The native title fallback ('native'): "Add message to queue ↵". */
export const titleOf = (tip?: ComposerTip, renderTooltip?: RenderTooltip) =>
  tip && renderTooltip === 'native' ? [tip.label, tip.shortcut].filter(Boolean).join(' ') : undefined

export type RoundButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'disabled'> & {
  /** Icon-only, so the accessible name is required. */
  'aria-label': string
  icon: ReactNode
  /**
   * Shown as aria-disabled rather than the disabled attribute: the button keeps its focus and its tooltip (the queue
   * button's "Add message to queue" still explains itself while an upload runs) but ignores clicks.
   */
  disabled?: boolean
  tip?: ComposerTip
  renderTooltip?: RenderTooltip
  /** Review only: pin the hover look and open the tooltip (`hover=send|stop|queue`). */
  hover?: boolean
  nodeId?: string
}

/** Buttons/Button Neutral (set 9806:507020) / Size=md, Hierarchy=Primary, Icon=Only: the variant per state. */
const PRIMARY_ICON_MD = { default: '9806:507121', hover: '9806:507133', disabled: '9806:507125' }

/**
 * Buttons/Button Neutral / Size=md, Hierarchy=Primary, Icon=Only on radius-full: the dark 32px round button that is
 * Send, Stop and Queue (the instances in input-large 04 and 14 are 9806:507121). State=Default / Hover / Disabled.
 */
export function RoundButton({ icon, disabled, tip, renderTooltip, hover, nodeId, className, onClick, type = 'button', ...rest }: RoundButtonProps) {
  const button = (
    <button
      type={type}
      className={cx('cround', hover && 'is-hover', className)}
      aria-disabled={disabled || undefined}
      title={titleOf(tip, renderTooltip)}
      data-node-id={nodeId ?? (disabled ? PRIMARY_ICON_MD.disabled : hover ? PRIMARY_ICON_MD.hover : PRIMARY_ICON_MD.default)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (disabled) return e.preventDefault()
        onClick?.(e)
      }}
      {...rest}
    >
      {icon}
    </button>
  )
  return withTip(button, tip, renderTooltip, hover)
}

type Preset = Omit<RoundButtonProps, 'icon' | 'aria-label'> & { 'aria-label'?: string }

/** Send: arrow-up. Appears in place of Voice once the field has text (Text=One line and up). */
export const SendButton = (p: Preset) => <RoundButton aria-label="Send message" icon={<ArrowUpIcon />} {...p} />

/** Stop: stop-filled-2, while the Assistant answers (State=Generating). Tooltip "Stop generating" (queue-1 01). */
export const StopButton = (p: Preset) => (
  <RoundButton aria-label="Stop generating" tip={{ label: 'Stop generating' }} icon={<StopIcon />} {...p} />
)

/**
 * Queue: paragraph-wrap, left of Stop once there is text while the Assistant answers. Tooltip "Add message to queue"
 * with the ↵ chip (queue-1 02); disabled while an attachment uploads (queue-1 04).
 */
export const QueueButton = (p: Preset) => (
  <RoundButton aria-label="Add message to queue" tip={{ label: 'Add message to queue', shortcut: '↵' }} icon={<QueueIcon />} {...p} />
)

export type EnhanceButtonProps = {
  /** disabled: under 3 words, or already enhanced (enhance 01, 05). loading: the rewrite runs; the button is a Stop. */
  state?: 'default' | 'disabled' | 'loading'
  onEnhance?: () => void
  onStop?: () => void
  renderTooltip?: RenderTooltip
  hover?: boolean
}

/**
 * Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only (round) with the AI stars glyph: "Enhance with AI"
 * (enhance-prompt 01-05). Goes in the composer's `enhance` slot, after Model and a divider. While the rewrite runs it
 * shows stop-filled-2 and stops it. The flow itself (3-word rule, skeleton, restore on stop) is the screen's.
 */
export function EnhanceButton({ state = 'default', onEnhance, onStop, renderTooltip, hover }: EnhanceButtonProps) {
  const loading = state === 'loading'
  const tip: ComposerTip = { label: loading ? 'Stop enhancing' : 'Enhance with AI' }
  const button = (
    <button
      type="button"
      className={cx('cenhance', hover && 'is-hover')}
      aria-label={tip.label}
      aria-disabled={state === 'disabled' || undefined}
      title={titleOf(tip, renderTooltip)}
      data-node-id="10247:282468"
      onClick={() => {
        if (state === 'disabled') return
        if (loading) onStop?.()
        else onEnhance?.()
      }}
    >
      {loading ? <StopIcon /> : <AiStarsIcon />}
    </button>
  )
  return withTip(button, tip, renderTooltip, hover)
}

export type LimitPillProps = {
  /** Characters over the limit. */
  over: number
  renderTooltip?: RenderTooltip
  hover?: boolean
}

/**
 * Limit pill (State=Limit exceed, input-large 07 / 13): Pill squared / Size=sm, Color=Error "-2346", with the tooltip
 * "Your query is 2343 characters over the limit. Shorten it to continue" (Arrow=Bottom right). Both numbers come from
 * the same count here.
 */
export function LimitPill({ over, renderTooltip, hover }: LimitPillProps) {
  const tip: ComposerTip = { label: `Your query is ${over} characters over the limit. Shorten it to continue`, arrow: 'bottom-right' }
  const pill = (
    <span className={cx('climit', hover && 'is-hover')} tabIndex={0} title={titleOf(tip, renderTooltip)} data-node-id="I5220:204248;70604:101124">
      <span aria-hidden="true">-{over}</span>
      <span className="composer-sr">{tip.label}</span>
    </span>
  )
  return withTip(pill, tip, renderTooltip, hover)
}
