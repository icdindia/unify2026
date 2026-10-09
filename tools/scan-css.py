#!/usr/bin/env python3
"""Comment-aware CSS scan. Grep can't tell a hex in a doc comment from a hex in
a declaration, which produced false failures on the DRIFT header blocks. This
strips /* ... */ first, then reports only real declarations."""
import re, sys, glob, os

def strip_comments(src):
    # keep line count stable so reported line numbers stay true
    out, i, n = [], 0, len(src)
    while i < n:
        if src.startswith("/*", i):
            j = src.find("*/", i + 2)
            j = n if j == -1 else j + 2
            out.append("".join(ch if ch == "\n" else " " for ch in src[i:j]))
            i = j
        else:
            out.append(src[i]); i += 1
    return "".join(out)

HEX  = re.compile(r'#[0-9a-fA-F]{3,8}\b')
PRIM = re.compile(r'var\(\s*(--palette-[a-z0-9-]+)')

# --- raw geometry that should be a token -------------------------------------
# Build the spacing/radius scale from the generated token file.
_tok = open("shared/tokens.css").read()
_cut = _tok.index("/* ---- palette primitives")
SCALE = {}
for _n, _v in re.findall(r'^\s*(--(?:spacing|radius|button)[a-z0-9-]*):\s*(\d+)px;', _tok[:_cut], re.M):
    SCALE.setdefault(int(_v), []).append(_n)

# Properties where a literal px is a spacing/radius decision -> must be a token.
SPACING_PROP = re.compile(
    r'(?:^|[;{]|\A)\s*(padding|padding-[a-z]+|margin|margin-[a-z]+|gap|row-gap|column-gap)\s*:', re.I)
RADIUS_PROP  = re.compile(r'(?:^|[;{]|\A)\s*(border-radius|border-[a-z]+-radius)\s*:', re.I)

# Properties where a literal px is a TYPE decision -> must bind a type token.
TYPE_PROP = re.compile(r'(?:^|[;{]|\A)\s*(font-size|line-height|letter-spacing)\s*:', re.I)

# NEVER suggest a --spacing-* token for a font size. 12/16/20/24/32 appear in
# both scales and that equality is a coincidence, not a relationship: the two
# scales are authored independently and move independently. Cross-wiring them
# is how a type change silently reflows layout (and vice versa).
PX = re.compile(r'(?<![\w.-])(\d+)px')

fails, warns = [], []
for f in sorted(sys.argv[1:]):
    raw = open(f).read()
    code = strip_comments(raw)
    raw_lines = raw.splitlines()
    for i, line in enumerate(code.splitlines(), 1):
        original = raw_lines[i-1] if i-1 < len(raw_lines) else ""
        drift = "DRIFT" in original
        for m in HEX.finditer(line):
            (warns if drift else fails).append((f, i, f"raw hex {m.group(0)}", drift))
        for m in PRIM.finditer(line):
            (warns if drift else fails).append((f, i, f"palette primitive {m.group(1)}", drift))

        for prop_rx, family, label in ((SPACING_PROP, "--spacing-", "spacing"),
                                       (RADIUS_PROP,  "--radius-",  "radius")):
            if not prop_rx.search(line):
                continue
            for m in PX.finditer(line):
                px = int(m.group(1))
                if px == 0:
                    continue
                toks = [t for t in SCALE.get(px, []) if t.startswith(family)]
                if toks:
                    (warns if drift else fails).append(
                        (f, i, f"raw {px}px in a {label} property -> use var({toks[0]})", drift))
                elif not drift:
                    fails.append((f, i, f"raw {px}px in a {label} property, off the DS {label} scale "
                                        f"-> put a DRIFT marker on THIS line, or use the nearest token", False))

        if TYPE_PROP.search(line):
            for m in PX.finditer(line):
                px = int(m.group(1))
                if px == 0 or drift:
                    continue
                fails.append((f, i, f"raw {px}px type value -> bind a DS type token "
                                    f"(e.g. var(--text-sm-regular-font-size)); never a --spacing-* token", False))

for f, i, msg, _ in fails:
    print(f"FAIL {f}:{i} {msg}")
for f, i, msg, _ in warns:
    print(f"WARN {f}:{i} {msg} (DRIFT-flagged on line)")
sys.exit(1 if fails else 0)
