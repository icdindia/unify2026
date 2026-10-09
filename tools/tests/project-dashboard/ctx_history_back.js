// ctx_history_back (async; run in --ctx http or file, where timers advance):
// does the browser Back button work? Load pushes '#projects' onto the hash-less entry the page was opened at.
// Going Back to that entry fires popstate -> show('projects') -> pushHash('#projects'), which pushes a NEW entry
// (truncating forward history) so the user lands right back on '#projects': Back can never get past the page.
(async function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  function back() { return new Promise(function (res) { var done = false; function fin(tag) { if (done) return; done = true; setTimeout(function () { res(tag); }, 50); } addEventListener('popstate', function h() { removeEventListener('popstate', h); fin('popstate'); }); setTimeout(function () { fin('timeout'); }, 1500); history.back(); }); }
  try {
    r.atLoad = { hash: location.hash, historyLength: history.length };
    // open a project, then press Back three times
    q('.pcard:nth-child(2)').click();
    r.afterOpen = { hash: location.hash, historyLength: history.length, dashboard: !q('#view-dashboard').hidden };
    r.steps = [];
    for (var i = 0; i < 3; i++) {
      var how = await back();
      r.steps.push({ back: i + 1, via: how, hash: location.hash, historyLength: history.length, landing: !q('#view-projects').hidden });
    }
    // expected for a working Back: step1 '#projects', step2 '' (the entry the page was opened at), step3 leaves/no-op on ''
    r.backReachesOpeningEntry = r.steps.some(function (s) { return s.hash === ''; });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
