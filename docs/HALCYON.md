# Halcyon Biofab integration

The approved organ and tissue artwork ships with Foundry. Live text, charts, calendar timers and app links are rendered separately. Browser previews and Scriptable share the renderer at 170×170, 364×170 and 364×382 points. The current clinical compositions are in `src/halcyon/clinical.js`, loaded after the underlying helpers in `paint.js` and `fidelity.js`.

## Try the build

Open `index.html` in a browser, or run `npm start` and open http://127.0.0.1:4173. Choose Halcyon Biofab. In Widgets → Full size, choose Small, Medium or Large. Browser readings are explicitly sample data; actual calendar, weather and battery readings are obtained by the exported script on iPhone.

Download the theme pack using Foundry's existing download controls. It includes wallpapers, icons, the Scriptable script and installation instructions. All Halcyon artwork is embedded in the page and exported script; widget art needs no external asset host. Initial browser font loading and JSZip still use the existing external services.

## Install on iPhone

1. Install Scriptable, create a script, and paste the exported script. Keep its name stable: Halcyon settings are stored per script name.
2. Run it once. Choose `allocation_setup` and select the event/calendar to follow. This is a read-only calendar operation. Matching uses the exact event title and calendar, explicitly disclosed in the chooser; same-title appointments on that calendar are treated as the same allocation. Rename or delete an event and reconfigure if needed. The next 90 days are searched; no recurrence is invented beyond that window.
3. Optionally choose `radio_setup` to set the app or stream opened by Audio Channel. The corporate radio schedule is fictional; this feature does not provide an audio streaming service.
4. Add Scriptable widgets in any supported size. Select the script and use one of these parameters: `status`, `shift` (or `allocation`), `transmission`, `solar`, `audio`, `feeds`, `youtube`, `instagram`, `discord`, `oddity`, `game`, `tracker`, `dossier`.
5. Leave the default interaction setting so the script supplies its links. Medium/large Neural Link has separate left/right YouTube/Instagram targets; the small widget opens YouTube.

Allocation counts down to the selected occurrence, counts up from its scheduled start while active, then counts down to the next matching occurrence. It is calendar time, not a physical attendance detector. iOS controls widget refresh scheduling, so phase labels can lag at event boundaries even though the native timer keeps running.

The specimen retains `foundry-game-halcyon.json`. Charging feeds it and advances a separate growth counter; battery, time of day and calendar load affect health. Growth milestones require charging and adequate vitality. It advances at most one care turn per refresh, with a minimum fifteen-minute interval. Unobserved charging history is never backfilled. Existing saves preserve age, stage, traits and history; a missing growth counter starts at saved age. Recycling resets growth. This is an idle widget, not a continuous background charging monitor.

Transmission retains Foundry's archive and corporate quote pools, with separate attribution. Mood Lease and provisional celestial objects are fiction. Distant Observation and Target Dossier share a 36-entry vector catalogue: six known planets plus thirty invented vessels, structures, organisms and anomalies. The tracker shows a fictional location array; place a dossier below it for the selected object’s scan and record. Both derive selection from the same half-hour slot and request the next boundary. iOS may cache them independently: compare scan IDs when one lags. All positions are simulated, including known planets. Weather comes from Open-Meteo and missing readings show unavailable states.

## Development

- `npm run build`: regenerate the standalone `index.html` from the page shell, theme data, browser source, Scriptable template, Halcyon modules and assets.
- `npm test`: test allocation boundaries, overnight/DST schedules, unavailable data, all 39 exported Halcyon widget combinations using Scriptable API doubles, saved game continuity and link configuration; verify the generated page is current.
- `src/app.js` was reconciled with the already-published page before this change. It now retains the published native browser download/share behavior rather than the stale Claude-only save adapter.
- Files in `src/paint/` are legacy source fragments. The current build uses `src/render.js` and `src/tpl.js`, which already contain the active paint code. Edit the Halcyon modules directly and rebuild.

## Current clinical revision

The user's Claude phone screenshots establish the widget language: solid evergreen or lilac header bands, mint instrument paper, compact labels, measured specimen fields, serials, segmented meters and bureaucratic ownership language. The detailed organ assets remain, framed as company equipment. Large welcoming campaign slogans no longer dominate the widgets. Small layouts retain the same header, typography and hierarchy while omitting secondary fields; they are composed independently rather than scaled down.

All thirteen modes and all three sizes use this system, including medium weather. Radio retains its abstract growth mark and approved-programming theme. Transmission retains author attribution and a fine helix. Intake graphs vary by function: neural trace, broadcast interference, peer distribution and collective links. These graphs and affect credits are explicitly fictional or illustrative. Real calendar, battery and weather values remain distinct and use unavailable states when absent. The specimen uses its existing saved history and simulation. Lock screens and home screens are outside this revision.

## Earlier fidelity work

The immersion pass fills the remaining usable gaps with diegetic corporate records: hex routing IDs, custody ledgers, patterned bars, filing rails, scan ticks and department-specific absurd metrics. These are decorative fiction, seeded per refresh; they do not represent real surveillance, health measurements or new device integrations. The renderer reserves primary text, charts, specimen fields and native timer geometry before placing these records. The texture stays consistent across sizes without scaling down the functional readings.

The instrument-variety revision follows the Claude phone references more closely: diagrams have distinct departmental roles. Twelve miniature instrument families replace the repeated barcode/ledger pattern: retention trends, scatter plots, routing networks, signal matrices, phase plots, interval queues, scopes, orbital diagrams, ledgers, tissue contours, logic gates and envelopes. Each widget uses a different ordering before repeating a family. Compact file codes fill narrower gaps. Large weather restores a solar arc driven by the existing daylight state; large Specimen Vat restores a stage path and separate saved vitality/stress traces. Radio gains tuning ticks, Transmission checksum/encryption fields, and the intake widgets show distinct fictional attention, validation, quarantine and consensus readouts. These fictional values remain decorative; no new data collection is introduced.

The medium Personal Climate fidelity revision has a dedicated detailed respiratory cartridge, larger editorial temperature, daylight percentage and sun/moon indicator, humidity/wind/UV instruments, and a gridded twelve-hour precipitation chart. Its suggested preview size is medium. All readings remain backed by weather data; missing values remain unavailable. Daylight percentage is remaining daylight divided by that day's sunrise-to-sunset interval. Nighttime counts toward the next sunrise. Displayed duration is a refresh-time snapshot. The tiny batch/respiratory labels are fictional brand decoration.

The subsequent full fidelity pass extends the detailed art and instrument treatment to all twelve widgets in all three sizes. Each size is independently composed in src/halcyon/fidelity.js; the approved medium Climate layout remains in paint.js. At that earlier stage, Subject Status and mature Specimen Vat shared a cardiac cartridge; the living-systems revision below supersedes that reuse. Respiratory artwork is used at all Climate sizes. Culture, archive, neural, collective, signal and celestial illustrations are embedded as production assets. Small layouts prioritize the reading/action, medium layouts balance instruments with art, and large layouts add contextual fields.

Allocation's native timer uses the same layout geometry as its preview; countdown, elapsed time, next matching event and calendar-error handling are retained. Radio remains a launcher with fictional regulated programming. Neural Link buttons correspond to the two tappable halves of medium and large widgets. Quote attribution stays attached to its source at every size. Specimen thumbnails, meters, traits and history use the same persisted game state. Forecasts never substitute invented readings for missing weather.

## Validation limits

All 39 current clinical compositions were rendered with the shared Canvas renderer and original web typefaces. Additional checks covered long events, long archive quotes, corporate quotes, active and unavailable allocations, missing weather, nighttime, newborn specimen extremes and a dark radio surface. Scriptable uses its existing iOS serif/monospace equivalents; device typography still needs verification. Tests check drawing bounds, consistent headers, native timer placement, calendar transitions, missing weather, saved specimen continuity, links and Deep Range regressions.

The shared renderer was executed and its layouts visually inspected using a native Canvas adapter. Other theme exports were compiled, and their renderer kits initialized. Local browser connection attempts timed out in the implementation environment, so browser interactions were not verified end to end. No physical iPhone was available; Scriptable API tests are doubles, not device certification. Check font substitution, memory use, tap targets, permissions and iOS refresh timing on a device before release.

Reference APIs: https://docs.scriptable.app/calendarevent/ and https://docs.scriptable.app/widgetdate/.

Generated art provenance and production prompts are recorded in `assets/halcyon/PROVENANCE.txt`.

## Living systems and exclusive artwork

`src/halcyon/living.js` owns the current specimen tube renderer, observation catalogue, map, dossier and widget asset ownership table. The original Claude abstract organism has five forms: seed nucleus, helical strand, membrane lattice, radial bloom and lattice sphere. Traits modify the structure. Heart artwork belongs only to Subject Status; lung artwork only to Climate. Neural, optical, archive, collective and signal assets each have their own widget. Specimen, tracker and dossier draw native vectors and load no raster subjects. Small/medium/large versions within one widget retain its subject. Deferred wallpapers are outside this ownership rule.

Validation adds growth gating, old-save migration, recycling, one-tick refresh sampling, exclusive asset keys, unique catalogue IDs, wrapping and matching scan selection. The review includes all 36 map/dossier pairs and all five specimen stages in charging/resting states. Browser interaction was checked with DOM doubles; automated local-file browser access was blocked by browser URL policy. Native Canvas renders and Scriptable API doubles do not replace device testing.

### Observation color and detail pass

The map/dossier pair follows the Claude reference’s lilac headers, evergreen field, mint tracks and ice-cyan returns. Three palette assignments vary by catalogue subject and repeat coherently between map and dossier. These are false-color scans, not natural-color planet depictions. Maps add shaded search sectors, contact trails, projected acquisition gates, azimuth graduations, plotted paths, a lilac horizon mesh and signal packets. Vector dossiers add filled hulls and panels, atmospheric bands and craters, colored membrane structures, measuring rails and spectral returns. Corporate readouts and all coordinates remain fiction. Selection, charging gameplay, saved state and unrelated widget artwork are unchanged.
