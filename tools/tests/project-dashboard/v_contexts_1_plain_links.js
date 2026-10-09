// v_contexts_1_plain_links (sync): independent re-check of "plain <a href='#'> nav rows throw the dashboard back to the landing".
// Uses element.click() (not a hand-built MouseEvent), counts history entries, and covers dark + light nav and a [data-nav] control.
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  var pop = 0, hc = 0, unloaded = false;
  addEventListener('popstate', function () { pop++; });
  addEventListener('hashchange', function () { hc++; });
  addEventListener('pagehide', function () { unloaded = true; r.UNLOADED = true; window.__report(r); });
  function onDash(card) { q('.pcard:nth-child(' + card + ')').click(); return !q('#view-dashboard').hidden; }
  function probe(label, sel) {
    var openOk = onDash(2);
    var title = q('#dash-title').textContent, h0 = history.length, p0 = pop, hash0 = location.hash;
    var el = q(sel);
    if (!el) { r[label] = { missing: sel }; return; }
    el.click();
    r[label] = { sel: sel, openedDashboard: openOk, titleBefore: title, hashBefore: hash0, hashAfter: location.hash,
      popstateFired: pop - p0, historyEntriesAdded: history.length - h0,
      dashboardStillShown: !q('#view-dashboard').hidden, landingShown: !q('#view-projects').hidden };
  }
  try {
    r.docURL = location.href.slice(0, 60);
    // control: a [data-nav] item that has no designed page — app.js preventDefaults it and keeps the dashboard
    probe('control_dataNav_routines_dark', '#nav-dark [data-nav="routines"]');
    probe('dark_agent', '#nav-dark .nagent');
    probe('dark_pinned_row', '#nav-dark .nrow:not([data-nav])');
    probe('dark_chat_row', '#nav-dark .nchat');
    probe('dark_chat_more_btn', '#nav-dark .nchat .nmore');
    q('.demo-switch [data-mode-set="light"]').click();
    r.modeNow = q('#frame').getAttribute('data-mode');
    probe('control_dataNav_routines_light', '#nav-light [data-nav="routines"]');
    probe('light_agent', '#nav-light .lagent');
    probe('light_chat_row', '#nav-light .lchat');
    probe('light_chat_more_btn', '#nav-light .lchat .lmore');
    r.DEFECT_rows = Object.keys(r).filter(function (k) { return r[k] && r[k].openedDashboard && r[k].dashboardStillShown === false; });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  if (!unloaded) window.__report(r);
})();
