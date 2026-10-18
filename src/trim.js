// Export trimming: each exported widget script keeps only the code its theme and edition can reach.
// The plan is made at build time by scripts/trim.cjs (which also runs this same function to check every result parses).
// Any mismatch or surprise falls back to the full template, so exports never fail because of trimming.
function trimScript(tpl, plan, T) {
  try {
    if (!plan || plan.v !== 1 || plan.len !== tpl.length || !T) return tpl;
    const on = ['hbOn', 'drOn', 'dzOn', 'wrOn', 'lrfOn'].filter(f => T[f]);
    if (on.length > 1) return tpl;
    const frame = T.frame, bits = typeof frame === 'string' && plan.keys[frame + '|' + (on[0] || '')];
    if (!bits) return tpl;
    const kept = i => (parseInt(bits[i >> 2], 16) >> (i & 3)) & 1;
    // statement boundaries, stored as gaps and lengths
    const st = []; let p = 0;
    for (let i = 0; i < plan.st.length; i += 2) { const s = p + plan.st[i], e = s + plan.st[i + 1]; st.push([s, e]); p = e; }
    const lit = {}; for (const l of plan.lit) lit[l.i] = l;
    const piece = i => {
      const [s, e] = st[i], l = lit[i];
      if (!l) return tpl.slice(s, e);
      const pr = l.p[frame];
      return tpl.slice(s, l.o) + (pr ? ' ' + tpl.slice(pr[0], pr[1]) + ' ' : '') + tpl.slice(l.c, e);
    };
    // Neighbouring kept statements are copied with the text between them; separate runs are joined with ';\n'
    let out = tpl.slice(0, st.length ? st[0][0] : tpl.length), run = null;
    for (let i = 0; i < st.length; i++) {
      if (!kept(i)) { if (run !== null) { out += run + ';\n'; run = null; } continue; }
      run = run === null ? piece(i) : run + tpl.slice(st[i - 1][1], st[i][0]) + piece(i);
    }
    if (run !== null) out += run + '\n';
    return out;
  } catch (e) { return tpl; }
}
