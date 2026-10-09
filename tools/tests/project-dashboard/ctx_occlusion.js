// ctx_occlusion (sync): at the current viewport, is any interactive control of the prototype covered by the
// fixed .demo-switch (or otherwise not hit-testable at its centre)? Checks landing + dashboard + both nav modes + rails.
(function () {
  var r = { covered: [] }, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame');
  function scan(label) {
    qa('#frame button, #frame a, #frame [tabindex="0"], #frame input').forEach(function (el) {
      var cs = getComputedStyle(el); if (el.closest('[hidden]') || cs.display === 'none' || cs.visibility === 'hidden') return;
      var b = el.getBoundingClientRect(); if (b.width < 1 || b.height < 1) return;
      // skip things that are off-screen because the nav section scrolls / is clipped (not this lens)
      var cx = b.left + b.width / 2, cy = b.top + b.height / 2; if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return;
      var hit = document.elementFromPoint(cx, cy);
      if (hit && hit.closest('.demo-switch')) r.covered.push(label + ': ' + (el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) || el.className));
    });
  }
  try {
    r.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    var ds = q('.demo-switch').getBoundingClientRect(); r.demoSwitch = [Math.round(ds.left), Math.round(ds.top), Math.round(ds.width), Math.round(ds.height)];
    var f = frame.getBoundingClientRect(); r.frame = [Math.round(f.left), Math.round(f.top), Math.round(f.width), Math.round(f.height)];
    ['dark', 'light'].forEach(function (m) {
      q('[data-mode-set="' + m + '"]').click();
      q('[data-go="projects"]') && q('#nav-' + m + ' [data-nav="projects"]').click();
      scan(m + '/landing');
      q('.pcard').click(); scan(m + '/dashboard');
      q('#hdr-more').click(); scan(m + '/dashboard+hdrMenu'); q('#hdr-more').click();
      q('#nav-' + m + ' [data-act="collapse"]').click(); scan(m + '/rail/dashboard');
      q('#rail-' + m + ' [data-nav="projects"]').click(); scan(m + '/rail/landing');
      q('#rail-' + m + ' [data-act="expand"]').click();
    });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
