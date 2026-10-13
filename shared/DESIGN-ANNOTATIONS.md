# Design Annotations (Figma page 1054:557)

Figma page "Design annotations" holds the helper components used to annotate documentation pages. They are doc furniture, not product UI, so no repo atoms were created.

| Component | Node | What it is |
|---|---|---|
| Numeric key | 1101:104597 | Component set, property `Key`: keyboard key caps (Template, Simple, Delete, Arrow left/right/up/down, Command, Shift, Option, Control, Return, Escape, Space, Tab). Used to show shortcuts in docs. |
| Numeric key combo | 1101:104664 | Component set, property `Keys` = 1..4: a row of key caps for a combination (e.g. Command + Shift + C). |
| Design system header | 1518:345603 (+ instances 1795:446822, 1795:446861) | Page header band (breadcrumb "Foundations ->", page title, description, resources link). |
| Design system footer | 1023:37095 | Page footer band (kit credit text and URL). |

Rules the page states (it contains no prose rules, only the components and their text):
- Shortcuts are written as key caps, one cap per key, in the combo component with the matching `Keys` count (1 to 4).
- Headers and footers wrap every documentation page; titles follow the "section -> page" breadcrumb pattern with a one-line description.
- Header/footer copy still carries the upstream kit text ("The ultimate Figma UI kit and design system", untitledui.com, 2023 credit): placeholder, to be replaced with Unify wording (DRIFT).
