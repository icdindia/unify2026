import type { ReactNode } from 'react'
import { cx } from '../buttons/cx'
import type { ComposerToken, ComposerTokenKind, RenderToken } from './types'
import './composer-token.css'

// Tokens in the composer text. The text stays a plain string; a token is a run of it that matches a known skill
// ("/" + name) or person ("@" + name) at a word start. The composer draws them through a mirror layer under a
// transparent-text textarea, so they look like the Figma runs while the field stays a native, accessible textarea.

export const TRIGGER_CHAR: Record<ComposerTokenKind, '/' | '@'> = { skill: '/', mention: '@' }

const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c)
const isBoundary = (c: string | undefined) => c === undefined || /[\s.,;:!?)\]}'"…—-]/.test(c)

/** Every known token in `text`, left to right, longest name first where two could start at the same place. */
export function findTokens(text: string, skills: readonly string[] = [], mentions: readonly string[] = []): ComposerToken[] {
  if (!text || (!skills.length && !mentions.length)) return []
  const names = [
    ...skills.map(label => ({ kind: 'skill' as const, label })),
    ...mentions.map(label => ({ kind: 'mention' as const, label })),
  ].sort((a, b) => b.label.length - a.label.length)
  const found: ComposerToken[] = []
  const taken = new Uint8Array(text.length)
  for (const { kind, label } of names) {
    const needle = TRIGGER_CHAR[kind] + label
    let from = 0
    for (;;) {
      const start = text.indexOf(needle, from)
      if (start < 0) break
      const end = start + needle.length
      from = start + 1
      if (!isSpace(text[start - 1]) || !isBoundary(text[end])) continue
      if (taken.subarray(start, end).some(Boolean)) continue
      taken.fill(1, start, end)
      found.push({ kind, label, start, end })
    }
  }
  return found.sort((a, b) => a.start - b.start)
}

/**
 * The trigger the caret sits in: an "@" or "/" at a word start, followed by up to 40 characters with no line break,
 * that is not already a finished token. Returns its kind, the query typed after it, and where it starts.
 */
export function findTrigger(text: string, caret: number, tokens: ComposerToken[]): { kind: ComposerTokenKind; start: number; query: string } | null {
  for (let i = caret - 1; i >= 0 && caret - i <= 41; i--) {
    const c = text[i]
    if (c === '\n') return null
    if (tokens.some(t => i >= t.start && i < t.end)) return null // ran into a finished token
    if ((c === '@' || c === '/') && isSpace(text[i - 1])) {
      const query = text.slice(i + 1, caret)
      if (/\s{2}/.test(query) || /^\s/.test(query)) return null
      return { kind: c === '@' ? 'mention' : 'skill', start: i, query }
    }
  }
  return null
}

type TokenProps = { token: ComposerToken; slashBlue?: boolean }

/**
 * Response_Desktop full / in line Skills (7159:535660): "/" + the skill name at 15/26 in steel-blue-400; the landing
 * frames draw the "/" in utility-blue-dark-600 (see the composer-skill-slash-colour fix).
 * The mention run of collab-chat 05 is the same: "@" + the name in steel-blue-400.
 */
export function TokenRun({ token, slashBlue }: TokenProps) {
  return (
    <span className={cx('ctoken', `ctoken--${token.kind}`)} data-node-id={token.kind === 'skill' ? '7159:535660' : undefined}>
      <span className={cx('ctoken__mark', slashBlue && token.kind === 'skill' && 'ctoken__mark--blue')}>{TRIGGER_CHAR[token.kind]}</span>
      {token.label}
    </span>
  )
}

/** The text cut into plain runs and token nodes, for the mirror layer. */
export function renderWithTokens(text: string, tokens: ComposerToken[], render: RenderToken): ReactNode[] {
  const out: ReactNode[] = []
  let at = 0
  tokens.forEach((t, i) => {
    if (t.start > at) out.push(text.slice(at, t.start))
    out.push(<span key={`t${i}`} className="ctoken-slot">{render(t, text.slice(t.start, t.end))}</span>)
    at = t.end
  })
  if (at < text.length) out.push(text.slice(at))
  // a trailing line break needs a character after it, or the mirror is one line shorter than the field
  if (text.endsWith('\n')) out.push('​')
  return out
}
