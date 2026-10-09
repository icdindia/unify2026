# Unify DS — Figma + Claude setup

How the Unify design system is wired between Figma and Claude Code in this workspace (`~/Unify2026`). Built from what is on disk and what this session's Figma calls returned.

## 1. Figma sources
| What | Key / ID | Used for |
|---|---|---|
| DS component + variable source | `qT9zH1YYapGTwpJxwNEGzt` ("❖ Unify2026 Design System") | Components, variables, text styles. The What's-new frame was built here, on page `↳ Alerts & notifications ✅` |
| Product screens | `jcbxvaNrZCWeQsIiZRta6F` (UnifyApps Platform 2026) | Screens rebuilt to HTML |
| DT / Telekom pilot | `7rTRWGh6A7jaG7JNuk84q0` (EB-for-DT-2026) | Separate DT Design System work |

## 2. Figma tooling Claude can use
| Tool | Role | Notes |
|---|---|---|
| Official Figma MCP (`use_figma`, `get_metadata`, `get_screenshot`, `get_design_context`, `get_variable_defs`, `search_design_system`, …) | Main read/write path | Runs remotely and **cannot see local fonts** |
| `figma-console` MCP (`figma_execute`, `figma_get_variables`, …) | Desktop Bridge plugin; needed for text with local-only fonts (TeleNeo) | Plugin manifest: `~/.figma-console-mcp/plugin/manifest.json`. Lacks `createAutoLayout`, `node.set` and `query` |
| `Figma` desktop MCP | Dev Mode server (read-only) | Interchangeable with the remote server for reads |
| `pencil` MCP | Configured in `~/.claude.json` | **Fails to connect** (`/Applications/Pencil.app` binary missing) |

Required order for writes: load the `figma-use` skill, then call `use_figma` with `skillNames: "figma-use"`. For whole screens also load `figma-generate-design`.

## 3. Skills
- `unify-enterprise-os` — project skill at `.claude/skills/unify-enterprise-os/`. It is the entry point for Figma→HTML and HTML→Figma.
  - `references/`: `chrome.md` (nav rail, breadcrumb, composer values), `failure-modes.md`, `verification.md`
  - `scripts/`: `fetch_assets.py`, `inline_assets.py`, `measure_frame.js`, `check_geometry.py`
- Plugin skills: `figma:figma-use`, `figma:figma-generate-design`, `figma:figma-generate-library`, `figma:figma-code-connect`, `figma:figma-design-to-code`.

## 4. Repo layout (`~/Unify2026`)
| Path | Purpose |
|---|---|
| `FIGMA-TO-HTML.md` | Rulebook, Figma → HTML (read with `shared/DRIFT-LOG.md`) |
| `HTML-TO-FIGMA.md` | Rulebook, HTML → Figma (read with `shared/MISSING-COMPONENTS.md`) |
| `shared/` | `tokens.css`, `tokens.live-overrides.css`, `typography.css`, `svg-icons/`, `DRIFT-LOG.md`, `MISSING-COMPONENTS.md` |
| `components/` | HTML atoms and molecules (`button`, `nav-rail`, `form-header`, `audience-picker`, …), each with CSS and `preview.html`; catalogued in `components/index.html` |
| `prototypes/` | Clickthroughs: playbook-studio, knowledge-agent, template-studio, localization, access-picker |
| `figma-frames/` | Verbatim frame rebuilds |
| `tools/` | `verify.sh`, `check-drift.py` and similar |
| `dt-design-system/` | Separate ODS/Telekom design system (not Unify) |
| `.claude/launch.json` | Dev servers, one per prototype/frame (python `http.server`, ports 4173–4184) |

The companion repo `~/unify-ds` (Figma-authoring: `ds/tokens/*.json`, `ds/components.md`, `ds/figma-keys.md`, `ds/design-rules.md`) is read-only from this pipeline.

## 5. Design-system facts
- **Fonts:** Geist (text styles `Text xs/sm/md/lg/xl`, `Display xs…2xl`, each Regular/Medium/Semibold/Bold).
- **Variable collections** (`_Primitives`, `1. Colors`, `2. Radius`, `3. Spacing`, `4. Widths`, `5. Containers`, `6. Fonts`). Examples used this session:
  - Colours: `Colors/Text/text-primary (900)`, `Colors/Border/border-tertiary`, `Colors/Background/bg-primary`, `Colors/Utility/Error/utility-error-500`
  - Spacing: `spacing-xs…2xl`
  - Radius: `radius-lg`, `radius-xl`, `radius-full`
- **Components used this session:** Toggle group, Notification_Panel Unit, Scroll bar, Dot, Avatar, Buttons/Link.
- Token values vary per frame and per mode, so read them live from the frame being built. The 25-Jun token export is not authoritative.
- Never hand-draw icons; fetch assets (Figma URLs expire in about 7 days).

## 6. Claude memory
`~/.claude/projects/-Users-lisarath-Unify2026/memory/` holds the index `MEMORY.md` plus notes on playbook-studio (prototype and design decisions), knowledge-agent, template-studio, localization, access-picker, and the DT design system.

## 7. Connector status
- Authenticated and working this session: official Figma MCP, figma-console, Chrome, Google Drive, Shopify.
- Need OAuth: most small-business and marketing connectors (Slack, Notion, HubSpot, Canva, …).
- Failing: `pencil` (missing binary), `plugin:github:github` (400, badly formatted Authorization header).
