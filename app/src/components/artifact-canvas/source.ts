// The "code" side of the preview / code toggle: an abridged HTML source of the Acme dashboard, built from its data so
// the two views agree. Not drawn in Figma (the toggle has no code frame); it only answers the click.
import { ACCOUNT, FEATURES, JOURNEY, KPIS, TABS } from './acme/data'

export function acmeSource(name: string): string[] {
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    `  <title>${name}</title>`,
    '  <link rel="stylesheet" href="dashboard.css">',
    '</head>',
    '<body>',
    '  <main class="account">',
    '    <header class="account__head">',
    `      <h1>${ACCOUNT.name} <span class="risk">${ACCOUNT.risk}</span></h1>`,
    `      <p>${ACCOUNT.meta}</p>`,
    `      <p class="renewal">${ACCOUNT.renewal} <small>${ACCOUNT.renewalLabel}</small></p>`,
    '    </header>',
    '    <ul class="kpis">',
    ...KPIS.map(k => `      <li><b>${k.label}</b> ${k.value} <span class="${k.trend.dir}">${k.trend.value} ${k.trend.label}</span></li>`),
    '    </ul>',
    '    <ol class="journey">',
    ...JOURNEY.map(s => `      <li class="${s.state}">${s.label} <time>${s.date}</time></li>`),
    '    </ol>',
    '    <nav role="tablist">',
    ...TABS.map(t => `      <button role="tab">${t.label}</button>`),
    '    </nav>',
    '    <section id="adoption">',
    '      <h2>Adoption</h2>',
    '      <canvas id="overall-usage" data-range="12M"></canvas>',
    '      <ul class="features">',
    ...FEATURES.map(f => `        <li>${f.name} <meter value="${f.pct.replace('%', '')}" max="100"></meter> ${f.pct}</li>`),
    '      </ul>',
    '    </section>',
    '  </main>',
    '  <script src="dashboard.js"></script>',
    '</body>',
    '</html>',
  ]
}
