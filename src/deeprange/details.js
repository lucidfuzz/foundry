// Instrument detail at native widget scale. These graphics are illustrative;
// calendar, weather, battery and game values continue to come from their adapters.
function drDetailGrid(k,x,y,w,h,step=12) {
  const a=drTools(k);
  k.rect(x,y,w,h,null,a.grid,.5);
  for(let i=step;i<w;i+=step)a.line(x+i,y,x+i,y+h,a.grid,.3);
  for(let i=step;i<h;i+=step)a.line(x,y+i,x+w,y+i,a.grid,.3);
  for(let i=0;i<=w;i+=step/2){const len=i%step===0?3:1.4;a.line(x+i,y,x+i,y+len,a.S,.35);a.line(x+i,y+h-len,x+i,y+h,a.S,.35);}
  for(let i=step/2;i<h;i+=step/2){const len=i%step===0?3:1.4;a.line(x,y+i,x+len,y+i,a.S,.35);a.line(x+w-len,y+i,x+w,y+i,a.S,.35);}
  for(let j=step;j<h;j+=step*2)for(let i=step;i<w;i+=step*2){a.line(x+i-1,y+j,x+i+1,y+j,k.a(a.ink,.16),.35);a.line(x+i,y+j-1,x+i,y+j+1,k.a(a.ink,.16),.35);}
}
function drPacketStrip(k,x,y,w,h,seed) {
  const a=drTools(k),rnd=k.rng(seed),count=Math.floor(w/3.5);
  for(let i=0;i<count;i++){const n=rnd();k.rect(x+i*w/count,y,w/count-1,h,n>.94?a.R:n>.48?k.a(a.ink,.38):k.a(a.blue,.6));if(n>.85)a.line(x+i*w/count,y-1,x+i*w/count,y+h+1,a.S,.35);}
}
function drDetailWave(k,x,y,w,h,seed=1,kind=0) {
  const a=drTools(k);drGrid(k,x,y,w,h,12);
  const wave=(u,n)=>Math.sin(u*(kind===1?12:31)+seed+n*.033)*Math.sin(u*8+n*.055)*.29+Math.sin(u*119+seed+n*.3)*.028;
  // Close-spaced traces read as a captured signal envelope, not one generic sine.
  const layers=kind===1?32:12;
  for(let n=layers-1;n>=0;n--){const pts=[];for(let i=0;i<=180;i++){const u=i/180,v=wave(u,n);pts.push([x+u*w,y+h*(.49+v+(n-layers/2)*.004)]);}k.ln(pts,n===0?a.I:k.a(n%7===0?a.red:a.blue,n%7===0?.28:.55),n===0?.85:.35);}
  a.line(x,y+h*.49,x+w,y+h*.49,k.a(a.ink,.22),.35);
  for(const u of [.19,.52,.81]){const xx=x+u*w,yy=y+h*(.49+wave(u,0));a.line(xx,y+4,xx,y+h-4,k.a(a.ink,.2),.35);k.circ(xx,yy,1.6,null,a.I,.5);k.rect(xx-1,y+1,2,2,a.R);}
  drPacketStrip(k,x+3,y+h-4,w-6,2,seed+23);
  if(h>55){a.t(kind===1?'COHERENCE / MULTIPASS':'RX / PHASE CAPTURE',x+5,y+5,4.1,w-10,a.S);a.t('0',x+5,y+h-12,4,15,a.S);a.t('1.0',x+w-17,y+h-12,4,15,a.S);}
}
function drDetailWaterfall(k,x,y,w,h,seed=1) {
  const a=drTools(k),rnd=k.rng(seed),cols=w<180?64:96,rows=h>80?30:20,cw=w/cols,ch=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const u=i/cols,peak=Math.exp(-Math.pow((u-.272-Math.sin(j*.31)*.01)/.026,2)),side=Math.exp(-Math.pow((u-.66-Math.sin(j*.12)*.008)/.008,2)),noise=rnd();
    const v=peak*.84+side*.32+noise*.27,drop=j%11===0?.6:1;
    k.rect(x+i*cw,y+j*ch,Math.max(.3,cw-.35),Math.max(.3,ch-.3),k.a(v>.48?a.ink:a.blue,Math.min(1,(.12+v*.9)*drop)));
  }
  for(let i=1;i<8;i++)a.line(x+i*w/8,y,x+i*w/8,y+h,k.a(a.ink,.14),.4);
  a.line(x+w*.272,y,x+w*.272,y+h,a.R,.7);
  k.poly([[x+w*.272-3,y+2],[x+w*.272+3,y+2],[x+w*.272,y+6]],a.I);
  for(let j=0;j<5;j++){const yy=y+7+j*(h-14)/4;a.line(x+2,yy,x+6,yy,a.I,.5);a.line(x+w-6,yy,x+w-2,yy,a.I,.5);}
  drBracket(k,x,y,w,h);
}
function drDetailTrajectory(k,x,y,w,h,seed=0) {
  const a=drTools(k);drGrid(k,x,y,w,h,Math.max(10,w/14));
  const pt=t=>[x+w*(.09+.80*t),y+h*(.83-.64*Math.sin(t*1.4))];
  for(let band=-2;band<=2;band++){let pts=[];for(let i=0;i<=80;i++){const t=i/80,p=pt(t);pts.push([p[0],p[1]+band*(1.5+t*3)]);}k.ln(pts,band===0?a.I:k.a(a.blue,.6),band===0?.8:.4);}
  for(let i=0;i<10;i++){
    const t=.07+i*.093,[xx,yy]=pt(t),s=h*(.115-i*.0065),ang=-.8+t*.45,pts=[];
    for(let j=0;j<4;j++){const u=(j===0||j===3?-1:1)*s,v=(j<2?-1:1)*s*.64;pts.push([xx+u*Math.cos(ang)-v*Math.sin(ang),yy+u*Math.sin(ang)+v*Math.cos(ang)]);}
    k.poly(pts,null,k.a(a.red,.9-i*.035),.65);k.circ(xx,yy,1,k.a(a.ink,.7));
    if(i%3===0)a.line(xx,yy+4,xx,y+h-7,k.a(a.ink,.14),.35);
  }
  const [cx,cy]=pt(.97);k.circ(cx,cy,3,null,a.R,1);k.circ(cx,cy,8,null,k.a(a.red,.4),.4);a.line(cx-11,cy,cx+11,cy,a.S,.35);a.line(cx,cy-10,cx,cy+10,a.S,.35);
  for(let i=0;i<3;i++){const xx=x+w*(.19+i*.27),yy=y+h*(.38+i*.17);k.poly([[xx,yy],[xx+3,yy-5],[xx-3,yy-5]],null,a.I,.65);a.t(['WPT 11','RELAY 07','ECHO 04'][i],i===2?xx-32:xx+5,yy-5,3.9,i===2?30:45,a.S);}
  if(w>220){a.t('VECTOR HISTORY / ILLUSTRATED',x+6,y+5,4.4,w-12,a.S);a.t('T-04',x+6,y+h-12,4.2,40,a.S);a.t('T-00',x+w-28,y+h-12,4.2,24,a.S);}
  drBracket(k,x,y,w,h);
}
// Catalogue bodies use this sparse radar vocabulary; orbital UI retains its own globe.
function drRadarWorld(k,c,x,y,w,h){
  const a=drTools(k),kind=c.world||c.kind,cx=x+w/2,cy=y+h/2,r=Math.min(w*.27,h*(kind==='uranus'?.27:.35));
  const stroke=k.a(a.ink,.82),faint=k.a(a.blue,.65),soft=k.a(a.ink,.31);
  const path=(pts,color=stroke,width=.7)=>k.ln(pts.map(([u,v])=>[cx+u*r,cy+v*r]),color,width);
  const circle=(u,v,rr,color=stroke)=>k.circ(cx+u*r,cy+v*r,rr*r,null,color,.7);
  const ellipse=(u,v,rx,ry,color=soft)=>k.ell(cx+u*r,cy+v*r,rx*r,ry*r,null,color,.6);
  const curve=(fn,color=stroke,start=0,end=Math.PI*2)=>{const p=[];for(let i=0;i<=64;i++)p.push(fn(start+(end-start)*i/64));path(p,color);};
  // Calibration/last-return marks stay separate from the recognizable body silhouette.
  path([[-1.48,.64],[-1.18,.48]],soft,.5);circle(-1.48,.64,.025,a.R);
  if(kind==='binary'){
    ellipse(0,0,1.42,.56,faint);circle(-.57,-.12,.63);circle(.68,.16,.42);
    ellipse(-.57,-.12,.25,.63);ellipse(.68,.16,.42,.13);path([[-.05,.05],[.23,.12]],a.R,.65);return;
  }
  if(kind==='facet'){
    const pts=[[-.9,-.36],[-.24,-1],[.64,-.74],[1,.12],[.43,.94],[-.55,.8],[-.9,-.36]];path(pts);
    for(let i=0;i<6;i++)path([pts[i],[.12,-.08]],i%2?soft:faint);
    path([pts[0],pts[2],pts[4],pts[0]],soft);return;
  }
  if(kind==='shards'){
    for(const [u,v,rr,rot]of [[-.53,-.46,.44,.1],[.4,-.58,.35,.7],[.65,.18,.32,.2],[-.14,.43,.48,.5],[-.82,.31,.19,.4]]){
      const pts=[];for(let i=0;i<=5;i++){const t=rot+i*Math.PI*2/5;pts.push([u+Math.cos(t)*rr,v+Math.sin(t)*rr]);}path(pts);path([pts[0],pts[2],pts[4]],soft);
    }
    curve(t=>[1.18*Math.cos(t),1.18*Math.sin(t)],faint,.1,2.1);return;
  }
  if(kind==='hollow'){
    curve(t=>[Math.cos(t),Math.sin(t)],stroke,.42,5.5);
    curve(t=>[.73*Math.cos(t),.73*Math.sin(t)],soft,.42,5.5);
    for(const t of [.42,5.5])path([[Math.cos(t),Math.sin(t)],[.73*Math.cos(t),.73*Math.sin(t)]]);
    ellipse(-.05,0,.28,.51,faint);path([[-.3,0],[.3,0]],a.R);return;
  }
  if(kind==='crescent'){
    curve(t=>[Math.cos(t),Math.sin(t)],stroke,-Math.PI/2,Math.PI/2);
    curve(t=>[.32*Math.cos(t),Math.sin(t)],soft,-Math.PI/2,Math.PI/2);
    curve(t=>[Math.cos(t),Math.sin(t)],faint,Math.PI/2,Math.PI*1.5);
    for(let i=0;i<5;i++){const yy=-.68+i*.34,edge=Math.sqrt(1-yy*yy);path([[edge*.45,yy],[edge*.95,yy]],soft);}
    return;
  }
  if(kind==='seam'){
    curve(t=>[Math.cos(t),Math.sin(t)],stroke,0,Math.PI*2);
    path([[.05,-1],[-.21,-.56],[.14,-.21],[-.17,.12],[.2,.49],[-.08,1]],a.R,.95);
    path([[-.14,-.83],[-.38,-.54],[-.05,-.19],[-.35,.16],[-.06,.52]],soft);
    ellipse(0,0,.48,1,faint);return;
  }
  // Familiar worlds: recognizable attributes, interpreted as line returns, never photos.
  circle(0,0,1);
  if(kind==='saturn'){
    for(const n of [1.35,1.65,1.87])ellipse(0,0,n,n*.25,n===1.65?stroke:soft);
    ellipse(0,0,.38,1,faint);path([[-.78,-.42],[.78,-.42]],soft);return;
  }
  if(kind==='uranus'){
    for(const n of [1.3,1.61])ellipse(0,0,n*.22,n,n===1.3?stroke:soft);
    ellipse(0,0,1,.26,faint);return;
  }
  if(kind==='mercury'){
    for(const [u,v,rr]of [[-.35,-.4,.23],[.36,-.25,.13],[.17,.41,.28],[-.57,.19,.12],[-.02,-.74,.075]]){circle(u,v,rr,soft);ellipse(u+.025,v+.025,rr*.65,rr*.62,faint);}return;
  }
  if(kind==='earth'){
    ellipse(0,0,.39,1,faint);ellipse(0,0,1,.28,faint);
    path([[-.71,-.58],[-.31,-.78],[-.05,-.48],[-.27,-.22],[-.11,.03],[-.32,.21],[-.39,-.08],[-.65,-.2],[-.71,-.58]]);
    path([[-.28,.17],[.04,.26],[.1,.48],[-.15,.85],[-.26,.47],[-.28,.17]]);
    path([[.14,-.65],[.55,-.61],[.81,-.31],[.57,-.15],[.72,.19],[.41,.25],[.3,.58],[.12,.24],[.2,-.02],[.03,-.21],[.14,-.65]]);return;
  }
  if(kind==='mars'){
    ellipse(0,0,.48,1,faint);ellipse(0,0,.96,.24,soft);
    path([[-.75,.08],[-.43,-.09],[-.21,.01],[.1,-.14],[.41,-.05],[.76,-.22]],a.R,.85);
    path([[-.37,-.63],[-.15,-.69],[.03,-.54]],soft);circle(.48,.44,.13,soft);return;
  }
  if(kind==='neptune'){
    ellipse(0,0,.36,1,faint);for(const yy of [-.55,0,.5])ellipse(0,yy,Math.sqrt(1-yy*yy),.12,soft);
    ellipse(.36,-.25,.2,.075,stroke);path([[-.46,.53],[-.04,.6],[.31,.51]],a.R,.55);return;
  }
  // Jupiter's horizontal banding and Venus's oblique cloud traces read differently.
  for(let j=-3;j<=3;j++){
    const yy=j*.22,half=Math.sqrt(1-yy*yy)*.97,pts=[];
    for(let i=0;i<=26;i++){const u=-half+i/26*half*2;pts.push([u,yy+Math.sin(u*(kind==='venus'?5:8)+j)*.035]);}
    if(kind==='venus')path(pts.map(([u,v])=>[u*.8-v*.6,u*.6+v*.8]),j%2?soft:stroke);else path(pts,j%2?soft:stroke);
  }
  if(kind==='jupiter')ellipse(.33,.31,.25,.12,a.R);
}
function drRadarAnomaly(k,c,x,y,w,h){
  const a=drTools(k),cx=x+w/2,cy=y+h/2,r=Math.min(w,h)*.32;
  if(c.form==='lens'){
    for(let i=0;i<7;i++)k.ell(cx,cy,r*(.33+i*.13),r*(.95-i*.06),null,k.a(i%2?a.ink:a.blue,.7),.65);
    k.ln([[cx-r*1.4,cy-r*.6],[cx-r*.55,cy-r*.36],[cx+r*.4,cy-r*.66],[cx+r*1.35,cy-r*.56]],a.R,.7);
  }else{
    for(let j=0;j<3;j++){const xx=cx+(j-1)*r*.75,yy=cy+(j===1?-.28:.22)*r;
      for(let i=1;i<=3;i++)k.circ(xx,yy,r*(.15+i*.12),null,k.a(j===1?a.ink:a.blue,.85-i*.15),.7);
      k.rect(xx-1,yy-1,2,2,a.R);
    }
  }
}
function drDetailPlanet(k,x,y,r,kind='neptune') {
  const a=drTools(k),sat=kind==='saturn',base=sat?'#D4B978':a.blue;
  if(sat)for(let i=0;i<24;i++)k.ell(x,y,r*(1.38+i*.025),r*(.34+i*.007),null,k.a(a.ink,i%7===0?.18:.44),Math.max(.35,r*.01));
  k.circ(x,y,r,k.a(base,1),k.a(a.ink,.5),.5);
  // Banded surface clipped analytically to the sphere; no bitmap placeholder.
  for(let j=-32;j<=32;j++){const dy=j*r/33,rx=Math.sqrt(Math.max(0,r*r-dy*dy)),n=(Math.sin(j*1.81)+1)/2;k.ln([[x-rx,y+dy],[x+rx,y+dy]],k.a(sat?'#594D31':a.ink,.08+n*.18),Math.max(.35,r/34));}
  for(let i=0;i<25;i++){const u=i/25,xx=x+r*(.1+.87*u),ry=Math.sqrt(Math.max(0,r*r-(xx-x)**2));a.line(xx,y-ry,xx,y+ry,k.a('#02040B',u*.52),Math.max(.45,r*.038));}
  for(let j=1;j<=3;j++)k.ell(x,y,j*r/4,r,null,k.a(a.ink,.21),.35);
  for(let j=-2;j<=2;j++)k.ell(x,y+j*r*.3,Math.sqrt(1-j*j*.09)*r,r*.12,null,k.a(a.ink,.17),.3);
  if(sat)for(let i=0;i<24;i++){const pts=[];for(let q=0;q<=60;q++){const u=q/60*Math.PI;pts.push([x+Math.cos(u)*r*(1.38+i*.025),y+Math.sin(u)*r*(.34+i*.007)]);}k.ln(pts,k.a(a.ink,i%7===0?.2:.62),Math.max(.35,r*.012));}
}
function drDetailIntercept(k,x,y,w,h,seed) {
  const a=drTools(k),rnd=k.rng(seed),cols=w>100?38:26,rows=h>80?32:24,kind=Math.abs(seed)%3;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const nx=(i/cols-.5)*2,ny=(j/rows-.5)*2,rr=Math.sqrt(nx*nx+ny*ny);
    const shape=kind===0?Math.exp(-Math.pow((rr-.53)/.11,2))*(.6+.4*Math.cos(nx*8)):kind===1?Math.exp(-Math.pow((ny-.4*Math.sin(nx*4))/.15,2)):Math.max(0,1-Math.abs(nx*.9+ny*.55))*(.5+.5*Math.cos(ny*17));
    const v=shape*.76+rnd()*.28;
    k.rect(x+i*w/cols,y+j*h/rows,Math.max(.4,w/cols-.35),Math.max(.4,h/rows-.35),k.a(v>.5?a.ink:a.blue,.12+v*.82));
  }
  a.line(x+w*.5,y+4,x+w*.5,y+h-4,k.a(a.ink,.34),.4);a.line(x+4,y+h*.5,x+w-4,y+h*.5,k.a(a.ink,.34),.4);
  k.rect(x+w*.35,y+h*.32,w*.29,h*.36,null,k.a(a.red,.8),.55);drPacketStrip(k,x+4,y+h-5,w-8,2,seed+8);drBracket(k,x,y,w,h);
}
function drDetailNetwork(k,x,y,w,h,seed) {
  const a=drTools(k),rnd=k.rng(seed),pts=Array.from({length:10},(_,i)=>{const angle=i*Math.PI*.2-.3,rr=.27+rnd()*.13;return [x+w*(.5+Math.cos(angle)*rr),y+h*(.5+Math.sin(angle)*rr)];});
  drGrid(k,x,y,w,h,14);
  pts.forEach((p,i)=>{for(let j=i+1;j<pts.length;j++)if((i+j)%4===0||j===i+1){const q=pts[j];k.ln([p,q],k.a(a.blue,.9),.65);const f=.2+(i%4)*.16,m=[p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f];k.rect(m[0]-.7,m[1]-.7,1.4,1.4,a.I);}k.circ(...p,5,null,a.S,.4);if(i===4)k.circ(...p,8,null,k.a(a.red,.5),.5);k.rect(p[0]-2,p[1]-2,4,4,i===4?a.R:a.I);a.t(String(i+1).padStart(2,'0'),p[0]+6,p[1]-3,4,15,a.S);});
  if(h>130){a.t('RELAY TOPOLOGY / ILLUSTRATED',x+6,y+6,4.8,w-12,a.S);drPacketStrip(k,x+7,y+h-9,w-14,3,seed);}
}
function drOrbitDetail(k,W,H,d) {
  const a=drTools(k),s=W<200,b=H>200,cx=s?84:b?182:280,cy=s?122:b?226:85,rx=s?66:b?154:70,ry=s?19:b?70:42;
  a.line(cx-rx+5,cy,cx+rx-5,cy,k.a(a.ink,.16),.4);
  for(let n=1;n<=3;n++)k.ell(cx,cy,rx-n*3,ry-n*1.2,null,k.a(a.blue,.30),.4);
  for(let i=0;i<64;i++){const u=i*Math.PI/32,len=i%8===0?4:1.7;a.line(cx+Math.cos(u)*(rx-len),cy+Math.sin(u)*(ry-len*.4),cx+Math.cos(u)*rx,cy+Math.sin(u)*ry,a.S,.35);}
  if(b){for(const [label,x,y]of [['ACQUISITION',19,165],['OCCULTATION',263,282],['N',180,157],['S',180,302]])a.t(label,x,y,4.5,80,a.S);drPacketStrip(k,14,312,336,3,21);}
}
function drContactDetail(k,c,x,y,w,h,labels=true) {
  const a=drTools(k);a.line(x+w*.5,y+3,x+w*.5,y+8,a.I,.7);a.line(x+w*.5,y+h-8,x+w*.5,y+h-3,a.I,.7);
  for(let i=0;i<4;i++){a.line(x+5,y+14+i*7,x+8+(i%2)*3,y+14+i*7,a.S,.4);a.line(x+w-11,y+14+i*7,x+w-5,y+14+i*7,a.S,.4);}
  const c1=!c.type?.startsWith('KNOWN');if(labels)a.t(c1?'UNR':'CAT',x+6,y+5,3.7,24,c1?a.R:a.S);
  if(labels)drPacketStrip(k,x+8,y+h-7,w-16,2,c1?19:31);
  if(h>130){const xx=x+w*.71,yy=y+h*.33;k.ln([[xx,yy],[x+w-32,yy-13],[x+w-8,yy-13]],a.S,.5);k.circ(xx,yy,2,null,a.R,.65);if(labels)a.t(c.kind==='relay'?'RADAR RECONSTRUCTION':c1?'PROVISIONAL SCAN':'CATALOGUE SCAN',x+8,y+h-20,4.4,w-16,a.S);}
}
function drSalvageDetail(k,W,H,d) {
  const a=drTools(k),s=W<200,b=H>200,st=d.st||{},x=12,y=32,w=s?146:b?340:200,h=s?69:b?170:110,rnd=k.rng((st.vseed||37)+13);
  // Illustrative salvage field; all drone positions and breadcrumbs are saved game state.
  for(let n=0;n<(s?4:9);n++){
    const xx=x+10+rnd()*(w-20),yy=y+17+rnd()*(h-28),r=2+rnd()*4,pts=[];
    for(let j=0;j<6;j++){const u=j*Math.PI/3,rr=r*(.6+rnd()*.4);pts.push([xx+Math.cos(u)*rr,yy+Math.sin(u)*rr]);}
    k.poly(pts,null,k.a(a.ink,.24),.4);if(n%3===0)k.circ(xx,yy,r+3,null,k.a(a.blue,.5),.35);
  }
  const trail=st.trail||[];for(let i=0;i<trail.length;i++){const p=trail[i],xx=x+p[0]*w,yy=y+p[1]*h;k.circ(xx,yy,1.3,null,k.a(a.green,.65),.5);}
  const pos=st.pos||[.5,.55],xx=x+pos[0]*w,yy=y+pos[1]*h;
  for(let i=0;i<3;i++)k.arc(xx,yy,7+i*5,-1.1,.7,k.a(a.green,.32-i*.07),.45);
  a.line(xx,y+15,xx,y+h-6,k.a(a.green,.12),.35);a.line(x+5,yy,x+w-5,yy,k.a(a.green,.12),.35);
  if(!s)a.t('GRID '+pos.map(v=>Number(v).toFixed(3)).join(' / '),x+5,y+h-10,4.4,w-10,a.S);
  if(b){a.t('BEST '+(st.best||0)+' J',263,244,5.5,89,a.S);}
}
function drAddDetails(k,W,H,d) {
  const a=drTools(k),s=W<200,b=H>200,m=d.mode;
  // Fine registration marks live at the frame edge, away from primary type.
  for(let y=62;y<H-42;y+=11){a.line(5,y,y%2?8:7,y,k.a(a.ink,.28),.35);a.line(W-8,y,W-5,y,k.a(a.ink,.24),.35);}
  if(m==='status'){
    const bx=s?80:92,bw=s?77:107;if(d.batt!=null)k.segs(bx,138,bw,3,s?18:24,d.batt,a.I,k.a(a.ink,.12),1);
    for(let x=12;x<(s?160:204);x+=8)a.line(x,98,x,100,k.a(a.ink,.4),.35);
    if(b){drContactDetail(k,{kind:'relay'},12,168,340,169,false);a.t('RX / 07',307,188,4.5,39,a.S);}
  }else if(m==='shift')drOrbitDetail(k,W,H,d);
  else if(m==='solar'){
    if(d.sun){const x=12,y=96,w=W-24,h=b?92:31;for(let i=1;i<6;i++){const yy=y+h*i/6;a.line(x,yy,x+w,yy,k.a(a.ink,.13),.35);}for(let i=0;i<12;i++)a.line(x+i*w/12,y+h-3,x+i*w/12,y+h,a.S,.4);}
    if(b){const at=d.atm||{},wx=d.wx||{},temp=v=>v==null?null:((T.units==='celsius'?v*9/5+32:v)+50)/180,values=[at.rh==null?null:at.rh/100,at.ws==null?null:at.ws/60,at.uv==null?null:at.uv/11,temp(wx.hi),temp(wx.lo),temp(wx.feels)];values.forEach((v,i)=>{if(v==null)return;const x=19+i%3*116,y=238+Math.floor(i/3)*47;k.segs(x,y,93,2.3,23,v,i===2?a.R:a.B,k.a(a.ink,.11),1);});}
  }else if(m==='transmission'){if(b)drPacketStrip(k,12,178,340,4,d.seed);}
  else if(m==='feeds'){
    if(!s&&!b)for(let side=0;side<2;side++){const x=12+side*182;for(let i=0;i<3;i++){a.t(['SIGNAL','BUFFER','PARITY'][i],x,131+i*6,3.8,38,a.S);k.segs(x+43,132+i*6,114,2.2,24,[.86,.55,.94][(i+side)%3],i===1?a.B:a.I,k.a(a.ink,.12),1);}}
    if(b){drPacketStrip(k,12,181,340,4,7);drPacketStrip(k,12,335,340,3,13);}
  }else if(m==='youtube'){
    const x=12,y=32,w=s?146:b?340:177,h=b?173:s?68:108;
    for(let n=0;n<9;n++){const xx=x+n*w/9;for(let j=0;j<Math.floor(h/5);j++){const yy=y+3+j*5,len=(1+Math.sin(n*7+j*2.1))*.3*w/9;a.line(xx+2,yy,xx+2+len,yy,k.a(a.ink,.27),.4);}a.line(xx+w/18,y+3,xx+w/18,y+h-3,k.a(a.ink,.24),.35);k.rect(xx+2,y+h-5,w/9-4,2,n===5?a.R:a.I);}
    if(b){drPacketStrip(k,12,332,340,4,412);a.t('FRAME 0412 / CONTINUOUS BUFFER',12,319,5,340,a.S);}
    else if(!s)a.t('RX 07 / FRAME 0412',205,121,5,147,a.S);
  }else if(m==='instagram'){if(b)drPacketStrip(k,12,292,340,4,d.seed);}
  else if(m==='oddity')drPacketStrip(k,12,b?142:s?94:88,W-24,b?5:3,d.seed+71);
  else if(m==='discord'){
    if(!s&&!b)drPacketStrip(k,205,64,147,3,37);
    if(b){drPacketStrip(k,206,298,145,4,37);a.t('ROUTES / ILLUSTRATED',206,285,4.5,145,a.S);a.t('REPEATER / 07',206,313,5,145,a.S);}
  }else if(m==='game')drSalvageDetail(k,W,H,d);
  else if(m==='tracker'){
    const idx=Math.abs(d.seed||0)%DR_CONTACTS.length,c=DR_CONTACTS[idx];
    if(s)drContactDetail(k,c,12,46,146,85);else if(b)drContactDetail(k,c,12,78,340,202);else [c,DR_CONTACTS[(idx+1)%DR_CONTACTS.length]].forEach((q,i)=>drContactDetail(k,q,12+i*176,44,164,85));
  }
}
