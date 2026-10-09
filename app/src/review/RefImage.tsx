import { useCallback, useRef, useState } from 'react'
import type { FrameRef } from '../figma/types'

// Reference PNGs of the Figma frames live in app/figma-ref/chat-artifacts (about 21 MB). They are never imported, so
// none of them lands in the bundle or in dist/eb-app.html: the <img> points at the file by path instead.
//   dev server (root app/): /figma-ref/chat-artifacts/<ref>, shown straight away.
//   a build: nothing is requested until the reviewer asks (a 404 would be console noise wherever the build is opened
//   away from the repo); then dist/eb-app.html tries ../app/figma-ref/…, dist/eb-app/index.html ../../app/figma-ref/….
const DEV_BASE = '/figma-ref/chat-artifacts/'
const BUILD_BASES = ['../app/figma-ref/chat-artifacts/', '../../app/figma-ref/chat-artifacts/']

export const refRepoPath = (ref: string) => `app/figma-ref/chat-artifacts/${ref}`

type Props = { frame: Pick<FrameRef, 'ref' | 'size'>; alt: string; className?: string }

export function RefImage({ frame, alt, className }: Props) {
  const bases = import.meta.env.DEV ? [DEV_BASE] : BUILD_BASES
  const [attempt, setAttempt] = useState(import.meta.env.DEV ? 0 : -1) // -1: not asked for yet (builds)

  // "Show it" goes away when pressed, so focus moves on to what replaces it: the image (each fallback path remounts
  // it) or, when no path reaches the file, the message saying so. Never left on <body>.
  const focusNext = useRef(false)
  const takeFocus = useCallback((el: HTMLElement | null) => {
    if (!el || !focusNext.current) return
    el.focus({ preventScroll: true })
    if (el.tagName !== 'IMG') focusNext.current = false // the message is the last stop; an image may still fail over
  }, [])
  const settled = () => { focusNext.current = false }

  if (!frame.ref) return <p className="ref-missing">No reference PNG was captured for this frame.</p>
  if (attempt < 0 || attempt >= bases.length) {
    const unreachable = attempt >= 0
    return (
      <p className="ref-missing" ref={unreachable ? takeFocus : undefined} tabIndex={unreachable ? -1 : undefined}>
        Reference PNG: <code>{refRepoPath(frame.ref)}</code>.{' '}
        {unreachable ? (
          <>It is not reachable from this copy of the build: run the dev server (<code>npm run dev</code>) or open the frame in Figma.</>
        ) : (
          <button type="button" className="ref-missing__try" onClick={() => { focusNext.current = true; setAttempt(0) }}>Show it</button>
        )}
      </p>
    )
  }
  const [w, h] = frame.size ?? []
  return (
    <img
      key={attempt}
      ref={takeFocus}
      tabIndex={-1}
      className={className}
      src={bases[attempt] + frame.ref}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
      onLoad={settled}
      onError={() => setAttempt(a => a + 1)}
    />
  )
}
