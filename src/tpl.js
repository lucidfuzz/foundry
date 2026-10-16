// FOUNDRY THEME WIDGETS
// Set each widget's Parameter to one of:
//   status (medium) · shift (small) · transmission (any) · solar (large is best) · audio (medium)
//   feeds (medium) · youtube / instagram / discord (any) · oddity (small or medium, just for fun)
//   game (any size, medium or large best): a little idle game for this theme that plays itself, one turn per refresh
// Add :alt or :main after the mode to flip the header color, e.g. shift:main
const T = __THEME__

const INK = new Color(T.ink)
const SOFT = new Color(T.ink, 0.72)
const PANEL = new Color(T.panel)
const ACC = new Color(T.accent)
const mono = (s) => Font.mediumMonospacedSystemFont(s)
const disp = (s) => new Font(T.scriptFont, s)
let previewFamily = null
let FLIP = null
const DIMS = { small: [170, 170], medium: [364, 170], large: [364, 382] }
const fam = () => config.widgetFamily || previewFamily || "small"

function bg(W, H) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = true
  dc.respectScreenScale = true
  dc.setFillColor(PANEL)
  dc.fillRect(new Rect(0, 0, W, H))
  if (T.texture === "scan") {
    dc.setFillColor(new Color(T.ink, 0.06))
    for (let y = 0; y < H; y += 3) dc.fillRect(new Rect(0, y, W, 1))
  } else {
    dc.setFillColor(new Color(T.ink, 0.1))
    for (let y = 2; y < H; y += 4) for (let x = 2; x < W; x += 4) dc.fillEllipse(new Rect(x, y, 0.9, 0.9))
  }
  drawFrame(dc, W, H)
  return dc.getImage()
}


// theme frame drawn under the content, below the header bar
function drawFrame(dc, W, H) {
  const top = 24, ink = new Color(T.ink), acc = new Color(T.accent), hot = new Color(T.headBg), alt = new Color(T.altBg)
  const P = (x, y) => new Point(x, y)
  const ln = (pts, col, w) => { const p = new Path(); p.addLines(pts.map(q => P(q[0], q[1]))); dc.addPath(p); dc.setStrokeColor(col); dc.setLineWidth(w); dc.strokePath() }
  const f = T.frame || "halcyon"
  if (f === "halcyon") {
    ;[[9, top + 8], [W - 9, top + 8], [9, H - 9], [W - 9, H - 9]].forEach(([x, y]) => { ln([[x - 5, y], [x + 5, y]], new Color(T.ink, 0.6), 0.8); ln([[x, y - 5], [x, y + 5]], new Color(T.ink, 0.6), 0.8); dc.setStrokeColor(new Color(T.ink, 0.6)); dc.setLineWidth(0.8); dc.strokeEllipse(new Rect(x - 3, y - 3, 6, 6)) })
    for (let y = top + 20; y < H - 14; y += 12) ln([[W - 4, y], [W, y]], new Color(T.ink, 0.35), 0.8)
  } else if (f === "directive") {
    ;[[4, top + 4, 1, 1], [W - 4, top + 4, -1, 1], [4, H - 10, 1, -1], [W - 4, H - 10, -1, -1]].forEach(([x, y, sx, sy]) => ln([[x + sx * 14, y], [x, y], [x, y + sy * 14]], acc, 1.6))
    for (let x = -8; x < W; x += 12) { const p = new Path(); p.addLines([P(x, H), P(x + 6, H), P(x + 12, H - 5), P(x + 6, H - 5)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(acc); dc.fillPath() }
  } else if (f === "longroad") {
    dc.setStrokeColor(ink); dc.setLineWidth(1.2); dc.strokeRect(new Rect(4, top + 3, W - 8, H - top - 7))
    dc.setLineWidth(0.6); dc.strokeRect(new Rect(7, top + 6, W - 14, H - top - 13))
    ;[[4, top + 3], [W - 4, top + 3], [4, H - 4], [W - 4, H - 4]].forEach(([x, y]) => { const p = new Path(); p.addLines([P(x, y - 3.5), P(x + 3.5, y), P(x, y + 3.5), P(x - 3.5, y)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(hot); dc.fillPath() })
  } else if (f === "nightfall") {
    const ch = 10, x0 = 4, y0 = top + 3, x1 = W - 4, y1 = H - 4
    ln([[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch], [x0 + ch, y0]], new Color(T.ink, 0.35), 0.8)
    ;[[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, sx, sy]) => ln([[x + sx * (ch + 10), y], [x + sx * ch, y], [x, y + sy * ch], [x, y + sy * (ch + 10)]], ink, 1.6))
  } else if (f === "grimoire") {
    dc.setStrokeColor(acc); dc.setLineWidth(1.2); dc.strokeRect(new Rect(4, top + 3, W - 8, H - top - 7))
    dc.setStrokeColor(new Color(T.accent, 0.55)); dc.setLineWidth(0.6); dc.strokeRect(new Rect(7.5, top + 6.5, W - 15, H - top - 14))
    ;[[4, top + 3], [W - 4, top + 3], [4, H - 4], [W - 4, H - 4], [W / 2, top + 3], [W / 2, H - 4]].forEach(([x, y]) => { const p = new Path(); p.addLines([P(x, y - 4), P(x + 4, y), P(x, y + 4), P(x - 4, y)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(acc); dc.fillPath() })
  } else if (f === "cyber") {
    const pk = new Color(T.headBg), cy = new Color(T.accent), c = 10, x0 = 4, y0 = top + 3, x1 = W - 4, y1 = H - 4
    const pts = [[x0 + c, y0], [x1, y0], [x1, y1 - c], [x1 - c, y1], [x0, y1], [x0, y0 + c], [x0 + c, y0]]
    ln(pts, new Color(T.headBg, 0.25), 4); ln(pts, pk, 1.1)
    ln([[x0 + c + 6, y0], [x0 + c + 46, y0]], cy, 2.2); dc.setFillColor(cy); dc.fillRect(new Rect(x1 - 34, y1 - 1, 24, 2.5)); dc.fillRect(new Rect(x1 - 48, y1 - 1, 8, 2.5))
    dc.setFillColor(new Color(T.accent, 0.05)); for (let y = top; y < H; y += 3) dc.fillRect(new Rect(0, y, W, 1))
  } else if (f === "market") {
    dc.setStrokeColor(new Color(T.ink, 0.1)); dc.setLineWidth(1); dc.strokeRect(new Rect(5, top + 3, W - 10, H - top - 8))
    dc.setFillColor(new Color(T.ink, 0.04)); for (let x = 5; x < W - 5; x += 20) dc.fillRect(new Rect(x, top + 3, 0.6, H - top - 8))
    dc.setFillColor(new Color(T.altBg)); dc.fillEllipse(new Rect(W - 16, top + 9, 6, 6))
  } else if (f === "vapor") {
    dc.setFillColor(new Color("#FFFFFF", 0.5)); dc.fillRect(new Rect(3, top, W - 6, 1.5)); dc.fillRect(new Rect(3, top, 1.5, H - top - 3))
    dc.setFillColor(new Color("#000000", 0.45)); dc.fillRect(new Rect(3, H - 4.5, W - 6, 1.5)); dc.fillRect(new Rect(W - 4.5, top, 1.5, H - top - 3))
    dc.setFillColor(new Color(T.accent, 0.06)); for (let y = top; y < H; y += 3) dc.fillRect(new Rect(0, y, W, 1))
  } else if (f === "nature") {
    const g = new Color(T.headBg)
    dc.setStrokeColor(new Color(T.ink, 0.35)); dc.setLineWidth(0.8); dc.strokeRect(new Rect(5, top + 3, W - 10, H - top - 8))
    const leaf = (x, y, s, a) => { const c = Math.cos(a), sn = Math.sin(a), Q = (u, v) => P(x + u * c - v * sn, y + u * sn + v * c); const p = new Path(); p.move(Q(0, 0)); p.addQuadCurve(Q(s, 0), Q(s * 0.5, -s * 0.4)); p.addQuadCurve(Q(0, 0), Q(s * 0.5, s * 0.4)); dc.addPath(p); dc.setFillColor(g); dc.fillPath() }
    const my = top + (H - top) / 2; leaf(5, my, 9, -2.2); leaf(5, my + 3, 7, 2.4); leaf(W - 5, my, 9, -0.9); leaf(W - 5, my + 3, 7, 0.7)
  } else if (f === "rabbit") {
    const lav = new Color(T.headBg)
    const rr = new Path(); const x0 = 5, y0 = top + 3, w2 = W - 10, h2 = H - top - 8, rad = 16
    rr.move(P(x0 + rad, y0)); rr.addLine(P(x0 + w2 - rad, y0)); rr.addQuadCurve(P(x0 + w2, y0 + rad), P(x0 + w2, y0)); rr.addLine(P(x0 + w2, y0 + h2 - rad)); rr.addQuadCurve(P(x0 + w2 - rad, y0 + h2), P(x0 + w2, y0 + h2)); rr.addLine(P(x0 + rad, y0 + h2)); rr.addQuadCurve(P(x0, y0 + h2 - rad), P(x0, y0 + h2)); rr.addLine(P(x0, y0 + rad)); rr.addQuadCurve(P(x0 + rad, y0), P(x0, y0)); rr.closeSubpath()
    dc.addPath(rr); dc.setStrokeColor(lav); dc.setLineWidth(1); dc.strokePath()
    const spark = (x, y, r, col) => { const p = new Path(); p.addLines([P(x, y - r), P(x + r * 0.22, y - r * 0.22), P(x + r, y), P(x + r * 0.22, y + r * 0.22), P(x, y + r), P(x - r * 0.22, y + r * 0.22), P(x - r, y), P(x - r * 0.22, y - r * 0.22)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(col); dc.fillPath() }
    const my = top + (H - top) / 2; spark(W - 5, my, 5, acc); spark(5, my, 4, lav); spark(W - 5, my + 12, 2, acc)
  } else if (f === "deeprange") {
    dc.setFillColor(hot)
    ;[[0, top + 10, 5, 22], [0, top + 36, 3, 6], [W - 5, H - 40, 5, 26], [W - 3, H - 10, 3, 6]].forEach(([x, y, w, h]) => dc.fillRect(new Rect(x, y, w, h)))
    ;[[10, top + 6], [W - 10, top + 6]].forEach(([x, y], i) => ln([[x + (i ? -12 : 12), y], [x, y], [x, y + 12]], new Color(T.ink, 0.7), 1.2))
  }
}


const titleCase = (s) => String(s).toLowerCase().replace(/(^|[\s\-\/(])([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\bIi\b/g, "II").replace(/\bW-0/g, "W-0")
function headTextColor(alt) {
  const f = T.frame || "halcyon"
  if (f === "nightfall") return new Color(T.ink)
  if (f === "grimoire") return new Color(T.accent)
  if (f === "vapor") return new Color("#FFFFFF")
  return new Color(alt ? T.altText : T.headText)
}
// each theme's header strip, drawn as the header stack's background
function headerImage(W, H, alt) {
  const dc = new DrawContext(); dc.size = new Size(W, H); dc.opaque = true; dc.respectScreenScale = true
  const f = T.frame || "halcyon", base = new Color(alt ? T.altBg : T.headBg), tc = new Color(alt ? T.altText : T.headText)
  const P = (x, y) => new Point(x, y)
  const poly = (pts, col) => { const p = new Path(); p.addLines(pts.map(q => P(q[0], q[1]))); p.closeSubpath(); dc.addPath(p); dc.setFillColor(col); dc.fillPath() }
  const ln = (pts, col, w) => { const p = new Path(); p.addLines(pts.map(q => P(q[0], q[1]))); dc.addPath(p); dc.setStrokeColor(col); dc.setLineWidth(w); dc.strokePath() }
  dc.setFillColor(PANEL); dc.fillRect(new Rect(0, 0, W, H))
  if (f === "halcyon") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    ln([[0, H - 1], [W, H - 1]], new Color(alt ? T.altText : T.headText, 0.35), 1)
    for (let x = W - 8; x > W - 60; x -= 6) ln([[x, H - 5], [x, H - 1]], new Color(alt ? T.altText : T.headText, 0.4), 0.8)
  } else if (f === "directive") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    for (let x = W - 28; x < W + 10; x += 8) poly([[x, H], [x + 4, H], [x + 4 + H * 0.6, 0], [x + H * 0.6, 0]], tc)
    dc.setFillColor(tc); dc.fillRect(new Rect(0, H - 2, W, 2))
  } else if (f === "longroad") {
    const notch = 8
    poly([[0, 1], [W, 1], [W - notch, H / 2], [W, H - 1], [0, H - 1], [notch, H / 2]], base)
    ln([[notch + 4, 3.5], [W - notch - 4, 3.5]], new Color(alt ? T.altText : T.headText, 0.55), 0.6)
    ln([[notch + 4, H - 3.5], [W - notch - 4, H - 3.5]], new Color(alt ? T.altText : T.headText, 0.55), 0.6)
    ;[[notch + 6, H / 2], [W - notch - 6, H / 2]].forEach(([x, y]) => poly([[x, y - 3], [x + 3, y], [x, y + 3], [x - 3, y]], new Color(alt ? T.altText : T.headText)))
  } else if (f === "nightfall") {
    dc.setFillColor(new Color(T.ink, 0.08)); dc.fillRect(new Rect(0, 0, W, H))
    ln([[0, H - 6], [6, H - 1], [W - 6, H - 1], [W, H - 6]], new Color(T.ink), 1.2)
    ln([[0, 5], [6, 0]], new Color(T.ink), 1.2); ln([[W, 5], [W - 6, 0]], new Color(T.ink), 1.2)
    for (let i = 0; i < 6; i++) { dc.setFillColor(new Color(T.ink, i < 4 ? 0.9 : 0.25)); dc.fillRect(new Rect(W - 14 - i * 6, 8, 4, 8)) }
  } else if (f === "grimoire") {
    dc.setFillColor(new Color(T.ground)); dc.fillRect(new Rect(0, 0, W, H))
    const g = new Color(T.accent)
    ln([[0, 1.5], [W, 1.5]], g, 1); ln([[0, H - 1.5], [W, H - 1.5]], g, 1)
    ln([[0, 4], [W, 4]], new Color(T.accent, 0.45), 0.5); ln([[0, H - 4], [W, H - 4]], new Color(T.accent, 0.45), 0.5)
    ;[[11, H / 2], [W - 11, H / 2]].forEach(([x, y]) => { poly([[x, y - 5], [x + 5, y], [x, y + 5], [x - 5, y]], g); poly([[x, y - 2], [x + 2, y], [x, y + 2], [x - 2, y]], new Color(T.ground)) })
  } else if (f === "cyber") {
    dc.setFillColor(new Color(T.ground)); dc.fillRect(new Rect(0, 0, W, H))
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W * 0.62, H)); const p = new Path(); p.addLines([P(W * 0.62, 0), P(W * 0.62 + 14, 0), P(W * 0.62, H)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(base); dc.fillPath()
    dc.setFillColor(new Color(T.accent)); dc.fillRect(new Rect(0, H - 2, W, 2)); for (let i = 0; i < 5; i++) dc.fillRect(new Rect(W - 46 + i * 8, 8, 5, 8))
  } else if (f === "market") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    dc.setFillColor(new Color(T.altBg)); dc.fillRect(new Rect(0, H - 3, W * 0.62, 3)); dc.setFillColor(new Color("#E8384F")); dc.fillRect(new Rect(W * 0.62, H - 3, W * 0.38, 3))
    let v = 0.5; for (let i = 0; i < 6; i++) { const o = v; v = Math.max(0.2, Math.min(0.8, v + Math.sin(i * 1.7) * 0.25)); const up = v >= o; dc.setFillColor(up ? new Color(alt ? T.altText : T.headText) : new Color(alt ? T.altText : T.headText, 0.5)); const yt = 4 + 14 * (1 - Math.max(o, v)), yb = 4 + 14 * (1 - Math.min(o, v)); dc.fillRect(new Rect(W - 50 + i * 7, yt, 4, Math.max(2, yb - yt))) }
  } else if (f === "vapor") {
    dc.setFillColor(new Color("#C3C3D0")); dc.fillRect(new Rect(0, 0, W, H))
    for (let i = 0; i < 20; i++) { dc.setFillColor(new Color(i < 10 ? "#1A1A80" : (alt ? T.altBg : T.headBg), i < 10 ? 1 : 0.55 + i * 0.022)); dc.fillRect(new Rect(3 + i * (W - 6) / 20, 3, (W - 6) / 20 + 0.5, H - 6)) }
    ;[W - 18, W - 32, W - 46].forEach((x, i) => { dc.setFillColor(new Color("#C3C3D0")); dc.fillRect(new Rect(x, 6, 12, 11)); dc.setFillColor(new Color("#FFFFFF")); dc.fillRect(new Rect(x, 6, 12, 1)); dc.setFillColor(new Color("#000000")); if (i === 0) { ln([[x + 3, 9], [x + 9, 15]], new Color("#000000"), 1.2); ln([[x + 9, 9], [x + 3, 15]], new Color("#000000"), 1.2) } else if (i === 1) { dc.setStrokeColor(new Color("#000000")); dc.setLineWidth(1); dc.strokeRect(new Rect(x + 3, 9, 6, 5)) } else dc.fillRect(new Rect(x + 3, 13, 6, 1.5)) })
  } else if (f === "nature") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    for (let x = 0; x < W; x += 4) { dc.setFillColor(new Color("#FFFFFF", 0.04 + 0.04 * Math.abs(Math.sin(x * 0.11)))); dc.fillRect(new Rect(x, 0, 2, H)) }
    const leaf = (x, y, s, a, col) => { const c = Math.cos(a), sn = Math.sin(a), Q = (u, v) => P(x + u * c - v * sn, y + u * sn + v * c); const p = new Path(); p.move(Q(0, 0)); p.addQuadCurve(Q(s, 0), Q(s * 0.5, -s * 0.4)); p.addQuadCurve(Q(0, 0), Q(s * 0.5, s * 0.4)); dc.addPath(p); dc.setFillColor(col); dc.fillPath() }
    leaf(W - 18, H / 2, 10, 3.6, tc); leaf(W - 22, H / 2 + 2, 7, 2.6, new Color(alt ? T.altText : T.headText, 0.7))
  } else if (f === "rabbit") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    for (let x = 0; x < W; x += 3) { dc.setFillColor(new Color("#FFFFFF", 0.05 + 0.08 * Math.abs(Math.sin(x * 0.05)))); dc.fillRect(new Rect(x, 0, 1.5, H)) }
    const spark = (x, y, r, col) => { const p = new Path(); p.addLines([P(x, y - r), P(x + r * 0.22, y - r * 0.22), P(x + r, y), P(x + r * 0.22, y + r * 0.22), P(x, y + r), P(x - r * 0.22, y + r * 0.22), P(x - r, y), P(x - r * 0.22, y - r * 0.22)]); p.closeSubpath(); dc.addPath(p); dc.setFillColor(col); dc.fillPath() }
    spark(W - 12, H / 2, 5, new Color(T.accent)); spark(W - 24, H / 2 - 4, 2.2, new Color("#FFFFFF", 0.9))
    ln([[0, H - 1], [W, H - 1]], new Color(T.accent, 0.5), 1)
  } else if (f === "deeprange") {
    dc.setFillColor(base); dc.fillRect(new Rect(0, 0, W, H))
    dc.setFillColor(new Color(T.ground, 0.15)); for (let y = 0; y < H; y += 3) dc.fillRect(new Rect(0, y, W, 1))
    dc.setFillColor(tc); ;[[W - 26, 5, 6, 14], [W - 18, 5, 3, 6], [W - 18, 13, 3, 6], [W - 12, 5, 6, 14]].forEach(([x, y, w, h]) => dc.fillRect(new Rect(x, y, w, h)))
  }
  return dc.getImage()
}

function txt(stack, text, size, color, isDisp) {
  const t = stack.addText(String(text))
  t.font = isDisp ? disp(size) : mono(size)
  t.textColor = color || INK
  t.lineLimit = 1
  t.minimumScaleFactor = 0.85
  return t
}

function base(code, right, alt, decorate) {
  if (FLIP === "alt") alt = true
  if (FLIP === "main") alt = false
  const d = DIMS[fam()] || DIMS.small
  const w = new ListWidget()
  w.backgroundImage = bg(d[0], d[1])
  w.setPadding(0, 0, 0, 0)
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000)
  const head = w.addStack()
  head.layoutHorizontally()
  head.centerAlignContent()
  const f = T.frame || "halcyon", serifHead = f === "longroad" || f === "grimoire" || f === "rabbit" || f === "nature"
  head.backgroundColor = new Color(alt ? T.altBg : T.headBg)
  head.backgroundImage = headerImage(d[0], 24, alt)
  const padR = f === "directive" || f === "deeprange" ? 34 : f === "nightfall" || f === "cyber" || f === "vapor" || f === "market" ? 56 : f === "rabbit" || f === "nature" ? 30 : f === "longroad" || f === "grimoire" ? 22 : 12
  head.setPadding(6, f === "longroad" || f === "grimoire" ? 22 : 12, 6, d[0] < 200 ? Math.min(padR, 34) : padR)
  const hc = headTextColor(alt)
  const ht = txt(head, serifHead ? titleCase(code) : code, serifHead ? 10 : 9, hc, serifHead)
  head.addSpacer()
  if (decorate) decorate(head, hc)
  else if (right) txt(head, serifHead ? titleCase(right) : right, serifHead ? 10 : 9, hc, serifHead)
  return w
}

function body(w, p) {
  const b = w.addStack()
  b.layoutVertically()
  b.setPadding(p[0], p[1], p[2], p[3])
  return b
}

function readout(row, k, v) {
  const c = row.addStack()
  c.layoutVertically()
  txt(c, k, 8, SOFT)
  c.addSpacer(1)
  txt(c, v, 10.5)
}

const tf = (() => { const f = new DateFormatter(); f.dateFormat = "h:mm a"; return f })()

async function coords() {
  const fm = FileManager.local()
  const path = fm.joinPath(fm.documentsDirectory(), "foundry-loc.json")
  try {
    Location.setAccuracyToThreeKilometers()
    const l = await Location.current()
    const c = { lat: l.latitude, lon: l.longitude }
    fm.writeString(path, JSON.stringify(c))
    return c
  } catch (e) {
    if (fm.fileExists(path)) return JSON.parse(fm.readString(path))
    return null
  }
}

function condition(code) {
  if (code === 0) return "CLEAR"
  if (code <= 2) return "PARTLY CLOUDY"
  if (code === 3) return "OVERCAST"
  if (code <= 48) return "FOG"
  if (code <= 57) return "DRIZZLE"
  if (code <= 67) return "RAIN"
  if (code <= 77) return "SNOW"
  if (code <= 82) return "SHOWERS"
  if (code <= 86) return "SNOW SHOWERS"
  return "STORM"
}

async function weather() {
  try {
    const c = await coords()
    if (!c) return null
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1&temperature_unit=${T.units}`
    const j = await new Request(url).loadJSON()
    const d = j.daily || {}
    return {
      temp: Math.round(j.current.temperature_2m), cond: condition(j.current.weather_code),
      feels: j.current.apparent_temperature != null ? Math.round(j.current.apparent_temperature) : null,
      hi: d.temperature_2m_max ? Math.round(d.temperature_2m_max[0]) : null,
      lo: d.temperature_2m_min ? Math.round(d.temperature_2m_min[0]) : null
    }
  } catch (e) { return null }
}

async function nextEvent() {
  try {
    const now = new Date()
    const list = (await CalendarEvent.today([])).concat(await CalendarEvent.tomorrow([]))
      .filter(e => !e.isAllDay && e.endDate > now)
      .sort((a, b) => a.startDate - b.startDate)
    return list.length ? list[0] : null
  } catch (e) { return null }
}

function bar(width, frac, h) {
  const H = h || 4
  const dc = new DrawContext()
  dc.size = new Size(width, H)
  dc.opaque = false
  dc.respectScreenScale = true
  dc.setFillColor(new Color(T.ink, 0.22))
  dc.fillRect(new Rect(0, 0, width, H))
  dc.setFillColor(INK)
  dc.fillRect(new Rect(0, 0, Math.max(2, width * Math.min(1, Math.max(0, frac))), H))
  return dc.getImage()
}

function hatch(width) {
  const dc = new DrawContext()
  dc.size = new Size(width, 5)
  dc.opaque = false
  dc.respectScreenScale = true
  const p = new Path()
  for (let x = -5; x < width; x += 5) { p.move(new Point(x, 5)); p.addLine(new Point(x + 5, 0)) }
  dc.addPath(p)
  dc.setStrokeColor(new Color(T.ink, 0.55))
  dc.setLineWidth(1.4)
  dc.strokePath()
  return dc.getImage()
}

// ---------- STATUS (medium) ----------
async function status() {
  if (THEMED()) return themedStatus(THEMED())
  const L = T.L
  const [ev, wx] = await Promise.all([nextEvent(), weather()])
  const w = base(L.status, null, false, (head, hc) => {
    txt(head, "LINK ", 9, hc)
    const lk = head.addDate(new Date()); lk.applyTimerStyle(); lk.font = mono(9); lk.textColor = hc
    txt(head, ` · ${T.unit}`, 9, hc)
  })
  w.url = "calshow://"

  const top = w.addStack()
  top.layoutHorizontally()
  top.setPadding(9, 14, 4, 14)
  const left = top.addStack()
  left.layoutVertically()
  txt(left, L.next, 9, SOFT)
  left.addSpacer(4)
  if (ev) {
    const t = left.addText(ev.title); t.font = disp(17); t.textColor = INK; t.lineLimit = 2; t.minimumScaleFactor = 0.75
    left.addSpacer(3)
    const today = ev.startDate.toDateString() === new Date().toDateString()
    txt(left, `${today ? "" : "TOMORROW "}${tf.string(ev.startDate)} — ${tf.string(ev.endDate)}`, 10.5)
  } else {
    txt(left, L.none, 17, INK, true)
    left.addSpacer(3)
    txt(left, L.noneSub, 10.5)
  }
  top.addSpacer()
  const div = top.addStack(); div.size = new Size(1, 60); div.backgroundColor = new Color(T.ink, 0.3)
  top.addSpacer(14)
  const right = top.addStack()
  right.layoutVertically()
  txt(right, L.ext, 9, SOFT)
  const temp = right.addText(wx ? `${wx.temp}°` : "--°"); temp.font = disp(34); temp.textColor = INK
  txt(right, wx ? wx.cond : "NO SIGNAL", 9.5)

  const ro = w.addStack()
  ro.layoutHorizontally()
  ro.setPadding(4, 14, 0, 14)
  let dur = "--", st = L.standby
  if (ev) {
    const m = Math.round((ev.endDate - ev.startDate) / 60000)
    dur = `${Math.floor(m / 60)}H ${String(m % 60).padStart(2, "0")}M`
    st = ev.startDate <= new Date() ? L.active : L.queued
  }
  readout(ro, L.dur, dur); ro.addSpacer()
  readout(ro, L.state, st); ro.addSpacer()
  readout(ro, L.feels, wx && wx.feels != null ? `${wx.feels}°` : "--"); ro.addSpacer()
  readout(ro, L.hilo, wx && wx.hi != null ? `${wx.hi}° / ${wx.lo}°` : "--")

  w.addSpacer()
  const rule = w.addStack(); rule.setPadding(0, 14, 6, 14)
  const ri = rule.addImage(hatch(336)); ri.imageSize = new Size(336, 5)
  const foot = w.addStack()
  foot.layoutHorizontally()
  foot.centerAlignContent()
  foot.setPadding(0, 14, 10, 14)
  const lvl = Device.batteryLevel()
  txt(foot, `${L.cell} ${Math.round(lvl * 100)}%${Device.isCharging() ? " +" : ""}`, 9.5)
  foot.addSpacer(6)
  const bi = foot.addImage(bar(70, lvl)); bi.imageSize = new Size(70, 4)
  foot.addSpacer()
  const df = new DateFormatter(); df.dateFormat = "EEE dd.MM"
  const start = new Date(new Date().getFullYear(), 0, 0)
  txt(foot, `${df.string(new Date()).toUpperCase()} · ${L.cycle} ${Math.floor((new Date() - start) / 86400000)}`, 9.5)
  return w
}

// ---------- SHIFT (small) ----------
async function shift() {
  if (THEMED()) return themedShift(THEMED())
  const L = T.L
  const w = base(L.shift, "LIVE", true)
  w.url = "calshow://"
  const b = body(w, [7, 12, 8, 12])
  const ev = await nextEvent()
  const now = new Date()
  if (!ev) {
    txt(b, L.standby, 8, SOFT)
    b.addSpacer(4)
    const t = b.addText(L.offTitle); t.font = disp(20); t.textColor = INK; t.lineLimit = 2
    b.addSpacer()
    txt(b, L.noneSub, 8)
    return w
  }
  const active = ev.startDate <= now
  const span = ev.endDate - ev.startDate
  const frac = active ? (now - ev.startDate) / span : 0
  txt(b, active ? L.activeLong : L.next, 7.5, SOFT)
  b.addSpacer(3)
  const t = b.addText(ev.title); t.font = disp(13); t.textColor = INK; t.lineLimit = 2; t.minimumScaleFactor = 0.8
  b.addSpacer()
  const d = b.addDate(active ? ev.endDate : ev.startDate)
  d.applyTimerStyle(); d.font = disp(28); d.textColor = INK; d.lineLimit = 1; d.minimumScaleFactor = 0.6
  const lr = b.addStack(); lr.layoutHorizontally()
  txt(lr, active ? "REMAINING" : "UNTIL START", 7.5)
  lr.addSpacer()
  txt(lr, active ? `${Math.round(frac * 100)}%` : "QUEUED", 7.5, SOFT)
  b.addSpacer(4)
  const bi = b.addImage(bar(146, frac, 5)); bi.imageSize = new Size(146, 5)
  b.addSpacer(3)
  const ends = b.addStack(); ends.layoutHorizontally()
  const short = (x) => tf.string(x).replace(" AM", "A").replace(" PM", "P")
  txt(ends, `IN ${short(ev.startDate)}`, 6.5, SOFT)
  ends.addSpacer()
  txt(ends, `OUT ${short(ev.endDate)}`, 6.5, SOFT)
  return w
}

// ---------- TRANSMISSION (any size) ----------
const ARCHIVE_DEFAULT = [
  { t: "Beware; for I am fearless, and therefore powerful.", by: "MARY SHELLEY · FRANKENSTEIN · 1818" },
  { t: "Beware of first-hand ideas!", by: "E. M. FORSTER · THE MACHINE STOPS · 1909" },
  { t: "The Machine feeds us and clothes us and houses us.", by: "E. M. FORSTER · THE MACHINE STOPS · 1909" },
  { t: "Intellects vast and cool and unsympathetic regarded this earth with envious eyes.", by: "H. G. WELLS · THE WAR OF THE WORLDS · 1898" },
  { t: "There is no security against the ultimate development of mechanical consciousness.", by: "SAMUEL BUTLER · EREWHON · 1872" }
]

const ARCHIVE = (T.archiveList && T.archiveList.length) ? T.archiveList : ARCHIVE_DEFAULT

function graphic(W, H) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const t = Date.now() / 60000
  const phase = (t / 7) % (Math.PI * 2)
  const mid = H / 2
  if (T.txGraphic === "trajectory") {
    const ax = W * 0.88, ay = H * 0.22, sx = 4, sy = H - 2, cx1 = W * 0.35, cy1 = -H * 0.2
    const bz = (u) => new Point((1 - u) ** 2 * sx + 2 * (1 - u) * u * cx1 + u * u * ax, (1 - u) ** 2 * sy + 2 * (1 - u) * u * cy1 + u * u * ay)
    for (let i = 0; i < 7; i++) {
      const u = 0.15 + i * 0.11, p = bz(u), q = bz(u + 0.01), ang = Math.atan2(q.y - p.y, q.x - p.x), sz = H * 0.42 - i * 1.4
      const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux, sk = 0.55
      const pts = [new Point(p.x + vx * sz - ux * sz * sk, p.y + vy * sz - uy * sz * sk), new Point(p.x + vx * sz + ux * sz * sk, p.y + vy * sz + uy * sz * sk), new Point(p.x - vx * sz + ux * sz * sk, p.y - vy * sz + uy * sz * sk), new Point(p.x - vx * sz - ux * sz * sk, p.y - vy * sz - uy * sz * sk)]
      const fr = new Path(); fr.addLines(pts); fr.closeSubpath(); dc.addPath(fr); dc.setStrokeColor(new Color(T.headBg, 0.85 - i * 0.08)); dc.setLineWidth(1); dc.strokePath()
    }
    const tp = []; for (let u = 0; u <= 1.0001; u += 0.04) tp.push(bz(u))
    const tr = new Path(); tr.addLines(tp); dc.addPath(tr); dc.setStrokeColor(INK); dc.setLineWidth(1.3); dc.strokePath()
    dc.setFillColor(new Color(T.headBg)); dc.fillEllipse(new Rect(ax - 4, ay - 4, 8, 8))
    return dc.getImage()
  }
  if (T.txGraphic === "reentry") {
    let s = Math.floor(t)
    const rr = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    const hp = []
    for (let k = 0; k <= 30; k++) { const u = k / 30; hp.push(new Point(u * W, (1 - u) * (1 - u) * H * 0.72 + 2 * (1 - u) * u * H * 0.45 + u * u * H * 0.6)) }
    const hz = new Path(); hz.addLines(hp)
    dc.addPath(hz); dc.setStrokeColor(new Color(T.ink, 0.8)); dc.setLineWidth(1.2); dc.strokePath()
    for (let i = 0; i < 60; i++) {
      const u = rr(), edge = Math.pow(Math.abs(u - 0.5) * 2, 0.6), x = W / 2 + (u > 0.5 ? 1 : -1) * edge * W / 2
      const len = (H * 0.3 + rr() * H * 0.7) * (0.5 + edge * 0.6)
      const p = new Path(); p.move(new Point(x, H)); p.addLine(new Point(x + (u > 0.5 ? 1 : -1) * 6 * edge, H - len))
      dc.addPath(p); dc.setStrokeColor(new Color(rr() < 0.5 ? "#FFB347" : T.accent, 0.4 + rr() * 0.5)); dc.setLineWidth(0.6 + rr() * 1.6); dc.strokePath()
    }
    return dc.getImage()
  }
  if (T.txGraphic === "rain") {
    let s = Math.floor(t)
    const rr = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    for (let i = 0; i < 70; i++) { const x = rr() * W, y = rr() * H, l = 4 + rr() * 7; const p = new Path(); p.move(new Point(x, y)); p.addLine(new Point(x - l * 0.3, y + l)); dc.addPath(p); dc.setStrokeColor(new Color(T.accent, 0.35 + rr() * 0.4)); dc.setLineWidth(0.6); dc.strokePath() }
    let x = 0
    while (x < W) { const bw = 8 + rr() * 16, bh = H * (0.3 + rr() * 0.6); dc.setStrokeColor(INK); dc.setLineWidth(0.9); dc.strokeRect(new Rect(x, H - bh, bw, bh)); x += bw + 2 }
    return dc.getImage()
  }
  if (T.txGraphic === "stars") {
    let s = Math.floor(t / 15) + 7
    const rr = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    for (let i = 0; i < 60; i++) { const z = 0.6 + rr() * 1.4; dc.setFillColor(new Color(T.ink, 0.3 + rr() * 0.6)); dc.fillEllipse(new Rect(rr() * W, rr() * H, z, z)) }
    const pts = []
    for (let i = 0; i < 6; i++) pts.push(new Point(W * (0.08 + i * 0.17) + (rr() - 0.5) * 20, H * (0.2 + rr() * 0.6)))
    const p = new Path(); p.addLines(pts); dc.addPath(p); dc.setStrokeColor(new Color(T.headBg, 0.8)); dc.setLineWidth(0.9); dc.strokePath()
    pts.forEach(q => { dc.setFillColor(ACC); dc.fillEllipse(new Rect(q.x - 2, q.y - 2, 4, 4)) })
    return dc.getImage()
  }
  if (T.txGraphic === "route") {
    const n = Math.floor(W / 26)
    for (let i = 0; i < n; i++) {
      const x = 8 + i * 26 + (i % 2) * 6, h = 6 + ((i * 7 + Math.floor(t)) % 5) * 1.6
      if (i % 3 === 1) {
        const m = new Path(); m.addLines([new Point(x - 6, H - 2), new Point(x, H - 2 - h), new Point(x + 6, H - 2)]); m.closeSubpath()
        dc.addPath(m); dc.setStrokeColor(INK); dc.setLineWidth(1); dc.strokePath()
      }
    }
    for (let x = 4; x < W - 10; x += 6) {
      const y = mid + Math.sin(x * 0.05 + phase) * (H / 3)
      dc.setFillColor(ACC); dc.fillEllipse(new Rect(x - 1.2, y - 1.2, 2.4, 2.4))
    }
    const ex = W - 8, ey = mid + Math.sin((W - 8) * 0.05 + phase) * (H / 3)
    const xm = new Path(); xm.move(new Point(ex - 4, ey - 4)); xm.addLine(new Point(ex + 4, ey + 4)); xm.move(new Point(ex + 4, ey - 4)); xm.addLine(new Point(ex - 4, ey + 4))
    dc.addPath(xm); dc.setStrokeColor(ACC); dc.setLineWidth(1.8); dc.strokePath()
    return dc.getImage()
  }
  if (T.txGraphic === "sync") {
    const base = new Path(); base.move(new Point(0, mid)); base.addLine(new Point(W, mid))
    dc.addPath(base); dc.setStrokeColor(new Color(T.ink, 0.25)); dc.setLineWidth(0.8); dc.strokePath()
    ;[[new Color(T.ink), 0, 1.3], [ACC, 1.9, 1.5]].forEach(([col, ph, lw]) => {
      const pts = []
      for (let x = 0; x <= W; x += 1.5) {
        const k = x / W, amp = (H / 2 - 2) * (1 - 0.7 * k)
        pts.push(new Point(x, mid + amp * Math.sin(x * 0.11 + phase + ph * (1 - k))))
      }
      const p = new Path(); p.addLines(pts)
      dc.addPath(p); dc.setStrokeColor(col); dc.setLineWidth(lw); dc.strokePath()
    })
    const cur = new Path(); cur.move(new Point(W * 0.82, 0)); cur.addLine(new Point(W * 0.82, H))
    dc.addPath(cur); dc.setStrokeColor(new Color(T.headBg)); dc.setLineWidth(1.2); dc.strokePath()
    return dc.getImage()
  }
  if (T.txGraphic === "signal") {
    const pts = []
    for (let x = 0; x <= W; x += 1.5) {
      const burst = Math.max(0, Math.sin(x * 0.03 + phase)) ** 3
      pts.push(new Point(x, mid + Math.sin(x * 0.55 + phase * 3) * (H / 2 - 2) * (0.15 + 0.85 * burst)))
    }
    const base = new Path(); base.move(new Point(0, mid)); base.addLine(new Point(W, mid))
    dc.addPath(base); dc.setStrokeColor(new Color(T.ink, 0.25)); dc.setLineWidth(0.8); dc.strokePath()
    const p = new Path(); p.addLines(pts)
    dc.addPath(p); dc.setStrokeColor(INK); dc.setLineWidth(1.4); dc.strokePath()
    for (let x = 10; x < W; x += 40) { dc.setFillColor(ACC); dc.fillRect(new Rect(x, H - 3, 6, 3)) }
    return dc.getImage()
  }
  const pulse = 0.72 + 0.28 * Math.sin(t / 3)
  const A = (H / 2 - 2) * pulse, k = (Math.PI * 2) / (W / 3.2)
  const y = (x, off) => mid + A * Math.sin(k * x + phase + off)
  for (let x = 2, i = 0; x < W; x += 5, i++) {
    const depth = Math.abs(Math.cos(k * x + phase))
    const r = new Path(); r.move(new Point(x, y(x, 0))); r.addLine(new Point(x, y(x, Math.PI)))
    dc.addPath(r)
    const marker = i % 11 === 4
    dc.setStrokeColor(marker ? ACC : new Color(T.ink, 0.2 + 0.5 * depth))
    dc.setLineWidth(marker ? 2.2 : 1.1)
    dc.strokePath()
  }
  ;[0, Math.PI].forEach((off, j) => {
    const pts = []
    for (let x = 0; x <= W; x += 1.5) pts.push(new Point(x, y(x, off)))
    const p = new Path(); p.addLines(pts)
    dc.addPath(p); dc.setStrokeColor(new Color(T.ink, j === 0 ? 1 : 0.55)); dc.setLineWidth(j === 0 ? 1.8 : 1.4); dc.strokePath()
  })
  return dc.getImage()
}

async function transmission() {
  if (THEMED()) return themedTx(THEMED())
  const L = T.L
  const f = fam()
  const small = f === "small", big = f === "large"
  const signal = 71 + Math.floor(Math.random() * 29)
  const w = base(L.tx, small ? null : `SIGNAL ${signal}%`, true)
  w.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000)
  const b = body(w, small ? [8, 12, 8, 12] : [9, 14, 9, 14])
  const archival = T.archive && Math.random() < 0.25
  const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")
  let text, by, cls
  if (archival) {
    const q = ARCHIVE[Math.floor(Math.random() * ARCHIVE.length)]
    text = q.t; by = q.by; cls = "ARCHIVAL // PUBLIC DOMAIN"
  } else {
    const s = T.slogans[Math.floor(Math.random() * T.slogans.length)] || ["Stand By", "COMMAND"]
    text = s[0]; by = `${T.company.toUpperCase()} · ${s[1]}`
    cls = T.classes[Math.floor(Math.random() * T.classes.length)]
  }
  const meta = b.addStack(); meta.layoutHorizontally()
  txt(meta, `MSG 0x${hex} // INBOUND`, small ? 7 : 8, SOFT)
  if (!small) { meta.addSpacer(); txt(meta, `CLASS: ${cls}`, 8, SOFT) }
  b.addSpacer(small ? 4 : 6)
  const st = b.addText(text); st.font = disp(small ? 15 : (archival ? 17 : 21)); st.textColor = INK; st.lineLimit = 3; st.minimumScaleFactor = 0.7
  b.addSpacer(3)
  txt(b, `— ${by}`, small ? 6 : 7.5, SOFT)
  const lines = Math.ceil(text.length / (archival ? 40 : 34))
  const extra = small ? 0 : (big ? 2 : Math.max(0, 3 - lines))
  let seed = parseInt(hex, 16) || 7
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const byte = () => Math.floor(rnd() * 256).toString(16).toUpperCase().padStart(2, "0")
  if (extra >= 1) {
    b.addSpacer(8)
    const row = b.addStack(); row.layoutHorizontally()
    const pr = 1 + Math.floor(rnd() * 5)
    readout(row, "ROUTING", archival ? "ARCHIVE" : `${T.unit}`); row.addSpacer()
    readout(row, "CHECKSUM", `${byte()}${byte()}·${byte()}${byte()}`); row.addSpacer()
    readout(row, "PRIORITY", "■".repeat(pr) + "□".repeat(5 - pr))
  }
  if (extra >= 2) {
    b.addSpacer(5)
    let dump = "0x"
    for (let i = 0; i < 26; i++) dump += byte() + " "
    txt(b, dump.trim(), 6.5, SOFT)
  }
  b.addSpacer()
  const gw = small ? 146 : 336, gh = small ? 22 : (big ? 56 : (extra === 0 ? 24 : 28))
  const gi = b.addImage(graphic(gw, gh)); gi.imageSize = new Size(gw, gh)
  b.addSpacer(4)
  const foot = b.addStack(); foot.layoutHorizontally(); foot.centerAlignContent()
  txt(foot, small ? "SEQ " : `SEQ ${hex} · DECODING `, 7, SOFT)
  const live = foot.addDate(new Date()); live.applyTimerStyle(); live.font = mono(7); live.textColor = INK
  foot.addSpacer()
  txt(foot, `INTEGRITY ${(97 + Math.random() * 2.9).toFixed(1)}%`, 7, small ? SOFT : INK)
  return w
}



// ---------- copy deck: every line of flavor text a theme can override ----------
const DEFAULT_COPY = {
  solar: { label: "SOLAR FEED", offline: "Signal Lost", day: "DAYLIGHT REMAINING", night: "NIGHT CYCLE", setIn: "SUNSET IN", riseIn: "SUNRISE IN" },
  audio: { right: "CH 08 · PRE-APPROVED", src: "SIGNAL // YT MUSIC", metric: "SEDATION", tap: "TAP TO ENGAGE · UPLINK ", foot: "LISTEN AS DIRECTED",
    lines: ["Approved Frequencies Only", "Mood Stabilization Active", "Ambient Pacification", "Listen As Directed", "Auditory Compliance Stream", "Sedation Channel Open"] },
  feeds: { right: "2 CH MONITORED", trace: "CORTICAL ACTIVITY // LIVE FEED", tap: "TAP A CHANNEL TO ENGAGE · SESSION ", foot: "DOPAMINE IS A DELIVERABLE", linked: "LINKED", status: "IMPLANT N-7 // SYNCED",
    yt: { line: "Approved Viewing", meters: ["DOPAMINE", "ENDORPHIN", "FOCUS"], tag: "AUTOPLAY ENFORCED", queue: "∞ VIDEOS", kv: ["QUEUE", "ATTENTION SPAN", "RABBIT HOLE"], curve: "RETENTION CURVE // SESSION", curveR: "REWARD LOOP ENGAGED", foot: "WATCH AS DIRECTED" },
    ig: { line: "Peer Observation", meters: ["DOPAMINE", "SEROTONIN", "CORTISOL"], tag: "FEED: INFINITE", kv: ["PEERS OBSERVED", "VALIDATION", "SELF-WORTH"], curve: "SOCIAL COMPARISON // 24H", curveR: "PEAK 23:00 · SLEEP DEFERRED", foot: "OBSERVE. COMPARE. COMPLY." } }
}
function mergeDeep(a, b) { const o = Array.isArray(a) ? a.slice() : Object.assign({}, a); for (const k in (b || {})) o[k] = (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a && typeof a[k] === "object") ? mergeDeep(a[k], b[k]) : b[k]; return o }
const C = mergeDeep(DEFAULT_COPY, T.C || {})
const CODE = (k, n) => `${((T.codes || {})[k] || (k === "youtube" ? "VID" : "OBS")).slice(0, 5)}-${n}`
// ---------- ported widgets (solar, audio, feeds) ----------
const INK_SOFT = SOFT
const LAV = new Color(T.altBg)
function family() { return fam() }
function baseC(W, H, code, right, headColor) { return base(code, right, !!headColor) }
function label(stack, text, size, color) { return txt(stack, text, size, color) }
function serifText(stack, text, size, lines) { const t = stack.addText(String(text)); t.font = disp(size); t.textColor = INK; t.lineLimit = lines || 1; t.minimumScaleFactor = 0.6; return t }
function addBar(stack, width, frac) { const i = stack.addImage(bar(width, frac)); i.imageSize = new Size(width, 4) }
const timeFmt = tf
function readoutC(row, title, value, vsize) { const c = row.addStack(); c.layoutVertically(); txt(c, title, 6.5, SOFT); c.addSpacer(1); txt(c, value, vsize || 8.5); return c }
const LT = Object.assign({ solar: "W-03 // SOLAR", solarBig: "W-03 // SOLAR + ATMOS", audio: "W-04 // AUDIO CHANNEL", feeds: "W-06 // NEURAL LINK", vid: "W-06 // VID", obs: "W-07 // OBS", dc: "W-09 // SYNC" }, T.L)
// ---------- atmospheric helpers ----------
function uvLevel(u) { return u < 3 ? "LOW" : u < 6 ? "MOD" : u < 8 ? "HIGH" : u < 11 ? "V.HIGH" : "EXTREME" }
function compass(deg) { const d = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]; return d[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16] }
const num = (v) => (typeof v === "number" && isFinite(v)) ? v : null

function precipChart(probs, W, H) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const n = Math.max(1, probs.length), gap = 3
  const bw = (W - gap * (n - 1)) / n
  const half = new Path()
  for (let x = 0; x < W; x += 6) { half.move(new Point(x, H / 2)); half.addLine(new Point(x + 3, H / 2)) }
  dc.addPath(half)
  dc.setStrokeColor(new Color(T.ink, 0.3))
  dc.setLineWidth(0.8)
  dc.strokePath()
  probs.forEach((p, i) => {
    const v = Math.max(0, Math.min(100, p || 0)) / 100
    const h = Math.max(1.5, (H - 1) * v)
    dc.setFillColor(new Color(T.ink, v > 0.5 ? 1 : 0.55))
    dc.fillRect(new Rect(i * (bw + gap), H - h, bw, h))
  })
  const base = new Path()
  base.move(new Point(0, H - 0.5))
  base.addLine(new Point(W, H - 0.5))
  dc.addPath(base)
  dc.setStrokeColor(INK)
  dc.setLineWidth(1)
  dc.strokePath()
  return dc.getImage()
}

function cell(row, title, value, width) {
  const c = row.addStack()
  c.layoutVertically()
  c.size = new Size(width, 0)
  label(c, title, 7, INK_SOFT)
  c.addSpacer(1)
  serifText(c, value, 16)
}

// ---------- W-03 SOLAR ----------
function solarArc(frac, W, H, ticks) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const big = W > 200
  const lw = big ? 1.4 : 1
  const cx = W / 2, cy = H - 8, rx = W / 2 - 8, ry = H - (big ? 22 : 14)
  const r = rx
  const at = (t) => new Point(cx - rx + 2 * rx * t, cy - ry * (1 - Math.pow(Math.abs(2 * t - 1), 2.2)))
  const full = []
  for (let i = 0; i <= 90; i++) full.push(at(i / 90))
  const arc = new Path()
  arc.addLines(full)
  dc.addPath(arc)
  dc.setStrokeColor(new Color(T.ink, 0.35))
  dc.setLineWidth(lw)
  dc.strokePath()
  const f = Math.min(1, Math.max(0, frac))
  if (f > 0) {
    const done = []
    const n = Math.max(2, Math.round(90 * f))
    for (let i = 0; i <= n; i++) done.push(at(f * i / n))
    const dp = new Path()
    dp.addLines(done)
    dc.addPath(dp)
    dc.setStrokeColor(INK)
    dc.setLineWidth(lw * 1.8)
    dc.strokePath()
  }
  const horizon = new Path()
  horizon.move(new Point(0, cy))
  horizon.addLine(new Point(W, cy))
  dc.addPath(horizon)
  dc.setStrokeColor(INK)
  dc.setLineWidth(lw)
  dc.strokePath()
  const ends = new Path()
  ends.move(new Point(cx - r, cy - (big ? 8 : 5))); ends.addLine(new Point(cx - r, cy + (big ? 8 : 5)))
  ends.move(new Point(cx + r, cy - (big ? 8 : 5))); ends.addLine(new Point(cx + r, cy + (big ? 8 : 5)))
  dc.addPath(ends)
  dc.setStrokeColor(INK)
  dc.setLineWidth(lw * 1.4)
  dc.strokePath()
  const tk = new Path()
  ticks.forEach(t => {
    const x = cx - rx + 2 * rx * t
    tk.move(new Point(x, cy))
    tk.addLine(new Point(x, cy + (big ? 6 : 4)))
  })
  dc.addPath(tk)
  dc.setStrokeColor(INK)
  dc.setLineWidth(lw)
  dc.strokePath()
  const sun = at(f)
  const s = big ? 14 : 8
  dc.setFillColor(INK)
  dc.fillRect(new Rect(sun.x - s / 2, sun.y - s / 2, s, s))
  if (big) {
    dc.setStrokeColor(INK)
    dc.setLineWidth(1)
    dc.strokeRect(new Rect(sun.x - s, sun.y - s, s * 2, s * 2))
  }
  return dc.getImage()
}

async function solarWidget() {
  if (THEMED()) return themedSolar(THEMED())
  const fam = family()
  const big = fam === "large", wide = fam !== "small"
  const w = baseC(170, 170, big ? LT.solarBig : LT.solar, big ? "ARRAY ONLINE" : (wide ? "PHOTOPERIOD" : null))
  const b = body(w, wide ? [10, 14, 10, 14] : [8, 12, 10, 12])
  let rise = null, set = null, atm = null
  try {
    const c = await coords()
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&daily=sunrise,sunset&timezone=auto&forecast_days=1`
    const j = await new Request(url).loadJSON()
    rise = new Date(j.daily.sunrise[0])
    set = new Date(j.daily.sunset[0])
    if (big) {
      try {
        const u2 = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=relative_humidity_2m,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code&hourly=precipitation_probability,visibility,uv_index,dew_point_2m&forecast_hours=12&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=mph`
        const k = await new Request(u2).loadJSON()
        const hr = k.hourly || {}
        const first = (a) => (a && a.length) ? a[0] : null
        atm = { cur: Object.assign({}, k.current || {}, { visibility: first(hr.visibility), uv_index: first(hr.uv_index), dew_point_2m: first(hr.dew_point_2m) }), probs: hr.precipitation_probability || [] }
      } catch (e) {}
    }
  } catch (e) {}
  if (!rise || !set) {
    label(b, C.solar.label, 8, INK_SOFT)
    b.addSpacer(4)
    serifText(b, C.solar.offline, 20)
    b.addSpacer()
    return w
  }
  const now = new Date()
  const span = set - rise
  const frac = (now - rise) / span
  const up = frac > 0 && frac < 1
  const pct = up ? Math.round((1 - frac) * 100) : 0
  const ticks = []
  const h0 = new Date(rise); h0.setMinutes(0, 0, 0); h0.setHours(h0.getHours() + 1)
  for (let t = h0; t < set; t = new Date(t.getTime() + 3600000)) ticks.push((t - rise) / span)

  const top = b.addStack()
  top.layoutHorizontally()
  top.bottomAlignContent()
  const left = top.addStack()
  left.layoutVertically()
  label(left, up ? C.solar.day : C.solar.night, big ? 9 : 8, INK_SOFT)
  left.addSpacer(2)
  serifText(left, `${pct}%`, big ? 44 : (wide ? 30 : 26))
  if (wide) {
    top.addSpacer()
    const right = top.addStack()
    right.layoutVertically()
    label(right, up ? C.solar.setIn : C.solar.riseIn, big ? 9 : 8, INK_SOFT)
    right.addSpacer(2)
    let target = up ? set : rise
    if (!up && now > set) target = new Date(rise.getTime() + 86400000)
    const d = right.addDate(target)
    d.applyTimerStyle()
    d.font = disp(big ? 24 : 18)
    d.textColor = INK
    d.lineLimit = 1
    d.rightAlignText()
  }
  if (big) {
    b.addSpacer(8)
    const cur = (atm && atm.cur) || {}
    const probs = (atm && atm.probs) || []
    const pmax = probs.length ? Math.max(...probs.map(v => v || 0)) : null
    const rh = num(cur.relative_humidity_2m), dew = num(cur.dew_point_2m), uv = num(cur.uv_index)
    const vis = num(cur.visibility), ws = num(cur.wind_speed_10m), wd = num(cur.wind_direction_10m)
    const fog = (cur.weather_code === 45 || cur.weather_code === 48) || (vis !== null && vis < 1000)
    const miles = vis === null ? null : vis / 1609.34
    const visTxt = miles === null ? "--" : (fog ? "FOG " : "") + (miles < 10 ? miles.toFixed(1) : Math.round(miles)) + " mi"
    const cw = 108
    const r1 = b.addStack(); r1.layoutHorizontally()
    cell(r1, "PRECIP // 12H MAX", pmax === null ? "--" : `${pmax}%`, cw); r1.addSpacer()
    cell(r1, "MOISTURE // RH", rh === null ? "--" : `${Math.round(rh)}%`, cw); r1.addSpacer()
    cell(r1, "UV INDEX", uv === null ? "--" : `${Math.round(uv)} ${uvLevel(uv)}`, cw)
    b.addSpacer(6)
    const r2 = b.addStack(); r2.layoutHorizontally()
    cell(r2, fog ? "VISIBILITY // FOG" : "VISIBILITY", visTxt, cw); r2.addSpacer()
    cell(r2, "DEW POINT", dew === null ? "--" : `${Math.round(dew)}°`, cw); r2.addSpacer()
    cell(r2, "WIND VECTOR", ws === null ? "--" : `${Math.round(ws)} ${wd === null ? "" : compass(wd)}`, cw)
    b.addSpacer(8)
    const ph = b.addStack(); ph.layoutHorizontally()
    label(ph, "PRECIP PROBABILITY // NEXT 12H", 7, INK_SOFT)
    ph.addSpacer()
    const pr = num(cur.pressure_msl), cc = num(cur.cloud_cover)
    label(ph, `${pr === null ? "--" : Math.round(pr)} HPA · CLD ${cc === null ? "--" : Math.round(cc)}%`, 7, INK_SOFT)
    b.addSpacer(3)
    const pc = b.addImage(precipChart(probs.length ? probs : new Array(12).fill(0), 336, 22))
    pc.imageSize = new Size(336, 22)
  }
  b.addSpacer()
  const aw = wide ? 336 : 146, ah = big ? 122 : (wide ? 62 : 62)
  const img = b.addImage(solarArc(up ? frac : (frac >= 1 ? 1 : 0), aw, ah, ticks))
  img.imageSize = new Size(aw, ah)
  b.addSpacer(4)
  const row = b.addStack()
  row.layoutHorizontally()
  const fs = big ? 9 : 7
  label(row, `RISE ${timeFmt.string(rise)}`, fs)
  row.addSpacer()
  if (big) {
    const mins = Math.round(span / 60000)
    label(row, `DAY ${Math.floor(mins / 60)}H ${String(mins % 60).padStart(2, "0")}M`, fs, INK_SOFT)
    row.addSpacer()
  }
  label(row, `SET ${timeFmt.string(set)}`, fs)
  return w
}

// ---------- W-04 AUDIO (YouTube Music launcher) ----------
const AUDIO_LINES = C.audio.lines

function waveform(W, H) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const seed = Math.floor(Date.now() / 900000)
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  for (let x = 0, i = 0; x < W; x += 4, i++) {
    const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.11 + seed))
    const h = Math.max(2, H * env * (0.3 + 0.7 * rnd()))
    dc.setFillColor(new Color(T.ink, i % 9 === 0 ? 1 : 0.75))
    dc.fillRect(new Rect(x, (H - h) / 2, 2, h))
  }
  return dc.getImage()
}

function playGlyph(size) {
  const dc = new DrawContext()
  dc.size = new Size(size, size)
  dc.opaque = false
  dc.respectScreenScale = true
  dc.setStrokeColor(INK)
  dc.setLineWidth(1.5)
  dc.strokeRect(new Rect(1, 1, size - 2, size - 2))
  const p = new Path()
  p.addLines([new Point(size * 0.36, size * 0.27), new Point(size * 0.74, size * 0.5), new Point(size * 0.36, size * 0.73)])
  p.closeSubpath()
  dc.addPath(p)
  dc.setFillColor(INK)
  dc.fillPath()
  return dc.getImage()
}

// ---------- W-04 AUDIO: a distinct instrument for each theme ----------
const aP = (x, y) => new Point(x, y)
function aDC(W, H) { const d = new DrawContext(); d.size = new Size(W, H); d.opaque = false; d.respectScreenScale = true; return d }
function aPoly(d, pts, fill, stroke, w) { const p = new Path(); p.addLines(pts.map(q => aP(q[0], q[1]))); p.closeSubpath(); if (fill) { d.addPath(p); d.setFillColor(fill); d.fillPath() } if (stroke) { d.addPath(p); d.setStrokeColor(stroke); d.setLineWidth(w || 1); d.strokePath() } }
function aLine(d, pts, col, w) { const p = new Path(); p.addLines(pts.map(q => aP(q[0], q[1]))); d.addPath(p); d.setStrokeColor(col); d.setLineWidth(w || 1); d.strokePath() }
const aSeed = (k) => { let s = (Math.floor(Date.now() / 900000) * 131 + k * 977) % 233280; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
const audioLine = () => AUDIO_LINES[Math.floor(Date.now() / 1800000) % AUDIO_LINES.length]
function audioFooter(b, left, right, size) {
  const foot = b.addStack(); foot.layoutHorizontally(); foot.centerAlignContent()
  txt(foot, left, size || 8)
  const live = foot.addDate(new Date()); live.applyTimerStyle(); live.font = mono(size || 8); live.textColor = INK
  foot.addSpacer(); txt(foot, right, size || 8, INK_SOFT)
}

// Directive Zero: emergency broadcast panel with a seven-segment frequency and a hex VU meter
function sevenSeg(text, H, col, dim) {
  const cw = H * 0.56, gap = H * 0.12, W = Math.ceil(text.split("").reduce((s, ch) => s + (ch === "." ? H * 0.22 : cw + gap), 0))
  const d = aDC(W, H), t = H * 0.12, segs = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd" }
  let x = 0
  for (const ch of text) {
    if (ch === ".") { d.setFillColor(col); d.fillRect(new Rect(x, H - t, t, t)); x += H * 0.22; continue }
    const on = segs[ch] || "", w = cw, h2 = H / 2
    const S = { a: [[x + t, 0], [x + w - t, 0], [x + w - t * 1.6, t], [x + t * 1.6, t]], d: [[x + t * 1.6, H - t], [x + w - t * 1.6, H - t], [x + w - t, H], [x + t, H]],
      g: [[x + t, h2 - t / 2], [x + w - t, h2 - t / 2], [x + w - t * 1.4, h2 + t / 2], [x + t * 1.4, h2 + t / 2]],
      f: [[x, t * 0.6], [x + t, t * 1.4], [x + t, h2 - t * 0.8], [x, h2 - t * 0.2]], e: [[x, h2 + t * 0.2], [x + t, h2 + t * 0.8], [x + t, H - t * 1.4], [x, H - t * 0.6]],
      b: [[x + w, t * 0.6], [x + w - t, t * 1.4], [x + w - t, h2 - t * 0.8], [x + w, h2 - t * 0.2]], c: [[x + w, h2 + t * 0.2], [x + w - t, h2 + t * 0.8], [x + w - t, H - t * 1.4], [x + w, H - t * 0.6]] }
    for (const k of "abcdefg") aPoly(d, S[k], on.includes(k) ? col : dim)
    x += cw + gap
  }
  return { img: d.getImage(), w: W }
}
function hexVU(W, H, lit, n) {
  const d = aDC(W, H), r = H / 2, step = r * 1.9, cnt = n || Math.floor(W / step)
  for (let i = 0; i < cnt; i++) { const cx = r + i * step, cy = H / 2, on = i < lit; const pts = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; pts.push([cx + r * 0.92 * Math.cos(a), cy + r * 0.92 * Math.sin(a)]) } aPoly(d, pts, on ? (i >= cnt - 3 ? new Color(T.headBg) : new Color(T.accent)) : new Color(T.ink, 0.12), new Color(T.ink, 0.35), 0.6) }
  return d.getImage()
}
function dialStrip(W, H, freq) {
  const d = aDC(W, H), ink = new Color(T.ink, 0.6)
  aLine(d, [[0, H - 4], [W, H - 4]], ink, 0.8)
  for (let f = 88; f <= 108; f += 0.5) { const x = (f - 88) / 20 * (W - 2) + 1, big2 = f % 4 === 0; aLine(d, [[x, H - 4], [x, H - (big2 ? 11 : f % 1 === 0 ? 8 : 6)]], ink, big2 ? 1 : 0.6); if (big2) { d.setFont(Font.mediumMonospacedSystemFont(6)); d.setTextColor(new Color(T.ink, 0.7)); d.setTextAlignedLeft(); d.drawTextInRect(String(f), new Rect(x + 2, 0, 24, 8)) } }
  const px = (freq - 88) / 20 * (W - 2) + 1; aPoly(d, [[px - 4, 0], [px + 4, 0], [px, 6]], new Color(T.headBg)); aLine(d, [[px, 4], [px, H]], new Color(T.headBg), 1.4)
  return d.getImage()
}
async function audioDirective(w, small) {
  const r = aSeed(1), freq = (88 + Math.floor(r() * 200) / 10).toFixed(1)
  const b = body(w, small ? [8, 12, 8, 12] : [9, 16, 9, 16])
  const top = b.addStack(); top.layoutHorizontally(); top.topAlignContent()
  const left = top.addStack(); left.layoutVertically()
  const seg = sevenSeg(freq, small ? 30 : 42, new Color(T.headBg), new Color(T.ink, 0.08))
  const si = left.addImage(seg.img); si.imageSize = new Size(seg.w, small ? 30 : 42)
  const lr = left.addStack(); lr.layoutHorizontally(); lr.centerAlignContent(); txt(lr, "MHZ  ", small ? 7 : 8, INK_SOFT)
  const onair = lr.addStack(); onair.setPadding(1, 4, 1, 4); onair.backgroundColor = new Color(T.headBg); txt(onair, "ON AIR", small ? 7 : 8, new Color(T.headText))
  if (!small) {
    top.addSpacer(14)
    const col = top.addStack(); col.layoutVertically()
    txt(col, "EMERGENCY BROADCAST SYSTEM", 8, INK_SOFT); col.addSpacer(2)
    const ln = col.addText(audioLine()); ln.font = disp(19); ln.textColor = INK; ln.lineLimit = 2; ln.minimumScaleFactor = 0.7
  }
  b.addSpacer()
  if (!small) { const ds = b.addImage(dialStrip(332, 18, +freq)); ds.imageSize = new Size(332, 18); b.addSpacer(4) }
  const lvl = 6 + Math.floor(r() * 9)
  const vu = b.addImage(hexVU(small ? 146 : 332, small ? 10 : 14, lvl)); vu.imageSize = new Size(small ? 146 : 332, small ? 10 : 14)
  b.addSpacer(small ? 3 : 5)
  if (small) txt(b, audioLine(), 8, INK)
  else audioFooter(b, C.audio.tap, C.audio.foot)
  return w
}

// The Long Road: an ink lute and a bar of music on a ballad sheet
function luteImg(S) {
  const d = aDC(S * 0.62, S), ink = new Color(T.ink), cx = S * 0.31
  d.setFillColor(new Color(T.panel)); d.fillEllipse(new Rect(cx - S * 0.27, S * 0.42, S * 0.54, S * 0.56))
  d.setStrokeColor(ink); d.setLineWidth(1.4); d.strokeEllipse(new Rect(cx - S * 0.27, S * 0.42, S * 0.54, S * 0.56))
  d.setLineWidth(0.8); d.strokeEllipse(new Rect(cx - S * 0.08, S * 0.58, S * 0.16, S * 0.16))
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; aLine(d, [[cx + Math.cos(a) * S * 0.03, S * 0.66 + Math.sin(a) * S * 0.03], [cx + Math.cos(a) * S * 0.075, S * 0.66 + Math.sin(a) * S * 0.075]], ink, 0.6) }
  aPoly(d, [[cx - S * 0.045, S * 0.44], [cx + S * 0.045, S * 0.44], [cx + S * 0.035, S * 0.12], [cx - S * 0.035, S * 0.12]], new Color(T.panel), ink, 1)
  aPoly(d, [[cx - S * 0.05, S * 0.12], [cx + S * 0.05, S * 0.12], [cx + S * 0.09, 0], [cx - S * 0.01, S * 0.01]], ink)
  for (let k = -1; k <= 1; k++) aLine(d, [[cx + k * S * 0.016, S * 0.12], [cx + k * S * 0.03, S * 0.88]], new Color(T.ink, 0.7), 0.5)
  aLine(d, [[cx - S * 0.1, S * 0.86], [cx + S * 0.1, S * 0.86]], ink, 1.2)
  return d.getImage()
}
function staffImg(W, H, r) {
  const d = aDC(W, H), ink = new Color(T.ink), gap = H / 6, y0 = gap
  for (let k = 0; k < 5; k++) aLine(d, [[0, y0 + k * gap], [W, y0 + k * gap]], new Color(T.ink, 0.55), 0.6)
  const clef = new Path(); clef.move(aP(8, y0 + gap * 4.6)); clef.addQuadCurve(aP(4, y0 + gap * 2), aP(14, y0 + gap * 3.6)); clef.addQuadCurve(aP(10, y0 - gap * 0.6), aP(2, y0 + gap * 0.6)); d.addPath(clef); d.setStrokeColor(ink); d.setLineWidth(1.2); d.strokePath()
  for (let i = 0; i < 9; i++) {
    const x = 26 + i * (W - 34) / 9, step = Math.floor(r() * 8), y = y0 + gap * 4 - step * gap / 2
    d.setFillColor(i % 4 === 3 ? new Color(T.headBg) : ink); d.fillEllipse(new Rect(x - gap * 0.65, y - gap * 0.45, gap * 1.3, gap * 0.9))
    aLine(d, [[x + gap * 0.6, y], [x + gap * 0.6, y - gap * 3]], ink, 0.8)
    if (i % 3 === 0) aLine(d, [[x + gap * 0.6, y - gap * 3], [x + gap * 1.4, y - gap * 2.2]], ink, 0.8)
  }
  aLine(d, [[W - 1, y0], [W - 1, y0 + gap * 4]], ink, 1)
  return d.getImage()
}
async function audioLongroad(w, small) {
  const r = aSeed(2)
  const b = body(w, small ? [8, 14, 8, 14] : [9, 20, 9, 20])
  const row = b.addStack(); row.layoutHorizontally(); row.topAlignContent()
  const L = row.addImage(luteImg(small ? 64 : 92)); L.imageSize = new Size((small ? 64 : 92) * 0.62, small ? 64 : 92)
  row.addSpacer(small ? 8 : 14)
  const col = row.addStack(); col.layoutVertically()
  txt(col, small ? "A BALLAD" : "A BALLAD, SUNG AT THE INN", small ? 7 : 8, INK_SOFT); col.addSpacer(2)
  const ln = col.addText(audioLine()); ln.font = disp(small ? 13 : 18); ln.textColor = INK; ln.lineLimit = 2; ln.minimumScaleFactor = 0.7
  if (!small) {
    col.addSpacer(2); txt(col, `VERSE ${["I", "II", "III", "IV", "V", "VI"][Math.floor(r() * 6)]} OF IX · ${C.audio.metric} ${"♪".repeat(1 + Math.floor(r() * 4))}`, 7.5, new Color(T.headBg))
    col.addSpacer(6); const st = col.addImage(staffImg(226, 30, r)); st.imageSize = new Size(226, 30)
  }
  b.addSpacer()
  if (!small) audioFooter(b, C.audio.tap, C.audio.foot)
  return w
}

// Nightfall: squad radio net with a radial voice ring and per-trooper voice meters
function commRing(S, r) {
  const d = aDC(S, S), cx = S / 2, ink = new Color(T.ink)
  ;[0.46, 0.34].forEach((f, i) => { d.setStrokeColor(new Color(T.ink, i ? 0.35 : 0.8)); d.setLineWidth(i ? 0.8 : 1.4); d.strokeEllipse(new Rect(cx - S * f, cx - S * f, S * f * 2, S * f * 2)) })
  const pts = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2, amp = (0.5 + r()) * S * 0.06 * (1 + Math.sin(i * 0.9)); pts.push([cx + (S * 0.26 + amp) * Math.cos(a), cx + (S * 0.26 + amp) * Math.sin(a)]) }
  aLine(d, pts, ink, 1.1)
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, l = k % 6 === 0 ? 6 : 3; aLine(d, [[cx + S * 0.46 * Math.cos(a), cx + S * 0.46 * Math.sin(a)], [cx + (S * 0.46 - l) * Math.cos(a), cx + (S * 0.46 - l) * Math.sin(a)]], new Color(T.ink, 0.7), 0.8) }
  d.setFont(Font.boldMonospacedSystemFont(S * 0.13)); d.setTextColor(ink); d.setTextAlignedCenter(); d.drawTextInRect("CH 08", new Rect(0, cx - S * 0.08, S, S * 0.2))
  d.setFillColor(new Color(T.accent)); d.fillEllipse(new Rect(cx - 3, S * 0.06, 6, 6))
  return d.getImage()
}
async function audioNightfall(w, small) {
  const r = aSeed(3)
  const b = body(w, small ? [8, 12, 8, 12] : [9, 16, 9, 16])
  const row = b.addStack(); row.layoutHorizontally(); row.topAlignContent()
  const S = small ? 62 : 86, ri = row.addImage(commRing(S, r)); ri.imageSize = new Size(S, S)
  if (small) { b.addSpacer(); txt(b, audioLine(), 8, INK); return w }
  row.addSpacer(14)
  const col = row.addStack(); col.layoutVertically()
  txt(col, C.audio.src, 8, INK_SOFT); col.addSpacer(1)
  const ln = col.addText(audioLine()); ln.font = disp(16); ln.textColor = INK; ln.lineLimit = 1; ln.minimumScaleFactor = 0.7
  col.addSpacer(4)
  const talker = Math.floor(r() * 4)
  ;["ALPHA-1", "ALPHA-2", "BRAVO-3", "YOU"].forEach((nm, i) => {
    const s = col.addStack(); s.layoutHorizontally(); s.centerAlignContent()
    const l = s.addStack(); l.size = new Size(60, 10); txt(l, nm, 7.5, i === talker ? INK : INK_SOFT); l.addSpacer()
    const lv = i === talker ? 0.7 + r() * 0.3 : r() * 0.3
    const m = s.addImage(bar(120, lv)); m.imageSize = new Size(120, 4)
    s.addSpacer(6); txt(s, i === talker ? "TX" : "··", 7.5, i === talker ? new Color(T.accent) : INK_SOFT)
    col.addSpacer(2)
  })
  b.addSpacer()
  audioFooter(b, C.audio.tap, C.audio.foot)
  return w
}

// Grimoire: a rune circle with notes in orbit and a golden melody ribbon
function runeCircle(S, r) {
  const d = aDC(S, S), cx = S / 2, gold = new Color(T.accent), ink = new Color(T.ink)
  ;[0.46, 0.36].forEach((f, i) => { d.setStrokeColor(new Color(T.accent, i ? 0.6 : 1)); d.setLineWidth(i ? 0.8 : 1.2); d.strokeEllipse(new Rect(cx - S * f, cx - S * f, S * f * 2, S * f * 2)) })
  const RUNES = [[[0, -1], [0, 1], [0.6, -0.4]], [[-0.5, -1], [0.5, 1], [-0.5, 1]], [[0, -1], [0, 1], [-0.6, 0], [0.6, 0]], [[-0.5, 1], [0, -1], [0.5, 1]], [[-0.5, -1], [0.5, 0], [-0.5, 1]], [[0, -1], [0.5, -0.3], [0, 0.4], [0.5, 1]], [[-0.5, 0], [0.5, 0], [0, -1], [0, 1]], [[-0.5, -1], [0, 1], [0.5, -1]]]
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 - Math.PI / 2, rx = cx + S * 0.41 * Math.cos(a), ry = cx + S * 0.41 * Math.sin(a), s = S * 0.035; aLine(d, RUNES[k].map(([u, v]) => [rx + u * s, ry + v * s]), gold, 1) }
  const n = 5, pts = []; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i * 2 % n) * Math.PI * 2 / n; pts.push([cx + S * 0.28 * Math.cos(a), cx + S * 0.28 * Math.sin(a)]) }
  aLine(d, pts.concat([pts[0]]), new Color(T.accent, 0.8), 1)
  const ph = r() * 6.28
  for (let k = 0; k < 3; k++) { const a = ph + k * 2.1, nx = cx + S * 0.2 * Math.cos(a), ny = cx + S * 0.2 * Math.sin(a); d.setFillColor(ink); d.fillEllipse(new Rect(nx - 3, ny, 6, 4.5)); aLine(d, [[nx + 2.6, ny + 2], [nx + 2.6, ny - 7]], ink, 1) }
  d.setFillColor(new Color(T.altBg)); d.fillEllipse(new Rect(cx - 5, cx - 5, 10, 10))
  return d.getImage()
}
function ribbon(W, H, r) {
  const d = aDC(W, H), gold = new Color(T.accent), ph = r() * 6
  for (let k = 0; k < 2; k++) { const pts = []; for (let x = 0; x <= W; x += 2) pts.push([x, H / 2 + Math.sin(x * 0.06 + ph + k * 1.4) * H * 0.32]); aLine(d, pts, new Color(T.accent, k ? 0.45 : 1), k ? 0.8 : 1.3) }
  for (let i = 0; i < 6; i++) { const x = 20 + i * (W - 40) / 5, y = H / 2 + Math.sin(x * 0.06 + ph) * H * 0.32; aPoly(d, [[x, y - 4], [x + 1.2, y - 1.2], [x + 4, y], [x + 1.2, y + 1.2], [x, y + 4], [x - 1.2, y + 1.2], [x - 4, y], [x - 1.2, y - 1.2]], gold) }
  return d.getImage()
}
async function audioGrimoire(w, small) {
  const r = aSeed(4)
  const b = body(w, small ? [9, 14, 9, 14] : [10, 18, 10, 18])
  const row = b.addStack(); row.layoutHorizontally(); row.topAlignContent()
  const S = small ? 62 : 84, ri = row.addImage(runeCircle(S, r)); ri.imageSize = new Size(S, S)
  if (small) { b.addSpacer(); txt(b, audioLine(), 8, INK); return w }
  row.addSpacer(14)
  const col = row.addStack(); col.layoutVertically()
  txt(col, C.audio.src, 8, INK_SOFT); col.addSpacer(2)
  const ln = col.addText(audioLine()); ln.font = disp(18); ln.textColor = INK; ln.lineLimit = 2; ln.minimumScaleFactor = 0.7
  col.addSpacer(3)
  const lv = 2 + Math.floor(r() * 4); txt(col, `BOUND TO THE HOUR · ${C.audio.metric} ${"◆".repeat(lv)}${"◇".repeat(5 - lv)}`, 7.5, new Color(T.accent))
  col.addSpacer(3); const inc = col.addText(["“Lumen vael, sorin ithe.”", "“Ossa mir, cantha lu.”", "“Vel'ara, sing the hour.”", "“Thessa onn, ri vaelith.”"][Math.floor(r() * 4)]); inc.font = disp(10.5); inc.textColor = new Color(T.accent, 0.85); inc.lineLimit = 1
  b.addSpacer()
  const rb = b.addImage(ribbon(324, 16, r)); rb.imageSize = new Size(324, 16)
  b.addSpacer(3)
  audioFooter(b, C.audio.tap, C.audio.foot)
  return w
}

// Deep Range: a spectrum waterfall with a locked carrier band
function waterfall(W, H, r) {
  const d = aDC(W, H), cols = 56, rows = 10, cw = W / cols, ch = H / rows, carrier = 14 + Math.floor(r() * 28)
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const near = Math.max(0, 1 - Math.abs(x - carrier) / 3), v = Math.min(1, r() * 0.35 + near * (0.75 + r() * 0.25))
    const col = v > 0.8 ? new Color(T.headBg) : v > 0.5 ? new Color(T.ink) : v > 0.25 ? new Color(T.altBg) : new Color(T.altBg, 0.35)
    d.setFillColor(col); d.fillRect(new Rect(x * cw + 0.5, y * ch + 0.5, cw - 1, ch - 1))
  }
  aLine(d, [[carrier * cw + cw / 2, 0], [carrier * cw + cw / 2, H]], new Color(T.ink), 1.2)
  return { img: d.getImage(), at: carrier / cols }
}
async function audioDeeprange(w, small) {
  const r = aSeed(5)
  const b = body(w, small ? [8, 12, 8, 12] : [9, 16, 9, 16])
  const wf = waterfall(small ? 146 : 332, small ? 36 : 46, r)
  const wi = b.addImage(wf.img); wi.imageSize = new Size(small ? 146 : 332, small ? 36 : 46)
  if (!small) { const tk = b.addStack(); tk.layoutHorizontally(); ["88.0", "93.0", "98.0", "103.0", "108.0 MHZ"].forEach((l, i) => { txt(tk, l, 6.5, INK_SOFT); if (i < 4) tk.addSpacer() }) }
  b.addSpacer(small ? 4 : 5)
  const row = b.addStack(); row.layoutHorizontally(); row.centerAlignContent()
  const lk = row.addText("CARRIER LOCKED"); lk.font = Font.heavySystemFont(small ? 13 : 20); lk.textColor = INK; lk.minimumScaleFactor = 0.7; lk.lineLimit = 1
  if (!small) { row.addSpacer(); const cc = row.addStack(); cc.layoutVertically(); txt(cc, `${(88 + wf.at * 20).toFixed(1)} MHZ`, 8.5, INK); txt(cc, `SNR ${20 + Math.floor(r() * 20)} DB`, 8.5, INK_SOFT) }
  b.addSpacer(small ? 2 : 3)
  txt(b, audioLine().toUpperCase(), small ? 7 : 8, new Color(T.headBg))
  b.addSpacer()
  if (!small) audioFooter(b, C.audio.tap, C.audio.foot)
  return w
}

async function audioWidget() {
  const f = T.frame || "halcyon", small = fam() === "small"
  if (["rabbit", "cyber", "vapor", "nature", "market"].includes(f) && !small) return themedAudioArt(THEME_PAINT[f].audio)
  if (f !== "halcyon") {
    const w = baseC(364, 170, LT.audio, small ? null : C.audio.right)
    w.url = "youtubemusic://"
    return ({ directive: audioDirective, longroad: audioLongroad, nightfall: audioNightfall, grimoire: audioGrimoire, deeprange: audioDeeprange }[f] || audioDirective)(w, small)
  }
  if (!small) return halcyonAudio()
  const w = baseC(364, 170, LT.audio, C.audio.right)
  w.url = "youtubemusic://"
  const b = body(w, [9, 14, 9, 14])
  const top = b.addStack()
  top.layoutHorizontally()
  top.centerAlignContent()
  const g = top.addImage(playGlyph(44))
  g.imageSize = new Size(44, 44)
  top.addSpacer(14)
  const col = top.addStack()
  col.layoutVertically()
  txt(col, C.audio.src, 9, INK_SOFT)
  col.addSpacer(2)
  const line = AUDIO_LINES[Math.floor(Date.now() / 1800000) % AUDIO_LINES.length]
  txt(col, line, 21, INK, true)
  b.addSpacer()
  const lvl = 1 + (Math.floor(Date.now() / 900000) % 5)
  const row = b.addStack()
  row.layoutHorizontally()
  const cell = (t, v) => { const c = row.addStack(); c.layoutVertically(); txt(c, t, 8, INK_SOFT); c.addSpacer(1); txt(c, v, 10.5) }
  cell("SOURCE", "YT MUSIC"); row.addSpacer()
  cell("BITRATE", "256 KBPS"); row.addSpacer()
  cell("BAND", "20HZ–20KHZ"); row.addSpacer()
  cell(C.audio.metric, "■".repeat(lvl) + "□".repeat(5 - lvl))
  b.addSpacer(6)
  const wv = b.addImage(waveform(336, 20))
  wv.imageSize = new Size(336, 20)
  b.addSpacer(5)
  const foot = b.addStack()
  foot.layoutHorizontally()
  foot.centerAlignContent()
  txt(foot, C.audio.tap, 8.5)
  const live = foot.addDate(new Date())
  live.applyTimerStyle()
  live.font = mono(8.5)
  live.textColor = INK
  foot.addSpacer()
  txt(foot, C.audio.foot, 8.5, INK_SOFT)
  return w
}

// ---------- W-06 FEEDS // NEURAL LINK (YouTube + Instagram launchers) ----------
const CHANNELS = {
  youtube: { code: CODE("youtube", "09"), name: "YOUTUBE", url: "youtube://", line: C.feeds.yt.line, implant: C.feeds.status,
    meters: [[C.feeds.yt.meters[0], 70, 96], [C.feeds.yt.meters[1], 40, 78], [C.feeds.yt.meters[2], 4, 22]] },
  discord: { code: CODE("discord", "11"), name: "DISCORD", url: "discord://", line: "Discord", implant: C.feeds.status, meters: [["ONLINE", 30, 90], ["MENTIONS", 5, 60], ["NOISE", 10, 70]] },
  instagram: { code: CODE("instagram", "10"), name: "INSTAGRAM", url: "instagram://app", line: C.feeds.ig.line, implant: C.feeds.status,
    meters: [[C.feeds.ig.meters[0], 58, 90], [C.feeds.ig.meters[1], 9, 34], [C.feeds.ig.meters[2], 55, 92]] }
}

function seeded(key) {
  let s = Math.floor(Date.now() / 900000) * 31 + key.length * 977
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

function channelGlyph(kind, size) {
  const dc = new DrawContext()
  dc.size = new Size(size, size)
  dc.opaque = false
  dc.respectScreenScale = true
  const u = size / 24
  const R = (x, y, w, h) => new Rect(x * u, y * u, w * u, h * u)
  dc.setStrokeColor(INK)
  dc.setLineWidth(1.2)
  dc.strokeRect(new Rect(0.6, 0.6, size - 1.2, size - 1.2))
  if (kind === "youtube") {
    dc.setFillColor(INK); dc.fillRect(R(3, 6, 18, 12))
    dc.setFillColor(PANEL); dc.fillRect(R(5.6, 8.6, 12.8, 6.8))
    const t = new Path()
    t.addLines([new Point(10.2 * u, 9.6 * u), new Point(14.8 * u, 12 * u), new Point(10.2 * u, 14.4 * u)])
    t.closeSubpath()
    dc.addPath(t); dc.setFillColor(INK); dc.fillPath()
  } else {
    dc.setFillColor(INK); dc.fillRect(R(4, 4, 16, 16))
    dc.setFillColor(PANEL); dc.fillRect(R(6.6, 6.6, 10.8, 10.8))
    dc.setFillColor(INK); dc.fillEllipse(R(8.4, 8.4, 7.2, 7.2))
    dc.setFillColor(PANEL); dc.fillEllipse(R(10.1, 10.1, 3.8, 3.8))
    dc.setFillColor(INK); dc.fillRect(R(14.6, 7.4, 1.6, 1.6))
  }
  return dc.getImage()
}

function segBar(width, frac) {
  const H = 6, n = 10, gap = 1.5
  const dc = new DrawContext()
  dc.size = new Size(width, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const sw = (width - gap * (n - 1)) / n
  const on = Math.round(Math.min(1, Math.max(0, frac)) * n)
  for (let i = 0; i < n; i++) {
    dc.setFillColor(i < on ? (i >= 8 ? ACC : INK) : new Color(T.ink, 0.15))
    dc.fillRect(new Rect(i * (sw + gap), 0, sw, H))
  }
  return dc.getImage()
}

function eeg(W, H, rnd) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const mid = H / 2
  const pts = []
  let spikeAt = 12 + rnd() * 30
  for (let x = 0; x <= W; x += 1.5) {
    let y = mid + Math.sin(x * 0.35) * 1.4 + (rnd() - 0.5) * 3
    if (x >= spikeAt && x < spikeAt + 6) {
      const k = (x - spikeAt) / 6
      y = mid - Math.sin(k * Math.PI) * (H / 2 - 1) * (k < 0.5 ? 1 : -0.55)
      if (x + 1.5 >= spikeAt + 6) spikeAt += 24 + rnd() * 40
    }
    pts.push(new Point(x, Math.max(0.5, Math.min(H - 0.5, y))))
  }
  const base = new Path()
  base.move(new Point(0, mid)); base.addLine(new Point(W, mid))
  dc.addPath(base); dc.setStrokeColor(new Color(T.ink, 0.2)); dc.setLineWidth(0.6); dc.strokePath()
  const p = new Path()
  p.addLines(pts)
  dc.addPath(p); dc.setStrokeColor(INK); dc.setLineWidth(1.1); dc.strokePath()
  return dc.getImage()
}

function meterRow(parent, name, frac, width) {
  const r = parent.addStack()
  r.layoutHorizontally()
  r.centerAlignContent()
  const l = r.addStack()
  l.size = new Size(width < 140 ? 44 : 50, 0)
  label(l, name, 6.5, INK_SOFT)
  r.addSpacer(4)
  const bw = width < 140 ? 52 : 62
  const im = r.addImage(segBar(bw, frac))
  im.imageSize = new Size(bw, 6)
  r.addSpacer()
  label(r, `${Math.round(frac * 100)}%`, 7)
}

function channelPanel(parent, key, compact, width) {
  const ch = CHANNELS[key]
  const rnd = seeded(key)
  const p = parent.addStack()
  p.layoutVertically()
  p.size = new Size(width, 0)
  p.url = ch.url
  const top = p.addStack()
  top.layoutHorizontally()
  top.centerAlignContent()
  const gs = compact ? 30 : 32
  const g = top.addImage(channelGlyph(key, gs))
  g.imageSize = new Size(gs, gs)
  top.addSpacer(7)
  const t = top.addStack()
  t.layoutVertically()
  label(t, `${ch.code} // ${ch.name}`, 6.5, INK_SOFT)
  t.addSpacer(1)
  serifText(t, ch.line, compact ? 13 : 14, 1)
  label(t, ch.implant, 6, INK_SOFT)
  p.addSpacer(5)
  ch.meters.forEach((m, i) => {
    const v = (m[1] + rnd() * (m[2] - m[1])) / 100
    meterRow(p, m[0], v, width)
    if (i < ch.meters.length - 1) p.addSpacer(3)
  })
  return { rnd }
}

function kv(parent, k, v) {
  const r = parent.addStack()
  r.layoutHorizontally()
  label(r, k, 6.5, INK_SOFT)
  r.addSpacer()
  label(r, v, 7.5)
  return r
}

function scrubber(W, played, buffered) {
  const H = 10
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  dc.setFillColor(new Color(T.ink, 0.15)); dc.fillRect(new Rect(0, 4, W, 3))
  dc.setFillColor(new Color(T.ink, 0.35)); dc.fillRect(new Rect(0, 4, W * buffered, 3))
  dc.setFillColor(INK); dc.fillRect(new Rect(0, 4, W * played, 3))
  dc.setFillColor(LAV); dc.fillRect(new Rect(W * played - 4, 1, 8, 8))
  dc.setStrokeColor(INK); dc.setLineWidth(1); dc.strokeRect(new Rect(W * played - 4, 1, 8, 8))
  return dc.getImage()
}

function retention(W, H, rnd) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const pts = []
  for (let x = 0; x <= W; x += 2) {
    const t = x / W
    let v = 0.25 + 0.7 * Math.exp(-t * 2.6)
    const hook = (x % 42) / 42
    if (hook < 0.12) v += 0.18 * Math.sin(hook / 0.12 * Math.PI)
    v += (rnd() - 0.5) * 0.04
    pts.push(new Point(x, H - 1 - (H - 2) * Math.min(1, v)))
  }
  const fill = new Path()
  fill.addLines([new Point(0, H)].concat(pts).concat([new Point(W, H)]))
  fill.closeSubpath()
  dc.addPath(fill); dc.setFillColor(new Color(T.ink, 0.12)); dc.fillPath()
  const p = new Path(); p.addLines(pts)
  dc.addPath(p); dc.setStrokeColor(INK); dc.setLineWidth(1.2); dc.strokePath()
  const b = new Path(); b.move(new Point(0, H - 0.5)); b.addLine(new Point(W, H - 0.5))
  dc.addPath(b); dc.setLineWidth(1); dc.strokePath()
  return dc.getImage()
}

function comparisonBars(W, H, rnd) {
  const dc = new DrawContext()
  dc.size = new Size(W, H)
  dc.opaque = false
  dc.respectScreenScale = true
  const n = 24, gap = 2, bw = (W - gap * (n - 1)) / n
  const nowH = new Date().getHours()
  for (let i = 0; i < n; i++) {
    const night = Math.exp(-Math.pow((i - 23) / 3.2, 2)) + Math.exp(-Math.pow((i + 1) / 3.2, 2))
    const v = Math.min(1, 0.15 + 0.35 * Math.exp(-Math.pow((i - 13) / 3, 2)) + 0.75 * night + rnd() * 0.15)
    const h = Math.max(2, (H - 1) * v)
    dc.setFillColor(i === nowH ? LAV : new Color(T.ink, v > 0.6 ? 1 : 0.5))
    dc.fillRect(new Rect(i * (bw + gap), H - h, bw, h))
  }
  return dc.getImage()
}

function feedGrid(W, rnd) {
  const n = 9, gap = 3, sz = (W - gap * (n - 1)) / n
  const dc = new DrawContext()
  dc.size = new Size(W, sz + 2)
  dc.opaque = false
  dc.respectScreenScale = true
  const tgt = Math.floor(rnd() * n)
  for (let i = 0; i < n; i++) {
    const x = i * (sz + gap)
    if (i === tgt) { dc.setFillColor(LAV); dc.fillRect(new Rect(x, 1, sz, sz)); dc.setStrokeColor(INK); dc.setLineWidth(1.2); dc.strokeRect(new Rect(x, 1, sz, sz)) }
    else { dc.setFillColor(new Color(T.ink, 0.18 + rnd() * 0.5)); dc.fillRect(new Rect(x, 1, sz, sz)) }
  }
  return dc.getImage()
}


function meterRowWide(parent, name, frac) {
  const r = parent.addStack()
  r.layoutHorizontally()
  r.centerAlignContent()
  const l = r.addStack()
  l.size = new Size(56, 12)
  l.centerAlignContent()
  txt(l, name, 8, INK_SOFT)
  l.addSpacer()
  r.addSpacer(4)
  const im = r.addImage(segBar(48, frac))
  im.imageSize = new Size(48, 7)
  r.addSpacer()
  txt(r, `${Math.round(frac * 100)}%`, 9)
}

function kvWide(parent, k, v) {
  const r = parent.addStack()
  r.layoutHorizontally()
  r.centerAlignContent()
  txt(r, k, 8, INK_SOFT)
  r.addSpacer()
  txt(r, v, 9)
}

function channelPanelWide(parent, key) {
  const ch = CHANNELS[key]
  const rnd = seeded(key)
  const p = parent.addStack()
  p.layoutVertically()
  p.size = new Size(150, 84)
  p.url = ch.url
  const top = p.addStack()
  top.layoutHorizontally()
  top.centerAlignContent()
  const g = top.addImage(channelGlyph(key, 30))
  g.imageSize = new Size(30, 30)
  top.addSpacer(8)
  const t = top.addStack()
  t.layoutVertically()
  txt(t, ch.code, 7.5, INK_SOFT)
  t.addSpacer(1)
  txt(t, ch.line, 15, INK, true)
  p.addSpacer(7)
  ch.meters.forEach((m, i) => {
    const v = (m[1] + rnd() * (m[2] - m[1])) / 100
    meterRowWide(p, m[0], v)
    if (i < ch.meters.length - 1) p.addSpacer(4)
  })
  p.addSpacer()
  return { rnd }
}

function singleWide(key) {
  const yt = key === "youtube"
  const ch = CHANNELS[key]
  const w = baseC(364, 170, yt ? `${LT.vid} · BROADCAST INTAKE` : `${LT.obs} · PEER SURVEILLANCE`,
    yt ? C.feeds.yt.tag : C.feeds.ig.tag, yt ? null : LAV)
  w.url = ch.url
  const b = body(w, [8, 14, 7, 14])
  const row = b.addStack()
  row.layoutHorizontally()
  const { rnd } = channelPanelWide(row, key)
  row.addSpacer()
  const div = row.addStack()
  div.size = new Size(1, 78)
  div.backgroundColor = new Color(T.ink, 0.3)
  row.addSpacer()
  const right = row.addStack()
  right.layoutVertically()
  right.size = new Size(150, 84)
  if (yt) {
    kvWide(right, C.feeds.yt.kv[0], C.feeds.yt.queue); right.addSpacer(5)
    kvWide(right, C.feeds.yt.kv[1], `${(6 + rnd() * 5).toFixed(1)} ${C.feeds.yt.u1 || "SEC"}`); right.addSpacer(5)
    kvWide(right, C.feeds.yt.kv[2], `${C.feeds.yt.u2 || "DEPTH"} ${2 + Math.floor(rnd() * 5)}`)
    right.addSpacer(9)
    const sc = right.addImage(scrubber(150, 0.3 + rnd() * 0.5, 0.92))
    sc.imageSize = new Size(150, 10)
  } else {
    kvWide(right, C.feeds.ig.kv[0], `${120 + Math.floor(rnd() * 300)}`); right.addSpacer(5)
    kvWide(right, C.feeds.ig.kv[1], `${1 + Math.floor(rnd() * 9)} / 400`); right.addSpacer(5)
    kvWide(right, C.feeds.ig.kv[2], `▼ ${6 + Math.floor(rnd() * 20)}%`)
    right.addSpacer(8)
    const fg = right.addImage(feedGrid(150, rnd))
    fg.imageSize = new Size(150, 16)
  }
  right.addSpacer()
  b.addSpacer()
  const lab = b.addStack()
  lab.layoutHorizontally()
  txt(lab, yt ? C.feeds.yt.curve : C.feeds.ig.curve, 7.5, INK_SOFT)
  lab.addSpacer()
  txt(lab, yt ? C.feeds.yt.curveR : C.feeds.ig.curveR, 7.5, INK_SOFT)
  b.addSpacer(2)
  const gimg = b.addImage(yt ? retention(336, 15, rnd) : comparisonBars(336, 15, rnd))
  gimg.imageSize = new Size(336, 15)
  b.addSpacer(3)
  const f = b.addStack()
  f.layoutHorizontally()
  f.centerAlignContent()
  txt(f, "SESSION ", 7.5)
  const lv = f.addDate(new Date()); lv.applyTimerStyle(); lv.font = mono(7.5); lv.textColor = INK
  f.addSpacer()
  txt(f, yt ? C.feeds.yt.foot : C.feeds.ig.foot, 7.5, INK_SOFT)
  return w
}

async function feedsWidget(single) {
  if (THEMED()) return themedFeeds(THEMED(), single)
  if (single || family() === "small") return themedFeeds(HAL, single)
  const fam = family()
  if (single && fam !== "small") return singleWide(single)
  if (fam === "small" || single) {
    const key = single || "youtube"
    const ch = CHANNELS[key]
    const w = baseC(170, 170, key === "youtube" ? LT.vid : LT.obs, C.feeds.linked, key === "youtube" ? null : LAV)
    w.url = ch.url
    const b = body(w, [7, 12, 7, 12])
    const { rnd } = channelPanel(b, key, true, 146)
    b.addSpacer()
    const tr = b.addImage(eeg(146, 14, rnd))
    tr.imageSize = new Size(146, 14)
    b.addSpacer(3)
    const f = b.addStack()
    f.layoutHorizontally()
    f.centerAlignContent()
    label(f, "SESSION ", 6.5, INK_SOFT)
    const lv = f.addDate(new Date()); lv.applyTimerStyle(); lv.font = mono(6.5); lv.textColor = INK
    f.addSpacer()
    label(f, `${30 + Math.floor(rnd() * 25)} HZ`, 6.5, INK_SOFT)
    return w
  }
  const w = baseC(364, 170, LT.feeds, C.feeds.right)
  w.url = CHANNELS.youtube.url
  const b = body(w, [8, 14, 8, 14])
  const row = b.addStack()
  row.layoutHorizontally()
  const a = channelPanel(row, "youtube", false, 156)
  row.addSpacer()
  const div = row.addStack()
  div.size = new Size(1, 80)
  div.backgroundColor = new Color(T.ink, 0.3)
  row.addSpacer()
  channelPanel(row, "instagram", false, 156)
  b.addSpacer()
  const lab = b.addStack()
  lab.layoutHorizontally()
  label(lab, C.feeds.trace, 6.5, INK_SOFT)
  lab.addSpacer()
  label(lab, `${C.feeds.rate || "SPIKE RATE"} ${30 + Math.floor(a.rnd() * 25)} HZ · ${C.feeds.yt.curveR}`, 6.5, INK_SOFT)
  b.addSpacer(2)
  const tr = b.addImage(eeg(336, 16, a.rnd))
  tr.imageSize = new Size(336, 16)
  b.addSpacer(3)
  const f = b.addStack()
  f.layoutHorizontally()
  f.centerAlignContent()
  label(f, C.feeds.tap, 6.5)
  const lv = f.addDate(new Date()); lv.applyTimerStyle(); lv.font = mono(6.5); lv.textColor = INK
  f.addSpacer()
  label(f, C.feeds.foot, 6.5, INK_SOFT)
  return w
}

// ---------- W-08 ODDITY (one playful, useless widget per theme) ----------
const ODD_MS = 30 * 60 * 1000
function oddSeq() {
  const fm = FileManager.local(), p = fm.joinPath(fm.documentsDirectory(), "foundry-oddity.json"), now = Date.now()
  let st = null
  try { if (fm.fileExists(p)) st = JSON.parse(fm.readString(p)) } catch (e) {}
  if (!st || typeof st.seq !== "number") st = { seq: Math.floor(now / ODD_MS), since: now }
  if (now - st.since >= ODD_MS) st = { seq: st.seq + 1, since: now }
  try { fm.writeString(p, JSON.stringify(st)) } catch (e) {}
  return st
}
function oddRnd(seq, salt) { let s = Math.abs(seq * 7919 + salt * 104729) % 233280; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
const pickFrom = (arr, r) => arr[Math.floor(r() * arr.length) % arr.length]
const clockAt = (ms) => { const d = new Date(ms); d.setMinutes(Math.round(d.getMinutes() / 15) * 15, 0, 0); return tf.string(d) }
const HOT = () => new Color(T.headBg)
function meter(width, frac, hot, h) {
  const H = h || 5, dc = new DrawContext(); dc.size = new Size(width, H); dc.opaque = false; dc.respectScreenScale = true
  const n = 14, gap = 2, sw = (width - gap * (n - 1)) / n, on = Math.round(Math.max(0, Math.min(1, frac)) * n)
  for (let i = 0; i < n; i++) { dc.setFillColor(i < on ? (hot && i >= n - 4 ? HOT() : INK) : new Color(T.ink, 0.15)); dc.fillRect(new Rect(i * (sw + gap), 0, sw, H)) }
  return dc.getImage()
}
function spark(width, vals, h) {
  const H = h || 18, dc = new DrawContext(); dc.size = new Size(width, H); dc.opaque = false; dc.respectScreenScale = true
  const mx = Math.max(...vals), mn = Math.min(...vals), pts = vals.map((v, i) => new Point(i / (vals.length - 1) * (width - 4) + 2, H - 3 - (v - mn) / Math.max(0.001, mx - mn) * (H - 6)))
  dc.setFillColor(new Color(T.ink, 0.12)); dc.fillRect(new Rect(0, H - 1, width, 1))
  const p = new Path(); p.addLines(pts); dc.addPath(p); dc.setStrokeColor(INK); dc.setLineWidth(1.3); dc.strokePath()
  pts.forEach((q, i) => { dc.setFillColor(i === pts.length - 1 ? HOT() : INK); dc.fillRect(new Rect(q.x - 1.5, q.y - 1.5, 3, 3)) })
  return dc.getImage()
}
function oddCanvas(S, H) { const dc = new DrawContext(); dc.size = new Size(S, H || S); dc.opaque = false; dc.respectScreenScale = true; return dc }
const oP = (x, y) => new Point(x, y)
function oLine(dc, pts, col, w) { const p = new Path(); p.addLines(pts.map(q => oP(q[0], q[1]))); dc.addPath(p); dc.setStrokeColor(col); dc.setLineWidth(w || 1); dc.strokePath() }
function oPoly(dc, pts, fill, stroke, w) { const p = new Path(); p.addLines(pts.map(q => oP(q[0], q[1]))); p.closeSubpath(); if (fill) { dc.addPath(p); dc.setFillColor(fill); dc.fillPath() } if (stroke) { dc.addPath(p); dc.setStrokeColor(stroke); dc.setLineWidth(w || 1); dc.strokePath() } }
function oCirc(dc, x, y, r, fill, stroke, w) { const rc = new Rect(x - r, y - r, r * 2, r * 2); if (fill) { dc.setFillColor(fill); dc.fillEllipse(rc) } if (stroke) { dc.setStrokeColor(stroke); dc.setLineWidth(w || 1); dc.strokeEllipse(rc) } }
function oText(dc, t, x, y, size, col, w, align) { dc.setFont(Font.boldMonospacedSystemFont(size)); dc.setTextColor(col); if (align === "c") dc.setTextAlignedCenter(); else dc.setTextAlignedLeft(); dc.drawTextInRect(t, new Rect(x, y, w || 60, size * 1.5)); dc.setTextAlignedLeft() }
function blob(dc, cx, cy, rx, ry, r, wob) { const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, q = 1 + (r() - 0.5) * (wob || 0.25); pts.push([cx + Math.cos(a) * rx * q, cy + Math.sin(a) * ry * q]) } return pts }

const ODD = {
  mood: {
    title: "W-08 // MOOD LEASE", right: "TIER III",
    emotions: ["DREAD", "JOY", "NOSTALGIA", "AMBITION", "CALM", "ENVY", "WONDER", "GUILT", "HOPE", "BOREDOM", "AWE", "SPITE"],
    status: ["INCLUDED", "PREMIUM · LOCKED", "TRIAL", "BACKORDERED", "RECALLED", "METERED"],
    upsell: ["Upgrade to Tier IV for unlimited wistfulness.", "Joy is 40% off this weekend only.", "Your grief module is still disabled.", "Bundle calm with focus and save.", "Nostalgia now ships with fewer regrets.", "Refer a friend, receive one free sigh."],
    notice: ["LATE FEE APPLIED TO ONE (1) LAUGH", "AWE THROTTLED DURING PEAK HOURS", "CALM PATCH 2.4 INSTALLED", "YOUR SMILE WARRANTY EXPIRES SOON"]
  },
  eval: {
    title: "W-08 // OPERATOR EVALUATION", right: "PSYCH DIVISION",
    tears: ["WITHIN TOLERANCE", "ELEVATED", "NOT OBSERVED", "SUSPICIOUSLY ABSENT"],
    verdict: ["FIT FOR SORTIE", "REQUIRES TALKING-TO", "RECALIBRATE", "EXEMPLARY (SUSPICIOUS)", "STAND BY", "REVIEW PENDING"],
    notes: ["Subject asked if the sirens were necessary.", "Hesitated at the word 'mandatory'.", "Requested a window. Denied.", "Hummed during the briefing. Noted.", "Scored well. Too well. Monitoring.", "Fell asleep in the simulator. Twice.", "Named the simulator. Discouraged.", "Asked what the drills are for. Logged."]
  },
  omens: {
    title: "W-08 // ROAD OMENS", right: "THE ALMANAC",
    months: ["Frostmoon", "Thawmoon", "Seedmoon", "Rainmoon", "Bloommoon", "Sunmoon", "Haymoon", "Harvestmoon", "Emberfall", "Mistmoon", "Deepfrost", "Yulemoon"],
    omen: [["A goose was seen walking backwards.", "Someone will owe you bread."], ["The kettle sang a minor key.", "Expect a letter you won't enjoy."], ["Three crows, all facing east.", "Leave before noon, or not at all."], ["Bread rose on its own. Twice.", "Good fortune, if you share it."], ["A milestone has gone missing.", "The road is longer than it says."], ["The moon looked slightly embarrassed.", "Keep your plans to yourself."], ["A cat crossed the road, then reconsidered.", "Take the long way. Trust it."], ["Your boots squeaked a warning.", "Mind the bridges today."]],
    roads: ["FAIR", "MIDDLING", "ILL", "MUDDY", "HAUNTED (MILDLY)"],
    pantry: ["3 LOAVES", "1 CHEESE", "NO HONEY", "PLENTY", "2 APPLES"],
    inn: ["4 LEAGUES · NO PIE", "2 LEAGUES · LOUD BARD", "6 LEAGUES · BEST STEW", "1 LEAGUE · SHUT", "3 LEAGUES · GHOST"],
    lucky: ["A SMOOTH STONE", "THE LEFT BOOT FIRST", "A BORROWED SPOON", "WHISTLING", "A RED THREAD", "THE SECOND APPLE"]
  },
  hostile: {
    title: "W-08 // HOSTILE INTEL", right: "FIELD GUIDE",
    units: [
      ["SKITTERER", "SWARM", 1, "LOUD NOISES", "NEAR YOUR FRIDGE", "Stomp twice. Apologize once.", "swarm", "SKITTERS IN SPIRALS"],
      ["BUCKETHEAD", "SHIELD-BEARER", 2, "COMPLIMENTS", "GUARDING A DOOR", "Mention its posture. It lowers the shield.", "shield", "HOLDS GROUND, SULKS"],
      ["THE TALL ONE", "UNKNOWN", 3, "NONE KNOWN", "IN YOUR PERIPHERAL", "Do not make eye contact.", "tall", "STANDS. WAITS."],
      ["DRIFTER", "FLOATER", 1, "OPEN WINDOWS", "CEILING CORNERS", "It just wants to leave. Let it.", "float", "BOBS NEAR VENTS"],
      ["GRUMBLER", "HEAVY", 3, "SNACKS", "AT THE CHOKEPOINT", "Throw a granola bar and walk past.", "heavy", "CHARGES, THEN NAPS"],
      ["WHISPERNECK", "SCOUT", 2, "BRIGHT LIGHTS", "IN THE VENTS", "Turn on every light you own.", "tall", "FLANKS QUIETLY"],
      ["MOSSBACK", "AMBUSHER", 2, "IMPATIENCE", "POSING AS A ROCK", "Wait. It cannot hold still forever.", "heavy", "DOES NOT MOVE"],
      ["PIPSQUEAK", "SWARM", 1, "BEING NOTICED", "UNDER THE TRUCK", "Say its name. It flees in embarrassment.", "swarm", "HIDES, GIGGLES"],
      ["ROOFHOPPER", "SKIRMISHER", 2, "LOW CEILINGS", "ON THE ROOF", "Fight it indoors.", "float", "JUMPS BETWEEN LEDGES"],
      ["DEADLINE", "SIEGE", 4, "FINISHING EARLY", "APPROACHING", "It gets bigger the longer you wait.", "shield", "ADVANCES DAILY"]
    ],
    threat: ["LOW", "MEDIUM", "HIGH", "EXTREME"],
    call: ["AVOID", "ENGAGE", "BEFRIEND", "RUN", "OBSERVE"]
  },
  spell: {
    title: "W-08 // SPELL OF THE HOUR", right: "GRIMOIRE",
    spells: [
      ["Lesser Summon Snack", "CONJURATION", 2, "INSTANT", "Conjures exactly one (1) cracker.", "Crumbs, everywhere.", "ARM'S REACH", "A HUNGRY THOUGHT"],
      ["Banish Monday", "ABJURATION", 7, "1 WEEK", "Monday is removed from this week.", "It returns in seven days.", "THIS CALENDAR", "ONE ALARM CLOCK"],
      ["Ward of Unread Messages", "ABJURATION", 3, "1 HOUR", "Notifications cannot find you.", "They wait. They multiply.", "YOUR POCKET", "A SILENT SWITCH"],
      ["Minor Procrastination", "ENCHANTMENT", 1, "LATER", "The task feels optional.", "The task does not agree.", "SELF", "ONE OPEN TAB"],
      ["Find Lost Sock", "DIVINATION", 4, "1 MINUTE", "Reveals the sock's location.", "It is with the other lost sock.", "ONE HOUSE", "THE REMAINING SOCK"],
      ["Greater Nap", "ENCHANTMENT", 5, "20 MINUTES", "Restores all essence.", "Waking up unsure of the year.", "ONE COUCH", "A WARM BLANKET"],
      ["Summon Parking Space", "CONJURATION", 6, "INSTANT", "A space opens directly ahead.", "It is a compact space.", "ONE BLOCK", "PATIENCE (CONSUMED)"],
      ["Charm Houseplant", "ENCHANTMENT", 2, "1 DAY", "The plant forgives you.", "It still wants water.", "TOUCH", "AN APOLOGY"],
      ["Silence of the Group Chat", "ILLUSION", 4, "UNTIL MORNING", "Everyone goes quiet.", "They were planning a party.", "ONE CHAT", "A MUTED BELL"],
      ["Illusory Productivity", "ILLUSION", 3, "1 MEETING", "You appear deeply busy.", "You are asked to lead the next one.", "ONE ROOM", "A FURROWED BROW"]
    ],
    rarity: ["COMMON", "UNCOMMON", "RARE", "MYTHIC", "CURSED"],
    syl: ["vel", "kar", "ith", "um", "bra", "zor", "eth", "mir", "qua", "lun", "dros", "shai", "ven", "oth", "ra"]
  },
  market: {
    title: "W-08 // BLACK MARKET", right: "DEAL OF THE HOUR",
    items: ["Used Optic Mod (Slightly Haunted)", "Bootleg Memory Chip, 2 TB", "Chrome Arm, Left, Mostly", "Neon Tattoo That Plays Ads", "Ex-Corp Badge, Still Works", "Sleep Patch (Do Not Combine)"],
    sellers: ["@gl1tch", "@kitsune", "@rainwire", "@n30n_m0m", "@v0idkid"],
    cond: ["LIKE NEW", "REFURBISHED", "SALVAGED", "ASK NO QUESTIONS", "STILL WARM"]
  },
  bet: {
    title: "W-08 // LONGSHOT OF THE HOUR", right: "LIVE ODDS",
    qs: ["Will today happen twice?", "Does the void take bets?", "Will you remember this Tuesday in forty years?", "Is tomorrow already priced in?", "Will your reflection blink first?", "Will the color blue be discontinued?", "Will time move sideways this weekend?", "Will the moon admit it was a dream?", "Will the sea forget its name?", "Will gravity ask for something in return?", "Will the clocks agree on anything?", "Will you meet the version of you who stayed?", "Will meaning reprice above 40¢?", "Will an eighth day appear on the calendar?", "Will the horizon hold still for one hour?", "Will silence be louder than expected?", "Will the past reopen to visitors?", "Will you become a rumor in someone else's dream?", "Will the last echo come back?", "Will Sunday refuse to end?", "Will a minute last an hour somewhere near you?", "Will the stars move closer, just once?", "Will your shadow arrive before you?", "Will the fog make a statement?", "Will the universe read your message?", "Will déjà vu happen again?", "Will infinity be revised downward?", "Will the ocean finish its diary?", "Will the present moment ever arrive?", "Will the door you never opened still be waiting?"],
    pos: ["3 YES", "1 NO", "FLAT (RARE)", "40 YES (UNWISE)", "2 NO (HEDGED)", "ALL IN"]
  },
  tip: {
    title: "W-08 // TIP OF THE HOUR", right: "GOOD NEWS",
    tips: ["Sea otters hold hands while they sleep.", "Honey can stay edible for a very long time.", "A group of flamingos is called a flamboyance.", "Octopuses have three hearts.", "Bananas are technically berries.", "Wombat droppings are cube-shaped."]
  },
  mall: {
    title: "W-08 // MALL DIRECTORY", right: "LEVEL 2",
    stores: ["Sunset Video", "Pretzel Paradise", "The Fountain Court", "Laser Tag Galaxy", "Cassette Corner", "Palm Tree Imports"],
    status: ["OPEN FOREVER", "CLOSED SINCE 1997", "ALWAYS ON SALE", "STAFF ON BREAK", "UNDER RENOVATION"],
    tracks: ["Escalator Blues", "Food Court Waltz", "Lost In Aisle 9", "Fountain Dreams"]
  },
  species: {
    title: "W-08 // FIELD GUIDE", right: "SPECIES OF THE HOUR",
    list: [["Red Fox", "Vulpes vulpes", "Its bushy tail helps it balance and keeps it warm."], ["Monarch Butterfly", "Danaus plexippus", "Some migrate thousands of miles to spend winter in Mexico."], ["Great Horned Owl", "Bubo virginianus", "Its 'horns' are only tufts of feathers."], ["Eastern Chipmunk", "Tamias striatus", "Carries food in stretchy cheek pouches."], ["Fly Agaric", "Amanita muscaria", "Beautiful and poisonous. Look, don't touch."], ["Ruby-throated Hummingbird", "Archilochus colubris", "Beats its wings about 50 times a second."]],
    where: ["NEAR YOUR WINDOW", "AT THE FOREST EDGE", "ON A FALLEN LOG", "IN THE TALL GRASS", "BY THE CREEK"]
  },
  heist: {
    title: "W-08 // HEIST BOARD", right: "TONIGHT'S SCORE",
    targets: ["The Gala Necklace", "A Jeweled Egg", "The Seventh Heirloom", "The Ambassador's Ring", "A Crown Nobody Wears", "A Rival's Getaway Car"],
    venues: ["THE GALA · EAST WING", "A PRIVATE VAULT", "THE AUCTION HOUSE", "A MOVING TRAIN", "THE OBSERVATORY", "A RIVAL'S SAFEHOUSE"],
    crews: ["SOLO", "TWO RABBITS", "A WHOLE WARREN", "ONE COPYCAT (UNINVITED)"],
    cards: ["READY", "PRESSED", "PERFUMED", "LAMINATED", "SIGNED"]
  },
  late: {
    title: "W-08 // LATE NOTICE", right: "POCKET WATCH",
    events: ["A Very Important Meeting", "Tea, Promptly At Six", "The Duchess", "Your Own Birthday", "Nothing, Technically", "The Croquet Match"],
    excuses: ["The hole was deeper than expected.", "Stopped to paint the roses red.", "My watch is exactly two days slow.", "Fell asleep in the teapot again.", "A caterpillar asked who I was.", "Took a shortcut through a looking glass."],
    tea: ["COLD", "STEEPING", "SPILLED", "ENDLESS", "MAD"]
  },
  decoder: {
    title: "W-08 // SIGNAL DECODER", right: "DEEP RANGE",
    msgs: [
      ["IS ANYONE GETTING THESE", "BEHIND YOU (UNLIKELY)"], ["PLEASE STOP SENDING POLLS", "RELAY 04"], ["WE FOUND YOUR KEYS", "BUOY 11"],
      ["DO NOT ANSWER THIS", "UNKNOWN"], ["HELLO FROM THE PAST, PROBABLY", "ECHO, 1983"], ["THE COFFEE UP HERE IS WORSE", "STATION K-17"],
      ["COUNT THE STARS AGAIN", "DEEP FIELD"], ["RETURN THE LIBRARY BOOK", "LOCAL AUTHORITIES"], ["WE ARE ALSO LISTENING", "EVERYWHERE"],
      ["SIGNAL TEST. SIGNAL TEST.", "YOU, LAST TUESDAY"]
    ],
    salvage: ["PRICELESS (DISPUTED)", "4 CREDITS", "SENTIMENTAL", "CLASSIFIED", "NONE · KEEP ANYWAY"]
  }
}

// hand-drawn vine flourish with leaves and curls
function vine(W, H, r) {
  const dc = new DrawContext(); dc.size = new Size(W, H); dc.opaque = false; dc.respectScreenScale = true
  const ink = new Color(T.ink, 0.8), mid = H / 2, pts = []
  for (let x = 6; x <= W - 6; x += 2) pts.push(new Point(x, mid + Math.sin(x * 0.09) * H * 0.22))
  const p = new Path(); p.addLines(pts); dc.addPath(p); dc.setStrokeColor(ink); dc.setLineWidth(0.9); dc.strokePath()
  for (let x = 16; x < W - 14; x += 18) {
    const y = mid + Math.sin(x * 0.09) * H * 0.22, up = (x / 18) % 2 < 1 ? -1 : 1
    const leaf = new Path(); leaf.move(new Point(x, y)); leaf.addQuadCurve(new Point(x + 9, y + up * 3), new Point(x + 5, y + up * 7)); leaf.addQuadCurve(new Point(x, y), new Point(x + 6, y + up * 0.5)); leaf.closeSubpath(); dc.addPath(leaf); dc.setFillColor(new Color(T.ink, 0.65)); dc.fillPath()
  }
  ;[[6, -1], [W - 6, 1]].forEach(([x, d]) => { const c = new Path(); c.move(new Point(x, mid)); c.addQuadCurve(new Point(x + d * 5, mid - 3), new Point(x + d * 1, mid - 5)); c.addQuadCurve(new Point(x + d * 2, mid + 1), new Point(x + d * 6, mid + 1)); dc.addPath(c); dc.setStrokeColor(ink); dc.setLineWidth(0.8); dc.strokePath() })
  const dot = (x) => { dc.setFillColor(new Color(T.headBg)); dc.fillEllipse(new Rect(x - 1.6, mid - 1.6, 3.2, 3.2)) }
  dot(W / 2)
  return dc.getImage()
}
// a made-up wayfarer's tongue: same omen, same words every time
function elvish(text, r) {
  const on = ["a", "e", "i", "o", "ae", "ei", "ia", "ui"], cs = ["l", "r", "th", "v", "n", "s", "d", "m", "f", "g", "c", "w"]
  const words = String(text).replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 6)
  return words.map((w0, i) => { let h = 0; for (const ch of w0.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) % 9973; const n = Math.max(1, Math.min(3, Math.round(w0.length / 3))); let out = ""; for (let k = 0; k < n; k++) { out += cs[(h + k * 7) % cs.length] + on[(h + k * 3) % on.length]; } if (h % 4 === 0) out += "n"; if (h % 5 === 0 && i > 0) out = out + "'" + on[h % on.length]; return i === 0 ? out[0].toUpperCase() + out.slice(1) : out }).join(" ") + "."
}

function moonName(d) { const days = (d.valueOf() / 86400000 - 10962.75) % 29.53; const p = ((days % 29.53) + 29.53) % 29.53 / 29.53; return p < 0.03 || p > 0.97 ? "NEW MOON" : p < 0.25 ? "WAXING CRESCENT" : p < 0.28 ? "FIRST QUARTER" : p < 0.47 ? "WAXING GIBBOUS" : p < 0.53 ? "FULL MOON" : p < 0.72 ? "WANING GIBBOUS" : p < 0.78 ? "LAST QUARTER" : "WANING CRESCENT" }
const ordinal = (n) => n + (n % 10 === 1 && n !== 11 ? "ST" : n % 10 === 2 && n !== 12 ? "ND" : n % 10 === 3 && n !== 13 ? "RD" : "TH")

function oddVisual(type, r, S, extra) {
  const dc = oddCanvas(S), cx = S / 2, cy = S / 2, I = INK, A = new Color(T.accent), H = HOT(), L = new Color(T.altBg), F = new Color(T.ink, 0.15)
  if (type === "mood") {
    for (let i = 0; i < 3; i++) oCirc(dc, cx, cy, S * (0.18 + i * 0.12), null, new Color(T.ink, 0.25 + i * 0.15), 1)
    const a = -Math.PI / 2 + extra * Math.PI * 2, pts = []
    for (let k = 0; k <= 40; k++) { const t = -Math.PI / 2 + (a + Math.PI / 2) * k / 40; pts.push([cx + S * 0.42 * Math.cos(t), cy + S * 0.42 * Math.sin(t)]) }
    oLine(dc, pts, A, 4)
    oLine(dc, [[cx - S * 0.14, cy + S * 0.04], [cx - S * 0.05, cy + S * 0.13], [cx + S * 0.05, cy + S * 0.13], [cx + S * 0.14, cy + S * 0.04]], I, 2)
    oCirc(dc, cx - S * 0.1, cy - S * 0.08, 2.4, I); oCirc(dc, cx + S * 0.1, cy - S * 0.08, 2.4, I)
    oText(dc, "LICENSED", 0, S - 11, 7, new Color(T.ink, 0.7), S, "c")
  } else if (type === "eval") {
    const n = 18, R = S * 0.46, chaos = 1 - extra
    for (let i = 0; i < n; i++) { const a0 = Math.PI * 0.75 + i * (Math.PI * 1.5 / n), a1 = a0 + Math.PI * 1.5 / n * 0.7; const on = i / n < extra; oPoly(dc, [[cx + R * Math.cos(a0), cy + R * Math.sin(a0)], [cx + R * Math.cos(a1), cy + R * Math.sin(a1)], [cx + R * 0.84 * Math.cos(a1), cy + R * 0.84 * Math.sin(a1)], [cx + R * 0.84 * Math.cos(a0), cy + R * 0.84 * Math.sin(a0)]], on ? A : F) }
    // the core: calm concentric rings at high sync, a tangled storm of jagged loops as sync drops
    const loops = 3 + Math.round(chaos * 9), core = R * 0.74
    for (let k = 0; k < loops; k++) {
      const pts = [], base = core * (0.25 + 0.75 * (k + 1) / loops), amp = chaos * chaos * core * 0.55, freq = 3 + Math.floor(r() * 6 * chaos + chaos * 4), ph = r() * 6.28
      for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, jag = (r() - 0.5) * amp * 0.8, rr = Math.min(core, Math.max(2, base + Math.sin(a * freq + ph) * amp * 0.6 + jag)); pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]) }
      const hot = chaos > 0.45 && k % 3 === 0
      oLine(dc, pts, hot ? H : new Color(T.ink, 0.35 + 0.5 * (k / loops)), hot ? 1.2 : 0.8)
    }
    if (chaos > 0.55) for (let s = 0; s < Math.round(chaos * 14); s++) { const a = r() * Math.PI * 2, r1 = core * r() * 0.6, r2 = core * (0.6 + r() * 0.4); oLine(dc, [[cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)], [cx + r2 * Math.cos(a + (r() - 0.5) * 0.6), cy + r2 * Math.sin(a + (r() - 0.5) * 0.6)]], H, 0.9) }
    dc.setFillColor(new Color(T.panel, 0.82)); dc.fillRect(new Rect(cx - 20, cy - 8, 40, 16))
    oText(dc, `${(extra * 100).toFixed(1)}%`, 0, cy - 8, 11, I, S, "c")
  } else if (type === "omens") {
    oCirc(dc, cx, cy, S * 0.4, null, new Color(T.ink, 0.35), 1)
    oCirc(dc, cx, cy, S * 0.33, null, new Color(T.ink, 0.18), 0.7)
    ;["N", "E", "S", "W"].forEach((l, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; oText(dc, l, cx + S * 0.46 * Math.cos(a) - 5, cy + S * 0.46 * Math.sin(a) - 7, 8.5, I, 10, "c") })
    const a = -Math.PI / 2 + extra * Math.PI / 4
    const tip = [cx + S * 0.32 * Math.cos(a), cy + S * 0.32 * Math.sin(a)], tail = [cx - S * 0.28 * Math.cos(a), cy - S * 0.28 * Math.sin(a)]
    oLine(dc, [tail, tip], I, 2)
    oPoly(dc, [tip, [tip[0] - 9 * Math.cos(a - 0.4), tip[1] - 9 * Math.sin(a - 0.4)], [tip[0] - 9 * Math.cos(a + 0.4), tip[1] - 9 * Math.sin(a + 0.4)]], H)
    oPoly(dc, [tail, [tail[0] + 6 * Math.cos(a - 1.2), tail[1] + 6 * Math.sin(a - 1.2)], [tail[0] + 12 * Math.cos(a), tail[1] + 12 * Math.sin(a)], [tail[0] + 6 * Math.cos(a + 1.2), tail[1] + 6 * Math.sin(a + 1.2)]], I)
    oCirc(dc, cx, cy, 3, I)
  } else if (type === "hostile") {
    // abstract thermal signature: nested contours, shape set by the unit's build
    const k = extra, shapes = { swarm: [[-14, -8, 9, 7], [10, -12, 7, 6], [2, 10, 10, 8], [16, 8, 6, 5], [-12, 12, 6, 5]], shield: [[0, 0, 15, 22]], tall: [[0, 0, 9, 30]], float: [[0, -6, 17, 15]], heavy: [[0, 4, 24, 20]] }[k] || [[0, 0, 16, 16]]
    for (let g = 0; g <= 32; g += 8) { oLine(dc, [[cx - S * 0.46, cy - 16 + g], [cx + S * 0.46, cy - 16 + g]], new Color(T.ink, 0.08), 0.6) }
    shapes.forEach(([dx, dy, rx, ry]) => { for (let ring = 3; ring >= 1; ring--) { const f = ring / 3; oPoly(dc, blob(dc, cx + dx, cy + dy, rx * (0.45 + f * 0.6), ry * (0.45 + f * 0.6), r, 0.3), null, new Color(ring === 1 ? T.headBg : T.accent, ring === 1 ? 1 : 0.35 + (3 - ring) * 0.25), ring === 1 ? 1.6 : 1) } oCirc(dc, cx + dx, cy + dy, 2, H) })
    if (k === "shield") { const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * (0.65 + i / 16 * 0.7); pts.push([cx + 26 * Math.cos(a), cy + 26 * Math.sin(a)]) } oLine(dc, pts, A, 2.2) }
    if (k === "float") oLine(dc, [[cx - 14, cy + 26], [cx - 6, cy + 26]], new Color(T.ink, 0.5), 1), oLine(dc, [[cx + 2, cy + 26], [cx + 14, cy + 26]], new Color(T.ink, 0.5), 1)
    ;[[0, 0, 1, 1], [S, 0, -1, 1], [0, S, 1, -1], [S, S, -1, -1]].forEach(([x, y, sx, sy]) => oLine(dc, [[x + sx * 11, y + sy * 2], [x + sx * 2, y + sy * 2], [x + sx * 2, y + sy * 11]], H, 1.6))
    oLine(dc, [[cx, 6], [cx, 13]], new Color(T.ink, 0.6), 1); oLine(dc, [[cx, S - 13], [cx, S - 6]], new Color(T.ink, 0.6), 1)
    oText(dc, "IFF: HOSTILE", 0, S - 12, 6.5, H, S, "c")
  } else if (type === "spell") {
    oCirc(dc, cx, cy, S * 0.45, null, A, 1)
    oCirc(dc, cx, cy, S * 0.39, null, new Color(T.accent, 0.5), 0.8)
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; oLine(dc, [[cx + S * 0.39 * Math.cos(a), cy + S * 0.39 * Math.sin(a)], [cx + S * 0.45 * Math.cos(a), cy + S * 0.45 * Math.sin(a)]], A, 0.8) }
    const n = 5 + (extra % 3), pts = []; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i * 2 % n) * Math.PI * 2 / n; pts.push([cx + S * 0.34 * Math.cos(a), cy + S * 0.34 * Math.sin(a)]) }
    oLine(dc, pts.concat([pts[0]]), A, 1.2)
    oCirc(dc, cx, cy, S * 0.1, L, I, 1)
  } else if (type === "bet") {
    let v = 0.5; for (let i = 0; i < 9; i++) { const o = v; v = Math.max(0.1, Math.min(0.9, v + Math.sin(i * 1.3 + extra * 6) * 0.2)); const up = v >= o, col = up ? new Color(T.altBg) : new Color("#E8384F"), x = 8 + i * (S - 16) / 9, yt = S * 0.15 + S * 0.5 * (1 - Math.max(o, v)), yb = S * 0.15 + S * 0.5 * (1 - Math.min(o, v)); oLine(dc, [[x + 3, yt - 4], [x + 3, yb + 4]], col, 0.8); oPoly(dc, [[x, yt], [x + 6, yt], [x + 6, Math.max(yt + 2, yb)], [x, Math.max(yt + 2, yb)]], col) }
    oPoly(dc, [[6, S * 0.76], [6 + (S - 12) * extra, S * 0.76], [6 + (S - 12) * extra, S * 0.88], [6, S * 0.88]], new Color(T.altBg, 0.8)); oPoly(dc, [[6 + (S - 12) * extra, S * 0.76], [S - 6, S * 0.76], [S - 6, S * 0.88], [6 + (S - 12) * extra, S * 0.88]], new Color("#E8384F", 0.6))
  } else if (type === "market") {
    oPoly(dc, [[6, S * 0.3], [S - 6, S * 0.3], [S - 6, S * 0.8], [6, S * 0.8]], new Color(T.ground), new Color(T.headBg), 1.4)
    for (let i = 0; i < 6; i++) oLine(dc, [[10, S * (0.36 + i * 0.07)], [S - 10, S * (0.36 + i * 0.07)]], new Color(T.accent, 0.2 + (i % 2) * 0.3), 1)
    oPoly(dc, [[cx - 14, S * 0.5], [cx, S * 0.4], [cx + 14, S * 0.5], [cx, S * 0.62]], new Color(T.accent, 0.5), new Color(T.accent), 1.2)
    oText(dc, `${Math.round(extra * 900 + 99)}c`, 0, S * 0.12, 11, new Color(T.altBg), S, "c")
  } else if (type === "tip") {
    oCirc(dc, cx, cy, S * 0.42, new Color(T.headBg, 0.25), new Color("#FFFFFF"), 1.4); oCirc(dc, cx - S * 0.12, cy - S * 0.16, S * 0.1, new Color("#FFFFFF", 0.85))
    oPoly(dc, [[cx - 6, cy + 10], [cx + 6, cy + 10], [cx + 5, cy + 16], [cx - 5, cy + 16]], new Color("#FFFFFF")); oCirc(dc, cx, cy - 2, 11, new Color("#FFF6B0"), new Color("#FFFFFF"), 1)
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45; oLine(dc, [[cx + 15 * Math.cos(a), cy - 2 + 15 * Math.sin(a)], [cx + 20 * Math.cos(a), cy - 2 + 20 * Math.sin(a)]], new Color("#FFFFFF"), 1.4) }
  } else if (type === "mall") {
    oPoly(dc, [[4, 10], [S - 4, 10], [S - 4, S - 6], [4, S - 6]], new Color("#C3C3D0"), new Color("#4A4A5A"), 1)
    for (let i = 0; i < 6; i++) { const x = 10 + (i % 3) * ((S - 20) / 3), y = 20 + Math.floor(i / 3) * ((S - 34) / 2); oPoly(dc, [[x, y], [x + (S - 26) / 3, y], [x + (S - 26) / 3, y + (S - 40) / 2], [x, y + (S - 40) / 2]], new Color([T.headBg, T.altBg, "#FFFB96"][i % 3], i === Math.floor(extra * 6) % 6 ? 1 : 0.35)) }
    oText(dc, "YOU ARE HERE", 0, S - 18, 6.5, new Color("#101018"), S, "c")
  } else if (type === "species") {
    oCirc(dc, cx, cy, S * 0.42, new Color(T.panel), new Color(T.ink, 0.6), 1)
    const lf = (x, y, s2, a, col) => { const c2 = Math.cos(a), sn = Math.sin(a), Q = (u, v) => new Point(x + u * c2 - v * sn, y + u * sn + v * c2); const p = new Path(); p.move(Q(0, 0)); p.addQuadCurve(Q(s2, 0), Q(s2 * 0.5, -s2 * 0.4)); p.addQuadCurve(Q(0, 0), Q(s2 * 0.5, s2 * 0.4)); dc.addPath(p); dc.setFillColor(col); dc.fillPath() }
    lf(cx - 18, cy + 10, 26, -0.6, new Color(T.headBg)); lf(cx + 2, cy + 14, 20, -1.6, new Color(T.headBg, 0.7)); lf(cx + 6, cy - 4, 18, 0.3, new Color(T.altBg, 0.7))
    oLine(dc, [[cx - 10, cy - 18], [cx - 4, cy - 12]], new Color(T.ink), 1); oCirc(dc, cx - 2, cy - 10, 4, null, new Color(T.ink), 1.2); oLine(dc, [[cx + 1, cy - 7], [cx + 6, cy - 2]], new Color(T.ink), 1.4)
  } else if (type === "heist") {
    oPoly(dc, [[cx - S * 0.3, S * 0.86], [cx + S * 0.3, S * 0.86], [cx + S * 0.22, S * 0.66], [cx - S * 0.22, S * 0.66]], new Color(T.panel), I, 1.2)
    oPoly(dc, [[cx - S * 0.26, S * 0.66], [cx + S * 0.26, S * 0.66], [cx + S * 0.26, S * 0.18], [cx - S * 0.26, S * 0.18]], new Color(T.headBg, 0.2), new Color(T.ink, 0.6), 1)
    const gy = S * 0.46; oPoly(dc, [[cx - 12, gy - 4], [cx - 7, gy - 11], [cx + 7, gy - 11], [cx + 12, gy - 4], [cx, gy + 12]], new Color(T.accent, 0.55), I, 1); oLine(dc, [[cx - 12, gy - 4], [cx + 12, gy - 4]], I, 0.7)
    for (let i = 0; i < 4; i++) { const y = S * (0.12 + i * 0.22); oLine(dc, [[2, y + (i % 2 ? 8 : -6)], [S - 2, y + (i % 2 ? -6 : 8)]], new Color(T.accent, extra > i / 4 ? 0.85 : 0.2), 1) }
    const sp = (x, y, r) => oPoly(dc, [[x, y - r], [x + r * 0.22, y - r * 0.22], [x + r, y], [x + r * 0.22, y + r * 0.22], [x, y + r], [x - r * 0.22, y + r * 0.22], [x - r, y], [x - r * 0.22, y - r * 0.22]], new Color("#FFFFFF"))
    sp(cx + 9, gy - 12, 3.5)
  } else if (type === "late") {
    oCirc(dc, cx, cy + 3, S * 0.4, new Color(T.panel), I, 1.4); oCirc(dc, cx, cy + 3, S * 0.34, null, new Color(T.altBg), 0.8)
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; oLine(dc, [[cx + S * 0.3 * Math.cos(a), cy + 3 + S * 0.3 * Math.sin(a)], [cx + S * 0.36 * Math.cos(a), cy + 3 + S * 0.36 * Math.sin(a)]], new Color(T.ink, 0.6), 1) }
    const a1 = -Math.PI / 2 + extra * Math.PI * 2, a2 = -Math.PI / 2 + extra * 0.08 * Math.PI * 2
    oLine(dc, [[cx, cy + 3], [cx + S * 0.28 * Math.cos(a1), cy + 3 + S * 0.28 * Math.sin(a1)]], A, 1.6); oLine(dc, [[cx, cy + 3], [cx + S * 0.18 * Math.cos(a2), cy + 3 + S * 0.18 * Math.sin(a2)]], I, 2)
    oCirc(dc, cx, cy + 3, 2.5, A); oCirc(dc, cx, cy + 3 - S * 0.46, 4, null, I, 1); oPoly(dc, [[cx - 4, cy + 3 - S * 0.42], [cx + 4, cy + 3 - S * 0.42], [cx + 4, cy + 3 - S * 0.38], [cx - 4, cy + 3 - S * 0.38]], new Color(T.altBg))
    const sp = (x, y, r) => oPoly(dc, [[x, y - r], [x + r * 0.22, y - r * 0.22], [x + r, y], [x + r * 0.22, y + r * 0.22], [x, y + r], [x - r * 0.22, y + r * 0.22], [x - r, y], [x - r * 0.22, y - r * 0.22]], A)
    sp(S * 0.86, S * 0.16, 5); sp(S * 0.12, S * 0.82, 3)
  } else if (type === "decoder") {
    const pts = [], W = S * 3, Hh = S * 0.5, dcw = oddCanvas(W, Hh)
    for (let x = 0; x <= W; x += 2) { const t = x / W, noise = (1 - t) * (r() - 0.5) * Hh * 0.9, clean = Math.sin(x * 0.18) * Hh * 0.25 * t; pts.push([x, Hh / 2 + noise + clean]) }
    oLine(dcw, pts, INK, 1.2)
    for (let x = 10; x < W; x += 34) { dcw.setFillColor(HOT()); dcw.fillRect(new Rect(x, Hh - 3, 8, 3)) }
    return dcw.getImage()
  }
  return dc.getImage()
}

async function oddityWidget() {
  const type = T.oddity || "mood", O = ODD[type] || ODD.mood
  const f = fam(), small = f === "small"
  const st = oddSeq(), r = oddRnd(st.seq, type.length)
  const TP = THEMED(); if (TP && TP.oddity) return await artWidget({ title: (T.L && T.L.oddity) || O.title, right: O.right, alt: true, paint: TP.oddity, data: { seed: st.seq, now: new Date() }, refresh: new Date(st.since + ODD_MS + 5000) })
  const w = base((T.L && T.L.oddity) || O.title, small ? null : O.right, true)
  w.refreshAfterDate = new Date(st.since + ODD_MS + 5000)
  const b = body(w, small ? [9, 13, 9, 13] : [10, 16, 10, 16])
  const vs = small ? 56 : 80
  const row = b.addStack(); row.layoutHorizontally(); row.topAlignContent()
  const col = () => { row.addSpacer(small ? 8 : 12); const c = row.addStack(); c.layoutVertically(); return c }
  const kv = (stack, k, v, colr) => { const s = stack.addStack(); s.layoutHorizontally(); txt(s, k, small ? 7 : 8, SOFT); s.addSpacer(6); txt(s, v, small ? 7.5 : 9, colr || INK); stack.addSpacer(small ? 1 : 2) }
  const stamp = (stack, t, size) => { const s = stack.addStack(); s.setPadding(2, 5, 2, 5); s.borderColor = HOT(); s.borderWidth = 1.5; s.cornerRadius = 2; txt(s, t, size, HOT()); return s }
  const serif = (stack, t, size, lines) => { const x = stack.addText(t); x.font = disp(size); x.textColor = INK; x.lineLimit = lines || 1; x.minimumScaleFactor = 0.7; return x }
  const imgAt = (stack, img, w2, h2) => { const im = stack.addImage(img); im.imageSize = new Size(w2, h2); return im }
  if (type === "mood") {
    const em = O.emotions.slice().sort(() => r() - 0.5).slice(0, 3).map((e, i) => ({ e, v: i === 1 ? 0.93 + r() * 0.07 : 0.15 + r() * 0.65, s: i === 1 ? "OVER QUOTA" : pickFrom(O.status, r) }))
    imgAt(row, oddVisual("mood", r, vs, em[1].v), vs, vs)
    const c = col()
    if (small) { txt(c, em[1].e, 12, INK, true); txt(c, "OVER QUOTA", 7, HOT()); txt(c, `CREDIT ${500 + Math.floor(r() * 300)}`, 7, SOFT) }
    else {
      const top = c.addStack(); top.layoutHorizontally(); txt(top, `ACCT 0x${Math.floor(r() * 65535).toString(16).toUpperCase().padStart(4, "0")}-07`, 7.5, SOFT); top.addSpacer(); txt(top, `EMOTIONAL CREDIT ${500 + Math.floor(r() * 300)}`, 7.5, SOFT); c.addSpacer(3)
      em.forEach(m => { const s = c.addStack(); s.layoutHorizontally(); txt(s, m.e, 9, INK); s.addSpacer(); txt(s, m.s, 7.5, m.s === "OVER QUOTA" ? HOT() : SOFT); imgAt(c, meter(220, m.v, m.s === "OVER QUOTA"), 220, 5); c.addSpacer(4) })
    }
    b.addSpacer()
    if (!small) { serif(b, pickFrom(O.upsell, r), 12); b.addSpacer(2); txt(b, pickFrom(O.notice, r), 7.5, HOT()); b.addSpacer(2) }
    const ft = b.addStack(); ft.layoutHorizontally()
    txt(ft, `NEXT MANDATORY SMILE ${clockAt(Date.now() + (40 + r() * 140) * 60000)}`, small ? 6.5 : 7.5, SOFT)
    if (!small) { ft.addSpacer(); txt(ft, `RENEWAL ${(19 + Math.floor(r() * 30))}.99/MO`, 7.5, INK) }
  } else if (type === "eval") {
    const sync = 0.2 + r() * 0.75, hist = Array.from({ length: 7 }, () => 0.2 + r() * 0.75).concat([sync])
    imgAt(row, oddVisual("eval", r, small ? vs : 70, sync), small ? vs : 70, small ? vs : 70)
    const c = col()
    txt(c, `SYNC ${(sync * 100).toFixed(1)}% · ${sync > 0.7 ? "STABLE" : sync > 0.45 ? "TURBULENT" : "CRITICAL"} · SUBJECT ${String(Math.floor(r() * 900) + 100)}`, small ? 6.5 : 7.5, sync > 0.45 ? SOFT : HOT())
    if (!small) {
      c.addSpacer(3)
      const g1 = c.addStack(); g1.layoutHorizontally(); readout(g1, "HARMONICS", `±${(r() * 0.5).toFixed(2)}`); g1.addSpacer(); readout(g1, "CONTAMINATION", `${(r() * 4).toFixed(1)}%`); g1.addSpacer(); readout(g1, "HESITATION", String(Math.floor(r() * 12)))
      c.addSpacer(4)
      const g2 = c.addStack(); g2.layoutHorizontally(); readout(g2, "TEARS", pickFrom(O.tears, r)); g2.addSpacer(); readout(g2, "SHELTER", `S-${1 + Math.floor(r() * 12)} / ${100 + Math.floor(r() * 300)}`)
    } else { c.addSpacer(4); stamp(c, pickFrom(O.verdict, r), 7) }
    b.addSpacer()
    if (!small) {
      const sl = b.addStack(); sl.layoutHorizontally(); sl.centerAlignContent(); txt(sl, "8-DAY SYNC", 7, SOFT); sl.addSpacer(6); imgAt(sl, spark(206, hist, 12), 206, 12); sl.addSpacer(6); txt(sl, `PEAK ${Math.round(Math.max(...hist) * 100)}%`, 7, SOFT)
      b.addSpacer(4)
      const nr = b.addStack(); nr.layoutHorizontally(); nr.centerAlignContent()
      const nt = nr.addText(`NOTE: ${pickFrom(O.notes, r)}`); nt.font = disp(10.5); nt.textColor = INK; nt.lineLimit = 1; nt.minimumScaleFactor = 0.7
      nr.addSpacer(8); stamp(nr, pickFrom(O.verdict, r), 8.5)
    } else txt(b, `NEXT DRILL ${clockAt(Date.now() + (30 + r() * 200) * 60000)}`, 6.5, SOFT)
  } else if (type === "omens") {
    const now = new Date(), om = pickFrom(O.omen, r)
    const hd = b.addStack(); hd.layoutHorizontally()
    txt(hd, small ? `${ordinal(now.getDate())} OF ${O.months[now.getMonth()].toUpperCase()}` : `THE ${ordinal(now.getDate())} DAY OF ${O.months[now.getMonth()].toUpperCase()}`, small ? 6.5 : 7.5, SOFT)
    if (!small) { hd.addSpacer(); txt(hd, moonName(now), 7.5, SOFT) }
    b.addSpacer(small ? 3 : 4)
    const rw = b.addStack(); rw.layoutHorizontally(); rw.topAlignContent()
    imgAt(rw, oddVisual("omens", r, small ? vs - 8 : 58, Math.floor(r() * 8)), small ? vs - 8 : 58, small ? vs - 8 : 58)
    rw.addSpacer(small ? 6 : 12)
    const c = rw.addStack(); c.layoutVertically()
    serif(c, om[0], small ? 11 : 13, small ? 3 : 2)
    if (!small) {
      c.addSpacer(1); txt(c, `MEANING: ${om[1].toUpperCase()}`, 7.5, HOT())
      c.addSpacer(2); imgAt(c, vine(240, 12, r), 240, 12)
      const tongue = c.addText(`“${elvish(om[0], r)}”`); tongue.font = disp(10); tongue.textColor = new Color(T.ink, 0.75); tongue.lineLimit = 1; tongue.minimumScaleFactor = 0.7
    }
    b.addSpacer()
    if (!small) {
      const g = b.addStack(); g.layoutHorizontally(); readout(g, "ROADS", pickFrom(O.roads, r)); g.addSpacer(); readout(g, "PANTRY", pickFrom(O.pantry, r)); g.addSpacer(); readout(g, "NEAREST INN", pickFrom(O.inn, r))
      b.addSpacer(4)
      const ft = b.addStack(); ft.layoutHorizontally(); ft.centerAlignContent(); txt(ft, `LUCKY: ${pickFrom(O.lucky, r)}`, 7.5, INK); ft.addSpacer(); txt(ft, "SECOND THOUGHTS ", 7, SOFT); imgAt(ft, meter(80, r(), true, 4), 80, 4)
    } else txt(b, `LUCKY: ${pickFrom(O.lucky, r)}`, 6.5, SOFT)
  } else if (type === "hostile") {
    const u = pickFrom(O.units, r), thr = O.threat[u[2] - 1]
    imgAt(row, oddVisual("hostile", r, vs, u[6]), vs, vs)
    const c = col()
    serif(c, u[0], small ? 12 : 16)
    txt(c, `HX-${String(Math.floor(r() * 90) + 10)} · ${u[1]}`, small ? 6.5 : 7.5, SOFT)
    const tr = c.addStack(); tr.layoutHorizontally(); tr.centerAlignContent(); txt(tr, "THREAT ", small ? 6.5 : 7.5, SOFT)
    for (let i = 0; i < 4; i++) { const d = tr.addStack(); d.size = new Size(small ? 7 : 10, small ? 4 : 5); d.backgroundColor = i < u[2] ? (u[2] >= 3 ? HOT() : INK) : new Color(T.ink, 0.15); tr.addSpacer(2) }
    tr.addSpacer(3); txt(tr, thr, small ? 6.5 : 7.5, u[2] >= 3 ? HOT() : INK)
    if (!small) {
      c.addSpacer(3)
      ;[["ARMOR", r()], ["AGGRESSION", r()], ["COWARDICE", r()]].forEach(([k, v]) => { const s = c.addStack(); s.layoutHorizontally(); s.centerAlignContent(); const l = s.addStack(); l.size = new Size(70, 10); txt(l, k, 7.5, SOFT); l.addSpacer(); s.addSpacer(4); imgAt(s, meter(110, v, k === "AGGRESSION", 4), 110, 4); c.addSpacer(2) })
    }
    b.addSpacer()
    if (!small) {
      const ln = b.addStack(); ln.layoutHorizontally(); txt(ln, `GRID ${1 + Math.floor(r() * 9)}-${"ABCDEFGHJK"[Math.floor(r() * 10)]} · ${1 + Math.floor(r() * 6)} CONTACTS · ${u[7]}`, 7.5, SOFT); b.addSpacer(2)
      const tp = b.addStack(); tp.layoutHorizontally(); tp.centerAlignContent(); txt(tp, `WEAK TO ${u[3]} · ${u[5]}`, 8, INK); tp.addSpacer(6); stamp(tp, pickFrom(O.call, r), 8)
    } else txt(b, `LAST SEEN ${u[4]}`, 6.5, SOFT)
  } else if (type === "spell") {
    const sp = pickFrom(O.spells, r), rar = pickFrom(O.rarity, r)
    const inc = Array.from({ length: 3 }, () => { const w2 = pickFrom(O.syl, r) + pickFrom(O.syl, r) + (r() < 0.5 ? "'" + pickFrom(O.syl, r) : ""); return w2[0].toUpperCase() + w2.slice(1) }).join(" ")
    imgAt(row, oddVisual("spell", r, small ? vs : 70, Math.floor(r() * 10)), small ? vs : 70, small ? vs : 70)
    const c = col()
    serif(c, sp[0], small ? 12 : 16, 2)
    const ln = c.addStack(); ln.layoutHorizontally(); txt(ln, `${sp[1]} · ${rar}`, small ? 6.5 : 7.5, rar === "CURSED" ? HOT() : SOFT); ln.addSpacer(); txt(ln, "◆".repeat(Math.min(7, sp[2])), small ? 7 : 9, new Color(T.accent))
    if (!small) { c.addSpacer(3); kv(c, "CASTING TIME", `${sp[3]} · ${sp[6]}`); kv(c, "COMPONENTS", sp[7]) }
    b.addSpacer()
    if (!small) {
      const ic = b.addText(`“${inc}.”`); ic.font = disp(11); ic.textColor = new Color(T.accent); ic.lineLimit = 1; ic.minimumScaleFactor = 0.7
      b.addSpacer(2)
      const ef = b.addStack(); ef.layoutHorizontally(); txt(ef, sp[4].toUpperCase(), 7.5, INK); b.addSpacer(1)
      txt(b, `SIDE EFFECT: ${sp[5].toUpperCase()} · COOLDOWN ${1 + Math.floor(r() * 23)}H`, 7.5, rar === "CURSED" ? HOT() : SOFT)
    } else txt(b, `CAST ${sp[3]}`, 6.5, SOFT)
  } else if (type === "market") {
    const price = r()
    imgAt(row, oddVisual("market", r, vs, price), vs, vs)
    const c = col()
    txt(c, `SELLER ${pickFrom(O.sellers, r)} · ★${(3 + r() * 2).toFixed(1)}`, small ? 6.5 : 7.5, SOFT)
    serif(c, pickFrom(O.items, r), small ? 11 : 14, 2)
    txt(c, `${Math.round(price * 900 + 99)} CREDITS · ${pickFrom(O.cond, r)}`, small ? 6.5 : 8, HOT())
    if (!small) { c.addSpacer(4); kv(c, "WARRANTY", "NONE"); kv(c, "RETURNS", "LOL") }
    b.addSpacer()
    if (!small) { const ft = b.addStack(); ft.layoutHorizontally(); ft.centerAlignContent(); txt(ft, "MEET AT THE NOODLE STAND", 8, INK); ft.addSpacer(); txt(ft, "RISK ", 7, SOFT); imgAt(ft, meter(90, r(), true, 4), 90, 4) }
    else txt(b, "CASH ONLY", 7, HOT())
  } else if (type === "bet") {
    const p = 0.08 + r() * 0.86
    imgAt(row, oddVisual("bet", r, vs, p), vs, vs)
    const c = col()
    txt(c, `MARKET #${1000 + Math.floor(r() * 9000)} · RESOLVES TONIGHT`, small ? 6.5 : 7.5, SOFT)
    serif(c, pickFrom(O.qs, r), small ? 11 : 14, small ? 3 : 2)
    const yn = c.addStack(); yn.layoutHorizontally(); txt(yn, `YES ${Math.round(p * 100)}¢`, small ? 7 : 9, new Color(T.altBg)); yn.addSpacer(8); txt(yn, `NO ${100 - Math.round(p * 100)}¢`, small ? 7 : 9, new Color("#E8384F"))
    b.addSpacer()
    if (!small) { const s = b.addStack(); s.layoutHorizontally(); readout(s, "PAYOUT", `x${(1 / Math.max(0.03, p)).toFixed(1)}`); s.addSpacer(); readout(s, "VOLUME", `$${(1 + r() * 999).toFixed(0)}K`); s.addSpacer(); readout(s, "LEVERAGE", pickFrom(["1X", "5X", "25X", "100X"], r)); s.addSpacer(); readout(s, "YOUR POSITION", pickFrom(O.pos, r)) }
    else txt(b, "NOT FINANCIAL ADVICE", 6.5, SOFT)
  } else if (type === "tip") {
    imgAt(row, oddVisual("tip", r, vs, 0), vs, vs)
    const c = col()
    txt(c, "DID YOU KNOW?", small ? 6.5 : 7.5, new Color(T.headBg))
    serif(c, pickFrom(O.tips, r), small ? 11 : 14, small ? 3 : 2)
    b.addSpacer()
    if (!small) { const s = b.addStack(); s.layoutHorizontally(); readout(s, "OPTIMISM", `${90 + Math.floor(r() * 10)}%`); s.addSpacer(); readout(s, "BUBBLES POPPED", String(Math.floor(r() * 400))); s.addSpacer(); readout(s, "CLOUDS RENDERED", String(3 + Math.floor(r() * 20))) }
    else txt(b, "HAVE A GREAT DAY", 7, SOFT)
  } else if (type === "mall") {
    const n = Math.floor(r() * 6)
    imgAt(row, oddVisual("mall", r, vs, n / 6), vs, vs)
    const c = col()
    txt(c, "STORE OF THE HOUR", small ? 6.5 : 7.5, SOFT)
    serif(c, pickFrom(O.stores, r), small ? 12 : 15)
    txt(c, pickFrom(O.status, r), small ? 6.5 : 8, HOT())
    if (!small) { c.addSpacer(4); kv(c, "FLOOR", `LEVEL ${1 + Math.floor(r() * 3)}`); kv(c, "FOUNTAIN COINS", `${100 + Math.floor(r() * 900)}`) }
    b.addSpacer()
    if (!small) { const ft = b.addStack(); ft.layoutHorizontally(); txt(ft, `NOW PLAYING: ${pickFrom(O.tracks, r).toUpperCase()}`, 8, INK); ft.addSpacer(); txt(ft, "♪", 8, HOT()) }
    else txt(b, "OPEN FOREVER", 7, SOFT)
  } else if (type === "species") {
    const sp = pickFrom(O.list, r)
    imgAt(row, oddVisual("species", r, vs, 0), vs, vs)
    const c = col()
    txt(c, `SPOTTED ${pickFrom(O.where, r)}`, small ? 6.5 : 7.5, SOFT)
    serif(c, sp[0], small ? 12 : 15, 2)
    const ln2 = c.addText(sp[1]); ln2.font = disp(small ? 9 : 11); ln2.textColor = HOT(); ln2.lineLimit = 1
    if (!small) { c.addSpacer(3); const fx = c.addText(sp[2]); fx.font = disp(10.5); fx.textColor = SOFT; fx.lineLimit = 2; fx.minimumScaleFactor = 0.75 }
    b.addSpacer()
    if (!small) { const ft = b.addStack(); ft.layoutHorizontally(); ft.centerAlignContent(); txt(ft, "LOOK, DON'T DISTURB", 8, INK); ft.addSpacer(); txt(ft, "RARITY ", 7, SOFT); imgAt(ft, meter(90, r(), false, 4), 90, 4) }
    else txt(b, "LOOK CLOSELY", 7, SOFT)
  } else if (type === "heist") {
    const sec = 1 + Math.floor(r() * 5), odds = 12 + Math.floor(r() * 80)
    imgAt(row, oddVisual("heist", r, vs, sec / 5), vs, vs)
    const c = col()
    txt(c, "TARGET", small ? 6.5 : 7.5, SOFT)
    serif(c, pickFrom(O.targets, r), small ? 12 : 15, small ? 2 : 1)
    txt(c, `AT ${pickFrom(O.venues, r)}`, small ? 6.5 : 8, HOT())
    if (!small) { c.addSpacer(4); kv(c, "SECURITY", "▮".repeat(sec) + "▯".repeat(5 - sec)); kv(c, "CREW", pickFrom(O.crews, r)); kv(c, "ODDS", `${odds}%`) }
    b.addSpacer()
    if (!small) { const ft = b.addStack(); ft.layoutHorizontally(); ft.centerAlignContent(); txt(ft, `CALLING CARD: ${pickFrom(O.cards, r)}`, 8, INK); ft.addSpacer(); txt(ft, "NERVE ", 7, SOFT); imgAt(ft, meter(90, odds / 100, true, 4), 90, 4) }
    else txt(b, `ODDS ${odds}%`, 7, HOT())
  } else if (type === "late") {
    const mins = 3 + Math.floor(r() * 58)
    imgAt(row, oddVisual("late", r, vs, mins / 60), vs, vs)
    const c = col()
    txt(c, "LATE FOR", small ? 6.5 : 7.5, SOFT)
    serif(c, pickFrom(O.events, r), small ? 12 : 15, small ? 2 : 1)
    txt(c, `BY ${mins} MINUTES`, small ? 7 : 8.5, HOT())
    if (!small) { c.addSpacer(3); const ex = c.addText(pickFrom(O.excuses, r)); ex.font = disp(10.5); ex.textColor = SOFT; ex.lineLimit = 2; ex.minimumScaleFactor = 0.75 }
    b.addSpacer()
    if (!small) { const ft = b.addStack(); ft.layoutHorizontally(); ft.centerAlignContent(); txt(ft, `TEA: ${pickFrom(O.tea, r)}`, 8, INK); ft.addSpacer(); txt(ft, "PANIC ", 7, SOFT); imgAt(ft, meter(90, 0.4 + r() * 0.6, true, 4), 90, 4) }
    else txt(b, "RUN.", 7, HOT())
  } else {
    const m = pickFrom(O.msgs, r), conf = Math.round(6 + r() * 90)
    const head = b.addStack(); head.layoutHorizontally()
    txt(head, `TRANSMISSION ${String(Math.floor(r() * 9999)).padStart(4, "0")}`, small ? 7 : 8.5, SOFT)
    head.addSpacer()
    if (conf < 25) txt(head, "LOSS OF SIGNAL", small ? 7 : 8.5, HOT())
    b.addSpacer(3)
    const tx = b.addText(`"${m[0]}"`); tx.font = disp(small ? 13 : 18); tx.textColor = INK; tx.lineLimit = 2; tx.minimumScaleFactor = 0.7
    b.addSpacer(4)
    const ww = small ? 140 : 332; imgAt(b, oddVisual("decoder", r, ww / 3), ww, ww / 6)
    b.addSpacer()
    if (!small) { const s = b.addStack(); s.layoutHorizontally(); readout(s, "CONFIDENCE", `${conf}%`); s.addSpacer(); readout(s, "ECHO DELAY", `${(r() * 9).toFixed(1)} YR`); s.addSpacer(); readout(s, "SOURCE", m[1]); s.addSpacer(); readout(s, "SALVAGE", pickFrom(O.salvage, r)) }
    else txt(b, `CONFIDENCE ${conf}%`, 7, conf < 25 ? HOT() : INK)
  }
  return w
}

// ---------- run ----------
const PARTS = ((args.widgetParameter || "") + "").trim().toLowerCase().split(":")
const MODE = PARTS[0].trim() || "status"
if (PARTS[1]) FLIP = PARTS[1].trim().startsWith("a") ? "alt" : "main"
// ---------- THEMED PAINT BLOCK ----------
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
// ---------- LONG ODDS: existential markets and fake news alerts ----------
const MK_QS = ["Will today happen twice?", "Does the void take bets?", "Will you remember this Tuesday in forty years?", "Is tomorrow already priced in?", "Will your reflection blink first?", "Will the color blue be discontinued?", "Will time move sideways this weekend?", "Will the moon admit it was a dream?", "Will the sea forget its name?", "Will gravity ask for something in return?", "Will the clocks agree on anything?", "Will you meet the version of you who stayed?", "Will meaning reprice above 40¢?", "Will an eighth day appear on the calendar?", "Will the horizon hold still for one hour?", "Will silence be louder than expected?", "Will the past reopen to visitors?", "Will you become a rumor in someone else's dream?", "Will the last echo come back?", "Will Sunday refuse to end?", "Will a minute last an hour somewhere near you?", "Will the stars move closer, just once?", "Will your shadow arrive before you?", "Will the fog make a statement?", "Will the universe read your message?", "Will déjà vu happen again?", "Will infinity be revised downward?", "Will the ocean finish its diary?", "Will the present moment ever arrive?", "Will you dream in a language you don't speak?", "Will the map add a place no one has been?", "Will morning arrive early and apologize?", "Will the door you never opened still be waiting?", "Will coincidences outnumber plans today?", "Will a forgotten word come back?", "Will light from a dead star arrive on time?", "Will the sky be renewed for another season?", "Will Wednesday merge with Thursday?", "Will you notice the exact moment it changes?", "Will the hourglass run out of sand, or patience?"]
const MK_NEWS = ["Tuesday delisted after failing to happen twice.", "Scientists confirm the void is accepting limit orders.", "Meaning trades flat as the universe declines to comment.", "Local man learns he has been a background character all along.", "The color blue enters a quiet period ahead of earnings.", "Sunday extended indefinitely pending review.", "Your reflection files for independence.", "Time briefly moved sideways near the frozen food aisle.", "Clocks reach consensus for the first time. Experts alarmed.", "The sea quietly forgets its name. Tides unaffected.", "Moon confirms it was a dream. Dreamers asked to remain calm.", "Gravity requests something in return.", "Last Thursday reported missing. Last seen being Thursday.", "Study: 4 in 5 memories are from a slightly different timeline.", "Silence now fully priced in.", "Nostalgia futures spike as the present underperforms.", "Everything is happening at once, again.", "The horizon has moved. No one was consulted.", "Déjà vu rally enters its second day. Its second day.", "Infinity revised downward.", "Tomorrow postponed for lack of interest.", "The past is still there, just closed to visitors.", "The void announces a loyalty program.", "Stars report being slightly further away than yesterday.", "Your childhood home has been asking about you.", "Entropy beats estimates for the 13.8 billionth year running.", "A minute somewhere lasted an hour. Investigation ongoing.", "Philosophers short meaning, go long on snacks.", "The fog has hired a press secretary.", "Morning arrives early, apologizes.", "Shadows lengthen. Shadows deny it.", "Wednesday and Thursday merge in all-stock deal.", "Report: you have been here before.", "Dreams move to a subscription model.", "The ocean has started keeping a diary.", "The present moment is already over.", "Lighthouses report seeing something. Decline to elaborate.", "Hourglass sand declared a finite resource.", "Echo replies before the call. Physicists concerned.", "Inflation hits the number seven.", "The sky renewed for another season.", "Sleep exits beta.", "Rain falls upward in one town. Locals 'not surprised'.", "Mirror market halted after everyone bought themselves.", "Your name is trending in a dream you weren't invited to.", "Map adds a place nobody has been. Demand surges.", "Reality beta ends Friday. Feedback welcome.", "The moon is now taking questions.", "Elevator stuck between floors of meaning.", "Calendar adds an eighth day, refuses to name it.", "Light from a dead star arrives on time anyway.", "Wind announces a direction change, then denies it.", "A forgotten word is reportedly 'almost back'.", "Coincidences up 40% year over year.", "Weekend sentiment collapses as Monday is priced in.", "Fate tightens the spread on everything.", "A door you never opened is still waiting.", "The universe has read your message. No reply.", "Gravity issues statement: 'still here'.", "Analysts unable to locate the present."]
const mkNews = (i) => MK_NEWS[((i % MK_NEWS.length) + MK_NEWS.length) % MK_NEWS.length]
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
// ---------- W-10 GAMES THAT PLAY THEMSELVES ----------
// Each refresh is a turn. State is saved on the phone, and plugging the phone in is the one real control:
// it feeds the Halcyon specimen, docks the Deep Range drone, and makes camp on the Long Road.
function gRng(st) { return () => { st.seed = (st.seed * 9301 + 49297) % 233280; return st.seed / 233280 } }
function gLog(st, m) { st.log = (st.log || []).concat([{ m, n: st.turn }]).slice(-8) }
const gClamp = (v) => Math.max(0, Math.min(100, v))
const gPick = (r, a) => a[Math.floor(r() * a.length) % a.length]
function gBar(k, x, y, w, h, f, on, off) { k.rect(x, y, w, h, off); k.rect(x, y, Math.max(1, w * Math.max(0, Math.min(1, f))), h, on) }

// text that never breaks off: shrink to fit, then wrap, never an ellipsis; small sizes get a readable floor
function gT(k, text, x, y, size, col, o) {
  o = o || {}; const f = o.f || "mono", w = (o.w || 320), est = f === "disp" ? 0.53 : 0.63, str = String(text)
  let fs = Math.max(size, o.floor == null ? 6.2 : o.floor); const opt = Object.assign({}, o, { nofit: true })
  if (str.length * fs * est <= w) { k.t(str, x, y, fs, col, opt); return { lines: 1, fs } }
  const s2 = w / (str.length * est), min = Math.max(5.6, fs * 0.74)
  if (s2 >= min) { k.t(str, x, y, s2, col, opt); return { lines: 1, fs: s2 } }
  const maxL = o.lines || 2; let ls = k.wrap(str, w * 0.97, fs, f)
  while (ls.length > maxL && fs > 5.6) { fs -= 0.4; ls = k.wrap(str, w * 0.97, fs, f) }
  ls.forEach((l, i) => k.t(l, x, y + i * fs * 1.18, fs, col, opt)); return { lines: ls.length, fs }
}
// a log that shows whole entries only, newest first, wrapped to the column, stopping before it would overflow
function gLogBlock(k, logs, x, y, w, maxY, size, f, c1, c2, prefix) {
  let yy = y; const lh = size * 1.2
  for (let i = 0; i < logs.length; i++) { const ls = k.wrap((prefix || "") + logs[i].m, w * 0.97, size, f); if (yy + ls.length * lh > maxY + 0.5) break; ls.forEach((l, j) => k.t(l, x + (j && prefix ? size * 0.63 * prefix.length : 0), yy + j * lh, size, i ? c2 : c1, { f, w, nofit: true })); yy += ls.length * lh + size * 0.3 }
  return yy
}
// ---------- character variety: every new run gets its own look ----------
function gVar(st, salt, n) { let h = (((st.run || 1) * 2654435761) ^ (salt * 40503) ^ ((st.vseed || 0) * 97)) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) % n; }
const gRot = (x, y, a, px, py) => [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)];
function gDrone(k, x, y, a, type, col, ink) {
  const P = (pts) => pts.map(([px, py]) => gRot(x, y, a, px, py));
  if (type === 0) k.poly(P([[8, 0], [-6, 5], [-3, 0], [-6, -5]]), col);
  else if (type === 1) { k.poly(P([[-7, -4], [5, -4], [5, 4], [-7, 4]]), col); k.poly(P([[5, -3], [10, 0], [5, 3]]), col); k.ln(P([[-3, -4], [-3, 4]]), ink, 1); }
  else if (type === 2) { k.circ(x, y, 5.5, null, col, 1.8); k.circ(x, y, 1.8, col); k.poly(P([[-5, -3], [-10, -6], [-8, 0]]), col); k.poly(P([[-5, 3], [-10, 6], [-8, 0]]), col); }
  else if (type === 3) { k.ln(P([[-7, -4], [6, -4]]), col, 2.4); k.ln(P([[-7, 4], [6, 4]]), col, 2.4); k.circ(x, y, 3, col); k.ln(P([[3, -4], [3, 4]]), col, 1.2); }
  else { k.ell(x, y, 8, 4, col); k.circ(x, y - 2, 2.6, k.a("#FFFFFF", 0.8)); }
}
function gTraveller(k, x, y, s, look, ink, red) {
  const cloak = [red, k.a("#4E6B3A", 1), k.a("#3A5A8A", 1), k.a("#B88A2E", 1)][look.cloak];
  k.ln([[x - 2 * s, y - 3 * s], [x - 3 * s, y + 3 * s]], ink, 1.3 * s); k.ln([[x + 2 * s, y - 3 * s], [x + 3 * s, y + 3 * s]], ink, 1.3 * s);
  k.poly([[x - 4 * s, y - 14 * s], [x + 4 * s, y - 14 * s], [x + 6 * s, y - 2 * s], [x - 6 * s, y - 2 * s]], cloak, ink, 0.8);
  k.circ(x, y - 17 * s, 2.6 * s, ink);
  if (look.hat === 1) k.poly([[x - 3.6 * s, y - 16 * s], [x, y - 22 * s], [x + 3.6 * s, y - 16 * s]], cloak, ink, 0.6);
  else if (look.hat === 2) { k.rect(x - 6 * s, y - 19 * s, 12 * s, 1.6 * s, ink); k.rect(x - 2.6 * s, y - 22.5 * s, 5.2 * s, 3.6 * s, ink); }
  else if (look.hat === 3) { k.poly([[x - 3 * s, y - 19 * s], [x + 3 * s, y - 19 * s], [x + 1 * s, y - 22 * s]], ink); k.ln([[x + 1 * s, y - 22 * s], [x + 6 * s, y - 26 * s]], red, 1 * s); }
  if (look.carry === 0) { k.ln([[x + 6 * s, y - 12 * s], [x + 7 * s, y - 6 * s]], ink, 0.8); k.circ(x + 7 * s, y - 5 * s, 1.8 * s, k.a("#F2B33D", 1)); }
  else if (look.carry === 1) k.ln([[x + 6 * s, y - 20 * s], [x + 8 * s, y + 3 * s]], ink, 1.1 * s);
  else { k.ell(x - 7 * s, y - 9 * s, 2.8 * s, 3.6 * s, k.a("#B88A2E", 1), ink, 0.6); k.ln([[x - 7 * s, y - 12 * s], [x - 7 * s, y - 18 * s]], ink, 0.8); }
  const cx = x + 11 * s, cy = y + 2 * s;
  if (look.comp === 1) { k.ell(cx, cy - 3 * s, 4 * s, 2.4 * s, ink); k.circ(cx + 4 * s, cy - 5 * s, 1.8 * s, ink); k.ln([[cx - 4 * s, cy - 4 * s], [cx - 6 * s, cy - 7 * s]], ink, 0.8); }
  else if (look.comp === 2) { const by = y - 24 * s; k.ln([[x + 4 * s, by + 2 * s], [x + 7 * s, by], [x + 10 * s, by + 2 * s]], ink, 1); }
  else if (look.comp === 3) { k.ell(cx + 2 * s, cy - 5 * s, 6 * s, 3.4 * s, k.a("#8A8A8A", 1), ink, 0.6); k.circ(cx + 8 * s, cy - 8 * s, 2.4 * s, k.a("#8A8A8A", 1), ink, 0.6); k.ln([[cx - 2 * s, cy - 2 * s], [cx - 2 * s, cy + 1 * s]], ink, 0.8); k.ln([[cx + 6 * s, cy - 2 * s], [cx + 6 * s, cy + 1 * s]], ink, 0.8); }
  else if (look.comp === 4) { k.ell(cx, cy - 2 * s, 3.4 * s, 2 * s, ink); k.circ(cx + 3 * s, cy - 4 * s, 1.6 * s, ink); k.ln([[cx - 3 * s, cy - 2 * s], [cx - 5 * s, cy - 6 * s]], ink, 0.8); }
}
function gApprentice(k, x, y, s, robe, hat, ink, gold) {
  k.poly([[x, y - 18 * s], [x + 8 * s, y], [x - 8 * s, y]], robe, ink, 0.6); k.circ(x, y - 20 * s, 3.2 * s, k.a("#E9D7B8", 1), ink, 0.6);
  if (hat === 0) { k.poly([[x - 6 * s, y - 22 * s], [x + 6 * s, y - 22 * s], [x + 1 * s, y - 34 * s]], robe, ink, 0.6); k.circ(x + 1 * s, y - 34 * s, 1 * s, gold); }
  else if (hat === 1) k.ln(k.arcPts(x, y - 20 * s, 4.6 * s, Math.PI * 1.05, Math.PI * 1.95, 10), robe, 2.2 * s);
  else { k.ln([[x - 3.4 * s, y - 22.5 * s], [x + 3.4 * s, y - 22.5 * s]], gold, 1); k.circ(x, y - 23 * s, 1.1 * s, k.a("#5FD1C1", 1)); }
  k.ln([[x + 6 * s, y - 14 * s], [x + 10 * s, y - 26 * s]], ink, 0.9); k.circ(x + 10 * s, y - 27 * s, 1.6 * s, gold);
}
function gFamiliar(k, x, y, s, kind, ink, col) {
  if (kind === 0) { k.ell(x, y, 5 * s, 6 * s, col, ink, 0.6); k.circ(x - 2 * s, y - 2 * s, 1.6 * s, k.a("#FFFFFF", 1)); k.circ(x + 2 * s, y - 2 * s, 1.6 * s, k.a("#FFFFFF", 1)); k.circ(x - 2 * s, y - 2 * s, 0.7 * s, ink); k.circ(x + 2 * s, y - 2 * s, 0.7 * s, ink); }
  else if (kind === 1) { k.circ(x, y, 4.4 * s, ink); k.poly([[x - 4 * s, y - 2 * s], [x - 3 * s, y - 7 * s], [x - 0.5 * s, y - 3 * s]], ink); k.poly([[x + 4 * s, y - 2 * s], [x + 3 * s, y - 7 * s], [x + 0.5 * s, y - 3 * s]], ink); k.circ(x - 1.6 * s, y - 0.5 * s, 0.8 * s, col); k.circ(x + 1.6 * s, y - 0.5 * s, 0.8 * s, col); }
  else if (kind === 2) { k.ell(x, y, 6 * s, 3.6 * s, k.a("#5E8C4A", 1), ink, 0.6); k.circ(x - 2.4 * s, y - 3 * s, 1.6 * s, k.a("#5E8C4A", 1), ink, 0.5); k.circ(x + 2.4 * s, y - 3 * s, 1.6 * s, k.a("#5E8C4A", 1), ink, 0.5); }
  else { k.ell(x - 4 * s, y, 4 * s, 2.6 * s, col, ink, 0.5); k.ell(x + 4 * s, y, 4 * s, 2.6 * s, col, ink, 0.5); k.ln([[x, y - 3 * s], [x, y + 3 * s]], ink, 1.2); }
}
function gMask(k, x, y, s, look, ink, panel, eye) {
  const E = (dx, ang, bend) => { const p = [[0, 0], [-4, -11], [bend, -30], [4, -11]].map(([px, py]) => gRot(x + dx * s, y - 12 * s, ang, px * s, py * s)); k.poly(p, ink); };
  if (look.ears === 0) { E(-7, -0.15, 0); E(7, 0.15, 0); } else if (look.ears === 1) { E(-7, -0.15, 0); E(7, 0.6, 6); } else { E(-8, -0.35, 0); E(-3, -0.05, 0); E(8, 0.3, 0); }
  k.poly([[x - 16 * s, y - 13 * s], [x + 16 * s, y - 13 * s], [x + 14 * s, y + 3 * s], [x, y + 18 * s], [x - 14 * s, y + 3 * s]], ink);
  if (look.stripe) k.poly([[x - 16 * s, y - 13 * s], [x - 8 * s, y - 13 * s], [x - 6 * s, y + 10 * s], [x - 14 * s, y + 3 * s]], k.a(panel, 0.35));
  [-1, 1].forEach(sd => k.poly([[x + sd * 2 * s, y - 4 * s], [x + sd * 12 * s, y - 7 * s], [x + sd * 10 * s, y - 2 * s]], eye));
}
function gRunner(k, x, y, s, look, ink, visor, chrome) {
  k.ln(k.arcPts(x, y + 22 * s, 18 * s, Math.PI * 1.1, Math.PI * 1.9, 12), ink, 6 * s);
  k.circ(x, y, 9 * s, k.a("#C9A07E", 1));
  const hair = [k.a("#FF2E88", 1), k.a("#00F0FF", 1), k.a("#FCEE0A", 1), k.a("#E8E8F0", 1)][look.hairCol];
  if (look.hair === 0) for (let i = -2; i <= 2; i++) k.poly([[x + i * 2.6 * s - 1.4 * s, y - 7 * s], [x + i * 2.6 * s, y - 16 * s + Math.abs(i) * 2 * s], [x + i * 2.6 * s + 1.4 * s, y - 7 * s]], hair);
  else if (look.hair === 1) { k.ln(k.arcPts(x, y - 1 * s, 10 * s, Math.PI * 1.0, Math.PI * 2.0, 12), hair, 4 * s); k.rect(x - 10 * s, y - 1 * s, 3 * s, 8 * s, hair); k.rect(x + 7 * s, y - 1 * s, 3 * s, 8 * s, hair); }
  else if (look.hair === 2) k.ln(k.arcPts(x, y, 9 * s, Math.PI * 1.15, Math.PI * 1.85, 10), hair, 2.4 * s);
  else { k.ln(k.arcPts(x, y - 1 * s, 10 * s, Math.PI * 1.0, Math.PI * 2.0, 12), hair, 3 * s); k.rect(x - 11 * s, y, 3 * s, 16 * s, hair); k.rect(x + 8 * s, y, 3 * s, 16 * s, hair); }
  k.rect(x - 8 * s, y - 2.5 * s, 16 * s, 4 * s, visor);
  if (look.chrome) k.ln([[x + 3 * s, y + 4 * s], [x + 8 * s, y + 1 * s]], chrome, 1.4);
}
function gMascot(k, x, y, s, kind) {
  if (kind === 0) { k.poly([[x - 9 * s, y + 3 * s], [x - 2 * s, y - 6 * s], [x + 8 * s, y - 2 * s], [x + 11 * s, y - 3 * s], [x + 9 * s, y], [x - 5 * s, y + 4 * s], [x - 11 * s, y + 7 * s]], k.a("#01CDFE", 1)); k.poly([[x - 1 * s, y - 5 * s], [x + 2 * s, y - 9 * s], [x + 3 * s, y - 4 * s]], k.a("#01CDFE", 1)); }
  else if (kind === 1) { k.ell(x, y - 2 * s, 6 * s, 4 * s, k.a("#FF71CE", 1)); k.ln([[x + 3 * s, y - 4 * s], [x + 5 * s, y - 12 * s], [x + 8 * s, y - 10 * s]], k.a("#FF71CE", 1), 2 * s); k.ln([[x - 1 * s, y + 2 * s], [x - 1 * s, y + 10 * s]], k.a("#FF71CE", 1), 1); }
  else if (kind === 2) { k.ln([[x, y + 10 * s], [x + 1 * s, y - 6 * s]], k.a("#6B3F2A", 1), 2 * s); [-0.8, -0.2, 0.4, 1.0, 2.2, 2.8].forEach(a => k.ln([[x + 1 * s, y - 6 * s], [x + 1 * s + 10 * s * Math.cos(a + Math.PI), y - 6 * s + 6 * s * Math.sin(a + Math.PI) + 3 * s]], k.a("#2FAE7A", 1), 2 * s)); }
  else { k.circ(x, y - 4 * s, 6 * s, k.a("#F4EEF8", 1)); k.rect(x - 7 * s, y + 2 * s, 14 * s, 8 * s, k.a("#F4EEF8", 1)); k.rect(x - 5 * s, y - 6 * s, 4 * s, 2 * s, k.a("#101018", 1)); k.rect(x + 1 * s, y - 6 * s, 4 * s, 2 * s, k.a("#101018", 1)); }
}
function gKeeper(k, x, y, s, kind, ink, col) {
  if (kind === 0) { k.ell(x, y, 10 * s, 6 * s, k.a("#6E6E6E", 1), ink, 0.7); k.poly([[x + 6 * s, y - 4 * s], [x + 14 * s, y], [x + 6 * s, y + 3 * s]], k.a("#F4EEDF", 1), ink, 0.6); k.ln([[x + 6 * s, y - 3 * s], [x + 13 * s, y]], ink, 1.4); k.circ(x + 13 * s, y, 1 * s, ink); }
  else if (kind === 1) { k.ell(x, y, 7 * s, 9 * s, k.a("#8A6A44", 1), ink, 0.7); k.circ(x - 3 * s, y - 3 * s, 2.6 * s, k.a("#FFFFFF", 1), ink, 0.5); k.circ(x + 3 * s, y - 3 * s, 2.6 * s, k.a("#FFFFFF", 1), ink, 0.5); k.circ(x - 3 * s, y - 3 * s, 1 * s, ink); k.circ(x + 3 * s, y - 3 * s, 1 * s, ink); k.poly([[x - 1 * s, y], [x + 1 * s, y], [x, y + 2 * s]], col); }
  else if (kind === 2) { k.poly([[x - 9 * s, y + 4 * s], [x - 8 * s, y - 4 * s], [x - 4 * s, y - 11 * s], [x - 1 * s, y - 4 * s], [x + 3 * s, y - 4 * s], [x + 6 * s, y - 11 * s], [x + 9 * s, y - 4 * s], [x + 10 * s, y + 4 * s], [x, y + 10 * s]], col, ink, 0.7); k.circ(x - 3 * s, y - 1 * s, 1 * s, ink); k.circ(x + 4 * s, y - 1 * s, 1 * s, ink); }
  else { k.poly([[x - 10 * s, y + 4 * s]].concat(Array.from({ length: 9 }, (_, i) => { const a = Math.PI + i * Math.PI / 8, rr = i % 2 ? 11 * s : 8 * s; return [x + rr * Math.cos(a), y + rr * 0.7 * Math.sin(a)]; })).concat([[x + 10 * s, y + 4 * s]]), k.a("#8A6A44", 1), ink, 0.6); k.circ(x + 11 * s, y + 2 * s, 1.4 * s, ink); }
}
function gTrader(k, x, y, s, kind, ink, col) {
  k.circ(x, y, 12 * s, k.a("#000000", 0.25), col, 1);
  if (kind === 0) { k.ell(x - 1 * s, y + 1 * s, 7 * s, 4 * s, col); k.poly([[x + 5 * s, y + 1 * s], [x + 10 * s, y - 4 * s], [x + 10 * s, y + 5 * s]], col); k.circ(x - 4 * s, y, 0.9 * s, ink); }
  else if (kind === 1) { k.poly([[x - 8 * s, y + 4 * s], [x + 1 * s, y - 8 * s], [x + 4 * s, y + 4 * s]], col); k.ln([[x - 9 * s, y + 5 * s], [x + 9 * s, y + 5 * s]], col, 1.2); }
  else if (kind === 2) { k.circ(x, y + 2 * s, 5 * s, col); k.ln([[x - 4 * s, y - 2 * s], [x - 9 * s, y - 7 * s], [x - 7 * s, y - 9 * s]], col, 1.6); k.ln([[x + 4 * s, y - 2 * s], [x + 9 * s, y - 7 * s], [x + 7 * s, y - 9 * s]], col, 1.6); }
  else { k.circ(x - 3 * s, y, 3 * s, col); k.circ(x + 3 * s, y, 3 * s, col); k.circ(x - 3 * s, y, 1.2 * s, ink); k.circ(x + 3 * s, y, 1.2 * s, ink); }
}
function gEmblem(k, x, y, r, kind, col, fill) {
  if (kind === 0) k.hex(x, y, r, fill, col, 1);
  else if (kind === 1) k.poly([[x - r, y - r * 0.8], [x + r, y - r * 0.8], [x + r * 0.8, y + r * 0.3], [x, y + r], [x - r * 0.8, y + r * 0.3]], fill, col, 1);
  else if (kind === 2) k.circ(x, y, r, fill, col, 1);
  else k.poly([[x, y - r], [x + r, y + r * 0.8], [x - r, y + r * 0.8]], fill, col, 1);
}
function gMarker(k, x, y, kind, col) {
  if (kind === 0) k.poly([[x, y - 3.4], [x + 3.4, y], [x, y + 3.4], [x - 3.4, y]], col);
  else if (kind === 1) k.poly([[x, y - 3.8], [x + 3.4, y + 2.6], [x - 3.4, y + 2.6]], col);
  else if (kind === 2) k.rect(x - 2.8, y - 2.8, 5.6, 5.6, col);
  else k.ln([[x - 3.4, y + 1.8], [x, y - 2.2], [x + 3.4, y + 1.8]], col, 1.8);
}
function gSafe(k) { if (k.__safe) return k; const s = Object.assign({}, k); s.__safe = true; s.t = (text, x, y, size, col, o) => { gT(k, text, x, y, size, col, o) }; return s }
const GAMES = {
  // HALCYON: an abstract organism grown in a containment vat. Not a pet. A product.
  halcyon: {
    title: "W-10 // SPECIMEN VAT",
    stages: ["SPORE", "LARVA", "JUVENILE", "SPECIMEN", "ASCENDANT"], th: [0, 6, 18, 40, 80],
    morph: ["SEED NUCLEUS", "HELICAL STRAND", "MEMBRANE LATTICE", "RADIAL BLOOM", "LATTICE SPHERE"],
    TRAITS: ["secondary nucleus", "bioluminescence", "redundant heart", "sensory filaments", "unauthorized opinions", "crystalline lattice", "neural bloom"],
    OLD: { "a second eye": "secondary nucleus", "an extra heart": "redundant heart", "feelers": "sensory filaments", "opinions": "unauthorized opinions", "a tiny crown": "crystalline lattice", "gills": "neural bloom" },
    init(now, prev) { const run = prev ? prev.run + 1 : 1; return { v: 1, vseed: (now % 99991), game: "halcyon", run, lot: `HB-2893-${String(13 + run).padStart(2, "0")}`, stage: 0, age: 0, growth: 0, nut: 62, vit: 80, stress: 18, traits: [], hist: [80], shist: [18], best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed: (now % 233280) || 11, last: prev ? prev.last : 0 } },
    migrate(st) { const G = GAMES.halcyon; st.traits = (st.traits || []).map(t => G.OLD[t] || t); st.shist = st.shist || [st.stress]; st.growth = st.growth ?? st.age; return st },
    right(st, inp) { return inp.charging ? "FEEDING · CHARGING" : `LOT ${st.lot}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.halcyon, night = inp.hour < 6 || inp.hour >= 23
      st.growth = st.growth ?? st.age; st.turn++; st.age++; if (inp.charging) st.growth++
      if (inp.charging) { st.nut += 22; gLog(st, "Nutrient line open via charging port. +22.") } else st.nut -= 5
      if (night) { st.stress -= 8; st.vit += 3; if (r() < 0.5) gLog(st, gPick(r, ["Night cycle. Dormant. Dreaming of protein.", "Night cycle. Metabolism throttled to 12%.", "Lights down. Specimen counting something."])) }
      if (inp.busy >= 4 && !night) { st.stress += 7; gLog(st, `${inp.busy} allocations today. Specimen agitated.`) }
      if (inp.batt < 0.2 && !inp.charging) { st.vit -= 6; gLog(st, "Low power. Luminance falling.") }
      st.vit += (st.nut > 40 ? 2 : -6) - (st.stress > 70 ? 5 : 0)
      const e = r()
      if (e < 0.12) { const left = G.TRAITS.filter(t => !st.traits.includes(t)); if (left.length) { const t = gPick(r, left); st.traits.push(t); gLog(st, `Mutation logged: ${t}. Filed under assets.`) } }
      else if (e < 0.19) gLog(st, gPick(r, ["Specimen pattern-matched a technician's face. Logged.", "Unscheduled cognition detected. Flagged for review.", "Specimen requested a name. Request denied."]))
      else if (e < 0.25) { st.stress += 6; gLog(st, "Containment breach probability 4%. Lid re-sealed.") }
      else if (e < 0.31) { st.vit += 4; gLog(st, "Specimen emitted the compliance anthem at 40 Hz.") }
      else if (e < 0.36) { st.stress -= 5; gLog(st, "Technician lingered at the glass. Stress -5.") }
      else if (e < 0.42) gLog(st, gPick(r, ["Membrane resequenced. Integrity holding.", "Mass gain within projection.", "Lattice self-repair complete."]))
      st.nut = gClamp(st.nut); st.vit = gClamp(st.vit); st.stress = gClamp(st.stress)
      if (inp.charging && st.stage < 4 && st.growth >= G.th[st.stage + 1] && st.vit > 45) { st.stage++; gLog(st, `Growth milestone: ${G.stages[st.stage]}. Morphology: ${G.morph[st.stage].toLowerCase()}.`) }
      st.hist = (st.hist || []).concat([st.vit]).slice(-24); st.shist = (st.shist || []).concat([st.stress]).slice(-24)
      if (st.vit <= 0) { const best = Math.max(st.best || 0, st.age), old = st.lot; Object.assign(st, G.init(Date.now(), st)); st.best = best; gLog(st, `Lot ${old} recycled into feedstock. Lot ${st.lot} opened.`) }
    },
    // abstract organism, drawn as Halcyon line work: one morphology per stage, traits as modifications
    organism(k, cx, cy, R, st, inp, TM) {
      const vv = gVar(st, 7, 4), dir = vv % 2 ? -1 : 1, I = k.I, LAV = [(T.altBg || "#9D8CF2"), "#7FE3F0", "#3FCF9A", "#C9A7F2"][vv], ICE = ["#7FE3F0", "#9D8CF2", "#7FE3F0", "#3FCF9A"][vv], has = (t) => st.traits.includes(t), pulse = 1 + 0.06 * Math.sin(TM / 2)
      const glow = has("bioluminescence") || inp.charging
      if (glow) for (let g = 4; g >= 1; g--) k.circ(cx, cy, R * (1.05 + g * 0.18), k.a(LAV, 0.07))
      // containment field: rotating dashed rings and tick marks
      for (let i = 0; i < 48; i += 2) { const a0 = i / 48 * Math.PI * 2 + dir * TM / 18, a1 = a0 + Math.PI / 48; k.ln(k.arcPts(cx, cy, R * 1.32, a0, a1, 3), k.ia(0.35), 0.7) }
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 - TM / 25, l = i % 6 ? 2 : 5; k.ln([[cx + R * 1.45 * Math.cos(a), cy + R * 1.45 * Math.sin(a)], [cx + (R * 1.45 + l) * Math.cos(a), cy + (R * 1.45 + l) * Math.sin(a)]], k.ia(0.45), 0.6) }
      // orbiting particles; neural bloom wires them together
      const parts = []; for (let i = 0; i < 7 + st.stage * 2 + vv * 2; i++) { const a = i / (7 + st.stage * 2) * Math.PI * 2 + TM / (8 + i % 3 * 3), rr = R * (1.12 + 0.12 * Math.sin(i * 1.7 + TM / 6)); parts.push([cx + rr * Math.cos(a), cy + rr * 0.86 * Math.sin(a)]) }
      if (has("neural bloom")) parts.forEach((p, i) => { const q = parts[(i + 3) % parts.length]; k.ln([p, q], k.a(LAV, 0.35), 0.5) })
      parts.forEach((p, i) => k.circ(p[0], p[1], i % 3 ? 0.9 : 1.6, i % 3 ? k.ia(0.6) : k.a(LAV, 1)))
      const s = st.stage
      if (s === 0) {
        ;[1, 0.72, 0.46].forEach((f, i) => k.circ(cx, cy, R * f * (i === 0 ? pulse : 1), i === 1 ? k.a(LAV, 0.25) : null, I, i === 0 ? 1 : 0.7))
        k.circ(cx, cy, R * 0.2 * pulse, k.a(LAV, 1), I, 0.8)
      } else if (s === 1) {
        const L = R * 1.15
        for (let j = 0; j <= 22; j++) { const t = j / 22, y = cy - L + 2 * L * t, ph = t * Math.PI * (3 + vv) + TM / 3, x1 = cx + Math.sin(ph) * R * (0.34 + vv * 0.04), x2 = cx - Math.sin(ph) * R * (0.34 + vv * 0.04); if (j % 2 === 0) k.ln([[x1, y], [x2, y]], k.ia(0.35), 0.6); if (j < 22) { const t2 = (j + 1) / 22, y2 = cy - L + 2 * L * t2, ph2 = t2 * Math.PI * 4 + TM / 3; k.ln([[x1, y], [cx + Math.sin(ph2) * R * 0.42, y2]], I, 1.1); k.ln([[x2, y], [cx - Math.sin(ph2) * R * 0.42, y2]], k.a(LAV, 1), 1.1) } if (j % 4 === 0) k.circ(x1, y, 1.4, I) }
        k.circ(cx, cy, R * 0.16 * pulse, k.a(LAV, 1), I, 0.8)
      } else if (s === 2) {
        const hr = R * 0.36 * pulse, cells = [[0, 0]].concat([0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * Math.PI / 3 + Math.PI / 6) * hr * 1.75, Math.sin(i * Math.PI / 3 + Math.PI / 6) * hr * 1.75]))
        k.circ(cx, cy, R * 0.98, k.a(LAV, 0.12), I, 0.9)
        cells.forEach(([dx, dy], i) => { k.hex(cx + dx, cy + dy, hr, i === 0 ? k.a(LAV, 0.5) : k.a(T.panel, 0.9), I, 0.9, 0); k.circ(cx + dx + Math.sin(TM / 4 + i) * hr * 0.2, cy + dy, hr * 0.22, i === 0 ? I : k.a(LAV, 1)) })
      } else if (s === 3) {
        const NF = 12 + vv * 2; for (let i = 0; i < NF; i++) { const a = i / NF * Math.PI * 2 + dir * TM / 30, pts = []; for (let j = 0; j <= 10; j++) { const t = j / 10, rr = R * (0.32 + 0.78 * t), bend = Math.sin(t * 3 + TM / 3 + i) * 0.25 * t; pts.push([cx + rr * Math.cos(a + bend), cy + rr * Math.sin(a + bend)]) } k.ln(pts, i % 2 ? I : k.a(LAV, 1), i % 2 ? 0.9 : 1.2); const e = pts[pts.length - 1]; k.circ(e[0], e[1], 1.5, i % 2 ? I : k.a(LAV, 1)) }
        ;[0.36, 0.26].forEach((f, i) => { k.circ(cx, cy, R * f, i ? k.a(LAV, 0.5) : k.a(T.panel, 0.95), I, 1); for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2 + (i ? -TM / 6 : TM / 8); k.ln([[cx + R * f * 0.7 * Math.cos(a), cy + R * f * 0.7 * Math.sin(a)], [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)]], I, 0.6) } })
        k.circ(cx, cy, R * 0.1 * pulse, I)
      } else {
        const rot = TM / 10
        k.circ(cx, cy, R, k.a(LAV, 0.14), I, 1.1)
        for (let i = 1; i < 6; i++) { const lat = -Math.PI / 2 + i * Math.PI / 6; k.ell(cx, cy + R * Math.sin(lat), R * Math.cos(lat), R * 0.14 * Math.cos(lat), null, k.ia(0.45), 0.6) }
        for (let i = 0; i < 6; i++) { const ph = rot + i * Math.PI / 6, w = Math.abs(Math.cos(ph)) * R; if (w > 1) k.ell(cx, cy, w, R, null, i === 0 ? k.a(LAV, 1) : k.ia(0.45), i === 0 ? 1.1 : 0.6) }
        k.ell(cx, cy, R * 1.25, R * 0.28, null, k.a(LAV, 1), 1); const oa = TM / 4; k.circ(cx + R * 1.25 * Math.cos(oa), cy + R * 0.28 * Math.sin(oa), 2.4, k.a(LAV, 1), I, 0.6)
        k.circ(cx, cy, R * 0.12 * pulse, I)
      }
      // trait modifications
      if (has("secondary nucleus")) { const a = TM / 5; k.circ(cx + R * 0.55 * Math.cos(a), cy + R * 0.45 * Math.sin(a), R * 0.1, k.a(LAV, 1), I, 0.7) }
      if (has("redundant heart")) { const p2 = 1 + 0.25 * Math.max(0, Math.sin(TM * 1.3)); k.circ(cx - R * 0.22, cy + R * 0.3, R * 0.07 * p2, k.a("#E35D8F", 0.9)); k.circ(cx + R * 0.22, cy + R * 0.3, R * 0.07 * (2.2 - p2), k.a("#E35D8F", 0.9)) }
      if (has("sensory filaments")) for (let i = 0; i < 5; i++) { const x = cx - R * 0.5 + i * R * 0.25, pts = []; for (let j = 0; j <= 8; j++) pts.push([x + Math.sin(TM / 2 + i + j * 0.6) * 3, cy - R * 0.9 - j * R * 0.11]); k.ln(pts, k.ia(0.7), 0.6); k.circ(pts[8][0], pts[8][1], 1, k.a(LAV, 1)) }
      if (has("crystalline lattice")) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + TM / 40; k.poly([[cx + R * 0.9 * Math.cos(a), cy + R * 0.9 * Math.sin(a)], [cx + R * 1.12 * Math.cos(a + 0.18), cy + R * 1.12 * Math.sin(a + 0.18)], [cx + R * 0.9 * Math.cos(a + 0.36), cy + R * 0.9 * Math.sin(a + 0.36)]], k.a(ICE, 0.5), I, 0.6) }
      if (has("unauthorized opinions")) { const jit = []; for (let i = 0; i <= 36; i++) { const a = i / 36 * Math.PI * 2; jit.push([cx + R * (1.2 + (i % 2 ? 0.06 : -0.02) * (1 + Math.sin(TM + i))) * Math.cos(a), cy + R * (1.2 + (i % 2 ? 0.06 : -0.02)) * 0.86 * Math.sin(a)]) } k.ln(jit, k.a("#E35D8F", 0.6), 0.6) }
      if (st.stress > 60) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + TM; k.ln([[cx + R * 1.02 * Math.cos(a), cy + R * 1.02 * Math.sin(a)], [cx + R * 1.12 * Math.cos(a + 0.08), cy + R * 1.12 * Math.sin(a + 0.08)]], I, 0.8) }
    },
    vat(k, vx, vy, vw, vh, st, inp, TM, small) {
      const I = k.I, LAV = (T.altBg || "#9D8CF2")
      k.rect(vx + vw * 0.28, vy - 3, 4, 9, I); k.rect(vx + vw * 0.64, vy - 3, 4, 9, I)
      if (inp.charging) { k.rect(vx + vw * 0.28 + 1, vy - 3, 2, 9, k.a(LAV, 1)); for (let i = 0; i < 5; i++) { const dy = (TM * 14 + i * 22) % (vh * 0.45); k.circ(vx + vw * 0.28 + 2, vy + 10 + dy, 1.5, k.a(LAV, 0.9)) } }
      k.rect(vx, vy + 6, vw, vh - 14, k.a(LAV, 0.12), I, 1.2)
      for (let i = 0; i < 8; i++) k.rect(vx + 1, vy + 7 + i * (vh - 16) / 8, vw - 2, (vh - 16) / 16, k.a(LAV, 0.03 + i * 0.012))
      k.ell(vx + vw / 2, vy + 6, vw / 2, 4, k.a(T.panel, 1), I, 1.2)
      // glass graduations, reflections and condensation
      for (let i = 0; i <= 10; i++) { const y = vy + 14 + i * (vh - 30) / 10; k.ln([[vx + vw - (i % 5 ? 4 : 8), y], [vx + vw - 1, y]], k.ia(0.55), 0.6); if (!small && i % 5 === 0) k.t(`${100 - i * 10}`, vx + vw - 10, y - 3, 4.5, k.ia(0.5), { a: "r", w: 14, nofit: true }) }
      k.ln([[vx + 5, vy + 12], [vx + 5, vy + vh - 14]], k.a("#FFFFFF", 0.7), 1.5); k.ln([[vx + 9, vy + 12], [vx + 9, vy + vh * 0.4]], k.a("#FFFFFF", 0.45), 0.8)
      const cr = k.rng(st.run * 3 + 1); for (let i = 0; i < (small ? 8 : 18); i++) k.circ(vx + 3 + cr() * (vw - 6), vy + 10 + cr() * 18, 0.5 + cr() * 0.7, k.a("#FFFFFF", 0.7))
      // bubbles
      const r = k.rng(st.run * 7 + 3)
      for (let i = 0; i < (small ? 8 : 16); i++) { const bx = vx + 8 + r() * (vw - 16), span = vh - 24, by = vy + vh - 14 - ((r() * span + TM * (6 + i % 3)) % span); k.circ(bx + Math.sin(TM / 3 + i) * 2, by, 0.8 + r() * 1.8, null, k.ia(0.4), 0.6) }
      // scanning laser sweeping the tank
      const sy = vy + 10 + ((TM * 9) % (vh - 24)); k.ln([[vx + 1, sy], [vx + vw - 1, sy]], k.a(LAV, 0.85), 0.9); k.rect(vx + 1, sy - 3, vw - 2, 3, k.a(LAV, 0.1))
      // base with status LEDs
      k.rect(vx - 3, vy + vh - 10, vw + 6, 12, I)
      for (let i = 0; i < 4; i++) { const on = (Math.floor(TM / (2 + i)) + i) % 2 === 0; k.circ(vx + 4 + i * 6, vy + vh - 4, 1.5, on ? k.a(i === 3 && inp.charging ? LAV : (T.ground || "#A6F3CC"), 1) : k.a("#FFFFFF", 0.2)) }
      k.t(st.lot, vx + vw - 2, vy + vh - 8, small ? 5 : 6, k.a(T.panel, 1), { a: "r", w: vw - 26, nofit: true })
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const G = GAMES.halcyon, TM = Date.now() / 60000, small = W < 200, big = H > 200, LAV = (T.altBg || "#9D8CF2"), I = k.I, S = k.S
      const vx = 12, vw = small ? 62 : big ? 128 : 76, vy = 8, vh = small ? H - 20 : big ? 250 : H - 18
      G.vat(k, vx, vy, vw, vh, st, inp, TM, small)
      const cx = vx + vw / 2, cy = vy + vh * 0.46 + Math.sin(TM / 4) * 2, R = (small ? 13 : big ? 30 : 17) * (0.75 + st.stage * 0.08)
      G.organism(k, cx, cy, R, st, inp, TM)
      if (!small) {
        // holographic bracket around the specimen with live readouts
        const bw = R * 1.75, bh = R * 1.75
        ;[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy2]) => { const x = cx + sx * bw, y = cy + sy2 * bh; k.ln([[x, y + -sy2 * 6], [x, y], [x + -sx * 6, y]], k.a(LAV, 0.9), 0.9) })
        k.t(`${G.morph[st.stage]} · ${'ABCD'[gVar(st, 7, 4)]}`, cx, cy - bh - 11, big ? 6.5 : 6, k.ia(0.75), { a: "c", w: vw - 6, lines: 1 })
        k.t(`M ${(0.02 + st.age * 0.015 * (1 + st.stage)).toFixed(2)}mg`, cx, cy + bh + 3, big ? 6.5 : 6, k.ia(0.75), { a: "c", w: vw - 6, lines: 1 })
      }
      const x0 = vx + vw + 14, rw = W - x0 - 12
      const cog = Math.min(100, st.stage * 18 + st.traits.length * 6 + (st.age % 7)), bpm = Math.round(48 + st.stress * 0.6 + (inp.charging ? 8 : 0))
      const status = small ? (inp.charging ? "FEEDING" : st.stress > 60 ? "AGITATED" : "NOMINAL") :
        (inp.charging ? "FEEDING // NUTRIENT LINE OPEN" : st.stress > 60 ? "CONTAINMENT // AGITATED" : "CONTAINMENT // NOMINAL")
      k.t(status, x0, 4, 7, inp.charging || st.stress > 60 ? k.a(LAV, 1) : S, { w: rw, f: "bold", lines: 1 })
      k.t(G.stages[st.stage], x0, small ? 16 : 13, small ? 13 : big ? 20 : 16, I, { f: "disp", w: rw })
      if (small) {
        ;[["VIT", st.vit], ["NUT", st.nut]].forEach(([l, v], i) => { const y = 36 + i * 17; k.t(`${l} ${Math.round(v)}`, x0, y, 6.8, S, { w: rw, lines: 1 }); gBar(k, x0, y + 9, rw, 4, v / 100, I, k.ia(0.12)) })
        k.t(`AGE ${st.age}`, x0, 74, 6.8, S, { w: rw, lines: 1 }); return
      }
      k.t(`AGE ${st.age} CYCLES · RUN ${st.run}${st.best ? " · BEST " + st.best : ""}`, x0, big ? 37 : 31, 6.5, S, { w: rw, lines: 1 })
      if (big) {
        // growth ladder
        const ly = 50, lw = rw - 8; k.ln([[x0 + 4, ly], [x0 + 4 + lw, ly]], k.ia(0.25), 1)
        const nxt = st.stage < 4 ? (st.age - G.th[st.stage]) / (G.th[st.stage + 1] - G.th[st.stage]) : 1
        k.ln([[x0 + 4, ly], [x0 + 4 + lw * Math.min(1, (st.stage + Math.min(1, nxt)) / 4), ly]], I, 1.6)
        G.stages.forEach((nm, i) => { const x = x0 + 4 + lw * i / 4; k.circ(x, ly, i === st.stage ? 3.5 : 2.4, i <= st.stage ? (i === st.stage ? k.a(LAV, 1) : I) : k.a(T.panel, 1), I, 0.8); k.t(nm.slice(0, 3), x, ly + 5, 6.2, i === st.stage ? I : S, { a: "c", w: 26, lines: 1 }) })
      }
      const bars = [["NUTRIENT", st.nut, I], ["VITALITY", st.vit, I], ["STRESS", st.stress, k.a(LAV, 1)]].concat(big ? [["COGNITION", cog, k.a("#7FE3F0", 1)]] : [])
      const by0 = big ? 66 : 42
      bars.forEach(([l, v, c], i) => { const y = by0 + i * 14; k.t(l, x0, y, 6.5, S, { w: rw - 34, lines: 1 }); k.t(`${Math.round(v)}`, x0 + rw, y, 6.8, I, { a: "r", w: 30 }); gBar(k, x0, y + 8, rw, 3.5, v / 100, c, k.ia(0.12)); for (let t = 1; t < 10; t++) k.ln([[x0 + rw * t / 10, y + 8], [x0 + rw * t / 10, y + 11.5]], k.a(T.panel, 0.8), 0.5) })
      // neural trace: EEG drifting with the clock
      const ey = big ? 128 : 86, eh = big ? 18 : 14
      k.t(`NEURAL // ${bpm} BPM`, x0, ey, 6.3, S, { w: rw - 60, lines: 1 }); k.t(inp.charging ? "INTAKE" : st.stress > 60 ? "SPIKING" : "STABLE", x0 + rw, ey, 6.3, inp.charging || st.stress > 60 ? k.a(LAV, 1) : S, { a: "r", w: 56, lines: 1 })
      const tr = []; for (let x = 0; x <= rw; x += 1.5) { const ph = (x + TM * 11) % 52; let y = Math.sin(x * 0.4 + TM) * 1.2 * (1 + st.stress / 60); if (ph > 34 && ph < 42) { const kk = (ph - 34) / 8; y -= Math.sin(kk * Math.PI * 2) * (eh / 2 - 1) * (kk < 0.5 ? 1 : 0.5) } tr.push([x0 + x, ey + 8 + eh / 2 + y]) }
      k.ln([[x0, ey + 8 + eh / 2], [x0 + rw, ey + 8 + eh / 2]], k.ia(0.12), 0.5); k.ln(tr, I, 0.9)
      if (!big) { gLogBlock(k, (st.log || []).slice().reverse(), x0, ey + eh + 11, rw, H - 3, 6.8, "mono", I, S, "· "); return }
      // genome read: a barcode with a read head that moves each refresh
      const gy = 166, gr = k.rng(parseInt(st.lot.replace(/\D/g, "").slice(-4), 10) || 7)
      k.t(`GENOME // ${st.lot}-SEQ`, x0, gy, 6.3, S, { w: rw - 62, lines: 1 }); k.t(`${Math.round(60 + (TM * 3) % 40)}% READ`, x0 + rw, gy, 6.3, S, { a: "r", w: 58, lines: 1 })
      let gx = x0; while (gx < x0 + rw) { const w2 = 0.8 + gr() * 2.4; k.rect(gx, gy + 8, w2, 10, gr() > 0.35 ? I : k.a(LAV, 0.8)); gx += w2 + 0.8 + gr() * 1.4 }
      const rh = x0 + ((TM * 6) % rw); k.rect(rh - 1, gy + 6, 2, 14, k.a(LAV, 1)); k.rect(rh - 6, gy + 6, 12, 14, k.a(LAV, 0.12))
      // physiology readouts
      const ry = 194, cells = [["MASS", `${(0.02 + st.age * 0.015 * (1 + st.stage)).toFixed(2)}mg`], ["MEMBRANE", `${(100 - st.stress * 0.3).toFixed(1)}%`], ["SIGNAL", `${(-40 + st.vit * 0.2).toFixed(1)}dB`], ["CORE", `${(37 + st.stress * 0.02).toFixed(1)}°C`]]
      cells.forEach(([l, v], i) => { const x = x0 + i * rw / 4; k.t(l, x, ry - 1, 6, S, { w: rw / 4 - 3, lines: 1 }); k.t(v, x, ry + 7, 7.3, I, { w: rw / 4 - 3, lines: 1 }) })
      const tl = gT(k, st.traits.length ? `TRAITS // ${st.traits.join(" · ").toUpperCase()}` : "TRAITS // NONE ON FILE", x0, 214, 6.3, k.a(LAV, 1), { w: rw, lines: 2 }).lines
      gLogBlock(k, (st.log || []).slice().reverse(), x0, 216 + tl * 8.5, rw, 263, 6.8, "mono", I, S, "· ")
      // vitality and stress history, with empty cycles shown as a dotted baseline
      const hy = 268, hw = W - 24, hh = 54, hist = st.hist || [], sh = st.shist || []
      k.t("VITALITY + STRESS // LAST 24 CYCLES", 12, hy, 6.5, S, { w: 180, lines: 1 }); k.t(st.stage < 4 ? `NEXT MILESTONE IN ${Math.max(0, G.th[st.stage + 1] - st.age)} CYCLES` : "TERMINAL MORPHOLOGY", W - 12, hy, 6.5, S, { a: "r", w: 150, lines: 1 })
      for (let y = 0; y <= 4; y++) k.ln([[12, hy + 10 + hh * y / 4], [W - 12, hy + 10 + hh * y / 4]], k.ia(0.06), 0.5)
      const bw2 = hw / 24, spts = []
      for (let i = 0; i < 24; i++) { const v = hist[hist.length - 24 + i], x = 12 + i * bw2; if (v == null) { k.ln([[x + 1, hy + 10 + hh], [x + bw2 - 2, hy + 10 + hh]], k.ia(0.25), 0.8); continue } const bh = Math.max(1, hh * v / 100); k.rect(x + 1, hy + 10 + hh - bh, bw2 - 3, bh, i === 23 ? k.a(LAV, 1) : k.ia(0.5)); const sv = sh[sh.length - 24 + i]; if (sv != null) spts.push([x + bw2 / 2, hy + 10 + hh - hh * sv / 100]) }
      if (spts.length > 1) { k.ln(spts, k.a(LAV, 0.9), 1.1); spts.forEach(p => k.circ(p[0], p[1], 1.2, k.a(LAV, 1))) }
      k.ln([[12, hy + 10 + hh], [W - 12, hy + 10 + hh]], I, 0.8)
      const sweep = 12 + ((TM * 4) % hw); k.ln([[sweep, hy + 10], [sweep, hy + 10 + hh]], k.a(LAV, 0.4), 0.7)
      k.t(`LINEAGE // ${st.run - 1} RECYCLED`, 12, H - 13, 6.5, S, { w: 120, lines: 1 }); for (let i = 0; i < Math.min(8, st.run - 1); i++) k.rect(112 + i * 6, H - 11, 4, 5, k.ia(0.4))
      k.t("CHARGE TO FEED · BUSY DAYS STRESS IT · NIGHTS REST", W - 12, H - 13, 6.3, S, { a: "r", w: 196, lines: 1 })
    }
  },

  // DEEP RANGE: an autonomous salvage drone jumping across a sector map
  deeprange: {
    title: "W-10 // SALVAGE RUN",
    init(now, prev) { const run = prev ? prev.run + 1 : 1; return { v: 1, vseed: (now % 99991), game: "deeprange", run, drone: `SR-${String(run).padStart(2, "0")}`, jumps: 0, hull: 100, fuel: 100, cargo: 0, credits: prev ? prev.credits : 0, pos: [0.5, 0.55], trail: [[0.5, 0.55]], status: "LAUNCHED", ev: "launch", best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed: (now % 233280) || 13, last: prev ? prev.last : 0 } },
    right(st, inp) { return inp.charging ? "DOCKED · REFUELING" : `DRONE ${st.drone}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.deeprange
      st.turn++
      if (inp.charging) { st.fuel += 25; st.hull += 12; st.status = "DOCKED"; st.ev = "dock"; gLog(st, "Docked at Relay 07. Refueling, patching hull."); st.fuel = gClamp(st.fuel); st.hull = gClamp(st.hull); return }
      st.jumps++; st.fuel -= 6 + r() * 5
      const a = r() * Math.PI * 2, dist = 0.08 + r() * 0.1, last = st.pos
      st.pos = [Math.max(0.06, Math.min(0.94, last[0] + Math.cos(a) * dist)), Math.max(0.08, Math.min(0.92, last[1] + Math.sin(a) * dist * 0.8))]
      st.trail = (st.trail || []).concat([st.pos]).slice(-14); st.status = "IN TRANSIT"
      const e = r()
      if (e < 0.22) { const c = Math.round(2 + r() * 9); st.cargo += c; st.ev = "derelict"; gLog(st, `Salvaged ${c}t from derelict ${gPick(r, ["FREIGHTER KESTREL", "ORE BARGE 9", "SURVEY POD LACUNA", "THE MERIDIAN", "TUG HALF-MOON"])}.`) }
      else if (e < 0.36) { const d = Math.round(8 + r() * 16); st.hull -= d; st.ev = "rocks"; gLog(st, `Asteroid field. Hull -${d}%.`) }
      else if (e < 0.46) { st.ev = "signal"; gLog(st, `Signal decoded: "${gPick(r, ["IS ANYONE GETTING THESE", "DO NOT DOCK AT 9", "WE FOUND IT", "COORDINATES ATTACHED", "TELL MY CAT"])}"`) }
      else if (e < 0.54) { st.fuel += 18; st.ev = "fuel"; gLog(st, "Fuel cache recovered. +18%.") }
      else if (e < 0.62) { const d = Math.round(10 + r() * 15); st.hull -= d; st.cargo = Math.floor(st.cargo * 0.7); st.ev = "pirate"; gLog(st, `Pirate ping. Evasive burn. Hull -${d}%, cargo dumped.`) }
      else if (e < 0.72 && st.cargo > 5) { const cr = st.cargo * 12; st.credits += cr; st.cargo = 0; st.ev = "sell"; gLog(st, `Sold salvage at waystation. +${cr} CR.`) }
      else { st.ev = "void"; gLog(st, gPick(r, ["Quiet jump. Nothing but static.", "Passed a dead satellite. Waved.", "Long-range scan: empty. Suspiciously empty."])) }
      st.fuel = gClamp(st.fuel); st.hull = gClamp(st.hull)
      if (st.hull <= 0 || st.fuel <= 0) { const why = st.hull <= 0 ? `CONTACT LOST. ${st.drone} destroyed after ${st.jumps} jumps.` : `${st.drone} out of fuel. Drifting. Beacon active.`; const best = Math.max(st.best || 0, st.jumps); Object.assign(st, G.init(Date.now(), st)); st.best = best; gLog(st, why); gLog(st, `${st.drone} launched.`) }
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const TM = Date.now() / 60000, small = W < 200, big = H > 200, mx = 10, my = 6, mw = small ? W - 20 : big ? W - 20 : 206, mh = small ? 86 : big ? 190 : H - 14
      const Y = k.a(T.accent, 1), R = k.H, B = k.a(T.altBg, 1), I = k.I
      k.rect(mx, my, mw, mh, k.ia(0.03), k.ia(0.3), 0.8)
      for (let gx = mx; gx <= mx + mw; gx += mw / 8) k.ln([[gx, my], [gx, my + mh]], k.ia(0.07), 0.5)
      for (let gy = my; gy <= my + mh; gy += mh / 6) k.ln([[mx, gy], [mx + mw, gy]], k.ia(0.07), 0.5)
      const rs = k.rng(st.run * 31); for (let i = 0; i < (big ? 90 : 45); i++) k.circ(mx + rs() * mw, my + rs() * mh, 0.4 + rs() * 0.8, k.ia(0.15 + rs() * 0.5 * Math.abs(Math.sin(TM / 7 + i))))
      k.arc(mx + mw, my + mh + 30, 70, Math.PI * 1.16, Math.PI * 1.46, B, 1.4); k.arc(mx + mw, my + mh + 30, 60, Math.PI * 1.2, Math.PI * 1.44, k.a(T.altBg, 0.4), 0.8)
      const P = (p) => [mx + p[0] * mw, my + p[1] * mh], tr = (st.trail || []).map(P)
      if (tr.length > 1) { k.ln(tr, k.a(T.accent, 0.3), 3); k.ln(tr, Y, 1.2) }
      tr.forEach((p, i) => { if (i < tr.length - 1) k.rect(p[0] - 1.5, p[1] - 1.5, 3, 3, k.ia(0.6)) })
      const cur = tr[tr.length - 1] || P(st.pos), prev = tr[tr.length - 2] || [cur[0] - 1, cur[1]], ang = Math.atan2(cur[1] - prev[1], cur[0] - prev[0])
      k.circ(cur[0], cur[1], 7 + (TM % 4), null, k.a(T.accent, Math.max(0, 0.6 - (TM % 4) * 0.15)), 1)
      gDrone(k, cur[0], cur[1], ang, gVar(st, 1, 5), [Y, B, k.a("#FFFFFF", 0.95), Y, B][gVar(st, 3, 5)], I)
      const ex = cur[0] + 10, ey = cur[1] - 12
      if (st.ev === "derelict") k.rect(ex, ey, 8, 5, null, I, 0.8)
      if (st.ev === "rocks") for (let i = 0; i < 4; i++) k.circ(ex + i * 4, ey + (i % 2) * 3, 1.6, k.ia(0.7))
      if (st.ev === "pirate") k.poly([[ex, ey], [ex + 8, ey + 3], [ex, ey + 6]], R)
      if (st.ev === "dock") { k.rect(cur[0] - 10, cur[1] + 6, 20, 4, null, B, 1); k.t("RELAY 07", cur[0], cur[1] + 12, 5.5, B, { a: "c", w: 40 }) }
      if (st.ev === "signal") for (let i = 1; i <= 3; i++) k.arc(cur[0], cur[1], 6 + i * 4, -0.8, 0.2, k.a(T.accent, 0.7), 0.7)
      k.t(`SECTOR 07 // RUN ${st.run}`, mx + 5, my + 4, 6, k.S, { w: 120 })
      // readouts
      const bars = [["HULL", st.hull, st.hull < 30 ? R : I], ["FUEL", st.fuel, st.fuel < 25 ? R : Y]]
      if (small) { bars.forEach(([l, v, c], i) => { const y = my + mh + 6 + i * 13; k.t(`${l} ${Math.round(v)}%`, mx, y, 6.5, I, { w: 70 }); gBar(k, mx + 62, y + 2, W - mx * 2 - 62, 5, v / 100, c, k.ia(0.12)) }); return }
      const x0 = big ? mx : mx + mw + 12, y0 = big ? my + mh + 10 : my, rw = big ? W - 20 : W - x0 - 10
      k.t(inp.charging ? "DOCKED // REFUELING" : st.status, x0, y0, 6.5, inp.charging ? B : R, { f: "bold", w: rw })
      k.t(st.drone, x0, y0 + 9, big ? 22 : 18, I, { f: "heavy", w: big ? 104 : rw, lines: 1 }); k.t(`"${['KESTREL', 'MULE', 'HALO', 'OXBOW', 'MOTH', 'WREN'][gVar(st, 2, 6)]}" · ${['DART', 'HAULER', 'RING', 'TWIN-BOOM', 'SAUCER'][gVar(st, 1, 5)]} HULL`, x0, y0 + (big ? 31 : 28), 6, k.S, { w: big ? 104 : rw, lines: 1 })
      if (big) {
        ;[["JUMPS", st.jumps], ["CARGO", `${st.cargo}t`], ["CREDITS", st.credits], ["BEST RUN", `${st.best} J`]].forEach(([l, v], i) => { const x = x0 + 110 + i * 62; k.t(l, x, y0, 6, k.S, { w: 60 }); k.t(String(v), x, y0 + 10, 11, I, { f: "heavy", w: 60 }) })
        bars.forEach(([l, v, c], i) => { const y = y0 + 43 + i * 14; k.t(l, x0, y, 6.5, k.S, { w: 40 }); gBar(k, x0 + 40, y + 2, rw - 80, 6, v / 100, c, k.ia(0.12)); k.t(`${Math.round(v)}%`, x0 + rw, y, 7, I, { a: "r", w: 36, f: "bold" }) })
        gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + 76, rw, H - 4, 7.2, "mono", I, k.S, "> ")
        return
      }
      bars.forEach(([l, v, c], i) => { const y = y0 + 34 + i * 14; k.t(l, x0, y, 6.5, k.S, { w: 40 }); gBar(k, x0 + 30, y + 2, rw - 64, 5, v / 100, c, k.ia(0.12)); k.t(`${Math.round(v)}%`, x0 + rw, y, 6.5, I, { a: "r", w: 34, f: "bold" }) })
      k.t(`JUMPS ${st.jumps} · CARGO ${st.cargo}t · ${st.credits} CR`, x0, y0 + 64, 6.5, I, { w: rw })
      gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + 78, rw, H - 3, 6.8, "mono", I, k.S, "> ")
    }
  },

  // THE LONG ROAD: a traveller walking the map, keeping a journal
  longroad: {
    title: "W-10 // The Expedition",
    places: ["Brindle", "The Lantern Inn", "Pinewatch", "Calder Ruins", "Fenwick Marsh", "Ashwood", "Old Tower", "Sheepcote Hills", "Hollowmere", "Greyhallow Fells", "The Grey Sound"],
    names: ["Wren of Brindle", "Old Tamsin", "Pip Ashcombe", "Hollis the Tinker", "Marigold Fenn", "Brother Oswin", "Ada Stillwater", "Cob the Younger"],
    init(now, prev) { const G = GAMES.longroad, run = prev ? prev.run + 1 : 1, seed = (now % 233280) || 17; return { v: 1, vseed: (now % 99991), game: "longroad", run, name: G.names[(seed + run) % G.names.length], day: 1, miles: 0, hp: 10, food: 8, gold: 5, place: "Brindle", pi: 0, camp: false, items: [], best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], seed, last: prev ? prev.last : 0 } },
    right(st, inp) { return st.camp ? "Camped" : `Day ${st.day}` },
    step(st, inp) {
      const r = gRng(st), G = GAMES.longroad, night = inp.hour < 6 || inp.hour >= 22
      st.turn++; if (st.turn % 4 === 0) st.day++
      if (inp.charging || night) { st.camp = true; st.hp = Math.min(10, st.hp + (inp.charging ? 2 : 1)); st.food -= 1; gLog(st, inp.charging ? "Rested by a roaring fire. Wounds mended." : "Made camp under the stars. Slept well enough.") }
      else {
        st.camp = false; const m = Math.round(4 + r() * 9); st.miles += m; st.food -= 1
        const e = r()
        if (e < 0.18) { st.pi = (st.pi + 1) % G.places.length; st.place = G.places[st.pi]; if (st.gold >= 2) { st.gold -= 2; st.food += 3; gLog(st, `Reached ${st.place}. Bought bread and cheese.`) } else gLog(st, `Reached ${st.place}. Too poor for supper.`) }
        else if (e < 0.3) { const d = 1 + Math.floor(r() * 3), g = Math.min(st.gold, 3); st.hp -= d; st.gold -= g; gLog(st, `Bandits on the road! Lost ${g} gold and some dignity.`) }
        else if (e < 0.38) { st.hp -= 2; gLog(st, "Wolves at dusk. Escaped with scratches.") }
        else if (e < 0.46) { st.hp += 2; gLog(st, "A wayside shrine. Left a coin, felt lighter.") }
        else if (e < 0.56) { const g = 2 + Math.floor(r() * 5); st.gold += g; gLog(st, `Found a purse in the ditch. ${g} gold richer.`) }
        else if (e < 0.62 && st.gold >= 4) { const it = gPick(r, ["a better cloak", "a lucky charm", "boots that fit", "a map with fewer lies", "a tin whistle"]); st.gold -= 4; st.items = (st.items || []).concat([it]).slice(-4); gLog(st, `A merchant sold me ${it}.`) }
        else if (e < 0.68) gLog(st, "Heard talk of a dragon in the Fells. Probably sheep.")
        else if (e < 0.74) { st.miles = Math.max(0, st.miles - 2); gLog(st, "Rain all day. The road became a river.") }
        else gLog(st, gPick(r, [`Walked ${m} miles. The road went on.`, `Walked ${m} miles. A crow followed me most of them.`, `Walked ${m} miles. Sang badly. Nobody complained.`]))
      }
      if (st.food <= 0) { st.food = 0; st.hp -= 1; gLog(st, "Nothing to eat. Belt tightened another notch.") }
      st.hp = Math.max(0, Math.min(10, st.hp))
      if (st.hp <= 0) { const name = st.name, best = Math.max(st.best || 0, st.miles); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `${name} was laid to rest beneath an oak.`); gLog(st, `${st.name} sets out from Brindle.`) }
    },
    paint(k, W, H, st, inp) {
      k = gSafe(k)
      const TM = Date.now() / 60000, small = W < 200, big = H > 200, I = k.I, RED = k.a(T.accent, 1)
      const mx = 10, my = 6, mw = small ? W - 20 : big ? W - 20 : 196, mh = small ? 78 : big ? 150 : H - 14
      k.rect(mx, my, mw, mh, k.a(T.panel, 0.6), I, 1); k.rect(mx + 3, my + 3, mw - 6, mh - 6, null, k.ia(0.35), 0.5)
      const rs = k.rng(st.run * 13 + 5), road = []
      for (let i = 0; i <= 20; i++) { const t = i / 20; road.push([mx + 10 + t * (mw - 20), my + mh * 0.55 + Math.sin(t * 6 + st.run) * mh * 0.18]) }
      for (let i = 0; i < (big ? 18 : 10); i++) { const x = mx + 12 + rs() * (mw - 24), y = my + 10 + rs() * (mh - 20), kind = rs(); if (Math.abs(y - (my + mh * 0.55)) < 12 || (y < my + 24 && x < mx + 100)) continue; if (kind < 0.4) k.poly([[x, y - 7], [x + 4, y + 2], [x - 4, y + 2]], k.ia(0.8)); else if (kind < 0.7) k.arc(x, y + 3, 7, Math.PI, Math.PI * 2, k.ia(0.6), 0.9); else { k.rect(x - 3, y - 2, 6, 5, k.PN, I, 0.7); k.poly([[x - 4, y - 2], [x, y - 6], [x + 4, y - 2]], null, I, 0.7) } }
      for (let i = 0; i < road.length - 1; i++) if (i % 2 === 0) k.ln([road[i], road[i + 1]], RED, 1.3)
      const prog = ((st.miles % 60) / 60), pi = Math.min(19, Math.floor(prog * 20)), tt = prog * 20 - pi, px = road[pi][0] + (road[pi + 1][0] - road[pi][0]) * tt, py = road[pi][1] + (road[pi + 1][1] - road[pi][1]) * tt
      if (st.camp) { for (let i = 0; i < 3; i++) k.poly([[px - 3 + i * 3, py - 2], [px - 1.5 + i * 3, py - 8 - Math.sin(TM + i) * 2], [px + i * 3, py - 2]], k.a(i === 1 ? "#E08A2E" : T.accent, 1)); k.ln([[px - 5, py], [px + 5, py - 2]], I, 1.2) }
      else gTraveller(k, px, py + 2, small ? 0.75 : big ? 1.15 : 0.9, { cloak: gVar(st, 11, 4), hat: gVar(st, 12, 4), comp: gVar(st, 13, 5), carry: gVar(st, 14, 3) }, I, RED)
      k.t(st.place, mx + 8, my + 5, 8.5, I, { f: "disp", w: mw - 16 })
      const hearts = (x, y, s) => { for (let i = 0; i < 10; i++) { const hx = x + i * (s + 2), on = i < st.hp; k.circ(hx + s * 0.28, y + s * 0.3, s * 0.28, on ? RED : null, RED, 0.6); k.circ(hx + s * 0.72, y + s * 0.3, s * 0.28, on ? RED : null, RED, 0.6); k.poly([[hx + 0.5, y + s * 0.4], [hx + s / 2, y + s], [hx + s - 0.5, y + s * 0.4]], on ? RED : null, RED, 0.6) } }
      if (small) { hearts(mx, my + mh + 6, 7); k.t(`Day ${st.day} · ${st.miles} mi`, mx, my + mh + 18, 9, I, { f: "disp", w: W - 20 }); return }
      const x0 = big ? mx : mx + mw + 12, y0 = big ? my + mh + 8 : my, rw = big ? W - 20 : W - x0 - 10
      k.t(st.name, x0, y0, big ? 15 : 12, I, { f: "disp", w: rw })
      k.t(`Day ${st.day} · ${st.miles} mi${st.best ? " · best " + st.best + " mi" : ""}`, x0, y0 + (big ? 18 : 15), 8, k.S, { f: "disp", w: rw })
      hearts(x0, y0 + (big ? 32 : 28), big ? 9 : 7)
      const COMP = ['', 'a dog', 'a crow', 'a donkey', 'a cat'][gVar(st, 13, 5)]; k.t(`Bread ${st.food} · Gold ${st.gold}${big && COMP ? " · travelling with " + COMP : ""}`, x0, y0 + (big ? 46 : 39), 8.5, I, { f: "disp", w: rw })
      gLogBlock(k, (st.log || []).slice().reverse(), x0, y0 + (big ? 62 : 53), rw, big ? H - 22 : H - 3, big ? 9.5 : 8.5, "disp", I, k.S, "")
      if (big) k.t("Charge the phone to make camp. Nights are spent by the fire.", W / 2, H - 14, 8, k.S, { f: "disp", a: "c", w: W - 20 })
    }
  }
}
function gameSample(f) {
  const G = GAMES[f]; if (!G) return null
  const st = G.init(86400000 * 7 + 4242); const ins = []
  for (let i = 0; i < 26; i++) { const inp = { charging: i % 9 === 4, batt: 0.7, hour: 9 + (i % 10), busy: i % 5 === 0 ? 5 : 1 }; G.step(st, inp); ins.push(inp) }
  return { st, inp: ins[ins.length - 1] }
}
// ---------- W-10 GAMES, part two: one idle game per remaining prefab ----------
// shared layout: a scene on the left (or top on large), a status panel, bars and a short log
function gFrame(k, W, H, st, o) {
  k = gSafe(k)
  const small = W < 200, big = H > 200, I = k.I, S = k.S
  const vx = 10, vy = 6, vw = small ? W - 20 : big ? W - 20 : 200, vh = small ? 84 : big ? 172 : H - 14
  o.scene(k, vx, vy, vw, vh, small, big)
  const hot = o.hot || k.H, f = o.font || "disp"
  if (small) { (o.bars || []).slice(0, 2).forEach(([l, v, c], i) => { const y = vy + vh + 6 + i * 13; k.t(`${l} ${Math.round(v * 100)}`, vx, y, 6.5, I, { w: 70 }); gBar(k, vx + 64, y + 2, W - vx * 2 - 64, 5, v, c || I, k.ia(0.12)) }); return }
  const x0 = big ? vx : vx + vw + 12, y0 = big ? vy + vh + 8 : vy, rw = big ? W - 20 : W - x0 - 10
  k.t(o.kicker || "", x0, y0, 7, hot, { f: "bold", w: rw, lines: 1 })
  k.t(o.title || "", x0, y0 + 9, big ? 18 : 14, I, { f, w: rw, lines: 1 })
  k.t(o.sub || "", x0, y0 + (big ? 30 : 26), 6.8, S, { w: rw, lines: 1 })
  const bars = o.bars || [], bw = big ? rw * 0.46 : rw
  bars.forEach(([l, v, c], i) => { const y = y0 + (big ? 42 : 37) + i * 13; k.t(l, x0, y, 6.5, S, { w: bw - 30, lines: 1 }); k.t(`${Math.round(v * 100)}`, x0 + bw, y, 6.5, I, { a: "r", w: 28 }); gBar(k, x0, y + 7.5, bw, 3.5, v, c || I, k.ia(0.12)) })
  const logs = (st.log || []).slice().reverse(), lf = f === "disp" ? "disp" : "mono"
  if (big) { const lx = x0 + rw * 0.52, lw = rw * 0.48; k.t(o.logTitle || "LOG", lx, y0 + 42, 6.5, S, { w: lw }); gLogBlock(k, logs, lx, y0 + 53, lw, H - 20, lf === "disp" ? 8.5 : 7, lf, I, S, ""); if (o.hint) k.t(o.hint, W / 2, H - 13, 6.5, S, { a: "c", w: W - 20, lines: 1 }) }
  else gLogBlock(k, logs, x0, y0 + 37 + bars.length * 13 + 4, rw, H - 3, lf === "disp" ? 8 : 6.8, lf, I, S, "")
}
const gRun = (prev, extra) => Object.assign({ v: 1, vseed: (Date.now() % 99991), run: prev ? prev.run + 1 : 1, best: prev ? prev.best : 0, turn: prev ? prev.turn : 0, log: prev ? prev.log : [], last: prev ? prev.last : 0 }, extra)

// DIRECTIVE ZERO: keep Shelter 9 running underground
GAMES.directive = {
  title: "W-10 // SHELTER 9",
  init(now, prev) { return gRun(prev, { game: "directive", seed: (now % 233280) || 19, shelter: prev ? prev.shelter + 1 : 9, day: 1, pop: 12, food: 70, power: 80, morale: 65, threat: 20 }) },
  right(st, inp) { return inp.charging ? "GRID RESTORED" : `DAY ${st.day}` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.directive; st.turn++; if (st.turn % 4 === 0) st.day++
    if (inp.charging) { st.power += 25; gLog(st, "Grid restored. Generators charging.") } else st.power -= 6
    st.food -= st.pop * 0.25
    const e = r()
    if (e < 0.14) { const n = 1 + Math.floor(r() * 4); st.pop += n; gLog(st, `${n} survivors admitted at the blast door.`) }
    else if (e < 0.26) { st.food += 18; gLog(st, "Supply drop recovered from the surface.") }
    else if (e < 0.36) { st.threat += 18; gLog(st, "Sirens. Seismic contact to the north.") }
    else if (e < 0.44) { st.morale += 8; gLog(st, "Drill completed in 41 seconds. Record.") }
    else if (e < 0.52) { st.threat -= 12; gLog(st, "All clear issued. Temporary condition.") }
    else if (e < 0.6) { st.morale -= 6; gLog(st, "Radio static spelled a word. Morale wobbled.") }
    else if (e < 0.66) { st.power -= 8; gLog(st, "Power flicker on Level 3.") }
    else gLog(st, gPick(r, ["Ration cards reissued.", "Someone painted a window on the wall.", "Air filters swapped. Air tastes newer.", "Card game in the mess hall. Nobody won."]))
    if (st.food <= 0) { st.food = 0; st.morale -= 8; gLog(st, "Food stores empty. Rations halved.") }
    if (st.power <= 10) st.morale -= 4
    st.threat = gClamp(st.threat - 3); st.food = gClamp(st.food); st.power = gClamp(st.power); st.morale = gClamp(st.morale)
    if (st.morale <= 0 || st.power <= 0) { const old = st.shelter, best = Math.max(st.best || 0, st.day); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `Shelter ${old} evacuated. Shelter ${st.shelter} unsealed.`) }
  },
  paint(k, W, H, st, inp) {
    const TM = Date.now() / 60000, A = k.a(T.accent, 1), Hh = k.H
    gFrame(k, W, H, st, { font: "heavy", hot: Hh, kicker: inp.charging ? "GRID RESTORED // CHARGING" : st.threat > 60 ? "THREAT ELEVATED" : "SHELTER SEALED", title: `SHELTER ${st.shelter}`, sub: `OVERSEER ${['K. ADLER', 'R. OKAFOR', 'M. VANCE', 'T. HALE', 'S. IBARRA', 'J. MOREAU'][gVar(st, 21, 6)]} · DAY ${st.day} · POP ${st.pop}`, bars: [["FOOD", st.food / 100, A], ["POWER", st.power / 100, k.I], ["MORALE", st.morale / 100, A], ["THREAT", st.threat / 100, Hh]], logTitle: "SHELTER LOG", hint: "CHARGE THE PHONE TO RESTORE THE GRID",
      scene(k, x, y, w, h, small) {
        const gy = y + h * 0.22; k.rect(x, y, w, gy - y, k.ia(0.04)); k.stripes(x, gy - 4, w, 4, Hh, 8); k.ln([[x, gy], [x + w, gy]], k.I, 1)
        for (let i = 0; i < 3; i++) k.rect(x + w * (0.15 + i * 0.3), gy - 10 - i * 4, w * 0.12, 10 + i * 4, k.ia(0.25))
        const lv = 3 + gVar(st, 22, 3), lh = (y + h - gy - 6) / lv
        for (let i = 0; i < lv; i++) { const ly = gy + 4 + i * lh, lit = st.power > i * 22; k.rect(x + 6, ly, w - 12, lh - 4, lit ? k.a(T.accent, 0.08) : k.ia(0.03), k.ia(0.4), 0.8); k.t(`L${i + 1}`, x + 9, ly + 2, 5.5, k.S, { w: 20 }); const n = Math.max(0, Math.min(10, Math.round(st.pop / lv) + (i % 2))); for (let j = 0; j < n; j++) k.circ(x + 26 + j * ((w - 40) / 10) + Math.sin(TM / 3 + j + i) * 2, ly + lh * 0.55, 2, lit ? A : k.ia(0.3)) }
        k.ln([[x + w / 2, gy], [x + w / 2, y + h - 4]], k.ia(0.3), 1)
        const sir = st.threat > 50 && Math.floor(TM) % 2 === 0; k.circ(x + w - 14, y + 10, 5, sir ? Hh : k.ia(0.15), k.I, 0.8)
        gEmblem(k, x + 14, y + 12, 8, gVar(st, 23, 4), Hh, k.ia(0.05)); k.t(String(Math.max(1, 5 - Math.floor(st.threat / 21))), x + 14, y + 7, 8, Hh, { f: "heavy", a: "c", w: 16 })
      } })
  }
}

// NIGHTFALL: a four-trooper squad running night patrols
GAMES.nightfall = {
  title: "W-10 // NIGHT PATROL",
  roster: ["ALPHA-1", "ALPHA-2", "BRAVO-3", "BRAVO-4"],
  init(now, prev) { return gRun(prev, { game: "nightfall", seed: (now % 233280) || 23, squad: prev ? prev.squad + 1 : 7, hp: [100, 100, 100, 100], ammo: 90, intel: 0, sectors: 0, path: [[0.1, 0.8]], recruits: 0 }) },
  right(st, inp) { return inp.charging ? "RESUPPLY INBOUND" : `SQUAD ${st.squad}` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.nightfall; st.turn++
    if (inp.charging) { st.ammo = 100; st.hp = st.hp.map(h => Math.min(100, h + 30)); gLog(st, "Resupply drop. Ammo full, medkits restocked."); return }
    st.ammo -= 4; const last = st.path[st.path.length - 1]; st.path = st.path.concat([[Math.max(0.06, Math.min(0.94, last[0] + 0.08 + r() * 0.08)), Math.max(0.1, Math.min(0.9, last[1] + (r() - 0.55) * 0.3))]]).slice(-12)
    if (st.path[st.path.length - 1][0] > 0.9) { st.sectors++; st.path = [[0.08, 0.3 + r() * 0.5]]; gLog(st, `Sector ${st.sectors} cleared. Moving up.`) }
    const e = r(), who = Math.floor(r() * 4)
    if (e < 0.2) { const d = 10 + Math.floor(r() * 30); st.hp[who] -= d; st.ammo -= 12; gLog(st, `Contact. ${G.roster[who]} hit, -${d}. Contact broken.`) }
    else if (e < 0.32) { st.intel++; gLog(st, "Recovered a data spike. Intel +1.") }
    else if (e < 0.4) gLog(st, "Rain thickening. Thermal only.")
    else if (e < 0.48) { st.ammo += 15; gLog(st, "Found an ammo cache in a parking garage.") }
    else if (e < 0.55) gLog(st, "Motion tracker ping. Just a cat. Probably.")
    else gLog(st, gPick(r, ["Holding position under a billboard.", "Visor fogging. Wiped. Moving.", "Quiet street. Too quiet. Moving anyway."]))
    st.hp = st.hp.map((h, i) => { if (h <= 0) { st.recruits++; gLog(st, `${G.roster[i]} evacuated. Replacement inbound.`); return 70 } return Math.max(0, Math.min(100, h)) })
    st.ammo = gClamp(st.ammo)
    if (st.ammo <= 0) { const old = st.squad, best = Math.max(st.best || 0, st.sectors); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `Squad ${old} out of ammo. Extracted. Squad ${st.squad} deploying.`) }
  },
  paint(k, W, H, st, inp) {
    const G = GAMES.nightfall, TM = Date.now() / 60000, A = k.a(T.accent, 1)
    gFrame(k, W, H, st, { font: "bold", hot: A, kicker: inp.charging ? "RESUPPLY // CHARGING" : "PATROL ACTIVE", title: `SQUAD ${st.squad} "${['WRAITH', 'LANTERN', 'MAGPIE', 'HALCYON', 'BASILISK', 'NOMAD'][gVar(st, 31, 6)]}"`, sub: `SECTORS ${st.sectors} · INTEL ${st.intel} · BEST ${st.best || 0}`, bars: (H > 200 ? [["AMMO", st.ammo / 100, A]].concat(st.hp.map((h, i) => [G.roster[i], h / 100, k.I])) : [["AMMO", st.ammo / 100, A], ["SQUAD HEALTH", st.hp.reduce((a, b) => a + b, 0) / 400, k.I]]), logTitle: "COMMS", hint: "CHARGE THE PHONE FOR A RESUPPLY DROP",
      scene(k, x, y, w, h, small) {
        k.rect(x, y, w, h, k.ia(0.05)); for (let i = 1; i < 8; i++) k.ln([[x + w * i / 8, y], [x + w * i / 8, y + h]], k.ia(0.07), 0.5); for (let i = 1; i < 5; i++) k.ln([[x, y + h * i / 5], [x + w, y + h * i / 5]], k.ia(0.07), 0.5)
        const rr = k.rng(st.squad * 11 + st.sectors); for (let i = 0; i < 9; i++) { const bx = x + rr() * w, bh = 8 + rr() * h * 0.3; k.rect(bx, y + h - bh, 6 + rr() * 14, bh, k.ia(0.08)) }
        nfBrackets(k, x + 2, y + 2, w - 4, h - 4, 8, A, 1)
        const P = (p) => [x + p[0] * w, y + p[1] * h], pts = st.path.map(P); if (pts.length > 1) k.ln(pts, k.a(T.accent, 0.8), 1.2)
        const cur = pts[pts.length - 1]; for (let i = 0; i < 4; i++) { const ox = cur[0] - 8 + (i % 2) * 8, oy = cur[1] - 4 + Math.floor(i / 2) * 8; gMarker(k, ox, oy, gVar(st, 32, 4), st.hp[i] > 30 ? [A, k.a("#FFFFFF", 0.9), k.L, A][gVar(st, 33, 4)] : k.H) }
        const tx = x + w - 30, ty = y + h - 10, sw = TM / 2; k.arc(tx, ty, 22, Math.PI, Math.PI * 2, k.ia(0.4), 0.8); k.ln([[tx, ty], [tx + 22 * Math.cos(Math.PI + (sw % Math.PI)), ty + 22 * Math.sin(Math.PI + (sw % Math.PI))]], A, 0.8)
        for (let i = 0; i < 3; i++) { const a = Math.PI + rr() * Math.PI, d2 = 6 + rr() * 14; k.circ(tx + d2 * Math.cos(a), ty + d2 * Math.sin(a), 1.5, k.H) }
      } })
  }
}

// PLANAR GRIMOIRE: an apprentice studying the arcane
GAMES.grimoire = {
  title: "W-10 // THE APPRENTICE",
  ranks: ["NOVICE", "ADEPT", "MAGUS", "ARCHMAGUS", "STARBOUND"],
  spells: ["Lesser Light", "Whisper Ward", "Candle Tongue", "Mirror Step", "Comet Call", "Moonroot", "Hour Lock", "Star Seal", "Veil Thread", "Ember Script", "Owl Sight", "Tide Word"],
  init(now, prev) { return gRun(prev, { game: "grimoire", seed: (now % 233280) || 29, name: gPick(() => (now % 997) / 997, ["Ivo", "Sable", "Wren", "Corin", "Maud", "Elspeth"]), rank: 0, mana: 70, lore: 0, known: [], familiar: null, mishaps: 0 }) },
  right(st, inp) { return inp.charging ? "MOONWELL FULL" : GAMES.grimoire.ranks[st.rank] },
  step(st, inp) {
    const r = gRng(st), G = GAMES.grimoire; st.turn++
    if (inp.charging) { st.mana = 100; gLog(st, "The moonwell overflows. Mana restored.") } else st.mana -= 7
    st.lore += 3 + Math.floor(r() * 5)
    const e = r()
    if (e < 0.2 && st.mana > 20) { const left = G.spells.filter(s => !st.known.includes(s)); if (left.length) { const s = gPick(r, left); st.known.push(s); st.mana -= 15; gLog(st, `Learned ${s}.`) } }
    else if (e < 0.28 && !st.familiar) { st.familiar = gPick(r, ["an owl", "a black cat", "a toad of opinion", "a moth the size of a hand"]); gLog(st, `A familiar arrived: ${st.familiar}.`) }
    else if (e < 0.38) { st.mana -= 12; st.mishaps++; gLog(st, gPick(r, ["Cauldron mishap. Eyebrows regrowing.", "Summoned the wrong thing. Sent it back.", "Read a page twice. It read me back."])) }
    else if (e < 0.46) gLog(st, "Charted a new constellation. Named it after soup.")
    else if (e < 0.54) { st.lore += 8; gLog(st, "Found a margin note in an old tome. Lore +8.") }
    else gLog(st, gPick(r, ["Practiced runes by candlelight.", "The tower creaked approvingly.", "Meditated. The stars meditated back."]))
    if (st.rank < 4 && st.lore >= (st.rank + 1) * 60) { st.rank++; gLog(st, `Ascended to ${G.ranks[st.rank]}.`) }
    st.mana = gClamp(st.mana)
    if (st.mana <= 0) { const name = st.name, best = Math.max(st.best || 0, st.known.length); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `${name} burned out and returned to farming. ${st.name} takes the oath.`) }
  },
  paint(k, W, H, st, inp) {
    const G = GAMES.grimoire, TM = Date.now() / 60000, A = k.a(T.accent, 1), L = k.a(T.altBg, 1)
    gFrame(k, W, H, st, { font: "disp", hot: A, kicker: inp.charging ? "MOONWELL // CHARGING" : "STUDYING", title: `${st.name}, ${G.ranks[st.rank].toLowerCase()}`, sub: `SPELLS ${st.known.length}/12 · ${st.familiar ? st.familiar.toUpperCase() : "NO FAMILIAR"} · BEST ${st.best || 0}`, bars: [["MANA", st.mana / 100, A], ["LORE", Math.min(1, (st.lore % 60) / 60), k.I]], logTitle: "SPELLBOOK", hint: "Charge the phone to fill the moonwell.",
      scene(k, x, y, w, h, small) {
        const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) * 0.42
        k.circ(cx, cy, R, k.a(T.altBg, 0.25), A, 1.1); k.circ(cx, cy, R * 0.82, null, k.a(T.accent, 0.5), 0.6)
        for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + TM / 30; k.ln([[cx + R * 0.86 * Math.cos(a), cy + R * 0.86 * Math.sin(a)], [cx + R * 0.95 * Math.cos(a), cy + R * 0.95 * Math.sin(a)]], k.a(T.accent, 0.7), 0.6) }
        const pts = G.spells.map((s, i) => { const a = i / 12 * Math.PI * 2 - Math.PI / 2, rr = R * (0.38 + (i % 3) * 0.14); return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), st.known.includes(s)] })
        pts.forEach((p, i) => { const q = pts[(i + 5) % 12]; if (p[2] && q[2]) k.ln([[p[0], p[1]], [q[0], q[1]]], k.a(T.accent, 0.6), 0.7) })
        pts.forEach(([px, py, on]) => on ? gmStar(k, px, py, 4 + Math.sin(TM / 2 + px) * 0.8, A, 0.8) : k.circ(px, py, 1.2, k.ia(0.3)))
        gmStar(k, cx, cy, R * 0.18, A, 1); k.circ(cx, cy, R * 0.07 + (TM % 3), null, k.a(T.accent, 0.4), 0.6)
        const sc2 = small ? 0.8 : 1.1; gApprentice(k, cx - R * 1.05, cy + R * 0.95, sc2, [k.a(T.altBg, 1), k.a("#3A7BD5", 1), k.a("#2FAE7A", 1), k.a("#D23A4A", 1)][gVar(st, 41, 4)], gVar(st, 42, 3), k.I, A)
        if (st.familiar) gFamiliar(k, cx + R * 1.05, cy + R * 0.92, sc2, /owl/.test(st.familiar) ? 0 : /cat/.test(st.familiar) ? 1 : /toad/.test(st.familiar) ? 2 : 3, k.I, A)
        for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i / 5 * Math.PI * 2, x2 = cx + R * 1.08 * Math.cos(a), y2 = cy + R * 1.08 * Math.sin(a); k.rect(x2 - 2, y2 - 1, 4, 7, k.ia(0.8)); k.poly([[x2, y2 - 6 - Math.sin(TM + i) * 1.5], [x2 + 1.8, y2 - 2], [x2 - 1.8, y2 - 2]], A) }
      } })
  }
}

// WHITE RABBIT: the legion's long con for all seven heirlooms
GAMES.rabbit = {
  title: "W-10 // THE LONG CON",
  lots: ["The Gala Necklace", "The Jeweled Egg", "The Ambassador's Ring", "The Crown Nobody Wears", "The Clockwork Brooch", "The Pearl Compass", "The Seventh Heirloom"],
  init(now, prev) { return gRun(prev, { game: "rabbit", seed: (now % 233280) || 31, season: prev ? prev.season + (prev.taken >= 7 ? 1 : 0) : 1, taken: 0, heat: 10, crew: 3, loot: prev ? prev.loot : 0, intel: 0 }) },
  right(st, inp) { return inp.charging ? "LAYING LOW" : `LOT ${st.taken}/07` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.rabbit; st.turn++
    if (inp.charging) { st.heat -= 18; gLog(st, "Laying low at the safehouse. Heat cooling."); st.heat = gClamp(st.heat); return }
    st.heat -= 2
    const e = r()
    if (e < 0.24) { st.intel++; gLog(st, `Cased ${G.lots[st.taken] || "the vault"}. Intel ${st.intel}.`) }
    else if (e < 0.4 && st.intel >= 2) { const val = 50 + Math.floor(r() * 400); st.taken++; st.loot += val; st.intel = 0; st.heat += 16; gLog(st, `${G.lots[st.taken - 1]} lifted. Calling card left. +$${val}K.`) }
    else if (e < 0.5) { st.heat += 12; gLog(st, "Close call on the rooftop. Ears down.") }
    else if (e < 0.58) { st.crew++; gLog(st, "A copycat asked to join. Recruited.") }
    else if (e < 0.64 && st.crew > 1) { st.crew--; st.heat += 6; gLog(st, "A crew member got sloppy. Cut loose.") }
    else gLog(st, gPick(r, ["Pressed a fresh calling card.", "Rehearsed the gala exit twice.", "Tea at the safehouse. Plans drawn in sugar."]))
    st.heat = gClamp(st.heat)
    if (st.taken >= 7) { const best = Math.max(st.best || 0, 7); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `All seven heirlooms taken. Season ${st.season} begins.`) }
    else if (st.heat >= 100) { const best = Math.max(st.best || 0, st.taken); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, "Too hot. The legion scatters. New masks, new plan.") }
  },
  paint(k, W, H, st, inp) {
    const G = GAMES.rabbit, TM = Date.now() / 60000, A = k.a(T.accent, 1), L = k.a(T.headBg, 1)
    gFrame(k, W, H, st, { font: "disp", hot: A, kicker: inp.charging ? "SAFEHOUSE // CHARGING" : st.heat > 70 ? "HEAT RISING" : "ON THE JOB", title: G.lots[Math.min(6, st.taken)], sub: `ALIAS ${['VELVET', 'CIPHER', 'SILK', 'MONOCLE', 'NOCTURNE', 'GILT'][gVar(st, 54, 6)]} · CREW ${st.crew} · $${st.loot}K`, bars: [["HEAT", st.heat / 100, A], ["INTEL", Math.min(1, st.intel / 2), k.I], ["LOTS", st.taken / 7, L]], logTitle: "THE LEDGER", hint: "Charge the phone to lay low and cool the heat.",
      scene(k, x, y, w, h, small) {
        k.rect(x, y, w, h, k.a(T.panel, 0.6), k.a(T.headBg, 1), 0.8)
        for (let i = 0; i < 4; i++) { const yy = y + 12 + ((TM * 4 + i * h / 4) % (h - 20)); k.ln([[x + 2, yy], [x + w - 2, yy + (i % 2 ? 8 : -8)]], k.a(T.accent, 0.55), 0.8) }
        const pw = (w - 16) / 7
        for (let i = 0; i < 7; i++) { const px = x + 8 + i * pw + pw / 2, py = y + h * 0.72; k.rect(px - pw * 0.32, py, pw * 0.64, h * 0.2, k.PN, k.I, 0.8); k.rect(px - pw * 0.38, py - 2, pw * 0.76, 3, k.I); if (i >= st.taken) { k.poly([[px - 5, py - 9], [px - 3, py - 13], [px + 3, py - 13], [px + 5, py - 9], [px, py - 2]], k.a(T.accent, 0.6), k.I, 0.7) } else { k.rect(px - 6, py - 14, 12, 12, null, k.ia(0.3), 0.6); rbSpark(k, px, py - 8, 2.5, A) } k.t(String(i + 1), px, py + h * 0.2 - 8, 5.5, k.S, { a: "c", w: 12 }) }
        const hx = x + 8 + Math.min(6, st.taken) * pw + pw / 2; gMask(k, hx - pw * 0.6, y + h * 0.42 + Math.sin(TM / 3) * 2, small ? 0.55 : 0.8, { ears: gVar(st, 51, 3), stripe: gVar(st, 52, 2) === 1 }, k.I, T.panel, [A, k.a(T.altBg, 1), k.a("#E3B341", 1)][gVar(st, 53, 3)])
      } })
  }
}

// NEON DISTRICT: a netrunner climbing a corp tower one floor at a time
GAMES.cyber = {
  title: "W-10 // TOWER RUN",
  init(now, prev) { return gRun(prev, { game: "cyber", seed: (now % 233280) || 37, handle: gPick(() => ((now / 7) % 991) / 991, ["v0idkid", "rainwire", "gl1tch", "kitsune", "n30n_m0m", "sable_x"]), floor: 1, ram: 80, trace: 10, creds: prev ? prev.creds : 0, chrome: 0, tower: prev ? prev.tower + (prev.floor >= 100 ? 1 : 0) : 1 }) },
  right(st, inp) { return inp.charging ? "JACKED IN · RAM UP" : `FLOOR ${st.floor}/100` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.cyber; st.turn++
    if (inp.charging) { st.ram = 100; st.trace -= 10; gLog(st, "Jacked into a wall socket. RAM full, trace scrubbed."); st.trace = gClamp(st.trace); return }
    st.ram -= 6
    const e = r()
    if (e < 0.32) { const f = 1 + Math.floor(r() * 4); st.floor += f; st.trace += 6; gLog(st, `Breached ICE. Up ${f} floors.`) }
    else if (e < 0.44) { const c = 100 + Math.floor(r() * 900); st.creds += c; gLog(st, `Paydata extracted. +${c}c.`) }
    else if (e < 0.54) { st.trace += 15; gLog(st, "Trace spike. Black ICE sniffing.") }
    else if (e < 0.62 && st.creds >= 800) { st.creds -= 800; st.chrome++; st.ram += 20; gLog(st, `Bought chrome mk.${st.chrome}. RAM +20.`) }
    else if (e < 0.7) { st.trace -= 8; gLog(st, "Spoofed a security daemon. Trace down.") }
    else gLog(st, gPick(r, ["Elevator music in the server room.", "Found a sysadmin's lunch order. Ominous.", "Neon flicker on floor " + st.floor + "."]))
    st.ram = gClamp(st.ram); st.trace = gClamp(st.trace)
    if (st.floor >= 100) { const best = Math.max(st.best || 0, 100); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, "Penthouse server cracked. On to the next tower.") }
    else if (st.trace >= 100 || st.ram <= 0) { const h = st.handle, best = Math.max(st.best || 0, st.floor); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `@${h} traced and burned. New handle: @${st.handle}.`) }
  },
  paint(k, W, H, st, inp) {
    const TM = Date.now() / 60000, P = k.a(T.headBg, 1), C = k.a(T.accent, 1)
    gFrame(k, W, H, st, { font: "disp", hot: P, kicker: inp.charging ? "JACKED IN // CHARGING" : st.trace > 70 ? "TRACE CRITICAL" : "RUNNING", title: `@${st.handle}`.toUpperCase(), sub: H > 200 ? `TOWER ${st.tower} · ${st.creds}c · CHROME MK.${st.chrome} · BEST ${st.best || 0}F` : `TOWER ${st.tower} · ${st.creds}c · MK.${st.chrome}`, bars: [["RAM", st.ram / 100, C], ["TRACE", st.trace / 100, P], ["FLOOR", st.floor / 100, k.I]], logTitle: "RUN LOG", hint: "CHARGE THE PHONE TO RECHARGE RAM",
      scene(k, x, y, w, h, small) {
        cySky(k, w, y + h - 40, 40, k.rng(st.tower * 7)); const tw = w * 0.34, tx = x + w / 2 - tw / 2
        k.rect(tx, y + 6, tw, h - 6, k.a(T.ground, 0.9)); notch(k, tx, y + 6, tw, h - 6, 8, T.accent, 1, null)
        const fl = 20, fh = (h - 14) / fl, curI = Math.floor((st.floor % 100) / 5)
        for (let i = 0; i < fl; i++) { const fy = y + h - 4 - (i + 1) * fh; for (let j = 0; j < 5; j++) k.rect(tx + 5 + j * (tw - 10) / 5, fy + 1, (tw - 10) / 5 - 2, fh - 2, i < curI ? k.a(T.accent, 0.35) : i === curI ? P : k.ia(0.05)) }
        const gy = y + h - 4 - (curI + 0.5) * fh; k.rect(tx - 4 + Math.sin(TM) * 3, gy - 2, tw + 8, 3, k.a(T.headBg, 0.6))
        k.t(`F${st.floor}`, tx + tw + 6, gy - 5, 7, P, { f: "bold", w: 40 })
        for (let i = 0; i < 6; i++) { const yy = y + ((TM * 13 + i * 23) % h); k.rect(x + 4 + (i * 37) % (w - 30), yy, 18 + (i % 3) * 10, 1.5, k.a(i % 2 ? T.headBg : T.accent, 0.5)) }
        const rs2 = small ? 0.9 : 1.3; notch(k, x + 6, y + 6, 44 * rs2, 46 * rs2, 6, T.headBg, 1, k.a(T.ground, 0.92)); gRunner(k, x + 6 + 22 * rs2, y + 6 + 22 * rs2, rs2, { hair: gVar(st, 61, 4), hairCol: gVar(st, 62, 4), chrome: gVar(st, 63, 2) === 1 }, k.I, [P, C, k.a("#FCEE0A", 1), k.a("#B8F2E6", 1)][gVar(st, 64, 4)], C)
      } })
  }
}

// VAPOR PLAZA: keep the eternal mall open
GAMES.vapor = {
  title: "W-10 // MALL.EXE",
  shops: ["Sunset Video", "Pretzel Paradise", "Cassette Corner", "Laser Tag Galaxy", "Palm Imports", "Fountain Court", "Neon Nails", "Pager World", "Teal Tees", "Arcade 95", "Smoothie Cove", "Gift Grotto"],
  init(now, prev) { return gRun(prev, { game: "vapor", seed: (now % 233280) || 41, mall: gPick(() => ((now / 3) % 983) / 983, ["Plaza Del Sol", "Crystal Galleria", "Dreamway Mall", "Palm Court Center", "Mirage Plaza"]), open: [0, 1], shoppers: 40, coins: prev ? prev.coins : 0, vibe: 70, day: 1 }) },
  right(st, inp) { return inp.charging ? "LIGHTS ON" : `${st.open.length}/12 OPEN` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.vapor; st.turn++; if (st.turn % 4 === 0) st.day++
    if (inp.charging) { st.vibe += 15; st.shoppers += 20; gLog(st, "Mall lights on. Escalators humming.") } else st.vibe -= 4
    st.coins += Math.floor(st.shoppers / 10)
    const e = r()
    if (e < 0.2 && st.open.length < 12) { const left = G.shops.map((_, i) => i).filter(i => !st.open.includes(i)); const i = gPick(r, left); st.open.push(i); gLog(st, `${G.shops[i]} is now open.`) }
    else if (e < 0.3) { st.shoppers += 25; gLog(st, "Food court rush. Fountain glittering.") }
    else if (e < 0.38) { st.vibe -= 10; gLog(st, "Escalator stuck between floors again.") }
    else if (e < 0.46) { st.vibe += 8; gLog(st, "Ghost shoppers spotted. Very polite.") }
    else if (e < 0.52 && st.open.length > 1) { const i = st.open.splice(Math.floor(r() * st.open.length), 1)[0]; gLog(st, `${G.shops[i]}: closed since 1997.`) }
    else gLog(st, gPick(r, ["Mallsoft hour on the speakers.", "Someone made a wish at the fountain.", "The skylight turned pink. Nobody knows why."]))
    st.shoppers = Math.max(0, Math.round(st.shoppers * 0.92)); st.vibe = gClamp(st.vibe)
    if (st.vibe <= 0) { const old = st.mall, best = Math.max(st.best || 0, st.open.length); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, `${old} dims for good. ${st.mall} opens forever.`) }
  },
  paint(k, W, H, st, inp) {
    const G = GAMES.vapor, TM = Date.now() / 60000
    gFrame(k, W, H, st, { font: "disp", hot: k.a(T.altBg, 1), kicker: inp.charging ? "LIGHTS ON // CHARGING" : "NOW OPEN", title: st.mall, sub: `DAY ${st.day} · ${st.shoppers} SHOPPERS · ${st.coins} COINS`, bars: [["VIBE", st.vibe / 100, k.a(T.headBg, 1)], ["STORES", st.open.length / 12, k.a(T.altBg, 1)]], logTitle: "MALL PA", hint: "Charge the phone to switch the mall lights on.",
      scene(k, x, y, w, h, small) {
        winBox(k, x, y, w, h, "mall.exe")
        const gx = x + 6, gy = y + 20, gw = w - 12, gh = h - 26, cw = gw / 4, ch = gh / 3
        G.shops.forEach((s, i) => { const cx = gx + (i % 4) * cw, cy = gy + Math.floor(i / 4) * ch, on = st.open.includes(i); k.rect(cx + 2, cy + 2, cw - 4, ch - 4, on ? k.a([T.headBg, T.altBg, "#FFFB96", "#B8F2E6"][(i + gVar(st, 71, 4)) % [3, 3, 4, 4][gVar(st, 72, 4)]], 0.85) : k.a("#101018", 0.12), k.a("#4A4A5A", 1), 0.6); if (!small && on) k.t(s.split(" ")[0], cx + cw / 2, cy + ch / 2 - 4, 5.5, k.a("#101018", 1), { a: "c", w: cw - 4 }) })
        const fx = gx + gw / 2, fy = gy + gh / 2; k.circ(fx, fy, small ? 8 : 12, k.a("#7FE3F0", 0.9), k.a("#101018", 1), 0.8); for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + (i - 1.5) * 0.5, l = 4 + Math.abs(Math.sin(TM + i)) * 4; k.ln([[fx, fy - 2], [fx + l * Math.cos(a), fy - 2 + l * Math.sin(a)]], k.a("#FFFFFF", 0.6), 0.8) } gMascot(k, fx, fy + 1, small ? 0.6 : 0.9, gVar(st, 73, 4))
      } })
  }
}

// WILDWOOD: tend a grove from seed to bloom
GAMES.nature = {
  title: "W-10 // The Grove",
  visitors: ["a wren", "a red fox", "two deer", "a box turtle", "a great horned owl", "a hummingbird", "a rabbit", "a heron"],
  init(now, prev) { return gRun(prev, { game: "nature", seed: (now % 233280) || 43, plants: [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => i < 2 ? 1 : 0), water: 70, sun: 60, sightings: [], season: 0, year: prev ? prev.year + 1 : 1 }) },
  right(st, inp) { return inp.charging ? "Rain on the grove" : ["Spring", "Summer", "Autumn", "Winter"][st.season] },
  step(st, inp) {
    const r = gRng(st), G = GAMES.nature, night = inp.hour < 6 || inp.hour >= 21; st.turn++; if (st.turn % 12 === 0) st.season = (st.season + 1) % 4
    if (inp.charging) { st.water += 25; gLog(st, "Rain fell on the grove. Soil soaked.") } else st.water -= 6
    st.sun = night ? Math.max(0, st.sun - 10) : Math.min(100, st.sun + 8)
    const e = r()
    if (e < 0.3 && st.water > 25 && st.season !== 3) { const i = Math.floor(r() * 8); if (st.plants[i] < 4) { st.plants[i]++; gLog(st, st.plants[i] === 1 ? "A seed broke the soil." : st.plants[i] === 4 ? "Something bloomed overnight." : "New leaves unfurled.") } }
    else if (e < 0.44) { const v = gPick(r, G.visitors); st.sightings = (st.sightings || []).concat([v]).slice(-6); gLog(st, `Spotted ${v} at the edge of the grove.`) }
    else if (e < 0.52) { st.water -= 10; gLog(st, "Dry spell. The moss went quiet.") }
    else if (e < 0.58 && st.season === 2) gLog(st, "Leaves turning. The grove smells like rain.")
    else gLog(st, gPick(r, ["Listened. A woodpecker answered.", "Mushrooms after the night.", "A bee checked every flower twice."]))
    if (st.water <= 0) { st.water = 0; const i = st.plants.findIndex(p => p > 0); if (i >= 0) { st.plants[i]--; gLog(st, "Thirsty. A plant wilted back.") } }
    st.water = gClamp(st.water)
    if (st.plants.every(p => p === 0) && st.turn > 3) { const best = Math.max(st.best || 0, st.sightings.length); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, "The grove rests. New seeds scattered on the wind.") }
  },
  paint(k, W, H, st, inp) {
    const TM = Date.now() / 60000, A = k.a(T.altBg, 1), Gn = k.a(T.headBg, 1), blooms = st.plants.filter(p => p === 4).length
    gFrame(k, W, H, st, { font: "disp", hot: A, kicker: inp.charging ? "RAIN // CHARGING" : ["SPRING", "SUMMER", "AUTUMN", "WINTER"][st.season], title: "The Grove", sub: `YEAR ${st.year} · BLOOMS ${blooms}/8 · ${(st.sightings || []).length} SIGHTINGS`, bars: [["WATER", st.water / 100, k.a("#5B8DB8", 1)], ["SUN", st.sun / 100, k.a("#E3B341", 1)], ["GROWTH", st.plants.reduce((a, b) => a + b, 0) / 32, Gn]], logTitle: "FIELD NOTES", hint: "Charge the phone to bring rain to the grove.",
      scene(k, x, y, w, h, small) { naGrove(k, x, y, w, h, small, st, inp, TM)       } })
  }
}

// ---------- THE GROVE: a fenced garden bed through the seasons, keeper on the ground, visitors drawn as themselves ----------
function gShadow(k, x, y, rx) { k.ell(x, y, rx, Math.max(1, rx * 0.26), k.a("#000000", 0.2)) }
function gKeeperGround(k, x, gy, s, kind, ink, postTop) {
  const I = k.a("#1F2A22", 1)
  if (kind === 1) { // owl, perched on the fence post
    const py = postTop; k.ell(x, py - 9 * s, 6.5 * s, 8.5 * s, k.a("#8A6A44", 1), I, 0.6); k.ell(x, py - 7 * s, 4.2 * s, 5.5 * s, k.a("#D9C29A", 1))
    for (let j = 0; j < 3; j++) k.ln([[x - 2 * s, py - 9 * s + j * 2.6 * s], [x, py - 8 * s + j * 2.6 * s], [x + 2 * s, py - 9 * s + j * 2.6 * s]], k.a("#8A6A44", 1), 0.6)
    k.ell(x, py - 15 * s, 5.6 * s, 4.6 * s, k.a("#8A6A44", 1), I, 0.6); k.ell(x, py - 14.6 * s, 4.4 * s, 3.4 * s, k.a("#E8D6B0", 1))
    k.poly([[x - 4.6 * s, py - 18 * s], [x - 5.6 * s, py - 22 * s], [x - 2.4 * s, py - 19 * s]], k.a("#6B4E30", 1)); k.poly([[x + 4.6 * s, py - 18 * s], [x + 5.6 * s, py - 22 * s], [x + 2.4 * s, py - 19 * s]], k.a("#6B4E30", 1))
    ;[-1, 1].forEach(sd => { k.circ(x + sd * 2.1 * s, py - 15 * s, 1.8 * s, k.a("#FFFFFF", 1), I, 0.4); k.circ(x + sd * 2.1 * s, py - 15 * s, 0.85 * s, I) }); k.poly([[x - 0.8 * s, py - 13.6 * s], [x + 0.8 * s, py - 13.6 * s], [x, py - 11.8 * s]], k.a("#E3A53A", 1))
    k.ln([[x - 2 * s, py], [x - 2 * s, py - 1.4 * s]], k.a("#E3A53A", 1), 1.1 * s); k.ln([[x + 2 * s, py], [x + 2 * s, py - 1.4 * s]], k.a("#E3A53A", 1), 1.1 * s); return
  }
  gShadow(k, x, gy + 0.5, 11 * s)
  if (kind === 0) { // badger
    k.rect(x - 7 * s, gy - 4 * s, 2.2 * s, 4 * s, I); k.rect(x + 4 * s, gy - 4 * s, 2.2 * s, 4 * s, I)
    k.ell(x - 1 * s, gy - 7 * s, 10 * s, 5.6 * s, k.a("#7A7A76", 1), I, 0.6); k.ln([[x - 9 * s, gy - 9 * s], [x + 6 * s, gy - 11.6 * s]], k.a("#9A9A94", 1), 1.2 * s)
    k.poly([[x + 6 * s, gy - 11.5 * s], [x + 17 * s, gy - 6.5 * s], [x + 6 * s, gy - 3.5 * s]], k.a("#F4EEDF", 1), I, 0.6); k.poly([[x + 6.5 * s, gy - 9.5 * s], [x + 16 * s, gy - 6.8 * s], [x + 6.5 * s, gy - 7.2 * s]], I)
    k.circ(x + 16.6 * s, gy - 6.4 * s, 1.1 * s, I); k.circ(x + 7.5 * s, gy - 11.3 * s, 1.5 * s, I); k.poly([[x - 11 * s, gy - 8 * s], [x - 14 * s, gy - 6 * s], [x - 10.5 * s, gy - 5.5 * s]], k.a("#7A7A76", 1))
  } else if (kind === 2) { // fox, sitting with its tail wrapped round
    const R = k.a("#C2662D", 1); k.poly(nCurve([[x - 9 * s, gy], [x - 15 * s, gy - 3 * s], [x - 14 * s, gy - 7 * s], [x - 8 * s, gy - 4 * s], [x - 2 * s, gy - 1 * s]], 4).concat([[x - 2 * s, gy]]), R, I, 0.6); k.circ(x - 14.4 * s, gy - 6 * s, 2 * s, k.a("#F4EEDF", 1))
    k.poly(nCurve([[x - 6 * s, gy], [x - 7 * s, gy - 9 * s], [x - 2 * s, gy - 17 * s], [x + 3 * s, gy - 15 * s], [x + 4 * s, gy - 6 * s], [x + 3 * s, gy]], 4), R, I, 0.6)
    k.poly([[x + 0.5 * s, gy - 15 * s], [x + 3.4 * s, gy - 6 * s], [x + 2 * s, gy - 1 * s], [x - 0.5 * s, gy - 9 * s]], k.a("#F4EEDF", 1))
    k.poly([[x - 3 * s, gy - 16 * s], [x - 2 * s, gy - 24 * s], [x + 1 * s, gy - 19 * s], [x + 4 * s, gy - 24 * s], [x + 5 * s, gy - 17 * s], [x + 11 * s, gy - 15 * s], [x + 4 * s, gy - 12.5 * s], [x - 1 * s, gy - 13 * s]], R, I, 0.6)
    k.poly([[x + 5 * s, gy - 15.5 * s], [x + 11 * s, gy - 15 * s], [x + 4 * s, gy - 12.5 * s]], k.a("#F4EEDF", 1)); k.circ(x + 11 * s, gy - 15 * s, 0.9 * s, I); k.circ(x + 3 * s, gy - 17.5 * s, 0.9 * s, I)
    k.ln([[x + 1 * s, gy], [x + 1 * s, gy - 4 * s]], I, 0.7)
  } else { // hedgehog, on patrol
    const pts = [[x - 10 * s, gy - 1 * s]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, rr = (i % 2 ? 10.5 : 8) * s; pts.push([x + rr * Math.cos(a), gy - 1.5 * s + rr * 0.78 * Math.sin(a)]) } pts.push([x + 9 * s, gy - 1 * s]); k.poly(pts, k.a("#8A6A44", 1), I, 0.6)
    for (let i = 0; i < 7; i++) { const a = Math.PI * 1.15 + i / 6 * Math.PI * 0.7; k.ln([[x + 4 * s * Math.cos(a), gy - 3 * s + 3 * s * Math.sin(a)], [x + 8 * s * Math.cos(a), gy - 3 * s + 6.5 * s * Math.sin(a)]], k.a("#5A4128", 1), 0.6) }
    k.poly([[x + 7 * s, gy - 5 * s], [x + 15 * s, gy - 2 * s], [x + 7 * s, gy]], k.a("#E8D6B0", 1), I, 0.6); k.circ(x + 15 * s, gy - 2 * s, 1 * s, I); k.circ(x + 10 * s, gy - 3.4 * s, 0.7 * s, I)
    k.ln([[x - 4 * s, gy - 0.5 * s], [x - 4 * s, gy + 0.8 * s]], I, 1.2 * s); k.ln([[x + 4 * s, gy - 0.5 * s], [x + 4 * s, gy + 0.8 * s]], I, 1.2 * s)
  }
}
function gVisitor(k, v, ctx) {
  const I = k.a("#1F2A22", 1), s = ctx.s, { rx, fenceTop, fenceY, gy, hz, bloom, TM } = ctx
  if (!v) return
  if (v.includes("wren")) { const x = ctx.x + ctx.w - 2 - 2 * s, y = fenceTop + 0.5; k.ell(x, y - 3.5 * s, 3.6 * s, 2.8 * s, k.a("#9A6A3E", 1), I, 0.5); k.circ(x + 3 * s, y - 6 * s, 2 * s, k.a("#9A6A3E", 1), I, 0.5); k.poly([[x - 3 * s, y - 4.5 * s], [x - 6 * s, y - 9 * s], [x - 2 * s, y - 5.5 * s]], k.a("#7A4E2A", 1)); k.poly([[x + 4.8 * s, y - 6.2 * s], [x + 7 * s, y - 5.8 * s], [x + 4.8 * s, y - 5.4 * s]], I); k.circ(x + 3.6 * s, y - 6.4 * s, 0.5 * s, I) }
  else if (v.includes("owl")) gKeeperGround(k, rx, gy, s * 0.95, 1, I, fenceTop)
  else if (v.includes("deer")) { [[0.62, 1], [0.78, 0.86]].forEach(([fx, z]) => { const x = ctx.x + ctx.w * fx, y = hz + 4 * s, q = s * 0.8 * z, B = k.a("#9A6A3E", 1); [-4, -2.6, 2.6, 4].forEach(dx => k.ln([[x + dx * q, y - 4 * q], [x + dx * q, y + 2 * q]], k.a("#5A3E22", 1), 0.8 * q)); k.ell(x, y - 5 * q, 5.5 * q, 2.8 * q, B); k.ln([[x + 4 * q, y - 6 * q], [x + 6.5 * q, y - 11 * q]], B, 2.2 * q); k.ell(x + 7.6 * q, y - 11.4 * q, 2.4 * q, 1.4 * q, B); k.poly([[x + 6 * q, y - 12.5 * q], [x + 5.4 * q, y - 15 * q], [x + 7 * q, y - 12.8 * q]], B); k.circ(x - 5.5 * q, y - 6 * q, 1 * q, k.a("#F4EEDF", 1)) }) }
  else if (v.includes("fox")) { const x = ctx.x + ctx.w * 0.7, y = hz + 8 * s, q = s * 0.7, R = k.a("#C2662D", 1); [-4, -2, 3, 5].forEach((dx, i) => k.ln([[x + dx * q, y - 3 * q], [x + dx * q + (i % 2 ? 1 : -1) * q, y + 1 * q]], I, 0.8 * q)); k.ell(x, y - 4.5 * q, 6 * q, 2.6 * q, R); k.poly([[x - 5 * q, y - 5 * q], [x - 13 * q, y - 4 * q], [x - 6 * q, y - 3 * q]], R); k.circ(x - 12.5 * q, y - 4 * q, 1.2 * q, k.a("#F4EEDF", 1)); k.poly([[x + 5 * q, y - 6.5 * q], [x + 11 * q, y - 5 * q], [x + 5 * q, y - 3.5 * q]], R); k.poly([[x + 5.5 * q, y - 6.4 * q], [x + 6.5 * q, y - 9 * q], [x + 7.5 * q, y - 6.2 * q]], R) }
  else if (v.includes("turtle")) { const x = rx - 4 * s, y = gy + 2 * s; gShadow(k, x, y + 0.5, 7 * s); k.ell(x + 6 * s, y - 1.6 * s, 2 * s, 1.4 * s, k.a("#7A8A4A", 1), I, 0.4); k.poly(k.arcPts(x, y - 0.5 * s, 6 * s, Math.PI, Math.PI * 2, 12), k.a("#6B4A2A", 1), I, 0.5); for (let i = 0; i < 3; i++) k.circ(x - 3 * s + i * 3 * s, y - 3 * s, 1 * s, k.a("#E3B341", 0.9)); k.ln([[x - 4 * s, y], [x - 5 * s, y + 1 * s]], I, 0.9 * s); k.ln([[x + 4 * s, y], [x + 5 * s, y + 1 * s]], I, 0.9 * s) }
  else if (v.includes("hummingbird")) { const x = bloom ? bloom[0] + 9 * s : rx - 6 * s, y = bloom ? bloom[1] - 3 * s : fenceTop - 10 * s, wb = Math.sin(TM * 7) * 2 * s; k.ell(x - 1 * s, y - 4 * s + wb, 3.5 * s, 1.4 * s, k.a("#FFFFFF", 0.6)); k.ell(x + 1 * s, y - 4.6 * s - wb, 3.2 * s, 1.2 * s, k.a("#FFFFFF", 0.5)); k.ell(x, y, 3 * s, 1.8 * s, k.a("#3E8A5A", 1), I, 0.4); k.circ(x - 2.6 * s, y - 0.6 * s, 1.4 * s, k.a("#3E8A5A", 1)); k.circ(x - 2.2 * s, y + 0.3 * s, 0.9 * s, k.a("#C8312E", 1)); k.ln([[x - 3.8 * s, y - 0.6 * s], [x - 7.6 * s, y - 0.2 * s]], I, 0.6); k.poly([[x + 2.6 * s, y], [x + 5.4 * s, y - 1 * s], [x + 5 * s, y + 1 * s]], k.a("#2E6A44", 1)) }
  else if (v.includes("rabbit")) { const x = rx - 4 * s, y = gy + 2 * s, C2 = k.a("#B8A288", 1); gShadow(k, x, y + 0.5, 6 * s); k.ell(x, y - 4 * s, 5 * s, 4 * s, C2, I, 0.5); k.circ(x + 4 * s, y - 8 * s, 2.8 * s, C2, I, 0.5); k.ell(x + 3.2 * s, y - 13 * s, 1 * s, 3.4 * s, C2, I, 0.4); k.ell(x + 5 * s, y - 12.6 * s, 1 * s, 3.2 * s, C2, I, 0.4); k.circ(x - 5 * s, y - 3 * s, 1.6 * s, k.a("#FFFFFF", 1)); k.circ(x + 5 * s, y - 8.4 * s, 0.6 * s, I) }
  else if (v.includes("heron")) { const x = rx - 2 * s, y = fenceY + 2 * s, B = k.a("#8E9AA8", 1); k.ln([[x - 1 * s, y], [x - 1 * s, y - 10 * s]], k.a("#5A6470", 1), 0.7); k.ln([[x + 1 * s, y], [x + 1 * s, y - 10 * s]], k.a("#5A6470", 1), 0.7); k.ell(x, y - 13 * s, 4.4 * s, 3.2 * s, B, I, 0.5); k.ln(nCurve([[x + 2 * s, y - 15 * s], [x + 4 * s, y - 19 * s], [x + 2 * s, y - 23 * s], [x + 3.5 * s, y - 26 * s]], 4), B, 1.6 * s); k.circ(x + 3.5 * s, y - 26.4 * s, 1.6 * s, B); k.ln([[x + 4.6 * s, y - 26.4 * s], [x + 9 * s, y - 25.6 * s]], k.a("#E3A53A", 1), 0.8 * s); k.ln([[x + 2.4 * s, y - 27.4 * s], [x - 1.6 * s, y - 28.4 * s]], I, 0.5) }
}
function naGrove(k, X, Y, W0, H0, small, st, inp, TM) {
  k.rect(X + 2, Y + 2, W0, H0, k.a("#000000", 0.12)); k.rect(X, Y, W0, H0, k.a("#FFFDF6", 1))
  const x = X + 4, y = Y + 4, w = W0 - 8, h = H0 - 8, sea = st.season, night = inp.hour < 6 || inp.hour >= 21, rain = !!inp.charging
  const s = small ? 0.62 : Math.min(1.15, h / 108), hz = y + h * 0.4, gy = y + h - (small ? 9 : 13), fenceY = gy - 13 * s, fenceTop = fenceY - 11 * s
  const SKY = rain ? ["#8E9AA3", "#C9CFCC"] : night ? ["#132238", "#33465C"] : [["#BCD8E6", "#EAF2DF"], ["#94C4E6", "#F2EAC8"], ["#C7C3D6", "#F1D2A6"], ["#C9D3DB", "#EEF1F3"]][sea]
  for (let i = 0; i < hz - y + 2; i += 2) k.rect(x, y + i, w, 2.2, k.a(nMix(SKY[0], SKY[1], i / (hz - y)), 1))
  // sun, moon and stars, or the rain cloud when it's charging
  if (rain) { for (let i = 0; i < 4; i++) k.ell(x + w * (0.25 + i * 0.17), y + 10 * s + (i % 2) * 3, 16 * s, 7 * s, k.a("#6F7C86", 0.85)); }
  else if (night) { for (let i = 0; i < 14; i++) k.circ(x + 4 + ((i * 53) % (w - 8)), y + 3 + ((i * 29) % Math.max(4, (hz - y) * 0.6)), i % 4 ? 0.5 : 0.9, k.a("#FFF6DA", 0.8)); const mx = x + w - 16 * s, my = y + 12 * s; k.circ(mx, my, 6 * s, k.a("#F6EFD2", 1)); k.circ(mx + 2.6 * s, my - 1.4 * s, 5.4 * s, k.a(nMix(SKY[0], SKY[1], (my - y) / (hz - y)), 1)) }
  else { const sx = x + w - 17 * s, sy = y + 15 * s; for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2 + TM / 10; k.ln([[sx + 8 * s * Math.cos(a), sy + 8 * s * Math.sin(a)], [sx + 11.5 * s * Math.cos(a), sy + 11.5 * s * Math.sin(a)]], k.a("#E3B341", 1), 0.9) } k.circ(sx, sy, 6 * s, k.a("#E3B341", 1), k.a("#C99A2A", 1), 0.6) }
  // far hills and a treeline dressed for the season
  const hill = (base, amp, ph, col) => { const pts = []; for (let i = 0; i <= w; i += 4) pts.push([x + i, base - Math.sin(i / w * Math.PI * 1.6 + ph) * amp]); k.poly(pts.concat([[x + w, y + h], [x, y + h]]), col) }
  const dk = night ? 0.45 : rain ? 0.2 : 0
  hill(hz + 4, 4 * s, 0.6, k.a(nMix(["#9DBF8A", "#86B06E", "#C9A46A", "#C8D2D6"][sea], "#1A2430", dk), 1))
  const leafC = [["#7FA65A", "#F2B8C8"], ["#4E8A44", "#3E7A3A"], ["#D9822B", "#B8431E"], ["#7A7A72", "#FFFFFF"]][sea]
  for (let i = 0; i < 12; i++) { const tx = x + 4 + i * (w - 8) / 11, tb = hz + 5 - Math.sin((tx - x) / w * Math.PI * 1.6 + 0.6) * 4 * s, th = (9 + (i * 7) % 6) * s
    if (sea === 3) { k.ln([[tx, tb], [tx, tb - th]], k.a(nMix("#5A5048", "#1A2430", dk), 1), 0.9); k.ln([[tx, tb - th * 0.5], [tx - th * 0.3, tb - th * 0.85]], k.a("#5A5048", 1), 0.6); k.ln([[tx, tb - th * 0.6], [tx + th * 0.3, tb - th * 0.95]], k.a("#5A5048", 1), 0.6); k.circ(tx, tb - th, 1.4 * s, k.a("#FFFFFF", 0.9)) }
    else { k.rect(tx - 0.6, tb - th * 0.35, 1.2, th * 0.35, k.a("#5A4128", 1)); k.circ(tx, tb - th * 0.62, th * 0.42, k.a(nMix(leafC[i % 3 === 0 ? 1 : 0], "#1A2430", dk), 1)); if (sea === 0 && i % 2) k.circ(tx + 1.5, tb - th * 0.7, 1.1, k.a("#F2B8C8", 1)) } }
  // the meadow, the fence and the bed
  const grass = nMix(["#8DBA6A", "#7DB05A", "#A9A35A", "#E4EAEC"][sea], "#1A2430", dk)
  k.rect(x, hz + 6, w, y + h - hz - 6, k.a(grass, 1)); hill(hz + 10 * s, 3 * s, 2.2, k.a(nMix(grass, "#FFFFFF", 0.12), 1))
  // the meadow between treeline and fence: tufts, seasonal wildflowers, a bush, and on big widgets a pond with reeds
  const mTop = hz + 12 * s, mBot = fenceTop - 2, mH = mBot - mTop, tuftC = k.a(nMix(grass, "#2E4A22", 0.35), 1)
  if (mH > 8) {
    if (h > 140) { const px2 = x + w * 0.24, py2 = mTop + mH * 0.55, pr = Math.min(w * 0.11, mH * 0.9); k.ell(px2, py2, pr, pr * 0.32, k.a(night ? "#2A4058" : sea === 3 ? "#C9DCE6" : "#7FB2CF", 1), k.a("#4A6A7A", 0.6), 0.6); k.ln([[px2 - pr * 0.5, py2 - pr * 0.05], [px2 - pr * 0.1, py2 - pr * 0.06]], k.a("#FFFFFF", 0.7), 0.8); if (sea !== 3) { k.ell(px2 + pr * 0.35, py2 + pr * 0.06, pr * 0.14, pr * 0.05, k.a("#5E8A44", 1)); for (let i = 0; i < 6; i++) { const rx3 = px2 + pr * (0.75 + i * 0.07), rb = py2 + pr * 0.1; k.ln([[rx3, rb], [rx3 + 0.6, rb - (7 + (i % 3) * 3) * s]], k.a("#4E6A30", 1), 0.7); if (i % 2) k.ell(rx3 + 0.6, rb - (7 + (i % 3) * 3) * s, 0.9 * s, 2.2 * s, k.a("#6B4A2A", 1)) } } }
    const bx2 = x + w * 0.86, by2 = mTop + mH * 0.6, br = h > 140 ? Math.min(9 * s, mH * 0.5) : 0; if (br) [[-0.6, 0.1, 0.7], [0.5, 0.15, 0.65], [0, -0.25, 0.85]].forEach(([dx, dy, rr]) => k.circ(bx2 + dx * br, by2 + dy * br, br * rr, k.a(nMix(sea === 2 ? "#B8822F" : sea === 3 ? "#9AA7A0" : "#4E7A3C", "#1A2430", dk), 1), k.a("#2E4A22", 0.4), 0.5)); if (br && (sea === 0 || sea === 1)) for (let i = 0; i < 5; i++) k.circ(bx2 + (i - 2) * br * 0.35, by2 - br * 0.2 + (i % 2) * br * 0.3, 0.9, k.a(sea === 0 ? "#F2B8C8" : "#C8312E", 1)); if (br) gShadow(k, bx2, by2 + br * 0.55, br * 1.1)
    for (let i = 0; i < (h > 140 ? 30 : 16); i++) { const tx2 = x + 4 + ((i * 47) % (w - 8)), ty2 = mTop + ((i * 23) % Math.max(1, mH)), far = 0.6 + 0.4 * (ty2 - mTop) / Math.max(1, mH); if (Math.abs(tx2 - bx2) < br * 1.4 && Math.abs(ty2 - by2) < br) continue; k.ln([[tx2, ty2], [tx2 - 1, ty2 - 2.6 * s * far]], tuftC, 0.6); k.ln([[tx2 + 1.2, ty2], [tx2 + 1.8, ty2 - 3.2 * s * far]], tuftC, 0.6)
      if (i % 3 === 0 && sea < 3) { const fc = [["#F2B8C8", "#FFFFFF"], ["#FFFFFF", "#E3B341"], ["#D9822B", "#B8431E"]][sea]; if (sea === 2) nLeaf(k, tx2 + 3, ty2 - 0.5, 2.6 * s, i, k.a(fc[i % 2], 0.9)); else { k.circ(tx2 + 3, ty2 - 2.2 * s * far, 1.2 * far * Math.max(1, s), k.a(fc[0], 1)); k.circ(tx2 + 3, ty2 - 2.2 * s * far, 0.5 * far * Math.max(1, s), k.a(fc[1], 1)) } } }
  }
  const posts = small ? 4 : 6, wood = k.a(nMix("#8B6A44", "#1A2430", dk), 1), woodD = k.a("#4A3420", 1)
  for (let i = 0; i < posts; i++) { const px = x + 6 + i * (w - 12) / (posts - 1); k.rect(px - 1.6 * s, fenceTop, 3.2 * s, fenceY - fenceTop + 2 * s, wood, woodD, 0.5); if (sea === 3) k.rect(px - 1.8 * s, fenceTop - 1.2 * s, 3.6 * s, 1.6 * s, k.a("#FFFFFF", 1)) }
  ;[0.3, 0.7].forEach(f => { const ry = fenceTop + (fenceY - fenceTop) * f; k.rect(x + 4, ry - 1 * s, w - 8, 2 * s, wood); k.ln([[x + 4, ry + 1 * s], [x + w - 4, ry + 1 * s]], woodD, 0.5) })
  const bedTop = gy - 4 * s; k.rect(x, bedTop, w, y + h - bedTop, k.a(sea === 3 ? "#EEF3F5" : nMix("#7A5638", "#1A2430", dk), 1)); k.ln([[x, bedTop], [x + w, bedTop]], k.a(sea === 3 ? "#C8D6DE" : "#4E3424", 1), 0.8)
  if (sea !== 3) { for (let j = 1; j < 3; j++) k.ln([[x, bedTop + j * (y + h - bedTop) / 3], [x + w, bedTop + j * (y + h - bedTop) / 3]], k.a("#4E3424", 0.45), 0.5); for (let i = 0; i < 16; i++) k.circ(x + 3 + ((i * 41) % (w - 6)), bedTop + 2 + ((i * 17) % Math.max(2, y + h - bedTop - 3)), 0.7, k.a("#BFAE94", 0.9)) }
  for (let i = 0; i < 26; i++) { const gx = x + 2 + ((i * 37) % (w - 4)), gt = bedTop - 0.5; k.ln([[gx, gt], [gx - 1, gt - 3 * s]], k.a(nMix(grass, "#2E4A22", 0.4), 1), 0.6); k.ln([[gx + 1.5, gt], [gx + 2.5, gt - 2.5 * s]], k.a(nMix(grass, "#2E4A22", 0.4), 1), 0.6) }
  // the eight plots, left of the visitor's corner and right of the keeper
  const kx = x + (small ? 11 : 15) * s, p0 = x + (small ? 26 : 34) * s, p1 = x + w - (small ? 16 : 22) * s, Gn = k.a(T.headBg, 1), BLOOM = [T.altBg, "#7FA7D9", "#F4EEDF", "#C85A9E"][gVar(st, 82, 4)]
  const leaf = sea === 2 ? k.a("#C98A3A", 0.95) : sea === 3 ? k.a("#8A8A6A", 0.9) : k.a(nMix(T.headBg, "#1A2430", dk * 0.6), 0.9), ps = small ? 0.62 : Math.min(1.12, h / 112)
  let tallest = null
  st.plants.forEach((p, i) => { const px = p0 + i * (p1 - p0) / 7, sway = Math.sin(TM / 3 + i) * 1.2 * ps
    k.ell(px, gy + 1, 4.6 * ps, 1.8 * ps, k.a(sea === 3 ? "#DCE6EA" : "#5E4029", 1)); if (p === 0) { k.circ(px, gy - 0.2, 0.9 * ps, k.a("#C9B48A", 1)); return }
    const ht = [0, 7, 15, 24, 32][p] * ps, tx = px + sway, ty = gy - ht; k.ln(nCurve([[px, gy], [px + sway * 0.4, gy - ht * 0.5], [tx, ty]], 4), Gn, 1.1 * Math.max(0.8, ps))
    if (p === 1) { nLeaf(k, tx, ty, 4.5 * ps, -0.5, leaf); nLeaf(k, tx, ty, 4.5 * ps, Math.PI + 0.5, leaf) }
    else for (let j = 1; j < p; j++) { const ly = gy - ht * j / p; nLeaf(k, px + sway * j / p, ly, (4.5 + j * 1.2) * ps, -0.55, leaf); nLeaf(k, px + sway * j / p, ly + 1.5 * ps, (4 + j * 1.1) * ps, Math.PI + 0.55, leaf) }
    if (p === 3) { k.ell(tx, ty - 1.4 * ps, 1.6 * ps, 2.4 * ps, k.a(nMix(BLOOM, T.headBg, 0.5), 1), k.ia(0.4), 0.4) }
    if (p === 4) { for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2; k.ell(tx + 3.2 * ps * Math.cos(a), ty + 3.2 * ps * Math.sin(a), 2.4 * ps, 2.4 * ps, k.a(sea === 3 ? "#E8E2D8" : BLOOM, 1), k.ia(0.35), 0.4) } k.circ(tx, ty, 1.9 * ps, k.a("#E3B341", 1)); if (!tallest || ty < tallest[1]) tallest = [tx, ty] }
    if (sea === 3) k.ell(tx, ty - 0.6 * ps, 2.8 * ps, 1.1 * ps, k.a("#FFFFFF", 0.95)) })
  // the keeper stands in the grass at the end of the bed (the owl takes the first fence post)
  const kind = gVar(st, 81, 4), postX = x + 6
  gKeeperGround(k, kind === 1 ? postX + 1 * s : kx, gy + 1, small ? 0.62 : s * 0.95, kind, k.I, fenceTop)
  // whoever stopped by most recently, drawn as themselves in their own spot
  gVisitor(k, (st.sightings || []).slice(-1)[0], { s: small ? 0.7 : s, x, w, rx: x + w - 4 - (small ? 3 : 4) * s, fenceTop, fenceY, gy, hz, bloom: tallest, TM })
  // weather: rain, falling leaves, snow, petals, fireflies, and bees round the flowers
  if (rain) for (let i = 0; i < 26; i++) { const rx2 = x + 4 + (i * 37) % (w - 8), ry = y + 16 * s + ((TM * 12 + i * 13) % Math.max(10, gy - y - 20)); k.ln([[rx2, ry], [rx2 - 1.2, ry + 4.5 * s]], k.a("#5B8DB8", 0.75), 0.8) }
  else if (sea === 2) for (let i = 0; i < 6; i++) nLeaf(k, x + 8 + ((i * 47 + TM * 3) % (w - 16)), y + 18 * s + ((i * 31 + TM * 2) % (gy - y - 40 * s)), 4.5 * s, i + TM / 4, k.a(i % 2 ? "#D9822B" : "#B8431E", 0.9))
  else if (sea === 3) for (let i = 0; i < 22; i++) k.circ(x + 3 + ((i * 41 + TM * 2) % (w - 6)), y + 3 + ((i * 23 + TM * 5) % (gy - y - 6)), (i % 3 ? 0.7 : 1.1) * Math.max(1, s), k.a("#FFFFFF", 0.95))
  else if (sea === 0 && !night) for (let i = 0; i < 6; i++) k.ell(x + 10 + ((i * 53 + TM * 2) % (w - 20)), y + 20 * s + ((i * 29 + TM) % (gy - y - 50 * s)), 1.3, 0.8, k.a("#F2B8C8", 0.95))
  if (night && sea < 2) for (let i = 0; i < 7; i++) k.circ(x + 10 + ((i * 59) % (w - 20)), hz + 10 + ((i * 23) % Math.max(6, gy - hz - 26)), 1.1, k.a("#FFE27A", 0.95))
  if (!night && !rain && sea < 2 && tallest) { const bx = tallest[0] - 7 * ps + Math.sin(TM) * 3, by = tallest[1] - 8 * ps; k.ell(bx - 1, by - 2, 1.6, 1.1, k.a("#FFFFFF", 0.85)); k.ell(bx, by, 2.4, 1.6, k.a("#E3B341", 1), k.a("#1F2A22", 1), 0.4); k.ln([[bx - 0.4, by - 1.4], [bx - 0.4, by + 1.4]], k.a("#1F2A22", 1), 0.6) }
  if (night) k.rect(x, hz, w, y + h - hz, k.a("#0A1420", 0.18))
  // the mat over the edges, and a strip of tape
  const mat = k.a("#FFFDF6", 1); k.rect(X, Y, W0, 4, mat); k.rect(X, Y + H0 - 4, W0, 4, mat); k.rect(X, Y, 4, H0, mat); k.rect(X + W0 - 4, Y, 4, H0, mat); k.rect(X, Y, W0, H0, null, k.ia(0.25), 0.8)
  naTape(k, X + W0 / 2, Y + 1, 0)
}

// LONG ODDS: a bankroll trading existential markets
GAMES.market = {
  title: "W-10 // THE BANKROLL",
  init(now, prev) { const st = gRun(prev, { game: "market", seed: (now % 233280) || 47, bank: 1000, peak: 1000, streak: 0, wins: 0, losses: 0, pos: [], curve: [1000] }); for (let i = 0; i < 3; i++) GAMES.market.open(st, gRng(st)); return st },
  open(st, r) { const q = gPick(r, MK_QS), p = 0.06 + r() * 0.88, side = r() < [0.6, 0.3, 0.8, 0.5][gVar(st, 91, 4)] ? "YES" : "NO", stake = Math.round(Math.max(20, st.bank * (0.05 + r() * 0.15))); st.pos.push({ q, p, side, stake }); st.bank -= stake },
  right(st, inp) { return inp.charging ? "MARGIN TOP-UP" : `$${Math.round(st.bank)}` },
  step(st, inp) {
    const r = gRng(st), G = GAMES.market; st.turn++
    if (inp.charging) { st.bank += 500; gLog(st, "Margin topped up. +$500. The void approves.") }
    if (st.pos.length) { const ps = st.pos.shift(), price = ps.side === "YES" ? ps.p : 1 - ps.p, won = r() < price * 0.98; if (won) { const pay = Math.round(ps.stake / price); st.bank += pay; st.wins++; st.streak = Math.max(1, st.streak + 1); gLog(st, `"${ps.q}" resolved ${ps.side}. +$${pay - ps.stake}.`) } else { st.losses++; st.streak = Math.min(-1, st.streak - 1); gLog(st, `"${ps.q}" resolved ${ps.side === "YES" ? "NO" : "YES"}. -$${ps.stake}.`) } }
    if (r() < 0.35) gLog(st, `BREAKING: ${mkNews(Math.floor(r() * 60))}`)
    while (st.pos.length < 3 && st.bank > 20) G.open(st, r)
    st.peak = Math.max(st.peak, st.bank + st.pos.reduce((a, b) => a + b.stake, 0)); st.curve = (st.curve || []).concat([st.bank + st.pos.reduce((a, b) => a + b.stake, 0)]).slice(-30)
    if (st.bank <= 20 && st.pos.length === 0) { const best = Math.max(st.best || 0, Math.round(st.peak)); Object.assign(st, G.init(Date.now() + st.turn, st)); st.best = best; gLog(st, "LIQUIDATED. The universe opens you a new account.") }
  },
  paint(k, W, H, st, inp) {
    const TM = Date.now() / 60000, Y = k.a(T.altBg, 1), V = k.a(T.accent, 1), NO = mkNo(), eq = st.bank + st.pos.reduce((a, b) => a + b.stake, 0)
    gFrame(k, W, H, st, { font: "disp", hot: V, kicker: inp.charging ? "MARGIN TOP-UP // CHARGING" : st.streak >= 3 ? `HOT STREAK · ${st.streak} 🔥` : st.streak <= -3 ? "COLD STREAK" : "POSITIONS OPEN", title: `$${Math.round(eq).toLocaleString("en-US")}`, sub: `W ${st.wins} · L ${st.losses} · PEAK $${Math.round(st.peak)} · BEST $${st.best || 0}`, bars: st.pos.slice(0, 3).map((p, i) => [`POS ${i + 1} · ${p.side} @ ${Math.round((p.side === "YES" ? p.p : 1 - p.p) * 100)}¢ · $${p.stake}`, p.side === "YES" ? p.p : 1 - p.p, p.side === "YES" ? Y : NO]), logTitle: "RESOLUTIONS", hint: "CHARGE THE PHONE TO TOP UP YOUR MARGIN",
      scene(k, x, y, w, h, small) {
        mkCard(k, x, y, w, h)
        gTrader(k, x + w - 18, y + 18, small ? 0.8 : 1, gVar(st, 91, 4), k.I, k.a(T.accent, 1)); if (!small) k.t(['THE WHALE · MOMENTUM', 'THE SHARK · CONTRARIAN', 'THE BULL · ALWAYS YES', 'THE OWL · PATIENT'][gVar(st, 91, 4)], x + w - 34, y + 13, 6, k.a(T.accent, 1), { a: "r", w: w * 0.5 })
        const c = st.curve || [eq], mn = Math.min(...c), mx = Math.max(...c, mn + 1), base = h > 120 ? y + h - 16 : y + h - 8, pts = c.map((v, i) => [x + 8 + i * (w - 16) / Math.max(1, c.length - 1), base - (v - mn) / (mx - mn) * (base - y - 22)])
        const up = c[c.length - 1] >= c[0], col = up ? T.altBg : "#FF2D55"
        if (pts.length > 1) { k.poly(pts.concat([[pts[pts.length - 1][0], base], [pts[0][0], base]]), k.a(col, 0.14)); k.ln(pts, k.a(col, 0.35), 3); k.ln(pts, k.a(col, 1), 1.3) }
        const last = pts[pts.length - 1]; k.circ(last[0], last[1], 3 + (TM % 3), null, k.a(col, 0.5), 1); k.circ(last[0], last[1], 2, k.a(col, 1))
        k.t("EQUITY // LAST 30 RESOLUTIONS", x + 8, y + 6, 6, k.S, { w: w - 16 })
        if (h > 120) mkWhale(k, x + 6, y + h - 9, w - 12, `BREAKING · ${mkNews(Math.floor(TM / 30)).toUpperCase()}`)
      } })
  }
}
function gameSample2(f) { return gameSample(f) }
const WR_SPRITES = {
 mask: ['mask',0,0,1,1],
 vault: ['vault',0,0,1,1],
 edge: ['edge',0,0,1,1],
 audio: ['audio',0,0,1,1],
 warren: ['warren',0,0,1,1],
 lot01: ['lot01',0,0,1,1],
 lot02: ['lot02',0,0,1,1],
 lot03: ['lot03',0,0,1,1],
 lot04: ['lot04',0,0,1,1],
 lot05: ['lot05',0,0,1,1],
 lot06: ['lot06',0,0,1,1],
 lot07: ['lot07',0,0,1,1],
 lot08: ['lot08',0,0,1,1],
 lot09: ['lot09',0,0,1,1],
 lot10: ['lot10',0,0,1,1],
 lot11: ['lot11',0,0,1,1],
 lot12: ['lot12',0,0,1,1],
 cover: ['cover',0,0,1,1],
 invite: ['invite',0,0,1,1]
};
const WR_ASPECT = {"audio": 1.5, "cover": 1.5, "edge": 1.5, "invite": 0.6666666666666666, "lot01": 1.0, "lot02": 1.0, "lot03": 1.0, "lot04": 1.0, "lot05": 1.0, "lot06": 1.0, "lot07": 1.0, "lot08": 1.0, "lot09": 0.6666666666666666, "lot10": 2.0, "lot11": 0.8002853067047075, "lot12": 1.0, "mask": 1.5, "vault": 1.0, "warren": 1.5};
function wrArt(k,key,x,y,w,h){const im=T.wrImages&&T.wrImages[key];if(!im)return false;const ratio=WR_ASPECT[key]||1,dw=Math.min(w,h*ratio),dh=dw/ratio;k.dc.drawImageInRect(im,new Rect(x+(w-dw)/2,y+(h-dh)/2,dw,dh));return true;}
function wrMask(k,x,y,w,h){if(!wrArt(k,'mask',x,y,w,h))wrMaskVector(k,x,y,w,h);}
// White Rabbit / Afterimage: an opt-in enhancement of the original pearl-and-lilac heist world.
const WR_META={status:'The Job',shift:'Getaway',solar:'Cover Watch',audio:'Getaway Mix',transmission:'Calling Card',feeds:'Two Marks',youtube:'Surveillance Reel',instagram:'The Marks',discord:'The Warren',oddity:'Heist Board',game:'The Long Con'};
const WR_LOTS=[
 ['The Gala Necklace','AUREL / EAST WING','PEARL / OPEN COLLAR','Ownership under revision.'],
 ['The Jeweled Egg','PRIVATE VAULT 03','ENAMEL / CRYSTAL CORE','The original is elsewhere.'],
 ["The Ambassador's Ring",'NIGHT CARRIAGE','PEARL / SIGNET','Diplomatic silence included.'],
 ['The Crown Nobody Wears','THE AUCTION HOUSE','CERAMIC / SWEPT POINTS','Reserve price: discretion.'],
 ['The Clockwork Brooch','GLASS WALK','KINETIC / WINGED PIN','Still moves without permission.'],
 ['The Pearl Compass','THE OBSERVATORY','NACRE / FIELD KEY','Always points away from home.'],
 ['The Seventh Heirloom','LOCATION WITHHELD','CLASSIFICATION DISPUTED','Six witnesses. Seven accounts.'],
 ['The Cut Emerald','SILENT GALLERY','BERYL / STEP CUT','A very expensive vacancy.'],
 ['The Ivory Scepter','WINTER SALON','SYNTHETIC IVORY / INLAY','No sovereign attached.'],
 ['The Glass Tiara','BALCONY 04','OPTICAL GLASS / SHARD SET','Light passes. Title does not.'],
 ['The Lacquer Key','ARCHIVE ANNEX','CARBON / UNIQUE WARD','Every copy is the original.'],
 ['The Folded Seal','THE PRIVATE BOX','FOLDED FOIL / SECRET SEAL','Provenance folded inward.']
];
const WR_VENUES=['AUREL / EAST WING','PRIVATE VAULT 03','NIGHT CARRIAGE','THE AUCTION HOUSE','GLASS WALK','THE OBSERVATORY','LOWER ARCHIVE','WINTER SALON','BALCONY 04','LIFT / SERVICE ONLY','ROOFTOP TRANSFER','SAFEHOUSE / UNLISTED'];
const WR_JOBS=[['THE GALA NECKLACE','EAST WING','VELVET / SILK','A borrowed invitation.'],['THE JEWELED EGG','VAULT 03','CIPHER / GILT','Nothing on the inventory.'],['THE AMBASSADOR RING','NIGHT CARRIAGE','NOCTURNE / SILK','Alibi arrives first.'],['THE CROWN NOBODY WEARS','AUCTION HOUSE','MONOCLE / VELVET','The winning bid was silence.'],['CLOCKWORK BROOCH','GLASS WALK','GILT / CIPHER','One reflection too many.'],['THE PEARL COMPASS','OBSERVATORY','SILK / NOCTURNE','A cloudy ownership history.'],['SEVENTH HEIRLOOM','LOCATION WITHHELD','CELL 07 / SEALED','The seventh copy is missing.'],['THE CUT EMERALD','SILENT GALLERY','VELVET / GILT','The plinth stays.'],['THE IVORY SCEPTER','WINTER SALON','CIPHER / MONOCLE','No throne required.'],['THE GLASS TIARA','BALCONY 04','NOCTURNE / VELVET','Gala dress. Clean hands.']];
function wrSlot(d){return Math.abs(Math.floor(Number.isFinite(d.seed)?d.seed:+(d.now||new Date())/1800000));}
function wrSafe(raw){const k={...raw};k.t=(text,x,y,size,col,o={})=>{const s=String(text),w=o.w||300,f=o.f||'mono';raw.t(s,x,y,Math.min(size,w/Math.max(1,s.length*(f==='disp'?.61:.62))),col,{...o,nofit:true});};k.para=(text,x,y,w,fs,col,f='disp',max=3,lh=1.13,height=Infinity)=>{let ls=[];for(let n=0;n<120;n++){const cap=Math.max(1,Math.floor(w/(fs*(f==='disp'?.61:.62))));ls=[];let cur='';for(const word of String(text).split(/\s+/)){if(cur&&(cur+' '+word).length>cap){ls.push(cur);cur=word;}else cur+=(cur?' ':'')+word;}if(cur)ls.push(cur);if(ls.length<=max&&ls.every(s=>s.length<=cap)&&fs*((ls.length-1)*lh+1.45)<=height)break;fs*=.96;}ls.forEach((s,i)=>k.t(s,x,y+i*fs*lh,fs,col,{f,w}));return ls.length*fs*lh;};return k;}
function wrRound(k,x,y,w,h,r,fill,stroke,lw=.65){const p=new Path(),P=(a,b)=>new Point(a,b);p.move(P(x+r,y));p.addLine(P(x+w-r,y));p.addQuadCurve(P(x+w,y+r),P(x+w,y));p.addLine(P(x+w,y+h-r));p.addQuadCurve(P(x+w-r,y+h),P(x+w,y+h));p.addLine(P(x+r,y+h));p.addQuadCurve(P(x,y+h-r),P(x,y+h));p.addLine(P(x,y+r));p.addQuadCurve(P(x+r,y),P(x,y));p.closeSubpath();if(fill){k.dc.addPath(p);k.dc.setFillColor(fill);k.dc.fillPath();}if(stroke){k.dc.addPath(p);k.dc.setStrokeColor(stroke);k.dc.setLineWidth(lw);k.dc.strokePath();}}
function wrSpace(k,x,y,w,h){const s=Math.min(w,h)/100,ox=x+(w-100*s)/2,oy=y+(h-100*s)/2;return {...k,poly:(ps,f,c,l=.7)=>k.poly(ps.map(p=>[ox+p[0]*s,oy+p[1]*s]),f,c,l*s),ln:(ps,c,l=.7)=>k.ln(ps.map(p=>[ox+p[0]*s,oy+p[1]*s]),c,l*s),circ:(cx,cy,r,f,c,l=.7)=>k.circ(ox+cx*s,oy+cy*s,r*s,f,c,l*s),ell:(cx,cy,rx,ry,f,c,l=.7)=>k.ell(ox+cx*s,oy+cy*s,rx*s,ry*s,f,c,l*s),rect:(xx,yy,ww,hh,f,c,l=.7)=>k.rect(ox+xx*s,oy+yy*s,ww*s,hh*s,f,c,l*s)};}
function wrFoil(k,x,y,w,h,seed=0){for(let i=0;i<60;i++){const q=i/60;k.rect(x+q*w,y,w/60+.1,h,k.a(i%13<2?T.accent:T.headBg,.12+.26*Math.pow(Math.sin(q*Math.PI*3+seed),2)));}for(let j=0;j<4;j++)k.ln([[x,y+h*(j+1)/5],[x+w,y+h*(j+1)/5]],k.ia(.11),.3);}
function wrGuilloche(k,x,y,w,h,seed=0,col){for(let j=0;j<17;j++){const p=[];for(let i=0;i<=120;i++){let a=i/120*Math.PI*2,r=.68+.17*Math.cos(a*(5+seed%4)+j*.12);p.push([x+w/2+Math.cos(a)*w*.47*r*(1-j*.013),y+h/2+Math.sin(a)*h*.47*r*(1-j*.013)]);}k.ln(p,col||k.a(j%3?T.headBg:T.accent,.36),.32);}}
function wrMicro(k,x,y,w,h,seed,kind=0){const words=[['SERIGRAPH','BLIND EMBOSS','FOIL PASS','NO RECORD'],['EXIT SLIP','PUNCHED','RELEASE','DO NOT KEEP'],['EXPOSURE','SHUTTER','COVER','AFTER DARK'],['SIDE A','SILENT CUT','GROOVE','REWIND'],['PRINT RUN','COPYCAT','WATERMARK','SEAL'],['CUSTODY','LOT','RECEIPT','NO OWNER']][kind%6];for(let j=0;j<Math.floor(h/9);j++){const word=words[(j+seed)%4];k.t(word+' / '+String((seed*37+j*19)%997).padStart(3,'0')+'   07-'+String(j+1).padStart(2,'0'),x,y+j*9,4.8,k.ia(.58),{w});} }
function wrSeal(k,x,y,r,n=7){wrGuilloche(k,x-r,y-r,r*2,r*2,n,k.a(T.headBg,.68));k.circ(x,y,r*.65,null,k.ia(.6),.6);k.t(String(n).padStart(2,'0'),x,y-r*.32,r*.56,k.I,{a:'c',w:r,f:'disp'});}

// The illustrated signature uses smooth printed curves, including when hosted art is unavailable.
function wrHeart(k,x,y,r,col){const p=new Path(),P=(a,b)=>new Point(x+a*r,y+b*r);p.move(P(0,.85));p.addQuadCurve(P(-.85,-.12),P(-1.3,-.48));p.addQuadCurve(P(0,-.42),P(-.44,-1.1));p.addQuadCurve(P(.85,-.12),P(.6,-1.1));p.addQuadCurve(P(0,.85),P(.9,.3));k.dc.addPath(p);k.dc.setStrokeColor(col);k.dc.setLineWidth(Math.max(.45,r*.1));k.dc.strokePath();}
function wrGlint(k,x,y,r,col){const p=new Path(),P=(a,b)=>new Point(x+a*r,y+b*r);p.move(P(0,-1.4));p.addQuadCurve(P(.8,0),P(.12,-.1));p.addQuadCurve(P(0,1.4),P(.12,.1));p.addQuadCurve(P(-.8,0),P(-.12,.1));p.addQuadCurve(P(0,-1.4),P(-.12,-.1));p.closeSubpath();k.dc.addPath(p);k.dc.setFillColor(col);k.dc.fillPath();}
function wrPrintPattern(k,x,y,w,h,seed=0){for(let row=0;row<Math.floor(h/24);row++)for(let col=0;col<Math.floor(w/30);col++){const px=x+col*30+(row%2?13:0)+5,py=y+row*24+7;if(px>x+w-4)continue;const n=(row*3+col+seed)%6;if(n===0)wrHeart(k,px,py,2.5,k.a(T.accent,.13));else if(n===3)wrGlint(k,px,py,1.8,k.a(T.headBg,.23));}}

// Pixel serigraphy is decorative print, never invented sensor or progress data.
// Keep the flowing raster illustrations intact; these marks are shared by browser and native widgets.
function wrPixelGlyph(k,name,x,y,p,col){
 const glyphs={heart:['01100110','10011001','10000001','01000010','00100100','00011000'],glint:['0001000','0001000','0011100','1111111','0011100','0001000','0001000'],key:['011100000','110110000','100010000','110111111','011100101'],diamond:['0001000','0010100','0100010','1000001','0100010','0010100','0001000'],arrow:['0001000','0001100','1111110','0001100','0001000'],seal:['1110111','1010101','1110111','0001000','1110111','1010101','1110111']};
 const rows=glyphs[name]||glyphs.glint;rows.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='1')k.rect(x+i*p,y+j*p,p*.84,p*.84,col);});
}
function wrPixelWeave(k,x,y,w,h,seed=0,kind=0,opacity=.48){
 const p=w>240?3:w>110?2.6:1.9,cols=Math.floor(w/p),rows=Math.floor(h/p),bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
  const u=(i+.5)/cols,v=(j+.5)/rows,dx=u-.5,dy=v-.5,phase=(seed%12)*.37;
  let strength=0;
  if(kind===0){const r=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx);strength=Math.max(0,1-Math.abs(r-.39)*14)*(.3+.6*Math.pow(Math.sin(a*3+phase),2));}
  if(kind===1){const q=Math.abs(v-(.88-u*.78));strength=Math.max(0,1-q*8)*(.4+.55*Math.pow(Math.sin(u*10+phase),2));}
  if(kind===2){const q=(i+j*2+seed)%17;strength=(q<4?.55:.12)*(.2+u*.8)*(.4+.6*Math.sin(v*Math.PI));}
  if(kind===3){const track=j%5,phrase=(i*3+Math.floor(j/5)*7+seed)%19;strength=track<2&&phrase<8?.78:track===4?.12:0;}
  if(kind===4){const step=Math.floor(i/4),edge=.18+((step*7+seed)%11)/18;strength=v>edge?Math.min(.85,(v-edge)*2.4):.03;}
  if(kind===5){const r=Math.abs(dx)+Math.abs(dy),band=(Math.floor(r*18)+seed)%5;strength=r<.63&&r>.16?(band<2?.72:.13):0;}
  if(kind===6){const a=Math.abs(v-(.48+Math.sin(u*8+phase)*.27));strength=Math.max(0,1-a*11)*(.3+u*.65);}
  const threshold=(bayer[(i%4)+(j%4)*4]+.5)/16;
  if(strength>threshold){const tint=(i*7+j*3+seed)%19===0?T.accent:T.headBg;k.rect(x+i*p,y+j*p,p*.8,p*.8,k.a(tint,opacity*(.55+.45*strength)));}
 }
}
function wrPunchSlip(k,x,y,w,h,seed=0){
 k.ln([[x,y+h],[x+w,y+h]],k.a(T.headBg,.65),.4);
 const p=2,cols=Math.floor(w/4);for(let i=0;i<cols;i++){k.rect(x+i*4,y,1.1,1.1,k.ia(.3));for(let row=0;row<Math.floor((h-3)/3);row++)if((i*7+row*11+seed)%13<5)k.rect(x+i*4,y+3+row*3,p,p,k.a(row%2?T.accent:T.headBg,row%2?.48:.68));}
}
function wrWidgetPrint(k,W,H,d){
 const small=W<200,big=H>200,seed=wrSlot(d),m=d.mode;
 if(m==='status'){
  wrPixelWeave(k,small?13:12,small?36:36,small?65:125,small?66:96,seed,0,.65);
  wrPunchSlip(k,small?14:17,small?110:123,small?59:112,small?9:7,seed);
  const xx=small?86:145;k.t('BLIND EMBOSS / 07',xx,small?89:97,4.7,k.a(T.ink,.58),{w:small?68:141});
  wrPixelGlyph(k,'key',W-32,small?89:97,.8,k.a(T.accent,.55));
  if(big){wrPunchSlip(k,14,149,122,9,7);k.t('ADMISSION / PERFECT COPY',158,151,5,k.S,{w:190});wrPixelWeave(k,117,218,126,95,seed,5,.35);}
 }
 if(m==='shift'){
  wrPixelWeave(k,14,small?51:45,small?64:126,small?32:big?120:94,seed,1,.7);
  if(!small)k.t('EXIT SLIP / DESTROY AFTER USE',14,36,4.3,k.S,{w:126});
  wrPunchSlip(k,14,small?138:big?174:134,small?142:122,small?5:7,seed+5);
  if(big){wrPixelGlyph(k,'arrow',319,222,2.1,k.a(T.accent,.48));wrPixelWeave(k,244,245,106,88,seed,4,.18);}
 }
 if(m==='solar'){
  wrPixelWeave(k,small?90:151,44,small?65:198,small?61:76,seed,2,.75);
  if(!small){wrPunchSlip(k,151,115,198,7,3);if(big){k.t('EXPOSURE PRINT / LIGHT IS EVIDENCE',14,155,5.3,k.S,{w:336});wrPixelGlyph(k,'diamond',328,152,1.1,k.a(T.accent,.65));}}
 }
 if(m==='audio'){
  wrPixelWeave(k,14,small?39:40,small?142:128,small?63:94,seed,3,.65);
  if(!small)wrPunchSlip(k,17,135,121,7,seed);
  if(big){wrPixelWeave(k,14,204,336,68,seed,3,.7);wrPixelGlyph(k,'glint',322,180,1.5,k.A);}
 }
 if(m==='discord'){
  wrPixelWeave(k,14,40,small?142:158,big?134:80,seed,4,.6);
  if(big){for(let i=0;i<5;i++){const xx=14+i*68;wrPixelGlyph(k,['heart','key','glint','diamond','seal'][i],xx+42,228,1.15,k.a(T.headBg,.7));}}
 }
 if(m==='oddity'){
  wrPixelWeave(k,14,small?49:37,small?57:117,small?60:big?170:104,seed,5,.6);
  if(small)wrPunchSlip(k,14,136,142,7,seed);else{wrPunchSlip(k,147,119,194,4,seed);if(big){wrPunchSlip(k,14,210,336,9,seed);wrPixelWeave(k,246,229,93,90,seed,0,.45);}}
 }
 if(m==='game'){
  const st=d.st||{},heat=Math.max(0,Math.min(100,Number(st.heat)||0)),taken=Math.max(0,Math.min(7,Number(st.taken)||0));
  if(small){wrPixelWeave(k,91,47,64,61,taken,5,.55);for(let i=0;i<28;i++)k.rect(14+i*5,136,3,4,k.a(i/28<heat/100?T.accent:T.headBg,i/28<heat/100?.65:.25));}
  else{for(let i=0;i<7;i++)wrPixelGlyph(k,i<taken?'glint':'diamond',14+i*17,99,.9,k.a(i<taken?T.accent:T.headBg,.7));if(big){wrPixelWeave(k,14,158,336,96,taken,6,.38);for(let i=0;i<42;i++)k.rect(14+i*8,263,5,3,k.a(i/42<heat/100?T.accent:T.headBg,i/42<heat/100?.65:.25));}}
 }
}

// Revision 6: personal print matter. These are ornamental proofs, never sensor readings.
function wrSilkLines(k,x,y,w,h,kind=0,alpha=.43){
 const dept=k.wrDepartment,ink=k.a(T.headBg,alpha),fine=k.a(T.ink,alpha*.35),pink=k.a(T.accent,alpha*.5);
 if(dept==='status'){for(let j=0;j<Math.floor(w/29);j++){const cx=x+14+j*29;for(let z=0;z<5;z++)k.ell(cx,y+h*.5,11-z*1.3,h*(.37-z*.045),null,z%3?ink:fine,.3);k.rect(cx-1,y+h*.44,2,2,pink);}return;}
 if(dept==='shift'){for(let j=0;j<14;j++){const t=j/13;k.ln([[x+w*t,y+h*.85],[x+w*(.25+t*.65),y+h*.12],[x+w*(.4+t*.6),y+h*.85]],j%4?ink:pink,.3);}return;}
 if(dept==='solar'){for(let j=0;j<Math.floor(w/6);j++){const xx=x+j*6;k.poly([[xx,y+h*.8],[xx+2,y+h*.12],[xx+4,y+h*.8]],null,j%5?ink:pink,.3);if(j%4===0)k.rect(xx+1,y+h*.9,1,1,fine);}return;}
 if(dept==='audio'){for(let j=0;j<Math.floor(w/36);j++){const xx=x+17+j*36;for(let z=0;z<5;z++)k.ell(xx,y+h*.5,15-z*2,h*(.43-z*.06),null,z%3?ink:pink,.3);k.circ(xx,y+h*.5,.8,fine);}return;}
 if(dept==='feeds'){for(let j=0;j<Math.floor(w/7);j++){const xx=x+j*7;k.rect(xx,y+1,4,h-2,null,ink,.3);if(j%3)k.rect(xx+1,y+3,1.2,Math.max(1,h-6),j%4?ink:pink);}return;}
 if(dept==='youtube'){for(let j=0;j<Math.floor(w/17);j++){const xx=x+7+j*17;k.ln([[xx-3,y+h*.5],[xx+3,y+h*.5]],ink,.3);k.ln([[xx,y+h*.5-3],[xx,y+h*.5+3]],ink,.3);if(j%3===0)k.circ(xx,y+h*.5,4,null,pink,.3);}return;}
 if(dept==='instagram'){for(let j=0;j<Math.floor(w/23);j++){const xx=x+11+j*23;k.poly([[xx-10,y+h*.5],[xx-5,y+1],[xx+5,y+1],[xx+10,y+h*.5],[xx,y+h-1]],null,ink,.3);k.ln([[xx-5,y+1],[xx,y+h-1],[xx+5,y+1]],fine,.3);k.ln([[xx-10,y+h*.5],[xx+10,y+h*.5]],pink,.3);}return;}
 if(dept==='oddity'){for(let j=0;j<Math.floor(w/14);j++){const xx=x+j*14;k.poly([[xx,y+h-1],[xx+6,y+1],[xx+12,y+h-1]],null,ink,.3);k.ln([[xx+6,y+1],[xx+6,y+h-1]],pink,.3);}return;}
 if(dept==='game'){for(let j=0;j<7;j++){const xx=x+j*w/7;k.rect(xx+2,y+1,w/7-5,h-2,null,ink,.3);k.t(String(j+1).padStart(2,'0'),xx+w/14,y+h*.25,Math.min(6,h*.5),fine,{a:'c',w:w/7-7});}return;}

 for(let j=0;j<18;j++){const ps=[];for(let i=0;i<=68;i++){const t=i/68,v=j/17;
  let py=kind===0?(v*.22+.58*Math.pow(Math.sin(t*Math.PI),2)+.14*t):kind===1?(v*.28+t*.48+.12*Math.sin(t*9+v*2)):kind===2?(.5+(v-.5)*Math.sin(t*Math.PI)*.84):(.18+v*.38+.2*Math.sin(t*7+v));
  ps.push([x+t*w,y+py*h]);}
  k.ln(ps,k.a(j%5?T.headBg:T.accent,alpha*(j%5?1:.5)),.35);
 }
}
function wrFineType(k,text,x,y,w,accent=false){k.t(text,x,y,4.7,accent?k.a(T.accent,.8):k.ia(.55),{w});}
function wrStitch(k,x,y,w,seed=0){for(let i=0;i<w/5;i++){const xx=x+i*5;k.ln([[xx,y],[xx+2,y+2],[xx+4,y]],k.a(i%7?T.headBg:T.accent,.65),.45);if((i+seed)%6===0)k.rect(xx+1,y+4,1,1,k.ia(.36));}}
function wrProofColumns(k,x,y,w,h,kind){const words=[['GUEST COPY','ADMISSION','BLIND FOLD','NO HOST'],['CUT PROOF','SELVEDGE','SOFT EXIT','NO TRACE'],['HALF TONE','PEARL INK','EXPOSURE','AFTERGLOW'],['SIDE B','QUIET PRESS','SOFT REPEAT','NO CREDIT'],['PRINT RUN','COPYRIGHT?','AFTERIMAGE','UNSIGNED'],['CELL POST','RETURNED','FORWARDED','NO ADDRESS']][kind%6];
 const cols=w>200?4:w>100?3:2,cw=w/cols;for(let i=0;i<cols;i++){k.ln([[x+i*cw,y],[x+i*cw,y+h]],k.a(T.headBg,.5),.4);for(let j=0;j<Math.floor(h/8);j++)wrFineType(k,words[(i+j)%4],x+i*cw+3,y+j*8+1,cw-6,(i+j)%5===0);}
}
function wrPaperDetail(k,W,H,d){
 const small=W<200,big=H>200,m=d.mode,seed=wrSlot(d),w=W-28;
 // Each department owns a different ornamental margin and proof rhythm.
 if(m!=='transmission'){
  const style=Object.keys(WR_META).indexOf(m);for(let i=0;i<Math.floor((H-64)/8);i++){const yy=34+i*8;if(style%3===0)k.ln([[8,yy],[10+(i%4),yy+2]],k.a(T.headBg,.65),.45);else if(style%3===1)k.rect(8,yy,1.3,i%3?1.3:4,k.a(T.accent,.28));else k.circ(9,yy,1,null,k.a(T.headBg,.65),.4);k.rect(W-10,yy,1,i%5?1:4,k.ia(.2));}
 }
 if(m==='status'){
  wrSilkLines(k,small?79:144,small?80:80,small?78:204,small?17:24,2,.29);
  if(small){wrFineType(k,'PRIVATE / BY INVITATION',80,117,76);wrStitch(k,15,121,60,1);}
  else{wrFineType(k,'FOLD 01 / PERSONAL COPY',147,119,148);wrStitch(k,267,140,82,2);}
  if(big){wrSilkLines(k,141,148,205,22,0,.6);wrStitch(k,15,189,333,3);wrFineType(k,'A PERFECTLY ORDINARY GUEST.',15,321,230,true);}
 }
 if(m==='shift'){
  if(small){wrSilkLines(k,86,72,69,15,1,.26);}
  else{wrSilkLines(k,158,73,190,big?35:15,1,.3);wrFineType(k,'EXIT COPY / NO FORWARDING ADDRESS',158,big?157:79,190);}
  if(big){wrStitch(k,15,236,334,2);wrFineType(k,'SELVEDGE / LEFT BEHIND',15,228,180,true);wrSilkLines(k,245,322,104,25,2,.55);}
 }
 if(m==='solar'){
  wrSilkLines(k,small?88:150,small?96:big?146:103,small?66:198,small?26:big?17:10,2,.58);
  if(small)wrFineType(k,'EXPOSURE / PEARL PRINT',88,130,68);
  else wrFineType(k,'LIGHT LEAK / PRINT PROOF',151,138,198);
  if(big){wrStitch(k,15,163,334,4);wrSilkLines(k,15,317,334,15,3,.5);}
 }
 if(m==='audio'){
  if(small){wrSilkLines(k,15,87,140,20,2,.6);wrFineType(k,'PRESSED IN SILENCE / 07',16,102,140,true);}
  else{wrSilkLines(k,157,106,191,19,0,.5);wrFineType(k,'NO APPLAUSE / PLEASE',157,140,191);}
  if(big){wrProofColumns(k,15,142,130,18,3);wrSilkLines(k,15,177,334,20,2,.45);wrStitch(k,15,290,334,3);wrStitch(k,15,347,334,7);}
 }
 if(m==='feeds'){
  wrProofColumns(k,15,big?339:small?128:131,w,big?13:16,4);
  if(big){wrSilkLines(k,15,239,161,12,2,.6);wrSilkLines(k,190,239,160,12,0,.6);wrStitch(k,15,270,161,3);wrStitch(k,190,270,160,8);}
 }
 if(m==='youtube'){
  wrStitch(k,15,big?237:123,w,seed);if(!small&&!big)wrFineType(k,'FRAME EDGE / OPTICAL COPY / ARCHIVE 07',15,141,w);
  if(big){wrSilkLines(k,15,285,145,13,1,.6);wrSilkLines(k,193,313,155,13,0,.6);wrStitch(k,15,344,334,11);}
 }
 if(m==='instagram'){
  if(big){wrSilkLines(k,15,216,334,13,2,.6);wrFineType(k,'PROOF OF ABSENCE / FIRST IMPRESSION',15,254,334,true);wrStitch(k,15,282,334,4);wrProofColumns(k,15,307,334,13,4);wrStitch(k,15,347,334,2);}
  else wrFineType(k,'PROVENANCE / CIRCULATING COPY',15,140,w,true);
 }
 if(m==='discord'){
  if(small){wrSilkLines(k,15,118,w,10,0,.4);}
  else{wrStitch(k,184,130,164,7);wrFineType(k,'02 / 04 / 07 / 09 / 11',184,140,165,true);}
  if(big){wrSilkLines(k,181,152,168,35,1,.65);wrProofColumns(k,184,186,164,17,5);wrStitch(k,15,232,334,7);wrSilkLines(k,15,260,150,12,0,.55);wrSilkLines(k,15,291,150,12,2,.55);wrStitch(k,15,323,334,4);}
 }
 if(m==='oddity'){
  if(small)wrSilkLines(k,79,102,76,17,2,.45);
  else{wrSilkLines(k,146,90,202,18,2,.25);wrFineType(k,'COURTESY COPY / DESTROY NOTHING',147,140,203,true);}
  if(big){wrStitch(k,147,204,202,4);wrProofColumns(k,15,214,334,12,0);wrSilkLines(k,222,311,124,20,0,.5);}
 }
 if(m==='game'){
  if(small){wrStitch(k,15,102,63,7);wrFineType(k,'COLLECTOR / CELL 07',15,110,w);}
  else{wrSilkLines(k,144,82,202,21,3,.32);wrFineType(k,'INVENTORY OF BEAUTIFUL ABSENCES',144,100,201);}
  if(big){wrStitch(k,15,289,334,3);wrFineType(k,'PERSONAL LEDGER / SEVEN EMPTY PLACES',15,297,334,true);}
 }
}
// Compact layouts retain complete print fields, with native-compatible cutouts for live text.
// Only the decorative paths are clipped. Readings, art and their layout are untouched.
function wrCompactInk(k,W,masks=[]){
 const interval=(p,q,r)=>{let a=0,b=1;const dx=q[0]-p[0],dy=q[1]-p[1];
  for(const [u,v] of [[-dx,p[0]-r[0]],[dx,r[0]+r[2]-p[0]],[-dy,p[1]-r[1]],[dy,r[1]+r[3]-p[1]]]){
   if(Math.abs(u)<1e-9){if(v<0)return null;}else{const t=v/u;if(u<0)a=Math.max(a,t);else b=Math.min(b,t);if(a>b)return null;}
  }return[a,b];};
 const ln=(ps,col,lw=.4)=>{let path=[];const flush=()=>{if(path.length>1)k.ln(path,col,lw);path=[];};
  for(let i=1;i<ps.length;i++){const p=ps[i-1],q=ps[i],bound=interval(p,q,[14,34,W-28,111]);if(!bound){flush();continue;}
   let runs=[bound];for(const r of masks){const cut=interval(p,q,r);if(!cut)continue;const next=[];for(const [a,b]of runs){if(cut[1]<=a||cut[0]>=b)next.push([a,b]);else{if(a<cut[0])next.push([a,cut[0]]);if(cut[1]<b)next.push([cut[1],b]);}}runs=next;}
   for(const [a,b]of runs){const start=[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a],end=[p[0]+(q[0]-p[0])*b,p[1]+(q[1]-p[1])*b];const last=path[path.length-1];if(last&&Math.hypot(last[0]-start[0],last[1]-start[1])>.01)flush();if(!path.length)path.push(start);path.push(end);if(b<1)flush();}if(!runs.length)flush();
  }flush();};
 return{...k,ln};
}
function wrCompactPrint(k,W,H,d){
 if(H>200)return;
 const s=W<200,m=d.mode,w=W-28,seed=wrSlot(d),masks={
  status:s?[[84,37,74,49],[84,100,73,17],[13,125,143,10]]:[[143,37,208,58],[143,108,208,21],[13,133,338,11]],
  shift:s?[[13,36,143,10],[82,47,76,37],[13,87,144,36],[13,124,143,10]]:[[13,34,128,9],[156,36,194,42],[156,88,194,44],[156,132,194,11]],
  solar:s?[[13,36,144,11],[13,49,78,46],[13,102,144,21],[13,127,74,10]]:[[13,36,338,11],[13,49,127,53],[13,110,139,33],[151,126,200,11]],
  audio:s?[[13,106,144,39]]:[[154,36,197,69],[154,126,197,10]],
  discord:s?[[13,131,144,12]]:[[182,37,168,37],[182,79,168,12],[182,96,168,12],[182,113,168,12]],
  oddity:s?[[13,35,144,11],[77,47,81,53],[13,120,144,12]]:[[145,35,206,11],[145,51,206,55],[145,107,206,10],[145,126,206,10]],
  game:s?[[13,34,144,11],[13,47,78,44],[13,117,144,12]]:[[13,34,338,11],[13,47,118,47],[141,49,210,53],[141,106,210,11]],
  feeds:s?[[13,33,144,12],[13,120,144,24]]:[[13,33,338,12],[13,120,338,24]],
  youtube:s?[[13,34,144,12],[13,128,144,9]]:[[13,34,338,12],[13,128,338,9]],
  instagram:[],transmission:[]
 }[m]||[],p=wrCompactInk(k,W,masks),L=k.a(T.headBg,.58),F=k.a(T.ink,.14),A=k.a(T.accent,.32);
 const box=(x,y,ww,hh,c=L)=>p.ln([[x,y],[x+ww,y],[x+ww,y+hh],[x,y+hh],[x,y]],c,.35);
 const oval=(cx,cy,rx,ry,c=L,phase=0)=>{const ps=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*2;ps.push([cx+Math.cos(a)*rx,cy+Math.sin(a+phase)*ry]);}p.ln(ps,c,.35);};
 if(m==='status'){
  // Admission-paper emboss and the large widget's duplicate watermark.
  for(let j=0;j<7;j++){const z=j*2;box(16+z,39+z,s?61-z*2:119-z*2,96-z*2,j%3?L:F);}
  wrGuilloche(p,s?76:148,68,s?87:205,70,7,k.a(T.headBg,.62));
  for(let j=0;j<8;j++)p.ln([[14,137+j*1.4],[W-14,137+j*1.4]],j%3?L:A,.35);
  for(let j=0;j<10;j++){const xx=15+j*w/10;p.ln([[xx,34],[xx+4,34],[xx+4,38]],F,.4);}
  if(!s)wrFineType(k,'DUPLICATE / VALID',19,114,111);
 }
 if(m==='shift'){
  // Overlapping scored sheets, rather than a generic telemetry trace.
  for(let j=0;j<15;j++){const t=j/14;p.ln([[14,48+t*83],[s?65:112,36+t*10],[s?153:338,136-t*11],[s?44:64,141-t*2],[14,48+t*83]],j%5?L:A,.35);}
  for(let j=0;j<18;j++){const xx=15+j*(s?7.8:7);p.ln([[xx,135],[xx+3,139],[xx+6,135]],F,.4);}
  if(!s)wrFineType(k,'FOLD / LIFT / LET GO',17,123,117,true);
 }
 if(m==='solar'){
  // The crescent's engraved exposure field extends to the margins.
  const cx=s?128:254,cy=78;for(let j=0;j<21;j++)oval(cx,cy,19+j*(s?1.9:3.7),13+j*2.2,j%6?L:A,.18);
  for(let j=0;j<12;j++)p.ln([[14+j*7,93],[18+j*7,99],[14+j*7,105]],F,.4);
  for(let j=0;j<Math.floor(w/9);j++){const xx=15+j*9;box(xx,139,6,5,j%5?L:A);}
  if(!s)wrFineType(k,'OPTICAL PAPER / AFTERGLOW',151,101,198);
 }
 if(m==='audio'){
  // Miniature optical score and cylinder-groove impressions.
  const left=s?14:15,right=s?156:145;for(let j=0;j<11;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([left+t*(right-left),89+Math.sin(t*23)*Math.sin(t*Math.PI)*(9+j*.9)+j*.9]);}p.ln(ps,j%4?L:A,.38);}
  for(let j=0;j<10;j++)oval(s?85:79,72,32+j*3.1,16+j*2.4,j%4?L:F,.25);
  if(!s){for(let j=0;j<7;j++)p.ln([[156,106+j*3],[350,106+j*3]],L,.35);for(let i=0;i<22;i++){const xx=157+i*8.8;p.ln([[xx,109],[xx+4,109],[xx+4,119-(i%3)*3]],i%5?F:A,.55);}}
 }
 if(m==='discord'){
  // Scalloped postal stock and five cancellation impressions.
  for(let j=0;j<6;j++){const xx=17+j*(s?25:28);for(let z=0;z<4;z++)box(xx+z,40+z,s?25-z*2:28-z*2,80-z*2,z%2?L:F);}
  for(let j=0;j<18;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([14+t*w,45+j*5+Math.sin(t*8+j*.18)*(s?6:12)]);}p.ln(ps,j%6?L:A,.34);}
  if(!s){for(let j=0;j<3;j++)oval(331,87+j*17,14,7,F);wrFineType(k,'RECIPIENT PAYS',18,116,142,true);}
 }
 if(m==='oddity'){
  // Letter-fold plan, the numbered invitation's etched paper and perforated leaves.
  const width=s?67:120;for(let j=0;j<12;j++){const z=j*2;p.ln([[16+z,39+z],[16+width-z,39+z],[16+width-z,138-z],[16+z,138-z],[16+z,39+z],[16+width-z,138-z]],j%5?L:F,.35);}
  for(let j=0;j<18;j++){const xx=(s?76:144)+j*(s?4.5:11.4);p.ln([[xx,34],[xx+9,89],[xx,143]],j%6?L:A,.35);}
  if(s){wrGuilloche(p,81,89,73,49,seed,k.a(T.headBg,.52));}else wrFineType(k,'SEALED / PERSONAL / RETURNED UNSIGNED',147,140,200);
 }
 if(m==='game'){
  // Seven-column collector stock; actual counts and heat still come from the saved game.
  const cw=w/7;for(let j=0;j<7;j++){const xx=14+j*cw;box(xx+1,45,cw-2,99,L);for(let z=0;z<10;z++)p.ln([[xx+3,51+z*9],[xx+cw-3,51+z*9]],z%3?F:L,.32);}
  for(let j=0;j<8;j++)p.ln([[14,92+j*1.2],[W-14,92+j*1.2]],j%3?L:A,.35);
  if(s){for(let j=0;j<7;j++)k.rect(16+j*9,94,5,4,null,k.a(T.headBg,.7),.4);}
 }
 if(m==='feeds'){
  // The film and valuation panels have their own internal print, added separately below.
  for(let j=0;j<Math.floor(w/7);j++){const xx=15+j*7;box(xx,115,4,4,j%5?L:A);}
  for(let j=0;j<12;j++)p.ln([[14,35+j*9],[W-14,35+j*9]],F,.3);
 }
 if(m==='youtube'){
  // Optical contact-print edges. These are photographic registration marks, not readings.
  for(let j=0;j<Math.floor(w/9);j++){const xx=14+j*9;box(xx,139,6,5,j%5?L:A);p.ln([[xx,46],[xx+6,46]],F,.6);}
  if(!s){for(let j=0;j<19;j++)p.ln([[201+j*8,125],[205+j*8,128],[201+j*8,131]],L,.4);}
 }
}
function wrCompactPlate(k,n,x,y,w,h){
 // Gem-cut tracing fills the plate without changing its recurring specimen.
 const p=wrCompactInk(k,364,[[x+5,y+h-25,w-10,25]]),L=k.a(T.headBg,.53),F=k.ia(.15),cx=x+w*.5,cy=y+(h-26)*.5;
 for(let j=0;j<10;j++){const rx=w*(.48-j*.016),ry=(h-27)*(.48-j*.016),ps=[];for(let i=0;i<=8;i++){const a=(i/8)*Math.PI*2+n*.14;ps.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}p.ln(ps,j%3?L:F,.34);}
 for(let j=0;j<7;j++){const yy=y+7+j*10;p.ln([[x+9,yy],[x+23,yy],[x+29,yy+5]],F,.4);p.ln([[x+w-9,yy+3],[x+w-21,yy+3],[x+w-26,yy-2]],L,.4);}
}
function wrCardDetail(k,x,y,w,h,seed){
 if(k.wrCompact){
  const small=w<200,cx=x+w*(small?.59:.79),cy=y+h*.67;
  for(let j=0;j<14;j++){const ps=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2,r=1+.13*Math.sin(a*4+j*.07);ps.push([cx+Math.cos(a)*(w*(small?.32:.18)-j*.7)*r,cy+Math.sin(a)*(h*.29-j*.4)*r]);}k.ln(ps,k.a(T.headBg,.19),.35);}
  for(let i=0;i<Math.floor((w-20)/6);i++){const xx=x+10+i*6;k.ln([[xx,y+h-4],[xx+2,y+h-6],[xx+4,y+h-4]],k.a(i%7?T.headBg:T.accent,.5),.4);}
  for(let j=0;j<9;j++)k.rect(x+3,y+9+j*10,1.1,j%3?1.1:4,k.a(T.panel,.34));
 }
 for(let j=0;j<13;j++){const p=[];for(let i=0;i<=100;i++){const t=i/100;p.push([x+8+t*(w-16),y+h*(.53+.14*Math.sin(t*6+j*.11))+j*1.1]);}k.ln(p,k.a(T.headBg,.14+j*.005),.35);}
 if(h>200){wrStitch(k,x+12,y+h-28,w-24,seed);}
}

function wrMaskVector(k,x,y,w,h){const scale=Math.min(w/140,h/80),ox=x+(w-140*scale)/2,oy=y+(h-80*scale)/2,P=(a,b)=>new Point(ox+a*scale,oy+b*scale),p=new Path();
 p.move(P(18,37));for(const [ex,ey,cx,cy]of [[33,27,16,29],[67,5,53,8],[48,28,63,21],[83,17,72,14],[48,36,66,34],[80,40,64,28],[105,43,101,47],[118,36,117,28],[113,49,124,43],[132,67,127,61],[112,61,137,72],[96,56,101,58],[73,52,79,65],[44,51,61,44],[14,69,29,66],[35,49,5,75],[7,57,17,51],[30,42,1,60],[18,37,29,37]])p.addQuadCurve(P(ex,ey),P(cx,cy));p.closeSubpath();k.dc.addPath(p);k.dc.setFillColor(k.PN);k.dc.fillPath();k.dc.addPath(p);k.dc.setStrokeColor(k.a(T.ink,.9));k.dc.setLineWidth(.7*scale);k.dc.strokePath();k.poly([[ox+24*scale,oy+34*scale],[ox+34*scale,oy+31*scale],[ox+29*scale,oy+36*scale]],k.A);for(let i=0;i<3;i++)k.ln([[ox+(25+i*3)*scale,oy+(30-i)*scale],[ox+(24+i*3)*scale,oy+(27-i)*scale]],k.I,.6*scale);wrHeart(k,ox+19*scale,oy+18*scale,3*scale,k.A);wrGlint(k,ox+115*scale,oy+18*scale,4*scale,k.A);}

function wrDial(k,x,y,w,h,n=0){const p=wrSpace(k,x,y,w,h);p.circ(50,50,46,p.PN,p.I,1);for(let r=45;r>=19;r-=3)p.circ(50,50,r,null,p.a(T.ink,r%3?.24:.52),.4);for(let i=0;i<100;i++){const a=i/100*6.283;p.ln([[50+41*Math.cos(a),50+41*Math.sin(a)],[50+(i%10?44:48)*Math.cos(a),50+(i%10?44:48)*Math.sin(a)]],i%10?p.ia(.5):p.A,i%10?.45:1);}for(let j=0;j<3;j++){const a=n*.13+j*2.094,cx=50+23*Math.cos(a),cy=50+23*Math.sin(a);p.circ(cx,cy,11,p.a(T.headBg,.25),p.I,.65);for(let z=0;z<28;z++){const b=z*6.283/28;p.ln([[cx+9*Math.cos(b),cy+9*Math.sin(b)],[cx+12*Math.cos(b),cy+12*Math.sin(b)]],p.I,.45);}p.circ(cx,cy,7,p.PN,p.I,.65);p.circ(cx,cy,3,p.I);p.ln([[cx,cy],[50,50]],p.ia(.6),1.6);p.ln([[cx,cy],[50,50]],p.PN,.5);}p.circ(50,50,10,p.I);p.circ(50,50,6,p.PN);p.circ(50,50,3,p.A);p.poly([[50,0],[46,7],[54,7]],p.A);for(let j=0;j<4;j++){const a=.78+j*1.571;p.circ(50+37*Math.cos(a),50+37*Math.sin(a),1.4,p.I);}k.t('03',x+w/2,y+h*.08,Math.min(w,h)*.05,k.I,{w:w*.18,a:'c'});}
function wrJewel(k,n,x,y,w,h){const p=wrSpace(k,x,y,w,h),I=p.I,A=p.A,L=p.a(T.headBg,.44),P=p.PN;n=n%12;
 const stone=(cx,cy,r)=>{const pts=[[cx-r,cy-r*.3],[cx-r*.55,cy-r],[cx+r*.55,cy-r],[cx+r,cy-r*.3],[cx,cy+r]];p.poly(pts,L,I,.85);p.poly([[cx-r*.55,cy-r],[cx+r*.55,cy-r],[cx,cy+r]],p.a(T.accent,.24),I,.4);p.ln([[cx-r,cy-r*.3],[cx+r,cy-r*.3]],I,.5);p.ln([[cx-r*.55,cy-r],[cx-r*.32,cy-r*.3],[cx,cy+r],[cx+r*.32,cy-r*.3],[cx+r*.55,cy-r]],I,.4);};
 if(n===0){for(let i=0;i<28;i++){const a=.1+Math.PI*1.8*i/27;p.circ(50+34*Math.cos(a),43+29*Math.sin(a),3,P,I,.65);}stone(49,83,11);}
 if(n===1){p.ell(50,47,27,36,P,I,1);p.poly([[46,12],[59,33],[43,46],[62,63],[52,81],[68,62],[51,44],[68,32]],L,I,.65);stone(52,47,17);p.poly([[39,82],[61,82],[65,90],[35,90]],P,I,.8);p.poly([[38,35],[34,30],[34,27],[38,29],[42,27],[42,30]],null,A,.6);}
 if(n===2){p.ell(50,62,24,27,L,I,1);p.ell(50,62,15,18,P,I,.65);p.ell(50,29,24,16,P,I,1);p.poly([[37,29],[63,24],[54,33]],A);for(let i=0;i<3;i++)p.ln([[43+i*5,23],[41+i*5,19]],I,.7);}
 if(n===3){p.poly([[13,32],[28,48],[34,20],[50,39],[65,15],[72,47],[89,28],[80,77],[21,77]],L,I,1.2);p.ell(50,78,30,9,P,I,1);p.ell(50,75,29,7,null,A,.8);for(let i=0;i<7;i++){const xx=24+i*8.7;p.ln([[xx,57],[xx,72]],I,.5);stone(xx,61,3);}for(const [xx,yy]of[[13,31],[34,20],[65,15],[89,28]])p.circ(xx,yy,3,P,I,.7);}
 if(n===4){p.poly([[50,43],[10,16],[19,56],[45,54],[35,83],[50,63],[66,84],[58,54],[81,57],[94,17],[54,42]],P,I,1);p.poly([[14,23],[40,46],[22,47]],L);p.poly([[88,24],[59,47],[77,48]],L);p.ln([[50,29],[50,69]],A,1.4);stone(50,84,7);}
 if(n===5){p.circ(50,44,33,P,I,1);p.circ(50,44,27,L,I,.6);p.poly([[60,17],[57,49],[36,71],[43,40]],A,I,.6);for(let i=0;i<4;i++){const a=i*1.571;p.ln([[50+29*Math.cos(a),44+29*Math.sin(a)],[50+33*Math.cos(a),44+33*Math.sin(a)]],I,1.2);}for(let i=0;i<3;i++)p.circ(41+i*9,86+i%2*4,4,P,I,.7);}
 if(n===6){p.poly([[47,6],[88,34],[70,54],[81,77],[47,96],[13,69],[31,49],[20,27]],L,I,1);p.poly([[47,18],[71,35],[50,51],[64,75],[47,84],[29,69],[48,51],[35,28]],P,I,.7);p.ln([[48,51],[70,54],[81,77]],A,1.2);}
 if(n===7){for(let j=0;j<5;j++){const s=j*4;p.poly([[29+s,10+s],[71-s,10+s],[88-s,27+s],[88-s,73-s],[71-s,90-s],[29+s,90-s],[12+s,73-s],[12+s,27+s]],j===0?L:null,j%2?A:I,.65);}for(const xx of[12,88])p.ln([[xx,27],[50,50],[xx,73]],I,.5);}
 if(n===8){p.poly([[23,90],[19,87],[65,25],[70,28]],P,I,1);for(let i=0;i<12;i++)p.ln([[24+i*3,82-i*4],[30+i*3,82-i*4]],A,.8);stone(73,18,13);p.ell(70,35,11,3,L,I,.8);p.circ(19,90,5,P,I,.8);}
 if(n===9){for(let j=0;j<3;j++){let pts=[];for(let i=0;i<=70;i++){const a=Math.PI+i/70*Math.PI;pts.push([50+(40-j*4)*Math.cos(a),77+(49-j*9)*Math.sin(a)]);}p.ln(pts,I,.8);}for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI;stone(50+38*Math.cos(a),77+47*Math.sin(a),i===4?6:3);}p.ell(50,79,40,5,null,A,1);}
 if(n===10){p.poly([[44,37],[65,26],[73,13],[67,5],[55,7],[48,17],[36,10],[24,14],[21,26],[35,38],[35,88],[59,88],[59,79],[49,79],[49,69],[42,69]],I,I,.7);p.poly([[45,30],[62,20],[63,13],[55,15],[48,24],[37,18],[31,21],[37,29]],P);p.ln([[38,42],[38,83]],A,1.2);}
 if(n===11){p.poly([[12,41],[47,9],[88,35],[73,87],[26,80]],L,I,1);p.poly([[12,41],[57,37],[47,9],[57,37],[88,35],[57,37],[73,87]],P,I,.7);p.ln([[26,80],[57,37],[38,61],[12,41]],I,.8);p.poly([[38,61],[57,37],[55,66]],p.a(T.accent,.36),I,.6);}
 for(let i=0;i<4;i++){const xx=9+i*25;p.ln([[xx,96],[xx+10,96]],p.ia(.25),.35);} }
function wrObjectPlate(k,n,x,y,w,h,caption=true){wrRound(k,x,y,w,h,5,k.a(T.panel,.85),k.a(T.headBg,.85));for(let j=0;j<9;j++){const yy=y+12+j*(h-25)/9;k.ln([[x+4,yy],[x+7+(j%3?0:3),yy]],k.ia(.5),.4);k.ln([[x+w-4,yy],[x+w-7,yy]],k.a(T.accent,.5),.4);}if(k.wrCompact)wrCompactPlate(k,n,x,y,w,h);wrGuilloche(k,x+4,y+4,w-8,h-8,n,k.a(T.headBg,.15));const ih=caption?h-26:h;wrPixelWeave(k,x+8,y+8,w-16,ih-11,n,n%3===0?5:n%3===1?6:0,.52);if(!wrArt(k,'lot'+String(n%12+1).padStart(2,'0'),x+8,y+6,w-16,ih-7))wrJewel(k,n,x+8,y+6,w-16,ih-7);for(const [xx,yy,sx,sy]of[[x+5,y+5,1,1],[x+w-5,y+5,-1,1],[x+5,y+ih-3,1,-1],[x+w-5,y+ih-3,-1,-1]])k.ln([[xx+sx*7,yy],[xx,yy],[xx,yy+sy*7]],k.a(T.accent,.6),.5);if(caption){k.ln([[x+5,y+h-24],[x+w-5,y+h-24]],k.a(T.headBg,.7),.5);k.t('LOT '+String(n+1).padStart(2,'0')+' / DISPUTED',x+7,y+h-20,5.7,k.A,{w:w-14});k.t(WR_LOTS[n%12][0],x+7,y+h-11,8,k.I,{f:'disp',w:w-14});}}
function wrScene(k,n,x,y,w,h){n=n%12;const xx=a=>x+a*w/100,yy=a=>y+a*h/100,ln=(p,c=k.ia(.6),s=.55)=>k.ln(p.map(q=>[xx(q[0]),yy(q[1])]),c,s),rc=(a,b,c,d,col,stroke)=>k.rect(xx(a),yy(b),w*c/100,h*d/100,col,stroke,.55);k.rect(x,y,w,h,k.a(T.headBg,.13),k.ia(.35),.6);if(k.wrCompact){
 for(let j=0;j<Math.floor(w/14);j++){const xx=x+7+j*14;k.ln([[xx,y+10],[xx,y+h-10]],k.a(T.headBg,.48),.3);k.rect(xx-2,y+h-5,4,2,k.a(j%4?T.ink:T.accent,.32));}
 for(let j=0;j<8;j++)k.ln([[x+3,y+10+j*(h-20)/8],[x+w-3,y+10+j*(h-20)/8]],k.ia(.1),.3);
}wrPixelWeave(k,x+3,y+12,w-6,h-24,n,n%2?4:2,.26);
 if(n===0){for(let j=0;j<5;j++){rc(4+j*20,12,10,60,k.PN,k.ia(.4));ln([[j*20,80],[50,58],[100,80]]);}for(let i=0;i<3;i++){rc(21+i*27,57,11,28,k.PN,k.I);wrJewel(k,i,x+w*(.18+i*.27),y+h*.24,w*.17,h*.34);}}
 if(n===1){rc(15,7,70,86,k.PN,k.I);for(let j=0;j<5;j++)rc(20+j*4,12+j*4,60-j*8,76-j*8,null,k.a(T.headBg,.8));wrDial(k,x+w*.3,y+h*.2,w*.4,h*.6,n);for(let j=0;j<4;j++)rc(8,15+j*20,9,8,k.I);}
 if(n===2){for(let i=0;i<4;i++){rc(5+i*24,12,19,27,k.PN,k.I);rc(7+i*24,58,15,26,k.a(T.headBg,.4),k.I);}ln([[0,48],[100,48]]);ln([[0,89],[100,89]]);rc(42,42,16,9,k.I);}
 if(n===3){for(let j=0;j<6;j++){ln([[3,25+j*11],[36,25+j*11],[41,20+j*11]]);ln([[97,25+j*11],[64,25+j*11],[59,20+j*11]]);}rc(39,12,22,16,k.PN,k.I);wrJewel(k,3,x+w*.38,y+h*.07,w*.24,h*.32);ln([[50,35],[50,95]],k.A,.8);}
 if(n===4){for(let j=0;j<8;j++)ln([[j*14,0],[j*14+24,100]],k.ia(.3));for(let j=0;j<5;j++)ln([[0,j*25],[100,j*25]],k.a(T.headBg,.8));ln([[2,80],[37,80],[52,49],[98,49]],k.I,2);}
 if(n===5){for(let j=0;j<9;j++){let pts=[];for(let i=0;i<=50;i++){let a=Math.PI+i/50*Math.PI;pts.push([50+(46-j*3)*Math.cos(a),80+(68-j*4)*Math.sin(a)]);}ln(pts,k.a(j%3?T.headBg:T.ink,.6));}rc(43,50,14,40,k.PN,k.I);}
 if(n===6){for(let j=0;j<4;j++)for(let i=0;i<8;i++){rc(3+i*12,5+j*22,10,18,k.a(T.panel,.7),k.I);rc(6+i*12,9+j*22,4,2,k.ia(.4));}ln([[9,93],[91,93]],k.A,.8);}
 if(n===7){for(let j=0;j<7;j++)ln([[j*8,3],[j*5,90]],k.a(T.headBg,.8));for(let j=0;j<7;j++)ln([[100-j*8,3],[100-j*5,90]],k.a(T.headBg,.8));rc(35,70,30,20,k.PN,k.I);wrJewel(k,8,x+w*.33,y+h*.1,w*.34,h*.6);}
 if(n===8){for(let j=0;j<6;j++)ln([[j*20,40],[j*20,90]],k.I,.8);ln([[0,40],[100,40]],k.I,1.6);for(let j=0;j<8;j++)ln([[0,94-j*3],[100,94-j*3]],k.ia(.25));rc(45,8,22,25,null,k.A);}
 if(n===9){rc(22,2,56,96,k.PN,k.I);for(let j=0;j<12;j++)ln([[26+j*4,5],[26+j*4,95]],k.a(T.headBg,.8));rc(82,31,11,30,k.PN,k.I);for(let j=0;j<4;j++)rc(86,35+j*6,3,2,k.A);ln([[50,0],[50,100]],k.I,1.3);}
 if(n===10){for(let j=0;j<5;j++){rc(3+j*19,43-j%2*25,15,48+j%2*25,k.PN,k.I);for(let i=0;i<7;i++)ln([[5+j*19,48+i*5-j%2*25],[16+j*19,48+i*5-j%2*25]],k.ia(.35));}ln([[0,92],[100,92]],k.A,1);}
 if(n===11){rc(29,5,42,90,k.PN,k.I);rc(34,11,32,80,null,k.ia(.3));rc(55,47,8,3,k.I);wrMask(k,x+w*.38,y+h*.17,w*.24,h*.32);for(let j=0;j<6;j++)ln([[0,12+j*15],[24,12+j*15]]);}
 for(let j=0;j<14;j++){ln([[0,5+j*6.8],[100,5+j*6.8]],k.ia(.07),.4);}for(let j=0;j<6;j++){const bx=7+j*16,by=14+(n*13+j*21)%68;ln([[bx,by],[bx+5,by],[bx+5,by+5]],k.a(T.accent,.6));}for(let j=0;j<9;j++){ln([[3+j*11,91],[3+j*11,96]],k.ia(.5),.5);}k.t('EXPOSURE / '+String(100+n*13)+'   GATE / '+String(n+1).padStart(2,'0'),x+4,y+h-9,4.8,k.I,{w:w-8});
 const beam=[[[3,14],[91,88]],[[1,70],[96,24]],[[13,3],[72,95]]][n%3];ln(beam,k.a(T.accent,.75),.8);for(let i=0;i<6;i++){rc((n*13+i*17)%95,98,.8,1.5,k.I);}k.t('REEL '+String(n+1).padStart(2,'0')+' / RECONSTRUCTION',x+4,y+3,4.9,k.I,{w:w-8});}
function wrExit(k,x,y,w,h,n){n=n%6;k.rect(x,y,w,h,k.a(T.panel,.85),k.a(T.headBg,.8),.7);const variants=[[[.07,.82],[.3,.82],[.3,.55],[.56,.55],[.56,.26],[.88,.26]],[[.12,.13],[.12,.6],[.43,.6],[.43,.83],[.81,.83],[.81,.35]],[[.1,.7],[.35,.7],[.35,.2],[.7,.2],[.7,.55],[.91,.55]],[[.08,.3],[.4,.3],[.4,.78],[.74,.78],[.74,.15],[.9,.15]],[[.1,.82],[.1,.38],[.45,.38],[.45,.65],[.87,.65],[.87,.19]],[[.1,.2],[.7,.2],[.7,.43],[.29,.43],[.29,.8],[.9,.8]]],pts=variants[n];for(let j=0;j<11;j++){const xx=x+w*j/11;k.ln([[xx,y+5],[xx,y+h-5]],k.ia(.1),.4);}for(let j=0;j<6;j++)k.ln([[x+3,y+h*j/6],[x+w-3,y+h*j/6]],k.ia(.1),.4);for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],P=[[x+a[0]*w,y+a[1]*h],[x+b[0]*w,y+b[1]*h]];k.ln(P,k.a(T.headBg,.75),10);k.ln(P,k.PN,7);k.ln(P,k.I,2.2);k.ln(P,k.PN,.7);}for(let j=0;j<4;j++){const yy=y+h*(.13+j*.23);k.ln([[x+3,yy],[x+w-3,yy+h*.1]],k.a(T.accent,.65),.65);k.rect(x+2,yy-1,3,2,k.A);k.rect(x+w-5,yy+h*.1-1,3,2,k.A);}for(let j=0;j<pts.length;j++){const q=pts[j],xx=x+q[0]*w,yy=y+q[1]*h;k.circ(xx,yy,2,j===n?k.A:k.PN,k.I,.5);if(w>150)k.t('D'+(j+1),xx+4,yy-7,4.8,k.S,{w:18});}k.t('ENTRY / '+String(n+1).padStart(2,'0'),x+4,y+h-9,5,k.I,{w:w*.5});k.t('EGRESS',x+w-4,y+3,5,k.A,{a:'r',w:35});}
function wrMusic(k,x,y,w,h,seed){if(wrArt(k,'audio',x,y,w,h))return;const p=wrSpace(k,x,y,w,h);p.rect(6,82,89,5,p.a(T.headBg,.6),p.I,.6);p.poly([[13,69],[23,69],[23,82],[9,82]],p.PN,p.I,.6);p.poly([[75,69],[85,69],[92,82],[75,82]],p.PN,p.I,.6);p.poly([[14,24],[77,24],[89,35],[89,70],[78,79],[14,79]],p.a(T.panel,.9),p.I,1);p.ell(18,51,10,27,p.PN,p.I,.8);p.ell(78,51,10,27,p.a(T.headBg,.5),p.I,.8);for(let i=0;i<35;i++){const xx=21+i*1.6;p.ln([[xx,29],[xx,73]],p.a(i%4?T.headBg:T.ink,.7),.5);for(let j=0;j<8;j++)if((i*7+j*11+seed)%9<3)p.rect(xx,31+j*5,.8,2.1,p.A);}for(let j=0;j<3;j++)p.ell(18,51,3+j*2,12+j*6,null,p.ia(.55),.5);p.ln([[15,18],[82,18],[82,32]],p.I,1.5);p.poly([[79,29],[85,29],[84,37],[80,37]],p.A);p.rect(89,48,8,6,p.I);p.circ(18,51,3,p.I);p.circ(18,51,1.4,p.PN);for(let i=0;i<6;i++)p.rect(28+i*7,84,3,1,p.I);p.ln([[24,94],[90,94]],p.ia(.4),.4);k.t('MASTER / 07',x+w*.23,y+h*.91,Math.min(w,h)*.046,k.I,{w:w*.62});}
function wrNetwork(k,x,y,w,h,seed){const nodes=[[.2,.25],[.75,.17],[.47,.51],[.18,.82],[.8,.8]],names=['CELL 02','CELL 04','CELL 07','CELL 09','CELL 11'];for(let j=0;j<9;j++){k.ln([[x+3,y+6+j*(h-12)/9],[x+w-3,y+6+j*(h-12)/9]],k.ia(.1),.4);}wrGuilloche(k,x,y,w,h,seed,k.a(T.headBg,.2));for(let i=0;i<5;i++){const a=nodes[i],b=nodes[(i+2)%5];k.ln([[x+a[0]*w,y+a[1]*h],[x+(a[0]+b[0])*.5*w+6,y+a[1]*h],[x+b[0]*w,y+b[1]*h]],k.a(T.accent,.6),.8);}nodes.forEach((q,i)=>{const xx=x+q[0]*w,yy=y+q[1]*h,cw=Math.min(49,w*.26);k.rect(xx-cw/2,yy-12,cw,25,i===2?k.I:k.PN,k.I,.7);k.ln([[xx-cw/2,yy-12],[xx,yy],[xx+cw/2,yy-12]],i===2?k.PN:k.a(T.headBg,.9),.8);for(let j=0;j<5;j++)k.rect(xx-cw/2+3+j*3,yy-9,1,2,i===2?k.PN:k.a(T.accent,.5));k.circ(xx+cw/2-5,yy-6,1.4,i===2?k.A:k.a(T.headBg,.8));k.t(names[i],xx,yy+5,5.6,i===2?k.PN:k.I,{a:'c',w:cw-3});});}
function wrRule(k,x,y,w,label,value,col){k.ln([[x,y],[x+w,y]],k.ia(.23),.5);k.t(label,x,y+4,6,k.S,{w:w*.5});k.t(value,x+w,y+3,9,col||k.I,{w:w*.48,a:'r',f:'disp'});}
function wrInvitation(k,n,x,y,w,h){if(wrArt(k,'invite',x,y,w,h)){wrJewel(k,n,x+w*.27,y+h*.28,w*.46,h*.34);k.t('ADMIT / '+String(n+1).padStart(2,'0'),x+w*.5,y+h*.72,Math.min(w,h)*.05,k.a('#2A2340',.9),{a:'c',w:w*.6});return;}const p=wrSpace(k,x,y,w,h),bend=17+n%4*5;p.poly([[10,5],[90-bend,5],[90,bend+5],[90,95],[10,95]],p.PN,p.I,.9);p.poly([[90-bend,5],[90-bend,bend+5],[90,bend+5]],p.a(T.headBg,.55),p.I,.7);for(let i=0;i<6;i++){const yy=48+i*6;p.ln([[18,yy],[82,yy]],p.ia(.3),.4);}for(let j=0;j<15;j++)p.rect(19+j*4.2,83,j%3?1:2,5+(j+n)%4,p.ia(.65));p.rect(10,5,4,90,p.A);const cx=x+w*.5,cy=y+h*.29;wrSeal(k,cx,cy,Math.min(w,h)*.19,n+1);k.t('ADMIT / ONE',cx,y+h*.62,Math.min(w,h)*.06,k.I,{a:'c',w:w*.68});k.t('INVITATION '+String(n+1).padStart(2,'0'),cx,y+h*.72,Math.min(w,h)*.044,k.S,{a:'c',w:w*.72});}
function wrFeedRecord(k,n,x,y,w,h,valuation){k.rect(x,y,w,h,valuation?k.PN:k.I,k.a(T.headBg,.65),.6);if(k.wrCompact){
 const tint=valuation?T.ink:T.panel;for(let j=0;j<12;j++){const yy=y+10+j*(h-20)/12;k.ln([[x+3,yy],[x+w-3,yy]],k.a(tint,.12),.3);}
 if(valuation){for(let j=0;j<10;j++){const t=j/9;k.ln([[x+5+t*(w-10),y+10],[x+w*.5,y+h-4],[x+w-5-t*(w-10),y+10]],k.a(T.headBg,.55),.35);}}
 else{for(let j=0;j<3;j++){const xx=x+9+j*(w-12)/3;k.ln([[xx,y+9],[xx+4,y+9],[xx+4,y+h-9]],k.a(T.panel,.32),.4);}}
}if(valuation){for(let j=0;j<8;j++)k.ln([[x+5,y+10+j*(h-17)/8],[x+w-5,y+10+j*(h-17)/8]],k.ia(.2),.4);for(let j=0;j<5;j++){const xx=x+6+j*(w-12)/5,fh=(.2+((n+j*7)%11)/15)*(h-24);k.rect(xx,y+h-9-fh,(w-17)/5-3,fh,k.a(j%2?T.headBg:T.accent,.2),k.ia(.5),.5);}wrPixelWeave(k,x+5,y+12,w-10,h-24,n,5,.44);k.t('ESTIMATE / WITHHELD',x+5,y+3,4.8,k.I,{w:w-10});}else{const gap=5,fw=(w-20)/3;for(let j=0;j<3;j++){const xx=x+5+j*(fw+gap),yy=y+12;wrRound(k,xx,yy,fw,h-24,2,k.a(T.headBg,.18),k.a(T.panel,.65),.5);for(let z=0;z<6;z++){const by=yy+4+z*(h-34)/6;k.ln([[xx+3,by],[xx+fw-3,by+(j-1)*3]],k.a(T.panel,.3),.4);}wrPixelWeave(k,xx+3,yy+3,fw-6,h-30,n+j,j%2?1:4,.75);const gp=Math.min((fw-10)/9,(h-30)/9);wrPixelGlyph(k,['key','diamond','heart'][j],xx+fw*.5-gp*3.5,yy+(h-24)*.5-gp*3.5,gp,k.a(T.panel,.85));}for(let i=0;i<14;i++){k.rect(x+4+i*(w-8)/14,y+3,3,3,k.PN);k.rect(x+4+i*(w-8)/14,y+h-6,3,3,k.PN);}}}
function wrFrame(k,W,H,d){const n=Object.keys(WR_META).indexOf(d.mode),seed=wrSlot(d);k.rect(0,0,W,H,k.GR);wrRound(k,4,4,W-8,H-8,13,k.a(T.panel,.7),k.a(T.headBg,.95),.7);for(let j=0;j<4;j++)wrRound(k,7+j,30+j,W-14-j*2,H-57-j*2,7,null,k.a(j%2?T.ink:T.headBg,.1),.35);for(let y=34;y<H-22;y+=14)for(let x=12;x<W-10;x+=14)k.rect(x,y,.45,.45,k.ia(.17));wrPrintPattern(k,12,34,W-24,H-61,seed+n);k.rect(10,9,W-20,18,n%3===1?k.a(T.accent,.14):k.a(T.headBg,.32));k.t(String(n+1).padStart(2,'0')+' / '+WR_META[d.mode],17,12,10,k.I,{f:'disp',w:W-62});if(n%3===1)wrHeart(k,W-22,18,4,k.A);else wrGlint(k,W-22,18,3.8,k.A);k.t('CELL 07',12,H-16,5.8,k.S,{w:48});k.t(['status','shift','solar'].includes(d.mode)?'PERSONAL / PRIVATE':'FICTIONAL / NO RECORD',W-12,H-16,5.7,k.S,{a:'r',w:W-74});wrFoil(k,12,H-23,W-24,2,seed+n);}
function wrTimerLayout(W,H){return W<200?{x:15,y:88,w:140,fs:25}:{x:158,y:H>200?111:89,w:190,fs:H>200?37:31};}
function wrTime(ms){const s=Math.max(0,Math.floor(ms/1000));return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':');}
// Revision 5 screen studies: native-compatible abstract print compositions.
// No live data, sensor diagrams, vault dials or security beams. Clock and dock stay clear.
function wrStudyRibbon(k,cx,top,w,h,phase=0,reverse=false){
 const edge=(side,offset=0)=>{const p=[];for(let i=0;i<=140;i++){const t=i/140,ang=t*Math.PI*2.05+phase,xx=cx+Math.sin(ang)*w*.39,yy=top+t*h,dx=Math.cos(ang)*w*.39*Math.PI*2.05,dy=h,len=Math.hypot(dx,dy),taper=.12+.88*Math.pow(Math.sin(t*Math.PI),.7),band=w*.13*taper;p.push([xx+dy/len*(side*band+offset*taper),yy-dx/len*(side*band+offset*taper)]);}return p;};
 const left=edge(-1),right=edge(1);k.poly([...left,...right.slice().reverse()],k.a(T.panel,.95),k.a(T.ink,.4),.6);
 const mid=edge(.3),rim=edge(1);k.poly([...mid,...rim.slice().reverse()],k.a(T.headBg,.55));
 for(let i=0;i<14;i++){const o=-w*.05+i*w*.008;k.ln(edge(reverse?-.15:.15,o),k.a(i%4?T.headBg:T.ink,i%4?.38:.17),.4);}
 const p=edge(1);for(let i=5;i<p.length;i+=7){const [x,y]=p[i];if(i%3===0)wrPixelGlyph(k,'glint',x+6,y-3,.65,k.a(T.accent,.55));else for(let j=0;j<3;j++)k.rect(x+3+j*4,y+j%2*3,1.8,1.8,k.a(T.headBg,.55-j*.12));}
}
function wrStudyShell(k,cx,cy,rx,ry,angle,n){
 const point=(a,r)=>{const v=1+.055*Math.cos(a*3+n),x=Math.cos(a)*rx*v*r,y=Math.sin(a)*ry*v*r;return[cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle)];};
 const outside=[],inside=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;outside.push(point(a,1));inside.push(point(a,.72+.08*Math.sin(a+n)));}
 k.poly([...outside,...inside.reverse()],k.a(T.panel,.88),k.a(T.headBg,.8),.6);
 for(let j=0;j<13;j++){const ps=[];for(let i=0;i<=120;i++)ps.push(point(i/120*Math.PI*2,.74+j*.018));k.ln(ps,k.a(j%5?T.headBg:T.ink,j%5?.4:.2),.35);}
 for(let i=0;i<9;i++){const [x,y]=point(.3+i*.065,1.06);k.rect(x,y,2.2,2.2,k.a(i%4?T.headBg:T.accent,.68));}
}
function wrStudyGrain(k,x,y,w,h,seed){
 for(let j=0;j<Math.floor(h/8);j++)for(let i=0;i<Math.floor(w/8);i++){const xx=x+i*8,yy=y+j*8,n=(i*17+j*13+seed)%29;if(n<3)k.rect(xx,yy,.45,.45,k.ia(.14));if(n===12&&(i+j)%7===0)wrHeart(k,xx,yy,2.1,k.a(T.accent,.16));}
}
function wrPoster(raw,W,H,d){
 const k=wrSafe(raw),home=d.mode==='home',n=d.index%3,top=home?174:223,bottom=H-106,hh=bottom-top,shift=Math.max(-1,Math.min(1,d.knobs?.shift||0)),scale=Math.max(.8,Math.min(1.12,d.knobs?.scale||1));
 const override=!home&&d.index>=3&&d.phrase,cy=top+hh*.44,txt=(s,x,y,fs,c,w,a='l',f='mono')=>{if(override&&fs>=25&&y>bottom-140)return;k.t(s,x,y,fs,c,{w,a,f});};
 if(d.knobs?.details!==false)wrStudyGrain(k,15,top+7,W-30,hh-26,n);
 const artIn=()=>{if(k.dc.x){k.dc.x.save();k.dc.x.translate(W/2,cy+shift*10);k.dc.x.scale(scale,scale);k.dc.x.translate(-W/2,-cy);}},artOut=()=>{if(k.dc.x)k.dc.x.restore();};
 txt('WHITE RABBIT',19,top+3,10,k.I,160,'l','disp');txt(['SILK MEMORY','PEARL DRIFT','LOVE, UNSIGNED'][n],W-19,top+3,5.6,k.A,130,'r');
 if(n===0){
  artIn();wrStudyRibbon(k,home?208:188,top+38,home?285:315,hh*(home?.82:.66),home?1.2:.25);
  if(!home){wrMask(k,46,top+125,298,167);wrPixelWeave(k,31,top+266,298,66,5,6,.38);artOut();txt('Elegance is',33,bottom-126,38,k.I,324,'l','disp');txt('faster than force.',33,bottom-84,32,k.I,324,'l','disp');}
  else{wrMask(k,home?165:100,top+216,home?196:240,116);artOut();txt('We were',29,bottom-126,31,k.I,280,'l','disp');txt('never here.',29,bottom-92,31,k.I,300,'l','disp');}
  txt('A courtesy, not a confession.',21,bottom-20,8,k.I,310,'l','disp');wrHeart(k,346,bottom-39,6,k.a(T.accent,.8));
 }
 if(n===1){
  artIn();const specs=home?[[115,115,117,48,-.6,1],[265,235,105,57,.48,2],[120,344,98,41,-.35,3]]:[[120,100,133,56,-.45,1],[258,182,115,62,.65,2],[145,279,120,45,-.28,3]];
  for(const[xx,yy,rx,ry,a,z]of specs)wrStudyShell(k,xx,top+yy,rx,ry,a,z);
  wrPixelWeave(k,home?177:26,top+(home?330:219),160,88,9,5,.34);
  for(const[xx,yy,r]of[[300,76,4],[72,191,6],[299,307,4]])wrGlint(k,xx,top+yy,r,k.a(T.accent,.8));
  artOut();if(home){txt('Nothing was taken.',31,bottom-94,25,k.I,328,'l','disp');txt('Everything is gone.',31,bottom-65,25,k.I,328,'l','disp');}
  else{txt('What’s yours',27,bottom-119,34,k.I,335,'l','disp');txt('is mine.',27,bottom-80,42,k.I,335,'l','disp');}
  txt('PEARL / PAPER / A QUESTION OF OWNERSHIP',20,bottom-16,5.6,k.S,345);
 }
 if(n===2){
  // Typography becomes an abstract material, with pixel print breaking up the margins.
  artIn();txt('07',home?-7:-13,top+(home?31:23),home?236:257,k.a(T.headBg,.48),415,'l','disp');
  for(let j=0;j<27;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([389-278*t+Math.sin(t*Math.PI)*(30+j*2.1),top+43+hh*.62*Math.pow(t,1.45)+Math.sin(t*Math.PI)*j*.9]);}k.ln(ps,k.a(j%5?T.headBg:T.accent,j%5?.42:.23),j%5?.4:.65);}
  wrPixelWeave(k,home?35:27,top+179,home?243:306,155,7,4,.4);
  const heartY=top+(home?306:228);for(let j=0;j<5;j++)wrHeart(k,home?99:108,heartY,36+j*7,k.a(j%2?T.headBg:T.accent,j%2?.4:.32));
  wrMask(k,home?141:106,top+(home?286:216),home?217:254,148);
  artOut();txt(home?'Leave only':'Catch me',29,bottom-118,37,k.I,329,'l','disp');txt(home?'a little trace.':'if you can.',29,bottom-79,37,k.I,329,'l','disp');
  txt('WITH COMPLIMENTS / SEVERAL PERFECT ALIBIS',20,bottom-15,5.4,k.S,344);
 }
 if(override)k.para(d.phrase,29,bottom-126,329,34,k.I,'disp',3,1.08,102);
 txt('CELL 07',20,bottom+2,5.5,k.A,75);txt('AFTERIMAGE / PRIVATE PRINT',W-20,bottom+2,5.5,k.S,200,'r');
}

function wrPaint(raw,W,H,d){const k=wrSafe(raw),small=W<200,big=H>200,seed=wrSlot(d),mode=d.mode;k.wrDepartment=mode;k.wrCompact=!big;wrFrame(k,W,H,d);wrCompactPrint(k,W,H,d);wrPaperDetail(k,W,H,d);wrWidgetPrint(k,W,H,d);const x=14,y=35,w=W-28,bottom=H-30;
 if(mode==='status'){const ev=d.ev,wx=d.wx||{};if(!wrArt(k,'vault',small?12:10,small?36:35,small?67:130,small?67:99))wrDial(k,small?12:10,small?36:39,small?67:126,small?67:111,seed);const tx=small?86:145,tw=W-tx-14;k.t(ev?(ev.active?'JOB IN PROGRESS':'NEXT COMMISSION'):'NO COMMISSIONS',tx,39,6,k.A,{w:tw});k.para(ev?ev.title:'Laying low.',tx,51,tw,small?13:18,k.I,'disp',2);k.t(wx.temp==null?'COVER / UNAVAILABLE':wx.temp+'° / '+(wx.cond||''),tx,small?103:110,7,k.S,{w:tw});k.t(d.batt==null?'RESERVE / UNAVAILABLE':'RESERVE '+Math.round(d.batt*100)+'%',x,small?127:135,6.5,k.I,{w:small?142:112});if(!small)k.t(ev?shortT(ev.start)+' — '+shortT(ev.end):'Calendar standing by',W-14,135,8,k.I,{a:'r',w:190});if(big){wrRule(k,x,170,w,'TERMS','Leave only a card.');wrFoil(k,x,198,w,9,seed);wrRound(k,x,214,w,105,4,k.a(T.headBg,.16),k.ia(.3));wrMicro(k,x+7,222,96,88,seed,0);wrGuilloche(k,115,217,130,95,seed);k.t('ADMIT',180,243,10,k.A,{a:'c',w:75});k.t('ONE',180,258,25,k.I,{a:'c',w:75,f:'disp'});k.t('HOST / UNKNOWN',180,296,5.3,k.S,{a:'c',w:92});wrSeal(k,293,261,36,7);k.t('DUPLICATE / VALID',293,306,5,k.S,{a:'c',w:90});k.para('Your invitation is already inside.',x,331,w,18,k.I,'disp',1);} }
 if(mode==='shift'){const ev=d.ev,l=wrTimerLayout(W,H);k.t(ev?(ev.active?'TIME TO THE EXIT':'UNTIL WE MOVE'):'LAYING LOW',small?x:158,38,6.5,k.A,{w:small?w:190});k.para(ev?ev.title:'No timed job scheduled.',small?84:158,49,small?72:190,small?12:big?17:15,k.I,'disp',2);if(small){if(!wrArt(k,'edge',14,52,64,33))wrExit(k,14,52,64,33,seed);}else if(!wrArt(k,'edge',14,40,126,big?129:102))wrExit(k,14,38,126,big?129:102,seed);if(!d.live)k.t(ev?wrTime((ev.active?ev.end:ev.start)-d.now):'--:--:--',l.x,l.y,l.fs,k.I,{w:l.w,f:'disp'});k.t(ev?'LEAVE BY '+shortT(ev.end):'CALENDAR UNAVAILABLE',small?x:158,small?125:big?170:134,6.2,k.S,{w:small?w:190});if(big){wrFoil(k,x,185,w,8,seed);k.t('The exit is part of the invitation.',x,207,21,k.I,{f:'disp',w});wrExit(k,x,245,w*.63,88,seed+2);wrMicro(k,244,245,106,88,seed,1);k.t('ROUTE STUDY / FICTIONAL',x,338,6,k.A,{w});}}
 if(mode==='solar'){const sun=d.sun||{},wx=d.wx||{},atm=d.atm||{};k.t(sun.phase==='day'?'EXPOSED / DAYLIGHT LEFT':sun.phase==='night'?'UNDER COVER OF DARK':'COVER FEED UNAVAILABLE',x,38,6,k.A,{w});k.t(Number.isFinite(sun.left)?Math.round(sun.left*100)+'%':'--',x,51,small?35:42,k.I,{f:'disp',w:small?75:117});const sx=small?91:151,sw=small?62:198;if(!wrArt(k,'cover',sx,44,sw,small?62:76))for(let i=0;i<12;i++){const xx=sx+i*sw/12,hh=(small?61:67)*(1-i*.025);k.poly([[xx,48],[xx+sw/12-2,44],[xx+sw/12-2,44+hh],[xx,48+hh]],k.a(T.ink,.08+i*.025),k.a(T.headBg,.6),.4);k.ln([[xx,48+hh],[xx+sw/12-2,44+hh]],k.A,.65);}if(!d.live)k.t(Number.isFinite(sun.remaining)?wrTime(sun.remaining):'NO SOLAR FIX',x,small?104:112,small?15:18,k.I,{f:'disp',w:small?w:140});k.t(sun.phase==='day'?'UNTIL DARK':sun.phase==='night'?'UNTIL DAWN':'LOCATION / UNAVAILABLE',x,small?128:137,5.9,k.S,{w:small?w:140});if(!small)k.t(wx.temp==null?'WEATHER UNAVAILABLE':wx.temp+'° / '+wx.cond,W-14,128,8,k.I,{a:'r',w:195});if(big){const vals=[['RAIN',atm.probs?.length?Math.max(...atm.probs.filter(Number.isFinite))+'%':'--'],['DAMP',atm.rh==null?'--':atm.rh+'%'],['SUN',atm.uv==null?'--':Math.round(atm.uv)],['SIGHT',atm.vis||'--'],['DEW',atm.dew==null?'--':atm.dew+'°'],['WIND',atm.ws==null?'--':Math.round(atm.ws*(T.units==='celsius'?1.609:1))+(T.units==='celsius'?' KM/H':' MPH')]];vals.forEach(([name,val],i)=>{const xx=x+i%3*114,yy=175+Math.floor(i/3)*76;wrRound(k,xx,yy,108,65,4,k.PN,k.a(T.headBg,.8));k.t(name,xx+7,yy+6,6,k.A,{w:70});k.t(val,xx+7,yy+20,20,k.I,{f:'disp',w:65});wrSilkLines(k,xx+6,yy+49,95,12,i%4,.48);for(let j=0;j<7;j++){const norm=[null,atm.rh==null?null:atm.rh/100,atm.uv==null?null:atm.uv/12,atm.visMi==null?null:atm.visMi/15,atm.dew==null?null:(atm.dew+(T.units==='celsius'?20:4))/(T.units==='celsius'?70:126),atm.ws==null?null:atm.ws/35][i];const height=i===0?(atm.probs?.[j]||0)*.2:norm==null?0:Math.min(24,Math.max(0,norm*24))*(1-j*.055);for(let q=0;q<Math.floor(height/3);q++)k.rect(xx+75+j*3,yy+46-q*3,1.8,1.8,k.a(q%3?T.headBg:T.accent,.68));}});k.t('Visibility is an inconvenience.',x,336,18,k.I,{f:'disp',w});}}
 if(mode==='audio'){if(small){wrMusic(k,x,35,w,76,seed);k.para('Music for a clean getaway.',x,108,w,17,k.I,'disp',2);}else{wrMusic(k,12,35,133,105,seed);k.t('GETAWAY 07 / ENCODED CYLINDER',156,38,6,k.A,{w:194});k.para((C.audio?.lines||AUDIO_LINES)[seed%(C.audio?.lines||AUDIO_LINES).length],156,52,194,21,k.I,'disp',3);k.t('OPEN MUSIC / WHISPER CUT',156,128,6,k.S,{w:194});}if(big){wrFoil(k,x,165,w,9,seed);k.t('PIANO WIRE / OPTICAL SCORE',x,184,6,k.A,{w});for(let j=0;j<5;j++)k.ln([[x,213+j*13],[x+w,213+j*13]],k.ia(.17),.4);for(let j=0;j<8;j++){k.rect(x+j*w/8,201,1,75,k.a(T.headBg,.4));k.t(String(j+1).padStart(2,'0'),x+j*w/8+3,280,4.8,k.S,{w:22});}for(let layer=0;layer<9;layer++){let ps=[];for(let i=0;i<=180;i++){const q=i/180;ps.push([x+q*w,230+Math.sin(q*28+seed*.1)*Math.sin(q*3.1416)*(16+layer*2)+layer*3]);}k.ln(ps,k.a(layer%2?T.accent:T.headBg,.3),.45);}wrRule(k,x,298,w,'MASTER','SILENT CUT / CELL 07');wrRule(k,x,324,w,'REQUESTS','No names on the sleeve.');}}
 if(mode==='transmission'){wrRound(k,x,35,w,bottom-35,6,k.I);wrCardDetail(k,x,35,w,bottom-35,seed);wrPixelWeave(k,small?24:big?35:207,small?111:big?199:59,small?124:big?294:139,small?31:big?119:79,seed,6,.8);for(let i=0;i<(big?28:8);i++)k.rect(W-23,59+i*10,3+(i%3===0?2:0),2,k.a(i%4?T.headBg:T.accent,.46));wrGuilloche(k,x+4,40,w-8,bottom-45,seed,k.a(T.headBg,.24));wrFoil(k,x+7,48,w-14,5,seed);k.t(d.archival?'ARCHIVE / ATTRIBUTED':'WITH COMPLIMENTS / CELL 07',x+10,37,5.5,k.PN,{w:w-20});
 const qx=small?x+9:x+12,qy=small?60:64,qw=small?w-18:big?w-24:176,qh=small?42:big?115:49;
 const used=k.para(d.text||'We were never here.',qx,qy,qw,big?28:small?16:23,k.PN,'disp',big?4:small?4:3,1.13,qh);
 k.para(d.by||'WHITE RABBIT / THE LEGION',qx,qy+used+(small?3:8),qw,small?4.6:6.1,k.a(T.panel,.8),'mono',2);
 wrMask({...k,I:k.PN,PN:k.PN},small?48:big?57:210,small?113:big?204:63,small?77:big?250:134,small?30:big?116:76);
 if(big){k.t('AUTHENTICITY DISPUTED',W/2,326,7,k.PN,{a:'c',w:w-24});k.t('One card. Several perfect alibis.',W/2,340,10,k.PN,{a:'c',f:'disp',w:w-24});}}
 if(mode==='feeds'){const cols=small?1:2,cw=(w-10*(cols-1))/cols;for(let i=0;i<cols;i++){const xx=x+i*(cw+10),cy=big?49:46,ch=big?174:67;k.t(i?'VALUATION / THE MARKS':'CASING / SURVEILLANCE',xx,35,6,k.A,{w:cw});wrFeedRecord(k,seed%12,xx,cy,cw,ch,!!i);k.t(i?'OPEN INSTAGRAM':'OPEN YOUTUBE',xx,cy+ch+9,7,k.I,{w:cw});if(big){wrRule(k,xx,253,cw,i?'CUSTODY':'LOOP',i?'UNCLAIMED':'REHEARSED');wrRule(k,xx,280,cw,i?'PROVENANCE':'WITNESS',i?'REVISED':'NO ONE');wrMicro(k,xx,314,cw,25,seed+i,5);wrFoil(k,xx,303,cw,3,seed+i);}}}
 if(mode==='youtube'){const n=seed%12;k.t(WR_VENUES[n],x,36,7,k.I,{w});wrScene(k,n,x,50,w,big?184:small?69:72);k.t('REEL '+String(n+1).padStart(2,'0')+' / FICTIONAL CASING',x,big?244:130,6,k.A,{w});if(big){for(let j=0;j<18;j++)k.rect(x+j*w/18,257,10,3,k.a(j%3?T.ink:T.accent,.45));wrRule(k,x,270,w,'ANGLE','Nobody was looking.');wrRule(k,x,298,w,'DISPOSITION','Rehearse. Return. Remove.');wrMicro(k,x,328,w,15,seed,5);}}
 if(mode==='instagram'){const count=small?1:big?3:2,cw=(w-(count-1)*8)/count;for(let i=0;i<count;i++)wrObjectPlate(k,(seed+i)%12,x+i*(cw+8),36,cw,big?180:105);if(big){const lot=WR_LOTS[seed%12];k.para(lot[0],x,228,w,25,k.I,'disp',1);wrRule(k,x,264,w,'PROVENANCE',lot[1]);wrRule(k,x,289,w,'MATERIAL',lot[2]);k.para(lot[3],x,324,w,16,k.I,'disp',1);}}
 if(mode==='discord'){if(!wrArt(k,'warren',x,36,small?w:158,big?155:90))wrNetwork(k,x,36,small?w:158,big?155:99,seed);else{for(let i=0;i<5;i++){const xx=x+i*(small?w:158)/5;const pp=big?1.25:small?.65:.95;wrPixelGlyph(k,['heart','key','glint','diamond','seal'][i],xx+3,big?177:126,pp,k.a(i===2?T.accent:T.headBg,.9));k.ln([[xx,big?189:134],[xx+24,big?189:134]],k.a(T.headBg,.35),.4);}}if(small)k.t('Five cells. One alibi.',x,133,9,k.I,{f:'disp',w});else{k.para('The Warren',184,39,165,26,k.I,'disp',2);['# next-job','# fences-and-buyers','# rival-crews'].forEach((s,i)=>k.t(s,184,81+i*17,8,k.I,{w:165}));}if(big){k.t('POSTAGE / RECIPIENT PAYS',x,193,6,k.S,{w});wrFoil(k,x,210,w,10,seed);wrRule(k,x,241,w,'RETURN ADDRESS','Never the same twice.');wrRule(k,x,272,w,'NEW ARRIVAL','A familiar stranger.');wrRule(k,x,303,w,'SAFEHOUSE','Keys already exchanged.');k.t('Anyone can wear the ears.',x,334,16,k.I,{f:'disp',w});}}
 if(mode==='oddity'){const n=seed%10,job=WR_JOBS[n];if(small){k.t('TONIGHT / '+String(n+1).padStart(2,'0'),x,37,6,k.A,{w});wrInvitation(k,n,x,47,57,62);k.para(WR_LOTS[n][0],79,49,77,14,k.I,'disp',3);k.t(job[1],x,122,7,k.I,{w});}else{wrInvitation(k,n,x,36,117,big?171:106);k.t('CONTRACT '+String(n+1).padStart(2,'0')+' / OPEN',147,37,6,k.A,{w:203});k.para(WR_LOTS[n][0],147,53,203,23,k.I,'disp',2);k.t(job[1],147,109,7,k.S,{w:203});k.t(job[2],147,128,6.5,k.I,{w:203});if(big){wrMicro(k,147,155,203,44,n,5);wrExit(k,x,228,190,98,n);wrSeal(k,290,271,42,n+1);k.para(job[3],x,334,w,16,k.I,'disp',1);}}}
 if(mode==='game'){const st=d.st||{},taken=st.taken||0,names=['VELVET','CIPHER','SILK','MONOCLE','NOCTURNE','GILT'],alias=names[gVar(st,54,6)];k.t((d.inp?.charging?'SAFEHOUSE / COOLING':'ON THE JOB')+' / '+alias,x,36,6,k.A,{w});k.t(taken+' / 07',x,49,small?24:30,k.I,{f:'disp',w:small?75:115});k.t('HEIRLOOMS',x,small?80:84,5.6,k.S,{w:110});if(small){wrJewel(k,Math.min(6,taken),90,46,65,60);k.t('HEAT '+Math.round(st.heat||0)+' / CREW '+(st.crew||0),x,119,6.5,k.I,{w});}else{k.para(WR_LOTS[Math.min(6,taken)][0],143,51,207,19,k.I,'disp',2);k.t('HEAT '+Math.round(st.heat||0)+' / INTEL '+(st.intel||0),143,108,7,k.I,{w:207});if(big){wrFoil(k,x,131,w,5,seed);k.t('PRIVATE COLLECTION / ABSENCES CERTIFIED',x,141,5,k.S,{w});}const gy=big?158:116,gh=big?96:25;for(let i=0;i<7;i++){const pw=w/7,xx=x+i*pw;if(big){k.rect(xx+3,gy,pw-6,gh-5,k.a(T.headBg,.13),k.ia(.22),.5);for(let j=0;j<6;j++)k.ln([[xx+5,gy+4+j*14],[xx+pw-5,gy+4+j*14]],k.ia(.12),.4);k.t(String(i+1).padStart(2,'0'),xx+pw/2,gy+gh-16,5,k.S,{a:'c',w:pw-8});}k.rect(xx+3,gy+gh-5,pw-6,5,k.I);if(i<taken){k.rect(xx+7,gy+3,pw-14,gh-11,null,k.a(T.accent,.7),.7);wrPixelGlyph(k,i%2?'glint':'heart',xx+pw/2-(big?4.8:2.5),gy+gh*.46-(big?4:2),big?1.25:.65,k.A);}else wrJewel(k,i,xx+3,gy,pw-6,gh-8);}if(big){wrRule(k,x,274,w,'FENCE LEDGER','$'+(st.loot||0)+'K / FICTIONAL');k.para(st.log?.[0]?.m||'Pressed a fresh calling card.',x,307,w,15,k.I,'disp',2);k.t('CHARGE TO LAY LOW / HEAT COOLS ON REFRESH',x,344,6,k.A,{w});}}}
}
// Civil Defense is an opt-in edition. Shared by the browser and exported widget.
const DZ_META={status:'OPERATOR STATUS',shift:'ACTIVE TIME',solar:'DAYLIGHT WATCH',audio:'BROADCAST',transmission:'PRIORITY SIGNAL',feeds:'RECON FEEDS',youtube:'MONITOR WALL',instagram:'OPERATOR CALLING CARDS',discord:'COMMAND NET',oddity:'OPERATOR EVALUATION',game:'SHELTER 9'};
const DZ_PEOPLE=[['V. SLOAN','REGISTRY','SEALED','OBSERVED'],['R. MOSS','TRIAGE','SEALED','CLEARED'],['L. VALE','INTEGRITY','SEALED','ASSIGNED'],['E. REED','RESERVE','SEALED','REVIEW'],['N. WARD','COMMAND','SEALED','CLEARED'],['I. ASH','NULL INDEX','SEALED','MISSING'],['O. FINCH','CARRIER','SEALED','OBSERVED'],['S. MARSH','CONTAINMENT','SEALED','FLAGGED'],['T. WREN','DOCTRINE','SEALED','ASSIGNED'],['P. LOCKE','PROVISION','SEALED','CLEARED'],['B. PIKE','MAINTENANCE','SEALED','OVERDUE'],['A. FENN','RECORDS','SEALED','REVIEW']];
const DZ_ROOMS=['GATE 09','AIR EXCHANGE','RATION HALL','CISTERN 04','STAIRWELL C','MUSTER ROOM','GENERATOR 02','RECORD VAULT','DECONTAMINATION','SERVICE LIFT','MESS HALL','LOWER ACCESS'];
const DZ_EVAL={tears:['WITHIN TOLERANCE','ELEVATED','NOT OBSERVED','SUSPICIOUSLY ABSENT','AWAITING SAMPLE','FORM NOT SIGNED','RECLASSIFIED AS RAIN','RETENTION ADVISED','APPROVED QUANTITY','SEALED FOR REVIEW'],verdict:['FIT FOR SORTIE','REQUIRES TALKING-TO','RECALIBRATE','EXEMPLARY / REVIEW','STAND BY','REVIEW PENDING','RETURN AFTER REST','REPEAT THE QUESTION','PROVISIONALLY CALM','ASSIGNED TO QUEUE'],notes:['Asked if sirens were necessary.','Hesitated at mandatory.','Requested a window. Denied.','Hummed during briefing. Noted.','Scored well. Too well.','Slept in the simulator. Twice.','Named the simulator.','Asked what drills are for.','Filed a complaint in pencil.','Thanked the empty chair.'],shelter:['S9 / L1 / B04','S9 / L2 / B12','S9 / L3 / B07','S9 / L4 / B02','S9 / L5 / B19','S9 / L1 / B08','S9 / L2 / B01','S9 / L3 / B16','S9 / L4 / B11','S9 / L5 / B03']};
// Revision 5: preserve the institutional identity and noise, diversify the central instrument families.
// The background is another working layer of the terminal, not empty decoration.
// Fictional registers stay visually subordinate to real calendar/weather/device readings.
function dzStatic(k,x,y,w,h,seed,strength=1){
  const rng=k.rng(7907+seed*101);
  for(let yy=y;yy<y+h;yy+=2){k.rect(x,yy,w,.45,k.ia(.055*strength));if(rng()>.61){const xx=x+rng()*w*.75;k.rect(xx,yy,Math.min(w-(xx-x),8+rng()*w*.22),.65,k.a(T.altBg,(.08+rng()*.1)*strength));}}
  for(let i=0;i<w*h/160;i++){const xx=x+rng()*(w-2),yy=y+rng()*(h-1);k.rect(xx,yy,rng()>.87?3:1,.65,k.a(i%7===0?T.accent:T.ink,(.08+rng()*.11)*strength));}
}
function dzRegister(k,x,y,w,h,seed,alpha=.4){
  if(h<5||w<15)return;const words=['0F','A2','09','C1','7E','D0','41','B8'],cols=Math.max(1,Math.floor(w/24)),cw=w/cols;
  for(let j=0;j<Math.floor(h/8);j++)for(let i=0;i<cols;i++){const n=(i*7+j*11+seed)%31,xx=x+i*cw;k.t(words[(i+j+seed)%8]+'.'+String(n).padStart(2,'0'),xx,y+j*8,5.5,k.a(n===0?T.headBg:n%5?T.altBg:T.accent,alpha),{w:cw-2});}
}
function dzSweep(k,x,y,w,h,seed,col=k.A){
  for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=120;i++){let q=i/120,v=Math.sin(q*61+seed+j*.9)*Math.sin(q*17+j)*.13+Math.sin(q*12+seed)*.12;pts.push([x+q*w,y+h*(.5+v+j*.055)]);}k.ln(pts,j===0?col:k.a(T.altBg,.4-j*.08),j===0?.65:.4);}
  for(let i=0;i<9;i++)k.ln([[x+i*w/8,y+h-2],[x+i*w/8,y+h]],k.a(T.altBg,.65),.5);
}
function dzTerminalBed(k,x,y,w,h,seed,kind=0,intensity=1){
  dzStatic(k,x,y,w,h,seed,intensity);
  const rr=k.rng(881+seed*17),cols=3+kind%3,cw=w/cols,rh=22+(kind%4)*4;
  const terms=[['SECTOR','GATE','PERMIT','REVIEW'],['ASSIGN','DUTY','RELEASE','RECALL'],['FILTER','SURFACE','PHASE','CYCLE'],['CARRIER','RECEIVE','BAND','RELAY'],['COPY','ISSUE','RETAIN','ROUTE'],['UPLINK','RECON','DEFER','BUFFER'],['CAMERA','FRAME','SECTOR','LOCK'],['REGISTRY','SEALED','ACCESS','INDEX'],['QUORUM','DECISION','HOLD','OVERRIDE'],['EVAL','RETENTION','FORM','REPEAT'],['GRID','LEVEL','BUNK','RESERVE']][kind%11];
  // Uneven register blocks leave a recognizable analog display texture at phone size.
  for(let j=0;j<Math.floor(h/rh);j++)for(let i=0;i<cols;i++){
    const xx=x+i*cw,yy=y+j*rh,a=(.1+rr()*.13)*intensity;
    if((i*3+j+kind)%4!==0){k.t(terms[(i+j)%4]+' / '+String((seed+i*17+j*7)%997).padStart(3,'0'),xx+3,yy+2,5.5,k.a(T.altBg,a*1.5),{w:cw-7});dzRegister(k,xx+3,yy+10,cw-7,8,seed+i+j,a);}
    k.ln([[xx+2,yy+rh-3],[xx+cw-4,yy+rh-3]],k.a((i+j)%5?T.altBg:T.accent,.12*intensity),.5);
    k.rect(xx,yy+3,1,8+rr()*12,k.a(T.headBg,.18*intensity));
  }
  // Each department has a different ghosted topology beneath its foreground instrument.
  if(kind%4===0){for(let j=0;j<9;j++){const yy=y+h*(.07+j*.105),bend=x+w*(.24+(j%4)*.14);k.ln([[x,yy],[bend,yy],[bend+12,Math.min(y+h-1,yy+12)],[x+w,Math.min(y+h-1,yy+12)]],k.a(j%3?T.altBg:T.accent,.13*intensity),.5);}}
  if(kind%4===1){const cx=x+w*.72,cy=y+h*.45,r=Math.min(w*.26,h*.42);for(let j=0;j<9;j++)k.arc(cx,cy,r*(.24+j*.09),-.9,4.2,k.a(j%3?T.accent:T.altBg,.16*intensity),.55);for(let i=0;i<4;i++)k.ln([[x,y+h*(i+.5)/4],[x+w,y+h*(i+.5)/4]],k.a(T.altBg,.16*intensity),.5);}
  if(kind%4===2){for(let j=0;j<5;j++){const yy=y+h*(.11+j*.17);for(let i=0;i<5;i++){let xx=x+w*i/5;k.rect(xx+3,yy,w/5-6,h*.12,null,k.a(T.altBg,.13*intensity),.5);k.ln([[xx+4,yy+h*.08],[xx+w/5-7,yy+h*.03]],k.a(T.accent,.14*intensity),.5);}}}
  if(kind%4===3){for(let j=0;j<12;j++){const yy=y+(j+.5)*h/12;for(let i=0;i<22;i++){let v=(j*13+i*7+seed)%19;if(v<11)k.rect(x+i*w/22,yy,w/22-2,2,k.a(v<3?T.headBg:T.altBg,.14*intensity));}}}
}
function dzSubpanel(k,x,y,w,h,title,seed,kind=0){
  if(h<15)return;k.rect(x,y,w,h,k.a(T.altBg,.025),k.a(T.altBg,.45),.5);
  k.rect(x,y,2,h,k.a(T.headBg,.72));k.t(title,x+5,y+2,6,k.L,{w:w-10});
  const yy=y+12,hh=h-15;
  if(kind===0)dzRegister(k,x+5,yy,w-10,hh,seed,.6);
  else if(kind===1)dzSweep(k,x+5,yy,w-10,hh,seed,k.a(T.accent,.7));
  else if(kind===2){const rng=k.rng(seed+47),cw=(w-10)/16;for(let i=0;i<16;i++){const v=.12+rng()*.85;k.rect(x+5+i*cw,yy+(1-v)*hh,cw-1,v*hh,i%7===0?k.H:k.a(T.altBg,.6));}}
  else{for(let j=0;j<Math.max(1,Math.floor(hh/7));j++){const ry=yy+j*7;for(let i=0;i<18;i++){let on=(i*3+j*5+seed)%13;k.rect(x+5+i*(w-10)/18,ry,(w-10)/18-1,4,on<4?k.a(T.headBg,.75):k.a(T.altBg,on<9?.6:.15));}}}
}
// Extra readings occupy measured free zones; none substitute for real sensor data.
function dzSecondary(k,W,H,d){
  const s=W<200,b=H>200,seed=dzSlot(d),m=d.mode;
  if(m==='status'){
    if(b){dzRegister(k,178,258,174,15,seed,.65);dzSubpanel(k,175,179,22,73,'ID',seed,3);}
    if(s)dzRegister(k,108,107,48,6,seed,.5);
  }
  if(m==='shift'){
    const l=dzTimerLayout(W,H);if(!s){const xx=b?263:242;dzRegister(k,xx,l.y+8,W-xx-16,16,seed,.42);k.t('RLS / LOCKED',xx,l.y+(b?37:28),6,k.L,{w:W-xx-16});}
    if(b){dzRegister(k,12,177,W-24,6,seed,.45);dzRegister(k,195,306,W-207,7,seed,.55);}
  }
  if(m==='solar'){
    if(!s){dzSubpanel(k,119,49,77,42,'CYCLE / SIM',seed,1);dzRegister(k,204,88,W-216,12,seed,.55);}
    if(b){for(let i=0;i<6;i++)dzRegister(k,18+(i%3)*115,221+Math.floor(i/3)*69,68,7,seed+i,.58);dzRegister(k,12,330,134,13,seed,.5);}
  }
  if(m==='audio'){
    if(!s){dzRegister(k,205,88,W-217,8,seed,.65);dzRegister(k,205,142,W-217,7,seed,.52);}
    if(b)dzRegister(k,12,329,W-24,12,seed,.6);
  }
  if(m==='transmission'){
    if(b)dzRegister(k,12,203,W-24,6,seed,.65);
  }
  if(m==='discord'&&b){dzSubpanel(k,209,151,W-221,49,'DECISION STACK / SIM',seed,3);dzRegister(k,12,331,W-24,9,seed,.58);}
  if(m==='oddity'){
    if(b){dzRegister(k,12,231,W-24,8,seed,.55);dzRegister(k,207,130,W-219,7,seed,.62);}
  }
  if(m==='feeds'&&b){dzSubpanel(k,12,327,166,17,'RECON / DEFERRED / 09',seed,0);dzSubpanel(k,186,327,166,17,'CIVIL / HELD / 03',seed+1,0);}
  if(m==='game'){
    if(!s){dzRegister(k,218,54,W-230,8,seed,.58);}
    if(b){dzRegister(k,12,225,W-24,8,seed,.62);dzRegister(k,12,337,W-24,7,seed,.5);}
  }
}

// Revision 5: each department owns a distinct geometry. Reference images inform grammar, not layouts.
function dzRibbon(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,8);dzAxis(k,x,y,w,h);
  const form=seed%10,rows=h>100?62:40,cols=12;
  const at=(t,u,layer)=>{
    let c;
    if(form===0)c=.5+.22*Math.sin(t*Math.PI*2-.7);
    else if(form===1)c=.5+.17*Math.sin(t*Math.PI*3.2);
    else if(form===2)c=.5+.23*Math.cos(t*Math.PI*1.5+.3);
    else if(form===3)c=.32+t*.30+.13*Math.sin(t*Math.PI*4);
    else if(form===4)c=.5+.23*Math.sin(t*Math.PI*2.5+.8)*Math.sin(t*Math.PI);
    else if(form===5)c=.5+.20*Math.sin(t*Math.PI*4.6+.2);
    else if(form===6)c=.5+.24*Math.sin(t*Math.PI)*Math.cos(t*Math.PI*2);
    else if(form===7)c=.5+.23*Math.sin(t*Math.PI*1.2+2);
    else if(form===8)c=.5+.19*Math.cos(t*Math.PI*5)*(.4+.6*t);
    else c=.28+t*.42+.15*Math.sin(t*Math.PI*2.7);
    const width=(.11+.055*Math.sin(t*8+layer))*Math.cos(t*7+layer*.8);
    return [x+w*(c+u*width+layer*.035),y+4+t*(h-8)];
  };
  for(let z=0;z<3;z++){
    const col=z===0?k.a(T.accent,.9):z===1?k.a(T.altBg,.85):k.ia(.53);
    for(let j=0;j<=cols;j++){let pts=[];for(let i=0;i<=rows;i++)pts.push(at(i/rows,j/cols*2-1,z));k.ln(pts,col,.5);}
    for(let i=0;i<rows;i++){const t=i/rows,pts=[];for(let j=0;j<=cols;j++)pts.push(at(t,j/cols*2-1,z));k.ln(pts,col,.55);if(i%2===0)for(let j=0;j<cols;j++)k.ln([at(t,j/cols*2-1,z),at((i+1)/rows,(j+1)/cols*2-1,z)],k.a(z?T.altBg:T.accent,.4),.4);}
  }
  const yy=y+h*(.25+(seed%4)*.12);k.ln([[x,yy],[x+w,yy]],k.H,.8);k.poly([[x+w-6,yy-3],[x+w,yy],[x+w-6,yy+3]],k.H);
  for(let j=0;j<6;j++){const cy=y+h*(j+.5)/6;k.t(String(100+j*20),x+3,cy-2,5,k.L,{w:22});k.t(['A','B','C','D','E','F'][j],x+w-4,cy-2,5,k.A,{a:'r',w:10});}
}
function dzFan(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,6);const target=[x+w*.8,y+h*.72];
  for(let j=0;j<16;j++){const sy=y+h*(.05+j*.055),pts=[[x,sy],[x+w*(.3+(j%3)*.015),sy],[target[0],target[1]],[x+w,target[1]+(j-8)*h*.008]];k.ln(pts,j===seed%16?k.H:j%4===0?k.A:k.a(T.altBg,.78),j===seed%16?1.3:.7);k.rect(x,sy-1,3,2,j%4?k.L:k.A);if(j%3===0)k.t('L'+String(j+1).padStart(2,'0'),x+w*.04,sy-5,5,k.L,{w:w*.2});}
  k.circ(target[0],target[1],3,null,k.I,.7);for(let i=0;i<10;i++)k.ln([[x+w*i/10,y+h-3],[x+w*i/10,y+h]],k.L,.7);
}
function dzChannelLoom(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,9,8);const nodes=[];
  for(let j=0;j<4;j++)for(let i=0;i<3;i++)nodes.push([x+w*(.12+i*.36),y+h*(.10+j*.25)]);
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if((i*3+j+seed)%5===0){const a=nodes[i],b=nodes[j];k.ln([a,[x+w*.51,a[1]],b],k.a(i%2?T.accent:T.altBg,.55),.5);}
  nodes.forEach(([xx,yy],i)=>{k.rect(xx-4,yy-3,8,6,i===seed%12?k.H:k.a(T.altBg,.12),i%3?k.L:k.A,.6);k.circ(xx,yy,1,i%3?k.L:k.A);});
  k.rect(x+w*.46,y,w*.10,h,k.a(T.headBg,.12),k.H,.6);for(let i=0;i<12;i++)k.rect(x+w*.475,y+i*h/12+1,w*.07,h/20,i%5?k.L:k.H);
}
function dzDutyGates(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,8);
  const bw=w*.31,bh=h*.21,bx=x+w*.05,bus=x+w*.59;
  for(let j=0;j<3;j++){
    const yy=y+h*(.06+j*.32),c=j===2?k.H:k.L;k.poly([[bx,yy],[bx+bw-5,yy],[bx+bw,yy+5],[bx+bw,yy+bh],[bx,yy+bh]],k.a(T.altBg,.12),c,1);
    k.t(['REQUEST','ASSIGNED','RELEASE'][j],bx+3,yy+3,7,c,{w:bw-6,f:'bold'});
    for(let i=0;i<8;i++)k.rect(bx+3+i*(bw-6)/8,yy+bh-5,(bw-9)/8,2,(i+j+seed)%3?k.A:k.H);
    for(let i=0;i<3;i++){const ly=yy+bh*(.30+i*.22);k.ln([[bx+bw,ly],[bus+(i-1)*3,ly],[bus+(i-1)*3,y+h*.50],[x+w*.75,y+h*.50]],k.a(j===2?T.headBg:T.accent,.6),.55);}
  }
  k.rect(x+w*.73,y+h*.36,w*.23,h*.28,k.a(T.headBg,.15),k.H,1);k.t('LOCK',x+w*.845,y+h*.39,8,k.H,{a:'c',w:w*.2,f:'bold'});k.t('09 / SIM',x+w*.845,y+h*.53,5,k.L,{a:'c',w:w*.2});
  for(let j=0;j<11;j++)k.rect(bus-7,y+j*h/11,14,1,j%3?k.a(T.altBg,.4):k.L);
}
function dzWarningField(k,x,y,w,h,seed){
  const cols=h<22?Math.max(7,Math.floor(w/22)):Math.max(4,Math.floor(w/62)),cw=w/cols,rows=h<22?1:Math.max(2,Math.round(h/(cw*.60))),ch=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const cx=x+(i+.5)*cw,cy=y+(j+.5)*ch,id=(i+j*cols+seed)%7,on=id<5,col=on?k.H:k.L;
    // Chamfered interlock tile, deliberately not a franchise warning crest.
    const ww=cw-3,hh=ch-3;k.poly([[cx-ww/2+4,cy-hh/2],[cx+ww/2-4,cy-hh/2],[cx+ww/2,cy],[cx+ww/2-4,cy+hh/2],[cx-ww/2+4,cy+hh/2],[cx-ww/2,cy]],on?col:k.a(T.altBg,.12),col,.7);
    if(h<22){k.t(String(id+11),cx,cy-3,6,on?k.GR:k.L,{a:'c',w:cw-8,f:'bold'});}
    else{const ink=on?k.GR:k.L;k.t(['HOLD','SEAL','RETAIN','CHECK','WAIT','REVIEW','LOCK'][id],cx,cy-hh*.22,Math.min(8,hh*.21),ink,{a:'c',w:ww-12,f:'bold'});k.t('S'+String(i+j*cols+1).padStart(2,'0'),cx,cy+hh*.12,5,ink,{a:'c',w:ww-12});for(let q=0;q<3;q++){k.rect(cx-ww*.32+q*ww*.25,cy+hh*.36,ww*.14,1,ink);}k.ln([[cx-ww*.37,cy-hh*.36],[cx+ww*.37,cy-hh*.36]],ink,.45);}
  }
}
function dzConsensus(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,9);
  const pts=[[.06,.12],[.38,.05],[.89,.17],[.12,.78],[.49,.91],[.90,.76],[.31,.40],[.71,.46],[.51,.63]].map(([a,b])=>[x+a*w,y+b*h]);
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)if((i+j)%3!==0){k.ln([pts[i],pts[j]],k.a((i+j)%5===0?T.accent:T.altBg,.22+(i%3)*.13),.5);}
  [[0,1],[1,2],[2,5],[5,4],[4,3],[3,0],[6,7],[7,8],[8,6]].forEach(([a,b],i)=>k.ln([pts[a],pts[b]],i===seed%9?k.H:k.L,i===seed%9?1.6:1));
  const dept=[['OPS',.01,.03],['AIR',.66,.04],['CIV',.34,.34],['REC',.02,.72],['CMD',.69,.70]],bw=w*.29,bh=h*.23;
  dept.forEach(([l,a,b],i)=>{const xx=x+a*w,yy=y+b*h,col=i===seed%5?k.H:i%2?k.A:k.L;k.poly([[xx+4,yy],[xx+bw-4,yy],[xx+bw,yy+4],[xx+bw,yy+bh-4],[xx+bw-4,yy+bh],[xx,yy+bh],[xx,yy+5]],k.a(T.ground||T.panel,.93),col,1.2);k.rect(xx+3,yy+3,bw-6,Math.min(13,bh*.48),col);k.t(l,xx+5,yy+4,Math.min(11,bh*.32),k.GR,{w:bw-10,f:'bold'});if(bh>21){k.t(i===seed%5?'WITHHELD':'LINK / 0'+(i+1),xx+4,yy+bh-8,5,col,{w:bw-8});}for(let q=0;q<4;q++)k.rect(xx+4+q*(bw-8)/4,yy+bh*.61,(bw-12)/4,1,col);if(bh>40){dzRegister(k,xx+5,yy+19,bw-10,16,i+seed,.55);for(let j=0;j<3;j++)for(let q=0;q<12;q++)k.rect(xx+5+q*(bw-10)/12,yy+bh*.53+j*4,(bw-16)/12,2,(q+j+i)%4?col:k.H);}});
  pts.forEach(([xx,yy],i)=>{k.circ(xx,yy,2,k.GR,i%3?k.L:k.A,.6);});
}
function dzSeal(k,x,y,w,h,id){
  const X=u=>x+w*u,Y=u=>y+h*u,r=Math.min(w,h),c=id%3===0?k.H:id%3===1?k.L:k.A;
  const L=(pts,col=c,l=.8)=>k.ln(pts.map(([u,v])=>[X(u),Y(v)]),col,l),R=(a,b,ww,hh,col=c)=>k.rect(X(a),Y(b),w*ww,h*hh,k.a(T.altBg,.05),col,.7);
  if(h>60){for(let j=0;j<18;j++){const u=.03+j*.055;L([[0,u],[.025,u]],k.L,.6);L([[.975,u],[1,u]],k.A,.6);}dzRegister(k,x+w*.08,y+h*.93,w*.84,h*.07,id,.45);}
  if(id===0){for(let j=0;j<5;j++){let a=.06+j*.17;L([[a,.20],[a+.12,.08],[a+.12,.72],[a,.84],[a,.20]],j%2?k.L:k.A,.9);L([[a,.46],[a+.12,.34]],k.H,1.2);}L([[.04,.93],[.94,.93]],k.L,1);for(let j=0;j<11;j++)L([[.06+j*.08,.87],[.06+j*.08,.98]],k.L,.6);}
  if(id===1){for(let j=0;j<4;j++){const a=.09+j*.22;R(a,.10,.17,.80,j%2?k.H:k.L);L([[a,.50],[a+.17,.50]],k.I);for(let q=0;q<4;q++)R(a+.04,.16+q*.17,.09,.08,k.A);}}
  if(id===2){for(let j=0;j<9;j++){const u=.08+j*.105;L([[.10,u],[.90,1-u]],k.L,.6);L([[u,.10],[1-u,.90]],k.A,.6);}k.rect(X(.42),Y(.40),w*.16,h*.2,null,k.H,1);}
  if(id===3){for(let j=0;j<3;j++)for(let i=0;i<4;i++){R(.06+i*.23,.09+j*.30,.18,.24,(i+j)%4?k.L:k.H);for(let q=0;q<3;q++)L([[.085+i*.23,.145+j*.30+q*.05],[.215+i*.23,.145+j*.30+q*.05]],k.A,.55);}}
  if(id===4){for(let i=0;i<6;i++){let d=i*.013;L([[.07+d,.87],[.07+d,.63+d],[.3+d,.63+d],[.3+d,.40+d],[.59+d,.40+d],[.59+d,.12+d],[.93,.12+d]],i===0?k.L:k.a(T.altBg,.75),i===0?1.4:.55);}L([[.16,.92],[.39,.92],[.39,.68],[.70,.68],[.70,.42],[.92,.42]],k.H,2);for(let j=0;j<6;j++){L([[.10+j*.14,.05],[.10+j*.14,.94]],k.a(T.accent,.35),.5);R(.17+j*.10,.76-j*.08,.065,.055,j%2?k.A:k.H);}}
  if(id===5){for(let j=0;j<5;j++){let a=.08+j*.075;R(a,a,1-a*2,1-a*2,j%2?k.H:k.L);}for(let i=0;i<18;i++){let u=.07+i*.05;L([[u,.05],[u,.17]],i%3?k.L:k.H,.6);L([[u,.83],[u,.95]],i%3?k.L:k.H,.6);}k.rect(X(.37),Y(.37),w*.26,h*.26,k.H);k.ln([[X(.42),Y(.5)],[X(.58),Y(.5)]],k.GR,2);}
  if(id===6){for(let i=0;i<9;i++){let a=.07+i*.038;L([[.5,.04+a],[.95-a,.5],[.5,.96-a],[.05+a,.5],[.5,.04+a]],i%3?k.L:k.A,.65);}L([[.02,.5],[.98,.5]],k.H,1.6);for(let j=0;j<7;j++)R(.17+j*.1,.44,.045,.12,j%2?k.L:k.H);}
  if(id===7){for(let i=0;i<5;i++){k.arc(X(.5),Y(.5),r*(.12+i*.075),-.8,4.7,i%2?k.A:k.L,.8);}for(let j=0;j<12;j++){let a=j*Math.PI/6;k.ln([[X(.5)+Math.cos(a)*r*.36,Y(.5)+Math.sin(a)*r*.36],[X(.5)+Math.cos(a)*r*.46,Y(.5)+Math.sin(a)*r*.46]],k.H,1);}}
  if(id===8){for(let j=0;j<10;j++){let a=.06+j*.046;L([[.06,a],[.50,a+.26],[.94,a],[.94,a+.07],[.50,a+.33],[.06,a+.07]],j%3?k.L:k.A,.6);}L([[.50,.31],[.50,.94]],k.H,1.6);for(let j=0;j<7;j++)L([[.44,.47+j*.066],[.56,.47+j*.066]],k.H,.8);}
  if(id===9){for(let i=0;i<5;i++){let a=.08+i*.17;L([[a,.82],[a,.35],[a+.12,.18],[a+.12,.65],[a,.82]],i%2?k.A:k.L,1);L([[a,.55],[a+.12,.38]],k.H);}}
  if(id===10){for(let j=0;j<3;j++){let cx=X(.23+j*.28),cy=Y(.3+(j%2)*.4);k.hex(cx,cy,r*.2,null,k.L,1);k.hex(cx,cy,r*.12,null,k.A,.8);k.circ(cx,cy,r*.055,k.H);}L([[.08,.88],[.33,.6],[.6,.4],[.93,.08]],k.H,1.2);}
  if(id===11){for(let j=0;j<6;j++){let a=.06+j*.145;R(a,.1+j*.035,.115,.78-j*.045,j%3?k.L:k.H);const n=h>150?18:8;for(let q=0;q<n;q++)L([[a+.02,.18+q*.033+j*.03],[a+.10,.18+q*.033+j*.03]],q%5?k.A:k.H,q%5?.5:1.5);}}
}
function dzCredential(k,x,y,w,h,id){
  const p=DZ_PEOPLE[id%12],code=String(id+1).padStart(2,'0'),tall=h>135;
  k.rect(x,y,w,h,k.a(T.altBg,.055),k.L,.8);k.rect(x,y,3,h,id%3===0?k.H:k.L);
  for(let j=0;j<9;j++){const pts=[];for(let i=0;i<=60;i++){const u=i/60;pts.push([x+5+u*(w-10),y+23+(h-34)*(j+.5)/9+Math.sin(u*24+id+j)*3]);}k.ln(pts,k.a(j%2?T.accent:T.altBg,.13),.45);}
  k.rect(x+5,y+5,w-10,14,id%3===0?k.H:k.L);k.t('OPERATOR / '+code,x+10,y+7,9,k.GR,{w:w-22,f:'bold'});
  k.t(code,x+9,y+22,tall?45:35,k.I,{w:w*.43,f:'disp'});
  dzSeal(k,x+w*.54,y+24,w*.38,tall?45:34,id);
  const ny=y+(tall?78:65);k.t(p[0],x+9,ny,12,k.I,{w:w-18,f:'bold'});k.t(p[1],x+9,ny+15,8,k.L,{w:w-18});
  if(tall){dzSeal(k,x+14,y+117,w-28,105,id);k.t('COMPARTMENT '+(id+10)+' / LEVEL '+['A','B','C'][id%3],x+9,y+104,6,k.L,{w:w-18});dzRegister(k,x+9,y+227,w-18,15,id,.6);k.t('FILE / '+(7301+id*137),x+9,y+246,7,k.L,{w:w-18});k.rect(x+9,y+260,w-18,6,k.a(T.ink,.35));k.rect(x+9+(id%4)*13,y+260,w*.26,6,k.H);}
  k.t('C-'+(id+101)+' / '+p[3],x+9,y+h-23,8,k.L,{w:w-18,f:'bold'});
  for(let j=0;j<Math.floor((w-18)/4);j++)k.rect(x+9+j*4,y+h-8,(j+id)%3===0?2.5:1,4,j%7===0?k.H:k.ia(.55));
}
function dzShelterSection(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,18,8);const levels=3+seed%3,cx=x+w*.53,cy=y+h*.50;
  // Underground stepped service decks around a municipal power trunk, never figures.
  for(let j=0;j<levels;j++){
    const yy=y+4+j*(h-8)/levels,hh=(h-10)/levels,left=.03+(j%3)*.035,right=.67-(j%2)*.055;
    [[left,.37-(j%3)*.035],[right,.96-right]].forEach(([xx,ww],s)=>{const px=x+xx*w,pw=ww*w;k.poly([[px+4,yy],[px+pw,yy],[px+pw,yy+hh-3],[px,yy+hh-3],[px,yy+4]],k.a(T.altBg,.1),s?k.L:k.A,.7);for(let q=0;q<5;q++){const bx=px+4+q*(pw-8)/5;k.rect(bx,yy+3,(pw-16)/5,hh*.38,null,q===j%5?k.H:k.L,.6);k.rect(bx,yy+hh*.62,(pw-16)/5,1.3,q%3?k.L:k.A);}k.ln([[px+pw,yy+hh/2],[cx,yy+hh/2]],k.a(T.altBg,.5),.6);});
  }
  const r=Math.min(w*.10,h*.20);k.rect(cx-r*.7,y+2,r*1.4,h-4,k.a(T.headBg,.13),k.H,.8);
  for(let j=0;j<11;j++){const yy=y+5+j*(h-10)/10;k.ell(cx,yy,r*.7,2,null,j%4?k.L:k.H,.6);}
  k.hex(cx,cy,r,k.GR,k.A,1);k.hex(cx,cy,r*.6,null,k.L,.8);k.circ(cx,cy,Math.max(1,r*.22),k.H);k.ln([[x,y+h-1],[x+w,y+h-1]],k.H,1);
}

function dzSlot(d){return Number.isFinite(d.seed)?Math.abs(Math.floor(d.seed)):Math.floor(+(d.now||new Date())/1800000)}
function dzSafe(raw){
  const k=Object.assign({},raw);
  k.t=(text,x,y,size,color,o={})=>{const s=String(text),f=o.f||'mono',factor=f==='disp'?.68:.61,w=o.w||300;raw.t(s,x,y,Math.min(size,w/Math.max(1,s.length*factor)),color,{...o,nofit:true});};
  k.para=(text,x,y,w,size,color,f='disp',max=3,lh=1.22)=>{let ls;for(let n=0;n<110;n++){const limit=Math.floor(w/(size*(f==='disp'?.68:.61)));ls=[];let line='';for(const word of String(text).split(/\s+/)){if(line&&(line+' '+word).length>limit){ls.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)ls.push(line);if(ls.length<=max&&ls.every(s=>s.length<=limit))break;size*=.96;}ls.forEach((s,i)=>k.t(s,x,y+i*size*lh,size,color,{f,w}));return ls.length*size*lh;};return k;
}
function dzFrame(k,W,H,d){
  k.rect(0,0,W,H,k.GR);const slot=dzSlot(d),kind=Object.keys(DZ_META).indexOf(d.mode);dzTerminalBed(k,8,30,W-16,H-52,slot+kind*19,kind,.85);
  for(let i=0;i<6;i++){k.rect(12+i*7,25,4,.7,i%3?k.L:k.H);k.rect(W-52+i*6,24,3,1,k.a(T.altBg,.6));}
  k.poly([[5,15],[15,5],[W-15,5],[W-5,15],[W-5,H-15],[W-15,H-5],[15,H-5],[5,H-15]],null,k.a(T.altBg,.6),.7);
  k.rect(10,10,30,14,k.H);k.t('D-00',25,12,9,k.I,{a:'c',w:28,f:'bold'});
  k.t(DZ_META[d.mode],47,11,W<200?9:10,k.L,{w:W-60,f:'bold'});
  k.ln([[10,28],[W-10,28]],k.L,.6);
  for(let i=0;i<5;i++){k.rect(W-20-i*4,H-12,2,3,i%3?k.L:k.H)}
  k.t(['status','shift','solar'].includes(d.mode)?'D-00 / PERSONAL TERMINAL':'D-00 / SIMULATED RECORD',12,H-17,7,k.S,{w:W-56});
  for(const x of [2,W-3]){k.rect(x,32,1,17,k.H);k.rect(x,H-49,1,17,k.L);}
}
function dzChip(k,text,x,y,w,c=k.H){k.rect(x,y,w,13,c);k.t(text,x+w/2,y+2,8,k.GR,{w:w-6,a:'c',f:'bold'});}
function dzLabel(k,text,x,y,w,c){k.t(text,x,y,8,c||k.L,{w,f:'bold'});}
function dzRule(k,x,y,w,l,v,c){k.ln([[x,y],[x+w,y]],k.a(T.altBg,.36),.6);k.t(l,x,y+4,8,k.S,{w:w*.53});k.t(v,x+w,y+3,10,c||k.I,{a:'r',w:w*.45,f:'bold'});}
function dzGrid(k,x,y,w,h,nx=10,ny=6){for(let i=0;i<=nx;i++)k.ln([[x+i*w/nx,y],[x+i*w/nx,y+h]],k.a(T.altBg,i%5===0?.28:.1),.5);for(let i=0;i<=ny;i++)k.ln([[x,y+i*h/ny],[x+w,y+i*h/ny]],k.a(T.altBg,i%3===0?.26:.1),.5);}
function dzAxis(k,x,y,w,h){k.ln([[x,y],[x,y+h],[x+w,y+h]],k.L,.8);for(let j=0;j<=8;j++){k.ln([[x-3,y+j*h/8],[x,y+j*h/8]],k.L,.7);k.ln([[x+j*w/8,y+h],[x+j*w/8,y+h+3]],k.L,.7)}}
function dzBand(k,x,y,w,h,n,seed,c){const rng=k.rng(seed+113);for(let i=0;i<n;i++){const v=rng(),xx=x+i*w/n;k.rect(xx,y,w/n-1,h,k.a(T.altBg,.09));k.rect(xx,y+h*(1-v),w/n-1,h*v,i%9===0?k.H:c||k.L);}}
function dzHexField(k,x,y,w,h,seed){const r=Math.min(12,w/13,h/5),dx=r*1.8,dy=r*1.6;for(let j=0;j<Math.floor(h/dy);j++)for(let i=0;i<Math.floor(w/dx)-1;i++){const n=(i*5+j*7+seed)%13,c=n<2?k.H:n<6?k.L:n===8?k.A:k.a(T.altBg,.08);k.hex(x+r+i*dx+(j%2)*dx/2,y+r+j*dy,r*.9,c,k.a(T.altBg,.6),.55);}}
function dzRing(k,x,y,w,h,seed,value,caption){
  const r=Math.min(w,h)*.43,cx=x+w*.5,cy=y+h*.49;
  dzRegister(k,x,y,w,Math.min(h,16),seed,.3);
  for(let q=0;q<5;q++){const yy=y+h*(.23+q*.135);k.ln([[x,yy],[cx-r*.91,yy]],k.a(T.accent,.45),.5);k.ln([[cx+r*.91,yy],[x+w,yy]],k.a(T.altBg,.6),.5);}
  for(let z=0;z<4;z++){const rr=r*(.34+z*.07);k.arc(cx,cy,rr,-1.1,.4,k.a(T.accent,.35),.5);k.arc(cx,cy,rr,2.1,3.6,k.a(T.altBg,.4),.5);}
  for(let i=0;i<96;i++){const a=i*Math.PI/48,b=a+.037,rr=r*(i%8===0?1.07:1);k.ln([[cx+r*.93*Math.cos(a),cy+r*.93*Math.sin(a)],[cx+rr*Math.cos(a),cy+rr*Math.sin(a)]],i%8?k.a(T.altBg,.7):k.I,i%8?.5:1);if(i%8===0&&w>110)k.t(String(i*10),cx+(r+10)*Math.cos(a),cy+(r+10)*Math.sin(a)-3,5.5,k.L,{a:'c',w:19});}
  for(let i=0;i<28;i++){const a=-Math.PI/2+i*Math.PI/14,b=a+.155;k.poly([[cx+r*.84*Math.cos(a),cy+r*.84*Math.sin(a)],[cx+r*.84*Math.cos(b),cy+r*.84*Math.sin(b)],[cx+r*.68*Math.cos(b),cy+r*.68*Math.sin(b)],[cx+r*.68*Math.cos(a),cy+r*.68*Math.sin(a)]],i<18?k.H:i<23?k.L:k.ia(.12));}
  k.circ(cx,cy,r*.64,null,k.ia(.65),.65);k.arc(cx,cy,r*.57,-2.8,1.1,k.A,2);k.arc(cx,cy,r*.51,.2,2.5,k.a(T.altBg,.55),1);
  k.ln([[cx-r*1.08,cy],[cx-r*.9,cy]],k.A,1.2);k.ln([[cx+r*.9,cy],[cx+r*1.08,cy]],k.A,1.2);
  k.t(value||'D-00',cx,cy-r*.28,r*.55,k.I,{a:'c',w:r*1.12,f:'disp'});k.t(caption||'CONDITION',cx,cy+r*.3,6,k.L,{a:'c',w:r*1.1});
  for(let i=0;i<4;i++)k.rect(cx-r*.3+i*r*.2,cy+r*.49,r*.11,1.2,i===seed%4?k.H:k.A);
}
// Phase portrait: an evolving bundle of trajectories, never a pictorial character.
function dzPhase(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,6);dzAxis(k,x,y,w,h);dzRegister(k,x+3,y+2,w-6,16,seed,.48);
  for(let q=0;q<4;q++){const pp=[];for(let i=0;i<=80;i++){let u=i/80;pp.push([x+u*w,y+h*(.12+q*.25+.055*Math.sin(u*21+q+seed))]);}k.ln(pp,k.a(q%2?T.accent:T.altBg,.23),.5);}
  for(let j=0;j<7;j++){let yy=y+h*(j+.5)/7;k.t(String(910+j*17+seed),x+3,yy-2,5,k.a(T.altBg,.55),{w:19});}
  for(let j=0;j<6;j++){let pts=[];for(let i=0;i<330;i++){const t=i/329*Math.PI*2*3.7,xx=.5+.36*Math.sin(t*(1+(seed%3)*.012)+j*.1)*(.6+.4*Math.cos(t*.17)),yy=.5+.40*Math.sin(t*2.03+j*.03+seed*.08);pts.push([x+xx*w,y+yy*h]);}k.ln(pts,j===0?k.A:j===5?k.H:k.a(T.altBg,.8-j*.08),j===0?.8:.5);}
  for(let j=1;j<5;j++){const xx=x+w*j/5;for(let z=1;z<4;z++){const yy=y+h*z/4;k.ln([[xx-2,yy],[xx+2,yy]],k.A,.5);k.ln([[xx,yy-2],[xx,yy+2]],k.A,.5)}}
  k.ln([[x+w*.67,y],[x+w*.67,y+h]],k.I,.65);k.rect(x+w*.67-2,y+h*.36-2,4,4,k.H);
}
function dzSpectrum(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,16,6);dzRegister(k,x+3,y+2,w-6,16,seed,.55);dzSweep(k,x,y+h*.14,w,h*.55,seed,k.a(T.accent,.4));const n=44,rng=k.rng(seed+24);
  for(let i=0;i<n;i++){const v=(.12+.78*Math.exp(-Math.pow((i-21)/11,2)))*(.6+rng()*.4),xx=x+i*w/n;for(let j=0;j<Math.floor(v*15);j++)k.rect(xx,y+h-(j+1)*h/16,w/n-1.2,h/19,j>11?k.H:j%3?k.L:k.A);k.rect(xx,y+h-v*h-3,w/n-1.2,1,k.I)}
  for(let i=0;i<5;i++){const xx=x+i*w/4;k.ln([[xx,y+h],[xx,y+h+4]],k.L,.7);k.t(String(80+i*5),xx,y+h+6,6,k.L,{a:'c',w:16});}
  const gate=x+w*(.43+(seed%3)*.025);k.ln([[gate,y],[gate,y+h]],k.H,1.2);k.poly([[gate-4,y],[gate+4,y],[gate,y+6]],k.H);
}
function dzPacket(k,x,y,w,h,seed){
  const rows=6,cols=Math.max(18,Math.floor(w/4)),cw=w/cols,ch=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let v=(i*13+j*7+seed*3)%23;k.rect(x+i*cw+.5,y+j*ch+.5,cw-1,ch-1,v<6?k.H:v<15?k.a(T.altBg,.7):v===20?k.A:k.ia(.07));}
  for(let i=0;i<5;i++){let xx=x+w*i/5;k.ln([[xx,y-3],[xx+w/5-2,y-3]],k.L,.5)}
}
// Floor-plan records replace the rejected perspective doodles. Each room family has its own topology.
function dzFacility(k,x,y,w,h,id){
  const X=v=>x+v*w,Y=v=>y+v*h,R=(a,b,c,d,col=k.L)=>{k.rect(X(a),Y(b),c*w,d*h,k.a(T.altBg,.09),col,.7);k.rect(X(a)+2,Y(b)+2,c*w-4,d*h-4,null,k.a(T.altBg,.35),.35)},L=(pts,col=k.L,l=.6)=>k.ln(pts.map(p=>[X(p[0]),Y(p[1])]),col,l);
  dzGrid(k,x,y,w,h,12,7);const variants=id;
  for(let j=0;j<6;j++){let yy=y+h*(j+.5)/6;k.t(String(id*17+j+101),x+2,yy,4.5,k.a(T.altBg,.52),{w:15});k.ln([[x+w*.14,yy+2],[x+w*.9,yy+2]],k.a(T.accent,.13),.5);}
  for(let i=0;i<24;i++)k.rect(x+i*w/24,y+h-1,w/24-1,.6,i%5?k.a(T.altBg,.45):k.A);
  if(variants===0){for(let j=0;j<4;j++){R(.06,.06+j*.22,.35,.17,j===id%4?k.H:k.L);R(.59,.06+j*.22,.35,.17);for(let i=0;i<4;i++){R(.085+i*.075,.09+j*.22,.04,.1);R(.615+i*.075,.09+j*.22,.04,.1)}}R(.45,.02,.1,.95,k.A);for(let j=0;j<9;j++)L([[.43,.08+j*.1],[.57,.08+j*.1]],j%3?k.L:k.H,1);}
  if(variants===1){for(let j=0;j<3;j++)for(let i=0;i<4;i++){const cx=X(.13+i*.245),cy=Y(.17+j*.32),r=Math.min(w*.09,h*.13);k.circ(cx,cy,r,null,k.L,.8);k.circ(cx,cy,r*.7,null,k.ia(.35),.5);for(let q=0;q<4;q++){const a=q*Math.PI/2+id*.2;k.ln([[cx+2*Math.cos(a),cy+2*Math.sin(a)],[cx+r*.8*Math.cos(a+.4),cy+r*.8*Math.sin(a+.4)]],j===1?k.H:k.A,1)}}L([[.02,.49],[.98,.49]],k.L,2);}
  if(variants===2){for(let j=0;j<5;j++){let yy=.08+j*.18;R(.08,yy,.64,.11);for(let i=0;i<11;i++)L([[.1+i*.054,yy+.01],[.1+i*.054,yy+.1]],i===id%11?k.H:k.L,.6)}R(.79,.04,.16,.9,k.A);for(let j=0;j<5;j++)R(.82,.08+j*.18,.1,.07,j%2?k.H:k.L);}
  if(variants===3){for(let j=0;j<2;j++)for(let i=0;i<3;i++){let cx=X(.17+i*.33),cy=Y(.24+j*.51),r=Math.min(w*.14,h*.21);k.hex(cx,cy,r,k.a(T.altBg,.15),k.L,1);k.hex(cx,cy,r*.72,null,k.ia(.5),.5);for(let z=0;z<5;z++)k.ln([[cx-r*.55,cy-r*.4+z*r*.2],[cx+r*.55,cy-r*.4+z*r*.2]],j?k.A:k.H,.6);}L([[.02,.5],[.98,.5]],k.A,1.2);}
  if(variants===4){for(let j=0;j<8;j++){let xx=.06+j*.105,yy=.05+(j%3)*.085;R(xx,yy,.075,.72-(j%3)*.1);for(let z=0;z<6;z++)L([[xx+.01,yy+.07+z*.08],[xx+.065,yy+.07+z*.08]],z===id%6?k.H:k.L,.65);}L([[.02,.86],[.94,.86],[.94,.04]],k.A,2);}
  if(variants===5){for(let j=0;j<5;j++)for(let i=0;i<6;i++){const xx=.04+i*.158,yy=.045+j*.19;R(xx,yy,.125,.145,(i+j)%5===0?k.H:k.L);k.rect(X(xx+.02),Y(yy+.035),w*.07,h*.025,(i*3+j+id)%4?k.a(T.altBg,.45):k.A);L([[xx+.02,yy+.095],[xx+.10,yy+.095]],k.ia(.5),.5);}}
  if(variants===6){for(let j=0;j<3;j++){const xx=.07+j*.31;R(xx,.11,.23,.78);for(let z=0;z<8;z++){R(xx+.045,.15+z*.081,.14,.042,z===3?k.H:k.L);L([[xx+.01,.17+z*.081],[xx+.23,.17+z*.081]],k.ia(.45),.45);}}L([[.01,.06],[.98,.06]],k.A,2);L([[.01,.94],[.98,.94]],k.H,2);}
  if(variants===7){const cx=X(.5),cy=Y(.5),r=Math.min(w*.4,h*.45);for(let q=0;q<4;q++)k.hex(cx,cy,r*(1-q*.19),q===3?k.a(T.headBg,.24):null,q===3?k.H:k.L,.8);for(let i=0;i<12;i++){const a=i*Math.PI/6;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;k.rect(px-3,py-2,6,4,i%3?k.L:k.A);k.ln([[cx+Math.cos(a)*r*.7,cy+Math.sin(a)*r*.7],[px,py]],k.ia(.5),.5);}L([[0,.5],[.16,.5]],k.A,2);L([[.84,.5],[1,.5]],k.H,2);}
  if(variants===8){for(let j=0;j<4;j++){const xx=.05+j*.235;R(xx,.08,.19,.84);R(xx+.025,.18,.14,.28,k.A);R(xx+.025,.56,.14,.23,k.H);for(let z=0;z<5;z++)L([[xx+.05+z*.021,.2],[xx+.05+z*.021,.44]],k.A,.55);L([[xx-.01,.5],[xx+.20,.5]],k.I,1);}L([[.03,.04],[.97,.04]],k.L,1.5);}
  if(variants===9){R(.32,.03,.37,.94,k.L);R(.38,.32,.25,.34,k.H);for(let j=0;j<12;j++){L([[.04,.06+j*.075],[.27,.06+j*.075]],j%3?k.L:k.A);L([[.74,.06+j*.075],[.97,.06+j*.075]],j%4?k.L:k.H);L([[.34,.05+j*.075],[.37,.05+j*.075]],k.I,.6);}for(let z=0;z<6;z++)L([[.40+z*.04,.05],[.40+z*.04,.30]],k.ia(.7),.6);L([[.5,.7],[.5,.96]],k.A,2);}
  if(variants===10){for(let j=0;j<3;j++)for(let i=0;i<3;i++){const xx=.07+i*.31,yy=.12+j*.3;R(xx,yy,.23,.105);for(let z=0;z<4;z++){R(xx+.015+z*.052,yy-.053,.03,.027,k.A);R(xx+.015+z*.052,yy+.13,.03,.027,k.L)}}L([[.015,.01],[.015,.98],[.98,.98]],k.H,1.5);}
  if(variants===11){R(.04,.06,.92,.86,k.H);R(.21,.13,.58,.72,k.L);R(.29,.21,.42,.56,k.H);for(let j=0;j<8;j++){L([[.06+j*.115,.08],[.06+j*.115,.20]],k.H,1.7);L([[.06+j*.115,.78],[.06+j*.115,.91]],k.H,1.7);}k.poly([[X(.37),Y(.36)],[X(.63),Y(.36)],[X(.63),Y(.64)],[X(.37),Y(.64)]],k.H,k.L,.7);k.t('SEALED',X(.5),Y(.43),Math.min(14,h*.16),k.GR,{a:'c',w:w*.25,f:'bold'});L([[.02,.49],[.27,.49]],k.A,1.4);L([[.72,.49],[.99,.49]],k.A,1.4);}
  for(let i=0;i<4;i++){const xx=X(.05+i*.29);k.ln([[xx,y-2],[xx+5,y-2]],k.I,.6)}
}
function dzOperatorCard(k,x,y,w,h,id){
  const p=DZ_PEOPLE[id%12],code=String(id+1).padStart(2,'0'),tall=h>135;
  k.rect(x,y,w,h,k.a(T.altBg,.045),k.L,.8);k.rect(x,y,3,h,k.H);
  // Security-line guilloche and punched registration distinguish each credential.
  for(let j=0;j<11;j++){const pts=[];for(let q=0;q<=70;q++){const t=q/70;pts.push([x+5+t*(w-10),y+21+(h-36)*(j+.5)/11+Math.sin(t*30+j*.7+id)*3]);}k.ln(pts,k.a(j%3?T.altBg:T.accent,.18),.45);}
  for(let j=0;j<18;j++){const yy=y+22+j*(h-29)/18;k.rect(x+w-7,yy,3,2,(j+id)%4?k.a(T.altBg,.5):k.H);}
  if(tall){dzRegister(k,x+9,y+102,w-24,10,id,.55);dzRegister(k,x+9,y+160,w-24,10,id+4,.6);dzRegister(k,x+9,y+236,w-24,10,id+7,.55);}
  k.rect(x+5,y+5,w-10,14,k.L);k.t('OPERATOR / '+code,x+10,y+7,9,k.GR,{w:w-22,f:'bold'});
  // A typographic access instrument: no portrait, avatar or character glyph.
  k.t(code,x+9,y+21,tall?48:39,k.I,{w:w*.43,f:'disp'});
  k.t('S / 9',x+w*.56,y+27,14,k.L,{w:w*.4,f:'bold'});
  k.t('LEVEL '+['A','B','C'][id%3],x+w*.56,y+46,8,k.L,{w:w*.4});
  for(let j=0;j<4;j++)k.rect(x+w*.56+j*(w*.09),y+61,w*.06,4,(id+j)%3?k.H:k.A);
  const nameY=y+(tall?80:65);k.t(p[0],x+9,nameY,11,k.I,{w:w-18,f:'bold'});k.t(p[1],x+9,nameY+15,9,k.L,{w:w-18});
  if(tall){for(let i=0;i<3;i++){const yy=y+119+i*15;k.t(['FILE','ROUTE','TERM'][i],x+9,yy,7,k.S,{w:35});k.rect(x+47,yy+1,w-59-(i%2)*15,6,i===id%3?k.H:k.ia(.6));}dzRule(k,x+9,y+h-54,w-18,'COMPARTMENT',String(id+10).padStart(2,'0'));if(h>240){k.t('AUTHORIZATION / SEALED',x+9,y+174,8,k.L,{w:w-18});for(let j=0;j<3;j++){k.rect(x+9,y+191+j*14,w-18,10,null,k.a(T.altBg,.45),.6);for(let i=0;i<9;i++)k.rect(x+12+i*(w-25)/9,y+194+j*14,(w-40)/9,4,(i+j+id)%4?k.L:k.H);}}}
  const yy=y+h-23;k.t('C-'+(id+101)+' / '+p[3],x+9,yy,8,k.L,{w:w-18,f:'bold'});
  for(let j=0;j<Math.floor((w-18)/4);j++)k.rect(x+9+j*4,y+h-8,(j+id)%3===0?2.5:1,4,j%7===0?k.H:k.ia(.55));
}
function dzNetwork(k,x,y,w,h,seed){
  const nodes=[['OPS',.03,.02],['AIR',.58,.04],['CIV',.23,.36],['REC',.02,.73],['CMD',.65,.67]],bw=w*.29,bh=h*.22;
  dzGrid(k,x,y,w,h,15,7);dzRegister(k,x+2,y+h*.29,w-4,Math.min(16,h*.18),seed,.5);
  for(let q=0;q<7;q++){const yy=y+h*(q+.5)/7;k.ln([[x,yy],[x+w,yy]],k.a(q%3?T.altBg:T.accent,.21),.5);}
  for(let j=0;j<9;j++)k.rect(x+w*.51,y+j*h/9,2,Math.min(5,h/20),j%3?k.L:k.H);
  [[0,2],[1,2],[2,3],[2,4],[0,3],[1,4]].forEach(([a,b],i)=>{let aa=nodes[a],bb=nodes[b],ax=x+aa[1]*w+bw/2,ay=y+aa[2]*h+bh/2,bx=x+bb[1]*w+bw/2,by=y+bb[2]*h+bh/2;k.ln([[ax,ay],[ax,(ay+by)/2],[bx,(ay+by)/2],[bx,by]],i===seed%6?k.H:k.L,i===seed%6?2:1);});
  nodes.forEach(([label,xx,yy],i)=>{xx=x+xx*w;yy=y+yy*h;const col=i===seed%5?k.H:i%2?k.A:k.L;k.poly([[xx,yy],[xx+bw-5,yy],[xx+bw,yy+5],[xx+bw,yy+bh],[xx+5,yy+bh],[xx,yy+bh-5]],col,k.I,.4);k.t(label,xx+4,yy+3,Math.min(14,bh*.35),k.GR,{w:bw-8,f:'bold'});if(bh>35){for(let j=0;j<3;j++){const ry=yy+21+j*(bh-36)/3;for(let z=0;z<12;z++)k.rect(xx+5+z*(bw-10)/12,ry,(bw-10)/12-1,1.5,k.a(T.ground,(z+i+j)%5===0?.7:.24));}k.ln([[xx+bw*.66,yy+4],[xx+bw*.66,yy+17],[xx+bw-4,yy+17]],k.a(T.ground,.55),.6);}if(bh>18)k.t('0'+(i+1)+' / '+(i===seed%5?'HOLD':'LINK'),xx+4,yy+bh-10,6,k.GR,{w:bw-8});});
}
function dzShelter(k,x,y,w,h,seed){
  const n=3+seed%3;dzGrid(k,x,y,w,h,20,10);dzRegister(k,x+3,y+h*.12,w-6,Math.min(h-10,90),seed,.3);k.stripes(x,y,w,5,k.L,7);
  k.rect(x+w*.43,y+8,w*.1,h-12,k.a(T.headBg,.15),k.H,1);for(let i=0;i<12;i++)k.ln([[x+w*.45,y+10+i*(h-18)/12],[x+w*.51,y+10+i*(h-18)/12]],k.L,.7);
  for(let j=0;j<n;j++){const yy=y+12+j*(h-17)/n,hh=(h-22)/n;for(let s=0;s<2;s++){const xx=x+(s?.58:.04)*w,ww=w*.37;k.rect(xx,yy,ww,hh,k.a(T.altBg,.09),k.L,.7);for(let z=0;z<4;z++){const bx=xx+4+z*(ww-8)/4;k.rect(bx,yy+4,(ww-16)/4,hh*.34,null,k.ia(.65),.6);for(let q=0;q<3;q++)k.ln([[bx+2,yy+6+q*hh*.08],[bx+(ww-16)/4-2,yy+6+q*hh*.08]],s?k.A:k.L,.4);}k.rect(xx+4,yy+hh*.63,ww-8,2,(j+s)%3?k.L:k.H);for(let z=0;z<8;z++)k.rect(xx+4+z*(ww-8)/8,yy+hh-6,2,2,(j+s+z)%4?k.A:k.H);}k.t('L'+(j+1),x+w*.48,yy+hh*.32,6,k.I,{a:'c',w:w*.07});}
}
function dzTimerLayout(W,H){return{x:12,y:H>200?100:W<200?83:88,w:W-24,fs:W<200?27:H>200?47:33}}
function dzWeatherMark(k,x,y,id,wx,a){
  if(id===0||id===4){const v=id===0?wx.temp:a.dew;k.rect(x-3,y-11,6,22,null,k.L,.7);k.circ(x,y+14,4,v!=null?k.H:null,k.L,.6);for(let i=0;i<5;i++)k.ln([[x+5,y-9+i*4],[x+(i%2?8:11),y-9+i*4]],k.L,.6);if(v!=null){const norm=T.units==='celsius'?(v+20)/70:(v+4)/126;k.rect(x-1.5,y+9-20*Math.max(0,Math.min(1,norm)),3,20*Math.max(0,Math.min(1,norm)),k.H);}}
  if(id===1){for(let i=0;i<9;i++)k.rect(x-3,y+14-i*3.3,14,2.1,a.rh!=null&&i/9<a.rh/100?k.A:k.ia(.12));k.ln([[x-7,y-13],[x-7,y+16]],k.L,.7);}
  if(id===2){k.poly([[x+1,y-14],[x+14,y+10],[x-12,y+10]],a.uv>5?k.a(T.headBg,.3):null,k.L,1);k.t(a.uv!=null?'!':'?',x+1,y-5,13,k.H,{a:'c',w:15,f:'bold'});k.t(a.uv==null?'--':a.uv<3?'LOW':a.uv<6?'MOD':'HIGH',x+1,y+13,6,k.L,{a:'c',w:25});}
  if(id===3){for(let i=0;i<5;i++){const yy=y-9+i*6;k.ln([[x-10+i*1.7,yy],[x+14-i*1.7,yy]],a.vis?k.a(T.altBg,1-i*.16):k.ia(.12),1.5);}k.ln([[x-13,y-14],[x-13,y+19]],k.L,.5);}
  if(id===5){k.hex(x,y,13,null,k.L,.7);k.ln([[x,y-16],[x,y+16]],k.ia(.5),.5);k.ln([[x-16,y],[x+16,y]],k.ia(.5),.5);if(a.wd!=null){const an=(a.wd-90)*Math.PI/180;k.ln([[x-8*Math.cos(an),y-8*Math.sin(an)],[x+10*Math.cos(an),y+10*Math.sin(an)]],k.H,1.6);k.circ(x+10*Math.cos(an),y+10*Math.sin(an),2,k.H);}k.t('N',x,y-24,6,k.A,{a:'c',w:10});}
}
function dzDuration(ms){let s=Math.max(0,Math.floor(ms/1000));return[String(Math.floor(s/3600)).padStart(2,'0'),String(Math.floor(s/60)%60).padStart(2,'0'),String(s%60).padStart(2,'0')].join(':')}
function dzScene(k,type,x,y,w,h,seed=0){if(type==='ring')dzRing(k,x,y,w,h,seed);else if(type==='envelope')dzPhase(k,x,y,w,h,seed);else if(type==='radio')dzSpectrum(k,x,y,w,h,seed);else if(type==='switch')dzNetwork(k,x,y,w,h,seed);else if(type==='shelter')dzShelter(k,x,y,w,h,seed);else dzFacility(k,x,y,w,h,({door:0,air:1,ration:2,shutter:3,archive:5})[type]||0);}
function dzPaint(raw,W,H,d){
  const k=dzSafe(raw),small=W<200,big=H>200,seed=dzSlot(d),mode=d.mode;
  dzFrame(k,W,H,d);if(mode==='transmission'){k.rect(10,31,W-20,big?104:96,k.a(T.headBg,.17),k.H,.6);k.stripes(10,31,W-20,3,k.H,8);k.rect(10,big?134:124,W-20,2,k.H);}
  const end=(text,y=H-34)=>{k.stripes(12,y,W-24,3,k.L,6);k.t(text,12,y+5,7,k.L,{w:W-24});};
  if(mode==='status'){
    const wx=d.wx||{},ev=d.ev;dzRing(k,small?7:9,small?33:31,small?87:130,small?81:119,seed,wx.temp!=null?wx.temp+'°':'--',wx.temp!=null?'SURFACE':'NO DATA');
    if(small){k.t('S9',109,34,25,k.L,{w:49,f:'disp'});k.t('RESERVE',106,65,7,k.S,{w:52});k.t(d.batt!=null?pct(d.batt):'--',106,77,19,k.I,{w:52,f:'bold'});k.segs(105,101,53,5,8,d.batt||0,k.A,k.ia(.1),1);k.para(ev?ev.title:'Await further instruction.',12,116,W-24,12,k.I,'disp',2);}
    else{
      const xx=149,ww=W-161;dzChip(k,ev?.active?'DUTY IN PROGRESS':'AWAIT ASSIGNMENT',xx,35,ww,k.H);k.para(ev?ev.title:'Await further instruction.',xx,55,ww,16,k.I,'disp',2);
      k.t(ev?shortT(ev.start)+' / '+shortT(ev.end):'NO CALENDAR ORDER',xx,99,9,k.L,{w:ww});
      const rows=[['FEELS',wx.feels!=null?wx.feels+'°':'--',wx.feels!=null&&wx.hi>wx.lo?(wx.feels-wx.lo)/(wx.hi-wx.lo):0],['RESERVE',d.batt!=null?pct(d.batt):'--',d.batt||0]];rows.forEach(([l,v,f],i)=>{const y=116+i*16;k.t(l,xx,y,8,k.S,{w:48});k.segs(xx+51,y+2,ww-96,5,12,f,i?k.A:k.H,k.ia(.1),1);k.t(v,W-12,y,9,k.I,{w:43,a:'r',f:'bold'});});
      if(big){dzChip(k,'PERIMETER AUTHORITY',12,159,146,k.L);k.t('ACCESS IS CONDITIONAL',W-12,161,8,k.L,{a:'r',w:178});dzHexField(k,12,179,160,87,seed);k.t('09',207,178,50,k.I,{w:130,f:'disp'});k.t('CLEARANCE / REVIEW',197,238,10,k.H,{w:W-211,f:'bold'});dzRule(k,12,277,W-24,'SURFACE CONDITION',wx.cond||'UNAVAILABLE');dzRule(k,12,300,W-24,'HIGH / LOW',wx.hi!=null&&wx.lo!=null?wx.hi+'° / '+wx.lo+'°':'UNAVAILABLE');k.t('Your presence has been recorded.',12,328,14,k.I,{w:W-24,f:'disp'});end('SIM / PERIMETER RECORD. PERSONAL READINGS ABOVE.');}
    }
  }else if(mode==='shift'){
    const ev=d.ev,now=+(d.now||new Date()),target=ev?(ev.active?+ev.end:+ev.start):null;
    k.t(ev?(ev.active?'ACTIVE DUTY / RELEASE IN':'ASSIGNMENT BEGINS IN'):'NO ASSIGNMENT / STAND BY',12,34,9,k.L,{w:W-24,f:'bold'});k.para(ev?ev.title:'Await further instruction.',12,48,W-24,small?12:big?18:14,k.I,'disp',2);
    const l=dzTimerLayout(W,H);k.poly([[10,l.y-3],[W-20,l.y-3],[W-10,l.y+7],[W-10,l.y+l.fs*1.25],[20,l.y+l.fs*1.25],[10,l.y+l.fs*1.25-10]],k.a(T.headBg,.15),k.H,1.5);k.poly([[10,l.y-5],[W-24,l.y-5],[W-12,l.y+4],[10,l.y+4]],k.H);k.poly([[10,l.y+l.fs*1.25-6],[17,l.y+l.fs*1.25],[W-10,l.y+l.fs*1.25],[W-10,l.y+l.fs*1.25+3],[10,l.y+l.fs*1.25+3]],k.H);if(!d.live)k.t(target?dzDuration(target-now):'--:--:--',l.x+3,l.y,l.fs,k.L,{w:l.w-6,f:'bold'});
    const yy=big?164:139,n=small?9:22;for(let i=0;i<n;i++){let lit=ev&&i/n<Math.max(0,(now-ev.start)/(ev.end-ev.start));k.hex(17+i*(W-34)/(n-1),yy,small?5:6,lit?k.H:k.a(T.altBg,.14),k.L,.5)}
    if(big){k.t('AUTHORIZATION SEQUENCE / SIM',12,187,9,k.L,{w:W-24});dzDutyGates(k,13,208,162,100,seed);[['01 / REQUEST','RECEIVED'],['02 / ASSIGN','RECORDED'],['03 / RELEASE','PENDING']].forEach(([a,b],i)=>{k.t(a,195,208+i*33,8,k.L,{w:W-207});k.t(b,195,219+i*33,15,i===2?k.H:k.I,{w:W-207,f:'bold'});});dzRule(k,12,319,W-24,'DUTY WINDOW',ev?shortT(ev.start)+' / '+shortT(ev.end):'UNAVAILABLE');end('NO EARLY WITHDRAWAL / OPERATIONS COPY');}
  }else if(mode==='solar'){
    const sun=d.sun||{},wx=d.wx||{},a=d.atm||{},day=sun.phase==='day';for(let q=0;q<15;q++){const pts=[];for(let i=0;i<=80;i++){const u=i/80;pts.push([12+u*(W-24),47+q*3.2+Math.sin(u*8+q*.11)*6]);}k.ln(pts,k.a(q%3?T.accent:T.altBg,.22),.55);}k.t(sun.phase?(day?'DAYLIGHT REMAINING':'NIGHT CYCLE'):'SOLAR FEED UNAVAILABLE',12,34,8,k.L,{w:W-24});k.t(sun.left!=null?pct(sun.left):'--',12,48,small?35:44,k.I,{w:116,f:'disp'});
    if(!small){k.t(day?'SUNDOWN IN':'DAWN IN',W-12,35,9,k.L,{w:130,a:'r'});k.t(sun.remaining!=null?dzDuration(sun.remaining):'--:--:--',W-12,54,27,k.L,{w:W-144,a:'r',f:'bold'});}
    const yy=small?97:106,bw=W-24;k.rect(12,yy,bw,17,k.a(T.altBg,.12),k.L,.6);if(day&&sun.left!=null)k.stripes(12,yy,bw*(1-sun.left),17,k.H,7);else if(sun.phase==='night')k.stripes(12,yy,bw,17,k.a(T.headBg,.4),7);for(let i=0;i<25;i++)k.ln([[12+bw*i/24,yy+17],[12+bw*i/24,yy+17+(i%6?3:7)]],k.L,.6);const pos=day&&sun.left!=null?Math.max(.02,Math.min(.98,1-sun.left)):null;if(pos!=null){k.hex(12+bw*pos,yy+8.5,8,k.H,k.I,1);k.ln([[12+bw*pos,yy-7],[12+bw*pos,yy]],k.A,1.2)}k.t('0%',12,yy+26,7,k.L,{w:26});k.t('PHASE ELAPSED',W/2,yy+26,7,k.L,{a:'c',w:90});k.t('100%',W-12,yy+26,7,k.L,{a:'r',w:30});
    if(big){const vals=[['SURFACE',wx.temp!=null?wx.temp+'°':'--'],['HUMIDITY',a.rh!=null?a.rh+'%':'--'],['UV INDEX',a.uv!=null?String(a.uv):'--'],['VISIBILITY',a.vis||'--'],['DEW POINT',a.dew!=null?a.dew+'°':'--'],['WIND',a.wind||(a.ws!=null?Math.round(T.units==='celsius'?a.ws*1.609:a.ws)+(T.units==='celsius'?' KM/H':' MPH'):'--')]];k.t('ATMOSPHERIC THREAT MATRIX / LOCAL WEATHER',12,154,9,k.L,{w:W-24});vals.forEach(([label,value],i)=>{const xx=12+(i%3)*115,yy=172+Math.floor(i/3)*69;k.poly([[xx+6,yy],[xx+108,yy],[xx+108,yy+54],[xx+102,yy+60],[xx,yy+60],[xx,yy+6]],k.a(T.altBg,.04),i===0?k.H:k.L,.6);k.t(label,xx+7,yy+5,8,k.L,{w:94});k.t(value,xx+7,yy+23,21,k.I,{w:64,f:'bold'});dzWeatherMark(k,xx+87,yy+34,i,wx,a);});const probs=a.probs||[];k.t('PRECIP / NEXT 12H',12,316,8,k.L,{w:130});probs.slice(0,12).forEach((p,i)=>k.rect(155+i*16,337-Math.max(1,p*.23),12,Math.max(1,p*.23),p>50?k.H:k.L));end(probs.length?'CIVIL DEFENSE / SURFACE WATCH':'FORECAST CHANNEL / NO DATA');}
  }else if(mode==='audio'){
    if(small){dzChip(k,'CIVIL BROADCAST',12,35,W-24,k.L);dzSpectrum(k,12,56,W-24,66,seed);k.t('STAY ON FREQUENCY',12,139,10,k.I,{w:W-24,f:'bold'});}
    else{k.t('STAY ON',205,34,25,k.I,{w:W-217,f:'disp'});k.t('FREQUENCY',205,63,23,k.I,{w:W-217,f:'disp'});dzSpectrum(k,12,40,179,83,seed);dzChip(k,'09 / MORALE',205,103,W-217,k.L);k.t('OPEN YOUTUBE MUSIC',205,127,8,k.A,{w:W-217});
      if(big){k.t('CARRIER ANALYSIS / SYNTHETIC TEST SIGNAL',12,158,9,k.L,{w:W-24});for(let j=0;j<10;j++){const yy=176+j*8;for(let i=0;i<65;i++){const v=Math.sin(i*.31+j*.8)*Math.cos(i*.16-j*.23);if(v>.04)k.rect(12+i*(W-24)/65,yy,4,6,v>.76?k.H:v>.5?k.A:k.a(T.altBg,.2+v*.6));}}dzRule(k,12,264,W-24,'BROADCAST AUTHORITY','CIVIL DEFENSE');dzRule(k,12,286,W-24,'REQUESTS','SUSPENDED',k.H);dzRule(k,12,308,W-24,'SILENCE','ALSO MONITORED');end('RECEIVER SIMULATION / TAP OPENS MUSIC');}
    }
  }else if(mode==='transmission'){
    dzChip(k,d.archival?'ARCHIVE':'BULLETIN',12,35,small?60:77,k.H);if(!small)k.t('COPY '+String(seed%1000).padStart(3,'0')+' / PRIORITY A',W-12,37,8,k.L,{w:190,a:'r'});
    const hh=k.para(d.text||'Remain Calm. Remain Indoors.',12,55,W-24,small?16:big?26:23,k.I,'disp',small?3:2);k.para(d.by||'DIRECTIVE ZERO / CIVIL DEFENSE',12,59+hh,W-24,7,k.S,'mono',1);
    if(!big){dzWarningField(k,12,132,W-24,15,seed);}
    else{k.t('RESTRICTION MAP / ALL SECTORS',12,139,9,k.L,{w:W-24});dzWarningField(k,12,158,W-24,103,seed);k.rect(12,270,W-24,18,k.H);k.t('RECEIPT DOES NOT IMPLY CONSENT',W/2,274,10,k.GR,{a:'c',w:W-34,f:'bold'});dzRule(k,12,299,W-24,'RECEIPT','MANDATORY',k.H);k.t('Unacknowledged does not mean unread.',12,326,15,k.I,{w:W-24,f:'disp'});end('ARCHIVE / DEPARTMENTAL ORDER / RETAIN THIS COPY');}
  }else if(mode==='instagram'){
    const n=small?1:2,cw=small?W-24:(W-32)/2,ch=big?304:118;for(let i=0;i<n;i++)dzCredential(k,12+i*(cw+8),33,cw,ch,(seed+i)%12);if(big)end('RECORDS OFFICE / IDENTITY IS A COMPARTMENT');
  }else if(mode==='youtube'){
    const n=small?1:big?4:2,cols=small?1:2,cw=(W-24-(cols-1)*8)/cols,ch=big?145:117;
    for(let i=0;i<n;i++){const id=(seed+i)%12,xx=12+i%cols*(cw+8),yy=33+Math.floor(i/cols)*154;k.rect(xx,yy,cw,ch,null,k.L,.6);k.rect(xx,yy,cw,15,k.a(T.headBg,.85));k.t('CAM '+String(id+1).padStart(2,'0')+' / FACILITY',xx+4,yy+3,8,k.I,{w:cw-8,f:'bold'});dzFacility(k,xx+5,yy+22,cw-10,ch-47,id);const scan=xx+8+(id%7)*(cw-16)/7;k.ln([[scan,yy+21],[scan,yy+ch-26]],k.a(T.headBg,.75),1);k.ln([[xx+5,yy+21],[xx+15,yy+21],[xx+15,yy+26]],k.I,.6);k.ln([[xx+cw-5,yy+ch-26],[xx+cw-15,yy+ch-26],[xx+cw-15,yy+ch-31]],k.I,.6);k.t(DZ_ROOMS[id],xx+5,yy+ch-19,10,k.L,{w:cw-10,f:'bold'});k.t('SEC '+(id+11)+' / ACCESS SEALED',xx+5,yy+ch-8,5,k.S,{w:cw-10});}if(big)end('ARCHITECTURAL RECORD / FACILITY SCHEMATIC / OPEN YOUTUBE');
  }else if(mode==='discord'){
    if(small){dzConsensus(k,12,36,W-24,91,seed);k.t('COMMAND NET / 09',12,137,11,k.I,{w:W-24,f:'bold'});}
    else{dzConsensus(k,12,35,182,big?165:104,seed);k.t('QUORUM',210,35,23,k.I,{w:W-222,f:'disp'});k.t('WITHHELD',210,64,21,k.H,{w:W-222,f:'disp'});k.t('COMMAND NET / 09',210,98,9,k.L,{w:W-222});k.t('OPEN DISCORD',210,128,9,k.A,{w:W-222});if(big){k.t('FIVE DEPARTMENTS / ONE INSTRUCTION',12,210,9,k.L,{w:W-24});['OPERATIONS','AIR HANDLING','CIVIL DEFENSE','RECORDS','COMMAND'].forEach((name,i)=>{const yy=231+i*20;k.rect(12,yy,25,15,i===seed%5?k.H:k.L);k.t('0'+(i+1),24,yy+2,9,k.GR,{a:'c',w:20,f:'bold'});k.t(name,47,yy+2,10,k.I,{w:132});for(let z=0;z<12;z++)k.rect(194+z*12,yy+3,9,9,(z+i+seed)%7===0?k.H:k.a(T.altBg,(z+i)%3?.48:.15));});end('SIMULATED ROUTING / YOUR PLACE HAS BEEN ASSIGNED');}}
  }else if(mode==='oddity'){
    k.t('FORM OE-09 / OPERATOR ASSESSMENT',12,34,8,k.L,{w:W-24});dzRibbon(k,15,small?53:55,small?W-30:177,big?173:69,seed);
    if(!small){k.t('SYNCHRONIZATION',207,53,8,k.L,{w:W-219});k.t((71+seed%27)+'.'+seed%10+'%',207,66,36,k.I,{w:W-219,f:'disp'});k.t('HESITATIONS / '+seed%8,207,114,9,k.H,{w:W-219});if(big){dzBand(k,207,143,W-219,58,22,seed,k.L);k.t('RESPONSE RETENTION',207,208,8,k.L,{w:W-219});}}
    k.t(DZ_EVAL.verdict[seed%10],12,big?244:134,small?12:14,k.I,{w:W-24,f:'bold'});
    if(big){dzRule(k,12,273,W-24,'TEARS',DZ_EVAL.tears[seed%10]);dzRule(k,12,294,W-24,'ASSIGNED',DZ_EVAL.shelter[seed%10]);k.t(DZ_EVAL.notes[seed%10],12,319,16,k.I,{w:W-24,f:'disp'});end('SIM / EVALUATION COPY / NOT A HEALTH ASSESSMENT');}
  }else if(mode==='feeds'){
    const count=small?1:2,cw=small?W-24:(W-32)/2;
    for(let s=0;s<count;s++){const xx=12+s*(cw+8);dzChip(k,s?'CIVILIAN CHATTER':'VISUAL RECON',xx,34,cw,s?k.L:k.H);const yy=big?56:55,hh=big?139:62;
      if(s)dzChannelLoom(k,xx,yy,cw,hh,seed+71);else dzFan(k,xx,yy,cw,hh,seed);
      k.t(s?'OPEN INSTAGRAM':'OPEN YOUTUBE',xx,big?203:124,9,k.A,{w:cw,f:'bold'});k.t(s?'OBSERVE / COMPARE / COMPLY':'INFORMATION IS AMMUNITION',xx,big?220:141,6,k.L,{w:cw});
      if(big){['ADMITTED','WITHHELD','REVIEW'].forEach((l,i)=>{const y=241+i*29;k.t(l,xx,y,8,k.L,{w:cw*.7});k.t(String((seed*17+i*11+s*7)%96),xx+cw,y,10,k.I,{a:'r',w:30,f:'bold'});k.segs(xx,y+14,cw,5,20,((seed+i*3+s)%10)/10,i===2?k.H:k.L,k.ia(.1),1);});}}
    if(big)end('FEED ACTIVITY / SIMULATED ANALYSIS / TAP A CHANNEL');
  }else if(mode==='game'){
    const st=d.st||{},inp=d.inp||{},v=st.vseed||0;k.t('SHELTER '+(st.shelter||9),12,34,small?19:25,k.I,{w:small?W-24:170,f:'disp'});if(!small){k.t('DAY '+(st.day||1)+' / '+(st.pop??'--')+' ADMITTED',W-12,39,11,k.L,{w:165,a:'r',f:'bold'});}dzShelterSection(k,12,small?61:70,small?W-24:big?W-24:190,big?153:65,v);
    const xx=big||small?12:218,yy=big?239:small?132:72,bw=W-xx-12;[['POWER',st.power,k.A],['FOOD',st.food,k.L],['MORALE',st.morale,k.L],['THREAT',st.threat,k.H]].slice(0,small?1:4).forEach(([l,n,c],i)=>{let y=yy+i*(big?24:18);k.t(l,xx,y,8,k.S,{w:bw*.7});k.t(n==null?'--':String(Math.round(n)),xx+bw,y,10,c,{a:'r',w:35,f:'bold'});k.segs(xx,y+12,bw,4,big?40:18,(n||0)/100,c,k.ia(.1),1);});if(big)end(inp.charging?'GRID RESTORED / CHARGING':'CHARGE THE PHONE TO RESTORE THE GRID');
  }
  dzSecondary(k,W,H,d);
}
function dzPoster(raw,W,H,d){
  const k=dzSafe(raw),home=d.mode==='home',n=d.index||0,kn=d.knobs||{},detail=kn.details!==false,top=home?Math.max(170,H*.205):Math.max(258,H*.305),bottom=H-108,span=bottom-top;
  k.rect(0,0,W,H,k.GR);const x=21,w=W-42;
  if(detail&&kn.texture!==0)dzTerminalBed(k,x-4,top,w+8,span,n+101,home?n+2:n,.9*(kn.texture??1));
  k.t('DIRECTIVE ZERO // OPERATOR TERMINAL',x,home?28:top-23,9,k.L,{w:W-90,f:'bold'});k.t('D-00',W-x,home?28:top-23,10,k.L,{w:45,a:'r',f:'bold'});
  if((kn.glow??1)>0)k.rect(x,top+27,w,span-34,k.a(T.altBg,.035*(kn.glow??1)));if(detail){for(let yy=top;yy<bottom&&kn.texture!==0;yy+=3)k.rect(x-7,yy,w+14,.45,k.ia(.045*(kn.texture??1)));for(let yy=top;yy<bottom;yy+=6){k.ln([[11,yy],[yy%4?14:18,yy]],k.L,.6);k.ln([[W-11,yy],[W-15,yy]],k.L,.6);}}
  k.poly([[x-5,top+8],[x+3,top],[W-x,top],[W-x+5,top+8],[W-x+5,bottom-8],[W-x-3,bottom],[x+3,bottom],[x-5,bottom-8]],null,k.a(T.altBg,.5),.8);
  if(!home){
    dzChip(k,'NOTICE',x,top+6,69,k.H);k.t('REF. D-00 / CYCLE '+(283+n),W-x,top+8,8,k.L,{a:'r',w:225});
    const phrase=d.phrase||['Remain','Calm'],fs=span*.155;k.t(d.upper===false?phrase[0]:phrase[0].toUpperCase(),x,top+29,fs,k.I,{w,f:'disp'});k.t(d.upper===false?phrase[1]:phrase[1].toUpperCase(),x,top+29+fs*1.04,fs,k.I,{w,f:'disp'});
    const yy=top+span*.405;k.rect(x,yy,w,3,k.L);k.rect(x,yy,44,3,k.H);k.t(['ACTIVE TIME REMAINING','AUTHORIZATION PENDING','BLACKOUT SEQUENCE','RECALL WINDOW'][n%4],x,yy+13,10,k.L,{w:230});k.t(['04:59:59','00:09:14','02:18:06','00:31:00'][n%4],x,yy+29,45,k.L,{w:w*.68,f:'bold'});dzHexField(k,W-x-101,yy+13,99,66,n);k.segs(x,yy+86,w,6,34,.73,i=>i>26?k.H:k.L,k.ia(.1),2);
    const gy=yy+114+Math.max(-6,Math.min(6,(kn.shift||0)*.1)),gh=span*.15*Math.max(.75,Math.min(1.12,kn.scale||1));
    if(n%5===0)dzRibbon(k,x+4,gy,w-8,gh,n);else if(n%5===1)dzConsensus(k,x+4,gy,w-8,gh,n);else if(n%5===2)dzWarningField(k,x+4,gy,w-8,gh,n);else if(n%5===3)dzSpectrum(k,x+4,gy,w-8,gh-12,n);else dzFan(k,x+4,gy,w-8,gh,n);
    if(detail){dzRegister(k,x,gy+gh+4,w,8,n,.6);k.t(['SYNCHRONIZATION / TEST RECORD','DEPARTMENTAL CONSENSUS / SIM','SHUTTER INTERLOCK / SIM','RECALL CARRIER / TEST SIGNAL','ACQUISITION / ROUTING SIM'][n%5],x,gy-13,8,k.L,{w});const ry=bottom-57;[['INTERNAL LINK','97.2%'],['REVIEW CLASS','A / 09'],['EXCEPTIONS','00.0%']].forEach(([label,value],i)=>{let xx=x+i*w/3;k.t(label,xx,ry,8,k.S,{w:w/3-6});k.t(value,xx,ry+14,21,i===2?k.H:k.I,{w:w/3-6,f:'bold'});});}
  }else{
    const labels=['PERIMETER AUTHORITY','AIR HANDLING CONTROL','CIVIL ALLOCATION','BROADCAST COMMAND','ACCESS INTERLOCK','RECORDS / SEALED'];
    dzChip(k,'S9 / CONTROL DESK',x,top+7,116,k.H);k.t('09 / '+String(n+1).padStart(2,'0'),W-x,top+8,11,k.L,{w:95,a:'r',f:'bold'});k.t(labels[n%6],x,top+31,23,k.I,{w,f:'disp'});
    const gy=top+80,gh=span*.49,sc=Math.max(.75,Math.min(1.1,kn.scale||1)),gw=Math.min(w-12,(w-25)*sc),xx=(W-gw)/2,yy=gy+Math.max(-7,Math.min(7,(kn.shift||0)*.15));
    if(n%6===0){dzRing(k,xx,yy,gw,gh,n,'D-00','REVIEW PENDING');if(detail){k.t('ANALYSIS',x+2,yy+gh*.33,7,k.L,{w:66});k.t('PENDING',x+2,yy+gh*.33+12,9,k.H,{w:66,f:'bold'});k.t('INTERNAL',W-x-62,yy+gh*.63,7,k.L,{w:66});k.t('ACCESS',W-x-62,yy+gh*.63+12,9,k.H,{w:66,f:'bold'});}}
    else if(n%6===1)dzFacility(k,xx,yy,gw,gh,1);
    else if(n%6===2)dzConsensus(k,xx,yy,gw,gh,n);
    else if(n%6===3)dzSpectrum(k,xx,yy,gw,gh-12,n);
    else if(n%6===4)dzWarningField(k,xx,yy,gw,gh,n);
    else dzSeal(k,xx,yy,gw,gh,11);
    const ay=top+span*.68;k.rect(x,ay,w,17,k.L);k.t(['CLEARANCE IS CONDITIONAL','RECIRCULATION IS MANDATORY','NO UNASSIGNED TIME','STAY ON THIS FREQUENCY','PERMISSION MAY BE REVOKED','RETENTION IS INDEFINITE'][n%6],x+5,ay+3,11,k.GR,{w:w-10,f:'bold'});
    if(detail){dzRegister(k,x,top+59,w,12,n,.64);const values=[['REVIEW / 09','18 OF 19','PENDING'],['FILTER / 03','004 HOURS','OVERDUE'],['CARDS / 144','003 HELD','NO REPLY'],['CARRIER / 09','REQUESTS','SUSPENDED'],['BOLT / 07','OVERRIDE','SEALED'],['FILES / 284','APPEALS','WITHHELD']][n%6];['AUTHORITY','INSTRUCTION','DISPOSITION'].forEach((label,i)=>dzRule(k,x,ay+25+i*24,w,label,values[i],i===2?k.H:k.I));const ly=ay+108,lh=bottom-ly-19;if(lh>12){if(n%6===0)dzHexField(k,x,ly,w,lh,n);else if(n%6===1)dzBand(k,x,ly,w,lh,48,n,k.A);else if(n%6===2){for(let i=0;i<15;i++)k.rect(x+i*w/15,ly,(w-28)/15,lh, i%4?k.a(T.altBg,.24):k.H);}else if(n%6===3)dzPacket(k,x,ly,w,lh,n);else if(n%6===4)dzBand(k,x,ly,w,lh,33,n,k.H);else{for(let i=0;i<6;i++){k.rect(x+i*w/6,ly,w/6-5,lh,null,k.L,.6);k.t('FILE '+(283+n*8+i),x+3+i*w/6,ly+3,7,k.L,{w:w/6-10});}}}}
  }
  k.stripes(x,bottom-9,w,4,k.L,8);k.t('REMAIN CALM. REMAIN INSIDE. / SIMULATED AGENCY DOCUMENT',x,bottom+7,8,k.L,{w});
}
const THEME_PAINT = { directive: DIR, longroad: LR, nightfall: NF, grimoire: GM, deeprange: DRG, halcyon: HAL, rabbit: RB, cyber: CY, vapor: VP, nature: NA, market: MK }
Object.keys(GAMES).forEach(f => { if (THEME_PAINT[f]) { THEME_PAINT[f].game = (k, W, H, d) => GAMES[f].paint(k, W, H, d.st, d.inp); THEME_PAINT[f].gameSample = () => gameSample(f) } })

// @halcyon-paint
// @deeprange-paint
// ---------- END THEMED PAINT BLOCK ----------
// ---------- art runner: theme art as the body background, live timers laid on top ----------
async function artWidget(o) {
  const f = fam(), dm = DIMS[f] || DIMS.small, W = dm[0], H = dm[1] - 24
  const w = base(o.title, f === "small" ? null : o.right, o.alt, o.decorate)
  if (o.url) w.url = o.url
  if (o.refresh) w.refreshAfterDate = o.refresh
  if (o.halves) {
    const row = w.addStack(); row.layoutHorizontally(); row.size = new Size(W, H)
    o.halves.forEach(hf => { const s = row.addStack(); s.size = new Size(W / 2, H); s.backgroundImage = artImage(W / 2, H, hf.paint, hf.data); if (hf.url) s.url = hf.url; s.addSpacer() })
    return w
  }
  const b = w.addStack(); b.layoutVertically(); b.size = new Size(W, H)
  b.backgroundImage = artImage(W, H, o.paint, o.data)
  let y = 0
  ;(o.live || []).filter(l => l.date).sort((p, q) => p.y - q.y).forEach(l => {
    if (l.y > y) b.addSpacer(l.y - y)
    const r = b.addStack(); r.layoutHorizontally(); r.size = new Size(W, l.size * 1.3)
    if (l.a === "l") r.addSpacer(l.x); else if (l.a === "c") r.addSpacer(); else r.addSpacer()
    const dt = r.addDate(l.date); dt.applyTimerStyle(); dt.font = l.f === "disp" ? disp(l.size) : l.f === "heavy" ? Font.heavySystemFont(l.size) : Font.boldMonospacedSystemFont(l.size); dt.textColor = l.color ? new Color(l.color) : INK; dt.lineLimit = 1; dt.minimumScaleFactor = 0.6
    if (l.a === "c") { dt.centerAlignText(); r.addSpacer() } else if (l.a === "r") { dt.rightAlignText(); r.addSpacer(W - l.x) } else { r.addSpacer() }
    y = l.y + l.size * 1.3
  })
  b.addSpacer()
  return w
}
const THEMED = () => (T.frame && T.frame !== "halcyon") ? THEME_PAINT[T.frame] : null
async function batteryLevel() { try { return Device.batteryLevel() } catch (e) { return 0.8 } }
function evData(ev) { if (!ev) return null; const now = new Date(); return { title: ev.title, start: ev.startDate, end: ev.endDate, active: ev.startDate <= now } }
const LIVE = {
  directive: { shift: { x: 85, y: 56, size: 24, a: "c", f: "disp" }, solar: { x: 352, y: 17, size: 22, a: "r", f: "disp" }, solarS: { x: 158, y: 28, size: 16, a: "r", f: "disp" } },
  longroad: { shift: { x: 76, y: 56, size: 19, a: "l", f: "disp" }, solar: { x: 352, y: 17, size: 18, a: "r", f: "disp" }, solarS: { x: 160, y: 24, size: 13, a: "r", f: "disp" } },
  nightfall: { shift: { x: 85, y: 70, size: 22, a: "c", f: "bold" }, solar: { x: 354, y: 36, size: 18, a: "r", f: "bold" }, solarS: { x: 160, y: 36, size: 13, a: "r", f: "bold" } },
  grimoire: { shift: { x: 70, y: 60, size: 19, a: "l", f: "disp" }, solar: { x: 12, y: 108, size: 18, a: "l", f: "disp" }, solarS: { x: 160, y: 22, size: 13, a: "r", f: "disp" } },
  cyber: { shift: { x: 85, y: 56, size: 22, a: "c", f: "disp" }, solar: { x: 352, y: 16, size: 20, a: "r", f: "disp" }, solarS: { x: 160, y: 16, size: 14, a: "r", f: "disp" } },
  market: { shift: { x: 85, y: 32, size: 20, a: "c", f: "disp" }, solar: { x: 352, y: 15, size: 18, a: "r", f: "disp" }, solarS: { x: 160, y: 14, size: 13, a: "r", f: "disp" } },
  vapor: { shift: { x: 85, y: 58, size: 22, a: "c", f: "bold", color: "#1A1A80" }, solar: { x: 352, y: 15, size: 16, a: "r", f: "bold" }, solarS: { x: 160, y: 14, size: 12, a: "r", f: "bold" } },
  nature: { shift: { x: 140, y: 40, size: 16, a: "r", f: "disp" }, solar: { x: 352, y: 15, size: 18, a: "r", f: "disp" }, solarS: { x: 160, y: 14, size: 13, a: "r", f: "disp" } },
  rabbit: { shift: { x: 66, y: 58, size: 19, a: "l", f: "disp" }, solar: { x: 352, y: 17, size: 22, a: "r", f: "disp" }, solarS: { x: 160, y: 24, size: 14, a: "r", f: "disp" } },
  deeprange: { shift: { x: 85, y: 128, size: 0.1, a: "c", f: "heavy" }, solar: { x: 354, y: 15, size: 20, a: "r", f: "heavy" }, solarS: { x: 160, y: 22, size: 14, a: "r", f: "heavy" } }
}
LIVE.deeprange.shift = { x: 85, y: 34, size: 18, a: "c", f: "heavy" }
async function themedStatus(P) {
  const [ev, wx, batt] = await Promise.all([nextEvent(), weather(), batteryLevel()])
  return artWidget({ title: T.L.status, alt: false, url: "calshow://", decorate: (head, hc) => { txt(head, "LINK ", 9, hc); const lk = head.addDate(new Date()); lk.applyTimerStyle(); lk.font = mono(9); lk.textColor = hc },
    paint: P.status, data: { ev: evData(ev), wx, batt, now: new Date(), unit: T.unit, L: T.L } })
}
async function themedShift(P) {
  const ev = await nextEvent(), now = new Date(), d = evData(ev)
  const frac = d && d.active ? (now - d.start) / (d.end - d.start) : 0
  const spec = LIVE[T.frame].shift
  return artWidget({ title: T.L.shift, right: "LIVE", alt: true, url: "calshow://", paint: P.shift, data: { ev: d, frac, now, L: T.L },
    live: d ? [Object.assign({ date: d.active ? d.end : d.start }, spec)] : [] })
}
async function themedTx(P) {
  const f = fam(), archival = T.archive && Math.random() < 0.25, hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")
  let text, by, cls
  if (archival) { const q = ARCHIVE[Math.floor(Math.random() * ARCHIVE.length)]; text = q.t; by = q.by; cls = "ARCHIVAL // PUBLIC DOMAIN" }
  else { const s = T.slogans[Math.floor(Math.random() * T.slogans.length)] || ["Stand By", "COMMAND"]; text = s[0]; by = `${T.company.toUpperCase()} · ${s[1]}`; cls = T.classes[Math.floor(Math.random() * T.classes.length)] }
  return artWidget({ title: T.L.tx, right: `SIGNAL ${71 + Math.floor(Math.random() * 29)}%`, alt: true, refresh: new Date(Date.now() + 30 * 60 * 1000), paint: P.tx, data: { text, by, cls, hex, archival, unit: T.unit, mo: new Date().getMonth(), day: new Date().getDate() } })
}
async function themedSolar(P) {
  const f = fam(), big = f === "large", small = f === "small"
  let rise = null, set = null, atm = null
  try {
    const c = await coords()
    const j = await new Request(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&daily=sunrise,sunset&timezone=auto&forecast_days=1`).loadJSON()
    rise = new Date(j.daily.sunrise[0]); set = new Date(j.daily.sunset[0])
    if (big) {
      try {
        const k2 = await new Request(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability,visibility,uv_index,dew_point_2m&forecast_hours=12&timezone=auto&temperature_unit=${T.units}&wind_speed_unit=mph`).loadJSON()
        const hr = k2.hourly || {}, cur = k2.current || {}, first = (a) => (a && a.length) ? a[0] : null, probs = hr.precipitation_probability || []
        const vis = first(hr.visibility)
        atm = { wd: cur.wind_direction_10m != null ? cur.wind_direction_10m : null, ws: cur.wind_speed_10m != null ? cur.wind_speed_10m : null, visMi: vis != null ? vis / 1609 : null, probs, pmax: probs.length ? Math.max(...probs) : null, rh: cur.relative_humidity_2m != null ? Math.round(cur.relative_humidity_2m) : null, uv: first(hr.uv_index), vis: vis != null ? `${Math.round(vis / 1609)} MI` : null, dew: first(hr.dew_point_2m) != null ? Math.round(first(hr.dew_point_2m)) : null, wind: cur.wind_speed_10m != null ? `${Math.round(cur.wind_speed_10m)} ${compass(cur.wind_direction_10m || 0)}` : null }
      } catch (e) {}
    }
  } catch (e) {}
  const now = new Date()
  if (!rise || !set) { rise = new Date(now); rise.setHours(7, 0, 0, 0); set = new Date(now); set.setHours(19, 0, 0, 0) }
  const up = now >= rise && now < set, frac = up ? (now - rise) / (set - rise) : (now < rise ? 0 : 1)
  let target = up ? set : rise; if (!up && now >= set) { target = new Date(rise.valueOf() + 86400000) }
  const spec = LIVE[T.frame][small ? "solarS" : "solar"]
  return artWidget({ title: big ? LT.solarBig : LT.solar, right: big ? "ARRAY ONLINE" : (small ? null : "PHOTOPERIOD"), alt: false, paint: P.solar, data: { rise, set, now, up, frac, atm }, live: [Object.assign({ date: target }, spec)] })
}
function chanData(key, compact) {
  const ch = CHANNELS[key], r = seeded(key)
  const meters = ch.meters.map(([n, lo, hi]) => [n, (lo + r() * (hi - lo)) / 100])
  return { side: key === "youtube" ? "yt" : "ig", code: ch.code, line: ch.line, meters, tag: key === "youtube" ? C.feeds.yt.tag : C.feeds.ig.tag, compact }
}
async function themedFeeds(P, single) {
  const f = fam()
  if (single || f === "small") {
    const key = single || "youtube", pk = { youtube: "yt", instagram: "ig", discord: "dc" }[key] || "yt"
    return artWidget({ title: { youtube: LT.vid, instagram: LT.obs, discord: LT.dc }[key], right: C.feeds.linked, alt: key !== "youtube", url: CHANNELS[key].url, refresh: new Date(Date.now() + 30 * 60 * 1000), paint: P[pk] || P.feed, data: { seed: Math.floor(Date.now() / 1800000), now: new Date(), code: CHANNELS[key].code } })
  }
  return artWidget({ title: LT.feeds, right: C.feeds.right, alt: false, halves: [{ paint: P.feed, data: chanData("youtube", false), url: CHANNELS.youtube.url }, { paint: P.feed, data: chanData("instagram", false), url: CHANNELS.instagram.url }] })
}
async function themedAudioArt(paint) {
  const lvl = 1 + (Math.floor(Date.now() / 900000) % 5)
  return artWidget({ title: LT.audio, right: C.audio.right, alt: false, url: "youtubemusic://", paint, data: { line: AUDIO_LINES[Math.floor(Date.now() / 1800000) % AUDIO_LINES.length], lvl, phase: (Date.now() / 900000) % 6 },
    live: [{ date: new Date(), x: 352, y: 60, size: 9, a: "r", f: "bold" }] })
}
async function halcyonAudio() {
  const lvl = 1 + (Math.floor(Date.now() / 900000) % 5)
  return artWidget({ title: LT.audio, right: C.audio.right, alt: false, url: "youtubemusic://", paint: HAL.audio, data: { line: AUDIO_LINES[Math.floor(Date.now() / 1800000) % AUDIO_LINES.length], lvl, phase: (Date.now() / 900000) % 6 },
    live: [{ date: new Date(), x: 352, y: 60, size: 9, a: "r", f: "bold" }] })
}

// W-10: a game that plays itself. One turn per refresh; plugging the phone in is the only control.
async function gameWidget() {
  const f = T.frame || "halcyon", G = GAMES[f]
  if (!G) { const w = baseC(364, 170, "W-10 // GAME", null); const b = w.addStack(); b.layoutVertically(); b.setPadding(12, 14, 12, 14); txt(b, "NO GAME FOR THIS THEME YET", 8, SOFT); b.addSpacer(4); serifText(b, "Try Halcyon, Deep Range or The Long Road.", 14, 2); return w }
  let st = null, path = null, fm = null
  try { fm = FileManager.local(); path = fm.joinPath(fm.documentsDirectory(), `foundry-game-${f}.json`); if (fm.fileExists(path)) st = JSON.parse(fm.readString(path)) } catch (e) {}
  const now = Date.now()
  if (!st || st.v !== 1 || st.game !== f) st = G.init(now)
  if (G.migrate) G.migrate(st)
  const inp = { charging: false, batt: 1, hour: new Date().getHours(), busy: 0 }
  try { inp.charging = !!Device.isCharging() } catch (e) {}
  try { inp.batt = Device.batteryLevel() } catch (e) {}
  try { inp.busy = (await CalendarEvent.today([])).filter(e => !e.isAllDay).length } catch (e) {}
  const STEP = 15 * 60000, steps = st.last ? Math.min(f === "halcyon" ? 1 : 8, Math.floor((now - st.last) / STEP)) : 1
  for (let i = 0; i < steps; i++) G.step(st, inp)
  if (!st.last || (f === "halcyon" && steps > 0)) st.last = now; else if (steps > 0) st.last = Math.max(st.last + steps * STEP, now - STEP)
  try { if (fm && path) fm.writeString(path, JSON.stringify(st)) } catch (e) {}
  if (f === "halcyon" && T.hbOn) return hbWidget("game", {st, inp})
  if (f === "deeprange" && T.drOn) return drWidget("game", {st, inp})
  if (f === "directive" && T.dzOn) return dzWidget("game", {st, inp})
  if (f === "rabbit" && T.wrOn) return wrWidget("game", {st, inp})
  return artWidget({ title: G.title, right: fam() === "small" ? null : G.right(st, inp), alt: false, refresh: new Date(now + STEP), paint: (k, W, H, d) => G.paint(k, W, H, d.st, d.inp), data: { st, inp } })
}

// @halcyon-runtime
// @deeprange-runtime
// @directive-runtime
// @rabbit-runtime
const MODES = { status, shift, transmission, solar: solarWidget, audio: audioWidget, feeds: () => feedsWidget(null), youtube: () => feedsWidget("youtube"), instagram: () => feedsWidget("instagram"), discord: () => feedsWidget("discord"), oddity: oddityWidget, game: gameWidget }

if (T.frame === "halcyon" && T.hbOn) {
  for (const mode of Object.keys(HB_META)) if (mode !== "game") MODES[mode] = () => hbWidget(mode);
  MODES.allocation = () => hbWidget("shift");
  MODES.allocation_setup = hbChooseAllocation;
  MODES.radio_setup = hbChooseRadio;
}
if (T.frame === "rabbit" && T.wrOn) {
  for (const mode of Object.keys(WR_META)) if (mode !== "game") MODES[mode] = () => wrWidget(mode);
}
if (T.frame === "directive" && T.dzOn) {
  for (const mode of Object.keys(DZ_META)) if (mode !== "game") MODES[mode] = () => dzWidget(mode);
}
if (T.frame === "deeprange" && T.drOn) {
  for (const mode of Object.keys(DR_META)) if (mode !== "game") MODES[mode] = () => drWidget(mode);
}
if (config.runsInWidget) {
  Script.setWidget(await (MODES[MODE] || status)())
} else {
  const names = Object.keys(MODES)
  const a = new Alert()
  a.title = "Preview which widget?"
  names.forEach(n => a.addAction(n))
  a.addCancelAction("Cancel")
  const pick = await a.presentSheet()
  if (pick >= 0) {
    const n = names[pick]
    previewFamily = n === "shift" ? "small" : n === "solar" ? "large" : "medium"
    const wd = await MODES[n]()
    if (previewFamily === "small") await wd.presentSmall()
    else if (previewFamily === "large") await wd.presentLarge()
    else await wd.presentMedium()
  }
}
Script.complete()
