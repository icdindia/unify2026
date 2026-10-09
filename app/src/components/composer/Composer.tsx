import {
  useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState,
  type KeyboardEvent, type ReactNode, type Ref,
} from 'react'
import { IconButton } from '../buttons/IconButton'
import { cx } from '../buttons/cx'
import plus from '../../assets/chrome/composer-plus.svg'
import openai from '../../assets/chrome/openai.svg'
import microphone from '../../assets/chrome/microphone.svg'
import voice from '../../assets/chrome/voice.svg'
import { LimitPill, QueueButton, SendButton, StopButton } from './ComposerButtons'
import { SourceChips, type SourcesValue } from './SourceChips'
import { AttachmentStrip } from './AttachmentThumb'
import { RotatingPlaceholder } from './RotatingPlaceholder'
import { TokenRun, TRIGGER_CHAR, findTokens, findTrigger, renderWithTokens } from './tokens'
import { caretBoxAt } from './caret'
import { isImeKey } from '../form/ime'
import { useComposerFix } from './fixes'
import { variantId, variantName, type VariantProps } from './variants'
import type {
  ComposerAttachment, ComposerHandle, ComposerHover, ComposerState, ComposerTokenKind, ComposerTrigger, ComposerType,
  ComposerTypeProp, RenderToken, RenderTooltip,
} from './types'
import './composer.css'

type Click = () => void

export type ComposerProps = {
  /** Type=Landing Page (default; the Projects dashboard's composer), Bottom small, Bottom large, or `bottom` (picked from the content). */
  type?: ComposerTypeProp
  /** default | generating (Stop, Queue) | loading (the prompt is being enhanced: skeleton, Send disabled). */
  state?: ComposerState
  /**
   * The empty field's hint. A string is a static placeholder; an array rotates through the hints with the
   * _Text animate timing (COMPOSER_HINTS for the landing page). Bottom composers default to "Ask anything…", or
   * "Queue follow-up…" while generating with a queue.
   */
  placeholder?: string | string[]
  /** Freeze a rotating placeholder on one hint (review frames). */
  hintIndex?: number
  /** Accessible name of the text field. */
  label?: string
  /** Controlled text. Leave undefined (optionally with defaultValue) to let the composer keep its own. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Enter or Send. Shift+Enter is a new line; the field clears afterwards. Not called for blank text. */
  onSubmit?: (value: string, attachments: ComposerAttachment[]) => void
  /** Enter or the Queue button while generating; the field clears afterwards. */
  onQueue?: (value: string, attachments: ComposerAttachment[]) => void
  onStop?: Click
  onAdd?: Click
  /** The "+" menu is open: keeps the button's hover fill and exposes aria-expanded. */
  addExpanded?: boolean
  onModel?: Click
  onDictate?: Click
  onVoice?: Click

  /** Tools & Sources=Yes: the Company / Research chips after "+". */
  tools?: boolean
  sources?: SourcesValue
  defaultSources?: SourcesValue
  onSourcesChange?: (next: SourcesValue) => void
  /** Replaces the default chips (rendered whatever `tools` says). */
  leftChips?: ReactNode
  /** Extra actions at the start of the right-hand group, before Model. */
  trailing?: ReactNode
  /** The Enhance with AI slot (EnhanceButton): after Model, behind a divider, as in enhance-prompt 01-05. */
  enhance?: ReactNode

  attachments?: ComposerAttachment[]
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void

  /** Skill names recognised after "/" and people after "@": those runs render as tokens and delete as one. */
  skills?: readonly string[]
  mentions?: readonly string[]
  /** Custom token renderer; the default is the steel-blue run. */
  renderToken?: RenderToken
  /** The "@" / "/" trigger under the caret changed (null when there is none): open, filter or close a picker here. */
  onTrigger?: (trigger: ComposerTrigger | null) => void
  /** Keys while a trigger is active, before the composer's own (arrows, Enter, Escape for the picker). Return true when handled. */
  onTriggerKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => boolean
  /** Character limit: past it the error pill shows the overflow and Send is disabled (State=Limit exceed). */
  maxLength?: number
  sendDisabled?: boolean

  /** Wrap controls in the overlay Tooltip; without it the native title attribute is used. */
  renderTooltip?: RenderTooltip
  /**
   * The drop shadow the chat + artifacts frames give the box (0 4 8, 30% on the landing page, 25% docked under a chat).
   * Default: on for the bottom types, off for the landing type (the Projects dashboard's box has none).
   */
  elevated?: boolean
  /** Review only: a pinned hover state (`hover=` in the URL). */
  hover?: ComposerHover
  textareaRef?: Ref<HTMLTextAreaElement>
  handleRef?: Ref<ComposerHandle>
  /** Figma node of this Input Box instance. Default: the variant shown, or the "Dashboard" 14045:584747 instance for the plain landing box. */
  nodeId?: string
  className?: string
}

const PROJECTS_INSTANCE = 'I14045:584747;6367:278461'
const LINE = 26 // Text md/Regular para line height
const MAX_LINES = 12 // Text=Max line: the field stops growing at 12 lines (314 on the landing box, 312 on Bottom large) and scrolls
const LANDING_TOP = 2 // the landing field's 2px top inset ("Skills+text" padding)
const LANDING_MIN = 52 // the landing field is always two lines tall

// Bottom small, as composer.css lays it out: the field column keeps 40px, 12 sits between it and the actions, and the
// field has 6px on each side.
const PILL_FIELD_MIN = 40
const PILL_GAP = 12
const PILL_FIELD_PAD = 12

/** The width a box needs for its content (max-content), whatever its grid cell stretches it to. */
function contentWidth(el: HTMLElement | null) {
  if (!el) return 0
  const was = el.style.width
  el.style.width = 'max-content'
  const w = el.getBoundingClientRect().width
  el.style.width = was
  return w
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) (ref as { current: T | null }).current = value
}

/**
 * Copilot desktop Input Box (set 10064:383334): the message field with "+", the Company / Research chips, the
 * model / dictate actions and Voice, which becomes Send once there is text, or Stop (+ Queue) while the Assistant
 * answers. Type=Landing Page (640-760 wide, two-line field), Bottom small (the 48px pill under a chat), Bottom large
 * (the tall box once the text wraps or files are attached). The field grows to 12 lines, then scrolls.
 */
export function Composer({
  type = 'landing', state = 'default', placeholder, hintIndex, label = 'Message', value, defaultValue = '', onChange,
  onSubmit, onQueue, onStop, onAdd, addExpanded, onModel, onDictate, onVoice,
  tools = false, sources, defaultSources, onSourcesChange, leftChips, trailing, enhance,
  attachments = [], onRemoveAttachment, onRetryAttachment,
  skills = [], mentions = [], renderToken, onTrigger, onTriggerKeyDown, maxLength, sendDisabled,
  renderTooltip, elevated, hover, textareaRef, handleRef, nodeId, className,
}: ComposerProps) {
  const [own, setOwn] = useState(defaultValue)
  const text = value ?? own
  const update = useCallback((next: string) => {
    if (value === undefined) setOwn(next)
    onChange?.(next)
  }, [value, onChange])

  const [ownSources, setOwnSources] = useState<SourcesValue>(defaultSources ?? { company: true, research: true })
  const sourcesValue = sources ?? ownSources
  const setSources = (next: SourcesValue) => {
    if (sources === undefined) setOwnSources(next)
    onSourcesChange?.(next)
  }

  const root = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement | null>(null)
  const mirror = useRef<HTMLDivElement>(null)
  const measure = useRef<HTMLSpanElement>(null)
  const lead = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLDivElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const setField = useCallback((el: HTMLTextAreaElement | null) => {
    field.current = el
    assignRef(textareaRef, el)
  }, [textareaRef])
  const [caret, setCaret] = useState(defaultValue.length)
  const [width, setWidth] = useState(0)
  const [lines, setLines] = useState(1)
  const [autoLarge, setAutoLarge] = useState(false)

  const auto = type === 'bottom'
  const kind: ComposerType = auto ? (autoLarge ? 'bottom-large' : 'bottom-small') : type
  const small = kind === 'bottom-small'
  const generating = state === 'generating'
  const loading = state === 'loading'
  const hasText = text.length > 0
  const hasContent = hasText || attachments.length > 0
  const uploading = attachments.some(a => a.status === 'loading')
  const over = maxLength !== undefined ? text.length - maxLength : 0
  const canSend = hasContent && !loading && over <= 0 && !uploading && !sendDisabled
  const unifiedSlash = useComposerFix('composer-skill-slash-colour')
  const hintId = useId()

  const tokens = useMemo(() => findTokens(text, skills, mentions), [text, skills, mentions])
  const drawToken: RenderToken = renderToken ?? (t => <TokenRun token={t} slashBlue={kind === 'landing' && !unifiedSlash} />)
  const mirrored = tokens.length > 0 && !loading

  const hints = Array.isArray(placeholder) ? placeholder : null
  const staticHint = typeof placeholder === 'string'
    ? placeholder
    : kind === 'landing'
      ? 'Use /skill to give your agent a capability.'
      : generating && onQueue ? 'Queue follow-up…' : 'Ask anything…'

  // the web font changes line breaks once it loads: measure again then
  const [fontsTick, setFontsTick] = useState(0)
  useEffect(() => {
    let live = true
    document.fonts?.ready.then(() => { if (live) setFontsTick(t => t + 1) })
    return () => { live = false }
  }, [])

  // width, for the auto type and the field height
  useEffect(() => {
    const el = root.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // type="bottom": the pill while the text fits its one line, the tall box when it wraps, breaks or carries files.
  // The room is always the pill's, whichever type is showing: in the tall box the lead cell spans the row (624 of 760),
  // so the box widths would leave no room and the composer could never shrink back. The lead and trail are measured at
  // their content width instead, and the pill's grid is replayed: the field keeps at least 40 (the chips give way first).
  useLayoutEffect(() => {
    if (!auto) return
    const el = root.current
    const m = measure.current
    if (!el || !m) return
    let large = attachments.length > 0 || text.includes('\n')
    if (!large && text) {
      const pad = parseFloat(getComputedStyle(el).paddingLeft) + parseFloat(getComputedStyle(el).paddingRight)
      const room = Math.max(PILL_FIELD_MIN, el.clientWidth - pad - contentWidth(lead.current) - contentWidth(trail.current) - PILL_GAP) - PILL_FIELD_PAD
      large = m.offsetWidth > room
    }
    setAutoLarge(large)
  }, [auto, text, attachments.length, width, fontsTick])

  // the field grows with its text: landing 52 (two lines) up to 314, Bottom large 26 up to 312, Bottom small one line
  useLayoutEffect(() => {
    const el = field.current
    if (!el) return
    if (small) {
      el.style.height = ''
      setLines(1)
      return
    }
    el.style.height = '0px'
    const top = kind === 'landing' ? LANDING_TOP : 0
    const n = Math.max(1, Math.round((el.scrollHeight - top) / LINE))
    const shown = Math.min(n, MAX_LINES)
    // the landing field is two lines tall (52) until a third line: 80, 106 … 314 (2 + 12 x 26)
    el.style.height = `${kind === 'landing' ? (n <= 2 ? LANDING_MIN : top + shown * LINE) : shown * LINE}px`
    el.style.overflowY = n > MAX_LINES ? 'auto' : 'hidden'
    setLines(text ? n : 1)
    if (mirror.current) mirror.current.scrollTop = el.scrollTop
  }, [text, kind, small, width, mirrored, fontsTick])

  // a caret position queued by insertToken / atomic delete, applied once the new text is in the field
  useLayoutEffect(() => {
    const el = field.current
    const at = pendingCaret.current
    if (!el || at === null || el.value !== text) return
    pendingCaret.current = null
    el.focus()
    el.setSelectionRange(at, at)
    setCaret(at)
  }, [text])

  // the "@" / "/" trigger under the caret, reported when it changes
  const lastTrigger = useRef('')
  const dismissed = useRef('')
  useLayoutEffect(() => {
    if (!onTrigger) return
    const el = field.current
    const t = el ? findTrigger(text, caret, tokens) : null
    const sig = t ? `${t.kind}:${t.start}:${t.query}` : ''
    const live = sig && sig !== dismissed.current ? sig : ''
    if (live === lastTrigger.current) return
    lastTrigger.current = live
    if (!live || !t || !el) return onTrigger(null)
    onTrigger({ ...t, char: TRIGGER_CHAR[t.kind], end: caret, caret: caretBoxAt(el, caret), anchor: caretBoxAt(el, t.start) })
  }, [text, caret, tokens, onTrigger])

  // Removing an attachment unmounts the focused remove button: focus moves to the tile that takes its place, else the
  // one before it, else the message field once the row is empty.
  const refocus = useRef<{ id: string; at: number } | null>(null)
  const removeAttachment = (id: string) => {
    if (root.current?.contains(document.activeElement)) refocus.current = { id, at: attachments.findIndex(a => a.id === id) }
    onRemoveAttachment?.(id)
  }
  useLayoutEffect(() => {
    const r = refocus.current
    if (!r || attachments.some(a => a.id === r.id)) return // not removed (yet)
    refocus.current = null
    const buttons = root.current?.querySelectorAll<HTMLButtonElement>('.cattach__remove')
    if (buttons && buttons.length) buttons[Math.min(r.at, buttons.length - 1)].focus()
    else field.current?.focus()
  }, [attachments])

  // The primary action swaps itself out: Send, Stop (+ Queue) and Voice mode replace each other as the text and the
  // state change, so pressing Stop, Queue or Send by keyboard, or the answer ending while Stop has focus, unmounts the
  // focused button. Focus then moves to the action that takes its place (the last button of the group) instead of
  // dropping to <body>. A focusout clears the record a microtask later unless the button was removed, so a click away
  // from the composer is never undone.
  const actFocus = useRef<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const was = actFocus.current
    if (!was || was.isConnected) return
    actFocus.current = null
    const now = document.activeElement
    if (now && now !== document.body) return
    const acts = root.current?.querySelectorAll<HTMLElement>('.composer__acts button')
    const next = acts && acts.length ? acts[acts.length - 1] : field.current
    next?.focus()
  })

  const clear = () => {
    if (text) pendingCaret.current = 0 // (an unchanged '' would leave it pending until the next keystroke)
    update('')
  }
  const submit = () => {
    if (!onSubmit || !canSend || (!text.trim() && !attachments.length)) return
    onSubmit(text, attachments)
    clear()
  }
  const queue = () => {
    if (!onQueue || !hasContent || uploading || (!text.trim() && !attachments.length)) return
    onQueue(text, attachments)
    clear()
  }

  const insertToken = (k: ComposerTokenKind, name: string) => {
    const el = field.current
    const at = el ? el.selectionStart : text.length
    const t = findTrigger(text, at, tokens)
    const start = t && t.kind === k ? t.start : at
    const insert = `${TRIGGER_CHAR[k]}${name} `
    pendingCaret.current = start + insert.length
    update(text.slice(0, start) + insert + text.slice(at))
  }

  useImperativeHandle(handleRef, () => ({
    focus: () => field.current?.focus(),
    insertToken,
    caretBox: () => (field.current ? caretBoxAt(field.current, field.current.selectionStart) : null),
    textarea: () => field.current,
  }))

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    // Keys of an IME composition belong to the IME, the Enter that confirms one included (Safari sends it after
    // compositionend, as keyCode 229): they never send, queue, delete a token or reach the "@" / "/" picker.
    if (isImeKey(e)) return
    if (lastTrigger.current) {
      if (onTriggerKeyDown?.(e)) return
      if (e.key === 'Escape') {
        dismissed.current = lastTrigger.current
        lastTrigger.current = ''
        onTrigger?.(null)
        e.preventDefault()
        return
      }
    }
    // a token deletes as one piece
    if ((e.key === 'Backspace' || e.key === 'Delete') && el.selectionStart === el.selectionEnd && !e.altKey && !e.metaKey && !e.ctrlKey) {
      const at = el.selectionStart
      const hit = tokens.find(t => (e.key === 'Backspace' ? at > t.start && at <= t.end : at >= t.start && at < t.end))
      if (hit) {
        e.preventDefault()
        pendingCaret.current = hit.start
        update(text.slice(0, hit.start) + text.slice(hit.end))
        return
      }
    }
    if (e.key !== 'Enter' || e.shiftKey) return
    if (generating) {
      // Enter queues while the Assistant answers; with no queue it does nothing (Shift+Enter still breaks the line)
      e.preventDefault()
      queue()
      return
    }
    if (!onSubmit) return
    e.preventDefault()
    submit()
  }

  const showChips = leftChips !== undefined || tools
  const variant: VariantProps = {
    Type: kind === 'landing' ? 'Landing Page' : small ? 'Bottom small' : 'Bottom large',
    State: over > 0 ? 'Limit exceed' : generating ? 'Generating' : 'Default',
    'Tools & Sources': showChips ? 'Yes' : 'No',
    Text: !hasText ? 'Placeholder' : lines >= MAX_LINES ? 'Max line' : lines >= 2 ? 'Two line' : 'One line',
    Attachment: attachments.length ? 'Yes' : 'No',
  }
  const plain = kind === 'landing' && !showChips && !hasText && !attachments.length && state === 'default'
  const chips = leftChips ?? (tools
    ? <SourceChips size={kind === 'landing' ? 'md' : 'icon'} value={sourcesValue} onChange={setSources}
                   hover={hover === 'chip:company' ? 'company' : hover === 'chip:research' ? 'research' : undefined} />
    : null)

  return (
    <div
      ref={root}
      className={cx('composer', `composer--${kind}`, attachments.length > 0 && 'composer--attached',
        (elevated ?? kind !== 'landing') && 'composer--elevated', generating && 'is-generating', loading && 'is-loading', className)}
      data-node-id={nodeId ?? (plain ? PROJECTS_INSTANCE : variantId(variant))}
      data-figma-variant={variantName(variant)}
    >
      {attachments.length > 0 && (
        <AttachmentStrip attachments={attachments} onRemove={removeAttachment} onRetry={onRetryAttachment} />
      )}
      <div className="composer__msg">
        <div className="composer__field">
          {mirrored && (
            <div ref={mirror} className={cx('composer__in', 'composer__mirror')} aria-hidden="true">
              {renderWithTokens(text, tokens, drawToken)}
            </div>
          )}
          <textarea
            ref={setField}
            className={cx('composer__in', mirrored && 'is-mirrored', loading && 'is-veiled')}
            rows={1}
            wrap={small ? 'off' : 'soft'}
            aria-label={label}
            aria-busy={loading || undefined}
            aria-describedby={hints && !hasText ? hintId : undefined}
            readOnly={loading}
            placeholder={hints ? undefined : staticHint}
            value={text}
            onChange={e => {
              dismissed.current = ''
              update(e.target.value)
              setCaret(e.target.selectionStart)
            }}
            onSelect={e => setCaret(e.currentTarget.selectionStart)}
            onScroll={e => {
              if (mirror.current) {
                mirror.current.scrollTop = e.currentTarget.scrollTop
                mirror.current.scrollLeft = e.currentTarget.scrollLeft
              }
            }}
            onKeyDown={onKeyDown}
          />
          {hints && !hasText && !loading && <RotatingPlaceholder hints={hints} index={hintIndex} />}
          {hints && <span id={hintId} className="composer-sr">{hints[0]}</span>}
          {loading && (
            <span className="composer__skeleton" aria-hidden="true"><span /><span /></span>
          )}
          {auto && <span className="composer__measure" aria-hidden="true"><span ref={measure}>{text}</span></span>}
        </div>
      </div>
      <div ref={lead} className="composer__lead">
        <IconButton
          round icon={plus} aria-label="Add" onClick={onAdd} aria-expanded={addExpanded}
          aria-haspopup={addExpanded !== undefined ? 'menu' : undefined} className={hover === 'add' ? 'is-hover' : undefined}
        />
        {chips}
      </div>
      <div
        ref={trail} className="composer__trail"
        onFocus={e => { actFocus.current = e.target }}
        onBlur={e => {
          const t = e.target
          queueMicrotask(() => { if (actFocus.current === t && t.isConnected) actFocus.current = null })
        }}
      >
        {over > 0 && <LimitPill over={over} renderTooltip={renderTooltip} hover={hover === 'limit'} />}
        <div className="composer__acts">
          {trailing}
          <IconButton aria-label="Model" onClick={onModel}>
            <span className="composer__oa"><img alt="" src={openai} /></span>
          </IconButton>
          {enhance && (
            <span className="composer__enh">
              <span className="composer__div" aria-hidden="true" />
              {enhance}
            </span>
          )}
          <IconButton icon={microphone} aria-label="Dictate" onClick={onDictate} />
          {generating ? (
            <>
              {hasContent && <QueueButton disabled={uploading} onClick={queue} renderTooltip={renderTooltip} hover={hover === 'queue'} />}
              <StopButton onClick={onStop} renderTooltip={renderTooltip} hover={hover === 'stop'} />
            </>
          ) : hasContent ? (
            <SendButton disabled={!canSend} onClick={submit} renderTooltip={renderTooltip} hover={hover === 'send'} />
          ) : (
            <IconButton icon={voice} aria-label="Voice mode" onClick={onVoice} />
          )}
        </div>
      </div>
    </div>
  )
}
