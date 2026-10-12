function drBlocks(k, x, y, s) { k.rect(x, y, s * 2, s * 5, k.H); k.rect(x + s * 2.6, y, s, s * 2, k.H); k.rect(x + s * 2.6, y + s * 3, s, s * 2, k.H) }
const DRG = {
  status(k, W, H, d) {
    const wx = d.wx || {}
    k.t("CONTACT LOG // RELAY 07", 12, 6, 7, k.S, { w: 200 })
    for (let i = 0; i < 5; i++) { const on = i < Math.max(1, Math.round(d.batt * 5)); k.rect(W - 60 + i * 9, 18 - i * 3, 6, 6 + i * 3, on ? (d.batt < 0.25 ? k.H : k.I) : k.ia(0.15)) }
    k.t("T+00:00", 12, 20, 7.5, k.H, { w: 56, f: "bold" }); k.t(d.ev ? (d.ev.active ? "CONTACT HELD" : "NEXT CONTACT") : "NO CONTACT", 70, 20, 7.5, k.I, { w: 130 })
    k.para(d.ev ? d.ev.title.toUpperCase() : d.L.noneSub, 12, 32, W - 150, 15, k.I, "heavy", 2, 1.05)
    ;[["WINDOW", d.ev ? `${shortT(d.ev.start)} → ${shortT(d.ev.end)}` : "--"], ["STATUS", d.ev ? (d.ev.active ? d.L.active : d.L.queued) : d.L.standby]].forEach(([a2, b2], i) => { const y = 72 + i * 13; k.t(a2, 12, y, 7.5, k.H, { w: 56, f: "bold" }); k.t(b2, 70, y, 7.5, k.I, { w: 140 }) })
    k.t(wx.temp != null ? `${wx.temp}°` : "--", W - 14, 34, 34, k.I, { f: "heavy", a: "r", w: 110 })
    k.t(wx.cond ? `SURFACE // ${wx.cond}` : "SURFACE // NO DATA", W - 14, 74, 7, k.S, { a: "r", w: 140 })
    k.t(wx.feels != null ? `FEELS ${wx.feels}° · ${wx.hi}°/${wx.lo}°` : "", W - 14, 86, 7, k.S, { a: "r", w: 140 })
    k.ln([[12, H - 26], [W - 12, H - 26]], k.ia(0.3), 0.8)
    k.t(`RESERVE ${pct(d.batt)}`, 12, H - 18, 7.5, k.I, { w: 120 }); k.t(`DAY ${dayOfYear(d.now)} · ${d.unit}`, W - 12, H - 18, 7.5, k.S, { a: "r", w: 160 })
    drBlocks(k, W - 30, H - 50, 3)
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "PASS IN PROGRESS" : "NEXT PASS") : "NO PASS SCHEDULED", 10, 6, 7, k.H, { f: "bold", w: W - 20 })
    k.t(d.ev ? d.ev.title : d.L.offTitle, 10, 17, 11, k.I, { f: "heavy", w: W - 20 })
    const cx = W / 2, cy = 86, rx = 66, ry = 26
    k.circ(cx, cy, 12, k.a(T.altBg, 0.9))
    k.ell(cx, cy, rx, ry, null, k.ia(0.35), 0.8)
    const f = d.ev ? d.frac : 0, a0 = Math.PI * 0.9, a1 = Math.PI * 2.1, pts = []; for (let i = 0; i <= 40; i++) { const a = a0 + (a1 - a0) * i / 40; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]) }
    k.ln(pts, k.I, 1.4)
    const as = a0 + (a1 - a0) * f, sx = cx + rx * Math.cos(as), sy = cy + ry * Math.sin(as); k.rect(sx - 4, sy - 4, 8, 8, k.H)
    k.t("AOS", cx + rx * Math.cos(a0) - 6, cy + ry * Math.sin(a0) + 4, 6.5, k.S, { w: 30 }); k.t("LOS", cx + rx * Math.cos(a1) - 12, cy + ry * Math.sin(a1) + 4, 6.5, k.S, { w: 30 })
    if (d.ev) k.t(`PASS ${pct(f)} · LOS ${shortT(d.ev.end)}`, 10, 118, 7, k.S, { w: W - 20 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200
    k.t(`INTERCEPT 0x${d.hex}`, 12, 6, 7.5, k.H, { f: "bold", w: 150 }); if (!small) k.t(`BRG ${parseInt(d.hex, 16) % 360} · RNG ${(parseInt(d.hex, 16) % 90 / 10).toFixed(1)} AU`, W - 12, 6, 7.5, k.S, { a: "r", w: 160 })
    const fs = fitFs(k, d.text.toUpperCase(), W - 24, small ? 4 : 3, small ? 13 : (big ? 21 : 17), "heavy"), n = k.para(d.text.toUpperCase(), 12, 22, W - 24, fs, k.I, "heavy", small ? 4 : 3, 1.08)
    k.t(`— ${d.by}`, 12, 26 + n * fs * 1.08, small ? 6.5 : 7.5, k.S, { w: W - 24 })
    const e0 = 40 + n * fs * 1.08, e1 = H - (small ? 34 : 44)
    if (!small && e1 - e0 >= 28) {
      const cy3 = e0 + (e1 - e0) / 2, rr = Math.min(16, (e1 - e0) / 2 - 1), cx3 = 12 + rr
      k.circ(cx3, cy3, rr, null, k.ia(0.6), 0.8); k.circ(cx3, cy3, rr * 0.5, null, k.ia(0.3), 0.6); k.ln([[cx3 - rr, cy3], [cx3 + rr, cy3]], k.ia(0.3), 0.6); k.ln([[cx3, cy3 - rr], [cx3, cy3 + rr]], k.ia(0.3), 0.6)
      const ang = (parseInt(d.hex, 16) % 360) * Math.PI / 180; k.ln([[cx3, cy3], [cx3 + rr * Math.cos(ang), cy3 + rr * Math.sin(ang)]], k.H, 1.2); k.rect(cx3 + rr * 0.7 * Math.cos(ang) - 2, cy3 + rr * 0.7 * Math.sin(ang) - 2, 4, 4, k.H)
      ;[["SOURCE", "RELAY 07"], ["HOPS", String(2 + parseInt(d.hex, 16) % 4)], ["DELAY", `${(parseInt(d.hex, 16) % 90 / 10 + 0.4).toFixed(1)} S`], ["BAND", "X-BAND"]].forEach(([l, v], i) => { const x = cx3 + rr + 16 + i * 74; k.rect(x, cy3 - 12, 3, 24, k.H); k.t(l, x + 8, cy3 - 12, 6.5, k.S, { w: 64 }); k.t(v, x + 8, cy3 - 1, 10, k.I, { f: "heavy", w: 64 }) })
    }
    const r = k.rng(parseInt(d.hex, 16)), y = H - (small ? 28 : 34), pts = []
    for (let x = 12; x <= W - 12; x += 2) pts.push([x, y + Math.sin(x * 0.2) * 6 * (0.4 + r() * 0.6)])
    k.ln(pts, k.I, 1.1)
    for (let x = 18; x < W - 12; x += 30) k.rect(x, y + 10, 10, 3, k.H)
    k.t(`DECODE ${70 + parseInt(d.hex, 16) % 30}%`, 12, H - 12, 7, k.S, { w: 100 })
    drBlocks(k, W - 26, H - 22, 2.5)
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, mx = 10, my = small ? 46 : 40, mw = W - 20, mh = small ? 64 : 76
    k.rect(mx, my, mw, mh, k.a(T.altBg, 0.25), k.ia(0.4), 0.8)
    for (let i = 1; i < 8; i++) k.ln([[mx + mw * i / 8, my], [mx + mw * i / 8, my + mh]], k.a(T.altBg, 0.6), 0.6)
    for (let i = 1; i < 4; i++) k.ln([[mx, my + mh * i / 4], [mx + mw, my + mh * i / 4]], k.a(T.altBg, 0.6), 0.6)
    const tx = mx + mw * (d.up ? d.frac : 0.5), nightW = mw * 0.42; k.rect(Math.max(mx, tx + mw * 0.08), my, Math.min(nightW, mx + mw - (tx + mw * 0.08)), mh, k.ia(0.12))
    const pts = []; for (let x = 0; x <= mw; x += 3) pts.push([mx + x, my + mh / 2 - Math.sin(x / mw * Math.PI * 2 + 0.6) * mh * 0.32]); k.ln(pts, k.I, 1.2)
    const sy = my + mh / 2 - Math.sin((tx - mx) / mw * Math.PI * 2 + 0.6) * mh * 0.32; k.circ(tx, sy, 5, k.H); k.circ(tx, sy, 9, null, k.H, 0.8)
    k.t(d.up ? C.solar.day : C.solar.night, mx, 6, 7, k.S, { w: 150 }); k.t(pct(d.up ? d.frac : 1 - d.frac), mx, 15, small ? 18 : 22, k.I, { f: "heavy", w: 100 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 10, 6, 7, k.S, { a: "r", w: 150 })
    k.t(`AOS ${shortT(d.rise)}`, mx, my + mh + 5, 7, k.I, { w: 90 }); k.t(`LOS ${shortT(d.set)}`, W - 10, my + mh + 5, 7, k.I, { a: "r", w: 90 })
    if (big && d.atm) { const cells = [["PRECIP", d.atm.pmax != null ? `${d.atm.pmax}%` : "--"], ["HUMIDITY", d.atm.rh != null ? `${d.atm.rh}%` : "--"], ["UV", d.atm.uv != null ? `${Math.round(d.atm.uv)}` : "--"], ["VISIBILITY", d.atm.vis || "--"], ["DEW", d.atm.dew != null ? `${d.atm.dew}°` : "--"], ["WIND", d.atm.wind || "--"]]; const rs = k.rng(77); for (let i = 0; i < 60; i++) k.circ(12 + rs() * (W - 24), 146 + rs() * 140, 0.5 + rs() * 0.8, k.ia(0.12 + rs() * 0.3))
      ;[60, 95, 130].forEach((rr, j) => k.arc(W - 20, 286, rr, Math.PI, Math.PI * 1.5, k.a(T.altBg, 0.5 - j * 0.12), 0.8)); k.ln([[W - 20, 286], [W - 20 - 130 * Math.cos(0.7), 286 - 130 * Math.sin(0.7)]], k.a(T.headBg, 0.5), 0.8)
      for (let gy = 150; gy < 286; gy += 34) k.t(`${(40.8 + (gy - 150) / 600).toFixed(2)}N`, W - 12, gy, 5.5, k.ia(0.3), { a: "r", w: 50 })
      ;[[110, 148], [224, 148], [110, 218], [224, 218]].forEach(([bx, by]) => { k.rect(bx - 1, by - 1, 2, 2, k.H) })
      const A3 = d.atm, rt = k.rng(dayOfYear(d.now))
      cells.forEach(([l, v], i) => { const x = 12 + (i % 3) * 114, y = 150 + Math.floor(i / 3) * 70; k.rect(x, y, 4, 50, k.H); k.t(l, x + 10, y + 4, 7, k.S, { w: 60 }); k.t(v, x + 10, y + 18, String(v).length > 4 ? 16 : 20, k.I, { f: "heavy", w: 62 })
        const gx = x + 70, gy = y + 8, gw = 32, gh = 26
        k.rect(gx, gy, gw, gh, k.ia(0.04), k.ia(0.25), 0.6)
        if (i === 0) (A3.probs || []).slice(0, 8).forEach((p, j) => { const bh = Math.max(1, (gh - 2) * (p || 0) / 100); k.rect(gx + 1 + j * 4, gy + gh - 1 - bh, 3, bh, (p || 0) > 50 ? k.H : k.a(T.altBg, 1)) })
        else { const pts = []; let val = 0.5; for (let j = 0; j <= 16; j++) { val = Math.max(0.1, Math.min(0.9, val + (rt() - 0.5) * 0.25)); pts.push([gx + j * gw / 16, gy + gh - val * gh]) } k.ln(pts, i === 5 ? k.H : k.I, 1); k.circ(pts[16][0], pts[16][1], 1.6, k.H) }
        k.t(["12H", "RH", "IDX", "RNG", "DEW", "KT"][i], gx + gw, gy + gh + 2, 5.5, k.ia(0.45), { a: "r", w: 30 })
      }); const probs = d.atm.probs || []; probs.slice(0, 12).forEach((p, i) => { const bh = Math.max(2, 30 * (p || 0) / 100); k.rect(14 + i * 28, H - 20 - bh, 18, bh, (p || 0) > 50 ? k.H : k.a(T.altBg, 1)); if (i % 3 === 0) k.t(`T+${i}`, 23 + i * 28, H - 16, 6, k.S, { a: "c", w: 28 }) })
      const ty4 = 290; k.ln([[12, ty4], [W - 12, ty4]], k.ia(0.3), 0.8); k.t("PRECIP // DOWNLINK FORECAST", 12, ty4 + 5, 7, k.S, { w: 180 }); k.t(`TELEMETRY NOMINAL · ORBIT ${4000 + dayOfYear(d.now) * 3}`, W - 12, ty4 + 5, 7, k.H, { a: "r", w: 200 }) }
  },
  feed(k, W, H, d) {
    const m = 8, sx = m, sy = 8, sw = W - m * 2, sh = d.compact ? H * 0.48 : H * 0.44
    k.rect(sx, sy, sw, sh, k.ia(0.04), k.ia(0.5), 0.8)
    for (let i = 1; i < 6; i++) k.ln([[sx + sw * i / 6, sy], [sx + sw * i / 6, sy + sh]], k.a(T.altBg, 0.5), 0.5)
    for (let i = 1; i < 4; i++) k.ln([[sx, sy + sh * i / 4], [sx + sw, sy + sh * i / 4]], k.a(T.altBg, 0.5), 0.5)
    const ph = d.side === "yt" ? 0 : 1.7, pts = []; for (let x = 0; x <= sw; x += 2) pts.push([sx + x, sy + sh / 2 + Math.sin(x * (d.side === "yt" ? 0.09 : 0.15) + ph) * sh * 0.3 * Math.sin(x / sw * Math.PI)]); k.ln(pts, k.I, 1.3)
    k.rect(sx + sw * 0.62, sy, 2, sh, k.H)
    k.t(d.code, sx + 6, sy + 4, 7, k.H, { f: "bold", w: 60 })
    k.t(d.line.toUpperCase(), m, sy + sh + 5, 11, k.I, { f: "heavy", w: W - m * 2 })
    d.meters.forEach(([n, v], i) => { const y = sy + sh + 22 + i * 12; k.t(n, m, y, 7, k.S, { w: 72 }); k.rect(m + 76, y + 2, (W - m * 2 - 112), 5, k.ia(0.12)); k.rect(m + 76, y + 2, (W - m * 2 - 112) * v, 5, i === 2 ? k.H : k.I); k.t(pct(v), W - m, y, 7, k.I, { a: "r", w: 32 }) })
    k.t(d.tag, m, H - 12, 6.5, k.H, { w: W - m * 2 })
  }
}
