// Static checks: type-check, the generated frame map is current, verify.sh has no FAIL under app/src, gallery pages
// follow the convention, and component files carry data-node-id.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Component files that render no Figma node of their own (layout helpers, icon sets, the toast Figma does not draw). */
const NO_NODE_ID = new Set(['buttons/ButtonGroup.tsx', 'composer/icons.tsx', 'form/icons.tsx', 'overlays/toast/Toast.tsx'])

function walk(dir, ext, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, ext, out)
    else if (p.endsWith(ext)) out.push(p)
  }
  return out
}

export default async function staticSuite({ rec, root }) {
  const app = join(root, 'app')

  const tsc = spawnSync('npx', ['tsc', '-p', 'tsconfig.json', '--noEmit'], { cwd: app, encoding: 'utf8' })
  rec.check('tsc --noEmit is clean', tsc.status === 0, (tsc.stdout + tsc.stderr).trim().split('\n').slice(0, 15).join('\n'))

  const gen = spawnSync('python3', ['tools/gen-frames.py', '--check'], { cwd: root, encoding: 'utf8' })
  rec.check('frames.generated.ts is up to date with the plan and journey.json (gen-frames.py --check)', gen.status === 0, (gen.stdout + gen.stderr).trim())

  const verify = spawnSync('bash', ['tools/verify.sh'], { cwd: root, encoding: 'utf8' })
  const lines = (verify.stdout + verify.stderr).replace(/\x1b\[[0-9;]*m/g, '').split('\n')
  const appFails = lines.filter(l => l.startsWith('FAIL') && l.includes('app/src'))
  rec.check('verify.sh: no FAIL line under app/src', appFails.length === 0, appFails.slice(0, 20).join('\n'))
  rec.note('verify.sh FAIL lines elsewhere (known, outside the app)', lines.filter(l => l.startsWith('FAIL') && !l.includes('app/src')).length)

  // gallery convention: default export + meta, and every stylesheet a page imports exists (one broken import breaks the
  // whole eager glob, and with it the build and every page)
  const pagesDir = join(app, 'src', 'gallery', 'pages')
  const bad = []
  for (const f of readdirSync(pagesDir).filter(f => f.endsWith('.tsx'))) {
    const src = readFileSync(join(pagesDir, f), 'utf8')
    if (!/export default function/.test(src)) bad.push(`${f}: no default-exported component`)
    if (!/export const meta: GalleryMeta = \{/.test(src)) bad.push(`${f}: no \`export const meta: GalleryMeta\``)
    if (!/group: '[^']+'/.test(src)) bad.push(`${f}: meta has no group`)
    if (!/figmaNodeIds: \[/.test(src)) bad.push(`${f}: meta has no figmaNodeIds`)
    for (const m of src.matchAll(/import '(\.\/[^']+\.css)'/g)) if (!existsSync(join(pagesDir, m[1]))) bad.push(`${f}: imports missing ${m[1]}`)
  }
  rec.check('gallery pages export a component and a meta { title, figmaNodeIds, group }, and their CSS exists', bad.length === 0, bad.join('\n'))

  const components = join(app, 'src', 'components')
  const missing = walk(components, '.tsx').map(p => relative(components, p)).filter(f => {
    if (NO_NODE_ID.has(f)) return false
    const src = readFileSync(join(components, f), 'utf8')
    return /export function [A-Z]/.test(src) && !/data-node-id/.test(src)
  })
  rec.check('every component file renders a data-node-id (or is listed as having no Figma node)', missing.length === 0, missing.join(', '))

  // every co-located stylesheet a component or screen imports exists
  const broken = []
  for (const p of walk(join(app, 'src'), '.tsx').concat(walk(join(app, 'src'), '.ts'))) {
    const src = readFileSync(p, 'utf8')
    for (const m of src.matchAll(/import '(\.{1,2}\/[^']+\.css)'/g)) if (!existsSync(join(p, '..', m[1]))) broken.push(`${relative(app, p)} -> ${m[1]}`)
  }
  rec.check('every CSS import in app/src resolves', broken.length === 0, broken.join('\n'))
}
