import { useMemo } from 'react'
import { useResolved } from '../../fixtures/drift'
import { PEOPLE, avatarOn, type PersonId } from '../../fixtures/people'
import { GENERAL_ACCESS, PEOPLE_SEARCH, roleOptions, type GeneralAccess } from '../../fixtures/share'
import { shareFor, type Scenario } from '../../fixtures/seeds'
import type { InviteRole, ShareGeneralAccess, ShareMemberRow, ShareModalProps, SharePerson } from './ShareModal'

// Adapter from the fixtures to ShareModal's data props, resolved against "As designed / With fixes".

/** The commit chat's colleagues, offered by the invite search after the people Figma lists (share-artifact 07). */
export const CHAT_COLLEAGUES: PersonId[] = ['matt-rivera', 'john-whitaker', 'grace-coleman']

/** Who the invite search offers by default: the people Figma lists, then the chat's colleagues. */
export const SHARE_DIRECTORY: PersonId[] = [...PEOPLE_SEARCH, ...CHAT_COLLEAGUES]
const NONE: { person: PersonId; role: InviteRole }[] = []

/**
 * Title, members, general access, its menu rows, the role menu rows and the people search directory for a share modal
 * on the chat or an artifact under a seed scenario (fixtures shareFor). Members beyond the seed (people invited in the
 * session) are appended from `extraMembers`.
 */
export function useShareModalData(
  target: 'chat' | 'artifact',
  scenario: Scenario,
  { extraMembers = NONE, directory = SHARE_DIRECTORY, access }: {
    extraMembers?: { person: PersonId; role: InviteRole }[]
    directory?: PersonId[]
    /** General access chosen in the session (overrides the seed). */
    access?: GeneralAccess
  } = {},
): Pick<ShareModalProps, 'title' | 'members' | 'access' | 'accessOptions' | 'roleOptions' | 'directory'> {
  const raw = useMemo(() => {
    const spec = shareFor(scenario, target)
    const a = access ? GENERAL_ACCESS[access] : null
    return {
      title: spec.title,
      members: [...spec.members, ...extraMembers].map((m, i) => ({ person: m.person, role: m.role, you: i === 0 })),
      access: a ? { id: access as GeneralAccess, label: a.label, description: a.selectedDescription } : spec.access,
      roleOptions: roleOptions(target),
    }
  }, [target, scenario, extraMembers, access])
  const r = useResolved(raw)
  // avatar fills per surface are Drift too (fix avatar-colour-per-person)
  const avatarSpecs = useMemo(() => Object.fromEntries(
    [...new Set([...r.members.map(m => m.person), ...directory])].map(id => [id, avatarOn(id as PersonId, 'share')]),
  ), [r.members, directory])
  const avatars = useResolved(avatarSpecs)
  return useMemo(() => {
    const personOf = (id: PersonId): SharePerson => {
      const p = PEOPLE[id]
      const a = avatars[id]
      return { id, name: a?.name ?? p.name, email: p.email, initial: a?.initial ?? p.initial, colour: a?.colour ?? p.colour }
    }
    const members: ShareMemberRow[] = r.members.map(m => ({ ...personOf(m.person as PersonId), role: m.role, you: m.you }))
    return {
      title: r.title,
      members,
      access: { id: r.access.id as ShareGeneralAccess, label: r.access.label, description: r.access.description },
      accessOptions: (Object.keys(GENERAL_ACCESS) as GeneralAccess[]).map(id => ({ id, label: GENERAL_ACCESS[id].label, description: GENERAL_ACCESS[id].menuDescription })),
      roleOptions: r.roleOptions.filter((o): o is { role: InviteRole; description: string } => o.role === 'Commenter' || o.role === 'Editor'),
      directory: directory.map(personOf),
    }
  }, [r, avatars, directory])
}
