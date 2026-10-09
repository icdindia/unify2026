"""Write project/design-system.json (the Design System artifact index) from source/asset-uploads.json.

Keeps createdOnFiles from an existing index so re-runs are revisions, not a new system.
"""
import json, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
up = json.load(open(os.path.join(ROOT, 'source', 'asset-uploads.json')))
path = os.path.join(ROOT, 'project', 'design-system.json')
now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
old = json.load(open(path)) if os.path.exists(path) else {}

groups = {}
for g, tile in (('Logos', 'l'), ('Icons', 'm')):
    groups[g] = {'name': g, 'tile': tile, 'order': [f['name'] for f in up[g]],
                 'files': {f['name']: {'name': f['name'], 'blob': f['blob'], 'size': f['size'], 'type': f['type']} for f in up[g]}}

index = dict(old)
index.update({
    'v': 3, 'layout': 'files',
    'createdOnFiles': old.get('createdOnFiles', {'v': 1, 'at': now}),
    'title': old.get('title', 'DT Design System'),
    'namespace': old.get('namespace', 'DTDS'),
    'libraries': [],
    'sections': old.get('sections', {}),
    'groups': ['Logos', 'Icons'],
    'assetGroups': groups,
    'blobs': old.get('blobs', {}),
    'docs': old.get('docs', {'readme': 'project/README.md', 'sections': []}),
    'lastChange': {'by': 'Claude', 'at': now, 'via': 'Claude Code', 'note': 'Built from the ODS Storybook: tokens, TeleNeo, logos, 375 icons, selected web components.'},
})
json.dump(index, open(path, 'w'), indent=1)
print('index written', path)
