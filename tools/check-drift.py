import json, re, subprocess

# Exactly what the LIVE Figma file reported for node 16740:306222
live = json.loads(r'''{"Colors/Utility/Brand Tertiary/utility-brand-tertiary-600":"#847347","spacing-lg":"12","Colors/Icon/icon-primary":"#2f2e2d","spacing-md":"8","Palette/Alpha Colors/Black/alpha-black-05":"#0000000d","Colors/Border/border-brand-solid":"#0c2011","Colors/Text/text-white":"#ffffff","Colors/Utility/Error/utility-error-500":"#b72318","Colors/Text/text-tertiary (600)":"#6a6662","Colors/Utility/Gray/utility-gray-300":"#dbd6d1","Colors/Border/border-primary":"#dbd6d1","Component/Nav Bar/navbar-bg":"#efebe5","Colors/Border/border-secondary":"#edebe8","Colors/Icon/icon-secondary":"#6a6662","Colors/Text/text-primary (900)":"#201f1e","Colors/Text/text-secondary (700)":"#4a4745","Colors/Background/bg-workspace":"#fbfaf9","Colors/Border/border-tertiary":"#f2f0ee","Colors/Background/bg-primary":"#ffffff","Colors/Utility/Gray/utility-gray-900":"#201f1e","Colors/Utility/Gray/utility-gray-200":"#edebe8","Component/Buttons/Neutral/Secondary/button-neutral-secondary-fg":"#6a6662","Component/Buttons/Neutral/Secondary/button-neutral-secondary-border":"#edebe8","Colors/Background/bg-tertiary":"#f2f0ee","Colors/Background/bg-white":"#ffffff","Colors/Background/bg-secondary":"#f7f5f3","Component/Buttons/Neutral/Tertiary/button-neutral-tertiary-fg":"#6a6662","Colors/Text/text-error-primary (600)":"#981d14","Colors/Text/text-success-primary (600)":"#015918","Colors/Utility/Gray/utility-gray-50":"#f7f5f3","Colors/Utility/Gray/utility-gray-600":"#6a6662","Colors/Icon/icon-warning (600)":"#d37c25","Colors/Utility/Warning/utility-warning-700":"#9d5206","Colors/Utility/Warning/utility-warning-25":"#fdf0e3","Colors/Utility/Brand/utility-brand-700":"#09190d","Colors/Utility/Brand/utility-brand-25":"#f3f6f4","Colors/Utility/Error/utility-error-600":"#981d14","Colors/Utility/Error/utility-error-25":"#faf0f0","Colors/Text/text-warning-primary (600)":"#d37c25","Colors/Text/text-error-secondary (500)":"#b72318","Colors/Text/text-brand-tertiary (600)":"#0c2011","Colors/Utility/Warning/utility-warning-500":"#f09437","Colors/Utility/Gray/utility-gray-100":"#f2f0ee","spacing-4xl":"32","spacing-3xl":"24","spacing-2xl":"20","spacing-xs":"4","spacing-xxs":"2","spacing-xl":"16","spacing-sm":"6","spacing-none":"0","radius-full":"9999","radius-none":"0","radius-xs":"4","radius-sm":"6","radius-md":"8","radius-4xl":"12","Button/sm":"6","Button/xs":"6"}''')

def varname(path):
    s = path.lower().replace("(", "").replace(")", "")
    s = re.sub(r"[\s/_.]+", "-", s)
    return "--" + re.sub(r"-+", "-", s).strip("-")

css = open("shared/tokens.css").read()
# Only the LIGHT scope: structural :root + palette :root + semantic-light :root.
# Everything from the DARK marker onward must be excluded, or last-wins in the
# dict silently hands you dark values (this bit me once - hence the slice).
cut = css.index("/* ---- semantic colors: DARK ---- */")
decl = dict(re.findall(r"^\s*(--[a-z0-9-]+):\s*([^;]+);", css[:cut], re.M))
def deref(v, d=0):
    v = v.strip()
    m = re.match(r"^var\((--[a-z0-9-]+)\)$", v)
    if m and d < 12:
        return deref(decl.get(m.group(1), "?"), d + 1)
    return v

def norm(v):
    v = v.strip().lower()
    if re.fullmatch(r"\d+", v): return v + "px"
    return v

ok = drift = missing = 0
rows = []
for fig, want in live.items():
    if fig.startswith("Palette/"):   # primitives, not component-facing
        continue
    name = varname(fig)
    if name not in decl:
        rows.append(("MISSING", fig, name, want, "-")); missing += 1; continue
    got = deref(decl[name])
    if norm(got) == norm(want): ok += 1
    else:
        rows.append(("DRIFT", fig, name, want, got)); drift += 1

print(f"matched={ok}  drift={drift}  missing={missing}\n")
for kind, fig, name, want, got in rows:
    print(f"{kind:8} {fig}\n         css {name}\n         figma-live={want}   local-json={got}\n")
