import type { ReactElement, ReactNode } from 'react'

/** Copilot desktop Input Box / Type: the landing box, the one-line pill docked under a chat, or its tall form. */
export type ComposerType = 'landing' | 'bottom-small' | 'bottom-large'

/**
 * `bottom` picks Bottom small or Bottom large from the content, as the frames do: the pill while the text fits on its
 * one line, the tall box once it wraps, holds a line break or carries attachments (input-large 09 -> 10, queue-1 04).
 */
export type ComposerTypeProp = ComposerType | 'bottom'

/**
 * default: idle. generating: the Assistant is answering (Stop replaces Send, Queue appears once there is text).
 * loading: the prompt itself is being rewritten (Enhance with AI): the text becomes two shimmer bars and Send is disabled.
 */
export type ComposerState = 'default' | 'generating' | 'loading'

/**
 * A tooltip's content: the label, an optional shortcut chip ("Add message to queue" + "↵") and the arrow (Bottom center,
 * or Bottom right for the limit pill).
 */
export type ComposerTip = { label: string; shortcut?: string; arrow?: 'bottom-center' | 'bottom-right' }

/**
 * Wraps a control in its tooltip. The default is the overlay Tooltip (components/overlays, set 9860:712340); 'native'
 * falls back to the title attribute. `open` pins it open (review `hover=` states).
 */
export type RenderTooltip = ((trigger: ReactElement, tip: ComposerTip & { open?: boolean }) => ReactNode) | 'native'

/** Attachments / Placement=With Reply Box: Type=Image Thumbnail | File, State=Default | Loading | Error. */
export type ComposerAttachment = {
  id: string
  kind: 'image' | 'file'
  /** File name ("Attachment"), also the accessible name of the thumbnail. */
  name: string
  /** Supporting text of a file card: "PDF · 200 KB", "File". */
  meta?: string
  /** Colour of the file card's type tile: File (pigeon blue) or PDF (magenta). */
  fileType?: 'file' | 'pdf'
  /** Image preview URL (image thumbnails). */
  src?: string
  /** loading: spinner, Queue / Send disabled. error: red ring, "File upload failed" and a retry button. */
  status?: 'loading' | 'ready' | 'error'
}

/** A recognised token in the text: "/" + a skill name, or "@" + a person. */
export type ComposerTokenKind = 'skill' | 'mention'

export type ComposerToken = {
  kind: ComposerTokenKind
  /** The name without its trigger character: "Tech design requirements", "Matt Rivera". */
  label: string
  /** Where it sits in the text, trigger character included: [start, end). */
  start: number
  end: number
}

/** Renders one token inside the text. The default is the steel-blue run of the Figma frames. */
export type RenderToken = (token: ComposerToken, text: string) => ReactNode

/** A box in viewport coordinates (getBoundingClientRect space), for anchoring a picker to the caret. */
export type CaretBox = { left: number; top: number; right: number; bottom: number; width: number; height: number }

/**
 * The trigger the caret is in: "@ma" while picking a person, "/te" while picking a skill. `start` is the index of the
 * trigger character, `end` the caret; `caret` is the caret's box and `anchor` the trigger character's box, both in
 * viewport coordinates, so a picker can open at either (convert with toContainerBox for a positioned layer).
 */
export type ComposerTrigger = {
  kind: ComposerTokenKind
  char: '@' | '/'
  query: string
  start: number
  end: number
  caret: CaretBox
  anchor: CaretBox
}

/** Imperative handle (pass `handleRef`): what a picker needs to finish a token. */
export type ComposerHandle = {
  focus: () => void
  /** Replaces the active trigger ("@ma") with a finished token ("@Matt Rivera ") and puts the caret after it. */
  insertToken: (kind: ComposerTokenKind, label: string) => void
  /** The caret's box now (viewport coordinates), or null when the field is not mounted. */
  caretBox: () => CaretBox | null
  textarea: () => HTMLTextAreaElement | null
}

/** Review-only pinned hover (`hover=` in the URL): shows the hover look and opens the tooltip without a pointer. */
export type ComposerHover = 'send' | 'stop' | 'queue' | 'limit' | 'add' | 'chip:company' | 'chip:research'

export type ComposerSlot = ReactNode
