#!/usr/bin/env python3
"""Rewrite inline font declarations in atom CSS to bind to DS type tokens.

An atom that owns its typography still must not restate px. It binds to the
generated per-style tokens, so the atom names the DS style it uses and a change
to the scale flows through. Anything with no DS equivalent is left alone and
reported, so it can be DRIFT-marked deliberately rather than silently.
"""
import json, re, sys, glob

typo = json.load(open("/Users/lisarath/unify-ds/ds/tokens/typography.json"))
WEIGHT = {"Regular":400,"Medium":500,"SemiBold":600,"Semibold":600,"Semi Bold":600,"Bold":700}
FAMVAR = {"Spectral":"--font-family-display","Geist":"--font-family-body","JetBrains Mono":"--font-family-code"}

def cls(n):
    s = re.sub(r"[^a-z0-9]+","-", n.lower().replace("/","-"))
    return re.sub(r"-+","-",s).strip("-")

# (family-var, size, weight, line-height) -> style class
lookup = {}
for name, v in typo["styles"].items():
    key = (FAMVAR.get(v.get("family","Geist"),"--font-family-body"),
           v.get("size"), WEIGHT.get(v.get("weight","Regular"),
           WEIGHT.get(str(v.get("weight","")).replace(" ",""),400)), v.get("lineHeight"))
    lookup.setdefault(key, cls(name))   # first name wins; plain styles sort before -para/-underlined

RULE = re.compile(r"(\{)([^{}]*)(\})", re.S)
P = {
 "font-family": re.compile(r"^\s*font-family:\s*var\((--font-family-[a-z]+)\);\s*$"),
 "font-size":   re.compile(r"^\s*font-size:\s*(\d+)px;\s*$"),
 "font-weight": re.compile(r"^\s*font-weight:\s*(\d+);\s*$"),
 "line-height": re.compile(r"^\s*line-height:\s*(\d+)px;\s*$"),
}

bound, unmatched = [], []

def rewrite_block(m, path):
    body = m.group(2)
    lines = body.split("\n")
    found, idx = {}, {}
    for i, ln in enumerate(lines):
        if "DRIFT" in ln:            # never touch a deliberately-flagged line
            continue
        for k, rx in P.items():
            g = rx.match(ln)
            if g:
                found[k] = g.group(1); idx[k] = i
    if len(found) < 4:
        if {"font-size","line-height"} <= set(found):
            unmatched.append((path, {k: found.get(k) for k in P}))
        return m.group(0)
    key = (found["font-family"], int(found["font-size"]), int(found["font-weight"]), int(found["line-height"]))
    style = lookup.get(key)
    if not style:
        unmatched.append((path, key)); return m.group(0)
    indent = re.match(r"\s*", lines[idx["font-family"]]).group(0)
    repl = [f"{indent}font-family: var(--{style}-font-family);",
            f"{indent}font-weight: var(--{style}-font-weight);",
            f"{indent}font-size: var(--{style}-font-size);",
            f"{indent}line-height: var(--{style}-line-height);"]
    keep = [ln for i, ln in enumerate(lines) if i not in idx.values()]
    at = min(idx.values())
    before = [ln for i, ln in enumerate(lines) if i not in idx.values() and i < at]
    after  = [ln for i, ln in enumerate(lines) if i not in idx.values() and i > at]
    bound.append((path, style))
    return m.group(1) + "\n".join(before + repl + after) + m.group(3)

for f in sorted(glob.glob("components/**/*.css", recursive=True)):
    if "preview-shell" in f: continue
    src = open(f).read()
    out = RULE.sub(lambda m: rewrite_block(m, f), src)
    if out != src:
        open(f, "w").write(out)

print(f"bound {len(bound)} rules to DS type tokens")
for f, s in bound:
    print(f"   {f:52} -> {s}")
if unmatched:
    print(f"\nNO DS STYLE ({len(unmatched)}) — leave inline and DRIFT-mark deliberately:")
    for f, k in unmatched:
        print(f"   {f}: {k}")
