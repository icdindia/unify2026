import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import mark from '../../assets/agent/eb-assistant-ai.svg'
import './assistant-mark.css'

/**
 * Figma component "EB-Assistant/AI" 3506:216405: the 70x70 ring of 54 #112d06 dots above "Hello Roger" on the landing
 * page (instance 3494:215623 in chat-artifact 01, 1707:136008, at x 713 y 200).
 *
 * It is not the rail logo: LogoSpiral (shell/nav) is the 32px UnifyApps spiral (Component 2, 22 pieces of cream dots
 * at 25-100% opacity), a different artwork. This mark's dots are all solid #112d06 and shrink towards the open side.
 */
export const ASSISTANT_MARK_COMPONENT = '3506:216405'

export type AssistantMarkProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Figma node of this instance. Default: the component. */
  nodeId?: string
}

/** The landing page's Assistant mark. Decorative (the greeting under it carries the meaning); still, per Q23. */
export function AssistantMark({ nodeId = ASSISTANT_MARK_COMPONENT, className, ...rest }: AssistantMarkProps) {
  return (
    <span className={cx('assistant-mark', className)} data-node-id={nodeId} aria-hidden="true" {...rest}>
      <img className="assistant-mark__img" src={mark} alt="" width={70} height={70} />
    </span>
  )
}
