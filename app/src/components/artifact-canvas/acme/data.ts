// The Acme Inc. account dashboard: the sample content of the "Untitled.xls" / Pipeline Command artifact (chat-artifact
// 19-22). Figma draws it as one flat image ("image 19" 1809:488590, 1136 x 4096 px export); BUILD-PLAN Q55 rebuilds it
// as real HTML. Copy and numbers are read off that image, including its quirks ("15 Nov 20026", "Medium Priorty",
// bar lengths that do not match their percentages): it is sample content, reproduced as drawn.

export type Trend = { dir: 'up' | 'down'; value: string; label: string }

export type Kpi = { id: string; label: string; value: string; icon: 'dollar' | 'chart' | 'star' | 'percent' | 'clock'; trend: Trend }

export const ACCOUNT = {
  name: 'Acme Inc.',
  risk: '30 • AT RISK',
  meta: 'Enterprise • FinTech • Sarah K.',
  renewal: '12 Apr 2026',
  renewalLabel: 'Renewal Due',
}

const yoy = (dir: 'up' | 'down', value = '12%'): Trend => ({ dir, value, label: 'YoY vs LY' })

export const KPIS: Kpi[] = [
  { id: 'arr', label: 'ARR', value: '$285K', icon: 'dollar', trend: yoy('up') },
  { id: 'nrr', label: 'NRR', value: '92%', icon: 'chart', trend: yoy('down') },
  { id: 'nps', label: 'NPS', value: '12', icon: 'star', trend: yoy('up') },
  { id: 'adoption', label: 'ADOPTION', value: '44%', icon: 'percent', trend: yoy('up') },
  { id: 'renewal', label: 'RENEWAL PROB.', value: '38%', icon: 'clock', trend: yoy('up') },
]

export type JourneyStep = { label: string; date: string; state: 'done' | 'current' | 'todo' }

export const JOURNEY: JourneyStep[] = [
  { label: 'Marketing Touch', date: 'Jul 5 2025', state: 'done' },
  { label: 'Outbound DSR', date: 'Jul 5 2025', state: 'done' },
  { label: 'Acquired', date: 'Jul 5 2025', state: 'current' },
  { label: 'Onboarding', date: 'Jul 5 2025', state: 'todo' },
  { label: '20% Adoption', date: 'Jul 5 2025', state: 'todo' },
  { label: '1st Expansion', date: 'Jul 5 2025', state: 'todo' },
  { label: 'Latest QBR', date: 'Jul 5 2025', state: 'todo' },
  { label: 'Renewal', date: 'Jul 5 2025', state: 'todo' },
]

export type TabId = 'health' | 'journey' | 'strategy' | 'intelligence' | 'actions'
export const TABS: { id: TabId; label: string }[] = [
  { id: 'health', label: 'Health' },
  { id: 'journey', label: 'Journey' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'actions', label: 'Actions' },
]

/** Overall usage, 45 weekly points Jan-Dec on a 0-1000 axis, traced from the image's line (x 104-1092). */
export const USAGE: number[] = [
  739, 754, 758, 747, 754, 754, 758, 758, 768, 763, 768, 773, 773, 782, 782, 782, 793, 806, 815, 825, 825, 829, 825,
  809, 787, 782, 810, 825, 829, 839, 858, 863, 867, 858, 850, 839, 842, 848, 839, 840, 848, 856, 872, 896, 896, 919,
]
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const RANGES = ['3M', '6M', '12M'] as const
export type Range = typeof RANGES[number]

export type Level = 'mastered' | 'active' | 'low' | 'none'
export const LEVELS: { id: Level; label: string }[] = [
  { id: 'mastered', label: 'Mastered• >80%' },
  { id: 'active', label: 'Active • 40-80%' },
  { id: 'low', label: 'Low • <40%' },
  { id: 'none', label: 'Not Started' },
]

/** Feature sequencing rows. `bar` is the drawn bar length (of the 1036px track), which the image does not tie to the label. */
export const FEATURES: { name: string; pct: string; bar: number; level: Level }[] = [
  { name: 'Analytics', pct: '95%', bar: 0.92, level: 'mastered' },
  { name: 'Core Platform', pct: '72%', bar: 0.575, level: 'active' },
  { name: 'Reporting', pct: '76%', bar: 0.834, level: 'mastered' },
  { name: 'Integrations', pct: '30%', bar: 0.225, level: 'low' },
  { name: 'Integrations', pct: '45%', bar: 0.403, level: 'active' },
]

export const SEATS = { pct: '32%', used: 32, total: 100, bar: 0.485 }

export type DonutSlice = { label: string; value: number; tone: 1 | 2 | 3 | 4 }
export const MODULES: DonutSlice[] = [
  { label: 'Incident Management', value: 123, tone: 1 },
  { label: 'Audit & Inspection', value: 123, tone: 2 },
  { label: 'Compliance', value: 123, tone: 3 },
  { label: 'Reporting', value: 123, tone: 4 },
]
export const ROLES: DonutSlice[] = [
  { label: 'Safety Officers', value: 123, tone: 1 },
  { label: 'Site Managers', value: 123, tone: 2 },
  { label: 'Compliance Heads', value: 123, tone: 3 },
  { label: 'Executives', value: 123, tone: 4 },
]
/** The donuts' drawn arcs (degrees clockwise from 12 o'clock): four slices with 2-3° gaps, traced from the image. */
export const DONUT_ARCS: [number, number][] = [[0, 126], [128, 231], [232.5, 317], [319, 358.5]]

export const HEALTH = { score: 32, label: 'AT RISK' }
export const HEALTH_TILES: { label: string; value: string; suffix?: string; trend: Trend }[] = [
  { label: 'ARR', value: '$285K', trend: yoy('up') },
  { label: 'NRR', value: '32%', trend: yoy('up') },
  { label: 'ADOPTION RATE', value: '44%', trend: { dir: 'down', value: '12', label: 'YoY vs LY' } },
  { label: 'SEAT UTILISATION', value: '61%', trend: yoy('down') },
  { label: 'NPS', value: '-12', trend: yoy('up') },
  { label: 'CSAT', value: '3.1', suffix: '/5', trend: yoy('up') },
]
const POINTS = [
  'Automation workflows reducing manual processes by 65% in financial operations',
  'API Manager successfully integrated with all critical banking systems',
]
export const GOING_GOOD = POINTS
export const GOING_BAD = POINTS

export const NPS = {
  total: '1200',
  trend: yoy('up'),
  groups: [
    { label: 'Promoters (9-10)', value: 700, tone: 1 as const },
    { label: 'Passives (7-8)', value: 300, tone: 2 as const },
    { label: 'Detractors (0-6)', value: 200, tone: 3 as const },
  ],
}

export const SUPPORT_SCORES = [
  { label: 'CSAT', value: '32', of: '/100', icon: 'star' as const, trend: yoy('up') },
  { label: 'CES', value: '37', of: '/100', icon: 'user' as const, trend: yoy('up') },
]

export type TicketCategory = { name: string; volume: string; share: number; pct: string; bar: number; tone: 'amber' | 'red' | 'green'; resolution: string }
export const TICKET_CATEGORIES: TicketCategory[] = [
  { name: 'Billing/Invoicing', volume: '47 Tickets', share: 60, pct: '60%', bar: 0.67, tone: 'amber', resolution: '30 Days' },
  { name: 'Integration Issues', volume: '41 Tickets', share: 20, pct: '20%', bar: 0.22, tone: 'red', resolution: '7 Days' },
  { name: 'User Access/Permissions', volume: '29 Tickets', share: 90, pct: '90%', bar: 1, tone: 'green', resolution: '10 Days' },
  { name: 'Data Sync Errors', volume: '58 Tickets', share: 60, pct: '60%', bar: 0.67, tone: 'amber', resolution: '21 Days' },
  { name: 'Feature Requests', volume: '36 Tickets', share: 90, pct: '90%', bar: 1, tone: 'green', resolution: '5 Days' },
]
export const TICKET_PAGER = { showing: 'Showing 21-40 of 2000 rows', page: '02', of: 'of 100' }

export type Ticket = { id: string; title: string; priority: 'High' | 'Low' | 'Medium'; priorityLabel: string; status: string; category: string; opened: string; owner: string; impact: string; next: string }
const TICKET = {
  id: 'TKT-2901', title: 'Billing discrepancy - Invoice overcharge $12K', status: 'In-Progress', category: 'Billing/Invoicing',
  opened: '15 Nov 20026', owner: 'Olivya Rhyle • Finance Support', impact: 'Blocking renewal discussion. Mentioned in NPS detractor survey.',
  next: '"Draft Multi-year Renewal Proposal"',
}
export const TICKETS: Ticket[] = [
  { ...TICKET, priority: 'High', priorityLabel: 'High Priority' },
  { ...TICKET, priority: 'Low', priorityLabel: 'Low Priority' },
  { ...TICKET, priority: 'Medium', priorityLabel: 'Medium Priorty' },
]
