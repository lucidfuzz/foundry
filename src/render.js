function K(th) { const k = th.knobs || {}; return { scale: k.scale == null ? 1 : k.scale, shift: k.shift || 0, texture: k.texture == null ? 1 : k.texture, glow: k.glow == null ? 1 : k.glow, details: k.details !== false }; }
function seedOf(th, base) { return base + (th.seed || 0) * 7919; }
function xfBegin(ctx, th, cx, cy) { const k = K(th); ctx.save(); ctx.translate(cx, cy + k.shift); ctx.scale(k.scale, k.scale); ctx.translate(-cx, -cy); }
function centerXform(ctx, th, cx, cy, fn) { const k = K(th); ctx.save(); ctx.translate(cx, cy + k.shift); ctx.scale(k.scale, k.scale); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function hexA(hex, a) {
  const h = (hex || '#000000').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function dispWeight(fam) { const f = DISPLAY_FONTS.find(d => d[0] === fam); return f ? f[1] : 600; }

function spaced(ctx, str, x, y, size, fam, weight, sp, align, color) {
  ctx.font = `${weight} ${size}px "${fam}", ui-monospace, monospace`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'alphabetic';
  const chars = Array.from(String(str));
  const ws = chars.map(c => ctx.measureText(c).width);
  const total = ws.reduce((a, b) => a + b, 0) + sp * size * Math.max(0, chars.length - 1);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += ws[i] + sp * size; });
  return total;
}
function measureSpaced(ctx, str, size, fam, weight, sp) {
  ctx.font = `${weight} ${size}px "${fam}", ui-monospace, monospace`;
  const chars = Array.from(String(str));
  return chars.reduce((a, c) => a + ctx.measureText(c).width, 0) + sp * size * Math.max(0, chars.length - 1);
}
function seg(ctx, x1, y1, x2, y2, color, w) {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function texture(ctx, th, pxW, pxH, s) {
  const ink = th.colors.ink;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (th.texture === 'scan') {
    ctx.fillStyle = hexA(ink, 0.05 * K(th).texture);
    const step = Math.max(2, 3 * s), hgt = Math.max(1, 0.7 * s);
    for (let y = 0; y < pxH; y += step) ctx.fillRect(0, y, pxW, hgt);
  } else {
    const cell = Math.max(2, Math.round(3 * s));
    const pc = document.createElement('canvas');
    pc.width = cell; pc.height = cell;
    const p = pc.getContext('2d');
    p.fillStyle = hexA(ink, 0.14 * K(th).texture);
    p.beginPath(); p.arc(cell / 2, cell / 2, Math.max(0.5, 0.62 * s), 0, Math.PI * 2); p.fill();
    ctx.fillStyle = ctx.createPattern(pc, 'repeat');
    ctx.fillRect(0, 0, pxW, pxH);
  }
  ctx.restore();
}

function ground(ctx, th, Hl, cx, cy, glowR, pxW, pxH, s) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  g.addColorStop(0, hexA(c.glow, Math.min(1, (th.motif === 'radar' ? 0.28 : 0.55) * K(th).glow)));
  g.addColorStop(0.55, hexA(c.glow, Math.min(1, (th.motif === 'radar' ? 0.1 : 0.22) * K(th).glow)));
  g.addColorStop(1, hexA(c.glow, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = hexA(c.ink, 0.07); ctx.lineWidth = 0.6;
  ctx.beginPath();
  for (let y = 2; y < Hl; y += 39) { ctx.moveTo(0, y); ctx.lineTo(390, y); }
  for (let x = 0; x < 390; x += 39) { ctx.moveTo(x, 0); ctx.lineTo(x, Hl); }
  ctx.stroke();
  texture(ctx, th, pxW, pxH, s);
}

function rulers(ctx, th, y0, y1) {
  ctx.strokeStyle = hexA(th.colors.ink, 0.45); ctx.lineWidth = 0.7; ctx.beginPath();
  for (let y = y0; y <= y1; y += 20) { const w = y % 100 === 0 ? 10 : 5; ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.moveTo(390, y); ctx.lineTo(390 - w, y); }
  ctx.stroke();
}

function marks(ctx, th, pts) {
  const ink = th.colors.ink;
  pts.forEach(([x, y]) => {
    ctx.strokeStyle = ink; ctx.lineWidth = 0.8;
    if (th.marks === 'bracket') {
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 3); ctx.lineTo(x - 8, y - 8); ctx.lineTo(x - 3, y - 8);
      ctx.moveTo(x + 3, y - 8); ctx.lineTo(x + 8, y - 8); ctx.lineTo(x + 8, y - 3);
      ctx.moveTo(x - 8, y + 3); ctx.lineTo(x - 8, y + 8); ctx.lineTo(x - 3, y + 8);
      ctx.moveTo(x + 3, y + 8); ctx.lineTo(x + 8, y + 8); ctx.lineTo(x + 8, y + 3);
      ctx.stroke();
      ctx.fillStyle = th.colors.accent; ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    } else {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.stroke();
      seg(ctx, x - 9, y, x + 9, y, ink, 0.8); seg(ctx, x, y - 9, x, y + 9, ink, 0.8);
    }
  });
}

function brackets(ctx, th, cx, cy, box, arm, chamfer) {
  ctx.strokeStyle = th.colors.ink; ctx.lineWidth = 1.4;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
    const x = cx + sx * box, y = cy + sy * box;
    ctx.beginPath();
    if (chamfer) {
      ctx.moveTo(x, y - sy * arm); ctx.lineTo(x, y - sy * 6); ctx.lineTo(x - sx * 6, y); ctx.lineTo(x - sx * arm, y);
    } else {
      ctx.moveTo(x, y - sy * arm); ctx.lineTo(x, y); ctx.lineTo(x - sx * arm, y);
    }
    ctx.stroke();
  });
}

function globeArt(ctx, th, cx, cy, R, RING, BOX) {
  const ink = th.colors.ink;
  seg(ctx, 0, cy, 390, cy, hexA(ink, 0.35), 0.7);
  seg(ctx, cx, cy - RING - 14, cx, cy + RING + 14, hexA(ink, 0.35), 0.7);
  ctx.strokeStyle = hexA(ink, 0.4); ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(cx, cy, RING, 0, Math.PI * 2); ctx.stroke();
  for (let a = 0; a < 360; a += 5) {
    const r = a * Math.PI / 180, ln = a % 30 === 0 ? 9 : 4;
    seg(ctx, cx + RING * Math.cos(r), cy + RING * Math.sin(r), cx + (RING - ln) * Math.cos(r), cy + (RING - ln) * Math.sin(r), hexA(ink, a % 30 === 0 ? 0.7 : 0.4), 0.7);
  }
  brackets(ctx, th, cx, cy, BOX, 20, false);
  const orx = RING * 1.25, ory = RING * 0.33;
  [-24, 24].forEach(t => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * Math.PI / 180);
    ctx.setLineDash([3, 4]); ctx.strokeStyle = hexA(ink, 0.45); ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.ellipse(0, 0, orx, ory, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  });
  ctx.setLineDash([]);
  [[-24, 200], [-24, 340], [24, 20], [24, 160]].forEach(([tl, td]) => {
    const a = tl * Math.PI / 180, b = td * Math.PI / 180, ex = orx * Math.cos(b), ey = ory * Math.sin(b);
    ctx.fillStyle = ink; ctx.fillRect(cx + ex * Math.cos(a) - ey * Math.sin(a) - 2.5, cy + ex * Math.sin(a) + ey * Math.cos(a) - 2.5, 5, 5);
  });
  ctx.strokeStyle = hexA(ink, 0.7); ctx.lineWidth = 1.05; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 0.75;
  for (let k = -3; k <= 3; k++) {
    const f = k * Math.PI / 8, rx = R * Math.cos(f);
    ctx.beginPath(); ctx.ellipse(cx, cy + R * Math.sin(f) * 0.97, rx, rx * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const rx = Math.max(0.5, R * Math.abs(Math.cos(i * Math.PI / 6 + 0.35)));
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = ink; ctx.fillRect(cx - 4, cy - 4, 8, 8);
  seg(ctx, cx, cy - RING - 18, cx, cy - RING - 10, ink, 1.4); seg(ctx, cx, cy + RING + 10, cx, cy + RING + 18, ink, 1.4);
}

function radarArt(ctx, th, cx, cy, R, RING, BOX) {
  const ink = th.colors.ink, acc = th.colors.accent, glow = th.colors.glow;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const a0 = -110, a1 = -28, steps = 28;
  for (let i = 0; i < steps; i++) {
    const s0 = (a0 + (a1 - a0) * i / steps) * Math.PI / 180, s1 = (a0 + (a1 - a0) * (i + 1) / steps) * Math.PI / 180;
    ctx.fillStyle = hexA(glow, 0.28 * Math.pow((i + 1) / steps, 2));
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, s0, s1); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  const le = a1 * Math.PI / 180;
  seg(ctx, cx, cy, cx + R * Math.cos(le), cy + R * Math.sin(le), hexA(glow, 0.95), 1.4);
  ctx.strokeStyle = hexA(ink, 0.75); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([2, 4]); ctx.strokeStyle = hexA(ink, 0.4); ctx.lineWidth = 0.8;
  [0.33, 0.66].forEach(f => { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke(); });
  ctx.setLineDash([]);
  seg(ctx, cx - R, cy, cx + R, cy, hexA(ink, 0.35), 0.7); seg(ctx, cx, cy - R, cx, cy + R, hexA(ink, 0.35), 0.7);
  seg(ctx, 0, cy, cx - RING - 4, cy, hexA(ink, 0.3), 0.7); seg(ctx, cx + RING + 4, cy, 390, cy, hexA(ink, 0.3), 0.7);
  ctx.strokeStyle = hexA(ink, 0.4); ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(cx, cy, RING, 0, Math.PI * 2); ctx.stroke();
  for (let a = 0; a < 360; a += 5) {
    const r = (a - 90) * Math.PI / 180, ln = a % 30 === 0 ? 9 : 4;
    seg(ctx, cx + RING * Math.cos(r), cy + RING * Math.sin(r), cx + (RING - ln) * Math.cos(r), cy + (RING - ln) * Math.sin(r), hexA(ink, a % 30 === 0 ? 0.8 : 0.4), 0.7);
  }
  ['000', '090', '180', '270'].forEach((lab, i) => {
    const r = (i * 90 - 90) * Math.PI / 180, rr = RING - 17;
    spaced(ctx, lab, cx + rr * Math.cos(r), cy + rr * Math.sin(r) + 2.5, 6.5, th.fonts.mono, 400, 0.1, 'center', hexA(ink, 0.8));
  });
  [[0.55, -62], [0.82, -40], [0.38, 205]].forEach(([d, ang]) => {
    const r = ang * Math.PI / 180, x = cx + R * d * Math.cos(r), y = cy + R * d * Math.sin(r);
    ctx.fillStyle = hexA(acc, 0.25); ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
  });
  { const r = 118 * Math.PI / 180, x = cx + R * 0.6 * Math.cos(r), y = cy + R * 0.6 * Math.sin(r);
    ctx.strokeStyle = glow; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy - 7); ctx.lineTo(cx + 5.5, cy + 6); ctx.lineTo(cx, cy + 3); ctx.lineTo(cx - 5.5, cy + 6); ctx.closePath(); ctx.fill();
  brackets(ctx, th, cx, cy, BOX, 20, true);
  seg(ctx, cx, cy - RING - 18, cx, cy - RING - 10, acc, 1.6); seg(ctx, cx, cy + RING + 10, cx, cy + RING + 18, ink, 1.4);
}

function sideBlock(ctx, th, x, y, lines, size, align) {
  if (!K(th).details) return;
  lines.forEach((l, i) => spaced(ctx, l, x, y + i * size * 1.35, size, th.fonts.mono, 400, 0.14, align, th.colors.ink));
}

function dataBlock(ctx, th, x, y) {
  if (!K(th).details) return;
  const ink = th.colors.ink;
  if (th.motif === 'radar') {
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i < 6 ? ink : hexA(ink, 0.25); ctx.fillRect(x + i * 4.5, y, 3, 14); }
    ctx.fillStyle = th.colors.accent; ctx.fillRect(x, y + 18, 35, 2);
    return;
  }
  const bits = [1,0,1,1,0,1, 0,1,1,0,1,0, 1,1,0,0,1,1, 0,0,1,1,0,1, 1,0,0,1,1,0, 1,1,1,0,0,1];
  ctx.fillStyle = ink;
  bits.forEach((b, i) => { if (b) ctx.fillRect(x + (i % 6) * 4.5, y + Math.floor(i / 6) * 4.5, 3.6, 3.6); });
}

function hatchStrip(ctx, th, x, y, w) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, 5); ctx.clip();
  ctx.strokeStyle = hexA(th.colors.ink, 0.55); ctx.lineWidth = 2;
  ctx.beginPath();
  if (th.motif === 'radar') { for (let i = x; i < x + w; i += 8) { ctx.moveTo(i, y); ctx.lineTo(i + 3, y + 2.5); ctx.lineTo(i, y + 5); } }
  else { for (let i = x - 6; i < x + w + 6; i += 6) { ctx.moveTo(i, y + 5); ctx.lineTo(i + 5, y); } }
  ctx.stroke(); ctx.restore();
}

function ticker(ctx, th, x, y, rot, text, size) {
  if (!K(th).details) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  spaced(ctx, text, 0, size, size, th.fonts.mono, 400, 0.3, 'left', hexA(th.colors.ink, 0.8));
  ctx.restore();
}

function logo(ctx, th, x, y) {
  ctx.strokeStyle = th.colors.ink; ctx.lineWidth = 1.2;
  if (th.motif === 'radar') {
    ctx.beginPath(); ctx.moveTo(x - 6.5, y + 4); ctx.lineTo(x, y - 4); ctx.lineTo(x + 6.5, y + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 6.5, y + 8); ctx.lineTo(x, y); ctx.lineTo(x + 6.5, y + 8); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2); ctx.stroke(); seg(ctx, x, y - 6.5, x, y + 6.5, th.colors.ink, 1.2);
  }
}

function wrapLines(ctx, text, maxW, size, fam, sp, maxLines) {
  const words = String(text).split(/\s+/); const out = []; let cur = '';
  words.forEach(w => {
    const t = cur ? cur + ' ' + w : w;
    if (measureSpaced(ctx, t, size, fam, 400, sp) > maxW && cur) { out.push(cur); cur = w; } else cur = t;
  });
  if (cur) out.push(cur);
  return out.slice(0, maxLines);
}

function drawWallpaper(canvas, th, mode, phraseIdx) {
  const W = canvas.width, H = canvas.height, s = W / 390, Hl = H / s;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.save(); ctx.scale(s, s);
  if (hbOn(th)) { hbWallpaper(ctx, th, Hl, mode, phraseIdx || 0); ctx.restore(); return; }
  if (th.motif === 'alert') { drawAlert(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'map') { drawMap(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'night') { drawNight(ctx, th, Hl, mode, phraseIdx); ctx.restore(); return; }
  if (th.motif === 'rabbit') { drawRabbit(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'neon') { drawNeon(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'market') { drawMarket(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'vapor') { drawVapor(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'botanical') { drawBotanical(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'orbital') { if (drOn(th)) drWallpaper(ctx, th, Hl, mode, phraseIdx || 0); else if (mode === 'home') drawOrbitalHome(ctx, th, Hl, W, H, s, phraseIdx); else drawOrbital(ctx, th, Hl, mode, phraseIdx, W, H, s); ctx.restore(); return; }
  if (th.motif === 'grimoire') { drawGrimoire(ctx, th, Hl, mode, phraseIdx); ctx.restore(); return; }
  const T = th.text, ink = th.colors.ink, mono = th.fonts.mono;
  const art = th.motif === 'radar' ? radarArt : globeArt;
  if (mode === 'lock') {
    const CX = 195, CY = 470;
    ground(ctx, th, Hl, CX, CY, 190, W, H, s);
    rulers(ctx, th, 260, Hl - 44);
    logo(ctx, th, 30, 266);
    spaced(ctx, T.headL[0] || '', 42, 264, 7.5, mono, 400, 0.12, 'left', ink);
    spaced(ctx, T.headL[1] || '', 42, 274.5, 7.5, mono, 400, 0.12, 'left', ink);
    spaced(ctx, T.headR[0] || '', 368, 264, 7.5, mono, 400, 0.12, 'right', ink);
    spaced(ctx, T.headR[1] || '', 368, 274.5, 7.5, mono, 400, 0.12, 'right', ink);
    if (K(th).details) {
    T.readL.forEach((l, i) => spaced(ctx, l, 22, 296 + i * 9, 6.2, mono, 400, 0.14, 'left', hexA(ink, 0.9)));
    T.readR.forEach((l, i) => spaced(ctx, l, 368, 296 + i * 9, 6.2, mono, 400, 0.14, 'right', hexA(ink, 0.9)));
    }
    centerXform(ctx, th, CX, CY, () => art(ctx, th, CX, CY, 96, 120, 128));
    spaced(ctx, T.clock, CX, 327, 6.8, mono, 400, 0.16, 'center', hexA(ink, 0.95));
    sideBlock(ctx, th, 26, 450, T.sideL, 7.2, 'left');
    sideBlock(ctx, th, 364, 450, T.sideR, 7.2, 'right');
    dataBlock(ctx, th, 296, 360);
    sideBlock(ctx, th, 22, 552, T.cornerL, 6.4, 'left');
    sideBlock(ctx, th, 368, 552, T.cornerR, 6.4, 'right');
    ticker(ctx, th, 14, 600, -Math.PI / 2, T.tickerL, 5.8);
    ticker(ctx, th, 376, 330, Math.PI / 2, T.tickerR, 5.8);
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const fam = th.fonts.display, wgt = dispWeight(fam);
    const l1 = th.upper ? ph[0].toUpperCase() : ph[0], l2 = th.upper ? ph[1].toUpperCase() : ph[1];
    const wmax = Math.max(measureSpaced(ctx, l1, 46, fam, wgt, -0.02), measureSpaced(ctx, l2, 46, fam, wgt, -0.02), 1);
    const size = Math.min(46, 46 * 346 / wmax);
    spaced(ctx, l1, 22, 652, size, fam, wgt, -0.02, 'left', ink);
    spaced(ctx, l2, 22, 652 + size * 0.98, size, fam, wgt, -0.02, 'left', ink);
    const fy = Math.max(716, 652 + size * 0.98 + 22);
    if (K(th).details) wrapLines(ctx, T.fine, 346, 5.6, mono, 0.03, 3).forEach((ln, i) => spaced(ctx, ln, 22, fy + i * 9, 5.6, mono, 400, 0.03, 'left', hexA(ink, 0.85)));
    seg(ctx, 112, Hl - 44, 278, Hl - 44, hexA(ink, 0.6), 0.8);
    spaced(ctx, T.foot, CX, Hl - 31, 6.6, mono, 400, 0.2, 'center', ink);
  } else {
    const CX = 195, CY = 410;
    ground(ctx, th, Hl, CX, CY, 210, W, H, s);
    rulers(ctx, th, 60, Hl - 44);
    marks(ctx, th, [[22, 58], [368, 58], [22, 700], [368, 700]]);
    centerXform(ctx, th, CX, CY, () => art(ctx, th, CX, CY, 112, 140, 150));
    spaced(ctx, T.clock, CX, 254.5, 7.6, mono, 400, 0.16, 'center', ink);
    sideBlock(ctx, th, 18, 392.5, T.sideL, 8, 'left');
    sideBlock(ctx, th, 372, 392.5, T.sideR, 8, 'right');
    dataBlock(ctx, th, 300, 290);
    sideBlock(ctx, th, 22, 520.5, T.cornerL, 7, 'left');
    sideBlock(ctx, th, 368, 520.5, T.cornerR, 7, 'right');
    hatchStrip(ctx, th, 22, 566, 346);
    spaced(ctx, T.caption, CX, 585.5, 7, mono, 400, 0.3, 'center', ink);
    ticker(ctx, th, 15, 352, -Math.PI / 2, T.tickerL, 6.5);
    ticker(ctx, th, 375, 76, Math.PI / 2, T.tickerR, 6.5);
  }
  ctx.restore();
}

function drawIcon(canvas, th, app, idx) {
  const S = canvas.width, k = S / 1024, ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, S, S);
  ctx.save(); ctx.scale(k, k);
  const c = th.colors, mono = th.fonts.mono, num = String(idx + 1).padStart(2, '0'), code = (th.codes[app] || app.slice(0, 3)).toUpperCase();
  const set = (th.glyphs && GLYPHSETS[th.glyphs]) || GLYPHS;
  const glyph = new Path2D(set[app] || GLYPHS[app]);
  if (hbOn(th)) { hbIcon(ctx, th, glyph, code); ctx.restore(); return; }
  if (th.iconStyle === 'pearl') {
    drawPearlIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'neon') { drawNeonIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'contract') { drawContractIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'win95') { drawWin95Icon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'leaf') { drawLeafIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'tracker') {
    drawTrackerIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'visor') {
    drawVisorIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'gilded') {
    drawGildedIcon(ctx, th, glyph, num, code, idx);
  } else if (th.iconStyle === 'woodcut') {
    drawWoodcutIcon(ctx, th, glyph, num, code);
  } else if (th.iconStyle === 'hex') {
    ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = hexA(c.ink, 0.05); for (let y = 0; y < 1024; y += 12) ctx.fillRect(0, y, 1024, 3);
    hexPath(ctx, 512, 500, 400); ctx.fillStyle = hexA(c.panel, 0.95); ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 14; ctx.stroke();
    hexPath(ctx, 512, 500, 360); ctx.strokeStyle = hexA(c.accent, 0.35); ctx.lineWidth = 4; ctx.stroke();
    ctx.save(); ctx.translate(320, 308); ctx.scale(16, 16); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
    spaced(ctx, num, 120, 130, 60, mono, 700, 0.06, 'left', c.accent);
    spaced(ctx, code, 904, 960, 60, mono, 700, 0.12, 'right', c.accent);
    ctx.fillStyle = c.alert || '#E3242B'; ctx.fillRect(120, 924, 120, 22);
  } else if (th.iconStyle === 'chamfer') {
    ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = hexA(c.ink, 0.06); for (let y = 0; y < 1024; y += 12) ctx.fillRect(0, y, 1024, 3);
    const m = 104, ch = 90;
    ctx.beginPath();
    ctx.moveTo(m + ch, m); ctx.lineTo(1024 - m - ch, m); ctx.lineTo(1024 - m, m + ch); ctx.lineTo(1024 - m, 1024 - m - ch);
    ctx.lineTo(1024 - m - ch, 1024 - m); ctx.lineTo(m + ch, 1024 - m); ctx.lineTo(m, 1024 - m - ch); ctx.lineTo(m, m + ch); ctx.closePath();
    ctx.fillStyle = hexA(c.panel, 0.9); ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 12; ctx.stroke();
    ctx.save(); ctx.translate(272, 272); ctx.scale(20, 20); ctx.fillStyle = c.accent; ctx.fill(glyph, 'evenodd'); ctx.restore();
    spaced(ctx, num, 196, 210, 54, mono, 400, 0.1, 'left', c.ink);
    spaced(ctx, code, 828, 870, 54, mono, 400, 0.1, 'right', c.ink);
    ctx.fillStyle = c.glow; ctx.fillRect(196, 826, 150, 14);
  } else {
    ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = hexA(c.ink, 0.14);
    for (let y = 6; y < 1024; y += 12) for (let x = 6; x < 1024; x += 12) ctx.fillRect(x - 1.8, y - 1.8, 3.6, 3.6);
    ctx.fillStyle = hexA('#FFFFFF', 0.45); ctx.fillRect(104, 104, 816, 816);
    ctx.fillStyle = hexA(c.panel, 0.55); ctx.fillRect(104, 104, 816, 816);
    ctx.strokeStyle = c.ink; ctx.lineWidth = 12; ctx.strokeRect(104, 104, 816, 816);
    ctx.lineWidth = 8; ctx.beginPath();
    ctx.moveTo(104, 236); ctx.lineTo(64, 236); ctx.moveTo(236, 104); ctx.lineTo(236, 64);
    ctx.moveTo(920, 788); ctx.lineTo(960, 788); ctx.moveTo(788, 920); ctx.lineTo(788, 960); ctx.stroke();
    ctx.save(); ctx.translate(272, 272); ctx.scale(20, 20); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
    spaced(ctx, num, 148, 200, 54, mono, 500, 0.1, 'left', c.ink);
    spaced(ctx, code, 876, 874, 54, mono, 500, 0.1, 'right', c.ink);
    ctx.fillStyle = hexA(c.ink, 0.75); ctx.fillRect(148, 828, 200, 16);
  }
  ctx.restore();
}

// ---------- ALERT motif (defense-terminal look) ----------
function compText(ctx, str, x, y, size, fam, weight, sx, color, align) {
  ctx.save();
  ctx.font = `${weight} ${size}px "${fam}", Georgia, serif`;
  const w = ctx.measureText(str).width * sx;
  const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  ctx.translate(x0, y); ctx.scale(sx, 1); ctx.fillStyle = color; ctx.fillText(str, 0, 0);
  ctx.restore();
  return w;
}
function compWidth(ctx, str, size, fam, weight, sx) { ctx.font = `${weight} ${size}px "${fam}", Georgia, serif`; return ctx.measureText(str).width * sx; }
function hexPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i + Math.PI / 6; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath();
}
function alertRed(th) { return th.colors.alert || '#E3242B'; }

function alertGround(ctx, th, Hl, pxW, pxH, s) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  { const gg = ctx.createRadialGradient(195, Hl * 0.5, 20, 195, Hl * 0.5, 380); gg.addColorStop(0, hexA(c.accent, Math.min(0.5, 0.09 * K(th).glow))); gg.addColorStop(1, hexA(c.accent, 0)); ctx.fillStyle = gg; ctx.fillRect(0, 0, 390, Hl) }
  ctx.strokeStyle = hexA(c.accent, 0.05); ctx.lineWidth = 0.6; ctx.beginPath();
  for (let y = 0; y < Hl; y += 26) { ctx.moveTo(0, y); ctx.lineTo(390, y); }
  for (let x = 0; x < 390; x += 26) { ctx.moveTo(x, 0); ctx.lineTo(x, Hl); }
  ctx.stroke();
  texture(ctx, Object.assign({}, th, { texture: 'scan' }), pxW, pxH, s);
  const m = 10, n = 14;
  ctx.strokeStyle = hexA(c.accent, 0.55); ctx.lineWidth = 0.8; ctx.beginPath();
  ctx.moveTo(m + n, m); ctx.lineTo(195 - 40, m); ctx.moveTo(195 + 40, m); ctx.lineTo(390 - m - n, m); ctx.lineTo(390 - m, m + n);
  ctx.lineTo(390 - m, Hl - m - n); ctx.lineTo(390 - m - n, Hl - m); ctx.lineTo(m + n, Hl - m); ctx.lineTo(m, Hl - m - n); ctx.lineTo(m, m + n); ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = hexA(c.accent, 0.5); ctx.lineWidth = 0.7; ctx.beginPath();
  for (let y = 60; y < Hl - 40; y += 20) { const w = y % 100 === 0 ? 9 : 4; ctx.moveTo(m, y); ctx.lineTo(m + w, y); ctx.moveTo(390 - m, y); ctx.lineTo(390 - m - w, y); }
  ctx.stroke();
}

function cautionBand(ctx, th, x, y, w, h) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = th.colors.accent; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = th.colors.ground;
  for (let i = x - h; i < x + w + h; i += 14) { ctx.beginPath(); ctx.moveTo(i, y + h); ctx.lineTo(i + 7, y + h); ctx.lineTo(i + 7 + h, y); ctx.lineTo(i + h, y); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

function hexCluster(ctx, th, cx, cy, r) {
  const c = th.colors, red = alertRed(th), dx = r * Math.sqrt(3), dy = r * 1.5;
  const cells = [[0, 0, 'acc'], [1, 0, 'out'], [-1, 0, 'acc'], [0.5, -1, 'out'], [-0.5, -1, 'red'], [0.5, 1, 'acc'], [-0.5, 1, 'out'], [1.5, -1, 'dim'], [1.5, 1, 'out'], [-1.5, 1, 'dim']];
  cells.forEach(([q, rr, kind]) => {
    const x = cx + q * dx, y = cy + rr * dy;
    hexPath(ctx, x, y, r - 1.5);
    if (kind === 'acc') { ctx.fillStyle = hexA(c.accent, 0.85); ctx.fill(); }
    else if (kind === 'red') { ctx.fillStyle = red; ctx.fill(); }
    else if (kind === 'dim') { ctx.fillStyle = hexA(c.accent, 0.18); ctx.fill(); }
    ctx.strokeStyle = c.accent; ctx.lineWidth = 1; ctx.stroke();
  });
}

function hexRow(ctx, th, y, r) {
  const c = th.colors, red = alertRed(th), dx = r * Math.sqrt(3);
  let i = 0;
  for (let x = 30; x < 370; x += dx) {
    hexPath(ctx, x, y + (i % 2 ? r * 0.75 : 0), r - 1.5);
    const k = i % 7;
    if (k === 2 || k === 5) { ctx.fillStyle = hexA(c.accent, 0.85); ctx.fill(); }
    if (i === 8) { ctx.fillStyle = red; ctx.fill(); }
    ctx.strokeStyle = hexA(c.accent, 0.8); ctx.lineWidth = 0.9; ctx.stroke();
    i++;
  }
}

function syncGraph(ctx, th, x, y, w, h) {
  const c = th.colors, mid = y + h / 2;
  ctx.strokeStyle = hexA(c.ink, 0.25); ctx.lineWidth = 0.7; ctx.beginPath();
  ctx.moveTo(x, mid); ctx.lineTo(x + w, mid);
  for (let i = 0; i <= w; i += 23) { ctx.moveTo(x + i, y + h); ctx.lineTo(x + i, y + h - 4); }
  ctx.stroke();
  [[c.ink, 0, 1.2], [c.glow, 1.9, 1.4]].forEach(([col, ph, lw]) => {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0; i <= w; i += 1.5) {
      const t = i / w, amp = (h / 2 - 2) * (1 - 0.75 * t), yy = mid + amp * Math.sin(i * 0.11 + ph * (1 - t));
      i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy);
    }
    ctx.stroke();
  });
  seg(ctx, x + w * 0.82, y - 2, x + w * 0.82, y + h + 2, alertRed(th), 1.2);
}

function ringAnalyzer(ctx, th, cx, cy) {
  const c = th.colors, red = alertRed(th), ink = c.ink;
  ctx.strokeStyle = hexA(c.accent, 0.45); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke();
  for (let a = 0; a < 360; a += 6) {
    const r = a * Math.PI / 180, ln = a % 30 === 0 ? 10 : 4;
    seg(ctx, cx + 140 * Math.cos(r), cy + 140 * Math.sin(r), cx + (140 - ln) * Math.cos(r), cy + (140 - ln) * Math.sin(r), hexA(c.accent, a % 30 === 0 ? 0.9 : 0.45), 0.8);
  }
  ctx.strokeStyle = c.accent; ctx.lineWidth = 5;
  [[-80, -10], [5, 75], [95, 165], [185, 250]].forEach(([a0, a1]) => { ctx.beginPath(); ctx.arc(cx, cy, 118, a0 * Math.PI / 180, a1 * Math.PI / 180); ctx.stroke(); });
  ctx.setLineDash([2, 4]); ctx.strokeStyle = hexA(ink, 0.5); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(cx, cy, 96, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = c.glow; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 74, -Math.PI / 2, Math.PI); ctx.stroke();
  ctx.strokeStyle = hexA(c.glow, 0.25); ctx.beginPath(); ctx.arc(cx, cy, 74, Math.PI, Math.PI * 1.5); ctx.stroke();
  ctx.strokeStyle = red; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, 52, -0.4, 0.65); ctx.stroke();
  ctx.strokeStyle = hexA(ink, 0.35); ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 8; k++) { const r = k * Math.PI / 4; seg(ctx, cx + 22 * Math.cos(r), cy + 22 * Math.sin(r), cx + 40 * Math.cos(r), cy + 40 * Math.sin(r), hexA(ink, 0.55), 0.8); }
  seg(ctx, cx - 160, cy, cx + 160, cy, hexA(ink, 0.3), 0.7); seg(ctx, cx, cy - 160, cx, cy + 160, hexA(ink, 0.3), 0.7);
  ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.strokeRect(cx - 6, cy - 6, 12, 12);
  ctx.fillStyle = c.accent; ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5);
  ['000', '090', '180', '270'].forEach((lab, i) => {
    const r = (i * 90 - 90) * Math.PI / 180;
    spaced(ctx, lab, cx + 155 * Math.cos(r), cy + 155 * Math.sin(r) + 3, 7, th.fonts.mono, 500, 0.1, 'center', hexA(c.accent, 0.9));
  });
  ctx.strokeStyle = c.accent; ctx.lineWidth = 1.4;
  brackets(Object.assign(ctx, {}), Object.assign({}, th, { colors: Object.assign({}, c, { ink: c.accent }) }), cx, cy, 168, 18, true);
}

function drawAlert(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, red = alertRed(th);
  alertGround(ctx, th, Hl, W, H, s);
  const lab = (str, x, y, size, align, col, sp) => spaced(ctx, str, x, y, size, mono, 500, sp == null ? 0.12 : sp, align, col || c.ink);
  if (mode === 'lock') {
    xfBegin(ctx, th, 195, 470);
    lab(T.topL, 22, 244, 7, 'left', c.accent);
    lab(T.topR, 368, 244, 7, 'right', c.accent);
    ctx.fillStyle = red; ctx.fillRect(22, 258, 62, 15);
    lab(T.tag, 53, 269, 8.5, 'center', c.ink, 0.2);
    lab(T.ref, 368, 269, 7, 'right', hexA(c.ink, 0.7));
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const l1 = th.upper ? ph[0].toUpperCase() : ph[0], l2 = th.upper ? ph[1].toUpperCase() : ph[1];
    const fam = th.fonts.display, wgt = dispWeight(fam), SX = 0.74;
    const s1 = Math.min(80, 80 * 346 / Math.max(1, compWidth(ctx, l1, 80, fam, wgt, SX)));
    const s2 = Math.min(118, 118 * 346 / Math.max(1, compWidth(ctx, l2, 118, fam, wgt, SX)));
    const y1 = 282 + s1 * 0.82, y2 = y1 + s2 * 0.9;
    compText(ctx, l1, 20, y1, s1, fam, wgt, SX, c.ink, 'left');
    compText(ctx, l2, 20, y2, s2, fam, wgt, SX, c.ink, 'left');
    const by = Math.min(y2 + 18, 500);
    ctx.fillStyle = c.accent; ctx.fillRect(22, by, 346, 4);
    ctx.fillStyle = red; ctx.fillRect(22, by, 40, 4);
    const iy = by + 24;
    lab(T.timerLabel, 22, iy, 7.5, 'left', c.accent);
    spaced(ctx, T.timer, 22, iy + 50, 54, mono, 700, 0.02, 'left', c.accent);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = i < 7 ? c.accent : i < 10 ? hexA(c.accent, 0.22) : red; ctx.fillRect(22 + i * 15, iy + 62, 12, 7); }
    lab(T.power, 22, iy + 80, 6.8, 'left', hexA(c.ink, 0.75));
    hexCluster(ctx, th, 318, iy + 34, 14);
    lab(T.hexLabel, 318, iy + 80, 6.8, 'center', hexA(c.ink, 0.75));
    const gy = iy + 98;
    lab(T.syncLabel, 22, gy, 7.5, 'left', c.glow);
    lab(T.sync, 368, gy, 7.5, 'right', c.glow);
    syncGraph(ctx, th, 22, gy + 8, 346, 34);
    const cy = gy + 52;
    cautionBand(ctx, th, 22, cy, 346, 9);
    if (K(th).details) wrapLines(ctx, T.fine, 346, 6.6, mono, 0.04, 3).forEach((ln, i) => spaced(ctx, ln, 22, cy + 22 + i * 9.5, 6.6, mono, 500, 0.04, 'left', hexA(c.ink, 0.72)));
    const ry = Math.min(cy + 70, Hl - 96);
    seg(ctx, 22, ry - 12, 368, ry - 12, hexA(c.accent, 0.4), 0.7);
    (K(th).details ? (T.stats || []) : []).forEach((st, i) => {
      const x = 22 + i * 120;
      lab(st[0], x, ry, 6.8, 'left', hexA(c.ink, 0.7));
      spaced(ctx, st[1], x, ry + 20, 18, mono, 700, 0.02, 'left', i === 2 ? red : c.ink);
    });
    lab(T.foot, 195, Hl - 30, 7, 'center', c.accent, 0.2);
    ctx.restore();
  } else {
    ctx.save(); ctx.globalAlpha = 0.07;
    ctx.translate(60, Hl - 60); ctx.rotate(-Math.PI / 2);
    compText(ctx, (T.rail || '').toUpperCase(), 0, 0, 96, th.fonts.display, dispWeight(th.fonts.display), 0.74, c.ink, 'left');
    ctx.restore();
    const CY = 410;
    lab(T.homeTop, 195, 248, 7.5, 'center', c.accent, 0.18);
    centerXform(ctx, th, 195, CY, () => ringAnalyzer(ctx, th, 195, CY));
    T.sideL.forEach((l, i) => lab(l, 22, 394 + i * 10.5, 8, 'left'));
    T.sideR.forEach((l, i) => lab(l, 368, 394 + i * 10.5, 8, 'right'));
    T.cornerL.forEach((l, i) => lab(l, 22, 540 + i * 9.5, 7, 'left', hexA(c.ink, 0.85)));
    T.cornerR.forEach((l, i) => lab(l, 368, 540 + i * 9.5, 7, 'right', hexA(c.ink, 0.85)));
    hexRow(ctx, th, 598, 11);
    lab(T.caption, 195, 632, 7.5, 'center', c.accent, 0.3);
    cautionBand(ctx, th, 22, 642, 346, 6);
    ticker(ctx, Object.assign({}, th, { colors: Object.assign({}, c, { ink: c.accent }) }), 16, 352, -Math.PI / 2, T.tickerL, 6.2);
    ticker(ctx, Object.assign({}, th, { colors: Object.assign({}, c, { ink: c.accent }) }), 374, 76, Math.PI / 2, T.tickerR, 6.2);
  }
}

// ---------- MAP motif (traveller's map look) ----------
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function fell(ctx, str, x, y, size, fam, color, align, italic, sp) {
  ctx.save();
  ctx.font = `${italic ? 'italic ' : ''}400 ${size}px "${fam}", Georgia, serif`;
  ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  const chars = Array.from(String(str)), gap = (sp || 0) * size;
  const ws = chars.map(ch => ctx.measureText(ch).width);
  const total = ws.reduce((a, b) => a + b, 0) + gap * Math.max(0, chars.length - 1);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  chars.forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; });
  ctx.restore();
  return total;
}

function paperGround(ctx, th, Hl, pxW, pxH, s) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = hexA(c.ink, 0.06); ctx.lineWidth = 0.6; ctx.beginPath();
  for (let y = 0; y < Hl; y += 26) { ctx.moveTo(0, y); ctx.lineTo(390, y); }
  for (let x = 0; x < 390; x += 26) { ctx.moveTo(x, 0); ctx.lineTo(x, Hl); }
  ctx.stroke();
  const r = rng(seedOf(th, 283));
  for (let i = 0; i < Math.round(2600 * K(th).texture); i++) { ctx.fillStyle = hexA(c.ink, 0.03 + r() * 0.07); const sz = 0.3 + r() * 0.9; ctx.fillRect(r() * 390, r() * Hl, sz, sz); }
  ctx.strokeStyle = hexA(c.glow, 0.18); ctx.lineWidth = 0.4;
  for (let i = 0; i < 70; i++) { const x = r() * 390, y = r() * Hl, a = r() * Math.PI; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10); ctx.stroke(); }
  const g = ctx.createRadialGradient(195, Hl / 2, Hl * 0.25, 195, Hl / 2, Hl * 0.72);
  g.addColorStop(0, hexA(c.glow, 0)); g.addColorStop(1, hexA(c.glow, Math.min(1, 0.32 * K(th).glow)));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.strokeRect(12, 12, 366, Hl - 24);
  ctx.lineWidth = 0.5; ctx.strokeRect(16, 16, 358, Hl - 32);
  [[16, 16], [374, 16], [16, Hl - 16], [374, Hl - 16]].forEach(([x, y]) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = c.accent; ctx.fillRect(-3, -3, 6, 6); ctx.restore();
  });
}

function compassRose(ctx, th, x, y, R) {
  const c = th.colors;
  ctx.strokeStyle = c.ink; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.arc(x, y, R * 0.62, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, R * 0.7, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 4, len = i % 2 ? R * 0.62 : R, w = i % 2 ? R * 0.1 : R * 0.16;
    const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len;
    const lx = x + Math.cos(a - Math.PI / 2) * w, ly = y + Math.sin(a - Math.PI / 2) * w;
    const rx = x + Math.cos(a + Math.PI / 2) * w, ry = y + Math.sin(a + Math.PI / 2) * w;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(tx, ty); ctx.lineTo(x, y); ctx.closePath();
    ctx.fillStyle = i === 0 ? c.accent : c.ink; ctx.fill();
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(tx, ty); ctx.lineTo(x, y); ctx.closePath();
    ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.6; ctx.stroke();
  }
  fell(ctx, 'N', x, y - R - 3, R * 0.42, th.fonts.display, c.accent, 'center');
}

function mountain(ctx, th, x, y, h, w) {
  const c = th.colors;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w * 0.06, y - h); ctx.lineTo(x + w * 0.08, y - h * 0.9); ctx.lineTo(x + w / 2, y);
  ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - w * 0.06, y - h); ctx.lineTo(x - w * 0.16, y - h * 0.72); ctx.lineTo(x - w * 0.06, y - h * 0.78); ctx.lineTo(x + w * 0.02, y - h * 0.68); ctx.lineTo(x + w * 0.08, y - h * 0.9);
  ctx.strokeStyle = hexA(c.ink, 0.7); ctx.lineWidth = 0.55; ctx.stroke();
  ctx.lineWidth = 0.45; ctx.strokeStyle = hexA(c.ink, 0.35);
  for (let k = 1; k <= 3; k++) { const t = k / 4; ctx.beginPath(); ctx.moveTo(x - w / 2 + w * 0.44 * t, y - h * t * 0.95); ctx.lineTo(x - w / 2 + w * 0.44 * t + 2.5, y - h * t * 0.95 + 4); ctx.stroke(); }
  ctx.lineWidth = 0.6;
  for (let k = 1; k <= 4; k++) { const t = k / 5; ctx.beginPath(); ctx.moveTo(x + w * 0.08 + (w * 0.42) * t * 0.3, y - h * 0.9 * (1 - t)); ctx.lineTo(x + w * 0.08 + (w * 0.42) * t, y - h * 0.9 * (1 - t) * 0.4); ctx.stroke(); }
}

function tree(ctx, th, x, y, r) {
  const c = th.colors;
  ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 0.85, Math.PI * 2.15); ctx.closePath();
  ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + r * 0.5); ctx.lineTo(x, y + r * 1.4); ctx.stroke();
}

function mapScene(ctx, th, bx, by, bw, bh, seed, opts) {
  // A clean journey map: nothing crosses anything. The Wending Way runs from Brindle (I) to the pass in the Fells (VI).
  const c = th.colors, r = rng(seed), P = (th.text.places || []), k = K(th);
  const X = (u) => bx + u * bw, Y = (v) => by + v * bh;
  const fam = th.fonts.display, sz = opts.label || 10, small = sz * 0.8;
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
  const peak = (x, y, h, w) => {
    const tx = x + (r() - 0.5) * w * 0.12, ty = y - h
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(tx, ty); ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fillStyle = c.panel; ctx.fill()
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x + w / 2, y)
    const n = 5
    for (let k = 0; k <= n; k++) { const t = k / n, px = (x + w * 0.04) + (tx - (x + w * 0.04)) * t, py = y + (ty - y) * t; ctx.lineTo(px + (k % 2 ? w * 0.09 : -w * 0.02), py) }
    ctx.closePath(); ctx.fillStyle = c.ink; ctx.fill()
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(tx, ty); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.strokeStyle = hexA(c.ink, 0.55); ctx.lineWidth = 0.45
    for (let k = 1; k <= 2; k++) { const t = k / 3; ctx.beginPath(); ctx.moveTo(x - w / 2 + (tx - (x - w / 2)) * t + 1, y + (ty - y) * t + 1); ctx.lineTo(x - w / 2 + (tx - (x - w / 2)) * t + 3, y + (ty - y) * t + 5); ctx.stroke() }
  }
  const forestMass = (u0, v0, ru, rv, seedK) => {
    const pts = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, q = 0.82 + r() * 0.3; pts.push([X(u0) + Math.cos(a) * bw * ru * q, Y(v0) + Math.sin(a) * bh * rv * q]) }
    ctx.save(); ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fillStyle = c.panel; ctx.fill(); ctx.clip()
    const ys = Y(v0) - bh * rv * 1.2, ye = Y(v0) + bh * rv * 1.2, xs = X(u0) - bw * ru * 1.2, xe = X(u0) + bw * ru * 1.2
    ctx.strokeStyle = c.ink; ctx.lineWidth = 0.6
    let row = 0
    for (let yy = ys; yy < ye; yy += 3.6, row++) for (let xx = xs + (row % 2) * 2.3; xx < xe; xx += 4.6) { ctx.beginPath(); ctx.arc(xx, yy, 2.2, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke() }
    ctx.restore()
    ctx.strokeStyle = c.ink; ctx.lineWidth = 0.7
    for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ln = Math.hypot(x2 - x1, y2 - y1); const nn = Math.max(1, Math.round(ln / 5)); for (let k = 0; k < nn; k++) { const t = (k + 0.5) / nn; ctx.beginPath(); ctx.arc(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 2.4, Math.atan2(y2 - y1, x2 - x1) + Math.PI, Math.atan2(y2 - y1, x2 - x1) + Math.PI * 2); ctx.stroke() } }
  }
  const ink = c.ink, inkS = hexA(c.ink, 0.55)
  const hill = (x, y, w) => { const hh = w * 0.5; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.bezierCurveTo(x - w * 0.3, y - hh, x + w * 0.2, y - hh * 1.05, x + w / 2, y); ctx.closePath(); ctx.fillStyle = c.panel; ctx.fill(); ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.bezierCurveTo(x - w * 0.3, y - hh, x + w * 0.2, y - hh * 1.05, x + w / 2, y); ctx.strokeStyle = ink; ctx.lineWidth = 0.8; ctx.stroke(); ctx.lineWidth = 0.5; ctx.strokeStyle = inkS; for (let k = 0; k < 4; k++) { const sx = x + w * 0.08 + k * w * 0.08; ctx.beginPath(); ctx.moveTo(sx, y - hh * (0.62 - k * 0.12)); ctx.lineTo(sx + 1.2, y - 0.8); ctx.stroke(); } }
  const pine = (x, y, h) => { ctx.beginPath(); ctx.moveTo(x, y - h); for (let k = 1; k <= 3; k++) { const yy = y - h + k * h * 0.27, ww = h * (0.14 + k * 0.1); ctx.lineTo(x + ww, yy); ctx.lineTo(x + ww * 0.45, yy - h * 0.04) } ctx.lineTo(x + h * 0.1, y - h * 0.1); ctx.lineTo(x - h * 0.1, y - h * 0.1); for (let k = 3; k >= 1; k--) { const yy = y - h + k * h * 0.27, ww = h * (0.14 + k * 0.1); ctx.lineTo(x - ww * 0.45, yy - h * 0.04); ctx.lineTo(x - ww, yy) } ctx.closePath(); ctx.fillStyle = ink; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x, y - h * 0.1); ctx.lineTo(x, y); ctx.stroke(); }
  const tuft = (x, y) => { ctx.strokeStyle = inkS; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x - 2, y); ctx.lineTo(x - 3, y - 3.5); ctx.moveTo(x, y); ctx.lineTo(x, y - 4.5); ctx.moveTo(x + 2, y); ctx.lineTo(x + 3, y - 3.5); ctx.stroke(); }
  const house = (x, y, sc) => { sc = sc || 1; ctx.fillStyle = c.panel; ctx.strokeStyle = ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.rect(x - 3 * sc, y - 4 * sc, 6 * sc, 4 * sc); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 4 * sc, y - 4 * sc); ctx.lineTo(x, y - 7.5 * sc); ctx.lineTo(x + 4 * sc, y - 4 * sc); ctx.closePath(); ctx.fillStyle = c.accent; ctx.fill(); ctx.stroke(); }
  const tower = (x, y) => { ctx.fillStyle = c.panel; ctx.strokeStyle = ink; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.rect(x - 3.5, y - 14, 7, 14); ctx.fill(); ctx.stroke(); ctx.beginPath(); for (let i = 0; i < 3; i++) ctx.rect(x - 4.5 + i * 3.6, y - 17, 2.2, 3); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.fillRect(x - 0.8, y - 10, 1.6, 2.6); }
  const ruin = (x, y) => { ctx.strokeStyle = ink; ctx.lineWidth = 0.9; [[-6, 9], [-2, 5], [2, 7], [6, 3]].forEach(([dx, h]) => { ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.lineTo(x + dx, y - h); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.stroke(); }
  const islet = (x, y, rr) => { const pts = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, q = rr * (0.7 + r() * 0.5); pts.push([x + q * Math.cos(a) * 1.4, y + q * Math.sin(a)]) } ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 0.9; ctx.stroke(); ctx.strokeStyle = hexA(c.ink, 0.25); ctx.lineWidth = 0.5; ctx.beginPath(); ctx.ellipse(x, y, rr * 1.9, rr * 1.4, 0, 0, Math.PI * 2); ctx.stroke(); }
  const wave = (x, y) => { ctx.strokeStyle = hexA(c.ink, 0.45); ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(x - 2.5, y, 2.5, Math.PI, 0); ctx.arc(x + 2.5, y, 2.5, Math.PI, 0); ctx.stroke(); }
  // coastline, sea to the west
  const ctrl = [[0, 0.4], [0.07, 0.46], [0.11, 0.56], [0.09, 0.66], [0.13, 0.76], [0.18, 0.86], [0.22, 0.94], [0.25, 1.02]], coast = [];
  for (let i = 0; i < ctrl.length - 1; i++) { const [u0, v0] = ctrl[i], [u1, v1] = ctrl[i + 1]; for (let j = 0; j < 8; j++) { const t = j / 8; coast.push([X(u0 + (u1 - u0) * t) + (r() - 0.5) * 3.5, Y(v0 + (v1 - v0) * t) + (r() - 0.5) * 3.5]); } }
  coast.push([X(0.25), Y(1.02)]);
  for (let j = 4; j >= 1; j--) { ctx.strokeStyle = hexA(c.ink, 0.1 + 0.06 * (4 - j) / 4); ctx.lineWidth = 0.5; ctx.beginPath(); coast.forEach(([x, y], i) => { const xx = x - j * 3.6, yy = y + j * 2.2; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }); ctx.stroke(); }
  ctx.beginPath(); coast.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.stroke();
  // the sea: two names along the shore, a ship, islets and waves, each with its own room
  ctx.save(); ctx.translate(X(0.035), Y(0.53)); ctx.rotate(-Math.PI / 2 + 0.06); fell(ctx, P[11] || '', 0, 0, small, fam, hexA(c.ink, 0.7), 'center', true, 0.18); ctx.restore();
  ctx.save(); ctx.translate(X(0.055), Y(0.74)); ctx.rotate(-Math.PI / 2 + 0.25); fell(ctx, P[5] || '', 0, 0, small, fam, hexA(c.ink, 0.7), 'center', true, 0.1); ctx.restore();
  { const sxp = X(0.1), syp = Y(0.9); ctx.fillStyle = c.panel; ctx.strokeStyle = c.ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(sxp - 7, syp); ctx.lineTo(sxp + 7, syp); ctx.lineTo(sxp + 5, syp + 3); ctx.lineTo(sxp - 5, syp + 3); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sxp, syp); ctx.lineTo(sxp, syp - 11); ctx.stroke(); ctx.fillStyle = c.accent; ctx.beginPath(); ctx.moveTo(sxp + 1, syp - 10); ctx.lineTo(sxp + 7, syp - 2); ctx.lineTo(sxp + 1, syp - 2); ctx.closePath(); ctx.fill(); }
  islet(X(0.04), Y(0.965), 3.2); islet(X(0.16), Y(0.975), 2.6);
  [[0.03, 0.43], [0.05, 0.85], [0.15, 0.93]].forEach(([u, v]) => wave(X(u), Y(v)));
  // river from the Fells into Hollowmere and out to the east
  ctx.strokeStyle = c.ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(X(0.62), Y(0.285)); ctx.bezierCurveTo(X(0.64), Y(0.36), X(0.72), Y(0.38), X(0.765), Y(0.47)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X(0.93), Y(0.545)); ctx.bezierCurveTo(X(0.96), Y(0.56), X(0.98), Y(0.6), X(1.02), Y(0.6)); ctx.stroke();
  // Hollowmere
  const LX = X(0.84), LY = Y(0.53), lrx = bw * 0.085, lry = bh * 0.05;
  ctx.fillStyle = c.panel; ctx.beginPath(); ctx.ellipse(LX, LY, lrx, lry, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.9; ctx.stroke();
  for (let j = 1; j <= 3; j++) { ctx.beginPath(); ctx.ellipse(LX, LY, lrx - j * 3, Math.max(1, lry - j * 2.2), -0.15, 0, Math.PI * 2); ctx.strokeStyle = hexA(c.ink, 0.25); ctx.lineWidth = 0.4; ctx.stroke(); }
  // the Greyhallow Fells, with a clear pass where the journey ends
  const range = [];
  for (let i = 0; i < 28; i++) { const t = i / 27, u = 0.22 + t * 0.58 + (r() - 0.5) * 0.01; if (u > 0.44 && u < 0.6) continue; const v = 0.255 - Math.sin(t * Math.PI) * 0.05 + (r() - 0.5) * 0.015; range.push([u, v, 12 + r() * 12 + Math.sin(t * Math.PI) * 6, 9 + r() * 6]); }
  for (let i = 0; i < 12; i++) { const t = i / 11, u = 0.28 + t * 0.46 + (r() - 0.5) * 0.01; if (u > 0.42 && u < 0.62) continue; range.push([u, 0.285 + (r() - 0.5) * 0.01, 6 + r() * 5, 7 + r() * 4]); }
  range.sort((a2, b2) => a2[1] - b2[1]).forEach(([u, v, h, w]) => peak(X(u), Y(v), h, w));
  // Pinewatch, a pine wood in the north-west
  const pines = []; for (let i = 0; i < 30; i++) pines.push([0.03 + r() * 0.15, 0.17 + r() * 0.12]);
  pines.sort((a2, b2) => a2[1] - b2[1]).forEach(([u, v]) => pine(X(u), Y(v), 8 + r() * 4));
  // hills: Sheepcote in the west, an unnamed rise east of the river
  [[0.19, 0.53], [0.235, 0.52], [0.28, 0.535], [0.21, 0.56], [0.255, 0.555]].forEach(([u, v]) => hill(X(u), Y(v), 13 + r() * 4));
  [[0.72, 0.33], [0.765, 0.32], [0.81, 0.335], [0.745, 0.355]].forEach(([u, v]) => hill(X(u), Y(v), 12 + r() * 4));
  // Ashwood and Fenwick Marsh
  forestMass(0.895, 0.705, 0.09, 0.05, 1);
  for (let i = 0; i < 9; i++) tuft(X(0.33 + r() * 0.12), Y(0.7 + r() * 0.04));
  // landmarks
  tower(X(0.262), Y(0.405)); ruin(X(0.5), Y(0.56));
  house(X(0.235), Y(0.895), 0.85); house(X(0.258), Y(0.875), 0.85); house(X(0.25), Y(0.92), 0.85);
  { const ix = X(0.585), iy = Y(0.75); house(ix, iy, 1.25); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(ix + 6, iy - 6); ctx.lineTo(ix + 10, iy - 6); ctx.lineTo(ix + 10, iy - 3); ctx.stroke(); ctx.fillStyle = '#F2B33D'; ctx.beginPath(); ctx.arc(ix + 10, iy - 1.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
  // THE WENDING WAY: a smooth route through six stages, with direction chevrons
  const WP = [[0.3, 0.9], [0.62, 0.78], [0.745, 0.6], [0.52, 0.52], [0.3, 0.4], [0.5, 0.205]].map(([u, v]) => [X(u), Y(v)]);
  const ctrlPts = [WP[0]].concat(WP).concat([WP[WP.length - 1]]), path = [];
  for (let i = 1; i < ctrlPts.length - 2; i++) { const p0 = ctrlPts[i - 1], p1 = ctrlPts[i], p2 = ctrlPts[i + 1], p3 = ctrlPts[i + 2]; for (let j = 0; j < 16; j++) { const t = j / 16, t2 = t * t, t3 = t2 * t; path.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); } }
  path.push(WP[WP.length - 1]);
  ctx.strokeStyle = hexA(c.panel, 0.9); ctx.lineWidth = 5; ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  ctx.setLineDash([4, 3.2]); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.8; ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.setLineDash([]);
  let acc = 0, next = 26;
  for (let i = 1; i < path.length; i++) { const x0 = path[i - 1][0], y0 = path[i - 1][1], x1 = path[i][0], y1 = path[i][1]; acc += Math.hypot(x1 - x0, y1 - y0); if (acc >= next) { next += 30; if (WP.some(([wx, wy]) => Math.hypot(wx - x1, wy - y1) < 13)) continue; const a = Math.atan2(y1 - y0, x1 - x0); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x1 - 4 * Math.cos(a - 0.6), y1 - 4 * Math.sin(a - 0.6)); ctx.lineTo(x1, y1); ctx.lineTo(x1 - 4 * Math.cos(a + 0.6), y1 - 4 * Math.sin(a + 0.6)); ctx.stroke(); } }
  const NUM = ['I', 'II', 'III', 'IV', 'V'];
  WP.slice(0, 5).forEach(([x, y], i) => { ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = c.panel; ctx.lineWidth = 1.2; ctx.stroke(); spaced(ctx, NUM[i], x, y + 2.3, i === 2 || i === 3 ? 5.4 : 6.2, th.fonts.mono, 700, 0, 'center', c.panel); });
  { const dx = WP[5][0], dy = WP[5][1]; ctx.strokeStyle = c.accent; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(dx - 6, dy - 6); ctx.lineTo(dx + 6, dy + 6); ctx.moveTo(dx + 6, dy - 6); ctx.lineTo(dx - 6, dy + 6); ctx.stroke(); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(dx + 9, dy + 2); ctx.lineTo(dx + 9, dy - 16); ctx.stroke(); ctx.fillStyle = c.accent; ctx.beginPath(); ctx.moveTo(dx + 9, dy - 16); ctx.lineTo(dx + 18, dy - 12.5); ctx.lineTo(dx + 9, dy - 9); ctx.closePath(); ctx.fill(); }
  // a small traveller on the road between the inn and the lake
  { const tx = X(0.668), ty = Y(0.735); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.arc(tx, ty - 9, 1.9, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(tx - 2.6, ty - 6.6); ctx.lineTo(tx + 2.6, ty - 6.6); ctx.lineTo(tx + 3.2, ty); ctx.lineTo(tx - 3.2, ty); ctx.closePath(); ctx.fill(); ctx.fillStyle = c.accent; ctx.fillRect(tx - 2.2, ty - 6, 4.4, 3.6); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(tx + 4.5, ty - 10); ctx.lineTo(tx + 5.5, ty + 0.5); ctx.stroke(); if (k.details) fell(ctx, 'you are here', tx + 9, ty - 1, small * 0.9, fam, hexA(c.ink, 0.8), 'left', true); }
  // labels, each placed in its own clear space
  fell(ctx, (P[2] || '').toUpperCase(), X(0.47), Y(0.075), sz * 1.05, fam, c.accent, 'center', false, 0.32);
  fell(ctx, P[0] || '', X(0.655), Y(0.795), sz * 0.95, fam, c.accent, 'left', false);
  fell(ctx, P[3] || '', X(0.86), Y(0.625), sz * 0.95, fam, c.accent, 'center', false);
  fell(ctx, P[10] || '', X(0.33), Y(0.965), sz * 0.95, fam, c.accent, 'center', false);
  ctx.save(); ctx.translate(X(0.9), Y(0.705)); ctx.rotate(-0.06); { const nm = (P[1] || '').toUpperCase(); ctx.fillStyle = hexA(c.panel, 0.9); const w2 = nm.length * sz * 0.55; ctx.fillRect(-w2 / 2, -sz * 0.55, w2, sz * 0.95); fell(ctx, nm, 0, 3, sz * 0.78, fam, c.accent, 'center', false, 0.16); } ctx.restore();
  { const a = Math.atan2(WP[1][1] - WP[0][1], WP[1][0] - WP[0][0]); ctx.save(); ctx.translate((WP[0][0] + WP[1][0]) / 2 + 4, (WP[0][1] + WP[1][1]) / 2 + 16); ctx.rotate(a); fell(ctx, P[4] || '', 0, 0, sz * 0.95, fam, c.accent, 'center', true, 0.12); ctx.restore(); }
  if (k.details) {
    fell(ctx, P[12] || '', X(0.11), Y(0.335), small, fam, hexA(c.ink, 0.85), 'center', true, 0.06);
    fell(ctx, P[8] || '', X(0.335), Y(0.425), small, fam, c.accent, 'left', false);
    fell(ctx, P[6] || '', X(0.235), Y(0.6), small, fam, hexA(c.ink, 0.85), 'center', true, 0.06);
    fell(ctx, P[9] || '', X(0.5), Y(0.6), small, fam, hexA(c.ink, 0.85), 'center', true);
    fell(ctx, P[7] || '', X(0.39), Y(0.775), small, fam, hexA(c.ink, 0.85), 'center', true, 0.06);
    fell(ctx, 'the pass', X(0.5) + 6, Y(0.205) + 22, small, fam, c.accent, 'left', true);
  }
  // legend cartouche: the stages of the journey, and the scale
  if (opts.scale) {
    const lx = X(0.625), ly = Y(0.85), lw = X(0.985) - lx, lh = Y(0.985) - ly;
    ctx.fillStyle = hexA(c.panel, 0.95); ctx.fillRect(lx, ly, lw, lh); ctx.strokeStyle = c.ink; ctx.lineWidth = 0.7; ctx.strokeRect(lx, ly, lw, lh); ctx.lineWidth = 0.3; ctx.strokeRect(lx + 2, ly + 2, lw - 4, lh - 4);
    spaced(ctx, 'THE JOURNEY', lx + lw / 2, ly + 9, 5.2, th.fonts.mono, 400, 0.2, 'center', c.accent);
    const st = [P[10] || 'Brindle', P[0] || 'The Lantern Inn', P[3] || 'Hollowmere', P[9] || 'Calder Ruins', P[8] || 'Old Tower', 'The Pass'];
    st.forEach((nm, i) => { const col = i < 3 ? 0 : 1, row = i % 3, x = lx + 6 + col * lw / 2, y = ly + 18 + row * 8; spaced(ctx, ['I', 'II', 'III', 'IV', 'V', 'VI'][i], x + 7, y, 5, th.fonts.mono, 700, 0, 'right', c.accent); fell(ctx, nm.replace(/^The /, ''), x + 10, y, 5.8, fam, c.ink, 'left', false); });
    const sx = lx + 6, sy = ly + lh - 6; for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? c.panel : c.ink; ctx.fillRect(sx + i * 9, sy, 9, 2.6); } ctx.strokeStyle = c.ink; ctx.lineWidth = 0.5; ctx.strokeRect(sx, sy, 36, 2.6);
    spaced(ctx, th.text.scale || 'LEAGUES', sx + 40, sy + 2.6, 4.6, th.fonts.mono, 400, 0.16, 'left', c.ink);
  }
  if (opts.compass) compassRose(ctx, th, X(0.9), Y(0.17), opts.compass * 0.9);
  ctx.restore();
  ctx.strokeStyle = c.ink; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
  ctx.lineWidth = 0.4; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);
}

function drawMap(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  const c = th.colors, T = th.text, fam = th.fonts.display, sc = th.fonts.mono;
  paperGround(ctx, th, Hl, W, H, s);
  if (mode === 'lock') {
    fell(ctx, T.mapTitle, 195, 248, 11, sc, c.ink, 'center', false, 0.08);
    centerXform(ctx, th, 195, 423, () => mapScene(ctx, th, 28, 258, 334, 330, seedOf(th, 7), { compass: 22, scale: true, label: 9.5 }));
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const l1 = th.upper ? (ph[0] || '').toUpperCase() : (ph[0] || ''), l2 = th.upper ? (ph[1] || '').toUpperCase() : (ph[1] || '');
    ctx.font = `400 46px "${fam}", Georgia, serif`;
    const wmax = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width, 1);
    const size = Math.min(46, 46 * 330 / wmax);
    const y1 = 640, y2 = y1 + size * 1.0;
    const first = l1.charAt(0), capSize = size * 1.22;
    ctx.font = `400 ${capSize}px "${fam}", Georgia, serif`;
    const capW = ctx.measureText(first).width;
    fell(ctx, first, 30, y1, capSize, fam, c.accent, 'left');
    fell(ctx, l1.slice(1), 30 + capW + 1, y1, size, fam, c.ink, 'left');
    fell(ctx, l2, 30, y2, size, fam, c.ink, 'left');
    fell(ctx, T.journal, 195, y2 + 30, 12, fam, hexA(c.ink, 0.8), 'center', true);
    seg(ctx, 140, Hl - 46, 250, Hl - 46, hexA(c.ink, 0.5), 0.6);
    fell(ctx, T.foot, 195, Hl - 32, 9, sc, c.accent, 'center', false, 0.14);
  } else {
    drawRoadHome(ctx, th, Hl, phraseIdx);
  }
}

function drawWoodcutIcon(ctx, th, glyph, num, code) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  const r = rng(num.charCodeAt(1) * 97 + 5);
  for (let i = 0; i < 900; i++) { ctx.fillStyle = hexA(c.ink, 0.04 + r() * 0.08); const z = 2 + r() * 4; ctx.fillRect(r() * 1024, r() * 1024, z, z); }
  ctx.strokeStyle = c.ink; ctx.lineWidth = 16; ctx.strokeRect(96, 96, 832, 832);
  ctx.lineWidth = 5; ctx.strokeRect(128, 128, 768, 768);
  ctx.save(); ctx.translate(304, 296); ctx.scale(17, 17); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
  fell(ctx, num, 168, 222, 70, th.fonts.display, c.accent, 'left');
  fell(ctx, code, 512, 868, 54, th.fonts.mono, c.ink, 'center', false, 0.1);
  [[96, 96], [928, 96], [96, 928], [928, 928]].forEach(([x, y]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = c.accent; ctx.fillRect(-18, -18, 36, 36); ctx.restore(); });
}

// ---------- NIGHT motif (night-drop helmet display) ----------
function rainOverlay(ctx, th, Hl, seed, alpha) {
  const c = th.colors, r = rng(seed);
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 170; i++) {
    const x = r() * 420 - 20, y = r() * Hl, l = 8 + r() * 16;
    ctx.strokeStyle = hexA(r() < 0.8 ? c.glow : c.ink, alpha * (0.3 + r() * 0.7));
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.28, y + l); ctx.stroke();
  }
}
function nightGround(ctx, th, Hl) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  const g = ctx.createRadialGradient(195, Hl * 0.55, 40, 195, Hl * 0.55, Hl * 0.7);
  g.addColorStop(0, hexA(c.glow, 0.12)); g.addColorStop(1, hexA(c.glow, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  rainOverlay(ctx, th, Hl, 91, 0.35);
}
function visorFrame(ctx, th, Hl, top) {
  const c = th.colors;
  ctx.strokeStyle = hexA(c.ink, 0.7); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(14, top + 34); ctx.quadraticCurveTo(195, top - 10, 376, top + 34); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, Hl - 70); ctx.quadraticCurveTo(195, Hl - 26, 376, Hl - 70); ctx.stroke();
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, x = (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 195 + t * t * 376, y = (1 - t) * (1 - t) * (top + 34) + 2 * (1 - t) * t * (top - 10) + t * t * (top + 34);
    seg(ctx, x, y, x, y + (i % 4 === 0 ? 7 : 3.5), hexA(c.ink, 0.6), 0.8);
  }
  ctx.beginPath(); ctx.moveTo(14, top + 34); ctx.lineTo(14, Hl - 70); ctx.moveTo(376, top + 34); ctx.lineTo(376, Hl - 70);
  ctx.strokeStyle = hexA(c.ink, 0.25); ctx.stroke();
}
function headingTape(ctx, th, y) {
  const c = th.colors, x0 = 80, x1 = 310, mid = 195;
  ctx.strokeStyle = hexA(c.ink, 0.6); ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(x0, y + 12); ctx.lineTo(x1, y + 12); ctx.stroke();
  for (let d = 240; d <= 300; d += 5) {
    const x = mid + (d - 270) * 3.8, big = d % 15 === 0;
    seg(ctx, x, y + 12, x, y + (big ? 4 : 8), hexA(c.ink, big ? 0.9 : 0.5), 0.8);
    if (big) spaced(ctx, String(d), x, y + 2, 6.5, th.fonts.mono, 400, 0.05, 'center', c.ink);
  }
  ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(mid, y + 14); ctx.lineTo(mid - 4, y + 20); ctx.lineTo(mid + 4, y + 20); ctx.closePath(); ctx.fill();
}
function skyline(ctx, th, base, top, seed) {
  const c = th.colors, r = rng(seed), alert = c.alert || '#FF4D4D';
  for (let layer = 0; layer < 2; layer++) {
    let x = 18;
    const a = layer ? 0.9 : 0.32;
    while (x < 372) {
      const w = 14 + r() * 26, h = (layer ? 30 : 50) + r() * (base - top - (layer ? 30 : 10));
      const bw = Math.min(w, 372 - x);
      const y = base - h + (layer ? 0 : -6);
      const tag = layer && r() < 0.18 ? [c.accent, alert, c.glow][Math.floor(r() * 3)] : null;
      ctx.strokeStyle = tag || hexA(c.ink, a); ctx.lineWidth = tag ? 1.5 : 0.9;
      ctx.strokeRect(x, y, bw, base - y);
      if (layer) {
        for (let wy = y + 5; wy < base - 4; wy += 7) for (let wx = x + 4; wx < x + bw - 3; wx += 6) {
          if (r() < 0.22) { ctx.fillStyle = hexA(tag || c.ink, 0.55); ctx.fillRect(wx, wy, 2, 2.6); }
        }
        if (r() < 0.25) { seg(ctx, x + bw / 2, y, x + bw / 2, y - 12, hexA(c.ink, 0.7), 0.8); ctx.fillStyle = alert; ctx.fillRect(x + bw / 2 - 1.2, y - 14, 2.4, 2.4); }
      }
      x += bw + (layer ? 3 + r() * 4 : 1);
    }
  }
  seg(ctx, 14, base, 376, base, hexA(c.ink, 0.8), 1);
  const ix = 250, iy = base - 22;
  ctx.save(); ctx.translate(ix, iy); ctx.rotate(Math.PI / 4); ctx.strokeStyle = c.ink; ctx.lineWidth = 1.4; ctx.strokeRect(-4, -4, 8, 8); ctx.restore();
}
function altimeter(ctx, th, x, y0, y1) {
  const c = th.colors, mid = (y0 + y1) / 2;
  seg(ctx, x, y0, x, y1, hexA(c.ink, 0.6), 0.8);
  for (let y = y0, i = 0; y <= y1; y += 10, i++) {
    seg(ctx, x, y, x - (i % 5 === 0 ? 8 : 4), y, hexA(c.ink, i % 5 === 0 ? 0.9 : 0.5), 0.8);
    if (i % 5 === 0) spaced(ctx, String(1250 - i * 10).replace(/(\d)(\d{3})$/, '$1,$2'), x - 11, y + 2.4, 6, th.fonts.mono, 400, 0.04, 'right', hexA(c.ink, 0.8));
  }
  ctx.fillStyle = c.ground; ctx.fillRect(x - 46, mid - 8, 40, 16);
  ctx.strokeStyle = c.ink; ctx.lineWidth = 1; ctx.strokeRect(x - 46, mid - 8, 40, 16);
  spaced(ctx, '1,204', x - 26, mid + 3.5, 8, th.fonts.mono, 400, 0.04, 'center', c.ink);
  ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(x - 4, mid); ctx.lineTo(x + 3, mid - 5); ctx.lineTo(x + 3, mid + 5); ctx.closePath(); ctx.fill();
}
function reticle(ctx, th, cx, cy) {
  const c = th.colors;
  ctx.strokeStyle = c.ink; ctx.lineWidth = 1.4;
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; ctx.beginPath(); ctx.arc(cx, cy, 44, a - 0.55, a + 0.55); ctx.stroke(); }
  ctx.lineWidth = 0.8; ctx.strokeStyle = hexA(c.ink, 0.55); ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.stroke();
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => seg(ctx, cx + dx * 12, cy + dy * 12, cx + dx * 30, cy + dy * 30, c.ink, 1.2));
  ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(cx, cy, 2.4, 0, Math.PI * 2); ctx.fill();
  for (let a = 0; a < 360; a += 15) { const r = a * Math.PI / 180; seg(ctx, cx + 70 * Math.cos(r), cy + 70 * Math.sin(r), cx + 75 * Math.cos(r), cy + 75 * Math.sin(r), hexA(c.ink, 0.6), 0.8); }
}
function visorVignette(ctx, th, Hl) {
  const c = th.colors;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, 390, Hl);
  ctx.moveTo(30, 230); ctx.quadraticCurveTo(195, 150, 360, 230);
  ctx.quadraticCurveTo(392, Hl * 0.55, 352, Hl - 70); ctx.quadraticCurveTo(195, Hl - 18, 38, Hl - 70);
  ctx.quadraticCurveTo(-2, Hl * 0.55, 30, 230); ctx.closePath();
  ctx.fillStyle = 'rgba(2,4,8,0.78)'; ctx.fill('evenodd');
  ctx.beginPath(); ctx.moveTo(30, 230); ctx.quadraticCurveTo(195, 150, 360, 230);
  ctx.quadraticCurveTo(392, Hl * 0.55, 352, Hl - 70); ctx.quadraticCurveTo(195, Hl - 18, 38, Hl - 70);
  ctx.quadraticCurveTo(-2, Hl * 0.55, 30, 230); ctx.closePath();
  ctx.strokeStyle = hexA(c.ink, 0.35); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.clip();
  const g = ctx.createLinearGradient(60, 200, 260, 520);
  g.addColorStop(0, hexA('#FFFFFF', 0)); g.addColorStop(0.45, hexA('#FFFFFF', 0.06)); g.addColorStop(0.55, hexA('#FFFFFF', 0)); g.addColorStop(1, hexA('#FFFFFF', 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.restore();
}
function terrain(ctx, th, y0, y1, seed) {
  const c = th.colors, r = rng(seed);
  for (let k = 0; k < 9; k++) {
    const yb = y0 + (y1 - y0) * k / 8, amp = 6 + k * 2.2, ph = r() * 6;
    ctx.strokeStyle = hexA(c.glow, 0.12 + k * 0.035); ctx.lineWidth = 0.8; ctx.beginPath();
    for (let x = 30; x <= 360; x += 4) { const y = yb + Math.sin(x * 0.025 + ph) * amp + Math.sin(x * 0.06 + ph * 2) * amp * 0.35; x === 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }
}
function shieldArc(ctx, th, y, frac, label) {
  const c = th.colors, n = 26, x0 = 95, x1 = 295;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), x = x0 + (x1 - x0) * t, yy = y + Math.pow(t - 0.5, 2) * 28;
    const on = t <= frac;
    ctx.save(); ctx.translate(x, yy); ctx.rotate((t - 0.5) * 0.28);
    ctx.fillStyle = on ? c.ink : hexA(c.ink, 0.15); ctx.fillRect(-3, -5, 6, 10);
    ctx.restore();
  }
  ctx.strokeStyle = hexA(c.ink, 0.6); ctx.lineWidth = 0.8; ctx.beginPath();
  for (let x = x0 - 8; x <= x1 + 8; x += 4) { const t = (x - x0) / (x1 - x0); const yy = y + 9 + Math.pow(t - 0.5, 2) * 28; x === x0 - 8 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
  ctx.stroke();
  spaced(ctx, label, 195, y + 26, 6.8, th.fonts.mono, 400, 0.18, 'center', hexA(c.ink, 0.85));
}
function tracker(ctx, th, cx, cy, R, seed) {
  const c = th.colors, r = rng(seed), hostile = c.alert || '#FF4D4D';
  ctx.fillStyle = hexA(c.panel, 0.65); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = hexA(c.ink, 0.8); ctx.lineWidth = 1.1; ctx.stroke();
  ctx.strokeStyle = hexA(c.ink, 0.3); ctx.lineWidth = 0.7;
  [0.33, 0.66].forEach(f => { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke(); });
  seg(ctx, cx - R, cy, cx + R, cy, hexA(c.ink, 0.3), 0.6); seg(ctx, cx, cy - R, cx, cy + R, hexA(c.ink, 0.3), 0.6);
  for (let i = 0; i < 14; i++) { const a0 = -Math.PI / 2 - 0.9 + i * 0.06; ctx.fillStyle = hexA(c.ink, 0.02 + i * 0.012); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a0 + 0.06); ctx.closePath(); ctx.fill(); }
  [[0.55, -2.2, hostile], [0.78, -1.3, hostile], [0.4, 0.9, c.accent], [0.7, 2.6, c.ink]].forEach(([d, a, col]) => {
    const x = cx + R * d * Math.cos(a), y = cy + R * d * Math.sin(a);
    ctx.fillStyle = hexA(col, 0.3); ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(cx, cy - 6); ctx.lineTo(cx + 4.5, cy + 5); ctx.lineTo(cx, cy + 2.5); ctx.lineTo(cx - 4.5, cy + 5); ctx.closePath(); ctx.fill();
  spaced(ctx, '25 M', cx + R - 2, cy + R + 2, 6.5, th.fonts.mono, 400, 0.1, 'right', hexA(c.ink, 0.85));
}
function ammo(ctx, th, x, y) {
  const c = th.colors;
  spaced(ctx, '32', x, y, 30, th.fonts.display, dispWeight(th.fonts.display), 0.02, 'right', c.ink);
  for (let i = 0; i < 32; i++) { const col = i % 16, row = Math.floor(i / 16); ctx.fillStyle = hexA(c.ink, i < 28 ? 0.95 : 0.2); ctx.fillRect(x - 96 + col * 6, y + 8 + row * 9, 3, 7); }
  spaced(ctx, 'MAG 4 · SEMI', x, y + 36, 6.2, th.fonts.mono, 400, 0.12, 'right', hexA(c.ink, 0.8));
}
function grenades(ctx, th, x, y, n) {
  const c = th.colors;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x + i * 13, y, 4, 5.5, 0, 0, Math.PI * 2); ctx.fillStyle = i < n ? c.accent : 'transparent'; ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1; ctx.stroke(); }
}
function waypoint(ctx, th, x, y, label) {
  const c = th.colors;
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.6; ctx.strokeRect(-6, -6, 12, 12); ctx.restore();
  seg(ctx, x, y + 10, x, y + 22, hexA(c.accent, 0.7), 0.8);
  spaced(ctx, label, x, y - 14, 6.6, th.fonts.mono, 400, 0.14, 'center', c.accent);
}
function centerReticle(ctx, th, cx, cy) {
  const c = th.colors;
  ctx.strokeStyle = hexA(c.ink, 0.9); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke();
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => seg(ctx, cx + dx * 20, cy + dy * 20, cx + dx * 28, cy + dy * 28, c.ink, 1.2));
  ctx.fillStyle = c.ink; ctx.fillRect(cx - 1, cy - 1, 2, 2);
}
function podWalls(ctx, th, Hl) {
  const c = th.colors;
  const g = ctx.createLinearGradient(0, 0, 0, Hl);
  g.addColorStop(0, '#0A0F17'); g.addColorStop(0.5, '#121A26'); g.addColorStop(1, '#090D14');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = 'rgba(160,190,220,0.10)'; ctx.lineWidth = 1;
  [[0, 236, 390, 236], [0, Hl - 150, 390, Hl - 150], [62, 236, 62, Hl - 150], [328, 236, 328, Hl - 150], [0, 150, 390, 150]].forEach(([a, b, x, y]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(x, y); ctx.stroke(); });
  ctx.fillStyle = 'rgba(160,190,220,0.22)';
  for (let x = 10; x < 390; x += 24) { [236, Hl - 150].forEach(y => { ctx.beginPath(); ctx.arc(x, y + 5, 1.4, 0, Math.PI * 2); ctx.fill(); }); }
  for (let y = 250; y < Hl - 160; y += 24) { [56, 334].forEach(x => { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill(); }); }
  [[0, 0], [390, 0]].forEach(([x, y]) => {
    const r = ctx.createRadialGradient(x, y + 240, 0, x, y + 240, 220);
    r.addColorStop(0, hexA(c.alert || '#FF4D4D', 0.22)); r.addColorStop(1, hexA(c.alert || '#FF4D4D', 0));
    ctx.fillStyle = r; ctx.fillRect(0, 0, 390, Hl);
  });
}
function podWindowPath(ctx, x, y, w, h, ch) {
  ctx.beginPath();
  ctx.moveTo(x + ch, y); ctx.lineTo(x + w - ch, y); ctx.lineTo(x + w, y + ch); ctx.lineTo(x + w, y + h - ch);
  ctx.lineTo(x + w - ch, y + h); ctx.lineTo(x + ch, y + h); ctx.lineTo(x, y + h - ch); ctx.lineTo(x, y + ch); ctx.closePath();
}
function reentry(ctx, th, x, y, w, h, seed, ch) {
  const c = th.colors, r = rng(seed), cx = x + w / 2; ch = ch || 26;
  podWindowPath(ctx, x, y, w, h, ch);
  ctx.save(); ctx.clip();
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, '#02040A'); sky.addColorStop(0.45, '#0B1630'); sky.addColorStop(0.62, '#1E3A66'); sky.addColorStop(1, '#0A1424');
  ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`; ctx.fillRect(x + r() * w, y + r() * h * 0.45, 1, 1); }
  const R = w * 2.2, pcx = cx + w * 0.15, pcy = y + h * 0.66 + R;
  ctx.beginPath(); ctx.arc(pcx, pcy, R, 0, Math.PI * 2);
  ctx.fillStyle = '#071019'; ctx.fill();
  const limb = ctx.createRadialGradient(pcx, pcy, R - 2, pcx, pcy, R + 26);
  limb.addColorStop(0, 'rgba(120,200,255,0.0)'); limb.addColorStop(0.15, 'rgba(120,200,255,0.85)'); limb.addColorStop(0.5, 'rgba(255,170,90,0.35)'); limb.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.fillStyle = limb; ctx.beginPath(); ctx.arc(pcx, pcy, R + 26, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 120; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 0.22, d = R - 4 - r() * 70;
    const px = pcx + d * Math.cos(a), py = pcy + d * Math.sin(a);
    if (py > y + h * 0.66 && py < y + h) { ctx.fillStyle = hexA(c.accent, 0.4 + r() * 0.6); ctx.fillRect(px, py, 1.4, 1.4); }
  }
  ctx.strokeStyle = 'rgba(200,220,255,0.12)'; ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) { const yy = y + h * (0.72 + r() * 0.22); ctx.beginPath(); ctx.moveTo(x, yy); ctx.bezierCurveTo(x + w * 0.3, yy - 8, x + w * 0.6, yy + 6, x + w, yy - 4); ctx.stroke(); }
  for (let i = 0; i < 95; i++) {
    const u = r(), edge = Math.pow(Math.abs(u - 0.5) * 2, 0.6), side = u > 0.5 ? 1 : 0;
    const ex = x + w / 2 + (side ? 1 : -1) * edge * w / 2;
    const len = (30 + r() * 150) * (0.45 + edge * 0.75), lw = 0.6 + r() * (1 + edge * 2.6), sy = y + h + 10, top = sy - len;
    const gr = ctx.createLinearGradient(0, sy, 0, top);
    gr.addColorStop(0, 'rgba(255,245,220,0.95)'); gr.addColorStop(0.35, 'rgba(255,170,60,0.75)'); gr.addColorStop(1, 'rgba(255,90,30,0)');
    ctx.strokeStyle = gr; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(ex, sy); ctx.quadraticCurveTo(ex + (side ? 6 : -6), sy - len * 0.5, ex + (side ? 1 : -1) * (8 + 22 * r()) * edge, top); ctx.stroke();
  }
  const heat = ctx.createRadialGradient(cx, y + h + 30, 10, cx, y + h + 30, h * 0.9);
  heat.addColorStop(0, 'rgba(255,150,50,0.55)'); heat.addColorStop(1, 'rgba(255,90,30,0)');
  ctx.fillStyle = heat; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(255,${200 + Math.floor(r() * 55)},${120 + Math.floor(r() * 80)},${0.5 + r() * 0.5})`; ctx.fillRect(x + r() * w, y + h * (0.4 + r() * 0.6), 1.6, 1.6); }
  const glare = ctx.createLinearGradient(x, y, x + w, y + h);
  glare.addColorStop(0, 'rgba(255,255,255,0)'); glare.addColorStop(0.42, 'rgba(255,255,255,0.07)'); glare.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = glare; ctx.fillRect(x, y, w, h);
  ctx.restore();
  podWindowPath(ctx, x - 8, y - 8, w + 16, h + 16, ch + 4); ctx.strokeStyle = '#2B3646'; ctx.lineWidth = 10; ctx.stroke();
  podWindowPath(ctx, x, y, w, h, ch); ctx.strokeStyle = 'rgba(200,220,240,0.35)'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = '#4A586C';
  [[x + 10, y - 8], [x + w - 10, y - 8], [x + 10, y + h + 8], [x + w - 10, y + h + 8], [x - 8, y + h / 2], [x + w + 8, y + h / 2], [cx, y - 8], [cx, y + h + 8]].forEach(([bx, by]) => { ctx.beginPath(); ctx.arc(bx, by, 2.4, 0, Math.PI * 2); ctx.fill(); });
}
function grabHandle(ctx, x, y, h) {
  ctx.strokeStyle = '#3A475A'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x < 195 ? -10 : 10), y + 8); ctx.lineTo(x + (x < 195 ? -10 : 10), y + h - 8); ctx.lineTo(x, y + h); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.strokeStyle = 'rgba(242,179,61,0.8)'; ctx.lineWidth = 2;
  for (let k = 0; k < 4; k++) { const yy = y + 18 + k * (h - 36) / 3; ctx.beginPath(); ctx.moveTo(x + (x < 195 ? -13 : 7), yy); ctx.lineTo(x + (x < 195 ? -7 : 13), yy + 4); ctx.stroke(); }
}
function sideScreen(ctx, th, x, y, w, h, kind) {
  const c = th.colors, alert = c.alert || '#FF4D4D';
  ctx.fillStyle = 'rgba(4,10,18,0.9)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = hexA(c.ink, 0.5); ctx.lineWidth = 0.8; ctx.strokeRect(x, y, w, h);
  if (kind === 'alt') {
    for (let i = 0; i <= 8; i++) { const yy = y + 10 + i * (h - 20) / 8; seg(ctx, x + w - 4, yy, x + w - (i % 2 ? 8 : 13), yy, hexA(c.ink, 0.7), 0.8); }
    spaced(ctx, 'ALT', x + 4, y + 10, 5.6, th.fonts.mono, 400, 0.1, 'left', hexA(c.ink, 0.8));
    ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(x + w - 14, y + h * 0.62); ctx.lineTo(x + w - 22, y + h * 0.62 - 4); ctx.lineTo(x + w - 22, y + h * 0.62 + 4); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(x + 14, y + h - 10); ctx.rotate(-Math.PI / 2); spaced(ctx, '12,400 M', 0, 0, 7, th.fonts.mono, 400, 0.1, 'left', c.ink); ctx.restore();
  } else {
    spaced(ctx, 'HULL', x + 4, y + 10, 5.6, th.fonts.mono, 400, 0.1, 'left', hexA(c.ink, 0.8));
    for (let i = 0; i < 12; i++) { const hot = i < 9; ctx.fillStyle = hot ? (i > 6 ? alert : c.accent) : hexA(c.ink, 0.15); ctx.fillRect(x + 8, y + h - 12 - i * ((h - 30) / 12), w - 16, (h - 30) / 12 - 2); }
    ctx.save(); ctx.translate(x + w - 4, y + 16); ctx.rotate(Math.PI / 2); spaced(ctx, '1,640°C', 0, 0, 6.4, th.fonts.mono, 400, 0.1, 'left', alert); ctx.restore();
  }
}
function podConsole(ctx, th, y, T) {
  const c = th.colors, alert = c.alert || '#FF4D4D', mono = th.fonts.mono;
  ctx.fillStyle = 'rgba(4,10,18,0.92)'; ctx.fillRect(40, y, 310, 58);
  ctx.strokeStyle = hexA(c.ink, 0.5); ctx.lineWidth = 0.8; ctx.strokeRect(40, y, 310, 58);
  ctx.save(); ctx.beginPath(); ctx.rect(40, y - 9, 310, 6); ctx.clip();
  ctx.fillStyle = c.accent; ctx.fillRect(40, y - 9, 310, 6); ctx.fillStyle = '#0A0F17';
  for (let i = 40; i < 360; i += 12) { ctx.beginPath(); ctx.moveTo(i, y - 3); ctx.lineTo(i + 6, y - 3); ctx.lineTo(i + 12, y - 9); ctx.lineTo(i + 6, y - 9); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  spaced(ctx, 'IMPACT IN', 52, y + 14, 6.4, mono, 400, 0.14, 'left', hexA(c.accent, 0.9));
  spaced(ctx, T.impact || '00:47', 52, y + 44, 28, th.fonts.display, dispWeight(th.fonts.display), 0.04, 'left', c.accent);
  spaced(ctx, T.alt2 || 'ALT 12,400 M', 338, y + 16, 6.8, mono, 400, 0.1, 'right', c.ink);
  spaced(ctx, T.vel || 'VEL 1,180 M/S', 338, y + 29, 6.8, mono, 400, 0.1, 'right', c.ink);
  ctx.fillStyle = hexA(alert, 0.2); ctx.fillRect(176, y + 38, 162, 13);
  spaced(ctx, T.brake || 'BRAKING THRUSTERS: ARMED', 334, y + 48, 6.6, mono, 400, 0.1, 'right', alert);
}
function hatchDoor(ctx, th, x, y, w, h) {
  const c = th.colors;
  podWindowPath(ctx, x, y, w, h, 34);
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#1A2331'); g.addColorStop(0.5, '#141C28'); g.addColorStop(1, '#0E141D');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#33404F'; ctx.lineWidth = 6; ctx.stroke();
  podWindowPath(ctx, x + 10, y + 10, w - 20, h - 20, 28); ctx.strokeStyle = 'rgba(170,200,230,0.14)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = 'rgba(170,200,230,0.08)';
  [[x + 10, y + h * 0.36, x + w - 10, y + h * 0.36], [x + 10, y + h * 0.78, x + w - 10, y + h * 0.78]].forEach(([a, b, cc, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(cc, d); ctx.stroke(); });
  [[x - 4, y + h * 0.22], [x - 4, y + h * 0.72]].forEach(([hx, hy]) => { ctx.fillStyle = '#2A3544'; ctx.fillRect(hx - 6, hy - 16, 12, 32); ctx.strokeStyle = 'rgba(170,200,230,0.25)'; ctx.lineWidth = 0.8; ctx.strokeRect(hx - 6, hy - 16, 12, 32); });
}
function explosiveBolt(ctx, th, x, y) {
  const c = th.colors;
  ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; const px = x + 7 * Math.cos(a), py = y + 7 * Math.sin(a); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath();
  ctx.fillStyle = '#3A4658'; ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = c.alert || '#FF4D4D'; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
}
function hatchScreen(ctx, th, x, y, w, h, T, obj) {
  const c = th.colors, alert = c.alert || '#FF4D4D', mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp);
  ctx.fillStyle = '#2A3544'; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  const sg = ctx.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, '#04121C'); sg.addColorStop(1, '#020A12');
  ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w * 0.7);
  glow.addColorStop(0, hexA(c.ink, 0.1)); glow.addColorStop(1, hexA(c.ink, 0));
  ctx.fillStyle = glow; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = hexA(c.ink, 0.05); for (let yy = y; yy < y + h; yy += 3) ctx.fillRect(x, yy, w, 1);
  spaced(ctx, 'POD COMMS // DESCENT', x + 8, y + 12, 6.2, mono, 400, 0.12, 'left', hexA(c.ink, 0.75));
  spaced(ctx, T.sync || 'SQUAD SYNC 4/4', x + w - 8, y + 12, 6.2, mono, 400, 0.12, 'right', c.accent);
  seg(ctx, x + 8, y + 17, x + w - 8, y + 17, hexA(c.ink, 0.3), 0.6);
  spaced(ctx, 'IMPACT IN', x + 8, y + 31, 6.2, mono, 400, 0.12, 'left', hexA(c.accent, 0.9));
  spaced(ctx, T.impact || '00:47', x + 8, y + 58, 26, disp, dw, 0.04, 'left', c.accent);
  [[T.alt2 || 'ALT 12,400 M', c.ink], [T.vel || 'VEL 1,180 M/S', c.ink], [T.chute || 'CHUTE: STOWED', c.ink], [T.retro || 'RETRO FIRE @ 50 M', alert]].forEach(([t, col], i) => spaced(ctx, t, x + w - 8, y + 30 + i * 9.5, 6.2, mono, 400, 0.1, 'right', col));
  seg(ctx, x + 8, y + 68, x + w - 8, y + 68, hexA(c.ink, 0.3), 0.6);
  spaced(ctx, 'OBJECTIVE', x + w / 2, y + 80, 6, mono, 400, 0.14, 'center', hexA(c.ink, 0.7));
  const fs = Math.min(15, 15 * (w - 20) / Math.max(1, measureSpaced(ctx, obj, 15, disp, dw, 0.06)));
  spaced(ctx, obj, x + w / 2, y + 97, fs, disp, dw, 0.06, 'center', c.ink);
}
function releaseHandle(ctx, th, cx, y) {
  const c = th.colors;
  ctx.save(); ctx.beginPath(); ctx.rect(cx - 52, y, 104, 30); ctx.clip();
  ctx.fillStyle = c.accent; ctx.fillRect(cx - 52, y, 104, 30); ctx.fillStyle = '#0B1018';
  for (let i = cx - 70; i < cx + 60; i += 14) { ctx.beginPath(); ctx.moveTo(i, y + 30); ctx.lineTo(i + 7, y + 30); ctx.lineTo(i + 37, y); ctx.lineTo(i + 30, y); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#0B1018'; ctx.fillRect(cx - 40, y + 6, 80, 18);
  ctx.strokeStyle = '#C9CED6'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 26, y + 15); ctx.lineTo(cx + 26, y + 15); ctx.moveTo(cx, y + 15); ctx.lineTo(cx, y + 2); ctx.stroke(); ctx.lineCap = 'butt';
  spaced(ctx, 'HATCH RELEASE // EXPLOSIVE', cx, y + 44, 6, th.fonts.mono, 400, 0.12, 'center', c.accent);
}
function harness(ctx, Hl) {
  [[-1], [1]].forEach(([d]) => {
    const x0 = d < 0 ? 0 : 390;
    ctx.beginPath();
    ctx.moveTo(x0, Hl - 196); ctx.lineTo(x0 - d * 44, Hl - 214); ctx.lineTo(195 + d * 8, Hl + 6); ctx.lineTo(195 + d * 52, Hl + 6); ctx.closePath();
    ctx.fillStyle = '#1B1F26'; ctx.fill(); ctx.strokeStyle = 'rgba(200,210,220,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = 'rgba(200,210,220,0.13)'; ctx.setLineDash([3, 3]); ctx.beginPath();
    ctx.moveTo(x0 - d * 8, Hl - 200); ctx.lineTo(195 + d * 44, Hl + 6); ctx.moveTo(x0 - d * 36, Hl - 211); ctx.lineTo(195 + d * 16, Hl + 6); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#5A6575'; const ax = x0 - d * 70, ay = Hl - 150; ctx.save(); ctx.translate(ax, ay); ctx.rotate(d * -0.95); ctx.fillRect(-14, -6, 28, 12); ctx.strokeStyle = '#8C97A6'; ctx.strokeRect(-14, -6, 28, 12); ctx.restore();
  });
  ctx.fillStyle = '#5A6575'; ctx.fillRect(171, Hl - 22, 48, 26); ctx.strokeStyle = '#8C97A6'; ctx.lineWidth = 1.2; ctx.strokeRect(171, Hl - 22, 48, 26);
  ctx.fillStyle = '#2A313B'; ctx.beginPath(); ctx.arc(195, Hl - 9, 8, 0, Math.PI * 2); ctx.fill();
}
const POD_TEAL = '#5FE0C0';
function quad(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
function lin(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rad(ctx, x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }

// grime, scratches and runoff clipped to the current path
function grime(ctx, x, y, w, h, seed, amt) {
  const r = rng(seed); amt = amt || 1;
  for (let i = 0; i < 260 * amt; i++) { const a = r(); ctx.fillStyle = a < 0.5 ? `rgba(0,0,0,${0.05 + r() * 0.12})` : `rgba(200,210,220,${0.02 + r() * 0.05})`; const z = 0.4 + r() * 1.6; ctx.fillRect(x + r() * w, y + r() * h, z, z); }
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 14 * amt; i++) { const sx = x + r() * w, sy = y + r() * h, l = 4 + r() * 18, a = r() * Math.PI; ctx.strokeStyle = `rgba(210,220,230,${0.04 + r() * 0.08})`; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); ctx.stroke(); }
  for (let i = 0; i < 8 * amt; i++) { const sx = x + r() * w, sy = y + r() * h * 0.6, l = 20 + r() * 60; ctx.fillStyle = lin(ctx, 0, sy, 0, sy + l, [[0, 'rgba(0,0,0,0.12)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(sx, sy, 1.2 + r() * 2.5, l); }
}
function plate(ctx, pts, seed, light) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  ctx.save(); quad(ctx, pts);
  ctx.fillStyle = lin(ctx, x, y, x + w * (light || 0.6), y + h, [[0, '#2A323C'], [0.55, '#1C232C'], [1, '#12171E']]); ctx.fill();
  ctx.clip();
  grime(ctx, x, y, w, h, seed, Math.max(0.4, (w * h) / 30000));
  ctx.fillStyle = rad(ctx, x + w * 0.5, y + h * 0.5, Math.min(w, h) * 0.2, Math.max(w, h) * 0.75, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.45)']]); ctx.fillRect(x, y, w, h);
  ctx.restore();
  quad(ctx, pts); ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pts[0][0] + 1, pts[0][1] + 1); ctx.lineTo(pts[1][0] - 1, pts[1][1] + 1); ctx.strokeStyle = 'rgba(210,225,240,0.22)'; ctx.lineWidth = 0.8; ctx.stroke();
}
function screws(ctx, pts) {
  pts.forEach(([x, y]) => {
    ctx.fillStyle = rad(ctx, x - 0.6, y - 0.6, 0.2, 2.2, [[0, '#8A96A6'], [1, '#2A323C']]); ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x - 1.3, y); ctx.lineTo(x + 1.3, y); ctx.stroke();
  });
}
function vent(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  for (let yy = y; yy < y + h; yy += 4) { ctx.fillRect(x, yy, w, 2); ctx.fillStyle = 'rgba(200,215,230,0.08)'; ctx.fillRect(x, yy + 2, w, 0.6); ctx.fillStyle = 'rgba(0,0,0,0.55)'; }
}
function cable(ctx, pts, wdt) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i += 2) ctx.quadraticCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]); };
  path(); ctx.strokeStyle = '#07090C'; ctx.lineWidth = wdt + 1.5; ctx.stroke();
  path(); ctx.strokeStyle = '#1D232B'; ctx.lineWidth = wdt; ctx.stroke();
  ctx.save(); ctx.translate(-wdt * 0.2, -wdt * 0.25); path(); ctx.strokeStyle = 'rgba(190,205,220,0.14)'; ctx.lineWidth = wdt * 0.25; ctx.stroke(); ctx.restore();
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
}
function decal(ctx, th, str, x, y, size, color) { spaced(ctx, str, x, y, size, th.fonts.mono, 400, 0.14, 'left', color || 'rgba(220,200,150,0.42)'); }

function realWindow(ctx, th, x, y, w, h, seed) {
  const r = rng(seed);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, '#0E1626'], [0.12, '#2B3850'], [0.26, '#6F7C90'], [0.4, '#A9B1BC'], [0.7, '#8C95A2'], [1, '#3B4350']]); ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x + w * 0.85, y + h * 0.18, 2, w * 1.1, [[0, 'rgba(255,240,215,0.55)'], [0.25, 'rgba(255,220,180,0.16)'], [1, 'rgba(255,220,180,0)']]); ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';
  for (let layer = 0; layer < 3; layer++) {
    const n = [40, 60, 90][layer];
    for (let i = 0; i < n; i++) {
      const t = r(), cy = y + h * (0.3 + layer * 0.14 + t * 0.3), cx = x + r() * w;
      const sc = 0.5 + (cy - y) / h, rw = (10 + r() * 26) * sc, rh = rw * (0.25 + r() * 0.2);
      ctx.fillStyle = rad(ctx, cx, cy - rh * 0.2, 0, rw, [[0, `rgba(245,247,250,${0.22 + r() * 0.25})`], [0.6, 'rgba(225,230,238,0.08)'], [1, 'rgba(225,230,238,0)']]);
      ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rad(ctx, cx, cy + rh * 0.5, 0, rw * 0.9, [[0, 'rgba(70,80,96,0.18)'], [1, 'rgba(70,80,96,0)']]);
      ctx.beginPath(); ctx.ellipse(cx, cy + rh * 0.45, rw * 0.9, rh * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h * 0.45, [[0, 'rgba(10,16,30,0.5)'], [1, 'rgba(10,16,30,0)']]); ctx.fillRect(x, y, w, h);
  const mx = x + w * 0.66; ctx.strokeStyle = 'rgba(20,24,32,0.55)'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(mx, y + h * 0.33); ctx.lineTo(mx, y + h * 0.43); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) {
    const side = r() < 0.5, ex = side ? x + r() * 8 : x + w - r() * 8, len = 20 + r() * 90, sy = y + h + 4;
    ctx.strokeStyle = lin(ctx, 0, sy, 0, sy - len, [[0, 'rgba(255,190,120,0.35)'], [0.5, 'rgba(255,120,50,0.12)'], [1, 'rgba(255,90,30,0)']]);
    ctx.lineWidth = 0.6 + r() * 1.4; ctx.beginPath(); ctx.moveTo(ex, sy); ctx.lineTo(ex + (side ? 4 : -4) * r(), sy - len); ctx.stroke();
  }
  ctx.fillStyle = lin(ctx, 0, y + h, 0, y + h * 0.7, [[0, 'rgba(255,130,50,0.22)'], [1, 'rgba(255,130,50,0)']]); ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(30,34,40,${0.1 + r() * 0.25})`; const z = 0.4 + r() * 1.2; ctx.fillRect(x + r() * w, y + r() * h, z, z); }
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h * 0.4, [[0, 'rgba(255,255,255,0)'], [0.46, 'rgba(255,255,255,0.06)'], [0.5, 'rgba(255,255,255,0)']]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = lin(ctx, x, 0, x + 14, 0, [[0, 'rgba(0,0,0,0.6)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x, y, 14, h);
  ctx.fillStyle = lin(ctx, x + w, 0, x + w - 14, 0, [[0, 'rgba(0,0,0,0.6)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x + w - 14, y, 14, h);
  ctx.restore();
}
function crtScreen(ctx, th, pts, draw) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  quad(ctx, pts.map(([px, py], i) => [px + (i === 0 || i === 3 ? -6 : 6), py + (i < 2 ? -6 : 6)]));
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, '#2C3540'], [1, '#161C24']]); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1.4; ctx.stroke();
  quad(ctx, pts); ctx.fillStyle = '#020807'; ctx.fill();
  ctx.save(); quad(ctx, pts); ctx.clip();
  const [p0, p1, , p3] = pts, ww = p1[0] - p0[0], hh = p3[1] - p0[1], k = (p1[1] - p0[1]) / ww;
  ctx.save(); ctx.translate(p0[0], p0[1]); ctx.transform(1, k, 0, 1, 0, 0);
  ctx.shadowColor = hexA(POD_TEAL, 0.6); ctx.shadowBlur = 4;
  draw(ww, hh);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; for (let yy = 0; yy < hh; yy += 2) ctx.fillRect(0, yy, ww, 1);
  ctx.restore();
  ctx.fillStyle = rad(ctx, x + w / 2, y + h / 2, Math.min(w, h) * 0.3, Math.max(w, h) * 0.8, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.55)']]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = lin(ctx, x, y, x + w * 0.6, y + h * 0.6, [[0, 'rgba(255,255,255,0.07)'], [0.5, 'rgba(255,255,255,0)']]); ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x + w / 2, y + h / 2, 10, Math.max(w, h) * 0.9, [[0, hexA(POD_TEAL, 0.06)], [1, hexA(POD_TEAL, 0)]]); ctx.fillRect(x - w * 0.5, y - h * 0.5, w * 2, h * 2);
  ctx.restore();
}
function feedUI(ctx, th, w, h, title, seed) {
  const r = rng(seed), T = POD_TEAL, mono = th.fonts.mono;
  for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(120,220,195,${r() * 0.12})`; ctx.fillRect(r() * w, r() * h, 1, 1); }
  ctx.fillStyle = rad(ctx, w * 0.5, h * 0.55, 4, w * 0.45, [[0, 'rgba(120,220,195,0.16)'], [1, 'rgba(120,220,195,0)']]); ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = hexA(T, 0.85); ctx.lineWidth = 0.7; ctx.beginPath();
  for (let x = 6; x < w - 6; x += 1) { const a = (Math.sin(x * 0.9 + seed) * 0.6 + Math.sin(x * 0.23 + seed * 2)) * Math.sin(x * 0.05 + 0.4) * h * 0.11; x === 6 ? ctx.moveTo(x, h * 0.72 + a) : ctx.lineTo(x, h * 0.72 + a); }
  ctx.stroke();
  ctx.strokeStyle = hexA(T, 0.3); ctx.lineWidth = 0.5; ctx.strokeRect(5, 16, w - 10, h - 30);
  spaced(ctx, title, 6, 10, 5, mono, 400, 0.12, 'left', hexA(T, 0.95));
  spaced(ctx, 'RX  -62 DBM', w - 6, 10, 5, mono, 400, 0.12, 'right', hexA(T, 0.7));
  spaced(ctx, 'ENC  AES  //  LINK NOMINAL', 6, h - 5, 4.6, mono, 400, 0.12, 'left', hexA(T, 0.6));
}
function radarUI(ctx, th, w, h) {
  const T = POD_TEAL, cx = w / 2, cy = h * 0.56, R = Math.min(w, h) * 0.36, mono = th.fonts.mono;
  ctx.strokeStyle = hexA(T, 0.45); ctx.lineWidth = 0.6;
  [1, 0.66, 0.33].forEach(f => { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke(); });
  for (let a = 0; a < 360; a += 10) { const q = a * Math.PI / 180; seg(ctx, cx + R * Math.cos(q), cy + R * Math.sin(q), cx + (R + (a % 30 ? 2 : 4)) * Math.cos(q), cy + (R + (a % 30 ? 2 : 4)) * Math.sin(q), hexA(T, 0.6), 0.5); }
  seg(ctx, cx - R, cy, cx + R, cy, hexA(T, 0.25), 0.5); seg(ctx, cx, cy - R, cx, cy + R, hexA(T, 0.25), 0.5);
  for (let i = 0; i < 24; i++) { const a = -1.4 + i * 0.03; ctx.fillStyle = hexA(T, 0.008 + i * 0.008); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a, a + 0.03); ctx.closePath(); ctx.fill(); }
  [[0.5, -0.9, T], [0.72, 2.3, '#FF6A5A'], [0.28, 1.2, T]].forEach(([d, a, col]) => { ctx.fillStyle = col; ctx.fillRect(cx + R * d * Math.cos(a) - 1.2, cy + R * d * Math.sin(a) - 1.2, 2.4, 2.4); });
  spaced(ctx, 'LZ TRACK  //  GRID 9-K', 6, 10, 5, mono, 400, 0.12, 'left', hexA(T, 0.95));
  spaced(ctx, 'BRG 274  RNG 3.1 KM', 6, h - 5, 4.6, mono, 400, 0.12, 'left', hexA(T, 0.6));
}
function descentUI(ctx, th, w, h, T0) {
  const T = POD_TEAL, mono = th.fonts.mono;
  ctx.strokeStyle = hexA(T, 0.15); ctx.lineWidth = 0.5;
  for (let x = 6; x < w - 6; x += 8) { ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, h - 12); ctx.stroke(); }
  for (let y = 16; y < h - 12; y += 8) { ctx.beginPath(); ctx.moveTo(6, y); ctx.lineTo(w - 6, y); ctx.stroke(); }
  ctx.strokeStyle = hexA(T, 0.95); ctx.lineWidth = 0.9; ctx.beginPath();
  for (let x = 6; x < w * 0.7; x += 1) { const t = x / w, y = 18 + (h - 32) * (1 - Math.exp(-t * 2.6)); x === 6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  spaced(ctx, 'DESCENT PROFILE', 6, 10, 5, mono, 400, 0.12, 'left', hexA(T, 0.95));
  spaced(ctx, 'T- ' + (T0.impact || '00:47'), w - 6, 10, 5, mono, 400, 0.12, 'right', '#FFC36A');
  spaced(ctx, T0.alt2 || 'ALT 12,400 M', w - 6, h * 0.48, 6, mono, 400, 0.08, 'right', hexA(T, 0.95));
  spaced(ctx, T0.vel || 'VEL 1,180 M/S', w - 6, h * 0.48 + 9, 6, mono, 400, 0.08, 'right', hexA(T, 0.95));
  spaced(ctx, T0.retro || 'RETRO FIRE @ 50 M', 6, h - 5, 4.6, mono, 400, 0.12, 'left', '#FF6A5A');
}
function led(ctx, x, y, col, on) {
  ctx.fillStyle = '#0A0D11'; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = on ? col : hexA(col, 0.25); ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
  if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, 0, 9, [[0, hexA(col, 0.35)], [1, hexA(col, 0)]]); ctx.fillRect(x - 9, y - 9, 18, 18); ctx.restore(); }
}
function strap(ctx, pts, seed) {
  ctx.save(); quad(ctx, pts);
  ctx.fillStyle = lin(ctx, pts[0][0], pts[0][1], pts[2][0], pts[2][1], [[0, '#22272E'], [0.5, '#161A20'], [1, '#0C0F13']]); ctx.fill(); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 0.6;
  for (let i = -400; i < 400; i += 2.4) { ctx.beginPath(); ctx.moveTo(pts[0][0] + i, 0); ctx.lineTo(pts[0][0] + i + 400, 2000); ctx.stroke(); }
  ctx.restore();
  quad(ctx, pts); ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1.2; ctx.stroke();
}
function realHarness(ctx, Hl) {
  strap(ctx, [[-6, Hl - 132], [26, Hl - 146], [206, Hl + 6], [174, Hl + 6]], 1);
  strap(ctx, [[396, Hl - 132], [364, Hl - 146], [184, Hl + 6], [216, Hl + 6]], 2);
  [[16, Hl - 128, -1], [374, Hl - 128, 1]].forEach(([x, y, d]) => { ctx.save(); ctx.translate(x + (d < 0 ? 22 : -22), y + 18); ctx.rotate(d < 0 ? 0.7 : -0.7); ctx.fillStyle = lin(ctx, 0, -6, 0, 6, [[0, '#7A8694'], [1, '#2A313B']]); ctx.fillRect(-12, -5, 24, 10); ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1; ctx.strokeRect(-12, -5, 24, 10); ctx.restore(); });
  ctx.fillStyle = lin(ctx, 0, Hl - 26, 0, Hl, [[0, '#6E7A88'], [0.5, '#3E4752'], [1, '#232A33']]);
  ctx.fillRect(172, Hl - 26, 46, 30); ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1.2; ctx.strokeRect(172, Hl - 26, 46, 30);
  ctx.fillStyle = rad(ctx, 193, Hl - 13, 1, 9, [[0, '#8C98A6'], [1, '#2A313B']]); ctx.beginPath(); ctx.arc(195, Hl - 11, 8, 0, Math.PI * 2); ctx.fill();
}
function filmGrain(ctx, Hl, seed, amt) {
  const r = rng(seed); amt = amt == null ? 1 : amt;
  for (let i = 0; i < Math.round(5000 * amt); i++) { ctx.fillStyle = r() < 0.5 ? `rgba(0,0,0,${r() * 0.14})` : `rgba(255,255,255,${r() * 0.05})`; ctx.fillRect(r() * 390, r() * Hl, 0.8, 0.8); }
  ctx.fillStyle = rad(ctx, 195, Hl * 0.5, Hl * 0.25, Hl * 0.75, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.6)']]); ctx.fillRect(0, 0, 390, Hl);
}

function podCockpit(ctx, th, Hl, T, opts) {
  const top = opts.top, bot = Hl - 150, wx = 152, ww = 86;
  ctx.fillStyle = '#05070A'; ctx.fillRect(0, 0, 390, Hl);
  plate(ctx, [[0, 0], [390, 0], [390, top - 40], [0, top - 40]], 7, 0.7);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 390, top - 40); ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(195, top - 70, 150, 46, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,215,230,0.12)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(195, top - 72, 156, 49, 0, Math.PI, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; screws(ctx, [[195 + 150 * Math.cos(a), top - 70 + 46 * Math.sin(a)]]); }
  ctx.strokeStyle = '#3A4554'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(160, top - 92); ctx.quadraticCurveTo(195, top - 112, 230, top - 92); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = lin(ctx, 0, 0, 0, top - 40, [[0, 'rgba(0,0,0,0.7)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, 390, top - 40);
  ctx.restore();
  plate(ctx, [[0, top - 40], [390, top - 40], [306, top + 8], [84, top + 8]], 11, 0.9);
  vent(ctx, 112, top - 30, 70, 18);
  quad(ctx, [[262, top - 30], [384, top - 30], [372, top - 20], [256, top - 20]]);
  ctx.fillStyle = lin(ctx, 256, 0, 384, 0, [[0, 'rgba(225,240,255,0.25)'], [0.3, 'rgba(235,245,255,0.95)'], [1, 'rgba(225,240,255,0.7)']]); ctx.fill();
  plate(ctx, [[0, top - 40], [142, top + 8], [142, bot], [0, bot + 44]], 21, 0.4);
  plate(ctx, [[390, top - 40], [248, top + 8], [248, bot], [390, bot + 44]], 31, 0.9);
  plate(ctx, [[56, bot + 18], [334, bot + 18], [400, Hl + 4], [-10, Hl + 4]], 41, 0.5);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
  for (let i = -9; i <= 9; i++) { ctx.beginPath(); ctx.moveTo(195 + i * 15, bot + 18); ctx.lineTo(195 + i * 44, Hl); ctx.stroke(); }
  cable(ctx, [[2, top + 20], [30, top + 40], [26, top + 120], [20, top + 210], [30, bot + 30]], 5);
  cable(ctx, [[388, top + 10], [362, top + 30], [370, top + 120], [378, top + 200], [360, bot + 34]], 4);
  realWindow(ctx, th, wx, top + 16, ww, bot - top - 26, opts.seed);
  [[wx - 13, wx], [wx + ww, wx + ww + 13]].forEach(([a, b], i) => {
    ctx.fillStyle = lin(ctx, a, 0, b, 0, i ? [[0, '#121820'], [0.4, '#3B4656'], [1, '#1A212A']] : [[0, '#1A212A'], [0.6, '#3B4656'], [1, '#121820']]);
    ctx.fillRect(a, top + 4, 13, bot - top - 4);
    ctx.save(); ctx.beginPath(); ctx.rect(a, top + 4, 13, bot - top - 4); ctx.clip(); grime(ctx, a, top + 4, 13, bot - top - 4, 50 + i, 0.4); ctx.restore();
  });
  ctx.fillStyle = lin(ctx, 0, top + 2, 0, top + 18, [[0, '#3A4554'], [1, '#1A212A']]); ctx.fillRect(wx - 13, top + 2, ww + 26, 14);
  ctx.fillStyle = lin(ctx, 0, bot - 12, 0, bot + 4, [[0, '#2E3846'], [1, '#141920']]); ctx.fillRect(wx - 13, bot - 12, ww + 26, 16);
  screws(ctx, Array.from({ length: 11 }, (_, i) => [wx - 6.5, top + 28 + i * ((bot - top - 52) / 10)]).concat(Array.from({ length: 11 }, (_, i) => [wx + ww + 6.5, top + 28 + i * ((bot - top - 52) / 10)])));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, wx + ww / 2, top + (bot - top) * 0.45, 20, 170, [[0, 'rgba(190,205,225,0.10)'], [1, 'rgba(190,205,225,0)']]); ctx.fillRect(0, 0, 390, Hl);
  ctx.fillStyle = rad(ctx, 330, top - 20, 4, 200, [[0, 'rgba(220,235,255,0.16)'], [1, 'rgba(220,235,255,0)']]); ctx.fillRect(0, 0, 390, Hl);
  ctx.restore();
  const L1 = [[22, top + 44], [126, top + 60], [126, top + 166], [22, top + 180]];
  const L2 = [[26, top + 204], [126, top + 198], [126, top + 286], [26, top + 300]];
  const R1 = [[264, top + 60], [368, top + 44], [368, top + 180], [264, top + 166]];
  const R2 = [[264, top + 198], [364, top + 204], [364, top + 300], [264, top + 286]];
  crtScreen(ctx, th, L1, (w, h) => feedUI(ctx, th, w, h, T.feedL || 'CH 1 // SQUAD LEAD', 3));
  crtScreen(ctx, th, R1, (w, h) => feedUI(ctx, th, w, h, T.feedR || 'CH 2 // POD 06', 9));
  crtScreen(ctx, th, L2, (w, h) => radarUI(ctx, th, w, h));
  crtScreen(ctx, th, R2, (w, h) => descentUI(ctx, th, w, h, T));
  [['#FF5A4A', 1], [POD_TEAL, 1], ['#C8D2DE', 0], ['#FF5A4A', 0], [POD_TEAL, 1], ['#FFC36A', 1]].forEach(([col, on], i) => { led(ctx, 136, top + 76 + i * 15, col, on); led(ctx, 254, top + 76 + i * 15, i % 2 ? '#FF5A4A' : POD_TEAL, (i + 1) % 3 !== 0); });
  decal(ctx, th, 'O2  //  PRESS 101 KPA', 28, top + 194, 4.6);
  decal(ctx, th, 'CAUTION  PYRO  HATCH', 266, top + 194, 4.6, 'rgba(255,170,90,0.5)');
  decal(ctx, th, T.pod || 'POD 07', wx + 2, bot + 1, 5.2, 'rgba(255,195,106,0.7)');
  ctx.save(); ctx.translate(30, bot - 20); ctx.rotate(-Math.PI / 2); decal(ctx, th, 'SOEV-07  //  DO NOT STEP', 0, 0, 4.4); ctx.restore();
}
function subtleHud(ctx, th, Hl, y, label) {
  const c = th.colors, n = 30, x0 = 110, x1 = 280;
  for (let i = 0; i < n; i++) { const t = i / (n - 1), x = x0 + (x1 - x0) * t, yy = y + Math.pow(t - 0.5, 2) * 22; ctx.fillStyle = t <= 0.82 ? hexA(c.ink, 0.75) : hexA(c.ink, 0.15); ctx.fillRect(x - 1.6, yy - 3.5, 3.2, 7); }
  spaced(ctx, label, 195, y + 16, 5.6, th.fonts.mono, 400, 0.2, 'center', hexA(c.ink, 0.65));
  ctx.strokeStyle = hexA(c.ink, 0.18); ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(30, 230); ctx.quadraticCurveTo(195, 160, 360, 230); ctx.stroke();
}
function bokehCity(ctx, Hl, seed, th) {
  const r = rng(seed), c = th.colors;
  ctx.fillStyle = lin(ctx, 0, 0, 0, Hl, [[0, '#03050A'], [0.45, '#08101C'], [0.7, '#0D1726'], [1, '#05080E']]); ctx.fillRect(0, 0, 390, Hl);
  const layers = [[Hl * 0.36, 0.55, '#0B1320'], [Hl * 0.44, 0.75, '#08101A'], [Hl * 0.52, 1, '#050A12']];
  layers.forEach(([base, depth, col], li) => {
    let x = -10;
    while (x < 400) {
      const w = (18 + r() * 46) * depth, h = (60 + r() * 220) * depth;
      ctx.fillStyle = col; ctx.fillRect(x, base - h, w, Hl);
      for (let wy = base - h + 6; wy < base + 40; wy += 6 * depth + 2) for (let wx = x + 3; wx < x + w - 3; wx += 5 * depth + 2) {
        if (r() < 0.08) { ctx.fillStyle = r() < 0.7 ? `rgba(255,190,120,${0.15 + r() * 0.35 * depth})` : `rgba(140,200,255,${0.12 + r() * 0.3 * depth})`; ctx.fillRect(wx, wy, 1.6 * depth, 2.2 * depth); }
      }
      x += w + r() * 6;
    }
    ctx.fillStyle = lin(ctx, 0, base - 80, 0, base + 60, [[0, 'rgba(60,80,110,0)'], [0.6, `rgba(60,80,110,${0.18 - li * 0.04})`], [1, 'rgba(60,80,110,0)']]); ctx.fillRect(0, base - 80, 390, 140);
  });
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 90; i++) {
    const x = r() * 390, y = Hl * (0.34 + r() * 0.42), rr = 3 + Math.pow(r(), 2) * 26;
    const pal = r(); const col = pal < 0.55 ? [255, 176, 96] : pal < 0.8 ? [120, 190, 255] : pal < 0.92 ? [255, 90, 80] : [235, 240, 255];
    const a = Math.min(1, (0.08 + r() * 0.22) * K(th).glow);
    ctx.fillStyle = rad(ctx, x, y, 0, rr, [[0, `rgba(${col},${a})`], [0.7, `rgba(${col},${a * 0.6})`], [1, `rgba(${col},0)`]]);
    ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
    if (y > Hl * 0.55) { ctx.fillStyle = lin(ctx, 0, y, 0, y + 140, [[0, `rgba(${col},${a * 0.5})`], [1, `rgba(${col},0)`]]); ctx.fillRect(x - rr * 0.25, y, rr * 0.5, 140); }
  }
  ctx.restore();
  ctx.fillStyle = lin(ctx, 0, Hl * 0.62, 0, Hl, [[0, 'rgba(20,30,46,0)'], [1, 'rgba(20,30,46,0.55)']]); ctx.fillRect(0, Hl * 0.62, 390, Hl * 0.38);
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 220; i++) { const x = r() * 420 - 20, y = r() * Hl, l = 6 + r() * 18; ctx.strokeStyle = `rgba(180,210,240,${0.04 + r() * 0.1})`; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.2, y + l); ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(40,90,110,0.06)'; ctx.fillRect(0, 0, 390, Hl);
  ctx.restore();
}
function faceplatePath(ctx, Hl) {
  const yb = Hl * 0.62;
  ctx.moveTo(44, 222); ctx.quadraticCurveTo(195, 176, 346, 222);
  ctx.quadraticCurveTo(372, 236, 378, 300); ctx.lineTo(374, yb); ctx.lineTo(304, Hl - 112);
  ctx.lineTo(226, Hl - 84); ctx.lineTo(195, Hl - 74); ctx.lineTo(164, Hl - 84); ctx.lineTo(86, Hl - 112);
  ctx.lineTo(16, yb); ctx.lineTo(12, 300); ctx.quadraticCurveTo(18, 236, 44, 222); ctx.closePath();
}
function faceplateEdgeX(Hl, y, side) {
  const yb = Hl * 0.62;
  if (y <= yb) return side < 0 ? 16 : 374;
  const t = Math.min(1, (y - yb) / (Hl - 112 - yb));
  return side < 0 ? 16 + 70 * t : 374 - 70 * t;
}
function glowLine(ctx, th, draw, w, a) {
  ctx.save(); ctx.strokeStyle = hexA(th.colors.ink, a == null ? 0.9 : a); ctx.lineWidth = w || 1.3;
  ctx.shadowColor = hexA(th.colors.ink, 0.9); ctx.shadowBlur = 9 * K(th).glow; ctx.beginPath(); draw(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(235,250,255,0.55)'; ctx.lineWidth = Math.max(0.5, (w || 1.3) * 0.4); ctx.beginPath(); draw(); ctx.stroke();
  ctx.restore();
}
function visorEdge(ctx, th, Hl) {
  ctx.save();
  ctx.beginPath(); ctx.rect(-10, -10, 410, Hl + 20); faceplatePath(ctx, Hl);
  ctx.fillStyle = 'rgba(2,4,8,0.72)'; ctx.fill('evenodd');
  ctx.beginPath(); faceplatePath(ctx, Hl); ctx.clip();
  ctx.fillStyle = rad(ctx, 195, Hl * 0.52, Hl * 0.24, Hl * 0.62, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.38)']]); ctx.fillRect(0, 0, 390, Hl);
  ctx.fillStyle = lin(ctx, 40, 230, 230, 540, [[0, 'rgba(255,255,255,0)'], [0.47, 'rgba(200,230,255,0.05)'], [0.53, 'rgba(255,255,255,0)']]); ctx.fillRect(0, 0, 390, Hl);
  ctx.restore();
  const yb = Hl * 0.62;
  glowLine(ctx, th, () => faceplatePath(ctx, Hl), 1.4, 0.85);
  glowLine(ctx, th, () => {
    ctx.moveTo(26, 262); ctx.lineTo(26, 300); ctx.lineTo(22, yb - 40);
    ctx.moveTo(364, 262); ctx.lineTo(364, 300); ctx.lineTo(368, yb - 40);
  }, 0.8, 0.4);
  glowLine(ctx, th, () => {
    ctx.moveTo(118, 216); ctx.lineTo(132, 206); ctx.lineTo(258, 206); ctx.lineTo(272, 216);
    ctx.moveTo(138, 244); ctx.lineTo(146, 250); ctx.lineTo(244, 250); ctx.lineTo(252, 244);
  }, 1, 0.75);
  glowLine(ctx, th, () => {
    ctx.moveTo(20, 268); ctx.lineTo(70, 268); ctx.lineTo(80, 278); ctx.lineTo(118, 278);
    ctx.moveTo(370, 268); ctx.lineTo(310, 268); ctx.lineTo(300, 278); ctx.lineTo(236, 278);
  }, 0.9, 0.55);
  glowLine(ctx, th, () => {
    ctx.moveTo(140, Hl - 96); ctx.lineTo(156, Hl - 108); ctx.lineTo(234, Hl - 108); ctx.lineTo(250, Hl - 96);
  }, 1, 0.7);
  glowLine(ctx, th, () => {
    [[56, yb + 30, 1], [334, yb + 30, -1]].forEach(([x, y, d]) => { ctx.moveTo(x, y); ctx.lineTo(x + d * 20, y + 34); ctx.lineTo(x + d * 46, y + 34); });
  }, 0.8, 0.45);
  const mono = th.fonts.mono, ink = th.colors.ink;
  if (!K(th).details) return;
  spaced(ctx, 'INTERFACE ONLINE  /  OPTICS  /  TACCOM', 30, 296, 4.6, mono, 400, 0.18, 'left', hexA(ink, 0.32));
  spaced(ctx, 'RANGE FINDING  //  EVAL', 66, yb + 72, 4.6, mono, 400, 0.18, 'left', hexA(ink, 0.32));
  spaced(ctx, 'SYNC  //  STATUS', 324, yb + 72, 4.6, mono, 400, 0.18, 'right', hexA(ink, 0.32));
  spaced(ctx, '00.4304  ||  -  ||  NV-88', 195, Hl - 114, 4.6, mono, 400, 0.18, 'center', hexA(ink, 0.32));
}
const cy0 = (x, base, k) => base + (k || 0.0011) * Math.pow(x - 195, 2);
function hudGlow(ctx, th, fn) { ctx.save(); ctx.shadowColor = hexA(th.colors.ink, 0.75); ctx.shadowBlur = 5 * K(th).glow; fn(); ctx.restore(); }
function hudCompass(ctx, th, base) {
  const c = th.colors, mono = th.fonts.mono;
  hudGlow(ctx, th, () => {
    for (let d = 225; d <= 315; d += 5) {
      const x = 195 + (d - 270) * 2.6, y = cy0(x, base), big = d % 15 === 0;
      seg(ctx, x, y, x, y + (big ? 7 : 3.5), hexA(c.ink, big ? 0.85 : 0.45), 0.9);
      if (big) { const lab = { 270: 'W', 225: 'SW', 315: 'NW' }[d] || String(d); spaced(ctx, lab, x, y - 3, d % 45 === 0 ? 7 : 5.6, mono, 400, 0.06, 'center', hexA(c.ink, d % 45 === 0 ? 0.95 : 0.6)); }
    }
    ctx.fillStyle = c.accent; ctx.beginPath(); const ty = cy0(195, base) + 10; ctx.moveTo(195, ty); ctx.lineTo(191, ty + 5); ctx.lineTo(199, ty + 5); ctx.closePath(); ctx.fill();
    const wx = 195 + 18 * 2.6; ctx.save(); ctx.translate(wx, cy0(wx, base) + 1); ctx.rotate(Math.PI / 4); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.2; ctx.strokeRect(-2.6, -2.6, 5.2, 5.2); ctx.restore();
  });
}
function hudVitals(ctx, th, base, hp) {
  const c = th.colors, x0 = 140, x1 = 250, h = 8, frac = hp / 10;
  const bar = (xa, xb) => { ctx.beginPath(); ctx.moveTo(xa + 5, base - h / 2); ctx.lineTo(xb - 5, base - h / 2); ctx.lineTo(xb, base); ctx.lineTo(xb - 5, base + h / 2); ctx.lineTo(xa + 5, base + h / 2); ctx.lineTo(xa, base); ctx.closePath(); };
  ctx.save();
  bar(x0, x1); ctx.fillStyle = hexA(c.ink, 0.1); ctx.fill(); ctx.strokeStyle = hexA(c.ink, 0.5); ctx.lineWidth = 0.8; ctx.stroke();
  ctx.shadowColor = hexA(c.ink, 0.95); ctx.shadowBlur = 12;
  bar(x0 + 2, x0 + 2 + (x1 - x0 - 4) * frac); ctx.fillStyle = lin(ctx, 0, base - h / 2, 0, base + h / 2, [[0, 'rgba(235,250,255,0.95)'], [1, hexA(c.ink, 0.85)]]); ctx.fill();
  ctx.restore();
  spaced(ctx, `SHIELD  ${Math.round(frac * 100)}%`, 195, base - 10, 4.8, th.fonts.mono, 400, 0.2, 'center', hexA(c.ink, 0.5));
  ctx.save(); ctx.strokeStyle = hexA(c.accent, 0.8); ctx.lineWidth = 1.4; ctx.shadowColor = hexA(c.accent, 0.8); ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.moveTo(150, base + 9); ctx.lineTo(150 + 90 * 0.64, base + 9); ctx.stroke(); ctx.restore();
}
function hudGrenades(ctx, th, x, y) {
  const c = th.colors, mono = th.fonts.mono;
  hudGlow(ctx, th, () => {
    [[c.ink, 2], [c.accent, 1]].forEach(([col, n], i) => {
      const gx = x + i * 34;
      ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(gx, y, 5, 6.5, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = hexA(col, 0.35); ctx.fill();
      seg(ctx, gx - 2, y - 7.5, gx + 2, y - 7.5, col, 1.2);
      spaced(ctx, String(n), gx + 9, y + 4, 10, th.fonts.display, dispWeight(th.fonts.display), 0.02, 'left', col);
    });
    spaced(ctx, 'FRAG  //  CHARGE', x - 5, y + 18, 5, mono, 400, 0.16, 'left', hexA(c.ink, 0.55));
  });
}
function hudWeapon(ctx, th, xr, y, T) {
  const c = th.colors, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp);
  hudGlow(ctx, th, () => {
    const ammo = T.ammo || '32', aw = measureSpaced(ctx, ammo, 22, disp, dw, 0.02);
    spaced(ctx, ammo, xr, y + 18, 22, disp, dw, 0.02, 'right', c.ink);
    const gR = xr - aw - 12, gw = 70, gx = gR - gw, gy = y + 4, k = gw / 78;
    ctx.save(); ctx.translate(gx, gy); ctx.scale(k, k);
    ctx.strokeStyle = hexA(c.ink, 0.85); ctx.lineWidth = 1.1 / k; ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(56, 0); ctx.lineTo(60, 3); ctx.lineTo(78, 3); ctx.lineTo(78, 6); ctx.lineTo(58, 6);
    ctx.lineTo(52, 9); ctx.lineTo(40, 9); ctx.lineTo(38, 20); ctx.lineTo(32, 20); ctx.lineTo(33, 9);
    ctx.lineTo(18, 9); ctx.lineTo(14, 16); ctx.lineTo(4, 16); ctx.lineTo(6, 7); ctx.lineTo(0, 6); ctx.closePath(); ctx.stroke();
    ctx.restore();
    const tx0 = xr - 16 * 6 + 3;
    for (let i = 0; i < 32; i++) { const col = i % 16, row = Math.floor(i / 16); ctx.fillStyle = hexA(c.ink, i < 26 ? 0.9 : 0.15); ctx.fillRect(tx0 + col * 6, y + 30 + row * 8, 2.6, 6); }
    spaced(ctx, `${T.weapon || 'RIFLE // SEMI'}  ·  ${T.reserve || '224'}`, xr, y + 56, 5.2, mono, 400, 0.16, 'right', hexA(c.ink, 0.6));
  });
}
function hudTracker(ctx, th, cx, cy, R) {
  const c = th.colors, alert = c.alert || '#FF4D4D', mono = th.fonts.mono;
  hudGlow(ctx, th, () => {
    ctx.fillStyle = hexA(c.ink, 0.05); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = hexA(c.ink, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = hexA(c.ink, 0.22); ctx.lineWidth = 0.6; [0.5].forEach(f => { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke(); });
    seg(ctx, cx - R, cy, cx + R, cy, hexA(c.ink, 0.2), 0.6); seg(ctx, cx, cy - R, cx, cy + R, hexA(c.ink, 0.2), 0.6);
    [[0.6, -2.3, alert], [0.82, -1.2, alert], [0.45, 1.0, c.accent]].forEach(([d, a, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + R * d * Math.cos(a), cy + R * d * Math.sin(a), 2.4, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(cx, cy - 5); ctx.lineTo(cx + 4, cy + 4); ctx.lineTo(cx, cy + 2); ctx.lineTo(cx - 4, cy + 4); ctx.closePath(); ctx.fill();
    spaced(ctx, '25 M', cx + R + 4, cy + R - 2, 5.4, mono, 400, 0.12, 'left', hexA(c.ink, 0.6));
  });
}
function hudReticle(ctx, th, cx, cy) {
  const c = th.colors;
  hudGlow(ctx, th, () => {
    ctx.strokeStyle = hexA(c.ink, 0.8); ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; ctx.beginPath(); ctx.arc(cx, cy, 13, a - 0.45, a + 0.45); ctx.stroke(); }
    ctx.fillStyle = hexA(c.ink, 0.9); ctx.fillRect(cx - 0.8, cy - 0.8, 1.6, 1.6);
  });
}
function hudNav(ctx, th, x, y, label) {
  const c = th.colors;
  hudGlow(ctx, th, () => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.3; ctx.strokeRect(-5, -5, 10, 10); ctx.restore();
    spaced(ctx, label, x, y - 11, 5.6, th.fonts.mono, 400, 0.16, 'center', hexA(c.accent, 0.9));
  });
}
function drawNight(ctx, th, Hl, mode, phraseIdx) {
  const c = th.colors, T = th.text, mono = th.fonts.mono;
  const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
  const obj = th.upper ? `${ph[0]} ${ph[1]}`.trim().toUpperCase() : `${ph[0]} ${ph[1]}`.trim();
  if (mode === 'home') { drawNightMap(ctx, th, Hl, obj); return; }
  bokehCity(ctx, Hl, seedOf(th, 31), th);
  filmGrain(ctx, Hl, 9, K(th).texture);
  visorEdge(ctx, th, Hl);
  xfBegin(ctx, th, 195, 440);
  if (mode === 'lock') {
    hudVitals(ctx, th, 228, 8);
    hudCompass(ctx, th, 262);
    hudGrenades(ctx, th, 46, 316);
    hudWeapon(ctx, th, 348, 300, T);
    hudNav(ctx, th, 246, 420, 'NAV · 412 M');
    hudReticle(ctx, th, 195, 470);
    hudGlow(ctx, th, () => {
      spaced(ctx, 'OBJECTIVE', 195, 566, 5.4, mono, 400, 0.26, 'center', hexA(c.ink, 0.65));
      const fs = Math.min(13, 13 * 220 / Math.max(1, measureSpaced(ctx, obj, 13, th.fonts.display, dispWeight(th.fonts.display), 0.14)));
      spaced(ctx, obj, 195, 582, fs, th.fonts.display, dispWeight(th.fonts.display), 0.14, 'center', hexA(c.ink, 0.95));
      seg(ctx, 150, 590, 240, 590, hexA(c.ink, 0.3), 0.6);
    });
    hudTracker(ctx, th, 106, Hl - 204, 30);
    hudGlow(ctx, th, () => {
      spaced(ctx, T.sync || 'SQUAD LINK 4/4', 310, Hl - 216, 5.6, mono, 400, 0.16, 'right', hexA(c.ink, 0.7));
      spaced(ctx, T.optics || 'OPTICS: LOW-LIGHT', 310, Hl - 204, 5.6, mono, 400, 0.16, 'right', hexA(c.ink, 0.7));
      spaced(ctx, T.grid || 'GRID 9-K', 310, Hl - 192, 5.6, mono, 400, 0.16, 'right', hexA(c.accent, 0.8));
    });
    spaced(ctx, T.foot, 195, Hl - 40, 6, mono, 400, 0.22, 'center', hexA(c.ink, 0.45));
  } else {
    hudVitals(ctx, th, 228, 8);
    hudCompass(ctx, th, 262);
    hudNav(ctx, th, 246, 380, 'NAV · 412 M');
    hudReticle(ctx, th, 195, 420);
    hudTracker(ctx, th, 84, 548, 30);
    hudWeapon(ctx, th, 348, 508, T);
  }
  ctx.restore();
}


// Nightfall home: an objective map. A vector city grid under a radar sweep, with hostile hot spots, intel, a route and a lock.
function drawNightMap(ctx, th, Hl, obj) {
  const c = th.colors, k = K(th), mono = th.fonts.mono, disp = th.fonts.display, ink = c.ink, acc = c.accent, red = c.alert || '#FF4D4D', blue = c.glow, r = rng(seedOf(th, 913));
  const lab = (str, x, y, size, col, align, sp) => spaced(ctx, str, x, y, size, mono, 500, sp == null ? 0.12 : sp, align || 'left', col);
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  const vg = ctx.createRadialGradient(195, 450, 40, 195, 450, 520); vg.addColorStop(0, hexA(blue, 0.18 * k.glow)); vg.addColorStop(1, hexA(blue, 0)); ctx.fillStyle = vg; ctx.fillRect(0, 0, 390, Hl);
  // the city: streets, blocks, a river and a park, drawn on a tilted grid
  ctx.save(); ctx.translate(195, 450); ctx.rotate(-0.38); ctx.translate(-195, -450);
  ctx.fillStyle = hexA(blue, 0.16); ctx.beginPath(); ctx.moveTo(-200, 300); ctx.bezierCurveTo(60, 340, 120, 470, 260, 520); ctx.bezierCurveTo(360, 556, 470, 600, 620, 640); ctx.lineTo(620, 700); ctx.bezierCurveTo(450, 660, 340, 618, 240, 586); ctx.bezierCurveTo(100, 540, 40, 410, -200, 372); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = hexA(ink, 0.35); ctx.lineWidth = 1; ctx.stroke();
  const xs = [], ys = []; for (let x = -260; x < 660; x += 30 + Math.floor(r() * 26)) xs.push(x); for (let y = -120; y < Hl + 160; y += 30 + Math.floor(r() * 26)) ys.push(y);
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) { if (r() < 0.55) { const pad = 4 + r() * 3; ctx.fillStyle = hexA(ink, 0.035 + r() * 0.05); ctx.fillRect(xs[i] + pad, ys[j] + pad, xs[i + 1] - xs[i] - pad * 2, ys[j + 1] - ys[j] - pad * 2); } }
  ctx.fillStyle = hexA(blue, 0.12); ctx.fillRect(xs[3] + 4, ys[5] + 4, xs[5] - xs[3] - 8, ys[7] - ys[5] - 8);
  xs.forEach((x, i) => { const major = i % 4 === 0; ctx.strokeStyle = hexA(ink, major ? 0.3 : 0.13); ctx.lineWidth = major ? 2.2 : 1; ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, Hl + 200); ctx.stroke(); });
  ys.forEach((y, j) => { const major = j % 4 === 1; ctx.strokeStyle = hexA(ink, major ? 0.3 : 0.13); ctx.lineWidth = major ? 2.2 : 1; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(700, y); ctx.stroke(); });
  ctx.strokeStyle = hexA(ink, 0.28); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-200, 760); ctx.bezierCurveTo(80, 640, 260, 420, 640, 120); ctx.stroke(); ctx.strokeStyle = hexA(c.ground, 0.9); ctx.lineWidth = 1.2; ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  ctx.fillStyle = hexA(ink, 0.14); for (let x = 26; x < 390; x += 52) for (let y = 186; y < 700; y += 52) { ctx.fillRect(x - 3, y, 7, 1); ctx.fillRect(x, y - 3, 1, 7); }
  xfBegin(ctx, th, 195, 450);
  // radar: rings, bezel, crosshair and a sweep
  const RX = 195, RY = 452, R = 148;
  ctx.fillStyle = hexA(blue, 0.08); ctx.beginPath(); ctx.arc(RX, RY, R, 0, Math.PI * 2); ctx.fill();
  const sweep = -0.95, wedge = 0.95, NS = 28;
  for (let i = 0; i < NS; i++) { const a0 = sweep - wedge + wedge * i / NS, a1 = a0 + wedge / NS + 0.004; ctx.fillStyle = hexA(ink, Math.min(0.5, 0.3 * k.glow) * Math.pow((i + 1) / NS, 1.6)); ctx.beginPath(); ctx.moveTo(RX, RY); ctx.arc(RX, RY, R, a0, a1); ctx.closePath(); ctx.fill(); }
  ctx.save(); ctx.shadowColor = ink; ctx.shadowBlur = 8 * k.glow; seg(ctx, RX, RY, RX + R * Math.cos(sweep), RY + R * Math.sin(sweep), hexA(ink, 0.95), 1.6); ctx.restore();
  [1, 0.66, 0.33].forEach((f, i) => { ctx.strokeStyle = hexA(ink, i ? 0.25 : 0.55); ctx.lineWidth = i ? 1 : 1.6; if (i === 1) ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.arc(RX, RY, R * f, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); });
  seg(ctx, RX - R - 12, RY, RX + R + 12, RY, hexA(ink, 0.3), 1); seg(ctx, RX, RY - R - 12, RX, RY + R + 12, hexA(ink, 0.3), 1);
  for (let d = 0; d < 360; d += 5) { const a = (d - 90) * Math.PI / 180, l = d % 30 === 0 ? 9 : 4; seg(ctx, RX + (R + 4) * Math.cos(a), RY + (R + 4) * Math.sin(a), RX + (R + 4 + l) * Math.cos(a), RY + (R + 4 + l) * Math.sin(a), hexA(ink, d % 30 === 0 ? 0.7 : 0.35), 1); }
  if (k.details) for (let d = 0; d < 360; d += 30) { const a = (d - 90) * Math.PI / 180; lab(String(d).padStart(3, '0'), RX + (R + 22) * Math.cos(a), RY + (R + 22) * Math.sin(a) + 3, 6.5, hexA(ink, 0.65), 'center', 0.04); }
  // route from the squad to the objective
  const route = [[150, 560], [122, 492], [166, 430], [232, 396], [262, 330], [290, 282]];
  ctx.save(); ctx.strokeStyle = hexA(acc, 0.9); ctx.lineWidth = 2; ctx.setLineDash([7, 5]); ctx.shadowColor = acc; ctx.shadowBlur = 6 * k.glow; ctx.beginPath(); route.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
  route.slice(1, -1).forEach(([x, y]) => { ctx.strokeStyle = hexA(acc, 0.9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.stroke(); });
  ctx.save(); ctx.translate(150, 560); ctx.fillStyle = ink; ctx.shadowColor = ink; ctx.shadowBlur = 8 * k.glow; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(7, 7); ctx.lineTo(0, 3); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill(); ctx.restore();
  if (k.details) lab('SQUAD 7', 162, 576, 6.5, ink);
  // hot spots
  const hot = (x, y, col, rad, label, left) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 12 * k.glow; const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 2.2); g.addColorStop(0, hexA(col, 0.55)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad * 2.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.strokeStyle = hexA(col, 0.9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = hexA(col, 0.45); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(x, y, rad + 6, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); if (label && k.details) { const s2 = left ? -1 : 1, ex = x + s2 * (rad + 12), ey = y - rad - 10; seg(ctx, x + s2 * rad * 0.7, y - rad * 0.7, ex, ey, hexA(col, 0.8), 1); seg(ctx, ex, ey, ex + s2 * 56, ey, hexA(col, 0.8), 1); lab(label, ex + s2 * 2, ey - 4, 6.5, col, left ? 'right' : 'left', 0.08); } };
  hot(64, 276, red, 12, 'HOSTILE · 3'); hot(318, 548, red, 14, 'HOSTILE · 5', true); hot(118, 650, red, 9, null); hot(252, 470, acc, 9, 'INTEL'); hot(64, 528, acc, 7, null);
  // objective reticle
  ctx.save(); ctx.translate(290, 282); ctx.shadowColor = acc; ctx.shadowBlur = 10 * k.glow; ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(14, 0); ctx.lineTo(0, 14); ctx.lineTo(-14, 0); ctx.closePath(); ctx.stroke();
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; ctx.beginPath(); ctx.arc(0, 0, 26, a, a + 0.9); ctx.stroke(); } ctx.restore();
  lab('OBJECTIVE', 290, 240, 6.5, hexA(acc, 0.85), 'center', 0.2); spaced(ctx, obj, 290, 324, Math.min(9, 9 * 150 / Math.max(1, measureSpaced(ctx, obj, 9, disp, dispWeight(disp), 0.1))), disp, dispWeight(disp), 0.1, 'center', acc);
  // the lock on the nearest hostile
  const LX = 318, LY = 548; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { seg(ctx, LX + sx * 26, LY + sy * 26, LX + sx * 26, LY + sy * 16, red, 1.6); seg(ctx, LX + sx * 26, LY + sy * 26, LX + sx * 16, LY + sy * 26, red, 1.6); });
  ctx.save(); ctx.shadowColor = red; ctx.shadowBlur = 8 * k.glow; lab('LOCKED', LX, LY + 42, 8, red, 'center', 0.2); ctx.restore();
  ctx.restore();
  // panels along the edges, clear of the icon rows and the dock
  if (k.details) {
    ctx.strokeStyle = hexA(ink, 0.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(18, 172); ctx.lineTo(200, 172); ctx.lineTo(210, 182); ctx.stroke();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(24, 186, 3.5, 0, Math.PI * 2); ctx.fill(); lab('SECTOR 9-K // CITY GRID', 34, 189, 7.5, ink, 'left', 0.14); lab('RAIN · VIS 1.2 KM · NIGHT', 34, 202, 6, hexA(ink, 0.6), 'left', 0.12);
    for (let i = 0; i < 9; i++) { const h = 6 + r() * 22; ctx.fillStyle = hexA(ink, 0.25); ctx.fillRect(280 + i * 10, 178, 7, 30); ctx.fillStyle = hexA(ink, 0.75); ctx.fillRect(280 + i * 10, 208 - h, 7, h); }
    lab('THREAT 0.72', 370, 220, 6, hexA(red, 0.9), 'right', 0.12);
    for (let y = 250; y < 660; y += 12) seg(ctx, 10, y, y % 60 === 10 ? 20 : 15, y, hexA(ink, 0.4), 1);
    for (let y = 250; y < 660; y += 12) seg(ctx, 380, y, y % 60 === 10 ? 370 : 375, y, hexA(ink, 0.4), 1);
    const sy = 688; ctx.strokeStyle = hexA(ink, 0.6); ctx.strokeRect(54, sy, 150, 18); ctx.fillStyle = hexA(ink, 0.3); ctx.fillRect(55, sy + 1, 150 * 0.62, 16);
    for (let i = 0; i < 4; i++) { const x = 20 + i * 8; ctx.strokeStyle = hexA(ink, 0.3 + i * 0.18); ctx.beginPath(); ctx.moveTo(x + 6, sy + 2); ctx.lineTo(x, sy + 9); ctx.lineTo(x + 6, sy + 16); ctx.stroke(); }
    lab('SCANNING...', 129, sy + 12.5, 7, ink, 'center', 0.18);
    ctx.strokeStyle = hexA(ink, 0.6); ctx.strokeRect(222, sy - 10, 150, 38); ctx.strokeStyle = hexA(ink, 0.85); ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = 0; x <= 146; x += 3) { const y = sy + 9 + Math.sin(x * 0.12) * 5 + Math.sin(x * 0.37) * 3 * (x / 146); x ? ctx.lineTo(224 + x, y) : ctx.moveTo(224, y); } ctx.stroke();
    lab('412 M · ETA 04:12', 297, sy + 40, 6, hexA(ink, 0.65), 'center', 0.12);
  }
  filmGrain(ctx, Hl, 9, k.texture * 0.6);
}

// ---------- GRIMOIRE motif (arcane card deck) ----------
function starGround(ctx, th, Hl) {
  const c = th.colors, r = rng(seedOf(th, 77));
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  const g = ctx.createRadialGradient(195, Hl * 0.5, 30, 195, Hl * 0.5, Hl * 0.6);
  g.addColorStop(0, hexA(c.glow, Math.min(1, 0.28 * K(th).glow))); g.addColorStop(1, hexA(c.glow, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  for (let i = 0; i < Math.round(420 * K(th).texture); i++) {
    const x = r() * 390, y = r() * Hl, s = r() < 0.92 ? 0.5 + r() * 0.8 : 1.4 + r();
    ctx.fillStyle = hexA(c.ink, 0.25 + r() * 0.6); ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill();
    if (s > 1.6) { seg(ctx, x - 4, y, x + 4, y, hexA(c.ink, 0.5), 0.5); seg(ctx, x, y - 4, x, y + 4, hexA(c.ink, 0.5), 0.5); }
  }
  ctx.strokeStyle = hexA(c.accent, 0.25); ctx.lineWidth = 0.6;
  [[[40, 120], [72, 96], [104, 132], [140, 110]], [[260, 690], [300, 720], [336, 700], [350, 740]]].forEach(pts => {
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    pts.forEach(([x, y]) => { ctx.fillStyle = hexA(c.ink, 0.8); ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); });
  });
}
function starPolygon(ctx, cx, cy, R, n, step, rot) {
  ctx.beginPath();
  for (let i = 0; i <= n; i++) { const a = rot + (i * step % n) * 2 * Math.PI / n; const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath();
}
function gem(ctx, th, x, y, s, color) {
  ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.75, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.75, y); ctx.closePath();
  ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = th.colors.accent; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x - s * 0.3, y); ctx.lineTo(x, y + s); ctx.strokeStyle = hexA('#FFFFFF', 0.35); ctx.lineWidth = 0.7; ctx.stroke();
}
function sigil(ctx, th, cx, cy, R) {
  const c = th.colors;
  ctx.strokeStyle = hexA(c.accent, 0.55); ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 28; i++) {
    const a = i * Math.PI * 2 / 28 - Math.PI / 2, rr = R * 0.94, x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.strokeStyle = c.accent; ctx.lineWidth = 0.8;
    const k = i % 4; ctx.beginPath();
    if (k === 0) { ctx.moveTo(-2.5, 2); ctx.lineTo(0, -2.5); ctx.lineTo(2.5, 2); ctx.closePath(); }
    else if (k === 1) { ctx.arc(0, 0, 1.8, 0, Math.PI * 2); }
    else if (k === 2) { ctx.moveTo(0, -2.8); ctx.lineTo(0, 2.8); ctx.moveTo(-1.8, -1); ctx.lineTo(1.8, -1); }
    else { ctx.moveTo(-2.2, -2.2); ctx.lineTo(2.2, 2.2); ctx.moveTo(2.2, -2.2); ctx.lineTo(-2.2, 2.2); }
    ctx.stroke(); ctx.restore();
  }
  starPolygon(ctx, cx, cy, R * 0.8, 7, 3, -Math.PI / 2); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.47, 0, Math.PI * 2); ctx.strokeStyle = c.glow; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4); ctx.strokeStyle = hexA(c.ink, 0.7); ctx.lineWidth = 0.8; ctx.strokeRect(-R * 0.3, -R * 0.3, R * 0.6, R * 0.6); ctx.restore();
  ctx.strokeRect(cx - R * 0.3, cy - R * 0.3, R * 0.6, R * 0.6);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.18);
  g.addColorStop(0, hexA(c.ink, 0.95)); g.addColorStop(1, hexA(c.glow, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(cx, cy, R * 0.05, 0, Math.PI * 2); ctx.fill();
  [0.3, 1.9, 3.6, 5.1].forEach((a, i) => { const rr = R * (0.62 + (i % 2) * 0.08); ctx.fillStyle = i % 2 ? c.glow : c.ink; ctx.beginPath(); ctx.arc(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 2.4, 0, Math.PI * 2); ctx.fill(); });
}
function cardFrame(ctx, th, x, y, w, h) {
  const c = th.colors;
  const rr = (X, Y, W, H, R) => { ctx.beginPath(); ctx.moveTo(X + R, Y); ctx.arcTo(X + W, Y, X + W, Y + H, R); ctx.arcTo(X + W, Y + H, X, Y + H, R); ctx.arcTo(X, Y + H, X, Y, R); ctx.arcTo(X, Y, X + W, Y, R); ctx.closePath(); };
  rr(x, y, w, h, 16); ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 2.4; ctx.stroke();
  rr(x + 8, y + 8, w - 16, h - 16, 10); ctx.strokeStyle = hexA(c.accent, 0.7); ctx.lineWidth = 0.8; ctx.stroke();
  [[x + 8, y + 8], [x + w - 8, y + 8], [x + 8, y + h - 8], [x + w - 8, y + h - 8]].forEach(([px, py]) => {
    ctx.save(); ctx.translate(px, py); ctx.rotate(Math.PI / 4); ctx.fillStyle = c.accent; ctx.fillRect(-3.5, -3.5, 7, 7); ctx.restore();
  });
}
function drawGrimoire(ctx, th, Hl, mode, phraseIdx) {
  const c = th.colors, T = th.text, fam = th.fonts.display, sc = th.fonts.mono, gems = T.gems || ['#E9E1C8', '#3A7BD5', '#5B4A8A', '#D23A4A', '#2FAE7A'];
  starGround(ctx, th, Hl);
  if (mode === 'lock') {
    xfBegin(ctx, th, 195, 500);
    const x = 44, y = 252, w = 302, h = Math.min(Hl - 342, 500);
    cardFrame(ctx, th, x, y, w, h);
    const cn = T.cardNo || '';
    ctx.font = `500 9px "${sc}", Georgia, serif`; const pw = ctx.measureText(cn).width + 30;
    ctx.fillStyle = c.panel; ctx.fillRect(195 - pw / 2, y - 7, pw, 14); ctx.strokeStyle = c.accent; ctx.lineWidth = 1; ctx.strokeRect(195 - pw / 2, y - 7, pw, 14);
    fell(ctx, cn, 195, y + 3.2, 9, sc, c.accent, 'center', false, 0.12);
    const ax = x + 18, ay = y + 26, aw = w - 36, ah = Math.round(h * 0.47);
    const ag = ctx.createLinearGradient(0, ay, 0, ay + ah); ag.addColorStop(0, hexA(c.glow, 0.45)); ag.addColorStop(1, hexA(c.ground, 0.9));
    ctx.fillStyle = ag; ctx.fillRect(ax, ay, aw, ah);
    ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
    const r = rng(phraseIdx * 13 + 3);
    for (let i = 0; i < 80; i++) { ctx.fillStyle = hexA(c.ink, 0.3 + r() * 0.6); ctx.beginPath(); ctx.arc(ax + r() * aw, ay + r() * ah, 0.4 + r() * 0.7, 0, Math.PI * 2); ctx.fill(); }
    sigil(ctx, th, 195, ay + ah / 2, Math.min(aw, ah) * 0.42);
    ctx.restore();
    ctx.strokeStyle = c.accent; ctx.lineWidth = 1.2; ctx.strokeRect(ax, ay, aw, ah);
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const name = th.upper ? `${ph[0]} ${ph[1]}`.trim().toUpperCase() : `${ph[0]} ${ph[1]}`.trim();
    const by = ay + ah + 14;
    ctx.beginPath(); ctx.moveTo(ax - 6, by); ctx.lineTo(ax + aw + 6, by); ctx.lineTo(ax + aw - 2, by + 17); ctx.lineTo(ax + aw + 6, by + 34); ctx.lineTo(ax - 6, by + 34); ctx.lineTo(ax + 2, by + 17); ctx.closePath();
    ctx.fillStyle = c.ground; ctx.fill(); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.font = `700 26px "${fam}", Georgia, serif`;
    const ns = Math.min(26, 26 * (aw - 30) / Math.max(1, ctx.measureText(name).width));
    fell(ctx, name, 195, by + 17 + ns * 0.33, ns, fam, c.ink, 'center');
    const sy = by + 52;
    if (K(th).details) { fell(ctx, (T.school || '').toUpperCase(), 195, sy, 9.5, sc, c.accent, 'center', false, 0.14); gem(ctx, th, 92, sy - 3, 3.2, c.accent); gem(ctx, th, 298, sy - 3, 3.2, c.accent); }
    seg(ctx, ax + 30, sy + 10, ax + aw - 30, sy + 10, hexA(c.accent, 0.5), 0.7);
    ctx.font = `italic 500 15px "${fam}", Georgia, serif`;
    const words = (T.flavor || '').split(' '); const lines = []; let cur = '';
    words.forEach(wd => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > aw - 24 && cur) { lines.push(cur); cur = wd; } else cur = t; });
    if (cur) lines.push(cur);
    lines.slice(0, 3).forEach((ln, i) => fell(ctx, ln, 195, sy + 32 + i * 19, 15, fam, hexA(c.ink, 0.85), 'center', true));
    if (T.effect) {
      const ey = sy + 32 + Math.min(3, lines.length) * 19 + 8;
      seg(ctx, 165, ey - 6, 225, ey - 6, hexA(c.accent, 0.5), 0.6);
      ctx.font = `500 13px "${fam}", Georgia, serif`;
      const ew = T.effect.split(' '); const el = []; let ec = '';
      ew.forEach(wd => { const t = ec ? ec + ' ' + wd : wd; if (ctx.measureText(t).width > aw - 30 && ec) { el.push(ec); ec = wd; } else ec = t; });
      if (ec) el.push(ec);
      el.slice(0, 3).forEach((ln, i) => fell(ctx, ln, 195, ey + 14 + i * 17, 13, fam, c.ink, 'center'));
    }
    const gy = y + h - 26;
    gems.forEach((col, i) => gem(ctx, th, 195 + (i - 2) * 26, gy, 7, col));
    ctx.restore();
    if (K(th).details) fell(ctx, T.foot, 195, Hl - 34, 9.5, sc, c.accent, 'center', false, 0.16);
  } else {
    drawGrimoireHome(ctx, th, Hl);
  }
}

function drawVisorIcon(ctx, th, glyph, num, code) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = hexA(c.glow, 0.12); ctx.lineWidth = 3;
  for (let i = -1024; i < 1024; i += 46) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 300, 1024); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(140, 300); ctx.quadraticCurveTo(512, 120, 884, 300); ctx.lineTo(884, 860); ctx.lineTo(140, 860); ctx.closePath();
  ctx.fillStyle = hexA(c.panel, 0.9); ctx.fill(); ctx.strokeStyle = c.ink; ctx.lineWidth = 12; ctx.stroke();
  ctx.save(); ctx.translate(312, 330); ctx.scale(16.6, 16.6); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
  spaced(ctx, num, 172, 820, 52, th.fonts.mono, 400, 0.08, 'left', c.ink);
  spaced(ctx, code, 852, 820, 52, th.fonts.mono, 400, 0.08, 'right', c.ink);
  ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(820, 300, 22, 0, Math.PI * 2); ctx.fill();
}
function drawGildedIcon(ctx, th, glyph, num, code, idx) {
  const c = th.colors, gems = (th.text && th.text.gems) || ['#E9E1C8', '#3A7BD5', '#5B4A8A', '#D23A4A', '#2FAE7A'];
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  const g = ctx.createRadialGradient(512, 460, 40, 512, 460, 560); g.addColorStop(0, hexA(c.glow, 0.45)); g.addColorStop(1, hexA(c.glow, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = c.accent; ctx.lineWidth = 14; ctx.strokeRect(104, 104, 816, 816);
  ctx.lineWidth = 4; ctx.strokeRect(134, 134, 756, 756);
  [[134, 134], [890, 134], [134, 890], [890, 890]].forEach(([x, y]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = c.accent; ctx.fillRect(-16, -16, 32, 32); ctx.restore(); });
  ctx.save(); ctx.translate(312, 280); ctx.scale(16.6, 16.6); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
  fell(ctx, code, 512, 820, 52, th.fonts.mono, c.accent, 'center', false, 0.12);
  gem(ctx, th, 512, 730, 26, gems[idx % gems.length]);
}

// ---------- ORBITAL motif (deep range tracking display) ----------
function drawOrbital(ctx, th, Hl, mode, phraseIdx, W, H, s, contactScene = null) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th)
  const RED = c.accent, YEL = c.ink, BLU = c.glow, GRN = c.alert || '#3DFF8A', CYN = '#39D6FF'
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  texture(ctx, Object.assign({}, th, { texture: 'scan', colors: Object.assign({}, c, { ink: '#9AD9FF' }) }), W, H, s);
  const lab = (t, x, y, size, col, align, wgt, fam) => spaced(ctx, t, x, y, size, fam || mono, wgt || 400, 0.08, align || 'left', col);
  const yearTxt = T.year === 'auto' || !T.year ? String(new Date().getFullYear()) : T.year;
  const top = mode === 'lock' ? 238 : 222;
  const baseY = mode === 'lock' ? Math.min(Hl - 190, 650) : 610;
  const R = 1400, pcx = 195, pcy = baseY + R;
  const arc = (r) => { ctx.beginPath(); for (let x = -20; x <= 410; x += 5) { const dy = Math.sqrt(Math.max(0, r * r - (x - pcx) ** 2)); x === -20 ? ctx.moveTo(x, pcy - dy) : ctx.lineTo(x, pcy - dy); } };
  // tracking plane
  centerXform(ctx, th, 195, (top + baseY) / 2, () => {
    const q = [[40, top + 120], [330, top + 52], [372, top + 236], [76, top + 300]];
    const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    ctx.lineWidth = 0.7;
    for (let i = 0; i <= 8; i++) { const t = i / 8, a = L(q[0], q[1], t), b = L(q[3], q[2], t); ctx.strokeStyle = hexA('#9AA8AE', i % 4 === 0 ? 0.4 : 0.18); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    for (let i = 0; i <= 6; i++) { const t = i / 6, a = L(q[0], q[3], t), b = L(q[1], q[2], t); ctx.strokeStyle = hexA('#9AA8AE', i % 3 === 0 ? 0.4 : 0.18); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.strokeStyle = hexA('#C9D2D6', 0.55); ctx.lineWidth = 1; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
    if (contactScene) { contactScene(ctx, th, {top,baseY,q}); return; }
    if (k.details) {
      [[120, top + 150, 'K-17'], [250, top + 120, 'K-04'], [300, top + 200, 'R-88'], [150, top + 230, 'K-22']].forEach(([x, y, l]) => { ctx.fillStyle = RED; ctx.fillRect(x - 3, y - 3, 6, 6); lab(l, x + 6, y + 3, 7, hexA(RED, 0.9)); });
      [[205, top + 175, 'RELAY 04'], [96, top + 196, 'BUOY 11']].forEach(([x, y, l]) => { ctx.strokeStyle = YEL; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 7, y - 10); ctx.lineTo(x + 7, y - 10); ctx.lineTo(x, y + 1); ctx.closePath(); ctx.stroke(); ctx.fillStyle = YEL; ctx.beginPath(); ctx.arc(x, y - 6.5, 1.4, 0, Math.PI * 2); ctx.fill(); lab(l, x + 10, y - 4, 7.5, '#F2F2F2', 'left', 700); });
    }
    // trajectory through stacked frames
    const sx = 24, sy = baseY + 30, ax = 300, ay = top + 92, cx1 = 110, cy1 = top + 40;
    const bz = (t) => [(1 - t) ** 2 * sx + 2 * (1 - t) * t * cx1 + t * t * ax, (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy1 + t * t * ay];
    for (let i = 0; i < 8; i++) {
      const t = 0.14 + i * 0.1, p = bz(t), n = bz(t + 0.01), ang = Math.atan2(n[1] - p[1], n[0] - p[0]), sz = 44 - i * 4.2;
      const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux, sk = 0.55;
      const pts = [[p[0] + vx * sz - ux * sz * sk, p[1] + vy * sz - uy * sz * sk], [p[0] + vx * sz + ux * sz * sk, p[1] + vy * sz + uy * sz * sk], [p[0] - vx * sz + ux * sz * sk, p[1] - vy * sz + uy * sz * sk], [p[0] - vx * sz - ux * sz * sk, p[1] - vy * sz - uy * sz * sk]];
      ctx.strokeStyle = hexA(RED, 0.85 - i * 0.06); ctx.lineWidth = 1.1; ctx.beginPath(); pts.forEach((q2, j) => j ? ctx.lineTo(q2[0], q2[1]) : ctx.moveTo(q2[0], q2[1])); ctx.closePath(); ctx.stroke();
    }
    ctx.save(); ctx.shadowColor = hexA(YEL, 0.8); ctx.shadowBlur = 6 * k.glow;
    ctx.strokeStyle = YEL; ctx.lineWidth = 1.3; ctx.beginPath(); for (let t = 0; t <= 1.0001; t += 0.02) { const p = bz(t); t === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#FF6A3D'; ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c.ground; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.stroke();
  });
  // planet limb
  ctx.save(); arc(R); ctx.lineTo(410, Hl + 10); ctx.lineTo(-20, Hl + 10); ctx.closePath(); ctx.fillStyle = hexA(BLU, 0.55); ctx.fill(); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, baseY, 0, Hl, [[0, hexA(BLU, 0.6)], [1, hexA('#000000', 0.3)]]); ctx.fillRect(0, baseY - 20, 390, Hl);
  ctx.strokeStyle = hexA('#6F8BFF', 0.6); ctx.lineWidth = 0.8;
  for (let i = 1; i <= 7; i++) { arc(R - i * (7 + i * 4)); ctx.stroke(); }
  for (let i = -9; i <= 9; i++) { const a = i * 0.03; ctx.beginPath(); ctx.moveTo(pcx + R * Math.sin(a), pcy - R * Math.cos(a)); ctx.lineTo(pcx + (R - 160) * Math.sin(a * 0.55), pcy - (R - 160) * Math.cos(a * 0.55)); ctx.stroke(); }
  const r0 = rng(seedOf(th, 41));
  for (let i = 0; i < Math.round(110 * k.texture); i++) { ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(r0() * 390, baseY + 6 + r0() * (Hl - baseY), 3 + r0() * 12, 1.5 + r0() * 2.5); }
  ctx.restore();
  ctx.save(); ctx.shadowBlur = 5 * k.glow;
  ctx.shadowColor = GRN; ctx.strokeStyle = GRN; ctx.lineWidth = 1.1; arc(R + 10); ctx.stroke();
  ctx.shadowColor = CYN; ctx.strokeStyle = CYN; ctx.lineWidth = 0.9; arc(R + 24); ctx.stroke(); ctx.restore();
  [[110, 'W-1'], [300, 'W-2']].forEach(([x, l]) => { const y = pcy - Math.sqrt(R * R - (x - pcx) ** 2) - 18; ctx.strokeStyle = '#F2A33A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 8, y - 10); ctx.lineTo(x + 8, y - 10); ctx.lineTo(x, y + 3); ctx.closePath(); ctx.stroke(); ctx.fillStyle = '#F2A33A'; ctx.beginPath(); ctx.arc(x, y - 5.5, 1.6, 0, Math.PI * 2); ctx.fill(); });
  // red block glyphs on the edges
  ctx.fillStyle = RED;
  [[0, top + 30, 12, 40], [0, top + 78, 7, 14], [0, top + 300, 14, 34], [0, top + 340, 8, 12]].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  [[378, top + 60, 12, 46], [383, top + 112, 7, 14], [374, top + 270, 16, 36]].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  if (k.details) { lab(T.codeA || 'R 07-KX', 18, top + 40, 7, RED); lab(T.codeB || 'DR 0X283', 18, top + 310, 7, RED); }
  // headline callout and readouts
  if (mode === 'lock') {
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const head = `${ph[0]} ${ph[1]}`.trim(); const txt = th.upper ? head.toUpperCase() : head;
    const fs = Math.min(32, 32 * 330 / Math.max(1, measureSpaced(ctx, txt, 32, disp, dw, 0.01)));
    ctx.save(); ctx.shadowColor = hexA(YEL, 0.7); ctx.shadowBlur = 10 * k.glow;
    spaced(ctx, txt, 24, top + 66, fs, disp, dw, 0.01, 'left', YEL); ctx.restore();
    lab(T.topL || 'TRACKING 12 CONTACTS', 24, top + 6, 11, YEL, 'left', 700, disp);
    lab(T.coords || 'RANGE 0.4 AU // RELAY 07', 24, top + 20, 7, hexA(YEL, 0.75));
    lab(T.yearLabel || 'YEAR', 364, baseY - 74, 11, YEL, 'right', 700, disp);
    ctx.save(); ctx.shadowColor = hexA(YEL, 0.7); ctx.shadowBlur = 10 * k.glow;
    spaced(ctx, yearTxt, 364, baseY - 42, 34, disp, dw, 0.02, 'right', YEL); ctx.restore();
    if (k.details) { ['041', '712', '288'].forEach((n, i) => lab(n, 364, Hl - 140 + i * 11, 9, RED, 'right')); lab(T.fine || 'A E0- 12  9X  00', 24, Hl - 128, 7.5, YEL); }
    lab(T.foot || 'DEEP RANGE // RELAY 07', 195, Hl - 30, 7, hexA(YEL, 0.85), 'center');
  } else {
    lab(T.homeTop || 'RANGE CONTROL // PASSIVE LISTEN', 195, top + 6, 8, YEL, 'center', 700);
    lab(T.caption || 'CONTACT LOST · KEEP LISTENING', 195, baseY - 46, 8, YEL, 'center', 700, disp);
  }
}

function drawTrackerIcon(ctx, th, glyph, num, code) {
  const c = th.colors;
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = 'rgba(154,217,255,0.05)'; for (let y = 0; y < 1024; y += 12) ctx.fillRect(0, y, 1024, 4);
  ctx.strokeStyle = hexA('#9AA8AE', 0.5); ctx.lineWidth = 6; ctx.strokeRect(120, 120, 784, 784);
  ctx.fillStyle = c.accent; ctx.fillRect(120, 120, 120, 40); ctx.fillRect(120, 160, 40, 80); ctx.fillRect(784, 864, 120, 40); ctx.fillRect(864, 784, 40, 80);
  ctx.save(); ctx.shadowColor = hexA(c.ink, 0.7); ctx.shadowBlur = 30;
  ctx.save(); ctx.translate(312, 300); ctx.scale(16.6, 16.6); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore(); ctx.restore();
  spaced(ctx, num, 860, 212, 56, th.fonts.mono, 400, 0.06, 'right', c.accent);
  spaced(ctx, code, 180, 860, 56, th.fonts.mono, 400, 0.1, 'left', c.ink);
}

function drawContact(ctx, th, cx, cy, sc, frame, k) {
  const c = th.colors, YEL = c.ink, RED = c.accent, mono = th.fonts.mono
  const r = rng(seedOf(th, 501 + frame))
  const glow = (col, b, fn) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = b * k.glow; fn(); ctx.restore(); };
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.18 + frame * 0.07); ctx.scale(sc, sc);
  // occlusion so the frames read behind the contact
  ctx.fillStyle = hexA(c.ground, 0.78);
  ctx.beginPath(); ctx.moveTo(-86, -10); ctx.lineTo(-30, -26); ctx.lineTo(30, -26); ctx.lineTo(88, -6); ctx.lineTo(30, 26); ctx.lineTo(-30, 26); ctx.closePath(); ctx.fill();
  glow(YEL, 9, () => {
    ctx.strokeStyle = YEL; ctx.lineWidth = 1.1;
    // truss arms
    ctx.beginPath(); ctx.moveTo(-80, -4); ctx.lineTo(-22, -4); ctx.moveTo(-80, 4); ctx.lineTo(-22, 4); ctx.moveTo(22, -4); ctx.lineTo(66, -4); ctx.moveTo(22, 4); ctx.lineTo(60, 4); ctx.stroke();
    for (let x = -76; x < -22; x += 8) { ctx.beginPath(); ctx.moveTo(x, -4); ctx.lineTo(x + 8, 4); ctx.stroke(); }
    for (let x = 26; x < 58; x += 8) { ctx.beginPath(); ctx.moveTo(x, -4); ctx.lineTo(x + 8, 4); ctx.stroke(); }
    // hex core module
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; const x = 22 * Math.cos(a), y = 18 * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; const x = 12 * Math.cos(a), y = 10 * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke();
    // intact panel pair (left)
    [[-70, -30], [-48, -30], [-70, 8], [-48, 8]].forEach(([x, y]) => { ctx.strokeRect(x, y, 18, 22); ctx.beginPath(); ctx.moveTo(x, y + 11); ctx.lineTo(x + 18, y + 11); ctx.moveTo(x + 9, y); ctx.lineTo(x + 9, y + 22); ctx.stroke(); });
    // torn panel (right) drifting away
    ctx.save(); ctx.translate(78, -22); ctx.rotate(0.6); ctx.strokeRect(-9, -11, 18, 22); ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(66, -4); ctx.lineTo(70, -9); ctx.lineTo(74, -5); ctx.moveTo(60, 4); ctx.lineTo(64, 9); ctx.stroke();
    // antenna dish
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, -34); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -40, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // docking ring
    ctx.beginPath(); ctx.ellipse(0, 26, 8, 3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(0, 23); ctx.stroke();
  });
  // hull breach
  glow(RED, 10, () => { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(16, -2); ctx.lineTo(11, 4); ctx.lineTo(18, 9); ctx.lineTo(7, 6); ctx.lineTo(4, 0); ctx.closePath(); ctx.fill(); });
  // debris field with motion streaks
  for (let i = 0; i < 18; i++) {
    const x = 50 + r() * 70, y = -40 + r() * 70, sz = 1 + r() * 2.6
    ctx.fillStyle = i % 4 === 0 ? RED : YEL; ctx.fillRect(x, y, sz, sz)
    ctx.strokeStyle = hexA(YEL, 0.35); ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x, y + sz / 2); ctx.lineTo(x - 6 - r() * 8, y + sz / 2 + 2); ctx.stroke()
  }
  // spin arrow
  ctx.strokeStyle = hexA(YEL, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 44, 30, 0, Math.PI * 1.1, Math.PI * 1.55); ctx.stroke()
  const ea = Math.PI * 1.55, ex = 44 * Math.cos(ea), ey = 30 * Math.sin(ea)
  ctx.fillStyle = YEL; ctx.beginPath(); ctx.moveTo(ex + 5, ey + 1); ctx.lineTo(ex - 2, ey - 4); ctx.lineTo(ex - 1, ey + 5); ctx.closePath(); ctx.fill()
  ctx.restore();
  // scan sweep across the contact (screen space)
  const sxp = cx - 70 * sc + ((frame * 37) % 100) / 100 * 140 * sc
  ctx.save(); const g = ctx.createLinearGradient(sxp - 24, 0, sxp, 0); g.addColorStop(0, hexA(YEL, 0)); g.addColorStop(1, hexA(YEL, 0.22)); ctx.fillStyle = g; ctx.fillRect(sxp - 24, cy - 46 * sc, 24, 92 * sc);
  ctx.strokeStyle = hexA(YEL, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sxp, cy - 46 * sc); ctx.lineTo(sxp, cy + 46 * sc); ctx.stroke(); ctx.restore();
  // leader-line callouts
  if (k.details) {
    const tags = [[cx + 14 * sc, cy - 2 * sc, cx + 70, cy - 84, 'HULL BREACH // DECK 3', RED], [cx - 2 * sc, cy - 40 * sc, cx - 96, cy - 92, 'ANTENNA: NO CARRIER', YEL], [cx + 60 * sc, cy + 6 * sc, cx + 30, cy + 92, 'DEBRIS FIELD 0.6 KM', YEL], [cx - 60 * sc, cy + 18 * sc, cx - 50, cy + 92, `SPIN ${(0.4 + frame * 0.17).toFixed(1)}°/S`, YEL]]
    tags.forEach(([x1, y1, x2, y2, t, col]) => {
      ctx.strokeStyle = hexA(col, 0.85); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2 + (x2 > cx ? 14 : -14), y2); ctx.stroke()
      ctx.fillStyle = col; ctx.fillRect(x1 - 1.5, y1 - 1.5, 3, 3)
      spaced(ctx, t, x2 + (x2 > cx ? 16 : -16), y2 + 2.5, 6.5, mono, 400, 0.08, x2 > cx ? 'left' : 'right', col)
    })
  }
}

function drawOrbitalHome(ctx, th, Hl, W, H, s, frame) {
  frame = frame || 0
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th)
  const RED = c.accent, YEL = c.ink, BLU = c.glow, GRN = c.alert || '#3DFF8A', CYN = '#39D6FF'
  const lab = (t, x, y, size, col, align, wgt, fam) => spaced(ctx, t, x, y, size, fam || mono, wgt || 400, 0.08, align || 'left', col);
  const glow = (col, b, fn) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = b * k.glow; fn(); ctx.restore(); };
  // per-frame readings
  const fr = rng(seedOf(th, 900 + frame * 13))
  const sig = frame === 0 ? 18 : Math.round(6 + fr() * 58)
  const rangeKm = frame === 0 ? 540 : Math.round(420 + fr() * 460)
  const mm = frame === 0 ? 0 : Math.floor(fr() * 4), ss = frame === 0 ? 47 : Math.floor(fr() * 60)
  const lockPct = frame === 0 ? 94 : Math.round(40 + fr() * 58)
  const closing = (frame === 0 ? 2.3 : 0.8 + fr() * 3.4).toFixed(1), brg = frame === 0 ? 214 : Math.round(fr() * 359)
  const BANNERS = ['PROXIMITY ALERT', 'SIGNAL DEGRADING', 'LOCK UNSTABLE', 'CONTACT DRIFTING', 'RE-ACQUIRING', 'HULL BREACH DETECTED']
  const CAPS = ['LOSS OF SIGNAL IMMINENT', 'HOLD THE LOCK', 'RANGE CLOSING FAST', 'CARRIER WAVE LOST', 'SWEEPING SECTOR', 'DO NOT DOCK']
  const banner = frame === 0 ? (T.homeTop || BANNERS[0]) : BANNERS[frame % BANNERS.length]
  const caption = frame === 0 ? (T.caption || CAPS[0]) : CAPS[frame % CAPS.length]
  const countdown = frame === 0 ? (T.countdown || 'T-00:00:47') : `T-00:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  texture(ctx, Object.assign({}, th, { texture: 'scan', colors: Object.assign({}, c, { ink: '#9AD9FF' }) }), W, H, s);
  const r = rng(seedOf(th, 77 + frame))
  const pr = 520, px = -120, py = Hl + 260;
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fillStyle = hexA(BLU, 0.6); ctx.fill(); ctx.clip();
  ctx.strokeStyle = hexA('#6F8BFF', 0.6); ctx.lineWidth = 0.9;
  for (let i = 1; i <= 9; i++) { ctx.beginPath(); ctx.arc(px, py, pr - i * 22, 0, Math.PI * 2); ctx.stroke(); }
  for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (i - 7) * 0.09; ctx.beginPath(); ctx.moveTo(px + pr * Math.cos(a), py + pr * Math.sin(a)); ctx.lineTo(px, py); ctx.stroke(); }
  for (let i = 0; i < Math.round(70 * k.texture); i++) { ctx.fillStyle = 'rgba(0,0,0,0.55)'; const a = -Math.PI / 2 + (r() - 0.5) * 1.4, d = pr - 10 - r() * 160; ctx.fillRect(px + d * Math.cos(a), py + d * Math.sin(a), 4 + r() * 12, 2 + r() * 2); }
  ctx.restore();
  glow(GRN, 6, () => { ctx.strokeStyle = GRN; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(px, py, pr + 14, -Math.PI * 0.62, -Math.PI * 0.08); ctx.stroke(); });
  glow(CYN, 6, () => { ctx.strokeStyle = CYN; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, pr + 32, -Math.PI * 0.6, -Math.PI * 0.1); ctx.stroke(); });
  const cx = 206, cy = 410;
  centerXform(ctx, th, cx, cy, () => {
    for (let i = 0; i < 9; i++) {
      const t = i / 8, sz = 176 - t * 120, rot = -0.42 + t * 0.34, ox = (1 - t) * -46, oy = (1 - t) * 52;
      ctx.save(); ctx.translate(cx + ox, cy + oy); ctx.rotate(rot); ctx.transform(1, 0, -0.35, 1, 0, 0);
      ctx.strokeStyle = hexA(RED, 0.22 + t * 0.45); ctx.lineWidth = 1 + t * 0.6; ctx.strokeRect(-sz / 2, -sz * 0.36, sz, sz * 0.72);
      ctx.restore();
    }
    glow(YEL, 8, () => { ctx.strokeStyle = YEL; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(24, 650); ctx.quadraticCurveTo(70, 480, cx - 40, cy + 20); ctx.stroke(); });
    drawContact(ctx, th, cx, cy, 1.0, frame, k);
    ctx.strokeStyle = YEL; ctx.lineWidth = 2;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const x = cx + sx * 104, y = cy + sy * 66; ctx.beginPath(); ctx.moveTo(x - sx * 16, y); ctx.lineTo(x, y); ctx.lineTo(x, y - sy * 16); ctx.stroke(); });
    lab(`CONTACT K-${17 + frame} // LOCK ${lockPct}%`, cx - 104, cy - 72, 6.5, YEL);
  });
  for (let i = 0; i < 4; i++) { const y = 300 + r() * 220, h = 2 + r() * 5, off = (r() - 0.5) * 30; try { ctx.drawImage(ctx.canvas, 0, y * s, W, h * s, off * s, y * s, W, h * s); } catch (e) {} }
  const by = 244;
  ctx.save(); ctx.beginPath(); ctx.rect(22, by, 346, 22); ctx.clip();
  ctx.fillStyle = RED; ctx.fillRect(22, by, 346, 22);
  ctx.fillStyle = c.ground; for (let x = 0; x < 400; x += 18) { ctx.beginPath(); ctx.moveTo(x, by + 22); ctx.lineTo(x + 9, by + 22); ctx.lineTo(x + 31, by); ctx.lineTo(x + 22, by); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  const bw = Math.min(330, measureSpaced(ctx, banner, 11, disp, 800, 0.08) + 28);
  ctx.fillStyle = c.ground; ctx.fillRect(195 - bw / 2, by + 2, bw, 18);
  lab(banner, 195, by + 15.5, 11, RED, 'center', 800, disp);
  const lit = Math.max(1, Math.round(sig / 100 * 12));
  for (let i = 0; i < 12; i++) { const on = i < lit; ctx.fillStyle = on ? (sig < 25 ? RED : (i < 2 ? RED : YEL)) : hexA(YEL, 0.15); ctx.fillRect(24, 520 - i * 15, 14 + i * 1.2, 9); }
  lab('SIGNAL', 24, 352, 7, YEL); lab(`${sig}%`, 24, 538, 10, sig < 25 ? RED : YEL, 'left', 700, disp);
  ctx.strokeStyle = hexA(YEL, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(366, 300); ctx.lineTo(366, 520); ctx.stroke();
  for (let i = 0; i <= 11; i++) { const y = 300 + i * 20; ctx.beginPath(); ctx.moveTo(366, y); ctx.lineTo(366 - (i % 5 === 0 ? 10 : 5), y); ctx.stroke(); if (i % 5 === 0) lab(String(900 - i * 40), 352, y + 3, 7, hexA(YEL, 0.8), 'right'); }
  const my = 300 + Math.max(0, Math.min(220, (900 - rangeKm) / 40 * 20));
  ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(368, my); ctx.lineTo(378, my - 6); ctx.lineTo(378, my + 6); ctx.closePath(); ctx.fill();
  lab(String(rangeKm), 350, my + 3, 7.5, RED, 'right', 700);
  lab('RANGE KM', 368, 290, 7, YEL, 'right');
  glow(YEL, 10, () => { lab(countdown, 368, 590, 26, YEL, 'right', 800, disp); });
  lab(caption, 368, 608, 8, RED, 'right', 700);
  if (k.details) lab(`CLOSING ${closing} KM/S · BRG ${String(brg).padStart(3, '0')} · LOCK ${lockPct}%`, 368, 622, 6.5, hexA(YEL, 0.75), 'right');
  ctx.fillStyle = RED;
  [[0, 290, 12, 44], [0, 340, 7, 12], [378, 560, 12, 40], [383, 606, 7, 12]].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
}

// ---------- WHITE RABBIT motif ----------
function rSpark(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.22, y - r * 0.22); ctx.lineTo(x + r, y); ctx.lineTo(x + r * 0.22, y + r * 0.22); ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.22, y + r * 0.22); ctx.lineTo(x - r, y); ctx.lineTo(x - r * 0.22, y - r * 0.22); ctx.closePath(); ctx.fill(); }
function rHeart(ctx, x, y, s, fill, stroke, lw) { ctx.beginPath(); ctx.moveTo(x, y + s * 0.35); ctx.quadraticCurveTo(x - s * 0.55, y + s * 0.15, x - s * 0.5, y - s * 0.05); ctx.quadraticCurveTo(x - s * 0.35, y - s * 0.5, x, y - s * 0.12); ctx.quadraticCurveTo(x + s * 0.35, y - s * 0.5, x + s * 0.5, y - s * 0.05); ctx.quadraticCurveTo(x + s * 0.55, y + s * 0.15, x, y + s * 0.35); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
function rRabbit(ctx, x, y, s, fill, stroke, lw, eye) {
  const E = (cx, cy, rx, ry, rot) => { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); };
  E(x - s * 0.28, y + s * 0.14, s * 0.24, s * 0.08, 0.25); E(x + s * 0.2, y + s * 0.18, s * 0.16, s * 0.05, -0.3);
  E(x, y, s * 0.44, s * 0.2, -0.12); E(x + s * 0.4, y - s * 0.16, s * 0.17, s * 0.13, -0.2);
  E(x + s * 0.34, y - s * 0.42, s * 0.05, s * 0.2, -0.35); E(x + s * 0.46, y - s * 0.4, s * 0.05, s * 0.19, 0.1);
  E(x - s * 0.46, y - s * 0.08, s * 0.08, s * 0.08);
  ctx.fillStyle = eye; ctx.beginPath(); ctx.arc(x + s * 0.47, y - s * 0.18, s * 0.025, 0, Math.PI * 2); ctx.fill();
}
function drawRabbit(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  if (mode === 'home') { drawRabbitHome(ctx, th, Hl); return; }
  if (mode === 'lock') { drawRabbitLock(ctx, th, Hl, phraseIdx); return; }
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th);
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, hexA(c.panel, 1)); g.addColorStop(0.45, c.ground); g.addColorStop(1, hexA(c.glow, 0.55)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  const r = rng(seedOf(th, 211 + (mode === 'home' ? 7 : 0)));
  ctx.save(); ctx.globalAlpha = Math.min(1, 0.5 * k.texture);
  for (let i = 0; i < 26; i++) { const x = r() * 390, w = 2 + r() * 10; ctx.fillStyle = hexA('#FFFFFF', 0.06 + r() * 0.12); ctx.fillRect(x, 0, w, Hl); }
  ctx.lineWidth = 0.6; for (let i = 0; i < 34; i++) { const x0 = r() * 390, y0 = r() * Hl, a = (r() - 0.5) * 1.6 + (r() > 0.5 ? 0.9 : -0.9), L = 300 + r() * 500; ctx.strokeStyle = hexA(c.glow, 0.25 + r() * 0.35); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); ctx.stroke(); }
  ctx.restore();
  for (let i = 0; i < 18; i++) rHeart(ctx, r() * 390, r() * Hl, 10 + r() * 14, null, hexA(c.glow, 0.18), 0.8);
  const beams = mode === 'lock' ? [[-20, 150, 410, 300], [-20, 520, 410, 240], [60, -10, 236, 530], [-20, 772, 410, 722]] : [[-20, 260, 410, 340], [-20, 700, 410, 650], [300, -10, 230, 230]];
  beams.forEach(([x1, y1, x2, y2]) => { ctx.save(); ctx.strokeStyle = hexA(c.accent, 0.18 * k.glow); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = hexA(c.accent, 0.7); ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(x1 < 0 ? 4 : x1, x1 < 0 ? y1 + (y2 - y1) * (24 / (x2 - x1)) : 4, 2.5, 0, Math.PI * 2); ctx.fill(); });
  for (let i = 0; i < Math.round(26 * k.glow); i++) rSpark(ctx, r() * 390, r() * Hl, 2 + r() * 5, hexA(r() > 0.7 ? c.accent : '#FFFFFF', 0.5 + r() * 0.5));
  if (mode === 'lock') {
    const cy = 362;
    centerXform(ctx, th, 195, cy, () => {
      ctx.save(); ctx.strokeStyle = hexA(c.ink, 0.35); ctx.lineWidth = 1;
      for (let i = 0; i < 100; i++) { const a = i / 100 * Math.PI * 2 - Math.PI / 2, R1 = 156, l = i % 10 ? (i % 5 ? 3 : 6) : 10; ctx.beginPath(); ctx.moveTo(195 + R1 * Math.cos(a), cy + R1 * Math.sin(a) * 0.62); ctx.lineTo(195 + (R1 - l) * Math.cos(a), cy + (R1 - l) * Math.sin(a) * 0.62); ctx.stroke(); }
      for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2; spaced(ctx, String(i * 10), 195 + 170 * Math.cos(a), cy + 170 * Math.sin(a) * 0.62 + 3, 7, mono, 500, 0, 'center', hexA(c.ink, 0.55)); }
      ctx.fillStyle = c.accent; ctx.beginPath(); ctx.moveTo(195, cy - 156 * 0.62 - 12); ctx.lineTo(189, cy - 156 * 0.62 - 22); ctx.lineTo(201, cy - 156 * 0.62 - 22); ctx.closePath(); ctx.fill();
      ctx.restore();
      const cw = 270, ch = 150, x0 = 195 - cw / 2, y0 = cy - ch / 2;
      ctx.save(); ctx.shadowColor = hexA(c.glow, 0.8); ctx.shadowBlur = 24 * k.glow;
      const pg = ctx.createLinearGradient(x0, y0, x0 + cw, y0 + ch); pg.addColorStop(0, '#FFFFFF'); pg.addColorStop(0.5, c.panel); pg.addColorStop(1, hexA(c.glow, 0.7));
      ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(x0, y0, cw, ch, 72); ctx.fill(); ctx.restore();
      ctx.strokeStyle = hexA(c.ink, 0.55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x0, y0, cw, ch, 72); ctx.stroke();
      ctx.fillStyle = hexA('#FFFFFF', 0.7); ctx.beginPath(); ctx.ellipse(x0 + 70, y0 + 34, 52, 12, -0.2, 0, Math.PI * 2); ctx.fill();
      rRabbit(ctx, 192, cy + 8, 170, '#FFFFFF', hexA(c.ink, 0.6), 1.4, c.accent);
      rSpark(ctx, 120, cy - 30, 9, '#FFFFFF'); rSpark(ctx, 140, cy - 46, 4, '#FFFFFF'); rSpark(ctx, 284, cy + 40, 6, c.accent);
      ctx.strokeStyle = hexA(c.ink, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + 26, cy + 22); ctx.lineTo(x0 + 40, cy + 22); ctx.lineTo(x0 + 46, cy + 30); ctx.stroke();
      spaced(ctx, '+', x0 + 30, cy - 18, 12, mono, 400, 0, 'center', hexA(c.ink, 0.5));
      ctx.save(); ctx.translate(300, cy + 94); ctx.rotate(0.22); ctx.shadowColor = hexA(c.ink, 0.25); ctx.shadowBlur = 10; ctx.fillStyle = c.panel; ctx.beginPath(); ctx.roundRect(-34, -48, 68, 96, 6); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = hexA(c.accent, 0.8); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(-30, -44, 60, 88, 4); ctx.stroke();
      rRabbit(ctx, -2, 2, 40, '#FFFFFF', hexA(c.ink, 0.7), 1, c.accent); rSpark(ctx, -20, -32, 4, c.accent); rSpark(ctx, 20, 34, 4, c.accent);
      spaced(ctx, `LOT 0${[1, 3, 5, 7][phraseIdx % 4]}/07`, 0, 40, 6.5, mono, 500, 0.1, 'center', c.ink); ctx.restore();
    });
    if (k.details) { spaced(ctx, T.tagL || 'FIELD UNIT · RECON 07', 24, 234, 7.5, mono, 500, 0.14, 'left', hexA(c.ink, 0.7)); spaced(ctx, T.tagR || 'WHITE RABBIT', 366, 234, 7.5, mono, 500, 0.14, 'right', c.accent); spaced(ctx, ['HEIST 01 // THE GALA', 'HEIST 03 // THE VAULT', 'HEIST 05 // THE RIVAL', 'HEIST 07 // THE LAST LOT'][phraseIdx % 4], 24, 248, 7, mono, 500, 0.14, 'left', hexA(c.ink, 0.5)); }
    const ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
    const l1 = th.upper ? ph[0].toUpperCase() : ph[0], l2 = th.upper ? ph[1].toUpperCase() : ph[1];
    const fs = Math.min(46, 46 * 340 / Math.max(1, measureSpaced(ctx, l1.length > l2.length ? l1 : l2, 46, disp, dw, 0)));
    ctx.save(); ctx.shadowColor = hexA('#FFFFFF', 0.8); ctx.shadowBlur = 10;
    spaced(ctx, l1, 195, 594, fs, disp, dw, 0, 'center', c.ink); spaced(ctx, l2, 195, 594 + fs * 1.04, fs, disp, dw, 0, 'center', c.ink); ctx.restore();
    rSpark(ctx, 195, 594 + fs * 1.04 + 22, 5, c.accent);
    spaced(ctx, T.sub || '', 195, 594 + fs * 1.04 + 42, 9.5, disp, 400, 0, 'center', hexA(c.ink, 0.75));
    if (k.details) { spaced(ctx, T.foot || 'WHITE RABBIT // RECON 07', 195, Hl - 34, 7, mono, 500, 0.2, 'center', hexA(c.ink, 0.6)); }
  } else {
    const cx = 195, cy = 430;
    centerXform(ctx, th, cx, cy, () => {
      for (let i = 9; i >= 0; i--) { const t = i / 9, rx = 30 + t * 150, ry = 20 + t * 96, ox = Math.sin(t * 2.4) * 14; ctx.strokeStyle = hexA(c.ink, 0.12 + (1 - t) * 0.35); ctx.lineWidth = 1 + (1 - t) * 0.8; ctx.fillStyle = hexA(c.glow, 0.04 + (1 - t) * 0.05); ctx.beginPath(); ctx.ellipse(cx + ox, cy + t * 8, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = hexA(c.ink, 0.65); ctx.beginPath(); ctx.ellipse(cx + 4, cy - 2, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
      const items = [[cx - 112, cy - 104, 'watch'], [cx + 100, cy - 92, 'card'], [cx - 84, cy + 70, 'gem'], [cx + 74, cy + 84, 'key'], [cx + 4, cy - 156, 'crown'], [cx + 130, cy + 8, 'ring'], [cx - 140, cy - 10, 'necklace'], [cx - 10, cy + 120, 'egg']];
      items.forEach(([x, y, kind]) => {
        ctx.strokeStyle = c.ink; ctx.lineWidth = 1.3; ctx.fillStyle = c.panel;
        if (kind === 'watch') { ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 4); ctx.moveTo(x, y); ctx.lineTo(x - 2, y - 11); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y - 20, 4, 0, Math.PI * 2); ctx.stroke(); }
        if (kind === 'card' || kind === 'card2') { ctx.save(); ctx.translate(x, y); ctx.rotate(kind === 'card' ? 0.4 : -0.3); ctx.beginPath(); ctx.roundRect(-14, -20, 28, 40, 3); ctx.fill(); ctx.stroke(); rHeart(ctx, 0, 0, 12, c.accent); ctx.restore(); }
        if (kind === 'gem') { ctx.beginPath(); ctx.moveTo(x - 14, y - 6); ctx.lineTo(x - 8, y - 13); ctx.lineTo(x + 8, y - 13); ctx.lineTo(x + 14, y - 6); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fillStyle = hexA(c.accent, 0.35); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 14, y - 6); ctx.lineTo(x + 14, y - 6); ctx.moveTo(x - 5, y - 6); ctx.lineTo(x, y + 14); ctx.lineTo(x + 5, y - 6); ctx.stroke(); }
        if (kind === 'crown') { ctx.beginPath(); ctx.moveTo(x - 16, y + 8); ctx.lineTo(x - 16, y - 6); ctx.lineTo(x - 8, y + 1); ctx.lineTo(x, y - 12); ctx.lineTo(x + 8, y + 1); ctx.lineTo(x + 16, y - 6); ctx.lineTo(x + 16, y + 8); ctx.closePath(); ctx.fillStyle = c.panel; ctx.fill(); ctx.stroke(); [x - 16, x, x + 16].forEach(px => { ctx.beginPath(); ctx.arc(px, px === x ? y - 14 : y - 8, 2.4, 0, Math.PI * 2); ctx.fillStyle = c.accent; ctx.fill(); }); }
        if (kind === 'ring') { ctx.beginPath(); ctx.arc(x, y + 4, 9, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 5, y - 5); ctx.lineTo(x, y - 12); ctx.lineTo(x + 5, y - 5); ctx.closePath(); ctx.fillStyle = hexA(c.accent, 0.5); ctx.fill(); ctx.stroke(); }
        if (kind === 'necklace') { ctx.beginPath(); ctx.arc(x, y - 6, 16, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); for (let j = 0; j < 7; j++) { const a = (0.18 + j * 0.1) * Math.PI; ctx.beginPath(); ctx.arc(x + 16 * Math.cos(a), y - 6 + 16 * Math.sin(a), 2.6, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.stroke(); } rHeart(ctx, x, y + 14, 9, c.accent); }
        if (kind === 'egg') { ctx.beginPath(); ctx.ellipse(x, y, 10, 13, 0, 0, Math.PI * 2); ctx.fillStyle = c.panel; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 10, y - 2); ctx.lineTo(x + 10, y - 2); ctx.moveTo(x - 9, y + 4); ctx.lineTo(x + 9, y + 4); ctx.stroke(); rSpark(ctx, x, y + 1, 3, c.accent); }
        if (kind === 'cup') { ctx.beginPath(); ctx.moveTo(x - 14, y - 8); ctx.lineTo(x + 14, y - 8); ctx.quadraticCurveTo(x + 12, y + 12, x, y + 12); ctx.quadraticCurveTo(x - 12, y + 12, x - 14, y - 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 17, y - 1, 5, -1.2, 1.4); ctx.stroke(); }
        if (kind === 'key') { ctx.beginPath(); ctx.arc(x - 12, y, 6, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 16, y); ctx.moveTo(x + 10, y); ctx.lineTo(x + 10, y + 6); ctx.moveTo(x + 15, y); ctx.lineTo(x + 15, y + 5); ctx.stroke(); }
      });
      rRabbit(ctx, cx - 6, cy - 46, 70, '#FFFFFF', hexA(c.ink, 0.6), 1.2, c.accent);
    });
    if (k.details) spaced(ctx, T.homeTop || 'THE HOLE GOES DOWN FOREVER', 195, 236, 7.5, mono, 500, 0.2, 'center', hexA(c.ink, 0.6));
    spaced(ctx, T.caption || 'Mind the drop.', 195, 600, 11, disp, 400, 0, 'center', hexA(c.ink, 0.75));
  }
}
function drawPearlIcon(ctx, th, glyph, num, code) {
  const c = th.colors;
  const g = ctx.createLinearGradient(0, 0, 1024, 1024); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.55, c.panel); g.addColorStop(1, hexA(c.glow, 0.8)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = hexA(c.glow, 1); ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(110, 110, 804, 804, 150); ctx.stroke();
  ctx.fillStyle = hexA('#FFFFFF', 0.75); ctx.beginPath(); ctx.ellipse(330, 250, 190, 50, -0.35, 0, Math.PI * 2); ctx.fill();
  rSpark(ctx, 820, 210, 46, c.accent); rSpark(ctx, 760, 290, 18, hexA(c.accent, 0.7));
  ctx.save(); ctx.translate(312, 300); ctx.scale(16.6, 16.6); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
  spaced(ctx, num, 190, 200, 50, th.fonts.mono, 500, 0.06, 'left', hexA(c.ink, 0.6));
  spaced(ctx, code, 512, 870, 50, th.fonts.mono, 500, 0.12, 'center', c.ink);
}

// ---------- shared helpers for the four new motifs ----------
function headline2(ctx, th, phraseIdx, cx, y, maxW, base, color, fx) {
  const disp = th.fonts.display, dw = dispWeight(disp), ph = th.phrases[phraseIdx % th.phrases.length] || ['', ''];
  const l1 = th.upper ? ph[0].toUpperCase() : ph[0], l2 = th.upper ? ph[1].toUpperCase() : ph[1];
  const fs = Math.min(base, base * maxW / Math.max(1, measureSpaced(ctx, l1.length > l2.length ? l1 : l2, base, disp, dw, 0)));
  if (fx) fx(() => { spaced(ctx, l1, cx, y, fs, disp, dw, 0, 'center', color); spaced(ctx, l2, cx, y + fs * 1.06, fs, disp, dw, 0, 'center', color); }, fs);
  else { spaced(ctx, l1, cx, y, fs, disp, dw, 0, 'center', color); spaced(ctx, l2, cx, y + fs * 1.06, fs, disp, dw, 0, 'center', color); }
  return fs;
}

// ---------- NEON DISTRICT (cyberpunk) ----------
function neonSkyline(ctx, th, r, Hl, baseY, layers) {
  const c = th.colors, cols = [c.accent, c.glow, c.alert || c.glow];
  for (let L = 0; L < layers; L++) {
    const shade = hexA(L === layers - 1 ? '#000000' : c.panel, 0.55 + L * 0.2);
    let x = -10;
    while (x < 400) {
      const w = 22 + r() * 40, h = 90 + r() * (220 - L * 50); const y = baseY - h + L * 30;
      ctx.fillStyle = shade; ctx.fillRect(x, y, w, Hl - y);
      if (r() > 0.6) { ctx.strokeStyle = hexA(c.ink, 0.25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y - 14 - r() * 20); ctx.stroke(); ctx.fillStyle = c.accent; ctx.fillRect(x + w / 2 - 1, y - 16 - r() * 20, 2, 2); }
      for (let wy = y + 6; wy < Math.min(Hl, y + h); wy += 7) for (let wx = x + 4; wx < x + w - 4; wx += 6) if (r() > 0.72) { ctx.fillStyle = hexA(cols[Math.floor(r() * 3)], 0.25 + r() * 0.45); ctx.fillRect(wx, wy, 2.5, 3); }
      x += w + 2 + r() * 6;
    }
  }
}
function neonGrid(ctx, th, y0, Hl, col) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(195 + i * 12, y0); ctx.lineTo(195 + i * 70, Hl); ctx.stroke(); } for (let j = 0; j < 12; j++) { const t = Math.pow(j / 11, 1.8), y = y0 + (Hl - y0) * t; ctx.globalAlpha = 0.3 + t * 0.7; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke(); } ctx.restore(); }
function neonGlitch(ctx, r, Hl, n) { const S = ctx.canvas.width / 390; for (let i = 0; i < n; i++) { const y = r() * Hl, h = 2 + r() * 10, dx = (r() - 0.5) * 24; try { ctx.drawImage(ctx.canvas, 0, y * S, ctx.canvas.width, h * S, dx, y, 390, h); } catch (e) {} } }
function drawNeon(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  if (mode === 'home') { drawNeonHome(ctx, th, Hl); return; }
  if (mode === 'lock') { drawNeonLock(ctx, th, Hl, phraseIdx); return; }
  const c = th.colors, T = th.text, mono = th.fonts.mono, k = K(th), r = rng(seedOf(th, 307 + (mode === 'home' ? 9 : 0)));
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, c.ground); g.addColorStop(0.6, hexA(c.panel, 1)); g.addColorStop(1, hexA(c.accent, 0.25)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.fillStyle = hexA(c.glow, 0.08 * k.glow); ctx.beginPath(); ctx.ellipse(195, Hl * 0.42, 260, 180, 0, 0, Math.PI * 2); ctx.fill();
  neonSkyline(ctx, th, r, Hl, mode === 'lock' ? 560 : 520, 3);
  ctx.strokeStyle = hexA(c.glow, 0.16 * k.texture); ctx.lineWidth = 0.8; for (let i = 0; i < 120; i++) { const x = r() * 420, y = r() * Hl, l = 12 + r() * 26; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.25, y + l); ctx.stroke(); }
  if (mode === 'lock') {
    neonGrid(ctx, th, 700, Hl, hexA(c.accent, 0.55));
    centerXform(ctx, th, 195, 390, () => {
      const bx = 28, by = 290, bw = 334, bh = 200;
      ctx.fillStyle = hexA(c.ground, 0.78); ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.fill();
      ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 18 * k.glow; ctx.strokeStyle = c.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.shadowColor = c.glow; ctx.shadowBlur = 10 * k.glow; ctx.strokeStyle = hexA(c.glow, 0.9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(bx + 8, by + 8, bw - 16, bh - 16, 9); ctx.stroke(); ctx.restore();
      spaced(ctx, 'SPONSORED // HOLO-AD 0x7F3A', bx + 18, by + 26, 7, mono, 400, 0.1, 'left', hexA(c.glow, 0.85));
      spaced(ctx, '▲ 4.20%', bx + bw - 18, by + 26, 7, mono, 400, 0.1, 'right', c.alert || c.glow);
      headline2(ctx, th, phraseIdx, 195, by + 92, 290, 38, c.ink, (draw, fs) => {
        ctx.save(); ctx.globalAlpha = 0.85; ctx.translate(-2.5, 0); ctx.shadowColor = c.glow; ctx.shadowBlur = 0; spaced(ctx, '', 0, 0, 1, mono, 400, 0, 'left', c.glow); ctx.restore();
        ctx.save(); ctx.translate(2, 1); ctx.globalAlpha = 0.8; const ph = th.phrases[phraseIdx % th.phrases.length]; const disp = th.fonts.display, dw = dispWeight(disp);
        spaced(ctx, ph[0].toUpperCase(), 195, by + 92, fs, disp, dw, 0, 'center', c.glow); spaced(ctx, ph[1].toUpperCase(), 195, by + 92 + fs * 1.06, fs, disp, dw, 0, 'center', c.glow); ctx.restore();
        ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 16 * k.glow; draw(); ctx.restore();
      });
      spaced(ctx, T.sub || '', 195, by + bh - 22, 8, mono, 400, 0.04, 'center', hexA(c.ink, 0.75));
    });
    if (k.details) { spaced(ctx, T.tagL || '', 24, 252, 7.5, mono, 400, 0.14, 'left', hexA(c.glow, 0.9)); spaced(ctx, T.tagR || '', 366, 252, 7.5, mono, 400, 0.14, 'right', c.accent);
      const tick = ['SABL +2.1', 'CHRM -0.4', 'NRVE +9.9', 'DATA +4.2', 'RENT +12.0']; spaced(ctx, tick.join('   '), 24, 520, 7, mono, 400, 0.06, 'left', hexA(c.alert || c.glow, 0.8)); spaced(ctx, T.foot || '', 195, Hl - 34, 7, mono, 400, 0.18, 'center', hexA(c.ink, 0.6)); }
    neonGlitch(ctx, r, Hl, Math.round(7 * k.texture));
  } else {
    neonGrid(ctx, th, 640, Hl, hexA(c.accent, 0.45));
    centerXform(ctx, th, 300, 420, () => {
      const sx = 300, sy = 268, sw = 54, sh = 300; ctx.fillStyle = hexA(c.ground, 0.85); ctx.beginPath(); ctx.roundRect(sx - sw / 2, sy, sw, sh, 8); ctx.fill();
      ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 16 * k.glow; ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(sx - sw / 2, sy, sw, sh, 8); ctx.stroke(); ctx.restore();
      const word = (T.homeTop || 'OPEN 24/7').replace(/\s+/g, ''); const step = Math.min(30, (sh - 30) / word.length);
      ctx.save(); ctx.shadowColor = c.glow; ctx.shadowBlur = 14 * k.glow; [...word].forEach((ch, i) => spaced(ctx, ch, sx, sy + 30 + i * step, 22, th.fonts.display, dispWeight(th.fonts.display), 0, 'center', c.glow)); ctx.restore();
    });
    for (let i = 0; i < 4; i++) { const dx = 40 + r() * 200, dy = 260 + r() * 260; ctx.save(); ctx.strokeStyle = hexA(c.alert || c.glow, 0.5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(dx - 60, dy + 8); ctx.lineTo(dx, dy); ctx.stroke(); ctx.restore(); ctx.fillStyle = c.alert || c.glow; ctx.beginPath(); ctx.arc(dx, dy, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = c.accent; ctx.fillRect(dx - 5, dy - 1, 3, 2); ctx.fillRect(dx + 2, dy - 1, 3, 2); }
    ctx.save(); ctx.globalAlpha = 0.35; for (let i = 0; i < 18; i++) { const x = r() * 390, w = 2 + r() * 6; ctx.fillStyle = [c.accent, c.glow][i % 2]; ctx.fillRect(x, 700 + r() * 40, w, 30 + r() * 60); } ctx.restore();
    if (k.details) spaced(ctx, T.caption || '', 120, 600, 9, mono, 400, 0.1, 'center', hexA(c.ink, 0.7));
    neonGlitch(ctx, r, Hl, Math.round(5 * k.texture));
  }
}
function drawNeonIcon(ctx, th, glyph, num, code) {
  const c = th.colors; ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = hexA(c.glow, 0.18); ctx.lineWidth = 2; for (let y = 0; y < 1024; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke(); }
  ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 40; ctx.strokeStyle = c.accent; ctx.lineWidth = 16; ctx.beginPath(); ctx.roundRect(110, 110, 804, 804, 90); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = hexA(c.glow, 0.8); ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(150, 150, 724, 724, 64); ctx.stroke();
  ctx.save(); ctx.translate(312, 290); ctx.scale(16.6, 16.6); ctx.shadowColor = c.glow; ctx.shadowBlur = 2; ctx.fillStyle = c.glow; ctx.fill(glyph, 'evenodd'); ctx.restore();
  ctx.fillStyle = c.accent; ctx.fillRect(760, 200, 60, 12); ctx.fillRect(790, 220, 30, 12);
  spaced(ctx, num, 196, 214, 46, th.fonts.mono, 400, 0.06, 'left', hexA(c.ink, 0.6));
  spaced(ctx, code, 512, 862, 50, th.fonts.mono, 400, 0.14, 'center', c.accent);
}

// ---------- VAPOR PLAZA (vaporwave) ----------
function vaporPalm(ctx, x, y, s, col, flip) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * 0.06;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * 0.12, -s * 0.6, s * 0.3, -s * 1.1); ctx.stroke();
  const tx = s * 0.3, ty = -s * 1.1;
  for (let i = 0; i < 7; i++) { const a = -Math.PI * 0.95 + i * Math.PI * 0.32, L = s * (0.45 + (i % 2) * 0.12); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - s * 0.12, tx + Math.cos(a) * L, ty + Math.sin(a) * L + s * 0.12); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - s * 0.02, tx, ty); ctx.fill(); }
  ctx.restore();
}
function vaporWindow(ctx, th, x, y, w, h, title, body) {
  const c = th.colors, grey = '#C3C3D0';
  ctx.fillStyle = grey; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, w, 2); ctx.fillRect(x, y, 2, h); ctx.fillStyle = '#4A4A5A'; ctx.fillRect(x, y + h - 2, w, 2); ctx.fillRect(x + w - 2, y, 2, h);
  const tg = ctx.createLinearGradient(x, 0, x + w, 0); tg.addColorStop(0, '#1A1A80'); tg.addColorStop(1, c.accent); ctx.fillStyle = tg; ctx.fillRect(x + 4, y + 4, w - 8, 16);
  spaced(ctx, title, x + 9, y + 15.5, 10, th.fonts.mono, 400, 0.04, 'left', '#FFFFFF');
  [[w - 20, 'x'], [w - 36, '□'], [w - 52, '_']].forEach(([dx, ch]) => { ctx.fillStyle = grey; ctx.fillRect(x + dx, y + 6, 13, 12); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x + dx, y + 6, 13, 1); ctx.fillStyle = '#000'; spaced(ctx, ch, x + dx + 6.5, y + 15.5, 9, th.fonts.mono, 400, 0, 'center', '#000000'); });
  if (body) body(x + 6, y + 24, w - 12, h - 30);
}
function vaporScene(ctx, th, r, Hl, horizon, sunR, sunY) {
  const c = th.colors;
  const g = ctx.createLinearGradient(0, 0, 0, horizon); g.addColorStop(0, c.ground); g.addColorStop(0.55, hexA(c.accent, 0.75)); g.addColorStop(1, hexA(c.alert || '#FFB86C', 0.9)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, horizon);
  const kv = K(th); for (let i = 0; i < Math.round(60 * kv.texture); i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`; ctx.fillRect(r() * 390, r() * horizon * 0.5, 1.4, 1.4); }
  for (let g2 = 4; g2 >= 1; g2--) { ctx.fillStyle = hexA(c.alert || '#FFFB96', Math.min(0.4, 0.05 * kv.glow)); ctx.beginPath(); ctx.arc(195, sunY, sunR + g2 * 14, 0, Math.PI * 2); ctx.fill() }
  const sg = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR); sg.addColorStop(0, c.alert || '#FFFB96'); sg.addColorStop(1, c.accent); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(195, sunY, sunR, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(195, sunY, sunR, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = g; for (let i = 0; i < 7; i++) { const t = i / 6, y = sunY + sunR * (0.1 + t * 0.84), h = 2 + t * 6; ctx.fillRect(195 - sunR, y, sunR * 2, h); } ctx.restore();
  const fg = ctx.createLinearGradient(0, horizon, 0, Hl); fg.addColorStop(0, hexA(c.panel, 1)); fg.addColorStop(1, c.ground); ctx.fillStyle = fg; ctx.fillRect(0, horizon, 390, Hl - horizon);
  ctx.save(); ctx.strokeStyle = c.accent; ctx.shadowColor = c.accent; ctx.shadowBlur = 6 * kv.glow; ctx.lineWidth = 1.2;
  for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(195 + i * 10, horizon); ctx.lineTo(195 + i * 90, Hl); ctx.stroke(); }
  for (let j = 1; j < 14; j++) { const t = Math.pow(j / 13, 2), y = horizon + (Hl - horizon) * t; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = hexA(c.glow, 0.9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(390, horizon); ctx.stroke();
  ctx.fillStyle = hexA('#000000', Math.min(0.25, 0.06 * kv.texture)); for (let y = 0; y < Hl; y += 3) ctx.fillRect(0, y, 390, 1);
}
function vaporColumn(ctx, x, y, w, h) { const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#F4EEF8'); g.addColorStop(0.5, '#FFFFFF'); g.addColorStop(1, '#BFB3CF'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#E8E0F0'; ctx.fillRect(x - 6, y - 10, w + 12, 10); ctx.fillRect(x - 8, y + h, w + 16, 10); ctx.strokeStyle = 'rgba(120,100,150,.35)'; ctx.lineWidth = 1; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 5, y); ctx.lineTo(x + i * w / 5, y + h); ctx.stroke(); } }
function drawVapor(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  if (mode === 'lock') { drawVaporLock(ctx, th, Hl, phraseIdx); return; }
  const c = th.colors, T = th.text, mono = th.fonts.mono, k = K(th), r = rng(seedOf(th, 503 + (mode === 'home' ? 9 : 0)));
  if (mode === 'lock') {
    vaporScene(ctx, th, r, Hl, 500, 112, 420);
    vaporPalm(ctx, 4, 566, 140, hexA('#1A0630', 0.95), false); vaporPalm(ctx, 386, 566, 150, hexA('#1A0630', 0.95), true);
    centerXform(ctx, th, 195, 190, () => vaporWindow(ctx, th, 80, 140, 230, 96, 'plaza.exe', (x, y, w, h) => { spaced(ctx, 'Welcome to the plaza.', x + 8, y + 22, 13, mono, 400, 0, 'left', '#000000'); spaced(ctx, 'All stores open forever.', x + 8, y + 38, 13, mono, 400, 0, 'left', '#333344'); ctx.fillStyle = '#C3C3D0'; ctx.fillRect(x + w - 54, y + h - 22, 48, 18); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(x + w - 54, y + h - 22, 48, 18); spaced(ctx, 'OK', x + w - 30, y + h - 9, 12, mono, 400, 0, 'center', '#000000'); }));
    if (k.details) { spaced(ctx, 'V A P O R   P L A Z A', 24, 262, 9, mono, 400, 0.1, 'left', hexA(c.ink, 0.85)); spaced(ctx, T.tagR || 'OPEN', 366, 262, 9, mono, 400, 0.1, 'right', c.glow); }
    headline2(ctx, th, phraseIdx, 195, 610, 330, 46, '#FFFFFF', (draw, fs) => { const ph = th.phrases[phraseIdx % th.phrases.length]; const disp = th.fonts.display, dw = dispWeight(disp); ctx.save(); ctx.translate(3, 3); spaced(ctx, ph[0], 195, 610, fs, disp, dw, 0, 'center', c.glow); spaced(ctx, ph[1], 195, 610 + fs * 1.06, fs, disp, dw, 0, 'center', c.glow); ctx.restore(); ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 10 * k.glow; draw(); ctx.restore(); });
    spaced(ctx, T.sub || '', 195, 716, 14, mono, 400, 0.04, 'center', hexA(c.ink, 0.9));
    if (k.details) spaced(ctx, T.foot || '', 195, Hl - 34, 11, mono, 400, 0.12, 'center', hexA(c.ink, 0.75));
  } else {
    vaporScene(ctx, th, r, Hl, 470, 84, 410);
    vaporPalm(ctx, 4, 522, 112, hexA('#1A0630', 0.95), false); vaporPalm(ctx, 386, 522, 118, hexA('#1A0630', 0.95), true);
    centerXform(ctx, th, 195, 420, () => {
      vaporWindow(ctx, th, 110, 248, 170, 64, 'mall_map.bmp', (x, y, w, h) => { const cw = (w - 16) / 3; for (let i = 0; i < 6; i++) { ctx.fillStyle = [c.accent, c.glow, c.alert || '#FFFB96'][i % 3]; ctx.fillRect(x + 4 + (i % 3) * (cw + 4), y + 4 + Math.floor(i / 3) * 16, cw, 12); } });
      vaporColumn(ctx, 58, 528, 24, 92);
      vaporWindow(ctx, th, 204, 522, 152, 56, 'fountain.wav', (x, y, w) => { const n = 24, bw = (w - 12) / n; for (let i = 0; i < n; i++) { const hh = 4 + Math.abs(Math.sin(i * 0.7)) * 18; ctx.fillStyle = '#1A1A80'; ctx.fillRect(x + 6 + i * bw, y + 14 - hh / 2, bw * 0.6, hh); } });
    });
    if (k.details) spaced(ctx, T.homeTop || '', 195, 236, 10, mono, 400, 0.14, 'center', hexA(c.ink, 0.85));
    spaced(ctx, T.caption || '', 195, 640, 14, mono, 400, 0.06, 'center', hexA(c.ink, 0.9));
  }
}
function drawWin95Icon(ctx, th, glyph, num, code) {
  const c = th.colors; ctx.fillStyle = hexA(c.ground, 1); ctx.fillRect(0, 0, 1024, 1024);
  const x = 120, y = 120, w = 784, h = 784, grey = '#C3C3D0';
  ctx.fillStyle = grey; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, w, 14); ctx.fillRect(x, y, 14, h); ctx.fillStyle = '#4A4A5A'; ctx.fillRect(x, y + h - 14, w, 14); ctx.fillRect(x + w - 14, y, 14, h);
  const tg = ctx.createLinearGradient(x, 0, x + w, 0); tg.addColorStop(0, '#1A1A80'); tg.addColorStop(1, c.accent); ctx.fillStyle = tg; ctx.fillRect(x + 24, y + 24, w - 48, 90);
  ctx.fillStyle = grey; ctx.fillRect(x + w - 104, y + 38, 64, 60); ctx.fillStyle = '#000'; spaced(ctx, 'x', x + w - 72, y + 86, 56, th.fonts.mono, 400, 0, 'center', '#000000');
  spaced(ctx, num, x + 50, y + 92, 60, th.fonts.mono, 400, 0, 'left', '#FFFFFF');
  ctx.save(); ctx.translate(342, 330); ctx.scale(14.2, 14.2); ctx.fillStyle = '#101018'; ctx.fill(glyph, 'evenodd'); ctx.restore();
  spaced(ctx, code, 512, 850, 70, th.fonts.mono, 400, 0.04, 'center', '#101018');
}

// ---------- WILDWOOD (botanical nature) ----------
function wFern(ctx, x, y, len, ang, col, ink, lw) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = ink; ctx.lineWidth = lw || 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.1, -len * 0.5, 0, -len); ctx.stroke();
  for (let i = 1; i < 18; i++) { const t = i / 18, py = -len * t, px = Math.sin(t * Math.PI) * len * 0.05, L = len * 0.24 * Math.sin(t * Math.PI * 0.95) * (1 - t * 0.4) + 3;
    [-1, 1].forEach(side => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + side * L * 0.5, py - L * 0.35, px + side * L, py - L * 0.12); ctx.quadraticCurveTo(px + side * L * 0.5, py + L * 0.12, px, py); ctx.fill(); ctx.strokeStyle = hexA(ink, 0.55); ctx.lineWidth = 0.6; ctx.stroke(); }); }
  ctx.restore();
}
function wLeaf(ctx, x, y, s, ang, col, ink) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * 0.5, -s * 0.45, s, 0); ctx.quadraticCurveTo(s * 0.5, s * 0.45, 0, 0); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 0.9; ctx.stroke(); ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s, 0); for (let i = 1; i < 5; i++) { ctx.moveTo(s * i / 5, 0); ctx.lineTo(s * i / 5 + s * 0.1, -s * 0.16); ctx.moveTo(s * i / 5, 0); ctx.lineTo(s * i / 5 + s * 0.1, s * 0.16); } ctx.stroke(); ctx.restore(); }
function wMushroom(ctx, x, y, s, cap, ink) { ctx.fillStyle = '#F4EEDF'; ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x - s * 0.14, y); ctx.quadraticCurveTo(x - s * 0.1, y - s * 0.5, x - s * 0.08, y - s * 0.6); ctx.lineTo(x + s * 0.08, y - s * 0.6); ctx.quadraticCurveTo(x + s * 0.1, y - s * 0.5, x + s * 0.14, y); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = cap; ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.55); ctx.quadraticCurveTo(x, y - s * 1.15, x + s * 0.5, y - s * 0.55); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#FFF8EC'; [[-0.2, -0.75, 0.06], [0.12, -0.85, 0.05], [0.28, -0.65, 0.04], [-0.05, -0.62, 0.035]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, rr * s, 0, Math.PI * 2); ctx.fill(); }); }
function drawBotanical(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, k = K(th), r = rng(seedOf(th, 607 + (mode === 'home' ? 9 : 0)));
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl);
  ctx.fillStyle = hexA(c.ink, 0.05 * k.texture); for (let i = 0; i < 900; i++) ctx.fillRect(r() * 390, r() * Hl, 1, 1);
  const vg = ctx.createRadialGradient(195, Hl * 0.45, 120, 195, Hl * 0.45, 520); vg.addColorStop(0, 'rgba(255,255,240,0)'); vg.addColorStop(1, hexA(c.ink, 0.18)); ctx.fillStyle = vg; ctx.fillRect(0, 0, 390, Hl);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(255,250,220,${0.08 * k.glow})`; ctx.beginPath(); ctx.ellipse(r() * 390, 120 + r() * 500, 30 + r() * 50, 18 + r() * 30, r(), 0, Math.PI * 2); ctx.fill(); }
  if (mode === 'lock') {
    drawWildLock(ctx, th, Hl, phraseIdx);
  } else {
    drawWildHome(ctx, th, Hl);
  }
}
function drawLeafIcon(ctx, th, glyph, num, code) {
  const c = th.colors; ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = c.panel; ctx.beginPath(); ctx.roundRect(120, 120, 784, 784, 120); ctx.fill(); ctx.strokeStyle = c.glow; ctx.lineWidth = 12; ctx.stroke();
  ctx.save(); ctx.translate(780, 210); ctx.rotate(-0.6); ctx.fillStyle = hexA(c.glow, 0.9); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(50, -40, 100, 0); ctx.quadraticCurveTo(50, 40, 0, 0); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(312, 300); ctx.scale(16.6, 16.6); ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore();
  spaced(ctx, num, 196, 214, 46, th.fonts.mono, 400, 0.06, 'left', hexA(c.ink, 0.55));
  spaced(ctx, code, 512, 862, 50, th.fonts.mono, 400, 0.12, 'center', c.ink);
}

// ---------- LONG ODDS (prediction market) ----------
function mkCandles(ctx, th, r, x0, y0, w, h, n, trend) {
  const c = th.colors, cw = w / n; let v = 0.5
  for (let i = 0; i < n; i++) { const o = v; v = Math.max(0.08, Math.min(0.92, v + (r() - 0.5 + trend) * 0.18)); const cl = v, hi = Math.max(o, cl) + r() * 0.06, lo = Math.min(o, cl) - r() * 0.06, up = cl >= o, col = up ? c.glow : (c.alert || '#E8384F'), x = x0 + i * cw + cw / 2;
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y0 + h * (1 - hi)); ctx.lineTo(x, y0 + h * (1 - lo)); ctx.stroke();
    ctx.fillStyle = col; const yt = y0 + h * (1 - Math.max(o, cl)), yb = y0 + h * (1 - Math.min(o, cl)); ctx.fillRect(x - cw * 0.32, yt, cw * 0.64, Math.max(1.5, yb - yt)); }
  return v
}
function mkBook(ctx, th, r, x, y, w, rows, side) {
  const c = th.colors, mono = th.fonts.mono, col = side === 'bid' ? c.glow : (c.alert || '#E8384F')
  for (let i = 0; i < rows; i++) { const f = 0.2 + r() * 0.8, yy = y + i * 15; ctx.fillStyle = hexA(col, 0.14); if (side === 'bid') ctx.fillRect(x + w * (1 - f), yy, w * f, 12); else ctx.fillRect(x, yy, w * f, 12);
    const price = side === 'bid' ? 61 - i : 63 + i; spaced(ctx, `${price}¢`, side === 'bid' ? x + w - 4 : x + 4, yy + 9, 7.5, mono, 500, 0, side === 'bid' ? 'right' : 'left', col); spaced(ctx, String(Math.floor(200 + r() * 9800)), side === 'bid' ? x + 4 : x + w - 4, yy + 9, 7, mono, 400, 0, side === 'bid' ? 'left' : 'right', hexA(c.ink, 0.6)); }
}
function drawMarket(ctx, th, Hl, mode, phraseIdx, W, H, s) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th), r = rng(seedOf(th, 709 + (mode === 'home' ? 9 : 0) + phraseIdx * 3)), NO = c.alert || '#FF2D55', YES = c.glow, V = c.accent
  const dark = luminance(c.ground) < 0.4
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl)
  const rg = ctx.createRadialGradient(195, 180, 20, 195, 180, 420); rg.addColorStop(0, hexA(V, 0.28 * k.glow)); rg.addColorStop(1, hexA(V, 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, 390, Hl)
  const rg2 = ctx.createRadialGradient(80, Hl * 0.75, 10, 80, Hl * 0.75, 300); rg2.addColorStop(0, hexA(YES, 0.12 * k.glow)); rg2.addColorStop(1, hexA(YES, 0)); ctx.fillStyle = rg2; ctx.fillRect(0, 0, 390, Hl)
  ctx.fillStyle = hexA(c.ink, 0.035 * k.texture); for (let y = 0; y < Hl; y += 3) ctx.fillRect(0, y, 390, 1)
  for (let i = 0; i < 70; i++) { ctx.fillStyle = hexA([YES, V, NO, '#FFD84A'][i % 4], 0.35 + r() * 0.5); const x = r() * 390, y = r() * Hl, w = 2 + r() * 3; ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 3); ctx.fillRect(-w / 2, -1, w, 2); ctx.restore() }
  const glowText = (str, x, y, size, col, align, fam, wt) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 14 * k.glow; spaced(ctx, str, x, y, size, fam || disp, wt || dw, 0, align || 'center', col); ctx.restore() }
  const tick = ['TODAY HAPPENS TWICE 12¢ ▲4', 'VOID TAKES BETS 61¢ ▲9', 'MEANING > 40¢ 33¢ ▼6', 'BLUE DISCONTINUED 8¢ ▲2', 'YOU ARE A RUMOR 47¢ ▲11', 'TIME MOVES SIDEWAYS 19¢ ▲3', 'SEA FORGETS ITS NAME 5¢ ▼1', 'TOMORROW PRICED IN 71¢ ▲8']
  const ty = mode === 'lock' ? Hl - 66 : 676; ctx.fillStyle = hexA(V, 0.9); ctx.fillRect(0, ty, 390, 22); spaced(ctx, tick.join('   ★   '), 12, ty + 15, 8.5, mono, 600, 0.02, 'left', '#FFFFFF')
  const lev = ['1X', '5X', '25X', '100X']
  if (mode === 'lock') {
    const probs = [93, 81, 67, 99], prob = probs[phraseIdx % 4], pump = [34, 12, 58, 210][phraseIdx % 4]
    if (k.details) {
      ctx.fillStyle = NO; ctx.beginPath(); ctx.arc(30, 224, 4, 0, Math.PI * 2); ctx.fill(); spaced(ctx, T.tagR || 'LIVE', 40, 228, 8, mono, 700, 0.14, 'left', NO); spaced(ctx, T.tagL || '', 366, 228, 7.5, mono, 500, 0.12, 'right', hexA(c.ink, 0.6))
      const wg = ctx.createLinearGradient(0, 0, 390, 0); wg.addColorStop(0, hexA(V, 0.95)); wg.addColorStop(1, hexA(NO, 0.85)); ctx.fillStyle = wg; ctx.fillRect(0, 238, 390, 20); spaced(ctx, `WHALE ALERT  ·  @moby_${10 + phraseIdx} BET $${[250, 90, 420, 1200][phraseIdx % 4]}K ON YES  ·  ${[3, 7, 2, 1][phraseIdx % 4]}S AGO`, 195, 252, 8, mono, 700, 0.06, 'center', '#FFFFFF')
    }
    centerXform(ctx, th, 195, 400, () => {
      const cx0 = 18, cy0 = 270, cw = 354, ch = 262
      ctx.save(); ctx.shadowColor = V; ctx.shadowBlur = 26 * k.glow; ctx.fillStyle = c.panel; ctx.beginPath(); ctx.roundRect(cx0, cy0, cw, ch, 18); ctx.fill(); ctx.restore()
      ctx.strokeStyle = hexA(V, 0.9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(cx0, cy0, cw, ch, 18); ctx.stroke()
      spaced(ctx, `MARKET #${String(1000 + phraseIdx * 37)}`, cx0 + 16, cy0 + 22, 7.5, mono, 600, 0.08, 'left', hexA(c.ink, 0.55))
      ctx.fillStyle = hexA(NO, 0.18); ctx.beginPath(); ctx.roundRect(cx0 + 110, cy0 + 11, 70, 15, 7); ctx.fill(); spaced(ctx, 'HOT  ' + '▲'.repeat(3), cx0 + 145, cy0 + 22, 7, mono, 700, 0.06, 'center', NO)
      spaced(ctx, `RESOLVES IN ${String(1 + phraseIdx).padStart(2, '0')}:${String(12 + phraseIdx * 7).padStart(2, '0')}:09`, cx0 + cw - 16, cy0 + 22, 7.5, mono, 700, 0.06, 'right', '#FFD84A')
      const ph = th.phrases[phraseIdx % th.phrases.length], l1 = th.upper ? ph[0].toUpperCase() : ph[0], l2 = th.upper ? ph[1].toUpperCase() : ph[1]
      const fs = Math.min(32, 32 * 200 / Math.max(1, measureSpaced(ctx, l1.length > l2.length ? l1 : l2, 32, disp, dw, 0)))
      spaced(ctx, l1, cx0 + 16, cy0 + 58, fs, disp, dw, 0, 'left', c.ink); spaced(ctx, l2, cx0 + 16, cy0 + 58 + fs * 1.05, fs, disp, dw, 0, 'left', c.ink)
      glowText(`${prob}%`, cx0 + cw - 18, cy0 + 70, 40, YES, 'right'); spaced(ctx, `▲ +${pump}% · 1H`, cx0 + cw - 18, cy0 + 88, 8, mono, 700, 0.04, 'right', YES)
      const ly = cy0 + 116; lev.forEach((l, i) => { const x = cx0 + 16 + i * 52, on = i === 3; ctx.fillStyle = on ? hexA(V, 0.9) : hexA(c.ink, 0.08); ctx.beginPath(); ctx.roundRect(x, ly, 46, 20, 10); ctx.fill(); if (on) { ctx.save(); ctx.shadowColor = V; ctx.shadowBlur = 12; ctx.fill(); ctx.restore() } spaced(ctx, l, x + 23, ly + 14, 8.5, mono, 700, 0, 'center', on ? '#FFFFFF' : hexA(c.ink, 0.6)) })
      spaced(ctx, 'LEVERAGE', cx0 + 230, ly + 14, 7, mono, 600, 0.12, 'left', hexA(c.ink, 0.5))
      const by = cy0 + 146, bw = (cw - 44) / 2
      ctx.save(); ctx.shadowColor = YES; ctx.shadowBlur = 16 * k.glow; ctx.fillStyle = hexA(YES, 0.2); ctx.beginPath(); ctx.roundRect(cx0 + 16, by, bw, 40, 10); ctx.fill(); ctx.restore(); ctx.strokeStyle = YES; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(cx0 + 16, by, bw, 40, 10); ctx.stroke(); spaced(ctx, `YES ${prob}¢`, cx0 + 16 + bw / 2, by + 26, 16, disp, 800, 0, 'center', YES)
      ctx.fillStyle = hexA(NO, 0.15); ctx.beginPath(); ctx.roundRect(cx0 + 28 + bw, by, bw, 40, 10); ctx.fill(); ctx.strokeStyle = hexA(NO, 0.8); ctx.beginPath(); ctx.roundRect(cx0 + 28 + bw, by, bw, 40, 10); ctx.stroke(); spaced(ctx, `NO ${100 - prob}¢`, cx0 + 28 + bw * 1.5, by + 26, 16, disp, 800, 0, 'center', NO)
      spaced(ctx, 'PAYOUT IF YES', cx0 + 16, by + 62, 7.5, mono, 600, 0.1, 'left', hexA(c.ink, 0.55)); glowText(`$${(4200 * (phraseIdx + 1)).toLocaleString('en-US')}.00`, cx0 + 16, by + 86, 22, YES, 'left')
      let v = 0.2; const pts = []; for (let i = 0; i <= 40; i++) { v = Math.max(0.05, Math.min(0.98, v + (r() - 0.32) * 0.09)); pts.push([cx0 + 180 + i * 4.1, by + 92 - v * 40]) }
      ctx.save(); ctx.strokeStyle = YES; ctx.lineWidth = 2; ctx.shadowColor = YES; ctx.shadowBlur = 10 * k.glow; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore()
      ctx.fillStyle = hexA(YES, 0.12); ctx.beginPath(); ctx.moveTo(pts[0][0], by + 96); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(pts[pts.length - 1][0], by + 96); ctx.closePath(); ctx.fill()
    })
    if (k.details) {
      const bets = [['@degen_42', '$1,200', 'YES', '25X', YES], ['@paperhands', '$40', 'NO', '1X', NO], ['@moonboi', '$9,999', 'YES', '100X', YES], ['@rekt_again', '$300', 'NO', '50X', NO]]
      spaced(ctx, 'LIVE BETS · ' + ['TODAY, TWICE', 'THE VOID', 'THIS TUESDAY', 'TOMORROW'][phraseIdx % 4], 22, 556, 7.5, mono, 700, 0.12, 'left', V)
      bets.forEach(([u, amt, side, l, col], i) => { const y = 572 + i * 16; spaced(ctx, u, 22, y, 8, mono, 500, 0, 'left', hexA(c.ink, 0.75)); spaced(ctx, amt, 170, y, 8, mono, 700, 0, 'left', c.ink); spaced(ctx, side, 236, y, 8, mono, 800, 0, 'left', col); spaced(ctx, l, 280, y, 8, mono, 700, 0, 'left', V); spaced(ctx, `${1 + i * 3}s`, 368, y, 7.5, mono, 500, 0, 'right', hexA(c.ink, 0.45)) })
    }
    const NEWS = [['Tuesday delisted after failing to happen twice.', 'The void announces a loyalty program.'], ['Scientists confirm the void is accepting limit orders.', 'Your reflection files for independence.'], ['Study: 4 in 5 memories are from a slightly different timeline.', 'The past is still there, just closed to visitors.'], ['Tomorrow postponed for lack of interest.', 'Analysts unable to locate the present.']][phraseIdx % 4]
    NEWS.forEach((txt, i) => { const ny = 656 + i * 50; ctx.save(); ctx.fillStyle = hexA(c.panel, 0.88); ctx.shadowColor = hexA('#000000', 0.4); ctx.shadowBlur = 12; ctx.beginPath(); ctx.roundRect(14, ny, 362, 44, 14); ctx.fill(); ctx.restore(); ctx.strokeStyle = hexA(V, 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(14, ny, 362, 44, 14); ctx.stroke()
      ctx.fillStyle = V; ctx.beginPath(); ctx.roundRect(24, ny + 8, 28, 28, 7); ctx.fill(); spaced(ctx, 'LO', 38, ny + 26, 10, disp, 800, 0, 'center', '#FFFFFF')
      spaced(ctx, i ? 'LONG ODDS · MARKETS' : 'LONG ODDS · BREAKING', 60, ny + 18, 7.5, mono, 700, 0.08, 'left', i ? hexA(c.ink, 0.6) : NO); spaced(ctx, i ? `${3 + phraseIdx}m ago` : 'now', 366, ny + 18, 7.5, mono, 500, 0, 'right', hexA(c.ink, 0.5))
      const tw2 = measureSpaced(ctx, txt, 10, mono, 500, 0), fs2 = Math.min(10, 10 * 300 / Math.max(1, tw2)); if (fs2 >= 7.8) spaced(ctx, txt, 60, ny + 34, fs2, mono, 500, 0, 'left', c.ink); else wrapLines(ctx, txt, 300, 8.4, mono, 0, 2).forEach((ln, j) => spaced(ctx, ln, 60, ny + 31 + j * 10, 8.4, mono, 500, 0, 'left', c.ink)) })
  } else {
    // home: a full prediction-market terminal, Bloomberg-dense, behind the icons
    const G = '#FFD84A', ink = (al) => hexA(c.ink, al), PANEL = hexA(c.panel, dark ? 0.82 : 0.9)
    const panel = (x, y, w, h, title, right) => { ctx.fillStyle = PANEL; ctx.fillRect(x, y, w, h); ctx.strokeStyle = hexA(V, 0.45); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); ctx.fillStyle = hexA(V, 0.22); ctx.fillRect(x, y, w, 13); spaced(ctx, title, x + 5, y + 9.5, 6.5, mono, 700, 0.08, 'left', G); if (right) spaced(ctx, right, x + w - 5, y + 9.5, 6.5, mono, 600, 0.04, 'right', ink(0.7)) }
    const line = (pts, col, w) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.4; ctx.shadowColor = col; ctx.shadowBlur = 8 * k.glow; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore() }
    const series = (n, start, drift, vol) => { const out = []; let v = start; for (let i = 0; i < n; i++) { v = Math.max(0.03, Math.min(0.97, v + drift + (r() - 0.5) * vol)); out.push(v) } return out }
    // full-bleed terminal grid with faint numbers raining down the columns
    ctx.strokeStyle = ink(0.05); ctx.lineWidth = 1; for (let x = 0; x <= 390; x += 13) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hl); ctx.stroke() } for (let y = 0; y <= Hl; y += 13) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke() }
    for (let i = 0; i < 90; i++) spaced(ctx, (r() * 99).toFixed(r() > 0.5 ? 2 : 1), r() * 390, r() * Hl, 6, mono, 500, 0, 'left', hexA([YES, NO, V, G][i % 4], 0.12))
    centerXform(ctx, th, 195, 430, () => {
      const X = 10, Wd = 370
      // function-key strip
      const keys = ['MKT', 'BOOK', 'NEWS', 'VOID', 'PNL', 'GO']; keys.forEach((kk, i) => { const kx = X + i * (Wd / 6); ctx.fillStyle = i === 5 ? hexA(YES, 0.85) : hexA(G, 0.85); ctx.fillRect(kx + 1, 168, Wd / 6 - 3, 14); spaced(ctx, kk, kx + Wd / 12, 178, 7, mono, 800, 0.06, 'center', '#111111') })
      // market watch
      panel(X, 188, Wd, 92, 'MARKET WATCH // EXISTENTIAL', 'VOL $4.2M · 24H')
      const rows = [['TODAY HAPPENS TWICE', 12, 4], ['VOID TAKES BETS', 61, 9], ['MEANING > 40¢', 33, -6], ['SEA FORGETS ITS NAME', 5, -1], ['TOMORROW PRICED IN', 71, 8], ['BLUE DISCONTINUED', 8, -2]]
      rows.forEach(([q, p, ch], i) => { const y = 211 + i * 11.5, up = ch >= 0; spaced(ctx, q, X + 6, y, 7, mono, 500, 0, 'left', ink(0.85)); spaced(ctx, `${p}¢`, X + 220, y, 7, mono, 700, 0, 'right', c.ink); spaced(ctx, `${up ? '▲' : '▼'}${Math.abs(ch)}`, X + 258, y, 7, mono, 700, 0, 'right', up ? YES : NO); const sp = series(14, 0.5, up ? 0.025 : -0.025, 0.12); line(sp.map((v, j) => [X + 268 + j * 7, y - 2 - v * 7 + 3]), up ? YES : NO, 1) })
      // twin charts: one pumping, one liquidated (falling)
      const cy0 = 286, ch0 = 128, cw = (Wd - 6) / 2
      panel(X, cy0, cw, ch0, 'YES · PUMPING', '▲ +58%'); panel(X + cw + 6, cy0, cw, ch0, 'NO · FREEFALL', '▼ -91%')
      const plot = (x0, up) => { const n = 26, vs = series(n, up ? 0.18 : 0.86, up ? 0.03 : -0.032, 0.09), px = (j) => x0 + 8 + j * ((cw - 16) / (n - 1)), py = (v) => cy0 + ch0 - 10 - v * (ch0 - 32), col = up ? YES : NO
        for (let g = 0; g < 4; g++) { const gy = cy0 + 20 + g * (ch0 - 30) / 3; ctx.strokeStyle = ink(0.07); ctx.beginPath(); ctx.moveTo(x0 + 4, gy); ctx.lineTo(x0 + cw - 4, gy); ctx.stroke() }
        let o = vs[0]; vs.forEach((v, j) => { const hi = Math.max(o, v) + r() * 0.05, lo = Math.min(o, v) - r() * 0.05, cu = v >= o; ctx.strokeStyle = hexA(cu ? YES : NO, 0.5); ctx.beginPath(); ctx.moveTo(px(j), py(hi)); ctx.lineTo(px(j), py(lo)); ctx.stroke(); ctx.fillStyle = hexA(cu ? YES : NO, 0.45); ctx.fillRect(px(j) - 1.6, py(Math.max(o, v)), 3.2, Math.max(1.2, py(Math.min(o, v)) - py(Math.max(o, v)))); o = v })
        const pts = vs.map((v, j) => [px(j), py(v)]); ctx.fillStyle = hexA(col, 0.12); ctx.beginPath(); ctx.moveTo(pts[0][0], cy0 + ch0 - 6); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(pts[n - 1][0], cy0 + ch0 - 6); ctx.closePath(); ctx.fill(); line(pts, col, 1.8)
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(pts[n - 1][0], pts[n - 1][1], 2.6, 0, Math.PI * 2); ctx.fill(); return pts }
      plot(X, true); const red = plot(X + cw + 6, false)
      ctx.save(); ctx.translate(X + cw + 6 + cw * 0.56, cy0 + ch0 * 0.6); ctx.rotate(0.32); ctx.strokeStyle = NO; ctx.lineWidth = 2.2; ctx.strokeRect(-54, -13, 108, 26); ctx.shadowColor = NO; ctx.shadowBlur = 8 * k.glow; spaced(ctx, 'LIQUIDATED', 0, 5, 13, mono, 800, 0.1, 'center', NO); ctx.restore()
      // order book and heatmap
      const oy = 420, oh = 104, ow = 150
      panel(X, oy, ow, oh, 'ORDER BOOK', 'VOID')
      for (let i = 0; i < 6; i++) { const y = oy + 23 + i * 13, f1 = 0.25 + r() * 0.7, f2 = 0.25 + r() * 0.7; ctx.fillStyle = hexA(YES, 0.18); ctx.fillRect(X + ow / 2 - 2 - (ow / 2 - 8) * f1, y - 7, (ow / 2 - 8) * f1, 9); ctx.fillStyle = hexA(NO, 0.16); ctx.fillRect(X + ow / 2 + 2, y - 7, (ow / 2 - 8) * f2, 9); spaced(ctx, `${61 - i}¢`, X + ow / 2 - 6, y, 6.5, mono, 700, 0, 'right', YES); spaced(ctx, `${62 + i}¢`, X + ow / 2 + 6, y, 6.5, mono, 700, 0, 'left', NO) }
      panel(X + ow + 6, oy, Wd - ow - 6, oh, 'HEATMAP // ALL MARKETS', '24H')
      const hx = X + ow + 10, hw = Wd - ow - 14, cols = 5, rws = 4, tw = hw / cols, tth = (oh - 20) / rws, labels = ['VOID', 'TIME', 'MOON', 'BLUE', 'SEA', 'FOG', 'TUES', 'ECHO', 'DOOR', 'STAR', 'SUN', 'MAP', 'SKY', 'DREAM', 'WIND', 'CLOCK', 'RAIN', 'MIRROR', 'WORD', 'SELF']
      labels.forEach((lb, i) => { const ch2 = Math.round((r() - 0.45) * 80), up = ch2 >= 0, tx = hx + (i % cols) * tw, ty = oy + 16 + Math.floor(i / cols) * tth; ctx.fillStyle = hexA(up ? YES : NO, 0.12 + Math.min(0.55, Math.abs(ch2) / 90)); ctx.fillRect(tx + 1, ty + 1, tw - 2, tth - 2); spaced(ctx, lb, tx + tw / 2, ty + tth / 2 - 1, 6, mono, 700, 0, 'center', c.ink); spaced(ctx, `${up ? '+' : ''}${ch2}%`, tx + tw / 2, ty + tth / 2 + 7, 6, mono, 600, 0, 'center', ink(0.8)) })
      // news wire
      const ny = 530, nh = 136
      panel(X, ny, Wd, nh, 'NEWS WIRE // BREAKING', 'LIVE')
      const wire = ['Tuesday delisted after failing to happen twice.', 'The void announces a loyalty program.', 'Clocks reach consensus. Experts alarmed.', 'Your reflection files for independence.', 'Moon confirms it was a dream.', 'Silence now fully priced in.', 'A door you never opened is still waiting.', 'Analysts unable to locate the present.', 'Entropy beats estimates again.']
      wire.forEach((w2, i) => { const y = ny + 26 + i * 12.4; const tmin = 9 * 60 + 41 - i * 7; spaced(ctx, `${String(Math.floor(tmin / 60)).padStart(2, '0')}:${String(tmin % 60).padStart(2, '0')}`, X + 6, y, 6.5, mono, 600, 0, 'left', G); spaced(ctx, i === 0 ? 'BRK' : i % 3 === 1 ? 'MKT' : 'VOID', X + 40, y, 6.5, mono, 800, 0, 'left', i === 0 ? NO : V); let t3 = w2; while (measureSpaced(ctx, t3, 7, mono, 500, 0) > Wd - 84 && t3.length > 8) t3 = t3.slice(0, -2); spaced(ctx, t3 === w2 ? t3 : t3.trimEnd() + '.', X + 66, y, 7, mono, 500, 0, 'left', i === 0 ? c.ink : ink(0.78)) })
    })
    if (k.details) spaced(ctx, 'Bet small. Dream huge.', 195, 718, 9, mono, 600, 0.08, 'center', hexA(c.ink, 0.7))
  }
}
function drawContractIcon(ctx, th, glyph, num, code) {
  const c = th.colors, NO = c.alert || '#FF2D55'; ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 1024, 1024)
  const rg = ctx.createRadialGradient(512, 380, 40, 512, 380, 640); rg.addColorStop(0, hexA(c.accent, 0.35)); rg.addColorStop(1, hexA(c.accent, 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, 1024, 1024)
  ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 50; ctx.fillStyle = c.panel; ctx.beginPath(); ctx.roundRect(120, 120, 784, 784, 110); ctx.fill(); ctx.restore()
  ctx.strokeStyle = c.accent; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(120, 120, 784, 784, 110); ctx.stroke()
  ctx.save(); ctx.beginPath(); ctx.roundRect(120, 120, 784, 784, 110); ctx.clip(); ctx.save(); ctx.shadowColor = c.glow; ctx.shadowBlur = 30; ctx.fillStyle = c.glow; ctx.fillRect(120, 120, 500, 48); ctx.restore(); ctx.fillStyle = NO; ctx.fillRect(620, 120, 284, 48); ctx.restore()
  ctx.save(); ctx.translate(312, 300); ctx.scale(16.6, 16.6); ctx.shadowColor = c.glow; ctx.shadowBlur = 1.5; ctx.fillStyle = c.ink; ctx.fill(glyph, 'evenodd'); ctx.restore()
  spaced(ctx, num, 196, 246, 46, th.fonts.mono, 600, 0.06, 'left', hexA(c.ink, 0.5)); spaced(ctx, '100X', 828, 246, 44, th.fonts.mono, 800, 0, 'right', c.accent)
  spaced(ctx, code, 512, 862, 50, th.fonts.mono, 700, 0.1, 'center', c.glow)
}

function luminance(hex) { const h = hex.replace('#', ''); const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] }

// ================= NEW HOME SCREENS (distinct from each lock screen) =================

// THE LONG ROAD: once unlocked, the journey has begun. The road leaves from your feet toward the far fells.
function drawRoadHome(ctx, th, Hl, phraseIdx) {
  const c = th.colors, T = th.text, fam = th.fonts.display, sc = th.fonts.mono, k = K(th), r = rng(seedOf(th, 4401)), ink = c.ink, red = c.accent;
  const X = 34, Y = 176, W = 322, H = 520, top = Y + 70;
  centerXform(ctx, th, 195, Y + H / 2, () => {
    ctx.save(); ctx.beginPath(); ctx.moveTo(X, Y + H); ctx.lineTo(X, top); ctx.quadraticCurveTo(X, Y, 195, Y); ctx.quadraticCurveTo(X + W, Y, X + W, top); ctx.lineTo(X + W, Y + H); ctx.closePath(); ctx.clip();
    ctx.fillStyle = hexA(c.panel, 0.7); ctx.fillRect(X, Y, W, H);
    // sky hatching and a rising sun drawn in red ink
    ctx.strokeStyle = hexA(ink, 0.12); ctx.lineWidth = 0.7; for (let y = Y + 10; y < Y + 210; y += 7) { ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X + W, y + 2); ctx.stroke(); }
    const sx = 262, sy = Y + 178; ctx.fillStyle = hexA(c.panel, 1); ctx.beginPath(); ctx.arc(sx, sy, 34, Math.PI, 0); ctx.fill(); ctx.strokeStyle = red; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(sx, sy, 34, Math.PI, 0); ctx.stroke();
    for (let i = 0; i <= 12; i++) { const a = Math.PI + Math.PI * i / 12; seg(ctx, sx + 42 * Math.cos(a), sy + 42 * Math.sin(a), sx + (i % 2 ? 54 : 64) * Math.cos(a), sy + (i % 2 ? 54 : 64) * Math.sin(a), hexA(red, 0.85), 1.1); }
    // the far fells
    const fell1 = (x0, w, h, base, alpha) => { ctx.fillStyle = hexA(c.panel, 1); ctx.strokeStyle = hexA(ink, alpha); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x0, base); let x = x0; while (x < x0 + w) { const pw = 18 + r() * 30, ph = h * (0.5 + r() * 0.5); ctx.lineTo(x + pw / 2, base - ph); ctx.lineTo(x + pw, base); x += pw * 0.7; } ctx.lineTo(x0 + w, base + 30); ctx.lineTo(x0, base + 30); ctx.closePath(); ctx.fill(); ctx.stroke(); };
    fell1(X - 10, W + 20, 70, Y + 186, 0.55); for (let i = 0; i < 40; i++) { const x = X + r() * W, y = Y + 150 + r() * 36; seg(ctx, x, y, x - 5, y + 9, hexA(ink, 0.3), 0.6); }
    // rolling hills with hedgerows
    const hill = (base, amp, ph, alpha) => { ctx.fillStyle = hexA(c.panel, 1); ctx.beginPath(); ctx.moveTo(X, Y + H); for (let x = X; x <= X + W; x += 6) ctx.lineTo(x, base - Math.sin((x - X) / W * Math.PI * 1.6 + ph) * amp); ctx.lineTo(X + W, Y + H); ctx.closePath(); ctx.fill(); ctx.strokeStyle = hexA(ink, alpha); ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = X; x <= X + W; x += 6) { const y = base - Math.sin((x - X) / W * Math.PI * 1.6 + ph) * amp; x === X ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); };
    hill(Y + 232, 16, 0.4, 0.55);
    for (let i = 0; i < 14; i++) { const x = X + 14 + i * 22 + r() * 6, y = Y + 222 - Math.sin((x - X) / W * Math.PI * 1.6 + 0.4) * 16; ctx.fillStyle = hexA(ink, 0.75); ctx.beginPath(); ctx.arc(x, y, 4 + r() * 3, 0, Math.PI * 2); ctx.fill(); }
    hill(Y + 300, 22, 2.2, 0.6);
    for (let i = 0; i < 70; i++) { const x = X + r() * W, y = Y + 300 + r() * 60; seg(ctx, x, y, x + 6, y, hexA(ink, 0.22), 0.6); }
    // the road: wide at your feet, narrowing to the horizon in an S
    const road = (t) => { const y = Y + H + 10 - t * (H - 236); const cx = 195 + Math.sin(t * Math.PI * 1.7 + 0.4) * 70 * (1 - t * 0.55); const w = lerpN(130, 6, Math.pow(t, 0.7)); return [cx, y, w]; };
    ctx.fillStyle = hexA(c.ground, 1); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y, w] = road(i / 40); i ? ctx.lineTo(x - w / 2, y) : ctx.moveTo(x - w / 2, y); } for (let i = 40; i >= 0; i--) { const [x, y, w] = road(i / 40); ctx.lineTo(x + w / 2, y); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hexA(ink, 0.8); ctx.lineWidth = 1.3; [-1, 1].forEach(sd => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y, w] = road(i / 40); i ? ctx.lineTo(x + sd * w / 2, y) : ctx.moveTo(x + sd * w / 2, y); } ctx.stroke(); });
    // boot prints left behind the traveller: the wide sole points up the road (the way they walk), the small heel trails behind
    for (let i = 3; i < 24; i++) { const t = i / 40, [x, y, w] = road(t), [x2, y2] = road(t + 0.012), s = Math.min(1.1, Math.max(0.42, w / 70)), sd = i % 2 ? -1 : 1, a = Math.atan2(x2 - x, -(y2 - y)); ctx.save(); ctx.translate(x + sd * w * 0.08 * Math.cos(a), y + sd * w * 0.08 * Math.sin(a)); ctx.rotate(a + sd * 0.1); ctx.fillStyle = hexA(red, 0.8); ctx.beginPath(); ctx.ellipse(0, -2.4 * s, 1.9 * s, 2.7 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 2.6 * s, 1.35 * s, 1.5 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    for (let i = 0; i < 90; i++) { const t = r(), [x, y, w] = road(t); ctx.fillStyle = hexA(ink, 0.25); ctx.fillRect(x + (r() - 0.5) * w * 0.8, y, 1, 1); }
    // a traveller already on the way, small, mid-road
    const [tx, ty, tw] = road(0.64), s2 = 0.72;
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(tx, ty - 28 * s2, 4 * s2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx - 6 * s2, ty - 24 * s2); ctx.lineTo(tx + 6 * s2, ty - 24 * s2); ctx.lineTo(tx + 8 * s2, ty - 4 * s2); ctx.lineTo(tx - 8 * s2, ty - 4 * s2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = hexA(red, 0.9); ctx.fillRect(tx - 5 * s2, ty - 22 * s2, 10 * s2, 9 * s2);
    seg(ctx, tx - 3, ty - 4, tx - 5, ty + 2, ink, 1.6); seg(ctx, tx + 3, ty - 4, tx + 6, ty + 2, ink, 1.6); seg(ctx, tx + 10, ty - 30, tx + 13, ty + 2, ink, 1.2);
    ctx.fillStyle = hexA('#F2B33D', 0.9); ctx.beginPath(); ctx.arc(tx + 10, ty - 31, 2.6, 0, Math.PI * 2); ctx.fill();
    // birds heading for the fells
    [[110, Y + 96], [126, Y + 84], [140, Y + 100], [214, Y + 120]].forEach(([x, y]) => { ctx.strokeStyle = hexA(ink, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 5, y - 2); ctx.quadraticCurveTo(x - 2, y - 4, x, y); ctx.quadraticCurveTo(x + 2, y - 4, x + 5, y - 2); ctx.stroke(); });
    // the signpost at your feet
    const px = 112, py = Y + H - 24; ctx.fillStyle = hexA(ink, 0.9); ctx.fillRect(px - 3, py - 150, 6, 152);
    const arms = [['The Lantern Inn', '3 lg', 1, -136, 0.05], ['Greyhallow Fells', '12 lg', 1, -106, -0.04], ['Home', '0', -1, -78, 0.06]];
    arms.forEach(([nm, d, dir, oy, rot]) => { ctx.save(); ctx.translate(px, py + oy); ctx.rotate(rot); const w2 = 112; ctx.fillStyle = hexA(c.panel, 1); ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); if (dir > 0) { ctx.moveTo(0, -9); ctx.lineTo(w2, -9); ctx.lineTo(w2 + 10, 0); ctx.lineTo(w2, 9); ctx.lineTo(0, 9); } else { ctx.moveTo(0, -9); ctx.lineTo(-w2 * 0.55, -9); ctx.lineTo(-w2 * 0.55 - 10, 0); ctx.lineTo(-w2 * 0.55, 9); ctx.lineTo(0, 9); } ctx.closePath(); ctx.fill(); ctx.stroke(); fell(ctx, nm, dir > 0 ? 6 : -w2 * 0.55 + 4, 4, 10, fam, ink, 'left', true); if (dir > 0) fell(ctx, d, w2 - 2, 4, 8.5, sc, red, 'right'); ctx.restore(); });
    ctx.fillStyle = hexA(ink, 0.75); for (let i = 0; i < 9; i++) { const gx = px - 20 + i * 5, gh = 6 + r() * 8; ctx.beginPath(); ctx.moveTo(gx, py + 2); ctx.lineTo(gx + 1.5, py + 2 - gh); ctx.lineTo(gx + 3, py + 2); ctx.fill(); }
    // a milestone on the right verge
    const mx = 312, my = Y + H - 70; ctx.fillStyle = hexA(c.panel, 1); ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mx - 14, my + 30); ctx.lineTo(mx - 14, my); ctx.quadraticCurveTo(mx - 14, my - 16, mx, my - 16); ctx.quadraticCurveTo(mx + 14, my - 16, mx + 14, my); ctx.lineTo(mx + 14, my + 30); ctx.closePath(); ctx.fill(); ctx.stroke(); fell(ctx, 'I', mx, my + 6, 16, fam, red, 'center');
    ctx.restore();
    // the arched frame with a double rule
    ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X, Y + H); ctx.lineTo(X, top); ctx.quadraticCurveTo(X, Y, 195, Y); ctx.quadraticCurveTo(X + W, Y, X + W, top); ctx.lineTo(X + W, Y + H); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(X - 6, Y + H + 6); ctx.lineTo(X - 6, top); ctx.quadraticCurveTo(X - 6, Y - 6, 195, Y - 6); ctx.quadraticCurveTo(X + W + 6, Y - 6, X + W + 6, top); ctx.lineTo(X + W + 6, Y + H + 6); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = red; [[X - 6, Y + H + 6], [X + W + 6, Y + H + 6]].forEach(([x, y]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-3, -3, 6, 6); ctx.restore(); });
    // a ribbon banner across the foot of the frame
    const by = Y + H - 6; ctx.fillStyle = hexA(c.panel, 1); ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(110, by - 14); ctx.lineTo(280, by - 14); ctx.lineTo(296, by - 4); ctx.lineTo(280, by + 6); ctx.lineTo(110, by + 6); ctx.lineTo(94, by - 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    fell(ctx, th.upper ? 'DAY I · THE ROAD BEGINS' : 'Day I · The Road Begins', 195, by + 1, 11, fam, red, 'center', true);
  });
  if (k.details) { fell(ctx, 'fair weather, west wind', 40, 166, 9.5, fam, hexA(ink, 0.65), 'left', true); fell(ctx, 'rain by dusk?', 350, 166, 9.5, fam, hexA(ink, 0.65), 'right', true); }
  fell(ctx, T.caption, 195, 728, 13, fam, hexA(ink, 0.85), 'center', true);
}
function lerpN(a, b, t) { return a + (b - a) * t; }

// PLANAR GRIMOIRE: the great sigil inside a full esoteric wheel
function drawGrimoireHome(ctx, th, Hl) {
  const c = th.colors, T = th.text, fam = th.fonts.display, sc = th.fonts.mono, k = K(th), gold = c.accent, vio = c.glow, ink = c.ink, gems = T.gems || ['#E9E1C8', '#3A7BD5', '#5B4A8A', '#D23A4A', '#2FAE7A'], r = rng(seedOf(th, 5511));
  const CX = 195, CY = 440;
  if (k.details) fell(ctx, T.homeTop, 195, 196, 10, sc, gold, 'center', false, 0.16);
  // moon phases across the top
  for (let i = 0; i < 9; i++) { const x = 75 + i * 30, y = 218, p = i / 8, R0 = 7, lit = Math.cos(p * Math.PI * 2); ctx.fillStyle = hexA(c.ground, 1); ctx.beginPath(); ctx.arc(x, y, R0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hexA(gold, 0.9); if (p > 0 && p < 1) { const right = p < 0.5; ctx.beginPath(); ctx.arc(x, y, R0, -Math.PI / 2, Math.PI / 2, !right); const ex = Math.abs(lit) * R0; ctx.ellipse(x, y, ex, R0, 0, Math.PI / 2, -Math.PI / 2, (lit > 0) === right); ctx.closePath(); ctx.fill(); } ctx.strokeStyle = hexA(gold, 0.8); ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(x, y, R0, 0, Math.PI * 2); ctx.stroke(); }
  centerXform(ctx, th, CX, CY, () => {
    // planetary orbits behind everything
    [[230, 70, -0.35], [210, 120, 0.5], [250, 40, 0.15]].forEach(([rx, ry, rot], i) => { ctx.save(); ctx.translate(CX, CY); ctx.rotate(rot); ctx.strokeStyle = hexA(vio, 0.35); ctx.lineWidth = 0.8; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); const a = 0.8 + i * 2.1; ctx.fillStyle = [gold, vio, ink][i]; ctx.beginPath(); ctx.arc(rx * Math.cos(a), ry * Math.sin(a), 3.5 - i * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    // the zodiac-style wheel: twelve houses with original glyphs
    const R1 = 166, R2 = 186, R3 = 204;
    [R1, R2, R3].forEach((rr, i) => { ctx.strokeStyle = hexA(gold, i === 1 ? 0.5 : 0.8); ctx.lineWidth = i === 1 ? 0.7 : 1.1; ctx.beginPath(); ctx.arc(CX, CY, rr, 0, Math.PI * 2); ctx.stroke(); });
    for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; seg(ctx, CX + R1 * Math.cos(a), CY + R1 * Math.sin(a), CX + R3 * Math.cos(a), CY + R3 * Math.sin(a), hexA(gold, 0.7), 0.8); const m = a + Math.PI / 12, gx = CX + (R2 + 9) * Math.cos(m), gy = CY + (R2 + 9) * Math.sin(m); glyphG(ctx, i, gx, gy, 6.5, gold); }
    for (let i = 0; i < 72; i++) { const a = i * Math.PI / 36; seg(ctx, CX + R1 * Math.cos(a), CY + R1 * Math.sin(a), CX + (R1 + (i % 6 ? 4 : 8)) * Math.cos(a), CY + (R1 + (i % 6 ? 4 : 8)) * Math.sin(a), hexA(gold, 0.6), 0.6); }
    // an inscription that runs around the inner ring
    const words = 'LUX · UMBRA · VERBUM · NUMERUS · STELLA · SILENTIUM · CLAVIS · MEMORIA · ', Rt = R1 - 12; ctx.save(); ctx.font = `500 7.5px "${sc}", Georgia, serif`; ctx.fillStyle = hexA(gold, 0.75); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const total = Math.PI * 2 * Rt, cw = total / words.length; [...words].forEach((ch, i) => { const a = -Math.PI / 2 + (i * cw) / Rt; ctx.save(); ctx.translate(CX + Rt * Math.cos(a), CY + Rt * Math.sin(a)); ctx.rotate(a + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore(); }); ctx.restore();
    // roman numerals at the cardinal points
    [['I', -Math.PI / 2], ['IV', 0], ['VII', Math.PI / 2], ['X', Math.PI]].forEach(([n, a]) => fell(ctx, n, CX + (R3 + 14) * Math.cos(a), CY + (R3 + 14) * Math.sin(a) + 4, 10, fam, gold, 'center'));
    // the great sigil and its gems
    sigil(ctx, th, CX, CY, 122);
    gems.forEach((col, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; gem(ctx, th, CX + 145 * Math.cos(a), CY + 145 * Math.sin(a), 6, col); });
  });
  // the four elements in the corners, as alchemists drew them
  [['IGNIS', 46, 270, 0], ['AQUA', 344, 270, 1], ['AER', 46, 630, 2], ['TERRA', 344, 630, 3]].forEach(([nm, x, y, e]) => { ctx.strokeStyle = gold; ctx.lineWidth = 1.2; ctx.beginPath(); if (e % 2 === 0) { ctx.moveTo(x, y - 11); ctx.lineTo(x + 11, y + 8); ctx.lineTo(x - 11, y + 8); } else { ctx.moveTo(x, y + 11); ctx.lineTo(x + 11, y - 8); ctx.lineTo(x - 11, y - 8); } ctx.closePath(); ctx.stroke(); if (e >= 2) seg(ctx, x - 9, e === 2 ? y + 1 : y - 1, x + 9, e === 2 ? y + 1 : y - 1, gold, 1.2); if (k.details) fell(ctx, nm, x, y + 26, 8, sc, hexA(gold, 0.8), 'center', false, 0.16); });
  // a constellation with a made-up name, and a little flower of life
  const cst = [[300, 690], [326, 676], [352, 690], [342, 712], [318, 716]]; ctx.strokeStyle = hexA(ink, 0.45); ctx.lineWidth = 0.7; ctx.beginPath(); cst.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); cst.forEach(([x, y]) => { ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); });
  if (k.details) fell(ctx, 'Vela Minor', 326, 732, 8.5, fam, hexA(ink, 0.6), 'center', true);
  ctx.strokeStyle = hexA(vio, 0.7); ctx.lineWidth = 0.8; [[0, 0], [8, 0], [-8, 0], [4, 7], [-4, 7], [4, -7], [-4, -7]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(64 + dx, 700 + dy, 8, 0, Math.PI * 2); ctx.stroke(); });
  if (k.details) { (T.sideL || []).forEach((l, i) => fell(ctx, l, 26, 672 + i * 13, 9, sc, ink, 'left', false, 0.12)); }
  fell(ctx, T.caption, 195, 690, 14, fam, hexA(ink, 0.85), 'center', true);
}
function glyphG(ctx, i, x, y, s, col) {
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1; ctx.beginPath();
  switch (i % 12) {
    case 0: ctx.arc(x, y, s * 0.6, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); break;
    case 1: ctx.arc(x, y, s * 0.6, 0.6, Math.PI * 2 - 0.6); ctx.stroke(); break;
    case 2: ctx.moveTo(x, y - s * 0.7); ctx.lineTo(x + s * 0.6, y + s * 0.5); ctx.lineTo(x - s * 0.6, y + s * 0.5); ctx.closePath(); ctx.stroke(); break;
    case 3: ctx.moveTo(x - s * 0.6, y); ctx.lineTo(x + s * 0.6, y); ctx.moveTo(x, y - s * 0.6); ctx.lineTo(x, y + s * 0.6); ctx.stroke(); break;
    case 4: for (let a = 0; a < 5.5; a += 0.3) { const rr = a * s * 0.12; a ? ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)) : ctx.moveTo(x, y); } ctx.stroke(); break;
    case 5: ctx.moveTo(x - s * 0.6, y - s * 0.4); ctx.lineTo(x, y + s * 0.6); ctx.lineTo(x + s * 0.6, y - s * 0.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.6); ctx.lineTo(x + s * 0.5, y - s * 0.6); ctx.stroke(); break;
    case 6: ctx.arc(x - s * 0.25, y, s * 0.4, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + s * 0.25, y, s * 0.4, 0, Math.PI * 2); ctx.stroke(); break;
    case 7: ctx.moveTo(x, y - s * 0.7); ctx.lineTo(x, y + s * 0.7); ctx.moveTo(x - s * 0.5, y - s * 0.2); ctx.lineTo(x, y - s * 0.7); ctx.lineTo(x + s * 0.5, y - s * 0.2); ctx.stroke(); break;
    case 8: ctx.rect(x - s * 0.5, y - s * 0.5, s, s); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.5); ctx.lineTo(x + s * 0.5, y + s * 0.5); ctx.stroke(); break;
    case 9: ctx.arc(x, y + s * 0.2, s * 0.45, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y + s * 0.2); ctx.lineTo(x, y + s * 0.8); ctx.stroke(); break;
    case 10: for (let j = 0; j < 3; j++) { ctx.moveTo(x - s * 0.6, y - s * 0.4 + j * s * 0.4); ctx.lineTo(x + s * 0.6, y - s * 0.4 + j * s * 0.4); } ctx.stroke(); break;
    default: ctx.moveTo(x, y - s * 0.7); ctx.lineTo(x + s * 0.6, y); ctx.lineTo(x, y + s * 0.7); ctx.lineTo(x - s * 0.6, y); ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}

// WHITE RABBIT: an extremely chic, very futuristic guild of thieves. A contract board, not a rabbit hole.
function drawRabbitHome(ctx, th, Hl) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th), ink = c.ink, mag = c.accent, lil = c.glow, r = rng(seedOf(th, 6611));
  ctx.fillStyle = c.panel; ctx.fillRect(0, 0, 390, Hl);
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, hexA(c.ground, 0.4)); g.addColorStop(1, hexA(lil, 0.45)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = hexA(ink, 0.06 * k.texture + 0.02); ctx.lineWidth = 0.6; for (let x = 0; x <= 390; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hl); ctx.stroke(); } for (let y = 0; y <= Hl; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke(); }
  // an oversized cell number, cropped
  ctx.save(); ctx.font = `700 330px "${disp}", Georgia, serif`; ctx.textAlign = 'right'; ctx.lineWidth = 1.4; ctx.strokeStyle = hexA(ink, 0.13); ctx.strokeText('07', 420, 520); ctx.restore();
  // security lasers, strict and magenta
  [[[0, 268], [390, 196]], [[0, 610], [390, 700]], [[70, 160], [330, 740]]].forEach(([a, b], i) => { ctx.save(); ctx.shadowColor = mag; ctx.shadowBlur = 8 * k.glow; ctx.strokeStyle = hexA(mag, i === 2 ? 0.35 : 0.75); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); [a, b].forEach(([x, y]) => { ctx.fillStyle = mag; ctx.beginPath(); ctx.arc(Math.min(386, Math.max(4, x)), y, 3, 0, Math.PI * 2); ctx.fill(); }); });
  // a vertical identity strip down the left edge with a barcode
  ctx.fillStyle = ink; ctx.fillRect(14, 176, 22, 380);
  ctx.save(); ctx.translate(29, 548); ctx.rotate(-Math.PI / 2); spaced(ctx, 'WHITE RABBIT // LEGION OF THIEVES // CELL 07', 0, 0, 8, mono, 500, 0.22, 'left', c.panel); ctx.restore();
  for (let i = 0; i < 26; i++) { const w = 1 + Math.floor(r() * 3); ctx.fillStyle = ink; ctx.fillRect(14 + (i % 2) * 0 , 564 + i * 4.4, 22 * (0.4 + r() * 0.6), w); }
  centerXform(ctx, th, 205, 380, () => {
    const CX = 205, CY = 372, R = 112;
    // the guild sigil: a ring of ticks, a crossed blade, and an abstract rabbit built from hard angles
    ctx.strokeStyle = ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 0.7; ctx.beginPath(); ctx.arc(CX, CY, R - 10, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, l = i % 5 ? 4 : 9; seg(ctx, CX + R * Math.cos(a), CY + R * Math.sin(a), CX + (R + l) * Math.cos(a), CY + (R + l) * Math.sin(a), hexA(ink, i % 5 ? 0.45 : 0.9), i % 5 ? 0.7 : 1.4); }
    ctx.save(); ctx.translate(CX, CY); ctx.rotate(-0.7); ctx.fillStyle = hexA(ink, 0.9); ctx.beginPath(); ctx.moveTo(-R - 26, -2.2); ctx.lineTo(R - 6, -2.2); ctx.lineTo(R + 26, 0); ctx.lineTo(R - 6, 2.2); ctx.lineTo(-R - 26, 2.2); ctx.closePath(); ctx.fill(); ctx.fillStyle = mag; ctx.fillRect(-R - 34, -6, 16, 12); ctx.restore();
    const ear = (dx, ang) => { ctx.save(); ctx.translate(CX + dx, CY - 30); ctx.rotate(ang); ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-11, -30); ctx.lineTo(0, -86); ctx.lineTo(11, -30); ctx.closePath(); ctx.fill(); ctx.fillStyle = mag; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-4, -32); ctx.lineTo(0, -66); ctx.lineTo(4, -32); ctx.closePath(); ctx.fill(); ctx.restore(); };
    ear(-20, -0.16); ear(20, 0.16);
    ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(CX - 46, CY - 36); ctx.lineTo(CX + 46, CY - 36); ctx.lineTo(CX + 40, CY + 8); ctx.lineTo(CX, CY + 52); ctx.lineTo(CX - 40, CY + 8); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.shadowColor = mag; ctx.shadowBlur = 10 * k.glow; ctx.fillStyle = mag; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(CX + sd * 6, CY - 12); ctx.lineTo(CX + sd * 34, CY - 20); ctx.lineTo(CX + sd * 28, CY - 8); ctx.closePath(); ctx.fill(); }); ctx.restore();
    ctx.strokeStyle = hexA(c.panel, 0.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(CX, CY - 34); ctx.lineTo(CX, CY + 48); ctx.stroke(); ctx.beginPath(); ctx.moveTo(CX - 18, CY + 22); ctx.lineTo(CX, CY + 30); ctx.lineTo(CX + 18, CY + 22); ctx.stroke();
    // technical callouts
    const call = (x1, y1, x2, y2, txt2, right) => { seg(ctx, x1, y1, x2, y2, hexA(ink, 0.7), 0.8); seg(ctx, x2, y2, x2 + (right ? 60 : -60), y2, hexA(ink, 0.7), 0.8); ctx.fillStyle = mag; ctx.fillRect(x1 - 2, y1 - 2, 4, 4); if (k.details) spaced(ctx, txt2, x2 + (right ? 2 : -2), y2 - 5, 6.5, mono, 500, 0.14, right ? 'left' : 'right', ink); };
    call(CX + 24, CY - 108, CX + 44, CY - 128, 'SIGIL // UNREGISTERED', true); call(CX - 98, CY + 72, CX - 58, CY + 138, 'EDGE // MONOFILAMENT', true); call(CX + 36, CY - 16, CX + 104, CY + 50, 'TRACE // NONE', true);
  });
  // the open contract, as a sleek black card
  const bx = 52, by = 548, bw = 318, bh = 150;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18; ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw - 22, by); ctx.lineTo(bx + bw, by + 22); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx, by + bh); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = mag; ctx.fillRect(bx, by, 6, bh);
  spaced(ctx, 'CONTRACT 07', bx + 20, by + 26, 9, mono, 500, 0.22, 'left', hexA(c.panel, 0.7)); spaced(ctx, 'OPEN', bx + bw - 30, by + 26, 9, mono, 700, 0.22, 'right', mag);
  spaced(ctx, th.upper ? 'THE JEWELED EGG' : 'The Jeweled Egg', bx + 20, by + 62, 26, disp, dw, 0, 'left', c.panel);
  if (k.details) { [['VENUE', 'AUREL GALA · HALL 3'], ['METHOD', 'SILENT'], ['WINDOW', '00:40 – 00:52']].forEach(([a, b], i) => { spaced(ctx, a, bx + 20, by + 88 + i * 15, 7, mono, 500, 0.16, 'left', hexA(c.panel, 0.55)); spaced(ctx, b, bx + 92, by + 88 + i * 15, 7.5, mono, 500, 0.08, 'left', c.panel); }); }
  for (let i = 0; i < 30; i++) { const w = 1 + Math.floor(r() * 3); ctx.fillStyle = hexA(c.panel, 0.85); ctx.fillRect(bx + bw - 96 + i * 3, by + bh - 34, w, 22); }
  ctx.save(); ctx.translate(bx + bw - 64, by + bh - 70); ctx.rotate(-0.12); ctx.strokeStyle = mag; ctx.lineWidth = 1.6; ctx.strokeRect(-38, -12, 76, 24); spaced(ctx, 'NO TRACE', 0, 5, 9, mono, 700, 0.2, 'center', mag); ctx.restore();
  if (k.details) spaced(ctx, T.homeTop || '', 56, 196, 7.5, mono, 500, 0.24, 'left', hexA(ink, 0.7));
  spaced(ctx, T.caption || '', 211, 726, 11, disp, 400, 0, 'center', hexA(ink, 0.8));
}

// NEON DISTRICT: Night City signage. Stacked neon, a holo billboard, a spinner in the rain
function drawNeonHome(ctx, th, Hl) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th), pink = c.accent, cyan = c.glow, yel = c.alert || '#FCEE0A', r = rng(seedOf(th, 7711));
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, c.ground); g.addColorStop(0.55, hexA(c.panel, 1)); g.addColorStop(1, hexA(pink, 0.18)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  // far megatowers in haze
  for (let i = 0; i < 9; i++) { const x = -20 + i * 50 + r() * 20, w = 40 + r() * 40, top = 150 + r() * 180; ctx.fillStyle = hexA(cyan, 0.05 + r() * 0.05); ctx.fillRect(x, top, w, Hl); for (let j = 0; j < 30; j++) { ctx.fillStyle = hexA(r() > 0.7 ? pink : cyan, 0.25 + r() * 0.35); ctx.fillRect(x + 4 + r() * (w - 8), top + 10 + r() * 500, 2, 1.5); } }
  const fog = (y, h, a) => { const fg = ctx.createLinearGradient(0, y, 0, y + h); fg.addColorStop(0, hexA(cyan, 0)); fg.addColorStop(0.5, hexA(cyan, a)); fg.addColorStop(1, hexA(cyan, 0)); ctx.fillStyle = fg; ctx.fillRect(0, y, 390, h); };
  fog(300, 120, 0.08); fog(520, 140, 0.1);
  // near buildings framing a street canyon
  ctx.fillStyle = hexA(c.ground, 0.92); ctx.fillRect(0, 230, 92, Hl); ctx.fillRect(298, 200, 92, Hl); ctx.fillRect(110, 360, 60, Hl); ctx.fillRect(225, 330, 60, Hl);
  // the holo billboard on the left tower
  const neon = (draw, col, blur) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = (blur || 14) * k.glow; draw(); ctx.restore(); };
  xfBegin(ctx, th, 195, 420);
  neon(() => { ctx.strokeStyle = cyan; ctx.lineWidth = 2; ctx.strokeRect(14, 250, 120, 168); }, cyan);
  ctx.fillStyle = hexA(cyan, 0.12); ctx.fillRect(14, 250, 120, 168);
  ctx.save(); ctx.beginPath(); ctx.rect(14, 250, 120, 168); ctx.clip(); ctx.strokeStyle = hexA(cyan, 0.85); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(74, 318, 34, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(74, 318, 26, 11, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = pink; ctx.beginPath(); ctx.arc(74, 318, 6, 0, Math.PI * 2); ctx.fill(); for (let y = 252; y < 418; y += 4) { ctx.fillStyle = hexA(c.ground, 0.25); ctx.fillRect(14, y, 120, 1.2); } ctx.restore();
  neon(() => { spaced(ctx, 'SEE MORE.', 74, 380, 13, disp, dw, 0.06, 'center', cyan); spaced(ctx, 'OPTIC GRAFTS · 0% DOWN', 74, 400, 6, mono, 400, 0.08, 'center', hexA(cyan, 0.85)); }, cyan, 8);
  // vertical signs: HOTEL in cyan, katakana in pink, BAR in yellow
  const vsign = (x, y, w, word, col, size) => { const h = word.length * size * 1.15 + 14; ctx.fillStyle = hexA(c.ground, 0.85); ctx.fillRect(x, y, w, h); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); }, col); neon(() => [...word].forEach((ch, i) => spaced(ctx, ch, x + w / 2, y + 8 + size * 0.95 + i * size * 1.15, size, disp, dw, 0, 'center', col)), col); seg(ctx, x + w / 2, y - 10, x + w / 2, y, hexA(c.ink, 0.4), 1); };
  vsign(318, 214, 36, 'HOTEL', cyan, 20); { const fx = 150, fy = 186, fw = 30, fh = 4 * 18 * 1.25 + 14; ctx.fillStyle = hexA(c.ground, 0.85); ctx.fillRect(fx, fy, fw, fh); neon(() => { ctx.strokeStyle = pink; ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, fh); fauxText(ctx, fx + 6, fy + 8, 4, 18, 61, pink, true); }, pink); seg(ctx, fx + fw / 2, fy - 10, fx + fw / 2, fy, hexA(c.ink, 0.4), 1); } vsign(270, 380, 26, 'BAR', yel, 16);
  // a circular 24H sign and an arrow sign
  neon(() => { ctx.strokeStyle = pink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(214, 268, 28, 0, Math.PI * 2); ctx.stroke(); }, pink); neon(() => spaced(ctx, '24H', 214, 276, 18, disp, dw, 0, 'center', pink), pink);
  ctx.fillStyle = hexA(c.ground, 0.85); ctx.beginPath(); ctx.moveTo(196, 448); ctx.lineTo(352, 448); ctx.lineTo(370, 466); ctx.lineTo(352, 484); ctx.lineTo(196, 484); ctx.closePath(); ctx.fill();
  neon(() => { ctx.strokeStyle = yel; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(196, 448); ctx.lineTo(352, 448); ctx.lineTo(370, 466); ctx.lineTo(352, 484); ctx.lineTo(196, 484); ctx.closePath(); ctx.stroke(); spaced(ctx, 'CYBERWARE CLINIC', 276, 471, 11, disp, dw, 0.04, 'center', yel); }, yel, 10);
  // the noodle bar sign with a bowl, and smaller shop signs
  ctx.fillStyle = hexA(c.ground, 0.88); ctx.fillRect(20, 448, 150, 58); neon(() => { ctx.strokeStyle = pink; ctx.lineWidth = 2; ctx.strokeRect(20, 448, 150, 58); spaced(ctx, 'NOODLES', 108, 475, 16, disp, dw, 0.04, 'center', pink); spaced(ctx, 'OPEN ALL NIGHT', 108, 495, 7, mono, 400, 0.06, 'center', hexA(pink, 0.9)); }, pink);
  neon(() => { ctx.strokeStyle = cyan; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(44, 468, 10, 0, Math.PI); ctx.stroke(); seg(ctx, 32, 468, 56, 468, cyan, 1.6); seg(ctx, 40, 452, 48, 462, cyan, 1); seg(ctx, 46, 452, 52, 462, cyan, 1); }, cyan, 8);
  [['PAWN', 40, 580, cyan], ['SYNTH', 140, 584, pink], ['CHROME', 250, 578, yel], ['LOANS', 340, 584, pink]].forEach(([w2, x, y, col]) => { ctx.font = `700 12px "${disp}", Georgia, sans-serif`; const tw = ctx.measureText(w2).width + 18; ctx.fillStyle = hexA(c.ground, 0.8); ctx.fillRect(x - tw / 2, y - 14, tw, 22); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.strokeRect(x - tw / 2, y - 14, tw, 22); spaced(ctx, w2, x, y + 2, 12, disp, dw, 0.04, 'center', col); }, col, 8); });
  ctx.fillStyle = hexA(c.ground, 0.85); ctx.fillRect(22, 518, 262, 30); neon(() => { ctx.strokeStyle = cyan; ctx.lineWidth = 1.6; ctx.strokeRect(22, 518, 262, 30); fauxText(ctx, 32, 525, 4, 14, 73, cyan, false); spaced(ctx, 'NIGHT MARKET', 196, 538, 12, disp, dw, 0.04, 'center', cyan); }, cyan, 10);
  [['KARAOKE', 60, 212, yel, 10], ['ROOMS', 262, 226, cyan, 9], ['DATA', 196, 420, pink, 10]].forEach(([w2, x, y, col, sz]) => { ctx.font = `700 ${sz}px "${disp}", Georgia, sans-serif`; const tw = ctx.measureText(w2).width + 14; ctx.fillStyle = hexA(c.ground, 0.8); ctx.fillRect(x - tw / 2, y - sz - 2, tw, sz + 8); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(x - tw / 2, y - sz - 2, tw, sz + 8); spaced(ctx, w2, x, y + 1, sz, disp, dw, 0.06, 'center', col); }, col, 7); });
  neon(() => { ctx.strokeStyle = cyan; ctx.lineWidth = 2; ctx.strokeRect(352, 398, 26, 26); ctx.fillStyle = cyan; ctx.fillRect(362, 403, 6, 16); ctx.fillRect(357, 408, 16, 6); }, cyan, 8);
  // overhead cables and a spinner with a light trail
  ctx.strokeStyle = hexA(c.ink, 0.25); ctx.lineWidth = 0.8; [[0, 230, 390, 260], [0, 300, 390, 280], [90, 420, 300, 410]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2, Math.max(b, d) + 26, c2, d); ctx.stroke(); });
  const trail = ctx.createLinearGradient(20, 352, 230, 330); trail.addColorStop(0, hexA(pink, 0)); trail.addColorStop(1, hexA(pink, 0.8)); ctx.strokeStyle = trail; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 356); ctx.lineTo(232, 334); ctx.stroke();
  ctx.fillStyle = hexA(c.ink, 0.85); ctx.beginPath(); ctx.moveTo(228, 330); ctx.lineTo(262, 326); ctx.lineTo(276, 334); ctx.lineTo(262, 341); ctx.lineTo(228, 341); ctx.closePath(); ctx.fill(); neon(() => { ctx.fillStyle = yel; ctx.beginPath(); ctx.arc(274, 334, 2.5, 0, Math.PI * 2); ctx.fill(); }, yel, 10);
  const beam = ctx.createLinearGradient(276, 334, 360, 360); beam.addColorStop(0, hexA(yel, 0.35)); beam.addColorStop(1, hexA(yel, 0)); ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(276, 332); ctx.lineTo(380, 340); ctx.lineTo(380, 372); ctx.closePath(); ctx.fill();
  ctx.restore();
  // the wet street: awnings, steam, and reflections
  ctx.fillStyle = hexA(c.ground, 0.95); ctx.fillRect(0, 600, 390, Hl - 600);
  [[20, cyan], [140, pink], [262, yel]].forEach(([x, col]) => { ctx.fillStyle = hexA(col, 0.22); ctx.beginPath(); ctx.moveTo(x, 600); ctx.lineTo(x + 108, 600); ctx.lineTo(x + 100, 616); ctx.lineTo(x + 8, 616); ctx.closePath(); ctx.fill(); neon(() => seg(ctx, x, 600, x + 108, 600, col, 1.6), col, 8); });
  ctx.save(); ctx.globalAlpha = 0.35; [[108, 640, pink, 150], [276, 650, yel, 170], [44, 660, cyan, 90], [214, 676, pink, 60]].forEach(([x, y, col, w]) => { const rg = ctx.createLinearGradient(0, y, 0, y + 50); rg.addColorStop(0, hexA(col, 0.7)); rg.addColorStop(1, hexA(col, 0)); ctx.fillStyle = rg; for (let i = 0; i < 6; i++) ctx.fillRect(x - w / 2 + (r() - 0.5) * 6, y + i * 7, w * (1 - i * 0.12), 2.5); }); ctx.restore();
  for (let i = 0; i < 4; i++) { const sx = 60 + i * 90; ctx.fillStyle = hexA(c.ink, 0.06); ctx.beginPath(); ctx.ellipse(sx, 640 - i * 6, 26, 60, 0, 0, Math.PI * 2); ctx.fill(); }
  // rain
  ctx.strokeStyle = hexA(cyan, 0.22 * k.texture + 0.06); ctx.lineWidth = 0.8; for (let i = 0; i < 160; i++) { const x = r() * 420, y = r() * Hl, l = 10 + r() * 20; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.25, y + l); ctx.stroke(); }
  if (k.details) { spaced(ctx, 'DISTRICT 09 · NIGHT MARKET · CURFEW 03:00', 195, 178, 6.5, mono, 400, 0.12, 'center', hexA(c.ink, 0.6)); spaced(ctx, T.caption || '', 195, 726, 9, mono, 400, 0.12, 'center', hexA(c.ink, 0.75)); }
}

// WILDWOOD: the forest floor, playful and very much alive
function drawWildHome(ctx, th, Hl) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, k = K(th), ink = c.ink, green = c.glow, rust = c.accent, gold = c.alert || '#E3B341', r = rng(seedOf(th, 8811));
  // labels ride along with the art (scale and position) but stay 10px on screen and never run off the edges
  const note = (txt2, x, y, ax, ay, align, free) => { if (!k.details) return; const sc = free ? 1 : k.scale, fs = 10 / sc, w = measureSpaced(ctx, txt2, fs, disp, 400, 0), sx = (v) => free ? v : 195 + (v - 195) * sc; let L = align === 'right' ? x - w : x, R = L + w; if (sx(R) > 384) { const d = (sx(R) - 384) / sc; L -= d; R -= d; } if (sx(L) < 6) { const d = (6 - sx(L)) / sc; L += d; R += d; } const sy = free ? y : 520 + k.shift + (y - 520) * sc; if (sy < 168 || sy > 744) return; const tx = align === 'right' ? R : L; spaced(ctx, txt2, tx, y, fs, disp, 400, 0, align || 'left', hexA(ink, 0.82)); ctx.strokeStyle = hexA(ink, 0.5); ctx.lineWidth = 0.8 / sc; ctx.setLineDash([2 / sc, 3 / sc]); ctx.beginPath(); const lx = align === 'right' ? Math.min(R, ax + 40) - 6 : Math.max(L, ax - 40) + 6, ly = y + 4 / sc; ctx.moveTo(lx, ly); ctx.quadraticCurveTo((lx + ax) / 2 + (ax > lx ? -8 : 8), (ly + ay) / 2 + 6, ax, ay); ctx.stroke(); ctx.setLineDash([]); };
  // the meadow is built from real contours, so everything can stand exactly on the ground
  const yA = (x) => 446 + 9 * Math.sin(x / 58 + 0.5) - 13 * Math.sin(x / 140 + 1.2), yB = (x) => 494 + 15 * Math.sin(x / 88 + 2.0) + 5 * Math.sin(x / 37), yC = (x) => 553 + 7 * Math.sin(x / 110 + 0.6);
  const sTop = (x) => 597 + (420 - x) * 0.235 + 3 * Math.sin(x / 50), sBot = (x) => 624 + (420 - x) * 0.25 + 3 * Math.sin(x / 44 + 1);
  const shadow = (x, y, rx, ry) => { ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry || rx * 0.24, 0, 0, Math.PI * 2); ctx.fill(); };
  const tuft = (x, y, n, h, col) => { ctx.fillStyle = col || hexA(green, 0.95); for (let i = 0; i < n; i++) { const bx = x + (i - (n - 1) / 2) * 2.6, bh = h * (0.6 + ((i * 37) % 10) / 22), lean = ((i * 53) % 7 - 3) * 0.7; ctx.beginPath(); ctx.moveTo(bx - 1.2, y); ctx.quadraticCurveTo(bx + lean * 0.4, y - bh * 0.6, bx + lean, y - bh); ctx.quadraticCurveTo(bx + lean * 0.3 + 0.6, y - bh * 0.5, bx + 1.2, y); ctx.closePath(); ctx.fill(); } };
  const hillFill = (fn, col, line) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-300, Hl + 200); for (let x = -300; x <= 690; x += 5) ctx.lineTo(x, fn(x)); ctx.lineTo(690, Hl + 200); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -300; x <= 690; x += 5) x === -300 ? ctx.moveTo(x, fn(x)) : ctx.lineTo(x, fn(x)); ctx.stroke(); ctx.strokeStyle = hexA('#FFFFFF', 0.18); ctx.lineWidth = 3; ctx.beginPath(); for (let x = -300; x <= 690; x += 5) x === -300 ? ctx.moveTo(x, fn(x) + 3) : ctx.lineTo(x, fn(x) + 3); ctx.stroke(); };
  // sky, sun and soft rays
  const sky = ctx.createLinearGradient(0, 0, 0, 470); sky.addColorStop(0, hexA('#FFFFFF', 0.35)); sky.addColorStop(1, hexA('#FFFFFF', 0)); ctx.fillStyle = sky; ctx.fillRect(0, 0, 390, 470);
  ctx.save(); ctx.globalAlpha = 0.08 * k.glow; for (let i = 0; i < 8; i++) { ctx.fillStyle = '#FFF6D0'; ctx.beginPath(); ctx.moveTo(318, 232); ctx.lineTo(-40 + i * 58, 760); ctx.lineTo(-10 + i * 58, 760); ctx.closePath(); ctx.fill(); } ctx.restore();
  ctx.fillStyle = gold; ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(318, 232, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(ctx, 318 + 28 * Math.cos(a), 232 + 28 * Math.sin(a), 318 + 36 * Math.cos(a), 232 + 36 * Math.sin(a), ink, 1.2); }
  [[350, 290], [362, 282], [374, 292], [338, 297], [386, 299]].forEach(([x, y]) => { ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x - 6, y - 2); ctx.quadraticCurveTo(x - 3, y - 6, x, y); ctx.quadraticCurveTo(x + 3, y - 6, x + 6, y - 2); ctx.stroke(); });
  centerXform(ctx, th, 195, 520, () => {
    // far hill with a distant treeline, then the middle hill
    hillFill(yA, hexA(green, 0.3), hexA(ink, 0.22));
    for (let x = -280; x < 680; x += 17) { const h = 11 + ((x * 7 + 300) % 9), b = yA(x) + 3, pine = ((x + 300) / 17 | 0) % 4 === 1; ctx.fillStyle = hexA(green, 0.62); ctx.strokeStyle = hexA(ink, 0.3); ctx.lineWidth = 0.7; ctx.beginPath(); if (pine) { ctx.moveTo(x, b - h - 5); ctx.lineTo(x + 6, b); ctx.lineTo(x - 6, b); ctx.closePath(); } else { ctx.arc(x, b - h * 0.62, h * 0.48, 0, Math.PI * 2); } ctx.fill(); ctx.stroke(); }
    hillFill(yB, hexA(green, 0.48), hexA(ink, 0.25));
    for (let i = 0; i < 46; i++) { const x = -40 + (i * 61) % 470, y = yB(x) + 8 + (i * 29) % 40; if (y < yC(x) - 4) seg(ctx, x, y, x + 1.5, y - 4, hexA(ink, 0.18), 0.7); }
    // a hare mid-hop on the middle hill: its shadow stays on the ground below it, paw prints behind
    shadow(298, yB(298) + 1, 15, 3.2); [[268, 0], [256, 1], [242, 0], [230, 1]].forEach(([x, o]) => { ctx.fillStyle = hexA(ink, 0.28); ctx.beginPath(); ctx.ellipse(x, yB(x) + 1.5 + o * 2.5, 2.6, 1.3, 0, 0, Math.PI * 2); ctx.fill(); });
    hare(ctx, 300, yB(300) - 22, ink); [[278, yB(300) - 14], [282, yB(300) - 6]].forEach(([x, y]) => { ctx.strokeStyle = hexA(ink, 0.35); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 2); ctx.stroke(); });
    // a young tree on the left holds the wren's branch
    const tb = yC(40) + 6; ctx.fillStyle = hexA('#6B4A2A', 0.95); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(30, tb); ctx.quadraticCurveTo(38, 460, 44, 324); ctx.lineTo(52, 324); ctx.quadraticCurveTo(48, 460, 48, tb); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 6; i++) { const y = 362 + i * 30; seg(ctx, 40 + (i % 2) * 2, y, 42 + (i % 2) * 2, y + 9, hexA(ink, 0.4), 0.7); }
    ctx.save(); ctx.translate(0, 24);
    ctx.strokeStyle = hexA('#6B4A2A', 1); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(48, 322); ctx.quadraticCurveTo(100, 312, 170, 324); ctx.stroke(); ctx.strokeStyle = ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(48, 320.5); ctx.quadraticCurveTo(100, 310.5, 170, 322.5); ctx.stroke();
    ctx.strokeStyle = hexA('#6B4A2A', 1); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(140, 320); ctx.lineTo(156, 306); ctx.stroke(); ctx.beginPath(); ctx.moveTo(48, 300); ctx.lineTo(30, 284); ctx.moveTo(50, 300); ctx.lineTo(66, 282); ctx.stroke();
    [[28, 290, 17, 0.82], [70, 290, 15, 0.82], [48, 270, 21, 0.9], [22, 304, 12, 0.78], [46, 300, 16, 0.95], [66, 306, 11, 0.86]].forEach(([x, y, rr, al]) => { ctx.fillStyle = hexA(green, al); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = hexA(green, 0.9); [[28, 290, 17], [70, 290, 15], [48, 270, 21], [22, 304, 12], [46, 300, 16], [66, 306, 11]].forEach(([x, y, rr]) => { ctx.beginPath(); ctx.arc(x, y, rr - 1.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = hexA(ink, 0.35); ctx.lineWidth = 0.8; [[40, 262, 50, 258], [60, 280, 68, 276], [24, 288, 30, 282], [52, 296, 60, 292], [36, 278, 42, 274]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2, b - 4, c2, d); ctx.stroke(); });
    [[34, 268, -2.4], [78, 280, -0.5], [158, 304, -0.8], [166, 322, 0.3], [126, 316, 2.6], [88, 316, 2.4]].forEach(([x, y, a], i) => wLeaf(ctx, x, y, i < 2 ? 12 : 13, a, hexA(green, i % 2 ? 0.8 : 0.95), ink));
    wrenBird(ctx, 108, 314, 1, ink, rust);
    [[124, 284, 0], [134, 272, 1], [128, 260, 0]].forEach(([x, y, f]) => { ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(x, y, 2.6, 2, -0.4, 0, Math.PI * 2); ctx.fill(); seg(ctx, x + 2.4, y, x + 2.4, y - 9, ink, 0.9); if (f) { ctx.strokeStyle = ink; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(x + 2.4, y - 9); ctx.quadraticCurveTo(x + 7, y - 7, x + 6, y - 3); ctx.stroke(); } });
    ctx.restore();
    // the front meadow
    hillFill(yC, hexA(green, 0.66), hexA(ink, 0.3));
    for (let i = 0; i < 70; i++) { const x = -40 + (i * 47) % 470, y = yC(x) + 6 + (i * 31) % 150; if (y < sTop(x) - 3) seg(ctx, x, y, x + 1.5, y - 4, hexA(ink, 0.16), 0.7); }
    tuft(38, tb + 1, 7, 9);
    // the stream, with banks, ripples and stones
    ctx.fillStyle = hexA('#7FB7D9', 0.78); ctx.beginPath(); ctx.moveTo(-300, sTop(-300)); for (let x = -300; x <= 690; x += 5) ctx.lineTo(x, sTop(x)); for (let x = 690; x >= -300; x -= 5) ctx.lineTo(x, sBot(x)); ctx.closePath(); ctx.fill();
    [sTop, sBot].forEach((fn, j) => { ctx.strokeStyle = hexA(ink, 0.55); ctx.lineWidth = 1.1; ctx.beginPath(); for (let x = -300; x <= 690; x += 5) x === -300 ? ctx.moveTo(x, fn(x)) : ctx.lineTo(x, fn(x)); ctx.stroke(); ctx.strokeStyle = hexA(j ? '#FFFFFF' : green, 0.35); ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = -300; x <= 690; x += 5) x === -300 ? ctx.moveTo(x, fn(x) + (j ? -2.5 : 2.5)) : ctx.lineTo(x, fn(x) + (j ? -2.5 : 2.5)); ctx.stroke(); });
    for (let i = 0; i < 12; i++) { const x = 18 + i * 33, m = (sTop(x) + sBot(x)) / 2 + (i % 2 ? -4 : 5); if (Math.abs(x - 236) < 34) continue; seg(ctx, x, m, x + 13, m - 3, hexA('#FFFFFF', 0.85), 1.1); }
    [[112, 0], [318, 1], [172, 1]].forEach(([x, j]) => { const y = j ? sBot(x) - 3 : sTop(x) + 4; ctx.fillStyle = hexA('#9A9A90', 1); ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(x, y, 7, 3.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = hexA('#FFFFFF', 0.7); ctx.beginPath(); ctx.ellipse(x, y + 1, 10, 4.6, 0, 0.2, Math.PI - 0.2); ctx.stroke(); });
    // a very content frog on a lily pad, ripples round it, and a lily flower beside
    const fy = (sTop(236) + sBot(236)) / 2 + 2; [16, 26].forEach((rr, i) => { ctx.strokeStyle = hexA('#FFFFFF', 0.6 - i * 0.2); ctx.lineWidth = 0.9; ctx.beginPath(); ctx.ellipse(236, fy + 1, rr + 12, (rr + 12) * 0.32, 0, 0, Math.PI * 2); ctx.stroke(); });
    ctx.fillStyle = hexA(green, 0.98); ctx.strokeStyle = ink; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.ellipse(236, fy, 22, 7.5, 0, 0.3, Math.PI * 2 - 0.1); ctx.lineTo(236, fy); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = hexA(ink, 0.35); ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = 0.6 + i * 1.1; ctx.moveTo(236, fy); ctx.lineTo(236 + 18 * Math.cos(a), fy + 6 * Math.sin(a)); } ctx.stroke();
    frog(ctx, 234, fy - 9, ink, green);
    ctx.fillStyle = hexA(green, 0.9); ctx.strokeStyle = ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(276, fy + 3, 10, 3.6, 0, 0.4, Math.PI * 2 - 0.2); ctx.lineTo(276, fy + 3); ctx.closePath(); ctx.fill(); ctx.stroke(); for (let i = 0; i < 6; i++) { const a = Math.PI + i * Math.PI / 5; ctx.fillStyle = i % 2 ? '#FFFFFF' : hexA(rust, 0.35); ctx.beginPath(); ctx.ellipse(276 + 4 * Math.cos(a), fy - 1 + 3 * Math.sin(a), 3, 1.6, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(276, fy - 1.5, 1.6, 0, Math.PI * 2); ctx.fill();
    // ferns at both edges
    wFern(ctx, 18, 604, 108, 0.24, hexA(green, 0.92), ink, 1.2); tuft(20, 604, 6, 8);
    wFern(ctx, 376, 586, 76, -0.22, hexA(green, 0.88), ink, 1.1); tuft(376, 586, 6, 8);
    // the fox peeks from behind a mossy log, paws on top
    const lx0 = 64, lx1 = 200, ly0 = 532, ly1 = 570;
    shadow((lx0 + lx1) / 2 + 6, ly1 + 1, 82, 6);
    fox(ctx, 106, 522, ink, rust);
    ctx.fillStyle = hexA('#8B6A44', 0.95); ctx.strokeStyle = ink; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(lx0 + 14, ly0); ctx.lineTo(lx1, ly0); ctx.lineTo(lx1, ly1); ctx.lineTo(lx0 + 14, ly1); ctx.quadraticCurveTo(lx0 - 4, (ly0 + ly1) / 2, lx0 + 14, ly0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hexA('#5E4229', 0.5); ctx.beginPath(); ctx.moveTo(lx0 + 6, ly1 - 9); ctx.quadraticCurveTo(130, ly1 - 4, lx1, ly1 - 8); ctx.lineTo(lx1, ly1); ctx.lineTo(lx0 + 14, ly1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hexA(ink, 0.45); ctx.lineWidth = 0.8; [[ly0 + 9, 80, 150], [ly0 + 17, 96, 186], [ly0 + 26, 74, 132], [ly0 + 31, 150, 196]].forEach(([y, a, b]) => { ctx.beginPath(); ctx.moveTo(a, y); ctx.quadraticCurveTo((a + b) / 2, y - 2, b, y + 0.5); ctx.stroke(); });
    ctx.fillStyle = hexA('#5E4229', 0.9); ctx.beginPath(); ctx.ellipse(158, ly0 + 18, 4, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hexA('#F4EEDF', 1); ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(lx1, (ly0 + ly1) / 2, 11, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); [7.5, 4.2].forEach(rr => { ctx.strokeStyle = hexA(ink, 0.5); ctx.lineWidth = 0.7; ctx.beginPath(); ctx.ellipse(lx1, (ly0 + ly1) / 2, rr * 0.6, rr, 0, 0, Math.PI * 2); ctx.stroke(); });
    ctx.fillStyle = hexA(green, 0.95); ctx.strokeStyle = ink; ctx.lineWidth = 0.8; [[76, 4], [130, 7], [150, 5], [176, 6]].forEach(([x, w2]) => { ctx.beginPath(); ctx.moveTo(x - w2 * 2, ly0 + 1); ctx.quadraticCurveTo(x, ly0 - w2, x + w2 * 2, ly0 + 1); ctx.quadraticCurveTo(x, ly0 + w2 * 0.6, x - w2 * 2, ly0 + 1); ctx.fill(); ctx.stroke(); });
    [[136, -1.7], [160, -1.3], [182, -1.6]].forEach(([x, a]) => wLeaf(ctx, x, ly0 - 1, 9, a, hexA(green, 0.95), ink));
    [96, 116].forEach(x => { ctx.fillStyle = rust; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, ly0 + 1, 5.6, 3.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); [-2, 0, 2].forEach(d => seg(ctx, x + d, ly0 + 2.4, x + d, ly0 + 4.4, hexA(ink, 0.7), 0.6)); });
    [[60, 4], [96, 6], [142, 5], [188, 5]].forEach(([x, n]) => tuft(x, ly1 + 3, n, 8));
    // mushrooms growing by the log's end, a ladybug on the big cap
    shadow(244, 572, 30, 4); wMushroom(ctx, 222, 572, 20, hexA(rust, 0.78), ink); wMushroom(ctx, 240, 570, 40, rust, ink); wMushroom(ctx, 262, 573, 26, hexA(rust, 0.88), ink);
    ladybug(ctx, 236, 536, ink); [[214, 3], [232, 4], [252, 4], [270, 3]].forEach(([x, n]) => tuft(x, 575, n, 7));
    // the hedgehog out on patrol, in the open
    shadow(318, 579, 32, 4.5); ctx.save(); ctx.translate(314, 576); ctx.scale(1.35, 1.35); hedgehog(ctx, 0, 0, ink, rust); ctx.restore(); [[288, 3], [350, 3]].forEach(([x, n]) => tuft(x, 580, n, 6));
    // a snail on a mossy stone, its trail shining behind it
    const rx = 152, ry = 618; shadow(rx + 2, ry + 6, 20, 4); ctx.fillStyle = hexA('#9A9A90', 1); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(rx, ry, 18, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = hexA(green, 0.85); ctx.beginPath(); ctx.ellipse(rx - 4, ry - 5, 10, 3.6, -0.1, Math.PI, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = hexA('#FFFFFF', 0.8); ctx.lineWidth = 1.4; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(rx - 34, ry + 6); ctx.quadraticCurveTo(rx - 20, ry - 2, rx - 6, ry - 7.5); ctx.stroke(); ctx.setLineDash([]);
    snail(ctx, rx + 2, ry - 7.5, ink, gold); tuft(rx - 16, ry + 7, 4, 6); tuft(rx + 16, ry + 7, 4, 6);
    // reeds and cattails on the near bank
    for (let i = 0; i < 7; i++) { const x = 44 + i * 6, b = sBot(x) + 9, h = 28 + (i % 3) * 7; ctx.strokeStyle = hexA(green, 1); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, b); ctx.quadraticCurveTo(x + 2, b - h * 0.5, x + (i % 2 ? 4 : -2), b - h); ctx.stroke(); if (i % 2 === 0) { ctx.fillStyle = hexA('#6B4A2A', 1); ctx.strokeStyle = ink; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.ellipse(x - 1.4, b - h + 5, 2.2, 5.5, 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
    tuft(62, sBot(62) + 10, 9, 9);
    // wildflowers on proper stems, in the open spaces only
    [[72, 590, 'd'], [94, 598, 'p'], [186, 592, 'd'], [118, 640, 'p'], [196, 632, 'd'], [228, 612, 'd'], [262, 606, 'p'], [60, 520, 'd'], [176, 516, 'p'], [214, 508, 'd'], [250, 512, 'p'], [336, 714, 'd'], [360, 706, 'p'], [312, 720, 'd']].forEach(([x, y, t], i) => stemFlower(ctx, x, y, t, y < 540 ? 0.75 : 1, ink, green, gold, rust, i));
  });
  // butterflies, the bee, falling leaves and fireflies move with the scene, so nothing slides over anything at any scale or position
  centerXform(ctx, th, 195, 520, () => {
  const path = (pts) => { ctx.strokeStyle = hexA(ink, 0.45); ctx.lineWidth = 0.8; ctx.setLineDash([2, 4]); ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.quadraticCurveTo(x - 20, y - 26, x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.setLineDash([]); };
  path([[66, 424], [92, 400], [118, 410]]); butterfly(ctx, 118, 410, ink, rust, gold);
  path([[198, 384], [224, 362], [250, 350]]); butterfly(ctx, 250, 350, ink, '#7FB7D9', '#F4EEDF');
  path([[150, 432], [182, 412], [212, 428], [244, 412]]); bee(ctx, 244, 412, ink, gold); note('bee route (busy)', 212, 384, 238, 402);
  // a couple of leaves on the breeze, with wind lines so they read as falling
  [[156, 372, 0.7, gold], [348, 406, 2.4, rust]].forEach(([x, y, a, col]) => { wLeaf(ctx, x, y, 20, a, hexA(col, 0.75), ink); ctx.strokeStyle = hexA(ink, 0.3); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x - 22, y - 8); ctx.quadraticCurveTo(x - 12, y - 12, x - 4, y - 8); ctx.moveTo(x - 18, y + 2); ctx.quadraticCurveTo(x - 10, y - 1, x - 3, y + 2); ctx.stroke(); });
  // fireflies, few and well clear of everything
  [[92, 452], [338, 452], [130, 470], [196, 664], [356, 646]].forEach(([x, y]) => { ctx.save(); ctx.shadowColor = gold; ctx.shadowBlur = 8 * k.glow; ctx.fillStyle = hexA(gold, 0.9); ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
  });
  centerXform(ctx, th, 195, 520, () => {
    note('wren, singing her heart out', 152, 304, 132, 312);
    note('fox! (shy)', 142, 494, 122, 502);
    note('hedgehog, on patrol', 382, 600, 342, 586, 'right');
    note('frog, very content', 266, 702, 246, 684);
  });
  if (k.details) spaced(ctx, T.homeTop || '', 195, 186, 8, mono, 400, 0.22, 'center', hexA(ink, 0.6));
  spaced(ctx, T.caption || '', 195, 732, 12, disp, 400, 0, 'center', hexA(ink, 0.85));
}
function stemFlower(ctx, x, y, t, s, ink, green, gold, rust, i) { const h = (12 + (i % 3) * 4) * s; ctx.strokeStyle = hexA(green, 1); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.quadraticCurveTo(x + (i % 2 ? 2 : -2), y + h * 0.5, x, y); ctx.stroke(); wLeaf(ctx, x, y + h * 0.6, 6 * s, i % 2 ? -0.6 : Math.PI + 0.6, hexA(green, 0.95), ink); if (t === 'd') daisy(ctx, x, y, 4.4 * s, ink, gold); else poppy(ctx, x, y, 4.4 * s, ink, rust); }
function snail(ctx, x, y, ink, col) { ctx.fillStyle = '#E8DCC4'; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.quadraticCurveTo(x - 4, y - 2, x + 8, y - 1); ctx.quadraticCurveTo(x + 12, y - 1, x + 12, y - 4); ctx.lineTo(x + 10, y - 7); ctx.quadraticCurveTo(x + 6, y - 3, x - 2, y - 3); ctx.lineTo(x - 14, y); ctx.closePath(); ctx.fill(); ctx.stroke(); seg(ctx, x + 10, y - 6, x + 9, y - 13, ink, 0.9); seg(ctx, x + 12, y - 5, x + 14, y - 12, ink, 0.9); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x + 9, y - 13.5, 1.2, 0, Math.PI * 2); ctx.arc(x + 14, y - 12.5, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hexA(col, 0.95); ctx.beginPath(); ctx.arc(x - 3, y - 9, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = hexA(ink, 0.8); ctx.lineWidth = 0.9; ctx.beginPath(); for (let t = 0; t <= 1; t += 0.05) { const a = t * Math.PI * 3.6, rr = 7.5 * (1 - t * 0.85); const px = x - 3 + rr * Math.cos(a), py = y - 9 + rr * Math.sin(a); t ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
function wrenBird(ctx, x, y, s, ink, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.ellipse(0, -8, 11, 8, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-9, -12); ctx.lineTo(-18, -24); ctx.lineTo(-12, -10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(8, -15, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(10, -16, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(13, -15); ctx.lineTo(19, -17); ctx.lineTo(13, -13); ctx.closePath(); ctx.fill(); seg(ctx, -2, -1, -3, 4, ink, 1); seg(ctx, 3, -1, 3, 4, ink, 1); ctx.restore(); }
function fox(ctx, x, y, ink, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-16, 6); ctx.lineTo(-14, -12); ctx.lineTo(-8, -26); ctx.lineTo(-2, -12); ctx.lineTo(6, -12); ctx.lineTo(12, -26); ctx.lineTo(16, -12); ctx.lineTo(18, 6); ctx.quadraticCurveTo(1, 20, -16, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#F4EEDF'; ctx.beginPath(); ctx.moveTo(-10, 4); ctx.quadraticCurveTo(1, 16, 12, 4); ctx.lineTo(1, 10); ctx.closePath(); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(-5, -3, 1.8, 0, Math.PI * 2); ctx.arc(7, -3, 1.8, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(1, 8, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function hedgehog(ctx, x, y, ink, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = hexA(col, 0.8); ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(-20, 0); for (let i = 0; i <= 10; i++) { const a = Math.PI + Math.PI * i / 10, rr = i % 2 ? 22 : 17; ctx.lineTo(rr * Math.cos(a), -2 + rr * 0.75 * Math.sin(a)); } ctx.lineTo(20, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = hexA(ink, 0.55); ctx.lineWidth = 0.8; for (let i = 0; i < 9; i++) { const a = Math.PI * 1.12 + i / 8 * Math.PI * 0.76; ctx.beginPath(); ctx.moveTo(9 * Math.cos(a), -3 + 7 * Math.sin(a)); ctx.lineTo(17 * Math.cos(a), -3 + 13 * Math.sin(a)); ctx.stroke(); } ctx.strokeStyle = ink; ctx.fillStyle = '#F4EEDF'; ctx.beginPath(); ctx.moveTo(14, -2); ctx.quadraticCurveTo(26, -4, 30, 2); ctx.quadraticCurveTo(22, 4, 14, 2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(30, 2, 1.8, 0, Math.PI * 2); ctx.arc(22, -1, 1.2, 0, Math.PI * 2); ctx.fill(); seg(ctx, -10, 0, -11, 4, ink, 1.2); seg(ctx, 8, 0, 9, 4, ink, 1.2); ctx.restore(); }
function frog(ctx, x, y, ink, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = hexA(col, 1); ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); [[-6, -8], [6, -8]].forEach(([dx, dy]) => { ctx.fillStyle = hexA(col, 1); ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(dx, dy, 1.6, 0, Math.PI * 2); ctx.fill(); }); ctx.beginPath(); ctx.arc(0, 1, 6, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.restore(); }
function hare(ctx, x, y, ink) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#F4EEDF'; ctx.strokeStyle = ink; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.ellipse(0, 0, 16, 9, -0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(15, -9, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); [[14, -26, -0.1], [19, -25, 0.25]].forEach(([ex, ey, a]) => { ctx.beginPath(); ctx.ellipse(ex, ey, 2.6, 9, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(17, -10, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(-16, -2, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); seg(ctx, -10, 6, -20, 12, ink, 1.2); seg(ctx, 8, 6, 16, 12, ink, 1.2); ctx.restore(); }
function ladybug(ctx, x, y, ink) { ctx.fillStyle = '#D9483B'; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); seg(ctx, x, y - 4, x, y + 4, ink, 0.8); ctx.fillStyle = ink; [[-2, -1], [2, 1], [-2, 2], [2, -2]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(x + dx, y + dy, 0.9, 0, Math.PI * 2); ctx.fill(); }); ctx.beginPath(); ctx.arc(x + 5, y, 2, 0, Math.PI * 2); ctx.fill(); }
function daisy(ctx, x, y, s, ink, mid) { ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.6; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.ellipse(x + s * 0.8 * Math.cos(a), y + s * 0.8 * Math.sin(a), s * 0.55, s * 0.25, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.fillStyle = mid; ctx.beginPath(); ctx.arc(x, y, s * 0.4, 0, Math.PI * 2); ctx.fill(); }
function poppy(ctx, x, y, s, ink, col) { ctx.fillStyle = col; ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.6; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; ctx.beginPath(); ctx.arc(x + s * 0.5 * Math.cos(a), y + s * 0.5 * Math.sin(a), s * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, s * 0.3, 0, Math.PI * 2); ctx.fill(); }
function butterfly(ctx, x, y, ink, c1, c2) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = ink; ctx.lineWidth = 1; [[-1, c1], [1, c1]].forEach(([sd, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(sd * 7, -4, 7, 5, sd * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(sd * 5, 5, 5, 3.5, -sd * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }); seg(ctx, 0, -7, 0, 8, ink, 1.6); seg(ctx, 0, -7, -3, -12, ink, 0.8); seg(ctx, 0, -7, 3, -12, ink, 0.8); ctx.restore(); }
function bee(ctx, x, y, ink, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(-2, -6, 4, 3, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(3, -6, 4, 3, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.fillRect(-2.5, -4, 1.6, 8); ctx.fillRect(1.5, -4, 1.6, 8); ctx.restore(); }

// ================= LOCK SCREEN PASS: White Rabbit, Vapor Plaza, Wildwood, Neon District =================
function rbMask(ctx, cx, cy, s, ink, mag, panel, k) {
  const ear = (dx, ang) => { ctx.save(); ctx.translate(cx + dx * s, cy - 30 * s); ctx.rotate(ang); ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-11 * s, -30 * s); ctx.lineTo(0, -86 * s); ctx.lineTo(11 * s, -30 * s); ctx.closePath(); ctx.fill(); ctx.fillStyle = mag; ctx.beginPath(); ctx.moveTo(0, -14 * s); ctx.lineTo(-4 * s, -32 * s); ctx.lineTo(0, -66 * s); ctx.lineTo(4 * s, -32 * s); ctx.closePath(); ctx.fill(); ctx.restore(); };
  ear(-20, -0.16); ear(20, 0.16);
  ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx - 46 * s, cy - 36 * s); ctx.lineTo(cx + 46 * s, cy - 36 * s); ctx.lineTo(cx + 40 * s, cy + 8 * s); ctx.lineTo(cx, cy + 52 * s); ctx.lineTo(cx - 40 * s, cy + 8 * s); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.shadowColor = mag; ctx.shadowBlur = 10 * k.glow; ctx.fillStyle = mag; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(cx + sd * 6 * s, cy - 12 * s); ctx.lineTo(cx + sd * 34 * s, cy - 20 * s); ctx.lineTo(cx + sd * 28 * s, cy - 8 * s); ctx.closePath(); ctx.fill(); }); ctx.restore();
  ctx.strokeStyle = hexA(panel, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy - 34 * s); ctx.lineTo(cx, cy + 48 * s); ctx.stroke();
}
function drawRabbitLock(ctx, th, Hl, phraseIdx) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th), ink = c.ink, mag = c.accent, lil = c.glow, r = rng(seedOf(th, 6621 + phraseIdx));
  ctx.fillStyle = c.panel; ctx.fillRect(0, 0, 390, Hl);
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, hexA(c.ground, 0.35)); g.addColorStop(1, hexA(lil, 0.5)); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  ctx.strokeStyle = hexA(ink, 0.05 * k.texture + 0.02); ctx.lineWidth = 0.6; for (let x = 0; x <= 390; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hl); ctx.stroke(); } for (let y = 0; y <= Hl; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke(); }
  // a vault dial behind everything
  const VX = 195, VY = 410; ctx.strokeStyle = hexA(ink, 0.22); ctx.lineWidth = 1; [176, 164, 120].forEach(rr => { ctx.beginPath(); ctx.arc(VX, VY, rr, 0, Math.PI * 2); ctx.stroke(); });
  for (let i = 0; i < 100; i++) { const a = i * Math.PI / 50, l = i % 10 ? 4 : 10; seg(ctx, VX + 164 * Math.cos(a), VY + 164 * Math.sin(a), VX + (164 + l) * Math.cos(a), VY + (164 + l) * Math.sin(a), hexA(ink, i % 10 ? 0.25 : 0.5), 0.8); }
  if (k.details) for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; spaced(ctx, String(i * 10), VX + 186 * Math.cos(a), VY + 186 * Math.sin(a) + 3, 6.5, mono, 500, 0.04, 'center', hexA(ink, 0.45)); }
  ctx.fillStyle = mag; ctx.beginPath(); ctx.moveTo(VX, VY - 182); ctx.lineTo(VX - 5, VY - 192); ctx.lineTo(VX + 5, VY - 192); ctx.closePath(); ctx.fill();
  // security lasers
  [[[0, 300], [390, 236]], [[0, 560], [390, 640]], [[40, 220], [300, 780]], [[390, 300], [120, 760]]].forEach(([a, b], i) => { ctx.save(); ctx.shadowColor = mag; ctx.shadowBlur = 8 * k.glow; ctx.strokeStyle = hexA(mag, i > 1 ? 0.3 : 0.7); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); [a, b].forEach(([x, y]) => { ctx.fillStyle = mag; ctx.beginPath(); ctx.arc(Math.min(386, Math.max(4, x)), Math.min(Hl - 4, y), 2.6, 0, Math.PI * 2); ctx.fill(); }); });
  // the calling card, front and centre
  centerXform(ctx, th, VX, VY, () => {
    ctx.save(); ctx.translate(VX, VY); ctx.rotate(-0.08);
    const cw = 176, ch = 252; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; ctx.fillStyle = ink; ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 10); ctx.fill(); ctx.restore();
    const foil = ctx.createLinearGradient(-cw / 2, 0, cw / 2, 0); foil.addColorStop(0, hexA(lil, 0.0)); foil.addColorStop(0.5, hexA(lil, 0.55)); foil.addColorStop(1, hexA(mag, 0.0)); ctx.fillStyle = foil; ctx.fillRect(-cw / 2, -ch / 2 + 34, cw, 14);
    ctx.strokeStyle = hexA(c.panel, 0.35); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.roundRect(-cw / 2 + 8, -ch / 2 + 8, cw - 16, ch - 16, 6); ctx.stroke();
    spaced(ctx, 'CALLING CARD', 0, -ch / 2 + 26, 7, mono, 500, 0.3, 'center', hexA(c.panel, 0.8));
    rbMask(ctx, 0, 8, 0.78, c.panel, mag, ink, k);
    spaced(ctx, 'WITH COMPLIMENTS', 0, ch / 2 - 46, 7, mono, 500, 0.26, 'center', hexA(c.panel, 0.7));
    spaced(ctx, 'CELL 07', 0, ch / 2 - 30, 11, disp, dw, 0.1, 'center', c.panel);
    for (let i = 0; i < 26; i++) { const w = 1 + Math.floor(r() * 2.5); ctx.fillStyle = hexA(c.panel, 0.7); ctx.fillRect(-36 + i * 2.8, ch / 2 - 22, w, 10); }
    ctx.restore();
  });
  // technical callouts around the dial
  if (k.details) {
    const tag = (x, y, t1, t2, right) => { ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.8; ctx.strokeRect(right ? x - 104 : x, y - 12, 104, 26); ctx.fillStyle = mag; ctx.fillRect(right ? x - 104 : x, y - 12, 3, 26); spaced(ctx, t1, right ? x - 96 : x + 9, y - 1, 6, mono, 500, 0.18, 'left', hexA(ink, 0.6)); spaced(ctx, t2, right ? x - 96 : x + 9, y + 10, 7.5, mono, 700, 0.1, 'left', ink); };
    tag(16, 262, 'VAULT 03', 'OPEN', false); tag(374, 262, 'LASERS', 'BYPASSED', true); tag(16, 560, 'WINDOW', '00:47 LEFT', false); tag(374, 560, 'WITNESSES', 'NONE', true);
    spaced(ctx, T.tagL || '', 24, 236, 7.5, mono, 500, 0.16, 'left', hexA(ink, 0.7)); spaced(ctx, T.tagR || '', 366, 236, 7.5, mono, 700, 0.16, 'right', mag);
  }
  const fs = headline2(ctx, th, phraseIdx, 195, 640, 330, 46, ink);
  ctx.fillStyle = mag; ctx.fillRect(160, 640 + fs * 1.06 + 16, 70, 2.5);
  spaced(ctx, T.sub || '', 195, 640 + fs * 1.06 + 40, 10, disp, 400, 0, 'center', hexA(ink, 0.75));
  if (k.details) spaced(ctx, T.foot || '', 195, Hl - 34, 7, mono, 500, 0.2, 'center', hexA(ink, 0.6));
}

function drawWildLock(ctx, th, Hl, phraseIdx) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, k = K(th), ink = c.ink, green = c.glow, rust = c.accent, gold = c.alert || '#E3B341', r = rng(seedOf(th, 6071));
  const px = 30, py = 226, pw = 330, ph = 360;
  // the specimen plate, taped into the journal
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.12)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fillStyle = '#FBF9F1'; ctx.fillRect(px, py, pw, ph); ctx.restore();
  ctx.strokeStyle = hexA(ink, 0.7); ctx.lineWidth = 1; ctx.strokeRect(px + 8, py + 8, pw - 16, ph - 16); ctx.lineWidth = 0.4; ctx.strokeRect(px + 12, py + 12, pw - 24, ph - 24);
  [[px + 20, py - 6, -0.3], [px + pw - 20, py - 6, 0.3], [px + 20, py + ph + 6, 0.3], [px + pw - 20, py + ph + 6, -0.3]].forEach(([x, y, a]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = hexA('#E9DFC0', 0.85); ctx.fillRect(-22, -8, 44, 16); ctx.restore(); });
  if (k.details) { spaced(ctx, T.tagR || 'PLATE 03', px + pw / 2, py + 30, 8, mono, 400, 0.24, 'center', hexA(ink, 0.7)); spaced(ctx, 'COLLECTED 11 · X · 26', px + pw - 22, py + 30, 6.5, mono, 400, 0.12, 'right', hexA(rust, 0.85)); spaced(ctx, 'No. 0447', px + 22, py + 30, 6.5, mono, 400, 0.12, 'left', hexA(ink, 0.6)); }
  centerXform(ctx, th, 195, py + ph / 2, () => {
    // pressed fern, mushrooms and a leaf
    wFern(ctx, 120, py + ph - 70, 230, -0.12, hexA(green, 0.92), ink, 1.4);
    wLeaf(ctx, 186, py + 180, 54, -0.9, hexA(gold, 0.6), ink); wLeaf(ctx, 160, py + 236, 40, -2.5, hexA(green, 0.5), ink);
    wMushroom(ctx, 236, py + ph - 70, 46, rust, ink); wMushroom(ctx, 262, py + ph - 70, 30, hexA(rust, 0.85), ink); wMushroom(ctx, 214, py + ph - 70, 22, hexA(rust, 0.7), ink);
    seg(ctx, 196, py + ph - 69, 286, py + ph - 69, hexA(ink, 0.5), 0.8);
    // a pinned beetle with its label
    const bx = 282, by = py + 110; ctx.fillStyle = hexA('#3C5A46', 1); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(bx, by, 9, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); seg(ctx, bx, by - 13, bx, by + 13, ink, 0.8); ctx.beginPath(); ctx.arc(bx, by - 16, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [[-1, -6], [-1, 2], [-1, 9], [1, -6], [1, 2], [1, 9]].forEach(([sd, dy]) => { ctx.beginPath(); ctx.moveTo(bx + sd * 8, by + dy); ctx.lineTo(bx + sd * 15, by + dy - 3); ctx.lineTo(bx + sd * 17, by + dy + 2); ctx.stroke(); });
    seg(ctx, bx - 3, by - 20, bx - 6, by - 28, ink, 0.8); seg(ctx, bx + 3, by - 20, bx + 6, by - 28, ink, 0.8);
    ctx.fillStyle = rust; ctx.beginPath(); ctx.arc(bx, by - 2, 2.4, 0, Math.PI * 2); ctx.fill();
    // a feather
    ctx.save(); ctx.translate(92, py + 120); ctx.rotate(0.5); ctx.strokeStyle = ink; ctx.lineWidth = 1; seg(ctx, 0, 40, 0, -40, ink, 1); for (let i = -34; i < 36; i += 4) { ctx.strokeStyle = hexA(ink, 0.55); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(-10 + Math.abs(i) * 0.12, i - 6); ctx.moveTo(0, i); ctx.lineTo(10 - Math.abs(i) * 0.12, i - 6); ctx.stroke(); } ctx.restore();
    // magnifier inset of the gills
    const mx = 284, my = py + 220; ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(mx, my, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.save(); ctx.beginPath(); ctx.arc(mx, my, 29, 0, Math.PI * 2); ctx.clip(); for (let i = -10; i <= 10; i++) { ctx.strokeStyle = hexA(rust, 0.6); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(mx, my - 40); ctx.lineTo(mx + i * 6, my + 30); ctx.stroke(); } ctx.restore(); seg(ctx, mx - 21, my + 21, mx - 34, my + 36, ink, 3);
  });
  // specimen labels with leader lines, and a ruler
  if (k.details) {
    const lbl = (x, y, ax, ay, t1, t2) => { ctx.fillStyle = '#FBF9F1'; ctx.strokeStyle = hexA(ink, 0.6); ctx.lineWidth = 0.7; ctx.fillRect(x, y, 96, 24); ctx.strokeRect(x, y, 96, 24); spaced(ctx, t1, x + 5, y + 10, 8, disp, 400, 0, 'left', ink); spaced(ctx, t2, x + 5, y + 20, 5.8, mono, 400, 0.1, 'left', hexA(ink, 0.6)); seg(ctx, x + 48, y, ax, ay, hexA(ink, 0.45), 0.6); };
    lbl(px + 18, py + ph - 56, 120, py + ph - 110, 'Polystichum munitum', 'SWORD FERN · TRAIL 03'); lbl(px + pw - 114, py + ph - 56, 236, py + ph - 96, 'Amanita muscaria', 'DO NOT EAT · NOTED');
    spaced(ctx, 'Carabus nemoralis', 282, py + 150, 7.5, disp, 400, 0, 'center', hexA(ink, 0.7)); spaced(ctx, 'gills, ×10', 284, py + 264, 7, disp, 400, 0, 'center', hexA(ink, 0.7));
    for (let i = 0; i <= 20; i++) seg(ctx, px + 20 + i * 14.5, py + ph - 16, px + 20 + i * 14.5, py + ph - 16 - (i % 5 ? 3 : 6), hexA(ink, 0.5), 0.6);
  }
  headline2(ctx, th, phraseIdx, 195, 650, 330, 42, ink);
  spaced(ctx, T.sub || '', 195, 742, 11, disp, 400, 0, 'center', hexA(ink, 0.75));
  if (k.details) spaced(ctx, T.foot || '', 195, Hl - 30, 7, mono, 400, 0.18, 'center', hexA(ink, 0.6));
}

// ---------- shared: an invented glyph script for signage (no real language, nothing to mistranslate) ----------
function fauxGlyph(ctx, x, y, s, seed, col) {
  const r = rng(seed), lw = Math.max(1, s * 0.1); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'square';
  const L = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x + x1 * s, y + y1 * s); ctx.lineTo(x + x2 * s, y + y2 * s); ctx.stroke(); };
  const n = 3 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * 7), a = 0.1 + Math.floor(r() * 3) * 0.3, b = 0.1 + Math.floor(r() * 3) * 0.3;
    if (k === 0) L(0.1, a, 0.9, a); else if (k === 1) L(b, 0.1, b, 0.9); else if (k === 2) { ctx.strokeRect(x + 0.2 * s, y + 0.2 * s, 0.6 * s, 0.6 * s * (0.5 + r() * 0.5)); }
    else if (k === 3) { ctx.beginPath(); ctx.arc(x + b * s + 0.1 * s, y + a * s + 0.1 * s, lw * 0.9, 0, Math.PI * 2); ctx.fill(); }
    else if (k === 4) L(0.15, 0.85, 0.85, 0.15); else if (k === 5) { L(b, 0.1, b, 0.75); L(b, 0.75, b + 0.25, 0.9); } else L(0.2, a, 0.5, a + 0.25);
  }
  ctx.restore();
}
function fauxText(ctx, x, y, n, s, seed, col, vertical) { for (let i = 0; i < n; i++) fauxGlyph(ctx, vertical ? x : x + i * s * 1.25, vertical ? y + i * s * 1.25 : y, s, seed * 31 + i * 7, col); }

// VAPOR PLAZA lock: a clean striped sun, neon wireframe hills, a true perspective grid
function drawVaporLock(ctx, th, Hl, phraseIdx) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, k = K(th), r = rng(seedOf(th, 5041 + phraseIdx));
  const HZ = 540, SX = 195, SY = 468, SR = 120, pink = c.accent, cyan = c.glow, sunTop = c.alert || '#FFFB96';
  const sky = ctx.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, c.ground); sky.addColorStop(0.55, hexA(pink, 0.6)); sky.addColorStop(0.8, hexA('#C2307E', 0.9)); sky.addColorStop(1, hexA('#5A1A5E', 1));
  ctx.fillStyle = c.ground; ctx.fillRect(0, 0, 390, Hl); ctx.fillStyle = sky; ctx.fillRect(0, 0, 390, HZ);
  for (let i = 0; i < Math.round(70 * k.texture); i++) { ctx.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.6})`; const sz = r() < 0.15 ? 2 : 1.2; ctx.fillRect(r() * 390, r() * HZ * 0.55, sz, sz); }
  centerXform(ctx, th, SX, SY, () => {
    // the sun: a soft halo, then a gradient disc with clean horizontal cuts that widen toward the bottom
    for (let g = 5; g >= 1; g--) { ctx.fillStyle = hexA(sunTop, Math.min(0.3, 0.045 * k.glow)); ctx.beginPath(); ctx.arc(SX, SY, SR + g * 12, 0, Math.PI * 2); ctx.fill(); }
    const sg = ctx.createLinearGradient(0, SY - SR, 0, SY + SR); sg.addColorStop(0, sunTop); sg.addColorStop(0.55, '#FF9E7A'); sg.addColorStop(1, pink);
    ctx.save(); ctx.beginPath(); ctx.arc(SX, SY, SR, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = sg; ctx.fillRect(SX - SR, SY - SR, SR * 2, SR * 2);
    ctx.fillStyle = sky; for (let i = 0; i < 8; i++) { const t = i / 7, y = SY + SR * (0.08 + t * 0.86), h = 2 + t * 7; ctx.fillRect(SX - SR, y, SR * 2, h); }
    ctx.restore();
  });
  // low-poly neon hills on both sides of the horizon
  const hill = (pts, edge) => { ctx.fillStyle = hexA(c.ground, 0.92); ctx.beginPath(); ctx.moveTo(pts[0][0], HZ); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(pts[pts.length - 1][0], HZ); ctx.closePath(); ctx.fill(); ctx.save(); ctx.shadowColor = edge; ctx.shadowBlur = 8 * k.glow; ctx.strokeStyle = edge; ctx.lineWidth = 1.4; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); ctx.strokeStyle = hexA(edge, 0.45); ctx.lineWidth = 0.8; pts.forEach(([x, y], i) => { if (i && i < pts.length - 1 && y < HZ - 6) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (i % 2 ? 14 : -14), HZ); ctx.stroke(); } }); };
  hill([[-10, HZ], [20, 486], [52, 462], [84, 494], [112, 470], [146, 506], [170, HZ]], cyan);
  hill([[222, HZ], [250, 500], [282, 466], [312, 490], [342, 458], [372, 484], [400, HZ]], cyan);
  // the floor: a perspective grid that fades in from the horizon
  const fl = ctx.createLinearGradient(0, HZ, 0, Hl); fl.addColorStop(0, hexA(c.panel, 1)); fl.addColorStop(1, c.ground); ctx.fillStyle = fl; ctx.fillRect(0, HZ, 390, Hl - HZ);
  ctx.save(); ctx.beginPath(); ctx.rect(0, HZ, 390, Hl - HZ); ctx.clip(); ctx.shadowColor = pink; ctx.shadowBlur = 5 * k.glow;
  for (let i = -18; i <= 18; i++) { const gx = ctx.createLinearGradient(0, HZ, 0, Hl); gx.addColorStop(0, hexA(pink, 0.15)); gx.addColorStop(0.35, hexA(pink, 0.9)); gx.addColorStop(1, hexA(pink, 1)); ctx.strokeStyle = gx; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(SX + i * 8, HZ); ctx.lineTo(SX + i * 82, Hl + 40); ctx.stroke(); }
  for (let j = 1; j <= 16; j++) { const t = Math.pow(j / 16, 2.1), y = HZ + (Hl - HZ + 40) * t; ctx.strokeStyle = hexA(pink, Math.min(1, 0.25 + t * 1.2)); ctx.lineWidth = 0.8 + t * 0.8; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(390, y); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.shadowColor = cyan; ctx.shadowBlur = 10 * k.glow; ctx.strokeStyle = cyan; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, HZ); ctx.lineTo(390, HZ); ctx.stroke(); ctx.restore();
  // palms, a marble column and a floating wireframe pyramid
  vaporPalm(ctx, 4, 610, 150, hexA('#1A0630', 0.96), false); vaporPalm(ctx, 386, 622, 160, hexA('#1A0630', 0.96), true);
  vaporColumn(ctx, 334, 560, 26, 90);
  const PX = 64, PY = 376; ctx.save(); ctx.shadowColor = cyan; ctx.shadowBlur = 8 * k.glow; ctx.strokeStyle = cyan; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(PX, PY - 34); ctx.lineTo(PX - 28, PY + 14); ctx.lineTo(PX + 6, PY + 24); ctx.closePath(); ctx.moveTo(PX, PY - 34); ctx.lineTo(PX + 30, PY + 12); ctx.lineTo(PX + 6, PY + 24); ctx.moveTo(PX - 28, PY + 14); ctx.lineTo(PX + 30, PY + 12); ctx.stroke(); ctx.restore();
  const dolphin = (x, y, s, flip) => { ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s); ctx.fillStyle = hexA(cyan, 0.95); ctx.beginPath(); ctx.moveTo(-20, 6); ctx.quadraticCurveTo(-4, -14, 18, -4); ctx.lineTo(24, -6); ctx.lineTo(20, 0); ctx.quadraticCurveTo(0, 2, -14, 10); ctx.lineTo(-24, 16); ctx.lineTo(-20, 6); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-2, -8); ctx.lineTo(4, -16); ctx.lineTo(6, -6); ctx.closePath(); ctx.fill(); ctx.restore(); };
  dolphin(96, 578, 1.05, false); dolphin(292, 590, 0.9, true);
  vaporWindow(ctx, th, 206, 240, 160, 62, 'aesthetic.exe', (x, y) => { spaced(ctx, 'Now loading forever...', x + 4, y + 14, 9, mono, 400, 0, 'left', '#000000'); ctx.fillStyle = '#1A1A80'; for (let i = 0; i < 8; i++) ctx.fillRect(x + 4 + i * 11, y + 22, 9, 8); });
  if (k.details) { spaced(ctx, 'PLAY ▶', 26, 254, 14, mono, 400, 0.08, 'left', '#FFFFFF'); spaced(ctx, 'SP  0:04:44', 26, 272, 11, mono, 400, 0.08, 'left', hexA('#FFFFFF', 0.85)); spaced(ctx, 'A  E  S  T  H  E  T  I  C', 195, 528, 8, mono, 400, 0.1, 'center', hexA('#FFFFFF', 0.9)); }
  ctx.save(); ctx.globalAlpha = 0.06 * k.texture; ctx.fillStyle = '#FFFFFF'; for (let y = 0; y < Hl; y += 4) ctx.fillRect(0, y, 390, 1); ctx.restore();
  headline2(ctx, th, phraseIdx, 195, 652, 330, 46, '#FFFFFF', (draw, fs) => { const ph = th.phrases[phraseIdx % th.phrases.length]; const dd = th.fonts.display, dw = dispWeight(dd); ctx.save(); ctx.translate(3, 3); spaced(ctx, th.upper ? ph[0].toUpperCase() : ph[0], 195, 652, fs, dd, dw, 0, 'center', cyan); spaced(ctx, th.upper ? ph[1].toUpperCase() : ph[1], 195, 652 + fs * 1.06, fs, dd, dw, 0, 'center', cyan); ctx.restore(); ctx.save(); ctx.shadowColor = pink; ctx.shadowBlur = 12 * k.glow; draw(); ctx.restore(); });
  spaced(ctx, T.sub || '', 195, 754, 12, mono, 400, 0.04, 'center', hexA(c.ink, 0.92));
  if (k.details) spaced(ctx, T.foot || '', 195, Hl - 30, 10, mono, 400, 0.12, 'center', hexA(c.ink, 0.75));
}

// NEON DISTRICT lock: a hyper-capitalist megacity. Holo-koi, megatowers, a corporate billboard, a patrol spinner, the crowd below.
function drawNeonLock(ctx, th, Hl, phraseIdx) {
  const c = th.colors, T = th.text, mono = th.fonts.mono, disp = th.fonts.display, dw = dispWeight(disp), k = K(th), pink = c.accent, cyan = c.glow, yel = c.alert || '#FCEE0A', r = rng(seedOf(th, 7741 + phraseIdx));
  const neon = (draw, col, blur) => { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = (blur || 14) * k.glow; draw(); ctx.restore(); };
  const g = ctx.createLinearGradient(0, 0, 0, Hl); g.addColorStop(0, c.ground); g.addColorStop(0.55, hexA(c.panel, 1)); g.addColorStop(0.8, hexA(pink, 0.22)); g.addColorStop(1, c.ground); ctx.fillStyle = g; ctx.fillRect(0, 0, 390, Hl);
  // far megatowers, all the way up, with aircraft lights
  for (let i = 0; i < 14; i++) { const x = -10 + i * 30 + r() * 14, w = 22 + r() * 30, top = 90 + r() * 240; ctx.fillStyle = hexA(cyan, 0.035 + r() * 0.04); ctx.fillRect(x, top, w, Hl); for (let j = 0; j < 40; j++) { ctx.fillStyle = hexA(r() > 0.75 ? pink : r() > 0.5 ? yel : cyan, 0.2 + r() * 0.35); ctx.fillRect(x + 2 + r() * (w - 4), top + 6 + r() * 560, 1.6, 1.2); } ctx.fillStyle = hexA('#FF3B3B', 0.8); ctx.fillRect(x + w / 2 - 1, top - 3, 2, 2); }
  const fog = (y, h, col, a) => { const fg = ctx.createLinearGradient(0, y, 0, y + h); fg.addColorStop(0, hexA(col, 0)); fg.addColorStop(0.5, hexA(col, a)); fg.addColorStop(1, hexA(col, 0)); ctx.fillStyle = fg; ctx.fillRect(0, y, 390, h); };
  fog(250, 160, cyan, 0.07); fog(560, 160, pink, 0.1);
  // a giant holographic koi swimming between the towers
  ctx.save(); ctx.globalAlpha = 0.75; ctx.shadowColor = cyan; ctx.shadowBlur = 12 * k.glow; ctx.strokeStyle = hexA(cyan, 0.85); ctx.lineWidth = 1.4;
  const KX = 200, KY = 318; ctx.beginPath(); ctx.moveTo(KX - 120, KY + 20); ctx.bezierCurveTo(KX - 70, KY - 40, KX + 40, KY - 52, KX + 104, KY - 6); ctx.bezierCurveTo(KX + 60, KY + 30, KX - 40, KY + 44, KX - 120, KY + 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(KX - 118, KY + 20); ctx.lineTo(KX - 158, KY - 8); ctx.lineTo(KX - 146, KY + 22); ctx.lineTo(KX - 160, KY + 50); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(KX - 10, KY - 40); ctx.quadraticCurveTo(KX + 10, KY - 72, KX + 40, KY - 44); ctx.stroke(); ctx.beginPath(); ctx.moveTo(KX + 30, KY + 26); ctx.quadraticCurveTo(KX + 20, KY + 56, KX - 6, KY + 34); ctx.stroke();
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(KX - 70 + i * 26, KY - 10 + j * 18, 9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
  ctx.fillStyle = hexA(pink, 0.8); ctx.beginPath(); ctx.arc(KX + 78, KY - 12, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = hexA(pink, 0.6); ctx.beginPath(); ctx.moveTo(KX + 96, KY - 2); ctx.quadraticCurveTo(KX + 112, KY + 8, KX + 118, KY + 22); ctx.stroke();
  for (let y = KY - 60; y < KY + 60; y += 3) { ctx.fillStyle = hexA(c.ground, 0.25); ctx.fillRect(KX - 170, y, 300, 1); } ctx.restore();
  // near megatowers framing the street, faced with signage
  ctx.fillStyle = hexA(c.ground, 0.95); ctx.fillRect(0, 170, 96, Hl); ctx.fillRect(296, 150, 94, Hl);
  ctx.strokeStyle = hexA(cyan, 0.12); ctx.lineWidth = 0.8; for (let y = 180; y < 760; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(96, y); ctx.moveTo(296, y - 8); ctx.lineTo(390, y - 8); ctx.stroke(); }
  // an LED ticker crawling across the right tower
  ctx.fillStyle = hexA('#000000', 0.7); ctx.fillRect(296, 176, 94, 16); ctx.save(); ctx.beginPath(); ctx.rect(296, 176, 94, 16); ctx.clip(); neon(() => spaced(ctx, '▲ OMNIGEN +4.2%  ▼ RENT +12%  ▼ AIR TAX +3%', 300, 188, 8, mono, 400, 0.04, 'left', yel), yel, 6); ctx.restore();
  // vertical signs in an invented script, and English ones
  const vsign = (x, y, w, n, col, seed) => { const h = n * w * 0.9 + 12; ctx.fillStyle = hexA(c.ground, 0.9); ctx.fillRect(x, y, w, h); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.strokeRect(x, y, w, h); fauxText(ctx, x + w * 0.2, y + 8, n, w * 0.6 / 1.0 * 0.95, seed, col, true); }, col, 10); };
  vsign(14, 232, 30, 5, pink, 11); vsign(56, 300, 26, 4, yel, 23); vsign(348, 214, 30, 6, cyan, 37); vsign(308, 330, 24, 4, pink, 51);
  const hsign = (txt, x, y, col, sz) => { ctx.font = `700 ${sz}px "${disp}", Georgia, sans-serif`; const tw = ctx.measureText(txt).width + 16; ctx.fillStyle = hexA(c.ground, 0.88); ctx.fillRect(x - tw / 2, y - sz - 3, tw, sz + 9); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.strokeRect(x - tw / 2, y - sz - 3, tw, sz + 9); spaced(ctx, txt, x, y + 1, sz, disp, dw, 0.04, 'center', col); }, col, 8); };
  hsign('PREMIUM AIR', 344, 466, cyan, 7.5); hsign('14.99/HR', 344, 484, cyan, 7); hsign('DEBT RELIEF*', 44, 466, yel, 7); hsign('SLEEP PODS', 44, 556, pink, 7.5); hsign('CHROME', 344, 556, yel, 8.5);
  // the corporate billboard, carrying the headline
  centerXform(ctx, th, 195, 520, () => {
    const bx = 88, by = 410, bw = 214, bh = 150;
    ctx.fillStyle = hexA(c.ink, 0.25); ctx.fillRect(bx + 20, by + bh, 4, 26); ctx.fillRect(bx + bw - 24, by + bh, 4, 26); seg(ctx, bx, by + 20, 96, by + 4, hexA(c.ink, 0.3), 2); seg(ctx, bx + bw, by + 20, 296, by + 4, hexA(c.ink, 0.3), 2);
    ctx.fillStyle = hexA(c.ground, 0.92); ctx.fillRect(bx, by, bw, bh);
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); const bg2 = ctx.createLinearGradient(bx, by, bx + bw, by + bh); bg2.addColorStop(0, hexA(pink, 0.28)); bg2.addColorStop(1, hexA(cyan, 0.18)); ctx.fillStyle = bg2; ctx.fillRect(bx, by, bw, bh); for (let y = by; y < by + bh; y += 3) { ctx.fillStyle = hexA(c.ground, 0.25); ctx.fillRect(bx, y, bw, 1); } ctx.restore();
    neon(() => { ctx.strokeStyle = pink; ctx.lineWidth = 2.4; ctx.strokeRect(bx, by, bw, bh); }, pink, 16);
    spaced(ctx, 'OMNIGEN', bx + 12, by + 18, 9, disp, dw, 0.12, 'left', c.ink); spaced(ctx, 'YOU ARE THE PRODUCT', bx + bw - 12, by + 18, 6, mono, 400, 0.1, 'right', hexA(c.ink, 0.75));
    headline2(ctx, th, phraseIdx, 195, by + 64, bw - 24, 30, c.ink, (draw, fs) => { const ph = th.phrases[phraseIdx % th.phrases.length]; ctx.save(); ctx.translate(2.2, 1); ctx.globalAlpha = 0.75; spaced(ctx, ph[0].toUpperCase(), 195, by + 64, fs, disp, dw, 0, 'center', cyan); spaced(ctx, ph[1].toUpperCase(), 195, by + 64 + fs * 1.06, fs, disp, dw, 0, 'center', cyan); ctx.restore(); ctx.save(); ctx.shadowColor = pink; ctx.shadowBlur = 14 * k.glow; draw(); ctx.restore(); });
    spaced(ctx, T.sub || '', 195, by + bh - 14, 6.8, mono, 400, 0.04, 'center', hexA(c.ink, 0.8));
  });
  // a patrol spinner with a searchlight on the crowd
  const PX = 236, PY = 258; const beam = ctx.createLinearGradient(PX, PY, PX - 40, 760); beam.addColorStop(0, hexA('#DDF6FF', 0.28)); beam.addColorStop(1, hexA('#DDF6FF', 0)); ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(PX - 4, PY + 6); ctx.lineTo(PX + 6, PY + 6); ctx.lineTo(PX + 40, 760); ctx.lineTo(PX - 110, 760); ctx.closePath(); ctx.fill();
  ctx.fillStyle = hexA(c.ink, 0.85); ctx.beginPath(); ctx.moveTo(PX - 26, PY); ctx.lineTo(PX + 14, PY - 6); ctx.lineTo(PX + 30, PY + 2); ctx.lineTo(PX + 14, PY + 8); ctx.lineTo(PX - 26, PY + 8); ctx.closePath(); ctx.fill();
  neon(() => { ctx.fillStyle = '#FF3B3B'; ctx.fillRect(PX - 12, PY - 5, 6, 3); }, '#FF3B3B', 12); neon(() => { ctx.fillStyle = '#3B8BFF'; ctx.fillRect(PX - 4, PY - 6, 6, 3); }, '#3B8BFF', 12);
  if (k.details) spaced(ctx, 'COMPLIANCE UNIT 7', PX + 34, PY + 6, 6, mono, 400, 0.14, 'left', hexA(c.ink, 0.6));
  // street level: wet reflections and the crowd under glowing umbrellas
  ctx.fillStyle = hexA(c.ground, 0.94); ctx.fillRect(0, 640, 390, Hl - 640);
  ctx.save(); ctx.globalAlpha = 0.3; [[195, 652, pink, 250], [48, 672, yel, 70], [342, 676, cyan, 80]].forEach(([x, y, col, w]) => { const rg = ctx.createLinearGradient(0, y, 0, y + 70); rg.addColorStop(0, hexA(col, 0.8)); rg.addColorStop(1, hexA(col, 0)); ctx.fillStyle = rg; for (let i = 0; i < 8; i++) ctx.fillRect(x - w / 2 + (r() - 0.5) * 6, y + i * 8, w * (1 - i * 0.09), 2.5); }); ctx.restore();
  const umb = (x, y, s, col) => { ctx.fillStyle = hexA(c.ink, 0.12); ctx.fillRect(x - 5 * s, y, 10 * s, 40 * s); ctx.beginPath(); ctx.arc(x, y + 4 * s, 6 * s, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hexA(col, 0.25); ctx.beginPath(); ctx.arc(x, y, 26 * s, Math.PI, 0); ctx.closePath(); ctx.fill(); neon(() => { ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(x, y, 26 * s, Math.PI, 0); ctx.stroke(); seg(ctx, x, y - 26 * s, x, y + 14 * s, col, 1.4); }, col, 12); };
  [[52, 704, 1, cyan], [128, 718, 0.85, pink], [206, 706, 1.05, yel], [282, 722, 0.8, cyan], [346, 708, 0.95, pink], [92, 746, 0.7, yel], [246, 750, 0.75, pink]].forEach(([x, y, s, col]) => umb(x, y, s, col));
  ctx.strokeStyle = hexA(cyan, 0.2 * k.texture + 0.06); ctx.lineWidth = 0.8; for (let i = 0; i < 170; i++) { const x = r() * 420, y = r() * Hl, l = 10 + r() * 22; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.25, y + l); ctx.stroke(); }
  if (k.details) { spaced(ctx, T.tagL || '', 24, 230, 7.5, mono, 400, 0.14, 'left', hexA(cyan, 0.9)); spaced(ctx, T.tagR || '', 366, 230, 7.5, mono, 400, 0.14, 'right', pink); spaced(ctx, '*NOT GUARANTEED', 44, 484, 5.5, mono, 400, 0.08, 'center', hexA(yel, 0.75)); spaced(ctx, T.foot || '', 195, Hl - 34, 7, mono, 400, 0.2, 'center', hexA(c.ink, 0.6)); }
  neonGlitch(ctx, r, Hl, Math.round(5 * k.texture));
}
