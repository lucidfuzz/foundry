const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const theme={frame:'halcyon',hbOn:true,company:'Halcyon Biofab',unit:'HB-2893',ink:'#073C30',panel:'#DEF9EE',accent:'#A88CEB',headBg:'#073C30',headText:'#DEF9EE',altBg:'#A88CEB',altText:'#073C30',ground:'#DEF9EE',scriptFont:'Baskerville',units:'fahrenheit',archive:true,L:{},C:{},classes:['CONTINUITY'],slogans:[['You can leave the rest to us.','CONTINUITY SERVICES']],codes:{youtube:'VID',instagram:'OBS',discord:'SYN'},hbAssets:{organs:'AA==',culture:'AA==',signal:'AA==',celestial:'AA=='}};
class Point{constructor(x,y){this.x=x;this.y=y;}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}
class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}
class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}
class DrawContext{constructor(){this.texts=[];this.fills=[];}setFillColor(c){this.fill=c;}setStrokeColor(){}setLineWidth(){}fillRect(rect){this.fills.push({rect,color:this.fill});}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(){}setTextColor(){}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(text,rect){this.texts.push({text,rect});}drawImageInRect(){}getImage(){return {size:this.size,texts:this.texts,fills:this.fills};}}
class Stack{constructor(){this.children=[];this.spacers=[];}setPadding(){}addSpacer(n){this.spacers.push(n);}layoutHorizontally(){}layoutVertically(){}centerAlignContent(){}addStack(){const s=new Stack();this.children.push(s);return s;}addText(text){const t={text};this.children.push(t);return t;}addImage(image){const i={image};this.children.push(i);return i;}addDate(date){const d={date,applyTimerStyle(){},centerAlignText(){},rightAlignText(){}};this.children.push(d);return d;}}
class DateFormatter{string(d){return new Date(d).toISOString();}}
async function run(mode,family,files=new Map(),calendarFailure=false,options={}){
  const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>files.has(p)?files.get(p):null,writeString:(p,s)=>files.set(p,s)};
  const now=Date.now(),event={title:'Review',startDate:new Date(now-900000),endDate:new Date(now+900000),calendar:{identifier:'work'},identifier:'review'};
  const c={console,Date,Math,Point,Rect,Size,Color,Font,Path,DrawContext,DateFormatter,ListWidget:Stack,Data:{fromBase64String:s=>s},Image:{fromData:()=>({})},FileManager:{local:()=>fm},Location:{setAccuracyToThreeKilometers(){},current:async()=>{throw Error('Location denied');}},Device:{batteryLevel:()=>.68,isCharging:()=>options.charging??true},CalendarEvent:{between:async()=>{if(calendarFailure)throw Error('Calendar denied');return [event];},today:async()=>[event],tomorrow:async()=>[]},config:{runsInWidget:!options.app,widgetFamily:family},args:{widgetParameter:mode},URLScheme:{forRunningScript:()=> 'scriptable://run'},Script:{name:()=> 'Test',setWidget:w=>{c.result=w;},complete:()=>{c.complete=true;}}};
  if(options.app){const app=options.app;c.Alert=class{constructor(){this.actions=[];}addAction(t){this.actions.push(t);}addCancelAction(){}addTextField(){}textFieldValue(){return 'https://example.com/fm';}async presentAlert(){return 0;}async presentSheet(){const i=this.actions.indexOf(app);return i>=0?i:0;}};c.ListWidget=class extends Stack{presentSmall(){}presentMedium(){}presentLarge(){}};}
  vm.createContext(c);await vm.runInContext('(async()=>{'+tpl.replace('__THEME__',JSON.stringify({...theme,hbOn:!options.original}))+'})()',c);return {c,files};
}
test('Original Solar keeps its offline header and body at the top in all sizes',async()=>{
  for(const family of ['small','medium','large']){
    const {c}=await run('solar',family,new Map(),false,{original:true}),[header,body]=c.result.children;
    assert.match(header.children[0].text,/W-03 \/\/ SOLAR/);
    assert.equal(body.children[0].text,'SOLAR FEED');
    assert.equal(body.children[1].text,'Signal Lost');
    assert(body.spacers.includes(undefined),`${family}: offline body must fill remaining height below the text`);
  }
});
test('Original small Game keeps the status and stage on separate lines',async()=>{
  const {c,files}=await run('game','small',new Map(),false,{original:true});
  const path='/data/foundry-game-halcyon.json';
  const check=image=>{
    const text=image.children[1].backgroundImage.texts;
    const status=text.find(x=>['FEEDING','AGITATED','NOMINAL'].includes(x.text));
    const stage=text.find(x=>['SPORE','LARVA','JUVENILE','SPECIMEN','ASCENDANT'].includes(x.text));
    assert(status&&stage,`both labels render: ${text.map(x=>x.text).join(' | ')}`);
    assert(status.rect.y+status.rect.height<=stage.rect.y,`${status.text} overlaps ${stage.text}`);
  };
  check(c.result);
  const st=JSON.parse(files.get(path));st.stage=4;st.stress=85;st.last=Date.now();files.set(path,JSON.stringify(st));
  check((await run('game','small',files,false,{original:true,charging:false})).c.result);
  st.stress=20;files.set(path,JSON.stringify(st));
  check((await run('game','small',files,false,{original:true,charging:false})).c.result);
  for(const family of ['medium','large'])assert((await run('game',family,files,false,{original:true})).c.result.children[1].backgroundImage);
});
test('Shift setup prompt names the shared setup path at all sizes',async()=>{
  for(const family of ['small','medium','large']){
    const {c}=await run('shift',family);
    const labels=c.result.backgroundImage.texts.map(x=>x.text).join(' ');
    assert.match(labels,family==='small'?/OPEN SETUP/i:/widget setup/i);
    assert.doesNotMatch(labels,/Scriptable|Foundry app/i);
  }
});
test('All 13 exported Halcyon modes run in all 3 families against Scriptable API doubles',async()=>{
  for(const family of ['small','medium','large'])for(const mode of ['status','shift','transmission','solar','audio','feeds','youtube','instagram','discord','oddity','game','tracker','dossier']){
    const {c}=await run(mode,family);assert(c.complete,mode);assert(c.result.backgroundImage,mode);assert.equal(c.result.backgroundImage.size.width,family==='small'?170:364);assert.equal(c.result.backgroundImage.size.height,family==='large'?382:170);
    const image=c.result.backgroundImage;
    for(const {text,rect:r} of image.texts){assert(r.x>=0&&r.y>=0&&r.width>0&&r.x+r.width<=image.size.width+.1&&r.y+r.height<=image.size.height+.1,`${mode}/${family}: text outside frame: ${text}`);}
    assert(image.fills.some(({rect:r,color})=>r.y===0&&r.height===22&&['#0B211A','#9981DE'].includes(color.hex)),`${mode}/${family}: clinical header missing`);
  }
});
test('Unavailable weather stays explicit and header overrides select both treatments',async()=>{
  const weather=await run('solar','medium');const weatherText=weather.c.result.backgroundImage.texts.map(x=>x.text).join(' ');assert.match(weatherText,/UNAVAILABLE/);assert(!weatherText.includes('72°'));
  for(const [mode,color] of [['audio:alt','#9981DE'],['shift:main','#0B211A']]){const {c}=await run(mode,'medium');assert(c.result.backgroundImage.fills.some(f=>f.rect.height===22&&f.color.hex===color));}
});
test('Allocation uses a live count-up date and requests refresh at release',async()=>{
  const files=new Map([['/data/foundry-halcyon-Test.json',JSON.stringify({allocation:{match:'title',title:'Review',calendar:'work'}})]]);
  for(const family of ['small','medium','large']){
    const {c}=await run('shift',family,files),row=c.result.children[0],timer=row.children[0],dt=timer.children[0];
    assert(dt.date<Date.now());assert(c.result.refreshAfterDate>Date.now());
    const dims=c.result.backgroundImage.size;
    assert(row.spacers[0]+timer.size.width<=dims.width,'Timer stays within horizontal widget bounds');
    assert(c.result.spacers[0]+timer.size.height<=dims.height-19,'Timer stays above the footer');
    const box={x:row.spacers[0],y:c.result.spacers[0],width:timer.size.width,height:timer.size.height};
    for(const {text,rect:r} of c.result.backgroundImage.texts){assert(!(r.x<box.x+box.width&&r.x+r.width>box.x&&r.y<box.y+box.height&&r.y+r.height>box.y),`Corporate records must not paint over the live timer: ${text}`);}
  }
  const denied=await run('shift','small',files,true);assert(denied.c.result.backgroundImage);assert.equal(denied.c.result.children.length,0);
});
test('Specimen state survives re-renders; app links and configured radio survive export',async()=>{
  const {files}=await run('game','medium');const first=JSON.parse(files.get('/data/foundry-game-halcyon.json'));await run('game','large',files);const second=JSON.parse(files.get('/data/foundry-game-halcyon.json'));assert.equal(first.lot,second.lot);assert.equal(first.last,second.last);
  files.set('/data/foundry-halcyon-Test.json',JSON.stringify({radio:'https://example.com/radio'}));const radio=await run('audio','small',files);assert.equal(radio.c.result.url,'https://example.com/radio');const feeds=await run('feeds','medium');assert.deepEqual(feeds.c.result.children[0].children.map(s=>s.url),['youtube://','instagram://app']);
});

test('Halcyon samples one charging growth tick per refresh without inventing missed charging history',async()=>{
 const {files}=await run('game','medium');const path='/data/foundry-game-halcyon.json',before=JSON.parse(files.get(path));before.last=Date.now()-8*3600000;files.set(path,JSON.stringify(before));
 await run('game','medium',files,false,{charging:true});const charged=JSON.parse(files.get(path));assert.equal(charged.growth,before.growth+1);
 await run('game','small',files,false,{charging:true});assert.equal(JSON.parse(files.get(path)).growth,charged.growth);
 charged.last=Date.now()-20*60000;files.set(path,JSON.stringify(charged));await run('game','large',files,false,{charging:false});const resting=JSON.parse(files.get(path));assert.equal(resting.growth,charged.growth);assert.equal(resting.age,charged.age+1);
});
test('Tracker and dossier request the same upcoming catalogue refresh boundary',async()=>{
 const a=await run('tracker','large'),b=await run('dossier','medium');assert.equal(+a.c.result.refreshAfterDate,+b.c.result.refreshAfterDate);
 const scan=w=>w.backgroundImage.texts.map(x=>x.text).join(' ').match(/SCAN \d{5}/)[0];assert.equal(scan(a.c.result),scan(b.c.result));
});
test('First run in the app: radio and allocation setup work before any settings file exists',async()=>{
  const radio=new Map();await run('','medium',radio,false,{app:'radio_setup'});
  assert.equal(JSON.parse(radio.get('/data/foundry-halcyon-Test.json')).radio,'https://example.com/fm');
  const alloc=new Map();await run('','medium',alloc,false,{app:'allocation_setup'});
  assert.equal(JSON.parse(alloc.get('/data/foundry-halcyon-Test.json')).allocation.title,'Review');
});
