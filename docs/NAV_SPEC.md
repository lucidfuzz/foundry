# Navie: spec

Navie is turn-by-turn navigation where every Foundry world restyles the map and speaks the directions. It is our answer
to GoGirl: Girly Maps & Pink GPS. It lives beside the Foundry theme builder, at `nav/` in this repo
(https://lucidfuzz.github.io/foundry/nav/ once merged). The theme builder keeps working exactly as before.

## In one paragraph (for Jordan)
You pick a theme from a big catalog (filter by who it suits and by style) and one of its five colorways. The whole map
turns into that theme: its colors, texture, your position marker, the route line, the panels, and a guide that gives real
directions with that theme's personality on top. Search a place, choose between up to three routes, press start, and it
talks you there. The catalog has two kinds of theme: the 11 Foundry worlds (built from the same data as the theme builder)
and Navie's own themes, written for every age and taste.

## The theme catalog (Jordan, 28 Oct: "create a vast array of themes catering to all ages and aesthetics")
The Studio test version (design your own) was scrapped the same day ("Scratch the customization"). Instead Navie grows a
large catalog of ready-made themes, added in waves.
- **Ages** (who it suits): Kids (riding along on family trips), Teens, Adults, and Easy to read (larger text, strong
  contrast, a slower and calmer guide: older drivers, low vision, glare, night, nervous drivers).
- **Styles**: Cute, Pastel, Bright, Dark, Retro, Nature, Fantasy, Sci-fi, Minimal, Luxe, Cozy, Spooky, Playful, Calm. The
  picker filters by both; Foundry worlds have their own filter too.
- **Wave 1 (28 Oct):** 24 Navie themes. Kids: Dino Dig, Rocket Club, Bubble Reef, Crayon Town, Barnyard Buddies, Sprinkle
  Sky. Teens: Glitter Flip (Y2K), Mochi Cloud, Pixel Quest, Midnight Synth, Ribbon & Pearl, Pow!, Velvet Thorn. Adults:
  Strawberry Milk, Quiet Mono, Gilded Night, Hedgerow Cottage, Blueprint, Watercolor Wash, Desert Bloom, Oak & Ink. Easy to
  read: Clear Day, Clear Night, Calm Seas. (Titles may change in review.)
- **Ideas for later waves:** seasons and holidays (spooky-cute autumn, snow day, spring blossom), sports and stadium,
  racing, safari, fairy garden, mermaid lagoon, robots, trains, camping, beach day, café, retro diner, film noir, Memphis
  80s, bauhaus, brutalist, terrarium, aurora, candy shop, k-pop-style idol stage (original), tropical, nautical, a
  colorblind-safe pair, and a pure "large print" theme.

### Adding a Navie theme
One `navTheme({...})` call in `nav/src/themes/<group>.js` (format at the top of `nav/src/kit.js`; finished examples:
Strawberry Milk in `30-adults.js`, the Easy to read themes in `40-clear.js`):
- nine color roles (ground, ink, accent, panel, glow, alert, water, park, roads; optional highway) and four more colorways;
- fonts from Google Fonts (check the exact query returns 200), ages, styles, a panel frame and a text size;
- the map: marker, texture, route style, label style;
- a guide: a unique speaker and channel, screen labels, and line pools (depart 6+, arrive 6+, reroute 4+, cruise 8+,
  tags 6+), plus four or more two-line arrival headlines.
`tests/nav.test.cjs` checks every theme (colors, contrast in every colorway, fonts link, unique speaker and channel, unique
look, pool sizes, label lengths, a banned list of names we don't own); `node scripts/nav-shots.cjs <dir> --worlds=<ids>`
renders them. The steps are in `.claude/skills/nav-port-theme/SKILL.md`.

## The reference: GoGirl (Retry Apps, App Store id6786178362)
What it is (from its App Store page, 28 Oct 2026): pastel map themes (Pink Princess, Lavender Dream, Baby Blue, Matcha, Cherry
Girl, Butter Yellow), turn-by-turn with "character-inspired" voices, CarPlay. iPhone only. Free download, but only one map
(yellow) is free; $4.99-9.99 a week/month or $29.99-39.99 a year. Same developer makes Game Maps IRL (video-game-styled maps,
30K ratings, #9 in Navigation), so this is a proven formula: a normal GPS wearing a costume.

What its reviews say is broken, which is our opening:
| Complaint | Our answer |
|---|---|
| Voices often don't speak at all | Voice is unlocked by the Start tap, tested in the simulator, and the banner always shows the same words |
| "You got this sweetie" on every turn gets annoying | Three voice styles: Plain, Light (default), Full. Flavor lines never repeat within a trip |
| Only one route | Up to three route choices with time, distance and the main road |
| No ETA (Game Maps IRL) | Arrival time, time left and distance left always visible |
| Map doesn't turn with you, screen sleeps | Heading-up follow camera and a screen wake lock while navigating |
| Paywall with no trial; pink is paid | Free, like Foundry. Every world and colorway available |
| No place photos | Not in Phase 0 or 1 (no free source); listed under later |

What we do NOT copy: its name, theme names, icons, layouts or voice lines. Our worlds are our own (CLAUDE.md rule 5).

## How Foundry ports over
| Foundry today | In Navie | Phase |
|---|---|---|
| 11 themes | 11 map worlds: a map style per theme with its own treatment (texture, road drawing, route line, marker) | 0 |
| 5 colorways each | 55 map palettes, read from `VARIANTS` | 0 |
| Theme fonts | Instruction banner and panels use the theme's display and mono fonts (Google Fonts, loaded on pick) | 0 |
| Headlines (`phrases` + `morePhrases`) | Arrival card headline and the start card | 0 |
| Slogans with their departments | Spoken now and then on long stretches (Light/Full) and shown on the stopped "transmission" strip | 0 |
| In-world labels and voice | HUD labels and a per-world navigation voice (`nav/src/voices.js`, drafts awaiting approval) | 0 |
| Editions | Edition-specific map treatments (e.g. Wayfarer's Folio map art) | 2 |
| Icon styles and glyph sets | Theme maneuver arrows and place icons | 2 |
| Idle games and oddities | Driven by your trips: each trip is a game turn; an oddity card on the route screen | 3 |
| Scriptable widgets | A `trip` widget (next saved trip, time to home) in every theme's export | 3 |
| Lock screens, home wallpaper, icons | Stay in the builder; Maps links to "get the matching phone theme" | 1 |

## Rules (in addition to CLAUDE.md)
1. **Directions are real and plain.** The instruction ("In 500 feet, turn left onto Main Street") is always complete, first,
   and in plain words. A world's flavor may come before or after it, never inside it and never instead of it. The banner shows
   the plain instruction. Truthful utility beats immersion (WORLD-BUILDING STANDARD 5).
2. **One source of truth per theme.** Foundry worlds come from `src/foundry-data.js` at build time; never copy their colors,
   names or copy into `nav/` (their map treatments and voices live in `nav/src/worlds.js` and `voices.js`). Navie's own
   themes live only in `nav/src/themes/`.
3. **Safety.** No typing while moving faster than walking pace (search is locked; a passenger can unlock it). Touch targets
   at least 48 px. Nothing animates in the banner. Flavor never hides the next maneuver, the distance or the arrival time.
4. **Privacy.** No accounts, no analytics. Only the route request (start and destination) and search text leave the phone,
   to the routing and search services named below. Recents and saved places stay in the browser's local storage.
5. **Free services, used politely.** The default services are free community servers with fair-use rules. Keep requests
   minimal (debounced search, at most one reroute every 10 s), show their attribution, and swap to a paid provider before a
   public launch with real traffic (Phase 1 decision for Jordan).
6. **Every theme stays itself.** Each theme's guide has its own speaker and channel (no two themes share one) and its own
   look (marker, texture, frame and palette together). For Foundry worlds the WORLD-BUILDING STANDARD and the Theme Bible's
   hard rules carry over. All themes: original only (no characters, brands, shows, games or franchises, and none of the
   reference app's theme names); facts must be true; kids' guides talk to the whole car and never distract the driver;
   nothing encourages speeding, phone use or drinking.
7. **The theme builder is untouched.** Nothing in `nav/` changes `index.html`, and the root build must produce the same
   `index.html` byte for byte.

## Architecture (Phase 0: a web app)
Why a web app first: it works on iPhone and Android with no install, no app store and no developer tools for Jordan, and the
same theme code runs in it. Limit: iPhone stops giving location when the screen is off, so the screen stays on while
navigating (wake lock). Native apps (background location, CarPlay, Android Auto) are Phase 3.

| Part | What | Where |
|---|---|---|
| Map | MapLibre GL JS 5.24.0 (open source), from jsDelivr with an integrity hash | `nav/src/page.html` |
| Map data | OpenFreeMap vector tiles (OpenMapTiles schema; free, no key) and its Noto Sans label glyphs | `nav/src/mapstyle.js` |
| Routes | OSRM API on routing.openstreetmap.de (FOSSGIS): car, bike, foot; up to 3 alternatives, full steps | `nav/src/providers.js` |
| Search | Photon (komoot), biased to your position; reverse lookup for "dropped pin" | `nav/src/providers.js` |
| Guidance | Snap to route, progress, off-route and reroute, arrival, when to speak | `nav/src/guidance.js` |
| Words | Plain instruction text, then the world's voice on top; speech through the browser (Web Speech) | `nav/src/voice.js`, `nav/src/voices.js` |
| Worlds | Map style per theme and colorway, generated pattern textures, markers | `nav/src/mapstyle.js`, `nav/src/worlds.js` |
| Simulator | Drives a route with realistic speeds, optional wrong turn | `nav/src/sim.js` (`?sim=1` in the app) |
| Theme kit | Navie's own themes as data; ages and styles for the picker | `nav/src/kit.js`, `nav/src/themes/*.js` |
| UI | Search, route choices, navigation banner and bar, arrival card, theme picker with filters, settings | `nav/src/app.js`, `nav/src/page.html` |
| Build | `scripts/nav-build.cjs` writes `nav/index.html` (called by `scripts/build.cjs`) | |

URL switches: `?sim=1` (drive the route with the simulator), `?fixture=1` (fully offline: the synthetic test town, its router
and search, simulator on), `?theme=<id>&colorway=<0-4>` (open in a theme).

## Test harness
- `node --test tests/*.test.cjs` runs `tests/nav.test.cjs` with everything else: geometry, instruction text for every
  maneuver type, guidance on simulated drives (announcements fire once each, in order; a wrong turn triggers exactly one
  reroute; GPS jitter alone does not; arrival fires), voices (unique speaker and channel per world, no repeats in a trip,
  plain instruction first), copy rules, every theme x colorway producing a complete style with a visible route and readable
  labels, unique looks, every Navie theme complete and original, and the whole built app parsing as one script. Fixtures: the test town in `nav/fixture.js` and an OSRM response covering every maneuver type in
  `tests/fixtures/nav/osrm-mixed.json`.
- `node scripts/nav-shots.cjs [outdir]` renders the app headless in the offline test town: every world in every colorway, plus
  route choice, mid-drive and arrival screens per theme, the theme picker, and two contact sheets (about 20 minutes for the
  whole catalog; use `--worlds=<ids>` while working on a few). Look at them (CLAUDE.md rule 8). It needs
  Playwright (preinstalled in Claude's cloud sessions) and downloads MapLibre from npm once into `.cache/`.
- Real-world check (only Jordan can do it): open the site on a phone, `?sim=1` first, then a real short drive with a passenger.

## Phases
- **Phase 0 (started 28 Oct 2026):** this spec and harness; the web app with all 11 worlds x 5 colorways, search, up to three
  routes, spoken turn-by-turn in Plain/Light/Full, reroute, arrival, simulator, offline harness. Then the theme kit and the first wave of 24 Navie themes.
- **Phase 1:** Jordan's phone tests; tune announcement timing; approve each world's voice (drafts in `voices.js`); add to home
  screen (manifest and icons); saved places polish; lane hints; choose the production routing/search provider.
- **Phase 2:** editions on the map; theme maneuver arrows and place icons; theme label fonts on the map (hosted glyphs).
- **Phase 3:** native shells (Android built by GitHub Actions; iPhone needs a Mac, an Apple developer account and Apple's
  CarPlay navigation approval); trip-driven games and oddities; the `trip` Scriptable widget.

## Open questions for Jordan
1. Name: Navie (approved by Jordan, 28 Oct). "Naviii" stays an option for a playful logo spelling.
2. Free (recommended, as Foundry is) or paid? Free still has a cost at scale: routing and search servers (Phase 1 decision).
3. Approve, cut or redirect wave 1 (all DRAFT), and say which later-wave ideas you want next.
4. Approve or redirect each guide (who speaks, through what channel, sample lines in `nav/src/voices.js` and the theme files).
