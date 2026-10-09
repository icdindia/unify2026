// v_menus_2_ (refutation pass): does a nav section chevron click leave dashboard menus open? SYNCHRONOUS.
//   python3 run_checks.py --ctx srcdoc --checks v_menus_2_section_chevron.js --w 1200 --h 700
//   python3 run_checks.py --ctx http   --checks v_menus_2_section_chevron.js --w 1200 --h 700
// Control (proves root cause): add closeAll() to the section branch and every case should close:
//   --mutate "var grp = t.closest('.ngrp, .nhgrp, .lgrp');=>closeAll(); var grp = t.closest('.ngrp, .nhgrp, .lgrp');"
(function () {
  var r = { cases: {}, card: {} };
  var q = function (s) { return document.querySelector(s); };
  function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0; }
  function open() { return ['menu-card', 'menu-row', 'menu-sub', 'menu-hdr'].filter(function (id) { return shown(q('#' + id)); }); }
  function esc() { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }
  // click whatever element is really under the chevron's centre (what a pointer would hit)
  function pointerClick(el) {
    var b = el.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    var hit = document.elementFromPoint(x, y);
    var onTarget = !!hit && (hit === el || el.contains(hit));
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(function (t) {
      (hit || el).dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window }));
    });
    return onTarget;
  }
  try {
    q('#pgrid .pcard .pcard__title').click();
    r.dashboardShown = !q('#view-dashboard').hidden;
    var rb = document.querySelectorAll('#table .tr--body .rowbtn')[1];
    ['dark', 'light'].forEach(function (mode) {
      q('[data-mode-set="' + mode + '"]').click();
      var nav = q(mode === 'dark' ? '#nav-dark' : '#nav-light');
      [].forEach.call(nav.querySelectorAll('[data-act="section"]'), function (chev, i) {
        ['row', 'hdr'].forEach(function (which) {
          esc();
          if (which === 'row') { rb.click(); q('#add-to-project').click(); } else q('#hdr-more').click();
          var before = open();
          var onTarget = pointerClick(chev);
          var after = open();
          r.cases[mode + i + '/' + which] = {
            onTarget: onTarget, before: before, after: after, closed: after.length === 0,
            sectionToggled: chev.getAttribute('aria-expanded') === 'false',
            rowStillActive: which === 'row' ? rb.closest('.tr').classList.contains('is-active') : null,
            rowAriaExpanded: which === 'row' ? rb.getAttribute('aria-expanded') : null,
            hdrAriaExpanded: q('#hdr-more').getAttribute('aria-expanded')
          };
          pointerClick(chev);   // re-expand the section
        });
      });
    });
    esc();
    // comparison: the landing card menu IS closed by the same chevron (handled in the earlier capture listener)
    q('[data-mode-set="dark"]').click();
    q('.bc [data-go="projects"], [data-go="projects"]').click();
    var chev = q('#nav-dark [data-act="section"]');
    q('#pgrid .pcard .pcard__more').click();
    r.card.before = open();
    pointerClick(chev);
    r.card.after = open();
    pointerClick(chev);
    r.failing = Object.keys(r.cases).filter(function (k) { return !r.cases[k].closed; });
    r.passing = Object.keys(r.cases).filter(function (k) { return r.cases[k].closed; });
  } catch (e) { r.checkError = String(e && e.stack || e); }
  window.__report(r);
})();
