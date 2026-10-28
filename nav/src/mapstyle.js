// Builds a MapLibre style for a world and colorway, over OpenFreeMap's tiles (the OpenMapTiles layers and classes).
// With fixture data (nav/fixture.js) the same layers draw the offline test town instead.
const NAV_TILES = 'https://tiles.openfreemap.org/planet';
const NAV_GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

function navRgb(hex) { const h = hex.replace('#', ''), n = parseInt(h.length === 3 ? h.replace(/./g, x => x + x) : h.slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function navHex(rgb) { return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase(); }
function navMix(a, b, t) { const x = navRgb(a), y = navRgb(b); return navHex(x.map((v, i) => v + (y[i] - v) * t)); }
function navRgba(hex, a) { const [r, g, b] = navRgb(hex); return `rgba(${r},${g},${b},${a})`; }
function navLum(hex) { const c = navRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function navContrast(a, b) { const x = navLum(a), y = navLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

// Theme + colorway -> every color the map and screen use. The route must stand out from the land: if the world's chosen
// route color is too close to the land in some colorway (contrast under 3), the casing carries it, or the best of the
// theme's own colors stands in.
function navPalette(theme, colorway) {
  const c = Object.assign({}, theme.colors, (colorway && colorway.colors) || {});
  const w = NAV_WORLDS[theme.id] || NAV_WORLDS.halcyon;
  const land = w.land(c), dark = navLum(land) < 0.18;
  const route = Object.assign({ width: 1 }, w.route(c));
  const routeSeen = r => Math.max(navContrast(r.line, land), r.casing ? navContrast(r.casing, land) : 0);
  if (routeSeen(route) < 3) route.line = [c.accent, c.alert, c.glow, c.ink].filter(Boolean).sort((a, b) => navContrast(b, land) - navContrast(a, land))[0];
  return {
    c, dark, land, world: w, route,
    water: w.water(c), park: w.park(c), wood: w.wood(c), roads: w.roads(c),
    building: w.buildingColor ? w.buildingColor(c) : navMix(land, c.ink, w.buildings === 'outline' ? 0.2 : 0.07),
    label: c.ink, halo: dark ? land : navMix(land, '#FFFFFF', 0.35), marker: w.markerColor ? w.markerColor(c) : route.line,
    texture: { kind: w.texture, color: w.textureColor(c), alpha: w.textureAlpha }
  };
}

function navStyle(theme, colorway, { fixture = null } = {}) {
  const p = navPalette(theme, colorway), w = p.world, R = p.roads, L = w.labels || {};
  const src = fixture ? Object.fromEntries(Object.entries(fixture).map(([k, data]) => [`fx-${k}`, { type: 'geojson', data }]))
    : { omt: { type: 'vector', url: NAV_TILES } };
  const from = (layer, def) => fixture ? Object.assign({ source: `fx-${layer}` }, def) : Object.assign({ source: 'omt', 'source-layer': layer }, def);
  const cls = list => ['match', ['get', 'class'], list, true, false];
  const zw = (stops, k = 1) => ['interpolate', ['exponential', 1.5], ['zoom'], ...stops.flatMap(([z, v]) => [z, v * k])];
  const name = ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  const text = L.upper ? ['upcase', name] : name;
  const font = [`Noto Sans ${L.font || 'Regular'}`];
  const roadW = { minor: [[12, 0.4], [14, 1.6], [16, 5], [18, 14]], major: [[8, 0.5], [12, 1.4], [14, 3.2], [16, 8], [18, 20]], motorway: [[5, 0.6], [9, 1.4], [12, 2.6], [14, 5], [16, 12], [18, 26]] };
  const roadLayers = [];
  const road = (id, classes, color, widths, extra = {}) => {
    if (R.casing) roadLayers.push(from('transportation', { id: `${id}-casing`, type: 'line', filter: cls(classes), layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': R.casing, 'line-width': zw(widths.map(([z, v]) => [z, v + (z >= 14 ? 2 : 1)])) } }));
    roadLayers.push(from('transportation', Object.assign({ id, type: 'line', filter: cls(classes), layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: Object.assign({ 'line-color': color, 'line-width': zw(widths) }, R.blur ? { 'line-blur': R.blur } : {}) }, extra)));
  };
  road('road-minor', ['minor', 'service', 'track'], R.minor, roadW.minor, { minzoom: 12 });
  road('road-major', ['primary', 'secondary', 'tertiary'], R.major, roadW.major);
  road('road-motorway', ['motorway', 'trunk'], R.motorway, roadW.motorway);
  const r = p.route, rw = [[8, 3], [12, 5], [14, 7], [16, 11], [18, 18]].map(([z, v]) => [z, v * (r.width || 1)]);
  const empty = { type: 'geojson', data: { type: 'FeatureCollection', features: [] } };
  return {
    version: 8, name: `Foundry Maps · ${theme.title}${colorway ? ` · ${colorway.name}` : ''}`, glyphs: NAV_GLYPHS,
    sources: Object.assign(src, { 'nav-alts': empty, 'nav-route': empty, 'nav-done': empty, 'nav-dest': empty }),
    layers: [
      { id: 'land', type: 'background', paint: { 'background-color': p.land } },
      ...(p.texture.kind && p.texture.kind !== 'none' ? [{ id: 'land-texture', type: 'background', paint: { 'background-pattern': navTextureId(p.texture.kind, p.texture.color, p.texture.alpha) } }] : []),
      from('landuse', { id: 'landuse', type: 'fill', filter: cls(['commercial', 'retail', 'industrial']), paint: { 'fill-color': navMix(p.land, p.c.ink, 0.04) } }),
      from('landcover', { id: 'wood', type: 'fill', filter: cls(['wood', 'forest']), paint: { 'fill-color': p.wood } }),
      from('landcover', { id: 'park', type: 'fill', filter: cls(['grass', 'farmland', 'park']), paint: { 'fill-color': p.park } }),
      from('park', { id: 'park-reserve', type: 'fill', paint: { 'fill-color': p.park, 'fill-opacity': 0.6 } }),
      from('water', { id: 'water', type: 'fill', paint: { 'fill-color': p.water } }),
      ...(w.waterTexture ? [from('water', { id: 'water-texture', type: 'fill', paint: { 'fill-pattern': navTextureId(w.waterTexture, p.c.ink, 0.16) } })] : []),
      from('waterway', { id: 'waterway', type: 'line', paint: { 'line-color': p.water, 'line-width': zw([[10, 0.6], [14, 2.5], [18, 8]]) } }),
      ...(w.buildings === 'none' ? [] : [from('building', w.buildings === 'outline'
        ? { id: 'building', type: 'line', minzoom: 14, paint: { 'line-color': p.building, 'line-width': 0.8 } }
        : { id: 'building', type: 'fill', minzoom: 14, paint: { 'fill-color': p.building, 'fill-outline-color': navMix(p.building, p.c.ink, 0.12) } })]),
      from('transportation', { id: 'path', type: 'line', minzoom: 14, filter: cls(['path']), paint: { 'line-color': R.minor, 'line-width': 1.2, 'line-dasharray': [2, 1.5] } }),
      from('transportation', { id: 'rail', type: 'line', minzoom: 11, filter: cls(['rail', 'transit']), paint: { 'line-color': navMix(p.land, p.c.ink, 0.3), 'line-width': 1.2, 'line-dasharray': [3, 2] } }),
      ...roadLayers,
      from('boundary', { id: 'boundary', type: 'line', filter: ['<=', ['get', 'admin_level'], 4], paint: { 'line-color': navMix(p.land, p.c.ink, 0.3), 'line-width': 1, 'line-dasharray': [4, 2] } }),
      // The route: alternatives under the chosen route; while driving, the part already driven is dimmed.
      { id: 'nav-alts', type: 'line', source: 'nav-alts', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': navMix(r.line, p.land, 0.55), 'line-width': zw(rw, 0.85) } },
      ...(r.glow ? [{ id: 'nav-route-glow', type: 'line', source: 'nav-route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': r.line, 'line-opacity': 0.45, 'line-blur': r.glow, 'line-width': zw(rw, 1.9) } }] : []),
      ...(r.casing ? [{ id: 'nav-route-casing', type: 'line', source: 'nav-route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': r.casing, 'line-width': zw(rw.map(([z, v]) => [z, v + 4])) } }] : []),
      { id: 'nav-route', type: 'line', source: 'nav-route', layout: { 'line-cap': r.dash ? 'butt' : 'round', 'line-join': 'round' }, paint: Object.assign({ 'line-color': r.line, 'line-width': zw(rw) }, r.dash ? { 'line-dasharray': r.dash } : {}) },
      { id: 'nav-done', type: 'line', source: 'nav-done', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': navMix(r.line, p.land, 0.7), 'line-width': zw(rw, 0.7) } },
      { id: 'nav-dest', type: 'circle', source: 'nav-dest', paint: { 'circle-radius': 9, 'circle-color': p.land, 'circle-stroke-color': r.line, 'circle-stroke-width': 4 } },
      // Labels.
      from('water_name', { id: 'water-name', type: 'symbol', layout: { 'text-field': name, 'text-font': [`Noto Sans Italic`], 'text-size': 12 }, paint: { 'text-color': navMix(p.water, p.c.ink, 0.6), 'text-halo-color': p.water, 'text-halo-width': 1 } }),
      from('transportation_name', { id: 'road-name', type: 'symbol', minzoom: 13, layout: { 'symbol-placement': 'line', 'text-field': text, 'text-font': font, 'text-size': zw([[13, 10], [17, 14]]), 'text-letter-spacing': L.spacing || 0 }, paint: { 'text-color': p.label, 'text-halo-color': p.halo, 'text-halo-width': 1.5 } }),
      from('poi', { id: 'poi', type: 'symbol', minzoom: 15, filter: ['<=', ['get', 'rank'], 25], layout: { 'text-field': text, 'text-font': font, 'text-size': 11, 'text-max-width': 8, 'text-letter-spacing': L.spacing || 0 }, paint: { 'text-color': navMix(p.label, p.land, 0.25), 'text-halo-color': p.halo, 'text-halo-width': 1.5 } }),
      from('place', { id: 'place', type: 'symbol', filter: cls(['city', 'town', 'village', 'suburb', 'neighbourhood']), layout: { 'text-field': text, 'text-font': [`Noto Sans Bold`], 'text-size': ['match', ['get', 'class'], 'city', 18, 'town', 15, 12], 'text-letter-spacing': (L.spacing || 0) + 0.04, 'text-max-width': 8 }, paint: { 'text-color': p.label, 'text-halo-color': p.halo, 'text-halo-width': 2 } })
    ]
  };
}

// Texture images are named by kind, color and strength so a new world or colorway never reuses a stale tile; the app draws
// them when the map asks (styleimagemissing).
function navTextureId(kind, color, alpha) { return `tex-${kind}-${color.replace('#', '')}-${Math.round(alpha * 100)}`; }
function navTextureFromId(id) { const m = /^tex-(\w+)-([0-9A-Fa-f]{6})-(\d+)$/.exec(id); return m ? navTexture(m[1], '#' + m[2], +m[3] / 100) : null; }

// The position marker for a world as an SVG string (48x48, pointing north).
function navMarkerSvg(theme, colorway) {
  const p = navPalette(theme, colorway), draw = NAV_MARKERS[p.world.marker] || NAV_MARKERS.ring;
  const outline = navContrast(p.marker, p.c.ink) >= 2.5 ? p.c.ink : p.land;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${draw(p.marker, outline)}</svg>`;
}
