import { useMemo } from 'react'
import { stepName } from '../../figma/frames'
import { auditFixes, auditFrames, auditScripts, journeyCoverage } from '../../review/audit'
import { Link } from '../../router/Link'
import { buildUrl } from '../../router/uiParams'
import { GallerySection } from '../GalleryPage'
import { GALLERY_PAGES, PLANNED_PAGES } from '../registry'
import type { GalleryMeta } from '../registry'
import './build-coverage.css'

export const meta: GalleryMeta = {
  title: 'Build coverage',
  figmaNodeIds: ['1707:115989'],
  group: 'Review harness',
  description:
    'Which Figma frames are built screens, which are drawn only in part (a built screen that does not draw some of the ' +
    'frame URL\'s keys yet) and which still show the "Not built yet" placeholder, journey by journey; and ' +
    'the contracts between the frame map, the fixtures, the chat scripts and the FIXES ledger (src/review/audit.ts). ' +
    'The regression suite (tools/tests/eb-app) reads this page: every check below must say OK.',
}

export default function BuildCoverage() {
  const { frames, journeys, fixes, scripts, summary } = useMemo(() => {
    const frames = auditFrames()
    const fixes = auditFixes()
    const journeys = journeyCoverage(frames)
    const scripts = auditScripts()
    const count = (k: string) => frames.filter(f => f.kind === k).length
    const distinct = new Set(frames.map(f => f.href)).size
    const summary = {
      frames: frames.length, urls: distinct,
      screen: count('screen'), partial: count('partial'), gallery: count('gallery'), placeholder: count('placeholder'), redirect: count('redirect'),
      routeProblems: frames.reduce((n, f) => n + f.problems.length, 0),
      fixesInLedger: fixes.ledger, fixIdsUsed: fixes.used.length, unknownFixIds: fixes.unknown, duplicateFixIds: fixes.duplicates,
      galleryPages: GALLERY_PAGES.length, plannedGalleryPages: PLANNED_PAGES.map(p => p.slug),
    }
    return { frames, journeys, fixes, scripts, summary }
  }, [])
  const withProblems = frames.filter(f => f.problems.length)

  const checks: { id: string; label: string; ok: boolean; detail: string }[] = [
    { id: 'frames-resolve', label: 'Every frame URL resolves to a screen, a gallery page or the placeholder', ok: summary.redirect === 0, detail: `${summary.redirect} redirect` },
    { id: 'fixtures-known', label: 'Every chat, beat, artifact, compose preset, seed and URL key in a frame URL is known', ok: summary.routeProblems === 0, detail: `${summary.routeProblems} problems` },
    { id: 'fix-ids-registered', label: 'Every fix id the fixtures name is in the FIXES ledger', ok: fixes.unknown.length === 0, detail: fixes.unknown.join(', ') || `${fixes.used.length} ids` },
    { id: 'fix-ids-unique', label: 'No fix id is registered twice', ok: fixes.duplicates.length === 0, detail: fixes.duplicates.join(', ') || `${fixes.ledger} fixes` },
    { id: 'scripts-play', label: 'Every chat script plays: each at= id names one beat, live play never stalls, no beat is held 0 ms', ok: scripts.length === 0, detail: scripts.join('; ') || 'no problems' },
  ]

  return (
    <div className="cov" data-coverage={JSON.stringify({ summary, checks: checks.map(c => ({ id: c.id, ok: c.ok, detail: c.detail })) })}>
      <GallerySection title="Contracts">
        <ul className="cov-checks">
          {checks.map(c => (
            <li key={c.id} className={'cov-check' + (c.ok ? ' is-ok' : ' is-fail')} data-check={c.id} data-ok={c.ok}>
              <span className="cov-check__state">{c.ok ? 'OK' : 'FAIL'}</span>
              <span>{c.label}</span>
              <span className="cov-check__detail">{c.detail}</span>
            </li>
          ))}
        </ul>
      </GallerySection>

      <GallerySection
        title="Frames by journey"
        description={`${summary.frames} frames on ${summary.urls} URLs: ${summary.screen} built screens, ${summary.partial} drawn in part (a built screen that does not draw every key of the frame URL yet; not counted built), ${summary.gallery} gallery pages, ${summary.placeholder} placeholders.`}
      >
        <div className="cov-table-wrap">
          <table className="cov-table">
            <thead>
              <tr><th scope="col">Journey</th><th scope="col">Frames</th><th scope="col">Built</th><th scope="col">In part</th><th scope="col">Gallery</th><th scope="col">Placeholder</th><th scope="col">Problems</th></tr>
            </thead>
            <tbody>
              {journeys.map(j => (
                <tr key={j.id} data-journey={j.id}>
                  <th scope="row"><Link to={buildUrl('/gallery/frame-map', { sheet: j.id })}>{j.id}</Link></th>
                  <td>{j.frames}</td>
                  <td>{j.screen}</td>
                  <td>{j.partial}</td>
                  <td>{j.gallery}</td>
                  <td>{j.placeholder}</td>
                  <td className={j.problems ? 'cov-bad' : undefined}>{j.problems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GallerySection>

      {withProblems.length > 0 && (
        <GallerySection title="Frame URLs with problems">
          <ul className="cov-problems">
            {withProblems.map(f => (
              <li key={`${f.frame.journey}/${f.frame.step}`}>
                <b>{stepName(f.frame)}</b> <Link to={f.href}>#{f.href}</Link>: {f.problems.join('; ')}
              </li>
            ))}
          </ul>
        </GallerySection>
      )}

      {summary.plannedGalleryPages.length > 0 && (
        <GallerySection title="Reference sheets without a gallery page" description="The plan routes these Figma sheets to /gallery/<name>; they show the placeholder until a page exists.">
          <p className="cov-slugs">{summary.plannedGalleryPages.map(s => <Link key={s} to={`/gallery/${s}`}>{s}</Link>)}</p>
        </GallerySection>
      )}
    </div>
  )
}
