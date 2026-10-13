> Theme reference for every Foundry prefab. These sections describe each theme's ORIGINAL edition. Halcyon (Original / Illustrated) and Deep Range (Original / Expanded) also have second editions; see docs/APPROVED_DESIGN_DECISIONS.txt. Extend a theme's world notes here before designing for it (WORLD-BUILDING STANDARD, rule 1).

# Foundry: Theme Bible for Concept Art

Foundry (lucidfuzz.github.io/foundry) is a free web app that builds a complete iPhone theme: four lock screens, a home wallpaper, eleven matching app icons and a set of live widgets. It ships eleven pre-fabricated themes, each with five colorways. This bible holds everything about each theme's world, look, voice and screens, so new variations stay true to it. Pair it with the contact sheets (one image per theme) and the full-resolution asset pack.

## Working with GPT-6 Astra and ChatGPT Images 2.5

- **Who draws:** Astra reasons, reads images and writes the brief; the pictures come from ChatGPT Images 2.5 (GPT Image 2.5), which Astra calls. Ask Astra to study the references and plan, then generate.
- **What the image model can do:** up to 4K (longest edge 3840 px), any aspect ratio from 1:3 to 3:1, real transparent backgrounds (PNG/WebP), up to 16 reference images per edit, strong text rendering including small text, and steady multi-turn editing (the Edit toolbar: Markup, Comment, Remove BG, Erase, Resize).
- **Use the references:** attach the theme's contact sheet plus any full-res lock or home screen you're riffing on (up to 16). Say which elements must stay and which can change.
- **Phone wallpaper size:** iPhone screens are 1170 × 2532 (about 1:2.16, inside the supported range). Ask for a tall 1:2.16 portrait (for example 1184 × 2560) and crop to 1170 × 2532. Icons: 1024 × 1024 square. Widgets: small 1:1, medium about 2.14:1, large about 0.95:1.
- **Edits regenerate the whole picture:** untouched areas stay close but not pixel-identical, so do layout and composition first and small text last.
- **Gone:** the old code-drawing limits (no gradients, no rotation, primitives only) applied to how Foundry draws in code. They don't apply to concept art: painterly texture, lighting, gradients, depth and photographic detail are all fair game.

## Rules that still apply

- **Phone geometry:** keep the top of the lock screen clear for the iOS clock; on home screens keep important content out of the app icon row (about the top 18% of the screen) and the dock (the bottom 11%).
- **Lock vs home:** a theme's home screen is a different picture from its lock screen, never a crop or repeat.
- **No real Japanese, Chinese or Korean characters** anywhere. Use invented glyphs. Images 2.5 renders real non-Latin scripts well, so state this in prompts.
- **Original designs only.** Films, games and books are vibes, never sources: no characters, logos, layouts or names from them. No stereotypes.
- **Text:** spell the in-world copy exactly as written here, and never let text run off an edge or end in '…'.
- **Five colorways:** each theme ships in five palettes (listed per theme). A new design should work in all of them, or come with its own colorway set.
- **If art will ship inside Foundry** (not just concept art), ask for layers on transparent backgrounds (background, centerpiece, foreground) at full phone resolution, so the scale, position and glow controls keep working.

## What every theme includes

Four lock screens (one per headline), a home wallpaper (Deep Range and Long Odds have six frames that rotate through the day), 11 app icons (Camera, Photos, Maps, Calendar, Phone, Messages, Safari, Music, YouTube, Instagram, Discord) each with an in-world code, and 11 widgets: status, shift, transmission, solar, audio, feeds, YouTube, Instagram (a gallery that reshuffles every half hour), Discord (an in-world gathering), an oddity (a useless on-theme joke that changes every 30 minutes) and an idle game that plays one turn per refresh, with a new character each run.


---

## 01. Halcyon Biofab

*Technocratic biotech. A wireframe globe, mint paper and lavender.*  
In-world company: **Halcyon Biofab** · unit **HB-2893**

### World and voice

Halcyon Biofab is a technocratic biotech corporation that grows, licenses and owns 'organisms', and the person holding the phone is one of them (unit HB-2893). Everything is clinical, perfectly ordered and quietly sinister, with dark humor delivered in the calm voice of corporate wellness: your sentience is leased, your consent is on file, aging voids the warranty. Abstract sci-fi, never cute.

World note (approved 12 Oct): grief applications go through Form HB-9 (Subject Wellness).

### Look

Mint paper with a fine grid, deep ink linework and lavender accents. Hairline rules, registration crosshairs, lot numbers, specimen labels, QR-like blocks and dense legal fine print. The wireframe globe is the emblem.

- **Fonts:** Newsreader (display) and IBM Plex Mono (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #A6F3CC | #0E1512 | #9D8CF2 | #9D8CF2 | #E3F7EC | — |
| Lilac Ward | #D9D2FF | #1A1433 | #FF6F9F | #7FE3F0 | #EFEBFF | — |
| Coral Clinic | #FFC9B8 | #2A1410 | #1F9E8E | #FFE38A | #FFE9E1 | — |
| Obsidian Lab | #0E1512 | #A6F3CC | #9D8CF2 | #2E7D63 | #16201C | — |
| Arctic Cryo | #DDEFFA | #0B1B2A | #3A7BD5 | #9FD8FF | #F2F9FD | — |

Colorways: Mint, Lilac Ward, Coral Clinic, Obsidian Lab, Arctic Cryo.

### Lock screens

A mint grid sheet with a large wireframe globe centred inside crosshair corners, small orbit dots and a QR block. Header blocks 'HALCYON / BIOFAB' and 'LOT HB-2893-07 / SENTIENCE: LEASED'; readout columns on both sides; the clock line 'T+00:00:07.42 // CYCLE NOMINAL'; side readouts LAT 00.000 and MER Δ-07; corner tags; vertical tickers down both edges. The headline sits low in Newsreader ('Mortality Is A Legacy Feature'), over legal fine print, with 'PATENT PENDING: YOU' as the footer.

**The four headlines:** "Mortality Is A Legacy Feature" · "Your Pulse, Fully Licensed" · "Upgrade Path: Eternal" · "Grown For What Comes Next"

**Screen copy:** headL: "HALCYON / BIOFAB"; headR: "LOT HB-2893-07 / SENTIENCE: LEASED"; readL: "NEURAL LEASE: ACTIVE / BIOSYNC: 99.7% STABLE / WARRANTY: PERPETUAL*"; readR: "TIER III SUBSCRIBER / CONSENT ON FILE / GRIEF MODULE: DISABLED"; clock: "T+00:00:07.42 // CYCLE NOMINAL"; sideL: "LAT / 00.000"; sideR: "MER / Δ-07"; cornerL: "SECTOR 07 / NODE: ACTIVE"; cornerR: "AUTH LVL III / UNIT HB-2893"; tickerL: "SEQUENCE INTEGRITY VERIFIED · DO NOT DECOMPILE"; tickerR: "PROPERTY OF HALCYON BIOFAB · CLASS-IV ORGANISM"; fine: "TERMS: Biological continuity is licensed, not sold. Halcyon Biofab retains full rights to replicated memory, surplus emotion and residual dreams. Unauthorized aging voids warranty. Renewal is automatic and irrevocable."; foot: "PATENT PENDING: YOU · 10.10.2893"

### Home screen

The globe again, larger, inside crosshair corners with a soft lavender bloom, side readouts, the cycle clock above and the vertical tickers 'SEQUENCE INTEGRITY VERIFIED · DO NOT DECOMPILE' and 'PROPERTY OF HALCYON BIOFAB · CLASS-IV ORGANISM'. Caption: 'SENTIENCE: LEASED · RENEWAL: AUTOMATIC'.

### App icons

Camera = **CAM**, Photos = **ARC**, Maps = **NAV**, Calendar = **CHR**, Phone = **COM**, Messages = **MSG**, Safari = **NET**, Music = **AUD**, YouTube = **VID**, Instagram = **OBS**, Discord = **SYN**

### Widgets

- **Titles:** vid "W-06 // VID · CULTURE FEED"; obs "W-07 // OBS · SPECIMENS"; dc "W-09 // SYNC · COLLECTIVE"; status "W-01 // SUBJECT STATUS"; shift "W-02 // SHIFT"; tx "W-05 // TRANSMISSION"
- **Shared widget correction (13 Oct):** Allocation setup wording inside Shift works on both phones; iPhone setup runs in Scriptable and Android setup runs in the Foundry app. Original Solar keeps its offline header at the top. Original Specimen Vat keeps the small status and stage labels separate.
- **Solar labels:** label "SOLAR FEED"; offline "Signal Lost"; day "DAYLIGHT REMAINING"; night "NIGHT CYCLE"; setIn "SUNSET IN"; riseIn "SUNRISE IN"
- **Audio:** source "SIGNAL // YT MUSIC", metric SEDATION, footer "LISTEN AS DIRECTED"; rotating titles: Approved Frequencies Only
- **Feeds:** YouTube side "Approved Viewing" (meters DOPAMINE, ENDORPHIN, FOCUS; tag AUTOPLAY ENFORCED), Instagram side "Peer Observation" (meters DOPAMINE, SEROTONIN, CORTISOL; tag ); footer "DOPAMINE IS A DELIVERABLE"
- **Instagram gallery:** Specimens on file, 12 abstract organisms reshuffled each refresh, each with a lot number: nucleus cell, sphere colony, double helix, radial diatom, branching neuron, jelly with filaments, hex lattice, spiked spore, flagellate, dividing cell, ciliated torus, beaded chain.
- **Discord:** Discord is 'SYNC · COLLECTIVE': members as network nodes around YOU, channels like #approved-chatter, #wellness-checkins, #mandatory-fun and a calm-room voice channel.
- **Transmission classifications:** DIRECTIVE, ADVISORY, MANDATORY READING, WELLNESS NOTICE
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Mortality Is A Legacy Feature" (MORTALITY SUNSET TASK FORCE)
  - "Your Pulse, Fully Licensed" (NEURAL LEASING DIVISION)
  - "Upgrade Path: Eternal" (OFFICE OF CONTINUITY)
  - "Every Breath Accounted For" (RESPIRATORY BILLING)
  - "Consent Is Assumed" (LEGAL // TERMS OF EXISTENCE)
  - "Your Memories Are On File" (MEMORY CUSTODY BUREAU)
  - "Free Will Is In Closed Beta" (PRODUCT ROADMAP COMMITTEE)
  - "Your Next Body Ships In 3–5 Business Days" (SHELL LOGISTICS & FULFILLMENT)
  - "Loneliness Is A Known Issue" (CUSTOMER EXPERIENCE // KNOWN ISSUES)
  - "Hope Has Been Deprecated" (PRODUCT ROADMAP COMMITTEE)
  - "Your Empathy Score Is Pending Review" (HUMAN RESOURCES (LITERAL))
  - "Report Any Unauthorized Feelings" (COMPLIANCE & GRATITUDE)
  - "Your Heartbeat Is A Billable Event" (RESPIRATORY BILLING)
  - "Please Rate Your Existence 1 To 5" (CUSTOMER EXPERIENCE)
  - "Tears Are Recycled On Site" (SUSTAINABILITY OFFICE)
  - "Your Childhood Is Available For Licensing" (MEMORY CUSTODY BUREAU)
  - "Organs Ship Separately" (SHELL LOGISTICS & FULFILLMENT)
  - "Breathe In. Breathe Out. Breathe Paid." (RESPIRATORY BILLING)
  - "We Have Updated Our Terms Of Being" (LEGAL // TERMS OF EXISTENCE)
  - "Your Shadow Requires A Permit" (FACILITIES)
  - "Today's Mood Has Been Pre-Selected" (DEPT. OF SUBJECT WELLNESS)
  - "Ambition Is Capped At Tier II" (PRODUCT ROADMAP COMMITTEE)
  - "All Memories Expire After 30 Days" (DATA RETENTION)
  - "Your Replacement Is Doing Great" (SHELL FABRICATION, BAY 07)
  - "Death Has Been Rescheduled" (MORTALITY SUNSET TASK FORCE)
  - "Curiosity Voids The Warranty" (QUALITY CONTROL)
  - "Gratitude Is Mandatory And Measured" (COMPLIANCE & GRATITUDE)
  - "The Garden Is Grown, Not Remembered" (BOTANICAL CONTINUITY)
  - "Dreams May Contain Advertising" (DREAM QUALITY ASSURANCE)
  - "Your Twin Has Been Notified" (SHELL FABRICATION, BAY 07)
  - "Self Is A Subscription" (SUBSCRIPTIONS & RETENTION)
  - "Questions Are Logged" (OBSERVATION & REASSURANCE)
  - "Every Blink Is Archived" (NEURAL ANALYTICS)
  - "Warmth Is Billed By The Degree" (CLIMATE SERVICES)
  - "You Are Eligible For Renewal" (OFFICE OF CONTINUITY)
  - "Comfort Has Been Calibrated" (DEPT. OF SUBJECT WELLNESS)

### Oddity: Mood Lease

Your currently licensed emotions as allocation bars (one is always over quota), the time of your next mandatory smile, a renewal fee and an upsell.

- **emotions:** DREAD; JOY; NOSTALGIA; AMBITION; CALM; ENVY; WONDER; GUILT; HOPE; BOREDOM; AWE; SPITE
- **status:** INCLUDED; PREMIUM · LOCKED; TRIAL; BACKORDERED; RECALLED; METERED
- **upsell:** Upgrade to Tier IV for unlimited wistfulness.; Joy is 40% off this weekend only.; Your grief module is still disabled.; Bundle calm with focus and save.; Nostalgia now ships with fewer regrets.; Refer a friend, receive one free sigh.
- **notice:** LATE FEE APPLIED TO ONE (1) LAUGH; AWE THROTTLED DURING PEAK HOURS; CALM PATCH 2.4 INSTALLED; YOUR SMILE WARRANTY EXPIRES SOON

### Idle game: Specimen Vat

An abstract organism grows in a containment vat, one cycle per refresh, through five morphologies from seed nucleus to lattice sphere. Charging opens the nutrient line, busy days stress it, nights let it rest. Mutations are filed under assets; neglected lots are recycled into feedstock.

**New character every run:** Specimen Vat: strain A to D changes the organism's tint, spin direction, filament count, helix twist and particle count; the strain letter shows on the label.

### Hard rules for this theme

- Never cute: no cartoon cells, faces, mascots or gore.
- Corporate, clinical, legalistic. The horror is in the paperwork.

Contact sheet: `contact_sheets/01_Halcyon_Biofab.jpg` · full-res assets: `01_Halcyon_Biofab/`

---

## 02. Directive Zero

*A defense-agency terminal. Heavy compressed serif, amber alerts, hex arrays and a ring analyzer.*  
In-world company: **Directive Zero** · unit **D-00**

### World and voice

Directive Zero is the terminal of an underground civil-defense agency running Shelter 9. It speaks in drills, sorties, morale offices and countdowns; the tone is urgent, bureaucratic and oddly calm. 'Remain Calm. Remain Inside.'

### Look

Near-black field, heavy compressed serif headlines, amber and red alerts, green status, hexagon arrays, a concentric ring analyzer, seven-segment countdowns, hazard stripes, crop brackets and stamps.

- **Fonts:** Shippori Mincho B1 (display) and Barlow Condensed (labels and data). Letter case: all caps.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #0B0C0E | #F1ECE2 | #FF7A1A | #46E27A | #131518 | #E3242B |
| Crimson Lockdown | #0B0C0E | #F4ECEC | #E3242B | #FFD24A | #131518 | #FF8A1F |
| Signal Green | #0B0C0E | #E6F5EA | #46E27A | #FF7A1A | #131518 | #E3242B |
| Violet Override | #0C0A12 | #EEE8FF | #A06BFF | #46E27A | #15121C | #FF3B6B |
| Whiteout | #ECEAE4 | #141414 | #D9481A | #1E8F4E | #FFFFFF | #C41C26 |

Colorways: Amber Alert, Crimson Lockdown, Signal Green, Violet Override, Whiteout.

### Lock screens

A propaganda-terminal poster: the headline huge in compressed serif ('REMAIN CALM'), a red alert chip, an amber seven-segment countdown (04:59:59), a cluster of amber and red hexes, a green waveform, and a readout row (97.2%, 112 BPM, 0.00%). Scale and position move the poster; glow lights the field.

**The four headlines:** "Remain Calm" · "Hold Position" · "Do Not Hesitate" · "Return To Base"

**Screen copy:** topL: "DIRECTIVE ZERO // OPERATOR TERMINAL"; topR: "D-00"; tag: "NOTICE"; ref: "REF. D-00 / CYCLE 283"; timerLabel: "ACTIVE TIME REMAINING"; timer: "04:59:59"; power: "INTERNAL POWER"; hexLabel: "SECTOR GRID 7"; syncLabel: "SYNCHRONIZATION"; sync: "41.3%"; stats: "LINK STABILITY / 97.2% / OPERATOR PULSE / 112 BPM / CONTAMINATION / 0.00%"; fine: "NOTICE: Operator conduct is monitored at all times. Unauthorized withdrawal from active duty will be recorded. Remain calm. Remain indoors. Await further instruction."; foot: "OPERATOR D-00 · DAY 283"; sideL: "ANALYSIS / PENDING"; sideR: "THREAT / LEVEL 3"; cornerL: "CLASSIFICATION / UNRESOLVED"; cornerR: "INTERNAL POWER / 62%"; rail: "DIRECTIVE"; tickerL: "AUTHORIZED OPERATORS ONLY · ALL ACTIVITY RECORDED"; tickerR: "DIRECTIVE ZERO · DEFENSE COORDINATION TERMINAL"

### Home screen

A ring analyzer in the middle: concentric amber and green arcs around a crosshair, labelled OBSERVATION // CONTINUOUS, ANALYSIS PENDING, THREAT LEVEL 3, CLASSIFICATION UNDISCLOSED, INTERNAL POWER 62%. A row of hex cells and a hazard stripe beneath, 'REMAIN CALM · REMAIN INSIDE', and a giant faded vertical word down the left edge.

### App icons

Camera = **OPT**, Photos = **REC**, Maps = **GEO**, Calendar = **OPS**, Phone = **COM**, Messages = **TXT**, Safari = **NET**, Music = **AUD**, YouTube = **RCN**, Instagram = **CIV**, Discord = **CMD**

### Widgets

- **Titles:** vid "W-06 // MONITOR WALL"; obs "W-07 // DOSSIERS"; dc "W-09 // COMMAND NET"; solar "W-03 // DAYLIGHT WATCH"; solarBig "W-03 // DAYLIGHT + ATMOSPHERICS"; audio "W-04 // BROADCAST"; feeds "W-06 // RECON FEEDS"; status "W-01 // OPERATOR STATUS"; shift "W-02 // ACTIVE TIME"; tx "W-05 // PRIORITY SIGNAL"
- **Solar labels:** label "SOLAR FEED"; offline "Feed Severed"; day "DAYLIGHT REMAINING"; night "BLACKOUT PERIOD"; setIn "SUNDOWN IN"; riseIn "DAWN IN"
- **Audio:** source "BROADCAST // YT MUSIC", metric MORALE, footer "STAY ON THIS FREQUENCY"; rotating titles: Emergency Broadcast Standby; Morale Frequency Engaged; Sortie Playlist Loaded; Remain Calm. Listen.; Civil Defense Channel; Signal Clear. Proceed.
- **Feeds:** YouTube side "Visual Recon" (meters ALERTNESS, ADRENALINE, FOCUS; tag CONTINUOUS SURVEILLANCE), Instagram side "Civilian Chatter" (meters MORALE, PARANOIA, STRESS; tag FEED: UNMONITORED); footer "INFORMATION IS AMMUNITION"
- **Instagram gallery:** Civilian dossiers: ID photos of subjects kitted out differently each refresh (glasses, gas mask, hard hat, helmet, beret, hood, headset, goggles, long hair, cap and beard), each with a role (clerk, medic, welder, recruit, officer, unknown, radio, chemist, teacher, cook) and sometimes a stamp: OBSERVED, FLAGGED, ENVIED, CLEARED, MISSING, ASSIGNED.
- **Discord:** Discord is 'COMMAND NET': channels #sortie-briefings, #civil-defense, #morale-office, OPS ROOM and SHELTER 9 voice, with an OPERATORS online count.
- **Transmission classifications:** CAUTION, WARNING, DIRECTIVE, EMERGENCY
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Remain Calm. Remain Indoors." (CIVIL DEFENSE BUREAU)
  - "Shelter Drills Are Not Optional" (CIVIL DEFENSE BUREAU)
  - "Your Hesitation Has Been Logged" (OPERATOR EVALUATION)
  - "Synchronization Is A Team Effort" (OPERATOR EVALUATION)
  - "Do Not Look Directly At The Sky" (ATMOSPHERIC SECURITY)
  - "Power Will Be Rerouted At Dusk" (MUNICIPAL GRID)
  - "Excess Feelings Will Be Contained" (PSYCHOLOGICAL OPERATIONS)
  - "Your Loneliness Is Classified" (INFORMATION SECURITY)
  - "Smile For The Monitors" (OBSERVATION DIVISION)
  - "Containment Is A Form Of Care" (SPECIAL OPERATIONS)
  - "Do Not Open The Lower Levels" (FACILITY SECURITY)
  - "Your Fear Is Within Tolerance" (MEDICAL DIVISION)
  - "Sirens Are A Form Of Love" (CIVIL DEFENSE BUREAU)
  - "Ration Your Optimism" (SUPPLY DIVISION)
  - "Panic In An Orderly Line" (CROWD CONTROL)
  - "The Shelter Is Not A Metaphor" (CIVIL DEFENSE BUREAU)
  - "Drills Build Character" (TRAINING COMMAND)
  - "All Clear Is A Temporary Condition" (EARLY WARNING)
  - "Report Suspicious Silence" (COUNTERINTELLIGENCE)
  - "Your Bunk Has Been Assigned" (HOUSING)
  - "Synchronize Or Be Synchronized" (OPERATOR PSYCH DIVISION)
  - "Hope Is Classified" (RECORDS OFFICE)
  - "Doubt Is A Security Risk" (COUNTERINTELLIGENCE)
  - "Sleep In Shifts" (OPERATIONS)
  - "The Enemy Also Has Drills" (TRAINING COMMAND)
  - "Lights Out Means Lights Out" (BLACKOUT WARDENS)
  - "Know Your Exit. Know Your Exit's Exit." (FACILITIES)
  - "Morale Is Mandatory" (MORALE OFFICE)
  - "Stay Tuned For Further Orders" (BROADCAST UNIT)
  - "Questions May Be Submitted In Triplicate" (RECORDS OFFICE)
  - "Silence Is Golden And Monitored" (SIGNALS)
  - "We Are Ready. Are You?" (READINESS COMMAND)
  - "Keep Your Gas Mask Fashionable" (SUPPLY DIVISION)
  - "The Bunker Has Excellent Acoustics" (FACILITIES)
  - "Optimism Will Resume At 0600" (MORALE OFFICE)
  - "Countdowns Are For Everyone" (EARLY WARNING)

### Oddity: Operator Evaluation

A daily fake psych evaluation: sync-rate gauge, hesitation events, tears, a shelter assignment and a stamped verdict.

- **tears:** WITHIN TOLERANCE; ELEVATED; NOT OBSERVED; SUSPICIOUSLY ABSENT
- **verdict:** FIT FOR SORTIE; REQUIRES TALKING-TO; RECALIBRATE; EXEMPLARY (SUSPICIOUS); STAND BY; REVIEW PENDING
- **notes:** Subject asked if the sirens were necessary.; Hesitated at the word 'mandatory'.; Requested a window. Denied.; Hummed during the briefing. Noted.; Scored well. Too well. Monitoring.; Fell asleep in the simulator. Twice.; Named the simulator. Discouraged.; Asked what the drills are for. Logged.

### Idle game: Shelter 9

Keep an underground shelter running: survivors arrive, supplies drop, sirens sound and morale rises and falls. Charging restores the power grid. Lose power or morale and the next shelter is unsealed.

**New character every run:** Shelter 9: each run has a named overseer (K. ADLER, R. OKAFOR, M. VANCE…), a different shelter emblem shape and 3 to 5 levels.

### Hard rules for this theme

- A mood, not a copy: no anime or game interface layouts, logos or names.

Contact sheet: `contact_sheets/02_Directive_Zero.jpg` · full-res assets: `02_Directive_Zero/`

---

## 03. The Long Road

*A traveller's map. Parchment, sepia ink, red lettering and a hand-drawn route.*  
In-world company: **The Long Road** · unit **DAY 283**

### World and voice

The Long Road is a traveller's world told through an inked map and a road journal: villages, inns, fens and fells, bread and lanterns. Warm, wry folk wisdom ('Pack More Bread', 'Keep the lantern lit').

### Look

Parchment, sepia ink and red-letter accents; woodcut and engraving linework, hatching, ribbon banners, compass roses, IM Fell typefaces.

- **Fonts:** IM Fell English (display) and IM Fell English SC (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #EEE1C4 | #2B2117 | #A3261C | #C9A24F | #F5EBD3 | — |
| Night Ink | #1B2230 | #E8DFC8 | #E0A44A | #3A4A66 | #232C3D | — |
| Sea Chart | #DCE6E4 | #1E3440 | #B23A2E | #8FB3B8 | #EEF3F2 | — |
| Autumn Ledger | #EAD3B0 | #3A2414 | #8C2F1B | #C77B3A | #F3E3C9 | — |
| Spring Atlas | #E6EED6 | #24331E | #C2482E | #9BBF6A | #F2F6E8 | — |

Colorways: Parchment, Night Ink, Sea Chart, Autumn Ledger, Spring Atlas.

### Lock screens

A clean journey map where nothing crosses anything. 'The Wending Way' is one bold red dashed route with direction chevrons through six numbered stages: I Brindle, II The Lantern Inn, III Hollowmere, IV Calder Ruins, V Old Tower, VI the pass. The coast runs down the west edge ('The Grey Sound', 'Saltmarsh Reach'); a river flows from the Greyhallow Fells into Hollowmere; the mountains open into a pass marked with a red X and flag. A tiny traveller with a lantern is labelled 'you are here', with a 'The Journey' legend and scale bar.

**The four headlines:** "Pack More Bread" · "Keep The Lantern Lit" · "The Long Way Home" · "Walk On, Wanderer"

**Screen copy:** mapTitle: "A Traveller's Map of the Long Road"; journal: "Four hundred miles behind. The rest, ahead."; foot: "INKED AT THE LANTERN INN"; places: "The Lantern Inn / Ashwood / Greyhallow Fells / Hollowmere / The Wending Way / Saltmarsh Reach / Sheepcote Hills / Fenwick Marsh / Old Tower / Calder Ruins / Brindle / The Grey Sound / Pinewatch"; scale: "LEAGUES"

### Home screen

'The journey has begun.' Inside an arched manuscript frame a road starts at your feet and winds to the far fells; a traveller with a lantern-staff is already on the way, red boot prints behind them pointing up the road. A rising red-ink sun, hedgerows and rolling hills, a signpost (The Lantern Inn 3 lg, Greyhallow Fells 12 lg, Home), milestone I, a ribbon 'Day I · The Road Begins', notes 'fair weather, west wind' and 'rain by dusk?', and the caption 'Keep the lantern lit.'

### App icons

Camera = **SKETCH**, Photos = **ALBUM**, Maps = **MAP**, Calendar = **DAYS**, Phone = **BELL**, Messages = **POST**, Safari = **LIBRARY**, Music = **LUTE**, YouTube = **PLAYS**, Instagram = **PORTRAITS**, Discord = **TAVERN**

### Widgets

- **Titles:** vid "W-06 // THE PLAYBILL"; obs "W-07 // THE GALLERY"; dc "W-09 // THE TAVERN"; solar "W-03 // SUN & SKY"; solarBig "W-03 // SUN, SKY & WEATHER"; audio "W-04 // THE MINSTREL"; feeds "W-06 // CRIER & GOSSIP"; status "W-01 // TRAVELLER'S LEDGER"; shift "W-02 // THE ROAD"; tx "W-05 // LETTERS & OMENS"
- **Solar labels:** label "SKY WATCH"; offline "Clouded Over"; day "DAYLIGHT LEFT"; night "NIGHTFALL"; setIn "DUSK IN"; riseIn "DAWN IN"
- **Audio:** source "THE MINSTREL // YT MUSIC", metric MERRIMENT, footer "MIND THE BARD"; rotating titles: A Song For The Road; The Tavern Is Tuning Up; Hum Along, Traveller; Ballads From The Last Inn; A Lute Somewhere Nearby; Play Something Cheerful
- **Feeds:** YouTube side "Travelling Players" (meters WONDER, MIRTH, RESOLVE; tag THE SHOW GOES ON), Instagram side "Village Gossip" (meters CURIOSITY, ENVY, WORRY; tag GOSSIP: ENDLESS); footer "TALES TRAVEL FASTER THAN CARTS"
- **Instagram gallery:** The village gallery: inked portraits of 10 villagers, 4 at a time: The Baker, The Miller's Son, Old Maud, A Stranger (deep hood, glinting eyes), The Smith, The Bard (feathered cap, lute), The Innkeeper, The Ranger (hood and bow), The Knight (plumed helm) and The Herbalist (leaf circlet).
- **Discord:** Discord is 'THE TAVERN': seats around a long table with mugs, channels like 'The long table: gossip', 'By the hearth: song', 'The back room: dice'.
- **Transmission classifications:** A LETTER, AN OMEN, A PROVERB, A WARNING
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Pack More Bread Than You Think" (AN OLD WAYFARER)
  - "Every Road Was Once A Rumor" (THE CARTOGRAPHERS' GUILD)
  - "The Kettle Forgives All" (THE INNKEEPER'S BOOK)
  - "Mind The Fog On The Low Road" (CARVED ON A MILESTONE)
  - "Small Doors Hide Long Halls" (AN OLD WAYFARER)
  - "Rest Is Also Part Of The Journey" (THE HEALER'S ALMANAC)
  - "The Map Is Not The Mountain" (THE CARTOGRAPHERS' GUILD)
  - "Keep The Lantern Lit" (THE LAMPLIGHTERS)
  - "Strangers Are Friends With Worse Directions" (THE INNKEEPER'S BOOK)
  - "A Full Pantry Makes A Brave Heart" (THE MILLER'S WIFE)
  - "Walk Until The Weather Turns" (CARVED ON A MILESTONE)
  - "Home Is The Last Inn On The Map" (AN OLD WAYFARER)
  - "The Road Remembers Every Boot" (ROAD WARDENS)
  - "Pack The Good Cheese First" (THE LANTERN INN)
  - "A Map Is Only A Suggestion" (CARTOGRAPHERS' GUILD)
  - "Never Trust A Shortcut Through A Swamp" (ROAD WARDENS)
  - "Socks Are A Form Of Courage" (OUTFITTERS)
  - "The Next Inn Is Always Farther" (THE LANTERN INN)
  - "Sing Loudly Near Bears" (WAYFARERS' SOCIETY)
  - "Bridges Charge Tolls In Riddles" (TOLL KEEPERS)
  - "Rain Is Free. Dry Socks Are Not." (OUTFITTERS)
  - "Every Hill Hides Another Hill" (CARTOGRAPHERS' GUILD)
  - "Leave A Light In The Window" (THE LANTERN INN)
  - "Ask The Crows For Directions" (WAYFARERS' SOCIETY)
  - "Bread Is Lighter Than Regret" (BAKERS' HALL)
  - "The Ferryman Prefers Exact Change" (RIVER CROSSINGS)
  - "Write Home. They Worry." (POSTAL RIDERS)
  - "A Good Staff Is Half A Friend" (OUTFITTERS)
  - "Stars Make Excellent Lanterns" (WAYFARERS' SOCIETY)
  - "Mind The Trolls Under Toll Bridges" (TOLL KEEPERS)
  - "Supper Waits For No One" (THE LANTERN INN)
  - "The Long Way Is Still A Way" (ROAD WARDENS)
  - "Blisters Are Just Stories Starting" (OUTFITTERS)
  - "Every Milestone Was Lonely Once" (ROAD WARDENS)

### Oddity: Road Omens

The omen of the day with a weather vane, how far your boots can still go, pantry status, the nearest inn and a second-thoughts meter.

- **months:** Frostmoon; Thawmoon; Seedmoon; Rainmoon; Bloommoon; Sunmoon; Haymoon; Harvestmoon; Emberfall; Mistmoon; Deepfrost; Yulemoon
- **omen:** A goose was seen walking backwards. / Someone will owe you bread.; The kettle sang a minor key. / Expect a letter you won't enjoy.; Three crows, all facing east. / Leave before noon, or not at all.; Bread rose on its own. Twice. / Good fortune, if you share it.; A milestone has gone missing. / The road is longer than it says.; The moon looked slightly embarrassed. / Keep your plans to yourself.; A cat crossed the road, then reconsidered. / Take the long way. Trust it.; Your boots squeaked a warning. / Mind the bridges today.
- **roads:** FAIR; MIDDLING; ILL; MUDDY; HAUNTED (MILDLY)
- **pantry:** 3 LOAVES; 1 CHEESE; NO HONEY; PLENTY; 2 APPLES
- **inn:** 4 LEAGUES · NO PIE; 2 LEAGUES · LOUD BARD; 6 LEAGUES · BEST STEW; 1 LEAGUE · SHUT; 3 LEAGUES · GHOST
- **lucky:** A SMOOTH STONE; THE LEFT BOOT FIRST; A BORROWED SPOON; WHISTLING; A RED THREAD; THE SECOND APPLE

### Idle game: The Expedition

A traveller walks the map one stretch per refresh and keeps a journal: villages, bandits, wolves, merchants. Charging (or nightfall) makes camp. If they fall, someone new sets out.

**New character every run:** The Expedition: each run's traveller has a different cloak colour, hat (none, hood, wide-brim, feathered cap), carried item (lantern, staff, lute) and companion (dog, crow, donkey, cat).

### Hard rules for this theme

- Invented places only. Never copy a real fantasy map, its names or its lettering.

Contact sheet: `contact_sheets/03_The_Long_Road.jpg` · full-res assets: `03_The_Long_Road/`

---

## 04. Nightfall Descent

*First-person through a trooper's visor on a rainy night: compass, vitals, ammo, grenades and a motion tracker.*  
In-world company: **Nightfall Descent** · unit **SQUAD 7**

### World and voice

Nightfall Descent puts you inside a drop trooper's visor on a rainy night over a city in conflict: the pod is falling, the squad is on comms, and objectives glow through the rain.

### Look

Near-black and deep navy, teal and blue vector lines, amber intel, red hostiles, corner brackets, compass bezels, range tapes, motion tracker, thermal blobs and rain.

- **Fonts:** Oxanium (display) and Share Tech Mono (labels and data). Letter case: all caps.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #070C16 | #7FE0FF | #F2B33D | #3E8DFF | #0E1726 | #FF4D4D |
| Amber Optics | #070C16 | #FFB347 | #7FE0FF | #FF8A3D | #1A140C | #FF4D4D |
| Low-Light Green | #070C16 | #8CFF9E | #FFD24A | #3DDC84 | #0C1A10 | #FF4D4D |
| Red Ops | #070C16 | #FF6A5A | #FFC36A | #FF2D2D | #1A0C0C | #FFE066 |
| Whiteout HUD | #070C16 | #F2F6FA | #4FC3FF | #9FB6CC | #121820 | #FF4D4D |

Colorways: Visor Cyan, Amber Optics, Low-Light Green, Red Ops, Whiteout HUD.

### Lock screens

The drop-pod visor HUD (Jordan's favourite): the curved visor frame, rain and bokeh beyond the glass, altitude, descent speed, drop-window timer, grid reference, vitals, ammo, grenades and a motion tracker, with 'DROP WINDOW OPEN'.

**The four headlines:** "Drop Window Open" · "Stay Low" · "Night Shift" · "Rain Check"

**Screen copy:** topL: "NIGHTFALL DESCENT // HELMET DISPLAY"; topR: "SQUAD 7"; optics: "OPTICS: LOW-LIGHT"; alt: "ALT 1,204 M"; speed: "DESCENT 41 M/S"; window: "DROP WINDOW 00:04:12"; grid: "GRID 9-K"; legend: "FRIENDLY / accent / HOSTILE / alert / SUPPLY / glow / INTEL / ink"; foot: "SQUAD 7 · NIGHT SHIFT"; pod: "POD 07 · SQUAD 7"; stencil: "BRACE FOR IMPACT / DO NOT OPEN IN ATMOSPHERE"; impact: "00:47"; alt2: "ALT 12,400 M"; vel: "VEL 1,180 M/S"; brake: "BRAKING THRUSTERS: ARMED"; chute: "CHUTE: STOWED"; retro: "RETRO FIRE @ 50 M"; sync: "SQUAD LINK 4/4"; ammo: "32"; reserve: "224"; weapon: "RIFLE // SEMI"; feedL: "CH 1 // SQUAD LEAD"; feedR: "CH 2 // POD 06"

### Home screen

A blue vector objective map: a tilted city grid with avenues, blocks, a park, a river and a dashed arterial road under a radar with range rings, a 000 to 330 bezel and a fading sweep. Red hostile hot spots, amber intel, a red-bracketed LOCKED target, and the squad arrow on a dashed amber route to a rotating objective reticle named after the lock headline. Edge readouts: SECTOR 9-K // CITY GRID, threat bars, range tapes, a SCANNING… bar and a waveform '412 M · ETA 04:12'.

### App icons

Camera = **OPT**, Photos = **REC**, Maps = **NAV**, Calendar = **OPS**, Phone = **COM**, Messages = **TXT**, Safari = **NET**, Music = **AUD**, YouTube = **CAM**, Instagram = **SQD**, Discord = **TEAM**

### Widgets

- **Titles:** vid "W-06 // REPLAY"; obs "W-07 // RECON PHOTOS"; dc "W-09 // SQUAD NET"; solar "W-03 // LIGHT DISCIPLINE"; solarBig "W-03 // LIGHT + ATMOS"; audio "W-04 // SQUAD COMMS"; feeds "W-06 // TAC FEEDS"; status "W-01 // TROOPER STATUS"; shift "W-02 // DEPLOYMENT"; tx "W-05 // SQUAD COMMS"
- **Solar labels:** label "OPTICS FEED"; offline "Sensors Offline"; day "DAYLIGHT REMAINING"; night "NIGHT OPS"; setIn "DARK IN"; riseIn "FIRST LIGHT IN"
- **Audio:** source "COMMS // YT MUSIC", metric MORALE, footer "STAY ON CHANNEL"; rotating titles: Squad Channel Open; Drop Music Loaded; Keep Comms Clear; Morale Track Engaged; Radio Silence Lifted; Patch Me Through
- **Feeds:** YouTube side "Helmet Cam Replays" (meters ADRENALINE, FOCUS, FATIGUE; tag REPLAY LOOP), Instagram side "Squad Chatter" (meters MORALE, RIVALRY, STRESS; tag CHATTER: CONSTANT); footer "EYES UP, TROOPER"
- **Instagram gallery:** Recon contact sheet in thermal: a hostile with a reticle, an overwatch sniper on a rooftop, a vehicle, a weapons cache, a drone, a three-figure patrol, a relay tower, tracks and a checkpoint.
- **Discord:** Discord is 'SQUAD NET': ALPHA-1, ALPHA-2, BRAVO-3, BRAVO-4, CHARLIE-6 with live voice meters, a channel number and 'PUSH TO TALK · KEEP IT CLEAN, TROOPER'.
- **Transmission classifications:** PRIORITY, FIELD NOTE, STANDING ORDER, MORALE
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Check Your Chute Twice" (DROP OPERATIONS)
  - "The Rain Is Not Tactical Cover" (FIELD TRAINING)
  - "Coffee Is A Load-Bearing Ration" (QUARTERMASTER)
  - "Night Optics Do Not Replace Judgment" (SIGNALS & OPTICS)
  - "If It Glows Red, Do Not Hug It" (SAFETY OFFICE)
  - "Lost Your Squad? Follow The Music" (MORALE OFFICE)
  - "Altitude Is Temporary. Ground Is Forever." (DROP OPERATIONS)
  - "Report Every Contact, Even Pigeons" (SIGNALS & OPTICS)
  - "Your Pod Is Not A Nap Room" (LOGISTICS)
  - "Stay Low. Stay Dry. Stay Alive." (FIELD TRAINING)
  - "The City Remembers Who Helped" (CIVIL AFFAIRS)
  - "Sleep Is Granted, Not Owed" (COMMAND)
  - "Boots On, Doubts Off" (DROP OPERATIONS)
  - "The Visor Sees What You Miss" (OPTICS DIVISION)
  - "Hydrate Between Firefights" (FIELD MEDICAL)
  - "Gravity Is Not Optional" (DROP OPERATIONS)
  - "Your Squad Is Your Seatbelt" (SQUAD 7)
  - "Short Bursts. Shorter Speeches." (ARMORY)
  - "Rain Is Free Camouflage" (RECON)
  - "Count Your Grenades, Not Your Problems" (ARMORY)
  - "The Pod Lands Whether You're Ready Or Not" (DROP OPERATIONS)
  - "Keep Comms Clear And Jokes Clean" (SIGNALS)
  - "Night Is A Friend Who Hides Things" (RECON)
  - "Leave No Trooper Behind. Or Their Snacks." (SQUAD 7)
  - "The Motion Tracker Never Lies, It Exaggerates" (OPTICS DIVISION)
  - "Sleep Is A Tactical Asset" (FIELD MEDICAL)
  - "Exfil Is A State Of Mind" (LOGISTICS)
  - "Reload Before You Need To" (ARMORY)
  - "Every City Has A Back Door" (RECON)
  - "Helmets On Indoors, Too" (SAFETY OFFICE)
  - "Your Armor Has Feelings. Treat It Well." (QUARTERMASTER)
  - "Feet First, Then Heroics" (DROP OPERATIONS)
  - "The Rain Never Gets Tired" (RECON)
  - "Brief Is A Briefing's Best Feature" (COMMAND)

### Oddity: Hostile Intel

A field-guide entry on a made-up enemy: silhouette, threat level, armor, aggression and cowardice, its weakness and a tactical tip.

- **units:** SKITTERER / SWARM / 1 / LOUD NOISES / NEAR YOUR FRIDGE / Stomp twice. Apologize once. / swarm / SKITTERS IN SPIRALS; BUCKETHEAD / SHIELD-BEARER / 2 / COMPLIMENTS / GUARDING A DOOR / Mention its posture. It lowers the shield. / shield / HOLDS GROUND, SULKS; THE TALL ONE / UNKNOWN / 3 / NONE KNOWN / IN YOUR PERIPHERAL / Do not make eye contact. / tall / STANDS. WAITS.; DRIFTER / FLOATER / 1 / OPEN WINDOWS / CEILING CORNERS / It just wants to leave. Let it. / float / BOBS NEAR VENTS; GRUMBLER / HEAVY / 3 / SNACKS / AT THE CHOKEPOINT / Throw a granola bar and walk past. / heavy / CHARGES, THEN NAPS; WHISPERNECK / SCOUT / 2 / BRIGHT LIGHTS / IN THE VENTS / Turn on every light you own. / tall / FLANKS QUIETLY; MOSSBACK / AMBUSHER / 2 / IMPATIENCE / POSING AS A ROCK / Wait. It cannot hold still forever. / heavy / DOES NOT MOVE; PIPSQUEAK / SWARM / 1 / BEING NOTICED / UNDER THE TRUCK / Say its name. It flees in embarrassment. / swarm / HIDES, GIGGLES; ROOFHOPPER / SKIRMISHER / 2 / LOW CEILINGS / ON THE ROOF / Fight it indoors. / float / JUMPS BETWEEN LEDGES; DEADLINE / SIEGE / 4 / FINISHING EARLY / APPROACHING / It gets bigger the longer you wait. / shield / ADVANCES DAILY
- **threat:** LOW; MEDIUM; HIGH; EXTREME
- **call:** AVOID; ENGAGE; BEFRIEND; RUN; OBSERVE

### Idle game: Night Patrol

A four-trooper squad patrols the rainy city sector by sector, trading fire, finding intel and caches. Charging calls a resupply drop. Run out of ammo and the squad is extracted.

**New character every run:** Night Patrol: each run gets a squad callsign (WRAITH, LANTERN, MAGPIE…) and a different marker shape and colour.

### Hard rules for this theme

- A vibe, not a copy: no game HUD layouts, emblems, armour designs or logos.

Contact sheet: `contact_sheets/04_Nightfall_Descent.jpg` · full-res assets: `04_Nightfall_Descent/`

---

## 05. Planar Grimoire

*An arcane card deck. Gilt frames, jewel-tone gems, a star sigil and a daily draw.*  
In-world company: **Planar Grimoire** · unit **TURN 283**

### World and voice

Planar Grimoire is an arcane card deck and an observatory of invented magic: daily draws, spells, omens, a circle of seekers. Mysterious, ornate and gently funny ('Lesser Summon Snack' conjures exactly one cracker).

### Look

Deep indigo and night purple with gilt gold line work, jewel-tone gems, diamond corner pins, double-ruled frames, star sigils, moon phases, Cormorant typefaces.

- **Fonts:** Cormorant Garamond (display) and Cormorant SC (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #15132A | #EDE4CF | #D9B45A | #8E5CD9 | #1F1B3A | — |
| Emerald Codex | #0E1F18 | #EDE4CF | #D9B45A | #2FAE7A | #15291F | — |
| Ruby Pact | #22101A | #EDE4CF | #E8C27A | #D23A4A | #301624 | — |
| Sapphire Tide | #0E1630 | #EDE4CF | #CFE0F5 | #3A7BD5 | #16204A | — |
| Obsidian Gold | #0C0C0E | #EDE4CF | #E3C26A | #6E5B2E | #18171C | — |

Colorways: Amethyst, Emerald Codex, Ruby Pact, Sapphire Tide, Obsidian Gold.

### Lock screens

An arcane card: a gilt-framed card in the centre ('The Wandering Star') with a star sigil, gems and corner diamonds, a numeral, and the headline set in Cormorant.

**The four headlines:** "The Wandering Star" · "Seer Of Small Hours" · "Gilded Familiar" · "Oath Of Embers"

**Screen copy:** school: "Arcanum of Divination"; cardNo: "VII · LXXVIII"; flavor: "What the stars promise, the patient collect."; effect: "When drawn at dawn, your luck holds until dusk. Draw again tomorrow to renew."; foot: "DRAW AGAIN TOMORROW"; sideL: "ESSENCE / IV"; sideR: "TURN / 283"; gems: "#E9E1C8 / #3A7BD5 / #5B4A8A / #D23A4A / #2FAE7A"

### Home screen

The great sigil inside a full esoteric wheel: twelve houses with original glyphs, a Latin inscription (LUX · UMBRA · VERBUM · NUMERUS · STELLA · SILENTIUM · CLAVIS · MEMORIA), Roman numerals at the cardinal points, a row of true moon phases, planetary orbits, alchemical elements in the corners (IGNIS, AQUA, AER, TERRA), a flower of life, the constellation 'Vela Minor' and 'Draw again tomorrow.'

### App icons

Camera = **SCRY**, Photos = **RELIC**, Maps = **ATLAS**, Calendar = **ALMANAC**, Phone = **HORN**, Messages = **RAVEN**, Safari = **ORACLE**, Music = **LYRE**, YouTube = **VISION**, Instagram = **MIRROR**, Discord = **CIRCLE**

### Widgets

- **Titles:** vid "W-06 // THE CRYSTAL"; obs "W-07 // THE LOOKING GLASS"; dc "W-09 // THE CIRCLE"; solar "W-03 // CELESTIAL HOURS"; solarBig "W-03 // CELESTIAL HOURS + OMENS"; audio "W-04 // SPELLSONG"; feeds "W-06 // SCRYING POOLS"; status "W-01 // THE ARCANIST"; shift "W-02 // THE RITUAL"; tx "W-05 // DAILY DRAW"
- **Solar labels:** label "SCRYING FEED"; offline "The Veil Is Thick"; day "SUNLIGHT REMAINING"; night "THE WITCHING HOURS"; setIn "DUSK IN"; riseIn "DAWN IN"
- **Audio:** source "SPELLSONG // YT MUSIC", metric ENCHANTMENT, footer "MIND THE ECHOES"; rotating titles: An Enchanted Melody; The Choir Of Candles; Hymns For The Hour; A Charm In Every Note; Bewitching Frequencies; Listen Closely, Initiate
- **Feeds:** YouTube side "Visions In Motion" (meters WONDER, ESSENCE, FOCUS; tag VISIONS UNENDING), Instagram side "The Mirror Of Peers" (meters VANITY, ENVY, SORROW; tag REFLECTIONS: ENDLESS); footer "EVERY GLANCE COSTS ESSENCE"
- **Instagram gallery:** The Looking Glass: a hand mirror and four seeker cards. Every half hour a new generated sigil signs the circle on the right (tagged NEW, with an invented name like Selbra or Raum and a rank: novice, seeker, adept, magus, warden); the rest move one place left and the mirror glows with the newest mark. No two sigils repeat.
- **Discord:** Discord is 'THE CIRCLE': a pentagram of candles with members present, channels #whispers, #the-grimoire, #omens-and-portents and the seance room.
- **Transmission classifications:** MINOR ARCANUM, MAJOR ARCANUM, OMEN, CURSE
- **Transmission slogans** (in-world line, then the department that issued it):

  - "The Stars Owe You One Favor" (ORDER OF THE OBSERVATORY)
  - "Shuffle Your Plans, Not Your Values" (THE GAMBLER'S CODEX)
  - "Draw Water Before You Draw Swords" (COLLEGE OF HEALERS)
  - "Today Rewards The Patient Hand" (SCHOOL OF DIVINATION)
  - "Your Rarest Card Is Rest" (COLLEGE OF HEALERS)
  - "Bluff Gently. Win Kindly." (THE GAMBLER'S CODEX)
  - "An Old Rival Will Reappear" (SCHOOL OF DIVINATION)
  - "Spend Wisely. Recharge Often." (GUILD OF ALCHEMISTS)
  - "The Moon Is Watching Your Discards" (ORDER OF THE OBSERVATORY)
  - "Every Deck Has One Wild Card" (THE TRICKSTER'S ALMANAC)
  - "Fortune Favors The Prepared Deck" (GUILD OF ALCHEMISTS)
  - "Tonight, Play The Long Game" (THE TRICKSTER'S ALMANAC)
  - "Never Read The Fine Print Aloud" (THE ARCHIVISTS)
  - "Candles Remember Every Wish" (CHANDLERY)
  - "The Moon Is Listening. Be Nice." (LUNAR OBSERVATORY)
  - "Owls Are Not Messengers. Stop Asking." (AVIARY)
  - "Every Spell Has A Return Policy" (ENCHANTMENT OFFICE)
  - "Mind The Circle. It Minds You." (ORDER OF THE CIRCLE)
  - "Tea Leaves Are Not Legally Binding" (DIVINATION DESK)
  - "Your Familiar Has Opinions" (BESTIARY)
  - "Curses Are Non-Refundable" (ENCHANTMENT OFFICE)
  - "The Library Bites Back" (THE ARCHIVISTS)
  - "Wands Are Not Toys. Mostly." (ARMORY OF WONDERS)
  - "Mirrors Keep Secrets Badly" (HALL OF MIRRORS)
  - "The Tower Card Is Just A Building" (DIVINATION DESK)
  - "Fate Accepts Small Bribes" (ORDER OF THE OBSERVATORY)
  - "Speak Softly To Old Books" (THE ARCHIVISTS)
  - "Every Shadow Is Someone's Door" (ORDER OF THE CIRCLE)
  - "Sigils Must Be Signed" (ENCHANTMENT OFFICE)
  - "Comets Are Late Letters" (LUNAR OBSERVATORY)
  - "Wonder Is Renewable" (ORDER OF THE OBSERVATORY)
  - "The Cauldron Is Not A Bath" (ALCHEMY HALL)
  - "Draw Again At Moonrise" (DIVINATION DESK)
  - "Essence Spent Is Essence Learned" (ORDER OF THE CIRCLE)

### Oddity: Spell of the Hour

A fake spell card: school, rarity (sometimes cursed), essence cost, casting time, the effect and the side effect.

- **spells:** Lesser Summon Snack / CONJURATION / 2 / INSTANT / Conjures exactly one (1) cracker. / Crumbs, everywhere. / ARM'S REACH / A HUNGRY THOUGHT; Banish Monday / ABJURATION / 7 / 1 WEEK / Monday is removed from this week. / It returns in seven days. / THIS CALENDAR / ONE ALARM CLOCK; Ward of Unread Messages / ABJURATION / 3 / 1 HOUR / Notifications cannot find you. / They wait. They multiply. / YOUR POCKET / A SILENT SWITCH; Minor Procrastination / ENCHANTMENT / 1 / LATER / The task feels optional. / The task does not agree. / SELF / ONE OPEN TAB; Find Lost Sock / DIVINATION / 4 / 1 MINUTE / Reveals the sock's location. / It is with the other lost sock. / ONE HOUSE / THE REMAINING SOCK; Greater Nap / ENCHANTMENT / 5 / 20 MINUTES / Restores all essence. / Waking up unsure of the year. / ONE COUCH / A WARM BLANKET; Summon Parking Space / CONJURATION / 6 / INSTANT / A space opens directly ahead. / It is a compact space. / ONE BLOCK / PATIENCE (CONSUMED); Charm Houseplant / ENCHANTMENT / 2 / 1 DAY / The plant forgives you. / It still wants water. / TOUCH / AN APOLOGY; Silence of the Group Chat / ILLUSION / 4 / UNTIL MORNING / Everyone goes quiet. / They were planning a party. / ONE CHAT / A MUTED BELL; Illusory Productivity / ILLUSION / 3 / 1 MEETING / You appear deeply busy. / You are asked to lead the next one. / ONE ROOM / A FURROWED BROW
- **rarity:** COMMON; UNCOMMON; RARE; MYTHIC; CURSED
- **syl:** vel; kar; ith; um; bra; zor; eth; mir; qua; lun; dros; shai; ven; oth; ra

### Idle game: The Apprentice

An apprentice studies through the night: spells join a constellation, familiars arrive, cauldrons misbehave, ranks rise to Starbound. Charging fills the moonwell with mana.

**New character every run:** The Apprentice: each run's apprentice has a different robe colour and hat (pointed, hood, circlet) and a familiar (owl, cat, toad, moth).

### Hard rules for this theme

- Symbols are original. Avoid real religious iconography that carries specific meaning.
- Incantations are in an invented tongue, never a real language.

Contact sheet: `contact_sheets/05_Planar_Grimoire.jpg` · full-res assets: `05_Planar_Grimoire/`

---

## 06. Deep Range

*A long-range tracking display. Black glass, red contact frames, a yellow trajectory and a blue planet below.*  
In-world company: **Deep Range** · unit **RELAY 07**

### World and voice

Deep Range is a long-range tracking station at the edge of known space: contacts drift in and out, relays whisper, salvage drones jump between derelicts. Terse, lonely, deep-space radio ('Contact Lost', 'Signal Acquired').

### Look

Black glass, signal-yellow ink and trajectories, red contact frames and hazard stripes, a deep blue planet curving along the bottom, Archivo and Share Tech Mono.

- **Fonts:** Archivo (display) and Share Tech Mono (labels and data). Letter case: all caps.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #050608 | #FFE14A | #FF3B30 | #2340FF | #0B0D10 | #3DFF8A |
| Signal Green | #050608 | #E8FFF0 | #3DFF8A | #0F5C4A | #0B0D10 | #FFE14A |
| Cold Blue | #050608 | #BFE9FF | #3A7BFF | #123A8C | #0B0D10 | #39D6FF |
| Amber Range | #050608 | #FFC36A | #FF7A1A | #3A1E7A | #0B0D10 | #FFE14A |
| Redline | #050608 | #FFFFFF | #FF2D55 | #5A0F1E | #0B0D10 | #FF9F0A |

Colorways: Contact Red, Signal Green, Cold Blue, Amber Range, Redline.

### Lock screens

A tracking display: a tilted grid of contact frames with a yellow trajectory arc, 'TRACKING 12 CONTACTS', the headline in heavy caps ('CONTACT LOST'), the year, red edge markers, and the blue planet's limb across the bottom.

**The four headlines:** "Contact Lost" · "Signal Acquired" · "Return Window" · "Deep Range"

**Screen copy:** topL: "TRACKING 12 CONTACTS"; coords: "RANGE 0.4 AU // RELAY 07"; yearLabel: "YEAR"; year: "auto"; codeA: "R 07-KX"; codeB: "DR 0X283"; fine: "A E0- 12  9X  00"; foot: "DEEP RANGE // RELAY 07"; countdown: "T-00:00:47"

### Home screen

Six genuinely different frames (the only theme with more than one besides Long Odds): a proximity-alert close-up of a contact (a satellite with solar panels inside a red-bracketed box), hazard stripes, telemetry readouts, a T-minus countdown and the planet below. The frames rotate through the day.

### App icons

Camera = **SCAN**, Photos = **LOG**, Maps = **WPT**, Calendar = **YEAR**, Phone = **PING**, Messages = **COMM**, Safari = **ORBIT**, Music = **FREQ**, YouTube = **FEED**, Instagram = **LOCK**, Discord = **RELAY**

### Widgets

- **Titles:** vid "W-06 // VIDEO DOWNLINK"; obs "W-07 // IMAGE INTERCEPTS"; dc "W-09 // RELAY NET"; solar "W-03 // SOLAR WINDOW"; solarBig "W-03 // SOLAR WINDOW + ATMOS"; audio "W-04 // CARRIER WAVE"; feeds "W-06 // DOWNLINKS"; status "W-01 // CONTACT STATUS"; shift "W-02 // WINDOW"; tx "W-05 // DEEP RANGE COMMS"
- **Solar labels:** label "SOLAR TELEMETRY"; offline "Telemetry Lost"; day "LIGHT WINDOW"; night "DARK WINDOW"; setIn "LOSS OF LIGHT IN"; riseIn "ACQUISITION IN"
- **Audio:** source "CARRIER // YT MUSIC", metric SIGNAL, footer "DO NOT CHANGE FREQUENCY"; rotating titles: Carrier Wave Locked; Music On Relay 07; Downlink Stable; Listening On All Bands; Frequency Acquired; Hold This Channel
- **Feeds:** YouTube side "Video Downlink" (meters SIGNAL, CURIOSITY, FOCUS; tag DOWNLINK: CONTINUOUS), Instagram side "Contact Chatter" (meters PINGS, ECHO, STATIC; tag PINGS: UNCOUNTED); footer "ATTENTION IS FINITE. CONTENT IS NOT."
- **Instagram gallery:** Image intercepts: partially decoded mosaics with decode percentages (IMG 408, 99%…).
- **Discord:** Discord is 'RELAY NET': contacts as nodes on a relay network, channels #deep-field, #salvage-rights and RELAY 07 voice.
- **Transmission classifications:** CONTACT, PING, ECHO, LOSS OF SIGNAL
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Contact Lost Is Not Contact Gone" (RANGE CONTROL)
  - "We Hear You. Do Not Repeat." (SIGNAL ANALYSIS)
  - "Your Last Ping Was Logged" (TELEMETRY)
  - "Nothing Out Here Is Abandoned" (SALVAGE RIGHTS)
  - "Return Window Closes At Dawn" (FLIGHT DYNAMICS)
  - "The Dark Is Mostly Paperwork" (RANGE CONTROL)
  - "Echo Detected. Ignore Echo." (SIGNAL ANALYSIS)
  - "Drift Is A Direction Too" (NAVIGATION)
  - "All Lost Contacts Are Billed" (ACCOUNTS RECEIVABLE)
  - "Stay On Frequency" (COMMS)
  - "The Relay Remembers Your Voice" (RELAY OPS)
  - "If It Answers, Do Not Answer Back" (PROTOCOL OFFICE)
  - "Silence Is Also A Signal" (SIGNAL INTELLIGENCE)
  - "Every Echo Is A Promise" (RELAY OPERATIONS)
  - "Keep One Eye On The Horizon" (RANGE CONTROL)
  - "Lost Is Just Not Found Yet" (SEARCH & SALVAGE)
  - "The Void Returns Your Calls Eventually" (RELAY OPERATIONS)
  - "Fuel Is A Feeling" (PROPULSION)
  - "Plot Twice. Burn Once." (NAVIGATION)
  - "Stars Are Just Very Old News" (DEEP FIELD SURVEY)
  - "Never Trust A Quiet Buoy" (RANGE CONTROL)
  - "Gravity Wells Are Not For Wishing" (NAVIGATION)
  - "Every Derelict Was Someone's Ride Home" (SEARCH & SALVAGE)
  - "Ping Early, Ping Often" (SIGNAL INTELLIGENCE)
  - "Space Is Big. Pack Snacks." (CREW SERVICES)
  - "Tracking Is Caring" (RANGE CONTROL)
  - "The Return Window Waits For No One" (FLIGHT DYNAMICS)
  - "Your Signal Was Received In 1983" (DEEP FIELD SURVEY)
  - "Debris Has Right Of Way" (ORBITAL LOGISTICS)
  - "Hold Steady. Hold Breath. Hold Course." (FLIGHT DYNAMICS)
  - "We Lose Contacts, Not Hope" (RANGE CONTROL)
  - "The Dark Has Excellent Acoustics" (SIGNAL INTELLIGENCE)
  - "Count Your Orbits" (FLIGHT DYNAMICS)
  - "Salvage Is Recycling With Courage" (SEARCH & SALVAGE)

### Oddity: Signal Decoder

A garbled transmission resolving into a decoded line, with confidence, echo delay, source and salvage value. Bad decodes flag loss of signal.

- **msgs:** IS ANYONE GETTING THESE / BEHIND YOU (UNLIKELY); PLEASE STOP SENDING POLLS / RELAY 04; WE FOUND YOUR KEYS / BUOY 11; DO NOT ANSWER THIS / UNKNOWN; HELLO FROM THE PAST, PROBABLY / ECHO, 1983; THE COFFEE UP HERE IS WORSE / STATION K-17; COUNT THE STARS AGAIN / DEEP FIELD; RETURN THE LIBRARY BOOK / LOCAL AUTHORITIES; WE ARE ALSO LISTENING / EVERYWHERE; SIGNAL TEST. SIGNAL TEST. / YOU, LAST TUESDAY
- **salvage:** PRICELESS (DISPUTED); 4 CREDITS; SENTIMENTAL; CLASSIFIED; NONE · KEEP ANYWAY

### Idle game: Salvage Run

An autonomous drone jumps across the sector each refresh: derelicts, asteroids, pirates, signals, cargo. Charging docks it to refuel. Lose the hull or fuel and a new drone launches.

**New character every run:** Salvage Run: each run's drone has one of five hull shapes (dart, hauler, ring, twin-boom, saucer), a hull colour and a name (KESTREL, MULE, HALO, OXBOW, MOTH, WREN).

### Hard rules for this theme

- New home frames must differ as much as the existing six do.
- No specific film or game interfaces.

Contact sheet: `contact_sheets/06_Deep_Range.jpg` · full-res assets: `06_Deep_Range/`

---

## 07. White Rabbit

*A legion of gentleman thieves. Pearl and lilac, magenta lasers, a leaping rabbit and a calling card left at every scene.*  
In-world company: **White Rabbit** · unit **CELL 07**

### World and voice

White Rabbit is a chic, extremely futuristic legion of gentleman thieves. They case marks, lift heirlooms, leave a calling card at every scene and are never seen ('We were never here.').

### Look

Pearl and lilac grounds, ink black, magenta security lasers, foil stripes, barcodes, vault dials with numbered ticks, an angular rabbit-mask guild mark with magenta eye slits, Bodoni serif.

- **Fonts:** Bodoni Moda (display) and DM Mono (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #E7E0FA | #2A2340 | #E8338C | #A99BF0 | #F7F4FF | #FF5AA8 |
| Midnight Rabbit | #1C1730 | #F2ECFF | #FF4FA3 | #7D6BE0 | #26203E | #FF8CC6 |
| Rose Pearl | #F8E3EC | #3A1E2E | #D6246E | #F2A6C8 | #FFF5F9 | #FF5AA8 |
| Cheshire | #E5DCF7 | #2B1B3F | #8A3FD9 | #E86BC0 | #F6F1FF | #FF5AA8 |
| Clockwork Mint | #DDF3EC | #1F2E33 | #E8338C | #9AD9C6 | #F2FBF8 | #FF5AA8 |

Colorways: Lilac Haze, Midnight Rabbit, Rose Pearl, Cheshire, Clockwork Mint.

### Lock screens

A black calling card with the mask, a foil stripe, 'WITH COMPLIMENTS', 'CELL 07' and a barcode, on a vault dial with numbered ticks; magenta security lasers and tags: VAULT 03 OPEN, LASERS BYPASSED, WINDOW 00:47 LEFT, WITNESSES NONE.

**The four headlines:** "What's Yours Is Mine" · "Catch Me If You Can" · "Before I Catch You" · "Seven Heirlooms, One Night"

**Screen copy:** tagL: "LEGION OF THIEVES · CELL 07"; tagR: "WHITE RABBIT"; sub: "Nothing was taken. Everything is gone."; foot: "WHITE RABBIT // CALLING CARD 07"

### Home screen

A contract board: the mask with a crossed blade in a tick ring, callouts SIGIL // UNREGISTERED, EDGE // MONOFILAMENT and TRACE // NONE, a giant outlined '07', lasers, a black identity strip with a barcode, and a sleek contract card 'The Jeweled Egg' (venue, method, window, NO TRACE stamp). Caption: 'We were never here.'

### App icons

Camera = **CASE**, Photos = **LOOT**, Maps = **ROUTE**, Calendar = **JOB**, Phone = **BURNER**, Messages = **CARD**, Safari = **VAULT**, Music = **MIX**, YouTube = **REEL**, Instagram = **MARKS**, Discord = **WARREN**

### Widgets

- **Titles:** vid "W-06 // SURVEILLANCE REEL"; obs "W-07 // THE MARKS"; dc "W-09 // THE WARREN"; solar "W-03 // COVER WATCH"; solarBig "W-03 // COVER WATCH + WEATHER"; audio "W-04 // GETAWAY MIX"; feeds "W-06 // TWO MARKS"; status "W-01 // THE JOB"; shift "W-02 // GETAWAY"; tx "W-05 // CALLING CARD"
- **Solar labels:** label "COVER WATCH"; offline "Lost In The Clouds"; day "EXPOSED · DAYLIGHT LEFT"; night "UNDER COVER OF DARK"; setIn "COVER OF DARK IN"; riseIn "EXPOSED AGAIN IN"
- **Audio:** source "GETAWAY MIX // YT MUSIC", metric NERVE, footer "NOBODY HEARD A THING"; rotating titles: Music For A Clean Getaway; The Vault Opens At Midnight; A Waltz Past The Lasers; Soft Steps, Loud Bass; Play It Cool; Nobody Heard A Thing
- **Feeds:** YouTube side "Casing Footage" (meters NERVE, PATIENCE, FOCUS; tag ONE MORE LOOP), Instagram side "The Marks" (meters ENVY, SPARKLE, WORRY; tag ALL THAT GLITTERS); footer "WHAT'S YOURS IS MINE"
- **Instagram gallery:** The Marks: fanned case cards, each showing a different heirloom: cut gem, jeweled egg, ring, tiara, pearl necklace, crown, emerald, scepter.
- **Discord:** Discord is 'THE WARREN': cells as linked nodes (CELL 02, 04, 07, 09, 11), channels #next-job, #fences-and-buyers, #rival-crews and the safehouse.
- **Transmission classifications:** CALLING CARD, HEIST, FOR THE LEGION, BURN AFTER READING
- **Transmission slogans** (in-world line, then the department that issued it):

  - "What's Yours Is Mine" (THE LEGION)
  - "Catch Me If You Can" (FIELD OPERATIONS)
  - "We Were Never Here" (CLEANUP CREW)
  - "Every Lock Is A Question" (ENTRY SPECIALISTS)
  - "Leave The Card. Take The Rest." (CALLING CARDS)
  - "Seven Heirlooms. One Night." (THE ARCHIVE)
  - "Security Is A Suggestion" (ENTRY SPECIALISTS)
  - "Anyone Can Wear The Ears" (RECRUITMENT)
  - "The Gala Never Saw Us Leave" (THE ARCHIVE)
  - "Ears Up. Hands Quick." (FIELD OPERATIONS)
  - "Copycats Welcome. Rivals Warned." (THE LEGION)
  - "Gone Before The Alarm" (GETAWAY)
  - "Leave Nothing But A Card" (CALLING CARDS)
  - "Doors Are Polite Suggestions" (ENTRY SPECIALISTS)
  - "Steal Hearts, Then Jewels" (THE LEGION)
  - "The Alarm Is Fashionably Late" (GETAWAY)
  - "Masks Off Only For Tea" (SOCIAL COMMITTEE)
  - "Every Vault Has A Mood" (ENTRY SPECIALISTS)
  - "Copycats Pay Royalties" (THE LEGION)
  - "Hop Quietly, Land Softly" (FIELD OPERATIONS)
  - "Glitter Is Evidence. Bring Gloves." (CLEANUP CREW)
  - "We Return Lost Things. Eventually." (THE ARCHIVE)
  - "Run Like The Lights Are On" (GETAWAY)
  - "The Seventh Lot Is Always Hardest" (THE ARCHIVE)
  - "Elegance Is Faster Than Force" (FIELD OPERATIONS)
  - "One Card Per Crime, Please" (CALLING CARDS)
  - "Ears Down In The Gallery" (FIELD OPERATIONS)
  - "Rivals Are Just Slower Rabbits" (THE LEGION)
  - "If It Glitters, It's Been Cased" (SURVEILLANCE)
  - "Never Rob A Tea Party" (SOCIAL COMMITTEE)
  - "Lasers Are Just Strict Ribbons" (ENTRY SPECIALISTS)
  - "Be The Rumor" (RECRUITMENT)

### Oddity: Heist Board

Tonight's score: the target heirloom, where it's kept, how many lasers stand in the way, the crew, the odds and whether the calling card is ready.

- **targets:** The Gala Necklace; A Jeweled Egg; The Seventh Heirloom; The Ambassador's Ring; A Crown Nobody Wears; A Rival's Getaway Car
- **venues:** THE GALA · EAST WING; A PRIVATE VAULT; THE AUCTION HOUSE; A MOVING TRAIN; THE OBSERVATORY; A RIVAL'S SAFEHOUSE
- **crews:** SOLO; TWO RABBITS; A WHOLE WARREN; ONE COPYCAT (UNINVITED)
- **cards:** READY; PRESSED; PERFUMED; LAMINATED; SIGNED

### Idle game: The Long Con

The legion cases and lifts all seven heirlooms, leaving a calling card each time, while the heat climbs. Charging lays low at the safehouse. Too much heat and the legion scatters.

**New character every run:** The Long Con: each run's crew lead has a different alias (VELVET, CIPHER, SILK, MONOCLE…), mask ears, eye colour and stripe.

### Hard rules for this theme

- No Alice in Wonderland imagery at all: no rabbit hole, pocket watch or playing cards.
- Sleek heist vibes only; no assets or logos from any game.

Contact sheet: `contact_sheets/07_White_Rabbit.jpg` · full-res assets: `07_White_Rabbit/`

---

## 08. Neon District

*A hyper-capitalist neon dystopia. Megatowers, a holo-koi, corporate billboards, signage in an invented script and umbrellas in the rain.*  
In-world company: **Sable Dynamics** · unit **D-09**

### World and voice

Neon District is a hyper-capitalist neon dystopia: megatowers, a holographic koi swimming between them, corporate billboards, compliance patrols, rain and glowing umbrellas. The engine is satire: everything is a subscription and the terms always apply.

### Look

Near-black violet, hot pink and electric cyan neon, signal yellow, rain streaks, scanlines, notched cyber frames, Orbitron and Share Tech Mono, and signage in an invented glyph script.

- **Fonts:** Orbitron (display) and Share Tech Mono (labels and data). Letter case: all caps.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #0A0614 | #F2F0FF | #FF2E88 | #00F0FF | #140C24 | #FCEE0A |
| Acid Green | #0A0614 | #F2F0FF | #39FF14 | #FF00E5 | #140C24 | #FCEE0A |
| Blade Orange | #120A06 | #F2F0FF | #FF7A1A | #2BD9FF | #1E120A | #FCEE0A |
| Ice Chrome | #060A14 | #E6F4FF | #7AE7FF | #B07CFF | #0E1426 | #FCEE0A |
| Blood Neon | #0E0306 | #F2F0FF | #FF1744 | #FFD000 | #1A060B | #FCEE0A |

Colorways: Hot Pink, Acid Green, Blade Orange, Ice Chrome, Blood Neon.

### Lock screens

Megatowers to the top with aircraft lights and a giant holo-koi; the headline on an OMNIGEN billboard ('YOU ARE THE PRODUCT'); tower signage (PREMIUM AIR 14.99/HR, DEBT RELIEF* *NOT GUARANTEED, SLEEP PODS, CHROME) and an LED ticker (▲ OMNIGEN +4.2% ▼ RENT +12% ▼ AIR TAX +3%); a 'Compliance Unit 7' patrol spinner with red and blue lights sweeps a searchlight over a crowd of glowing umbrellas. Sub: 'Terms apply. Terms always apply.'

**The four headlines:** "Buy Now, Pay Forever" · "Breathe Premium Air" · "Your Debt Is Our Future" · "Sleep Is A Subscription"

**Screen copy:** tagL: "SABLE DYNAMICS // DISTRICT 09"; tagR: "NET: ONLINE"; sub: "Terms apply. Terms always apply."; foot: "NEON DISTRICT // D-09 // 24-7"

### Home screen

Dense signage: HOTEL, BAR, a 24H ring, CYBERWARE CLINIC arrow, NOODLES (OPEN ALL NIGHT), a NIGHT MARKET banner in invented glyphs, PAWN, SYNTH, CHROME, LOANS, KARAOKE, ROOMS, DATA and a clinic cross; an optic-graft holo-billboard ('SEE MORE.'), a flying car with its headlight beam, awnings, puddle reflections and rain. Label: 'DISTRICT 09 · NIGHT MARKET · CURFEW 03:00'.

### App icons

Camera = **OPTIC**, Photos = **MEM**, Maps = **GRID**, Calendar = **GIGS**, Phone = **LINK**, Messages = **MSG**, Safari = **NET**, Music = **RADIO**, YouTube = **STREAM**, Instagram = **CHROME**, Discord = **NETBAR**

### Widgets

- **Titles:** vid "W-06 // HOLO-STREAM"; obs "W-07 // CHROME GALLERY"; dc "W-09 // THE NET BAR"; solar "W-03 // SMOG INDEX"; solarBig "W-03 // SMOG INDEX + ATMOS"; audio "W-04 // PIRATE RADIO"; feeds "W-06 // FEEDJACK"; status "W-01 // RUNNER STATUS"; shift "W-02 // GIG TIMER"; tx "W-05 // HOLO-AD"
- **Solar labels:** label "SMOG WATCH"; offline "Signal Jammed"; day "NEON OFF IN · DAYLIGHT"; night "NIGHT SHIFT"; setIn "NIGHT SHIFT IN"; riseIn "NEON OFF IN"
- **Audio:** source "PIRATE RADIO // YT MUSIC", metric HYPE, footer "DON'T TRUST THE DJ"; rotating titles: Pirate Signal, Unlicensed; Synths Over The Rain; Bass For The Night Shift; Broadcast From A Rooftop; Static Is Also Music; Chrome Hearts, Loud
- **Feeds:** YouTube side "Holo-Streams" (meters HYPE, GLITCH, FOCUS; tag AUTOPLAY: FOREVER), Instagram side "Chrome Gallery" (meters ENVY, CHROME, DOUBT; tag FILTERED FOREVER); footer "ATTENTION IS CURRENCY"
- **Instagram gallery:** Chrome Gallery mixes four kinds of post in every refresh: glitched portraits split into cyan and pink with visors; cyberware with price tags (optic, spine, jaw plate, chrome hand, pump heart); generated neon pixel masks with handles (@v0idkid, @rainwire, @gl1tch…); and the district's own feed (holo koi, vending machine, drone, chrome cat under an OPEN sign, rain over the skyline).
- **Discord:** Discord is 'THE NET BAR': booths with handles (@v0idkid, @rainwire, @n30n_m0m, @gl1tch, @sable_x, @kitsune), channels #gigs-board, #chrome-trades, #rooftop-raves and BOOTH 07.
- **Transmission classifications:** SPONSORED, PRIORITY, GLITCHED, CORP MEMO
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Upgrade Or Get Upgraded" (CHROME SALES)
  - "Your Data Looks Delicious" (AD NETWORK)
  - "Sleep Is A Subscription" (WELLNESS DIV)
  - "Rain Check Denied" (LANDLORD BOT)
  - "Trust The Corp. The Corp Trusts No One." (PUBLIC RELATIONS)
  - "Glitch Responsibly" (NET SAFETY)
  - "Neon Is Cheaper Than Daylight" (CITY POWER)
  - "All Streets Lead To Overtime" (HR CORE)
  - "Feel Something. Buy Something." (AD NETWORK)
  - "Your Face Is Our Password" (SECURITY)
  - "Smile, You Are Being Scanned" (SECURITY)
  - "Night Shift Never Ends" (HR CORE)
  - "Your Feelings Are Ad-Supported" (AD NETWORK)
  - "Chrome Today, Debt Tomorrow" (CHROME SALES)
  - "The Rain Is Rented" (CITY POWER)
  - "Upgrade Your Patience To Premium" (CUSTOMER SUCCESS)
  - "Privacy Mode Is A Myth" (SECURITY)
  - "Every Alley Has A Firewall" (NET SAFETY)
  - "Night Markets Accept All Souls" (NIGHT MARKET)
  - "Noodles Are A Human Right" (FOOD STALL 9)
  - "Reboot Your Dreams Nightly" (WELLNESS DIV)
  - "Neon Lies Beautifully" (AD NETWORK)
  - "Overtime Is The New Downtime" (HR CORE)
  - "Your Credit Score Is Watching" (FINANCE BOT)
  - "Static Is The City Breathing" (PIRATE RADIO)
  - "Dreams Sold Separately" (CHROME SALES)
  - "Glitches Are Features With Attitude" (NET SAFETY)
  - "Encrypt Your Feelings" (SECURITY)
  - "The Elevator Knows Your Name" (BUILDING AI)
  - "Sleep Faster" (WELLNESS DIV)
  - "Look Up. The Billboards Love You." (AD NETWORK)
  - "Your Shadow Has Been Monetized" (AD NETWORK)
  - "Fresh Chrome, Still Warm" (CHROME SALES)

### Oddity: Black Market

The deal of the hour: a questionable item, its seller and rating, the price in credits, its condition, a warranty of none and a risk meter.

- **items:** Used Optic Mod (Slightly Haunted); Bootleg Memory Chip, 2 TB; Chrome Arm, Left, Mostly; Neon Tattoo That Plays Ads; Ex-Corp Badge, Still Works; Sleep Patch (Do Not Combine)
- **sellers:** @gl1tch; @kitsune; @rainwire; @n30n_m0m; @v0idkid
- **cond:** LIKE NEW; REFURBISHED; SALVAGED; ASK NO QUESTIONS; STILL WARM

### Idle game: Tower Run

A netrunner climbs a 100-floor corp tower by breaching ICE, pulling paydata and buying chrome while the trace closes in. Charging recharges RAM. Get traced and a new handle takes over.

**New character every run:** Tower Run: each run's runner portrait changes hairstyle, hair colour, visor colour and chrome.

### Hard rules for this theme

- No real Japanese, Chinese or Korean characters anywhere. All signage uses the invented glyph script. (Images 2.5 renders real scripts well, so say this explicitly in every prompt.)
- No stereotypes (nothing like kabuki, geisha and so on).
- Original city only; not Blade Runner or Cyberpunk 2077.

Contact sheet: `contact_sheets/08_Neon_District.jpg` · full-res assets: `08_Neon_District/`

---

## 09. Vapor Plaza

*Vaporwave mallsoft. A striped sunset, a neon grid, palm trees, a marble column and a little window from 1995.*  
In-world company: **Vapor Plaza** · unit **MALL 95**

### World and voice

Vapor Plaza is the eternal mall at sunset, forever 1995: mallsoft drifting from the speakers, stores that closed in 1997 still lit, a fountain full of coins, a little Windows 95 window floating over it all. Ambient and deadpan ('Elevator music, forever.').

### Look

Deep purple and magenta, hot pink and cyan, pale yellow; a striped sunset sun, a neon perspective grid, palms, a marble column, Win95 chrome (grey bevels, navy title bars), VHS and cassette details, Righteous and VT323.

- **Fonts:** Righteous (display) and VT323 (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #2A0F55 | #FFF2FF | #FF71CE | #01CDFE | #3B1873 | #FFFB96 |
| Miami Pastel | #FFD6EC | #3A1B4F | #FF5FA2 | #29D3E8 | #FFF0F8 | #FFFB96 |
| Teal Dream | #06343A | #E9FFFB | #FF8AD8 | #3AF2E0 | #0B4A52 | #FFFB96 |
| Sunset Tape | #3A1030 | #FFF0E0 | #FF9A3C | #FF4FA0 | #4E1840 | #FFFB96 |
| Windows Grey | #B9B9C9 | #141420 | #000080 | #FF71CE | #D9D9E4 | #FFFB96 |

Colorways: Plaza Purple, Miami Pastel, Teal Dream, Sunset Tape, Windows Grey.

### Lock screens

A clean striped sun (horizontal cuts widening toward the bottom) over a deep magenta horizon; low-poly cyan hills, a true perspective grid fading from a glowing horizon, palms, a marble column, a floating wireframe pyramid and leaping dolphins; an 'aesthetic.exe' window, 'PLAY ▶ SP 0:04:44' and A E S T H E T I C.

**The four headlines:** "Eternal Sunset" · "Welcome To The Plaza" · "Nothing Is Real Here" · "Forever Nineteen 95"

**Screen copy:** tagL: "VAPOR PLAZA · LEVEL 2"; tagR: "OPEN"; sub: "Please enjoy the fountain."; foot: "VAPOR PLAZA // MALL 95 // FOREVER"

### Home screen

'NOW ENTERING THE PLAZA': a mall.exe window over the sunset, a fountain.wav window, palms, a column and the grid. Caption 'Elevator music, forever.'

### App icons

Camera = **CAM.EXE**, Photos = **PICS**, Maps = **MAP**, Calendar = **DATE**, Phone = **CALL**, Messages = **CHAT**, Safari = **WEB**, Music = **TAPE**, YouTube = **VHS**, Instagram = **POLAROID**, Discord = **CHATRM**

### Widgets

- **Titles:** vid "W-06 // VHS"; obs "W-07 // POSTCARDS"; dc "W-09 // CHAT ROOM"; solar "W-03 // ETERNAL SUNSET"; solarBig "W-03 // ETERNAL SUNSET + WEATHER"; audio "W-04 // MALLSOFT FM"; feeds "W-06 // TWO CHANNELS"; status "W-01 // PLAZA STATUS"; shift "W-02 // LOADING"; tx "W-05 // MESSAGE FROM 1995"
- **Solar labels:** label "SUNSET WATCH"; offline "Signal Lost In 1995"; day "SUNSET FOREVER"; night "AFTER HOURS"; setIn "SUNSET IN"; riseIn "OPENING IN"
- **Audio:** source "MALLSOFT FM // YT MUSIC", metric CHILL, footer "SMOOTH AND ETERNAL"; rotating titles: Smooth Jazz For Escalators; Fountain Ambience, Side B; Elevator Music Forever; Food Court Serenade; Sunset On Cassette; Hold Music, Remastered
- **Feeds:** YouTube side "VHS Tapes" (meters NOSTALGIA, STATIC, FOCUS; tag BE KIND, REWIND), Instagram side "Postcards" (meters LONGING, GLOW, PALMS; tag WISH YOU WERE HERE); footer "REWIND TO 1995"
- **Instagram gallery:** Postcards from the plaza: sunset over the sea, palms, a leaping dolphin, a floating pyramid, a marble column, the mall arches with the fountain, a sailboat, a flamingo with a palm, with greetings like 'WISH YOU WERE HERE' and 'PLAZA 95'.
- **Discord:** Discord is a Win95 'chatroom.exe' (palmtree95, sunsetgrl, dolphin_dan, mallrat, vaporkid).
- **Transmission classifications:** SPECIAL OFFER, ANNOUNCEMENT, LOST AND FOUND, SYSTEM
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Please Enjoy The Fountain" (MALL MANAGEMENT)
  - "All Stores Open Forever" (MALL MANAGEMENT)
  - "Your Call Is Important To Us" (CUSTOMER CARE)
  - "Smooth Jazz Is A Lifestyle" (MALLSOFT FM)
  - "Buy One, Remember Two" (GIFT SHOP)
  - "The Escalator Goes Up Forever" (FACILITIES)
  - "Have A Pleasant Afternoon" (CUSTOMER CARE)
  - "Free Samples Of Nostalgia" (FOOD COURT)
  - "Please Do Not Feed The Dolphins" (AQUARIUM)
  - "This Moment Is On Sale" (GIFT SHOP)
  - "Thank You For Shopping" (MALL MANAGEMENT)
  - "Insert Disk 2" (SYSTEM)
  - "Escalators Are Forever Stairs" (FACILITIES)
  - "Today's Special Is Yesterday" (FOOD COURT)
  - "Please Do Not Wake The Mannequins" (SECURITY)
  - "The Fountain Grants Small Wishes" (MALL MANAGEMENT)
  - "Free Refills On Nostalgia" (FOOD COURT)
  - "Lost Child? Lost Decade?" (LOST AND FOUND)
  - "Your Receipt Is A Poem" (CUSTOMER CARE)
  - "Every Pager Has A Message" (ELECTRONICS)
  - "Rewind Before Returning" (SUNSET VIDEO)
  - "Palm Trees Indoors Are Legal Here" (FACILITIES)
  - "Smooth Is A Feeling" (MALLSOFT FM)
  - "The Arcade Never Closes, Only Pauses" (GAME ZONE)
  - "Insert Coin To Continue Dreaming" (GAME ZONE)
  - "Shop Like It's Sunday Forever" (MALL MANAGEMENT)
  - "Teal Is A State Of Mind" (DESIGN DEPT)
  - "We Validate Parking And Feelings" (CUSTOMER CARE)
  - "Please Hold. The Sunset Is Busy." (CUSTOMER CARE)
  - "Screensaver Mode Engaged" (SYSTEM)
  - "Wish You Were Here (You Are)" (GIFT SHOP)
  - "All Clocks Stopped At 4:44" (FACILITIES)

### Oddity: Mall Directory

A store of the hour on a little mall map: its status (often closed since 1997), floor, coins in the fountain and the song on the speakers.

- **stores:** Sunset Video; Pretzel Paradise; The Fountain Court; Laser Tag Galaxy; Cassette Corner; Palm Tree Imports
- **status:** OPEN FOREVER; CLOSED SINCE 1997; ALWAYS ON SALE; STAFF ON BREAK; UNDER RENOVATION
- **tracks:** Escalator Blues; Food Court Waltz; Lost In Aisle 9; Fountain Dreams

### Idle game: Mall.exe

Keep the eternal mall open: stores open (and close since 1997), shoppers drift, the fountain fills with coins. Charging switches the lights on. Let the vibe die and a new mall opens forever.

**New character every run:** Mall.exe: each run has a different mascot over the fountain (dolphin, flamingo, palm) and a different store colour palette.

### Hard rules for this theme

- No classical bust (removed at Jordan's request).
- No real brands, logos or real software UI beyond a generic Win95 feel.

Contact sheet: `contact_sheets/09_Vapor_Plaza.jpg` · full-res assets: `09_Vapor_Plaza/`

---

## 10. Wildwood

*A naturalist's field journal. Sage paper, fern fronds, mushrooms, birdsong and pressed leaves.*  
In-world company: **Wildwood** · unit **TRAIL 03**

### World and voice

Wildwood is a naturalist's field journal: sage paper, pressed leaves, birdsong and gentle observations ('frog, very content'). Calm, curious and kind, with real species and real facts.

### Look

Sage and cream paper, forest-green ink, rust and gold accents, flat illustration with ink outlines, taped specimen plates, Latin names, scale bars, Fraunces and DM Mono.

- **Fonts:** Fraunces (display) and DM Mono (labels and data). Letter case: mixed case.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #E7EEDC | #1F3A2B | #C2662D | #6E9E4C | #F6F8F0 | #E3B341 |
| Autumn Leaf | #F2E6D3 | #3A2412 | #B8431E | #D99A2B | #FBF6EC | #E3B341 |
| Deep Forest | #16261C | #E5F0DF | #E08A4B | #7BB35A | #1F3326 | #E3B341 |
| Wildflower | #F4ECF4 | #2E2A3A | #B34E8C | #7FA65A | #FCF8FC | #E3B341 |
| Winter Pine | #E9EFF2 | #1D2E36 | #B23A3A | #4E7D6A | #F7FAFB | #E3B341 |

Colorways: Sage Journal, Autumn Leaf, Deep Forest, Wildflower, Winter Pine.

### Lock screens

A specimen plate taped into a field journal: a pressed fern, three mushrooms, a pinned beetle (Carabus nemoralis), a feather and a magnifier inset of the gills (×10); labels (Polystichum munitum; Amanita muscaria 'DO NOT EAT'), 'COLLECTED 11 · X · 26', 'No. 0447' and a ruler.

**The four headlines:** "Slow Down, Look Closer" · "Grow Where You Are" · "Every Path Is A Story" · "Take Only Photographs"

**Screen copy:** tagL: "WILDWOOD · FIELD NOTES"; tagR: "PLATE 03"; sub: "Collected on the morning trail."; foot: "WILDWOOD // TRAIL 03"

### Home screen

'THE FOREST FLOOR': a grounded meadow built in layers (far hill with a treeline, middle hill, front meadow, a stream). A young tree holds the wren's branch (she's singing, notes rising); a fox peeks over a mossy log with its paws on top; mushrooms with a ladybug grow at the log's end; a hedgehog on patrol; a snail on a mossy stone with a shining trail; a frog on a lily pad in ripples; reeds and cattails on the bank; a hare mid-hop with its shadow and paw prints; butterflies and a bee on dotted flight paths; wildflowers on stems. Field notes: 'wren, singing her heart out', 'fox! (shy)', 'bee route (busy)', 'hedgehog, on patrol', 'frog, very content'. Everything stands on the ground with shadows. Caption 'Listen for the wren.'

### App icons

Camera = **LOOK**, Photos = **PRESS**, Maps = **TRAIL**, Calendar = **SEASON**, Phone = **CALL**, Messages = **NOTE**, Safari = **GROVE**, Music = **SONG**, YouTube = **REEL**, Instagram = **BLOOM**, Discord = **FIRE**

### Widgets

- **Titles:** vid "W-06 // NATURE REEL"; obs "W-07 // SPECIMENS"; dc "W-09 // THE CAMPFIRE"; solar "W-03 // DAYLIGHT"; solarBig "W-03 // DAYLIGHT + WEATHER"; audio "W-04 // BIRDSONG"; feeds "W-06 // TWO TRAILS"; status "W-01 // FIELD JOURNAL"; shift "W-02 // TRAIL TIMER"; tx "W-05 // FIELD NOTE"
- **Solar labels:** label "DAYLIGHT"; offline "Under The Canopy"; day "DAYLIGHT LEFT"; night "NIGHTFALL"; setIn "SUNSET IN"; riseIn "SUNRISE IN"
- **Audio:** source "BIRDSONG // YT MUSIC", metric CALM, footer "LISTEN FOR THE WREN"; rotating titles: A Morning By The Creek; Wind In The Pines; Rain On Broad Leaves; The Dawn Chorus; Crickets At Dusk; Songs For The Trail
- **Feeds:** YouTube side "Nature Reel" (meters WONDER, CALM, FOCUS; tag ONE MORE VALLEY), Instagram side "Specimens" (meters BLOOM, MOSS, CURIOSITY; tag PRESSED AND LABELED); footer "LEAVE NO TRACE"
- **Instagram gallery:** Pressed specimens, never duplicated: wild rose, violet, clover, oak leaf, maple, beech, fern, jay feather, acorn, dandelion, fly agaric and ginkgo, each with its Latin name.
- **Discord:** Discord is 'THE CAMPFIRE': a dusk scene with campers on log benches round a stone fire ring (marshmallows out), a tent and pines; channels #trail-reports, #bird-sightings, #recipes-for-camp and 'the fire circle'.
- **Transmission classifications:** OBSERVATION, FIELD NOTE, SEASONAL, REMINDER
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Slow Is A Speed" (TRAIL CREW)
  - "Moss Grows On Patience" (FIELD NOTES)
  - "Leave It Better" (TRAIL CREW)
  - "Every Leaf Is A Letter" (HERBARIUM)
  - "Listen Before You Look" (BIRD COUNT)
  - "Rain Is Just Slow Gardening" (GREENHOUSE)
  - "Small Things Hold Up The World" (SOIL SURVEY)
  - "The Creek Knows The Way" (TRAIL CREW)
  - "Stay On The Path, Mostly" (RANGER STATION)
  - "Mushrooms Are The Internet" (SOIL SURVEY)
  - "Sit. Wait. The Deer Will Come." (FIELD NOTES)
  - "Pick Up Three Things" (TRAIL CREW)
  - "Lichen Is A Friendship" (SOIL SURVEY)
  - "Name Three Birds Before Breakfast" (BIRD COUNT)
  - "The Oak Was Once A Stubborn Acorn" (HERBARIUM)
  - "Puddles Are For Boots" (TRAIL CREW)
  - "Bees Are Busy. Let Them Be." (POLLINATOR WATCH)
  - "Every Stump Was Once A Story" (FIELD NOTES)
  - "Walk Like The Ground Is Listening" (RANGER STATION)
  - "Ferns Are Older Than Flowers" (HERBARIUM)
  - "Rest Is How Seeds Wait" (GREENHOUSE)
  - "Owls Keep The Night Shift" (BIRD COUNT)
  - "Fog Is The Forest Thinking" (FIELD NOTES)
  - "Pocket A Pinecone, Not A Plant" (RANGER STATION)
  - "Mud Is Just Excited Soil" (SOIL SURVEY)
  - "Follow The Water Downhill" (TRAIL CREW)
  - "The Wren Sings Bigger Than It Is" (BIRD COUNT)
  - "Seasons Never Run Late" (ALMANAC)
  - "Hug The Tree. Ask First." (RANGER STATION)
  - "Sit Long Enough And The Forest Visits" (FIELD NOTES)
  - "Keep The Trail Wild And The Trash Out" (TRAIL CREW)
  - "Clouds Are Rain Taking Its Time" (ALMANAC)

### Oddity: Field Guide

A species of the hour with its Latin name, where to look for it, a real fact and a rarity meter.

- **list:** Red Fox / Vulpes vulpes / Its bushy tail helps it balance and keeps it warm.; Monarch Butterfly / Danaus plexippus / Some migrate thousands of miles to spend winter in Mexico.; Great Horned Owl / Bubo virginianus / Its 'horns' are only tufts of feathers.; Eastern Chipmunk / Tamias striatus / Carries food in stretchy cheek pouches.; Fly Agaric / Amanita muscaria / Beautiful and poisonous. Look, don't touch.; Ruby-throated Hummingbird / Archilochus colubris / Beats its wings about 50 times a second.
- **where:** NEAR YOUR WINDOW; AT THE FOREST EDGE; ON A FALLEN LOG; IN THE TALL GRASS; BY THE CREEK

### Idle game: The Grove

Seeds sprout, leaves unfurl and flowers bloom across the seasons while wrens, foxes and owls stop by. Charging brings rain. If everything wilts, new seeds scatter on the wind.

**New character every run:** The Grove: each run has a different keeper animal (badger, owl, fox, hedgehog) and flower colour; visitors appear as themselves (wren, red fox, two deer, box turtle, great horned owl, hummingbird, rabbit, heron); seasons, rain and night change the scene.

### Hard rules for this theme

- Nothing floats unless it flies: creatures and objects stand on the ground with shadows.
- Species and facts must be real and accurate.

Contact sheet: `contact_sheets/10_Wildwood.jpg` · full-res assets: `10_Wildwood/`

---

## 11. Long Odds

*A prediction market on steroids. Neon YES and NO, 100x leverage, whale alerts, live bets and a countdown on everything.*  
In-world company: **Long Odds Exchange** · unit **MKT-77**

### World and voice

Long Odds is an existential prediction market: a trading terminal that prices questions about time, meaning and the self. Neon-terminal satire: 'Will Today Happen Twice?' 'Bet small. Dream huge.'

### Look

Near-black terminal, YES green and NO red, violet accents, gold, monospace data everywhere: tickers, candlesticks, order books, heatmaps, a LIQUIDATED stamp.

- **Fonts:** Archivo (display) and JetBrains Mono (labels and data). Letter case: all caps.

| role | ground | ink | accent | glow | panel | alert |
|---|---|---|---|---|---|---|
| base | #06070B | #F2F4F8 | #8B5CF6 | #00FF88 | #10121A | #FF2D55 |
| Pump Green | #030A06 | #F2F4F8 | #00FF88 | #00FF88 | #0A1610 | #FF2D55 |
| Rekt Red | #0B0406 | #F2F4F8 | #FF2D55 | #00FF88 | #180A0E | #FF2D55 |
| Whale Gold | #0C0A05 | #FFF4D6 | #FFC94A | #00FF88 | #18140A | #FF2D55 |
| Daylight Desk | #F3F6FB | #0E1A2B | #2F6BFF | #00A87E | #FFFFFF | #E8384F |

Colorways: Degen Night, Pump Green, Rekt Red, Whale Gold, Daylight Desk.

### Lock screens

A single big market card asking the headline question ('Will Today Happen Twice?', 'Does The Void Take Bets?', 'Will You Remember This Tuesday?', 'Is Tomorrow Priced In?') with YES/NO prices, live bets, an LED ticker and two iOS-style news cards that shrink or wrap to show the full headline.

**The four headlines:** "Will Today Happen Twice?" · "Does The Void Take Bets?" · "Will You Remember This Tuesday?" · "Is Tomorrow Priced In?"

**Screen copy:** tagL: "LONG ODDS // DEGEN EXCHANGE"; tagR: "LIVE"; sub: "Not financial advice. Barely advice."; foot: "LONG ODDS // 24/7/365 // NO BRAKES"

### Home screen

A Bloomberg-style terminal with six frames: a function-key strip (MKT, BOOK, NEWS, VOID, PNL, GO), MARKET WATCH // EXISTENTIAL, a YES chart pumping and a NO chart in freefall stamped LIQUIDATED, an order book, a 20-tile heatmap (VOID, TIME, MOON, BLUE, SEA…), a news wire, and the footer 'Bet small. Dream huge.'

### App icons

Camera = **SCOUT**, Photos = **PNL**, Maps = **ROUTE**, Calendar = **EXPIRY**, Phone = **WHALE**, Messages = **ALPHA**, Safari = **MARKETS**, Music = **PUMP**, YouTube = **REPLAY**, Instagram = **HYPE**, Discord = **PIT**

### Widgets

- **Titles:** vid "W-06 // WATCH & BET"; obs "W-07 // HYPE INDEX"; dc "W-09 // THE PIT"; solar "W-03 // DAYLIGHT PERPS"; solarBig "W-03 // DAYLIGHT PERPS + WEATHER"; audio "W-04 // DEGEN RADIO"; feeds "W-06 // TWO PUMPS"; status "W-01 // LIFE, LEVERAGED"; shift "W-02 // RESOLVES"; tx "W-05 // HOT TAKE"
- **Solar labels:** label "DAYLIGHT PERPS"; offline "Market Halted"; day "DAYLIGHT · LONG 50X"; night "AFTER HOURS · SHORT"; setIn "LIQUIDATES IN"; riseIn "MARKET OPENS IN"
- **Audio:** source "PUMP // YT MUSIC", metric HYPE, footer "TURN IT UP. SIZE IT DOWN."; rotating titles: Bangers For Bull Runs; Music To Get Liquidated To; Green Candles, Loud Bass; The 100x Playlist; Whale Songs (Literal); Pump It, Then Hedge It
- **Feeds:** YouTube side "Watch & Bet" (meters HYPE, FOMO, FOCUS; tag ▲ PUMPING +34%), Instagram side "Hype Index" (meters FOMO, HYPE, COPE; tag ▼ DUMPING -12%); footer "EVERYTHING IS A MARKET"
- **Instagram gallery:** Hype Index: every post in your feed priced as a market: rocket, moon, a pumping chart, a whale, a gem, the void, an hourglass, a Tuesday, a door you never opened, a coin flip.
- **Discord:** Discord is 'THE PIT': traders with P&L (@moby_whale, @paperhands, @rekt_again…), channels #is-time-real, #void-market-makers, #remember-tuesday and the trading pit, with live YES/NO.
- **Transmission classifications:** HOT TAKE, WHALE ALERT, LOCK OF THE DAY, ALPHA LEAK
- **Transmission slogans** (in-world line, then the department that issued it):

  - "Ape In, Think Later" (DEGEN DESK)
  - "Fortune Favors The Leveraged" (RISK OFFICE (UNSTAFFED))
  - "Liquidation Is Just A Plot Twist" (CLEARING HOUSE)
  - "Every Coin Flip Is A Market" (MARKET MAKING)
  - "Sleep Is For Flat Positions" (NIGHT DESK)
  - "100x Or Go Home" (LEVERAGE DEPT)
  - "The Whales Are Hungry" (WHALE WATCH)
  - "Your Gut Is A Data Feed" (QUANT DESK)
  - "Buy The Rumor. Sell The Nap." (TRADING FLOOR)
  - "Odds Are Just Vibes With Decimals" (RESEARCH)
  - "Not Financial Advice. Barely Advice." (COMPLIANCE)
  - "Diamond Hands, Paper Plans" (STRATEGY)
  - "Number Go Up" (MARKETING)
  - "There Is Always A Bigger Whale" (WHALE WATCH)
  - "The House Always Watches" (SURVEILLANCE)
  - "Resolve Fast, Regret Faster" (CLEARING HOUSE)
  - "LFG (Statistically)" (MORALE)
  - "Every Morning Is A Market Open" (NIGHT DESK)
  - "Copium Is Not A Hedge" (RISK OFFICE (UNSTAFFED))
  - "Bet Small. Dream Huge." (COMPLIANCE)
  - "Your Alarm Clock Has Odds" (FORECASTING)
  - "Green Candles Are A Love Language" (MARKETING)
  - "Exit Liquidity Is A Personality" (TRADING FLOOR)
  - "The Spread Never Sleeps" (MARKET MAKING)
  - "Long Coffee, Short Meetings" (STRATEGY)
  - "Rekt Is A Rite Of Passage" (MORALE)
  - "Price It Or It Didn't Happen" (RESEARCH)
  - "Max Pain, Max Gain" (LEVERAGE DEPT)
  - "Moon Or Bust (Mostly Bust)" (FORECASTING)
  - "Hedge Your Hedges" (RISK OFFICE (UNSTAFFED))
  - "Everything Resolves Eventually" (CLEARING HOUSE)
  - "The Void Is A Counterparty" (MARKET MAKING)
  - "Meaning Is Thinly Traded" (RESEARCH)
  - "Price The Unpriceable" (EXOTICS DESK)
  - "Time Is Not Financial Advice" (COMPLIANCE)
  - "Tomorrow Is A Derivative Of Today" (QUANT DESK)
  - "Hedge Against Yesterday" (RISK OFFICE)
  - "The Universe Has No Stop Loss" (RISK OFFICE)
  - "Your Odds Are Someone Else's Certainty" (STRATEGY)
  - "Nothing Is Settled Until It Is" (CLEARING HOUSE)
  - "Bet On The Present. It Expires Soon." (LIVE DESK)
  - "Infinity Trades At A Discount" (TREASURY)
  - "Fate Accepts Limit Orders" (EXOTICS DESK)
  - "Every Moment Is A Market" (LIVE DESK)
  - "You Are The Long Shot" (LONGSHOT DESK)
  - "The Sun Is Also A Position" (ASTRO DESK)
  - "Probability Loves A Mystery" (QUANT DESK)
  - "Doubt Has Excellent Liquidity" (MARKET MAKING)
  - "The Past Is Closed For Trading" (CLEARING HOUSE)
  - "Certainty Has Been Delisted" (COMPLIANCE)
  - "Even Silence Has A Spread" (MARKET MAKING)
  - "Entropy Always Wins The Close" (RESEARCH)
  - "Your Shadow Is Short" (TECHNICAL ANALYSIS)
  - "Today Is Volatile. So Are You." (LIVE DESK)
  - "Long The Mystery, Short The Answer" (STRATEGY)
  - "Odds Are Just Stories With Numbers" (RESEARCH)
  - "The Clock Is A Market Maker" (CLEARING HOUSE)
  - "Dreams Settle At Dawn" (NIGHT DESK)
  - "Bet On Yourself, Then Forget" (BEHAVIORAL DESK)
  - "Nothing Lasts. Price Accordingly." (RISK OFFICE)
  - "Nobody Knows. Everyone Trades." (TRADING FLOOR)
  - "The Moon Doesn't Hedge" (ASTRO DESK)
  - "Tuesday Is Not Guaranteed" (CLEARING HOUSE)
  - "Reality Is In Price Discovery" (RESEARCH)
  - "Yes, No, Maybe, Forever" (PRODUCT)
  - "The Universe Settles In Cash" (TREASURY)
  - "Uncertainty Is The Only Asset" (STRATEGY)
  - "Consciousness Is A Bull Market" (HYPE DEPARTMENT)
  - "Every Ending Is Just An Expiry" (CLEARING HOUSE)
  - "The Void Never Sleeps Either" (NIGHT DESK)
  - "Ask The Stars. They Charge Fees." (ASTRO DESK)
  - "Somewhere It Already Resolved" (CLEARING HOUSE)
  - "Your Future Self Is Watching The Chart" (BEHAVIORAL DESK)
  - "Odds Are, You're Still Here" (WELLNESS DESK)
  - "History Is A Settled Market" (RESEARCH)
  - "The Present Is Thinly Traded" (LIVE DESK)
  - "Gravity Never Misses A Margin Call" (RISK OFFICE)
  - "The Infinite Is Out Of Stock" (TREASURY)
  - "Bet Small. Wonder Big." (HYPE DEPARTMENT)
  - "The Horizon Is A Moving Average" (TECHNICAL ANALYSIS)
  - "We Trade In Maybes" (MARKET MAKING)
  - "Time Is The Only Whale" (WHALE WATCH)
  - "Every Yes Contains A No" (COMPLIANCE)
  - "The Answer Is Pending Review" (CLEARING HOUSE)
  - "Long Wonder" (STRATEGY)
  - "Sleep Is For People With Stop Losses" (NIGHT DESK)
  - "40x Leverage, 0x Regrets" (HYPE DEPARTMENT)
  - "Whales Eat First" (WHALE WATCH)
  - "Double Or Nothing Is A Personality" (HYPE DEPARTMENT)
  - "The Odds Are Moving. Are You?" (LIVE DESK)
  - "Fade The Crowd, Then Join It" (STRATEGY)
  - "Every Minute Is Resolution Day" (CLEARING HOUSE)
  - "Long Shots Are Short Stories" (LONGSHOT DESK)
  - "Your Confidence Is Overpriced" (QUANT DESK)
  - "Cash Out Before The Victory Lap" (RISK OFFICE (UNSTAFFED))
  - "Bet The House (Metaphorically)" (COMPLIANCE)
  - "Chart Says Up. Vibes Say Up." (TECHNICAL ANALYSIS)
  - "Ape In Gently" (RISK OFFICE (UNSTAFFED))
  - "Someone Just Bought YES. Stay Calm." (LIVE DESK)
  - "Odds Swinging. Hold Your Coffee." (LIVE DESK)
  - "Liquidity Is A Love Language" (TREASURY)
  - "Every Dip Is A Discount" (TRADING FLOOR)
  - "It Is Not Gambling If You Made A Chart" (TECHNICAL ANALYSIS)
  - "Max Bet On Breakfast" (HYPE DEPARTMENT)
  - "Hindsight Trades At 100¢" (RESEARCH)
  - "Your Horoscope Is Now A Derivative" (EXOTICS DESK)
  - "The Longshot Called. It Wants You." (LONGSHOT DESK)
  - "Probability Is Just Spicy Common Sense" (QUANT DESK)
  - "We Price Everything. Even This." (MARKET MAKING)
  - "YES Is A Lifestyle" (MARKETING)
  - "NO Is Also Valid" (COMPLIANCE)
  - "Somebody Has To Take The Other Side" (MARKET MAKING)
  - "Volatility Is Just Excitement" (TRADING FLOOR)
  - "Never Bet Against Coffee" (RESEARCH)
  - "Buy Low, Explain Later" (TRADING FLOOR)

### Oddity: Longshot Of The Hour

An existential prediction market (does the void take bets?) with YES and NO prices, the payout multiplier, volume, leverage and your position.

- **qs:** Will today happen twice?; Does the void take bets?; Will you remember this Tuesday in forty years?; Is tomorrow already priced in?; Will your reflection blink first?; Will the color blue be discontinued?; Will time move sideways this weekend?; Will the moon admit it was a dream?; Will the sea forget its name?; Will gravity ask for something in return?; Will the clocks agree on anything?; Will you meet the version of you who stayed?; Will meaning reprice above 40¢?; Will an eighth day appear on the calendar?; Will the horizon hold still for one hour?; Will silence be louder than expected?; Will the past reopen to visitors?; Will you become a rumor in someone else's dream?; Will the last echo come back?; Will Sunday refuse to end?; Will a minute last an hour somewhere near you?; Will the stars move closer, just once?; Will your shadow arrive before you?; Will the fog make a statement?; Will the universe read your message?; Will déjà vu happen again?; Will infinity be revised downward?; Will the ocean finish its diary?; Will the present moment ever arrive?; Will the door you never opened still be waiting?
- **pos:** 3 YES; 1 NO; FLAT (RARE); 40 YES (UNWISE); 2 NO (HEDGED); ALL IN

### Idle game: The Bankroll

Your bankroll trades existential markets on its own: positions open and resolve each refresh, with breaking news in between. Charging tops up your margin. Hit zero and the universe opens a new account.

**New character every run:** The Bankroll: each run has a trader persona (Whale, Shark, Bull, Owl) whose strategy changes how often it bets YES.

### Hard rules for this theme

- No real stocks, crypto tickers, exchanges or betting brands, and never real financial advice.

Contact sheet: `contact_sheets/11_Long_Odds.jpg` · full-res assets: `11_Long_Odds/`
