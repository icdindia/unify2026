import { useMemo } from 'react'
import { useResolved } from '../../fixtures/drift'
import { ME, avatarOn, type PersonId } from '../../fixtures/people'
import { CHAT_ACCESS, type Role } from '../../fixtures/share'
import type { AccessPerson } from './AccessPopover'
import type { ChatHeaderPerson } from './ChatHeader'

// Adapters from the fixtures to the header's props, resolved against "As designed / With fixes". Hooks: call them in
// the screen, pass the result straight in.

/** The avatar stack: each person's letter, fill and name as the header draws them (fix avatar-colour-per-person). */
export function useHeaderPeople(ids: readonly PersonId[]): ChatHeaderPerson[] {
  const specs = useMemo(() => ids.map(id => ({ id, ...avatarOn(id, 'header') })), [ids])
  const resolved = useResolved(specs)
  return useMemo(() => resolved.map(s => ({ id: s.id, name: s.name, initial: s.initial, colour: s.colour })), [resolved])
}

/**
 * People with access (chat-artifact 15): CHAT_ACCESS by default (Roger owner, Matt / John / Grace editors, Natali viewer,
 * and the two hidden rows of 8222:492569), names as the access list spells them ("John Whitake" as designed).
 * `limit` 5 reproduces the frame, which shows five rows.
 */
export function useAccessPeople(entries: readonly { person: PersonId; role: Role }[] = CHAT_ACCESS, limit = 5): AccessPerson[] {
  const specs = useMemo(
    () => entries.slice(0, limit).map(e => ({ id: e.person, role: e.role, you: e.person === ME, ...avatarOn(e.person, 'access') })),
    [entries, limit],
  )
  const resolved = useResolved(specs)
  return useMemo(() => resolved.map(s => ({ id: s.id, name: s.name, initial: s.initial, colour: s.colour, role: s.role, you: s.you })), [resolved])
}
