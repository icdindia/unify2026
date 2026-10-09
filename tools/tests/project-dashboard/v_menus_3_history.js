// v_menus_3_: independent re-check of "dashboard title not restored on history traversal".
// ASYNC (history traversal is inherently async) — run in --ctx http or file only.
//   python3 run_checks.py --ctx http --checks v_menus_3_history.js --w 1200 --h 700
//   python3 run_checks.py --ctx file --checks v_menus_3_history.js --w 1200 --h 700
// Differs from menu_history.js: no initial back-trap step; project A opened by keyboard Enter,
// return via the visible nav "Projects" item (not the breadcrumb); project B opened by click.
// Expected stack: ['', #projects, #dashboard(A), #projects, #dashboard(B)*]; Back x2 -> A's entry.
(async function () {
  var r = {};
  var q = function (s) { return document.querySelector(s); };
  function pop(fn) {
    return new Promise(function (res) {
      var done = false;
      function fin(f) { if (done) return; done = true; removeEventListener('popstate', on); setTimeout(function () { res(f); }, 30); }
      function on() { fin(true); }
      addEventListener('popstate', on); setTimeout(function () { fin(false); }, 1500); fn();
    });
  }
  function st() { return { hash: location.hash, len: history.length, view: q('#view-dashboard').hidden ? 'projects' : 'dashboard', title: q('#dash-title').textContent, crumb: q('#crumb-project').textContent.trim() }; }
  try {
    var cards = document.querySelectorAll('#pgrid .pcard');
    var nA = cards[1].querySelector('.pcard__title').textContent;
    var nB = cards[2].querySelector('.pcard__title').textContent;
    r.names = [nA, nB];
    r.onLoad = st();
    cards[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    r.openA = st();
    var navs = [].filter.call(document.querySelectorAll('[data-nav="projects"]'), function (el) { return el.getClientRects().length > 0; });
    r.visibleNavProjects = navs.length;
    navs[0].click();
    r.afterNav = st();
    cards[2].click();
    r.openB = st();
    r.back1_popstate = await pop(function () { history.back(); });
    r.back1 = st();
    r.back2_popstate = await pop(function () { history.back(); });
    r.back2 = st();                      // A's #dashboard entry
    r.back2_expectedTitle = nA;
    r.fwd1_popstate = await pop(function () { history.forward(); });
    r.fwd1 = st();
    r.fwd2_popstate = await pop(function () { history.forward(); });
    r.fwd2 = st();                       // B's #dashboard entry
    r.fwd2_expectedTitle = nB;
    r.staleOnBack = r.back2.view === 'dashboard' && r.back2.title !== nA;
    r.staleOnForward = r.fwd2.view === 'dashboard' && r.fwd2.title !== nB;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
