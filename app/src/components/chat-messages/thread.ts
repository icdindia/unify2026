import { useCallback } from 'react'
import { pick, useFixPredicate } from '../../fixtures/drift'
import { avatarOn, type PersonId, type Surface } from '../../fixtures/people'
import type { MessageAuthor, MessageRun, UserMessageData } from './types'

// Helpers for a screen that renders a chat thread (ChatView items) with these components.

/** A run of consecutive user messages from one sender, or any other thread item as it is. */
export type ThreadSegment<T> =
  | { kind: 'group'; key: string; from: string; own: boolean; messages: UserMessageData[] }
  | { kind: 'item'; key: string; item: T }

type UserItem = { kind: 'user'; id: string; from: string; body: readonly MessageRun[] }

const isUser = (i: { kind: string }): i is UserItem => i.kind === 'user'

/**
 * Folds consecutive `kind: 'user'` items from the same sender into one group (one name row, bubbles 32 apart); every
 * other item (system line, Assistant turn, starters) passes through. `me` is the signed-in person (ME in fixtures).
 */
export function groupThread<T extends { kind: string; id: string }>(items: readonly T[], me: string): ThreadSegment<T>[] {
  const out: ThreadSegment<T>[] = []
  for (const it of items) {
    const last = out[out.length - 1]
    if (isUser(it)) {
      const m: UserMessageData = { id: it.id, body: [...it.body] }
      if (last && last.kind === 'group' && last.from === it.from) last.messages.push(m)
      else out.push({ kind: 'group', key: it.id, from: it.from, own: it.from === me, messages: [m] })
    } else {
      out.push({ kind: 'item', key: it.id, item: it })
    }
  }
  return out
}

/** React: a person as a surface draws them (name, letter, fill), with the frame's drift resolved by the fixes switch. */
export function useAuthorOf(): (id: PersonId, surface?: Surface) => MessageAuthor {
  const applies = useFixPredicate()
  return useCallback((id: PersonId, surface: Surface = 'message') => {
    const a = avatarOn(id, surface)
    const name = pick(a.name, applies)
    return { name, initial: a.initial, colour: pick(a.colour, applies) }
  }, [applies])
}
