const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function harness({family='medium',offline=false,files=new Map(),version='first'}={}){
 const loaded=[];const keys=['mask','vault','edge','audio','warren','cover','invite',...Array.from({length:12},(_,i)=>'lot'+String(i+1).padStart(2,'0'))];
 const T={wrArt:Object.fromEntries(keys.map(k=>[k,`https://example.invalid/${k}.png?v=${version}`]))};
 const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),createDirectory:p=>files.set(p,'directory'),write:(p,d)=>files.set(p,d),readString:p=>files.has(p)?files.get(p):null};
 class Request{constructor(url){this.url=url;}async load(){loaded.push(this.url);if(offline)throw Error('offline');return this.url;}}
 const c={T,FileManager:{local:()=>fm},Request,Image:{fromData:data=>({data}),fromFile:p=>files.has(p)?{data:files.get(p)}:null},fam:()=>family};
 vm.createContext(c);vm.runInContext(fs.readFileSync(root+'/src/rabbit/runtime.js','utf8'),c);return{c,T,loaded,files};
}
test('White Rabbit loads only the currently displayed catalogue plates, wrapping the stable pool',async()=>{
 for(const [family,count]of[['small',1],['medium',2],['large',3]]){const h=harness({family});await h.c.wrLoadArt('instagram',11);assert.equal(h.loaded.length,count);assert(h.loaded[0].includes('lot12'));if(count>1)assert(h.loaded[1].includes('lot01'));}
 const h=harness();await h.c.wrLoadArt('status',0);assert.deepEqual(Object.keys(h.T.wrImages),['vault']);await h.c.wrLoadArt('game',0);assert.equal(h.loaded.length,1);
});
test('Native art cache survives widget reloads and refreshes when the content version changes',async()=>{
 const first=harness();await first.c.wrLoadArt('audio',0);assert.equal(first.loaded.length,1);
 const second=harness({files:first.files});await second.c.wrLoadArt('audio',0);assert.equal(second.loaded.length,0);assert(second.T.wrImages.audio);
 const changed=harness({files:first.files,version:'second'});await changed.c.wrLoadArt('audio',0);assert.equal(changed.loaded.length,1);
});
test('Offline first run leaves missing images empty for the complete engraved fallback',async()=>{
 const h=harness({offline:true});await h.c.wrLoadArt('transmission',0);assert.deepEqual(Object.keys(h.T.wrImages),[]);assert(![...h.files.keys()].some(k=>k.endsWith('.png')));
});
test('Generated art is hosted, each source has alpha, and serving preserves other theme assets',()=>{
 const manifest=vm.runInNewContext(fs.readFileSync(root+'/src/art-manifest.js','utf8')+';ART_MANIFEST');assert.equal(Object.keys(manifest.rabbit.sheets).length,19);
 for(const group of ['sheets','thumbs','widget'])for(const url of Object.values(manifest.rabbit[group])){assert(/\?v=[a-f0-9]{10}$/.test(url));assert(fs.existsSync(path.join(root,url.split('?')[0])));}
 for(const key of Object.keys(manifest.rabbit.sheets)){const b=fs.readFileSync(root+'/assets/rabbit/'+key+'.png');assert.equal(b[25],6,key+' must have PNG RGBA');}
 const html=fs.readFileSync(root+'/index.html','utf8');assert(!/data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/]{200}/.test(html));assert(!/data:font\//.test(html));
});
