import { d, type Drift, type Text } from './drift'
import { selfOn, type GroupId, type PersonId } from './people'

// Sharing, access and publishing (share-artifact, add-users, publish-artifact, access popovers).
// Read from 1819:316164-316531, 12025:773344-786818, 1768:356654, 8222:492569, 11905:590614, 11919:591369.

export type Role = 'Owner' | 'Editor' | 'Commenter' | 'Viewer'

/** People with access to the commit chat (access popover 1768:356654; scrolls to Drew Cano and Orlando Diggs, hidden rows of 8222:492569). */
export const CHAT_ACCESS: { person: PersonId; role: Role }[] = [
  { person: 'roger-bennett', role: 'Owner' },
  { person: 'matt-rivera', role: 'Editor' },
  { person: 'john-whitaker', role: 'Editor' },
  { person: 'grace-coleman', role: 'Editor' },
  { person: 'natali-craig', role: 'Viewer' },
  { person: 'drew-cano', role: 'Viewer' },
  { person: 'orlando-diggs', role: 'Viewer' },
]

/** Share modal title. Figma titles the chat share "Share Artifact" in chat-artifact 09 (fix share-title-chat). */
export const SHARE_TITLE = {
  chat: d('Share Artifact', 'Share chat', 'share-title-chat'),
  artifact: 'Share Artifact',
}

/** Role menu rows (9256:470679). The descriptions say "project" in Figma (fix role-copy, Q36). */
export function roleOptions(target: 'chat' | 'artifact'): { role: Role; description: Text }[] {
  return [
    { role: 'Commenter', description: d('Comment and view project', `Comment and view ${target === 'chat' ? 'chat' : 'artifact'}`, 'role-copy') },
    { role: 'Editor', description: d('Chat and edit project', `Chat and edit ${target === 'chat' ? 'chat' : 'artifact'}`, 'role-copy') },
  ]
}
export const REMOVE_ACCESS = 'Remove Access'

export type GeneralAccess = 'restricted' | 'workspace' | 'link'

/** General access options (1819:316249) and the line under the selected one (1819:316164, 1819:316290, 1819:316373). */
export const GENERAL_ACCESS: Record<GeneralAccess, { label: string; menuDescription: string; selectedDescription: Text }> = {
  restricted: { label: 'Restricted', menuDescription: 'Only the people above can access it', selectedDescription: 'Only the people above can access it' },
  workspace: { label: 'Everyone at UnifyApps', menuDescription: 'Anyone signed in to your workspace', selectedDescription: 'Anyone signed in to your workspace' },
  link: {
    label: 'Anyone with the link',
    menuDescription: 'Anyone on the internet with the link',
    selectedDescription: d('Only the people above can access it', 'Anyone on the internet with the link can view', 'link-access-copy'),
  },
}

export type ShareMember = { person: PersonId | Drift<PersonId>; role: Role }

/** Owner row: Roger with fixes on, Lana Steiner as drawn (fix share-owner-persona). */
export const shareOwner = (): ShareMember => ({ person: selfOn('share'), role: 'Owner' })

/** seed shared-2: the two members both share modals list under the owner (1819:316164, 12025:773344). */
export const SHARED_2: ShareMember[] = [
  { person: 'candice-wu', role: 'Commenter' },
  { person: 'natali-craig', role: 'Commenter' },
]

/** People search under "Invite people and groups" (1819:316429). Lana Steiner is listed although drawn as the owner. */
export const PEOPLE_SEARCH: PersonId[] = [
  'aman-baldha', 'saurav', 'lana-steiner', 'demi-wilkinson', 'candice-wu', 'natali-craig', 'drew-cano',
]

/** An invite chip: a directory person, or a typed email (Q37: free-typed emails become chips). */
export type InviteChip = { person: PersonId } | { email: string }

/** seed invite-2 (1819:316471) and invite-5 (1819:316531). */
export const INVITES: Record<2 | 5, InviteChip[]> = {
  2: [{ email: 'olivia@untitled.com' }, { person: 'phoenix' }],
  5: [{ email: 'olivia@untitled.com' }, { person: 'phoenix' }, { person: 'natali-craig' }, { person: 'candice-wu' }, { person: 'andi' }],
}

/** seed notify: the checked "Notify people" box and its message (1819:316531). */
export const INVITE_MESSAGE = 'Hey team! I’ve shared the new dashboard prototype. Take a look when you get a chance and share your feedback.'

// ---------------------------------------------------------------------------------------------- publish

export type PublishPick = { person: PersonId } | { group: GroupId }

/** "Add people and groups" results (c08a, 11919:591369). */
export const PUBLISH_PICKER: PublishPick[] = [
  { group: 'leadership' }, { group: 'management' },
  { person: 'lana-steiner' }, { person: 'demi-wilkinson' }, { person: 'candice-wu' }, { person: 'natali-craig' }, { person: 'drew-cano' },
]

/** seed publish-picked (c07, 11905:590614): the field holds "Management (6)"; who has access lists owner + two editors. */
export const PUBLISH_PICKED = {
  field: [{ group: 'management' }] as PublishPick[],
  members: (): ShareMember[] => [
    { person: selfOn('publish'), role: 'Owner' },
    { person: 'candice-wu', role: 'Editor' },
    { person: 'natali-craig', role: 'Editor' },
  ],
}

/** seed publish-restricted (c06, 11933:737464): the restricted list after Done, including the Management group. */
export const PUBLISH_RESTRICTED = {
  members: (): (ShareMember | { group: GroupId })[] => [
    { person: selfOn('publish'), role: 'Owner' },
    { person: 'candice-wu', role: 'Editor' },
    { person: 'natali-craig', role: 'Editor' },
    { group: 'management' },
  ],
}
