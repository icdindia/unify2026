Deutsche Telekom's web design system, built on the ODS (OneExperience Design System) foundations. One typeface, TeleNeo. One brand colour, magenta `#E20074`, used with restraint on black, white and grey. Every colour is a semantic token with a light and a dark value, so a page switches theme by changing `data-theme` and nothing else.

## Using this system

- Build every screen from the components here first. Reach for raw tokens only for layout and product-specific parts.
- In product code, use the ODS packages from the Telekom npm registry (`@telekom-ods` on artifactory.devops.telekom.de):
  - `@telekom-ods/react-ui-kit` (React; an Angular kit also exists)
  - `@telekom-ods/design-tokens`
  - `@telekom-ods/react-icons`
- Import `design-tokens/core.css`, then `design-tokens/schemes/default.css` (or one scheme file), then `design-tokens/typography.css`, then the kit's `style.css`.
- Import components by name, for example `import { ODSButton } from "@telekom-ods/react-ui-kit"`, or `@telekom-ods/react-ui-kit/ODSButton` for Next.js. Each component card here names its `ODS…` component and props.
- Mode: set `data-mode="light"` or `data-mode="dark"` on `<body>`. Without it, ODS follows the OS preference. In this system's own files, `data-theme` does the same.
- Put `font-family: "TeleNeo Var", "TeleNeoWeb", sans-serif` on `<body>`.
- Static HTML: load `tokens.css`, then `components/bundle.css`. The previews render ODS's own markup and CSS. Only disclosures (accordions, menus) are wired up to open and close, and overlays (dialogs, dropdowns, tooltips, menus) are shown in their open state.
- Colour schemes: wrap a region in `data-scheme="<name>"` to recolour everything inside it, for example `data-scheme="magenta"` for a brand band or `data-scheme="black"` for an inverted footer. `neutral` is the default and follows the theme. The schemes are `neutral`, `inverted`, `white`, `black` and `magenta`, each with a `-subtle` twin, plus the secondary palette (aperitif, basketball, cheddar, dandelion, egg, frog, guacamole, hummingbird, iguana, jacuzzi, kingfisher, lagoon, macaw, nebula, orchid), also each with `-subtle`.

## Content fundamentals

ODS publishes no tone-of-voice guide. These rules come from its component guidelines:

- Keep a line of text under 80 characters. A text block set in body regular should be no wider than 575px (5 columns of the XL grid).
- Headers and titles (accordion headers, notification titles, dialog titles) should be clear, descriptive and short, so people grasp the topic at a glance.
- Notifications give feedback about the status of the system or an action. Use a banner for persistent system messages above page content, a toast for brief feedback and an inline notification in context. Don't use a notification when the user must confirm a decision; use a dialog.
- Never convey information by colour alone. Pair status colours with an icon and text.
- Give images alt text, and keep every function reachable by keyboard.
- The ODS type scale has no uppercase styles; set text as written.

## Building product-specific components

These are the ODS rules for anything you add on top of this system:

- Style every part with colour tokens, never raw values. Start with a background token so the component follows mode and scheme.
- Keep a component's parts in the same state: backgrounds change per state, and text stays on the default text token. Components that change text colour per state, such as links, use the same state's text token.
- Build in the neutral scheme and apply other schemes to instances. Restrict a component to certain schemes only on the original variant.
- Naming:
  - Components use title case with semantic names and your product's prefix, the way ODS uses `ODS`.
  - Layers use Latin characters, at most 50 characters, and never start with a number.
  - Repeated sub-instances go in a frame named "List Container".
- Property vocabulary:
  - Type (Primary / Secondary / Outline / Ghost)
  - Variant (Standard / Icon only …)
  - Size (Small / Medium / Large)
  - Mode (Standard, Informative, Error)
  - Disabled, Read Only
  - State (Standard / Hovered / Pressed / Focused)
  - Booleans such as Selected, Icon, Error and Expanded

## Visual foundations

### Colour

- Page ground is `colours-basic-background` (white / black). Group sections on `colours-basic-background-subtle` and cards on `colours-basic-background-card`. Both are `#F1F1F1` in light and `#202020` in dark.
- Text is `colours-basic-text`. Use `colours-basic-text-recessive` for helper text and metadata.
- Magenta is an accent, not a ground. Use `colours-basic-accent` for the primary action, selection and brand moments. Put `colours-basic-text-on-accent` (white) on it, at 4.7:1. Use at most one magenta primary button per view.
- Magenta text (`colours-basic-text-dominant`, `colours-basic-text-link`) reads at 4.7:1 on white and 5.4:1 on black. On the subtle greys it drops to 4.1–4.2:1, so keep magenta text on those grounds to 24px and above, or bold 19px and above.
- The secondary accent is black in light and white in dark (`colours-basic-accent-secondary`). Use it for secondary buttons and strong selected states, with `colours-basic-text-on-accent-secondary` on top.
- Interaction states change the background and keep the text on `colours-basic-text`. Hover is `colours-interaction-states-hover-background-hover` (`#DDDDDD` / `#555555`). Pressed is `…-pressed-background-pressed` (`#CACACA` / `#616161`). A magenta control hovers to `dt-magenta-recessive` and presses to `dt-magenta-extra-recessive`.
- Disabled uses `colours-interaction-states-disabled-background-disabled` with `…-disabled-text-disabled`. That pair is 1.7–1.9:1 on purpose: WCAG exempts disabled controls, so never use it for content that must be read.
- Status colours:
  - `colours-functional-success-standard` (green)
  - `…-warning-standard` (brown-orange)
  - `…-destructive-standard` (red)
  - `…-informational-standard` (blue)
  - Each has a `-subtle` tint for backgrounds and `-hovered` / `-pressed` shades. The notification dot is `colours-functional-notification-notification`.
  - Always pair a status colour with an icon and a word. Success and destructive differ in hue more than in lightness.
- The neutral ramp `colours-shades-neutral-shades-50…900` reverses in dark mode, so step 50 always sits nearest the page ground.
- The brand ramp (`dt-magenta*`, `dt-white`, `dt-black`) holds constant values for illustration, charts and the logo. UI uses the semantic tokens.
- DT palette: 15 secondary hues, each with 7 steps, as `palette-<hue>-<step>` (CSS `--palette-<hue>-<step>`, light and dark).
  - Hues, warm to cool: aperitif, basketball, cheddar, dandelion, egg, frog, guacamole, hummingbird, iguana, jacuzzi, kingfisher, lagoon, macaw, nebula, orchid.
  - Steps, light to deep in light mode: `subtle`, `extra-dominant`, `dominant`, `base-subtle`, `base`, `recessive`, `extra-recessive`. Dark mode reverses the ramp, so `subtle` stays nearest the page ground.
  - Use the palette for data visualisation, categories, avatars, illustrations and tinted surfaces, one hue per meaning. It has the same values as the `data-scheme="<hue>"` schemes.
  - Put `colours-basic-text` on palette fills: it reads at 8.7:1 or better on `base` and every lighter step.
  - Don't set text in palette colours. Only some `extra-recessive` steps reach 4.5:1 on white, and dandelion, egg, frog, guacamole and hummingbird don't reach it at all.
  - Status still uses `colours-functional-*`, never a palette hue.

### Type

- The only typeface is TeleNeo. The variable font "TeleNeo Var" is loaded from `fonts/`, with static TeleNeoWeb weights as a fallback. ODS "regular" body text is weight 500 and bold is 700. 800 and 900 are for display only.
- The scale:
  - `display` for one hero statement.
  - `title-xl` / `title-l` / `title-m` / `title-s` for H1 to H3.
  - `subtitle`.
  - `paragraph` for lead copy.
  - `body-l` (20/24 bold) for large component headers.
  - `body-m-regular` (16/20, 500) for default body.
  - `body-m-bold` for labels.
  - `body-s-*` (14/17.5) for helper text.
  - `microcopy-*` (12/15.6) for legal and timestamps.
- Titles are fluid between the 360px and 1680px viewports: `title-l` runs 32→56px and `display` 72→96px. Titles set tight (line-height 1), body at 1.25.
- Links use the `link-*` styles matching the copy they sit in. They are coloured with `colours-basic-text-link`, not underlined by default.
- Letter-spacing is 0 everywhere.

### Space, size and layout

- Space comes from two scales:
  - `spacing-component-*` inside components: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48px.
  - `spacing-layout-*` between blocks: 16, 24, 32, 40, 48, 56, 64, 80, 96, 128px.
- The common rhythm is a 24px leading inset (`spacing-component-7`), 16px gaps (`spacing-component-5`) and 8px trailing padding (`spacing-component-3`).
- Every interactive element has a hit area of at least `sizing-minimum-tappable-area` (48px). Text fields are `sizing-input-height` (72px) tall. Icons are 24px (`sizing-component-10`), or 16px for small.
- The grid is 14 columns with 8px gutters. Margins are 32px from 768px up, growing to 53px from 1680px. The breakpoints are 360, 768, 1440 and 1680px.

### Shape, borders and elevation

- Corners come from the radius scale:
  - `radius-small` (8px) for inputs.
  - `radius-medium` (16px) for accordion headers, cards and buttons.
  - `radius-large` (24px) for sheets.
  - `radius-extra-large` (32px) for dialogs.
  - `radius-full` for pills, switches and avatars.
- Borders use `strokes-1` (1px) with `colours-basic-stroke-subtle` for quiet dividers. Inputs and outlined controls use `strokes-1` or `strokes-2` in `colours-basic-stroke`.
- ODS separates surfaces with tone (background vs card), not shadows. Dialogs and sheets sit on `colours-basic-modal-overlay`.
- Stack layers with the z-index tokens: `z-index-header` 6000, `z-index-floating-portal` 7000, `z-index-overlay` 8000, `z-index-modal` 9000.

### Focus and motion

- Focus is a 2px solid ring (`strokes-2`) in `colours-interaction-states-focus-focus` (black / white) with a 4px offset, visible on every surface at 21:1.
- Motion is short and functional:
  - Background colour changes take 0.1s ease-in-out.
  - Disclosure content fades and grows (opacity and max-height, 0.1s).
  - Containers settle over 0.2s ease-out.
  - Nothing bounces. Respect `prefers-reduced-motion`.

## Iconography

- Use the ODS icon set, `@telekom-ods/react-icons`: 375 icons in 12 categories (Action, Alert, Communication, Content, Device, Home, Navigation, Process, Service, T Product, User, Weather). It's shown in the Icons card.
- Each icon comes in four variants:
  - outline 24px (default)
  - selected 24px (filled, for active and selected states)
  - small 16px
  - small selected
- Icons are single-ink and draw in `currentColor`. Colour them through the text colour of their container, usually `colours-basic-text`, or a functional colour for status.
- In code: `import { ODSSearch } from "@telekom-ods/react-icons"`. Pass `decorative` or `aria-hidden="true"` next to a visible label. Otherwise pass `title`.
- As files: `assets/Icons/ods-icons-<variant>.svg` sprites (`<use href="#ods-search">`) and `assets/Icons/icons.json` (path data per variant). Never draw a substitute icon; if one is missing, ask for it.

## Logo

- Use the T mark files in `assets/Logos/`:
  - Magenta on light grounds.
  - White on magenta and on dark grounds.
  - Black for monochrome output.
  - The magenta app-icon tile for favicons and the collapsed navigation rail.
- All four apply in the closed and open state of navigation. Never recolour, crop or outline the mark.

## Accessibility

- ODS components meet WCAG 2.2 A and AA, as required by the European Accessibility Act.
  - They're tested on Windows with Chrome, NVDA and JAWS, at 200% and 400% zoom (320px width), and in Windows high-contrast mode.
  - Accessible components alone don't make an accessible product, so test the composed screens too.
- Keep that true when composing:
  - Set `headingElement` and similar props to fit the page outline.
  - Keep hit areas at 48px.
  - Never convey state by colour alone.
- Contrast exceptions in the source values, kept as ODS defines them:
  - Magenta text on subtle greys is 4.1–4.2:1, so large text only.
  - `colours-basic-stroke-subtle` in light is 3.8:1 on white, fine for borders.
  - Recessive text inside `data-scheme="magenta"` (`#F9CCE3` on `#E20074`) is 3.3:1, so large text only.
