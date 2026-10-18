// Export trimming must never change what a widget does. For every theme and edition (plus a few customised
// centerpiece combinations), every widget mode and size, online and offline, the trimmed export and the full template
// run in identical Scriptable stand-ins with a frozen clock and seeded randomness, and everything they do is recorded:
// every widget property and method call, every drawing operation, every file written and every log line.
// The two recordings must be identical.
const { test } = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname, '..'), html = fs.readFileSync(root + '/index.html', 'utf8');
const tpl = html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const acorn = require('../scripts/vendor/acorn.js');
const EPOCH = Date.UTC(2026, 9, 16, 15, 20, 0);
const MODES = ['status', 'shift', 'transmission', 'solar', 'audio', 'feeds', 'youtube', 'instagram', 'discord', 'oddity', 'game', 'tracker', 'dossier'];
const FAMILIES = ['small', 'medium', 'large'];

function browser() {
  const context = vm.createContext({ console, Date, Math, URL, TextEncoder, TextDecoder, location: { protocol: 'https:', href: 'https://lucidfuzz.github.io/foundry/' }, localStorage: { getItem: () => null }, document: { getElementById: id => id === 'tpl' ? { textContent: tpl } : null } });
  const app = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>')).split('// ---------- boot ----------')[0];
  return vm.runInContext(app + '\n;({state,PRESETS,VARIANTS,EDITIONS,buildScript,scriptTheme,TRIM_PLAN})', context);
}

// ---- recording Scriptable stand-ins ----
function makeEnv(mode, family, { online, charging, files }) {
  const log = [];
  let seed = 20261016;
  const M = Object.create(Math); M.random = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  class Clock extends Date { constructor(...a) { super(...(a.length ? a : [EPOCH])); } static now() { return EPOCH; } }
  const ser = (v, d = 0) => {
    if (v === null || v === undefined || typeof v !== 'object' && typeof v !== 'function') return typeof v === 'number' && !Number.isFinite(v) ? String(v) : v;
    if (typeof v === 'function') return '[fn]';
    if (v instanceof Date) return 'D:' + (isNaN(v) ? 'invalid' : v.toISOString());
    if (v.__rec) return d > 40 ? '[deep]' : { rec: v.__name, ops: v.__ops.map(o => o.map(x => ser(x, d + 1))) };
    if (Array.isArray(v)) return v.map(x => ser(x, d + 1));
    const o = {}; for (const k of Object.keys(v)) o[k] = ser(v[k], d + 1); return o;
  };
  function rec(name, special = {}) {
    const t = { __rec: true, __name: name, __ops: [] };
    return new Proxy(t, {
      get(o, p) {
        if (p in o) return o[p];
        if (p === 'then' || typeof p === 'symbol') return undefined;
        if (p in special) return special[p];
        return (...args) => { const r = rec(name + '.' + String(p)); o.__ops.push([String(p), ...args, r]); return r; };
      },
      set(o, p, v) { o.__ops.push(['=', String(p), v]); o[p] = v; return true; }
    });
  }
  class Point { constructor(x, y) { this.x = x; this.y = y; } }
  class Rect { constructor(x, y, width, height) { Object.assign(this, { x, y, width, height }); } get minX() { return this.x; } get minY() { return this.y; } get maxX() { return this.x + this.width; } get maxY() { return this.y + this.height; } get midX() { return this.x + this.width / 2; } get midY() { return this.y + this.height / 2; } }
  class Size { constructor(width, height) { Object.assign(this, { width, height }); } }
  class Color { constructor(hex, alpha = 1) { Object.assign(this, { hex, alpha }); } static dynamic(a, b) { return { dyn: [a, b] }; } static white() { return new Color('#FFFFFF'); } static black() { return new Color('#000000'); } static clear() { return new Color('#000000', 0); } }
  const fontFn = kind => s => ({ font: kind, size: s });
  const Font = new Proxy(class { constructor(name, size) { Object.assign(this, { name, size }); } }, { get: (C, p) => p in C ? C[p] : typeof p === 'string' ? fontFn(p) : undefined });
  const ctxImage = ops => ({ __rec: true, __name: 'image', __ops: ops, size: null });
  const DrawContext = function () {
    const ops = [], self = rec('ctx', { getImage: () => { const im = ctxImage(ops.slice()); im.size = self.size; return im; } });
    return new Proxy(self, { get(o, p) { const v = o[p]; if (p === '__ops') return ops; if (typeof v === 'function' && p !== 'getImage') return (...a) => { ops.push([String(p), ...a]); return undefined; }; return v; }, set(o, p, v) { ops.push(['=', String(p), v]); o[p] = v; return true; } });
  };
  const ListWidget = function () { return rec('widget'); };
  const LinearGradient = function () { return rec('gradient'); };
  const fm = rec('fm', {
    documentsDirectory: () => '/data', libraryDirectory: () => '/lib', cacheDirectory: () => '/cache', temporaryDirectory: () => '/tmp',
    joinPath: (a, b) => a + '/' + b, fileExists: p => files.has(p), isDirectory: p => [...files.keys()].some(k => k.startsWith(p + '/')),
    readString: p => files.has(p) ? files.get(p) : null, writeString: (p, s) => { files.set(p, s); log.push(['write', p, s]); },
    createDirectory: p => log.push(['mkdir', p]), remove: p => { files.delete(p); log.push(['rm', p]); },
    listContents: p => [...files.keys()].filter(k => k.startsWith(p + '/')).map(k => k.slice(p.length + 1)),
    readImage: p => files.has(p) ? { img: p } : null, writeImage: (p, im) => { files.set(p, 'IMG'); log.push(['writeImage', p]); },
    read: p => files.has(p) ? { data: p } : null, write: (p, d) => { files.set(p, 'DATA'); log.push(['writeData', p]); },
    modificationDate: p => files.has(p) ? new Clock(EPOCH - 3600000) : null, downloadFileFromiCloud: async () => {}, isFileStoredIniCloud: () => false
  });
  const weather = { current: { temperature_2m: 69, weather_code: 3, apparent_temperature: 68, relative_humidity_2m: 47, wind_speed_10m: 10, wind_direction_10m: 200, surface_pressure: 1012, cloud_cover: 80, is_day: 1, precipitation: 0 }, hourly: { time: Array.from({ length: 24 }, (_, i) => EPOCH / 1000 + i * 3600), temperature_2m: Array.from({ length: 24 }, (_, i) => 60 + i % 9), precipitation_probability: Array.from({ length: 24 }, (_, i) => (i * 13) % 100), uv_index: Array.from({ length: 24 }, (_, i) => i % 7), visibility: Array.from({ length: 24 }, () => 16093.44), dew_point_2m: Array.from({ length: 24 }, () => 45), weather_code: Array.from({ length: 24 }, (_, i) => [0, 2, 3, 61][i % 4]) }, daily: { temperature_2m_max: [75, 77, 71], temperature_2m_min: [54, 56, 50], sunrise: [(EPOCH - 21600000) / 1000, (EPOCH + 64800000) / 1000], sunset: [(EPOCH + 14400000) / 1000, (EPOCH + 100800000) / 1000], weather_code: [3, 61, 0], precipitation_probability_max: [40, 80, 10], uv_index_max: [5, 3, 6] } };
  class Request { constructor(url) { this.url = url; log.push(['request', url]); } async loadJSON() { if (!online) throw Error('offline'); return JSON.parse(JSON.stringify(weather)); } async load() { if (!online) throw Error('offline'); return { data: this.url }; } async loadImage() { if (!online) throw Error('offline'); return { img: this.url }; } async loadString() { if (!online) throw Error('offline'); return '{}'; } }
  const ev = (start, end, title, id) => ({ title, startDate: new Clock(EPOCH + start), endDate: new Clock(EPOCH + end), calendar: { identifier: 'work', title: 'Work', color: new Color('#3366FF') }, identifier: id, isAllDay: false, location: 'Room 4', notes: null });
  const events = [ev(-900000, 900000, 'Review', 'review'), ev(3600000, 5400000, 'Planning', 'plan'), ev(7200000, 9000000, 'Call', 'call')];
  const cal = async () => { if (!online) throw Error('Calendar denied'); return events.slice(); };
  const c = {
    console: { log: (...a) => log.push(['log', ...a]), warn: (...a) => log.push(['warn', ...a]), error: (...a) => log.push(['error', ...a]) },
    Date: Clock, Math: M, JSON, Promise, Point, Rect, Size, Color, Font, Path: function () { return rec('path'); }, DrawContext, ListWidget, LinearGradient, Request,
    DateFormatter: function () { return rec('fmt', { string: d => new Date(d).toISOString() }); },
    RelativeDateTimeFormatter: function () { return rec('rfmt', { string: (a, b) => String(+a - +b) }); },
    Data: { fromBase64String: s => ({ b64: s.length }), fromString: s => ({ str: s.length }) },
    Image: { fromData: d => ({ img: ser(d), size: new Size(900, 489) }), fromFile: p => ({ img: p, size: new Size(900, 489) }) },
    SFSymbol: { named: n => rec('sf:' + n, { image: { sf: n } }) },
    FileManager: { local: () => fm, iCloud: () => fm },
    Location: { setAccuracyToThreeKilometers() {}, setAccuracyToKilometer() {}, setAccuracyToHundredMeters() {}, current: async () => { if (!online) throw Error('Location denied'); return { latitude: 40.7, longitude: -74.0 }; }, reverseGeocode: async () => [{ locality: 'Montclair' }] },
    Device: { batteryLevel: () => 0.68, isCharging: () => charging, isUsingDarkAppearance: () => false, model: () => 'iPhone', systemName: () => 'iOS', screenSize: () => new Size(393, 852), locale: () => 'en_US', language: () => 'en' },
    CalendarEvent: { between: cal, today: cal, tomorrow: async () => { if (!online) throw Error('Calendar denied'); return []; }, thisWeek: cal, nextWeek: cal },
    Calendar: { forEvents: async () => [{ identifier: 'work', title: 'Work' }], defaultForEvents: async () => ({ identifier: 'work', title: 'Work' }) },
    Keychain: { contains: () => false, get: () => null, set: () => {} },
    config: { runsInWidget: true, widgetFamily: family, runsInApp: false }, args: { widgetParameter: mode, queryParameters: {} },
    URLScheme: { forRunningScript: () => 'scriptable:///run/Test' },
    Script: { name: () => 'Test', setWidget: w => { c.result = w; log.push(['setWidget']); }, complete: () => log.push(['complete']), setShortcutOutput: () => {} },
    Timer: { schedule: () => ({ invalidate() {} }) }, setTimeout: () => 0, clearTimeout: () => {}
  };
  return { c, log, ser };
}

const compiled = new Map(); // script text -> compiled vm.Script, so each variant is compiled once
async function runOnce(script, mode, family, state) {
  const files = new Map(state.files || []);
  const { c, log, ser } = makeEnv(mode, family, { ...state, files });
  vm.createContext(c);
  if (!compiled.has(script)) { if (compiled.size > 4) compiled.clear(); compiled.set(script, new vm.Script('(async()=>{' + script + '\n})()')); }
  let error = null;
  try { await compiled.get(script).runInContext(c, { timeout: 20000 }); } catch (e) { error = String(e && e.message || e); }
  return JSON.stringify({ error, widget: ser(c.result), log: ser(log), files: [...files.entries()].sort() });
}

function variants(b) {
  const out = [];
  for (const id of Object.keys(b.PRESETS)) {
    const eds = (b.EDITIONS[id] || [{ id: 'original' }]).map(e => e.id);
    const palettes = b.VARIANTS[id] || [null];
    for (const ed of eds) out.push({ label: `${id}/${ed}`, th: { ...b.PRESETS[id], edition: ed, colors: { ...b.PRESETS[id].colors, ...((palettes[palettes.length - 1] || {}).colors || {}) } } });
  }
  // customised centerpieces: an edition flag with a different frame, and a different frame with no edition
  const P = b.PRESETS;
  if (P.directive) out.push({ label: 'directive/civil-defense with night centerpiece', th: { ...P.directive, edition: 'civil-defense', motif: 'night' } });
  if (P.rabbit) out.push({ label: 'rabbit/afterimage with market centerpiece', th: { ...P.rabbit, edition: 'afterimage', motif: 'market' } });
  if (P.longroad) out.push({ label: 'longroad/folio with botanical centerpiece', th: { ...P.longroad, edition: 'folio', motif: 'botanical' } });
  if (P.halcyon) out.push({ label: 'halcyon/original with vapor centerpiece', th: { ...P.halcyon, edition: 'original', motif: 'vapor' } });
  return out;
}

test('every trimmed export parses, is smaller than the full template, and keeps its instructions header', () => {
  const b = browser();
  for (const v of variants(b)) {
    b.state.th = v.th;
    const T = b.scriptTheme(), full = `// ${b.state.th.company} — made with Foundry\n` + tpl.trim().replace('__THEME__', JSON.stringify(T, null, 2));
    const trimmed = b.buildScript();
    assert(trimmed.length < full.length * 0.5, `${v.label}: trimmed ${trimmed.length} vs full ${full.length}`);
    assert(trimmed.includes("// Set each widget's Parameter to one of:"), `${v.label}: instructions header kept`);
    acorn.parse(trimmed, { ecmaVersion: 'latest', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true });
  }
});

test('trimmed and full exports behave identically for every theme, edition, widget, size and data state', { timeout: 900000 }, async () => {
  const b = browser();
  const states = [
    { name: 'online, charging', online: true, charging: true },
    { name: 'offline, not charging', online: false, charging: false },
    { name: 'online, saved game', online: true, charging: false, files: [['/data/foundry-game-halcyon.json', JSON.stringify({ v: 1, game: 'halcyon', turn: 3, last: EPOCH - 3600000, growth: 2, stage: 1, nutrients: 60, stress: 20, vitality: 80, log: [] })]] }
  ];
  let runs = 0;
  for (const v of variants(b)) {
    b.state.th = v.th;
    const T = b.scriptTheme(), full = `// ${b.state.th.company} — made with Foundry\n` + tpl.trim().replace('__THEME__', JSON.stringify(T, null, 2));
    const trimmed = b.buildScript();
    assert.notEqual(trimmed, full, `${v.label}: export was trimmed`);
    for (const st of states) for (const family of FAMILIES) for (const mode of MODES) {
      const a = await runOnce(full, mode, family, st), t = await runOnce(trimmed, mode, family, st);
      runs++;
      if (a !== t) {
        let i = 0; while (i < a.length && a[i] === t[i]) i++;
        assert.fail(`${v.label} ${mode} ${family} (${st.name}) differs at ${i}:\n full:    ${a.slice(Math.max(0, i - 120), i + 200)}\n trimmed: ${t.slice(Math.max(0, i - 120), i + 200)}`);
      }
    }
  }
  assert(runs > 1000, `ran ${runs} comparisons`);
});
