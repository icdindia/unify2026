// v_layout_2_ : what does a click aimed at the centre of 'New Project' actually do? SYNCHRONOUS.
// Starts in light mode on the landing view (rail expanded), hit-tests the button's centre the way a real
// mouse click would be routed (elementFromPoint), clicks that element, and reports the mode before/after.
(function () {
  var r = {};
  function q(s) { return document.querySelector(s); }
  try {
    var frame = q('#frame');
    q('[data-mode-set="light"]').click();
    var nb = q('#view-projects .bbtn'), e = nb.getBoundingClientRect();
    var cx = (e.left + e.right) / 2, cy = (e.top + e.bottom) / 2, at = document.elementFromPoint(cx, cy);
    r.inner = [innerWidth, innerHeight];
    r.newProjectCentre = [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10];
    r.hitTarget = at ? (at.getAttribute('data-mode-set') ? 'demo-switch button[data-mode-set=' + at.getAttribute('data-mode-set') + ']' : at.closest('.demo-switch') ? 'demo-switch (' + at.className + ')' : at.closest('.bbtn') ? 'New Project button' : at.tagName + '.' + at.className) : null;
    r.modeBefore = frame.dataset.mode;
    if (at) at.click();
    r.modeAfter = frame.dataset.mode;
  } catch (err) { r.checkError = String(err && err.stack || err); }
  window.__report(r);
})();
