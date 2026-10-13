#!/usr/bin/env python3
"""Find and print icons from shared/icons (Figma Icons page, 2,708 icons).

  python3 tools/icon.py zap                    inline <svg> for the best match (lined first)
  python3 tools/icon.py zap --family solid     pick a family: lined | solid | lowcode | white
  python3 tools/icon.py --search arrow --limit 20      list names (family/category/name)
  python3 tools/icon.py zap --size 16          override width/height

Single-ink icons use currentColor, so colour them with `color:` (e.g. color: var(--colors-icon-icon-secondary))."""
import argparse, json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "shared", "icons")
idx = json.load(open(os.path.join(ROOT, "index.json")))
ap = argparse.ArgumentParser()
ap.add_argument("name", nargs="?")
ap.add_argument("--family", choices=["lined", "solid", "lowcode", "white"])
ap.add_argument("--search")
ap.add_argument("--limit", type=int, default=30)
ap.add_argument("--size", type=int)
a = ap.parse_args()
if a.search:
    hits = [i for i in idx if a.search.lower() in i["name"] and (not a.family or i["family"] == a.family)]
    for i in hits[:a.limit]:
        print(f'{i["family"]}/{i["category"]}/{i["name"]}')
    print(f"{len(hits)} match(es)", file=sys.stderr); sys.exit(0)
if not a.name: ap.error("name or --search required")
order = [a.family] if a.family else ["lined", "solid", "lowcode", "white"]
for fam in order:
    m = [i for i in idx if i["family"] == fam and i["name"] == a.name]
    if m:
        svg = open(os.path.join(ROOT, fam, a.name + ".svg")).read().strip()
        if a.size:
            svg = re.sub(r'width="\d+"', f'width="{a.size}"', svg, 1)
            svg = re.sub(r'height="\d+"', f'height="{a.size}"', svg, 1)
        print(svg); sys.exit(0)
sys.exit(f"no icon named {a.name!r}; try --search {a.name.split('-')[0]}")
