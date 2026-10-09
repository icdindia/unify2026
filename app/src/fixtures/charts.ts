// Chart data for the "Business units led" chat (graphs 04 and 06). Figma's charts are detached frames
// (`KPI Tiles Row`, `Sunburst Frame`, `Chart Container`), so the numbers below are read from their text layers.

export type ChartId = 'portfolio-sunburst' | 'bu-bubble' | 'fy2023-combo'

/** As drawn in graphs 04 (1707:125411): a $100M portfolio sunburst, inner ring = asset class, outer = holdings. */
export const PORTFOLIO_SUNBURST = {
  centre: { value: '$100M', label: 'Total portfolio' },
  classes: [
    { name: 'Equities', total: 59, holdings: [['US Large Cap', 28], ['Intl Developed', 14], ['US Small Cap', 9], ['Emerging Markets', 8]] },
    { name: 'Fixed Income', total: 25, holdings: [['Treasuries', 12], ['Corporate', 8], ['Municipals', 5]] },
    { name: 'Alternatives', total: 14, holdings: [['Real Estate', 7], ['Private Equity', 5], ['Commodities', 2]] },
    { name: 'Cash', total: 2, holdings: [['Money Market', 2]] },
  ] as { name: string; total: number; holdings: [string, number][] }[],
  /** The legend under the chart lists business units with headcount, not asset classes (the drift Q29 resolves). */
  legend: ['Cloud (85 staff)', 'Hardware (120 staff)', 'Consulting (48 staff)', 'Support (95 staff)', 'Training (22 staff)', 'Partnerships (15 staff)'],
}

/**
 * Q29 default: the answer's subtitle describes a bubble chart (revenue vs margin, bubble = team size), so the
 * prototype builds it (fix bu-bubble-chart). Figma gives only the team sizes and three KPI facts (Cloud $12.4M
 * highest revenue, Training 51% highest margin, Hardware 120 largest team); the other revenue and margin values
 * are the prototype's, chosen to keep those facts and "Training & Consulting top margin" true.
 */
export const BU_BUBBLE = {
  x: { label: 'Revenue ($M)' },
  y: { label: 'Profit Margin (%)' },
  size: { label: 'Team Size' },
  units: [
    { name: 'Cloud', revenue: 12.4, margin: 34, staff: 85 },
    { name: 'Hardware', revenue: 9.8, margin: 18, staff: 120 },
    { name: 'Support', revenue: 7.3, margin: 29, staff: 95 },
    { name: 'Consulting', revenue: 6.1, margin: 47, staff: 48 },
    { name: 'Partnerships', revenue: 3.2, margin: 41, staff: 15 },
    { name: 'Training', revenue: 2.6, margin: 51, staff: 22 },
  ],
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

/** graphs 06 (1707:125957): the data the user pasted in the follow-up prompt. Axes as drawn: $0M-$90M, 50%-75%. */
export const FY2023_COMBO = {
  bars: { label: 'Revenue ($M)', axis: { min: 0, max: 90, step: 10, format: (v: number) => `$${v}M` } },
  line: { label: 'Gross Margin (%)', axis: { min: 50, max: 75, step: 5, format: (v: number) => `${v}%` } },
  months: MONTHS.map((m, i) => ({
    month: m,
    revenue: [42, 45, 48, 51, 55, 58, 61, 64, 66, 70, 74, 81][i],
    margin: [58, 59, 59, 61, 62, 62, 63, 64, 64, 66, 67, 68][i],
  })),
}

export const CHARTS = {
  'portfolio-sunburst': PORTFOLIO_SUNBURST,
  'bu-bubble': BU_BUBBLE,
  'fy2023-combo': FY2023_COMBO,
} satisfies Record<ChartId, unknown>
