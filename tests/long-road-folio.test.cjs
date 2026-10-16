const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');

const root=path.join(__dirname,'..'),html=fs.readFileSync(root+'/index.html','utf8'),tpl=html.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1];

const theme={frame:'longroad',lrfOn:true,company:'The Long Road',unit:'DAY 283',ink:'#2B2117',panel:'#F5EBD3',accent:'#A3261C',headBg:'#A99BF0',headText:'#2A2340',altBg:'#E8338C',altText:'#F7F4FF',ground:'#E7E0FA',scriptFont:'Baskerville-SemiBold',units:'fahrenheit',archive:true,L:{},C:{},classes:['CALLING CARD'],slogans:[['We were never here.','THE LEGION']],codes:{youtube:'REEL',instagram:'MARKS',discord:'WARREN'}};

class Point{constructor(x,y){Object.assign(this,{x,y});}}class Rect{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}}class Size{constructor(width,height){Object.assign(this,{width,height});}}class Color{constructor(hex,alpha=1){Object.assign(this,{hex,alpha});}}

class Font{constructor(name,size){Object.assign(this,{name,size});}static mediumMonospacedSystemFont(s){return new Font('mono',s);}static boldMonospacedSystemFont(s){return new Font('bold',s);}static heavySystemFont(s){return new Font('heavy',s);}static boldSystemFont(s){return new Font('sans',s);}}

class Path{addLines(){}move(){}addLine(){}addQuadCurve(){}closeSubpath(){}}

class DrawContext{constructor(){this.texts=[];this.fills=[];}setFillColor(c){this.color=c;}setStrokeColor(){}setLineWidth(){}fillRect(r){this.fills.push({r,c:this.color});}strokeRect(){}fillEllipse(){}strokeEllipse(){}addPath(){}fillPath(){}strokePath(){}setFont(font){this.font=font;}setTextColor(color){this.textColor=color;}setTextAlignedCenter(){}setTextAlignedLeft(){}setTextAlignedRight(){}drawTextInRect(t,r){this.texts.push({t,r,font:this.font,color:this.textColor});}drawImageInRect(){}getImage(){return {size:this.size,texts:this.texts,fills:this.fills};}}

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



const descendants=w=>(w.children||[]).flatMap(c=>[c,...descendants(c)]);

const modes=['status','shift','solar','audio','transmission','feeds','youtube','instagram','discord','oddity','game'];
test('Folio native timer rectangles clear labels and the footer at every size',async()=>{
 const layout=vm.runInNewContext(fs.readFileSync(root+'/src/paint/97_longroad_folio.js','utf8')+';lrfTimerLayout');
 for(const family of ['small','medium','large']){const {c}=await run('shift',family,{events:[event(3600000,7200000,'A lengthy appointment to discuss the winter road repairs and the new bridge')]});const im=c.result.backgroundImage,l=layout(im.size.width,im.size.height);assert(l.y+l.fs*1.4<im.size.height-24);const top=im.texts.filter(t=>t.r.y>=43&&t.r.y<103&&t.r.x===l.x);assert(top.length);for(const t of top)assert(t.r.y+t.r.height<=l.y,t.t);assert(descendants(c.result).some(t=>t.date));}
});
test('Folio preserves long letters and calendar names without swallowing readings',async()=>{
 const title='A meeting to discuss the old bridge, the baker and all seven letters left at the inn';
 for(const family of ['small','medium','large']){const {c}=await run('status',family,{events:[event(3600000,7200000,title)],weatherData:true});const text=c.result.backgroundImage.texts.map(t=>t.t).join(' ');assert(text.includes(title));assert(text.includes('69°'));assert(text.includes('68%'));}
});

test('Folio actual exports preserve palette ground and complete bounded text in all 165 combinations',async()=>{

 const ctx=vm.createContext({console,Date,Math,URL,TextEncoder,TextDecoder,location:{protocol:'https:',href:'https://lucidfuzz.github.io/foundry/'},localStorage:{getItem:()=>null},document:{getElementById:id=>id==='tpl'?{textContent:tpl}:null}});

 const app=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>')).split('// ---------- boot ----------')[0];const b=vm.runInContext(app+';({state,PRESETS,VARIANTS,buildScript,homeFrameCount})',ctx);

 assert.equal(b.homeFrameCount(b.PRESETS.longroad),1);

 for(const palette of b.VARIANTS.longroad){const th={...b.PRESETS.longroad,edition:'folio',colors:{...b.PRESETS.longroad.colors,...palette.colors}};b.state.th=th;assert.equal(b.homeFrameCount(th),6);const script=b.buildScript();

 for(const family of ['small','medium','large'])for(const mode of modes){const {c}=await run(mode,family,{exportedScript:script});assert(c.complete);const im=c.result.backgroundImage;assert.equal(c.result.backgroundColor.hex,th.colors.ground);for(const {t,r,font,color}of im.texts){if(family!=='small'){assert(font.size>=12,mode+' '+family+' unreadable text: '+t);assert.equal(color.alpha,1,mode+' faded text: '+t);}assert(!/…|\.\.\./.test(t),t);assert(r.x>=-.01&&r.x+r.width<=im.size.width+.1&&r.y>=0&&r.y+r.height<=im.size.height+.1,mode+' '+family+' '+t+' '+JSON.stringify(r));}}}

});

test('The Road follows actual event start and end, and missing calendar/weather stays explicit',async()=>{

 for(const family of ['small','medium','large']){const next=await run('shift',family,{events:[event(3600000,7200000,'Meeting at the inn after the long walk')]});assert.equal(+descendants(next.c.result).find(c=>c.date).date,epoch+3600000);const active=await run('shift',family);assert.equal(+descendants(active.c.result).find(c=>c.date).date,epoch+900000);const empty=await run('shift',family,{denyCalendar:true});assert(!descendants(empty.c.result).some(c=>c.date));assert(empty.c.result.backgroundImage.texts.some(t=>t.t==='At rest.'));const sky=await run('solar',family);assert(sky.c.result.backgroundImage.texts.some(t=>t.t.toUpperCase()==='CLOUDED OVER'));assert(!sky.c.result.backgroundImage.texts.some(t=>/63°|46%/.test(t.t)));}

});

test('Folio almanac keeps measured climate values, units and a live sun timer',async()=>{

 for(const units of ['fahrenheit','celsius']){const {c}=await run('solar','large',{weatherData:true,units});const text=c.result.backgroundImage.texts.map(t=>t.t).join(' ');assert.equal(+descendants(c.result).find(t=>t.date).date,epoch+14400000);assert(text.includes(units==='celsius'?'16 KM':'10 MI'));assert(text.includes(units==='celsius'?'7°':'45°'));assert(text.includes('80%'));assert(text.includes(units==='celsius'?'16 km/h':'10 mph'));assert(!text.includes('--'));}

});

test('Twelve stable people, omens and plays cycle and wrap without repeating identity within a view',async()=>{

 const p=vm.runInNewContext(fs.readFileSync(root+'/src/paint/97_longroad_folio.js','utf8')+';({people:LRF_PEOPLE,omens:LRF_OMENS,plays:LRF_PLAYS})');for(const list of Object.values(p))assert.equal(new Set(list.map(x=>x[0])).size,12);

 for(const family of ['small','medium','large'])for(let n=0;n<13;n++)for(const [mode,list]of [['instagram',p.people],['oddity',p.omens],['youtube',p.plays]]){const {c}=await run(mode,family,{now:n*1800000});const t=c.result.backgroundImage.texts.map(t=>t.t).join(' ');assert(t.includes(list[n%12][0]),mode+' '+family+' '+n);if(mode==='instagram'&&family!=='small')assert(t.includes(list[(n+1)%12][0]));}

});

test('Expedition keeps the existing Long Road save and charging makes camp across sizes',async()=>{

 const files=new Map();await run('game','small',{files});const file='/data/foundry-game-longroad.json',before=JSON.parse(files.get(file));before.hp=4;files.set(file,JSON.stringify(before));await run('game','large',{files});assert.equal(JSON.parse(files.get(file)).turn,before.turn);await run('game','medium',{files,now:epoch+900000,charging:true});const after=JSON.parse(files.get(file));assert(after.camp);assert(after.hp>4);assert.equal(after.name,before.name);assert.equal(files.size,1);

});

test('Folio launchers and split notices retain their native destinations',async()=>{

 for(const family of ['medium','large']){const {c}=await run('feeds',family);assert.deepEqual(c.result.children[0].children.map(x=>x.url),['youtube://','instagram://app']);}for(const [mode,url]of [['status','calshow://'],['shift','calshow://'],['audio','youtubemusic://'],['youtube','youtube://'],['instagram','instagram://app'],['discord','discord://']])assert.equal((await run(mode,'small')).c.result.url,url);

});
