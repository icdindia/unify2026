// menu_ lens: state of the page on load. SYNCHRONOUS.
//   deep link / reload on the dashboard:  python3 run_checks.py --ctx http --checks menu_deeplink.js --w 1200 --h 700 --query 'x=1#dashboard'
//   ?state=menus debug view:              python3 run_checks.py --ctx http --checks menu_deeplink.js --w 1200 --h 700 --query state=menus
(function () {
  var r = {};
  var q = function (s) { return document.querySelector(s); };
  function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0; }
  try {
    r.url = { search: location.search, hash: location.hash };
    r.view = q('#view-dashboard').hidden ? 'projects' : 'dashboard';
    r.title = q('#dash-title').textContent;
    r.crumb = q('#crumb-project').textContent.trim();
    r.titleMatchesCrumb = r.title === r.crumb;
    r.menusOpen = ['menu-card', 'menu-row', 'menu-sub', 'menu-hdr'].filter(function (id) { return shown(q('#' + id)); });
    r.activeRows = [].map.call(document.querySelectorAll('.tr--body.is-active'), function (t) { return t.getAttribute('data-row'); });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
