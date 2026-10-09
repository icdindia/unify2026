"""Build project/tokens.json from the ODS Storybook foundations CSS.

Input : source/foundations-raw.css  (global iframe CSS up to the Storybook docs rules)
Output: project/tokens.json         (Design System artifact format: lists, light + dark themes)
"""
import json, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css = open(os.path.join(ROOT, 'source', 'foundations-raw.css')).read()


def block(selector):
    i = css.index(selector + ' {')
    return css[i:css.index('}', i)]


def split_ld(v):
    m = re.fullmatch(r'light-dark\((.*)\)', v.strip())
    if not m:
        return v.strip(), v.strip()
    inner, depth, parts, cur = m.group(1), 0, [], ''
    for ch in inner:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur.strip()); cur = ''
        else:
            cur += ch
    parts.append(cur.strip())
    return parts[0], parts[1]


def norm(c):
    c = c.strip()
    if c.startswith('#'):
        return c.lower()
    return re.sub(r'\s+', '', c).replace(',', ', ')


# ---------- colour usage notes ----------
ROLE = {
    'background': 'Page background; the ground every neutral-scheme surface sits on.',
    'background-subtle': 'Subtle section background, one step off the page.',
    'background-card': 'Card surface on `colours-basic-background`.',
    'background-card-subtle': 'Card surface placed on `colours-basic-background-subtle`.',
    'text': 'Default text and icon colour on every basic background.',
    'text-dominant': 'Magenta emphasis text (dominant copy) on basic backgrounds.',
    'text-recessive': 'Secondary text: helper copy, metadata, captions.',
    'text-link': 'Inline link text on basic backgrounds.',
    'accent': 'Brand magenta fill: primary buttons, selected controls, brand moments.',
    'text-on-accent': 'Text and icons on `colours-basic-accent`.',
    'accent-secondary': 'Secondary (black/white) fill: secondary buttons, strong selected states.',
    'text-on-accent-secondary': 'Text and icons on `colours-basic-accent-secondary`.',
    'stroke': 'Strong borders: inputs, outlined buttons, dividers that must read.',
    'stroke-subtle': 'Quiet borders and dividers.',
    'modal-overlay': 'Scrim behind dialogs and sheets.',
}


def usage(name):
    n = name.replace('colours-', '')
    if n.startswith('basic-'):
        return ROLE.get(n[6:], 'Basic colour.')
    m = re.match(r'shades-accent-shades-accent-(.*)', n)
    if m:
        return {'subtle': 'Tinted magenta surface (badges, highlights).',
                'extra-dominant': 'Lightest strong magenta shade; illustrations and charts.',
                'dominant': 'Light magenta shade; magenta scheme subtle background.',
                'recessive': 'Dark magenta; the hover shade of the accent.',
                'extra-recessive': 'Darkest magenta; pressed shade, text on magenta tint.'}.get(m.group(1), 'Magenta shade.')
    m = re.match(r'shades-secondary-accent-shades-secondary-accent-(.*)', n)
    if m:
        return 'Secondary (neutral) accent shade, %s.' % m.group(1).replace('-', ' ')
    m = re.match(r'shades-neutral-shades-(\d+)', n)
    if m:
        return 'Neutral grey %s. Reverses in dark mode (50 is always nearest the page background).' % m.group(1)
    m = re.match(r'shades-accents-(.*)', n)
    if m:
        return 'Accent set: %s.' % m.group(1).replace('-', ' ')
    m = re.match(r'functional-notification-(.*)', n)
    if m:
        return 'Notification dot / count fill.' if m.group(1) == 'notification' else 'Text on the notification fill.'
    m = re.match(r'functional-(informational|success|warning|destructive)-(.*)', n)
    if m:
        kind, v = m.groups()
        return {'standard': '%s status: icon, text and strong fill.' % kind.capitalize(),
                'subtle': '%s status: tinted background (inline notifications, banners).' % kind.capitalize(),
                'hovered': '%s status: hover shade.' % kind.capitalize(),
                'pressed': '%s status: pressed shade.' % kind.capitalize()}[v]
    m = re.match(r'interaction-states-(hover|pressed|focus|disabled|visited)-(.*)', n)
    if m:
        state, rest = m.groups()
        if state == 'focus':
            return 'Focus ring: 2px solid (`strokes-2`), 4px offset.' if rest == 'focus' else 'Active stroke (e.g. slider track fill behind the thumb).'
        target = re.sub(r'-(hover|pressed|disabled|visited)$', '', rest).replace('-', ' ')
        return '%s state of %s. Backgrounds change per state; text stays `colours-basic-text`.' % (state.capitalize(), target)
    return 'ODS colour.'


tokens = []
body = block(':root, [data-scheme="neutral"]')
for name, val in re.findall(r'--(colours-[a-z0-9-]+): ([^;]+);', body):
    l, d = split_ld(val)
    tokens.append({'name': name, 'value': {'light': norm(l), 'dark': norm(d)}, 'usage': usage(name)})

# Brand ramp: constant primitives (the dt-foundations base)
BRAND = [
    ('dt-magenta', '#e20074', 'The Telekom brand magenta. Same value in light and dark.'),
    ('dt-magenta-subtle', '#f9cce3', 'Magenta 20% tint.'),
    ('dt-magenta-extra-dominant', '#ee66ac', 'Magenta 60% tint.'),
    ('dt-magenta-dominant', '#e83390', 'Magenta 80% tint.'),
    ('dt-magenta-recessive', '#b5005d', 'Magenta shade; hover.'),
    ('dt-magenta-extra-recessive', '#880046', 'Magenta deep shade; pressed.'),
    ('dt-white', '#ffffff', 'Pure white. Logo on magenta or black.'),
    ('dt-black', '#000000', 'Pure black. Mono logo, text on white.'),
]
for n, v, u in BRAND:
    tokens.append({'name': n, 'value': {'light': v, 'dark': v}, 'usage': u})

# ---------- type ----------
TYPE_USAGE = {
    'display': 'Hero statements only; one per page.',
    'title-xl': 'Page hero title.',
    'title-l': 'Page title (H1).',
    'title-m': 'Section title (H2).',
    'title-s': 'Sub-section title (H3).',
    'subtitle': 'Subtitle under a title.',
    'paragraph': 'Lead paragraph / intro copy.',
    'body-l': 'Large bold body: accordion headers (large), card titles.',
    'body-m-bold': 'Default bold body: labels, small headers.',
    'body-m-regular': 'Default body copy (weight 500 — TeleNeo "regular" in ODS is Medium).',
    'body-s-bold': 'Small bold: tags, compact labels.',
    'body-s-regular': 'Small body: helper and support text.',
    'microcopy-bold': 'Microcopy emphasis: badges, legal highlights.',
    'microcopy-regular': 'Microcopy: legal notes, timestamps.',
    'link-l': 'Standalone large link.',
    'link-paragraph': 'Link inside `paragraph` copy.',
    'link-m-bold': 'Standalone link, medium bold.',
    'link-m-regular': 'Inline link in `body-m-regular`.',
    'link-s-bold': 'Standalone small bold link.',
    'link-s-regular': 'Inline link in `body-s-*` copy.',
}
styles = {}
for m in re.finditer(r'--([a-z0-9-]+): (\d{3}) ([^/;]+)/([\d.]+) "TeleNeo Var"', css):
    name, w, size, lh = m.groups()
    fluid = None
    c = re.fullmatch(r'clamp\(([\d.]+rem), [^,]+, ([\d.]+rem)\)', size)
    if c:
        fluid = size
        size = c.group(2)
    elif size.startswith('.'):
        size = '0' + size
    u = TYPE_USAGE.get(name, '')
    if fluid:
        u += ' Fluid: `%s` (%s at 360px viewport up to %s).' % (fluid.replace(' .', ' 0.'), c.group(1), c.group(2))
    styles[name] = {'name': name, 'fontSize': size, 'lineHeight': float(lh) if '.' in lh else int(lh),
                    'fontWeight': int(w), 'letterSpacing': '0', 'usage': u.strip()}

groups = [
    ('Display & titles', ['display', 'title-xl', 'title-l', 'title-m', 'title-s', 'subtitle']),
    ('Body', ['paragraph', 'body-l', 'body-m-bold', 'body-m-regular', 'body-s-bold', 'body-s-regular']),
    ('Microcopy', ['microcopy-bold', 'microcopy-regular']),
    ('Links', ['link-paragraph', 'link-l', 'link-m-bold', 'link-m-regular', 'link-s-bold', 'link-s-regular']),
]
typ = {
    'fonts': [
        {'family': 'TeleNeo Var', 'file': 'fonts/TeleNeoVariable-Upright.woff2', 'weight': '100 900', 'style': 'normal'},
        {'family': 'TeleNeo Var', 'file': 'fonts/TeleNeoVariable-Italic.woff2', 'weight': '100 900', 'style': 'italic'},
    ],
    'families': {'sans': '"TeleNeo Var", TeleNeoWeb, sans-serif'},
    'groups': [{'name': g, 'family': 'sans', 'styles': [styles[s] for s in names if s in styles]} for g, names in groups],
}


# ---------- lengths ----------
def rem(v):
    v = v.strip()
    return '0' + v if v.startswith('.') else v


def html_vars(prefix):
    return [(n, rem(v)) for n, v in re.findall(r'--(%s[a-z0-9-]*): ([^;]+);' % prefix, css)]


def seen(lst):
    out, s = [], set()
    for n, v in lst:
        if n not in s:
            s.add(n); out.append((n, v))
    return out


SP_USAGE = {
    'spacing-component-1': 'Hairline gaps (2px).', 'spacing-component-2': 'Tight gaps inside components (4px): accordion header-to-content.',
    'spacing-component-3': 'Compact padding (8px): icon buttons, right padding of headers.', 'spacing-component-4': '12px internal gaps.',
    'spacing-component-5': 'Default gap (16px): header icon gap, body bottom padding.', 'spacing-component-6': '20px padding.',
    'spacing-component-7': 'Leading inset (24px): accordion/text-body left padding.', 'spacing-component-8': '32px padding in large components.',
}
spacing = [{'name': n, 'value': v, 'usage': SP_USAGE.get(n, ('Space inside components.' if 'component' in n else 'Space between layout sections and blocks.') + ' %s.' % v)}
           for n, v in seen(html_vars('spacing-'))]
radius = [{'name': n, 'value': v, 'usage': {
    'radius-zero': 'Square corners.', 'radius-extra-small': 'Tags, small chips (6px).', 'radius-small': 'Inputs, small cards (8px).',
    'radius-medium': 'Accordion headers, cards, buttons (16px).', 'radius-large': 'Large cards, sheets (24px).',
    'radius-extra-large': 'Dialogs, hero cards (32px).', 'radius-extra-extra-large': 'Large promotional surfaces (48px).',
    'radius-full': 'Pills and circles.'}.get(n, '')} for n, v in seen(html_vars('radius-'))]
sizing = [{'name': n, 'value': v, 'usage': {'sizing-minimum-tappable-area': 'Minimum hit area (48px) for any interactive element.',
                                            'sizing-input-height': 'Text field height (72px).'}.get(n, 'Component size step, %s.' % v)}
          for n, v in seen(html_vars('sizing-component-') + html_vars('sizing-input') + html_vars('sizing-minimum'))]
strokes = [{'name': n, 'value': v, 'usage': {'strokes-1': 'Hairline borders (1px).', 'strokes-2': 'Focus ring and strong borders (2px).',
                                             'strokes-3': 'Heavy strokes: selected indicators (4px).'}[n]} for n, v in seen(html_vars('strokes-'))]
z = [{'name': 'z-index-' + n, 'value': v, 'usage': 'Stacking layer for the %s.' % n.replace('-', ' ')}
     for n, v in re.findall(r'--z-index-([a-z-]+): (\d+)', css)]
viewports = [{'name': n, 'value': v, 'usage': 'Breakpoint: %s.' % n.replace('viewport-', '').replace('-', ' ')} for n, v in seen(html_vars('viewport-'))]

tokens_json = {
    'name': 'DT Design System', 'version': 1,
    'meta': {'source': 'ods-storybook', 'url': 'https://ods.trap.ng.telekom.net', 'synced': '2026-09-29',
             'note': 'Neutral scheme colours from :root light-dark() pairs; other schemes ship in components/bundle.css as [data-scheme].'},
    'color': {'themes': [{'id': 'light', 'name': 'Light'}, {'id': 'dark', 'name': 'Dark'}], 'tokens': tokens},
    'type': typ,
    'spacing': {'tokens': spacing},
    'radius': {'tokens': radius},
    'sizing': {'note': 'ODS sizing scale for icons, controls and hit areas.', 'tokens': sizing},
    'strokes': {'note': 'Border widths.', 'tokens': strokes},
    'zIndex': {'note': 'Layering order.', 'tokens': z},
    'viewport': {'note': 'Breakpoints (grid columns and margins change at 360, 768, 1440 and 1680px).', 'tokens': viewports},
}
out = os.path.join(ROOT, 'project', 'tokens.json')
json.dump(tokens_json, open(out, 'w'), indent=1, ensure_ascii=False)
print('colours', len(tokens), 'type styles', sum(len(g['styles']) for g in typ['groups']), 'spacing', len(spacing),
      'radius', len(radius), 'sizing', len(sizing), 'strokes', len(strokes), 'z', len(z), 'viewports', len(viewports))
