// nav_ lens: the fixed .demo-switch (nav mode control) must not cover app controls. SYNCHRONOUS.
(function () {
  var r = { covered: [] }, q = function (s) { return document.querySelector(s); };
  function rc(el) { var b = el.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(function (x) { return Math.round(x); }); }
  function inter(a, b) { return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; }
  try {
    var ds = q('.demo-switch'); r.demoSwitch = rc(ds);
    function scan(view) {
      [].forEach.call(document.querySelectorAll('#frame button, #frame a, #frame [tabindex], #frame input'), function (el) {
        var b = el.getBoundingClientRect(); if (!b.width || !b.height || getComputedStyle(el).visibility === 'hidden') return;
        if (el.closest('[hidden]') || el.offsetParent === null) return;
        if (inter(b, ds.getBoundingClientRect())) r.covered.push({ view: view, mode: q('#frame').dataset.mode + '/' + q('#frame').dataset.rail, el: (el.id ? '#' + el.id : el.className) + ' "' + (el.getAttribute('aria-label') || el.textContent.trim()).slice(0, 30) + '"', rect: rc(el) });
      });
    }
    ['dark', 'light'].forEach(function (m) {
      q('[data-mode-set="' + m + '"]').click();
      scan('projects');
      q('.pcard').click(); scan('dashboard');
      q('[data-go="projects"]').click();
    });
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
})();
