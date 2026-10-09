import { useId, useState } from 'react'
import { cx } from '../../buttons/cx'
import { DONUT_ARCS, MONTHS, RANGES, USAGE, type DonutSlice, type Range } from './data'

// The Acme dashboard's charts, drawn as SVG so they reflow with the page. Sample artifact content (Q55): parts of the
// flat image 1809:488590, so they have no Figma node of their own (the dashboard root carries the image's id).

const POINTS: Record<Range, number> = { '3M': 12, '6M': 23, '12M': USAGE.length }
const LABELS: Record<Range, string[]> = { '3M': MONTHS.slice(9), '6M': MONTHS.slice(6), '12M': MONTHS }
const TICKS = [1000, 800, 600, 400, 200, 0]

/** 3M / 6M / 12M: a radio group (one Tab stop, arrows move). */
export const RangeSwitch = ({ value, onChange, label, size = 'md' }: { value: Range; onChange: (r: Range) => void; label: string; size?: 'sm' | 'md' }) => {
  const move = (dir: number) => {
    const i = RANGES.indexOf(value)
    onChange(RANGES[(i + dir + RANGES.length) % RANGES.length])
  }
  return (
    <div
      role="radiogroup" aria-label={label} className={cx('acme-range', size === 'sm' && 'acme-range--sm')}
      onKeyDown={e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
        else return
        requestAnimationFrame(() => (e.currentTarget?.querySelector('[aria-checked="true"]') as HTMLElement | null)?.focus())
      }}
    >
      {RANGES.map(r => (
        <button
          key={r} type="button" role="radio" aria-checked={r === value} tabIndex={r === value ? 0 : -1}
          className={cx('acme-range__opt', r === value && 'is-on')} onClick={() => onChange(r)}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

/** Line + soft area over a 0-1000 axis, dashed grid, months under it. The SVG stretches; the line keeps 2px. */
export const UsageChart = ({ range, label }: { range: Range; label: string }) => {
  const gid = useId()
  const data = USAGE.slice(-POINTS[range])
  const n = data.length - 1
  const pts = data.map((v, i) => `${(i / n) * 1000},${1000 - v}`)
  const line = 'M' + pts.join('L')
  const area = `${line}L1000,1000L0,1000Z`
  const months = LABELS[range]
  return (
    <figure className="acme-chart" aria-label={`${label}: ${data[0]} to ${data[n]} over ${range}`}>
      <div className="acme-chart__plot">
        <ol className="acme-chart__y" aria-hidden="true">
          {TICKS.map(t => <li key={t}><span>{t.toLocaleString('en-US')}</span></li>)}
        </ol>
        <div className="acme-chart__area">
          {TICKS.map(t => <i key={t} className="acme-chart__grid" style={{ top: `${(1 - t / 1000) * 100}%` }} />)}
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity=".14" />
                <stop offset=".62" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gid})`} />
            <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <ol className="acme-chart__x" aria-hidden="true">{months.map(m => <li key={m}>{m}</li>)}</ol>
    </figure>
  )
}

/** Chart card body with its own 3M / 6M / 12M switch. */
export const UsagePanel = ({ title, size = 'md' }: { title: string; size?: 'sm' | 'md' }) => {
  const [range, setRange] = useState<Range>('12M')
  return (
    <>
      <div className="acme-card__head">
        <h4 className="acme-label">{title}</h4>
        <RangeSwitch value={range} onChange={setRange} label={`${title.toLowerCase()} range`} size={size} />
      </div>
      <UsageChart range={range} label={title} />
    </>
  )
}

const polar = (r: number, deg: number) => {
  const t = (deg - 90) * (Math.PI / 180)
  return [50 + r * Math.cos(t), 50 + r * Math.sin(t)]
}
const arc = (r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(r, a0)
  const [x1, y1] = polar(r, a1)
  return `M${x0.toFixed(3)},${y0.toFixed(3)}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(3)},${y1.toFixed(3)}`
}

/** Four-slice ring (Module wise / Role-based utilisation): 144px, 19px band, arcs as drawn. */
export const Donut = ({ slices, label }: { slices: DonutSlice[]; label: string }) => {
  return (
    <svg className="acme-donut" viewBox="0 0 100 100" role="img" aria-label={label}>
      {slices.map((s, i) => (
        <path key={s.label} className={`acme-tone-${s.tone}`} d={arc(43.2, DONUT_ARCS[i][0], DONUT_ARCS[i][1])} fill="none" stroke="currentColor" strokeWidth="13.2" />
      ))}
    </svg>
  )
}

/** Health gauge: a 270° track from 7:30 round to 4:30, the score's red arc from the start to the knob (drawn to ~9 o'clock). */
export const Gauge = ({ score, label }: { score: number; label: string }) => {
  const gid = useId()
  const start = 225
  const end = 225 + 270
  const knob = 283 // as drawn (the image stops the arc a little above 9 o'clock for 32)
  const [kx, ky] = polar(40, knob)
  return (
    <div className="acme-gauge" role="img" aria-label={`Health score ${score}, ${label}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".62" />
          </linearGradient>
        </defs>
        <path className="acme-gauge__track" d={arc(40, start, end)} fill="none" stroke="currentColor" strokeWidth="6.6" strokeLinecap="round" />
        <path d={arc(40, start, knob)} fill="none" stroke={`url(#${gid})`} strokeWidth="6.6" strokeLinecap="round" />
        <circle className="acme-gauge__knob" cx={kx} cy={ky} r="4.6" />
      </svg>
      <div className="acme-gauge__value">
        <span className="acme-gauge__score">{score}</span>
        <span className="acme-gauge__label">{label}</span>
      </div>
    </div>
  )
}
