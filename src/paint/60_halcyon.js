const HAL = {
  audio(k, W, H, d) {
    const cx = 46, cy = 44
    for (let g = 5; g >= 1; g--) k.circ(cx, cy, 20 + g * 5, k.a(T.altBg, 0.05))
    k.circ(cx, cy, 30, null, k.ia(0.25), 0.8); k.circ(cx, cy, 24, null, k.ia(0.45), 0.8)
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, l = i % 9 === 0 ? 5 : 2; k.ln([[cx + 33 * Math.cos(a), cy + 33 * Math.sin(a)], [cx + (33 + l) * Math.cos(a), cy + (33 + l) * Math.sin(a)]], k.ia(0.5), 0.7) }
    k.rect(cx - 14, cy - 14, 28, 28, k.a(T.panel, 0.9), k.I, 1.4); k.poly([[cx - 4, cy - 8], [cx + 8, cy], [cx - 4, cy + 8]], k.I)
    k.t(C.audio.src, 92, 12, 8, k.S, { w: 250 })
    k.t(d.line, 92, 24, 19, k.I, { f: "disp", w: W - 106 })
    const lvl = d.lvl, wy = 82, wh = 42
    const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("") }
    const ICE = "#7FE3F0", MINT = "#3FCF9A"
    const grad = (t) => t < 0.5 ? mix(T.altBg, ICE, t * 2) : mix(ICE, MINT, (t - 0.5) * 2)
    for (let g = 0; g < 4; g++) k.rect(12, wy + wh / 2 - 2 - g * 2, W - 24, 4 + g * 4, k.a(ICE, 0.03))
    for (let layer = 0; layer < 4; layer++) {
      const amp = wh * (1.05 - layer * 0.18), ph = d.phase + layer * 1.1, al = 0.2 + layer * 0.15
      for (let x = 12; x < W - 12; x += 1.5) {
        const t = (x - 12) / (W - 24), env = Math.pow(Math.sin(t * Math.PI), 0.8)
        const y = (0.62 + 0.38 * Math.sin(x * 0.034 + ph)) * (0.78 + 0.22 * Math.sin(x * 0.0105 + ph * 1.3)) * amp * env * (0.8 + lvl * 0.05) + 1
        k.rect(x, wy + wh / 2 - y / 2, 1.5, y, k.a(grad(t), al))
      }
    }
    for (let x = 12; x < W - 12; x += 1.5) { const t = (x - 12) / (W - 24), env = Math.pow(Math.sin(t * Math.PI), 0.8), y = (0.62 + 0.38 * Math.sin(x * 0.034 + d.phase + 3.3)) * (0.78 + 0.22 * Math.sin(x * 0.0105 + d.phase * 1.3 + 3.3)) * wh * 0.55 * env; k.rect(x, wy + wh / 2 - y / 2 - 0.6, 1.5, 1.2, k.a("#FFFFFF", 0.55)) }
    ;["20", "200", "2K", "20K"].forEach((l, i) => { const x = 12 + (W - 24) * (0.12 + i * 0.25); k.ln([[x, wy + wh + 2], [x, wy + wh + 5]], k.ia(0.4), 0.7); k.t(l, x, wy + wh + 6, 6, k.ia(0.55), { a: "c", w: 30 }) })
    k.t("UPLINK", W - 70, 52, 6.5, k.S, { w: 60 })
    ;[["BAND", "20HZ–20KHZ"], ["BITRATE", "256 KBPS"], [C.audio.metric, "■".repeat(lvl) + "□".repeat(5 - lvl)]].forEach(([l, v], i) => { const x = 92 + i * 76; k.t(l, x, 52, 6.5, k.S, { w: 74 }); k.t(v, x, 61, 9, k.I, { w: 74 }) })
  }
}
