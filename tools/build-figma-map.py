#!/usr/bin/env python3
"""Build app/figma-ref/figma-map.html: one self-contained page to browse the Figma file's map.

Reads every page's journeys.json (app/figma-ref/<page>/), the Chat + Artifacts journey specs and reference
screenshots (shrunk to thumbnails), the nav map, the drift report and the decisions, and writes them into the page
as one JSON blob. Re-run it whenever the maps change:   python3 tools/build-figma-map.py
"""
import base64, io, json, pathlib, re

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
REF = ROOT / 'app' / 'figma-ref'
OUT = REF / 'figma-map.html'
TEMPLATE = ROOT / 'tools' / 'figma-map.template.html'
FILE_KEY = 'lqKjNjyifEXCeywg69Knr2'


def link(node_id):
    return f'https://www.figma.com/design/{FILE_KEY}/?node-id={node_id.replace(":", "-")}' if node_id else None


def thumb(png):
    try:
        src = Image.open(png).convert('RGBA')
    except Exception:
        return None
    # the captures keep Figma's transparency; flatten onto the product's workspace ground, not black
    im = Image.new('RGB', src.size, (251, 250, 249))
    im.paste(src, mask=src.split()[3])
    w = 240
    im = im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=62, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


# Every page in the file, in Figma's order; slug = folder under app/figma-ref (None: not mapped).
PAGES = [
    ('1707:115989', 'Chat + Artifacts', 'chat-artifacts'),
    ('563:116774', 'Projects + Chat History', 'projects-chat-history'),
    ('0:1', 'Routines', 'routines'),
    ('8367:7825', 'Meetings', 'meetings'),
    ('3612:185217', 'Settings', 'settings'),
    ('6193:430256', 'Artifacts | Draft a Mail', 'artifacts-draft-a-mail'),
    ('11780:375551', 'Artifacts | Flow Charts', 'artifacts-flow-charts'),
    ('13946:324390', 'Comments on Artifact', 'comments-on-artifact'),
    ('13752:451556', 'Notifications', 'notifications'),
    ('13766:124218', 'Search + Agent + Login', 'search-agent-login'),
    ('6565:313262', 'All Empty states & Dropdowns', 'empty-states-dropdowns'),
    ('12382:295660', 'All landing pages : Artifact Routine Projects', None),
    ('13779:456774', 'Chrome Extension ES', None),
]

# What is built in the React prototype (app/): the chat journey's steps and the three Projects frames.
BUILT = {'11657:386523', '14045:584747', '15054:105151'}

drift = json.loads((REF / '_drift-2026-10-09' / 'drift.json').read_text())
CHANGED = {f['nodeId']: f.get('what') or '' for f in drift['frames'] if f.get('verdict') == 'change'}


def chat_artifacts():
    m = json.loads((ROOT / 'app' / 'src' / 'figma' / 'journeys.chat-artifacts.json').read_text())
    journeys = []
    for j in m['journeys']:
        spec_file = REF / 'chat-artifacts' / j['id'] / 'journey.json'
        steps = []
        if spec_file.exists():
            spec = json.loads(spec_file.read_text())
            for s in spec.get('steps', []):
                if s.get('kind') not in (None, 'step', 'state', 'alternate', 'component') and not s.get('file'):
                    continue
                nid = s.get('nodeId')
                png = REF / 'chat-artifacts' / j['id'] / (s.get('file') or '')
                steps.append({'n': str(s.get('step', '')), 'node': nid, 'label': s.get('shows') or s.get('label') or '',
                              'thumb': thumb(png) if s.get('file') and png.exists() else None})
        else:
            steps = [{'n': f'{i + 1:02d}', 'node': f, 'label': '', 'thumb': None} for i, f in enumerate(j.get('frames', []))]
        if j['id'] == 'chat-artifact':
            BUILT.update(s['node'] for s in steps if s['node'])
        journeys.append({'id': j['id'], 'title': j['title'], 'card': j.get('card'), 'steps': steps,
                         'status': 'built' if j['id'] == 'chat-artifact' else 'captured'})
    return journeys


def mapped_page(slug):
    data = json.loads((REF / slug / 'journeys.json').read_text())
    journeys = []
    for j in data.get('journeys', []):
        labels = j.get('labels') or {}
        steps = [{'n': f'{i + 1:02d}', 'node': f, 'label': labels.get(f, '') if isinstance(labels, dict) else '', 'thumb': None}
                 for i, f in enumerate(j.get('frames', []))]
        journeys.append({'id': j.get('id'), 'title': j.get('title') or j.get('id'), 'card': j.get('card'), 'steps': steps,
                         'status': 'mapped', 'dimmed': bool(j.get('dimmed'))})
    extra = {'loose': len(data.get('loose') or []), 'ignored': len(data.get('ignoredOptions') or [])}
    return journeys, extra


pages = []
for pid, name, slug in PAGES:
    page = {'id': pid, 'name': name, 'slug': slug or re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'), 'figma': link(pid)}
    if slug is None:
        page.update(status='not-mapped', journeys=[])
    elif slug == 'chat-artifacts':
        page.update(status='captured', journeys=chat_artifacts())
    else:
        journeys, extra = mapped_page(slug)
        page.update(status='mapped', journeys=journeys, **extra)
    for j in page['journeys']:
        j['cardLink'] = link(j.get('card'))
        for s in j['steps']:
            s['link'] = link(s['node'])
            s['built'] = s['node'] in BUILT
            if s['node'] in CHANGED:
                s['changed'] = CHANGED[s['node']]
        if page['slug'] == 'projects-chat-history' and any(s['built'] for s in j['steps']):
            j['status'] = 'built-part'
    pages.append(page)

nav = json.loads((REF / 'nav-map.json').read_text())
nav_items = [{
    'label': i['label'], 'confidence': i.get('confidence'), 'question': i.get('question'),
    'route': i.get('routeToday'), 'routeStatus': i.get('routeStatus'),
    'opens': {k: (i.get('opens') or {}).get(k) for k in ('page', 'journey', 'step', 'frame', 'figma')},
    'recommendation': i.get('recommendation'),
} for i in nav['items']]

# The consolidated doubts D1-D24 with the user's decisions (app/figma-ref/doubts.json).
doubts = json.loads((REF / 'doubts.json').read_text())['doubts']

data = {
    'file': {'name': 'Enterprise Brain Base 2026 - 1', 'key': FILE_KEY, 'figma': f'https://www.figma.com/design/{FILE_KEY}/'},
    'generated': drift.get('generated', ''),
    'pages': pages,
    'nav': nav_items,
    'doubts': doubts,
    'drift': {'summary': drift['summary'], 'themes': [{'id': t.get('id'), 'title': t.get('title'), 'what': t.get('what')} for t in drift['themes']],
              'changed': [{'journey': f['journey'], 'step': f['step'], 'node': f['nodeId'], 'figma': f['figma'], 'what': f.get('what') or ''}
                          for f in drift['frames'] if f.get('verdict') == 'change']},
}

html = TEMPLATE.read_text().replace('/*__DATA__*/null', json.dumps(data, ensure_ascii=False).replace('</', '<\\/'))
OUT.write_text(html)
n_j = sum(len(p['journeys']) for p in pages)
n_s = sum(len(j['steps']) for p in pages for j in p['journeys'])
print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size:,} bytes; {len(pages)} pages, {n_j} journeys, {n_s} steps, '
      f'{sum(1 for p in pages for j in p["journeys"] for s in j["steps"] if s["thumb"])} thumbnails, {len(doubts)} doubts')
