// Export trimming plan (build time only; called by scripts/build.cjs).
// Every theme's widget script used to carry every theme's drawing code. This works out, for each centerpiece frame and
// edition, which top-level statements of the widget template can actually run, so src/trim.js can export only those.
//
// How it decides (all static, nothing is executed):
// - Statements that run when the script loads (calls, ifs, assignments) are always kept, with everything they use.
// - A function, class or constant is kept only if kept code refers to it.
// - "Root.key = value" statements that only attach a value to a top-level object are kept only when that object is.
// - Edition flags (T.hbOn, T.drOn, T.dzOn, T.wrOn, T.lrfOn) are fixed in an exported script, so code behind a flag that
//   is off is never reached. The code itself is not rewritten: it stays, it just can't run.
// - THEME_PAINT and GAMES are read only with the current frame (THEME_PAINT[T.frame], GAMES[f] where f is T.frame), so
//   they are narrowed to that one entry. Their other entries name other themes' painters, which would fail to load.
// Every trimmed script is parsed again before the build succeeds, and tests/export-trim.test.cjs runs full and trimmed
// scripts side by side for every theme, edition, widget and size.
const fs = require('node:fs');
const path = require('node:path');
const acorn = require('./vendor/acorn.js');

const FLAGS = ['hbOn', 'drOn', 'dzOn', 'wrOn', 'lrfOn'];
const FRAMES = ['halcyon', 'directive', 'longroad', 'nightfall', 'grimoire', 'deeprange', 'rabbit', 'cyber', 'market', 'vapor', 'nature'];
const NARROW = new Set(['THEME_PAINT', 'GAMES']);
const PARSE = { ecmaVersion: 'latest', sourceType: 'script', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true };
const parse = text => acorn.parse(text.replace('__THEME__', '({     })'), PARSE); // same length, so offsets match

function children(n) {
  const out = [];
  for (const k in n) {
    if (k === 'type' || k === 'start' || k === 'end') continue;
    const v = n[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') out.push(c); }
    else if (v && typeof v.type === 'string') out.push(v);
  }
  return out;
}
const isFn = n => /Function/.test(n.type);
// Does this code do anything when it is evaluated at load (outside function bodies)?
function runsSomething(n) {
  if (!n || isFn(n)) return false;
  if (['CallExpression', 'NewExpression', 'AwaitExpression', 'AssignmentExpression', 'UpdateExpression', 'TaggedTemplateExpression', 'YieldExpression'].includes(n.type)) return true;
  if (n.type === 'UnaryExpression' && n.operator === 'delete') return true;
  if (n.type === 'ClassExpression' || n.type === 'ClassBody') return true; // be cautious with class bodies
  return children(n).some(runsSomething);
}
function patNames(p, out) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => patNames(q.value || q.argument, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(e => patNames(e, out));
  else if (p.type === 'RestElement') patNames(p.argument, out);
  else if (p.type === 'AssignmentPattern') patNames(p.left, out);
  return out;
}

function makePlan(tpl, trimScript) {
  const stmts = parse(tpl).body;
  const declared = new Map();
  const names = stmts.map((s, i) => {
    const n = s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration' ? [s.id.name]
      : s.type === 'VariableDeclaration' ? s.declarations.flatMap(d => patNames(d.id, [])) : [];
    for (const x of n) (declared.get(x) || declared.set(x, []).get(x)).push(i);
    return n;
  });
  const isT = (e, f) => e.type === 'MemberExpression' && !e.computed && e.object.type === 'Identifier' && e.object.name === 'T' && e.property.name === f;
  function fold(e, K) {
    if (!e) return undefined;
    if (e.type === 'MemberExpression') { for (const f of FLAGS) if (isT(e, f)) return !!K[f]; return undefined; }
    if (e.type === 'UnaryExpression' && e.operator === '!') { const v = fold(e.argument, K); return v === undefined ? undefined : !v; }
    if (e.type === 'LogicalExpression') {
      const a = fold(e.left, K), b = fold(e.right, K);
      if (e.operator === '&&') return a === false || b === false ? false : a === true && b === true ? true : undefined;
      if (e.operator === '||') return a === true || b === true ? true : a === false && b === false ? false : undefined;
      return undefined;
    }
    if (e.type === 'BinaryExpression' && (e.operator === '===' || e.operator === '!==')) {
      let lit = null;
      if (isT(e.left, 'frame') && e.right.type === 'Literal') lit = e.right.value;
      else if (isT(e.right, 'frame') && e.left.type === 'Literal') lit = e.left.value;
      if (lit !== null) { const eq = lit === K.frame; return e.operator === '===' ? eq : !eq; }
    }
    return undefined;
  }
  // Names of top-level declarations this code can reach under key K.
  function refs(node, K) {
    const out = new Set();
    const visit = n => {
      if (!n || typeof n.type !== 'string') return;
      if (n.type === 'IfStatement' || n.type === 'ConditionalExpression') {
        const v = fold(n.test, K);
        if (v === true) { visit(n.test); visit(n.consequent); return; }
        if (v === false) { visit(n.test); visit(n.alternate); return; }
      }
      if (n.type === 'LogicalExpression') {
        const v = fold(n.left, K);
        if ((n.operator === '&&' && v === false) || (n.operator === '||' && v === true)) { visit(n.left); return; }
      }
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && NARROW.has(n.id.name) && n.init && n.init.type === 'ObjectExpression') {
        for (const p of n.init.properties) if (p.type === 'Property' && !p.computed && (p.key.name || p.key.value) === K.frame) visit(p.value);
        return;
      }
      if (n.type === 'Identifier') { if (declared.has(n.name)) out.add(n.name); return; }
      if (n.type === 'MemberExpression' && !n.computed) { visit(n.object); return; }
      if ((n.type === 'Property' || n.type === 'MethodDefinition' || n.type === 'PropertyDefinition') && !n.computed) { visit(n.value); return; }
      if (n.type === 'LabeledStatement') { visit(n.body); return; }
      if (n.type === 'BreakStatement' || n.type === 'ContinueStatement') return;
      children(n).forEach(visit);
    };
    visit(node);
    return out;
  }
  // "Root.key(.more) = value" with a side-effect-free value: kept only when Root is kept.
  function attachment(s) {
    if (s.type !== 'ExpressionStatement' || s.expression.type !== 'AssignmentExpression' || s.expression.operator !== '=') return null;
    let L = s.expression.left; if (L.type !== 'MemberExpression') return null;
    let first = L; while (first.object.type === 'MemberExpression') first = first.object;
    if (first.object.type !== 'Identifier' || !declared.has(first.object.name)) return null;
    for (let m = L; m.type === 'MemberExpression'; m = m.object) if (m.computed && m.property.type !== 'Literal') return null;
    if (runsSomething(s.expression.right)) return null;
    return { root: first.object.name, key: first.computed ? first.property.value : first.property.name };
  }
  const att = stmts.map(attachment);
  const atLoad = stmts.map((s, i) => {
    if (s.type === 'FunctionDeclaration' || s.type === 'EmptyStatement') return false;
    if (att[i]) return false;
    if (s.type === 'VariableDeclaration') return s.declarations.some(d => runsSomething(d.init));
    return true; // ifs, calls, classes and anything else that runs
  });
  const attachedTo = new Map(); // root name -> attachment statement indexes
  att.forEach((a, j) => { if (a) (attachedTo.get(a.root) || attachedTo.set(a.root, []).get(a.root)).push(j); });
  function keep(K) {
    const kept = new Set(), q = [];
    const pull = i => {
      if (kept.has(i)) return;
      kept.add(i); q.push(i);
      for (const nm of names[i]) for (const j of attachedTo.get(nm) || []) if (!NARROW.has(nm) || att[j].key === K.frame) pull(j);
    };
    atLoad.forEach((x, i) => x && pull(i));
    while (q.length) { const i = q.pop(); for (const nm of refs(stmts[i], K)) declared.get(nm).forEach(pull); }
    return kept;
  }
  // Narrowed tables: where their braces are and where each frame's entry is.
  const lit = [];
  stmts.forEach((s, i) => {
    if (s.type !== 'VariableDeclaration') return;
    const d = s.declarations.find(d => d.id.type === 'Identifier' && NARROW.has(d.id.name));
    if (!d) return;
    if (s.declarations.length !== 1 || !d.init || d.init.type !== 'ObjectExpression') throw new Error(`${d.id.name} must be a single plain object literal for export trimming`);
    const p = {};
    for (const pr of d.init.properties) {
      if (pr.type !== 'Property' || pr.computed) throw new Error(`${d.id.name} may only have plain keys for export trimming`);
      p[pr.key.name || pr.key.value] = [pr.start, pr.end];
    }
    lit.push({ i, o: d.init.start + 1, c: d.init.end - 1, p });
  });
  if (lit.length !== NARROW.size) throw new Error('export trimming expects THEME_PAINT and GAMES in the widget template');
  // Any other way of reading these tables would break narrowing, so refuse to build.
  const walkAll = (n, f) => { f(n); children(n).forEach(c => walkAll(c, f)); };
  stmts.forEach(s => walkAll(s, n => {
    if (n.type === 'MemberExpression' && n.object.type === 'Identifier' && NARROW.has(n.object.name) && n.computed) {
      const k = n.property;
      const ok = (k.type === 'MemberExpression' && isT(k, 'frame')) || (k.type === 'Identifier' && k.name === 'f');
      if (!ok) throw new Error(`export trimming: ${n.object.name}[...] must be read with T.frame or f`);
    }
  }));
  const st = []; let prev = 0;
  for (const s of stmts) { st.push(s.start - prev, s.end - s.start); prev = s.end; }
  const keys = {};
  for (const frame of FRAMES) for (const flag of ['', ...FLAGS]) {
    const K = { frame }; if (flag) K[flag] = true;
    const kept = keep(K);
    let hex = '';
    for (let i = 0; i < stmts.length; i += 4) {
      let v = 0; for (let b = 0; b < 4; b++) if (kept.has(i + b)) v |= 1 << b;
      hex += v.toString(16);
    }
    keys[frame + '|' + flag] = hex;
  }
  const plan = { v: 1, len: tpl.length, st, lit, keys };
  // Safety net: every trimmed script must parse and be smaller than the full one.
  for (const key of Object.keys(keys)) {
    const [frame, flag] = key.split('|'), T = { frame }; if (flag) T[flag] = true;
    const out = trimScript(tpl, plan, T);
    if (out === tpl) throw new Error(`export trimming produced no trim for ${key}`);
    try { parse(out); } catch (e) { throw new Error(`export trimming broke the script for ${key}: ${e.message}`); }
  }
  return plan;
}

function loadTrimScript(root) {
  return new Function(fs.readFileSync(path.join(root, 'src/trim.js'), 'utf8').replace(/\r\n/g, '\n') + '\nreturn trimScript;')();
}

module.exports = { makePlan, loadTrimScript, FRAMES, FLAGS };
