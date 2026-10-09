/* Routine Status Dot — interaction layer.
   The artboard scales to the window. The switch turns the dots' pulse on and off
   (off = the dot exactly as designed). Hovering or focusing a generating row shows what its dot means.
   ?ref=1 renders the designed state at 1:1 with no chrome, for the pixel diff. */
(function () {
  'use strict';
  var frame = document.getElementById('frame');
  var fit = document.querySelector('.fit');
  var q = new URLSearchParams(location.search);
  var ref = q.get('ref') === '1';
  var NARROW = 720;   // below this width only the rail is shown, at a readable size
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scale the artboard into the window (16px gutter). The stage is sized to the scaled artboard so the page never
  // overflows (focus would otherwise scroll the clipped container). ref mode is 1:1 from the top-left.
  var stage = document.getElementById('stage');
  function scale() {
    var k = 1, narrow = false, w = 1440;
    if (!ref) {
      narrow = fit.clientWidth < NARROW;
      w = narrow ? 280 : 1440;
      var reserve = narrow ? 48 : 0;   // narrow leaves room for the switch below the rail
      k = Math.max(0.1, Math.min((fit.clientWidth - 32) / w, (fit.clientHeight - 32 - reserve) / 900, 2));
      fit.style.paddingBottom = (16 + reserve) + 'px';
    }
    if (narrow) { frame.setAttribute('data-narrow', ''); fit.setAttribute('data-narrow', ''); }
    else { frame.removeAttribute('data-narrow'); fit.removeAttribute('data-narrow'); }
    stage.style.width = w * k + 'px'; stage.style.height = 900 * k + 'px';
    frame.style.transform = ref ? 'none' : 'scale(' + k + ')';
  }
  if (ref) { fit.setAttribute('data-ref', ''); fit.style.padding = '0'; fit.style.alignItems = 'flex-start'; fit.style.justifyContent = 'flex-start'; }
  window.addEventListener('resize', scale); scale();

  // animation switch
  var sw = document.getElementById('ctl-sw');
  function setMotion(on) {
    frame.setAttribute('data-motion', on ? 'on' : 'off');
    sw.setAttribute('aria-checked', on ? 'true' : 'false');
  }
  setMotion(q.get('motion') === 'on' || (!ref && !reduce)); // ?motion=on keeps the dot moving in ref mode (frame grabs)
  sw.addEventListener('click', function () { setMotion(sw.getAttribute('aria-checked') !== 'true'); });

  // tooltip on any generating row: placed at the row's centre, in artboard pixels
  var tip = document.getElementById('gen-tip');
  function show(row) {
    var r = row.getBoundingClientRect(), f = frame.getBoundingClientRect(), k = f.width / frame.offsetWidth;
    tip.style.top = ((r.top + r.height / 2 - f.top) / k) + 'px';
    tip.hidden = false;
  }
  function hide() { tip.hidden = true; }
  [].forEach.call(document.querySelectorAll('.xhist--gen'), function (row) {
    row.addEventListener('mouseenter', function () { show(row); }); row.addEventListener('mouseleave', hide);
    row.addEventListener('focus', function () { show(row); }); row.addEventListener('blur', hide);
    row.addEventListener('touchstart', function () { if (tip.hidden) show(row); else hide(); }, { passive: true });   // touch has no hover
  });
})();
