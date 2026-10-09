/* DOM → Figma extractor for the DT design system component previews.
   Runs inside dt-design-system/dev/index.html (tokens.css + bundle.css loaded, light theme).
   For each component: render its preview, walk every story block, and emit a compact tree:
     {n:name, s:[{label, w, h, tree}]}
   tree node: {t:'f'|'x'|'v'|'i', x,y,w,h, ...}
     f = frame   fill, stroke{w:[t,r,b,l],c}, r:[tl,tr,br,bl], clip, op, kids
     x = text    text, fs, fw, lh, ls, c, al, up(uppercase), wrap
     v = svg     svg (currentColor resolved to a colour ref)
     i = image   (placeholder rect)
   Colours are refs: {k:'token-name'} when the rendered value matches a DT light token, else {h:'#rrggbb', a:alpha}.
*/
(function () {
  const TOK = window.__DT_TOKENS__; // {rgbaKey: [token names]} built by the caller from tokens.css
  const hex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  function parse(c) {
    const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function col(c, role) {
    const p = parse(c); if (!p || p.a === 0) return null;
    const key = hex(p.r, p.g, p.b) + (p.a < 1 ? '@' + Math.round(p.a * 100) : '');
    const names = TOK[key] || [];
    if (names.length) {
      const pref = role === 'text' ? /text|link/ : role === 'stroke' ? /stroke|focus/ : /background|accent|shades|state|neutral|functional|overlay/;
      const best = names.find(n => pref.test(n)) || names.find(n => !/brand\//.test(n)) || names[0];
      return { k: best };
    }
    return { h: hex(p.r, p.g, p.b), a: +p.a.toFixed(3) };
  }
  const px = v => parseFloat(v) || 0;
  let count = 0; const MAX = 700;

  function visual(cs) {
    const bg = col(cs.backgroundColor, 'bg');
    const bw = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)].map((w, i) => ([cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle][i] === 'none' ? 0 : w));
    const bc = bw.some(w => w > 0) ? col([cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor][bw.findIndex(w => w > 0)], 'stroke') : null;
    const r = [px(cs.borderTopLeftRadius), px(cs.borderTopRightRadius), px(cs.borderBottomRightRadius), px(cs.borderBottomLeftRadius)];
    return { bg, bw, bc, r };
  }

  const isODS = el => typeof el.className === 'string' ? /(^|\s)ODS/.test(el.className) : !!(el.className && /(^|\s)ODS/.test(el.className.baseVal));
  function walk(el, ox, oy, out, inODS) {
    if (count > MAX) return;
    inODS = inODS || isODS(el);
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const rect = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    // collapsed containers: zero-size and clipping (or aria-hidden) render nothing in the browser
    if ((rect.height < 0.5 || rect.width < 0.5) && (cs.overflow !== 'visible' || el.getAttribute('aria-hidden') === 'true')) return;
    const base = { x: +(rect.x - ox).toFixed(1), y: +(rect.y - oy).toFixed(1), w: +rect.width.toFixed(1), h: +rect.height.toFixed(1) };

    if (tag === 'svg') {
      if (rect.width < 1 || rect.height < 1 || (!inODS && Math.max(rect.width, rect.height) < 64)) return;
      const c = col(cs.color, 'text');
      const clone = el.cloneNode(true);
      clone.setAttribute('width', rect.width); clone.setAttribute('height', rect.height);
      clone.removeAttribute('class'); clone.removeAttribute('style');
      let s = clone.outerHTML.replace(/currentColor/g, '#000000');
      out.push(Object.assign({ t: 'v', svg: s, c }, base)); count++; return;
    }
    if (tag === 'img') {
      // rendered canvases (charts) arrive as data-URI PNGs inside non-ODS wrappers: keep them as real images
      const src = el.currentSrc || el.src || '';
      if (/^data:image\/(png|jpe?g);base64,/.test(src)) { out.push(Object.assign({ t: 'i', src }, base)); count++; return; }
      if (!inODS) return; out.push(Object.assign({ t: 'i' }, base)); count++; return; }

    const v = visual(cs);
    const kids = [];
    // CSS border shapes (triangles/carets): sides with different colours, some transparent → draw each coloured side as its polygon
    if (inODS) {
      const sideCols = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor];
      const vis = sideCols.map((c, i) => v.bw[i] > 0 && (parse(c) || { a: 0 }).a > 0);
      const anyTransparentWidth = v.bw.some((w, i) => w > 0 && !vis[i]);
      if (vis.some(Boolean) && anyTransparentWidth) {
        const W = rect.width, H = rect.height, [bt, br, bb, bl] = v.bw;
        const ix0 = bl, iy0 = bt, ix1 = W - br, iy1 = H - bb;
        const polys = [
          [[0, 0], [W, 0], [ix1, iy0], [ix0, iy0]],   // top
          [[W, 0], [W, H], [ix1, iy1], [ix1, iy0]],   // right
          [[0, H], [W, H], [ix1, iy1], [ix0, iy1]],   // bottom
          [[0, 0], [0, H], [ix0, iy1], [ix0, iy0]],   // left
        ];
        let paths = '';
        polys.forEach((p, i) => { if (vis[i]) paths += '<path d="M' + p.map(q => q.map(n => +n.toFixed(2)).join(' ')).join('L') + 'Z" fill="#000000"/>'; });
        const firstVis = vis.findIndex(Boolean);
        out.push(Object.assign({ t: 'v', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' + paths + '</svg>', c: col(sideCols[firstVis], 'stroke'), shape: 1 }, base));
        count++;
        v.bw = [0, 0, 0, 0]; // borders consumed by the shape
      }
    }
    // pseudo elements that paint (ODS uses ::before for field borders)
    for (const pse of ['::before', '::after']) {
      const p = getComputedStyle(el, pse);
      if (!p || p.content === 'none' || p.display === 'none') continue;
      const pv = visual(p);
      if (inODS && (pv.bg || pv.bw.some(w => w > 0))) {
        const pw = px(p.width) || rect.width, ph = px(p.height) || rect.height;
        const pl = p.position === 'absolute' ? px(p.left) : 0, pt = p.position === 'absolute' ? px(p.top) : 0;
        kids.push({ t: 'f', x: pl, y: pt, w: +pw.toFixed(1), h: +ph.toFixed(1), fill: pv.bg, sw: pv.bw, sc: pv.bc, r: pv.r, name: pse.slice(2) }); count++;
      }
    }
    // text nodes
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !inODS) continue;
      const txt = n.textContent.replace(/\s+/g, ' ');
      if (!txt.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      const rr = range.getBoundingClientRect(); if (rr.width < 1) continue;
      const lines = range.getClientRects().length;
      kids.push({ t: 'x', x: +(rr.x - rect.x).toFixed(1), y: +(rr.y - rect.y).toFixed(1), w: +rr.width.toFixed(1), h: +rr.height.toFixed(1),
        text: txt.trim(), fs: px(cs.fontSize), fw: +cs.fontWeight, lh: cs.lineHeight === 'normal' ? null : px(cs.lineHeight), ls: px(cs.letterSpacing),
        c: col(cs.color, 'text'), al: cs.textAlign, up: cs.textTransform === 'uppercase', ul: cs.textDecorationLine.includes('underline'), wrap: lines > 1 }); count++;
    }
    // form controls: show value / placeholder
    if ((tag === 'input' || tag === 'textarea') && !['checkbox', 'radio', 'range', 'hidden'].includes(el.type)) {
      const val = el.value || el.placeholder;
      const pc = el.value ? cs.color : getComputedStyle(el, '::placeholder').color;
      const pa = (pc.match(/rgba?\(([^)]+)\)/) || [0, '0,0,0,0'])[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
      if (val && inODS && !(pa.length > 3 && pa[3] === 0)) {
        kids.push({ t: 'x', x: px(cs.paddingLeft) + px(cs.borderLeftWidth), y: +((rect.height - px(cs.lineHeight || cs.fontSize)) / 2).toFixed(1), w: +(rect.width - px(cs.paddingLeft) - px(cs.paddingRight)).toFixed(1), h: px(cs.lineHeight) || px(cs.fontSize) * 1.25,
          text: val, fs: px(cs.fontSize), fw: +cs.fontWeight, lh: cs.lineHeight === 'normal' ? null : px(cs.lineHeight), ls: px(cs.letterSpacing), c: col(pc, 'text'), al: 'left', up: false, wrap: false }); count++;
      }
    }
    for (const c of el.children) walk(c, rect.x, rect.y, kids, inODS);

    const bgi = (cs.backgroundImage.match(/url\("?(data:image\/(?:png|jpe?g);base64,[^")]+)/) || [])[1];
    const paints = (inODS && (v.bg || v.bw.some(w => w > 0))) || !!bgi;
    const clip = cs.overflow === 'hidden' || cs.overflow === 'clip';
    const op = +cs.opacity;
    if (!paints && !clip && op === 1) {
      // pass-through wrapper: lift children into the parent's coordinate space
      for (const k of kids) { k.x = +(k.x + base.x).toFixed(1); k.y = +(k.y + base.y).toFixed(1); out.push(k); }
      return;
    }
    count++;
    out.push(Object.assign({ t: 'f', bgi, fill: v.bg, sw: v.bw, sc: v.bc, r: v.r, clip, op: op < 1 ? op : undefined, kids, name: (el.className && el.className.baseVal === undefined ? String(el.className).split(' ').find(c => /^ODS/.test(c) && c.includes('-')) || String(el.className).split(' ').find(c => /^ODS/.test(c)) : '') || tag }, base));
  }

  window.__dtExtract = function (name, maxStories) {
    const out = { n: name, s: [] };
    const blocks = [...document.querySelectorAll('.dt-pv > section')].slice(0, maxStories || 4);
    for (const b of blocks) {
      const label = (b.querySelector('.dt-pv-label') || {}).textContent || 'Default';
      const stage = b.querySelector('.dt-pv-stage');
      const sr = stage.getBoundingClientRect();
      count = 0; const kids = [];
      for (const c of stage.children) walk(c, sr.x, sr.y, kids);
      // tight bounds from what actually paints (frames with paint, text, svg, images); wrappers were already lifted
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const acc = (n, ox, oy) => { const x = ox + n.x, y = oy + n.y; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x + n.w); maxY = Math.max(maxY, y + n.h); if (n.t === 'f' && !n.clip) (n.kids || []).forEach(k => acc(k, x, y)); };
      kids.forEach(k => acc(k, 0, 0));
      if (!isFinite(minX)) continue;
      kids.forEach(k => { k.x = +(k.x - minX).toFixed(1); k.y = +(k.y - minY).toFixed(1); });
      out.s.push({ label: label.trim(), w: Math.ceil(maxX - minX), h: Math.ceil(maxY - minY), tree: kids, truncated: count > MAX });
    }
    return out;
  };
})();
