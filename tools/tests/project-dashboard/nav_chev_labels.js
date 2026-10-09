// nav_ lens: accessible name of the section chevrons before/after collapsing. SYNCHRONOUS.
(function () {
  var r = { sections: [] };
  try {
    [].forEach.call(document.querySelectorAll('[data-act="section"]'), function (ch) {
      var g = ch.closest('.ngrp, .nhgrp, .lgrp'), nav = ch.closest('nav').id;
      var name = (g.querySelector('.nsub__t, .lsub__t') || {}).textContent;
      var before = { label: ch.getAttribute('aria-label'), expanded: ch.getAttribute('aria-expanded'), controls: ch.getAttribute('aria-controls') };
      ch.click();
      var after = { label: ch.getAttribute('aria-label'), expanded: ch.getAttribute('aria-expanded'), collapsed: g.classList.contains('is-collapsed') };
      ch.click();
      r.sections.push({ nav: nav, section: name, before: before, whenCollapsed: after });
    });
    var labels = r.sections.map(function (s) { return s.nav + ':' + s.before.label; });
    r.distinctLabelsPerNav = labels.filter(function (l, i) { return labels.indexOf(l) === i; });
    r.labelSaysCollapseWhileCollapsed = r.sections.filter(function (s) { return s.whenCollapsed.collapsed && /collapse/i.test(s.whenCollapsed.label); }).length;
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
})();
