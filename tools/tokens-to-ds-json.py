#!/usr/bin/env python3
"""shared/tokens.css (light/dark blocks) -> Claude Design System tokens.json.

  python3 tools/tokens-to-ds-json.py <out tokens.json>

Keeps semantic text/border/icon/background colours and the brand/success/warning/
error/gray utility scales, with resolved light and dark values; plus spacing,
radius and the type styles from typography.css. Token name == CSS variable name."""
import json, re, sys

OUT = sys.argv[1]
css = open("shared/tokens.css").read().split("\n")
idx = [i + 1 for i, l in enumerate(css) if re.match(r"^(:root|@media)", l)]

def blk(a, b):
    d = {}
    for l in css[a - 1:b - 1]:
        m = re.match(r"\s*(--[a-z0-9-]+):\s*(.+?);", l)
        if m: d[m[1]] = m[2]
    return d

base = blk(idx[0], idx[1]); pal = blk(idx[1], idx[2])
L = blk(idx[2], idx[3]); D = {**L, **blk(idx[3], idx[4])}
# live overrides win over the generated file (light block, then dark block)
_ov = open("shared/tokens.live-overrides.css").read()
for sel, tgt in ((r':root:not\(\[data-theme="dark"\]\)\s*\{([^}]*)\}', L), (r':root\[data-theme="dark"\]\s*\{([^}]*)\}', D)):
    for body in re.findall(sel, _ov):
        for k, v in re.findall(r"(--[a-z0-9-]+):\s*([^;]+);", body):
            tgt[k] = v.strip()

def hexv(v):
    m = re.fullmatch(r"rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)", v.strip())
    if not m: return v
    r, g, b = map(int, m.groups()[:3]); a = float(m[4])
    return "#%02x%02x%02x" % (r, g, b) + ("" if a >= 1 else "%02x" % round(a * 255))

def res(v, th):
    for _ in range(20):
        m = re.fullmatch(r"var\((--[a-z0-9-]+)\)", v.strip())
        if not m: break
        v = th.get(m[1]) or L.get(m[1]) or pal.get(m[1]) or base.get(m[1]) or v
    return hexv(v)

keep = re.compile(r"^--colors-(text|border|icon|background)-|^--colors-utility-(brand|brand-secondary|success|warning|error|gray)-utility-\2-(25|50|100|200|300|400|500|600|700|800|900|950)$")
toks = []
for k in L:
    if not keep.match(k): continue
    a, b = res(L[k], L), res(D.get(k, L[k]), D)
    if a.startswith("#") and b.startswith("#"):
        toks.append({"name": k[2:], "value": {"light": a, "dark": b},
                     "usage": "Semantic %s token, theme-aware; use via var(%s)." % (k.split("-")[2], k)})

ty = open("shared/typography.css").read()
def style(pre):
    g = lambda s: re.search(r"--%s-%s:\s*([^;]+);" % (pre, s), ty)
    if not g("font-size"): return None
    lh = g("line-height")
    return {"name": pre, "fontSize": g("font-size")[1].strip(), "lineHeight": lh[1].strip() if lh else "1.4",
            "fontWeight": int(g("font-weight")[1])}
disp = [style(p) for p in ["display-sm-medium", "display-xs-medium"]]
text = [style(f"text-{s}-{w}") for s in ["xl", "lg", "md", "sm", "xs", "xxs", "xxxs"] for w in ["regular", "medium", "semibold"]]
sp = [{"name": k[2:], "value": v, "usage": "Spacing step."} for k, v in base.items() if k.startswith("--spacing-") and v != "0px"]
rd = [{"name": k[2:], "value": v, "usage": "Radius."} for k, v in base.items()
      if k.startswith("--radius-") and v != "0px" and k not in ("--radius-lg", "--radius-xl", "--radius-2xl")]
t = {"name": "UnifyApps Platform", "version": 1,
     "color": {"themes": [{"id": "light", "name": "Light"}, {"id": "dark", "name": "Dark"}], "tokens": toks},
     "type": {"fonts": [], "families": {
         "display": "\"Spectral\", Georgia, \"Times New Roman\", serif",
         "body": "\"Geist\", \"Inter\", system-ui, -apple-system, sans-serif",
         "code": "\"JetBrains Mono\", \"SFMono-Regular\", Menlo, Consolas, monospace"},
         "groups": [{"name": "Display", "family": "display", "styles": [s for s in disp if s]},
                    {"name": "Text", "family": "body", "styles": [s for s in text if s]}]},
     "spacing": {"tokens": sp}, "radius": {"tokens": rd}}
json.dump(t, open(OUT, "w"), indent=1)
print(f"{len(toks)} colours, {len(sp)} spacing, {len(rd)} radius -> {OUT}")
