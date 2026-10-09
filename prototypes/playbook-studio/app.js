/* app.js — state, render and flow for the Playbook Studio prototype.
   Ported from playbook-studio-project/playbook-studio.html; every template
   now emits Enterprise OS atoms (see index.html for the link list). */
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
  /* Auto-collapse the sidebar the first time the user enters a chat, so the
     760 message column has room. Only runs once per session — later re-toggles
     by railToggle are respected. */
  if (S.stage !== 'start' && !S._autoNavCollapsed) {
    $rail.setAttribute('data-state', 'collapsed');
    const rt = document.getElementById('railToggle');
    if (rt) rt.setAttribute('aria-label', 'Expand sidebar');
    S._autoNavCollapsed = true;
  }
  const open = S.stage === 'playbook' && !S.canvasClosed;
  $stage.setAttribute('data-artifact', open ? 'open' : 'closed');
  $stage.setAttribute('data-expanded', (open && S.canvasMax) ? 'true' : 'false');
  $stage.setAttribute('data-focused', S.focused ? 'true' : 'false');
  $stage.setAttribute('data-chat-open', S.chatOpen ? 'true' : 'false');
  if (!open || S.canvasMax) $stage.style.gridTemplateColumns = '';
  keepScroll('.plist__scroll, .pdet__scroll, .canvas__body', () => {
    setHTML($panelHost, open ? renderCanvas() : '');
    if (open) { renderPlaybook(document.getElementById('canvasDoc')); bindCanvas(); }
  });
  renderView();
  renderSheet();
}

/* ============================== rail ============================== */
const TEMPLATES_NAV_ICON = '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16634 2.16172V4.64004C9.16634 4.97607 9.16634 5.14409 9.22992 5.27244C9.28585 5.38533 9.37509 5.47712 9.48485 5.53465C9.60963 5.60004 9.77298 5.60004 10.0997 5.60004H12.5092M9.16634 11H5.66634M10.333 8.6H5.66634M12.6663 6.79294V11.12C12.6663 12.1281 12.6663 12.6321 12.4756 13.0172C12.3078 13.3559 12.0401 13.6312 11.7108 13.8038C11.3365 14 10.8464 14 9.86634 14H6.13301C5.15292 14 4.66287 14 4.28852 13.8038C3.95924 13.6312 3.69152 13.3559 3.52375 13.0172C3.33301 12.6321 3.33301 12.1281 3.33301 11.12V4.88C3.33301 3.87191 3.33301 3.36786 3.52375 2.98282C3.69152 2.64413 3.95924 2.36876 4.28852 2.19619C4.66287 2 5.15292 2 6.13301 2H8.00654C8.43458 2 8.64859 2 8.85 2.04973C9.02856 2.09383 9.19926 2.16656 9.35584 2.26525C9.53244 2.37656 9.68378 2.53222 9.98644 2.84353L11.8462 4.75647C12.1489 5.06778 12.3002 5.22344 12.4085 5.40509C12.5044 5.56614 12.5751 5.74172 12.618 5.92538C12.6663 6.13254 12.6663 6.35267 12.6663 6.79294Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BOOK_OPEN_SOLID = '<svg class="icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.936 2c.706 0 1.254.036 1.694.036 1.524 0 2.017.657 2.017 1.953 0 .674.036 8.397.036 8.397 0 .174.142.316.317.316.176 0 .318-.142.318-.316 0 0 0-7.107 0-8.397 0-1.29 1.01-1.953 2.052-1.953.44-.036.988-.036 1.694-.036h.253c.35 0 .632 0 .86.018.231.019.435.058.623.153.298.152.541.393.694.69.096.187.135.39.154.62.019.226.019.507.019.855v5.432c0 .348 0 .628-.019.855-.019.23-.058.432-.154.62-.152.297-.395.539-.694.69-.188.096-.392.135-.623.153-.228.019-.51.019-.86.019h-.873c-.815 0-1.156.004-1.46.096a1.99 1.99 0 0 0-.782.593c-.246.201-.438.482-.89 1.156l-.063.095a.316.316 0 0 1-.53 0l-.063-.095c-.452-.674-.644-.955-.89-1.156a1.99 1.99 0 0 0-.782-.593c-.305-.092-.646-.096-1.46-.096h-.874c-.35 0-.632 0-.86-.019-.231-.018-.435-.057-.623-.152a1.588 1.588 0 0 1-.694-.69c-.096-.188-.135-.39-.154-.62-.019-.227-.019-.507-.019-.855V4.337c0-.348 0-.628.019-.855.019-.23.058-.432.154-.62.152-.297.395-.539.694-.69.188-.096.392-.135.623-.154.228-.018.51-.018.86-.018h.253Z" fill="currentColor"/></svg>';
const NAV_ICON = { new: I['nav-plus'], projects: I['nav-folder'], routines: I['nav-clock'], meetings: I['nav-calendar'], artifacts: I['nav-cube-02'], playbooks: BOOK_OPEN_SOLID, templates: TEMPLATES_NAV_ICON };
function renderRail() {
  /* Prefer the new local SVGs from ./assets when present; keeps the atom's
     unify-logo / unify-wordmark-gold as the fallback in case the file is
     missing (e.g. served from a different root). */
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
    item('new', 'New Session', 'new', 'main-nav__x-item--nohover') +
    item('playbooks', 'Playbooks', 'playbooks', '', true) +
    item('templates', 'Template Studio', 'templates', 'main-nav__x-item--nohover') +
    `<span class="main-nav__x-divider" role="separator" data-figma-node="I1731:251990;419:152025"></span>`);

  setHTML(document.getElementById('navAgents'), [
    ['Knowledge Agent',        false],
    ['Contract Review Agent',  false],
    ['Clause Extraction Agent', false],
    ['Redline Compare Agent',  false]
  ].map(([n, cur], ix) =>
    `<button class="main-nav__x-item main-nav__x-item--agent" type="button" aria-current="${cur ? 'page' : 'false'}" ${TAG('main-nav', 'Nav_menu/Agent', 'I1731:251990;419:15175' + (ix + 1))}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-agent-avatar main-nav__x-agent-avatar--${ix + 1}">${I['ai-avatar']}</span><span class="main-nav__x-label">${esc(n)}</span></span></button>`).join(''));

  const hist = [];
  if (S.type) hist.push([T().name + ' playbook', 'now']);
  hist.push(
    ['Liability cap — MSA precedent',      '2d'],
    ['Prevailing wage — Transit East',     '3d'],
    ['Auto-renewal — Kaiser Permanente',   '1w'],
    ['NEVI OCPP 2.1 read-out',             '2w']
  );
  setHTML(document.getElementById('navHistory'), hist.map(([t, m]) =>
    `<button class="main-nav__x-item main-nav__x-item--history" type="button" ${TAG('main-nav', 'Nav_menu/Chat_history', 'I1731:251990;1412:303303')}>
       <span class="main-nav__x-icon-text"><span class="main-nav__x-label">${esc(t)}</span></span><span class="main-nav__x-meta">${m}</span></button>`).join(''));

  document.querySelectorAll('#navPrimary [data-nav]').forEach(b => b.onclick = () => {
    const n = b.dataset.nav;
    if (n === 'templates') { location.href = (location.pathname.endsWith('/index.html') ? '../template-studio/index.html' : './template-studio.html'); return; }
    if (n === 'playbooks') { resetApp(); S.stage = 'myplaybooks'; S.canvasClosed = true; S.focused = false; S.chatOpen = false; render(); return; }
    if (['new', 'artifacts'].includes(n)) resetApp();
  });
  document.querySelectorAll('#navAgents .main-nav__x-item--agent').forEach(b => {
    const label = (b.querySelector('.main-nav__x-label') || {}).textContent || '';
    if (label.trim() === 'Knowledge Agent') b.onclick = () => { location.href = (location.pathname.endsWith('/index.html') ? '../knowledge-agent/index.html' : './knowledge-agent.html'); };
  });
}

/* ============================== view ============================== */
function renderView() {
  if (S.stage === 'start') { S.renderedTurns = 0; $view.innerHTML = libPage(); return bindLib(); }
  if (S.stage === 'myplaybooks') { S.renderedTurns = 0; $view.innerHTML = myPlaybooksPage(); return bindMyPlaybooks(); }
  if (S.stage === 'playbook' && S.focused && !S.chatOpen) {
    $view.innerHTML = '';   /* rules panel lives inside the canvas now */
    return;
  }
  const prev = document.getElementById('threadScroll');
  const prevTop = prev ? prev.scrollTop : null, grew = S.thread.length !== S.renderedTurns;
  const from = S.renderedTurns || 0;
  const showStarter = S.stage === 'playbook' && S.focused && S.chatOpen && !S.thread.length;
  const chatMarkup = `<div class="chat">
      ${breadcrumb()}
      <div class="chat__scroll" id="threadScroll"><div class="chat__col">${showStarter ? chatStarter() : S.thread.map((t, i) => renderTurn(t, i, i >= from)).join('')}</div></div>
      <div class="chat__dock" id="dock"></div>
    </div>`;
  $view.innerHTML = chatMarkup;
  S.renderedTurns = S.thread.length;
  renderDock();
  bindThread();
  const sc = document.getElementById('threadScroll');
  if (sc) sc.scrollTop = (grew || prevTop == null) ? sc.scrollHeight : prevTop;
}
function rulesPanel() {
  const t = T(); if (!t) return '';
  const list = t.issues || [];
  if (S.rulesCollapsed) return '';
  const drawerIcon = I['layout-left'] || I['menu-01'] || '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M6 3v10"/></svg>';
  return `<aside class="rules-panel">
    <div class="rules-panel__section-head">
      <span class="rules-panel__section-label">Rules</span>
      <button class="rules-panel__add" type="button" data-add-rule-side aria-label="Add rule">+</button>
    </div>
    <div class="rules-panel__list">
      ${list.map((i, idx) => {
        const count = Array.isArray(i.p) ? i.p.length : 1;
        const active = idx === 0;
        return `<button class="rules-panel__row${active ? ' rules-panel__row--active' : ''}" type="button" data-rule-jump="${esc(i.id)}">
          <span class="rules-panel__row-name">${esc(i.n)}</span>
          <span class="rules-panel__row-num">${count}</span>
        </button>`;
      }).join('')}
    </div>
  </aside>`;
}
function chatStarter() {
  const t = T(); const name = t ? t.name : 'this playbook';
  const prompts = [
    `Explain the Not-acceptable red line in each issue of the ${name}.`,
    `Suggest a new fallback for the Residuals clause.`,
    `Show me where our team most often concedes in ${name}s.`,
    `Draft a plain-English summary I can send to a business owner.`
  ];
  return `<div class="chat-starter">
    <div class="chat-starter__hello">
      <span class="chat-starter__avatar" aria-hidden="true">${I['ai-avatar'] || ''}</span>
      <div class="chat-starter__lead">
        <h3 class="chat-starter__title">Ask about this playbook</h3>
        <p class="chat-starter__body">I can walk you through any rule, propose fallbacks, or draft new language. Pick a starter or type your own question below.</p>
      </div>
    </div>
    <div class="chat-starter__prompts">
      ${prompts.map(p => `<button class="chat-starter__prompt" type="button" data-starter="${esc(p)}">${esc(p)}</button>`).join('')}
    </div>
  </div>`;
}
function bindRulesPanel() {
  document.querySelectorAll('[data-back-to-list]').forEach(b => b.onclick = () => { S.stage = 'myplaybooks'; S.focused = false; S.chatOpen = false; S.canvasClosed = true; render(); });
  document.querySelectorAll('[data-rule-jump]').forEach(b => b.onclick = () => {
    const id = b.dataset.ruleJump;
    S.open['card:' + id] = true;
    render();
    setTimeout(() => {
      const el = document.querySelector(`.icard[data-issue-id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  });
  document.querySelectorAll('[data-add-rule-side]').forEach(b => b.onclick = () => { S.newRule = true; render(); });
  document.querySelectorAll('[data-rules-drawer]').forEach(b => b.onclick = () => { S.rulesCollapsed = !S.rulesCollapsed; render(); });
}

function breadcrumb() {
  const t = T();
  const parts = ['ChargePoint Legal', 'Playbooks', t ? t.name + ' playbook' : 'New playbook'];
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

/* ============================== landing ============================== */
function homeList() {
  const g = GROUPS.find(x => x[0] === S.grp), ids = g && g[2];
  let list = ids ? ids.map(id => TYPES.find(t => t.id === id)) : TYPES.slice();
  const q = S.q.trim().toLowerCase();
  if (q) list = TYPES.filter(t => (t.name + ' ' + t.desc + ' ' + t.segs.join(' ')).toLowerCase().includes(q));
  return list;
}
function cardFoot(t) {
  const nNew = t.issues.filter(i => i.isNew).length, nConf = t.issues.filter(i => i.conflict).length;
  const thin = t.issues.length <= 6;
  if (!S.connected) return thin ? `<span class="frow"><span class="frow__label frow__label--warn">Thin</span><span class="frow__value">no signed paper read yet</span></span>` : '';
  return `<span class="frow"><span class="frow__label">Your paper</span>${nNew ? pill('pill--solid pill--brand', '+' + nNew + ' new') : ''}<span class="frow__value">${docsFor(t)} signed · ${nConf} to decide</span></span>`;
}
function searchInput(id, ph, val) {
  return `<div class="search-input" ${TAG('filter-bar', 'Search', '65:37079')}><div class="search-input__field"><div class="search-input__content">${I['search-md']}<input class="search-input__text" id="${id}" type="search" placeholder="${esc(ph)}" value="${esc(val || '')}" aria-label="${esc(ph)}"></div></div></div>`;
}
function libPage() {
  const list = homeList();
  const saved = S.savedPlaybooks || [];
  return `<div class="landing fade"><div class="landing__col">
    <header class="landing__head">
      <h1 class="page-title">Playbooks</h1>
      ${btn('btn--md btn--brand-primary', I['plus'] + label('New Playbook'), 'id="newPb"')}
    </header>
    ${saved.length ? `<section class="landing__section">
      <h2 class="section-title">Your <em>Playbooks</em></h2>
      <div class="saved-list">
        ${saved.map(p => `<button class="saved-row" type="button" data-saved="${esc(p.type)}">
          <span class="saved-row__name">${esc(p.name)} Playbook</span>
          <span class="saved-row__meta">Version 1 · saved just now</span>
        </button>`).join('')}
      </div>
    </section>` : ''}
    <section class="landing__section landing__section--compose">
      <h2 class="section-title">Create a new <em>Playbook</em></h2>
      ${composerHTML('Describe the contract — "10-year site host deal with a REIT, revenue share, they want exclusivity"', 'home')}
    </section>
    <section class="landing__section">
      <div class="landing__section-head">
        <h2 class="section-title">Or start with a <em>Template</em></h2>
        <span class="spacer"></span>
        ${searchInput('libSearch', 'Search contract types', S.q)}
        ${btn('btn--sm btn--neutral-secondary', label('Browse all'), 'id="browseAll"')}
      </div>
      <div class="horizontal-tabs" ${TAG('horizontal-tabs', 'Horizontal tabs', '16740:306236')}><div class="horizontal-tabs__list" role="tablist">
        ${GROUPS.map(g => `<button class="horizontal-tabs__tab" type="button" role="tab" data-grp="${g[0]}" aria-selected="${S.grp === g[0] && !S.q ? 'true' : 'false'}">${esc(g[1])}</button>`).join('')}
      </div></div>
      ${S.homeConnect ? `<div class="landing__perm">${renderPerm('docsource', 0)}</div>` : ''}
      <div class="template-grid">
        ${list.length ? list.map(t => `
          <button class="template-card" type="button" data-type="${t.id}">
            <span class="template-card__top"><span class="template-card__tile">${GLYPH[t.id]}</span><span class="template-card__name">${esc(t.name)}</span></span>
            <span class="template-card__desc">${esc(t.desc)}</span>
          </button>`).join('')
        : `<div class="landing__empty">Nothing matches "${esc(S.q)}". Describe the contract in the box above and I will work out the shape.</div>`}
      </div>
    </section>
  </div></div>`;
}
function bindLib() {
  const v = $view;
  v.querySelectorAll('[data-type]').forEach(b => b.onclick = () => pickType(b.dataset.type));
  v.querySelectorAll('[data-saved]').forEach(b => b.onclick = () => { S.type = b.dataset.saved; S.stage = 'playbook'; S.canvasClosed = false; S.thread = []; S.renderedTurns = 0; render(); });
  v.querySelectorAll('[data-grp]').forEach(b => b.onclick = () => { S.grp = b.dataset.grp; S.q = ''; render(); });
  const ba = document.getElementById('browseAll'); if (ba) ba.onclick = () => { S.grp = 'all'; S.q = ''; render(); };
  const si = document.getElementById('libSearch');
  if (si) { si.oninput = () => { const at = si.selectionStart; S.q = si.value; render(); const n = document.getElementById('libSearch'); if (n) { n.focus(); n.setSelectionRange(at, at); } };
    si.onkeydown = e => { if (e.key === 'Escape') { S.q = ''; render(); } }; }
  v.querySelectorAll('[data-src]').forEach(b => b.onclick = () => { S.src = b.dataset.src; render(); });
  v.querySelectorAll('[data-attach-go]').forEach(b => b.onclick = () => openLocalFilePicker());
    v.querySelectorAll('[data-pick-source]').forEach(b => b.onclick = () => {
    if (b.dataset.pickSource === 'attach') {
      S.awaitFiles = true;
      S.thread.push({ k: 'user', text: 'Attach files directly' });
      S.thread.push({ k: 'attachprompt' });
    } else {
      S.thread.push({ k: 'user', text: 'SharePoint' });
      S.sheet = 'sp-picker'; S.spSelected = S.spSelected || {};
    }
    render();
  });
  v.querySelectorAll('[data-perm]').forEach(b => b.onclick = () => homeGrant(b.dataset.v));
  v.querySelectorAll('[data-disc]').forEach(b => b.onclick = () => { const k = b.dataset.disc; S.open[k] = !S.open[k]; render(); });
  bindComposer('home');
  const nb = document.getElementById('newPb'); if (nb) nb.onclick = () => { const ta = document.getElementById('ta-home'); if (ta) ta.focus(); };
}

/* My playbooks — a simple table listing view. Green tile + name (left),
   description (middle), version chip (right). Reuses landing tokens. */
const SAMPLE_PLAYBOOKS = [
  { key: 'sample-1', name: 'CP MSA — North America',            desc: 'Master services agreement playbook for direct enterprise deals.',        ver: 'V4', tone: 'file' },
  { key: 'sample-2', name: 'Reseller & channel partner',        desc: 'Distributor and reseller agreements on partner paper.',                   ver: 'V2', tone: 'list' },
  { key: 'sample-3', name: 'Site host licence — property owner', desc: 'Charging station install and revenue-share terms on host property.',    ver: 'V3', tone: 'screen' },
  { key: 'sample-4', name: 'Data processing addendum',           desc: 'GDPR / CCPA DPA and standard contractual clauses playbook.',            ver: 'V5', tone: 'alert' },
  { key: 'sample-5', name: 'SLA & service credits',              desc: 'Uptime, credits and remedies clauses across Assure tiers.',             ver: 'V2', tone: 'chart' },
  { key: 'sample-6', name: 'Public sector procurement',          desc: 'Municipal, state and federal RFP responses with FAR carve-outs.',       ver: 'V3', tone: 'screen' },
  { key: 'sample-7', name: 'Vendor onboarding NDA',              desc: 'Inbound mutual NDA baseline for suppliers and integration partners.',   ver: 'V1', tone: 'mail' }
];
const MPB_ICONS = {
  crown:  '<svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M2 4.5 3.75 8h6.5L12 4.5l-2.5 1.75L7 3 4.5 6.25 2 4.5Zm.5 4.75h9l-.5 1.5h-8l-.5-1.5Z"/></svg>',
  list:   '<svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><rect x="2" y="3" width="10" height="1.5" rx=".5"/><rect x="2" y="6.25" width="10" height="1.5" rx=".5"/><rect x="2" y="9.5" width="10" height="1.5" rx=".5"/></svg>',
  mail:   '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="10" height="8" rx="1.5"/><path d="m3 4.5 4 3 4-3"/></svg>',
  chart:  '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11h10M3.5 9V6M6 9V4M8.5 9V7M11 9V5"/></svg>',
  file:   '<svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M4 2h4l3 3v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm4 0v3h3"/></svg>',
  screen: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="11" height="7" rx="1"/><path d="M5 12h4M7 9.5V12"/></svg>',
  alert:  '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3l5 8H2l5-8Zm0 3v2m0 2h.01"/></svg>'
};
function myPlaybooksPage() {
  const saved = (S.savedPlaybooks || []).map(p => ({ key: 'saved-' + p.type, name: p.name + ' Playbook', desc: 'Created just now.', ver: 'V1', tone: 'file', savedType: p.type }));
  const rows = [...saved, ...SAMPLE_PLAYBOOKS];
  const row = (r, idx) => `<button class="mpb-row" type="button" data-mpb="${esc(r.key)}"${r.savedType ? ` data-mpb-type="${esc(r.savedType)}"` : ''}>
      <span class="mpb-row__name">
        <span class="mpb-row__tile">${MPB_ICONS[r.tone] || MPB_ICONS.file}</span>
        <span class="mpb-row__title">${esc(r.name)}</span>
      </span>
      <span class="mpb-row__desc">${esc(r.desc)}</span>
      <span class="mpb-row__ver">${esc(r.ver)}</span>
    </button>`;
  return `<div class="landing fade"><div class="mpb-page">
    <header class="mpb-head">
      <h1 class="page-title">Playbooks</h1>
      <div class="mpb-head__actions">
        <button class="mpb-icon-btn" type="button" title="Search" aria-label="Search">${I['search-md-18'] || I['search-md']}</button>
        <button class="mpb-sort" type="button">Latest first ${I['chevron-down-sm']}</button>
        ${btn('btn--md btn--brand-primary', I['plus'] + label('New Playbook'), 'id="mpbNew"')}
      </div>
    </header>
    <div class="mpb-table">
      <div class="mpb-thead">
        <span class="mpb-th mpb-th--name">Name</span>
        <span class="mpb-th mpb-th--desc">Description</span>
        <span class="mpb-th mpb-th--ver">Version</span>
      </div>
      <div class="mpb-tbody">${rows.map(row).join('')}</div>
    </div>
  </div></div>`;
}
function bindMyPlaybooks() {
  const v = $view;
  v.querySelectorAll('[data-mpb]').forEach(b => b.onclick = () => {
    const type = b.dataset.mpbType || 'nda';
    S.type = type;
    S.stage = 'playbook';
    S.canvasClosed = false;
    S.focused = true;
    S.chatOpen = false;
    S.thread = [];
    S.renderedTurns = 0;
    render();
  });
  const nb = document.getElementById('mpbNew'); if (nb) nb.onclick = () => {
    resetApp();
    S.stage = 'start';
    render();
  };
}

/* ============================== turns ============================== */
/* COT atom (frame 9 905:301453): "Thoughts ›" row, rich steps with result links, collapsed steps, done row */
const cotRow = (key) => `<div class="cot__row"><span class="cot__avatar">${I['ai-avatar']}</span><button class="cot__thoughts" type="button" data-cot="${key}" aria-expanded="${S.cotOpen[key] === false ? 'false' : 'true'}">Thoughts${I['chevron-right-sm-14']}</button></div>`;
const cotStep = (icon, lbl, opts = {}) => `<div class="cot__step ${opts.rich ? 'cot__step--rich' : ''} ${opts.done ? 'cot__step--done' : ''}">
    <div class="cot__step-row"><span class="cot__step-icon">${I[icon]}</span><span class="cot__step-label">${esc(lbl)}</span></div>
    ${opts.results ? `<div class="cot__results"><span class="cot__rule"></span><span class="cot__result-box">${opts.results.map(r => `<button class="cot__link" type="button">${esc(r)}</button>`).join('')}</span></div>` : ''}
    ${opts.dash ? '<span class="cot__step-dash"></span>' : ''}
  </div>`;
const cot = (key, stepsHtml, withRow = true) => `<div class="cot" ${TAG('cot', 'COT', '905:301480')}>${withRow ? cotRow(key) : ''}<div class="cot__steps" ${S.cotOpen[key] === false ? 'hidden' : ''}>${stepsHtml}</div></div>`;
const rich = (...ps) => `<div class="richtext">${ps.map(p => '<p>' + p + '</p>').join('')}</div>`;
const rule = () => `<div class="detail-divider" ${TAG('detail-row', 'Divider', '16740:306338')}></div>`;
const cards = (...cs) => `<div class="turn__cards">${cs.filter(Boolean).join('')}</div>`;
const citationCard = (title, rows) => `<div class="citation-card" ${TAG('citation-card', 'Copilot_Inline Citation Card', '905:301558')}>
    <div class="citation-card__top">${esc(title)}</div>
    <div class="citation-card__body">${rows.map(([q, a]) => `<div class="citation-card__row"><span class="citation-card__q">${q}</span><span class="citation-card__a">${a}</span></div>`).join('<span class="citation-card__rule"></span>')}</div></div>`;
const listItem = (icon, title, sub, status) => `<div class="list-item" ${TAG('list-item', 'List Item', '905:302681')}>
    <div class="list-item__content"><span class="list-item__icon">${icon}</span><span class="list-item__text"><span class="list-item__title">${esc(title)}</span><span class="list-item__sub">${esc(sub)}</span></span></div>
    ${pill('pill--status-success', esc(status))}</div>`;
/* Agent avatar for turns WITHOUT a CoT. Mirrors `.cot__avatar` exactly: 20×20
   brand-400 circle, ai-avatar glyph in white, hanging in the -28 gutter via
   absolute positioning so content still flows at col-left:0. CoT-carrying
   turns (steps/findings/summary) skip this — their `.cot__row` renders the
   same avatar inline at the same coordinates. */
const AVATAR = `<span class="turn__avatar" aria-hidden="true">${I['ai-avatar']}</span>`;
/* Document icon used in the artifact header (28×28 blue file glyph). */
const DOC_HEADER_SVG = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 6C0 2.68629 2.68629 0 6 0H28V28H6C2.68629 28 0 25.3137 0 22V6Z" fill="white"/><path d="M4.906 6.273C4.906 5.018 5.924 4 7.179 4h8.709l6.883 6.552c.171.17.266.402.266.643V21.727C23.037 22.983 22.019 24 20.764 24H7.179C5.924 24 4.906 22.983 4.906 21.727V6.273Z" fill="#3870A8"/><path d="M4.906 6.273C4.906 5.018 5.924 4 7.179 4h8.709l6.883 6.552c.171.17.266.402.266.643V21.727C23.037 22.983 22.019 24 20.764 24H7.179C5.924 24 4.906 22.983 4.906 21.727V6.273Z" fill="url(#docHeaderGrad)"/><path d="M15.887 8.863V4.004l6.722 6.41h-5.171c-.857 0-1.551-.694-1.551-1.551Z" fill="#6CA4CE"/><rect x="7.176" y="14.488" width="7.588" height="1.339" rx=".67" fill="white"/><rect x="7.176" y="18.059" width="12.05" height="1.339" rx=".67" fill="#6CA4CE"/><rect x="7.176" y="20.29" width="12.05" height="1.339" rx=".67" fill="#6CA4CE"/><defs><linearGradient id="docHeaderGrad" x1="16.548" y1="10.471" x2="19.672" y2="6.677" gradientUnits="userSpaceOnUse"><stop stop-color="#3870A8" stop-opacity=".2"/><stop offset="1" stop-color="#22456C"/></linearGradient></defs></svg>';
/* Document card face used inside the inline artifact card: a two-layer stack
   with a soft drop-shadow + a small blue document glyph. */
const DOC_CARD_SVG = '<svg width="56" height="50" viewBox="0 0 56 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g filter="url(#docCardShadow)"><path d="M16 5.5H40C44.142 5.5 47.5 8.858 47.5 13v47.5H8.5V13l.01-.386C8.71 8.651 11.987 5.5 16 5.5Z" fill="#FBFAF9" stroke="#EDEBE8"/><path d="M16 2.5H40C44.142 2.5 47.5 5.858 47.5 10v47.5H8.5V10l.01-.386C8.71 5.651 11.987 2.5 16 2.5Z" fill="white" stroke="#EDEBE8"/><path d="M18.906 14.273C18.906 13.017 19.924 12 21.179 12h8.709l6.883 6.552c.171.17.266.402.266.643V29.727C37.037 30.983 36.02 32 34.764 32H21.179C19.924 32 18.906 30.983 18.906 29.727V14.273Z" fill="#3870A8"/><path d="M18.906 14.273C18.906 13.017 19.924 12 21.179 12h8.709l6.883 6.552c.171.17.266.402.266.643V29.727C37.037 30.983 36.02 32 34.764 32H21.179C19.924 32 18.906 30.983 18.906 29.727V14.273Z" fill="url(#docCardGrad)"/><path d="M29.887 16.863V12.004l6.722 6.41h-5.171c-.857 0-1.551-.694-1.551-1.551Z" fill="#6CA4CE"/><rect x="21.176" y="22.488" width="7.588" height="1.339" rx=".67" fill="white"/><rect x="21.176" y="26.059" width="12.05" height="1.339" rx=".67" fill="#6CA4CE"/><rect x="21.176" y="28.29" width="12.05" height="1.339" rx=".67" fill="#6CA4CE"/></g><defs><filter id="docCardShadow" x="0" y="0" width="56" height="75" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="4"/><feOffset dy="6"/><feFlood flood-color="#000" flood-opacity=".08"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="docCardGrad" x1="30.548" y1="18.471" x2="33.673" y2="14.677" gradientUnits="userSpaceOnUse"><stop stop-color="#3870A8" stop-opacity=".2"/><stop offset="1" stop-color="#22456C"/></linearGradient></defs></svg>';
function renderTurn(t, ix, isNew) {
  const fade = isNew ? 'fade' : '';
  if (t.k === 'user') return `<div class="turn turn--user ${fade}"><div class="bubble"><span>${esc(t.text)}</span></div></div>`;
  if (t.k === 'agent') return `<div class="turn turn--agent ${fade}">${AVATAR}${t.html}</div>`;
  if (t.k === 'perm') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(renderPerm(t.id))}</div>`;
  if (t.k === 'drop') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(`<div class="drop">Or drop files here — the template, a counterparty's paper, a past redline.<br><span class="mono">PDF, DOCX, up to 50 files</span></div>`)}</div>`;
  if (t.k === 'sourcepick') return `<div class="turn turn--agent ${fade}" data-k="sourcepick">${AVATAR}${rich('Where are the agreements you want me to learn from?')}${cards(renderSourcePick())}</div>`;
  if (t.k === 'attachprompt') return `<div class="turn turn--agent ${fade}" data-k="attachprompt">${AVATAR}${rich('Go ahead — add your files in the chat below. I can read PDF and DOCX. Add as many as you need, then I will start.')}${cards(`<button class="drop drop--attach" type="button" data-attach-go><span class="drop__text"><span class="drop__link">Choose files and upload them here</span><span class="drop__aux">or drag and drop</span></span><span class="drop__hint">PDF • DOCX • up to 20 files</span></button>`)}</div>`;
  if (t.k === 'attached') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(renderAttachedList(t.files.slice(0, t.show || t.files.length)))}${t.commentary ? rich(t.commentary) : ''}</div>`;
  if (t.k === 'steps') return `<div class="turn turn--agent ${fade}">${renderSteps()}</div>`;
  if (t.k === 'findings') return `<div class="turn turn--agent ${fade}">${renderFindings()}</div>`;
  if (t.k === 'summary') return renderSummary();
  if (t.k === 'artifact') return `<div class="turn turn--agent ${fade}" data-k="artifact">${AVATAR}${cards(artifactCard())}</div>`;
  if (t.k === 'stream') {
    const caret = t.done ? '' : '<span class="stream-caret" aria-hidden="true"></span>';
    return `<div class="turn turn--agent ${fade}">${AVATAR}<div class="richtext"><p>${t.shown || ''}${caret}</p></div></div>`;
  }
  if (t.k === 'artifactPending') return `<div class="turn turn--agent ${fade}">${AVATAR}${cards(pendingArtifactCard())}</div>`;
  if (t.k === 'qprompt') return `<div class="turn turn--agent ${fade}" data-k="qprompt">${AVATAR}<div class="qprompt"><span class="qprompt__q">${esc(t.q)}</span></div></div>`;
  return '';
}
function artifactCard() {
  const t = T();
  return `<button class="inline-artifact-card" type="button" id="openArt" ${TAG('inline-artifact-card', 'Inline artifact card', '5717:486438')}>
    <span class="inline-artifact-card__main">
      <span class="inline-artifact-card__hover"><span class="inline-artifact-card__stack inline-artifact-card__stack--docf">${DOC_CARD_SVG}</span></span>
      <span class="inline-artifact-card__text">
        <span class="inline-artifact-card__title-row"><span class="inline-artifact-card__title" data-tip="ChargePoint ${esc(t.name)} Playbook">ChargePoint ${esc(t.name)} Playbook</span></span>
        <span class="inline-artifact-card__sub">Playbook • ${t.issues.length} issues • Version 1</span>
      </span>
    </span>
    <span class="inline-artifact-card__actions"><span class="btn btn--icon btn--neutral-tertiary" aria-hidden="true">${I['maximize-01']}</span></span>
  </button>`;
}
function pendingArtifactCard() {
  const t = T();
  return `<div class="inline-artifact-card inline-artifact-card--pending" role="status" aria-live="polite" aria-label="Creating playbook">
    <span class="inline-artifact-card__main">
      <span class="pending-spinner" aria-hidden="true"></span>
      <span class="inline-artifact-card__text">
        <span class="inline-artifact-card__title-row"><span class="inline-artifact-card__title">Creating ChargePoint ${esc(t.name)} Playbook</span></span>
        <span class="inline-artifact-card__sub">Drafting positions, routing approvers…</span>
      </span>
    </span>
  </div>`;
}

function permActs(id, open) {
  return `<div class="perm__acts">
    <button class="disclose" type="button" data-disc="perm${id}">${open ? 'Hide detail' : 'What I will read'}</button>
    <span class="spacer"></span>
    ${btn('btn--sm btn--neutral-tertiary', label("Don't allow"), `data-perm="${id}" data-v="denied"`)}
    ${btn('btn--sm btn--neutral-secondary', label('Allow once'), `data-perm="${id}" data-v="once"`)}
    ${btn('btn--sm btn--brand-primary', label('Always allow'), `data-perm="${id}" data-v="always"`)}
  </div>`;
}
function permDetail(id, p) {
  return `<div class="perm__detail"><span class="label">What I will read</span>
    <ul>${p.what.map(w => `<li>${esc(permText(id, w))}</li>`).join('')}</ul>
    <span class="perm__never">${esc(p.never)}</span></div>`;
}
function renderPerm(id) {
  const p = PERMS[id], st = S.perms[id], open = S.open['perm' + id];
  if (id !== 'docsource') return renderInlinePerm(id);
  return `<div class="perm">
    <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
      <div class="perm__body"><span class="perm__title">Where do the executed agreements live?</span><span class="perm__scope">Both are already connected for ChargePoint Legal · read-only · pick the one that holds the signed ${esc(T() ? T().corpus.label : 'agreements')}</span></div></div>
    ${!st ? `<div class="perm__pick">
      ${p.choices.map(c => `<button class="srcopt" type="button" data-src="${c.id}" aria-pressed="${S.src === c.id ? 'true' : 'false'}">
        <span class="srcopt__icon">${ICON[c.icon]}</span>
        <span class="srcopt__text"><b>${esc(c.label)}</b><span>${esc(permText(id, c.sub))}</span></span>
        <span class="srcopt__meta">${esc(permText(id, c.meta))}</span></button>`).join('')}</div>` : ''}
    ${open ? permDetail(id, p) : ''}
    ${st ? `<div class="perm__granted">${ICON.tick}${srcName()} · ${docsFor(T())} ${esc(T().corpus.label)} read, including their version history</div>`
      : `<div class="perm__acts">
        <button class="disclose" type="button" data-disc="perm${id}">${open ? 'Hide detail' : 'What I will read'}</button>
        <span class="spacer"></span>
        ${btn('btn--sm btn--brand-primary', label('Read from ' + srcName()), `data-perm="${id}" data-v="always"`)}
      </div>`}
  </div>`;
}
function renderInlinePerm(id) {
  const p = PERMS[id], open = S.open['perm' + id];
  return `<div class="perm">
    <div class="perm__top"><span class="perm__icon">${ICON[p.icon]}</span>
      <div class="perm__body"><span class="perm__title">${esc(p.name)}</span><span class="perm__scope">${esc(permText(id, p.scope))}</span></div></div>
    ${open ? permDetail(id, p) : ''}${permActs(id, open)}</div>`;
}

const LEARN_STEPS = [
  ['search-md-12', 'Opening the executed agreements', 'Opened the executed agreements', v => [`${v.N} documents`, srcName() + ' › Legal — Contracts', 'Version history']],
  ['book-open-01', 'Matching against the issue library', 'Matched against the issue library', v => [`${v.K} of ${v.K} matched`]],
  ['book-open-01', 'Reading how each position actually settled', 'Read how each position settled', v => [`${v.C} clauses`, `${v.P} counterparties`]],
  ['search-md-12', 'Checking the template against what was signed', 'Checked the template against what was signed', v => [`${v.NEW} new issues`, `${v.CF} conflicts`]]
];
function learnVals() { const t = T(); return { N: docsFor(t), K: t.issues.length, C: t.corpus.clauses, P: t.corpus.parties, NEW: t.issues.filter(i => i.isNew).length, CF: t.issues.filter(i => i.conflict).length }; }
function renderSteps() {
  const v = learnVals();
  const rows = LEARN_STEPS.map((st, i) => {
    const done = i < S.learnStep, now = i === S.learnStep;
    if (!done && !now) return '';
    return cotStep(st[0], done ? st[2] : st[1], { rich: true, results: done ? st[3](v) : null });
  }).join('') + (S.learnStep >= LEARN_STEPS.length ? cotStep('check-circle', 'Done', { done: true }) : '');
  return cot('learn', rows);
}
function renderFindings() {
  const t = T(), v = learnVals();
  const settled = t.issues.length - v.CF - v.NEW, news = t.issues.filter(i => i.isNew);
  return cards(citationCard('What I found', [
    ['Settled the same way in every agreement', `${settled} issues — taken as standard, I will not ask about them`],
    news.length ? ['Found on counterparty paper, not in the library', `${news.length} issues — ${news.map(n => esc(n.n)).join(', ')} — added to the inventory`] : null,
    ['Your template contradicts what you signed', `${v.CF} places — the only decisions I need from you`],
    ['Read', `${v.C} clauses across ${v.N} agreements and ${v.P} counterparties`]
  ].filter(Boolean)));
}
function renderSummary() {
  const t = T(), n = docsFor(t);
  const news = t.issues.filter(i => i.isNew), conf = t.issues.filter(i => i.conflict);
  const cls = new Set(t.issues.flatMap(i => i.cl)).size, fb2 = t.issues.filter(i => i.fb === 2).length;
  const skipped = (S.deferred || []).length;
  const chosen = S.answers.filter(a => !/^Skipped/.test(a.a)).map(a => a.a.split(' — ')[0]);
  const sources = [];
  if (S.perms.docsource && S.perms.docsource !== 'denied') sources.push(listItem(ICON[S.src === 'onedrive' ? 'onedrive' : 'sharepoint'], srcName(), `Legal — Contracts › Executed › ${t.name} · ${n} ${t.corpus.label}`, 'Connected'));
  if (S.perms.dealdesk && S.perms.dealdesk !== 'denied') sources.push(listItem(ICON.people, 'Deal Desk approval matrix', 'Approval thresholds and delegation of authority', 'Connected'));
  const answers = S.answers.map(a => [esc(a.q), esc(a.a)]);
  return `<div class="turn turn--agent">
    ${cot('answers', cotStep('script', 'Checking your answers', { dash: true }) + cotStep('search-md-12', 'Checking connected sources'), false)}
    ${rich(`Got it — ${chosen.length ? chosen.join(', ') + '. ' : ''}${skipped ? skipped + ' question' + (skipped === 1 ? '' : 's') + ' parked as deferred decisions. ' : ''}${srcName()} is connected — ${n} ${esc(t.corpus.label)} and their version history read.`)}
    ${cards(answers.length ? citationCard('Your answers', answers) : '', sources.join(''))}
    ${cards(citationCard('How I arrived at this playbook', [
      ['Read', `${n} ${esc(t.corpus.label)} from ${srcName()} — with their version history`],
      ['Analyzed', `${t.corpus.clauses} clauses across ${t.corpus.parties} counterparties`],
      ['Rules resolved', `${t.issues.length} — mapped to ${cls} clauses in your template`],
      news.length ? ['New issues folded in', `${news.length} from the counterparty paper: ${news.map(x => esc(x.n)).join(', ')}`] : null,
      chosen.length ? ['Your calls', `${chosen.length} answer${chosen.length === 1 ? '' : 's'} used to set positions where precedent split`] : null,
      ['Positions set', `across five tiers per your precedent`],
      fb2 ? ['Second-tier fallbacks', `${fb2} routed to ${S.approval ? esc(S.approval) : 'Associate GC'}`] : null,
      skipped ? ['Parked as deferred', `${skipped} question${skipped === 1 ? '' : 's'} — left for a human before publish`] : null
    ].filter(Boolean)))}
  </div>
  <div class="turn turn--agent">
    ${cot('build', cotStep('tool-02', 'Building', { dash: true }) + cotStep('ai-generate-text', `Drafting ${t.issues.length} issues across five tiers`, { dash: true }) + cotStep('ai-generate-document', `Mapping them to the ${cls} clauses they move`, { dash: true }) + cotStep('storage-tools-2', `Routing approvers on ${fb2} second fallbacks`, { dash: true }) + cotStep('book-open-01', 'Setting up where it lands', { dash: true }) + cotStep('check-circle', 'Created and saved to your playbooks'), false)}
    ${cards(artifactCard())}
  </div>`;
}
function bindThread() {
  const v = $view;
  v.querySelectorAll('[data-starter]').forEach(b => b.onclick = () => {
    const text = b.dataset.starter;
    S.thread.push({ k: 'user', text });
    S.thread.push({ k: 'agent', html: rich('Good one. I will pull that together — give me a moment while I read through the current playbook and the executed agreements.') });
    render();
  });
  v.querySelectorAll('[data-src]').forEach(b => b.onclick = () => { S.src = b.dataset.src; render(); });
  v.querySelectorAll('[data-perm]').forEach(b => b.onclick = () => answerPerm(b.dataset.perm, b.dataset.v));
  v.querySelectorAll('[data-disc]').forEach(b => b.onclick = () => { const k = b.dataset.disc; S.open[k] = !S.open[k]; render(); });
  v.querySelectorAll('[data-jump]').forEach(b => b.onclick = () => { S.tab = b.dataset.jump; S.canvasClosed = false; render(); });
  v.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { S.tab = 'all'; S.filter = 'all'; S.show = 'all'; S.psearch = ''; S.sel2 = b.dataset.open; S.canvasClosed = false; render(); });
  v.querySelectorAll('[data-cot]').forEach(b => b.onclick = () => { const k = b.dataset.cot; S.cotOpen[k] = S.cotOpen[k] === false; render(); });
  v.querySelectorAll('[data-attach-go]').forEach(b => b.onclick = () => openLocalFilePicker());
    v.querySelectorAll('[data-pick-source]').forEach(b => b.onclick = () => {
    if (b.dataset.pickSource === 'attach') {
      S.awaitFiles = true;
      S.thread.push({ k: 'user', text: 'Attach files directly' });
      S.thread.push({ k: 'attachprompt' });
    } else {
      S.thread.push({ k: 'user', text: 'SharePoint' });
      S.sheet = 'sp-picker'; S.spSelected = S.spSelected || {};
    }
    render();
  });
    const oa = document.getElementById('openArt'); if (oa) oa.onclick = () => { S.canvasMax = false; S.canvasClosed = false; render(); };
}

/* ============================== dock: question card + composer ============================== */
function composerExpandedHTML(ph, key) {
  return `<div class="copilot-input copilot-input--expanded" ${TAG('copilot-input', 'Copilot desktop Input Box', '5771:489155')}>
    <div class="copilot-input__bar">
      <div class="copilot-input__message"><textarea id="ta-${key}" rows="2" placeholder="${esc(ph)}" aria-label="Describe the contract"></textarea></div>
      <div class="copilot-input__action-bar">
        <div class="copilot-input__wrap"><button class="copilot-input__btn" type="button" id="clip-${key}" title="Add a document" aria-label="Add a document">${I['plus']}</button></div>
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
          <button class="copilot-input__btn" type="button" id="clip-${key}" title="Add a document" aria-label="Add a document">${I['plus']}</button>
          <div class="copilot-input__wrap">
            <button class="copilot-input__pill copilot-input__pill--source" type="button" title="${S.connected ? esc(srcName()) + ' connected' : 'No source connected'}" aria-label="Source">${I['building-05']}</button>
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
  return key === 'home' ? inner : `<div class="copilot-input-frame" data-figma-node="5975:416348">${inner}</div>`;
}
function bindComposer(key) {
  const ta = document.getElementById('ta-' + key);
  if (ta) {
    ta.oninput = () => {
      const cap = key === 'home' ? 208 : 156;
      const current = parseFloat(ta.style.height) || ta.clientHeight;
      const needed = Math.min(ta.scrollHeight, cap);
      if (needed > current) {
        ta.style.height = needed + 'px';   /* growing: no reset — transition eases from previous pixel to new pixel */
      } else {
        ta.style.transition = 'none';
        ta.style.height = 'auto';
        const shrunk = Math.min(ta.scrollHeight, cap);
        ta.style.height = shrunk + 'px';
        requestAnimationFrame(() => { ta.style.transition = ''; });
      }
      if (key !== 'home') {
        const wrap = ta.closest('.copilot-input');
        if (wrap) {
          const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 26;
          wrap.classList.toggle('copilot-input--grown', ta.scrollHeight > lineH * 1.4);
        }
      }
    };
    ta.onkeydown = e => {
      // Home composer, empty input: pressing "c" autocompletes to "Create a playbook"
      if (key === 'home' && e.key.length === 1 && e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey && ta.value === '') {
        e.preventDefault();
        ta.value = 'Create a playbook';
        ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 208) + 'px';
        ta.setSelectionRange(ta.value.length, ta.value.length);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFree(ta.value); }
    };
  }
  const sb = document.getElementById('send-' + key); if (sb) sb.onclick = () => submitFree(ta ? ta.value : '');
  const cb = document.getElementById('clip-' + key); if (cb) cb.onclick = (e) => { e.stopPropagation(); openPlusMenu(cb); };
}
/* "+" popover — see Figma. Upload / Vault / connectors, plus footer. */
function openPlusMenu(anchor) {
  closePlusMenu();
  const r = anchor.getBoundingClientRect();
  const host = document.createElement('div');
  host.id = 'plusMenuHost';
  host.className = 'plus-menu-host';
  const UPLOAD_ICON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5A3.5 3.5 0 0 1 4.6 4.6a4 4 0 0 1 7.87.9A3 3 0 0 1 12 11.5"/><path d="M8 7v6M5.67 9.33 8 7l2.33 2.33"/></svg>';
  const VAULT_ICON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6.67V4.5A1.5 1.5 0 0 1 3.5 3h3.03a1.5 1.5 0 0 1 1.06.44l.94.93h4A1.5 1.5 0 0 1 14 5.87v5.63A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5V6.67Z"/><path d="M10.67 9.67c0 .74-.6 1.33-1.34 1.33-.73 0-1.33-.6-1.33-1.33 0-.74.6-1.34 1.33-1.34s1.34.6 1.34 1.34Z"/></svg>';
  const ND_ICON = '<span class="plus-menu__logo plus-menu__logo--nd">nd</span>';
  const SP_ICON = '<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="20" height="20" rx="4" fill="#036C70"/><path d="M9.4 5.6a3.6 3.6 0 1 0 3.556 4.146 4.15 4.15 0 0 1-3.556-4.078V5.6Zm4.9 3.6a3.6 3.6 0 1 0-3.55 3.6h.05a4.15 4.15 0 0 1 3.5-3.55V9.2ZM15 12.85a3.15 3.15 0 1 1-2.87-3.132 4.14 4.14 0 0 0 2.87 3.132Z" fill="#fff"/></svg>';
  const GD_ICON = '<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#4285f4" d="M6.8 3 3 9.6 6.8 16.2h6.4L17 9.6 13.2 3z"/><path fill="#0f9d58" d="M6.8 3l3.2 5.6L13.2 3z"/><path fill="#f4b400" d="M13.2 3L10 8.6l3.2 5.6L17 9.6z"/><path fill="#db4437" d="M6.8 16.2l3.2-5.6h3.2l-3.2 5.6z"/></svg>';
  const EP_ICON = '<span class="plus-menu__logo plus-menu__logo--ep">e</span>';
  const BOX_ICON = '<span class="plus-menu__logo plus-menu__logo--box">box</span>';
  host.innerHTML = `<div class="plus-menu" role="menu">
    <button class="plus-menu__lead" type="button" data-plus-upload>
      <span class="plus-menu__lead-text"><span class="plus-menu__lead-title">Upload files</span><span class="plus-menu__lead-sub">Max 500MB overall, 50 files</span></span>
      <span class="plus-menu__lead-icon">${UPLOAD_ICON}</span>
    </button>
    <button class="plus-menu__lead" type="button" data-plus-vault>
      <span class="plus-menu__lead-text"><span class="plus-menu__lead-title">Vault</span><span class="plus-menu__lead-sub">Choose a vault</span></span>
      <span class="plus-menu__lead-icon">${VAULT_ICON}</span>
    </button>
    <div class="plus-menu__sep"></div>
    <button class="plus-menu__row" type="button" data-plus-src="netdocs"><span class="plus-menu__row-name">NetDocuments</span><span class="plus-menu__row-icon">${ND_ICON}</span></button>
    <button class="plus-menu__row" type="button" data-plus-src="sharepoint"><span class="plus-menu__row-name">SharePoint</span><span class="plus-menu__row-icon">${SP_ICON}</span></button>
    <button class="plus-menu__row" type="button" data-plus-src="gdrive"><span class="plus-menu__row-name">Google Drive</span><span class="plus-menu__row-icon">${GD_ICON}</span></button>
    <button class="plus-menu__row" type="button" data-plus-src="epona"><span class="plus-menu__row-name">Epona</span><span class="plus-menu__row-icon">${EP_ICON}</span></button>
    <button class="plus-menu__row" type="button" data-plus-src="box"><span class="plus-menu__row-name">Box</span><span class="plus-menu__row-icon">${BOX_ICON}</span></button>
    <div class="plus-menu__sep"></div>
    <button class="plus-menu__foot" type="button" data-plus-upload><span class="plus-menu__foot-icon">${UPLOAD_ICON}</span><span>Upload files</span></button>
  </div>`;
  document.body.appendChild(host);
  const menu = host.querySelector('.plus-menu');
  const menuH = menu.offsetHeight || 340;
  const spaceBelow = window.innerHeight - r.bottom;
  menu.style.left = Math.max(8, r.left) + 'px';
  if (spaceBelow >= menuH + 12 || spaceBelow >= r.top) {
    menu.style.top = (r.bottom + 6) + 'px';
  } else {
    menu.style.bottom = (window.innerHeight - r.top + 6) + 'px';
  }
  host.querySelectorAll('[data-plus-upload]').forEach(b => b.onclick = () => { closePlusMenu(); openLocalFilePicker(); });
  host.querySelectorAll('[data-plus-vault]').forEach(b => b.onclick = () => { closePlusMenu(); S.sheet = 'sp-picker'; S.spSelected = S.spSelected || {}; render(); });
  host.querySelectorAll('[data-plus-src]').forEach(b => b.onclick = () => {
    const src = b.dataset.plusSrc;
    closePlusMenu();
    if (src === 'sharepoint') { S.sheet = 'sp-picker'; S.spSelected = S.spSelected || {}; render(); }
    else openLocalFilePicker();
  });
  setTimeout(() => {
    const onDoc = (ev) => { if (ev.target.closest('.plus-menu') || ev.target === anchor) return; closePlusMenu(); document.removeEventListener('mousedown', onDoc); };
    document.addEventListener('mousedown', onDoc);
    host.__off = onDoc;
  }, 0);
}
function closePlusMenu() {
  const h = document.getElementById('plusMenuHost');
  if (h) { if (h.__off) document.removeEventListener('mousedown', h.__off); h.remove(); }
}
function openLocalFilePicker() {
  let inp = document.getElementById('localFilePicker');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file'; inp.multiple = true; inp.id = 'localFilePicker';
    inp.accept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    inp.style.position = 'fixed'; inp.style.left = '-9999px'; inp.style.opacity = '0';
    document.body.appendChild(inp);
    inp.addEventListener('change', () => {
      const picked = Array.from(inp.files || []);
      inp.value = '';
      if (!picked.length) return;
      handlePickedLocalFiles(picked);
    });
  }
  inp.click();
}
function handlePickedLocalFiles(picked) {
  S.awaitFiles = false; S.type = 'nda'; S.connected = true;
  S.thread.push({ k: 'user', text: 'Attached ' + picked.length + ' file' + (picked.length === 1 ? '' : 's') });
  streamAttach(ATTACHED_FILES, 'Read all 3. Two are counterparty paper from Elite Semiconductor — a signed MNDA (July 2025) and an unsigned NDA template. The third is the CP Mutual NDA 2025 baseline.<br><br>Before I build the playbook I need answers to <strong>3 quick questions</strong> — the ESMT paper deviates from your template on residuals, jurisdiction and the non-solicit.', startLearning);
  render();
}
function questionCard() {
  const qs = allQs(), q = qs[S.qi]; if (!q) return '';
  const pend = S.pendingPerm;
  const canPrev = S.qi > 0, canNext = S.qi < qs.length - 1;
  return `<div class="question-card" ${TAG('question-card', 'Copilot_Question Card', '875:165670')}>
    <div class="question-card__top">
      <div class="question-card__lead"><div class="question-card__q"><span class="question-card__question">${esc(q.q)}</span>${q.ev ? `<span class="question-card__evidence">${esc(q.ev)}</span>` : ''}</div></div>
      <div class="question-card__nav">
        ${btn('btn--icon-sm btn--neutral-tertiary', I['chevron-left'], `id="qPrev" aria-label="Previous question"${canPrev ? '' : ' disabled'}`)}
        <span class="question-card__count">${S.qi + 1} of ${qs.length}</span>
        ${btn('btn--icon-sm btn--neutral-tertiary', I['chevron-right'], `id="qNext" aria-label="Next question"${canNext ? '' : ' disabled'}`)}
      </div>
      ${btn('btn--icon-sm btn--neutral-tertiary question-card__close', I['x-close'], 'id="qClose" aria-label="Answer later" title="Park the remaining questions as deferred decisions"')}
    </div>
    ${pend ? `<div class="question-card__body">${renderInlinePerm(pend)}</div>` : `
    <div class="question-card__body">
      ${q.opts.map((o, i) => `<button class="question-card__option" type="button" data-opt="${i}">
        <span class="question-card__badge">${i + 1}</span>
        <span class="question-card__text">${esc(o.b)}${o.s ? ' — ' + esc(o.s.charAt(0).toLowerCase() + o.s.slice(1)) : ''}</span><span class="question-card__arrow">${I['arrow-right']}</span></button>${i < q.opts.length - 1 ? '<span class="question-card__rule"></span>' : ''}`).join('')}
      <span class="question-card__rule"></span>
      <div class="question-card__free">
        <span class="question-card__free-in"><span class="question-card__badge question-card__badge--edit">${I['edit']}</span>
          <input id="qFree" type="text" placeholder="Describe the position you want" aria-label="Answer in your own words"></span>
        ${btn('btn--xs btn--neutral-secondary', label('Skip'), 'data-opt="skip"')}
      </div>
    </div>`}
  </div>`;
}
function renderDock() {
  const d = document.getElementById('dock'); if (!d) return;
  const ph = S.stage === 'playbook' ? 'Ask for a change to the playbook' : S.stage === 'ask' ? 'Or ask me something about this playbook' : 'Add context, or drop a document';
  setHTML(d, (S.stage === 'ask' ? questionCard() : '') + composerHTML(ph, 'chat'));
  if (S.stage === 'ask') {
    const q = allQs()[S.qi];
    if (S.pendingPerm) {
      d.querySelectorAll('[data-perm]').forEach(b => b.onclick = () => {
        const v = b.dataset.v, pend = S.pendingPerm; S.perms[pend] = v; S.pendingPerm = null;
        if (v === 'denied') chooseOption(1, 'Associate GC for every fallback');
        else chooseOption(0, 'Contracts Manager to $250k ACV, then Associate GC — read from the Deal Desk matrix');
      });
      d.querySelectorAll('[data-disc]').forEach(b => b.onclick = () => { const k = b.dataset.disc; S.open[k] = !S.open[k]; renderDock(); });
    } else {
      d.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
        const v = b.dataset.opt;
        if (v === 'skip') return chooseOption('skip', 'Skipped — parked as a deferred decision');
        const i = +v, o = q.opts[i];
        if (o.perm) { S.pendingPerm = o.perm; return renderDock(); }
        chooseOption(i, o.b);
      });
      const fr = document.getElementById('qFree'); if (fr) fr.onkeydown = e => { if (e.key === 'Enter' && fr.value.trim()) chooseOption(0, fr.value.trim(), true); };
    }
    const cl = document.getElementById('qClose'); if (cl) cl.onclick = () => {
      const qs = allQs();
      for (let i = S.qi; i < qs.length; i++) S.deferred.push({ q: qs[i].q, why: 'Parked from the interview — the playbook uses what the precedent says until someone decides.', owner: 'CLM — Commercial Legal', due: 'Before this playbook is published', skipped: true });
      S.qi = qs.length; finishInterview();
    };
    const pv = document.getElementById('qPrev'); if (pv) pv.onclick = () => { if (S.qi > 0) { S.qi--; renderDock(); } };
    const nx = document.getElementById('qNext'); if (nx) nx.onclick = () => { const qs = allQs(); if (S.qi < qs.length - 1) { S.qi++; renderDock(); } };
  }
  bindComposer('chat');
}

/* ============================== artifact canvas ============================== */
function pbId(t) { const ix = TYPES.findIndex(x => x.id === t.id); return 'PB' + String(123 + ix * 7).padStart(5, '0'); }
function renderCanvas() {
  const t = T();
  return `<div class="canvas" data-figma-node="1809:488550">
    <header class="artifact-header" ${TAG('artifact-header', 'Arifact Header', '3838:245967')}>
      <div class="artifact-header__content">
        <div class="artifact-header__left">
          <span class="artifact-header__icon">${DOC_HEADER_SVG}</span>
          <button class="artifact-header__title" type="button" title="Rename"><span class="artifact-header__title-text">ChargePoint ${esc(t.name)} Playbook</span></button>
          ${S.focused ? `<span class="artifact-header__divider" aria-hidden="true"></span><button type="button" class="ai-chat-btn${S.chatOpen ? ' ai-chat-btn--on' : ''}" data-ai-chat aria-pressed="${!!S.chatOpen}">${I['ai-star'] || ''}<span>AI Chat</span></button>` : ''}
        </div>
        <div class="artifact-header__actions">
          <div class="artifact-header__group"><button class="artifact-header__version" type="button" data-tip="Version history">v1.0${I['chevron-down-sm']}</button></div>
          <div class="artifact-header__group">
            ${btn('btn--xs btn--brand-primary artifact-header__publish', I['book'] + label('Publish'), 'id="pubBtn" aria-haspopup="dialog"')}
          </div>
          <div class="artifact-header__group artifact-header__group--tight">
            ${btn('btn--icon btn--neutral-tertiary', I['maximize-01'], `id="maxBtn" aria-label="${S.canvasMax ? 'Show the chat' : 'Expand'}" aria-pressed="${S.canvasMax ? 'true' : 'false'}"`)}
            ${btn('btn--icon btn--neutral-tertiary', I['x-close'], 'id="closeArt" aria-label="Close"')}
          </div>
        </div>
      </div>
    </header>
    ${S.focused ? `<div class="canvas__inner">
      ${rulesPanel()}
      <div class="canvas__body" id="canvasBody" data-md="${S.tab === 'all' && (S.docView||'stack') === 'split' ? '1' : '0'}"><div class="doc" id="canvasDoc"></div></div>
    </div>` : `<div class="canvas__body" id="canvasBody" data-md="${S.tab === 'all' && (S.docView||'stack') === 'split' ? '1' : '0'}"><div class="doc" id="canvasDoc"></div></div>`}
  </div>`;
}
function bindCanvas() {
  const mx = document.getElementById('maxBtn'); if (mx) mx.onclick = () => { S.canvasMax = !S.canvasMax; render(); };
  const cl = document.getElementById('closeArt'); if (cl) cl.onclick = () => { S.canvasMax = false; S.canvasClosed = true; render(); };
  const pb = document.getElementById('pubBtn');
  if (pb) pb.onclick = (e) => {
    e.stopPropagation();
    if (pb.disabled) return;
    S.sheet = 'publish';
    render();
  };
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { S.docView = b.dataset.view; render(); });
  document.querySelectorAll('[data-ai-chat]').forEach(b => b.onclick = () => { S.chatOpen = !S.chatOpen; render(); });
  const sb = document.getElementById('srcBtn'); if (sb) sb.onclick = () => { S.sheet = 'perms'; render(); };
  if (S.focused) bindRulesPanel();
}


/* fuzzy match — "create/new/make/build/start/draft/spin up (a|the) playbook" ± typos and no article */

function looksLikeEditPlaybook(str) {
  const t = String(str || '').toLowerCase();
  return /(edit|update|modify|change|extend|add)\s+(the\s+)?(playbook|play book)|add\s+(a\s+)?(new\s+)?issue|new\s+issue/.test(t);
}
function looksLikeCreatePlaybook(str) {
  const t = String(str || '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t) return false;
  const verb = /(create|creat|creaet|creating|make|makin|new|start|begin|build|draft|spin ?up|set ?up|setup|generate|open|need|want)/;
  const noun = /(p[a-z]{0,3}book[s]?)/;   /* any p…book word — playbook, plaboook, plabook, paybook, plybook, etc. */
  return verb.test(t) && noun.test(t);
}
function renderSourcePick() {
  /* Figma 12007:53488 — Copilot_Question Card. Two rows in a citation body:
     SharePoint (colour-filled 20 tile) + Attach files directly (neutral tile
     with a 12 upload arrow). */
  const SP_TILE = '<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="20" height="20" rx="4" fill="#036C70"/><path d="M9.4 5.6a3.6 3.6 0 1 0 3.556 4.146 4.15 4.15 0 0 1-3.556-4.078V5.6Zm4.9 3.6a3.6 3.6 0 1 0-3.55 3.6h.05a4.15 4.15 0 0 1 3.5-3.55V9.2ZM15 12.85a3.15 3.15 0 1 1-2.87-3.132 4.14 4.14 0 0 0 2.87 3.132Z" fill="#fff"/></svg>';
  const UPLOAD = '<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 7.5V8.7c0 .84 0 1.26-.163 1.581a1.5 1.5 0 0 1-.656.656C9.36 11.1 8.94 11.1 8.1 11.1H3.9c-.84 0-1.26 0-1.581-.163a1.5 1.5 0 0 1-.656-.656C1.5 9.96 1.5 9.54 1.5 8.7V7.5M8.5 4 6 1.5m0 0L3.5 4M6 1.5v7"/></svg>';
  const row = (id, icon, iconClass, title, sub) => `<div class="source-picker__row" data-pick-source="${id}" role="button" tabindex="0">
    <span class="source-picker__row-icon ${iconClass}">${icon}</span>
    <span class="source-picker__row-text"><span class="source-picker__row-title">${esc(title)}</span><span class="source-picker__row-sub">${esc(sub)}</span></span>
  </div>`;
  return `<div class="source-picker">
    <div class="source-picker__top-bar"><div class="source-picker__title">Choose a Document Source</div></div>
    <div class="source-picker__citation">
      ${row('sharepoint', SP_TILE, 'source-picker__row-icon--filled', 'SharePoint', 'Legal - Contracts — Executed • 84 files')}
      <span class="source-picker__rule" role="separator" aria-hidden="true"></span>
      ${row('attach', UPLOAD, '', 'Attach files directly', 'Upload PDF or DOCX from your computer')}
    </div>
  </div>`;
}
const MSA_FILES = [
  { name: 'Rivian_Depot_MSA_2025_Signed.pdf',       sub: '§§ 24 · California law · Assure Elite · 3-year term · Rivian · Aug 12 2025', tag: 'MSA · Signed', tone: 'success' },
  { name: 'Kaiser_Permanente_MSA_2024_Signed.pdf',  sub: '§§ 22 · California law · Assure Standard · 5-year term · Kaiser · Nov 04 2024', tag: 'MSA · Signed', tone: 'success' },
  { name: 'Prologis_MultiSite_MSA_Draft_v3.docx',   sub: '§§ 21 · Delaware law · liability cap in play · Prologis · Redlines pending', tag: 'MSA · In redline', tone: 'warning' },
  { name: 'CP_MSA_2025_NA_Template.docx',           sub: 'CP template · California law · 3-year term · ChargePoint · 2025', tag: 'CP MSA Baseline', tone: 'gray' }
];
const SP_FILES = [
  { name: 'v1_Elite_Semiconductor_chargepoint_MNDA_120926_Draft.docx', meta: '9 §§ · Singapore law · ICC arbitration · ESMT · Jul 31 2025', tag: 'MNDA · Signed' },
  { name: 'v1_Elite_Semiconductor_chargepoint_NDA_120926_Draft.docx',  meta: '9 §§ · Singapore law · blank effective date · ESMT · Undated', tag: 'NDA · Template', tagWarn: true },
  { name: 'CP_Mutual_NDA_2025_NA.docx',                                meta: 'CP template · California law · 3-year term · ChargePoint · Feb 2025', tag: 'CP Mutual NDA Baseline' },
  { name: 'CP_MSA_2025_NA_v3.docx',                                     meta: '18 §§ · California law · SaaS+HW · ChargePoint · Jan 2025', tag: 'MSA · Template' },
  { name: 'ACME_Corp_MNDA_Signed.pdf',                                  meta: '9 §§ · Delaware law · ACME · Apr 2024', tag: 'MNDA · Signed' }
];
const ATTACHED_FILES = [
  { name: 'v1_Elite_Semiconductor_chargepoint_MNDA_120926_Draft.docx', sub: '9 §§ · Singapore law · ICC arbitration · ESMT · Jul 31 2025', tag: 'MNDA · Signed', tone: 'success' },
  { name: 'v1_Elite_Semiconductor_chargepoint_NDA_120926_Draft.docx',  sub: '9 §§ · Singapore law · blank effective date · ESMT · Undated', tag: 'NDA · Template', tone: 'warning' },
  { name: 'CP_Mutual_NDA_2025_NA.docx', sub: 'CP template · California law · 3 yr term · ChargePoint · 2025', tag: 'CP Mutual NDA Baseline', tone: 'gray' }
];
function renderAttachedList(files) {
  const tone = { success: 'pill--squared pill--success', warning: 'pill--squared pill--warning', gray: 'pill--squared pill--gray' };
  const OUTLINE_DOC = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2.5h5l4 4V16a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 16V4A1.5 1.5 0 0 1 6.5 2.5H6Z"/><path d="M11 2.5V6h4"/></svg>';
  return `<div class="attach-list">${files.map(f => `<div class="attach-row">
    <span class="attach-row__icon">${OUTLINE_DOC}</span>
    <span class="attach-row__name" title="${esc(f.name)}">${esc(f.name)}</span>
    ${pill(tone[f.tone] || tone.gray, esc(f.tag))}
  </div>`).join('')}</div>`;
}


/* Stream helper: keep the thread scrolled to the bottom on every tick */
function _scrollThread() {
  const sc = document.getElementById('threadScroll');
  if (sc) sc.scrollTop = sc.scrollHeight;
}
/* Stream one agent sentence word-by-word so an answer never snaps in.
   Words are drip-fed on rAF-timed ticks; done fires after the caret settles. */
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
function streamAttach(files, commentary, done) {
  const turn = { k: 'attached', files: files, show: 0, commentary: '' };
  S.thread.push(turn); render(); _scrollThread();
  let i = 0;
  const step = () => {
    if (i < files.length) { turn.show = ++i; render(); _scrollThread(); setTimeout(step, 420); }
    else if (!turn.commentary) { turn.commentary = commentary; render(); _scrollThread(); setTimeout(step, 260); }
    else if (done) { done(); _scrollThread(); }
  };
  setTimeout(step, 260);
}

/* ============================== flow ============================== */
function homeGrant(v) { S.perms.docsource = v; S.homeConnect = false; S.connected = true; S.unclass = UNCLASS_SEED.slice(); render(); }
function intro(t, cls) {
  return rich(
    `I hold <strong>${t.issues.length} negotiation issues</strong> for this contract type, mapped to <strong>${cls.size} clauses</strong> across the ChargePoint paper — caps, data rights, uptime, termination, the usual shape of the argument.`,
    S.connected ? 'I have already read your ' + docsFor(t) + ' executed agreements of this type from ' + srcName() + ', including their version history — so I know not just where you <em>landed</em> but what you <em>gave up</em> to get there.'
      : 'That library is generic. To make the positions <em>yours</em>, I will read what ChargePoint has actually signed — the executed agreements and their version history, which is where the concessions live. Tell me where they are.');
}
function pickType(id) {
  S.type = id; S.stage = 'sources'; S.thread = [];
  const t = T(), cls = new Set(t.issues.flatMap(i => i.cl));
  S.thread.push({ k: 'user', text: t.name });
  S.thread.push({ k: 'agent', html: intro(t, cls) });
  if (S.connected) startLearning(); else S.thread.push({ k: 'perm', id: 'docsource' });
  render();
}
function answerPerm(id, v) {
  S.perms[id] = v;
  if (id === 'docsource') {
    S.connected = true; if (!S.unclass) S.unclass = UNCLASS_SEED.slice();
    startLearning();
  }
  render();
}
function startLearning() {
  if (S.learnStarted) return; S.learnStarted = true;
  S.stage = 'learn'; S.learnStep = 0;
  S.thread.push({ k: 'steps' });
  render();
  const step = () => { S.learnStep++; if (S.learnStep <= LEARN_STEPS.length) { render(); _scrollThread(); setTimeout(step, 620); } else finishLearning(); };
  setTimeout(step, 700);
}
function finishLearning() {
  const t = T(), conf = t.issues.filter(i => i.conflict).length;
  S.cotOpen.learn = false;
  S.thread.push({ k: 'findings' });
  S.thread.push({ k: 'agent', html: rich(`I can answer <strong>${t.issues.length - conf} of ${t.issues.length}</strong> issues from your own precedent without asking you anything. The rest need a human decision, so I will ask <strong>${allQs().length} questions</strong> — one at a time, below.`) });
  S.stage = 'ask'; S.qi = 0;
  t.issues.forEach(i => { S.sel[i.id] = 0; });
  postEvidence();
  render();
}
function chooseOption(i, lbl, free) {
  const qs = allQs(), q = qs[S.qi];
  S.answers.push({ q: q.q, a: lbl });
  S.thread.push({ k: 'qprompt', q: q.q });
  S.thread.push({ k: 'user', text: lbl });
  if (q.issue && i !== 'skip' && !free) { const set = q.opts[i].set; if (typeof set === 'number') { S.sel[q.issue] = set; S.fromAnswer[q.issue] = lbl; } }
  if (q.approval) S.approval = lbl;
  if (i === 'skip') S.deferred.push({ q: q.q, why: 'Skipped during the interview — the playbook uses what the precedent says until someone decides.', owner: 'CLM — Commercial Legal', due: 'Before this playbook is published', skipped: true });
  S.qi++;
  if (S.qi >= qs.length) finishInterview(); else { postEvidence(); render(); }
}
/* the card (905:283982) carries the question only; its evidence sentence is the agent's line above it */
function postEvidence() {
  return;
}
function finishInterview() {
  S.stage = 'learn'; render();
  streamText('That is everything. Drafting the playbook — positions set across five tiers, approvers routed, every issue mapped to the clauses it moves.', () => {
    S.thread.push({ k: 'artifactPending' }); render(); _scrollThread();
    setTimeout(() => {
      const ix = S.thread.findIndex(x => x.k === 'artifactPending');
      if (ix >= 0) S.thread.splice(ix, 1);
      S.open = {};
      S.cotOpen.answers = false;
      S.cotOpen.build = false;
      S.thread.push({ k: 'summary' });
      render(); _scrollThread();
      /* 1.2s beat after the artifact lands in chat — lets the eye settle on the
         completed card before the side panel starts sliding in from the right. */
      setTimeout(() => {
        S.stage = 'playbook';
        S.canvasClosed = false;
        S.savedPlaybooks = S.savedPlaybooks || [];
        const t = T();
        if (t && !S.savedPlaybooks.find(p => p.type === S.type)) {
          S.savedPlaybooks.push({ type: S.type, name: t.name, savedAt: Date.now() });
        }
        render();
      }, 1200);
    }, 5000);
  });
}
function submitFree(v) {
  if (v === '__attach__') {
    if (S.awaitFiles) {
      S.awaitFiles = false; S.type = 'nda'; S.connected = true;
      S.thread.push({ k: 'user', text: 'Attached ' + ATTACHED_FILES.length + ' files' });
      streamAttach(ATTACHED_FILES, 'Read all 3. Two are counterparty paper from Elite Semiconductor — a signed MNDA (July 2025) and an unsigned NDA template. The third is the CP Mutual NDA 2025 baseline.<br><br>Before I build the playbook I need answers to <strong>3 quick questions</strong> — the ESMT paper deviates from your template on residuals, jurisdiction and the non-solicit.', startLearning);
      render(); return;
    }
    if (S.stage === 'start') { pickType('msa'); return; }
    /* Paperclip clicked when we are not expecting an attachment — do nothing.
       (Previously pushed a canned "Attached … / Read it …" pair each click,
       which duplicated across the thread and clobbered the real flow.) */
    return;
  }
  const s = (v || '').trim(); if (!s) return;
  if (S.stage === 'playbook' && (looksLikeEditPlaybook(s) || S.addingIssue !== undefined)) {
    S.thread.push({ k: 'user', text: s });
    if (S.addingIssue === 'awaiting') {
      const parts = s.split(/[:\-—]/);
      const name = (parts[0] || s).trim().slice(0, 90);
      const why  = (parts.slice(1).join(':').trim() || 'Added from chat — refine the ladder later.');
      const t = T();
      const newIssue = {
        id: 'CUSTOM-' + (Date.now() % 10000),
        n: name,
        c: 'Custom',
        r: 'standard',
        cl: ['Added by user'],
        w: why,
        num: t.issues.length + 1,
        ref: 'Custom',
        freq: 0,
        settled: 0,
        rounds: 0,
        fb: 0,
        p: [
          P('CP Template', why, 'Standard — no approval', ''),
          P('Also acceptable', 'Alternate wording accepted case by case.', 'Contracts Manager'),
          P('Red line', 'Reject if the counterparty refuses the CP Template.', 'GC only')
        ]
      };
      t.issues.push(newIssue);
      S.sel[newIssue.id] = 0;
      S.sel2 = newIssue.id;
      S.addingIssue = undefined;
      S.thread.push({ k: 'agent', html: rich('Added <strong>' + esc(newIssue.n) + '</strong> as issue #' + newIssue.num + '. It is now on the artifact.') });
      render(); return;
    }
    S.addingIssue = 'awaiting';
    S.thread.push({ k: 'agent', html: rich('Sure — what is the new issue? Give me a short name, then a colon or dash, then the CP Template position. Example: <em>Assignment on change of control — consent required, not to be unreasonably withheld</em>.') });
    render(); return;
  }
  if (S.stage === 'start' && looksLikeCreatePlaybook(s)) {
    S.stage = 'sources'; S.thread = [];
    S.thread.push({ k: 'user', text: s });
    S.thread.push({ k: 'sourcepick' });
    render(); return;
  }
  if (S.stage === 'sources' && !S.type) {
    S.thread.push({ k: 'user', text: s });
    S.thread.push({ k: 'agent', html: rich('Add the files below when you are ready, or pick a source above.') });
    render(); return;
  }
  if (S.stage === 'start') {
    const hit = TYPES.find(t => s.toLowerCase().includes(t.id))
      || (/site host|landlord|property|reit|multifamily/i.test(s) ? TYPES[2] : /fleet|depot|caas|bus|van/i.test(s) ? TYPES[1] : /reseller|partner|channel|distributor|dealer/i.test(s) ? TYPES[3]
      : /nda|non-disclos|confidential/i.test(s) ? TYPES[6] : /city|state|federal|municipal|nevi|transit|public/i.test(s) ? TYPES[4] : /utility|make-ready|rebate|demand response/i.test(s) ? TYPES[5]
      : /dpa|gdpr|privacy|processor/i.test(s) ? TYPES[8] : /contractor|installer|subcontract|electrician/i.test(s) ? TYPES[7] : TYPES[0]);
    S.type = hit.id; S.stage = 'sources'; S.thread = [];
    const cls = new Set(hit.issues.flatMap(i => i.cl));
    S.thread.push({ k: 'user', text: s });
    S.thread.push({ k: 'agent', html: rich(
      `That reads as a <strong>${esc(hit.name)}</strong>. I hold <strong>${hit.issues.length} issues</strong> for it, across <strong>${cls.size} clauses</strong>. Say so if I have picked the wrong shape.`,
      S.connected ? 'I have already read your executed agreements from ' + srcName() + '.' : 'Before I ask you anything, I want to read what ChargePoint has already signed. Tell me where the executed agreements live.') });
    if (S.connected) startLearning(); else S.thread.push({ k: 'perm', id: 'docsource' });
    render(); return;
  }
  S.thread.push({ k: 'user', text: s });
  S.thread.push({ k: 'agent', html: rich('Noted — I have folded that into the playbook.') });
  render();
}

/* ============================== playbook ============================== */
const TIER = ['CP Template', 'Also acceptable', 'Fallback 1', 'Fallback 2', 'Red line'];
const TABS = [['all', 'All issues'], ['data', 'Negotiation data']];
const fbLabel = i => i.fb === 0 ? 'Baseline — no fallbacks needed' : i.fb === 1 ? 'One fallback tier approved' : 'Two fallback tiers approved';
const freqLabel = i => i.freq ? 'Negotiated in ' + i.freq + '% of deals' : 'Never negotiated';
function provList() {
  const t = T(); let list = t.issues.slice();
  if (S.filter !== 'all') list = list.filter(i => (i.r || 'standard') === S.filter);
  if (S.show === 'fb') list = list.filter(i => i.fb > 0);
  if (S.show === 'base') list = list.filter(i => i.fb === 0);
  const q = (S.psearch || '').trim().toLowerCase();
  if (q) list = list.filter(i => (i.n + ' ' + i.id + ' ' + i.c + ' ' + i.cl.join(' ') + ' ' + i.w).toLowerCase().includes(q));
  return list;
}
function deferList() { return (DEFER[S.type] || []).concat(S.deferred || []); }
function renderPlaybook($doc) {
  const t = T(), all = t.issues, cls = new Set(all.flatMap(i => i.cl));
  const counts = { critical: 0, elevated: 0, standard: 0 }; all.forEach(i => counts[i.r || 'standard']++);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!S.firstIssueInit && all.length) {
    S.open['card:' + all[0].id] = true;
    S.firstIssueInit = true;
  }
  $doc.innerHTML = `
    <div class="doc__head">
      <div class="doc__meta" data-figma-node="1809:488589">
        <span class="doc__meta-item"><span class="label">Template</span><span class="doc__meta-v">${esc(t.template)}</span></span>
        <span class="doc__meta-item"><span class="label">Corpus</span><span class="doc__meta-v">${docsFor(t)} ${esc(t.corpus.label)} · ${t.corpus.parties} counterparties</span></span>
        <span class="doc__meta-item"><span class="label">Owner</span><span class="doc__meta-v">CLM — Commercial Legal</span></span>
        <span class="doc__meta-item"><span class="label">Generated</span><span class="doc__meta-v">${today}</span></span>
        <span class="doc__meta-item"><span class="label">Read from</span><span class="doc__meta-v">${S.connected ? esc(srcName()) : 'Provision library only'}</span></span>
      </div>
    </div>
    ${tabAll(counts)}`;
  bindPlaybook($doc);
}
const firstSentence = t => { const i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; };
const provSource = i => i.offPaper ? ['Counterparty paper', 'pill--warning'] : i.isNew ? ['Found in your paper', 'pill--warning'] : S.fromAnswer[i.id] ? ['Set by you', 'pill--brand'] : ['Provision library', 'pill--gray'];
function currentProv(list) { return list.find(x => x.id === S.sel2) || list[0] || null; }
const RISK_TIP = { critical: 'Critical risk — a bad outcome here can sink the deal or the margin.', elevated: 'Elevated risk — worth a considered position, rarely a deal-breaker.', standard: 'Standard risk — the template position holds in most negotiations.' };
function freqTip(i) { const t = T(), n = docsFor(t); if (!i.freq) return `Accepted as drafted in all ${n} ${t.corpus.label} — no counterparty has moved it.`; return `Negotiated in ${Math.round(n * i.freq / 100)} of ${n} ${t.corpus.label} · most often settled at ${TIER[i.settled]} · ${i.rounds.toFixed(1)} rounds on average.`; }
function citeTip(k, n, tier) { return k ? `${k} of ${n} executed agreements closed at ${tier}.` : `No executed agreement has closed at ${tier} — this position has never been conceded.`; }
function tierCounts(i, n) {
  const negs = Math.round(n * i.freq / 100), base = n - negs, c = [0, 0, 0, 0, 0];
  if (negs) { const raw = [0, 1, 2, 3, 4].map(t => Math.pow(.38, Math.abs(t - i.settled))); const sum = raw.reduce((a, b) => a + b, 0);
    const share = raw.map(x => negs * x / sum), fl = share.map(Math.floor); let left = negs - fl.reduce((a, b) => a + b, 0);
    const order = share.map((x, k) => [x - fl[k], k]).sort((a, b) => b[0] - a[0]); for (let k = 0; k < left; k++) fl[order[k % 5][1]]++; for (let k = 0; k < 5; k++) c[k] = fl[k]; }
  c[0] += base; return c;
}
const citeLabel = (k, n) => k ? `<b>${k}</b> of ${n} agreements` : 'No precedent';

function tabAll(counts) {
  const t = T(), list = provList(), cur = currentProv(list);
  if ((S.docView||'stack') === 'stack') return tabAllStacked(list);
  const filtered = S.filter !== 'all' || S.show !== 'all' || (S.psearch || '').trim();
  const tg = (val, lbl) => `<button class="toggle-group__item" type="button" aria-pressed="${S.show === val ? 'true' : 'false'}" data-show="${val}">${lbl}</button>`;
  return `<div class="doc-shell doc-shell--split">
    <aside class="doc-side doc-side--split">
      ${(S.listTools || S.listSearch) ? `<div class="plist__tools">
        ${S.listSearch ? searchInput('provSearch', 'Search issues', S.psearch) : ''}
        ${S.listTools ? `<div class="toggle-group" ${TAG('filter-bar', 'Toggle group', 'I7489:272510;1140:145376')}>${tg('all', 'All')}${tg('fb', 'Has fallbacks')}${tg('base', 'Baseline')}</div>
          <select class="select" id="riskSel" aria-label="Filter by risk">
            <option value="all"${S.filter === 'all' ? ' selected' : ''}>All risk levels</option>
            <option value="critical"${S.filter === 'critical' ? ' selected' : ''}>Critical (${counts.critical})</option>
            <option value="elevated"${S.filter === 'elevated' ? ' selected' : ''}>Elevated (${counts.elevated})</option>
            <option value="standard"${S.filter === 'standard' ? ' selected' : ''}>Standard (${counts.standard})</option></select>` : ''}
      </div>` : ''}
      <div class="doc-side__cards">
        ${list.length ? list.map(i => `
          <button class="pcard ${S.provOff[i.id] ? 'pcard--off' : ''}" type="button" data-prov="${i.id}" aria-current="${cur && cur.id === i.id ? 'true' : 'false'}">
            <span class="pcard__top"><span class="pcard__num">${i.num}</span><span class="pcard__title">${esc(i.n)}</span>
              ${(i.conflict || i.offPaper) ? `<span class="pcard__warn" title="Needs a decision">${I['alert-triangle']}</span>` : ''}</span>
          </button>`).join('') : '<div class="drop">No issue matches that filter.</div>'}
      </div>
    </aside>
    <div class="doc-main doc-main--split">
      <div class="doc-main__header">
        <div class="doc-main__hrow">
          ${S.focused ? `<button class="doc-main__hdrawer" type="button" data-rules-drawer aria-label="${S.rulesCollapsed ? 'Open' : 'Collapse'} rules panel" title="${S.rulesCollapsed ? 'Open' : 'Collapse'} rules"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M6 3v10"/></svg></button>` : ''}
          <span class="doc-main__hlabel">Rules</span>
          <span class="doc-main__hcount">${list.length}</span>
          <span class="spacer"></span>
          <button class="doc-main__hbtn" type="button" data-add-rule>+ Add Rule</button>
        </div>
        <hr class="doc-main__hrule">
        <h2 class="doc-main__title">${esc(t.name)} Playbook</h2>
        <p class="doc-main__sub">This playbook should be used as a guideline when reviewing a ${esc(t.name)}. It is primarily intended to reflect the receiver&apos;s perspective.</p>
      </div>
      <div class="doc-main__split">
        ${cur ? provDetail(cur) : '<div class="pdet"><div class="pdet__scroll"><div class="pdet__in pdet__body"><p class="sm">Pick an issue on the left.</p></div></div></div>'}
      </div>
    </div>
  </div>`;
}
const PARTIES = ['Rivian Fleet Services', 'Simon Property Group', 'Kaiser Permanente', 'City of Fremont', 'Prologis', 'Hilton Worldwide', 'Stanford University', 'Whole Foods Market', 'Brookfield Properties', 'Amazon Logistics', 'Costco Wholesale', 'Marriott International', 'UCSF Health', 'Target Corporation'];
function citations(i, pi, k) {
  const off = (i.num * 3 + pi * 5) % PARTIES.length, out = [];
  for (let n = 0; n < k; n++) { const ix = (off + n * 2) % PARTIES.length;
    out.push({ party: PARTIES[ix], clause: (i.cl[0] || '').split(' ')[0] + '.' + (1 + (ix % 4)), date: `${1 + ((ix * 7) % 28)} ${['Mar', 'Jun', 'Sep', 'Nov'][ix % 4]} ${2023 + (ix % 3)}`, rounds: 1 + ((ix + pi) % 3) }); }
  return out;
}
const tierText = (i, pi, pp) => (S.edits[i.id] && S.edits[i.id][pi] != null) ? S.edits[i.id][pi] : pp.x;
function tierCard(i, pp, pi, sel, off, cites, n) {
  const ti = TIER.indexOf(pp.t), isSel = pi === sel, isOff = !!off[pi], k = cites[pi], key = i.id + ':' + pi;
  const sug = S.suggest && S.suggest.key === key ? S.suggest : null;
  return `<div class="tier tier--${ti} ${isSel ? 'tier--sel' : ''} ${isOff ? 'tier--off' : ''}">
    <div class="tier__head">
      <span class="tier__name">${esc(pp.t)}</span>${isSel ? pill('pill--solid pill--gray-solid', 'Standard') : ''}
      <span class="spacer"></span>
    </div>
    <div class="tier__body" ${isSel ? '' : `data-pos="${key}" role="button" tabindex="0"`}>
      <div class="tier__text" contenteditable="false" spellcheck="false" data-edit="${key}" data-tip="Double-click to edit" aria-label="${esc(pp.t)} position — double-click to edit">${esc(tierText(i, pi, pp))}</div>
      ${(pp.l && S.langOpen[i.id]) ? `<span class="tier__lang">${esc(pp.l)}</span>` : ''}
      ${sug ? `<div class="tier__suggest"><span class="tier__suggest-h">${I['ai-star']}<span class="label">AI suggestion</span></span><p class="tier__suggest-t">${esc(sug.text)}</p>
        <div class="tier__tools">${btn('btn--xs btn--neutral-tertiary', label('Dismiss'), `data-sug-dismiss="${key}"`)}${btn('btn--xs btn--neutral-secondary', label('Accept'), `data-sug-accept="${key}"`)}</div></div>` : ''}
    </div>
  </div>`;
}
function recordLine(i, n) {
  const negs = Math.round(n * i.freq / 100);
  return i.freq ? `Negotiated in <b>${negs} of ${n}</b> executed agreements · most often settled at <b>${esc(TIER[i.settled])}</b> · <b>${i.rounds.toFixed(1)}</b> rounds on average`
    : `Accepted as drafted in all <b>${n}</b> executed agreements — no counterparty has moved it.`;
}
function provDetail(i) {
  const t = T(), n = docsFor(t), sel = S.sel[i.id] || 0, sp = provSource(i), off = S.tierOff[i.id] || {}, cites = tierCounts(i, n), pOn = !S.provOff[i.id];
  return `<div class="pdet">
    <div class="pdet__head"><div class="pdet__in pdet__head-in">
      <h3 class="pdet__title">${esc(i.n)}</h3>
    </div></div>
    <div class="pdet__scroll"><div class="pdet__in pdet__body">
      <div class="pdet__block"><span class="label">About this issue</span><p class="pdet__about">${esc(i.w)}</p></div>
      <div class="pdet__meta">
        <div class="mcell"><span class="label">Source</span><span>${pill('pill--squared pill--xs ' + sp[1], esc(sp[0]))}</span></div>
        <div class="mcell"><span class="label">Issue type</span><span class="mval">${esc(i.c)}</span></div>
        <div class="mcell"><span class="label">Template</span><span class="mval mval--num">${esc(i.ref.replace('Template ', ''))}</span></div>
        <div class="mcell"><span class="label">Risk</span><span class="mval cell-inline"><span class="rdot rdot--${i.r}"></span>${i.r[0].toUpperCase() + i.r.slice(1)}</span></div>
      </div>
      ${rule()}
      <div class="pdet__block">
        <span class="pdet__h">Positions</span>
        <p class="sm">Click a tier to make it the standard for this playbook. Switch one off to leave it out when the playbook is published.</p>
        <div class="tiers">${i.p.map((pp, pi) => tierCard(i, pp, pi, sel, off, cites, n)).join('')}</div>
      </div>
      <div class="pdet__block"><span class="label">Clauses this issue moves</span><div class="chips">${i.cl.map(c => pill('pill--squared pill--xs pill--gray pill--clause', esc(c))).join('')}</div></div>
      ${S.fromAnswer[i.id] ? `<p class="sm">Set from your answer during the interview: "${esc(S.fromAnswer[i.id])}".</p>` : ''}
    </div></div>
  </div>`;
}

/* Figma 12002:42272 (Canvas page): sidebar with category counts + main card
   holding the playbook title, subtitle and a stack of issue cards. Each card
   has 4 tier blocks (starting / example / fallback / not acceptable). */
const IC = {
  star:  '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.75 8.62 5.03l3.62.53-2.62 2.55.62 3.6L7 10l-3.24 1.71.62-3.6L1.76 5.56l3.62-.53L7 1.75Z"/></svg>',
  align: '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.083 7H2.917M8.75 10.5H2.917M11.083 3.5H2.917"/></svg>',
  corner:'<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.917 3.5v2.917a2.333 2.333 0 0 0 2.333 2.333h5.833m0 0L8.167 5.833m2.916 2.917-2.916 2.917"/></svg>',
  alert: '<svg viewBox="0 0 14 14" width="14" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M6.02 2.36 1.28 10.283a1.15 1.15 0 0 0 .983 1.717h9.474a1.15 1.15 0 0 0 .983-1.717L7.98 2.36a1.15 1.15 0 0 0-1.96 0Z"/><path fill="#fff" d="M6.35 5.25h1.3v2.6h-1.3zM7 9.55a.66.66 0 1 0 0 1.32.66.66 0 0 0 0-1.32Z"/></svg>',
  trash: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.667 4v-.533c0-.747 0-1.12-.146-1.405a1.333 1.333 0 0 0-.583-.583C9.653 1.333 9.28 1.333 8.533 1.333H7.467c-.747 0-1.12 0-1.405.146-.25.128-.455.333-.583.583-.146.285-.146.658-.146 1.405V4m1.333 3.667v3.333m2.667-3.333v3.333M2 4h12m-1.333 0v7.467c0 1.12 0 1.68-.219 2.108a2 2 0 0 1-.873.874c-.428.218-.988.218-2.108.218H6.533c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108V4"/></svg>',
  plus12:'<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.5v7M2.5 6h7"/></svg>',
  search12: '<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="5.5" r="3.5"/><path d="m10.5 10.5-2.5-2.5"/></svg>'
};
function issueCategories(list) {
  const groups = new Map();
  list.forEach(i => {
    const key = i.c || 'Other';
    groups.set(key, (groups.get(key) || 0) + 1);
  });
  return Array.from(groups.entries());
}
function tabAllStacked(list) {
  const t = T();
  return `<div class="doc-shell">
    <div class="doc-main">
      <div class="doc-main__header">
        <div class="doc-main__hrow">
          ${S.focused ? `<button class="doc-main__hdrawer" type="button" data-rules-drawer aria-label="${S.rulesCollapsed ? 'Open' : 'Collapse'} rules panel" title="${S.rulesCollapsed ? 'Open' : 'Collapse'} rules"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M6 3v10"/></svg></button>` : ''}
          <span class="doc-main__hlabel">Rules</span>
          <span class="doc-main__hcount">${list.length}</span>
          <span class="spacer"></span>
          <button class="doc-main__hbtn" type="button" data-add-rule>+ Add Rule</button>
        </div>
        <hr class="doc-main__hrule">
        <h2 class="doc-main__title">${esc(t.name)} Playbook</h2>
        <p class="doc-main__sub">This playbook should be used as a guideline when reviewing a ${esc(t.name)}. It is primarily intended to reflect the receiver&apos;s perspective.</p>
      </div>
      <div class="doc-main__cards">
        ${S.newRule ? `<section class="icard icard--open icard--new">
          <div class="icard__top icard__top--static">
            <span class="icard__ttl-wrap">
              <span class="icard__ttl-num">${(list.length + 1)}.0</span>
              <span class="icard__ttl" id="newRuleName" contenteditable="true" spellcheck="false" data-placeholder="Untitled Rule"></span>
            </span>
            <div class="iblock__editor-acts">
              <button class="iblock__cancel" type="button" data-rule-cancel>Cancel</button>
              <button class="iblock__save" type="button" data-rule-save>Save</button>
            </div>
          </div>
          <div class="icard__body">
            <div class="iblock iblock--start">
              <div class="iblock__head">
                <div class="iblock__left">
                  <span class="iblock__badge iblock__badge--start">${IC.star}</span>
                  <span class="iblock__ttl iblock__ttl--start">Starting position</span>
                </div>
                <button class="iblock__add iblock__add--example" type="button" data-new-add-example><span>+ Add Example Language</span></button>
              </div>
              <p class="iblock__text" id="newRuleStart" contenteditable="true" spellcheck="false" data-placeholder="Ideal clause wording — how you would draft it if you wrote it yourself."></p>
            </div>
            <div class="iblock iblock--red">
              <div class="iblock__head">
                <div class="iblock__left">
                  <span class="iblock__badge iblock__badge--red">${IC.alert}</span>
                  <span class="iblock__ttl iblock__ttl--red">Not acceptable</span>
                </div>
              </div>
              <p class="iblock__text" id="newRuleRed" contenteditable="true" spellcheck="false" data-placeholder="Specify language or omissions that are not acceptable — typically failure to meet the Starting Position or any fallback."></p>
            </div>
          </div>
          <div class="icard__footer">
            <button class="iblock__add" type="button" data-new-add-fallback>${IC.plus12}<span>Add Fallback</span></button>
          </div>
        </section>` : ''}
        ${list.map(i => issueCard(i)).join('')}
      </div>
    </div>
  </div>`;
}
function issueCard(i) {
  S.customExamples = S.customExamples || {};
  S.customFallbacks = S.customFallbacks || {};
  const start = i.p[0] || {};
  const example = start.l || '';
  const fallbacks = i.p.slice(2, 4).filter(p => p && (p.l || p.s));
  const red = i.p[i.p.length - 1] || {};
  const num = (i.num || '').toString();
  const numDisplay = num.includes('.') ? num : `${num}.0`;
  const open = !!S.open['card:' + i.id];
  const chev = '<svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 4.5 3 3 3-3"/></svg>';
  const extraEx = S.customExamples[i.id] || [];
  const extraFb = S.customFallbacks[i.id] || [];
  const newEntry = S.newEntry && S.newEntry.issueId === i.id ? S.newEntry : null;
  const editor = (label, badge, badgeCls, ttlCls) => `<div class="iblock iblock--editor">
    <div class="iblock__head">
      <div class="iblock__left">
        <span class="iblock__badge ${badgeCls}">${badge}</span>
        <span class="iblock__ttl ${ttlCls}">${esc(label)}</span>
      </div>
      <div class="iblock__editor-acts">
        <button class="iblock__cancel" type="button" data-entry-cancel>Cancel</button>
      </div>
    </div>
    <textarea class="iblock__editor" id="newEntryInput" rows="2" placeholder="Type the clause language…"></textarea>
  </div>`;
  return `<section class="icard ${open ? 'icard--open' : ''}" data-issue-id="${i.id}">
    <div class="icard__top" role="button" tabindex="0" data-card-toggle="${i.id}" aria-expanded="${open}">
      <span class="icard__ttl-wrap"><span class="icard__ttl-num">${esc(numDisplay)}</span><span class="icard__ttl" contenteditable="true" spellcheck="false" data-card-title="${i.id}" title="Click to edit">${esc(i.n)}</span></span>
      <span class="icard__desc">${esc(firstSentence(i.w))}</span>
      <span class="icard__chev">${chev}</span>
      <span class="icard__trash" role="button" tabindex="0" data-card-trash="${i.id}" title="Remove" aria-label="Remove">${IC.trash}</span>
    </div>
    ${open ? `<div class="icard__body">
      <div class="iblock iblock--start">
        <div class="iblock__head">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--start">${IC.star}</span>
            <span class="iblock__ttl iblock__ttl--start">Starting position</span>
          </div>
          <button class="iblock__add iblock__add--example" type="button" data-add-example="${i.id}"><span>+ Add Example Language</span></button>
        </div>
        <p class="iblock__text" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:start.s">${esc(start.s || 'Ideal clause wording — how you would draft it if you wrote it yourself.')}</p>
      </div>
      <hr class="iblock__rule">
      ${example ? `<div class="iblock iblock--example">
        <div class="iblock__head">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--example">${IC.align}</span>
            <span class="iblock__ttl iblock__ttl--example">Example language</span>
          </div>
        </div>
        <p class="iblock__text" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:start.l">${esc(example)}</p>
      </div>
      <hr class="iblock__rule">` : ''}
      ${extraEx.map((txt, ei) => `<div class="iblock iblock--example">
        <div class="iblock__head">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--example">${IC.align}</span>
            <span class="iblock__ttl iblock__ttl--example">Example language ${ei + 2}</span>
          </div>
        </div>
        <p class="iblock__text" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:ex.${ei}">${esc(txt)}</p>
      </div>
      <hr class="iblock__rule">`).join('')}
      ${newEntry && newEntry.kind === 'example' ? editor('New example language', IC.align, 'iblock__badge--example', 'iblock__ttl--example') + '<hr class="iblock__rule">' : ''}
      ${fallbacks.map((p, pi) => `<div class="iblock iblock--fallback">
        <div class="iblock__head">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--fallback">${IC.corner}</span>
            <span class="iblock__ttl iblock__ttl--fallback">Fallback ${pi + 1}</span>
          </div>
        </div>
        <p class="iblock__text" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:fb.${pi}">${esc(p.l || p.s || '')}</p>
      </div>
      <hr class="iblock__rule">`).join('')}
      ${extraFb.map((txt, fi) => `<div class="iblock iblock--fallback">
        <div class="iblock__head">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--fallback">${IC.corner}</span>
            <span class="iblock__ttl iblock__ttl--fallback">Fallback ${fallbacks.length + fi + 1}</span>
          </div>
        </div>
        <p class="iblock__text" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:xfb.${fi}">${esc(txt)}</p>
      </div>
      <hr class="iblock__rule">`).join('')}
      ${newEntry && newEntry.kind === 'fallback' ? editor(`Fallback ${fallbacks.length + extraFb.length + 1}`, IC.corner, 'iblock__badge--fallback', 'iblock__ttl--fallback') + '<hr class="iblock__rule">' : ''}
      <div class="iblock iblock--red">
        <div class="iblock__head iblock__head--stacked">
          <div class="iblock__left">
            <span class="iblock__badge iblock__badge--red">${IC.alert}</span>
            <span class="iblock__ttl iblock__ttl--red">Not acceptable</span>
          </div>
        </div>
        <p class="iblock__text iblock__text--pl40" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:red.s">${esc(red.s || 'Specify language or omissions that are not acceptable — typically failure to meet the Starting Position or any fallback.')}</p>
        <div class="iblock__default" contenteditable="true" spellcheck="false" data-tier-edit="${i.id}:red.l">${esc(red.l || `Default: "The agreement is not aligned with the starting position or permitted fallbacks."`)}</div>
      </div>
    </div>
    <div class="icard__footer">
      <button class="iblock__add" type="button" data-add-fallback="${i.id}">${IC.plus12}<span>Add Fallback</span></button>
    </div>` : ''}
  </section>`;
}

function tabData() {
  const t = T(), n = docsFor(t), rows = t.issues.slice().sort((a, b) => b.freq - a.freq);
  const cost = t.issues.map(i => ({ i, c: i.freq * i.rounds })).sort((a, b) => b.c - a.c);
  const total = cost.reduce((s, x) => s + x.c, 0) || 1, top3 = cost.slice(0, 3), share = Math.round(top3.reduce((s, x) => s + x.c, 0) / total * 100);
  return `<p class="lead">Read from ${n} executed agreements and their version history. <strong>${esc(top3.map(x => x.i.n).join(', '))}</strong> account for roughly <strong>${share}%</strong> of all negotiation effort on this contract type.</p>
    <div class="table-wrap"><table class="ctable"><thead><tr><th>#</th><th>Provision</th><th>Negotiated</th><th>Frequency</th><th>Settled at</th><th>Rounds</th></tr></thead>
    <tbody>${rows.map(i => `<tr><td class="cnt">${i.num}</td>
      <td><span class="cell-inline"><span class="rdot rdot--${i.r}"></span>${esc(i.n)}</span><br><span class="sm">${esc(i.ref)}</span></td>
      <td class="cnt">${Math.round(n * i.freq / 100)} of ${n}</td>
      <td><span class="cell-inline"><span class="meter"><i style="width:${i.freq}%"></i></span><span class="cnt">${i.freq}%</span></span></td>
      <td>${i.freq ? `<span class="cell-inline tier tier--${i.settled}" style="background:none;box-shadow:none"><span class="tm"></span><span class="sm">${esc(TIER[i.settled])}</span></span>` : '<span class="sm">—</span>'}</td>
      <td class="cnt">${i.freq ? i.rounds.toFixed(1) : '—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function bindPlaybook($doc) {
  $doc.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { S.tab = b.dataset.tab; render(); });
  $doc.querySelectorAll('[data-show]').forEach(b => b.onclick = () => { S.show = b.dataset.show; render(); });
  const rs = document.getElementById('riskSel'); if (rs) rs.onchange = () => { S.filter = rs.value; render(); };
  $doc.querySelectorAll('[data-stack]').forEach(b => b.onclick = () => { const id = b.dataset.stack; const k = 'stack:' + id; S.open[k] = !S.open[k]; render(); });
  $doc.querySelectorAll('[data-card-toggle]').forEach(b => b.onclick = e => {
    if (e.target.closest('[data-card-trash],[data-tier-edit],[data-card-title]')) return;
    const id = b.dataset.cardToggle; const k = 'card:' + id;
    S.open[k] = !S.open[k]; render();
  });
  $doc.querySelectorAll('[data-card-title]').forEach(el => {
    el.onclick = e => e.stopPropagation();
    el.onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') { el.textContent = el.dataset.original || el.textContent; el.blur(); }
    };
    el.onfocus = () => { el.dataset.original = el.textContent; };
    el.onblur = () => {
      const id = el.dataset.cardTitle;
      const nx = (el.textContent || '').trim();
      if (!nx) { el.textContent = el.dataset.original || ''; return; }
      const t = T();
      const iss = t.issues.find(x => x.id === id);
      if (iss && iss.n !== nx) { iss.n = nx; render(); }
    };
  });
  $doc.querySelectorAll('[data-tier-edit]').forEach(el => {
    el.onclick = e => e.stopPropagation();
    el.onkeydown = e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') { el.textContent = el.dataset.tierOrig || el.textContent; el.blur(); }
    };
    el.onfocus = () => { el.dataset.tierOrig = el.textContent; };
    el.onblur = () => {
      const nx = (el.textContent || '').trim();
      const [id, field] = el.dataset.tierEdit.split(':');
      const t = T();
      const iss = t.issues.find(x => x.id === id);
      if (!iss) return;
      if (field === 'start.s') iss.p[0].s = nx;
      else if (field === 'start.l') iss.p[0].l = nx;
      else if (field === 'red.s') iss.p[iss.p.length - 1].s = nx;
      else if (field === 'red.l') iss.p[iss.p.length - 1].l = nx;
      else if (field.startsWith('fb.')) { const idx = +field.slice(3); if (iss.p[2 + idx]) iss.p[2 + idx].l = nx; }
      else if (field.startsWith('ex.')) { S.customExamples[id] = S.customExamples[id] || []; S.customExamples[id][+field.slice(3)] = nx; }
      else if (field.startsWith('xfb.')) { S.customFallbacks[id] = S.customFallbacks[id] || []; S.customFallbacks[id][+field.slice(4)] = nx; }
    };
  });
  $doc.querySelectorAll('[data-card-trash]').forEach(el => el.onclick = e => {
    e.stopPropagation();
    const id = el.dataset.cardTrash;
    const t = T(); t.issues = t.issues.filter(x => x.id !== id);
    delete S.open['card:' + id];
    render();
  });
  $doc.querySelectorAll('[data-add-example]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    const id = b.dataset.addExample;
    S.open['card:' + id] = true;
    S.newEntry = { issueId: id, kind: 'example' };
    render();
    setTimeout(() => { const n = document.getElementById('newEntryInput'); if (n) n.focus(); }, 40);
  });
  $doc.querySelectorAll('[data-add-fallback]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    const id = b.dataset.addFallback;
    S.open['card:' + id] = true;
    S.newEntry = { issueId: id, kind: 'fallback' };
    render();
    setTimeout(() => { const n = document.getElementById('newEntryInput'); if (n) n.focus(); }, 40);
  });
  const $entryInput = document.getElementById('newEntryInput');
  if ($entryInput && S.newEntry) {
    $entryInput.oninput = () => {
      const txt = $entryInput.value.trim();
      const { issueId, kind } = S.newEntry;
      const map = kind === 'example' ? (S.customExamples = S.customExamples || {}) : (S.customFallbacks = S.customFallbacks || {});
      map[issueId] = map[issueId] || [];
      if (S.newEntry.draftIdx == null) {
        if (!txt) return;
        map[issueId].push(txt);
        S.newEntry.draftIdx = map[issueId].length - 1;
      } else {
        map[issueId][S.newEntry.draftIdx] = txt;
      }
    };
  }
  $doc.querySelectorAll('[data-entry-cancel]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    if (S.newEntry && S.newEntry.draftIdx != null) {
      const { issueId, kind, draftIdx } = S.newEntry;
      const map = kind === 'example' ? S.customExamples : S.customFallbacks;
      if (map && map[issueId]) map[issueId].splice(draftIdx, 1);
    }
    S.newEntry = null;
    render();
  });
  $doc.querySelectorAll('[data-back-home]').forEach(b => b.onclick = () => { S.stage = 'myplaybooks'; S.canvasClosed = true; S.thread = []; S.renderedTurns = 0; render(); });
  $doc.querySelectorAll('[data-add-rule]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    S.newRule = true;
    render();
    setTimeout(() => { const n = document.getElementById('newRuleName'); if (n) n.focus(); }, 40);
  });
  $doc.querySelectorAll('[data-rule-cancel]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    S.newRule = false;
    render();
  });
  const commitNewRule = (opts = {}) => {
    const nameEl = document.getElementById('newRuleName');
    const startEl = document.getElementById('newRuleStart');
    const redEl = document.getElementById('newRuleRed');
    const name = ((nameEl && (nameEl.textContent || nameEl.innerText)) || '').trim();
    if (!name) { if (nameEl) nameEl.focus(); return null; }
    const start = ((startEl && (startEl.textContent || startEl.innerText)) || '').trim();
    const red = ((redEl && (redEl.textContent || redEl.innerText)) || '').trim();
    const t = T();
    const id = 'RULE-' + Date.now().toString(36).slice(-5).toUpperCase();
    const num = t.issues.length + 1;
    const P_ = (title, summary, approval, language) => ({ t: title, s: summary, approval: approval, l: language || '' });
    t.issues.push({
      id, num, n: name, c: 'Custom', r: 'standard',
      w: 'Custom rule added from the canvas.',
      cl: [], ref: 'Template ' + num, freq: 0, rounds: 0, settled: 0,
      p: [
        P_('CP Template', start, 'Standard — no approval', start),
        P_('Red line', red || 'Anything outside the starting position or approved fallbacks.', 'Do not concede — GC only', '')
      ]
    });
    S.newRule = false;
    S.open['card:' + id] = true;
    if (opts.then === 'example') { S.newEntry = { issueId: id, kind: 'example' }; }
    else if (opts.then === 'fallback') { S.newEntry = { issueId: id, kind: 'fallback' }; }
    render();
    if (opts.then) setTimeout(() => { const n = document.getElementById('newEntryInput'); if (n) n.focus(); }, 40);
    return id;
  };
  $doc.querySelectorAll('[data-rule-save]').forEach(b => b.onclick = e => { e.stopPropagation(); commitNewRule(); });
  $doc.querySelectorAll('[data-new-add-example]').forEach(b => b.onclick = e => { e.stopPropagation(); commitNewRule({ then: 'example' }); });
  $doc.querySelectorAll('[data-new-add-fallback]').forEach(b => b.onclick = e => { e.stopPropagation(); commitNewRule({ then: 'fallback' }); });
  $doc.querySelectorAll('[data-issue]').forEach(b => b.onclick = () => { const k = 'i' + b.dataset.issue; S.open[k] = !S.open[k]; render(); });
  $doc.querySelectorAll('[data-prov]').forEach(b => b.onclick = () => { S.sel2 = b.dataset.prov; render(); });
  $doc.querySelectorAll('[data-provoff]').forEach(b => b.onclick = () => { const id = b.dataset.provoff; S.provOff[id] = !S.provOff[id]; render(); });
  $doc.querySelectorAll('[data-tgl]').forEach(b => b.onclick = () => { const [id, pi] = b.dataset.tgl.split(':'); S.tierOff[id] = S.tierOff[id] || {}; S.tierOff[id][pi] = !S.tierOff[id][pi]; render(); });
  const lf = document.getElementById('listFilter'); if (lf) lf.onclick = () => { S.listTools = !S.listTools; render(); };
  const ls = document.getElementById('listSearch'); if (ls) ls.onclick = () => { S.listSearch = !S.listSearch; render(); requestAnimationFrame(() => { const n = document.getElementById('provSearch'); if (n) n.focus(); }); };
  $doc.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { const k = b.dataset.lang; S.langOpen[k] = !S.langOpen[k]; render(); });
  $doc.querySelectorAll('[data-cite]').forEach(b => b.onclick = () => { const [id, pi] = b.dataset.cite.split(':'); S.sheet = { kind: 'cite', id, pi: +pi }; render(); });
  $doc.querySelectorAll('[data-edit]').forEach(el => {
    el.ondblclick = () => {
      el.setAttribute('contenteditable', 'true');
      el.removeAttribute('data-tip');
      el.focus();
      const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
      const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r);
    };
    el.onblur = () => { el.setAttribute('contenteditable', 'false'); el.setAttribute('data-tip', 'Double-click to edit'); };
    el.oninput = () => { const [id, pi] = el.dataset.edit.split(':'); S.edits[id] = S.edits[id] || {}; S.edits[id][pi] = el.textContent; };
    el.onkeydown = e => { if (e.key === 'Escape') el.blur(); };
  });
  $doc.querySelectorAll('[data-suggest]').forEach(b => b.onclick = () => {
    const [id, pi] = b.dataset.suggest.split(':'); const iss = T().issues.find(x => x.id === id), pp = iss.p[+pi];
    const text = pp.l ? pp.l : `${tierText(iss, +pi, pp).replace(/\.$/, '')} — approval: ${pp.a}.`;
    S.suggest = { key: b.dataset.suggest, text }; render();
  });
  $doc.querySelectorAll('[data-sug-accept]').forEach(b => b.onclick = () => { const [id, pi] = b.dataset.sugAccept.split(':'); S.edits[id] = S.edits[id] || {}; S.edits[id][pi] = S.suggest.text; S.suggest = null; render(); });
  $doc.querySelectorAll('[data-sug-dismiss]').forEach(b => b.onclick = () => { S.suggest = null; render(); });
  $doc.querySelectorAll('[data-pos]').forEach(b => b.onclick = e => { if (e.target.closest('[data-edit],[data-suggest],[data-cite],[data-tgl],.tier__lang,.tier__suggest,.btn,button')) return; const [id, pi] = b.dataset.pos.split(':'); S.sel[id] = +pi; if (S.tierOff[id]) delete S.tierOff[id][pi]; render(); });
  $doc.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => { S.tab = 'all'; S.filter = 'all'; S.show = 'all'; S.psearch = ''; S.sel2 = b.dataset.goto; render(); });
  const ps = document.getElementById('provSearch');
  if (ps) ps.oninput = () => { const at = ps.selectionStart; S.psearch = ps.value; render(); const n2 = document.getElementById('provSearch'); if (n2) { n2.focus(); n2.setSelectionRange(at, at); } };
}

/* ============================== sheets ============================== */

/* SharePoint file-picker modal — lifted from Template Studio (16 Sep 2026).
   Rendered when S.sheet === 'sp-picker'. Confirm streams the attachments and
   kicks off learning against the NDA playbook. */
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
    host.querySelectorAll('[data-sp]').forEach(cb => cb.onchange = () => {
      sel[cb.dataset.sp] = !!cb.checked;
      const spAll2 = document.getElementById('spAll');
      if (spAll2) spAll2.checked = files.every(f => sel[f.name]);
      updateSpFooter(host, files, sel);
    });
    bind('spGo', () => {
      const chosen = files.filter(f => sel[f.name]);
      if (!chosen.length) return;
      S.perms.docsource = 'always'; S.connected = true; S.type = 'nda'; S.sheet = false;
      S.thread.push({ k: 'user', text: `SharePoint · ${chosen.length} file${chosen.length === 1 ? '' : 's'}` });
      const filesForAttach = chosen.map(f => ({
        name: f.name, sub: f.meta, tag: f.tag, tone: f.tagWarn ? 'warning' : (/Signed/i.test(f.tag) ? 'success' : 'gray')
      }));
      streamAttach(filesForAttach,
        `Read ${chosen.length} file${chosen.length === 1 ? '' : 's'} from SharePoint.<br><br>Before I build the playbook I need answers to <strong>3 quick questions</strong> — the ESMT paper deviates from your template on residuals, jurisdiction and the non-solicit.`,
        startLearning);
    });
  }
}
function updateSpFooter(host, files, sel) {
  const c = files.filter(f => sel[f.name]).length;
  const countEl = host.querySelector('.sp-modal__count');
  if (countEl) countEl.textContent = c ? `${c} file${c === 1 ? '' : 's'} selected` : 'No files selected';
  const go = document.getElementById('spGo');
  if (go) { if (c) go.removeAttribute('disabled'); else go.setAttribute('disabled', ''); }
}

/* Publish Playbook modal — Figma 12067:472999. */
const COPY_ICON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.33" y="5.33" width="8.67" height="8.67" rx="1.67"/><path d="M10.67 5.33V4a1.67 1.67 0 0 0-1.67-1.67H3.67A1.67 1.67 0 0 0 2 4v5.33A1.67 1.67 0 0 0 3.67 11h1.33"/></svg>';
function renderPublishModal(host) {
  const t = T();
  const title = (t && t.name ? t.name : 'Playbook') + ' Playbook';
  const html = `<div class="sheet-bg sheet-bg--ghost" id="pubBg"></div>
    <div class="pub-modal" role="dialog" aria-label="Publish">
      <header class="pub-modal__h">
        <h2 class="pub-modal__title">Publish Playbook</h2>
        <button class="pub-modal__close" type="button" id="pubClose" aria-label="Close">${I['x-close']}</button>
      </header>
      <div class="pub-modal__body">
        <section class="pub-sec">
          <div class="pub-card">
            <span class="pub-card__icon pub-card__icon--doc">${DOC_HEADER_SVG}</span>
            <div class="pub-card__text">
              <span class="pub-card__title">${esc(title)}</span>
            </div>
            <button class="pub-card__act" type="button" aria-label="Copy link">${COPY_ICON}</button>
          </div>
        </section>
        <section class="pub-sec">
          <div class="pub-sec__label">Visible to</div>
          <div class="pub-card">
            <span class="pub-card__icon pub-card__icon--audience">${I['building-05']}</span>
            <div class="pub-card__text">
              <span class="pub-card__title">Everyone at ChargePoint</span>
              <span class="pub-card__sub">Anyone signed in to your workspace</span>
            </div>
            <button class="pub-card__act" type="button" aria-label="Change audience">${I['chevron-right']}</button>
          </div>
        </section>
      </div>
      <footer class="pub-modal__f">
        <button class="pub-modal__go" type="button" id="pubConfirm">Publish</button>
      </footer>
    </div>`;
  if (host.__html === html) return; setHTML(host, html);
  const modal = host.querySelector('.pub-modal');
  const anchor = document.getElementById('pubBtn');
  if (modal && anchor) {
    const r = anchor.getBoundingClientRect();
    modal.style.top = (r.bottom + 8) + 'px';
    modal.style.right = (window.innerWidth - r.right) + 'px';
  }
  const close = () => { S.sheet = false; render(); };
  document.getElementById('pubBg').onclick = close;
  document.getElementById('pubClose').onclick = close;
  document.getElementById('pubConfirm').onclick = () => {
    S.pubPublished = true;
    S.pubAudience = 'Everyone at ChargePoint';
    S.sheet = false;
    render();
    const btn = document.getElementById('pubBtn');
    if (btn) { const lb = btn.querySelector('.btn__label'); if (lb) lb.textContent = 'Published to ' + S.pubAudience; btn.disabled = true; }
  };
}

function renderSheet() {
  const host = document.getElementById('sheetHost');
  if (!S.sheet) { setHTML(host, ''); return; }
  if (S.sheet === 'sp-picker') return renderSharePointPicker(host);
  if (S.sheet === 'publish') return renderPublishModal(host);
  if (S.sheet.kind === 'cite') {
    const iss = T().issues.find(x => x.id === S.sheet.id), pp = iss.p[S.sheet.pi], n = docsFor(T()), k = tierCounts(iss, n)[S.sheet.pi];
    const html = `<div class="sheet-bg" id="sheetBg"></div>
      <div class="sheet fade" role="dialog" aria-label="Citations">
        <div class="sheet__h"><span>${k} agreements closed at ${esc(pp.t)}</span><span class="spacer"></span>${btn('btn--icon-sm btn--neutral-tertiary', I['x-close'], 'id="sheetClose" aria-label="Close"')}</div>
        <div class="sheet__row"><span class="sm">${esc(iss.n)} · read from ${esc(srcName())}</span></div>
        ${citations(iss, S.sheet.pi, k).map(c => `<div class="uc-row"><span class="uc-row__f"><span class="sheet__r1">${esc(c.party)}</span><span class="sm">${esc(c.clause)} · signed ${c.date} · ${c.rounds} round${c.rounds === 1 ? '' : 's'}</span></span>${btn('btn--xs btn--neutral-secondary', label('Open'), `title="Open ${esc(c.party)} in ${esc(srcName())}"`)}</div>`).join('')}
      </div>`;
    if (host.__html === html) return; setHTML(host, html);
    document.getElementById('sheetBg').onclick = () => { S.sheet = false; render(); };
    document.getElementById('sheetClose').onclick = () => { S.sheet = false; render(); };
    return;
  }
  const html2 = `<div class="sheet-bg" id="sheetBg"></div>
    <div class="sheet fade" role="dialog" aria-label="${S.sheet === 'unclass' ? 'Unclassified files' : 'Permissions'}">
      <div class="sheet__h"><span>${S.sheet === 'unclass' ? 'Files I could not place' : 'Permissions'}</span><span class="spacer"></span>${btn('btn--icon-sm btn--neutral-tertiary', I['x-close'], 'id="sheetClose" aria-label="Close"')}</div>
      ${S.sheet === 'unclass' ? sheetUnclass() : sheetPerms()}
    </div>`;
  if (host.__html === html2) return; setHTML(host, html2);
  document.getElementById('sheetBg').onclick = () => { S.sheet = false; render(); };
  document.getElementById('sheetClose').onclick = () => { S.sheet = false; render(); };
  host.querySelectorAll('[data-sheet-revoke]').forEach(b => b.onclick = () => { delete S.perms[b.dataset.sheetRevoke]; render(); });
  host.querySelectorAll('[data-sheet-always]').forEach(b => b.onclick = () => { S.perms[b.dataset.sheetAlways] = 'always'; render(); });
  const pu = document.getElementById('permUnclass'); if (pu) pu.onclick = () => { S.sheet = 'unclass'; render(); };
  host.querySelectorAll('[data-uc]').forEach(sel => sel.onchange = () => { const i = +sel.dataset.uc, v = sel.value; if (!v) return; if (v !== 'skip') S.extra[v] = (S.extra[v] || 0) + 1; S.unclass.splice(i, 1); if (!S.unclass.length) S.sheet = false; render(); });
}
function sheetPerms() {
  return Object.keys(PERMS).filter(k => k !== 'redlines').map(k => { const v = S.perms[k];
    return `<div class="sheet__row"><div class="sheet__r1"><span>${esc(k === 'docsource' ? srcName() + ' — Legal › Contracts (incl. version history)' : PERMS[k].name)}</span><span class="spacer"></span>
      ${v && v !== 'denied' ? pill('pill--squared pill--xs ' + (v === 'always' ? 'pill--brand' : 'pill--gray'), v === 'always' ? 'Always' : 'This session') : pill('pill--squared pill--xs pill--gray', v === 'denied' ? 'Denied' : 'Not asked')}</div>
      <span class="sm">${esc(permText(k, PERMS[k].scope))}</span>
      <div class="sheet__acts">${v && v !== 'denied' ? btn('btn--xs btn--neutral-secondary', label('Revoke'), `data-sheet-revoke="${k}"`) : ''}${v === 'once' ? btn('btn--xs btn--neutral-secondary', label('Always allow'), `data-sheet-always="${k}"`) : ''}</div></div>`; }).join('')
    + ((S.unclass && S.unclass.length) ? `<div class="sheet__row"><div class="sheet__r1"><span>${S.unclass.length} file${S.unclass.length === 1 ? '' : 's'} could not be placed</span><span class="spacer"></span>${btn('btn--xs btn--neutral-secondary', label('Review'), 'id="permUnclass"')}</div><span class="sm">They are excluded from every count until someone says what they are.</span></div>` : '')
    + `<div class="sheet__row"><span class="sm">Granted for this session only unless marked Always. Nothing is written back to any source, and revoking takes effect immediately.</span></div>`;
}
function sheetUnclass() {
  return (S.unclass || []).map((u, i) => `<div class="uc-row"><span class="uc-row__f"><b>${esc(u.f)}</b><span class="sm">${esc(u.why)}</span></span>
    <select class="select" data-uc="${i}" aria-label="Classify ${esc(u.f)}"><option value="">Classify…</option>${TYPES.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}<option value="skip">Not a contract — ignore</option></select></div>`).join('')
    + `<div class="sheet__row"><span class="sm">Classifying a file adds it to that type's counts straight away. Nothing is moved or renamed in ${esc(srcName())}.</span></div>`;
}

/* ============================== init ============================== */
function resetApp() {
  Object.assign(S, { edits: {}, suggest: null, cotOpen: {}, renderedTurns: 0, stage: 'start', type: null, perms: S.perms, thread: [], qi: 0, answers: [], sel: {}, fromAnswer: {}, langOpen: {}, tierOff: {}, provOff: {}, sel2: null, listTools: false, listSearch: false, canvasMax: false, canvasClosed: false, focused: false, chatOpen: false, tab: 'all', show: 'all', psearch: '', deferred: [], filter: 'all', open: {}, learnStarted: false, learnStep: 0, pendingPerm: null, sheet: false, approval: null, grp: 'popular', q: '', searching: false, homeConnect: false, _autoNavCollapsed: false });
  $rail.setAttribute('data-state', 'expanded');
  const rt = document.getElementById('railToggle'); if (rt) rt.setAttribute('aria-label', 'Collapse sidebar');
  render();
}
document.getElementById('railSearch').onclick = () => { resetApp(); requestAnimationFrame(() => { const n = document.getElementById('libSearch'); if (n) n.focus(); }); };
document.getElementById('railToggle').onclick = () => { const c = $rail.getAttribute('data-state') === 'collapsed'; $rail.setAttribute('data-state', c ? 'expanded' : 'collapsed'); document.getElementById('railToggle').setAttribute('aria-label', c ? 'Collapse sidebar' : 'Expand sidebar'); };
document.getElementById('split').addEventListener('pointerdown', e => {
  const start = e.clientX, rect = $stage.getBoundingClientRect();
  const startW = $view.getBoundingClientRect().width;
  const move = ev => { const w = Math.min(rect.width * 0.6, Math.max(440, startW + (ev.clientX - start))); $stage.style.gridTemplateColumns = Math.round(w) + 'px 0 minmax(0, 1fr)'; };
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
});
document.addEventListener('keydown', e => {
  if (S.stage !== 'ask' || S.pendingPerm) return;
  const ae = document.activeElement; if (ae && (ae.tagName === 'TEXTAREA' || ae.tagName === 'INPUT')) return;
  const n = +e.key, qs = allQs(), q = qs[S.qi];
  if (q && n >= 1 && n <= q.opts.length) { const o = q.opts[n - 1]; if (o.perm) { S.pendingPerm = o.perm; return renderDock(); } chooseOption(n - 1, o.b); }
});
S.edits = S.edits || {}; S.suggest = null; S.cotOpen = {};
window.PlaybookStudio = { S, render, resetApp, pickType, answerPerm, chooseOption };
render();
})();
