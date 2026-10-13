const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const theme={frame:'deeprange',drOn:true,company:'Deep Range',unit:'RELAY 07',ink:'#FFE14A',panel:'#0B0D10',accent:'#3DFF8A',headBg:'#FF3B30',headText:'#050608',altBg:'#2340FF',altText:'#FFE14A',ground:'#050608',scriptFont:'AvenirNext-Heavy',units:'fahrenheit',archive:true,L:{},C:{},classes:['BULLETIN'],slogans:[['Contact lost is not contact gone','RANGE CONTROL']],codes:{youtube:'FEED',instagram:'LOCK',discord:'RELAY'},drSprites:{relay:'AA=='}};
class Point{constructor(x,y){Object.assign(this,{x,y});}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}
class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}
class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}
class DrawContext{constructor(){this.texts=[];this.fills=[];}setFillColor(c){this.color=c;}setStrokeColor(){}setLineWidth(){}fillRect(r){this.fills.push({r,c:this.color});}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(){}setTextColor(){}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(t,r){this.texts.push({t,r});}drawImageInRect(){}getImage(){return {size:this.size,texts:this.texts,fills:this.fills};}}
class Stack{constructor(){this.children=[];this.spacers=[];}setPadding(){}addSpacer(n){this.spacers.push(n);}layoutHorizontally(){this.direction='horizontal';}layoutVertically(){this.direction='vertical';}addStack(){const s=new Stack();this.children.push(s);return s;}addDate(date){const d={date,applyTimerStyle(){},centerAlignText(){},rightAlignText(){}};this.children.push(d);return d;}}
class DateFormatter{string(d){return new Date(d).toISOString();}}
const epoch=Date.UTC(2026,9,11,14),event=(start,end,title='Contact window')=>({title,startDate:new Date(epoch+start),endDate:new Date(epoch+end),calendar:{identifier:'work'},identifier:'contact'});
async function run(mode,family,{files=new Map(),events=[event(-900000,900000)],denyCalendar=false,now=epoch,weatherData=false}={}){
  class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>files.has(p)?files.get(p):null,writeString:(p,s)=>files.set(p,s)};
  const calendar=async()=>{if(denyCalendar)throw Error('denied');return events;};
  const c={console,Date:Clock,Math,Point,Rect,Size,Color,Font,Path,DrawContext,DateFormatter,ListWidget:Stack,Data:{fromBase64String:s=>s},Image:{fromData:()=>{c.imageLoads=(c.imageLoads||0)+1;return {size:new Size(900,489)};}},FileManager:{local:()=>fm},Location:{setAccuracyToThreeKilometers(){},current:async()=>{throw Error('Location denied');}},Device:{batteryLevel:()=>.68,isCharging:()=>false},CalendarEvent:{between:calendar,today:calendar,tomorrow:async()=>[]},config:{runsInWidget:true,widgetFamily:family},args:{widgetParameter:mode},URLScheme:{forRunningScript:()=> 'scriptable://run'},Script:{name:()=> 'DeepRangeTest',setWidget:w=>{c.result=w;},complete:()=>{c.complete=true;}}};
  vm.createContext(c);await vm.runInContext('(async()=>{'+tpl.replace('__THEME__',JSON.stringify(theme))+'})()',c);return {c,files};
}
test('All 12 Deep Range modes run at all 3 sizes; critical framing uses red, not the green activity color',async()=>{
  for(const family of ['small','medium','large'])for(const mode of ['status','shift','transmission','solar','audio','feeds','youtube','instagram','discord','oddity','game','tracker']){
    const {c}=await run(mode,family),im=c.result.backgroundImage;assert(c.complete);assert.equal(im.size.width,family==='small'?170:364);assert.equal(im.size.height,family==='large'?382:170);
    assert(im.fills.some(f=>f.r.width===3&&f.c.hex==='#FF3B30'));
    for(const {r,t}of im.texts){assert(r.x>=0&&r.x+r.width<=im.size.width+.1,`${mode} ${family} horizontal text bounds: ${t}`);assert(r.y>=0&&r.y+r.height<=im.size.height,`${mode} ${family} vertical text bounds: ${t}`);}
  }
});
test('Return Window targets event start, then event end, then next contact; native timer stays in bounds',async()=>{
  for(const family of ['small','medium','large'])for(const [start,end,expected]of [[3600000,7200000,3600000],[-900000,900000,900000]]){
    const {c}=await run('shift',family,{events:[event(start,end)]}),row=c.result.children[0],stack=row.children[0],date=stack.children[0];assert.equal(+date.date,epoch+expected);assert(c.result.refreshAfterDate<=epoch+expected+1000);assert(row.spacers[0]+stack.size.width<=c.result.backgroundImage.size.width);assert(c.result.spacers[0]+stack.size.height<=c.result.backgroundImage.size.height-19);
  }
  const {c}=await run('shift','medium',{events:[event(-7200000,-1000),event(10800000,14400000)]});assert.equal(+c.result.children[0].children[0].children[0].date,epoch+10800000);
  const empty=await run('shift','small',{denyCalendar:true});assert.equal(empty.c.result.children.length,0);assert(empty.c.result.backgroundImage.texts.some(x=>x.t==='NO WINDOW SCHEDULED'));
});
test('Salvage state persists across families without advancing until the next tick',async()=>{
  const {files}=await run('game','small');const file='/data/foundry-game-deeprange.json',first=JSON.parse(files.get(file));await run('game','large',{files});assert.deepEqual(JSON.parse(files.get(file)),first);
  await run('game','medium',{files,now:epoch+16*60000});assert(JSON.parse(files.get(file)).turn>first.turn);assert.equal(JSON.parse(files.get(file)).game,'deeprange');
});
test('Downlink tap regions match each layout, links survive export and alternate header parameter works',async()=>{
  for(const family of ['medium','large']){const {c}=await run('feeds',family),row=c.result.children[0];assert.equal(row.direction,family==='large'?'vertical':'horizontal');assert.deepEqual(row.children.map(s=>s.url),['youtube://','instagram://app']);assert.equal(row.children[0].size.width,family==='large'?364:182);assert.equal(row.children[0].size.height,family==='large'?191:170);}
  assert.equal((await run('audio','small')).c.result.url,'youtubemusic://');assert.equal((await run('feeds','small')).c.result.url,'youtube://');
  assert.equal((await run('status:alt','small')).c.result.backgroundImage.fills[1].c.hex,'#2340FF');
});
test('Unavailable climate does not fabricate readings; rotating catalogue labels real and fictional contacts',async()=>{
  const missing=(await run('solar','large')).c.result.backgroundImage.texts.map(x=>x.t);assert(missing.includes('WEATHER UNAVAILABLE'));assert(missing.includes('FORECAST UNAVAILABLE'));assert(missing.includes('—'));
  for(const [seed,expected]of [[0,'KNOWN / SOLAR SYSTEM'],[1,'FICTIONAL / PROVISIONAL'],[3,'FICTIONAL / UNRESOLVED']]){const r=await run('tracker','small',{now:1800000*seed});assert(r.c.result.backgroundImage.texts.some(x=>x.t===expected));}
  const archive=await run('transmission','medium',{now:1800000*100000}),fiction=await run('transmission','medium',{now:1800000*100001});assert(archive.c.result.backgroundImage.texts.some(x=>x.t==='ARCHIVE / RECEIVED TEXT'));assert(fiction.c.result.backgroundImage.texts.some(x=>x.t==='RANGE CONTROL / FICTIONAL BULLETIN'));
});

test('All 21 radar contacts cycle and wrap across sizes without decoding raster artwork',async()=>{
  const catalogue=vm.runInNewContext(fs.readFileSync(root+'/src/deeprange/paint.js','utf8')+';DR_CONTACTS');
  const names=Array.from(catalogue,c=>c.name);assert.equal(names.length,21);assert.equal(new Set(names).size,21);assert.equal(catalogue.filter(c=>c.type.startsWith('KNOWN')).length,8);
  assert.equal(catalogue.filter(c=>c.kind==='relay').length,4);assert.equal(catalogue.filter(c=>c.kind==='world'&&c.type.startsWith('FICTIONAL')).length,6);
  for(const family of ['small','medium','large'])for(let seed=0;seed<=names.length;seed++){
    const {c}=await run('tracker',family,{now:1800000*seed});
    assert(c.result.backgroundImage.texts.some(t=>t.t===names[seed%names.length]));
    assert.equal(c.imageLoads||0,0,'Catalogue must use vector art');
    for(const {t,r}of c.result.backgroundImage.texts)assert(r.x>=0&&r.x+r.width<=c.result.backgroundImage.size.width+.1&&r.y>=0&&r.y+r.height<=c.result.backgroundImage.size.height,'Catalogue text bounds: '+t);
    if(family==='medium')assert(c.result.backgroundImage.texts.some(t=>t.t===names[(seed+1)%names.length]));
    if(family==='large')assert(c.result.backgroundImage.texts.some(t=>t.t==='CATALOGUE '+String(seed%names.length+1).padStart(2,'0')+' / '+String(names.length).padStart(2,'0')));
  }
  assert.equal((await run('status','large')).c.imageLoads||0,0,'Status follows the vector-only theme rule');
});

test('Wallpapers stay vector-only: four original lock scenes and six distinct Expanded homes',()=>{
  const scope={DISPLAY_FONTS:[['Archivo',800]],T:theme};vm.createContext(scope);
  // Supply the actual shared catalogue geometry; the browser bridge is not loaded in this Canvas test.
  vm.runInContext(fs.readFileSync(root+'/src/deeprange/paint.js','utf8')+'\nfunction scriptableKit(){return {DR_CONTACTS,drContactSilhouette};}\n'+fs.readFileSync(root+'/src/render.js','utf8')+'\n'+fs.readFileSync(root+'/src/deeprange/wallpapers.js','utf8')+';globalThis.paint=drWallpaper;',scope);
  const wallTheme={colors:{ground:'#050608',ink:'#FFE14A',accent:'#FF3B30',glow:'#2340FF'},fonts:{mono:'Share Tech Mono',display:'Archivo'},upper:true},signatures=[],homeSignatures=[];
  for(const mode of ['lock','home'])for(let i=0;i<(mode==='lock'?4:6);i++){
    const calls=[],ctx=new Proxy({canvas:{width:1170,height:2532},measureText:()=>({width:5}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,key)=>key==='drawImage'?()=>{throw Error('Raster image in wallpaper');}:key in o?o[key]:(...args)=>{for(const n of args)if(typeof n==='number')assert(Number.isFinite(n));calls.push([key,...args]);},set:(o,k,v)=>{o[k]=v;return true;}});
    scope.paint(ctx,wallTheme,844,mode,i);assert(calls.length>150);
    if(mode==='home'){
      homeSignatures.push(JSON.stringify(calls.filter(c=>['moveTo','lineTo','ellipse','fillRect'].includes(c[0]))));
      assert(calls.some(c=>c[0]==='fillText'&&c[1]==='SIM / 0'+(i+1)),'Fictional records labeled');
    }
    if(mode==='lock'){
      signatures.push(JSON.stringify(calls.filter(c=>['moveTo','lineTo','ellipse'].includes(c[0]))));
      assert(calls.some(c=>c[0]==='moveTo'&&c[1]===40&&c[2]===358),'Original inclined grid anchor');
      assert(calls.some(c=>c[0]==='fillRect'&&c[1]===0&&c[2]===268&&c[3]===12&&c[4]===40),'Original red edge glyph');
      assert(calls.some(c=>c[0]==='fillText'&&c[3]===608),'Original year readout baseline');
    }
  }
  assert.equal(new Set(signatures).size,4);
  assert.equal(new Set(homeSignatures).size,6);
});
