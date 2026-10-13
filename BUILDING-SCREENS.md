# Building Unify screens from the design system

Read this before building any screen, in the repo or in a new Claude artifact. The Figma DS is mapped into
`shared/` (tokens) and `components/` (atoms); `shared/ATOMS.md` lists every class, `shared/DS-COVERAGE.md`
says what exists and what is missing.

## The rules

1. **Tokens only.** Colours `var(--colors-*)`, spacing `var(--spacing-*)`, radius `var(--radius-*)`, type via the
   `.text-*` / `.display-*` classes or `var(--text-*-font-size)` etc., shadows `var(--shadow-*)` / `var(--ring-*)`.
   No raw hex or px. If a value has no token, keep Figma's value and mark the line `/* DRIFT: why */`.
2. **Atoms first.** Link the atom's CSS and use its classes as documented in `ATOMS.md`. Never restyle an atom
   from a screen stylesheet; put layout glue only (flex/grid/gap) in the page CSS.
3. **Missing atom?** Do not improvise. Add a dated entry to `shared/MISSING-COMPONENTS.md`, build the atom in
   `components/<name>/` from the Figma node (read it, don't eyeball), then use it.
4. **Both themes.** Pages set `data-theme="light"` on `<html>`; every colour comes from a semantic token so dark
   works. Check dark before calling a screen done. Shadows have no dark variant in Figma yet.
5. **Figma is the reference, the repo is the source of truth.** Values come from Figma node reads
   (`get_variable_defs`, the console bridge), not from screenshots. After building: `./tools/verify.sh`.
6. **Accessibility:** text needs 4.5:1 on its ground. `text-quaternary-500` is `#716d69` for that reason.

## Page skeleton

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="unify-core.css">     <!-- tokens, type, effects -->
  <link rel="stylesheet" href="unify-atoms-1.css">  <!-- atoms (more parts if the system grows: unify-atoms-2.css ...) -->
  <link rel="stylesheet" href="unify-atoms-2.css">
  <link rel="stylesheet" href="screen.css">     <!-- layout glue only -->
</head>
<body> … </body></html>
```

Start from `templates/screen-starter.html` (a list screen with shell, header, tabs, filters, table, pagination,
empty state, snackbar and modal) and copy the pieces you need.

## In a new Claude artifact

`python3 tools/build-ds-bundle.py` writes `dist/unify-ds.css` (everything, for local pages) and `dist/parts/`
(`unify-core.css` + `unify-atoms-N.css`, each under ~400 KB so they fit the Design System artifact).
The parts live in the Design System artifact as `project/css/` (https://claude.ai/artifact/1wKgS8AZiSj1PLAjgA1reA).
Publish the new artifact with them copied in server-side, no download needed:

```
files: {
  "unify-core.css":    { "artifact": "<design system url>", "path": "project/css/unify-core.css" },
  "unify-atoms-1.css": { "artifact": "<design system url>", "path": "project/css/unify-atoms-1.css" },
  "unify-atoms-2.css": { "artifact": "<design system url>", "path": "project/css/unify-atoms-2.css" }
}
```

and link them in that order. Icons: `python3 tools/icon.py <name>` prints an inline SVG (2,708 icons, plus logos,
flags, emoji and cursors); in an artifact, copy the needed chunk from `project/icons/` (see `ICONS.md`) and inline
the SVG. Fonts load from Google Fonts only.

## Keeping things in sync

- Figma changes tokens → re-export variables, `tools/figma-export-to-tokens.py`, `tools/build-ds-bundle.py`,
  `tools/tokens-to-ds-json.py`, republish the Design System.
- A value you change in the repo that Figma also has (like text-quaternary) must be changed in Figma too,
  or the next export will show it as drift.
