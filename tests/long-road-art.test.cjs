const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function harness({family='medium',offline=false,files=new Map(),version='first'}={}){
 const loaded=[];const keys=[...Array.from({length:12},(_,i)=>'mark'+String(i+1).padStart(2,'0')),'compass',...Array.from({length:8},(_,i)=>'journey'+String(i+1).padStart(2,'0')),'hourglass','sundial','letters','crier','minstrel','tavern',...['person','omen','stage'].flatMap(p=>Array.from({length:12},(_,i)=>p+String(i+1).padStart(2,'0')))];
 const T={lrfArt:Object.fromEntries(keys.map(k=>[k,`https://example.invalid/${k}.png?v=${version}`]))};
 const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),createDirectory:p=>files.set(p,'directory'),write:(p,d)=>files.set(p,d),readString:p=>files.has(p)?files.get(p):null};
 class Request{constructor(url){this.url=url;}async load(){loaded.push(this.url);if(offline)throw Error('offline');return this.url;}}
 const c={T,lrfKey:(p,n)=>p+String(n%12+1).padStart(2,'0'),FileManager:{local:()=>fm},Request,Image:{fromData:data=>({data}),fromFile:p=>files.has(p)?{data:files.get(p)}:null},fam:()=>family};
 vm.createContext(c);
 const gVar=fs.readFileSync(root+'/src/tpl.js','utf8').match(/function gVar[^\n]+/)[0];
 vm.runInContext(gVar+'\n'+fs.readFileSync(root+'/src/paint/97_longroad_folio.js','utf8'),c);
 vm.runInContext(fs.readFileSync(root+'/src/longroad/runtime.js','utf8'),c);return{c,T,loaded,files};
}
test('Folio caches each visible subject and shared journal miniatures, and retains fallback offline',async()=>{
 for(const [family,count]of[['small',1],['medium',2],['large',3]]){const h=harness({family});await h.c.lrfLoadArt('instagram',11);assert.equal(h.loaded.length,count+12);assert(h.loaded[0].includes('person12'));if(count>1)assert(h.loaded[1].includes('person01'));}
 const h=harness();await h.c.lrfLoadArt('youtube',4);assert(h.loaded[0].includes('stage05'));const again=harness({files:h.files});await again.c.lrfLoadArt('youtube',4);assert.equal(again.loaded.length,0);const changed=harness({files:h.files,version:'second'});await changed.c.lrfLoadArt('youtube',4);assert.equal(changed.loaded.length,13);const off=harness({offline:true});await off.c.lrfLoadArt('audio',0);assert.deepEqual(Object.keys(off.T.lrfImages),[]);
});
test('Long Road artwork is hosted separately with versioned manifest entries',()=>{
 const manifest=vm.runInNewContext(fs.readFileSync(root+'/src/art-manifest.js','utf8')+';ART_MANIFEST');assert.equal(Object.keys(manifest.longroad.sheets).length,8);assert.equal(Object.keys(manifest.longroad.widget).length,75);for(const group of ['sheets','thumbs','widget'])for(const url of Object.values(manifest.longroad[group])){assert(/\?v=[a-f0-9]{10}$/.test(url));assert(fs.existsSync(path.join(root,url.split('?')[0])));}
});
test('Expedition art follows the saved traveller and camp state, independent of the rotating fiction slot',async()=>{
 const appearances=new Set();
 for(let vseed=0;vseed<32;vseed++){
  const h=harness(),st={run:2,vseed,camp:false};
  const walk=h.c.lrfAssetKeys('game',0,'small',st)[0];
  assert.equal(walk,h.c.lrfAssetKeys('game',987,'large',st)[0]);
  appearances.add(walk);
  const camp=h.c.lrfAssetKeys('game',0,'medium',{...st,camp:true})[0];
  assert.equal(Number(camp.slice(-2)),Number(walk.slice(-2))+1);
  await h.c.lrfLoadArt('game',0,st);assert.equal(h.loaded.length,13);assert(h.loaded[0].includes(walk));
  const again=harness({files:h.files});await again.c.lrfLoadArt('game',900,st);assert.equal(again.loaded.length,0);
  await again.c.lrfLoadArt('game',900,{...st,camp:true});assert.equal(again.loaded.length,1);assert(again.loaded[0].includes(camp));
 }
 assert.equal(appearances.size,4);
 const h=harness();await h.c.lrfLoadArt('status',0);assert.equal(h.loaded.length,13);assert(h.loaded[0].includes('compass'));
});

test('Journal miniature fragments stay inside their allocation at compact and tall sizes',()=>{
 const source=fs.readFileSync(root+'/src/paint/97_longroad_folio.js','utf8'),images=Object.fromEntries(Array.from({length:12},(_,i)=>['mark'+String(i+1).padStart(2,'0'),{size:{width:240+i*7,height:180+i*13}}]));
 class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}
 const c=vm.createContext({T:{panel:'#f5ebd3',lrfImages:images},Rect});vm.runInContext(source,c);
 for(const [w,h]of[[35,8],[61,12],[126,18],[28,65],[27,99],[82,26],[61,28],[192,76]])for(let kind=0;kind<8;kind++){
  const drawn=[],k={journeyDetail:true,storyMasks:[],ln(){},ia(){},a(){},dc:{drawImageInRect(im,r){drawn.push(r);}}};
  c.lrfTrailScene(k,17,38,w,h,kind,kind+3);assert(drawn.length);
  for(const r of drawn){assert(r.x>=17&&r.y>=38);assert(r.x+r.width<=17+w+.001&&r.y+r.height<=38+h+.001,JSON.stringify(r));}
 }
});
