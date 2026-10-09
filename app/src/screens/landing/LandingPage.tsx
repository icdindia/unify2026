import { useRef, useState } from 'react'
import { AssistantMark } from '../../components/agent'
import { Composer, COMPOSER_HINTS, type ComposerHover } from '../../components/composer'
import { PEOPLE, ME } from '../../fixtures/people'
import { navigate } from '../../router/router'
import { buildUrl, setUi } from '../../router/uiParams'
import { rail } from '../../app/store'
import { requestPlay } from '../chat/playIntent'
import { BannerCarousel } from './BannerCarousel'
import { LANDING_PRESETS, presetOfText, presetText, type LandingPreset } from './route'
import './landing.css'

/** The landing frame's own wrapper ("Frame 2147265764" 1707:136011 in chat-artifact 01). */
export const LANDING_NODE = '1707:136011'
/** "Frame 2147262092": the mark, the greeting and the composer (640 wide, at y 200 of the 900 frame). */
const HELLO_NODE = '2556:376787'

export type LandingPageProps = {
  /** compose= preset (chat-artifact 02 types the commit question). */
  compose: LandingPreset | null
  /** hover= pinned on the composer (02: send). */
  hover: ComposerHover | null
  /** seed=no-chips: the composer without the Company / Research chips (logo-options 01, nav-behaviour 01). */
  noChips: boolean
  /** Figma instance ids of the frame on screen (01 or 02), when the route is one of them. */
  instances?: { composer?: string; banner?: string; mark?: string }
}

/**
 * New Session (BUILD-PLAN 2.1 `/new`, chat-artifact 01-02): the Assistant mark, "Hello Roger / How can I help you
 * today?", the landing composer with its rotating hints and the "Connect apps" banner. Typing moves the URL to the
 * matching compose= preset (02 is the commit question); Send (or Enter) opens the commit chat at `at=sent` and plays it.
 */
export function LandingPage({ compose, hover, noChips, instances }: LandingPageProps) {
  const me = PEOPLE[ME]
  // The composer is keyed by the preset the URL names when it changes from outside (the review stepper, Back), so a
  // new preset is loaded; its own typing only rewrites the URL (replace) and never remounts it.
  const written = useRef<string | null>(compose)
  const [key, setKey] = useState(0)
  const [seenCompose, setSeenCompose] = useState(compose)
  if (compose !== seenCompose) {
    setSeenCompose(compose)
    if (compose !== written.current) { written.current = compose; setKey(k => k + 1) }
  }

  const onChange = (text: string) => {
    const preset = presetOfText(text, LANDING_PRESETS)
    if (preset === written.current) return
    written.current = preset
    setUi({ compose: preset })
  }

  const send = () => {
    // The prototype plays the scripted commit chat (BUILD-PLAN Q2: one coherent script per chat), whatever was typed.
    requestPlay('commit')
    navigate(buildUrl('/chat/commit', { at: 'sent', rail: rail.get() === 'collapsed' ? 'c' : 'e' }))
  }

  return (
    <div className="landing" data-node-id={LANDING_NODE}>
      <section className="landing__hello" data-node-id={HELLO_NODE} aria-labelledby="landing-title">
        <div className="landing__head">
          <AssistantMark nodeId={instances?.mark ?? '3494:215623'} />
          <div className="landing__text">
            <h1 id="landing-title" className="landing__h" tabIndex={-1}>
              <span>Hello</span> <em>{me.first}</em>
            </h1>
            <p className="landing__sub">How can I help you today?</p>
          </div>
        </div>
        <div className="landing__composer">
          <Composer
            key={key}
            type="landing"
            tools={!noChips}
            elevated
            placeholder={[...COMPOSER_HINTS]}
            defaultValue={compose ? presetText(compose) : ''}
            onChange={onChange}
            onSubmit={send}
            hover={hover ?? undefined}
            label="Ask the Assistant"
            nodeId={instances?.composer}
          />
        </div>
      </section>
      <div className="landing__spacer" />
      <BannerCarousel nodeId={instances?.banner} />
    </div>
  )
}
