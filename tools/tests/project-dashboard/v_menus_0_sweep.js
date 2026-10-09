// v_menus_0_ (refutation pass): independent re-check of "menus near the bottom of the artboard are clipped at y=900".
// SYNCHRONOUS so it works in every --ctx. Uses raw viewport px (no artboard maths) for the clip test, and
// elementsFromPoint (whole stack) for the hit test, so a stray overlay cannot fake the result.
//   python3 run_checks.py --ctx srcdoc --checks v_menus_0_sweep.js --w 1700 --h 1150
//   python3 run_checks.py --ctx http   --checks v_menus_0_sweep.js --w 1700 --h 1150 [--query mode=light]
(function () {
  var r = { cards: [], rows: [], subs: [] };
  var q = function (s) { return document.querySelector(s); };
  function esc() { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }
  try {
    var frame = q('#frame');
    if (location.search.indexOf('rail=collapsed') > -1) frame.setAttribute('data-rail', 'collapsed');
    r.mode = frame.getAttribute('data-mode'); r.rail = frame.getAttribute('data-rail');
    r.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    r.inner = [innerWidth, innerHeight];
    // which ancestors of the menus clip?
    r.menuParent = q('#menu-card').parentElement.id;
    r.clippers = [];
    for (var e = q('#menu-card').parentElement; e && e !== document.documentElement; e = e.parentElement) {
      var cs = getComputedStyle(e); if (cs.overflow !== 'visible') r.clippers.push((e.id || e.className) + ':' + cs.overflow);
    }
    function audit(menu) {
      var fr = frame.getBoundingClientRect(), mb = menu.getBoundingClientRect(), bad = [];
      [].forEach.call(menu.querySelectorAll('.ddi'), function (it) {
        var b = it.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        var stack = document.elementsFromPoint(cx, cy), top = stack[0];
        var reachable = !!top && it.contains(top);
        if (!reachable) bad.push({ item: it.textContent.trim(), itemBottomPx: Math.round(b.bottom), frameBottomPx: Math.round(fr.bottom), centreBelowFrame: cy > fr.bottom, topHit: top ? (top.id || top.className || top.tagName) : null, itemInStack: stack.indexOf(it) > -1 });
      });
      return { menuBottomPx: Math.round(mb.bottom), frameBottomPx: Math.round(fr.bottom), overflowPx: Math.round(mb.bottom - fr.bottom), unreachable: bad };
    }
    var cards = document.querySelectorAll('#pgrid .pcard');
    for (var i = 0; i < cards.length; i++) {
      cards[i].querySelector('.pcard__more').click();
      var a = audit(q('#menu-card'));
      if (a.unreachable.length) r.cards.push({ card: i, overflowPx: a.overflowPx, items: a.unreachable.map(function (u) { return u.item + (u.centreBelowFrame ? ' (below frame, top hit ' + u.topHit + ')' : ' (hit ' + u.topHit + ')'); }) });
      esc();
    }
    // actually click the clipped Delete via elementFromPoint, like a user would
    cards[11].querySelector('.pcard__more').click();
    var del = q('#menu-card .ddi--danger'), db = del.getBoundingClientRect();
    var under = document.elementFromPoint(db.left + db.width / 2, db.top + db.height / 2);
    r.card11UserClickOnDeleteLandsOn = under ? (under.id || under.className || under.tagName) : null;
    r.card11MenuStillOpenAfterThatClick = (function () { if (under) under.click(); return !q('#menu-card').hidden; })();
    esc();
    cards[0].querySelector('.pcard__title').click();
    r.dashboardShown = !q('#view-dashboard').hidden;
    var rows = document.querySelectorAll('#table .tr--body');
    for (var j = 0; j < rows.length; j++) {
      rows[j].querySelector('.rowbtn').click();
      var ra = audit(q('#menu-row'));
      if (ra.unreachable.length) r.rows.push({ row: j, overflowPx: ra.overflowPx, items: ra.unreachable.map(function (u) { return u.item; }) });
      q('#add-to-project').click();
      var sa = audit(q('#menu-sub'));
      if (sa.unreachable.length) r.subs.push({ row: j, overflowPx: sa.overflowPx, lost: sa.unreachable.length, items: sa.unreachable.map(function (u) { return u.item; }) });
      esc();
    }
  } catch (err) { r.checkError = String(err && err.stack || err); }
  window.__report(r);
})();
