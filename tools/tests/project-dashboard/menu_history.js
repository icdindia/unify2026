// menu_ lens: page navigation through browser history. ASYNC — run in --ctx http (or file) only;
// in sandbox/srcdoc pushState throws and is swallowed, so there is no history to test.
//   python3 run_checks.py --ctx http --checks menu_history.js --w 1200 --h 700
(async function () {
  var r = {};
  var q = function (s) { return document.querySelector(s); };
  function waitPop() {
    return new Promise(function (res) {
      var done = false;
      function fin(fired) { if (done) return; done = true; removeEventListener('popstate', on); setTimeout(function () { res(fired); }, 50); }
      function on() { fin(true); }
      addEventListener('popstate', on); setTimeout(function () { fin(false); }, 1500);
    });
  }
  function state() { return { hash: location.hash, historyLength: history.length, view: q('#view-dashboard').hidden ? 'projects' : 'dashboard', title: q('#dash-title').textContent, crumb: q('#crumb-project').textContent.trim() }; }
  try {
    // 1) Back-button trap: on load the app pushes "#projects"; going Back to the original entry fires
    //    popstate, whose handler calls show('projects') -> pushState('#projects') again.
    r.onLoad = state();
    var fired = await (function () { var p = waitPop(); history.back(); return p; })();
    r.afterBack1 = state(); r.afterBack1.popstateFired = fired;
    fired = await (function () { var p = waitPop(); history.back(); return p; })();
    r.afterBack2 = state(); r.afterBack2.popstateFired = fired;
    r.backTrap = r.afterBack1.popstateFired && r.afterBack1.hash === '#projects' && r.afterBack2.hash === '#projects';

    // 2) Title on history traversal: open card 0, go back via breadcrumb, open card 4, then Back x2
    //    lands on card 0's #dashboard entry.
    var cards = document.querySelectorAll('#pgrid .pcard');
    var n0 = cards[0].querySelector('.pcard__title').textContent, n4 = cards[4].querySelector('.pcard__title').textContent;
    cards[0].querySelector('.pcard__title').click();
    q('[data-go="projects"]').click();
    cards[4].querySelector('.pcard__title').click();
    r.openedSecond = state();
    var p = waitPop(); history.back(); await p;
    r.back1 = state();
    p = waitPop(); history.back(); await p;
    r.back2 = state();
    r.back2_expectedTitle = n0;
    r.staleTitleOnHistory = r.back2.view === 'dashboard' && r.back2.title !== n0;
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
