// ---------- THEMED PAINT: each theme draws its own version of every widget ----------
function PK(dc) {
  const P = (x, y) => new Point(x, y)
  const est = (f) => f === "disp" ? 0.52 : 0.62
  const fontOf = (f, s) => f === "disp" ? new Font(T.scriptFont, s) : f === "heavy" ? Font.heavySystemFont(s) : f === "bold" ? Font.boldMonospacedSystemFont(s) : f === "sans" ? Font.boldSystemFont(s) : Font.mediumMonospacedSystemFont(s)
  const fit = (s, w, size, f) => { s = String(s); const n = Math.max(1, Math.floor(w / (size * est(f)))); return s.length > n ? s.slice(0, Math.max(1, n - 1)).trimEnd() + "…" : s }
  const k = {
    dc,
    I: new Color(T.ink), S: new Color(T.ink, 0.7), A: new Color(T.accent), H: new Color(T.headBg), L: new Color(T.altBg), PN: new Color(T.panel), GR: new Color(T.ground || T.panel),
    a: (hex, al) => new Color(hex, al), ia: (al) => new Color(T.ink, al),
    t(text, x, y, size, color, o) {
      o = o || {}; const f = o.f || "mono", w = o.w || 320
      dc.setFont(fontOf(f, size)); dc.setTextColor(color || k.I)
      const s = o.nofit ? String(text) : fit(text, w, size, f)
      if (o.a === "c") { dc.setTextAlignedCenter(); dc.drawTextInRect(s, new Rect(x - w / 2, y, w, size * 1.45)) }
      else if (o.a === "r") { dc.setTextAlignedRight(); dc.drawTextInRect(s, new Rect(x - w, y, w, size * 1.45)) }
      else { dc.setTextAlignedLeft(); dc.drawTextInRect(s, new Rect(x, y, w, size * 1.45)) }
      dc.setTextAlignedLeft()
    },
    wrap(text, w, size, f, max) {
      const n = Math.max(4, Math.floor(w / (size * est(f || "mono")))), words = String(text).split(/\s+/), out = []
      let cur = ""
      for (const wd of words) { if ((cur + " " + wd).trim().length > n) { if (cur) out.push(cur); cur = wd } else cur = (cur + " " + wd).trim() }
      if (cur) out.push(cur)
      if (max && out.length > max) { const keep = out.slice(0, max); keep[max - 1] = fit(keep[max - 1] + " " + out.slice(max).join(" "), w, size, f); return keep }
      return out
    },
    para(text, x, y, w, size, color, f, max, lh) { const ls = k.wrap(text, w, size, f, max); ls.forEach((l, i) => k.t(l, x, y + i * size * (lh || 1.2), size, color, { f, w, nofit: true })); return ls.length },
    ln(pts, c, w) { const p = new Path(); p.addLines(pts.map(q => P(q[0], q[1]))); dc.addPath(p); dc.setStrokeColor(c); dc.setLineWidth(w || 1); dc.strokePath() },
    poly(pts, fill, stroke, w) { const p = new Path(); p.addLines(pts.map(q => P(q[0], q[1]))); p.closeSubpath(); if (fill) { dc.addPath(p); dc.setFillColor(fill); dc.fillPath() } if (stroke) { dc.addPath(p); dc.setStrokeColor(stroke); dc.setLineWidth(w || 1); dc.strokePath() } },
    rect(x, y, w, h, fill, stroke, lw) { if (fill) { dc.setFillColor(fill); dc.fillRect(new Rect(x, y, w, h)) } if (stroke) { dc.setStrokeColor(stroke); dc.setLineWidth(lw || 1); dc.strokeRect(new Rect(x, y, w, h)) } },
    circ(x, y, r, fill, stroke, lw) { const rc = new Rect(x - r, y - r, r * 2, r * 2); if (fill) { dc.setFillColor(fill); dc.fillEllipse(rc) } if (stroke) { dc.setStrokeColor(stroke); dc.setLineWidth(lw || 1); dc.strokeEllipse(rc) } },
    ell(x, y, rx, ry, fill, stroke, lw) { const rc = new Rect(x - rx, y - ry, rx * 2, ry * 2); if (fill) { dc.setFillColor(fill); dc.fillEllipse(rc) } if (stroke) { dc.setStrokeColor(stroke); dc.setLineWidth(lw || 1); dc.strokeEllipse(rc) } },
    arcPts(cx, cy, r, a0, a1, n) { const pts = []; n = n || 40; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } return pts },
    arc(cx, cy, r, a0, a1, c, w) { k.ln(k.arcPts(cx, cy, r, a0, a1), c, w) },
    hex(cx, cy, r, fill, stroke, lw, rot) { const pts = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + (rot == null ? Math.PI / 6 : rot); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } k.poly(pts, fill, stroke, lw) },
    segs(x, y, w, h, n, frac, on, off, gap) { gap = gap == null ? 2 : gap; const sw = (w - gap * (n - 1)) / n, lit = Math.round(Math.max(0, Math.min(1, frac)) * n); for (let i = 0; i < n; i++) k.rect(x + i * (sw + gap), y, sw, h, i < lit ? (typeof on === "function" ? on(i, n) : on) : off) },
    stripes(x, y, w, h, c, step) { step = step || 8; for (let sx = x - h; sx < x + w; sx += step) { const x0 = Math.max(x, sx), x1 = Math.min(x + w, sx + step / 2); if (x1 <= x) continue; k.poly([[Math.max(x, sx), y + h], [Math.min(x + w, sx + step / 2), y + h], [Math.min(x + w, sx + step / 2 + h), y], [Math.max(x, sx + h), y]], c) } },
    rng(seed) { let s = Math.abs(Math.floor(seed)) % 233280 || 7; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
  }
  return k
}
function artImage(W, H, paint, data) { const dc = new DrawContext(); dc.size = new Size(W, H); dc.opaque = false; dc.respectScreenScale = true; paint(PK(dc), W, H, data); return dc.getImage() }
const shortT = (d) => d ? tf.string(d).replace(" AM", "A").replace(" PM", "P") : "--"
const pct = (v) => `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`
const dayOfYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
function wxKind(cond) { cond = cond || ""; return cond.includes("CLEAR") ? "sun" : cond.includes("PARTLY") ? "part" : cond.includes("SNOW") ? "snow" : cond.includes("STORM") ? "storm" : (cond.includes("RAIN") || cond.includes("DRIZZLE") || cond.includes("SHOWER")) ? "rain" : cond.includes("FOG") ? "fog" : "cloud" }
function wxIcon(k, kind, x, y, s, col, lw) {
  lw = lw || 1.2
  const cloud = (cx, cy, sc) => { k.ell(cx - sc * 0.35, cy + sc * 0.05, sc * 0.3, sc * 0.24, k.PN, col, lw); k.ell(cx + sc * 0.05, cy - sc * 0.12, sc * 0.36, sc * 0.32, k.PN, col, lw); k.ell(cx + sc * 0.42, cy + sc * 0.06, sc * 0.26, sc * 0.22, k.PN, col, lw); k.rect(cx - sc * 0.5, cy + sc * 0.05, sc * 1.05, sc * 0.2, k.PN); k.ln([[cx - sc * 0.62, cy + sc * 0.27], [cx + sc * 0.66, cy + sc * 0.27]], col, lw) }
  if (kind === "sun" || kind === "part") { const sx = kind === "part" ? x - s * 0.2 : x, sy = kind === "part" ? y - s * 0.18 : y; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; k.ln([[sx + s * 0.32 * Math.cos(a), sy + s * 0.32 * Math.sin(a)], [sx + s * 0.46 * Math.cos(a), sy + s * 0.46 * Math.sin(a)]], col, lw) } k.circ(sx, sy, s * 0.22, k.PN, col, lw) }
  if (kind !== "sun") cloud(x + (kind === "part" ? s * 0.12 : 0), y + (kind === "part" ? s * 0.12 : 0), s * 0.62)
  if (kind === "rain") for (let i = 0; i < 4; i++) k.ln([[x - s * 0.28 + i * s * 0.18, y + s * 0.3], [x - s * 0.33 + i * s * 0.18, y + s * 0.46]], col, lw)
  if (kind === "snow") for (let i = 0; i < 3; i++) { const cx = x - s * 0.22 + i * s * 0.22, cy = y + s * 0.4; k.ln([[cx - 2.5, cy], [cx + 2.5, cy]], col, lw); k.ln([[cx, cy - 2.5], [cx, cy + 2.5]], col, lw) }
  if (kind === "storm") k.poly([[x, y + s * 0.22], [x - s * 0.1, y + s * 0.42], [x + s * 0.02, y + s * 0.42], [x - s * 0.06, y + s * 0.58], [x + s * 0.14, y + s * 0.34], [x + s * 0.02, y + s * 0.34]], k.H)
  if (kind === "fog") for (let i = 0; i < 3; i++) k.ln([[x - s * 0.4, y + s * 0.34 + i * 4], [x + s * 0.4, y + s * 0.34 + i * 4]], col, lw)
}

// shrink a transmission's type until it fits in its lines (long real quotes stay whole)
function fitFs(k, text, w, maxLines, fs, f, minFs) { let s = fs; const lo = minFs || Math.max(10, fs * 0.6); while (s > lo) { const n = Math.max(4, Math.floor(w / (s * (f === "disp" ? 0.52 : 0.62)))), words = String(text).split(/\s+/); let lines = 1, cur = 0; for (const wd of words) { if (cur && cur + 1 + wd.length > n) { lines++; cur = wd.length } else cur += (cur ? 1 : 0) + wd.length } if (lines <= maxLines) break; s -= 0.5 } return s }
