// Foundry Maps Studio (nav/studio.html): a test version where people design their own map and guide instead of picking a
// Foundry world. A design is plain data, saved on the phone and shareable as a link (#d=...). Links come from strangers, so
// every field is checked against a whitelist when it is read (navStudioClean); text is only ever shown as text.
const NAV_STUDIO_TEXTURES = ['none', 'dots', 'scan', 'paper', 'hatch', 'rain', 'stars', 'grid', 'lattice', 'glitch', 'checker', 'stipple', 'candles'];
const NAV_STUDIO_ROUTES = ['solid', 'outlined', 'dashed', 'glow'];
const NAV_STUDIO_SHAPES = ['rounded', 'square', 'pill'];
const NAV_STUDIO_LINES = { depart: 'When you set out', arrive: 'When you arrive', reroute: 'When you go the wrong way', cruise: 'Now and then on long stretches', tags: 'After turns (Full voice only)' };
const NAV_STUDIO_BASE = {
  name: 'My map', land: '#F4F1EA', ink: '#1F2430', roads: '#FFFFFF', water: '#A9CCE3', park: '#CFE3C1', route: '#3D6BFF', panel: '#FFFFFF',
  texture: 'none', textureStrength: 0.06, marker: 'chevron', routeStyle: 'outlined', shape: 'rounded', upper: false,
  display: 'Space Grotesk', mono: 'DM Mono', guide: 'Your guide', start: 'Start', arriveHead: 'You made it',
  depart: ["Let's go."], arrive: ['Nice driving.'], reroute: ['New route. No problem.'], cruise: ['Still on track.'], tags: ['Nice.']
};
// Starting points. Plain looks of our own, plus every Foundry world to remix (their colors, texture and marker).
const NAV_STUDIO_STARTS = [
  { name: 'Daylight' },
  { name: 'Night', land: '#12151C', ink: '#E8ECF4', roads: '#2A3140', water: '#1B2A3D', park: '#18261E', route: '#4CC3FF', panel: '#1A1F29', routeStyle: 'glow', marker: 'chevron' },
  { name: 'Paper', land: '#F3EAD7', ink: '#3B2F22', roads: '#FFFDF7', water: '#BFD3D6', park: '#DCE3C2', route: '#C2452D', panel: '#FBF6EA', texture: 'paper', routeStyle: 'dashed', marker: 'compass', display: 'Fraunces' },
  { name: 'Pastel pink', land: '#FFE4EF', ink: '#4A2340', roads: '#FFFFFF', water: '#CDE7FF', park: '#E3F6DC', route: '#FF4F9A', panel: '#FFF4F9', texture: 'dots', marker: 'diamond', shape: 'pill', display: 'Bodoni Moda' },
  { name: 'Lavender', land: '#ECE6FF', ink: '#2B2350', roads: '#FFFFFF', water: '#CFE0FF', park: '#E2F2E6', route: '#7B5CFF', panel: '#F7F4FF', texture: 'lattice', marker: 'star', shape: 'pill', display: 'Cormorant Garamond' },
  { name: 'Matcha', land: '#E9F0DC', ink: '#22331F', roads: '#FFFFFF', water: '#BFDCD9', park: '#C9DEB0', route: '#4E8F3A', panel: '#F7FAF0', texture: 'stipple', marker: 'leaf', display: 'Newsreader' }
];
function navStudioFromWorld(t) {
  const p = navPalette(t, t.colorways[0]);
  return { name: t.title, land: p.land, ink: p.c.ink, roads: p.roads.major, water: p.water, park: p.park, route: p.route.line, panel: p.c.panel || p.land,
    texture: p.texture.kind, textureStrength: p.texture.alpha, marker: p.world.marker, routeStyle: p.route.dash ? 'dashed' : p.route.glow ? 'glow' : p.route.casing ? 'outlined' : 'solid',
    upper: t.upper, display: t.fonts.display, mono: t.fonts.mono };
}
function navStudioClean(raw) {
  const d = Object.assign({}, NAV_STUDIO_BASE), r = raw && typeof raw === 'object' ? raw : {};
  const hex = v => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v), text = (v, n) => typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n) : '';
  for (const k of ['land', 'ink', 'roads', 'water', 'park', 'route', 'panel']) if (hex(r[k])) d[k] = r[k].toUpperCase();
  if (NAV_STUDIO_TEXTURES.includes(r.texture)) d.texture = r.texture;
  if (typeof r.textureStrength === 'number' && r.textureStrength >= 0 && r.textureStrength <= 0.3) d.textureStrength = Math.round(r.textureStrength * 100) / 100;
  if (NAV_MARKERS[r.marker]) d.marker = r.marker;
  if (NAV_STUDIO_ROUTES.includes(r.routeStyle)) d.routeStyle = r.routeStyle;
  if (NAV_STUDIO_SHAPES.includes(r.shape)) d.shape = r.shape;
  if (typeof r.upper === 'boolean') d.upper = r.upper;
  if (NAV_FONTS[r.display]) d.display = r.display;
  if (NAV_FONTS[r.mono]) d.mono = r.mono;
  for (const [k, n] of [['name', 40], ['guide', 40], ['start', 24], ['arriveHead', 60]]) { const v = text(r[k], n); if (v) d[k] = v; }
  for (const k of Object.keys(NAV_STUDIO_LINES)) if (Array.isArray(r[k])) d[k] = r[k].map(x => text(x, 140)).filter(Boolean).slice(0, 12);
  return d;
}
// A design -> the same theme shape the Foundry worlds use, so the map, screen and voice code need nothing special.
function navStudioTheme(d) {
  const roadsLight = navLum(d.roads) > navLum(d.land);
  NAV_WORLDS.studio = {
    texture: d.texture, textureColor: c => c.ink, textureAlpha: d.textureStrength, marker: d.marker, labels: { font: d.upper ? 'Bold' : 'Regular', upper: d.upper, spacing: d.upper ? 0.08 : 0 },
    land: c => c.ground, water: () => d.water, park: () => d.park, wood: () => navMix(d.park, d.ink, 0.1),
    roads: () => ({ minor: navMix(d.land, d.roads, 0.75), major: d.roads, motorway: navMix(d.roads, d.route, 0.25), casing: roadsLight ? navMix(d.land, d.ink, 0.18) : null }),
    buildings: 'fill', route: () => ({ line: d.route, casing: d.routeStyle === 'outlined' ? d.ink : null, dash: d.routeStyle === 'dashed' ? [1.6, 0.9] : null, glow: d.routeStyle === 'glow' ? 8 : 0 })
  };
  NAV_VOICES.studio = {
    speaker: d.guide, channel: 'your own words', rate: 1, pitch: 1,
    L: { search: 'Where to?', routes: 'Routes', start: d.start, end: 'End', eta: 'Arrive', left: 'Left', arrive: d.name, reroute: 'Rerouting', then: 'Then' },
    depart: d.depart, arrive: d.arrive, reroute: d.reroute, cruise: d.cruise, tags: d.tags
  };
  const fonts = [d.display, d.mono].filter((f, i, a) => a.indexOf(f) === i);
  return {
    id: 'studio', title: d.name, blurb: '', company: d.name, upper: d.upper, shape: d.shape,
    colors: { ground: d.land, ink: d.ink, accent: d.route, panel: d.panel, glow: d.park, alert: d.route },
    fonts: { display: d.display, mono: d.mono }, displayWeight: NAV_FONTS[d.display].weight,
    fontQuery: fonts.map(f => NAV_FONTS[f].spec).join('&') + '&display=swap',
    phrases: [[d.arriveHead, '']], slogans: [], colorways: [{ name: d.name, colors: {} }], editions: []
  };
}
const navStudioLink = d => `${location.origin}${location.pathname}#d=${btoa(unescape(encodeURIComponent(JSON.stringify(d)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
function navStudioFromHash(hash) {
  const m = /[#&]d=([A-Za-z0-9_-]+)/.exec(hash || '');
  if (!m) return null;
  try { return navStudioClean(JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/')))))); } catch (e) { return null; }
}
// A random but readable design: one hue for the land, its opposite for the route.
function navStudioSurprise(seed = Date.now()) {
  let s = seed % 2147483647 || 1; const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  const hsl = (h, sat, l) => { const f = n => { const k = (n + h / 30) % 12, a = sat * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return navHex([f(0), f(8), f(4)].map(v => v * 255)); };
  const h = Math.floor(rnd() * 360), dark = rnd() < 0.35, pick = a => a[Math.floor(rnd() * a.length)];
  const land = dark ? hsl(h, 0.25, 0.1) : hsl(h, 0.45, 0.92);
  return navStudioClean(Object.assign({}, NAV_STUDIO_BASE, {
    name: 'Surprise', land, ink: dark ? hsl(h, 0.2, 0.9) : hsl(h, 0.35, 0.15), panel: dark ? hsl(h, 0.25, 0.14) : hsl(h, 0.4, 0.97),
    roads: dark ? hsl(h, 0.2, 0.28) : '#FFFFFF', water: hsl((h + 200) % 360, 0.45, dark ? 0.2 : 0.8), park: hsl((h + 100) % 360, 0.35, dark ? 0.16 : 0.84),
    route: hsl((h + 180) % 360, 0.85, dark ? 0.6 : 0.5), texture: pick(NAV_STUDIO_TEXTURES), marker: pick(Object.keys(NAV_MARKERS)),
    routeStyle: pick(NAV_STUDIO_ROUTES), shape: pick(NAV_STUDIO_SHAPES), display: pick(Object.keys(NAV_FONTS).filter(f => NAV_FONTS[f].display)), upper: rnd() < 0.3
  }));
}
