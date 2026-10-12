// Shared by the browser preview and Scriptable. All coordinates are widget points.
const HB_META = {
  status: ['W-01', 'SUBJECT STATUS', 'Care builds momentum.'],
  shift: ['W-02', 'ALLOCATION', 'Your time has been considered.'],
  solar: ['W-03', 'PERSONAL CLIMATE', 'A good day to breathe.'],
  audio: ['W-04', 'AUDIO CHANNEL', 'All selections cleared for emotional consistency.'],
  transmission: ['W-05', 'TRANSMISSION', 'Different voices. A longer human story.'],
  feeds: ['W-06', 'NEURAL LINK', 'Suggested for your current configuration.'],
  youtube: ['W-06', 'CULTURE FEED', 'Recommendations may become preferences.'],
  instagram: ['W-07', 'SPECIMEN ARCHIVE', 'Memories retained under your current plan.'],
  oddity: ['W-08', 'MOOD LEASE', 'Unused feelings do not roll over.'],
  discord: ['W-09', 'COLLECTIVE', 'Belonging is included.'],
  game: ['W-10', 'SPECIMEN VAT', 'Property status unchanged.'],
  tracker: ['HB-R', 'DISTANT CARE', 'Return address pending.']
};
// Normalized source rectangles avoid the culture atlas's dividing lines.
const HB_SHEET_ASPECT = {organs:3,culture:1,signal:1.5,celestial:1.5,'lungs-detail':1122/1402,'heart-detail':1122/1402};
const HB_SPRITES = {
  heartDetail:['heart-detail',0,0,1,1],
  lungsDetail:['lungs-detail',0,0,1,1],
  signal: ['signal',0,0,1,1],
  saturn:['celestial',0,0,1/3,.5], neptune:['celestial',1/3,0,1/3,.5], jupiter:['celestial',2/3,0,1/3,.5],
  knot:['celestial',0,.5,1/3,.5], membrane:['celestial',1/3,.5,1/3,.5], loops:['celestial',2/3,.5,1/3,.5],
  heart: ['organs', 0, 0, 1/3, 1], lungs: ['organs', 1/3, 0, 1/3, 1], tissue: ['organs', 2/3, 0, 1/3, 1],
  optical: ['culture', .009, .086, .484, .366], archive: ['culture', .509, .091, .48, .358],
  collective: ['culture', .016, .561, .477, .359], neural: ['culture', .523, .534, .46, .415]
};
function hbPalette(mode) {
  const dark = T.hbDark || mode === 'tracker';
  return { dark, ink: dark ? '#F2F6EA' : '#073C30', bg: dark ? '#0A2E26' : T.hbVariant ? T.panel :
    ['shift', 'transmission', 'discord'].includes(mode) ? '#EDE5FF' : mode === 'instagram' ? '#FFE4D7' :
    ['audio', 'youtube'].includes(mode) ? '#FBF8EF' : '#DEF9EE', mint: '#61DDB0', lilac: '#A88CEB' };
}
function hbClock(date) { return date ? new Date(date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false}) : '—'; }
function hbDuration(ms) {
  const n = Math.max(0, Math.floor(Math.abs(ms) / 1000)), h = Math.floor(n / 3600);
  return `${h}:${String(Math.floor(n / 60) % 60).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
}
function hbSunWindow(rise,sets,now) {
  const i=sets.findIndex(t=>Number.isFinite(t)&&t>now);
  if(i>=0&&Number.isFinite(rise[i])&&rise[i]<=now&&sets[i]>rise[i])return {phase:'day',remaining:sets[i]-now,left:Math.max(0,Math.min(1,(sets[i]-now)/(sets[i]-rise[i])))};
  const next=rise.find(t=>Number.isFinite(t)&&t>now);
  return next==null?null:{phase:'night',remaining:next-now,left:0};
}
function hbAllocation(events, selection, now) {
  const valid = events.filter(e => !e.isAllDay && Number.isFinite(+new Date(e.startDate)) && +new Date(e.endDate) > +new Date(e.startDate));
  const matches = valid.filter(e => selection && (e.calendar?.identifier || '') === selection.calendar &&
    (selection.match === 'title' ? e.title === selection.title : e.identifier === selection.identifier));
  const sorted = matches.sort((a,b) => +new Date(a.startDate) - +new Date(b.startDate));
  const ev = sorted.find(e => +new Date(e.startDate) <= +now && +new Date(e.endDate) > +now) || sorted.find(e => +new Date(e.startDate) > +now);
  if (!selection) return {phase:'setup', title:'Your next allocation', note:'Choose an allocation in Scriptable.'};
  if (!ev) return {phase:'waiting', title:selection.title, note:'No matching occurrence in the next 90 days.'};
  const start = new Date(ev.startDate), end = new Date(ev.endDate), active = start <= now;
  return {phase:active?'active':'before',title:ev.title,start,end,target:active?start:start,
    frac:active?Math.max(0,Math.min(1,(now-start)/(end-start))):0,
    label:active?'TIME IN ALLOCATION':'NEXT ALLOCATION IN',note:active?'Release at '+hbClock(end):'Begins '+start.toLocaleDateString([], {month:'short',day:'numeric'})+' · '+hbClock(start)};
}
function hbSeal(k, x, y, r, color) {
  // Six folded growth lobes make a compact abstract corporate approval seal.
  for (let i=0;i<6;i++) {
    const a=i*Math.PI/3,points=[];
    for(let j=0;j<=28;j++){const u=j<=14?j/14:(28-j)/14,side=j<=14?1:-1,q=a+u*.5,rr=r*(.13+.82*u),th=side*Math.sin(u*Math.PI)*r*.14;points.push([x+Math.cos(q)*rr-Math.sin(q)*th,y+Math.sin(q)*rr+Math.cos(q)*th]);}
    k.poly(points,color);
  }
  k.circ(x,y,r*.17,color);
}
function hbField(k,x,y,w,h,seed=0) {
  for(let j=0;j<64;j++) {
    const pts=[];for(let i=0;i<=160;i++) {const t=i/160, envelope=Math.sin(t*Math.PI);pts.push([x+t*w,y+h/2+Math.sin(t*22+j*.065+seed)*envelope*h*.35*Math.abs(Math.sin(t*9+.6))+Math.sin(t*49+j*.12)*envelope*h*.055+(j-32)*h*.004]);}
    k.ln(pts,k.a(j<32?'#9B7FD3':'#4A9C86',.36),.4);
  }
  for(let n=0;n<12;n++){const xx=x+w*(.1+n*.071), yy=y+h/2+Math.sin(n*2.1+seed)*h*.28;k.circ(xx,yy,1.2,k.a('#7C65AD',.4));}
}
function hbArt(k,key,x,y,w,h) {
  const img=T.hbImages && T.hbImages[key];
  if(img){ const a=HB_SPRITES[key], ratio=HB_SHEET_ASPECT[a[0]]*a[3]/a[4]; const dw=Math.min(w,h*ratio), dh=dw/ratio;k.dc.drawImageInRect(img,new Rect(x+(w-dw)/2,y+(h-dh)/2,dw,dh)); }
}
// This size has its own composition: live instrumentation sits beside a full-height specimen.
function hbClimateMedium(k,W,H,d) {
  const p=hbPalette('solar'), ink=k.a(p.ink,1), rule=k.a(p.ink,.35), faint=k.a(p.ink,.13);
  const wx=d.wx||{},atm=d.atm||{},sun=d.sun||{};
  const text=(s,x,y,size,w,f='mono',c=ink)=>k.t(s,x,y,size,c,{w,f});
  const ln=(x,y,xx,yy,c=rule,width=.45)=>k.ln([[x,y],[xx,yy]],c,width);
  const cross=(x,y,r=4)=>{ln(x-r,y,x+r,y,ink);ln(x,y-r,x,y+r,ink);};
  k.rect(0,0,W,H,k.a(p.bg,1));
  // Fine translucent bands give the surface a luminous, softly lit finish in both runtimes.
  for(let y=0;y<H;y+=2)k.rect(0,y,W,2,k.a('#FFFFFF',p.dark?.025:.16+.26*Math.sin(y/H*Math.PI)));
  for(let i=0;i<17;i++)k.ell(265,87,49+i*1.5,56+i*.9,null,k.a(p.mint,.12),.35);
  // Registration, batch identity and restrained instrument frame.
  for(let i=0;i<9;i++)if(i!==2&&i!==7)k.rect(10+i%3*3.3,8+Math.floor(i/3)*3.3,2.7,2.7,ink);
  text('W-03 / PERSONAL CLIMATE',26,9,6.5,180);
  text('LOT 6681-204',282,10,4.7,64);k.rect(349,9,5,5,ink);
  ln(10,22,354,22);ln(10,156,354,156);
  // Typography and information hierarchy follow the approved campaign card.
  const temp=wx.temp==null?'—':String(wx.temp);
  k.dc.setFont(new Font('Georgia-BoldItalic',temp.length>3?37:48));k.dc.setTextColor(ink);
  k.dc.setTextAlignedLeft();k.dc.drawTextInRect(temp+'°',new Rect(9,25,100,58));
  const condition=(wx.cond||'Weather unavailable').toLowerCase().replace(/^./,s=>s.toUpperCase());
  text(condition,11,75,condition.length>16?10:14,99,'disp');
  ln(109,30,109,90);
  text('DAYLIGHT LEFT',119,30,5.2,77);
  text(sun.left==null?'—':Math.round(sun.left*100)+'%',119,39,23,68,'disp');
  const daylightLabel=sun.phase==='night'?'SUNRISE IN':'SUNSET IN';
  text(sun.phase?daylightLabel:'DAYLIGHT',119,67,5.2,79);
  const duration=sun.remaining==null?'—':hbDuration(sun.remaining).split(':').slice(0,2).map(s=>s.padStart(2,'0')).join(':');
  text(duration,119,76,16,78,'disp');
  if(sun.phase){
    for(let i=5;i>=0;i--)k.circ(181,50,11+i*1.15,k.a(sun.phase==='night'?p.lilac:'#FFF6C2',i? .035:.86));
    for(let i=1;i<=3;i++)k.circ(181,50,11+i*1.8,null,k.a(p.ink,.1),.3);
    if(sun.phase==='night')k.circ(185,47,9,k.a(p.bg,1));
  }
  ln(10,95,198,95);
  // Small instrument glyphs are native paths; all values remain real data.
  k.ln([[17,101],[12,109],[12,112],[14,114],[18,114],[20,112],[20,109],[17,101]],ink,.95);
  text('HUMIDITY',25,99,4.8,43);text(atm.rh==null?'—':Math.round(atm.rh)+'%',25,106,14,46,'disp');
  ln(74,99,74,118);
  ln(81,106,93,106,ink,.85);ln(79,110,95,110,ink,.85);ln(82,113,91,113,ink,.85);
  k.arc(93,104,2.2,-Math.PI*.5,Math.PI*.7,ink,.8);
  text('WIND',100,99,4.8,36);text(atm.ws==null?'—':Math.round(atm.ws)+' mph',100,107,12,43,'disp');
  ln(145,99,145,118);
  k.circ(157,108,3.4,null,ink,.85);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;ln(157+Math.cos(a)*5.4,108+Math.sin(a)*5.4,157+Math.cos(a)*7.2,108+Math.sin(a)*7.2,ink,.8);}
  text('UV',170,99,4.8,27);text(atm.uv==null?'—':Math.round(atm.uv),170,107,14,27,'disp');
  ln(10,121,198,121);
  text('RAIN PROBABILITY',11,123,4.8,107);text('NEXT 12H',165,123,4.4,33);
  const probs=atm.probs?.slice(0,12)||[],gx=27,gy=145,gw=170,gh=13;
  if(probs.some(v=>v!=null&&Number.isFinite(v))){
    for(let j=0;j<=2;j++){const yy=gy-j*gh/2;ln(gx,yy,gx+gw,yy,faint,.35);text(String(j*50),11,yy-2,3.8,14);}
    probs.forEach((v,i)=>{const x=gx+i*gw/12;if(v==null||!Number.isFinite(v))return;const h=Math.max(.35,Math.max(0,Math.min(100,v))*gh/100);k.rect(x,gy-h,gw/12-.5,h,k.a(p.mint,.4),rule,.4);for(let yy=gy-2;yy>gy-h;yy-=2)ln(x,yy,x+gw/12-.5,yy,k.a(p.ink,.18),.25);});
    [[0,'NOW'],[3,'+3H'],[6,'+6H'],[9,'+9H']].forEach(([i,s])=>text(s,gx+i*gw/12,148,3.9,26));
  }else text('Forecast unavailable',11,136,6.2,184);
  // The illustration remains a separate production asset; labels stay crisp and editable.
  hbArt(k,T.hbImages?.lungsDetail?'lungsDetail':'lungs',201,19,123,137);
  text('HALCYON BIOFAB',231,129,3.7,60,'mono',k.a('#073C30',1));
  text('RESPIRATORY UNIT',231,134,3.6,62,'mono',k.a('#073C30',1));
  text('HB-R2290-LG',231,139,3.1,60,'mono',k.a('#073C30',1));
  ln(327,35,327,92,faint);
  ['CLEANER','AIR.','BRIGHTER','DAYS.','TOGETHER.'].forEach((s,i)=>text(s,332,39+i*8,4.1,28));
  cross(340,127,5);text('O₂ / 03',330,144,3.7,26);
  text('A good day to breathe.',11,160,5.2,193);text('ATMOS v1.2',300,160,4.6,49);k.rect(350,160,4,4,ink);
}
