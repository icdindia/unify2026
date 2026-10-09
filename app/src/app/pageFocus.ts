import { useLayoutEffect, useRef } from 'react'

const APP_NAME = 'Enterprise Brain prototype'

/**
 * Route changes for keyboard and screen-reader users. `page` is the path of the page on screen and `title` its name,
 * both null while a redirect is pending.
 * - document.title names the page ("Banking Issues · Enterprise Brain prototype").
 * - After an in-app navigation, when the control that had focus went away with the old page (a project card, the
 *   breadcrumb), focus moves to the new page's <h1> (tabIndex -1), which screen readers announce. A control that is
 *   still on screen (a nav row, the review bar) keeps focus. The first page shown leaves focus alone.
 */
export function usePageFocusAndTitle(page: string | null, title: string | null) {
  useLayoutEffect(() => {
    if (title !== null) document.title = `${title} · ${APP_NAME}`
  }, [title])

  const shown = useRef<string | null>(null)
  useLayoutEffect(() => {
    if (page === null) return
    const previous = shown.current
    shown.current = page
    if (previous === null || previous === page) return
    const active = document.activeElement
    if (active && active !== document.body && active.isConnected) return
    document.querySelector<HTMLElement>('main h1')?.focus()
  }, [page])
}
