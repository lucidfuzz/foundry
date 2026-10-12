# Foundry — notes for Claude Code

Foundry (https://lucidfuzz.github.io/foundry) is a free web app that builds complete iPhone themes: four lock screens, a home
wallpaper, eleven app icons and live Scriptable widgets. Eleven pre-made themes, each with five colorways. The owner (Jordan) is
not a developer: explain in plain language, one step at a time, and confirm before anything irreversible.

## Read first, every session
1. `docs/APPROVED_DESIGN_DECISIONS.txt` is the canonical design record shared with Codex. It includes the WORLD-BUILDING STANDARD
   (world notes first, locked identity, cross-theme uniqueness, variety minimums, immersion, ship gate). It is binding for every
   prefab and every edition; the latest explicit direction from Jordan overrides older notes.
2. `docs/FOUNDRY_THEME_BIBLE.md`: each theme's world, look, voice, screens, copy, content pools, games and hard rules.
3. This file: engineering, delivery and push rules.
Record new approvals and corrections in the decisions file the same day, and mark superseded decisions.

## Layout and build
- The live site is `index.html` at the repo root, generated — never edit it by hand.
- Source lives in `src/`: `page.html` (shell), `foundry-data.js` (themes, colorways, EDITIONS), `render.js` (wallpapers, icons),
  `app.js` (UI, export), `tpl.js` (the Scriptable widget template), `paint/*.js` (each theme's widget art, joined into tpl.js),
  `halcyon/` and `deeprange/` (edition renderers), `art.js` + `art-manifest.js` (hosted artwork).
- Build: `node scripts/build.cjs`. Check: `node --test tests/*.test.cjs` and `node scripts/build.cjs --check`. Both must pass
  before any commit.
- After adding or changing raster art in `assets/<theme>/`: `python3 scripts/art.py` (needs Pillow), then rebuild.

## Rules
1. **Editions, never replacements.** New designs (from GPT, Codex or anyone) are added as a new edition in `EDITIONS`
   (`src/foundry-data.js`). The original theme must keep working pixel-for-pixel. Gate every hook on the edition, like `hbOn()`
   (Halcyon: Original / Illustrated) and `drOn()` (Deep Range: Original / Expanded). Original stays the default.
2. **Keep the site fast.** Never embed images or fonts in `index.html` (it should stay around 1 MB). Raster art is served from
   `assets/<theme>/` through `scripts/art.py`; fonts come from the existing Google Fonts link.
3. **Sharp widget art.** Size each widget crop to 3x the largest size any widget draws it (`WIDGET_PX` in `scripts/art.py`),
   capped at the source resolution.
4. **Scriptable reads.** Real Scriptable returns `null` (does not throw) when reading a missing file. Always check
   `fm.fileExists()` first and confirm parsed JSON is an object. Test doubles must return `null` for missing files.
5. **Text.** Never truncate with "…" — shrink, then wrap. No real Japanese, Chinese or Korean characters anywhere (use invented
   glyphs). Original designs only; no characters, logos or layouts from films, games or books; no stereotypes.
6. **Screens.** Home screens keep content clear of the app icon row (about y 60–150 at 390x844) and the dock (y 752 and below).
   Each theme's home screen differs from its lock screen.
7. **World-building gate.** Before a theme ships, run the gate in the decisions file: world notes updated, cross-theme matrix
   checked, variety sheets at all three sizes, side-by-side with the approved reference and the Original edition.
8. **Check visually.** Render every changed screen and widget (all three widget sizes) and look at it before calling work done.
   Untouched themes must render identically to before.

## Accepting a GPT/Codex handoff
Handoffs arrive as an HTML file with embedded files. Extract with code, verify every SHA-256, look at the previews, then:
compare its base commit with current `main`; merge only the theme's additions (never drop whole shared files over newer work);
add it as an edition (rule 1); refuse build changes that embed assets (rule 2); fix unrealistic test doubles (rule 4).
Report anything worth sending back to GPT before integrating.

## Pushing
- Work on `main` only after `git pull`. Never force-push. Never rewrite history.
- Commit with a plain-language message describing what changed for the user.
- After pushing, prove it landed: `git ls-remote origin main` must equal the new commit. Then confirm the live site updated
  (GitHub Pages takes a minute or two). Report the commit ID.
- If sign-in is needed, stop and let Jordan do it.
