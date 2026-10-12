# Foundry

Foundry is a free web app for theming an iPhone: four lock screens, a home wallpaper, eleven matching app icons and a set of live widgets, all in one style, with step-by-step install instructions.

**Open it:** https://lucidfuzz.github.io/foundry/ (on iPhone, tap Share, then Add to Home Screen to keep it like an app)

## Pre-fabricated themes

Foundry ships with **eleven pre-fabricated themes**. Each one is a complete, ready-to-install design: wallpapers, icons, widgets, an idle game, a joke "oddity" widget and its own in-world writing. Pick one and install it as is, or use it as a starting point. Every theme comes in five color variants and is fully editable: colors, fonts, headlines, slogans, icon frames and symbols, centerpiece size and position, texture, glow and fine print.

| Theme | The look | Idle game | Oddity |
|---|---|---|---|
| **Halcyon Biofab** | Technocratic biotech: a wireframe globe in mint and lavender | Specimen Vat | Mood Lease |
| **Directive Zero** | A defense-agency terminal: heavy serif, amber alerts, hex arrays | Shelter 9 | Operator Evaluation |
| **The Long Road** | A traveller's fantasy map in parchment and red ink | The Expedition | Road Omens |
| **Nightfall Descent** | First-person through a trooper's visor on a rainy night | Night Patrol | Hostile Intel |
| **Planar Grimoire** | An arcane card deck with gilt frames and a star sigil | The Apprentice | Spell of the Hour |
| **Deep Range** | A long-range tracking display, with six rotating home frames | Salvage Run | Signal Decoder |
| **White Rabbit** | A legion of gentleman thieves in pearl and lilac, with security lasers and calling cards | The Long Con | Heist Board |
| **Neon District** | Rain-slick cyberpunk: hot pink and cyan neon, holo-ads, glitch slices | Tower Run | Black Market |
| **Vapor Plaza** | Vaporwave mallsoft: a striped sunset, a neon grid, palms and a window from 1995 | Mall.exe | Mall Directory |
| **Wildwood** | A naturalist's field journal: botanical plates, ferns, mushrooms, birdsong | The Grove | Field Guide |
| **Long Odds** | An existential prediction market: a full trading terminal, fake breaking news, six rotating home frames | The Bankroll | Longshot Of The Hour |

## Widgets

Every theme exports one Scriptable script that holds all of its widgets, each drawn in that theme's own style. Add a Scriptable widget, choose the script, and type one of these in Parameter (add `:alt` or `:main` to flip the header color):

| Parameter | Widget | Best size | What it shows |
|---|---|---|---|
| `status` | Status | medium | Next calendar event, live weather, feels-like, high/low, battery, date |
| `shift` | Shift | small | Live countdown and progress for your current or next event |
| `transmission` | Transmission | any | 30+ in-world slogans per theme plus real quotes from public-domain works |
| `solar` | Solar + Atmos | large | Daylight left and a sunset countdown; large adds a full weather readout and rain chart |
| `audio` | Audio | medium | A styled launcher for your music app |
| `feeds` | Two channels | medium | YouTube and Instagram launchers side by side |
| `youtube` | YouTube | any | A YouTube launcher drawn as its own in-world object |
| `instagram` | Instagram | any | An Instagram launcher with its own design |
| `discord` | Discord | any | A Discord launcher shown as an in-world gathering (nothing is read from your account) |
| `game` | Idle game | medium or large | A little game that plays itself, one turn per refresh. Plugging your phone in is the only control |
| `oddity` | Oddity | small or medium | A useless, on-theme joke widget that changes about every 30 minutes |

Weather comes from Open-Meteo (no account needed). Nothing leaves your phone except the weather request.

## Suggestions and custom themes

**Ideas, bugs or suggestions:** email **lucidfuzz@gmail.com**.

**Want a theme made just for you?** Send your assets to **lucidfuzz@gmail.com** and we will work with you to create a widget script and asset pack just for you. Helpful things to include:

- A name and a few words about the vibe
- Reference images (screenshots, art, photos, a game or show you love). Large files are fine as a shared link
- Any colors or fonts you have in mind
- Which widgets you want most (weather, calendar, music, a game, something new)

## Halcyon Biofab development build

The approved Halcyon art system is integrated into wallpapers, icons and all widget sizes. See [Halcyon setup and validation notes](docs/HALCYON.md) for Allocation, Radio, the specimen game and the new Distant Care catalogue. Run `npm run build` after source changes, `npm test` for integration checks, and `npm start` for a local preview.

### Artwork credits

Real quotes in the Transmission widgets come only from public-domain works. All theme artwork and writing are original.
