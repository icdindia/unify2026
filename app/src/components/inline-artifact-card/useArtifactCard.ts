import { useMemo } from 'react'
import { artifact, inlineMeta, type ArtifactId } from '../../fixtures/artifacts'
import { pick, useFixPredicate } from '../../fixtures/drift'
import { useArtifactCardFix } from './fixes'
import { GLYPH_OF_TYPE, type ArtifactGlyph } from './glyphs'

export type ArtifactCardData = { id: ArtifactId; name: string; meta: string; glyph: ArtifactGlyph }

/**
 * Name, meta and glyph of an artifact's inline card, resolved against the review bar's switch. `drawn` is what one
 * Figma frame draws where it departs from the artifact's data (As designed only):
 *   step 15: { glyph: 'html', meta: 'Interactive HTML' }   steps 19 / 20: { glyph: 'doc' }   16-18: nothing
 * With fixes on, the glyph follows the type (fix artifact-glyph-per-type) and the meta is the full line (inline-card-meta).
 */
export function useArtifactCard(id: ArtifactId, drawn?: { glyph?: ArtifactGlyph; meta?: string }): ArtifactCardData {
  const applies = useFixPredicate()
  const glyphFix = useArtifactCardFix('artifact-glyph-per-type')
  const metaFix = useArtifactCardFix('inline-card-meta')
  return useMemo(() => {
    const a = artifact(id)
    const version = pick(a.version, applies)
    const full = inlineMeta(a, version)
    return {
      id,
      name: pick(a.name, applies),
      meta: !metaFix && drawn?.meta ? drawn.meta : full,
      glyph: !glyphFix && drawn?.glyph ? drawn.glyph : GLYPH_OF_TYPE[a.type],
    }
  }, [id, drawn?.glyph, drawn?.meta, applies, glyphFix, metaFix])
}
