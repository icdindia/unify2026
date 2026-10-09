// nav_ lens: the nav's non-[data-nav] entries are <a href="#"> with no handler (agents, pinned, chats/history).
// What does clicking one do? Synchronous observations first (sandbox-safe), then an async follow-up (http only).
// Optional: set ?pick=<selector> via --mutate to change the clicked element. Default: first dark-nav agent.
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  var PICK = '#nav-dark .nagent';
  try {
    var top1 = window.parent === window || window.parent === window.top;   // do not recurse if the frame got re-loaded inside itself
    r.depthOk = top1;
    q('.pcard:nth-child(3)').click();
    r.dashOpenBefore = !q('#view-dashboard').hidden;
    r.titleBefore = q('#dash-title').textContent;
    var navEvents = [], popstates = 0, hashchanges = 0, defaultPrevented = null;
    if (window.navigation) navigation.addEventListener('navigate', function (e) {
      navEvents.push({ url: e.destination.url, sameDocument: e.destination.sameDocument, hashChange: e.hashChange, type: e.navigationType });
    });
    addEventListener('click', function (e) { defaultPrevented = e.defaultPrevented; });   // window bubble: runs after app.js handlers
    addEventListener('popstate', function () { popstates++; });
    addEventListener('hashchange', function () { hashchanges++; });
    addEventListener('pagehide', function () {
      r.navigatedAway = true;
      try { parent.postMessage('__RESULTS__' + JSON.stringify(r), '*'); } catch (e) {}
    });
    var a = q(PICK);
    r.picked = PICK + ' "' + a.textContent.trim() + '"';
    r.tag = a.tagName; r.hrefAttr = a.getAttribute('href'); r.hrefResolved = a.href;
    r.location = location.href; r.baseURI = document.baseURI;
    if (top1) a.click();
    r.defaultPrevented = defaultPrevented;
    r.navEvents = navEvents;
    r.popstatesSync = popstates;
    r.dashOpenAfterSync = !q('#view-dashboard').hidden;
    r.landingShownAfterSync = !q('#view-projects').hidden;
    window.__report(r);
    setTimeout(function () {
      r.popstatesAsync = popstates; r.hashchangesAsync = hashchanges;
      r.dashOpenAfterAsync = !q('#view-dashboard').hidden;
      r.locationAfter = location.href;
      window.__report(r);
    }, 400);
  } catch (e) { r.checkError = String(e && e.stack || e); window.__report(r); }
})();
