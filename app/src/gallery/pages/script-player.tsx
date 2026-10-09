import { useId, useMemo, type ChangeEvent } from 'react'
import { fixesMode, useStore } from '../../app/store'
import { SecondaryButton } from '../../components/buttons'
import { auditFixes } from '../../review/audit'
import {
  CHAT_IDS, PEOPLE, SCRIPTS, SEED_DEFS, isChatId, useFixPredicate, type BeatTrigger, type ChatId,
} from '../../fixtures'
import { itemText, scriptProblems, useBeatPlayer, useThinkingLoop, type BeatPlayer } from '../../playback'
import { navigate, useRoute } from '../../router/router'
import { GallerySection } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './script-player.css'

export const meta: GalleryMeta = {
  title: 'Script player',
  figmaNodeIds: ['8863:218607', '484:117565', '3518:217901'],
  group: 'Playback',
  description:
    'The chat scripts (src/fixtures/scripts) played as plain text by useBeatPlayer with the Figma timings: thinking glyph ' +
    'loop 0.8s, Agent COT Step 1 → 4s → Step 2, then 2.5s per step. ?at=<beat> renders a beat instantly (no timers), ' +
    '?seed= applies scenario seeds, and the review bar’s "With fixes" switch resolves copy drift.',
  sheets: CHAT_IDS.map(id => ({ id, label: id })),
}


const triggerText = (t: BeatTrigger): string =>
  t.after === 'start' ? 'start'
    : t.after === 'time' ? `+${t.ms / 1000}s (${t.source}${t.note ? `: ${t.note}` : ''})`
      : `waits for ${t.action}`

/** The route's query with some keys changed, keeping the gallery path. */
function hrefWith(path: string, query: URLSearchParams, changes: Record<string, string | null>): string {
  const q = new URLSearchParams(query)
  for (const [k, v] of Object.entries(changes)) {
    if (v === null || v === '') q.delete(k)
    else q.set(k, v)
  }
  const s = q.toString().replace(/%2C/gi, ',').replace(/%3A/gi, ':')
  return path + (s ? `?${s}` : '')
}

export default function ScriptPlayerGallery() {
  const route = useRoute()
  const sheet = route.query.get('sheet')
  const chat: ChatId = sheet && isChatId(sheet) ? sheet : 'commit' // unknown sheets (also "constructor", "__proto__") fall back
  const at = route.query.get('at')
  const seeds = route.query.get('seed')
  const speed = Number(route.query.get('speed')) || 1
  const player = useBeatPlayer(SCRIPTS[chat], { at, seeds, speed })
  const go = (changes: Record<string, string | null>) => navigate(hrefWith(route.path, route.query, changes), { replace: true })

  return (
    <>
      <GallerySection
        title={`Chat “${player.view.title}”`}
        description="Play runs the timed beats; a beat that waits for a user action stops until Next beat. Pick a beat to render it instantly (at=)."
      >
        <Controls player={player} at={at} seeds={seeds} speed={speed} go={go} />
        <div className="sp-grid">
          <BeatList player={player} />
          <Transcript player={player} />
        </div>
      </GallerySection>
      <GallerySection title="Seeds" description="Comma list in the seed field (or ?seed=). Seeds in one group replace each other.">
        <ul className="sp-seeds">
          {SEED_DEFS.map(s => (
            <li key={s.id}><code>{s.id}</code>{s.group ? <span className="sp-muted"> · {s.group}</span> : null} — {s.label}</li>
          ))}
          <li><code>unpinned:&lt;pin&gt;</code> — drag-unpin 02; <code>order:&lt;a.b.c&gt;</code> — drag-pinned 03</li>
        </ul>
      </GallerySection>
      <ScriptChecks />
      <FixIds />
    </>
  )
}

/** scriptProblems() for every chat: at= ids are unique, live play cannot stall, and every beat stays on screen > 0 ms. */
function ScriptChecks() {
  const rows = useMemo(() => CHAT_IDS.map(id => ({ id, problems: scriptProblems(SCRIPTS[id]) })), [])
  const bad = rows.filter(r => r.problems.length).length
  return (
    <GallerySection
      title="Script checks"
      description={bad
        ? `${bad} of ${rows.length} scripts would misplay.`
        : `${rows.length} scripts: every at= id names one beat, live play never stalls, and every beat is on screen for more than 0 ms.`}
    >
      <ul className="sp-seeds" aria-label="Script checks">
        {rows.map(r => (
          <li key={r.id} data-script-check={r.id} data-ok={r.problems.length === 0}>
            <code>{r.id}</code> — {r.problems.length ? r.problems.join('; ') : 'OK'}
          </li>
        ))}
      </ul>
    </GallerySection>
  )
}

function Controls({ player, at, seeds, speed, go }: {
  player: BeatPlayer; at: string | null; seeds: string | null; speed: number; go: (c: Record<string, string | null>) => void
}) {
  const ids = { beat: useId(), speed: useId(), seed: useId() }
  const mode = useStore(fixesMode)
  const { playing, waitingFor, next, instant } = player
  const status = instant
    ? `Showing beat “${player.beat.id}” instantly (at=). Play or Next beat to continue live.`
    : waitingFor
      ? `Waiting: ${waitingFor.hint}.`
      : next && playing && next.trigger.after === 'time'
        ? `Playing: next beat “${next.id}” in ${next.trigger.ms / 1000 / speed}s.`
        : next ? 'Paused.' : 'End of script.'
  return (
    <div className="sp-controls">
      <div className="sp-row" role="toolbar" aria-label="Playback">
        <SecondaryButton size="sm" label={playing ? 'Pause' : 'Play'} onClick={playing ? player.pause : player.play} disabled={!next} />
        <SecondaryButton size="sm" label="Next beat" onClick={() => player.advance()} disabled={!next} />
        <SecondaryButton size="sm" label="Restart" onClick={() => { if (at) go({ at: null }); player.reset() }} />
        {/* the review bar's "As designed / With fixes" switch: resolves copy drift */}
        <SecondaryButton
          size="sm"
          label="With fixes"
          aria-pressed={mode === 'on'}
          onClick={() => fixesMode.set(mode === 'on' ? 'off' : 'on')}
        />
      </div>
      <div className="sp-row">
        <label className="sp-field" htmlFor={ids.beat}>
          <span>Beat (at=)</span>
          <select id={ids.beat} value={at ?? ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => go({ at: e.target.value || null })}>
            <option value="">— play from the start —</option>
            {player.beats.map(b => <option key={b.id} value={b.id}>{b.id}{b.aliases ? ` (= ${b.aliases.join(', ')})` : ''}</option>)}
          </select>
        </label>
        <label className="sp-field" htmlFor={ids.speed}>
          <span>Speed</span>
          <select id={ids.speed} value={String(speed)} onChange={e => go({ speed: e.target.value === '1' ? null : e.target.value })}>
            {[1, 2, 4, 10].map(s => <option key={s} value={s}>{s}×</option>)}
          </select>
        </label>
        <label className="sp-field sp-field--grow" htmlFor={ids.seed}>
          <span>Seeds (seed=)</span>
          <input
            id={ids.seed}
            defaultValue={seeds ?? ''}
            key={seeds ?? ''}
            placeholder="e.g. typing-2,crowd"
            onKeyDown={e => { if (e.key === 'Enter') go({ seed: (e.target as HTMLInputElement).value.trim() || null }) }}
            onBlur={e => { if ((e.target.value.trim() || null) !== seeds) go({ seed: e.target.value.trim() || null }) }}
          />
        </label>
      </div>
      <p className="sp-status" role="status" aria-live="polite">{status}</p>
    </div>
  )
}

function BeatList({ player }: { player: BeatPlayer }) {
  return (
    <ol className="sp-beats" aria-label="Beats">
      {player.beats.map((b, i) => (
        <li key={b.id} className={i === player.index ? 'sp-beat sp-beat--on' : i < player.index ? 'sp-beat sp-beat--past' : 'sp-beat'}
            aria-current={i === player.index ? 'step' : undefined}>
          <span className="sp-beat__id">{b.id}{b.aliases ? ` = ${b.aliases.join(', ')}` : ''}</span>
          <span className="sp-beat__label">{b.label}</span>
          <span className="sp-muted">{triggerText(b.trigger)}{b.figma.length ? ` · ${b.figma.join(', ')}` : ''}</span>
        </li>
      ))}
    </ol>
  )
}

function Transcript({ player }: { player: BeatPlayer }) {
  const { view, instant } = player
  const applies = useFixPredicate()
  const running = view.items.find(i => i.kind === 'assistant' && i.id === view.running)
  const frame = useThinkingLoop(!!running && running.kind === 'assistant' && running.step === 1, instant)
  const header = [
    view.header.people.map(p => PEOPLE[p].initial).join(' ') + (view.header.more ? ` +${view.header.more}` : ''),
    `cost ${view.cost.label} (${view.cost.state})`,
    view.generating ? 'composer: generating (Stop)' : 'composer: default',
    view.assistantReplies ? 'Assistant Replies on' : 'Assistant Replies off',
  ].filter(Boolean)
  return (
    <section className="sp-transcript" aria-label="Transcript">
      <p className="sp-muted">{header.join(' · ')}</p>
      {view.items.length === 0 && <p className="sp-muted">(empty thread)</p>}
      {view.items.map(item => (
        <pre key={item.id} className={`sp-item sp-item--${item.kind}`}>
          {itemText(item, applies)}
          {item.kind === 'assistant' && item.id === view.running && item.step === 1 ? `  [glyph frame ${frame}]` : ''}
        </pre>
      ))}
      {view.question && (
        <pre className="sp-item sp-item--question">
          {`Question card: ${view.question.question}\n` + view.question.options.map((o, i) => `  ${i + 1}. ${o}`).join('\n') + `\n  … ${view.question.freeText} · Skip`}
        </pre>
      )}
      {view.typing.people.length > 0 && (
        <p className="sp-typing">{view.typing.people.map(p => PEOPLE[p].initial).join(' ')}{view.typing.more ? ` +${view.typing.more}` : ''} — {view.typing.line}</p>
      )}
    </section>
  )
}

/** Every fix id the fixture data names in a Drift, and whether the FIXES ledger registers it (review/audit.ts). */
function FixIds() {
  const { used, unknown: missing } = useMemo(() => auditFixes(), [])
  return (
    <GallerySection
      title="Fix ids in the data"
      description={missing.length ? `Not registered in FIXES: ${missing.join(', ')}` : `${used.length} fix ids, all registered in FIXES.`}
    >
      <p className="sp-ids">{used.map(id => <code key={id}>{id}</code>)}</p>
    </GallerySection>
  )
}
