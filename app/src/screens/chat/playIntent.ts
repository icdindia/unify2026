// A chat URL with at= renders that beat still (a review / diff render). A chat the user reaches by an action (Send on the
// landing page) plays live from that beat instead: the action leaves this one-shot intent, the chat screen reads it on
// mount and clears it once playing. Module state, not URL state: reloading or sharing the URL shows the still beat, as a
// frame URL should.
let pending: { chat: string; at: number } | null = null

/** The next chat screen for `chat` mounted within a few seconds plays live. */
export function requestPlay(chat: string) {
  pending = { chat, at: Date.now() }
}

/** Whether a fresh intent to play `chat` is waiting (idempotent: StrictMode may ask twice). */
export function wantsPlay(chat: string): boolean {
  return !!pending && pending.chat === chat && Date.now() - pending.at < 5000
}

export function clearPlay() {
  pending = null
}
