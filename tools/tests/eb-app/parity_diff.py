#!/usr/bin/env python3
"""Pixel diff of the Projects screens: the React app against prototypes/project-dashboard (the verified 1:1 HTML rebuild).

    python3 parity_diff.py <cases.json>

cases.json: [{"name", "oracle": png, "app": png, "masks": [[l, t, r, b], ...], "budget": int}]
A pixel differs when any channel differs by more than THRESHOLD (anti-aliasing stays under it). Masked rectangles (the
oracle's demo switch, the app's review bar, the oracle artboard's rounded corners) are ignored. Writes diff-<name>.png
(differing pixels white) next to the screenshots and prints one JSON line per case: {name, diff, budget, bbox, ok}.
"""
import json, pathlib, sys
from PIL import Image, ImageChops

THRESHOLD = 40
CORNERS = [(0, 0, 8, 8), (0, 892, 8, 900), (1432, 0, 1440, 8), (1432, 892, 1440, 900)]

cases = json.load(open(sys.argv[1]))
for c in cases:
    a = Image.open(c['oracle']).convert('RGB')
    b = Image.open(c['app']).convert('RGB')
    if a.size != b.size:
        print(json.dumps({'name': c['name'], 'ok': False, 'error': f'sizes differ {a.size} vs {b.size}'}))
        continue
    r, g, bl = ImageChops.difference(a, b).split()
    m = ImageChops.lighter(ImageChops.lighter(r, g), bl).point(lambda v: 255 if v > THRESHOLD else 0)
    for box in CORNERS + [tuple(int(round(v)) for v in mm) for mm in c.get('masks', [])]:
        m.paste(0, box)
    n = m.histogram()[255]
    out = pathlib.Path(c['app']).with_name(f"diff-{c['name']}.png")
    m.save(out)
    print(json.dumps({'name': c['name'], 'diff': n, 'budget': c['budget'], 'bbox': m.getbbox(), 'ok': n <= c['budget']}))
