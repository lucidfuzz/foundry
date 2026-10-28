// Navie (nav/): geometry, instructions, guidance on simulated drives, voices, map styles and the Studio.
// Runs the same source files the app is built from, in a plain JavaScript context (no browser, no network).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.join(__dirname, '..');
const { navThemes, navFonts, SOURCES } = require('../scripts/nav-build.cjs');

function load() {
  const ctx = vm.createContext({ console, btoa, atob, escape, unescape, location: { origin: 'https://lucidfuzz.github.io', pathname: '/foundry/nav/studio.html' } });
  vm.runInContext(`const NAV_THEMES = ${JSON.stringify(navThemes())}; const NAV_FONTS = ${JSON.stringify(navFonts())};`, ctx);
  for (const f of SOURCES.filter(f => f !== 'app.js')) vm.runInContext(fs.readFileSync(path.join(ROOT, 'nav/src', f), 'utf8'), ctx, { filename: f });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'nav/fixture.js'), 'utf8'), ctx, { filename: 'fixture.js' });
  return new Proxy({}, { get: (_, k) => vm.runInContext(k, ctx) });
}
const N = load();
const plain = x => JSON.parse(JSON.stringify(x)); // values from the app's context, compared as plain data
const mixed = () => N.navParseOsrm(JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/nav/osrm-mixed.json'), 'utf8')))[0];
const townRoute = (to = N.NAV_FIXTURE.node(8, 4)) => N.navParseOsrm(N.NAV_FIXTURE.osrm(N.NAV_FIXTURE.start, to))[0];
function drive(route, opts = {}, simOpts = {}) {
  const g = N.navGuide(route, opts), sim = N.navSim(route, simOpts), events = [];
  let f, n = 0;
  while ((f = sim.next(1)) && n++ < 5000) { for (const e of g.update(f).events) events.push(e); if (g.arrived) break; }
  return { events, arrived: g.arrived };
}

test('geometry and formatting', () => {
  assert.ok(Math.abs(N.navDistance([0, 0], [0, 1]) - 111195) < 10);
  assert.equal(Math.round(N.navBearing([0, 0], [1, 0])), 90);
  assert.equal(N.navTurn(350, 10), 20);
  assert.equal(N.navFmtDistance(150, 'imperial').text, '500 ft');
  assert.equal(N.navFmtDistance(805, 'imperial').speech, 'half a mile');
  assert.equal(N.navFmtDistance(5000, 'imperial').text, '3.1 mi');
  assert.equal(N.navFmtDistance(240, 'metric').text, '250 m');
  assert.equal(N.navFmtDistance(12345, 'metric').speech, '12 kilometers');
  assert.equal(N.navFmtDuration(3900), '1 hr 5 min');
  assert.equal(N.navUnitsFor('en-US'), 'imperial');
  assert.equal(N.navUnitsFor('en-GB'), 'metric');
});

test('OSRM routes parse into steps placed along the line', () => {
  const r = mixed();
  assert.equal(r.steps.length, 14);
  for (let i = 1; i < r.steps.length; i++) assert.ok(r.steps[i].start >= r.steps[i - 1].start, `step ${i} starts after step ${i - 1}`);
  assert.equal(r.steps.at(-1).start, r.length);
  assert.throws(() => N.navParseOsrm({ code: 'NoRoute', routes: [] }), /No route/);
  const town = N.navParseOsrm(N.NAV_FIXTURE.osrm(N.NAV_FIXTURE.start, N.NAV_FIXTURE.node(8, 4)));
  assert.equal(town.length, 2, 'the test town offers two routes');
});

test('plain instructions for every maneuver type', () => {
  const t = plain(mixed().steps.map(s => N.navInstruction(s).text));
  assert.deepEqual(t, [
    'Head east on Market Street', 'Turn left onto Valencia Street', 'At the roundabout, take the second exit onto Dolores Street',
    'Take the ramp on the right toward San Francisco, Golden Gate', 'Merge left onto Bayshore Freeway (US 101)', 'Take exit 432B toward Cesar Chavez Street',
    'Keep left at the fork onto Cesar Chavez Street', 'At the end of the road, turn right onto Harrison Street', 'Continue onto Folsom Street',
    'Keep left onto Folsom Street', 'Make a U-turn onto Folsom Street', 'Turn sharp right', 'At Dolores Circle, take the third exit onto Oak Street',
    'Your destination will be on the left'
  ]);
  const icons = plain(mixed().steps.map(N.navIcon));
  assert.deepEqual(icons.slice(0, 5), ['straight', 'left', 'roundabout', 'slight-right', 'merge-left']);
});

test('a drive announces each maneuver once, in order, and arrives', () => {
  const { events, arrived } = drive(townRoute());
  assert.ok(arrived);
  const types = events.map(e => e.type);
  assert.equal(types[0], 'depart');
  assert.equal(types.at(-1), 'arrive');
  assert.deepEqual(types, ['depart', 'now', 'continue', 'early', 'arrive']);
  const { events: long, arrived: ok } = drive(mixed());
  assert.ok(ok, 'the mixed route arrives');
  const said = new Set();
  for (const e of long.filter(e => e.type === 'now' || e.type === 'early')) {
    const key = `${e.type}:${e.step.start}`;
    assert.ok(!said.has(key), `${key} announced once`); said.add(key);
  }
  // Every maneuver is either spoken at the time, or covered by a "then" on the one before, or by the start.
  const covered = new Set(long.flatMap(e => [e.type === 'now' && e.step, e.then, e.next].filter(Boolean)));
  for (const s of mixed().steps.slice(1, -1)) assert.ok([...covered].some(c => c.start === s.start && c.type === s.type), `${s.type} at ${Math.round(s.start)} m is announced`);
});

test('a wrong turn raises exactly one off-route event', () => {
  const r = townRoute();
  const { events } = drive(r, {}, { detour: { at: 300, length: 200 } });
  assert.equal(events.filter(e => e.type === 'offroute').length, 1);
  const clean = drive(r, {}, { noise: 6 });
  assert.equal(clean.events.filter(e => e.type === 'offroute').length, 0, 'GPS jitter alone does not reroute');
  assert.ok(clean.arrived);
});

test('voices: every world has its own guide, and nothing repeats within a trip', () => {
  const themes = N.NAV_THEMES, speakers = new Set(), channels = new Set();
  for (const t of themes) {
    const v = N.NAV_VOICES[t.id];
    assert.ok(v, `${t.id} has a voice`);
    for (const k of ['search', 'routes', 'start', 'end', 'eta', 'left', 'arrive', 'reroute', 'then']) assert.ok(v.L[k], `${t.id} label ${k}`);
    assert.ok(v.depart.length >= 6 && v.arrive.length >= 6 && v.reroute.length >= 4 && v.cruise.length >= 8 && v.tags.length >= 6, `${t.id} pool sizes`);
    speakers.add(v.speaker); channels.add(v.channel);
    const all = [...v.depart, ...v.arrive, ...v.reroute, ...v.cruise, ...v.tags];
    assert.equal(new Set(all).size, all.length, `${t.id} lines are all different`);
  }
  assert.equal(speakers.size, themes.length, 'no two worlds share a speaker');
  assert.equal(channels.size, themes.length, 'no two worlds share a channel');
  const pool = N.navPool(['a', 'b', 'c', 'd'], 5), seq = Array.from({ length: 12 }, pool);
  for (let i = 0; i < 12; i += 4) assert.equal(new Set(seq.slice(i, i + 4)).size, 4, 'each line once per round');
  for (let i = 1; i < 12; i++) assert.notEqual(seq[i], seq[i - 1], 'never the same line twice in a row');
  const plain = N.navVoice(themes[0], 'plain', 1), full = N.navVoice(themes[0], 'full', 1), step = mixed().steps[1];
  assert.equal(plain.say({ type: 'now', step }, 'imperial').text, 'Turn left onto Valencia Street.');
  assert.equal(plain.say({ type: 'cruise' }).text, '');
  const said = full.say({ type: 'now', step }, 'imperial');
  assert.ok(said.text.startsWith('Turn left onto Valencia Street. ') && said.flavor, 'the world speaks after the instruction, never before');
});

test('copy rules: no ellipses and no Japanese, Chinese or Korean characters in Navie', () => {
  const files = SOURCES.map(f => `nav/src/${f}`).concat(['nav/src/page.html', 'nav/fixture.js']);
  for (const f of files) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!s.includes('…'), `${f} has no ellipsis`);
    assert.ok(!/[぀-ヿ㐀-鿿가-힯]/.test(s), `${f} has no CJK characters`);
  }
});

test('every world and colorway makes a complete map style with a visible route', () => {
  const textures = new Set(), markers = new Set();
  for (const t of N.NAV_THEMES) {
    const w = N.NAV_WORLDS[t.id];
    assert.ok(w, `${t.id} has a map treatment`);
    assert.ok(N.NAV_MARKERS[w.marker], `${t.id} marker exists`);
    textures.add(w.texture); markers.add(w.marker);
    t.colorways.forEach((cw, i) => {
      for (const fixture of [null, N.NAV_FIXTURE.geojson]) {
        const st = N.navStyle(t, cw, { fixture });
        const ids = st.layers.map(l => l.id);
        assert.equal(new Set(ids).size, ids.length, `${t.id}/${i} layer ids unique`);
        for (const l of st.layers) if (l.source) assert.ok(st.sources[l.source], `${t.id}/${i} ${l.id} source exists`);
        for (const k of ['nav-route', 'nav-alts', 'nav-done', 'nav-dest', 'road-major', 'water', 'place']) assert.ok(ids.includes(k), `${t.id}/${i} has ${k}`);
      }
      const p = N.navPalette(t, cw);
      const seen = Math.max(N.navContrast(p.route.line, p.land), p.route.casing ? N.navContrast(p.route.casing, p.land) : 0);
      assert.ok(seen >= 3, `${t.id}/${cw.name}: route contrast ${seen.toFixed(2)}`);
      assert.ok(N.navContrast(p.label, p.land) >= 4.5, `${t.id}/${cw.name}: label contrast`);
      assert.ok(N.navTextureFromId(N.navTextureId(p.texture.kind, p.texture.color, p.texture.alpha)), `${t.id} texture draws`);
    });
  }
  assert.equal(textures.size, N.NAV_THEMES.length, 'no two worlds share a texture');
  assert.equal(markers.size, N.NAV_THEMES.length, 'no two worlds share a marker');
});

test('Studio: designs are checked, shareable and draw a full map', () => {
  const bad = N.navStudioClean({ land: 'red', ink: '#12345', route: '#00FF88', texture: 'lava', marker: '<img>', display: 'Comic Sans', name: '<script>alert(1)</script>Mine', depart: ['ok', 7, 'x'.repeat(500)], textureStrength: 9 });
  assert.equal(bad.land, N.NAV_STUDIO_BASE.land);
  assert.equal(bad.ink, N.NAV_STUDIO_BASE.ink);
  assert.equal(bad.route, '#00FF88');
  assert.equal(bad.texture, N.NAV_STUDIO_BASE.texture);
  assert.equal(bad.marker, N.NAV_STUDIO_BASE.marker);
  assert.equal(bad.display, N.NAV_STUDIO_BASE.display);
  assert.equal(bad.textureStrength, N.NAV_STUDIO_BASE.textureStrength);
  assert.ok(!/[<>]/.test(bad.name));
  assert.deepEqual(plain(bad.depart.map(x => x.length)), [2, 140]);
  const d = N.navStudioClean(Object.assign({}, N.NAV_STUDIO_BASE, { name: 'Rosé route', depart: ['Allons-y.'] }));
  const link = N.navStudioLink(d);
  assert.ok(link.startsWith('https://lucidfuzz.github.io/foundry/nav/studio.html#d='));
  assert.deepEqual(plain(N.navStudioFromHash(new URL(link).hash)), plain(d));
  assert.equal(N.navStudioFromHash('#d=not-json'), null);
  const designs = N.NAV_STUDIO_STARTS.map(s => Object.assign({}, N.NAV_STUDIO_BASE, s)).concat(N.NAV_THEMES.map(N.navStudioFromWorld), [N.navStudioSurprise(1), N.navStudioSurprise(2)]);
  for (const raw of designs) {
    const t = N.navStudioTheme(N.navStudioClean(raw)), st = N.navStyle(t, t.colorways[0], { fixture: N.NAV_FIXTURE.geojson });
    assert.ok(st.layers.some(l => l.id === 'nav-route'), `${raw.name} draws a route`);
    assert.ok(N.NAV_VOICES.studio.depart.length, `${raw.name} has lines`);
    assert.ok(N.NAV_FONTS[t.fonts.display] && N.NAV_FONTS[t.fonts.mono], `${raw.name} fonts are offered`);
  }
});

test('Navie builds both test versions and leaves the theme builder alone', () => {
  for (const f of ['nav/index.html', 'nav/studio.html']) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(html.includes("const NAV_EDITION = '" + (f.includes('studio') ? 'studio' : 'worlds') + "'"), `${f} edition`);
    assert.ok(!/data:image|data:font|base64,[A-Za-z0-9+/]{200}/.test(html), `${f} embeds no images or fonts`);
    assert.ok(Buffer.byteLength(html) < 300000, `${f} stays small`);
  }
  assert.ok(!fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('NAV_EDITION'), 'the theme builder does not carry Navie');
});
