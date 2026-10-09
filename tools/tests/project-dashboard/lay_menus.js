// lay_ : are the menus of the LAST table row / LAST card row reachable? SYNCHRONOUS.
// Opens each menu, then hit-tests the centre of every menu item with elementFromPoint.
// An item whose centre lies outside the #frame (overflow:hidden) cannot be clicked.
(function () {
  var r = {};
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  try {
    var frame = q('#frame'), fr = frame.getBoundingClientRect(), s = fr.width / 1440;
    r.inner = [innerWidth, innerHeight]; r.fit = rd(s * 1000) / 1000; r.frameBottomVp = rd(fr.bottom);
    function hit(menu) {
      return qa('.ddi', menu).map(function (it) {
        var b = it.getBoundingClientRect(), x = (b.left + b.right) / 2, y = (b.top + b.bottom) / 2;
        var el = document.elementFromPoint(x, y);
        return { item: it.textContent.trim(), artTop: rd((b.top - fr.top) / s), artBottom: rd((b.bottom - fr.top) / s), clickable: !!(el && it.contains(el)), hitInstead: el && !it.contains(el) ? (el.id || el.className || el.tagName) : null };
      });
    }
    // dashboard, last row (row 8 = "Thanks for checking in")
    q('.pcard:nth-child(2) .pcard__title').click();
    var rows = qa('.tr--body'), last = rows[rows.length - 1], btn = q('.rowbtn', last);
    btn.click();
    r.lastRowLabel = q('.td__name', last).textContent;
    r.rowMenu = hit(q('#menu-row'));
    q('#add-to-project').click();
    r.subMenuOfLastRow = hit(q('#menu-sub'));
    btn.click();
    // row 4 (index 3) "Lunch..." etc: first row whose sub-menu is cut
    var b4 = q('.rowbtn', rows[3]); b4.click(); q('#add-to-project').click();
    r.row4Label = q('.td__name', rows[3]).textContent;
    r.subMenuOfRow4 = hit(q('#menu-sub'));
    b4.click();
    // landing, bottom-right card
    q('[data-go="projects"]').click();
    var cards = qa('.pcard'), lc = cards[cards.length - 1];
    lc.classList.add('is-hover'); q('.pcard__more', lc).click();
    r.lastCardTitle = q('.pcard__title', lc).textContent;
    r.cardMenu = hit(q('#menu-card'));
    var cm = q('#menu-card').getBoundingClientRect();
    r.cardMenuArtBottom = rd((cm.bottom - fr.top) / s);
    r.unreachable = [].concat(
      r.rowMenu.filter(function (m) { return !m.clickable; }).map(function (m) { return 'row-menu(last row): ' + m.item; }),
      r.subMenuOfLastRow.filter(function (m) { return !m.clickable; }).map(function (m) { return 'sub-menu(last row): ' + m.item; }),
      r.subMenuOfRow4.filter(function (m) { return !m.clickable; }).map(function (m) { return 'sub-menu(row 4): ' + m.item; }),
      r.cardMenu.filter(function (m) { return !m.clickable; }).map(function (m) { return 'card-menu(last card): ' + m.item; }));
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
