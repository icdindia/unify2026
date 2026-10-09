import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fixesMode, navMode, rail, unbuilt, useStore } from '../app/store'
import { isBuiltHref } from '../app/visibility'
import { FIXES } from '../fixes/fixes'
import { framesForRoute, JOURNEYS, STEPS, stepName, type FrameMatch, type FrameRef, type StepEntry } from '../figma/frames'
import { matchPath, useRoute } from '../router/router'
import { setUi } from '../router/uiParams'
import { FigmaLink } from './FigmaLink'
import { pageOptionOf } from './reviewState'
import { cursorFor, goToStep, lastStep, neighbour, stepByKey } from './stepper'
import { openAtWidth, useWindowWidth, VIEWPORT_PRESETS, type OpenResult } from './viewport'
import './review-bar.css'

// Prototype-only control (not part of the design): switches the whole app between the Figma design and the design with
// fixes, flips nav mode, picks the inside-page option on a project page, steps through the journeys in Figma order,
// links the screen to every Figma frame it reproduces, and reopens it at a review viewport width. AppShell draws it at
// the right end of the top strip (`tools`).
// It folds when the strip is too narrow: first to the reviewer's switches and the stepper plus "Review ▾" (the Figma
// links and the viewport presets move into its popover; at the 1440 baseline the project dashboard shows this), then to
// the stepper and the Figma links plus "Review ▾" (the switches move too), then to "‹ › Review ▾" (stepping stays one
// click away), then to "Review ▾" alone. The popover always holds every control, so nothing is ever clipped out of reach.
// However long the breadcrumb, the bar keeps room for "Review ▾": its width is the strip's minimum for the tools column
// (app-shell.css), and the breadcrumb's current crumb ellipsizes instead.
type Fold = 'full' | 'main' | 'core' | 'steps' | 'button'

type Props = {
  /** URL keys the screen on view does not draw (app/routes.tsx): its frames are then only closest matches ("≈"). */
  undrawn?: readonly string[]
}

export function ReviewBar({ undrawn = [] }: Props) {
  const fullRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const [fold, setFold] = useState<Fold>('full')
  const [open, setOpen] = useState(false)
  const matches = useLiveMatches(undrawn)

  // Compare the natural width of each fold (invisible copies) with the room the strip gives. The lone button's width
  // is the bar's minimum width, which the strip's grid keeps free for it (app-shell.css).
  useLayoutEffect(() => {
    const wrap = wrapRef.current, room = wrap?.parentElement
    const folds = [fullRef.current, mainRef.current, coreRef.current, stepsRef.current]
    const button = buttonRef.current
    if (!wrap || !room || !button || folds.some(f => !f)) return
    const order: Fold[] = ['full', 'main', 'core', 'steps']
    const check = () => {
      const cs = getComputedStyle(room)
      const free = room.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      wrap.style.minWidth = `${button.offsetWidth}px`
      const i = folds.findIndex(f => f!.offsetWidth <= free)
      setFold(i < 0 ? 'button' : order[i])
    }
    check()
    const ro = new ResizeObserver(check)
    ;[...folds, button, room].forEach(el => ro.observe(el!))
    return () => ro.disconnect()
  }, [])

  useEffect(() => { if (fold === 'full') setOpen(false) }, [fold])

  // The popover closes on Escape (focus back on the button) and on any press outside it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) { setOpen(false); toggleRef.current?.focus() }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!popRef.current?.contains(t) && !toggleRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  const toggle = (ref?: typeof toggleRef) => (
    <button ref={ref} className="review-bar__toggle" aria-haspopup="dialog" aria-expanded={ref ? open : false}
            onClick={ref ? () => setOpen(o => !o) : undefined}>
      Review <span aria-hidden="true">▾</span>
    </button>
  )

  return (
    <MatchesContext value={matches}>
      <div className="review-wrap" ref={wrapRef}>
        <div className="review-bar review-bar--measure" ref={fullRef} aria-hidden="true" inert>
          <Controls />
        </div>
        <div className="review-fold review-bar--measure" ref={mainRef} aria-hidden="true" inert>
          <MainControls />
          {toggle()}
        </div>
        <div className="review-fold review-bar--measure" ref={coreRef} aria-hidden="true" inert>
          <CoreControls />
          {toggle()}
        </div>
        <div className="review-fold review-bar--measure" ref={stepsRef} aria-hidden="true" inert>
          <Stepper arrowsOnly />
          {toggle()}
        </div>
        <div className="review-fold review-bar--measure" ref={buttonRef} aria-hidden="true" inert>
          {toggle()}
        </div>
        {fold === 'full' ? (
          <div className="review-bar" role="toolbar" aria-label="Prototype controls">
            <Controls />
          </div>
        ) : (
          <div className="review-fold">
            {fold === 'main' && <MainControls />}
            {fold === 'core' && <CoreControls />}
            {fold === 'steps' && <Stepper arrowsOnly />}
            {toggle(toggleRef)}
            {open && (
              <div ref={popRef} className="review-bar review-bar--pop" role="dialog" aria-label="Prototype controls">
                <Controls />
              </div>
            )}
          </div>
        )}
      </div>
    </MatchesContext>
  )
}

/** The frames the route reproduces, worked out once per bar and shared by every fold (see useLiveMatches). */
const MatchesContext = createContext<FrameMatch[]>([])
const useMatches = () => useContext(MatchesContext)

/**
 * The frames the route reproduces, re-evaluated when the rail or nav store changes (they fill keys the hash leaves out).
 * When the screen does not draw some of the URL's keys, none of them is exact: the screen shows the frame's route
 * without that state.
 */
function useLiveMatches(undrawn: readonly string[]): FrameMatch[] {
  const route = useRoute()
  const railNow = useStore(rail)
  const navNow = useStore(navMode)
  const missing = undrawn.join('&')
  return useMemo(() => {
    const all = framesForRoute(route.href, { rail: railNow, nav: navNow })
    const keys = missing ? missing.split('&') : []
    return keys.length ? all.map(m => ({ ...m, exact: false, undrawn: keys })) : all
  }, [route.href, railNow, navNow, missing])
}

/** Why a match is not exact, for tooltips. */
const notExactWhy = (m: Pick<FrameMatch, 'undrawn'>) =>
  m.undrawn?.length
    ? `this screen does not draw ${m.undrawn.map(k => k + '=').join(', ')} yet`
    : 'the pinned hover, rail, nav or width differ'

/** The first fold: the reviewer's switches and where you are (the stepper) stay in the strip. */
function MainControls() {
  return (
    <div className="review-bar review-bar--main" role="toolbar" aria-label="Review switches and journey step">
      <Switches />
      <Sep />
      <Stepper />
    </div>
  )
}

/** The second fold: where you are (the stepper) and the frames it reproduces stay in the strip. */
function CoreControls() {
  const matches = useMatches()
  return (
    <div className="review-bar review-bar--core" role="toolbar" aria-label="Journey step and Figma frames">
      <Stepper />
      {matches.length > 0 && (
        <>
          <Sep />
          <FrameLinks matches={matches} />
        </>
      )}
    </div>
  )
}

/** As designed / With fixes, the inside-page option (project pages), and the nav mode. */
function Switches() {
  const fixes = useStore(fixesMode)
  const mode = useStore(navMode)
  const route = useRoute()
  const onProject = !!matchPath('/projects/:slug', route.path)
  const option = pageOptionOf(route)
  // setUi writes the canonical 2.1 form (readable ':' '>' ',', keys in order; opt after them) and replaces the entry
  const setOption = (o: 1 | 2) => setUi({ opt: o === 2 ? '2' : null })

  return (
    <>
      <div className="review-bar__grp" role="group" aria-label="Design or fixes">
        <button aria-pressed={fixes === 'off'} onClick={() => fixesMode.set('off')}>As designed</button>
        <button aria-pressed={fixes === 'on'} onClick={() => fixesMode.set('on')}>
          With fixes{FIXES.length ? ` (${FIXES.length})` : ''}
        </button>
      </div>
      {onProject && (
        <>
          <Sep />
          <div className="review-bar__grp" role="group" aria-label="Inside page option">
            <span className="review-bar__lbl">Inside page</span>
            <button aria-pressed={option === 1} onClick={() => setOption(1)}>Option 1</button>
            <button aria-pressed={option === 2} onClick={() => setOption(2)}>Option 2</button>
          </div>
        </>
      )}
      <Sep />
      <div className="review-bar__grp" role="group" aria-label="Nav mode">
        <span className="review-bar__lbl">Nav</span>
        <button aria-pressed={mode === 'dark'} onClick={() => navMode.set('dark')}>Dark</button>
        <button aria-pressed={mode === 'light'} onClick={() => navMode.set('light')}>Light</button>
      </div>
    </>
  )
}

function Controls() {
  const matches = useMatches()
  const remembered = useStore(lastStep)
  const cursor = cursorFor(matches, remembered)

  return (
    <>
      <Switches />
      <Sep />
      <Stepper />
      {matches.length > 0 && (
        <>
          <Sep />
          <FrameLinks matches={matches} />
        </>
      )}
      <Sep />
      <ViewportPresets frame={matches[0]?.frame ?? cursor?.frame} />
    </>
  )
}

const Sep = () => <span className="review-bar__sep" aria-hidden="true" />

// ------------------------------------------------------------------------------------------------------- stepper

const MAX_OPTION_LABEL = 72
const short = (s: string) => (s.length > MAX_OPTION_LABEL ? s.slice(0, MAX_OPTION_LABEL - 1).trimEnd() + '…' : s)

/** Prev / next through every journey's steps in Figma order, and a picker of all of them (a native select, grouped by journey). */
function Stepper({ arrowsOnly = false }: { arrowsOnly?: boolean }) {
  const matches = useMatches()
  const remembered = useStore(lastStep)
  const cursor = cursorFor(matches, remembered)
  const onFrame = !!cursor && matches.some(m => m.frame.journey === cursor.journey && m.frame.step === cursor.step)
  const exact = onFrame && matches.some(m => m.exact)
  // unbuilt screens hidden (app/store.ts): the stepper only walks steps whose URL opens a built screen
  const hidden = useStore(unbuilt) === 'hide'
  const reachable = (st: StepEntry) => !hidden || (!!st.frame && isBuiltHref(st.frame.route))
  const prev = neighbour(cursor, -1, reachable)
  const next = neighbour(cursor, 1, reachable)

  // remember the step on screen, so prev / next continue from it after a detour through unmapped URLs
  useEffect(() => {
    if (cursor && onFrame && cursor.key !== remembered) lastStep.set(cursor.key)
  }, [cursor, onFrame, remembered])

  const arrow = (dir: 'prev' | 'next', to: StepEntry | undefined) => (
    <button className="review-step__arrow" disabled={!to} onClick={() => to && goToStep(to)}
            aria-label={to ? `${dir === 'prev' ? 'Previous' : 'Next'} step: ${stepName(to)}` : dir === 'prev' ? 'No previous step' : 'No next step'}
            title={to ? `${stepName(to)}: ${to.label}` : undefined}>
      <span aria-hidden="true">{dir === 'prev' ? '‹' : '›'}</span>
    </button>
  )

  const face = cursor ? `${exact || !onFrame ? '' : '≈ '}${cursor.journey} ${cursor.stepId}` : 'Pick a step'
  const here = onFrame ? matches.find(m => m.frame.journey === cursor.journey && m.frame.step === cursor.step) : undefined
  const faceTitle = !cursor
    ? 'This screen is not one of the Figma frames'
    : `${stepName(cursor)}: ${cursor.label}` + (!onFrame ? ' (last step visited; this URL is not that frame)' : exact ? '' : ` (closest frame: ${notExactWhy(here ?? {})})`)

  return (
    <div className="review-bar__grp review-step" role="group" aria-label="Journey step">
      {arrow('prev', prev)}
      {!arrowsOnly && (
        <label className={'review-step__pick' + (cursor && !onFrame ? ' is-off' : '')} title={faceTitle}>
          <span className="review-step__face" aria-hidden="true">{face}</span>
          <span aria-hidden="true" className="review-step__caret">▾</span>
          <select className="review-step__select" aria-label={`Journey step${cursor ? `, now ${stepName(cursor)}` : ''}`}
                  value={cursor?.key ?? ''} onChange={e => { const s = stepByKey(e.target.value); if (s) goToStep(s) }}>
            {!cursor && <option value="">Pick a step…</option>}
            {JOURNEYS.map((j, i) => {
              const steps = STEPS.filter(s => s.journey === j.id && (!hidden || reachable(s)))
              if (hidden && !steps.length) return null
              const label = `${i}. ${j.id}: ${j.title}`
              if (!steps.length) {
                return (
                  <optgroup key={j.id} label={label}>
                    <option disabled value={`${j.id}/none`}>{j.captured === false ? 'Not captured yet' : 'No frames'}</option>
                  </optgroup>
                )
              }
              return (
                <optgroup key={j.id} label={label}>
                  {steps.map(s => (
                    <option key={s.key} value={s.key} disabled={!s.frame}>
                      {s.stepId} · {short(s.label)}{s.frame?.kind === 'A' ? ` (= ${s.frame.aliasOf ?? 'alias'})` : ''}{s.unrouted ? ' (not a screen)' : ''}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </label>
      )}
      {arrow('next', next)}
    </div>
  )
}

// --------------------------------------------------------------------------------------------------- Figma links

const MAX_LINKS = 4

function FrameLinks({ matches }: { matches: FrameMatch[] }) {
  const shown = matches.slice(0, MAX_LINKS)
  const more = matches.slice(MAX_LINKS)
  return (
    <div className="review-bar__grp review-links" role="group" aria-label="Figma frames for this screen">
      <span className="review-bar__lbl">Figma</span>
      {shown.map(({ frame, exact, undrawn }) => (
        <FigmaLink key={`${frame.journey}/${frame.step}`} nodeId={frame.nodeId} className="review-bar__figma"
                   label={`Open ${exact ? '' : 'the closest frame, '}${stepName(frame)} (${frame.nodeId}), in Figma`}
                   title={`${stepName(frame)}: ${frame.label}${exact ? '' : ` (closest frame: ${notExactWhy({ undrawn })})`}`}>
          {exact ? '' : '≈ '}{frame.nodeId} ↗
        </FigmaLink>
      ))}
      {more.length > 0 && (
        <span className="review-bar__lbl" title={more.map(m => `${stepName(m.frame)} ${m.frame.nodeId}`).join('\n')}>+{more.length}</span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------------------------- viewport presets

/** The width a frame is drawn at, when it is a full screen: its vw=, else the 1440 baseline. Component units have none. */
function drawnWidth(frame: FrameRef | undefined): number | undefined {
  if (!frame) return undefined
  if (frame.viewport) return frame.viewport
  return frame.size && frame.size[0] >= 1280 ? 1440 : undefined
}

function ViewportPresets({ frame }: { frame: FrameRef | undefined }) {
  const width = useWindowWidth()
  const drawn = drawnWidth(frame)
  const presets: number[] = [...VIEWPORT_PRESETS]
  if (drawn && !presets.includes(drawn)) presets.push(drawn)
  presets.sort((a, b) => b - a)
  const [note, setNote] = useState<(OpenResult & { width: number }) | null>(null)
  const presetsRef = useRef<HTMLDivElement>(null)

  const openAt = (w: number) => {
    const result = openAtWidth(w)
    setNote(result.status === 'opened' ? null : { ...result, width: w })
  }
  // Dismissing the note (× or Escape) unmounts the control that has focus: hand it to the preset the note is about.
  const closeNote = () => {
    const width = note?.width
    const hadFocus = !!presetsRef.current?.querySelector('.review-vp__note')?.contains(document.activeElement)
    setNote(null)
    if (hadFocus) presetsRef.current?.querySelector<HTMLButtonElement>(`.review-vp__w[data-width="${width}"]`)?.focus()
  }

  return (
    <div ref={presetsRef} className="review-bar__grp review-vp" role="group" aria-label={`Open this screen at a viewport width (this window is ${width} px)`}>
      <span className="review-bar__lbl">Open at</span>
      {presets.map(w => {
        const here = Math.abs(width - w) <= 1
        const isDrawn = w === drawn
        const hint = [here && `this window is ${width} px`, isDrawn && 'the width Figma draws this frame at'].filter(Boolean).join('; ')
        return (
          <button key={w} data-width={w} className={'review-vp__w' + (here ? ' is-current' : '') + (isDrawn ? ' is-drawn' : '')}
                  title={`Open this screen in a ${w} px window${hint ? ` (${hint})` : ''}`} onClick={() => openAt(w)}>
            {w}
          </button>
        )
      })}
      {note && <ViewportNote note={note} onClose={closeNote} />}
    </div>
  )
}

function ViewportNote({ note, onClose }: { note: OpenResult & { width: number }; onClose: () => void }) {
  const url = 'url' in note ? note.url : null
  const text: ReactNode = note.status === 'blocked'
    ? <>Pop-ups are blocked here. Open this URL in a window {note.width} px wide, or resize this one (DevTools device toolbar: type {note.width}).</>
    : <>This preview cannot open windows. Open the prototype file in a browser tab, or resize the window to {note.width} px (DevTools device toolbar).</>
  return (
    <div className="review-vp__note" role="status" onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }}>
      <p>{text}</p>
      {url && <input className="figma-link__url" readOnly value={url} aria-label="URL of this screen" onFocus={e => e.currentTarget.select()} />}
      <button className="review-vp__close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  )
}
