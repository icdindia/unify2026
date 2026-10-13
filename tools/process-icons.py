#!/usr/bin/env python3
"""Raw Figma SVGs (~/unify-ds/icons/raw/<family>/<category>/<name>.svg) -> shared/icons/<family>/<name>.svg + index.json.

Single-ink icons (lined, solid) get every colour replaced by currentColor so they theme like text.
Multicolour sets (low-code components) keep their colours. The `white` set keeps white as-is (it is the
on-dark variant of the same icons). Duplicate names inside a family are de-duplicated (identical content)
or suffixed with the category."""
import hashlib, json, os, re, shutil, sys

SRC = os.path.expanduser("~/unify-ds/icons/raw")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "shared", "icons")
FAMILY = {"lined-icons": "lined", "solid-icons": "solid", "low-code-components-icons": "lowcode", "white": "white"}
COLOUR = re.compile(r'(fill|stroke)="(#[0-9a-fA-F]{3,8}|black|white|rgb\([^)]*\))"')

def to_current(svg):
    colours = {m.group(2).lower() for m in COLOUR.finditer(svg)}
    return COLOUR.sub(lambda m: f'{m.group(1)}="currentColor"', svg), colours

shutil.rmtree(OUT, ignore_errors=True)
index, stats = [], {}
for fam_dir, fam in FAMILY.items():
    base = os.path.join(SRC, fam_dir)
    if not os.path.isdir(base): continue
    taken = {}
    for cat in sorted(os.listdir(base)):
        for f in sorted(os.listdir(os.path.join(base, cat))):
            raw = open(os.path.join(base, cat, f), encoding="utf-8").read().strip()
            name = f[:-4]
            if fam in ("lined", "solid"):
                svg, colours = to_current(raw)
                multi = len(colours - {"black", "#000", "#000000"}) > 1 and len(colours) > 2
                if multi: svg = raw          # genuinely multicolour: keep as designed
            else:
                svg, multi = raw, fam == "lowcode"
            h = hashlib.md5(svg.encode()).hexdigest()
            if name in taken:
                if taken[name] == h: continue                 # same icon listed in two categories
                name = f"{name}-{cat}"
            taken[name] = h
            os.makedirs(os.path.join(OUT, fam), exist_ok=True)
            open(os.path.join(OUT, fam, name + ".svg"), "w", encoding="utf-8").write(svg + "\n")
            m = re.search(r'viewBox="0 0 (\d+) (\d+)"', svg)
            index.append({"name": name, "family": fam, "category": cat, "size": int(m.group(1)) if m else None,
                          "multicolour": bool(multi), "bytes": len(svg)})
    stats[fam] = sum(1 for i in index if i["family"] == fam)
json.dump(index, open(os.path.join(OUT, "index.json"), "w"), indent=0)
print(stats, "total", len(index), "| bytes", sum(i["bytes"] for i in index))
