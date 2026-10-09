# Projects + Chat History: journey map (DRAFT)

Page `563:116774`, [open in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=563-116774). DRAFT 2026-10-09 — inferred from layout (mapper D). Not yet confirmed with the user.

Each step lists its node id, frame name and the designer's label (the text layer above the frame, in quotes). After the label comes what the frame shows, read from its layers.

## Section: projects (`1495:272101`, 86 children)

### Projects (`projects-landing`)

Title card: [`901:211600`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-211600)

1. [`3415:323703`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3415-323703) Dashboard (no label). COMPONENT. Projects landing, empty state: 'Create a Project' card with New Project button.
2. [`11657:386523`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386523) Dashboard "option 1". COMPONENT. Projects landing with list: All / Yours / Shared with you, Search, All Types, Newest, project rows. Cursor in frame. Chat + Artifacts reuses it (11657:386528 is an instance).

### Project - New project (`project-new`)

Title card: [`1504:410744`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-410744)

1. [`3415:323706`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3415-323706) Dashboard (no label). INSTANCE of 3415:323703 (Projects landing, empty).
2. [`901:211683`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-211683) Dashboard (no label). Create New Project modal: Project name, 'What are you trying to achieve?', Cancel / Create Project.
3. [`14975:59510`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14975-59510) Dashboard (no label). New project page, Chats tab empty ('No chat history'). Tabs: Chats / Routines / Artifacts / Files / Settings.
4. [`15054:105151`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15054-105151) Dashboard (no label). Same project, Chats tab with the chat list (All / Newest). Hidden dropdown menus and cursor inside the frame.

### Project - Chat (`project-chat`)

Title card: [`901:211602`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-211602)

1. [`901:212182`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212182) Dashboard "Project - Chat - Empty State". Chats tab empty ('No chat history'). Older tab set: Chats / Routines / Artifacts / Context / Settings.
2. [`11715:643488`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-643488) Dashboard "Chat list items". COMPONENT. Chats tab with chat list. Three dropdown menus and a cursor are visible in the frame. Tab says 'Context'.
3. [`14045:584747`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) Dashboard (no label). INSTANCE of 11715:643488 with the tab renamed 'Files'. A dropdown menu and two cursors sit on top of it at section level. This is the frame already rebuilt as prototypes/project-dashboard (port 4187).
   - overlay at section level: 14045:586511 Dropdown Menu (125x72)
   - overlay at section level: 14964:112359 Cursor
   - overlay at section level: 14045:586500 Cursor

### Project - Basic Share Modal (`project-share`)

Title card: none (sub-journey of `project-chat`, label text `901:213109`)

1. [`901:212791`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212791) Dashboard "Project - Basic Share Modal". Share Project modal: Invite people and groups, People with Access (Owner, Can Chat).
2. [`901:212820`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212820) Dashboard "User dropdown". Role dropdown on a member, with cursor: Can Chat / Can Edit / Remove from Project.
3. [`901:212850`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212850) Dashboard "General access dropdown". General access control (first of two frames with the same label).
4. [`901:212896`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212896) Dashboard "General access dropdown". General access control (second frame with the same label).
5. [`901:212941`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212941) Dashboard "Everyone at UnifyApps - Dropdown". 'Everyone at UnifyApps' role dropdown with cursor: Can Chat / Can Edit.
6. [`901:212970`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212970) Dashboard (no label). No label. Same modal with a 'clock' layer. Probably the state after choosing Everyone at UnifyApps.
7. [`901:213000`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-213000) Dashboard "Search for a person to invite". Typing in 'Invite people and groups', with a Can Chat role picker.
8. [`901:213043`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-213043) Dashboard "After user selection — Invite box with message". Chips (Olivia@untitled.com, Phoenix), Notify people, invite message, Copy Link / Cancel / Invite.
9. [`901:213075`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-213075) Dashboard (no label). No label. Invite box with the role dropdown open (Can Chat / Can Edit).
10. [`2533:429067`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2533-429067) Dashboard "Multiple users state". Five chips and a typed message.

### Project - Routines (`project-routines`)

Title card: [`1504:411219`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-411219)

1. [`1489:269074`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1489-269074) Dashboard "Routines - empty state". Routines tab empty: 'No routines yet', New Routine options (Create with AI, Create Manually, Choose from Templates).
   - overlay at section level: 14045:586735 Cursor
2. [`14045:583270`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-583270) Dashboard (no label). Routines tab with a list (Morning brief, What I owe people, Escalation watch...), Create Routine button, costs.

### Project - Settings (`project-settings`)

Title card: [`901:211606`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-211606)

1. [`901:212550`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212550) Dashboard "Settings - Empty state". Settings tab empty: Memory, Instructions, Context Files (Click to upload / drag and drop, Add Text Input, Add Google Drive).
2. [`14045:589425`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-589425) Group 1171274954 "Add Project Memory". GROUP: 25% black scrim + 'Project Memory' modal (14045:589427, 600x246). No screen under it: it overlays the previous step.
3. [`14045:589504`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-589504) Group 1171274955 "Add Project Instructions". GROUP: scrim + 'Set Project Instructions' modal (14045:589544, 600x454). Plain version, no AI 'Edit' button. See the Instructions AI Edit journey.
4. [`1504:416167`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-416167) Dashboard "Adding context file". 1440x970. Settings filled: Memory ('Updated 8 hrs ago'), Instructions text, Context Files upload zone.
5. [`14045:590921`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-590921) image 171 (no label). No label. 'image 171' (882x450, image fill) on a 25% scrim rectangle (14045:590920). Probably the OS file picker screenshot between choosing a file and the sync list.
6. [`1504:414571`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-414571) Dashboard "Context Files - Syncing & list view". 1440x970. '3 files added' list, one Syncing.
7. [`1504:421567`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-421567) Dashboard "Add Context Files - Dropdown". 1440x970. Add menu open: Add photos & files / Add text content / Add from Google Drive / Log out.
8. [`14045:590970`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-590970) Group 1171274956 "Add text content - Model". GROUP: scrim + 'Add Text Content' modal (14045:590972, 600x338): Title, Content, Cancel / Add Content.
9. [`1504:429675`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-429675) Dashboard "Syncing file". 1440x1044. List with new file Syncing, others Complete.

Components shown beside the row:
- [`12730:607105`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12730-607105) Frame 760x588: File Upload Unit ('3 files added', Syncing / Complete rows). The text 12730:607360 beside it lists the supported file types (pdf, csv, xlsx, pptx, docx, json, md, txt, xml, zip, image, video...).
- [`12730:607797`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12730-607797) Frame 848x283: file-type 'Featured icon' sheet. Three more Featured icon instances (12730:608224, 12730:608225, 12730:608226) sit on top of it.

### Dropdowns & Alert — Project dropdown (Admin) (`project-menu-admin`)

Title card: [`901:211608`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-211608)

1. [`901:212387`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212387) Dashboard "Project - Dropdown (Admin)". Header menu open with cursor: Edit Project Details / Delete.
2. [`12278:515018`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12278-515018) Modal Unit (no label). INSTANCE 'Modal Unit' (360x138) 'Delete Project' (Cancel / Delete) on a 25% scrim rectangle 901:212493 (1453x900). No screen under it: it overlays step 1.

### Dropdowns & Alert — Project dropdown (Non Admin) (`project-menu-non-admin`)

Title card: none (sub-journey of `project-menu-admin`, label text `901:213119`)

1. [`901:212281`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212281) Dashboard "Project - Dropdown (Non Admin)". Header menu open with cursor: Leave Project / Log out. 'Log out' is probably a component default left in (see Notes).
2. [`12278:515047`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12278-515047) Modal Unit (no label). INSTANCE 'Modal Unit' 'Leave Project' (Cancel / Leave) on a scrim rectangle 901:212547.

### Routine, Project, Artifacts & New Addition (`project-tabs-new`)

Title card: [`12085:590623`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12085-590623)

1. [`12085:590629`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12085-590629) Dashboard (no label). Artifacts tab empty: 'Create an Artifact', 'You haven't created or moved any...'. Tab still says 'Context'.
2. [`12097:592297`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12097-592297) Dashboard (no label). Artifacts tab with list (All Types / Newest): Overview brief, Next steps..., types Document / PDF / Application / Presentation.
3. [`12183:712603`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12183-712603) Dashboard (no label). Files tab with list (All / Newest, Upload File): name, size, owner, date.

## Section: Instructions AI Edit (`5534:215250`, 21 children)

### Project - Settings Instructions AI Edit (`instructions-ai-edit`)

Title card: [`5534:215248`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-215248)

1. [`5534:200639`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-200639) Dashboard (no label). Project page with a scrim and the 'Set Project Instructions' modal, empty ('Enter a description...'), with an AI 'Edit' button.
2. [`5534:202104`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-202104) Dashboard (no label). Modal filled ('Scope This project covers...'), cursor.
3. [`5534:203904`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-203904) Dashboard (no label). Same, cursor (hover state of the AI Edit control).
4. [`5534:205318`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-205318) Dashboard (no label). Same, cursor (next state of the AI Edit control).
5. [`5534:215253`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-215253) Dashboard "Generating Instructions". Extra layer 'Frame 2147266852': generating indicator.
   - below: [`5690:67225`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5690-67225) Dashboard "Close interaction". Sub-row under 'Generating Instructions': popover closed, cursor.
   - below: [`5690:69335`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5690-69335) Dashboard. Sub-row step 2: modal back at rest, no popover.
6. [`5603:362807`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5603-362807) Dashboard (no label). Generated result in the modal, no cursor. Sits at x=9505 (grid would be 9436).
7. [`5534:206736`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-206736) Dashboard "Editing particular point or text". In-box AI edit popover, second variant visible, cursor.
8. [`5534:208157`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-208157) Dashboard (no label). In-box AI edit popover, first variant visible, cursor.
9. [`5534:212128`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-212128) Dashboard (no label). Same popover, cursor.
10. [`5534:288213`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-288213) Dashboard (no label). Same popover, no cursor.
11. [`5534:213754`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-213754) Dashboard "Accept or Undo - Generated content". Second popover variant (accept / undo), cursor.

Components shown beside the row:
- [`5534:198966`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-198966) COMPONENT 'Instructions-Ai Edit' (440x159), under the title card.
- [`5534:286917`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-286917) COMPONENT 'In-box Instructions-Ai Edit' (318x183), under the title card.
- [`5534:199179`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-199179) COMPONENT 'Instructions Model' (600x456), under the title card.

## Section: Chat History (`3192:75059`, 11 children)

### Chat History (`chat-history`)

Title card: [`3192:75055`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3192-75055)

1. [`3098:185026`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3098-185026) Dashboard "new chat format with cost". History page ('Find all your chat history here'): Search, All / Yours / Shared with you, All Types, Newest; groups Pinned, Chat; cost and time columns.
2. [`4853:244291`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4853-244291) Dashboard "new chat format hover". Row hover with the row menu open and a cursor: Pin / Rename / Add to Project / Delete.
3. [`3117:187519`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3117-187519) Dashboard (no label). Sort dropdown open: Most Recent / Oldest First / Most Costly / Least Costly / A to Z / Z to A. List shows a 'Routines' group.
4. [`3117:188643`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3117-188643) Dashboard (no label). List grouped: Pinned, Meetings (cost $0.70, '3h ago').
5. [`3117:189734`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3117-189734) Dashboard (no label). List showing the 'Artifacts' group.
6. [`3117:191120`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3117-191120) Dashboard (no label). List showing the 'To Dos' group.
7. [`4853:246286`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4853-246286) Modal Full Screen (no label). 'Modal Full Screen': Rename Session modal (Cancel / Update). Follows Rename in the row menu.
8. [`6877:502572`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6877-502572) Dashboard (no label). Search typed 'Hello', matching results with snippets.

## Ignored options

- `projects-landing` option 2: [`4767:136175`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4767-136175). Projects landing as a grid of project cards ('Marketing Research · 12 items'). The two 'Projects card' components (299x130) sit above it. A button and cursor overlay sit on the frame. Components `4767:240913`, `4767:240912`.

## Loose

- [`719:164641`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=719-164641) Files icon (38x38): COMPONENT master for the files icon, parked beside the 'Add Project Instructions' label. Not a screen.
- [`12730:607360`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12730-607360) pdf csv xlsx / xls ... (283x312): Text annotation: supported upload file types, beside the File Upload Unit (12730:607105).

## Cross-page

- projects-landing 11657:386523 is the main component of Chat + Artifacts 'pinning' step 11657:386528 (an INSTANCE). Pinning a project from its title lands here.
- project-share (Share Project modal) uses the same share pattern as Chat + Artifacts 'share-artifact' (1819:316164...) and 'add-users'. Build one share modal with a project, artifact or chat subject.
- chat-history 4853:244291 row menu (Pin / Rename / Add to Project / Delete) and the Rename Session modal 4853:246286 match the chat rename in Chat + Artifacts 'chat-artifact' (statesAbove 6405:308388 'edit name') and 'nav-behaviour' (>10 chats). The nav's 'view all chats' probably goes to this History page.
- project-chat 14045:584747 is already rebuilt as prototypes/project-dashboard (port 4187); its main component is 11715:643488.
- project-routines and project-tabs-new overlap with the Routines page (mapped separately in figma-ref/routines): the routine list rows and 'New Routine' options should come from there.

## Notes

- Modal steps in Project - Settings and Dropdowns & Alert are a 25% black scrim plus a modal floating at section level, with no screen under them. Render each one over the previous step's screen.
- 'Log out' appears as the last item in the non-admin project menu (901:212281) and in the Add Context Files menu (1504:421567). It looks like a Dropdown Menu default left in. The project-dashboard UX pass already removed it from the row menu.
- All frames are 1440 wide (some 970 or 1044 tall). Nothing is dimmed or hidden at section level.

## Doubts

1. The project tab is called 'Context' in older frames (901:212182, 11715:643488, 1489:269074, 901:212550, 12085:590629) and 'Files' in newer ones (14975:59510, 15054:105151, 14045:584747, 12097:592297, 12183:712603). The Chats-tab empty and list states are drawn twice: in 'Project - Chat' (Context) and at the end of 'Project - New project' (Files). Which tab name and which pair is canonical?
   - Proposed default: Use 'Files' everywhere: the newer frames and the Files-tab list (12183:712603) use it. Both rows route to the same Chats-tab screen, with 14975:59510 as empty and 14045:584747 (the built dashboard) as the list. 'Context Files' stays as the heading inside Settings.
   - Links: [901-212182](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212182), [11715-643488](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-643488), [14975-59510](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14975-59510), [15054-105151](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15054-105151), [12183-712603](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12183-712603)
2. 'Add Project Instructions' in Project - Settings opens a plain instructions modal (14045:589544, Cancel / Save only). The 'Instructions AI Edit' section shows the same modal with an AI 'Edit' control and a generate / edit / accept-undo flow. Is the AI version the one the prototype should open?
   - Proposed default: Yes. Step 3 of project-settings opens the AI version (5534:200639), and the instructions-ai-edit journey continues from there. The plain modal is kept as the no-AI fallback.
   - Links: [14045-589504](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-589504), [5534-200639](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-200639), [5534-215248](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-215248)
