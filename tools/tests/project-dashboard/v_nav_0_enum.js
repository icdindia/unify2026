// v_nav_0_: refutation pass for "nav <a href=#> without data-nav navigate away / drop the dashboard".
// Pass A (all contexts, safe): for EVERY <a href="#"> in the page, open the dashboard, click the anchor, and record
//   whether app.js prevented the default action (a window-level bubble listener runs after all app.js handlers,
//   records e.defaultPrevented, then cancels the event itself so the run stays on this document).
// Pass B (LIVE=true via --mutate, http/sandbox only): same clicks with no cancel, records whether the dashboard survives.
(function () {
  var LIVE = false;
  var q = function (s) { return document.querySelector(s); };
  var r = { notPrevented: [], prevented: 0, viewLost: [], total: 0 };
  try {
    var last = null;
    addEventListener('click', function (e) { last = e.defaultPrevented; if (!LIVE) e.preventDefault(); });
    var card = q('.pcard:nth-child(3)');
    var all = [].slice.call(document.querySelectorAll('a[href="#"]'));
    r.total = all.length;
    all.forEach(function (a) {
      card.click();                                  // dashboard open, hash #dashboard
      var before = !q('#view-dashboard').hidden;
      last = null; a.click();
      var host = a.closest('#nav-dark,#nav-light,#rail-dark,#rail-light,#view-dashboard,#view-projects');
      var label = (host ? '#' + host.id : '?') + ' .' + a.className.split(' ')[0] + ' "' + a.textContent.trim().slice(0, 30) + '"' +
        (a.hasAttribute('data-nav') ? ' [data-nav=' + a.getAttribute('data-nav') + ']' : '') +
        (a.hasAttribute('data-go') ? ' [data-go]' : '') + (a.hasAttribute('data-act') ? ' [data-act]' : '');
      if (last === false) r.notPrevented.push(label); else r.prevented++;
      var after = !q('#view-dashboard').hidden;
      // a [data-nav=projects] / [data-go=projects] click is SUPPOSED to show the landing
      var wantsLanding = a.getAttribute('data-nav') === 'projects' || a.getAttribute('data-go') === 'projects';
      if (before && !after && !wantsLanding) r.viewLost.push(label);
    });
    r.notPreventedCount = r.notPrevented.length;
    r.locationEnd = location.href;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
