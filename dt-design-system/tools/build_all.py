"""Sync a Storybook crawl into source/ (selected components only) and rebuild everything.

usage: python3 tools/build_all.py [crawl_dir]
  crawl_dir holds out/NNN.json, args/NNN.json, guides/*.json, css.json, selected.json (from the Safari crawler)
"""
import json, os, shutil, subprocess, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source')

if len(sys.argv) > 1:
    crawl = sys.argv[1]
    sel = json.load(open(os.path.join(crawl, 'selected.json')))
    for sub in ('crawl', 'args'):
        d = os.path.join(SRC, sub)
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(d)
    shutil.rmtree(os.path.join(SRC, 'overlay'), ignore_errors=True)
    os.makedirs(os.path.join(SRC, 'overlay'))
    for n in sel:
        for sub, src in (('crawl', 'out'), ('args', 'args'), ('overlay', 'overlay')):
            f = os.path.join(crawl, src, '%03d.json' % n)
            if os.path.exists(f):
                shutil.copy(f, os.path.join(SRC, sub))
    shutil.copy(os.path.join(crawl, 'css.json'), SRC)
    shutil.copy(os.path.join(crawl, 'selected.json'), SRC)
    g = os.path.join(SRC, 'guides')
    os.makedirs(g, exist_ok=True)
    for f in glob.glob(os.path.join(crawl, 'guides', '*.json')):
        shutil.copy(f, g)

# components are rebuilt from scratch (Cover and Icons are kept: they have their own builders)
comp = os.path.join(ROOT, 'project', 'components')
for d in os.listdir(comp):
    p = os.path.join(comp, d)
    if os.path.isdir(p) and d not in ('Cover', 'Icons'):
        shutil.rmtree(p)

for step in ('build_tokens.py', 'build_palette.py', 'build_icons.py', 'build_components.py', 'build_dev.py', 'build_index.py'):
    print('==', step)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', step)], check=True)
