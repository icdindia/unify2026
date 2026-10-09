import type { Text } from './drift'

// Queued follow-ups (queue-1, "Text Queue Card"). Copy read from 8237:503500, 8237:505695 and 8255:524125.

export type QueueItem = {
  id: string
  text: Text
  /** Image thumbnail at the row's end (`Attachments / Type=Image Thumbnail`). 15 draws a different image per row. */
  attachment?: { kind: 'image'; name: string }
}

const MINIMAL = 'Keep the design minimal'
const ATTACHED = 'Use the attached image as a reference for data graphs.'

/** Rows by queue size: queue-1 (03), queue-2 (06), queue-4 (15, 16). */
export const QUEUE_ITEMS: Record<1 | 2 | 4, QueueItem[]> = {
  1: [{ id: 'q1', text: MINIMAL }],
  2: [
    { id: 'q1', text: MINIMAL },
    { id: 'q2', text: ATTACHED, attachment: { kind: 'image', name: 'chart-reference-1.png' } },
  ],
  4: [
    { id: 'q1', text: MINIMAL },
    { id: 'q2', text: ATTACHED, attachment: { kind: 'image', name: 'chart-reference-1.png' } },
    { id: 'q3', text: MINIMAL },
    { id: 'q4', text: ATTACHED, attachment: { kind: 'image', name: 'chart-reference-2.png' } },
  ],
}
