// How each world draws the map. Colors come from the theme and colorway (src/foundry-data.js); this file only says which
// palette role goes where, plus each world's own texture, road drawing, route line and position marker. Every world owns
// its texture and marker (no two share one), so a screenshot tells you the world even in grey.
// Mixes are navMix(a, b, t): t of the way from a to b. A tint like '#6E8FA0' is a world's own ink, blended into its palette.
const NAV_WORLDS = {
  halcyon: {
    texture: 'dots', textureColor: c => c.ink, textureAlpha: 0.07, marker: 'ring', labels: { font: 'Regular' },
    land: c => navMix(c.ground, c.panel, 0.55), water: c => navMix(c.accent, c.panel, 0.6), park: c => navMix(c.ground, c.ink, 0.07), wood: c => navMix(c.ground, c.ink, 0.12),
    roads: c => ({ minor: navMix(c.panel, '#FFFFFF', 0.6), major: '#FFFFFF', motorway: navMix(c.accent, '#FFFFFF', 0.55), casing: navMix(c.ground, c.ink, 0.22) }),
    buildings: 'fill', route: c => ({ line: c.accent, casing: c.ink })
  },
  directive: {
    texture: 'scan', textureColor: c => c.ink, textureAlpha: 0.05, marker: 'hex', labels: { font: 'Bold', upper: true, spacing: 0.12 },
    land: c => c.ground, water: c => navMix(c.ground, c.ink, 0.09), park: c => navMix(c.ground, c.glow, 0.1), wood: c => navMix(c.ground, c.glow, 0.14),
    roads: c => ({ minor: navMix(c.ground, c.ink, 0.2), major: navMix(c.ground, c.ink, 0.38), motorway: navMix(c.ground, c.accent, 0.55) }),
    buildings: 'outline', route: c => ({ line: c.accent, glow: 6 })
  },
  longroad: {
    texture: 'paper', textureColor: c => c.ink, textureAlpha: 0.06, waterTexture: 'hatch', marker: 'compass', labels: { font: 'Italic' },
    land: c => c.ground, water: c => navMix(c.ground, '#6E8FA0', 0.42), park: c => navMix(c.ground, '#7C8F4E', 0.18), wood: c => navMix(c.ground, '#5F7444', 0.28),
    roads: c => ({ minor: navMix(c.ground, c.ink, 0.32), major: navMix(c.ground, c.ink, 0.62), motorway: navMix(c.ground, c.ink, 0.8) }),
    buildings: 'fill', route: c => ({ line: c.accent, dash: [1.6, 0.9], casing: navMix(c.ground, '#FFFFFF', 0.4) })
  },
  nightfall: {
    texture: 'rain', textureColor: c => c.glow, textureAlpha: 0.09, marker: 'chevron', labels: { font: 'Bold', upper: true, spacing: 0.1 },
    land: c => c.ground, water: c => navMix(c.ground, c.glow, 0.2), park: c => navMix(c.ground, c.ink, 0.06), wood: c => navMix(c.ground, c.ink, 0.09),
    roads: c => ({ minor: navMix(c.ground, c.ink, 0.22), major: navMix(c.ground, c.ink, 0.5), motorway: navMix(c.ground, c.ink, 0.75), blur: 0.6 }),
    buildings: 'outline', route: c => ({ line: c.accent, glow: 8 })
  },
  grimoire: {
    texture: 'stars', textureColor: c => c.ink, textureAlpha: 0.16, marker: 'star', labels: { font: 'Italic' },
    land: c => c.ground, water: c => navMix(c.ground, c.glow, 0.3), park: c => navMix(c.ground, c.glow, 0.12), wood: c => navMix(c.ground, c.glow, 0.18),
    roads: c => ({ minor: navMix(c.ground, c.ink, 0.2), major: navMix(c.ground, c.ink, 0.38), motorway: navMix(c.ground, c.accent, 0.5) }),
    buildings: 'fill', route: c => ({ line: c.accent, glow: 10, width: 1.2 })
  },
  deeprange: {
    texture: 'grid', textureColor: c => c.ink, textureAlpha: 0.07, marker: 'bracket', labels: { font: 'Regular', upper: true, spacing: 0.18 },
    land: c => c.ground, water: c => navMix(c.ground, c.glow, 0.28), park: c => navMix(c.ground, '#A7B0C0', 0.05), wood: c => navMix(c.ground, '#A7B0C0', 0.08),
    roads: c => ({ minor: navMix(c.ground, '#A7B0C0', 0.16), major: navMix(c.ground, '#A7B0C0', 0.32), motorway: navMix(c.ground, '#A7B0C0', 0.5) }),
    buildings: 'none', route: c => ({ line: c.ink, glow: 6 }), markerColor: c => c.accent
  },
  rabbit: {
    texture: 'lattice', textureColor: c => c.accent, textureAlpha: 0.06, marker: 'diamond', labels: { font: 'Regular' },
    land: c => navMix(c.ground, c.panel, 0.4), water: c => navMix(c.glow, c.panel, 0.45), park: c => navMix(c.ground, c.glow, 0.22), wood: c => navMix(c.ground, c.glow, 0.32),
    roads: c => ({ minor: navMix(c.panel, '#FFFFFF', 0.6), major: '#FFFFFF', motorway: navMix(c.glow, '#FFFFFF', 0.4), casing: navMix(c.ground, c.ink, 0.16) }),
    buildings: 'fill', route: c => ({ line: c.accent, casing: c.ink })
  },
  neon: {
    texture: 'glitch', textureColor: c => c.glow, textureAlpha: 0.12, marker: 'boost', labels: { font: 'Bold', upper: true, spacing: 0.14 },
    land: c => c.ground, water: c => navMix(c.ground, c.glow, 0.16), park: c => navMix(c.ground, c.accent, 0.06), wood: c => navMix(c.ground, c.accent, 0.09),
    roads: c => ({ minor: navMix(c.ground, c.glow, 0.28), major: navMix(c.ground, c.glow, 0.55), motorway: c.glow, blur: 1.2 }),
    buildings: 'outline', buildingColor: c => navMix(c.ground, c.accent, 0.3), route: c => ({ line: c.accent, glow: 12 })
  },
  vapor: {
    texture: 'checker', textureColor: c => c.ink, textureAlpha: 0.05, marker: 'cursor', labels: { font: 'Regular' },
    land: c => c.ground, water: c => navMix(c.ground, c.glow, 0.38), park: c => navMix(c.ground, c.glow, 0.14), wood: c => navMix(c.ground, c.glow, 0.2),
    roads: c => ({ minor: navMix(c.ground, c.accent, 0.3), major: navMix(c.ground, c.accent, 0.62), motorway: navMix(c.ground, c.glow, 0.7) }),
    buildings: 'fill', route: c => ({ line: c.alert || c.ink, casing: c.accent })
  },
  wild: {
    texture: 'stipple', textureColor: c => c.ink, textureAlpha: 0.08, marker: 'leaf', labels: { font: 'Regular' },
    land: c => navMix(c.ground, c.panel, 0.3), water: c => navMix(c.ground, '#5E98B0', 0.5), park: c => navMix(c.ground, c.glow, 0.3), wood: c => navMix(c.ground, c.glow, 0.46),
    roads: c => ({ minor: navMix(c.panel, '#FFFFFF', 0.5), major: '#FFFFFF', motorway: navMix(c.alert || c.accent, '#FFFFFF', 0.5), casing: navMix(c.ground, c.ink, 0.2) }),
    buildings: 'fill', route: c => ({ line: c.accent, casing: c.ink })
  },
  odds: {
    texture: 'candles', textureColor: c => c.glow, textureAlpha: 0.07, marker: 'candle', labels: { font: 'Regular', upper: true, spacing: 0.08 },
    land: c => c.ground, water: c => navMix(c.ground, c.accent, 0.2), park: c => navMix(c.ground, c.glow, 0.07), wood: c => navMix(c.ground, c.glow, 0.1),
    roads: c => ({ minor: navMix(c.ground, c.ink, 0.17), major: navMix(c.ground, c.accent, 0.45), motorway: navMix(c.ground, c.accent, 0.75) }),
    buildings: 'outline', route: c => ({ line: c.glow, glow: 8 })
  }
};

// Position markers, drawn in a 48x48 box pointing up (north) before rotation. fill = marker color, ink = outline.
const NAV_MARKERS = {
  ring: (f, k) => `<circle cx="24" cy="24" r="10" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 2v9M24 37v9M2 24h9M37 24h9" stroke="${k}" stroke-width="3"/><path d="M24 6l5 7h-10z" fill="${k}"/>`,
  hex: (f, k) => `<path d="M24 6l15 9v18l-15 9-15-9V15z" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 13l7 14h-14z" fill="${k}"/>`,
  compass: (f, k) => `<path d="M24 2l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="${k}"/><path d="M24 2l6 16h-12z" fill="${f}"/><circle cx="24" cy="24" r="4" fill="${f}"/>`,
  chevron: (f, k) => `<path d="M24 4l16 36-16-9-16 9z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/>`,
  star: (f, k) => `<path d="M24 2l4 13 13-6-6 13 13 4-13 4 6 13-13-6-4 13-4-13-13 6 6-13-13-4 13-4-6-13 13 6z" fill="${f}" stroke="${k}" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="24" r="4" fill="${k}"/>`,
  bracket: (f, k) => `<path d="M8 16V8h8M32 8h8v8M40 32v8h-8M16 40H8v-8" fill="none" stroke="${f}" stroke-width="4"/><path d="M24 12l7 18-7-4-7 4z" fill="${f}" stroke="${k}" stroke-width="2"/>`,
  diamond: (f, k) => `<path d="M24 3l15 21-15 21L9 24z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M24 3l6 21-6 21-6-21z" fill="${k}" opacity=".35"/>`,
  boost: (f, k) => `<path d="M24 3l15 18h-9l9 11h-9l-6-7-6 7H9l9-11H9z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  cursor: (f, k) => `<path d="M14 4v34l9-8 6 14 6-3-6-13h12z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/>`,
  leaf: (f, k) => `<path d="M24 3c11 9 14 20 10 30-3 7-7 11-10 12-3-1-7-5-10-12-4-10-1-21 10-30z" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 12v30" stroke="${k}" stroke-width="2.5"/>`,
  candle: (f, k) => `<path d="M24 2v8M24 38v8" stroke="${k}" stroke-width="3"/><rect x="15" y="10" width="18" height="28" rx="2" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 15l5 9h-10z" fill="${k}"/>`
};

// Textures as tiny transparent tiles (RGBA pixels), drawn under everything. 32 px at pixel ratio 2.
function navTexture(kind, hex, alpha) {
  const S = 32, px = new Uint8Array(S * S * 4), [r, g, b] = navRgb(hex), A = Math.round(255 * alpha);
  const put = (x, y, a = 1) => { x = ((x % S) + S) % S; y = ((y % S) + S) % S; const i = (y * S + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = Math.max(px[i + 3], Math.round(A * a)); };
  let s = 9; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  switch (kind) {
    case 'dots': for (const [x, y] of [[8, 8], [24, 24]]) for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) put(x + dx, y + dy, dx && dy ? 0.5 : 1); break;
    case 'scan': for (let y = 0; y < S; y += 4) for (let x = 0; x < S; x++) put(x, y); break;
    case 'paper': for (let i = 0; i < 40; i++) put(Math.floor(rnd() * S), Math.floor(rnd() * S), 0.4 + rnd() * 0.6); break;
    case 'hatch': for (let i = 0; i < S; i++) { put(i, i); put(i, i + 16); } break;
    case 'rain': for (const [x0, y0] of [[3, 2], [19, 9], [11, 20], [27, 25]]) for (let k = 0; k < 7; k++) put(x0 + Math.floor(k / 3), y0 + k, 1 - k / 9); break;
    case 'stars': for (let i = 0; i < 6; i++) { const x = Math.floor(rnd() * S), y = Math.floor(rnd() * S), big = i % 3 === 0; put(x, y); if (big) { put(x + 1, y, 0.6); put(x - 1, y, 0.6); put(x, y + 1, 0.6); put(x, y - 1, 0.6); } } break;
    case 'grid': for (let i = 0; i < S; i++) { put(i, 0); put(0, i); } for (let i = 0; i < S; i += 2) { put(i, 16, 0.5); put(16, i, 0.5); } break;
    case 'lattice': for (let i = 0; i < S; i++) { put(i, i, 0.8); put(S - 1 - i, i, 0.8); } break;
    case 'glitch': for (const [x0, y0, w] of [[2, 5, 9], [18, 13, 5], [7, 22, 12], [24, 29, 6]]) for (let x = 0; x < w; x++) put(x0 + x, y0); break;
    case 'checker': for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if ((x < 16) !== (y < 16)) put(x, y); break;
    case 'stipple': for (let i = 0; i < 22; i++) put(Math.floor(rnd() * S), Math.floor(rnd() * S), 0.5 + rnd() * 0.5); break;
    case 'candles': for (const [x, y0, h] of [[4, 10, 12], [12, 6, 16], [20, 14, 9], [28, 4, 14]]) { for (let y = 0; y < h; y++) { put(x, y0 + y); put(x + 1, y0 + y); } put(x, y0 - 2, 0.6); put(x, y0 + h + 1, 0.6); } break;
  }
  return { width: S, height: S, data: px };
}
