// Per-widget, content-versioned artwork cache. Failed first loads retain engraved fallback artwork.
function wrAssetKeys(mode,seed,size){const fixed={status:['vault'],shift:['edge'],solar:['cover'],audio:['audio'],transmission:['mask'],discord:['warren'],oddity:['invite']};if(mode==='instagram'){const count=size==='small'?1:size==='large'?3:2;return Array.from({length:count},(_,i)=>'lot'+String((seed+i)%12+1).padStart(2,'0'));}return fixed[mode]||[];}
async function wrLoadArt(mode,seed){
 T.wrImages=T.wrImages||{};let fm,dir;try{fm=FileManager.local();dir=fm.joinPath(fm.documentsDirectory(),'foundry-art');if(!fm.fileExists(dir))fm.createDirectory(dir,true);}catch(e){fm=null;}
 await Promise.all(wrAssetKeys(mode,seed,fam()).map(async key=>{if(T.wrImages[key])return;const url=T.wrArt?.[key];if(!url)return;const version=(String(url).split('v=')[1]||'0').replace(/[^a-z0-9]/gi,''),p=fm?fm.joinPath(dir,'rabbit-'+key+'-'+version+'.png'):null;try{if(p&&fm.fileExists(p)){const im=Image.fromFile(p);if(im){T.wrImages[key]=im;return;}}}catch(e){}try{const req=new Request(url);req.timeoutInterval=12;const data=await req.load(),im=data&&Image.fromData(data);if(im){T.wrImages[key]=im;if(p)try{fm.write(p,data);}catch(e){}}}catch(e){}}));
}
// All climate channels come from the real adapter; absent fields remain null.
async function wrClimate(){
 const wx=await weather();try{const c=await coords();if(!c)return{wx};const req=new Request(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=relative_humidity_2m,wind_speed_10m&hourly=precipitation_probability,uv_index,visibility,dew_point_2m&daily=sunrise,sunset&forecast_days=2&timezone=auto&wind_speed_unit=mph&temperature_unit=${T.units}&timeformat=unixtime`);req.timeoutInterval=12;
 const j=await req.loadJSON(),now=Date.now(),hour=j.hourly||{},times=hour.time||[],at=times.findIndex(t=>t*1000>=now),idx=at<0?Math.max(0,times.length-1):at,get=key=>Number.isFinite(hour[key]?.[idx])?hour[key][idx]:null,vis=get('visibility'),dew=get('dew_point_2m');
 const atm={rh:Number.isFinite(j.current?.relative_humidity_2m)?j.current.relative_humidity_2m:null,ws:Number.isFinite(j.current?.wind_speed_10m)?j.current.wind_speed_10m:null,uv:get('uv_index'),probs:hour.precipitation_probability?.slice(idx,idx+12).filter(Number.isFinite),visMi:vis==null?null:vis/1609.344,vis:vis==null?null:Math.round(vis/(T.units==='celsius'?1000:1609.344))+(T.units==='celsius'?' KM':' MI'),dew:dew==null?null:Math.round(dew)};
 const sun=hbSunWindow((j.daily?.sunrise||[]).map(t=>t==null?NaN:t*1000),(j.daily?.sunset||[]).map(t=>t==null?NaN:t*1000),now);return{wx,atm,sun};}catch(e){return{wx};}
}
async function wrWidget(mode,extra={}){
 const now=new Date(),d={mode,now,seed:Math.floor(+now/1800000),...extra};
 if(mode==='status'||mode==='shift'){try{d.ev=evData(await nextEvent());}catch(e){d.ev=null;}}
 if(mode==='status'){d.wx=await weather();try{d.batt=Device.batteryLevel();if(d.batt<0)d.batt=null;}catch(e){d.batt=null;}}
 if(mode==='solar')Object.assign(d,await wrClimate());
 if(mode==='transmission'){d.archival=!!T.archive&&d.seed%4===0&&ARCHIVE.length>0;const q=d.archival?ARCHIVE[Math.floor(d.seed/4)%ARCHIVE.length]:null;const line=T.slogans[d.seed%T.slogans.length];d.text=q?q.t:line[0];d.by=q?q.by:T.company.toUpperCase()+' / '+line[1];}
 await wrLoadArt(mode,d.seed);
 const[W,H]=DIMS[fam()]||DIMS.small,w=new ListWidget();w.setPadding(0,0,0,0);w.backgroundColor=new Color(T.ground);const target=mode==='shift'&&d.ev?(d.ev.active?d.ev.end:d.ev.start):mode==='solar'&&Number.isFinite(d.sun?.remaining)?new Date(+now+d.sun.remaining):null;d.live=!!target;w.backgroundImage=artImage(W,H,wrPaint,d);w.refreshAfterDate=new Date((d.seed+1)*1800000+1000);
 if(target){w.refreshAfterDate=new Date(Math.min(+now+15*60000,+target+1000));const l=mode==='solar'?{x:14,y:W<200?104:112,w:W<200?142:140,fs:W<200?15:18}:wrTimerLayout(W,H);w.addSpacer(l.y);const row=w.addStack();row.layoutHorizontally();row.addSpacer(l.x);const box=row.addStack();box.size=new Size(l.w,l.fs*1.4);const date=box.addDate(target);date.applyTimerStyle();date.font=new Font(T.scriptFont,l.fs);date.textColor=new Color(T.ink);date.lineLimit=1;date.minimumScaleFactor=.5;row.addSpacer();w.addSpacer();}
 else if(mode==='feeds'&&W>200){const row=w.addStack();row.layoutHorizontally();row.size=new Size(W,H);for(const u of ['youtube://','instagram://app']){const half=row.addStack();half.size=new Size(W/2,H);half.url=u;half.addSpacer();}}
 const urls={status:'calshow://',shift:'calshow://',audio:'youtubemusic://',youtube:'youtube://',instagram:'instagram://app',discord:'discord://'};if(urls[mode])w.url=urls[mode];if(mode==='feeds'&&W<200)w.url='youtube://';return w;
}
