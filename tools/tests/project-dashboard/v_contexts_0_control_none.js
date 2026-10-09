// v_contexts_0_control_none (sync): isolate one click and see whether the srcdoc document unloads.
(function () {
  var r = { test: 'control_none' }, q = function (s) { return document.querySelector(s); };
  try {
    r.docURL = location.href.slice(0, 40); r.baseURI = document.baseURI.slice(0, 90);
    q('.pcard:nth-child(2)').click();
    r.dashBefore = !q('#view-dashboard').hidden;
    addEventListener('pagehide', function (e) { r.UNLOADED = true; r.persisted = e.persisted; window.__report(r); });
    var clicks = []; addEventListener('click', function (e) { clicks.push({ dp: e.defaultPrevented, t: e.target.className }); });
    /* no click at all: proves pagehide is not a harness artefact */
    r.clicks = clicks;
    r.dashAfterSync = !q('#view-dashboard').hidden;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  r.UNLOADED = false; window.__report(r);
})();
