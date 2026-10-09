// ctx_plain_links (sync; all 4 contexts): the nav's plain <a href="#"> rows (Agents, Pinned, Routines, Chats/History,
// i.e. every <a> without data-nav) are not handled by app.js, so their default navigation runs.
//  - http / file / sandbox: the '#' fragment navigation fires popstate synchronously, app.js's popstate handler calls
//    show('projects'), so clicking e.g. "Financial Analysis Agent" while on a project dashboard throws you to the landing.
//  - srcdoc: '#' resolves against the PARENT page's URL (srcdoc base URL), so the click is a cross-document
//    navigation: the iframe unloads the prototype and loads the host page instead (pagehide fires).
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  try {
    var plain = qa('#frame a[href]').filter(function (a) { return !a.hasAttribute('data-nav'); });
    r.docURL = location.href.slice(0, 80);
    r.plainLinks = plain.length;
    r.plainLinkClasses = plain.reduce(function (m, a) { var k = a.closest('nav').id + ' .' + a.className.split(' ')[0]; m[k] = (m[k] || 0) + 1; return m; }, {});
    r.plainLinksResolvingToAnotherDocument = plain.filter(function (a) { return a.href.split('#')[0] !== location.href.split('#')[0]; }).length;
    r.exampleResolvedHref = plain[0].href;

    // 1) nested ⋯ button inside a chat row (no navigation expected from a button)
    q('.pcard:nth-child(2)').click();
    var pre = { dash: !q('#view-dashboard').hidden, title: q('#dash-title').textContent };
    var ev0 = new MouseEvent('click', { bubbles: true, cancelable: true });
    var navved = false; addEventListener('popstate', function () { navved = true; });
    addEventListener('pagehide', function () { r.UNLOADED = 'pagehide fired: the iframe document is being replaced by ' + plain[0].href; window.__report(r); });
    q('#nav-dark .nchat .nmore').dispatchEvent(ev0);
    r.nmoreClick = { defaultPrevented: ev0.defaultPrevented, popstate: navved, dashboardStillShown: !q('#view-dashboard').hidden };

    // 2) a plain Agents row
    navved = false;
    var ev = new MouseEvent('click', { bubbles: true, cancelable: true });
    q('#nav-dark .nagent').dispatchEvent(ev);
    r.agentClick = { before: pre, defaultPrevented: ev.defaultPrevented, popstateFired: navved, hashNow: location.hash,
      dashboardStillShown: !q('#view-dashboard').hidden, landingShown: !q('#view-projects').hidden };
    r.DEFECT_viewChangedByPlainLink = pre.dash && !q('#view-dashboard').hidden === false;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
