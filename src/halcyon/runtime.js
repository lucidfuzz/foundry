// Scriptable adapters: artwork is fetched once from the Foundry site and cached; personal data stays on the device.
// Artwork is downloaded from the Foundry site the first time a widget needs it, then kept on the phone
// (Scriptable's local documents, folder foundry-art). A new art version has a new file name, so it re-downloads once.
// Offline on first run: the widget draws without the art and picks it up on a later refresh.
async function hbLoadArt(mode) {
  const keys=HB_WIDGET_ASSETS[mode]||[];
  T.hbImages=T.hbImages||{};
  let fm=null,dir=null; try{fm=FileManager.local();dir=fm.joinPath(fm.documentsDirectory(),'foundry-art');if(!fm.fileExists(dir))fm.createDirectory(dir,true);}catch(e){fm=null;}
  const originals={};
  for(const key of keys){
    if(T.hbImages[key])continue;
    const url=T.hbArt&&T.hbArt[key];
    if(url){
      const ver=(String(url).split('v=')[1]||'0').replace(/[^a-z0-9]/gi,''),path=fm?fm.joinPath(dir,'halcyon-'+key+'-'+ver+'.png'):null;
      try{if(path&&fm.fileExists(path)){const img=Image.fromFile(path);if(img){T.hbImages[key]=img;continue;}}}catch(e){}
      try{const data=await new Request(url).load(),img=data&&Image.fromData(data);if(img){T.hbImages[key]=img;if(path)try{fm.write(path,data);}catch(e){}}}catch(e){}
      continue;
    }
    if(T.hbSprites?.[key]){T.hbImages[key]=Image.fromData(Data.fromBase64String(T.hbSprites[key]));continue;}
    const [sheet,x,y,w,h]=HB_SPRITES[key], data=T.hbAssets?.[sheet]; if(!data)continue;
    const img=originals[sheet]||(originals[sheet]=Image.fromData(Data.fromBase64String(data)));
    const ratio=HB_SHEET_ASPECT[sheet]*w/h, W=360, H=W/ratio;
    const dc=new DrawContext();dc.size=new Size(W,H);dc.opaque=false;dc.respectScreenScale=false;
    dc.drawImageInRect(img,new Rect(-x*W/w,-y*H/h,W/w,H/h));T.hbImages[key]=dc.getImage();
  }
}
function hbSettings(value) {
  const fm=FileManager.local(),path=fm.joinPath(fm.documentsDirectory(),'foundry-halcyon-'+Script.name().replace(/[^a-z0-9_-]/gi,'_')+'.json');
  if(value){fm.writeString(path,JSON.stringify(value));return value;}
  try{if(!fm.fileExists(path))return {};const v=JSON.parse(fm.readString(path));return v&&typeof v==='object'?v:{};}catch(e){return {};}
}
async function hbChooseAllocation() {
  if(config.runsInWidget)return hbWidget('shift');
  const now=new Date(),end=new Date(+now+90*86400000);
  let events;
  try{events=(await CalendarEvent.between(now,end,[])).filter(e=>!e.isAllDay&&e.endDate>now).sort((a,b)=>a.startDate-b.startDate);}
  catch(e){const a=new Alert();a.title='Calendar unavailable';a.message='Allow Scriptable to read your calendars in Settings, then try again.';a.addAction('OK');await a.presentAlert();return hbWidget('shift');}
  const unique=events.filter((e,i,all)=>all.findIndex(q=>q.title===e.title&&q.calendar.identifier===e.calendar.identifier)===i);
  const a=new Alert();a.title='Choose your allocation';a.message='Track occurrences with this exact event title on this calendar, including repeats. Your calendar is not changed. Search covers the next 90 days.';
  unique.slice(0,80).forEach(e=>a.addAction(e.title+' · '+e.calendar.title));a.addCancelAction('Cancel');
  if(!unique.length){a.message='No timed events found in the next 90 days. Add an event in Calendar, then return.';a.addAction('OK');}
  const pick=await a.presentSheet();
  if(pick>=0&&unique[pick]){const e=unique[pick],settings=hbSettings();settings.allocation={match:'title',identifier:e.identifier,title:e.title,calendar:e.calendar.identifier};hbSettings(settings);}
  return hbWidget('shift');
}
async function hbChooseRadio() {
  if(config.runsInWidget)return hbWidget('audio');
  const settings=hbSettings(),a=new Alert();a.title='Halcyon Radio destination';a.message='The corporate programming is fictional. Choose the music app or stream that opens when you tap the channel.';a.addTextField('App or stream URL',settings.radio||'youtubemusic://');a.addAction('Save');a.addCancelAction('Cancel');
  if(await a.presentAlert()===0){const url=a.textFieldValue(0).trim();if(/^(https?:\/\/|[a-z][a-z0-9+.-]*:\/\/)/i.test(url)&&!/^javascript:/i.test(url)){settings.radio=url;hbSettings(settings);}}
  return hbWidget('audio');
}
async function hbClimate() {
  const wx=await weather();let atm=null,daylight=null,sun=null;
  try{
    const c=await coords();if(!c)return {wx};
    const req=new Request(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=relative_humidity_2m,wind_speed_10m&hourly=precipitation_probability,uv_index&daily=sunrise,sunset&forecast_days=2&timezone=auto&wind_speed_unit=mph&timeformat=unixtime`);req.timeoutInterval=12;
    const j=await req.loadJSON(),now=Date.now(),hour=j.hourly||{},idx=Math.max(0,(hour.time||[]).findIndex(t=>t*1000>=now));
    atm={rh:j.current?.relative_humidity_2m,ws:j.current?.wind_speed_10m==null?null:Math.round(j.current.wind_speed_10m),uv:hour.uv_index?.[idx],probs:hour.precipitation_probability?.slice(idx,idx+12)};
    const rise=(j.daily?.sunrise||[]).map(t=>t==null?NaN:t*1000),sets=(j.daily?.sunset||[]).map(t=>t==null?NaN:t*1000);
    sun=hbSunWindow(rise,sets,now);
    if(sun)daylight=(sun.phase==='day'?'SUNSET IN ':'SUNRISE IN ')+hbDuration(sun.remaining);
  }catch(e){}
  return {wx,atm,daylight,sun};
}
async function hbWidget(mode, extra={}) {
  const now=new Date(),d={mode,now,seed:Math.floor(+now/1800000),...extra};
  if(mode==='status'){
    d.wx=await weather();d.ev=evData(await nextEvent());try{d.batt=Device.batteryLevel();if(d.batt<0)d.batt=null;}catch(e){d.batt=null;}
  }
  if(mode==='shift'){
    try{const end=new Date(+now+90*86400000);d.allocation=hbAllocation(await CalendarEvent.between(new Date(+now-86400000),end,[]),hbSettings().allocation,now);}
    catch(e){d.allocation={phase:'error',title:'Allocation unavailable',note:'Calendar access is unavailable.'};}
  }
  if(mode==='solar')Object.assign(d,await hbClimate());
  if(mode==='transmission'){
    d.archival=!!T.archive&&d.seed%4===0;
    if(d.archival&&ARCHIVE.length){const q=ARCHIVE[Math.floor(d.seed/4)%ARCHIVE.length];d.text=q.t;d.by=q.by;}
    else{d.archival=false;const s=T.slogans[d.seed%T.slogans.length]||['You can leave the rest to us.','CONTINUITY SERVICES'];d.text=s[0];d.by=T.company.toUpperCase()+' / '+s[1];}
  }
  await hbLoadArt(mode);
  const [W,H]=DIMS[fam()]||DIMS.small,w=new ListWidget(),a=d.allocation;
  w.setPadding(0,0,0,0);w.backgroundColor=new Color(hbPalette(mode).bg);
  // WidgetDate updates the count without repeatedly running the script. iOS controls phase refresh timing.
  d.live=mode==='shift'&&!!a?.target;
  w.backgroundImage=artImage(W,H,hbPaint,d);
  w.refreshAfterDate=new Date(+now+15*60000);
  if(mode==='tracker'||mode==='dossier')w.refreshAfterDate=new Date((Math.floor(+now/1800000)+1)*1800000+1000);
  if(d.live){
    const target=a.phase==='active'?a.end:a.start;
    w.refreshAfterDate=new Date(Math.min(+now+15*60000,+target+1000));
    const {x,y,w:timerWidth,fs}=hbAllocationLayout(W,H);
    w.addSpacer(y);const row=w.addStack();row.layoutHorizontally();row.addSpacer(x);row.size=new Size(W,fs*1.45);
    const timer=row.addStack();timer.size=new Size(timerWidth,fs*1.45);
    const dt=timer.addDate(a.target);dt.applyTimerStyle();dt.font=disp(fs);dt.textColor=new Color(hbPalette(mode).ink);dt.lineLimit=1;dt.minimumScaleFactor=.5;row.addSpacer();w.addSpacer();
  }else if(mode==='feeds'&&W>200){
    const row=w.addStack();row.layoutHorizontally();row.size=new Size(W,H);for(const url of ['youtube://','instagram://app']){const half=row.addStack();half.size=new Size(W/2,H);half.url=url;half.addSpacer();}
  }
  const urls={status:'calshow://',shift:'calshow://',audio:hbSettings().radio||'youtubemusic://',feeds:'youtube://',youtube:'youtube://',instagram:'instagram://app',discord:'discord://'};
  if(urls[mode])w.url=urls[mode];
  if(mode==='shift'&&a?.phase==='setup')w.url=URLScheme.forRunningScript();
  return w;
}
