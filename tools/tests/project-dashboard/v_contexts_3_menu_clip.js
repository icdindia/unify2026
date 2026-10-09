// v_contexts_3_menu_clip (sync): independent re-check of "menus near the bottom are clipped by #frame overflow:hidden".
// Uses SCREEN coordinates only (no artboard conversion) and samples several points inside each menu's last item,
// so a viewport taller than the frame (fit=1) separates "clipped by #frame" from "outside the window".
(function () {
  var r = { vp: [innerWidth, innerHeight] }, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame');
  function R(el) { var b = el.getBoundingClientRect(); return { top: +b.top.toFixed(1), bottom: +b.bottom.toFixed(1), left: +b.left.toFixed(1), right: +b.right.toFixed(1) }; }
  function hits(it) {   // sample the item at 5 heights; which ones hit-test to the item?
    var b = it.getBoundingClientRect(), x = b.left + b.width / 2, out = [];
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach(function (p) { var y = b.top + b.height * p, h = document.elementFromPoint(x, y); out.push(!!(h && it.contains(h))); });
    return out;
  }
  function openerVisible(btn) { var b = btn.getBoundingClientRect(), f = frame.getBoundingClientRect(); var h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return { insideFrame: b.bottom <= f.bottom + 0.5, hitTestsToOpener: !!(h && btn.contains(h)) }; }
  function lastItem(menu) { var it = menu.querySelectorAll('.ddi'); return it[it.length - 1]; }
  try {
    var f = R(frame); r.frame = f; r.frameOverflow = getComputedStyle(frame).overflowY; r.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    r.frameBottomInsideWindow = f.bottom <= innerHeight + 0.5;
    var cm = q('#menu-card');
    r.cards = qa('.pcard').map(function (c, i) {
      var m = c.querySelector('.pcard__more'); m.click();
      var li = lastItem(cm), mr = R(cm), lr = R(li);
      var o = { card: i, opener: openerVisible(m), menuBottomScreen: mr.bottom, frameBottomScreen: f.bottom, overFramePx: +(mr.bottom - f.bottom).toFixed(1), last: li.textContent.trim(), lastItemTop: lr.top, lastItemBottom: lr.bottom, lastItemHits_10_30_50_70_90: hits(li) };
      m.click(); return o;
    }).filter(function (o) { return o.overFramePx > 0; });
    q('.pcard').click();
    var rm = q('#menu-row'), sub = q('#menu-sub'), add = q('#add-to-project');
    r.rows = qa('.rowbtn').map(function (b, i) {
      b.click();
      var op = openerVisible(b);
      add.click();
      var mr = R(rm), sr = R(sub);
      var subItems = qa('#menu-sub .ddi'), hidden = subItems.filter(function (it) { var h = hits(it); return h.every(function (v) { return !v; }); }).map(function (it) { return it.textContent.trim(); });
      var rowItems = qa('#menu-row .ddi'), rowHidden = rowItems.filter(function (it) { return hits(it).every(function (v) { return !v; }); }).map(function (it) { return it.textContent.trim(); });
      var o = { row: i, opener: op, rowMenuOverFrame: +(mr.bottom - f.bottom).toFixed(1), subOverFrame: +(sr.bottom - f.bottom).toFixed(1), subItemsFullyUnreachable: hidden, rowItemsFullyUnreachable: rowHidden };
      b.click(); return o;
    }).filter(function (o) { return o.rowMenuOverFrame > 0 || o.subOverFrame > 0; });
    // header menu, for completeness
    q('#hdr-more').click(); r.hdrMenuOverFrame = +(R(q('#menu-hdr')).bottom - f.bottom).toFixed(1); q('#hdr-more').click();
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
