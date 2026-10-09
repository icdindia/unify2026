// menu_ lens: "menus close on any outside click" — clicks that land on nav controls. SYNCHRONOUS.
//   python3 run_checks.py --ctx srcdoc --checks menu_outside_nav.js --w 1200 --h 700
//   python3 run_checks.py --ctx http   --checks menu_outside_nav.js --w 1200 --h 700
(function () {
  var r = { results: {} };
  var q = function (s) { return document.querySelector(s); };
  function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0; }
  function open() { return ['menu-card', 'menu-row', 'menu-sub', 'menu-hdr'].filter(function (id) { return shown(q('#' + id)); }); }
  function esc() { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }
  try {
    var cards = document.querySelectorAll('#pgrid .pcard');
    cards[0].querySelector('.pcard__title').click();            // dashboard
    var rb = document.querySelectorAll('#table .tr--body .rowbtn')[1];
    // every kind of nav target in the expanded dark nav, each clicked with a dashboard menu open
    var targets = {
      sectionChevron: '#nav-dark [data-act="section"]',
      navItemRoutines: '#nav-dark [data-nav="routines"]',
      navSearchBtn: '#nav-dark .nav__tools .nbtn:not([data-act])',
      navFooterBell: '#nav-dark .nfbtn',
      chatRow: '#nav-dark .nchat',
      chatRowMore: '#nav-dark .nchat .nmore',
      demoSwitchLight: '[data-mode-set="light"]'
    };
    Object.keys(targets).forEach(function (k) {
      q('[data-mode-set="dark"]').click();
      ['row', 'hdr'].forEach(function (which) {
        if (which === 'row') { rb.click(); q('#add-to-project').click(); } else q('#hdr-more').click();
        var before = open();
        var t = q(targets[k]);
        t.click();
        var after = open();
        r.results[k + '/' + which] = { before: before, after: after, closed: after.length === 0 };
        esc();
        // undo a section collapse so the next target is still visible
        if (k === 'sectionChevron') t.click();
      });
    });
    q('[data-mode-set="light"]').click();
    q('#hdr-more').click();
    var lb = open(); q('#nav-light [data-act="section"]').click();
    r.results['lightSectionChevron/hdr'] = { before: lb, after: open(), closed: open().length === 0 };
    r.failing = Object.keys(r.results).filter(function (k) { return !r.results[k].closed; });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
