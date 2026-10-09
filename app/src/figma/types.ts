// Types of the frame <-> URL map (frames.ts, frames.generated.ts).

/**
 * How a step relates to the one before it (BUILD-PLAN 2.1 "Kind"):
 * N new screen · S same screen, UI-state change · T same screen, time passing · R responsive (viewport width)
 * G gallery / reference sheet · A alias of another step's URL · - not a screen (unrouted only).
 */
export type FrameKind = 'N' | 'S' | 'T' | 'R' | 'G' | 'A' | '-'

export type FrameRef = {
  nodeId: string   // the Figma frame this URL reproduces
  page: string     // Figma page name
  journey: string  // journey id (a row of the Figma page), see JOURNEYS
  step: number     // 1-based position within the journey, in Figma order
  label: string    // what the frame shows
  route: string    // path?query that reproduces it in the prototype (canonical key order, see router/uiParams.ts)
  /** The spec's own step name ("08a", "c01"); falls back to `step`. */
  stepId?: string
  kind?: FrameKind
  /** Other routes drawn by the same frame with different data, e.g. '/projects/:slug' for every project's dashboard. */
  pattern?: string
  /** Width the frame is drawn at when it is not the 1440 baseline (the route's vw=). */
  viewport?: number
  /** Drawn frame size in Figma, [width, height]. */
  size?: [number, number] | number[]
  /** Reference PNG, relative to app/figma-ref/chat-artifacts/. Never bundled: see review/refImage.ts. */
  ref?: string
  /** "chat-artifact 08": the step whose URL this one shares. */
  aliasOf?: string
  note?: string
}

/** A captured frame with no prototype URL: a section card, a designer changelog, or a step not assigned a URL yet. */
export type UnroutedFrame = Omit<FrameRef, 'route' | 'pattern' | 'viewport' | 'aliasOf' | 'note'> & { reason: string }

export type JourneyRef = {
  id: string
  title: string
  /** Title card of the journey in Figma. */
  card?: string | null
  /** false when the journey has no captured spec yet (input-large). */
  captured?: boolean
}

/**
 * One route's frame: `exact` when every state key matches; otherwise the closest frame (hover / rail / nav / viewport
 * differ), or a frame whose URL this is but whose screen does not draw `undrawn` of its keys yet (app/routes.tsx).
 */
export type FrameMatch = { frame: FrameRef; exact: boolean; undrawn?: string[] }
