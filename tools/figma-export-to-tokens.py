#!/usr/bin/env python3
"""Convert a Figma variables export (figma-variables.json, DTCG-ish, one object per
collection) into the intermediate JSONs tools/gen-tokens.py reads, then run it.

  python3 tools/figma-export-to-tokens.py [export.json] [--out shared/tokens.css]

Flow:  Figma plugin export -> ~/unify-ds/ds/tokens/figma-variables.json
       -> this script -> <scratch>/{colors,semantic,spacing,radius,typography}.json
       -> gen-tokens.py (TOKENS_SRC / TOKENS_OUT) -> shared/tokens.css
typography.json is kept from the existing source (the export has no text styles)."""
import json, os, re, shutil, subprocess, sys, tempfile

HOME = os.path.expanduser("~")
argv = sys.argv[1:]
if "--out" in argv:
    i = argv.index("--out"); del argv[i:i + 2]
args = [a for a in argv if not a.startswith("--")]
EXPORT = args[0] if args else f"{HOME}/unify-ds/ds/tokens/figma-variables.json"
OUT = (sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv
       else "/Users/lisarath/Unify2026/shared/tokens.css")
SRC_OLD = f"{HOME}/unify-ds/ds/tokens"
KEY = "qT9zH1YYapGTwpJxwNEGzt"

def strip(t):
    """{$value,...} leaves -> bare values; groups stay dicts."""
    if isinstance(t, dict):
        if "$value" in t:
            return t["$value"]
        return {k: strip(v) for k, v in t.items()}
    return t

cols = {}
for c in json.load(open(EXPORT)):
    for name, v in c.items():
        cols[name] = v["modes"]

meta = {"description": "Regenerated from Figma variables export", "source_file_key": KEY,
        "source": os.path.basename(EXPORT)}
tmp = tempfile.mkdtemp(prefix="tokens-src-")

prim = strip(cols["_Primitives"]["Style"])
json.dump({"_meta": meta, **{k: v for k, v in prim.items() if k == "Palette"}},
          open(f"{tmp}/colors.json", "w"), indent=1)

colors = cols["1. Colors"]
json.dump({"_meta": meta, "1. Colors": {"modes": {m: strip(t) for m, t in colors.items()}}},
          open(f"{tmp}/semantic.json", "w"), indent=1)

def px_of(val):
    """number, or alias like {Spacing.2 (8px)} / {Spacing.0․5 (2px)} -> px."""
    if isinstance(val, (int, float)):
        return val
    m = re.search(r"\((\d[\d,\.]*)px\)", val or "")
    if m:
        return float(m.group(1).replace(",", "")) if "." in m.group(1) else int(m.group(1).replace(",", ""))
    m = re.fullmatch(r"\{(.+)\}", val)
    if m:                                     # alias to another float: walk the primitives
        node = prim
        for part in m.group(1).split("."):
            node = node[part]
        return px_of(node)
    raise ValueError(val)

def flat(tree, path=()):
    for k, v in tree.items():
        if isinstance(v, dict): yield from flat(v, path + (k,))
        else: yield path + (k,), v

sp = strip(cols["3. Spacing"]["Mode 1"])
spacing_base = {}
for p, v in flat(sp):
    if len(p) == 1 and p[0].startswith("spacing-"):
        spacing_base[p[0]] = px_of(v)
json.dump({"_meta": meta, "Spacing": {"Base": spacing_base,
          "Components": {"/".join(p): px_of(v) for p, v in flat(sp) if len(p) > 1}}},
          open(f"{tmp}/spacing.json", "w"), indent=1)

rd = strip(cols["2. Radius"]["Default"])
radius_base = {k: px_of(v) for k, v in rd.items() if k.startswith("radius-")}
json.dump({"_meta": meta, "Radius": {"Base": radius_base,
          "Components": {"Button": dict(rd.get("Button", {}))}}},
          open(f"{tmp}/radius.json", "w"), indent=1)

shutil.copy(f"{SRC_OLD}/typography.json", f"{tmp}/typography.json")
env = dict(os.environ, TOKENS_SRC=tmp, TOKENS_OUT=OUT)
subprocess.check_call([sys.executable, os.path.join(os.path.dirname(__file__), "gen-tokens.py")], env=env)
print("scratch:", tmp)
