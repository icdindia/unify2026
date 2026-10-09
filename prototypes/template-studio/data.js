/* data.js — Template Studio corpus, permissions and canned flows.
   Same schema idioms as prototypes/knowledge-agent/data.js (P() helper,
   corpus stat blocks, precedent counts) so the same citation-card / cot /
   inline-artifact-card atoms render the artefacts. What differs is what
   the agent is producing: a contract TEMPLATE — a scaffold of sections
   and clauses, each pinned to a canonical position, each editable.

   The three entry journeys are keyed on FLOW.kind:
     create   — user asks the agent to draft a new template from scratch
     attach   — user drops a counter-party document via the + icon;
                the agent extracts, dedupes, and produces a template from it
     edit     — user picks an existing template from the library grid and
                asks for a specific change (e.g. tighten the licence clause) */

const P = (t, x, a, l) => ({ t, x, a, l });

/* ==================================================================
   TEMPLATE LIBRARY — existing templates that already live in the
   playbook. Rendered on the landing page as a card grid. Clicking a
   card opens the edit journey.
   ================================================================== */
const TEMPLATES = [
  { id: 'msa',      name: 'Master Services Agreement',
    fam: 'MSA', kind: 'Commercial', v: 'v4.2',
    owner: 'Contracts — Alicia D.', updated: '11 Sep 2026',
    clauses: 34, negotiated: 27,
    desc: 'The signature commercial paper. Used for every commercial software subscription and every CaaS-adjacent deal above $250K ACV.' },
  { id: 'caas',     name: 'Charging-as-a-Service Agreement',
    fam: 'CaaS', kind: 'Commercial', v: 'v2.7',
    owner: 'Contracts — Ravi S.', updated: '02 Sep 2026',
    clauses: 41, negotiated: 33,
    desc: 'Bundled hardware, installation, cloud and O&M. Bakes in the priced convenience buyout every fleet deal keeps landing on.' },
  { id: 'sitehost', name: 'Site Host Agreement',
    fam: 'Site host', kind: 'Commercial', v: 'v3.1',
    owner: 'Contracts — Alicia D.', updated: '28 Aug 2026',
    clauses: 22, negotiated: 18,
    desc: 'Multifamily, retail, hospitality, parking operators, CRE. Carries the flat-licence / net-revenue-share fork and the ROFR exhibit.' },
  { id: 'public',   name: 'Public-Sector Rider',
    fam: 'Public', kind: 'Public sector', v: 'v1.9',
    owner: 'Associate GC — Priya R.', updated: '19 Aug 2026',
    clauses: 26, negotiated: 21,
    desc: 'Federal, state and municipal awards. Non-appropriation, prevailing wage, Buy America and the split-by-segment data-ownership language.' },
  { id: 'dpa',      name: 'Data Processing Agreement',
    fam: 'DPA', kind: 'Privacy', v: 'v3.0',
    owner: 'Privacy Counsel — Meera T.', updated: '05 Sep 2026',
    clauses: 18, negotiated: 12,
    desc: 'EEA and UK GDPR rider. Sub-processor notice, cross-border transfer mechanics and the objection-to-termination escalation ladder.' },
  { id: 'nda',      name: 'Mutual NDA',
    fam: 'NDA', kind: 'Pre-sales', v: 'v5.0',
    owner: 'Contracts — Ravi S.', updated: '22 Aug 2026',
    clauses: 11, negotiated: 4,
    desc: 'The pre-sales opener. Three-year term, mutual, carve-out for aggregated benchmarking data and the residual-knowledge clause.' }
];

/* ==================================================================
   Recent templates — three most-recently touched templates surfaced on
   the landing page as a simple list (not a card grid). Each row opens
   into the edit journey against the mapped intent.
   ================================================================== */
const RECENT_TEMPLATES = [
  { id: 'msa-2025-na',  name: 'CP MSA 2025 — North America',
    meta: 'Updated 3 days ago · 18 clauses · Market standard',
    intent: 'msa:licence' },
  { id: 'mnda-2025',    name: 'CP Mutual NDA 2025',
    meta: 'Updated 1 week ago · 9 clauses · Tightened',
    intent: 'msa:licence' },
  { id: 'site-2025',    name: 'CP Site Host Licence 2025',
    meta: 'Updated 2 weeks ago · 14 clauses · Tightened',
    intent: 'msa:renewal' }
];

/* ==================================================================
   Landing quick-start tiles.
   =================================================================
   Each tile is either:
     - a canned free-form question that resolves through matchFlow()
     - the sentinel '__attach__' which starts the attach journey
     - the sentinel '__edit:<id>__' which opens the edit journey against
       one of the templates in TEMPLATES
   The set is deliberately weighted so the three journeys are one click
   away — create · attach · edit — as the user asked. */
const QUICK_START = [
  { emoji: '📄', title: 'Create a new template',
    desc: 'Draft an MSA, CaaS, Site Host, DPA or NDA from the playbook baseline',
    q: 'Create a new template' },
  { emoji: '📎', title: 'Extract from a document',
    desc: 'Upload a counter-party template · I will build ours around it',
    q: '__attach__' },
  { emoji: '✂️', title: 'Tighten the licence clause',
    desc: "Edit the MSA — tighten §5 Software Licence against last quarter's asks",
    q: '__edit:msa:licence__' },
  { emoji: '🔁', title: 'Refresh auto-renewal',
    desc: 'Edit the MSA — CPI + 3% cap, 60-day notice, three named exceptions',
    q: '__edit:msa:renewal__' },
  { emoji: '⚖️', title: 'Adjust liability cap',
    desc: 'Edit the CaaS template — move to 2× fees for ACV > $2M with a Security-Incident sub-cap',
    q: '__edit:caas:liability__' },
  { emoji: '📚', title: 'Open the template library',
    desc: 'Browse all six standing templates · edit any of them in place',
    q: '__library__' }
];

/* ==================================================================
   INTERVIEW — the CREATE journey. Same shape as playbook-studio's
   question-card driven interview: a short ladder of typed questions,
   each with 3-5 options plus an optional free-text row.
   ================================================================== */
const CREATE_QUESTIONS = [
  { id: 'family', q: 'Which contract family is this template for?',
    ev: 'The family sets the section list, the standard clauses and the approvers on each rung.',
    opts: [
      { v: 'msa',      b: 'MSA / SaaS Agreement',                   s: 'Software + cloud services' },
      { v: 'caas',     b: 'Charging-as-a-Service',                  s: 'Bundled hardware, install, cloud, O&M' },
      { v: 'sitehost', b: 'Site Host Licence',                      s: 'Multifamily, retail, CRE, parking operator' },
      { v: 'public',   b: 'Public Sector Rider',                    s: 'Federal, state, municipal awards' },
      { v: 'msca',     b: 'Master Service Consulting Agreement',    s: 'Statement-of-work-driven professional services' },
      { v: 'reseller', b: 'Reseller / Channel Agreement',           s: 'Named partners with territory + product exhibits' },
      { v: 'dpa',      b: 'Data Processing Addendum',               s: 'GDPR, CCPA, SCCs, data residency' },
      { v: 'vendor',   b: 'Vendor / Subcontract',                   s: 'Installer, contractor, scope of work' }
    ], free: 'Or describe a custom agreement type' },
  { id: 'posture', q: 'How should I set the clause language posture?',
    ev: 'This controls whether fallback positions are drafted to protect ChargePoint first, or to mirror market-standard language that counterparties are less likely to redline.',
    opts: [
      { v: 'tighten', b: 'Tighten for ChargePoint', s: 'Protective drafting — scopes limitations narrowly, favours ChargePoint on ambiguity' },
      { v: 'market',  b: 'Keep market standard',    s: 'Balanced drafting — mirrors common market positions, reduces counterparty friction' }
    ] },
];

/* ==================================================================
   SharePoint — Legal › Contracts folder shown by the file-picker modal
   when the user picks SharePoint as the drive source in the CREATE
   flow. Exact list drawn from the mock the user pinned on 16 Sep 2026.
   ================================================================== */
const SP_FILES = [
  { name: 'CP_MSA_2025_NA_v3.docx',                 meta: '18 §§ · California law · SaaS+HW · ChargePoint · Jan 2025', tag: 'MSA · Template' },
  { name: 'CP_Mutual_NDA_2025_NA.docx',             meta: '9 §§ · California law · mutual · ChargePoint · Feb 2025',   tag: 'NDA · Baseline' },
  { name: 'CP_SiteHost_Licence_2025.docx',          meta: '14 §§ · revenue share · ChargePoint · Mar 2025',            tag: 'Site Host · Template' },
  { name: 'v1_Elite_Semiconductor_MNDA_Draft.docx', meta: '9 §§ · Singapore law · ESMT · Jul 2025',                    tag: 'MNDA · Draft', tagWarn: true },
  { name: 'ACME_Corp_MSA_Counterparty.docx',        meta: '22 §§ · Delaware law · ACME Corp · Aug 2025',               tag: 'MSA · Counterparty' }
];

/* Human name for a family value — used in the artifact title. */
const FAMILY_NAME = {
  msa:      'MSA / SaaS Agreement',
  caas:     'Charging-as-a-Service',
  sitehost: 'Site Host Licence',
  public:   'Public Sector Rider',
  msca:     'Master Service Consulting Agreement',
  reseller: 'Reseller / Channel Agreement',
  dpa:      'Data Processing Addendum',
  vendor:   'Vendor / Subcontract'
};

/* ==================================================================
   ATTACH — the counter-party document extract journey.
   The uploaded file is fake but the extracted clauses are structured
   so the artifact can plot them side by side against CP baseline.
   ================================================================== */
const ATTACH_DOC = {
  name: 'PowerFleet — proposed CaaS agreement.docx',
  size: '312 KB',
  from: 'Attached from OneDrive · 16 Sep 2026',
  words: 12842,
  clauses: 46,
  who: 'PowerFleet Logistics — legal@powerfleet.com',
  extracted: [
    { id: 'x-cap',    section: '§12 Limitation of Liability',
      cp: '12 months of fees, mutual, standard carve-outs.',
      cpt: 'CP Template',
      party: 'Uncapped direct damages against ChargePoint; cap remains on customer at 12 months fees.',
      partyRisk: 'critical',
      recommend: 'Redline back to mutual cap. If pushed, offer 2× fees plus $2M sub-cap for Security Incidents.' },
    { id: 'x-data',   section: '§9 Data Rights',
      cp: 'CP owns Service Data; customer receives perpetual licence to site data.',
      cpt: 'CP Template',
      party: 'Customer owns all Service Data including aggregated network signals; CP granted a limited licence for operating the customer sites only.',
      partyRisk: 'critical',
      recommend: 'Split-by-segment — customer owns raw records for its sites, CP keeps de-identified aggregate rights excluding resale.' },
    { id: 'x-uptime', section: '§6 Service Levels',
      cp: '97% per port, credits sole remedy.',
      cpt: 'CP Template',
      party: '99% site-wide, liquidated damages of $5K per incident outside the cap.',
      partyRisk: 'elevated',
      recommend: 'Hold 97% per-port measurement. Offer 98% site-wide with credits at 10% of monthly, but LDs must stay inside the cap.' },
    { id: 'x-renew',  section: '§14 Term and Renewal',
      cp: 'Five-year initial term, auto-renewing one year, CPI + 3% uplift, 60-day notice.',
      cpt: 'CP Template',
      party: 'Three-year initial term, no auto-renewal, all renewals via mutual amendment.',
      partyRisk: 'elevated',
      recommend: 'Offer three-year initial + 90-day renewal window at expiring rate + CPI (Deal Desk approval).' },
    { id: 'x-tfc',    section: '§15 Termination for Convenience',
      cp: 'No convenience termination in initial term (commercial).',
      cpt: 'CP Template',
      party: 'Convenience termination on 60 days at any time, no unamortised recovery.',
      partyRisk: 'critical',
      recommend: 'Redline to the CaaS priced-buyout schedule — unamortised cost plus 25% of remaining fees.' },
    { id: 'x-firm',   section: '§7 Warranty · §5 Software Licence',
      cp: 'Not in template — support commitment for 5 years from End-of-Sale.',
      cpt: 'Not in template',
      party: '10-year firmware and security support with source-code escrow.',
      partyRisk: 'critical',
      recommend: 'Accept 7-year support with security-only in years 6-7. Refuse source-code escrow — VP Product red line.' },
    { id: 'x-subp',   section: '§18 Sub-processors',
      cp: '30-day notice of additions; objection on reasonable data-protection grounds.',
      cpt: 'CP Template',
      party: 'Prior written consent required for every new sub-processor; failure to obtain is a material breach.',
      partyRisk: 'elevated',
      recommend: 'Extend to 45-day notice, escalation to termination-of-service-only, not full-agreement breach.' },
    { id: 'x-audit',  section: '§16 Audit',
      cp: 'Annual audit with 30 days notice; costs on requesting party.',
      cpt: 'CP Template',
      party: 'Semi-annual audit, cost-shift on any finding, unlimited scope.',
      partyRisk: 'elevated',
      recommend: 'Cap at annual, scope limited to services in this agreement, cost-shift only for material finding.' }
  ]
};

/* ==================================================================
   EDIT — the targeted amend journey.
   Each intent points at a template + a specific clause, and carries a
   before / after body and a short ladder change description.
   ================================================================== */
const EDIT_INTENTS = {
  'msa:licence': {
    tid: 'msa', clauseId: 'msa-licence',
    ask: 'Tighten the licence clause on the MSA',
    lead: "Last three MSAs came back with a broader-than-intended licence read. I want the operative sentence to bind to the Subscription Term and to the customer's own Affiliates only.",
    section: '§5 Software Licence',
    scope: 'MSA v4.2 · 22 executed agreements carry this clause',
    before: 'Subject to this Agreement, ChargePoint grants Customer a non-exclusive, non-transferable licence to access and use the Services for its business operations during the Subscription Term.',
    after:  'Subject to this Agreement, ChargePoint grants Customer a non-exclusive, non-transferable, non-sublicensable licence to access and use the Services solely for Customer\'s and its wholly-owned Affiliates\' internal business operations during the Subscription Term. All rights not expressly granted are reserved. Divested Affiliates cease to be licensees on the divestiture effective date.',
    diff: [
      ['Add',    '"non-sublicensable"'],
      ['Add',    '"and its wholly-owned Affiliates" · scope of the grant'],
      ['Add',    '"internal" · use, so onward provision to third parties is excluded'],
      ['Add',    'reservation-of-rights sentence'],
      ['Add',    'divested-Affiliate clean-up · closes the executed-2024 loophole']
    ],
    ladderChanges: [
      { tier: 'CP Template',    change: 'Narrows to internal use, wholly-owned Affiliates, non-sublicensable — replaces the current lines above.' },
      { tier: 'Also acceptable', change: 'Extend Affiliates to include majority-owned entities on notice.' },
      { tier: 'Fallback 1',     change: 'Sub-licence rights to a single named MSP for onboarding only, ceasing at Subscription Term end.' },
      { tier: 'Red line',       change: 'Sub-licence to third parties for onward provision. Do not concede.' }
    ],
    impact: {
      contracts: '22 MSAs in flight — 3 executed in the last quarter; new work only.',
      approvers: 'GC review · Contracts sign-off',
      testSet: 'Applied against 4 recent redlines; would have closed 3 of 4 loopholes without new work.'
    }
  },
  'msa:renewal': {
    tid: 'msa', clauseId: 'msa-renewal',
    ask: 'Refresh the auto-renewal clause on the MSA',
    lead: 'The current clause runs CPI + 3% and a 60-day notice window, and it still gets fought over CPI-U vs CPI-W. Land it, and name the three carve-outs where auto-renewal does not apply.',
    section: '§14 Term and Renewal',
    scope: 'MSA v4.2 · used verbatim across CaaS §14 and Public-Sector Rider §14',
    before: 'This Agreement shall automatically renew for successive one-year Renewal Terms unless either party gives written notice of non-renewal at least sixty (60) days prior to the end of the then-current Term. Fees for each Renewal Term shall increase by CPI + 3%.',
    after:  'This Agreement shall automatically renew for successive one-year Renewal Terms unless either party gives written notice of non-renewal at least sixty (60) days prior to the end of the then-current Term. Fees for each Renewal Term shall increase by the lesser of (a) CPI-U (All Urban Consumers, U.S. City Average, most recent available prior period) plus three percent (3%) or (b) seven percent (7%). This Section 14 does not apply to (i) Orders governed by a Public-Sector Rider, (ii) EEA-based Customers whose renewal follows the DPA, and (iii) Orders explicitly marked "No Auto-Renewal" on the Order Form.',
    diff: [
      ['Add',    'CPI-U named explicitly · closes the CPI-W dispute path'],
      ['Add',    'Uplift cap · 7% ceiling regardless of CPI'],
      ['Add',    'Exception (i) — public sector · appropriations rule'],
      ['Add',    'Exception (ii) — EEA · DPA-linked renewal'],
      ['Add',    'Exception (iii) — Order-Form opt-out for named accounts']
    ],
    ladderChanges: [
      { tier: 'CP Template',    change: 'CPI-U + 3% capped at 7%, with three named exceptions. Same 60-day notice.' },
      { tier: 'Also acceptable', change: 'Three-year initial, auto-renewal retained, uplift capped at 5%.' },
      { tier: 'Fallback 1',     change: 'No auto-renewal, 90-day renewal window at expiring rate plus CPI. Deal Desk approval only.' },
      { tier: 'Red line',       change: 'Perpetual pricing with no uplift, or a unilateral right to reduce ports mid-term. CFO only.' }
    ],
    impact: {
      contracts: '42 agreements with a renewal mechanic · 6 renewals due in Q4 2026.',
      approvers: 'CFO review · Deal Desk sign-off',
      testSet: 'Applied against the Kaiser Permanente redline; would have closed the CPI-W argument.'
    }
  },
  'caas:liability': {
    tid: 'caas', clauseId: 'caas-liability',
    ask: 'Adjust the liability cap on the CaaS template',
    lead: 'Move the standing ladder to give Contracts room on high-ACV deals without escalating every time. 2× fees above $2M ACV with a Security Incident sub-cap becomes the new Standard on the CaaS template only.',
    section: '§12 Limitation of Liability',
    scope: 'CaaS v2.7 · 8 executed CaaS agreements',
    before: "Each party's total aggregate liability shall not exceed the fees paid or payable by Customer under this Agreement in the twelve (12) months preceding the event giving rise to the claim.",
    after:  "Each party's total aggregate liability shall not exceed the fees paid or payable by Customer under this Agreement in the twelve (12) months preceding the event giving rise to the claim. Notwithstanding the foregoing, for Customers whose Annual Subscription Fee exceeds two million dollars ($2,000,000), each party's aggregate liability shall be capped at two (2) times the trailing twelve-month fees. Liability arising from a Security Incident shall be subject to a separate cap of the greater of $2,000,000 or two (2) times the Annual Subscription Fee.",
    diff: [
      ['Add',    '2× fees ceiling · triggered at $2M ACV, replaces case-by-case approvals'],
      ['Add',    'Separate Security Incident sub-cap · $2M or 2× ASF, whichever is greater'],
      ['Keep',   'Standard 1× 12-month floor · retained for deals below $2M ACV']
    ],
    ladderChanges: [
      { tier: 'CP Template',    change: '1× 12-month fees for < $2M ACV, 2× for ≥ $2M ACV, separate Security Incident sub-cap.' },
      { tier: 'Also acceptable', change: 'Confidentiality moved outside the cap, separate cap at 3× ASF.' },
      { tier: 'Fallback 1',     change: 'Stated-dollar cap at signature — never below 1× annual fees.' },
      { tier: 'Red line',       change: 'Uncapped direct damages, or an asymmetric cap. Do not concede — GC + CFO only.' }
    ],
    impact: {
      contracts: '8 CaaS agreements — Acme Fleet MSA, Kaiser Permanente renewal both benefit.',
      approvers: 'GC + CFO co-sign',
      testSet: 'Applied against Acme Fleet Round 2 redline; would have closed on the first pass instead of the third.'
    }
  }
};

/* ==================================================================
   TEMPLATE SCAFFOLD — the artefact produced by the CREATE and ATTACH
   journeys. Section list drives the artifact panel doc.
   ================================================================== */
/* Each section carries TWO operative-language variants — `bodyMarket` is the
   softer market-standard drafting; `bodyTighten` is the CP-protective drafting.
   The renderer picks one based on S.answers.posture. `tightenable=true` means
   the section actually differs between the two postures; other sections use
   the market body verbatim in both. */
const TEMPLATE_SCAFFOLD = {
  msa: {
    id: 'msa', name: 'MSA / SaaS Agreement',
    v: 'v1.0',
    corpus: { docs: 22, clauses: 78, parties: 20, label: 'executed MSAs carrying this shape' },
    sections: [
      { key: 'definitions', n: '1',  name: 'Definitions', tightenable: false,
        bodyMarket:  'In this Agreement, "Confidential Information" means any non-public information disclosed by either party that is marked confidential or that a reasonable person would treat as confidential.',
        bodyTighten: 'In this Agreement, "Confidential Information" means all non-public information disclosed by either party, whether or not marked as such, that relates to technical, financial, or commercial matters of the disclosing party.' },
      { key: 'licence',     n: '2',  name: 'Licence Grant', tightenable: true,
        bodyMarket:  'ChargePoint grants Customer a limited, non-exclusive, non-transferable right to access and use the Services during the Term solely for Customer\'s internal business operations.',
        bodyTighten: 'ChargePoint grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right to access and use the Services during the Term solely for Customer\'s internal business operations at the Sites identified in the Order Form.' },
      { key: 'services',    n: '3',  name: 'Services', tightenable: false,
        bodyMarket:  'ChargePoint shall provide the Services listed on the Order Form during the Subscription Term, subject to the terms of this Agreement.',
        bodyTighten: 'ChargePoint shall provide the Services listed on the Order Form during the Subscription Term, subject to the terms of this Agreement. ChargePoint reserves the right to modify the Services at any time on prior written notice to Customer.' },
      { key: 'fees',        n: '4',  name: 'Fees and Payment', tightenable: false,
        bodyMarket:  'Customer shall pay the fees set out on the Order Form net thirty (30) days from invoice date. Late payments accrue interest at the lesser of 1.5% per month or the maximum permitted by law.',
        bodyTighten: 'Customer shall pay the fees set out on the Order Form net thirty (30) days from invoice date. Late payments accrue interest at the lesser of 1.5% per month or the maximum permitted by law. Any dispute must be raised in writing within fifteen (15) days of invoice or is deemed waived.' },
      { key: 'term',        n: '5',  name: 'Term and Renewal', tightenable: true,
        bodyMarket:  'This Agreement runs for the Initial Term stated on the Order Form and shall renew for successive one-year Renewal Terms unless either party gives sixty (60) days\' written notice of non-renewal.',
        bodyTighten: 'This Agreement shall automatically renew for successive one-year Renewal Terms unless either party gives written notice of non-renewal at least sixty (60) days prior to the end of the then-current Term. Fees shall increase by the lesser of CPI-U plus three percent (3%) or seven percent (7%). This Section does not apply to (i) Public-Sector Orders, (ii) EEA Customers whose renewal follows the DPA, and (iii) Orders explicitly marked "No Auto-Renewal" on the Order Form.' },
      { key: 'liability',   n: '6',  name: 'Limitation of Liability', tightenable: true,
        bodyMarket:  'Neither party\'s aggregate liability shall exceed the fees paid or payable in the twelve months preceding the claim.',
        bodyTighten: 'Neither party\'s aggregate liability shall exceed the fees paid in the twelve (12) months preceding the event giving rise to the claim. Liability arising from a Security Incident or breach of confidentiality is subject to a separate sub-cap of three (3) times the Annual Subscription Fee.' },
      { key: 'sla',         n: '7',  name: 'Service Levels', tightenable: true,
        bodyMarket:  'ChargePoint targets 99% monthly uptime, calculated across the Services in aggregate. Service Credits are the sole remedy for a missed month.',
        bodyTighten: '97% monthly uptime measured per port, excluding customer-caused, utility and network outages. Service Credits are Customer\'s sole and exclusive remedy for failure to meet the Uptime Commitment and are capped at ten percent (10%) of the monthly subscription fee.' },
      { key: 'warranty',    n: '8',  name: 'Warranties', tightenable: false,
        bodyMarket:  'Each party warrants that it has the corporate power and authority to enter into this Agreement. Services are provided "as is" except as expressly set out herein.',
        bodyTighten: 'Each party warrants that it has the corporate power and authority to enter into this Agreement. All other warranties are expressly disclaimed to the maximum extent permitted by law.' },
      { key: 'indem',       n: '9',  name: 'Indemnification', tightenable: false,
        bodyMarket:  'Each party shall indemnify the other from and against third-party claims arising from its breach of this Agreement, subject to the limitations set out in Section 6.',
        bodyTighten: 'Each party shall indemnify, defend and hold harmless the other from and against any third-party claims arising from its breach of this Agreement, subject to the Limitation of Liability set out in Section 6. Customer additionally indemnifies ChargePoint against claims arising from Customer\'s use of the Services outside the scope of the Licence Grant.' },
      { key: 'confid',      n: '10', name: 'Confidentiality', tightenable: false,
        bodyMarket:  'Each party agrees to protect the other\'s Confidential Information using the same degree of care it uses for its own confidential information of a like kind, but in no event less than a reasonable degree of care.',
        bodyTighten: 'Each party agrees to protect the other\'s Confidential Information using the same degree of care it uses for its own confidential information of a like kind, but in no event less than a reasonable degree of care. The confidentiality obligation survives termination for a period of five (5) years. Confidential Information relating to trade secrets remains protected in perpetuity.' },
      { key: 'data',        n: '11', name: 'Data Protection', tightenable: true,
        bodyMarket:  'Each party shall comply with applicable data protection laws in the performance of this Agreement. Customer retains rights in its Customer Data, subject to the licence granted to ChargePoint to provide the Services.',
        bodyTighten: 'ChargePoint owns all Service Data. Customer is granted a perpetual, non-exclusive, royalty-free licence to access, export and use Session Data generated at Customer Sites for any lawful purpose. ChargePoint retains the right to use de-identified data for benchmarking, network operations and product improvement, and shall not sell or licence such data to third parties.' },
      { key: 'general',     n: '12', name: 'Governing Law', tightenable: false,
        bodyMarket:  'This Agreement shall be governed by the laws of the State of California, without regard to conflict-of-law principles.',
        bodyTighten: 'This Agreement shall be governed by the laws of the State of California. The parties consent to the exclusive jurisdiction of the state and federal courts located in Santa Clara County, California.' }
    ]
  }
};

/* ==================================================================
   Permissions & sources. Two source families:
     drive     — SharePoint / OneDrive (for the executed corpus)
     upload    — direct upload from the composer + icon
   ================================================================== */
const PERMS = {
  drive: {
    name: 'Where should I learn the standard positions from?',
    scope: 'Read-only · so I can inherit the standard ladder from what ChargePoint has actually signed.',
    choices: [
      { id: 'sharepoint', label: 'SharePoint', sub: 'Legal — Contracts › Executed', meta: '84 files · 3 weeks ago', icon: 'sharepoint' },
      { id: 'onedrive',   label: 'OneDrive',   sub: 'Contracts › Executed',            meta: '84 files · synced',       icon: 'onedrive' }
    ],
    what: [
      'Executed MSAs, CaaS, site host, channel, public awards, NDAs and DPAs',
      'Clause text, exhibits and Order Forms',
      'Amendment and renewal history so I can see how the ladder actually settles'
    ],
    never: 'Only the folder you pick. No other sites, no other libraries, nothing written back.',
    icon: 'archive',
    label: 'SharePoint — Legal / Contracts'
  },
  upload: {
    name: 'Attach the counter-party document',
    scope: 'One document · so I can read, extract, and place each clause against our baseline.',
    what: [
      'The single .docx or .pdf you drag in — nothing else on your drive',
      'Metadata: filename, size, and where you dragged it from',
      'The extracted clause text, held in memory for this session only'
    ],
    never: 'Not stored on the server, not indexed, not shared. Cleared when you leave.',
    icon: 'clip',
    label: 'Direct upload'
  }
};

const ICON = {
  archive: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="3" width="12" height="3" rx="1"/><path d="M3 6.5v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6"/><path d="M6.5 9h3"/></svg>',
  tick: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 6.3 4.8 8.6 9.5 3.6"/></svg>',
  sharepoint: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="5" height="5" rx="1"/><rect x="9" y="2.5" width="5" height="5" rx="1"/><rect x="2" y="8.5" width="5" height="5" rx="1"/><rect x="9" y="8.5" width="5" height="5" rx="1"/></svg>',
  onedrive: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4.6 12.5h6.9a2.4 2.4 0 0 0 .3-4.8 3.4 3.4 0 0 0-6.4-1.3A2.8 2.8 0 0 0 4.6 12.5Z"/></svg>',
  clip: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10.5 5.2 6 9.7a1.6 1.6 0 0 0 2.3 2.3l4.8-4.8a3 3 0 0 0-4.2-4.2L3.8 8a4.4 4.4 0 0 0 6.2 6.2"/></svg>',
  docx: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 2h5.5L13 5.5V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M9.5 2v3.5H13"/><path d="M5.5 9h5M5.5 11h5"/></svg>'
};

/* ==================================================================
   State.
   ================================================================== */
const S = {
  stage: 'start',            /* start | asking | interview | learn | draft | edit | attached */
  flow: null,                /* {kind:'create'|'attach'|'edit', ...} */
  perms: {},
  src: 'sharepoint',
  thread: [],
  connected: { drive: false, upload: false },
  learnStarted: false,
  learnStep: 0,
  cotOpen: {},
  canvasClosed: false, canvasMax: false,
  open: {},
  answers: {},               /* interview answers keyed by question id */
  qi: 0,                     /* interview question index */
  sheet: false,
  renderedTurns: 0,
  _autoNavCollapsed: false,
  selSection: null,          /* selected section in the draft artifact */
  history: [
    ['Liability cap — MSA precedent',      '2d'],
    ['Prevailing wage — Transit East',     '3d'],
    ['Auto-renewal — Kaiser Permanente',   '1w'],
    ['NEVI OCPP 2.1 read-out',             '2w']
  ]
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const templateById = id => TEMPLATES.find(t => t.id === id);
const srcName = () => S.src === 'onedrive' ? 'OneDrive' : 'SharePoint';
