---
name: nav-port-theme
description: Add or update a Foundry world (theme or edition) in Foundry Maps, the navigation app in nav/. Use when a new Foundry theme or edition ships, when Jordan approves or changes a world's navigation voice or map look, or when asked to port a theme to the maps app.
---

# Port a Foundry world to Foundry Maps

Foundry Maps reads every theme's colors, colorways, fonts, headlines and slogans from `src/foundry-data.js` at build time.
A new theme therefore appears in the app automatically, but with Halcyon's map treatment and voice as a fallback until it
gets its own. This procedure gives it its own. Read `docs/NAV_SPEC.md` and the theme's Theme Bible section first.

## 1. World notes first
Write down, from the Theme Bible: who would guide someone through this world, and through what channel (a device, a
broadcast, a person). It must not match any other world's speaker or channel (see `NAV_VOICES` in `nav/src/voices.js`).

## 2. Map treatment: `nav/src/worlds.js`
Add an entry to `NAV_WORLDS` keyed by the theme id:
- `land`, `water`, `park`, `wood`, `roads` (minor, major, motorway, optional casing and blur): palette roles from the
  theme's colors (`c.ground`, `c.ink`, `c.accent`, `c.panel`, `c.glow`, `c.alert`) mixed with `navMix`. A fixed tint is fine
  only as the world's own ink (e.g. Long Road's sea blue), blended into the palette so every colorway still works.
- `texture`: one of the kinds in `navTexture`, or a new kind drawn there. No two worlds may share one.
- `marker`: a key of `NAV_MARKERS` (add a new 48x48 shape pointing up if needed). No two worlds may share one.
- `route`: line color plus at most one of casing, dash or glow. It must stand out from the land in every colorway.
- `labels`: font (Regular, Bold, Italic: the glyphs OpenFreeMap serves), upper case and letter spacing.
- Add a `[data-world=<id>] .panel` rule in `nav/src/page.html` for the world's panel framing (unique per world).
- Editions: until editions are mapped (spec Phase 2), the Original edition is what Foundry Maps shows.

## 3. Voice: `nav/src/voices.js`
Add `NAV_VOICES[<id>]` with speaker, channel, rate, pitch, the in-world labels `L` (keep a plain word where a real function
needs it: Start, End, Search) and the pools: depart 6+, arrive 6+, reroute 4+, cruise 8+, tags 6+. Every line is spoken
after a plain instruction, so it must make sense on its own. Follow the theme's hard rules (no ellipses, invented glyphs only,
real facts where the Bible says so, no real brands). Mark new lines DRAFT in the decisions file until Jordan approves.

## 4. Check
```bash
node scripts/build.cjs
```
```bash
node --test tests/nav.test.cjs
```
The tests fail if the world lacks a voice or treatment, repeats another world's texture, marker, speaker or channel, or has
a route or label color that is hard to see in any colorway.
```bash
node scripts/nav-shots.cjs .cache/nav-shots --worlds=<id>
```
Open `contact-colorways.png` and `contact-scenes.png` and look: all five colorways, the route choice, the drive and the
arrival card. Compare with the theme's lock and home screens in the builder: same palette roles, same fonts, same mood.
Then run the full test suite and build check (CLAUDE.md) before committing, and record the change in
`docs/APPROVED_DESIGN_DECISIONS.txt` the same day.
