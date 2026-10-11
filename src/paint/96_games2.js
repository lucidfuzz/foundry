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
