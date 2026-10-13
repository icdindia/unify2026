#!/usr/bin/env python3
"""List every icon component on the Figma Icons page (REST) -> ~/unify-ds/icons/index.json.
Reads FIGMA_ACCESS_TOKEN from the figma-console entry of the Claude desktop config at run time (never printed)."""
import json, os, sys, urllib.request

KEY, PAGE = "qT9zH1YYapGTwpJxwNEGzt", "3463:407484"
cfg = json.load(open(os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json")))
TOKEN = cfg["mcpServers"]["figma-console"]["env"]["FIGMA_ACCESS_TOKEN"]

def get(url):
    req = urllib.request.Request(url, headers={"X-Figma-Token": TOKEN})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)

data = get(f"https://api.figma.com/v1/files/{KEY}/nodes?ids={PAGE}&geometry=none")
page = data["nodes"][PAGE]["document"]
out = []
def walk(n, path):
    t = n.get("type")
    if t in ("COMPONENT",):
        bb = n.get("absoluteBoundingBox") or {}
        out.append({"id": n["id"], "name": n["name"], "path": path, "w": bb.get("width"), "h": bb.get("height")})
        return
    if t == "COMPONENT_SET":
        for c in n.get("children", []):
            out.append({"id": c["id"], "name": n["name"] + "/" + c["name"], "path": path, "w": (c.get("absoluteBoundingBox") or {}).get("width"), "h": (c.get("absoluteBoundingBox") or {}).get("height")})
        return
    for c in n.get("children", []) or []:
        walk(c, path + [n["name"]] if t in ("FRAME", "SECTION", "GROUP") else path)
walk(page, [])
json.dump(out, open(os.path.expanduser("~/unify-ds/icons/index.json"), "w"), indent=0)
from collections import Counter
print(len(out), "components")
for k, v in Counter("/".join(o["path"][:2]) for o in out).most_common(40):
    print(f"{v:5d}  {k}")
