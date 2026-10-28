---
name: nav-port-theme
description: Add or update a theme in Navie, the navigation app in nav/. Use when writing new Navie themes for the catalog (any age or style), when a Foundry theme or edition ships and needs its map look and guide, when Jordan approves or changes a theme's guide or look, or when asked to port a theme to the maps app.
---

# Add a theme to Navie

Navie's catalog has two kinds of theme. Read `docs/NAV_SPEC.md` first.
- **Navie's own themes**: one `navTheme({...})` call in `nav/src/themes/<group>.js`. Most work is this. Go to part A.
- **Foundry worlds**: built from `src/foundry-data.js`, with their map look in `nav/src/worlds.js` and their guide in
  `nav/src/voices.js`. A new Foundry theme appears in Navie automatically but fails the tests until it gets both. Go to part B.

## A. A Navie theme
1. **Who it's for and who guides.** Pick the ages (kids, teens, adults, clear) and styles (see `NAV_VIBES` in
   `nav/src/kit.js`). Invent the guide: an original character or role (`speaker`) and how they reach you (`channel`).
   Neither may match any other theme's. Kids' guides talk to the whole car and never distract the driver. "Easy to read"
   themes use text scale 1.2 to 1.35, strong contrast, a slower rate and few words.
2. **Look.** Choose a marker (`NAV_MARKERS`) and texture (`navTexture`) in `nav/src/worlds.js`. Together they must differ
   from every other theme's pair (add a new shape or texture there if none fits). Then pick a frame (`NAV_FRAMES`), a route
   style (outlined, glow, dashed, solid) and a label style.
3. **Colors.** Set all nine roles (ground, ink, accent, panel, glow, alert, water, park, roads; highway is optional) and four
   more colorways, each a real alternative mood (include a dark one where the theme allows).
4. **Fonts.** Pick a Google Fonts display face and a readable second face. Check the exact query first:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" "https://fonts.googleapis.com/css2?<query>&display=swap"
   ```
   It must print 200. `weight` must be one the query loads.
5. **Words.** Write the screen labels `L` (26 characters max; keep a plain word where a real function needs it: Start, End,
   Search), the pools (depart 6+, arrive 6+, reroute 4+, cruise 8+, tags 6+, all different) and 4+ two-line arrival
   headlines (22 characters max per line). Lines are spoken after a plain instruction, so each must stand alone.
   - Original only: no characters, brands, shows, games or franchises, and none of GoGirl's theme names.
   - Facts must be true. Nothing may encourage speeding, phone use or drinking.
   - No "…", no emoji, no Japanese, Chinese or Korean characters.
6. Mark the theme DRAFT in `docs/APPROVED_DESIGN_DECISIONS.txt` until Jordan approves it.

## B. A Foundry world or edition
1. **World notes first.** From the Theme Bible: who would guide someone through this world, and through what channel. Never
   reuse another theme's speaker or channel.
2. **Map treatment.** Add an entry to `NAV_WORLDS` in `nav/src/worlds.js`: land, water, park, wood and roads from the theme's
   palette roles mixed with `navMix`, plus a texture and a marker no other Foundry world uses, a route and labels. Add a
   `[data-world=<id>] .panel` framing rule in `nav/src/page.html`, and an ages/styles entry in `NAV_FOUNDRY_TAGS`
   (`nav/src/kit.js`).
3. **Guide.** Add `NAV_VOICES[<id>]` in `nav/src/voices.js` (same pools and labels as A5). The theme's hard rules apply.
4. **Editions.** Until editions are mapped (spec Phase 2), Navie shows the Original edition.

## Check (both)
```bash
node scripts/build.cjs
```
```bash
node --test tests/nav.test.cjs
```
```bash
node scripts/nav-shots.cjs .cache/nav-shots --worlds=<ids> --picker
```
Open `contact-colorways.png` and `contact-scenes.png` and look at all five colorways, the route choice, the drive, the
arrival card and the picker. The route must be clearly visible and the text easy to read. Nothing should be garish or look
like another theme. Then run the full test suite and build check (CLAUDE.md) before committing, and record the change in the
decisions file the same day.
