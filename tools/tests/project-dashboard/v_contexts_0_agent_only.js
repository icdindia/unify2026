// v_contexts_0_agent_only (sync): isolate one click and see whether the srcdoc document unloads.
(function () {
  var r = { test: 'agent_only' }, q = function (s) { return document.querySelector(s); };
  try {
    r.docURL = location.href.slice(0, 40); r.baseURI = document.baseURI.slice(0, 90);
    q('.pcard:nth-child(2)').click();
    r.dashBefore = !q('#view-dashboard').hidden;
    addEventListener('pagehide', function (e) { r.UNLOADED = true; r.persisted = e.persisted; window.__report(r); });
    var clicks = []; addEventListener('click', function (e) { clicks.push({ dp: e.defaultPrevented, t: e.target.className }); });
    var a = q('#nav-dark .nagent'); r.target = a.textContent.trim(); r.href = a.href; a.click();
    r.clicks = clicks;
    r.dashAfterSync = !q('#view-dashboard').hidden;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  r.UNLOADED = false; window.__report(r);
})();
