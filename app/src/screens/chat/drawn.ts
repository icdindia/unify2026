import type { ArtifactGlyph } from '../../components/inline-artifact-card'
import { framesForRoute, type FrameRef } from '../../figma/frames'

// What each chat-artifact frame draws that the URL does not say, so "As designed" can reproduce the frame 1:1:
//   - frame state the URL cannot hold (03 hovers "Settings" in the Add to Project submenu): drawn in both modes;
//   - departures from the coherent chat (scroll offsets, copy that differs between frames, spacing): drawn only as
//     designed; "With fixes" draws the coherent chat (the matching CHAT_SCREEN_FIXES / component / fixture fixes).
// Keyed by the journey step; the screen finds the frame from the route it draws (exact match only).

export type Drawn = {
  /** As designed: scroll the thread so this item's top edge sits at viewport y `y` (0 = the top of the window). */
  scroll?: { item: string; y: number }
  /** As designed: hide the running thinking row (03 hides Agent COT / Step 1). */
  hideThinking?: boolean
  /** As designed: these fixture drifts take their fixed value in this frame (14 spells "@Assistant" right; 16-22 draw Grace's own message). */
  drawsFixed?: string[]
  /** As designed: the inline card's mark / meta (15: Interactive HTML tile and meta; 19-21b: the document mark). */
  card?: { glyph?: ArtifactGlyph; meta?: string }
  /** As designed: space between one participant's bubbles (15-18 draw 48). */
  bubbleGap?: 48
  /** As designed: space from a participant's name row to the first bubble (15 draws 48). */
  nameGap?: 48
  /** As designed: space between two participants' groups (15 draws 80). */
  groupGap?: 80
  /** As designed: messages that start a new group although the sender did not change (14: Matt's third message). */
  groupBreaks?: string[]
  /** As designed: the Pipeline Command answer's text 8 under its header line (16-18; the component draws 4). */
  answerGap?: 8
  /** As designed: the split's chat column width (19 draws 670, beyond the 650 the split allows). */
  chatWidth?: number
  /** As designed: the artifact page sits 4px lower in its panel (19). */
  canvasLow?: boolean
  /** As designed: participants' mentions as blue text without the pill (16-18 draw Matt's "@Assitant" so). */
  mentionText?: boolean
  /** As designed: the inline card keeps its hover look although the pointer is on the files panel (17, 18). */
  cardHover?: boolean
  /** As designed: the files count on the header's clipboard (16). */
  filesBadge?: number
  /** As designed: the comments icon in the header (10-14). */
  comments?: boolean
  /** As designed: the split column ends with the first question again (19-21b). */
  splitTail?: boolean
  /** As designed: John's and Grace's bubbles in Text sm (21, 21a, 21b). */
  smallBubbles?: boolean
  /** As designed: the split column's composer 10 above the bottom edge instead of 16 (21, 21a, 21b). */
  lowComposer?: boolean
  /** As designed: the chat header is ES Breadcrumb / Variant=with Icon (21-21b): no title chevron, the lock on Share
   *  although people joined, the actions 0 apart. */
  headerWithIcon?: boolean
  /** The ES Breadcrumb instance of the frame, where components/chat-header has none (21-21b). */
  headerNode?: string
  /** As designed: the rail highlights Artifacts while the artifact is open (21-22); otherwise New Session. */
  navArtifacts?: boolean
  /** Frame state, both modes: the hovered row of the Add to Project submenu (03: "Settings"). */
  hoverProject?: number
}

const STEP: Record<string, Drawn> = {
  '03': { hideThinking: true, hoverProject: 1 },
  '10': { comments: true },
  '11': { comments: true },
  '12': { comments: true },
  '13': { comments: true, scroll: { item: 'm-roger-matt', y: 585 } },
  '14': {
    comments: true, drawsFixed: ['typo-assistant'], groupBreaks: ['m-matt-3'],
    scroll: { item: 'joined-matt-rivera-john-whitaker-grace-coleman', y: 57 },
  },
  '15': { card: { glyph: 'html', meta: 'Interactive HTML' }, bubbleGap: 48, nameGap: 48, groupGap: 80, scroll: { item: 'turn-interactive', y: 95 } },
  '16': { drawsFixed: ['grace-message-copy'], bubbleGap: 48, answerGap: 8, mentionText: true, filesBadge: 2, scroll: { item: 'turn-interactive', y: 219 } },
  '17': { drawsFixed: ['grace-message-copy'], bubbleGap: 48, answerGap: 8, mentionText: true, cardHover: true, scroll: { item: 'turn-interactive', y: 219 } },
  '18': { drawsFixed: ['grace-message-copy'], bubbleGap: 48, answerGap: 8, mentionText: true, cardHover: true, scroll: { item: 'turn-interactive', y: 219 } },
  '19': {
    drawsFixed: ['grace-message-copy'], card: { glyph: 'doc' }, splitTail: true, chatWidth: 670, canvasLow: true,
    scroll: { item: 'turn-interactive', y: 56 },
  },
  '20': { drawsFixed: ['grace-message-copy'], card: { glyph: 'doc' }, splitTail: true, scroll: { item: 'turn-interactive', y: 56 } },
  '21': {
    drawsFixed: ['grace-message-copy'], splitTail: true, smallBubbles: true, lowComposer: true, headerWithIcon: true, navArtifacts: true, headerNode: '6199:486814',
    scroll: { item: 'turn-interactive', y: 56 },
  },
  '21a': {
    drawsFixed: ['grace-message-copy'], splitTail: true, smallBubbles: true, lowComposer: true, headerWithIcon: true, navArtifacts: true, headerNode: '6405:306208',
    scroll: { item: 'turn-interactive', y: 56 },
  },
  '21b': {
    drawsFixed: ['grace-message-copy'], splitTail: true, smallBubbles: true, lowComposer: true, headerWithIcon: true, navArtifacts: true, headerNode: '6405:308394',
    scroll: { item: 'turn-interactive', y: 56 },
  },
  '22': { drawsFixed: ['grace-message-copy'], navArtifacts: true },
}

/** The chat-artifact frame a drawn route reproduces exactly, if any. */
export function journeyFrameOf(drawnHref: string): FrameRef | undefined {
  return framesForRoute(drawnHref).filter(m => m.exact).map(m => m.frame).find(f => f.journey === 'chat-artifact')
}

export function drawnFor(frame: FrameRef | undefined): Drawn {
  return (frame?.stepId && STEP[frame.stepId]) || {}
}
