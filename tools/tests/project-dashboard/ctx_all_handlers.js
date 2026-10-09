// ctx_all_handlers: exercises EVERY app.js handler once, synchronously (safe in --ctx sandbox/srcdoc).
// Each key in the report is true when the behaviour is correct; failures are collected in r.fail.
(function () {
  var r = { fail: [] }, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame');
  function ok(name, cond, info) { r[name] = !!cond; if (!cond) r.fail.push(name + (info !== undefined ? ' :: ' + JSON.stringify(info) : '')); }
  function vis(el) { if (!el) return false; var b = el.getBoundingClientRect(); return !el.hidden && getComputedStyle(el).display !== 'none' && b.width > 0 && b.height > 0; }
  function inViewport(el) { var b = el.getBoundingClientRect(); return b.top >= -0.5 && b.left >= -0.5 && b.bottom <= innerHeight + 0.5 && b.right <= innerWidth + 0.5 && b.width > 0; }
  function inFrame(el) { var f = frame.getBoundingClientRect(), b = el.getBoundingClientRect(); return b.top >= f.top - 0.5 && b.left >= f.left - 0.5 && b.bottom <= f.bottom + 0.5 && b.right <= f.right + 0.5; }
  function s() { return frame.getBoundingClientRect().width / 1440; }
  function key(el, k) { el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })); }
  var navShown = function () { return ['nav-dark', 'nav-light', 'rail-dark', 'rail-light'].filter(function (id) { return getComputedStyle(document.getElementById(id)).display !== 'none'; }); };
  try {
    r.loc = { href: location.href.slice(0, 60), search: location.search, hash: location.hash };
    // ---------------------------------------------------------------- init
    ok('init_fitSet', getComputedStyle(frame).getPropertyValue('--fit').trim() !== '');
    ok('init_frameInViewport', inViewport(frame), frame.getBoundingClientRect().toJSON());
    ok('init_landingShown', !q('#view-projects').hidden && q('#view-dashboard').hidden);
    ok('init_cardsBuilt', qa('.pcard').length === 12);
    ok('init_rowsBuilt', qa('.tr--body').length === 8);
    ok('init_selectedProjects', qa('[data-nav].is-selected').length === qa('[data-nav="projects"]').length && qa('[data-nav="projects"]').every(function (e) { return e.classList.contains('is-selected') && e.getAttribute('aria-current') === 'page'; }));
    var m0 = frame.dataset.mode;
    ok('init_navHeaderVisible', vis(q('#nav-' + m0 + ' .nav__head')) && inViewport(q('#nav-' + m0 + ' .nav__head')));
    ok('init_ariaPressedMatchesMode', q('[data-mode-set="' + m0 + '"]').getAttribute('aria-pressed') === 'true' && q('[data-mode-set="' + (m0 === 'dark' ? 'light' : 'dark') + '"]').getAttribute('aria-pressed') === 'false');
    ok('demoSwitchInViewport', inViewport(q('.demo-switch')));
    // runtime-rendered imgs and all imgs should be self-contained (data: URIs) in the built file
    var badImg = qa('img').filter(function (i) { return !/^data:/.test(i.getAttribute('src') || ''); }).map(function (i) { return i.getAttribute('src'); });
    ok('allImgsInlined', badImg.length === 0, badImg.slice(0, 5));

    // ---------------------------------------------------------------- mode switch
    ['light', 'dark', 'light', 'dark'].forEach(function (m, i) {
      q('[data-mode-set="' + m + '"]').click();
      ok('mode_' + i + '_' + m, frame.dataset.mode === m && navShown().join() === 'nav-' + m && q('[data-mode-set="' + m + '"]').getAttribute('aria-pressed') === 'true', navShown());
      ok('mode_' + i + '_' + m + '_headerVisible', inViewport(q('#nav-' + m + ' .nav__head')));
    });

    // ---------------------------------------------------------------- collapse / expand, both modes
    ['dark', 'light'].forEach(function (m) {
      q('[data-mode-set="' + m + '"]').click();
      q('#nav-' + m + ' [data-act="collapse"]').click();
      ok('collapse_' + m, frame.dataset.rail === 'collapsed' && navShown().join() === 'rail-' + m, navShown());
      ok('collapse_' + m + '_mainShift', Math.abs((q('#view-projects').getBoundingClientRect().left - frame.getBoundingClientRect().left) / s() - 56) < 1);
      ok('collapse_' + m + '_railLogoVisible', inViewport(q('#rail-' + m + ' .rail__logo')));
      // mode switch while collapsed keeps the rail
      var other = m === 'dark' ? 'light' : 'dark';
      q('[data-mode-set="' + other + '"]').click();
      ok('collapse_' + m + '_switchToOther', navShown().join() === 'rail-' + other);
      q('[data-mode-set="' + m + '"]').click();
      q('#rail-' + m + ' [data-act="expand"]').click();
      ok('expand_' + m, frame.dataset.rail === 'expanded' && navShown().join() === 'nav-' + m, navShown());
    });
    q('[data-mode-set="dark"]').click();

    // ---------------------------------------------------------------- section chevrons (every one, both navs)
    qa('[data-act="section"]').forEach(function (b, i) {
      var grp = b.closest('.ngrp, .nhgrp, .lgrp'), nav = b.closest('nav').id;
      var kids = [].filter.call(grp.children, function (c) { return !c.matches('.nsub, .lsub, .nsep'); });
      b.click();
      var hidden = kids.every(function (c) { return getComputedStyle(c).display === 'none'; });
      var src1 = b.querySelector('img').getAttribute('src');
      ok('section_' + i + '_' + nav + '_collapse', grp.classList.contains('is-collapsed') && b.getAttribute('aria-expanded') === 'false' && hidden && /^data:/.test(src1), { cls: grp.className, src: src1.slice(0, 30) });
      b.click();
      var shown = kids.every(function (c) { return getComputedStyle(c).display !== 'none'; });
      ok('section_' + i + '_' + nav + '_expand', !grp.classList.contains('is-collapsed') && b.getAttribute('aria-expanded') === 'true' && shown && /^data:/.test(b.querySelector('img').getAttribute('src')));
    });
    r.sectionCount = qa('[data-act="section"]').length;

    // ---------------------------------------------------------------- every [data-nav] (all four navs)
    q('.pcard:nth-child(4) .pcard__title').click();   // be on the dashboard first
    qa('[data-nav]').forEach(function (el, i) {
      var k = el.getAttribute('data-nav'), nav = el.closest('nav').id;
      var wasDash = !q('#view-dashboard').hidden;
      var ev = new MouseEvent('click', { bubbles: true, cancelable: true }); el.dispatchEvent(ev);
      var sel = qa('[data-nav].is-selected');
      ok('nav_' + i + '_' + nav + '_' + k, ev.defaultPrevented && sel.length === qa('[data-nav="' + k + '"]').length && sel.every(function (e) { return e.getAttribute('data-nav') === k; }) &&
        (k === 'projects' ? !q('#view-projects').hidden : (!q('#view-dashboard').hidden) === wasDash), { prevented: ev.defaultPrevented, sel: sel.length });
      if (k === 'projects') q('.pcard:nth-child(4) .pcard__title').click();
    });
    q('#nav-dark [data-nav="projects"]').click();
    ok('nav_backToProjectsLanding', !q('#view-projects').hidden && q('#view-dashboard').hidden);

    // ---------------------------------------------------------------- card click, Enter, Space
    q('.pcard:nth-child(2)').click();
    ok('card_click', !q('#view-dashboard').hidden && q('#dash-title').textContent === 'Docebo UI Assets' && q('#crumb-project').textContent === 'Docebo UI Assets ');
    q('[data-go="projects"]').click();
    ok('breadcrumb_back', !q('#view-projects').hidden && q('#view-dashboard').hidden);
    var c5 = q('.pcard:nth-child(5)'); c5.focus(); key(c5, 'Enter');
    ok('card_enter', !q('#view-dashboard').hidden && q('#dash-title').textContent === 'Quarterly Reports');
    q('[data-go="projects"]').click();
    var c3 = q('.pcard:nth-child(3)'); key(c3, ' ');
    ok('card_space', !q('#view-dashboard').hidden && q('#dash-title').textContent === 'DT ODS System');
    q('[data-go="projects"]').click();

    // ---------------------------------------------------------------- card menu
    var c7 = q('.pcard:nth-child(7)'), more = c7.querySelector('.pcard__more');
    more.click();
    var cm = q('#menu-card');
    var mb = cm.getBoundingClientRect(), bb = more.getBoundingClientRect();
    ok('cardMenu_open', !cm.hidden && vis(cm) && c7.classList.contains('is-active') && more.getAttribute('aria-expanded') === 'true' && q('#view-projects').hidden === false);
    ok('cardMenu_pos', Math.abs(mb.right - bb.right) / s() < 1 && Math.abs((mb.top - bb.bottom) / s() - 5.5) < 1, { dr: (mb.right - bb.right) / s(), dt: (mb.top - bb.bottom) / s() });
    ok('cardMenu_inFrame', inFrame(cm));
    more.click();
    ok('cardMenu_toggleClose', cm.hidden && !c7.classList.contains('is-active') && more.getAttribute('aria-expanded') === 'false');
    more.click(); cm.querySelector('.ddi').click();
    ok('cardMenu_itemCloses', cm.hidden && q('#view-projects').hidden === false);
    more.click(); key(document.body, 'Escape');
    ok('cardMenu_escape', cm.hidden);
    more.click(); q('.pl__title').click();
    ok('cardMenu_outsideClickCloses_noNav', cm.hidden && !q('#view-projects').hidden);
    more.click(); q('.pcard:nth-child(1) .pcard__title').click();
    ok('cardMenu_cardClickWhileOpen_onlyCloses', cm.hidden && !q('#view-projects').hidden);
    // every card's ⋯ menu stays inside the frame
    var outCards = qa('.pcard').map(function (c, i) { c.querySelector('.pcard__more').click(); var o = inFrame(cm); c.querySelector('.pcard__more').click(); return o ? null : i; }).filter(function (x) { return x !== null; });
    ok('cardMenu_allInFrame', outCards.length === 0, outCards);

    // ---------------------------------------------------------------- search
    var ps = q('#psearch'), psBtn = q('#psearch-btn'), psIn = q('#psearch-in');
    psBtn.click();
    ok('search_open', ps.classList.contains('is-open') && psBtn.getAttribute('aria-expanded') === 'true' && psIn.tabIndex === 0);
    r.search_focused = document.activeElement === psIn;
    psIn.value = 'product'; psIn.dispatchEvent(new Event('input', { bubbles: true }));
    var shownCards = qa('.pcard').filter(function (c) { return !c.hidden && getComputedStyle(c).display !== 'none'; });
    ok('search_filter', shownCards.length === 2 && shownCards.every(function (c) { return /product/i.test(c.querySelector('.pcard__title').textContent); }), shownCards.length);
    psIn.value = 'zzz'; psIn.dispatchEvent(new Event('input', { bubbles: true }));
    var emptyEl = q('.pgrid__empty');
    ok('search_noMatch', qa('.pcard').every(function (c) { return c.hidden; }) && emptyEl && !emptyEl.hidden && /zzz/.test(emptyEl.textContent));
    key(psIn, 'Escape');
    ok('search_escape', !ps.classList.contains('is-open') && psIn.value === '' && qa('.pcard').every(function (c) { return !c.hidden; }) && emptyEl.hidden && psBtn.getAttribute('aria-expanded') === 'false' && psIn.tabIndex === -1);
    // blur-while-empty closes
    psBtn.click(); psIn.dispatchEvent(new FocusEvent('blur'));
    ok('search_blurEmptyCloses', !ps.classList.contains('is-open'));

    // ---------------------------------------------------------------- dashboard: row menu, submenu, header menu
    q('.pcard:nth-child(1)').click();
    var rowBtns = qa('.rowbtn'), rm = q('#menu-row'), sub = q('#menu-sub'), add = q('#add-to-project');
    var outRows = [];
    rowBtns.forEach(function (b, i) {
      b.click();
      var ok1 = !rm.hidden && b.getAttribute('aria-expanded') === 'true' && b.closest('.tr').classList.contains('is-active');
      var R = rm.getBoundingClientRect(), B = b.getBoundingClientRect();
      // 4px below the button, or (when that would pass the artboard's bottom) 4px above it
      var pos = Math.abs(R.right - B.right) / s() < 1 && (Math.abs((R.top - B.bottom) / s() - 4) < 1 || Math.abs((B.top - R.bottom) / s() - 4) < 1) && inFrame(rm);
      add.click();
      var ok2 = !sub.hidden && add.classList.contains('is-open');
      var S = sub.getBoundingClientRect(), A = add.getBoundingClientRect();
      // 2.2px above the item, or clamped 8px above the artboard's bottom edge
      var FB = q('#frame').getBoundingClientRect().bottom;
      var spos = Math.abs((S.left - R.right) / s() - 3) < 1 && (Math.abs((S.top - A.top) / s() + 2.2) < 1 || Math.abs((FB - S.bottom) / s() - 8) < 1) && inFrame(sub);
      if (!inFrame(rm) || !inFrame(sub)) outRows.push(i);
      if (!(ok1 && pos && ok2 && spos)) r.fail.push('rowMenu_' + i + ' :: ' + JSON.stringify({ ok1: ok1, pos: pos, ok2: ok2, spos: spos }));
      b.click();   // same button toggles closed
      if (!rm.hidden || !sub.hidden || b.getAttribute('aria-expanded') !== 'false' || b.closest('.tr').classList.contains('is-active')) r.fail.push('rowMenu_' + i + '_toggleClose');
    });
    r.rowMenus_allOk = r.fail.filter(function (f) { return /^rowMenu_/.test(f); }).length === 0;
    ok('rowMenus_allInFrame', outRows.length === 0, outRows);
    // sub-menu item closes everything; mouseenter on add opens sub
    rowBtns[1].click(); add.dispatchEvent(new MouseEvent('mouseenter'));
    ok('sub_mouseenterOpens', !sub.hidden);
    sub.querySelector('.ddi').click();
    ok('sub_itemClosesAll', rm.hidden && sub.hidden && !add.classList.contains('is-open') && rowBtns[1].getAttribute('aria-expanded') === 'false');
    // switching from one row's menu to another's
    rowBtns[0].click(); rowBtns[3].click();
    ok('rowMenu_switchRows', !rm.hidden && rowBtns[0].getAttribute('aria-expanded') === 'false' && rowBtns[3].getAttribute('aria-expanded') === 'true');
    key(document.body, 'Escape');
    ok('rowMenu_escape', rm.hidden && rowBtns[3].getAttribute('aria-expanded') === 'false');
    // header menu
    var hb = q('#hdr-more'), hm = q('#menu-hdr');
    hb.click();
    var H = hm.getBoundingClientRect(), HB = hb.getBoundingClientRect();
    ok('hdrMenu_open', !hm.hidden && hb.getAttribute('aria-expanded') === 'true' && Math.abs((H.left - HB.left) / s() + 1) < 1 && Math.abs((H.top - HB.bottom) / s() - 7) < 1 && inFrame(hm));
    hb.click();
    ok('hdrMenu_toggleClose', hm.hidden && hb.getAttribute('aria-expanded') === 'false');
    hb.click(); hm.querySelector('.ddi').click();
    ok('hdrMenu_itemCloses', hm.hidden);
    hb.click(); q('#dash-title').click();
    ok('hdrMenu_outsideCloses', hm.hidden && !q('#view-dashboard').hidden);
    // a row menu then the header menu: only one open
    rowBtns[2].click(); hb.click();
    ok('hdr_closesRowMenu', rm.hidden && !hm.hidden);
    // collapsing the rail closes menus
    q('#nav-dark [data-act="collapse"]').click();
    ok('collapse_closesMenus', hm.hidden && rm.hidden);
    q('#rail-dark [data-act="expand"]').click();
    // row menu position correct while collapsed (main shifts by 224)
    q('#nav-dark [data-act="collapse"]').click(); rowBtns[0].click();
    var R2 = rm.getBoundingClientRect(), B2 = rowBtns[0].getBoundingClientRect();
    ok('rowMenu_posCollapsed', Math.abs(R2.right - B2.right) / s() < 1 && inFrame(rm));
    key(document.body, 'Escape'); q('#rail-dark [data-act="expand"]').click();
    // breadcrumb back closes menus
    rowBtns[0].click(); q('[data-go="projects"]').click();
    ok('breadcrumb_closesMenus', rm.hidden && !q('#view-projects').hidden);
    r.hashAfterNav = location.hash;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  r.failCount = r.fail.length;
  window.__report(r);
})();
