// Theme artwork is served as separate files. These tests keep it that way and check the iPhone download cache.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8');
const manifest=vm.runInNewContext(fs.readFileSync(root+'/src/art-manifest.js','utf8')+';ART_MANIFEST');
test('The page stays light: no artwork is embedded in index.html or the widget script', ()=>{
  assert(!html.includes('iVBORw0KGgo') && !html.includes('data:image/webp;base64'), 'embedded image data found');
  assert(Buffer.byteLength(html) < 3e6, `index.html is ${(Buffer.byteLength(html)/1e6).toFixed(1)} MB`);
});
test('Every file in the art manifest exists, and every Halcyon widget crop is listed', ()=>{
  for(const [theme,tiers] of Object.entries(manifest)) for(const [tier,files] of Object.entries(tiers)) for(const [k,url] of Object.entries(files)) assert(fs.existsSync(path.join(root,url.split('?')[0])), `${theme}/${tier}/${k} missing; run python3 scripts/art.py`);
  const keys=[...fs.readFileSync(root+'/src/halcyon/paint.js','utf8').match(/const HB_SPRITES = \{([\s\S]*?)\n\};/)[1].matchAll(/(\w+)\s*:\s*\['/g)].map(m=>m[1]);
  assert.deepEqual(Object.keys(manifest.halcyon.widget).sort(), keys.sort());
});
test('The iPhone script downloads art once, reuses the cached copy, and survives being offline', async ()=>{
  const tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
  const fn=tpl.slice(tpl.indexOf('async function hbLoadArt('), tpl.indexOf('function hbSettings('));
  const files={}; let loads=0, offline=false;
  const ctx={T:{hbArt:{heart:'https://example.test/assets/halcyon/widget/heart.png?v=aaa111', heartDetail:'https://example.test/assets/halcyon/widget/heart-detail.png?v=bbb222'}},
    FileManager:{local:()=>({documentsDirectory:()=>'/docs',joinPath:(a,b)=>a+'/'+b,fileExists:p=>p==='/docs/foundry-art'||p in files,createDirectory(){},write:(p,d)=>{files[p]=d}})},
    Request:class{constructor(u){this.u=u}async load(){if(offline)throw new Error('offline');loads++;return {bytes:this.u}}},
    Image:{fromData:d=>({from:'net',d}),fromFile:p=>({from:'cache',p})},Data:{},HB_SPRITES:{},HB_SHEET_ASPECT:{},HB_WIDGET_ASSETS:{status:['heart','heartDetail']}};
  vm.runInNewContext(fn+';globalThis.hbLoadArt=hbLoadArt',ctx);
  await ctx.hbLoadArt('status');
  assert.equal(loads,2); assert.equal(Object.keys(files).length,2); assert(Object.keys(files).every(p=>/halcyon-(heart|heartDetail)-(aaa111|bbb222)\.png$/.test(p)));
  ctx.T.hbImages={}; await ctx.hbLoadArt('status');
  assert.equal(loads,2,'second run must use the cache'); assert.equal(ctx.T.hbImages.heart.from,'cache');
  ctx.T.hbArt.heart=ctx.T.hbArt.heart.replace('aaa111','ccc333'); ctx.T.hbImages={}; await ctx.hbLoadArt('status');
  assert.equal(loads,3,'a new art version downloads once');
  offline=true; ctx.T.hbArt.heart=ctx.T.hbArt.heart.replace('ccc333','ddd444'); ctx.T.hbImages={}; await ctx.hbLoadArt('status');
  assert.equal(ctx.T.hbImages.heart, undefined, 'offline with no cached copy: draw without the art, no crash');
});
