// Builds the site: node scripts/build.cjs   (check that index.html and src/tpl.js are current: --check)
// 1. Joins src/paint/*.js (each theme's widget art) into the paint block of src/tpl.js, keeping the Halcyon and Deep Range markers.
// 2. Splices the Halcyon and Deep Range modules into the widget script template (their editions switch them on).
// 3. Joins the page shell, theme data, art manifest and browser code into the standalone index.html.
// 4. Adds the export trimming plan, so each exported script carries only its own theme's code (scripts/trim.cjs).
// Theme artwork is NOT embedded: it is served from assets/ (run python3 scripts/art.py after changing art).
const fs = require('node:fs');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const read = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const check = process.argv.includes('--check');
const PAINT = ['00_lib.js', '10_directive.js', '20_longroad.js', '30_nightfall.js', '40_grimoire.js', '50_deeprange.js', '60_halcyon.js', '70_singles.js', '80_rabbit.js', '85_lists.js', '90_new4.js', '95_games.js', '96_games2.js', '97_rabbit_afterimage.js', '97_longroad_folio.js', '98_directive_civil.js', '99_index.js'];
const OPEN = '// ---------- THEMED PAINT BLOCK ----------\n', CLOSE = '// ---------- END THEMED PAINT BLOCK ----------';
const paint = PAINT.map(f => read(`src/paint/${f}`).replace(/\n+$/, '') + '\n').join('');
let tplSrc = read('src/tpl.js');
const a = tplSrc.indexOf(OPEN) + OPEN.length, b = tplSrc.indexOf(CLOSE);
if (a < OPEN.length || b < 0) throw new Error('src/tpl.js is missing its paint block markers');
const synced = tplSrc.slice(0, a) + paint + '\n// @halcyon-paint\n// @deeprange-paint\n' + tplSrc.slice(b);
if (synced !== tplSrc) { if (check) throw new Error('src/tpl.js is out of date with src/paint/. Run node scripts/build.cjs'); fs.writeFileSync('src/tpl.js', synced); tplSrc = synced; }
const tpl = tplSrc
  .replace('// @halcyon-paint', () => read('src/halcyon/paint.js') + '\n' + read('src/halcyon/fidelity.js') + '\n' + read('src/halcyon/clinical.js') + '\n' + read('src/halcyon/immersion.js') + '\n' + read('src/halcyon/living.js'))
  .replace('// @halcyon-runtime', () => read('src/halcyon/runtime.js'))
  .replace('// @deeprange-paint', () => read('src/deeprange/paint.js') + '\n' + read('src/deeprange/details.js'))
  .replace('// @deeprange-runtime', () => read('src/deeprange/runtime.js'))
  .replace('// @directive-runtime', () => read('src/directive/runtime.js'))
  .replace('// @rabbit-runtime', () => read('src/rabbit/runtime.js'))
  .replace('// @longroad-runtime', () => read('src/longroad/runtime.js'));
if (tpl.includes('</script')) throw new Error('The widget script cannot contain a closing script tag');
// 4. Export trimming: work out which template code each theme and edition can reach (see scripts/trim.cjs).
const { makePlan, loadTrimScript } = require('./trim.cjs');
const trimPlan = makePlan(tpl.trim(), loadTrimScript(process.cwd()));
const app = [read('src/foundry-data.js'), read('src/art-manifest.js'), read('src/art.js'), read('src/render.js'), read('src/halcyon/browser.js'), read('src/deeprange/browser.js'), read('src/deeprange/wallpapers.js'), read('android/runtime/foundry-runtime.js'), read('src/directive/browser.js'), read('src/rabbit/browser.js'), read('src/longroad/browser.js'), read('src/trim.js'), `const TRIM_PLAN = ${JSON.stringify(trimPlan)};`, read('src/app.js')].join('\n');
const html = read('src/page.html').replace('@@WIDGET_SCRIPT@@', () => tpl).replace('@@APPLICATION@@', () => app);
if (check) { if (read('index.html') !== html) throw new Error('index.html is stale. Run node scripts/build.cjs'); }
else fs.writeFileSync('index.html', html);
console.log(`Foundry built${check ? ' (check passed)' : ''}: index.html ${(Buffer.byteLength(html) / 1e6).toFixed(2)} MB, artwork served from assets/.`);
