// v_menus_1_ (refutation pass on "Back can never leave the page"). ASYNC — run in --ctx http or file only.
//   python3 run_checks.py --ctx http --checks v_menus_1_history_trap.js --w 1200 --h 700
// Counterfactual (init + popstate do not push) — proves the trap is the app's own pushes, not the harness:
//   python3 run_checks.py --ctx http --checks v_menus_1_history_trap.js --w 1200 --h 700 \
//     --mutate "show(location.hash === '#dashboard' ? 'dashboard' : 'projects');=>window.__noPush=1;show(location.hash === '#dashboard' ? 'dashboard' : 'projects');window.__noPush=0;" \
//     --mutate "function pushHash(h) { try { if (location.hash !== h)=>function pushHash(h) { try { if (window.__noPush) return; if (location.hash !== h)"
(async function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  function wait(fn) { return new Promise(function (res) {
    var done = false; function fin(f) { if (done) return; done = true; removeEventListener('popstate', on); setTimeout(function () { res(f); }, 60); }
    function on() { fin(true); } addEventListener('popstate', on); setTimeout(function () { fin(false); }, 1200); fn(); }); }
  function st(extra) { var o = { hash: location.hash, len: history.length, view: q('#view-dashboard').hidden ? 'projects' : 'dashboard' }; for (var k in extra) o[k] = extra[k]; return o; }
  try {
    r.mutated = !!window.hasOwnProperty('__noPush');
    r.onLoad = st();
    // A: user opens a project then returns via breadcrumb (all same-document entries)
    q('#pgrid .pcard .pcard__title').click();
    r.afterOpen = st();
    q('[data-go="projects"]').click();
    r.afterCrumb = st();
    // B: Back x3 should walk #projects <- #dashboard <- #projects <- '' (original entry)
    r.b1 = st({ pop: await wait(function () { history.back(); }) });
    r.b2 = st({ pop: await wait(function () { history.back(); }) });
    // (stop before leaving the document: if we are already on the original hash-less entry, the next Back exits)
    if (location.hash !== '') r.b3 = st({ pop: await wait(function () { history.back(); }) });
    else r.b3 = st({ skipped: 'already on original entry; next Back would leave the page' });
    // C: Forward should still be available after Back (forward stack intact)
    r.f1 = st({ pop: await wait(function () { history.forward(); }) });
    r.forwardStackDestroyed = r.f1.pop === false;
    r.stuckAtProjectsHash = r.b3.hash === '#projects';
    r.reachedOriginalEntry = r.b2.hash === '' || r.b3.hash === '';
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
