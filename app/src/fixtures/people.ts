import { d, type Drift, type Text } from './drift'

// People directory. Names, emails and avatar fills are read from the Figma frames (figma-console, 2026-10-08).
// Persona (BUILD-PLAN Q1, default accepted): the signed-in user is Roger Bennett everywhere. Figma draws other
// people in the "(You)" slot on some surfaces; those are kept as SELF_AS_DRAWN and resolve through a fix.

/** Avatar fills seen on `Avatar / Type=Letter` instances, keyed by the DS utility token they resolve to in light mode. */
export type AvatarColour =
  | 'brand-500' | 'brand-300' | 'plum-700' | 'plum-300' | 'error-600' | 'error-300' | 'warm-blue-700' | 'warm-blue-300'
  | 'steel-blue-200' | 'rose-300' | 'success-300' | 'success-400' | 'lime-300' | 'warning-300' | 'brand-secondary-500'
  | 'brand-tertiary-800' | 'brand-tertiary-500' | 'pigeon-blue-400' | 'royal-violet-300'

/** Custom property for each fill (all defined in shared/tokens.css). Light-mode hex in the comment, for reference only. */
export const AVATAR_FILL: Record<AvatarColour, string> = {
  'brand-500': '--colors-utility-brand-utility-brand-500', // #112d06
  'brand-300': '--colors-utility-brand-utility-brand-300', // #5e6e62
  'plum-700': '--colors-utility-plum-utility-plum-700', // #3d183d
  'plum-300': '--colors-utility-plum-utility-plum-300', // #9e659e
  'error-600': '--colors-utility-error-utility-error-600', // #981d14
  'error-300': '--colors-utility-error-utility-error-300', // #dc7b74
  'warm-blue-700': '--colors-utility-warm-blue-utility-warm-blue-700', // #406481
  'warm-blue-300': '--colors-utility-warm-blue-utility-warm-blue-300', // #9cb3c9
  'steel-blue-200': '--colors-utility-steel-blue-utility-steel-blue-200', // #6ca4ce
  'rose-300': '--colors-utility-rose-utility-rose-300', // #d47886
  'success-300': '--colors-utility-success-utility-success-300', // #76b086
  'success-400': '--colors-utility-success-utility-success-400', // #378f4e
  'lime-300': '--colors-utility-lime-utility-lime-300', // #96b460
  'warning-300': '--colors-utility-warning-utility-warning-300', // #f4b271
  'brand-secondary-500': '--colors-utility-brand-secondary-utility-brand-secondary-500', // #d1c3ab
  'brand-tertiary-800': '--colors-utility-brand-tertiary-utility-brand-tertiary-800', // #4c4123
  'brand-tertiary-500': '--colors-utility-brand-tertiary-utility-brand-tertiary-500', // #938256
  'pigeon-blue-400': '--colors-utility-pigeon-blue-utility-pigeon-blue-400', // #6879a0
  'royal-violet-300': '--colors-utility-royal-violet-utility-royal-violet-300', // #8d75a8
}

type PersonSeed = {
  name: string
  email?: string
  /** The one fill this person gets everywhere once fix avatar-colour-per-person is on. */
  colour: AvatarColour
  /** Where Figma shows this person (node ids or frame names). */
  source: string
  /** Figma shows only an avatar letter; the full name is the prototype's placeholder. */
  placeholderName?: true
}

const SEEDS = {
  // the persona and the three colleagues of the commit chat (access popover 1768:356654 is the one surface with all of them)
  'roger-bennett': { name: 'Roger Bennett', email: 'rogerbennett@unifyapps.com', colour: 'brand-500', source: 'landing "Hello Roger" 1707:136008; access popover 1768:356654' },
  'matt-rivera': { name: 'Matt Rivera', email: 'mattrivera@unifyapps.com', colour: 'plum-700', source: 'chat-artifact 10-16, collab-chat' },
  'john-whitaker': { name: 'John Whitaker', email: 'johnwhitaker@unifyapps.com', colour: 'error-600', source: 'chat-artifact 10-16, collab-chat' },
  'grace-coleman': { name: 'Grace Coleman', email: 'gracecoleman@unifyapps.com', colour: 'warm-blue-700', source: 'chat-artifact 10-16, collab-chat' },
  'natali-craig': { name: 'Natali Craig', email: 'natalicraig@unifyapps.com', colour: 'brand-tertiary-800', source: 'access popover 1768:356654; share 1819:316164' },
  // share / publish people (1819:316429 people search, 11919:591369 publish picker)
  'lana-steiner': { name: 'Lana Steiner', email: 'lanasteiner@unifyapps.com', colour: 'brand-300', source: 'share owner as drawn 1819:316164; comments 8085:469620' },
  'candice-wu': { name: 'Candice Wu', email: 'candicewu@unifyapps.com', colour: 'warning-300', source: 'share 1819:316164' },
  'demi-wilkinson': { name: 'Demi Wilkinson', email: 'demiwilkinson@unifyapps.com', colour: 'warm-blue-300', source: 'share search 1819:316429' },
  'drew-cano': { name: 'Drew Cano', email: 'drewcano@unifyapps.com', colour: 'brand-500', source: 'share search 1819:316429' },
  'orlando-diggs': { name: 'Orlando Diggs', email: 'orlandodiggs@unifyapps.com', colour: 'brand-500', source: 'hidden rows of the access list 8222:492569' },
  'aman-baldha': { name: 'Aman Baldha', email: 'aman.baldha@partner.unifyapps.com', colour: 'brand-500', source: 'share search 1819:316429' },
  saurav: { name: 'Saurav', email: 'saurav@unifyapps.com', colour: 'brand-500', source: 'share search 1819:316429' },
  phoenix: { name: 'Phoenix', email: 'phoenix@unifyapps.com', colour: 'brand-500', source: 'invite chip 1819:316471' },
  andi: { name: 'Andi', email: 'andi@unifyapps.com', colour: 'brand-500', source: 'invite chip 1819:316531' },
  // the crowd (collab-chat 09): Figma draws letters only, M J G E Q L D W C Z in the header and J M R E Q L Z in the bar
  'emma-clarke': { name: 'Emma Clarke', colour: 'plum-300', source: 'crowd header letter E 8222:490604', placeholderName: true },
  'quinn-adler': { name: 'Quinn Adler', colour: 'success-300', source: 'crowd header letter Q 8222:490604', placeholderName: true },
  'wes-morgan': { name: 'Wes Morgan', colour: 'lime-300', source: 'crowd header letter W 8222:490604', placeholderName: true },
  'zoe-hart': { name: 'Zoe Hart', colour: 'brand-secondary-500', source: 'crowd header letter Z 8222:490604', placeholderName: true },
  'riya-shah': { name: 'Riya Shah', colour: 'steel-blue-200', source: 'typing bar letter R 8222:490604', placeholderName: true },
  'olivia-park': { name: 'Olivia Park', colour: 'success-400', source: 'typing bar letter O 8451:366278', placeholderName: true },
  'tomas-reyes': { name: 'Tomás Reyes', colour: 'rose-300', source: 'typing bar letter T 8451:366278', placeholderName: true },
  // commenters (8279:195355, members menu 8279:213062, reply flow 10767:620485, standalone 8085:469620)
  'anuj-mittal': { name: 'Anuj Mittal', colour: 'pigeon-blue-400', source: 'comments "(You)" as drawn 8279:195355' },
  'anirudha-roy': { name: 'Anirudha Roy', colour: 'brand-300', source: 'comments 8279:195355' },
  'saumya-pandey': { name: 'Saumya Pandey', colour: 'royal-violet-300', source: 'comments 8279:195355' },
  'gaurav-singh': { name: 'Gaurav Singh', colour: 'brand-tertiary-500', source: 'members menu 8279:213062' },
  'nitasha-gandhi': { name: 'Nitasha Gandhi', colour: 'success-400', source: 'members menu 8279:213062' },
  'chaaya-warrior': { name: 'Chaaya Warrior', colour: 'pigeon-blue-400', source: 'members menu "(You) · Owner" 8279:213062' },
  'ayush-chandra': { name: 'Ayush Chandra', colour: 'brand-300', source: 'reply 10767:620485' },
  'anurag-mehta': { name: 'Anurag Mehta', colour: 'rose-300', source: 'comments 8085:469620' },
  annie: { name: 'Annie', colour: 'brand-500', source: 'the "@annie" mention in the comment field 8279:195355' },
  // artifact authors (artifacts landing 7907:305055, 8412:194488, 13750:280936)
  'autumn-phillips': { name: 'Autumn Phillips', colour: 'brand-500', source: 'artifact card 7907:305066' },
  'chris-glasser': { name: 'Chris Glasser', colour: 'brand-500', source: 'artifact card 7907:305067' },
  'mary-freund': { name: 'Mary Freund', colour: 'brand-500', source: 'artifact card 7907:305068' },
  'david-elson': { name: 'David Elson', colour: 'brand-500', source: 'artifact card 7907:305070' },
  'dennis-callis': { name: 'Dennis Callis', colour: 'brand-500', source: 'artifact card 7907:305071' },
  'ricky-smith': { name: 'Ricky Smith', colour: 'brand-500', source: 'artifact card 7907:305072' },
  'eddie-lake': { name: 'Eddie Lake', colour: 'brand-500', source: 'artifact card 7907:305074' },
  'james-hall': { name: 'James Hall', colour: 'brand-500', source: 'artifact card 7907:305075' },
  'frances-swann': { name: 'Frances Swann', colour: 'brand-500', source: 'artifact card 7907:305076' },
  'ameer-khan': { name: 'Ameer Khan', colour: 'brand-500', source: 'Q3 forecast card 13750:280936' },
  'atul-jain': { name: 'Atul Jain', colour: 'brand-500', source: 'clone author as drawn 13750:280936' },
  // shell placeholders
  'anurag-kashyap': { name: 'Anurag Kashyap', colour: 'brand-500', source: 'nav footer as drawn (Main_nav 226:81200)' },
  'ajeetabh-narayan': { name: 'Ajeetabh Narayan', colour: 'brand-500', source: 'project cards 11657:386523' },
} satisfies Record<string, PersonSeed>

export type PersonId = keyof typeof SEEDS

export type Person = PersonSeed & {
  id: PersonId
  /** First name, as the typing line uses it ("John and Matt Rivera are typing"). */
  first: string
  initial: string
}

export const PEOPLE: Record<PersonId, Person> = Object.fromEntries(
  (Object.entries(SEEDS) as [PersonId, PersonSeed][]).map(([id, s]) => [
    id,
    { ...s, id, first: s.name.split(' ')[0], initial: s.name[0].toUpperCase() },
  ]),
) as Record<PersonId, Person>

export const person = (id: PersonId): Person => PEOPLE[id]

/** The signed-in user (Q1). */
export const ME: PersonId = 'roger-bennett'

/** Groups offered by the publish people picker (11919:591369). */
export const GROUPS = [
  { id: 'leadership', name: 'Leadership', size: 12 },
  { id: 'management', name: 'Management', size: 6 },
] as const

export type GroupId = (typeof GROUPS)[number]['id']

// ---------------------------------------------------------------------------------------------- per-surface drift

/** Places a person is drawn. Each one can draw a different "(You)", name spelling or avatar fill in Figma. */
export type Surface =
  | 'landing' | 'header' | 'message' | 'access' | 'mention' | 'mention-filtered' | 'typing' | 'share' | 'publish'
  | 'comments' | 'comments-standalone' | 'commenters-menu' | 'nav' | 'clone'

/** Who Figma draws as the signed-in user on each surface. */
export const SELF_AS_DRAWN: Record<Surface, PersonId> = {
  landing: 'roger-bennett', header: 'roger-bennett', message: 'roger-bennett', access: 'roger-bennett',
  mention: 'roger-bennett', 'mention-filtered': 'roger-bennett', typing: 'roger-bennett',
  share: 'lana-steiner', // 1809:446980, 1819:316164 "Lana Steiner (you)"
  publish: 'lana-steiner', // 11905:590614
  comments: 'anuj-mittal', // 8279:195355 "Anuj Mittal (You)"
  'comments-standalone': 'chaaya-warrior', // 8085:469620
  'commenters-menu': 'chaaya-warrior', // 8279:213062
  nav: 'anurag-kashyap', // nav footer on every frame
  clone: 'atul-jain', // 13750:280936 "Atul Jain · now"
}

const SELF_FIX: Partial<Record<Surface, string>> = {
  share: 'share-owner-persona', publish: 'share-owner-persona', comments: 'share-owner-persona',
  'comments-standalone': 'share-owner-persona', 'commenters-menu': 'share-owner-persona',
  nav: 'persona-signed-in', clone: 'persona-signed-in',
}

/** The signed-in user as a surface draws it: Roger with fixes on, the frame's person as designed. */
export function selfOn(surface: Surface): PersonId | Drift<PersonId> {
  const drawn = SELF_AS_DRAWN[surface]
  const fix = SELF_FIX[surface]
  return drawn === ME || !fix ? ME : d<PersonId>(drawn, ME, fix)
}

/** Names Figma misspells on a surface. */
const NAME_AS_DRAWN: Partial<Record<Surface, Partial<Record<PersonId, [string, string]>>>> = {
  mention: { 'john-whitaker': ['John Whitake', 'name-john-whitaker'] }, // 1731:255712, 8202:478758
  'mention-filtered': { 'grace-coleman': ['Mace Coleman', 'name-grace-coleman'] }, // 1731:338960
  access: { 'john-whitaker': ['John Whitake', 'name-john-whitaker'] }, // 1768:356654, 8222:490604, 6077:427693
}

/** A person's name as a surface draws it. */
export function nameOn(id: PersonId, surface: Surface): Text {
  const drawn = NAME_AS_DRAWN[surface]?.[id]
  return drawn ? d(drawn[0], PEOPLE[id].name, drawn[1]) : PEOPLE[id].name
}

/** Avatar fills Figma draws per surface where they differ from the person's one colour (fix avatar-colour-per-person).
 *  Read from chat-artifact 10 / 15 (header 1731:255712, access 1768:356654, mention list 1731:255712),
 *  collab-chat 10 (typing bar 8222:494135). Share modal avatars are the default Brand Solid fill. */
const AVATAR_AS_DRAWN: Partial<Record<Surface, Partial<Record<PersonId, AvatarColour>>>> = {
  header: { 'john-whitaker': 'error-300', 'grace-coleman': 'steel-blue-200', 'lana-steiner': 'rose-300' },
  mention: { 'matt-rivera': 'brand-500' },
  typing: { 'john-whitaker': 'brand-300', 'matt-rivera': 'error-300' },
  share: {
    'lana-steiner': 'brand-500', 'candice-wu': 'brand-500', 'natali-craig': 'brand-500', 'demi-wilkinson': 'brand-500',
    'roger-bennett': 'brand-500',
  },
}

export type AvatarSpec = { initial: string; colour: AvatarColour | Drift<AvatarColour>; name: Text }

/** Letter, fill and name for a person's avatar on a surface. */
export function avatarOn(id: PersonId, surface: Surface): AvatarSpec {
  const p = PEOPLE[id]
  const drawn = AVATAR_AS_DRAWN[surface]?.[id]
  return {
    initial: p.initial,
    colour: drawn && drawn !== p.colour ? d<AvatarColour>(drawn, p.colour, 'avatar-colour-per-person') : p.colour,
    name: nameOn(id, surface),
  }
}

/** "@Assistant" — the agent as a mention target. Figma spells it "@Assitant" on most frames (fix typo-assistant). */
export const ASSISTANT = {
  id: 'assistant' as const,
  name: 'Assistant',
  mention: d('Assitant', 'Assistant', 'typo-assistant'),
}

export type MentionTarget = PersonId | 'assistant'

/** A mention run for a message or the composer: `@Matt Rivera`, `@Assistant` (spelled "@Assitant" as designed). */
export function at(target: MentionTarget): { mention: MentionTarget; label: Text } {
  return { mention: target, label: target === 'assistant' ? ASSISTANT.mention : PEOPLE[target].name }
}
