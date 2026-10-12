const LR_MONTHS = ["Frostmoon", "Thawmoon", "Seedmoon", "Rainmoon", "Bloommoon", "Sunmoon", "Haymoon", "Harvestmoon", "Emberfall", "Mistmoon", "Deepfrost", "Yulemoon"]
const lrDate = (d) => `The ${d.getDate()}${[, "st", "nd", "rd"][(d.getDate() % 100 > 10 && d.getDate() % 100 < 14) ? 0 : d.getDate() % 10] || "th"} of ${LR_MONTHS[d.getMonth()]}`
const lrSky = (c) => ({ sun: "Fair skies", part: "Broken cloud", cloud: "Grey skies", rain: "Rain on the road", snow: "Snow on the hills", storm: "A storm brewing", fog: "Mist in the hollows" }[wxKind(c)])
function lrFlourish(k, x, y, w) { const pts = []; for (let i = 0; i <= w; i += 2) pts.push([x + i, y + Math.sin(i * 0.12) * 1.6]); k.ln(pts, k.ia(0.6), 0.8); k.circ(x + w / 2, y, 1.8, k.A); k.ln([[x, y], [x - 4, y - 3]], k.ia(0.6), 0.8); k.ln([[x + w, y], [x + w + 4, y + 3]], k.ia(0.6), 0.8) }
const LR = {
  status(k, W, H, d) {
    const wx = d.wx || {}
    k.ln([[30, 4], [30, H - 4]], k.a(T.accent, 0.6), 0.8)
    k.t(String(d.now.getDate()), 16, 8, 14, k.A, { f: "disp", a: "c", w: 24 })
    k.t(lrDate(d.now), 40, 6, 10, k.S, { f: "disp", w: 220 })
    wxIcon(k, wxKind(wx.cond), W - 34, 30, 34, k.I, 1.1)
    const entry = d.ev ? `${d.ev.active ? "On the road now" : "Next on the road"}: ${d.ev.title}, from ${shortT(d.ev.start)} till ${shortT(d.ev.end)}.` : "Nothing set for the road today. Rest your feet and mend your boots."
    const n = k.para(entry, 40, 24, W - 104, 13.5, k.I, "disp", 3, 1.18)
    lrFlourish(k, 44, 28 + n * 16 + 2, 120)
    const sky = wx.temp != null ? `${lrSky(wx.cond)}, ${wx.temp}°, feeling like ${wx.feels != null ? wx.feels : wx.temp}°. High ${wx.hi}, low ${wx.lo}.` : "The sky gives no word today."
    k.para(sky, 40, 36 + n * 16 + 4, W - 54, 11, k.ia(0.85), "disp", 2, 1.2)
    const ry = H - 30, rx0 = 44, rx1 = W - 24, hr = d.now.getHours() + d.now.getMinutes() / 60, prog = Math.max(0, Math.min(1, (hr - 7) / 12))
    for (let x = rx0; x < rx1; x += 6) k.circ(x, ry + Math.sin(x * 0.05) * 3, 0.9, k.a(T.accent, 0.8))
    k.rect(rx0 - 6, ry - 6, 8, 7, k.PN, k.I, 0.8); k.poly([[rx0 - 7, ry - 6], [rx0 - 2, ry - 10], [rx0 + 3, ry - 6]], k.A)
    k.ln([[rx1 - 3, ry - 4], [rx1 + 3, ry + 2]], k.A, 1.4); k.ln([[rx1 + 3, ry - 4], [rx1 - 3, ry + 2]], k.A, 1.4)
    const tx2 = rx0 + (rx1 - rx0) * prog, ty2 = ry + Math.sin(tx2 * 0.05) * 3; k.circ(tx2, ty2, 3, k.I); k.ln([[tx2, ty2 - 3], [tx2, ty2 - 9]], k.I, 1); k.poly([[tx2, ty2 - 9], [tx2 + 5, ty2 - 7], [tx2, ty2 - 5]], k.A)
    k.t(`${Math.round(prog * 20)} of 20 miles`, tx2 + (prog > 0.7 ? -8 : 8), ty2 - 14, 7.5, k.S, { f: "disp", a: prog > 0.7 ? "r" : "l", w: 90 })
    k.t(`LANTERN OIL ${pct(d.batt)}`, 40, H - 12, 7, k.S, { w: 140 }); k.t(`DAY ${dayOfYear(d.now)} OF THE YEAR`, W - 12, H - 12, 7, k.S, { a: "r", w: 160 })
  },
  shift(k, W, H, d) {
    k.para(d.ev ? d.ev.title : d.L.offTitle, 12, 6, W - 24, 12, k.I, "disp", 2, 1.1)
    const cx = 40, top = 40, bot = 122, w2 = 22, f = d.ev ? d.frac : 0
    k.rect(cx - w2 - 5, top - 4, (w2 + 5) * 2, 4, k.I); k.rect(cx - w2 - 5, bot, (w2 + 5) * 2, 4, k.I)
    k.ln([[cx - w2 - 3, top], [cx - w2 - 3, bot]], k.ia(0.7), 1.2); k.ln([[cx + w2 + 3, top], [cx + w2 + 3, bot]], k.ia(0.7), 1.2)
    const mid = (top + bot) / 2, glass = [[cx - w2, top], [cx + w2, top], [cx + 3, mid], [cx + w2, bot], [cx - w2, bot], [cx - 3, mid]]
    const ttop = mid - (mid - top) * (1 - f) * 0.9; k.poly([[cx - (w2 - 3) * (mid - ttop) / (mid - top), ttop], [cx + (w2 - 3) * (mid - ttop) / (mid - top), ttop], [cx + 2, mid - 2], [cx - 2, mid - 2]], k.a(T.accent, 0.7))
    const bh = (bot - mid) * f * 0.9; k.poly([[cx - w2 + 2, bot - 1], [cx + w2 - 2, bot - 1], [cx + (w2 - 2) * (1 - bh / (bot - mid)), bot - bh], [cx - (w2 - 2) * (1 - bh / (bot - mid)), bot - bh]], k.a(T.accent, 0.7))
    if (d.ev && d.ev.active) k.ln([[cx, mid], [cx, bot - bh]], k.a(T.accent, 0.8), 1)
    k.poly(glass, null, k.I, 1.3)
    k.t(d.ev ? (d.ev.active ? "SAND LEFT" : "UNTIL WE SET OUT") : "AT REST", 76, 42, 7, k.S, { w: 90 })
    k.t("by the glass", 76, 84, 9.5, k.ia(0.75), { f: "disp", w: 90 })
    if (d.ev) k.t(`${shortT(d.ev.start)} till ${shortT(d.ev.end)}`, 76, 112, 9, k.I, { f: "disp", w: 92 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200, x0 = 8, y0 = 6, w = W - 16, h = H - 12, fold = 16
    k.poly([[x0, y0], [x0 + w - fold, y0], [x0 + w, y0 + fold], [x0 + w, y0 + h], [x0, y0 + h]], k.a(T.panel, 0.65), k.ia(0.6), 0.8)
    k.poly([[x0 + w - fold, y0], [x0 + w - fold, y0 + fold], [x0 + w, y0 + fold]], k.ia(0.12), k.ia(0.6), 0.8)
    k.t(d.archival ? "Copied from an old book," : "To all who travel,", x0 + 10, y0 + 6, small ? 8.5 : 10, k.S, { f: "disp", w: w - 30 })
    const fs = fitFs(k, d.text, w - (small ? 20 : 70), small ? 4 : 3, small ? 13 : (big ? 20 : 17), "disp"), n = k.para(d.text, x0 + 10, y0 + 22, w - (small ? 20 : 70), fs, k.I, "disp", small ? 4 : 3, 1.15)
    k.t(`— ${d.by}`, x0 + w - (small ? 8 : 64), y0 + 26 + n * fs * 1.15, small ? 6.5 : 8, k.S, { a: "r", w: w - 20 })
    const endY = y0 + 30 + n * fs * 1.15 + 10
    if (!small) {
      for (let ly = endY + 6; ly < y0 + h - 8; ly += 9) k.ln([[x0 + 10, ly], [x0 + w - 70, ly]], k.ia(0.1), 0.6)
      const pmx = x0 + 44, pmy = y0 + h - 30
      if (pmy - 18 > endY) { k.circ(pmx, pmy, 18, null, k.a(T.accent, 0.6), 1); k.circ(pmx, pmy, 13, null, k.a(T.accent, 0.4), 0.6); k.t(`${LR_MONTHS[(d.mo || 0) % 12].slice(0, 5).toUpperCase()}`, pmx, pmy - 9, 6, k.A, { a: "c", w: 30 }); k.t(String(d.day || 10), pmx, pmy - 3, 9, k.A, { f: "disp", a: "c", w: 30 }); k.t("INN", pmx, pmy + 7, 5.5, k.A, { a: "c", w: 30 }); for (let i = 0; i < 4; i++) k.ln([[pmx + 22, pmy - 6 + i * 4], [pmx + 62, pmy - 6 + i * 4 + Math.sin(i) * 1.5]], k.a(T.accent, 0.5), 0.8) }
      if (!big && y0 + h - 14 > endY + 8) k.t("P.S. Bring a spare wick.", pmx + 70, y0 + h - 22, 9.5, k.S, { f: "disp", w: w - 170 })
    }
    const sx = x0 + w - (small ? 22 : 34), sy = y0 + h - (small ? 22 : 30), sr = small ? 13 : 19
    k.circ(sx, sy, sr, k.A); k.circ(sx, sy, sr * 0.72, null, k.a(T.panel, 0.55), 1)
    k.poly([[sx, sy - sr * 0.45], [sx + sr * 0.13, sy - sr * 0.12], [sx + sr * 0.45, sy], [sx + sr * 0.13, sy + sr * 0.12], [sx, sy + sr * 0.45], [sx - sr * 0.13, sy + sr * 0.12], [sx - sr * 0.45, sy], [sx - sr * 0.13, sy - sr * 0.12]], k.a(T.panel, 0.8))
    if (big) { k.t("P.S. Carried by the night coach and sealed at the inn.", x0 + 10, y0 + h - 40, 9.5, k.S, { f: "disp", w: w - 80 }); lrFlourish(k, x0 + 14, y0 + h - 52, 160) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, cx = small ? W / 2 : W * 0.58, cy = small ? 118 : 128, R = small ? 66 : 98
    k.arc(cx, cy, R, Math.PI, Math.PI * 2, k.I, 1.3); k.ln([[cx - R, cy], [cx + R, cy]], k.I, 1.3)
    const NUM = ["VI", "VII", "VIII", "IX", "X", "XI", "XII", "I", "II", "III", "IV", "V", "VI"]
    for (let h = 0; h <= 12; h++) { const a = Math.PI + h / 12 * Math.PI; k.ln([[cx + R * 0.86 * Math.cos(a), cy + R * 0.86 * Math.sin(a)], [cx + R * Math.cos(a), cy + R * Math.sin(a)]], k.ia(0.7), h % 3 ? 0.6 : 1); if (!small && h % 2 === 0) k.t(NUM[h], cx + R * 1.1 * Math.cos(a), cy + R * 1.1 * Math.sin(a) - 5, 7.5, k.S, { f: "disp", a: "c", w: 24 }) }
    const hr = d.now.getHours() + d.now.getMinutes() / 60, a = Math.PI + Math.max(0, Math.min(1, (hr - 6) / 12)) * Math.PI
    k.poly([[cx, cy], [cx + R * 0.82 * Math.cos(a - 0.03), cy + R * 0.82 * Math.sin(a - 0.03)], [cx + R * 0.82 * Math.cos(a + 0.03), cy + R * 0.82 * Math.sin(a + 0.03)]], k.ia(0.75))
    k.poly([[cx - 4, cy], [cx + 4, cy], [cx, cy - R * 0.36]], k.I)
    const hillY = cy + 2, hp = []; for (let x = cx - R - 30; x <= cx + R + 30; x += 3) hp.push([x, hillY + 8 - Math.abs(Math.sin((x - cx) * 0.04)) * 6 - Math.sin((x - cx) * 0.11) * 2])
    k.ln(hp, k.ia(0.5), 0.8); for (let i = 0; i < 7; i++) { const tx3 = cx - R - 20 + i * ((2 * R + 40) / 6), ty3 = hillY + 6; if (Math.abs(tx3 - cx) < 16) continue; k.poly([[tx3, ty3 - 9], [tx3 + 3, ty3 - 2], [tx3 - 3, ty3 - 2]], k.ia(0.55)) }
    const sx = cx + R * 0.95 * Math.cos(a), sy = cy + R * 0.95 * Math.sin(a); for (let i = 0; i < 8; i++) { const b = i / 8 * Math.PI * 2; k.ln([[sx + 6 * Math.cos(b), sy + 6 * Math.sin(b)], [sx + 9 * Math.cos(b), sy + 9 * Math.sin(b)]], k.A, 1) } k.circ(sx, sy, 4.5, k.A)
    k.t(d.up ? C.solar.day : C.solar.night, small ? 10 : 12, 6, 7.5, k.S, { w: 140 }); k.t(pct(d.up ? d.frac : 1 - d.frac), small ? 10 : 12, 16, small ? 20 : 26, k.I, { f: "disp", w: 110 })
    if (!small) { k.t(`Up at ${shortT(d.rise)}`, 12, 54, 10, k.S, { f: "disp", w: 110 }); k.t(`Down at ${shortT(d.set)}`, 12, 68, 10, k.S, { f: "disp", w: 110 }); k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 12, 6, 7.5, k.S, { a: "r", w: 120 }) }
    if (big && d.atm) {
      const items = [["rain", "Chance of rain", d.atm.pmax != null ? `${d.atm.pmax}%` : "--"], ["fog", "Air's dampness", d.atm.rh != null ? `${d.atm.rh}%` : "--"], ["sun", "Sun's sting", d.atm.uv != null ? `${Math.round(d.atm.uv)}` : "--"], ["part", "How far you see", d.atm.vis || "--"], ["cloud", "Dew comes at", d.atm.dew != null ? `${d.atm.dew}°` : "--"], ["fog", "The wind", d.atm.wind || "--"]]
      for (let c2 = 0; c2 < 5; c2++) { const pts = []; for (let x = 10; x <= W - 10; x += 4) pts.push([x, 152 + c2 * 34 + Math.sin(x * 0.03 + c2) * 6 + Math.sin(x * 0.011 + c2 * 2) * 5]); k.ln(pts, k.ia(0.07), 0.7) }
      { const rx = W - 36, ry = 154; for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2 - Math.PI / 2, l2 = j % 2 ? 6 : 12; k.ln([[rx, ry], [rx + l2 * Math.cos(a), ry + l2 * Math.sin(a)]], k.ia(0.25), j % 2 ? 0.5 : 0.9) } k.circ(rx, ry, 3, null, k.ia(0.3), 0.6); k.t("N", rx, ry - 20, 6.5, k.ia(0.35), { f: "disp", a: "c", w: 10 }) }
      k.t("Weather noted at the inn, by the barkeep's reckoning", 18, 148, 8.5, k.ia(0.45), { f: "disp", w: 260 })
      const A = d.atm
      items.forEach(([ic, l, v], i) => { const x = 18 + (i % 3) * 112, y = 162 + Math.floor(i / 3) * 70; wxIcon(k, ic, x + 16, y + 16, 26, k.I, 1); k.t(v, x + 36, y + 4, 15, k.I, { f: "disp", w: 70 }); k.t(l, x + 36, y + 24, 8.5, k.S, { f: "disp", w: 74 })
        const gx = x + 40, gy = y + 38, I2 = k.ia(0.8)
        if (i === 0) { k.ln([[gx, gy + 2], [gx + 2, gy + 22], [gx + 16, gy + 22], [gx + 18, gy + 2]], I2, 0.9); const f = Math.max(0, Math.min(1, (A.pmax || 0) / 100)); k.poly([[gx + 1.5, gy + 22 - 18 * f], [gx + 16.5, gy + 22 - 18 * f], [gx + 16, gy + 22], [gx + 2, gy + 22]], k.a(T.accent, 0.45)); for (let j = 1; j < 4; j++) k.ln([[gx + 15, gy + 2 + j * 5], [gx + 18, gy + 2 + j * 5]], k.ia(0.5), 0.6) }
        if (i === 1) { k.arc(gx + 10, gy + 18, 11, Math.PI, Math.PI * 2, I2, 0.9); const f = Math.max(0, Math.min(1, (A.rh || 0) / 100)), a = Math.PI + f * Math.PI; k.ln([[gx + 10, gy + 18], [gx + 10 + 9 * Math.cos(a), gy + 18 + 9 * Math.sin(a)]], k.A, 1.2); k.t("dry", gx - 4, gy + 20, 6, k.S, { f: "disp", w: 14 }); k.t("wet", gx + 24, gy + 20, 6, k.S, { f: "disp", a: "r", w: 14 }) }
        if (i === 2) { const u = Math.round(A.uv || 0); for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2, on = j < Math.min(8, u + 1); k.ln([[gx + 10 + 6 * Math.cos(a), gy + 12 + 6 * Math.sin(a)], [gx + 10 + 11 * Math.cos(a), gy + 12 + 11 * Math.sin(a)]], on ? k.A : k.ia(0.2), 1) } k.circ(gx + 10, gy + 12, 4, k.PN, I2, 0.9) }
        if (i === 3) { const vm = Math.max(0, Math.min(10, A.visMi || 0)); for (let j = 0; j < 3; j++) { const pts = []; for (let xx = 0; xx <= 22; xx += 2) pts.push([gx + xx, gy + 20 - j * 6 - Math.sin(xx * 0.3 + j) * 2.5]); k.ln(pts, j < Math.ceil(vm / 3.4) ? k.ia(0.85 - j * 0.25) : k.ia(0.12), 0.9) } }
        if (i === 4) { k.ln([[gx, gy + 22], [gx + 8, gy + 14], [gx + 20, gy + 12]], I2, 0.9); k.poly([[gx + 8, gy + 14], [gx + 16, gy + 6], [gx + 20, gy + 12]], k.a(T.ink, 0.15), I2, 0.8); k.circ(gx + 13, gy + 17, 2.4, k.a(T.accent, 0.5), I2, 0.7) }
        if (i === 5) { const cx2 = gx + 10, cy2 = gy + 12, wd = ((A.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.ln([[cx2, cy2 + 12], [cx2, cy2]], I2, 0.9); k.ln([[cx2 - 10 * Math.cos(wd), cy2 - 10 * Math.sin(wd)], [cx2 + 10 * Math.cos(wd), cy2 + 10 * Math.sin(wd)]], I2, 1); k.poly([[cx2 + 12 * Math.cos(wd), cy2 + 12 * Math.sin(wd)], [cx2 + 7 * Math.cos(wd + 0.45), cy2 + 7 * Math.sin(wd + 0.45)], [cx2 + 7 * Math.cos(wd - 0.45), cy2 + 7 * Math.sin(wd - 0.45)]], k.A); k.poly([[cx2 - 10 * Math.cos(wd), cy2 - 10 * Math.sin(wd)], [cx2 - 13 * Math.cos(wd + 0.4), cy2 - 13 * Math.sin(wd + 0.4)], [cx2 - 8 * Math.cos(wd), cy2 - 8 * Math.sin(wd)], [cx2 - 13 * Math.cos(wd - 0.4), cy2 - 13 * Math.sin(wd - 0.4)]], I2) }
      })
      k.circ(W - 70, 302, 7, k.a(T.ink, 0.06)); k.circ(W - 62, 306, 3, k.a(T.ink, 0.05))
      const mp = ((d.now.valueOf() / 86400000 - 10962.75) % 29.53 + 29.53) % 29.53 / 29.53, mn = mp < 0.03 || mp > 0.97 ? "a new moon" : mp < 0.47 ? "a waxing moon" : mp < 0.53 ? "a full moon" : "a waning moon"
      k.t(`Tonight brings ${mn}. Best hour to set out: ${shortT(new Date(d.rise.valueOf() + 45 * 60000))}.`, W / 2, H - 40, 10, k.S, { f: "disp", a: "c", w: W - 40 })
      lrFlourish(k, 24, H - 18, W - 48)
    }
  },
  feed(k, W, H, d) {
    const m = 10, nx = m, ny = 14, nw = W - m * 2, nh = H - 24, sk = d.side === "yt" ? -2 : 2
    k.poly([[nx + 3, ny + 3], [nx + nw + 3, ny + 3 + sk], [nx + nw + 3, ny + nh + 3 + sk], [nx + 3, ny + nh + 3]], k.ia(0.12))
    k.poly([[nx, ny], [nx + nw, ny + sk], [nx + nw, ny + nh + sk], [nx, ny + nh]], k.a(T.panel, 0.92), k.ia(0.6), 0.8)
    k.circ(nx + nw / 2, ny + 2, 4.5, k.A); k.circ(nx + nw / 2 - 1.2, ny + 0.8, 1.2, k.a(T.panel, 0.7))
    k.t(d.side === "yt" ? "NOTICE · TONIGHT" : "NOTICE · OVERHEARD", nx + 10, ny + 10, 7, k.S, { w: nw - 20 })
    k.t(d.line, nx + 10, ny + 22, 14, k.I, { f: "disp", w: nw - 20 })
    d.meters.forEach(([n, v], i) => { const y = ny + 46 + i * 15; k.t(n.charAt(0) + n.slice(1).toLowerCase(), nx + 10, y, 10, k.S, { f: "disp", w: 70 }); const marks = Math.round(v * 10); for (let j = 0; j < marks; j++) { const g = Math.floor(j / 5), p = j % 5, x = nx + 82 + g * 26 + p * 4; if (p === 4) k.ln([[x - 17, y + 9], [x + 1, y + 2]], k.A, 1); else k.ln([[x, y + 1], [x, y + 10]], k.I, 1) } })
    k.t(d.tag, nx + 10, ny + nh - 14, 8.5, k.ia(0.75), { f: "disp", w: nw - 20 })
  }
}
