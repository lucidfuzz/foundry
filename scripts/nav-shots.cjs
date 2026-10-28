// Screenshots Foundry Maps in the offline test town: node scripts/nav-shots.cjs [outdir] [--worlds=halcyon,directive] [--no-studio]
// Writes, for every world: its five colorways on the map (browse-<world>-<n>.png), the route choice, a mid-drive screen and
// the arrival card (<world>-route|drive|arrive.png); the Studio's starting looks, design screen and a drive (studio-*.png);
// plus contact sheets (contact-*.png). Look at them before calling map or
// screen work done (CLAUDE.md rule 8). Needs Playwright with Chromium (preinstalled in Claude's cloud sessions); downloads
// MapLibre from npm once into .cache/ and serves it in place of the CDN, so it runs with no map network access. Map labels
// need OpenFreeMap's glyph server: offline they are simply absent.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const ROOT = path.join(__dirname, '..');
const ML = '5.24.0';
const args = process.argv.slice(2);
const OUT = path.resolve(args.find(a => !a.startsWith('--')) || path.join(ROOT, '.cache/nav-shots'));
const only = (args.find(a => a.startsWith('--worlds=')) || '').slice(9).split(',').filter(Boolean);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };

function maplibre() {
  const dir = path.join(ROOT, '.cache', `maplibre-gl-${ML}`);
  if (!fs.existsSync(path.join(dir, 'package/dist/maplibre-gl.js'))) {
    fs.mkdirSync(dir, { recursive: true });
    execFileSync('npm', ['pack', `maplibre-gl@${ML}`, '--pack-destination', dir], { stdio: 'ignore' });
    execFileSync('tar', ['xzf', path.join(dir, `maplibre-gl-${ML}.tgz`), '-C', dir]);
  }
  return path.join(dir, 'package/dist');
}
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.resolve(ROOT, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(ROOT)) { rsp.writeHead(403); rsp.end(); return; }
      fs.readFile(p, (e, b) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.setHeader('Content-Type', MIME[path.extname(p)] || 'application/octet-stream'); rsp.end(b); });
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}
const T0 = Date.now(), log = (...a) => { if (args.includes('--verbose')) console.log(((Date.now() - T0) / 1000).toFixed(1), ...a); };
const idle = page => page.evaluate(() => new Promise(r => {
  const m = window.FoundryMaps.map, t = setTimeout(r, 6000);
  m.once('idle', () => { clearTimeout(t); setTimeout(r, 150); }); m.triggerRepaint();
}));

async function contact(browser, files, name, cols, label) {
  const page = await browser.newPage({ viewport: { width: cols * 200, height: 100 } });
  const cells = files.map(f => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString('base64')}"><figcaption>${label(f)}</figcaption></figure>`).join('');
  await page.setContent(`<style>body{margin:0;background:#222;color:#ddd;font:11px sans-serif;display:grid;grid-template-columns:repeat(${cols},200px)}figure{margin:4px}img{width:192px;display:block}figcaption{padding:3px 0}</style>${cells}`);
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
  await page.close();
}

(async () => {
  const { chromium } = require('playwright');
  fs.mkdirSync(OUT, { recursive: true });
  const dist = maplibre(), srv = await serve(), base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const problems = [], shots = { browse: [], scenes: [] };
  // Each world gets a fresh page; four run at once (after a style switch the map takes a few seconds to settle, so the
  // screenshot waits, and running worlds side by side hides most of that).
  async function shoot([id, n]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'en-US' });
    await ctx.route(/cdn\.jsdelivr\.net\/npm\/maplibre-gl@/, r => r.fulfill({ path: path.join(dist, path.basename(new URL(r.request().url()).pathname)) }));
    await ctx.route(/tiles\.openfreemap\.org/, r => r.abort());
    const page = await ctx.newPage(), mine = { browse: [], scenes: [] };
    page.on('pageerror', e => problems.push(`${id}: page error: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|glyphs|openfreemap|ERR_FAILED/i.test(m.text())) problems.push(`${id}: console: ${m.text()}`); });
    await page.clock.install({ time: new Date('2026-10-28T17:00:00') });
    await page.goto(`${base}/nav/index.html?fixture=1&sim=manual&theme=${id}`);
    await page.waitForFunction(() => window.FoundryMaps && window.FoundryMaps.map && window.FoundryMaps.map.isStyleLoaded());
    const snap = async (list, f) => { await idle(page); await page.screenshot({ path: path.join(OUT, f) }); list.push(f); log(f); };
    for (let i = 0; i < n; i++) {
      await page.evaluate(([id, i]) => { window.FoundryMaps.world(id, i); window.FoundryMaps.map.jumpTo({ center: [12.0, 45.0], zoom: 15.2, bearing: 0, pitch: 0 }); }, [id, i]);
      await snap(mine.browse, `browse-${id}-${i}.png`);
    }
    await page.evaluate(id => { window.FoundryMaps.world(id, 0); window.FoundryMaps.here(NAV_FIXTURE.start); return window.FoundryMaps.search('market'); }, id);
    await page.evaluate(() => window.FoundryMaps.choose(0));
    await page.waitForFunction(() => window.FoundryMaps.S.routes.length > 0);
    await snap(mine.scenes, `${id}-route.png`);
    await page.evaluate(() => { window.FoundryMaps.start(); window.FoundryMaps.tick(75); });
    await snap(mine.scenes, `${id}-drive.png`);
    await page.evaluate(() => window.FoundryMaps.tick(400));
    await page.waitForFunction(() => window.FoundryMaps.S.mode === 'arrived');
    await snap(mine.scenes, `${id}-arrive.png`);
    await ctx.close();
    return mine;
  }
  // The Studio test version (nav/studio.html): each starting look, a remix, a random design, the design screen and a drive.
  async function studio() {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'en-US' });
    await ctx.route(/cdn\.jsdelivr\.net\/npm\/maplibre-gl@/, r => r.fulfill({ path: path.join(dist, path.basename(new URL(r.request().url()).pathname)) }));
    await ctx.route(/tiles\.openfreemap\.org/, r => r.abort());
    const page = await ctx.newPage(), mine = { browse: [], scenes: [] };
    page.on('pageerror', e => problems.push(`studio: page error: ${e.message}`));
    await page.clock.install({ time: new Date('2026-10-28T17:00:00') });
    await page.goto(`${base}/nav/studio.html?fixture=1&sim=manual`);
    await page.waitForFunction(() => window.FoundryMaps && window.FoundryMaps.map && window.FoundryMaps.map.isStyleLoaded());
    const snap = async (list, f) => { await idle(page); await page.screenshot({ path: path.join(OUT, f) }); list.push(f); log(f); };
    const designs = await page.evaluate(() => NAV_STUDIO_STARTS.map((p, i) => ['start-' + i, Object.assign({}, NAV_STUDIO_BASE, p)])
      .concat([['remix-rabbit', Object.assign({}, NAV_STUDIO_BASE, navStudioFromWorld(NAV_THEMES.find(t => t.id === 'rabbit')))], ['surprise', navStudioSurprise(42)]]));
    for (const [name, d] of designs) {
      await page.evaluate(d => { window.FoundryMaps.design(d); window.FoundryMaps.map.jumpTo({ center: [12.0, 45.0], zoom: 15.2, bearing: 0, pitch: 0 }); }, d);
      await snap(mine.browse, `browse-studio-${name}.png`);
    }
    await page.evaluate(d => window.FoundryMaps.design(d), designs[3][1]);
    await page.evaluate(() => window.FoundryMaps.studio());
    await snap(mine.scenes, 'studio-design.png');
    await page.evaluate(() => document.getElementById('studio').scrollTo(0, 1500));
    await snap(mine.scenes, 'studio-design-voice.png');
    await page.evaluate(() => { document.getElementById('closeStudio').click(); window.FoundryMaps.here(NAV_FIXTURE.start); return window.FoundryMaps.search('market'); });
    await page.evaluate(() => window.FoundryMaps.choose(0));
    await page.waitForFunction(() => window.FoundryMaps.S.routes.length > 0);
    await page.evaluate(() => { window.FoundryMaps.start(); window.FoundryMaps.tick(75); });
    await snap(mine.scenes, 'studio-drive.png');
    await ctx.close();
    return mine;
  }
  const worlds = require('./nav-build.cjs').navThemes().map(t => [t.id, t.colorways.length]).filter(([id]) => !only.length || only.includes(id));
  const queue = worlds.slice(), done = {};
  const studioRun = args.includes('--no-studio') ? null : studio();
  await Promise.all([0, 1, 2].map(async () => { for (let w; (w = queue.shift());) done[w[0]] = await shoot(w); }));
  for (const [id] of worlds) { shots.browse.push(...done[id].browse); shots.scenes.push(...done[id].scenes); }
  if (studioRun) { const st = await studioRun; shots.browse.push(...st.browse); shots.scenes.push(...st.scenes); }
  await contact(browser, shots.browse, 'contact-colorways.png', 5, f => f.replace(/^browse-|\.png$/g, ''));
  await contact(browser, shots.scenes, 'contact-scenes.png', 3, f => f.replace(/\.png$/, ''));
  await browser.close(); srv.close();
  console.log(`Foundry Maps shots: ${shots.browse.length + shots.scenes.length} screens and 2 contact sheets in ${OUT}`);
  if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
})().catch(e => { console.error(e); process.exit(1); });
