# Foundry for Android: Phase 1 spec

Goal: Android users get the same live widgets iPhone users get, starting with Halcyon (both editions), from one shared codebase.
Every Foundry theme exports a widget script (the file iPhone users paste into Scriptable). The Android app runs that exact
script in a hidden WebView using `runtime/foundry-runtime.js`, which recreates the parts of Scriptable's API Foundry uses, and
puts the resulting picture on the home screen. New themes, editions and GPT designs then work on Android with no extra code.

Status: the runtime is done and verified in Chromium (the same engine as Android's WebView). All 72 Halcyon renders succeed:
Illustrated 13 widgets x 3 sizes and Original 11 widgets x 3 sizes. Median render is 38 ms (worst 409 ms). They match the site
previews, apart from live data. This spec covers the native shell around it.

## Architecture (Kotlin, minSdk 26, target the current SDK)
- `MainActivity`: import a theme, grant permissions, preview widgets, and run the two setup screens (below).
  - Import: paste the exported script, open a `.js` file, or receive one through Android's share sheet.
  - Store it in `filesDir/themes/<name>.js`. The name comes from the script's first line ("// Halcyon Biofab, made with Foundry").
- `FoundryWidgetProvider` (AppWidgetProvider): one resizable widget plus a configuration activity. The user picks the theme
  and the mode (status, shift, transmission, solar, audio, feeds, youtube, instagram, discord, oddity, game, tracker, dossier).
  - Original editions offer only each mode's intended size, read from the script header (e.g. `status (medium)`).
  - Illustrated and Expanded editions allow small, medium and large.
- `Renderer`: one hidden WebView created on the main thread with the application context. It loads
  `assets/runtime/index.html`, which has `@font-face` rules for the bundled fonts and `foundry-runtime.js`. Render jobs are
  queued one at a time.
  - Call `FoundryRuntime.run({ script, family, param, scale, name })`.
  - `evaluateJavascript` can't await a promise, so wrap the call so JavaScript posts its result back through the bridge:
    `FoundryRuntime.run(...).then(r => FoundryNative.result(id, JSON.stringify(r)), e => FoundryNative.error(id, String(e)))`.
  - The result is `{ png, width, height, refreshAfter, url, links:[{url, box:[x,y,w,h]}], ms, logs }`, with boxes in widget
    points.
- Widget display: decode the PNG to a Bitmap and set it on a RemoteViews `ImageView` (fitCenter) inside a root that clips to
  the system widget corner radius on Android 12+.
  - Tap: a PendingIntent opening `url` (ACTION_VIEW). The runtime already rewrites iPhone app links to Android ones.
  - Fallback when `url` is empty: open the app.
  - Keep bitmaps under the RemoteViews size limit: render at scale = min(3, widget px width / design width), and reuse the
    previous bitmap if a render fails.

## Native bridge: `window.FoundryNative` (@JavascriptInterface, all synchronous)
| method | returns |
|---|---|
| `docsDir()` | absolute path of `filesDir/foundry` (create it) |
| `exists(path)`, `isDir(path)` | boolean |
| `readFile(path)` | file bytes as base64, or `""` if missing (missing files are NOT errors; scripts rely on this) |
| `writeFile(path, base64)`, `mkdir(path)`, `remove(path)` | nothing |
| `list(path)` | JSON array of names |
| `calendar(startMs, endMs)` | JSON array `[{title,start,end,allDay,calendar,calendarId,color,location,notes,id}]` from CalendarContract.Instances, all visible calendars |
| `location()` | JSON `{lat,lon,acc}` or `null`: last known coarse location, cached in the app (refreshed when the app opens and on each widget refresh if permission allows) |
| `battery()` | JSON `{level: 0..1, charging: bool}` from BatteryManager / ACTION_BATTERY_CHANGED |
| `result(id, json)`, `error(id, msg)` | render callbacks |
Paths must stay inside `filesDir/foundry`; reject anything else. Widgets of the same theme share files (game saves, settings),
keyed by the script name passed as `name`, so always pass the theme name, e.g. `"Halcyon"`.

## Refresh
- WorkManager periodic job every 15 minutes (the minimum) renders all placed widgets. If a result's `refreshAfter` is sooner,
  also enqueue a one-time job for then.
- Also refresh on: widget added or resized, `ACTION_POWER_CONNECTED/DISCONNECTED` (the Specimen game grows while charging),
  boot, time and timezone changes, and app open.
- Network (weather, Illustrated art) goes through the WebView's own `fetch`. Art downloads once and is cached in the files
  area by the script itself.

## Setup screens (replacing Scriptable's in-app menus)
Halcyon's `allocation_setup` and `radio_setup` normally run from the Scriptable app. Recreate them in MainActivity. Both write the
same settings file the script reads: `filesDir/foundry/foundry-halcyon-<Name>.json`, where `<Name>` is the script name with
anything outside `[A-Za-z0-9_-]` replaced by `_`.
- Allocation: list timed events from the next 90 days. The pick saves exactly what the script's `hbChooseAllocation` writes:
  `{allocation:{match:'title', identifier, title, calendar}}`, where `calendar` is the calendar's id (a string) and
  `identifier` the event's series id, merged into the existing settings so `radio` is kept. (Corrected 12 Oct: an earlier
  draft said `{title, calendar, start, end}`, which the script would never match.)
- Radio: one text field for a music app or stream URL, saved as `{radio: url}`.

## Permissions
`READ_CALENDAR`, `ACCESS_COARSE_LOCATION`, `INTERNET`, `RECEIVE_BOOT_COMPLETED`.
- Location for weather: ask while the app is open and cache the last fix. Don't require background location in Phase 1.
- Explain each permission in plain language before the system prompt.

## Fonts (bundle in assets, all OFL)
Phase 1 (Halcyon): Newsreader, IBM Plex Mono, Archivo. Also Barlow Condensed, the width-matched stand-in for iPhone's condensed
fonts (Neon, Nightfall).
Phase 2 adds each theme's display font: Shippori Mincho B1, IM Fell English, Oxanium, Cormorant Garamond, Bodoni Moda, Orbitron,
Righteous, Fraunces. The runtime maps every iPhone font name to these (see `FRAME_DISPLAY` in the runtime). Use the
`@fontsource` packages at pinned versions.

## Build and delivery (no local Android tools needed)
- GitHub Actions workflow `.github/workflows/android.yml`: JDK 17, Gradle `assembleDebug` on every push touching `android/`,
  and the APK uploaded as a workflow artifact.
- Later: a signed `assembleRelease` with the keystore stored in repository secrets.
- Project lives in `android/` in the Foundry repo; the runtime is shared from `android/runtime/`.
- Testers install the debug APK directly ("install unknown apps" for their file manager or browser).

## Acceptance tests
1. Runtime: open `runtime/test.html` in desktop Chrome, paste a Halcyon export, and render every mode at every size with no
   errors.
2. On a phone (Galaxy A53 test device): import the Halcyon Illustrated export and place small, medium and large widgets for
   status, shift, solar, game, tracker and dossier. Each shows real calendar, weather and battery data within one refresh.
3. Plug in a charger: the game widget refreshes and the specimen advances on its next turn.
4. Airplane mode: widgets keep their last image and the cached art; nothing crashes.
5. Allocation setup: choose an event; Shift shows the countdown on the next refresh.
6. Original edition: import it; each widget offers only its intended size and matches the site preview.

## Known Phase 1 limits (Phase 2 work)
- Live per-second countdowns (Scriptable's timer dates) update at each refresh. Phase 2 overlays a RemoteViews `Chronometer`
  in the timer's box (from `links`/layout data).
- Widgets with two tap targets (feeds: YouTube and Instagram) open the main link. Phase 2 adds transparent click zones from
  `links` boxes.
- Animated live wallpapers are Phase 3.

## Phase 1 as built (12 Oct)
Built on the `android` branch (never merged into `main`). Details settled while building, all checked against the real
Halcyon exports:
- Import: the site's Export step offers Copy script and Save as text file (`<name>-widgets.txt`). Foundry takes the
  script by paste, from the share sheet, through Open with for .txt and .js files, or from its file picker. On Android
  10 and older the script is too long for the clipboard, so the app leads with the file route there. A zip (the
  Android or theme pack) gets its own explanation.
- Name line: the site exports `// Halcyon Biofab — made with Foundry` (em dash); the comma form above is accepted too.
- Theme names: an Original edition is stored under the company name ("Halcyon Biofab"); Illustrated and Expanded add the
  edition ("Halcyon Biofab Illustrated"), so both editions can be installed side by side.
- The `name` passed to the runtime is the company's first word ("Halcyon"), the same as the site's Android pack. It keys
  the settings file, e.g. `foundry-halcyon-Halcyon.json`.
- Widgets offered: Original editions read the header comment (`status (medium) · shift (small) · solar (large is best)`
  and so on; "any" means every size). Illustrated and Expanded use their edition's widget table (`HB_META` / `DR_META`), which
  adds tracker and dossier, at every size. Previews and the picker default to medium where allowed (as on the site).
- Bridge: `calendar()` returns `null` without calendar permission, so scripts fail the read as on iPhone ("calendar access
  is unavailable" rather than "no events"). `id` is the event's series id (`ORIGINAL_ID`, else `EVENT_ID`) and
  `calendarId` a string, matching iPhone's identifiers. One extra method, `job(id)`, hands the page each render's options
  so large scripts never pass through `evaluateJavascript`.
- Fonts: the page loads every bundled face before the first render (scripts also draw bold IBM Plex Mono, which
  `fontsNeeded()` doesn't list).
- The page is served from `https://appassets.androidplatform.net/assets/runtime/index.html` (answered by the app), so the
  bundled fonts load and `fetch` has a real origin. Open-Meteo and GitHub Pages allow any origin.
- `writeFile` refuses to save non-image bytes under an image name (`.png`, `.jpg` and the like). A Wi-Fi sign-in or error page is
  then never cached as art; the script downloads it again next time.
- Taps: `calshow://` (mapped by the runtime to `content://com.android.calendar/time/`) gets the current time appended;
  `instagram.com/app` opens Instagram's home; `foundry://run` (Shift before its allocation is chosen) opens the app's
  allocation setup. Links nothing on the phone can open fall back to the app.
- Charger: since Android 8 apps can't receive the plug-in broadcast from the manifest. While Foundry's process is running
  a live receiver redraws at once; otherwise a WorkManager job that requires charging wakes the app, but Android may wait
  several minutes before it reports "charging", so in practice the game picks up charging by the next 15-minute refresh.
  Test 3 should expect that ("by the next refresh, or at once with Foundry open").
- Airplane mode (test 4): scripts don't fail offline, so widgets keep redrawing with cached art, calendar, battery and the
  game, and weather shows the script's offline placeholder (as on iPhone). The last picture is reused only when a render
  fails outright.
- Sizes: the size picked in the widget picker is the design drawn; the widget's frame on the home screen is resized by
  the user (about 2x2 small, 4x2 medium, 4x4 large). The picker and the app's how-to say so.
- Test builds: every debug APK is signed with one shared test key (android/app/debug.keystore), so a new build installs
  over the old one and keeps the tester's themes and widgets. Each build's version is 0.1.<run number>.
- Symbols outside the bundled fonts' Latin sets (■ □ ▼ → ∞ and the speaker emoji some widgets draw) use the phone's
  system font, as they do on the website, whose web fonts lack them too.
- Shift's setup text was fixed on main (PR #5): it says 'Choose an allocation in widget setup.', which fits both
  iPhone and Android.

