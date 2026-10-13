# Directive Zero — Civil Defense (revision 5, approved visual direction)

## Status and correction

Jordan rejected revisions 1 and 2. Both lost the density and atmosphere of the Original; adding borders, small labels and simple symbols was not sufficient. The user explicitly prohibits drawn characters in this edition and identifies NERV headquarters from Evangelion as visual inspiration. Neither rejected execution is an approved baseline.

Jordan subsequently described revision 3 as "much better" and requested restoration of the Original's noise, less clean negative space, and explicit study of NERV and MAGI displays. Revision 4 preserves that composition and refines its density. The new execution remains local and uncommitted, awaiting visual review; it is not deployed. Original remains the default. Base main: f236ee04990594b1c0739f894da724812bdb69c3. This continuation preserves the production checkout and its separate Deep Range work.

Jordan then liked revision 4's direction and supplied fourteen references, asking for greater variety. Revision 5 keeps the institutional identity and noise while differentiating the actual instrument geometry. Neither revision 3 nor revision 4 should be described as rejected.

On 13 October 2026, Jordan reviewed revision 5 and responded "very good". Revision 5 is now the approved visual direction, superseding earlier pending visual-review statuses. Preserve this execution as the baseline.

Jordan subsequently requested a pull request and will squash and merge it personally. The PR branch, `codex/directive-zero-civil-defense`, integrates the approved execution onto main `a13c469b7a8908402891f70daf47ee88620e0234`, preserving the merged Deep Range homes. Do not merge or enable auto-merge. Deployment and physical-device review remain pending.

## World before pixels

Directive Zero administers Shelter 9, unit D-00. The operator lives inside an urgent, bureaucratic and oddly calm civil-defense institution. Every emergency already has a form. Departments include Operations, Air Handling, Civil Defense, Records, Command, Broadcast and Evaluation. Places include Gate 09, shelter levels 1–5, the municipal grid, Record Vault and Lower Access.

The inherited palette remains near-black, warm white, amber, red alerts and green continuity, with the existing five colorways. The typography pair remains Shippori Mincho B1 and Barlow Condensed in the browser, with the inherited native widget font fallbacks. Large proclamations, amber timers, hex cells, mechanical analyzer rings, scanlines, clipped instrument frames and hazard rules connect this edition to the Original.

## Reference review and design ownership

Reviewed the actual Original in work/directive-original.png and src/paint/10_directive.js alongside the rejected medium-widget sheet. Also visually inspected the original NERV computer display at https://imgur.com/FmKMzVo and the synchronization display used as artwork at https://soundcloud.com/httpren/eva-beat-tape . These inform hierarchy, instrument density, information layering and color-coded authority. No franchise assets, names, marks, characters or layouts are incorporated.

The design failure to avoid: sparse central diagrams cannot be repaired by shrinking labels, repeating a barcode or adding a perimeter. Each widget must have an inhabited central instrument and readable primary information. Screens must retain the Original's large typographic hierarchy.

Revision 4 also visually inspected the MAGI defense-screen reference at https://pbs.twimg.com/media/CXhzrhbUkAA6LAy.png (source post: https://x.com/Nerv2015AD/status/682422536462700544). Its overlapping diagnostic layers, colored register fields, fine routing paths and persistent background activity inform density. The reference is not shipped or traced.

## Revision 4: occupied negative space

Retain revision 3's major layouts, native timer positions, type scale, twelve facility topologies and portrait-free cards. Dense terminal fields now run behind the main instrument with lower contrast, while practical readings remain the strongest layer. Amber is the instrument field, green is continuity/routing, red is restriction, and warm white carries the headline.

- Deterministic scan interference, uneven horizontal dropout marks, fine grain and colored register fragments restore texture. No bitmap noise or embedded assets.
- Register vocabulary and column/row cadence differ by department: permit/sector, duty/release, filter/cycle, carrier/relay, issue/retain, recon/buffer, camera/lock, registry/index, quorum/override, evaluation/retention, grid/bunk. These are fictional system records, not sensor claims.
- Ghosted circuit paths, nested arcs, coordinate cells and packet gates support each foreground composition. The central instruments gain tracing scales, secondary envelopes, bus rails and readout fragments.
- Operator cards use layered security-line patterns and punched indexing. They remain institutional documents with stable names and no portraits.
- Free zones receive local diagnostics: countdown lock registers, a solar cycle trace, broadcast receiver logs, command decision stacks, evaluation margins and shelter grid records. No duplicated hero asset is introduced.
- The same language extends through the fifteen lock notices and six home desks, inside the artwork band. Clock, app and dock reservations remain clear. Texture/detail controls still suppress the background treatment on wallpapers.

Do not regress to a universal border treatment, replace distinct instruments with one repeated chart, or make the main content low contrast in pursuit of noise. This is a refinement of the direction the user liked, not a new theme.

## Revision 5: instrument variety

The user-supplied references are stored with stable names 01.jpg–14.jpg in outputs/directive-reference-images/revision5, outside the production tree. Images 01/03 inform nested defense systems; 02/05/07 inform forceful alarm fields; 04/06 inform linked diagnostic geometry; 08 informs woven synchronization surfaces; 09 informs a faceted duty timer; 10/11/12 inform decision-state hierarchy; 13 informs security-document density; 14 informs distributed routing. This describes reference grammar, not permission to copy specific compositions, franchise words or logos. The handoff contains these as reference material only.

The concrete differentiation in this pass:

- Active Time gains a red interlock enclosure and its own request/assignment/release circuit. The live timer position and event targets are unchanged.
- Daylight Watch gains a green atmospheric contour field behind truthful readings and retains the weather-specific small instruments.
- Priority Signal becomes a red classified bulletin and tiled restriction map. The quote and complete attribution remain the primary content.
- Recon Feeds uses a converging acquisition fan beside a separate message-routing loom; the two app tap targets are preserved.
- Command Net becomes a distributed five-department mesh with layered routing, framed decision nodes and withheld authority. It is not a three-computer MAGI replica.
- Evaluation uses ten different woven mesh profiles, with different bends, fold counts, contractions and directional behavior. One shape is not recycled with new numbers. Existing ten evaluation records and half-hour selection remain.
- The twelve operator identities each own an abstract security diagram: registry interlocks, triage channels, integrity calibration, reserve banks, command steps, null-index void, carrier tuning, containment arcs, doctrine folds, provision slips, maintenance couplings and record spines. These remain portrait-free. Small/medium retain the identifying mark; large expands it into the document's central graphic.
- Shelter 9 gains stepped underground service decks around a power trunk. The simulation and charging behavior are unchanged.
- The existing status ring, broadcast spectrum and twelve distinct facility plans remain recognizable anchors. Camera views gain acquisition markers. Lock instruments now use five families, while the six home desks inherit the corresponding agency systems. Original typography and reserved clock/app/dock space remain.

The twelve operator identities, names, roles and IDs stay stable. New diagrams differentiate those identities without inventing replacement characters. No real Japanese/Chinese/Korean text is introduced into the product. The source references are never included as production artwork.

## Widgets and rotating records

- Operator Status: segmented concentric surface gauge, calendar order and real device reserve. Large adds a clearly fictional perimeter authorization record.
- Active Time: dominant amber native timer in a red interlock enclosure with a hex progress register; countdown to the real event, then until release, then the next event. Large adds an authorization circuit and the actual duty window.
- Daylight Watch: truthful daylight-phase progression, sunset/dawn countdown and six weather instruments. Temperature, humidity, UV, visibility, dew point and wind use distinct symbols. Missing readings stay unavailable. The phase rail does not invent sunrise or sunset hours.
- Broadcast: 44-band simulated receiver spectrum and a separate carrier analysis field; regulated civil broadcasting and a music-app link. No speaker illustration.
- Priority Signal: large quoted order, attribution, classified red field and sector restriction tiles. Existing departmental and archive content is preserved.
- Recon Feeds: converging visual-recon fan and civilian-message routing loom. Channel tap regions still open the correct apps. The analysis is fictional.
- Monitor Wall: twelve facility plans with separate topology: gates, fan arrays, ration lanes, cisterns, stairs, muster grid, generator bus, vault, decontamination chambers, service lift, mess hall and sealed access. No drawn people or perspective room doodles.
- Operator Calling Cards: twelve stable typographic permits with numerical identity, role, clearance, compartment and unique abstract security diagrams. No face, avatar or character silhouette. Small shows one; medium and large show two distinct identities.
- Command Net: five department blocks and a dense distributed consensus mesh. No copied three-computer franchise layout.
- Operator Evaluation: ten woven mesh profiles, retention histogram, evaluation verdict and ten recurring records. Explicitly fictional; not a health assessment.
- Shelter 9: stepped facility section with equipment banks and a municipal power trunk, no stick figures. Existing persistent simulation, per-run variation and charging power recovery are preserved.

Each department owns its primary graphic family. No Halcyon organs, specimen game, corporate softness, Deep Range ships or planetary radar. Half-hour slots rotate records on device refresh; this is not continuous background animation.

## Screens and icons

Fifteen lock notices retain the Original's huge proclamation, amber timer, hex cluster, instrument band and bottom readouts. Five instrument families: woven phase analysis, departmental consensus, shutter restriction tiles, recall spectrum and acquisition fan. These are static fictional agency documents. Clock space remains reserved.

Six home desks: perimeter authority, air handling, civil allocation, broadcast, access interlock and sealed records. Each has its own main diagram and supplemental register. App-row and dock bands stay clear. Scale, position, glow, detail and texture controls remain supported. Eleven permit icons are retained from the previous pass; they were not the subject of this correction.

## Validation and limits

38 tests pass on the PR integration, including seven Civil Defense exported-script checks. These cover eleven widgets at three sizes, complete text, timer/title separation, real calendar targets, unavailable weather, twelve operator identities, persistent shelter state, charging and tap targets. Build check passes at 1.31 MB without embedded image or font data.

Review renders: 33 widget layouts; 102 rotating-pool previews; five widget colorways; fifteen locks; six homes; eleven icons. Against current main, 231 Original wallpapers, 121 Original icons and 105 Expanded Deep Range wallpapers compare pixel-identically. Against the approved revision 5 renderer, 630 widget views, 105 wallpapers and 55 icons compare pixel-identically across all five palettes. Six home frames preserve icon and dock bands at three aspect ratios. The integrated small/medium/large sheets, locks and homes were visually reviewed. Visual approval was given by Jordan before integration.

Integration proof is saved in the design workspace under `outputs/directive-pr-validation/verification.json` and `integration-proof.json`; these are local QA artifacts, not production assets. Existing theme sources and the Android branch are preserved. The shared browser widget-size controls gain the Civil Defense option without changing the other editions.

Preview climate and calendar values are samples. The current climate adapter does not supply visibility, dew point or wind direction; those remain unavailable on-device unless supplied. Physical iPhone and Android rendering has not been verified. The Android branch is untouched and never merges into main.

Review: outputs/Directive-Zero-Review-v5.html (also updates the canonical review file). The comparison tab retains actual revision 4 snapshots; revision 3 remains archived. Handoff: outputs/Directive-Zero-Claude-Handoff.zip, including this file, APPROVED_DESIGN_DECISIONS.txt and the user-supplied references in a separate reference-only folder. When integrating into newer main, merge the edition additions; do not overwrite newer shared files.
