import { d, type Drift, type Text } from './drift'
import type { PersonId } from './people'

// Artifact catalog: types, names, versions, files. Copy read from the Figma frames (figma-console, 2026-10-08).
// Ids are the prototype's addressing scheme (BUILD-PLAN 2.1): #/artifacts/<id>, #/view/<id>, #/chat/<chat>/<id>.

export type ArtifactType =
  | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'markdown' | 'application' | 'csv' | 'flow' | 'json'
  | 'playbook' | 'email'

/** `Inline Artifact Cards / State=…` (chat-artifact 15a 3211:70049). */
export type InlineCardState =
  | 'DOC' | 'XLS' | 'PPT' | 'PDF' | 'Markdown' | 'Application-HTML' | 'Table CSV' | 'Flow Diagram' | 'JSON'

/** `Artifact-Icons / Type=…` in the artifact header. */
export type HeaderIcon = 'App' | 'Spreadsheets' | 'Documents' | 'PDFs' | 'Markdowns' | 'Presentation' | 'connector' | 'JSON'

export type ArtifactTypeSpec = {
  /** Mono caps label on the landing card (7907:305055, 8412:194488). */
  card: string
  /** Row in the "All Types" filter menu (11648:688356); null when the menu has no row for it (Markdown, CSV). */
  filter: string | null
  /** TYPE column of the list view (12868:502599). */
  list: string
  inline: InlineCardState
  /** Kind shown first in the inline card / files panel meta ("Interactive HTML", "Document • DOCX"). */
  kind: string
  headerIcon: HeaderIcon
  /** Card thumbnail tint, "bg colour scheme" 13750:280568. All defined in shared/tokens.css. */
  tint: string
  ext: string
}

export const ARTIFACT_TYPES: Record<ArtifactType, ArtifactTypeSpec> = {
  document: { card: 'DOCUMENT', filter: 'Documents', list: 'Document', inline: 'DOC', kind: 'Document • DOCX', headerIcon: 'Documents', tint: '--colors-utility-pigeon-blue-utility-pigeon-blue-50', ext: '.docx' },
  spreadsheet: { card: 'SHEETS', filter: 'Spreadsheets', list: 'Spreadsheet', inline: 'XLS', kind: 'Sheets • XLSX', headerIcon: 'Spreadsheets', tint: '--colors-utility-jade-green-utility-jade-green-25', ext: '.xlsx' },
  presentation: { card: 'PRESENTATION', filter: 'Presentations', list: 'Presentation', inline: 'PPT', kind: 'Presentation • PPTX', headerIcon: 'Presentation', tint: '--colors-utility-orange-utility-orange-50', ext: '.pptx' },
  pdf: { card: 'PDF', filter: 'PDFs', list: 'PDF', inline: 'PDF', kind: 'Document • PDF', headerIcon: 'PDFs', tint: '--colors-utility-error-utility-error-50', ext: '.pdf' },
  markdown: { card: 'MARKDOWN', filter: null, list: 'Markdown', inline: 'Markdown', kind: 'Document • MD', headerIcon: 'Markdowns', tint: '--colors-background-bg-tertiary', ext: '.md' },
  application: { card: 'APPLICATION', filter: 'Applications', list: 'Application', inline: 'Application-HTML', kind: 'Interactive HTML', headerIcon: 'App', tint: '--colors-utility-plum-utility-plum-25', ext: '.html' },
  csv: { card: 'CSV', filter: null, list: 'CSV', inline: 'Table CSV', kind: 'Table • CSV', headerIcon: 'Spreadsheets', tint: '--colors-background-bg-tertiary', ext: '.csv' },
  flow: { card: 'FLOW CHART', filter: 'Flow Diagrams', list: 'Flow Diagram', inline: 'Flow Diagram', kind: 'Connector App • Flow Diagram', headerIcon: 'connector', tint: '--colors-utility-terracotta-utility-terracotta-50', ext: '' },
  json: { card: 'JSON', filter: 'JSON', list: 'JSON', inline: 'JSON', kind: 'JSON', headerIcon: 'JSON', tint: '--colors-utility-pigeon-blue-utility-pigeon-blue-50', ext: '.json' },
  playbook: { card: 'PLAYBOOK', filter: 'Playbook', list: 'Playbook', inline: 'Markdown', kind: 'Playbook', headerIcon: 'Documents', tint: '--colors-utility-rose-utility-rose-25', ext: '' },
  email: { card: 'EMAIL', filter: 'Emails', list: 'Email', inline: 'DOC', kind: 'Connector • Email', headerIcon: 'connector', tint: '--colors-utility-warning-utility-warning-50', ext: '' },
}

/** Order of the "All Types" filter menu (11648:688356); 'all' is the checked default row. */
export const TYPE_FILTER: ({ id: 'all'; label: 'All Types' } | { id: ArtifactType; label: string })[] = [
  { id: 'all', label: 'All Types' },
  { id: 'document', label: 'Documents' },
  { id: 'spreadsheet', label: 'Spreadsheets' },
  { id: 'presentation', label: 'Presentations' },
  { id: 'application', label: 'Applications' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'email', label: 'Emails' },
  { id: 'json', label: 'JSON' },
  { id: 'flow', label: 'Flow Diagrams' },
  { id: 'playbook', label: 'Playbook' },
]

/** Status glyphs on a card, as drawn (pin = pinned, lock = private, users = shared, globe = published; Q57). */
export type StatusIcon = 'pin' | 'lock' | 'users' | 'globe'
export type Visibility = 'private' | 'shared' | 'published'

/** One row of the version list (Version History 9200:349032; name menu 5310:276790). Newest first. */
export type ArtifactVersion = { n: number; label: Text; when: string }

/** Which sample canvas renders the artifact body (Q55). Figma uses flat images for the dashboard and the sheet. */
export type CanvasKind = 'acme-dashboard' | 'sheet' | 'sheet-empty' | 'doc' | 'pdf' | 'markdown' | 'slides' | 'flow' | 'json'

export type Artifact = {
  name: Text
  type: ArtifactType
  size?: string
  /** Version shown on the inline card and the files panel ("Version 1"). */
  version: number | Drift<number>
  versions?: ArtifactVersion[]
  /** Name in the artifact header when Figma draws a different one than the card (split frames say "Untitled.xls"). */
  headerName?: Text
  headerIcon?: HeaderIcon | Drift<HeaderIcon>
  author?: PersonId | Drift<PersonId>
  /** Minutes since the last change; the landing draws "2h ago" on every card. 0 renders "now". */
  minutesAgo?: number
  visibility?: Visibility | Drift<Visibility>
  pinned?: boolean
  iconsAsDrawn?: StatusIcon[]
  /** The chat that made it. Absent = no chat yet: the header CTA is "Start Chat" instead of "Edit with Chat" (Q59). */
  chat?: string
  canvas: CanvasKind
  /** Card thumbnail: an image of the canvas, or the empty `ai-generate-image` placeholder (8412:194488). */
  thumbnail?: 'image' | 'empty'
  figma: string[]
}

const PIPELINE_VERSIONS: ArtifactVersion[] = [
  { n: 3, label: d('all header icons for reference.xls', 'Pipeline Command', 'panel-name-matches-card'), when: 'Today • Latest' },
  { n: 2, label: d('Artifact name 1', 'Pipeline Command', 'panel-name-matches-card'), when: 'Yesterday • 14:14' },
  { n: 1, label: d('Artifact name 2', 'Pipeline Command', 'panel-name-matches-card'), when: '3 days ago • 08:12' },
]

const CARD = (o: Omit<Artifact, 'version' | 'minutesAgo' | 'thumbnail'> & Partial<Pick<Artifact, 'version' | 'minutesAgo' | 'thumbnail'>>): Artifact =>
  ({ version: 1, minutesAgo: 120, thumbnail: 'image', ...o })

const CATALOG = {
  // ------------------------------------------------------------------ the commit chat's artifacts
  'pipeline-command': {
    name: 'Pipeline Command', type: 'application', size: '123 KB',
    version: d(1, 3, 'version-count'), // card "Version 1" (1809:363799) vs header "v3" (1809:488480)
    versions: PIPELINE_VERSIONS,
    headerName: d('Untitled.xls', 'Pipeline Command', 'panel-name-matches-card'),
    headerIcon: d<HeaderIcon>('Documents', 'App', 'panel-name-matches-card'),
    author: 'roger-bennett', chat: 'commit', canvas: 'acme-dashboard',
    figma: ['1768:356654', '1809:363799', '1809:488480', '1795:359260', '1809:484624'],
  },
  'text-command': { name: 'Text Command', type: 'document', size: '123 KB', version: 3, chat: 'commit', canvas: 'doc', figma: ['5975:413714'] },
  'star-command': { name: 'Star Command', type: 'document', size: '123 KB', version: 3, chat: 'commit', canvas: 'doc', figma: ['5975:413714'] },
  // ------------------------------------------------------------------ artifact views (viewer, full editor, editor main)
  'blank-xls': { name: 'Untitled.xls', type: 'spreadsheet', version: 3, chat: 'new-artifact', canvas: 'sheet-empty', figma: ['3780:178324'] },
  'acme-app': {
    name: d('Untitled Applciations', 'Untitled Application', 'typo-application'), type: 'application', version: 3,
    chat: 'commit', canvas: 'acme-dashboard', figma: ['3838:248160', '13155:271422', '7809:278865', '8085:469355'],
  },
  'untitled-xls': { name: 'Untitled.xls', type: 'spreadsheet', version: 3, chat: 'commit', canvas: 'sheet', figma: ['7767:266191', '7809:273518', '12195:302725'] },
  'untitled-doc': { name: 'Untitled.doc', type: 'document', version: 3, chat: 'commit', canvas: 'doc', figma: ['7781:267087', '7809:273526'] },
  'untitled-pdf': { name: 'Untitled.pdf', type: 'pdf', version: 3, chat: 'commit', canvas: 'pdf', figma: ['7781:267978', '7809:273538'] },
  'untitled-md': { name: 'Untitled.md', type: 'markdown', version: 3, chat: 'commit', canvas: 'markdown', figma: ['7781:268873', '7809:273550'] },
  'untitled-ppt': { name: 'Untitled.ppt', type: 'presentation', version: 3, chat: 'commit', canvas: 'slides', figma: ['7781:269768', '7809:273559'] },
  'untitled-flow': { name: d('Untitled.ppt', 'Untitled flow', 'connector-name'), type: 'flow', version: 3, chat: 'commit', canvas: 'flow', figma: ['8771:210166'] },
  'document-json': { name: 'Document.json', type: 'json', version: 3, chat: 'commit', canvas: 'json', figma: ['10157:575625'] },
  'reference-xls': {
    // the long-name truncation case; the header doubles the phrase, the version list does not (5310:276790)
    name: 'all header icons for reference all header icons for reference.xls', type: 'spreadsheet', version: 3, chat: 'commit', canvas: 'acme-dashboard',
    versions: [
      { n: 3, label: 'All header icons for reference.xls', when: 'Today • Latest' },
      { n: 2, label: 'Artifact name 1', when: 'Yesterday • 14:14' },
      { n: 1, label: 'Artifact name 2', when: '3 days ago • 08:12' },
    ],
    figma: ['5310:276790', '7418:305665', '7418:305917'],
  },
  // ------------------------------------------------------------------ artifacts landing cards (7907:305055)
  'overview-brief': CARD({ name: 'Overview brief', type: 'document', author: 'autumn-phillips', visibility: 'private', pinned: true, iconsAsDrawn: ['pin', 'lock'], chat: 'commit', canvas: 'doc', figma: ['7907:305066'] }),
  'advance-auto-parts': CARD({ name: 'Advance Auto Parts Operations Platform', type: 'application', author: 'chris-glasser', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'acme-dashboard', figma: ['7907:305067'] }),
  'q3-forecast': CARD({ name: 'Q3 2026 Revenue Forecast & Budget Reconciliation — Meridian', type: 'document', author: 'ameer-khan', visibility: 'shared', iconsAsDrawn: ['users'], chat: 'commit', canvas: 'doc', figma: ['11648:688356', '13750:280936'] }),
  'rise-of-ai-doc': CARD({ name: 'The Rise of AI in the Auto Parts Industry', type: 'document', author: 'mary-freund', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'doc', figma: ['7907:305068'] }),
  'apex-badminton': CARD({ name: 'Apex smash badminton academy', type: 'application', author: 'david-elson', visibility: 'published', iconsAsDrawn: ['lock', 'globe'], chat: 'commit', canvas: 'acme-dashboard', figma: ['7907:305070'] }),
  'auto-parts-daily': CARD({ name: 'AI auto parts app - daily tasks and operations summary', type: 'spreadsheet', author: 'dennis-callis', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'sheet', figma: ['7907:305071'] }),
  'apex-football': CARD({ name: 'Apex elite football academy – interactive portal', type: 'application', author: 'ricky-smith', visibility: 'private', pinned: true, iconsAsDrawn: ['pin', 'lock'], chat: 'commit', canvas: 'acme-dashboard', figma: ['7907:305072'] }),
  'rise-of-ai-ppt': CARD({ name: 'The-rise-of-ai-in-auto-parts', type: 'presentation', author: 'eddie-lake', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'slides', figma: ['7907:305074'] }),
  'policy-hub-app': CARD({ name: 'Enterprise Policy & Compliance Hub', type: 'application', author: 'james-hall', visibility: 'private', pinned: true, iconsAsDrawn: ['pin', 'lock'], chat: 'commit', canvas: 'acme-dashboard', figma: ['7907:305075'] }),
  'platform-research-pdf': CARD({ name: 'AI Platform Convergence Research', type: 'pdf', author: 'frances-swann', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'pdf', figma: ['7907:305076'] }),
  'rise-of-ai-md': CARD({ name: 'The-rise-of-ai-in-auto-parts', type: 'markdown', author: 'eddie-lake', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'markdown', figma: ['8412:194209'] }),
  'policy-hub-csv': CARD({ name: 'Enterprise Policy & Compliance Hub', type: 'csv', author: 'james-hall', visibility: 'private', pinned: true, iconsAsDrawn: ['pin', 'lock'], chat: 'commit', canvas: 'sheet', figma: ['8412:194210'] }),
  'platform-research-flow': CARD({ name: 'AI Platform Convergence Research', type: 'flow', author: 'frances-swann', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'flow', figma: ['8412:194211'] }),
  // extra types on the 1728 frame (8412:194488, seed all-types)
  'json-document': CARD({ name: 'JSON Document ', type: 'json', author: 'eddie-lake', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'json', figma: ['8412:194488'] }),
  'platform-research-flow-2': CARD({ name: 'AI Platform Convergence Research', type: 'flow', author: 'frances-swann', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'flow', figma: ['8412:194488'] }),
  'policy-hub-csv-2': CARD({ name: 'Enterprise Policy & Compliance Hub', type: 'csv', author: 'james-hall', visibility: 'private', pinned: true, iconsAsDrawn: ['pin', 'lock'], chat: 'commit', canvas: 'sheet', figma: ['8412:194488'] }),
  'rise-of-ai-md-2': CARD({ name: 'The-rise-of-ai-in-auto-parts', type: 'markdown', author: 'eddie-lake', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'markdown', thumbnail: 'empty', figma: ['8412:194488'] }),
  'platform-research-playbook': CARD({ name: 'AI Platform Convergence Research', type: 'playbook', author: 'eddie-lake', visibility: 'shared', iconsAsDrawn: ['lock', 'users'], chat: 'commit', canvas: 'markdown', figma: ['8412:194488'] }),
  // rows the list view draws instead of the grid's artifacts (12868:502599; fix artifacts-list-rows)
  'next-steps': CARD({ name: 'Next steps longer name', type: 'pdf', author: 'autumn-phillips', visibility: 'published', chat: 'commit', canvas: 'pdf', figma: ['12868:502599'] }),
  'detailed-analysis': CARD({ name: 'Detailed analysis', type: 'application', author: 'chris-glasser', visibility: 'shared', chat: 'commit', canvas: 'acme-dashboard', figma: ['12868:502599'] }),
  'annual-event-findings': CARD({ name: 'Annual Event Findings', type: 'presentation', author: 'mary-freund', visibility: 'private', chat: 'commit', canvas: 'slides', figma: ['12868:502599'] }),
  // the clone (cloned-artifact 13750:280936 → 13750:301988)
  'q3-forecast-clone': CARD({
    name: 'Q3 2026 Revenue Forecast & Budget Reconciliation — Meridian (Cloned)', type: 'document',
    author: d<PersonId>('atul-jain', 'roger-bennett', 'persona-signed-in'), minutesAgo: 0,
    visibility: d<Visibility>('shared', 'private', 'clone-starts-private'), iconsAsDrawn: ['users'],
    canvas: 'acme-dashboard', // 13750:301988 shows the Acme dashboard image
    figma: ['13750:280936', '13750:301988', '13750:302325'],
  }),
} satisfies Record<string, Artifact>

export type ArtifactId = keyof typeof CATALOG

export const ARTIFACTS: Record<ArtifactId, Artifact & { id: ArtifactId }> = Object.fromEntries(
  (Object.entries(CATALOG) as [ArtifactId, Artifact][]).map(([id, a]) => [id, { ...a, id }]),
) as Record<ArtifactId, Artifact & { id: ArtifactId }>

export const artifact = (id: ArtifactId) => ARTIFACTS[id]
/** Own keys only: a URL id such as "constructor" or "__proto__" is not an artifact (`in` would walk Object.prototype). */
export const isArtifactId = (id: string): id is ArtifactId => Object.hasOwn(ARTIFACTS, id)

/** "Interactive HTML • 123 KB • Version 1" (1809:363799). Pass the resolved version. */
export function inlineMeta(a: { type: ArtifactType; size?: string }, version: number): string {
  return [ARTIFACT_TYPES[a.type].kind, a.size, `Version ${version}`].filter(Boolean).join(' • ')
}

// ---------------------------------------------------------------------------------------------- landing lists

/** Artifacts landing grid, in drawn order (7907:305055). Slot 3 is the Q3 forecast card, as 11648:688356, 13750:280936
 *  and pinning 11648:688362 draw it; frame 02 draws "The Rise of AI in the Auto Parts Industry" there (fix
 *  artifacts-grid-q3-card documents it; one data set cannot match both). */
export const ARTIFACTS_GRID: ArtifactId[] = [
  'overview-brief', 'advance-auto-parts', 'q3-forecast', 'apex-badminton', 'auto-parts-daily', 'apex-football',
  'rise-of-ai-ppt', 'policy-hub-app', 'platform-research-pdf', 'rise-of-ai-md', 'policy-hub-csv', 'platform-research-flow',
]

/** Seed all-types (8412:194488): the grid plus five more types. The frame keeps "The Rise of AI…" in slot 3. */
export const ARTIFACTS_ALL_TYPES: ArtifactId[] = [
  ...ARTIFACTS_GRID,
  'json-document', 'platform-research-flow-2', 'policy-hub-csv-2', 'rise-of-ai-md-2', 'platform-research-playbook',
]

/** Seed cloned: as drawn the clone is the 10th card under 9 cards (13750:280936); Q59 puts it first (Newest). */
export const ARTIFACTS_CLONED: Drift<ArtifactId[]> = d<ArtifactId[]>(
  [...ARTIFACTS_GRID.slice(0, 9), 'q3-forecast-clone'],
  ['q3-forecast-clone', ...ARTIFACTS_GRID],
  'clone-appears-first',
)

/** List view rows (12868:502599). As drawn they are four other artifacts; with fixes the list shows the grid's data. */
export const ARTIFACTS_LIST: Drift<ArtifactId[]> = d<ArtifactId[]>(
  ['overview-brief', 'next-steps', 'detailed-analysis', 'annual-event-findings'],
  ARTIFACTS_GRID,
  'artifacts-list-rows',
)

// ---------------------------------------------------------------------------------------------- files panel

export type FileKind = 'IMG' | 'PDF' | 'CSV' | 'DOC' | 'PPT' | 'JSON' | 'SVG' | 'XLSX'
export type ChatFile = { id: string; name: string; kind: FileKind; size: string }

/** A row of the files panel's Artifacts list. */
export type FilesPanelArtifactRow = { artifact: ArtifactId; meta: Text }

/** "Files 8" of the commit chat (5975:413714 list, 14607:403125 grid). Only three names are drawn; the rest are the
 *  grid's type chips with the drawn "Filename.<EXT>" pattern. */
export const CHAT_FILES: ChatFile[] = [
  { id: 'f-screenshot', name: 'Screenshot', kind: 'IMG', size: '123 KB' },
  { id: 'f-pdf', name: 'Filename.PDF', kind: 'PDF', size: '123 KB' },
  { id: 'f-csv', name: 'Filename.CSV', kind: 'CSV', size: '123 KB' },
  { id: 'f-doc', name: 'Filename.DOC', kind: 'DOC', size: '123 KB' },
  { id: 'f-ppt', name: 'Filename.PPT', kind: 'PPT', size: '123 KB' },
  { id: 'f-json', name: 'Filename.JSON', kind: 'JSON', size: '123 KB' },
  { id: 'f-svg', name: 'Filename.SVG', kind: 'SVG', size: '123 KB' },
  { id: 'f-xlsx', name: 'Filename.XLSX', kind: 'XLSX', size: '123 KB' },
]

/** Drawn order of the grid view (14607:403125): DOC PPT / IMG PDF / JSON SVG / CSV XLSX. The list keeps CHAT_FILES order. */
export const CHAT_FILES_GRID_ORDER: string[] = ['f-doc', 'f-ppt', 'f-screenshot', 'f-pdf', 'f-json', 'f-svg', 'f-csv', 'f-xlsx']

/** "Artifacts 3" in the files panel. 5975:413714 draws five rows under the count 3; 14607:403125 draws three
 *  "Pipeline Command" rows. With fixes: the chat's three artifacts, each with its own meta. */
export const FILES_PANEL_ARTIFACTS: Drift<FilesPanelArtifactRow[]> = d<FilesPanelArtifactRow[]>(
  [
    { artifact: 'pipeline-command', meta: 'Document • DOCX • V3' },
    { artifact: 'pipeline-command', meta: 'Document • PDF • V1' },
    { artifact: 'pipeline-command', meta: 'Document • DOCX • V3' },
    { artifact: 'text-command', meta: 'Document • DOCX • V3' },
    { artifact: 'star-command', meta: 'Document • DOCX • V3' },
  ],
  [
    { artifact: 'pipeline-command', meta: 'Interactive HTML • 123 KB • Version 3' },
    { artifact: 'text-command', meta: 'Document • DOCX • 123 KB • Version 3' },
    { artifact: 'star-command', meta: 'Document • DOCX • 123 KB • Version 3' },
  ],
  'files-panel-artifacts',
)

/** Artifacts each chat produced (header files badge "2" in 1809:363799 counts the files icon, not these). */
export const CHAT_ARTIFACTS: Record<string, ArtifactId[]> = {
  commit: ['pipeline-command', 'text-command', 'star-command'],
  'new-artifact': ['blank-xls'],
  'new-routine': ['pipeline-command'],
}
