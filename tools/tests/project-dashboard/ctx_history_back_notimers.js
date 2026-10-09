// ctx_history_back_notimers: same as ctx_history_back.js but driven only by popstate events (no setTimeout),
// so it can also run in --ctx sandbox. Presses Back 3 times after opening a project; reports after the 3rd popstate.
// A working Back would reach the entry the page was opened at (hash '') on the 2nd press.
(function () {
  var r = { steps: [] }, q = function (s) { return document.querySelector(s); }, n = 0;
  try {
    r.atLoad = { hash: location.hash, historyLength: history.length };
    q('.pcard:nth-child(2)').click();
    r.afterOpen = { hash: location.hash, historyLength: history.length };
    addEventListener('popstate', function () {
      // read state on the next microtask, after app.js's own popstate handler ran
      Promise.resolve().then(function () {
        n++; r.steps.push({ back: n, hash: location.hash, historyLength: history.length, landing: !q('#view-projects').hidden });
        if (n < 3) history.back(); else { r.backReachesOpeningEntry = r.steps.some(function (s) { return s.hash === ''; }); window.__report(r); }
      });
    });
    history.back();
  } catch (e) { r.checkError = String(e && e.stack || e); window.__report(r); }
})();
