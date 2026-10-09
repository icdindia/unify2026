import type { Resolved } from '../../fixtures/drift'
import type { Answer, Block, Citation, InlineRun } from '../../fixtures/script'
import type { AvatarColour } from '../avatar/Avatar'

// The message components take fixture data with every Drift resolved (useResolved / chatViewAt), so the review bar's
// "As designed / With fixes" switch has already picked each value.

/** One run of a message: text, a SemiBold run, an "@Name" mention or an inline citation pill. */
export type MessageRun = Resolved<InlineRun>
export type ResolvedCitation = Resolved<Citation>
export type ResolvedAnswer = Resolved<Answer>
export type ResolvedBlock = Resolved<Block>

/** Who wrote a message, as the 20px avatar and the name row draw them. */
export type MessageAuthor = {
  /** Shown in the name row and used as the avatar's accessible name. */
  name: string
  /** The avatar letter when it is not the name's first letter. */
  initial?: string
  /** Avatar fill (Colour=Brand Solid with the fill overridden per person: `avatarOn(id, 'message').colour`). */
  colour?: AvatarColour
}

/** One sent message (a "Message Body" bubble). */
export type UserMessageData = {
  id: string
  body: MessageRun[]
}

export const isBold = (r: MessageRun): r is Extract<MessageRun, { b: unknown }> => typeof r === 'object' && r !== null && 'b' in r
export const isMention = (r: MessageRun): r is Extract<MessageRun, { mention: unknown }> => typeof r === 'object' && r !== null && 'mention' in r
export const isCite = (r: MessageRun): r is Extract<MessageRun, { cite: unknown }> => typeof r === 'object' && r !== null && 'cite' in r

/** The runs as plain text (what Copy puts on the clipboard): mentions keep their "@", citation pills are dropped. */
export function plainText(runs: readonly MessageRun[]): string {
  return runs.map(r => (typeof r === 'string' ? r : isBold(r) ? r.b : isMention(r) ? `@${r.label}` : '')).join('').replace(/\s+/g, ' ').trim()
}

/** An answer's text as plain text, paragraph by paragraph (bullets as "- " lines). */
export function answerText(answer: ResolvedAnswer): string {
  const out: string[] = []
  for (const b of answer.blocks) {
    if (b.kind === 'p') out.push(plainText(b.inl))
    else if (b.kind === 'ul') b.items.forEach(item => out.push(`- ${plainText(item)}`))
    else if (b.kind === 'headline' || b.kind === 'subtitle') out.push(b.text)
  }
  return out.filter(Boolean).join('\n\n')
}

/** Writes text to the clipboard; resolves false when the browser refuses (insecure context, no permission). */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to the textarea route */ }
  const had = document.activeElement as HTMLElement | null
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    had?.focus?.({ preventScroll: true })
    return ok
  } catch {
    return false
  }
}
