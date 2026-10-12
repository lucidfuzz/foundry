// Halcyon labels never end in "…" (Foundry rule): when a label doesn't fit its box, shrink it a little, then drop trailing
// " / " segments or words. A decorative label that can't fit even one word is skipped. Labels that already fit are unchanged.
function hbFitText(k,s,x,y,fs,col,o){
  s=String(s);const f=o.f||'mono',w=o.w||320,E=f==='disp'?0.52:0.62,cap=sz=>Math.max(1,Math.floor(w/(sz*E)));
  if(s.length<=cap(fs)){k.t(s,x,y,fs,col,o);return;}
  let sz=fs;const floor=Math.max(3.2,fs*0.8);while(sz>floor&&s.length>cap(sz))sz=Math.round((sz-0.1)*100)/100;
  if(s.length>cap(sz)){const segs=s.split(' / ');while(segs.length>1&&segs.join(' / ').length>cap(sz))segs.pop();s=segs.join(' / ');}
  if(s.length>cap(sz)){const words=s.split(' ');while(words.length>1&&words.join(' ').length>cap(sz))words.pop();s=words.join(' ');}
  if(s.length>cap(sz))return;
  k.t(s,x,y,sz,col,o);
}
// Halcyon production revision: clinical instruments informed by the user's phone references.
// A common hierarchy at every size; illustration belongs inside a measured specimen field.
const HB_CLINICAL={
  status:['SUBJECT STATUS','SUBJECT RECORD / ACTIVE'],shift:['ALLOCATION','TIME REMAINS COMPANY PROPERTY'],
  solar:['SOLAR + ATMOS','EXTERIOR CONDITIONS / MONITORED'],audio:['AUDIO CHANNEL','PROGRAMMING / PRE-APPROVED'],
  transmission:['TRANSMISSION','ARCHIVE / ROUTE / PRESERVE'],feeds:['NEURAL INTAKE','INPUT SUBJECT TO RETENTION'],
  youtube:['BROADCAST INTAKE','WATCH AS DIRECTED'],instagram:['PEER OBSERVATION','OBSERVE / COMPARE / REPEAT'],
  oddity:['AFFECT REGISTER','UNUSED FEELINGS DO NOT ROLL OVER'],discord:['COLLECTIVE','INDIVIDUALITY RETAINED ON FILE'],
  game:['SPECIMEN VAT','CHARGE TO FEED / PROPERTY STATUS UNCHANGED'],tracker:['DISTANT OBSERVATION','SIM ARRAY / RETURNS SUBJECT TO CLASSIFICATION'],dossier:['TARGET DOSSIER','HALCYON REMOTE CUSTODY / SCAN RECORD']
};
function hbPalette(mode){const dark=!!T.hbDark||mode==='tracker';return {dark,ink:dark?'#C3F0DA':'#102B24',bg:dark?'#10251F':T.hbVariant?T.panel:'#D9EEE3',mint:'#6ABBA0',lilac:'#9981DE'};}
function hbAllocationLayout(W,H){return H>200?{x:14,y:93,w:224,fs:48}:W<200?{x:12,y:77,w:146,fs:27}:{x:12,y:64,w:195,fs:35};}
function hbClinicalFrame(k,W,H,d){
  const p=hbPalette(d.mode),small=W<200,big=H>200,ink=k.a(p.ink,1),soft=k.a(p.ink,.68),rule=k.a(p.ink,.28),faint=k.a(p.ink,.08);
  const t=(s,x,y,fs=6.3,w=W-x-12,f='mono',col=ink)=>hbFitText(k,String(s),x,y,fs,col,{w,f});
  const line=(x,y,xx,yy,col=rule,lw=.5)=>k.ln([[x,y],[xx,yy]],col,lw);
  const hr=(y,x=12,w=W-24)=>line(x,y,x+w,y);
  const title=(s,x,y,w,fs=22,max=2,min=12)=>{const f=fitFs(k,String(s),w,max,fs,'disp',min);return k.para(String(s),x,y,w,f,ink,'disp',max,1.04)*f*1.04+y;};
  const grid=(x,y,w,h,step=10)=>{for(let xx=x;xx<=x+w;xx+=step)line(xx,y,xx,y+h,faint,.35);for(let yy=y;yy<=y+h;yy+=step)line(x,yy,x+w,yy,faint,.35);};
  const bar=(x,y,w,h,val,col=p.ink,n=20)=>{for(let i=0;i<n;i++)k.rect(x+i*w/n,y,w/n-1,h,val!=null&&i/n<Math.max(0,Math.min(1,val))?k.a(col,.88):k.a(p.ink,.12));};
  const cross=(x,y,r=3,col=soft)=>{line(x-r,y,x+r,y,col);line(x,y-r,x,y+r,col);};
  const art=(key,x,y,w,h)=>hbArt(k,key,x,y,w,h);
  k.rect(0,0,W,H,k.a(p.bg,1));
  for(let y=25;y<H-17;y+=4)for(let x=3;x<W;x+=4)k.rect(x,y,.55,.55,k.a(p.ink,.11));
  const alt=typeof FLIP!=='undefined'&&FLIP!==null?FLIP==='alt':['shift','transmission','instagram','oddity','tracker','dossier'].includes(d.mode),head=alt?p.lilac:'#0B211A',hc=k.a(alt?'#10251F':'#BCEFD7',1);
  k.rect(0,0,W,22,k.a(head,1));
  const short={status:'SUBJECT',solar:'SOLAR + ATMOS',transmission:'TRANSMISSION',instagram:'OBSERVATION',youtube:'BROADCAST',tracker:'OBSERVATION'};
  t(HB_META[d.mode][0]+' // '+(small?short[d.mode]||HB_CLINICAL[d.mode][0]:HB_CLINICAL[d.mode][0]),10,7,small?5.8:7,small?W-22:218,'mono',hc);
  if(!small)t(d.mode==='game'?'LOT '+(d.st?.lot||'UNASSIGNED'):d.mode==='audio'?'CH 08 / CLEARED':'HB-2893 / '+HB_VERSIONS[d.mode],W-132,8,5.5,120,'mono',hc);
  hr(H-19);t(small?'HALCYON / '+({game:'PROPERTY',solar:'ATMOS',audio:'CONTROL',transmission:'INBOUND'}[d.mode]||'BIOFAB'):HB_CLINICAL[d.mode][1],12,H-13,small?5.3:5.7,W-29);k.rect(W-16,H-12,4,4,k.a(p.lilac,1));
  const c={k,W,H,d,p,small,big,ink,soft,rule,faint,t,line,hr,title,grid,bar,cross,art};
  c.field=(lab,val,x,y,w=95,fs=18)=>{t(lab,x,y,6,w,'mono',soft);t(val??'—',x,y+10,fs,w,'disp');};
  c.specimen=(key,x,y,w,h,label)=>{
    grid(x,y,w,h,10);k.rect(x,y,w,h,null,rule,.6);art(key,x+5,y+5,w-10,h-22);
    for(const [xx,yy,dx,dy]of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]])k.ln([[xx,yy+dy*6],[xx,yy],[xx+dx*6,yy]],k.a(p.lilac,.85),.8);
    for(let yy=y+16;yy<y+h-18;yy+=5){line(x+3,yy,x+(Math.round(yy-y)%10<5?8:6),yy,soft,.4);line(x+w-3,yy,x+w-6,yy,soft,.4);}
    if(w>95){t('HB / SCAN-'+String(Math.abs(d.seed||0)%97).padStart(2,'0'),x+9,y+5,4.2,w-18,'mono',soft);t('CUSTODY '+HB_LOTS[d.mode],x+9,y+h-22,4.2,w-18,'mono',soft);}
    if(w/h>2.6){['PHASE / 0.003','RECALL / SEALED','INTENT / PENDING'].forEach((s,i)=>t(s,x+13,y+21+i*9,4.7,w*.3,'mono',soft));['ROUTE 7A > 03','MIND / ESCROW','ACK / WITHHELD'].forEach((s,i)=>t(s,x+w-91,y+21+i*9,4.7,80,'mono',soft));}
    t(label,x+6,y+h-12,5,w-12);
  };
  return c;
}
function hbClinicalTrace(c,x,y,w,h,seed=0){c.grid(x,y,w,h);const pts=[];for(let i=0;i<=100;i++){const u=i/100,beat=Math.exp(-Math.pow(((u*4+seed*.07)%1-.27)/.028,2))*.7-Math.exp(-Math.pow(((u*4+seed*.07)%1-.32)/.033,2))*.35;pts.push([x+u*w,y+h*.65-h*(beat+Math.sin(i*.19)*.07)]);}c.k.ln(pts,c.ink,.8);}
function hbClinicalGenome(c,x,y,w,h,seed=1){const r=c.k.rng(seed);for(let xx=x;xx<x+w-2;){const b=1+r()*2;c.k.rect(xx,y,Math.min(b,x+w-xx),h,c.k.a(r()>.82?c.p.lilac:c.p.ink,.8));xx+=b+1+r()*1.3;}}
function hbClinicalHelix(c,x,y,w,h,seed=0){
  for(let i=0;i<=48;i++){const u=i/48,dy=Math.sin(u*Math.PI*5+seed)*h*.4;c.line(x+u*w,y+h/2-dy,x+u*w,y+h/2+dy,c.rule,.5);}
  for(let j=0;j<2;j++){const pts=[];for(let i=0;i<=120;i++){const u=i/120;pts.push([x+u*w,y+h/2+Math.sin(u*Math.PI*5+seed+j*Math.PI)*h*.4]);}c.k.ln(pts,j?c.k.a(c.p.lilac,.9):c.ink,1);}
}
function hbClinicalIntakePlot(c,mode,x,y,w,h,seed){
  if(mode==='feeds'){hbClinicalTrace(c,x,y,w,h,seed);return;}
  c.grid(x,y,w,h,Math.max(8,h/3));const rnd=c.k.rng(seed+41);
  if(mode==='instagram'){for(let i=0;i<32;i++){const v=.2+rnd()*.75;c.k.rect(x+i*w/32,y+h*(1-v),w/32-2,h*v,c.k.a(i%7===0?c.p.lilac:c.p.ink,.72));}return;}
  if(mode==='youtube'){const pts=[];for(let i=0;i<=70;i++){const u=i/70,v=.18+u*.62+(rnd()-.5)*.08-(i%17===0?.12:0);pts.push([x+u*w,y+h*Math.max(.04,Math.min(.96,v))]);}c.k.ln(pts,c.ink,.9);c.k.rect(x+w-2,pts[pts.length-1][1]-1.5,3,3,c.k.a(c.p.lilac,1));return;}
  const pts=Array.from({length:11},(_,i)=>[x+(i+.5)*w/11,y+h*(.15+rnd()*.7)]);pts.forEach((p,i)=>{if(i)c.line(...pts[i-1],...p,c.rule,.65);if(i>2)c.line(...pts[i-3],...p,c.rule,.4);c.k.circ(p[0],p[1],1.8,c.k.a(i%3?c.p.ink:c.p.lilac,1));});
}
function hbClinicalStatus(c){const {d,small,big,t,title,hr,line,field,specimen}=c,ev=d.ev,wx=d.wx||{},date=new Date(d.now||Date.now()),end=ev?.end;
  if(small){t(ev?.active?'ALLOCATION ACTIVE':'NEXT ALLOCATION',12,32,6,146);title(ev?.title||'No allocation on file',12,45,146,16,2);t(ev?hbClock(ev.start):'—',12,88,22,146,'disp');hr(117);field('EXTERIOR',wx.temp==null?'—':wx.temp+'°',12,124,70,17);field('CELL',d.batt==null?'—':Math.round(d.batt*100)+'%',92,124,65,17);return;}
  const w=big?184:213;t(ev?.active?'ALLOCATION ACTIVE':'NEXT ALLOCATION',12,32,6.4,w);title(ev?.title||'No allocation on file',12,45,w,big?28:23,2);
  t(ev?hbClock(ev.start)+(end?' — '+hbClock(end):''):'CALENDAR / UNAVAILABLE',12,big?112:98,8.5,w);field('STATUS',ev?(ev.active?'IN PROGRESS':'QUEUED'):'UNASSIGNED',12,big?139:119,100,small?12:13);
  field('CELL',d.batt==null?'—':Math.round(d.batt*100)+'%',big?125:131,big?139:119,90,14);
  specimen(T.hbImages?.heartDetail?'heartDetail':'heart',big?222:245,31,big?129:106,big?173:91,'CARDIAC / HB-C1137');
  t(wx.temp==null?'—':wx.temp+'°',big?222:245,big?217:128,24,60,'disp');t((wx.cond||'UNAVAILABLE').toUpperCase(),big?222:302,big?248:131,big?6.5:5.3,big?129:50);
  if(big){hr(183,12,188);t('SUBJECT / CONTINUITY RECORD',12,192,6,188);t(date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}).toUpperCase(),12,207,8,188);t('CLASS / COMPANY ISSUED',12,226,6,188);t('RELEASE / PER SCHEDULE',12,241,6,188);hr(271);field('FEELS LIKE',wx.feels==null?'—':wx.feels+'°',12,280,103,22);field('HIGH / LOW',wx.hi==null?'—':wx.hi+'° / '+(wx.lo??'—')+'°',130,280,121,22);field('CELL RESERVE',d.batt==null?'—':Math.round(d.batt*100)+'%',267,280,85,22);c.bar(12,323,340,6,d.batt);t('IDENTITY RETAINED / TRANSFER NOT AUTHORISED',12,342,6,340);}
}
function hbClinicalAllocation(c){const {d,small,big,W,t,title,hr,field}=c,a=d.allocation||{phase:'setup',title:'Allocation required'},active=a.phase==='active',q=hbAllocationLayout(W,c.H);
  t(active?'ALLOCATED ACTIVITY':'NEXT ALLOCATION',12,31,6,W-24);title(a.title||'Allocation required',12,small?41:big?43:40,small?146:big?332:193,small?14:big?22:16,small?2:1);
  if(!d.live)t(a.target?hbDuration((d.now||new Date())-a.target):'— : — —',q.x,q.y,q.fs,q.w,'disp');
  if(small){t(active?'TIME IN ALLOCATION':'UNTIL START',12,118,6,146);c.bar(12,130,146,5,a.target?a.frac:null,c.p.ink);t(a.start?'IN '+hbClock(a.start):'OPEN SETUP',12,141,5.7,72);t(a.end?'OUT '+hbClock(a.end):'',92,141,5.7,66);return;}
  if(!big){c.line(219,32,219,112);field('ASSIGNED START',a.start?hbClock(a.start):'—',234,33,118,22);field('RELEASE AT',a.end?hbClock(a.end):'—',234,77,118,22);t(active?'TIME IN ALLOCATION':'UNTIL START / HALCYON ASSIGNED',12,118,6.5,201);c.bar(12,130,340,6,a.target?a.frac:null);t(a.note||'CHOOSE ALLOCATION IN SCRIPTABLE',12,142,5.6,340);return;}
  t(active?'TIME IN ALLOCATION':'UNTIL START',14,166,7,320);hr(180);field('ASSIGNED START',a.start?hbClock(a.start):'—',14,192,154,27);field('RELEASE AT',a.end?hbClock(a.end):'—',197,192,154,27);c.bar(14,245,336,9,a.target?a.frac:null,c.p.lilac,32);
  for(let i=0;i<=12;i++)c.line(14+i*28,258,14+i*28,264,c.rule,.6);t('00',14,270,6,60);t('ALLOCATED INTERVAL',111,270,7,177);t('100%',315,270,6,35);hr(293);t('AUTHORITY / HALCYON SCHEDULING',14,305,7,336);t('CONSENT / RETAINED UNDER EXISTING TERMS',14,322,6.4,336);t(a.note||'Choose an allocation in Scriptable.',14,343,6.6,336);
}
function hbClinicalWeather(c){const {d,small,big,W,t,title,field,specimen,hr}=c,wx=d.wx||{},atm=d.atm||{},sun=d.sun,has=sun?.remaining!=null;
  if(small){field('AIR TEMPERATURE',wx.temp==null?'—':wx.temp+'°',12,32,146,38);title(wx.cond||'Weather unavailable',12,88,146,15,1);t(sun?.phase==='night'?'SUNRISE IN':'SUNSET IN',12,115,6,146);t(has?hbDuration(sun.remaining):'—',12,128,20,146,'disp');return;}
  field('AIR TEMPERATURE',wx.temp==null?'—':wx.temp+'°',12,32,big?179:94,big?44:37);
  t((wx.cond||'UNAVAILABLE').toUpperCase(),12,big?96:91,big?6.5:5.6,big?175:102);
  const sx=big?12:118,sy=big?113:32;field(sun?.phase==='night'?'NIGHT CYCLE':'DAYLIGHT LEFT',sun?.left==null?'—':Math.round(sun.left*100)+'%',sx,sy,big?166:113,big?24:22);t(sun?.phase==='night'?'SUNRISE IN':'SUNSET IN',sx,big?154:77,6,big?168:113);t(has?hbDuration(sun.remaining):'—',sx,big?166:89,big?22:17,big?170:119,'disp');
  if(big){const pts=[];for(let j=0;j<=50;j++){const u=j/50;pts.push([12+177*u,226-Math.sin(u*Math.PI)*23]);}c.k.ln(pts,c.soft,.9);c.line(12,226,189,226,c.ink,.7);for(let j=0;j<=12;j++)c.line(12+j*177/12,226,12+j*177/12,229,c.soft,.5);if(sun){const u=sun.phase==='day'?Math.max(0,Math.min(1,1-sun.left)):0;c.k.rect(12+177*u-1,226-Math.sin(u*Math.PI)*23-2,4,4,c.k.a(c.p.lilac,1),c.ink,.6);}t('RISE',12,232,4.8,29);t('SOLAR ARRAY',68,232,4.8,88);t('SET',171,232,4.8,22);}
  specimen(T.hbImages?.lungsDetail?'lungsDetail':'lungs',big?201:259,31,big?151:93,big?194:113,'RESPIRATORY / R2290');
  if(!big){hr(115,12,231);[['RH',atm.rh==null?'—':atm.rh+'%'],['WIND',atm.ws==null?'—':atm.ws+' mph'],['UV',atm.uv??'—']].forEach(([lab,val],i)=>field(lab,val,12+i*80,122,76,14));return;}
  hr(240);[['HUMIDITY',atm.rh==null?'—':atm.rh+'%'],['WIND',atm.ws==null?'—':atm.ws+' mph'],['UV INDEX',atm.uv??'—']].forEach(([lab,val],i)=>field(lab,val,12+i*116,250,105,23));
  t('PRECIPITATION PROBABILITY / NEXT 12H',12,300,6.2,340);c.grid(12,315,340,34,17);const probs=atm.probs||[];if(probs.some(v=>v!=null)){probs.slice(0,12).forEach((v,i)=>{if(v==null)return;const h=Math.max(.5,Math.min(100,Math.max(0,v))*.32);c.k.rect(14+i*28,348-h,23,h,c.k.a(c.p.ink,.55));});}else t('FORECAST UNAVAILABLE',20,327,6.5,320);t('NOW',12,353,5,45);t('+6H',170,353,5,45);t('+12H',319,353,5,33);
}
function hbClinicalRadio(c){const {small,big,t,title,hr}=c;
  if(small){t('CH 08 / PRE-APPROVED',12,33,6,146);title('Ambient\npacification.',12,48,146,22,2);hbApproval(c,133,126,18);t('HALCYON RADIO',12,112,6,105);t('OPEN CHANNEL >',12,137,6.5,114);return;}
  hbApproval(c,45,big?66:58,25);for(let j=0;j<32;j++){const a=j*Math.PI/16,r=j%4?28:27; c.line(45+Math.cos(a)*r,(big?66:58)+Math.sin(a)*r,45+Math.cos(a)*31,(big?66:58)+Math.sin(a)*31,c.soft,.6);}title('Ambient pacification.',85,34,267,big?29:23,1);t('SIGNAL / CORPORATE BROADCAST',86,big?74:63,6.3,266);t('CHANNEL 08 / PROGRAMMING CLEARED',86,big?89:79,5.8,266);
  if(!big){c.grid(12,100,340,31,17);hbField(c.k,12,100,340,31,1.3);t('20 Hz',12,140,5.5,64);t('LICENSED / MODEL SPECTRUM',103,140,5.6,211);t('20 kHz',311,140,5.5,41);return;}
  hr(110);t('LICENSED SPECTRUM / PROGRAMME MODEL',12,120,6.5,340);c.grid(12,142,340,104,17);hbField(c.k,12,145,340,97,1.3);[20,200,2000,20000].forEach((n,i)=>t(String(n)+' Hz',12+i*96,250,5.5,53));hr(270);c.field('OVERSIGHT','HALCYON',12,282,165,23);c.field('OVERRIDE','WITHHELD',198,282,152,23);t('OPEN RADIO >',12,331,8,160);t('A FAMILIAR VOICE IS SUFFICIENT.',12,349,6,340);
}
function hbClinicalTransmission(c){const {d,small,big,t,title,hr}=c,quote=d.text||'Your preferences have been retained.',by=d.by||'HALCYON BIOFAB / CONTINUITY SERVICES';
  t(d.archival?'CLASS / ARCHIVAL':'CLASS / CORPORATE',12,31,6,c.W-24);
  if(small){const end=title(quote,12,44,146,16,4,11);t(by,12,Math.min(end+4,117),5.6,146);hbClinicalHelix(c,12,132,146,14,0);return;}
  const end=title(quote,12,46,340,big?29:19,big?4:2,big?18:12);t(by,12,Math.min(end+5,big?174:91),big?7:5.8,340);
  if(!big){t('ROUTING / ARCHIVE > SUBJ.07',12,105,5.8,216);t('PRIORITY / FILED',240,105,5.8,112);t('CRC 3679-DF9C',12,115,4.6,100);t('CIPHER / PUBLIC',133,115,4.6,113);t('INTEGRITY 97.6%',267,115,4.6,85);hbClinicalHelix(c,12,125,340,17);return;}
  hr(194);t('ROUTING / ARCHIVE > SUBJECT 07',12,203,6.5,340);t('SOURCE ATTRIBUTION / RETAINED',12,218,6,340);c.specimen('signal',12,238,340,78,'FILAMENT ARRAY / RECONSTRUCTION');hbClinicalHelix(c,12,327,340,23);t('SEQUENCE 7A-3F / NO REPLY REQUIRED',12,354,5.5,340);
}
function hbClinicalIntake(c){const {d,small,big,W,t,title,field,hr,specimen}=c,mode=d.mode;
  const config={feeds:['Neural intake','neural','YOUTUBE','INSTAGRAM'],youtube:['Approved viewing','optical','YOUTUBE',''],instagram:['Peer observation','archive','INSTAGRAM',''],discord:['Collective index','collective','DISCORD','']}[mode],seed=Math.abs(d.seed||0),v=seed%3;
  const states={feeds:['INPUT APPROVED','EXTERNAL SIGNAL','INTAKE QUEUED'],youtube:['CONTINUITY FILM','APPROVED VIEWING','RETENTION LOOP'],instagram:['PEER OBSERVATION','ARCHIVE REVIEW','COMPARISON CYCLE'],discord:['DIRECTORY SYNC','GROUP ALIGNMENT','MEMBERSHIP REVIEW']}[mode];
  const metrics={feeds:[['SIGNAL MIX','08 : 92'],['QUARANTINE','ACTIVE']],youtube:[['ATTENTION SPAN',(6.3+v*.4).toFixed(1)+' SEC'],['QUEUE','UNENDING']],instagram:[['PEERS ON FILE',String(185+v*27)],['VALIDATION',(4+v)+' / 400']],discord:[['CONSENSUS',(91.2+v*.6).toFixed(1)+'%'],['DISSENT','QUEUED']]}[mode];
  if(small){t(states[v],12,32,5.8,146);title(config[0],12,46,146,20,2);specimen(config[1],83,94,75,52,'FILE / '+String(v+1).padStart(2,'0'));t('OPEN',12,112,6,65);t(config[2]+' >',12,129,6.3,74);return;}
  title(config[0],12,32,big?340:216,big?32:23,1);t(states[v]+' / MODEL',12,big?76:64,6,big?340:213);
  if(!big){specimen(config[1],244,31,108,78,'UNIT / '+HB_LOTS[mode]);metrics.forEach(([l,val],i)=>field(l,val,12+i*115,86,108,14));hr(119);hbClinicalIntakePlot(c,mode,12,123,340,16,seed);t('OPEN '+config[2]+' >',12,143,6,163);if(mode==='feeds')t('OPEN '+config[3]+' >',199,143,6,153);else t('ACCESS / COMPANY TERMS',202,143,5.6,150);return;}
  specimen(config[1],199,99,153,134,'UNIT / '+HB_LOTS[mode]);metrics.forEach(([l,val],i)=>field(l,val,12,100+i*49,173,24));t('SESSION / MODEL',12,198,6,170);c.bar(12,213,169,7,.55+v*.12,c.p.lilac);hr(245);t(({feeds:'NEURAL INTAKE',youtube:'CHANNEL RETENTION',instagram:'PEER DISTRIBUTION',discord:'MEMBERSHIP LINKS'}[mode])+' / ILLUSTRATIVE',12,257,6.3,340);hbClinicalIntakePlot(c,mode,12,274,340,40,seed);hr(325);
  if(mode==='feeds'){c.line(182,331,182,357);t('OPEN YOUTUBE >',12,341,8,156);t('OPEN INSTAGRAM >',199,341,8,153);}else{t('OPEN '+config[2]+' >',12,339,8,172);t('PREFERENCE / INFERRED',195,340,6,157);}
}
function hbClinicalMood(c){const {d,small,big,t,title,field,hr}=c,n=Math.abs(d.seed||0),credits=500+n*17%320,state=['RENEWAL PENDING','WITHIN ALLOCATION','REVIEW SCHEDULED'][n%3];
  t('AFFECT / HALCYON MODEL',12,32,6,c.W-24);field('EMOTIONAL CREDIT',credits,12,48,small?146:180,small?36:big?60:40);
  if(small){t(state,12,105,5.9,146);c.bar(12,122,146,7,(credits-500)/320,c.p.lilac);t('TRANSFER / PROHIBITED',12,141,5.7,146);return;}
  const x=big?201:194,y=big?60:48;[['CALM',.76],['JOY',.38],['NOSTALGIA',.19]].forEach(([lab,val],i)=>{t(lab,x,y+i*28,6,145);c.bar(x,y+12+i*28,big?151:158,6,val,i===1?c.p.lilac:c.p.ink);});
  if(!big){t(state,12,117,6,175);t('RENEWAL / AT COMPANY DISCRETION',12,143,6,340);return;}
  hr(170);title('Affect is a managed resource.',12,185,340,26,2);t('ASSESSMENT / ILLUSTRATIVE CORPORATE MODEL',12,247,6,340);hbClinicalHelix(c,12,266,340,41,n*.2);hr(320);t(state,12,333,7,340);t('TRANSFER / PROHIBITED. ROLLOVER / NOT INCLUDED.',12,351,6,340);
}
function hbClinicalVat(c){const {d,small,big,t,title,hr}=c,st=d.st||{},stage=Math.max(0,Math.min(4,st.stage||0)),names=GAMES.halcyon.stages;
  if(small){t(names[stage]+' / CYCLE '+(st.age??'—'),12,32,6,146);hbLivingVat(c,12,48,76,96);[['NUT',st.nut],['VIT',st.vit],['STR',st.stress]].forEach(([l,v],i)=>{t(l,101,52+i*30,6,55);t(v??'—',101,63+i*30,15,55,'disp');});return;}
  hbLivingVat(c,12,32,big?149:113,big?216:112);const x=big?177:140,w=big?175:212;
  t(d.inp?.charging?'FEED / CHARGING':'CONTAINMENT / RESTING',x,32,6,w);title(names[stage],x,44,w,big?24:23,1);t('AGE '+(st.age??'—')+' / FEED CYCLES '+(st.growth??st.age??0),x,big?82:74,5.8,w);
  if(big){c.line(x+4,99,x+w-4,99,c.rule,.8);['SPO','LAR','JUV','SPE','ASC'].forEach((s,j)=>{const xx=x+4+j*(w-8)/4;c.k.circ(xx,99,j===stage?3:2,j===stage?c.k.a(c.p.lilac,1):c.k.a(c.p.bg,1),c.ink,.7);t(s,Math.min(xx-3,x+w-17),105,4.5,17);});}
  [['NUTRIENT',st.nut],['VITALITY',st.vit],['STRESS',st.stress]].forEach(([l,v],i)=>{const y=(big?121:92)+i*(big?27:17);t(l,x,y,5.7,w-30);t(v??'—',x+w-27,y,6,27);c.bar(x,y+9,w,big?6:4,v==null?null:v/100,i===2?c.p.lilac:c.p.ink);});
  if(!big)return;
  t('VITALITY + STRESS / RECENT CYCLES',x,210,5.5,w);hbTrace(c,st.hist,x,222,w,24,c.p.ink);hbTrace(c,st.shist,x,222,w,24,c.p.lilac);hr(260);t('GENOME / LOT '+(st.lot||'UNASSIGNED'),12,269,6,340);hbClinicalGenome(c,12,284,340,13,stage+17);t(st.traits?.length?'TRAITS / '+st.traits.join(' · '):'TRAITS / NONE ON FILE',12,308,6,340);
  const logs=(st.log||[]).slice(-2);logs.forEach((l,i)=>t('> '+(typeof l==='string'?l:l.m),12,328+i*12,5.8,340));
}
function hbClinicalCelestial(c){const {d,small,big,t,title,specimen,hr}=c,seed=Math.abs(d.seed||0),known=['saturn','neptune','jupiter'][seed%3],unknown=['knot','membrane','loops'][seed%3],name=['HB-09','THE SOFT RETURN','VESSEL 014'][seed%3];
  if(small){const odd=seed%2===1;t(odd?'CLASS / PROVISIONAL':'CLASS / CATALOGUED',12,32,5.7,146);specimen(odd?unknown:known,12,46,146,99,odd?name:known.toUpperCase());return;}
  if(!big){specimen(known,12,32,160,112,known.toUpperCase()+' / KNOWN');specimen(unknown,191,32,161,112,name+' / FICTION');return;}
  t('CONTACT '+String(seed%3+1).padStart(2,'0')+' / PROVISIONAL',12,33,6.5,340);title(name,12,49,340,32,1);specimen(unknown,12,99,215,165,'RETURN / FICTIONAL OBJECT');specimen(known,241,99,111,110,known.toUpperCase());t('KNOWN / CATALOGUE',241,221,5.4,111);t('OBSERVATION',241,241,6,111);t('CONTINUES',241,253,6,111);hr(279);t('SOURCE / UNRESOLVED',12,292,7,340);t('ILLUSTRATED CATALOGUE / NO LIVE POSITION',12,312,6,340);hbClinicalGenome(c,12,332,340,12,seed%3+9);t('OWNERSHIP REVIEW / PENDING',12,353,5.8,340);
}
function hbPaint(k,W,H,d){const c=hbClinicalFrame(k,W,H,d),records=hbImmersionBegin(c);({status:hbClinicalStatus,shift:hbClinicalAllocation,solar:hbClinicalWeather,audio:hbClinicalRadio,transmission:hbClinicalTransmission,feeds:hbClinicalIntake,youtube:hbClinicalIntake,instagram:hbClinicalIntake,discord:hbClinicalIntake,oddity:hbClinicalMood,game:hbClinicalVat,tracker:hbObservationMap,dossier:hbObservationDossier}[d.mode]||hbClinicalStatus)(c);hbImmersionFinish(c,records);}
