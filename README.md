# Foundry

Design a whole phone theme (lock screens, a home wallpaper, icons and live widgets), then install it step by step.

**Open it:** https://lucidfuzz.github.io/foundry/ — on iPhone, tap Share, then Add to Home Screen to keep it like an app.

## Themes

Seven reference themes, each with five color variants and full customization (colors, fonts, headlines, slogans, icon frames and symbols, centerpiece size and position, texture, glow, fine print):

- **Halcyon Biofab** — technocratic biotech, wireframe globe, mint and lavender.
- **Directive Zero** — defense-agency terminal, heavy serif, amber alerts and hex arrays.
- **The Long Road** — a traveller's fantasy map in parchment and red ink.
- **Nightfall Descent** — first-person through a trooper's visor on a rainy night.
- **Planar Grimoire** — an arcane card deck with gilt frames and a star sigil.
- **Deep Range** — a long-range tracking display with an urgent close-up home screen and six rotating home frames.
- **White Rabbit** — soft recon techwear in lilac haze and pearl white, with magenta sparkles, a leaping rabbit and a pocket watch.

## Widgets

Every theme exports one Scriptable script that holds all of its widgets, drawn in that theme's own style, plus eleven matching app icons. Add a Scriptable widget, choose the script, and type one of these in Parameter (add `:alt` or `:main` to flip the header color):

| Parameter | Widget | Best size | What it shows |
|---|---|---|---|
| `status` | Status | medium | Next calendar event, live weather, feels-like, high/low, battery, date |
| `shift` | Shift | small | Live countdown and progress for your current or next event |
| `transmission` | Transmission | any | In-world slogans and public-domain quotes over a themed graphic |
| `solar` | Solar + Atmos | large | Daylight left, sunset countdown, sun arc; large adds temperature, humidity, UV, visibility, dew point, wind, rain chart |
| `audio` | Audio | medium | A styled launcher for your music app |
| `feeds` | Neural Link | medium | YouTube and Instagram launchers with joke brain-chemistry meters |
| `youtube` | YouTube | any | A YouTube launcher drawn as its own in-world object |
| `instagram` | Instagram | any | An Instagram launcher with its own gallery design |
| `discord` | Discord | any | A Discord launcher shown as an in-world gathering (nothing is read from your account) |
| `oddity` | Theme oddity | small or medium | A useless, on-theme joke widget that changes about every 30 minutes |

**Oddities by theme:** Mood Lease (Halcyon), Operator Evaluation (Directive Zero), Road Omens (The Long Road), Hostile Intel (Nightfall), Spell of the Hour (Grimoire), Signal Decoder (Deep Range), Late Notice (White Rabbit).

Weather comes from Open-Meteo (no account needed). Nothing leaves your phone except the weather request.
