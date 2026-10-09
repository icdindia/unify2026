import json, re, os

SRC = "/Users/lisarath/unify-ds/ds/tokens"
OUT = "/Users/lisarath/Unify2026/shared/tokens.css"

colors    = json.load(open(f"{SRC}/colors.json"))
semantic  = json.load(open(f"{SRC}/semantic.json"))
spacing   = json.load(open(f"{SRC}/spacing.json"))
radius    = json.load(open(f"{SRC}/radius.json"))
typo      = json.load(open(f"{SRC}/typography.json"))

def varname(path):
    """Figma variable path -> css custom property name. Mirrors get_variable_defs keys."""
    s = "-".join(path)
    s = s.lower()
    s = s.replace("(", "").replace(")", "")
    s = re.sub(r"[\s/_.]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return f"--{s}"

def walk(node, prefix=()):
    for k, v in node.items():
        if k == "_meta":
            continue
        if isinstance(v, dict):
            yield from walk(v, prefix + (k,))
        else:
            yield prefix + (k,), v

# ---- palette lookup: {Palette.Gray (light mode).900} -> hex
palette_flat = {}
for path, val in walk(colors):
    palette_flat[".".join(path)] = val

ALIAS = re.compile(r"^\{(.+)\}$")

def resolve(val, depth=0):
    if depth > 10 or not isinstance(val, str):
        return val
    m = ALIAS.match(val.strip())
    if not m:
        return val
    key = m.group(1)
    if key in palette_flat:
        return resolve(palette_flat[key], depth + 1)
    # tolerate keys written without the leading "Palette."
    if f"Palette.{key}" in palette_flat:
        return resolve(palette_flat[f"Palette.{key}"], depth + 1)
    tail = key.split(".")[-1]
    for pk, pv in palette_flat.items():
        if pk.endswith("." + tail):
            return resolve(pv, depth + 1)
    return None

def emit_mode(mode_name):
    """Resolve one mode. Palette aliases -> literal hex. Semantic->semantic
    aliases -> var() reference, so the dark override of the *target* keeps
    flowing through instead of being frozen at generation time."""
    tree = semantic["1. Colors"]["modes"][mode_name]
    sem_paths = {}
    for path, val in walk(tree):
        sem_paths[".".join(path)] = path

    lines, unresolved = [], []
    for path, val in walk(tree):
        name = varname(path)
        m = ALIAS.match(val.strip()) if isinstance(val, str) else None
        if m and m.group(1) in sem_paths:
            lines.append(f"  {name}: var({varname(sem_paths[m.group(1)])});")
            continue
        hexval = resolve(val)
        if hexval is None:
            unresolved.append((name, val)); continue
        lines.append(f"  {name}: {hexval};")
    return lines, unresolved

light, unres_l = emit_mode("Light mode")
dark,  unres_d = emit_mode("Dark mode")

# ---- palette primitives (kept separate: components must NOT reach for these)
pal_lines = [f"  {varname(p)}: {v};" for p, v in walk(colors)]

# ---- spacing / radius
sp_lines = []
for path, v in walk(spacing["Spacing"]["Base"], ()):
    sp_lines.append(f"  {varname(path)}: {v}px;" if isinstance(v, (int, float)) else "")
rad_lines = []
for path, v in walk(radius["Radius"]["Base"], ()):
    rad_lines.append(f"  {varname(path)}: {v}px;" if isinstance(v, (int, float)) else "")
# Button/sm etc. referenced by the design as var(--button-sm)
for k, v in radius["Radius"]["Components"]["Button"].items():
    r = resolve(v) if isinstance(v, str) and v.startswith("{") else v
    if isinstance(r, str) and r.startswith("{"):
        r = None
    base = radius["Radius"]["Base"].get(v.strip("{}") if isinstance(v, str) else "", None)
    val = base if base is not None else r
    if val is not None:
        rad_lines.append(f"  --button-{k}: {val}px;")

fonts = typo["fonts"]

hdr = f"""/* ============================================================================
   tokens.css — UnifyApps DS 2.0 token layer
   GENERATED from unify-ds/ds/tokens/*.json — do not hand-edit.
   Regenerate:  python3 tools/gen-tokens.py
   Source Figma file key: {colors['_meta'].get('source_file_key','')}

   Naming: a CSS var name is the Figma variable path, lowercased, "/" and
   spaces to "-", parentheses stripped. So Figma `Colors/Text/text-primary (900)`
   is exactly `--colors-text-text-primary-900`. That 1:1 mapping is the whole
   point — never invent a name that isn't derivable from the Figma path.

   TIERS (enforced by tools/verify.sh):
     --palette-*    primitives. NEVER reference these from a component.
     --colors-*     semantic. Theme-aware. This is what components use.
     --component-*  component-scoped semantic. Also fine.
     --spacing-*, --radius-*, --button-*, --font-family-*  structural.
   ============================================================================ */

:root {{
  /* ---- typography families ---- */
  --font-family-display: "{fonts['display']}", Georgia, "Times New Roman", serif;
  --font-family-body: "{fonts['body']}", "Inter", system-ui, -apple-system, sans-serif;
  --font-family-code: "{fonts['code']}", "SFMono-Regular", Menlo, Consolas, monospace;

  /* ---- spacing scale ---- */
{chr(10).join(l for l in sp_lines if l)}

  /* ---- radius scale ---- */
{chr(10).join(l for l in rad_lines if l)}
}}

/* ---- palette primitives (reference only; components must not use these) ---- */
:root {{
{chr(10).join(pal_lines)}
}}

/* ---- semantic colors: LIGHT (default) ---- */
:root {{
{chr(10).join(light)}
}}

/* ---- semantic colors: DARK ---- */
:root[data-theme="dark"] {{
{chr(10).join(dark)}
}}

@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
{chr(10).join("  " + l for l in dark)}
  }}
}}
"""

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w").write(hdr)

print(f"wrote {OUT}")
print(f"  light semantic vars : {len(light)}")
print(f"  dark  semantic vars : {len(dark)}")
print(f"  palette primitives  : {len(pal_lines)}")
print(f"  spacing             : {len([l for l in sp_lines if l])}")
print(f"  radius              : {len([l for l in rad_lines if l])}")
if unres_l or unres_d:
    print(f"  UNRESOLVED light={len(unres_l)} dark={len(unres_d)}")
    for n, v in (unres_l + unres_d)[:15]:
        print("    ", n, "<-", v)
