const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),vm=require('vm');
// Every theme and edition has its four editable headlines plus eleven more, each within the theme's proven line lengths.
test('Every theme and edition has 15 lock-screen headlines that fit',()=>{
  const ctx=vm.createContext({});const {PRESETS,EDITIONS}=vm.runInContext(fs.readFileSync(__dirname+'/../src/foundry-data.js','utf8')+'\n;({PRESETS,EDITIONS})',ctx);
  for(const [id,p] of Object.entries(PRESETS)){
    for(const e of (EDITIONS[id]||[{name:'Original',phrases:p.phrases,morePhrases:p.morePhrases}])){
      const four=e.phrases,more=e.morePhrases||[],all=four.concat(more),label=id+' '+e.name;
      assert.equal(four.length,4,label);assert.equal(more.length,11,label);
      const lim=[Math.max(...four.map(x=>x[0].length)),Math.max(...four.map(x=>x[1].length))];
      for(const [a,b] of more){assert.ok(a.length<=lim[0]&&b.length<=lim[1],label+': '+a+' / '+b);assert.ok(!/…|\.\.\./.test(a+b),label);}
      assert.equal(new Set(all.map(x=>x.join(' ').toLowerCase())).size,15,label+' has duplicates');
    }
  }
});
