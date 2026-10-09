/* app.js — Knowledge Agent state, render and flow.
   Every UI decision is inherited from prototypes/playbook-studio:
     - collapsed nav rail (auto on first entry)
     - 760 message column, avatar in the -28 gutter, 12×12 brand-400 chip
     - split mode with 440 chat + artifact panel absolutely positioned,
       sliding in from the right on 520ms ease-in-out
     - turn kinds: user | agent | perm | sourcepick | steps | findings
                   | answer | artifact | stream | artifactPending | qprompt
     - question-card / citation-card / cot atoms all reused
   Only the domain content and the answer canvas differ. */

(function () {
'use strict';

const I = ICONS;
const TAG = (c, n, node) => `data-component="${c}" data-figma-name="${n}" data-figma-file="main" data-figma-node="${node}"`;
const btn = (cls, inner, attrs = '') => `<button class="btn ${cls}" type="button" ${attrs}>${inner}</button>`;
const label = t => `<span class="btn__label">${t}</span>`;
const pill = (cls, t) => `<span class="pill ${cls}">${t}</span>`;
const setHTML = (el, html) => { if (el && el.__html !== html) { el.innerHTML = html; el.__html = html; } };
const keepScroll = (sel, fn) => { const before = [...document.querySelectorAll(sel)].map(e => e.scrollTop); fn(); [...document.querySelectorAll(sel)].forEach((e, i) => { if (before[i] != null) e.scrollTop = before[i]; }); };

/* ============================== tooltip ============================== */
const $tip = (() => { const el = document.createElement('div'); el.className = 'tip'; el.setAttribute('data-on', 'false'); el.innerHTML = '<span class="tip__text"></span><i class="tip__arrow" aria-hidden="true"></i>'; document.body.appendChild(el); return el; })();
let tipFor = null;
function showTip(el) {
  const txt = el.getAttribute('data-tip'); if (!txt) return;
  tipFor = el; $tip.firstChild.textContent = txt; $tip.setAttribute('data-on', 'false'); $tip.style.left = '0px'; $tip.style.top = '0px';
  const r = el.getBoundingClientRect(), t = $tip.getBoundingClientRect();
  let side = 'top', top = r.top - t.height - 8;
  if (top < 8) { side = 'bottom'; top = r.bottom + 8; }
  let left = r.left + r.width / 2 - t.width / 2;
  const max = window.innerWidth - t.width - 8;
  if (left < 8) left = 8; if (left > max) left = Math.max(8, max);
  const ax = Math.min(Math.max(r.left + r.width / 2 - left, 12), Math.max(12, t.width - 20));
  $tip.lastChild.style.left = (ax - 4) + 'px';
  $tip.setAttribute('data-side', side);
  $tip.style.left = Math.round(left) + 'px'; $tip.style.top = Math.round(top) + 'px';
  $tip.setAttribute('data-on', 'true');
}
function hideTip() { tipFor = null; $tip.setAttribute('data-on', 'false'); }
document.addEventListener('pointerover', e => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el !== tipFor) { el ? showTip(el) : hideTip(); } });
document.addEventListener('pointerdown', hideTip);
document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest('[data-tip]'); el ? showTip(el) : hideTip(); });
window.addEventListener('scroll', hideTip, true);

/* ============================== shell ============================== */
const $view = document.getElementById('view');
const $stage = document.getElementById('stage');
const $panelHost = document.getElementById('artifactPanel');
const $rail = document.getElementById('rail');

function render() {
  renderRail();
  if (S.stage !== 'start' && !S._autoNavCollapsed) {
    $rail.setAttribute('data-state', 'collapsed');
    const rt = document.getElementById('railToggle');
    if (rt) rt.setAttribute('aria-label', 'Expand sidebar');
    S._autoNavCollapsed = true;
  }
  const open = S.stage === 'answer' && !S.canvasClosed;
  $stage.setAttribute('data-artifact', open ? 'open' : 'closed');
  $stage.setAttribute('data-expanded', (open && S.canvasMax) ? 'true' : 'false');
  if (!open || S.canvasMax) $stage.style.gridTemplateColumns = '';
  keepScroll('.canvas__body, .ans__scroll', () => {
    setHTML($panelHost, open ? renderCanvas() : '');
    if (open) { renderAnswer(document.getElementById('canvasDoc')); bindCanvas(); }
  });
  renderView();
  renderSheet();
}

/* ============================== rail ============================== */
const TEMPLATES_NAV_ICON = '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16634 2.16172V4.64004C9.16634 4.97607 9.16634 5.14409 9.22992 5.27244C9.28585 5.38533 9.37509 5.47712 9.48485 5.53465C9.60963 5.60004 9.77298 5.60004 10.0997 5.60004H12.5092M9.16634 11H5.66634M10.333 8.6H5.66634M12.6663 6.79294V11.12C12.6663 12.1281 12.6663 12.6321 12.4756 13.0172C12.3078 13.3559 12.0401 13.6312 11.7108 13.8038C11.3365 14 10.8464 14 9.86634 14H6.13301C5.15292 14 4.66287 14 4.28852 13.8038C3.95924 13.6312 3.69152 13.3559 3.52375 13.0172C3.33301 12.6321 3.33301 12.1281 3.33301 11.12V4.88C3.33301 3.87191 3.33301 3.36786 3.52375 2.98282C3.69152 2.64413 3.95924 2.36876 4.28852 2.19619C4.66287 2 5.15292 2 6.13301 2H8.00654C8.43458 2 8.64859 2 8.85 2.04973C9.02856 2.09383 9.19926 2.16656 9.35584 2.26525C9.53244 2.37656 9.68378 2.53222 9.98644 2.84353L11.8462 4.75647C12.1489 5.06778 12.3002 5.22344 12.4085 5.40509C12.5044 5.56614 12.5751 5.74172 12.618 5.92538C12.6663 6.13254 12.6663 6.35267 12.6663 6.79294Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NAV_ICON = { new: I['nav-plus'], projects: I['nav-folder'], routines: I['nav-clock'], meetings: I['nav-calendar'], artifacts: I['nav-cube-02'], playbooks: I['book'], templates: TEMPLATES_NAV_ICON };
function renderRail() {
  setHTML(document.getElementById('brandMark'), '<img src="./assets/unify-logo.svg" alt="" class="brand-mark-img">');
  setHTML(document.getElementById('brandWord'), '<span style="font-family: var(--font-family-display); font-size: 24px; line-height: 32px; font-weight: 500; letter-spacing: -0.005em; color: currentColor; white-space: nowrap;">LegalAI</span>');
  setHTML(document.getElementById('railSearch'), I['search-md-18']);
  setHTML(document.getElementById('railToggle'), I['layout-left']);
  setHTML(document.getElementById('agentsChev'), I['chevron-down-sm']);
  setHTML(document.getElementById('histChev'), I['chevron-down-sm']);
  setHTML(document.getElementById('userChev'), I['chevron-up-sm']);

  const item = (id, lbl, ic, extra = '', current = false) =>
    `<button class="main-nav__x-item ${extra}" type="button" data-nav="${id}" aria-current="${current ? 'page' : 'false'}"
       ${TAG('main-nav', 'Nav_menu/Main', 'I1731:251990;419:152019')}>
       <span class="main-nav__x-icon-text">${NAV_ICON[ic]}<span class="main-nav__x-label">${lbl}</span></span></button>`;
  setHTML(document.getElementById('navPrimary'),
    item('new', 'New Session', 'new') +
    item('playbooks', 'Playbooks', 'playbooks') +
    item('templates', 'Template Studio', 'templates') +
    `<span class="main-nav__x-divider" role="separator" data-figma-node="I1731:251990;419:152025"></span>`);

  const AGENTS = [
    ['Knowledge Agent',        true],
    ['Contract Review Agent',  false],
    ['Clause Extraction Agent', false],
    ['Redline Compare Agent',  false]
  ];
  setHTML(document.getElementById('navAgents'), AGENTS.map(([n, cur], ix) =>
    `<button class="main-nav__x-item main-nav__x-item--agent" type="button" aria-current="${cur ? 'page' : 'false'}"
       ${TAG('main-nav', 'Nav_menu/Agent', 'I1731:251990;419:15175' + (ix + 1))}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-agent-avatar main-nav__x-agent-avatar--${ix + 1}">${I['ai-avatar']}</span><span class="main-nav__x-label">${esc(n)}</span></span></button>`).join(''));

  const hist = [];
  if (S.ask) hist.push([S.ask.q.length > 34 ? S.ask.q.slice(0, 32) + '…' : S.ask.q, 'now']);
  S.history.forEach(h => hist.push(h));
  setHTML(document.getElementById('navHistory'), hist.map(([t, m]) =>
    `<button class="main-nav__x-item main-nav__x-item--history" type="button" ${TAG('main-nav', 'Nav_menu/Chat_history', 'I1731:251990;1412:303303')}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-label">${esc(t)}</span></span><span class="main-nav__x-meta">${m}</span></button>`).join(''));

  /* Primary nav: none of the three is the current page on this artefact
     (aria-current stays "false" for all), so they read as siblings. Clicks
     match the pattern set by prototypes/template-studio:
       - New Session → resetApp() back to the Knowledge Agent landing
       - Playbooks   → open the Playbook Studio artefact
       - Template Studio → open the Template Studio artefact */
  document.querySelectorAll('#navPrimary [data-nav]').forEach(b => b.onclick = () => {
    const n = b.dataset.nav;
    if (n === 'new')       return resetApp();
    if (n === 'playbooks') { location.href = (location.pathname.endsWith('/index.html') ? '../playbook-studio/index.html' : './playbook-studio.html'); return; }
    if (n === 'templates') { location.href = (location.pathname.endsWith('/index.html') ? '../template-studio/index.html' : './template-studio.html'); return; }
  });
}

/* ============================== view ============================== */
function renderView() {
  if (S.stage === 'start') { S.renderedTurns = 0; $view.innerHTML = landingPage(); return bindLanding(); }
  const prev = document.getElementById('threadScroll');
  const prevTop = prev ? prev.scrollTop : null, grew = S.thread.length !== S.renderedTurns;
  const from = S.renderedTurns || 0;
  $view.innerHTML = `
    <div class="chat">
      ${breadcrumb()}
      <div class="chat__scroll" id="threadScroll"><div class="chat__col">${S.thread.map((t, i) => renderTurn(t, i, i >= from)).join('')}</div></div>
      <div class="chat__dock" id="dock"></div>
    </div>`;
  S.renderedTurns = S.thread.length;
  renderDock();
  bindThread();
  const sc = document.getElementById('threadScroll');
  if (sc) sc.scrollTop = (grew || prevTop == null) ? sc.scrollHeight : prevTop;
}

function breadcrumb() {
  const parts = ['ChargePoint Legal', 'Knowledge Agent', S.ask ? shortenAsk(S.ask.q) : 'New session'];
  const crumb = (txt, cur, mid) => `<button class="es-breadcrumb__crumb ${cur ? 'es-breadcrumb__crumb--current' : ''} ${mid ? 'es-breadcrumb__crumb--mid' : ''}" type="button" ${mid ? `data-tip="${esc(txt)}"` : ''}><span class="es-breadcrumb__crumb-text">${esc(txt)}</span>${cur ? I['chevron-down-14'] : ''}</button>`;
  const slash = `<span class="es-breadcrumb__slash">${I['slash-divider-10']}</span>`;
  const items = parts.map((p, i) => crumb(p, i === parts.length - 1, i > 0 && i < parts.length - 1));
  return `<header class="es-breadcrumb" ${TAG('es-breadcrumb', 'ES Breadcrumb', '6190:428283')}>
    <div class="es-breadcrumb__container">
      <div class="es-breadcrumb__content"><div class="es-breadcrumb__selector"><div class="es-breadcrumb__crumbs">
        ${items.join(slash)}
      </div></div></div>
      <div class="es-breadcrumb__right"><div class="es-breadcrumb__actions">
        <span class="chat-cost" data-tip="Estimated cost for this session"><span class="chat-cost__ring" aria-hidden="true"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="6" cy="6" r="4.6" stroke-dasharray="2 1.6" stroke-linecap="round"/></svg></span><span class="chat-cost__amount mono">$1.23</span></span>
        ${btn('btn--sm btn--neutral-tertiary', I['lock-03'] + label('Share'))}
        ${btn('btn--icon-sm btn--neutral-tertiary', I['cube-02'], 'data-tip="Artifacts in this session" aria-label="Artifacts"')}
      </div></div>
    </div></header>`;
}
function shortenAsk(q) { return q.length > 60 ? q.slice(0, 58) + '…' : q; }

/* ============================== landing ============================== */
function searchInput(id, ph, val) {
  return `<div class="search-input" ${TAG('filter-bar', 'Search', '65:37079')}><div class="search-input__field"><div class="search-input__content">${I['search-md']}<input class="search-input__text" id="${id}" type="search" placeholder="${esc(ph)}" value="${esc(val || '')}" aria-label="${esc(ph)}"></div></div></div>`;
}

/* QUICK_START and QUICK_ASKS live in data.js — six landing cards, five
   answer inline and one opens the analyse-a-contract canvas. */

/* Landing card glyphs — bespoke inline SVGs (currentColor stroke) so each
   tile renders in white on the brown square in the reference mock, instead
   of leaking the yellow / blue emoji palette. */
/* Icons supplied by the design team — /prototypes/Icon*.svg — colour is
   baked in to #6A5A32 (matches brand-tertiary-700). */
const QS_ICONS = {
  'q-tickets':   '<img src="./assets/qs-open-tickets.svg" alt="" width="20" height="20">',
  'q-deal':      '<img src="./assets/qs-deal-status.svg" alt="" width="20" height="20">',
  'q-clause':    '<img src="./assets/qs-clause-position.svg" alt="" width="20" height="20">',
  'q-analyse':   '<img src="./assets/qs-analyse.svg" alt="" width="20" height="20">',
  'q-newticket': '<img src="./assets/qs-open-a-ticket.svg" alt="" width="20" height="20">',
  'q-team':      '<img src="./assets/qs-team-performance.svg" alt="" width="20" height="20">'
};

function landingPage() {
  const card = (c, i) => `<button class="qs-card qs-card--v2" type="button" data-qs="${i}">
    <span class="qs-card__glyph" aria-hidden="true">${QS_ICONS[c.askId] || ''}</span>
    <span class="qs-card__text">
      <span class="qs-card__title">${esc(c.title)}</span>
      <span class="qs-card__desc">${esc(c.desc)}</span>
    </span>
  </button>`;
  return `<div class="landing landing--v2 fade"><div class="landing__col landing__col--v2">
    <header class="landing__hero">
      <span class="landing__brand" aria-hidden="true"><img src="./assets/agent-avatar.svg" alt="" width="40" height="40"></span>
      <div class="landing__name-desc">
        <h1 class="landing__title">Knowledge<em>Agent</em></h1>
        <p class="landing__sub">Ask anything about your deals</p>
      </div>
    </header>
    <section class="landing__compose">
      ${composerHTML('Ask Ticket status, negotiation positions, clause standards, deal terms — or upload a contract for instant analysis.', 'home')}
    </section>
    <section class="landing__cards">
      <div class="qs-grid qs-grid--v2">${QUICK_START.map(card).join('')}</div>
    </section>
  </div></div>`;
}

function bindLanding() {
  $view.querySelectorAll('[data-qs]').forEach(b => b.onclick = () => {
    const askId = QUICK_START[+b.dataset.qs].askId;
    beginQuick(askId);
  });
  bindComposer('home');
}

/* ============================== turns ============================== */
const cotRow = (key) => `<div class="cot__row"><span class="cot__avatar">${I['ai-avatar']}</span><button class="cot__thoughts" type="button" data-cot="${key}" aria-expanded="${S.cotOpen[key] === false ? 'false' : 'true'}">Thoughts${I['chevron-right-sm-14']}</button></div>`;
const cotStep = (icon, lbl, opts = {}) => `<div class="cot__step ${opts.rich ? 'cot__step--rich' : ''} ${opts.done ? 'cot__step--done' : ''}">
    <div class="cot__step-row"><span class="cot__step-icon">${I[icon]}</span><span class="cot__step-label">${esc(lbl)}</span></div>
    ${opts.results ? `<div class="cot__results"><span class="cot__rule"></span><span class="cot__result-box">${opts.results.map(r => `<button class="cot__link" type="button">${esc(r)}</button>`).join('')}</span></div>` : ''}
    ${opts.dash ? '<span class="cot__step-dash"></span>' : ''}
  </div>`;
const cot = (key, stepsHtml, withRow = true) => `<div class="cot" ${TAG('cot', 'COT', '905:301480')}>${withRow ? cotRow(key) : ''}<div class="cot__steps" ${S.cotOpen[key] === false ? 'hidden' : ''}>${stepsHtml}</div></div>`;
const rich = (...ps) => `<div class="richtext">${ps.map(p => '<p>' + p + '</p>').join('')}</div>`;
const cards = (...cs) => `<div class="turn__cards">${cs.filter(Boolean).join('')}</div>`;
const citationCard = (title, rows) => `<div class="citation-card" ${TAG('citation-card', 'Copilot_Inline Citation Card', '905:301558')}>
    <div class="citation-card__top">${esc(title)}</div>
    <div class="citation-card__body">${rows.map(([q, a]) => `<div class="citation-card__row"><span class="citation-card__q">${q}</span><span class="citation-card__a">${a}</span></div>`).join('<span class="citation-card__rule"></span>')}</div></div>`;
const listItem = (icon, title, sub, status) => `<div class="list-item" ${TAG('list-item', 'List Item', '905:302681')}>
    <div class="list-item__content"><span class="list-item__icon">${icon}</span><span class="list-item__text"><span class="list-item__title">${esc(title)}</span><span class="list-item__sub">${esc(sub)}</span></span></div>
    ${pill('pill--status-success', esc(status))}</div>`;
const AVATAR = `<span class="turn__avatar" aria-hidden="true">${I['ai-avatar']}</span>`;

function renderTurn(t, ix, isNew) {
  const fade = isNew ? 'fade' : '';
  if (t.k === 'user') return `<div class="turn turn--user ${fade}"><div class="bubble"><span>${esc(t.text)}</span></div></div>`;
  if (t.k === 'agent') return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}</div>`;
  if (t.k === 'perm') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(renderPerm(t.id))}</div>`;
  if (t.k === 'sourcepick') return `<div class="turn turn--agent ${fade}" data-k="sourcepick">${AVATAR}${rich(t.lead)}${cards(renderSourcePick(t.perm))}</div>`;
  if (t.k === 'steps') return `<div class="turn turn--agent ${fade}">${renderSteps()}</div>`;
  if (t.k === 'findings') return `<div class="turn turn--agent ${fade}">${renderFindings()}</div>`;
  if (t.k === 'answer') return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}${cards(artifactCard())}</div>`;
  if (t.k === 'artifactPending') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(pendingArtifactCard())}</div>`;
  if (t.k === 'stream') {
    const caret = t.done ? '' : '<span class="stream-caret" aria-hidden="true"></span>';
    return `<div class="turn turn--agent ${fade}">${AVATAR}<div class="richtext"><p>${t.shown || ''}${caret}</p></div></div>`;
  }
  /* Inline answers — the five Quick-start prompts that answer in the chat
     thread with a compact card + a strip of follow-up chip suggestions. The
     agent's identity is carried by the 12×12 avatar chip hanging in the
     -28px gutter (same treatment as Template Studio), not a text label. */
  if (t.k === 'inline') {
    const chips = (INLINE_CHIPS[t.body] || []).map(c => `<button type="button" class="inl-chip" data-chip="${esc(c)}">${esc(c)}</button>`).join('');
    return `<div class="turn turn--agent turn--inline ${fade}">${AVATAR}${t.lead ? rich(t.lead) : ''}${cards(inlineBody(t))}${chips ? `<div class="inl-chips">${chips}</div>` : ''}</div>`;
  }
  /* "Thinking…" placeholder — a larger olive-brown agent tile plus the
     label, matched to Enterprise Brain Base 2026 5691:485523. Replaced in
     place once the answer body is ready. */
  if (t.k === 'thinking') return `<div class="turn turn--agent turn--thinking ${fade}"><span class="thinking-avatar" aria-hidden="true">${I['ai-avatar']}</span><span class="thinking-label">Thinking…</span></div>`;
  /* Analyse flow — attach prompt, uploaded card, thinking dots and finally
     the artifact card that opens the canvas. */
  if (t.k === 'attachprompt') return `<div class="turn turn--agent ${fade}" data-k="attachprompt">${AVATAR}${rich(t.lead)}${cards(attachCard())}</div>`;
  if (t.k === 'attached')     return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(attachedRow(t.file, t.meta))}${t.commentary ? rich(t.commentary) : ''}</div>`;
  if (t.k === 'analyseSteps') return `<div class="turn turn--agent ${fade}">${renderAnalyseSteps()}</div>`;
  if (t.k === 'analyseAnswer')return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}${cards(artifactCard())}</div>`;
  return '';
}

/* ============================== inline bodies ============================== */
function inlineBody(t) {
  if (t.body === 'tickets')         return inlineTickets();
  if (t.body === 'deal')            return inlineDeal();
  if (t.body === 'clause')          return inlineClause(t.clauseId || 'liability-cap');
  if (t.body === 'team')            return inlineTeam();
  if (t.body === 'newticket')       return inlineNewTicket();
  if (t.body === 'ticket-created')  return inlineTicketCreated(t.ticketId, t.kindTitle);
  if (t.body === 'kb')              return inlineKb(t.query || '');
  return '';
}

function riskPill(r) {
  if (r === 'critical') return pill('pill--squared pill--xs pill--warning', 'Critical');
  if (r === 'elevated') return pill('pill--squared pill--xs pill--gray',    'Elevated');
  return pill('pill--squared pill--xs pill--gray', 'Standard');
}

/* Ticket queue — four KPI tiles + a 4-column table (TICKET / DEAL / STATUS
   / DUE), matched to the reference artifact. Follow-up chip suggestions
   render below the card via renderInlineChips(). */
function statusPill(status) {
  const cls = status === 'Needs legal input' ? 'inl-pill--warn'
            : status === 'With counterparty'  ? 'inl-pill--muted'
            : 'inl-pill--soft';
  return `<span class="inl-pill ${cls}">${esc(status)}</span>`;
}
function inlineTickets() {
  const countBy = s => TICKETS.filter(t => t.status === s).length;
  const kpis = [
    ['Open tickets',           TICKETS.length],
    ['Needs legal input',      countBy('Needs legal input')],
    ['With counterparty',      countBy('With counterparty')],
    ['Awaiting your response', countBy('Your response')]
  ];
  const rows = TICKETS.map(t => `<tr>
      <td class="mono">${esc(t.id)}</td>
      <td>${esc(t.deal)}</td>
      <td>${statusPill(t.status)}</td>
      <td>${esc(t.due)}</td>
    </tr>`).join('');
  return `<div class="inl-card">
    <div class="inl-kpis inl-kpis--flat">${kpis.map(([l, v]) => `<div class="inl-kpi inl-kpi--flat"><span class="inl-kpi__num">${v}</span><span class="inl-kpi__lbl">${esc(l)}</span></div>`).join('')}</div>
    <table class="inl-tbl">
      <thead><tr><th>TICKET</th><th>DEAL</th><th>STATUS</th><th>DUE</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function inlineDeal() {
  const d = DEAL;
  const rows = d.fields.map(([f, v]) => `<tr><td class="inl-tbl__k">${esc(f)}</td><td class="inl-tbl__v">${esc(v)}</td></tr>`).join('');
  const cites = d.citations.map(c => `<span class="inl-cite">${ICON[c.icon] || ''}<span>${esc(c.label)}</span></span>`).join('');
  return `<div class="inl-card">
      <table class="inl-tbl inl-tbl--fields">
        <thead><tr><th>FIELD</th><th>CURRENT STATUS</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="inl-cites">${cites}</div>
    </div>`;
}

/* Clause card matched to the reference artifact:
     - header strip: clause name (bold) + "Negotiation ladder" label
     - 2-column ladder rows: tier chip on the left, position + approval on
       the right; four tiers coloured (template / muted / warn / red-line)
     - citation chip strip below the card. */
const CLAUSE_TIER_CLASS = {
  'CP Template':      'cl-tier--template',
  'Also acceptable':  'cl-tier--muted',
  'Fallback 1':       'cl-tier--warn',
  'Fallback 2':       'cl-tier--warn',
  'Red line':         'cl-tier--red'
};
function inlineClause(clauseId) {
  const c = CLAUSES[clauseId] || CLAUSES['liability-cap'];
  const rows = c.ladder.map(p => `<div class="cl-row">
      <span class="cl-row__tier ${CLAUSE_TIER_CLASS[p.t] || ''}">${esc(p.t.toUpperCase())}</span>
      <span class="cl-row__body">
        <span class="cl-row__text">${esc(p.x)}</span>
        ${p.a ? `<span class="cl-row__approval">Approval: ${esc(p.a)}.</span>` : ''}
      </span>
    </div>`).join('');
  const cites = (c.citations || []).map(x => `<span class="inl-cite">${ICON[x.icon] || ''}<span>${esc(x.label)}</span></span>`).join('');
  return `<div class="cl-card">
      <div class="cl-card__head">
        <span class="cl-card__title">${esc(c.name)}</span>
        <span class="cl-card__eyebrow">Negotiation ladder</span>
      </div>
      <div class="cl-card__body">${rows}</div>
      ${cites ? `<div class="inl-cites">${cites}</div>` : ''}
    </div>`;
}

/* Generic knowledge-base response — used when a chip / free-text query does
   not match any of the six Quick-start asks. Matches the reference layout
   verbatim: a lead line, a follow-up sentence, three source citations, and
   three chip suggestions. */
function inlineKb(query) {
  const cites = [
    { icon: 'sharepoint', label: 'ChargePoint Playbook library' },
    { icon: 'sharepoint', label: 'Executed agreement corpus' },
    { icon: 'salesforce', label: 'Salesforce CRM' }
  ];
  const citesHtml = cites.map(x => `<span class="inl-cite">${ICON[x.icon] || ''}<span>${esc(x.label)}</span></span>`).join('');
  return `<div class="richtext">
      <p>Here’s what I found across the knowledge base for <em>${esc(query)}</em>.</p>
      <p>I searched the playbook library, executed agreement corpus, and Salesforce. If you’d like more specifics — a deal, a clause, or a ticket — just ask.</p>
    </div>
    <div class="inl-cites inl-cites--flat">${citesHtml}</div>`;
}

function inlineTeam() {
  const k = TEAM.kpi;
  const kpis = [
    ['Reportees',    k.reportees],
    ['Open tickets', k.open],
    ['Avg SLA',      k.avgSla],
    ['Overdue',      k.overdue, 'inl-kpi--warn']   /* final tile paints in red per the reference */
  ];
  const rows = TEAM.members.map(m => `<tr>
      <td>${esc(m.name)}</td>
      <td>${esc(m.role)}</td>
      <td>${m.open}</td>
      <td>${esc(m.sla)}</td>
      <td class="${m.overdue ? 'inl-num--warn' : ''}">${m.overdue}</td>
      <td>${esc(m.latest)}</td>
    </tr>`).join('');
  const cites = (TEAM.citations || []).map(c => `<span class="inl-cite">${ICON[c.icon] || ''}<span>${esc(c.label)}</span></span>`).join('');
  return `<div class="inl-card">
    <div class="inl-kpis inl-kpis--flat">${kpis.map(([l, v, cls]) => `<div class="inl-kpi inl-kpi--flat ${cls || ''}"><span class="inl-kpi__num">${v}</span><span class="inl-kpi__lbl">${esc(l)}</span></div>`).join('')}</div>
    <table class="inl-tbl">
      <thead><tr><th>NAME</th><th>ROLE</th><th>OPEN</th><th>AVG SLA</th><th>OVERDUE</th><th>LATEST TICKET</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="inl-cites">${cites}</div>
  </div>`;
}

/* Legacy form layout restored per user directive: full ticket form with
   Title / Related deal / Type / Priority / Details, Cancel + Open ticket
   buttons. The reference "ticket type" two-step is kept below in case it
   is needed again, but it is no longer wired to `newticket`. */
function inlineNewTicket() {
  const opt = arr => arr.map(x => `<option>${esc(x)}</option>`).join('');
  return `<div class="inl-card inl-card--form">
    <div class="inl-card__head"><span class="inl-card__eyebrow">New ticket · Jira CLM</span></div>
    <div class="inl-form">
      <label class="inl-form__field"><span class="inl-form__label">Title</span>
        <input class="inl-form__input" type="text" placeholder="Short summary of the ask"></label>
      <label class="inl-form__field"><span class="inl-form__label">Related deal</span>
        <select class="inl-form__input">${opt(NEW_TICKET_FIELDS.deals)}</select></label>
      <div class="inl-form__row">
        <label class="inl-form__field"><span class="inl-form__label">Type</span>
          <select class="inl-form__input">${opt(NEW_TICKET_FIELDS.types)}</select></label>
        <label class="inl-form__field"><span class="inl-form__label">Priority</span>
          <select class="inl-form__input">${opt(NEW_TICKET_FIELDS.priorities)}</select></label>
      </div>
      <label class="inl-form__field"><span class="inl-form__label">Details</span>
        <textarea class="inl-form__input" rows="3" placeholder="What do you need help with?"></textarea></label>
      <div class="inl-form__actions">
        ${btn('btn--sm btn--neutral-secondary', label('Cancel'))}
        ${btn('btn--sm btn--brand-primary',    label('Open ticket'))}
      </div>
    </div>
  </div>`;
}

/* Step 2 — ticket-created confirmation card. Rendered after the user picks
   a type in step 1. Shows a stable ticket id, status pill and follow-up
   chips (View in Jira / SLA / Open another ticket). */
function inlineTicketCreated(ticketId, kindTitle) {
  const rows = [
    ['ID',           `<span class="mono">${esc(ticketId)}</span>`],
    ['Title',        '(untitled)'],
    ['Type',         esc(kindTitle)],
    ['Template',     '—'],
    ['Counterparty', '—'],
    ['Status',       `<span class="inl-pill inl-pill--success">Open</span>`]
  ];
  return `<div class="inl-card">
    <table class="inl-tbl inl-tbl--fields inl-tbl--no-head">
      <tbody>${rows.map(([k, v]) => `<tr><td class="inl-tbl__k">${esc(k.toUpperCase())}</td><td class="inl-tbl__v">${v}</td></tr>`).join('')}</tbody>
    </table>
  </div>`;
}

/* Handler for step 1's option click — pushes: user bubble, agent "Got it"
   line, and the ticket-created inline card in sequence. */
function chooseTicketKind(kindId) {
  const k = TICKET_TYPES.find(x => x.id === kindId); if (!k) return;
  const ticketId = 'TKT-' + (1064 + Math.floor(Math.random() * 100));
  S.thread.push({ k: 'user', text: k.title });
  S.thread.push({ k: 'agent', html: rich(`Got it — <strong>${esc(k.title)}</strong>. Fill in the details below.`) });
  S.thread.push({ k: 'inline',
    lead: `Ticket <strong>${esc(ticketId)}</strong> created and assigned to the legal queue. You will get a notification once a lawyer picks it up — usually within 4 business hours.`,
    body: 'ticket-created', ticketId, kindTitle: k.title });
  render(); _scrollThread();
}

/* ============================== analyse flow bits ============================== */
function attachCard() {
  return `<button class="drop drop--attach" type="button" id="analyseAttach">
    <span class="drop__icon">${I['paperclip']}</span>
    <span class="drop__label">Attach the counterparty document</span>
    <span class="drop__hint mono">PDF · DOCX · up to 20MB</span>
  </button>`;
}
function attachedRow(file, meta) {
  return `<div class="attach-list"><div class="attach-row">
    <span class="attach-row__icon">${I['file-md']}</span>
    <span class="attach-row__name" title="${esc(file)}">${esc(file)}</span>
    ${pill('pill--squared pill--gray', esc(meta || 'Counterparty redline'))}
  </div></div>`;
}
const ANALYSE_STEPS = [
  ['search-md-12',   'Opening the document',               'Opened the document',                () => [ANALYSE_DOC.meta]],
  ['book-open-01',   'Parsing sections and clauses',       'Parsed sections and clauses',        () => [ANALYSE_DOC.stats[4].value + ' clauses touched']],
  ['book-open-01',   'Scoring each clause against the playbook', 'Scored against the playbook',  () => [ANALYSE_DOC.issues.length + ' material issues found']]
];
function renderAnalyseSteps() {
  const steps = ANALYSE_STEPS;
  const rows = steps.map((st, i) => {
    const done = i < S.learnStep, now = i === S.learnStep;
    if (!done && !now) return '';
    return cotStep(st[0], done ? st[2] : st[1], { rich: true, results: done ? st[3]() : null });
  }).join('') + (S.learnStep >= steps.length ? cotStep('check-circle', 'Done', { done: true }) : '');
  return cot('analyse', rows);
}

function artifactTitle() {
  const a = S.ask; if (!a) return 'Answer';
  if (a.kind === 'analyse') return 'Contract analysis · ' + ANALYSE_DOC.file.replace(/\.[a-z]+$/i, '');
  if (a.kind === 'tickets') return 'Open contract-review tickets';
  if (a.kind === 'clause')  return CLAUSES[clauseKey(a)].name;
  return CONCEPTS[conceptKey(a)].name;
}
function artifactSub() {
  const a = S.ask; if (!a) return '';
  if (a.kind === 'analyse') return `Analysis · ${ANALYSE_DOC.issues.length} material issues · ${ANALYSE_DOC.overall.risk} overall risk`;
  if (a.kind === 'tickets') return `Ticketing · ${TICKETS.length} open · Jira Service Management`;
  if (a.kind === 'clause')  { const c = CLAUSES[clauseKey(a)]; return `Clause reference · ${c.corpus.docs} ${c.corpus.label} · Version 1`; }
  const c = CONCEPTS[conceptKey(a)]; return `Concept · ${c.corpus.docs} ${c.corpus.label} · Version 1`;
}
function artifactCard() {
  return `<button class="inline-artifact-card" type="button" id="openArt" ${TAG('inline-artifact-card', 'Inline artifact card', '5717:486438')}>
    <span class="inline-artifact-card__main">
      <span class="inline-artifact-card__hover"><span class="inline-artifact-card__stack"><span class="inline-artifact-card__back"></span><span class="inline-artifact-card__front"></span><span class="inline-artifact-card__glyph">${I['artifact-card-icon']}</span></span></span>
      <span class="inline-artifact-card__text">
        <span class="inline-artifact-card__title-row"><span class="inline-artifact-card__title" data-tip="${esc(artifactTitle())}">${esc(artifactTitle())}</span></span>
        <span class="inline-artifact-card__sub">${esc(artifactSub())}</span>
      </span>
    </span>
    <span class="inline-artifact-card__actions"><span class="btn btn--icon btn--neutral-tertiary" aria-hidden="true">${I['maximize-01']}</span></span>
  </button>`;
}
function pendingArtifactCard() {
  return `<div class="inline-artifact-card inline-artifact-card--pending" role="status" aria-live="polite" aria-label="Building answer">
    <span class="inline-artifact-card__main">
      <span class="pending-spinner" aria-hidden="true"></span>
      <span class="inline-artifact-card__text">
        <span class="inline-artifact-card__title-row"><span class="inline-artifact-card__title">Building ${esc(artifactTitle())}</span></span>
        <span class="inline-artifact-card__sub">Reading corpus, laying out the answer…</span>
      </span>
    </span>
  </div>`;
}

/* ============================== permission cards ============================== */
function permText(k, f) { return f.replace('{L}', PERMS[k].label); }
function renderPerm(id) {
  const p = PERMS[id], open = S.open['perm' + id], st = S.perms[id];
  if (id === 'sharepoint') {
    return `<div class="perm">
      <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
        <div class="perm__body"><span class="perm__title">Where do the executed agreements live?</span><span class="perm__scope">Both are already connected for ChargePoint Legal · read-only · pick the one that holds the signed paper.</span></div></div>
      ${!st ? `<div class="perm__pick">
        ${p.choices.map(c => `<button class="srcopt" type="button" data-src="${c.id}" aria-pressed="${S.src === c.id ? 'true' : 'false'}">
          <span class="srcopt__icon">${ICON[c.icon]}</span>
          <span class="srcopt__text"><b>${esc(c.label)}</b><span>${esc(c.sub)}</span></span>
          <span class="srcopt__meta">${esc(c.meta)}</span></button>`).join('')}</div>` : ''}
      ${open ? permDetail(id, p) : ''}
      ${st ? `<div class="perm__granted">${ICON.tick}${srcName()} · executed contracts library read, including their version history</div>`
        : `<div class="perm__acts">
          <button class="disclose" type="button" data-disc="perm${id}">${open ? 'Hide detail' : 'What I will read'}</button>
          <span class="spacer"></span>
          ${btn('btn--sm btn--brand-primary', label('Read from ' + srcName()), `data-perm="${id}" data-v="always"`)}
        </div>`}
    </div>`;
  }
  /* Jira permission — inline single-source card. */
  return `<div class="perm">
    <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
      <div class="perm__body"><span class="perm__title">${esc(p.name)}</span><span class="perm__scope">${esc(p.scope)}</span></div></div>
    ${open ? permDetail(id, p) : ''}
    ${st ? `<div class="perm__granted">${ICON.tick}${esc(p.label)} — connected, read-only</div>`
      : `<div class="perm__acts">
        <button class="disclose" type="button" data-disc="perm${id}">${open ? 'Hide detail' : 'What I will read'}</button>
        <span class="spacer"></span>
        ${btn('btn--sm btn--neutral-tertiary', label("Don't allow"), `data-perm="${id}" data-v="denied"`)}
        ${btn('btn--sm btn--neutral-secondary', label('Allow once'), `data-perm="${id}" data-v="once"`)}
        ${btn('btn--sm btn--brand-primary', label('Always allow'), `data-perm="${id}" data-v="always"`)}
      </div>`}
  </div>`;
}
function permDetail(id, p) {
  return `<div class="perm__detail"><span class="label">What I will read</span>
    <ul>${p.what.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
    <span class="perm__never">${esc(p.never)}</span></div>`;
}
function renderSourcePick(perm) {
  const rows = perm === 'jira'
    ? [['jira', ICON.jira, 'Jira Service Management', 'CLM — Contract Legal project, read-only']]
    : [
        ['sharepoint', ICON.sharepoint, 'SharePoint', 'Legal › Contracts — Executed · 84 files'],
        ['onedrive',   ICON.onedrive,   'OneDrive',    'Contracts › Executed · synced']
      ];
  const row = (id, icon, title, sub) => `<div class="list-item" ${TAG('list-item', 'List Item', '905:300536')}>
    <span class="list-item__content" data-pick-source="${id}" data-pick-perm="${perm}" role="button" tabindex="0">
      <span class="list-item__icon">${icon}</span>
      <span class="list-item__text"><span class="list-item__title">${esc(title)}</span><span class="list-item__sub">${esc(sub)}</span></span>
    </span>
    ${btn('btn--sm btn--neutral-secondary', label('Connect'), `data-pick-source="${id}" data-pick-perm="${perm}"`)}
  </div>`;
  return rows.map(r => row(...r)).join('');
}

/* ============================== steps + findings ============================== */
/* Learn steps are keyed off the current ask so the "Read" / "Analysed" numbers
   in Findings match the corpus block on the answer artifact. */
function learnStepsFor(ask) {
  if (ask.kind === 'tickets') return [
    ['search-md-12', 'Opening the CLM queue', 'Opened the CLM queue', () => [`${TICKETS.length} open tickets`, 'Jira › CLM · Contract Legal', 'Reporter, assignee, priority']],
    ['book-open-01', 'Matching each to its contract type', 'Matched each ticket to a contract type', () => [`${new Set(TICKETS.map(t=>t.ct)).size} contract types`]],
    ['book-open-01', 'Ordering by hearing / due date', 'Ordered by hearing / due date', () => [`${TICKETS.filter(t=>t.overdue).length} overdue · ${TICKETS.filter(t=>t.risk==='critical').length} critical`]],
    ['search-md-12', 'Cross-checking against your playbook', 'Cross-checked against your playbook', () => [`${TICKETS.length} tickets scored`]]
  ];
  if (ask.kind === 'clause') {
    const c = CLAUSES[clauseKey(ask)];
    return [
      ['search-md-12', 'Opening the executed agreements', 'Opened the executed agreements', () => [`${c.corpus.docs} documents`, 'SharePoint › Legal — Contracts', 'Version history']],
      ['book-open-01', 'Locating every occurrence of the clause', 'Located every occurrence of the clause', () => [`${c.corpus.clauses} clause instances`]],
      ['book-open-01', 'Reading how each position actually settled', 'Read how each position settled', () => [`${c.corpus.clauses} clauses`, `${c.corpus.parties} counterparties`]],
      ['search-md-12', 'Checking the template against what was signed', 'Checked the template against what was signed', () => [`${c.ladder.length} tiers written`]]
    ];
  }
  const c = CONCEPTS[conceptKey(ask)];
  return [
    ['search-md-12', 'Opening the executed agreements', 'Opened the executed agreements', () => [`${c.corpus.docs} documents`, 'SharePoint › Legal — Contracts']],
    ['book-open-01', 'Grouping the corpus by contract type', 'Grouped the corpus by contract type', () => [`${c.breakdown.length} segments`]],
    ['book-open-01', 'Reading how each segment lands on this concept', 'Read how each segment landed', () => [`${c.corpus.clauses} clauses`, `${c.corpus.parties} counterparties`]],
    ['search-md-12', 'Aligning against the playbook ladder', 'Aligned against the playbook ladder', () => [`${c.ladder.length} tiers`]]
  ];
}

function renderSteps() {
  const steps = learnStepsFor(S.ask);
  const rows = steps.map((st, i) => {
    const done = i < S.learnStep, now = i === S.learnStep;
    if (!done && !now) return '';
    return cotStep(st[0], done ? st[2] : st[1], { rich: true, results: done ? st[3]() : null });
  }).join('') + (S.learnStep >= steps.length ? cotStep('check-circle', 'Done', { done: true }) : '');
  return cot('learn', rows);
}

function renderFindings() {
  const a = S.ask;
  if (a.kind === 'tickets') {
    const overdue = TICKETS.filter(t => t.overdue).length;
    const mine = TICKETS.filter(t => t.who === 'You').length;
    const crit = TICKETS.filter(t => t.risk === 'critical').length;
    return cards(citationCard('What I found', [
      ['Open right now',            `${TICKETS.length} tickets across ${new Set(TICKETS.map(t=>t.ct)).size} contract types`],
      ['On your desk',              `${mine} ticket${mine===1?'':'s'} assigned to you, ${TICKETS.length - mine} to review from other reviewers`],
      ['Critical risk',             `${crit} tickets — liability cap, TFC or data ownership push`],
      ['Overdue',                   overdue ? `${overdue} — Transit East prevailing wage recalc, since 15 Sep` : 'None. The next one comes due tomorrow.']
    ]));
  }
  if (a.kind === 'clause') {
    const c = CLAUSES[clauseKey(a)];
    return cards(citationCard('What I found', [
      ['Read',                       `${c.corpus.docs} ${c.corpus.label} from ${srcName()}, with their version history`],
      ['Clause instances located',   `${c.corpus.clauses} occurrences across ${c.corpus.parties} counterparties`],
      ['Where the corpus settled',   c.settled[0].join(' — ') + '; ' + c.settled[1].join(' — ')],
      ['Playbook ladder',            `${c.ladder.length} tiers — from template to red line`]
    ]));
  }
  const c = CONCEPTS[conceptKey(a)];
  return cards(citationCard('What I found', [
    ['Read',                        `${c.corpus.docs} ${c.corpus.label}`],
    ['Segments where the position varies', `${c.breakdown.length} — ${c.breakdown.map(b=>b.seg).join(', ')}`],
    ['Playbook ladder',             `${c.ladder.length} tiers`],
    ['Reason it varies',            c.why]
  ]));
}

/* ============================== artifact canvas (answer) ============================== */
function pbId() {
  const a = S.ask; if (!a) return 'KA00000';
  const ix = ASKS.findIndex(x => x.id === a.id);
  return 'KA' + String(219 + ix * 11).padStart(5, '0');
}
function renderCanvas() {
  return `<div class="canvas" data-figma-node="1809:488550">
    <header class="artifact-header" ${TAG('artifact-header', 'Arifact Header', '3838:245967')}>
      <div class="artifact-header__content">
        <div class="artifact-header__left">
          <span class="artifact-header__icon">${I['file-md']}</span>
          <button class="artifact-header__title" type="button" title="Rename"><span class="artifact-header__title-text">${esc(artifactTitle())}</span></button>
          ${pill('pill--squared pill--xs pill--gray mono', pbId())}
        </div>
        <div class="artifact-header__actions">
          <div class="artifact-header__group">${btn('btn--icon btn--neutral-tertiary', I['shield-01'], 'id="srcBtn" data-tip="Sources and permissions" aria-label="Sources and permissions"')}<span class="artifact-header__rule"></span></div>
          <div class="artifact-header__group"><button class="artifact-header__version" type="button" data-tip="Version history">v1.0${I['chevron-down-sm']}</button></div>
          <div class="artifact-header__group">
            ${btn('btn--xs btn--neutral-secondary artifact-header__publish', I['plus'] + label('Save to Playbook'), 'id="saveBtn"')}
            ${btn('btn--xs btn--brand-primary artifact-header__publish', I['book'] + label('Share answer'), 'id="pubBtn"')}
          </div>
          <div class="artifact-header__group artifact-header__group--tight">
            ${btn('btn--icon btn--neutral-tertiary', I['download-01'], 'id="dlBtn" data-tip="Download as a Word document" aria-label="Download"')}
            ${btn('btn--icon btn--neutral-tertiary', I['maximize-01'], `id="maxBtn" aria-label="${S.canvasMax ? 'Show the chat' : 'Expand'}" aria-pressed="${S.canvasMax ? 'true' : 'false'}"`)}
            ${btn('btn--icon btn--neutral-tertiary', I['x-close'], 'id="closeArt" aria-label="Close"')}
          </div>
        </div>
      </div>
    </header>
    <div class="canvas__body" id="canvasBody"><div class="doc" id="canvasDoc"></div></div>
  </div>`;
}

const TIER = ['CP Template', 'Also acceptable', 'Fallback 1', 'Fallback 2', 'Red line'];
const RISK = {
  critical: ['pill--squared pill--xs pill--warning', 'Critical'],
  elevated: ['pill--squared pill--xs pill--gray', 'Elevated'],
  standard: ['pill--squared pill--xs pill--gray', 'Standard']
};

function renderAnswer($doc) {
  const a = S.ask;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const meta = (rows) => `<div class="doc__head"><div class="doc__meta" data-figma-node="1809:488589">
    ${rows.map(([l, v]) => `<span class="doc__meta-item"><span class="label">${esc(l)}</span><span class="doc__meta-v">${v}</span></span>`).join('')}
  </div></div>`;

  if (a.kind === 'analyse') {
    const d = ANALYSE_DOC;
    $doc.innerHTML = meta([
      ['Document',       esc(d.file)],
      ['Counterparty',   esc(d.party)],
      ['Contract type',  esc(d.ct)],
      ['Overall risk',   esc(d.overall.risk) + ' · score ' + d.overall.score + '/100'],
      ['Generated',      today]
    ]) + renderAnalyseBody(d);
    bindAnalyse($doc);
    return;
  }
  if (a.kind === 'tickets') {
    $doc.innerHTML = meta([
      ['Source', 'Jira Service Management — CLM'],
      ['Open tickets', `${TICKETS.length}`],
      ['On your desk', `${TICKETS.filter(t=>t.who==='You').length}`],
      ['Overdue', `${TICKETS.filter(t=>t.overdue).length}`],
      ['Generated', today]
    ]) + renderTicketsBody();
    bindTickets($doc);
    return;
  }
  if (a.kind === 'clause') {
    const c = CLAUSES[clauseKey(a)];
    $doc.innerHTML = meta([
      ['Clause', esc(c.section)],
      ['Contract types', esc(c.ct)],
      ['Read from', srcName()],
      ['Corpus', `${c.corpus.docs} ${c.corpus.label} · ${c.corpus.parties} counterparties`],
      ['Generated', today]
    ]) + renderClauseBody(c);
    return;
  }
  const c = CONCEPTS[conceptKey(a)];
  $doc.innerHTML = meta([
    ['Concept', esc(c.name)],
    ['Read from', srcName()],
    ['Corpus', `${c.corpus.docs} ${c.corpus.label} · ${c.corpus.parties} counterparties`],
    ['Ladder tiers', `${c.ladder.length}`],
    ['Generated', today]
  ]) + renderConceptBody(c);
}

/* ---- tickets body ---- */
function renderTicketsBody() {
  const sel = S.selTicket && TICKETS.find(t => t.id === S.selTicket) ? S.selTicket : TICKETS[0].id;
  const cur = TICKETS.find(t => t.id === sel);
  return `<div class="md">
    <div class="plist">
      <div class="plist__head">
        <button class="plist__sel" type="button">Open tickets ${I['chevron-down-sm']}</button>
        <span class="mono plist__count">${TICKETS.length}</span>
        <span class="spacer"></span>
        ${btn('btn--icon-sm btn--neutral-tertiary', I['filter-lines'], `title="Filter" aria-label="Filter"`)}
        ${btn('btn--icon-sm btn--neutral-tertiary', I['search-md-18'], `title="Search" aria-label="Search"`)}
      </div>
      <div class="plist__scroll">
        ${TICKETS.map(t => `<button class="pcard" type="button" data-ticket="${t.id}" aria-current="${cur.id===t.id?'true':'false'}">
          <span class="pcard__top">
            <span class="pcard__num mono">${t.id}</span>
            <span class="pcard__title">${esc(t.title)}</span>
            ${t.overdue ? `<span class="pcard__warn" title="Overdue">${I['alert-triangle']}</span>` : ''}
          </span>
          <span class="pcard__desc">${esc(t.counterparty)} · ${esc(t.stage)}</span>
          <span class="pcard__foot">
            ${pill('pill--squared pill--xs pill--gray', esc(t.ct))}
            ${pill(RISK[t.risk][0], RISK[t.risk][1])}
            <span class="pcard__due ${t.overdue?'pcard__due--over':''}">Due ${esc(t.due)}</span>
          </span>
        </button>`).join('')}
      </div>
    </div>
    ${renderTicketDetail(cur)}
  </div>`;
}
function renderTicketDetail(t) {
  return `<div class="pdet">
    <div class="pdet__head"><div class="pdet__in pdet__head-in">
      <h3 class="pdet__title">${esc(t.title)}</h3>
      <span class="spacer"></span>
      ${pill(RISK[t.risk][0], RISK[t.risk][1])}
      ${t.overdue ? pill('pill--squared pill--xs pill--warning', 'Overdue') : ''}
    </div></div>
    <div class="pdet__scroll"><div class="pdet__in pdet__body">
      <div class="pdet__meta">
        <div class="mcell"><span class="label">Ticket</span><span class="mval mono">${esc(t.id)}</span></div>
        <div class="mcell"><span class="label">Reviewer</span><span class="mval">${esc(t.who)}</span></div>
        <div class="mcell"><span class="label">Contract type</span><span class="mval">${esc(t.ct)}</span></div>
        <div class="mcell"><span class="label">Stage</span><span class="mval">${esc(t.stage)}</span></div>
        <div class="mcell"><span class="label">Counterparty</span><span class="mval">${esc(t.counterparty)}</span></div>
        <div class="mcell"><span class="label">Value</span><span class="mval">${esc(t.value)}</span></div>
        <div class="mcell"><span class="label">Due</span><span class="mval ${t.overdue?'mval--over':''}">${esc(t.due)}</span></div>
      </div>
      <div class="pdet__block"><span class="label">Where it stands</span><p class="pdet__about">${esc(t.body)}</p></div>
      <div class="pdet__block">
        <span class="pdet__h">Playbook positions</span>
        <p class="sm">The ladder your playbook holds for this issue.</p>
        <div class="tiers">${t.plays.map((p, pi) => tierPositionCard(p, pi, pi === 1)).join('')}</div>
      </div>
    </div></div>
  </div>`;
}
function bindTickets($doc) {
  $doc.querySelectorAll('[data-ticket]').forEach(b => b.onclick = () => { S.selTicket = b.dataset.ticket; render(); });
}

/* ---- analyse body (issues + recommendations canvas) ---- */
function renderAnalyseBody(d) {
  const sel = S.selIssue && d.issues.find(i => i.id === S.selIssue) ? S.selIssue : d.issues[0].id;
  const cur = d.issues.find(i => i.id === sel);
  const stats = d.stats.map(s => `<div class="an-stat"><span class="an-stat__num">${esc(String(s.value))}</span><span class="an-stat__lbl">${esc(s.label)}</span></div>`).join('');
  const issues = d.issues.map(i => `<button class="pcard ${cur && cur.id === i.id ? '' : ''}" type="button" data-issue="${i.id}" aria-current="${cur && cur.id === i.id ? 'true' : 'false'}">
      <span class="pcard__top">
        <span class="pcard__num mono">${esc(i.id)}</span>
        <span class="pcard__title">${esc(i.title)}</span>
      </span>
      <span class="pcard__desc">${esc(i.section)}</span>
      <span class="pcard__foot">
        ${riskPill(i.risk)}
        <span class="pcard__due">${esc(i.section)}</span>
      </span>
    </button>`).join('');
  return `<div class="ans">
    <div class="ans__scroll"><div class="ans__col">
      <section class="ans__section">
        <h2 class="ans__h2">Overall</h2>
        <p class="ans__lead">${esc(d.overall.summary)}</p>
        <div class="an-stats">${stats}</div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Issues</h2>
        <div class="md md--analyse">
          <div class="plist">
            <div class="plist__head">
              <button class="plist__sel" type="button">Material issues ${I['chevron-down-sm']}</button>
              <span class="mono plist__count">${d.issues.length}</span>
              <span class="spacer"></span>
              ${btn('btn--icon-sm btn--neutral-tertiary', I['filter-lines'], `title="Filter" aria-label="Filter"`)}
              ${btn('btn--icon-sm btn--neutral-tertiary', I['search-md-18'], `title="Search" aria-label="Search"`)}
            </div>
            <div class="plist__scroll">${issues}</div>
          </div>
          ${renderIssueDetail(cur)}
        </div>
      </section>
    </div></div>
  </div>`;
}
function renderIssueDetail(i) {
  return `<div class="pdet">
    <div class="pdet__head"><div class="pdet__in pdet__head-in">
      <h3 class="pdet__title">${esc(i.title)}</h3>
      <span class="spacer"></span>
      ${riskPill(i.risk)}
    </div></div>
    <div class="pdet__scroll"><div class="pdet__in pdet__body">
      <div class="pdet__meta">
        <div class="mcell"><span class="label">Issue</span><span class="mval mono">${esc(i.id)}</span></div>
        <div class="mcell"><span class="label">Section</span><span class="mval">${esc(i.section)}</span></div>
        <div class="mcell"><span class="label">Risk</span><span class="mval">${esc(i.risk[0].toUpperCase() + i.risk.slice(1))}</span></div>
      </div>
      <div class="pdet__block"><span class="label">What the counterparty asked for</span><p class="pdet__about">${esc(i.body)}</p></div>
    </div></div>
  </div>`;
}
function bindAnalyse($doc) {
  $doc.querySelectorAll('[data-issue]').forEach(b => b.onclick = () => { S.selIssue = b.dataset.issue; render(); });
}

/* ---- clause body ---- */
function renderClauseBody(c) {
  return `<div class="ans">
    <div class="ans__scroll"><div class="ans__col">
      <section class="ans__section">
        <h2 class="ans__h2">Position — top line</h2>
        <p class="ans__lead">${esc(c.ladder[0].x)}</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Why this matters</h2>
        <p class="ans__body">${esc(c.why)}</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Where the corpus actually settled</h2>
        <div class="settled">${c.settled.map(([lbl, cnt]) =>
          `<div class="settled__row"><span class="settled__cnt mono">${esc(cnt)}</span><span class="settled__lbl">${esc(lbl)}</span></div>`).join('')}
        </div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">The position ladder</h2>
        <p class="sm">Every fallback is priced against real precedent. Approvers travel with each tier.</p>
        <div class="tiers">${c.ladder.map((p, pi) => tierPositionCard(p, pi, pi === 0)).join('')}</div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Clauses this issue moves</h2>
        <div class="chips">${c.cl.map(x => pill('pill--squared pill--xs pill--gray pill--clause', esc(x))).join('')}</div>
      </section>
    </div></div>
  </div>`;
}

/* ---- concept body ---- */
function renderConceptBody(c) {
  return `<div class="ans">
    <div class="ans__scroll"><div class="ans__col">
      <section class="ans__section">
        <h2 class="ans__h2">The short answer</h2>
        <p class="ans__lead">${esc(c.lead)}</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">By contract type</h2>
        <div class="seg-table">
          ${c.breakdown.map(b => `<div class="seg-row">
            <span class="seg-row__seg">${esc(b.seg)}</span>
            <span class="seg-row__pos">${esc(b.pos)}</span>
            <span class="seg-row__ct sm">${esc(b.ct)}</span>
          </div>`).join('')}
        </div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Why the position varies</h2>
        <p class="ans__body">${esc(c.why)}</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">The playbook ladder</h2>
        <div class="tiers">${c.ladder.map((p, pi) => tierPositionCard(p, pi, pi === 0)).join('')}</div>
      </section>
    </div></div>
  </div>`;
}

function tierPositionCard(p, pi, isStandard) {
  const ti = TIER.indexOf(p.t) >= 0 ? TIER.indexOf(p.t) : (p.t === 'Red line' ? 4 : p.t === 'Recommended for this deal' ? 1 : 1);
  return `<div class="tier tier--${ti} ${isStandard ? 'tier--sel' : ''}">
    <div class="tier__head">
      <span class="tier__name">${esc(p.t)}</span>
      ${isStandard ? pill('pill--solid pill--gray-solid', 'Standard') : ''}
      ${p.a ? `<span class="spacer"></span><span class="tier__approval sm">${esc(p.a)}</span>` : ''}
    </div>
    <div class="tier__body">
      <div class="tier__text">${esc(p.x)}</div>
      ${p.l ? `<span class="tier__lang">${esc(p.l)}</span>` : ''}
    </div>
  </div>`;
}

function bindCanvas() {
  const mx = document.getElementById('maxBtn'); if (mx) mx.onclick = () => { S.canvasMax = !S.canvasMax; render(); };
  const cl = document.getElementById('closeArt'); if (cl) cl.onclick = () => { S.canvasMax = false; S.canvasClosed = true; render(); };
  const dl = document.getElementById('dlBtn'); if (dl) dl.onclick = () => { dl.setAttribute('data-tip', 'Preparing the document…'); };
  const sv = document.getElementById('saveBtn'); if (sv) sv.onclick = () => { sv.querySelector('.btn__label').textContent = 'Saved to playbook'; sv.disabled = true; };
  const pb = document.getElementById('pubBtn'); if (pb) pb.onclick = () => { pb.querySelector('.btn__label').textContent = 'Shared'; pb.disabled = true; };
  const sb = document.getElementById('srcBtn'); if (sb) sb.onclick = () => { S.sheet = 'perms'; render(); };
}

/* ============================== dock: composer ============================== */
function composerExpandedHTML(ph, key) {
  /* Landing composer — Figma node 10159:504124.
     Column: 12 px gap. Row 1 is the message (textarea, placeholder Geist
     15/26). Row 2 is a 32-tall action bar: left "Wrap" = + button plus
     Source + Tools pills (touching); right "Actions" = Model / Mic / Voice,
     3 identical 32×32 buttons spaced 4 apart. No send button per spec —
     submit is via Enter. */
  return `<div class="copilot-input copilot-input--stacked" ${TAG('copilot-input', 'Copilot desktop Input Box', '10159:504124')}>
    <div class="copilot-input__field copilot-input__field--stacked"><textarea id="ta-${key}" rows="2" placeholder="${esc(ph)}" aria-label="Ask the knowledge agent"></textarea></div>
    <div class="copilot-input__action-bar">
      <div class="copilot-input__wrap">
        <button class="copilot-input__btn" type="button" id="clip-${key}" title="Add a document" aria-label="Add a document">${I['plus']}</button>
        <div class="copilot-input__pills">
          <button class="copilot-input__pill copilot-input__pill--source" type="button" aria-label="Company"><span class="copilot-input__pill-icon">${I['building-05']}</span><span class="copilot-input__pill-label">Company</span></button>
          <button class="copilot-input__pill copilot-input__pill--source" type="button" aria-label="Research"><span class="copilot-input__pill-icon">${I['telescope']}</span><span class="copilot-input__pill-label">Research</span></button>
        </div>
      </div>
      <div class="copilot-input__actions">
        <button class="copilot-input__action" type="button" id="send-${key}" aria-label="Model">${I['openai']}</button>
        <button class="copilot-input__action" type="button" aria-label="Dictate">${I['microphone-01']}</button>
        <button class="copilot-input__action" type="button" aria-label="Voice">${I['voice-mode']}</button>
      </div>
    </div></div>`;
}
function composerHTML(ph, key) {
  if (key === 'home') return composerExpandedHTML(ph, key);
  const inner = `<div class="copilot-input" ${TAG('copilot-input', 'Copilot desktop Input Box', '5563:230560')}>
    <div class="copilot-input__bar">
      <div class="copilot-input__left">
        <div class="copilot-input__wrap">
          <button class="copilot-input__btn" type="button" id="clip-${key}" title="Add a document" aria-label="Add a document">${I['plus']}</button>
          <div class="copilot-input__wrap">
            <button class="copilot-input__pill copilot-input__pill--source" type="button" title="${anySrc() ? 'Sources connected' : 'No source connected'}" aria-label="Source">${I['building-05']}</button>
            <button class="copilot-input__pill copilot-input__pill--source" type="button" title="Research" aria-label="Research">${I['telescope']}</button>
          </div>
        </div>
        <div class="copilot-input__field"><textarea id="ta-${key}" rows="1" placeholder="${esc(ph)}" aria-label="Message"></textarea></div>
      </div>
      <div class="copilot-input__actions">
        <button class="copilot-input__action" type="button" aria-label="Model">${I['openai']}</button>
        <button class="copilot-input__action" type="button" aria-label="Dictate">${I['microphone-01']}</button>
        <button class="copilot-input__action copilot-input__action--send" type="button" id="send-${key}" aria-label="Send">${I['arrow-up']}</button>
      </div>
    </div></div>`;
  return `<div class="copilot-input-frame" data-figma-node="5975:416348">${inner}</div>`;
}
function anySrc() { return Object.values(S.connected).some(Boolean); }
function bindComposer(key) {
  const ta = document.getElementById('ta-' + key);
  if (ta) { ta.oninput = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, key === 'home' ? 208 : 156) + 'px'; };
    ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFree(ta.value); } }; }
  const sb = document.getElementById('send-' + key); if (sb) sb.onclick = () => submitFree(ta ? ta.value : '');
}
function renderDock() {
  const d = document.getElementById('dock'); if (!d) return;
  const ph = S.stage === 'answer' ? 'Ask a follow-up — narrow the answer, or ask about another clause' : 'Ask the Knowledge Agent';
  setHTML(d, composerHTML(ph, 'chat'));
  bindComposer('chat');
}

/* ============================== flow ============================== */
/* Entry point for the six landing Quick-start cards and for follow-up chip
   clicks. Five kinds branch into the inline flow (short "thinking" beat →
   inline card in the thread); the sixth — Analyse a contract — branches
   into the attach + canvas flow. Fresh landing → clears the thread; a
   subsequent chip click inside an ongoing chat appends instead so the
   earlier turns stay visible. */
function beginQuick(askId, chipText) {
  const a = QUICK_ASKS[askId]; if (!a) return;
  const fresh = S.stage === 'start';
  S.ask = a;
  if (fresh) S.thread = [];
  S.thread.push({ k: 'user', text: chipText || a.q });
  if (a.mode === 'inline')          return runInline(a);
  if (a.mode === 'canvas-analyse')  return runAnalyse(a);
}

const INLINE_LEADS = {
  tickets:   () => {
    /* "4 deals" matches the reference artifact copy verbatim (the corpus has
       five distinct deal names because Apex Energy MSA / Oakfield Site Host
       each recur; the reference groups them as one deal each). */
    const needsLegal = TICKETS.filter(t => t.status === 'Needs legal input').length;
    const withCp     = TICKETS.filter(t => t.status === 'With counterparty').length;
    const yours      = TICKETS.filter(t => t.status === 'Your response').length;
    return `You have <strong>${TICKETS.length} open tickets</strong> across 4 deals this week. ${needsLegal} are in “Needs legal input”, ${withCp} are with counterparty, ${yours} are awaiting your response.`;
  },
  deal:      () => DEAL.lead,
  clause:    (a) => { const c = CLAUSES[a.clauseId]; return c.lead || `The playbook holds a <strong>${c.ladder.length}-tier ladder</strong> for ${esc(c.section)}. Standard landed in ${esc(c.settled[0][1])} executed agreements; the exceptions carry structure I can point to.`; },
  team:      () => `Your team has <strong>${TEAM.kpi.open} open tickets</strong> across ${TEAM.kpi.reportees} reps. Average SLA is <strong>${esc(TEAM.kpi.avgSla)}</strong>. ${TEAM.kpi.overdue} tickets are overdue.<br><br>${esc(TEAM.lead)}`,
  newticket: () => `Sure — I can open a legal ticket in Jira <strong>CLM</strong>. Fill in the fields below and I will route it to the right reviewer.`
};

/* Follow-up "chip" suggestions rendered below each inline answer, matching
   the reference artifact. Each chip re-submits its text through the same
   flow, so the user can drill in without typing. */
const INLINE_CHIPS = {
  tickets: [
    'Show only overdue tickets',
    'What is the Apex Energy status?',
    'Open Jira for TKT-1042'
  ],
  deal: [
    "What is CP's position on liability cap?",
    'Show redline history for Apex',
    'Who is the legal contact for Apex?'
  ],
  clause: [
    'How often is Fallback 1 accepted?',
    'Show recent deals where LOL was conceded',
    'What should I say to a counterparty pushing back?'
  ],
  kb: [
    'Show my open tickets',
    "What is CP's position on limitation of liability?",
    'Analyse a counterparty contract'
  ],
  team: [
    "Show James Okafor's overdue tickets",
    'What deals are at risk from SLA breach?',
    'Export team report'
  ],
  newticket: [
    'Route to Contracts Manager',
    'Add the last redline as context',
    'Save as a draft'
  ]
};

function runInline(a) {
  const lead = INLINE_LEADS[a.kind](a);
  /* Inline card lands immediately below the user bubble — no "Thinking…"
     placeholder step, no CoT sidebar, no artifactPending. */
  S.stage = 'inline';
  S.thread.push({ k: 'inline', lead, body: a.kind, clauseId: a.clauseId });
  render(); _scrollThread();
}

function runAnalyse(a) {
  S.stage = 'analyse';
  S.thread.push({ k: 'agent', html: rich('I can review a counterparty contract and walk you through the issues that need attention — what each one is and why it matters.') });
  S.thread.push({ k: 'attachprompt', lead: 'Attach the document below — I will look for material issues and draft a response.' });
  render();
}

function analyseAttach() {
  S.thread.push({ k: 'user', text: 'Attached ' + ANALYSE_DOC.file });
  S.thread.push({ k: 'attached', file: ANALYSE_DOC.file, meta: ANALYSE_DOC.meta, commentary: 'Reading it now — this looks like the round 4 redline back from Apex Energy Storage.' });
  S.stage = 'analyseLearn';
  S.learnStep = 0;
  S.thread.push({ k: 'analyseSteps' });
  render(); _scrollThread();
  const step = () => { S.learnStep++; if (S.learnStep <= ANALYSE_STEPS.length) { render(); _scrollThread(); setTimeout(step, 620); } else finishAnalyse(); };
  setTimeout(step, 700);
}
function finishAnalyse() {
  S.cotOpen.analyse = false;
  const d = ANALYSE_DOC;
  const crit = d.issues.filter(i => i.risk === 'critical').length;
  const line = `Found <strong>${d.issues.length} material issues</strong> — ${crit} critical, ${d.issues.filter(i=>i.risk==='elevated').length} elevated. The full analysis is on the right — open any issue to see what the counterparty asked for.`;
  S.thread.push({ k: 'analyseAnswer', html: rich(line) });
  S.stage = 'answer';
  S.canvasClosed = false;
  render(); _scrollThread();
}

/* Legacy beginAsk kept for the deep-linking helpers (matchAsk on free-text
   input, back/forward from other artefacts). New landing entries all go
   through beginQuick above. */
function beginAsk(id) {
  const a = askById(id); if (!a) return;
  S.ask = a; S.thread = [];
  S.thread.push({ k: 'user', text: a.q });
  const perm = permForAsk(a);
  S.thread.push({ k: 'agent', html: rich(introFor(a)) });
  if (S.perms[perm] === 'always' || S.perms[perm] === 'once') {
    startLearning();
  } else if (perm === 'sharepoint') {
    S.thread.push({ k: 'sourcepick', lead: 'Where are the executed agreements you want me to read?', perm: 'sharepoint' });
    S.stage = 'asking';
  } else {
    S.thread.push({ k: 'perm', id: perm });
    S.stage = 'asking';
  }
  render();
}

function introFor(a) {
  if (a.kind === 'tickets') return 'I can list what is on your desk right now. Before I do, I need read-only access to your Jira <strong>CLM</strong> project — the Contract Legal queue. Nothing gets written back.';
  if (a.kind === 'clause') { const c = CLAUSES[clauseKey(a)]; return `That is the <strong>${esc(c.name)}</strong> clause, and it sits in <strong>${esc(c.section)}</strong>. I hold a ladder for it, but the positions are only meaningful against what ChargePoint has actually signed. Tell me where the executed agreements live.`; }
  const c = CONCEPTS[conceptKey(a)];
  return `That is a cross-cutting concept — it lands differently in ${c.breakdown.length} places. Before I read them out, I want to compare against what ChargePoint has actually signed. Tell me where the executed agreements live.`;
}

function clauseKey(a) { return a.id.replace(/^clause-/, ''); }
function conceptKey(a) { return a.id.replace(/^concept-/, ''); }

function answerPerm(id, v) {
  S.perms[id] = v;
  if (v !== 'denied') {
    S.connected[id] = true;
    startLearning();
  }
  render();
}

function startLearning() {
  if (S.learnStarted) return; S.learnStarted = true;
  S.stage = 'learn'; S.learnStep = 0;
  S.thread.push({ k: 'steps' });
  render();
  const total = learnStepsFor(S.ask).length;
  const step = () => { S.learnStep++; if (S.learnStep <= total) { render(); _scrollThread(); setTimeout(step, 620); } else finishLearning(); };
  setTimeout(step, 700);
}
function finishLearning() {
  S.cotOpen.learn = false;
  S.thread.push({ k: 'findings' });
  S.thread.push({ k: 'agent', html: rich(preAnswerLine()) });
  S.stage = 'answer_pre';
  render();
  streamText(closingLineFor(S.ask), () => {
    S.thread.push({ k: 'artifactPending' }); render(); _scrollThread();
    setTimeout(() => {
      const ix = S.thread.findIndex(x => x.k === 'artifactPending');
      if (ix >= 0) S.thread.splice(ix, 1);
      S.thread.push({ k: 'answer', html: rich(closingLineFor(S.ask, true)) });
      render(); _scrollThread();
      setTimeout(() => { S.stage = 'answer'; S.canvasClosed = false; render(); }, 1200);
    }, 5000);
  });
}
function preAnswerLine() {
  const a = S.ask;
  if (a.kind === 'tickets') return `You have <strong>${TICKETS.length} open</strong> tickets right now. ${TICKETS.filter(t=>t.who==='You').length} are assigned to you; the rest have come to you for a read.`;
  if (a.kind === 'clause') { const c = CLAUSES[clauseKey(a)]; return `The corpus is decisive on this. <strong>${c.settled[0][1]}</strong> landed on ${c.settled[0][0].toLowerCase()}; the exceptions carry structure I can point to.`; }
  const c = CONCEPTS[conceptKey(a)];
  return `The position varies by contract type — ${c.breakdown.length} segments, ${c.corpus.parties} counterparties. Same red line across the corpus.`;
}
function closingLineFor(a, isFinal) {
  if (a.kind === 'tickets') return isFinal
    ? 'Here is the open queue. Pick a ticket to see the playbook position and the recommended draft.'
    : 'Building the queue — reviewer, contract type, risk and the playbook position for each ticket.';
  if (a.kind === 'clause') return isFinal
    ? `The answer is ready. The full ladder, the corpus counts and the clauses this issue moves are on the right.`
    : `Writing the answer — the top-line position, why it matters, and the five-tier ladder with approvers on each rung.`;
  return isFinal
    ? 'The answer is ready. The by-contract-type breakdown and the ladder are on the right.'
    : 'Writing the answer — the by-segment breakdown and the four-tier ladder.';
}

function submitFree(v) {
  const s = (v || '').trim(); if (!s) return;
  /* Routing order:
       1. new Quick-start inline responses (tickets / deal / clause / …)
       2. legacy beginAsk paths (kept for deep-linking)
       3. generic knowledge-base inline card, so free-form chips such as
          "How often is Fallback 1 accepted?" render the reference KB
          response instead of a dead-end "not trained" line.
     The user's original text is preserved as the user bubble via chipText
     so the transcript reads as their exact ask. */
  const quickId = matchQuick(s);
  if (quickId) return beginQuick(quickId, s);
  const guess = matchAsk(s);
  if (guess) return beginAsk(guess.id);
  if (S.stage === 'start') return beginQuick('q-tickets');
  runInlineKb(s);
}

/* Push a generic KB response — the reference artifact renders this for any
   free-form knowledge query. Kept out of the Quick-start table because it
   is not one of the six landing cards. */
function runInlineKb(query) {
  S.thread.push({ k: 'user', text: query });
  S.stage = 'inline';
  S.thread.push({ k: 'inline', body: 'kb', query });
  render(); _scrollThread();
}
function matchQuick(s) {
  const t = s.toLowerCase();
  if (/apex|deal status|negotiation status|redline history/.test(t))          return 'q-deal';
  if (/overdue tickets|open tickets|show my open|show me my open|tickets do i have|my desk/.test(t)) return 'q-tickets';
  if (/position on liability|position on limitation|cp'?s position/.test(t))  return 'q-clause';
  if (/analyse a contract|analyze a contract|counterparty document|analyse a counterparty|analyze a counterparty|upload a contract/.test(t)) return 'q-analyse';
  if (/open a ticket|new ticket|create a legal ticket/.test(t))               return 'q-newticket';
  if (/team perform|sla|reviewer/.test(t))                                    return 'q-team';
  return null;
}
function matchAsk(s) {
  const t = s.toLowerCase();
  if (/ticket|queue|my desk|open|assign|jira/.test(t)) return askById(/mine|my desk/.test(t) ? 'tickets-mine' : 'tickets-open');
  if (/liability|cap/.test(t)) return askById('clause-liability-cap');
  if (/data owner|session data|driver data/.test(t)) return askById('clause-data-ownership');
  if (/uptime|service level|sla/.test(t)) return askById('clause-uptime');
  if (/firmware|sunset|end.of.life|eol/.test(t)) return askById('clause-firmware-sunset');
  if (/auto.?renew|renewal|uplift/.test(t)) return askById('concept-autorenewal');
  if (/termination|convenience|tfc/.test(t)) return askById('concept-termination-convenience');
  if (/revenue share|licence fee|site host/.test(t)) return askById('concept-revenue-share');
  return null;
}

/* ============================== thread bindings ============================== */
function bindThread() {
  const v = $view;
  v.querySelectorAll('[data-perm]').forEach(b => b.onclick = () => answerPerm(b.dataset.perm, b.dataset.v));
  v.querySelectorAll('[data-disc]').forEach(b => b.onclick = () => { const k = b.dataset.disc; S.open[k] = !S.open[k]; render(); });
  v.querySelectorAll('[data-cot]').forEach(b => b.onclick = () => { const k = b.dataset.cot; S.cotOpen[k] = S.cotOpen[k] === false; render(); });
  v.querySelectorAll('[data-src]').forEach(b => b.onclick = () => { S.src = b.dataset.src; render(); });
  v.querySelectorAll('[data-pick-source]').forEach(b => b.onclick = () => {
    const src = b.dataset.pickSource, perm = b.dataset.pickPerm;
    if (perm === 'sharepoint') S.src = src === 'onedrive' ? 'onedrive' : 'sharepoint';
    S.perms[perm] = 'always';
    S.connected[perm] = true;
    S.thread.push({ k: 'user', text: perm === 'sharepoint' ? (src === 'onedrive' ? 'OneDrive' : 'SharePoint') : 'Jira Service Management' });
    startLearning();
    render();
  });
  const oa = document.getElementById('openArt'); if (oa) oa.onclick = () => { S.canvasMax = false; S.canvasClosed = false; render(); };
  const at = document.getElementById('analyseAttach'); if (at) at.onclick = () => analyseAttach();
  v.querySelectorAll('[data-tkt-kind]').forEach(b => b.onclick = () => chooseTicketKind(b.dataset.tktKind));
  v.querySelectorAll('[data-chip]').forEach(b => b.onclick = () => {
    if (b.dataset.chip === 'Open another ticket') return beginQuick('q-newticket', 'Open another ticket');
    submitFree(b.dataset.chip);
  });
}

/* ============================== streaming ============================== */
function _scrollThread() {
  const sc = document.getElementById('threadScroll');
  if (sc) sc.scrollTop = sc.scrollHeight;
}
function streamText(full, done) {
  const turn = { k: 'stream', shown: '', done: false };
  S.thread.push(turn); render(); _scrollThread();
  const words = String(full).split(/(\s+)/);
  let i = 0;
  const tick = () => {
    const step = Math.min(3, words.length - i);
    for (let k = 0; k < step; k++) turn.shown += words[i++];
    render(); _scrollThread();
    if (i < words.length) setTimeout(tick, 55);
    else { turn.done = true; render(); if (done) setTimeout(done, 260); }
  };
  setTimeout(tick, 220);
}

/* ============================== sheet: sources ============================== */
function renderSheet() {
  const host = document.getElementById('sheetHost');
  if (!S.sheet) { setHTML(host, ''); return; }
  const rows = Object.keys(PERMS).map(k => {
    const v = S.perms[k];
    return `<div class="sheet__row"><div class="sheet__r1"><span>${esc(PERMS[k].label)}</span><span class="spacer"></span>
      ${v && v !== 'denied' ? pill('pill--squared pill--xs ' + (v === 'always' ? 'pill--brand' : 'pill--gray'), v === 'always' ? 'Always' : 'This session') : pill('pill--squared pill--xs pill--gray', v === 'denied' ? 'Denied' : 'Not asked')}</div>
      <span class="sm">${esc(PERMS[k].scope)}</span></div>`;
  }).join('');
  const html = `<div class="sheet-bg" id="sheetBg"></div>
    <div class="sheet fade" role="dialog" aria-label="Sources & permissions">
      <div class="sheet__h"><span>Sources & permissions</span><span class="spacer"></span>${btn('btn--icon-sm btn--neutral-tertiary', I['x-close'], 'id="sheetClose" aria-label="Close"')}</div>
      ${rows}
      <div class="sheet__row"><span class="sm">Granted for this session only unless marked Always. Nothing is written back to any source, and revoking takes effect immediately.</span></div>
    </div>`;
  if (host.__html === html) return; setHTML(host, html);
  document.getElementById('sheetBg').onclick = () => { S.sheet = false; render(); };
  document.getElementById('sheetClose').onclick = () => { S.sheet = false; render(); };
}

/* ============================== init ============================== */
function resetApp() {
  Object.assign(S, {
    stage: 'start', ask: null, thread: [], learnStarted: false, learnStep: 0,
    cotOpen: {}, canvasMax: false, canvasClosed: false, open: {}, sheet: false,
    selTicket: null, selIssue: null, renderedTurns: 0, _autoNavCollapsed: false
  });
  $rail.setAttribute('data-state', 'expanded');
  const rt = document.getElementById('railToggle'); if (rt) rt.setAttribute('aria-label', 'Collapse sidebar');
  render();
}
document.getElementById('railSearch').onclick = () => { resetApp(); };
document.getElementById('railToggle').onclick = () => {
  const c = $rail.getAttribute('data-state') === 'collapsed';
  $rail.setAttribute('data-state', c ? 'expanded' : 'collapsed');
  document.getElementById('railToggle').setAttribute('aria-label', c ? 'Collapse sidebar' : 'Expand sidebar');
};
document.getElementById('split').addEventListener('pointerdown', e => {
  const start = e.clientX, rect = $stage.getBoundingClientRect();
  const startW = $view.getBoundingClientRect().width;
  const move = ev => { const w = Math.min(rect.width * 0.6, Math.max(440, startW + (ev.clientX - start))); $stage.style.gridTemplateColumns = Math.round(w) + 'px 0 minmax(0, 1fr)'; };
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
});

window.KnowledgeAgent = { S, render, resetApp, beginAsk, beginQuick, answerPerm, ASKS, QUICK_START, QUICK_ASKS, TICKETS, CLAUSES, CONCEPTS, DEAL, TEAM, ANALYSE_DOC };
render();

})();
