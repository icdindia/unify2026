#!/usr/bin/env python3
"""Pack the icon/logo libraries into JSON chunks (<= ~470 KB) for the Design System artifact.

  python3 tools/build-ds-icon-chunks.py <out dir>      e.g. <scratch>/ds/project/icons

Writes <family>-<n>.json ({name: svg}) and index.json ([name, family, group, chunk]) for lined, solid, lowcode,
white, misc, logos (vector only), cursor. Emoji and the 40 raster-embedding logos are skipped (hundreds of KB each)."""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
FAMS = [("lined", "shared/icons/lined", "shared/icons/index.json", "lined"), ("solid", "shared/icons/solid", "shared/icons/index.json", "solid"),
        ("lowcode", "shared/icons/lowcode", "shared/icons/index.json", "lowcode"), ("white", "shared/icons/white", "shared/icons/index.json", "white"),
        ("misc", "shared/icons/misc", "shared/icons/misc/index.json", None), ("logos", "shared/logos", "shared/logos/index.json", None),
        ("cursor", "shared/icons/cursor", "shared/icons/cursor/index.json", None)]
LIMIT, catalogue, files = 470_000, [], []
for fam, d, idxp, filt in FAMS:
    idx = json.load(open(os.path.join(ROOT, idxp)))
    items = [i for i in idx if (i.get("family") == filt if filt else True) and not i.get("raster")]
    cur, size, n = {}, 2, 1
    def flush():
        global cur, size, n
        if cur:
            json.dump(cur, open(f"{out}/{fam}-{n}.json", "w"), separators=(",", ":")); files.append(f"{fam}-{n}.json"); n += 1
        cur, size = {}, 2
    for i in items:
        path = os.path.join(ROOT, d, i["name"] + ".svg")
        if not os.path.exists(path): continue
        svg = open(path, encoding="utf-8").read().strip()
        add = len(json.dumps({i["name"]: svg})) + 2
        if add > 440_000:
            print("skipped (too large for a chunk):", fam, i["name"], add // 1024, "KB"); continue
        if size + add > LIMIT: flush()
        cur[i["name"]] = svg; size += add
        catalogue.append([i["name"], fam, i.get("category") or i.get("group") or "", f"{fam}-{n}.json"])
    flush()
json.dump(catalogue, open(f"{out}/index.json", "w"), separators=(",", ":"))
print(len(files), "chunks,", len(catalogue), "entries; largest", max(os.path.getsize(f"{out}/{f}") for f in files) // 1024, "KB")
