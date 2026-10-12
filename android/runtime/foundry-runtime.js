// Foundry Android runtime.
// Runs a Foundry widget script (the same file iPhone users paste into Scriptable) inside Android's Chromium web view and turns
// the widget it builds into a PNG for the home screen. It recreates the parts of Scriptable's API that Foundry uses. Drawing is
// recorded first and painted at the end, so images can finish loading even though Scriptable's own calls are synchronous.
// The Android app supplies calendar, location, battery and file storage through window.FoundryNative; without it (desktop
// testing) an in-memory fallback is used.
(function (G) {
  'use strict';
  const N = G.FoundryNative || null;
  const MEM = { files: {}, dirs: new Set(['/data']) };
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64FromBytes = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const bytesFromB64 = (b) => { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
  const native = {
    docs: () => N ? N.docsDir() : '/data',
    exists: (p) => N ? N.exists(p) : (p in MEM.files || MEM.dirs.has(p)),
    read: (p) => { const v = N ? N.readFile(p) : MEM.files[p]; return v == null || v === '' ? null : v; },
    write: (p, b64) => { if (N) N.writeFile(p, b64); else MEM.files[p] = b64; },
    mkdir: (p) => { if (N) N.mkdir(p); else MEM.dirs.add(p); },
    remove: (p) => { if (N) N.remove(p); else delete MEM.files[p]; },
    list: (p) => N ? JSON.parse(N.list(p)) : Object.keys(MEM.files).filter(k => k.startsWith(p + '/')).map(k => k.slice(p.length + 1)),
    calendar: (a, b) => JSON.parse(N ? N.calendar(a, b) : (G.__mockCalendar || '[]')),
    location: () => JSON.parse(N ? N.location() : (G.__mockLocation || 'null')),
    battery: () => JSON.parse(N ? N.battery() : (G.__mockBattery || '{"level":0.72,"charging":false}')),
  };

  // ---------- fonts: iPhone font names mapped to the theme's own fonts, bundled with the app ----------
  const FRAME_DISPLAY = { halcyon: 'Newsreader', directive: 'Shippori Mincho B1', longroad: 'IM Fell English', nightfall: 'Oxanium',
    grimoire: 'Cormorant Garamond', deeprange: 'Archivo', rabbit: 'Bodoni Moda', neon: 'Orbitron', vapor: 'Righteous',
    nature: 'Fraunces', wild: 'Fraunces', odds: 'Archivo', market: 'Archivo' };
  // Stand-ins chosen to match each iPhone font's width (the widget layouts assume it), not just its look
  const NAME_FONT = { 'Futura-CondensedExtraBold': ['Barlow Condensed', 700], 'AvenirNextCondensed-DemiBold': ['Barlow Condensed', 700],
    'AvenirNext-Heavy': ['Archivo', 800], 'Futura-Bold': ['Archivo', 700], 'Didot': ['Bodoni Moda', 500], 'HiraMinProN-W6': ['Shippori Mincho B1', 800],
    'Baskerville': ['Newsreader', 400], 'Baskerville-SemiBold': ['IM Fell English', 400] };
  const MONO = '"IBM Plex Mono", "JetBrains Mono", monospace', SANS = '"Archivo", "Space Grotesk", sans-serif';
  let DISPLAY = 'Newsreader';
  class Font {
    constructor(name, size) { this.name = name || ''; this.size = size; this.kind = 'named'; this.weight = /Bold|Heavy|Black|W6|SemiBold|DemiBold/i.test(this.name) ? 700 : 400; this.italic = /Italic/i.test(this.name); }
    static _s(size, weight, kind) { const f = new Font('', size); f.kind = kind; f.weight = weight; return f; }
    static systemFont(s) { return Font._s(s, 400, 'sans'); } static mediumSystemFont(s) { return Font._s(s, 500, 'sans'); }
    static semiboldSystemFont(s) { return Font._s(s, 600, 'sans'); } static boldSystemFont(s) { return Font._s(s, 700, 'sans'); }
    static heavySystemFont(s) { return Font._s(s, 800, 'sans'); } static blackSystemFont(s) { return Font._s(s, 900, 'sans'); }
    static lightSystemFont(s) { return Font._s(s, 300, 'sans'); } static italicSystemFont(s) { const f = Font._s(s, 400, 'sans'); f.italic = true; return f; }
    static regularMonospacedSystemFont(s) { return Font._s(s, 400, 'mono'); } static mediumMonospacedSystemFont(s) { return Font._s(s, 500, 'mono'); }
    static semiboldMonospacedSystemFont(s) { return Font._s(s, 600, 'mono'); } static boldMonospacedSystemFont(s) { return Font._s(s, 700, 'mono'); }
    static heavyMonospacedSystemFont(s) { return Font._s(s, 800, 'mono'); } static lightMonospacedSystemFont(s) { return Font._s(s, 300, 'mono'); }
    static regularRoundedSystemFont(s) { return Font._s(s, 400, 'sans'); } static boldRoundedSystemFont(s) { return Font._s(s, 700, 'sans'); }
    css(scale) { const px = this.size * (scale || 1), nf = this.kind === 'named' && NAME_FONT[this.name];
      const fam = this.kind === 'mono' ? MONO : this.kind === 'sans' ? SANS : nf ? `"${nf[0]}", "${DISPLAY}", Georgia, serif` : `"${DISPLAY}", Georgia, serif`;
      return `${this.italic ? 'italic ' : ''}${nf ? nf[1] : this.weight} ${px}px ${fam}`; }
  }

  // ---------- basic types ----------
  class Color {
    constructor(hex, alpha) { let h = String(hex || '000000').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
      this.hex = h.slice(0, 6); this.alpha = alpha == null ? (h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1) : alpha; }
    get red() { return parseInt(this.hex.slice(0, 2), 16) / 255; } get green() { return parseInt(this.hex.slice(2, 4), 16) / 255; } get blue() { return parseInt(this.hex.slice(4, 6), 16) / 255; }
    css() { const n = parseInt(this.hex, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${this.alpha})`; }
    static dynamic(light) { return light; } static white() { return new Color('ffffff'); } static black() { return new Color('000000'); }
    static clear() { return new Color('000000', 0); } static gray() { return new Color('808080'); } static lightGray() { return new Color('aaaaaa'); }
    static darkGray() { return new Color('555555'); } static red() { return new Color('ff3b30'); } static green() { return new Color('34c759'); }
    static blue() { return new Color('007aff'); } static orange() { return new Color('ff9500'); } static yellow() { return new Color('ffcc00'); }
    static purple() { return new Color('af52de'); } static cyan() { return new Color('32ade6'); } static brown() { return new Color('a2845e'); } static magenta() { return new Color('ff2d55'); }
  }
  class Point { constructor(x, y) { this.x = x; this.y = y; } }
  class Size { constructor(w, h) { this.width = w; this.height = h; } }
  class Rect { constructor(x, y, w, h) { this.x = x; this.y = y; this.width = w; this.height = h; }
    get minX() { return this.x; } get minY() { return this.y; } get maxX() { return this.x + this.width; } get maxY() { return this.y + this.height; }
    get midX() { return this.x + this.width / 2; } get midY() { return this.y + this.height / 2; } get origin() { return new Point(this.x, this.y); } get size() { return new Size(this.width, this.height); } }
  class Path {
    constructor() { this.ops = []; }
    move(p) { this.ops.push(['m', p.x, p.y]); } addLine(p) { this.ops.push(['l', p.x, p.y]); }
    addLines(ps) { ps.forEach((p, i) => this.ops.push([i ? 'l' : 'm', p.x, p.y])); }
    addQuadCurve(p, c) { this.ops.push(['q', c.x, c.y, p.x, p.y]); } addCurve(p, c1, c2) { this.ops.push(['c', c1.x, c1.y, c2.x, c2.y, p.x, p.y]); }
    addRect(r) { this.ops.push(['r', r.x, r.y, r.width, r.height]); } addEllipse(r) { this.ops.push(['e', r.x, r.y, r.width, r.height]); }
    addRoundedRect(r, cw, ch) { this.ops.push(['rr', r.x, r.y, r.width, r.height, Math.min(cw, ch == null ? cw : ch)]); }
    closeSubpath() { this.ops.push(['z']); }
  }
  function tracePath(x, ops, s) {
    x.beginPath();
    for (const o of ops) {
      if (o[0] === 'm') x.moveTo(o[1] * s, o[2] * s); else if (o[0] === 'l') x.lineTo(o[1] * s, o[2] * s);
      else if (o[0] === 'q') x.quadraticCurveTo(o[1] * s, o[2] * s, o[3] * s, o[4] * s);
      else if (o[0] === 'c') x.bezierCurveTo(o[1] * s, o[2] * s, o[3] * s, o[4] * s, o[5] * s, o[6] * s);
      else if (o[0] === 'r') x.rect(o[1] * s, o[2] * s, o[3] * s, o[4] * s);
      else if (o[0] === 'e') x.ellipse((o[1] + o[3] / 2) * s, (o[2] + o[4] / 2) * s, Math.max(0.01, o[3] / 2 * s), Math.max(0.01, o[4] / 2 * s), 0, 0, Math.PI * 2);
      else if (o[0] === 'rr') { if (x.roundRect) x.roundRect(o[1] * s, o[2] * s, o[3] * s, o[4] * s, o[5] * s); else x.rect(o[1] * s, o[2] * s, o[3] * s, o[4] * s); }
      else if (o[0] === 'z') x.closePath();
    }
  }

  // ---------- data, images, files ----------
  class Data {
    constructor(b64) { this.b64 = b64 || ''; }
    static fromBase64String(s) { return new Data(s); } static fromString(s) { return new Data(b64FromBytes(enc.encode(String(s)))); }
    static fromPNG(img) { return img && img.__data ? new Data(img.__data) : null; } static fromJPEG(img) { return Data.fromPNG(img); }
    toBase64String() { return this.b64; } toRawString() { return dec.decode(bytesFromB64(this.b64)); } getBytes() { return Array.from(bytesFromB64(this.b64)); }
  }
  function imageDims(b64) {
    try { const u = bytesFromB64(b64.slice(0, 64000));
      if (u[0] === 0x89 && u[1] === 0x50) return [u[16] << 24 | u[17] << 16 | u[18] << 8 | u[19], u[20] << 24 | u[21] << 16 | u[22] << 8 | u[23]];
      if (u[0] === 0xFF && u[1] === 0xD8) { let i = 2; while (i < u.length) { if (u[i] !== 0xFF) { i++; continue; } const m = u[i + 1], L = u[i + 2] << 8 | u[i + 3];
          if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return [u[i + 7] << 8 | u[i + 8], u[i + 5] << 8 | u[i + 6]]; i += 2 + L; } }
      if (u[8] === 0x57 && u[9] === 0x45) { if (u[15] === 0x58) return [1 + (u[24] | u[25] << 8 | u[26] << 16), 1 + (u[27] | u[28] << 8 | u[29] << 16)];
        if (u[15] === 0x20) return [(u[26] | u[27] << 8) & 0x3fff, (u[28] | u[29] << 8) & 0x3fff]; }
    } catch (e) { }
    return [0, 0];
  }
  class Image {
    static fromData(d) { if (!d || !d.b64) return null; const im = new Image(); im.__data = d.b64; const [w, h] = imageDims(d.b64); im.size = new Size(w, h); return im; }
    static fromFile(p) { const b = native.read(p); return b ? Image.fromData(new Data(b)) : null; }
  }
  const fileManager = {
    documentsDirectory: () => native.docs(), libraryDirectory: () => native.docs() + '/library', cacheDirectory: () => native.docs() + '/cache', temporaryDirectory: () => native.docs() + '/tmp',
    joinPath: (a, b) => String(a).replace(/\/$/, '') + '/' + String(b).replace(/^\//, ''),
    fileExists: (p) => !!native.exists(p), isDirectory: (p) => MEM.dirs.has(p) || (N ? N.isDir(p) : false), createDirectory: (p) => native.mkdir(p),
    readString: (p) => { const b = native.read(p); return b == null ? null : dec.decode(bytesFromB64(b)); },
    writeString: (p, s) => native.write(p, b64FromBytes(enc.encode(String(s)))),
    read: (p) => { const b = native.read(p); return b == null ? null : new Data(b); }, write: (p, d) => native.write(p, d && d.b64 ? d.b64 : ''),
    readImage: (p) => Image.fromFile(p), writeImage: (p, img) => native.write(p, img && img.__data ? img.__data : ''),
    remove: (p) => native.remove(p), listContents: (p) => native.list(p), fileName: (p) => String(p).split('/').pop(),
    isFileStoredIniCloud: () => false, downloadFileFromiCloud: async () => { }, modificationDate: () => new Date(), creationDate: () => new Date(),
  };
  const FileManager = { local: () => fileManager, iCloud: () => fileManager };

  // ---------- drawing (recorded, painted later) ----------
  class DrawContext {
    constructor() { this.ops = []; this._size = new Size(100, 100); this.opaque = true; this.respectScreenScale = false; this.st = { fill: new Color('000000'), stroke: new Color('000000'), lw: 1, font: Font.systemFont(12), text: new Color('000000'), al: 'left' }; }
    get size() { return this._size; } set size(s) { this._size = new Size(s.width, s.height); }
    setFillColor(c) { this.st.fill = c; } setStrokeColor(c) { this.st.stroke = c; } setLineWidth(w) { this.st.lw = w; }
    setFont(f) { this.st.font = f; } setTextColor(c) { this.st.text = c; }
    setTextAlignedLeft() { this.st.al = 'left'; } setTextAlignedCenter() { this.st.al = 'center'; } setTextAlignedRight() { this.st.al = 'right'; }
    fillRect(r) { this.ops.push(['fr', r.x, r.y, r.width, r.height, this.st.fill]); } strokeRect(r) { this.ops.push(['sr', r.x, r.y, r.width, r.height, this.st.stroke, this.st.lw]); }
    fillEllipse(r) { this.ops.push(['fp', [['e', r.x, r.y, r.width, r.height]], this.st.fill]); } strokeEllipse(r) { this.ops.push(['sp', [['e', r.x, r.y, r.width, r.height]], this.st.stroke, this.st.lw]); }
    addPath(p) { this.cur = p.ops.slice(); } fillPath() { if (this.cur) this.ops.push(['fp', this.cur, this.st.fill]); } strokePath() { if (this.cur) this.ops.push(['sp', this.cur, this.st.stroke, this.st.lw]); }
    drawText(t, p) { this.ops.push(['tx', String(t), p.x, p.y, null, null, this.st.font, this.st.text, 'left']); }
    drawTextInRect(t, r) { this.ops.push(['tx', String(t), r.x, r.y, r.width, r.height, this.st.font, this.st.text, this.st.al]); }
    drawImageInRect(img, r) { if (img) this.ops.push(['im', img, r.x, r.y, r.width, r.height]); } drawImageAtPoint(img, p) { if (img) this.ops.push(['im', img, p.x, p.y, img.size.width, img.size.height]); }
    getImage() { const im = new Image(); im.__ops = this.ops.slice(); im.size = new Size(this._size.width, this._size.height); im.__opaque = this.opaque; return im; }
  }
  const decoded = new Map();
  async function decodeAll(img, seen) {
    seen = seen || new Set(); if (!img || seen.has(img)) return; seen.add(img);
    if (img.__data && !decoded.has(img.__data)) { try { const bm = await createImageBitmap(new Blob([bytesFromB64(img.__data)])); decoded.set(img.__data, bm); } catch (e) { decoded.set(img.__data, null); } }
    if (img.__ops) for (const o of img.__ops) if (o[0] === 'im') await decodeAll(o[1], seen);
  }
  function wrapLines(x, text, maxW) {
    if (maxW == null) return String(text).split('\n');
    const out = [];
    for (const para of String(text).split('\n')) { let line = ''; for (const w of para.split(/(\s+)/)) { const t = line + w; if (line && x.measureText(t).width > maxW && w.trim()) { out.push(line.trimEnd()); line = w.trimStart(); } else line = t; } out.push(line); }
    return out;
  }
  function paintImage(x, img, dx, dy, dw, dh, s) {
    if (!img) return;
    if (img.__data) { const bm = decoded.get(img.__data); if (bm) x.drawImage(bm, dx * s, dy * s, dw * s, dh * s); return; }
    if (!img.__ops) return;
    const sx = dw / (img.size.width || 1), sy = dh / (img.size.height || 1);
    x.save(); x.translate(dx * s, dy * s); x.beginPath(); x.rect(0, 0, dw * s, dh * s); x.clip(); x.scale(sx, sy); replay(x, img.__ops, s); x.restore();
  }
  function replay(x, ops, s) {
    for (const o of ops) {
      const k = o[0];
      if (k === 'fr') { x.fillStyle = o[5].css(); x.fillRect(o[1] * s, o[2] * s, o[3] * s, o[4] * s); }
      else if (k === 'sr') { x.strokeStyle = o[5].css(); x.lineWidth = o[6] * s; x.strokeRect(o[1] * s, o[2] * s, o[3] * s, o[4] * s); }
      else if (k === 'fp') { tracePath(x, o[1], s); x.fillStyle = o[2].css(); x.fill(); }
      else if (k === 'sp') { tracePath(x, o[1], s); x.strokeStyle = o[2].css(); x.lineWidth = o[3] * s; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); }
      else if (k === 'im') paintImage(x, o[1], o[2], o[3], o[4], o[5], s);
      else if (k === 'tx') {
        const [, t, tx, ty, tw, th, f, c, al] = o; x.font = f.css(s); x.fillStyle = c.css(); x.textBaseline = 'top';
        const lh = f.size * 1.2 * s, lines = wrapLines(x, t, tw == null ? null : tw * s);
        x.save(); if (tw != null) { x.beginPath(); x.rect(tx * s, ty * s, tw * s, (th || 9999) * s); x.clip(); }
        lines.forEach((ln, i) => { x.textAlign = al; const ax = al === 'center' ? (tx + (tw || 0) / 2) * s : al === 'right' ? (tx + (tw || 0)) * s : tx * s; x.fillText(ln, ax, ty * s + i * lh); });
        x.restore(); x.textAlign = 'left';
      }
    }
  }

  // ---------- widget elements and layout ----------
  class WEl { constructor(t) { this.type = t; this.url = null; } }
  class WText extends WEl { constructor(t) { super('text'); this.text = String(t); this.font = Font.systemFont(14); this.textColor = new Color('000000'); this.textOpacity = 1; this.lineLimit = 0; this.minimumScaleFactor = 1; this.al = 'left'; }
    leftAlignText() { this.al = 'left'; } centerAlignText() { this.al = 'center'; } rightAlignText() { this.al = 'right'; } }
  class WDate extends WText { constructor(d) { super(''); this.type = 'date'; this.date = d; this.style = 'date'; }
    applyTimerStyle() { this.style = 'timer'; } applyRelativeStyle() { this.style = 'relative'; } applyOffsetStyle() { this.style = 'offset'; } applyDateStyle() { this.style = 'date'; } applyTimeStyle() { this.style = 'time'; } }
  class WImage extends WEl { constructor(img) { super('image'); this.image = img; this.imageSize = null; this.cornerRadius = 0; this.tintColor = null; this.resizable = true; this.mode = 'fit'; this.al = 'center'; this.imageOpacity = 1; }
    applyFittingContentMode() { this.mode = 'fit'; } applyFillingContentMode() { this.mode = 'fill'; } leftAlignImage() { this.al = 'left'; } centerAlignImage() { this.al = 'center'; } rightAlignImage() { this.al = 'right'; } }
  class WStack extends WEl {
    constructor() { super('stack'); this.children = []; this.dir = 'h'; this.pad = [0, 0, 0, 0]; this.spacing = 0; this.size = new Size(0, 0); this.al = 'center'; this.backgroundColor = null; this.backgroundImage = null; this.cornerRadius = 0; this.borderWidth = 0; this.borderColor = null; }
    layoutHorizontally() { this.dir = 'h'; } layoutVertically() { this.dir = 'v'; } setPadding(t, l, b, r) { this.pad = [t, l, b, r]; } useDefaultPadding() { this.pad = [0, 0, 0, 0]; }
    topAlignContent() { this.al = 'start'; } centerAlignContent() { this.al = 'center'; } bottomAlignContent() { this.al = 'end'; }
    addStack() { const s = new WStack(); this.children.push(s); return s; } addText(t) { const e = new WText(t); this.children.push(e); return e; }
    addDate(d) { const e = new WDate(d); this.children.push(e); return e; } addImage(i) { const e = new WImage(i); this.children.push(e); return e; }
    addSpacer(n) { const e = new WEl('spacer'); e.len = n == null ? null : n; this.children.push(e); return e; }
  }
  class ListWidget extends WStack {
    constructor() { super(); this.dir = 'v'; this.pad = [16, 16, 16, 16]; this.refreshAfterDate = null; this.backgroundGradient = null; }
    useDefaultPadding() { this.pad = [16, 16, 16, 16]; }
    async presentSmall() { Script.setWidget(this); } async presentMedium() { Script.setWidget(this); } async presentLarge() { Script.setWidget(this); }
  }
  let MX = null, CUR_OFFSET = 0; const measureCtx = () => MX || (MX = document.createElement('canvas').getContext('2d'));
  function dateText(e) {
    const now = Date.now() + (CUR_OFFSET || 0), d = +e.date, diff = Math.round((d - now) / 1000), a = Math.abs(diff);
    if (e.style === 'timer') { const h = Math.floor(a / 3600), m = Math.floor(a % 3600 / 60), s2 = a % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s2).padStart(2, '0'); }
    if (e.style === 'relative' || e.style === 'offset') { const m = Math.round(a / 60), h = Math.round(a / 3600); const v = m < 60 ? m + ' min' : h + ' hr'; return e.style === 'offset' ? (diff >= 0 ? '+' : '-') + v : (diff >= 0 ? 'in ' + v : v + ' ago'); }
    if (e.style === 'time') return new DateFormatter('h:mm a').string(e.date);
    return new DateFormatter('MMM d, yyyy').string(e.date);
  }
  function textBox(e, availW) {
    const x = measureCtx(), t = e.type === 'date' ? dateText(e) : e.text; let size = e.font.size; x.font = e.font.css(1);
    let w = x.measureText(t).width;
    if (availW != null && w > availW && e.minimumScaleFactor < 1) { const k = Math.max(e.minimumScaleFactor, availW / w); size = e.font.size * k; w = w * k; }
    const f = Object.assign(Object.create(Font.prototype), e.font, { size }); x.font = f.css(1);
    let lines = (e.lineLimit === 1 || availW == null) ? [t] : wrapLines(x, t, availW);
    if (e.lineLimit > 0 && lines.length > e.lineLimit) lines = lines.slice(0, e.lineLimit);
    const lw = Math.min(availW == null ? Infinity : availW, Math.max(...lines.map(l => x.measureText(l).width)));
    return { w: Math.ceil(lw), h: Math.ceil(size * 1.2 * lines.length), lines, font: f };
  }
  function measure(e, aw, ah) {
    if (e.type === 'spacer') return { w: 0, h: 0 };
    if (e.type === 'text' || e.type === 'date') { const b = textBox(e, aw); e._tb = b; return { w: b.w, h: b.h }; }
    if (e.type === 'image') { if (e.imageSize) return { w: e.imageSize.width, h: e.imageSize.height }; const s = e.image && e.image.size || new Size(0, 0);
      if (!s.width || !s.height) return { w: 0, h: 0 }; const k = Math.min(1, aw / s.width, ah / s.height); return { w: s.width * k, h: s.height * k }; }
    const p = e.pad, fw = e.size.width > 0 ? e.size.width : null, fh = e.size.height > 0 ? e.size.height : null;
    const iw = (fw != null ? fw : aw) - p[1] - p[3], ih = (fh != null ? fh : ah) - p[0] - p[2];
    let main = 0, cross = 0, flex = false; const sizes = [];
    let remain = e.dir === 'h' ? iw : ih;
    e.children.forEach((c, i) => {
      if (c.type === 'spacer') { if (c.len == null) flex = true; else { main += c.len; remain -= c.len; } sizes.push({ w: 0, h: 0 }); }
      else { const m = e.dir === 'h' ? measure(c, Math.max(0, remain), ih) : measure(c, iw, Math.max(0, remain)); sizes.push(m); const mm = e.dir === 'h' ? m.w : m.h; main += mm; remain -= mm; cross = Math.max(cross, e.dir === 'h' ? m.h : m.w); }
      if (i) { main += e.spacing; remain -= e.spacing; }
    });
    e._sizes = sizes; e._flex = flex;
    let w = e.dir === 'h' ? (flex ? iw : main) : cross, h = e.dir === 'h' ? cross : (flex ? ih : main);
    if (e.dir === 'v' && e.children.some(c => c.type === 'stack' && c._flexW)) w = iw;
    if (e.dir === 'h' && flex) e._flexW = true;
    return { w: (fw != null ? fw : Math.min(aw, w + p[1] + p[3])), h: (fh != null ? fh : Math.min(ah, h + p[0] + p[2])) };
  }
  function place(e, x0, y0, w, h, out) {
    e._box = [x0, y0, w, h]; if (e.url) out.urls.push({ url: e.url, box: e._box });
    if (e.type !== 'stack') return;
    const p = e.pad, ix = x0 + p[1], iy = y0 + p[0], iw = w - p[1] - p[3], ih = h - p[0] - p[2];
    measure(e, iw + p[1] + p[3], ih + p[0] + p[2]);
    const horiz = e.dir === 'h', avail = horiz ? iw : ih;
    let fixed = 0, flexN = 0; e.children.forEach((c, i) => { if (c.type === 'spacer') { if (c.len == null) flexN++; else fixed += c.len; } else fixed += horiz ? e._sizes[i].w : e._sizes[i].h; if (i) fixed += e.spacing; });
    const flexLen = flexN ? Math.max(0, avail - fixed) / flexN : 0;
    let cur = 0;
    if (!flexN) { const extra = Math.max(0, avail - fixed); if (horiz) cur = extra / 2; else cur = e.al === 'start' ? 0 : e.al === 'end' ? extra : extra / 2; }
    e.children.forEach((c, i) => {
      if (i) cur += e.spacing;
      if (c.type === 'spacer') { cur += c.len == null ? flexLen : c.len; return; }
      let { w: cw, h: ch } = e._sizes[i];
      if (c.type === 'stack' && c._flexW && horiz === false) cw = iw;
      if (horiz) { const cy = e.al === 'start' ? iy : e.al === 'end' ? iy + ih - ch : iy + (ih - ch) / 2; place(c, ix + cur, cy, cw, ch, out); cur += cw; }
      else { const cx = ix + (iw - cw) / 2; place(c, c.type === 'text' || c.type === 'date' ? (c.al === 'left' && c._tb && cw >= iw - 1 ? ix : cx) : cx, iy + cur, cw, ch, out); cur += ch; }
    });
  }
  function drawEl(x, e, s) {
    const [bx, by, bw, bh] = e._box;
    if (e.type === 'stack') {
      x.save();
      if (e.cornerRadius) { x.beginPath(); if (x.roundRect) x.roundRect(bx * s, by * s, bw * s, bh * s, e.cornerRadius * s); else x.rect(bx * s, by * s, bw * s, bh * s); x.clip(); }
      if (e.backgroundColor) { x.fillStyle = e.backgroundColor.css(); x.fillRect(bx * s, by * s, bw * s, bh * s); }
      if (e.backgroundImage) paintImage(x, e.backgroundImage, bx, by, bw, bh, s);
      e.children.forEach(c => { if (c._box) drawEl(x, c, s); });
      x.restore();
      if (e.borderWidth && e.borderColor) { x.strokeStyle = e.borderColor.css(); x.lineWidth = e.borderWidth * s; x.beginPath(); if (x.roundRect) x.roundRect(bx * s, by * s, bw * s, bh * s, (e.cornerRadius || 0) * s); else x.rect(bx * s, by * s, bw * s, bh * s); x.stroke(); }
    } else if (e.type === 'text' || e.type === 'date') {
      const b = e._tb || textBox(e, bw); x.font = b.font.css(s); x.textBaseline = 'top'; x.globalAlpha = e.textOpacity == null ? 1 : e.textOpacity;
      x.fillStyle = (e.textColor || new Color('000000')).css(); x.textAlign = e.al;
      const ax = e.al === 'center' ? (bx + bw / 2) * s : e.al === 'right' ? (bx + bw) * s : bx * s;
      b.lines.forEach((ln, i) => x.fillText(ln, ax, by * s + i * b.font.size * 1.2 * s, bw * s + 0.5));
      x.textAlign = 'left'; x.globalAlpha = 1;
    } else if (e.type === 'image') {
      x.save(); if (e.cornerRadius) { x.beginPath(); if (x.roundRect) x.roundRect(bx * s, by * s, bw * s, bh * s, e.cornerRadius * s); x.clip(); }
      x.globalAlpha = e.imageOpacity == null ? 1 : e.imageOpacity; paintImage(x, e.image, bx, by, bw, bh, s); x.restore();
    }
  }

  // ---------- the rest of the Scriptable surface Foundry uses ----------
  class Request {
    constructor(url) { this.url = url; this.method = 'GET'; this.headers = {}; this.body = null; this.timeoutInterval = 20; this.response = null; }
    async _fetch() { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), this.timeoutInterval * 1000);
      try { const r = await fetch(this.url, { method: this.method, headers: this.headers, body: this.body, signal: ctl.signal }); this.response = { statusCode: r.status, headers: Object.fromEntries(r.headers) }; return r; } finally { clearTimeout(t); } }
    async load() { const r = await this._fetch(); return new Data(b64FromBytes(new Uint8Array(await r.arrayBuffer()))); }
    async loadString() { const r = await this._fetch(); return r.text(); }
    async loadJSON() { const r = await this._fetch(); return r.json(); }
    async loadImage() { return Image.fromData(await this.load()); }
  }
  const evObj = (e) => ({ title: e.title || '', startDate: new Date(e.start), endDate: new Date(e.end), isAllDay: !!e.allDay, location: e.location || '', notes: e.notes || '', identifier: e.id || '',
    calendar: { title: e.calendar || '', identifier: e.calendarId || '', color: new Color(e.color || '888888') } });
  const dayRange = (off) => { const a = new Date(); a.setHours(0, 0, 0, 0); a.setDate(a.getDate() + off); const b = new Date(a); b.setDate(b.getDate() + 1); return [a, b]; };
  const CalendarEvent = {
    between: async (a, b) => native.calendar(+a, +b).map(evObj),
    today: async () => { const [a, b] = dayRange(0); return native.calendar(+a, +b).map(evObj); },
    tomorrow: async () => { const [a, b] = dayRange(1); return native.calendar(+a, +b).map(evObj); },
    thisWeek: async () => { const [a] = dayRange(0); const b = new Date(+a + 7 * 864e5); return native.calendar(+a, +b).map(evObj); },
  };
  const Calendar = { forEvents: async () => [], defaultForEvents: async () => null };
  const Location = { setAccuracyToBest() { }, setAccuracyToTenMeters() { }, setAccuracyToHundredMeters() { }, setAccuracyToKilometer() { }, setAccuracyToThreeKilometers() { },
    current: async () => { const l = native.location(); if (!l) throw new Error('Location unavailable'); return { latitude: l.lat, longitude: l.lon, altitude: l.alt || 0, horizontalAccuracy: l.acc || 1000, verticalAccuracy: 0 }; },
    reverseGeocode: async () => [] };
  const Device = { batteryLevel: () => native.battery().level, isCharging: () => !!native.battery().charging, isFullyCharged: () => native.battery().level >= 0.999,
    locale: () => (navigator.language || 'en-US').replace('-', '_'), language: () => (navigator.language || 'en').slice(0, 2), preferredLanguages: () => [navigator.language || 'en'],
    model: () => 'Android', systemName: () => 'Android', systemVersion: () => '', name: () => 'Android', isPhone: () => true, isPad: () => false,
    isUsingDarkAppearance: () => !!(G.matchMedia && G.matchMedia('(prefers-color-scheme: dark)').matches), screenSize: () => new Size(screen.width, screen.height), screenScale: () => G.devicePixelRatio || 3,
    volume: () => 0.5, isInPortrait: () => true, isInLandscapeLeft: () => false, isInLandscapeRight: () => false, isFaceUp: () => false, isFaceDown: () => false };
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  class DateFormatter {
    constructor(f) { this.dateFormat = f || 'MMM d, yyyy'; this.locale = 'en_US'; }
    useNoDateStyle() { this._d = 0; } useShortDateStyle() { this.dateFormat = 'M/d/yy'; } useMediumDateStyle() { this.dateFormat = 'MMM d, yyyy'; } useLongDateStyle() { this.dateFormat = 'MMMM d, yyyy'; } useFullDateStyle() { this.dateFormat = 'EEEE, MMMM d, yyyy'; }
    useNoTimeStyle() { } useShortTimeStyle() { this.dateFormat = 'h:mm a'; } useMediumTimeStyle() { this.dateFormat = 'h:mm:ss a'; } useLongTimeStyle() { this.dateFormat = 'h:mm:ss a'; } useFullTimeStyle() { this.dateFormat = 'h:mm:ss a'; }
    string(d) { d = new Date(d); const H = d.getHours(), pad = (n, k) => String(n).padStart(k || 2, '0');
      const T = { yyyy: d.getFullYear(), yy: pad(d.getFullYear() % 100), MMMM: MON[d.getMonth()], MMM: MON[d.getMonth()].slice(0, 3), MM: pad(d.getMonth() + 1), M: d.getMonth() + 1, dd: pad(d.getDate()), d: d.getDate(),
        EEEE: DAY[d.getDay()], EEE: DAY[d.getDay()].slice(0, 3), HH: pad(H), H: H, hh: pad(H % 12 || 12), h: H % 12 || 12, mm: pad(d.getMinutes()), m: d.getMinutes(), ss: pad(d.getSeconds()), s: d.getSeconds(), a: H < 12 ? 'AM' : 'PM' };
      return this.dateFormat.replace(/'([^']*)'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|m|ss|s|a/g, (t, lit) => lit != null ? lit : T[t]); }
    date(s) { return new Date(s); }
  }
  class Alert { constructor() { this.title = ''; this.message = ''; } addAction() { } addCancelAction() { } addDestructiveAction() { } addTextField() { } addSecureTextField() { } textFieldValue() { return ''; } async presentAlert() { return -1; } async presentSheet() { return -1; } }
  class Notification { constructor() { this.title = ''; this.body = ''; } async schedule() { } setTriggerDate() { } static async removePending() { } static async allPending() { return []; } }
  const Keychain = { contains: () => false, get: () => null, set: () => { }, remove: () => { } };
  const URLScheme = { forRunningScript: () => 'foundry://run', forOpeningScript: () => 'foundry://open', forOpeningScriptSettings: () => 'foundry://settings', forRunningShortcuts: () => '' };
  const Pasteboard = { copy() { }, paste: () => '', copyString() { }, pasteString: () => '' };
  const Safari = { open() { }, openInApp: async () => { } };

  // Links: iPhone app schemes get Android-friendly equivalents
  const LINKS = [[/^youtubemusic:\/\//, 'https://music.youtube.com/'], [/^youtube:\/\//, 'https://www.youtube.com/'], [/^instagram:\/\//, 'https://www.instagram.com/'],
    [/^discord:\/\//, 'https://discord.com/app'], [/^calshow:\/\/?/, 'content://com.android.calendar/time/'], [/^x-apple-weather:\/\/?/, 'https://www.google.com/search?q=weather'],
    [/^spotify:\/\//, 'https://open.spotify.com/'], [/^music:\/\//, 'https://music.youtube.com/'], [/^shortcuts:\/\/.*/, '']];
  const androidLink = (u) => { if (!u) return null; let s = String(u); for (const [re, to] of LINKS) if (re.test(s)) { s = s.replace(re, to); break; } return s || null; };

  // ---------- run a Foundry widget script and return the picture ----------
  async function run(opts) {
    const script = opts.script, family = opts.family || 'medium', scale = opts.scale || 3;
    const fm = /"frame":\s*"(\w+)"/.exec(script); DISPLAY = FRAME_DISPLAY[fm ? fm[1] : 'halcyon'] || 'Newsreader';
    let widget = null; const logs = [];
    const Script = { name: () => opts.name || 'Foundry', setWidget: (w) => { widget = w; }, complete: () => { }, setShortcutOutput: () => { } };
    const config = { runsInWidget: true, runsInApp: false, runsInActionExtension: false, runsWithSiri: false, runsInNotification: false, runsFromHomeScreen: false, widgetFamily: family };
    const args = { widgetParameter: opts.param || null, queryParameters: {}, shortcutParameter: null, plainTexts: [], urls: [], fileURLs: [], images: [] };
    const con = { log: (...a) => logs.push(a.join(' ')), warn: (...a) => logs.push('WARN ' + a.join(' ')), error: (...a) => logs.push('ERROR ' + a.join(' ')) };
    const names = ['Color', 'Font', 'Point', 'Size', 'Rect', 'Path', 'Data', 'Image', 'FileManager', 'DrawContext', 'ListWidget', 'Request', 'CalendarEvent', 'Calendar', 'Location', 'Device', 'DateFormatter',
      'Alert', 'Notification', 'Keychain', 'URLScheme', 'Pasteboard', 'Safari', 'Script', 'config', 'args', 'console', 'WidgetDate'];
    const vals = [Color, Font, Point, Size, Rect, Path, Data, Image, FileManager, DrawContext, ListWidget, Request, CalendarEvent, Calendar, Location, Device, DateFormatter,
      Alert, Notification, Keychain, URLScheme, Pasteboard, Safari, Script, config, args, con, WDate];
    // opts.timeOffset renders the widget as it will look that many milliseconds from now (cycling frames for picture packs)
    const RealDate = Date, off = +opts.timeOffset || 0;
    class FDate extends RealDate { constructor(...a) { if (a.length) super(...a); else super(RealDate.now() + off); } static now() { return RealDate.now() + off; } }
    names.push('Date'); vals.push(off ? FDate : RealDate);
    const t0 = performance.now();
    await new Function(...names, '"use strict"; return (async () => {\n' + script + '\n})()')(...vals);
    if (!widget) throw new Error('The script finished without a widget. ' + logs.slice(-3).join(' | '));
    CUR_OFFSET = off;
    const DIMS = { small: [170, 170], medium: [364, 170], large: [364, 382] }, [W, H] = DIMS[family] || DIMS.medium;
    const all = []; (function walk(e) { if (e.backgroundImage) all.push(e.backgroundImage); if (e.type === 'image') all.push(e.image); (e.children || []).forEach(walk); })(widget);
    for (const im of all) await decodeAll(im);
    const out = { urls: [] }; place(widget, 0, 0, W, H, out);
    const c = document.createElement('canvas'); c.width = Math.round(W * scale); c.height = Math.round(H * scale); const x = c.getContext('2d');
    if (widget.backgroundGradient && widget.backgroundGradient.colors) { const g = x.createLinearGradient(0, 0, 0, c.height); widget.backgroundGradient.colors.forEach((col, i, a) => g.addColorStop(i / Math.max(1, a.length - 1), col.css())); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); }
    drawEl(x, widget, scale);
    return { png: c.toDataURL('image/png'), width: c.width, height: c.height, refreshAfter: widget.refreshAfterDate ? +widget.refreshAfterDate : null,
      url: androidLink(widget.url), links: out.urls.filter(u => u.box[2] > 0 && u.box[3] > 0).map(u => ({ url: androidLink(u.url), box: u.box.map(v => Math.round(v * 10) / 10) })),
      ms: Math.round(performance.now() - t0), logs };
  }
  // CSS font strings a script will draw with, so a page can load them before rendering
  function fontsNeeded(script) { const m = /"frame":\s*"(\w+)"/.exec(script), f = /"scriptFont":\s*"([^"]+)"/.exec(script), out = ['400 12px "IBM Plex Mono"', '500 12px "IBM Plex Mono"', '700 12px "Archivo"', '800 12px "Archivo"'];
    const disp = FRAME_DISPLAY[m ? m[1] : 'halcyon'] || 'Newsreader'; out.push(`400 12px "${disp}"`, `700 12px "${disp}"`);
    const nf = f && NAME_FONT[f[1]]; if (nf) out.push(`${nf[1]} 12px "${nf[0]}"`); return out; }
  G.FoundryRuntime = { run, fontsNeeded, version: '0.2.0', _native: native, _mem: MEM };
})(typeof window !== 'undefined' ? window : globalThis);
