// v_layout_0_ : independent re-check of "row menu / sub-menu clipped below the 900px artboard". SYNCHRONOUS.
// For every table row: open #menu-row via a real .click() on its .rowbtn, then open #menu-sub via a real
// .click() on #add-to-project (the same handler a user hits). For each menu item, compare its viewport rect
// with the #frame's viewport rect (the clip box: #frame has overflow:hidden) and hit-test its centre.
(function () {
  var r = { rows: [] };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  try {
    var frame = q('#frame');
    r.frameOverflow = getComputedStyle(frame).overflow;
    r.menuRowParentIsFrame = q('#menu-row').parentElement === frame;
    r.menuSubParentIsFrame = q('#menu-sub').parentElement === frame;
    r.mode = frame.getAttribute('data-mode');
    // open the dashboard the way a user does: click a card
    q('.pcard').click();
    r.dashboardShown = !q('#view-dashboard').hidden;
    var fr = frame.getBoundingClientRect(), s = fr.width / 1440;
    r.fit = rd(s * 1000) / 1000; r.inner = [innerWidth, innerHeight];
    function check(menu) {
      return qa('.ddi', menu).map(function (it) {
        var b = it.getBoundingClientRect(), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
        var el = document.elementFromPoint(cx, cy);
        return { t: it.textContent.trim(), artBottom: rd((b.bottom - fr.top) / s), insideFrame: b.bottom <= fr.bottom + 0.5, hit: !!(el && it.contains(el)) };
      });
    }
    var rows = qa('.tr--body');
    rows.forEach(function (row, i) {
      var btn = q('.rowbtn', row);
      btn.click();
      var rm = q('#menu-row'), rmb = rm.getBoundingClientRect();
      var o = { i: i, label: q('.td__name', row).textContent, rowMenuOpen: !rm.hidden, rowMenuArtBottom: rd((rmb.bottom - fr.top) / s) };
      o.rowItems = check(rm);
      var add = q('#add-to-project'), ab = add.getBoundingClientRect();
      var addHit = document.elementFromPoint((ab.left + ab.right) / 2, (ab.top + ab.bottom) / 2);
      o.addItemUserClickable = !!(addHit && add.contains(addHit));
      add.click();   // script click (a user could not do this if addItemUserClickable is false)
      var sm = q('#menu-sub'), smb = sm.getBoundingClientRect();
      o.subOpen = !sm.hidden; o.subArtTop = rd((smb.top - fr.top) / s); o.subArtBottom = rd((smb.bottom - fr.top) / s);
      o.subClippedBy = rd(Math.max(0, (smb.bottom - fr.bottom) / s));
      o.subItems = check(sm);
      o.unreachable = o.rowItems.concat(o.subItems).filter(function (x) { return !x.hit; }).map(function (x) { return x.t; });
      btn.click();   // toggle closed
      r.rows.push(o);
    });
    r.summary = r.rows.map(function (o) { return o.i + ' ' + o.label + ': rowMenuBottom=' + o.rowMenuArtBottom + ' subBottom=' + o.subArtBottom + ' subClippedBy=' + o.subClippedBy + ' addClickable=' + o.addItemUserClickable + ' unreachable=[' + o.unreachable.join('|') + ']'; });
    r.rows = undefined;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
