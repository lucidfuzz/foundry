const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(root+'/src/tpl.js','utf8');
const c=vm.createContext({Date,Math,HB_LOTS:{},HB_VERSIONS:{},HB_RECORDS:{},HB_INSTRUMENTS:{}});
vm.runInContext(src.slice(src.indexOf('// ---------- W-10 GAMES THAT PLAY THEMSELVES'),src.indexOf('function gameSample(f)'))+'\n'+fs.readFileSync(root+'/src/halcyon/living.js','utf8')+'\nglobalThis.api={G:GAMES.halcyon,hbObservation,HB_OBSERVATIONS,HB_WIDGET_ASSETS}',c);
const {G,hbObservation,HB_OBSERVATIONS,HB_WIDGET_ASSETS}=c.api;
const inp={charging:true,batt:.8,hour:12,busy:0};
test('Specimen growth requires charging, progresses through five forms and migrates old saves',()=>{
 const s=G.init(123456);for(let i=0;i<6;i++)G.step(s,inp);assert.equal(s.growth,6);assert.equal(s.stage,1);
 const before=s.growth;for(let i=0;i<3;i++)G.step(s,{...inp,charging:false});assert.equal(s.growth,before);assert.equal(s.stage,1);
 for(let i=6;i<80;i++)G.step(s,inp);assert.equal(s.stage,4);assert.equal(s.growth,80);
 const old=G.init(555);delete old.growth;old.age=42;old.stage=3;G.migrate(old);assert.equal(old.growth,42);assert.equal(old.stage,3);
});
test('Recycled specimens start a new growth counter',()=>{
 const s=G.init(55);Object.assign(s,{vit:0,nut:0,stress:100,growth:79,stage:3});G.step(s,{...inp,charging:false,batt:.1});assert.equal(s.run,2);assert.equal(s.growth,0);assert.equal(s.stage,0);
});
test('Thirty-six distinct scans pair deterministically and wrap without losing identity',()=>{
 assert.equal(HB_OBSERVATIONS.length,36);assert.equal(new Set(HB_OBSERVATIONS.map(o=>o[0])).size,36);assert(new Set(HB_OBSERVATIONS.map(o=>o[2])).size>=12);
 for(let i=0;i<36;i++){const a=hbObservation({observationIndex:i}),b=hbObservation({seed:i});assert.deepEqual(a,b);assert.equal(a.known,i<6);assert.equal(hbObservation({seed:i+36}).id,a.id);assert.notEqual(hbObservation({seed:i+36}).scan,a.scan);assert.match(a.coords,/^\d+\.\d+[NS] \/ \d+\.\d+[EW]$/);}
 assert.equal(hbObservation({seed:-1}).id,'HB-036');
});
test('Raster subjects are owned by one widget; specimen and observations use no shared images',()=>{
 const seen=new Set();for(const assets of Object.values(HB_WIDGET_ASSETS))for(const key of assets){assert(!seen.has(key),key);seen.add(key);}
 for(const mode of ['game','tracker','dossier'])assert.equal(HB_WIDGET_ASSETS[mode].length,0);
});
