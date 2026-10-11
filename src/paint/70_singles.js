// ---------- single-app widgets: YouTube, Instagram, Discord, each its own in-world object ----------
const sRng = (d, salt) => { let s = Math.abs(Math.floor(d.seed * 131 + salt * 977)) % 233280 || 11; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
const pick2 = (r, a) => a[Math.floor(r() * a.length) % a.length]
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

// HALCYON (calm lab)
HAL.yt = (k, W, H, d) => {
  const r = sRng(d, 1), small = W < 200
  k.t("CULTURE FEED // QUEUED FOR YOU", 12, 8, 7, k.S, { w: W - 24 })
  const n = small ? 2 : 4, tw = small ? (W - 30) / 2 : 74, th2 = small ? 40 : 46
  for (let i = 0; i < n; i++) { const x = 12 + i * (tw + 8), y = 22; k.rect(x, y, tw, th2, k.a(T.altBg, 0.12 + i * 0.05), k.ia(0.35), 0.8); k.circ(x + tw / 2, y + th2 / 2, 9, null, k.ia(0.5), 1); k.poly([[x + tw / 2 - 3, y + th2 / 2 - 5], [x + tw / 2 + 6, y + th2 / 2], [x + tw / 2 - 3, y + th2 / 2 + 5]], k.I); k.rect(x, y + th2 - 3, tw * (0.2 + r() * 0.7), 3, k.I); k.t(mmss(120 + r() * 900), x + tw - 3, y + 3, 6, k.S, { a: "r", w: 40 }) }
  if (small) { k.t(`${3 + Math.floor(r() * 9)} APPROVED`, 12, H - 30, 9, k.I, { f: "disp", w: W - 24 }); k.t("AUTOPLAY: ON", 12, H - 14, 6.5, k.S, { w: W - 24 }); return }
  k.t(pick2(r, ["Twelve minutes of calm, pre-selected.", "Your feed has been gently curated.", "Recommended for your mood tier.", "Approved content, warmly delivered."]), 12, 76, 13, k.I, { f: "disp", w: W - 24 })
  const pts = []; for (let x = 0; x <= W - 24; x += 4) pts.push([12 + x, 120 - Math.exp(-x / 90) * 22 - 4]); k.ln(pts, k.A, 1.4)
  k.t("RETENTION", 12, 124, 6.5, k.S, { w: 80 }); k.t(`SESSION ${mmss(300 + r() * 1800)} · CALM INDEX ${60 + Math.floor(r() * 35)}`, W - 12, 124, 6.5, k.S, { a: "r", w: 220 })
}
// a shuffled order of n things for a given seed: galleries show different subjects every refresh, never the same one twice in a view
function gShuf(seed, n) { let v = Math.abs(Math.floor(seed * 7919 + 13)) % 233280 || 7; const rr = () => { v = (v * 9301 + 49297) % 233280; return v / 233280 }; const a = []; for (let i = 0; i < n; i++) a.push(i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t } return a }
// HALCYON: abstract organisms on file, clinical and a little sinister
function halOrganism(k, kind, cx, cy, z) {
  const A = k.a(T.accent, 1), F = k.a(T.accent, 0.28), I = k.ia(0.75), lw = 0.8
  if (kind === 0) { k.circ(cx, cy, 15 * z, F, I, lw); k.circ(cx + 2 * z, cy - 1 * z, 6 * z, k.a(T.accent, 0.65), I, 0.6); ;[[-8, 6], [7, 8], [-5, -9], [9, -6], [-10, -2]].forEach(([u, v]) => k.circ(cx + u * z, cy + v * z, 1.4 * z, I)) }
  else if (kind === 1) { const P = [[0, 0], [8, 0], [-8, 0], [4, 7], [-4, 7], [4, -7], [-4, -7]]; P.forEach(([u, v], i) => k.circ(cx + u * z, cy + v * z, 4.6 * z, i % 2 ? F : k.a(T.accent, 0.5), I, 0.6)); k.circ(cx, cy, 1.4 * z, I) }
  else if (kind === 2) { const a1 = [], a2 = []; for (let i = 0; i <= 30; i++) { const t = i / 30, x = cx - 17 * z + 34 * z * t, ph = t * Math.PI * 3; a1.push([x, cy + 8 * z * Math.sin(ph)]); a2.push([x, cy - 8 * z * Math.sin(ph)]); if (i % 3 === 0) k.ln([[x, cy + 8 * z * Math.sin(ph)], [x, cy - 8 * z * Math.sin(ph)]], F, 1.2) } k.ln(a1, A, 1.2); k.ln(a2, I, 1.2) }
  else if (kind === 3) { k.circ(cx, cy, 16 * z, F, I, lw); k.circ(cx, cy, 10 * z, null, I, 0.6); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; k.ln([[cx + 10 * z * Math.cos(a), cy + 10 * z * Math.sin(a)], [cx + 16 * z * Math.cos(a), cy + 16 * z * Math.sin(a)]], I, 0.6); k.circ(cx + 13 * z * Math.cos(a + 0.26), cy + 13 * z * Math.sin(a + 0.26), 1 * z, A) } k.circ(cx, cy, 3 * z, A) }
  else if (kind === 4) { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3, m = [cx + 9 * z * Math.cos(a), cy + 9 * z * Math.sin(a)], e1 = [cx + 17 * z * Math.cos(a - 0.3), cy + 17 * z * Math.sin(a - 0.3)], e2 = [cx + 17 * z * Math.cos(a + 0.3), cy + 17 * z * Math.sin(a + 0.3)]; k.ln([[cx, cy], m, e1], I, 0.8); k.ln([m, e2], I, 0.8); k.circ(e1[0], e1[1], 1 * z, A) } k.circ(cx, cy, 5 * z, k.a(T.accent, 0.6), I, lw) }
  else if (kind === 5) { k.poly(k.arcPts(cx, cy - 2 * z, 13 * z, Math.PI, Math.PI * 2, 16).concat([[cx + 13 * z, cy - 2 * z]]), F, I, lw); for (let i = 0; i < 5; i++) { const x0 = cx - 10 * z + i * 5 * z, pts = []; for (let j = 0; j <= 10; j++) pts.push([x0 + Math.sin(j * 0.9 + i) * 1.6 * z, cy - 2 * z + j * 1.9 * z]); k.ln(pts, i % 2 ? A : I, 0.7) } }
  else if (kind === 6) { [[0, 0], [7, 4], [-7, 4], [0, 8], [7, -4], [-7, -4], [0, -8]].forEach(([u, v], i) => k.hex(cx + u * z, cy + v * z, 4.2 * z, i ? F : k.a(T.accent, 0.6), I, 0.6)) }
  else if (kind === 7) { for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; k.ln([[cx + 9 * z * Math.cos(a), cy + 9 * z * Math.sin(a)], [cx + 15 * z * Math.cos(a), cy + 15 * z * Math.sin(a)]], I, 0.7); k.circ(cx + 15.5 * z * Math.cos(a), cy + 15.5 * z * Math.sin(a), 1 * z, A) } k.circ(cx, cy, 9 * z, F, I, lw) }
  else if (kind === 8) { const pts = []; for (let i = 0; i <= 20; i++) pts.push([cx + 5 * z + i * 0.7 * z, cy + Math.sin(i * 0.8) * 3 * z]); k.ln(pts, I, 0.8); k.ell(cx - 5 * z, cy, 10 * z, 6.5 * z, F, I, lw); k.circ(cx - 8 * z, cy - 1 * z, 2.4 * z, k.a(T.accent, 0.7)) }
  else if (kind === 9) { k.circ(cx - 6 * z, cy, 9.5 * z, F, I, lw); k.circ(cx + 6 * z, cy, 9.5 * z, F, I, lw); ;[-1, 1].forEach(sd => { k.ln([[cx + sd * 6 * z - 2.5 * z, cy - 2.5 * z], [cx + sd * 6 * z + 2.5 * z, cy + 2.5 * z]], A, 1.1); k.ln([[cx + sd * 6 * z + 2.5 * z, cy - 2.5 * z], [cx + sd * 6 * z - 2.5 * z, cy + 2.5 * z]], A, 1.1) }) }
  else if (kind === 10) { k.circ(cx, cy, 14 * z, F, I, lw); k.circ(cx, cy, 7 * z, k.a(T.panel, 1), I, lw); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; k.ln([[cx + 14 * z * Math.cos(a), cy + 14 * z * Math.sin(a)], [cx + 17 * z * Math.cos(a), cy + 17 * z * Math.sin(a)]], I, 0.6) } }
  else { for (let i = 0; i < 7; i++) { const t = i / 6, x = cx - 15 * z + t * 30 * z, y = cy + Math.sin(t * Math.PI * 1.6) * 7 * z; if (i) k.ln([[cx - 15 * z + (i - 1) / 6 * 30 * z, cy + Math.sin((i - 1) / 6 * Math.PI * 1.6) * 7 * z], [x, y]], I, 0.7); k.circ(x, y, 3.4 * z, i % 2 ? F : k.a(T.accent, 0.55), I, 0.6) } }
}
// DIRECTIVE: civilian dossier photos, each subject kitted out differently
function dirSubject(k, kind, x, y, cw, ch) {
  const cx = x + cw / 2, hy = y + ch * 0.38, hr = cw * 0.14, I = k.ia(0.7), F = k.ia(0.22), H = k.H
  for (let j = 1; j < 6; j++) k.ln([[x + 3, y + j * ch / 7], [x + cw - 3, y + j * ch / 7]], k.ia(0.07), 0.5)
  if (kind === 5) k.poly(k.arcPts(cx, hy + hr * 0.2, hr * 1.55, Math.PI * 0.95, Math.PI * 2.05, 16).concat([[cx + hr * 1.5, hy + hr * 1.6], [cx - hr * 1.5, hy + hr * 1.6]]), k.ia(0.3), I, 0.8)
  if (kind === 8) k.poly([[cx - hr * 1.15, hy - hr * 0.3], [cx + hr * 1.15, hy - hr * 0.3], [cx + hr * 1.3, hy + hr * 1.9], [cx - hr * 1.3, hy + hr * 1.9]], k.ia(0.3), I, 0.6)
  k.poly([[cx - cw * 0.36, y + ch * 0.86], [cx - cw * 0.3, y + ch * 0.66], [cx - hr * 0.55, y + ch * 0.6], [cx + hr * 0.55, y + ch * 0.6], [cx + cw * 0.3, y + ch * 0.66], [cx + cw * 0.36, y + ch * 0.86]], F, I, 0.8)
  k.circ(cx, hy, hr, kind === 5 ? k.ia(0.45) : F, I, 0.8)
  const eye = hy - hr * 0.1
  if (kind === 0) { k.circ(cx - hr * 0.42, eye, hr * 0.28, null, I, 0.9); k.circ(cx + hr * 0.42, eye, hr * 0.28, null, I, 0.9); k.ln([[cx - hr * 0.14, eye], [cx + hr * 0.14, eye]], I, 0.8) }
  else if (kind === 1) { k.circ(cx - hr * 0.42, eye, hr * 0.3, k.a(T.accent, 0.5), I, 0.8); k.circ(cx + hr * 0.42, eye, hr * 0.3, k.a(T.accent, 0.5), I, 0.8); k.circ(cx, hy + hr * 0.62, hr * 0.42, k.ia(0.5), I, 0.8); for (let j = -1; j <= 1; j++) k.ln([[cx - hr * 0.25, hy + hr * 0.62 + j * hr * 0.16], [cx + hr * 0.25, hy + hr * 0.62 + j * hr * 0.16]], k.ia(0.8), 0.5) }
  else if (kind === 2) { k.poly(k.arcPts(cx, hy - hr * 0.25, hr * 1.12, Math.PI, Math.PI * 2, 14), k.a(T.headBg, 0.9), I, 0.8); k.rect(cx - hr * 1.45, hy - hr * 0.3, hr * 2.9, hr * 0.28, k.a(T.headBg, 0.9), I, 0.6) }
  else if (kind === 3) { k.poly(k.arcPts(cx, hy - hr * 0.1, hr * 1.25, Math.PI * 0.92, Math.PI * 2.08, 14), k.ia(0.45), I, 0.8); k.ln([[cx - hr * 0.95, hy + hr * 0.2], [cx - hr * 0.4, hy + hr * 1.05], [cx + hr * 0.4, hy + hr * 1.05], [cx + hr * 0.95, hy + hr * 0.2]], I, 0.6) }
  else if (kind === 4) { k.ell(cx - hr * 0.25, hy - hr * 0.85, hr * 1.15, hr * 0.42, k.a(T.altBg, 0.85), I, 0.7); k.circ(cx + hr * 0.45, hy - hr * 0.9, hr * 0.16, H) }
  else if (kind === 5) { k.circ(cx - hr * 0.35, eye, hr * 0.1, H); k.circ(cx + hr * 0.35, eye, hr * 0.1, H) }
  else if (kind === 6) { k.arc(cx, hy, hr * 1.18, Math.PI * 1.05, Math.PI * 1.95, I, 1.6); k.rect(cx - hr * 1.3, hy - hr * 0.2, hr * 0.32, hr * 0.6, I); k.ln([[cx - hr * 1.15, hy + hr * 0.35], [cx - hr * 0.3, hy + hr * 0.75]], I, 0.8); k.circ(cx - hr * 0.3, hy + hr * 0.75, hr * 0.12, H) }
  else if (kind === 7) { k.rect(cx - hr * 1.02, hy - hr * 0.72, hr * 2.04, hr * 0.26, I); k.circ(cx - hr * 0.42, hy - hr * 0.6, hr * 0.3, k.a(T.accent, 0.55), I, 0.7); k.circ(cx + hr * 0.42, hy - hr * 0.6, hr * 0.3, k.a(T.accent, 0.55), I, 0.7) }
  else if (kind === 8) { k.poly(k.arcPts(cx, hy - hr * 0.05, hr * 1.05, Math.PI * 1.05, Math.PI * 1.95, 12).concat([[cx + hr * 0.4, hy - hr * 0.6], [cx - hr * 0.4, hy - hr * 0.6]]), k.ia(0.4)) }
  else { k.poly(k.arcPts(cx, hy - hr * 0.3, hr * 1.02, Math.PI, Math.PI * 2, 12), k.ia(0.5), I, 0.7); k.rect(cx, hy - hr * 0.42, hr * 1.4, hr * 0.22, k.ia(0.5)); k.poly([[cx - hr * 0.8, hy + hr * 0.25], [cx + hr * 0.8, hy + hr * 0.25], [cx + hr * 0.5, hy + hr * 1.15], [cx, hy + hr * 1.35], [cx - hr * 0.5, hy + hr * 1.15]], k.ia(0.45), I, 0.6) }
}
// LONG ROAD: portraits of the village, each a different face in ink
const LR_FOLK = ["The Baker", "The Miller's Son", "Old Maud", "A Stranger", "The Smith", "The Bard", "The Innkeeper", "The Ranger", "The Knight", "The Herbalist"]
function lrPortrait(k, kind, cx, oy) {
  const I = k.I, S = k.ia(0.55), skin = k.a(T.panel, 1), lw = 0.8, coat = [k.a("#8B6A44", 0.9), k.a(T.accent, 0.75), k.ia(0.35), k.a("#5E7A44", 0.85)]
  const shoulders = (col) => k.poly(k.arcPts(cx, oy + 30, 18, Math.PI * 1.08, Math.PI * 1.92, 12).concat([[cx + 17, oy + 26], [cx - 17, oy + 26]]), col, I, lw)
  const face = (rx, ry) => k.ell(cx, oy - 2, rx || 7, ry || 8.5, skin, I, lw)
  const eyes = (c) => { k.circ(cx - 2.6, oy - 3, 0.8, c || I); k.circ(cx + 2.6, oy - 3, 0.8, c || I) }, nose = () => k.ln([[cx, oy - 2], [cx - 0.8, oy + 1], [cx + 0.4, oy + 1.4]], S, 0.6), mouth = () => k.arc(cx, oy + 2.6, 2, 0.5, Math.PI - 0.5, I, 0.6)
  if (kind === 0) { shoulders(coat[2]); face(); eyes(); nose(); mouth(); k.ell(cx, oy - 11, 9.5, 5, k.a("#F4EEDF", 1), I, lw); k.circ(cx - 4, oy + 1, 1.2, k.a(T.accent, 0.35)); k.circ(cx + 4, oy + 1, 1.2, k.a(T.accent, 0.35)); ;[[-10, 18], [6, 21], [12, 16]].forEach(([u, v]) => k.circ(cx + u, oy + v, 0.7, k.a("#FFFFFF", 0.9))) }
  else if (kind === 1) { shoulders(coat[0]); face(6.5, 8); eyes(); nose(); mouth(); k.poly([[cx - 8, oy - 7], [cx + 8, oy - 7], [cx + 6, oy - 12], [cx - 6, oy - 12]], k.ia(0.55), I, lw); k.rect(cx - 10, oy - 8, 13, 1.6, k.ia(0.55)); ;[[-3.5, 0], [-2.2, 1.2], [3.2, 0.4], [4.2, -0.6]].forEach(([u, v]) => k.circ(cx + u, oy + v, 0.4, k.a("#8B6A44", 1))) }
  else if (kind === 2) { k.poly([[cx - 16, oy + 26], [cx - 13, oy + 12], [cx, oy + 15], [cx + 13, oy + 12], [cx + 16, oy + 26]], coat[1], I, lw); face(6.5, 8); eyes(); nose(); k.ln([[cx - 1.6, oy + 3], [cx + 1.6, oy + 3]], I, 0.6); k.poly([[cx - 9, oy - 2], [cx - 8, oy - 9], [cx, oy - 12], [cx + 8, oy - 9], [cx + 9, oy - 2], [cx + 6, oy + 6], [cx + 3, oy + 7], [cx + 6, oy - 4], [cx, oy - 9], [cx - 6, oy - 4], [cx - 3, oy + 7], [cx - 6, oy + 6]], k.a("#8B6A44", 0.85), I, lw); k.ln([[cx - 4, oy - 5.5], [cx - 2, oy - 5]], S, 0.4); k.ln([[cx + 2, oy - 5], [cx + 4, oy - 5.5]], S, 0.4) }
  else if (kind === 3) { shoulders(k.ia(0.5)); k.poly(k.arcPts(cx, oy, 11, Math.PI * 0.9, Math.PI * 2.1, 16).concat([[cx + 13, oy + 16], [cx - 13, oy + 16]]), k.ia(0.6), I, lw); k.ell(cx, oy + 1, 6, 7.5, k.ia(0.85)); k.circ(cx - 2.4, oy - 1, 0.9, k.a("#F2B33D", 1)); k.circ(cx + 2.4, oy - 1, 0.9, k.a("#F2B33D", 1)) }
  else if (kind === 4) { shoulders(coat[0]); k.ln([[cx - 6, oy + 13], [cx - 4, oy + 26]], k.a("#5A3A22", 1), 1.4); k.ln([[cx + 6, oy + 13], [cx + 4, oy + 26]], k.a("#5A3A22", 1), 1.4); face(7.5, 8.5); k.arc(cx - 2, oy - 8, 3, Math.PI * 1.1, Math.PI * 1.6, k.a("#FFFFFF", 0.8), 0.8); eyes(); nose(); k.poly([[cx - 7, oy + 0], [cx + 7, oy + 0], [cx + 6, oy + 9], [cx, oy + 13], [cx - 6, oy + 9]], k.a("#5A3A22", 0.9), I, lw); k.arc(cx, oy + 3, 1.8, 0.4, Math.PI - 0.4, k.a(T.panel, 1), 0.6) }
  else if (kind === 5) { shoulders(coat[1]); k.ln([[cx + 8, oy + 24], [cx + 18, oy - 2]], k.a("#8B6A44", 1), 1.6); ;[0, 1, 2].forEach(j => k.ln([[cx + 16 - j * 0.8, oy + 3 + j * 2], [cx + 19 - j * 0.8, oy + 4 + j * 2]], I, 0.5)); face(); eyes(); nose(); k.ln([[cx - 4, oy + 1.5], [cx - 1, oy + 0.6], [cx + 1, oy + 0.6], [cx + 4, oy + 1.5]], I, 0.8); k.ell(cx + 1, oy - 10, 9, 3.4, k.a(T.accent, 0.8), I, lw); k.ln(nCurve([[cx + 6, oy - 11], [cx + 12, oy - 18], [cx + 16, oy - 17]], 4), k.a("#5E7A44", 1), 1.2) }
  else if (kind === 6) { shoulders(k.a("#F4EEDF", 1)); k.ln([[cx - 5, oy + 12], [cx - 5, oy + 26]], I, 0.6); k.ln([[cx + 5, oy + 12], [cx + 5, oy + 26]], I, 0.6); face(8.5, 8.5); eyes(); nose(); k.poly([[cx - 6, oy + 1], [cx, oy + 0], [cx + 6, oy + 1], [cx + 5, oy + 3], [cx, oy + 1.6], [cx - 5, oy + 3]], k.ia(0.65)); k.arc(cx, oy - 2, 8.6, Math.PI * 1.1, Math.PI * 1.35, k.ia(0.6), 1.6); k.arc(cx, oy - 2, 8.6, Math.PI * 1.65, Math.PI * 1.9, k.ia(0.6), 1.6) }
  else if (kind === 7) { shoulders(coat[3]); k.arc(cx - 12, oy + 8, 15, -0.9, 0.9, k.a("#8B6A44", 1), 1.1); k.poly(k.arcPts(cx, oy - 1, 10.5, Math.PI * 0.95, Math.PI * 2.05, 16).concat([[cx + 11, oy + 13], [cx - 11, oy + 13]]), coat[3], I, lw); face(6, 7.5); eyes(); nose(); mouth() }
  else if (kind === 8) { shoulders(k.ia(0.45)); k.poly([[cx - 9, oy + 9], [cx - 9, oy - 7], [cx - 5, oy - 12], [cx + 5, oy - 12], [cx + 9, oy - 7], [cx + 9, oy + 9]], k.a("#B8B8B0", 1), I, lw); k.rect(cx - 6, oy - 5, 12, 9, skin, I, 0.6); k.circ(cx - 2.4, oy - 1.5, 0.8, I); k.circ(cx + 2.4, oy - 1.5, 0.8, I); k.ln([[cx, oy - 12], [cx, oy + 9]], k.ia(0.4), 0.5); k.ln(nCurve([[cx, oy - 12], [cx + 4, oy - 19], [cx + 11, oy - 18]], 4), k.a(T.accent, 1), 2.2) }
  else { shoulders(coat[3]); k.poly([[cx - 8, oy - 6], [cx - 9, oy + 12], [cx - 4, oy + 8], [cx + 4, oy + 8], [cx + 9, oy + 12], [cx + 8, oy - 6], [cx, oy - 11]], k.a("#5A3A22", 0.8), I, lw); face(6.5, 8); eyes(); nose(); mouth(); for (let j = 0; j < 6; j++) nLeaf(k, cx - 8 + j * 3.2, oy - 9.5 - Math.sin(j / 5 * Math.PI) * 1.6, 3.6, -0.9 + j * 0.3, k.a("#5E7A44", 1)) }
}
// NIGHTFALL: what the recon drones actually caught, in thermal
const NF_TAGS = ["HOSTILE", "OVERWATCH", "VEHICLE", "CACHE", "DRONE", "PATROL", "RELAY", "TRACKS", "GATE"]
function nfShot(k, kind, x, y, cs) {
  const cx = x + cs / 2, cy = y + cs / 2, z = cs / 60, HOT = k.a("#FFB347", 1), WARM = k.a("#FF5A36", 0.75), CORE = k.a("#FFF1C4", 1), COOL = k.a(T.accent, 0.55)
  const body = (bx, by, s2) => { k.ell(bx, by - 13 * s2, 3.4 * s2, 3.6 * s2, WARM); k.poly([[bx - 5 * s2, by + 5 * s2], [bx - 4 * s2, by - 9 * s2], [bx + 4 * s2, by - 9 * s2], [bx + 5 * s2, by + 5 * s2]], WARM); k.ell(bx, by - 4 * s2, 2.6 * s2, 4 * s2, HOT); k.ell(bx, by - 13 * s2, 1.8 * s2, 2 * s2, CORE); k.ln([[bx - 2 * s2, by + 5 * s2], [bx - 2.4 * s2, by + 12 * s2]], WARM, 2 * s2); k.ln([[bx + 2 * s2, by + 5 * s2], [bx + 2.4 * s2, by + 12 * s2]], WARM, 2 * s2) }
  if (kind === 0) { body(cx, cy + 2 * z, z * 1.1); k.ln([[cx + 3 * z, cy - 6 * z], [cx + 13 * z, cy - 10 * z]], COOL, 1.4); k.circ(cx, cy - 6 * z, 13 * z, null, k.A, 1); k.ln([[cx, cy - 22 * z], [cx, cy - 16 * z]], k.A, 0.8); k.ln([[cx, cy + 4 * z], [cx, cy + 10 * z]], k.A, 0.8) }
  else if (kind === 1) { k.poly([[x + 2, cy + 6 * z], [x + 18 * z, cy + 6 * z], [x + 18 * z, cy - 4 * z], [x + 36 * z, cy - 4 * z], [x + 36 * z, cy + 2 * z], [x + cs - 2, cy + 2 * z], [x + cs - 2, y + cs - 2], [x + 2, y + cs - 2]], k.a(T.accent, 0.15), COOL, 0.8); k.ell(cx + 4 * z, cy - 6.5 * z, 9 * z, 2.4 * z, WARM); k.circ(cx - 4 * z, cy - 7 * z, 2.6 * z, HOT); k.ln([[cx + 10 * z, cy - 7 * z], [cx + 20 * z, cy - 9 * z]], COOL, 1.2); k.circ(cx - 4 * z, cy - 7 * z, 8 * z, null, k.A, 0.9) }
  else if (kind === 2) { k.poly([[cx - 20 * z, cy + 6 * z], [cx - 18 * z, cy - 4 * z], [cx - 6 * z, cy - 8 * z], [cx + 14 * z, cy - 8 * z], [cx + 20 * z, cy - 2 * z], [cx + 20 * z, cy + 6 * z]], k.a(T.accent, 0.2), COOL, 0.9); k.rect(cx - 2 * z, cy - 12 * z, 10 * z, 4 * z, k.a(T.accent, 0.2), COOL, 0.7); k.ln([[cx + 8 * z, cy - 10 * z], [cx + 20 * z, cy - 12 * z]], COOL, 1); ;[-14, -5, 4, 13].forEach(u => { k.circ(cx + u * z, cy + 7 * z, 3.4 * z, k.a("#000000", 0.6), COOL, 0.8) }); k.ell(cx - 12 * z, cy - 1 * z, 5 * z, 3 * z, HOT); k.ell(cx - 12 * z, cy - 1 * z, 2 * z, 1.4 * z, CORE) }
  else if (kind === 3) { [[-12, 4, 14, 10], [2, 4, 14, 10], [-5, -6, 14, 10]].forEach(([u, v, w2, h2]) => { k.rect(cx + u * z, cy + v * z, w2 * z, h2 * z, k.a(T.accent, 0.15), COOL, 0.8); k.ln([[cx + u * z, cy + v * z], [cx + (u + w2) * z, cy + (v + h2) * z]], COOL, 0.5) }); k.ell(cx + 2 * z, cy + 9 * z, 4 * z, 2.4 * z, HOT); k.rect(cx - 17 * z, cy - 16 * z, 34 * z, 34 * z, null, k.A, 0.8) }
  else if (kind === 4) { k.rect(cx - 5 * z, cy - 3 * z, 10 * z, 6 * z, k.a(T.accent, 0.25), COOL, 0.8); ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([u, v]) => { k.ln([[cx + u * 4 * z, cy + v * 2 * z], [cx + u * 11 * z, cy + v * 8 * z]], COOL, 0.8); k.circ(cx + u * 11 * z, cy + v * 8 * z, 5 * z, null, COOL, 0.7) }); k.ell(cx, cy, 2.6 * z, 1.8 * z, HOT) }
  else if (kind === 5) { body(cx - 12 * z, cy + 4 * z, z * 0.75); body(cx, cy + 1 * z, z * 0.85); body(cx + 12 * z, cy + 5 * z, z * 0.7); k.ln([[x + 3, cy + 15 * z], [x + cs - 3, cy + 15 * z]], COOL, 0.6) }
  else if (kind === 6) { k.ln([[cx - 10 * z, cy + 18 * z], [cx, cy - 18 * z], [cx + 10 * z, cy + 18 * z]], COOL, 1); for (let j = 1; j < 6; j++) { const yy = cy - 18 * z + j * 6 * z, hw = j * 1.7 * z; k.ln([[cx - hw, yy], [cx + hw, yy + 6 * z]], COOL, 0.5); k.ln([[cx + hw, yy], [cx - hw, yy + 6 * z]], COOL, 0.5) } k.circ(cx, cy - 19 * z, 2.2 * z, k.a("#FF3B3B", 1)); k.circ(cx, cy - 19 * z, 5 * z, k.a("#FF3B3B", 0.25)) }
  else if (kind === 7) { for (let j = 0; j < 7; j++) { const t = j / 6, px = x + 8 * z + t * (cs - 16 * z), py = cy + 8 * z - t * 16 * z + (j % 2 ? -3 : 3) * z; k.ell(px, py, 2 * z, 3.2 * z, k.a("#FFB347", 0.35 + t * 0.5)) } }
  else { k.rect(cx + 6 * z, cy - 12 * z, 12 * z, 20 * z, k.a(T.accent, 0.15), COOL, 0.8); k.rect(cx + 8 * z, cy - 8 * z, 8 * z, 5 * z, k.a(T.accent, 0.3)); k.ln([[cx - 20 * z, cy + 2 * z], [cx + 6 * z, cy + 2 * z]], k.A, 2); for (let j = 0; j < 4; j++) k.rect(cx - 18 * z + j * 6 * z, cy + 0.6 * z, 3 * z, 2.8 * z, k.a("#000000", 0.7)); k.ln([[cx - 20 * z, cy + 2 * z], [cx - 20 * z, cy + 10 * z]], COOL, 1.2); body(cx + 12 * z, cy + 8 * z, z * 0.55) }
}
const HAL_ORDER = (d) => gShuf((d.seed || 7) * 5 + 1, 12)
HAL.ig = (k, W, H, d) => {
  const r = sRng(d, 2), small = W < 200, cols = small ? 3 : 6, cs = small ? 44 : 50
  k.t("SPECIMEN GALLERY // PEERS ON FILE", 12, 8, 7, k.S, { w: W - 24 })
  for (let i = 0; i < cols * (small ? 2 : 1); i++) { const x = 12 + (i % cols) * (cs + 4), y = 22 + Math.floor(i / cols) * (cs + 4); k.rect(x, y, cs, cs, k.a(T.panel, 0.6), k.ia(0.35), 0.8); halOrganism(k, HAL_ORDER(d)[i], x + cs / 2, y + cs / 2 - 3, cs / 50 * 0.92); k.t(`LOT ${1000 + ((d.seed || 7) * 37 + i * 911) % 9000}`, x + 3, y + cs - 8, 5.2, k.S, { w: cs - 6, nofit: true }); if (r() > 0.6) k.circ(x + cs - 6, y + 6, 2.5, k.A) }
  if (small) { k.t(`${1 + Math.floor(r() * 9)} / 400 LIKES`, 12, H - 14, 6.5, k.S, { w: W - 24 }); return }
  k.t(pick2(r, ["Everyone else is thriving. Observe.", "Comparison is a wellness metric.", "Your peers have been optimized.", "Look closely. Then look longer."]), 12, 80, 13, k.I, { f: "disp", w: W - 24 })
  ;[["PEERS OBSERVED", `${120 + Math.floor(r() * 300)}`], ["VALIDATION", `${1 + Math.floor(r() * 9)} / 400`], ["SELF-REGARD", `▼ ${6 + Math.floor(r() * 20)}%`]].forEach(([l, v], i) => { const x = 12 + i * 112; k.t(l, x, 104, 6.5, k.S, { w: 108 }); k.t(v, x, 113, 10, k.I, { w: 108 }) })
}
HAL.dc = (k, W, H, d) => {
  const r = sRng(d, 3), small = W < 200, cx = small ? W / 2 : 72, cy = small ? 56 : 66, R = small ? 34 : 44
  const nodes = []; for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 - Math.PI / 2; nodes.push([cx + R * Math.cos(a), cy + R * Math.sin(a), r() > 0.35]) }
  nodes.forEach(([x, y], i) => nodes.forEach(([x2, y2], j) => { if (j > i && r() > 0.55) k.ln([[x, y], [x2, y2]], k.ia(0.18), 0.6) }))
  nodes.forEach(([x, y]) => k.ln([[cx, cy], [x, y]], k.ia(0.25), 0.7))
  k.circ(cx, cy, 10, k.a(T.altBg, 0.5), k.I, 1); k.t("YOU", cx, cy - 3, 6, k.I, { a: "c", w: 24 })
  nodes.forEach(([x, y, on]) => k.circ(x, y, 5, on ? k.A : k.PN, k.I, 0.9))
  const online = nodes.filter(n => n[2]).length
  if (small) { k.t(`${online} OF 7 IN SYNC`, W / 2, H - 16, 7, k.I, { a: "c", w: W - 20 }); return }
  k.t("COLLECTIVE // SYNC STATUS", 134, 8, 7, k.S, { w: 220 })
  k.t(`${online} members in sync`, 134, 22, 15, k.I, { f: "disp", w: 220 })
  ;[["# approved-chatter", r() > 0.4], ["# wellness-checkins", r() > 0.5], ["# mandatory-fun", true], ["🔈 calm-room", r() > 0.5]].forEach(([c, unread], i) => { const y = 48 + i * 16; k.t(c, 134, y, 8.5, unread ? k.I : k.S, { w: 180 }); if (unread) k.circ(W - 20, y + 5, 3, k.A) })
  k.t(`MENTIONS ${Math.floor(r() * 6)} · HARMONY ${80 + Math.floor(r() * 19)}%`, 134, 118, 6.5, k.S, { w: 220 })
}

// DIRECTIVE ZERO (defense terminal)
DIR.yt = (k, W, H, d) => {
  const r = sRng(d, 4), small = W < 200, cols = small ? 2 : 3, rows = 2, mw = (W - 24 - (cols - 1) * 6) / cols, mh = small ? 34 : 40
  for (let i = 0; i < cols * rows; i++) { const x = 12 + (i % cols) * (mw + 6), y = 8 + Math.floor(i / cols) * (mh + 6), live = i === 0 || r() > 0.6; k.rect(x, y, mw, mh, k.ia(0.05), live ? k.H : k.ia(0.4), live ? 1.2 : 0.8); for (let yy = y + 2; yy < y + mh; yy += 3) k.rect(x, yy, mw, 1, k.ia(0.05)); k.t(`CAM ${String(i + 1).padStart(2, "0")}`, x + 4, y + 3, 6, k.S, { w: 40 }); if (live) { k.circ(x + mw - 8, y + 7, 2.5, k.H); k.t("REC", x + mw - 26, y + 3, 6, k.H, { w: 20, f: "bold" }) } k.ln([[x + mw / 2 - 5, y + mh / 2], [x + mw / 2 + 5, y + mh / 2]], k.ia(0.4), 0.7); k.ln([[x + mw / 2, y + mh / 2 - 5], [x + mw / 2, y + mh / 2 + 5]], k.ia(0.4), 0.7) }
  if (small) { k.t("6 FEEDS · 2 LIVE", 12, H - 14, 6.5, k.H, { w: W - 24 }); return }
  k.t("MONITOR WALL // SIX FEEDS UNDER WATCH", 12, 104, 7, k.S, { w: 240 })
  k.t(`TARGETS VIEWED ${20 + Math.floor(r() * 80)} · DWELL ${mmss(60 + r() * 600)}`, 12, 116, 8.5, k.I, { w: 260, f: "bold" })
  for (let i = 0; i < 5; i++) k.hex(W - 70 + i * 13, 120, 5.5, i < 3 ? k.H : k.ia(0.1), k.ia(0.4), 0.6)
}
DIR.ig = (k, W, H, d) => {
  const r = sRng(d, 5), small = W < 200, n = small ? 2 : 4, cw = small ? 68 : 78, ch = small ? 70 : 84
  for (let i = 0; i < n; i++) { const x = 12 + i * (cw + 8), y = 10; const kind = gShuf((d.seed || 7) * 7 + 2, 10)[i]; k.rect(x, y, cw, ch, k.ia(0.04), k.ia(0.45), 0.8); dirSubject(k, kind, x, y, cw, ch); k.t(`SUBJ ${String(10 + Math.floor(r() * 89))} · ${["CLERK", "MEDIC", "WELDER", "RECRUIT", "OFFICER", "UNKNOWN", "RADIO", "CHEMIST", "TEACHER", "COOK"][kind]}`, x + 4, y + ch - 12, 6, k.S, { w: cw - 8, nofit: true }); if (r() > 0.45) { k.rect(x + 6, y + ch * 0.62, cw - 12, 12, k.a(T.panel, 0.5), k.H, 1.2); k.t(pick2(r, ["OBSERVED", "FLAGGED", "ENVIED", "CLEARED", "MISSING", "ASSIGNED"]), x + cw / 2, y + ch * 0.62 + 2, 7, k.H, { a: "c", w: cw - 12, f: "bold" }) } }
  if (small) { k.t("DOSSIERS UPDATED", 12, H - 14, 6.5, k.S, { w: W - 24 }); return }
  k.t("CIVILIAN DOSSIERS", 12, 102, 7, k.S, { w: 200 }); k.t(`${120 + Math.floor(r() * 300)} PROFILES SCANNED · MORALE DELTA ▼${3 + Math.floor(r() * 12)}%`, 12, 114, 8.5, k.I, { w: W - 24, f: "bold" })
}
DIR.dc = (k, W, H, d) => {
  const r = sRng(d, 6), small = W < 200
  k.t("COMMAND NET // CHANNELS", 12, 8, 7, k.S, { w: W - 24 })
  const ch = [["# sortie-briefings", 1], ["# civil-defense", 0], ["# morale-office", 1], ["🔊 OPS ROOM", 2], ["🔊 SHELTER 9", 0]]
  ch.slice(0, small ? 4 : 5).forEach(([c, st], i) => { const y = 22 + i * 16; k.hex(18, y + 5, 4.5, st === 2 ? k.A : st === 1 ? k.H : k.ia(0.12)); k.t(c, 28, y, 8.5, st ? k.I : k.S, { w: small ? W - 40 : 180 }); if (st === 2 && !small) k.t(`${2 + Math.floor(r() * 5)} IN VOICE`, 210, y, 7, k.A, { w: 80 }) })
  if (small) return
  k.rect(W - 112, 22, 98, 74, null, k.H, 1); k.t("OPERATORS", W - 104, 28, 6.5, k.S, { w: 80 }); k.t(`${3 + Math.floor(r() * 12)}`, W - 104, 40, 26, k.I, { f: "disp", w: 80 }); k.t("ONLINE", W - 104, 72, 7, k.H, { w: 80 })
  k.t(`ALERTS ${Math.floor(r() * 9)} · MENTIONS ${Math.floor(r() * 4)} · ENCRYPTION ON`, 12, 112, 7, k.S, { w: W - 24 })
}

// THE LONG ROAD (parchment fantasy)
LR.yt = (k, W, H, d) => {
  const r = sRng(d, 7), small = W < 200, x0 = 12, w = small ? W - 24 : 150, y0 = 8, h = H - 18
  k.rect(x0, y0, w, h, k.a(T.panel, 0.7), k.I, 1); k.rect(x0 + 3, y0 + 3, w - 6, h - 6, null, k.ia(0.4), 0.6)
  for (let i = 0; i < 6; i++) { const cx = x0 + 6 + i * (w - 12) / 6; k.poly([[cx, y0 + 3], [cx + (w - 12) / 6, y0 + 3], [cx + (w - 12) / 12, y0 + 14]], k.a(T.accent, 0.6)) }
  k.t("TONIGHT", x0 + w / 2, y0 + 18, 7, k.S, { a: "c", w: w - 10 })
  k.para(pick2(r, ["The Ballad of the Lost Goose", "A Comedy of Wrong Turns", "The Miller's Three Wishes", "The Knight Who Forgot His Horse"]), x0 + 8, y0 + 30, w - 16, small ? 11 : 13, k.I, "disp", 2, 1.1)
  k.t("performed by the Travelling Players", x0 + w / 2, y0 + h - 22, 7.5, k.S, { f: "disp", a: "c", w: w - 10 })
  if (small) return
  const rx = 176
  k.t("Acts still to come", rx, 12, 10, k.S, { f: "disp", w: 170 })
  ;["Act I · The Lost Goose", "Act II · A Wrong Turn", "Act III · The Feast"].forEach((a, i) => { const done = i < 1 + Math.floor(r() * 2); k.t(a, rx, 30 + i * 18, 11, done ? k.ia(0.45) : k.I, { f: "disp", w: 170 }); if (done) k.ln([[rx, 37 + i * 18], [rx + 120, 37 + i * 18]], k.A, 0.9) })
  k.t(`Candle left: ${1 + Math.floor(r() * 5)} inches`, rx, 92, 10, k.S, { f: "disp", w: 170 }); k.t("Seats: a few, near the back", rx, 108, 10, k.S, { f: "disp", w: 170 })
}
LR.ig = (k, W, H, d) => {
  const r = sRng(d, 8), small = W < 200, n = small ? 2 : 4, fw = small ? 66 : 74, fh = small ? 78 : 92
  const names = ["The Baker", "The Miller's Son", "Old Maud", "A Stranger", "The Smith", "The Bard"]
  for (let i = 0; i < n; i++) { const x = 12 + i * (fw + 10), y = 8; k.rect(x, y, fw, fh, k.a(T.panel, 0.8), k.I, 1.2); k.rect(x + 3, y + 3, fw - 6, fh - 6, null, k.ia(0.35), 0.5); const kind = gShuf((d.seed || 7) * 11 + 4, 10)[i], sc2 = small ? 0.86 : 1; k.ell(x + fw / 2, y + fh * 0.42, fw * 0.36, fh * 0.34, k.ia(0.06), k.ia(0.6), 0.8); lrPortrait(k, kind, x + fw / 2, y + fh * 0.4 * sc2 + (small ? 4 : 0)); k.ell(x + fw / 2, y + fh * 0.42, fw * 0.36, fh * 0.34, null, k.I, 1); k.t(LR_FOLK[kind], x + fw / 2, y + fh - 14, 8, k.I, { f: "disp", a: "c", w: fw - 6, nofit: true }) }
  if (small) return
  k.t(pick2(r, ["The whole village sat for portraits this week.", "New faces hung in the gallery at dawn.", "Everyone looks finer in oil paint."]), 12, 108, 11, k.S, { f: "disp", w: W - 24 })
}
LR.dc = (k, W, H, d) => {
  const r = sRng(d, 9), small = W < 200, cx = small ? W / 2 : 84, cy = small ? 58 : 66
  k.ell(cx, cy, small ? 52 : 62, small ? 28 : 34, k.a(T.panel, 0.8), k.I, 1.2); k.ell(cx, cy, small ? 44 : 54, small ? 22 : 27, null, k.ia(0.3), 0.6)
  const seats = 8, filled = []; for (let i = 0; i < seats; i++) { const a = i / seats * Math.PI * 2, x = cx + (small ? 62 : 74) * Math.cos(a), y = cy + (small ? 36 : 44) * Math.sin(a), on = r() > 0.4; filled.push(on); k.circ(x, y, 6, on ? k.a(T.accent, 0.8) : k.PN, k.I, 0.9) }
  for (let i = 0; i < 3; i++) { const x = cx - 20 + i * 20; k.rect(x - 4, cy - 6, 8, 11, k.PN, k.I, 0.8); k.ln([[x + 4, cy - 3], [x + 7, cy - 3], [x + 7, cy + 2], [x + 4, cy + 2]], k.I, 0.8) }
  const on = filled.filter(Boolean).length
  if (small) { k.t(`${on} at the table`, W / 2, H - 16, 9, k.I, { f: "disp", a: "c", w: W - 20 }); return }
  k.t("At the tavern tonight", 176, 10, 10, k.S, { f: "disp", w: 170 })
  k.t(`${on} at the long table`, 176, 24, 14, k.I, { f: "disp", w: 176 })
  ;["The long table: gossip", "By the hearth: song", "The back room: dice"].forEach((t2, i) => { k.t(t2, 176, 50 + i * 16, 10, i === 0 ? k.I : k.S, { f: "disp", w: 170 }); if (i === 0) k.circ(W - 20, 56, 3, k.A) })
  k.t(`Letters waiting: ${Math.floor(r() * 5)} · Ale: plenty`, 176, 108, 9.5, k.S, { f: "disp", w: 170 })
}

// NIGHTFALL (visor HUD)
NF.yt = (k, W, H, d) => {
  const r = sRng(d, 10), small = W < 200, fx = 12, fy = 8, fw = small ? W - 24 : 200, fh = small ? 64 : 80
  k.rect(fx, fy, fw, fh, k.ia(0.06)); for (let i = 0; i < 140; i++) k.rect(fx + r() * fw, fy + r() * fh, 1 + r() * 2, 1, k.ia(r() * 0.25)); nfBrackets(k, fx + 2, fy + 2, fw - 4, fh - 4, 8, k.I, 1.3)
  k.circ(fx + fw / 2, fy + fh / 2, 12, null, k.ia(0.7), 1); k.poly([[fx + fw / 2 - 4, fy + fh / 2 - 6], [fx + fw / 2 + 7, fy + fh / 2], [fx + fw / 2 - 4, fy + fh / 2 + 6]], k.I)
  k.t(`REPLAY ${String(1 + Math.floor(r() * 40)).padStart(2, "0")} // DROP ${String(1 + Math.floor(r() * 9))}`, fx + 6, fy + 5, 6.5, k.A, { w: fw - 12, f: "bold" })
  const sy = fy + fh + 8; k.rect(fx, sy, fw, 4, k.ia(0.15)); const p = 0.2 + r() * 0.6; k.rect(fx, sy, fw * p, 4, k.I); k.circ(fx + fw * p, sy + 2, 4, k.A)
  for (let i = 0; i < 5; i++) k.ln([[fx + fw * (0.1 + i * 0.2), sy - 3], [fx + fw * (0.1 + i * 0.2), sy + 7]], k.a(T.accent, 0.6), 0.8)
  if (small) { k.t(`${mmss(30 + r() * 300)} / ${mmss(400 + r() * 300)}`, fx, H - 14, 6.5, k.S, { w: fw }); return }
  const rx = 226
  ;[["CLIPS QUEUED", "∞"], ["ADRENALINE", `${60 + Math.floor(r() * 39)}%`], ["SLEEP DEBT", `${1 + Math.floor(r() * 5)}H`]].forEach(([l, v], i) => { nfBrackets(k, rx, 8 + i * 38, W - rx - 12, 32, 5, k.ia(0.6), 1); k.t(l, rx + 6, 12 + i * 38, 6.5, k.S, { w: 100 }); k.t(v, rx + 6, 22 + i * 38, 12, k.I, { f: "bold", w: 100 }) })
}
NF.ig = (k, W, H, d) => {
  const r = sRng(d, 11), small = W < 200, cols = small ? 3 : 5, cs = small ? 44 : 60
  k.t("RECON PHOTOS // CONTACT SHEET", 12, 6, 7, k.A, { w: W - 24, f: "bold" })
  for (let i = 0; i < cols * (small ? 2 : 1); i++) { const x = 12 + (i % cols) * (cs + 6), y = 20 + Math.floor(i / cols) * (cs + 6); const kind = gShuf((d.seed || 7) * 13 + 6, 9)[i]; k.rect(x, y, cs, cs, k.ia(0.06)); for (let j = 0; j < 30; j++) k.rect(x + r() * cs, y + r() * cs, 1, 1, k.ia(r() * 0.3)); nfShot(k, kind, x, y - 3, cs); nfBrackets(k, x, y, cs, cs, 5, k.ia(0.7), 1); const num = `#${String(100 + i * 7 + Math.floor(r() * 5))}`; if (cs >= 50) k.t(num, x + 3, y + cs - 10, 5.5, k.S, { w: 22, nofit: true }); k.t(NF_TAGS[kind], x + cs - 3, y + cs - 10, 5.5, k.A, { a: "r", w: cs >= 50 ? cs - 24 : cs - 6, nofit: true }) }
  if (small) return
  k.t(`FRAMES ${40 + Math.floor(r() * 160)} · TAGGED ${3 + Math.floor(r() * 12)} · SQUAD RESPECT ▲${1 + Math.floor(r() * 9)}`, 12, 92, 8, k.I, { w: W - 24, f: "bold" })
  k.t("FILE BY END OF SHIFT", 12, 106, 6.5, k.S, { w: 200 })
}
NF.dc = (k, W, H, d) => {
  const r = sRng(d, 12), small = W < 200
  k.t("SQUAD NET // VOICE + TEXT", 12, 6, 7, k.A, { w: W - 24, f: "bold" })
  const troopers = ["ALPHA-1", "ALPHA-2", "BRAVO-3", "BRAVO-4", "CHARLIE-6"], talking = Math.floor(r() * 5)
  troopers.slice(0, small ? 4 : 5).forEach((t2, i) => { const y = 20 + i * 15; const on = r() > 0.25; k.circ(18, y + 5, 3.5, on ? (i === talking ? k.A : k.I) : k.ia(0.15)); k.t(t2, 28, y, 8, on ? k.I : k.S, { w: 70, f: "bold" }); if (!small) { k.segs(104, y + 2, 90, 5, 10, on ? (i === talking ? 0.8 + r() * 0.2 : r() * 0.3) : 0, k.I, k.ia(0.12), 2); k.t(i === talking ? "TX" : on ? "RX" : "OFF", 200, y, 7, i === talking ? k.A : k.S, { w: 30 }) } })
  if (small) return
  nfBrackets(k, W - 116, 18, 104, 74, 7, k.I, 1.2); k.t("CHANNEL", W - 108, 24, 6.5, k.S, { w: 80 }); k.t("08", W - 108, 34, 26, k.I, { f: "bold", w: 80 }); k.t(`${troopers.length} ON NET`, W - 108, 66, 7, k.A, { w: 90 }); k.t(`UNREAD ${Math.floor(r() * 9)}`, W - 108, 78, 7, k.S, { w: 90 })
  k.t("PUSH TO TALK · KEEP IT CLEAN, TROOPER", 12, 110, 7, k.S, { w: W - 24 })
}

// GRIMOIRE (arcane)
GM.yt = (k, W, H, d) => {
  const r = sRng(d, 13), small = W < 200, cx = small ? W / 2 : 70, cy = small ? 54 : 62, R = small ? 34 : 44
  for (let g = 4; g >= 1; g--) k.circ(cx, cy, R + g * 3, k.a(T.altBg, 0.06)); k.circ(cx, cy, R, k.a(T.altBg, 0.4), k.A, 1.2)
  for (let i = 0; i < 4; i++) { const pts = []; for (let a = 0; a <= Math.PI * 2; a += 0.2) pts.push([cx + R * 0.7 * Math.cos(a) * (0.4 + i * 0.15), cy + R * 0.5 * Math.sin(a + i) * (0.5 + i * 0.12)]); k.ln(pts, k.a(T.accent, 0.25 + i * 0.12), 0.8) }
  k.poly([[cx - 5, cy - 7], [cx + 8, cy], [cx - 5, cy + 7]], k.a(T.ink, 0.85)); k.poly([[cx - 18, cy + R + 4], [cx + 18, cy + R + 4], [cx + 24, cy + R + 14], [cx - 24, cy + R + 14]], k.a(T.accent, 0.4), k.A, 1)
  if (small) return
  k.t("THE CRYSTAL SHOWS", 136, 8, 7, k.A, { w: 200 })
  k.para(pick2(r, ["A traveller teaching a cat to cook.", "Ten minutes of rain on old stones.", "A wizard reviewing other wizards.", "Something unboxed, with great ceremony."]), 136, 22, W - 150, 14, k.I, "disp", 2, 1.1)
  ;[["VISIONS QUEUED", "∞"], ["TRANCE", `${2 + Math.floor(r() * 5)} CIRCLES`], ["ESSENCE SPENT", `${10 + Math.floor(r() * 60)}%`]].forEach(([l, v], i) => { k.t(l, 136, 62 + i * 18, 7, k.S, { w: 100 }); k.t(v, W - 14, 60 + i * 18, 11, k.I, { f: "disp", a: "r", w: 100 }) })
}
// THE LOOKING GLASS: every half hour a new sigil signs the circle; the others move along, the glass shows the newest mark
const GM_SYL = ["vel", "kar", "ith", "um", "bra", "zor", "eth", "mir", "qua", "lun", "dros", "shai", "ven", "oth", "ra", "sel", "ae", "nor", "ys", "cal"], GM_RANK = ["NOVICE", "SEEKER", "ADEPT", "MAGUS", "WARDEN"]
function gmName(id) { const r = (n) => { let v = Math.abs(Math.floor(id * 7919 + n * 104729)) % 233280; v = (v * 9301 + 49297) % 233280; return v }; const a = GM_SYL[r(1) % GM_SYL.length], b = GM_SYL[r(2) % GM_SYL.length]; return a.charAt(0).toUpperCase() + a.slice(1) + b }
function gmSigil(k, cx, cy, R, id, col, glow) {
  const r = k.rng(id * 131 + 17), n = 4 + Math.floor(r() * 6), rot = r() * Math.PI * 2, ring = Math.floor(r() * 6), core = Math.floor(r() * 8), deco = Math.floor(r() * 3), lw = Math.max(0.7, R / 16)
  if (glow) { k.circ(cx, cy, R * 1.25, k.a(glow, 0.12)); k.circ(cx, cy, R * 1.05, k.a(glow, 0.14)) }
  if (ring === 0) { k.circ(cx, cy, R, null, col, lw); k.circ(cx, cy, R * 0.86, null, k.a(T.accent, 0.5), lw * 0.6) }
  else if (ring === 1) { k.circ(cx, cy, R, null, col, lw); for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * Math.PI * 2; k.ln([[cx + R * Math.cos(a), cy + R * Math.sin(a)], [cx + R * 0.86 * Math.cos(a), cy + R * 0.86 * Math.sin(a)]], col, lw * 0.7) } }
  else if (ring === 2) { const m = n, pts = []; for (let i = 0; i <= m; i++) { const a = rot + i / m * Math.PI * 2; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]) } k.ln(pts, col, lw) }
  else if (ring === 3) { k.circ(cx, cy, R * 0.92, null, col, lw); for (let i = 0; i < 4; i++) { const a = rot + i * Math.PI / 2, mx = cx + R * 0.92 * Math.cos(a), my = cy + R * 0.92 * Math.sin(a); k.circ(mx, my, R * 0.14, k.a(T.panel || "#1F1B3A", 1), col, lw * 0.8) } }
  else if (ring === 4) { const pts = []; for (let i = 0; i <= 3; i++) { const a = -Math.PI / 2 + i / 3 * Math.PI * 2; pts.push([cx + R * 1.05 * Math.cos(a), cy + R * 1.05 * Math.sin(a)]) } k.ln(pts, col, lw) }
  else { k.circ(cx, cy, R * 0.82, null, col, lw); for (let i = 0; i < 8; i++) { const a = rot + i / 8 * Math.PI * 2, l = i % 2 ? 0.94 : 1.08; k.ln([[cx + R * 0.86 * Math.cos(a), cy + R * 0.86 * Math.sin(a)], [cx + R * l * Math.cos(a), cy + R * l * Math.sin(a)]], col, lw * 0.8) } }
  const P = []; for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; P.push([cx + R * 0.7 * Math.cos(a), cy + R * 0.7 * Math.sin(a)]) }
  // the mark: a star path through the points, or a wandering stroke, ending in a bar and starting in a ring
  let step = 2; for (let t = 2; t < n / 2 + 1; t++) { let g = n, h = t; while (h) { [g, h] = [h, g % h] } if (g === 1 && r() < 0.6) { step = t; break } }
  const path = []; if (r() < 0.55) { for (let i = 0; i <= n; i++) path.push(P[(i * step) % n]) } else { const order = P.map((_, i) => i).sort(() => r() - 0.5).slice(0, Math.max(4, n - 1)); order.forEach(i => path.push(P[i])) }
  k.ln(path, col, lw * 1.1)
  const s0 = path[0], e0 = path[path.length - 1], e1 = path[path.length - 2] || [cx, cy]; k.circ(s0[0], s0[1], R * 0.09, null, col, lw)
  const ang = Math.atan2(e0[1] - e1[1], e0[0] - e1[0]) + Math.PI / 2; k.ln([[e0[0] - Math.cos(ang) * R * 0.12, e0[1] - Math.sin(ang) * R * 0.12], [e0[0] + Math.cos(ang) * R * 0.12, e0[1] + Math.sin(ang) * R * 0.12]], col, lw * 1.2)
  P.forEach((p, i) => { if (i % 2 === 1 && r() < 0.7) { if (deco === 0) k.circ(p[0], p[1], R * 0.05, col); else if (deco === 1) k.circ(p[0], p[1], R * 0.07, null, col, lw * 0.7); else { k.ln([[p[0] - R * 0.06, p[1]], [p[0] + R * 0.06, p[1]]], col, lw * 0.7); k.ln([[p[0], p[1] - R * 0.06], [p[0], p[1] + R * 0.06]], col, lw * 0.7) } } })
  if (r() < 0.4) { const m = 3 + Math.floor(r() * 2), pts = []; for (let i = 0; i <= m; i++) { const a = rot + Math.PI / m + i / m * Math.PI * 2; pts.push([cx + R * 0.36 * Math.cos(a), cy + R * 0.36 * Math.sin(a)]) } k.ln(pts, k.a(T.accent, 0.7), lw * 0.7) }
  if (core === 0) { k.poly(k.arcPts(cx, cy, R * 0.22, Math.PI * 0.35, Math.PI * 1.65, 12).concat(k.arcPts(cx + R * 0.09, cy, R * 0.17, Math.PI * 1.55, Math.PI * 0.45, 12).reverse()), col) }
  else if (core === 1) { k.circ(cx, cy, R * 0.16, null, col, lw); k.circ(cx, cy, R * 0.05, col) }
  else if (core === 2) k.poly([[cx, cy - R * 0.2], [cx + R * 0.18, cy + R * 0.13], [cx - R * 0.18, cy + R * 0.13]], null, col, lw)
  else if (core === 3) { k.poly(k.arcPts(cx, cy + R * 0.12, R * 0.26, Math.PI * 1.2, Math.PI * 1.8, 10).concat(k.arcPts(cx, cy - R * 0.12, R * 0.26, Math.PI * 0.2, Math.PI * 0.8, 10)), null, col, lw); k.circ(cx, cy, R * 0.06, col) }
  else if (core === 4) { k.ln([[cx - R * 0.16, cy], [cx + R * 0.16, cy]], col, lw); k.ln([[cx, cy - R * 0.16], [cx, cy + R * 0.16]], col, lw) }
  else if (core === 5) { const pts = []; for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + (i * 2 % 5) * Math.PI * 2 / 5; pts.push([cx + R * 0.2 * Math.cos(a), cy + R * 0.2 * Math.sin(a)]) } k.ln(pts, col, lw * 0.9) }
  else if (core === 6) { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24, a = t * Math.PI * 3.2; pts.push([cx + R * 0.2 * t * Math.cos(a), cy + R * 0.2 * t * Math.sin(a)]) } k.ln(pts, col, lw) }
  else { k.circ(cx, cy - R * 0.05, R * 0.08, col); k.poly([[cx - R * 0.05, cy], [cx + R * 0.05, cy], [cx + R * 0.09, cy + R * 0.2], [cx - R * 0.09, cy + R * 0.2]], col) }
}
GM.ig = (k, W, H, d) => {
  k = gSafe(k)
  const r = sRng(d, 14), small = W < 200, cx = small ? W / 2 : 62, cy = small ? 50 : 56, seed = d.seed || 7, newest = seed
  // the looking glass, with the newest mark glowing inside it
  k.ell(cx, cy, small ? 28 : 34, small ? 36 : 44, k.a(T.altBg, 0.45), k.A, 1.4); k.ell(cx, cy, small ? 23 : 28, small ? 31 : 38, null, k.a(T.accent, 0.5), 0.6)
  gmSigil(k, cx, cy, small ? 15 : 19, newest, k.a(T.accent, 0.85), T.altBg)
  k.rect(cx - 4, cy + (small ? 36 : 44), 8, 22, k.a(T.accent, 0.8)); k.circ(cx, cy + (small ? 36 : 44) + 24, 5, k.A)
  for (let i = 0; i < 3; i++) k.ln([[cx - 18 + i * 4, cy - 24 + i * 6], [cx - 10 + i * 4, cy - 32 + i * 6]], k.a("#FFFFFF", 0.35), 1)
  if (small) { k.t(`${gmName(newest)} signed the circle`, W / 2, H - 16, 8, k.A, { f: "disp", a: "c", w: W - 16, lines: 1 }); return }
  k.t("THE LOOKING GLASS REVEALS", 120, 8, 7, k.A, { w: 220, lines: 1 })
  // four cards, oldest to newest; next refresh they all move one place left and a stranger arrives on the right
  for (let i = 0; i < 4; i++) { const id = newest - 3 + i, x = 120 + i * 58, y = 22, isNew = i === 3
    gmCard(k, x, y, 50, 62, null)
    if (isNew) { k.rect(x + 1, y + 1, 48, 60, k.a(T.altBg, 0.18)); k.poly([[x + 13, y - 4], [x + 37, y - 4], [x + 40, y + 1], [x + 37, y + 6], [x + 13, y + 6], [x + 10, y + 1]], k.a(T.accent, 1)); k.t("NEW", x + 25, y - 3.2, 6.5, k.a(T.ground || "#15132A", 1), { a: "c", w: 26, nofit: true, f: "bold" }) }
    gmSigil(k, x + 25, y + 23, 12.5, id, isNew ? k.A : k.a(T.accent, 0.8), isNew ? T.altBg : null)
    k.t(gmName(id), x + 25, y + 38, 8, isNew ? k.A : k.I, { f: "disp", a: "c", w: 42, lines: 1 })
    k.t(GM_RANK[Math.abs(id * 7) % GM_RANK.length], x + 25, y + 48, 5.4, k.S, { a: "c", w: 42, lines: 1, floor: 5.4 }) }
  k.t(`SIGILS BOUND ${120 + (seed % 900)} · NEW TONIGHT ${1 + (seed % 4)} · CIRCLE ${4 + (seed % 9)}/12`, 120, 94, 7.5, k.I, { w: W - 134, lines: 1 })
  k.t([`${gmName(newest)} has signed the circle.`, "The glass remembers every mark.", "One more name the stars will know."][seed % 3], 120, 108, 10, k.S, { f: "disp", w: W - 134, lines: 1 })
}
GM.dc = (k, W, H, d) => {
  const r = sRng(d, 15), small = W < 200, cx = small ? W / 2 : 70, cy = small ? 56 : 64, R = small ? 38 : 46
  k.circ(cx, cy, R, null, k.A, 1.1); gmStar(k, cx, cy, R * 0.86, k.a(T.accent, 0.45), 0.8)
  const seats = 7, lit = []; for (let i = 0; i < seats; i++) { const a = -Math.PI / 2 + i / seats * Math.PI * 2, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), on = r() > 0.35; lit.push(on); k.rect(x - 2.5, y - 2, 5, 9, k.ia(0.85)); if (on) { k.ell(x, y - 6, 3, 5, k.a(T.accent, 0.3)); k.poly([[x, y - 10], [x + 2, y - 5], [x, y - 2], [x - 2, y - 5]], k.A) } }
  k.circ(cx, cy, 6, k.a(T.altBg, 1), k.A, 1)
  const on = lit.filter(Boolean).length
  if (small) { k.t(`${on} candles lit`, W / 2, H - 16, 9, k.I, { f: "disp", a: "c", w: W - 20 }); return }
  k.t("THE CIRCLE GATHERS", 136, 8, 7, k.A, { w: 200 })
  k.t(`${on} of the circle present`, 136, 22, 15, k.I, { f: "disp", w: 210 })
  ;["# whispers", "# the-grimoire", "# omens-and-portents", "🕯 the seance room"].forEach((c, i) => { const y = 48 + i * 15; k.t(c, 136, y, 9, i === 3 ? k.A : k.I, { f: "disp", w: 190 }); if (r() > 0.5) k.poly([[W - 20, y + 2], [W - 17, y + 5], [W - 20, y + 8], [W - 23, y + 5]], k.A) })
  k.t(`SUMMONS ${Math.floor(r() * 5)} · OMENS ${Math.floor(r() * 9)}`, 136, 112, 7, k.S, { w: 200 })
}

// DEEP RANGE (tracking display)
DRG.yt = (k, W, H, d) => {
  const r = sRng(d, 16), small = W < 200, fw = small ? W - 24 : 180, cols = 6, fh = small ? 48 : 60
  for (let i = 0; i < cols; i++) { const x = 12 + i * (fw / cols), on = i === cols - 1; k.rect(x + 1, 10, fw / cols - 3, fh, k.a(T.altBg, on ? 0.6 : 0.18 + i * 0.06), on ? k.H : k.ia(0.3), on ? 1.2 : 0.6); const pts = []; for (let yy = 0; yy <= fh; yy += 3) pts.push([x + fw / cols / 2 + Math.sin(yy * 0.3 + i) * (fw / cols * 0.3), 10 + yy]); k.ln(pts, k.ia(0.5 + i * 0.08), 0.8) }
  k.t("FRAME LOCK", 12, fh + 14, 7, k.H, { f: "bold", w: 100 }); k.segs(12, fh + 26, fw, 4, 18, 0.3 + r() * 0.6, k.I, k.ia(0.12), 1)
  if (small) return
  const rx = 206
  k.t("VIDEO DOWNLINK", rx, 8, 7, k.S, { w: 140 }); k.t(`${(1 + r() * 9).toFixed(1)} MBPS`, rx, 18, 22, k.I, { f: "heavy", w: 150 })
  ;[["PASS", `${String(1 + Math.floor(r() * 99)).padStart(2, "0")} / ∞`], ["DWELL", mmss(60 + r() * 900)], ["PACKET LOSS", `${(r() * 3).toFixed(1)}%`]].forEach(([l, v], i) => { const y = 50 + i * 20; k.rect(rx, y, 3, 16, k.H); k.t(l, rx + 8, y, 6.5, k.S, { w: 70 }); k.t(v, W - 14, y + 2, 10, k.I, { f: "heavy", a: "r", w: 80 }) })
}
DRG.ig = (k, W, H, d) => {
  const r = sRng(d, 17), small = W < 200, n = small ? 2 : 4, ts = small ? 62 : 66
  for (let i = 0; i < n; i++) { const x = 12 + i * (ts + 10), y = 10, prog = 0.3 + r() * 0.7, px = 6, rows = Math.floor(ts / px); for (let a = 0; a < rows; a++) for (let b = 0; b < rows; b++) { const decoded = (a * rows + b) / (rows * rows) < prog; k.rect(x + b * px, y + a * px, px - 1, px - 1, decoded ? k.a(r() > 0.5 ? T.ink : T.altBg, 0.25 + r() * 0.6) : k.ia(0.05)) } k.rect(x - 1, y - 1, ts, ts, null, i === 0 ? k.H : k.ia(0.4), 1); k.t(`IMG ${String(400 + i * 13)} · ${Math.round(prog * 100)}%`, x, y + ts + 3, 6.5, i === 0 ? k.H : k.S, { w: ts + 6 }) }
  if (small) return
  k.t(`INTERCEPTS ${30 + Math.floor(r() * 200)} · DECODED ${10 + Math.floor(r() * 30)} · ECHOES ${Math.floor(r() * 9)}`, 12, 96, 8, k.I, { f: "bold", w: W - 24 }); k.t("IMAGE INTERCEPTS // RELAY 07", 12, 110, 6.5, k.S, { w: 220 })
}
DRG.dc = (k, W, H, d) => {
  const r = sRng(d, 18), small = W < 200, nodes = [[0.5, 0.18], [0.2, 0.5], [0.8, 0.45], [0.35, 0.85], [0.7, 0.85], [0.5, 0.52]], mw = small ? W - 24 : 170, mh = small ? 90 : 110
  nodes.forEach(([a, b], i) => nodes.forEach(([c2, e], j) => { if (j > i && (i === 5 || j === 5 || r() > 0.6)) k.ln([[12 + a * mw, 10 + b * mh], [12 + c2 * mw, 10 + e * mh]], k.a(T.altBg, 0.7), 0.8) }))
  nodes.forEach(([a, b], i) => { const x = 12 + a * mw, y = 10 + b * mh, on = i === 5 || r() > 0.3; k.rect(x - 4, y - 4, 8, 8, i === 5 ? k.H : on ? k.I : k.ia(0.2)); if (on && i !== 5) k.circ(x, y, 8, null, k.ia(0.3), 0.6) })
  if (small) return
  const rx = 198
  k.t("RELAY NET // CONTACTS", rx, 8, 7, k.S, { w: 160 }); k.t(`${3 + Math.floor(r() * 9)} ONLINE`, rx, 18, 22, k.I, { f: "heavy", w: 160 })
  ;["# deep-field", "# salvage-rights", "🔊 RELAY 07"].forEach((c, i) => { const y = 52 + i * 16; k.rect(rx, y + 2, 3, 10, i === 2 ? k.H : k.I); k.t(c.toUpperCase(), rx + 8, y, 8, k.I, { w: 150, f: "bold" }) })
  k.t(`PINGS ${Math.floor(r() * 30)} · REPLIES ${Math.floor(r() * 9)}`, rx, 108, 7, k.H, { w: 160 })
}
