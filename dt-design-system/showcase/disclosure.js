// Static ODS markup: wire the one universal behaviour (disclosure) so accordions and menus toggle.
document.addEventListener('click', function (e) {
  var b = e.target.closest('button[aria-expanded][aria-controls]');
  if (!b) return;
  var scope = b.closest('section') || document;
  var p = scope.querySelector('[id="' + b.getAttribute('aria-controls') + '"]');
  var open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(open));
  if (p) { if (open) { p.removeAttribute('hidden'); p.style.maxHeight = 'none'; p.classList.add(p.classList[1] + '--expanded'); }
           else { p.setAttribute('hidden', ''); p.style.maxHeight = '0px'; p.classList.remove(p.classList[1] + '--expanded'); } }
  b.querySelectorAll('.ODSIcon').forEach(function (i) { i.style.transform = open ? 'rotate(180deg)' : ''; });
});
