// ctx_focus_scroll (sync): #frame is overflow:hidden, which is still a scroll container. Focusing (Tab / .focus())
// any control that sits outside the 1440x900 artboard scrolls #frame's content, shifting the whole artboard -
// nav header included - with no scrollbar to undo it. Checks every visible focusable in the landing, dashboard,
// and with each menu open, and reports which ones scroll the frame (or the viewport / .fit wrapper).
(function () {
  var r = { scrolled: [] }, q = function (s) { return document.querySelector(s); }, qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var frame = q('#frame'), fit = q('.fit'), se = document.scrollingElement || document.documentElement;
  function offs() { return [frame.scrollTop, frame.scrollLeft, fit.scrollTop, fit.scrollLeft, se.scrollTop, se.scrollLeft]; }
  function reset() { frame.scrollTop = frame.scrollLeft = 0; fit.scrollTop = fit.scrollLeft = 0; se.scrollTop = se.scrollLeft = 0; qa('.nav__scroll').forEach(function (n) { n.scrollTop = 0; }); }
  function headTop() { var m = frame.dataset.mode, h = q('#nav-' + m + ' .nav__head'); return h ? +(h.getBoundingClientRect().top - frame.getBoundingClientRect().top).toFixed(1) : null; }
  function scan(label) {
    qa('#frame button, #frame a[href], #frame [tabindex="0"], #frame input:not([tabindex="-1"])').forEach(function (el) {
      if (el.closest('[hidden]') || el.closest('.nav__scroll')) return;   // nav list scrolling is its own (intended) scroller
      var cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return;
      var b = el.getBoundingClientRect(); if (b.width < 1 || b.height < 1) return;
      reset(); var before = headTop();
      el.focus();
      var o = offs();
      if (o.some(function (v) { return v !== 0; })) r.scrolled.push({ state: label, el: (el.getAttribute('aria-label') || el.textContent.trim().slice(0, 24) || el.className), frameScrollTop: o[0], frameScrollLeft: o[1], fitScroll: [o[2], o[3]], viewportScroll: [o[4], o[5]], navHeaderTopInFrame_before: before, after: headTop() });
      el.blur();
    });
    reset();
  }
  try {
    scan('landing');
    var cards = qa('.pcard');
    cards[11].querySelector('.pcard__more').click(); scan('landing+cardMenu(last card)'); cards[11].querySelector('.pcard__more').click();
    q('.pcard').click(); scan('dashboard');
    var rb = qa('.rowbtn'); rb[7].click(); q('#add-to-project').click(); scan('dashboard+rowMenu+sub(last row)');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    // what a keyboard user actually gets: focus the clipped "Delete" of the last card's menu and look at the nav header
    q('[data-go="projects"]').click(); reset();
    cards[11].querySelector('.pcard__more').click();
    var del = q('#menu-card .ddi--danger'); del.focus();
    var hd = q('#nav-dark .nav__head').getBoundingClientRect(), f = frame.getBoundingClientRect();
    r.afterFocusDelete = { frameScrollTop: frame.scrollTop, navHeaderTopRelFrame: +(hd.top - f.top).toFixed(1), navHeaderBottomRelFrame: +(hd.bottom - f.top).toFixed(1), navHeaderFullyVisible: hd.top >= f.top - 0.5 };
    // closing the menu does not undo it
    del.click();
    hd = q('#nav-dark .nav__head').getBoundingClientRect();
    r.afterMenuClosed = { frameScrollTop: frame.scrollTop, navHeaderTopRelFrame: +(hd.top - f.top).toFixed(1) };
  } catch (e) { r.checkError = String(e && e.stack || e); }
  r.scrolledCount = r.scrolled.length;
  window.__report(r);
})();
