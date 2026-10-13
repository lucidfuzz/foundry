# Deep Range Expanded / six home instruments

Design pass started 2026-10-13 from main `2699023dd426a45b2ab3d1578cb74df7ef21403b`,
then rebased onto main `f236ee04990594b1c0739f894da724812bdb69c3` after the Halcyon fixes.
Status: implemented for review; not yet approved or deployed.

The user is the unattended operator at RELAY 07. Each home is a different desk within
the same remote station. Its records are fictional, static wallpaper graphics, never
live navigation, radio measurements or device readings. The emotional register remains
terse, lonely and bureaucratic. All subjects already exist in the contact catalogue.

| Frame | Issuing desk / subject | Main visual family | Secondary records |
|---|---|---|---|
| 01 / Proximity acquisition | Range Control / DR-09 Dead Letter | Rectangular acquisition gates around a canonical hull return | Closure ladder, angular residuals, contact history |
| 02 / Surface survey | Deep Field Survey / K-17 Seam | Large fractured globe with measured surface sections | Fault atlas, sample strips, displaced meridians |
| 03 / Relay arbitration | Relay Ops / RELAY 07 | Asymmetric routed station topology | Adjacency matrix, queued packet ledger, retry record |
| 04 / Recovery rights | Search & Salvage / F-05 Remainder, SR-12 Wayfarer | Fragment field and projected recovery route | Salvage manifest, mass bins, disputed ownership |
| 05 / Multiple return | Signal Analysis / N-22 Choir | Dense spectral waterfall and separated impulse arrivals | Phase interference, lag channels, provenance warning |
| 06 / Sail transit | Flight Dynamics / SV-06 Quiet Sail | Large sail silhouette and parallel transit gates | Aperture mask, clearance comb, outbound checkpoints |

The frames share red/cobalt header roles, signal ink, thin instrument rules, small
registration details and a station footer. They do not share a central composition.
No raster artwork or 3D craft. The existing catalogue silhouette renderer supplies
ship identity. Each frame's primary artwork is confined to its own instrument area;
size and position controls operate inside that area and preserve its annotations.

Layout: protected icon band through y=150 in the 390-point reference coordinate system;
content begins no earlier than y=170. The whole instrument sheet scales vertically for
the available height and ends above both the iPhone dock and Android's lifted export band.
The bottom band remains plain. Fine information is subordinate to legible headings.

Scope: Expanded home wallpaper renderer only. Original edition, all lock screens,
widgets, icon art, headline pools and Android app branch remain outside this pass.
Case, detail, texture and glow settings apply to the homes. Unit selection changes the
fictional range labels between km and mi, without pretending to report real distances.

Cross-theme check: these are relay/salvage instruments native to Deep Range, not Halcyon
custodial biology or a generic telemetry skin applied to another theme. The six concepts
are different station views of existing world institutions, not new widget modes.

## Verification / 2026-10-13

- All 31 repository tests and the generated build check pass. Site remains about 1.25 MB;
  no embedded artwork, fonts, new dependencies or build-pipeline changes.
- Actual Canvas renders: all six frames in all five colorways (30), plus size/position
  extremes. The subject transform is bounded to protect complete silhouettes; the
  spectral waterfall remains a zoomable instrument window.
- Pixel comparison against the starting main: all 15 Expanded locks, all six Original
  homes and all 11 Deep Range icons unchanged. Widget source and runtime are unchanged;
  their existing behavior tests still pass.
- All six homes at 390x844, 1080x2400, 1080x2172 (Android shortened render), and 750x1334
  have blank icon/dock bands and no text extending beyond the canvas.
- Scale, position, texture, glow, details and case each alter every frame. Units alter
  the distance-bearing frames 01, 02, 04 and 06; network routing and echo records have
  no distance quantity to convert.
- Visually compared with the approved Deep Range widget sheet and original preview
  sheet. Reviewed all palette sheets and the individual full-resolution acquisition.
- These are local renderer checks, not physical-phone or Android APK verification.
  Awaiting Jordan's visual review; no deployment performed.
