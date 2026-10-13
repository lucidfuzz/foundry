// Independently composed small, medium and large production widgets.
// Artwork is embedded; all useful readings, controls and labels remain separate layers.
const HB_LOTS={status:'4417-229',shift:'HB-024',solar:'6681-204',audio:'1185-330',transmission:'9043-118',feeds:'7731-004',youtube:'1108-227',instagram:'4487-771',oddity:'5520-997',discord:'6621-908',game:'2893-14',tracker:'HB-09'};
const HB_VERSIONS={status:'SUBJECT',shift:'ALLOCATION',solar:'ATMOS',audio:'RADIO',transmission:'SIGNAL',feeds:'LINK',youtube:'FEED',instagram:'ARCHIVE',oddity:'AFFECT',discord:'COLLECTIVE',game:'CULTURE',tracker:'ASTRO'};
function hbInstrument(k,W,H,d) {
  const mode=d.mode,p=hbPalette(mode),small=W<200,big=H>200,ink=k.a(p.ink,1),soft=k.a(p.ink,.68),rule=k.a(p.ink,.32),faint=k.a(p.ink,.1);
  k.rect(0,0,W,H,k.a(p.bg,1));
  for(let y=0;y<H;y+=2)k.rect(0,y,W,2,k.a('#FFFFFF',p.dark?.016:.13+.25*Math.sin(y/H*Math.PI)));
  const t=(s,x,y,fs=7,w=W-24,f='mono',c=ink)=>{s=String(s);const e=f==='disp'?.52:.62,z=Math.max(Math.min(fs,w/Math.max(1,s.length*e)),Math.min(fs,3.6));k.t(s,x,y,z,c,{w,f,nofit:true});};
  const line=(x,y,xx,yy,c=rule,lw=.5)=>k.ln([[x,y],[xx,yy]],c,lw);
  const hr=(y,x=12,w=W-24)=>line(x,y,x+w,y);
  const title=(s,x,y,w,fs=26,max=2,min=14)=>{let size=fitFs(k,s,w,max,fs,'disp',min),ls=s.split('\n').flatMap(q=>k.wrap(q,w,size,'disp'));while(ls.length*size>max*fs&&size>5){size-=.5;ls=s.split('\n').flatMap(q=>k.wrap(q,w,size,'disp'));}ls.forEach((q,i)=>k.t(q,x,y+i*size*1.02,size,ink,{f:'disp',w,nofit:true}));return y+ls.length*size*1.02;};
  const cross=(x,y,r=4,c=soft)=>{line(x-r,y,x+r,y,c,.5);line(x,y-r,x,y+r,c,.5);};
  const art=(key,x,y,w,h)=>hbArt(k,key,x,y,w,h);
  const bar=(x,y,w,h,value,col=p.mint,n=16)=>{for(let i=0;i<n;i++)k.rect(x+i*w/n,y,w/n-1,h,i/n<Math.max(0,Math.min(1,value||0))?k.a(col,.55):k.a('#FFFFFF',.12),rule,.4);};
  const grid=(x,y,w,h,step=10)=>{for(let xx=x;xx<=x+w;xx+=step)line(xx,y,xx,y+h,faint,.35);for(let yy=y;yy<=y+h;yy+=step)line(x,yy,x+w,yy,faint,.35);};
  const rings=(x,y,r,n=8)=>{for(let i=0;i<n;i++)k.circ(x,y,r+i*1.7,null,k.a(p.ink,.08),.3);};
  const button=(label,x,y,w,h=26,kind='play')=>{k.rect(x,y,w,h,k.a('#FFFFFF',p.dark?.035:.22),rule,.5);if(kind==='play')k.poly([[x+10,y+7],[x+10,y+h-7],[x+21,y+h/2]],ink);else if(kind==='camera'){k.rect(x+8,y+8,15,11,null,ink,1);k.rect(x+12,y+5,6,4,ink);k.circ(x+15.5,y+13.5,3,null,ink,1);}else{k.rect(x+8,y+7,15,10,null,ink,1);line(x+8,y+17,x+8,y+21,ink,1);line(x+8,y+21,x+13,y+17,ink,1);}t(label,x+31,y+(h-9)/2,8.2,w-40);};
  for(let i=0;i<9;i++)if(i!==2&&i!==7)k.rect(12+i%3*3.1,9+Math.floor(i/3)*3.1,2.5,2.5,ink);
  t(`${HB_META[mode][0]} / ${small?({status:'SUBJECT',solar:'CLIMATE',audio:'RADIO 08',instagram:'ARCHIVE',game:'SPECIMEN',transmission:'TRANSMISSION'}[mode]||HB_META[mode][1]):HB_META[mode][1]}`,27,10,small?5.8:6.6,small?125:210);
  if(!small)t('LOT '+HB_LOTS[mode],W-91,11,4.8,72);
  k.rect(W-17,10,5,5,ink);hr(23);hr(H-19);
  const footer=small?({audio:'Programming assured.',transmission:'Continuity services.',feeds:'External input approved.',instagram:'Retention under your plan.',youtube:'Recommendations retained.',discord:'Belonging is included.',shift:'Your time has been considered.'}[mode]||HB_META[mode][2]):HB_META[mode][2];
  t(footer,12,H-13,small?4.9:5.6,small?W-27:W-106);
  if(!small)t(HB_VERSIONS[mode]+' v2.0',W-87,H-13,4.8,72);k.rect(W-17,H-12,4,4,ink);
  return {k,W,H,d,p,small,big,ink,soft,rule,faint,t,title,line,hr,cross,art,bar,grid,rings,button};
}
function hbPlate(c,x,y,w,label,lot){const {k,t}=c;k.rect(x,y,w,17,k.a('#F5F7EF',.95),k.a('#073C30',.3),.4);t('HALCYON BIOFAB',x+4,y+2,3.7,w-8,'mono',k.a('#073C30',1));t(label,x+4,y+7,3.7,w-8,'mono',k.a('#073C30',1));t(lot,x+4,y+12,3.3,w-8,'mono',k.a('#073C30',1));}
function hbOrgan(c,key,x,y,w,h,label,lot){c.art(key,x,y,w,h);if(!['heartDetail','lungsDetail'].includes(key))return;const ratio=HB_SHEET_ASPECT[HB_SPRITES[key][0]],dw=Math.min(w,h*ratio),dh=dw/ratio,xx=x+(w-dw)/2,yy=y+(h-dh)/2,isHeart=key==='heartDetail',tx=xx+dw*.255,ty=yy+dh*(isHeart?.828:.796),fs=Math.max(2.5,dw*.032),col=c.k.a('#073C30',1);c.t('HALCYON BIOFAB',tx,ty,fs,dw*.48,'mono',col);c.t(label,tx,ty+fs*1.35,fs,dw*.48,'mono',col);c.t(lot,tx,ty+fs*2.7,fs*.85,dw*.48,'mono',col);}
function hbDial(c,x,y,r,value=.3){const {k,p,line,cross}=c;for(let j=0;j<4;j++)k.circ(x,y,r+j*5,null,k.a(p.lilac,.22),.45);for(let i=0;i<60;i++){const a=i*Math.PI/30-Math.PI/2,rr=r-(i%5===0?8:3.5);line(x+Math.cos(a)*rr,y+Math.sin(a)*rr,x+Math.cos(a)*r,y+Math.sin(a)*r,k.a(p.ink,i%5===0?.55:.25),.55);}if(value>0)k.arc(x,y,r-4,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,value),k.a(p.lilac,.65),4);cross(x-r-12,y,3);cross(x+r+12,y,3);}
function hbApproval(c,x,y,r=17){const {k,p}=c;k.circ(x,y,r,null,k.a(p.lilac,.7),.6);k.circ(x,y,r-2.5,null,k.a(p.lilac,.5),.4);hbSeal(k,x,y,r*.62,k.a(p.lilac,.95));}
function hbBattery(c,x,y,value,scale=1){const {k,ink,rule}=c;k.rect(x,y,24*scale,11*scale,null,ink,.8);k.rect(x+24*scale,y+3*scale,2*scale,5*scale,ink);if(value!=null)k.rect(x+2*scale,y+2*scale,20*scale*Math.max(0,Math.min(1,value)),7*scale,ink);else k.ln([[x+3,y+8],[x+19,y+3]],rule,.5);}
function hbWave(c,x,y,w,h,seed=0){const {k,p,grid}=c;grid(x,y,w,h,10);for(let j=0;j<2;j++){const pts=[];for(let i=0;i<=90;i++){const a=i/90;pts.push([x+a*w,y+h*.5+Math.sin(i*1.13+seed+j*.6)*Math.sin(i*2.27+seed)*h*.31]);}k.ln(pts,k.a(j?p.lilac:p.ink,j?.35:.55),.5);}}
function hbTrace(c,values,x,y,w,h,color){if(!values?.length)return;c.grid(x,y,w,h,10);const vals=values.slice(-24),pts=vals.map((v,i)=>[x+i*w/Math.max(1,vals.length-1),y+h-Math.max(0,Math.min(100,v))/100*h]);if(pts.length>1)c.k.ln(pts,c.k.a(color, .8),.9);}

function hbSubject(c){const {k,W,H,d,p,small,big,t,title,line,hr,art,rings}=c,wx=d.wx||{},ev=d.ev,heart=T.hbImages?.heartDetail?'heartDetail':'heart';
  if(small){t(`${wx.temp??'—'}°`,12,30,38,87,'disp');t(wx.cond||'Weather unavailable',12,73,6.7,91);art(heart,98,32,61,78);hbBattery(c,13,91,d.batt,.75);t(d.batt==null?'—':Math.round(d.batt*100)+'%',37,90,12,53,'disp');hr(112);t(ev?'NEXT EVENT':'CALENDAR',12,120,5.5,125);t(ev?hbClock(ev.start):'—',12,131,13,48,'disp');title(ev?.title||'No event scheduled',67,124,91,9,2,6.5);return;}
  const imageX=big?198:209,imageY=big?31:25,imageH=big?208:128;
  rings(imageX+69,imageY+imageH/2,big?67:45,12);hbOrgan(c,heart,imageX,imageY,big?143:114,imageH,'CARDIAC UNIT','HB-C1137-AC');
  if(!big){title('A little\nmore today.',12,32,111,25,2);line(125,32,125,101);t(new Date(d.now||Date.now()).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}).toUpperCase(),135,32,5.1,68);t('NEXT EVENT',135,48,5.3,69);t(ev?hbClock(ev.start):'—',135,57,21,72,'disp');title(ev?.title||'No event scheduled',135,82,71,11,2,9);hr(108,12,190);t(`${wx.temp??'—'}°`,12,115,25,69,'disp');t(wx.cond||'Unavailable',12,142,5.1,84);line(97,116,97,145);hbBattery(c,108,120,d.batt,.95);t(d.batt==null?'—':Math.round(d.batt*100)+'%',139,114,23,64,'disp');t('SYSTEMS NOMINAL',107,141,5,91);['A STEADIER','YOU.','TOMORROW.'].forEach((s,i)=>t(s,325,48+i*9,4.1,28));c.cross(338,123);}
  else{title('A little\nmore today.',14,34,182,37,2);t('YOUR DAY, PROVISIONED.',15,121,7,184);hr(142,14,170);t('NEXT EVENT',15,153,6.5,170);t(ev?hbClock(ev.start):'—',15,168,33,171,'disp');title(ev?.title||'No event scheduled',15,207,173,18,2);hr(250);t('PERSONAL CONDITIONS',14,259,6.7,270);t(`${wx.temp??'—'}°`,14,276,38,132,'disp');t(wx.cond||'Weather unavailable',15,321,8,170);line(184,276,184,338);hbBattery(c,204,287,d.batt,1.2);t(d.batt==null?'—':Math.round(d.batt*100)+'%',244,276,33,99,'disp');t('CELL / CURRENT CHARGE',205,322,6.5,141);t('A steadier you. Tomorrow.',14,346,8,318,'disp');}
}
function hbAllocationLayout(W,H){return H>200?{x:118,y:186,w:208,fs:36}:W<200?{x:12,y:82,w:146,fs:24}:{x:175,y:59,w:177,fs:31};}
function hbAssigned(c){const {k,W,H,d,p,small,big,t,title,line,hr,bar}=c,a=d.allocation||{phase:'setup',title:'Your next allocation'},active=a.phase==='active',q=hbAllocationLayout(W,H);
  const label=a.label||(a.phase==='setup'?'ALLOCATION REQUIRED':'AWAITING ALLOCATION');
  if(small){hbDial(c,142,138,31,a.frac||0);title(a.title||'Your next allocation',12,32,144,18,2,14);t(label,12,73,5.6,144);if(!d.live)t(a.target?hbDuration((d.now||new Date())-a.target):'— — : — —',q.x,q.y,q.fs,q.w,'disp');t(active?'STARTED':'HALCYON ASSIGNED',12,120,5.2,100);t(a.start?hbClock(a.start):a.phase==='error'?'Check access':'Open setup',12,130,12,102,'disp');return;}
  if(!big){hbDial(c,328,137,48,a.frac||0);title(a.title||'Your next allocation',12,33,149,27,2);line(164,33,164,105);t(label,175,39,6.3,177);if(!d.live)t(a.target?hbDuration((d.now||new Date())-a.target):'— — : — —',q.x,q.y,q.fs,q.w,'disp');t('Prepared for your participation.',12,100,6.6,217);k.circ(282,104,2.5,k.a(p.mint,1));t('HALCYON ASSIGNED',290,101,5.2,64);}
  else{title('Your allocated time.',14,34,292,33,1);title(a.title||'Your next allocation',14,76,255,21,2);hbApproval(c,327,83,21);hbDial(c,219,207,88,a.frac||0);t(active?'ALLOCATED ACTIVITY':'RESERVED ACTIVITY',148,151,6.4,166);t(label,142,168,6.5,186);if(!d.live)t(a.target?hbDuration((d.now||new Date())-a.target):'— — : — —',q.x,q.y,q.fs,q.w,'disp');t(active?'STARTED':'ASSIGNED START',176,235,6,130);t(a.start?hbClock(a.start):'—',178,249,21,130,'disp');title('A continuing\nallocation.',14,154,93,19,2);t('PREPARED FOR',14,208,5.8,84);t('PARTICIPATION.',14,218,5.8,84);hr(307);t('RELEASE AT',14,316,6,90);t(a.end?hbClock(a.end):'—',14,327,18,94,'disp');t(a.note||'Choose an allocation in widget setup.',120,318,7.2,232);}
  const by=big?345:125;bar(12,by,W-24,10,a.frac||0,p.lilac,24);
  if(!big){t(a.start?hbClock(a.start):'AWAITING SCHEDULE',12,140,6.2,150);t(a.end?'RELEASE '+hbClock(a.end):(a.note||'Choose an allocation in widget setup.'),204,140,5.9,148);}
}
function hbClimateOther(c){const {k,W,H,d,p,small,t,title,hr,line,art,grid}=c,wx=d.wx||{},atm=d.atm||{},sun=d.sun||{},key=T.hbImages?.lungsDetail?'lungsDetail':'lungs';
  if(small){t(`${wx.temp??'—'}°`,12,30,39,91,'disp');title(wx.cond||'Weather unavailable',12,77,90,13,2,11);art(key,95,30,66,97);hr(120);t(`HI ${wx.hi??'—'}°  LO ${wx.lo??'—'}°`,12,128,8,145);return;}
  t(`${wx.temp??'—'}°`,14,31,63,172,'disp');title(wx.cond||'Weather unavailable',14,101,170,24,2);t('DAYLIGHT LEFT',15,154,7,164);t(sun.left==null?'—':Math.round(sun.left*100)+'%',14,166,37,172,'disp');t(sun.phase==='night'?'SUNRISE IN':'SUNSET IN',15,210,6.7,163);t(sun.remaining==null?'—':hbDuration(sun.remaining).split(':').slice(0,2).map(s=>s.padStart(2,'0')).join(':'),15,222,23,166,'disp');hbOrgan(c,key,192,29,161,214,'RESPIRATORY UNIT','HB-R2290-LG');hr(255);
  [['HUMIDITY',atm.rh==null?'—':atm.rh+'%'],['WIND',atm.ws==null?'—':atm.ws+' mph'],['UV INDEX',atm.uv==null?'—':Math.round(atm.uv)]].forEach(([lab,val],i)=>{const x=14+i*115;t(lab,x,266,6.2,101);t(val,x,278,24,101,'disp');if(i)line(x-10,266,x-10,303);});
  t('RAIN PROBABILITY / NEXT 12 HOURS',14,312,6.4,312);grid(34,328,314,23,13);const probs=atm.probs||[];
  if(probs.some(v=>v!=null&&Number.isFinite(v))){probs.slice(0,12).forEach((v,i)=>{if(v==null||!Number.isFinite(v))return;const h=Math.max(.5,Math.min(100,Math.max(0,v))*.23);k.rect(35+i*26,351-h,24,h,k.a(p.mint,.4),c.rule,.5);});t('100',13,327,4.4,18);t('0%',16,347,4.4,17);[[0,'NOW'],[3,'+3H'],[6,'+6H'],[9,'+9H']].forEach(([i,s])=>t(s,34+i*26,353,4.5,35));}else t('Forecast unavailable',35,334,9,270);
}
function hbRadioSpectrum(c,x,y,w,h){const {k,p,line,t,grid}=c;grid(x,y,w,h,12);hbField(k,x,y+2,w,h-15,1.3);for(let j=0;j<4;j++){const xx=x+w*(.21+j*.21),yy=y+h*.46+Math.sin(j*2)*h*.13;k.circ(xx,yy,1.6,null,k.a(p.lilac,.8),.6);}const lock=x+w*.43;line(lock,y,lock,y+h-10,k.a(p.lilac,.9),1);k.circ(lock,y+5,2,k.a(p.lilac,.9));for(let i=0;i<=48;i++){const xx=x+i*w/48;line(xx,y+h-8,xx,y+h-(i%8===0?3:5),c.soft,.45);}for(let i=0;i<7;i++)t(String(i+5).padStart(2,'0'),x+i*w/6-2,y+h,4.7,18);t('CH 08 / LOCKED',lock+5,y+1,4.7,76);}
function hbRadio(c){const {k,W,H,p,small,big,t,title,hr,line,button}=c;
  if(small){t('HALCYON RADIO',12,33,7.2,115);t('CH 08',12,46,29,103,'disp');t('APPROVED PROGRAMME',12,81,5.5,130);hbApproval(c,126,69,29);k.poly([[119,59],[119,79],[135,69]],c.ink);button('OPEN RADIO',12,103,146,25);t('A FAMILIAR VOICE.',12,136,5.2,140);return;}
  title('Your approved\nfrequency.',12,32,big?268:195,big?35:27,2);hbApproval(c,big?320:329,big?69:49,big?24:16);
  if(!big){t('A familiar voice. A consistent message.',12,90,6.5,231);hbRadioSpectrum(c,174,68,177,56);button('OPEN RADIO',12,105,146,27);hr(137);[['PROGRAMME','CONTINUITY HOUR'],['OVERSIGHT','HALCYON'],['BAND','LICENSED']].forEach(([a,b],i)=>{const x=12+i*120;t(a,x,141,4.3,112);t(b,x,148,4.8,112);});}
  else{t('A familiar voice. A consistent message.',14,112,9,330);k.rect(12,136,340,139,k.a('#FFFFFF',.13),c.rule,.6);k.rect(16,140,332,131,null,c.faint,.5);t('CORPORATE BROADCAST / LICENSED SPECTRUM',23,148,5.8,317);hbRadioSpectrum(c,23,168,318,85);button('OPEN RADIO',14,286,179,29);t('A CALMER',208,287,6.5,132);t('MORE LIVABLE TOMORROW.',208,297,6.5,142);hr(325);t('PROGRAMME / ILLUSTRATIVE',14,332,5.6,241);[['08:00','Daily alignment'],['08:15','Music for steady hands']].forEach(([a,b],i)=>{t(a,14,344+i*10,6.7,51);t(b,73,344+i*10,7.6,267);});}
}
function hbTransmission(c){const {k,W,H,d,p,small,big,t,title,hr,art,cross}=c,quote=d.text||'You can leave the rest to us.',by=d.by||'HALCYON BIOFAB / CONTINUITY SERVICES';
  // The message's source remains authoritative; changing size never changes its attribution.
  if(small){t(d.archival?'ARCHIVAL':'CONTINUITY SERVICES',12,31,5.2,146);const fs=fitFs(k,quote,146,4,14.5,'disp',11),n=k.para(quote,12,43,146,fs,c.ink,'disp',4,1.04),byY=46+n*fs*1.04;t(by,12,byY,4.8,146);art('signal',45,byY+11,115,Math.max(12,147-byY-11));cross(20,137);return;}
  const imgX=big?10:167,imgY=big?147:35,imgW=big?344:188,imgH=big?199:116;
  art('signal',imgX,imgY,imgW,imgH);
  t(d.archival?'ARCHIVAL / PUBLIC DOMAIN':'HALCYON / CONTINUITY SERVICES',14,32,5.8,big?330:170);
  const qw=big?324:159,fs=fitFs(k,quote,qw,big?4:4,big?31:23,'disp',big?20:14),n=k.para(quote,14,45,qw,fs,c.ink,'disp',big?4:4,1.02);
  t(by,14,Math.min(big?172:132,49+n*fs*1.02),big?7:5.3,big?324:156);
  const pts=big?[[106,204],[235,190],[178,279],[303,265]]:[[204,72],[300,64],[282,126]];
  pts.forEach(([x,y],i)=>{k.circ(x,y,big?7:5,null,c.soft,.5);cross(x,y,big?10:7);t('N'+(i+1),x+9,y-8,4.5,28);});
  if(big){t('FILAMENT ARRAY / SYNTHETIC SIGNAL',14,185,5.7,210);hr(322,14,93);t('SEQUENCE',14,329,5.5,126);t('7A-3F-9C-02',14,340,7,153);t('DECODE / PRESERVE / SUSTAIN',183,335,6.1,167);c.bar(183,347,166,7,.68,p.lilac,18);}
  else{t('DECODE / PRESERVE',14,143,4.8,142);t('SIGNAL IN CONTINUITY',226,143,4.6,122);}
}
function hbNeural(c){const {k,W,H,p,small,big,t,title,art,button,hr,line}=c;
  if(small){title('A little\noutside input.',12,31,148,21,2);art('neural',94,76,65,43);button('YOUTUBE',12,122,146,24);return;}
  if(!big){title('A little\noutside input.',12,32,160,25,2);art('neural',225,28,124,86);t('EXTERNAL INPUT',183,32,4.8,101);hbWave(c,182,49,35,23,1);t('SYNC',183,84,4.8,31);hbWave(c,182,95,35,16,4);button('YOUTUBE',12,119,151,28);button('INSTAGRAM',192,119,159,28,'camera');}
  else{title('A little outside input.',14,34,332,30,1);art('neural',100,79,165,161);t('YOUR SIGNAL',14,96,6,88);hbWave(c,14,111,73,64,1);t('EXTERNAL INPUT',273,96,5.5,80);hbWave(c,276,111,73,64,4);t('NEURAL LINK / INTERFACE UNIT',95,241,6,231);hr(260);line(182,270,182,348);button('YOUTUBE',14,272,155,31);button('INSTAGRAM',195,272,155,31,'camera');t('EXPLORE. LEARN. UNWIND.',14,315,5.9,153);t('SEE. SHARE. BELONG.',195,315,5.9,153);t('INPUT APPROVED',14,337,6.4,153);t('RECEPTION STABLE',195,337,6.4,153);}
}
function hbCulture(c){const {k,W,H,d,p,small,big,t,title,art,button,hr,line,cross}=c,mode=d.mode;
  const v={youtube:{key:'optical',slogan:'Something\nworth keeping.',short:'Worth keeping.',action:'YOUTUBE',kind:'play',tag:'OPTICAL MEMORY UNIT'},instagram:{key:'archive',slogan:'A life,\nbeautifully kept.',short:'Beautifully kept.',action:'INSTAGRAM',kind:'camera',tag:'SPECIMEN ARCHIVE'},discord:{key:'collective',slogan:'There is room\nfor you.',short:'Room for you.',action:'DISCORD',kind:'chat',tag:'SHARED MINDS / BRIGHTER TOMORROWS'}}[mode];
  if(small){title(v.short,12,31,146,20,1,16);art(v.key,23,57,125,68);button(v.action,12,120,146,24,v.kind);return;}
  if(!big){title(v.slogan,12,32,172,26,2);t({youtube:'Thoughtful content for a longer you.',instagram:'Moments, made to last a little longer.',discord:'Shared minds. Brighter tomorrows.'}[mode],12,94,6.1,174);art(v.key,183,29,168,109);button('OPEN '+v.action,12,112,166,30,v.kind);t(v.tag,189,143,4.6,160);cross(340,137,3);}
  else{title(v.slogan.replace('\n',' '),14,34,332,31,2);art(v.key,29,108,306,167);t(v.tag,16,284,6.7,333);hr(299);button('OPEN '+v.action,14,310,191,30,v.kind);
    const words=mode==='youtube'?['CULTURE','CURIOSITY','RETENTION']:mode==='instagram'?['ARCHIVE','PRESERVE','CONTINUE']:['COMMON ROOM','QUIET ROOM','WELCOME DESK'];
    words.forEach((s,i)=>{t(s,221,311+i*12,5.6,130);if(i<2)line(216,315+i*12,216,324+i*12);});t(mode==='discord'?'A calmer internet is still possible.':mode==='instagram'?'Synthetic lives deserve beautiful records.':'A kinder internet still matters.',14,349,7,330,'disp');}
}
function hbEngraving(c,x,y,w,h){const {k,p}=c;for(let j=0;j<13;j++){const pts=[];for(let i=0;i<=50;i++){const a=i/50;pts.push([x+w*(.5+Math.sin(a*4+j*.14)*a*.37),y+h*(1-a)]);}k.ln(pts,k.a(p.ink,.23),.4);for(let n=1;n<=3;n++){const a=n/4,xx=x+w*(.5+Math.sin(a*4+j*.14)*a*.37),yy=y+h*(1-a);k.ell(xx,yy,2+j*.13,3+j*.13,null,k.a(p.lilac,.45),.4);}}}
function hbMood(c){const {W,H,d,p,small,big,t,title,bar,line,hr}=c,seed=d.seed||0,credits=500+(seed*17%320);
  if(small){title('Room to feel.',12,32,146,22,1);t(String(credits),12,60,44,144,'disp');t('EMOTIONAL CREDITS',12,107,6.1,143);t('JOY / PLAN DEPENDENT',12,126,5.7,146);bar(12,139,146,6,.38,p.lilac,18);return;}
  title('Room to feel.',12,32,332,big?39:30,1);hbEngraving(c,big?236:305,big?93:65,big?105:46,big?117:75);
  t(String(credits),14,big?94:73,big?65:48,big?204:128,'disp');t('EMOTIONAL CREDITS',14,big?162:126,6.5,145);
  if(!big){line(148,76,148,139);[['CALM',.76,'INCLUDED'],['JOY',.38,'PLAN DEPENDENT'],['NOSTALGIA',.19,'TRIAL']].forEach(([a,v,status],i)=>{const y=76+i*23;t(a,159,y,5.5,60);bar(216,y,77,7,v,i===1?p.lilac:p.mint,12);t(status,216,y+10,4.2,88);});}
  else{hr(202);[['CALM',.76,'INCLUDED'],['JOY',.38,'PLAN DEPENDENT'],['NOSTALGIA',.19,'TRIAL']].forEach(([a,v,status],i)=>{const y=220+i*31;t(a,14,y,8,92);bar(114,y,126,10,v,i===1?p.lilac:p.mint,14);t(status,254,y+1,6.5,96);});hr(319);t('A complimentary sigh has been added.',14,332,12,332,'disp');t('RENEWAL / AT HALCYON DISCRETION',14,350,6,332);}
}
function hbSpecimen(c){const {k,W,H,d,p,small,big,t,title,art,bar,hr,line}=c,st=d.st||{},stage=Math.max(0,Math.min(4,st.stage||0)),keys=['collective','tissue','neural',T.hbImages?.heartDetail?'heartDetail':'heart',T.hbImages?.lungsDetail?'lungsDetail':'lungs'],names=['NUCLEUS','MEMBRANE','JUVENILE','SPECIMEN','ASCENDANT'],feeding=d.inp?.charging;
  if(small){t(names[stage],12,32,7,144);art(keys[stage],46,45,85,74);t('VITALITY',12,131,5.3,58);t(st.vit==null?'—':st.vit+'%',65,125,17,59,'disp');k.circ(136,134,2.2,k.a(feeding?p.mint:p.lilac,1));return;}
  title('Personal reserve.',12,32,big?331:119,big?36:25,big?1:2);t('LOT '+(st.lot||'—'),14,big?80:92,big?6.6:5.4,big?210:115);
  const ax=big?14:132,ay=big?100:27,aw=big?191:107,ah=big?174:125;hbOrgan(c,keys[stage],ax,ay,aw,ah,'SPECIMEN VAT',st.lot||'—');
  if(!big){t(names[stage],14,111,6.8,108);t(feeding?'FEEDING / CHARGING':'CULTURE ACTIVE',14,126,5.3,108);}
  const rx=big?222:252,ry=big?110:72,bw=big?126:99;
  [['NUTRIENT',st.nut],['VITALITY',st.vit],['STRESS',st.stress]].forEach(([lab,val],i)=>{const y=ry+i*(big?34:24);t(lab,rx,y,big?6.5:5.8,bw-23);t(val??'—',rx+bw-20,y,big?9:7,20);bar(rx,y+(big?15:10),bw,big?9:7,(val||0)/100,i===2?p.lilac:p.mint,14);});
  if(big){t('VITALITY / RECENT CYCLES',222,209,4.9,130);hbTrace(c,st.hist,223,221,123,17,p.ink);t('STATE',223,244,6.3,119);k.circ(225,260,2.4,k.a(feeding?p.mint:p.lilac,1));t(feeding?'FEEDING / CHARGING':'CULTURE ACTIVE',232,256,5.8,116);t('CYCLE '+(st.age??'—'),223,268,6.5,122);hr(279);
    keys.forEach((key,i)=>{const x=14+i*68;art(key,x,284,49,30);t(names[i],x,318,4.7,60);if(i<4)t('→',x+51,294,9,16);if(i===stage)line(x,326,x+49,326,k.a(p.lilac,1),1.4);});
    const log=st.log?.slice(-1)[0],entry=typeof log==='string'?log:log?.m;t(entry||'No new observations filed.',14,338,6.4,333);t(st.traits?.length?'TRAITS / '+st.traits.join(' · '):'TRAITS / NONE ON FILE',14,350,5.7,332);
  }
}
function hbCelestial(c){const {k,W,H,d,p,small,big,t,title,art,line,hr,grid,cross}=c,seed=Math.abs(d.seed||0),known=['saturn','neptune','jupiter'][seed%3],fiction=['knot','membrane','loops'][seed%3],id=['HB-09','THE SOFT RETURN','VESSEL 014'][seed%3];
  function panel(key,x,y,w,h,label,kind){k.rect(x,y,w,h,k.a('#041A19',.8),k.a(p.mint,.5),.55);if(kind==='PROVISIONAL')grid(x+5,y+5,w-10,h-27,10);else{for(let i=0;i<35;i++)k.circ(x+5+(i*37%(w-10)),y+5+(i*19%(h-29)),i%4===0?.6:.35,k.a('#EDF5E8',.35));}art(key,x+2,y+2,w-4,h-25);line(x+6,y+h-24,x+w-6,y+h-24,c.faint);t(label,x+7,y+h-20,6.8,w-14);t(kind,x+7,y+h-10,4.7,w-14);}
  if(small){const fictional=seed%2===1;panel(fictional?fiction:known,12,31,146,112,fictional?id:known.toUpperCase(),fictional?'PROVISIONAL':'CATALOGUE');return;}
  if(!big){title('Some things\nare still becoming.',12,35,142,22,3,16);t('A CLOSER TOMORROW',12,126,5.7,142);panel(known,166,31,87,112,known.toUpperCase(),'CATALOGUE');panel(fiction,261,31,91,112,id,'PROVISIONAL');}
  else{title('Some things\nare still becoming.',14,33,320,33,2);t('DISTANT CARE / FOR A WIDER YOU',14,110,6.6,333);panel(fiction,14,129,215,162,id,'PROVISIONAL');panel(known,242,129,108,111,known.toUpperCase(),'CATALOGUE');t('FURTHER',248,258,6.8,99);t('STILL TOGETHER.',248,269,6.8,99);cross(291,295,7);hr(309);t('ROTATING CATALOGUE',14,320,6.1,217);t('Known worlds. Provisional returns.',14,334,13,332,'disp');t('ILLUSTRATED / NOT LIVE TELEMETRY',14,354,5.3,330);}
}
function hbPaint(k,W,H,d){if(d.mode==='solar'&&W>200&&H<200)return hbClimateMedium(k,W,H,d);const c=hbInstrument(k,W,H,d);({status:hbSubject,shift:hbAssigned,solar:hbClimateOther,audio:hbRadio,transmission:hbTransmission,feeds:hbNeural,youtube:hbCulture,instagram:hbCulture,discord:hbCulture,oddity:hbMood,game:hbSpecimen,tracker:hbCelestial}[d.mode]||hbSubject)(c);}
