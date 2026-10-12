# Halcyon Biofab integration

The approved organ and tissue artwork now ships with Foundry. Live text, charts, calendar timers and app links are rendered separately. Browser previews and Scriptable use the same `src/halcyon/paint.js` renderer at 170×170, 364×170 and 364×382 points.

## Try the build

Open `index.html` in a browser, or run `npm start` and open http://127.0.0.1:4173. Choose Halcyon Biofab. In Widgets → Full size, choose Small, Medium or Large. Browser readings are explicitly sample data; actual calendar, weather and battery readings are obtained by the exported script on iPhone.

Download the theme pack using Foundry's existing download controls. It includes wallpapers, icons, the Scriptable script and installation instructions. Artwork is served as separate files from `assets/halcyon/` rather than embedded, so the page stays about 1 MB however many themes get artwork. The site loads small thumbnails first and the full-resolution art only when Halcyon is open; exports wait for the full art. The exported script carries art addresses, not art: the first time a widget needs a picture it downloads that crop from the Foundry site and keeps it in Scriptable's local documents (`foundry-art` folder). Changed art has a new version tag and downloads once. Without a connection on first run, the widget draws without the art and picks it up on a later refresh. Initial browser font loading and JSZip still use the existing external services.

## Install on iPhone

1. Install Scriptable, create a script, and paste the exported script. Keep its name stable: Halcyon settings are stored per script name.
2. Run it once. Choose `allocation_setup` and select the event/calendar to follow. This is a read-only calendar operation. Matching uses the exact event title and calendar, explicitly disclosed in the chooser; same-title appointments on that calendar are treated as the same allocation. Rename or delete an event and reconfigure if needed. The next 90 days are searched; no recurrence is invented beyond that window.
3. Optionally choose `radio_setup` to set the app or stream opened by Audio Channel. The corporate radio schedule is fictional; this feature does not provide an audio streaming service.
4. Add Scriptable widgets in any supported size. Select the script and use one of these parameters: `status`, `shift` (or `allocation`), `transmission`, `solar`, `audio`, `feeds`, `youtube`, `instagram`, `discord`, `oddity`, `game`, `tracker`.
5. Leave the default interaction setting so the script supplies its links. Medium/large Neural Link has separate left/right YouTube/Instagram targets; the small widget opens YouTube.

Allocation counts down to the selected occurrence, counts up from its scheduled start while active, then counts down to the next matching occurrence. It is calendar time, not a physical attendance detector. iOS controls widget refresh scheduling, so phase labels can lag at event boundaries even though the native timer keeps running.

The specimen retains the existing `foundry-game-halcyon.json` save and simulation rules. Charging, battery, time of day and calendar load still affect growth. It is an idle game that advances when Scriptable refreshes, not a continuously running process. Existing saves are not reset.

Transmission retains Foundry's archive and corporate quote pools, with separate attribution. Mood Lease and provisional celestial objects are fiction. Distant Care rotates illustrated Saturn, Neptune and Jupiter alongside invented abstract objects; it does not claim live telescope imagery or orbital telemetry. Weather comes from Open-Meteo and missing readings show unavailable states.

## Development

- `npm run build` (`node scripts/build.cjs`): join `src/paint/*.js` into the paint block of `src/tpl.js`, splice in the Halcyon modules, and regenerate the standalone `index.html` from the page shell, theme data, art manifest and browser source. Artwork is not embedded.
- `npm run art` (`python3 scripts/art.py`, needs Pillow): after adding or changing artwork, regenerate the served copies (`web/` WebP, `thumb/` WebP, `widget/` PNG crops up to 480 px) and `src/art-manifest.js`. Originals in `assets/<theme>/` are never modified.
- `npm test`: test allocation boundaries, overnight/DST schedules, unavailable data, all 36 exported widget combinations using Scriptable API doubles, saved game continuity and link configuration; verify the generated page is current.
- `src/app.js` was reconciled with the already-published page before this change. It now retains the published native browser download/share behavior rather than the stale Claude-only save adapter.
- `src/paint/` is the source for every other theme's widget art; the build copies it into `src/tpl.js` (`--check` fails if they drift). Edit the Halcyon modules in `src/halcyon/` directly and rebuild.
- Text never ends in an ellipsis: Halcyon's label helper shrinks a string that would not fit, and titles shrink within their slot before wrapping. Strings that already fit render exactly as designed.

## Validation limits

The medium Personal Climate fidelity revision has a dedicated detailed respiratory cartridge, larger editorial temperature, daylight percentage and sun/moon indicator, humidity/wind/UV instruments, and a gridded twelve-hour precipitation chart. Its suggested preview size is medium. All readings remain backed by weather data; missing values remain unavailable. Daylight percentage is remaining daylight divided by that day's sunrise-to-sunset interval. Nighttime counts toward the next sunrise. Displayed duration is a refresh-time snapshot. The tiny batch/respiratory labels are fictional brand decoration.

The subsequent full fidelity pass extends the detailed art and instrument treatment to all twelve widgets in all three sizes. Each size is independently composed in src/halcyon/fidelity.js; the approved medium Climate layout remains in paint.js. A dedicated cardiac cartridge is shared by Subject Status and the mature Specimen Vat. Respiratory artwork is used at all Climate sizes. Culture, archive, neural, collective, signal and celestial illustrations are embedded as production assets. Small layouts prioritize the reading/action, medium layouts balance instruments with art, and large layouts add contextual fields.

Allocation's native timer uses the same layout geometry as its preview; countdown, elapsed time, next matching event and calendar-error handling are retained. Radio remains a launcher with fictional regulated programming. Neural Link buttons correspond to the two tappable halves of medium and large widgets. Quote attribution stays attached to its source at every size. Specimen thumbnails, meters, traits and history use the same persisted game state. Forecasts never substitute invented readings for missing weather.

All 36 compositions were rendered with the shared Canvas renderer and original web typefaces. Additional checks covered long events, long archive quotes, corporate quotes, active and unavailable allocations, missing weather, nighttime, newborn specimen extremes and a dark radio surface. Scriptable uses its existing iOS serif/monospace equivalents, plus Georgia Bold Italic for medium temperature; device typography still needs verification.

The shared renderer was executed and its 36 layouts visually inspected using a native Canvas adapter. Other theme exports were compiled, and their renderer kits initialized. Local browser connection attempts timed out in the implementation environment, so browser interactions were not verified end to end. No physical iPhone was available; Scriptable API tests are doubles, not device certification. Check font substitution, memory use, tap targets, permissions and iOS refresh timing on a device before release.

Reference APIs: https://docs.scriptable.app/calendarevent/ and https://docs.scriptable.app/widgetdate/.

Generated art provenance and production prompts are recorded in `assets/halcyon/PROVENANCE.txt`.
