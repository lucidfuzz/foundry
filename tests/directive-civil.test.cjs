const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const theme={frame:'directive',dzOn:true,company:'Directive Zero',unit:'D-00',ink:'#FFE14A',panel:'#0B0D10',accent:'#3DFF8A',headBg:'#FF3B30',headText:'#050608',altBg:'#2340FF',altText:'#FFE14A',ground:'#050608',scriptFont:'AvenirNext-Heavy',units:'fahrenheit',archive:true,L:{},C:{},classes:['BULLETIN'],slogans:[['Contact lost is not contact gone','RANGE CONTROL']],codes:{youtube:'FEED',instagram:'LOCK',discord:'RELAY'},drSprites:{relay:'AA=='}};
class Point{constructor(x,y){Object.assign(this,{x,y});}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}
class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}
class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}
class DrawContext{constructor(){this.texts=[];this.fills=[];}setFillColor(c){this.color=c;}setStrokeColor(){}setLineWidth(){}fillRect(r){this.fills.push({r,c:this.color});}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(){}setTextColor(){}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(t,r){this.texts.push({t,r});}drawImageInRect(){}getImage(){return {size:this.size,texts:this.texts,fills:this.fills};}}
class Stack{constructor(){this.children=[];this.spacers=[];}setPadding(){}addSpacer(n){this.spacers.push(n);}layoutHorizontally(){this.direction='horizontal';}layoutVertically(){this.direction='vertical';}addStack(){const s=new Stack();this.children.push(s);return s;}addDate(date){const d={date,applyTimerStyle(){},centerAlignText(){},rightAlignText(){}};this.children.push(d);return d;}}
class DateFormatter{string(d){return new Date(d).toISOString();}}
const epoch=Date.UTC(2026,9,11,14),event=(start,end,title='Contact window')=>({title,startDate:new Date(epoch+start),endDate:new Date(epoch+end),calendar:{identifier:'work'},identifier:'contact'});
async function run(mode,family,{files=new Map(),events=[event(-900000,900000)],denyCalendar=false,charging=false,now=epoch,weatherData=false}={}){
  class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>files.has(p)?files.get(p):null,writeString:(p,s)=>files.set(p,s)};
  const calendar=async()=>{if(denyCalendar)throw Error('denied');return events;};
  const c={console,Date:Clock,Math,Point,Rect,Size,Color,Font,Path,DrawContext,DateFormatter,ListWidget:Stack,Data:{fromBase64String:s=>s},Image:{fromData:()=>{c.imageLoads=(c.imageLoads||0)+1;return {size:new Size(900,489)};}},FileManager:{local:()=>fm},Location:{setAccuracyToThreeKilometers(){},current:async()=>{throw Error('Location denied');}},Device:{batteryLevel:()=>.68,isCharging:()=>charging},CalendarEvent:{between:calendar,today:calendar,tomorrow:async()=>[]},config:{runsInWidget:true,widgetFamily:family},args:{widgetParameter:mode},URLScheme:{forRunningScript:()=> 'scriptable://run'},Script:{name:()=> 'DeepRangeTest',setWidget:w=>{c.result=w;},complete:()=>{c.complete=true;}}};
  vm.createContext(c);await vm.runInContext('(async()=>{'+tpl.replace('__THEME__',JSON.stringify(theme))+'})()',c);return {c,files};
}
test('Civil Defense exports all eleven modes at three sizes, with complete bounded text',async()=>{
 for(const size of ['small','medium','large'])for(const mode of ['status','shift','solar','audio','transmission','feeds','youtube','instagram','discord','oddity','game']){const{c}=await run(mode,size);assert(c.complete);const im=c.result.backgroundImage;assert.equal(im.size.width,size==='small'?170:364);for(const{t,r}of im.texts){assert(!/…|\.\.\./.test(t),t);assert(r.x>=0&&r.x+r.width<=im.size.width+.1&&r.y>=0&&r.y+r.height<=im.size.height,mode+' '+size+' '+t+JSON.stringify(r));}assert.equal(c.imageLoads||0,0);}
});
test('Duty timer uses real event dates and unavailable data stays unavailable',async()=>{
 const findDate=w=>(w.children||[]).flatMap(c=>[c,...findDate(c)]);const next=await run('shift','small',{events:[event(3600000,7200000)]});assert.equal(+findDate(next.c.result).find(c=>c.date).date,epoch+3600000);const active=await run('shift','large');assert.equal(+findDate(active.c.result).find(c=>c.date).date,epoch+900000);const empty=await run('shift','medium',{denyCalendar:true});assert(!findDate(empty.c.result).some(c=>c.date));const climate=await run('solar','large');assert(climate.c.result.backgroundImage.texts.some(x=>x.t==='SOLAR FEED UNAVAILABLE'));assert(!climate.c.result.backgroundImage.texts.some(x=>/69°|66%/.test(x.t)));
});
test('Operator calling cards cover twelve stable identities and different adjacent records',async()=>{
 const pool=vm.runInNewContext(fs.readFileSync(root+'/src/paint/98_directive_civil.js','utf8')+';DZ_PEOPLE');for(const size of ['small','medium','large'])for(let n=0;n<13;n++){const{c}=await run('instagram',size,{now:n*1800000});const texts=c.result.backgroundImage.texts.map(t=>t.t);assert(texts.some(t=>t.startsWith(pool[n%12][0])));if(size!=='small')assert(texts.some(t=>t.startsWith(pool[(n+1)%12][0])));}
});
test('Calling cards contain no drawn characters; long records retain their complete text',async()=>{
 const src=fs.readFileSync(root+'/src/paint/98_directive_civil.js','utf8');assert(!src.includes('dzPortrait'));assert(src.includes('dzOperatorCard'));
 const words='A restricted operational assignment concerning the provisional authorization of internal maintenance and the review of all outstanding shelter access instruments';
 for(const family of ['small','medium','large']){const{c}=await run('status',family,{events:[event(3600000,7200000,words)]});const im=c.result.backgroundImage,joined=im.texts.map(t=>t.t).join(' ');for(const word of words.split(' '))assert(joined.includes(word),family+' lost '+word);assert(!joined.includes('…'));}
 const original=theme.slogans;try{theme.slogans=[[words,'RECORDS OFFICE']];const{c}=await run('transmission','large',{now:1800000*100001});const im=c.result.backgroundImage;const joined=im.texts.map(t=>t.t).join(' ');for(const word of words.split(' '))assert(joined.includes(word));const attributed=im.texts.filter(t=>t.t.includes('Directive Zero')||t.t.includes('DIRECTIVE ZERO')||t.t.includes('RECORDS OFFICE'));assert(attributed.every(t=>t.r.y+t.r.height<153));}finally{theme.slogans=original;}
});
test('Shelter save survives size changes and charging restores power',async()=>{
 const files=new Map();await run('game','small',{files});const file='/data/foundry-game-directive.json';const before=JSON.parse(files.get(file));await run('game','large',{files});assert.equal(JSON.parse(files.get(file)).turn,before.turn);await run('game','medium',{files,now:epoch+900000,charging:true});assert(JSON.parse(files.get(file)).power>before.power);
});
test('Tap regions match recon columns and each app keeps its link',async()=>{
 for(const size of ['medium','large']){const{c}=await run('feeds',size);assert.equal(c.result.children[0].direction,'horizontal');assert.deepEqual(c.result.children[0].children.map(x=>x.url),['youtube://','instagram://app']);}for(const[mode,url]of [['audio','youtubemusic://'],['youtube','youtube://'],['instagram','instagram://app'],['discord','discord://']])assert.equal((await run(mode,'small')).c.result.url,url);
});



test('Calendar titles clear the native timer at every widget size',async()=>{
 const title='Shelter maintenance briefing';const getLayout=vm.runInNewContext(fs.readFileSync(root+'/src/paint/98_directive_civil.js','utf8')+';dzTimerLayout');
 for(const family of ['small','medium','large']){const {c}=await run('shift',family,{events:[event(3600000,7200000,title)]});const im=c.result.backgroundImage,l=getLayout(im.size.width,im.size.height);const lines=im.texts.filter(t=>t.t.split(' ').some(w=>['Shelter','maintenance','briefing'].includes(w)));assert(lines.length);for(const item of lines)assert(item.r.y+item.r.height<=l.y,family+' calendar title overlaps timer');}
});
