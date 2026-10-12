const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const theme={frame:'halcyon',company:'Halcyon Biofab',unit:'HB-2893',ink:'#073C30',panel:'#DEF9EE',accent:'#A88CEB',headBg:'#073C30',headText:'#DEF9EE',altBg:'#A88CEB',altText:'#073C30',ground:'#DEF9EE',scriptFont:'Baskerville',units:'fahrenheit',archive:true,L:{},C:{},classes:['CONTINUITY'],slogans:[['You can leave the rest to us.','CONTINUITY SERVICES']],codes:{youtube:'VID',instagram:'OBS',discord:'SYN'},hbAssets:{organs:'AA==',culture:'AA==',signal:'AA==',celestial:'AA=='}};
class Point{constructor(x,y){this.x=x;this.y=y;}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}
class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}
class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}
class DrawContext{setFillColor(){}setStrokeColor(){}setLineWidth(){}fillRect(){}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(){}setTextColor(){}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(){}drawImageInRect(){}getImage(){return {size:this.size};}}
class Stack{constructor(){this.children=[];this.spacers=[];}setPadding(){}addSpacer(n){this.spacers.push(n);}layoutHorizontally(){}layoutVertically(){}addStack(){const s=new Stack();this.children.push(s);return s;}addDate(date){const d={date,applyTimerStyle(){},centerAlignText(){},rightAlignText(){}};this.children.push(d);return d;}}
class DateFormatter{string(d){return new Date(d).toISOString();}}
async function run(mode,family,files=new Map(),calendarFailure=false){
  const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>{if(!files.has(p))throw Error('missing');return files.get(p);},writeString:(p,s)=>files.set(p,s)};
  const now=Date.now(),event={title:'Review',startDate:new Date(now-900000),endDate:new Date(now+900000),calendar:{identifier:'work'},identifier:'review'};
  const c={console,Date,Math,Point,Rect,Size,Color,Font,Path,DrawContext,DateFormatter,ListWidget:Stack,Data:{fromBase64String:s=>s},Image:{fromData:()=>({})},FileManager:{local:()=>fm},Location:{setAccuracyToThreeKilometers(){},current:async()=>{throw Error('Location denied');}},Device:{batteryLevel:()=>.68,isCharging:()=>true},CalendarEvent:{between:async()=>{if(calendarFailure)throw Error('Calendar denied');return [event];},today:async()=>[event],tomorrow:async()=>[]},config:{runsInWidget:true,widgetFamily:family},args:{widgetParameter:mode},URLScheme:{forRunningScript:()=> 'scriptable://run'},Script:{name:()=> 'Test',setWidget:w=>{c.result=w;},complete:()=>{c.complete=true;}}};
  vm.createContext(c);await vm.runInContext('(async()=>{'+tpl.replace('__THEME__',JSON.stringify(theme))+'})()',c);return {c,files};
}
test('All 12 exported Halcyon modes run in all 3 families against Scriptable API doubles',async()=>{
  for(const family of ['small','medium','large'])for(const mode of ['status','shift','transmission','solar','audio','feeds','youtube','instagram','discord','oddity','game','tracker']){
    const {c}=await run(mode,family);assert(c.complete,mode);assert(c.result.backgroundImage,mode);assert.equal(c.result.backgroundImage.size.width,family==='small'?170:364);assert.equal(c.result.backgroundImage.size.height,family==='large'?382:170);
  }
});
test('Allocation uses a live count-up date and requests refresh at release',async()=>{
  const files=new Map([['/data/foundry-halcyon-Test.json',JSON.stringify({allocation:{match:'title',title:'Review',calendar:'work'}})]]);
  for(const family of ['small','medium','large']){
    const {c}=await run('shift',family,files),row=c.result.children[0],timer=row.children[0],dt=timer.children[0];
    assert(dt.date<Date.now());assert(c.result.refreshAfterDate>Date.now());
    const dims=c.result.backgroundImage.size;
    assert(row.spacers[0]+timer.size.width<=dims.width,'Timer stays within horizontal widget bounds');
    assert(c.result.spacers[0]+timer.size.height<=dims.height-19,'Timer stays above the footer');
  }
  const denied=await run('shift','small',files,true);assert(denied.c.result.backgroundImage);assert.equal(denied.c.result.children.length,0);
});
test('Specimen state survives re-renders; app links and configured radio survive export',async()=>{
  const {files}=await run('game','medium');const first=JSON.parse(files.get('/data/foundry-game-halcyon.json'));await run('game','large',files);const second=JSON.parse(files.get('/data/foundry-game-halcyon.json'));assert.equal(first.lot,second.lot);assert.equal(first.last,second.last);
  files.set('/data/foundry-halcyon-Test.json',JSON.stringify({radio:'https://example.com/radio'}));const radio=await run('audio','small',files);assert.equal(radio.c.result.url,'https://example.com/radio');const feeds=await run('feeds','medium');assert.deepEqual(feeds.c.result.children[0].children.map(s=>s.url),['youtube://','instagram://app']);
});
