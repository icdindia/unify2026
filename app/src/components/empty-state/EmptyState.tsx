import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../buttons/cx'
import createArtifact from '../../assets/forms/es-illustration-create-artifact.svg'
import noSharedChat from '../../assets/forms/es-illustration-no-shared-chat.svg'
import './empty-state.css'

/** "ES Empty State" set 7100:233066 (Level=Level 1 | Level 2, Type=Create). Illustrations: "_ES Illustration" 7100:232903. */
export const EMPTY_STATE_SET = '7100:233066'

/**
 * The illustrations these journeys use, exported from "_ES Illustration" (figma-console, 2026-10-08):
 *   create-artifact  Type=Create Artifact 7100:232905 (130.5×78; the export carries 4.8px of shadow on the left)
 *   no-shared-chat   Type=No Shared Chat as drawn in the comments panel (I8279:223418;70918:18800, 80×66)
 */
export const EMPTY_STATE_ART = {
  'create-artifact': { src: createArtifact, nodeId: '7100:232905' },
  'no-shared-chat': { src: noSharedChat, nodeId: '7100:232909' },
} as const

export type EmptyStateArt = keyof typeof EMPTY_STATE_ART

export type EmptyStateProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> & {
  /** Level 1: a page or panel (Spectral 30 / 18). Level 2: a side panel (Text xs Medium / Regular). */
  level?: 1 | 2
  art?: EmptyStateArt
  /** A custom illustration instead of `art`. */
  illustration?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Buttons row (Level 1): 16px apart, 16px under the text. */
  actions?: ReactNode
  /** Heading level for the title. Default h2 (Level 1) / h3 (Level 2). */
  headingLevel?: 2 | 3 | 4
  nodeId?: string
}

/** ES Empty State: illustration, title, description and optional actions, centred. */
export function EmptyState({
  level = 1, art = level === 1 ? 'create-artifact' : 'no-shared-chat', illustration, title, description, actions, headingLevel,
  nodeId = EMPTY_STATE_SET, className, ...rest
}: EmptyStateProps) {
  const H = (`h${headingLevel ?? (level === 1 ? 2 : 3)}`) as 'h2' | 'h3' | 'h4'
  return (
    <div className={cx('es', `es--l${level}`, className)} data-node-id={nodeId} {...rest}>
      <div className={cx('es__art', !illustration && `es__art--${art}`)} aria-hidden="true">
        {illustration ?? <img src={EMPTY_STATE_ART[art].src} alt="" data-node-id={EMPTY_STATE_ART[art].nodeId} />}
      </div>
      <div className="es__text">
        <H className="es__title">{title}</H>
        {description && <p className="es__desc">{description}</p>}
      </div>
      {actions && <div className="es__actions">{actions}</div>}
    </div>
  )
}
