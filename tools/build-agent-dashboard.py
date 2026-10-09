import os, html, re

ICON_DIR = "/Users/lisarath/Unify2026/shared/svg-icons"
OUT      = "/Users/lisarath/Unify2026/prototypes/agent-dashboard/index.html"

def icon(name):
    p = os.path.join(ICON_DIR, f"{name}.svg")
    s = open(p).read().strip()
    s = re.sub(r"<\?xml.*?\?>", "", s, flags=re.S).strip()
    return s

def esc(t): return html.escape(str(t), quote=False)

FIGMA_FILE = "jcbxvaNrZCWeQsIiZRta6F"
def tag(component, figma_name, node_id):
    """Tagging contract (FIGMA-TO-HTML.md). data-figma-key omitted where the
    component is not yet keyed in ds/figma-keys.md — see MISSING-COMPONENTS.md."""
    return (f'data-component="{component}" data-figma-name="{esc(figma_name)}" '
            f'data-figma-file="main" data-figma-node="{node_id}"')

# ---------------------------------------------------------------- atoms
def pill_solid(text, node, mod="pill--gray"):
    return (f'<span class="pill pill--solid {mod}" {tag("pill","Pill solid",node)}>'
            f'{esc(text)}</span>')

def pill_status(text, node, mod="pill--warning", dot=True, ic=None):
    """Pill squared `sm` — leading dot by default, leading icon when `ic` is set."""
    if ic:
        lead = f'<span class="pill__icon">{icon(ic)}</span>'
    elif dot:
        lead = f'<span class="pill__dot">{icon("dot")}</span>'
    else:
        lead = ""
    return (f'<span class="pill pill--squared {mod}" {tag("pill","Pill squared",node)}>'
            f'{lead}{esc(text)}</span>')

def pill_chip(text, node, mod="pill--gray"):
    """Pill squared `xs / False / Gray` — the token chip once mis-read as "Badge"."""
    return (f'<span class="pill pill--squared pill--xs {mod}" {tag("pill","Pill squared",node)}>'
            f'{esc(text)}</span>')

def stat(value, label, node, tone=None, last=False, trailing=""):
    tone_c = f" stat__value--{tone}" if tone else ""
    div    = "" if last else " stat--divided"
    return (f'<div class="stat{div}" {tag("stat","Stat",node)}>'
            f'<div class="stat__body">'
            f'<div class="stat__value-row"><span class="stat__value{tone_c}">{esc(value)}</span>{trailing}</div>'
            f'<div class="stat__label">{esc(label)}</div>'
            f'</div></div>')

def alert(lead, rest, node, kind="warning", ic="alert-triangle", trailing=""):
    lead_h = f'<span class="alert__lead">{esc(lead)}</span>' if lead else ""
    return (f'<div class="alert alert--{kind}" {tag("alert","Alert",node)}>'
            f'<div class="alert__content">'
            f'<span class="alert__icon">{icon(ic)}</span>'
            f'<span class="alert__text">{lead_h}<span>{esc(rest)}</span></span>'
            f'</div>{trailing}</div>')

def form_header(title, count, subtitle, node, action=None, featured=None, strong_sub=False, level=None):
    cnt = f' {pill_solid(count, node)}' if count else ""
    act = ""
    if action:
        act = (f'<div class="form-header__actions">'
               f'<button type="button" class="form-header__action">{esc(action)}'
               f'{icon("arrow-up-right")}</button></div>')
    feat = f'<span class="form-header__featured">{icon(featured)}</span>' if featured else ""
    sub_c = "form-header__subtitle form-header__subtitle--strong" if strong_sub else "form-header__subtitle"
    lvl = f" form-header--level-{level}" if level else ""
    return (f'<div class="form-header{lvl}" {tag("form-header","Form Header",node)}>'
            f'<div class="form-header__content">'
            f'<div class="form-header__icon-title">{feat}'
            f'<div class="form-header__text">'
            f'<div class="form-header__title-row"><span class="form-header__title">{esc(title)}</span>{cnt}</div>'
            f'<span class="{sub_c}">{esc(subtitle)}</span>'
            f'</div></div>{act}</div></div>')

def kv_row(label, sub, badge_html, node):
    return (f'<div class="key-value-row" {tag("key-value-row","Key Value Horizontal",node)}>'
            f'<div class="key-value-row__content"><div class="key-value-row__label-body">'
            f'<div class="key-value-row__label-wrap">'
            f'<span class="key-value-row__label">{esc(label)}</span>'
            f'<span class="key-value-row__sublabel">{esc(sub)}</span></div>'
            f'<div class="key-value-row__body"><div class="key-value-row__badges">{badge_html}</div></div>'
            f'</div></div></div>')

def detail_row(label, value_html, node):
    return (f'<div class="detail-row" {tag("detail-row","Row",node)}>'
            f'<span class="detail-row__label">{esc(label)}</span>{value_html}</div>')

def stacked_row(ic, label, chips, node):
    ch = "".join(chips)
    return (f'<div class="detail-row detail-row--stacked" {tag("detail-row","Row",node)}>'
            f'<div class="detail-row__heading">'
            f'<span class="detail-row__heading-icon">{icon(ic)}</span>'
            f'<span class="detail-row__label">{esc(label)}</span></div>'
            f'<div class="detail-row__chips">{ch}</div></div>')

def activity_row(initial, who, what, when, node):
    return (f'<div class="detail-row" {tag("detail-row","Row",node)}>'
            f'<div class="detail-row__actor">'
            f'<span class="avatar avatar--sm" {tag("avatar","Avatar",node)}>{esc(initial)}</span>'
            f'<span class="detail-row__sentence"><b>{esc(who)}</b> {esc(what)}</span></div>'
            f'<span class="detail-row__time">{esc(when)}</span></div>')

DIV  = '<div class="detail-divider"></div>'
KVD  = '<div class="key-value-divider"></div>'

# ---------------------------------------------------------------- nav rail
NAV_MAIN = [("ai-agent","Agents",False),("lc-card","Apps",False),("zap","Automations",True),
            ("structure","Workflows",False),("database-01","Data",False),("grid-plus","Integrations",False)]
NAV_FOOT = [("shield-agent-2","Agent governance",False),("shield-01","Security",False),
            ("layers-three-01","Environments",False),("settings-01","Settings",False),
            ("bell-01","Notifications",False),("ai-es-chat","Assistant",False)]

def nav_item(ic, label, current):
    cur = ' aria-current="page"' if current else ""
    return (f'<button type="button" class="nav-rail__item"{cur} title="{esc(label)}" '
            f'aria-label="{esc(label)}"><span class="nav-rail__item-content">{icon(ic)}</span></button>')

nav = (f'<nav class="nav-rail" {tag("nav-rail","New_Platform Navigation","16740:306223")} aria-label="Platform">'
       f'<div class="nav-rail__content">'
       f'<div class="nav-rail__top">'
       f'<div class="nav-rail__brand"><span class="nav-rail__logo">{icon("unify-logo")}</span></div>'
       f'<div class="nav-rail__group">' + "".join(nav_item(*n) for n in NAV_MAIN) + '</div></div>'
       f'<div class="nav-rail__footer">' + "".join(nav_item(*n) for n in NAV_FOOT) +
       f'<span class="nav-rail__badge">{pill_solid("99+","I16740:306223;64877:37833","pill--error-solid pill--full")}</span>'
       f'<div class="nav-rail__user"><span class="avatar avatar--md">T</span></div>'
       f'</div></div></nav>')

# ---------------------------------------------------------------- header
header = (f'<header class="page-header" {tag("page-header","Page Header","16740:306227")}>'
  f'<div class="page-header__stack">'
  f'<div class="page-header__breadcrumbs"><div class="breadcrumb-bar">'
  f'<div class="breadcrumb-bar__trail">'
  f'<button type="button" class="breadcrumb-bar__workspace"><span class="breadcrumb-bar__workspace-inner">'
  f'<span class="breadcrumb-bar__icon">{icon("globe-01")}</span>'
  f'<span class="breadcrumb-bar__link">Workspace Name 1</span></span>'
  f'<span class="breadcrumb-bar__icon">{icon("clock")}</span></button>'
  f'<span class="breadcrumb-bar__rule"></span>'
  f'<nav class="breadcrumb-bar__crumbs" aria-label="Breadcrumb">'
  f'<a class="breadcrumb-bar__link" href="#">Automations</a>'
  f'<span class="breadcrumb-bar__sep">{icon("slash-divider")}</span>'
  f'<span class="breadcrumb-bar__current" aria-current="page">Hatim-test-automation</span></nav>'
  f'</div>'
  f'<div class="breadcrumb-bar__aside"><span class="ai-fde">'
  f'<span class="ai-fde__icon">{icon("ai-star")}</span>AI FDE</span></div>'
  f'</div></div>'
  f'<div class="page-header__main"><div class="page-header__heading">'
  f'<div class="page-header__title-row">'
  f'<button type="button" class="small-icon-btn" aria-label="Back">{icon("chevron-left-single")}</button>'
  f'<h1 class="page-header__title">Sales Copilot</h1>'
  f'{pill_solid("10","I16740:306227;63883:33500")}</div>'
  f'<div class="page-header__supporting">'
  f'<span class="page-header__supporting-icon">{icon("salesforce")}</span>'
  f'<span class="page-header__supporting-text">Salesforce Agentforce</span></div>'
  f'</div></div></div></header>')

TABS = ["Overview","Observability","Monitoring","Incidents","Policies","Evaluators","Settings"]
tabs = (f'<div class="horizontal-tabs" {tag("horizontal-tabs","Horizontal tabs","16740:306236")}>'
        f'<div class="horizontal-tabs__list" role="tablist">' +
        "".join(f'<button type="button" role="tab" class="horizontal-tabs__tab" '
                f'aria-selected="{"true" if i==0 else "false"}">{esc(t)}</button>'
                for i, t in enumerate(TABS)) +
        '</div></div>')

# ---------------------------------------------------------------- left column
value_stats = (
 f'<div class="stats-row stats-row--divided">'
 + stat("10.2K","Tasks handled / 30 days","16740:306247")
 + stat("$363","Cost / 30 days","16740:306256")
 + stat("$0.035","Cost / task","16740:306265", last=True) + '</div>'
 f'<div class="stats-row">'
 + stat("1.9%","Error rate / 30 days","16740:306274", tone="error")
 + stat("5.3s","Latency · P50","16740:306283")
 + stat("12.9s","Latency · P99","16740:306291", tone="success", last=True,
        trailing=pill_solid("SLA 8.0s","16740:306300","pill--gray-solid"))
 + '</div>')

gov_rows = (
  kv_row("Mask PII before model calls","via Customer data protection",
         pill_status("Mask","I16740:306337;61060:105090","pill--brand",dot=False),"16740:306337") + KVD +
  kv_row("Approve PII in outbound messages","via Customer data protection",
         pill_status("Require approval","16740:306340","pill--warning",dot=False),"16740:306340") + KVD +
  kv_row("Block secrets in output","via Customer data protection",
         pill_status("Block","16740:306343","pill--error",dot=False),"16740:306343") + KVD +
  kv_row("Approve PII in outbound messages","via Customer data protection",
         pill_status("Require approval","16740:306346","pill--warning",dot=False),"16740:306346"))

# Figma 16740:306305 holds TWO sibling cards, gap 8:
#   306306  pt+px 16, radius 12 — alert + stats
#   306333  py 16,    radius 12 — alert + key-value rows (rows carry px 16)
governance = (
 f'<div class="section__cards">'
 f'<div class="section-card section-card--inset-x section-card--pad-top">'
 + alert("Observe · Advisory","Out-of-band — controls run advisory and cannot block in real time.","16740:306307")
 + f'<div class="stats-row">'
 + stat("1.9%","Policies","16740:306309", tone="success")
 + stat("5.3s","Controls","16740:306317")
 + stat("12.9s","Advisory","16740:306325", tone="error", last=True)
 + '</div></div>'
 f'<div class="section-card section-card--pad-y">'
 f'<div class="gov-alert-wrap">'
 + alert("5 controls would block or redact at the Control tier",
         "— connect inline to enforce them.","16740:306336") + '</div>'
 + gov_rows +
 f'</div></div>')

incidents = (
 f'<div class="stats-row">'
 + stat("2","Open","16740:306352", tone="error")
 + stat("3","Resolved","16740:306360")
 + stat("1","Critical","16740:306368", tone="error")
 + stat("2","Medium","16740:306376", tone="error")
 + stat("1","Low","16740:306384", last=True) + '</div>'
 f'<div class="incidents-alert-wrap">'
 + alert("Most recent:","Mask PII before model calls","16740:306392", kind="neutral",
         ic="info-circle", trailing='<span class="detail-row__time">2hr ago</span>')
 + '</div>')

left = (
 f'<div class="section">' + form_header("Value & performance","10","What this agent delivers, and at what cost","16740:306244", action="View Traces")
 + f'<div class="section-card section-card--inset-x">{value_stats}</div></div>'
 f'<div class="section">' + form_header("Governance","10","Policies and controls in effect on this agent","16740:306304", action="View Compliance")
 + governance + '</div>'
 f'<div class="section">' + form_header("Incidents","10","Governance incidents raised on this agent","16740:306349", action="View Incidents")
 + f'<div class="section-card section-card--inset-x">{incidents}</div></div>')

# ---------------------------------------------------------------- right rail
details_card = (
 f'<div class="section-card">'
 f'<div class="section-card__pad" style="display:flex;flex-direction:column;gap:var(--spacing-md)">'
 + form_header("AGT-2021","10","Salesforce Agentforce","16740:306398",
               featured="salesforce", strong_sub=True)
 + alert("", "Guides account executives through lead research, opportunity notes, and CRM updates.",
         "16740:306399", kind="neutral", ic="info-circle")
 + '</div>'
 f'<div class="section-card__pad" style="display:flex;flex-direction:column;gap:var(--spacing-lg);padding-top:0">'
 + detail_row("Connection type", pill_status("Observe · Advisory","16740:306403", ic="alert-triangle-sm"), "16740:306401") + DIV
 + detail_row("Status", pill_status("Stup Pending","16740:306407"), "16740:306405") + DIV
 + detail_row("Owner", '<span class="detail-row__value">Nina Patel</span>', "16740:306409") + DIV
 + detail_row("Workspace", '<span class="detail-row__value">Unassigned</span>', "16740:306413") + DIV
 + detail_row("Department", '<span class="detail-row__value">Claims</span>', "16740:306417") + DIV
 + detail_row("Environment", '<span class="detail-row__value">Production</span>', "16740:306421") + DIV
 + detail_row("Model", '<span class="detail-row__value">External agent</span>', "16740:306425")
 + '</div></div>')

SCOPE = ["email.send","calendar.read","crm.lookup","crm.update"]
scope_card = (
 f'<div class="section-card"><div class="section-card__pad" '
 f'style="display:flex;flex-direction:column;gap:var(--spacing-lg)">'
 + stacked_row("tool-02","Tools",[pill_chip(c,"16740:306437") for c in SCOPE],"16740:306432") + DIV
 + stacked_row("plug-in","Connections",[pill_chip(c,"16740:306447") for c in SCOPE],"16740:306442") + DIV
 + stacked_row("database-01","Data",[pill_chip(c,"16740:306457") for c in ["Invoices","Inventory"]],"16740:306452")
 + '</div></div>')

changes_card = (
 f'<div class="section-card"><div class="section-card__pad" '
 f'style="display:flex;flex-direction:column;gap:var(--spacing-lg)">'
 + activity_row("N","Nina Patel","changed the autonomy level","3d ago","16740:306463") + DIV
 + activity_row("N","Nina Patel","changed the autonomy level","3d ago","16740:306471") + DIV
 + activity_row("N","Nina Patel","changed the autonomy level","3d ago","16740:306479")
 + '</div></div>')

right = (
 f'<div class="section">' + form_header("Agent details","10","Write an appropriate sub text","16740:306395") + details_card + '</div>'
 f'<div class="section">' + form_header("Access & scope","10","Tools, connections, and data this agent can reach","16740:306429") + scope_card + '</div>'
 f'<div class="section">' + form_header("Recent changes","10","Configuration and ownership audit trail","16740:306460") + changes_card + '</div>')

setup_banner = (
 f'<div class="setup-banner">'
 + form_header("Setup for Salesforce", None, "View your agent's performance here.",
               "16740:306238", featured="salesforce", level=1)
 + '</div>')

CSS = ["../../shared/tokens.css","../../shared/tokens.live-overrides.css","../../shared/typography.css",
       "../../components/nav-rail/nav-rail.css","../../components/page-header/page-header.css",
       "../../components/horizontal-tabs/horizontal-tabs.css","../../components/form-header/form-header.css",
       "../../components/section-card/section-card.css","../../components/stat/stat.css",
       "../../components/alert/alert.css","../../components/pill/pill.css",
       "../../components/key-value-row/key-value-row.css",
       "../../components/detail-row/detail-row.css","../../components/avatar/avatar.css",
       "./agent-dashboard.css"]
links = "\n  ".join(f'<link rel="stylesheet" href="{c}">' for c in CSS)

doc = f"""<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sales Copilot — Agent dashboard · UnifyApps</title>
  <!-- Built from Figma: UnifyApps Platform (1)(2) 2026 · file {FIGMA_FILE}
       Frame "Dashboard" 16740:306222.
       Atoms are <link>ed from /components — never inlined. See FIGMA-TO-HTML.md. -->
  {links}
</head>
<body>
  <button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle colour theme">Theme</button>
  <div class="app-shell">
    {nav}
    <div class="app-main">
      {header}
      <div class="app-content">
        {tabs}
        <div class="working-area">
          {setup_banner}
          <div class="docs-grid">
            <div class="docs-grid__main">{left}</div>
            <aside class="docs-grid__rail">{right}</aside>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="../../components/preview-theme.js"></script>
</body>
</html>
"""
open(OUT, "w").write(doc)
print(f"wrote {OUT}  ({len(doc):,} bytes)")
