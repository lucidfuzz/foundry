// The theme kit: Navie's own themes, each one plain data in nav/src/themes/*.js (navTheme({...})), turned here into the same
// three things a Foundry world has: a theme (NAV_THEMES), a map treatment (NAV_WORLDS) and a guide (NAV_VOICES).
// The picker filters every theme, Foundry worlds included, by who it suits (ages) and its style (vibes).
const NAV_AGES = { kids: 'Kids', teens: 'Teens', adults: 'Adults', clear: 'Easy to read' };
const NAV_VIBES = {
  cute: 'Cute', pastel: 'Pastel', bright: 'Bright', dark: 'Dark', retro: 'Retro', nature: 'Nature', fantasy: 'Fantasy',
  scifi: 'Sci-fi', minimal: 'Minimal', luxe: 'Luxe', cozy: 'Cozy', spooky: 'Spooky', playful: 'Playful', calm: 'Calm'
};
// Panel frames a theme can pick (CSS in page.html: [data-frame=...]).
const NAV_FRAMES = ['rounded', 'square', 'pill', 'bubble', 'sticker', 'double', 'bevel', 'neon', 'notch', 'ticket', 'tape', 'stitch', 'deco', 'chalk', 'clear'];
const NAV_ROUTE_STYLES = ['outlined', 'glow', 'dashed', 'solid'];
// Where the Foundry worlds sit in the picker.
const NAV_FOUNDRY_TAGS = {
  halcyon: { ages: ['teens', 'adults'], vibes: ['scifi', 'pastel'] }, directive: { ages: ['teens', 'adults'], vibes: ['dark', 'scifi'] },
  longroad: { ages: ['teens', 'adults'], vibes: ['fantasy', 'cozy'] }, nightfall: { ages: ['teens', 'adults'], vibes: ['dark', 'scifi'] },
  grimoire: { ages: ['teens', 'adults'], vibes: ['fantasy', 'dark'] }, deeprange: { ages: ['teens', 'adults'], vibes: ['dark', 'scifi'] },
  rabbit: { ages: ['teens', 'adults'], vibes: ['luxe', 'pastel'] }, neon: { ages: ['teens', 'adults'], vibes: ['dark', 'scifi', 'bright'] },
  vapor: { ages: ['teens', 'adults'], vibes: ['retro', 'pastel'] }, wild: { ages: ['kids', 'teens', 'adults'], vibes: ['nature', 'calm'] },
  odds: { ages: ['adults'], vibes: ['dark', 'retro'] }
};
for (const t of NAV_THEMES) Object.assign(t, { own: false }, NAV_FOUNDRY_TAGS[t.id] || { ages: ['adults'], vibes: [] });

// One theme = one call. Every color role can change per colorway; see docs/NAV_SPEC.md ("Adding a Navie theme").
//   colors: ground (land), ink (text), accent (route), panel, glow, alert, water, park, roads, highway (optional)
//   map: { texture, textureAlpha, textureRole, waterTexture, marker, route, routeWidth, labels, upper, buildings, labelSize }
//   frame, scale (screen text size, 1 = normal), voice { speaker, channel, rate, pitch, L, depart, arrive, reroute, cruise,
//   tags }, arrivals: [[line, line], ...] for the arrival card.
function navTheme(spec) {
  const m = spec.map || {}, f = spec.fonts;
  NAV_WORLDS[spec.id] = {
    texture: m.texture || 'none', textureColor: c => c[m.textureRole || 'ink'], textureAlpha: m.textureAlpha == null ? 0.07 : m.textureAlpha,
    waterTexture: m.waterTexture, marker: m.marker, markerColor: m.markerRole ? c => c[m.markerRole] : null,
    labels: { font: m.labels || 'Regular', upper: !!m.upper, spacing: m.upper ? 0.08 : 0, size: m.labelSize || 1 },
    land: c => c.ground, water: c => c.water, park: c => c.park, wood: c => navMix(c.park, c.ink, 0.08),
    roads: c => {
      const light = navLum(c.roads) > navLum(c.ground);
      return { minor: navMix(c.ground, c.roads, 0.72), major: c.roads, motorway: c.highway || navMix(c.roads, c.accent, 0.35), casing: light ? navMix(c.ground, c.ink, 0.2) : null, blur: m.roadGlow ? 1 : 0 };
    },
    buildings: m.buildings || 'fill',
    route: c => ({ line: c.accent, casing: m.route === 'outlined' ? c.ink : m.route === 'dashed' ? c.panel : null, dash: m.route === 'dashed' ? [1.6, 0.9] : null, glow: m.route === 'glow' ? 8 : 0, width: m.routeWidth || 1 })
  };
  NAV_VOICES[spec.id] = Object.assign({ rate: 1, pitch: 1 }, spec.voice);
  NAV_THEMES.push({
    id: spec.id, title: spec.title, blurb: spec.blurb, company: spec.title, upper: !!spec.upper, own: true,
    ages: spec.ages, vibes: spec.vibes, frame: spec.frame || 'rounded', scale: spec.scale || 1,
    colors: spec.colors, fonts: { display: f.display, mono: f.mono }, displayWeight: f.weight || 400, fontQuery: `${f.query}&display=swap`,
    phrases: spec.arrivals, slogans: [], editions: [],
    colorways: [{ name: spec.colorName || 'Original', colors: {} }].concat(spec.colorways || [])
  });
}
