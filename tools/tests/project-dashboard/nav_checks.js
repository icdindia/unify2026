// nav_ lens: nav modes (dark/light x expanded/collapsed). SYNCHRONOUS only (works in sandbox/srcdoc).
// Reports { fails: [...], info: {...} }. An empty fails list means every check passed.
(function () {
  var r = { fails: [], info: {} };
  var q = function (s, root) { return (root || document).querySelector(s); };
  var qa = function (s, root) { return [].slice.call((root || document).querySelectorAll(s)); };
  function fail(m) { r.fails.push(m); }
  function disp(el) { return getComputedStyle(el).display; }
  function rc(el) { var b = el.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(function (x) { return Math.round(x * 10) / 10; }); }
  function inVP(el) { var b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top >= -0.5 && b.left >= -0.5 && b.bottom <= innerHeight + 0.5 && b.right <= innerWidth + 0.5; }
  function hits(el) { var b = el.getBoundingClientRect(); var t = document.elementFromPoint((b.left + b.right) / 2, (b.top + b.bottom) / 2); return !!t && (t === el || el.contains(t)); }
  try {
    var frame = q('#frame');
    var NAV = { 'dark|expanded': '#nav-dark', 'light|expanded': '#nav-light', 'dark|collapsed': '#rail-dark', 'light|collapsed': '#rail-light' };
    var ALL = ['#nav-dark', '#nav-light', '#rail-dark', '#rail-light'];
    function want() { return NAV[frame.dataset.mode + '|' + frame.dataset.rail]; }
    function setMode(m) { q('[data-mode-set="' + m + '"]').click(); }
    function setRail(rl) {
      var v = q(want());
      if (rl === 'collapsed' && frame.dataset.rail === 'expanded') v.querySelector('[data-act="collapse"]').click();
      else if (rl === 'expanded' && frame.dataset.rail === 'collapsed') v.querySelector('[data-act="expand"]').click();
    }
    function go(mode, rail) { setMode(mode); setRail(rail); if (frame.dataset.mode !== mode || frame.dataset.rail !== rail) fail('could not reach ' + mode + '/' + rail + ' (got ' + frame.dataset.mode + '/' + frame.dataset.rail + ')'); }
    function selBg(el) {
      if (el.classList.contains('lrow')) return getComputedStyle(el, '::before').backgroundColor;
      return getComputedStyle(el).backgroundColor;
    }
    r.info.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    r.info.inner = [innerWidth, innerHeight];
    r.info.frame = rc(frame);

    function checkState(tag, key) {
      var w = want();
      ALL.forEach(function (id) { var d = disp(q(id)); if (id === w ? d !== 'flex' : d !== 'none') fail(tag + ': ' + id + ' display=' + d); });
      var v = q(w);
      var head = q('.nav__head, .rail__logo', v), tools = q('.nav__tools', v), foot = q('.nfoot, .lfoot, .rail__foot', v);
      if (!inVP(head)) fail(tag + ': header not in viewport ' + JSON.stringify(rc(head)));
      if (!hits(head)) fail(tag + ': header centre not hit-testable (covered)');
      if (tools) {
        if (!inVP(tools)) fail(tag + ': tools not in viewport ' + JSON.stringify(rc(tools)));
        var nb = v.getBoundingClientRect(), tb = tools.getBoundingClientRect();
        if (tb.right > nb.right + 0.5 || tb.left < nb.left - 0.5) fail(tag + ': tools outside nav box ' + JSON.stringify(rc(tools)) + ' nav ' + JSON.stringify(rc(v)));
        qa('button', tools).forEach(function (b) { if (!hits(b)) fail(tag + ': tool button not hit-testable ' + b.getAttribute('aria-label')); });
        var logo = q('.logo-g', head), word = q('.nav__word img', head);
        if (!inVP(logo)) fail(tag + ': logo glyph not in viewport');
        if (word) { var hb = head.getBoundingClientRect(), wb = word.getBoundingClientRect(), lb = q('.nav__logo', head).getBoundingClientRect(); if (wb.right > lb.right + 0.5) fail(tag + ': wordmark clipped by logo box ' + JSON.stringify(rc(word)) + ' vs ' + JSON.stringify(rc(q('.nav__logo', head)))); }
      }
      if (!inVP(foot)) fail(tag + ': footer not in viewport ' + JSON.stringify(rc(foot)));
      if (!hits(foot)) fail(tag + ': footer centre not hit-testable');
      // nav spans the frame height (top and bottom edges match the frame)
      var fb = frame.getBoundingClientRect(), vb = v.getBoundingClientRect();
      if (Math.abs(vb.top - fb.top) > 1 || Math.abs(vb.bottom - fb.bottom) > 1) fail(tag + ': nav not flush with frame ' + JSON.stringify(rc(v)) + ' frame ' + JSON.stringify(rc(frame)));
      if (frame.dataset.rail === 'collapsed') {
        var items = qa('.ritem', v).filter(function (e) { return disp(e) !== 'none' && inVP(e); });
        var exp = frame.dataset.mode === 'dark' ? 7 : 6;
        if (items.length !== exp) fail(tag + ': rail shows ' + items.length + ' items, expected ' + exp);
        var lgo = q('[data-act="expand"]', v); if (!hits(lgo)) fail(tag + ': expand logo not hit-testable');
      }
      // selection in sync across all four navs
      ALL.forEach(function (id) {
        var s = qa(id + ' [data-nav].is-selected').map(function (e) { return e.getAttribute('data-nav'); });
        if (s.length !== 1 || s[0] !== key) fail(tag + ': ' + id + ' selected=' + JSON.stringify(s) + ' want ' + key);
      });
      var cur = qa('[aria-current="page"]');
      var curBad = cur.filter(function (e) { return e.getAttribute('data-nav') !== key; });
      if (curBad.length || cur.length !== qa('[data-nav="' + key + '"]').length) fail(tag + ': aria-current mismatch ' + JSON.stringify(cur.map(function (e) { return e.getAttribute('data-nav'); })));
      // selected item visibly distinct from an unselected one in the visible nav
      var selEl = q('[data-nav="' + key + '"]', v);
      var other = qa('[data-nav]', v).filter(function (e) { return e.getAttribute('data-nav') !== key; })[0];
      if (selEl && other && selBg(selEl) === selBg(other)) fail(tag + ': selected item ' + key + ' not visually distinct (bg ' + selBg(selEl) + ')');
      if (selEl && !inVP(selEl)) fail(tag + ': selected item not in viewport');
      // demo switch aria-pressed follows mode
      qa('[data-mode-set]').forEach(function (b) { var on = b.getAttribute('data-mode-set') === frame.dataset.mode; if (b.getAttribute('aria-pressed') !== String(on)) fail(tag + ': aria-pressed wrong on ' + b.textContent); });
      var ds = q('.demo-switch'); if (!inVP(ds)) fail(tag + ': demo switch not in viewport');
      qa('[data-mode-set]').forEach(function (b) { if (!hits(b)) fail(tag + ': demo switch button not hit-testable ' + b.textContent); });
    }

    // 1. every combination at rest
    checkState('init dark/expanded', 'projects');
    [['light', 'expanded'], ['light', 'collapsed'], ['dark', 'collapsed'], ['dark', 'expanded'], ['dark', 'collapsed'], ['light', 'collapsed'], ['light', 'expanded'], ['dark', 'expanded']].forEach(function (c) {
      go(c[0], c[1]); checkState('rest ' + c.join('/'), 'projects');
    });

    // 2. selection survives switching mode + rail
    q('#nav-dark [data-nav="routines"]').click();
    checkState('sel routines dark/expanded', 'routines');
    go('light', 'expanded'); checkState('sel routines light/expanded', 'routines');
    go('light', 'collapsed'); checkState('sel routines light/collapsed', 'routines');
    q('#rail-light [data-nav="meetings"]').click(); checkState('sel meetings light/collapsed', 'meetings');
    go('dark', 'collapsed'); checkState('sel meetings dark/collapsed', 'meetings');
    q('#rail-dark [data-nav="artifacts"]').click(); checkState('sel artifacts dark/collapsed', 'artifacts');
    go('dark', 'expanded'); checkState('sel artifacts dark/expanded', 'artifacts');
    q('#nav-dark [data-nav="new"]').click(); go('light', 'expanded'); checkState('sel new light/expanded', 'new');
    q('#nav-light [data-nav="artifacts"]').click(); go('dark', 'collapsed'); checkState('sel artifacts (from light) dark/collapsed', 'artifacts');

    // 3. Projects [data-nav] returns to the landing from the dashboard, in each nav
    [['dark', 'expanded'], ['light', 'expanded'], ['dark', 'collapsed'], ['light', 'collapsed']].forEach(function (c) {
      go(c[0], c[1]);
      q('#nav-dark [data-nav="routines"]').click();
      var card = qa('.pcard')[2]; card.click();
      if (q('#view-dashboard').hidden) fail(c.join('/') + ': card click did not open dashboard');
      var pr = q(want() + ' [data-nav="projects"]');
      if (!pr) { fail(c.join('/') + ': no projects item'); return; }
      pr.click();
      if (q('#view-projects').hidden || !q('#view-dashboard').hidden) fail(c.join('/') + ': Projects nav did not show landing');
      checkState('projects-from-dash ' + c.join('/'), 'projects');
      // nav still correct when dashboard is open
      qa('.pcard')[0].click(); checkState('dash open ' + c.join('/'), 'projects');
      if (q('#view-dashboard').hidden) fail(c.join('/') + ': dashboard not open after second card click');
      q('[data-go="projects"]').click();
    });

    // 4. section chevrons: own group only; icon + aria-expanded flip; header row stays
    var ASSET = window.PD_ASSETS || {};
    function A(n) { return ASSET[n] || 'assets/' + n; }
    [['dark', '#nav-dark', 'nav-chev-right-dark.svg', 'nav-chevron-sub.svg'], ['light', '#nav-light', 'lt-chev-right.svg', 'lt-chev-down.svg']].forEach(function (cfg) {
      go(cfg[0], 'expanded');
      var nav = q(cfg[1]);
      var chevs = qa('[data-act="section"]', nav);
      r.info[cfg[0] + 'Sections'] = chevs.length;
      var groups = chevs.map(function (c) { return c.closest('.ngrp, .nhgrp, .lgrp'); });
      var footBefore = rc(q('.nfoot, .lfoot', nav)), headBefore = rc(q('.nav__head', nav));
      chevs.forEach(function (ch, i) {
        var g = groups[i], name = (q('.nsub__t, .lsub__t', g) || {}).textContent;
        var tag = cfg[0] + ' section ' + name;
        var bodyKids = [].slice.call(g.children).filter(function (k) { return !k.matches('.nsub, .lsub, .nsep'); });
        var otherVis = [];
        groups.forEach(function (og, j) { if (j !== i) otherVis.push([].slice.call(og.children).map(disp).join(',')); });
        if (!hits(ch)) fail(tag + ': chevron not hit-testable');
        ch.click();
        if (!g.classList.contains('is-collapsed')) fail(tag + ': group not collapsed');
        if (ch.getAttribute('aria-expanded') !== 'false') fail(tag + ': aria-expanded=' + ch.getAttribute('aria-expanded'));
        if (q('img', ch).getAttribute('src') !== A(cfg[2])) fail(tag + ': collapsed icon src wrong ' + q('img', ch).getAttribute('src').slice(0, 40));
        bodyKids.forEach(function (k) { if (disp(k) !== 'none') fail(tag + ': child still shown ' + k.className); });
        var hdr = q('.nsub, .lsub', g); if (disp(hdr) === 'none' || !inVP(hdr)) fail(tag + ': section header hidden after collapse');
        groups.forEach(function (og, j) {
          if (j === i) return;
          if (og.classList.contains('is-collapsed')) fail(tag + ': also collapsed group ' + j);
          var now = [].slice.call(og.children).map(disp).join(',');
          if (now !== otherVis[j < i ? j : j - 1]) fail(tag + ': other group ' + j + ' display changed');
        });
        // collapsing groups in this nav must not touch the same-named group in the other nav
        qa('.is-collapsed').forEach(function (cg) { if (!nav.contains(cg)) fail(tag + ': a group in the other nav collapsed'); });
        if (!hits(ch)) fail(tag + ': chevron not hit-testable when collapsed');
        if (JSON.stringify(rc(q('.nfoot, .lfoot', nav))) !== JSON.stringify(footBefore)) fail(tag + ': footer moved');
        if (JSON.stringify(rc(q('.nav__head', nav))) !== JSON.stringify(headBefore)) fail(tag + ': header moved');
        ch.click();
        if (g.classList.contains('is-collapsed')) fail(tag + ': group not re-expanded');
        if (ch.getAttribute('aria-expanded') !== 'true') fail(tag + ': aria-expanded after reopen=' + ch.getAttribute('aria-expanded'));
        if (q('img', ch).getAttribute('src') !== A(cfg[3])) fail(tag + ': expanded icon src wrong');
        bodyKids.forEach(function (k) { if (disp(k) === 'none') fail(tag + ': child not restored ' + k.className); });
        r.info[tag + ' label'] = ch.getAttribute('aria-label');
      });
      // collapse all, check rail still fine, then switching mode + back keeps state
      chevs.forEach(function (ch) { ch.click(); });
      r.info[cfg[0] + 'AllCollapsed'] = groups.every(function (g) { return g.classList.contains('is-collapsed'); });
      checkState(cfg[0] + ' all sections collapsed', 'projects');
      chevs.forEach(function (ch) { ch.click(); });
    });
    // 5. chevron clicks must not change nav selection or view
    go('dark', 'expanded'); qa('.pcard')[1].click();
    q('#nav-dark [data-act="section"]').click();
    if (q('#view-dashboard').hidden) fail('section chevron changed the view');
    checkState('after chevron on dashboard', 'projects');
    q('#nav-dark [data-act="section"]').click();
    q('[data-go="projects"]').click();
    go('dark', 'expanded');
  } catch (e) { r.checkError = String(e && e.stack || e); }
  r.failCount = r.fails.length;
  window.__report(r);
})();
