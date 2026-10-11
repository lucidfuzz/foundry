// ---------- shared bits for the four new themes ----------
function nBars(k, x, y, w, h, n, f, on, off, gap) { k.segs(x, y, w, h, n, f, on, off, gap == null ? 2 : gap) }
function glowLn(k, pts, col, w) { k.ln(pts, k.a(col, 0.25), (w || 1) * 4); k.ln(pts, k.a(col, 1), w || 1) }
function notch(k, x, y, w, h, c, col, lw, fill) { const p = [[x + c, y], [x + w, y], [x + w, y + h - c], [x + w - c, y + h], [x, y + h], [x, y + c]]; if (fill) k.poly(p, fill); k.poly(p, null, k.a(col, 0.25), (lw || 1) * 4); k.poly(p, null, k.a(col, 1), lw || 1) }
function gPill(k, x, y, w, h, base, hl) { const r = Math.min(h / 2, w / 2); const rr = (yy, hh, col) => { k.rect(x + r, yy, w - 2 * r, hh, col); k.ell(x + r, yy + hh / 2, r, hh / 2, col); k.ell(x + w - r, yy + hh / 2, r, hh / 2, col) }; rr(y, h, base); rr(y + 1.5, h * 0.42, k.a("#FFFFFF", hl == null ? 0.45 : hl)) }
function gBubble(k, x, y, r, tint) { k.circ(x, y, r, k.a(tint, 0.25), k.a("#FFFFFF", 0.85), Math.max(0.6, r * 0.08)); k.ell(x - r * 0.35, y - r * 0.42, r * 0.3, r * 0.14, k.a("#FFFFFF", 0.9)) }
function winBox(k, x, y, w, h, title, titleCol) { const g = k.a("#C3C3D0", 1); k.rect(x, y, w, h, g); k.rect(x, y, w, 1.5, k.a("#FFFFFF", 1)); k.rect(x, y, 1.5, h, k.a("#FFFFFF", 1)); k.rect(x, y + h - 1.5, w, 1.5, k.a("#4A4A5A", 1)); k.rect(x + w - 1.5, y, 1.5, h, k.a("#4A4A5A", 1)); for (let i = 0; i < 10; i++) k.rect(x + 3 + i * (w - 6) / 10, y + 3, (w - 6) / 10 + 0.5, 12, k.a(i < 5 ? "#1A1A80" : (titleCol || T.headBg), i < 5 ? 1 : 0.5 + i * 0.05)); k.t(title, x + 6, y + 4, 8, k.a("#FFFFFF", 1), { w: w - 50 }); [w - 14, w - 26].forEach(dx => { k.rect(x + dx, y + 4, 10, 9, g); k.t(dx === w - 14 ? "x" : "_", x + dx + 5, y + 3, 7.5, k.a("#000000", 1), { a: "c", w: 10 }) }) }
function nLeaf(k, x, y, s, ang, col) { const c = Math.cos(ang), sn = Math.sin(ang), P = (u, v) => [x + u * c - v * sn, y + u * sn + v * c]; const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(P(t * s, -Math.sin(t * Math.PI) * s * 0.3)) } for (let i = 10; i >= 0; i--) { const t = i / 10; pts.push(P(t * s, Math.sin(t * Math.PI) * s * 0.3)) } k.poly(pts, col, k.I, 0.7); k.ln([P(0, 0), P(s, 0)], k.ia(0.6), 0.5) }
function nShroom(k, x, y, s, cap) { k.rect(x - s * 0.1, y - s * 0.55, s * 0.2, s * 0.55, k.a("#F4EEDF", 1)); k.ln([[x - s * 0.1, y], [x - s * 0.1, y - s * 0.55]], k.I, 0.8); k.ln([[x + s * 0.1, y], [x + s * 0.1, y - s * 0.55]], k.I, 0.8); const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; pts.push([x + s * 0.5 * Math.cos(a), y - s * 0.55 + s * 0.42 * Math.sin(a)]) } k.poly(pts, cap, k.I, 0.9); k.circ(x - s * 0.18, y - s * 0.75, s * 0.06, k.a("#FFF8EC", 1)); k.circ(x + s * 0.14, y - s * 0.82, s * 0.05, k.a("#FFF8EC", 1)) }
function inst(k, i, gx, gy, A, st) {
  const I = st.ink || k.I, H = st.hot || k.H, F = st.faint || k.ia(0.15)
  if (i === 0) (A.probs || []).slice(0, 6).forEach((p, j) => { const bh = Math.max(2, 26 * (p || 0) / 100); st.bar ? st.bar(gx + j * 6, gy + 28 - bh, 4.5, bh, (p || 0) > 50) : k.rect(gx + j * 6, gy + 28 - bh, 4.5, bh, (p || 0) > 50 ? H : I) })
  if (i === 1) { const f = Math.max(0, Math.min(1, (A.rh || 0) / 100)); for (let j = 0; j < 7; j++) k.rect(gx + 6, gy + 26 - (j + 1) * 3.8, 16, 2.8, j / 7 < f ? I : F) }
  if (i === 2) { const u = Math.round(A.uv || 0); for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2; k.ln([[gx + 14 + 6 * Math.cos(a), gy + 14 + 6 * Math.sin(a)], [gx + 14 + 11 * Math.cos(a), gy + 14 + 11 * Math.sin(a)]], j < u ? H : F, 1.2) } k.circ(gx + 14, gy + 14, 4, I) }
  if (i === 3) { const vm = Math.max(0, Math.min(10, A.visMi || 0)); for (let j = 0; j < 4; j++) k.ln([[gx + 2, gy + 6 + j * 6], [gx + 28 - j * 5, gy + 6 + j * 6]], j < Math.ceil(vm / 2.5) ? I : F, 1.6) }
  if (i === 4) { const tx = gx + 12, f = Math.max(0.1, Math.min(1, ((A.dew || 0) + 10) / 90)); k.rect(tx - 2.5, gy + 2, 5, 20, null, I, 0.8); k.circ(tx, gy + 25, 4, H); k.rect(tx - 1, gy + 22 - 18 * f, 2, 18 * f + 2, H) }
  if (i === 5) { const cx = gx + 14, cy = gy + 14, wd = ((A.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.circ(cx, cy, 12, null, F, 0.8); k.ln([[cx - 8 * Math.cos(wd), cy - 8 * Math.sin(wd)], [cx + 10 * Math.cos(wd), cy + 10 * Math.sin(wd)]], H, 1.4); k.circ(cx + 10 * Math.cos(wd), cy + 10 * Math.sin(wd), 2, H) }
}
const atmItems = (A) => [["PRECIP", A.pmax != null ? `${A.pmax}%` : "--"], ["HUMIDITY", A.rh != null ? `${A.rh}%` : "--"], ["UV", A.uv != null ? `${Math.round(A.uv)}` : "--"], ["VISIBILITY", A.vis || "--"], ["DEW", A.dew != null ? `${A.dew}°` : "--"], ["WIND", A.wind || "--"]]

// ---------- NEON DISTRICT ----------
function cySky(k, W, y0, h, r) { let x = 0; while (x < W) { const w = 10 + r() * 22, hh = h * (0.3 + r() * 0.7); k.rect(x, y0 + h - hh, w, hh, k.a(T.panel, 0.9)); for (let wy = y0 + h - hh + 3; wy < y0 + h - 2; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) if (r() > 0.7) k.rect(wx, wy, 1.6, 2, k.a(r() > 0.5 ? T.headBg : T.accent, 0.6)); x += w + 1 } }
// ---------- CHROME GALLERY: four takes on what fills the frames ----------
function cyGlow(k, x, y, w, h, col, a) { k.rect(x - 1.5, y - 1.5, w + 3, h + 3, k.a(col, (a || 1) * 0.22)); k.rect(x, y, w, h, k.a(col, a || 1)) }
function cyHeart(k, x, y, s2, col) { k.circ(x - s2 * 0.5, y, s2 * 0.55, col); k.circ(x + s2 * 0.5, y, s2 * 0.55, col); k.poly([[x - s2 * 1.02, y + s2 * 0.15], [x + s2 * 1.02, y + s2 * 0.15], [x, y + s2 * 1.3]], col) }
const CY_IG = [
  { // A: glitched portraits, split into cyan and pink, visors on
    sub: "CHROME GALLERY // FILTERED FOREVER", kv: (r) => [["FOLLOWERS", `${(10 + r() * 80).toFixed(1)}K`], ["FILTERS ON", `${4 + Math.floor(r() * 9)}`], ["REAL FACES", `${Math.floor(r() * 3)}`]],
    cell(k, x, y, cs, seed, i) {
      const r = k.rng(seed * 7 + 3), cx = x + cs / 2, hy = y + cs * 0.4, hr = cs * 0.17, hair = Math.floor(r() * 5), visor = [T.altBg, T.accent, T.headBg][Math.floor(r() * 3)]
      const g1 = y + 8 + r() * (cs - 18), g2 = y + 8 + r() * (cs - 18), sh = (r() - 0.5) * 9
      const hw = (yy) => { const t = (yy - hy) / hr; let w = Math.abs(t) <= 1 ? hr * Math.sqrt(1 - t * t) : 0
        if (hair === 1 && yy < hy - hr * 0.6 && yy > hy - hr * 1.7) w = Math.max(w, cs * 0.04)
        if (hair === 2 && yy > hy - hr * 1.05 && yy < hy + hr * 0.5) w = Math.max(w, hr * 1.22 * Math.sqrt(Math.max(0, 1 - Math.pow((yy - hy + hr * 0.2) / (hr * 1.25), 2))))
        if (hair === 3 && yy > hy - hr * 1.5 && yy < hy + hr * 1.2) w = Math.max(w, hr * 1.35 * Math.sqrt(Math.max(0, 1 - Math.pow((yy - hy) / (hr * 1.5), 2))))
        if (yy > hy + hr * 0.9 && yy < hy + hr * 1.45) w = Math.max(w, hr * 0.45)
        if (yy >= hy + hr * 1.45) w = Math.max(w, Math.min(cs * 0.38, hr * 0.6 + (yy - hy - hr * 1.45) * 1.25))
        return w }
      for (let yy = y + 6; yy < y + cs - 5; yy += 2) { const w = hw(yy); if (!w) continue; const off = (Math.abs(yy - g1) < 3 ? sh : Math.abs(yy - g2) < 2 ? -sh * 0.6 : 0); k.rect(cx - w + off - 1.4, yy, w * 2, 1.5, k.a(T.accent, 0.55)); k.rect(cx - w + off + 1.4, yy, w * 2, 1.5, k.a(T.headBg, 0.55)); k.rect(cx - w + off, yy, w * 2, 1.1, k.a(T.ink, 0.35)) }
      if (hair === 4) { k.ln([[cx - hr * 0.6, hy - hr * 0.8], [cx - hr * 1.1, hy - hr * 1.9]], k.a(T.accent, 0.9), 0.8); k.ln([[cx + hr * 0.6, hy - hr * 0.8], [cx + hr * 1.1, hy - hr * 1.9]], k.a(T.accent, 0.9), 0.8); k.circ(cx - hr * 1.1, hy - hr * 1.9, 1.3, k.a(T.headBg, 1)); k.circ(cx + hr * 1.1, hy - hr * 1.9, 1.3, k.a(T.headBg, 1)) }
      cyGlow(k, cx - hr * 1.15, hy - hr * 0.22, hr * 2.3, 3.2, visor)
      for (let j = 0; j < 4; j++) { const bx = x + 5 + r() * (cs - 14), by = (j % 2 ? g1 : g2) - 1; k.rect(bx, by, 3 + r() * 7, 2, k.a(j % 2 ? T.accent : T.headBg, 0.75)) }
    } },
  { // B: no people at all, just the upgrades everyone is posting
    sub: "CHROME GALLERY // UPGRADES, LIGHTLY USED", kv: (r) => [["FOLLOWERS", `${(10 + r() * 80).toFixed(1)}K`], ["UPGRADES SEEN", `${20 + Math.floor(r() * 80)}`], ["ORIGINAL PARTS", `${2 + Math.floor(r() * 30)}%`]],
    cell(k, x, y, cs, seed, i) {
      const kind = (seed + i) % 5, cx = x + cs / 2 - 2, cy = y + cs * 0.4, z = cs / 54, CH = k.a("#C9CFDA", 1), CD = k.a("#6A7184", 1), N1 = T.accent, N2 = T.headBg
      if (kind === 0) { k.ln([[cx + 12 * z, cy], [cx + 17 * z, cy + 6 * z], [cx + 21 * z, cy + 8 * z]], k.a(N2, 0.8), 1.4); k.circ(cx, cy, 13 * z, CH, CD, 1); k.circ(cx, cy, 9 * z, k.a(N1, 0.25)); k.circ(cx, cy, 8 * z, null, k.a(N1, 1), 1.4); for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2; k.ln([[cx + 7.5 * z * Math.cos(a), cy + 7.5 * z * Math.sin(a)], [cx + 3 * z * Math.cos(a + 1.1), cy + 3 * z * Math.sin(a + 1.1)]], CD, 0.8) } k.circ(cx, cy, 2.6 * z, k.a("#0A0614", 1)); k.circ(cx - 4 * z, cy - 4 * z, 1.6 * z, k.a("#FFFFFF", 0.9)) }
      else if (kind === 1) { k.rect(cx - 9 * z, cy - 2 * z, 18 * z, 16 * z, CH, CD, 0.8); for (let j = 0; j < 4; j++) { const fx = cx - 8 * z + j * 5.4 * z, fl = (j === 1 || j === 2 ? 15 : 12) * z; k.rect(fx, cy - 2 * z - fl, 4 * z, fl * 0.48, CH, CD, 0.6); k.rect(fx, cy - 2 * z - fl * 0.5, 4 * z, fl * 0.48, CH, CD, 0.6); k.circ(fx + 2 * z, cy - 2 * z - fl * 0.5, 0.9 * z, k.a(N2, 1)) } k.poly([[cx + 9 * z, cy + 4 * z], [cx + 16 * z, cy - 3 * z], [cx + 18 * z, cy], [cx + 10 * z, cy + 9 * z]], CH, CD, 0.6); k.rect(cx - 6 * z, cy + 14 * z, 12 * z, 5 * z, CD); k.rect(cx - 5 * z, cy + 6 * z, 10 * z, 1.4 * z, k.a(N1, 1)) }
      else if (kind === 2) { k.ln([[cx, cy - 18 * z], [cx, cy + 14 * z]], k.a(N1, 0.35), 4 * z); k.ln([[cx, cy - 18 * z], [cx, cy + 14 * z]], k.a(N1, 1), 1.2); for (let j = 0; j < 4; j++) { const vy = cy - 16 * z + j * 8 * z, vw = (7 + j * 0.6) * z; k.rect(cx - vw, vy, vw * 2, 5.4 * z, CH, CD, 0.7); k.poly([[cx - vw, vy + 1 * z], [cx - vw - 5 * z, vy + 3 * z], [cx - vw, vy + 4.4 * z]], CD); k.poly([[cx + vw, vy + 1 * z], [cx + vw + 5 * z, vy + 3 * z], [cx + vw, vy + 4.4 * z]], CD); k.circ(cx, vy + 2.7 * z, 1.2 * z, k.a(N2, 1)) } }
      else if (kind === 3) { k.ln([[cx - 4 * z, cy - 10 * z], [cx - 6 * z, cy - 19 * z]], CD, 2.4 * z); k.ln([[cx + 4 * z, cy - 10 * z], [cx + 7 * z, cy - 19 * z]], CD, 2.4 * z); k.circ(cx - 6 * z, cy - 4 * z, 8 * z, CH, CD, 0.8); k.circ(cx + 6 * z, cy - 4 * z, 8 * z, CH, CD, 0.8); k.poly([[cx - 13.4 * z, cy - 1 * z], [cx + 13.4 * z, cy - 1 * z], [cx, cy + 15 * z]], CH); k.ln([[cx - 13.4 * z, cy - 1 * z], [cx, cy + 15 * z], [cx + 13.4 * z, cy - 1 * z]], CD, 0.8); k.rect(cx - 5 * z, cy - 3 * z, 10 * z, 7 * z, k.a("#0A0614", 1), CD, 0.6); k.rect(cx - 4 * z, cy + 0.5 * z, 8 * z, 2.6 * z, k.a(N2, 1)); for (let j = 0; j < 3; j++) k.ln([[cx - 3.5 * z + j * 3.5 * z, cy - 2 * z], [cx - 3.5 * z + j * 3.5 * z, cy + 3 * z]], k.a("#FFFFFF", 0.3), 0.5) }
      else { k.poly([[cx - 15 * z, cy - 8 * z], [cx + 15 * z, cy - 8 * z], [cx + 12 * z, cy + 8 * z], [cx + 4 * z, cy + 15 * z], [cx - 4 * z, cy + 15 * z], [cx - 12 * z, cy + 8 * z]], CH, CD, 0.8); for (let j = 0; j < 5; j++) k.ln([[cx - 8 * z, cy - 3 * z + j * 3 * z], [cx + 8 * z, cy - 3 * z + j * 3 * z]], CD, 0.8); cyGlow(k, cx - 13 * z, cy - 7 * z, 26 * z, 2 * z, N1); ;[-1, 1].forEach(sd => k.circ(cx + sd * 12 * z, cy + 3 * z, 1.4 * z, k.a(N2, 1))) }
      const price = [499, 1250, 899, 2400, 310][kind] + ((seed * 37) % 9) * 10; k.rect(x + cs - 27, y + cs - 11, 22, 8, k.a(T.altBg, 1)); k.t(`${price}C`, x + cs - 16, y + cs - 10.4, 5.5, k.a("#0A0614", 1), { a: "c", w: 22, nofit: true })
    } },
  { // C: nobody shows a face, just generated neon masks
    sub: "CHROME GALLERY // NOBODY SHOWS A FACE", kv: (r) => [["FOLLOWERS", `${(10 + r() * 80).toFixed(1)}K`], ["GHOSTS ONLINE", `${40 + Math.floor(r() * 900)}`], ["REAL FACES", "0"]],
    cell(k, x, y, cs, seed, i) {
      const r = k.rng(seed * 11 + 5), col = [T.headBg, T.accent, T.altBg, T.headBg, T.accent][(seed + i) % 5], n = 7, cell = (cs - 18) / n, ox = x + 9, oy = y + 5, bits = []
      for (let row = 0; row < n; row++) { bits.push([]); for (let c2 = 0; c2 < Math.ceil(n / 2); c2++) bits[row].push(r() < (row === 0 || row === n - 1 ? 0.35 : 0.62)) }
      const on = (row, c2) => bits[row][c2 < Math.ceil(n / 2) ? c2 : n - 1 - c2]
      for (let row = 0; row < n; row++) for (let c2 = 0; c2 < n; c2++) { if (!on(row, c2)) continue; const px = ox + c2 * cell, py = oy + row * cell; k.rect(px - 0.8, py - 0.8, cell + 0.6, cell + 0.6, k.a(col, 0.18)); k.rect(px + 0.4, py + 0.4, cell - 0.8, cell - 0.8, k.a(col, 0.95)) }
      const ey = oy + 2 * cell; ;[2, n - 3].forEach(c2 => { k.rect(ox + c2 * cell, ey, cell, cell, k.a("#0A0614", 1)); k.rect(ox + c2 * cell + cell * 0.3, ey + cell * 0.3, cell * 0.4, cell * 0.4, k.a("#FFFFFF", 1)) })
      const handles = ["@v0idkid", "@rainwire", "@gl1tch", "@n30n_m0m", "@kitsune", "@null.set", "@chromehaus", "@sparkplug"]; k.t(handles[(seed * 3) % handles.length], x + cs / 2, y + cs - 9.5, 5.5, k.a(T.ink, 0.85), { a: "c", w: cs - 4, nofit: true })
    } },
  { // D: the district's own feed: holo koi, drones, rain, vending machines, a chrome cat
    sub: "CHROME GALLERY // THE DISTRICT TONIGHT", kv: (r) => [["FOLLOWERS", `${(10 + r() * 80).toFixed(1)}K`], ["POSTS TODAY", `${100 + Math.floor(r() * 800)}`], ["ADS BETWEEN", `${3 + Math.floor(r() * 9)}`]],
    cell(k, x, y, cs, seed, i) {
      const kind = (seed + i * 2) % 5, cx = x + cs / 2 + (kind === 0 ? -3 : kind === 4 ? 5 : 0), cy = y + cs * 0.44, z = cs / 50, N1 = T.accent, N2 = T.headBg, N3 = T.altBg
      if (kind === 0) { for (let yy = y + 6; yy < y + cs - 12; yy += 3) k.ln([[x + 5, yy], [x + cs - 5, yy]], k.a(N1, 0.07), 0.6); const pts = []; for (let j = 0; j <= 16; j++) { const t = j / 16, a = t * Math.PI * 2; pts.push([cx - 2 * z + 14 * z * Math.cos(a), cy + 6 * z * Math.sin(a) + Math.sin(t * 6) * 0.6 * z]) } k.poly(pts, k.a(N1, 0.25), k.a(N1, 1), 1); k.poly([[cx + 11 * z, cy], [cx + 21 * z, cy - 8 * z], [cx + 18 * z, cy], [cx + 21 * z, cy + 8 * z]], k.a(N1, 0.4), k.a(N1, 1), 0.8); k.poly([[cx - 2 * z, cy - 5 * z], [cx + 4 * z, cy - 12 * z], [cx + 6 * z, cy - 5 * z]], k.a(N1, 0.4), k.a(N1, 1), 0.7); k.circ(cx - 10 * z, cy - 1 * z, 1.2 * z, k.a("#FFFFFF", 1)); k.circ(cx - 1 * z, cy, 2.4 * z, k.a(N2, 0.8)); k.circ(cx + 5 * z, cy - 2 * z, 1.8 * z, k.a(N2, 0.8)) }
      else if (kind === 1) { k.poly([[cx - 3 * z, cy + 2 * z], [cx + 3 * z, cy + 2 * z], [cx + 13 * z, cy + 20 * z], [cx - 13 * z, cy + 20 * z]], k.a(N3, 0.16)); k.rect(cx - 7 * z, cy - 4 * z, 14 * z, 6 * z, k.a("#2A2440", 1), k.a(N1, 1), 0.8); ;[[-11, -8], [11, -8], [-11, 2], [11, 2]].forEach(([dx, dy]) => { k.ln([[cx + dx * 0.55 * z, cy - 1 * z], [cx + dx * z, cy + dy * 0.4 * z]], k.a("#8A8AA0", 1), 0.8); k.ell(cx + dx * z, cy + dy * 0.4 * z - 1 * z, 5 * z, 1.4 * z, k.a(N1, 0.35)) }); k.circ(cx, cy + 2.5 * z, 1.4 * z, k.a("#FF3B3B", 1)) }
      else if (kind === 2) { const cols2 = [N1, N2, N3]; ;[[8, 14], [14, 22], [21, 10], [28, 18], [35, 26]].forEach(([bx, bh2], j) => k.rect(x + bx, y + cs - 14 - bh2, 6, bh2, k.a("#2A2440", 1))); for (let j = 0; j < 9; j++) { const bx = x + 8 + ((j * 13 + seed) % (cs - 16)), by = y + 9 + ((j * 17 + seed * 3) % (cs - 26)), br = (1.6 + (j % 3)) * z; k.circ(bx, by, br, k.a(cols2[j % 3], 0.55)) } for (let j = 0; j < 9; j++) { const sx2 = x + 6 + j * (cs - 12) / 8, sy2 = y + 7 + ((j * 23 + seed) % 14); k.ln([[sx2, sy2], [sx2 - 1, sy2 + 10 * z]], k.a("#BFD8FF", 0.55), 0.7) } k.rect(x + 5, y + cs * 0.62, cs - 10, 1, k.a(T.ink, 0.25)) }
      else if (kind === 3) { k.rect(cx - 11 * z, cy - 17 * z, 22 * z, 33 * z, k.a("#1C1530", 1), k.a(N2, 1), 1); k.rect(cx - 9 * z, cy - 15 * z, 18 * z, 4 * z, k.a(N2, 0.85)); for (let row = 0; row < 3; row++) for (let c2 = 0; c2 < 4; c2++) k.rect(cx - 8 * z + c2 * 4.2 * z, cy - 9 * z + row * 6 * z, 3 * z, 4.6 * z, k.a([N1, N3, N2, "#FFFFFF"][(row + c2) % 4], 0.85)); k.rect(cx - 6 * z, cy + 10 * z, 12 * z, 3 * z, k.a("#0A0614", 1), k.a(N1, 0.7), 0.5) }
      else { k.rect(x + 6, cy + 9 * z, cs - 12, 2 * z, k.a(T.ink, 0.3)); k.rect(x + 6, y + 8, 17, 8, null, k.a(N2, 0.9), 0.7); k.t("OPEN", x + 14.5, y + 8.6, 5.5, k.a(N2, 1), { a: "c", w: 17, nofit: true }); const C2 = k.a("#2A2440", 1); k.ell(cx, cy + 3 * z, 8 * z, 7 * z, C2, k.a(N1, 0.8), 0.6); k.circ(cx + 1 * z, cy - 7 * z, 5.6 * z, C2, k.a(N1, 0.8), 0.6); k.poly([[cx - 3.5 * z, cy - 10 * z], [cx - 2.5 * z, cy - 16 * z], [cx, cy - 11 * z]], C2); k.poly([[cx + 2.5 * z, cy - 11 * z], [cx + 5 * z, cy - 16 * z], [cx + 5.6 * z, cy - 9.5 * z]], C2); k.circ(cx - 1 * z, cy - 7.5 * z, 1.1 * z, k.a(N3, 1)); k.circ(cx + 3 * z, cy - 7.5 * z, 1.1 * z, k.a(N3, 1)); k.rect(cx - 4 * z, cy - 2.5 * z, 9 * z, 1.6 * z, k.a(N2, 1)); k.ln(nCurve([[cx + 7 * z, cy + 8 * z], [cx + 13 * z, cy + 6 * z], [cx + 14 * z, cy - 2 * z]], 4), C2, 2 * z) }
      cyHeart(k, x + 8, y + cs - 7, 1.9, k.a(N2, 1)); k.t(`${(0.4 + ((seed * 7 + i * 13) % 90) / 10).toFixed(1)}K`, x + 12, y + cs - 10, 5.5, k.a(T.ink, 0.85), { w: 30, nofit: true })
    } }
]
const CY = {
  status(k, W, H, d) {
    const wx = d.wx || {}, r = k.rng(31), cx = 62, cy = H / 2 + 4
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, l = i % 5 ? 3 : 7; k.ln([[cx + 46 * Math.cos(a), cy + 46 * Math.sin(a)], [cx + (46 - l) * Math.cos(a), cy + (46 - l) * Math.sin(a)]], k.a(T.accent, i % 5 ? 0.4 : 0.9), 1) }
    glowLn(k, k.arcPts(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * d.batt), T.headBg, 2)
    k.t(wx.temp != null ? `${wx.temp}°` : "--", cx, cy - 14, 22, k.I, { f: "disp", a: "c", w: 80 }); k.t(wx.cond || "NO SIGNAL", cx, cy + 12, 6.5, k.a(T.accent, 1), { a: "c", w: 80 })
    const x0 = 128
    k.t(d.ev ? (d.ev.active ? "JACKED IN · GIG LIVE" : "NEXT GIG") : "OFF THE GRID", x0, 8, 7, k.H, { f: "bold", w: 200 })
    k.para(d.ev ? d.ev.title.toUpperCase() : d.L.noneSub, x0, 20, W - x0 - 14, 14, k.I, "disp", 2, 1.1)
    k.t(d.ev ? `${shortT(d.ev.start)} → ${shortT(d.ev.end)}` : "", x0, 54, 8.5, k.a(T.accent, 1), { w: 200 })
    ;[["FEELS", wx.feels != null ? `${wx.feels}°` : "--", 0.6], ["HI / LO", wx.hi != null ? `${wx.hi}° / ${wx.lo}°` : "--", 0.5], ["BATTERY", pct(d.batt), d.batt]].forEach(([l, v, f], i) => { const y = 72 + i * 15; k.t(l, x0, y, 7, k.S, { w: 60 }); nBars(k, x0 + 62, y + 2, 100, 6, 16, f, k.a(T.accent, 1), k.ia(0.1), 1.5); k.t(v, W - 14, y, 8, k.I, { a: "r", w: 64 }) })
    k.t("CRED +2.1 · RENT DUE 3D · DATA +4.2", x0, H - 14, 6.5, k.a(T.altBg, 1), { w: 220 })
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "GIG TIMER · LIVE" : "GIG STARTS IN") : "OFF THE GRID", 12, 6, 7, k.H, { f: "bold", w: W - 24 })
    k.t(d.ev ? d.ev.title.toUpperCase() : d.L.offTitle.toUpperCase(), 12, 17, 10, k.I, { f: "disp", w: W - 24 })
    notch(k, 10, 46, W - 20, 46, 8, T.headBg, 1.4, k.a(T.ground, 0.5))
    const f = d.ev ? d.frac : 0; nBars(k, 12, 104, W - 24, 8, 20, f, (j, n) => j > n * 0.8 ? k.a(T.headBg, 1) : k.a(T.accent, 1), k.ia(0.1), 1.5)
    for (let i = 0; i < 3; i++) k.rect(12 + i * 40, 116 + (i % 2) * 2, 20 + i * 6, 1.5, k.a(T.accent, 0.6))
    if (d.ev) k.t(`${pct(f)} · OUT ${shortT(d.ev.end)}`, W - 12, 120, 6.5, k.S, { a: "r", w: 120 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200
    notch(k, 8, 6, W - 16, H - 12, 12, T.headBg, 1.4, null)
    k.rect(18, 14, 66, 12, k.a(T.headBg, 1)); k.t(d.archival ? "ARCHIVE" : "SPONSORED", 51, 15.5, 7, k.a(T.ground, 1), { a: "c", w: 64, f: "bold" })
    if (!small) k.t(`HOLO-AD 0x${d.hex} · ${d.cls}`, 92, 16, 7, k.a(T.accent, 1), { w: W - 110 })
    const fs = fitFs(k, d.text.toUpperCase(), W - 36, small ? 4 : 3, small ? 12 : (big ? 20 : 16), "disp"), n = k.para(d.text.toUpperCase(), 18, 32, W - 36, fs, k.a(T.accent, 1), "disp", small ? 4 : 3, 1.12)
    k.t(`— ${d.by}`, 18, 36 + n * fs * 1.12, small ? 6.5 : 7.5, k.S, { w: W - 36 })
    const r = k.rng(parseInt(d.hex, 16)); for (let i = 0; i < 5; i++) { const y = 30 + r() * (H - 50); k.rect(14 + r() * 40, y, 40 + r() * 80, 1.5, k.a(r() > 0.5 ? T.headBg : T.accent, 0.5)) }
    if (!small) { const y = H - 26; k.t("▲ 4.2% · BUY NOW · ZERO INTEREST* · *INTEREST APPLIES", 18, y, 6.5, k.a(T.altBg, 1), { w: W - 36 }); nBars(k, 18, y + 11, W - 36, 3, 40, 0.7, k.a(T.headBg, 1), k.ia(0.1), 1) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, r = k.rng(53), sy = small ? 50 : 52, sh = small ? 56 : 60
    k.t(d.up ? C.solar.day : C.solar.night, 12, 6, 7, k.H, { f: "bold", w: 170 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, 16, small ? 18 : 24, k.I, { f: "disp", w: 120 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 7, k.a(T.accent, 1), { a: "r", w: 160 })
    const arcY = sy + sh, f = d.up ? d.frac : 0.5, px = 12 + (W - 24) * f, py = arcY - Math.sin(Math.PI * f) * (sh - 6)
    glowLn(k, Array.from({ length: 41 }, (_, i) => [12 + (W - 24) * i / 40, arcY - Math.sin(Math.PI * i / 40) * (sh - 6)]), T.accent, 1)
    k.circ(px, py, 6, d.up ? k.a(T.altBg, 1) : k.a(T.accent, 1)); k.circ(px, py, 11, null, k.a(T.altBg, 0.4), 1)
    cySky(k, W, arcY - 30, 30, r); k.rect(0, arcY, W, 1.5, k.a(T.headBg, 1))
    k.t(`RISE ${shortT(d.rise)}`, 12, arcY + 5, 7, k.S, { w: 90 }); k.t(`SET ${shortT(d.set)}`, W - 12, arcY + 5, 7, k.S, { a: "r", w: 90 })
    if (!small) { k.t("SMOG", 120, arcY + 5, 6.5, k.S, { w: 30 }); nBars(k, 146, arcY + 7, 90, 4, 12, 0.35 + r() * 0.5, k.a(T.headBg, 1), k.ia(0.1), 1) }
    if (big && d.atm) {
      for (let gy = 142; gy < H - 30; gy += 12) k.rect(10, gy, W - 20, 0.6, k.a(T.accent, 0.08)); k.t("DISTRICT 09 // AIR SENSORS", 12, 134, 6, k.ia(0.45), { w: 200 })
      atmItems(d.atm).forEach(([l, v], i) => { const x = 12 + (i % 3) * 114, y = 150 + Math.floor(i / 3) * 70; notch(k, x, y, 106, 58, 7, i === 0 ? T.headBg : T.accent, 1, k.a(T.ground, 0.4)); k.t(l, x + 9, y + 7, 6.5, k.S, { w: 56 }); k.t(v, x + 9, y + 20, String(v).length > 4 ? 13 : 16, k.I, { f: "disp", w: 58 }); inst(k, i, x + 70, y + 14, d.atm, { ink: k.a(T.accent, 1), hot: k.a(T.headBg, 1), faint: k.ia(0.12) }) })
      k.t("TOXIC WINDOW: NONE · MASK OPTIONAL · NEON STAYS ON", W / 2, H - 22, 7, k.a(T.altBg, 1), { a: "c", w: W - 20 })
    }
  },
  feed(k, W, H, d) {
    const m = 8; notch(k, m, 8, W - m * 2, H * 0.42, 8, d.side === "yt" ? T.headBg : T.accent, 1.2, k.a(T.ground, 0.5))
    const r = k.rng(d.side.length * 13); for (let i = 0; i < 6; i++) k.rect(m + 4 + r() * 60, 12 + r() * (H * 0.42 - 10), 30 + r() * 70, 2, k.a(r() > 0.5 ? T.headBg : T.accent, 0.4))
    k.poly([[W / 2 - 6, 8 + H * 0.21 - 8], [W / 2 + 9, 8 + H * 0.21], [W / 2 - 6, 8 + H * 0.21 + 8]], k.a(T.accent, 1)); k.t(d.code, m + 12, 12, 6.5, k.H, { w: 60 })
    k.t(d.line.toUpperCase(), m, 8 + H * 0.42 + 5, 11, k.I, { f: "disp", w: W - m * 2 })
    d.meters.forEach(([n, v], i) => { const y = 8 + H * 0.42 + 22 + i * 11; k.t(n, m, y, 6.5, k.S, { w: 66 }); nBars(k, m + 70, y + 2, W - m * 2 - 104, 4, 12, v, k.a(T.accent, 1), k.ia(0.1), 1.5); k.t(pct(v), W - m, y, 6.5, k.I, { a: "r", w: 30 }) })
    k.t(d.tag, m, H - 15, 6.5, k.a(T.altBg, 1), { w: W - m * 2 })
  },
  yt(k, W, H, d) {
    const r = sRng(d, 31), small = W < 200, sw = small ? W - 24 : 200
    notch(k, 12, 8, sw, small ? 80 : 104, 10, T.headBg, 1.3, k.a(T.ground, 0.6))
    for (let i = 0; i < 8; i++) k.rect(16 + r() * (sw - 40), 14 + r() * 90, 20 + r() * 60, 1.5, k.a(r() > 0.5 ? T.headBg : T.accent, 0.35))
    k.circ(12 + sw / 2, 8 + (small ? 40 : 52), 14, null, k.a(T.accent, 1), 1.4); k.poly([[12 + sw / 2 - 5, 8 + (small ? 40 : 52) - 7], [12 + sw / 2 + 8, 8 + (small ? 40 : 52)], [12 + sw / 2 - 5, 8 + (small ? 40 : 52) + 7]], k.a(T.accent, 1))
    k.rect(18, 14, 34, 10, k.a(T.headBg, 1)); k.t("LIVE", 35, 15, 6.5, k.a(T.ground, 1), { a: "c", w: 34, f: "bold" }); k.t(`${(1 + r() * 90).toFixed(1)}K WATCHING`, 58, 15, 6.5, k.I, { w: 120 })
    if (small) return
    const cx = 224
    k.t("CHAT // HOLO-STREAM", cx, 8, 7, k.H, { f: "bold", w: 130 })
    ;["@v0idkid: chrome!!", "@rainwire: buy the dip", "@n30n_m0m: go to sleep", "@gl1tch: is this live", "@corp_bot: SPONSORED"].forEach((m2, i) => k.t(m2, cx, 22 + i * 14, 7.5, i === 4 ? k.a(T.altBg, 1) : i % 2 ? k.I : k.a(T.accent, 1), { w: W - cx - 10 }))
    k.t(`SCREEN TIME ${mmss(600 + r() * 3000)} · HYPE ${60 + Math.floor(r() * 39)}%`, cx, 100, 6.5, k.S, { w: W - cx - 10 })
  },
  ig(k, W, H, d) {
    k = gSafe(k)
    const r = sRng(d, 32), small = W < 200, cols = small ? 3 : 5, cs = small ? 44 : 50, seed = d.seed || 7, S = CY_IG[d.style != null ? d.style : seed % 4]
    // every frame is a different kind of post: glitched portraits, upgrades, masks and the district itself, reshuffled each refresh
    const mix = gShuf(seed * 3 + 1, 4).concat(gShuf(seed * 5 + 2, 4)), n = cols * (small ? 2 : 1)
    for (let i = 0; i < n; i++) { const x = 12 + (i % cols) * (cs + 6), y = 10 + Math.floor(i / cols) * (cs + 6), st = d.style != null ? d.style : mix[i]; notch(k, x, y, cs, cs, 6, i % 2 ? T.accent : T.headBg, 1, k.a(T.ground, 0.55)); CY_IG[st].cell(k, x, y, cs, seed * 5 + i, i) }
    if (small) return
    k.t(S.sub, 12, 70, 7, k.H, { f: "bold", w: 300, lines: 1 })
    S.kv(r).forEach(([l, v], i) => { const x = 12 + i * 112; k.t(l, x, 86, 6.5, k.S, { w: 100, lines: 1 }); k.t(v, x, 96, 14, k.I, { f: "disp", w: 100, lines: 1 }) })
  },
  dc(k, W, H, d) {
    const r = sRng(d, 33), small = W < 200
    k.t("THE NET BAR // BOOTHS", 12, 6, 7, k.H, { f: "bold", w: W - 24 })
    const handles = ["v0idkid", "rainwire", "n30n_m0m", "gl1tch", "sable_x", "kitsune"]
    handles.slice(0, small ? 4 : 6).forEach((h2, i) => { const x = 12 + (i % (small ? 2 : 3)) * (small ? 74 : 66), y = 20 + Math.floor(i / (small ? 2 : 3)) * 46, on = r() > 0.3; notch(k, x, y, small ? 68 : 60, 40, 5, on ? T.accent : T.ink, 0.8, k.a(T.ground, 0.5)); k.rect(x + 8, y + 7, (small ? 68 : 60) - 16, 16, on ? k.a(T.accent, 0.25) : k.ia(0.06)); k.t(`@${h2}`, x + 5, y + 27, 6, on ? k.I : k.S, { w: (small ? 68 : 60) - 8 }); if (on) k.circ(x + (small ? 68 : 60) - 7, y + 6, 2, k.a(T.altBg, 1)) })
    if (small) return
    const cx = 220
    ;["# gigs-board", "# chrome-trades", "# rooftop-raves", "🔊 BOOTH 07"].forEach((c2, i) => { const y = 22 + i * 15; k.t(c2.toUpperCase(), cx, y, 8, i === 3 ? k.H : k.I, { w: 130, f: "bold" }); if (r() > 0.5) k.circ(W - 16, y + 4, 2.5, k.a(T.accent, 1)) })
    k.t(`ONLINE ${3 + Math.floor(r() * 9)} · DRINKS ON THE CORP`, cx, 90, 7, k.a(T.altBg, 1), { w: 140 })
  },
  audio(k, W, H, d) {
    const r = k.rng(Math.floor(d.phase * 100)), cx = 46, cy = 44
    k.ln([[cx, cy + 20], [cx, cy - 26]], k.I, 1.4); for (let i = 1; i <= 3; i++) { glowLn(k, k.arcPts(cx, cy - 26, i * 8, -Math.PI * 0.8, -Math.PI * 0.2, 10), T.accent, 1); glowLn(k, k.arcPts(cx, cy - 26, i * 8, Math.PI * 0.2 - Math.PI, -Math.PI * 1.2 + Math.PI, 2), T.accent, 0.1) }
    notch(k, cx - 26, cy + 4, 52, 26, 5, T.headBg, 1.2, k.a(T.ground, 0.5)); k.t("88.9", cx, cy + 10, 11, k.a(T.altBg, 1), { a: "c", w: 50, f: "bold" })
    k.t(C.audio.src, 92, 12, 8, k.a(T.accent, 1), { w: 250 }); k.t(d.line.toUpperCase(), 92, 24, 15, k.I, { f: "disp", w: W - 106 })
    ;[["FREQ", "88.9 FM"], ["LICENSE", "NONE"], [C.audio.metric, "▮".repeat(d.lvl) + "▯".repeat(5 - d.lvl)]].forEach(([l, v], i) => { const x = 92 + i * 80; k.t(l, x, 52, 6.5, k.S, { w: 76 }); k.t(v, x, 61, 9, i === 1 ? k.H : k.I, { w: 76 }) })
    for (let i = 0; i < 40; i++) { const hh = 4 + Math.abs(Math.sin(i * 0.5 + d.phase)) * 30 * (0.5 + r() * 0.5); k.rect(14 + i * 8.4, 126 - hh, 6, hh, i % 7 === 0 ? k.a(T.headBg, 1) : k.a(T.accent, 0.4 + (hh / 34) * 0.6)) }
    k.t("ON AIR", W - 70, 52, 6.5, k.H, { w: 60, f: "bold" })
  }
}

// ---------- VAPOR PLAZA ----------
function vpSun(k, cx, cy, R) { for (let i = 0; i < R * 2; i += 2) { const y = cy - R + i, hw = Math.sqrt(Math.max(0, R * R - (y - cy) * (y - cy))); if (y > cy && (Math.floor((y - cy) / 4) % 2 === 1)) continue; const t = i / (2 * R); k.rect(cx - hw, y, hw * 2, 2, k.a(t < 0.5 ? "#FFFB96" : T.headBg, 1)) } }
function vpGrid(k, x, y, w, h) { k.rect(x, y, w, h, k.a(T.ground, 0.6)); for (let i = -10; i <= 10; i++) k.ln([[x + w / 2 + i * w / 30, y], [x + w / 2 + i * w / 6, y + h]], k.a(T.headBg, 0.75), 0.7); for (let j = 1; j < 7; j++) { const t = Math.pow(j / 6, 2); k.ln([[x, y + h * t], [x + w, y + h * t]], k.a(T.headBg, 0.75), 0.7) } k.ln([[x, y], [x + w, y]], k.a(T.altBg, 1), 1.2) }
const VP = {
  oddity(k, W, H, d) {
    k = gSafe(k)
    const r = k.rng((d.seed || 7) * 17 + 3), pick = d.pick != null ? d.pick : Math.floor(r() * VP_STORES.length) % VP_STORES.length, status = VP_STATUS[Math.floor(r() * VP_STATUS.length) % VP_STATUS.length], track = VP_TRACKS[Math.floor(r() * VP_TRACKS.length) % VP_TRACKS.length], coins = 100 + Math.floor(r() * 900), floor = 2, TM = (d.now ? d.now.valueOf() : Date.now()) / 60000
    const small = W < 200, big = H > 200, I0 = k.a("#101018", 1), S0 = k.a("#3A3A4A", 1), HOT = k.a(nMix(T.headBg, "#101018", 0.3), 1)
    if (small) { vpMap(k, 8, 6, W - 16, H - 48, pick, coins, TM); k.t(VP_STORES[pick][0], W / 2, H - 39, 12, k.I, { f: "disp", a: "c", w: W - 16, lines: 1 }); k.t(status, W / 2, H - 21, 8, k.a(T.headBg, 1), { a: "c", w: W - 16, lines: 1 }); return }
    winBox(k, 8, 6, W - 16, H - 12, "directory.exe")
    const mapW = big ? W - 28 : 188, mapH = big ? 196 : H - 34
    vpMap(k, 14, 22, mapW, mapH, pick, coins, TM)
    const x0 = big ? 16 : 14 + mapW + 8, y0 = big ? 22 + mapH + 8 : 22, cw = big ? (W - 44) / 2 : W - 14 - x0 - 8
    k.t("STORE OF THE HOUR", x0, y0, 8, S0, { w: cw, lines: 1 })
    k.t(VP_STORES[pick][0], x0, y0 + 10, 14, I0, { f: "disp", w: cw, lines: 1 })
    k.t(status, x0, y0 + 29, 9, HOT, { w: cw, lines: 1 })
    k.t(`UNIT ${201 + pick} · LEVEL ${floor}`, x0, y0 + 40, 8, S0, { w: cw, lines: 1 })
    // floor buttons, the pressed one sunk in
    const bx0 = x0, by0 = y0 + 52; ["L1", "L2", "L3"].forEach((l, i) => { const bx = bx0 + i * 28, on = i + 1 === floor; k.rect(bx, by0, 24, 14, k.a(on ? "#A9A9BC" : "#C3C3D0", 1)); k.rect(bx, by0, 24, 1.2, k.a(on ? "#4A4A5A" : "#FFFFFF", 1)); k.rect(bx, by0, 1.2, 14, k.a(on ? "#4A4A5A" : "#FFFFFF", 1)); k.rect(bx, by0 + 12.8, 24, 1.2, k.a(on ? "#FFFFFF" : "#4A4A5A", 1)); k.rect(bx + 22.8, by0, 1.2, 14, k.a(on ? "#FFFFFF" : "#4A4A5A", 1)); k.t(l, bx + 12, by0 + 2, 9, on ? k.a("#1A1A80", 1) : I0, { a: "c", w: 22, lines: 1 }) })
    const c2x = big ? x0 + cw + 12 : x0, c2y = big ? y0 : y0 + 72
    // fountain coins on a sunken counter, and what's on the speakers
    k.t("FOUNTAIN COINS", c2x, c2y, 8, S0, { w: 80, lines: 1 }); const fw = 46; k.rect(c2x + (big ? 0 : cw - fw), c2y + (big ? 10 : -2), fw, 13, k.a("#FFFFFF", 1)); k.rect(c2x + (big ? 0 : cw - fw), c2y + (big ? 10 : -2), fw, 1.2, k.a("#4A4A5A", 1)); k.rect(c2x + (big ? 0 : cw - fw), c2y + (big ? 10 : -2), 1.2, 13, k.a("#4A4A5A", 1)); k.t(String(coins).padStart(4, "0"), c2x + (big ? fw / 2 : cw - fw / 2), c2y + (big ? 10.5 : -1.5), 10, k.a("#1A1A80", 1), { a: "c", w: fw - 4, lines: 1, f: "bold" })
    const ny = big ? c2y + 32 : c2y + 18; k.rect(c2x, ny + 1, 20, 13, k.a("#1A1028", 1)); k.rect(c2x + 3, ny + 3, 14, 4, k.a("#F4EEF8", 1)); ;[c2x + 6, c2x + 14].forEach(x => { k.circ(x, ny + 10.5, 2, k.a("#333344", 1), k.a("#AAAAAA", 1), 0.5); k.ln([[x - 1.6, ny + 10.5], [x + 1.6, ny + 10.5]], k.a("#AAAAAA", 1), 0.4) })
    k.t("NOW PLAYING", c2x + 25, ny, 7, S0, { w: cw - 26, lines: 1 }); k.t(track, c2x + 25, ny + 8, 9, I0, { w: cw - 38, lines: 1 }); k.t("♪", c2x + cw - 6, ny + 7, 9, HOT, { a: "c", w: 10, lines: 1, nofit: true })
    if (big) { const dy = ny + 24; k.ln([[c2x, dy - 4], [c2x + cw, dy - 4]], k.a("#4A4A5A", 0.5), 0.6); k.t("DIRECTORY", c2x, dy, 8, S0, { w: cw, lines: 1 }); VP_STORES.forEach(([, , nm], i) => { const col = i % 2, row = Math.floor(i / 2), lx = c2x + col * (cw / 2), ly = dy + 11 + row * 11, on = i === pick; if (on) k.rect(lx - 2, ly - 1, cw / 2 - 4, 10.5, k.a(T.headBg, 0.25)); k.t(`${201 + i}`, lx, ly, 8, on ? HOT : S0, { w: 20, lines: 1 }); k.t(nm, lx + 21, ly, 8, on ? I0 : S0, { w: cw / 2 - 25, lines: 1 }) }) }
  },
  status(k, W, H, d) {
    const wx = d.wx || {}
    winBox(k, 10, 6, W - 20, H - 12, "status.exe")
    vpSun(k, 56, 70, 30); vpGrid(k, 18, 86, 76, 40)
    const x0 = 106, I0 = k.a("#101018", 1), S0 = k.a("#3A3A4A", 1)
    k.t(d.ev ? (d.ev.active ? "NOW SHOWING" : "COMING UP") : "NOTHING SCHEDULED", x0, 24, 9, k.a("#1A1A80", 1), { w: 200 })
    k.para(d.ev ? d.ev.title : "Enjoy the atrium.", x0, 36, W - x0 - 20, 15, I0, "disp", 2, 1.08)
    k.t(d.ev ? `${shortT(d.ev.start)} - ${shortT(d.ev.end)}` : "", x0, 72, 11, S0, { w: 200 })
    ;[["TEMP", wx.temp != null ? `${wx.temp}°` : "--"], ["FEELS", wx.feels != null ? `${wx.feels}°` : "--"], ["POWER", pct(d.batt)]].forEach(([l, v], i) => { const x = x0 + i * 78; k.rect(x, 92, 70, 28, k.a("#FFFFFF", 1)); k.rect(x, 92, 70, 1.5, k.a("#4A4A5A", 1)); k.rect(x, 92, 1.5, 28, k.a("#4A4A5A", 1)); k.t(l, x + 5, 94, 8, S0, { w: 60 }); k.t(v, x + 5, 104, 12, I0, { w: 60 }) })
  },
  shift(k, W, H, d) {
    winBox(k, 6, 6, W - 12, H - 12, "loading.exe")
    const I0 = k.a("#101018", 1)
    k.t(d.ev ? (d.ev.active ? "Now loading..." : "Please wait...") : "Screensaver mode", 14, 26, 11, I0, { w: W - 28 })
    k.t(d.ev ? d.ev.title : "", 14, 40, 10, k.a("#1A1A80", 1), { f: "disp", w: W - 28 })
    k.rect(14, 96, W - 28, 16, k.a("#FFFFFF", 1)); k.rect(14, 96, W - 28, 1.5, k.a("#4A4A5A", 1)); const f = d.ev ? d.frac : 0, n = 14
    for (let i = 0; i < Math.round(f * n); i++) k.rect(17 + i * ((W - 34) / n), 99, (W - 34) / n - 2, 10, k.a("#1A1A80", 1))
    k.t(d.ev ? `${pct(f)} complete` : "", 14, 116, 9, I0, { w: W - 28 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, I0 = k.a("#101018", 1)
    winBox(k, 8, 6, W - 16, H - 12, d.archival ? "archive.txt" : "message_from_1995.txt")
    k.circ(30, 42, 11, k.a("#FFFB00", 1), I0, 1); k.t("!", 30, 33, 14, I0, { f: "heavy", a: "c", w: 14 })
    const fs = fitFs(k, d.text, W - 70, small ? 4 : 3, small ? 13 : (big ? 20 : 16), "disp"), n = k.para(d.text, 50, 28, W - 70, fs, I0, "disp", small ? 4 : 3, 1.12)
    k.t(`— ${d.by}`, 50, 32 + n * fs * 1.12, small ? 8 : 9, k.a("#3A3A4A", 1), { w: W - 70 })
    if (!small) { k.rect(W / 2 - 30, H - 32, 60, 18, k.a("#C3C3D0", 1), I0, 1); k.t("OK", W / 2, H - 29, 11, I0, { a: "c", w: 50 }); k.rect(W / 2 + 40, H - 32, 70, 18, k.a("#C3C3D0", 1), k.a("#4A4A5A", 1), 1); k.t("Cancel", W / 2 + 75, H - 29, 11, I0, { a: "c", w: 60 }) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, top = 28, sh = small ? 56 : 62
    for (let i = 0; i < sh; i += 2) k.rect(8, top + i, W - 16, 2, k.a(i < sh / 2 ? T.ground : T.headBg, 0.4 + i / sh * 0.5))
    const f = d.up ? d.frac : 0.5, px = 20 + (W - 40) * f, py = top + sh - 4 - Math.sin(Math.PI * f) * (sh - 22)
    vpSun(k, px, py, small ? 14 : 18); vpGrid(k, 8, top + sh, W - 16, small ? 26 : 30)
    k.t(d.up ? C.solar.day : C.solar.night, 12, 6, 9, k.a(T.altBg, 1), { w: 160 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, 14, 12, k.I, { f: "disp", w: 80 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 9, k.a(T.altBg, 1), { a: "r", w: 160 })
    k.t(`RISE ${shortT(d.rise)}`, 12, top + sh + (small ? 28 : 34), 9, k.S, { w: 90 }); k.t(`SET ${shortT(d.set)}`, W - 12, top + sh + (small ? 28 : 34), 9, k.S, { a: "r", w: 90 })
    if (big && d.atm) {
      atmItems(d.atm).forEach(([l, v], i) => { const x = 12 + (i % 3) * 114, y = 150 + Math.floor(i / 3) * 76; winBox(k, x, y, 106, 64, `${({ PRECIP: 'rain', HUMIDITY: 'damp', UV: 'uv', VISIBILITY: 'sight', DEW: 'dew', WIND: 'wind' })[l] || l.toLowerCase()}.dat`); k.t(v, x + 8, y + 24, String(v).length > 4 ? 13 : 16, k.a("#101018", 1), { f: "disp", w: 58 }); inst(k, i, x + 70, y + 24, d.atm, { ink: k.a("#1A1A80", 1), hot: k.a(T.headBg, 1), faint: k.a("#101018", 0.15) }) })
      k.t("Thank you for visiting the eternal sunset.", W / 2, H - 22, 11, k.a(T.altBg, 1), { a: "c", w: W - 30 })
    }
  },
  feed(k, W, H, d) {
    const m = 6, r = k.rng(d.side.length * 7)
    winBox(k, m, 6, W - m * 2, H - 12, d.side === "yt" ? "channel_1.tv" : "channel_2.tv")
    const sx = m + 6, sy = 24, sw = W - m * 2 - 12, sh = H * 0.36
    k.rect(sx, sy, sw, sh, k.a("#101018", 1)); for (let i = 0; i < 90; i++) k.rect(sx + r() * sw, sy + r() * sh, 1.5, 1, k.a("#FFFFFF", r() * 0.6)); for (let y = sy; y < sy + sh; y += 3) k.rect(sx, y, sw, 1, k.a(T.headBg, 0.08))
    k.t(d.code, sx + 4, sy + 3, 8, k.a(T.altBg, 1), { w: 60 })
    const I0 = k.a("#101018", 1)
    k.t(d.line, sx, sy + sh + 4, 12, I0, { f: "disp", w: sw })
    d.meters.forEach(([n, v], i) => { const y = sy + sh + 22 + i * 12; k.t(n, sx, y, 8, k.a("#3A3A4A", 1), { w: 62 }); k.rect(sx + 66, y + 2, sw - 100, 6, k.a("#FFFFFF", 1)); k.rect(sx + 66, y + 2, (sw - 100) * v, 6, k.a("#1A1A80", 1)); k.t(pct(v), sx + sw, y, 8, I0, { a: "r", w: 30 }) })
  },
  yt(k, W, H, d) {
    const r = sRng(d, 51), small = W < 200, I0 = k.a("#101018", 1)
    const tw = small ? W - 24 : 190, th2 = small ? 70 : 84
    k.rect(12, 10, tw, th2, k.a("#1A1028", 1)); k.rect(12 + tw * 0.12, 10 + th2 * 0.22, tw * 0.76, th2 * 0.5, k.a("#F4EEF8", 1)); k.t("BE KIND, REWIND", 12 + tw / 2, 10 + th2 * 0.28, 10, I0, { a: "c", w: tw * 0.7 }); k.t(pick2(r, ["SUNSET_MIX_95", "MALL_TOUR_VOL2", "FOUNTAIN_CAM", "PALMS_4HRS"]), 12 + tw / 2, 10 + th2 * 0.42, 9, k.a(T.headBg, 1), { a: "c", w: tw * 0.7 })
    ;[0.22, 0.78].forEach(f => { k.circ(12 + tw * f, 10 + th2 * 0.85, 7, k.a("#333344", 1), k.a("#AAAAAA", 1), 1); for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2 + d.seed; k.ln([[12 + tw * f, 10 + th2 * 0.85], [12 + tw * f + 6 * Math.cos(a), 10 + th2 * 0.85 + 6 * Math.sin(a)]], k.a("#AAAAAA", 1), 0.6) } })
    if (small) return
    const rx = 216
    k.t("VHS // NOW PLAYING", rx, 10, 10, k.a(T.altBg, 1), { w: 140 })
    ;["◀◀", "▶", "■", "▶▶"].forEach((b, i) => { k.rect(rx + i * 34, 28, 30, 18, k.a("#C3C3D0", 1), k.a("#4A4A5A", 1), 1); k.t(b, rx + i * 34 + 15, 30, 9, I0, { a: "c", w: 28 }) })
    k.t(`TRACKING ${["▮▮▮▯▯", "▮▮▯▯▯", "▮▮▮▮▯"][Math.floor(r() * 3)]}`, rx, 56, 10, k.I, { w: 140 }); k.t(`TAPE TIME ${mmss(600 + r() * 3000)}`, rx, 70, 10, k.I, { w: 140 }); k.t("SP · HI-FI STEREO", rx, 84, 10, k.S, { w: 140 })
  },
  ig(k, W, H, d) {
    const r = sRng(d, 52), small = W < 200, n = small ? 2 : 3, pw = small ? 66 : 92, ph = small ? 52 : 64
    for (let i = 0; i < n; i++) { const x = 14 + i * (pw + 12), y = 14 + (i % 2) * 6; k.rect(x + 2, y + 2, pw, ph, k.ia(0.2)); k.rect(x, y, pw, ph, k.a("#FFF4FA", 1)); const kind = gShuf((d.seed || 7) * 29 + 1, 8)[i]; vpCard(k, kind, x + 4, y + 4, pw - 8, ph - 18); k.rect(x + pw - 18, y + ph - 14, 12, 10, null, k.a(T.headBg, 1), 1); k.t(VP_CARDS[(kind + (d.seed || 7)) % VP_CARDS.length], x + 4, y + ph - 12, 6.5, k.a("#3A1B4F", 1), { w: pw - 26, nofit: true }) }
    if (small) return
    k.t(`POSTCARDS ${10 + Math.floor(r() * 40)} · SUNSETS ${Math.floor(r() * 99)} · PALMS ∞`, 14, 100, 10, k.a(T.altBg, 1), { w: W - 28 })
  },
  dc(k, W, H, d) {
    const r = sRng(d, 53), small = W < 200, I0 = k.a("#101018", 1)
    winBox(k, 8, 6, W - 16, H - 12, "chatroom.exe")
    const lw = small ? W - 32 : 220
    k.rect(14, 24, lw, H - 38, k.a("#FFFFFF", 1)); k.rect(14, 24, lw, 1.5, k.a("#4A4A5A", 1))
    const lines = [["palmtree95", "anyone at the fountain?"], ["sunsetgrl", "food court in 5"], ["dolphin_dan", "this song is so smooth"], ["mallrat", "brb escalator"], ["vaporkid", "a e s t h e t i c"]]
    lines.slice(0, small ? 4 : 5).forEach(([u, m2], i) => { k.t(`<${u}>`, 18, 28 + i * 14, 9, k.a(["#1A1A80", "#B0207A", "#007070"][i % 3], 1), { w: 80 }); if (!small) k.t(m2, 96, 28 + i * 14, 9, I0, { w: lw - 86 }) })
    if (small) return
    const ux = 240; k.rect(ux, 24, W - ux - 14, H - 38, k.a("#FFFFFF", 1)); k.t(`USERS (${5 + Math.floor(r() * 9)})`, ux + 4, 26, 9, k.a("#1A1A80", 1), { w: 100 }); lines.forEach(([u], i) => k.t(u, ux + 4, 40 + i * 12, 8.5, I0, { w: W - ux - 20 }))
  },
  audio(k, W, H, d) {
    const I0 = k.a("#101018", 1)
    k.rect(10, 14, 74, 48, k.a("#1A1028", 1)); k.rect(16, 20, 62, 22, k.a("#F4EEF8", 1)); k.t("SIDE B", 47, 22, 8, k.a(T.headBg, 1), { a: "c", w: 60 }); k.t("MALLSOFT", 47, 31, 7, I0, { a: "c", w: 60 })
    ;[30, 64].forEach(x => { k.circ(x, 52, 6, k.a("#333344", 1), k.a("#AAAAAA", 1), 1); for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2 + d.phase; k.ln([[x, 52], [x + 6 * Math.cos(a), 52 + 6 * Math.sin(a)]], k.a("#AAAAAA", 1), 0.6) } })
    k.t(C.audio.src, 92, 12, 10, k.a(T.altBg, 1), { w: 250 }); k.t(d.line, 92, 24, 17, k.I, { f: "disp", w: W - 106 })
    ;[["TAPE", "C-90"], ["DOLBY", "ON"], [C.audio.metric, "▮".repeat(d.lvl) + "▯".repeat(5 - d.lvl)]].forEach(([l, v], i) => { const x = 92 + i * 80; k.t(l, x, 52, 9, k.S, { w: 76 }); k.t(v, x, 62, 11, k.I, { w: 76 }) })
    for (let i = 0; i < 24; i++) { const hh = 4 + Math.abs(Math.sin(i * 0.6 + d.phase)) * 28; for (let j = 0; j < hh; j += 4) k.rect(14 + i * 14, 124 - j, 10, 3, k.a(j > 20 ? T.headBg : j > 12 ? T.altBg : "#FFFB96", 1)) }
    k.t("PLAYING", W - 70, 52, 9, k.S, { w: 60 })
  }
}

// ---------- a little music engraving kit (staff notes for the Birdsong widget) ----------
function nCurve(pts, n) { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; for (let j = 0; j < (n || 6); j++) { const t = j / (n || 6), t2 = t * t, t3 = t2 * t; out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]) } } out.push(pts[pts.length - 1]); return out }
function nHead(k, x, y, hollow, col, sp) { sp = sp || 3.2; const pts = []; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, u = 1.08 * sp * Math.cos(a), v = 0.74 * sp * Math.sin(a); pts.push([x + u * Math.cos(-0.38) - v * Math.sin(-0.38), y + u * Math.sin(-0.38) + v * Math.cos(-0.38)]) } if (hollow) { k.poly(pts, k.PN, col, 1.1) } else k.poly(pts, col) }
function nLedger(k, x, n, lineY, col) { for (let m = 10; m <= n; m += 2) k.ln([[x - 5.5, lineY(m, x)], [x + 5.5, lineY(m, x)]], col, 0.7); for (let m = -2; m >= n; m -= 2) k.ln([[x - 5, lineY(m, x)], [x + 5, lineY(m, x)]], col, 0.7) }
function nNote(k, x, y, sc, kind, col) { const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, u = 2.9 * sc * Math.cos(a), v = 2 * sc * Math.sin(a); pts.push([x + u * Math.cos(-0.38) - v * Math.sin(-0.38), y + u * Math.sin(-0.38) + v * Math.cos(-0.38)]) } k.poly(pts, col); const sx = x + 2.5 * sc; k.ln([[sx, y], [sx, y - 11 * sc]], col, 0.9 * sc); if (kind === "e") k.ln(nCurve([[sx, y - 11 * sc], [sx + 3 * sc, y - 7.5 * sc], [sx + 4 * sc, y - 4 * sc], [sx + 2.5 * sc, y - 1.5 * sc]], 4), col, 1 * sc) }
function nClef(k, x, gy, sp, col) {
  // a treble clef drawn as one flowing stroke: spiral around the G line, up into the top loop, down through the stem, ending in a curl
  const u = (a, b) => [x + a * sp, gy + b * sp]
  const sprl = []; for (let i = 0; i <= 26; i++) { const t = i / 26, a = -0.6 + t * Math.PI * 2.15, r = 0.35 + t * 1.05; sprl.push(u(0.2 + r * Math.cos(a) * 0.95, -0.1 + r * Math.sin(a))) }
  const rest = nCurve([sprl[sprl.length - 1], u(1.1, -1.6), u(0.75, -3.4), u(0.2, -5.6), u(-0.3, -4.9), u(-0.15, -3.4), u(0.35, -1.0), u(0.6, 1.6), u(0.45, 3.0), u(-0.1, 3.5), u(-0.7, 3.1)], 5)
  k.ln(nCurve(sprl, 2).concat(rest), col, 1.2); k.ln(rest.slice(18, 34), col, 1.8); k.circ(x - 0.75 * sp, gy + 2.85 * sp, 1.4, col)
}
// ---------- the campfire at dusk, drawn back to front so nothing collides ----------
function nMix(a, b, t) { const h = (c) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), A = h(a), B = h(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join("") }
function naCamp(k, X, Y, W0, H0, r, d) {
  // a taped photo: white border, then the scene inside
  k.rect(X + 2, Y + 2, W0, H0, k.a("#000000", 0.12)); k.rect(X, Y, W0, H0, k.a("#FFFDF6", 1), k.ia(0.25), 0.8)
  const x = X + 4, y = Y + 4, w = W0 - 8, h = H0 - 8, s = Math.min(w / 142, h / 112), hz = y + h * 0.44
  const TM = (d.now ? d.now.valueOf() : Date.now()) / 60000
  // dusk sky, deep teal to a warm glow at the treeline
  for (let i = 0; i < hz - y; i += 2) { const t = i / (hz - y); k.rect(x, y + i, w, 2.2, k.a(nMix("#1C3442", t < 0.7 ? "#4E5A66" : "#D9905A", t < 0.7 ? t / 0.7 : (t - 0.7) / 0.3), 1)) }
  for (let i = 0; i < 16; i++) { const px = x + 4 + r() * (w - 8), py = y + 3 + r() * (hz - y) * 0.5; k.circ(px, py, r() < 0.25 ? 0.9 : 0.5, k.a("#FFF6DA", 0.5 + r() * 0.5)) }
  const mx = x + w * 0.82, my = y + h * 0.13, mr = 5.5 * s; k.circ(mx, my, mr, k.a("#F6EFD2", 1)); k.circ(mx + mr * 0.45, my - mr * 0.25, mr * 0.92, k.a(nMix("#1C3442", "#4E5A66", (my - y) / (hz - y) / 0.7), 1))
  // pines along the horizon, two rows for depth
  const pine = (px, base, ph, col) => { for (let j = 0; j < 3; j++) { const tw2 = ph * (0.42 - j * 0.09), ty = base - ph * (0.14 + j * 0.27); k.poly([[px, ty - ph * 0.3], [px + tw2, ty + ph * 0.06], [px - tw2, ty + ph * 0.06]], col) } k.rect(px - 0.8 * s, base - ph * 0.1, 1.6 * s, ph * 0.12, col) }
  const pineIn = (px, ph) => Math.max(x + ph * 0.43, Math.min(x + w - ph * 0.43, px))
  for (let i = 0; i < 12; i++) { const ph = (16 + r() * 12) * s; pine(pineIn(x + 2 + i * w / 11 + (r() - 0.5) * 6, ph), hz + 2, ph, k.a("#2B4A40", 1)) }
  for (let i = 0; i < 9; i++) { const ph = (22 + r() * 16) * s; pine(pineIn(x + 6 + i * w / 8 + (r() - 0.5) * 8, ph), hz + 6, ph, k.a("#1A2E27", 1)) }
  // the clearing, lit warm around the fire
  k.rect(x, hz + 4, w, y + h - hz - 4, k.a("#2E3B27", 1)); k.ln([[x, hz + 4], [x + w, hz + 4]], k.a("#1A2E27", 1), 1.5)
  const fx = x + w * 0.52, fy = y + h * 0.77, ex = w * 0.36, ey = h * 0.16
  ;[[1.9, 0.08], [1.5, 0.12], [1.1, 0.17], [0.72, 0.24]].forEach(([m, a]) => k.ell(fx, fy, Math.min(ex * m, fx - x - 1, x + w - fx - 1), Math.min(ey * m, y + h - fy - 1, fy - hz - 5), k.a("#E9A04A", a)))
  for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, rr = 0.9 + r() * 1.1; const gx = fx + Math.cos(a) * ex * rr * 1.3, gy = fy + Math.sin(a) * ey * rr * 1.2; if (gy > hz + 8 && gy < y + h - 2 && gx > x + 2 && gx < x + w - 2) k.ln([[gx, gy], [gx - 1, gy - 3 * s], [gx + 0.5, gy], [gx + 1.5, gy - 2.5 * s]], k.a("#4C6B3A", 0.9), 0.6) }
  // a tent off to the left, lantern glowing inside
  const tnx = x + w * 0.14, tny = hz + 13 * s, tw = 19 * s, th = 22 * s
  k.poly([[tnx - tw, tny], [tnx, tny - th], [tnx + tw, tny]], k.a(nMix(T.altBg, "#3A2416", 0.35), 1), k.a("#1A1410", 0.8), 0.8)
  k.poly([[tnx - tw * 0.32, tny], [tnx, tny - th * 0.82], [tnx + tw * 0.32, tny]], k.a("#F2B056", 0.9)); k.poly([[tnx, tny - th * 0.82], [tnx + tw * 0.32, tny], [tnx + tw * 0.46, tny]], k.a(nMix(T.altBg, "#1A1410", 0.55), 1))
  k.ln([[tnx, tny - th], [tnx, tny - th - 3 * s]], k.a("#1A1410", 1), 0.8); k.ln([[tnx - tw, tny], [tnx - tw - 6 * s, tny + 2 * s]], k.a("#C9B79A", 0.6), 0.5); k.ln([[tnx + tw, tny], [tnx + tw + 6 * s, tny + 2 * s]], k.a("#C9B79A", 0.6), 0.5)
  // seats around the fire: back row faces you, front row has its back to you
  const jackets = [T.altBg, T.headBg, "#5B7DA8", "#B9884A", "#8A5A8C", "#C9573E"], skins = ["#F1C8A0", "#C98E62", "#8C5A3A", "#E8B48C", "#6E4430"], hats = [T.headBg, T.altBg, "#E3B341", "#F4EEDF", "#4A6A8A"]
  const seats = [[205, 0], [258, 1], [312, 2], [340, 3], [22, 4], [158, 5]].map(([deg, i]) => { const a = deg * Math.PI / 180; return { i, x: fx + Math.cos(a) * ex * 1.05, y: fy + Math.sin(a) * ey * 1.1 + 2 * s, back: Math.sin(a) < 0, here: r() > 0.3 } })
  const drawSeat = (st) => {
    const bw = 13 * s, bh = 4.6 * s, side = st.x < fx ? 1 : -1
    k.ell(st.x, st.y + bh * 0.7, bw * 1.1, bh * 0.7, k.a("#000000", 0.25))
    k.rect(st.x - bw, st.y - bh / 2, bw * 2, bh, k.a("#7A5532", 1)); k.ell(st.x - bw, st.y, bh * 0.35, bh / 2, k.a("#7A5532", 1)); k.ell(st.x + bw, st.y, bh * 0.38, bh / 2, k.a("#C9A271", 1), k.a("#4A3220", 1), 0.5); k.ln([[st.x - bw, st.y - bh / 2], [st.x + bw, st.y - bh / 2]], k.a("#4A3220", 1), 0.6); k.ln([[st.x - bw * 0.6, st.y + 0.5], [st.x + bw * 0.4, st.y + 0.5]], k.a("#4A3220", 0.6), 0.5)
    if (!st.here) { k.rect(st.x + bw * 0.35, st.y - bh / 2 - 4 * s, 3.2 * s, 4 * s, k.a("#E9E2D0", 1), k.a("#1A1410", 0.7), 0.5); return }
    const jc = k.a(jackets[st.i % jackets.length], 1), sk = k.a(skins[st.i % skins.length], 1), hc = k.a(hats[st.i % hats.length], 1), ink = k.a("#1A1410", 0.85), by = st.y - bh / 2
    // behind the fire they face you; in front of it you see their backs. Each holds a short stick out over the flames
    const faces = st.back, dxF = fx - st.x, dyF = (fy - 9 * s) - (by - 7 * s), dl = Math.hypot(dxF, dyF), L = Math.min(dl * 0.62, 17 * s)
    const hx = st.x + side * 4.5 * s, hy = by - 6.5 * s, tipx = hx + dxF / dl * L, tipy = hy + dyF / dl * L
    k.poly([[st.x - 5.2 * s, by], [st.x - 4 * s, by - 10 * s], [st.x + 4 * s, by - 10 * s], [st.x + 5.2 * s, by]], jc, ink, 0.6)
    if (faces) { k.ln([[st.x + side * 3.4 * s, by - 8.5 * s], [hx, hy]], jc, 1.8 * s); k.ln([[hx, hy], [tipx, tipy]], k.a("#B98B5A", 1), 0.8 * s) }
    k.circ(st.x, by - 13.5 * s, 3.9 * s, faces ? sk : k.a(nMix(skins[st.i % skins.length], "#2A1A10", 0.55), 1), ink, 0.6)
    k.poly(k.arcPts(st.x, by - 14.2 * s, 4.1 * s, Math.PI, Math.PI * 2, 10), hc); k.circ(st.x, by - 18.6 * s, 1.3 * s, hc)
    if (faces) { k.circ(st.x - 1.4 * s, by - 13 * s, 0.5 * s, ink); k.circ(st.x + 1.4 * s, by - 13 * s, 0.5 * s, ink); k.arc(st.x, by - 12.2 * s, 1.2 * s, 0.4, Math.PI - 0.4, ink, 0.4) }
    else { k.ln([[st.x + side * 3.6 * s, by - 8.5 * s], [hx + side * 1.5 * s, hy - 0.5 * s]], jc, 1.8 * s); k.ln([[hx + side * 1.5 * s, hy - 0.5 * s], [tipx, tipy]], k.a("#B98B5A", 1), 0.8 * s) }
    k.ell(tipx, tipy, 1.8 * s, 1.4 * s, k.a(st.i % 2 ? "#FFF6E8" : "#D9A066", 1), k.a("#7A5532", 0.7), 0.4)
  }
  seats.filter(st => st.back).sort((a2, b2) => a2.y - b2.y).forEach(drawSeat)
  // the fire: a ring of stones, crossed logs, three layers of flame, sparks and a curl of smoke
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; k.ell(fx + Math.cos(a) * 11 * s, fy + Math.sin(a) * 4.2 * s, 2.8 * s, 2 * s, k.a(i % 2 ? "#8C8A80" : "#A7A496", 1), k.a("#3A3830", 1), 0.4) }
  k.ln([[fx - 9 * s, fy + 2 * s], [fx + 9 * s, fy - 3 * s]], k.a("#5A3A22", 1), 2.4 * s); k.ln([[fx - 9 * s, fy - 3 * s], [fx + 9 * s, fy + 2 * s]], k.a("#6B4A2A", 1), 2.4 * s)
  const fl = (sc, col, ph) => { const pts = [], n = 14; for (let i = 0; i <= n; i++) { const t = i / n, a = Math.PI + t * Math.PI; const tongue = 1 + 0.55 * Math.max(0, Math.sin(t * Math.PI * 3 + ph + TM * 0.7)); pts.push([fx + Math.cos(a) * 7 * s * sc, fy - 1 * s + Math.sin(a) * 15 * s * sc * tongue * (0.6 + 0.4 * Math.sin(t * Math.PI))]) } k.poly(pts.concat([[fx + 7 * s * sc, fy - 1 * s], [fx - 7 * s * sc, fy - 1 * s]]), k.a(col, 1)) }
  fl(1, "#C8412A", 0.2); fl(0.72, "#F08A2E", 1.4); fl(0.42, "#FFD25A", 2.6)
  for (let i = 0; i < 14; i++) { const t = r(), px = fx + (r() - 0.5) * 18 * s + Math.sin(t * 9 + TM) * 4 * s, py = fy - 16 * s - t * (fy - hz) * 0.9; k.circ(px, py, (0.5 + r() * 0.5) * s, k.a(r() < 0.5 ? "#FFD25A" : "#F08A2E", 0.9 - t * 0.7)) }
  for (let i = 0; i < 9; i++) { const t = i / 8; k.ell(fx + 4 * s + t * 20 * s + Math.sin(t * 6 + TM * 0.3) * 3 * s, fy - 24 * s - t * 30 * s, (1.6 + t * 3.4) * s, (1 + t * 1.6) * s, k.a("#D8D2C8", 0.13 - t * 0.012)) }
  seats.filter(st => !st.back).sort((a2, b2) => a2.y - b2.y).forEach(drawSeat)
  const mat = k.a("#FFFDF6", 1); k.rect(X, Y, W0, 4, mat); k.rect(X, Y + H0 - 4, W0, 4, mat); k.rect(X, Y, 4, H0, mat); k.rect(X + W0 - 4, Y, 4, H0, mat); k.rect(X, Y, W0, H0, null, k.ia(0.25), 0.8)
  naTape(k, X + W0 / 2, Y + 1, -0.04)
  return seats.filter(st => st.here).map(st => st.i)
}
// ---------- FIELD GUIDE: six specimens drawn for the plate ----------
const NA_SPECIES = [
  { n: "Red Fox", l: "Vulpes vulpes", f: "Its bushy tail helps it balance and keeps it warm.", cm: 100, bar: 20, size: "ABOUT 1 M, WITH TAIL", act: "DUSK AND DAWN", eats: "VOLES, BERRIES", call: "A SHARP BARK", d: "fox" },
  { n: "Monarch Butterfly", l: "Danaus plexippus", f: "Some fly thousands of miles to spend winter in Mexico.", cm: 11, bar: 2, size: "10 CM WINGSPAN", act: "SUNNY DAYS", eats: "MILKWEED NECTAR", call: "SILENT", d: "monarch" },
  { n: "Great Horned Owl", l: "Bubo virginianus", f: "Its 'horns' are only tufts of feathers.", cm: 60, bar: 10, size: "ABOUT 55 CM TALL", act: "NIGHT", eats: "MICE, RABBITS", call: "HOO H'HOO HOO HOO", d: "owl" },
  { n: "Eastern Chipmunk", l: "Tamias striatus", f: "Carries food home in stretchy cheek pouches.", cm: 30, bar: 5, size: "ABOUT 25 CM", act: "DAYTIME", eats: "NUTS, SEEDS", call: "CHIP-CHIP-CHIP", d: "chipmunk" },
  { n: "Fly Agaric", l: "Amanita muscaria", f: "Beautiful and poisonous. Look, don't touch.", cm: 24, bar: 5, size: "CAP 8 TO 20 CM", act: "LATE SUMMER, FALL", eats: "GROWS UNDER BIRCH", call: "NONE (IT'S A MUSHROOM)", d: "agaric" },
  { n: "Ruby-throated Hummingbird", l: "Archilochus colubris", f: "Beats its wings about 50 times a second.", cm: 12, bar: 2, size: "ABOUT 8 CM", act: "DAYTIME", eats: "NECTAR, TINY INSECTS", call: "A HIGH CHIP", d: "humming" }
]
const NA_WHERE = ["NEAR YOUR WINDOW", "AT THE FOREST EDGE", "ON A FALLEN LOG", "IN THE TALL GRASS", "BY THE CREEK"]
function naSpecimen(k, kind, cx, cy, z) {
  const P = (u, v) => [cx + u * z, cy + v * z], Q = (pts) => pts.map(([u, v]) => P(u, v)), C = (pts, n) => nCurve(Q(pts), n || 5), I = k.a("#1F2A22", 1), lw = Math.max(0.5, 0.6 * z)
  const fill = (pts, col, smooth) => k.poly(smooth === false ? Q(pts) : C(pts.concat([pts[0]])), k.a(col, 1), I, lw)
  const sh = (u, v, rx) => k.ell(...P(u, v), rx * z, rx * 0.16 * z, k.a("#000000", 0.16))
  const tuft = (u, v, n) => { for (let i = 0; i < n; i++) k.ln([P(u + i * 2.4, v), P(u + i * 2.4 + (i % 2 ? 1.4 : -1.2), v - 5 - (i % 3) * 2.5)], k.a("#5E8A44", 1), Math.max(0.6, 0.7 * z)) }
  if (kind === "fox") {
    sh(-2, 41, 36); tuft(-34, 41, 5); tuft(18, 41, 6)
    fill([[-12, 37], [-30, 39], [-41, 31], [-43, 18], [-38, 9], [-33, 15], [-33, 26], [-22, 31], [-10, 31]], "#C2662D"); k.circ(...P(-38.6, 11.5), 4.6 * z, k.a("#F4EEDF", 1), I, lw)
    fill([[-16, 39], [-22, 20], [-16, 2], [-6, -10], [4, -14], [11, -6], [13, 10], [11, 39]], "#C2662D")
    fill([[3, -12], [12, -5], [14, 8], [10, 25], [6, 11], [2, -1]], "#F4EEDF")
    ;[[4.5, 9.5], [11, 16]].forEach(([a, b]) => { k.poly(Q([[a, 18], [b, 18], [b - 0.6, 32], [a + 0.6, 32]]), k.a("#B85A26", 1), I, lw); k.poly(C([[a + 0.4, 31], [b - 0.4, 31], [b + 0.8, 38], [b, 40], [a - 1, 40], [a - 0.6, 37], [a + 0.4, 31]]), k.a("#2A1E16", 1), I, lw) })
    k.ln(Q([[-16, 30], [-12, 40], [-4, 40]]), I, lw); k.poly(Q([[-12, 36], [-4, 36], [-3, 40], [-14, 40]]), k.a("#2A1E16", 1))
    fill([[-2, -18], [0, -28], [-1, -39], [6, -31], [12, -31], [16, -40], [17, -28], [30, -22], [31, -19], [22, -15], [10, -12], [2, -12]], "#C2662D", false)
    k.poly(Q([[0, -30], [-0.5, -37], [4.5, -31]]), k.a("#2A1E16", 1)); k.poly(Q([[13, -31], [15.5, -38], [16, -30]]), k.a("#2A1E16", 1))
    k.poly(Q([[14, -20], [30, -21], [31, -19], [22, -15], [12, -15]]), k.a("#F4EEDF", 1)); k.circ(...P(31, -20.5), 1.7 * z, I)
    k.ell(...P(18, -25), 2 * z, 1.2 * z, I); k.circ(...P(18.6, -25.4), 0.45 * z, k.a("#FFFFFF", 1))
    k.ln(Q([[-6, -6], [-10, 6], [-12, 16]]), k.a("#9A4E22", 0.8), lw)
  } else if (kind === "monarch") {
    const O = "#E8862A", B = "#1E1A16", wing = (sd) => { const m = (pts) => pts.map(([u, v]) => [u * sd, v])
      k.poly(C(m([[2, -3], [9, -19], [25, -31], [41, -30], [44, -21], [37, -5], [20, 4], [4, 2], [2, -3]])), k.a(B, 1)); k.poly(C(m([[4, -3], [10, -17], [25, -27], [36, -26], [37, -19], [33, -6], [19, 1], [5, 0], [4, -3]])), k.a(O, 1))
      k.poly(C(m([[3, 3], [19, 4], [33, 11], [35, 23], [25, 33], [10, 31], [3, 17], [3, 3]])), k.a(B, 1)); k.poly(C(m([[5, 5], [18, 6], [30, 12], [31, 22], [24, 29], [11, 27], [5, 16], [5, 5]])), k.a(O, 1))
      ;[[[4, 0], [33, -6]], [[5, -3], [35, -16]], [[7, -8], [27, -26]], [[12, -6], [22, -24]], [[5, 6], [30, 14]], [[5, 10], [26, 26]], [[4, 13], [14, 27]], [[6, 8], [31, 20]]].forEach(([a, b]) => k.ln(Q(m([a, b])), k.a(B, 1), Math.max(0.6, 0.9 * z)))
      ;[[38, -27], [41, -23], [42, -17], [34, -29], [29, -30], [39, -12], [32, 23], [28, 29], [20, 31], [13, 30], [33, 16], [35, 9]].forEach(([u, v]) => k.circ(...P(u * sd, v), 0.9 * z, k.a("#FFFFFF", 1)))
      ;[[30, -21], [33, -17]].forEach(([u, v]) => k.circ(...P(u * sd, v), 1.3 * z, k.a("#F6C86A", 1))) }
    wing(1); wing(-1)
    k.ell(...P(0, 4), 2.3 * z, 14 * z, k.a(B, 1)); k.circ(...P(0, -11), 3 * z, k.a(B, 1)); ;[-3, 1, 5].forEach(v => { k.circ(...P(-1, v), 0.5 * z, k.a("#FFFFFF", 1)); k.circ(...P(1, v), 0.5 * z, k.a("#FFFFFF", 1)) })
    ;[-1, 1].forEach(sd => { k.ln(Q([[sd * 1, -13], [sd * 5, -22], [sd * 8, -31]]), k.a(B, 1), Math.max(0.6, 0.7 * z)); k.circ(...P(sd * 8.3, -31.5), 1.2 * z, k.a(B, 1)) })
    k.ln(Q([[0, -8], [0, -40]]), k.a("#7A7A72", 1), Math.max(0.5, 0.6 * z)); k.circ(...P(0, -40), 2.2 * z, k.a(T.altBg, 1), I, lw)
  } else if (kind === "owl") {
    k.poly(Q([[-44, 34], [44, 32], [44, 39], [-44, 41]]), k.a("#6B4A2A", 1), I, lw); k.ln(Q([[30, 33], [38, 26], [43, 25]]), k.a("#6B4A2A", 1), 1.6 * z); nLeaf(k, ...P(38, 26), 7 * z, -0.6, k.a("#5E8A44", 1))
    fill([[0, -22], [20, -14], [26, 6], [22, 26], [10, 35], [-10, 35], [-22, 26], [-26, 6], [-20, -14]], "#8A6A44")
    ;[-1, 1].forEach(sd => { k.poly(C([[sd * 26, 2], [sd * 20, -12], [sd * 14, 8], [sd * 16, 31], [sd * 23, 25], [sd * 26, 2]]), k.a("#6B4E30", 1), I, lw); for (let j = 0; j < 4; j++) k.ln(Q([[sd * 17, 4 + j * 6], [sd * 23, 1 + j * 6]]), k.a("#4A3420", 1), lw) })
    fill([[0, -9], [14, -1], [16, 18], [10, 32], [-10, 32], [-16, 18], [-14, -1]], "#D9C29A")
    for (let row = 0; row < 5; row++) for (let c = -2; c <= 2; c++) { const u = c * 5.6 + (row % 2) * 2.8, v = 2 + row * 6; if (Math.abs(u) < 14 - row * 0.4) k.ln(Q([[u - 2, v], [u, v + 1], [u + 2, v]]), k.a("#5A4128", 1), lw) }
    k.ell(...P(0, -8), 9 * z, 3.4 * z, k.a("#F4EEDF", 1))
    ;[-1, 1].forEach(sd => k.poly(C([[sd * 10, -32], [sd * 19, -38], [sd * 25, -46], [sd * 21, -33], [sd * 18, -27]]), k.a("#6B4E30", 1), I, lw))
    fill([[-18, -13], [-21, -26], [-17, -34], [0, -37], [17, -34], [21, -26], [18, -13]], "#8A6A44")
    ;[-1, 1].forEach(sd => { k.circ(...P(sd * 8, -24), 9 * z, k.a("#C98A4A", 1)); k.arc(...P(sd * 8, -24), 9 * z, sd > 0 ? -1.2 : Math.PI - 1.8, sd > 0 ? 1.8 : Math.PI + 1.2, k.a("#3A2416", 1), lw) })
    ;[-1, 1].forEach(sd => { k.circ(...P(sd * 7.5, -24), 4.8 * z, k.a("#F2C230", 1), I, lw); k.circ(...P(sd * 7.5, -24), 2.6 * z, I); k.circ(...P(sd * 6.6, -25), 0.8 * z, k.a("#FFFFFF", 1)); k.ln(Q([[sd * 1, -21], [sd * 12, -32]]), k.a("#F4EEDF", 1), lw) })
    k.poly(Q([[-2, -20], [2, -20], [0, -15]]), k.a("#3A3A36", 1))
    ;[-7, 7].forEach(u => { for (let j = -1; j <= 1; j++) k.ln(Q([[u + j * 2, 31], [u + j * 2.6, 36]]), k.a("#C9B27A", 1), Math.max(0.7, 1.1 * z)) })
  } else if (kind === "chipmunk") {
    sh(0, 38, 40); k.poly(Q([[-40, 24], [36, 24], [40, 30], [36, 37], [-40, 37]]), k.a("#7A5532", 1), I, lw); k.ell(...P(37, 30.5), 3.6 * z, 6.5 * z, k.a("#C9A271", 1), I, lw); k.ell(...P(37, 30.5), 1.6 * z, 3.2 * z, null, k.a("#7A5532", 1), lw); k.ln(Q([[-34, 29], [-10, 29]]), k.a("#4A3220", 1), lw); k.ln(Q([[0, 33], [26, 33]]), k.a("#4A3220", 1), lw); tuft(-38, 24, 4)
    fill([[-12, 18], [-25, 9], [-33, -9], [-30, -26], [-22, -16], [-18, 0], [-8, 12]], "#8A5A34"); k.ln(C([[-28, -22], [-29, -8], [-22, 6]]), k.a("#C9A271", 1), lw)
    fill([[-16, 24], [-18, 6], [-10, -6], [4, -10], [14, -6], [18, 4], [16, 18], [8, 24]], "#B87A44")
    k.poly(C([[4, 8], [16, 6], [16, 18], [8, 23], [2, 18], [4, 8]]), k.a("#F0DFC0", 1))
    k.ln(C([[-16, 6], [-8, -5], [6, -9]]), k.a("#3A2416", 1), 2 * z); k.ln(C([[-15, 10], [-6, -1], [8, -5]]), k.a("#F4EEDF", 1), 1.4 * z); k.ln(C([[-14, 14], [-4, 3], [10, -1]]), k.a("#3A2416", 1), 1.6 * z)
    fill([[6, -8], [10, -18], [18, -22], [26, -18], [30, -12], [28, -6], [18, -2], [10, -2]], "#B87A44", false)
    k.ell(...P(20, -7), 7 * z, 5 * z, k.a("#C98E58", 1), I, lw); k.ln(Q([[29, -12], [21, -15], [12, -17]]), k.a("#3A2416", 1), 1.1 * z); k.ln(Q([[28, -10], [20, -11], [13, -12]]), k.a("#F4EEDF", 1), 0.9 * z)
    k.circ(...P(12, -21), 3 * z, k.a("#B87A44", 1), I, lw); k.circ(...P(21, -15), 1.8 * z, I); k.circ(...P(21.6, -15.6), 0.5 * z, k.a("#FFFFFF", 1)); k.circ(...P(30, -12), 1.3 * z, I)
    ;[[30, -11, 38, -14], [30, -11, 38, -9]].forEach(([a, b, c, e]) => k.ln(Q([[a, b], [c, e]]), k.ia(0.5), 0.4))
    k.ell(...P(25, 1), 3.4 * z, 4 * z, k.a("#9A6A3A", 1), I, lw); k.poly(k.arcPts(...P(25, -1.5), 3.8 * z, Math.PI, Math.PI * 2, 8), k.a("#6B4A2A", 1)); k.ln(Q([[25, -5.5], [25, -7]]), k.a("#6B4A2A", 1), lw)
    k.ell(...P(20, 3), 2.2 * z, 1.6 * z, k.a("#B87A44", 1), I, lw); k.ell(...P(-8, 23), 5 * z, 2 * z, k.a("#B87A44", 1), I, lw)
  } else if (kind === "agaric") {
    k.ell(...P(0, 39), 40 * z, 5.5 * z, k.a("#6E9E4C", 1)); for (let i = 0; i < 9; i++) k.circ(...P(-34 + i * 8.5, 37.5 - (i % 2)), 2.4 * z, k.a("#5E8A44", 1)); tuft(-38, 38, 4); tuft(30, 38, 4)
    const shroom = (u0, sc, cap) => { const S2 = (pts) => pts.map(([u, v]) => [u0 + u * sc, 36 + v * sc])
      k.poly(C(S2([[-6, 0], [-8, -14], [-6, -32], [5, -32], [6, -14], [5, 0], [-6, 0]])), k.a("#F4EEDF", 1), I, lw); k.ell(...P(u0, 36 - 2 * sc), 9 * sc * z, 4 * sc * z, k.a("#EDE4CF", 1), I, lw); k.ln(Q(S2([[-7, -4], [6, -4]])), k.ia(0.4), lw)
      if (cap === "big") { k.poly(Q(S2([[-9, -27], [8, -27], [11, -22], [-12, -22]])), k.a("#FFFFFF", 1), I, lw); for (let i = 0; i < 6; i++) k.ln(Q(S2([[-10 + i * 4, -22], [-9.5 + i * 4, -20]])), k.ia(0.4), lw) }
      k.ell(...P(u0, 36 - 34 * sc), 26 * sc * z, 4 * sc * z, k.a("#F2E8D2", 1), I, lw); for (let i = -10; i <= 10; i += 2) k.ln(Q(S2([[i * 2.2, -34], [i * 0.6, -31.5]])), k.ia(0.3), 0.4)
      k.poly(C(S2(cap === "big" ? [[-28, -34], [-22, -52], [-2, -62], [18, -54], [26, -36], [-28, -34]] : [[-24, -34], [-22, -52], [-4, -64], [16, -54], [22, -36], [-24, -34]])), k.a("#D9372B", 1), I, lw)
      k.ln(C(S2([[-20, -46], [-6, -57], [10, -52]])), k.a("#F07A5A", 0.6), Math.max(0.8, 1.6 * z * sc))
      ;[[-14, -44, 2.4], [-2, -55, 2.8], [10, -47, 2.2], [-20, -38, 1.7], [4, -40, 1.8], [16, -40, 1.6], [-8, -50, 1.5], [18, -50, 1.4]].forEach(([u, v, rr]) => k.ell(...P(u0 + u * sc, 36 + v * sc), rr * sc * z, rr * 0.8 * sc * z, k.a("#FFF8EC", 1), k.ia(0.25), 0.4)) }
    shroom(22, 0.55, "small"); shroom(-8, 0.95, "big")
  } else {
    const st = (pts) => k.ln(C(pts), k.a("#4E7A3C", 1), Math.max(0.8, 1.4 * z)); st([[-40, 44], [-36, 20], [-32, 0], [-30, -16]]); nLeaf(k, ...P(-36, 22), 12 * z, 2.6, k.a("#5E8A44", 1)); nLeaf(k, ...P(-34, 10), 11 * z, -0.4, k.a("#5E8A44", 1))
    const tr = (u, v, a) => { const c2 = Math.cos(a), s2 = Math.sin(a), R2 = (x, y) => [u + x * c2 - y * s2, v + x * s2 + y * c2]; k.poly(Q([R2(0, -2), R2(14, -2.6), R2(19, -6), R2(19, 6), R2(14, 2.6), R2(0, 2)]), k.a("#E0482E", 1), I, lw); k.ln(Q([R2(19, -6), R2(19, 6)]), k.a("#F2B04A", 1), lw) }
    tr(-31, -14, -0.25); tr(-32, -4, 0.15); tr(-33, -24, -0.7)
    // hovering, body tipped back, bill in the top flower
    ;[[1, -27, -0.45, 0.6], [13, -25, 0.4, 0.45]].forEach(([u, v, a, al]) => { const pts = []; for (let i = 0; i < 18; i++) { const t = i / 18 * Math.PI * 2, x2 = 4.2 * Math.cos(t), y2 = 13 * Math.sin(t); pts.push(P(u + x2 * Math.cos(a) - y2 * Math.sin(a), v + x2 * Math.sin(a) + y2 * Math.cos(a))) } k.poly(pts, k.a("#FFFFFF", al), k.ia(0.25), 0.4) })
    k.poly(C([[17, 6], [27, 20], [23, 15], [22, 23], [16, 10], [17, 6]]), k.a("#2E6A44", 1), I, lw)
    fill([[-4, -11], [3, -16], [11, -12], [18, 0], [19, 9], [13, 9], [5, 3], [-1, -4]], "#3E8A5A")
    k.poly(C([[1, -3], [7, 3], [14, 8], [9, 9], [2, 4], [1, -3]]), k.a("#ECEBE0", 1))
    k.circ(...P(-1, -15), 5.6 * z, k.a("#3E8A5A", 1), I, lw)
    k.poly(C([[-4.5, -11.5], [1, -10.5], [3, -6.5], [-0.5, -5], [-3.5, -8], [-4.5, -11.5]]), k.a("#C8312E", 1)); k.ln(Q([[-2.5, -9], [1, -8]]), k.a("#F07A6A", 0.8), lw)
    k.circ(...P(-2.5, -16.5), 1.25 * z, I); k.circ(...P(0, -16.2), 0.7 * z, k.a("#FFFFFF", 1))
    k.ln(Q([[-6, -16.5], [-12.4, -18.6]]), k.a("#2A2420", 1), Math.max(0.7, 0.95 * z))
    ;[[22, -30], [25, -24], [24, -36]].forEach(([u, v]) => k.ln(Q([[u, v], [u + 5, v - 1]]), k.ia(0.3), 0.5))
  }
}
// ---------- MALL DIRECTORY: a lit kiosk map of Level 2 ----------
const VP_STORES = [["Sunset Video", "VIDEO", "Sunset Video"], ["Pretzel Paradise", "PRETZELS", "Pretzels"], ["Laser Tag Galaxy", "LASER TAG", "Laser Tag"], ["Cassette Corner", "CASSETTES", "Cassettes"], ["Palm Tree Imports", "PALMS", "Palm Imports"], ["Arcade 95", "ARCADE", "Arcade 95"], ["Neon Nails", "NAILS", "Neon Nails"], ["Pager World", "PAGERS", "Pager World"]]
function vpLit(hex, alt) { const h = (hex || "#000000").replace("#", ""), v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) > 0.22 ? hex : alt }
const VP_STATUS = ["OPEN FOREVER", "CLOSED SINCE 1997", "ALWAYS ON SALE", "STAFF ON BREAK", "UNDER RENOVATION"], VP_TRACKS = ["Escalator Blues", "Food Court Waltz", "Lost In Aisle 9", "Fountain Dreams"]
function vpMap(k, X, Y, W0, H0, pick, coins, TM) {
  const HB = vpLit(T.headBg, "#FF71CE"), AB = vpLit(T.altBg, "#01CDFE"), BG = k.a("#140A2A", 1), cols = [HB, AB, "#FFFB96", "#B967FF", "#05FFA1", HB, AB, "#FFFB96"], lt = k.a("#FFFFFF", 0.92)
  k.rect(X, Y, W0, H0, BG); k.rect(X, Y, W0, 1.5, k.a("#4A4A5A", 1)); k.rect(X, Y, 1.5, H0, k.a("#4A4A5A", 1))
  for (let gx = X + 8; gx < X + W0; gx += 8) k.ln([[gx, Y + 12], [gx, Y + H0 - 2]], k.a(HB, 0.07), 0.5); for (let gy = Y + 16; gy < Y + H0; gy += 8) k.ln([[X + 2, gy], [X + W0 - 2, gy]], k.a(HB, 0.07), 0.5)
  k.t("VAPOR PLAZA · LEVEL 2", X + 5, Y + 2, 7, k.a(AB, 1), { w: W0 * 0.6, lines: 1 })
  k.circ(X + W0 - 64, Y + 6.5, 2.4, k.a(HB, 1)); k.t("YOU ARE HERE", X + W0 - 58, Y + 2, 7, lt, { w: 56, lines: 1 })
  const mx = X + 5, my = Y + 14, mw = W0 - 10, mh = H0 - 18, N = (u, v) => [mx + u * mw, my + v * mh]
  k.rect(mx, my, mw, mh, k.a("#24124A", 1), k.a("#8A7FC0", 0.6), 0.8)
  const stores = [[0.03, 0.04, 0.25, 0.30], [0.27, 0.04, 0.49, 0.30], [0.51, 0.04, 0.73, 0.30], [0.75, 0.04, 0.97, 0.30], [0.03, 0.70, 0.25, 0.96], [0.27, 0.70, 0.43, 0.96], [0.57, 0.70, 0.73, 0.96], [0.75, 0.70, 0.97, 0.96]]
  stores.forEach(([u0, v0, u1, v1], i) => { const [x0, y0] = N(u0, v0), [x1, y1] = N(u1, v1), c = cols[i], hot = i === pick
    if (hot) { k.rect(x0 - 1.5, y0 - 1.5, x1 - x0 + 3, y1 - y0 + 3, null, k.a(c, 0.35), 3); k.rect(x0, y0, x1 - x0, y1 - y0, k.a(c, 0.9)) } else k.rect(x0, y0, x1 - x0, y1 - y0, k.a(c, 0.16), k.a(c, 0.8), 0.8)
    const dy = v0 < 0.5 ? y1 : y0; k.rect((x0 + x1) / 2 - 3, dy - 0.8, 6, 1.6, hot ? k.a("#FFFFFF", 1) : k.a(c, 1))
    const ls = Math.max(6, Math.min(9, (y1 - y0) * 0.24)); k.t(VP_STORES[i][1], (x0 + x1) / 2, (y0 + y1) / 2 - ls * 0.6, ls, hot ? k.a("#140A2A", 1) : lt, { a: "c", w: x1 - x0 - 3, lines: 1 })
    if (hot) { const sx = x1 - 3, sy = y0 + 3, rr = 3 + Math.sin(TM * 2) * 0.6; k.poly([[sx, sy - rr], [sx + rr * 0.25, sy - rr * 0.25], [sx + rr, sy], [sx + rr * 0.25, sy + rr * 0.25], [sx, sy + rr], [sx - rr * 0.25, sy + rr * 0.25], [sx - rr, sy], [sx - rr * 0.25, sy - rr * 0.25]], k.a("#FFFFFF", 1)) } })
  // food court with little tables, the escalator, palms and the fountain in the atrium
  const [fx0, fy0] = N(0.03, 0.37), [fx1, fy1] = N(0.25, 0.63); k.rect(fx0, fy0, fx1 - fx0, fy1 - fy0, k.a("#FFFB96", 0.08), k.a("#FFFB96", 0.55), 0.6)
  for (let i = 0; i < 4; i++) { const tx = fx0 + (fx1 - fx0) * (0.22 + (i % 2) * 0.56), ty = fy0 + (fy1 - fy0) * (0.3 + Math.floor(i / 2) * 0.42); k.circ(tx, ty, 2.2, k.a("#FFFB96", 0.75)); ;[[-3.6, 0], [3.6, 0]].forEach(([a, b]) => k.circ(tx + a, ty + b, 0.9, k.a("#FFFB96", 0.55))) }
  k.t("FOOD", (fx0 + fx1) / 2, fy1 - 7, 5.5, k.a("#FFFB96", 0.9), { a: "c", w: fx1 - fx0, lines: 1 })
  const [ex0, ey0] = N(0.80, 0.38), [ex1, ey1] = N(0.97, 0.62); k.rect(ex0, ey0, ex1 - ex0, ey1 - ey0, k.a(AB, 0.1), k.a(AB, 0.7), 0.6); for (let i = 1; i < 6; i++) k.ln([[ex0 + (ex1 - ex0) * i / 6, ey1 - 1], [ex0 + (ex1 - ex0) * i / 6 + 3, ey0 + 1]], k.a(AB, 0.55), 0.5); k.poly([[ex1 - 4, ey0 + 2], [ex1 - 1.5, ey0 + 6], [ex1 - 6.5, ey0 + 6]], k.a(AB, 1))
  const palm = (u, v) => { const [px, py] = N(u, v); k.circ(px, py + 2, 2.6, k.a("#8A5A3A", 1)); for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2 + 0.3; k.ln([[px, py], [px + Math.cos(a) * 5.5, py + Math.sin(a) * 3.6 - 1]], k.a("#05FFA1", 0.9), 1) } }
  palm(0.36, 0.5); palm(0.68, 0.5)
  const [cx, cy] = N(0.52, 0.5), R = Math.min(mw * 0.075, mh * 0.15); k.circ(cx, cy, R + 2, k.a(AB, 0.25)); k.circ(cx, cy, R, k.a(AB, 0.35), k.a(AB, 1), 1); k.circ(cx, cy, R * 0.55, null, k.a("#FFFFFF", 0.5), 0.5)
  for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2 + TM / 5; k.ln([[cx, cy], [cx + Math.cos(a) * R * 0.45, cy + Math.sin(a) * R * 0.45]], k.a("#FFFFFF", 0.8), 0.5) }
  for (let j = 0; j < Math.min(9, 3 + Math.floor(coins / 120)); j++) { const a = j * 2.4, rr = R * (0.6 + (j % 3) * 0.12); k.circ(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.9, k.a("#FFFB96", 1)) }
  // the route from the front doors to the store, dashed, with an arrow at the end
  const [u0, v0, u1, v1] = stores[pick], scx = (u0 + u1) / 2, top = v0 < 0.5, lane = scx < 0.5 ? 0.30 : 0.74
  const way = (top ? [[0.5, 0.9], [0.5, 0.66], [lane, 0.66], [lane, 0.34], [scx, 0.34], [scx, 0.31]] : [[0.5, 0.9], [0.5, 0.66], [scx, 0.66], [scx, 0.69]]).map(([u, v]) => N(u, v))
  let carry = 0; for (let i = 0; i < way.length - 1; i++) { const [ax, ay] = way[i], [bx, by] = way[i + 1], L = Math.hypot(bx - ax, by - ay); for (let t = carry; t < L; t += 5) { const t2 = Math.min(L, t + 2.6); k.ln([[ax + (bx - ax) * t / L, ay + (by - ay) * t / L], [ax + (bx - ax) * t2 / L, ay + (by - ay) * t2 / L]], k.a("#FFFB96", 1), 1.1) } carry = (carry + 5 - (L % 5)) % 5 }
  const [lx, ly] = way[way.length - 1], [px2, py2] = way[way.length - 2], ang = Math.atan2(ly - py2, lx - px2); k.poly([[lx + Math.cos(ang) * 1, ly + Math.sin(ang) * 1], [lx - Math.cos(ang - 0.6) * 4.5, ly - Math.sin(ang - 0.6) * 4.5], [lx - Math.cos(ang + 0.6) * 4.5, ly - Math.sin(ang + 0.6) * 4.5]], k.a("#FFFB96", 1))
  const [dx0, dy0] = N(0.455, 0.965); k.rect(dx0, dy0 - 1, mw * 0.09, 2, k.a("#8A7FC0", 1))
  const [hx, hy] = N(0.5, 0.88), pr = 3 + Math.sin(TM * 3) * 0.8; k.circ(hx, hy, pr + 3, k.a(HB, 0.25)); k.circ(hx, hy, 3, k.a(HB, 1), k.a("#FFFFFF", 1), 1)
  const [nx, ny] = N(0.95, 0.40); k.t("N", nx - 4, ny - 9, 6, lt, { a: "c", w: 10, lines: 1 })
}
// WHITE RABBIT: a different heirloom in every mark's file
function rbJewel(k, kind, gx, gy, c1, c2) {
  const I = k.I, G = k.a("#E3C46A", 1), lw = 0.7
  if (kind === 0) { k.poly([[gx - 9, gy - 3], [gx - 5, gy - 8], [gx + 5, gy - 8], [gx + 9, gy - 3], [gx, gy + 9]], c1, I, lw); k.ln([[gx - 9, gy - 3], [gx + 9, gy - 3]], I, 0.5); k.ln([[gx - 3, gy - 8], [gx, gy - 3], [gx + 3, gy - 8]], I, 0.4) }
  else if (kind === 1) { k.ell(gx, gy, 7.5, 10, c2, I, lw); k.ln([[gx - 7.2, gy - 2], [gx + 7.2, gy - 2]], G, 1.2); k.ln([[gx - 6.4, gy + 4], [gx + 6.4, gy + 4]], G, 1.2); ;[-4, 0, 4].forEach(u => k.circ(gx + u, gy + 1, 0.9, k.a("#FFFFFF", 1))); k.circ(gx, gy - 7, 1.2, G) }
  else if (kind === 2) { k.circ(gx, gy + 3, 6.5, null, G, 2.2); k.poly([[gx - 4, gy - 4], [gx - 2, gy - 7], [gx + 2, gy - 7], [gx + 4, gy - 4], [gx, gy + 0]], c1, I, lw) }
  else if (kind === 3) { k.arc(gx, gy + 8, 11, Math.PI * 1.1, Math.PI * 1.9, G, 1.6); ;[-8, -4, 0, 4, 8].forEach((u, j) => { const h = j === 2 ? 9 : j % 2 ? 6 : 4, by = gy + 8 - Math.sqrt(Math.max(0, 121 - u * u)); k.poly([[gx + u - 1.6, by + 1], [gx + u, by - h], [gx + u + 1.6, by + 1]], G); if (j % 2 === 0) k.circ(gx + u, by - h + 1.5, 1.3, j === 2 ? c1 : c2) }) }
  else if (kind === 4) { for (let j = 0; j <= 10; j++) { const a = Math.PI * 0.12 + j / 10 * Math.PI * 0.76; k.circ(gx + 10 * Math.cos(a), gy - 8 + 12 * Math.sin(a), 1.5, k.a("#F4EEF6", 1), I, 0.3) } k.poly([[gx - 3, gy + 5], [gx + 3, gy + 5], [gx, gy + 11]], c1, I, lw) }
  else if (kind === 5) { k.poly([[gx - 9, gy + 6], [gx - 9, gy - 4], [gx - 4.5, gy + 1], [gx, gy - 8], [gx + 4.5, gy + 1], [gx + 9, gy - 4], [gx + 9, gy + 6]], G, I, lw); ;[-5, 0, 5].forEach((u, j) => k.circ(gx + u, gy + 3, 1.4, j === 1 ? c1 : c2)) }
  else if (kind === 6) { k.poly([[gx - 5, gy - 8], [gx + 5, gy - 8], [gx + 8, gy - 4], [gx + 8, gy + 4], [gx + 5, gy + 8], [gx - 5, gy + 8], [gx - 8, gy + 4], [gx - 8, gy - 4]], c2, I, lw); k.rect(gx - 4, gy - 4, 8, 8, null, k.a("#FFFFFF", 0.6), 0.5) }
  else { k.ln([[gx, gy + 10], [gx, gy - 4]], G, 1.8); k.circ(gx, gy - 7, 4, c1, I, lw); k.poly([[gx - 3, gy + 1], [gx + 3, gy + 1], [gx, gy - 2]], G) }
}
// VAPOR PLAZA: postcards from all over the eternal plaza
const VP_CARDS = ["GREETINGS!", "WISH YOU WERE HERE", "SUNSET FOREVER", "PLAZA 95", "SEE YOU SOON", "OPEN ALL NIGHT", "BE RIGHT BACK", "STAY A WHILE"]
function vpCard(k, kind, x, y, w, h) {
  // a perspective grid kept inside the postcard
  const vpGrid = (k2, gx, gy, gw, gh) => { k2.rect(gx, gy, gw, gh, k2.a(T.ground, 0.6)); for (let i = -10; i <= 10; i++) { let x0 = gx + gw / 2 + i * gw / 30, x1 = gx + gw / 2 + i * gw / 6, y0 = gy, y1 = gy + gh; if (x1 < gx) { const t = (gx - x0) / (x1 - x0); if (t < 0 || t > 1) continue; x1 = gx; y1 = gy + gh * t } if (x1 > gx + gw) { const t = (gx + gw - x0) / (x1 - x0); if (t < 0 || t > 1) continue; x1 = gx + gw; y1 = gy + gh * t } k2.ln([[x0, y0], [x1, y1]], k2.a(T.headBg, 0.75), 0.7) } for (let j = 1; j < 7; j++) { const t = Math.pow(j / 6, 2); k2.ln([[gx, gy + gh * t], [gx + gw, gy + gh * t]], k2.a(T.headBg, 0.75), 0.7) } k2.ln([[gx, gy], [gx + gw, gy]], k2.a(T.altBg, 1), 1.2) }
  const sky = (top) => { for (let j = 0; j < h; j += 2) k.rect(x, y + j, w, 2, k.a(j < h * (top || 0.55) ? T.ground : T.headBg, 0.5 + j / h * 0.5)) }
  if (kind === 0) { sky(); vpSun(k, x + w / 2, y + h * 0.6, 9); for (let j = 0; j < 4; j++) k.rect(x, y + h * 0.66 + j * 3, w, 1.4, k.a(T.altBg, 0.6)) }
  else if (kind === 1) { sky(); vpSun(k, x + w * 0.6, y + h * 0.62, 8); ;[[x + w * 0.2, 1], [x + w * 0.82, -1]].forEach(([px, dir]) => { k.ln([[px, y + h], [px + dir * 2, y + h * 0.3]], k.a("#2A0F2E", 1), 1.4); for (let j = 0; j < 5; j++) { const a = Math.PI + j * Math.PI / 4; k.ln([[px + dir * 2, y + h * 0.3], [px + dir * 2 + 8 * Math.cos(a), y + h * 0.3 + 5 * Math.sin(a) + 3]], k.a("#2A0F2E", 1), 1.2) } }) }
  else if (kind === 2) { k.rect(x, y, w, h * 0.5, k.a(T.ground, 0.9)); vpGrid(k, x, y + h * 0.5, w, h * 0.5); gMascot(k, x + w / 2, y + h * 0.42, 1.1, 0); k.arc(x + w / 2 - 2, y + h * 0.62, 12, Math.PI * 1.15, Math.PI * 1.85, k.a(T.altBg, 0.7), 0.6) }
  else if (kind === 3) { k.rect(x, y, w, h * 0.55, k.a(T.ground, 0.9)); vpGrid(k, x, y + h * 0.55, w, h * 0.45); const px = x + w / 2, py = y + h * 0.18; k.ln([[px, py], [px - 12, py + 18], [px + 12, py + 18], [px, py], [px + 4, py + 14], [px - 12, py + 18]], k.a(T.altBg, 1), 0.8); k.ln([[px + 4, py + 14], [px + 12, py + 18]], k.a(T.altBg, 1), 0.8) }
  else if (kind === 4) { sky(0.6); vpSun(k, x + w * 0.72, y + h * 0.42, 7); for (let r2 = 0; r2 < 3; r2++) for (let c2 = 0; c2 < 8; c2++) k.rect(x + c2 * w / 8, y + h * 0.72 + r2 * h * 0.093, w / 8, h * 0.093, k.a((r2 + c2) % 2 ? "#FFFFFF" : "#2A0F2E", 0.8)); k.rect(x + w * 0.25, y + h * 0.22, 9, h * 0.5, k.a("#F4EEF8", 1)); for (let j = 1; j < 3; j++) k.ln([[x + w * 0.25 + j * 3, y + h * 0.22], [x + w * 0.25 + j * 3, y + h * 0.72]], k.a("#B9B0C8", 1), 0.5); k.rect(x + w * 0.25 - 2, y + h * 0.2, 13, 2.4, k.a("#F4EEF8", 1)) }
  else if (kind === 5) { k.rect(x, y, w, h, k.a(T.ground, 0.9)); ;[0.2, 0.5, 0.8].forEach(f => { k.arc(x + w * f, y + h * 0.45, w * 0.12, Math.PI, Math.PI * 2, k.a(T.headBg, 0.9), 1); k.ln([[x + w * f - w * 0.12, y + h * 0.45], [x + w * f - w * 0.12, y + h]], k.a(T.headBg, 0.9), 1); k.ln([[x + w * f + w * 0.12, y + h * 0.45], [x + w * f + w * 0.12, y + h]], k.a(T.headBg, 0.9), 1) }); k.ell(x + w / 2, y + h * 0.88, 10, 3, k.a(T.altBg, 0.6), k.a(T.altBg, 1), 0.6); for (let j = 0; j < 5; j++) k.ln([[x + w / 2, y + h * 0.84], [x + w / 2 + (j - 2) * 3, y + h * 0.66]], k.a("#FFFFFF", 0.8), 0.6) }
  else if (kind === 6) { sky(0.6); vpSun(k, x + w * 0.3, y + h * 0.6, 8); k.rect(x, y + h * 0.66, w, h * 0.34, k.a(T.altBg, 0.45)); const bx = x + w * 0.66, by = y + h * 0.7; k.poly([[bx - 9, by], [bx + 9, by], [bx + 6, by + 4], [bx - 6, by + 4]], k.a("#2A0F2E", 1)); k.poly([[bx, by - 1], [bx, by - 16], [bx + 8, by - 1]], k.a("#FFFFFF", 0.95)); k.poly([[bx - 1, by - 1], [bx - 1, by - 12], [bx - 7, by - 1]], k.a("#FFFFFF", 0.8)) }
  else { k.rect(x, y, w, h, k.a(T.ground, 0.9)); vpGrid(k, x, y + h * 0.6, w, h * 0.4); gMascot(k, x + w * 0.3, y + h * 0.56, 1.2, 1); gMascot(k, x + w * 0.72, y + h * 0.6, 1.2, 2) }
}
// WILDWOOD: pressed specimens, never the same one twice on the page
const NA_PRESS = [["Wild rose", "Rosa"], ["Violet", "Viola"], ["Clover", "Trifolium"], ["Oak leaf", "Quercus"], ["Maple", "Acer"], ["Beech", "Fagus"], ["Fern", "Polystichum"], ["Jay feather", "Garrulus"], ["Acorn", "Q. robur"], ["Dandelion", "Taraxacum"], ["Fly agaric", "Amanita"], ["Ginkgo", "Ginkgo"]]
function naPressed(k, kind, cx, cy) {
  const G = k.a(T.headBg, 0.9), R = k.a(T.altBg, 0.85), I = k.a("#1F2A22", 1), stem = (h) => k.ln([[cx, cy + h], [cx, cy - 4]], k.a(T.headBg, 1), 1.1)
  if (kind === 0) { stem(26); nLeaf(k, cx, cy + 12, 9, -0.7, G); for (let j = 0; j < 5; j++) { const a = j / 5 * Math.PI * 2 - Math.PI / 2; k.circ(cx + 6 * Math.cos(a), cy - 8 + 6 * Math.sin(a), 5.5, k.a("#E58A9A", 0.9), I, 0.5) } k.circ(cx, cy - 8, 3.4, k.a("#E3B341", 1)) }
  else if (kind === 1) { stem(26); nLeaf(k, cx, cy + 14, 9, Math.PI + 0.6, G); for (let j = 0; j < 5; j++) { const a = j / 5 * Math.PI * 2 + Math.PI / 2; k.ell(cx + 4.6 * Math.cos(a), cy - 8 + 4.6 * Math.sin(a), 3.6, 3.6, k.a("#7A5AB0", 0.95), I, 0.5) } k.circ(cx, cy - 8, 1.6, k.a("#E3B341", 1)) }
  else if (kind === 2) { stem(26); ;[-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6].forEach(a => { k.circ(cx + 5.5 * Math.cos(a), cy - 6 + 5.5 * Math.sin(a), 5, G, I, 0.6); k.ln([[cx + 3 * Math.cos(a), cy - 6 + 3 * Math.sin(a)], [cx + 7 * Math.cos(a), cy - 6 + 7 * Math.sin(a)]], k.a("#FFFFFF", 0.6), 0.6) }) }
  else if (kind === 3) { const pts = []; for (let j = 0; j <= 20; j++) { const t = j / 20, v = -22 + t * 40, wv = Math.sin(t * Math.PI) * 11 * (1 + 0.28 * Math.sin(t * Math.PI * 7)); pts.push([cx + wv, cy + v]) } k.poly(pts.concat(pts.slice().reverse().map(([px, py]) => [2 * cx - px, py])), G, I, 0.6); k.ln([[cx, cy - 22], [cx, cy + 24]], I, 0.6) }
  else if (kind === 4) { const pts = []; for (let j = 0; j < 5; j++) { const a = -Math.PI / 2 + (j - 2) * 0.62; pts.push([cx + 18 * Math.cos(a), cy + 4 + 18 * Math.sin(a)]); pts.push([cx + 8 * Math.cos(a + 0.31), cy + 4 + 8 * Math.sin(a + 0.31)]) } k.poly([[cx, cy + 6]].concat(pts.slice(0, -1)), R, I, 0.6); k.ln([[cx, cy + 22], [cx, cy + 4]], I, 0.8); ;[-1.24, -0.62, 0, 0.62, 1.24].forEach(a => k.ln([[cx, cy + 4], [cx + 15 * Math.cos(-Math.PI / 2 + a), cy + 4 + 15 * Math.sin(-Math.PI / 2 + a)]], I, 0.4)) }
  else if (kind === 5) { nLeaf(k, cx - 2, cy + 18, 38, -1.45, G) }
  else if (kind === 6) { k.ln([[cx, cy + 24], [cx, cy - 22]], k.a(T.headBg, 1), 1); for (let j = 0; j < 9; j++) { const yy = cy - 18 + j * 4.6, l = 3 + Math.sin(j / 8 * Math.PI) * 9; nLeaf(k, cx, yy, l, -0.25, G); nLeaf(k, cx, yy, l, Math.PI + 0.25, G) } }
  else if (kind === 7) { const pts = nCurve([[cx - 2, cy + 24], [cx, cy], [cx + 3, cy - 22]], 6); k.poly(pts.map(([px, py], j) => [px - 5 * Math.sin(j / pts.length * Math.PI), py]).concat(pts.slice().reverse().map(([px, py], j) => [px + 5 * Math.sin((pts.length - j) / pts.length * Math.PI), py])), k.a("#5B7DA8", 0.9), I, 0.5); for (let j = 0; j < 6; j++) k.rect(cx - 4, cy - 12 + j * 4, 8, 1.6, k.a(j % 2 ? "#1F2A22" : "#FFFFFF", 0.85)); k.ln(pts, I, 0.6) }
  else if (kind === 8) { k.ell(cx, cy + 4, 7, 9, k.a("#B8823A", 1), I, 0.6); k.poly(k.arcPts(cx, cy - 2, 8.5, Math.PI, Math.PI * 2, 12), k.a("#7A5532", 1), I, 0.6); for (let j = -2; j <= 2; j++) k.circ(cx + j * 3, cy - 4, 0.8, k.a("#4A3220", 1)); k.ln([[cx, cy - 10], [cx + 2, cy - 14]], k.a("#4A3220", 1), 1.2) }
  else if (kind === 9) { stem(26); for (let j = 0; j < 22; j++) { const a = j / 22 * Math.PI * 2; k.ln([[cx, cy - 8], [cx + 10 * Math.cos(a), cy - 8 + 10 * Math.sin(a)]], k.a("#1F2A22", 0.35), 0.4); k.circ(cx + 10 * Math.cos(a), cy - 8 + 10 * Math.sin(a), 0.9, k.a("#1F2A22", 0.5)) } k.circ(cx, cy - 8, 2, k.a("#8B6A44", 1)) }
  else if (kind === 10) { nShroom(k, cx, cy + 20, 34, k.a("#D9372B", 1)) }
  else { k.ln([[cx, cy + 24], [cx, cy + 4]], k.a(T.headBg, 1), 1); const pts = []; for (let j = 0; j <= 16; j++) { const a = Math.PI * 1.15 + j / 16 * Math.PI * 0.7; pts.push([cx + 16 * Math.cos(a), cy + 6 + 16 * Math.sin(a)]) } k.poly([[cx, cy + 6]].concat(pts.slice(0, 8)).concat([[cx, cy - 4]]).concat(pts.slice(9)), k.a("#E3B341", 0.9), I, 0.6) }
}
// LONG ODDS: every post in your feed has a price
function mkPost(k, kind, cx, cy, s2) {
  const Y = k.a(T.altBg, 1), N = mkNo(), A = k.a(T.accent, 1), Gd = mkGold(), I = k.I
  if (kind === 0) { k.poly([[cx, cy - 11 * s2], [cx + 4 * s2, cy - 3 * s2], [cx + 4 * s2, cy + 6 * s2], [cx - 4 * s2, cy + 6 * s2], [cx - 4 * s2, cy - 3 * s2]], k.a("#E8E8F0", 1), I, 0.6); k.circ(cx, cy - 2 * s2, 1.6 * s2, A); k.poly([[cx - 4 * s2, cy + 2 * s2], [cx - 7 * s2, cy + 8 * s2], [cx - 4 * s2, cy + 6 * s2]], N); k.poly([[cx + 4 * s2, cy + 2 * s2], [cx + 7 * s2, cy + 8 * s2], [cx + 4 * s2, cy + 6 * s2]], N); k.poly([[cx - 2.5 * s2, cy + 6 * s2], [cx, cy + 12 * s2], [cx + 2.5 * s2, cy + 6 * s2]], Gd) }
  else if (kind === 1) { k.circ(cx, cy, 9 * s2, k.a("#F4EED8", 1)); ;[[-3, -2, 2], [3, 3, 1.4], [2, -4, 1]].forEach(([u, v, rr]) => k.circ(cx + u * s2, cy + v * s2, rr * s2, k.a("#C9C2A8", 1))) }
  else if (kind === 2) { let v = 0.2; for (let j = 0; j < 6; j++) { const o = v; v = Math.min(0.95, v + 0.13 + (j % 2) * 0.05); const x0 = cx - 10 * s2 + j * 4 * s2, yt = cy + 9 * s2 - v * 18 * s2, yb = cy + 9 * s2 - o * 18 * s2; k.rect(x0, yt, 2.6 * s2, Math.max(1, yb - yt), Y) } k.ln([[cx - 10 * s2, cy + 7 * s2], [cx + 12 * s2, cy - 10 * s2]], k.a(T.altBg, 0.5), 0.8) }
  else if (kind === 3) { k.ell(cx - 1 * s2, cy + 2 * s2, 10 * s2, 5 * s2, k.a("#3A6AB8", 1)); k.poly([[cx + 8 * s2, cy + 1 * s2], [cx + 13 * s2, cy - 4 * s2], [cx + 12 * s2, cy + 2 * s2], [cx + 14 * s2, cy + 6 * s2]], k.a("#3A6AB8", 1)); k.circ(cx - 6 * s2, cy, 0.9 * s2, k.a("#FFFFFF", 1)); k.ln([[cx - 3 * s2, cy - 3 * s2], [cx - 4 * s2, cy - 9 * s2]], k.a("#9AD0FF", 1), 0.8); k.ln([[cx - 3 * s2, cy - 3 * s2], [cx - 1 * s2, cy - 9 * s2]], k.a("#9AD0FF", 1), 0.8) }
  else if (kind === 4) { k.poly([[cx - 9 * s2, cy - 3 * s2], [cx - 5 * s2, cy - 8 * s2], [cx + 5 * s2, cy - 8 * s2], [cx + 9 * s2, cy - 3 * s2], [cx, cy + 9 * s2]], k.a("#9AE6FF", 0.9), I, 0.6); k.ln([[cx - 9 * s2, cy - 3 * s2], [cx + 9 * s2, cy - 3 * s2]], I, 0.4) }
  else if (kind === 5) { k.circ(cx, cy, 10 * s2, A); k.circ(cx, cy, 8 * s2, k.a("#05030A", 1)); ;[[-6, -9], [8, -6], [9, 7], [-9, 6]].forEach(([u, v]) => k.circ(cx + u * s2, cy + v * s2, 0.7, k.a("#FFFFFF", 0.9))) }
  else if (kind === 6) { k.ln([[cx - 6 * s2, cy - 9 * s2], [cx + 6 * s2, cy - 9 * s2]], Gd, 1.4); k.ln([[cx - 6 * s2, cy + 9 * s2], [cx + 6 * s2, cy + 9 * s2]], Gd, 1.4); k.poly([[cx - 5 * s2, cy - 8 * s2], [cx + 5 * s2, cy - 8 * s2], [cx, cy], [cx + 5 * s2, cy + 8 * s2], [cx - 5 * s2, cy + 8 * s2], [cx, cy]], null, k.a("#E8E8F0", 1), 0.7); k.poly([[cx - 3 * s2, cy + 7.5 * s2], [cx + 3 * s2, cy + 7.5 * s2], [cx, cy + 3 * s2]], Gd) }
  else if (kind === 7) { k.rect(cx - 9 * s2, cy - 8 * s2, 18 * s2, 17 * s2, k.a("#F4F4F8", 1)); k.rect(cx - 9 * s2, cy - 8 * s2, 18 * s2, 5 * s2, N); k.t("TUE", cx, cy - 1.5 * s2, 7 * s2, k.a("#111111", 1), { a: "c", w: 18 * s2, f: "bold", nofit: true }) }
  else if (kind === 8) { k.rect(cx - 6 * s2, cy - 10 * s2, 12 * s2, 20 * s2, k.a(T.accent, 0.3), A, 0.8); k.circ(cx + 3.5 * s2, cy, 0.9 * s2, Gd); for (let j = 0; j < 4; j++) k.ln([[cx + 6 * s2, cy - 9 * s2 + j * 6 * s2], [cx + 10 * s2, cy - 10 * s2 + j * 6 * s2]], k.a("#FFFFFF", 0.35), 0.6) }
  else { k.circ(cx, cy, 9 * s2, Gd, k.a("#B8901A", 1), 0.8); k.circ(cx, cy, 6.5 * s2, null, k.a("#B8901A", 1), 0.6); k.t("?", cx, cy - 4.5 * s2, 8 * s2, k.a("#6A4E10", 1), { a: "c", w: 12 * s2, f: "bold", nofit: true }) }
}
// ---------- WILDWOOD ----------
function naHills(k, x, y, w, h) { const p1 = []; for (let i = 0; i <= w; i += 4) p1.push([x + i, y + h * 0.5 - Math.sin(i * 0.03) * h * 0.25]); k.poly(p1.concat([[x + w, y + h], [x, y + h]]), k.a(T.headBg, 0.55)); const p2 = []; for (let i = 0; i <= w; i += 4) p2.push([x + i, y + h * 0.7 - Math.sin(i * 0.05 + 1) * h * 0.15]); k.poly(p2.concat([[x + w, y + h], [x, y + h]]), k.a(T.headBg, 0.85)); for (let i = 0; i < 9; i++) { const tx = x + 10 + i * (w - 20) / 8, ty = y + h * 0.66 - Math.sin((tx - x) * 0.05 + 1) * h * 0.15; k.poly([[tx, ty - 12], [tx + 4, ty], [tx - 4, ty]], k.ia(0.75)) } }
function naTape(k, x, y, ang) { const c = Math.cos(ang), s = Math.sin(ang), P = (u, v) => [x + u * c - v * s, y + u * s + v * c]; k.poly([P(-12, -4), P(12, -4), P(12, 4), P(-12, 4)], k.a("#F2E6C8", 0.75)) }
const NA = {
  oddity(k, W, H, d) {
    k = gSafe(k)
    const r = k.rng((d.seed || 7) * 13 + 5), sp = NA_SPECIES[d.pick != null ? d.pick : Math.floor(r() * NA_SPECIES.length) % NA_SPECIES.length], where = NA_WHERE[Math.floor(r() * NA_WHERE.length) % NA_WHERE.length], rare = 1 + Math.floor(r() * 5), small = W < 200, big = H > 200
    const px = 10, py = 6, pw = small ? W - 20 : big ? W - 20 : 118, ph = small ? 92 : big ? 196 : H - 12
    // the specimen plate: a cream card in photo corners, the drawing, its plate number and a true scale bar
    k.rect(px + 2, py + 2, pw, ph, k.a("#000000", 0.12)); k.rect(px, py, pw, ph, k.a("#FFFDF6", 1), k.a("#1F2A22", 0.35), 0.8); k.rect(px + 4, py + 4, pw - 8, ph - 8, null, k.a("#1F2A22", 0.18), 0.6)
    ;[[px, py, 1, 1], [px + pw, py, -1, 1], [px, py + ph, 1, -1], [px + pw, py + ph, -1, -1]].forEach(([x, y, sx, sy]) => k.poly([[x, y], [x + sx * 11, y], [x, y + sy * 11]], k.a(T.headBg, 0.9)))
    const ink = k.a("#1F2A22", 1), soft = k.a("#1F2A22", 0.62), dh = ph - (small ? 14 : 30), z = Math.min((pw - 20) / 94, dh / 92), cx = px + pw / 2, cy = py + 10 + dh / 2
    naSpecimen(k, sp.d, cx, cy, z)
    k.t(`PL. ${String(NA_SPECIES.indexOf(sp) + 3).padStart(2, "0")}`, px + 9, py + 7, 6.5, soft, { w: 40 })
    if (!small) { const bw = sp.bar / sp.cm * 94 * z, bx = px + 9, by = py + ph - 14; for (let i = 0; i < 4; i++) k.rect(bx + i * bw / 4, by, bw / 4, 2.6, i % 2 ? k.a("#FFFDF6", 1) : ink); k.rect(bx, by, bw, 2.6, null, ink, 0.5); k.t(`${sp.bar} CM`, bx + bw + 4, by - 3, 6.5, soft, { w: 50 }); k.t("fig. " + (NA_SPECIES.indexOf(sp) + 1), px + pw - 9, by - 4, 8, soft, { f: "disp", a: "r", w: 50 }) }
    if (small) { k.t(sp.n, W / 2, py + ph + 6, 12, k.I, { f: "disp", a: "c", w: W - 16, lines: 1 }); k.t(sp.l, W / 2, py + ph + 22, 8.5, k.a(T.headBg, 1), { f: "disp", a: "c", w: W - 16, lines: 1 }); k.t(`SPOTTED ${where}`, W / 2, H - 13, 6.5, k.S, { a: "c", w: W - 16, lines: 1 }); return }
    // the field notes beside the plate
    const tx = big ? 14 : px + pw + 12, ty = big ? py + ph + 10 : 6, tw = W - tx - 12
    k.t(`SPOTTED ${where}`, tx, ty, 7, k.a(T.altBg, 1), { f: "bold", w: tw, lines: 1 })
    k.t(sp.n, tx, ty + 10, 15, k.I, { f: "disp", w: tw, lines: 1 })
    k.t(sp.l, tx, ty + 29, 10, k.a(T.headBg, 1), { f: "disp", w: tw, lines: 1 })
    k.ln([[tx, ty + 45], [tx + tw - 16, ty + 45]], k.ia(0.25), 0.6); nLeaf(k, tx + tw - 13, ty + 45, 9, -0.4, k.a(T.headBg, 0.9))
    const cell = (l, v, x, y, w) => { k.t(l, x, y, 6, k.S, { w, lines: 1 }); k.t(v, x, y + 8, 7.5, k.I, { w, lines: 1 }) }, cw = (tw - 8) / 2
    cell("SIZE", sp.size, tx, ty + 50, cw); cell("ACTIVE", sp.act, tx + cw + 8, ty + 50, cw); cell(sp.d === "agaric" ? "HABITAT" : "EATS", sp.eats, tx, ty + 70, cw); cell("CALL", sp.call, tx + cw + 8, ty + 70, cw)
    k.t(sp.f, tx, ty + 91, 9.5, k.S, { f: "disp", w: tw, lines: 2 })
    const fy = big ? H - 16 : H - 15
    k.t("LOOK, DON'T DISTURB", tx, fy, 6.5, k.I, { w: tw - 70, lines: 1 }); k.t("RARITY", tx + tw - 66, fy, 6, k.S, { w: 30 }); for (let i = 0; i < 5; i++) nLeaf(k, tx + tw - 36 + i * 7.5, fy + 3.5, 6, -0.5, i < rare ? k.a(T.headBg, 1) : k.ia(0.12))
  },
  status(k, W, H, d) {
    const wx = d.wx || {}
    k.ln([[30, 4], [30, H - 4]], k.a(T.altBg, 0.5), 0.8)
    for (let y = 22; y < H - 6; y += 13) k.ln([[34, y], [W - 10, y]], k.ia(0.07), 0.6)
    k.t(String(d.now.getDate()), 16, 8, 14, k.a(T.altBg, 1), { f: "disp", a: "c", w: 24 }); k.t(d.now.toDateString().slice(0, 3).toUpperCase(), 16, 26, 6, k.S, { a: "c", w: 24 })
    k.t(`Field journal · ${d.now.toLocaleDateString ? d.now.toLocaleDateString("en-US", { month: "long", day: "numeric" }) : ""}`, 40, 6, 9.5, k.S, { f: "disp", w: 230 })
    wxIcon(k, wxKind(wx.cond), W - 40, 30, 32, k.I, 1)
    const n = k.para(d.ev ? `${d.ev.active ? "Out on" : "Next outing"}: ${d.ev.title}, ${shortT(d.ev.start)} to ${shortT(d.ev.end)}.` : "A free day. Go for a walk and look up.", 40, 22, W - 100, 13.5, k.I, "disp", 3, 1.15)
    nLeaf(k, 44, 30 + n * 15.5 + 4, 22, -0.2, k.a(T.headBg, 0.9)); nLeaf(k, 60, 30 + n * 15.5 + 6, 16, 0.4, k.a(T.headBg, 0.7))
    k.para(wx.temp != null ? `${wx.temp}°, ${(wx.cond || "").toLowerCase()}. Feels like ${wx.feels}°; high ${wx.hi}, low ${wx.lo}.` : "No weather today.", 84, 30 + n * 15.5, W - 96, 10.5, k.S, "disp", 2, 1.2)
    k.t(`ENERGY ${pct(d.batt)}`, 40, H - 12, 6.5, k.S, { w: 100 }); k.t(`DAY ${dayOfYear(d.now)} OF THE YEAR`, W - 12, H - 12, 6.5, k.S, { a: "r", w: 160 })
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "ON THE TRAIL" : "TRAILHEAD IN") : "RESTING", 12, 6, 7, k.a(T.altBg, 1), { w: W - 24, f: "bold" })
    k.t(d.ev ? d.ev.title : d.L.offTitle, 12, 17, 11, k.I, { f: "disp", w: W - 24 })
    naHills(k, 6, 64, W - 12, 60)
    const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([16 + t * (W - 32), 120 - t * 52 + Math.sin(t * 9) * 6]) }
    for (let i = 0; i < pts.length - 1; i += 1) if (i % 2 === 0) k.ln([pts[i], pts[i + 1]], k.a(T.altBg, 1), 1.2)
    const f = d.ev ? d.frac : 0, pi = Math.min(20, Math.round(f * 20)); k.circ(pts[pi][0], pts[pi][1], 4, k.a(T.altBg, 1), k.I, 1)
    k.poly([[W - 18, 62], [W - 18, 50], [W - 8, 55]], k.a(T.altBg, 1)); k.ln([[W - 18, 50], [W - 18, 68]], k.I, 1)
    if (d.ev) k.t(`${pct(f)} · camp by ${shortT(d.ev.end)}`, 14, 126, 7, k.S, { w: W - 28 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, x0 = 12, y0 = 10, w = W - 24, h = H - 20
    k.rect(x0 + 2, y0 + 2, w, h, k.ia(0.08)); k.rect(x0, y0, w, h, k.a("#FFFDF6", 1), k.ia(0.25), 0.8); k.ln([[x0, y0 + 22], [x0 + w, y0 + 22]], k.a(T.altBg, 0.5), 0.8); for (let y = y0 + 34; y < y0 + h - 4; y += 12) k.ln([[x0, y], [x0 + w, y]], k.a("#7FA6C8", 0.2), 0.6)
    naTape(k, x0 + 18, y0 + 2, -0.2); naTape(k, x0 + w - 18, y0 + 2, 0.25)
    k.t(d.archival ? "From the naturalists" : "Field note", x0 + 10, y0 + 6, 10, k.a(T.altBg, 1), { f: "disp", w: w - 20 })
    const fs = fitFs(k, d.text, w - (small ? 20 : 80), small ? 4 : 3, small ? 13 : (big ? 20 : 16), "disp"), n = k.para(d.text, x0 + 10, y0 + 28, w - (small ? 20 : 80), fs, k.I, "disp", small ? 4 : 3, 1.12)
    k.t(`— ${d.by}`, x0 + 10, y0 + 32 + n * fs * 1.12, small ? 6.5 : 7.5, k.S, { w: w - 20 })
    if (!small) { nLeaf(k, x0 + w - 56, y0 + h - 30, 44, -0.6, k.a(T.headBg, 0.85)); nLeaf(k, x0 + w - 40, y0 + h - 14, 28, -1.4, k.a(T.altBg, 0.6)) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, top = 30, bh = small ? 70 : 78
    for (let i = 0; i < bh; i += 2) k.rect(8, top + i, W - 16, 2, k.a(T.headBg, 0.04 + 0.12 * (i / bh)))
    const f = d.up ? d.frac : 0.5, px = 20 + (W - 40) * f, py = top + bh - 18 - Math.sin(Math.PI * f) * (bh - 30)
    for (let i = 0; i <= 40; i += 2) { const t = i / 40, t2 = (i + 1) / 40; k.ln([[20 + (W - 40) * t, top + bh - 18 - Math.sin(Math.PI * t) * (bh - 30)], [20 + (W - 40) * t2, top + bh - 18 - Math.sin(Math.PI * t2) * (bh - 30)]], k.ia(0.5), 0.8) }
    for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2; k.ln([[px + 7 * Math.cos(a), py + 7 * Math.sin(a)], [px + 11 * Math.cos(a), py + 11 * Math.sin(a)]], k.a(T.altBg, 1), 1) } k.circ(px, py, 5.5, k.a("#E3B341", 1), k.I, 0.8)
    naHills(k, 8, top + bh - 30, W - 16, 30)
    k.t(d.up ? C.solar.day : C.solar.night, 12, 6, 7, k.a(T.altBg, 1), { w: 160, f: "bold" }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, 14, 14, k.I, { f: "disp", w: 80 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 7, k.a(T.altBg, 1), { a: "r", w: 160 })
    k.t(`Sunrise ${shortT(d.rise)}`, 12, top + bh + 4, 9, k.S, { f: "disp", w: 110 }); k.t(`Sunset ${shortT(d.set)}`, W - 12, top + bh + 4, 9, k.S, { f: "disp", a: "r", w: 110 })
    if (big && d.atm) {
      for (let i = 0; i < 10; i++) nLeaf(k, 20 + (i * 53) % (W - 40), 142 + (i * 37) % 170, 10, i, k.a(T.headBg, 0.15))
      atmItems(d.atm).forEach(([l, v], i) => { const x = 14 + (i % 3) * 114, y = 150 + Math.floor(i / 3) * 76; k.rect(x, y, 104, 64, k.a("#FFFDF6", 1), k.ia(0.2), 0.8); naTape(k, x + 52, y, 0.1); k.t(l === "UV" ? "UV" : l.charAt(0) + l.slice(1).toLowerCase(), x + 10, y + 9, 9, k.a(T.altBg, 1), { f: "disp", w: 60 }); k.t(v, x + 10, y + 24, String(v).length > 4 ? 13 : 16, k.I, { f: "disp", w: 58 }); inst(k, i, x + 68, y + 20, d.atm, { ink: k.I, hot: k.a(T.altBg, 1), faint: k.ia(0.15) }) })
      k.t(`Good walking weather until ${shortT(new Date(d.set.valueOf() - 45 * 60000))}.`, W / 2, H - 22, 10, k.S, { f: "disp", a: "c", w: W - 30 })
    }
  },
  feed(k, W, H, d) {
    const m = 10, cw = W - m * 2, ch = H * 0.42
    k.rect(m, 8, cw, ch, k.a("#FFFDF6", 1), k.ia(0.25), 0.8); naHills(k, m + 4, 8 + ch * 0.35, cw - 8, ch * 0.6); naTape(k, m + cw / 2, 8, 0)
    k.t(d.code, m + 6, 12, 6.5, k.S, { w: 60 })
    k.t(d.line, m, 8 + ch + 5, 13, k.I, { f: "disp", w: cw })
    d.meters.forEach(([n, v], i) => { const y = 8 + ch + 24 + i * 12; k.t(n.charAt(0) + n.slice(1).toLowerCase(), m, y, 8, k.S, { f: "disp", w: 70 }); for (let j = 0; j < 5; j++) nLeaf(k, m + 74 + j * 12, y + 5, 9, -0.3, j / 5 < v ? k.a(T.headBg, 1) : k.ia(0.08)) })
    k.t(d.tag, m, H - 15, 6.5, k.a(T.altBg, 1), { w: cw })
  },
  yt(k, W, H, d) {
    const r = sRng(d, 61), small = W < 200, fw = small ? W - 24 : 200, frames = small ? 2 : 3
    k.rect(12, 14, fw, 74, k.a("#2A2A22", 1)); for (let x = 16; x < 12 + fw; x += 9) { k.rect(x, 17, 5, 4, k.a("#FFFDF6", 0.85)); k.rect(x, 81, 5, 4, k.a("#FFFDF6", 0.85)) }
    for (let i = 0; i < frames; i++) { const x = 18 + i * ((fw - 12) / frames), w = (fw - 12) / frames - 6; k.rect(x, 24, w, 54, k.a("#E9F0DD", 1)); naHills(k, x, 40, w, 38); if (i === 1) k.circ(x + w * 0.7, 34, 4, k.a("#E3B341", 1)) }
    if (small) return
    const rx = 226
    k.t("NATURE REEL", rx, 10, 7.5, k.a(T.altBg, 1), { w: 130, f: "bold" })
    k.para(pick2(r, ["Ten minutes of a mossy creek.", "Fox kits learning to pounce.", "Fog lifting off a lake.", "A hummingbird, very slowly."]), rx, 24, W - rx - 12, 12, k.I, "disp", 3, 1.15)
    k.t(`WATCHED ${mmss(60 + r() * 600)}`, rx, 86, 6.5, k.S, { w: W - rx - 12 }); k.t("NOW GO OUTSIDE", rx, 97, 6.5, k.a(T.altBg, 1), { w: W - rx - 12 })
  },
  ig(k, W, H, d) {
    k = gSafe(k)
    const r = sRng(d, 62), small = W < 200, n = small ? 2 : 4, sw = small ? 66 : 74, sh = small ? 88 : 96
    const order = gShuf((d.seed || 7) * 19 + 3, NA_PRESS.length); for (let i = 0; i < n; i++) { const x = 12 + i * (sw + 10), y = 8, kind = order[i], [cn, ln] = NA_PRESS[kind]; k.rect(x, y, sw, sh, k.a("#FFFDF6", 1), k.ia(0.25), 0.8); naPressed(k, kind, x + sw / 2, y + (small ? 36 : 40)); naTape(k, x + sw / 2, y + 2, 0.1); k.rect(x + 4, y + sh - 22, sw - 8, 18, null, k.a("#1F2A22", 0.3), 0.6); k.t(cn, x + sw / 2, y + sh - 20, 7.5, k.a("#1F2A22", 1), { f: "disp", a: "c", w: sw - 8 }); k.t(ln, x + sw / 2, y + sh - 11, 6, k.a("#1F2A22", 0.65), { a: "c", w: sw - 8 }) }
  },
  dc(k, W, H, d) {
    k = gSafe(k)
    const r = sRng(d, 63), small = W < 200, big = H > 200
    const sx = 10, sy = 8, sw = small ? W - 20 : big ? W - 20 : 150, sh = small ? H - 38 : big ? 190 : H - 18
    const here = naCamp(k, sx, sy, sw, sh, r, d), cnt = here.length
    if (small) { k.t(`${cnt} around the fire`, W / 2, H - 24, 11, k.I, { f: "disp", a: "c", w: W - 20, lines: 1 }); return }
    const tx = big ? 14 : 170, ty = big ? sy + sh + 10 : 8, tw = W - tx - 12
    k.t("THE CAMPFIRE", tx, ty, 7, k.a(T.altBg, 1), { w: tw, f: "bold" }); k.t(`${cnt} around the fire`, tx, ty + 11, 15, k.I, { f: "disp", w: tw, lines: 1 })
    const chans = [["#", "trail-reports", 2], ["#", "bird-sightings", 0], ["#", "recipes-for-camp", 3], ["v", "the fire circle", cnt]]
    chans.forEach(([kind, nm, n], i) => {
      const y = ty + 36 + i * (big ? 17 : 15), hot = kind === "v"
      if (hot) { const c = k.a(T.altBg, 1); k.rect(tx, y + 3.5, 2.6, 4.5, c); k.poly([[tx + 2.6, y + 3.5], [tx + 6, y + 1], [tx + 6, y + 10.5], [tx + 2.6, y + 8]], c); k.arc(tx + 6.5, y + 5.75, 3.2, -0.9, 0.9, c, 0.9); k.arc(tx + 6.5, y + 5.75, 5.6, -0.8, 0.8, c, 0.9) }
      else k.t("#", tx + 1, y, 9.5, k.S, { w: 10, nofit: true })
      k.t(nm, tx + 14, y, 9.5, hot ? k.a(T.altBg, 1) : k.I, { f: "disp", w: tw - 40, lines: 1 })
      if (n > 0) { const bx = W - 22, c = hot ? k.a(T.altBg, 1) : k.a(T.headBg, 1); if (hot) { for (let j = 0; j < Math.min(4, n); j++) k.circ(bx + 6 - j * 6, y + 6, 2.6, c, k.PN, 0.8) } else { k.circ(bx + 4, y + 6, 5.2, c); k.t(String(n), bx + 4, y + 1.6, 7, k.a("#FFFFFF", 1), { a: "c", w: 10, f: "bold", nofit: true }) } }
    })
    if (big) { const names = ["Fern", "Juniper", "Hazel", "Moss", "Wren", "Sorrel"], cols = [T.altBg, T.headBg, "#5B7DA8", "#B9884A", "#8A5A8C", "#C9573E"]; k.t("WHO'S HERE", tx, ty + 104, 6.5, k.S, { w: 100 }); let nx = tx; here.forEach((i) => { const nm = names[i]; k.circ(nx + 4, ty + 121, 3.4, k.a(cols[i], 1)); k.t(nm, nx + 11, ty + 115, 10, k.I, { f: "disp", w: 60, nofit: true }); nx += 22 + nm.length * 6 }) }
    k.t(`NEW NOTES ${2 + Math.floor(r() * 5)} · MARSHMALLOWS LOW`, tx, H - 18, 6.5, k.S, { w: tw, lines: 1 })
  },
  audio(k, W, H, d) {
    k = gSafe(k)
    const small = W < 250, R = k.a(T.altBg, 1)
    // the wren on her branch, singing: eighth notes drift up from the beak
    const wren = (ox, oy, sc) => { const P = (x, y) => [ox + x * sc, oy + y * sc]; k.ln([P(6, 62), P(86, 50)], k.a("#6B4A2A", 1), 3 * sc); nLeaf(k, ...P(70, 50), 18 * sc, -1.0, k.a(T.headBg, 1)); nLeaf(k, ...P(20, 60), 14 * sc, 2.2, k.a(T.headBg, 0.8))
      k.ell(...P(44, 44), 14 * sc, 10 * sc, k.a(T.altBg, 0.85), k.I, 1); k.circ(...P(56, 37), 7 * sc, k.a(T.altBg, 0.85), k.I, 1); k.poly([P(62, 36), P(70, 38), P(62, 40)], k.a("#E3B341", 1)); k.circ(...P(58, 35), 1.2 * sc, k.I); k.poly([P(30, 44), P(18, 40), P(22, 48)], k.a(T.altBg, 0.85), k.I, 0.8)
      for (let i = 0; i < 8; i++) { const t = i / 7; k.circ(...P(72 + t * 12 + Math.sin(t * 5) * 2, 36 - t * 20), 0.55, k.ia(0.35)) }
      ;[[75, 31, 0.9], [84, 24, 0.78], [79, 16, 0.64]].forEach(([x, y, z], i) => nNote(k, ...P(x, y), z * sc, i === 1 ? "q" : "e", i === 2 ? R : k.I)) }
    if (!small) {
      wren(0, 0, 1)
      k.t(C.audio.src, 92, 12, 8, R, { w: 250, f: "bold" }); k.t(d.line, 92, 24, 18, k.I, { f: "disp", w: W - 106 })
      ;[["SPECIES", "WREN"], ["DISTANCE", "NEAR"], [C.audio.metric, "●".repeat(d.lvl) + "○".repeat(5 - d.lvl)]].forEach(([l, v], i) => { const x = 92 + i * 80; k.t(l, x, 52, 6.5, k.S, { w: 76 }); k.t(v, x, 61, 9, k.I, { w: 76 }) })
      k.t("LISTENING", W - 70, 52, 6.5, k.S, { w: 60 })
    } else {
      wren(-2, 10, 0.7); k.t(C.audio.src, 66, 8, 6.5, R, { w: W - 72, f: "bold", lines: 2 }); k.t(d.line, 66, 26, 11, k.I, { f: "disp", w: W - 72, lines: 3 })
      k.t(`WREN · NEAR · ${"●".repeat(d.lvl)}${"○".repeat(5 - d.lvl)}`, 8, 64, 6.5, k.S, { w: W - 16, lines: 1 })
    }
    // the song itself, written out on a staff that sways a little, like a branch in the wind
    const x0 = 12, x1 = W - 12, sp = 3.2, base = small ? H - 14 : 124, sway = (x) => Math.sin((x - x0) / (x1 - x0) * Math.PI * 1.4 + 0.4) * 1.8
    const lineY = (n, x) => base - n * sp + sway(x)
    const play = Math.floor(((d.phase || 0) * 1.7) % 4)
    // a wren's song in four bars: quick trills, a bright call, a run down, a closing churr
    const song = [
      [["s", 7], ["s", 8], ["s", 7], ["s", 8], ["e", 6], ["e", 5], ["q", 9], ["q", 6]],
      [["h", 8], ["e", 9], ["e", 7], ["r", 0]],
      [["s", 9], ["s", 8], ["s", 7], ["s", 6], ["e", 5], ["e", 6], ["h", 4]],
      [["dh", 7], ["q", 4, "f"]]
    ], words = ["tea-ket-tle,", "tea!", "tea-ket-tle,", "churr."], bars = small ? [0, 2] : [0, 1, 2, 3]
    const U = { s: 1, e: 1.45, q: 1.95, h: 2.6, dh: 3.1, r: 1.7 }, units = bars.map(bi => song[bi].reduce((a, n) => a + U[n[0]], 0)), clefW = 22
    const per = (x1 - x0 - clefW - 4 - bars.length * 12) / units.reduce((a, b) => a + b, 0)
    let bx = x0 + clefW + 4; const bxs = bars.map((bi, j) => { const o = [bx, units[j] * per + 12]; bx += o[1]; return o })
    // highlight the bar that's playing now, under everything
    const pj = Math.max(0, bars.indexOf(play)), [hx, hw] = bxs[pj]
    k.rect(hx + 1, lineY(11, hx) - 2, hw - 2, sp * 12 + 2, k.a(T.headBg, 0.13))
    for (let n = 0; n < 5; n++) { const pts = []; for (let x = x0; x <= x1; x += 4) pts.push([x, lineY(n * 2, x)]); k.ln(pts, k.ia(0.55), 0.6) }
    nClef(k, x0 + 9, lineY(2, x0 + 9), sp * 1.38, k.I)
    k.ln([[x0, lineY(0, x0)], [x0, lineY(8, x0)]], k.I, 0.9)
    bars.forEach((bi, j) => {
      const [bx0, bw] = bxs[j], notes = song[bi], hot = j === pj, col = hot ? R : k.I
      let at = bx0 + 7; const pos = notes.map(n => { const x = at + 2; at += U[n[0]] * per; return x })
      // beams for runs of eighths and sixteenths, stems all on one side of the run
      const runs = []; let cur = null; notes.forEach((n, i) => { if (n[0] === "s" || n[0] === "e") { if (cur && cur.t === n[0] && cur.ix.length < 4) cur.ix.push(i); else { cur = { t: n[0], ix: [i] }; runs.push(cur) } } else cur = null })
      const inRun = new Set(); runs.forEach(rn => rn.ix.forEach(i => inRun.add(i)))
      runs.forEach(rn => {
        const avg = rn.ix.reduce((a, i) => a + notes[i][1], 0) / rn.ix.length, up = avg < 4, sl = 15
        const ys = rn.ix.map(i => lineY(notes[i][1], pos[i])), e0 = up ? Math.min(...ys) - sl : Math.max(...ys) + sl, slope = (rn.ix.length > 1 ? (ys[ys.length - 1] - ys[0]) * 0.35 : 0)
        const endAt = (q) => e0 + (rn.ix.length > 1 ? (q / (rn.ix.length - 1) - 0.5) * slope : 0)
        rn.ix.forEach((i, q) => { const y = ys[q], sx = up ? pos[i] + 3.3 : pos[i] - 3.3; nLedger(k, pos[i], notes[i][1], lineY, col); nHead(k, pos[i], y, false, col, sp); k.ln([[sx, y], [sx, endAt(q)]], col, 0.8) })
        const fx = up ? 3.3 : -3.3, ax = pos[rn.ix[0]] + fx, bx2 = pos[rn.ix[rn.ix.length - 1]] + fx, ay = endAt(0), by = endAt(rn.ix.length - 1), dy = up ? 1 : -1
        for (let bm = 0; bm < (rn.t === "s" ? 2 : 1); bm++) k.poly([[ax, ay + dy * bm * 3], [bx2, by + dy * bm * 3], [bx2, by + dy * (bm * 3 + 2)], [ax, ay + dy * (bm * 3 + 2)]], col)
      })
      notes.forEach((n, i) => {
        if (inRun.has(i)) return
        const x = pos[i], y = lineY(n[1], x)
        if (n[0] === "r") { const m = lineY(4, x); k.ln([[x - 1, m - 6], [x + 2, m - 2.5], [x - 1.5, m + 0.5], [x + 1.5, m + 4], [x - 0.5, m + 5]], col, 1.2); return }
        nLedger(k, x, n[1], lineY, col); nHead(k, x, y, n[0] === "h" || n[0] === "dh", col, sp)
        const up = n[1] < 4, sx = up ? x + 3.3 : x - 3.3; k.ln([[sx, y], [sx, up ? y - 14 : y + 14]], col, 0.8)
        if (n[0] === "dh") k.circ(x + 6, y - (n[1] % 2 === 0 ? sp * 0.5 : 0), 0.9, col)
        if (n[2] === "f") { const fy = lineY(10.5, x); k.arc(x, fy + 2, 4, Math.PI, Math.PI * 2, col, 0.9); k.circ(x, fy + 1, 0.8, col) }
      })
      // a slur over each phrase
      const last = notes[notes.length - 1][0] === "r" ? notes.length - 2 : notes.length - 1
      if (last > 0) { const xa = pos[0], xb = pos[last], top = lineY(Math.max(9.6, ...notes.slice(0, last + 1).map(n => n[1] + 1.6)), (xa + xb) / 2) - 1; const pts = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([xa + (xb - xa) * t, top - Math.sin(t * Math.PI) * 3]); k.ln(pts, k.ia(0.45), 0.7) }
      // bar line, and the song's words underneath like lyrics
      const ex = bx0 + bw; k.ln([[ex, lineY(0, ex)], [ex, lineY(8, ex)]], k.I, 0.6)
      if (!small) k.t(words[bi], bx0 + 5, base + 4, 8, hot ? R : k.S, { f: "disp", w: bw - 8, lines: 1 })
    })
    // a double bar at the end, with a sprig growing off it
    k.ln([[x1 - 3, lineY(0, x1)], [x1 - 3, lineY(8, x1)]], k.I, 0.6); k.ln([[x1, lineY(0, x1)], [x1, lineY(8, x1)]], k.I, 1.8)
    if (!small) { nLeaf(k, x1 - 1, lineY(8, x1) - 1, 9, -2.3, k.a(T.headBg, 0.9)); nLeaf(k, x1 - 1, lineY(8, x1) - 1, 7, -1.3, k.a(T.headBg, 0.7)) }
  }
}

// ---------- LONG ODDS (hyper-gambling prediction market) ----------
const mkNo = () => new Color("#FF2D55")
const mkGold = () => new Color("#FFD84A")
function mkCard(k, x, y, w, h, hot) { k.rect(x, y, w, h, k.PN); k.rect(x, y, w, h, null, k.a(hot || T.accent, 0.55), 1); k.rect(x, y, w, 1.5, k.a(hot || T.accent, 1)) }
function mkYesNo(k, x, y, w, h, p) { const g = k.a(T.altBg, 1), n = mkNo(), half = (w - 4) / 2; k.rect(x, y, half, h, k.a(T.altBg, 0.14), k.a(T.altBg, 0.9), 1); k.rect(x + half + 4, y, half, h, k.a("#FF2D55", 0.12), k.a("#FF2D55", 0.85), 1); const fz = Math.min(10, h * 0.62); k.t(`YES ${Math.round(p * 100)}¢`, x + half / 2, y + h / 2 - fz * 0.6, fz, g, { f: "bold", a: "c", w: half, nofit: true }); k.t(`NO ${100 - Math.round(p * 100)}¢`, x + half * 1.5 + 4, y + h / 2 - fz * 0.6, fz, n, { f: "bold", a: "c", w: half, nofit: true }) }
function mkCand(k, x, y, w, h, n, r, trend) { const cw = w / n; let v = 0.5; for (let i = 0; i < n; i++) { const o = v; v = Math.max(0.08, Math.min(0.92, v + (r() - 0.5 + (trend || 0)) * 0.24)); const up = v >= o, col = up ? k.a(T.altBg, 1) : mkNo(), cx = x + i * cw + cw / 2, hi = Math.max(o, v) + r() * 0.06, lo = Math.min(o, v) - r() * 0.06; k.ln([[cx, y + h * (1 - hi)], [cx, y + h * (1 - lo)]], col, 0.8); const yt = y + h * (1 - Math.max(o, v)), yb = y + h * (1 - Math.min(o, v)); k.rect(cx - cw * 0.3, yt, cw * 0.6, Math.max(1.2, yb - yt), col) } return v }
function mkArea(k, x, y, w, h, r, up) { const pts = []; let v = up ? 0.3 : 0.7; for (let i = 0; i <= 24; i++) { v = Math.max(0.05, Math.min(0.95, v + (r() - (up ? 0.38 : 0.62)) * 0.16)); pts.push([x + w * i / 24, y + h * (1 - v)]) } const col = up ? T.altBg : "#FF2D55"; k.poly(pts.concat([[x + w, y + h], [x, y + h]]), k.a(col, 0.16)); k.ln(pts, k.a(col, 0.35), 3); k.ln(pts, k.a(col, 1), 1.2) }
function mkLev(k, x, y, sel, small) { ["1X", "5X", "25X", "100X"].forEach((l, i) => { const w = small ? 22 : 28, xx = x + i * (w + 4); k.rect(xx, y, w, 11, i === sel ? k.a(T.accent, 1) : k.ia(0.08)); k.t(l, xx + w / 2, y + 1.5, 6.5, i === sel ? k.a("#FFFFFF", 1) : k.S, { a: "c", w, f: "bold", nofit: true }) }) }
function mkLive(k, x, y) { k.circ(x + 3, y + 4, 3, mkNo()); k.t("LIVE", x + 9, y, 7, mkNo(), { f: "bold", w: 30 }) }
function mkWhale(k, x, y, w, txt2) { for (let i = 0; i < 10; i++) k.rect(x + i * w / 10, y, w / 10 + 0.5, 11, k.a(i < 6 ? T.accent : "#FF2D55", 0.85)); k.t(txt2, x + w / 2, y + 1.5, 6.5, k.a("#FFFFFF", 1), { a: "c", w: w - 6, f: "bold" }) }
const MK = {
  status(k, W, H, d) {
    const wx = d.wx || {}, r = k.rng(dayOfYear(d.now) * 3 + d.now.getHours()), p = d.ev ? (d.ev.active ? 0.91 : 0.6 + r() * 0.35) : 0.5
    mkLive(k, 10, 4); k.t(d.ev ? "RESOLVES TODAY" : "NO OPEN BETS", 50, 4, 7, k.S, { w: 120 })
    mkCard(k, 10, 16, 214, H - 32)
    const QS = [(t) => `WILL "${t}" HAPPEN IN ANOTHER TIMELINE TOO?`, (t) => `WILL "${t}" MATTER IN 10,000 YEARS?`, (t) => `WILL YOU ATTEND "${t}" AS YOURSELF?`, (t) => `WILL THE ROOM REMEMBER "${t}"?`, (t) => `WILL "${t}" END BEFORE IT BEGINS?`, (t) => `IS "${t}" ALREADY PRICED INTO THE UNIVERSE?`]
    k.para(d.ev ? QS[(dayOfYear(d.now) + d.now.getHours()) % QS.length](d.ev.title.toUpperCase()) : MK_QS[(dayOfYear(d.now) + d.now.getHours()) % MK_QS.length].toUpperCase(), 18, 22, 140, 11, k.I, "disp", 3, 1.08)
    k.t(`${Math.round(p * 100)}%`, 216, 20, 22, k.a(T.altBg, 1), { f: "disp", a: "r", w: 70 }); k.t(`▲${(r() * 40).toFixed(0)}% · 1H`, 216, 46, 6.5, k.a(T.altBg, 1), { a: "r", w: 70 })
    mkLev(k, 18, 62, 3, true)
    mkYesNo(k, 18, 78, 198, 16, p)
    k.t("PAYOUT IF YES", 18, 99, 6, k.S, { w: 80 }); k.t(`$${(1000 / Math.max(0.05, p) * (1 + r())).toFixed(0)}`, 18, 106, 13, mkGold(), { f: "disp", w: 100 }); mkArea(k, 120, 98, 96, 22, r, true)
    const rx = 232
    ;[["THE RAIN REMEMBERS YOU?", wx.cond && /RAIN|SHOWER|DRIZZLE|STORM/.test(wx.cond) ? 0.62 : 0.09], ["TOMORROW ARRIVES ON TIME?", 0.88 + r() * 0.1], ["BATTERY OUTLASTS THE DAY?", Math.max(0.03, Math.min(0.97, d.batt))]].forEach(([q, pr], i) => { const y = 16 + i * 38; mkCard(k, rx, y, W - rx - 10, 33, i === 1 ? "#FF2D55" : T.accent); k.para(q, rx + 6, y + 4, W - rx - 52, 6, k.I, "bold", 2, 1.15); k.t(`${Math.round(pr * 100)}%`, W - 16, y + 3, 10, pr > 0.5 ? k.a(T.altBg, 1) : mkNo(), { f: "disp", a: "r", w: 40 }); k.rect(rx + 6, y + 21, (W - rx - 22) * pr, 5, k.a(T.altBg, 1)); k.rect(rx + 6 + (W - rx - 22) * pr, y + 21, (W - rx - 22) * (1 - pr), 5, mkNo()) })
    mkWhale(k, 10, H - 13, W - 20, `BREAKING · ${mkNews(Math.floor(Date.now() / 1800000)).toUpperCase()}`)
  },
  shift(k, W, H, d) {
    const r = k.rng(7), f = d.ev ? d.frac : 0
    mkLive(k, 12, 4); k.t(d.ev ? (d.ev.active ? "RESOLVES IN" : "MARKET OPENS IN") : "BETWEEN BETS", 52, 4, 7, k.a(T.accent, 1), { f: "bold", w: W - 64 })
    k.t(d.ev ? d.ev.title.toUpperCase() : d.L.offTitle.toUpperCase(), 12, 16, 10, k.I, { f: "disp", w: W - 24 })
    mkCand(k, 12, 66, W - 24, 28, 16, r, 0.06)
    k.rect(12 + (W - 24) * f, 64, 1.2, 32, mkGold()); k.circ(12 + (W - 24) * f, 64, 2.5, mkGold())
    k.t("PAYOUT", 12, 99, 6.5, k.S, { w: 60 }); k.rect(W - 54, 98, 42, 11, mkGold()); k.t(`x${(1 / Math.max(0.1, 0.4 + f * 0.5)).toFixed(1)}`, W - 33, 99.5, 7, k.a("#000000", 1), { a: "c", w: 40, f: "bold" })
    mkYesNo(k, 12, 113, W - 24, 15, Math.max(0.05, Math.min(0.95, 0.4 + f * 0.5)))
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, r = k.rng(parseInt(d.hex, 16))
    mkCard(k, 8, 6, W - 16, H - 12, d.archival ? "#FFD84A" : T.accent)
    const rating = d.archival ? "FROM THE ARCHIVE" : d.cls
    k.rect(16, 13, Math.min(120, rating.length * 6.2 + 14), 13, d.archival ? mkGold() : k.a(T.accent, 1)); k.t(rating, 23, 14.5, 7, k.a(d.archival ? "#000000" : "#FFFFFF", 1), { f: "bold", w: 120 })
    if (!small) { mkLive(k, W - 80, 15); k.t(`🔥 ${60 + parseInt(d.hex, 16) % 39}`, W - 16, 15, 7.5, mkGold(), { a: "r", w: 40, f: "bold" }) }
    const tw = W - (small ? 32 : 120), fs = fitFs(k, d.text.toUpperCase(), tw, small ? 4 : 3, small ? 13 : (big ? 20 : 17), "disp"), n = k.para(d.text.toUpperCase(), 16, 32, tw, fs, k.I, "disp", small ? 4 : 3, 1.08)
    k.t(`— ${d.by}`, 16, 36 + n * fs * 1.08, small ? 6.5 : 7.5, k.S, { w: W - 32 })
    if (!small) { mkArea(k, W - 98, 34, 80, 44, r, true); k.t(`▲ ${(10 + r() * 190).toFixed(0)}%`, W - 18, 82, 8, k.a(T.altBg, 1), { a: "r", w: 80, f: "bold" }) }
    if (!small && H - 28 > 44 + n * fs * 1.08 + 14) mkWhale(k, 16, H - 27, W - 32, `BREAKING · ${mkNews(parseInt(d.hex, 16)).toUpperCase()}`)
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, r = k.rng(dayOfYear(d.now)), top = 30, ch = small ? 62 : 70
    k.t(d.up ? C.solar.day : C.solar.night, 12, 6, 7, k.a(T.accent, 1), { f: "bold", w: 170 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, 15, 13, k.a(T.altBg, 1), { f: "disp", w: 80 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 7, mkNo(), { a: "r", w: 170, f: "bold" })
    for (let i = 0; i <= 4; i++) k.ln([[10, top + ch * i / 4], [W - 10, top + ch * i / 4]], k.ia(0.06), 0.6)
    const n = small ? 16 : 32, cw = (W - 20) / n, nowI = Math.floor((d.up ? d.frac : 0) * n)
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, alt = Math.sin(Math.PI * t), o = Math.sin(Math.PI * (i / n)), up = alt >= o, col = i > nowI ? k.ia(0.12) : (up ? k.a(T.altBg, 1) : mkNo()); const x = 10 + i * cw + cw / 2, yt = top + ch * (1 - Math.max(o, alt) * 0.9), yb = top + ch * (1 - Math.min(o, alt) * 0.9); k.ln([[x, yt - 3 - r() * 4], [x, yb + 3 + r() * 4]], col, 0.7); k.rect(x - cw * 0.3, yt, cw * 0.6, Math.max(1.5, yb - yt), col) }
    k.rect(10 + nowI * cw, top - 2, 1.2, ch + 4, mkGold()); if (!small) { const bx = nowI * cw > W * 0.6 ? 10 + nowI * cw - 50 : 10 + nowI * cw + 4; k.rect(bx, top + ch - 16, 46, 11, mkGold()); k.t("LONG 50X", bx + 23, top + ch - 14.5, 6.5, k.a("#000000", 1), { a: "c", w: 46, f: "bold" }) }
    k.ln([[10, top + ch * 0.92], [W - 10, top + ch * 0.92]], k.a("#FF2D55", 0.5), 0.8); if (!small) k.t("LIQUIDATION", W - 12, top + ch * 0.92 - 9, 6, mkNo(), { a: "r", w: 70 })
    k.t(`OPEN ${shortT(d.rise)}`, 12, top + ch + 5, 7, k.S, { w: 90 }); k.t(`CLOSE ${shortT(d.set)}`, W - 12, top + ch + 5, 7, k.S, { a: "r", w: 90 })
    if (big && d.atm) {
      k.t("SKY CASINO // DOES THE SKY KNOW WE ARE BETTING?", 12, 132, 6.5, k.a(T.accent, 1), { w: 300, f: "bold" })
      atmItems(d.atm).forEach(([l, v], i) => { const x = 12 + (i % 3) * 114, y = 146 + Math.floor(i / 3) * 78, pr = 0.15 + ((i * 37 + dayOfYear(d.now)) % 75) / 100; mkCard(k, x, y, 106, 68, i % 2 ? "#FF2D55" : T.accent); k.t(l, x + 8, y + 7, 6.5, k.S, { w: 60, f: "bold" }); k.t(v, x + 8, y + 19, String(v).length > 4 ? 13 : 16, k.I, { f: "disp", w: 60 }); inst(k, i, x + 70, y + 12, d.atm, { ink: k.a(T.altBg, 1), hot: mkNo(), faint: k.ia(0.12) }); mkYesNo(k, x + 8, y + 48, 90, 13, pr) })
      mkWhale(k, 12, H - 30, W - 24, `BREAKING · ${mkNews(Math.floor(Date.now() / 1800000) + 13).toUpperCase()}`)
    }
  },
  feed(k, W, H, d) {
    const m = 8, r = k.rng(d.side.length * 17), up = d.side === "yt", p = up ? 0.64 : 0.38
    mkCard(k, m, 8, W - m * 2, H * 0.5, up ? T.altBg : "#FF2D55")
    k.t(up ? "YOUR DOUBLE GOES VIRAL?" : "YOUR POST IS FOUND IN 3026?", m + 8, 13, 6.5, k.S, { w: W - m * 2 - 70 }); k.t(up ? "▲ PUMPING" : "▼ DUMPING", W - m - 8, 13, 7, up ? k.a(T.altBg, 1) : mkNo(), { a: "r", w: 70, f: "bold" })
    k.t(up ? "+34%" : "-12%", m + 8, 22, 18, up ? k.a(T.altBg, 1) : mkNo(), { f: "disp", w: 90 }); mkArea(k, m + 84, 24, W - m * 2 - 92, 22, r, up)
    mkYesNo(k, m + 8, 8 + H * 0.5 - 22, W - m * 2 - 16, 14, p)
    k.t(d.line.toUpperCase(), m, 8 + H * 0.5 + 5, 11, k.I, { f: "disp", w: W - m * 2 })
    d.meters.forEach(([n, v], i) => { const y = 8 + H * 0.5 + 21 + i * 11; k.t(n, m, y, 6.5, k.S, { w: 60 }); k.rect(m + 64, y + 2, W - m * 2 - 98, 5, k.ia(0.08)); k.rect(m + 64, y + 2, (W - m * 2 - 98) * v, 5, i === 2 ? mkNo() : k.a(T.accent, 1)); k.t(pct(v), W - m, y, 6.5, k.I, { a: "r", w: 30 }) })
    k.t(d.tag, m, H - 13, 6.5, up ? k.a(T.altBg, 1) : mkNo(), { w: W - m * 2, f: "bold" })
  },
  yt(k, W, H, d) {
    const r = sRng(d, 71), small = W < 200, rows = [["THE ALGORITHM DREAMS OF YOU?", 0.22, "25X"], ["YOU WATCH UNTIL THE STARS DIM?", 0.71, "100X"], ["THE NEXT VIDEO KNOWS YOUR NAME?", 0.37, "5X"], ["THE AD WATCHES BACK?", 0.64, "50X"]]
    mkLive(k, 12, 4); k.t("WATCH & BET", 52, 4, 7, k.a(T.accent, 1), { f: "bold", w: 140 })
    rows.slice(0, small ? 3 : 4).forEach(([q, p, lev], i) => { const y = 17 + i * (small ? 38 : 28), w = small ? W - 24 : 214; mkCard(k, 12, y, w, small ? 33 : 24, p > 0.5 ? T.altBg : "#FF2D55"); k.t(q, 18, y + 4, 7, k.I, { w: w - 60, f: "bold" }); k.t(lev, 12 + w - 6, y + 3, 7, k.a(T.accent, 1), { a: "r", w: 40, f: "bold" }); const pp = Math.max(0.03, Math.min(0.97, p + (r() - 0.5) * 0.1)); k.rect(18, y + (small ? 18 : 15), (w - 12) * pp, small ? 9 : 5, k.a(T.altBg, 1)); k.rect(18 + (w - 12) * pp, y + (small ? 18 : 15), (w - 12) * (1 - pp), small ? 9 : 5, mkNo()) })
    if (small) return
    const rx = 236
    mkCard(k, rx, 17, W - rx - 12, 108, "#FFD84A"); k.t("YOUR P&L", rx + 8, 23, 6.5, k.S, { w: 90 }); k.t(`+$${(r() * 9000).toFixed(0)}`, rx + 8, 32, 17, mkGold(), { f: "disp", w: 110 }); mkArea(k, rx + 8, 56, W - rx - 28, 30, r, true)
    k.t(`TIME WATCHED ${mmss(300 + r() * 3000)}`, rx + 8, 92, 6.5, k.S, { w: 110 }); k.t(`STREAK ${3 + Math.floor(r() * 9)} WINS 🔥`, rx + 8, 104, 6.5, k.a(T.altBg, 1), { w: 110, f: "bold" })
  },
  ig(k, W, H, d) {
    const r = sRng(d, 72), small = W < 200, cols = small ? 3 : 5, cs = small ? 44 : 50
    for (let i = 0; i < cols * (small ? 2 : 1); i++) { const x = 12 + (i % cols) * (cs + 6), y = 8 + Math.floor(i / cols) * (cs + 6), up = r() > 0.4, ch2 = (r() * (up ? 300 : 60)).toFixed(0); mkCard(k, x, y, cs, cs, up ? T.altBg : "#FF2D55"); k.rect(x + 4, y + 5, cs - 8, cs - 21, k.a(T.accent, 0.12 + r() * 0.15)); mkPost(k, gShuf((d.seed || 7) * 17 + 8, 10)[i], x + cs / 2, y + (cs - 16) / 2 + 4, cs / 50 * 0.95); k.t(`${up ? "▲" : "▼"}${ch2}%`, x + cs / 2, y + cs - 13, 7, up ? k.a(T.altBg, 1) : mkNo(), { a: "c", w: cs, f: "bold" }) }
    if (small) return
    k.t("HYPE INDEX // YOUR FEED, LEVERAGED", 12, 66, 7, k.a(T.accent, 1), { f: "bold", w: 260 })
    ;[["POSTS PRICED", `${40 + Math.floor(r() * 300)}`, k.I], ["MOONING", `${50 + Math.floor(r() * 40)}%`, k.a(T.altBg, 1)], ["REKT", `${5 + Math.floor(r() * 30)}%`, mkNo()]].forEach(([l, v, col], i) => { const x = 12 + i * 112; k.t(l, x, 80, 6.5, k.S, { w: 100 }); k.t(v, x, 90, 16, col, { f: "disp", w: 100 }) })
    mkWhale(k, 12, 114, W - 24, `BREAKING · ${mkNews(Math.floor(Date.now() / 1800000) + 7).toUpperCase()}`)
  },
  dc(k, W, H, d) {
    const r = sRng(d, 73), small = W < 200, traders = [["@moby_whale", 1], ["@paperhands", -1], ["@kelly_k", 1], ["@rekt_again", -1], ["@moonboi", 1], ["@priced_in", 1]]
    mkLive(k, 12, 4); k.t("THE PIT // ONLINE", 52, 4, 7, k.a(T.accent, 1), { f: "bold", w: W - 64 })
    traders.slice(0, small ? 5 : 6).forEach(([h2, s2], i) => { const y = 18 + i * 15, pnl = (r() * (i === 0 ? 900 : 90)).toFixed(0); k.circ(18, y + 5, 3, s2 > 0 ? k.a(T.altBg, 1) : mkNo()); k.t(h2, 26, y, 8, k.I, { w: 90 }); k.t(`${s2 > 0 ? "+" : "-"}$${pnl}K`, small ? W - 14 : 162, y, 8, s2 > 0 ? k.a(T.altBg, 1) : mkNo(), { a: "r", w: 60, f: "bold" }); if (i === 0 && !small) k.t("🐋", 168, y - 1, 9, k.I, { w: 14 }) })
    if (small) return
    const rx = 186
    mkCard(k, rx, 16, W - rx - 12, 112)
    ;["# is-time-real", "# void-market-makers", "# remember-tuesday", "🔊 the trading pit"].forEach((c2, i) => { const y = 24 + i * 16; k.t(c2, rx + 8, y, 8.5, i === 3 ? k.a(T.accent, 1) : k.I, { w: 150 }); if (r() > 0.4) k.circ(W - 24, y + 5, 3, mkNo()) })
    k.t(`OPEN INTEREST $${(10 + r() * 990).toFixed(0)}M`, rx + 8, 92, 7, mkGold(), { w: 160, f: "bold" }); mkYesNo(k, rx + 8, 106, W - rx - 28, 14, 0.57)
  },
  audio(k, W, H, d) {
    const r = k.rng(Math.floor(d.phase * 100))
    mkCard(k, 10, 10, 74, 60); mkCand(k, 16, 18, 62, 30, 8, r, 0.1); k.poly([[38, 52], [52, 59], [38, 66]], k.a(T.accent, 1))
    k.t(C.audio.src, 92, 12, 8, k.a(T.accent, 1), { w: 250, f: "bold" }); k.t(d.line.toUpperCase(), 92, 24, 16, k.I, { f: "disp", w: W - 106 })
    ;[["TICKER", "$PUMP"], ["24H", `+${(r() * 300).toFixed(0)}%`], [C.audio.metric, "▲".repeat(d.lvl) + "△".repeat(5 - d.lvl)]].forEach(([l, v], i) => { const x = 92 + i * 80; k.t(l, x, 52, 6.5, k.S, { w: 76 }); k.t(v, x, 61, 9, i === 1 ? k.a(T.altBg, 1) : k.I, { w: 76, f: "bold" }) })
    mkCand(k, 12, 84, W - 24, 40, 44, r, 0.06)
    k.t("PLAYING", W - 70, 52, 6.5, mkNo(), { w: 60, f: "bold" })
  }
}
