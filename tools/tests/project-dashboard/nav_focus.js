// nav_ lens: where does keyboard focus go when the rail is collapsed / expanded from the keyboard? SYNCHRONOUS.
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  function desc(el) { return el ? (el.tagName + (el.id ? '#' + el.id : '') + (el.getAttribute && el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label') + ']' : '')) : null; }
  try {
    [['dark', '#nav-dark', '#rail-dark'], ['light', '#nav-light', '#rail-light']].forEach(function (c) {
      q('[data-mode-set="' + c[0] + '"]').click();
      var col = q(c[1] + ' [data-act="collapse"]');
      col.focus();
      r[c[0] + 'FocusBeforeCollapse'] = desc(document.activeElement);
      col.click();   // what Enter/Space on the focused button does
      r[c[0] + 'RailNow'] = q('#frame').dataset.rail;
      r[c[0] + 'FocusAfterCollapse'] = desc(document.activeElement);
      r[c[0] + 'FocusedElRenderedAfterCollapse'] = document.activeElement.getClientRects().length > 0;
      var exp = q(c[2] + ' [data-act="expand"]');
      exp.focus();
      r[c[0] + 'FocusBeforeExpand'] = desc(document.activeElement);
      exp.click();
      r[c[0] + 'FocusAfterExpand'] = desc(document.activeElement);
      r[c[0] + 'FocusedElRenderedAfterExpand'] = document.activeElement.getClientRects().length > 0;
    });
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
  // async follow-up (http only; timers do not run in sandbox): collapse from the keyboard and let a frame pass
  q('[data-mode-set="dark"]').click();
  var col = q('#nav-dark [data-act="collapse"]'); col.focus(); col.click();
  setTimeout(function () {
    r.asyncFocusAfterCollapse = desc(document.activeElement);
    var exp = q('#rail-dark [data-act="expand"]'); exp.focus(); exp.click();
    setTimeout(function () { r.asyncFocusAfterExpand = desc(document.activeElement); window.__report(r); }, 200);
  }, 200);
})();
