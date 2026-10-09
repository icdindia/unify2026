// v_menus_0_: detail of row-5 submenu items (artboard px) and what sits on top of each item centre.
//   python3 run_checks.py --ctx http --checks v_menus_0_row5.js --w 1200 --h 700   (and --w 1700 --h 1150)
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  try {
    var frame = q('#frame');
    q('#pgrid .pcard .pcard__title').click();
    q('#table').querySelectorAll('.tr--body')[5].querySelector('.rowbtn').click();
    q('#add-to-project').click();
    var fr = frame.getBoundingClientRect(), s = fr.width / 1440;
    r.fit = s; r.frameRectPx = [fr.top, fr.bottom].map(Math.round); r.inner = [innerWidth, innerHeight];
    r.sub = [].map.call(q('#menu-sub').querySelectorAll('.ddi'), function (it) {
      var b = it.getBoundingClientRect(), cy = b.top + b.height / 2, top = document.elementFromPoint(b.left + b.width / 2, cy);
      return { item: it.textContent.trim(), centreArtboard: Math.round((cy - fr.top) / s * 10) / 10, centrePx: Math.round(cy), hit: top ? (it.contains(top) ? 'ITEM' : (top.id || top.className || top.tagName)) : null };
    });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
