const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];
const theme={frame:'rabbit',wrOn:true,company:'White Rabbit',unit:'CELL 07',ink:'#2A2340',panel:'#F7F4FF',accent:'#E8338C',headBg:'#A99BF0',headText:'#2A2340',altBg:'#E8338C',altText:'#F7F4FF',ground:'#E7E0FA',scriptFont:'Didot-Bold',units:'fahrenheit',archive:true,L:{},C:{},classes:['CALLING CARD'],slogans:[['We were never here.','THE LEGION']],codes:{youtube:'REEL',instagram:'MARKS',discord:'WARREN'}};
class Point{constructor(x,y){Object.assign(this,{x,y});}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}
class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}
class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}
class DrawContext{constructor(){this.texts=[];this.fills=[];}setFillColor(c){this.color=c;}setStrokeColor(){}setLineWidth(){}fillRect(r){this.fills.push({r,c:this.color});}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(){}setTextColor(){}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(t,r){this.texts.push({t,r});}drawImageInRect(){}getImage(){return {size:this.size,texts:this.texts,fills:this.fills};}}
class Stack{constructor(){this.children=[];this.spacers=[];}setPadding(){}addSpacer(n){this.spacers.push(n);}layoutHorizontally(){this.direction='horizontal';}layoutVertically(){this.direction='vertical';}addStack(){const s=new Stack();this.children.push(s);return s;}addDate(date){const d={date,applyTimerStyle(){},centerAlignText(){},rightAlignText(){}};this.children.push(d);return d;}}
class DateFormatter{string(d){return new Date(d).toISOString();}}
const epoch=Date.UTC(2026,9,11,14),event=(start,end,title='Contact window')=>({title,startDate:new Date(epoch+start),endDate:new Date(epoch+end),calendar:{identifier:'work'},identifier:'contact'});
async function run(mode,family,{files=new Map(),events=[event(-900000,900000)],denyCalendar=false,charging=false,now=epoch,weatherData=false,units="fahrenheit",exportedScript=null}={}){
  class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  const fm={documentsDirectory:()=>'/data',joinPath:(a,b)=>a+'/'+b,fileExists:p=>files.has(p),readString:p=>files.has(p)?files.get(p):null,writeString:(p,s)=>files.set(p,s)};
  const calendar=async()=>{if(denyCalendar)throw Error('denied');return events;};
  class Request{constructor(url){this.url=url;}async loadJSON(){if(!weatherData)throw Error('offline');return{current:{temperature_2m:units==='celsius'?21:69,weather_code:0,apparent_temperature:units==='celsius'?20:68,relative_humidity_2m:47,wind_speed_10m:10},hourly:{time:[now/1000,now/1000+3600],precipitation_probability:[80,20],uv_index:[3,2],visibility:[16093.44,12000],dew_point_2m:[units==='celsius'?7:45,units==='celsius'?7:45]},daily:{temperature_2m_max:[units==='celsius'?24:75],temperature_2m_min:[units==='celsius'?12:54],sunrise:[(now-21600000)/1000,(now+64800000)/1000],sunset:[(now+14400000)/1000,(now+100800000)/1000]}};}}
  const c={console,Request,Date:Clock,Math,Point,Rect,Size,Color,Font,Path,DrawContext,DateFormatter,ListWidget:Stack,Data:{fromBase64String:s=>s},Image:{fromData:()=>{c.imageLoads=(c.imageLoads||0)+1;return {size:new Size(900,489)};}},FileManager:{local:()=>fm},Location:{setAccuracyToThreeKilometers(){},current:async()=>{if(weatherData)return{latitude:40,longitude:-73};throw Error('Location denied');}},Device:{batteryLevel:()=>.68,isCharging:()=>charging},CalendarEvent:{between:calendar,today:calendar,tomorrow:async()=>[]},config:{runsInWidget:true,widgetFamily:family},args:{widgetParameter:mode},URLScheme:{forRunningScript:()=> 'scriptable://run'},Script:{name:()=> 'DeepRangeTest',setWidget:w=>{c.result=w;},complete:()=>{c.complete=true;}}};
  vm.createContext(c);await vm.runInContext('(async()=>{'+(exportedScript||tpl.replace('__THEME__',JSON.stringify({...theme,units})))+'})()',c);return {c,files};
}

test('Actual Afterimage exports preserve each palette background in every native widget size',async()=>{
 const context=vm.createContext({console,Date,Math,URL,TextEncoder,TextDecoder,location:{protocol:'https:',href:'https://lucidfuzz.github.io/foundry/'},localStorage:{getItem:()=>null},document:{getElementById:id=>id==='tpl'?{textContent:tpl}:null}});
 const app=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>')).split('// ---------- boot ----------')[0];
 const browser=vm.runInContext(app+'\n;({state,PRESETS,VARIANTS,buildScript})',context);
 for(const palette of browser.VARIANTS.rabbit){
  const th={...browser.PRESETS.rabbit,edition:'afterimage',colors:{...browser.PRESETS.rabbit.colors,...palette.colors}};browser.state.th=th;
  const script=browser.buildScript(),config=JSON.parse(script.match(/const T = (\{[\s\S]*?\})\s*const INK/)[1]);
  assert.equal(config.ground,th.colors.ground,palette.name+' exported ground');
  for(const family of ['small','medium','large'])for(const mode of ['status','shift','solar','audio','transmission','feeds','youtube','instagram','discord','oddity','game']){
   const {c}=await run(mode,family,{exportedScript:script});assert(c.complete);
   assert.equal(c.result.backgroundColor.hex,th.colors.ground,palette.name+' '+mode+' '+family);
   assert.equal(c.result.backgroundImage.fills[0].c.hex,th.colors.ground);
  }
 }
});

test('Afterimage exports eleven modes at all three sizes with complete bounded text',async()=>{
 for(const size of ['small','medium','large'])for(const mode of ['status','shift','solar','audio','transmission','feeds','youtube','instagram','discord','oddity','game']){const{c}=await run(mode,size);assert(c.complete);const im=c.result.backgroundImage;assert.equal(im.size.width,size==='small'?170:364);for(const{t,r}of im.texts){assert(!/…|\.\.\./.test(t),t);assert(r.x>=0&&r.x+r.width<=im.size.width+.1&&r.y>=0&&r.y+r.height<=im.size.height,mode+' '+size+' '+t+JSON.stringify(r));}assert.equal(c.imageLoads||0,0);}
});
const descendants=w=>(w.children||[]).flatMap(c=>[c,...descendants(c)]);
test('Getaway counts to the event, then the exit, then the next appointment; unavailable stays unavailable',async()=>{
 const next=await run('shift','small',{events:[event(3600000,7200000)]});assert.equal(+descendants(next.c.result).find(c=>c.date).date,epoch+3600000);
 const active=await run('shift','large');assert.equal(+descendants(active.c.result).find(c=>c.date).date,epoch+900000);
 const later=await run('shift','medium',{events:[event(-900000,900000),event(86400000,90000000)],now:epoch+1000000});assert.equal(+descendants(later.c.result).find(c=>c.date).date,epoch+86400000);
 const empty=await run('shift','medium',{denyCalendar:true});assert(!descendants(empty.c.result).some(c=>c.date));
 const climate=await run('solar','large');assert(climate.c.result.backgroundImage.texts.some(x=>x.t==='COVER FEED UNAVAILABLE'));assert(!climate.c.result.backgroundImage.texts.some(x=>/69°|66%/.test(x.t)));
});
test('Calendar titles and exit label clear the native timer at every size',async()=>{
 const title='Shelter maintenance briefing';const getLayout=vm.runInNewContext(fs.readFileSync(root+'/src/paint/97_rabbit_afterimage.js','utf8')+';wrTimerLayout');
 for(const family of ['small','medium','large']){const{c}=await run('shift',family,{events:[event(3600000,7200000,title)]});const im=c.result.backgroundImage,l=getLayout(im.size.width,im.size.height);const lines=im.texts.filter(t=>t.t.split(' ').some(w=>['Shelter','maintenance','briefing'].includes(w)));assert(lines.length);for(const item of lines)assert(item.r.y+item.r.height<=l.y,family+' calendar title overlaps timer');const exit=im.texts.find(t=>t.t.startsWith('LEAVE BY'));assert(exit.r.y>=l.y+l.fs*1.4,family+' leave label overlaps timer');}
});
test('Dossier catalogues rotate deterministically without changing object identities',async()=>{
 const pools=vm.runInNewContext(fs.readFileSync(root+'/src/paint/97_rabbit_afterimage.js','utf8')+';({lots:WR_LOTS,venues:WR_VENUES,jobs:WR_JOBS})');assert.equal(new Set(pools.lots.map(l=>l[0])).size,12);assert.equal(new Set(pools.venues).size,12);assert.equal(pools.jobs.length,10);
 for(const size of ['small','medium','large'])for(let n=0;n<13;n++){const{c}=await run('instagram',size,{now:n*1800000});const texts=c.result.backgroundImage.texts.map(t=>t.t).join(' ');assert(texts.includes(pools.lots[n%12][0]));if(size!=='small')assert(texts.includes(pools.lots[(n+1)%12][0]));const venue=await run('youtube',size,{now:n*1800000});assert(venue.c.result.backgroundImage.texts.some(t=>t.t===pools.venues[n%12]));}
});
test('The Long Con preserves the existing save across sizes and charging cools heat',async()=>{
 const files=new Map();await run('game','small',{files});const file='/data/foundry-game-rabbit.json';const before=JSON.parse(files.get(file));before.heat=60;files.set(file,JSON.stringify(before));await run('game','large',{files});assert.equal(JSON.parse(files.get(file)).turn,before.turn);await run('game','medium',{files,now:epoch+900000,charging:true});assert(JSON.parse(files.get(file)).heat<60);assert.equal(files.size,1);
});
test('Two Marks has matching tap regions and each launcher keeps its destination',async()=>{
 for(const size of ['medium','large']){const{c}=await run('feeds',size);assert.equal(c.result.children[0].direction,'horizontal');assert.deepEqual(c.result.children[0].children.map(x=>x.url),['youtube://','instagram://app']);}for(const[mode,url]of [['audio','youtubemusic://'],['youtube','youtube://'],['instagram','instagram://app'],['discord','discord://']])assert.equal((await run(mode,'small')).c.result.url,url);
});
test('Long calendar text is retained at every size without covering weather',async()=>{
 const title='A private appointment concerning the revised ownership of the seventh heirloom and the arrival of a familiar stranger';
 for(const family of ['small','medium','large']){const{c}=await run('status',family,{events:[event(3600000,7200000,title)]});const lines=c.result.backgroundImage.texts;const all=lines.map(t=>t.t).join(' ');for(const word of title.split(' '))assert(all.includes(word));const wx=lines.find(t=>t.t==='COVER / UNAVAILABLE');const titleLines=lines.filter(t=>t.r.x===(family==='small'?86:145)&&t.r.y>=51&&t.r.y<100);assert(titleLines.every(t=>t.r.y+t.r.height<=wx.r.y));}
});

test('Cover Watch retains real visibility, dew, metric units and a live solar countdown',async()=>{
 for(const units of ['fahrenheit','celsius'])for(const family of ['small','medium','large']){const{c}=await run('solar',family,{weatherData:true,units});const all=c.result.backgroundImage.texts.map(t=>t.t).join(' ');const date=descendants(c.result).find(t=>t.date);assert.equal(+date.date,epoch+14400000);if(family==='large'){assert(all.includes(units==='celsius'?'16 KM':'10 MI'));assert(all.includes(units==='celsius'?'7°':'45°'));assert(all.includes(units==='celsius'?'16 KM/H':'10 MPH'));assert(all.includes('80%'));assert(!all.includes('--'));}}
});

test('Calling Card keeps long messages and attribution clear of the security strip',async()=>{
 const old=theme.slogans;try{theme.slogans=[['An immaculate empty plinth is the only evidence that anyone was here at all. Ownership is a matter of timing.','CLEANUP CREW']];for(const family of ['small','medium','large']){const{c}=await run('transmission',family,{now:1800000*100001});const im=c.result.backgroundImage,all=im.texts.map(q=>q.t).join(' ');for(const word of theme.slogans[0][0].split(' '))assert(all.includes(word));const by=im.texts.filter(q=>q.t.includes('CLEANUP')||q.t.includes('WHITE RABBIT'));assert(by.length);for(const q of by)assert(q.r.y+q.r.height<(family==='large'?215:140),family+' attribution runs into ornament');}}finally{theme.slogans=old;}
});
