// ctx_query_state (sync): what the page looks like right after load for a given --query (mode=light, state=frame|landing|menus, #dashboard)
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  try {
    var f = q('#frame');
    r.search = location.search; r.hash = location.hash;
    r.mode = f.dataset.mode; r.rail = f.dataset.rail;
    r.pressed = qa('[data-mode-set]').map(function (b) { return b.dataset.modeSet + '=' + b.getAttribute('aria-pressed'); }).join(',');
    r.navShown = ['nav-dark', 'nav-light', 'rail-dark', 'rail-light'].filter(function (id) { return getComputedStyle(document.getElementById(id)).display !== 'none'; });
    var h = q('#' + r.navShown[0] + ' .nav__head, #' + r.navShown[0] + ' .rail__logo').getBoundingClientRect();
    r.navHeadInViewport = h.top >= 0 && h.height > 0 && h.bottom <= innerHeight;
    r.view = q('#view-dashboard').hidden ? 'projects' : 'dashboard';
    r.openMenus = qa('.dd').filter(function (m) { return !m.hidden; }).map(function (m) { return m.id; });
    r.isHoverCount = qa('.is-hover').length;
    // switching works after a query-driven start
    q('[data-mode-set="dark"]').click(); r.afterDark = f.dataset.mode;
    q('[data-mode-set="light"]').click(); r.afterLight = f.dataset.mode;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
