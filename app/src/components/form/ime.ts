import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

/**
 * True for a keydown that belongs to an input method (Japanese, Chinese, Korean …), which a field must leave alone:
 * every key while a composition runs (isComposing), and the Enter that confirms one. Safari fires compositionend before
 * that Enter's keydown, so isComposing is already false there, but the keydown still carries keyCode 229 ("an IME is
 * processing this key"). MDN's guard for the same reason: `event.isComposing || event.keyCode === 229`.
 */
export function isImeKey(e: ReactKeyboardEvent | KeyboardEvent): boolean {
  const n = 'nativeEvent' in e ? e.nativeEvent : e
  return n.isComposing || n.keyCode === 229
}
