import json, re

SRC = "/Users/lisarath/unify-ds/ds/tokens/typography.json"
OUT = "/Users/lisarath/Unify2026/shared/typography.css"
d = json.load(open(SRC))
styles, fonts = d["styles"], d["fonts"]

WEIGHT = {"Regular":400,"Medium":500,"SemiBold":600,"Semibold":600,"Semi Bold":600,"Bold":700}
FAMVAR = {"Spectral":"--font-family-display","Geist":"--font-family-body","JetBrains Mono":"--font-family-code"}

def cls(name):
    s = name.lower().replace("/", "-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")

rules, props, mono, caps = [], [], [], []
for name, v in sorted(styles.items()):
    fam  = v.get("family", "Geist")
    wname = v.get("weight", "Regular")
    w = WEIGHT.get(wname, WEIGHT.get(wname.replace(" ", ""), 400))
    size, lh = v.get("size"), v.get("lineHeight")
    ls, case = v.get("letterSpacing", 0), v.get("case", "ORIGINAL")

    decls = [
        f"font-family: var({FAMVAR.get(fam,'--font-family-body')});",
        f"font-weight: {w};",
        f"font-size: {size}px;",
        f"line-height: {lh}px;",
    ]
    if ls:                      # Figma letterSpacing is a percentage
        decls.append(f"letter-spacing: {ls/100:.4f}em;".replace("0000em","em"))
    if case == "UPPER" or "ALL CAPS" in name:
        decls.append("text-transform: uppercase;")
        caps.append(name)
    if "italic" in name.lower():
        decls.append("font-style: italic;")
    if "underlin" in name.lower():
        decls.append("text-decoration: underline;")
    if "Mono" in fam:
        mono.append(name)

    rules.append(f"/* {name} */\n.{cls(name)} {{\n  " + "\n  ".join(decls) + "\n}")

    # Also expose each style as custom properties, so an ATOM's own CSS can bind
    # to the DS type scale by name instead of restating px. A utility class is
    # for consumer markup; an atom that owns its type needs the values.
    c = cls(name)
    props.append(f"  --{c}-font-family: var({FAMVAR.get(fam,'--font-family-body')});")
    props.append(f"  --{c}-font-weight: {w};")
    props.append(f"  --{c}-font-size: {size}px;")
    props.append(f"  --{c}-line-height: {lh}px;")
    if ls:
        props.append(f"  --{c}-letter-spacing: {ls/100:.4f}em;".replace("0000em","em"))

hdr = f"""/* ============================================================================
   typography.css — UnifyApps DS text scale as utility classes
   GENERATED from unify-ds/ds/tokens/typography.json — do not hand-edit.
   Regenerate:  python3 tools/gen-typography.py

   Class name = the Figma text-style name, lowercased, "/" and spaces to "-".
     "Text sm/Medium"       -> .text-sm-medium
     "Display xs/Medium"    -> .display-xs-medium
     "Text xxs/Regular-Code"-> .text-xxs-regular-code
     "Text xs/Bold-ALL CAPS"-> .text-xs-bold-all-caps

   Families: display={fonts['display']}  body={fonts['body']}  code={fonts['code']}
   {len(styles)} styles · {len(mono)} code/mono · {len(caps)} all-caps

   Consumer markup uses these classes. An atom's own CSS may set font-size /
   weight / line-height inline where the atom owns its type (see FIGMA-TO-HTML.md).
   ============================================================================ */

"""
type_tokens = ("/* ---------------------------------------------------------------------------\n"
               "   TYPE TOKENS — one set per DS text style.\n"
               "   Atoms bind to these instead of restating px:\n"
               "     font-size: var(--text-sm-medium-font-size);\n"
               "   NEVER substitute a --spacing-* token for a font size. Several sizes\n"
               "   coincide with spacing steps (12, 16, 20, 24, 32) and that equality is a\n"
               "   COINCIDENCE, not a relationship — the two scales move independently.\n"
               "   --------------------------------------------------------------------------- */\n"
               ":root {\n" + "\n".join(props) + "\n}\n\n")
open(OUT, "w").write(hdr + type_tokens + "\n\n".join(rules) + "\n")
print(f"wrote {OUT} — {len(rules)} classes ({len(mono)} mono, {len(caps)} caps)")
for n in ["Text sm/Bold-Code","Text xxs/Regular-Code","Text xxs/Medium-ALL CAPS","Text xs/Regular","Display xs/Medium"]:
    if n in styles:
        v = styles[n]; print(f"   {n:28} -> .{cls(n):26} {v['family']} {v['weight']} {v['size']}/{v['lineHeight']}")
