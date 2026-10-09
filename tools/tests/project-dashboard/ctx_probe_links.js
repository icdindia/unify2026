// ctx_ probe: where do the plain href="#" nav links (no data-nav) resolve, and is their default prevented?
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  try {
    r.docURL = location.href; r.baseURI = document.baseURI; r.hash = location.hash; r.search = location.search;
    var plain = [].filter.call(document.querySelectorAll('#frame a[href]'), function (a) { return !a.hasAttribute('data-nav'); });
    r.plainLinkCount = plain.length;
    r.sampleResolved = plain.length ? plain[0].href : null;
    r.resolvesToOtherDocument = plain.filter(function (a) { return a.href.split('#')[0] !== location.href.split('#')[0]; }).length;
    var prevented = [];
    window.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) prevented.push(e.defaultPrevented); });
    // open the dashboard first, then click one plain link (the first Agents row)
    q('.pcard:nth-child(3) .pcard__title').click();
    r.dashBefore = !q('#view-dashboard').hidden;
    r.hashBefore = location.hash;
    var popped = 0; window.addEventListener('popstate', function () { popped++; });
    var hashchanged = 0; window.addEventListener('hashchange', function () { hashchanged++; });
    window.addEventListener('pagehide', function () { window.__report({ phase: 'pagehide-after-plain-link-click', note: 'document is being unloaded: the iframe navigated away', r: r }); });
    q('#nav-dark .nagent').click();
    r.defaultPreventedOnPlainLink = prevented.slice();
    r.popstateSync = popped; r.hashchangeSync = hashchanged;
    r.hashAfter = location.hash;
    r.dashAfterSync = !q('#view-dashboard').hidden;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
