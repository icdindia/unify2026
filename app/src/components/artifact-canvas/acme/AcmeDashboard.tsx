import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../buttons/cx'
import { Donut, Gauge, UsagePanel } from './charts'
import {
  ACCOUNT, FEATURES, GOING_BAD, GOING_GOOD, HEALTH, HEALTH_TILES, JOURNEY, KPIS, LEVELS, MODULES, NPS, ROLES, SEATS,
  SUPPORT_SCORES, TABS, TICKETS, TICKET_CATEGORIES, TICKET_PAGER, type DonutSlice, type TabId, type Trend,
} from './data'
import {
  AcmeLogo, ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronLeftSm, ChevronRightSm, Gauge as GaugeIcon, KpiGlyph,
  Sparkle, TabGlyph, ThumbDown, ThumbUp,
} from './icons'
import './acme-dashboard.css'

// The Acme Inc. account dashboard: the "Untitled.xls" artifact's canvas in chat-artifact 19-22 (Figma: the flat image
// 1809:488590 inside "Frame 2147266806" 1809:488589). Rebuilt as HTML (BUILD-PLAN Q55) at the image's own size: its
// content is 1122px wide (1:1 in the full-screen frame 1809:484624). ArtifactCanvas scales it to the panel as designed,
// or lets it reflow (fix artifact-canvas-reflow). Everything is sample content; the tabs, ranges and pager work.

function TrendLine({ trend, className }: { trend: Trend; className?: string }) {
  const Arrow = trend.dir === 'up' ? ArrowUpRight : ArrowDownRight
  return (
    <p className={cx('acme-trend', `acme-trend--${trend.dir}`, className)}>
      <Arrow className="acme-trend__arrow" />
      <span className="acme-trend__v">{trend.value}</span> {trend.label}
      <span className="acme-sr"> ({trend.dir === 'up' ? 'up' : 'down'})</span>
    </p>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section className="acme-section" aria-labelledby={id}>
      <h4 id={id} className="acme-section__title">{title}</h4>
      {children}
    </section>
  )
}

function Legend({ slices }: { slices: DonutSlice[] }) {
  return (
    <ul className="acme-legend">
      {slices.map(s => (
        <li key={s.label}>
          <i className={`acme-dot acme-tone-${s.tone}`} aria-hidden="true" />
          <span className="acme-legend__l">{s.label}</span>
          <span className="acme-legend__v">{s.value}</span>
        </li>
      ))}
    </ul>
  )
}

function HealthTab() {
  const [page, setPage] = useState(2)
  return (
    <>
      <Section title="Adoption">
        <div className="acme-card acme-card--usage"><UsagePanel title="OVERALL USAGE" /></div>

        <div className="acme-card acme-card--features">
          <h5 className="acme-label">FEATURE SEQUENCING</h5>
          <ul className="acme-levels" aria-label="Legend">
            {LEVELS.map(l => <li key={l.id}><i className={`acme-dot acme-level-${l.id}`} aria-hidden="true" />{l.label}</li>)}
          </ul>
          <ul className="acme-features">
            {FEATURES.map((f, i) => (
              <li key={i}>
                <span className="acme-features__name">{f.name}</span>
                <span className="acme-features__pct">{f.pct}</span>
                <span className={`acme-bar acme-level-${f.level}`} style={{ width: `${f.bar * 100}%` }} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div className="acme-card acme-card--seats">
          <h5 className="acme-label">SEAT UTILISATION</h5>
          <div className="acme-seats">
            <span className="acme-seats__pct">{SEATS.pct}</span>
            <span className="acme-seats__of"><b>{SEATS.used}</b> of {SEATS.total}</span>
          </div>
          <div className="acme-seats__track" role="meter" aria-label="Seats used" aria-valuenow={SEATS.used} aria-valuemin={0} aria-valuemax={SEATS.total}>
            <i style={{ width: `${SEATS.bar * 100}%` }} />
          </div>
          <div className="acme-split">
            <div className="acme-sub">
              <h6 className="acme-label acme-label--sm">MODULE WISE UTILIZATION</h6>
              <div className="acme-sub__body"><Donut slices={MODULES} label="Module wise utilization" /><Legend slices={MODULES} /></div>
            </div>
            <div className="acme-sub">
              <h6 className="acme-label acme-label--sm">ROLE-BASED UTILISATION</h6>
              <div className="acme-sub__body"><Donut slices={ROLES} label="Role-based utilisation" /><Legend slices={ROLES} /></div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Customer Health Score">
        <div className="acme-health">
          <div className="acme-tile acme-tile--gauge"><Gauge score={HEALTH.score} label={HEALTH.label} /></div>
          {HEALTH_TILES.map(t => (
            <div key={t.label} className="acme-tile">
              <p className="acme-mono">{t.label}</p>
              <p className="acme-tile__v">{t.value}{t.suffix && <small>{t.suffix}</small>}</p>
              <TrendLine trend={t.trend} className="acme-tile__trend" />
            </div>
          ))}
        </div>
        <div className="acme-pair">
          <div className="acme-note acme-note--good">
            <h5 className="acme-note__t"><ThumbUp />WHAT’S GOING GOOD</h5>
            <ul>{GOING_GOOD.map((g, i) => <li key={i}>{g}</li>)}</ul>
          </div>
          <div className="acme-note acme-note--bad">
            <h5 className="acme-note__t"><ThumbDown />WHAT’S GOING BAD</h5>
            <ul>{GOING_BAD.map((g, i) => <li key={i}>{g}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section title="Customer Sentiment">
        <div className="acme-card acme-card--nps">
          <h5 className="acme-label">NPS DISTRIBUTION</h5>
          <div className="acme-nps__total"><span>{NPS.total}</span><TrendLine trend={NPS.trend} /></div>
          <div className="acme-nps__bar" aria-hidden="true">{NPS.groups.map(g => <i key={g.label} className={`acme-nps-${g.tone}`} />)}</div>
          <ul className="acme-chips">
            {NPS.groups.map(g => (
              <li key={g.label}><i className={`acme-dot acme-dot--lg acme-nps-${g.tone}`} aria-hidden="true" /><span>{g.label}</span><b>{g.value}</b></li>
            ))}
          </ul>
          <div className="acme-sub acme-sub--trend"><UsagePanel title="TREND" size="sm" /></div>
        </div>
      </Section>

      <Section title="Customer Support">
        <div className="acme-pair">
          {SUPPORT_SCORES.map(s => (
            <div key={s.label} className="acme-card acme-card--score">
              <p className="acme-mono">{s.label}</p>
              <div className="acme-score">
                <span className="acme-disc acme-disc--deep"><KpiGlyph kind={s.icon} /></span>
                <span className="acme-score__v">{s.value}<small>{s.of}</small></span>
                <TrendLine trend={s.trend} className="acme-score__trend" />
              </div>
            </div>
          ))}
        </div>

        <div className="acme-card acme-card--table">
          <h5 className="acme-label">TOP TICKET CATEGORIES (LAST 90 DAYS)</h5>
          <div className="acme-table-wrap">
            <table className="acme-table">
              <thead><tr><th scope="col">CATEGORY</th><th scope="col">VOLUME</th><th scope="col">% OF TOTAL</th><th scope="col">AVG. RESOLUTION</th></tr></thead>
              <tbody>
                {TICKET_CATEGORIES.map(r => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{r.volume}</td>
                    <td><span className="acme-table__share"><i className={`acme-tone-${r.tone}`} style={{ width: `${r.bar * 100}%` }} aria-hidden="true" /></span><span className="acme-table__pct">{r.pct}</span></td>
                    <td>{r.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="acme-pager">
            <span>{TICKET_PAGER.showing}</span>
            <nav className="acme-pager__nav" aria-label="Pages">
              <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeftSm /></button>
              <span aria-current="page">{String(page).padStart(2, '0')}</span>
              <span>{TICKET_PAGER.of}</span>
              <button type="button" aria-label="Next page" disabled={page >= 100} onClick={() => setPage(p => Math.min(100, p + 1))}><ChevronRightSm /></button>
            </nav>
          </div>
        </div>

        <div className="acme-card acme-card--tickets">
          <h5 className="acme-label">OPEN TICKETS</h5>
          <ul className="acme-tickets">
            {TICKETS.map((t, i) => (
              <li key={i} className="acme-ticket">
                <div className="acme-ticket__body">
                  <div className="acme-ticket__head">
                    <div>
                      <p className="acme-ticket__id">{t.id}</p>
                      <p className="acme-ticket__title">{t.title}</p>
                    </div>
                    <div className="acme-ticket__tags">
                      <span className={`acme-prio acme-prio--${t.priority.toLowerCase()}`}>• {t.priorityLabel}</span>
                      <span className="acme-status">{t.status}</span>
                    </div>
                  </div>
                  <dl className="acme-ticket__facts">
                    <div><dt>Category</dt><dd>{t.category}</dd></div>
                    <div><dt>Opened</dt><dd>{t.opened}</dd></div>
                    <div><dt>Owner</dt><dd className="acme-owner"><span className="acme-owner__av" aria-hidden="true">OR</span>{t.owner}</dd></div>
                  </dl>
                  <dl className="acme-ticket__impact"><div><dt>Impact</dt><dd>{t.impact}</dd></div></dl>
                </div>
                <div className="acme-ticket__next">
                  <Sparkle className="acme-ticket__spark" />
                  <span className="acme-ticket__nl">Next Action</span>
                  <span className="acme-ticket__nq">{t.next}</span>
                  <button type="button" className="acme-exec">Execute <ArrowUpRight /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}

/** The Acme dashboard. `onBack` wires the header's back chevron (it does nothing in the sample). */
export function AcmeDashboard({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState<TabId>('health')
  const tabsRef = useRef<HTMLDivElement>(null)
  const base = useId()
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex(t => t.id === tab)
    let next: number
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    setTab(TABS[next].id)
    tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }
  return (
    <div className="acme" data-node-id="1809:488590">
      <header className="acme-hd">
        <button type="button" className="acme-back" aria-label="Back to accounts" onClick={onBack}><ChevronLeft /></button>
        <span className="acme-logo" aria-hidden="true"><AcmeLogo /></span>
        <div className="acme-hd__who">
          <div className="acme-hd__row">
            <h3 className="acme-hd__name">{ACCOUNT.name}</h3>
            <span className="acme-risk"><GaugeIcon />{ACCOUNT.risk}</span>
          </div>
          <p className="acme-hd__meta">{ACCOUNT.meta}</p>
        </div>
        <div className="acme-hd__when">
          <p className="acme-hd__date">{ACCOUNT.renewal}</p>
          <p className="acme-hd__meta">{ACCOUNT.renewalLabel}</p>
        </div>
      </header>

      <ul className="acme-kpis" aria-label="Key metrics">
        {KPIS.map(k => (
          <li key={k.id} className="acme-kpi">
            <p className="acme-mono">{k.label}</p>
            <p className="acme-kpi__row"><span className="acme-disc"><KpiGlyph kind={k.icon} /></span><span className="acme-kpi__v">{k.value}</span></p>
            <TrendLine trend={k.trend} />
          </li>
        ))}
      </ul>

      <section className="acme-journey" aria-label="Customer journey">
        <h4 className="acme-mono acme-mono--lg">CUSTOMER JOURNEY</h4>
        <ol className="acme-steps">
          {JOURNEY.map((s, i) => (
            <li key={s.label} className={`acme-step is-${s.state}`} aria-current={s.state === 'current' ? 'step' : undefined}>
              <span className="acme-step__dot" aria-hidden="true">
                {s.state === 'done' && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.6l2 2 4-4.2" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              {i < JOURNEY.length - 1 && <span className={cx('acme-step__line', s.state === 'done' && 'is-done')} aria-hidden="true" />}
              <span className="acme-step__l">{s.label}</span>
              <span className="acme-step__d">{s.date}<span className="acme-sr">, {s.state === 'done' ? 'done' : s.state === 'current' ? 'current stage' : 'upcoming'}</span></span>
            </li>
          ))}
        </ol>
      </section>

      <div ref={tabsRef} role="tablist" aria-label="Account views" className="acme-tabs" onKeyDown={onTabKey}>
        {TABS.map(t => (
          <button
            key={t.id} type="button" role="tab" id={`${base}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${base}-panel`}
            tabIndex={tab === t.id ? 0 : -1} className={cx('acme-tab', tab === t.id && 'is-on')} onClick={() => setTab(t.id)}
          >
            <span className="acme-tab__i"><TabGlyph tab={t.id} /></span>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${tab}`} className={cx('acme-panel', tab !== 'health' && 'acme-panel--empty')}>
        {tab === 'health' ? <HealthTab /> : (
          <p className="acme-empty">The {TABS.find(t => t.id === tab)?.label} view is not drawn in Figma; the sample shows Health.</p>
        )}
      </div>
    </div>
  )
}
