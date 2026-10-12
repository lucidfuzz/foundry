const DIR = {
  status(k, W, H, d) {
    const cx = 66, cy = H / 2 + 2, R = 54, wx = d.wx || {}
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, l = i % 3 === 0 ? 7 : 3; k.ln([[cx + R * Math.cos(a), cy + R * Math.sin(a)], [cx + (R - l) * Math.cos(a), cy + (R - l) * Math.sin(a)]], k.ia(0.6), 1) }
    k.circ(cx, cy, R, null, k.I, 1.2); k.circ(cx, cy, R * 0.62, null, k.ia(0.35), 0.8)
    const fr = wx.feels != null && wx.hi != null && wx.lo != null && wx.hi !== wx.lo ? (wx.feels - wx.lo) / (wx.hi - wx.lo) : 0.5
    for (let i = 0; i < 18; i++) { const a0 = -Math.PI / 2 + i * Math.PI * 2 / 18, on = i / 18 < Math.max(0.05, Math.min(1, fr)); k.poly([[cx + R * 0.78 * Math.cos(a0), cy + R * 0.78 * Math.sin(a0)], [cx + R * 0.78 * Math.cos(a0 + 0.26), cy + R * 0.78 * Math.sin(a0 + 0.26)], [cx + R * 0.66 * Math.cos(a0 + 0.26), cy + R * 0.66 * Math.sin(a0 + 0.26)], [cx + R * 0.66 * Math.cos(a0), cy + R * 0.66 * Math.sin(a0)]], on ? k.H : k.ia(0.1)) }
    k.ln([[cx, cy], [cx + R * 0.95 * Math.cos(-0.7), cy + R * 0.95 * Math.sin(-0.7)]], k.A, 1.2)
    k.t(wx.temp != null ? `${wx.temp}°` : "--", cx, cy - 16, 26, k.I, { f: "disp", a: "c", w: 90 })
    k.t(wx.cond || "NO DATA", cx, cy + 14, 7, k.S, { a: "c", w: 80 })
    const x0 = 140, good = (wx.cond || "").includes("CLEAR")
    k.rect(W - 104, 6, 92, 14, null, good ? k.A : k.H, 1.2); k.t(good ? "CONDITION GREEN" : "CONDITION AMBER", W - 58, 9, 7, good ? k.A : k.H, { a: "c", w: 90, f: "bold" })
    k.t(d.ev ? (d.ev.active ? d.L.active : d.L.next) : d.L.none, x0, 8, 7.5, k.S, { w: 120 })
    k.para(d.ev ? d.ev.title : d.L.noneSub, x0, 22, W - x0 - 14, 17, k.I, "disp", 2, 1.1)
    k.t(d.ev ? `${shortT(d.ev.start)} — ${shortT(d.ev.end)}` : "STAND BY", x0, 62, 8.5, k.I, { w: 200 })
    const rows = [["FEELS", wx.feels != null ? `${wx.feels}°` : "--", fr], ["HI / LO", wx.hi != null ? `${wx.hi}° / ${wx.lo}°` : "--", 0.6], [d.L.cell, pct(d.batt), d.batt]]
    rows.forEach(([lab, v, f2], i) => { const y = 82 + i * 16; k.t(lab, x0, y, 7.5, k.S, { w: 74 }); k.segs(x0 + 76, y + 2, 98, 7, 12, f2, (j, n) => j >= n - 2 ? k.A : k.H, k.ia(0.1)); k.t(v, W - 14, y, 8.5, k.I, { a: "r", w: 60 }) })
    k.t(`DAY ${dayOfYear(d.now)} · ${d.unit}`, W - 14, H - 12, 7, k.S, { a: "r", w: 200 })
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "T-MINUS · LAUNCH WINDOW" : "T-MINUS · COUNTDOWN") : "NO LAUNCH SCHEDULED", 12, 8, 7, k.H, { w: W - 24, f: "bold" })
    k.para(d.ev ? d.ev.title : d.L.offTitle, 12, 20, W - 24, 12, k.I, "disp", 2, 1.1)
    k.poly([[14, 50], [W - 14, 50], [W - 6, 70], [W - 14, 90], [14, 90], [6, 70]], null, k.H, 1.4)
    const n = 9; for (let i = 0; i < n; i++) k.hex(16 + i * 17, 106, 7.5, i / n < d.frac ? k.H : k.ia(0.1), k.ia(0.4), 0.6)
    k.t(d.ev ? `WINDOW ${pct(d.frac)}` : "STAND BY", 12, 118, 7, k.S, { w: 80 })
    if (d.ev) k.t(`${shortT(d.ev.start)}→${shortT(d.ev.end)}`, W - 12, 118, 7, k.S, { a: "r", w: 90 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200
    k.rect(12, 8, 66, 15, k.H); k.t(d.archival ? "ARCHIVE" : "BULLETIN", 45, 10, 9, k.GR, { a: "c", w: 64, f: "heavy" })
    if (!small) k.t(`MSG 0x${d.hex} · CLASS: ${d.cls}`, 86, 11, 7.5, k.S, { w: W - 100 })
    const tfs = fitFs(k, d.text, W - 24, small ? 4 : 3, small ? 14 : (big ? 22 : 19), "disp"), n = k.para(d.text, 12, 30, W - 24, tfs, k.I, "disp", small ? 4 : 3, 1.12)
    const by = 30 + n * tfs * 1.12 + 4
    k.t(`— ${d.by}`, 12, by, small ? 6.5 : 7.5, k.S, { w: W - 24 })
    const ty = H - (small ? 22 : 30), th = small ? 14 : 20
    const free0 = by + 14, free1 = ty - 6
    if (!small && free1 - free0 >= 30) {
      const ry = free0 + (free1 - free0 - 28) / 2
      ;[["ROUTING", d.unit], ["CHECKSUM", `${d.hex}·${(parseInt(d.hex, 16) * 7 % 65535).toString(16).toUpperCase().padStart(4, "0")}`], ["DISTRIBUTION", "ALL SECTORS"]].forEach(([l, v], i) => { const x = 12 + i * 88; k.ln([[x, ry], [x, ry + 26]], k.H, 2); k.t(l, x + 7, ry + 1, 6.5, k.S, { w: 80 }); k.t(v, x + 7, ry + 11, 9, k.I, { w: 80 }) })
      const pr = 1 + parseInt(d.hex, 16) % 5, hx = W - 84
      k.t("PRIORITY", hx, ry + 1, 6.5, k.S, { w: 70 })
      for (let i = 0; i < 5; i++) k.hex(hx + 6 + i * 13, ry + 18, 6, i < pr ? (i >= 3 ? k.A : k.H) : k.ia(0.1), k.ia(0.4), 0.6)
    }
    k.rect(10, ty, W - 20, th, null, k.ia(0.5), 0.8)
    const r = k.rng(parseInt(d.hex, 16)), cols = Math.floor((W - 30) / 7)
    for (let i = 0; i < cols; i++) { const x = 16 + i * 7; k.circ(x, ty + th / 2, 1.1, k.ia(0.5)); if (r() > 0.45) k.circ(x, ty + th * 0.24, 2, k.H); if (r() > 0.5) k.circ(x, ty + th * 0.76, 2, k.H) }
    if (big) { k.rect(12, H - 92, W - 24, 30, null, k.H, 1); k.stripes(13, H - 91, 34, 28, k.a(T.headBg, 0.6), 8); k.t("ACKNOWLEDGE RECEIPT AT NEXT MUSTER", 54, H - 87, 8.5, k.I, { w: W - 80, f: "bold" }); k.t("FAILURE TO ACKNOWLEDGE WILL BE NOTED", 54, H - 75, 7, k.S, { w: W - 80 }) }
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, x0 = 12, x1 = W - 12, by = small ? 62 : 70, bh = small ? 14 : 16
    k.t(d.up ? C.solar.day : C.solar.night, x0, 6, 7.5, k.S, { w: 150 })
    k.t(pct(d.up ? d.frac : 1 - d.frac), x0, 17, small ? 24 : 30, k.I, { f: "disp", w: 120 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, x1, 6, 7.5, k.S, { a: "r", w: 150 })
    const toX = (dt) => x0 + (x1 - x0) * ((dt.getHours() + dt.getMinutes() / 60) / 24)
    k.rect(x0, by, x1 - x0, bh, k.ia(0.06), k.ia(0.4), 0.8)
    k.stripes(x0, by, toX(d.rise) - x0, bh, k.a(T.headBg, 0.45), 8); k.stripes(toX(d.set), by, x1 - toX(d.set), bh, k.a(T.headBg, 0.45), 8)
    for (let h = 0; h <= 24; h += 3) { const x = x0 + (x1 - x0) * h / 24; k.ln([[x, by + bh], [x, by + bh + (h % 6 ? 3 : 6)]], k.ia(0.6), 0.8); if (!small && h % 6 === 0) k.t(String(h).padStart(2, "0"), x, by + bh + 7, 6.5, k.S, { a: "c", w: 20 }) }
    const sx = toX(d.now); k.hex(sx, by + bh / 2, small ? 7 : 9, k.H, k.I, 1); k.ln([[sx, by - 8], [sx, by]], k.H, 1.2)
    k.t(`RISE ${shortT(d.rise)}`, x0, by + bh + (small ? 8 : 18), 7.5, k.I, { w: 100 }); k.t(`SET ${shortT(d.set)}`, x1, by + bh + (small ? 8 : 18), 7.5, k.I, { a: "r", w: 100 })
    if (!small) {
      const len = (d.set - d.rise) / 3600000, noon = new Date((d.rise.valueOf() + d.set.valueOf()) / 2), dusk = new Date(d.set.valueOf() + 28 * 60000)
      const ry = by + bh + 34
      ;[["DAY LENGTH", `${Math.floor(len)}H ${String(Math.round((len % 1) * 60)).padStart(2, "0")}M`], ["SOLAR NOON", shortT(noon)], ["CIVIL DUSK", shortT(dusk)], ["BLACKOUT AT", shortT(new Date(dusk.valueOf() + 30 * 60000))]].forEach(([l, v], i) => { const x = x0 + i * ((x1 - x0) / 4); k.ln([[x, ry], [x, ry + 22]], i === 3 ? k.A : k.H, 2); k.t(l, x + 6, ry, 6.5, k.S, { w: 80 }); k.t(v, x + 6, ry + 10, 9, k.I, { w: 80 }) })
    }
    if (big && d.atm) {
      const cells = [["PRECIP 12H", d.atm.pmax != null ? `${d.atm.pmax}%` : "--"], ["HUMIDITY", d.atm.rh != null ? `${d.atm.rh}%` : "--"], ["UV INDEX", d.atm.uv != null ? `${Math.round(d.atm.uv)}` : "--"], ["VISIBILITY", d.atm.vis || "--"], ["DEW POINT", d.atm.dew != null ? `${d.atm.dew}°` : "--"], ["WIND", d.atm.wind || "--"]]
      for (let row = 0; row < 9; row++) for (let col = 0; col < 26; col++) { const hx = 8 + col * 14 + (row % 2) * 7, hy = 150 + row * 12; if (hy > 266) continue; k.hex(hx, hy, 6.5, null, k.ia(0.05), 0.5) }
      k.t("SECTOR 07 // ATMOSPHERIC THREAT MATRIX", x0, 146, 6, k.ia(0.45), { w: 220 }); k.t(`GRID REF 40.8N/74.2W · DAY ${dayOfYear(d.now)}`, x1, 146, 6, k.ia(0.45), { a: "r", w: 200 })
      const A = d.atm
      cells.forEach(([l, v], i) => { const cx = 46 + (i % 3) * 110, cy = 182 + Math.floor(i / 3) * 58; k.hex(cx, cy, 26, k.ia(0.04), i === 0 ? k.H : k.ia(0.45), 1); k.t(v, cx, cy - 10, 15, k.I, { f: "disp", a: "c", w: 60 }); k.t(l, cx, cy + 9, 6.5, k.S, { a: "c", w: 60 })
        const gx = cx + 32, gy = cy - 20, gw = 42, gh = 40
        k.ln([[gx - 2, gy], [gx - 2, gy + gh]], k.ia(0.25), 0.6)
        if (i === 0) { (A.probs || []).slice(0, 6).forEach((p, j) => { const bh = Math.max(2, (gh - 8) * (p || 0) / 100); k.rect(gx + 2 + j * 6.5, gy + gh - 4 - bh, 4.5, bh, (p || 0) > 50 ? k.H : k.ia(0.6)) }); k.t("6H", gx + gw, gy + gh - 2, 5.5, k.S, { a: "r", w: 20 }) }
        if (i === 1) { const f = Math.max(0, Math.min(1, (A.rh || 0) / 100)); for (let j = 0; j < 8; j++) k.rect(gx + 6, gy + gh - 6 - (j + 1) * 4, 14, 3, j / 8 < f ? (j >= 6 ? k.A : k.H) : k.ia(0.1)); k.t("WET", gx + 24, gy + 2, 5.5, k.S, { w: 20 }); k.t("DRY", gx + 24, gy + gh - 12, 5.5, k.S, { w: 20 }) }
        if (i === 2) { const u = Math.round(A.uv || 0), tx = gx + 18, ty = gy + 6; k.poly([[tx, ty], [tx + 15, ty + 26], [tx - 15, ty + 26]], u > 5 ? k.a(T.headBg, 0.25) : null, u > 5 ? k.H : k.ia(0.6), 1.2); k.t("!", tx, ty + 10, 11, u > 5 ? k.H : k.I, { f: "heavy", a: "c", w: 14 }); k.t(u < 3 ? "LOW" : u < 6 ? "MOD" : "HIGH", tx, ty + 29, 5.5, k.S, { a: "c", w: 30 }) }
        if (i === 3) { const vm = Math.max(0, Math.min(10, A.visMi || 0)); for (let j = 0; j < 5; j++) { const yy = gy + 6 + j * 7, on = j < Math.ceil(vm / 2); k.ln([[gx + 4, yy], [gx + 36 - j * 5, yy]], on ? k.ia(0.85 - j * 0.12) : k.ia(0.1), 2) } k.t("KM", gx + gw, gy + gh - 2, 5.5, k.S, { a: "r", w: 20 }) }
        if (i === 4) { const tx = gx + 14; k.rect(tx - 3, gy + 4, 6, 26, null, k.I, 0.9); k.circ(tx, gy + 34, 5, k.H); const f3 = Math.max(0.1, Math.min(1, ((A.dew || 0) + 10) / 90)); k.rect(tx - 1.5, gy + 30 - 24 * f3, 3, 24 * f3 + 2, k.H); for (let j = 0; j < 5; j++) k.ln([[tx + 5, gy + 6 + j * 5], [tx + (j % 2 ? 8 : 11), gy + 6 + j * 5]], k.ia(0.5), 0.6) }
        if (i === 5) { const cx2 = gx + 19, cy2 = gy + 19, rr = 15; k.hex(cx2, cy2, rr, null, k.ia(0.55), 0.9); const wd = ((A.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.ln([[cx2 - rr * 0.6 * Math.cos(wd), cy2 - rr * 0.6 * Math.sin(wd)], [cx2 + rr * 0.75 * Math.cos(wd), cy2 + rr * 0.75 * Math.sin(wd)]], k.H, 1.6); k.poly([[cx2 + rr * 0.85 * Math.cos(wd), cy2 + rr * 0.85 * Math.sin(wd)], [cx2 + rr * 0.5 * Math.cos(wd + 0.5), cy2 + rr * 0.5 * Math.sin(wd + 0.5)], [cx2 + rr * 0.5 * Math.cos(wd - 0.5), cy2 + rr * 0.5 * Math.sin(wd - 0.5)]], k.H); k.t("N", cx2, cy2 - rr - 7, 5.5, k.S, { a: "c", w: 10 }) }
      })
      const ay = 272
      k.rect(x0, ay, x1 - x0, 22, null, k.H, 1); k.stripes(x0 + 1, ay + 1, 30, 20, k.a(T.headBg, 0.55), 8)
      const alert = (d.atm.pmax || 0) > 60 ? "SHELTER ADVISORY · CARRY RAIN GEAR" : (d.atm.uv || 0) > 6 ? "UV ADVISORY · LIMIT EXPOSURE" : "NO ADVISORIES · SIRENS ON STANDBY"
      k.t(alert, x0 + 38, ay + 6, 8.5, k.I, { w: x1 - x0 - 48, f: "bold" })
      const probs = d.atm.probs || []; probs.slice(0, 12).forEach((p, i) => { const bh2 = Math.max(2, 28 * (p || 0) / 100); k.rect(18 + i * 27, H - 22 - bh2, 20, bh2, (p || 0) > 50 ? k.H : k.ia(0.5)); if (i % 3 === 0) k.t(`+${i}H`, 28 + i * 27, H - 18, 6, k.S, { a: "c", w: 26 }) }); k.t("RAIN // NEXT 12H", x0, H - 60, 7, k.S, { w: 120 }); k.t(`PEAK ${d.atm.pmax != null ? d.atm.pmax : "--"}%`, x1, H - 60, 7, k.H, { a: "r", w: 80 })
    }
  },
  feed(k, W, H, d) {
    const m = 8, sx = m, sy = 8, sw = W - m * 2, sh = d.compact ? H * 0.46 : H * 0.42
    k.rect(sx, sy, sw, sh, k.ia(0.05), k.ia(0.5), 1)
    for (let y = sy + 2; y < sy + sh; y += 3) k.rect(sx, y, sw, 1, k.ia(0.05))
    k.ln([[sx + sw / 2, sy + 6], [sx + sw / 2, sy + sh - 6]], k.ia(0.35), 0.7); k.ln([[sx + 6, sy + sh / 2], [sx + sw - 6, sy + sh / 2]], k.ia(0.35), 0.7)
    k.circ(sx + sw / 2, sy + sh / 2, sh * 0.22, null, k.H, 1)
    k.circ(sx + 9, sy + 9, 3, k.a(T.headBg, 1)); k.t("REC", sx + 15, sy + 4, 7, k.H, { f: "bold", w: 30 })
    k.t(d.code, sx + sw - 6, sy + 4, 7, k.S, { a: "r", w: 60 })
    k.t(d.line, m, sy + sh + 5, 13, k.I, { f: "disp", w: W - m * 2 })
    d.meters.forEach(([n, v], i) => { const y = sy + sh + 22 + i * 12; k.t(n, m, y, 7, k.S, { w: 70 }); for (let j = 0; j < 8; j++) k.hex(m + 76 + j * 10, y + 4, 4.2, j / 8 < v ? (j > 5 ? k.A : k.H) : k.ia(0.1)); k.t(pct(v), W - m, y, 7.5, k.I, { a: "r", w: 34 }) })
    k.t(d.tag, m, H - 17, 6.5, k.S, { w: W - m * 2 })
  }
}
