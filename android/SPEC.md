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
- Allocation: list timed events from the next 90 days. The pick saves `{allocation:{title, calendar, start, end}}`; match the
  fields the script's `hbChooseAllocation` writes.
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
