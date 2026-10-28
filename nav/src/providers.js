// Routing and search for Navie. Both are free community services with fair-use rules (docs/NAV_SPEC.md, rule 5):
// keep requests few, debounce search, and swap these for a paid provider before a public launch.
const NAV_SERVICES = {
  routeBase: 'https://routing.openstreetmap.de',
  routePaths: { car: 'routed-car/route/v1/driving', bike: 'routed-bike/route/v1/driving', foot: 'routed-foot/route/v1/driving' },
  searchBase: 'https://photon.komoot.io',
  credit: 'Routes: FOSSGIS OSRM · Search: Photon by komoot · Map data © OpenStreetMap contributors · Tiles: OpenFreeMap'
};

// OSRM step -> our step. A step starts with its maneuver; `start` is how far along the route that maneuver is (filled in by
// navParseRoute once the whole line is known).
function navStepFrom(s) {
  const m = s.maneuver || {};
  return {
    type: m.type || 'turn', modifier: m.modifier || '', exit: m.exit || 0, location: m.location,
    bearingBefore: m.bearing_before || 0, bearingAfter: m.bearing_after || 0,
    name: s.name || '', ref: s.ref || '', destinations: s.destinations || '', exits: s.exits || '', rotary: s.rotary_name || '',
    mode: s.mode || 'driving', distance: s.distance || 0, duration: s.duration || 0, start: 0
  };
}
// One OSRM route (with steps and GeoJSON geometries) -> { coords, cum, steps, distance, duration, summary }.
function navParseRoute(r, i = 0) {
  const steps = [], coords = [], starts = [];
  for (const leg of r.legs || []) for (const s of leg.steps || []) {
    const g = (s.geometry && s.geometry.coordinates) || [];
    starts.push(Math.max(0, coords.length - 1));
    for (const c of g) {
      const last = coords[coords.length - 1];
      if (!last || last[0] !== c[0] || last[1] !== c[1]) coords.push([c[0], c[1]]);
    }
    steps.push(navStepFrom(s));
  }
  if (coords.length < 2 && r.geometry && r.geometry.coordinates) coords.splice(0, coords.length, ...r.geometry.coordinates.map(c => [c[0], c[1]]));
  if (coords.length === 1) coords.push(coords[0].slice());
  const cum = navCumulative(coords), total = cum[cum.length - 1];
  steps.forEach((s, k) => { s.start = k === steps.length - 1 && s.type === 'arrive' ? total : cum[Math.min(starts[k], cum.length - 1)]; });
  const summary = (r.legs || []).map(l => l.summary).filter(Boolean).join(', ');
  return { id: i, coords, cum, steps, distance: r.distance != null ? r.distance : total, duration: r.duration || 0, length: total, summary };
}
function navParseOsrm(json) {
  if (!json || json.code !== 'Ok' || !Array.isArray(json.routes) || !json.routes.length) {
    const code = json && json.code;
    throw new Error(code === 'NoRoute' ? 'No route between these places.' : code === 'NoSegment' ? 'That place is too far from a road.' : 'Route service unavailable.');
  }
  return json.routes.map(navParseRoute);
}
function navRouteUrl(from, to, { profile = 'car', bearing = null, alternatives = true } = {}) {
  const f = c => `${c[0].toFixed(6)},${c[1].toFixed(6)}`;
  const q = ['overview=false', 'steps=true', 'geometries=geojson', `alternatives=${alternatives ? 3 : 'false'}`];
  if (bearing != null && isFinite(bearing)) q.push(`bearings=${Math.round((bearing + 360) % 360)},60;`);
  return `${NAV_SERVICES.routeBase}/${NAV_SERVICES.routePaths[profile] || NAV_SERVICES.routePaths.car}/${f(from)};${f(to)}?${q.join('&')}`;
}

// Photon feature -> place { name, sub, coord }.
function navPlaceFrom(f) {
  const p = f.properties || {}, street = [p.housenumber, p.street].filter(Boolean).join(' ');
  const name = p.name || street || p.city || p.state || 'Dropped pin';
  const sub = [p.name && street, p.city !== name && p.city, p.state !== name && p.state, p.country !== name && p.country].filter(Boolean).join(', ');
  return { name, sub, coord: f.geometry.coordinates.slice(0, 2), kind: p.osm_value || p.type || '' };
}
function navParsePhoton(json) { return ((json && json.features) || []).filter(f => f.geometry && f.geometry.type === 'Point').map(navPlaceFrom); }

// The network services. The offline test town (nav/fixture.js) provides the same three calls.
function navNetServices(fetchFn = (...a) => fetch(...a)) {
  const getJson = async url => { const r = await fetchFn(url); if (!r.ok) throw new Error(`Service error ${r.status}`); return r.json(); };
  return {
    credit: NAV_SERVICES.credit,
    route: async (from, to, opts) => navParseOsrm(await getJson(navRouteUrl(from, to, opts))),
    search: async (q, near) => navParsePhoton(await getJson(`${NAV_SERVICES.searchBase}/api/?q=${encodeURIComponent(q)}&limit=8&lang=en${near ? `&lat=${near[1].toFixed(4)}&lon=${near[0].toFixed(4)}` : ''}`)),
    reverse: async p => navParsePhoton(await getJson(`${NAV_SERVICES.searchBase}/reverse?lon=${p[0].toFixed(6)}&lat=${p[1].toFixed(6)}&lang=en`))[0] || null
  };
}
