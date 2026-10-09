import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from './router'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; replace?: boolean }

// In-app link. The default navigation is always cancelled: in a srcdoc preview a relative "#..." href
// resolves against the host page and would unload the prototype.
export function Link({ to, replace, onClick, ...rest }: Props) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to, { replace })
  }
  return <a href={'#' + to} onClick={go} {...rest} />
}
