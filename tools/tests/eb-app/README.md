# eb-app regression suite

Checks the Enterprise Brain React prototype (`app/`, built to `dist/eb-app.html`) in headless Chrome. It needs only
Node 22+ (built-in `WebSocket`), Python 3 with Pillow, and Google Chrome. There are no npm dependencies.

```sh
bash tools/tests/eb-app/run.sh                 # every suite against the current dist/eb-app.html
bash tools/tests/eb-app/run.sh --build         # npm run build in app/ first
bash tools/tests/eb-app/run.sh frames gallery  # some suites
VERBOSE=1 bash tools/tests/eb-app/run.sh       # also print INFO lines (counts, measurements)
```

The exit code is 0 when every check passes. Results are written to `tools/tests/eb-app/out/`, which each run wipes:

- `results.json`: every check, with details on failures
- screenshots and diffs: `oracle-*.png`, `app-*.png`, `diff-*.png`, `resp-*.png`
- the context wrapper pages

Chrome defaults to `/Applications/Google Chrome.app`. Set `CHROME=/path/to/chrome` to use another binary.

## Suites

| Suite | What it checks |
|---|---|
| `static` | `tsc --noEmit` is clean. `tools/gen-frames.py --check` passes, so the frame map matches BUILD-PLAN 2.2 and every `journey.json`. `tools/verify.sh` has no FAIL under `app/src`. Every gallery page exports a component and `meta { title, figmaNodeIds, group }`. Every CSS import resolves. Every component file renders a `data-node-id`. |
| `frames` | Every FRAMES URL (all journeys, scraped from `#/gallery/frame-map`) renders a built screen, a gallery page or the "Not built yet" placeholder for that frame. None may redirect, hit the error boundary or log a console error. On each URL the review bar names the step and links the frame in Figma (in the strip, or in the Review ▾ popover when the bar is folded). ‹ › walks the steps in Figma order across built and not-built screens, Back returns, and the step picker works. The contract checks on `#/gallery/build-coverage` (fixtures, FIXES ledger, chat scripts) all say OK, and its counts (built, in part, gallery, placeholder, redirect) add up to the frame total. |
| `router` | The router and the review harness, each with the repro of a defect it once had. Back, Forward and ‹ restore the nav and rail a frame is drawn with (exact match). A built screen that ignores some of a frame URL's keys (pinning 02's `menu=` and `hover=` on the Projects landing) reads `≈`, tags the shell with the frame it draws, and is not counted built. Stepping between two steps on one URL with `>` adds no history entry. Option 1 / 2 keep the URL canonical. Undecodable project slugs redirect. The review chrome never drops focus to `<body>` (Figma link copy field, "Show it", the viewport note). At 1440 the dashboard strip shows As designed / With fixes, Option 1 / 2 and Nav Dark / Light. `#/new` (the built landing) picks the closest frame that agrees with the visible nav, and a nav switch re-tags it. With a long crumb at 390 / 430 / 500 the Review ▾ button clears the crumb and nothing scrolls sideways. `EB_APP_FILE=/path/to/eb-app.html` runs it against another build. |
| `artifacts` | The Artifacts clickthrough, as a visitor gets it. At 1440 the landing draws twelve 288 x 260 cards at the file's positions. The card ⋯ menu reads Pin … Delete. Clone adds the clone as the last card, and Delete goes through the Delete Artifact modal and removes it. The type filter filters, and list view and the empty seed draw. A card opens `/view/<id>?from=artifacts` with Back, "Edit with Chat" and the Rename / Clone / Delete name menu, and Back returns. The drawn clone reads "Start Chat". |
| `gallery` | `#/gallery` lists every `app/src/gallery/pages/*.tsx` under a group heading. Every page renders its title and specimens and links each Figma node in its `meta`, at 1440 and at 390. No page logs a console error, and none scrolls sideways at 390. Each room on `#/gallery/review-bar` shows the fold it names. Tabbing onto each Button kind and the avatar add button draws the sets' pale halo with a transparent outline as designed, and with `?fixes=on` (fix `button-focus-ring-3-to-1`) also a 2px outline of at least 3:1 on white. The option menu's shadow is `#e6e4e0`, utility-gray-300 as the Figma file resolves it. |
| `playback` | `#/gallery/script-player`: a `sheet=` that is an `Object.prototype` key (`constructor`, `__proto__`, `toString`, …) falls back to the commit chat instead of the error boundary. The page's script checks (`scriptProblems` in `app/src/playback/engine.ts`: unique `at=` ids, no stall, no beat held 0 ms) say OK for every chat. Live play at 10× shows every timed beat of the commit run in order, `cot-collapsed` included. `EB_APP_URL` points it at another build. |
| `contexts` | The single-file build works in five contexts: `file://`, `http://`, a sandboxed `srcdoc` iframe (how preview panes show it; the router keeps routes in memory there), a sandboxed `src` iframe, and a 390px iframe. In each it runs: landing, card to dashboard (titled "Client Onboarding" as designed, the project's name with fix `crumb-shows-project-name`), the header menu with Escape and focus return, breadcrumb back, review-bar stepping from Projects 01 onto nav-light 01 (the built New Session landing in the light nav) and back, and rail toggle (at 390: the nav overlay). |
| `keyboard` | Real key events. Every Tab stop on the Projects screens has a name, is visible and draws a focus ring; the nav comes first and the review bar last. The header, row (with submenu) and card menus work by keyboard and Escape returns focus. Collapse and expand hand focus over. The narrow nav overlay keeps the page inert and closes on Escape. Focus is not dropped on route changes. The modal traps focus and returns it. |
| `overlays` | Overlays and menus, each with the repro of a defect it once had. A modal never drops focus to `<body>` when it closes: the Delete Q3 Forecast confirm disables its own trigger (focus goes to the next control), "Close both" on nested modals returns to the first modal's trigger, Escape from a modal opened from a ⋯ menu returns to the ⋯, and a confirm that removes its row hands focus to the next row (`#/gallery/modal`). Tab past a keyboard-opened popover continues from its trigger and Shift+Tab returns to it, closing it either way. `#/gallery/option-menu` opens at the top and the keyboard scrolls only the list's own box. No `aria-labelledby` / `aria-describedby` dangles on `#/gallery` or `#/gallery/modal`. Figma measures: the role menu's Commenter row (check at x 196) and prohibition icon, the Apps / Download menu at 332 x 342 with logos and Copy to clipboard, option menu radius 6 (sm) / 8 (md), the tooltip shortcut chip in Inter. `EB_APP_URL` points it at another build. |
| `composer` | Composer and Tags field, each with the repro of a defect it once had, every case on a fresh page. Pressing Stop by keyboard, or the answer ending while Stop has focus, hands focus to the action that takes Stop's place (Voice mode), not `<body>`; focus moved away from Stop stays away. The Enter that confirms an IME conversion (Safari order: `compositionend`, then keydown 229) neither sends nor queues, keys pressed during a composition never reach the `@` / `/` picker, and the Tags field makes no chip of them. `type="bottom"` goes back to Bottom small once the text fits on one line again. The Tags field gallery's role button draws the 12px chevron-down of 11991:750624 (6 x 3.5 at x 397) with "Commenter" at 324. `EB_APP_URL` points it at another build. |
| `responsive` | Nine routes (Projects screens, review states with menus open, a not-built placeholder, the gallery) at 1440, 1280, 1200, 1199, 1024, 900, 787, 768, 600, 500 and 390, in dark and light nav. Nothing scrolls sideways. The nav is the rail under 1200. The title, the review bar and open menus stay on screen. |
| `parity` | Pixel diffs at 1440x900 of the Projects screens in both review modes. **As designed** (fixes off): the app against the Figma frames' reference PNGs in `prototypes/project-dashboard/_ref` (landing 11657:386523, dashboard option 1 14045:584747, option 2 15054:105151, each with its pinned hover state; the row menu as designed against nav-behaviour 07, 13701:756891), with a budget per region of the frame (nav, crumb, header, composer, toolbar, table, card rows) because Chrome and Figma rasterise text differently. The cursor is masked. **With fixes** (`?fixes=on`): the app against `prototypes/project-dashboard`, the HTML oracle that carries every Projects UX change (PROJECT_FIXES), state for state (rest, the frames' hovers, the three menus, option 2, light nav, collapsed rail), with the app's fidelity CSS and signed-in persona injected into the oracle. Threshold 40 per channel; masks: the oracle's demo switch, the app's review bar, the oracle's rounded artboard corners. A case over budget is re-captured from fresh loads, up to 3 attempts (see Notes). `EB_APP_FILE` runs it against another build. |
| `chat-journey` | "Chat journey with Artifact" (chat-artifact, 27 steps) on the built landing / chat / split screens. (a) Every step URL of the frame map renders the built screen (15a and 16a: their gallery sheets), carries the step's frame in `data-node-id`, is named exactly (no `≈`) in the review bar with its Figma link, and logs no console error. (b) A scripted click-through with real input, about 30 s of timed playback: type and Send on the landing, the title menu and Add to Project submenu (03), the timed chain of thought (04, 05) and answer, rail expand (08), Share (09), Invite (joined), `@` / `@m` / pick Matt (10-12), Send (13), Matt's reply and the Pipeline Command answer (14, timed), the access popover (15), the card hover (16), the files panel list / grid (17, 18), an artifact row into the split with the files dropdown (19), Escape (20), the version menu (21), the inline rename with Escape back to the name (21b), full screen (22), collapse, close (focus returns to the card); every URL is asserted in order. (c) A 1440 x 900 pixel diff of every step against its reference PNG (07 at 1440 x 1051; threshold 40, the review tools masked), reported as INFO and written to `out/chat-journey-diff.json` with `out/cj-app-NN.png` / `out/cj-diff-NN.png`; it does not fail the suite. (d) At 1024 and 390 no step URL scrolls sideways. `EB_APP_FILE` runs it against another build. |

## Notes

- **Phone widths.** Headless Chrome will not lay out narrower than about 500px with `--window-size`. The suites set
  every width with CDP `Emulation.setDeviceMetricsOverride`, which goes down to 390. The `contexts` suite also renders
  the app in a 390px iframe.
- **Isolation.** Each page opens in its own browser context, so pages share no history, storage or cache.
- **Parity budget.** With fixes, every case measures 0 differing pixels against the oracle, except the two cases with the
  option-1 header menu open. That menu sits at x 1160.16 in the app and at 1159.8 in the oracle (Figma draws it at 1160).
  The 0.36px shift re-rasterises its labels, so those two cases differ by 469 pixels and have a budget of 520 (`KNOWN` in
  `suites/parity.mjs`). As designed, each frame region has its own budget (`budgets(...)` in `suites/parity.mjs`): what
  Chrome's and Figma's text rasterisers differ by at threshold 40. The nav budgets of option 2 and the landing (1300 /
  1450) also cover nav rows those frames override and shell/nav does not draw yet.
- **Parity raster blips.** Now and then (about 1 page load in 40 on the dev Mac) headless Chrome rasterises a whole page's
  text slightly thinner. It happens to the oracle as often as to the app. Layout is identical to 0.001 px, the font bytes
  are identical, and the page keeps that look until it is reloaded. `--disable-lcd-text` and `--num-raster-threads=1`
  make no difference. One blip puts a case 150 to 450 px over budget, so the suite re-captures that case from fresh loads
  of both pages (`ATTEMPTS` in `suites/parity.mjs`) and lists the attempts in an INFO line. A real difference is
  deterministic and fails every attempt. `EB_CHROME_FLAGS="--flag ..."` passes extra flags to the suite's Chrome for
  experiments like these.
- **The frames suite** reads the frame list from the app's own frame map page. The plan, `journey.json` and
  `tools/gen-frames.py` stay the only source.
- **Build coverage.** `#/gallery/build-coverage` is the live version of the contract checks (`app/src/review/audit.ts`).
  Open it in the prototype to see which frames are built and why a check fails.
- **Adding a suite.** Add a file `suites/<name>.mjs` whose default export is `async ({ browser, server, rec, out, root })`.
  Record results with `rec.check(name, ok, detail)`, then add the name to `ORDER` in `run.mjs`. `lib/cdp.mjs` has the
  page helpers: `goto`, `hash`, `ev`, `waitFor`, `key`, `click`, `clickSel`, `active`, `shot`, `size` and `useFrame`.
- **Shared Chrome.** The suite starts its own Chrome on a random debugging port and its own `python3 -m http.server`
  on a free port, and stops both when it ends.
