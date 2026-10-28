// Builds Navie: node scripts/nav-build.cjs   (check that nav/index.html is current: --check)
// Also run by scripts/build.cjs, so one build keeps both apps current.
// 1. Reads the themes, colorways and copy from src/foundry-data.js (the one source of theme truth) and each theme's two
//    Google Fonts from the site's font link in src/page.html.
// 2. Joins nav/src/*.js into nav/src/page.html and writes nav/index.html (Foundry worlds) and nav/studio.html (design your
//    own). nav/fixture.js (the offline test town) is served as its own file and loaded only with ?fixture=1.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');
const SOURCES = ['geo.js', 'providers.js', 'worlds.js', 'mapstyle.js', 'voices.js', 'voice.js', 'guidance.js', 'sim.js', 'studio.js', 'app.js'];
// Two test versions from one codebase: the Foundry worlds (nav/index.html) and the Studio, where people design their own
// map and guide (nav/studio.html).
const EDITIONS = { worlds: 'nav/index.html', studio: 'nav/studio.html' };

const foundryData = () => vm.runInContext(read('src/foundry-data.js') + '\n;({ PRESETS, VARIANTS, EDITIONS, DISPLAY_FONTS, MONO_FONTS, allPhrases })', vm.createContext({}));
function fontSpecs() {
  const link = (read('src/page.html').match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/) || [''])[0];
  return Object.fromEntries(link.split(/[?&]/).filter(x => x.startsWith('family=')).map(x => [x.slice(7).split(':')[0].replace(/\+/g, ' '), x]));
}
// Every Foundry font the Studio offers: { family: { spec, weight, display } }.
function navFonts() {
  const d = foundryData(), specs = fontSpecs(), out = {};
  for (const [f, w] of d.DISPLAY_FONTS) if (specs[f]) out[f] = { spec: specs[f], weight: w, display: true };
  for (const f of d.MONO_FONTS) if (specs[f] && !out[f]) out[f] = { spec: specs[f], weight: 400, display: false };
  return out;
}
function navThemes() {
  const d = foundryData(), specs = fontSpecs();
  const weights = Object.fromEntries(d.DISPLAY_FONTS);
  return Object.values(d.PRESETS).map(p => {
    const fonts = [p.fonts.display, p.fonts.mono].filter((f, i, a) => specs[f] && a.indexOf(f) === i);
    return {
      id: p.id, title: p.title, blurb: p.blurb, company: p.company, upper: !!p.upper,
      colors: p.colors, fonts: p.fonts, displayWeight: weights[p.fonts.display] || 600,
      fontQuery: fonts.map(f => specs[f]).join('&') + '&display=swap',
      phrases: d.allPhrases(Object.assign({}, p, { edition: 'original' })), slogans: p.slogans || [],
      colorways: (d.VARIANTS[p.id] || [{ name: 'Original', colors: {} }]).map(v => ({ name: v.name, colors: v.colors || {} })),
      editions: (d.EDITIONS[p.id] || []).map(e => e.name)
    };
  });
}

function run(check = process.argv.includes('--check')) {
  const themes = navThemes(), data = `const NAV_THEMES = ${JSON.stringify(themes)};\nconst NAV_FONTS = ${JSON.stringify(navFonts())};`;
  const code = SOURCES.map(f => read(`nav/src/${f}`)).join('\n');
  for (const [edition, file] of Object.entries(EDITIONS)) {
    const js = `const NAV_EDITION = '${edition}';\n${data}\n${code}`;
    if (js.includes('</script')) throw new Error('Navie code cannot contain a closing script tag');
    const html = read('nav/src/page.html').replace('@@APPLICATION@@', () => js);
    const out = path.join(ROOT, file);
    if (check) { if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== html) throw new Error(`${file} is stale. Run node scripts/build.cjs`); }
    else fs.writeFileSync(out, html);
    console.log(`Navie built${check ? ' (check passed)' : ''}: ${file} ${(Buffer.byteLength(html) / 1e3).toFixed(0)} KB${edition === 'worlds' ? `, ${themes.length} worlds` : ', design your own'}.`);
  }
}
module.exports = { run, navThemes, navFonts, SOURCES, EDITIONS };
if (require.main === module) run();
