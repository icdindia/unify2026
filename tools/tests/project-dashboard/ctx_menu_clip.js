// ctx_menu_clip: do the card / row / sub menus extend past the 1440x900 artboard (which has overflow:hidden)?
// Reports, per opener, the menu's bottom edge in artboard px and how many px are cut off, plus whether the
// last menu item is actually hit-testable (elementFromPoint at its centre returns the item).
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame');
  function art(el) { var f = frame.getBoundingClientRect(), b = el.getBoundingClientRect(), s = f.width / 1440; return { top: +((b.top - f.top) / s).toFixed(1), bottom: +((b.bottom - f.top) / s).toFixed(1), right: +((b.right - f.left) / s).toFixed(1) }; }
  function lastItemReachable(menu) { var items = menu.querySelectorAll('.ddi'), it = items[items.length - 1], b = it.getBoundingClientRect(); var hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!(hit && it.contains(hit)); }
  try {
    r.overflow = getComputedStyle(frame).overflow;
    var cm = q('#menu-card');
    r.cards = qa('.pcard').map(function (c, i) {
      var m = c.querySelector('.pcard__more'); m.click();
      var a = art(cm), o = { card: i, title: c.querySelector('.pcard__title').textContent, menuBottom: a.bottom, cutPx: Math.max(0, +(a.bottom - 900).toFixed(1)), lastItem: cm.querySelectorAll('.ddi')[cm.querySelectorAll('.ddi').length - 1].textContent.trim(), lastItemClickable: lastItemReachable(cm) };
      m.click(); return o;
    }).filter(function (o) { return o.cutPx > 0; });
    q('.pcard').click();
    var rm = q('#menu-row'), sub = q('#menu-sub'), add = q('#add-to-project');
    r.rows = qa('.rowbtn').map(function (b, i) {
      b.click(); add.click();
      var a = art(rm), s2 = art(sub);
      var o = { row: i, rowMenuBottom: a.bottom, rowCut: Math.max(0, +(a.bottom - 900).toFixed(1)), subBottom: s2.bottom, subCut: Math.max(0, +(s2.bottom - 900).toFixed(1)), subLastItemClickable: lastItemReachable(sub), rowLastItemClickable: lastItemReachable(rm) };
      b.click(); return o;
    }).filter(function (o) { return o.rowCut > 0 || o.subCut > 0; });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
