// ---------- W-10 GAMES THAT PLAY THEMSELVES ----------
// Each refresh is a turn. State is saved on the phone, and plugging the phone in is the one real control:
// it feeds the Halcyon specimen, docks the Deep Range drone, and makes camp on the Long Road.
function gRng(st) { return () => { st.seed = (st.seed * 9301 + 49297) % 233280; return st.seed / 233280 } }
function gLog(st, m) { st.log = (st.log || []).concat([{ m, n: st.turn }]).slice(-8) }
const gClamp = (v) => Math.max(0, Math.min(100, v))
const gPick = (r, a) => a[Math.floor(r() * a.length) % a.length]
function gBar(k, x, y, w, h, f, on, off) { k.rect(x, y, w, h, off); k.rect(x, y, Math.max(1, w * Math.max(0, Math.min(1, f))), h, on) }

// text that never breaks off: shrink to fit, then wrap, never an ellipsis; small sizes get a readable floor
function gT(k, text, x, y, size, col, o) {
  o = o || {}; const f = o.f || "mono", w = (o.w || 320), est = f === "disp" ? 0.53 : 0.63, str = String(text)
  let fs = Math.max(size, o.floor == null ? 6.2 : o.floor); const opt = Object.assign({}, o, { nofit: true })
  if (str.length * fs * est <= w) { k.t(str, x, y, fs, col, opt); return { lines: 1, fs } }
  const s2 = w / (str.length * est), min = Math.max(5.6, fs * 0.74)
  if (s2 >= min) { k.t(str, x, y, s2, col, opt); return { lines: 1, fs: s2 } }
  const maxL = o.lines || 2; let ls = k.wrap(str, w * 0.97, fs, f)
  while (ls.length > maxL && fs > 5.6) { fs -= 0.4; ls = k.wrap(str, w * 0.97, fs, f) }
  ls.forEach((l, i) => k.t(l, x, y + i * fs * 1.18, fs, col, opt)); return { lines: ls.length, fs }
}
// a log that shows whole entries only, newest first, wrapped to the column, stopping before it would overflow
function gLogBlock(k, logs, x, y, w, maxY, size, f, c1, c2, prefix) {
  let yy = y; const lh = size * 1.2
  for (let i = 0; i < logs.length; i++) { const ls = k.wrap((prefix || "") + logs[i].m, w * 0.97, size, f); if (yy + ls.length * lh > maxY + 0.5) break; ls.forEach((l, j) => k.t(l, x + (j && prefix ? size * 0.63 * prefix.length : 0), yy + j * lh, size, i ? c2 : c1, { f, w, nofit: true })); yy += ls.length * lh + size * 0.3 }
  return yy
}
// ---------- character variety: every new run gets its own look ----------
function gVar(st, salt, n) { let h = (((st.run || 1) * 2654435761) ^ (salt * 40503) ^ ((st.vseed || 0) * 97)) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) % n; }
const gRot = (x, y, a, px, py) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)];
function gDrone(k, x, y, a, type, col, ink) {
  const P = (pts) => pts.map(([px, py]) => gRot(x, y, a, px, py));
  if (type === 0) k.poly(P([[8, 0], [-6, 5], [-3, 0], [-6, -5]]), col);
  else if (type === 1) { k.poly(P([[-7, -4], [5, -4], [5, 4], [-7, 4]]), col); k.poly(P([[5, -3], [10, 0], [5, 3]]), col); k.ln(P([[-3, -4], [-3, 4]]), ink, 1); }
  else if (type === 2) { k.circ(x, y, 5.5, null, col, 1.8); k.circ(x, y, 1.8, col); k.poly(P([[-5, -3], [-10, -6], [-8, 0]]), col); k.poly(P([[-5, 3], [-10, 6], [-8, 0]]), col); }
  else if (type === 3) { k.ln(P([[-7, -4], [6, -4]]), col, 2.4); k.ln(P([[-7, 4], [6, 4]]), col, 2.4); k.circ(x, y, 3, col); k.ln(P([[3, -4], [3, 4]]), col, 1.2); }
  else { k.ell(x, y, 8, 4, col); k.circ(x, y - 2, 2.6, k.a("#FFFFFF", 0.8)); }
}
function gTraveller(k, x, y, s, look, ink, red) {
  const cloak = [red, k.a("#4E6B3A", 1), k.a("#3A5A8A", 1), k.a("#B88A2E", 1)][look.cloak];
  k.ln([[x - 2 * s, y - 3 * s], [x - 3 * s, y + 3 * s]], ink, 1.3 * s); k.ln([[x + 2 * s, y - 3 * s], [x + 3 * s, y + 3 * s]], ink, 1.3 * s);
  k.poly([[x - 4 * s, y - 14 * s], [x + 4 * s, y - 14 * s], [x + 6 * s, y - 2 * s], [x - 6 * s, y - 2 * s]], cloak, ink, 0.8);
  k.circ(x, y - 17 * s, 2.6 * s, ink);
  if (look.hat === 1) k.poly([[x - 3.6 * s, y - 16 * s], [x, y - 22 * s], [x + 3.6 * s, y - 16 * s]], cloak, ink, 0.6);
  else if (look.hat === 2) { k.rect(x - 6 * s, y - 19 * s, 12 * s, 1.6 * s, ink); k.rect(x - 2.6 * s, y - 22.5 * s, 5.2 * s, 3.6 * s, ink); }
  else if (look.hat === 3) { k.poly([[x - 3 * s, y - 19 * s], [x + 3 * s, y - 19 * s], [x + 1 * s, y - 22 * s]], ink); k.ln([[x + 1 * s, y - 22 * s], [x + 6 * s, y - 26 * s]], red, 1 * s); }
  if (look.carry === 0) { k.ln([[x + 6 * s, y - 12 * s], [x + 7 * s, y - 6 * s]], ink, 0.8); k.circ(x + 7 * s, y - 5 * s, 1.8 * s, k.a("#F2B33D", 1)); }
  else if (look.carry === 1) k.ln([[x + 6 * s, y - 20 * s], [x + 8 * s, y + 3 * s]], ink, 1.1 * s);
  else { k.ell(x - 7 * s, y - 9 * s, 2.8 * s, 3.6 * s, k.a("#B88A2E", 1), ink, 0.6); k.ln([[x - 7 * s, y - 12 * s], [x - 7 * s, y - 18 * s]], ink, 0.8); }
  const cx = x + 11 * s, cy = y + 2 * s;
  if (look.comp === 1) { k.ell(cx, cy - 3 * s, 4 * s, 2.4 * s, ink); k.circ(cx + 4 * s, cy - 5 * s, 1.8 * s, ink); k.ln([[cx - 4 * s, cy - 4 * s], [cx - 6 * s, cy - 7 * s]], ink, 0.8); }
  else if (look.comp === 2) { const by = y - 24 * s; k.ln([[x + 4 * s, by + 2 * s], [x + 7 * s, by], [x + 10 * s, by + 2 * s]], ink, 1); }
  else if (look.comp === 3) { k.ell(cx + 2 * s, cy - 5 * s, 6 * s, 3.4 * s, k.a("#8A8A8A", 1), ink, 0.6); k.circ(cx + 8 * s, cy - 8 * s, 2.4 * s, k.a("#8A8A8A", 1), ink, 0.6); k.ln([[cx - 2 * s, cy - 2 * s], [cx - 2 * s, cy + 1 * s]], ink, 0.8); k.ln([[cx + 6 * s, cy - 2 * s], [cx + 6 * s, cy + 1 * s]], ink, 0.8); }
  else if (look.comp === 4) { k.ell(cx, cy - 2 * s, 3.4 * s, 2 * s, ink); k.circ(cx + 3 * s, cy - 4 * s, 1.6 * s, ink); k.ln([[cx - 3 * s, cy - 2 * s], [cx - 5 * s, cy - 6 * s]], ink, 0.8); }
}
function gApprentice(k, x, y, s, robe, hat, ink, gold) {
  k.poly([[x, y - 18 * s], [x + 8 * s, y], [x - 8 * s, y]], robe, ink, 0.6); k.circ(x, y - 20 * s, 3.2 * s, k.a("#E9D7B8", 1), ink, 0.6);
  if (hat === 0) { k.poly([[x - 6 * s, y - 22 * s], [x + 6 * s, y - 22 * s], [x + 1 * s, y - 34 * s]], robe, ink, 0.6); k.circ(x + 1 * s, y - 34 * s, 1 * s, gold); }
  else if (hat === 1) k.ln(k.arcPts(x, y - 20 * s, 4.6 * s, Math.PI * 1.05, Math.PI * 1.95, 10), robe, 2.2 * s);
  else { k.ln([[x - 3.4 * s, y - 22.5 * s], [x + 3.4 * s, y - 22.5 * s]], gold, 1); k.circ(x, y - 23 * s, 1.1 * s, k.a("#5FD1C1", 1)); }
  k.ln([[x + 6 * s, y - 14 * s], [x + 10 * s, y - 26 * s]], ink, 0.9); k.circ(x + 10 * s, y - 27 * s, 1.6 * s, gold);
}
function gFamiliar(k, x, y, s, kind, ink, col) {
  if (kind === 0) { k.ell(x, y, 5 * s, 6 * s, col, ink, 0.6); k.circ(x - 2 * s, y - 2 * s, 1.6 * s, k.a("#FFFFFF", 1)); k.circ(x + 2 * s, y - 2 * s, 1.6 * s, k.a("#FFFFFF", 1)); k.circ(x - 2 * s, y - 2 * s, 0.7 * s, ink); k.circ(x + 2 * s, y - 2 * s, 0.7 * s, ink); }
  else if (kind === 1) { k.circ(x, y, 4.4 * s, ink); k.poly([[x - 4 * s, y - 2 * s], [x - 3 * s, y - 7 * s], [x - 0.5 * s, y - 3 * s]], ink); k.poly([[x + 4 * s, y - 2 * s], [x + 3 * s, y - 7 * s], [x + 0.5 * s, y - 3 * s]], ink); k.circ(x - 1.6 * s, y - 0.5 * s, 0.8 * s, col); k.circ(x + 1.6 * s, y - 0.5 * s, 0.8 * s, col); }
  else if (kind === 2) { k.ell(x, y, 6 * s, 3.6 * s, k.a("#5E8C4A", 1), ink, 0.6); k.circ(x - 2.4 * s, y - 3 * s, 1.6 * s, k.a("#5E8C4A", 1), ink, 0.5); k.circ(x + 2.4 * s, y - 3 * s, 1.6 * s, k.a("#5E8C4A", 1), ink, 0.5); }
  else { k.ell(x - 4 * s, y, 4 * s, 2.6 * s, col, ink, 0.5); k.ell(x + 4 * s, y, 4 * s, 2.6 * s, col, ink, 0.5); k.ln([[x, y - 3 * s], [x, y + 3 * s]], ink, 1.2); }
}
function gMask(k, x, y, s, look, ink, panel, eye) {
  const E = (dx, ang, bend) => { const p = [[0, 0], [-4, -11], [bend, -30], [4, -11]].map(([px, py]) => gRot(x + dx * s, y - 12 * s, ang, px * s, py * s)); k.poly(p, ink); };
  if (look.ears === 0) { E(-7, -0.15, 0); E(7, 0.15, 0); } else if (look.ears === 1) { E(-7, -0.15, 0); E(7, 0.6, 6); } else { E(-8, -0.35, 0); E(-3, -0.05, 0); E(8, 0.3, 0); }
  k.poly([[x - 16 * s, y - 13 * s], [x + 16 * s, y - 13 * s], [x + 14 * s, y + 3 * s], [x, y + 18 * s], [x - 14 * s, y + 3 * s]], ink);
  if (look.stripe) k.poly([[x - 16 * s, y - 13 * s], [x - 8 * s, y - 13 * s], [x - 6 * s, y + 10 * s], [x - 14 * s, y + 3 * s]], k.a(panel, 0.35));
  [-1, 1].forEach(sd => k.poly([[x + sd * 2 * s, y - 4 * s], [x + sd * 12 * s, y - 7 * s], [x + sd * 10 * s, y - 2 * s]], eye));
}
function gRunner(k, x, y, s, look, ink, visor, chrome) {
  k.ln(k.arcPts(x, y + 22 * s, 18 * s, Math.PI * 1.1, Math.PI * 1.9, 12), ink, 6 * s);
  k.circ(x, y, 9 * s, k.a("#C9A07E", 1));
  const hair = [k.a("#FF2E88", 1), k.a("#00F0FF", 1), k.a("#FCEE0A", 1), k.a("#E8E8F0", 1)][look.hairCol];
  if (look.hair === 0) for (let i = -2; i <= 2; i++) k.poly([[x + i * 2.6 * s - 1.4 * s, y - 7 * s], [x + i * 2.6 * s, y - 16 * s + Math.abs(i) * 2 * s], [x + i * 2.6 * s + 1.4 * s, y - 7 * s]], hair);
  else if (look.hair === 1) { k.ln(k.arcPts(x, y - 1 * s, 10 * s, Math.PI * 1.0, Math.PI * 2.0, 12), hair, 4 * s); k.rect(x - 10 * s, y - 1 * s, 3 * s, 8 * s, hair); k.rect(x + 7 * s, y - 1 * s, 3 * s, 8 * s, hair); }
  else if (look.hair === 2) k.ln(k.arcPts(x, y, 9 * s, Math.PI * 1.15, Math.PI * 1.85, 10), hair, 2.4 * s);
  else { k.ln(k.arcPts(x, y - 1 * s, 10 * s, Math.PI * 1.0, Math.PI * 2.0, 12), hair, 3 * s); k.rect(x - 11 * s, y, 3 * s, 16 * s, hair); k.rect(x + 8 * s, y, 3 * s, 16 * s, hair); }
  k.rect(x - 8 * s, y - 2.5 * s, 16 * s, 4 * s, visor);
  if (look.chrome) k.ln([[x + 3 * s, y + 4 * s], [x + 8 * s, y + 1 * s]], chrome, 1.4);
}
function gMascot(k, x, y, s, kind) {
  if (kind === 0) { k.poly([[x - 9 * s, y + 3 * s], [x - 2 * s, y - 6 * s], [x + 8 * s, y - 2 * s], [x + 11 * s, y - 3 * s], [x + 9 * s, y], [x - 5 * s, y + 4 * s], [x - 11 * s, y + 7 * s]], k.a("#01CDFE", 1)); k.poly([[x - 1 * s, y - 5 * s], [x + 2 * s, y - 9 * s], [x + 3 * s, y - 4 * s]], k.a("#01CDFE", 1)); }
  else if (kind === 1) { k.ell(x, y - 2 * s, 6 * s, 4 * s, k.a("#FF71CE", 1)); k.ln([[x + 3 * s, y - 4 * s], [x + 5 * s, y - 12 * s], [x + 8 * s, y - 10 * s]], k.a("#FF71CE", 1), 2 * s); k.ln([[x - 1 * s, y + 2 * s], [x - 1 * s, y + 10 * s]], k.a("#FF71CE", 1), 1); }
  else if (kind === 2) { k.ln([[x, y + 10 * s], [x + 1 * s, y - 6 * s]], k.a("#6B3F2A", 1), 2 * s); [-0.8, -0.2, 0.4, 1.0, 2.2, 2.8].forEach(a => k.ln([[x + 1 * s, y - 6 * s], [x + 1 * s + 10 * s * Math.cos(a + Math.PI), y - 6 * s + 6 * s * Math.sin(a + Math.PI) + 3 * s]], k.a("#2FAE7A", 1), 2 * s)); }
  else { k.circ(x, y - 4 * s, 6 * s, k.a("#F4EEF8", 1)); k.rect(x - 7 * s, y + 2 * s, 14 * s, 8 * s, k.a("#F4EEF8", 1)); k.rect(x - 5 * s, y - 6 * s, 4 * s, 2 * s, k.a("#101018", 1)); k.rect(x + 1 * s, y - 6 * s, 4 * s, 2 * s, k.a("#101018", 1)); }
}
function gKeeper(k, x, y, s, kind, ink, col) {
  if (kind === 0) { k.ell(x, y, 10 * s, 6 * s, k.a("#6E6E6E", 1), ink, 0.7); k.poly([[x + 6 * s, y - 4 * s], [x + 14 * s, y], [x + 6 * s, y + 3 * s]], k.a("#F4EEDF", 1), ink, 0.6); k.ln([[x + 6 * s, y - 3 * s], [x + 13 * s, y]], ink, 1.4); k.circ(x + 13 * s, y, 1 * s, ink); }
  else if (kind === 1) { k.ell(x, y, 7 * s, 9 * s, k.a("#8A6A44", 1), ink, 0.7); k.circ(x - 3 * s, y - 3 * s, 2.6 * s, k.a("#FFFFFF", 1), ink, 0.5); k.circ(x + 3 * s, y - 3 * s, 2.6 * s, k.a("#FFFFFF", 1), ink, 0.5); k.circ(x - 3 * s, y - 3 * s, 1 * s, ink); k.circ(x + 3 * s, y - 3 * s, 1 * s, ink); k.poly([[x - 1 * s, y], [x + 1 * s, y], [x, y + 2 * s]], col); }
  else if (kind === 2) { k.poly([[x - 9 * s, y + 4 * s], [x - 8 * s, y - 4 * s], [x - 4 * s, y - 11 * s], [x - 1 * s, y - 4 * s], [x + 3 * s, y - 4 * s], [x + 6 * s, y - 11 * s], [x + 9 * s, y - 4 * s], [x + 10 * s, y + 4 * s], [x, y + 10 * s]], col, ink, 0.7); k.circ(x - 3 * s, y - 1 * s, 1 * s, ink); k.circ(x + 4 * s, y - 1 * s, 1 * s, ink); }
  else { k.poly([[x - 10 * s, y + 4 * s]].concat(Array.from({ length: 9 }, (_, i) => { const a = Math.PI + i * Math.PI / 8, rr = i % 2 ? 11 * s : 8 * s; return [x + rr * Math.cos(a), y + rr * 0.7 * Math.sin(a)]; })).concat([[x + 10 * s, y + 4 * s]]), k.a("#8A6A44", 1), ink, 0.6); k.circ(x + 11 * s, y + 2 * s, 1.4 * s, ink); }
}
function gTrader(k, x, y, s, kind, ink, col) {
  k.circ(x, y, 12 * s, k.a("#000000", 0.25), col, 1);
  if (kind === 0) { k.ell(x - 1 * s, y + 1 * s, 7 * s, 4 * s, col); k.poly([[x + 5 * s, y + 1 * s], [x + 10 * s, y - 4 * s], [x + 10 * s, y + 5 * s]], col); k.circ(x - 4 * s, y, 0.9 * s, ink); }
  else if (kind === 1) { k.poly([[x - 8 * s, y + 4 * s], [x + 1 * s, y - 8 * s], [x + 4 * s, y + 4 * s]], col); k.ln([[x - 9 * s, y + 5 * s], [x + 9 * s, y + 5 * s]], col, 1.2); }
  else if (kind === 2) { k.circ(x, y + 2 * s, 5 * s, col); k.ln([[x - 4 * s, y - 2 * s], [x - 9 * s, y - 7 * s], [x - 7 * s, y - 9 * s]], col, 1.6); k.ln([[x + 4 * s, y - 2 * s], [x + 9 * s, y - 7 * s], [x + 7 * s, y - 9 * s]], col, 1.6); }
  else { k.circ(x - 3 * s, y, 3 * s, col); k.circ(x + 3 * s, y, 3 * s, col); k.circ(x - 3 * s, y, 1.2 * s, ink); k.circ(x + 3 * s, y, 1.2 * s, ink); }
}
function gEmblem(k, x, y, r, kind, col, fill) {
  if (kind === 0) k.hex(x, y, r, fill, col, 1);
  else if (kind === 1) k.poly([[x - r, y - r * 0.8], [x + r, y - r * 0.8], [x + r * 0.8, y + r * 0.3], [x, y + r], [x - r * 0.8, y + r * 0.3]], fill, col, 1);
  else if (kind === 2) k.circ(x, y, r, fill, col, 1);
  else k.poly([[x, y - r], [x + r, y + r * 0.8], [x - r, y + r * 0.8]], fill, col, 1);
}
function gMarker(k, x, y, kind, col) {
  if (kind === 0) k.poly([[x, y - 3.4], [x + 3.4, y], [x, y + 3.4], [x - 3.4, y]], col);
  else if (kind === 1) k.poly([[x, y - 3.8], [x + 3.4, y + 2.6], [x - 3.4, y + 2.6]], col);
  else if (kind === 2) k.rect(x - 2.8, y - 2.8, 5.6, 5.6, col);
  else k.ln([[x - 3.4, y + 1.8], [x, y - 2.2], [x + 3.4, y + 1.8]], col, 1.8);
}
function gSafe(k) { if (k.__safe) return k; const s = Object.assign({}, k); s.__safe = true; s.t = (text, x, y, size, col, o) => { gT(k, text, x, y, size, col, o) }; return s }
const GAMES = {
  // HALCYON: an abstract organism grown in a containment vat. Not a pet. A product.
  halcyon: {
    title: "W-10 // SPECIMEN VAT",
    stages: ["SPORE", "LARVA", "JUVENILE", "SPECIMEN", "ASCENDANT"], th: [0, 6, 18, 40, 80],
    morph: ["SEED NUCLEUS", "HELICAL STRAND", "MEMBRANE LATTICE", "RADIAL BLOOM", "LATTICE SPHERE"],
    TRAITS: ["secondary nucleus", "bioluminescence", "redundant heart", "sensory filaments", "unauthorized opinions", "crystalline lattice", "neural bloom"],
    OLD: { "a second eye": "secondary nucleus", "an extra heart": "redundant heart", "feelers": "sensory filaments", "opinions": "unauthorized opinions", "a tiny crown": "crystalline lattice", "gills": "neural bloom" },
    init(now, prev) { const run = prev ? prev.run + 1 : 1; return { v: 1, vseed: (now % 99991), game: "halcyon", run, lot: `HB-2893-${String(13 + run).padStart(2, "0")}`, stage: 0, age: 0, growth: 0, nut: 62, vit: 80, stress: 18, traits: [], hist: [80], shist: [18], best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed: (now % 233280) || 11, last: prev ? prev.last : 0 } },
    migrate(st) { const G = GAMES.halcyon; st.traits = (st.traits || []).map(t => G.OLD[t] || t); st.shist = st.shist || [st.stress]; st.growth = st.growth ?? st.age; return st },
    right(st, inp) { return inp.charging ? "FEEDING · CHARGING" : `LOT ${st.lot}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.halcyon, night = inp.hour < 6 || inp.hour >= 23
      st.growth = st.growth ?? st.age; st.turn++; st.age++; if (inp.charging) st.growth++
      if (inp.charging) { st.nut += 22; gLog(st, "Nutrient line open via charging port. +22.") } else st.nut -= 5
      if (night) { st.stress -= 8; st.vit += 3; if (r() < 0.5) gLog(st, gPick(r, ["Night cycle. Dormant. Dreaming of protein.", "Night cycle. Metabolism throttled to 12%.", "Lights down. Specimen counting something."])) }
      if (inp.busy >= 4 && !night) { st.stress += 7; gLog(st, `${inp.busy} allocations today. Specimen agitated.`) }
      if (inp.batt < 0.2 && !inp.charging) { st.vit -= 6; gLog(st, "Low power. Luminance falling.") }
      st.vit += (st.nut > 40 ? 2 : -6) - (st.stress > 70 ? 5 : 0)
      const e = r()
      if (e < 0.12) { const left = G.TRAITS.filter(t => !st.traits.includes(t)); if (left.length) { const t = gPick(r, left); st.traits.push(t); gLog(st, `Mutation logged: ${t}. Filed under assets.`) } }
      else if (e < 0.19) gLog(st, gPick(r, ["Specimen pattern-matched a technician's face. Logged.", "Unscheduled cognition detected. Flagged for review.", "Specimen requested a name. Request denied."]))
      else if (e < 0.25) { st.stress += 6; gLog(st, "Containment breach probability 4%. Lid re-sealed.") }
      else if (e < 0.31) { st.vit += 4; gLog(st, "Specimen emitted the compliance anthem at 40 Hz.") }
      else if (e < 0.36) { st.stress -= 5; gLog(st, "Technician lingered at the glass. Stress -5.") }
      else if (e < 0.42) gLog(st, gPick(r, ["Membrane resequenced. Integrity holding.", "Mass gain within projection.", "Lattice self-repair complete."]))
      st.nut = gClamp(st.nut); st.vit = gClamp(st.vit); st.stress = gClamp(st.stress)
      if (inp.charging && st.stage < 4 && st.growth >= G.th[st.stage + 1] && st.vit > 45) { st.stage++; gLog(st, `Growth milestone: ${G.stages[st.stage]}. Morphology: ${G.morph[st.stage].toLowerCase()}.`) }
      st.hist = (st.hist || []).concat([st.vit]).slice(-24); st.shist = (st.shist || []).concat([st.stress]).slice(-24)
      if (st.vit <= 0) { const best = Math.max(st.best || 0, st.age), old = st.lot; Object.assign(st, G.init(Date.now(), st)); st.best = best; gLog(st, `Lot ${old} recycled into feedstock. Lot ${st.lot} opened.`) }
    },
    // abstract organism, drawn as Halcyon line work: one morphology per stage, traits as modifications
    organism(k, cx, cy, R, st, inp, TM) {
      const vv = gVar(st, 7, 4), dir = vv % 2 ? -1 : 1, I = k.I, LAV = [(T.altBg || "#9D8CF2"), "#7FE3F0", "#3FCF9A", "#C9A7F2"][vv], ICE = ["#7FE3F0", "#9D8CF2", "#7FE3F0", "#3FCF9A"][vv], has = (t) => st.traits.includes(t), pulse = 1 + 0.06 * Math.sin(TM / 2)
      const glow = has("bioluminescence") || inp.charging
      if (glow) for (let g = 4; g >= 1; g--) k.circ(cx, cy, R * (1.05 + g * 0.18), k.a(LAV, 0.07))
      // containment field: rotating dashed rings and tick marks
      for (let i = 0; i < 48; i += 2) { const a0 = i / 48 * Math.PI * 2 + dir * TM / 18, a1 = a0 + Math.PI / 48; k.ln(k.arcPts(cx, cy, R * 1.32, a0, a1, 3), k.ia(0.35), 0.7) }
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 - TM / 25, l = i % 6 ? 2 : 5; k.ln([[cx + R * 1.45 * Math.cos(a), cy + R * 1.45 * Math.sin(a)], [cx + (R * 1.45 + l) * Math.cos(a), cy + (R * 1.45 + l) * Math.sin(a)]], k.ia(0.45), 0.6) }
      // orbiting particles; neural bloom wires them together
      const parts = []; for (let i = 0; i < 7 + st.stage * 2 + vv * 2; i++) { const a = i / (7 + st.stage * 2) * Math.PI * 2 + TM / (8 + i % 3 * 3), rr = R * (1.12 + 0.12 * Math.sin(i * 1.7 + TM / 6)); parts.push([cx + rr * Math.cos(a), cy + rr * 0.86 * Math.sin(a)]) }
      if (has("neural bloom")) parts.forEach((p, i) => { const q = parts[(i + 3) % parts.length]; k.ln([p, q], k.a(LAV, 0.35), 0.5) })
      parts.forEach((p, i) => k.circ(p[0], p[1], i % 3 ? 0.9 : 1.6, i % 3 ? k.ia(0.6) : k.a(LAV, 1)))
      const s = st.stage
      if (s === 0) {
        ;[1, 0.72, 0.46].forEach((f, i) => k.circ(cx, cy, R * f * (i === 0 ? pulse : 1), i === 1 ? k.a(LAV, 0.25) : null, I, i === 0 ? 1 : 0.7))
        k.circ(cx, cy, R * 0.2 * pulse, k.a(LAV, 1), I, 0.8)
      } else if (s === 1) {
        const L = R * 1.15
        for (let j = 0; j <= 22; j++) { const t = j / 22, y = cy - L + 2 * L * t, ph = t * Math.PI * (3 + vv) + TM / 3, x1 = cx + Math.sin(ph) * R * (0.34 + vv * 0.04), x2 = cx - Math.sin(ph) * R * (0.34 + vv * 0.04); if (j % 2 === 0) k.ln([[x1, y], [x2, y]], k.ia(0.35), 0.6); if (j < 22) { const t2 = (j + 1) / 22, y2 = cy - L + 2 * L * t2, ph2 = t2 * Math.PI * 4 + TM / 3; k.ln([[x1, y], [cx + Math.sin(ph2) * R * 0.42, y2]], I, 1.1); k.ln([[x2, y], [cx - Math.sin(ph2) * R * 0.42, y2]], k.a(LAV, 1), 1.1) } if (j % 4 === 0) k.circ(x1, y, 1.4, I) }
        k.circ(cx, cy, R * 0.16 * pulse, k.a(LAV, 1), I, 0.8)
      } else if (s === 2) {
        const hr = R * 0.36 * pulse, cells = [[0, 0]].concat([0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * hr * 1.75, Math.sin(i * Math.PI / 3 + Math.PI / 6) * hr * 1.75]))
        k.circ(cx, cy, R * 0.98, k.a(LAV, 0.12), I, 0.9)
        cells.forEach(([dx, dy], i) => { k.hex(cx + dx, cy + dy, hr, i === 0 ? k.a(LAV, 0.5) : k.a(T.panel, 0.9), I, 0.9, 0); k.circ(cx + dx + Math.sin(TM / 4 + i) * hr * 0.2, cy + dy, hr * 0.22, i === 0 ? I : k.a(LAV, 1)) })
      } else if (s === 3) {
        const NF = 12 + vv * 2; for (let i = 0; i < NF; i++) { const a = i / NF * Math.PI * 2 + dir * TM / 30, pts = []; for (let j = 0; j <= 10; j++) { const t = j / 10, rr = R * (0.32 + 0.78 * t), bend = Math.sin(t * 3 + TM / 3 + i) * 0.25 * t; pts.push([cx + rr * Math.cos(a + bend), cy + rr * Math.sin(a + bend)]) } k.ln(pts, i % 2 ? I : k.a(LAV, 1), i % 2 ? 0.9 : 1.2); const e = pts[pts.length - 1]; k.circ(e[0], e[1], 1.5, i % 2 ? I : k.a(LAV, 1)) }
        ;[0.36, 0.26].forEach((f, i) => { k.circ(cx, cy, R * f, i ? k.a(LAV, 0.5) : k.a(T.panel, 0.95), I, 1); for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2 + (i ? -TM / 6 : TM / 8); k.ln([[cx + R * f * 0.7 * Math.cos(a), cy + R * f * 0.7 * Math.sin(a)], [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)]], I, 0.6) } })
        k.circ(cx, cy, R * 0.1 * pulse, I)
      } else {
        const rot = TM / 10
        k.circ(cx, cy, R, k.a(LAV, 0.14), I, 1.1)
        for (let i = 1; i < 6; i++) { const lat = -Math.PI / 2 + i * Math.PI / 6; k.ell(cx, cy + R * Math.sin(lat), R * Math.cos(lat), R * 0.14 * Math.cos(lat), null, k.ia(0.45), 0.6) }
        for (let i = 0; i < 6; i++) { const ph = rot + i * Math.PI / 6, w = Math.abs(Math.cos(ph)) * R; if (w > 1) k.ell(cx, cy, w, R, null, i === 0 ? k.a(LAV, 1) : k.ia(0.45), i === 0 ? 1.1 : 0.6) }
        k.ell(cx, cy, R * 1.25, R * 0.28, null, k.a(LAV, 1), 1); const oa = TM / 4; k.circ(cx + R * 1.25 * Math.cos(oa), cy + R * 0.28 * Math.sin(oa), 2.4, k.a(LAV, 1), I, 0.6)
        k.circ(cx, cy, R * 0.12 * pulse, I)
      }
      // trait modifications
      if (has("secondary nucleus")) { const a = TM / 5; k.circ(cx + R * 0.55 * Math.cos(a), cy + R * 0.45 * Math.sin(a), R * 0.1, k.a(LAV, 1), I, 0.7) }
      if (has("redundant heart")) { const p2 = 1 + 0.25 * Math.max(0, Math.sin(TM * 1.3)); k.circ(cx - R * 0.22, cy + R * 0.3, R * 0.07 * p2, k.a("#E35D8F", 0.9)); k.circ(cx + R * 0.22, cy + R * 0.3, R * 0.07 * (2.2 - p2), k.a("#E35D8F", 0.9)) }
      if (has("sensory filaments")) for (let i = 0; i < 5; i++) { const x = cx - R * 0.5 + i * R * 0.25, pts = []; for (let j = 0; j <= 8; j++) pts.push([x + Math.sin(TM / 2 + i + j * 0.6) * 3, cy - R * 0.9 - j * R * 0.11]); k.ln(pts, k.ia(0.7), 0.6); k.circ(pts[8][0], pts[8][1], 1, k.a(LAV, 1)) }
      if (has("crystalline lattice")) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + TM / 40; k.poly([[cx + R * 0.9 * Math.cos(a), cy + R * 0.9 * Math.sin(a)], [cx + R * 1.12 * Math.cos(a + 0.18), cy + R * 1.12 * Math.sin(a + 0.18)], [cx + R * 0.9 * Math.cos(a + 0.36), cy + R * 0.9 * Math.sin(a + 0.36)]], k.a(ICE, 0.5), I, 0.6) }
      if (has("unauthorized opinions")) { const jit = []; for (let i = 0; i <= 36; i++) { const a = i / 36 * Math.PI * 2; jit.push([cx + R * (1.2 + (i % 2 ? 0.06 : -0.02) * (1 + Math.sin(TM + i))) * Math.cos(a), cy + R * (1.2 + (i % 2 ? 0.06 : -0.02)) * 0.86 * Math.sin(a)]) } k.ln(jit, k.a("#E35D8F", 0.6), 0.6) }
      if (st.stress > 60) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + TM; k.ln([[cx + R * 1.02 * Math.cos(a), cy + R * 1.02 * Math.sin(a)], [cx + R * 1.12 * Math.cos(a + 0.08), cy + R * 1.12 * Math.sin(a + 0.08)]], I, 0.8) }
    },
    vat(k, vx, vy, vw, vh, st, inp, TM, small) {
      const I = k.I, LAV = (T.altBg || "#9D8CF2")
      k.rect(vx + vw * 0.28, vy - 3, 4, 9, I); k.rect(vx + vw * 0.64, vy - 3, 4, 9, I)
      if (inp.charging) { k.rect(vx + vw * 0.28 + 1, vy - 3, 2, 9, k.a(LAV, 1)); for (let i = 0; i < 5; i++) { const dy = (TM * 14 + i * 22) % (vh * 0.45); k.circ(vx + vw * 0.28 + 2, vy + 10 + dy, 1.5, k.a(LAV, 0.9)) } }
      k.rect(vx, vy + 6, vw, vh - 14, k.a(LAV, 0.12), I, 1.2)
      for (let i = 0; i < 8; i++) k.rect(vx + 1, vy + 7 + i * (vh - 16) / 8, vw - 2, (vh - 16) / 16, k.a(LAV, 0.03 + i * 0.012))
      k.ell(vx + vw / 2, vy + 6, vw / 2, 4, k.a(T.panel, 1), I, 1.2)
      // glass graduations, reflections and condensation
      for (let i = 0; i <= 10; i++) { const y = vy + 14 + i * (vh - 30) / 10; k.ln([[vx + vw - (i % 5 ? 4 : 8), y], [vx + vw - 1, y]], k.ia(0.55), 0.6); if (!small && i % 5 === 0) k.t(`${100 - i * 10}`, vx + vw - 10, y - 3, 4.5, k.ia(0.5), { a: "r", w: 14, nofit: true }) }
      k.ln([[vx + 5, vy + 12], [vx + 5, vy + vh - 14]], k.a("#FFFFFF", 0.7), 1.5); k.ln([[vx + 9, vy + 12], [vx + 9, vy + vh * 0.4]], k.a("#FFFFFF", 0.45), 0.8)
      const cr = k.rng(st.run * 3 + 1); for (let i = 0; i < (small ? 8 : 18); i++) k.circ(vx + 3 + cr() * (vw - 6), vy + 10 + cr() * 18, 0.5 + cr() * 0.7, k.a("#FFFFFF", 0.7))
      // bubbles
      const r = k.rng(st.run * 7 + 3)
      for (let i = 0; i < (small ? 8 : 16); i++) { const bx = vx + 8 + r() * (vw - 16), span = vh - 24, by = vy + vh - 14 - ((r() * span + TM * (6 + i % 3)) % span); k.circ(bx + Math.sin(TM / 3 + i) * 2, by, 0.8 + r() * 1.8, null, k.ia(0.4), 0.6) }
      // scanning laser sweeping the tank
      const sy = vy + 10 + ((TM * 9) % (vh - 24)); k.ln([[vx + 1, sy], [vx + vw - 1, sy]], k.a(LAV, 0.85), 0.9); k.rect(vx + 1, sy - 3, vw - 2, 3, k.a(LAV, 0.1))
      // base with status LEDs
      k.rect(vx - 3, vy + vh - 10, vw + 6, 12, I)
      for (let i = 0; i < 4; i++) { const on = (Math.floor(TM / (2 + i)) + i) % 2 === 0; k.circ(vx + 4 + i * 6, vy + vh - 4, 1.5, on ? k.a(i === 3 && inp.charging ? LAV : (T.ground || "#A6F3CC"), 1) : k.a("#FFFFFF", 0.2)) }
      k.t(st.lot, vx + vw - 2, vy + vh - 8, small ? 5 : 6, k.a(T.panel, 1), { a: "r", w: vw - 26, nofit: true })
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const G = GAMES.halcyon, TM = Date.now() / 60000, small = W < 200, big = H > 200, LAV = (T.altBg || "#9D8CF2"), I = k.I, S = k.S
      const vx = 12, vw = small ? 62 : big ? 128 : 76, vy = 8, vh = small ? H - 20 : big ? 250 : H - 18
      G.vat(k, vx, vy, vw, vh, st, inp, TM, small)
      const cx = vx + vw / 2, cy = vy + vh * 0.46 + Math.sin(TM / 4) * 2, R = (small ? 13 : big ? 30 : 17) * (0.75 + st.stage * 0.08)
      G.organism(k, cx, cy, R, st, inp, TM)
      if (!small) {
        // holographic bracket around the specimen with live readouts
        const bw = R * 1.75, bh = R * 1.75
        ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy2]) => { const x = cx + sx * bw, y = cy + sy2 * bh; k.ln([[x, y + -sy2 * 6], [x, y], [x + -sx * 6, y]], k.a(LAV, 0.9), 0.9) })
        k.t(`${G.morph[st.stage]} · ${'ABCD'[gVar(st, 7, 4)]}`, cx, cy - bh - 11, big ? 6.5 : 6, k.ia(0.75), { a: "c", w: vw - 6, lines: 1 })
        k.t(`M ${(0.02 + st.age * 0.015 * (1 + st.stage)).toFixed(2)}mg`, cx, cy + bh + 3, big ? 6.5 : 6, k.ia(0.75), { a: "c", w: vw - 6, lines: 1 })
      }
      const x0 = vx + vw + 14, rw = W - x0 - 12
      const cog = Math.min(100, st.stage * 18 + st.traits.length * 6 + (st.age % 7)), bpm = Math.round(48 + st.stress * 0.6 + (inp.charging ? 8 : 0))
      k.t(inp.charging ? "FEEDING // NUTRIENT LINE OPEN" : st.stress > 60 ? "CONTAINMENT // AGITATED" : "CONTAINMENT // NOMINAL", x0, 4, 7, inp.charging || st.stress > 60 ? k.a(LAV, 1) : S, { w: rw, f: "bold", lines: 1 })
      k.t(G.stages[st.stage], x0, 13, small ? 13 : big ? 20 : 16, I, { f: "disp", w: rw })
      if (small) {
        ;[["VIT", st.vit], ["NUT", st.nut]].forEach(([l, v], i) => { const y = 36 + i * 17; k.t(`${l} ${Math.round(v)}`, x0, y, 6.8, S, { w: rw, lines: 1 }); gBar(k, x0, y + 9, rw, 4, v / 100, I, k.ia(0.12)) })
        k.t(`AGE ${st.age}`, x0, 74, 6.8, S, { w: rw, lines: 1 }); return
      }
      k.t(`AGE ${st.age} CYCLES · RUN ${st.run}${st.best ? " · BEST " + st.best : ""}`, x0, big ? 37 : 31, 6.5, S, { w: rw, lines: 1 })
      if (big) {
        // growth ladder
        const ly = 50, lw = rw - 8; k.ln([[x0 + 4, ly], [x0 + 4 + lw, ly]], k.ia(0.25), 1)
        const nxt = st.stage < 4 ? (st.age - G.th[st.stage]) / (G.th[st.stage + 1] - G.th[st.stage]) : 1
        k.ln([[x0 + 4, ly], [x0 + 4 + lw * Math.min(1, (st.stage + Math.min(1, nxt)) / 4), ly]], I, 1.6)
        G.stages.forEach((nm, i) => { const x = x0 + 4 + lw * i / 4; k.circ(x, ly, i === st.stage ? 3.5 : 2.4, i <= st.stage ? (i === st.stage ? k.a(LAV, 1) : I) : k.a(T.panel, 1), I, 0.8); k.t(nm.slice(0, 3), x, ly + 5, 6.2, i === st.stage ? I : S, { a: "c", w: 26, lines: 1 }) })
      }
      const bars = [["NUTRIENT", st.nut, I], ["VITALITY", st.vit, I], ["STRESS", st.stress, k.a(LAV, 1)]].concat(big ? [["COGNITION", cog, k.a("#7FE3F0", 1)]] : [])
      const by0 = big ? 66 : 42
      bars.forEach(([l, v, c], i) => { const y = by0 + i * 14; k.t(l, x0, y, 6.5, S, { w: rw - 34, lines: 1 }); k.t(`${Math.round(v)}`, x0 + rw, y, 6.8, I, { a: "r", w: 30 }); gBar(k, x0, y + 8, rw, 3.5, v / 100, c, k.ia(0.12)); for (let t = 1; t < 10; t++) k.ln([[x0 + rw * t / 10, y + 8], [x0 + rw * t / 10, y + 11.5]], k.a(T.panel, 0.8), 0.5) })
      // neural trace: EEG drifting with the clock
      const ey = big ? 128 : 86, eh = big ? 18 : 14
      k.t(`NEURAL // ${bpm} BPM`, x0, ey, 6.3, S, { w: rw - 60, lines: 1 }); k.t(inp.charging ? "INTAKE" : st.stress > 60 ? "SPIKING" : "STABLE", x0 + rw, ey, 6.3, inp.charging || st.stress > 60 ? k.a(LAV, 1) : S, { a: "r", w: 56, lines: 1 })
      const tr = []; for (let x = 0; x <= rw; x += 1.5) { const ph = (x + TM * 11) % 52; let y = Math.sin(x * 0.4 + TM) * 1.2 * (1 + st.stress / 60); if (ph > 34 && ph < 42) { const kk = (ph - 34) / 8; y -= Math.sin(kk * Math.PI * 2) * (eh / 2 - 1) * (kk < 0.5 ? 1 : 0.5) } tr.push([x0 + x, ey + 8 + eh / 2 + y]) }
      k.ln([[x0, ey + 8 + eh / 2], [x0 + rw, ey + 8 + eh / 2]], k.ia(0.12), 0.5); k.ln(tr, I, 0.9)
      if (!big) { gLogBlock(k, (st.log || []).slice().reverse(), x0, ey + eh + 11, rw, H - 3, 6.8, "mono", I, S, "· "); return }
      // genome read: a barcode with a read head that moves each refresh
      const gy = 166, gr = k.rng(parseInt(st.lot.replace(/\D/g, "").slice(-4), 10) || 7)
      k.t(`GENOME // ${st.lot}-SEQ`, x0, gy, 6.3, S, { w: rw - 62, lines: 1 }); k.t(`${Math.round(60 + (TM * 3) % 40)}% READ`, x0 + rw, gy, 6.3, S, { a: "r", w: 58, lines: 1 })
      let gx = x0; while (gx < x0 + rw) { const w2 = 0.8 + gr() * 2.4; k.rect(gx, gy + 8, w2, 10, gr() > 0.35 ? I : k.a(LAV, 0.8)); gx += w2 + 0.8 + gr() * 1.4 }
      const rh = x0 + ((TM * 6) % rw); k.rect(rh - 1, gy + 6, 2, 14, k.a(LAV, 1)); k.rect(rh - 6, gy + 6, 12, 14, k.a(LAV, 0.12))
      // physiology readouts
      const ry = 194, cells = [["MASS", `${(0.02 + st.age * 0.015 * (1 + st.stage)).toFixed(2)}mg`], ["MEMBRANE", `${(100 - st.stress * 0.3).toFixed(1)}%`], ["SIGNAL", `${(-40 + st.vit * 0.2).toFixed(1)}dB`], ["CORE", `${(37 + st.stress * 0.02).toFixed(1)}°C`]]
      cells.forEach(([l, v], i) => { const x = x0 + i * rw / 4; k.t(l, x, ry - 1, 6, S, { w: rw / 4 - 3, lines: 1 }); k.t(v, x, ry + 7, 7.3, I, { w: rw / 4 - 3, lines: 1 }) })
      const tl = gT(k, st.traits.length ? `TRAITS // ${st.traits.join(" · ").toUpperCase()}` : "TRAITS // NONE ON FILE", x0, 214, 6.3, k.a(LAV, 1), { w: rw, lines: 2 }).lines
      gLogBlock(k, (st.log || []).slice().reverse(), x0, 216 + tl * 8.5, rw, 263, 6.8, "mono", I, S, "· ")
      // vitality and stress history, with empty cycles shown as a dotted baseline
      const hy = 268, hw = W - 24, hh = 54, hist = st.hist || [], sh = st.shist || []
      k.t("VITALITY + STRESS // LAST 24 CYCLES", 12, hy, 6.5, S, { w: 180, lines: 1 }); k.t(st.stage < 4 ? `NEXT MILESTONE IN ${Math.max(0, G.th[st.stage + 1] - st.age)} CYCLES` : "TERMINAL MORPHOLOGY", W - 12, hy, 6.5, S, { a: "r", w: 150, lines: 1 })
      for (let y = 0; y <= 4; y++) k.ln([[12, hy + 10 + hh * y / 4], [W - 12, hy + 10 + hh * y / 4]], k.ia(0.06), 0.5)
      const bw2 = hw / 24, spts = []
      for (let i = 0; i < 24; i++) { const v = hist[hist.length - 24 + i], x = 12 + i * bw2; if (v == null) { k.ln([[x + 1, hy + 10 + hh], [x + bw2 - 2, hy + 10 + hh]], k.ia(0.25), 0.8); continue } const bh = Math.max(1, hh * v / 100); k.rect(x + 1, hy + 10 + hh - bh, bw2 - 3, bh, i === 23 ? k.a(LAV, 1) : k.ia(0.5)); const sv = sh[sh.length - 24 + i]; if (sv != null) spts.push([x + bw2 / 2, hy + 10 + hh - hh * sv / 100]) }
      if (spts.length > 1) { k.ln(spts, k.a(LAV, 0.9), 1.1); spts.forEach(p => k.circ(p[0], p[1], 1.2, k.a(LAV, 1))) }
      k.ln([[12, hy + 10 + hh], [W - 12, hy + 10 + hh]], I, 0.8)
      const sweep = 12 + ((TM * 4) % hw); k.ln([[sweep, hy + 10], [sweep, hy + 10 + hh]], k.a(LAV, 0.4), 0.7)
      k.t(`LINEAGE // ${st.run - 1} RECYCLED`, 12, H - 13, 6.5, S, { w: 120, lines: 1 }); for (let i = 0; i < Math.min(8, st.run - 1); i++) k.rect(112 + i * 6, H - 11, 4, 5, k.ia(0.4))
      k.t("CHARGE TO FEED · BUSY DAYS STRESS IT · NIGHTS REST", W - 12, H - 13, 6.3, S, { a: "r", w: 196, lines: 1 })
    }
  },

  // DEEP RANGE: an autonomous salvage drone jumping across a sector map
  deeprange: {
    title: "W-10 // SALVAGE RUN",
    init(now, prev) { const run = prev ? prev.run + 1 : 1; return { v: 1, vseed: (now % 99991), game: "deeprange", run, drone: `SR-${String(run).padStart(2, "0")}`, jumps: 0, hull: 100, fuel: 100, cargo: 0, credits: prev ? prev.credits : 0, pos: [0.5, 0.55], trail: [[0.5, 0.55]], status: "LAUNCHED", ev: "launch", best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed: (now % 233280) || 13, last: prev ? prev.last : 0 } },
    right(st, inp) { return inp.charging ? "DOCKED · REFUELING" : `DRONE ${st.drone}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.deeprange
      st.turn++
      if (inp.charging) { st.fuel += 25; st.hull += 12; st.status = "DOCKED"; st.ev = "dock"; gLog(st, "Docked at Relay 07. Refueling, patching hull."); st.fuel = gClamp(st.fuel); st.hull = gClamp(st.hull); return }
      st.jumps++; st.fuel -= 6 + r() * 5
      const a = r() * Math.PI * 2, dist = 0.08 + r() * 0.1, last = st.pos
      st.pos = [Math.max(0.06, Math.min(0.94, last[0] + Math.cos(a) * dist)), Math.max(0.08, Math.min(0.92, last[1] + Math.sin(a) * dist * 0.8))]
      st.trail = (st.trail || []).concat([st.pos]).slice(-14); st.status = "IN TRANSIT"
      const e = r()
      if (e < 0.22) { const c = Math.round(2 + r() * 9); st.cargo += c; st.ev = "derelict"; gLog(st, `Salvaged ${c}t from derelict ${gPick(r, ["FREIGHTER KESTREL", "ORE BARGE 9", "SURVEY POD LACUNA", "THE MERIDIAN", "TUG HALF-MOON"])}.`) }
      else if (e < 0.36) { const d = Math.round(8 + r() * 16); st.hull -= d; st.ev = "rocks"; gLog(st, `Asteroid field. Hull -${d}%.`) }
      else if (e < 0.46) { st.ev = "signal"; gLog(st, `Signal decoded: "${gPick(r, ["IS ANYONE GETTING THESE", "DO NOT DOCK AT 9", "WE FOUND IT", "COORDINATES ATTACHED", "TELL MY CAT"])}"`) }
      else if (e < 0.54) { st.fuel += 18; st.ev = "fuel"; gLog(st, "Fuel cache recovered. +18%.") }
      else if (e < 0.62) { const d = Math.round(10 + r() * 15); st.hull -= d; st.cargo = Math.floor(st.cargo * 0.7); st.ev = "pirate"; gLog(st, `Pirate ping. Evasive burn. Hull -${d}%, cargo dumped.`) }
      else if (e < 0.72 && st.cargo > 5) { const cr = st.cargo * 12; st.credits += cr; st.cargo = 0; st.ev = "sell"; gLog(st, `Sold salvage at waystation. +${cr} CR.`) }
      else { st.ev = "void"; gLog(st, gPick(r, ["Quiet jump. Nothing but static.", "Passed a dead satellite. Waved.", "Long-range scan: empty. Suspiciously empty."])) }
      st.fuel = gClamp(st.fuel); st.hull = gClamp(st.hull)
      if (st.hull <= 0 || st.fuel <= 0) { const why = st.hull <= 0 ? `CONTACT LOST. ${st.drone} destroyed after ${st.jumps} jumps.` : `${st.drone} out of fuel. Drifting. Beacon active.`; const best = Math.max(st.best || 0, st.jumps); Object.assign(st, G.init(Date.now(), st)); st.best = best; gLog(st, why); gLog(st, `${st.drone} launched.`) }
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const TM = Date.now() / 60000, small = W < 200, big = H > 200, mx = 10, my = 6, mw = small ? W - 20 : big ? W - 20 : 206, mh = small ? 86 : big ? 190 : H - 14
      const Y = k.a(T.accent, 1), R = k.H, B = k.a(T.altBg, 1), I = k.I
      k.rect(mx, my, mw, mh, k.ia(0.03), k.ia(0.3), 0.8)
      for (let gx = mx; gx <= mx + mw; gx += mw / 8) k.ln([[gx, my], [gx, my + mh]], k.ia(0.07), 0.5)
      for (let gy = my; gy <= my + mh; gy += mh / 6) k.ln([[mx, gy], [mx + mw, gy]], k.ia(0.07), 0.5)
      const rs = k.rng(st.run * 31); for (let i = 0; i < (big ? 90 : 45); i++) k.circ(mx + rs() * mw, my + rs() * mh, 0.4 + rs() * 0.8, k.ia(0.15 + rs() * 0.5 * Math.abs(Math.sin(TM / 7 + i))))
      k.arc(mx + mw, my + mh + 30, 70, Math.PI * 1.16, Math.PI * 1.46, B, 1.4); k.arc(mx + mw, my + mh + 30, 60, Math.PI * 1.2, Math.PI * 1.44, k.a(T.altBg, 0.4), 0.8)
      const P = (p) => [mx + p[0] * mw, my + p[1] * mh], tr = (st.trail || []).map(P)
      if (tr.length > 1) { k.ln(tr, k.a(T.accent, 0.3), 3); k.ln(tr, Y, 1.2) }
      tr.forEach((p, i) => { if (i < tr.length - 1) k.rect(p[0] - 1.5, p[1] - 1.5, 3, 3, k.ia(0.6)) })
      const cur = tr[tr.length - 1] || P(st.pos), prev = tr[tr.length - 2] || [cur[0] - 1, cur[1]], ang = Math.atan2(cur[1] - prev[1], cur[0] - prev[0])
      k.circ(cur[0], cur[1], 7 + (TM % 4), null, k.a(T.accent, Math.max(0, 0.6 - (TM % 4) * 0.15)), 1)
      gDrone(k, cur[0], cur[1], ang, gVar(st, 1, 5), [Y, B, k.a("#FFFFFF", 0.95), Y, B][gVar(st, 3, 5)], I)
      const ex = cur[0] + 10, ey = cur[1] - 12
      if (st.ev === "derelict") k.rect(ex, ey, 8, 5, null, I, 0.8)
      if (st.ev === "rocks") for (let i = 0; i < 4; i++) k.circ(ex + i * 4, ey + (i % 2) * 3, 1.6, k.ia(0.7))
      if (st.ev === "pirate") k.poly([[ex, ey], [ex + 8, ey + 3], [ex, ey + 6]], R)
      if (st.ev === "dock") { k.rect(cur[0] - 10, cur[1] + 6, 20, 4, null, B, 1); k.t("RELAY 07", cur[0], cur[1] + 12, 5.5, B, { a: "c", w: 40 }) }
      if (st.ev === "signal") for (let i = 1; i <= 3; i++) k.arc(cur[0], cur[1], 6 + i * 4, -0.8, 0.2, k.a(T.accent, 0.7), 0.7)
      k.t(`SECTOR 07 // RUN ${st.run}`, mx + 5, my + 4, 6, k.S, { w: 120 })
      // readouts
      const bars = [["HULL", st.hull, st.hull < 30 ? R : I], ["FUEL", st.fuel, st.fuel < 25 ? R : Y]]
      if (small) { bars.forEach(([l, v, c], i) => { const y = my + mh + 6 + i * 13; k.t(`${l} ${Math.round(v)}%`, mx, y, 6.5, I, { w: 70 }); gBar(k, mx + 62, y + 2, W - mx * 2 - 62, 5, v / 100, c, k.ia(0.12)) }); return }
      const x0 = big ? mx : mx + mw + 12, y0 = big ? my + mh + 10 : my, rw = big ? W - 20 : W - x0 - 10
      k.t(inp.charging ? "DOCKED // REFUELING" : st.status, x0, y0, 6.5, inp.charging ? B : R, { f: "bold", w: rw })
      k.t(st.drone, x0, y0 + 9, big ? 22 : 18, I, { f: "heavy", w: big ? 104 : rw, lines: 1 }); k.t(`"${['KESTREL', 'MULE', 'HALO', 'OXBOW', 'MOTH', 'WREN'][gVar(st, 2, 6)]}" · ${['DART', 'HAULER', 'RING', 'TWIN-BOOM', 'SAUCER'][gVar(st, 1, 5)]} HULL`, x0, y0 + (big ? 31 : 28), 6, k.S, { w: big ? 104 : rw, lines: 1 })
      if (big) {
        ;[["JUMPS", st.jumps], ["CARGO", `${st.cargo}t`], ["CREDITS", st.credits], ["BEST RUN", `${st.best} J`]].forEach(([l, v], i) => { const x = x0 + 110 + i * 62; k.t(l, x, y0, 6, k.S, { w: 60 }); k.t(String(v), x, y0 + 10, 11, I, { f: "heavy", w: 60 }) })
        bars.forEach(([l, v, c], i) => { const y = y0 + 43 + i * 14; k.t(l, x0, y, 6.5, k.S, { w: 40 }); gBar(k, x0 + 40, y + 2, rw - 80, 6, v / 100, c, k.ia(0.12)); k.t(`${Math.round(v)}%`, x0 + rw, y, 7, I, { a: "r", w: 36, f: "bold" }) })
        gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + 76, rw, H - 4, 7.2, "mono", I, k.S, "> ")
        return
      }
      bars.forEach(([l, v, c], i) => { const y = y0 + 34 + i * 14; k.t(l, x0, y, 6.5, k.S, { w: 40 }); gBar(k, x0 + 30, y + 2, rw - 64, 5, v / 100, c, k.ia(0.12)); k.t(`${Math.round(v)}%`, x0 + rw, y, 6.5, I, { a: "r", w: 34, f: "bold" }) })
      k.t(`JUMPS ${st.jumps} · CARGO ${st.cargo}t · ${st.credits} CR`, x0, y0 + 64, 6.5, I, { w: rw })
      gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + 78, rw, H - 3, 6.8, "mono", I, k.S, "> ")
    }
  },

  // THE LONG ROAD: a traveller walking the map, keeping a journal
  longroad: {
    title: "W-10 // The Expedition",
    places: ["Brindle", "The Lantern Inn", "Pinewatch", "Calder Ruins", "Fenwick Marsh", "Ashwood", "Old Tower", "Sheepcote Hills", "Hollowmere", "Greyhallow Fells", "The Grey Sound"],
    names: ["Wren of Brindle", "Old Tamsin", "Pip Ashcombe", "Hollis the Tinker", "Marigold Fenn", "Brother Oswin", "Ada Stillwater", "Cob the Younger"],
    init(now, prev) { const G = GAMES.longroad, run = prev ? prev.run + 1 : 1, seed = (now % 233280) || 17; return { v: 1, vseed: (now % 99991), game: "longroad", run, name: G.names[(seed + run) % G.names.length], day: 1, miles: 0, hp: 10, food: 8, gold: 5, place: "Brindle", pi: 0, camp: false, items: [], best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed, last: prev ? prev.last : 0 } },
    right(st, inp) { return st.camp ? "Camped" : `Day ${st.day}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.longroad, night = inp.hour < 6 || inp.hour >= 22
      st.turn++; if (st.turn % 4 === 0) st.day++
      if (inp.charging || night) { st.camp = true; st.hp = Math.min(10, st.hp + (inp.charging ? 2 : 1)); st.food -= 1; gLog(st, inp.charging ? "Rested by a roaring fire. Wounds mended." : "Made camp under the stars. Slept well enough.") }
      else {
        st.camp = false; const m = Math.round(4 + r() * 9); st.miles += m; st.food -= 1
        const e = r()
        if (e < 0.18) { st.pi = (st.pi + 1) % G.places.length; st.place = G.places[st.pi]; if (st.gold >= 2) { st.gold -= 2; st.food += 3; gLog(st, `Reached ${st.place}. Bought bread and cheese.`) } else gLog(st, `Reached ${st.place}. Too poor for supper.`) }
        else if (e < 0.3) { const d = 1 + Math.floor(r() * 3), g = Math.min(st.gold, 3); st.hp -= d; st.gold -= g; gLog(st, `Bandits on the road! Lost ${g} gold and some dignity.`) }
        else if (e < 0.38) { st.hp -= 2; gLog(st, "Wolves at dusk. Escaped with scratches.") }
        else if (e < 0.46) { st.hp += 2; gLog(st, "A wayside shrine. Left a coin, felt lighter.") }
        else if (e < 0.56) { const g = 2 + Math.floor(r() * 5); st.gold += g; gLog(st, `Found a purse in the ditch. ${g} gold richer.`) }
        else if (e < 0.62 && st.gold >= 4) { const it = gPick(r, ["a better cloak", "a lucky charm", "boots that fit", "a map with fewer lies", "a tin whistle"]); st.gold -= 4; st.items = (st.items || []).concat([it]).slice(-4); gLog(st, `A merchant sold me ${it}.`) }
        else if (e < 0.68) gLog(st, "Heard talk of a dragon in the Fells. Probably sheep.")
        else if (e < 0.74) { st.miles = Math.max(0, st.miles - 2); gLog(st, "Rain all day. The road became a river.") }
        else gLog(st, gPick(r, [`Walked ${m} miles. The road went on.`, `Walked ${m} miles. A crow followed me most of them.`, `Walked ${m} miles. Sang badly. Nobody complained.`]))
      }
      if (st.food <= 0) { st.food = 0; st.hp -= 1; gLog(st, "Nothing to eat. Belt tightened another notch.") }
      st.hp = Math.max(0, Math.min(10, st.hp))
      if (st.hp <= 0) { const name = st.name, best = Math.max(st.best || 0, st.miles); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `${name} was laid to rest beneath an oak.`); gLog(st, `${st.name} sets out from Brindle.`) }
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const TM = Date.now() / 60000, small = W < 200, big = H > 200, I = k.I, RED = k.a(T.accent, 1)
      const mx = 10, my = 6, mw = small ? W - 20 : big ? W - 20 : 196, mh = small ? 78 : big ? 150 : H - 14
      k.rect(mx, my, mw, mh, k.a(T.panel, 0.6), I, 1); k.rect(mx + 3, my + 3, mw - 6, mh - 6, null, k.ia(0.35), 0.5)
      const rs = k.rng(st.run * 13 + 5), road = []
      for (let i = 0; i <= 20; i++) { const t = i / 20; road.push([mx + 10 + t * (mw - 20), my + mh * 0.55 + Math.sin(t * 6 + st.run) * mh * 0.18]) }
      for (let i = 0; i < (big ? 18 : 10); i++) { const x = mx + 12 + rs() * (mw - 24), y = my + 10 + rs() * (mh - 20), kind = rs(); if (Math.abs(y - (my + mh * 0.55)) < 12 || (y < my + 24 && x < mx + 100)) continue; if (kind < 0.4) k.poly([[x, y - 7], [x + 4, y + 2], [x - 4, y + 2]], k.ia(0.8)); else if (kind < 0.7) k.arc(x, y + 3, 7, Math.PI, Math.PI * 2, k.ia(0.6), 0.9); else { k.rect(x - 3, y - 2, 6, 5, k.PN, I, 0.7); k.poly([[x - 4, y - 2], [x, y - 6], [x + 4, y - 2]], null, I, 0.7) } }
      for (let i = 0; i < road.length - 1; i++) if (i % 2 === 0) k.ln([road[i], road[i + 1]], RED, 1.3)
      const prog = ((st.miles % 60) / 60), pi = Math.min(19, Math.floor(prog * 20)), tt = prog * 20 - pi, px = road[pi][0] + (road[pi + 1][0] - road[pi][0]) * tt, py = road[pi][1] + (road[pi + 1][1] - road[pi][1]) * tt
      if (st.camp) { for (let i = 0; i < 3; i++) k.poly([[px - 3 + i * 3, py - 2], [px - 1.5 + i * 3, py - 8 - Math.sin(TM + i) * 2], [px + i * 3, py - 2]], k.a(i === 1 ? "#E08A2E" : T.accent, 1)); k.ln([[px - 5, py], [px + 5, py - 2]], I, 1.2) }
      else gTraveller(k, px, py + 2, small ? 0.75 : big ? 1.15 : 0.9, { cloak: gVar(st, 11, 4), hat: gVar(st, 12, 4), comp: gVar(st, 13, 5), carry: gVar(st, 14, 3) }, I, RED)
      k.t(st.place, mx + 8, my + 5, 8.5, I, { f: "disp", w: mw - 16 })
      const hearts = (x, y, s) => { for (let i = 0; i < 10; i++) { const hx = x + i * (s + 2), on = i < st.hp; k.circ(hx + s * 0.28, y + s * 0.3, s * 0.28, on ? RED : null, RED, 0.6); k.circ(hx + s * 0.72, y + s * 0.3, s * 0.28, on ? RED : null, RED, 0.6); k.poly([[hx + 0.5, y + s * 0.4], [hx + s / 2, y + s], [hx + s - 0.5, y + s * 0.4]], on ? RED : null, RED, 0.6) } }
      if (small) { hearts(mx, my + mh + 6, 7); k.t(`Day ${st.day} · ${st.miles} mi`, mx, my + mh + 18, 9, I, { f: "disp", w: W - 20 }); return }
      const x0 = big ? mx : mx + mw + 12, y0 = big ? my + mh + 8 : my, rw = big ? W - 20 : W - x0 - 10
      k.t(st.name, x0, y0, big ? 15 : 12, I, { f: "disp", w: rw })
      k.t(`Day ${st.day} · ${st.miles} mi${st.best ? " · best " + st.best + " mi" : ""}`, x0, y0 + (big ? 18 : 15), 8, k.S, { f: "disp", w: rw })
      hearts(x0, y0 + (big ? 32 : 28), big ? 9 : 7)
      const COMP = ['', 'a dog', 'a crow', 'a donkey', 'a cat'][gVar(st, 13, 5)]; k.t(`Bread ${st.food} · Gold ${st.gold}${big && COMP ? " · travelling with " + COMP : ""}`, x0, y0 + (big ? 46 : 39), 8.5, I, { f: "disp", w: rw })
      gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + (big ? 62 : 53), rw, big ? H - 22 : H - 3, big ? 9.5 : 8.5, "disp", I, k.S, "")
      if (big) k.t("Charge the phone to make camp. Nights are spent by the fire.", W / 2, H - 14, 8, k.S, { f: "disp", a: "c", w: W - 20 })
    }
  }
}
function gameSample(f) {
  const G = GAMES[f]; if (!G) return null
  const st = G.init(86400000 * 7 + 4242); const ins = []
  for (let i = 0; i < 26; i++) { const inp = { charging: i % 9 === 4, batt: 0.7, hour: 9 + (i % 10), busy: i % 5 === 0 ? 5 : 1 }; G.step(st, inp); ins.push(inp) }
  return { st, inp: ins[ins.length - 1] }
}
