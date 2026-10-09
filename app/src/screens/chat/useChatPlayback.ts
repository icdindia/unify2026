import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fixesMode, useStore } from '../../app/store'
import { fixApplies, resolveDrift, type Resolved } from '../../fixtures/drift'
import type { UserAction } from '../../fixtures/script'
import { scenarioOf } from '../../fixtures/seeds'
import { stateAt } from '../../playback/engine'
import { useBeatPlayer, type BeatPlayer } from '../../playback/useBeatPlayer'
import { viewOf, type ChatView } from '../../playback/view'
import { setUi } from '../../router/uiParams'
import { clearPlay, wantsPlay } from './playIntent'
import { beatIdOf, CHAT, DEFAULT_BEAT, SCRIPT, urlAtOf } from './route'

export type ChatPlayback = {
  player: BeatPlayer
  /** The chat at the beat, resolved for the switch, with the frame's own drawn values (drawsFixed) applied as designed. */
  view: Resolved<ChatView>
  /** A user action releases the next beat (Send, Invite). Returns false when the script waits for something else. */
  act: (action: UserAction) => boolean
}

const NO_SEEDS = scenarioOf(null)

/**
 * The commit script on screen, kept in step with the URL's at= (BUILD-PLAN 2.1):
 * - at= opened from outside (a link, the review stepper, Back) renders that beat still;
 * - the user's Send on the landing page plays live from at=sent (playIntent);
 * - while it plays, each beat rewrites at= in place (timed beats replace the entry; a beat a user action released adds
 *   one, so Back returns to before the action), using the at= value the frames use for that beat (cot-1 for Step 3).
 * Seeds are not drawn by these screens (routes report seed= as ignored), so the view is always the plain chat.
 */
export function useChatPlayback(urlAt: string | null, drawsFixed: readonly string[] = []): ChatPlayback {
  const initial = useRef(urlAt ?? DEFAULT_BEAT).current
  const player = useBeatPlayer(SCRIPT, { at: initial, autoplay: false })

  // a URL change this hook did not write: show that beat, still
  const written = useRef<string | null>(urlAt)
  const [seen, setSeen] = useState(urlAt)
  if (urlAt !== seen) {
    setSeen(urlAt)
    if (urlAt !== written.current) {
      written.current = urlAt
      player.seek(urlAt ?? DEFAULT_BEAT)
    }
  }

  // reached by Send on the landing page: play live from here
  useEffect(() => {
    if (wantsPlay(CHAT)) { player.play(); clearPlay() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the beat on screen goes into the URL
  const push = useRef(false)
  const beatId = player.beat.id
  useEffect(() => {
    if (beatIdOf(urlAt) === beatId) return
    const want = urlAtOf(beatId)
    written.current = want
    setUi({ at: want }, { push: push.current })
    push.current = false
  }, [beatId, urlAt])

  const act = useCallback((action: UserAction) => {
    push.current = true
    const ok = player.advance(action)
    if (!ok) push.current = false
    return ok
  }, [player])

  // the view, resolved against the switch plus the drifts this frame draws fixed (frames disagree on copy)
  const mode = useStore(fixesMode)
  const fixedKey = drawsFixed.join(',')
  const view = useMemo(() => {
    const forced = new Set(fixedKey ? fixedKey.split(',') : [])
    return resolveDrift(viewOf(stateAt(SCRIPT, player.index), NO_SEEDS), fix => forced.has(fix) || fixApplies(fix, mode))
  }, [player.index, mode, fixedKey])

  return { player, view, act }
}
