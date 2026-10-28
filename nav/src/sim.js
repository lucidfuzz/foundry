// Drive simulator: replays a route as GPS fixes at the speeds the route service expects, slowing for turns.
// Used by the app (?sim=1) and the tests. detour { at, length, turn } leaves the route at `at` meters and drives `length`
// meters at `turn` degrees from the road (default 90, a wrong right turn), to test off-route detection and rerouting.
function navSim(route, { noise = 0, detour = null, seed = 7, start = 0, time = 0 } = {}) {
  const { coords, cum, steps, length } = route;
  let along = start, t = time, s = seed >>> 0 || 7, off = null;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const jitter = () => (rnd() + rnd() + rnd() - 1.5) * noise;
  const speedAt = d => {
    let i = 0; while (i + 1 < steps.length && steps[i + 1].start <= d) i++;
    const st = steps[i], v = st.duration > 0 ? st.distance / st.duration : 10;
    const next = steps[i + 1], gap = next ? next.start - d : Infinity;
    const sharp = next && /turn|end of road|roundabout|rotary|fork|off ramp/.test(next.type) && next.modifier !== 'straight';
    return Math.max(2, sharp ? Math.min(v, 4 + gap * 0.25) : v);
  };
  return {
    get along() { return along; },
    get done() { return off ? off.left <= 0 : along >= length; },
    // Advance dt seconds and return a fix (null once the drive or detour is over).
    next(dt = 1) {
      t += dt * 1000;
      let pt, brg, v;
      if (off) {
        if (off.left <= 0) return null;
        v = off.v; const d = Math.min(off.left, v * dt); off.left -= d;
        off.pt = navOffset(off.pt, off.brg, d); pt = off.pt; brg = off.brg;
      } else {
        if (along >= length) return null;
        v = speedAt(along); along = Math.min(length, along + v * dt);
        const a = navAlong(coords, cum, along); pt = a.pt; brg = a.bearing;
        if (detour && along >= detour.at) { off = { pt, brg: (brg + (detour.turn == null ? 90 : detour.turn) + 360) % 360, v, left: detour.length }; detour = null; }
      }
      if (noise) pt = navOffset(navOffset(pt, 0, jitter()), 90, jitter());
      return { coord: pt, accuracy: Math.max(5, noise * 2), speed: v, heading: brg, time: t };
    }
  };
}
