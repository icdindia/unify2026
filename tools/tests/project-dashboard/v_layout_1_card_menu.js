// v_layout_1_ : independent re-check of "card menu on the bottom row is clipped by the artboard". SYNCHRONOUS.
// Differences from lay_menus.js: no .is-hover forcing (the button is clicked via dispatchEvent on a
// visible button after focusing the card, which makes it display via :focus-within), the clip is measured
// against #frame's own rect (not the viewport), every card is tested, and both rail states + both modes.
(function () {
  var r = { perCard: [] };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  try {
    var frame = q('#frame'), menu = q('#menu-card');
    r.inner = [innerWidth, innerHeight];
    r.mode = frame.getAttribute('data-mode');
    r.frameOverflow = getComputedStyle(frame).overflow;
    r.menuParentIsFrame = menu.parentElement === frame;
    r.viewProjectsVisible = !q('#view-projects').hidden;
    function measure(card, i) {
      var fr = frame.getBoundingClientRect(), s = fr.width / 1440;
      card.focus();                                  // :focus-within shows the ⋯ button without forcing a class
      var more = q('.pcard__more', card);
      var mb = more.getBoundingClientRect();
      more.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: (mb.left + mb.right) / 2, clientY: (mb.top + mb.bottom) / 2 }));
      var open = !menu.hidden, m = menu.getBoundingClientRect();
      var del = q('.ddi--danger', menu), d = del.getBoundingClientRect();
      var cx = (d.left + d.right) / 2, cy = (d.top + d.bottom) / 2;
      var hitEl = document.elementFromPoint(cx, cy);
      // visible part of Delete inside the frame
      var visH = Math.max(0, Math.min(d.bottom, fr.bottom) - Math.max(d.top, fr.top)) / s;
      var out = {
        i: i, title: q('.pcard__title', card).textContent, open: open,
        menuArtTop: rd((m.top - fr.top) / s), menuArtBottom: rd((m.bottom - fr.top) / s),
        overflowPastFrame: rd(Math.max(0, (m.bottom - fr.bottom) / s)),
        deleteArtTop: rd((d.top - fr.top) / s), deleteArtBottom: rd((d.bottom - fr.top) / s),
        deleteVisiblePx: rd(visH),
        deleteCentreInsideFrame: cy <= fr.bottom && cy >= fr.top,
        deleteCentreInsideViewport: cy <= innerHeight && cy >= 0,
        deleteHit: !!(hitEl && del.contains(hitEl)),
        hitInstead: hitEl && !del.contains(hitEl) ? (hitEl.id || hitEl.className || hitEl.tagName) : null
      };
      // close it again (click the same button toggles closed)
      more.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      out.closedAfter = menu.hidden;
      return out;
    }
    qa('.pcard').forEach(function (c, i) { r.perCard.push(measure(c, i)); });
    r.clippedCards = r.perCard.filter(function (p) { return p.overflowPastFrame > 0; }).map(function (p) { return p.i + ':' + p.title + ' +' + p.overflowPastFrame + 'px, Delete visible ' + p.deleteVisiblePx + 'px, hit=' + p.deleteHit; });

    // keyboard path: Tab-equivalent focus of the clipped Delete item scrolls the overflow:hidden frame?
    var last = qa('.pcard').pop(); last.focus();
    var lm = q('.pcard__more', last); lm.click();
    var del = q('.ddi--danger', menu);
    var st0 = frame.scrollTop; del.focus(); var st1 = frame.scrollTop;
    r.keyboardFocusDelete = { scrollTopBefore: st0, scrollTopAfterFocus: st1, frameContentShifted: st1 !== st0 };
    frame.scrollTop = 0; lm.click();

    // collapsed rail: same grid?
    var collapse = q('#frame [data-act="collapse"]');
    r.collapseBtnFound = !!collapse;
    if (collapse) {
      var vis = qa('[data-act="collapse"]').filter(function (b) { return b.offsetParent !== null; })[0];
      if (vis) vis.click();
      r.railAfter = frame.getAttribute('data-rail');
      r.collapsedLastCard = measure(qa('.pcard').pop(), 11);
    }
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
