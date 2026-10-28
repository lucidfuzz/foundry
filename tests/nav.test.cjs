// Navie (nav/): geometry, instructions, guidance on simulated drives, voices, map styles and every theme.
// Runs the same source files the app is built from, in a plain JavaScript context (no browser, no network).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.join(__dirname, '..');
const { navThemes, SOURCES } = require('../scripts/nav-build.cjs');

function load() {
  const ctx = vm.createContext({ console, btoa, atob, escape, unescape, location: { origin: 'https://lucidfuzz.github.io', pathname: '/foundry/nav/studio.html' } });
  vm.runInContext(`const NAV_THEMES = ${JSON.stringify(navThemes())};`, ctx);
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

test('voices: every theme has its own guide, and nothing repeats within a trip', () => {
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
  assert.equal(speakers.size, themes.length, 'no two themes share a speaker');
  assert.equal(channels.size, themes.length, 'no two themes share a channel');
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

test('every theme and colorway makes a complete map style with a visible route', () => {
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
});

test('Foundry worlds keep their own texture and marker; Navie themes never copy one', () => {
  const foundry = N.NAV_THEMES.filter(t => !t.own), own = N.NAV_THEMES.filter(t => t.own);
  const look = t => N.NAV_WORLDS[t.id].texture + '/' + N.NAV_WORLDS[t.id].marker;
  assert.equal(new Set(foundry.map(t => N.NAV_WORLDS[t.id].texture)).size, foundry.length, 'no two Foundry worlds share a texture');
  assert.equal(new Set(foundry.map(t => N.NAV_WORLDS[t.id].marker)).size, foundry.length, 'no two Foundry worlds share a marker');
  const taken = new Set(foundry.map(look));
  for (const t of own) { assert.ok(!taken.has(look(t)), `${t.id} looks like another theme (${look(t)})`); taken.add(look(t)); }
  const full = own.map(t => look(t) + '/' + t.frame + '/' + t.colors.ground);
  assert.equal(new Set(full).size, own.length, 'every Navie theme has its own look');
});

// Names nobody else owns: characters, brands and franchises, plus the reference app's own theme names.
const NAV_BANNED = /\b(hello kitty|sanrio|barbie|disney|pixar|pok[eé]mon|pikachu|mario|nintendo|minecraft|roblox|fortnite|marvel|spider-man|batman|superman|starbucks|lego|peppa|bluey|paw patrol|sesame|hogwarts|harry potter|star wars|jedi|zelda|kirby|squishmallow|ghibli|totoro|care bears?|my little pony|rainbow road|animal crossing|sailor moon|stranger things|labubu|waze|gogirl|pink princess|lavender dream|baby blue|cherry girl|butter yellow|matcha)\b/i;

test('every Navie theme is complete, readable and original', () => {
  const own = N.NAV_THEMES.filter(t => t.own), titles = new Set(), ids = new Set();
  assert.ok(own.length >= 1, 'Navie has its own themes');
  for (const t of own) {
    assert.ok(/^[a-z][a-z0-9-]*$/.test(t.id) && !ids.has(t.id), `${t.id} id`); ids.add(t.id);
    assert.ok(t.title && !titles.has(t.title), `${t.id} title is unique`); titles.add(t.title);
    assert.ok(t.blurb && t.blurb.length <= 160, `${t.id} blurb`);
    assert.ok(t.ages.length && t.ages.every(a => N.NAV_AGES[a]), `${t.id} ages`);
    assert.ok(t.vibes.length && t.vibes.every(v => N.NAV_VIBES[v]), `${t.id} vibes`);
    assert.ok(N.NAV_FRAMES.includes(t.frame), `${t.id} frame`);
    assert.ok(t.scale >= 1 && t.scale <= 1.4, `${t.id} text scale`);
    assert.ok(t.colorways.length >= 4, `${t.id} has at least four colorways`);
    assert.equal(new Set(t.colorways.map(c => c.name)).size, t.colorways.length, `${t.id} colorway names differ`);
    for (const k of ['ground', 'ink', 'accent', 'panel', 'glow', 'alert', 'water', 'park', 'roads']) assert.ok(/^#[0-9A-Fa-f]{6}$/.test(t.colors[k]), `${t.id} color ${k}`);
    for (const cw of t.colorways) for (const [k, v] of Object.entries(cw.colors)) assert.ok(/^#[0-9A-Fa-f]{6}$/.test(v) && k in t.colors || k === 'highway', `${t.id}/${cw.name} color ${k}`);
    assert.ok(/^family=[A-Za-z0-9+]+(:[^&]+)?(&family=[A-Za-z0-9+]+(:[^&]+)?)?&display=swap$/.test(t.fontQuery), `${t.id} font link`);
    for (const f of [t.fonts.display, t.fonts.mono]) assert.ok(t.fontQuery.includes('family=' + f.replace(/ /g, '+')), `${t.id} loads ${f}`);
    const w = N.NAV_WORLDS[t.id];
    assert.ok(N.NAV_MARKERS[w.marker], `${t.id} marker`);
    assert.ok(w.texture === 'none' || N.navTexture(w.texture, '#000000', 1).data.some(v => v), `${t.id} texture ${w.texture} draws`);
    assert.ok(t.phrases.length >= 4 && t.phrases.every(p => p.length === 2 && p.every(x => x && x.length <= 22)), `${t.id} arrival headlines`);
    const v = N.NAV_VOICES[t.id], words = [t.title, t.blurb, v.speaker, v.channel, ...Object.values(v.L), ...v.depart, ...v.arrive, ...v.reroute, ...v.cruise, ...v.tags, ...t.phrases.flat(), ...t.colorways.map(c => c.name)];
    for (const x of words) assert.ok(!NAV_BANNED.test(x), `${t.id}: "${x}" uses a name we don't own`);
    for (const x of Object.values(v.L)) assert.ok(x.length <= 26, `${t.id} label "${x}" is short enough`);
    assert.ok(v.rate >= 0.8 && v.rate <= 1.2 && v.pitch >= 0.8 && v.pitch <= 1.3, `${t.id} voice speed and pitch`);
  }
  for (const t of N.NAV_THEMES.filter(t => !t.own)) assert.ok(t.ages.length && t.vibes.length, `${t.id} Foundry world is tagged`);
  for (const a of Object.keys(N.NAV_AGES)) assert.ok(N.NAV_THEMES.some(t => t.ages.includes(a)), `someone fits ${a}`);
});

test('Navie builds and leaves the theme builder alone', () => {
  const html = fs.readFileSync(path.join(ROOT, 'nav/index.html'), 'utf8');
  const js = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  assert.doesNotThrow(() => new vm.Script(js), 'the whole app parses as one script (no clashing names between files)');
  assert.ok(!/data:image|data:font|base64,[A-Za-z0-9+/]{200}/.test(html), 'Navie embeds no images or fonts');
  assert.ok(Buffer.byteLength(html) < 600000, 'Navie stays small');
  assert.ok(!fs.existsSync(path.join(ROOT, 'nav/studio.html')), 'the Studio test version is gone');
  assert.ok(!fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('NAV_THEMES'), 'the theme builder does not carry Navie');
});
