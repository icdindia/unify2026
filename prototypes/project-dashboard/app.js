/* Project dashboard — table rows and the three designed menus.
   Hover states are pure CSS. This file only builds the table and opens / positions menus:
     header ⋮            -> #menu-hdr  (file: x1160 y121, under the button)
     table-row ⋮          -> #menu-row  (right edge on the button's right edge, 4px below it)
     "Add to Project"     -> #menu-sub  (3px right of the row menu, 2.2px above the item) */
(function () {
  'use strict';

  // Scale the 1440x900 artboard to the window FIRST. If anything later in this file failed, an
  // unscaled frame would overflow a smaller window and clip its top edge (the nav header).
  var fitFrame = document.getElementById('frame');
  function fit() {   // scale set here, not via a CSS custom property: verify.sh requires every var() to be a DS token
    var k = Math.min(1, window.innerWidth / 1440, window.innerHeight / 900);
    fitFrame.style.setProperty('--fit', k); fitFrame.style.transform = 'scale(' + k + ')';
  }
  window.addEventListener('resize', fit); fit();

  // history is optional: sandboxed previews (srcdoc / Safari file://) throw SecurityError on pushState.
  // 'push' adds an entry, 'replace' rewrites the current one (first load), 'none' leaves history alone (Back / Forward).
  function setHash(h, how, state) {
    if (how === 'none') return;
    try {
      if (how === 'replace') history.replaceState(state, '', h);
      else if (location.hash !== h) history.pushState(state, '', h);
    } catch (err) { /* view still switches */ }
  }
  function histState() { try { return history.state; } catch (err) { return null; } }

  // the artboard is 900 tall and clips: a menu that would run past it opens upward from `above`, else is clamped
  var EDGE = 8;
  function placeV(menu, top, above) {
    var h = menu.offsetHeight;
    if (top + h > 900 - EDGE) top = (above !== undefined && above - h >= EDGE) ? above - h : 900 - EDGE - h;
    menu.style.top = top + 'px';
  }

  var A = function (n) { return (window.PD_ASSETS && window.PD_ASSETS[n]) || 'assets/' + n; };

  // Avatar fills read from the file (Avatar Size=xs, Colour=Brand Solid)
  var C = { O: 'var(--colors-utility-brand-utility-brand-300)', Tp: 'var(--palette-terracotta-300)', R: 'var(--palette-warm-blue-400)', E: 'var(--palette-plum-200)', Te: 'var(--colors-utility-error-utility-error-300)', K: 'var(--palette-plum-200)' };
  // UX fixes (2026-10-08): rows carry real ages so "Newest" is true; the "+N" badge is the real
  // overflow count (max 3 faces shown); members have names for tooltips. Names are placeholders.
  var rows = [
    { chat: 'Budget Allocation', mins: 180, team: [['O', C.O, 'Olivia Park'], ['T', C.Tp, 'Tomás Reyes'], ['R', C.R, 'Riya Shah'], ['E', C.E, 'Emma Clarke'], ['J', C.O, 'Jonah Lee'], ['M', C.R, 'Maya Chen']] },
    { chat: 'Can we meet tomorrow?', mins: 60, team: [['T', C.Te, 'Tara Nolan'], ['R', C.R, 'Riya Shah'], ['E', C.E, 'Emma Clarke'], ['S', C.O, 'Sam Ortiz']] },
    { chat: 'Sent the final draft', mins: 185, team: [['O', C.O, 'Olivia Park'], ['K', C.K, 'Kiran Rao']] },
    { chat: 'Lunch was really fun', mins: 190, team: [['T', C.Te, 'Tara Nolan'], ['E', C.E, 'Emma Clarke']] },
    { chat: 'I’ll call you later', mins: 195, team: [] },
    { chat: 'Did you see this?', mins: 200, team: [] },
    { chat: 'Almost there, five minutes', mins: 205, team: [] },
    { chat: 'Thanks for checking in', mins: 210, team: [] }
  ].sort(function (a, b) { return a.mins - b.mins; });   // Sort: Newest

  var now = new Date();
  function rel(m) { return m < 60 ? m + 'm ago' : Math.floor(m / 60) + 'h ago'; }
  function abs(m) { return new Date(now - m * 60000).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var table = document.getElementById('table');
  table.insertAdjacentHTML('beforeend', rows.map(function (r, i) {
    var shown = r.team.slice(0, 3), extra = r.team.length - shown.length;
    var team = r.team.length
      ? '<span class="avs" aria-label="' + esc(r.team.map(function (a) { return a[2]; }).join(', ')) + '">' + shown.map(function (a) {
          return '<span class="av" data-bg="' + a[1] + '" title="' + esc(a[2]) + '">' + a[0] + '</span>';
        }).join('') + (extra > 0 ? '<span class="av av--more" title="' + esc(r.team.slice(3).map(function (a) { return a[2]; }).join(', ')) + '">+' + extra + '</span>' : '') + '</span>'
      : '<span class="td__none" title="No members yet">—</span>';
    return '<div class="tr tr--body" role="row" tabindex="0" aria-label="Open chat: ' + esc(r.chat) + '" data-row="' + i + '">' +
      '<div class="td" role="cell"><span class="td__txt td__name">' + esc(r.chat) + '</span></div>' +
      '<div class="td td--r" role="cell">' + team + '</div>' +
      '<div class="td td--r" role="cell"><span class="td__txt">$0.70</span></div>' +
      '<div class="td td--r td--time" role="cell"><time class="td__time" datetime="' + new Date(now - r.mins * 60000).toISOString() + '" title="' + abs(r.mins) + '">' + rel(r.mins) + '</time>' +
        '<button class="rowbtn" aria-label="Actions for ' + esc(r.chat) + '" aria-haspopup="menu" aria-expanded="false"><img alt="" src=\'' + A('row-dots-vertical.svg') + '\'></button></div>' +
    '</div>';
  }).join(''));
  // background colours applied from data (keeps the markup free of inline style strings)
  [].forEach.call(table.querySelectorAll('.av[data-bg]'), function (el) { el.style.background = el.getAttribute('data-bg'); });
  // option 2 pill labels take the file's whole-px text box widths
  [].forEach.call(document.querySelectorAll('.pill__t[data-w]'), function (el) { el.style.width = el.getAttribute('data-w') + 'px'; });

  var frame = document.getElementById('frame');
  var menus = { hdr: document.getElementById('menu-hdr'), row: document.getElementById('menu-row'), sub: document.getElementById('menu-sub') };
  var hdrBtn = document.getElementById('hdr-more');
  var addItem = document.getElementById('add-to-project');
  var activeRowBtn = null, subTimer = null;

  // geometry in artboard pixels (the frame may be scaled to fit the window)
  function box(el) {
    var f = frame.getBoundingClientRect(), b = el.getBoundingClientRect(), s = f.width / 1440;
    return { left: (b.left - f.left) / s, top: (b.top - f.top) / s, right: (b.right - f.left) / s, bottom: (b.bottom - f.top) / s };
  }

  function closeSub() { menus.sub.hidden = true; addItem.classList.remove('is-open'); }
  function closeAll() {
    Object.keys(menus).forEach(function (k) { menus[k].hidden = true; });
    addItem.classList.remove('is-open');
    hdrBtn.setAttribute('aria-expanded', 'false');
    if (activeRowBtn) { activeRowBtn.setAttribute('aria-expanded', 'false'); activeRowBtn.closest('.tr').classList.remove('is-active'); activeRowBtn = null; }
  }

  function openRowMenu(btn) {
    closeAll();
    activeRowBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    btn.closest('.tr').classList.add('is-active');
    var b = box(btn);
    menus.row.style.left = (b.right - 170) + 'px';
    menus.row.hidden = false;
    placeV(menus.row, b.bottom + 4, b.top - 4);
  }
  function openSub() {
    clearTimeout(subTimer);
    var m = box(menus.row), it = box(addItem);
    menus.sub.style.left = (m.right + 3) + 'px';
    menus.sub.hidden = false;
    placeV(menus.sub, it.top - 2.2);
    addItem.classList.add('is-open');
  }
  function openHdr() {
    // both files put the menu at x1160 y121: under the 1161,90 xs button (option 1) or the 1154,88 sm button (option 2)
    var hb = box(hdrBtn), o2 = frame.getAttribute('data-opt') === '2';
    menus.hdr.style.left = (hb.left + (o2 ? 6 : -1)) + 'px'; menus.hdr.style.top = (hb.bottom + (o2 ? 5 : 7)) + 'px';
    menus.hdr.hidden = false; hdrBtn.setAttribute('aria-expanded', 'true');
  }

  document.addEventListener('click', function (e) {
    var rb = e.target.closest('.rowbtn');
    if (rb) { e.stopPropagation(); if (activeRowBtn === rb) closeAll(); else openRowMenu(rb); return; }
    if (e.target.closest('#hdr-more')) {
      var open = menus.hdr.hidden; closeAll();
      if (open) openHdr();
      return;
    }
    if (e.target.closest('#add-to-project')) { openSub(); return; }
    if (e.target.closest('.ddi')) { closeAll(); return; }   // choosing an item closes the menus
    if (!e.target.closest('.dd')) closeAll();
  });

  // the sub-menu follows hover on "Add to Project", like a native cascading menu
  addItem.addEventListener('mouseenter', openSub);
  [addItem, menus.sub].forEach(function (el) {
    el.addEventListener('mouseleave', function () { subTimer = setTimeout(closeSub, 250); });
    el.addEventListener('mouseenter', function () { clearTimeout(subTimer); });
  });
  [].forEach.call(menus.row.querySelectorAll('.ddi:not(#add-to-project)'), function (el) {
    el.addEventListener('mouseenter', function () { subTimer = setTimeout(closeSub, 120); });
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });


  /* ---------------------------------------------------------------- projects landing (11657:386523) */
  var projects = ['Banking Issues', 'Docebo UI Assets', 'DT ODS System', 'Product Development', 'Quarterly Reports', 'HR Documents',
                  'Customer Support', 'Legal Documents', 'Sales Materials', 'Product Development', 'Quarterly Reports', 'HR Documents'];
  var grid = document.getElementById('pgrid');
  grid.innerHTML = projects.map(function (p, i) {
    return '<div class="pcard" role="link" tabindex="0" data-card="' + i + '" aria-label="Open project ' + esc(p) + '">' +
      '<div class="pcard__body">' +
        '<div class="pcard__icon"><img alt="" src=\'' + A('pc-folder.svg') + '\'></div>' +
        '<div class="pcard__txt">' +
          '<div><p class="pcard__title">' + esc(p) + '</p><p class="pcard__count">12 items</p></div>' +
          '<div class="pcard__meta"><span class="pcard__who"><span class="pcard__name">Ajeetabh Narayan</span><span class="pcard__dot">·</span><span class="pcard__date">12.04.2026</span></span>' +
            '<span class="pcard__icons"><img alt="Pinned" src=\'' + A('pc-pin.svg') + '\'><img alt="Private" src=\'' + A('pc-lock.svg') + '\'><img alt="Public link" src=\'' + A('pc-globe.svg') + '\'><img alt="Shared" src=\'' + A('pc-users.svg') + '\'></span></div>' +
        '</div>' +
      '</div>' +
      '<button class="pcard__more" aria-label="Project actions" aria-haspopup="menu" aria-expanded="false"><img alt="" src=\'' + A('pc-more.svg') + '\'></button>' +
    '</div>';
  }).join('');

  var views = { projects: document.getElementById('view-projects'), dashboard: document.getElementById('view-dashboard') };
  var cardMenu = document.getElementById('menu-card'), activeCard = null;
  function closeCardMenu() { cardMenu.hidden = true; if (activeCard) { activeCard.classList.remove('is-active'); activeCard.querySelector('.pcard__more').setAttribute('aria-expanded', 'false'); activeCard = null; } }
  // the dashboard title follows the project that was opened (falls back to the file's "Client Onboarding")
  var dashTitle = document.getElementById('dash-title');
  var crumbProject = document.getElementById('crumb-project');
  function setTitleText(n) { dashTitle.textContent = n; crumbProject.textContent = n + ' '; } // trailing space as in the file's text box
  function setTitle(card) { setTitleText(card.querySelector('.pcard__title').textContent); }
  // each #dashboard history entry remembers its project, so Back / Forward / reload show the right title
  function show(view, how) {
    closeAll(); closeCardMenu();
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== view; });
    setHash('#' + view, how || 'push', view === 'dashboard' ? { title: dashTitle.textContent } : null);
  }
  window.addEventListener('popstate', function (e) {
    var dash = location.hash === '#dashboard';
    if (dash && e.state && e.state.title) setTitleText(e.state.title);
    show(dash ? 'dashboard' : 'projects', 'none');   // never push from Back / Forward, or Back could never leave the page
  });

  document.addEventListener('click', function (e) {
    var more = e.target.closest('.pcard__more');
    if (more) {
      e.stopPropagation();
      var card = more.closest('.pcard');
      if (activeCard === card) { closeCardMenu(); return; }
      closeCardMenu(); activeCard = card; card.classList.add('is-active'); more.setAttribute('aria-expanded', 'true');
      var b = box(more);   // file: menu right edge = button right edge, top = button bottom + 5.5 (bottom-row cards open upward)
      cardMenu.style.left = (b.right - 140) + 'px';
      cardMenu.hidden = false; placeV(cardMenu, b.bottom + 5.5, b.top - 5.5); return;
    }
    if (e.target.closest('#menu-card')) { if (e.target.closest('.ddi')) closeCardMenu(); return; }
    if (!cardMenu.hidden) { closeCardMenu(); return; }
    var go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); show(go.getAttribute('data-go')); return; }
    var card = e.target.closest('.pcard');
    if (card) { setTitle(card); show('dashboard'); }
  }, true);
  // Search: icon at rest; click opens the field and filters cards by name; Esc or blur-while-empty closes it
  var ps = document.getElementById('psearch'), psBtn = document.getElementById('psearch-btn'), psIn = document.getElementById('psearch-in');
  var empty = document.createElement('p'); empty.className = 'pgrid__empty'; empty.hidden = true; grid.appendChild(empty);
  function filter() {
    var q = psIn.value.trim().toLowerCase(), n = 0;
    [].forEach.call(grid.querySelectorAll('.pcard'), function (c) { var hit = !q || c.querySelector('.pcard__title').textContent.toLowerCase().indexOf(q) > -1; c.hidden = !hit; if (hit) n++; });
    empty.hidden = n > 0; empty.textContent = 'No projects match \u201c' + psIn.value.trim() + '\u201d';
  }
  function openSearch() { ps.classList.add('is-open'); psBtn.setAttribute('aria-expanded', 'true'); psIn.tabIndex = 0; psIn.focus(); }
  function closeSearch() { psIn.value = ''; filter(); ps.classList.remove('is-open'); psBtn.setAttribute('aria-expanded', 'false'); psIn.tabIndex = -1; }
  psBtn.addEventListener('click', function (e) { e.stopPropagation(); openSearch(); });
  psIn.addEventListener('input', filter);
  psIn.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSearch(); psBtn.focus(); } });
  psIn.addEventListener('blur', function () { if (!psIn.value.trim()) closeSearch(); });

  grid.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('pcard')) { e.preventDefault(); setTitle(e.target); show('dashboard'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCardMenu(); });
  var st0 = histState();
  if (location.hash === '#dashboard' && st0 && st0.title) setTitleText(st0.title);
  show(location.hash === '#dashboard' ? 'dashboard' : 'projects', 'replace');   // first load rewrites its own entry


  /* ---------------------------------------------------------------- nav: modes, collapse, selection, sections */
  var frameEl = document.getElementById('frame');
  var modeQ = new URLSearchParams(location.search).get('mode');
  function setMode(m) {
    frameEl.setAttribute('data-mode', m);
    [].forEach.call(document.querySelectorAll('[data-mode-set]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-set') === m)); });
  }
  if (modeQ === 'light' || modeQ === 'dark') setMode(modeQ);
  [].forEach.call(document.querySelectorAll('[data-mode-set]'), function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode-set')); }); });

  function select(key) {
    [].forEach.call(document.querySelectorAll('[data-nav]'), function (el) {
      var on = el.getAttribute('data-nav') === key;
      el.classList.toggle('is-selected', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }
  select('projects');   // both designed pages live under Projects

  /* ---------------------------------------------------------------- inside page: option 1 / option 2 (15054:105151) */
  function setOpt(o) {
    closeAll();
    frameEl.setAttribute('data-opt', o);
    [].forEach.call(document.querySelectorAll('[data-opt-set]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-opt-set') === o)); });
  }
  var optQ = new URLSearchParams(location.search).get('opt');
  if (optQ === '1' || optQ === '2') setOpt(optQ);
  // picking an option from the landing page opens the inside page, so the choice is visible straight away
  [].forEach.call(document.querySelectorAll('[data-opt-set]'), function (b) {
    b.addEventListener('click', function () { setOpt(b.getAttribute('data-opt-set')); if (views.dashboard.hidden) show('dashboard'); });
  });

  // section chevrons are named for their section and say what a press will do
  function secLabel(b, open) { var t = b.parentElement.querySelector('.nsub__t, .lsub__t'); b.setAttribute('aria-label', (open ? 'Collapse ' : 'Expand ') + (t ? t.textContent.trim() : 'section')); }
  [].forEach.call(document.querySelectorAll('[data-act="section"]'), function (b) { secLabel(b, true); });

  document.addEventListener('click', function (e) {
    // rows with no designed page are bare <a href="#">: in a srcdoc preview '#' resolves to the host page and
    // unloads the prototype, and served it fires popstate (back to the landing). They stay put instead.
    if (e.target.closest('a[href="#"]')) e.preventDefault();
    var t = e.target.closest('[data-act="collapse"], [data-act="expand"], [data-act="section"], [data-nav]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'collapse' || act === 'expand') {
      e.preventDefault(); e.stopPropagation();
      frameEl.setAttribute('data-rail', act === 'collapse' ? 'collapsed' : 'expanded'); closeAll();
      // the pressed button is now hidden: hand focus to its counterpart so keyboard users stay in the nav
      var to = document.querySelector((act === 'collapse' ? '#rail-' : '#nav-') + frameEl.getAttribute('data-mode') + ' [data-act="' + (act === 'collapse' ? 'expand' : 'collapse') + '"]');
      if (to) to.focus();
      return;
    }
    if (act === 'section') {
      e.preventDefault(); e.stopPropagation(); closeAll();
      var grp = t.closest('.ngrp, .nhgrp, .lgrp');
      var dark = !!t.closest('#nav-dark');
      var shut = grp.classList.toggle('is-collapsed');
      t.setAttribute('aria-expanded', String(!shut)); secLabel(t, !shut);
      t.querySelector('img').src = A(shut ? (dark ? 'nav-chev-right-dark.svg' : 'lt-chev-right.svg') : (dark ? 'nav-chevron-sub.svg' : 'lt-chev-down.svg'));
      return;
    }
    e.preventDefault();
    var key = t.getAttribute('data-nav');
    select(key);
    if (key === 'projects') show('projects');   // the only nav item with a designed page
  }, true);

  // ?state=frame reproduces the frame exactly as drawn (its hover states pinned on) for 1:1 diffs; add &opt=2 for option 2
  if (new URLSearchParams(location.search).get('state') === 'frame') {
    show('dashboard');
    [document.querySelectorAll('.ngrp--sec')[1].querySelector('.nrow'),
     document.querySelectorAll('.nhgrp')[0].querySelectorAll('.nchat')[1],
     document.querySelectorAll('.tab')[1],
     document.querySelector('.filters .ftab'),
     table.querySelectorAll('.tr--body')[2],
     table.querySelectorAll('.rowbtn')[2]].forEach(function (el) { el.classList.add('is-hover'); });
  }

  if (new URLSearchParams(location.search).get('state') === 'landing') {
    var c2 = grid.querySelectorAll('.pcard')[1]; c2.classList.add('is-hover'); c2.querySelector('.pcard__more').click();
    cardMenu.querySelector('.ddi').classList.add('is-hover');
    [document.querySelectorAll('.ngrp--sec')[1].querySelector('.nrow'), document.querySelectorAll('.nhgrp')[0].querySelectorAll('.nchat')[1]].forEach(function (el) { el.classList.add('is-hover'); });
  }
  // ?state=menus opens all three menus at once, with the item hovers drawn in the file, for 1:1 diffs
  if (new URLSearchParams(location.search).get('state') === 'menus') {
    show('dashboard');
    openRowMenu(table.querySelectorAll('.rowbtn')[2]); openSub();
    openHdr(); menus.hdr.querySelector('.ddi').classList.add('is-hover');   // not .click(): that closes the other two first
  }

})();
