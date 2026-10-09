import { useCallback, useEffect, useRef, useState } from 'react'
import { cx } from '../buttons/cx'
import { CloseIcon, FileIcon, PdfIcon, RetryIcon, SpinnerIcon } from './icons'
import type { ComposerAttachment } from './types'
import './attachment-thumb.css'

type ThumbProps = {
  attachment: ComposerAttachment
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  /** Review only: pin the hover look (the image's 30% scrim). */
  hover?: boolean
}

/** Loading indicator / Style=Line simple, Size=xs, with its name for screen readers. */
export const Spinner = ({ label = 'Uploading' }: { label?: string }) => (
  <span className="composer-spinner" role="img" aria-label={label}><SpinnerIcon /></span>
)

/**
 * Attachments (set 144:37183) / Placement=With Reply Box, Size=md.
 *   Type=Image Thumbnail: 48x48, radius 8, border-tertiary ring inside; Hover adds a 30% black scrim; Loading is the
 *   empty tile with the 20px spinner centred.
 *   Type=File: 300x48 card, padding 8, radius 8, border-tertiary ring; a 32px type tile (radius 6) + name / meta at
 *   12/16; Loading swaps the tile for the spinner; Error rings the card in border-error-solid, reads
 *   "File upload failed" and offers a retry.
 * Both carry the 20px round remove button (Small Icon Button / Size=md) overhanging the top-right corner by 6.
 */
export function AttachmentThumb({ attachment: a, onRemove, onRetry, hover }: ThumbProps) {
  const status = a.status ?? 'ready'
  const loading = status === 'loading'
  const error = status === 'error'
  const remove = (
    <button type="button" className="cattach__remove" aria-label={`Remove ${a.name}`} data-node-id="1:33" onClick={() => onRemove?.(a.id)}>
      <CloseIcon />
    </button>
  )

  if (a.kind === 'image') {
    return (
      <div
        className={cx('cattach', 'cattach--image', loading && 'is-loading', error && 'is-error', hover && 'is-hover')}
        data-node-id="144:37183"
        data-status={status}
      >
        <div className="cattach__media">
          {loading ? <Spinner label={`Uploading ${a.name}`} /> : a.src ? <img src={a.src} alt={a.name} /> : <span className="composer-sr">{a.name}</span>}
        </div>
        {remove}
      </div>
    )
  }

  return (
    <div className={cx('cattach', 'cattach--file', loading && 'is-loading', error && 'is-error')} data-node-id="144:37183" data-status={status}>
      {loading ? (
        <span className="cattach__wait"><Spinner label={`Uploading ${a.name}`} /></span>
      ) : (
        <span className={cx('cattach__tile', `cattach__tile--${a.fileType ?? 'file'}`)} aria-hidden="true">
          {a.fileType === 'pdf' ? <PdfIcon /> : <FileIcon />}
        </span>
      )}
      <span className="cattach__text">
        <span className="cattach__name">{a.name}</span>
        <span className="cattach__meta">{error ? 'File upload failed' : a.meta}</span>
      </span>
      {error && (
        <button type="button" className="cattach__retry" aria-label={`Retry ${a.name}`} onClick={() => onRetry?.(a.id)}>
          <RetryIcon />
        </button>
      )}
      {remove}
    </div>
  )
}

type StripProps = {
  attachments: ComposerAttachment[]
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
}

/**
 * Attachments Desktop (set 144:37169), Property 1=More Attachments: the row above the message, 58 tall (6 above the
 * tiles for the overhanging remove buttons, 4 below), tiles 12 apart from a 4px inset. It scrolls sideways, and the
 * 38px white shade at its right edge shows while more tiles wait past it.
 */
export function AttachmentStrip({ attachments, onRemove, onRetry }: StripProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)
  const measure = useCallback(() => {
    const el = scroller.current
    if (el) setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])
  useEffect(() => {
    measure()
    const el = scroller.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, attachments.length])

  return (
    <div className="cattachments" data-node-id="144:37169">
      <div className="cattachments__scroll" ref={scroller} onScroll={measure}>
        <ul className="cattachments__row" aria-label="Attachments">
          {attachments.map(a => (
            <li key={a.id}><AttachmentThumb attachment={a} onRemove={onRemove} onRetry={onRetry} /></li>
          ))}
        </ul>
      </div>
      {more && <span className="cattachments__shade" aria-hidden="true" />}
    </div>
  )
}
