// menu_ lens: focused repro — menus opened from the bottom of the artboard run past y=900 and are
// clipped by #frame (overflow:hidden). SYNCHRONOUS (works in every --ctx).
//   python3 run_checks.py --ctx srcdoc --checks menu_clip.js --w 1700 --h 1150   (fit 1, spare room under the frame)
//   python3 run_checks.py --ctx http   --checks menu_clip.js --w 1200 --h 700    (fit < 1)
(function () {
  var r = {};
  var q = function (s) { return document.querySelector(s); };
  try {
    var frame = q('#frame');
    r.frameOverflow = getComputedStyle(frame).overflow;
    r.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    r.viewport = [innerWidth, innerHeight];
    var fr = frame.getBoundingClientRect();
    r.frameBottomPx = Math.round(fr.bottom);
    function box(el) { var b = el.getBoundingClientRect(), s = fr.width / 1440; return { top: Math.round((b.top - fr.top) / s * 10) / 10, bottom: Math.round((b.bottom - fr.top) / s * 10) / 10 }; }
    function probe(menu) {
      return [].map.call(menu.querySelectorAll('.ddi'), function (it) {
        var b = it.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2, hit = document.elementFromPoint(x, y);
        return { item: it.textContent.trim(), artboardTop: box(it).top, artboardBottom: box(it).bottom, centreInViewport: y < innerHeight, hitIsItem: !!hit && it.contains(hit), hit: hit ? (hit.id || hit.className || hit.tagName) : null };
      }).filter(function (p) { return !p.hitIsItem; });
    }
    // landing, last card (bottom-right)
    var cards = document.querySelectorAll('#pgrid .pcard');
    cards[11].querySelector('.pcard__more').click();
    r.card11 = { menu: box(q('#menu-card')), unreachableItems: probe(q('#menu-card')) };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    // dashboard, last table row, then its "Move to project" submenu
    cards[0].querySelector('.pcard__title').click();
    var rows = document.querySelectorAll('#table .tr--body');
    rows[7].querySelector('.rowbtn').click();
    r.row7 = { rowMenu: box(q('#menu-row')), unreachableRowItems: probe(q('#menu-row')) };
    q('#add-to-project').click();
    r.row7.sub = box(q('#menu-sub'));
    r.row7.unreachableSubItems = probe(q('#menu-sub')).map(function (p) { return p.item; });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    rows[4].querySelector('.rowbtn').click(); q('#add-to-project').click();
    r.row4 = { sub: box(q('#menu-sub')), unreachableSubItems: probe(q('#menu-sub')).map(function (p) { return p.item; }) };
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
