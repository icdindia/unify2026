/* Dump every tagged node's box, relative to the frame root.
 *
 * Tag elements with data-node-id as you build. Paste this into the browser
 * console on the rendered page, then save the JSON to measured.json and diff it
 * with check_geometry.py.
 *
 * Reads boxes only -- it never mutates the page.
 */
(() => {
  const root = document.querySelector('[data-node-id]');
  if (!root) return 'no [data-node-id] found - tag your elements first';
  const r = root.getBoundingClientRect();
  const round = n => Math.round(n * 100) / 100;

  const boxes = {};
  document.querySelectorAll('[data-node-id]').forEach(el => {
    const b = el.getBoundingClientRect();
    // first win: if a node id is duplicated, keep the outermost occurrence
    const id = el.getAttribute('data-node-id');
    if (!(id in boxes)) {
      boxes[id] = [round(b.x - r.x), round(b.y - r.y), round(b.width), round(b.height)];
    }
  });

  const imgs = [...document.images];
  return JSON.stringify({
    root: root.getAttribute('data-node-id'),
    frame: [round(r.width), round(r.height)],
    images: {
      total: imgs.length,
      broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).length,
      allDataUris: imgs.every(i => i.src.startsWith('data:'))
    },
    boxes
  }, null, 1);
})()
