import type { CaretBox } from './types'

// Caret geometry for a <textarea>: the classic mirror technique. A hidden div copies the field's box and type styles,
// holds the text up to the index, then a marker span; the span's offset is where that index sits on screen.
const COPIED = [
  'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
  'fontFeatureSettings', 'fontVariationSettings', 'textAlign', 'textTransform', 'textIndent', 'letterSpacing', 'wordSpacing',
  'tabSize', 'whiteSpace', 'wordBreak', 'overflowWrap',
] as const

/** The box of the character at `index` (or of the caret placed there), in viewport coordinates. */
export function caretBoxAt(field: HTMLTextAreaElement, index: number): CaretBox {
  const style = getComputedStyle(field)
  const div = document.createElement('div')
  const s = div.style as unknown as Record<string, string>
  for (const k of COPIED) s[k] = style[k as keyof CSSStyleDeclaration] as string
  s.position = 'absolute'
  s.visibility = 'hidden'
  s.top = '0'
  s.left = '-9999px'
  s.overflow = 'hidden'
  if (field.wrap === 'off') s.whiteSpace = 'pre'
  else if (style.whiteSpace === 'normal' || !style.whiteSpace) s.whiteSpace = 'pre-wrap'
  div.textContent = field.value.slice(0, index)
  const marker = document.createElement('span')
  marker.textContent = field.value.slice(index, index + 1) || '​'
  div.appendChild(marker)
  document.body.appendChild(div)
  const r = field.getBoundingClientRect()
  const lineHeight = parseFloat(style.lineHeight) || marker.offsetHeight
  const left = r.left + field.clientLeft + marker.offsetLeft - field.scrollLeft
  const top = r.top + field.clientTop + marker.offsetTop - field.scrollTop
  const width = marker.offsetWidth
  document.body.removeChild(div)
  return { left, top, right: left + width, bottom: top + lineHeight, width, height: lineHeight }
}

/** A viewport box in the coordinates of a positioned container (as relativeBox does for elements). */
export function toContainerBox(box: CaretBox, container: HTMLElement): CaretBox {
  const c = container.getBoundingClientRect()
  const x = c.left + container.clientLeft - container.scrollLeft
  const y = c.top + container.clientTop - container.scrollTop
  return { left: box.left - x, top: box.top - y, right: box.right - x, bottom: box.bottom - y, width: box.width, height: box.height }
}
