// Baseline: the two reported symptoms + the main flow. Runs after app.js.
(async function () {
  var r = {}, q = function (s) { return document.querySelector(s); }, wait = function (ms) { return new Promise(function (res) { setTimeout(res, ms); }); };
  try {
    var frame = q('#frame');
    r.fit = getComputedStyle(frame).getPropertyValue('--fit').trim();
    var head = q('#nav-dark .nav__head').getBoundingClientRect();
    r.navHeaderVisible = head.top >= 0 && head.bottom <= innerHeight && head.height > 0;
    r.frameFitsViewport = frame.getBoundingClientRect().top >= -0.5 && frame.getBoundingClientRect().bottom <= innerHeight + 0.5;
    q('[data-mode-set="light"]').click();
    r.lightMode = frame.dataset.mode === 'light' && getComputedStyle(q('#nav-light')).display === 'flex' && getComputedStyle(q('#nav-dark')).display === 'none';
    var lh = q('#nav-light .nav__head').getBoundingClientRect(); r.lightHeaderVisible = lh.top >= 0 && lh.height > 0;
    q('[data-mode-set="dark"]').click();
    r.backToDark = frame.dataset.mode === 'dark' && getComputedStyle(q('#nav-dark')).display === 'flex';
    q('.pcard:nth-child(2) .pcard__title').click();
    r.cardOpensDashboard = !q('#view-dashboard').hidden && q('#dash-title').textContent === 'Docebo UI Assets';
    q('[data-go="projects"]').click();
    r.breadcrumbBack = !q('#view-projects').hidden;
    q('#nav-dark [data-act="collapse"]').click();
    r.collapse = frame.dataset.rail === 'collapsed' && getComputedStyle(q('#rail-dark')).display === 'flex';
    q('#rail-dark [data-act="expand"]').click();
    r.expand = frame.dataset.rail === 'expanded';

    // inside page option 1 / option 2 (15054:105151): artboard px = viewport px / fit
    var s = frame.getBoundingClientRect().width / 1440, F = frame.getBoundingClientRect();
    var at = function (el) { var b = el.getBoundingClientRect(); return [Math.round((b.left - F.left) / s), Math.round((b.top - F.top) / s), Math.round(b.width / s), Math.round(b.height / s)].join(','); };
    var shown = function (sel) { return getComputedStyle(q(sel)).display !== 'none'; };
    q('[data-opt-set="2"]').click();   // from the landing: also opens the inside page
    r.opt2_opensDashboard = !q('#view-dashboard').hidden && frame.dataset.opt === '2' && q('[data-opt-set="2"]').getAttribute('aria-pressed') === 'true';
    r.opt2_swapsMarkup = shown('.toolbar2') && !shown('.toolbar') && q('.page__desc').textContent.indexOf('Tracking Q1 close activities') === 0 && !shown('.page__desc .o1');
    r.opt2_geometry = [at(q('.page__acts > :nth-child(1)')), at(q('.page__acts > :nth-child(3)')), at(q('.composer')), at(q('.toolbar2')), at(q('.toolbar2 .pill:nth-child(5)')), at(q('#table'))].join(' | ')
      === '1124,88,28,28 | 1184,88,56,28 | 480,180,760,116 | 480,344,760,28 | 763,344,67,28 | 480,420,760,420';
    q('#hdr-more').click(); r.opt2_hdrMenu = at(q('#menu-hdr')) === '1160,121,170,113'; q('#hdr-more').click();
    q('[data-opt-set="1"]').click();
    r.opt1_restored = frame.dataset.opt === '1' && shown('.toolbar') && !shown('.toolbar2');
    q('#hdr-more').click(); r.opt1_hdrMenu = at(q('#menu-hdr')) === '1160,121,170,113'; q('#hdr-more').click();
    // plain nav rows (no designed page) must not navigate: srcdoc would unload, served would bounce to the landing
    var ev = new MouseEvent('click', { bubbles: true, cancelable: true }); q('#nav-dark .nagent').dispatchEvent(ev);
    r.plainLinkStays = ev.defaultPrevented && !q('#view-dashboard').hidden;
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
})();
