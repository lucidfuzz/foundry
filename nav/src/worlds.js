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
    texture: 'checker', textureColor: c => c.ink, textureAlpha: 0.035, marker: 'cursor', labels: { font: 'Regular' },
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
  // Kit markers for Navie's own themes (nav/src/kit.js). Shapes that look the same both ways carry a small pointer on top.
  heart: (f, k) => `<path d="M24 43C10 33 4 25 5 18a9.5 9.5 0 0 1 19-4 9.5 9.5 0 0 1 19 4c1 7-5 15-19 25z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M24 2l4 6h-8z" fill="${k}"/>`,
  paw: (f, k) => `<ellipse cx="24" cy="33" rx="10" ry="9" fill="${f}" stroke="${k}" stroke-width="2.5"/><g fill="${f}" stroke="${k}" stroke-width="2.5"><circle cx="11" cy="21" r="4.5"/><circle cx="19" cy="12" r="4.5"/><circle cx="29" cy="12" r="4.5"/><circle cx="37" cy="21" r="4.5"/></g>`,
  rocket: (f, k) => `<path d="M24 3c7 6 10 14 10 24l5 7v6l-8-4H17l-8 4v-6l5-7c0-10 3-18 10-24z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="20" r="4" fill="${k}"/>`,
  fish: (f, k) => `<path d="M24 4c8 6 11 14 9 23-1 5-4 8-6 10l6 8H15l6-8c-2-2-5-5-6-10-2-9 1-17 9-23z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="20" cy="15" r="2.2" fill="${k}"/>`,
  footprint: (f, k) => `<path d="M24 46c-7 0-10-5-9-11l1-6-7-13 4-2 7 10 1-15h6l1 15 7-10 4 2-7 13 1 6c1 6-2 11-9 11z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  crayon: (f, k) => `<path d="M24 2l7 12v31H17V14z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M17 14h14M17 37h14" stroke="${k}" stroke-width="3"/>`,
  crown: (f, k) => `<path d="M8 37V14l9 9 7-15 7 15 9-9v23z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M8 42h32" stroke="${k}" stroke-width="3"/>`,
  bow: (f, k) => `<path d="M24 23c-6-9-17-13-19-8s3 14 19 8c16 6 21-3 19-8s-13-1-19 8z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 25l-6 17 6-3 4 3 2-17" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="23" r="3.5" fill="${k}"/><path d="M24 3l4 6h-8z" fill="${k}"/>`,
  butterfly: (f, k) => `<path d="M24 15c-6-10-18-12-18-2 0 7 8 10 14 10-6 2-12 8-8 14 3 4 10-2 12-8 2 6 9 12 12 8 4-6-2-12-8-14 6 0 14-3 14-10 0-10-12-8-18 2z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 13v26" stroke="${k}" stroke-width="3" stroke-linecap="round"/><path d="M24 3l3 6h-6z" fill="${k}"/>`,
  cloud: (f, k) => `<path d="M14 38a8 8 0 0 1-1-16 11 11 0 0 1 21-4 9 9 0 0 1 2 20z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M24 3l5 7h-10z" fill="${k}"/>`,
  pixel: (f, k) => `<path d="M20 4h8v4h4v4h4v4h4v8H32v20H16V24H8v-8h4v-4h4V8h4z" fill="${f}" stroke="${k}" stroke-width="2.5"/>`,
  sun: (f, k) => `<path d="M24 1v8M24 39v8M1 24h8M39 24h8M8 8l5.5 5.5M34.5 34.5L40 40M8 40l5.5-5.5M34.5 13.5L40 8" stroke="${k}" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="24" r="10" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 17l4 8h-8z" fill="${k}"/>`,
  moon: (f, k) => `<path d="M31 5a19 19 0 1 0 12 27A15 15 0 0 1 31 5z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M18 3l4 6h-8z" fill="${k}"/>`,
  flower: (f, k) => `<g fill="${f}" stroke="${k}" stroke-width="2.5"><circle cx="24" cy="12" r="7"/><circle cx="35" cy="20" r="7"/><circle cx="31" cy="33" r="7"/><circle cx="17" cy="33" r="7"/><circle cx="13" cy="20" r="7"/></g><circle cx="24" cy="24" r="5.5" fill="${k}"/>`,
  bolt: (f, k) => `<path d="M28 2L10 27h11l-4 19 21-27H27z" fill="${f}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`,
  ghost: (f, k) => `<path d="M10 44V21a14 14 0 0 1 28 0v23l-5-4-4 4-5-4-5 4-4-4z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><circle cx="19" cy="22" r="2.6" fill="${k}"/><circle cx="29" cy="22" r="2.6" fill="${k}"/>`,
  shell: (f, k) => `<path d="M24 5C12 5 5 15 6 27l18 17 18-17C43 15 36 5 24 5z" fill="${f}" stroke="${k}" stroke-width="3" stroke-linejoin="round"/><path d="M24 43V8M24 43L15 10M24 43l9-33M24 43L8 21M24 43l16-22" stroke="${k}" stroke-width="1.6"/>`,
  feather: (f, k) => `<path d="M24 2c9 8 12 18 9 28-2 6-5 9-9 10-4-1-7-4-9-10-3-10 0-20 9-28z" fill="${f}" stroke="${k}" stroke-width="2.5"/><path d="M24 8v38M24 20l-6-4M24 28l6-4M24 34l-6-4" stroke="${k}" stroke-width="2" stroke-linecap="round"/>`,
  car: (f, k) => `<rect x="13" y="4" width="22" height="40" rx="8" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M17 14h14l-2 7H19zM19 34h10l2 5H17z" fill="${k}"/>`,
  note: (f, k) => `<path d="M20 37V9l18-5v26" fill="none" stroke="${k}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="15" cy="37" r="6.5" fill="${f}" stroke="${k}" stroke-width="3"/><circle cx="33" cy="31" r="6.5" fill="${f}" stroke="${k}" stroke-width="3"/>`,
  balloon: (f, k) => `<ellipse cx="24" cy="18" rx="12" ry="14.5" fill="${f}" stroke="${k}" stroke-width="3"/><path d="M24 33l-3 4h6z" fill="${k}"/><path d="M24 37c-4 4 4 6 0 10" fill="none" stroke="${k}" stroke-width="2.5" stroke-linecap="round"/>`,
  bigarrow: (f, k) => `<circle cx="24" cy="24" r="20" fill="${f}" stroke="${k}" stroke-width="4"/><path d="M24 9l11 24-11-6-11 6z" fill="${k}"/>`,
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
    // Kit textures for Navie's own themes.
    case 'hearts': for (const [x0, y0] of [[5, 6], [21, 22]]) ['0101', '1111', '1111', '0110'].forEach((row, y) => [...row].forEach((v, x) => { if (v === '1') { put(x0 + x * 2, y0 + y * 2); put(x0 + x * 2 + 1, y0 + y * 2); put(x0 + x * 2, y0 + y * 2 + 1); put(x0 + x * 2 + 1, y0 + y * 2 + 1); } })); break;
    case 'sprinkles': for (let i = 0; i < 9; i++) { const x = Math.floor(rnd() * S), y = Math.floor(rnd() * S), d = [[1, 0], [0, 1], [1, 1], [1, -1]][i % 4]; for (let k = 0; k < 4; k++) put(x + d[0] * k, y + d[1] * k); } break;
    case 'waves': for (let x = 0; x < S; x++) for (const base of [8, 24]) put(x, Math.round(base + 2.5 * Math.sin(x / S * Math.PI * 2))); break;
    case 'bubbles': for (const [cx, cy, rr] of [[8, 9, 4], [23, 20, 6], [12, 26, 2.5]]) for (let a = 0; a < 64; a++) put(Math.round(cx + rr * Math.cos(a / 64 * Math.PI * 2)), Math.round(cy + rr * Math.sin(a / 64 * Math.PI * 2))); break;
    case 'gingham': for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const a = (x % 16) < 6, b = (y % 16) < 6; if (a || b) put(x, y, a && b ? 1 : 0.45); } break;
    case 'polka': for (const [cx, cy] of [[8, 8], [24, 24]]) for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) if (x * x + y * y <= 12) put(cx + x, cy + y); break;
    case 'sparkles': for (const [cx, cy, r] of [[8, 9, 4], [24, 23, 3], [26, 6, 2]]) { for (let k = -r; k <= r; k++) { put(cx + k, cy, 1 - Math.abs(k) / (r + 1)); put(cx, cy + k, 1 - Math.abs(k) / (r + 1)); } put(cx + 1, cy + 1, 0.5); put(cx - 1, cy - 1, 0.5); put(cx + 1, cy - 1, 0.5); put(cx - 1, cy + 1, 0.5); } break;
    case 'pixels': for (let i = 0; i < 7; i++) { const x = Math.floor(rnd() * 8) * 4, y = Math.floor(rnd() * 8) * 4; for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) put(x + dx, y + dy); } break;
    case 'halftone': for (let y = 2; y < S; y += 6) for (let x = 2; x < S; x += 6) { const r = 0.6 + ((x + y) / (2 * S)) * 2; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (dx * dx + dy * dy <= r * r) put(x + dx, y + dy); } break;
    case 'chalk': for (let i = 0; i < 10; i++) { const x = Math.floor(rnd() * S), y = Math.floor(rnd() * S), len = 3 + Math.floor(rnd() * 5); for (let k = 0; k < len; k++) put(x + k, y + Math.round(k * 0.3), 0.3 + rnd() * 0.5); } break;
    case 'petals': for (const [cx, cy] of [[8, 8], [24, 22], [26, 4]]) { put(cx, cy - 1); put(cx - 1, cy); put(cx + 1, cy); put(cx, cy + 1); put(cx, cy, 0.4); } break;
    case 'zigzag': for (let x = 0; x < S; x++) { const t = x % 8, y = t < 4 ? t : 8 - t; put(x, 6 + y); put(x, 22 + y); } break;
    case 'weave': for (let y = 0; y < S; y += 8) for (let x = 0; x < S; x += 8) for (let k = 0; k < 5; k++) { if (((x + y) / 8) % 2) put(x + k, y + 2); else put(x + 2, y + k); } break;
    case 'finegrid': for (let i = 0; i < S; i++) { put(i, 0); put(0, i); for (const g of [8, 16, 24]) { put(i, g, 0.35); put(g, i, 0.35); } } break;
    case 'candles': for (const [x, y0, h] of [[4, 10, 12], [12, 6, 16], [20, 14, 9], [28, 4, 14]]) { for (let y = 0; y < h; y++) { put(x, y0 + y); put(x + 1, y0 + y); } put(x, y0 - 2, 0.6); put(x, y0 + h + 1, 0.6); } break;
  }
  return { width: S, height: S, data: px };
}
