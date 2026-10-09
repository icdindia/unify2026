// v_layout_2_ : independent re-check of "fixed .demo-switch covers app controls". SYNCHRONOUS.
// For each view x rail x mode, finds every visible interactive control inside #frame, samples a 9x9 grid of
// points over its box and hit-tests each with elementFromPoint. Reports, for any control where some sample
// lands on the .demo-switch: fraction covered, whether its centre is covered, and which switch part takes it
// (a [data-mode-set] button means a click meant for the control would flip the nav mode instead).
// Also computes the frame geometry to confirm the overlap follows from the CSS (fit + centred frame + fixed switch).
(function () {
  var r = { covered: [] };
  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return [].slice.call((root || document).querySelectorAll(s)); }
  function rd(n) { return Math.round(n * 10) / 10; }
  try {
    var frame = q('#frame'), swEl = q('.demo-switch'), sw = swEl.getBoundingClientRect();
    var fr0 = frame.getBoundingClientRect();
    r.inner = [innerWidth, innerHeight];
    r.fit = rd(parseFloat(getComputedStyle(frame).getPropertyValue('--fit')) * 1000) / 1000;
    r.frameVp = [rd(fr0.left), rd(fr0.top), rd(fr0.right), rd(fr0.bottom)];
    r.switchVp = [rd(sw.left), rd(sw.top), rd(sw.right), rd(sw.bottom)];
    r.switchCss = { position: getComputedStyle(swEl).position, zIndex: getComputedStyle(swEl).zIndex, pointerEvents: getComputedStyle(swEl).pointerEvents };
    var SEL = 'button, a[href], input, [tabindex]:not([tabindex="-1"]), [role=tab], [role=menuitem]';
    function navNow() { return q('#' + (frame.dataset.rail === 'expanded' ? 'nav-' : 'rail-') + frame.dataset.mode); }
    ['dark', 'light'].forEach(function (mode) {
      ['expanded', 'collapsed'].forEach(function (rail) {
        ['projects', 'dashboard'].forEach(function (view) {
          q('[data-mode-set="' + mode + '"]').click();
          var b = q(rail === 'collapsed' ? '[data-act="collapse"]' : '[data-act="expand"]', navNow()); if (b) b.click();
          if (view === 'dashboard') { if (q('#view-dashboard').hidden) q('.pcard:nth-child(2) .pcard__title').click(); }
          else if (q('#view-projects').hidden) q('#view-dashboard [data-go="projects"]').click();
          var state = frame.dataset.mode + '/' + frame.dataset.rail + '/' + (q('#view-dashboard').hidden ? 'projects' : 'dashboard');
          qa(SEL, frame).forEach(function (el) {
            var e = el.getBoundingClientRect();
            if (e.width <= 0 || e.height <= 0) return;
            var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
            var N = 9, onSw = 0, onEl = 0, parts = {};
            for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
              var x = e.left + (i + 0.5) * e.width / N, y = e.top + (j + 0.5) * e.height / N;
              if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
              var at = document.elementFromPoint(x, y); if (!at) continue;
              if (at.closest('.demo-switch')) { onSw++; var p = at.getAttribute('data-mode-set') ? 'button[data-mode-set=' + at.getAttribute('data-mode-set') + ']' : (at.className || at.tagName); parts[p] = (parts[p] || 0) + 1; }
              else if (el.contains(at) || at === el) onEl++;
            }
            if (!onSw) return;
            var cx = (e.left + e.right) / 2, cy = (e.top + e.bottom) / 2, c = document.elementFromPoint(cx, cy);
            r.covered.push({ state: state, el: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '.' + el.className.split(' ').join('.') + ' "' + (el.getAttribute('aria-label') || el.textContent.trim()) + '"',
              vp: [rd(e.left), rd(e.top), rd(e.right), rd(e.bottom)], samplesOnSwitch: onSw + '/' + (N * N), samplesReachEl: onEl + '/' + (N * N),
              centreCovered: !!(c && c.closest('.demo-switch')), switchPartsHit: parts });
          });
        });
      });
    });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
