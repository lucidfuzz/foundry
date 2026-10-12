function nfBrackets(k, x, y, w, h, l, c, lw) { [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([a, b, sx, sy]) => k.ln([[a + sx * l, b], [a, b], [a, b + sy * l]], c, lw || 1.2)) }
const NF = {
  status(k, W, H, d) {
    const wx = d.wx || {}
    k.t("MISSION BRIEF // OBJECTIVE", 12, 6, 7, k.S, { w: 200 })
    k.poly([[18, 30], [26, 22], [34, 30], [26, 38]], null, k.A, 1.4); k.circ(26, 30, 1.6, k.A)
    k.para(d.ev ? d.ev.title : d.L.noneSub, 42, 20, 180, 16, k.I, "disp", 2, 1.08)
    k.t(d.ev ? `${d.ev.active ? "IN PROGRESS" : "T-START"} ${shortT(d.ev.start)} → EXFIL ${shortT(d.ev.end)}` : "NO OBJECTIVE ASSIGNED", 42, 58, 7.5, k.A, { w: 190 })
    nfBrackets(k, 12, 76, 206, 40, 8, k.I, 1.2)
    wxIcon(k, wxKind(wx.cond), 36, 96, 26, k.I, 1)
    k.t("ATMOS", 58, 82, 7, k.S, { w: 60 }); k.t(wx.temp != null ? `${wx.temp}° ${wx.cond}` : "SENSORS OFFLINE", 58, 93, 11, k.I, { f: "bold", w: 156 })
    k.t(wx.feels != null ? `FEELS ${wx.feels}° · HI ${wx.hi}° · LO ${wx.lo}°` : "", 58, 106, 7, k.S, { w: 156 })
    const cx = W - 66, cy = 70, R = 50
    k.arc(cx, cy, R, Math.PI * 0.8, Math.PI * 2.2, k.ia(0.3), 1)
    const n = 14; for (let i = 0; i < n; i++) { const a0 = Math.PI * 0.8 + i * (Math.PI * 1.4 / n), a1 = a0 + Math.PI * 1.4 / n * 0.75; k.poly(k.arcPts(cx, cy, R - 4, a0, a1, 4).concat(k.arcPts(cx, cy, R - 12, a1, a0, 4)), i / n < d.batt ? (d.batt < 0.25 ? k.H : k.I) : k.ia(0.12)) }
    k.t(pct(d.batt), cx, cy - 12, 18, k.I, { f: "bold", a: "c", w: 70 }); k.t("SUIT POWER", cx, cy + 9, 7, k.S, { a: "c", w: 80 })
    k.t(`GRID 9-K · DAY ${dayOfYear(d.now)}`, cx, cy + 34, 7, k.A, { a: "c", w: 110 })
    k.t(`SQUAD LINK · ${d.unit}`, 12, H - 12, 7, k.S, { w: 200 })
  },
  shift(k, W, H, d) {
    k.t(d.ev ? (d.ev.active ? "MISSION CLOCK" : "TIME TO DROP") : "STANDING BY", W / 2, 6, 7, k.A, { a: "c", w: W - 20, f: "bold" })
    k.t(d.ev ? d.ev.title : d.L.offTitle, W / 2, 18, 11, k.I, { f: "disp", a: "c", w: W - 24 })
    const cx = W / 2, cy = 172, R = 126, n = 16
    for (let i = 0; i < n; i++) { const a0 = Math.PI * 1.3 + i * (Math.PI * 0.4 / n), a1 = a0 + Math.PI * 0.4 / n * 0.72; k.poly(k.arcPts(cx, cy, R, a0, a1, 3).concat(k.arcPts(cx, cy, R - 9, a1, a0, 3)), i / n < (d.ev ? d.frac : 0) ? k.I : k.ia(0.12)) }
    k.arc(cx, cy, R + 5, Math.PI * 1.28, Math.PI * 1.72, k.ia(0.35), 0.8)
    if (d.ev) { k.t(`${pct(d.frac)} · EXFIL ${shortT(d.ev.end)}`, cx, 104, 7, k.S, { a: "c", w: W - 20 }) }
    k.ln([[cx - 40, 116], [cx + 40, 116]], k.ia(0.35), 0.8); k.t(d.ev ? `IN ${shortT(d.ev.start)}` : '', cx, 121, 6.5, k.S, { a: "c", w: W - 20 })
  },
  tx(k, W, H, d) {
    const small = W < 200, big = H > 200
    nfBrackets(k, 8, 6, W - 16, H - 12, 10, k.I, 1.4)
    k.t(d.archival ? "ARCHIVE // DECLASSIFIED" : "INCOMING // DECRYPTED", 18, 12, 7.5, k.A, { w: W - 36, f: "bold" })
    const r = k.rng(parseInt(d.hex, 16)), glyphs = Math.floor((W - 36) / 7)
    for (let i = 0; i < glyphs; i++) { const solved = i / glyphs < 0.72; k.rect(18 + i * 7, 26, 5, 6, solved ? k.ia(0.75) : k.ia(0.12 + r() * 0.3)) }
    const fs = fitFs(k, d.text, W - 36, small ? 4 : 3, small ? 13 : (big ? 20 : 17), "disp"), n = k.para(d.text, 18, 40, W - 36, fs, k.I, "disp", small ? 4 : 3, 1.12)
    k.t(`— ${d.by}`, 18, 44 + n * fs * 1.12, small ? 6.5 : 7.5, k.S, { w: W - 36 })
    const f0 = 58 + n * fs * 1.12, f1 = H - 28
    if (!small && f1 - f0 >= 26) {
      const ry = f0 + (f1 - f0 - 24) / 2
      ;[["SENDER", "SQUAD 7 // ACTUAL"], ["PRIORITY", "FLASH"], ["ROUTE", "RELAY 04 → HUD"]].forEach(([l, v], i) => { const x = 18 + i * 92; nfBrackets(k, x, ry, 84, 24, 5, k.ia(0.7), 1); k.t(l, x + 6, ry + 3, 6, k.S, { w: 76 }); k.t(v, x + 6, ry + 12, 8, i === 1 ? k.A : k.I, { w: 76, f: "bold" }) })
      const vx = 296, vw = W - 18 - vx, r2 = k.rng(parseInt(d.hex, 16) + 3)
      k.t("VOICEPRINT", vx, ry + 2, 6, k.S, { w: vw }); for (let i = 0; i < Math.floor(vw / 3); i++) { const h2 = 2 + r2() * 12; k.rect(vx + i * 3, ry + 18 - h2 / 2, 2, h2, k.ia(0.75)) }
    }
    k.t(`DECRYPT 100% · KEY 0x${d.hex}`, 18, H - 22, 7, k.S, { w: W - 36 }); k.segs(18, H - 12, W - 36, 3, 24, 1, k.I, k.ia(0.12), 1)
  },
  solar(k, W, H, d) {
    const small = W < 200, big = H > 200, cx = W / 2, hy = small ? 92 : 96, scale = small ? 1.2 : 1.6
    for (let p = -10; p <= 30; p += 10) { const y = hy - p * scale; if (p === 0) continue; const w = p % 20 === 0 ? 70 : 44; k.ln([[cx - w, y], [cx - 12, y]], k.ia(0.45), 0.8); k.ln([[cx + 12, y], [cx + w, y]], k.ia(0.45), 0.8); if (!small) { k.t(String(p), cx - w - 4, y - 4, 6.5, k.S, { a: "r", w: 20 }); k.t(String(p), cx + w + 4, y - 4, 6.5, k.S, { w: 20 }) } }
    k.ln([[8, hy], [W - 8, hy]], k.I, 1.4)
    const elev = d.up ? Math.sin(Math.PI * d.frac) * 30 : -8, sx = 18 + (W - 36) * (d.up ? d.frac : 0.5), sy = hy - elev * scale
    k.circ(sx, sy, small ? 6 : 8, null, k.A, 1.6); k.circ(sx, sy, 2, k.A); k.ln([[sx, sy + 10], [sx, hy]], k.a(T.accent, 0.5), 0.8)
    const tapeY = 6; for (let a = 0; a <= 360; a += 15) { const x = cx + (a - 180) * (W / 260); if (x < 8 || x > W - 8) continue; k.ln([[x, tapeY + 10], [x, tapeY + (a % 45 ? 13 : 16)]], k.ia(0.6), 0.8); if (a % 90 === 0) k.t(["N", "E", "S", "W", "N"][a / 90], x, tapeY, 7, k.I, { a: "c", w: 12, f: "bold" }) }
    k.t(d.up ? C.solar.day : C.solar.night, 10, small ? 24 : 26, 7, k.S, { w: 120 }); k.t(pct(d.up ? d.frac : 1 - d.frac), 10, small ? 34 : 36, small ? 16 : 20, k.I, { f: "bold", w: 90 })
    if (!small) k.t(d.up ? C.solar.setIn : C.solar.riseIn, W - 10, 26, 7, k.S, { a: "r", w: 120 })
    k.t(`RISE ${shortT(d.rise)}`, 10, hy + 8, 7, k.S, { w: 90 }); k.t(`SET ${shortT(d.set)}`, W - 10, hy + 8, 7, k.S, { a: "r", w: 90 })
    if (!small) { const az = Math.round(90 + 180 * (d.up ? d.frac : 0.5)), el = Math.round(d.up ? Math.sin(Math.PI * d.frac) * 52 : -6), sh = el > 2 ? (1 / Math.tan(el * Math.PI / 180)).toFixed(1) : "--"; nfBrackets(k, W - 130, hy + 20, 120, 26, 5, k.ia(0.6), 1); k.t(`SUN AZ ${az}° · EL ${el}°`, W - 122, hy + 24, 7, k.I, { f: "bold", w: 110 }); k.t(`SHADOW ×${sh} · NVG AT DUSK`, W - 122, hy + 35, 6.5, k.A, { w: 110 }) }
    if (big && d.atm) { const cells = [["PRECIP", d.atm.pmax != null ? `${d.atm.pmax}%` : "--"], ["HUMIDITY", d.atm.rh != null ? `${d.atm.rh}%` : "--"], ["UV", d.atm.uv != null ? `${Math.round(d.atm.uv)}` : "--"], ["VISIBILITY", d.atm.vis || "--"], ["DEW", d.atm.dew != null ? `${d.atm.dew}°` : "--"], ["WIND", d.atm.wind || "--"]];       for (let gx = 10; gx < W - 10; gx += 19) k.ln([[gx, 152], [gx, H - 54]], k.ia(0.05), 0.5)
      for (let gy = 152; gy < H - 54; gy += 16) k.ln([[10, gy], [W - 10, gy]], k.ia(0.05), 0.5)
      ;[[60, 160], [180, 160], [300, 160], [120, 296], [240, 296]].forEach(([px, py]) => { k.ln([[px - 3, py], [px + 3, py]], k.ia(0.35), 0.6); k.ln([[px, py - 3], [px, py + 3]], k.ia(0.35), 0.6) })
      k.t("SECTOR 9-K // ATMOSPHERIC PICTURE", 14, 154, 6, k.ia(0.4), { w: 220 }); k.t("N40.82 W74.21 · ALT 97M", W - 14, 154, 6, k.ia(0.4), { a: "r", w: 160 })
      const A2 = d.atm
      cells.forEach(([l, v], i) => { const x = 14 + (i % 3) * 114, y = 170 + Math.floor(i / 3) * 64; nfBrackets(k, x, y, 104, 50, 7, k.I, 1); k.t(l, x + 10, y + 8, 7, k.S, { w: 56 }); k.t(v, x + 10, y + 21, 16, k.I, { f: "bold", w: 56 })
        const gx = x + 66, gy = y + 9, gw = 30, gh = 32
        if (i === 0) { (A2.probs || []).slice(0, 6).forEach((p, j) => { const bh = Math.max(1.5, gh * (p || 0) / 100); k.rect(gx + j * 5, gy + gh - bh, 3.5, bh, (p || 0) > 50 ? k.A : k.ia(0.75)) }); k.ln([[gx, gy + gh + 1], [gx + gw, gy + gh + 1]], k.ia(0.4), 0.6) }
        if (i === 1) { const cx2 = gx + 15, f2 = Math.max(0, Math.min(1, (A2.rh || 0) / 100)); k.poly([[cx2, gy], [cx2 + 11, gy + 18], [cx2 + 9, gy + 28], [cx2, gy + 32], [cx2 - 9, gy + 28], [cx2 - 11, gy + 18]], null, k.I, 1); k.rect(cx2 - 8, gy + 32 - 26 * f2, 16, 26 * f2 - 2, k.a(T.ink, 0.35)); k.t(`${Math.round(f2 * 100)}`, cx2, gy + 14, 6.5, k.I, { a: "c", w: 20 }) }
        if (i === 2) { const u = Math.round(A2.uv || 0); for (let j = 0; j < 6; j++) k.rect(gx + 6, gy + gh - (j + 1) * 5.4, 18, 4, j < Math.min(6, Math.ceil(u / 2)) ? (j >= 3 ? k.A : k.I) : k.ia(0.12)); k.t(u < 3 ? "LOW" : u < 6 ? "MOD" : "HIGH", gx + 15, gy + gh + 1, 5.5, k.S, { a: "c", w: 30 }) }
        if (i === 3) { const vm = Math.max(0, Math.min(10, A2.visMi || 0)); for (let j = 0; j < 4; j++) { const on = j < Math.ceil(vm / 2.5), yy = gy + 6 + j * 7; k.ln([[gx + 4 + j * 3, yy], [gx + 15, yy + 6], [gx + 26 - j * 3, yy]], on ? k.ia(0.85 - j * 0.15) : k.ia(0.12), 1) } }
        if (i === 4) { const tx = gx + 15; k.rect(tx - 3, gy, 6, 24, null, k.I, 0.9); k.circ(tx, gy + 28, 5, k.I); const f3 = Math.max(0.1, Math.min(1, ((A2.dew || 0) + 10) / 90)); k.rect(tx - 1.5, gy + 24 - 22 * f3, 3, 22 * f3 + 2, k.I); for (let j = 0; j < 4; j++) k.ln([[tx + 4, gy + 3 + j * 6], [tx + 7, gy + 3 + j * 6]], k.ia(0.5), 0.6) }
        if (i === 5) { const cx3 = gx + 15, cy3 = gy + 16, rr = 14; k.circ(cx3, cy3, rr, null, k.ia(0.6), 0.9); ["N", "E", "S", "W"].forEach((c2, j) => { const a3 = -Math.PI / 2 + j * Math.PI / 2; k.t(c2, cx3 + (rr - 5) * Math.cos(a3), cy3 + (rr - 5) * Math.sin(a3) - 3, 5, k.ia(0.5), { a: "c", w: 8 }) }); const wd = ((A2.wd || 0) + 180) * Math.PI / 180 - Math.PI / 2; k.ln([[cx3 - rr * 0.7 * Math.cos(wd), cy3 - rr * 0.7 * Math.sin(wd)], [cx3 + rr * 0.8 * Math.cos(wd), cy3 + rr * 0.8 * Math.sin(wd)]], k.A, 1.4); k.circ(cx3 + rr * 0.8 * Math.cos(wd), cy3 + rr * 0.8 * Math.sin(wd), 2, k.A) }
      })
      const probs = d.atm.probs || [], py = H - 30; k.t("PRECIP // NEXT 12H", 14, py - 22, 7, k.S, { w: 140 }); k.t(`THREAT WINDOW ${probs.findIndex(p => p > 50) >= 0 ? "+" + probs.findIndex(p => p > 50) + "H" : "NONE"}`, W - 14, py - 22, 7, k.A, { a: "r", w: 160 })
      probs.slice(0, 12).forEach((p, i) => { const x = 14 + i * 28, segsOn = Math.round((p || 0) / 100 * 6); for (let j = 0; j < 6; j++) k.rect(x, py + 8 - j * 4, 22, 3, j < segsOn ? ((p || 0) > 50 ? k.A : k.I) : k.ia(0.1)); if (i % 3 === 0) k.t(`+${i}`, x + 11, py + 12, 6, k.S, { a: "c", w: 22 }) }) }
  },
  feed(k, W, H, d) {
    const m = 8, fx = m, fy = 8, fw = W - m * 2, fh = d.compact ? H * 0.5 : H * 0.46, r = k.rng(d.side.length * 91 + 7)
    k.rect(fx, fy, fw, fh, k.ia(0.06))
    for (let i = 0; i < 160; i++) k.rect(fx + r() * fw, fy + r() * fh, 1 + r() * 2, 1, k.ia(r() * 0.25))
    for (let y = fy; y < fy + fh; y += 3) k.rect(fx, y, fw, 1, k.ia(0.05))
    nfBrackets(k, fx + 2, fy + 2, fw - 4, fh - 4, 8, k.I, 1.3)
    k.circ(fx + 12, fy + 11, 3, k.A); k.t(d.side === "yt" ? "CAM // ALPHA-2" : "NET // SQUAD 7", fx + 18, fy + 6, 7, k.I, { f: "bold", w: fw - 30 })
    k.t(d.code, fx + fw - 8, fy + fh - 14, 7, k.S, { a: "r", w: 60 })
    k.t(d.line, m, fy + fh + 5, 13, k.I, { f: "disp", w: W - m * 2 })
    d.meters.forEach(([n, v], i) => { const y = fy + fh + 22 + i * 11; k.t(n, m, y, 7, k.S, { w: 72 }); k.segs(m + 76, y + 2, W - m * 2 - 112, 5, 10, v, k.I, k.ia(0.12), 2); k.t(pct(v), W - m, y, 7, k.I, { a: "r", w: 32 }) })
    k.t(d.tag, m, H - 15, 6.5, k.A, { w: W - m * 2 })
  }
}
