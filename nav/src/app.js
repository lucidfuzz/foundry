// Navie: the app. Browse (search) -> route (choose among up to three) -> nav (turn by turn) -> arrived.
// URL switches: ?sim=1 drives the route with the simulator, ?sim=manual waits for FoundryMaps.tick() (the screenshot harness),
// ?fixture=1 runs fully offline in the test town, ?theme=<id>&colorway=<0-4> opens a world.
const NAV_Q = new URLSearchParams(location.search);
const NAV_FIX = NAV_Q.has('fixture'), NAV_SIM = NAV_FIX || NAV_Q.has('sim'), NAV_MANUAL = NAV_Q.get('sim') === 'manual';
const $ = id => document.getElementById(id);
const navStore = {
  get(k, d) { try { const v = localStorage.getItem(`foundry-maps:${k}`); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(`foundry-maps:${k}`, JSON.stringify(v)); } catch (e) { /* private mode: settings last this visit only */ } }
};
const S = {
  world: NAV_THEMES.find(t => t.id === (NAV_Q.get('theme') || navStore.get('world', 'halcyon'))) || NAV_THEMES[0],
  colorway: +(NAV_Q.get('colorway') || navStore.get('colorway', 0)) || 0,
  style: navStore.get('voice', 'light'), units: navStore.get('units', 'auto'),
  filterAge: 'all', filterVibe: 'all', mode: 'browse', here: null, dest: null, routes: [], pick: 0, profile: 'car',
  route: null, guide: null, voice: null, st: null, following: true, passenger: false, muted: false,
  sim: null, simSpeed: 1, simTimer: null, rerouting: false, lastReroute: 0, tripStart: 0, wake: null, located: false
};
let map = null, marker = null, services = null;
const speaker = navSpeaker();
const navUnits = () => S.units === 'auto' ? navUnitsFor(navigator.language) : S.units;
const curTheme = () => S.world, navCw = () => S.world.colorways[S.colorway] || S.world.colorways[0];
const navL = () => (NAV_VOICES[S.world.id] || NAV_VOICES.halcyon).L;
const cruiseFor = style => style === 'full' ? 150 : style === 'light' ? 300 : 0;
const STYLE_NOTES = { plain: 'Directions only.', light: 'Directions, plus a line from the world when you set out, arrive or reroute, and now and then on long stretches.', full: 'Light, plus a short word from the world after most turns.' };

// Maneuver arrows (24x24, drawn for right turns; left turns are mirrored).
const NAV_ARROWS = {
  straight: '<path d="M12 21V5M6.5 10.5L12 5l5.5 5.5"/>',
  'slight-right': '<path d="M9 21v-7l8-8M11.5 5.5H17.5v6"/>',
  right: '<path d="M8 21v-8a4 4 0 0 1 4-4h8M16 5l4 4-4 4"/>',
  'sharp-right': '<path d="M7 21V7a3 3 0 0 1 5.4-1.8L19 14M19 8.5V14h-5.5"/>',
  uturn: '<path d="M17 21V10a5 5 0 0 0-10 0v8M3 14l4 4 4-4"/>',
  'merge-right': '<path d="M7 21c0-6 10-7 10-13V4M13 7.5L17 3.5l4 4M17 21c0-3-1.5-5-3.5-6.5"/>',
  roundabout: '<circle cx="12" cy="9" r="4"/><path d="M12 21v-8M15 6l5-4M15.5 2H20v4.5"/>',
  arrive: '<path d="M12 22s7-6.6 7-12a7 7 0 0 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'
};
function navArrowSvg(icon) {
  const left = /left/.test(icon), key = icon.replace('left', 'right');
  const body = NAV_ARROWS[key] || NAV_ARROWS.straight;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${left ? `<g transform="translate(24 0) scale(-1 1)">${body}</g>` : body}</svg>`;
}
const MUTE_ICONS = {
  on: '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="currentColor"/><path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a8.5 8.5 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  off: '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

function toast(msg, ms = 3500) {
  const t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.add('hidden'), ms);
}
function strip(line, head = '') {
  if (!line) return;
  const el = $('strip'); el.innerHTML = ''; if (head) { const b = document.createElement('b'); b.textContent = head; el.appendChild(b); }
  el.appendChild(document.createTextNode(line)); el.classList.remove('hidden');
  clearTimeout(strip.timer); strip.timer = setTimeout(() => el.classList.add('hidden'), 9000);
}
function setMode(mode) {
  S.mode = mode; document.body.className = mode + (NAV_SIM && mode === 'nav' ? ' sim' : '');
  $('top').classList.toggle('hidden', mode !== 'browse');
  $('sheet').classList.toggle('hidden', mode !== 'route');
  for (const id of ['banner', 'bar', 'mute']) $(id).classList.toggle('hidden', mode !== 'nav');
  $('arrive').classList.toggle('hidden', mode !== 'arrived');
  $('sim').classList.toggle('hidden', !(NAV_SIM && mode === 'nav'));
  if (mode !== 'nav') $('strip').classList.add('hidden');
  updateLock();
}

// ---------- Worlds ----------
function applyWorld() {
  const t = curTheme(), cw = navCw(), p = navPalette(t, cw), v = NAV_VOICES[t.id] || NAV_VOICES.halcyon, L = v.L, r = document.documentElement.style;
  for (const k of ['ground', 'ink', 'accent', 'panel', 'glow', 'alert']) r.setProperty(`--${k}`, p.c[k] || p.c.accent);
  r.setProperty('--land', p.land); r.setProperty('--route', p.route.line);
  r.setProperty('--on-route', [p.c.ground, p.c.ink, '#000000', '#FFFFFF'].sort((a, b) => navContrast(b, p.route.line) - navContrast(a, p.route.line))[0]);
  r.setProperty('--display', `'${t.fonts.display}', Georgia, serif`); r.setProperty('--mono', `'${t.fonts.mono}', ui-monospace, monospace`);
  r.setProperty('--dw', t.displayWeight); r.setProperty('--case', t.upper ? 'uppercase' : 'none');
  document.body.dataset.world = t.own ? '' : t.id; document.body.dataset.frame = t.own ? t.frame : '';
  r.setProperty('--scale', t.scale || 1);
  $('world-fonts').href = `https://fonts.googleapis.com/css2?${t.fontQuery}`;
  document.querySelector('meta[name=theme-color]').content = p.land;
  $('q').placeholder = L.search; $('routesLabel').textContent = L.routes; $('go').textContent = L.start; $('end').textContent = L.end;
  $('etaLabel').textContent = L.eta; $('leftLabel').textContent = L.left; $('arriveLabel').textContent = L.arrive;
  $('who').textContent = v.speaker;
  if (marker) marker.getElement().innerHTML = navMarkerSvg(t, cw);
  if (map) map.setStyle(navStyle(t, cw, { fixture: NAV_FIX ? NAV_FIXTURE.geojson : null }), { diff: false });
  speaker.set({ rate: v.rate, pitch: v.pitch });
  if (S.mode === 'nav') S.voice = navVoice(t, S.style, Date.now() % 100000);
  navStore.set('world', t.id); navStore.set('colorway', S.colorway);
  if (!$('worlds').classList.contains('hidden')) renderWorlds();
}
// A small drawing of a theme's map for its picker card: land, water, a park, roads, the route and the marker.
function navThumb(t, cw) {
  const p = navPalette(t, cw), R = p.roads, r = p.route, draw = NAV_MARKERS[p.world.marker] || NAV_MARKERS.ring;
  const k = navContrast(p.marker, p.c.ink) >= 2.5 ? p.c.ink : p.land, roads = 'M0 26H160M50 0V90M118 0V90M0 70H50';
  return `<svg class="thumb" viewBox="0 0 160 84" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="160" height="84" fill="${p.land}"/>` +
    `<path d="M0 58C40 50 80 66 160 54V70C90 82 40 66 0 76Z" fill="${p.water}"/><rect x="62" y="34" width="44" height="18" rx="4" fill="${p.park}"/>` +
    (R.casing ? `<path d="${roads}" stroke="${R.casing}" stroke-width="8"/>` : '') + `<path d="${roads}" stroke="${R.major}" stroke-width="5"/>` +
    (r.casing ? `<path d="M50 84V26H118V0" fill="none" stroke="${r.casing}" stroke-width="10" stroke-linejoin="round"/>` : '') +
    `<path d="M50 84V26H118V0" fill="none" stroke="${r.line}" stroke-width="6" stroke-linejoin="round"${r.dash ? ' stroke-dasharray="9 5"' : ''}/>` +
    `<g transform="translate(37 44) scale(.55)">${draw(p.marker, k)}</g></svg>`;
}
// Each theme's title in its own font: one tiny font request per theme, cut down to the letters of its name.
let navTitleFonts = false;
function loadTitleFonts() {
  if (navTitleFonts) return; navTitleFonts = true;
  for (const t of NAV_THEMES) {
    const l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?${t.fontQuery.split('&').filter(x => x.startsWith('family=')).slice(0, 1).join('&')}&text=${encodeURIComponent(t.title)}`;
    document.head.appendChild(l);
  }
}
function renderWorlds() {
  loadTitleFonts();
  const chip = (box, key, val, label) => {
    const b = document.createElement('button'); b.textContent = label; b.className = S[key] === val ? 'on' : '';
    b.onclick = () => { S[key] = val; renderWorlds(); }; box.appendChild(b);
  };
  const ages = $('ageFilter'), vibes = $('vibeFilter'); ages.innerHTML = vibes.innerHTML = '';
  chip(ages, 'filterAge', 'all', 'Everyone');
  for (const [k, v] of Object.entries(NAV_AGES)) if (NAV_THEMES.some(t => t.ages.includes(k))) chip(ages, 'filterAge', k, v);
  chip(vibes, 'filterVibe', 'all', 'All styles');
  for (const [k, v] of Object.entries(NAV_VIBES)) if (NAV_THEMES.some(t => t.vibes.includes(k))) chip(vibes, 'filterVibe', k, v);
  chip(vibes, 'filterVibe', 'foundry', 'Foundry worlds');
  const shown = NAV_THEMES.filter(t => (S.filterAge === 'all' || t.ages.includes(S.filterAge)) &&
    (S.filterVibe === 'all' || (S.filterVibe === 'foundry' ? !t.own : t.vibes.includes(S.filterVibe))));
  $('count').textContent = `${shown.length} theme${shown.length === 1 ? '' : 's'}`;
  const list = $('worldlist'); list.innerHTML = '';
  for (const t of shown) {
    const on = t.id === S.world.id, cw = on ? S.colorway : 0, c0 = Object.assign({}, t.colors, t.colorways[cw].colors);
    const card = document.createElement(on ? 'div' : 'button');
    card.className = 'world' + (on ? ' on' : ''); card.style.background = c0.panel || c0.ground; card.style.color = c0.ink;
    card.innerHTML = `${navThumb(t, t.colorways[cw])}<div class="txt"><b></b><small></small><div class="tags"></div></div>`;
    const b = card.querySelector('b'); b.textContent = t.title; b.style.fontFamily = `'${t.fonts.display}', serif`;
    const v = NAV_VOICES[t.id] || NAV_VOICES.halcyon;
    card.querySelector('small').textContent = on ? `${t.blurb} Voice: ${v.speaker}, through ${v.channel}.` : t.blurb;
    card.querySelector('.tags').textContent = t.ages.map(a => NAV_AGES[a]).concat(t.own ? [] : ['Foundry world']).join(' · ');
    if (on) {
      const sw = document.createElement('div'); sw.className = 'swatches';
      t.colorways.forEach((w, i) => {
        const c = Object.assign({}, t.colors, w.colors), x = document.createElement('button');
        x.className = 'sw' + (i === S.colorway ? ' on' : '');
        x.style.background = `linear-gradient(135deg, ${c.ground} 0 50%, ${navPalette(t, w).route.line} 50% 100%)`;
        x.setAttribute('aria-label', `${t.title}: ${w.name}`); x.title = w.name;
        x.onclick = () => { S.colorway = i; applyWorld(); };
        sw.appendChild(x);
      });
      card.appendChild(sw);
    } else card.onclick = () => { S.world = t; S.colorway = 0; renderWorlds.focus = true; applyWorld(); };
    list.appendChild(card);
  }
  const sel = list.querySelector('.world.on');
  if (sel && renderWorlds.focus) sel.scrollIntoView({ block: 'nearest' });
  renderWorlds.focus = false;
  for (const b of $('styleSeg').children) b.classList.toggle('on', b.dataset.style === S.style);
  for (const b of $('unitSeg').children) b.classList.toggle('on', b.dataset.units === S.units);
  $('styleNote').textContent = STYLE_NOTES[S.style];
}

// ---------- Position ----------
function onFix(fix) {
  S.here = fix;
  if (!S.located && map) { S.located = true; if (S.mode === 'browse') map.jumpTo({ center: fix.coord, zoom: 15 }); }
  if (S.mode === 'nav') navStep(fix);
  else { placeMarker(fix.coord, fix.heading); updateLock(); }
}
function placeMarker(coord, bearing) {
  if (!marker) return;
  marker.setLngLat(coord);
  if (bearing != null && isFinite(bearing)) marker.setRotation(bearing);
}
function startLocation() {
  if (NAV_FIX) { onFix({ coord: NAV_FIXTURE.start, accuracy: 5, speed: 0, heading: 0, time: Date.now() }); return; }
  if (!navigator.geolocation) { toast('Location is not available in this browser. Search still works.'); return; }
  navigator.geolocation.watchPosition(pos => {
    if (S.sim && S.mode === 'nav') return;
    const c = pos.coords;
    onFix({ coord: [c.longitude, c.latitude], accuracy: c.accuracy, speed: c.speed, heading: c.heading, time: pos.timestamp });
  }, err => toast(err.code === 1 ? 'Location is off. Turn it on to get directions from where you are.' : 'Still looking for your location.', 6000),
  { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 });
}
// Safety: no typing while moving faster than walking pace, unless a passenger says so.
function updateLock() {
  const moving = !!S.here && S.here.speed > 6 && !S.passenger && S.mode === 'browse';
  $('q').disabled = moving; $('lock').classList.toggle('hidden', !moving);
  if (moving) $('results').classList.add('hidden');
}

// ---------- Search ----------
function recents() { return navStore.get('recents', []); }
function addRecent(p) { navStore.set('recents', [p].concat(recents().filter(r => r.name !== p.name || r.sub !== p.sub)).slice(0, 8)); }
function renderResults(list, empty = '') {
  const box = $('results'); box.innerHTML = '';
  if (!list.length && !empty) { box.classList.add('hidden'); return; }
  if (!list.length) { const d = document.createElement('div'); d.className = 'result'; d.textContent = empty; box.appendChild(d); }
  for (const p of list) {
    const b = document.createElement('button'); b.className = 'result'; b.setAttribute('role', 'option');
    const away = S.here ? navFmtDistance(navDistance(S.here.coord, p.coord), navUnits()).text : '';
    b.innerHTML = '<div style="min-width:0"><b></b><small></small></div><span class="dist"></span>';
    b.querySelector('b').textContent = p.name; b.querySelector('small').textContent = p.sub || ''; b.querySelector('.dist').textContent = away;
    b.onclick = () => chooseDest(p);
    box.appendChild(b);
  }
  box.classList.remove('hidden');
}
let searchSeq = 0;
async function runSearch(q) {
  const seq = ++searchSeq;
  if (q.trim().length < 2) { renderResults(recents()); return; }
  try {
    const near = S.here ? S.here.coord : map && map.getCenter().toArray();
    const list = await services.search(q.trim(), near);
    if (seq === searchSeq) renderResults(list, 'Nothing found. Try a street, a town or a place name.');
  } catch (e) { if (seq === searchSeq) renderResults([], 'Search is not reachable right now.'); }
}
async function dropPin(lngLat) {
  if (S.mode !== 'browse') return;
  const coord = [lngLat.lng, lngLat.lat];
  let place = { name: 'Dropped pin', sub: '', coord, kind: '' };
  try { const r = await services.reverse(coord); if (r) place = Object.assign(r, { coord }); } catch (e) { /* keep the plain pin */ }
  chooseDest(place);
}

// ---------- Routes ----------
function chooseDest(place) {
  S.dest = place; addRecent(place);
  $('results').classList.add('hidden'); $('q').blur(); $('q').value = place.name;
  $('destName').textContent = place.name;
  setMode('route'); fetchRoutes();
}
async function fetchRoutes() {
  const from = S.here ? S.here.coord : map.getCenter().toArray();
  $('routes').innerHTML = '<div class="label">Finding routes</div>'; $('go').disabled = true;
  if (navDistance(from, S.dest.coord) < 25) { S.routes = []; drawRoute(); $('routes').innerHTML = '<div class="label">You are already here.</div>'; return; }
  try {
    S.routes = (await services.route(from, S.dest.coord, { profile: S.profile })).slice(0, 3); S.pick = 0;
    renderRoutes(); drawRoute(); fitRoutes(); $('go').disabled = false;
  } catch (e) {
    S.routes = []; drawRoute();
    $('routes').innerHTML = ''; const d = document.createElement('div'); d.className = 'label'; d.textContent = e.message || 'No route found.'; $('routes').appendChild(d);
  }
}
function renderRoutes() {
  const box = $('routes'); box.innerHTML = '';
  S.routes.forEach((r, i) => {
    const b = document.createElement('button'); b.className = 'route' + (i === S.pick ? ' on' : '');
    const at = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(Date.now() + r.duration * 1000));
    b.innerHTML = '<span class="t"></span><span class="meta"></span><span class="via"></span>';
    b.querySelector('.t').textContent = navFmtDuration(r.duration);
    b.querySelector('.meta').textContent = `${navFmtDistance(r.distance, navUnits()).text} · ${at}`;
    b.querySelector('.via').textContent = r.summary ? `via ${r.summary}` : '';
    b.onclick = () => { S.pick = i; renderRoutes(); drawRoute(); };
    box.appendChild(b);
  });
}
const fc = features => ({ type: 'FeatureCollection', features });
const lineF = (coords, props = {}) => ({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: coords } });
function drawRoute() {
  if (!map || !map.getSource('nav-route')) return;
  const set = (id, data) => map.getSource(id).setData(data);
  let route = fc([]), alts = fc([]), done = fc([]), dest = fc([]);
  if (S.dest && S.mode !== 'browse') dest = fc([{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: S.dest.coord } }]);
  if (S.mode === 'route' && S.routes.length) {
    route = fc([lineF(S.routes[S.pick].coords)]);
    alts = fc(S.routes.map((r, i) => i === S.pick ? null : lineF(r.coords, { i })).filter(Boolean));
  } else if ((S.mode === 'nav' || S.mode === 'arrived') && S.route) {
    const a = S.st && S.st.along || 0, R = S.route;
    route = fc([lineF(navSlice(R.coords, R.cum, a))]);
    if (a > 1) done = fc([lineF(navSlice(R.coords, R.cum, 0, a))]);
  }
  set('nav-route', route); set('nav-alts', alts); set('nav-done', done); set('nav-dest', dest);
}
function fitRoutes() {
  if (!S.routes.length) return;
  const b = new maplibregl.LngLatBounds();
  for (const r of S.routes) for (const c of r.coords) b.extend(c);
  if (S.here) b.extend(S.here.coord);
  map.fitBounds(b, { padding: { top: 70, left: 40, right: 40, bottom: $('sheet').offsetHeight + 30 }, duration: NAV_MANUAL ? 0 : 700, maxZoom: 16 });
}

// ---------- Navigation ----------
async function wakeLock() { try { if ('wakeLock' in navigator) S.wake = await navigator.wakeLock.request('screen'); } catch (e) { /* not supported: the screen may sleep */ } }
function startNav() {
  if (!S.routes.length) return;
  speaker.unlock();
  S.route = S.routes[S.pick]; S.st = null; S.following = true; S.tripStart = S.here ? S.here.time : Date.now();
  S.voice = navVoice(curTheme(), S.style, Date.now() % 100000);
  S.guide = navGuide(S.route, { profile: S.profile, cruiseEvery: cruiseFor(S.style) });
  setMode('nav'); wakeLock(); drawRoute();
  $('mute').innerHTML = S.muted ? MUTE_ICONS.off : MUTE_ICONS.on;
  if (NAV_SIM) startSim(navSim(S.route, { time: S.here ? S.here.time : Date.now() }));
  else if (S.here) navStep(S.here);
}
function navStep(fix) {
  const st = S.guide.update(fix); S.st = st;
  for (const ev of st.events) handleEvent(ev, fix);
  if (S.mode !== 'nav') return;
  if (st.offRoute) {
    placeMarker(fix.coord, fix.heading);
    $('bverb').textContent = navL().reroute; $('bdist').textContent = ''; $('broad').textContent = ''; $('then').classList.add('hidden');
    if (!S.rerouting && Date.now() - S.lastReroute >= 10000) reroute(fix);
    return;
  }
  renderBanner(st); placeMarker(st.snapped, st.bearing); drawRoute(); follow(st);
}
function handleEvent(ev, fix) {
  if (ev.type === 'offroute') { reroute(fix); return; }
  const out = S.voice.say(ev, navUnits());
  speaker.say(out.text, ev.type === 'now' || ev.type === 'arrive');
  if (out.flavor && ev.type !== 'now') strip(out.flavor, (NAV_VOICES[S.world.id] || NAV_VOICES.halcyon).speaker);
  if (ev.type === 'arrive') setTimeout(arrive, NAV_MANUAL ? 0 : 1200);
}
function renderBanner(st) {
  const nx = st.next || st.step, ins = navInstruction(nx), U = navUnits(), side = navSide(nx.modifier);
  $('arrow').innerHTML = navArrowSvg(navIcon(nx));
  $('bdist').textContent = navFmtDistance(st.distToNext, U).text;
  $('bverb').textContent = nx.type === 'arrive' ? (side ? `Destination on the ${side}` : 'Destination') : ins.verb;
  $('broad').textContent = nx.type === 'arrive' ? S.dest.name : ins.road.replace(/^(onto|on) /, '');
  const steps = S.route.steps, k = steps.indexOf(nx), after = steps[k + 1];
  const soon = after && after.start - nx.start < (S.profile === 'car' ? 400 : 120) && !(after.type === 'arrive' && !/left|right/.test(after.modifier));
  $('then').classList.toggle('hidden', !soon);
  if (soon) { $('then').innerHTML = `<span class="label">${navL().then}</span>${navArrowSvg(navIcon(after))}<span></span>`; $('then').lastChild.textContent = navInstruction(after).text; }
  const at = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(Date.now() + st.timeLeft * 1000));
  $('eta').textContent = at;
  $('left').textContent = navFmtDuration(st.timeLeft);
  $('leftDist').textContent = navFmtDistance(st.distLeft, U).text;
}
function follow(st) {
  if (!S.following || !map) return;
  const z = S.profile === 'foot' ? 17.5 : st.speed > 20 ? 15 : st.speed > 11 ? 16 : 17;
  const h = map.getContainer().clientHeight;
  map.easeTo({ center: st.snapped, bearing: st.bearing, pitch: 50, zoom: z, padding: { top: Math.round(h * 0.42), bottom: 120, left: 0, right: 0 },
    duration: NAV_MANUAL ? 0 : Math.min(900, 900 / S.simSpeed), easing: t => t });
}
async function reroute(fix) {
  if (S.rerouting) return;
  S.rerouting = true; S.lastReroute = Date.now();
  try {
    const routes = await services.route(fix.coord, S.dest.coord, { profile: S.profile, bearing: fix.heading, alternatives: false });
    if (S.mode !== 'nav') return;
    S.route = routes[0];
    S.guide = navGuide(S.route, { profile: S.profile, cruiseEvery: cruiseFor(S.style), announceDepart: false });
    const out = S.voice.say({ type: 'reroute' }, navUnits()); speaker.say(out.text, true);
    if (out.flavor) strip(out.flavor, navL().reroute);
    if (S.sim) startSim(navSim(S.route, { time: fix.time }));
    navStep(fix);
  } catch (e) { toast("Can't reach the route service. Trying again shortly."); }
  finally { S.rerouting = false; }
}
function arrive() {
  if (S.mode !== 'nav') return;
  stopSim(); setMode('arrived'); drawRoute();
  if (S.wake) { S.wake.release().catch(() => {}); S.wake = null; }
  const ph = S.world.phrases, head = ph[Math.floor((Date.now() / 1000) % ph.length)] || ['', ''];
  $('arriveHead').innerHTML = ''; head.forEach((l, i) => { if (i) $('arriveHead').appendChild(document.createElement('br')); $('arriveHead').appendChild(document.createTextNode(l)); });
  const secs = ((S.here ? S.here.time : Date.now()) - S.tripStart) / 1000;
  $('arriveSub').textContent = `${S.dest.name} · ${navFmtDuration(secs)} · ${navFmtDistance(S.st ? S.st.along : S.route.distance, navUnits()).text}`;
}
function endNav() {
  stopSim(); speaker.stop();
  if (S.wake) { S.wake.release().catch(() => {}); S.wake = null; }
  S.route = S.guide = S.st = null; S.routes = []; S.dest = null; $('q').value = '';
  setMode('browse'); drawRoute();
  if (S.here) { placeMarker(S.here.coord, S.here.heading); map.easeTo({ center: S.here.coord, zoom: 15, pitch: 0, bearing: 0, padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 600 }); }
}

// ---------- Simulator ----------
function startSim(sim) {
  stopSim(); S.sim = sim;
  if (!NAV_MANUAL) S.simTimer = setInterval(() => simTick(1), 1000 / S.simSpeed);
}
function stopSim() { clearInterval(S.simTimer); S.simTimer = null; S.sim = null; }
function simTick(dt = 1) {
  if (!S.sim) return null;
  const f = S.sim.next(dt);
  if (f) onFix(f);
  return f;
}

// ---------- Start ----------
function wire() {
  let t = null;
  $('q').addEventListener('input', e => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => runSearch(v), NAV_FIX ? 0 : 350); });
  $('q').addEventListener('focus', () => { if (!$('q').value) renderResults(recents()); });
  $('q').addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $('results').querySelector('button.result'); if (first) first.click(); } });
  $('passenger').onclick = () => { S.passenger = true; updateLock(); };
  $('worldbtn').onclick = () => { renderWorlds(); $('worlds').classList.remove('hidden'); };
  $('closeWorlds').onclick = () => $('worlds').classList.add('hidden');
  $('styleSeg').onclick = e => { const s = e.target.dataset.style; if (!s) return; S.style = s; navStore.set('voice', s); if (S.voice) S.voice = navVoice(curTheme(), s, Date.now() % 100000); renderWorlds(); };
  $('unitSeg').onclick = e => { const u = e.target.dataset.units; if (!u) return; S.units = u; navStore.set('units', u); renderWorlds(); if (S.mode === 'route') renderRoutes(); };
  $('modes').onclick = e => { const m = e.target.dataset.mode; if (!m || m === S.profile) return; S.profile = m; for (const b of $('modes').children) b.classList.toggle('on', b.dataset.mode === m); fetchRoutes(); };
  $('cancel').onclick = () => { S.routes = []; S.dest = null; $('q').value = ''; setMode('browse'); drawRoute(); };
  $('go').onclick = startNav;
  $('end').onclick = endNav;
  $('done').onclick = endNav;
  $('mute').onclick = () => { S.muted = !S.muted; speaker.set({ muted: S.muted }); if (S.muted) speaker.stop(); $('mute').innerHTML = S.muted ? MUTE_ICONS.off : MUTE_ICONS.on; };
  $('recenter').onclick = () => { S.following = true; if (S.mode === 'nav' && S.st) follow(S.st); else if (S.here) map.easeTo({ center: S.here.coord, zoom: Math.max(map.getZoom(), 15), duration: 500 }); };
  for (const b of $('sim').querySelectorAll('[data-speed]')) b.onclick = () => { S.simSpeed = +b.dataset.speed; if (S.sim && !NAV_MANUAL) startSim(S.sim); };
  $('wrong').onclick = wrongTurn;
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.mode === 'nav') wakeLock(); });
}
function wrongTurn() { if (S.sim && S.route) startSim(navSim(S.route, { start: S.sim.along, time: S.here ? S.here.time : 0, detour: { at: S.sim.along + 20, length: 220 } })); }
function boot() {
  services = NAV_FIX ? NAV_FIXTURE.services() : navNetServices();
  wire(); setMode('browse');
  if (typeof maplibregl === 'undefined') { applyWorld(); toast('The map could not load. Check your connection and reload.', 60000); return; }
  const el = document.createElement('div'); el.className = 'marker';
  marker = new maplibregl.Marker({ element: el, rotationAlignment: 'map', pitchAlignment: 'map' });
  map = new maplibregl.Map({
    container: 'map', style: { version: 8, sources: {}, layers: [] }, center: NAV_FIX ? NAV_FIXTURE.center : [-98.5, 39.5], zoom: NAV_FIX ? 15 : 3,
    attributionControl: false, canvasContextAttributes: { preserveDrawingBuffer: NAV_MANUAL }
  });
  map.on('styleimagemissing', e => { const img = navTextureFromId(e.id); if (img && !map.hasImage(e.id)) map.addImage(e.id, img, { pixelRatio: 2 }); });
  map.on('style.load', drawRoute);
  map.on('dragstart', () => { if (S.mode === 'nav') S.following = false; });
  map.on('click', 'nav-alts', e => { const i = e.features[0] && e.features[0].properties.i; if (i != null) { S.pick = i; renderRoutes(); drawRoute(); } });
  map.on('contextmenu', e => dropPin(e.lngLat));
  let press = null;
  map.on('touchstart', e => { clearTimeout(press); if (e.points.length === 1) press = setTimeout(() => dropPin(e.lngLat), 650); });
  for (const ev of ['touchend', 'touchmove', 'movestart']) map.on(ev, () => clearTimeout(press));
  marker.setLngLat(map.getCenter()).addTo(map);
  applyWorld();
  $('credit').innerHTML = NAV_FIX ? 'Offline test town · invented map data' : '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a> · OpenFreeMap · FOSSGIS routing · Photon';
  startLocation();
}
// For the screenshot harness and debugging. Nothing in the app depends on it.
window.FoundryMaps = {
  S, get map() { return map; },
  world(id, colorway = 0) { S.world = NAV_THEMES.find(t => t.id === id) || S.world; S.colorway = colorway; applyWorld(); },
  search: q => { $('q').value = q; return runSearch(q); },
  choose: (i = 0) => { const b = $('results').querySelectorAll('button.result')[i]; if (b) b.click(); },
  picker: (age = 'all', vibe = 'all') => { S.filterAge = age; S.filterVibe = vibe; renderWorlds(); $('worlds').classList.remove('hidden'); },
  here: coord => onFix({ coord, accuracy: 5, speed: 0, heading: 0, time: S.here ? S.here.time : Date.now() }),
  start: startNav, tick: (n = 1) => { let f = null; for (let i = 0; i < n && S.mode === 'nav'; i++) f = simTick(1); return f; },
  wrongTurn, end: endNav
};
if (NAV_FIX) { const s = document.createElement('script'); s.src = 'fixture.js'; s.onload = boot; s.onerror = () => toast('The test town could not load.'); document.head.appendChild(s); }
else boot();
