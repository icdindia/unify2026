import { CHARTS } from '../fixtures/charts'
import { resolveDrift, type Resolved } from '../fixtures/drift'
import { ARTIFACTS, inlineMeta } from '../fixtures/artifacts'
import { PEOPLE } from '../fixtures/people'
import { thoughtsAt, type Answer, type Block, type Inline, type ThreadItem } from '../fixtures/script'
import { COT_LABELS } from '../fixtures/copy'

// Plain-text renderings of resolved thread content: for the gallery transcript, copy-to-clipboard, and accessible
// names. Every function takes already-resolved data (see useBeatPlayer's `view`).

export function inlineText(runs: Resolved<Inline>[]): string {
  return runs
    .map(r => (typeof r === 'string' ? r : 'b' in r ? r.b : 'mention' in r ? `@${r.label}` : `[${r.cite.label}${r.cite.more ? ` +${r.cite.more}` : ''}]`))
    .join('')
}

type Applies = (fix: string) => boolean
const asDesigned: Applies = () => false

export function blockText(b: Resolved<Block>, applies: Applies = asDesigned): string {
  switch (b.kind) {
    case 'p': return inlineText(b.inl)
    case 'ul': return b.items.map(i => `• ${inlineText(i)}`).join('\n')
    case 'headline': return `# ${b.text}`
    case 'subtitle': return b.text
    case 'kpis': return b.tiles.map(t => `[${t.label}: ${t.value}${t.caption ? ` ${t.caption}` : ''}${t.delta ? ` ${t.delta}` : ''}]`).join(' ')
    case 'chart': return `[chart: ${b.chart}${Object.hasOwn(CHARTS, b.chart) ? '' : ' (unknown)'}]`
    case 'artifact': {
      const a = resolveDrift(ARTIFACTS[b.artifact], applies)
      return `[artifact card: ${a.name} · ${inlineMeta(a, a.version)}]`
    }
  }
}

export function answerText(a: Resolved<Answer>, applies: Applies = asDesigned): string {
  const lines = a.blocks.map(b => blockText(b, applies))
  if (!a.plain) lines.push(`(${a.cost} · ${a.sources} Sources)`)
  if (a.suggested?.length) lines.push('Suggested actions: ' + a.suggested.join(' / '))
  return lines.join('\n')
}

/** One thread item as text, with the speaker. `applies` resolves the artifact cards it mentions. */
export function itemText(item: Resolved<ThreadItem>, applies: Applies = asDesigned): string {
  switch (item.kind) {
    case 'user': return `${PEOPLE[item.from].name}: ${inlineText(item.body)}`
    case 'system': return `— ${item.text} —`
    case 'starters': return `Assistant: ${item.intro}\n[starters: ${item.options.join(', ')}]`
    case 'assistant': {
      const { step, cot } = item
      if (step === 1) return `Assistant: ${COT_LABELS.thinking}`
      if (step === 2) return `Assistant: ${COT_LABELS.consulting}`
      if (step === 'done') {
        return `Assistant${item.answer?.plain ? '' : ` [${cot.summary} ›]`}${item.streaming ? ' (still generating)' : ''}:\n${item.answer ? answerText(item.answer, applies) : ''}`
      }
      if (step === 'complete-1') return 'Assistant [Thoughts ˅]'
      if (step === 'complete-2') return `Assistant [${cot.header} ˅]`
      const shown = thoughtsAt(cot.thoughts, step)
      const rows = shown.map((t, i) => {
        const src = step !== 'lines' && i === 0 && t.sources ? `\n    ${t.sources.model}\n` + t.sources.rows.map(r => `    · ${r.title} — ${r.meta}`).join('\n') : ''
        return `  ↳ ${t.text}${src}`
      })
      return `Assistant [${cot.header}]\n${rows.join('\n')}`
    }
  }
}
