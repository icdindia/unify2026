import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { Dot, type DotColour } from './Dot'
import './pill.css'

type SpanProps = Omit<ComponentPropsWithRef<'span'>, 'children'>

/** "Pill solid" set 1421:317764. */
export const PILL_SOLID_SET = '1421:317764'
/** "Pill squared" sets: 9806:508154 (xxs / xs, the access list role and the memory "New") and 19:19293 (sm). */
export const PILL_SQUARED_SETS = { xxs: '9806:508154', xs: '9806:508154', sm: '19:19293' } as const
/** "Code Pill" set 13750:263005. */
export const CODE_PILL_SET = '13750:263005'

export type PillProps = SpanProps & {
  children: ReactNode
  /** Color axis. The journeys only use Gray (queue count, header badges). Spelled `colour` like Avatar and Dot. */
  colour?: 'gray'
  nodeId?: string
}

/**
 * Pill solid / Size=xxs, Type=Pill color, Color=Gray: a 16px count chip, utility-gray-600 fill, utility-gray-50 Text
 * xxs/Medium, 2 / 4 padding, radius 4. Give it an aria-label when the number alone does not say what it counts.
 */
export function Pill({ children, colour = 'gray', nodeId = PILL_SOLID_SET, className, ...rest }: PillProps) {
  return <span className={cx('pill-solid', `pill-solid--${colour}`, className)} data-node-id={nodeId} {...rest}>{children}</span>
}

export type PillSquaredProps = SpanProps & {
  children: ReactNode
  /** xxs 16 (2 / 4, Text xxs) · xs 20 (2 / 6, Text xs) · sm 24 (4 / 8, Text xs). */
  size?: 'xxs' | 'xs' | 'sm'
  /** Type axis: Pill color (tinted fill) or Pill Clear (no fill; the sm one draws a border-secondary ring). */
  type?: 'color' | 'clear'
  colour?: 'gray' | 'success'
  /** Icon=Dot: leading 8px dot (the sm "● Live" chip). */
  dot?: DotColour
  /** JetBrains Mono, as the access list's trailing role ("Owner", "Editor") is set. */
  mono?: boolean
  nodeId?: string
}

/** Pill squared: role badges, the memory "New" tag, the dropdown item badge. */
export function PillSquared({
  children, size = 'xxs', type = 'color', colour = 'gray', dot, mono, nodeId, className, ...rest
}: PillSquaredProps) {
  return (
    <span
      className={cx('pill-sq', `pill-sq--${size}`, `pill-sq--${type}`, `pill-sq--${colour}`, dot && 'pill-sq--dot', mono && 'pill-sq--mono', className)}
      data-node-id={nodeId ?? PILL_SQUARED_SETS[size]}
      {...rest}
    >
      {dot && <Dot size="sm" colour={dot} />}
      {children}
    </span>
  )
}

export type CodePillProps = SpanProps & {
  children: ReactNode
  /**
   * xs is the set's own variant (20px: 4 / 6 padding). The files panel draws its instance at 16px with 2 / 4 padding
   * (13722:383349 "Artifacts 3"), offered here as 'xxs'.
   */
  size?: 'xs' | 'xxs'
  nodeId?: string
}

/** Code Pill / Color=Gray: utility-gray-100 fill, text-secondary JetBrains Mono 11/12, radius 4 (counts, file types). */
export function CodePill({ children, size = 'xs', nodeId = CODE_PILL_SET, className, ...rest }: CodePillProps) {
  return <span className={cx('code-pill', `code-pill--${size}`, className)} data-node-id={nodeId} {...rest}>{children}</span>
}
