// Geometry and formatting for Foundry Maps. Coordinates are [lon, lat] like GeoJSON; distances are meters.
const NAV_EARTH = 6371008.8;
const navRad = d => d * Math.PI / 180, navDeg = r => r * 180 / Math.PI;

function navDistance(a, b) {
  const dLat = navRad(b[1] - a[1]), dLon = navRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(navRad(a[1])) * Math.cos(navRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * NAV_EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
}
function navBearing(a, b) {
  const y = Math.sin(navRad(b[0] - a[0])) * Math.cos(navRad(b[1]));
  const x = Math.cos(navRad(a[1])) * Math.sin(navRad(b[1])) - Math.sin(navRad(a[1])) * Math.cos(navRad(b[1])) * Math.cos(navRad(b[0] - a[0]));
  return (navDeg(Math.atan2(y, x)) + 360) % 360;
}
// Signed smallest difference b - a in degrees, -180..180.
function navTurn(a, b) { return ((b - a + 540) % 360) - 180; }
// Point at distance d (m) and bearing brg from p.
function navOffset(p, brg, d) {
  const r = d / NAV_EARTH, th = navRad(brg), la = navRad(p[1]), lo = navRad(p[0]);
  const la2 = Math.asin(Math.sin(la) * Math.cos(r) + Math.cos(la) * Math.sin(r) * Math.cos(th));
  const lo2 = lo + Math.atan2(Math.sin(th) * Math.sin(r) * Math.cos(la), Math.cos(r) - Math.sin(la) * Math.sin(la2));
  return [navDeg(lo2), navDeg(la2)];
}
// Nearest point to p on segment a-b, in a local flat frame (fine at street scale). t is 0..1 along the segment.
function navProject(p, a, b) {
  const k = Math.cos(navRad(p[1])), ax = (a[0] - p[0]) * k, ay = a[1] - p[1], bx = (b[0] - p[0]) * k, by = b[1] - p[1];
  const dx = bx - ax, dy = by - ay, len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len)) : 0;
  const pt = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return { pt, t, dist: navDistance(p, pt) };
}
function navCumulative(coords) {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + navDistance(coords[i - 1], coords[i]));
  return cum;
}
// Snap p to a line. With a hint (last segment index) only a window around it is searched, so the snap can't jump to a
// different pass of the same road; the window reaches further forward than back.
function navSnap(p, coords, cum, hint, back = 8, ahead = 40) {
  let lo = 0, hi = coords.length - 2;
  if (hint != null) { lo = Math.max(0, hint - back); hi = Math.min(coords.length - 2, hint + ahead); }
  let best = null;
  for (let i = lo; i <= hi; i++) {
    const r = navProject(p, coords[i], coords[i + 1]);
    if (!best || r.dist < best.dist - 0.01) best = { idx: i, t: r.t, pt: r.pt, dist: r.dist };
  }
  if (!best) return { idx: 0, t: 0, pt: coords[0], dist: navDistance(p, coords[0]), along: 0, bearing: 0 };
  best.along = cum[best.idx] + (cum[best.idx + 1] - cum[best.idx]) * best.t;
  best.bearing = navBearing(coords[best.idx], coords[best.idx + 1]);
  return best;
}
// The point and bearing at distance d along a line.
function navAlong(coords, cum, d) {
  if (d <= 0) return { pt: coords[0], bearing: navBearing(coords[0], coords[1] || coords[0]), idx: 0 };
  let i = 1;
  while (i < cum.length - 1 && cum[i] < d) i++;
  const seg = cum[i] - cum[i - 1], t = seg ? Math.min(1, (d - cum[i - 1]) / seg) : 0;
  const a = coords[i - 1], b = coords[i];
  return { pt: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], bearing: navBearing(a, b), idx: i - 1 };
}
// Part of a line between two along-distances (for drawing the route still ahead).
function navSlice(coords, cum, from, to = Infinity) {
  const a = navAlong(coords, cum, from), out = [a.pt];
  for (let i = a.idx + 1; i < coords.length && cum[i] < to; i++) out.push(coords[i]);
  if (to < cum[cum.length - 1]) out.push(navAlong(coords, cum, to).pt);
  return out.length > 1 ? out : [a.pt, a.pt];
}

// Units: 'imperial' (feet, then miles) or 'metric'. Spoken text writes units out in full for speech engines.
function navUnitsFor(locale) { return /^en-(US|LR|MM)\b|^my\b/.test(locale || '') ? 'imperial' : 'metric'; }
function navFmtDistance(m, units) {
  if (units === 'imperial') {
    const ft = m * 3.28084, mi = m / 1609.344;
    if (ft < 1000) {
      const v = ft < 100 ? Math.max(10, Math.round(ft / 10) * 10) : ft < 500 ? Math.round(ft / 50) * 50 : Math.round(ft / 100) * 100;
      return { value: String(v), unit: 'ft', text: `${v} ft`, speech: `${v} feet` };
    }
    const v = mi < 10 ? (Math.round(mi * 10) / 10) : Math.round(mi);
    const s = v === 0.5 ? 'half a mile' : v === 1 ? '1 mile' : `${v} miles`;
    return { value: String(v), unit: 'mi', text: `${v} mi`, speech: s };
  }
  if (m < 1000) {
    const v = m < 100 ? Math.max(10, Math.round(m / 10) * 10) : Math.round(m / 50) * 50;
    if (v < 1000) return { value: String(v), unit: 'm', text: `${v} m`, speech: `${v} meters` };
  }
  const v = m < 10000 ? Math.round(m / 100) / 10 : Math.round(m / 1000);
  return { value: String(v), unit: 'km', text: `${v} km`, speech: v === 1 ? '1 kilometer' : `${v} kilometers` };
}
function navFmtDuration(s) {
  const min = Math.max(1, Math.round(s / 60));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), r = min % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}
function navCardinal(brg) { return ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'][Math.round(brg / 45) % 8]; }
