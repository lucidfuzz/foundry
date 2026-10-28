// Turn-by-turn guidance. Feed it GPS fixes; it reports progress and the moments to speak.
// A fix is { coord: [lon, lat], accuracy (m), speed (m/s or null), heading (deg or null), time (ms) }.
// Events, in the order they should be spoken:
//   depart   once, at the first fix (unless this guide replaces a route after a reroute)
//   continue just after a maneuver when the next one is far away ("Continue on Main Street for 2 miles")
//   early    the heads-up ("In 500 feet, turn left onto Oak Street")
//   now      at the maneuver ("Turn left onto Oak Street"), with `then` when the following one comes right after
//   arrive   once, at the destination
//   offroute when the fixes leave the route (the app fetches a new route and starts a new guide)
//   cruise   a quiet moment on a long stretch, for the world's voice (only if opts.cruiseEvery is set)
const NAV_PROFILE = {
  car: { min: 6, early: [250, 2000], now: [40, 250], then: 150, off: 40, arrive: 30 },
  bike: { min: 3, early: [100, 500], now: [20, 60], then: 60, off: 30, arrive: 15 },
  foot: { min: 1.2, early: [50, 200], now: [12, 30], then: 30, off: 25, arrive: 12 }
};
const navClamp = (v, [a, b]) => Math.max(a, Math.min(b, v));

function navGuide(route, opts = {}) {
  const P = NAV_PROFILE[opts.profile] || NAV_PROFILE.car;
  const { coords, cum, steps, length } = route;
  const announceDepart = opts.announceDepart !== false, cruiseEvery = opts.cruiseEvery || Infinity;
  const fired = new Set(), on = (k, stage) => fired.has(`${k}:${stage}`), mark = (k, stage) => fired.add(`${k}:${stage}`);
  let hint = null, offCount = 0, offRoute = false, arrived = false, started = false, lastSpoken = null, last = null;
  const durationScale = (() => { const sum = steps.reduce((a, s) => a + s.duration, 0); return sum > 0 && route.duration ? route.duration / sum : 1; })();

  const stepAt = along => { let i = 0; while (i + 1 < steps.length && steps[i + 1].start <= along + 0.5) i++; return i; };
  const timeLeft = (along, cur) => {
    const s = steps[cur], end = steps[cur + 1] ? steps[cur + 1].start : length, span = Math.max(1, end - s.start);
    let t = s.duration * Math.max(0, Math.min(1, (end - along) / span));
    for (let i = cur + 1; i < steps.length; i++) t += steps[i].duration;
    return t * durationScale;
  };
  // The step right after k, if it comes so soon that both should be said together.
  const thenAfter = (k, nowDist) => {
    const a = steps[k], b = steps[k + 1];
    if (!a || !b || a.type === 'arrive') return null;
    if (b.type === 'arrive' && !/left|right/.test(b.modifier)) return null;
    return b.start - a.start <= Math.max(P.then, nowDist * 1.5) ? b : null;
  };

  function update(fix) {
    const events = [], t = fix.time != null ? fix.time : Date.now();
    if (arrived) return Object.assign({}, last, { events });
    const snap = navSnap(fix.coord, coords, cum, hint);
    const threshold = P.off + Math.min(fix.accuracy || 0, 60);
    const wrongWay = fix.speed > 3 && fix.heading != null && Math.abs(navTurn(snap.bearing, fix.heading)) > 135 && snap.dist > P.off / 2;
    offCount = snap.dist > threshold || wrongWay ? offCount + 1 : 0;
    if (offCount >= 2 || snap.dist > threshold * 3) {
      if (!offRoute) events.push({ type: 'offroute', coord: fix.coord, heading: fix.heading });
      offRoute = true;
      return (last = Object.assign({}, last || {}, { offRoute: true, events, coord: fix.coord }));
    }
    offRoute = false;
    hint = snap.idx;
    const along = snap.along, cur = stepAt(along), k = cur + 1, next = steps[k];
    const distToNext = next ? Math.max(0, next.start - along) : 0, distLeft = Math.max(0, length - along);
    const ownSpeed = steps[cur].duration > 0 ? steps[cur].distance / steps[cur].duration : P.min * 2;
    const v = Math.max(P.min, Math.min(40, fix.speed > 0.5 ? fix.speed : ownSpeed));
    const earlyDist = navClamp(v * 60, P.early), nowDist = navClamp(v * 7 + 15, P.now);

    if (!started) {
      started = true;
      if (announceDepart) {
        const ev = { type: 'depart', step: steps[0] };
        if (next && distToNext <= earlyDist * 3 && next.type !== 'arrive') {
          ev.next = next; ev.nextDist = distToNext; ev.nextNow = distToNext <= nowDist;
          mark(k, 'early'); if (ev.nextNow) mark(k, 'now');
        }
        events.push(ev);
      } else mark(k, 'continue');
      mark(0, 'continue');
    }
    if (next && distLeft > P.arrive) {
      if (!on(k, 'continue') && !on(k, 'early') && cur > 0 && along - steps[cur].start < 150 && distToNext > earlyDist * 2 + 300) {
        events.push({ type: 'continue', step: steps[cur], dist: distToNext }); mark(k, 'continue');
      }
      if (distToNext <= nowDist && !on(k, 'now') && next.type !== 'arrive') {
        const then = thenAfter(k, nowDist);
        events.push({ type: 'now', step: next, then, dist: distToNext }); mark(k, 'now'); mark(k, 'early');
        if (then) { mark(k + 1, 'early'); mark(k + 1, 'continue'); }
      } else if (distToNext <= earlyDist && distToNext > nowDist * 1.5 && !on(k, 'early') && !on(k, 'now')) {
        const then = next.type === 'arrive' ? null : thenAfter(k, nowDist);
        events.push({ type: 'early', step: next, then, dist: distToNext }); mark(k, 'early');
      }
    }
    if (distLeft <= P.arrive || (cur === steps.length - 1 && steps[cur].type === 'arrive')) {
      arrived = true;
      events.push({ type: 'arrive', step: steps[steps.length - 1] });
    }
    if (events.length) lastSpoken = t;
    else if (lastSpoken != null && t - lastSpoken >= cruiseEvery * 1000 && distToNext / v >= 60 && (fix.speed == null || fix.speed > 1)) {
      events.push({ type: 'cruise' }); lastSpoken = t;
    }
    last = {
      along, coord: fix.coord, snapped: snap.pt, bearing: snap.bearing, offset: snap.dist, stepIndex: cur, step: steps[cur], next,
      distToNext, distLeft, timeLeft: timeLeft(along, cur), arrived, offRoute: false, speed: v, events
    };
    return last;
  }
  return { route, update, get arrived() { return arrived; } };
}
