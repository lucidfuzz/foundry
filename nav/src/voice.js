// Plain instructions (what the banner shows and the voice always says first) and the world's voice layered after them.
const NAV_ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function navRoad(s, speech) {
  if (s.name && s.ref && !speech) return `${s.name} (${s.ref.split(';')[0]})`;
  return s.name || (s.ref ? s.ref.split(';')[0] : '');
}
// "I 5: Seattle, Portland" -> "Seattle" (speech keeps it short; the banner may show two).
function navToward(s, max = 1) {
  if (!s.destinations) return '';
  const names = s.destinations.split(':').pop().split(',').map(x => x.trim()).filter(Boolean);
  return names.slice(0, max).join(', ');
}
function navSide(mod) { return /left/.test(mod) ? 'left' : /right/.test(mod) ? 'right' : ''; }
// Icon key for a step, used by the banner arrow and the route preview.
function navIcon(s) {
  const side = navSide(s.modifier), m = s.modifier;
  if (s.type === 'arrive') return 'arrive';
  if (s.type === 'depart') return 'straight';
  if (/roundabout|rotary/.test(s.type) && s.type !== 'roundabout turn') return 'roundabout';
  if (m === 'uturn') return 'uturn';
  if (s.type === 'merge') return side ? `merge-${side}` : 'straight';
  if (s.type === 'fork' || s.type === 'on ramp' || s.type === 'off ramp') return side ? `slight-${side}` : 'straight';
  if (!m || m === 'straight') return 'straight';
  return m.replace(' ', '-');
}
// The plain instruction for a step: { verb, road, text }. verb is the action, road what follows ("onto Main Street").
function navInstruction(s, speech = false) {
  const road = navRoad(s, speech), toward = navToward(s, speech ? 1 : 2), side = navSide(s.modifier), m = s.modifier;
  const onto = road ? `onto ${road}` : '', on = road ? `on ${road}` : '';
  const dir = toward ? `toward ${toward}` : onto;
  let verb, rest = onto;
  const turnVerb = () => m === 'uturn' ? 'Make a U-turn' : m === 'straight' || !m ? 'Continue straight' : /slight/.test(m) ? `Bear ${side}` : /sharp/.test(m) ? `Turn sharp ${side}` : `Turn ${side}`;
  switch (s.type) {
    case 'depart': verb = `Head ${navCardinal(s.bearingAfter)}`; rest = on; break;
    case 'arrive': verb = side ? `Your destination will be on the ${side}` : 'You will reach your destination'; rest = ''; break;
    case 'end of road': verb = `At the end of the road, ${turnVerb().toLowerCase()}`; break;
    case 'new name': verb = 'Continue'; break;
    case 'continue': verb = m === 'uturn' ? 'Make a U-turn' : /left|right/.test(m) ? `Keep ${side}` : 'Continue straight'; break;
    case 'merge': verb = side ? `Merge ${side}` : 'Merge'; break;
    case 'on ramp': verb = side ? `Take the ramp on the ${side}` : 'Take the ramp'; rest = dir; break;
    case 'off ramp': verb = s.exits ? `Take exit ${s.exits.split(';')[0]}` : side ? `Take the exit on the ${side}` : 'Take the exit'; rest = dir; break;
    case 'fork': verb = side ? `Keep ${side} at the fork` : 'Keep straight at the fork'; rest = dir; break;
    case 'roundabout': case 'rotary': {
      const at = s.type === 'rotary' && s.rotary ? `At ${s.rotary}` : 'At the roundabout';
      verb = s.exit ? `${at}, take the ${NAV_ORDINALS[s.exit - 1] || `number ${s.exit}`} exit` : `Enter the roundabout`;
      break;
    }
    case 'roundabout turn': verb = `At the roundabout, ${turnVerb().toLowerCase()}`; break;
    case 'exit roundabout': case 'exit rotary': verb = 'Exit the roundabout'; break;
    case 'use lane': verb = side ? `Use the ${side} lane` : 'Continue straight'; rest = ''; break;
    default: verb = s.type === 'turn' ? turnVerb() : 'Continue';
  }
  return { verb, road: rest, text: rest ? `${verb} ${rest}` : verb };
}
const navLowerFirst = t => t.charAt(0).toLowerCase() + t.slice(1);

// Deterministic no-repeat rotation: every line is used once before any repeats, and a reshuffle never starts with the line
// that just played. seed keeps a trip's order stable (and testable).
function navPool(lines, seed = 1) {
  let s = (seed >>> 0) || 1, order = [], last = null;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  return () => {
    if (!lines.length) return '';
    if (!order.length) {
      order = lines.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      if (order.length > 1 && lines[order[0]] === last) order.push(order.shift());
    }
    return (last = lines[order.shift()]);
  };
}

// A trip's voice. style: 'plain' (directions only), 'light' (default: world lines at start, arrival, reroutes and now and
// then on long quiet stretches) or 'full' (also a short tag after most turns). Returns the words to say for each event.
function navVoice(theme, style = 'light', seed = 1) {
  const v = NAV_VOICES[theme.id] || NAV_VOICES.halcyon;
  const slogans = (theme.slogans || []).map(([t, dept]) => `${t.replace(/[.!]+$/, '')}. ${dept.replace(/\s*\/\/\s*/g, ', ').replace(/\(([^)]*)\)/g, '$1').toLowerCase()}.`);
  const pools = {
    depart: navPool(v.depart, seed), arrive: navPool(v.arrive, seed + 1), reroute: navPool(v.reroute, seed + 2),
    cruise: navPool(v.cruise.concat(slogans), seed + 3), tags: navPool(v.tags, seed + 4)
  };
  let turns = 0;
  const flavor = k => style === 'plain' ? '' : pools[k]();
  return {
    voice: v, style,
    // ev: an event from navGuide (see guidance.js); units: 'imperial' | 'metric'. Returns { text, flavor }: text is everything
    // to say; flavor is just the world's line (shown on screen too), empty in Plain.
    say(ev, units) {
      const s = ev.step, ins = s && navInstruction(s, true);
      const thenPart = ev.then ? `, then ${navLowerFirst(navInstruction(ev.then, true).text)}` : '';
      const out = (plain, fl = '') => ({ text: [plain, fl].filter(Boolean).join(' '), flavor: fl });
      switch (ev.type) {
        case 'depart': {
          const next = ev.next && navLowerFirst(navInstruction(ev.next, true).text);
          const lead = ev.nextNow ? `${ins.text}, then ${next}.` : `${ins.text}.${next ? ` In ${navFmtDistance(ev.nextDist, units).speech}, ${next}.` : ''}`;
          return out(lead, flavor('depart'));
        }
        case 'continue': return out(`Continue${ins.road ? ` ${ins.road.replace(/^onto /, 'on ')}` : ''} for ${navFmtDistance(ev.dist, units).speech}.`);
        case 'early': return out(`In ${navFmtDistance(ev.dist, units).speech}, ${navLowerFirst(ins.text)}${thenPart}.`);
        case 'now': turns++; return out(`${ins.text}${thenPart}.`, style === 'full' && turns % 2 === 1 ? flavor('tags') : '');
        case 'arrive': { const side = navSide(s.modifier); return out(`You have arrived.${side ? ` Your destination is on the ${side}.` : ''}`, flavor('arrive')); }
        case 'reroute': return style === 'plain' ? out('Rerouting.') : out('', flavor('reroute'));
        case 'cruise': return out('', flavor('cruise'));
        default: return out('');
      }
    }
  };
}

// Speech through the browser. Speaking must first be unlocked by a tap (iPhone), so the Start button calls unlock().
function navSpeaker() {
  const synth = typeof speechSynthesis !== 'undefined' ? speechSynthesis : null;
  let muted = false, rate = 1, pitch = 1;
  const pick = () => { const vs = synth.getVoices(), lang = (navigator.language || 'en-US'); return vs.find(v => v.lang === lang && v.localService) || vs.find(v => v.lang && v.lang.startsWith('en') && v.localService) || null; };
  return {
    available: !!synth,
    set(opts) { if (opts.muted != null) muted = opts.muted; if (opts.rate) rate = opts.rate; if (opts.pitch) pitch = opts.pitch; },
    unlock() { if (!synth) return; const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); },
    say(text, urgent = false) {
      if (!synth || muted || !text) return;
      if (urgent) synth.cancel();
      const u = new SpeechSynthesisUtterance(text); u.rate = rate; u.pitch = pitch;
      const v = pick(); if (v) u.voice = v;
      synth.speak(u);
    },
    stop() { if (synth) synth.cancel(); }
  };
}
