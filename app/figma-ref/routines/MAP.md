# Routines — journey map (DRAFT)

Page `0:1` · [open in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=0-1)  
Status: DRAFT 2026-10-09 — inferred from layout

How to read: each journey is one horizontal row in the file (left to right = step order). "Designer label" is the text the designer placed just above (or, where noted, just below) the frame. Extra states stacked above/below a step are listed under that step. Node ids link to Figma.

## Notes

- One section holds the whole page. Five nodes sit outside it, far to the right (x 46775-50287); they are listed under 'loose'.
- Several title cards are copies with stale layer names ('Create Routine manually', 'View & edit one Routine'); the card TEXT is used as the title.
- Rails differ across rows: some frames use the 280px expanded rail, newer ones the 56px collapsed rail. Not normalised here.
- 'joinsAt' on a journey means its last frame hands over to that frame of another journey (drawn as an arrow in the file).
- 'stepNotes' are this mapper's observations, not designer labels.

## Section: Routines (`334:112671`)

[Section in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112671) · 108 direct children · 11 journeys

### 1. Routines landing (first-time user, second-time user, row menu open) (`routines-landing`)

Title card: [`334:112690`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112690) Frame (1499x900) — text: "Routine"  

1. [`875:162202`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-162202) Routine Landing page (1440x900) — "First time user will see this Routine landing page"
    - note: component; collapsed 56px rail
2. [`334:112714`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112714) Routine Landing page (1440x900) — "Second time user will see this"
    - note: 280px rail; carries a 340x220 popover (Frame 2147265891). A 20%-opacity designer note sits above it: "errors in routine? - indication?" (5135:479919)
3. [`11657:493405`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493405) Routine Landing page (1440x900)
    - note: component, no label; 280px rail + row kebab Dropdown Menu open. It is the main component of Chat + Artifacts pinning step 03 (instance 11657:493696)

Cross-page: 11657:493405 is the main component of Chat + Artifacts 'pinning' step 03 (11657:493696, route #/routines?menu=row:...)

### 2. Create Routine with AI (first-time user's AI journey) (`create-ai-first-time`)

Title card: [`875:163580`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-163580) Create Routine with AI (1499x900) — text: "Create Routine with AI"  
Card note: mid-row title card (1499 wide) in the same row as the landing  

1. [`967:349204`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=967-349204) 1 (1440x900) — "First time user ‘s AI journey"
2. [`967:349249`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=967-349249) 2 (1440x900)
    - note: Arrow 1 (967:351898) runs from this frame's right edge down to the left edge of the next frame (875:165388), which sits one row lower (y 1192). Steps 3 onward are that lower row.
3. [`875:165388`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165388) 3 (1440x900)
    - note: first frame of the long lower row (y 1192); the rest of the steps run left to right on that row
    - state above: [`2875:179258`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2875-179258) 139 (1440x900) — same layout (56 rail + Page frame), stacked directly above
4. [`875:165544`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165544) 4 (1440x900)
5. [`875:165686`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165686) 5 (1440x900)
6. [`905:281421`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-281421) 6 (1440x900)
7. [`1412:240483`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1412-240483) 106 (1440x900) — "choosing if the routine belongs to a project"
8. [`905:282842`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-282842) 7 (1440x900)
9. [`905:300224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-300224) 8 (1440x900)
10. [`905:301453`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-301453) 9 (1440x900)
11. [`875:166994`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-166994) 10 (1440x900)
12. [`875:167928`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-167928) 11 (1440x900)
13. [`13961:434165`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13961-434165) 167 (1440x900)
14. [`875:167421`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-167421) 12 (1440x900)
15. [`1704:492669`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1704-492669) 138 (1440x900)

Components / panels shown beside the row:

- [`13961:433538`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13961-433538) Sidepane header (398x58) — above steps 11/167
- [`13961:433523`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13961-433523) Header (398x40) — above steps 11/167
- [`13961:433524`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13961-433524) Title Stack (374x40) — above steps 11/167
- [`13961:433539`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13961-433539) Content (374x36) — above steps 11/167

Cross-page: 1412:240483 (routine belongs to a project) touches Projects

### 3. Create Routine with AI (second-time user's AI journey) (`create-ai-second-time`)

Title card: none  

1. [`905:297062`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-297062) 1 (1440x900) — "Second time user‘s AI journey"
    - note: row has no title card of its own; it sits directly under the first-time row, under the same 'Create Routine with AI' card column
2. [`905:297092`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-297092) 2 (1440x900)
    - note: Arrow 2 (967:351899) leaves this frame's right edge but its head lands on empty canvas at about (11537, 2880); see doubt 1

Then joins: [`875:165388`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165388) 3 (1440x900) and continues along that journey.

### 4. Side nav (hover states of items and micro items, item menu) (`side-nav`)

Title card: [`1440:369045`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-369045) Frame (1499x900) — text: "Side nav"  

1. [`1440:365634`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-365634) Main_nav (280x900) — "hover state of items"
    - note: Main_nav instance only (280x900), not a full screen
2. [`1440:363167`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-363167) Main_nav (280x900) — "hover state of micro items"
3. [`1440:364269`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-364269) Main_nav (280x900)
    - note: Main_nav instance; the Dropdown Menu 11406:633924 (180x141) sits just right of it, with a cursor

Components / panels shown beside the row:

- [`11406:633924`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11406-633924) Dropdown Menu (180x141) — opened from the third nav state

Cross-page: Duplicates the nav rail states mapped in Chat + Artifacts 'nav-light' and 'nav-behaviour'

### 5. Create Routine manually (`create-manually`)

Title card: [`895:186816`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-186816) Create Routine manually (1499x931) — text: "Create Routine manually"  

1. [`895:188495`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-188495) 14 (1440x958)
    - note: "14": 280px rail + editor (1160) + two overlays (340x220, 468x362). Only frame on the card's own row.
    - alternate below: [`12860:490015`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-490015) 161 (1440x958) — (30% opacity, 56 rail): newer layout of the same screen, parked
2. [`11979:551199`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-551199) 145 (1440x1145)
    - note: "145" (1440x1145, 56 rail): first full screen of the untitled sub-row under this card (Group 1739333097, 12860:497672); see doubt 2
3. [`11979:561118`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-561118) Modal Full Screen (1440x800) — "Check Header if using this"
    - note: Modal Full Screen (1440x800) holding an 800x700 modal titled 'Instructions'
4. [`905:269417`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-269417) 35 (1440x958)
    - note: "35": screen + Modal Full Screen titled 'Summary'
5. [`905:271059`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-271059) 36 (1440x958)
    - note: "36": screen + Modal Full Screen titled 'Summary' (second state)

Components / panels shown beside the row:

- [`11865:540738`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11865-540738) Side Panel (400x958) — (Agents / Vibe Hacking Agent / Connect a Tool) — 'updated'
- [`895:225068`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-225068) Side Panel (400x958) — (trigger: New email, Outlook)
- [`11875:138966`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11875-138966) Panel (400x957) — (Agents / Connect a Tool) — 'updated'
- [`1421:311764`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1421-311764) Side Panel (400x958) — (trigger: Weekly)
- [`1710:497789`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1710-497789) Side Panel (400x958) — (trigger: Weekly, second state)
- [`11875:140539`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11875-140539) Panel (400x957) — (Agents / Connect a Tool) — 'Updated'
- [`11875:140603`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11875-140603) Side panel footer (400x52) — (400x52, under the previous panel)
- [`11875:141718`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11875-141718) Panel (400x957) — (Agents / Connect a Tool) — 'Updated'
- [`895:226426`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-226426) Side Panel (400x958) — (trigger: New Email, Gmail)
- [`11979:548215`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-548215) Side Panel (400x958) — (Agents / Connect a Tool) — 'updated'
- [`11979:548844`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-548844) Side Panel (400x958) — (Agents / Connect a Tool) — 'updated'
- [`11979:549189`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-549189) Side Panel (400x958) — (Agents / Connect a Tool) — 'updated'; tool-row states annotated beside it: hover, connected not used, connected and used, not connected

### 6. Make moving routines to projects more intuitive (option 1 for add to project) (`routine-to-project`)

Title card: [`12860:497673`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-497673) Create Routine manually (1499x931) — text: "Make moving routines to projects more intuitive"  
Card note: mid-row title card (1499 wide) on the 'Create Routine manually' row; layer is named 'Create Routine manually' but its text reads 'Make moving routines to projects more intuitive'  

1. [`12033:564274`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12033-564274) 147 (1440x958) — "option 1 for add to project"
2. [`12860:487289`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-487289) 159 (1440x958)
3. [`12860:490006`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-490006) 160 (1440x958) — "Add a trigger"
    - note: component "160"; a cursor (12057:581156) sits on it

Cross-page: Routine-to-project assignment touches Projects; option 2 adds pin/unpin (Chat + Artifacts 'pinning')

### 7. Create Routine from templates (`templates`)

Title card: [`334:112693`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112693) Create Routine from templates (1499x900) — text: "Create Routine from templates"  

1. [`448:232834`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=448-232834) Template Landing Page (1440x900)
2. [`334:114637`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-114637) Template Landing Page (1440x900)
3. [`905:276599`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-276599) One Template Overview (1440x900)
4. [`2599:419069`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2599-419069) Routine Template Loading (1440x900) — "Loading Routine Animation 🔗"
    - note: the label text (2633:421801) is not above this frame: it sits left of the manual-creation sub-row (x 5595, y 4620), and its hyperlink opens the prototype at this frame
5. [`929:341275`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=929-341275) 4dashboard7 (1440x900)
    - note: "4dashboard7": the created routine's dashboard

### 8. View & edit one Routine (`view-edit`)

Title card: [`334:112695`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112695) View & edit one Routine (1499x900) — text: "View & edit one Routine"  

1. [`334:112794`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112794) Dashboard (1440x900)
2. [`1196:217178`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1196-217178) Dashboard (1440x900)
    - note: component 'Dashboard'
3. [`1174:212998`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-212998) Dashboard (1440x900) — "On click"
    - note: caption 'On click' (2633:424284) is BELOW the frame (see doubt 4)
4. [`1174:209018`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-209018) Dashboard (1440x992) — "Edit Routine details / View Instructions"
    - note: 1440x992 (taller). 'Edit Routine details' is above the frame; 'View Instructions' (2633:421802) is BELOW it (see doubt 4)
5. [`3413:112115`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3413-112115) Instructions (1440x900)
6. [`1174:207798`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-207798) Dashboard (1440x900)
7. [`1196:223606`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1196-223606) Frame 2147266697 (1440x900)
8. [`1196:223735`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1196-223735) Frame 2147266698 (1440x900)
9. [`1196:225138`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1196-225138) Frame 2147266699 (1440x900)

Components / panels shown beside the row:

- [`1174:201430`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-201430) Routine card (320x1116) — (320x1116 component) between steps 1 and 2

### 9. Read more behavior (instructions) (`read-more`)

Title card: [`6190:428618`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6190-428618) View & edit one Routine (1499x900) — text: "Read more behavior"  
Card note: layer is named 'View & edit one Routine' but its text reads 'Read more behavior'  

1. [`2633:421805`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2633-421805) Dashboard (1440x900)
    - note: instance 'Dashboard'
2. [`2599:392642`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2599-392642) Read instructions (1440x900)
3. [`2599:392653`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2599-392653) Instructions (1440x900)

### 10. Scheduled sessions view (runs of a routine) (`scheduled-sessions`)

Title card: [`1608:376247`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1608-376247) Create Routine manually (1499x931) — text: "Scheduled sessions view"  
Card note: layer is named 'Create Routine manually' but its text reads 'Scheduled sessions view'  

1. [`1588:225613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1588-225613) 1 (1440x900) — "Landing screen : No runs in a session"
    - alternate below: [`8486:545082`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8486-545082) 140 (1440x900) — "Max width of header text" — long header title (max width)
2. [`1592:358129`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1592-358129) 2 (1440x900)
3. [`1596:369039`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-369039) 3 (1440x900)
4. [`1596:364052`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-364052) 4 (1440x1109) — "Run View: Only one Run"
    - note: 1440x1109: 56 rail + page (984) + Copilot frame (400)
5. [`1596:367279`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-367279) Dashboard (1440x1109) — "Error in run"
    - note: 1440x1109. The label text 1620:378625 sits right-aligned over the previous frame, ending just before this one (see doubt 3)
6. [`1608:373478`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1608-373478) Dashboard (1440x900)
7. [`1608:374610`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1608-374610) 137 (1440x900) — "Run View: More thn 1 Run / Switch Run from the right panel."

### 11. Routine Help Text (`help-text`)

Title card: [`14088:847083`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-847083) Routine Help Text (1499x900) — text: "Routine Help Text"  

1. [`14088:843784`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-843784) 169 (1440x900)
    - note: layer names run 169, 168, 170 left to right; mapped in x order
2. [`14088:842289`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-842289) 168 (1440x900)
3. [`14088:845275`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-845275) 170 (1440x900)

## Ignored options (Option 2 and later)

### option 2 (option 2 for add to project + pin/unpin) (alternative to `routine-to-project`)

Title card: [`12860:497676`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-497676) Create Routine manually (1499x931)  

1. [`12860:494090`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-494090) 164 (1440x958) — "option 2 for add to project + pin/unpin"
2. [`12860:497832`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-497832) 165 (1440x958)
3. [`12860:499080`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-499080) 166 (1440x958)
- component [`12860:498921`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-498921) Dropdown Menu (240x340)

## Cross-page overlaps

- routines-landing 11657:493405 = main component of Chat + Artifacts 'pinning' step 03 (11657:493696). BUILD-PLAN item 61 'RoutinesLanding (stub)' should be built from this row.
- side-nav duplicates Chat + Artifacts 'nav-light' / 'nav-behaviour' rail hover states.
- routine-to-project option 2 and create-ai step 106 overlap Projects and Chat + Artifacts 'pinning'.
- Chat + Artifacts 'publish-artifact' uses a chat called 'new-routine' (#/chat/new-routine/...) — the chat-side entry to creating a routine; this page's 'create-ai-*' journeys are the routine-side flow.

## Loose frames (ignored by default)

- [`1161:134508`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1161-134508) Auto-inbox (1710x951) — outside the section, far right: an older wide (1710) Auto-inbox concept screen; reference only
- [`1161:135508`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1161-135508) Panel (400x900) — side panel next to Auto-inbox, same exploration
- [`1174:202729`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-202729) Frame 2147266642 (280x350) — small menu/popover piece of the Auto-inbox exploration
- [`1161:139324`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1161-139324) image 27 (898x693) — reference image pasted beside Auto-inbox
- [`366:159880`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=366-159880) explore-ai-agents (20x20) — hidden stray icon instance
- [`1537:344371`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1537-344371) Screenshot 2026-08-28 at 8.02.06 PM 1 (1048x550) — reference screenshot above create-ai step 8 (905:300224)
- [`13959:433114`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13959-433114) Screenshot 2026-10-05 at 11.36.38 AM 1 (390x891) — reference screenshot of a side pane, above create-ai steps 167/12
- [`1440:367384`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-367384) Cursor (20x20) — stray cursor between the side-nav row and the AI rows
- [`12176:712294`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12176-712294) Cursor (20x20) — stray cursor above the manual-creation sub-row

## Doubts

1. **The second-time AI journey (905:297062 -> 905:297092) has no title card, and its Arrow 2 (967:351899) points at empty canvas around (11537, 2880) instead of a frame. Arrow 1 from the first-time journey lands on 875:165388. Does the second-time user also continue into 875:165388 and the same long row (3 ... 138)?**  
   Links: [905-297092](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-297092) · [967-351899](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=967-351899) · [967-351898](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=967-351898) · [875-165388](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165388)  
   Proposed default: Yes: second-time journey = 905:297062 -> 905:297092 -> joins create-ai-first-time at 875:165388 and follows it to the end (recorded as joinsAt).

2. **Under the 'Create Routine manually' card there is an untitled group (Group 1739333097, 12860:497672): a 30%-opacity screen '161', 11 side-panel variants marked 'updated', then '145' (1440x1145), an 'Instructions' full-screen modal and two 'Summary' modal screens '35'/'36'. Is this the continuation of 'Create Routine manually', and is '14' (280 rail, not dimmed) or '161' (56 rail, newer, dimmed) the screen to build?**  
   Links: [12860-497672](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-497672) · [895-188495](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-188495) · [12860-490015](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-490015) · [11979-551199](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-551199) · [11979-561118](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-561118) · [905-269417](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-269417)  
   Proposed default: Treat the group as the rest of create-manually: 14 -> 145 -> Instructions modal -> Summary 35 -> Summary 36; side panels are panel states (components); '161' stays a parked alternate of '14'.

3. **In 'Scheduled sessions view' the label 'Error in run' is right-aligned over frame 4 (1596:364052, 'Run View: Only one Run') and ends just before 1596:367279. Which frame is the error state?**  
   Links: [1620-378625](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1620-378625) · [1596-364052](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-364052) · [1596-367279](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-367279)  
   Proposed default: 1596:367279 (the next frame, same 1109 height) is the error-in-run state; 1596:364052 is the single-run view.

4. **The captions 'On click' and 'View Instructions' sit between the two 'View & edit' rows, aligned with the upper row's columns (1174:212998, 1174:209018), not over any 'Read more behavior' frame. Do they caption the upper row?**  
   Links: [2633-424284](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2633-424284) · [2633-421802](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2633-421802) · [1174-212998](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-212998) · [1174-209018](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-209018) · [6190-428618](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6190-428618)  
   Proposed default: Yes: they caption the upper-row frames ('On click' under 1174:212998 opens 1174:209018; 'View Instructions' under 1174:209018 leads to 3413:112115 Instructions).

