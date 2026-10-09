import hubspot from './assets/hubspot.svg'
import slack from './assets/slack.svg'
import salesforce from './assets/salesforce.svg'
import './banner-carousel.css'

/** "Banner carousel" component set 387:149552; Property 1=Three apps is 387:149553 (the landing's only drawn slide). */
export const BANNER_CAROUSEL_SET = '387:149552'
export const BANNER_THREE_APPS = '387:149553'

export type BannerCarouselProps = {
  /** Figma node of this instance (chat-artifact 01: 2532:73193, 02: 2532:73269). Default: the variant. */
  nodeId?: string
  className?: string
}

/**
 * The "Connect apps" banner under the landing composer (Banner carousel / Property 1=Three apps): a 520 x 82 card with a
 * white-to-sand gradient, the title and line on the left and three tilted app tiles (HubSpot, Slack, Salesforce) on the
 * right, then the three pager dots. Figma draws only this slide (the other Feature Banners have no copy), so the dots are
 * a static picture of the carousel, not controls. Geometry ported from prototypes/notification-flow (the verified 1:1
 * rebuild of the same instance on the Projects dashboard landing) and checked against chat-artifact 01 at 1440.
 */
export function BannerCarousel({ nodeId = BANNER_THREE_APPS, className }: BannerCarouselProps) {
  return (
    <section className={'bnr' + (className ? ` ${className}` : '')} data-node-id={nodeId} aria-label="Get started">
      <div className="bnr__clip">
        <div className="bnr__card">
          <div className="bnr__text">
            <p className="bnr__title">Connect apps</p>
            <p className="bnr__line">Connect apps you already use — Atlas works in context, not in isolation.</p>
          </div>
          <div className="bnr__art" aria-hidden="true">
            <div className="bnr__ill">
              <div className="bnr__slot bnr__slot--a"><div className="bnr__tile bnr__tile--l" /></div>
              <div className="bnr__hub"><img alt="" src={hubspot} /></div>
              <div className="bnr__slot bnr__slot--b"><div className="bnr__tile bnr__tile--r" /></div>
              <div className="bnr__sf"><div className="bnr__sf-in"><img alt="" src={salesforce} /></div></div>
              <div className="bnr__tile bnr__tile--mid bnr__tile--ws" />
              <div className="bnr__tile bnr__tile--mid" />
              <div className="bnr__slack"><img alt="" src={slack} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bnr__dots" aria-hidden="true">
        <span className="bnr__dot is-current" /><span className="bnr__dot" /><span className="bnr__dot" />
      </div>
    </section>
  )
}
