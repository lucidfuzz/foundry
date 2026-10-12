const ROLES = {
  halcyon: { panel: 'panel', ink: 'ink', headBg: 'ink', headText: 'ground', altBg: 'accent', altText: 'ink', accent: 'accent' },
  directive: { panel: 'panel', ink: 'ink', headBg: 'alert', headText: 'ink', altBg: 'accent', altText: 'ground', accent: 'glow' },
  longroad: { panel: 'panel', ink: 'ink', headBg: 'ink', headText: 'panel', altBg: 'accent', altText: 'panel', accent: 'accent' },
  nightfall: { panel: 'panel', ink: 'ink', headBg: 'ink', headText: 'ground', altBg: 'accent', altText: 'ground', accent: 'accent' },
  grimoire: { panel: 'panel', ink: 'ink', headBg: 'accent', headText: 'ground', altBg: 'glow', altText: 'ink', accent: 'accent' },
  deeprange: { panel: 'panel', ink: 'ink', headBg: 'accent', headText: 'ground', altBg: 'glow', altText: 'ink', accent: 'alert' },
  rabbit: { panel: 'panel', ink: 'ink', headBg: 'glow', headText: 'ink', altBg: 'accent', altText: 'panel', accent: 'accent' },
  neon: { panel: 'panel', ink: 'ink', headBg: 'accent', headText: 'ground', altBg: 'alert', altText: 'ground', accent: 'glow' },
  vapor: { panel: 'panel', ink: 'ink', headBg: 'accent', headText: 'ground', altBg: 'glow', altText: 'ground', accent: 'glow' },
  wild: { panel: 'panel', ink: 'ink', headBg: 'glow', headText: 'panel', altBg: 'accent', altText: 'panel', accent: 'accent' },
  odds: { panel: 'panel', ink: 'ink', headBg: 'accent', headText: 'panel', altBg: 'glow', altText: 'panel', accent: 'accent' }
};
const STORE = 'foundry.v1', CHECKS = 'foundry.checks.v1';
const $ = (id) => document.getElementById(id);
const clone = (o) => JSON.parse(JSON.stringify(o));
const state = { th: clone(PRESETS.halcyon), lock: 0, view: 'lock', device: 3 };
if (typeof location !== 'undefined' && location.hash === '#deep-range') { state.th = clone(PRESETS.deeprange); state.th.edition = 'expanded'; state.th.phrases = clone(EDITIONS.deeprange[1].phrases); }
let checks = {};
try { const saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved && saved.th && PRESETS[saved.th.id]) Object.assign(state, saved); } catch (e) {}
try { checks = JSON.parse(localStorage.getItem(CHECKS) || '{}') || {}; } catch (e) { checks = {}; }
function save() { try { localStorage.setItem(STORE, JSON.stringify({ th: state.th, device: state.device })); } catch (e) {} }
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'theme'; }

async function fontsFor(th) {
  const loads = [document.fonts.load(`italic 400 12px "${th.fonts.display}"`), document.fonts.load(`${dispWeight(th.fonts.display)} 46px "${th.fonts.display}"`), document.fonts.load(`400 12px "${th.fonts.mono}"`), document.fonts.load(`500 12px "${th.fonts.mono}"`)];
  try { await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 3000))]); } catch (e) {}
}

// ---------- presets ----------
function buildPresets() {
  const host = $('presets'); host.textContent = '';
  Object.values(PRESETS).forEach(p => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'preset'; b.dataset.id = p.id;
    b.setAttribute('aria-pressed', String(state.th.id === p.id));
    const cv = document.createElement('canvas'); cv.width = 260; cv.height = 563;
    const ic = document.createElement('div'); ic.className = 'preset-icons'; ic.setAttribute('aria-hidden', 'true');
    const t = document.createElement('strong'); t.textContent = p.title;
    const d = document.createElement('small'); d.textContent = p.blurb;
    b.append(cv, ic, t, d);
    if (EDITIONS[p.id]) { const tag = document.createElement('span'); tag.className = 'ed-tag'; tag.textContent = EDITIONS[p.id].length + ' editions'; b.append(tag); }
    b.addEventListener('click', () => {
      state.th = clone(p); state.lock = 0; applyVariant(0, true); syncFields(); markPresets(); buildVariants(); refresh(true);
      buildEditions();
    });
    host.append(b);
    fontsFor(p).then(() => {
      drawWallpaper(cv, p, 'lock', 0);
      APPS.slice(0, 5).forEach(([k], i) => {
        const c2 = document.createElement('canvas'); c2.width = 96; c2.height = 96; drawIcon(c2, p, k, i);
        const img = document.createElement('img'); img.src = c2.toDataURL('image/png'); img.alt = ''; ic.append(img);
      });
    });
  });
}
function markPresets() { document.querySelectorAll('.preset').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === state.th.id))); }

// ---------- editions ----------
function buildEditions() {
  const wrap = $('editions-wrap'), host = $('editions'), eds = editionsFor(state.th); if (!wrap || !host) return;
  wrap.hidden = !eds; host.textContent = ''; if (!eds) return;
  const cur = editionOf(state.th);
  eds.forEach(e => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'variant'; b.dataset.edition = e.id; b.setAttribute('aria-pressed', String(cur.id === e.id));
    const cv = document.createElement('canvas'); cv.width = 130; cv.height = 281;
    const name = document.createElement('span'); name.textContent = e.name;
    b.append(cv, name); b.addEventListener('click', () => applyEdition(e.id)); host.append(b);
    const t = clone(state.th); t.edition = e.id; t.phrases = clone(e.phrases);
    fontsFor(t).then(() => { if (hbOn(t)) hbWarm(false); drawWallpaper(cv, t, 'lock', 0); });
  });
}
function applyEdition(id) {
  const e = (editionsFor(state.th) || []).find(x => x.id === id); if (!e) return;
  state.th.edition = id; state.th.phrases = clone(e.phrases); state.th.blurb = e.blurb; state.lock = 0;
  if (hbOn(state.th)) hbWarm(true);
  syncFields(); buildEditions(); buildVariants(); refresh(true);
}

// ---------- variants ----------
function applyVariant(i, silent) {
  const th = state.th, base = PRESETS[th.id], v = (VARIANTS[th.id] || [])[i];
  if (!base || !v) return;
  th.colors = Object.assign({}, base.colors, v.colors);
  th.seed = v.seed || 0;
  th.knobs = Object.assign({ scale: 1, shift: 0, texture: 1, glow: 1, details: true }, v.knobs || {});
  th.variant = i;
  if (!silent) { syncFields(); markVariants(); refresh(); }
}
function buildVariants() {
  const host = $('variants'); host.textContent = '';
  const list = VARIANTS[state.th.id] || [];
  list.forEach((v, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'variant'; b.dataset.i = i;
    const cv = document.createElement('canvas'); cv.width = 130; cv.height = 281;
    const name = document.createElement('span'); name.textContent = v.name;
    b.append(cv, name);
    b.addEventListener('click', () => applyVariant(i));
    host.append(b);
    const t = clone(state.th); t.colors = Object.assign({}, PRESETS[t.id].colors, v.colors); t.seed = v.seed || 0; t.knobs = Object.assign({}, v.knobs || {});
    fontsFor(t).then(() => drawWallpaper(cv, t, 'lock', i % 4));
  });
  markVariants();
}
function markVariants() { document.querySelectorAll('#variants .variant').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === (state.th.variant || 0)))); }

// ---------- fields ----------
const COLOR_FIELDS = [['ground', 'Background'], ['ink', 'Lines and text'], ['accent', 'Accent'], ['glow', 'Glow'], ['panel', 'Widget panel']];
function buildFields() {
  const sw = $('swatches'); sw.textContent = '';
  COLOR_FIELDS.forEach(([k, label]) => {
    const l = document.createElement('label'); l.className = 'sw';
    const i = document.createElement('input'); i.type = 'color'; i.id = 'c-' + k;
    i.addEventListener('input', () => { state.th.colors[k] = i.value; refresh(); });
    l.append(i, document.createTextNode(label)); sw.append(l);
  });
  const knob = (id, key, num) => $(id).addEventListener('input', (e) => { state.th.knobs = state.th.knobs || {}; state.th.knobs[key] = num ? +e.target.value : e.target.checked; refresh(); });
  knob('k-scale', 'scale', true); knob('k-shift', 'shift', true); knob('k-texture', 'texture', true); knob('k-glow', 'glow', true);
  $('k-details').addEventListener('change', (e) => { state.th.knobs = state.th.knobs || {}; state.th.knobs.details = e.target.checked; refresh(); });
  ICON_STYLES.forEach(([v, n]) => { const o = document.createElement('option'); o.value = v; o.textContent = n; $('f-iconstyle').append(o); });
  GLYPH_CHOICES.forEach(([v, n]) => { const o = document.createElement('option'); o.value = v; o.textContent = n; $('f-glyphs').append(o); });
  $('f-iconstyle').addEventListener('change', (e) => { state.th.iconStyle = e.target.value; refresh(); });
  $('f-glyphs').addEventListener('change', (e) => { state.th.glyphs = e.target.value || null; refresh(); });
  $('f-case').addEventListener('change', (e) => { state.th.upper = e.target.value === 'upper'; refresh(); });
  const ds = $('f-display'); DISPLAY_FONTS.forEach(([f]) => { const o = document.createElement('option'); o.value = f; o.textContent = f; ds.append(o); });
  const ms = $('f-mono'); MONO_FONTS.forEach(f => { const o = document.createElement('option'); o.value = f; o.textContent = f; ms.append(o); });
  ds.addEventListener('change', async () => { state.th.fonts.display = ds.value; await fontsFor(state.th); refresh(); });
  ms.addEventListener('change', async () => { state.th.fonts.mono = ms.value; await fontsFor(state.th); refresh(); });
  $('f-company').addEventListener('input', (e) => renameCompany(e.target.value));
  $('f-unit').addEventListener('input', (e) => renameUnit(e.target.value));
  $('f-motif').addEventListener('change', (e) => setMotif(e.target.value));
  function setMotif(m) {
    const th = state.th;
    th.motif = m;
    th.widget.oddity = { globe: 'mood', alert: 'eval', map: 'omens', night: 'hostile', grimoire: 'spell', orbital: 'decoder', rabbit: 'heist', neon: 'market', market: 'bet', vapor: 'mall', botanical: 'species' }[m] || th.widget.oddity;
    if (m === 'alert') {
      const d = PRESETS.directive;
      th.texture = 'scan'; th.marks = 'frame'; th.iconStyle = 'hex'; th.widget.txGraphic = 'sync'; th.upper = true; th.glyphs = 'directive';
      if (!th.colors.alert) th.colors.alert = d.colors.alert;
      Object.keys(d.text).forEach(k => { if (th.text[k] == null) th.text[k] = clone(d.text[k]); });
    } else if (['map', 'night', 'grimoire', 'orbital', 'rabbit', 'neon', 'market', 'vapor', 'botanical'].includes(m)) {
      const d = PRESETS[{ map: 'longroad', night: 'nightfall', grimoire: 'grimoire', orbital: 'deeprange', rabbit: 'rabbit', neon: 'neon', market: 'odds', vapor: 'vapor', botanical: 'wild' }[m]];
      th.texture = d.texture; th.marks = d.marks; th.iconStyle = d.iconStyle; th.widget.txGraphic = d.widget.txGraphic; th.upper = d.upper; th.glyphs = d.glyphs;
      Object.keys(d.text).forEach(k => { if (th.text[k] == null) th.text[k] = clone(d.text[k]); });
      if (d.colors.alert && !th.colors.alert) th.colors.alert = d.colors.alert;
    } else {
      th.texture = 'dots'; th.marks = 'cross'; th.iconStyle = 'frame'; th.widget.txGraphic = 'helix'; th.glyphs = null;
      const h = PRESETS.halcyon;
      Object.keys(h.text).forEach(k => { if (th.text[k] == null) th.text[k] = clone(h.text[k]); });
    }
    syncFields(); refresh(true);
  }
  document.querySelectorAll('[data-units]').forEach(b => b.addEventListener('click', () => { state.th.units = b.dataset.units; syncFields(); refresh(); }));
  const ph = $('phrases'); ph.textContent = '';
  for (let i = 0; i < 4; i++) {
    const row = document.createElement('div'); row.className = 'phrase';
    [0, 1].forEach(j => {
      const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 22; inp.id = `ph-${i}-${j}`;
      inp.setAttribute('aria-label', `Lock screen ${i + 1}, line ${j + 1}`);
      inp.addEventListener('input', () => { state.th.phrases[i][j] = inp.value; state.lock = i; refresh(); });
      row.append(inp);
    });
    ph.append(row);
  }
  $('f-slogans').addEventListener('input', (e) => {
    state.th.slogans = e.target.value.split('\n').map(l => l.split('|')).filter(p => p[0] && p[0].trim()).map(p => [p[0].trim(), (p[1] || 'HEADQUARTERS').trim().toUpperCase()]);
    refresh();
  });
  const dev = $('f-device');
  DEVICES.forEach((d, i) => { const o = document.createElement('option'); o.value = i; o.textContent = d[1] ? `${d[0]} (${d[1]} × ${d[2]})` : d[0]; dev.append(o); });
  dev.addEventListener('change', () => { state.device = +dev.value; $('custom-size').hidden = DEVICES[state.device][1] !== 0; save(); });
}

function replaceDeep(obj, a, b) {
  if (!a) return;
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'string') obj[k] = obj[k].split(a).join(b);
    else if (Array.isArray(obj[k])) obj[k] = obj[k].map(v => typeof v === 'string' ? v.split(a).join(b) : v);
  });
}
function renameCompany(v) {
  const th = state.th, old = th.company; const nv = v || 'Unnamed Co';
  replaceDeep(th.text, old.toUpperCase(), nv.toUpperCase()); replaceDeep(th.text, old, nv);
  th.company = nv;
  const parts = nv.toUpperCase().split(/\s+/);
  th.text.headL = [parts[0] || '', parts.slice(1).join(' ')];
  refresh();
}
function renameUnit(v) {
  const th = state.th, old = th.unit; const nv = (v || 'X-000').toUpperCase();
  replaceDeep(th.text, old, nv); th.unit = nv; refresh();
}

function syncFields() {
  const th = state.th;
  $('f-company').value = th.company; $('f-unit').value = th.unit;
  COLOR_FIELDS.forEach(([k]) => { $('c-' + k).value = th.colors[k]; });
  const k = Object.assign({ scale: 1, shift: 0, texture: 1, glow: 1, details: true }, th.knobs || {});
  $('k-scale').value = k.scale; $('k-shift').value = k.shift; $('k-texture').value = k.texture; $('k-glow').value = k.glow; $('k-details').checked = k.details !== false;
  $('f-iconstyle').value = th.iconStyle || 'frame'; $('f-glyphs').value = th.glyphs || ''; $('f-case').value = th.upper ? 'upper' : 'title';
  $('f-display').value = th.fonts.display; $('f-mono').value = th.fonts.mono;
  $('f-motif').value = th.motif;
  document.querySelectorAll('[data-units]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.units === th.units)));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) $(`ph-${i}-${j}`).value = (th.phrases[i] || ['', ''])[j] || '';
  $('f-slogans').value = th.slogans.map(s => `${s[0]} | ${s[1]}`).join('\n');
  $('f-device').value = state.device; $('custom-size').hidden = DEVICES[state.device][1] !== 0;
}

// ---------- preview ----------
let raf = 0;
function refresh(fontsChanged) {
  save();
  document.documentElement.style.setProperty('--accent', state.th.colors.accent);
  { const n = parseInt(state.th.colors.accent.slice(1), 16), lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    document.documentElement.style.setProperty('--accent-ink', lum > 0.55 ? '#111316' : '#FFFFFF'); }
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(async () => {
    if (fontsChanged) await fontsFor(state.th);
    renderPreview(); renderChecklist(); renderScript(); buildGallery(); buildSingles();
  });
}

// home frames: only the motifs that draw genuinely different frames get the 1–6 picker, frame exports and the rotation guide
function homeFrameCount(th) { return ['orbital', 'market'].includes((th || state.th).motif) ? 6 : 1; }
// canvas pixel density for previews; the inspector raises it so zoomed views stay sharp
function pvD() { return Math.min(9, (window.devicePixelRatio || 2) * (window.__pvRes || 1)); }
function sizeCanvas(cv) {
  const dpr = Math.min(3, window.devicePixelRatio || 1), w = Math.max(200, cv.parentElement.clientWidth || 300);
  cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr * 844 / 390);
}

function iconURL(app, i, size) {
  const c = document.createElement('canvas'); c.width = size; c.height = size; drawIcon(c, state.th, app, i); return c.toDataURL('image/png');
}

function renderPreview() {
  const th = state.th;
  ['lock', 'home', 'widgets', 'icons'].forEach(v => { $('view-' + v).hidden = state.view !== v; });
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
  document.querySelectorAll('[data-lock]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.lock === state.lock)));
  if (state.view === 'lock') { const cv = $('pv-lock'); sizeCanvas(cv); drawWallpaper(cv, th, 'lock', state.lock); }
  const nf = homeFrameCount(th); if ((state.frame || 0) >= nf) state.frame = 0; $('home-frames').hidden = nf < 2;
  if (state.view === 'home') { const cv = $('pv-home'); sizeCanvas(cv); drawWallpaper(cv, th, 'home', state.frame || 0); buildHomeUI(); }
  if (state.view === 'widgets') { const full = state.wgMode === 'full'; $('wg-phone').hidden = full; $('wg-list').hidden = !full; $('wg-note').textContent = full ? 'Every widget at full size. Tap any widget to inspect it up close.' : 'Every widget on your home screen, in your colors. Scroll inside the phone, tap a widget to inspect it.'; document.querySelectorAll('[data-wgmode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.wgmode === (state.wgMode || 'phone')))); if (full) buildWidgetList(); else { const cv = $('pv-wg'); sizeCanvas(cv); drawWallpaper(cv, th, 'home', 0); buildWidgetPhone(); } }
  document.querySelectorAll('[data-frame]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.frame === (state.frame || 0))));
  if (state.view === 'icons') {
    const sh = $('icon-sheet'); sh.textContent = '';
    APPS.forEach(([k, name], i) => {
      const f = document.createElement('figure'); const img = document.createElement('img');
      img.src = iconURL(k, i, 180); img.alt = `${name} icon`;
      const cap = document.createElement('figcaption'); cap.textContent = name;
      f.append(img, cap); sh.append(f); makeInspectable(f, `Enlarge ${name} icon`, () => openInspector(iconItems(), i, f));
    });
  }
}

function widgetColors(th) {
  const r = ROLES[th.id] || ROLES.halcyon, c = th.colors, out = {};
  Object.keys(r).forEach(k => { out[k] = c[r[k]] || c.accent; });
  return out;
}

function el(tag, style, text) { const e = document.createElement(tag); if (style) e.style.cssText = style; if (text != null) e.textContent = text; return e; }

function buildHomeUI() {
  const th = state.th, ui = $('home-ui'), phone = $('home-phone');
  ui.textContent = '';
  ui.style.transform = `scale(${phone.clientWidth / 390})`;
  if (state.hideIcons) return;
  const lab = th.colors.ink;
  const time = el('div', 'position:absolute;left:34px;top:14px;font:600 15px -apple-system,system-ui,sans-serif;color:' + lab, '9:41');
  ui.append(time);
  const icons = el('div', 'position:absolute;left:24px;right:24px;top:60px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px');
  APPS.slice(0, 4).forEach(([k], i) => {
    const b = el('div', 'display:flex;flex-direction:column;align-items:center;gap:4px');
    const img = el('img', 'width:60px;height:60px;border-radius:14px;box-shadow:0 2px 6px rgba(0,0,0,.25)'); img.src = iconURL(k, i, 120); img.alt = '';
    b.append(img, el('span', `font-family:-apple-system,system-ui,sans-serif;font-size:10px;color:${lab};text-shadow:0 1px 2px ${hexA(th.colors.ground, 0.8)}`, `${th.codes[k]}-${String(i + 1).padStart(2, '0')}`));
    icons.append(b);
  });
  ui.append(icons);
  const dock = el('div', `position:absolute;left:12px;right:12px;bottom:14px;height:86px;border-radius:30px;background:${hexA(th.colors.panel, 0.32)};backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:grid;grid-template-columns:repeat(4,1fr);align-items:center;justify-items:center`);
  APPS.slice(4, 8).forEach(([k], i) => { const img = el('img', 'width:58px;height:58px;border-radius:14px'); img.src = iconURL(k, i + 4, 120); img.alt = ''; dock.append(img); });
  ui.append(dock);
}


// Widgets tab, full-size list: every widget at readable size, no phone frame
function buildWidgetList() {
  const th = state.th, host = $('wg-list'); host.textContent = ''; hbSizeControls();
  const avail = Math.min(host.clientWidth || 360, 460)
  widgetList(th).forEach((item, i) => {
    const p = previewWidget(item, th), s = Math.min(1.25, avail / p.w * (frameFor(th) !== 'halcyon' && item.mode === 'shift' ? 0.5 : 1))
    const fig = document.createElement('figure'); fig.className = 'wg-full'
    const wrap = document.createElement('div'); wrap.style.cssText = `width:${p.w * s}px;height:${p.h * s}px`; p.el.style.transform = `scale(${s})`; p.el.style.transformOrigin = '0 0'; wrap.append(p.el)
    const cap = document.createElement('figcaption'); cap.innerHTML = `<strong></strong><code></code>`; cap.firstChild.textContent = item.name; cap.lastChild.textContent = item.mode
    fig.append(wrap, cap); host.append(fig); makeInspectable(wrap, `Enlarge ${item.name}`, () => openInspector(widgetItems(), i, wrap))
  })
}

// Widgets tab: every widget stacked on the home wallpaper, scrollable inside the phone
function buildWidgetPhone() {
  const th = state.th, phone = $('wg-phone'), scr = $('wg-scroll');
  const sig = `${th.id}:${th.variant || 0}:${th.motif}`, keep = state.wgSig === sig ? scr.scrollTop : 0; state.wgSig = sig;
  scr.textContent = '';
  const k = phone.clientWidth / 390, S = 338 / 364;
  const inner = el('div', `width:390px;transform:scale(${k});transform-origin:0 0;padding:58px 0 40px;box-sizing:border-box`);
  const list = widgetList(th), by = (m) => list.find(x => x.mode === m);
  const all = widgetList(th), slot = (item) => { const p = previewWidget({...item, family: item.mode === 'shift' ? 'small' : item.mode === 'solar' ? 'large' : 'medium'}, th); const wrap = el('div', `width:${p.w * S}px;height:${p.h * S}px;flex:none`); p.el.style.transform = `scale(${S})`; p.el.style.transformOrigin = '0 0'; p.el.style.boxShadow = '0 6px 16px rgba(0,0,0,.28)'; wrap.append(p.el); const wi = all.indexOf(item); makeInspectable(wrap, `Enlarge ${item.name}`, () => openInspector(widgetItems(), wi, wrap)); return wrap; };
  const row = (kids, gap) => { const r = el('div', `display:flex;justify-content:center;gap:${gap || 22}px;margin:0 0 20px`); kids.forEach(c => r.append(c)); inner.append(r); };
  const lbl = (t) => inner.append(el('div', `text-align:center;margin:-12px 0 16px;font:600 11px -apple-system,system-ui,sans-serif;color:${th.colors.ink};text-shadow:0 1px 2px ${hexA(th.colors.ground, 0.85)}`, t));
  row([slot(by('status'))]); lbl('status');
  const grid = el('div', 'width:158px;height:158px;display:grid;grid-template-columns:repeat(2,1fr);place-items:center;flex:none');
  APPS.slice(0, 4).forEach(([key], i) => { const img = el('img', 'width:60px;height:60px;border-radius:14px;box-shadow:0 2px 6px rgba(0,0,0,.25)'); img.src = iconURL(key, i, 120); img.alt = ''; grid.append(img); });
  row([slot(by('shift')), grid]); lbl('shift');
  ;['audio', 'transmission', 'solar', 'feeds', 'youtube', 'instagram', 'discord', 'game', 'oddity', 'tracker'].forEach(m => { const it = by(m); if (!it) return; row([slot(it)]); lbl(m); });
  const sizer = el('div', 'width:1px');
  scr.append(inner, sizer);
  requestAnimationFrame(() => { sizer.style.height = (inner.offsetHeight * k) + 'px'; inner.style.position = 'absolute'; inner.style.top = '0'; inner.style.left = '0'; scr.scrollTop = keep; });
}

// ---------- widget guide + gallery ----------
const DECK_DEFAULT = {
  solar: { label: 'SOLAR FEED', offline: 'Signal Lost', day: 'DAYLIGHT REMAINING', night: 'NIGHT CYCLE', setIn: 'SUNSET IN', riseIn: 'SUNRISE IN' },
  audio: { right: 'CH 08 · PRE-APPROVED', src: 'SIGNAL // YT MUSIC', metric: 'SEDATION', tap: 'TAP TO ENGAGE · UPLINK ', foot: 'LISTEN AS DIRECTED', lines: ['Approved Frequencies Only'] },
  feeds: { right: '2 CH MONITORED', trace: 'CORTICAL ACTIVITY // LIVE FEED', tap: 'TAP A CHANNEL TO ENGAGE · SESSION ', foot: 'DOPAMINE IS A DELIVERABLE', linked: 'LINKED',
    yt: { line: 'Approved Viewing', meters: ['DOPAMINE', 'ENDORPHIN', 'FOCUS'], tag: 'AUTOPLAY ENFORCED', queue: '∞ VIDEOS', kv: ['QUEUE', 'ATTENTION SPAN', 'RABBIT HOLE'], foot: 'WATCH AS DIRECTED' },
    ig: { line: 'Peer Observation', meters: ['DOPAMINE', 'SEROTONIN', 'CORTISOL'], kv: ['PEERS OBSERVED', 'VALIDATION', 'SELF-WORTH'], foot: 'OBSERVE. COMPARE. COMPLY.' } }
};
function mergeDeckJS(a, b) { const o = Array.isArray(a) ? a.slice() : Object.assign({}, a); for (const k in (b || {})) o[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a && typeof a[k] === 'object') ? mergeDeckJS(a[k], b[k]) : b[k]; return o; }
const deckFor = (th) => mergeDeckJS(DECK_DEFAULT, th.widget.C || {});
const labelFor = (th, k, d) => (th.widget.L && th.widget.L[k]) || d;
const niceName = (s) => String(s).replace(/^W-\d+\s*\/\/\s*/, '').toLowerCase().replace(/(^|[\s\-+&])([a-z])/g, (m, a2, b2) => a2 + b2.toUpperCase());

const ODD_INFO = {
  mood: ['Mood Lease', 'Your currently licensed emotions as allocation bars (one is always over quota), the time of your next mandatory smile, a renewal fee and an upsell.'],
  eval: ['Operator Evaluation', 'A daily fake psych evaluation: sync-rate gauge, hesitation events, tears, a shelter assignment and a stamped verdict.'],
  omens: ['Road Omens', 'The omen of the day with a weather vane, how far your boots can still go, pantry status, the nearest inn and a second-thoughts meter.'],
  hostile: ['Hostile Intel', 'A field-guide entry on a made-up enemy: silhouette, threat level, armor, aggression and cowardice, its weakness and a tactical tip.'],
  spell: ['Spell of the Hour', 'A fake spell card: school, rarity (sometimes cursed), essence cost, casting time, the effect and the side effect.'],
  market: ['Black Market', 'The deal of the hour: a questionable item, its seller and rating, the price in credits, its condition, a warranty of none and a risk meter.'],
  bet: ['Longshot Of The Hour', 'An existential prediction market (does the void take bets?) with YES and NO prices, the payout multiplier, volume, leverage and your position.'],
  tip: ['Tip Of The Hour', 'A cheerful, true little fact with an optimism reading, bubbles popped and clouds rendered.'],
  mall: ['Mall Directory', 'A store of the hour on a little mall map: its status (often closed since 1997), floor, coins in the fountain and the song on the speakers.'],
  species: ['Field Guide', 'A species of the hour with its Latin name, where to look for it, a real fact and a rarity meter.'],
  heist: ['Heist Board', "Tonight's score: the target heirloom, where it's kept, how many lasers stand in the way, the crew, the odds and whether the calling card is ready."],
  late: ['Late Notice', 'What you are late for, by how many minutes, a pocket watch running wild, an excuse for the occasion, the state of the tea and a panic meter.'],
  decoder: ['Signal Decoder', 'A garbled transmission resolving into a decoded line, with confidence, echo delay, source and salvage value. Bad decodes flag loss of signal.']
};
function frameFor(th) { return ({ globe: 'halcyon', radar: 'halcyon', alert: 'directive', map: 'longroad', night: 'nightfall', grimoire: 'grimoire', orbital: 'deeprange', rabbit: 'rabbit', neon: 'cyber', market: 'market', vapor: 'vapor', botanical: 'nature' }[th.motif] || 'halcyon'); }
function oddityFor(th) { return th.widget.oddity || ({ globe: 'mood', alert: 'eval', map: 'omens', night: 'hostile', grimoire: 'spell', orbital: 'decoder', rabbit: 'heist', neon: 'market', market: 'bet', vapor: 'mall', botanical: 'species' }[th.motif] || 'mood'); }
const GAME_META = {
  halcyon: ['W-10 // SPECIMEN VAT', 'Specimen Vat', 'An abstract organism grows in a containment vat, one cycle per refresh, through five morphologies from seed nucleus to lattice sphere. Charging opens the nutrient line, busy days stress it, nights let it rest. Mutations are filed under assets; neglected lots are recycled into feedstock.'],
  deeprange: ['W-10 // SALVAGE RUN', 'Salvage Run', 'An autonomous drone jumps across the sector each refresh: derelicts, asteroids, pirates, signals, cargo. Charging docks it to refuel. Lose the hull or fuel and a new drone launches.'],
  longroad: ['W-10 // THE EXPEDITION', 'The Expedition', 'A traveller walks the map one stretch per refresh and keeps a journal: villages, bandits, wolves, merchants. Charging (or nightfall) makes camp. If they fall, someone new sets out.'],
  directive: ['W-10 // SHELTER 9', 'Shelter 9', 'Keep an underground shelter running: survivors arrive, supplies drop, sirens sound and morale rises and falls. Charging restores the power grid. Lose power or morale and the next shelter is unsealed.'],
  nightfall: ['W-10 // NIGHT PATROL', 'Night Patrol', 'A four-trooper squad patrols the rainy city sector by sector, trading fire, finding intel and caches. Charging calls a resupply drop. Run out of ammo and the squad is extracted.'],
  grimoire: ['W-10 // THE APPRENTICE', 'The Apprentice', 'An apprentice studies through the night: spells join a constellation, familiars arrive, cauldrons misbehave, ranks rise to Starbound. Charging fills the moonwell with mana.'],
  rabbit: ['W-10 // THE LONG CON', 'The Long Con', 'The legion cases and lifts all seven heirlooms, leaving a calling card each time, while the heat climbs. Charging lays low at the safehouse. Too much heat and the legion scatters.'],
  cyber: ['W-10 // TOWER RUN', 'Tower Run', 'A netrunner climbs a 100-floor corp tower by breaching ICE, pulling paydata and buying chrome while the trace closes in. Charging recharges RAM. Get traced and a new handle takes over.'],
  vapor: ['W-10 // MALL.EXE', 'Mall.exe', 'Keep the eternal mall open: stores open (and close since 1997), shoppers drift, the fountain fills with coins. Charging switches the lights on. Let the vibe die and a new mall opens forever.'],
  nature: ['W-10 // THE GROVE', 'The Grove', 'Seeds sprout, leaves unfurl and flowers bloom across the seasons while wrens, foxes and owls stop by. Charging brings rain. If everything wilts, new seeds scatter on the wind.'],
  market: ['W-10 // THE BANKROLL', 'The Bankroll', 'Your bankroll trades existential markets on its own: positions open and resolve each refresh, with breaking news in between. Charging tops up your margin. Hit zero and the universe opens a new account.']
};
function originalWidgetList(th) {
  const L = th.widget.L, o = ODD_INFO[oddityFor(th)];
  return [
    { mode: 'status', size: 'medium', title: L.status, name: 'Status', tap: 'Open URL calshow:// to open Calendar', desc: 'Your next calendar event, live temperature and conditions, feels-like, today\'s high and low, battery and the date, with a live link timer in the header.' },
    { mode: 'shift', size: 'small', title: L.shift, name: 'Shift', tap: 'Open URL calshow:// to open Calendar', desc: 'A live countdown for your current or next calendar event, with an hour-ticked progress bar and start and end times.' },
    { mode: 'transmission', size: 'any size', title: L.tx, name: 'Transmission', tap: 'Leave as is', desc: 'In-world slogans from your company\'s departments, plus real public-domain quotes, over a themed graphic and a live decoding timer. Changes about every 30 minutes.' },
    { mode: 'solar', size: 'large is best', title: labelFor(th, 'solarBig', 'W-03 // SOLAR + ATMOS'), name: niceName(labelFor(th, 'solarBig', 'Solar + Atmos')), tap: 'Leave as is', desc: 'Daylight remaining, a live sunset countdown and the sun\'s arc. The large size adds air temperature, humidity, UV, visibility, dew point, wind and a 12-hour rain chart.' },
    { mode: 'audio', size: 'medium', title: labelFor(th, 'audio', 'W-04 // AUDIO CHANNEL'), name: niceName(labelFor(th, 'audio', 'Audio')), tap: 'Open URL youtubemusic:// (or your music app)', desc: 'A styled one-tap launcher for your music app, with a rotating in-world line, a waveform and a live timer.' },
    { mode: 'feeds', size: 'medium', title: labelFor(th, 'feeds', 'W-06 // NEURAL LINK'), name: niceName(labelFor(th, 'feeds', 'Neural Link')), tap: 'Each half opens its own app', desc: 'Two halves that open YouTube and Instagram, each with made-up in-world meters and a live trace.' },
    { mode: 'youtube', size: 'any size', title: labelFor(th, 'vid', 'W-06 // VID'), name: niceName(labelFor(th, 'vid', 'YouTube')), tap: 'Open URL youtube://', desc: 'A YouTube launcher drawn as its own in-world object, with a rotating line and made-up viewing stats. Changes about every 30 minutes.' },
    { mode: 'instagram', size: 'any size', title: labelFor(th, 'obs', 'W-07 // OBS'), name: niceName(labelFor(th, 'obs', 'Instagram')), tap: 'Open URL instagram://app', desc: 'An Instagram launcher with its own design: a gallery of in-world portraits or cards and tongue-in-cheek social stats.' },
    ...(GAME_META[frameFor(th)] ? [{ mode: 'game', size: 'any size (medium or large best)', title: GAME_META[frameFor(th)][0], name: GAME_META[frameFor(th)][1], tap: 'Leave as is (it opens Scriptable; the game plays itself)', desc: GAME_META[frameFor(th)][2] }] : []),
    { mode: 'discord', size: 'any size', title: labelFor(th, 'dc', 'W-09 // SYNC'), name: niceName(labelFor(th, 'dc', 'Discord')), tap: 'Open URL discord://', desc: 'A Discord launcher shown as an in-world gathering, with who is around, a few channels and unread marks. All for show; nothing is read from your account.' },
    { mode: 'oddity', size: 'small or medium', title: 'W-08 // ' + o[0].toUpperCase(), name: o[0], tap: 'Leave as is', desc: o[1] + ' Purely for fun, and it changes about every 30 minutes.' }
  ];
}
function widgetList(th) { const list = originalWidgetList(th); return hbOn(th) ? hbWidgetList(th, list) : drOn(th) ? drWidgetList(th, list) : list; }
function pv(tag, css, text) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
function pvCanvas(w, h, draw) { const c = document.createElement('canvas'); const d = pvD(); c.width = w * d; c.height = h * d; c.style.cssText = `width:${w}px;height:${h}px;display:block`; const x = c.getContext('2d'); x.scale(d, d); draw(x); return c; }


function drawPreviewHeader(x, W, H, f, base, tcol, wc, th) {
  const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); };
  const ln = (pts, col, w) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); };
  x.fillStyle = wc.panel; x.fillRect(0, 0, W, H);
  const spk = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r * 0.22, cy - r * 0.22); x.lineTo(cx + r, cy); x.lineTo(cx + r * 0.22, cy + r * 0.22); x.lineTo(cx, cy + r); x.lineTo(cx - r * 0.22, cy + r * 0.22); x.lineTo(cx - r, cy); x.lineTo(cx - r * 0.22, cy - r * 0.22); x.closePath(); x.fill(); };
  if (f === 'rabbit') { x.fillStyle = base; x.fillRect(0, 0, W, H); for (let a2 = 0; a2 < W; a2 += 3) { x.fillStyle = `rgba(255,255,255,${0.05 + 0.08 * Math.abs(Math.sin(a2 * 0.05))})`; x.fillRect(a2, 0, 1.5, H); } spk(W - 12, H / 2, 5, wc.accent); spk(W - 24, H / 2 - 4, 2.2, 'rgba(255,255,255,.9)'); ln([[0, H - 1], [W, H - 1]], hexA(wc.accent, 0.5), 1); }
  else if (f === 'halcyon') { x.fillStyle = base; x.fillRect(0, 0, W, H); ln([[0, H - 1], [W, H - 1]], hexA(tcol, 0.35), 1); for (let a = W - 8; a > W - 60; a -= 6) ln([[a, H - 5], [a, H - 1]], hexA(tcol, 0.4), 0.8); }
  else if (f === 'directive') { x.fillStyle = base; x.fillRect(0, 0, W, H); for (let a = W - 28; a < W + 10; a += 8) poly([[a, H], [a + 4, H], [a + 4 + H * 0.6, 0], [a + H * 0.6, 0]], tcol); x.fillStyle = tcol; x.fillRect(0, H - 2, W, 2); }
  else if (f === 'longroad') { const n = 8; poly([[0, 1], [W, 1], [W - n, H / 2], [W, H - 1], [0, H - 1], [n, H / 2]], base); ln([[n + 4, 3.5], [W - n - 4, 3.5]], hexA(tcol, 0.55), 0.6); ln([[n + 4, H - 3.5], [W - n - 4, H - 3.5]], hexA(tcol, 0.55), 0.6); [[n + 6, H / 2], [W - n - 6, H / 2]].forEach(([a, b]) => poly([[a, b - 3], [a + 3, b], [a, b + 3], [a - 3, b]], tcol)); }
  else if (f === 'nightfall') { x.fillStyle = hexA(wc.ink, 0.08); x.fillRect(0, 0, W, H); ln([[0, H - 6], [6, H - 1], [W - 6, H - 1], [W, H - 6]], wc.ink, 1.2); ln([[0, 5], [6, 0]], wc.ink, 1.2); ln([[W, 5], [W - 6, 0]], wc.ink, 1.2); for (let i = 0; i < 6; i++) { x.fillStyle = hexA(wc.ink, i < 4 ? 0.9 : 0.25); x.fillRect(W - 14 - i * 6, 8, 4, 8); } }
  else if (f === 'grimoire') { x.fillStyle = th.colors.ground; x.fillRect(0, 0, W, H); ln([[0, 1.5], [W, 1.5]], wc.accent, 1); ln([[0, H - 1.5], [W, H - 1.5]], wc.accent, 1); ln([[0, 4], [W, 4]], hexA(wc.accent, 0.45), 0.5); ln([[0, H - 4], [W, H - 4]], hexA(wc.accent, 0.45), 0.5); [[11, H / 2], [W - 11, H / 2]].forEach(([a, b]) => { poly([[a, b - 5], [a + 5, b], [a, b + 5], [a - 5, b]], wc.accent); poly([[a, b - 2], [a + 2, b], [a, b + 2], [a - 2, b]], th.colors.ground); }); }
  else if (f === 'deeprange') { x.fillStyle = base; x.fillRect(0, 0, W, H); x.fillStyle = hexA(th.colors.ground, 0.15); for (let y = 0; y < H; y += 3) x.fillRect(0, y, W, 1); x.fillStyle = tcol; [[W - 26, 5, 6, 14], [W - 18, 5, 3, 6], [W - 18, 13, 3, 6], [W - 12, 5, 6, 14]].forEach(([a, b, w2, h2]) => x.fillRect(a, b, w2, h2)); }
}
function drawPreviewFrame(x, W, H, f, wc, th) {
  const top = 24, ink = wc.ink, acc = wc.accent, hot = wc.headBg;
  if (th.texture === 'scan') { x.fillStyle = hexA(ink, 0.06); for (let y = 0; y < H; y += 3) x.fillRect(0, y, W, 1); }
  else { x.fillStyle = hexA(ink, 0.1); for (let y = 2; y < H; y += 4) for (let xx = 2; xx < W; xx += 4) x.fillRect(xx, y, 0.9, 0.9); }
  const ln = (pts, col, w) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); };
  const dia = (a, b, r, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(a, b - r); x.lineTo(a + r, b); x.lineTo(a, b + r); x.lineTo(a - r, b); x.closePath(); x.fill(); };
  if (f === 'halcyon') { [[9, top + 8], [W - 9, top + 8], [9, H - 9], [W - 9, H - 9]].forEach(([a, b]) => { ln([[a - 5, b], [a + 5, b]], hexA(ink, 0.6), 0.8); ln([[a, b - 5], [a, b + 5]], hexA(ink, 0.6), 0.8); x.beginPath(); x.arc(a, b, 3, 0, Math.PI * 2); x.stroke(); }); for (let y = top + 20; y < H - 14; y += 12) ln([[W - 4, y], [W, y]], hexA(ink, 0.35), 0.8); }
  else if (f === 'directive') { [[4, top + 4, 1, 1], [W - 4, top + 4, -1, 1], [4, H - 10, 1, -1], [W - 4, H - 10, -1, -1]].forEach(([a, b, sx, sy]) => ln([[a + sx * 14, b], [a, b], [a, b + sy * 14]], acc, 1.6)); x.fillStyle = acc; for (let a = -8; a < W; a += 12) { x.beginPath(); x.moveTo(a, H); x.lineTo(a + 6, H); x.lineTo(a + 12, H - 5); x.lineTo(a + 6, H - 5); x.closePath(); x.fill(); } }
  else if (f === 'longroad') { x.strokeStyle = ink; x.lineWidth = 1.2; x.strokeRect(4, top + 3, W - 8, H - top - 7); x.lineWidth = 0.6; x.strokeRect(7, top + 6, W - 14, H - top - 13); [[4, top + 3], [W - 4, top + 3], [4, H - 4], [W - 4, H - 4]].forEach(([a, b]) => dia(a, b, 3.5, hot)); }
  else if (f === 'nightfall') { const ch = 10, x0 = 4, y0 = top + 3, x1 = W - 4, y1 = H - 4; ln([[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch], [x0 + ch, y0]], hexA(ink, 0.35), 0.8); [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([a, b, sx, sy]) => ln([[a + sx * (ch + 10), b], [a + sx * ch, b], [a, b + sy * ch], [a, b + sy * (ch + 10)]], ink, 1.6)); }
  else if (f === 'grimoire') { x.strokeStyle = acc; x.lineWidth = 1.2; x.strokeRect(4, top + 3, W - 8, H - top - 7); x.strokeStyle = hexA(acc, 0.55); x.lineWidth = 0.6; x.strokeRect(7.5, top + 6.5, W - 15, H - top - 14); [[4, top + 3], [W - 4, top + 3], [4, H - 4], [W - 4, H - 4], [W / 2, top + 3], [W / 2, H - 4]].forEach(([a, b]) => dia(a, b, 4, acc)); }
  else if (f === 'rabbit') { x.strokeStyle = wc.headBg; x.lineWidth = 1; x.beginPath(); x.roundRect(5, top + 3, W - 10, H - top - 8, 16); x.stroke(); const sp2 = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r * 0.22, cy - r * 0.22); x.lineTo(cx + r, cy); x.lineTo(cx + r * 0.22, cy + r * 0.22); x.lineTo(cx, cy + r); x.lineTo(cx - r * 0.22, cy + r * 0.22); x.lineTo(cx - r, cy); x.lineTo(cx - r * 0.22, cy - r * 0.22); x.closePath(); x.fill(); }; const my = top + (H - top) / 2; sp2(W - 5, my, 5, acc); sp2(5, my, 4, wc.headBg); sp2(W - 5, my + 12, 2, acc); }
  else if (f === 'deeprange') { x.fillStyle = hot; [[0, top + 10, 5, 22], [0, top + 36, 3, 6], [W - 5, H - 40, 5, 26], [W - 3, H - 10, 3, 6]].forEach(([a, b, w, h]) => x.fillRect(a, b, w, h)); [[10, top + 6], [W - 10, top + 6]].forEach(([a, b], i) => ln([[a + (i ? -12 : 12), b], [a, b], [a, b + 12]], hexA(ink, 0.7), 1.2)); }
}

// Runs the widget script's own drawing code in the browser so previews match the phone
function scriptableKit(th) {
  const wc = widgetColors(th), D = pvD();
  const T = { ink: wc.ink, accent: wc.accent, headBg: wc.headBg, headText: wc.headText, altBg: wc.altBg, altText: wc.altText, panel: wc.panel, ground: th.colors.ground };
  class Color { constructor(hex, a) { this.hex = hex; this.a = a == null ? 1 : a; } css() { return hexA(this.hex, this.a); } }
  class Point { constructor(x, y) { this.x = x; this.y = y; } }
  class Rect { constructor(x, y, w, h) { this.x = x; this.y = y; this.width = w; this.height = h; } }
  class Size { constructor(w, h) { this.width = w; this.height = h; } }
  class Path { constructor() { this.ops = []; } move(p) { this.ops.push(['m', p]); } addLine(p) { this.ops.push(['l', p]); } addLines(ps) { ps.forEach((p, i) => this.ops.push([i ? 'l' : 'm', p])); } addQuadCurve(p, c) { this.ops.push(['q', p, c]); } closeSubpath() { this.ops.push(['z']); } }
  const dispCss = (s) => `${th.fonts.display === 'Archivo' ? 800 : 400} ${s}px "${th.fonts.display}", Georgia, serif`;
  class Font { constructor(n, s) { this.css = n==='Georgia-BoldItalic'?`italic 700 ${s}px Georgia, serif`:dispCss(s); } static boldMonospacedSystemFont(s) { return `700 ${s}px "${th.fonts.mono}", ui-monospace, monospace`; } static mediumMonospacedSystemFont(s) { return `500 ${s}px "${th.fonts.mono}", ui-monospace, monospace`; } static heavySystemFont(s) { return `800 ${s}px system-ui, sans-serif`; } static boldSystemFont(s) { return `700 ${s}px system-ui, sans-serif`; } }
  class DrawContext {
    set size(s) { this.c = document.createElement('canvas'); this.c.width = Math.ceil(s.width * D); this.c.height = Math.ceil(s.height * D); this.c.style.width = s.width + 'px'; this.c.style.height = s.height + 'px'; this.x = this.c.getContext('2d'); this.x.scale(D, D); this.al = 'left'; }
    setFillColor(c) { this.x.fillStyle = c.css(); } setStrokeColor(c) { this.x.strokeStyle = c.css(); } setLineWidth(w) { this.x.lineWidth = w; }
    fillRect(r) { this.x.fillRect(r.x, r.y, r.width, r.height); } strokeRect(r) { this.x.strokeRect(r.x, r.y, r.width, r.height); }
    fillEllipse(r) { this.x.beginPath(); this.x.ellipse(r.x + r.width / 2, r.y + r.height / 2, Math.max(0.01, r.width / 2), Math.max(0.01, r.height / 2), 0, 0, Math.PI * 2); this.x.fill(); }
    strokeEllipse(r) { this.x.beginPath(); this.x.ellipse(r.x + r.width / 2, r.y + r.height / 2, Math.max(0.01, r.width / 2), Math.max(0.01, r.height / 2), 0, 0, Math.PI * 2); this.x.stroke(); }
    addPath(p) { const x = this.x; x.beginPath(); p.ops.forEach(o => { if (o[0] === 'm') x.moveTo(o[1].x, o[1].y); else if (o[0] === 'l') x.lineTo(o[1].x, o[1].y); else if (o[0] === 'q') x.quadraticCurveTo(o[2].x, o[2].y, o[1].x, o[1].y); else x.closePath(); }); }
    fillPath() { this.x.fill(); } strokePath() { this.x.stroke(); }
    setFont(f) { this.x.font = (f && f.css) ? f.css : f; } setTextColor(c) { this.x.fillStyle = c.css(); }
    setTextAlignedCenter() { this.al = 'center'; } setTextAlignedLeft() { this.al = 'left'; } setTextAlignedRight() { this.al = 'right'; }
    drawTextInRect(t, r) { this.x.textBaseline = 'top'; this.x.textAlign = this.al; this.x.fillText(t, this.al === 'center' ? r.x + r.width / 2 : this.al === 'right' ? r.x + r.width : r.x, r.y, r.width); this.x.textAlign = 'left'; }
    drawImageInRect(img, r) { this.x.drawImage(img, r.x, r.y, r.width, r.height); }
    getImage() { return this.c; }
  }
  const src = $('tpl').textContent, s0 = src.indexOf('// ---------- W-04 AUDIO: a distinct instrument'), s1 = src.indexOf('async function audioWidget()');
  const p0 = src.indexOf('// ---------- THEMED PAINT BLOCK ----------'), p1 = src.indexOf('// ---------- END THEMED PAINT BLOCK ----------');
  const l0 = src.indexOf('const LIVE = {'), l1 = src.indexOf('async function themedStatus');
  const f0 = src.indexOf('// theme frame drawn under the content'), f1 = src.indexOf('function txt(stack, text, size, color, isDisp)');
  const deck = deckFor(th);
  T.scriptFont = th.widget.scriptFont; T.units = th.units; T.frame = frameFor(th); T.hbImages = HB_IMAGES; T.drImages = DR_IMAGES; T.hbDark = hbIsDark(th); T.hbVariant = th.variant || 0;
  const tf = { string: (d) => { let h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; } };
  try {
    return new Function('T', 'INK', 'INK_SOFT', 'Color', 'Point', 'Rect', 'Size', 'Path', 'DrawContext', 'Font', 'AUDIO_LINES', 'C', 'bar', 'tf', 'PANEL', src.slice(s0, s1) + '\n' + src.slice(p0, p1) + '\n' + src.slice(l0, l1) + '\n' + src.slice(f0, f1) + '\nreturn { drPaint, drTimerLayout, DR_META, hbPaint, HB_SPRITES, hbObservation, HB_OBSERVATIONS, HB_WIDGET_ASSETS, GAMES, hbAllocation, sevenSeg, hexVU, luteImg, staffImg, commRing, runeCircle, ribbon, waterfall, aSeed, THEME_PAINT, LIVE, artImage, dialStrip, drawFrame, headerImage };')(
      T, new Color(T.ink), new Color(T.ink, 0.72), Color, Point, Rect, Size, Path, DrawContext, Font, deck.audio.lines, deck,
      (w, f) => { const d = new DrawContext(); d.size = new Size(w, 4); d.setFillColor(new Color(T.ink, 0.22)); d.fillRect(new Rect(0, 0, w, 4)); d.setFillColor(new Color(T.ink)); d.fillRect(new Rect(0, 0, w * f, 4)); return d.getImage(); }, tf, new Color(T.panel));
  } catch (e) { console.warn(e); return null; }
}

function sampleData(mode, th, W, H) {
  const now = new Date(), at = (h, m) => { const d = new Date(now); d.setHours(h, m || 0, 0, 0); return d; }, L = th.widget.L, deck = deckFor(th);
  const cel = th.units === 'celsius', T2 = (f) => cel ? Math.round((f - 32) * 5 / 9) : f;
  if (mode === 'status') return { ev: { title: 'Your next calendar event', start: at(9), end: at(17), active: false }, wx: { temp: T2(69), cond: 'PARTLY CLOUDY', feels: T2(68), hi: T2(75), lo: T2(54) }, batt: 0.82, now, unit: th.unit, L };
  if (mode === 'shift') return { ev: { title: 'Your current event', start: at(9), end: at(17), active: true }, frac: 0.46, now, L };
  if (mode === 'transmission') { const s = th.slogans[0] || ['Stand By', 'HQ']; return { text: s[0], by: `${th.company.toUpperCase()} · ${s[1]}`, cls: th.widget.classes[0] || 'DIRECTIVE', hex: '7F3A', archival: false, unit: th.unit, mo: now.getMonth(), day: now.getDate() }; }
  if (mode === 'solar') { const rise = at(7, 2), set = at(18, 24), nn = at(14, 30); return { rise, set, now: nn, up: true, frac: (nn - rise) / (set - rise), atm: { probs: [0, 5, 10, 30, 60, 80, 40, 20, 10, 0, 0, 5], pmax: 80, rh: 47, uv: 3, vis: '10 MI', visMi: 10, dew: T2(45), wind: '7 NE', wd: 45, ws: 7 } }; }
  const ch = (key, compact) => ({ side: key === 'youtube' ? 'yt' : 'ig', code: `${(th.codes[key] || key).slice(0, 5)}-${key === 'youtube' ? '09' : '10'}`, line: key === 'youtube' ? deck.feeds.yt.line : deck.feeds.ig.line, meters: (key === 'youtube' ? deck.feeds.yt.meters : deck.feeds.ig.meters).map((n, i) => [n, [0.86, 0.55, 0.12][i] - (key === 'youtube' ? 0 : 0.08)]), tag: key === 'youtube' ? deck.feeds.yt.tag : deck.feeds.ig.tag, compact });
  return { yt: ch('youtube', false), ig: ch('instagram', false), single: ch('youtube', true) };
}
function themedBody(item, th, wc, W, H) {
  const K = scriptableKit(th); if (!K) return null;
  const f = frameFor(th), P = f === 'halcyon' ? null : K.THEME_PAINT[f];
  const bh = H - 24, wrap = pv('div', `position:relative;width:${W}px;height:${bh}px`);
  const put = (c, x) => { c.style.position = 'absolute'; c.style.left = (x || 0) + 'px'; c.style.top = '0'; wrap.append(c); };
  const live = (spec, text) => { if (!spec) return; const fam2 = spec.f === 'disp' ? `"${th.fonts.display}", Georgia, serif` : spec.f === 'heavy' ? 'system-ui, sans-serif' : `"${th.fonts.mono}", ui-monospace, monospace`; const e = pv('div', `position:absolute;top:${spec.y}px;font:${spec.f === 'heavy' ? 800 : spec.f === 'bold' ? 700 : 400} ${spec.size}px ${fam2};color:${spec.color || wc.ink};white-space:nowrap;line-height:1.3`, text); if (spec.a === 'c') { e.style.left = '0'; e.style.width = W + 'px'; e.style.textAlign = 'center'; } else if (spec.a === 'r') { e.style.right = (W - spec.x) + 'px'; } else { e.style.left = spec.x + 'px'; } wrap.append(e); };
  const d = sampleData(item.mode, th, W, bh);
  if (item.mode === 'oddity') { const P2 = K.THEME_PAINT[f]; if (P2 && P2.oddity) { put(K.artImage(W, bh, P2.oddity, { seed: Math.floor(Date.now() / 1800000), now: new Date() })); return wrap; } return null; }
  if (item.mode === 'game') { const P2 = K.THEME_PAINT[f]; if (P2 && P2.game) { let smp = P2.gameSample(); if (item.tweak) smp = item.tweak(smp); put(K.artImage(W, bh, P2.game, smp)); return wrap; } }
  if (['youtube', 'instagram', 'discord'].includes(item.mode)) { const P2 = K.THEME_PAINT[f] || K.THEME_PAINT.halcyon, pk = { youtube: 'yt', instagram: 'ig', discord: 'dc' }[item.mode]; put(K.artImage(W, bh, P2[pk], { seed: 7, now: new Date(), code: `${(th.codes[item.mode] || item.mode).slice(0, 5)}-${{ youtube: '09', instagram: '10', discord: '11' }[item.mode]}` })); return wrap; }
  if (item.mode === 'audio' && ['halcyon', 'rabbit', 'cyber', 'market', 'vapor', 'nature'].includes(f)) { put(K.artImage(W, bh, K.THEME_PAINT[f].audio, { line: deckFor(th).audio.lines[0], lvl: 3, phase: 1.2 })); live({ x: 352, y: 60, size: 9, a: 'r', f: 'bold' }, '0:42'); return wrap; }
  if (!P) return null;
  if (item.mode === 'status') { put(K.artImage(W, bh, P.status, d)); return wrap; }
  if (item.mode === 'shift') { put(K.artImage(W, bh, P.shift, d)); live(K.LIVE[f].shift, '3:42:10'); return wrap; }
  if (item.mode === 'transmission') { put(K.artImage(W, bh, P.tx, d)); return wrap; }
  if (item.mode === 'solar') { put(K.artImage(W, bh, P.solar, d)); live(K.LIVE[f].solar, '3:54:08'); return wrap; }
  if (item.mode === 'feeds') { put(K.artImage(W / 2, bh, P.feed, d.yt), 0); put(K.artImage(W / 2, bh, P.feed, d.ig), W / 2); return wrap; }
  return null;
}
function previewWidget(item, th) {
  if (hbOn(th)) return hbPreviewWidget(item, th);
  if (drOn(th)) return drPreviewWidget(item, th);
  const wc = widgetColors(th), mono = `"${th.fonts.mono}", ui-monospace, monospace`, disp = `"${th.fonts.display}", Georgia, serif`;
  const W = item.mode === 'shift' ? 170 : 364, H = item.mode === 'solar' || item.big ? 382 : 170;
  const alt = ['shift', 'transmission', 'oddity'].includes(item.mode);
  const card = pv('div', `position:relative;width:${W}px;height:${H}px;border-radius:22px;overflow:hidden;background:${wc.panel};color:${wc.ink};font-family:${mono};font-size:9px;line-height:1.18;display:flex;flex-direction:column`);
  const NEWF = ['cyber', 'market', 'vapor', 'nature'].includes(frameFor(th)), KF = NEWF ? scriptableKit(th) : null;
  const fr = NEWF && KF ? (() => { const img = KF.artImage(W, H, (k2) => KF.drawFrame(k2.dc, W, H), {}); img.style.cssText = `width:${W}px;height:${H}px;display:block`; return img; })() : pvCanvas(W, H, x => drawPreviewFrame(x, W, H, frameFor(th), wc, th));
  fr.style.cssText += ';position:absolute;inset:0;pointer-events:none';
  card.append(fr);
  const fK = frameFor(th), serifHead = ['longroad', 'grimoire', 'rabbit', 'nature'].includes(fK);
  const hBase = alt ? wc.altBg : wc.headBg, hText = fK === 'nightfall' ? wc.ink : fK === 'grimoire' ? wc.accent : ['vapor'].includes(fK) ? '#FFFFFF' : (alt ? wc.altText : wc.headText);
  const hd = pv('div', `position:relative;z-index:1;height:24px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 ${Math.min(W < 200 ? 34 : 99, fK === 'directive' || fK === 'deeprange' ? 34 : ['nightfall', 'cyber', 'vapor', 'market'].includes(fK) ? 56 : ['rabbit', 'nature'].includes(fK) ? 30 : serifHead ? 22 : 12)}px 0 ${serifHead ? 22 : 12}px;font-size:${serifHead ? 10 : 9}px;letter-spacing:${serifHead ? '.02em' : '.06em'};color:${hText};${serifHead ? `font-family:${disp}` : ''}`);
  const hbg = NEWF && KF ? (() => { const img = KF.headerImage(W, 24, alt); img.style.cssText = `width:${W}px;height:24px;display:block`; return img; })() : pvCanvas(W, 24, x => drawPreviewHeader(x, W, 24, fK, hBase, alt ? wc.altText : wc.headText, wc, th));
  hbg.style.cssText += ';position:absolute;inset:0;z-index:-1';
  const tc = (s) => serifHead ? String(s).toLowerCase().replace(/(^|[\s\-\/(])([a-z])/g, (m, a2, b2) => a2 + b2.toUpperCase()) : s;
  hd.append(hbg, pv('span', 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis', tc(item.title)), pv('span', 'white-space:nowrap', tc(item.mode === 'status' ? 'LINK 0:42' : item.mode === 'transmission' ? 'SIGNAL 93%' : '')));
  card.append(hd);
  const tb = ['youtube', 'instagram', 'discord', 'game'].includes(item.mode) || (item.mode === 'oddity' && ['nature', 'vapor'].includes(frameFor(th))) || (frameFor(th) !== 'halcyon' && ['status', 'shift', 'transmission', 'solar', 'feeds'].includes(item.mode)) || (item.mode === 'audio' && ['halcyon', 'rabbit', 'cyber', 'market', 'vapor', 'nature'].includes(frameFor(th))) ? themedBody(item, th, wc, W, H) : null;
  if (tb) { tb.style.zIndex = '1'; card.append(tb); return { el: card, w: W, h: H }; }
  const bd = pv('div', 'position:relative;z-index:1;flex:1;display:flex;flex-direction:column;padding:10px 16px;gap:4px;min-height:0');
  card.append(bd);
  const lbl = (t, sz, op) => pv('span', `font-size:${Math.max(8, sz || 8)}px;opacity:${op || 0.78};letter-spacing:.04em`, t);
  const big = (t, sz) => pv('span', `font-family:${disp};font-size:${sz}px;line-height:1.1`, t);
  const row = (css) => pv('div', `display:flex;justify-content:space-between;align-items:flex-end;gap:10px;${css || ''}`);
  const meterEl = (frac, w, hot) => { const m = pv('div', `display:flex;gap:2px;width:${w}px`); for (let i = 0; i < 12; i++) m.append(pv('span', `flex:1;height:5px;background:${i < Math.round(frac * 12) ? (hot && i > 8 ? wc.headBg : wc.ink) : hexA(wc.ink, 0.15)}`)); return m; };
  const L = th.widget.L, units = th.units === 'celsius';
  if (item.mode === 'status') {
    const r1 = row(); const a = pv('div', 'display:flex;flex-direction:column;gap:3px'); a.append(lbl(L.next), big('Your next calendar event', 17), lbl('9:00 AM — 5:00 PM', 10, 1));
    const b = pv('div', `display:flex;flex-direction:column;gap:2px;padding-left:12px;border-left:1px solid ${hexA(wc.ink, 0.3)}`); b.append(lbl(L.ext), big(units ? '21°' : '69°', 32), lbl('CLEAR', 9, 1)); r1.append(a, b); bd.append(r1);
    const r2 = row('margin-top:auto'); [[L.dur, '8H 00M'], [L.state, L.queued], [L.feels, units ? '20°' : '68°'], [L.hilo, units ? '24° / 12°' : '75° / 54°']].forEach(([k, v]) => { const c = pv('div', 'display:flex;flex-direction:column'); c.append(lbl(k, 7.5), lbl(v, 10, 1)); r2.append(c); }); bd.append(r2);
  } else if (item.mode === 'shift') {
    bd.append(lbl(L.activeLong, 7.5), big('Your current event', 13), pv('div', 'flex:1'), big('3:42:10', 28), row().appendChild ? (() => { const r = row(); r.append(lbl('REMAINING', 7.5, 1), lbl('46%', 7.5)); return r; })() : null);
    const bar = pv('div', `height:5px;background:${hexA(wc.ink, 0.22)};position:relative`); bar.append(pv('div', `position:absolute;inset:0;width:46%;background:${wc.ink}`)); bd.append(bar);
  } else if (item.mode === 'transmission') {
    const sl = th.slogans[0] || ['Stand By', 'HQ'];
    const r = row(); r.append(lbl('MSG 0x7F3A // INBOUND', 8), lbl('CLASS: ' + (th.widget.classes[0] || 'DIRECTIVE'), 8)); bd.append(r);
    bd.append(big(sl[0], 20), lbl(`— ${th.company.toUpperCase()} · ${sl[1]}`, 7.5), pv('div', 'flex:1'));
    bd.append(pvCanvas(336, 26, x => { x.strokeStyle = wc.ink; x.lineWidth = 1.4; x.beginPath(); for (let i = 0; i <= 336; i += 2) { const y = 13 + Math.sin(i * 0.12) * 9; i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); x.strokeStyle = hexA(wc.ink, 0.5); x.beginPath(); for (let i = 0; i <= 336; i += 2) { const y = 13 - Math.sin(i * 0.12) * 9; i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); }));
  } else if (item.mode === 'solar') {
    const D = deckFor(th); const r = row(); const a = pv('div', 'display:flex;flex-direction:column'); a.append(lbl(D.solar.day, 9), big('63%', 44)); const b = pv('div', 'display:flex;flex-direction:column;align-items:flex-end'); b.append(lbl(D.solar.setIn, 9), big('4:12:08', 22)); r.append(a, b); bd.append(r);
    const g = pv('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:6px 10px;margin-top:6px');
    [['PRECIP // 12H MAX', '10%'], ['MOISTURE // RH', '47%'], ['UV INDEX', '3 MOD'], ['VISIBILITY', '10 mi'], ['DEW POINT', '45°'], ['WIND VECTOR', '7 NE']].forEach(([k, v]) => { const c = pv('div', 'display:flex;flex-direction:column'); c.append(lbl(k, 7), big(v, 16)); g.append(c); }); bd.append(g);
    bd.append(pv('div', 'flex:1'));
    bd.append(pvCanvas(336, 110, x => { x.strokeStyle = hexA(wc.ink, 0.35); x.lineWidth = 1.2; x.beginPath(); for (let t = 0; t <= 1.001; t += 0.02) { const px = 8 + 320 * t, py = 100 - 86 * (1 - Math.pow(Math.abs(2 * t - 1), 2.2)); t ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); x.strokeStyle = wc.ink; x.lineWidth = 2.4; x.beginPath(); for (let t = 0; t <= 0.38; t += 0.02) { const px = 8 + 320 * t, py = 100 - 86 * (1 - Math.pow(Math.abs(2 * t - 1), 2.2)); t ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); x.fillStyle = wc.ink; x.fillRect(0, 100, 336, 1.2); const st = 0.38, px = 8 + 320 * st, py = 100 - 86 * (1 - Math.pow(Math.abs(2 * st - 1), 2.2)); x.fillRect(px - 6, py - 6, 12, 12); }));
    const f = row(); f.append(lbl('RISE 7:02 AM', 9, 1), lbl('DAY 11H 22M', 9), lbl('SET 6:24 PM', 9, 1)); bd.append(f);
  } else if (item.mode === 'audio' && !['halcyon', 'rabbit', 'cyber', 'market', 'vapor', 'nature'].includes(frameFor(th)) && scriptableKit(th)) {
    const K = scriptableKit(th), D = deckFor(th), f = frameFor(th), line = D.audio.lines[0], r = K.aSeed(f.length);
    bd.style.gap = '3px';
    const foot = () => { const fr = row(); fr.append(lbl(D.audio.tap + '0:42', 8, 1), lbl(D.audio.foot, 8)); return fr; };
    const img = (c) => { c.style.display = 'block'; return c; };
    if (f === 'directive') {
      const top = pv('div', 'display:flex;gap:14px;align-items:flex-start'); const left = pv('div', 'display:flex;flex-direction:column;gap:3px');
      left.append(img(K.sevenSeg('94.3', 42, { css: () => wc.headBg }, { css: () => hexA(wc.ink, 0.08) }).img));
      const lr = pv('div', 'display:flex;align-items:center;gap:6px'); lr.append(lbl('MHZ', 8), pv('span', `background:${wc.headBg};color:${wc.headText};font-size:8px;padding:1px 4px`, 'ON AIR')); left.append(lr);
      const col = pv('div', 'display:flex;flex-direction:column;gap:2px'); col.append(lbl('EMERGENCY BROADCAST SYSTEM', 8), big(line, 19)); top.append(left, col); bd.append(top, pv('div', 'flex:1'), img(K.dialStrip(332, 18, 94.3)), img(K.hexVU(332, 14, 11)), foot());
    } else if (f === 'longroad') {
      const top = pv('div', 'display:flex;gap:14px;align-items:flex-start'); const lute = img(K.luteImg(92)); const col = pv('div', 'display:flex;flex-direction:column;gap:2px');
      col.append(lbl('A BALLAD, SUNG AT THE INN', 8), big(line, 18), pv('span', `font-size:7.5px;color:${wc.headBg}`, `VERSE II OF IX · ${D.audio.metric} ♪♪♪`), img(K.staffImg(226, 30, r))); top.append(lute, col); bd.append(top, pv('div', 'flex:1'), foot());
    } else if (f === 'nightfall') {
      const top = pv('div', 'display:flex;gap:14px;align-items:flex-start'); const col = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); col.append(lbl(D.audio.src, 8), big(line, 16));
      ['ALPHA-1', 'ALPHA-2', 'BRAVO-3', 'YOU'].forEach((nm, i) => { const rr = pv('div', 'display:flex;align-items:center;gap:6px'); const on = i === 1; const m = pv('div', `width:120px;height:4px;background:${hexA(wc.ink, 0.22)};position:relative`); m.append(pv('div', `position:absolute;inset:0;width:${on ? 86 : 12 + i * 6}%;background:${wc.ink}`)); rr.append(pv('span', `width:60px;font-size:7.5px;opacity:${on ? 1 : 0.7}`, nm), m, pv('span', `font-size:7.5px;color:${on ? wc.accent : 'inherit'};opacity:${on ? 1 : 0.6}`, on ? 'TX' : '··')); col.append(rr); });
      top.append(img(K.commRing(86, r)), col); bd.append(top, pv('div', 'flex:1'), foot());
    } else if (f === 'grimoire') {
      const top = pv('div', 'display:flex;gap:14px;align-items:flex-start'); const col = pv('div', 'display:flex;flex-direction:column;gap:3px'); col.append(lbl(D.audio.src, 8), big(line, 18), pv('span', `font-size:7.5px;color:${wc.accent}`, `BOUND TO THE HOUR · ${D.audio.metric} ◆◆◆◇◇`), pv('span', `font-family:${disp};font-size:10.5px;color:${hexA(wc.accent, 0.85)}`, '\u201CLumen vael, sorin ithe.\u201D'));
      top.append(img(K.runeCircle(84, r)), col); bd.append(top, pv('div', 'flex:1'), img(K.ribbon(324, 16, r)), foot());
    } else {
      const wf = K.waterfall(332, 46, r); bd.append(img(wf.img)); const tk = row(); ['88.0', '93.0', '98.0', '103.0', '108.0 MHZ'].forEach(l => tk.append(lbl(l, 6.5))); bd.append(tk);
      const rr = row('align-items:center'); const cc = pv('div', 'display:flex;flex-direction:column;align-items:flex-end'); cc.append(lbl(`${(88 + wf.at * 20).toFixed(1)} MHZ`, 8.5, 1), lbl('SNR 31 DB', 8.5)); rr.append(pv('span', 'font:800 20px system-ui,sans-serif;letter-spacing:.01em', 'CARRIER LOCKED'), cc); bd.append(rr, pv('span', `font-size:8px;color:${wc.headBg}`, line.toUpperCase()), pv('div', 'flex:1'), foot());
    }
  } else if (item.mode === 'audio') {
    const r = pv('div', 'display:flex;align-items:center;gap:14px'); const g = pv('div', `width:40px;height:40px;border:2px solid ${wc.ink};display:grid;place-items:center`); g.append(pv('div', `width:0;height:0;border-left:16px solid ${wc.ink};border-top:10px solid transparent;border-bottom:10px solid transparent;margin-left:4px`)); const D = deckFor(th); const c = pv('div', 'display:flex;flex-direction:column;gap:2px'); c.append(lbl(D.audio.src, 9), big(D.audio.lines[0], 21)); r.append(g, c); bd.append(r, pv('div', 'flex:1'));
    const wv = pv('div', 'display:flex;align-items:center;gap:2px;height:20px'); for (let i = 0; i < 64; i++) wv.append(pv('span', `width:2px;height:${4 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.21)) * 16}px;background:${wc.ink}`)); bd.append(wv);
    const f = row(); f.append(lbl(D.audio.tap + '0:42', 8.5, 1), lbl(D.audio.foot, 8.5)); bd.append(f);
  } else if (item.mode === 'feeds' || item.mode === 'youtube') {
    const r = pv('div', 'display:flex;gap:12px;flex:1');
    const D = deckFor(th), cy = (k) => `${(th.codes[k] || k).slice(0, 5)}-${k === 'youtube' ? '09' : '10'}`;
    const ytRow = [cy('youtube'), D.feeds.yt.line, [[D.feeds.yt.meters[0], 0.86], [D.feeds.yt.meters[1], 0.55], [D.feeds.yt.meters[2], 0.12]]];
    const igRow = [cy('instagram'), D.feeds.ig.line, [[D.feeds.ig.meters[0], 0.78], [D.feeds.ig.meters[1], 0.22], [D.feeds.ig.meters[2], 0.7]]];
    (item.mode === 'feeds' ? [ytRow, igRow] : [ytRow]).forEach(([code, line, ms], idx) => {
      const c = pv('div', `flex:1;display:flex;flex-direction:column;gap:4px;${idx ? `border-left:1px solid ${hexA(wc.ink, 0.3)};padding-left:12px` : ''}`);
      c.append(lbl(code, 7.5), big(line, 15));
      ms.forEach(([k, v]) => { const rr = row('align-items:center'); rr.append(lbl(k, 8), meterEl(v, 60, true), lbl(Math.round(v * 100) + '%', 9, 1)); c.append(rr); });
      r.append(c);
    });
    if (item.mode === 'youtube') { const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:5px'); [[D.feeds.yt.kv[0], D.feeds.yt.queue], [D.feeds.yt.kv[1], '6.5 ' + (D.feeds.yt.u1 || 'SEC')], [D.feeds.yt.kv[2], (D.feeds.yt.u2 || 'DEPTH') + ' 4']].forEach(([k, v]) => { const rr = row(); rr.append(lbl(k, 8), lbl(v, 9, 1)); c.append(rr); }); r.append(c); }
    bd.append(r);
    bd.append(pvCanvas(336, 16, x => { x.strokeStyle = wc.ink; x.lineWidth = 1.1; x.beginPath(); for (let i = 0; i <= 336; i += 2) { const sp = (i % 60) < 6 ? -6 : 0; const y = 8 + Math.sin(i * 0.4) * 1.5 + sp; i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); }));
    const f = row(); f.append(lbl(D.feeds.tap.replace(/\s*·.*$/, '') + ' 0:42', 7.5, 1), lbl(item.mode === 'feeds' ? D.feeds.foot : D.feeds.yt.foot, 7.5)); bd.append(f);
  } else if (item.mode === 'oddity') {
    bd.style.gap = '2px';
    const t = oddityFor(th);
    const kvr = (k, v, col) => { const rr = row(); rr.append(lbl(k, 8), pv('span', `font-size:9px;${col ? 'color:' + col : ''}`, v)); return rr; };
    const stampEl = (txt2, sz) => pv('span', `align-self:flex-start;border:1.5px solid ${wc.headBg};color:${wc.headBg};font-size:${sz || 9}px;padding:1px 5px;border-radius:2px;white-space:nowrap`, txt2);
    const ro = (k, v) => { const c = pv('div', 'display:flex;flex-direction:column'); c.append(lbl(k, 8), pv('span', 'font-size:9.5px', v)); return c; };
    const sparkEl = (vals) => pvCanvas(332, 16, x => { const mx = Math.max(...vals), mn = Math.min(...vals); x.fillStyle = hexA(wc.ink, 0.12); x.fillRect(0, 15, 332, 1); x.strokeStyle = wc.ink; x.lineWidth = 1.3; x.beginPath(); vals.forEach((v, i) => { const px = 2 + i / (vals.length - 1) * 328, py = 13 - (v - mn) / (mx - mn) * 10; i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.stroke(); vals.forEach((v, i) => { const px = 2 + i / (vals.length - 1) * 328, py = 13 - (v - mn) / (mx - mn) * 10; x.fillStyle = i === vals.length - 1 ? wc.headBg : wc.ink; x.fillRect(px - 1.5, py - 1.5, 3, 3); }); });
    const vis = (S, draw) => pvCanvas(S, S, draw);
    const r2 = pv('div', 'display:flex;gap:12px');
    if (t === 'mood') {
      r2.append(vis(80, x => { [0.18, 0.3, 0.42].forEach(f => { x.globalAlpha = 0.45; x.strokeStyle = wc.ink; x.beginPath(); x.arc(40, 40, 80 * f, 0, Math.PI * 2); x.stroke(); }); x.globalAlpha = 1; x.strokeStyle = wc.accent; x.lineWidth = 4; x.beginPath(); x.arc(40, 40, 33, -Math.PI / 2, Math.PI * 1.35); x.stroke(); x.strokeStyle = wc.ink; x.lineWidth = 2; x.beginPath(); x.arc(40, 37, 11, 0.2 * Math.PI, 0.8 * Math.PI); x.stroke(); x.fillStyle = wc.ink; x.fillRect(32, 31, 3, 3); x.fillRect(45, 31, 3, 3); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:3px');
      const tp = row(); tp.append(lbl('ACCT 0x4F2A-07', 8), lbl('EMOTIONAL CREDIT 612', 8)); c.append(tp);
      [['DREAD', 'INCLUDED', 0.64], ['JOY', 'OVER QUOTA', 0.98], ['NOSTALGIA', 'PREMIUM · LOCKED', 0.3]].forEach(([k, s2, v]) => { const rr = row(); rr.append(pv('span', 'font-size:9px', k), pv('span', `font-size:8px;color:${s2 === 'OVER QUOTA' ? wc.headBg : 'inherit'};opacity:${s2 === 'OVER QUOTA' ? 1 : 0.78}`, s2)); c.append(rr, meterEl(v, 220, s2 === 'OVER QUOTA')); });
      r2.append(c); bd.append(r2, pv('div', 'flex:1'), big('Upgrade to Tier IV for unlimited wistfulness.', 12), pv('span', `font-size:8px;color:${wc.headBg}`, 'LATE FEE APPLIED TO ONE (1) LAUGH'));
      const f = row(); f.append(lbl('NEXT MANDATORY SMILE 3:15 PM', 8), pv('span', 'font-size:8px', 'RENEWAL 29.99/MO')); bd.append(f);
    } else if (t === 'eval') {
      const sync = 0.42;
      r2.append(vis(70, x => { const cx = 35, R = 32, chaos = 1 - sync; let sd = 7; const rr = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; };
        for (let i = 0; i < 18; i++) { const a0 = Math.PI * 0.75 + i * Math.PI * 1.5 / 18; x.fillStyle = i / 18 < sync ? wc.accent : hexA(wc.ink, 0.15); x.beginPath(); x.arc(cx, cx, R, a0, a0 + 0.18); x.arc(cx, cx, R * 0.84, a0 + 0.18, a0, true); x.fill(); }
        const loops = 3 + Math.round(chaos * 9), core = R * 0.74;
        for (let k = 0; k < loops; k++) { const base = core * (0.25 + 0.75 * (k + 1) / loops), amp = chaos * chaos * core * 0.55, freq = 3 + Math.floor(rr() * 6 * chaos + chaos * 4), ph = rr() * 6.28; x.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, r0 = Math.min(core, Math.max(2, base + Math.sin(a * freq + ph) * amp * 0.6 + (rr() - 0.5) * amp * 0.8)); const px = cx + r0 * Math.cos(a), py = cx + r0 * Math.sin(a); i ? x.lineTo(px, py) : x.moveTo(px, py); } const hot = chaos > 0.45 && k % 3 === 0; x.strokeStyle = hot ? wc.headBg : hexA(wc.ink, 0.35 + 0.5 * (k / loops)); x.lineWidth = hot ? 1.2 : 0.8; x.stroke(); }
        if (chaos > 0.55) for (let s = 0; s < Math.round(chaos * 14); s++) { const a = rr() * Math.PI * 2, r1 = core * rr() * 0.6, r2 = core * (0.6 + rr() * 0.4); x.strokeStyle = wc.headBg; x.lineWidth = 0.9; x.beginPath(); x.moveTo(cx + r1 * Math.cos(a), cx + r1 * Math.sin(a)); x.lineTo(cx + r2 * Math.cos(a + 0.3), cx + r2 * Math.sin(a + 0.3)); x.stroke(); }
        x.fillStyle = hexA(wc.panel, 0.82); x.fillRect(cx - 20, cx - 8, 40, 16); x.fillStyle = wc.ink; x.font = `700 11px ${mono}`; x.textAlign = 'center'; x.fillText('42.0%', cx, cx + 4); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:5px'); c.append(pv('span', `font-size:8px;color:${wc.headBg}`, 'SYNC 42.0% · CRITICAL · SUBJECT 417'));
      const g1 = row(); g1.append(ro('HARMONICS', '±0.21'), ro('CONTAMINATION', '0.3%'), ro('HESITATION', '7')); const g2 = row('justify-content:flex-start;gap:28px'); g2.append(ro('TEARS', 'WITHIN TOLERANCE'), ro('SHELTER', 'S-9 / 114'));
      c.append(g1, g2); r2.append(c); bd.append(r2, pv('div', 'flex:1'));
      const sl = row('align-items:center'); const sp2 = sparkEl([0.42, 0.58, 0.51, 0.77, 0.63, 0.81, 0.55, 0.67]); sp2.style.width = '206px'; sp2.style.height = '12px'; sl.append(lbl('8-DAY SYNC', 8), sp2, lbl('PEAK 81%', 8)); bd.append(sl);
      const nr = row('align-items:center'); nr.append(pv('span', `font-family:${disp};font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, 'NOTE: Hesitated at the word \u2018mandatory\u2019.'), stampEl('FIT FOR SORTIE', 8.5)); bd.append(nr);
    } else if (t === 'omens') {
      const hd2 = row(); hd2.append(lbl('THE 10TH DAY OF MISTMOON', 8), lbl('WAXING CRESCENT', 8)); bd.append(hd2);
      r2.append(vis(58, x => { x.scale(58 / 72, 58 / 72); x.strokeStyle = hexA(wc.ink, 0.4); x.beginPath(); x.arc(36, 36, 29, 0, Math.PI * 2); x.stroke(); x.strokeStyle = hexA(wc.ink, 0.2); x.beginPath(); x.arc(36, 36, 24, 0, Math.PI * 2); x.stroke(); x.fillStyle = wc.ink; x.font = `700 8.5px ${mono}`; x.textAlign = 'center'; [['N', 36, 8], ['E', 69, 39], ['S', 36, 71], ['W', 3, 39]].forEach(([l, a2, b2]) => x.fillText(l, a2, b2)); x.strokeStyle = wc.ink; x.lineWidth = 2; x.beginPath(); x.moveTo(20, 52); x.lineTo(52, 20); x.stroke(); x.fillStyle = wc.headBg; x.beginPath(); x.moveTo(54, 18); x.lineTo(44, 21); x.lineTo(51, 28); x.fill(); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); c.append(big('A goose was seen walking backwards.', 13), pv('span', `font-size:8px;color:${wc.headBg}`, 'MEANING: SOMEONE WILL OWE YOU BREAD.'));
      c.append(pvCanvas(240, 12, x => { const mid = 6; x.strokeStyle = hexA(wc.ink, 0.8); x.lineWidth = 0.9; x.beginPath(); for (let i = 6; i <= 234; i += 2) { const y = mid + Math.sin(i * 0.09) * 2.6; i === 6 ? x.moveTo(i, y) : x.lineTo(i, y); } x.stroke(); x.fillStyle = hexA(wc.ink, 0.65); for (let i = 16; i < 226; i += 18) { const y = mid + Math.sin(i * 0.09) * 2.6, up = (i / 18) % 2 < 1 ? -1 : 1; x.beginPath(); x.moveTo(i, y); x.quadraticCurveTo(i + 5, y + up * 7, i + 9, y + up * 3); x.quadraticCurveTo(i + 6, y + up * 0.5, i, y); x.fill(); } x.fillStyle = wc.headBg; x.beginPath(); x.arc(120, mid, 1.6, 0, Math.PI * 2); x.fill(); }));
      c.append(pv('span', `font-family:${disp};font-size:10px;opacity:.75`, '“Laevi thae roma vaeli wolin.”'));
      r2.append(c); bd.append(r2, pv('div', 'flex:1'));
      const g = row(); g.append(ro('ROADS', 'MIDDLING'), ro('PANTRY', '3 LOAVES'), ro('NEAREST INN', '4 LEAGUES · NO PIE')); bd.append(g);
      const f = row('align-items:center'); const m2 = pv('div', 'display:flex;align-items:center;gap:6px'); m2.append(lbl('SECOND THOUGHTS', 8), meterEl(0.6, 80, true)); f.append(pv('span', 'font-size:8px', 'LUCKY: A SMOOTH STONE'), m2); bd.append(f);
    } else if (t === 'hostile') {
      r2.append(vis(80, x => { x.strokeStyle = hexA(wc.ink, 0.08); for (let g = 0; g <= 32; g += 8) { x.beginPath(); x.moveTo(4, 24 + g); x.lineTo(76, 24 + g); x.stroke(); } [3, 2, 1].forEach(ring => { const f = ring / 3; x.strokeStyle = ring === 1 ? wc.headBg : hexA(wc.accent, 0.35 + (3 - ring) * 0.25); x.lineWidth = ring === 1 ? 1.6 : 1; x.beginPath(); for (let i = 0; i <= 24; i++) { const a2 = i / 24 * Math.PI * 2, q = 1 + Math.sin(i * 2.3 + ring) * 0.12; const px = 40 + Math.cos(a2) * 15 * (0.45 + f * 0.6) * q, py = 40 + Math.sin(a2) * 22 * (0.45 + f * 0.6) * q; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }); x.strokeStyle = wc.accent; x.lineWidth = 2.2; x.beginPath(); x.arc(40, 40, 26, Math.PI * 0.65, Math.PI * 1.35); x.stroke(); x.strokeStyle = wc.headBg; x.lineWidth = 1.6; [[2, 2, 1, 1], [78, 2, -1, 1], [2, 78, 1, -1], [78, 78, -1, -1]].forEach(([a2, b2, sx, sy]) => { x.beginPath(); x.moveTo(a2 + sx * 10, b2); x.lineTo(a2, b2); x.lineTo(a2, b2 + sy * 10); x.stroke(); }); x.fillStyle = wc.headBg; x.font = `700 6.5px ${mono}`; x.textAlign = 'center'; x.fillText('IFF: HOSTILE', 40, 76); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:3px'); c.append(big('BUCKETHEAD', 16), lbl('HX-42 · SHIELD-BEARER', 8));
      const tr = pv('div', 'display:flex;align-items:center;gap:3px'); tr.append(lbl('THREAT', 8)); for (let i = 0; i < 4; i++) tr.append(pv('span', `width:10px;height:5px;background:${i < 2 ? wc.ink : hexA(wc.ink, 0.15)}`)); tr.append(pv('span', 'font-size:8px;margin-left:3px', 'MEDIUM')); c.append(tr);
      [['ARMOR', 0.8], ['AGGRESSION', 0.45], ['COWARDICE', 0.7]].forEach(([k, v]) => { const rr = row('align-items:center'); rr.append(lbl(k, 8), meterEl(v, 110, k === 'AGGRESSION')); c.append(rr); });
      r2.append(c); bd.append(r2, pv('div', 'flex:1'), lbl('GRID 7-K · 3 CONTACTS · HOLDS GROUND, SULKS', 8));
      const tp = row('align-items:center'); tp.append(pv('span', 'font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', 'WEAK TO COMPLIMENTS · MENTION ITS POSTURE.'), stampEl('BEFRIEND', 8)); bd.append(tp);
    } else if (['market', 'tip', 'mall', 'species', 'bet'].includes(t)) {
      const Kx = scriptableKit(th);
      const V = { bet: (x) => { let v = 0.5; for (let i = 0; i < 9; i++) { const o = v; v = Math.max(0.1, Math.min(0.9, v + Math.sin(i * 1.3) * 0.2)); x.fillStyle = v >= o ? wc.altBg : '#E8384F'; const yt = 12 + 40 * (1 - Math.max(o, v)), yb = 12 + 40 * (1 - Math.min(o, v)); x.fillRect(8 + i * 7, yt, 5, Math.max(2, yb - yt)); } x.fillStyle = hexA(wc.altBg, 0.8); x.fillRect(6, 62, 44, 9); x.fillStyle = 'rgba(232,56,79,.6)'; x.fillRect(50, 62, 24, 9); }, market: (x) => { x.strokeStyle = wc.headBg; x.lineWidth = 1.4; x.strokeRect(6, 24, 68, 40); x.fillStyle = hexA(wc.accent, 0.5); x.beginPath(); x.moveTo(26, 44); x.lineTo(40, 34); x.lineTo(54, 44); x.lineTo(40, 54); x.closePath(); x.fill(); x.fillStyle = wc.altBg; x.font = `700 11px ${mono}`; x.textAlign = 'center'; x.fillText('499c', 40, 16); }, tip: (x) => { x.fillStyle = hexA(wc.headBg, 0.25); x.strokeStyle = '#FFFFFF'; x.lineWidth = 1.4; x.beginPath(); x.arc(40, 40, 34, 0, Math.PI * 2); x.fill(); x.stroke(); x.fillStyle = '#FFF6B0'; x.beginPath(); x.arc(40, 38, 11, 0, Math.PI * 2); x.fill(); }, mall: (x) => { x.fillStyle = '#C3C3D0'; x.fillRect(4, 10, 72, 64); [wc.headBg, wc.altBg, '#FFFB96', wc.headBg, wc.altBg, '#FFFB96'].forEach((c2, i) => { x.globalAlpha = i === 2 ? 1 : 0.4; x.fillStyle = c2; x.fillRect(10 + (i % 3) * 22, 20 + Math.floor(i / 3) * 22, 18, 18); }); x.globalAlpha = 1; }, species: (x) => { x.fillStyle = wc.panel; x.strokeStyle = hexA(wc.ink, 0.6); x.beginPath(); x.arc(40, 40, 34, 0, Math.PI * 2); x.fill(); x.stroke(); x.fillStyle = wc.headBg; x.beginPath(); x.moveTo(22, 50); x.quadraticCurveTo(36, 30, 50, 40); x.quadraticCurveTo(36, 52, 22, 50); x.fill(); } }[t];
      r2.append(vis(80, V));
      const P2 = { bet: ['MARKET #4417 · RESOLVES TONIGHT', 'Will today happen twice?', 'YES 12¢ · NO 88¢', [['PAYOUT', 'x1.6'], ['LEVERAGE', '25X'], ['YOUR POSITION', 'ALL IN']], 'NOT FINANCIAL ADVICE'], market: ['SELLER @gl1tch · ★4.6', 'Used Optic Mod (Slightly Haunted)', '499 CREDITS · REFURBISHED', [['WARRANTY', 'NONE'], ['RETURNS', 'LOL']], 'MEET AT THE NOODLE STAND'], tip: ['DID YOU KNOW?', 'Sea otters hold hands while they sleep.', '', [['OPTIMISM', '97%'], ['BUBBLES POPPED', '212']], 'HAVE A GREAT DAY'], mall: ['STORE OF THE HOUR', 'Sunset Video', 'CLOSED SINCE 1997', [['FLOOR', 'LEVEL 2'], ['FOUNTAIN COINS', '641']], 'NOW PLAYING: FOOD COURT WALTZ'], species: ['SPOTTED BY THE CREEK', 'Great Horned Owl', 'Bubo virginianus', [['FACT', "Its 'horns' are feather tufts."]], "LOOK, DON'T DISTURB"] }[t];
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); c.append(lbl(P2[0], 8), big(P2[1], 14)); if (P2[2]) c.append(pv('span', `font-size:8px;color:${wc.headBg}`, P2[2])); P2[3].forEach(([k2, v2]) => c.append(kvr(k2, v2)));
      r2.append(c); bd.append(r2, pv('div', 'flex:1'), lbl(P2[4], 8));
    } else if (t === 'heist') {
      r2.append(vis(80, x => { x.fillStyle = hexA(wc.headBg, 0.2); x.strokeStyle = hexA(wc.ink, 0.6); x.lineWidth = 1; x.fillRect(19, 14, 42, 39); x.strokeRect(19, 14, 42, 39); x.fillStyle = wc.panel; x.strokeStyle = wc.ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(16, 69); x.lineTo(64, 69); x.lineTo(58, 53); x.lineTo(22, 53); x.closePath(); x.fill(); x.stroke(); x.fillStyle = hexA(wc.accent, 0.55); x.beginPath(); x.moveTo(28, 33); x.lineTo(33, 26); x.lineTo(47, 26); x.lineTo(52, 33); x.lineTo(40, 49); x.closePath(); x.fill(); x.stroke(); x.strokeStyle = wc.accent; x.lineWidth = 1; [[10, 4], [28, 18], [46, 4], [64, 18]].forEach(([y1, y2], i) => { x.globalAlpha = i < 3 ? 0.85 : 0.2; x.beginPath(); x.moveTo(2, y1); x.lineTo(78, y2); x.stroke(); }); x.globalAlpha = 1; }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); c.append(lbl('TARGET', 8), big('The Seventh Heirloom', 15), pv('span', `font-size:8px;color:${wc.headBg}`, 'AT THE GALA · EAST WING'), kvr('SECURITY', '▮▮▮▯▯'), kvr('CREW', 'TWO RABBITS'), kvr('ODDS', '63%'));
      r2.append(c); bd.append(r2, pv('div', 'flex:1'));
      const f2 = row('align-items:center'); const m2 = pv('div', 'display:flex;align-items:center;gap:6px'); m2.append(lbl('NERVE', 8), meterEl(0.63, 90, true)); f2.append(pv('span', 'font-size:8px', 'CALLING CARD: READY'), m2); bd.append(f2);
    } else if (t === 'late') {
      r2.append(vis(80, x => { x.fillStyle = wc.panel; x.strokeStyle = wc.ink; x.lineWidth = 1.4; x.beginPath(); x.arc(40, 43, 32, 0, Math.PI * 2); x.fill(); x.stroke(); x.strokeStyle = wc.headBg; x.lineWidth = 0.8; x.beginPath(); x.arc(40, 43, 27, 0, Math.PI * 2); x.stroke(); x.strokeStyle = wc.accent; x.lineWidth = 1.6; x.beginPath(); x.moveTo(40, 43); x.lineTo(58, 32); x.stroke(); x.strokeStyle = wc.ink; x.lineWidth = 2; x.beginPath(); x.moveTo(40, 43); x.lineTo(40, 30); x.stroke(); x.beginPath(); x.arc(40, 7, 4, 0, Math.PI * 2); x.stroke(); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); c.append(lbl('LATE FOR', 8), big('Tea, Promptly At Six', 15), pv('span', `font-size:8.5px;color:${wc.headBg}`, 'BY 23 MINUTES'), pv('span', `font-family:${disp};font-size:10.5px;opacity:.75`, 'Stopped to paint the roses red.'));
      r2.append(c); bd.append(r2, pv('div', 'flex:1'));
      const f2 = row('align-items:center'); const m2 = pv('div', 'display:flex;align-items:center;gap:6px'); m2.append(lbl('PANIC', 8), meterEl(0.8, 90, true)); f2.append(pv('span', 'font-size:8px', 'TEA: STEEPING'), m2); bd.append(f2);
    } else if (t === 'spell') {
      r2.append(vis(70, x => { x.scale(70 / 80, 70 / 80); x.strokeStyle = wc.accent; x.beginPath(); x.arc(40, 40, 36, 0, Math.PI * 2); x.stroke(); x.globalAlpha = 0.5; x.beginPath(); x.arc(40, 40, 31, 0, Math.PI * 2); x.stroke(); x.globalAlpha = 1; for (let i = 0; i < 12; i++) { const a2 = i / 12 * Math.PI * 2; x.beginPath(); x.moveTo(40 + 31 * Math.cos(a2), 40 + 31 * Math.sin(a2)); x.lineTo(40 + 36 * Math.cos(a2), 40 + 36 * Math.sin(a2)); x.stroke(); } x.beginPath(); for (let i = 0; i <= 5; i++) { const a2 = -Math.PI / 2 + (i * 2 % 5) * Math.PI * 2 / 5; const px = 40 + 27 * Math.cos(a2), py = 40 + 27 * Math.sin(a2); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.stroke(); x.fillStyle = wc.altBg; x.beginPath(); x.arc(40, 40, 8, 0, Math.PI * 2); x.fill(); x.strokeStyle = wc.ink; x.stroke(); }));
      const c = pv('div', 'flex:1;display:flex;flex-direction:column;gap:2px'); c.append(big('Lesser Summon Snack', 16));
      const ln2 = row(); ln2.append(lbl('CONJURATION · RARE', 8), pv('span', `font-size:9px;color:${wc.accent}`, '◆◆')); c.append(ln2, kvr('CASTING TIME', "INSTANT · ARM'S REACH"), kvr('COMPONENTS', 'A HUNGRY THOUGHT'));
      r2.append(c); bd.append(r2, pv('div', 'flex:1'), pv('span', `font-family:${disp};font-size:11px;color:${wc.accent}`, '\u201CVelkar\u2019ith Umbrazor Miroth.\u201D'), pv('span', 'font-size:8px', 'CONJURES EXACTLY ONE (1) CRACKER.'), lbl('SIDE EFFECT: CRUMBS, EVERYWHERE. · COOLDOWN 6H', 8));
    } else {
      const hd2 = row(); hd2.append(lbl('TRANSMISSION 0417', 8.5)); bd.append(hd2, big('"IS ANYONE GETTING THESE"', 18));
      bd.append(pvCanvas(332, 26, x => { x.strokeStyle = wc.ink; x.lineWidth = 1.2; x.beginPath(); for (let i = 0; i <= 332; i += 2) { const tt = i / 332, y = 13 + (1 - tt) * Math.sin(i * 1.7) * 10 + Math.sin(i * 0.18) * 5 * tt; i ? x.lineTo(i, y) : x.moveTo(i, y); } x.stroke(); x.fillStyle = wc.headBg; for (let i = 10; i < 332; i += 34) x.fillRect(i, 23, 8, 3); }));
      bd.append(pv('div', 'flex:1')); const g = row(); g.append(ro('CONFIDENCE', '64%'), ro('ECHO DELAY', '4.2 YR'), ro('SOURCE', 'BEHIND YOU (UNLIKELY)'), ro('SALVAGE', 'PRICELESS (DISPUTED)')); bd.append(g);
    }
  }
  [...bd.children].forEach(c => { if (!/flex:\s*1/.test(c.style.cssText)) c.style.flexShrink = '0'; });
  return { el: card, w: W, h: H };
}
function buildGallery() {
  const host = $('gallery'); if (!host) return;
  host.textContent = '';
  const th = state.th;
  widgetList(th).forEach(item => {
    const art = document.createElement('article'); art.className = 'wg';
    const frame = document.createElement('div'); frame.className = 'wg-frame';
    const p = previewWidget(item, th);
    const scaler = document.createElement('div'); scaler.className = 'wg-scale';
    scaler.style.width = p.w + 'px'; scaler.style.height = p.h + 'px';
    scaler.append(p.el); frame.append(scaler);
    const meta = document.createElement('div'); meta.className = 'wg-meta';
    const h = document.createElement('h3'); h.textContent = item.name;
    const d = document.createElement('p'); d.textContent = item.desc;
    const dl = document.createElement('dl');
    [['Parameter', item.mode], ['Best size', item.size], ['When tapped', item.tap]].forEach(([k, v]) => { const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v; dl.append(dt, dd); });
    meta.append(h, d, dl);
    const idx = host.children.length; makeInspectable(frame, `Enlarge ${item.name} preview`, () => openInspector(widgetItems(), idx, frame));
    art.append(frame, meta); host.append(art);
  });
  fitGallery();
}
function fitGallery() {
  document.querySelectorAll('.wg-frame').forEach(f => {
    const s = f.querySelector('.wg-scale'); if (!s) return;
    const w = parseFloat(s.style.width), h = parseFloat(s.style.height);
    const avail = Math.min(f.clientWidth || w, 380), k = Math.min(1, avail / w);
    s.style.transform = `scale(${k})`; f.style.height = (h * k) + 'px';
  });
}


// ---------- inspector: full-screen, zoomable view of any screen, widget or icon ----------
const insp = { items: [], i: 0, z: 1, opener: null };
function screenItems(mode) {
  const th = state.th, n = mode === 'lock' ? 4 : homeFrameCount(th)
  return Array.from({ length: n }, (_, i) => ({ title: mode === 'lock' ? `Lock screen ${i + 1}` : `Home screen ${i + 1}`, file: `${th.id}-${mode}-${i + 1}.png`, png: true,
    render(z, aw, ah) { const base = aw < 600 ? aw : Math.min(aw, Math.max(320, ah * 390 / 844)), dw = base * z, px = Math.min(2700, Math.round(dw * Math.min(3, window.devicePixelRatio || 2))); const cv = document.createElement('canvas'); cv.width = px; cv.height = Math.round(px * 844 / 390); drawWallpaper(cv, th, mode, i); cv.style.cssText = `width:${dw}px;height:${dw * 844 / 390}px;display:block;border-radius:${18 * z}px`; return cv } }))
}
function widgetItems() {
  const th = state.th
  return widgetList(th).map(item => ({ title: item.name + ' · ' + item.mode, render(z, aw) { const W = hbOn(th) ? ((state.hbSize || (item.mode === 'shift' ? 'small' : 'medium')) === 'small' ? 170 : 364) : item.mode === 'shift' ? 170 : 364, s = Math.min(aw, item.mode === 'shift' ? 340 : 600) / W * z; window.__pvRes = Math.min(3, s); let p; try { p = previewWidget(item, th) } finally { window.__pvRes = 1 } const wrap = document.createElement('div'); wrap.style.cssText = `width:${p.w * s}px;height:${p.h * s}px;flex:none`; p.el.style.transform = `scale(${s})`; p.el.style.transformOrigin = '0 0'; wrap.append(p.el); return wrap } }))
}
function iconItems() {
  const th = state.th
  return APPS.map(([key, name], i) => ({ title: `${name} icon`, file: `${th.id}-icon-${String(i + 1).padStart(2, '0')}-${key}.png`, png: true, render(z, aw) { const dw = Math.min(aw, 360) * z, px = Math.min(2048, Math.round(dw * Math.min(3, window.devicePixelRatio || 2))); const cv = document.createElement('canvas'); cv.width = px; cv.height = px; drawIcon(cv, th, key, i); cv.style.cssText = `width:${dw}px;height:${dw}px;display:block;border-radius:${dw * 0.22}px`; return cv } }))
}
function openInspector(items, i, opener) {
  insp.items = items; insp.i = Math.max(0, Math.min(items.length - 1, i)); insp.z = 1; insp.opener = opener || document.activeElement
  $('insp').hidden = false; document.body.classList.add('insp-open'); renderInspector(); requestAnimationFrame(() => $('insp-close').focus())
}
function closeInspector() { $('insp').hidden = true; document.body.classList.remove('insp-open'); $('insp-content').textContent = ''; if (insp.opener && insp.opener.focus) insp.opener.focus() }
function renderInspector(keep) {
  const it = insp.items[insp.i], stage = $('insp-stage'), cont = $('insp-content'); if (!it) return
  $('insp-title').textContent = it.title; $('insp-count').textContent = insp.items.length > 1 ? `${insp.i + 1} / ${insp.items.length}` : ''
  document.querySelectorAll('#insp [data-z]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.z === insp.z)))
  $('insp-prev').disabled = insp.i === 0; $('insp-next').disabled = insp.i === insp.items.length - 1; $('insp-dl').hidden = !it.png
  const aw = Math.max(200, stage.clientWidth - 24), ah = Math.max(200, stage.clientHeight - 24)
  const fx = keep ? (stage.scrollLeft + keep.x) / Math.max(1, stage.scrollWidth) : 0.5, fy = keep ? (stage.scrollTop + keep.y) / Math.max(1, stage.scrollHeight) : 0
  cont.textContent = ''; const node = it.render(insp.z, aw, ah); cont.append(node); insp.node = node
  requestAnimationFrame(() => { if (keep) { stage.scrollLeft = fx * stage.scrollWidth - keep.x; stage.scrollTop = fy * stage.scrollHeight - keep.y } else { stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2; stage.scrollTop = 0 } })
}
function inspZoom(z, at) { if (z === insp.z) return; insp.z = z; renderInspector(at) }
function inspStep(d) { const n = insp.i + d; if (n < 0 || n >= insp.items.length) return; insp.i = n; insp.z = 1; renderInspector() }
function inspSave() { const it = insp.items[insp.i]; if (!it || !it.png || !insp.node || !insp.node.toBlob) return; insp.node.toBlob(b => { const u = URL.createObjectURL(b), a2 = document.createElement('a'); a2.href = u; a2.download = it.file || 'foundry.png'; document.body.append(a2); a2.click(); a2.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000) }, 'image/png') }
function makeInspectable(el, label, open) { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', label); el.classList.add('inspectable'); el.addEventListener('click', open); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }) }

// ---------- widget script ----------
function scriptTheme() {
  const th = state.th, wc = widgetColors(th);
  return {
    hbOn: hbOn(th), hbArt: hbOn(th) ? hbWidgetArt() : undefined, drOn: drOn(th), drSprites: drOn(th) ? drExportSprites() : undefined, hbDark: hbIsDark(th), hbVariant: th.variant || 0,
    company: th.company, unit: th.unit, ink: wc.ink, panel: wc.panel, headBg: wc.headBg, headText: wc.headText, altBg: wc.altBg, altText: wc.altText, accent: wc.accent,
    scriptFont: SCRIPT_FONTS[th.fonts.display] || th.widget.scriptFont, texture: th.texture, units: th.units, txGraphic: th.widget.txGraphic,
    archive: th.widget.archive, archiveList: th.widget.archiveList || null, C: th.widget.C || {}, codes: { youtube: th.codes.youtube, instagram: th.codes.instagram, discord: th.codes.discord, music: th.codes.music }, oddity: th.widget.oddity || ({ globe: 'mood', alert: 'eval', map: 'omens', night: 'hostile', grimoire: 'spell', orbital: 'decoder', radar: 'hostile', rabbit: 'heist', neon: 'market', market: 'bet', vapor: 'mall', botanical: 'species' }[th.motif] || 'mood'), frame: frameFor(th), L: th.widget.L, classes: th.widget.classes, slogans: th.slogans.length ? th.slogans : [['Stand By', 'HEADQUARTERS']]
  };
}
function buildScript() {
  return `// ${state.th.company} — made with Foundry\n` + $('tpl').textContent.trim().replace('__THEME__', JSON.stringify(scriptTheme(), null, 2));
}
function renderScript() { $('scriptbox').value = buildScript(); }

// ---------- checklist ----------
function renderChecklist() {
  const th = state.th, codes = APPS.map(([k, n], i) => `${n} → ${th.codes[k]}-${String(i + 1).padStart(2, '0')}`).join(', ');
  const steps = [
    ['save', 'Save the images', [
      'Download the theme pack (or the images one at a time) from step 4.',
      'On iPhone, open the zip in Files to unpack it, then save the wallpapers and icons to Photos.'
    ]],
    ['lock', 'Set the rotating lock screen', [
      'Press and hold your lock screen, tap +, then choose Photo Shuffle.',
      'Pick the four lock screen images and choose how often they change.',
      'Tap the clock to pick a font and color that suit the theme, then tap Add.'
    ]],
    ['home', 'Set the home screen wallpaper', [
      'When it asks about the home screen, tap Customize Home Screen, then Photos.',
      'Pick the home wallpaper and turn off Legibility Blur so the fine details stay sharp.'
    ]],
    ['icons', 'Add the custom icons', [
      'Open Shortcuts, tap +, add the action Open App and choose the app.',
      'Tap the name at the top, then Add to Home Screen. Tap the icon, choose Choose Photo and pick the matching image.',
      `Name it with its code: ${codes}.`,
      'Duplicate the shortcut for the next app to go faster. Move the original apps to a hidden page or App Library.'
    ]],
    ...(homeFrameCount(th) > 1 ? [['rotate', 'Optional: rotate the home screen through the day', [
      'The theme pack includes six home frames, each with different readings. Save them to a new Photos album called Foundry Home.',
      'Open Shortcuts, tap Automation, then + and choose Time of Day. Pick a time, set it to Daily and choose Run Immediately.',
      'Add the action Find Photos: Album is Foundry Home, sort Random, limit 1. Then add Set Wallpaper Photo and choose Home Screen.',
      'Repeat for a few more times of day (for example 9 AM, noon, 3 PM, 6 PM, 9 PM) so the readings change as the day goes on.'
    ]]] : []),
    ['widgets', 'Add the live widgets', [
      'Install Scriptable (free) from the App Store and open it once.',
      `Tap +, paste the widget script from step 4 and name it ${slug(th.company)}-widgets.`,
      'On the home screen, add a Scriptable widget, tap it while it jiggles and choose your script.',
      'Set its Parameter to one of: status (medium), shift (small), transmission (any size), solar (large is best), audio (medium), feeds (medium), youtube, instagram or discord (any size), oddity (small or medium, just for fun), game (medium or large, every theme).',
      'Add :alt or :main after the mode to flip its header color, for example shift:main.',
      'For audio, set When Interacting to Open URL with youtubemusic:// (or your music app). For youtube and instagram use youtube:// and instagram://app.',
      'For status and shift, set When Interacting to Open URL and type calshow:// so a tap opens Calendar.'
    ]]
  ];
  if (hbOn(th)) {
    steps[steps.length - 1][2] = [
      'Install Scriptable on iPhone and open it once.',
      'Create a script, paste the exported Halcyon widget script and save it. All artwork is included.',
      'Run the script and choose allocation_setup. Choose the event and calendar to follow. Exact-title matching includes recurring occurrences within the next 90 days.',
      'Optionally run radio_setup to choose the music app or stream opened by Audio Channel.',
      'Add a Scriptable widget in any of the three sizes, select this script, and set Parameter to status, shift, transmission, solar, audio, feeds, youtube, instagram, discord, oddity, game or tracker.',
      'Leave the default interaction setting so the script controls app links. Medium and large Neural Link use separate left/right links.',
      'Allow calendar and location access for the real readings. Charging feeds the specimen. iOS chooses when widgets refresh; timers update between refreshes, but phase changes may be delayed.',
      'Radio programming, emotional credits and provisional celestial objects are fictional. Catalogue planets are illustrations, not live imagery.'
    ];
  }
  const ol = $('checklist'); ol.textContent = '';
  steps.forEach(([id, title, items]) => {
    const li = document.createElement('li'); if (checks[id]) li.className = 'done';
    const lab = document.createElement('label');
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!checks[id];
    cb.addEventListener('change', () => { checks[id] = cb.checked; li.className = cb.checked ? 'done' : ''; try { localStorage.setItem(CHECKS, JSON.stringify(checks)); } catch (e) {} });
    const box = document.createElement('div'); const h = document.createElement('h3'); h.textContent = title;
    const list = document.createElement('ol'); items.forEach(t => { const i = document.createElement('li'); i.textContent = t; list.append(i); });
    box.append(h, list); lab.append(cb, box); li.append(lab); ol.append(li);
  });
}

function installText() {
  return Array.from($('checklist').children).map((li, i) => {
    const h = li.querySelector('h3').textContent; const items = Array.from(li.querySelectorAll('ol li')).map(x => '   - ' + x.textContent).join('\n');
    return `${i + 1}. ${h}\n${items}`;
  }).join('\n\n');
}

// ---------- export ----------

function exportSize() {
  const d = DEVICES[state.device];
  if (d[1]) return [d[1], d[2]];
  const w = Math.min(2000, Math.max(600, +$('f-w').value || 1179)), h = Math.min(4000, Math.max(1200, +$('f-h').value || 2556));
  return [w, h];
}
async function renderBlob(mode, idx) {
  await artFullyLoaded();
  const [W, H] = exportSize(); const c = document.createElement('canvas'); c.width = W; c.height = H;
  drawWallpaper(c, state.th, mode, idx);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
// Exports always wait for full-resolution theme artwork, so a downloaded image never ships without it.
async function artFullyLoaded() { if (hbOn(state.th)) { try { await hbReady('sheets'); } catch (e) { setStatus('Halcyon artwork could not load, so this export is paused. Check your connection and try again.'); throw e; } } }
async function iconBlob(app, i) { await artFullyLoaded(); const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; drawIcon(c, state.th, app, i); return new Promise(r => c.toBlob(r, 'image/png')); }
function setStatus(msg) { $('exp-status').textContent = msg; }
function mimeFor(name) { return name.endsWith('.png') ? 'image/png' : name.endsWith('.zip') ? 'application/zip' : 'text/plain'; }
let pendingFile = null;
function offerSave(file) {
  pendingFile = file;
  $('savebar-text').textContent = `${file.name} is ready.`;
  $('savebar').hidden = false;
  setStatus('Tap Save to open the share sheet.');
}
async function shareFile(file) {
  try { await navigator.share({ files: [file] }); setStatus(`Saved ${file.name}.`); $('savebar').hidden = true; return true; }
  catch (e) {
    if (e && e.name === 'AbortError') { setStatus('Save cancelled.'); $('savebar').hidden = true; return true; }
    return false;
  }
}
async function saveFile(filename, data) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeFor(filename) });
  let file = null;
  try { file = new File([blob], filename, { type: blob.type || mimeFor(filename) }); } catch (e) {}
  const touch = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
  if (touch && file && navigator.canShare && navigator.canShare({ files: [file] })) {
    if (!(await shareFile(file))) offerSave(file);
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.rel = 'noopener';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  setStatus(`Downloaded ${filename}.`);
}
function buildSingles() {
  const host = $('single-btns'); host.textContent = '';
  const add = (label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = label; b.addEventListener('click', fn); host.append(b); };
  for (let i = 0; i < 4; i++) add(`Lock screen ${i + 1}`, async () => saveFile(`${slug(state.th.company)}-lock-${i + 1}.png`, await renderBlob('lock', i)));
  add('Home wallpaper', async () => saveFile(`${slug(state.th.company)}-home.png`, await renderBlob('home', 0)));
  if (homeFrameCount() > 1) add('Home frames (6, zip)', async () => {
    if (typeof JSZip === 'undefined') { setStatus('The zip tool did not load.'); return; }
    setStatus('Building home frames…');
    const z = new JSZip();
    for (let i = 0; i < 6; i++) z.file(`home-frame-${i + 1}.png`, await renderBlob('home', i));
    await saveFile(`${slug(state.th.company)}-home-frames.zip`, await z.generateAsync({ type: 'blob' }));
  });
}
async function exportZip() {
  if (typeof JSZip === 'undefined') { setStatus('The zip tool did not load. Use the single downloads instead.'); return; }
  const btn = $('btn-zip'); btn.setAttribute('aria-disabled', 'true'); setStatus('Building your theme pack…');
  try {
    const z = new JSZip(), base = slug(state.th.company);
    for (let i = 0; i < 4; i++) z.file(`wallpapers/lock-${i + 1}.png`, await renderBlob('lock', i));
    z.file('wallpapers/home.png', await renderBlob('home', 0));
    if (homeFrameCount() > 1) for (let i = 0; i < 6; i++) z.file(`wallpapers/home-frames/home-frame-${i + 1}.png`, await renderBlob('home', i));
    for (let i = 0; i < APPS.length; i++) { const [k, n] = APPS[i]; z.file(`icons/${state.th.codes[k]}-${String(i + 1).padStart(2, '0')}_${n}.png`, await iconBlob(k, i)); }
    z.file(`${base}-widgets.js`, buildScript());
    z.file('INSTALL.txt', `${state.th.company} theme — made with Foundry\n\n${installText()}\n`);
    const blob = await z.generateAsync({ type: 'blob' });
    await saveFile(`${base}-theme-pack.zip`, blob);
  } catch (e) { setStatus('Could not build the pack. Try the single downloads.'); }
  btn.removeAttribute('aria-disabled');
}
async function copyScript() {
  const t = buildScript();
  try { await navigator.clipboard.writeText(t); setStatus('Script copied. Paste it into a new Scriptable script.'); }
  catch (e) { const box = $('scriptbox'); box.focus(); box.select(); try { document.execCommand('copy'); setStatus('Script copied. Paste it into a new Scriptable script.'); } catch (e2) { setStatus('Select the script in the box and copy it.'); } }
}

// ---------- boot ----------
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; renderPreview(); }));
if (state.wgMode == null) state.wgMode = (window.matchMedia && window.matchMedia('(max-width: 700px)').matches) ? 'full' : 'phone';
document.querySelectorAll('[data-wgmode]').forEach(b => b.addEventListener('click', () => { state.wgMode = b.dataset.wgmode; renderPreview(); }));
makeInspectable(document.querySelector('#view-lock .phone'), 'Inspect lock screen full size', () => openInspector(screenItems('lock'), state.lock || 0, document.querySelector('#view-lock .phone')));
makeInspectable($('home-phone'), 'Inspect home screen full size', () => openInspector(screenItems('home'), state.frame || 0, $('home-phone')));
$('insp-close').addEventListener('click', closeInspector); $('insp-prev').addEventListener('click', () => inspStep(-1)); $('insp-next').addEventListener('click', () => inspStep(1)); $('insp-dl').addEventListener('click', inspSave);
document.querySelectorAll('#insp [data-z]').forEach(b => b.addEventListener('click', () => inspZoom(+b.dataset.z)));
(() => { const st = $('insp-stage'); let tx = 0, ty = 0, tt = 0, lastTap = 0;
  st.addEventListener('dblclick', e => { const r = st.getBoundingClientRect(); inspZoom(insp.z === 1 ? 2 : 1, { x: e.clientX - r.left, y: e.clientY - r.top }) });
  st.addEventListener('touchstart', e => { if (e.touches.length !== 1) return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = Date.now() }, { passive: true });
  st.addEventListener('touchend', e => { if (e.changedTouches.length !== 1) return; const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty, now = Date.now();
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && now - tt < 250) { if (now - lastTap < 320) { const r = st.getBoundingClientRect(); inspZoom(insp.z === 1 ? 2 : 1, { x: t.clientX - r.left, y: t.clientY - r.top }); lastTap = 0; e.preventDefault(); return } lastTap = now }
    if (insp.z === 1 && Math.abs(dx) > 60 && Math.abs(dy) < 50 && now - tt < 600) inspStep(dx < 0 ? 1 : -1) });
})();
document.addEventListener('keydown', e => { if ($('insp').hidden) return; if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeInspector() } else if (e.key === 'ArrowRight') inspStep(1); else if (e.key === 'ArrowLeft') inspStep(-1); else if (e.key === '+' || e.key === '=') inspZoom(Math.min(3, insp.z + 1)); else if (e.key === '-') inspZoom(Math.max(1, insp.z - 1)) });
window.addEventListener('resize', () => { if (!$('insp').hidden) renderInspector() });
// step navigation: highlight the section on screen
(() => { const links = [...document.querySelectorAll('.steps-nav a')]; if (!('IntersectionObserver' in window) || !links.length) return; const io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + en.target.id))) }) }, { rootMargin: '-40% 0px -55% 0px' }); document.querySelectorAll('section.step').forEach(s => io.observe(s)) })();
// Mobile: the preview opens as a full-screen sheet from a floating button
function openPreview() { document.body.classList.add('preview-open'); $('open-preview').setAttribute('aria-expanded', 'true'); $('preview-stage').setAttribute('role', 'dialog'); $('preview-stage').setAttribute('aria-modal', 'true'); requestAnimationFrame(() => { renderPreview(); $('close-preview').focus(); }); }
function closePreview() { document.body.classList.remove('preview-open'); $('open-preview').setAttribute('aria-expanded', 'false'); $('preview-stage').removeAttribute('role'); $('preview-stage').removeAttribute('aria-modal'); $('open-preview').focus(); }
$('open-preview').addEventListener('click', openPreview);
$('close-preview').addEventListener('click', closePreview);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('preview-open') && $('insp').hidden) closePreview(); });
$('toggle-icons').addEventListener('click', () => { state.hideIcons = !state.hideIcons; $('toggle-icons').textContent = state.hideIcons ? 'Show icons' : 'Hide icons'; $('toggle-icons').setAttribute('aria-pressed', String(!state.hideIcons)); renderPreview(); });
document.querySelectorAll('[data-lock]').forEach(b => b.addEventListener('click', () => { state.lock = +b.dataset.lock; renderPreview(); }));
document.querySelectorAll('[data-frame]').forEach(b => b.addEventListener('click', () => { state.frame = +b.dataset.frame; renderPreview(); }));
$('btn-zip').addEventListener('click', exportZip);
$('savebar-btn').addEventListener('click', () => { if (pendingFile) shareFile(pendingFile).then(ok => { if (!ok) setStatus('Your browser blocked saving. Try again, or use a computer.'); }); });
$('btn-copy').addEventListener('click', copyScript);
$('btn-txt').addEventListener('click', () => saveFile(`${slug(state.th.company)}-widgets.txt`, buildScript()));
window.addEventListener('resize', () => { renderPreview(); fitGallery(); });
if (state.th.variant == null) applyVariant(0, true);
// The page starts right away; theme artwork arrives in the background and redraws what it touches.
buildPresets(); buildFields(); buildSingles(); syncFields(); buildVariants();
if (editionsFor(state.th) && !state.th.edition) { const ill = editionsFor(state.th).find(e => e.id === 'illustrated'); state.th.edition = ill && JSON.stringify(state.th.phrases) === JSON.stringify(ill.phrases) ? 'illustrated' : 'original'; }
buildEditions();
fontsFor(state.th).then(() => refresh());
hbWarm(hbOn(state.th));
