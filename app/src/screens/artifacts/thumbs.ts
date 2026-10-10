import type { ArtifactEntry } from './collection'

// Card thumbnails, exported from the cards' "Frame 2147266890" (I<card>;7877:300632) at 2x with their shadow
// (figma-console, 2026-10-10): 576 x 340, i.e. the 262 x 140 image with 13px around it and 17 below.
const FILES = import.meta.glob<string>('../../assets/artifact-thumbs/*.png', { eager: true, import: 'default' })

const THUMBS: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.png'.length), url]),
)

/** Cards that draw another card's image: the Q3 forecast (and its clone) show "The Rise of AI…" doc (11648:688356,
 *  13750:280936); the 1728 frame's extra cards (8412:194488) repeat the grid's, and its playbook the JSON card's. */
const ALIAS: Record<string, string> = {
  'q3-forecast': 'rise-of-ai-doc',
  'q3-forecast-clone': 'rise-of-ai-doc',
  'platform-research-flow-2': 'platform-research-flow',
  'policy-hub-csv-2': 'policy-hub-csv',
  'platform-research-playbook': 'json-document', // 12218:717659 draws the JSON card's image
}

/** The card image for an artifact, or null for the empty `ai-generate-image` placeholder. */
export function thumbOf(entry: Pick<ArtifactEntry, 'id' | 'source' | 'thumbnail'>): string | null {
  if (entry.thumbnail === 'empty') return null
  for (const id of [entry.id, entry.source]) {
    const hit = THUMBS[id] ?? THUMBS[ALIAS[id] ?? '']
    if (hit) return hit
  }
  return null
}
