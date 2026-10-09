// menu_ lens: pages + menus. SYNCHRONOUS (safe for --ctx sandbox / srcdoc).
// Checks menu anchoring (artboard px, +-1) in expanded and collapsed rails, that every menu item is
// actually on screen and hittable (not clipped by the 1440x900 #frame), close behaviour (outside
// click, item click, Escape, toggle), one-family-at-a-time, search filter/empty/Escape, and the
// dashboard title/breadcrumb following the clicked card.
(function () {
  var r = { fails: [], info: {} };
  var q = function (s) { return document.querySelector(s); };
  var qa = function (s, root) { return [].slice.call((root || document).querySelectorAll(s)); };
  try {
    var frame = q('#frame');
    var cardMenu = q('#menu-card'), rowMenu = q('#menu-row'), subMenu = q('#menu-sub'), hdrMenu = q('#menu-hdr');
    var hdrBtn = q('#hdr-more'), addItem = q('#add-to-project');
    function box(el) {
      var f = frame.getBoundingClientRect(), b = el.getBoundingClientRect(), s = f.width / 1440;
      return { left: (b.left - f.left) / s, top: (b.top - f.top) / s, right: (b.right - f.left) / s, bottom: (b.bottom - f.top) / s };
    }
    function rd(n) { return Math.round(n * 10) / 10; }
    function near(a, b) { return Math.abs(a - b) <= 1; }
    function fail(tag, msg) { r.fails.push(tag + ': ' + msg); }
    function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0; }
    function esc(target) { (target || document).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }
    function anyMenuOpen() { return [cardMenu, rowMenu, subMenu, hdrMenu].filter(shown).map(function (m) { return m.id; }); }
    // every item in an open menu must be inside the artboard and be the top-most element at its centre
    function hittable(tag, menu) {
      var m = box(menu);
      if (m.bottom > 900.5 || m.right > 1440.5 || m.left < -0.5 || m.top < -0.5)
        fail(tag, menu.id + ' extends outside the 1440x900 artboard (frame is overflow:hidden): box=' + JSON.stringify({ l: rd(m.left), t: rd(m.top), r: rd(m.right), b: rd(m.bottom) }));
      qa('.ddi', menu).forEach(function (it) {
        var b = it.getBoundingClientRect(), hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        if (!hit || !it.contains(hit)) fail(tag, menu.id + ' item "' + it.textContent.trim() + '" not hittable at its centre (artboard y=' + rd(box(it).top + 16) + ', hit=' + (hit ? (hit.id || hit.className || hit.tagName) : 'null') + ')');
      });
    }
    var views = { projects: q('#view-projects'), dashboard: q('#view-dashboard') };
    function goProjects() { if (views.projects.hidden) q('[data-go="projects"]').click(); }
    function cards() { return qa('#pgrid .pcard'); }

    r.info.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    r.info.scale = rd(frame.getBoundingClientRect().width / 1440 * 1000) / 1000;
    r.info.viewport = [innerWidth, innerHeight];

    function landing(tag) {
      goProjects();
      var cs = cards();
      if (cs.length !== 12) fail(tag, 'expected 12 cards, got ' + cs.length);
      cs.forEach(function (c, i) {
        var t = tag + ' card' + i, more = c.querySelector('.pcard__more');
        more.click();
        if (!shown(cardMenu)) { fail(t, 'card menu did not open'); return; }
        var m = box(cardMenu), b = box(more);
        if (!near(m.right, b.right)) fail(t, 'menu right ' + rd(m.right) + ' != ⋯ right ' + rd(b.right));
        if (!near(m.top, b.bottom + 5.5)) fail(t, 'menu top ' + rd(m.top) + ' != ⋯ bottom+5.5 ' + rd(b.bottom + 5.5));
        if (more.getAttribute('aria-expanded') !== 'true') fail(t, 'aria-expanded not true');
        hittable(t, cardMenu);
        if (i === 11) r.info[tag + '_lastCardMenu'] = { top: rd(m.top), bottom: rd(m.bottom) };
        esc();
        if (shown(cardMenu)) fail(t, 'Escape did not close card menu');
        if (c.classList.contains('is-active') || more.getAttribute('aria-expanded') !== 'false') fail(t, 'card still active after Escape');
      });
      var c0 = cs[0], c1 = cs[1];
      // toggle
      c0.querySelector('.pcard__more').click(); c0.querySelector('.pcard__more').click();
      if (shown(cardMenu)) fail(tag, 'second click on ⋯ did not close card menu');
      // outside click
      c0.querySelector('.pcard__more').click(); q('.pl__title').click();
      if (shown(cardMenu)) fail(tag, 'outside click did not close card menu');
      if (views.projects.hidden) fail(tag, 'outside click navigated away');
      // item click
      c0.querySelector('.pcard__more').click(); cardMenu.querySelector('.ddi').click();
      if (shown(cardMenu)) fail(tag, 'item click did not close card menu');
      if (views.projects.hidden) fail(tag, 'card menu item click navigated to dashboard');
      // switching cards
      c0.querySelector('.pcard__more').click(); c1.querySelector('.pcard__more').click();
      if (c0.classList.contains('is-active')) fail(tag, 'card 0 still active after opening card 1 menu');
      if (!near(box(cardMenu).right, box(c1.querySelector('.pcard__more')).right)) fail(tag, 'menu not re-anchored to card 1');
      esc();
    }

    function search(tag) {
      goProjects();
      var ps = q('#psearch'), btn = q('#psearch-btn'), inp = q('#psearch-in');
      var empty = q('.pgrid__empty');
      btn.click();
      if (!ps.classList.contains('is-open')) fail(tag, 'search did not open');
      function run(v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); return cards().filter(shown).map(function (c) { return c.querySelector('.pcard__title').textContent; }); }
      var all = cards().map(function (c) { return c.querySelector('.pcard__title').textContent; });
      [['product', null], ['BANK', null], ['  hr  ', 'hr'], ['o', null], ['zzzz', null]].forEach(function (p) {
        var vis = run(p[0]), needle = (p[1] || p[0]).trim().toLowerCase();
        var exp = all.filter(function (t) { return t.toLowerCase().indexOf(needle) > -1; });
        if (vis.length !== exp.length || vis.join('|') !== exp.join('|')) fail(tag, 'filter "' + p[0] + '" shows [' + vis.join(', ') + '] expected [' + exp.join(', ') + ']');
        if (exp.length === 0) {
          if (!empty || !shown(empty)) fail(tag, 'empty message not shown for "' + p[0] + '"');
          else {
            if (empty.textContent.indexOf(p[0].trim()) < 0) fail(tag, 'empty message text: ' + empty.textContent);
            var eb = box(empty); if (eb.bottom > 900 || eb.top < 0) fail(tag, 'empty message outside artboard');
          }
        } else if (empty && shown(empty)) fail(tag, 'empty message shown while ' + exp.length + ' cards match "' + p[0] + '"');
      });
      run('zzzz');
      esc(inp);
      var after = cards().filter(shown).length;
      if (after !== 12) fail(tag, 'Escape restored ' + after + ' cards, expected 12');
      if (empty && shown(empty)) fail(tag, 'empty message still shown after Escape');
      if (ps.classList.contains('is-open') || inp.value !== '') fail(tag, 'search not closed/cleared after Escape');
      r.info[tag + '_search'] = 'ran';
    }

    function dashboard(tag) {
      // open via click on several cards, then via Enter
      [0, 4, 9].forEach(function (i) {
        goProjects();
        var c = cards()[i], name = c.querySelector('.pcard__title').textContent;
        c.querySelector('.pcard__title').click();
        if (views.dashboard.hidden || !views.projects.hidden) fail(tag, 'card ' + i + ' click did not open dashboard');
        if (q('#dash-title').textContent !== name) fail(tag, 'title "' + q('#dash-title').textContent + '" != "' + name + '"');
        if (q('#crumb-project').textContent.trim() !== name) fail(tag, 'crumb "' + q('#crumb-project').textContent + '" != "' + name + '"');
      });
      goProjects();
      var c7 = cards()[7], n7 = c7.querySelector('.pcard__title').textContent;
      c7.focus(); c7.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      if (views.dashboard.hidden || q('#dash-title').textContent !== n7 || q('#crumb-project').textContent.trim() !== n7) fail(tag, 'Enter on card 7 did not open dashboard titled ' + n7);

      var rows = qa('#table .tr--body');
      rows.forEach(function (row, i) {
        var t = tag + ' row' + i, rb = row.querySelector('.rowbtn');
        rb.click();
        if (!shown(rowMenu)) { fail(t, 'row menu did not open'); return; }
        var m = box(rowMenu), b = box(rb);
        if (!near(m.right, b.right)) fail(t, 'row menu right ' + rd(m.right) + ' != ⋮ right ' + rd(b.right));
        if (!near(m.top, b.bottom + 4)) fail(t, 'row menu top ' + rd(m.top) + ' != ⋮ bottom+4 ' + rd(b.bottom + 4));
        hittable(t, rowMenu);
        addItem.click();
        if (!shown(subMenu)) { fail(t, 'submenu did not open'); }
        else {
          var s = box(subMenu), m2 = box(rowMenu);
          if (!near(s.left, m2.right + 3)) fail(t, 'submenu left ' + rd(s.left) + ' != row menu right+3 ' + rd(m2.right + 3));
          hittable(t, subMenu);
          if (i === rows.length - 1) r.info[tag + '_lastRow'] = { rowMenu: [rd(m2.top), rd(m2.bottom)], sub: [rd(s.top), rd(s.bottom)] };
        }
        esc();
        if (anyMenuOpen().length) fail(t, 'Escape left open: ' + anyMenuOpen());
        if (row.classList.contains('is-active') || rb.getAttribute('aria-expanded') !== 'false') fail(t, 'row still active after Escape');
      });
      var rb0 = rows[1].querySelector('.rowbtn');
      rb0.click(); rb0.click(); if (shown(rowMenu)) fail(tag, 'second click on ⋮ did not close row menu');
      rb0.click(); q('.page__desc').click(); if (shown(rowMenu)) fail(tag, 'outside click did not close row menu');
      rb0.click(); rowMenu.querySelector('.ddi').click(); if (shown(rowMenu)) fail(tag, 'row item click did not close row menu');
      rb0.click(); addItem.click(); subMenu.querySelector('.dd__search').click();
      if (!shown(subMenu) || !shown(rowMenu)) fail(tag, 'click inside submenu search closed menus');
      subMenu.querySelector('.ddi').click(); if (anyMenuOpen().length) fail(tag, 'sub item click left open: ' + anyMenuOpen());
      rb0.click(); addItem.click(); q('.page__desc').click(); if (anyMenuOpen().length) fail(tag, 'outside click with sub open left: ' + anyMenuOpen());

      // header menu
      hdrBtn.click();
      if (!shown(hdrMenu)) fail(tag, 'header menu did not open');
      else {
        var h = box(hdrMenu), hb = box(hdrBtn);
        if (!near(h.left, hb.left - 1)) fail(tag, 'hdr menu left ' + rd(h.left) + ' != ⋮ left-1 ' + rd(hb.left - 1));
        if (!near(h.top, hb.bottom + 7)) fail(tag, 'hdr menu top ' + rd(h.top) + ' != ⋮ bottom+7 ' + rd(hb.bottom + 7));
        hittable(tag + ' hdr', hdrMenu);
        if (hdrBtn.getAttribute('aria-expanded') !== 'true') fail(tag, 'hdr aria-expanded not true');
      }
      hdrBtn.click(); if (shown(hdrMenu)) fail(tag, 'second click on header ⋮ did not close');
      hdrBtn.click(); esc(); if (shown(hdrMenu)) fail(tag, 'Escape did not close header menu');
      hdrBtn.click(); q('.page__desc').click(); if (shown(hdrMenu)) fail(tag, 'outside click did not close header menu');
      hdrBtn.click(); hdrMenu.querySelector('.ddi').click(); if (shown(hdrMenu)) fail(tag, 'item click did not close header menu');
      // one family at a time
      rb0.click(); addItem.click(); hdrBtn.click();
      var open = anyMenuOpen();
      if (open.join() !== 'menu-hdr') fail(tag, 'row+sub then header ⋮ -> open: ' + open);
      if (rb0.getAttribute('aria-expanded') !== 'false' || rows[1].classList.contains('is-active')) fail(tag, 'row still active after header menu opened');
      rb0.click(); open = anyMenuOpen();
      if (open.join() !== 'menu-row') fail(tag, 'header then row ⋮ -> open: ' + open);
      if (hdrBtn.getAttribute('aria-expanded') !== 'false') fail(tag, 'hdr aria-expanded stuck true');
      // leaving the page closes menus
      addItem.click(); q('[data-go="projects"]').click();
      if (anyMenuOpen().length) fail(tag, 'breadcrumb back left menus open: ' + anyMenuOpen());
      if (views.projects.hidden) fail(tag, 'breadcrumb did not return to projects');
    }

    function suite(tag) { landing(tag); search(tag); dashboard(tag); }

    suite('expanded');
    var col = frame.getAttribute('data-mode') === 'light' ? '#nav-light' : '#nav-dark';
    q(col + ' [data-act="collapse"]').click();
    if (frame.getAttribute('data-rail') !== 'collapsed') fail('rail', 'collapse did not apply');
    suite('collapsed');
    // mode switch while collapsed, card menu open
    goProjects(); cards()[2].querySelector('.pcard__more').click(); q('[data-mode-set="light"]').click();
    if (shown(cardMenu)) fail('collapsed', 'mode switch left card menu open');
    landing('collapsed-light');
    q('#rail-light [data-act="expand"]').click();
    if (frame.getAttribute('data-rail') !== 'expanded') fail('rail', 'expand did not apply');
    landing('expanded-light');
    r.failCount = r.fails.length;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
