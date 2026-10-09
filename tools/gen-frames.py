#!/usr/bin/env python3
"""Regenerate app/src/figma/frames.generated.ts: the Figma frame <-> prototype URL map for the Chat + Artifacts page.

Sources (all under app/figma-ref/chat-artifacts/):
  BUILD-PLAN.md section 2.2   one table per journey: Step | Node | Kind | URL [| Note]. The URL column is the contract.
  <journey>/journey.json      the captured spec: what each frame shows (label), its reference PNG, its drawn size.
  ../../src/figma/journeys.chat-artifacts.json   the confirmed map: journey order (Figma order) and titles.

A journey.json step may carry its own "route" ("#/new?compose=…&rail=c") and "routeKind" (N/S/T/R/G/A; default S), for
example input-large, captured after the plan was written: the route wins over the plan table, and a journey with no
plan table takes its steps (and their order) from journey.json. Rows with Kind "-" (a section card, a designer changelog) and captured steps with no URL yet are
emitted as UNROUTED entries, so the review stepper can list them (disabled) in Figma order.

Run:  python3 tools/gen-frames.py          (writes the file, prints a summary and any warnings)
      python3 tools/gen-frames.py --check  (exit 1 when the file on disk is stale)
"""
import json, pathlib, re, struct, sys
from urllib.parse import parse_qsl

ROOT = pathlib.Path(__file__).resolve().parents[1]
REF = ROOT / 'app' / 'figma-ref' / 'chat-artifacts'
PLAN = REF / 'BUILD-PLAN.md'
MAP = ROOT / 'app' / 'src' / 'figma' / 'journeys.chat-artifacts.json'
OUT = ROOT / 'app' / 'src' / 'figma' / 'frames.generated.ts'
PAGE = 'Chat + Artifacts'

# Canonical query-key order: the order of the BUILD-PLAN 2.1 "Query keys" table. Mirrors UI_KEYS in src/router/uiParams.ts.
KEY_ORDER = ['seed', 'at', 'role', 'from', 'view', 'search', 'cot', 'glyph', 'compose', 'panel', 'open', 'comment',
             'cbox', 'rbox', 'menu', 'pop', 'modal', 'edit', 'drag', 'hover', 'full', 'cw', 'rail', 'nav', 'vw', 'sheet']

warnings = []
def warn(msg): warnings.append(msg)


def png_size(path):
    try:
        with open(path, 'rb') as fh:
            head = fh.read(24)
        if head[:8] != b'\x89PNG\r\n\x1a\n':
            return None
        return list(struct.unpack('>II', head[16:24]))
    except OSError:
        return None


def canonical(route):
    """Reorder a '/path?k=v&…' route into the 2.1 key order (values untouched, so ':' '>' ',' '+' stay readable)."""
    path, _, query = route.partition('?')
    if not query:
        return path
    pairs = [p.split('=', 1) if '=' in p else [p, ''] for p in query.split('&') if p]
    unknown = [k for k, _ in pairs if k not in KEY_ORDER]
    if unknown:
        warn(f'{route}: query keys not in the 2.1 table: {unknown}')
    rank = {k: i for i, k in enumerate(KEY_ORDER)}
    ordered = sorted(pairs, key=lambda kv: (rank.get(kv[0], len(KEY_ORDER)), kv[0]))
    out = path + '?' + '&'.join(f'{k}={v}' for k, v in ordered)
    if ordered != pairs:
        warn(f'{route}: reordered to canonical {out}')
    return out


def norm_key(route):
    """What counts as 'the same URL' for the distinct-URL count: sorted keys, sorted comma / '+' lists."""
    path, _, query = route.partition('?')
    items = []
    for k, v in parse_qsl(query, keep_blank_values=True):
        if k == 'seed':
            v = ','.join(sorted(v.split(',')))
        if k == 'menu':
            v = '+'.join(sorted(re.split(r'[+ ]', v)))
        items.append((k, v))
    return path + '?' + '&'.join(f'{k}={v}' for k, v in sorted(items))


# ---------------------------------------------------------------- journey order + captured specs
confirmed = json.loads(MAP.read_text())
journeys = [{'id': j['id'], 'title': j['title'], 'card': j.get('card')} for j in confirmed['journeys']]

specs = {}  # journey id -> {nodeId: entry}
spec_order = {}  # journey id -> [entry] in journey.json order (for journeys with no plan table)
for j in journeys:
    f = REF / j['id'] / 'journey.json'
    j['captured'] = f.exists()
    if not f.exists():
        continue
    data = json.loads(f.read_text())
    entries = []
    def add(e):
        e = dict(e)
        e.setdefault('step', e.get('id'))
        entries.append(e)
        for sub in e.get('states') or []:  # extra states captured under a step ("01a" hover strips)
            if isinstance(sub, dict) and sub.get('nodeId'):
                add(sub)
    for key in ('steps', 'components', 'looseComponents'):
        for e in data.get(key) or []:
            add(e)
    specs[j['id']] = {e['nodeId']: e for e in entries if e.get('nodeId')}
    spec_order[j['id']] = entries
    if data.get('title') and data['title'] != j['title']:
        j['specTitle'] = data['title']


# ---------------------------------------------------------------- plan tables (section 2.2)
text = PLAN.read_text()
try:
    sec = text[text.index('### 2.2'):text.index('### 2.3')]
except ValueError:
    sys.exit('gen-frames: BUILD-PLAN.md has no "### 2.2" … "### 2.3" section')

rows = {}   # journey id -> [row]
current = None
for line in sec.splitlines():
    m = re.match(r'^\*\*([a-z0-9-]+)\*\*', line)
    if m:
        current = m.group(1)
        rows.setdefault(current, [])
        continue
    if not line.startswith('|') or current is None:
        continue
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    if len(cells) < 4 or cells[0] in ('Step', 'Unit') or set(cells[0]) <= set('-: '):
        continue
    step_ids = [s.strip() for s in cells[0].split('+')]
    nodes = [n.strip() for n in cells[1].split('+')]
    kind = cells[2]
    url_cell = cells[3]
    note = cells[4] if len(cells) > 4 and cells[4] else None
    if len(step_ids) != len(nodes):
        warn(f'{current} {cells[0]}: {len(step_ids)} step ids for {len(nodes)} nodes')
    ticks = re.findall(r'`([^`]*)`', url_cell)
    route = next((t[1:] for t in ticks if t.startswith('#/')), None)
    rest = re.sub(r'`#/[^`]*`', '', url_cell).strip()
    alias = None
    am = re.match(r'^(?:\(?=|part of)\s*(?:([a-z][a-z0-9-]*[a-z])\s+)?([c]?\d+[a-z]?)\b', rest.lstrip('('))
    if am:
        alias = (am.group(1) or current, am.group(2))
        # the reference itself becomes aliasOf; keep only what the cell says beyond it ("identical panel …", `menu=apps`)
        rest = rest.lstrip('(')[am.end():].strip().strip('()').strip()
        rest = re.sub(r'^\(?`?([^`]*)`?\)?$', r'\1', rest).strip(' ;,')
    if rest:
        note = (rest + ('; ' + note if note else '')).strip()
    for sid, node in zip(step_ids, nodes):
        rows[current].append({'stepId': sid, 'nodeId': node, 'kind': kind, 'route': route, 'alias': alias, 'note': note})

# resolve aliases with no URL of their own ("= 08", "= artifacts-landing 08", "part of 04")
def find_row(jid, sid):
    return next((r for r in rows.get(jid, []) if r['stepId'] == sid), None)

for jid, rs in rows.items():
    for r in rs:
        if r['alias'] and not r['route']:
            target = find_row(*r['alias'])
            if target and target['route']:
                r['route'] = target['route']
            else:
                warn(f'{jid} {r["stepId"]}: alias {r["alias"]} does not resolve to a URL')

# ---------------------------------------------------------------- frames
frames, unrouted = [], []
order = [j['id'] for j in journeys]
for jid in rows:
    if jid not in order:
        warn(f'plan journey "{jid}" is not in journeys.chat-artifacts.json; appended at the end')
        journeys.append({'id': jid, 'title': jid, 'card': None, 'captured': (REF / jid).exists()})
        order.append(jid)

for j in journeys:
    jid = j['id']
    spec = specs.get(jid, {})
    plan_rows = rows.get(jid)
    if not plan_rows:
        # no table (or an empty heading) in the plan, as for input-large: fall back to the captured spec, if any
        plan_rows = [{'stepId': e.get('step'), 'nodeId': e['nodeId'], 'kind': e.get('routeKind', 'S'),
                      'route': (e.get('route') or e.get('url') or '').lstrip('#') or None, 'alias': None, 'note': None}
                     for e in spec_order.get(jid, []) if e.get('nodeId')]
    seen = set()
    for pos, r in enumerate(plan_rows, 1):
        e = spec.get(r['nodeId'])
        if e is None:
            # a node may be captured under another journey's folder
            for other, s in specs.items():
                if r['nodeId'] in s:
                    e = s[r['nodeId']]
                    warn(f'{jid} {r["stepId"]}: spec found under {other}/')
                    break
        if e is None:
            warn(f'{jid} {r["stepId"]} {r["nodeId"]}: not in any journey.json (no label / reference PNG)')
        seen.add(r['nodeId'])
        own_route = (e or {}).get('route') or (e or {}).get('url')
        route = (own_route.lstrip('#') if own_route else None) or r['route']
        label = ((e or {}).get('shows') or r['note'] or '').strip()
        rec = {'nodeId': r['nodeId'], 'page': PAGE, 'journey': jid, 'step': pos, 'stepId': r['stepId'], 'kind': r['kind'], 'label': label}
        ref_file = None
        if e:
            ref_file = e.get('opaqueFile') or e.get('file')
            if ref_file and not (REF / jid / ref_file).exists():
                warn(f'{jid} {r["stepId"]}: reference {ref_file} missing on disk')
                ref_file = None
        if ref_file:
            rec['ref'] = f'{jid}/{ref_file}'
        size = None
        if e and isinstance(e.get('size'), str):
            sm = re.match(r'(\d+)\s*x\s*(\d+)', e['size'])
            size = [int(sm.group(1)), int(sm.group(2))] if sm else None
        if size is None and ref_file:
            size = png_size(REF / jid / ref_file)
        if size:
            rec['size'] = size
        if r['alias']:
            rec['aliasOf'] = f'{r["alias"][0]} {r["alias"][1]}'
        if r['note']:
            rec['note'] = r['note']
        if route:
            route = canonical(route)
            vw = dict(parse_qsl(route.partition('?')[2])).get('vw')
            if vw and vw.isdigit():
                rec['viewport'] = int(vw)
            rec['route'] = route
            frames.append(rec)
        else:
            rec['reason'] = r['note'] or 'no prototype URL assigned yet'
            unrouted.append(rec)
    for node, e in spec.items():
        if node not in seen and not str(e.get('file', '')).startswith('00-card'):
            warn(f'{jid}: captured {e.get("step")} {node} has no row in the plan table')

# ---------------------------------------------------------------- write
def js(v):
    return json.dumps(v, ensure_ascii=False)

def obj(d, keys):
    return '{ ' + ', '.join(f'{k}: {js(d[k])}' for k in keys if k in d) + ' }'

FRAME_KEYS = ['nodeId', 'page', 'journey', 'step', 'stepId', 'kind', 'label', 'route', 'viewport', 'size', 'ref', 'aliasOf', 'note']
UNROUTED_KEYS = ['nodeId', 'page', 'journey', 'step', 'stepId', 'kind', 'label', 'reason', 'size', 'ref']
JOURNEY_KEYS = ['id', 'title', 'card', 'captured']

out = [
    '// GENERATED by tools/gen-frames.py from app/figma-ref/chat-artifacts (BUILD-PLAN.md 2.2 + <journey>/journey.json).',
    '// Do not edit by hand: change the plan table or the journey spec, then run  python3 tools/gen-frames.py',
    "import type { FrameRef, JourneyRef, UnroutedFrame } from './types'",
    '',
    '/** Journeys of the Chat + Artifacts page in Figma order (journeys.chat-artifacts.json). captured=false: no spec yet. */',
    'export const GENERATED_JOURNEYS: JourneyRef[] = [',
    *[f'  {obj(j, JOURNEY_KEYS)},' for j in journeys],
    ']',
    '',
    f'/** {len(frames)} frames with a prototype URL, in Figma order within each journey (aliases included). */',
    'export const GENERATED_FRAMES: FrameRef[] = [',
    *[f'  {obj(f, FRAME_KEYS)},' for f in frames],
    ']',
    '',
    f'/** {len(unrouted)} captured frames with no prototype URL (not a screen, or not assigned yet). */',
    'export const GENERATED_UNROUTED: UnroutedFrame[] = [',
    *[f'  {obj(f, UNROUTED_KEYS)},' for f in unrouted],
    ']',
    '',
]
content = '\n'.join(out)

distinct = {norm_key(f['route']) for f in frames}
summary = (f'{len(frames)} routed frames ({len(distinct)} distinct URLs), {len(unrouted)} unrouted, '
           f'{len(journeys)} journeys ({sum(1 for j in journeys if not j["captured"])} not captured)')

if '--check' in sys.argv:
    stale = not OUT.exists() or OUT.read_text() != content
    print(('STALE ' if stale else 'up to date: ') + str(OUT.relative_to(ROOT)) + ' — ' + summary)
    sys.exit(1 if stale else 0)

OUT.write_text(content)
print(f'{OUT.relative_to(ROOT)}: {summary}')
for w in warnings:
    print('  warn:', w)
