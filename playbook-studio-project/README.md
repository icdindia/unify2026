# ChargePoint Playbook Studio

An agentic prototype for ChargePoint's Contract Lifecycle Management team. Pick a
contract type, connect the executed-agreement corpus, answer three questions, get a
negotiation playbook: every provision with a five-tier position ladder, the clauses it
moves, copy-ready language and the precedent behind each rung.

Built to sit inside **UnifyApps / Enterprise Brain Base 2026**, mapped frame by frame
from the Figma file.

```
playbook-studio.html     the entire prototype, one self-contained file (~2,960 lines)
CLAUDE.md                working rules — read this first
docs/                    design decisions and the full review history
scripts/                 Playwright verification scripts
```

## Run it

The file is authored to be published as a Claude Artifact, so it carries no `<html>`,
`<head>` or `<body>` tags — the artifact runtime supplies those. To open it locally,
wrap it:

```bash
node -e '
const fs=require("fs");
fs.writeFileSync("preview.html",
 "<!doctype html><html><head><meta charset=\"utf-8\"></head><body>"
 + fs.readFileSync("playbook-studio.html","utf8") + "</body></html>");
'
open preview.html
```

Every script in `scripts/` does this for you.

## Verify a change

```bash
npm i -D playwright && npx playwright install chromium   # once
node scripts/navdiv.js    # rail geometry
node scripts/hdr.js       # artifact header
node scripts/wide.js      # master/detail widths
node scripts/tip.js       # tooltips + full walkthrough
```

Each prints computed geometry and writes a PNG. Look at the PNG — numbers alone have
missed real defects. Watch the `pageerror` output too; a `ReferenceError` in a render
function silently blanks a pane.

Scripts assume Chromium at `/opt/pw-browsers/chromium` (the cloud sandbox path). Locally,
drop the `executablePath` option or point it at your own install.

## The walkthrough the scripts drive

`[data-type="msa"]` → grant the document source (`always`) and redlines (`once`) →
three `.qc-opt` answers → the playbook artifact opens in the right-hand canvas.

## Where the live version lives

<https://claude.ai/code/artifact/eb5509f7-5572-4deb-8c9f-0f49ba804edb> — version 26.
Editing here does not republish it; to push a new version, open the file in a Claude
session with the Artifact tool and republish against that URL.
