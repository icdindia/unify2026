/* app.js — Template Studio state, render and flow.
   Every UI decision is inherited from prototypes/playbook-studio and
   prototypes/knowledge-agent — see the memory entries. This artefact
   adds three entry journeys and one new artifact canvas composition:
     - CREATE  · composer → question-card interview → template scaffold
     - ATTACH  · + icon → uploaded card → extraction cot → side-by-side
     - EDIT    · library card → intent → source-pick → diff artifact
   Turn kinds used:  user | agent | perm | sourcepick | uploaded |
     interview | steps | findings | draft | attached | edit | stream |
     artifactPending | qprompt
*/

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
  const open = (S.stage === 'draft' || S.stage === 'attached' || S.stage === 'edit') && !S.canvasClosed;
  $stage.setAttribute('data-artifact', open ? 'open' : 'closed');
  $stage.setAttribute('data-expanded', (open && S.canvasMax) ? 'true' : 'false');
  if (!open || S.canvasMax) $stage.style.gridTemplateColumns = '';
  keepScroll('.canvas__body, .ans__scroll', () => {
    setHTML($panelHost, open ? renderCanvas() : '');
    if (open) { renderArtifact(document.getElementById('canvasDoc')); bindCanvas(); }
  });
  renderView();
  renderSheet();
}

/* ============================== rail ============================== */
/* Bespoke filled-document icon for the Template Studio nav item; the shared
   `file-md` glyph reads as an outlined page-corner in the rail, and the user
   asked for a plain filled document. */
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
    item('templates', 'Template Studio', 'templates', '', true) +
    `<span class="main-nav__x-divider" role="separator" data-figma-node="I1731:251990;419:152025"></span>`);

  const AGENTS = [
    ['Knowledge Agent',        false],
    ['Contract Review Agent',  false],
    ['Clause Extraction Agent', false],
    ['Redline Compare Agent',  false]
  ];
  setHTML(document.getElementById('navAgents'), AGENTS.map(([n, cur], ix) =>
    `<button class="main-nav__x-item main-nav__x-item--agent" type="button" aria-current="${cur ? 'page' : 'false'}"
       ${TAG('main-nav', 'Nav_menu/Agent', 'I1731:251990;419:15175' + (ix + 1))}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-agent-avatar main-nav__x-agent-avatar--${ix + 1}">${I['ai-avatar']}</span><span class="main-nav__x-label">${esc(n)}</span></span></button>`).join(''));

  const hist = [];
  if (S.flow) hist.push([shortText(flowTitle()), 'now']);
  S.history.forEach(h => hist.push(h));
  setHTML(document.getElementById('navHistory'), hist.map(([t, m]) =>
    `<button class="main-nav__x-item main-nav__x-item--history" type="button" ${TAG('main-nav', 'Nav_menu/Chat_history', 'I1731:251990;1412:303303')}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-label">${esc(t)}</span></span><span class="main-nav__x-meta">${m}</span></button>`).join(''));

  document.querySelectorAll('#navPrimary [data-nav]').forEach(b => b.onclick = () => {
    const n = b.dataset.nav;
    if (n === 'playbooks') { location.href = (location.pathname.endsWith('/index.html') ? '../playbook-studio/index.html' : './playbook-studio.html'); return; }
    if (['new', 'templates', 'artifacts'].includes(n)) resetApp();
  });
  document.querySelectorAll('#navAgents .main-nav__x-item--agent').forEach(b => {
    const label = (b.querySelector('.main-nav__x-label') || {}).textContent || '';
    if (label.trim() === 'Knowledge Agent') b.onclick = () => { location.href = (location.pathname.endsWith('/index.html') ? '../knowledge-agent/index.html' : './knowledge-agent.html'); };
  });
}

function shortText(t) { return t.length > 34 ? t.slice(0, 32) + '…' : t; }
function flowTitle() {
  const f = S.flow; if (!f) return 'New session';
  if (f.kind === 'create')  return 'New template — ' + (templateById(f.family)?.name || 'draft');
  if (f.kind === 'attach')  return 'Extract · ' + ATTACH_DOC.name.replace(/\.[a-z]+$/i, '');
  if (f.kind === 'edit')    return EDIT_INTENTS[f.intent].ask;
  return 'New session';
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
  const parts = ['ChargePoint Legal', 'Template Studio', S.flow ? shortenAsk(flowTitle()) : 'New session'];
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
function landingPage() {
  const docIcon = `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 2h7l5 5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M11 2v5h5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const row = (t) => `<div class="recent-row" data-figma-node="905:302681">
    <span class="recent-row__icon">${docIcon}</span>
    <span class="recent-row__body">
      <span class="recent-row__title">${esc(t.name)}</span>
      <span class="recent-row__meta">${esc(t.meta)}</span>
    </span>
    ${btn('btn--sm btn--neutral-secondary', label('Open'), `data-recent="${esc(t.id)}"`)}
  </div>`;

  return `<div class="landing fade"><div class="landing__col">
    <header class="landing__head">
      <h1 class="page-title">Templates</h1>
      ${btn('btn--md btn--brand-primary', I['plus'] + label('New template'), 'id="newTpl"')}
    </header>
    <section class="landing__section landing__section--compose">
      <h2 class="section-title">Create a new <em>Template</em></h2>
      ${composerHTML('Type "create a template", or describe what you need…', 'home')}
    </section>
    <section class="landing__section">
      <h2 class="section-title">Recent templates</h2>
      <div class="recent-list">${RECENT_TEMPLATES.map(row).join('')}</div>
    </section>
  </div></div>`;
}

function bindLanding() {
  const nt = document.getElementById('newTpl');
  if (nt) nt.onclick = () => beginCreate('msa');
  $view.querySelectorAll('[data-recent]').forEach(b => b.onclick = () => {
    const t = RECENT_TEMPLATES.find(x => x.id === b.dataset.recent);
    if (t) beginEdit(t.intent);
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
const AVATAR = `<span class="turn__avatar" aria-hidden="true">${I['ai-avatar']}</span>`;

function renderTurn(t, ix, isNew) {
  const fade = isNew ? 'fade' : '';
  if (t.k === 'user')             return `<div class="turn turn--user ${fade}"><div class="bubble"><span>${esc(t.text)}</span></div></div>`;
  if (t.k === 'agent')            return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}</div>`;
  if (t.k === 'perm')             return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(renderPerm(t.id))}</div>`;
  if (t.k === 'sourcepick')       return `<div class="turn turn--agent ${fade}" data-k="sourcepick">${cards(renderSourcePick(t.perm))}</div>`;
  if (t.k === 'uploaded')         return `<div class="turn turn--agent ${fade}" data-k="uploaded">${AVATAR}${rich(t.lead)}${cards(renderUploadedCard())}</div>`;
  if (t.k === 'dropzone')         return `<div class="turn turn--agent ${fade}" data-k="dropzone">${cards(renderDropzone())}</div>`;
  if (t.k === 'attached-files')   return `<div class="turn turn--agent ${fade}" data-k="attached-files">${cards(renderAttachedFiles(t.files))}</div>`;
  if (t.k === 'qprompt')          return `<div class="turn turn--agent ${fade} turn--qprompt">${AVATAR}<div class="qprompt"><span class="qprompt__q">${esc(t.q)}</span><span class="qprompt__a">${esc(t.a)}</span></div></div>`;
  if (t.k === 'steps')            return `<div class="turn turn--agent ${fade}">${renderSteps()}</div>`;
  if (t.k === 'findings')         return `<div class="turn turn--agent ${fade}">${renderFindings()}</div>`;
  if (t.k === 'draft')            return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}${cards(artifactCard())}</div>`;
  if (t.k === 'attached')         return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}${cards(artifactCard())}</div>`;
  if (t.k === 'edit')             return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}${cards(artifactCard())}</div>`;
  if (t.k === 'artifactPending')  return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(pendingArtifactCard())}</div>`;
  if (t.k === 'stream') {
    const caret = t.done ? '' : '<span class="stream-caret" aria-hidden="true"></span>';
    return `<div class="turn turn--agent ${fade}">${AVATAR}<div class="richtext"><p>${t.shown || ''}${caret}</p></div></div>`;
  }
  return '';
}

/* ============================== inline artifact card ============================== */
function artifactTitle() {
  const f = S.flow; if (!f) return 'Template';
  if (f.kind === 'create') {
    const famKey = S.answers?.family || 'msa';
    const famName = FAMILY_NAME[famKey] || (TEMPLATE_SCAFFOLD[f.family]?.name) || 'Template';
    return 'CP ' + famName + ' Template 2025';
  }
  if (f.kind === 'attach') return 'Counter-party template · side-by-side';
  const e = EDIT_INTENTS[f.intent]; return (templateById(e.tid).name) + ' — ' + e.section;
}
function currentPosture() { return S.answers?.posture === 'market' ? 'market' : 'tighten'; }
function artifactSub() {
  const f = S.flow; if (!f) return '';
  if (f.kind === 'create') { const s = TEMPLATE_SCAFFOLD[f.family]; return s.v; }
  if (f.kind === 'attach') return `${ATTACH_DOC.clauses} extracted clauses · ${ATTACH_DOC.words.toLocaleString()} words · ${ATTACH_DOC.name}`;
  const e = EDIT_INTENTS[f.intent]; return `Amendment · ${e.section} · ${e.scope}`;
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
  return `<div class="inline-artifact-card inline-artifact-card--pending" role="status" aria-live="polite" aria-label="Building template">
    <span class="inline-artifact-card__main">
      <span class="pending-spinner" aria-hidden="true"></span>
      <span class="inline-artifact-card__text">
        <span class="inline-artifact-card__title-row"><span class="inline-artifact-card__title">Building ${esc(artifactTitle())}</span></span>
        <span class="inline-artifact-card__sub">${esc(pendingSub())}</span>
      </span>
    </span>
  </div>`;
}
function pendingSub() {
  const f = S.flow; if (!f) return '';
  if (f.kind === 'create') return 'Laying out the section list, binding standard clauses to each rung of the ladder…';
  if (f.kind === 'attach') return 'Extracting the counter-party clauses, matching each against our baseline…';
  return 'Redlining the clause, writing the ladder change, and testing against recent redlines…';
}

/* ============================== permission cards ============================== */
function renderPerm(id) {
  const p = PERMS[id], open = S.open['perm' + id], st = S.perms[id];
  if (id === 'drive') {
    return `<div class="perm">
      <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
        <div class="perm__body"><span class="perm__title">${esc(p.name)}</span><span class="perm__scope">${esc(p.scope)}</span></div></div>
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
  /* upload — inline single-source card. */
  return `<div class="perm">
    <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
      <div class="perm__body"><span class="perm__title">${esc(p.name)}</span><span class="perm__scope">${esc(p.scope)}</span></div></div>
    ${open ? permDetail(id, p) : ''}
    ${st ? `<div class="perm__granted">${ICON.tick}${esc(p.label)} — held for this session</div>`
      : `<div class="perm__acts">
        <button class="disclose" type="button" data-disc="perm${id}">${open ? 'Hide detail' : 'What I will read'}</button>
        <span class="spacer"></span>
        ${btn('btn--sm btn--neutral-tertiary', label("Don't allow"), `data-perm="${id}" data-v="denied"`)}
        ${btn('btn--sm btn--brand-primary', label('Attach the document'), `data-perm="${id}" data-v="always"`)}
      </div>`}
  </div>`;
}
function permDetail(id, p) {
  return `<div class="perm__detail"><span class="label">What I will read</span>
    <ul>${p.what.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
    <span class="perm__never">${esc(p.never)}</span></div>`;
}
function renderSourcePick(perm) {
  /* Two-tone SharePoint tiles + paperclip glyphs baked in here so the source
     picker matches the artifact-header colour rhythm without pulling a whole
     Microsoft-icon set into the prototype. */
  const spIcon = '<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="#28a8ea"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1" fill="#28a8ea" opacity="0.55"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1" fill="#28a8ea" opacity="0.55"/><rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="#28a8ea"/></svg>';
  const clipIcon = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 5.5 6 11a2 2 0 0 0 2.83 2.83l6-6a3.5 3.5 0 0 0-4.95-4.95L4 8.76a5 5 0 0 0 7.07 7.07"/></svg>';
  const rows = perm === 'upload'
    ? [['upload', clipIcon, 'Attach files directly', 'Upload PDF or DOCX from your computer']]
    : [
        ['sharepoint', spIcon,   'SharePoint',             'Legal › Contracts — pick one or more files'],
        ['upload',     clipIcon, 'Attach files directly',  'Upload PDF or DOCX from your computer']
      ];
  const row = (id, icon, title, sub) => `<div class="source-picker__row" data-pick-source="${id}" data-pick-perm="${perm}" role="button" tabindex="0">
    <span class="source-picker__row-icon source-picker__row-icon--${id}">${icon}</span>
    <span class="source-picker__row-text"><span class="source-picker__row-title">${esc(title)}</span><span class="source-picker__row-sub">${esc(sub)}</span></span>
  </div>`;
  return `<div class="source-picker">
    <div class="source-picker__title">Choose a document source</div>
    ${rows.map(r => row(...r)).join('<span class="source-picker__rule" role="separator" aria-hidden="true"></span>')}
  </div>`;
}

/* ============================== uploaded doc card ============================== */
function renderUploadedCard() {
  return `<div class="upcard">
    <div class="upcard__row">
      <span class="upcard__icon">${ICON.docx}</span>
      <div class="upcard__body">
        <span class="upcard__title">${esc(ATTACH_DOC.name)}</span>
        <span class="upcard__meta">${esc(ATTACH_DOC.size)} · ${esc(ATTACH_DOC.from)}</span>
      </div>
      ${pill('pill--squared pill--xs pill--brand', 'Attached')}
    </div>
    <div class="upcard__stat">
      <span><span class="label">Words</span><span class="mono">${ATTACH_DOC.words.toLocaleString()}</span></span>
      <span><span class="label">Clauses detected</span><span class="mono">${ATTACH_DOC.clauses}</span></span>
      <span><span class="label">From</span><span>${esc(ATTACH_DOC.who)}</span></span>
    </div>
  </div>`;
}

/* ---- dropzone + attached files (Attach files directly flow) ---------------
   Dropzone is a dashed-border block prompting the user to add files. Clicking
   it (or the + icon in the composer while in the attach-waiting state) fakes
   an upload of the first three SP_FILES and proceeds into the interview. */
function renderDropzone() {
  const clipIcon = '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 7 8 13a2.5 2.5 0 0 0 3.54 3.54l7.5-7.5a4.5 4.5 0 0 0-6.36-6.36L5 11.36a6.5 6.5 0 0 0 9.19 9.19"/></svg>';
  return `<button class="dropzone" type="button" id="dropzoneBtn" aria-label="Add files">
    <span class="dropzone__icon" aria-hidden="true">${clipIcon}</span>
    <span class="dropzone__body">
      <span class="dropzone__label">Click <strong>+</strong> in the input below, or drop files here</span>
      <span class="dropzone__hint">PDF · DOCX · up to 20 files</span>
    </span>
  </button>`;
}
function renderAttachedFiles(files) {
  const docIcon = '<svg viewBox="0 0 16 16" width="14" height="16" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"><path d="M2 1h6l4 4v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M8 1v4h4"/></svg>';
  return `<div class="attached-files">
    ${files.map(f => `<div class="attached-file">
      <span class="attached-file__icon" aria-hidden="true">${docIcon}</span>
      <span class="attached-file__body">
        <span class="attached-file__name mono">${esc(f.name)}</span>
        <span class="attached-file__meta">${esc(f.meta)}</span>
      </span>
      ${pill('pill--squared pill--xs pill--' + (f.tagWarn ? 'warning' : 'gray'), esc(f.tag))}
    </div>`).join('')}
  </div>`;
}

function simulateAttachUpload() {
  /* Ignore if we're not sitting on a dropzone waiting for input. */
  const ix = S.thread.findIndex(x => x.k === 'dropzone');
  if (ix < 0) return;
  const files = SP_FILES.slice(0, 3);
  S.thread.splice(ix, 1);
  S.thread.push({ k: 'user', text: `Attached ${files.length} files` });
  S.thread.push({ k: 'attached-files', files });
  S.thread.push({ k: 'agent', html: rich(
    `Read ${files.length} documents. Before I draft the template I need answers to <strong>2 questions</strong>.`,
    'Agreement type sets the clause library. Language posture controls how every clause is drafted.'
  ) });
  if (S.flow?.kind === 'create') startInterview();
  else render();
}

/* ============================== interview (create) ==============================
   Question card matches playbook-studio verbatim: rendered in the dock (not the
   thread), rows carry a numbered badge + primary label + optional dash-joined
   secondary, a rule between rows, and a pencil-badge free-text row with Skip. */
function renderInterviewCard() {
  const q = CREATE_QUESTIONS[S.qi]; if (!q) return '';
  const M = CREATE_QUESTIONS.length;
  const canPrev = S.qi > 0, canNext = S.qi < M - 1;
  return `<div class="question-card" ${TAG('question-card', 'Copilot_Question Card', '875:165670')}>
    <div class="question-card__top">
      <div class="question-card__lead"><div class="question-card__q"><span class="question-card__question">${esc(q.q)}</span>${q.ev ? `<span class="question-card__evidence">${esc(q.ev)}</span>` : ''}</div></div>
      <div class="question-card__nav">
        ${btn('btn--icon-sm btn--neutral-tertiary', I['chevron-left'], `id="qPrev" aria-label="Previous question"${canPrev ? '' : ' disabled'}`)}
        <span class="question-card__count">${S.qi + 1} of ${M}</span>
        ${btn('btn--icon-sm btn--neutral-tertiary', I['chevron-right'], `id="qNext" aria-label="Next question"${canNext ? '' : ' disabled'}`)}
      </div>
      ${btn('btn--icon-sm btn--neutral-tertiary question-card__close', I['x-close'], 'id="qClose" aria-label="Skip the interview" title="Skip the remaining questions"')}
    </div>
    <div class="question-card__body">
      ${q.opts.map((o, i) => `<button class="question-card__option" type="button" data-opt="${i}">
        <span class="question-card__badge">${i + 1}</span>
        <span class="question-card__text">${esc(o.b)}${o.s ? ' — ' + esc(o.s) : ''}</span>
        <span class="question-card__arrow">${I['arrow-right']}</span>
      </button>${i < q.opts.length - 1 ? '<span class="question-card__rule"></span>' : ''}`).join('')}
      <span class="question-card__rule"></span>
      <div class="question-card__free">
        <span class="question-card__free-in">
          <span class="question-card__badge question-card__badge--edit">${I['edit']}</span>
          <input id="qFree" type="text" placeholder="${esc(q.free || 'Describe the position you want')}" aria-label="Answer in your own words">
        </span>
        ${btn('btn--xs btn--neutral-secondary', label('Skip'), 'data-opt="skip"')}
      </div>
    </div>
  </div>`;
}

/* ============================== steps / findings ============================== */
function stepsFor() {
  const f = S.flow; if (!f) return [];
  if (f.kind === 'create') {
    const tid = f.family, name = TEMPLATES.find(t=>t.id===tid)?.name || 'template';
    return [
      ['search-md-12', 'Reading the standard baseline', 'Read the standard baseline', () => [`${TEMPLATE_SCAFFOLD.msa.sections.length} sections`, `${name}`, 'SharePoint › Legal — Contracts']],
      ['book-open-01', 'Pulling every red line you named', 'Pulled the red lines', () => [`${(S.answers.redlines||[]).length || 3} red lines held`]],
      ['book-open-01', 'Assembling the ladder for each clause', 'Assembled the ladder for each clause', () => [`${TEMPLATE_SCAFFOLD.msa.corpus.clauses} clause instances read`]],
      ['search-md-12', 'Naming the approvers on each rung', 'Named the approvers on each rung', () => [`${TEMPLATE_SCAFFOLD.msa.sections.length} sections written`]]
    ];
  }
  if (f.kind === 'attach') {
    return [
      ['search-md-12', 'Reading the counter-party document', 'Read the counter-party document', () => [`${ATTACH_DOC.words.toLocaleString()} words`, ATTACH_DOC.name]],
      ['book-open-01', 'Detecting clause boundaries', 'Detected clause boundaries', () => [`${ATTACH_DOC.clauses} clauses detected`]],
      ['book-open-01', 'Matching each clause against our baseline', 'Matched each against our baseline', () => [`${ATTACH_DOC.extracted.length} material mismatches`]],
      ['search-md-12', 'Writing a recommendation per clause', 'Wrote a recommendation per clause', () => [`${ATTACH_DOC.extracted.filter(x=>x.partyRisk==='critical').length} critical · ${ATTACH_DOC.extracted.filter(x=>x.partyRisk==='elevated').length} elevated`]]
    ];
  }
  const e = EDIT_INTENTS[f.intent];
  return [
    ['search-md-12', 'Opening the executed corpus', 'Opened the executed corpus', () => [`${e.impact.contracts.split('·')[0].trim()}`, 'SharePoint › Legal — Contracts']],
    ['book-open-01', 'Reading how this clause has settled', 'Read how this clause has settled', () => [`${e.section}`]],
    ['book-open-01', 'Writing the amended language', 'Wrote the amended language', () => [`${e.diff.length} diff entries`]],
    ['search-md-12', 'Testing against recent redlines', 'Tested against recent redlines', () => [`${e.impact.testSet}`]]
  ];
}

function renderSteps() {
  const steps = stepsFor();
  const rows = steps.map((st, i) => {
    const done = i < S.learnStep, now = i === S.learnStep;
    if (!done && !now) return '';
    return cotStep(st[0], done ? st[2] : st[1], { rich: true, results: done ? st[3]() : null });
  }).join('') + (S.learnStep >= steps.length ? cotStep('check-circle', 'Done', { done: true }) : '');
  return cot('learn', rows);
}

function renderFindings() {
  const f = S.flow;
  if (f.kind === 'create') {
    const s = TEMPLATE_SCAFFOLD.msa;
    const famName = FAMILY_NAME[S.answers?.family] || 'Template';
    const postureName = currentPosture() === 'market' ? 'Keep market standard' : 'Tighten for ChargePoint';
    const tightCount = s.sections.filter(x => x.tightenable).length;
    const answers = CREATE_QUESTIONS.map(q => [q.q, humanAnswer(q)]);
    return cards(citationCard('Your answers', answers), citationCard('How I will build this template', [
      ['Agreement type',       famName],
      ['Posture',              postureName],
      ['Section list',         `${s.sections.length} sections carried forward${currentPosture() === 'tighten' ? ` · ${tightCount} flagged to tighten` : ''}`],
      ['Corpus reference',     `${s.corpus.docs} ${s.corpus.label} · ${s.corpus.parties} counterparties`]
    ]));
  }
  if (f.kind === 'attach') {
    const crit = ATTACH_DOC.extracted.filter(x => x.partyRisk === 'critical').length;
    const elev = ATTACH_DOC.extracted.filter(x => x.partyRisk === 'elevated').length;
    return cards(citationCard('What I found', [
      ['Read',                     `${ATTACH_DOC.name} · ${ATTACH_DOC.words.toLocaleString()} words`],
      ['Clauses detected',         `${ATTACH_DOC.clauses} clauses; ${ATTACH_DOC.extracted.length} material against our baseline`],
      ['Critical mismatches',      `${crit} — uncapped direct damages, data ownership, TFC, firmware sunset`],
      ['Elevated mismatches',      `${elev} — uptime measurement, sub-processor consent, audit scope`],
      ['Where we already have language', `${ATTACH_DOC.extracted.filter(x=>x.cpt==='CP Template').length} clauses — ready to redline in place`]
    ]));
  }
  const e = EDIT_INTENTS[f.intent];
  return cards(citationCard('What I found', [
    ['Section',                  `${e.section}`],
    ['Corpus behind the change', `${e.scope}`],
    ['Diff summary',             `${e.diff.length} entries — ${e.diff.filter(d => d[0]==='Add').length} additions, ${e.diff.filter(d => d[0]==='Remove').length} removals`],
    ['Ladder change',            `${e.ladderChanges.length} tiers touched`],
    ['Applied against',          e.impact.testSet]
  ]));
}
function humanAnswer(q) {
  const a = S.answers[q.id]; if (!a) return 'Skipped';
  if (Array.isArray(a)) return a.map(v => {
    const o = q.opts.find(o=>o.v===v);
    return o ? o.b + (o.s ? ' — ' + o.s : '') : v;
  }).join(' · ');
  const opt = q.opts.find(o => o.v === a);
  return opt ? opt.b + (opt.s ? ' — ' + opt.s : '') : a;
}

/* ============================== artifact canvas ============================== */
function docId() {
  const f = S.flow; if (!f) return 'TS00000';
  const base = f.kind === 'create' ? 401 : f.kind === 'attach' ? 502 : 610;
  return 'TS' + String(base + Math.floor((Date.now() / 1000) % 89)).padStart(5, '0');
}
function renderCanvas() {
  const isDraft = S.flow?.kind === 'create';
  return `<div class="canvas" data-figma-node="1809:488550">
    <header class="artifact-header" ${TAG('artifact-header', 'Arifact Header', '3838:245967')}>
      <div class="artifact-header__content">
        <div class="artifact-header__left">
          <span class="artifact-header__icon">${I['file-md']}</span>
          <button class="artifact-header__title" type="button" title="Rename"><span class="artifact-header__title-text">${esc(artifactTitle())}</span></button>
          ${isDraft ? pill('pill--squared pill--xs ' + (currentPosture() === 'market' ? 'pill--gray mono' : 'pill--brand'), currentPosture() === 'market' ? 'Market standard' : 'Tightened') : pill('pill--squared pill--xs pill--gray mono', docId())}
        </div>
        <div class="artifact-header__actions">
          <div class="artifact-header__group"><button class="artifact-header__version" type="button" data-tip="Version history">v1.0${I['chevron-down-sm']}</button></div>
          <div class="artifact-header__group">
            ${btn('btn--xs btn--neutral-secondary artifact-header__publish', I['download-01'] + label('Download'), 'id="dlBtn"')}
            ${btn('btn--xs btn--brand-primary artifact-header__publish', I['book'] + label('Publish'), 'id="pubBtn"')}
          </div>
          <div class="artifact-header__group artifact-header__group--tight">
            ${btn('btn--icon btn--neutral-tertiary', I['maximize-01'], `id="maxBtn" aria-label="${S.canvasMax ? 'Show the chat' : 'Expand'}" aria-pressed="${S.canvasMax ? 'true' : 'false'}"`)}
            ${btn('btn--icon btn--neutral-tertiary', I['x-close'], 'id="closeArt" aria-label="Close"')}
          </div>
        </div>
      </div>
    </header>
    <div class="canvas__body" id="canvasBody"><div class="doc" id="canvasDoc"></div></div>
  </div>`;
}

const STATUS = {
  standard: ['pill--squared pill--xs pill--gray',    'Standard'],
  tighten:  ['pill--squared pill--xs pill--warning', 'Tighten'],
  custom:   ['pill--squared pill--xs pill--brand',   'Custom'],
  new:      ['pill--squared pill--xs pill--brand',   'New']
};

function renderArtifact($doc) {
  const f = S.flow;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const meta = (rows) => `<div class="doc__head"><div class="doc__meta" data-figma-node="1809:488589">
    ${rows.map(([l, v]) => `<span class="doc__meta-item"><span class="label">${esc(l)}</span><span class="doc__meta-v">${v}</span></span>`).join('')}
  </div></div>`;

  if (f.kind === 'create') {
    const s = TEMPLATE_SCAFFOLD.msa;
    $doc.innerHTML = renderDraftBody(s);
    return;
  }
  if (f.kind === 'attach') {
    $doc.innerHTML = meta([
      ['Source doc',   esc(ATTACH_DOC.name)],
      ['From',         esc(ATTACH_DOC.who)],
      ['Words',        ATTACH_DOC.words.toLocaleString()],
      ['Clauses',      `${ATTACH_DOC.clauses} detected · ${ATTACH_DOC.extracted.length} material`],
      ['Generated',    today]
    ]) + renderAttachBody();
    return;
  }
  const e = EDIT_INTENTS[f.intent];
  $doc.innerHTML = meta([
    ['Template',     esc(templateById(e.tid).name)],
    ['Clause',       esc(e.section)],
    ['Version',      `${templateById(e.tid).v} → +1 amendment`],
    ['Scope',        esc(e.scope)],
    ['Generated',    today]
  ]) + renderEditBody(e);
}

/* ---- create → draft template body ----
   Single-column document list: each section is a stacked block with a numbered
   badge, section title, per-section posture pill, an eyebrow line and the
   operative-language paragraph. Posture is decided globally by S.answers.posture
   ('market' vs 'tighten'); sections with `tightenable:true` differ between the
   two, other sections use the market body in both modes. */
function renderDraftBody(s) {
  const posture = currentPosture();
  /* The four load-bearing sections shown when the interview picked Market
     standard. Preserved as the narrow-scope view even after a follow-up
     "tighten the agreement" — a user who chose four clauses shouldn't
     suddenly be handed the full twelve. */
  const MARKET_SECTIONS = ['definitions', 'licence', 'liability', 'general'];
  const narrow = S.narrowScope === true;
  const shown = narrow
    ? s.sections.filter(x => MARKET_SECTIONS.includes(x.key))
    : s.sections;
  return `<div class="docdoc">
    ${shown.map(sec => {
      const isJust  = S.justTightened === sec.key;
      const isTight = posture === 'tighten' && (sec.tightenable || S.tightenAll || isJust);
      const flavour = isJust ? 'just' : (isTight ? 'tightened' : 'market');
      const pillCls = isTight ? 'pill--squared pill--xs pill--brand' : 'pill--squared pill--xs pill--gray mono';
      const pillTxt = isTight ? 'Tightened' : 'Market';
      const eyebrow = isJust ? 'Just tightened' : (isTight ? 'Tightened — CP protective' : 'Market standard');
      const body    = isTight ? sec.bodyTighten : sec.bodyMarket;
      /* Title + operative language are inline-editable — click to edit, blur
         to persist back into the scaffold so a re-render keeps the change. */
      return `<section class="doc-sec ${isJust ? 'doc-sec--just' : ''}" id="sec-${sec.key}">
        <div class="doc-sec__row">
          <span class="doc-sec__num mono">${esc(sec.n)}</span>
          <h3 class="doc-sec__title" contenteditable="true" spellcheck="true" data-edit-key="${sec.key}" data-edit-field="name">${esc(sec.name)}</h3>
          <span class="doc-sec__pill">${pill(pillCls, pillTxt)}</span>
        </div>
        <div class="doc-sec__body">
          <span class="doc-sec__eyebrow doc-sec__eyebrow--${flavour}">${eyebrow}</span>
          <p class="doc-sec__text" contenteditable="true" spellcheck="true" data-edit-key="${sec.key}" data-edit-field="${isTight ? 'bodyTighten' : 'bodyMarket'}">${esc(body)}</p>
        </div>
      </section>`;
    }).join('')}
  </div>`;
}
function renderSectionDetail(sec) {
  const scaffoldNotes = {
    licence:  ['Grants Customer a non-exclusive, non-transferable licence to access and use the Services during the Subscription Term.',
               'Additions from your red-lines: non-sublicensable, wholly-owned Affiliates only, internal use, reservation of rights.'],
    data:     ['ChargePoint owns Service Data. Customer holds a perpetual, royalty-free licence to data from its own stations.',
               'Public-sector rider inverts this split.'],
    liability:['Aggregate cap at 12 months of fees, mutual. Standard carve-outs: IP indemnity, confidentiality, gross negligence.',
               'Ladder carries a 2× fees tier for ACV > $2M and a Security Incident sub-cap.'],
    term:     ['Five-year initial term. Auto-renewal one-year periods on 60-day notice.',
               'CPI-U + 3% capped at 7%. Three named exceptions: public sector, EEA, Order-Form opt-out.'],
    tfc:      ['No termination for convenience in the initial term (commercial).',
               'Cause-only termination with 30-day cure (10 for payment).'],
    sla:      ['97% uptime per port, per month. Excused Downtime: customer-caused, utility, network.',
               'Credits are the sole remedy for a missed month.'],
    warranty: ['Firmware and security updates for 5 years from End-of-Sale.',
               'Standard hardware warranty per model. Portability handled through documented export.'],
    audit:    ['One audit per calendar year, 30 days notice, costs on requesting party.',
               'Scope limited to Services under this Agreement.']
  };
  const notes = scaffoldNotes[sec.key] || ['Baseline clause · inherited from the standard template.'];
  const ladderPreview = sec.status === 'tighten'
    ? EDIT_INTENTS[sec.key === 'licence' ? 'msa:licence' : (sec.key === 'term' ? 'msa:renewal' : 'msa:licence')].ladderChanges
    : null;
  return `<div class="pdet">
    <div class="pdet__head"><div class="pdet__in pdet__head-in">
      <h3 class="pdet__title">§${esc(sec.n)} · ${esc(sec.name)}</h3>
      <span class="spacer"></span>
      ${pill(STATUS[sec.status][0], STATUS[sec.status][1])}
    </div></div>
    <div class="pdet__scroll"><div class="pdet__in pdet__body">
      <div class="pdet__block"><span class="label">Operative language</span>${notes.map(n => `<p class="pdet__about">${esc(n)}</p>`).join('')}</div>
      ${ladderPreview ? `<div class="pdet__block">
        <span class="pdet__h">Ladder change</span>
        <p class="sm">Your red-lines shifted this ladder — here is what changed.</p>
        <div class="ladder-changes">${ladderPreview.map(lc => `<div class="ladder-changes__row"><span class="ladder-changes__tier">${esc(lc.tier)}</span><span class="ladder-changes__change">${esc(lc.change)}</span></div>`).join('')}</div>
      </div>` : ''}
      <div class="pdet__block pdet__actions">
        ${btn('btn--sm btn--neutral-secondary', I['edit'] + label('Edit clause'), '')}
        ${btn('btn--sm btn--brand-primary', I['arrow-up'] + label('Send for review'), '')}
      </div>
    </div></div>
  </div>`;
}
function bindDraft($doc) {
  $doc.querySelectorAll('[data-section]').forEach(b => b.onclick = () => { S.selSection = b.dataset.section; render(); });
}

/* ---- attach → side-by-side body ---- */
function renderAttachBody() {
  return `<div class="ans">
    <div class="ans__scroll"><div class="ans__col">
      <section class="ans__section">
        <h2 class="ans__h2">The short read</h2>
        <p class="ans__lead">${ATTACH_DOC.extracted.filter(x=>x.partyRisk==='critical').length} critical redlines · ${ATTACH_DOC.extracted.filter(x=>x.partyRisk==='elevated').length} elevated. Every one has language we already carry — this is a redline, not a rewrite.</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Side-by-side · counter-party against our baseline</h2>
        <div class="side">
          ${ATTACH_DOC.extracted.map(x => `<div class="side__row side__row--${esc(x.partyRisk)}">
            <div class="side__head">
              <span class="side__section">${esc(x.section)}</span>
              ${pill(STATUS[x.cpt==='CP Template'?'standard':'new'][0], esc(x.cpt))}
              ${pill('pill--squared pill--xs pill--' + (x.partyRisk==='critical'?'warning':'gray'), x.partyRisk === 'critical' ? 'Critical' : 'Elevated')}
            </div>
            <div class="side__cols">
              <div class="side__col">
                <span class="label">Our baseline</span>
                <p class="side__body">${esc(x.cp)}</p>
              </div>
              <div class="side__col">
                <span class="label">Counter-party</span>
                <p class="side__body">${esc(x.party)}</p>
              </div>
            </div>
            <div class="side__rec"><span class="label">Recommendation</span><p class="side__body">${esc(x.recommend)}</p></div>
          </div>`).join('')}
        </div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Where we already have language</h2>
        <p class="ans__body">Every ${ATTACH_DOC.extracted.filter(x=>x.cpt==='CP Template').length} of the ${ATTACH_DOC.extracted.length} material mismatches maps to an existing CP template clause. Only firmware sunset (§7 · §5) needs new language — the ladder is otherwise in place.</p>
      </section>
    </div></div>
  </div>`;
}

/* ---- edit → diff body ---- */
function renderEditBody(e) {
  return `<div class="ans">
    <div class="ans__scroll"><div class="ans__col">
      <section class="ans__section">
        <h2 class="ans__h2">Why this edit</h2>
        <p class="ans__lead">${esc(e.lead)}</p>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Before → After</h2>
        <div class="diff">
          <div class="diff__row diff__row--before">
            <span class="label">Before · ${esc(templateById(e.tid).v)}</span>
            <p class="diff__body">${esc(e.before)}</p>
          </div>
          <div class="diff__row diff__row--after">
            <span class="label">After · draft</span>
            <p class="diff__body">${esc(e.after)}</p>
          </div>
        </div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">What changed, line by line</h2>
        <div class="diff-list">
          ${e.diff.map(([op, txt]) => `<div class="diff-list__row diff-list__row--${op.toLowerCase()}"><span class="diff-list__op">${esc(op)}</span><span class="diff-list__txt">${esc(txt)}</span></div>`).join('')}
        </div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Ladder — what shifts</h2>
        <div class="ladder-changes">${e.ladderChanges.map(lc => `<div class="ladder-changes__row"><span class="ladder-changes__tier">${esc(lc.tier)}</span><span class="ladder-changes__change">${esc(lc.change)}</span></div>`).join('')}</div>
      </section>
      <section class="ans__section">
        <h2 class="ans__h2">Impact</h2>
        <div class="impact">
          <div class="impact__row"><span class="label">Applies to</span><span class="impact__v">${esc(e.impact.contracts)}</span></div>
          <div class="impact__row"><span class="label">Approvers</span><span class="impact__v">${esc(e.impact.approvers)}</span></div>
          <div class="impact__row"><span class="label">Test set</span><span class="impact__v">${esc(e.impact.testSet)}</span></div>
        </div>
      </section>
    </div></div>
  </div>`;
}

function bindCanvas() {
  const mx = document.getElementById('maxBtn'); if (mx) mx.onclick = () => { S.canvasMax = !S.canvasMax; render(); };
  const cl = document.getElementById('closeArt'); if (cl) cl.onclick = () => { S.canvasMax = false; S.canvasClosed = true; render(); };
  const dl = document.getElementById('dlBtn'); if (dl) dl.onclick = () => { dl.setAttribute('data-tip', 'Preparing the document…'); };
  const ad = document.getElementById('addBtn'); if (ad) ad.onclick = () => { ad.querySelector('.btn__label').textContent = 'Added from library'; ad.disabled = true; };
  const pb = document.getElementById('pubBtn'); if (pb) pb.onclick = () => { pb.querySelector('.btn__label').textContent = 'Published'; pb.disabled = true; };
  const sb = document.getElementById('srcBtn'); if (sb) sb.onclick = () => { S.sheet = 'perms'; render(); };
  /* Inline-editable section titles and bodies — persist edits back into the
     scaffold so a re-render (theme toggle, resize, follow-up) keeps them. */
  document.querySelectorAll('[data-edit-key]').forEach(el => {
    el.onblur = () => {
      const sec = TEMPLATE_SCAFFOLD.msa.sections.find(x => x.key === el.dataset.editKey);
      if (!sec) return;
      const next = el.textContent.trim();
      if (next && next !== sec[el.dataset.editField]) sec[el.dataset.editField] = next;
    };
    el.onkeydown = e => {
      /* Enter without shift confirms the edit for the title (single-line);
         paragraphs keep line breaks. Escape reverts to the stored value. */
      if (e.key === 'Enter' && el.dataset.editField === 'name' && !e.shiftKey) { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') {
        const sec = TEMPLATE_SCAFFOLD.msa.sections.find(x => x.key === el.dataset.editKey);
        if (sec) el.textContent = sec[el.dataset.editField] || '';
        el.blur();
      }
    };
  });
}

/* ============================== dock: composer ============================== */
function composerExpandedHTML(ph, key) {
  return `<div class="copilot-input copilot-input--expanded" ${TAG('copilot-input', 'Copilot desktop Input Box', '5771:489155')}>
    <div class="copilot-input__bar">
      <div class="copilot-input__message"><textarea id="ta-${key}" rows="1" placeholder="${esc(ph)}" aria-label="Ask the template studio"></textarea></div>
      <div class="copilot-input__action-bar">
        <div class="copilot-input__wrap"><button class="copilot-input__btn" type="button" id="clip-${key}" title="Attach a counter-party document" aria-label="Attach a counter-party document">${I['plus']}</button></div>
        <div class="copilot-input__actions">
          <button class="copilot-input__action" type="button" aria-label="Model">${I['openai']}</button>
          <button class="copilot-input__action" type="button" aria-label="Dictate">${I['microphone-01']}</button>
          <button class="copilot-input__action copilot-input__action--send" type="button" id="send-${key}" aria-label="Send">${I['arrow-up']}</button>
        </div>
      </div>
    </div></div>`;
}
function composerHTML(ph, key) {
  if (key === 'home') return composerExpandedHTML(ph, key);
  const inner = `<div class="copilot-input" ${TAG('copilot-input', 'Copilot desktop Input Box', '5563:230560')}>
    <div class="copilot-input__bar">
      <div class="copilot-input__left">
        <div class="copilot-input__wrap">
          <button class="copilot-input__btn" type="button" id="clip-${key}" title="Attach a counter-party document" aria-label="Attach a counter-party document">${I['plus']}</button>
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
        <button class="copilot-input__action" type="button" id="send-${key}" aria-label="Voice mode">${I['voice-mode']}</button>
      </div>
    </div></div>`;
  return `<div class="copilot-input-frame" data-figma-node="5975:416348">${inner}</div>`;
}
function anySrc() { return Object.values(S.connected).some(Boolean); }
function bindComposer(key) {
  const ta = document.getElementById('ta-' + key);
  if (ta) {
    ta.oninput = () => {
      /* Home composer: pressing 'c' from an empty field expands into the
         canned starter phrase — user's shorthand for kicking off Create. */
      if (key === 'home' && (ta.value === 'c' || ta.value === 'C')) {
        ta.value = 'create a template';
      }
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, key === 'home' ? 208 : 156) + 'px';
    };
    ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFree(ta.value); } };
  }
  const sb = document.getElementById('send-' + key); if (sb) sb.onclick = () => submitFree(ta ? ta.value : '');
  const cp = document.getElementById('clip-' + key); if (cp) cp.onclick = () => {
    /* Landing-page + icon: start the create flow directly on the Attach-files
       branch, skipping the source-pick step. Elsewhere: file the current
       dropzone (if any), or start a fresh attach flow. */
    if (key === 'home' && S.stage === 'start') return beginCreateFromAttach();
    if (S.thread.some(x => x.k === 'dropzone')) return simulateAttachUpload();
    submitFree('__attach__');
  };
}

/* Landing + icon → start a create session already sitting on the Attach-files
   dropzone — no source-pick step in between. Same terminal state as clicking
   "Attach files directly" in the drive source-pick. */
function beginCreateFromAttach() {
  S.flow = { kind: 'create', family: 'msa' };
  S.perms.drive = 'always'; S.perms.upload = 'always';
  S.connected.drive = true; S.connected.upload = true;
  S.thread = [];
  S.thread.push({ k: 'user', text: 'Attach files directly' });
  S.thread.push({ k: 'agent', html: rich("Go ahead — add your files below. I can read PDF and DOCX. Drop as many as you need, then I'll start.") });
  S.thread.push({ k: 'dropzone' });
  S.stage = 'asking';
  render();
}
function renderDock() {
  const d = document.getElementById('dock'); if (!d) return;
  const ph = S.stage === 'interview' ? 'Or ask me something about this template'
           : S.stage === 'draft' ? 'Ask for a change to the template'
           : S.stage === 'attached' ? 'Ask about the extracted clauses — or ask me to convert this into our template'
           : S.stage === 'edit' ? 'Ask for another change — apply, test against a redline, or roll back'
           : 'Ask the Template Studio';
  setHTML(d, (S.stage === 'interview' ? renderInterviewCard() : '') + composerHTML(ph, 'chat'));
  bindComposer('chat');
  if (S.stage === 'interview') bindInterview(d);
}

function bindInterview(d) {
  d.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
    const v = b.dataset.opt;
    const q = CREATE_QUESTIONS[S.qi];
    if (v === 'skip') {
      const free = document.getElementById('qFree');
      const val = free && free.value.trim();
      if (val) {
        S.answers[q.id] = val;
        S.thread.push({ k: 'qprompt', q: q.q, a: val });
      } else {
        S.answers[q.id] = null;
        S.thread.push({ k: 'qprompt', q: q.q, a: 'Skipped' });
      }
      advanceInterview();
      return;
    }
    const i = +v;
    const o = q.opts[i]; if (!o) return;
    S.answers[q.id] = o.v;
    const answerText = o.b + (o.s ? ' — ' + o.s : '');
    S.thread.push({ k: 'qprompt', q: q.q, a: answerText });
    advanceInterview();
  });
  const qPrev = document.getElementById('qPrev');
  if (qPrev) qPrev.onclick = () => { S.qi = Math.max(0, S.qi - 1); render(); };
  const qNext = document.getElementById('qNext');
  if (qNext) qNext.onclick = () => { S.qi = Math.min(CREATE_QUESTIONS.length - 1, S.qi + 1); render(); };
  const qClose = document.getElementById('qClose');
  if (qClose) qClose.onclick = () => {
    /* park the remaining questions and jump to learn */
    const q = CREATE_QUESTIONS[S.qi];
    S.answers[q.id] = null;
    S.thread.push({ k: 'qprompt', q: q.q, a: 'Skipped — parked as a deferred decision' });
    /* mark remaining as skipped */
    for (let j = S.qi + 1; j < CREATE_QUESTIONS.length; j++) S.answers[CREATE_QUESTIONS[j].id] = null;
    S.qi = CREATE_QUESTIONS.length; S.stage = 'learn';
    S.thread.push({ k: 'agent', html: rich('Parked the remaining questions. Reading the standard and drafting the section list.') });
    startLearning();
  };
  const qFree = document.getElementById('qFree');
  if (qFree) qFree.onkeydown = ev => {
    if (ev.key === 'Enter') {
      const val = qFree.value.trim(); if (!val) return;
      const q = CREATE_QUESTIONS[S.qi];
      S.answers[q.id] = val;
      S.thread.push({ k: 'qprompt', q: q.q, a: val });
      advanceInterview();
    }
  };
}

/* ============================== flow — CREATE ============================== */
function beginCreate(family) {
  S.flow = { kind: 'create', family: family || 'msa' };
  S.thread = [];
  S.thread.push({ k: 'user', text: 'create a template' });
  S.thread.push({ k: 'agent', html: rich(
    'Where are the agreements you want me to learn from?',
    "I'll read the executed contracts, extract the clause patterns you actually sign, and use them to draft the template."
  ) });
  if (S.perms.drive === 'always' && Object.keys(S.spSelected || {}).some(k => S.spSelected[k])) {
    startInterview();
  } else {
    S.thread.push({ k: 'sourcepick', lead: '', perm: 'drive' });
    S.stage = 'asking';
  }
  render();
}

function startInterview() {
  S.stage = 'interview';
  S.qi = 0;
  render();
}

function chooseOption(v) {
  const q = CREATE_QUESTIONS[S.qi]; if (!q) return;
  const opt = q.opts.find(o => o.v === v);
  const answerText = opt ? (opt.b + (opt.s ? ' — ' + opt.s : '')) : v;
  S.answers[q.id] = v;
  S.thread.push({ k: 'qprompt', q: q.q, a: answerText });
  advanceInterview();
}
function submitFree(v) {
  const s = (v || '').trim(); if (!s) return;
  if (s === '__attach__') return beginAttach();
  if (s === '__library__') { document.getElementById('threadScroll')?.scrollTo({top:0}); resetApp(); return; }
  const editMatch = s.match(/^__edit:([a-z0-9]+):([a-z0-9]+)__$/);
  if (editMatch) return beginEdit(editMatch[1] + ':' + editMatch[2]);
  /* Follow-up on an already-open template — act on the artifact instead of
     starting a new flow. Match against clause keywords in the current MSA
     scaffold and mark the matched section "tightened". */
  if (S.stage === 'draft' && S.flow?.kind === 'create') {
    return handleTemplateFollowUp(s);
  }
  const flow = matchFlow(s);
  if (flow?.kind === 'create')  return beginCreate(flow.family);
  if (flow?.kind === 'edit')    return beginEdit(flow.intent);
  if (flow?.kind === 'attach')  return beginAttach();
  if (S.stage !== 'start') {
    S.thread.push({ k: 'user', text: s });
    S.thread.push({ k: 'agent', html: rich('Noted. I have not been trained on that one yet — start a new session and pick one of the quick starts on the left, or attach a document with the + icon.') });
    render(); return;
  }
  /* free form on landing — default to create MSA */
  beginCreate('msa');
}

/* Follow-up handler on an open template — matches the user's ask against a
   named clause in the scaffold, flips its status/eyebrow to tightened, and
   scrolls the artifact to it. Falls through to a polite catch-all if no
   clause is named. */
function handleTemplateFollowUp(text) {
  const s = TEMPLATE_SCAFFOLD.msa;
  const t = text.toLowerCase();

  /* Generic "tighten the agreement / template / whole doc" — flip the whole
     document to Tighten posture, mark all sections tightenable, and highlight
     Definitions as the just-tightened anchor. Matches the mock the user
     pinned on 16 Sep 2026. */
  const isWholeDocTighten = /^\s*(please\s+)?tighten(\s+(the|whole|entire))?\s+(agreement|template|doc(ument)?|contract|whole|all)?\s*$/i.test(text)
    || /tighten.*(agreement|template|doc(ument)?|contract|everything|whole|entire)/i.test(text);
  if (isWholeDocTighten) {
    S.thread.push({ k: 'user', text });
    S.answers.posture = 'tighten';
    S.tightenAll = true;
    S.justTightened = 'definitions';
    S.thread.push({ k: 'agent', html: rich('Tightened <strong>Definitions</strong> to a more protective ChargePoint position. Highlighted in the template on the right.') });
    render();
    setTimeout(() => {
      const el = document.getElementById('sec-definitions');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return;
  }

  const map = [
    { rx: /licen[cs]e|sublicen[cs]e|affiliate/, key: 'licence' },
    { rx: /renewal|auto.?renew|cpi|uplift|\bterm\b/, key: 'term' },
    { rx: /liab|cap|damages/,                    key: 'liability' },
    { rx: /uptime|sla|service level/,            key: 'sla' },
    { rx: /data|owner|session data|protection/,  key: 'data' },
    { rx: /warranty|warranties|firmware/,        key: 'warranty' },
    { rx: /confid/,                              key: 'confid' },
    { rx: /indemn/,                              key: 'indem' },
    { rx: /govern|jurisdiction|law/,             key: 'general' },
    { rx: /fee|payment/,                         key: 'fees' },
    { rx: /service/,                             key: 'services' },
    { rx: /definit/,                             key: 'definitions' }
  ];
  const hit = map.find(m => m.rx.test(t));
  S.thread.push({ k: 'user', text: text });
  if (hit) {
    const sec = s.sections.find(x => x.key === hit.key);
    sec.tightenable = true;
    /* Nudge the whole document into tighten mode so this section actually
       reflects the CP-protective body. */
    S.answers.posture = 'tighten';
    S.thread.push({ k: 'agent', html: rich(`Tightened <strong>§${esc(sec.n)} ${esc(sec.name)}</strong>. Redlined the operative language for CP protection and re-cast the eyebrow. Section is highlighted on the right.`) });
    render();
    setTimeout(() => {
      const el = document.getElementById('sec-' + sec.key);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (el) { el.classList.add('doc-sec--flash'); setTimeout(()=>el.classList.remove('doc-sec--flash'), 1600); }
    }, 60);
    return;
  }
  S.thread.push({ k: 'agent', html: rich('Tell me which clause you want changed — licence, renewal, liability cap, service levels, data rights, warranty, termination, audit — and I will redline it and update the ladder.') });
  render();
}
function matchFlow(s) {
  const t = s.toLowerCase();
  if (/attach|upload|extract|counter[\s-]?party|drop.*doc/.test(t)) return { kind: 'attach' };
  if (/licence|license/.test(t) && /tighten/.test(t)) return { kind: 'edit', intent: 'msa:licence' };
  if (/auto[- ]?renew|renewal|cpi/.test(t)) return { kind: 'edit', intent: 'msa:renewal' };
  if (/liability|cap/.test(t)) return { kind: 'edit', intent: 'caas:liability' };
  if (/edit|amend|tighten|redraft|rewrite|adjust/.test(t)) return { kind: 'edit', intent: 'msa:licence' };
  if (/create|draft|new template|new msa|build.*template/.test(t)) return { kind: 'create', family: 'msa' };
  return null;
}

function advanceInterview() {
  const M = CREATE_QUESTIONS.length;
  S.qi++;
  if (S.qi < M) {
    render();
    return;
  }
  /* interview complete → learn. Freeze the original posture into a
     narrow-scope flag so a later "tighten the agreement" follow-up doesn't
     silently expand the 4-section market view into all 12 sections. */
  S.narrowScope = S.answers?.posture === 'market';
  S.stage = 'learn';
  S.thread.push({ k: 'agent', html: rich('Locked. Reading the standard, applying your red lines, and drafting the section list.') });
  startLearning();
}

/* ============================== flow — ATTACH ============================== */
function beginAttach() {
  S.flow = { kind: 'attach' };
  S.thread = [];
  S.thread.push({ k: 'user', text: 'Attach a counter-party document' });
  S.thread.push({ k: 'agent', html: rich('Give me the file. I will read every clause, match each to our baseline, and mark the ones that need a redline.') });
  if (S.perms.upload === 'always') {
    onFileAttached();
  } else {
    S.thread.push({ k: 'perm', id: 'upload' });
    S.stage = 'asking';
  }
  render();
}
function onFileAttached() {
  S.connected.upload = true;
  S.thread.push({ k: 'uploaded', lead: 'Attached. This will stay in this session only.' });
  S.stage = 'asking';
  render();
  setTimeout(startLearning, 700);
}

/* ============================== flow — EDIT ============================== */
function beginEdit(intentId) {
  const e = EDIT_INTENTS[intentId] || EDIT_INTENTS['msa:licence'];
  S.flow = { kind: 'edit', intent: intentId };
  S.thread = [];
  S.thread.push({ k: 'user', text: e.ask });
  S.thread.push({ k: 'agent', html: rich(`That sits in <strong>${esc(templateById(e.tid).name)}</strong> at <strong>${esc(e.section)}</strong>. Before I write the redline, I want to compare against what ChargePoint has actually signed. Tell me where the executed corpus is.`) });
  if (S.perms.drive === 'always') { startLearning(); }
  else {
    S.thread.push({ k: 'sourcepick', lead: 'Where are the executed agreements you want me to read?', perm: 'drive' });
    S.stage = 'asking';
  }
  render();
}
function openEditPicker(tid) {
  /* Map template → default edit intent */
  const map = { msa: 'msa:licence', caas: 'caas:liability' };
  const intent = map[tid] || 'msa:licence';
  beginEdit(intent);
}

/* ============================== permission answer ============================== */
function answerPerm(id, v) {
  S.perms[id] = v;
  if (v !== 'denied') {
    if (id === 'upload')     { onFileAttached(); return; }
    S.connected[id] = true;
    startLearning();
  }
  render();
}

/* ============================== learn / finish ============================== */
function startLearning() {
  if (S.learnStarted) return; S.learnStarted = true;
  S.stage = 'learn'; S.learnStep = 0;
  S.thread.push({ k: 'steps' });
  render();
  const total = stepsFor().length;
  const step = () => { S.learnStep++; if (S.learnStep <= total) { render(); _scrollThread(); setTimeout(step, 620); } else finishLearning(); };
  setTimeout(step, 700);
}
function finishLearning() {
  S.cotOpen.learn = false;
  S.thread.push({ k: 'findings' });
  S.thread.push({ k: 'agent', html: rich(preAnswerLine()) });
  render();
  streamText(closingLineFor(false), () => {
    S.thread.push({ k: 'artifactPending' }); render(); _scrollThread();
    setTimeout(() => {
      const ix = S.thread.findIndex(x => x.k === 'artifactPending');
      if (ix >= 0) S.thread.splice(ix, 1);
      const kind = S.flow.kind === 'create' ? 'draft' : S.flow.kind === 'attach' ? 'attached' : 'edit';
      S.thread.push({ k: kind, html: rich(closingLineFor(true)) });
      render(); _scrollThread();
      setTimeout(() => { S.stage = kind; S.canvasClosed = false; render(); }, 1200);
    }, 5000);
  });
}
function preAnswerLine() {
  const f = S.flow;
  if (f.kind === 'create') {
    const s = TEMPLATE_SCAFFOLD.msa;
    return `Baseline read. <strong>${s.sections.length}</strong> sections carried, <strong>${s.sections.filter(x=>x.status==='tighten').length}</strong> flagged to tighten from your red lines.`;
  }
  if (f.kind === 'attach') {
    const crit = ATTACH_DOC.extracted.filter(x=>x.partyRisk==='critical').length;
    return `Extracted. <strong>${ATTACH_DOC.extracted.length}</strong> material clauses to redline, <strong>${crit}</strong> are critical. Every one maps to language we already carry.`;
  }
  const e = EDIT_INTENTS[f.intent];
  return `Read. The corpus supports the change — <strong>${e.diff.length}</strong> diff entries, ladder touched at ${e.ladderChanges.length} tiers.`;
}
function closingLineFor(isFinal) {
  const f = S.flow;
  if (f.kind === 'create') return isFinal
    ? 'Draft is ready. Section list on the right — pick a clause to see its language and ladder.'
    : 'Building the draft — section list, standard clauses on each rung, and your red-line tightenings called out.';
  if (f.kind === 'attach') return isFinal
    ? 'Side-by-side is ready. Every clause with a redline is on the right.'
    : 'Writing the side-by-side — counter-party against baseline, with a recommendation per clause.';
  return isFinal
    ? 'The amendment is ready. Before-after, line-by-line diff, and the ladder change are on the right.'
    : 'Writing the amendment — operative language, line-by-line diff, and how each rung of the ladder shifts.';
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
    /* SharePoint always opens the file-picker modal; the modal itself calls
       through to startInterview / startLearning after the user confirms
       their selection. See renderSharePointPicker below. */
    if (perm === 'drive' && src === 'sharepoint') {
      S.src = 'sharepoint';
      S.sheet = 'sp-picker';
      render();
      return;
    }
    /* "Attach files directly" from a drive-source pick — treat it like the
       upload permission: mark connected, echo a user bubble, then feed
       whichever flow we're in. */
    if (src === 'upload') {
      S.perms.drive = 'always'; S.perms.upload = 'always';
      S.connected.drive = true; S.connected.upload = true;
      S.thread.push({ k: 'user', text: 'Attach files directly' });
      S.thread.push({ k: 'agent', html: rich("Go ahead — add your files below. I can read PDF and DOCX. Drop as many as you need, then I'll start.") });
      S.thread.push({ k: 'dropzone' });
      S.stage = 'asking';
      render();
      return;
    }
    S.perms[perm] = 'always';
    S.connected[perm] = true;
    S.thread.push({ k: 'user', text: 'SharePoint' });
    if (S.flow?.kind === 'create') startInterview();
    else startLearning();
    render();
  });
  const oa = document.getElementById('openArt');    if (oa) oa.onclick = () => { S.canvasMax = false; S.canvasClosed = false; render(); };
  const dz = document.getElementById('dropzoneBtn'); if (dz) dz.onclick = () => simulateAttachUpload();
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
  if (S.sheet === 'sp-picker') return renderSharePointPicker(host);
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

/* ---- SharePoint file-picker modal (create flow) ---- */
function renderSharePointPicker(host) {
  const sel = S.spSelected || (S.spSelected = {});
  const files = SP_FILES;
  const count = files.filter(f => sel[f.name]).length;
  const allOn = count === files.length;
  const html = `<div class="sheet-bg" id="sheetBg"></div>
    <div class="sp-modal" role="dialog" aria-label="SharePoint file picker">
      <header class="sp-modal__h">
        <span class="sp-modal__brand" aria-hidden="true"><svg viewBox="0 0 26 26" width="26" height="26" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="spg1" x1="4" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#036c70"/><stop offset="1" stop-color="#048087"/></linearGradient><linearGradient id="spg2" x1="14" y1="10" x2="24" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#28a8ea"/><stop offset="1" stop-color="#1490df"/></linearGradient></defs><circle cx="10" cy="10" r="7" fill="url(#spg1)"/><circle cx="18" cy="16" r="6" fill="url(#spg2)"/><text x="10" y="13" text-anchor="middle" fill="#ffffff" font-family="'Geist', system-ui, sans-serif" font-weight="700" font-size="9">S</text></svg></span>
        <div class="sp-modal__h-l">
          <span class="sp-modal__title">SharePoint — Legal › Contracts</span>
          <span class="sp-modal__sub">Select one or more agreements to read</span>
        </div>
        <button class="sp-modal__close" type="button" id="spClose" aria-label="Cancel">${I['x-close']}</button>
      </header>
      <div class="sp-modal__body">
        <label class="sp-row sp-row--all" for="spAll">
          <input type="checkbox" id="spAll" ${allOn ? 'checked' : ''}>
          <span class="sp-row__body">
            <span class="sp-row__name mono">Select all</span>
            <span class="sp-row__meta">${files.length} files in Legal › Contracts</span>
          </span>
        </label>
        <div class="sp-list">
        ${files.map((f, i) => `<label class="sp-row" for="spf-${i}">
          <input type="checkbox" id="spf-${i}" data-sp="${esc(f.name)}" ${sel[f.name] ? 'checked' : ''}>
          <span class="sp-row__body">
            <span class="sp-row__name mono">${esc(f.name)}</span>
            <span class="sp-row__meta">${esc(f.meta)}</span>
          </span>
          ${pill('pill--squared pill--xs pill--' + (f.tagWarn ? 'warning' : 'gray'), esc(f.tag))}
        </label>`).join('')}
        </div>
      </div>
      <footer class="sp-modal__f">
        <span class="sp-modal__count">${count ? `${count} file${count === 1 ? '' : 's'} selected` : 'No files selected'}</span>
        <span class="spacer"></span>
        ${btn('btn--xs btn--neutral-secondary', label('Cancel'), 'id="spCancel"')}
        ${btn('btn--xs btn--brand-primary', label('Confirm'), 'id="spGo"' + (count ? '' : ' disabled'))}
      </footer>
    </div>`;
  /* Only paint the modal once. Ticking a checkbox updates the count text and
     the Select-files button's disabled state in place — a full re-render would
     rebuild the whole modal DOM, and its `transform: translate(-50%, -50%)`
     re-centring made it jitter visibly whenever the count text width changed. */
  if (!host.querySelector('.sp-modal')) {
    setHTML(host, html);
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    bind('sheetBg', () => { S.sheet = false; render(); });
    bind('spClose', () => { S.sheet = false; render(); });
    bind('spCancel', () => { S.sheet = false; render(); });
    const spAll = document.getElementById('spAll');
    if (spAll) spAll.onchange = e => {
      const on = !!e.target.checked;
      files.forEach(f => sel[f.name] = on);
      host.querySelectorAll('[data-sp]').forEach(cb => { cb.checked = on; });
      updateSpFooter(host, files, sel);
    };
    host.querySelectorAll('[data-sp]').forEach(cb => cb.onchange = e => {
      sel[cb.dataset.sp] = !!e.target.checked;
      const spAll2 = document.getElementById('spAll');
      if (spAll2) spAll2.checked = files.every(f => sel[f.name]);
      updateSpFooter(host, files, sel);
    });
    bind('spGo', () => {
      const c = files.filter(f => sel[f.name]).length;
      if (!c) return;
      S.perms.drive = 'always';
      S.connected.drive = true;
      S.src = 'sharepoint';
      S.sheet = false;
      S.thread.push({ k: 'user', text: `SharePoint · ${c} file${c === 1 ? '' : 's'}` });
      if (S.flow?.kind === 'create') startInterview();
      else startLearning();
    });
  }
}

function updateSpFooter(host, files, sel) {
  const c = files.filter(f => sel[f.name]).length;
  const countEl = host.querySelector('.sp-modal__count');
  if (countEl) countEl.textContent = c ? `${c} file${c === 1 ? '' : 's'} selected` : 'No files selected';
  const go = document.getElementById('spGo');
  if (go) {
    if (c) go.removeAttribute('disabled');
    else go.setAttribute('disabled', '');
  }
}

/* ============================== init ============================== */
function resetApp() {
  Object.assign(S, {
    stage: 'start', flow: null, thread: [], learnStarted: false, learnStep: 0,
    cotOpen: {}, canvasMax: false, canvasClosed: false, open: {}, sheet: false,
    answers: {}, qi: 0, selSection: null, renderedTurns: 0, _autoNavCollapsed: false,
    spSelected: {}, narrowScope: false, tightenAll: false, justTightened: null
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

window.TemplateStudio = { S, render, resetApp, beginCreate, beginAttach, beginEdit, chooseOption, answerPerm, TEMPLATES, CREATE_QUESTIONS, EDIT_INTENTS, ATTACH_DOC, SP_FILES, TEMPLATE_SCAFFOLD };
render();

})();
