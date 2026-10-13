#!/usr/bin/env python3
"""found2 export: logos, misc icons, emoji, cursors -> shared/logos, shared/icons/{misc,emoji,cursor}. Token read from figma-console config at run time (never printed)."""
import json, os, re, sys, time, urllib.request, urllib.parse, collections
from concurrent.futures import ThreadPoolExecutor
KEY = "qT9zH1YYapGTwpJxwNEGzt"
R = "/Users/lisarath/Unify2026/shared"
cfg = json.load(open(os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json")))
TOKEN = cfg["mcpServers"]["figma-console"]["env"]["FIGMA_ACCESS_TOKEN"]
H = {"X-Figma-Token": TOKEN}

def get(url):
    for a in range(5):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=120).read()
        except Exception:
            time.sleep(2 + a * 3)
    return None

def slug(s):
    s = s.strip().lower().replace("&", "and").replace("+", "-plus-")
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-") or "x"

def props(n):
    return dict(p.split("=", 1) for p in n.split(", ") if "=" in p)

IDS = "8058:40531,41186:34869,10875:4238,11874:1597,1294:159565,1457:244804,1107:70094,1142:83268,6452:229238,72295:32465,43213:12125,43213:12124,25672:63430,59694:7990,1054:558"
nodes = json.loads(get(f"https://api.figma.com/v1/files/{KEY}/nodes?ids={IDS}&depth=5"))["nodes"]
D = {k: v["document"] for k, v in nodes.items()}

items = []  # (folder, group, name, id, kind)
def add(folder, group, name, nid, multi=True): items.append(dict(folder=folder, group=group, name=slug(name), id=nid, multi=multi))

for c in D["8058:40531"]["children"]:
    p = props(c["name"]); add("logos", "client-logos", f"client-{p['Company']}-{p['Type']}", c["id"])
for c in D["41186:34869"]["children"]:
    p = props(c["name"]); add("logos", "unify", f"unify-{p['Type']}", c["id"])
for key, suf in (("10875:4238", ""), ("11874:1597", "-on-dark")):
    for i, c in enumerate(D[key]["children"]):
        w = round(c["absoluteBoundingBox"]["width"]); add("logos", "favicon", f"favicon{suf}-{i+1}-{w}", c["id"])
for c in D["1294:159565"]["children"]:
    p = props(c["name"]); add("logos", "fictional-company", f"fictional-{p['Company']}-{'logotype' if p['Logotype']=='True' else 'mark'}{'-white' if p.get('White')=='True' else ''}", c["id"])
for c in D["72295:32465"]["children"][0]["children"]:
    add("logos", "company-logos", "company-" + props(c["name"])["Type"], c["id"])
for c in D["25672:63430"]["children"]:
    p = props(c["name"]); add("logos", "featured-logo", f"featured-logo-{p['Size']}-{p['Color']}", c["id"])
for c in D["1457:244804"]["children"]:
    p = props(c["name"]); add("icons/misc", "social", f"social-{p['Platform']}-{p['Style']}" + ("" if p.get("State", "Default") == "Default" else "-" + p["State"]), c["id"], p["Style"] == "Brand")
for c in D["1107:70094"]["children"]:
    add("icons/misc", "country", "flag-" + c["name"], c["id"])
for c in D["1142:83268"]["children"]:
    p = props(c["name"])
    if p["Size"] == "md": add("icons/misc", "payment", f"payment-{p['Payment method']}", c["id"])
for fr in D["6452:229238"]["children"]:
    g = slug(fr["name"].split("/")[-1])
    for c in fr.get("children", []):
        add("icons/misc", "integration-" + g, f"integration-{g}-{c['name'].lstrip('_')}", c["id"])
for c in D["43213:12125"]["children"]:
    p = props(c["name"])
    if p["Size"] == "sm": add("icons/misc", "file-type-solid", f"file-type-solid-{p['File type']}", c["id"])
for c in D["43213:12124"]["children"]:
    p = props(c["name"]); add("icons/misc", "file-type-simple", f"file-type-simple-{p.get('Property 2', p['File type'])}", c["id"])
for sec in D["59694:7990"]["children"]:
    for g in sec["children"]:
        if g["type"] == "FRAME":
            for c in g.get("children", []):
                add("icons/emoji", slug(sec["name"]), f"emoji-{sec['name']}-{c['name']}", c["id"])
for c in D["1054:558"]["children"]:
    add("icons/cursor", "cursor", "cursor-" + props(c["name"])["State"], c["id"])

# unique names per folder
seen = collections.Counter()
for it in items:
    k = (it["folder"], it["name"]); seen[k] += 1
    if seen[k] > 1: it["name"] += f"-{seen[k]}"
print(collections.Counter(i["folder"] for i in items), len(items), flush=True)

def api(ids):
    q = urllib.parse.urlencode({"ids": ",".join(ids), "format": "svg", "svg_include_id": "false", "svg_simplify_stroke": "true"})
    b = get(f"https://api.figma.com/v1/images/{KEY}?{q}")
    return json.loads(b)["images"] if b else {}
def fetch(a):
    it, url = a
    if not url: return it, None
    return it, get(url)

COL = re.compile(r'(fill|stroke)="(#[0-9a-fA-F]{3,8}|black|white|rgb\([^)]*\))"')
results = []
for i in range(0, len(items), 60):
    ch = items[i:i + 60]
    imgs = api([x["id"] for x in ch])
    with ThreadPoolExecutor(8) as ex:
        for it, b in ex.map(fetch, [(x, imgs.get(x["id"])) for x in ch]):
            if not b: results.append((it, None)); continue
            results.append((it, b.decode("utf-8", "replace")))
    print(i + len(ch), flush=True)

idx = collections.defaultdict(list); failed = []
for it, svg in results:
    if not svg or "<svg" not in svg: failed.append(it["name"]); continue
    svg = svg.strip()
    cols = {m.group(2).lower() for m in COL.finditer(svg)}
    single = (not it["multi"]) and len(cols) <= 1 and "<image" not in svg
    if single: svg = COL.sub(lambda m: f'{m.group(1)}="currentColor"', svg)
    d = os.path.join(R, it["folder"]); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, it["name"] + ".svg"), "w", encoding="utf-8").write(svg + "\n")
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    idx[it["folder"]].append({"name": it["name"], "group": it["group"], "figma": it["id"], "w": float(m.group(1)) if m else None, "h": float(m.group(2)) if m else None, "multicolour": not single, "raster": "<image" in svg, "bytes": len(svg)})
for f, l in idx.items():
    json.dump(l, open(os.path.join(R, f, "index.json"), "w"), indent=0)
    print(f, len(l), "raster:", sum(x["raster"] for x in l), "currentColor:", sum(not x["multicolour"] for x in l))
print("failed", failed)
