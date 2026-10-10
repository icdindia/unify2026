import { createStore, useStore } from '../../app/store'
import {
  ARTIFACTS_ALL_TYPES, ARTIFACTS_CLONED, ARTIFACTS_GRID, ARTIFACTS_LIST, artifact, isArtifactId,
  type Artifact, type ArtifactId,
} from '../../fixtures/artifacts'
import { pick } from '../../fixtures/drift'
import { ME } from '../../fixtures/people'

// What the reviewer has done to the artifacts this session (Artifacts landing, artifacts-landing / cloned-artifact):
// deleted, cloned, pinned, renamed. It lives for the page's life, so a card deleted on the landing stays gone in the
// artifact page and back. The fixtures stay as drawn; this is applied on top.

/** A clone made in the prototype. The Q3 forecast's first clone is the drawn one (fixture 'q3-forecast-clone'). */
export type Clone = { id: string; of: ArtifactId }

type Session = {
  deleted: readonly string[]
  clones: readonly Clone[]
  /** Pinned state the reviewer changed (Pin / Unpin), by id. */
  pins: Readonly<Record<string, boolean>>
  /** Names the reviewer gave (Rename), by id. */
  names: Readonly<Record<string, string>>
}

const session = createStore<Session>({ deleted: [], clones: [], pins: {}, names: {} })

export const useArtifactSession = () => useStore(session)

const update = (fn: (s: Session) => Session) => session.set(fn(session.get()))

/** One artifact as the landing and the artifact page show it. `id` may be a prototype clone's. */
export type ArtifactEntry = Artifact & { id: string; source: ArtifactId }

/** The seeds the landing draws: none (empty, step 01), the grid (02), all types (04) and the drawn clone (cloned 01). */
export type LandingSeed = 'empty' | 'grid' | 'all-types' | 'cloned'

/** The entry for an id (a fixture artifact or a clone made this session), with the session's pin and name; null if unknown. */
export function entryOf(id: string, s: Session = session.get()): ArtifactEntry | null {
  if (s.deleted.includes(id)) return null
  let base: ArtifactEntry | null = null
  if (isArtifactId(id)) base = { ...artifact(id), id, source: id }
  else {
    const c = s.clones.find(x => x.id === id)
    if (c) {
      const of = artifact(c.of)
      const name = typeof of.name === 'string' ? of.name : of.name.designed
      // a fresh clone: yours, private, unpinned, no chat yet (Start Chat), one version, "now" (Q59 defaults)
      base = {
        ...of, id, source: c.of, name: `${s.names[c.of] ?? name} (Cloned)`, author: ME, minutesAgo: 0, visibility: 'private',
        pinned: false, iconsAsDrawn: ['lock'], chat: undefined, version: 1, versions: undefined, headerName: undefined,
      }
    }
  }
  if (!base) return null
  const pinned = s.pins[id] ?? base.pinned ?? false
  const icons = base.iconsAsDrawn ?? []
  return {
    ...base,
    name: s.names[id] ?? base.name,
    pinned,
    // the pin glyph follows the pin state; the rest stay as drawn
    iconsAsDrawn: pinned ? (icons.includes('pin') ? icons : ['pin', ...icons]) : icons.filter(i => i !== 'pin'),
  }
}

/** The landing's artifacts for a seed and view, in drawn order, with this session's changes applied. */
export function landingIds(seed: LandingSeed, list: boolean, applies: (fix: string) => boolean, s: Session = session.get()): string[] {
  if (seed === 'empty') return []
  const base: string[] = list ? pick(ARTIFACTS_LIST, applies)
    : seed === 'all-types' ? ARTIFACTS_ALL_TYPES
    : seed === 'cloned' ? pick(ARTIFACTS_CLONED, applies)
    : ARTIFACTS_GRID
  // clones made here land where the drawn clone does: last as drawn, first with fix clone-appears-first (Q59)
  const made = s.clones.map(c => c.id).filter(id => !base.includes(id))
  const ids = applies('clone-appears-first') ? [...[...made].reverse(), ...base] : [...base, ...made]
  return ids.filter(id => !s.deleted.includes(id))
}

/** Clone an artifact; returns the clone's id. The Q3 forecast's first clone is the drawn one. */
export function cloneArtifact(id: string): string {
  const s = session.get()
  const source = entryOf(id, s)?.source ?? (isArtifactId(id) ? id : null)
  if (!source) return id
  const drawn: ArtifactId = 'q3-forecast-clone'
  let cloneId: string
  if (source === 'q3-forecast' && !s.clones.some(c => c.id === drawn) && !s.deleted.includes(drawn)) cloneId = drawn
  else {
    let n = 1
    do cloneId = `${source}-copy-${n++}`
    while (s.clones.some(c => c.id === cloneId))
  }
  update(x => ({ ...x, clones: [...x.clones, { id: cloneId, of: source }], deleted: x.deleted.filter(d => d !== cloneId) }))
  return cloneId
}

export function deleteArtifact(id: string) {
  update(x => ({ ...x, deleted: x.deleted.includes(id) ? x.deleted : [...x.deleted, id] }))
}

export function restoreArtifact(id: string) {
  update(x => ({ ...x, deleted: x.deleted.filter(d => d !== id) }))
}

export function setPinned(id: string, pinned: boolean) {
  update(x => ({ ...x, pins: { ...x.pins, [id]: pinned } }))
}

export function renameArtifact(id: string, name: string) {
  update(x => ({ ...x, names: { ...x.names, [id]: name } }))
}
