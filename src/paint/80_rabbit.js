// ---------- WHITE RABBIT (lilac haze, pearl, magenta, sparkles) ----------
function rbSpark(k, x, y, r, c) { k.poly([[x, y - r], [x + r * 0.22, y - r * 0.22], [x + r, y], [x + r * 0.22, y + r * 0.22], [x, y + r], [x - r * 0.22, y + r * 0.22], [x - r, y], [x - r * 0.22, y - r * 0.22]], c || k.A) }
function rbHeart(k, x, y, s, fill, stroke, lw) { const p = new Path(); const P = (a, b) => new Point(a, b); p.move(P(x, y + s * 0.35)); p.addQuadCurve(P(x - s * 0.5, y - s * 0.05), P(x - s * 0.55, y + s * 0.15)); p.addQuadCurve(P(x, y - s * 0.12), P(x - s * 0.35, y - s * 0.5)); p.addQuadCurve(P(x + s * 0.5, y - s * 0.05), P(x + s * 0.35, y - s * 0.5)); p.addQuadCurve(P(x, y + s * 0.35), P(x + s * 0.55, y + s * 0.15)); k.dc.addPath(p); if (fill) { k.dc.setFillColor(fill); k.dc.fillPath() } if (stroke) { k.dc.addPath(p); k.dc.setStrokeColor(stroke); k.dc.setLineWidth(lw || 1); k.dc.strokePath() } }
function rbRabbit(k, x, y, s, fill, stroke) {
  k.ell(x, y, s * 0.42, s * 0.22, fill, stroke, 1)
  k.ell(x + s * 0.38, y - s * 0.12, s * 0.16, s * 0.13, fill, stroke, 1)
  k.ell(x + s * 0.34, y - s * 0.36, s * 0.05, s * 0.17, fill, stroke, 1); k.ell(x + s * 0.44, y - s * 0.34, s * 0.05, s * 0.16, fill, stroke, 1)
  k.ell(x - s * 0.26, y + s * 0.12, s * 0.2, s * 0.08, fill, stroke, 1); k.ell(x + s * 0.18, y + s * 0.2, s * 0.12, s * 0.05, fill, stroke, 1)
  k.circ(x - s * 0.44, y - s * 0.06, s * 0.07, fill, stroke, 1); k.circ(x + s * 0.43, y - s * 0.14, s * 0.02, k.A)
}
function rbWatch(k, cx, cy, R, now, small) {
  k.circ(cx, cy, R + 3, k.a(T.headBg, 0.35)); k.circ(cx, cy, R, k.a(T.panel, 0.95), k.I, 1.4); k.circ(cx, cy, R - 4, null, k.a(T.headBg, 0.9), 0.8)
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, l = i % 5 === 0 ? 5 : 2; k.ln([[cx + (R - 5) * Math.cos(a), cy + (R - 5) * Math.sin(a)], [cx + (R - 5 - l) * Math.cos(a), cy + (R - 5 - l) * Math.sin(a)]], k.ia(i % 5 ? 0.35 : 0.8), i % 5 ? 0.5 : 1) }
  if (!small) ["XII", "III", "VI", "IX"].forEach((n, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; k.t(n, cx + (R - 16) * Math.cos(a), cy + (R - 16) * Math.sin(a) - 4, 7, k.I, { f: "disp", a: "c", w: 22 }) })
  const h = now.getHours() % 12 + now.getMinutes() / 60, m = now.getMinutes() / 60
  k.ln([[cx, cy], [cx + R * 0.45 * Math.cos(h / 12 * Math.PI * 2 - Math.PI / 2), cy + R * 0.45 * Math.sin(h / 12 * Math.PI * 2 - Math.PI / 2)]], k.I, 2)
  k.ln([[cx, cy], [cx + R * 0.7 * Math.cos(m * Math.PI * 2 - Math.PI / 2), cy + R * 0.7 * Math.sin(m * Math.PI * 2 - Math.PI / 2)]], k.A, 1.3)
  k.circ(cx, cy, 2.5, k.A); k.rect(cx - 5, cy - R - 8, 10, 6, k.a(T.headBg, 1), k.I, 0.8); k.circ(cx, cy - R - 11, 3.5, null, k.I, 0.9)
}
function rbDial(k, cx, cy, R, now) {
  k.circ(cx, cy, R + 3, k.a(T.headBg, 0.35)); k.circ(cx, cy, R, k.a(T.panel, 0.95), k.I, 1.4); k.circ(cx, cy, R * 0.62, k.a(T.headBg, 0.25), k.ia(0.5), 0.8)
  const rot = (now.getMinutes() / 60) * Math.PI * 2
  for (let i = 0; i < 50; i++) { const a = i / 50 * Math.PI * 2 - Math.PI / 2 + rot, l = i % 5 === 0 ? 6 : 2.5; k.ln([[cx + (R - 3) * Math.cos(a), cy + (R - 3) * Math.sin(a)], [cx + (R - 3 - l) * Math.cos(a), cy + (R - 3 - l) * Math.sin(a)]], k.ia(i % 5 ? 0.35 : 0.85), i % 5 ? 0.5 : 1) }
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2 + rot; k.t(String(i * 10), cx + (R - 15) * Math.cos(a), cy + (R - 15) * Math.sin(a) - 4, 6.5, k.I, { a: "c", w: 18 }) }
  k.poly([[cx, cy - R - 2], [cx - 5, cy - R - 10], [cx + 5, cy - R - 10]], k.A)
  for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 3 + rot * 0.5; k.ln([[cx, cy], [cx + R * 0.5 * Math.cos(a), cy + R * 0.5 * Math.sin(a)]], k.I, 2.4); k.circ(cx + R * 0.5 * Math.cos(a), cy + R * 0.5 * Math.sin(a), 3, k.I) }
  k.circ(cx, cy, 5, k.A)
}
function rbHaze(k, W, H, n) { const r = k.rng(n || 5); for (let i = 0; i < 9; i++) { const x = r() * W, a = -1.2 + r() * 0.5; k.ln([[x, 0], [x + Math.cos(a) * -H * 2, H]], k.a(T.headBg, 0.25), 0.5) } for (let i = 0; i < 7; i++) rbSpark(k, 8 + r() * (W - 16), 6 + r() * (H - 12), 2 + r() * 3, k.a(T.accent, 0.25 + r() * 0.4)) }
const RB = {
  status(k, W, H, d) {
    const wx = d.wx || {}
    rbHaze(k, W, H, 3)
    rbDial(k, 62, H / 2 + 6, 46, d.now)
    const x0 = 128
    k.t(d.ev ? (d.ev.active ? "THE JOB · IN PROGRESS" : "THE NEXT JOB") : "NO JOBS TONIGHT", x0, 8, 7, k.A, { w: 220 })
    k.para(d.ev ? d.ev.title : "Laying low. Keep the ears down.", x0, 20, W - x0 - 14, 16, k.I, "disp", 2, 1.08)
    k.t(d.ev ? `WINDOW ${shortT(d.ev.start)} — ${shortT(d.ev.end)}` : "", x0, 58, 8.5, k.I, { w: 200 })
    if (d.ev) { const mins = Math.max(0, Math.round((d.ev.start - d.now) / 60000)); k.t(d.ev.active ? "Leave the card. Take the rest." : mins < 15 ? "Masks on. Lights off." : `${mins} minutes to case it`, x0, 70, 9, k.S, { f: "disp", w: 210 }) }
    ;[["COVER", wx.temp != null ? `${wx.temp}° ${(wx.cond || "").toLowerCase()}` : "--"], ["FEELS", wx.feels != null ? `${wx.feels}°` : "--"], ["HI / LO", wx.hi != null ? `${wx.hi}° / ${wx.lo}°` : "--"]].forEach(([l, v], i) => { const x = x0 + [0, 108, 158][i], w2 = [100, 44, 64][i]; k.rect(x, 86, w2, 26, k.a(T.panel, 0.8), k.a(T.headBg, 1), 0.8); k.t(l, x + 5, 89, 6, k.S, { w: w2 - 8 }); k.t(v, x + 5, 98, 8.5, k.I, { w: w2 - 8 }) })
    for (let i = 0; i < 5; i++) rbHeart(k, x0 + 6 + i * 13, 124, 10, i / 5 < d.batt ? k.A : null, k.A, 0.9)
    k.t(`NERVE ${pct(d.batt)}`, x0 + 72, 120, 6.5, k.S, { w: 80 }); k.t(`HEIST ${String(dayOfYear(d.now) % 7 + 1).padStart(2, "0")}/07`, W - 14, 120, 6.5, k.A, { a: "r", w: 80 })
  },
  shift(k, W, H, d) {
    rbHaze(k, W, H, 4)
    k.t(d.ev ? (d.ev.active ? "GETAWAY · TIME TO THE EXIT" : "THE JOB STARTS IN") : "LAYING LOW", 12, 6, 7, k.A, { w: W - 24 })
    k.t(d.ev ? d.ev.title : d.L.offTitle, 12, 17, 11, k.I, { f: "disp", w: W - 24 })
    const pts = [[18, 118], [18, 98], [46, 98], [46, 80], [22, 80], [22, 62], [52, 62], [52, 46]]
    k.rect(10, 112, 18, 13, k.a(T.headBg, 0.5), k.I, 0.8); k.t("VAULT", 19, 127, 5.5, k.S, { a: "c", w: 30 })
    k.rect(42, 36, 20, 10, k.a(T.accent, 0.3), k.A, 0.8); k.t("EXIT", 52, 38, 5, k.A, { a: "c", w: 24 })
    for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c2, e] = pts[i + 1]; for (let t2 = 0; t2 <= 1; t2 += 0.15) k.circ(a + (c2 - a) * t2, b + (e - b) * t2, 0.9, k.ia(0.45)) }
    ;[[8, 90, 60, 86], [8, 72, 60, 68], [8, 54, 60, 57]].forEach(([a, b, c2, e]) => k.ln([[a, b], [c2, e]], k.a(T.accent, 0.55), 0.8))
    const f = d.ev ? d.frac : 0, seg = f * (pts.length - 1), i0 = Math.min(pts.length - 2, Math.floor(seg)), tt = seg - i0
    const rx = pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * tt, ry = pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * tt
    rbRabbit(k, rx, ry, 16, k.PN, k.I)
    k.t(d.ev ? (d.ev.active ? "TO THE EXIT" : "UNTIL WE MOVE") : "", 70, 46, 7, k.S, { w: 96 })
    if (d.ev) { k.t(`${pct(f)} of the route`, 70, 96, 9, k.S, { f: "disp", w: 96 }); k.t(`Gone by ${shortT(d.ev.end)}`, 70, 110, 9, k.S, { f: "disp", w: 96 }) }
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, x0 = 10, y0 = 6, w = W - 20, h = H - 12
    k.rect(x0, y0, w, h, k.a(T.panel, 0.9), k.a(T.headBg, 1), 1); k.rect(x0 + 4, y0 + 4, w - 8, h - 8, null, k.a(T.accent, 0.35), 0.6)
    ;[[x0 + 12, y0 + 14, 1], [x0 + w - 12, y0 + h - 14, -1]].forEach(([x, y]) => { k.t("A", x, y - 7, 9, k.A, { f: "disp", a: "c", w: 14 }); rbHeart(k, x, y + 8, 8, k.A) })
    k.t(d.archival ? "ARCHIVE / ATTRIBUTED" : `A CALLING CARD · LOT 0${parseInt(d.hex, 16) % 7 + 1}/07`, W / 2, y0 + 10, 7, k.A, { a: "c", w: W - 60 })
    const fs = fitFs(k, d.text, w - 52, small ? 4 : 3, small ? 13 : (big ? 21 : 18), "disp"), n = k.para(d.text, x0 + 26, y0 + 24, w - 52, fs, k.I, "disp", small ? 4 : 3, 1.12)
    k.t(`— ${d.by}`, W / 2, y0 + 28 + n * fs * 1.12, small ? 6.5 : 7.5, k.S, { a: "c", w: W - 60 })
    const e0 = y0 + 44 + n * fs * 1.12, e1 = y0 + h - 12
    if (!small && e1 - e0 > 16) { const r = k.rng(parseInt(d.hex, 16)); for (let i = 0; i < 9; i++) rbSpark(k, x0 + 40 + i * ((w - 80) / 8), e0 + (e1 - e0) / 2 + (r() - 0.5) * 8, 2 + r() * 3, k.a(T.accent, 0.4 + r() * 0.5)); k.t("CATCH ME IF YOU CAN", W / 2, e1 - 8, 6, k.S, { a: "c", w: 200 }) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, cx = W / 2, by = small ? 112 : 118, R = small ? 66 : 140
    rbHaze(k, W, by, 6)
    const pts = []; for (let t = 0; t <= 1.0001; t += 0.02) { const a = Math.PI + t * Math.PI; pts.push([cx + R * Math.cos(a), by + R * 0.6 * Math.sin(a)]) }
    for (let i = 0; i < pts.length - 1; i += 2) k.ln([pts[i], pts[i + 1]], k.a(T.headBg, 1), 1.2)
    k.ln([[10, by], [W - 10, by]], k.I, 1)
    const f = d.up ? d.frac : 0, a2 = Math.PI + f * Math.PI, sx = cx + R * Math.cos(a2), sy = by + R * 0.6 * Math.sin(a2)
    for (let g = 3; g >= 1; g--) k.circ(sx, sy, 5 + g * 4, k.a(T.accent, 0.08)); rbSpark(k, sx, sy, 9, k.A)
    k.t(d.up ? C.solar.day : C.solar.night, 12, 6, 7, k.A, { w: 160 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, 16, small ? 22 : 30, k.I, { f: "disp", w: 120 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 7, k.A, { a: "r", w: 140 })
    k.t(`Up at ${shortT(d.rise)}`, 12, by + 6, 9, k.S, { f: "disp", w: 100 }); k.t(`Down at ${shortT(d.set)}`, W - 12, by + 6, 9, k.S, { f: "disp", a: "r", w: 100 })
    if (big && d.atm) {
      const A = d.atm, items = [["RAIN", A.pmax != null ? `${A.pmax}%` : "--"], ["DAMP", A.rh != null ? `${A.rh}%` : "--"], ["SUN", A.uv != null ? `${Math.round(A.uv)}` : "--"], ["SIGHT", A.vis || "--"], ["DEW", A.dew != null ? `${A.dew}°` : "--"], ["WIND", A.wind || "--"]]
      items.forEach(([l, v], i) => { const x = 14 + (i % 3) * 114, y = 150 + Math.floor(i / 3) * 80; k.rect(x, y, 104, 66, k.a(T.panel, 0.85), k.a(T.headBg, 1), 0.9); rbSpark(k, x + 96, y + 8, 3, k.A); k.t(l, x + 10, y + 8, 6.5, k.A, { w: 80 }); k.t(v, x + 10, y + 20, String(v).length > 4 ? 15 : 19, k.I, { f: "disp", w: 60 })
        const gx = x + 68, gy = y + 26
        if (i === 0) (A.probs || []).slice(0, 5).forEach((p, j) => rbHeart(k, gx + (j % 3) * 10, gy + Math.floor(j / 3) * 12, 8, (p || 0) > 30 ? k.A : null, k.A, 0.7))
        if (i === 1) { k.ell(gx + 14, gy + 14, 12, 12, null, k.a(T.headBg, 1), 1); k.ell(gx + 14, gy + 14 + 12 * (1 - (A.rh || 0) / 100) * 0.5, 10, 10 * ((A.rh || 0) / 100), k.a(T.headBg, 0.7)) }
        if (i === 2) for (let j = 0; j < 5; j++) rbSpark(k, gx + 4 + j * 6, gy + 14 - (j % 2) * 6, 3, j < Math.ceil((A.uv || 0) / 2) ? k.A : k.a(T.headBg, 1))
        if (i === 3) for (let j = 0; j < 3; j++) k.ell(gx + 14, gy + 14, 14 - j * 4, 6 - j * 1.5, null, j < Math.ceil((A.visMi || 0) / 3.4) ? k.ia(0.7) : k.ia(0.15), 0.8)
        if (i === 4) { k.poly([[gx + 14, gy], [gx + 22, gy + 14], [gx + 14, gy + 26], [gx + 6, gy + 14]], k.a(T.headBg, 0.5), k.I, 0.8); rbSpark(k, gx + 16, gy + 10, 2, k.PN) }
        if (i === 5) { const wd = ((A.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.circ(gx + 14, gy + 13, 12, null, k.a(T.headBg, 1), 0.8); k.ln([[gx + 14 - 9 * Math.cos(wd), gy + 13 - 9 * Math.sin(wd)], [gx + 14 + 10 * Math.cos(wd), gy + 13 + 10 * Math.sin(wd)]], k.A, 1.3); rbSpark(k, gx + 14 + 10 * Math.cos(wd), gy + 13 + 10 * Math.sin(wd), 3, k.A) }
      })
      k.t(`Best hour to move: ${shortT(new Date(d.set.valueOf() + 75 * 60000))}, under full dark.`, W / 2, H - 22, 10, k.S, { f: "disp", a: "c", w: W - 30 })
    }
  },
  feed(k, W, H, d) {
    const x0 = 10, y0 = 8, w = W - 20, h = H - 16, suit = d.side === "yt" ? "A" : "Q"
    k.rect(x0, y0, w, h, k.a(T.panel, 0.92), k.a(T.headBg, 1), 1)
    k.t(suit, x0 + 8, y0 + 4, 11, k.A, { f: "disp", w: 14 }); rbHeart(k, x0 + 13, y0 + 22, 8, k.A)
    k.t(d.code, x0 + w - 8, y0 + 6, 6.5, k.S, { a: "r", w: 60 })
    k.t(d.line, x0 + w / 2, y0 + 30, 13, k.I, { f: "disp", a: "c", w: w - 30 })
    d.meters.forEach(([n, v], i) => { const y = y0 + 52 + i * 14; k.t(n, x0 + 10, y, 7, k.S, { w: 70 }); for (let j = 0; j < 5; j++) rbHeart(k, x0 + 86 + j * 11, y + 5, 8, j / 5 < v ? k.A : null, k.A, 0.7) })
    k.t(d.tag, x0 + w / 2, y0 + h - 14, 6.5, k.A, { a: "c", w: w - 16 })
  },
  yt(k, W, H, d) {
    const r = sRng(d, 21), small = W < 200, tx = 14, ty = 22, tw = small ? W - 28 : 150, th2 = small ? 70 : 84
    k.ln([[tx + tw / 2, ty], [tx + tw / 2 - 18, ty - 16]], k.I, 1.2); k.ln([[tx + tw / 2, ty], [tx + tw / 2 + 16, ty - 14]], k.I, 1.2); k.ell(tx + tw / 2 - 18, ty - 16, 3, 5, k.PN, k.I, 0.8); k.ell(tx + tw / 2 + 16, ty - 14, 3, 5, k.PN, k.I, 0.8)
    k.rect(tx, ty, tw, th2, k.a(T.panel, 0.9), k.I, 1.4); k.rect(tx + 6, ty + 6, tw - 30, th2 - 12, k.a(T.headBg, 0.4), k.ia(0.4), 0.8)
    rbSpark(k, tx + (tw - 30) / 2 + 6, ty + th2 / 2, 9, k.A); k.circ(tx + tw - 12, ty + 18, 4, null, k.I, 0.9); k.circ(tx + tw - 12, ty + 34, 4, null, k.I, 0.9)
    if (small) { k.t(`${3 + Math.floor(r() * 9)} angles cased`, W / 2, H - 14, 8, k.S, { f: "disp", a: "c", w: W - 20 }); return }
    const rx = 182
    k.t("CASING FOOTAGE", rx, 8, 7, k.A, { w: 170 })
    k.para(pick2(r, ["Guard rotation, looped twice.", "The gala livestream, every angle.", "Vault blueprints, slowed down.", "A rival crew, sloppy as ever."]), rx, 22, W - rx - 14, 13, k.I, "disp", 2, 1.1)
    ;[["BLIND SPOTS", `${1 + Math.floor(r() * 5)} FOUND`], ["TIME CASED", mmss(300 + r() * 2400)], ["SEEN BY THEM", "NEVER"]].forEach(([l, v], i) => { k.t(l, rx, 60 + i * 18, 6.5, k.S, { w: 90 }); k.t(v, W - 14, 58 + i * 18, 10, k.I, { f: "disp", a: "r", w: 90 }) })
  },
  ig(k, W, H, d) {
    const r = sRng(d, 22), small = W < 200, n = small ? 3 : 5, cw = small ? 50 : 58, ch = small ? 66 : 78, cx0 = small ? W / 2 : 110
    for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2), x = cx0 + off * (cw * 0.62) - cw / 2, y = 14 + Math.abs(off) * 5; k.rect(x + 2, y + 2, cw, ch, k.ia(0.08)); k.rect(x, y, cw, ch, k.a(T.panel, 1), k.a(T.headBg, 1), 1); k.rect(x + 4, y + 4, cw - 8, ch - 20, k.a(i % 2 ? T.headBg : T.accent, 0.25)); { const gx2 = x + cw / 2, gy2 = y + (ch - 20) / 2 + 4; rbJewel(k, gShuf((d.seed || 7) * 23 + 5, 8)[i], gx2, gy2, k.a(T.accent, 0.75), k.a(T.headBg, 0.9)); rbSpark(k, gx2 + 9, gy2 - 10, 2.5, k.A) } rbHeart(k, x + cw - 10, y + ch - 9, 7, r() > 0.4 ? k.A : null, k.A, 0.7) }
    if (small) return
    const rx = 228
    k.t("THE MARKS", rx, 8, 7, k.A, { w: 130 })
    ;[["MARKS WATCHED", `${10 + Math.floor(r() * 90)}`], ["JEWELS SPOTTED", `${Math.floor(r() * 40)}`], ["TAKEN", `${Math.floor(r() * 7)} / 7`]].forEach(([l, v], i) => { k.t(l, rx, 24 + i * 22, 6.5, k.S, { w: 80 }); k.t(v, W - 14, 22 + i * 22, 13, k.I, { f: "disp", a: "r", w: 60 }) })
    k.t("All that glitters, cased.", rx, 100, 9, k.S, { f: "disp", w: W - rx - 10 })
  },
  dc(k, W, H, d) {
    const r = sRng(d, 23), small = W < 200, mw = small ? W - 24 : 160, mh = small ? 92 : 112
    const cells = [[0.5, 0.12, "CELL 07"], [0.15, 0.42, "CELL 02"], [0.85, 0.38, "CELL 11"], [0.3, 0.8, "CELL 04"], [0.72, 0.84, "CELL 09"], [0.52, 0.5, "SAFEHOUSE"]]
    const P2 = (c2) => [12 + c2[0] * mw, 8 + c2[1] * mh]
    cells.forEach((c2, i) => { if (i === 5) return; const [x1, y1] = P2(c2), [x2, y2] = P2(cells[5]); const mx = (x1 + x2) / 2 + (r() - 0.5) * 30, my = (y1 + y2) / 2 + (r() - 0.5) * 20; const pts = []; for (let t2 = 0; t2 <= 1.0001; t2 += 0.1) pts.push([(1 - t2) * (1 - t2) * x1 + 2 * (1 - t2) * t2 * mx + t2 * t2 * x2, (1 - t2) * (1 - t2) * y1 + 2 * (1 - t2) * t2 * my + t2 * t2 * y2]); k.ln(pts, k.a(T.headBg, 1), 3); k.ln(pts, k.a(T.panel, 1), 1.2) })
    const lit = cells.map((c2, i) => i === 5 || r() > 0.35)
    cells.forEach((c2, i) => { const [x, y] = P2(c2); k.ell(x, y, i === 5 ? 14 : 9, i === 5 ? 9 : 6, lit[i] ? k.a(T.accent, i === 5 ? 0.9 : 0.6) : k.PN, k.I, 0.9); if (i === 5) rbRabbit(k, x - 1, y + 1, 14, k.PN, k.I); else if (!small) k.t(c2[2], x, y + 8, 5.5, k.S, { a: "c", w: 40 }) })
    const on = lit.filter(Boolean).length - 1
    if (small) { k.t(`${on} cells awake`, W / 2, H - 16, 9, k.I, { f: "disp", a: "c", w: W - 20 }); return }
    const tx = 186
    k.t("THE WARREN", tx, 8, 7, k.A, { w: 170 }); k.t(`${on} cells awake`, tx, 20, 16, k.I, { f: "disp", w: 170 })
    ;["# next-job", "# fences-and-buyers", "# rival-crews", "🔈 the safehouse"].forEach((c2, i) => { const y = 46 + i * 15; k.t(c2, tx, y, 9, i === 3 ? k.A : k.I, { f: "disp", w: 160 }); if (r() > 0.5) rbSpark(k, W - 18, y + 5, 3, k.A) })
    k.t(`MENTIONS ${Math.floor(r() * 6)} · COPYCATS SPOTTED ${Math.floor(r() * 4)}`, tx, 112, 6.5, k.S, { w: 180 })
  },
  audio(k, W, H, d) {
    const cx = 46, cy = 44
    k.rect(cx - 30, cy - 18, 60, 36, k.a(T.panel, 0.95), k.I, 1.2); k.rect(cx - 26, cy - 10, 52, 20, k.a(T.headBg, 0.4), k.ia(0.4), 0.6)
    const r = k.rng(Math.floor(d.phase * 100)); for (let i = 0; i < 14; i++) k.circ(cx - 22 + i * 3.4, cy - 8 + r() * 16, 1, k.I)
    k.ln([[cx + 30, cy], [cx + 40, cy]], k.I, 1.2); k.circ(cx + 43, cy, 4, null, k.I, 1); rbSpark(k, cx - 34, cy - 22, 4, k.A); rbSpark(k, cx + 24, cy + 24, 3, k.a(T.headBg, 1))
    k.t(C.audio.src, 92, 12, 8, k.S, { w: 250 }); k.t(d.line, 92, 24, 19, k.I, { f: "disp", w: W - 106 })
    ;[["MIX", "GETAWAY 07"], ["VOLUME", d.lvl > 3 ? "TOO LOUD" : "WHISPER"], [C.audio.metric, "♥".repeat(d.lvl) + "♡".repeat(5 - d.lvl)]].forEach(([l, v], i) => { const x = 92 + i * 80; k.t(l, x, 52, 6.5, k.S, { w: 76 }); k.t(v, x, 61, 9, k.I, { w: 76 }) })
    const wy = 82, wh = 40, mix = (a, b, t) => { const p = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("") }
    for (let layer = 0; layer < 3; layer++) for (let x = 12; x < W - 12; x += 1.5) { const t = (x - 12) / (W - 24), env = Math.pow(Math.sin(t * Math.PI), 0.8), y = (0.62 + 0.38 * Math.sin(x * 0.03 + d.phase + layer)) * wh * (1 - layer * 0.2) * env + 1; k.rect(x, wy + wh / 2 - y / 2, 1.5, y, k.a(mix(T.headBg, T.accent, t), 0.22 + layer * 0.16)) }
    for (let i = 0; i < 6; i++) rbSpark(k, 30 + i * 60, wy + 6 + (i % 2) * 26, 2.5, k.a("#FFFFFF", 0.9))
    k.t("PLAYING", W - 70, 52, 6.5, k.S, { w: 60 })
  }
}
