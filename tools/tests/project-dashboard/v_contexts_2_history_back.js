// v_contexts_2_history_back: refutation probe for the "Back is trapped on #projects" report.
// Timer-free (popstate-driven) so it runs in http, file and sandbox.
// Use with --mutate to install a raw logger that records location.hash at popstate time BEFORE app.js's
// handler runs (window.__raw), and optionally a control mutation that skips pushHash on popstate (window.__nopush).
(function () {
  var r = { steps: [] }, q = function (s) { return document.querySelector(s); }, n = 0;
  try {
    r.atLoad = { hash: location.hash, historyLength: history.length };
    q('.pcard:nth-child(2)').click();
    r.afterOpen = { hash: location.hash, historyLength: history.length, dashboard: !q('#view-dashboard').hidden };
    addEventListener('popstate', function () {
      Promise.resolve().then(function () {
        n++;
        r.steps.push({ back: n, rawHashAtPopstate: (window.__raw || [])[n - 1], hashAfterApp: location.hash,
          historyLength: history.length, landing: !q('#view-projects').hidden });
        if (n < 3 && location.hash !== '') history.back();
        else { r.backReachesOpeningEntry = r.steps.some(function (s) { return s.hashAfterApp === ''; }); window.__report(r); }
      });
    });
    history.back();
  } catch (e) { r.checkError = String(e && e.stack || e); window.__report(r); }
})();
