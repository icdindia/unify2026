// lay_ : scaling + layout lens. SYNCHRONOUS (works in every ctx). Runs after app.js.
// For the current viewport: --fit, frame inside viewport, nav header/footer visible,
// .demo-switch vs every visible interactive control (both views x both rails x both modes,
// at rest and with row/card hover forced), .pl/.page centring in .main, menus inside the artboard.
(function () {
  var r = { states: {}, problems: [] };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  function rr(b) { return [rd(b.left), rd(b.top), rd(b.right), rd(b.bottom)]; }
  try {
    var frame = q('#frame'), W = innerWidth, H = innerHeight;
    r.inner = [W, H];
    var fitCss = parseFloat(getComputedStyle(frame).getPropertyValue('--fit'));
    var exp = Math.min(1, W / 1440, H / 900);
    r.fit = fitCss; r.fitExpected = exp; r.fitOk = Math.abs(fitCss - exp) < 1e-6;
    if (!r.fitOk) r.problems.push('fit ' + fitCss + ' != ' + exp);
    var fr = frame.getBoundingClientRect();
    r.frameRect = rr(fr);
    r.frameScaleOk = Math.abs(fr.width - 1440 * exp) < 1 && Math.abs(fr.height - 900 * exp) < 1;
    r.frameInside = fr.left >= -0.5 && fr.top >= -0.5 && fr.right <= W + 0.5 && fr.bottom <= H + 0.5;
    r.frameCentred = Math.abs((fr.left + fr.right) / 2 - W / 2) < 1 && Math.abs((fr.top + fr.bottom) / 2 - H / 2) < 1;
    if (!r.frameScaleOk) r.problems.push('frame size ' + rr(fr));
    if (!r.frameInside) r.problems.push('frame outside viewport ' + rr(fr));
    var sw = q('.demo-switch').getBoundingClientRect();
    r.switchRect = rr(sw);
    var s = fr.width / 1440;
    function art(el) { var b = el.getBoundingClientRect(); return { l: rd((b.left - fr.left) / s), t: rd((b.top - fr.top) / s), r: rd((b.right - fr.left) / s), b: rd((b.bottom - fr.top) / s), w: rd(b.width / s), h: rd(b.height / s) }; }
    function vis(el) { var b = el.getBoundingClientRect(); if (b.width <= 0 || b.height <= 0) return false; return getComputedStyle(el).visibility !== 'hidden'; }
    function desc(el) {
      var d = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
      var lab = el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 30);
      return d + (lab ? ' "' + lab + '"' : '');
    }
    var SEL = 'button, a[href], input:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [role=tab], [role=link], [role=menuitem]';
    function overlaps() {
      var out = [];
      qa(SEL, frame).forEach(function (el) {
        if (!vis(el)) return;
        var b = el.getBoundingClientRect();
        var ix = Math.min(b.right, sw.right, fr.right) - Math.max(b.left, sw.left, fr.left);
        var iy = Math.min(b.bottom, sw.bottom, fr.bottom) - Math.max(b.top, sw.top, fr.top);
        if (ix > 0.5 && iy > 0.5) out.push(desc(el) + ' vp' + JSON.stringify(rr(b)) + ' overlap ' + rd(ix) + 'x' + rd(iy));
      });
      return out;
    }
    function inView(el) { var b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.left >= fr.left - 0.5 && b.top >= Math.max(0, fr.top) - 0.5 && b.right <= Math.min(W, fr.right) + 0.5 && b.bottom <= Math.min(H, fr.bottom) + 0.5; }
    function navNow() { var m = frame.dataset.mode, rl = frame.dataset.rail; return q('#' + (rl === 'expanded' ? 'nav-' : 'rail-') + m); }
    function setMode(m) { q('[data-mode-set="' + m + '"]').click(); }
    function setRail(rl) { var n = navNow(); var b = q(rl === 'collapsed' ? '[data-act="collapse"]' : '[data-act="expand"]', n); if (b) b.click(); }
    function setView(v) { if (v === 'dashboard') { if (q('#view-dashboard').hidden) q('.pcard:nth-child(2) .pcard__title').click(); } else if (q('#view-projects').hidden) q('#view-dashboard [data-go="projects"]').click(); }
    function hoverAll(on) { qa('.pcard, .tr--body').forEach(function (el) { el.classList.toggle('is-hover', on); }); }

    ['dark', 'light'].forEach(function (mode) {
      ['expanded', 'collapsed'].forEach(function (rail) {
        ['projects', 'dashboard'].forEach(function (view) {
          setMode(mode); setRail(rail); setView(view);
          var key = mode + '/' + rail + '/' + view, st = {};
          st.applied = frame.dataset.mode === mode && frame.dataset.rail === rail && !q('#view-' + view).hidden;
          var nav = navNow();
          st.navDisplay = getComputedStyle(nav).display;
          var head = q(rail === 'expanded' ? '.nav__head' : '.rail__logo', nav), foot = q('.nfoot, .lfoot, .rail__foot', nav);
          st.navHeadInView = inView(head); st.navFootInView = inView(foot);
          st.navHead = art(head); st.navFoot = art(foot);
          var main = art(q('#view-' + view));
          st.mainLeft = main.l; st.mainW = main.w;
          var expMainL = rail === 'expanded' ? 280 : 56;
          var content = q(view === 'projects' ? '#view-projects .pl' : '#view-dashboard .page'), c = art(content);
          st.contentLeftInMain = rd(c.l - main.l); st.contentW = c.w;
          st.contentLeftExpected = rd((main.w - c.w) / 2);
          st.centredOk = Math.abs(main.l - expMainL) < 1 && Math.abs(st.contentLeftInMain - st.contentLeftExpected) < 1;
          // content bottom / right inside the artboard
          var last = view === 'projects' ? qa('.pcard').filter(vis).pop() : qa('.tr--body').pop();
          st.lastItemBottom = art(last).b; st.contentInFrame = art(last).b <= 900.5 && c.r <= 1440.5;
          st.switchOverlapsRest = overlaps();
          hoverAll(true); st.switchOverlapsHover = overlaps(); hoverAll(false);
          if (!st.applied) r.problems.push(key + ' state not applied');
          if (!st.navHeadInView || !st.navFootInView) r.problems.push(key + ' nav head/foot clipped');
          if (!st.centredOk) r.problems.push(key + ' not centred: main ' + main.l + ' content off ' + st.contentLeftInMain + ' exp ' + st.contentLeftExpected);
          if (!st.contentInFrame) r.problems.push(key + ' content overflows artboard: last bottom ' + st.lastItemBottom);
          if (st.switchOverlapsRest.length || st.switchOverlapsHover.length) r.problems.push(key + ' demo-switch overlaps ' + st.switchOverlapsRest.concat(st.switchOverlapsHover).join(' | '));
          r.states[key] = st;
        });
      });
    });

    // menus must stay inside the artboard (frame has overflow:hidden), checked in dark/expanded
    setMode('dark'); setRail('expanded'); setView('dashboard');
    var menus = { row: [], sub: [], card: [] };
    qa('.tr--body .rowbtn').forEach(function (b, i) {
      b.click();
      var m = q('#menu-row'); var a = art(m), bb = art(b);
      menus.row.push({ row: i, btnBottom: bb.b, menuTop: a.t, menuBottom: a.b, rightAligned: Math.abs(a.r - bb.r) < 1, clippedBy: rd(Math.max(0, a.b - 900)) });
      q('#add-to-project').click();
      var sm = art(q('#menu-sub'));
      menus.sub.push({ row: i, top: sm.t, bottom: sm.b, clippedBy: rd(Math.max(0, sm.b - 900)) });
      b.click(); // close
    });
    var hb = q('#hdr-more'); hb.click(); var hm = art(q('#menu-hdr')); menus.hdr = { top: hm.t, bottom: hm.b, left: hm.l, right: hm.r, btn: art(hb) }; hb.click();
    setView('projects');
    qa('.pcard').forEach(function (c, i) {
      c.classList.add('is-hover');
      var more = q('.pcard__more', c); more.click();
      var a = art(q('#menu-card')), bb = art(more);
      menus.card.push({ card: i, menuTop: a.t, menuBottom: a.b, rightAligned: Math.abs(a.r - bb.r) < 1, clippedBy: rd(Math.max(0, a.b - 900)) });
      more.click(); c.classList.remove('is-hover');
    });
    r.menus = menus;
    ['row', 'sub', 'card'].forEach(function (k) {
      var bad = menus[k].filter(function (m) { return m.clippedBy > 0; });
      if (bad.length) r.problems.push('menu-' + k + ' clipped at artboard bottom for ' + bad.map(function (m) { return (k === 'card' ? 'card ' + m.card : 'row ' + m.row) + ' by ' + m.clippedBy + 'px'; }).join(', '));
      var mis = menus[k].filter(function (m) { return m.rightAligned === false; });
      if (mis.length) r.problems.push('menu-' + k + ' not right-aligned to its button for ' + mis.length);
    });
    // landing search open: right-hand controls must stay inside .pl
    q('#psearch').style.transition = 'none'; q('#psearch-btn').click();
    var pr = art(q('.pl__right')), pl = art(q('.pl')), bt = art(q('.btabs'));
    r.searchOpen = { plRight: pl.r, controlsRight: pr.r, controlsLeft: pr.l, tabsRight: bt.r, ok: pr.r <= pl.r + 0.5 && pr.l >= bt.r };
    if (!r.searchOpen.ok) r.problems.push('search open overflows filters row');
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
