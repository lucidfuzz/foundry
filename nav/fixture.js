// The offline test town for Navie (?fixture=1, the tests and scripts/nav-shots.cjs). An invented grid town drawn as
// GeoJSON in the same layers and classes as OpenFreeMap's tiles, a grid router that answers in OSRM's format, and a place
// search that answers like Photon. Loaded only in fixture mode; the live app never fetches it.
const NAV_FIXTURE = (() => {
  const C = [12.0, 45.0], N = 9, GAP = 160;
  const dLon = GAP / (111320 * Math.cos(C[1] * Math.PI / 180)), dLat = GAP / 110574;
  const node = (c, r) => [+(C[0] + (c - (N - 1) / 2) * dLon).toFixed(7), +(C[1] + (r - (N - 1) / 2) * dLat).toFixed(7)];
  const COLS = ['Lantern Avenue', 'Ash Street', 'Bell Street', 'Copper Street', 'Main Street', 'Elm Street', 'Fern Street', 'Garnet Street', 'Harbor Avenue'];
  const ROWS = ['South Road', 'Willow Lane', 'River Road', 'Quarry Lane', 'Market Street', 'Station Road', 'Orchard Way', 'Mill Lane', 'North Road'];
  const klass = i => i === 4 ? 'primary' : i === 0 || i === N - 1 ? 'secondary' : 'minor';
  const SPEED = { primary: 13.4, secondary: 11.2, minor: 8.9 };
  const F = (geometry, properties) => ({ type: 'Feature', geometry, properties });
  const line = coords => ({ type: 'LineString', coordinates: coords });
  const poly = ring => ({ type: 'Polygon', coordinates: [ring.concat([ring[0]])] });
  const box = (a, b) => [[a[0], a[1]], [b[0], a[1]], [b[0], b[1]], [a[0], b[1]]];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  // Streets, a motorway across town, a rail line and a footpath through the park.
  const transportation = [], names = [];
  for (let i = 0; i < N; i++) {
    const col = [], row = [];
    for (let j = 0; j < N; j++) { col.push(node(i, j)); row.push(node(j, i)); }
    transportation.push(F(line(col), { class: klass(i) }), F(line(row), { class: klass(i) }));
    names.push(F(line(col), { class: klass(i), name: COLS[i] }), F(line(row), { class: klass(i), name: ROWS[i] }));
  }
  const mw = [node(-3, -2), node(2, 1.5), node(5, 3.2), node(11, 10)];
  transportation.push(F(line(mw), { class: 'motorway' }));
  names.push(F(line(mw), { class: 'motorway', name: 'Fixture Expressway', ref: 'X 1' }));
  transportation.push(F(line([node(-2, 6.5), node(11, 6.5)]), { class: 'rail' }), F(line([node(5.2, 5.2), node(5.6, 6), node(6.8, 6.3), node(7.6, 5.4)]), { class: 'path' }));

  const water = [F(poly([node(-3, 1.2), node(1, 1.2), node(1.6, 1.7), node(8.5, 1.7), node(11, 1.9), node(11, 2.3), node(8.5, 2.1), node(1.6, 2.1), node(1, 2.5), node(-3, 2.6)]), { class: 'river' }),
    F(poly([node(-3, -3), node(-0.5, -3), node(-0.4, -1.2), node(-1.4, -0.4), node(-3, -0.6)]), { class: 'lake' })];
  const waterway = [F(line([node(-3, 1.9), node(1, 1.85), node(8.5, 1.9), node(11, 2.1)]), { class: 'river', name: 'Slow River' })];
  const landcover = [F(poly(box(node(5.1, 5.1), node(7.9, 6.9))), { class: 'grass', subclass: 'park' }),
    F(poly(box(node(-3, 4), node(-0.3, 10))), { class: 'wood' }), F(poly(box(node(9.3, -3), node(11, 1))), { class: 'farmland' })];
  const landuse = [F(poly(box(node(0, 0), node(8, 8))), { class: 'residential' }), F(poly(box(node(3.05, 3.05), node(4.95, 4.95))), { class: 'commercial' }),
    F(poly(box(node(0.05, 2.6), node(1.95, 3.95))), { class: 'industrial' })];
  // Buildings: two to four per block, a fixed pattern so renders are repeatable.
  const building = [];
  for (let c = 0; c < N - 1; c++) for (let r = 0; r < N - 1; r++) {
    if ((c >= 5 && c <= 7 && r >= 5 && r <= 6) || (r === 1)) continue;
    const n = 2 + ((c * 7 + r * 3) % 3);
    for (let b = 0; b < n; b++) {
      const u = 0.12 + (b % 2) * 0.42, v = 0.12 + Math.floor(b / 2) * 0.42, w = 0.3 + ((c + b) % 3) * 0.04;
      building.push(F(poly(box(node(c + u, r + v), node(c + u + w, r + v + w))), { render_height: 6 + ((c + r + b) % 5) * 4 }));
    }
  }
  const place = [F({ type: 'Point', coordinates: node(4.5, 4.5) }, { class: 'town', name: 'Fixture Town', rank: 6 }),
    F({ type: 'Point', coordinates: node(1.5, 6.5) }, { class: 'suburb', name: 'Millside', rank: 12 }),
    F({ type: 'Point', coordinates: node(6.5, 0.6) }, { class: 'suburb', name: 'Southbank', rank: 12 })];
  const water_name = [F({ type: 'Point', coordinates: node(-1.8, -2) }, { class: 'lake', name: 'Still Lake' })];
  const PLACES = [
    ['Central Library', 4.5, 4.5, 'library'], ['Harbor Market', 8, 3.5, 'marketplace'], ['Mill Lane Bakery', 2.5, 7, 'bakery'],
    ['Station Square', 6, 5, 'square'], ['Riverside Park', 6.5, 6, 'park'], ['Old Quarry', 0.5, 3, 'quarry'],
    ['Elm Street Clinic', 5, 2.5, 'clinic'], ['Copper Street Cinema', 3, 5.5, 'cinema'], ['North Road School', 7, 8, 'school'],
    ['Willow Lane Garden', 1, 1, 'garden'], ['Lantern Cafe', 0, 8, 'cafe'], ['Garnet Street Gym', 7, 0, 'fitness_centre']
  ].map(([name, c, r, kind]) => ({ name, c: Math.round(c), r: Math.round(r), kind }));
  const poi = PLACES.map(p => F({ type: 'Point', coordinates: node(p.c, p.r) }, { class: p.kind, name: p.name, rank: 20 }));
  const layers = { water, waterway, landcover, landuse, building, transportation, transportation_name: names, place, water_name, poi, park: [], boundary: [] };
  const geojson = Object.fromEntries(Object.entries(layers).map(([k, f]) => [k, { type: 'FeatureCollection', features: f }]));

  // Router: snap both ends to the nearest corner and walk the grid, one leg along a road and one across. Answers like OSRM.
  const nearest = p => {
    const c = Math.round((p[0] - C[0]) / dLon + (N - 1) / 2), r = Math.round((p[1] - C[1]) / dLat + (N - 1) / 2);
    return [Math.max(0, Math.min(N - 1, c)), Math.max(0, Math.min(N - 1, r))];
  };
  const runs = (a, b, order) => {
    const legs = [];
    let [c, r] = a;
    for (const axis of order) {
      const pts = [node(c, r)];
      if (axis === 'c') { while (c !== b[0]) { c += Math.sign(b[0] - c); pts.push(node(c, r)); } }
      else { while (r !== b[1]) { r += Math.sign(b[1] - r); pts.push(node(c, r)); } }
      if (pts.length > 1) legs.push({ pts, name: axis === 'c' ? ROWS[r] : COLS[c], k: klass(axis === 'c' ? r : c) });
    }
    return legs;
  };
  const brg = (a, b) => (Math.atan2((b[0] - a[0]) * Math.cos(C[1] * Math.PI / 180), b[1] - a[1]) * 180 / Math.PI + 360) % 360;
  const dist = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot((p[0] - pts[i][0]) * 111320 * Math.cos(C[1] * Math.PI / 180), (p[1] - pts[i][1]) * 110574), 0);
  const mod = d => { const t = ((d + 540) % 360) - 180; return Math.abs(t) < 20 ? 'straight' : t < -150 || t > 150 ? 'uturn' : t < -110 ? 'sharp left' : t < -45 ? 'left' : t < 0 ? 'slight left' : t > 110 ? 'sharp right' : t > 45 ? 'right' : 'slight right'; };
  const osrmRoute = legs => {
    const steps = [];
    legs.forEach((g, i) => {
      const d = dist(g.pts), before = i ? brg(legs[i - 1].pts[legs[i - 1].pts.length - 2], g.pts[0]) : 0, after = brg(g.pts[0], g.pts[1]);
      steps.push({ distance: d, duration: d / SPEED[g.k], name: g.name, ref: '', mode: 'driving', geometry: line(g.pts),
        maneuver: { type: i ? 'turn' : 'depart', modifier: i ? mod(after - before) : undefined, location: g.pts[0], bearing_before: Math.round(before), bearing_after: Math.round(after) } });
    });
    const lastLeg = legs[legs.length - 1], end = lastLeg.pts[lastLeg.pts.length - 1];
    steps.push({ distance: 0, duration: 0, name: lastLeg.name, ref: '', mode: 'driving', geometry: line([end, end]), maneuver: { type: 'arrive', location: end, bearing_before: Math.round(brg(lastLeg.pts[lastLeg.pts.length - 2], end)), bearing_after: 0 } });
    const distance = steps.reduce((s, x) => s + x.distance, 0), duration = steps.reduce((s, x) => s + x.duration, 0);
    return { distance, duration, legs: [{ steps, distance, duration, summary: legs.map(l => l.name).slice(0, 2).join(', ') }] };
  };
  const osrm = (from, to) => {
    const a = nearest(from), b = nearest(to);
    if (a[0] === b[0] && a[1] === b[1]) return { code: 'Ok', routes: [osrmRoute([{ pts: [node(a[0], a[1]), node(a[0], a[1])], name: COLS[a[0]], k: klass(a[0]) }])] };
    const routes = [runs(a, b, ['c', 'r']), runs(a, b, ['r', 'c'])].filter(l => l.length).map(osrmRoute);
    if (routes.length === 2 && Math.abs(routes[0].distance - routes[1].distance) < 1 && routes[0].legs[0].steps.length === routes[1].legs[0].steps.length && routes[0].legs[0].summary === routes[1].legs[0].summary) routes.pop();
    routes.sort((x, y) => x.duration - y.duration);
    return { code: 'Ok', routes };
  };
  const photon = (q, near) => {
    const s = (q || '').trim().toLowerCase();
    const hits = PLACES.filter(p => s && (p.name.toLowerCase().includes(s) || p.kind.includes(s)));
    const pt = p => node(p.c, p.r), d = p => near ? Math.hypot(pt(p)[0] - near[0], pt(p)[1] - near[1]) : 0;
    return { type: 'FeatureCollection', features: hits.sort((a, b) => d(a) - d(b)).map(p => F({ type: 'Point', coordinates: pt(p) }, { name: p.name, street: COLS[p.c], city: 'Fixture Town', country: 'Testland', osm_value: p.kind })) };
  };
  const start = node(1, 0);
  return {
    center: C, start, node, geojson, osrm, photon, PLACES,
    // Same calls as navNetServices (providers.js), answered locally.
    services() {
      return {
        credit: 'Offline test town · invented map data',
        route: async (from, to) => navParseOsrm(osrm(from, to)),
        search: async (q, near) => navParsePhoton(photon(q, near)),
        reverse: async p => ({ name: 'Dropped pin', sub: 'Fixture Town', coord: p, kind: '' })
      };
    }
  };
})();
