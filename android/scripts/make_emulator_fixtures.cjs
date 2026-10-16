#!/usr/bin/env node
// Makes the widget scripts the emulator tests import: Halcyon Biofab, Illustrated and Original editions, exported
// exactly as the website's Export step does it (buildScript() in the live index.html, run in node's vm the same way
// tests/white-rabbit-afterimage.test.cjs on main does). Test-only; the app never runs this.
//
//   node android/scripts/make_emulator_fixtures.cjs <path to main's index.html> <out dir> [main commit]
//
// Writes <out>/halcyon-illustrated.txt, <out>/halcyon-original.txt and <out>/fixtures.json (commit + sha256 of each).
'use strict';
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path'), crypto = require('node:crypto');

const [htmlPath, outDir, commit = ''] = process.argv.slice(2);
if (!htmlPath || !outDir) { console.error('usage: make_emulator_fixtures.cjs <index.html> <out dir> [commit]'); process.exit(2); }
const html = fs.readFileSync(htmlPath, 'utf8');
const tpl = html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
// The page's own app code, minus the boot section that wires up the page.
const app = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>')).split('// ---------- boot ----------')[0];
const context = vm.createContext({
  console, Date, Math, URL, TextEncoder, TextDecoder,
  location: { protocol: 'https:', href: 'https://lucidfuzz.github.io/foundry/', hash: '' },
  localStorage: { getItem: () => null, setItem() {} },
  document: { getElementById: (id) => (id === 'tpl' ? { textContent: tpl } : null) },
});
const site = vm.runInContext(app + '\n;({state,PRESETS,EDITIONS,applyVariant,buildScript,hbOn})', context);

function exportHalcyon(editionId) {
  // A fresh visit: Halcyon is the default theme and the boot step applies its first colorway.
  site.state.th = JSON.parse(JSON.stringify(site.PRESETS.halcyon));
  site.applyVariant(0, true);
  // What applyEdition() does to the theme when the edition is picked (the rest of it only redraws the page).
  const e = site.EDITIONS.halcyon.find((x) => x.id === editionId);
  if (!e) throw new Error('no Halcyon edition ' + editionId);
  site.state.th.edition = e.id;
  site.state.th.phrases = JSON.parse(JSON.stringify(e.phrases));
  site.state.th.blurb = e.blurb;
  const script = site.buildScript();
  if (site.hbOn(site.state.th) !== (editionId === 'illustrated')) throw new Error('edition did not take: ' + editionId);
  return script;
}

fs.mkdirSync(outDir, { recursive: true });
const out = { mainCommit: commit, files: {} };
for (const id of ['illustrated', 'original']) {
  const script = exportHalcyon(id);
  const name = `halcyon-${id}.txt`;
  fs.writeFileSync(path.join(outDir, name), script);
  out.files[name] = {
    edition: id,
    firstLine: script.split('\n')[0],
    bytes: Buffer.byteLength(script),
    sha256: crypto.createHash('sha256').update(script).digest('hex'),
    header: script.split('\n').slice(1).filter((l, i, a) => a.slice(0, i + 1).every((x) => x.trimStart().startsWith('//'))).join('\n'),
  };
}
fs.writeFileSync(path.join(outDir, 'fixtures.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
