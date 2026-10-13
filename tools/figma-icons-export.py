#!/usr/bin/env python3
"""Download every icon in ~/unify-ds/icons/index.json as raw SVG (Figma REST images endpoint) into
~/unify-ds/icons/raw/<family>/<category>/<slug>.svg. Resumable. Token read from the figma-console config at run time."""
import json, os, re, sys, time, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

KEY = "qT9zH1YYapGTwpJxwNEGzt"
ROOT = os.path.expanduser("~/unify-ds/icons")
cfg = json.load(open(os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json")))
TOKEN = cfg["mcpServers"]["figma-console"]["env"]["FIGMA_ACCESS_TOKEN"]
idx = json.load(open(f"{ROOT}/index.json"))

def slug(s):
    s = s.strip().lower().replace("&", "and")
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-") or "icon"

def dest(o):
    fam = slug(o["path"][0]) if o["path"] else "misc"
    cat = slug(o["path"][1]) if len(o["path"]) > 1 else "all"
    return f"{ROOT}/raw/{fam}/{cat}/{slug(o['name'])}.svg"

# unique destination per id
seen = {}
for o in idx:
    d = dest(o)
    if d in seen: d = d[:-4] + "-" + o["id"].replace(":", "-") + ".svg"
    seen[d] = o
todo = {d: o for d, o in seen.items() if not os.path.exists(d)}
print(len(seen), "icons;", len(todo), "to download")

def api(ids):
    q = urllib.parse.urlencode({"ids": ",".join(ids), "format": "svg", "svg_include_id": "false", "svg_simplify_stroke": "true"})
    for attempt in range(6):
        try:
            req = urllib.request.Request(f"https://api.figma.com/v1/images/{KEY}?{q}", headers={"X-Figma-Token": TOKEN})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)["images"]
        except Exception as e:
            time.sleep(2 + attempt * 3)
    return {}

def fetch(item):
    d, url = item
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                b = r.read()
            os.makedirs(os.path.dirname(d), exist_ok=True)
            open(d, "wb").write(b)
            return True
        except Exception:
            time.sleep(1 + attempt)
    return False

items = list(todo.items())
ok = bad = 0
for i in range(0, len(items), 80):
    chunk = items[i:i + 80]
    imgs = api([o["id"] for _, o in chunk])
    jobs = [(d, imgs.get(o["id"])) for d, o in chunk if imgs.get(o["id"])]
    with ThreadPoolExecutor(8) as ex:
        res = list(ex.map(fetch, jobs))
    ok += sum(res); bad += len(chunk) - sum(res)
    print(f"{min(i + 80, len(items))}/{len(items)} ok={ok} failed={bad}", flush=True)
json.dump({d: o for d, o in seen.items()}, open(f"{ROOT}/dest-map.json", "w"))
print("done", ok, "downloaded,", bad, "failed")
