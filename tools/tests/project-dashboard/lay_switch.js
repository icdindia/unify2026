// lay_ : does the fixed .demo-switch cover any app control? SYNCHRONOUS.
// For both views x both rails x both modes (rest + row/card hover forced), lists every visible
// interactive element in #frame whose rect intersects the switch, and hit-tests the centre of the
// intersection with elementFromPoint to show which element actually receives the click there.
(function () {
  var r = { hits: [] };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  try {
    var frame = q('#frame'), sw = q('.demo-switch').getBoundingClientRect();
    r.inner = [innerWidth, innerHeight];
    r.fit = parseFloat(getComputedStyle(frame).getPropertyValue('--fit'));
    r.switchVp = [rd(sw.left), rd(sw.top), rd(sw.right), rd(sw.bottom)];
    var SEL = 'button, a[href], input:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), [role=tab], [role=link], [role=menuitem]';
    function navNow() { return q('#' + (frame.dataset.rail === 'expanded' ? 'nav-' : 'rail-') + frame.dataset.mode); }
    ['dark', 'light'].forEach(function (mode) {
      ['expanded', 'collapsed'].forEach(function (rail) {
        ['projects', 'dashboard'].forEach(function (view) {
          q('[data-mode-set="' + mode + '"]').click();
          var b = q(rail === 'collapsed' ? '[data-act="collapse"]' : '[data-act="expand"]', navNow()); if (b) b.click();
          if (view === 'dashboard') { if (q('#view-dashboard').hidden) q('.pcard:nth-child(2) .pcard__title').click(); }
          else if (q('#view-projects').hidden) q('#view-dashboard [data-go="projects"]').click();
          [false, true].forEach(function (hov) {
            qa('.pcard, .tr--body').forEach(function (el) { el.classList.toggle('is-hover', hov); });
            var fr = frame.getBoundingClientRect();
            qa(SEL, frame).forEach(function (el) {
              var e = el.getBoundingClientRect();
              if (e.width <= 0 || e.height <= 0 || getComputedStyle(el).visibility === 'hidden') return;
              var L = Math.max(e.left, sw.left, fr.left), R = Math.min(e.right, sw.right, fr.right), T = Math.max(e.top, sw.top, fr.top), B = Math.min(e.bottom, sw.bottom, fr.bottom);
              if (R - L <= 0.5 || B - T <= 0.5) return;
              var at = document.elementFromPoint((L + R) / 2, (T + B) / 2);
              r.hits.push({ state: mode + '/' + rail + '/' + view + (hov ? '+hover' : ''), element: el.tagName.toLowerCase() + '.' + el.className.split(' ').join('.') + ' "' + (el.getAttribute('aria-label') || el.textContent.trim()) + '"',
                elementVp: [rd(e.left), rd(e.top), rd(e.right), rd(e.bottom)], overlapPx: [rd(R - L), rd(B - T)],
                clickAtOverlapGoesTo: at ? (at.closest('.demo-switch') ? 'demo-switch (' + (at.textContent.trim() || at.className) + ')' : at.tagName.toLowerCase() + '.' + at.className) : null });
            });
          });
          qa('.pcard, .tr--body').forEach(function (el) { el.classList.remove('is-hover'); });
        });
      });
    });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
