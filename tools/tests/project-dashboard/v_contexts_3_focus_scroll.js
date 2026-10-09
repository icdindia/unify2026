// v_contexts_3_focus_scroll (sync): independent re-check of "keyboard focus into a clipped menu item scrolls the
// overflow:hidden #frame and pushes the nav header out of view". Opens each menu the way a keyboard user would
// (focus the opener, activate it), then focuses the menu items in DOM (Tab) order and records #frame.scrollTop and
// the active nav header's position relative to the frame (screen px). Also confirms nothing else scrolled.
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame'), se = document.scrollingElement || document.documentElement;
  function head() { var h = q('#nav-' + frame.dataset.mode + ' .nav__head'), f = frame.getBoundingClientRect(), b = h.getBoundingClientRect(); return { top: +(b.top - f.top).toFixed(1), bottom: +(b.bottom - f.top).toFixed(1), hitTests: (function () { var e = document.elementFromPoint(b.left + 20, b.top + b.height / 2); return !!(e && h.contains(e)); })() }; }
  function walk(menu) {
    return qa('#' + menu + ' .ddi').map(function (it) { it.focus(); var o = { item: it.textContent.trim(), active: document.activeElement === it, frameScrollTop: frame.scrollTop, docScroll: se.scrollTop, navHead: head() }; return o; });
  }
  try {
    r.navHeadAtRest = head();
    // card menu, last card
    var cards = qa('.pcard'), more = cards[11].querySelector('.pcard__more');
    cards[11].focus(); more.focus(); more.click();
    r.cardMenuOpen = !q('#menu-card').hidden;
    r.cardMenuWalk = walk('menu-card');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r.afterEscapeCard = { menuHidden: q('#menu-card').hidden, frameScrollTop: frame.scrollTop, navHead: head() };
    frame.scrollTop = 0;
    // row menu + sub, last row
    q('.pcard').click();
    var rb = qa('.rowbtn')[7]; rb.focus(); rb.click();
    r.rowMenuWalk = walk('menu-row');
    q('#add-to-project').click();   // Enter/Space on the focused "Move to project" item = click
    r.subMenuWalk = walk('menu-sub');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r.afterEscapeRow = { frameScrollTop: frame.scrollTop, navHead: head() };
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
