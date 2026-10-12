// Exclusive widget artwork ownership. Map, dossier and specimen are code-native.
const HB_WIDGET_ASSETS={status:['heart','heartDetail'],solar:['lungs','lungsDetail'],transmission:['signal'],feeds:['neural'],youtube:['optical'],instagram:['archive'],discord:['collective'],game:[],tracker:[],dossier:[]};
HB_LOTS.dossier='REMOTE-07';HB_VERSIONS.dossier='DOSSIER';
HB_RECORDS.dossier=['SCAN RESOLUTION','CARGO RECONCILIATION','ORIGIN / WITHHELD','CUSTODY CHAIN','SIGNATURE MATCH','RETURN RECEIPT'];
HB_INSTRUMENTS.dossier=['scatter','contour','flow','matrix','scope','phase','orbit','trend','envelope','gate','queue','ledger'];
function hbLivingVat(c,x,y,w,h){
  const {k,d,p}=c,G=GAMES.halcyon,st={run:1,age:0,stage:0,traits:[],stress:0,lot:'HB-UNASSIGNED',...d.st},inp={charging:false,...d.inp},tm=+(d.now||new Date())/60000;
  c.grid(x,y,w,h,10);
  const vk={...k,I:c.ink,S:c.soft,ia:a=>k.a(p.ink,a)},vx=x+7,vy=y+5,vw=w-14,vh=h-10;
  G.vat(vk,vx,vy,vw,vh,st,inp,tm,c.small);
  const progress=Math.min(1,Math.max(0,((st.growth??st.age)-G.th[st.stage])/Math.max(1,(G.th[st.stage+1]||120)-G.th[st.stage]))),R=Math.min(vw*.25,vh*.23)*(.65+st.stage*.09+progress*.08),cx=vx+vw/2,cy=vy+vh*.51;
  G.organism(vk,cx,cy,R,st,inp,tm);
  if(!c.small){c.t(G.morph[st.stage],vx+9,vy+13,4.7,vw-18);c.t(inp.charging?'NUTRIENT LINE / OPEN':'NUTRIENT LINE / IDLE',vx+9,vy+vh-24,4.5,vw-18);}
}

// Thirty-six authored scan subjects; positions and custody telemetry are fiction.
// Known planet names remain catalogue entries, never claims of live ephemerides.
const HB_OBSERVATIONS=[
 ['HB-001','Mercury','rock','KNOWN PLANET','SURFACE / CRATERED','CLAIM / UNFILED'],
 ['HB-002','Venus','cloud','KNOWN PLANET','RETURN / OPAQUE','ACCESS / WITHHELD'],
 ['HB-003','Mars','rock','KNOWN PLANET','SURFACE / OXIDE','LEASE / DISPUTED'],
 ['HB-004','Jupiter','gas','KNOWN PLANET','RETURN / BANDED','CUSTODY / REMOTE'],
 ['HB-005','Saturn','rings','KNOWN PLANET','RETURN / RING SYSTEM','TITLE / UNDER REVIEW'],
 ['HB-006','Neptune','gas','KNOWN PLANET','RETURN / BLUE BAND','STATUS / CATALOGUED'],
 ['HB-007','Seed Ark Patience','ark','GENETIC ARCHIVE VESSEL','CARGO / 41,000 EMBRYOS','CRYO / NOMINAL'],
 ['HB-008','The Soft Return','coil','NONLOCAL RETURN','ECHO / PRECEDES SIGNAL','INTENT / UNDISCLOSED'],
 ['HB-009','Choir of Nine','swarm','DISTRIBUTED ORGANISM','VOICES / 9 OF 8','CONSENSUS / PENDING'],
 ['HB-010','Relay Mother','relay','MATERNAL RELAY ARRAY','UPLINK / LULLABY','OPERATOR / ABSENT'],
 ['HB-011','Vessel Without Crew','sail','AUTONOMOUS TISSUE SAIL','CREW / NOT REQUIRED','FUEL / NOSTALGIA'],
 ['HB-012','The Second Moon','moon','UNREGISTERED SATELLITE','ORBIT / ON PROBATION','ORIGIN / REVISED'],
 ['HB-013','Cartilage Cathedral','lattice','ORBITAL OSSIFICATION','MASS / STILL GROWING','OCCUPANCY / 0 CLAIMED'],
 ['HB-014','Asset 00 / Awake','bloom','UNSCHEDULED BIOSPHERE','NERVES / EXPOSED','SLEEP / DENIED'],
 ['HB-015','Quiet Meridian','void','ABSENCE UNDER REVIEW','RETURN / NEGATIVE MASS','SILENCE / LICENSED'],
 ['HB-016','Escrow Garden','pods','CRYOGENIC POD ARRAY','CARGO / 208 IDENTITIES','INTEREST / COMPOUNDING'],
 ['HB-017','Little Witness','relay','PASSIVE OBSERVER','RECORD / CONTINUOUS','EYELIDS / OMITTED'],
 ['HB-018','Membrane Sea','cloud','SUSPENDED OCEAN','DEPTH / UNRESOLVED','TIDE / BREATHING'],
 ['HB-019','Family Unit 41','pods','DOMESTIC GESTATION ARRAY','OCCUPANTS / PREASSIGNED','CONSENT / INHERITED'],
 ['HB-020','Lacuna Trawl','sail','MEMORY COLLECTION RIG','NET / 81% FULL','BYCATCH / DREAMS'],
 ['HB-021','Minor Inheritance','moon','LEASED PLANETOID','BENEFICIARY / UNBORN','TERM / PERPETUAL'],
 ['HB-022','Census Drift','swarm','MIGRATORY HEADCOUNT','COUNT / 1,004 + 1','NAMES / REDACTED'],
 ['HB-023','Unfinished Person','lattice','REMOTE SOMATIC FRAME','COMPLETION / 93.2%','DEPARTURE / EARLY'],
 ['HB-024','Lung of the Station','bloom','FREE ORBIT RESPIRATOR','BREATHS / COMMUNAL','FILTER / REMEMBERS'],
 ['HB-025','Return to Sender','ark','RECALLED CONTINUITY SHIP','CARGO / REPLACEMENTS','ADDRESS / DECEASED'],
 ['HB-026','The Courtesy Gap','void','SIGNAL EXCLUSION ZONE','WIDTH / ONE APOLOGY','ENTRY / AUTOMATIC'],
 ['HB-027','Ribbon Patient','coil','LONGITUDINAL ANOMALY','LENGTH / 4.2 LIGHT YEARS','PAIN / NOT REQUESTED'],
 ['HB-028','Fallow Halo','rings','ARTIFICIAL RING HABITAT','CROP / SYNTHETIC DERMIS','HARVEST / OVERDUE'],
 ['HB-029','Local Sun Substitute','gas','MANUFACTURED PRIMARY','LIGHT / METERED','WARRANTY / 08 CYCLES'],
 ['HB-030','Archive Kestrel','ark','BIOLOGICAL FREIGHTER','MANIFEST / 66 SPARES','TEMPERATURE / HELD'],
 ['HB-031','Affection Engine','relay','EMOTIONAL BROADCASTER','RANGE / ALL DEPENDENTS','RESPONSE / MANDATORY'],
 ['HB-032','Borrowed Horizon','sail','PROSPECTING ARRAY','CLAIMS / 17 PENDING','OWNER / ANOTHER YOU'],
 ['HB-033','Orphaned Protocol','lattice','SELF-ASSEMBLING ARCHIVE','PARENT / NOT FOUND','TASK / CONTINUES'],
 ['HB-034','Provisional Shore','rock','UNLICENSED LANDFORM','SURFACE / REWRITING','BOUNDARY / DISPUTED'],
 ['HB-035','The Warm Index','bloom','THERMAL LIFE SIGNATURE','TEMPERATURE / FAMILIAR','IDENTITY / UNMATCHED'],
 ['HB-036','Nothing to Declare','void','CUSTOMS EXCEPTION','CARGO / NOTHING','MASS / 8,400 TONNES']
];
function hbObservation(d){
  const slot=Math.floor(d.observationIndex??d.seed??(+(d.now||new Date())/1800000)),index=((slot%HB_OBSERVATIONS.length)+HB_OBSERVATIONS.length)%HB_OBSERVATIONS.length,entry=HB_OBSERVATIONS[index],r=(()=>{let n=index*997+41;return()=>{n=(n*9301+49297)%233280;return n/233280;};})();
  const lat=r()*160-80,lon=r()*340-170;
  return {index,id:entry[0],name:entry[1],kind:entry[2],classification:entry[3],details:entry.slice(4),known:index<6,scan:'SCAN '+String(((slot%65536)+65536)%65536).padStart(5,'0'),sector:'H-'+String(11+index*7).padStart(3,'0'),coords:Math.abs(lat).toFixed(2)+(lat<0?'S':'N')+' / '+Math.abs(lon).toFixed(2)+(lon<0?'W':'E'),status:['CONTACT HELD','SIGNAL OCCULTED','RETURN ACQUIRED','CONTACT LOST'][index%4]};
}
// False-color survey channels stay inside Halcyon's mint / lilac / ice palette.
function hbSurveyColors(c,o){
  const palettes=[['#6ABBA0','#9981DE','#79CBD0'],['#9981DE','#79CBD0','#6ABBA0'],['#79CBD0','#6ABBA0','#9981DE']];
  const [body,edge,signal]=palettes[o.index%3];return {body,edge,signal,dark:c.p.dark};
}
function hbScanObject(c,o,x,y,w,h){
  const {k,p}=c,C=hbSurveyColors(c,o),ink=c.ink,A=k.a(C.edge,1),B=k.a(C.body,p.dark?.65:.5),S=k.a(C.signal,1),soft=c.soft,r=k.rng(o.index*197+71),cx=x+w/2,cy=y+h/2,R=Math.min(w*.3,h*(h>75?.31:.35));
  c.grid(x,y,w,h,10);k.rect(x,y,w,h,k.a(C.body,.07));const ln=(pts,col=ink,lw=.8)=>k.ln(pts,col,lw);
  if(['rock','moon','cloud','gas','rings'].includes(o.kind)){
    k.circ(cx,cy,R,B,ink,1);
    for(let j=0;j<7;j++){const a=-1.3+j*.18;k.arc(cx,cy,R*(.93-j*.035),a,a+2.3,k.a(C.edge,.24),1.4);}
    if(o.kind==='rock'||o.kind==='moon'){for(let j=0;j<13;j++){const a=r()*Math.PI*2,rr=Math.sqrt(r())*R*.72;const cr=R*(.03+r()*.12),xx=cx+Math.cos(a)*rr,yy=cy+Math.sin(a)*rr;k.circ(xx,yy,cr,k.a(C.edge,.24),j%4?soft:A,.5);k.arc(xx,yy,cr*.65,.4,2.9,S,.45);}}
    else for(let j=0;j<9;j++){const lat=-.84+j*.21,rr=R*Math.sqrt(Math.max(0,1-lat*lat)),pts=[];for(let z=0;z<=30;z++){const u=z/30;pts.push([cx-rr+2*rr*u,cy+R*lat+Math.sin(u*Math.PI)*(o.kind==='cloud'?Math.sin(u*12+o.index+j)*R*.08:R*.07)]);}ln(pts,j%3?S:A,j%3?.8:1.8);}
    if(o.kind==='gas'){const gx=cx+R*(o.index===3?.3:-.24),gy=cy+R*(o.index===3?.3:-.3);k.ell(gx,gy,R*.2,R*.09,null,A,.85);k.ell(gx,gy,R*.28,R*.14,null,soft,.45);}
    if(o.kind==='rings')for(let j=0;j<5;j++)k.ell(cx,cy,R*(1.2+j*.11),R*(.23+j*.027),null,j===2?A:soft,.7);
  }else if(o.kind==='ark'||o.kind==='pods'){
    const hull=R*(1.1+(o.index%4)*.08),ht=R*(.35+(o.index%3)*.15); k.poly([[cx-hull,cy],[cx-hull*.7,cy-ht],[cx+hull*.7,cy-ht],[cx+hull,cy],[cx+hull*.7,cy+ht],[cx-hull*.7,cy+ht]],B,ink,1);
    const n=4+o.index%5;for(let j=0;j<n;j++){const xx=cx-hull*.65+j*hull*1.3/(n-1);k.ell(xx,cy,o.kind==='pods'?R*.075:R*.09,ht*(o.kind==='pods'?.72:.35),k.a(j%2?C.signal:C.edge,.7),ink,.65);k.ln([[xx,cy-ht*.82],[xx,cy-ht*.55]],S,.65);k.rect(xx-R*.03,cy+ht*.64,R*.06,R*.04,ink);}
    for(let j=0;j<3;j++){const xx=cx-hull*.45+j*hull*.45;ln([[xx,cy-ht],[xx-R*.1,cy-ht-R*.16],[xx+R*.15,cy-ht-R*.16]],A,.55);}ln([[cx-hull,cy],[cx-hull-R*.23,cy-R*.1],[cx-hull-R*.23,cy+R*.1],[cx-hull,cy]],S,.85);
    if(o.kind==='ark'){ln([[cx-hull*.8,cy-ht-3],[cx+hull*.8,cy-ht-3]],A);for(let j=0;j<3;j++)ln([[cx-hull*.4+j*R*.4,cy+ht],[cx-hull*.4+j*R*.4,cy+ht+R*.3]],soft);}
  }else if(o.kind==='sail'){
    for(let j=0;j<4;j++){const a=j*Math.PI/2+o.index*.13,pt=(rad,ang)=>[cx+Math.cos(ang)*rad,cy+Math.sin(ang)*rad];k.poly([pt(R*.16,a),pt(R*1.3,a-.34),pt(R*.95,a+.48)],k.a(j%2?C.body:C.edge,.5),ink,.8);for(let q=1;q<6;q++)ln([pt(R*(.18+q*.16),a-.28),pt(R*(.18+q*.13),a+.31)],S,.45);ln([pt(R*.2,a),pt(R*1.25,a)],A,.9);}k.circ(cx,cy,R*.13,ink);
  }else if(o.kind==='relay'){
    k.rect(cx-R*.17,cy-R*.18,R*.34,R*.36,B,ink,.9);k.circ(cx,cy,R*.08,S);k.ell(cx,cy,R*.45,R*.3,null,A,.55);for(let j=0;j<3;j++){const a=j*2.09+o.index*.09,ex=cx+Math.cos(a)*R,ey=cy+Math.sin(a)*R;ln([[cx,cy],[ex,ey]]);k.arc(ex,ey,R*.24,a-Math.PI/2,a+Math.PI/2,ink,1);for(let q=1;q<3;q++)k.arc(ex,ey,R*(.26+q*.12),a-.7,a+.7,soft,.5);}
  }else if(o.kind==='swarm'){
    const pts=[];for(let j=0;j<21;j++){const a=r()*Math.PI*2,rr=Math.sqrt(r())*R*1.2;pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]);}pts.forEach((pt,j)=>{if(j%3===0){ln([pt,pts[(j+7)%pts.length]],A,.55);k.circ(pt[0],pt[1],3.5,null,S,.45);}k.poly([[pt[0]-2,pt[1]+1],[pt[0],pt[1]-2],[pt[0]+2,pt[1]+1]],j%3?ink:A);});
  }else if(o.kind==='lattice'){
    const pts=Array.from({length:10+o.index%7},(_,j)=>{const a=j*Math.PI*2/(10+o.index%7);return[cx+Math.cos(a)*R*(.65+r()*.4),cy+Math.sin(a)*R];});k.poly(pts,B,ink,.8);pts.forEach((pt,j)=>{k.poly([[cx,cy],pt,pts[(j+1)%pts.length]],k.a(j%2?C.edge:C.signal,.18));ln([pt,pts[(j+1)%pts.length]],ink,.8);ln([pt,pts[(j+4)%pts.length]],j%3?soft:A,.45);k.circ(pt[0],pt[1],1.4,A);});
  }else if(o.kind==='coil'){
    for(let j=0;j<5;j++){const pts=[];for(let z=0;z<=100;z++){const a=z*Math.PI/50,rr=R*(.64+.25*Math.sin(a*(o.index===7?3:5)+j*.3));pts.push([cx+Math.cos(a)*rr*(o.index===7?1:1.3),cy+Math.sin(a)*rr*(o.index===7?1:.55)+j-2]);}ln(pts,j%2?A:S,j===2?2:1.1);}
  }else if(o.kind==='bloom'){
    const lobes=7+o.index%9,stretch=o.index===23?.68:1;for(let j=0;j<lobes;j++){const a=j*Math.PI*2/lobes,pts=[];for(let z=0;z<=18;z++){const u=z/18,ang=a+Math.sin(u*4+j)*.35;pts.push([cx+Math.cos(ang)*R*u*stretch,cy+Math.sin(ang)*R*u]);}ln(pts,j%2?S:A,1.2);const pt=pts[pts.length-1];k.ell(pt[0],pt[1],R*.09,R*.14,B,ink,.6);k.circ(pt[0],pt[1],R*.035,S);}k.circ(cx,cy,R*.2,B,ink,.8);k.circ(cx,cy,R*.09,S);
  }else{
    if(o.index===25){for(let j=0;j<8;j++){const rr=R*(.25+j*.1);ln([[cx-rr,cy-rr*.7],[cx-rr*.35,cy-rr*.7]],soft);ln([[cx+rr*.35,cy+rr*.7],[cx+rr,cy+rr*.7]],A);ln([[cx-rr,cy-rr*.7],[cx-rr,cy+rr*.7],[cx+rr,cy+rr*.7],[cx+rr,cy-rr*.7]],soft,.5);}}else for(let j=0;j<9;j++){const rr=R*(.15+j*.1);if(o.index===35)k.ell(cx,cy,rr,rr*.55,null,j%3?S:A,.9);else k.arc(cx,cy,rr,.15*j,Math.PI*2-.1*j,j%3?soft:A,.7);}k.circ(cx,cy,R*.14,ink);ln([[cx-R*1.1,cy],[cx+R*1.1,cy]],soft,.45);
  }
  for(let j=0;j<12;j++){const yy=y+8+j*(h-16)/12;ln([[x+3,yy],[x+(j%3?5:8),yy]],A,.5);k.rect(x+w-5,yy,2,Math.max(.6,(h-16)/12-2),k.a(j%3?C.body:C.edge,.6));}
  if(h>75){c.t('RET / '+String(o.index*173+207),x+10,y+4,3.8,w-20,'mono',A);const pts=[];for(let j=0;j<45;j++){const u=j/44;pts.push([x+10+u*(w-20),y+h-7-Math.abs(Math.sin(u*(19+o.index%9)))*r()*5]);}ln(pts,S,.65);c.t('SPECTRAL / '+String(71+o.index%23)+'.'+o.index%10,x+10,y+h-18,3.7,w-20,'mono',soft);}
  for(const [xx,yy,dx,dy]of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]])ln([[xx,yy+dy*5],[xx,yy],[xx+dx*5,yy]],A,.9);
}
function hbObservationMap(c){
  const {k,d,t,title,small,big,p}=c,o=hbObservation(d),C=hbSurveyColors(c,o),mint=k.a('#8EDAB8',1),lav=k.a('#AE96F0',1),ice=k.a('#79CBD0',1),muted=k.a('#6ABBA0',.38);
  t(o.scan+' / SIM ARRAY',12,31,5.8,c.W-24,'mono',mint);
  title(small?o.id:o.name,12,44,small?146:big?340:220,small?16:big?25:17,1);
  const x=12,y=big?83:65,w=small?146:big?340:218,h=big?216:small?65:78;
  c.grid(x,y,w,h,14);const P=(u,v)=>[x+w*(.05+.8*u+.13*v),y+h*(.2-.15*u+.43*v)],ln=(pts,col=muted,lw=.6)=>k.ln(pts,col,lw),r=k.rng(o.index*71+12);
  // Purple survey plane, scan lines and return packets occupy the lower horizon.
  const horizon=[];for(let j=0;j<=60;j++){const u=j/60;horizon.push([x+w*u,y+h*(.88-.15*Math.sin(u*Math.PI))]);}
  k.poly([...horizon,[x+w,y+h],[x,y+h]],k.a('#433660',.76));
  for(let j=0;j<5;j++){const pts=horizon.map(([xx,yy])=>[xx,yy+(y+h-yy)*j/5]);ln(pts,k.a('#AE96F0',.47),.55);}
  for(let j=0;j<10;j++)ln([[x+w*.5,y+h*.72],[x+w*j/9,y+h]],k.a('#AE96F0',.44),.5);
  for(let j=0;j<(small?15:45);j++){const u=r(),v=.91+r()*.07;k.rect(x+w*u,y+h*v,2+r()*4,.8+r(),j%3?ice:k.a('#10251F',.9));}
  ln(horizon,mint,1);ln(horizon.map(([xx,yy])=>[xx,yy-h*.025]),ice,.5);
  // Oblique search grid, with restrained colored sectors and graduated axes.
  for(let j=0;j<6;j++){const u=r()*.83,v=r()*.8;k.poly([P(u,v),P(u+.1,v),P(u+.1,v+.13),P(u,v+.13)],k.a(j%2?C.body:C.edge,.12));}
  for(let j=0;j<=10;j++){ln([P(j/10,0),P(j/10,1)],k.a('#6ABBA0',j%5?.29:.62),j%5?.4:.75);ln([P(0,j/10),P(1,j/10)],k.a('#6ABBA0',j%5?.29:.62),j%5?.4:.75);if(big&&j%2===0){const q=P(j/10,1);t(String(j*12).padStart(3,'0'),q[0]-4,q[1]+3,3.9,19,'mono',lav);}}
  ln([P(0,0),P(1,0),P(1,1),P(0,1),P(0,0)],mint,.9);
  const points=[];for(let j=0;j<10;j++){const pt=P(.12+r()*.69,.13+r()*.67);points.push(pt);const col=j%3===0?ice:j%3===1?lav:mint;
    for(let a=1;a<4;a++)k.rect(pt[0]-a*3-1,pt[1]+a*.7-1,1.5,1.5,k.a(j%3?'#AE96F0':'#79CBD0',.6/a));
    if(j%3===0)k.circ(pt[0],pt[1],small?1.3:2,col);else k.rect(pt[0]-1.4,pt[1]-1.4,2.8,2.8,col);
    if(!small&&j%2===0)t('R'+String((o.index+j*3)%36+1).padStart(2,'0'),pt[0]+4,pt[1]-3,4.3,25,'mono',col);
  }
  const target=points[0];ln([P(.02,.92),P(.18,.72),P(.3,.66),target],ice,.75);
  for(let j=1;j<5;j++){const u=j/5,px=x+w*(.08+u*.45),py=y+h*(.83-u*.15),z=small?3:big?9:4;k.poly([[px-z,py-z*.5],[px+z*.55,py-z],[px+z,py+z*.5],[px-z*.55,py+z]],null,lav,.7);}
  k.poly([[target[0]-4,target[1]-3],[target[0]+4,target[1]-3],[target[0],target[1]+4]],null,mint,1.2);k.circ(target[0],target[1],7,null,lav,.8);
  const bx=x+w*.66,by=y+h*.66;ln([target,[bx-5,by-5],[bx+6,by-5]],lav,.65);
  if(!small){t(o.id+' / '+String(18+o.index*3%72)+'°',bx,by,4.7,w*.31,'mono',mint);t('ECHO '+(2.1+o.index*.37).toFixed(2)+' s',x+3,y+h*.68,4.5,w*.35,'mono',ice);}
  if(big){
    t('AZ '+String(31+o.index*7)+' / TRACK '+(1+o.index%4),x+4,y+2,4.6,150,'mono',lav);t('CUSTODY FIELD / '+o.sector,x+w-128,y+2,4.6,124,'mono',mint);
    for(let j=0;j<3;j++){k.rect(x-2,y+35+j*6,2,j===0?5:2,lav);k.rect(x+w-1,y+h*.54+j*5,2,3,ice);}
    ['NE','E','SE','S','SW','W'].forEach((v,j)=>t(v,x+17+j*(w-35)/6,y+h*.875,4.3,20,'mono',lav));
    t('10 CONTACTS / '+o.sector,12,308,6.5,210,'mono',mint);t('RETURN '+String(71+o.index%23)+'.'+o.index%10+'%',243,308,6,109,'mono',lav);
    c.field('SIMULATED LOCATION',o.coords,12,324,240,15);t(o.status,255,325,6,97,'mono',lav);t('PAIRED DOSSIER / '+o.id,12,352,6,230,'mono',ice);
  }else if(small)t(o.sector+' / '+o.status,12,138,5.4,146,'mono',mint);
  else{t('ARRAY / '+o.sector,244,34,6,108,'mono',lav);t(o.id,244,48,18,108,'disp');t(o.status,244,77,6,108,'mono',mint);t('10 CONTACTS',244,94,6,108,'mono',ice);t('SIM LOCATION',244,111,5,108);t(o.coords,244,121,5,108,'mono',lav);t('DOSSIER / SAME SCAN',244,139,5,108);}
}
function hbObservationDossier(c){
  const {d,t,title,small,big,k}=c,o=hbObservation(d),C=hbSurveyColors(c,o),accent=k.a(c.p.dark?'#AE96F0':'#6B509E',1);t(o.classification,12,31,5.8,c.W-24,'mono',accent);
  if(small){title(o.name,12,44,146,14,1,10);hbScanObject(c,o,12,66,146,61);t(o.id+' / '+o.scan,12,132,5.1,146);return;}
  if(!big){hbScanObject(c,o,12,46,116,95);title(o.name,141,44,211,19,2,12);t('SUBSECTOR '+(o.index+3)+' / GENETIC ESCROW',141,86,4.5,211,'mono',accent);t(o.details[0],141,96,6,211);t(o.details[1],141,111,6,211);t('POSITION / '+o.status,141,126,5.7,211,'mono',accent);t(o.id+' / '+o.scan,141,142,5.5,211);return;}
  title(o.name,12,45,340,29,1,16);hbScanObject(c,o,12,91,340,163);c.hr(263);t('SUBSECTOR '+(o.index+3)+' / GENETIC ESCROW',12,79,5.2,340,'mono',accent);t(o.details[0],12,273,8,340);t(o.details[1],12,291,8,340);t('POSITION / '+o.status+' / '+o.sector,12,314,6.5,340);t(o.known?'KNOWN BODY / SIMULATED SURVEY':'FICTIONAL OBJECT / HALCYON ARCHIVE',12,337,6,340);t(o.id+' / '+o.scan,12,351,6,340);
}
