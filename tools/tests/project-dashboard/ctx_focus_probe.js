// ctx_focus_probe (sync): which element scrolls when the last table row / last card is focused?
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame');
  function art(el) { var f = frame.getBoundingClientRect(), b = el.getBoundingClientRect(), s = f.width / 1440; return [+((b.top - f.top) / s).toFixed(1), +((b.bottom - f.top) / s).toFixed(1)]; }
  function scrolledEls() { return qa('*').filter(function (e) { return e.scrollTop || e.scrollLeft; }).map(function (e) { return (e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]) + ' ' + e.scrollTop + '/' + e.scrollLeft; }); }
  try {
    r.lastCard = art(qa('.pcard')[11]);
    var c = qa('.pcard')[11]; c.focus(); r.focusLastCard = scrolledEls(); c.blur();
    q('.pcard').click();
    var rows = qa('.tr--body'); r.lastRow = art(rows[7]); r.table = art(q('#table'));
    r.mainOverflow = getComputedStyle(q('#view-dashboard')).overflow + ' / page ' + getComputedStyle(q('.page')).overflow;
    rows[7].focus(); r.focusLastRow = scrolledEls();
    r.navHead = art(q('#nav-dark .nav__head'));
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
