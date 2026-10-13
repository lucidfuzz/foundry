async function dzWidget(mode,extra={}){
  const now=new Date(),d={mode,now,seed:Math.floor(+now/1800000),...extra};
  if(mode==='status'||mode==='shift'){try{d.ev=evData(await nextEvent());}catch(e){d.ev=null;}}
  if(mode==='status'){d.wx=await weather();try{d.batt=Device.batteryLevel();if(d.batt<0)d.batt=null;}catch(e){d.batt=null;}}
  if(mode==='solar')Object.assign(d,await hbClimate());
  if(mode==='transmission'){d.archival=!!T.archive&&d.seed%4===0&&ARCHIVE.length>0;if(d.archival){const q=ARCHIVE[Math.floor(d.seed/4)%ARCHIVE.length];d.text=q.t;d.by=q.by;}else{const q=T.slogans[d.seed%T.slogans.length];d.text=q[0];d.by=T.company.toUpperCase()+' / '+q[1];}}
  const [W,H]=DIMS[fam()]||DIMS.small,w=new ListWidget();w.setPadding(0,0,0,0);w.backgroundColor=new Color(T.ground);const target=mode==='shift'&&d.ev?(d.ev.active?d.ev.end:d.ev.start):null;d.live=!!target;w.backgroundImage=artImage(W,H,dzPaint,d);w.refreshAfterDate=new Date((d.seed+1)*1800000+1000);
  if(target){w.refreshAfterDate=new Date(Math.min(+now+15*60000,+target+1000));const l=dzTimerLayout(W,H);w.addSpacer(l.y);const row=w.addStack();row.layoutHorizontally();row.addSpacer(l.x);const box=row.addStack();box.size=new Size(l.w,l.fs*1.4);const date=box.addDate(target);date.applyTimerStyle();date.font=Font.boldMonospacedSystemFont(l.fs);date.textColor=new Color(T.altBg);date.lineLimit=1;date.minimumScaleFactor=.5;row.addSpacer();w.addSpacer();}
  else if(mode==='feeds'&&W>200){const row=w.addStack();row.layoutHorizontally();row.size=new Size(W,H);for(const u of ['youtube://','instagram://app']){const half=row.addStack();half.size=new Size(W/2,H);half.url=u;half.addSpacer();}}
  const urls={status:'calshow://',shift:'calshow://',audio:'youtubemusic://',youtube:'youtube://',instagram:'instagram://app',discord:'discord://'};if(urls[mode])w.url=urls[mode];if(mode==='feeds'&&W<200)w.url='youtube://';return w;
}
