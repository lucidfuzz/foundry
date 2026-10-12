// Theme artwork is served as separate files (see scripts/art.py and src/art-manifest.js) and loaded only when a
// theme needs it, so adding art to more themes never slows down the first page load.
const ART_LOADS = {};
function artLoad(theme, tier) {
  const id = theme + ':' + tier;
  if (ART_LOADS[id]) return ART_LOADS[id];
  const files = ((typeof ART_MANIFEST !== 'undefined' && ART_MANIFEST[theme]) || {})[tier] || {};
  return ART_LOADS[id] = Promise.all(Object.entries(files).map(([name, url]) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve([name, img]);
    img.onerror = () => reject(new Error('Could not load ' + url));
    img.src = url;
  }))).then(Object.fromEntries).catch(e => { delete ART_LOADS[id]; throw e; });
}
// Absolute address for files the iPhone script downloads: the live site, or the published site when built locally.
function artURL(path) { return new URL(path, location.protocol === 'https:' ? location.href : 'https://lucidfuzz.github.io/foundry/').href; }
function artFor(theme, tier) { return ((typeof ART_MANIFEST !== 'undefined' && ART_MANIFEST[theme]) || {})[tier] || {}; }
