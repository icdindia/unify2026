import { useId, type CSSProperties, type MouseEvent } from 'react'
import { Button } from '../buttons/Button'
import { IconButton } from '../buttons/IconButton'
import { cx } from '../buttons/cx'
import { useArtifactCardFix } from './fixes'
import { CARD_VARIANT_OF_GLYPH, GLYPHS, type ArtifactGlyph } from './glyphs'
import { Download16 } from './icons'
import './inline-artifact-card.css'

/** "Inline Artifact Cards" set 5288:119600 (local; State=DOC 5288:119599 … Application-HTML 5288:119597). */
export const INLINE_ARTIFACT_CARD_SET = '5288:119600'

export type InlineArtifactCardVariant = 'chat' | 'split' | 'panel'

export type InlineArtifactCardProps = {
  /** Title line, e.g. "Pipeline Command". */
  name: string
  /** Supporting line, e.g. "Interactive HTML • 123 KB • Version 1" (fixtures: inlineMeta). */
  meta: string
  /** The type mark on the paper sheet (glyphs.ts; GLYPH_OF_TYPE / GLYPH_OF_STATE map fixture types to it). */
  glyph: ArtifactGlyph
  /**
   * chat: in an answer, up to 520 wide, a "Download" text button (15, 16, 15a).
   * split: in the narrow split chat column, full width, a download icon button (20).
   * panel: an artifact row of the files panel, full width, a download icon button and the panel's row hover (17, 18).
   */
  variant?: InlineArtifactCardVariant
  /**
   * v1: the 40px paper sheet every journey frame draws (15-20, 15a). v2: the newer spec of 16a (14876:285160): a 50px
   * sheet and the Download button bordered at rest.
   */
  generation?: 'v1' | 'v2'
  /** Pinned review state (hover=card:<id>); real :hover and :focus work without it. */
  state?: 'default' | 'hover' | 'button-hover'
  /** How card hover draws the chat Download: bordered (16, the journey; default) or still a text button (15a "card hover"). */
  hoverDownload?: 'bordered' | 'text'
  /** Opens the artifact (the card itself is the button). */
  onOpen?: () => void
  onDownload?: () => void
  /** Accessible name of the open action. Default "Open <name>". */
  openLabel?: string
  /** Hide the download action (a card that is being generated). */
  noDownload?: boolean
  /** Figma node of this instance; defaults to the set variant of the glyph. */
  nodeId?: string
  className?: string
  style?: CSSProperties
}

/**
 * Inline artifact card: the artifact an answer produced, as a 60px row with the type mark on a paper sheet, the name and
 * its meta, and Download. The whole card opens the artifact (one stretched button), Download is its own button above it.
 * Hover: workspace-grey card, border-primary and shadow, a second sheet fanning out behind the first, and (chat) the
 * Download text button gains its border.
 */
export function InlineArtifactCard({
  name, meta, glyph, variant = 'chat', generation = 'v1', state = 'default', hoverDownload = 'bordered',
  onOpen, onDownload, openLabel, noDownload, nodeId, className, style,
}: InlineArtifactCardProps) {
  const metaId = useId()
  const steady = useArtifactCardFix('inline-card-hover-steady')
  const g = GLYPHS[glyph]
  const stop = (e: MouseEvent) => e.stopPropagation()
  return (
    <div
      className={cx(
        'iac', `iac--${variant}`, `iac--${generation}`, hoverDownload === 'text' && 'iac--hover-text', steady && 'iac--steady',
        state === 'hover' && 'is-hover', state === 'button-hover' && 'is-hover is-button-hover', className,
      )}
      data-node-id={nodeId ?? CARD_VARIANT_OF_GLYPH[glyph]}
      style={style}
    >
      <button
        type="button" className="iac__open" aria-label={openLabel ?? `Open ${name}`} aria-describedby={metaId}
        onClick={onOpen}
      >
        <span className="iac__stack" aria-hidden="true">
          <span className="iac__sheet iac__sheet--back" />
          <span className="iac__sheet iac__sheet--front">
            <img className={`iac__glyph iac__glyph--${g.shape}`} src={g.url} alt="" draggable={false} />
          </span>
        </span>
        <span className="iac__text">
          <span className="iac__title" title={name}>{name}</span>
          <span className="iac__meta" id={metaId}>{meta}</span>
        </span>
      </button>
      {!noDownload && (
        <span className="iac__actions">
          {variant === 'chat' ? (
            <Button
              label="Download" kind={generation === 'v2' ? 'secondary' : 'tertiary'} className="iac__dl"
              aria-label={`Download ${name}`} onClick={e => { stop(e); onDownload?.() }}
            />
          ) : (
            <IconButton size="sm" className="iac__dli" aria-label={`Download ${name}`} onClick={e => { stop(e); onDownload?.() }}>
              <Download16 />
            </IconButton>
          )}
        </span>
      )}
    </div>
  )
}
