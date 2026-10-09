/* data.js — Knowledge Agent corpus, permissions and canned asks.
   Same schema idioms as prototypes/playbook-studio/data.js (P() helper,
   corpus stat blocks, precedent counts) so the same citation-card / cot /
   inline-artifact-card atoms render the answers. What differs is what the
   agent is answering: (1) open tickets, (2) ChargePoint's take on a
   specific clause, (3) ChargePoint's take on a concept. */

const P = (t, x, a, l) => ({ t, x, a, l });

/* ==================================================================
   Ask taxonomy.
   =================================================================
   Each ASK entry is one canned starting question with:
     kind    — tickets | clause | concept
     q       — user question text
     hint    — one-line rationale surfaced on the landing card
     src     — where the agent needs to read from to answer
     tag     — pill label on the landing card
   The answer surfaces (steps / findings / artifact) are generated
   from the payload keyed by each entry's id.                        */
const ASKS = [
  { id: 'tickets-open',        kind: 'tickets',  q: 'Show me my open contract review tickets',
    hint: 'All open tickets across MSA, CaaS and site host reviews, ordered by hearing / signature date.',
    src: 'jira', tag: 'Tickets' },
  { id: 'tickets-mine',        kind: 'tickets',  q: 'What is on my desk this week?',
    hint: 'Filters CLM to the current user’s active reviews and the ones I have been asked to look at.',
    src: 'jira', tag: 'Tickets' },

  { id: 'clause-liability-cap', kind: 'clause',  q: 'What is ChargePoint’s take on the liability cap clause?',
    hint: 'Every executed MSA and CaaS agreement — where the cap landed, what carve-outs travel with it.',
    src: 'sharepoint', tag: 'Clause' },
  { id: 'clause-data-ownership', kind: 'clause', q: 'What is our take on ownership of session data?',
    hint: 'The split between the driver app (controller) and site data (processor) — and where public sector broke it.',
    src: 'sharepoint', tag: 'Clause' },
  { id: 'clause-uptime',       kind: 'clause',  q: 'What is ChargePoint’s position on the station uptime commitment?',
    hint: 'Per-port measurement, service-credit cap, the termination right customers keep asking for.',
    src: 'sharepoint', tag: 'Clause' },
  { id: 'clause-firmware-sunset', kind: 'clause', q: 'What is our take on firmware sunset and end-of-life support?',
    hint: 'Five to seven years of support against an eight-year financing term — an issue not in our template.',
    src: 'sharepoint', tag: 'Clause' },

  { id: 'concept-autorenewal', kind: 'concept', q: 'What auto-renewal terms do we accept?',
    hint: 'Uplift ceilings, notice windows and the two places auto-renewal breaks with public buyers.',
    src: 'sharepoint', tag: 'Concept' },
  { id: 'concept-termination-convenience', kind: 'concept', q: 'How does ChargePoint handle termination for convenience?',
    hint: 'The four flavours we accept — commercial, public non-appropriation, CaaS depot, channel partner.',
    src: 'sharepoint', tag: 'Concept' },
  { id: 'concept-revenue-share', kind: 'concept', q: 'What revenue-share structures do we agree to at site host deals?',
    hint: 'Flat licence vs net revenue share — and why we never agree share of gross.',
    src: 'sharepoint', tag: 'Concept' }
];

const ASK_GROUPS = [
  { id: 'tickets',  title: 'My open tickets',
    lead: 'Ticketing surfaced from Jira Service Management — Contract Legal (CLM).',
    ids: ['tickets-open', 'tickets-mine'] },
  { id: 'clause',   title: 'ChargePoint’s take on a clause',
    lead: 'A specific paragraph of paper. Pulls the position ladder, precedent count, and the red line.',
    ids: ['clause-liability-cap', 'clause-data-ownership', 'clause-uptime', 'clause-firmware-sunset'] },
  { id: 'concept',  title: 'A general negotiation concept',
    lead: 'A term or structure that crosses contract types — auto-renewal, TFC, revenue share.',
    ids: ['concept-autorenewal', 'concept-termination-convenience', 'concept-revenue-share'] }
];

/* ==================================================================
   TICKETS — an open queue Jira would return.
   ================================================================== */
/* Ticket schema matched to the reference artifact:
     id / deal / status / due are the four columns rendered in the inline
     Open-tickets table; the remaining fields (title, body, plays, etc.)
     surface only when a ticket is opened in its own detail view. */
const TICKETS = [
  { id: 'TKT-1042', deal: 'Apex Energy MSA',    status: 'Needs legal input', due: 'Today',
    title: 'Redline — §12 liability cap · Apex Energy MSA',
    who: 'Alicia D. (Contracts Manager)', ct: 'MSA', stage: 'Round 2 · returned by counterparty',
    overdue: false, risk: 'critical',
    counterparty: 'Apex Energy Storage', value: '$2.4M ARR',
    body: 'Counterparty struck the 12-month fees cap and returned an uncapped direct-damages clause. Deal Desk approved 2× fees but only with the data-breach sub-cap.',
    plays: [
      P('CP Template', 'Aggregate cap at 12 months of fees, with the usual IP indemnity and confidentiality carve-outs.', 'Standard'),
      P('Recommended for this deal', '2× trailing 12 months of fees given ACV > $2M, with a separate $2M sub-cap for Security Incidents.', 'Contracts Manager'),
      P('Red line', 'Uncapped direct damages, or a cap that binds ChargePoint but not the customer.', 'GC + CFO')
    ] },
  { id: 'TKT-1038', deal: 'Oakfield Site Host', status: 'Needs legal input', due: 'Today',
    title: 'Termination clause conflict · Oakfield site host',
    who: 'You', ct: 'Site host', stage: 'Awaiting your redline',
    overdue: false, risk: 'critical',
    counterparty: 'Oakfield Properties', value: '$740K ACV · 8 sites',
    body: 'Oakfield wants a right to terminate on 90 days for any reason with no unamortised recovery. Playbook red-lines this; recommend counter with the priced-buyout schedule.',
    plays: [
      P('CP Template', 'No termination for convenience during the initial term; cause-only termination.', 'Standard'),
      P('Also acceptable', 'Convenience after year 2 on 90 days’ notice with all unamortised hardware and installation cost payable.', 'Contracts Manager'),
      P('Red line', 'Convenience termination with no recovery of hardware or installation cost.', 'CFO')
    ] },
  { id: 'TKT-1031', deal: 'SolarGrid CaaS',     status: 'Needs legal input', due: 'Tomorrow',
    title: 'Data ownership push · SolarGrid CaaS award',
    who: 'Ravi S. (Associate GC)', ct: 'CaaS', stage: 'Contract Manager escalated',
    overdue: false, risk: 'critical',
    counterparty: 'SolarGrid Depot Partners', value: '$1.2M award',
    body: 'SolarGrid wants ownership of raw session data. Precedent supports the split-by-segment position — public sector owns; commercial holds template.',
    plays: [
      P('CP Template', 'ChargePoint owns all Service Data; customer keeps a perpetual licence to its own site data.', 'Standard'),
      P('Also acceptable', 'Customer owns raw records for its own sites; ChargePoint retains aggregated, de-identified rights.', 'Contracts Manager'),
      P('Fallback for public sector', 'Customer owns raw records; ChargePoint’s aggregate rights limited to benchmarking and product improvement, excluding resale.', 'Associate GC')
    ] },
  { id: 'TKT-1027', deal: 'ACME Corp MSA',      status: 'With counterparty', due: 'Fri',
    title: 'OCPP 2.1 warranty ask · ACME Corp MSA',
    who: 'You', ct: 'MSA', stage: 'New',
    overdue: false, risk: 'elevated',
    counterparty: 'ACME Corporation', value: '$4.8M award · 42 stations',
    body: 'ACME is asking for a warranty on a protocol version that has not been released. Standard is to warrant current certified models; add a portability commitment on request.',
    plays: [
      P('CP Template', 'Warrant OCPP 2.0.1 certification for models listed on the Order Form; portability handled through documented export.', 'Standard'),
      P('Also acceptable', 'Publish the migration procedure and provide data export in a documented format on request.', 'Contracts Manager'),
      P('Red line', 'Contractual commitment to support an unreleased protocol version, or free migration engineering.', 'VP Product')
    ] },
  { id: 'TKT-1019', deal: 'Metro Transit',      status: 'With counterparty', due: 'Next Mon',
    title: 'Prevailing wage recalc · Metro Transit contract',
    who: 'Alicia D. (Contracts Manager)', ct: 'Public sector', stage: 'Change order in review',
    overdue: false, risk: 'elevated',
    counterparty: 'Metro Transit Authority', value: '$2.1M installation scope',
    body: 'DOL updated the wage determination between bid and NTP. Change order landed at +$78K; contract has a change-order right at wage determination changes.',
    plays: [
      P('CP Template', 'Pricing based on the wage determination in effect on Proposal Date; changes treated as Change Order.', 'Standard'),
      P('Also acceptable', 'ChargePoint carries certified payroll reporting for its subcontractors at no fee.', 'Contracts Manager'),
      P('Red line', 'Fixed price with no change-order right for a post-bid wage determination.', 'CFO')
    ] },
  { id: 'TKT-1015', deal: 'Apex Energy MSA',    status: 'Your response',    due: 'Tomorrow',
    title: 'Auto-renewal uplift ask · Apex Energy renewal',
    who: 'Deal Desk', ct: 'MSA', stage: 'Draft returned',
    overdue: false, risk: 'elevated',
    counterparty: 'Apex Energy Storage', value: '$1.8M ARR renewal',
    body: 'Customer wants no auto-renewal — every renewal a fresh negotiation. Playbook fallback is 90-day renewal window at expiring rate plus CPI.',
    plays: [
      P('CP Template', 'Auto-renewing in one-year periods with 60 days’ notice to stop and uplift capped at CPI + 3%.', 'Standard'),
      P('Also acceptable', 'Three-year initial term with auto-renewal retained; uplift capped at 5%.', 'Contracts Manager'),
      P('Fallback 1', 'No auto-renewal, 90-day renewal window at expiring rate plus CPI.', 'Deal Desk')
    ] },
  { id: 'TKT-1009', deal: 'Oakfield Site Host', status: 'Your response',    due: 'Fri',
    title: 'Sub-processor objection · Oakfield EU sites',
    who: 'Privacy Counsel', ct: 'DPA', stage: 'Consultation',
    overdue: false, risk: 'standard',
    counterparty: 'Oakfield Properties EU', value: 'DPA rider',
    body: 'Oakfield objected to a new EEA sub-processor on data-protection grounds. Playbook allows objection escalates to termination of the affected service with pro-rata refund.',
    plays: [
      P('CP Template', '30 days’ notice of Sub-processor additions; objection on reasonable data protection grounds.', 'Standard'),
      P('Also acceptable', 'Notice extended to 45 days, retention unchanged.', 'Privacy Counsel'),
      P('Fallback 1', 'Objection escalates to termination of the affected service with pro-rata refund.', 'Privacy Counsel + Associate GC')
    ] }
];

/* ==================================================================
   CLAUSES — one entry per canned clause ask.
   ================================================================== */
const CLAUSES = {
  'liability-cap': {
    id: 'liability-cap', name: 'Limitation of Liability (LOL-01)',
    ct: 'MSA · CaaS · Public sector', section: '§12 Limitation of Liability',
    corpus: { docs: 27, clauses: 74, parties: 24, label: 'executed agreements carrying a cap' },
    /* Lead + ladder + citations + chips all matched to the reference artifact,
       so a click on "What is CP's position on liability cap?" renders the same
       card the user shared. */
    lead: 'Here is ChargePoint’s standard ladder for <strong>Limitation of Liability (LOL-01)</strong> — from the CP template position through approved fallbacks to the red line.',
    why: 'The cap is the single number that decides how much of a bad deployment ChargePoint absorbs. Customers anchor on uncapped direct damages; the playbook has to give negotiators a defensible ladder rather than a case-by-case argument.',
    cl: ['MSA §12 · CaaS §12 · Public rider §12', 'MSA §11 Indemnification', 'MSA §14 Insurance', 'Order Form'],
    settled: [
      ['Standard (12-month fees cap)', '19 of 27'],
      ['2× fees above $2M ACV', '5 of 27'],
      ['Uncapped for one carve-out only', '3 of 27']
    ],
    ladder: [
      P('CP Template',      'Neither party’s aggregate liability shall exceed the fees paid in the twelve (12) months preceding the claim.',                                           'Standard — no approval required'),
      P('Also acceptable',  'Cap at 12 months of fees; confidentiality and data-breach carve-outs move outside to a sub-cap of 3× annual fees.',                                       'Contracts Manager'),
      P('Fallback 1',       'Cap at 18 months of fees with carve-outs for IP infringement and data breach, each sub-capped at 2× annual fees.',                                        'GC + CFO'),
      P('Red line',         'Uncapped liability, or a cap below 6 months of fees without carve-outs.',                                                                                  'Do not concede')
    ],
    citations: [
      { icon: 'sharepoint', label: 'ChargePoint Playbook – Limitation of Liability (LOL-01)' },
      { icon: 'sharepoint', label: 'Legal wiki – Approved positions' }
    ] },

  'data-ownership': {
    id: 'data-ownership', name: 'Ownership of charging session and driver data',
    ct: 'MSA · CaaS · DPA · Public sector', section: '§9 Data Rights',
    corpus: { docs: 33, clauses: 96, parties: 29, label: 'executed agreements touching data rights' },
    why: 'Session data trains utilisation forecasting, feeds the driver app and underwrites the Cloud Plan roadmap. Giving it away once sets a precedent every enterprise customer will cite.',
    cl: ['MSA §9 Data Rights', 'MSA §8 Intellectual Property', 'MSA §10 Confidentiality', 'DPA §3 Processing Details'],
    settled: [
      ['Standard (template — CP owns; customer perpetual licence)', '24 of 33'],
      ['Customer owns raw site data', '7 of 33 — 4 federal, 3 large commercial'],
      ['Aggregate rights narrowed to benchmarking only', '2 of 33']
    ],
    ladder: [
      P('CP Template', 'ChargePoint owns all Service Data; the customer receives a perpetual, royalty-free licence to use data from its own stations for any lawful purpose.', 'Standard — no approval', 'Customer is granted a perpetual, non-exclusive, royalty-free licence to access, export and use Session Data generated at Customer Sites.'),
      P('Also acceptable', 'Customer owns raw session records for its own sites; ChargePoint retains aggregated and de-identified data with no re-identification.', 'Contracts Manager'),
      P('Fallback 1', 'Customer owns raw records and ChargePoint’s aggregate rights are limited to benchmarking and product improvement, expressly excluding resale.', 'Associate GC', 'ChargePoint may use De-identified Data solely for benchmarking, network operations and product improvement, and shall not sell or licence such data to third parties.'),
      P('Fallback 2', 'Customer owns raw records and ChargePoint’s use narrows to operating that customer’s own sites — benchmarking rights dropped, offered again as an opt-in at renewal.', 'GC + VP Product', 'ChargePoint shall use Customer Data solely to provide and support the Services at Customer Sites.'),
      P('Red line', 'Any restriction on ChargePoint using de-identified data to operate or improve the network.', 'Do not concede — GC + VP Product')
    ] },

  'uptime': {
    id: 'uptime', name: 'Station uptime commitment and service credits',
    ct: 'MSA · CaaS · Utility programmes', section: '§6 Service Levels',
    corpus: { docs: 22, clauses: 51, parties: 20, label: 'executed agreements with an uptime commitment' },
    why: 'Uptime is the number procurement scores on, and increasingly the number a public funder audits. The exposure is not the credit itself but the termination right customers try to attach to it.',
    cl: ['MSA §6 Service Levels', 'CaaS Exhibit D Service Credits', 'Assure Exhibit B', '§12 Limitation of Liability', '§15 Termination'],
    settled: [
      ['Standard (97% per-port, credits sole remedy)', '15 of 22'],
      ['98% with credits capped at 10% of monthly fee', '5 of 22'],
      ['Termination right on 3 consecutive misses at a site', '2 of 22']
    ],
    ladder: [
      P('CP Template', '97% monthly uptime measured per port, excluding customer-caused, utility and network outages; credits are the sole remedy.', 'Standard — no approval', 'Uptime shall be calculated per port per calendar month, excluding Excused Downtime. Service Credits are Customer’s sole and exclusive remedy for failure to meet the Uptime Commitment.'),
      P('Also acceptable', '98% with the same exclusions; credits capped at 10% of the monthly subscription fee.', 'Contracts Manager'),
      P('Fallback 1', '98% with a termination right for the affected sites only, triggered by three consecutive months below target.', 'Associate GC', 'If ChargePoint fails to meet the Uptime Commitment for three (3) consecutive months at a Site, Customer may terminate this Agreement with respect to that Site without penalty.'),
      P('Red line', 'Uptime measured site-wide rather than per port, or liquidated damages sitting outside the liability cap.', 'Do not concede — GC')
    ] },

  'firmware-sunset': {
    id: 'firmware-sunset', name: 'Firmware sunset and station end-of-life support',
    ct: 'MSA · CaaS · Public sector', section: '§5 Software Licence · §7 Warranty',
    corpus: { docs: 14, clauses: 34, parties: 12, label: 'executed agreements that address end-of-life' },
    why: 'Not in the CP template. Customers financing eight-year assets want a written commitment that the station will still be supported in year seven. Appears in four of our executed MSAs already.',
    cl: ['MSA §5 Software Licence', 'MSA §7 Warranty', 'CaaS §5 Milestones'],
    settled: [
      ['Five years of support from End-of-Sale', '9 of 14'],
      ['Seven years, last two are security-only', '3 of 14'],
      ['Seven years plus trade-in credit against replacement', '2 of 14']
    ],
    ladder: [
      P('CP Template', 'ChargePoint supports each hardware model for five years from the model’s end-of-sale date, with 12 months’ notice before support ends.', 'Standard — no approval', 'ChargePoint shall provide firmware and security updates for each Station model for five (5) years following its End-of-Sale Date, on twelve (12) months’ prior written notice of sunset.'),
      P('Also acceptable', 'Seven years of support, with security-only updates in the final two years.', 'Contracts Manager'),
      P('Fallback 1', 'Seven years plus a trade-in credit against replacement hardware if support ends before the financing term.', 'VP Product', 'If support for a Station model ends before the end of the Subscription Term, Customer shall receive a credit equal to the unamortised value of the affected Stations against replacement hardware.'),
      P('Red line', 'Perpetual support obligations, or source-code escrow for station firmware.', 'Do not concede — GC + VP Product')
    ] }
};

/* ==================================================================
   CONCEPTS — cross-cutting terms/structures. Each carries a
   contract-type breakdown (where the position varies) and a top-line
   position statement.
   ================================================================== */
const CONCEPTS = {
  'autorenewal': {
    id: 'autorenewal', name: 'Auto-renewal and price uplift',
    corpus: { docs: 42, clauses: 88, parties: 37, label: 'agreements with a renewal mechanic' },
    lead: 'Auto-renewal stays in the template, but there are three named exceptions where the playbook drops it — all of them are places precedent already broke.',
    why: 'Renewal mechanics decide whether Cloud Plan revenue is predictable. Customers increasingly strike auto-renewal outright, which converts every renewal into a fresh negotiation.',
    breakdown: [
      { seg: 'MSA / commercial',   pos: 'Auto-renewal retained · uplift CPI + 3%', ct: '18 of 22 held it' },
      { seg: 'CaaS / fleet',       pos: 'Auto-renewal retained · uplift CPI + 3%', ct: 'All 6 held it' },
      { seg: 'Public sector',      pos: 'No auto-renewal; annual funding-out',     ct: 'Cannot bind future appropriations' },
      { seg: 'Site host / REIT',   pos: 'Auto-renewal accepted; uplift capped 5%', ct: '17 of 22 held it' },
      { seg: 'DPA / EU customers', pos: 'Renews with the underlying agreement',    ct: 'Follows the parent contract' }
    ],
    ladder: [
      P('CP Template', 'Five-year initial term, auto-renewing in one-year periods with 60 days’ notice to stop and uplift capped at CPI + 3%.', 'Standard — no approval', 'Fees for each Renewal Term shall increase by the lesser of (a) CPI-U plus three percent (3%) or (b) seven percent (7%).'),
      P('Also acceptable', 'Three-year initial term, auto-renewal retained, uplift capped at 5%.', 'Contracts Manager'),
      P('Fallback 1', 'No auto-renewal, but a 90-day renewal window with pricing held at the expiring rate plus CPI.', 'Deal Desk'),
      P('Red line', 'Perpetual pricing with no uplift, or a unilateral right to reduce subscribed ports mid-term.', 'Do not concede — CFO')
    ] },
  'termination-convenience': {
    id: 'termination-convenience', name: 'Termination for convenience',
    corpus: { docs: 51, clauses: 63, parties: 44, label: 'executed agreements addressing TFC' },
    lead: 'Standard playbook rejects convenience termination in the initial term — with four narrowly drawn exceptions. Two of them, public sector and channel, are non-negotiable in practice.',
    why: 'Where hardware is bundled into the subscription, an unpriced convenience termination writes off equipment ChargePoint has already shipped and installed.',
    breakdown: [
      { seg: 'MSA / commercial',   pos: 'No TFC in initial term; cause-only termination',              ct: '17 of 22 held; 5 conceded convenience after year 2' },
      { seg: 'CaaS / fleet',       pos: 'TFC any time on 120 days’ notice + early-termination fee', ct: 'Fee = unamortised cost + 25% of remaining fees' },
      { seg: 'Public sector',      pos: 'Non-appropriation on 60 days’ notice; costs incurred payable', ct: 'Federal-style, standard, not worth fighting' },
      { seg: 'Channel partner',    pos: 'Either party for cause; convenience only with 180 days’ notice', ct: 'Territory reverts on convenience termination' }
    ],
    ladder: [
      P('CP Template', 'No termination for convenience during the initial term; termination for uncured material breach only.', 'Standard — no approval', 'Either party may terminate for material breach not cured within thirty (30) (payment: ten (10)) days of written notice.'),
      P('Also acceptable', 'Convenience termination after year two on 90 days’ notice, with all unamortised hardware and installation cost payable.', 'Contracts Manager'),
      P('Fallback 1', 'Convenience termination any time on 120 days’ notice with an early termination fee equal to unamortised cost plus 25% of remaining subscription fees.', 'Deal Desk', 'Customer shall pay an Early Termination Fee equal to the unamortised cost of Stations and installation plus twenty-five percent (25%) of the subscription fees remaining in the then-current Term.'),
      P('Red line', 'Convenience termination with no recovery of hardware or installation cost.', 'Do not concede — CFO')
    ] },
  'revenue-share': {
    id: 'revenue-share', name: 'Revenue share and site host economics',
    corpus: { docs: 22, clauses: 41, parties: 19, label: 'executed site host agreements' },
    lead: 'Flat licence fee stays the opening ask everywhere. Net revenue share is the working compromise for retail; share of gross is never accepted — no exceptions in the corpus.',
    why: 'The split decides whether a site pays back in four years or eleven. Hosts anchor on a percentage of gross; gross includes the energy ChargePoint already paid for.',
    breakdown: [
      { seg: 'Multifamily',             pos: 'Flat licence fee per port + 3% escalator',            ct: '8 of 9 held it' },
      { seg: 'Retail & hospitality',    pos: 'Net revenue share — after energy, processing, network fees', ct: '7 of 9 landed here' },
      { seg: 'Parking operators',       pos: 'Net revenue share with a guaranteed annual minimum',  ct: 'Minimum payable to the host, not to CP' },
      { seg: 'Commercial real estate',  pos: 'Flat licence with ROFR on additional stations',       ct: 'ROFR replaces exclusivity when hosts push back' }
    ],
    ladder: [
      P('CP Template', 'Flat annual licence fee per port, fixed for the term with a stated escalator.', 'Standard — no approval', 'Customer shall pay a Licence Fee per Port per annum, escalating by three percent (3%) on each anniversary.'),
      P('Also acceptable', 'Revenue share on net revenue after energy, payment processing and network fees.', 'Contracts Manager'),
      P('Fallback 1', 'Revenue share on net revenue with a guaranteed annual minimum payable to the host.', 'Deal Desk', 'Host shall receive the greater of the Revenue Share or the Annual Minimum set out in Exhibit B.'),
      P('Red line', 'A share of gross revenue, or any share calculated before energy cost.', 'Do not concede — CFO')
    ] }
};

/* ==================================================================
   Sources & permissions.
   Two source families:
     jira        — Jira Service Management (CLM project)
     sharepoint  — SharePoint · Legal — Contracts · Executed
   ================================================================== */
const PERMS = {
  jira: {
    name: 'Connect to Jira — CLM project',
    scope: 'Read-only · so I can list the tickets on your desk and their reviewers',
    what: [
      'Open tickets in CLM — Contract Legal',
      'Reporter, assignee, status, priority, due date',
      'Linked contract documents and the counterparty on the deal',
      'Comments on tickets you are watching'
    ],
    never: 'Only the CLM project and only the tickets you can already see. Nothing written back.',
    icon: 'jira',
    label: 'Jira Service Management — CLM'
  },
  sharepoint: {
    name: 'Connect a document source',
    scope: 'Read-only · so I can learn from what ChargePoint has actually signed, not just from a generic library',
    choices: [
      { id: 'sharepoint', label: 'SharePoint', sub: 'Legal — Contracts › Executed', meta: '84 files · 3 weeks ago', icon: 'sharepoint' },
      { id: 'onedrive',   label: 'OneDrive',   sub: 'Contracts › Executed',            meta: '84 files · synced',       icon: 'onedrive' }
    ],
    what: [
      'Executed MSAs, CaaS, site host, channel, public awards, NDAs and DPAs',
      'Clause text, exhibits and Order Forms',
      'Amendment and renewal history'
    ],
    never: 'Only the folder you pick. No other sites, no other libraries, nothing written back.',
    icon: 'archive',
    label: 'SharePoint — Legal / Contracts'
  }
};

const ICON = {
  archive: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="3" width="12" height="3" rx="1"/><path d="M3 6.5v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6"/><path d="M6.5 9h3"/></svg>',
  tick: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 6.3 4.8 8.6 9.5 3.6"/></svg>',
  sharepoint: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="5" height="5" rx="1"/><rect x="9" y="2.5" width="5" height="5" rx="1"/><rect x="2" y="8.5" width="5" height="5" rx="1"/><rect x="9" y="8.5" width="5" height="5" rx="1"/></svg>',
  onedrive: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4.6 12.5h6.9a2.4 2.4 0 0 0 .3-4.8 3.4 3.4 0 0 0-6.4-1.3A2.8 2.8 0 0 0 4.6 12.5Z"/></svg>',
  jira: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 2 3 7l5 5 5-5-5-5Z"/><path d="M8 2v10"/><path d="M3 7h10"/></svg>',
  clip: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10.5 5.2 6 9.7a1.6 1.6 0 0 0 2.3 2.3l4.8-4.8a3 3 0 0 0-4.2-4.2L3.8 8a4.4 4.4 0 0 0 6.2 6.2"/></svg>'
};

/* ==================================================================
   State.
   ================================================================== */
const S = {
  stage: 'start',            /* start | asking | learn | answer */
  ask: null,                 /* ASK entry being answered */
  /* Jira is treated as a shipped integration for the CLM project — the
     Knowledge Agent never asks the user to connect to it. SharePoint stays
     as an opt-in permission because the user chooses between two document
     stores (SharePoint / OneDrive) at the moment they're needed. */
  perms: { jira: 'always' },
  src: 'sharepoint',
  thread: [],
  connected: { jira: true, sharepoint: false },
  learnStarted: false,
  learnStep: 0,
  cotOpen: {},
  canvasClosed: false, canvasMax: false,
  open: {},
  answerTab: 'answer',
  sheet: false,
  renderedTurns: 0,
  _autoNavCollapsed: false,
  history: [
    ['Liability cap — MSA precedent',      '2d'],
    ['Prevailing wage — Transit East',     '3d'],
    ['Auto-renewal — Kaiser Permanente',   '1w'],
    ['NEVI OCPP 2.1 read-out',             '2w']
  ]
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const askById = id => ASKS.find(a => a.id === id);
const groupById = id => ASK_GROUPS.find(g => g.id === id);

/* Which permission is needed to answer a given ask.
   Jira is already connected on load (see S.perms), so tickets asks never
   surface a permission card. SharePoint stays as the on-demand connect
   for clause + concept + analyse asks. */
const permForAsk = a => a.kind === 'tickets' ? 'jira' : 'sharepoint';
const srcName = () => S.src === 'onedrive' ? 'OneDrive' : 'SharePoint';

/* ==================================================================
   Landing quick-start taxonomy.
   ==================================================================
   Six cards on the landing page, each wired to one ask id. Five of them
   answer inline in the chat thread (mode:'inline'); the sixth — Analyse
   a contract — attaches a document and opens the analysis canvas on the
   right (mode:'canvas-analyse').
   ================================================================== */
const QUICK_START = [
  /* Descriptors match the Figma reference (node 10159-387119) verbatim. */
  { emoji: '📋', title: 'Open Tickets',       desc: 'How do I sign up to volunteer for the upcoming event', askId: 'q-tickets' },
  { emoji: '🤝', title: 'Deal Status',        desc: 'What is the status of the Apex Energy deal?',          askId: 'q-deal' },
  { emoji: '⚖️', title: 'Clause Position',    desc: "What is CP's position on liability?",                  askId: 'q-clause' },
  { emoji: '📄', title: 'Analyse a Contract', desc: 'Upload a contract for a detailed review.',             askId: 'q-analyse' },
  { emoji: '🎫', title: 'Open a Ticket',      desc: 'Create a new legal support ticket.',                   askId: 'q-newticket' },
  { emoji: '👥', title: 'Team Performance',   desc: 'How is my team performing on open tickets and SLA?',   askId: 'q-team' }
];

/* `q` mirrors the card descriptor verbatim so the user bubble reads the same
   line the user clicked. Downstream mapping still goes by ask id, not text,
   so wording changes here never affect which inline widget renders. */
const QUICK_ASKS = {
  'q-tickets':   { id: 'q-tickets',   mode: 'inline',         kind: 'tickets',   q: 'How many open tickets do I have this week?' },
  'q-deal':      { id: 'q-deal',      mode: 'inline',         kind: 'deal',      q: 'What is the status of the Apex Energy deal?' },
  'q-clause':    { id: 'q-clause',    mode: 'inline',         kind: 'clause',    q: "What is CP's position on liability?", clauseId: 'liability-cap' },
  'q-analyse':   { id: 'q-analyse',   mode: 'canvas-analyse', kind: 'analyse',   q: 'Upload a contract for a review.' },
  'q-newticket': { id: 'q-newticket', mode: 'inline',         kind: 'newticket', q: 'Create a new legal ticket.' },
  'q-team':      { id: 'q-team',      mode: 'inline',         kind: 'team',      q: 'How is my team performing on open tickets and SLA?' }
};

/* ==================================================================
   DEAL — the active deal used by the "Deal status" inline answer.
   Schema matched to the reference artifact: a lead sentence, a Field /
   Current Status table, and three citation chips.
   ================================================================== */
const DEAL = {
  id: 'DEAL-2094',
  name: 'Apex Energy MSA',
  counterparty: 'Apex Energy Storage, Inc.',
  lead: 'The <strong>Apex Energy MSA</strong> is in active redline — round 3 of negotiation. The counterparty has pushed back on the liability cap and the data clause. Legal last updated the redline 2 days ago.',
  fields: [
    ['Stage',            'Active redline — Round 3'],
    ['Deal value',       '$2.4M ARR'],
    ['Last action',      'Legal sent redline v3 — 2 days ago'],
    ['Open issues',      'Liability cap (LOL-01) · Data use (DAT-01)'],
    ['Counterparty ask', '12-month fee cap · No benchmarking right'],
    ['CP position',      '24-month cap · Benchmarking retained'],
    ['Close estimate',   '2–3 weeks (legal cleared)']
  ],
  citations: [
    { icon: 'salesforce', label: 'Salesforce – Apex Energy opp.' },
    { icon: 'sharepoint', label: 'SharePoint – MSA redline v3.docx' },
    { icon: 'jira',       label: 'Jira – TKT-1042, TKT-1015' }
  ]
};

/* ==================================================================
   TEAM — reviewers and their load, used by the Team performance ask.
   Schema matched to the reference artifact: four KPI tiles, a 6-column
   table (NAME / ROLE / OPEN / AVG SLA / OVERDUE / LATEST TICKET) and two
   citation chips (Jira / Salesforce).
   ================================================================== */
const TEAM = {
  kpi:  { reportees: 5, open: 21, avgSla: '1.9d', overdue: 6 },
  lead: 'James Okafor has the most open tickets (7) and 3 overdue. Priya Nair is tracking best with an average SLA of 0.9 days.',
  members: [
    { name: 'Sarah Chen',    role: 'Sr. Account Exec', open: 4, sla: '1.8d', overdue: 1, latest: 'Apex Energy MNDA' },
    { name: 'James Okafor',  role: 'Account Exec',     open: 7, sla: '2.4d', overdue: 3, latest: 'Oakfield Site Host' },
    { name: 'Priya Nair',    role: 'Sr. Account Exec', open: 2, sla: '0.9d', overdue: 0, latest: 'Metro Transit CaaS' },
    { name: 'Tom Bergström', role: 'Account Exec',     open: 5, sla: '3.1d', overdue: 2, latest: 'ACME Corp MSA' },
    { name: 'Leila Mansour', role: 'Account Exec',     open: 3, sla: '1.2d', overdue: 0, latest: 'SolarGrid CaaS' }
  ],
  citations: [
    { icon: 'jira',       label: 'Jira — Team ticket queue' },
    { icon: 'salesforce', label: 'Salesforce — Deal activity' }
  ]
};

/* ==================================================================
   NEW TICKET — form scaffolding used by the "Open a ticket" ask.
   ================================================================== */
const NEW_TICKET_FIELDS = {
  types:      ['Redline required', 'Contract draft', 'Question', 'Escalation'],
  priorities: ['Critical', 'Elevated', 'Standard'],
  deals:      ['Acme Fleet MSA', 'Prologis site host', 'GSA award — Region 4', 'Ohio DOT — NEVI round 4', 'Kaiser Permanente renewal', 'Bayer AG — EU DPA', 'Not linked to a deal']
};

/* ==================================================================
   ANALYSE_DOC — the sample counterparty doc the analyse flow reads,
   plus the issues and recommendations the canvas renders.
   ================================================================== */
const ANALYSE_DOC = {
  file: 'v1_apex_msa_counterparty_redline.docx',
  meta: '48 pages · 92 clauses · Redline from counterparty · Received 15 Sep 2026',
  party: 'Apex Energy Storage, Inc.',
  ct: 'MSA (fleet / CaaS)',
  overall: { risk: 'High', score: 74, summary: 'Two critical exposures on §12 liability and §9 data; five elevated items across term, warranty and payment.' },
  stats: [
    { label: 'Material issues',        value: 8 },
    { label: 'Critical',                value: 2 },
    { label: 'Elevated',                value: 5 },
    { label: 'Standard',                value: 1 },
    { label: 'Clauses touched',         value: 14 },
    { label: 'Playbook red-line hits',  value: 2 }
  ],
  issues: [
    { id: 'I-01', section: '§12 Liability cap',                risk: 'critical', title: 'Uncapped direct damages',
      body: 'Counterparty struck the 12-month fees cap and returned uncapped direct damages against ChargePoint. This crosses the playbook red-line.',
      recommend: 'Counter with 2× trailing 12-month fees (ACV > $2M) and a separate $2M sub-cap for Security Incidents. Deal Desk already approved this tier.' },
    { id: 'I-02', section: '§9 Data Rights',                   risk: 'critical', title: 'Customer ownership of raw session data',
      body: 'Requests ownership of raw session records for their own sites. Federal precedent supports this only for public buyers; this is a commercial deal.',
      recommend: 'Hold the template position — ChargePoint owns; customer keeps a perpetual, royalty-free licence for its own site data. Escalate if pushed.' },
    { id: 'I-03', section: '§3 Term & Renewal',                risk: 'elevated', title: 'Auto-renewal struck',
      body: 'Counterparty struck the one-year auto-renewal and wants a fresh negotiation every renewal.',
      recommend: 'Fallback 1: no auto-renewal, 90-day renewal window with pricing held at the expiring rate plus CPI.' },
    { id: 'I-04', section: '§7 Warranty & Assure',             risk: 'elevated', title: 'Firmware support extended to 8 years',
      body: 'Counterparty asked for firmware and security updates for 8 years to match the financing term. Playbook standard is 5.',
      recommend: 'Also acceptable: 7 years with security-only updates in the final two years. Route to VP Product.' },
    { id: 'I-05', section: '§4 Fees & Payment',                risk: 'elevated', title: 'Net 90 payment terms',
      body: 'Payment terms extended from Net 30 to Net 90.',
      recommend: 'Fallback: Net 60 with the first year prepaid annually in advance. Route to Deal Desk.' },
    { id: 'I-06', section: '§6 Service Levels',                risk: 'elevated', title: 'Termination right on 3 uptime misses',
      body: 'Uptime commitment now carries a termination right for the affected sites after three consecutive months below target.',
      recommend: 'Playbook Fallback 1 mirrors this at the site level — acceptable if credits stay capped at 10% of the monthly subscription fee.' },
    { id: 'I-07', section: '§11 Indemnification',              risk: 'elevated', title: 'IP indemnity extended to combinations',
      body: 'Counterparty extended the IP infringement indemnity to combinations of the Services with third-party products.',
      recommend: 'Hold: exclude combinations, customer-supplied specifications and unauthorised modifications in writing.' },
    { id: 'I-08', section: '§16 Compliance',                   risk: 'standard', title: 'Audit rights: 3× per year',
      body: 'Audit clause proposes up to three audits per contract year. Playbook standard is once per year on 30 days’ notice.',
      recommend: 'Also acceptable: two audits per year, capped at 3 days each, at customer cost. Route to Contracts Manager.' }
  ]
};
