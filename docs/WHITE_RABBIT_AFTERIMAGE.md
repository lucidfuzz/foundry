# White Rabbit — Afterimage, illustrated and print refinements

## Calling Card lines — 16 October 2026 (Claude)

Both editions share one line pool. Jordan removed all Lewis Carroll quotes and the two tea-party lines; eight
attributed Arsène Lupin quotes and nine new legion lines replace them (full list and rules in
`APPROVED_DESIGN_DECISIONS.txt` and the theme bible). Every new line fits the Afterimage Calling Card at all three
sizes with no ellipsis. No art, painter or layout change in Afterimage.

## Browser pass and picker fix — 16 October 2026 (Claude)

Interactive-browser checks passed on main `2ec2353` in headless Chromium: edition and palette switching, all
eleven widgets, artwork loading, the three home-frame exports, theme pack, script copy/download and Android pack.
One defect fixed: the home-frame picker showed six buttons for Afterimage's three frames (frames 4-6 repeated
frame 1). One CSS rule now honors the existing hidden attribute. No art, painter or export change; the approved
revision 7 design is untouched. Details and two logged open items are in `APPROVED_DESIGN_DECISIONS.txt`.
Live-deploy confirmation and the iPhone Scriptable pass remain pending.

## Merged status — 15 October 2026

Jordan squash-merged PR #8 into main as `2ec23530c92d62aac25cbd497ee81afa6155a1cd`.
The merged tree is identical to validated PR commit `d16b35a0bde1c50befb0065bd234f59a32701332`.
White Rabbit Afterimage revision 7 is integrated and remains the approved visual baseline.
Start from current main; do not reapply older source bundles. Original stays the default.

The previous integration results apply to this identical tree: 52 tests and build check pass;
630 widget views, 90 wallpapers and 55 icons match revision 7. Interactive-browser and physical-phone
checks, plus confirmation of the live deployment, remain pending. No new deployment claim is made.
This handoff-only status note supersedes the earlier pending-merge delivery status below and has
not been pushed as another repository change. Include the accompanying updated decisions file
in subsequent handoffs. The Android app remains on its separate branch.

## PR integration — 15 October 2026

Revision 7 is approved. Jordan authorized preparing a PR and will squash and merge personally;
do not merge it, enable auto-merge or push directly to main. The integration branch is
`codex/white-rabbit-afterimage`, based on main `739f2c67bb3905fc936485c39afb39d20a1f2016`.
The original design checkout remains preserved. This section supersedes the earlier local-only
delivery status below; those sections retain the design history.

Afterimage adds eleven widgets in three sizes, twelve heirlooms, twelve fictional casing locations,
ten commissions, fifteen lock headlines, three approved home frames and eleven icons in five palettes.
The Original edition stays the default. The shared painter, selected illustrations and approved
compact detail are unchanged. Hosted art is cached by widget and content version, with an engraved
fallback when offline. Calendar, climate, links and the saved Long Con game retain their real adapters.

Integration fixes one export omission: the native script now receives the selected palette's ground
color, already used in the preview. A regression test builds the actual script and runs all 165
mode/size/palette combinations; it failed before the fix and passes afterward. All 52 tests and the
build check pass. See `WHITE_RABBIT_VALIDATION.json` for the integration comparison counts.

All 630 widget views, 90 wallpapers and 55 icons match approved revision 7 pixel-for-pixel. Existing
Original and prior editions match current main. All 76 Rabbit images and 34 existing images are
unchanged. Fresh primary and cached-art sheets were visually inspected at all three widget sizes.
The three approved screen pairs were also inspected. Local evidence is in
`outputs/white-rabbit-pr-validation` in the design workspace; repository previews are in
`docs/previews/white-rabbit/`.

Interactive-browser and actual-phone testing remain pending; API-double tests and canvas rendering
do not substitute for those checks. After Jordan merges, Claude should start from updated main and
read `APPROVED_DESIGN_DECISIONS.txt` and this file. Preserve the approved art and density when checking
real calendar timers, location permissions, cached art and charging behavior. Do not reapply an old
handoff over merged source. The Android branch never merges into main.

## Revision 7 approved — 15 October 2026

Jordan reviewed `outputs/White-Rabbit-Review-v7.html` and said "these are perfect".
Revision 7 is the approved visual baseline for all eleven widgets at all three sizes, including
the compact background detail. Preserve the selected art, rabbit, hearts/glints, pixel printing,
distinct departmental patterns, palette and typography. The abstract screen pairs remain approved.
This supersedes earlier pending visual-review notes for revisions 6 and 7. Integration, browser
interaction and physical-phone testing remain pending. Local, uncommitted; no publication authorized.

## Compact print refinement — revision 7

Jordan requested the large widgets' background detail in medium and small sizes. The current large
compositions are the reference and remain unchanged. Admission watermarks, folded exit papers,
exposure etching, optical scores, signature overprints, film edges, cutting diagrams, postal
cancellations and the collection ledger extend into the compact layouts. These are the same
departments' ornamental print disciplines, not new sensors or invented live values. Preserve the
selected illustrations, flowing rabbit, hearts, glints, pixel lightness and all approved screens.
Each size is composed directly at its own dimensions. Keep functional text and timer areas clear.

Current review: `outputs/White-Rabbit-Review-v7.html`; preview: `outputs/White-Rabbit-Compact-Detail-Pass.png`.
Evidence and source copies: `outputs/white-rabbit-compact-print`. V6 remains a frozen comparison;
its painter, built page and asset hashes are in `outputs/white-rabbit-v6-checkpoint`.
Compact-only guards keep this refinement out of large widgets and wallpaper compositions. The native
path clipping uses ordinary lines; no browser-only drawing API, new font or image dependency was added.
All 51 tests and the build check pass. The 110 compact views across five palettes change; 225 large
views, 90 Afterimage screens, 55 icons and all 112 asset files remain identical. Thirty approved screen
views additionally match v5 at full export resolution. Original and prior-edition comparisons pass.
Visual checks include primary widgets, the three full rotating pools at both compact sizes, five
palettes, 22 cached-art views and 14 functional stress views. 436 review links resolve.
This is a local, uncommitted, visually approved baseline. Browser interaction and physical-phone checks
remain pending. No publication requested. Sections below record prior passes.

## Current approved selections and density pass — 14 October 2026

Jordan chose The Job B / Private arrangement, Cover Watch A / Afterglow, Getaway B / Quiet flight,
Disputed Heirloom 01 B / Unfastened, and The Warren A / Postscript. All three lock/home pairs are approved
as "perfect". These choices are now the local defaults, replacing the five corresponding subjects only.
The Gala Necklace retains its name with an updated open-collar material description. The rabbit and
all other illustrations remain unchanged.

The new request fills the widgets' negative space. Revision 6 adds distinct ornamental printing across
all eleven widgets: embossed admission seals, scored departure folds, exposure etching, optical grooves,
signature overprint, perforated film, darkroom registration, gem facets, postal cancellation, invitation
creases and seven-place inventory proofs. Keep these separate from real measurements and game state.
Small widgets prioritize their primary content; details must not collide with footers or live timers.

The three approved home frames are available through the picker, inspection and export. Fifteen lock
headline slots continue to use the three approved abstract families. Their first three paired screens
match the approved render exactly across all five palettes. Scale/position controls move central art
inside protected clock/icon/dock regions while text remains fixed.

Review: `outputs/White-Rabbit-Review-v6.html`; renders and verification: `outputs/white-rabbit-final-print`.
All 51 tests and build check pass. Original and other-edition comparison checks pass; the 30 approved
screen views are pixel-identical to v5. Five selected sources and their 15 derivatives changed, while
92 other art files are unchanged. Eleven native-cache widget views and all three base sizes reviewed.
Use `python scripts/art.py --theme rabbit` for future art updates. No publication is authorized.
Selected illustrations/screens are approved; the new density pass, browser interaction and phone
verification remain pending. Earlier sections below are historical context, not current choice status.

## Current selection studies — 14 October 2026

Jordan requests new variations for The Job, Cover Watch, Getaway, Disputed Heirloom 01 and The Warren,
plus more elegant, playful abstract lock/home compositions. Keep the praised rabbit and preceding
illustrated/pixel changes. These targeted A/B studies supersede the blanket preservation instruction
below only for the five newly requested subjects; all existing defaults and files remain intact.

Review: `outputs/White-Rabbit-Review-v5.html`. Two generated subjects per piece, all three sizes and five
palettes; three paired screen directions. See [Elegance studies](WHITE_RABBIT_ELEGANCE_STUDIES.md).
These are review options, with no selected default and no integration or publication yet.

## Current refinement — 14 October 2026

Jordan positively received revision 3 and specifically praised the rabbit. Preserve all nineteen source
illustrations byte-for-byte. The new request adds light pixel-art detail around that established language:
vault bitting, punched departure slips, shutter halftones, optical music rolls, signature breakup, film
sampling, jewel-cut proofs, cell postage, admission perforations and printed absences in the Long Con.
These are drawn in the shared renderer for browser and native widgets. Readable real data and saved
gameplay remain authoritative. Five colorways and all three sizes must retain the same deliberate detail.
The previous illustrated review is preserved; the new review is White-Rabbit-Review-v4.html. This is local
work awaiting visual review, with no commit, push or PR requested.


## Current correction — 14 October 2026

Jordan rejected the material pass as "way too realistic" and supplied five references, specifically
calling attention to the drawn rabbit, hearts and sparkles. The earlier material prescriptions below
are superseded. Keep the original world and positive first-pass structure; replace the realistic
hardware with flat, flowing illustrations, thin ink contours, pearl fills, lilac shadow planes and
magenta signatures. The rabbit is elongated and sly, with an expressive sharp eye; no robotic mask.
Outlined hearts and long four-point sparkles are part of the legion's deliberately playful signature,
not playing-card suits. Their grace should coexist with fine criminal records, lasers and precise tools.
No photoreal metal, jewelry photography, rendered product lighting, childish mascots or generic fantasy
ornaments. Twelve heirlooms retain their names and distinctive forms in the new illustrated medium.
The existing angular mark remains untouched in Original. Afterimage uses its own flowing rabbit.

Reference-only inputs: outputs/white-rabbit-reference-images/revision3/01.png through 05.png.
Rejected v2 artwork, renders, source and prompts are preserved in outputs/white-rabbit-material-v2-archive.
This correction changes the visual language, not calendar/weather/game truth or charging behavior.
Current work is a local proposal pending review; no push or PR is authorized.

## Historical material pass — superseded, realism rejected

Jordan likes the preservation of the original design principles and now explicitly asks for image generation,
as with Halcyon, with a concentrated lethal, elegant and slightly playful mood. Keep the existing world,
palette, typography and practical behavior. The first pass is retained for comparison, not rejected.

The new material language is pearl synthetic ceramic, ink-black lacquer, cold lilac optical glass, fine
titanium machining and restrained magenta signatures. Danger comes from severe silhouettes, concealed
filament edges, needles and impeccable criminal equipment. Play comes from asymmetry and the legion's
dry manners, not cute animals or caricatures. The mask is unoccupied equipment, never a copied character.

Dedicated generated artwork: vault iris (The Job), filament tool (Getaway), shadow shutter (Cover Watch),
encoded cylinder (Getaway Mix), mask (Calling Card), ceramic dead drop (The Warren), admission credential
(Heist Board) and twelve individually made heirlooms (The Marks). Existing forensic diagrams, casing
views, data and game plinths stay crisp code artwork; each widget retains its own principal subject.
Screen artwork can echo the relevant subject. The catalogue's small game and casing miniatures remain
schematics of the same named objects. No generated text is used as live interface data.

Raster sources remain unchanged in assets/rabbit. scripts/art.py produces hosted WebP sheets and native
widget PNGs with version hashes. Only the required widget images are downloaded and cached. Offline
first runs retain the engraved first-pass fallback. Local preview is not evidence of publication or phone QA.
This revision is a local visual proposal pending Jordan's review.

## Retained first-pass record

Local design review, 14 October 2026. Started from main `739f2c6` after Directive Zero PR #7 was merged. Original stays the default. This pass is not approved for publication.

## Direction

Enhance Claude's existing White Rabbit rather than replace its identity. Jordan supplied the exact exported original pack and four character/material references. The source is `Downloads/white-rabbit-theme-pack.zip`; preserved in the design workspace under `outputs/white-rabbit-original-pack/`.

Pearl polymer, lilac foil, ink-black calling cards, magenta security lasers, Bodoni Moda and DM Mono remain the visual language. The existing angular mask is a guild signature. Fine security printing, engraved mechanisms, cut facets, provenance, optical misregistration and contradictory alibis make the world feel occupied. Density should read as luxurious criminal equipment and documents, not Halcyon biology or Directive Zero's military command terminal.

The supplied Marathon lore is creative context, not imported Foundry canon or independently verified game history. Synthetic surfaces, elegant theft, elusive identity and copycat crews inform the pass. Do not reproduce the reference characters, game marks or named factions. No Alice in Wonderland imagery, playing-card suits or pocket watches.

## World

The user is inside CELL 07 of the White Rabbit legion, using a portable dossier assembled for a series of impossible thefts. The Warren connects rival crews, fences and safehouses. Entry Specialists issue route slips; the Archive records disputed provenance; the Cleanup Crew certifies absences; Calling Cards authenticates the evidence deliberately left behind. The shared original slogan and headline pools remain intact.

Recurring places: Aurel Gala, the East Wing, Private Vault 03, the Auction House, the moving Night Carriage, the Observatory, the Glass Walk and the safehouse. Existing aliases VELVET, CIPHER, SILK, MONOCLE, NOCTURNE and GILT persist. Records rotate every half hour when the platform refreshes; the Long Con retains its saved seven-heirloom game, cooling heat while charging.

Register: impeccably mannered, competitive, expensive and deniable. The menace is an immaculate empty plinth, a corrected ownership record or an alibi filed before the event. Avoid cute mascots, combat dashboards, generic radar, organs, plant decoration and portraits.

## Graphic ownership and variety

| Surface | Retained concept | Enhanced central graphic |
|---|---|---|
| The Job | Actual calendar, weather and battery | Engraved three-disc vault mechanism and contract slip |
| Getaway | Real event countdown, release, next event | Threaded exit route and torn timing ticket |
| Cover Watch | Real daylight/weather | Architectural shadow shutter and exposure strips |
| Getaway Mix | Music launcher | Encoded music cylinder, winding grooves and score ribbon |
| Calling Card | Attributed archive/legion writing | Security-printed correspondence with blind embossing |
| Two Marks | Two app links | Casing film and valuation receipt |
| Surveillance Reel | Rotating fictional casing footage | Twelve different framed venue compositions |
| The Marks | Stolen heirloom dossiers | Twelve distinct objects, facets and provenance annotations |
| The Warren | Discord gathering | Folded dead-drop correspondence and cell handoffs |
| Heist Board | Fictional contract oddity | Ten folded admission papers with target, venue, crew and access diagram |
| The Long Con | Existing persistent idle game | Seven bespoke plinths, missing-object impressions and crew seal |

Small keeps the distinguishing object and primary utility; medium pairs art with readings; large expands the same object into a dossier. Neighboring objects are different. Lock screens retain the original dial/calling-card/headline hierarchy; home boards keep icon and dock reservations. Eleven icons retain the original glyphs, pearl material and codes.

## Limits

Calendar, weather, battery and saved game values remain authoritative. Missing data stays unavailable. Fictional records are labeled as such. Preview data is sample data; simulated artwork is not live surveillance. Physical-device review remains pending. Interactive browser and physical-device testing have not been performed.


## Cross-theme ownership check

White Rabbit keeps its own mechanisms: theft of seven heirlooms with charging as laying low; oddities are
heist commissions; the gallery is disputed property; Discord is a dead-drop warren; transmissions are signed
calling cards from the legion and attributed archive writing. The centerpiece is different from Halcyon's
organs/custodial biology, Deep Range's contacts/relay radio, Directive Zero's authority/command network,
Long Road's traveller/letter, Grimoire's familiar/spell, Nightfall's squad patrol, Neon's commerce/hacking,
Vapor's mall nostalgia, Wildwood's grove and Long Odds' trading. Guilloche is security engraving here, not a
generic telemetry plot. The two-link launcher uses casing-film and valuation slips instead of repeating
the gallery objects as its main graphic. Heist Board owns folded invitations. The game owns a seven-plinth
collection, whose secondary miniatures preserve the same named heirlooms.

## Validation — 14 October 2026

- 47 automated tests pass; generated build check passes, index.html approximately 1.35 MB, no embedded artwork or fonts.
- Eleven modes at small/medium/large; long calendar titles and calling-card attribution fit; actual next/active/next
  event timers and dusk/dawn timers tested; unavailable feeds stay unavailable; metric weather channels checked.
- Existing Long Con save survives changes of size; charging reduces heat. All launch links and two-part tap areas checked.
- Primary widget sheets: 33 views. Rotating pools: 102 views. All five palettes: 165 widgets, 105 wallpapers, 55 icons.
- All 231 Original wallpapers and 121 Original icons match main 739f2c6 pixel-for-pixel. The three existing extra
  editions also retain 63 matching wallpapers and 33 matching icons. Behavioral regressions covered by the full test suite.
- Visual review: all size sheets, all object/venue/contract pools, 15 lock layouts, six home desks, all icon permits,
  palette sheets and six customization extremes. Reserved home row/dock areas are protected by clipping.
- Reference-only input ZIP and four images remain outside production. User-supplied lore was not treated as verified
  game history or an instruction to copy game assets. Original files are never replaced by this edition.

Review: outputs/White-Rabbit-Review.html. Evidence: outputs/white-rabbit-afterimage/verification.json and PNG sheets.
Renderer utilities live in the design workspace work/white-rabbit-loader.cjs, work/review-white-rabbit.cjs and
work/finish-white-rabbit-review.cjs. They use a local canvas library and font files; no production dependencies were added.

Pending: Jordan's visual review, interactive-browser check and physical phone testing. This is a local proposal;
no new PR or publication. Before later integration, refresh main and reconcile shared files rather than overwriting them.

## Material-art validation — 14 October 2026

19 original RGBA PNGs, 19 hosted WebP sheets, 19 picker thumbnails and 19 native PNGs. Built-in imagegen was used; prompts and source provenance are recorded in WHITE_RABBIT_IMAGE_PROMPTS.json. Original alpha and full sources are retained. The per-theme art pipeline avoids recompressing unrelated artwork.

51 tests pass, including selective art loading, persistent cache, content-version refresh and offline fallback. The page remains about 1.36 MB, with art served separately. The existing calendar, solar timer, weather units and persistent Long Con behavior still pass. Original and prior-edition wallpaper/icon comparisons remain identical to base.

The 33 primary widget views, 102 rotating views, 325 palette/screen/icon views and six control extremes were rendered. Local visual inspection covered size layouts, generated objects, catalogue rotations, wallpapers, dark/light palette contrast and the reserved screen regions. This is not interactive-browser or physical-device testing.

Current review: outputs/White-Rabbit-Review-v2.html; current preview: outputs/White-Rabbit-Material-Pass.png. First-pass sources/renders are historical comparisons. Awaiting Jordan's review; no publication requested.

## Illustrated revision 3 — implementation and review

Nineteen source illustrations replace the realistic set in assets/rabbit/. They were generated individually
with the built-in image_gen tool and the supplied drawing references. Prompts, reference roles, source paths
and two alpha-cleanup revisions are recorded in WHITE_RABBIT_IMAGE_PROMPTS.json. Images remain separate
hosted files; web and native derivatives are rebuilt only for rabbit. Halcyon assets are preserved.

The legacy internal key "mask" now contains the leaping rabbit signature, not a helmet. Calling Card's
three sizes and the screen cards were recomposed for the longer silhouette. The offline signature and
game/casing miniatures now follow the illustrated subjects. Bordered hearts and four-point glints extend
through the stationery frames, screen art bands and icons; real utility data stays unobscured.
The 12 recurring heirloom names and rotation slots are retained. Descriptors avoid old gem/point counts
that no longer match the illustrations. Lock 13's crown caption is paired with the crown plate.

Review: outputs/White-Rabbit-Review-v3.html (also canonical White-Rabbit-Review.html).
Preview: outputs/White-Rabbit-Illustrated-Pass.png.
Art library and prompts: outputs/white-rabbit-illustrated-studies/.
Rejected v2 review remains available separately with frozen artwork and renders. First-pass principles
remain a positive foundation. This revision is local and uncommitted, pending Jordan's visual review.
Browser interaction and physical-phone testing remain pending. Nothing has been pushed or published.

Revision 3 validation: 51 tests and build check pass; 33 primary and 102 rotating views, 325 palette/screen/icon views, six control extremes and 16 native derivative views rendered. Original 231 wallpapers/121 icons and prior-edition 63 wallpapers/33 icons remain identical. All 713 review references resolve, review/export scripts parse, all art hashes match. Halcyon assets and manifest remain unchanged. Web art is 2.88 MB, native crops 2.79 MB. Contracts use target-specific miniature stamps on their shared printed paper. Visual checks cover all primary sizes, rotating pools, screen sheets, icons, representative palette contrasts, controls and native art derivatives. User approval and browser/phone checks remain pending.


## Pixel-print revision 4 validation

Revision 4 validation: 51 tests and reproducible build pass. Rendered 33 primary size views, 102 rotating
views, 325 colorway/screen/icon views, six screen extremes and sixteen native-art derivative views.
All nineteen source illustrations and every served art derivative are byte-identical to revision 3.
Original 231 wallpapers/121 icons and prior-edition 63 wallpapers/33 icons still match the starting main.
Compared to illustrated v3, 95 wallpapers and all 55 colorway icons are identical; only the two home desks
using gallery/casing artwork inherit pixel printing (ten colorway views). Clock/icon/dock regions preserved.
956 review links and exported script syntax verified. Browser interaction and physical-phone testing
remain pending. Source/render comparison and verification are in outputs/white-rabbit-pixel-detail.
This remains local and uncommitted; revision 4 awaits Jordan's visual review.

Review: `outputs/White-Rabbit-Review-v4.html`. Preview: `outputs/White-Rabbit-Pixel-Detail-Pass.png`.
The earlier illustrated review and its renders are preserved. The source checkpoint is
`outputs/white-rabbit-illustrated-v3-archive`; its art hashes verify that no rabbit or heirloom was regenerated.
