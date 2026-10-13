// Deep Range is vector-only. Every wallpaper is a different instrument scene.
// Draw in the existing 390-point wallpaper coordinate system; no raster assets.
function drWallTools(ctx,th){
  const c=th.colors,I=c.ink,R=c.accent,B=c.glow,G=c.alert||'#3DFF8A';
  const line=(p,col=I,width=.7,close=false)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(close)ctx.closePath();ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke();};
  const ell=(x,y,rx,ry,col=I,width=.7,rot=0,start=0,end=Math.PI*2)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,start,end);ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke();};
  const text=(s,x,y,size=6,col=I)=>{ctx.fillStyle=col;ctx.font=`400 ${size}px ${th.fonts.mono}`;ctx.textAlign='left';ctx.fillText(s,x,y);};
  const rect=(x,y,w,h,col=I)=>{ctx.fillStyle=col;ctx.fillRect(x,y,w,h);};
  const cross=(x,y,col=R)=>{line([[x-4,y],[x+4,y]],col);line([[x,y-4],[x,y+4]],col);};
  const bracket=(x,y,w,h)=>{for(const [xx,yy,dx,dy]of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]])line([[xx,yy+dy*7],[xx,yy],[xx+dx*7,yy]],R,1.2);};
  const grid=(x,y,w,h,step=20)=>{for(let xx=x;xx<=x+w;xx+=step)line([[xx,y],[xx,y+h]],hexA(I,.1),.4);for(let yy=y;yy<=y+h;yy+=step)line([[x,yy],[x+w,yy]],hexA(I,.1),.4);};
  const ship=(x,y,s=1,turn=0,type=0)=>{const shapes=[[[ -13,-5],[-5,-5],[-5,-9],[8,-9],[8,-4],[14,0],[8,4],[8,9],[-5,9],[-5,5],[-13,5],[-13,-5]], [[-15,-6],[5,-6],[15,-13],[9,0],[15,13],[5,6],[-15,6],[-8,0],[-15,-6]], [[-17,-2],[-5,-2],[-5,-12],[2,-12],[2,-2],[19,0],[2,2],[2,12],[-5,12],[-5,2],[-17,2],[-17,-2]]];const map=p=>p.map(([u,v])=>[x+s*(u*Math.cos(turn)-v*Math.sin(turn)),y+s*(u*Math.sin(turn)+v*Math.cos(turn))]);line(map(shapes[type%3]),I,.9);line(map([[-3,-3],[5,-3],[5,3],[-3,3],[-3,-3]]),hexA(I,.4),.45);};
  return {I,R,B,G,line,ell,text,rect,cross,bracket,grid,ship};
}
function drWallSweep(ctx,th,top,bottom,quiet=false){
  const a=drWallTools(ctx,th),{I,R,B,G,line,ell,text,cross,bracket,ship}=a,h=bottom-top,cx=192,cy=top+h*.52,r=Math.min(164,h*.44);
  for(let j=1;j<=5;j++)ell(cx,cy,r*j/5,r*j/5,hexA(j===5?I:B,j===5?.6:.55),j===5?.9:.55);
  for(let i=0;i<72;i++){const u=i*Math.PI/36,rr=r+(i%6===0?8:3);line([[cx+Math.cos(u)*r,cy+Math.sin(u)*r],[cx+Math.cos(u)*rr,cy+Math.sin(u)*rr]],hexA(I,i%6===0?.65:.27),.5);}
  for(let i=0;i<8;i++){const u=i*Math.PI/4;line([[cx,cy],[cx+Math.cos(u)*r,cy+Math.sin(u)*r]],hexA(I,.12),.45);}
  for(let i=0;i<13;i++){const u=-.78-i*.015;line([[cx,cy],[cx+Math.cos(u)*r,cy+Math.sin(u)*r]],hexA(G,.45-i*.03),.7);}
  cross(cx,cy,I);text('07',cx+7,cy-6,6);
  for(let i=0;i<9;i++){const u=i*2.399+.2,rr=r*(.24+(i%4)*.19),x=cx+Math.cos(u)*rr,y=cy+Math.sin(u)*rr;a.rect(x-1,y-1,2,2,hexA(R,.8));line([[x-4,y+5],[x-8,y+8]],hexA(R,.4),.5);if(!quiet&&i%3===0)text('U-'+(i+4),x+5,y-3,4,hexA(R,.7));}
  if(!quiet)for(let i=0;i<8;i++){const u=i*Math.PI/4;const x=cx+Math.cos(u)*(r-12),y=cy+Math.sin(u)*(r-12);text(String(i*45).padStart(3,'0'),x-5,y+2,3.7,hexA(I,.5));}
  const contacts=[[-.56,.2,1.05,-.55,0,'DEAD LETTER'],[.52,-.45,.7,.35,2,'LONG WAKE'],[.22,.61,.63,-.1,1,'WAYFARER']];
  contacts.forEach(([u,v,s,t,k,label],i)=>{const x=cx+u*r,y=cy+v*r;ship(x,y,s,t,k);bracket(x-22,y-20,44,40);for(let j=1;j<=4;j++)ell(x-j*8,y+j*5,1,1,hexA(R,.6-j*.1),.6);if(!quiet){text('0'+(i+1)+' / '+label,x-28,y+31,4.8);text('RETURN '+[81,47,63][i]+'%',x-28,y+40,4,hexA(I,.5));}});
  if(!quiet){text('AZ / 000',cx-17,cy-r-13,5);text('SCAN ARC  /  315',22,bottom-5,5,hexA(I,.6));text('3 VESSELS / 9 UNRESOLVED',220,bottom-5,5,R);}
}
function drWallSurvey(ctx,th,top,bottom,quiet=false){
  const a=drWallTools(ctx,th),{I,R,B,line,ell,text,cross,bracket}=a,h=bottom-top,cx=276,cy=top+h*.48,r=Math.min(137,h*.37);
  // An off-centre planetary wire scan with a detached moon and plotted occultation.
  ctx.save();ctx.beginPath();ctx.rect(14,top,362,h);ctx.clip();
  ell(cx,cy,r,r,I,1.1);
  for(let i=1;i<=5;i++)ell(cx,cy,r*i/6,r,hexA(B,.9),.65);
  for(let j=-3;j<=3;j++){const dy=j*r*.23;ell(cx,cy+dy,Math.sqrt(r*r-dy*dy),r*.1,hexA(I,.35),.6);}
  const fault=[[-.27,-.95],[-.42,-.66],[-.14,-.45],[-.26,-.16],[.01,.11],[-.16,.42],[.12,.7],[.06,.99]];line(fault.map(([u,v])=>[cx+u*r,cy+v*r]),R,1.25);
  for(let n=0;n<3;n++)ell(cx,cy,r*(1.27+n*.08),r*(.35+n*.026),hexA(B,.7-n*.13),.8,-.45);
  ctx.restore();
  const mx=72,my=top+h*.2;ell(mx,my,27,27,I,.8);ell(mx,my,10,27,hexA(B,.8),.6);ell(mx-7,my-8,6,5,hexA(I,.4));ell(mx+9,my+7,4,4,hexA(I,.4));bracket(mx-35,my-35,70,70);
  line([[mx+28,my+13],[cx-r*.73,cy-r*.49]],hexA(I,.3),.6);
  cross(cx-r*.24,cy+r*.32);line([[cx-r*.24,cy+r*.32],[66,cy+r*.32],[42,cy+r*.32+27]],R,.65);
  if(!quiet){text('K-17 / SEAM',23,top+8,8);text('MOON 02',41,my+47,5);text('FAULT DISPLACEMENT',24,cy+r*.32+40,5);text('CLASSIFICATION PENDING',24,cy+r*.32+50,4.4,hexA(I,.5));text('ILLUSTRATIVE / NOT LIVE EPHEMERIS',22,bottom-5,4.5,hexA(I,.55));}
  if(!quiet){
    const yy=bottom-66;text('SURFACE RETURN / SLICE 04',24,yy-10,4.3,hexA(I,.55));
    for(let j=0;j<3;j++){const pts=[];for(let i=0;i<66;i++)pts.push([24+i*1.24,yy+j*8+Math.sin(i*.27+j)*2+Math.sin(i*.63)*1.5]);line(pts,hexA(j===1?R:B,.7),.55);}
    for(let i=0;i<12;i++){line([[360,top+12+i*15],[365+(i%3===0?4:0),top+12+i*15]],hexA(I,.55),.45);if(i%3===0)text(String(90-i*10),342,top+14+i*15,4,hexA(I,.55));}
    text('TERMINATOR / INFERRED',215,bottom-19,4.5,hexA(I,.5));
  }
}
function drWallRelay(ctx,th,top,bottom,quiet=false){
  const a=drWallTools(ctx,th),{I,R,B,G,line,ell,text,rect,bracket,grid}=a,h=bottom-top;
  grid(22,top+7,346,h-18,23);
  const nodes=[[.15,.16],[.72,.12],[.45,.34],[.87,.43],[.12,.55],[.65,.68],[.34,.84]],p=nodes.map(([u,v])=>[22+u*346,top+v*h]);
  const links=[[0,2],[1,2],[1,3],[2,3],[2,4],[2,5],[3,5],[4,6],[5,6]];
  links.forEach(([i,j],n)=>{const [x,y]=p[i],[xx,yy]=p[j];line([[x,y],[xx,yy]],hexA(n===4?R:B,.9),n===4?1.1:.8);const dx=yy-y,dy=x-xx,len=Math.hypot(dx,dy);line([[x+dx/len*3,y+dy/len*3],[xx+dx/len*3,yy+dy/len*3]],hexA(I,.2),.4);for(let k=1;k<4;k++){const u=k/4;rect(x+(xx-x)*u-1,y+(yy-y)*u-1,2,2,n===4?R:I);}});
  p.forEach(([x,y],i)=>{const pts=[];for(let k=0;k<=6;k++){const u=k*Math.PI/3;pts.push([x+Math.cos(u)*(i===2?21:12),y+Math.sin(u)*(i===2?21:12)]);}line(pts,i===4?R:I,.95);ell(x,y,i===2?9:4,i===2?9:4,hexA(I,.6));rect(x-1,y-1,2,2,i===4?R:G);if(!quiet){text(i===2?'RELAY 07':'STATION '+String(i+1).padStart(2,'0'),x-24,y+(i===2?33:23),5);text(i===4?'NO REPLY':'ACK / '+(12+i*7)+' MS',x-24,y+(i===2?42:32),4,i===4?R:hexA(I,.45));}});
  bracket(22,top+7,346,h-18);
  if(!quiet){
    for(const [x,y,n]of [[192,top+23,0],[34,top+h*.34,1],[251,top+h*.87,2]]){
      text(['UPLINK / 07','RETRY BUFFER','ROUTE CHECK'][n],x,y,4.4,hexA(I,.5));
      for(let j=0;j<13;j++){rect(x+j*5,y+7,3,3,hexA((j+n)%5===0?R:I,(j+n)%4===0?.8:.24));}
      line([[x,y+17],[x+62,y+17]],hexA(B,.6),.5);
    }
    links.forEach(([i,j],n)=>{if(n%3)return;const x=(p[i][0]+p[j][0])/2,y=(p[i][1]+p[j][1])/2;text('HOP '+(n+1),x+4,y-6,4,hexA(I,.5));});
  }
}
function drWallDebris(ctx,th,top,bottom,quiet=false){
  const a=drWallTools(ctx,th),{I,R,B,G,line,ell,text,ship,bracket}=a,h=bottom-top,cy=top+h*.41;
  // Fragment distribution and a routed recovery path, not another vessel portrait.
  for(let j=0;j<9;j++){const yy=top+20+j*(h-35)/8;line([[22,yy],[368,yy]],hexA(B,.3),.55);}
  for(let i=0;i<12;i++)line([[195+(i-5.5)*6,top],[22+i*31.45,bottom]],hexA(B,.4),.5);
  for(let i=0;i<23;i++){
    const u=i*2.399,rr=33+(i%7)*15,x=190+Math.cos(u)*rr*1.12,y=cy+Math.sin(u)*rr*.84,size=3+(i%5)*2.8;
    const pts=[];for(let j=0;j<=5;j++){const t=j*Math.PI*2/5+i,rad=size*(j%2?.68:1);pts.push([x+Math.cos(t)*rad,y+Math.sin(t)*rad]);}line(pts,i%6===0?R:hexA(I,.45+(i%3)*.15),.7);
    if(i%5===0&&!quiet){line([[x+size,y],[x+size+12,y-10]],hexA(I,.4),.45);text('F-'+String(i+1).padStart(2,'0'),x+size+13,y-10,4.3);}
  }
  const route=[[34,bottom-31],[112,bottom-70],[88,cy+39],[220,cy+67],[299,cy-31],[270,cy-72]];line(route,G,1);
  for(let i=0;i<70;i++){const x=28+(i*73%334),y=top+18+(i*97%Math.max(20,Math.floor(h-45)));a.rect(x,y,.55,.55,hexA(I,.24));}
  ell(190,cy,108,75,hexA(R,.36),.6,0,.4,2.3);ell(190,cy,112,79,hexA(R,.2),.4,0,.4,2.3);
  if(!quiet){text('DISPERSAL ENVELOPE',24,top+21,4.6,hexA(R,.75));text('F-05 / REMAINDER',24,top+31,4,hexA(I,.5));text('PATH / PROJECTED',217,bottom-37,4.5,G);text('DOCKING SOLUTION PENDING',217,bottom-26,4,hexA(I,.5));}
  route.slice(1,-1).forEach(([x,y],i)=>{ell(x,y,3,3,G,.65);if(!quiet)text('WP'+(i+1),x+7,y+9,4.7,G);});ship(270,cy-72,.8,-.9,1);bracket(248,cy-93,44,42);
  if(!quiet){text('RECOVERY CORRIDOR / SR-12',23,bottom-5,5);text('OWNERSHIP UNRESOLVED',252,bottom-5,4.5,R);}
}
// Original lock composition is the template: headline, inclined grid, year, horizon.
// Only the observed scene and its labels vary. Ships and worlds remain line returns.
function drLockContactScene(ctx,th,{top,baseY,q},idx){
  const a=drWallTools(ctx,th),{I,R,B,G,line,ell,text,rect,ship,bracket}=a;
  const map=(u,v)=>[(1-v)*((1-u)*q[0][0]+u*q[1][0])+v*((1-u)*q[3][0]+u*q[2][0]),(1-v)*((1-u)*q[0][1]+u*q[1][1])+v*((1-u)*q[3][1]+u*q[2][1])];
  const path=(uv,col=I,lw=.8)=>line(uv.map(([u,v])=>map(u,v)),col,lw);
  const curve=(fn,col=I,lw=.8)=>{const p=[];for(let i=0;i<=80;i++)p.push(fn(i/80));path(p,col,lw);};
  const ring=(u,v,rx,ry,col=I,lw=.8)=>curve(t=>[u+rx*Math.cos(t*Math.PI*2),v+ry*Math.sin(t*Math.PI*2)],col,lw);
  const mark=(u,v,label,col=I)=>{const [x,y]=map(u,v);line([[x-5,y-6],[x+5,y-6],[x,y+3],[x-5,y-6]],col,1);ell(x,y-3,1,1,col);text(label,x+9,y-1,5.6,col);};
  const glow=(fn)=>{ctx.save();ctx.shadowColor=hexA(I,.7);ctx.shadowBlur=4;fn();ctx.restore();};
  for(let i=1;i<8;i++){const [x,y]=map(i/8,1);line([[x,y],[x+1,y+4]],hexA(I,.55),.5);text(String(i*12).padStart(3,'0'),x-4,y+11,4.3,hexA(I,.5));}
  if(idx===0){
    const start=[32,baseY+27],control=[117,top+54],end=map(.76,.26);
    const flight=t=>[(1-t)**2*start[0]+2*(1-t)*t*control[0]+t*t*end[0],(1-t)**2*start[1]+2*(1-t)*t*control[1]+t*t*end[1]];
    for(let i=0;i<7;i++){const t=.17+i*.11,[x,y]=flight(t),p=flight(t+.01),ang=Math.atan2(p[1]-y,p[0]-x),r=34-i*3.1,pts=[[-r,-r*.55],[r,-r*.55],[r,r*.55],[-r,r*.55],[-r,-r*.55]].map(([u,v])=>[x+Math.cos(ang)*u-Math.sin(ang)*v,y+Math.sin(ang)*u+Math.cos(ang)*v]);line(pts,hexA(R,.82-i*.055),1);}
    glow(()=>{const pts=[];for(let i=0;i<=90;i++)pts.push(flight(i/90));line(pts,I,1.1);});
    const [ex,ey]=end;ship(ex,ey,.9,-.15,2);bracket(ex-23,ey-21,46,42);text('RX-03 / LAST RETURN',ex-25,ey+33,5,R);
    mark(.19,.54,'BUOY 11');mark(.56,.72,'RELAY 04');
    const [x,y]=map(.69,.63);ship(x,y,.65,.15,1);text('SR-12',x-12,y+20,4.7,hexA(I,.7));
    path([[.28,.31],[.42,.2],[.54,.19]],hexA(R,.55),.7);
  }else if(idx===1){
    // A projected planet and satellite: same inclined plot, a different discovery.
    const u=.58,v=.51,rx=.26,ry=.36;
    ring(u,v,rx,ry,I,1.2);
    for(const f of [.25,.55,.82])ring(u,v,rx*f,ry,hexA(I,.4),.65);
    for(const dy of [-.2,-.1,.1,.2])ring(u,v+dy,rx*Math.sqrt(1-dy*dy/(ry*ry)),.046,hexA(B,.9),.65);
    for(const f of [1.18,1.32])curve(t=>[u+Math.cos(t*Math.PI*2)*rx*f,v+Math.sin(t*Math.PI*2)*.13+Math.cos(t*Math.PI*2)*.16],hexA(R,.76),.85);
    path([[.59,.17],[.52,.34],[.62,.43],[.54,.58],[.65,.7],[.61,.84]],R,1.15);
    ring(.17,.3,.058,.083,I,.8);ring(.17,.3,.027,.083,hexA(I,.45),.6);mark(.17,.48,'MOON 02');
    const [x,y]=map(.66,.59);line([[x,y],[x+28,y+30],[x+63,y+30]],hexA(I,.75),.6);text('K-17 / SEAM',x+12,y+41,5.6);
    const [px,py]=map(.13,.73);text('FAULT / UNRESOLVED',px-8,py+16,4.7,R);
    glow(()=>line([[47,baseY-5],map(.28,.85),map(.36,.68)],hexA(I,.6),.8));
  }else if(idx===2){
    const nodes=[[.13,.32],[.43,.16],[.83,.3],[.51,.52],[.18,.8],[.8,.84]],links=[[0,1],[1,2],[0,3],[1,3],[2,3],[3,4],[3,5],[4,5]];
    for(const [i,j]of links){const [u,v]=nodes[i],[uu,vv]=nodes[j];path([[u,v],[uu,vv]],i===3&&j===4?R:hexA(I,.65),.9);for(let k=1;k<5;k++){const [x,y]=map(u+(uu-u)*k/5,v+(vv-v)*k/5);rect(x-1,y-1,2,2,hexA(i===3&&j===4?R:B,.85));}}
    nodes.forEach(([u,v],i)=>{ring(u,v,.036,.05,i===4?R:I,.9);mark(u,v,'R-'+['02','04','08','07','11','19'][i],i===4?R:I);});
    for(const rr of [.085,.12,.155])ring(.51,.52,rr,rr*1.3,hexA(R,.65-rr*2),.75);
    const p=map(.51,.52);glow(()=>line([[44,baseY+8],[109,baseY-92],p],I,1));
    text('RELAY 07 / REPEATING',99,baseY-75,5.8,I);text('ONE CHANNEL HAS NO OPERATOR',99,baseY-63,4.6,R);
  }else{
    // A disrupted world, recovery corridors and a tug, plotted on the same field.
    for(let i=0;i<19;i++){const t=i*2.399,rr=.1+(i%5)*.052,u=.5+Math.cos(t)*rr,v=.46+Math.sin(t)*rr*1.25,sz=.012+(i%4)*.01,pts=[];for(let j=0;j<=5;j++){const ang=j*Math.PI*2/5+i;pts.push([u+Math.cos(ang)*sz,v+Math.sin(ang)*sz*1.2]);}path(pts,i%6===0?R:hexA(I,.8),.75);}
    ring(.5,.46,.36,.43,hexA(R,.35),.7);
    const uv=[[.06,.95],[.28,.75],[.17,.48],[.44,.62],[.68,.33],[.89,.15]];glow(()=>path(uv,I,1.05));
    uv.slice(1,-1).forEach(([u,v],i)=>{ring(u,v,.016,.022,G,.8);const [x,y]=map(u,v);text('WP'+(i+1),x+6,y+8,4.5,G);});
    const [x,y]=map(.89,.15);ship(x,y,.85,-.42,1);bracket(x-19,y-17,38,34);
    const [xx,yy]=map(.04,.66);text('F-05 / REMAINDER',xx,yy+22,5,R);
    const p=map(.06,.95);line([p,[54,baseY+12]],hexA(I,.6),.85);text('RECOVERY RIGHTS / OPEN',92,baseY-67,5.5);text('NO REGISTERED OWNER',92,baseY-56,4.6,R);
  }
}
// Slots 5-15: each new headline names a catalogue contact, drawn with the Contact Catalogue's own silhouette (in headline order)
const DR_LOCK_MORE=['DR-09','SR-12','RX-03','SV-06','K-17','D-02','V-11','SATURN','NEPTUNE','N-04','N-22'];
function drCatalogueLock(ctx,th,H,k){
  const kit=scriptableKit(th),list=(kit&&kit.DR_CONTACTS)||[],c=list.find(x=>x.name.startsWith(DR_LOCK_MORE[k%DR_LOCK_MORE.length]))||list[0]||{name:'UNKNOWN',type:'FICTIONAL',note:'NO RETURN'};
  const ph=allPhrases(th)[4+k]||['',''],id=c.name.split(' / ')[0];
  const text={...th.text,topL:'CATALOGUE // '+id,coords:c.type,fine:c.note,foot:'DEEP RANGE // RELAY 07'};
  const variant={...th,text,phrases:[ph],seed:(th.seed||0)+4+k};
  const W=ctx.canvas?.width||390,pxH=ctx.canvas?.height||H;
  drawOrbital(ctx,variant,H,'lock',0,W,pxH,W/390,(cx,t,g)=>drLockCatalogueScene(cx,t,g,c,kit));
}
function drLockCatalogueScene(ctx,th,{top,baseY,q},c,kit){
  const a=drWallTools(ctx,th),{I,R,line,text,bracket}=a;
  const map=(u,v)=>[(1-v)*((1-u)*q[0][0]+u*q[1][0])+v*((1-u)*q[3][0]+u*q[2][0]),(1-v)*((1-u)*q[0][1]+u*q[1][1])+v*((1-u)*q[3][1]+u*q[2][1])];
  for(let i=1;i<8;i++){const [x,y]=map(i/8,1);line([[x,y],[x+1,y+4]],hexA(I,.55),.5);text(String(i*12).padStart(3,'0'),x-4,y+11,4.3,hexA(I,.5));}
  const [x,y]=map(.52,.48),w=150,h=112;
  if(kit&&kit.drContactSilhouette){const img=kit.artImage(w,h,(k)=>kit.drContactSilhouette(k,c,0,0,w,h),{});ctx.drawImage(img,x-w/2,y-h/2,w,h);}
  bracket(x-w/2-6,y-h/2-6,w+12,h+12);text(c.name,x-w/2-4,y+h/2+16,5.4,c.type&&c.type.startsWith('KNOWN')?I:R);
}
function drOriginalLayoutLock(ctx,th,H,idx){
  if(idx>=4){drCatalogueLock(ctx,th,H,idx-4);return;}
  const n=((idx%4)+4)%4;
  const heads=['CONTACT LOST','WORLD UNRESOLVED','CARRIER RETURN','SALVAGE WINDOW'];
  const text={...th.text,topL:['TRACKING 12 CONTACTS','SURVEYING 08 WORLDS','LISTENING ON 06 RELAYS','TRACKING 19 FRAGMENTS'][n],coords:['RANGE 0.4 AU // RELAY 07','SECTOR K-17 // SURFACE SCAN','CHANNEL 93.4 // RETURN PATH','SECTOR F-05 // RECOVERY 12'][n],fine:['RX-03 / SIGNAL DEGRADING','K-17 / ORIGIN UNCONFIRMED','RELAY 07 / KEEP LISTENING','SR-12 / NOTHING ABANDONED'][n],foot:'DEEP RANGE // RELAY 07'};
  const variant={...th,text,phrases:[(th.phrases&&th.phrases[n])||[heads[n],'']],seed:(th.seed||0)+n};
  const W=ctx.canvas?.width||390,pxH=ctx.canvas?.height||H;
  drawOrbital(ctx,variant,H,'lock',0,W,pxH,W/390,(c,t,g)=>drLockContactScene(c,t,g,n));
}
function drWallpaper(ctx,th,H,mode,idx=0){
  if(mode==='lock'){drOriginalLayoutLock(ctx,th,H,idx);return;}
  drDenseHome(ctx,th,H,idx);
}

// Six station desks, composed separately. All readings are fictional wallpaper records.
// Home-only helpers deliberately leave the approved lock and widget renderers untouched.
const DR_HOME_DESKS=[
  ['PROXIMITY ACQUISITION','DR-09 / DEAD LETTER','RANGE CONTROL','THE TRANSPONDER STILL ANSWERS'],
  ['SURFACE DISCONTINUITY','K-17 / SEAM','DEEP FIELD SURVEY','THE FAULT LINE HAS CHANGED AGAIN'],
  ['RELAY ARBITRATION','RELAY 07 / ROUTE DESK','RELAY OPERATIONS','ONE CHANNEL HAS NO OPERATOR'],
  ['RECOVERY RIGHTS','F-05 / REMAINDER','SEARCH & SALVAGE','NOTHING OUT HERE IS ABANDONED'],
  ['MULTIPLE RETURN','N-22 / CHOIR','SIGNAL ANALYSIS','ONE PING / SEVERAL ANSWERS'],
  ['OUTBOUND TRANSIT','SV-06 / QUIET SAIL','FLIGHT DYNAMICS','COASTING BEYOND ASSIGNED RANGE']
];
function drHomeTools(ctx,th){
  const a=drWallTools(ctx,th),{I,R,B,G,line,ell,rect}=a,detail=K(th).details;
  const text=(s,x,y,size=6,col=I,w=350,bold=false)=>{
    let value=String(s);if(!th.upper)value=value.toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase());
    const font=bold?th.fonts.display:th.fonts.mono,weight=bold?800:400;
    ctx.font=`${weight} ${size}px "${font}"`;const measured=ctx.measureText(value).width;
    if(measured>w){size*=w/measured;ctx.font=`${weight} ${size}px "${font}"`;}
    ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillStyle=col;ctx.fillText(value,x,y);
  };
  const fine=(...v)=>{if(detail)text(...v);};
  const panel=(x,y,w,h,label)=>{a.grid(x,y,w,h,16);a.bracket(x,y,w,h);if(label)text(label,x+5,y+10,5.1,hexA(I,.64),w-10);};
  const rule=(x,y,w,col=I)=>line([[x,y],[x+w,y]],hexA(col,.35),.55);
  const rail=(x,y,h,col=I)=>{line([[x,y],[x,y+h]],hexA(col,.45),.5);for(let n=0;n<=20;n++)line([[x,y+h*n/20],[x+(n%5?3:7),y+h*n/20]],hexA(col,.65),.5);};
  const tag=(s,x,y,w,col=R)=>{rect(x,y-8,w,11,hexA(col,.17));text(s,x+4,y,5.2,col,w-8);};
  const bars=(x,y,w,h,n,seed=1)=>{for(let j=0;j<n;j++){const v=.13+.8*Math.abs(Math.sin(j*1.78+seed)*Math.cos(j*.37));rect(x+j*w/n,y+h*(1-v),w/n-2,h*v,j%7===0?R:j%3===0?I:B);}};
  const distance=km=>th.units==='celsius'?`${km.toFixed(1)} KM`:`${(km*.621371).toFixed(1)} MI`;
  const art=(box,fn,bounds=null)=>{
    const [x,y,w,h]=box,k=K(th),cx=x+w/2,cy=y+h/2;
    let s=Math.max(.8,Math.min(1.2,k.scale)),dy=Math.max(-h*.12,Math.min(h*.12,k.shift*.45));
    if(bounds){
      const [left,top,bw,bh]=bounds,right=left+bw,bottom=top+bh;
      // Keep the entire subject inside its instrument window at both control extremes.
      s=Math.min(s,(cx-x-4)/Math.max(1,cx-left),(x+w-4-cx)/Math.max(1,right-cx),(cy-y-4)/Math.max(1,cy-top),(y+h-4-cy)/Math.max(1,bottom-cy));
      dy=Math.max(y+4-(cy+(top-cy)*s),Math.min(y+h-4-(cy+(bottom-cy)*s),dy));
    }
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    ctx.translate(x+w/2,y+h/2+dy);ctx.scale(s,s);ctx.translate(-x-w/2,-y-h/2);
    ctx.shadowColor=hexA(I,.35);ctx.shadowBlur=2.2*k.glow;fn();ctx.restore();
  };
  let kit;
  const contact=(id,x,y,w,h)=>{
    kit=kit||scriptableKit(th);if(!kit)return;
    const c=kit.DR_CONTACTS.find(c=>c.name.startsWith(id));if(!c)return;
    // Render the catalogue's vector paths directly into this canvas, at export resolution.
    const k={a:hexA,ln:line,rect,ell:(xx,yy,ww,hh,col,lw=.7)=>ell(xx+ww/2,yy+hh/2,ww/2,hh/2,col,lw)};
    kit.drContactSilhouette(k,c,x,y,w,h);
  };
  return {...a,text,fine,panel,rule,rail,tag,bars,distance,art,contact,detail};
}
function drHomeAcquisition(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rail,rule,tag,art,contact,distance}=a;
  panel(22,78,272,246,'RANGE GATE / DR-09');rail(305,92,208);
  for(let i=0;i<6;i++){const x=46+i*17,y=292-i*27;line([[x-13,y+12],[x+48,y+12],[x+48,y-12],[x-13,y-12],[x-13,y+12]],hexA(R,.25+i*.11),.8);}
  line([[39,306],[112,247],[146,184],[211,140]],I,1.1);
  art([48,104,229,162],()=>contact('DR-09',69,125,190,111),[84,137,177,87]);
  a.bracket(137,131,83,73);line([[220,152],[265,126],[282,126]],R,.7);
  fine('HULL / OPEN FRAME',160,116,5.4,I,116);fine('ACK',265,122,5,R,23);
  fine('FIRST SEEN / 07.441',34,104,5,I,120);fine('CUSTODIAN / NONE',34,114,4.7,R,120);
  if(a.detail){
    text('TRANSPONDER LOG',184,251,5.4,R,100);
    ['Q-071 / SENT','Q-072 / RETURN','Q-073 / NO NAME'].forEach((s,i)=>text(s,184,264+i*12,5,I,102));
    for(let i=0;i<17;i++)rect(184+i*5.7,302,3,2+(i*13%7),hexA(i%4?B:I,.75));
  }
  for(let i=0;i<5;i++){text(String(500-i*100).padStart(3,'0'),320,98+i*43,6,I,36);rect(305,97+i*43,4,3,i===3?G:R);}
  text('CLOSURE',305,313,5.5,R,59);tag('NO CREW RECORD',36,312,117);
  fine('AZ 077.4',30,346,6,I,90);fine('EL -02.1',144,346,6,I,90);fine('SIM / '+distance(47.2),256,346,6,I,110);
  rule(22,354,346);
  text('UNCLAIMED RETURN',22,379,21,I,344,true);
  text('REPLY AGE',24,405,5.8,R,85);text('047',24,438,31,I,95,true);fine('ARCHIVE CYCLES',24,452,5,I,95);
  panel(135,396,233,69,'ANGULAR RESIDUAL / RECONSTRUCTION');
  for(let i=0;i<48;i++){const x=145+i*4.5,y=435+Math.sin(i*.3)*9+Math.cos(i*1.1)*4;rect(x,y,1.5,1.5,i%9===0?R:I);if(i%8===0)line([[x,451],[x,y]],hexA(B,.8),.7);}
  fine('01 ACQUIRE   02 QUERY   03 RETAIN',24,483,6,I,339);
  fine('STATUS / NO REGISTERED OWNER',24,497,5.5,R,339);
}
function drHomeSurface(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rail,rule,tag,art,distance}=a;
  panel(22,78,346,263,'FAULT ATLAS / SECTION 04');
  text('SEAM',34,125,26,I,110,true);tag('FICTIONAL WORLD',34,142,110,B);
  for(let j=0;j<5;j++){
    fine('S-'+String(j+1).padStart(2,'0'),33,177+j*29,5.5,R,33);
    for(let n=0;n<13;n++)rect(65+n*4.2,171+j*29,2.6,3+Math.sin(n+j)*2,hexA(j%2?I:B,.6));
    fine(['DISPLACED','NO BASELINE','REPEAT CUT','SHEAR LINE','RESCAN'][j],34,188+j*29,4.7,I,93);
  }
  art([143,98,212,227],()=>{
    const x=249,y=214,r=75;ell(x,y,r,r,I,1.1);
    ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
    rect(x-r,y-r,r*2,r*2,hexA(B,.22));
    for(let i=1;i<7;i++)ell(x,y,r*i/7,r,hexA(B,.9),.65);
    for(let j=-4;j<=4;j++){const dy=j*15;ell(x,y+dy,Math.sqrt(r*r-dy*dy),5,hexA(I,.5),.6);}
    const fault=[[-10,-77],[-25,-52],[-11,-27],[-22,-8],[5,15],[-10,34],[10,57],[3,78]];
    line(fault.map(([u,v])=>[x+u,y+v]),R,2);line(fault.map(([u,v])=>[x+u+6,y+v-2]),hexA(G,.7),.6);
    ctx.restore();
    for(let i=0;i<36;i++){const t=i*Math.PI/18;line([[x+Math.cos(t)*83,y+Math.sin(t)*83],[x+Math.cos(t)*(i%3?86:90),y+Math.sin(t)*(i%3?86:90)]],hexA(I,.6),.6);}
    line([[x-13,y+5],[153,309],[325,309]],R,.7);
  },[151,122,192,190]);
  fine('MERIDIAN / DISPUTED',199,328,5.2,R,154);rule(22,357,346);
  text('SURFACE HAS MOVED',22,380,20,I,346,true);
  for(let j=0;j<3;j++){
    const y=399+j*28;fine(['PASS 01','PASS 02','DELTA'][j],25,y+10,5.5,j===2?R:I,57);
    const pts=[];for(let i=0;i<=66;i++){const x=89+i*4,yy=y+8+Math.sin(i*.18+j*.3)*5+(i>28&&i<40?(j-1)*4:0)+Math.sin(i*.79)*2;pts.push([x,yy]);}
    line(pts,j===2?R:I,.75);line([[89,y+19],[355,y+19]],hexA(B,.5),.5);
  }
  tag('REFERENCE / '+distance(12.8),24,497,166,B);fine('NO STABLE ORIGIN',218,497,6,R,148);
}
function drHomeRouting(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rule,tag,art}=a;
  panel(22,78,346,228,'RETURN PATH / ROUTING AUTHORITY 07');
  const nodes=[[57,129],[178,111],[325,133],[151,200],[278,223],[65,259],[213,272]],edges=[[0,1],[0,3],[1,2],[1,3],[2,4],[3,4],[3,5],[3,6],[4,6],[5,6]];
  art([30,96,331,201],()=>{
    edges.forEach(([p,q],i)=>{const A=nodes[p],C=nodes[q];line([A,C],i===6?R:hexA(B,.9),i===6?1.4:1);for(let j=1;j<4;j++)rect(A[0]+(C[0]-A[0])*j/4-1,A[1]+(C[1]-A[1])*j/4-1,2,2,i===6?R:I);});
    nodes.forEach(([x,y],i)=>{ell(x,y,i===3?14:7,i===3?14:7,i===5?R:I,1);rect(x-2,y-2,4,4,i===5?R:G);});
  },[49,103,283,183]);
  nodes.forEach(([x,y],i)=>{fine(i===3?'RELAY 07':'R-'+['02','04','08','07','19','11','06'][i],x-18,y+24,5.5,i===5?R:I,71);});
  fine('HOP 01 / ACK',75,107,4.7,I,87);fine('HOP 02 / ACK',211,103,4.7,I,91);
  fine('PRIORITY / A17',207,165,5,R,133);fine('TIMEOUT / RETAIN',207,176,5,I,133);
  fine('RETRY 03',60,216,4.7,R,59);fine('UNROUTED / 02',276,292,4.7,I,87);
  text('ROUTE WITHOUT REPLY',22,333,20,I,346,true);
  panel(22,350,157,148,'ADJACENCY / 7 X 7');
  for(let r=0;r<7;r++)for(let c=0;c<7;c++){
    const linked=edges.some(([p,q])=>(p===r&&q===c)||(p===c&&q===r));rect(46+c*16,379+r*15,11,10,r===c?hexA(I,.75):linked?(r===5||c===5?R:B):hexA(I,.07));
  }
  for(let j=0;j<7;j++)fine(String(j+1),33,387+j*15,5,I,10);
  text('PACKET CUSTODY',197,362,7,R,170);
  const rows=[['A17','07 > 04','HELD'],['A18','07 > 11','RETRY'],['A19','04 > 08','ACK'],['A20','08 > 19','ACK'],['A21','11 > 06','LOST'],['A22','06 > 07','QUEUE']];
  rows.forEach(([id,route,status],i)=>{const y=383+i*20;rule(197,y+6,169);fine(id,197,y,5.6,I,26);fine(route,228,y,5.6,I,70);text(status,307,y,5.6,status==='LOST'||status==='RETRY'?R:G,60);});
  tag('NO OPERATOR / R-11',197,510,171);
}
function drHomeRecovery(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rule,tag,bars,art,contact,distance}=a;
  panel(22,78,346,267,'F-05 / DISRUPTED BODY');
  art([35,102,317,223],()=>{
    for(let j=0;j<10;j++)line([[55+j*28,113],[40+j*32,317]],hexA(B,.4),.6);
    for(let i=0;i<23;i++){
      const t=i*2.399,r=21+i%7*11,x=180+Math.cos(t)*r*1.1,y=211+Math.sin(t)*r*.78,size=3+i%4*2,pts=[];
      for(let j=0;j<=5;j++){const u=j*Math.PI*2/5+i;pts.push([x+Math.cos(u)*size,y+Math.sin(u)*size]);}line(pts,i%5?I:R,.8);
      if(a.detail&&i%3===0)line([[x-size*.5,y],[x+size*.4,y-size*.2],[x,y+size*.6]],hexA(B,.8),.6);
      if(i%4===0)fine('F'+String(i+1).padStart(2,'0'),x+size+3,y-4,4.4,I,30);
    }
    const route=[[59,301],[111,260],[139,186],[233,235],[284,155]];line(route,G,1.2);
    route.forEach(([x,y])=>ell(x,y,3,3,G,.8));contact('SR-12',264,120,61,39);
    ell(183,211,110,80,hexA(R,.6),.7,0,.3,2.6);
  },[51,116,278,192]);
  tag('CLAIM DISPUTED',34,332,113);fine('SR-12 / WAYFARER',242,332,5.7,G,116);
  fine('REGISTER / 23 PIECES',35,102,5,I,137);fine('ENVELOPE / OPEN',241,102,5,R,116);
  text('RECOVER WHAT REMAINS',22,374,19,I,346,true);
  text('FRAGMENT',24,394,5.5,R,85);text('CLASS',120,394,5.5,R,92);text('CUSTODY',238,394,5.5,R,120);
  const rows=[['F-03','SHELL PLATE','UNASSIGNED'],['F-08','SEALED CORE','CONTESTED'],['F-17','FRAME SECTION','SR-12 / HOLD']];
  rows.forEach((r,i)=>{const y=412+i*21;rule(24,y+7,343);r.forEach((s,j)=>text(s,[24,120,238][j],y,6,j===2?G:I,[82,107,128][j]));});
  bars(25,471,170,31,30,3);fine('MASS DISTRIBUTION / SIM',25,513,5,I,176);
  text('CORRIDOR',221,480,5.5,R,140);text(distance(3.4),221,499,19,I,145,true);fine('OWNER RESPONSE PENDING',221,513,5,R,145);
}
function drHomeEcho(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rule,tag,art}=a;
  panel(22,78,346,192,'N-22 / CHOIR / SPECTRAL MEMORY');
  art([28,95,332,163],()=>{
    for(let y=0;y<30;y++)for(let x=0;x<63;x++){
      const ridge=Math.abs(x-(29+Math.sin(y*.21)*9)),side=Math.abs(x-(48-Math.cos(y*.16)*7));
      const hot=ridge<2.4||side<1.2,noise=.1+.13*((x*37+y*13)%11)/10;
      rect(33+x*5.1,105+y*4.7,4.1,3.7,hexA(hot?I:B,hot?.6+(x%3)*.15:noise*2.6));
    }
  });
  fine('LOW',27,284,5,I,55);fine('FREQUENCY / RECONSTRUCTED',107,284,5.5,I,200);fine('HIGH',341,284,5,I,27);
  text('SOURCE COUNT: UNRESOLVED',22,312,18,I,346,true);
  panel(22,329,157,132,'PHASE / RETURN CLUSTER');
  for(let j=0;j<4;j++){const pts=[];for(let i=0;i<=160;i++){const t=i*Math.PI/80;pts.push([100+Math.sin(t*3+j*.11)*58,399+Math.sin(t*2+j*.29)*38]);}line(pts,j===0?I:hexA(j%2?R:B,.7),.7);}
  text('ARRIVAL SEPARATION',197,340,6,R,172);
  for(let j=0;j<6;j++){const y=358+j*18;fine('R'+(j+1),197,y+4,5,I,22);line([[223,y],[365,y]],hexA(B,.65),.5);const x=230+j*17;line([[x-5,y],[x,y-8],[x+2,y+6],[x+5,y],[x+12,y]],j===4?R:I,.8);fine('+'+(j*13+4),337,y-3,4.6,I,30);}
  rule(22,477,346);tag('PROVENANCE UNCONFIRMED',23,498,193);
  fine('DO NOT REPLY',260,498,6,G,108);fine('ARCHIVE / ONE TRANSMISSION / MULTIPLE ARRIVALS',24,513,5.5,I,343);
}
function drHomeTransit(ctx,th,a){
  const {I,R,B,G,line,ell,rect,text,fine,panel,rule,tag,art,contact,distance}=a;
  panel(22,78,346,291,'SV-06 / PASSIVE SAIL / VECTOR RECONSTRUCTION');
  for(let j=0;j<7;j++){
    const x=69+j*40,y=319-j*26;line([[x-15,y-37],[x+12,y-37],[x+12,y+37],[x-15,y+37]],hexA(R,.22+j*.09),.7);
    fine('G'+String(j+1).padStart(2,'0'),x-11,y+48,4.7,I,28);
  }
  art([47,113,290,193],()=>contact('SV-06',49,112,287,181),[75,142,239,133]);
  line([[42,339],[120,303],[219,268],[341,206]],G,.8);
  tag('NO RETURN WINDOW',36,105,134);fine('SAIL EDGE',245,133,5.4,R,110);
  fine('PROPULSION / NONE',230,314,5,R,123);fine('NAV AUTH / EXPIRED',230,326,5,I,123);
  fine('OPERATOR LOG',37,128,5,I,105);fine('06 / DEPARTED',37,140,4.8,R,105);fine('07 / STILL COASTING',37,151,4.8,I,112);
  fine('ATTITUDE / INFERRED',37,357,5.3,I,159);fine('SIM / '+distance(182.6),237,357,5.3,I,116);
  text('STILL OUTBOUND',22,401,23,I,346,true);
  panel(22,419,122,91,'APERTURE / 07');
  ell(83,467,29,29,I,.9);ell(83,467,16,29,hexA(B,.8),.7);
  for(let j=-3;j<=3;j++)line([[57,467+j*7],[109,467+j*7]],hexA(I,.26),.5);
  line([[55,489],[108,444]],R,1.5);fine('OCCULTATION MASK',28,506,4.6,I,110);
  text('GATE CLEARANCE',164,431,6,R,204);
  for(let j=0;j<18;j++){const x=167+j*10.7,h=15+Math.sin(j*.26)*18;line([[x,478],[x,478-h]],j>13?G:B,3);fine(j%3===0?String(j):'',x-2,490,4,I,19);}
  fine('RANGE LIMIT',165,507,5.5,I,101);text('EXCEEDED',280,507,7,R,87);
}
function drDenseHome(ctx,th,H,idx){
  const n=((Math.trunc(idx||0)%6)+6)%6,k=K(th),a=drHomeTools(ctx,th),{I,R,B,rect,line,text,fine}=a;
  rect(0,0,390,H,th.colors.ground);
  // Only the icon and dock bands are intentionally quiet. No captions cross them.
  const top=Math.max(170,H*.215),bottom=Math.min(H-108,H*.865),sy=Math.max(.4,(bottom-top)/540);
  ctx.save();ctx.translate(0,top);ctx.scale(1,sy);
  const [title,subject,desk,footer]=DR_HOME_DESKS[n],header=n===2||n===4?B:R;
  const headerInk=n===2||n===4?I:th.colors.ground;
  rect(18,0,354,15,header);text('H-0'+(n+1)+' // '+desk,25,10.5,6,headerInk,308);
  for(let j=0;j<4;j++)rect(351+j*4,3,1.7,9-j%2*3,headerInk);
  text(title,22,44,22,I,346,true);text(subject,23,61,7,R,245);fine('RELAY 07',302,61,6,I,66);
  [drHomeAcquisition,drHomeSurface,drHomeRouting,drHomeRecovery,drHomeEcho,drHomeTransit][n](ctx,th,a);
  line([[22,520],[368,520]],hexA(I,.42),.6);fine(footer,23,532,5.1,I,276);text('SIM / 0'+(n+1),317,532,5.2,R,52);
  // Unequal edge registration marks and local calibration rails, not a repeating waveform.
  if(k.details){for(const y of [27,78,96,345,472])rect(9,y,4,y===78?18:7,R);for(const y of [120,300,503])rect(378,y,3,14,R);}
  if(k.texture>0)for(let y=17;y<517;y+=3)rect(19,y,352,.35,hexA(I,.035*k.texture));
  ctx.restore();
}
