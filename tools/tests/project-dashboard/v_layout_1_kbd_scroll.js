// v_layout_1_ : keyboard path on the bottom-right card. Open its menu, focus the clipped "Delete" item
// (what Tab / arrow-keying into the menu does), then close the menu with Escape. Does the artboard stay
// scrolled (nav header pushed up / clipped)? SYNCHRONOUS.
(function () {
  var r = {};
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  try {
    var frame = q('#frame'), menu = q('#menu-card');
    var nav = qa('#nav-dark, #nav-light, #rail-dark, #rail-light').filter(function (n) { return n.offsetParent !== null || getComputedStyle(n).display !== 'none'; })[0];
    var fr0 = frame.getBoundingClientRect(), s = fr0.width / 1440;
    var navTop0 = (nav.getBoundingClientRect().top - fr0.top) / s;
    var last = qa('.pcard').pop(); last.focus();
    q('.pcard__more', last).click();
    var del = q('.ddi--danger', menu);
    del.focus();
    r.afterFocus = { scrollTop: frame.scrollTop, navArtTop: Math.round(((nav.getBoundingClientRect().top - frame.getBoundingClientRect().top) / s) * 10) / 10, activeIsDelete: document.activeElement === del };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r.afterEscape = { menuHidden: menu.hidden, scrollTop: frame.scrollTop, navArtTop: Math.round(((nav.getBoundingClientRect().top - frame.getBoundingClientRect().top) / s) * 10) / 10 };
    r.navArtTopBefore = navTop0;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
