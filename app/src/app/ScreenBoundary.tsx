import { Component, type ReactNode } from 'react'
import { Link } from '../router/Link'
import './screen-boundary.css'

type Props = {
  /** The route. A new value clears a caught error, so navigating anywhere retries. */
  resetKey: string
  children: ReactNode
}

type State = { error: unknown; key: string }

/**
 * Error boundary around the page: a screen that throws while rendering shows a short notice instead of unmounting the
 * whole app, so the nav and the review bar stay usable and any route change (nav, Back, a typed URL) recovers.
 */
export class ScreenBoundary extends Component<Props, State> {
  state: State = { error: null, key: this.props.resetKey }

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error: error ?? new Error('Unknown render error') }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.resetKey === state.key ? null : { error: null, key: props.resetKey }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <section className="screen-error" role="alert">
        <h1 className="screen-error__title" tabIndex={-1}>This screen could not be shown</h1>
        <p>Something in the prototype failed while drawing it. The details are in the browser console.</p>
        <Link to="/projects">Back to Projects</Link>
      </section>
    )
  }
}
