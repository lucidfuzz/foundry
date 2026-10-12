// Keep the existing calendar, weather and salvage persistence adapters.
async function drWidget(mode,extra={}) {
  const now=new Date(),d={mode,now,seed:Math.floor(+now/1800000),...extra};
  if(mode==='status'||mode==='shift')d.ev=evData(await nextEvent());
  if(mode==='status'){
    d.wx=await weather();try{d.batt=Device.batteryLevel();if(d.batt<0)d.batt=null;}catch(e){d.batt=null;}
  }
  if(mode==='solar')Object.assign(d,await hbClimate());
  if(mode==='transmission'){
    d.archival=!!T.archive&&d.seed%4===0&&ARCHIVE.length>0;
    if(d.archival){const q=ARCHIVE[Math.floor(d.seed/4)%ARCHIVE.length];d.text=q.t;d.by=q.by;}
    else{const q=T.slogans[d.seed%T.slogans.length]||['Contact lost is not contact gone.','RANGE CONTROL'];d.text=q[0];d.by=T.company.toUpperCase()+' / '+q[1];}
  }
  const [W,H]=DIMS[fam()]||DIMS.small,w=new ListWidget();w.setPadding(0,0,0,0);w.backgroundColor=new Color('#050608');
  const target=mode==='shift'&&d.ev?(d.ev.active?d.ev.end:d.ev.start):null;d.live=!!target;
  w.backgroundImage=artImage(W,H,drPaint,d);w.refreshAfterDate=new Date(+now+15*60000);
  if(target){
    w.refreshAfterDate=new Date(Math.min(+now+15*60000,+target+1000));const l=drTimerLayout(W,H);
    w.addSpacer(l.y);const row=w.addStack();row.layoutHorizontally();row.addSpacer(l.x);row.size=new Size(W,l.fs*1.35);
    const stack=row.addStack();stack.size=new Size(l.w,l.fs*1.35);const dt=stack.addDate(target);dt.applyTimerStyle();dt.font=disp(l.fs);dt.textColor=new Color(T.ink);dt.lineLimit=1;dt.minimumScaleFactor=.5;row.addSpacer();w.addSpacer();
  } else if(mode==='feeds'&&W>200){
    const row=w.addStack();H>200?row.layoutVertically():row.layoutHorizontally();row.size=new Size(W,H);
    for(const url of ['youtube://','instagram://app']){const half=row.addStack();half.size=new Size(H>200?W:W/2,H>200?H/2:H);half.url=url;half.addSpacer();}
  }
  const urls={status:'calshow://',shift:'calshow://',audio:'youtubemusic://',feeds:'youtube://',youtube:'youtube://',instagram:'instagram://app',discord:'discord://'};if(urls[mode])w.url=urls[mode];
  return w;
}
