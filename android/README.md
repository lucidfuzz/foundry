# Foundry for Android

Live Foundry widgets on Android, from the same widget script iPhone users paste into Scriptable. The app runs that script
in a hidden web view with `runtime/foundry-runtime.js` and puts the picture on the home screen. Phase 1 covers Halcyon
(Original and Illustrated); the design is in [SPEC.md](SPEC.md).

This work lives on the `android` branch and is never merged into `main`.

## Getting the app (testers)
1. Sign in to GitHub (downloads need a free account), open the repository's **Actions** tab and click the latest green
   **Android app** run on the `android` branch.
2. Scroll to **Artifacts** and click **Foundry-debug.apk** to download it.
3. Open the downloaded file on the phone. If Android asks, allow your browser or Files app to install unknown apps.
4. Open Foundry, import a theme's widget script (from the website's Export step), allow calendar and location if you want
   real readings, then add a Foundry widget from the home screen's widget list and resize it to the size you picked.

Newer builds install over older ones and keep your themes and widgets. The version (Settings > Apps > Foundry) is
0.1.<build number>. Builds made before the shared test key (the first three, on 12 Oct) must be uninstalled once.
To rebuild without new code, open the latest run on GitHub and choose **Re-run all jobs**.

## How it fits together
| Piece | File |
|---|---|
| Reads a script's name, edition, widgets and sizes | `app/src/main/java/.../ScriptInfo.kt` |
| Imported themes, per-widget choices, last pictures | `Stores.kt` |
| Hidden web view that runs scripts, one job at a time | `Renderer.kt` + `assets/runtime/index.html` |
| `window.FoundryNative` (files, calendar, location, battery) | `NativeBridge.kt`, `DeviceData.kt` |
| The widget, its pictures and taps | `FoundryWidgetProvider.kt`, `WidgetUpdater.kt`, `LinkActivity.kt` |
| Refresh schedule (15 minutes, charger, boot, clock, app open) | `Refresh.kt` |
| App screens: import, permissions, previews, Halcyon setup | `MainActivity.kt`, `HalcyonSettings.kt`, `Ui.kt` |
| Widget picker (theme, widget, size) | `WidgetConfigActivity.kt` |

- The runtime is copied from `runtime/foundry-runtime.js` into the app at build time; there is only one copy.
- Fonts come from pinned `@fontsource` packages: `python3 android/scripts/fetch_fonts.py` (from the repo root) refreshes
  `assets/runtime/fonts/` and the `@font-face` rules in `index.html`.

## Building
GitHub Actions builds it (`.github/workflows/android.yml`): Java 17, the Gradle wrapper (`./gradlew assembleDebug`),
unit tests and a lint report (printed in the log; it never fails the build). Debug builds are signed with the shared
test key `app/debug.keystore` (password `android`), which is not secret.

Versions: Android Gradle Plugin 9.4.1 (built-in Kotlin), Gradle 9.8.1, compile and target SDK 37, minimum SDK 26
(Android 8), WorkManager 2.12.0.
