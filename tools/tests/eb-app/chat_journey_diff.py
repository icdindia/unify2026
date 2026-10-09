#!/usr/bin/env python3
"""Pixel diff of chat-journey screenshots against the chat-artifact reference PNGs.

    python3 chat_journey_diff.py cases.json      (cases: [{name, ref, app, masks: [[x0,y0,x1,y1], ...], diff}])

The references are Figma exports with a transparent background wherever the frame has no fill: they are composited on
bg-workspace (#fbfaf9), the colour the app paints there. A pixel differs when any channel differs by more than 40 (the
parity suite's threshold). Masked boxes (the floating review tools) never count. Prints one JSON line per case:
{name, mismatch (% of the frame), px, total, bbox} and writes a diff image (red = differs) to `diff`.
"""
import json, sys
from PIL import Image, ImageChops

WORKSPACE = (251, 250, 249, 255)
THRESHOLD = 40

for case in json.load(open(sys.argv[1])):
    out = {'name': case['name']}
    try:
        ref = Image.open(case['ref']).convert('RGBA')
        ref = Image.alpha_composite(Image.new('RGBA', ref.size, WORKSPACE), ref).convert('RGB')
        app = Image.open(case['app']).convert('RGB')
        w, h = min(ref.width, app.width), min(ref.height, app.height)
        ref, app = ref.crop((0, 0, w, h)), app.crop((0, 0, w, h))
        diff = ImageChops.difference(ref, app).convert('RGB')
        mask = Image.new('L', (w, h), 255)
        for box in case.get('masks', []):
            mask.paste(0, tuple(int(v) for v in box))
        # a pixel counts when its largest channel difference passes the threshold
        r, g, b = diff.split()
        big = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: 255 if v > THRESHOLD else 0)
        big = ImageChops.multiply(big, mask)
        n = sum(1 for v in big.getdata() if v)
        out.update(mismatch=round(100 * n / (w * h), 3), px=n, total=w * h, bbox=big.getbbox())
        if case.get('diff'):
            shade = app.convert('L').point(lambda v: v // 2 + 128).convert('RGB')
            red = Image.new('RGB', (w, h), (230, 0, 0))
            Image.composite(red, shade, big).save(case['diff'])
    except Exception as e:  # a missing PNG or a capture that failed: report it, never crash the suite
        out['error'] = str(e)
    print(json.dumps(out))
