function gmCard(k, x, y, w, h, numeral) { k.rect(x, y, w, h, k.ia(0.04), k.A, 1.1); k.rect(x + 3.5, y + 3.5, w - 7, h - 7, null, k.a(T.accent, 0.5), 0.6); [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([a, b]) => k.poly([[a, b - 3], [a + 3, b], [a, b + 3], [a - 3, b]], k.A)); if (numeral) k.t(numeral, x + w / 2, y + 7, 8, k.A, { f: "disp", a: "c", w: w - 10 }) }
function gmStar(k, cx, cy, r, c, lw) { const pts = []; for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + (i * 2 % 5) * Math.PI * 2 / 5; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } k.ln(pts.concat([pts[0]]), c, lw || 1) }
const GM = {
  status(k, W, H, d) {
    const wx = d.wx || {}, cw = (W - 40) / 3, ch = H - 14
    const cards = [["I", "THE HOUR", d.ev ? d.ev.title : "No Summons", d.ev ? `${shortT(d.ev.start)}–${shortT(d.ev.end)}` : "rest"], ["II", "THE SKY", wx.temp != null ? `${wx.temp}°` : "Veiled", wx.cond ? wx.cond.toLowerCase() : ""], ["III", "THE VESSEL", pct(d.batt), "essence held"]]
    cards.forEach(([num, name, big, small2], i) => {
      const x = 10 + i * (cw + 10), y = 6, mx = x + cw / 2
      gmCard(k, x, y, cw, ch, num)
      if (i === 0) { k.ln([[mx - 9, y + 26], [mx + 9, y + 26], [mx - 9, y + 50], [mx + 9, y + 50], [mx - 9, y + 26]], k.A, 1); k.poly([[mx - 5, y + 46], [mx + 5, y + 46], [mx, y + 40]], k.a(T.accent, 0.8)) }
      if (i === 1) { k.circ(mx, y + 38, 10, null, k.A, 1); for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2; k.ln([[mx + 13 * Math.cos(a), y + 38 + 13 * Math.sin(a)], [mx + 17 * Math.cos(a), y + 38 + 17 * Math.sin(a)]], k.A, 1) } }
      if (i === 2) { k.poly([[mx, y + 24], [mx + 11, y + 36], [mx, y + 54], [mx - 11, y + 36]], k.a(T.altBg, 0.9), k.A, 1); k.ln([[mx - 11, y + 36], [mx + 11, y + 36]], k.A, 0.8) }
      if (i === 0) { k.wrap(big, cw - 14, 10.5, "disp", 2).forEach((l, j) => k.t(l, mx, y + 60 + j * 12, 10.5, k.I, { f: "disp", a: "c", w: cw - 10, nofit: true })) } else k.t(big, mx, y + 62, 17, k.I, { f: "disp", a: "c", w: cw - 10 })
      k.t(small2, mx, y + (i === 0 ? 86 : 84), 7.5, k.S, { f: "disp", a: "c", w: cw - 10 })
      k.t(name, mx, y + ch - 18, 7, k.A, { a: "c", w: cw - 8 })
    })
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "THE CANDLE BURNS" : "UNTIL IT IS LIT") : "THE CANDLE RESTS", 12, 6, 7, k.A, { w: W - 24 })
    k.para(d.ev ? d.ev.title : d.L.offTitle, 12, 17, W - 24, 12, k.I, "disp", 2, 1.1)
    const cx = 38, base = 128, maxH = 70, h = d.ev ? Math.max(8, maxH * (1 - d.frac)) : maxH, top = base - h
    k.ell(cx, base + 2, 22, 5, k.a(T.accent, 0.6), k.A, 0.8)
    k.rect(cx - 10, top, 20, h, k.a(T.ink, 0.9)); k.ell(cx, top, 10, 3, k.ia(0.6))
    k.poly([[cx + 6, top], [cx + 9, top + 12], [cx + 6, top + 16], [cx + 4, top]], k.ia(0.7))
    k.ln([[cx, top - 2], [cx, top - 6]], k.ia(0.8), 1)
    if (!d.ev || d.ev.active) { for (let g = 3; g >= 1; g--) k.ell(cx, top - 14, 5 * g, 8 * g, k.a(T.accent, 0.06 * g)); k.poly([[cx, top - 26], [cx + 5, top - 14], [cx, top - 6], [cx - 5, top - 14]], k.A); k.poly([[cx, top - 19], [cx + 2.5, top - 13], [cx, top - 9], [cx - 2.5, top - 13]], k.a(T.panel, 0.9)) }
    k.t(d.ev ? (d.ev.active ? "WAX REMAINING" : "UNTIL KINDLED") : "", 70, 48, 7, k.S, { w: 92 })
    if (d.ev) k.t(`${shortT(d.ev.start)} — ${shortT(d.ev.end)}`, 70, 110, 9, k.S, { f: "disp", w: 92 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, x0 = 14, x1 = W - 14, y0 = 8, y1 = H - 8
    k.rect(x0, y0 + 4, x1 - x0, y1 - y0 - 8, k.ia(0.04), k.A, 1)
    ;[x0, x1].forEach((x) => { k.ell(x, (y0 + y1) / 2, 6, (y1 - y0) / 2, k.a(T.accent, 0.25), k.A, 1); k.ell(x, (y0 + y1) / 2, 2.5, (y1 - y0) / 2 - 3, null, k.a(T.accent, 0.6), 0.6) })
    k.t(d.archival ? "FROM THE OLD TOMES" : "BY DECREE OF THE CIRCLE", W / 2, y0 + 10, 7, k.A, { a: "c", w: W - 60 })
    const fs = fitFs(k, d.text, x1 - x0 - 32, small ? 4 : 3, small ? 13 : (big ? 20 : 17), "disp"), n = k.para(d.text, x0 + 16, y0 + 24, x1 - x0 - 32, fs, k.I, "disp", small ? 4 : 3, 1.14)
    k.t(`— ${d.by}`, W / 2, y0 + 28 + n * fs * 1.14, small ? 6.5 : 7.5, k.S, { a: "c", w: W - 50 })
    const gEnd = y0 + 40 + n * fs * 1.14, gFree = y1 - 26
    if (!small && gFree - gEnd >= 24) {
      const r3 = k.rng(parseInt(d.hex, 16) + 9), cy2 = gEnd + (gFree - gEnd) / 2, stars = []
      for (let i = 0; i < 7; i++) stars.push([x0 + 40 + i * ((x1 - x0 - 80) / 6), cy2 + (r3() - 0.5) * (gFree - gEnd - 10)])
      k.ln(stars, k.a(T.accent, 0.45), 0.7); stars.forEach(([sx2, sy2], i) => { k.poly([[sx2, sy2 - 3.5], [sx2 + 1, sy2 - 1], [sx2 + 3.5, sy2], [sx2 + 1, sy2 + 1], [sx2, sy2 + 3.5], [sx2 - 1, sy2 + 1], [sx2 - 3.5, sy2], [sx2 - 1, sy2 - 1]], i === 3 ? k.A : k.a(T.accent, 0.8)) })
      k.t(["THE LANTERN", "THE KEY", "THE SERPENT", "THE OWL"][parseInt(d.hex, 16) % 4], stars[3][0], stars[3][1] + 6, 6.5, k.A, { a: "c", w: 90 })
      k.t("THE SEAL IS UNBROKEN", x1 - 22, gFree - 2, 6, k.S, { a: "r", w: 140 })
    }
    const runes = Math.floor((x1 - x0 - 40) / 14); for (let i = 0; i < runes; i++) { const x = x0 + 22 + i * 14, y = y1 - 20, r = k.rng(parseInt(d.hex, 16) + i); k.ln([[x, y], [x, y + 8], [x + (r() > 0.5 ? 4 : -4), y + 3]], k.a(T.accent, 0.8), 0.8) }
    if (big) { gmStar(k, W / 2, y1 - 50, 14, k.A, 1); k.circ(W / 2, y1 - 50, 18, null, k.A, 0.8) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, cx = small ? W / 2 : W - 84, cy = small ? 86 : 74, R = small ? 50 : 62
    k.circ(cx, cy, R, null, k.A, 1.2); k.circ(cx, cy, R - 10, null, k.a(T.accent, 0.5), 0.7)
    const NUM = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]
    for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI * 2; k.ln([[cx + (R - 10) * Math.cos(a), cy + (R - 10) * Math.sin(a)], [cx + R * Math.cos(a), cy + R * Math.sin(a)]], k.a(T.accent, i % 2 ? 0.4 : 0.9), 0.8); if (!small && i % 2 === 0) k.t(NUM[i / 2], cx + (R + 9) * Math.cos(a), cy + (R + 9) * Math.sin(a) - 4, 6.5, k.S, { f: "disp", a: "c", w: 22 }) }
    k.circ(cx + R * 0.16, cy - R * 0.1, R * 0.5, null, k.a(T.accent, 0.7), 0.8)
    gmStar(k, cx, cy, R * 0.3, k.a(T.accent, 0.45), 0.7)
    const hr = d.now.getHours() + d.now.getMinutes() / 60, a = -Math.PI / 2 + hr / 24 * Math.PI * 2
    k.ln([[cx, cy], [cx + (R - 12) * Math.cos(a), cy + (R - 12) * Math.sin(a)]], k.I, 1.2)
    const sx = cx + (R - 4) * Math.cos(a), sy = cy + (R - 4) * Math.sin(a); k.circ(sx, sy, 5, d.up ? k.A : k.a(T.altBg, 1), k.I, 0.8)
    k.circ(cx, cy, 3, k.I)
    if (!small) { const r4 = k.rng(31); for (let i = 0; i < 14; i++) { const sx3 = 180 + r4() * 40, sy3 = 8 + r4() * 130; if (Math.hypot(sx3 - cx, sy3 - cy) < R + 14) continue; k.circ(sx3, sy3, 0.6 + r4(), k.a(T.accent, 0.4 + r4() * 0.5)) }
      const mp = ((d.now.valueOf() / 86400000 - 10962.75) % 29.53 + 29.53) % 29.53 / 29.53, mx2 = 12, my2 = 139; k.circ(mx2 + 6, my2, 6, k.a(T.ink, 0.9)); k.circ(mx2 + 6 + (mp < 0.5 ? -1 : 1) * 12 * Math.abs(0.5 - mp) * 2 - (mp < 0.5 ? 0 : 0), my2, 6, mp > 0.45 && mp < 0.55 ? null : k.GR)
      k.t(mp < 0.03 || mp > 0.97 ? "THE MOON SLEEPS" : mp < 0.5 ? "THE MOON GROWS" : mp < 0.53 ? "THE MOON IS FULL" : "THE MOON WANES", mx2 + 18, my2 - 4, 7, k.A, { w: 130 }) }
    k.t(d.up ? C.solar.day : C.solar.night, 12, small ? 6 : 10, 7, k.A, { w: 160 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 12, small ? 16 : 22, small ? 20 : 28, k.I, { f: "disp", w: 120 })
    if (!small) { k.t(`The sun rose at ${shortT(d.rise)}`, 12, 64, 9.5, k.S, { f: "disp", w: 170 }); k.t(`and shall set at ${shortT(d.set)}`, 12, 78, 9.5, k.S, { f: "disp", w: 170 }); k.t(d.up ? C.solar.setIn : C.solar.riseIn, 12, 98, 7, k.A, { w: 140 }) }
    if (big && d.atm) {
      const rs = k.rng(41); for (let i = 0; i < 70; i++) k.circ(10 + rs() * (W - 20), 160 + rs() * (H - 168), 0.4 + rs() * 0.9, k.a(T.accent, 0.15 + rs() * 0.4))
      ;[[[30, 168], [62, 174], [80, 166], [104, 178]], [[200, 330], [226, 322], [250, 334], [270, 326], [300, 338]]].forEach(cn => { k.ln(cn, k.a(T.accent, 0.18), 0.6); cn.forEach(([sx, sy]) => k.circ(sx, sy, 1.2, k.a(T.accent, 0.5))) })
      k.arc(W / 2, H + 120, 230, Math.PI * 1.25, Math.PI * 1.75, k.a(T.accent, 0.12), 0.8)
      const A = d.atm, items = [["RAIN", A.pmax != null ? `${A.pmax}%` : "--"], ["DAMP", A.rh != null ? `${A.rh}%` : "--"], ["SUNSTING", A.uv != null ? `${Math.round(A.uv)}` : "--"], ["SIGHT", A.vis || "--"], ["DEW", A.dew != null ? `${A.dew}°` : "--"], ["WIND", A.wind || "--"]]
      items.forEach(([l, v], i) => { const x = 14 + (i % 3) * 114, y = 176 + Math.floor(i / 3) * 84; gmCard(k, x, y, 104, 70, ["I", "II", "III", "IV", "V", "VI"][i]); k.t(v, x + 10, y + 22, String(v).length > 4 ? 13 : 16, k.I, { f: "disp", w: 52 }); k.t(l, x + 10, y + 48, 7, k.A, { w: 56 })
        const gx = x + 64, gy = y + 18, G = k.A, G2 = k.a(T.accent, 0.5)
        if (i === 0) { k.poly([[gx + 4, gy], [gx + 28, gy], [gx + 22, gy + 16], [gx + 10, gy + 16]], null, G, 1); const f = Math.max(0, Math.min(1, (A.pmax || 0) / 100)); k.poly([[gx + 4 + 3 * (1 - f), gy + 16 - 16 * f], [gx + 28 - 3 * (1 - f), gy + 16 - 16 * f], [gx + 22, gy + 16], [gx + 10, gy + 16]], k.a(T.altBg, 0.9)); k.ln([[gx + 16, gy + 16], [gx + 16, gy + 30]], G, 1); k.ln([[gx + 9, gy + 31], [gx + 23, gy + 31]], G, 1) }
        if (i === 1) { const f = Math.max(0, Math.min(1, (A.rh || 0) / 100)); for (let j = 0; j < 4; j++) { const pts = []; for (let xx = 0; xx <= 30; xx += 2) pts.push([gx + xx, gy + 6 + j * 7 + Math.sin(xx * 0.35 + j * 1.3) * 2]); k.ln(pts, j / 4 < f ? G : k.a(T.accent, 0.15), 0.9) } }
        if (i === 2) { const u = Math.round(A.uv || 0), cx2 = gx + 15, cy2 = gy + 14; for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2 - Math.PI / 2; k.ln([[cx2 + 8 * Math.cos(a), cy2 + 8 * Math.sin(a)], [cx2 + (j < u ? 14 : 11) * Math.cos(a), cy2 + (j < u ? 14 : 11) * Math.sin(a)]], j < u ? G : G2, j < u ? 1.2 : 0.6) } k.circ(cx2, cy2, 5, k.a(T.accent, 0.3), G, 1); gmStar(k, cx2, cy2, 3.5, G, 0.6) }
        if (i === 3) { const vm = Math.max(0, Math.min(10, A.visMi || 0)), cx2 = gx + 15, cy2 = gy + 14; k.poly([[cx2 - 14, cy2], [cx2 - 6, cy2 - 6], [cx2 + 6, cy2 - 6], [cx2 + 14, cy2], [cx2 + 6, cy2 + 6], [cx2 - 6, cy2 + 6]], null, G, 1); k.circ(cx2, cy2, 4, k.a(T.altBg, 1), G, 0.8); for (let j = 0; j < 5; j++) { const a = -Math.PI * 0.85 + j * Math.PI * 0.175; k.ln([[cx2 + 9 * Math.cos(a), cy2 - 2 + 9 * Math.sin(a)], [cx2 + 13 * Math.cos(a), cy2 - 2 + 13 * Math.sin(a)]], j < Math.ceil(vm / 2) ? G : G2, 0.8) } }
        if (i === 4) { const f = Math.max(0.1, Math.min(1, ((A.dew || 0) + 10) / 90)); k.poly([[gx + 12, gy], [gx + 20, gy], [gx + 20, gy + 6], [gx + 26, gy + 26], [gx + 6, gy + 26], [gx + 12, gy + 6]], null, G, 1); k.poly([[gx + 6 + 4 * (1 - f) * 0.5, gy + 26 - 20 * f], [gx + 26 - 4 * (1 - f) * 0.5, gy + 26 - 20 * f], [gx + 26, gy + 26], [gx + 6, gy + 26]], k.a(T.altBg, 0.9)); k.rect(gx + 11, gy - 3, 10, 3, G) }
        if (i === 5) { const cx2 = gx + 15, cy2 = gy + 14, wd = ((A.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.circ(cx2, cy2, 13, null, G2, 0.8); k.ln([[cx2 - 10 * Math.cos(wd), cy2 - 10 * Math.sin(wd)], [cx2 + 10 * Math.cos(wd), cy2 + 10 * Math.sin(wd)]], G, 1.2); k.poly([[cx2 + 13 * Math.cos(wd), cy2 + 13 * Math.sin(wd)], [cx2 + 8 * Math.cos(wd + 0.4), cy2 + 8 * Math.sin(wd + 0.4)], [cx2 + 8 * Math.cos(wd - 0.4), cy2 + 8 * Math.sin(wd - 0.4)]], G); for (let j = 0; j < 3; j++) { const pts = []; for (let xx = 0; xx <= 8; xx += 2) pts.push([cx2 - 14 + xx, cy2 + 16 + j * 3 + Math.sin(xx) * 1]); k.ln(pts, G2, 0.6) } }
      })
    }
  },
  feed(k, W, H, d) {
    const cx = W / 2, cy = 40, R = 29
    for (let g = 4; g >= 1; g--) k.circ(cx, cy, R + g * 3, k.a(T.altBg, 0.06))
    k.circ(cx, cy, R, k.a(T.altBg, 0.45), k.A, 1.2)
    for (let i = 1; i <= 4; i++) k.ell(cx, cy, R * i / 5, R * i / 5 * 0.62, null, k.a(T.accent, 0.15 + i * 0.12), 0.8)
    k.circ(cx, cy, 3, k.A)
    k.t(d.line, cx, cy + R + 6, 13, k.I, { f: "disp", a: "c", w: W - 16 })
    d.meters.forEach(([n, v], i) => { const y = cy + R + 24 + i * 11; k.t(n, 10, y, 7, k.S, { w: 72 }); for (let j = 0; j < 5; j++) k.poly([[84 + j * 12, y + 1], [88 + j * 12, y + 5], [84 + j * 12, y + 9], [80 + j * 12, y + 5]], j / 5 < v ? k.A : k.ia(0.12)) ; k.t(pct(v), W - 10, y, 7, k.I, { a: "r", w: 30 }) })
    k.t(d.tag, cx, H - 14, 6.5, k.A, { a: "c", w: W - 16 })
  }
}
