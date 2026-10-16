# The Long Road — Wayfarer's Folio

## Approved visual baseline, 16 October 2026

Jordan requested a full rework using the original theme pack as reference, carrying forward the

detail, variety, image-generation and size-consistency lessons from the prior editions. This is a

local edition with revision 8 visually approved by Jordan ("looks good"). Original remains the default.
Integration, browser interaction and physical-device testing remain pending. Publication has not been requested.

The user is a traveller collecting pages along the Wending Way. The Cartographers' Guild keeps

route books; Postal Riders carry letters; the Lamplighters tend the road; the Lantern Inn supplies

food, rumours and music. Preserve Brindle, Ashwood, Hollowmere, Calder Ruins, Old Tower, Pinewatch,

Fenwick Marsh, Sheepcote Hills, Saltmarsh Reach, the Grey Sound and Greyhallow Fells. The register is

warm, weathered and wry: a small practical kindness in a very large, occasionally unreliable world.

## Current drawing direction — revision 8 approved

The user's latest correction supersedes the detailed realism and dashboard-like book printing

of revisions 1–3. Retain parchment, sepia ink, red rubrication, IM Fell lettering, the established

places and all five palettes. Draw a fantasy journey: flat pen contours, irregular mountain

symbols, winding roads, small manuscript figures, heraldic omens and crooked landmarks.

Use open manuscript titles and marginal notes rather than dark bars, repeated grids and panels.

Do not retreat to sparse, generic decoration: detail should tell a story about the road.

Tolkien's maps are a stylistic reference only; all geography, figures and tales remain original.

## Ownership and variety

| Widget | Central composition | Supporting detail |

|---|---|---|

| Traveller's Ledger | Manuscript day leaf and remembered route | Calendar, weather, battery, crossing notes |

| The Road | Drawn hourglass and winding road | Event countdown then end countdown, departure docket |

| Sun & Sky | Sun-and-moon almanac | Actual daylight and six weather observations |

| The Minstrel | Woodcut lute and songbook | Musical staff, verse order, inn performance notes |

| Letters & Omens | Folded postal leaf | Attribution, postal riders, cancellation and sealing wax |

| Crier & Gossip | Two separately composed notices | Players' broadside and gossip tally |

| The Playbill | Twelve travelling productions | Different scenery, casts and venue context |

| The Gallery | Twelve recurring manuscript figures | Stable identities, occupations and short anecdotes |

| The Tavern | Crooked inn as a map landmark | Hearth, supper and gathering places |

| Road Omens | Twelve symbolic woodcuts | Each omen keeps a distinct subject and meaning |

| The Expedition | Illustrated route and camp journal | Existing saved traveller, possessions, food and health |

No hero artwork is shared between different widget modes. Screen landscapes are a separate family.

Gallery and omen illustration atlases are production sheets whose crops keep stable identities.

Fifteen lock headlines use six distinct map regions. Six home frames depict different places along

the established road. Keep the lock clock, home app row and dock clear. Every widget size is composed

directly; compact sizes retain hatching and marginal detail around protected real readings.

## Function and review

Actual calendar, weather, solar and battery data stay authoritative; unavailable readings are

explicit. Rotating fiction is labelled as road tales/imagined records. The Expedition keeps its

existing save and mechanics: walking on refresh, camping while charging or at night, a new traveller

after death. The existing engine performs at most eight bounded catch-up steps; this is fictional game time, not continuous phone activity or a measured charging history. Preserve all app destinations.

Render every size and every rotating subject, inspect the original alongside the proposal, compare

all untouched editions against current main, and exercise the exported script. Record what was

tested separately from browser interaction and real-phone checks. Include the current decisions

file in future handoffs.

## First-pass implementation and limits

Eight generated source sheets produce 54 crops, served through the existing art manifest.

Use `python scripts/art.py --theme longroad`; do not regenerate unrelated theme assets.

The native widget requests only the illustration crops it shows. Screens use separate landscape

and map plates. Built-in image generation prompts and provenance are in LONG_ROAD_IMAGE_PROMPTS.json,

LONG_ROAD_SCENERY_PROMPTS.json and LONG_ROAD_INSTRUMENT_MAP_PROMPTS.json.

The poster scenes are Brindle, The Lantern Inn, Hollowmere, Calder Ruins, Old Tower and Greyhallow

Fells. Existing fifteen headlines are unchanged. Home illustrations differ from lock cartography.

The page layout, typography and accent ink follow all five existing palettes; illustration ink

and hand-colour stay fixed, as printed book plates. Weather numbers are actual readings; decorative

engraved instruments are illustrations, not fabricated telemetry. The maps and omens are fiction.

Counterparts: Halcyon's clinical ownership, Deep Range's radar, Directive's institutional command

and White Rabbit's pixel-print elegance are not carried into this world. The Folio uses book

printing, musical notation, woodcuts, post and local storytelling. Shared motifs (red ink, book

rules, compass flowers) establish one edition; hero raster art is owned by one widget mode.

Validation and delivery: see LONG_ROAD_VALIDATION.json and the dated decisions entry. Existing

editions remain unchanged. This is a local proposal, pending Jordan's visual approval and actual

phone review. Browser interaction is also pending: the browser tool blocked the local file URL.

No alternate browser or localhost workaround was attempted. Do not publish or open a PR from the design request alone.

## Revision 2 brief — 16 October 2026

Jordan praised the illustration assets but rejected the sparse widget detail and Expedition's

old geometric map/traveller. Preserve the eight illustration sheets and all screen/icon designs.

Recompose the widgets as dense, legible printed folios: account columns and compass marginalia;

hour reckoning; solar tables; music and verse; postal cancellations; playbill tickets; village

witness records; inn room ledgers; annotated folklore. Detail belongs in the page body, at every

size, not only its border. Real values and live timers retain clear fields.

Replace the compass in Traveller's Ledger with a richly engraved compass rose. It belongs to

that widget; The Road uses hour reckoning rather than a duplicate compass. Rebuild Expedition

as an illustrated travel journal with four persistent traveller appearances, each shown walking

or camping, a distinct scene plate, possessions, companions and journal entries. Keep the current

save/charging mechanics. No primitive geometric traveller or randomly scattered triangle forest.

New art is limited to the requested compass and Expedition. This revision is not yet approved.

Revision 2 implementation: compass is exclusively a Ledger asset; the Road's duplicate was

replaced by hour reckoning. Ten source sheets now yield 63 crops. Four Expedition appearances

are selected by the existing saved-run variation, and walking/camp selection follows saved

camp state. Companion and place remain truthful saved-game text fields; the pictured scene

is a journal vignette, not a map of the current location. The current game owns all eight

new scene plates. No wallpaper or icon painter changed.

Validation: 63 tests and build pass; 780 widget renders, including 120 Expedition state views.

All 78 first-pass image files remain byte-identical. All 105 Folio screens and 55 icons match

first-pass output. Existing main comparisons remain unchanged. See the revision 2 review and

validation JSON for the exact automated scope. Browser interaction and phone checks are pending.

## Revision 3 — printer's detail, 16 October 2026

Jordan requested continued widget refinement, not a PR. Keep the first eight praised illustration

sheets and the revision 2 compass/travellers. The added language comes from the village's print

shops: account-paper rulings, engraved initial blocks, postal scrolls and cancellations, music

staves, playbill perforations, portrait proof borders and sewn journal bindings. It is decorative

book printing, not a new tracking system or measured data. Existing world/ownership table applies.

All eleven widgets and all three sizes are refined. The Road's large hour-reckoning table becomes

a threaded sequence of five stops. Portrait framing varies by stable villager identity. Small

fields keep full text; short passages can reveal a printer's device below them. Timer regions

remain clear, compass and postal-corner captions fit, and unavailable sun phase is NO REPORT.

All 93 Folio image files, 105 screen views and 55 icons are unchanged. Source comparisons use

the same data across revisions. Verification remains 63 passing tests, build check, 780 rotation/

palette/game renders plus 12 stress cases. See LONG_ROAD_VALIDATION.json. The review and source

checkpoint for revision 2 remain available; fresh review is Long-Road-Review-v3.html.

This is a local proposal awaiting visual approval. Browser and actual-phone checks remain pending.

## Revision 4 brief — a journey drawn in ink, 16 October 2026

Jordan likes the aesthetic and widgets but finds the artwork too realistic and the composition

too modern. The new reference is Tolkien's map drawing: stylized pen contours, symbolic mountains,

inked roads and literary fantasy marginalia. This explicitly supersedes preserving the detailed

copperplate realism of earlier passes. Keep the world's places, identities, palette families,

useful readings and saved game; redraw the art as flat original map symbols and remove dashboard

section bars, repeated ruled panels and realistic material shading. No copied Tolkien geography,

names or characters. The user should feel they carry a journey, with people and omens met along

the road. Density comes from storytelling and cartographic detail, not telemetry or form tables.

Official reference: https://www.tolkienestate.com/painting/maps/ (reference only).

This is a local design revision, not approval or publishing authorization.

## Revision 4 implementation

Seven active transparent ink atlases provide 63 individually fitted crops: seven equipment

emblems, twelve people, twelve omens, twelve plays, eight paired traveller scenes, six places

and six map regions. Earlier images are archived in outputs/long-road-v3-checkpoint/assets.

Source images are generated with the built-in image tool; prompts and source provenance are

in LONG_ROAD_INK_PROMPTS.json and LONG_ROAD_INK_EQUIPMENT_REFIT.json. Crop geometry is recorded

in LONG_ROAD_INK_CROPS.json. The first equipment atlas was refitted to prevent cropped details.

All eleven widget layouts share open ink headings but keep their own composition. The Ledger

has a remembered road with crossing notes. The Road follows a wandering sequence of stops.

The almanac records hourly rain chances with rain strokes. The remaining pages use music,

letters, folklore, notices and traveller records. Screen art uses the same drawn language,

with the established headlines, layout and reserved clock/app/dock areas. Icons are preserved.

Native crops and browser sheet coordinates use the same fitting record. scripts/art.py serves

only source sheets referenced by this edition, so obsolete realistic plates are not downloaded.

Original and prior editions are untouched. Real data, event timers, catalogue identities,

saved traveller appearance, charging/night camping, app destinations and header alternation

retain their existing behavior. Current validation is in LONG_ROAD_VALIDATION.json.

This is a local proposal. User visual approval, browser interaction and phone checks are pending.


The Playbill atlas was also refitted to leave clear gutters (LONG_ROAD_INK_PLAYBILL_REFIT.json).
Final source/crop framing is recorded explicitly rather than assuming the generated grid is
perfectly even. Night Ink's omen drawings sit on pale manuscript scraps for readable silhouettes.


## Revision 5 brief — stories in the margins, 16 October 2026

Jordan called revision 4 "much closer" and asked to lean further into the fantasy journey,
filling remaining widget space with little map details and story elements. Keep its seven ink
atlases and open manuscript direction. This is additive refinement, not a new visual reset.

The Wending Way gains marginal discoveries: a toll paid in a rhyme, a door beneath a hill,
a well that returns a whisper, a ferry that waits for a lantern, and bells heard across the fens.
These are labelled scraps of road lore, not new measured telemetry or current game events.
The Cartographers' Guild maps remembered paths; Postal Riders mark crossings; the Minstrel
collects echoes; players annotate their touring route; villagers keep local landmarks; the inn
has paths that converge at its door; Old Maud's omens gain varied charms and tales. Expedition
marginalia remains an imagined drawing, distinct from the actual saved journal and location.

Each widget receives its own small landmarks and scene arrangements at all three sizes.
Preserve primary art ownership, typography, palettes, live readings/timer regions, stable pools,
saved game behavior and all existing screens/icons. No new raster hero artwork is needed.
Revision 4 review, renders, source and art are preserved before this work. Local review only.


## Revision 5 implementation and review

The new detail uses small native pen drawings around the seven existing image atlases. Eight
waymarks combine into varying marginal routes; broad field boundaries, wooded paths, water,
orchards and hill contours fill the leftover space. Each widget has a different geographic
arrangement. Compact sizes retain the same visual language. New text is road folklore: a
bridge that asks for a rhyme, a door beneath a hill, bells under Hollowmere and a light at
Calder Ruins. The large postal page carries a remembered ferry route, and the two notices
carry different tales. No fictional note is presented as a current game event or real reading.

The shared painter records the actual text and image bounds, then clips only the new background
lines around them. Explicit live timer masks protect the native timer fields even when their
text is supplied separately. No browser-only canvas clipping or new runtime API is required.
The established cross-theme concepts remain distinct: this is travelling folklore, postal
routes, village encounters and a saved expedition, not corporate instruments or surveillance.

Revision 4 is preserved at outputs/Long-Road-Review-v4.html with frozen renders and a full
source/art checkpoint. Fresh review: outputs/Long-Road-Review-v5.html. Evidence, exported
script, matched-data comparisons, stress views and preservation results are in
outputs/long-road-journey-folio. All 84 image files, 105 screens and 55 icons are identical to
revision 4. Thirty live timer fields match pixels. 63 tests/build pass, including 165 actual
native export combinations; 780 widget views and 12 stress cases rendered. Current structured
results are in LONG_ROAD_VALIDATION.json. Visual approval and browser/phone checks remain
pending. Local refinement only; nothing committed, pushed or submitted for merging.

## Revision 6: journal miniatures and layout audit

Jordan called revision 5 "much better" and requested a pass for overlapping or cut-off assets.
During that pass Jordan added: "the small graphics become vector graphics as opposed to the
journal theme". Preserve the positively received ink-journal direction. Small landmarks and
terrain must share the main illustrations' hand-drawn character, rather than becoming clean
geometric interface symbols. This is a refinement request, not final visual or publishing approval.

Twelve new original journal miniatures replace the geometric landmark/terrain marks: gate,
bridge, ruined tower, well, windmill, hill door, ferry, standing stones, trees, mountains, hills
and river. They are generated brown-ink/ivory/red drawings, used in native and preview layouts.
Shared miniatures are versioned and cached alongside each widget's stable subject. The tiny
remaining pen contours have irregular organic shapes; no new modern tracking language.

Layout fixes separate small Playbill art, venue and title; put Expedition and Tavern captions
below the art; give Gallery plate numbers their own margin; space tiny wrapped text; reserve
an omen value column; fit miniature drawings to their space and separate neighboring subjects.
All existing widget hero images remain unchanged. Real readings, live timers, app destinations,
rotation, saved traveller appearance and charging/camping mechanics are preserved.

The audit also found older screen crop defects: clipped ruin/coastal tower tips and a fragment
of the next scene inside the inn crop. The six existing settlements were reframed into a safer
portrait atlas, preserving their subjects and drawing language. Two map crop bounds were corrected.
Only those screen illustrations/crops change; screen composition and clock/app/dock reservations stay.
Prompt/crop provenance: LONG_ROAD_MARGINALIA_PROMPT.json, LONG_ROAD_MARGINALIA_CROPS.json,
LONG_ROAD_LANDSCAPE_REFIT.json and LONG_ROAD_LANDSCAPE_CROPS.json. Generated with built-in image_gen.

Review: outputs/Long-Road-Review-v6.html. Evidence: outputs/long-road-journal-folio.
Revision 5 review/renders remain frozen; its full source/art snapshot is outputs/long-road-v5-checkpoint.
Current source remains work/foundry-long-road. 64 tests and build check pass, including 165 actual
native export combinations. 780 widget/catalogue/game views, 105 screens and 55 icons rendered.
492 layout cases report zero detected text/text, text/art, art/art or widget-edge conflicts.
75 native crops match their sources; 91 served files decode and match hashes. All 51 pre-existing
widget hero crops are unchanged. Of 84 prior Folio image files, 73 remain identical and 11 files
contain the landscape/map corrections; 15 files add the twelve miniatures and their atlas versions.
30 live timer fields and 55 Folio icons match revision 5. 50 screen views inherit crop corrections;
55 screen views stay identical. Original 231 wallpapers/121 icons and earlier-edition 405 wallpapers/
220 icons remain identical, as do all 110 prior-edition image files. 104 review links checked.

Visual review covers primary sizes, representative full rotating-pool sheets, all walk/camp states,
Night Ink and other palettes, long/missing-data cases and full corrected asset proofs. Geometry
and crop checks supplement source-rendered visual review; they are not actual browser or phone
testing. Those remain pending, as does Jordan's review of this revision. No commit, PR, push,
merge or deployment authorized or performed. Include the current decisions in future handoffs.


## Revision 6 visual approval — 16 October 2026

Jordan responded "i like them" after the journal-detail and fit pass. Revision 6 is the
approved visual baseline. Preserve the fantasy ink illustrations, journal miniatures,
varied map/story margins at every size, and corrected spacing and crop bounds. This
supersedes earlier pending visual-review statements, retained above as history.

Existing validation remains unchanged; this checkpoint records approval only.
Integration, browser interaction and physical-device testing remain pending.
No commit, PR, push, merge or deployment was requested or performed for this approval.

## Revision 7 readability refinement — 16 October 2026

Jordan approved revision 6, then corrected the large and medium widgets: "large and medium
small text is really hard to read". Preserve the approved fantasy ink art and journal detail.
This is a focused readability refinement; it does not revoke the approved visual direction.

All eleven medium and large compositions now use a nominal 12-point minimum for labels,
notes, captions and other small writing, with full-strength palette ink and clearer mixed-case
labels. Main manuscript headings, meaningful data and illustrations retain their hierarchy.
Reflow attributions and long names; do not rely on tiny type to fit them. Gallery plate numbers
have a dedicated top strip. Letter stamps, route notes and lower captions have more room.
Medium Expedition shows a truthful possession count when its full inventory would not fit;
the large journal wraps inventory and fits the newest complete log entries in the remaining
space. The game engine, save, charging/camp behavior and live timers are unchanged.

Review: outputs/Long-Road-Review-v7.html. Evidence: outputs/long-road-readable-folio.
The review defaults to actual logical widget dimensions, with an optional enlarged view.
Revision 6 review/renders are frozen; source, artwork and docs are in outputs/long-road-v6-checkpoint.
The current source remains work/foundry-long-road. No new image generation or raster edits.

64 tests and build check pass, including all 165 actual export combinations. Export assertions
now enforce the wider widgets' minimum font size and full text opacity. 780 widget views,
105 screens and 55 icons rendered. The 492-case layout audit reports zero text/art/edge
collisions; all 4,909 wider-widget text runs use at least 12-point fonts (minimum effective
canvas width-adjusted equivalent 11.61 points). This is a rendered-font check, not a device test.
All 255 small-widget comparison views, 99 Folio image files, 105 Folio wallpapers, 55 icons
and 30 reserved live-timer regions match revision 6. Original 231 wallpapers/121 icons,
earlier editions' 405 wallpapers/220 icons and all 110 prior image files remain unchanged.

Revision 7 awaits user review. Revision 6 remains the approved art baseline. Browser interaction,
physical-phone testing and integration remain pending. Nothing committed, pushed, merged or
published. Include these decisions in future handoffs.


## Revision 8 clear ink and shorter Crier — 16 October 2026

Jordan corrected revision 7: large widget 06 has too much wording, and a line crosses
assets in large widget 01. Text must not intersect other elements in any widget.
Keep revision 6's approved fantasy journal artwork and revision 7's wider-widget legibility.

Large 06 / Crier & Gossip now has two short entries in each column instead of three
annotated stories, secondary prose and extra captions. The whole widget falls from 110
to 48 words (56% fewer), without reducing the type size. Its existing crier horn and well
illustrations take more of the page. Medium and small 06 keep their previous wording.

The crossing in 01 exposed a gap in previous QA: the earlier audit tested text, raster
art and edges, but did not test decorative lines. Earlier zero-collision reports must not
be read as proof that line crossings were checked. The correction records one composition,
then replays it in its original layer order with all strokes clipped around the final text,
art and live-timer reservations. This covers early routes, rules, stamp outlines and tiny
filled ornaments as well as late marginalia. Small-widget masks also accommodate wide letters.
This uses native-compatible path segments, not a browser-only clipping API.

Review: outputs/Long-Road-Review-v8.html. Evidence: outputs/long-road-clear-folio.
Revision 7 review/renders remain frozen, with full source/art in outputs/long-road-v7-checkpoint.
Current source: work/foundry-long-road. All 33 layouts receive the ink-clearance correction;
only large 06 loses wording. No new image generation or raster edits.

64 tests and build check pass, including 165 actual exported mode/size/palette combinations.
780 widget views, 105 screens and 55 icons rendered. The expanded 492-case audit checks
glyph bounds, raster alpha bounds, text/art/edge intersections, every emitted stroke and
small filled ornament; zero detected intersections. It inspected 107,961 emitted paths
and 8,330 small marks. Primary sizes, Night Ink, catalogue and stress sheets were visually
reviewed as source renders. Wider text keeps its nominal 12-point minimum and full ink.

All 99 Folio image files, 105 wallpapers and 55 icons are unchanged from revision 7.
Ink within all 30 reserved timer comparison regions changes as crossing decoration is
removed; timer placement, dates, values and behavior are preserved by the export tests.
Original 231 wallpapers/121 icons, earlier-edition 405 wallpapers/220 icons and 110 prior
image files remain unchanged. Saved game and charging logic are unchanged.

Revision 8 awaits user review. The approved art baseline is revision 6. Browser interaction,
physical-phone testing and integration remain pending. Nothing committed, pushed, merged
or published. Include this updated decision record in future handoffs.


## Revision 8 approval and Claude handoff — 16 October 2026

Jordan reviewed revision 8 and said "looks good." Revision 8 is now the approved Wayfarer's
Folio baseline, including revision 7's readable type, the shorter large Crier & Gossip,
and the line/text/art clearance across all sizes. Older pending-review statements below
are historical and superseded. Preserve the fantasy ink art, journal miniatures, map and
story detail, size-specific layouts, and the lighter wording in large 06.

Jordan first requested a PR, then changed the instruction to "send me the handoff instead."
The active request is a Claude handoff. No Long Road commit, branch push or PR was made.
No merge, auto-merge, direct-main push or deployment is authorized by this handoff. Jordan
retains personal squash-and-merge ownership if he later asks for a PR.

Approved design source: work/foundry-long-road, based on 2ec23530c92d62aac25cbd497ee81afa6155a1cd.
Current main fetched for this handoff: 53a565d59d4de99cb77a8ddf7ca7bfd31510ca9e.
Local handoff validation copy: work/long-road-handoff-check. The source additions are
applied on that newer main; its White Rabbit home-frame picker fix (#9), Lupin archive
and legion-line updates (#10) must be retained. Current main's full decision record is
preserved beneath the Long Road entries. Shared source files from an older design snapshot
must never replace newer main wholesale. Android stays on its separate branch.

Approved reference: outputs/Long-Road-Review-v8.html; renders: outputs/long-road-clear-folio.
Handoff: outputs/Long-Road-Claude-Handoff.txt and the numbered Long-Road-Claude-Handoff ZIPs.
The package includes source changes, all 99 Long Road artwork files, previews, provenance,
tests, hashes and validation. Follow its READ_FIRST.txt for extraction and integration.
Browser interaction, physical-phone testing and deployment remain separate pending checks.
Include this reconciled decision record in subsequent handoffs.


Handoff validation on current main 53a565d59d4de99cb77a8ddf7ca7bfd31510ca9e: 64 tests/build pass, including 165 actual
export combinations. The integrated source matches approved revision 8 pixel-for-pixel in
780 widget views, 105 wallpapers and 55 icons; all 99 Long Road image files match exactly.
The fresh 492-case glyph/art/line/mark audit has zero detected intersections. Current main's
231 Original wallpapers/121 icons, 405 prior-edition wallpapers/220 icons and 110 earlier
image files are unchanged. White Rabbit updates #9 and #10 remain intact. These checks are
local source renders and export harnesses, not browser/device/live-site testing.
