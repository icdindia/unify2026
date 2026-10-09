// v_nav_1_: independent re-check of section-chevron accessible names. SYNCHRONOUS.
// Uses a real dispatched MouseEvent (bubbling, like a user click) instead of .click(),
// limits to the nav that is actually rendered for the current mode, and checks
// aria-labelledby / title / content fallbacks so the name really is the aria-label.
(function () {
  var r = {};
  try {
    var frame = document.getElementById('frame');
    r.mode = frame.getAttribute('data-mode'); r.rail = frame.getAttribute('data-rail');
    var chevs = [].filter.call(document.querySelectorAll('[data-act="section"]'), function (b) {
      return b.getClientRects().length > 0;   // only the visibly rendered nav
    });
    r.visibleNavs = chevs.map(function (b) { return b.closest('nav').id; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    r.chevs = chevs.map(function (b) {
      var g = b.closest('.ngrp, .nhgrp, .lgrp');
      var sec = (g.querySelector('.nsub__t, .lsub__t') || {}).textContent;
      var o = { section: sec, ariaLabel: b.getAttribute('aria-label'), labelledby: b.getAttribute('aria-labelledby'),
                title: b.getAttribute('title'), text: b.textContent.trim(), expandedBefore: b.getAttribute('aria-expanded') };
      b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      o.afterClick = { ariaLabel: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), grpCollapsed: g.classList.contains('is-collapsed') };
      b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      o.restored = b.getAttribute('aria-expanded') === 'true' && !g.classList.contains('is-collapsed');
      return o;
    });
    var names = r.chevs.map(function (c) { return c.ariaLabel; });
    r.visibleCount = names.length;
    r.distinctVisibleNames = names.filter(function (n, i) { return names.indexOf(n) === i; });
    r.nameMentionsSection = r.chevs.filter(function (c) { return c.ariaLabel && c.section && c.ariaLabel.indexOf(c.section) >= 0; }).length;
    r.collapseVerbWhileCollapsed = r.chevs.filter(function (c) { return c.afterClick.grpCollapsed && c.afterClick.expanded === 'false' && /collapse/i.test(c.afterClick.ariaLabel || ''); }).length;
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
})();
