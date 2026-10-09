"""Build index.html from template.html using ODS icons and ODS component markup.

%%icon:NAME:SIZE:CLASSES%%          ODS icon (NAME! = selected variant)
%%BTN:ghost|primary:ICON:LABEL:ROLE%% ODS icon-only button, size small
%%CHIP:ICON:LABEL%%                  ODS ToggleChip (transparent bg)
%%NAV%%                              ODS SideNavigation items
Then audits the output: no raw colours, no non-DT fonts, every icon resolved.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
ICONS = json.load(open(os.path.join(ROOT, 'dt-design-system', 'project', 'assets', 'Icons', 'icons.json')))['variants']


def icon(name, size=24, cls='', hidden=True):
    sel = name.endswith('!')
    name = name.rstrip('!')
    variant = ('small-selected' if sel else 'small') if int(size) <= 16 else ('selected' if sel else 'outline')
    vb = 16 if int(size) <= 16 else 24
    inner = ICONS[variant]['svg'][name]  # KeyError = unknown icon: fail the build
    return ('<svg class="ODSIcon %s" xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="0 0 %d %d"%s>%s</svg>'
            % (cls, size, size, vb, vb, ' aria-hidden="true"' if hidden else '', inner)).replace('ODSIcon  ', 'ODSIcon ').replace(' "', '"')


def btn(variant, ico, label, role):
    return ('<button class="ODSRow ODSButton ODSButton--size-small ODSButton--buttonType-iconOnly ODSButton--variant-{v} '
            'ODSButton-ButtonBg--variant-{v} ODSButton-ButtonBg ODSButton-ButtonBg--buttonType-iconOnly ODSButton-ButtonBg--size-small" '
            'type="button" aria-label="{l}"{r}><div class="ODSButton-ButtonBgElement"></div>'
            '<div class="ODSRow ODSButton-Content ODSButton-Content--size-small ODSButton-Content--buttonType-iconOnly">{i}</div></button>'
            ).format(v=variant, l=label, r=(' data-role="%s"' % role) if role else '',
                     i=icon(ico, 24, 'ODSButton-ButtonIcon ODSButton-ButtonIcon--size-small ODSButton-ButtonIcon--buttonType-iconOnly ODSButton-ButtonIcon--variant-' + variant))


def xbtn(variant, ico, label, role):
    """ODS IconButtonXSmall: 24x24, 16px icon, variants primary|secondary|outline|subtle|ghost."""
    return ('<button class="ODSRow ODSIconButtonXSmall" type="button" aria-label="{l}"{r}>'
            '<div class="ODSBox ODSIconButtonXSmall-ButtonBg ODSIconButtonXSmall-ButtonBg--variant-{v}"></div>'
            '<div class="ODSRow ODSIconButtonXSmall-Content">{i}</div></button>'
            ).format(v=variant, l=label, r=(' data-role="%s"' % role) if role else '',
                     i=icon(ico, 16, 'ODSIconButtonXSmall-ButtonIcon ODSIconButtonXSmall-ButtonIcon--variant-' + variant))


def chip(ico, label):
    return ('<button class="ODSToggleChip" aria-pressed="false" type="button"><div class="ODSRow ODSToggleChip-ToggleChip ODSToggleChip-ToggleChip--transparentBg">'
            '%s<span class="ODSToggleChip-Label">%s</span></div></button>') % (icon(ico, 16, 'ODSToggleChip-Icon'), label)


def sbtn(variant, ico, label):
    """ODS Button, size small, standard type with leading icon."""
    return ('<button class="ODSRow ODSButton ODSButton--size-small ODSButton--buttonType-standard ODSButton--variant-{v} '
            'ODSButton-ButtonBg--variant-{v} ODSButton-ButtonBg ODSButton-ButtonBg--buttonType-standard ODSButton-ButtonBg--size-small" type="button">'
            '<div class="ODSButton-ButtonBgElement"></div><div class="ODSRow ODSButton-Content ODSButton-Content--size-small ODSButton-Content--buttonType-standard">'
            '{i}<span class="ODSButton-Label">{l}</span></div></button>'
            ).format(v=variant, l=label, i=icon(ico, 24, 'ODSButton-ButtonIcon ODSButton-ButtonIcon--size-small ODSButton-ButtonIcon--buttonType-standard ODSButton-ButtonIcon--variant-' + variant))


def tag(label):
    """ODS TagStatic, small, subtle: inline citation pill."""
    return ('<span class="ODSRow ODSTagStatic ODSTagStatic--type-subtle ODSTagStatic--size-small">'
            '<span class="ODSTagStatic-Label ODSTagStatic-Label--type-subtle ODSTagStatic-Label--size-small">%s</span></span>') % label


# Collapsed rail: (icon, label, nav key, go target)
NAVC = [('add', 'New Session', 'new', 'new'), ('folder', 'Projects', 'projects', ''), ('clock', 'Routines', 'routines', ''),
        ('calendar', 'Meetings', 'meetings', ''), ('applications', 'Artifacts', 'artifacts', '')]

# Expanded nav: top items, then ODS parent items with subitem lists
NAVX_TOP = NAVC
NAVX_GROUPS = [
    ('agents', 'magenta_ai', 'Agents', ['Financial Analysis Agent', 'Sheet Sage Agent', 'Formula Falcon Agent']),
    ('pinned', 'bookmark', 'Pinned', ['Artifacts', 'Projects', 'Chat 1 inside this Project', 'Chat 2 inside this Project', 'Plan launch timeline', 'Review customer feedback']),
    ('routines', 'clock', 'Routines', ['Get all granola notes summarized and delivered', 'Excel Formula Help From Main Document', 'Design Stand up follow-up meeting']),
    ('history', 'history', 'History', ['Sheet Formula Consultant', 'Workbook Support Hub', 'Morning Digest', 'Spreadsheet Formula Advisor']),
]


def attrs(key, go):
    return ' data-nav="%s"%s' % (key, (' data-go="%s"' % go) if go else '')


def navc():
    out = []
    for ico, label, key, go in NAVC:
        out.append('<li class="ODSColumn ODSSideNavigationItem"><button class="ODSRow ODSSideNavigationItem-IconLabelContainer" type="button" aria-label="%s"%s>'
                   '<div class="ODSRow ODSSideNavigationItem-IconLabel"><div class="ODSRow ODSSideNavigationItem-IconContainer">%s</div></div></button></li>'
                   % (label, attrs(key, go), icon(ico, 24, 'ODSSideNavigationItem-Icon')))
    return '\n'.join('          ' + x for x in out)


def navx():
    out = []
    for ico, label, key, go in NAVX_TOP:
        out.append('<li class="ODSColumn ODSSideNavigationItem ODSSideNavigationItem--navExpanded"><button class="ODSRow ODSSideNavigationItem-IconLabelContainer ODSSideNavigationItem-IconLabelContainer--navExpanded" type="button"%s>'
                   '<div class="ODSRow ODSSideNavigationItem-IconLabel ODSSideNavigationItem-IconLabel--navExpanded"><div class="ODSRow ODSSideNavigationItem-IconContainer">%s</div>'
                   '<div class="ODSRow ODSSideNavigationItem-LabelContainer"><span class="ODSSideNavigationItem-Label ODSSideNavigationItem-Label--navExpanded">%s</span></div></div>'
                   '<div class="ODSRow ODSSideNavigationItem-IconsContainer"></div></button></li>'
                   % (attrs(key, go), icon(ico, 24, 'ODSSideNavigationItem-Icon ODSSideNavigationItem-Icon--navExpanded'), label))
    for gid, ico, label, items in NAVX_GROUPS:
        subs = []
        for i, it in enumerate(items):
            k = '%s-%d' % (gid, i)
            subs.append('<li class="ODSColumn ODSSideNavigationSubitem-container"><button class="ODSRow ODSSideNavigationSubitem" type="button"%s>'
                        '<div class="ODSRow ODSSideNavigationSubitem-IconLabelContainer"><span class="ODSSideNavigationSubitem-Label">%s</span>'
                        '<div class="ODSRow ODSSideNavigationSubitem-IconsContainer"><div class="ODSRow ODSSideNavigationSubitem-LockIconContainer"></div></div></div></button></li>'
                        % (attrs(k, 'chat' if gid in ('history', 'routines', 'pinned') else ''), it))
        out.append('<li class="ODSColumn ODSSideNavigationItem ODSSideNavigationItem--navExpanded dt-group"><button class="ODSRow ODSSideNavigationItem-IconLabelContainer ODSSideNavigationItem-IconLabelContainer--navExpanded" type="button" aria-expanded="true" aria-controls="grp-%s">'
                   '<div class="ODSRow ODSSideNavigationItem-IconLabel ODSSideNavigationItem-IconLabel--navExpanded"><div class="ODSRow ODSSideNavigationItem-IconContainer">%s</div>'
                   '<div class="ODSRow ODSSideNavigationItem-LabelContainer"><span class="ODSSideNavigationItem-Label ODSSideNavigationItem-Label--parent ODSSideNavigationItem-Label--navExpanded">%s</span></div></div>'
                   '<div class="ODSRow ODSSideNavigationItem-IconsContainer"><div class="ODSRow ODSSideNavigationItem-ExpandAndCollapseIcon">%s</div></div></button>'
                   '<div class="ODSColumn ODSSideNavigationList" id="grp-%s" aria-label="%s" aria-hidden="false"><ul class="ODSColumn ODSSideNavigationList-ListContainer">%s</ul></div></li>'
                   % (gid, icon(ico, 24, 'ODSSideNavigationItem-Icon ODSSideNavigationItem-Icon--navExpanded ODSSideNavigationItem-Icon--parent'), label,
                      icon('collapse_up', 24, ''), gid, label, ''.join(subs)))
    return '\n'.join('          ' + x for x in out)


src = open(os.path.join(HERE, 'template.html')).read()
# cache-bust the DT stylesheets with their content hash so a rebuilt bundle is always picked up
import hashlib
for rel in ['dt-design-system/foundations/dt-foundations.css', 'dt-design-system/project/components/bundle.css']:
    h = hashlib.md5(open(os.path.join(ROOT, rel), 'rb').read()).hexdigest()[:8]
    src = src.replace('../../' + rel + '"', '../../' + rel + '?v=' + h + '"')
src = src.replace('%%NAVC%%', navc()).replace('%%NAVX%%', navx())
src = re.sub(r'%%icon:([a-z_!]+):(\d+):([^%]*)%%', lambda m: icon(m.group(1), m.group(2), m.group(3)), src)
src = re.sub(r'%%BTN:(ghost|primary):([a-z_]+):([^:%]+):([^%]*)%%', lambda m: btn(*m.groups()), src)
src = re.sub(r'%%XBTN:(primary|secondary|outline|subtle|ghost):([a-z_]+):([^:%]+):([^%]*)%%', lambda m: xbtn(*m.groups()), src)
src = re.sub(r'%%SBTN:(ghost|primary|secondary|outline):([a-z_]+):([^%]+)%%', lambda m: sbtn(*m.groups()), src)
src = re.sub(r'%%TAG:([^%]+)%%', lambda m: tag(m.group(1)), src)
src = re.sub(r'%%CHIP:([a-z_]+):([^%]+)%%', lambda m: chip(*m.groups()), src)

# ---------------- audit ----------------
problems = []
if '%%' in src:
    problems.append('unresolved placeholder: ' + src[src.index('%%'):src.index('%%') + 40])
style = re.search(r'<style>([\s\S]*?)</style>', src).group(1)
for m in re.finditer(r'#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(', style):
    problems.append('raw colour in page CSS: ' + style[max(0, m.start() - 30):m.end() + 10].strip())
for m in re.finditer(r'(\d+(\.\d+)?)px', style):
    problems.append('raw px in page CSS: ' + style[max(0, m.start() - 30):m.end()].strip())
for bad in ['Geist', 'Spectral', 'Inter', 'Unify', 'unify', '--color-', 'shared/tokens']:
    if bad in src:
        problems.append('non-DT reference: ' + bad)
body = src[src.index('<body>'):]
for m in re.finditer(r'style="([^"]*)"', body):
    problems.append('inline style: ' + m.group(1))
defined = set()
for rel in ['dt-design-system/foundations/dt-foundations.css', 'dt-design-system/project/components/bundle.css']:
    defined |= set(re.findall(r'(--[A-Za-z0-9_-]+)\s*:', open(os.path.join(ROOT, rel)).read()))
for name in sorted(set(re.findall(r'var\((--[A-Za-z0-9_-]+)', style))):
    if name not in defined:
        problems.append('token not defined by DT stylesheets: ' + name)
open(os.path.join(HERE, 'index.html'), 'w').write(src)
print('index.html written, %d KB' % (len(src) // 1024))
if problems:
    print('AUDIT FAILED:'); [print('  -', p) for p in problems]; sys.exit(1)
print('audit: no raw colours/px, no inline styles, no Unify/Geist/Spectral references, all icons resolved, every var(--token) defined')
