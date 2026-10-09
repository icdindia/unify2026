// v_nav_2_: try to refute "collapse/expand from keyboard loses focus". Sync part works in every ctx; async part http/file only.
(function () {
  var r = {}, q = function (s) { return document.querySelector(s); };
  function desc(el) { return el ? (el.tagName + (el.id ? '#' + el.id : '') + (el.getAttribute && el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label') + ']' : '')) : null; }
  function vis(el) { return !!el && el.getClientRects().length > 0; }
  try {
    // 1. Is there ANY focus management in the toggle path? Install a focus spy on all buttons.
    var focusLog = [];
    document.addEventListener('focusin', function (e) { focusLog.push('in:' + desc(e.target)); }, true);
    document.addEventListener('focusout', function (e) { focusLog.push('out:' + desc(e.target)); }, true);
    ['dark', 'light'].forEach(function (m) {
      q('[data-mode-set="' + m + '"]').click();
      var col = q('#nav-' + m + ' [data-act="collapse"]');
      col.focus();
      focusLog.length = 0;
      // dispatch a real-ish keyboard activation: keydown Enter then click (what the UA does for <button>)
      col.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      col.click();
      r[m + '_rail'] = q('#frame').dataset.rail;
      r[m + '_collapseBtnVisible'] = vis(col);
      r[m + '_activeAfterCollapse'] = desc(document.activeElement);
      r[m + '_activeVisibleAfterCollapse'] = vis(document.activeElement);
      r[m + '_counterpartVisible'] = vis(q('#rail-' + m + ' [data-act="expand"]'));
      r[m + '_focusEventsDuringCollapse'] = focusLog.slice();
      var exp = q('#rail-' + m + ' [data-act="expand"]');
      exp.focus(); focusLog.length = 0;
      exp.click();
      r[m + '_activeAfterExpand'] = desc(document.activeElement);
      r[m + '_activeVisibleAfterExpand'] = vis(document.activeElement);
      r[m + '_focusEventsDuringExpand'] = focusLog.slice();
    });
    // 2. Control: same mechanics on a button the app DOES manage (search Escape returns focus to #psearch-btn)
    q('[data-mode-set="dark"]').click();
  } catch (e) { r.checkError = String(e); }
  window.__report(r);
  // 3. async (http/file): sample activeElement over several frames after each toggle, both directions, twice
  if (typeof requestAnimationFrame !== 'function') return;
  var seq = [], steps = [
    function () { var b = q('#nav-dark [data-act="collapse"]'); b.focus(); b.click(); return 'collapse1'; },
    function () { var b = q('#rail-dark [data-act="expand"]'); b.focus(); b.click(); return 'expand1'; },
    function () { var b = q('#nav-dark [data-act="collapse"]'); b.focus(); b.click(); return 'collapse2'; },
    function () { var b = q('#rail-dark [data-act="expand"]'); b.focus(); b.click(); return 'expand2'; }
  ];
  var i = 0;
  function next() {
    if (i >= steps.length) { r.asyncSeq = seq; window.__report(r); return; }
    var label = steps[i++]();
    setTimeout(function () {
      seq.push(label + ' +250ms active=' + desc(document.activeElement) + ' visible=' + vis(document.activeElement) + ' hasFocus=' + document.hasFocus());
      next();
    }, 250);
  }
  next();
})();
