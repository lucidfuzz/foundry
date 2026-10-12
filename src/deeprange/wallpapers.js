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
function drOriginalLayoutLock(ctx,th,H,idx){
  const n=((idx%4)+4)%4;
  const heads=['CONTACT LOST','WORLD UNRESOLVED','CARRIER RETURN','SALVAGE WINDOW'];
  const text={...th.text,topL:['TRACKING 12 CONTACTS','SURVEYING 08 WORLDS','LISTENING ON 06 RELAYS','TRACKING 19 FRAGMENTS'][n],coords:['RANGE 0.4 AU // RELAY 07','SECTOR K-17 // SURFACE SCAN','CHANNEL 93.4 // RETURN PATH','SECTOR F-05 // RECOVERY 12'][n],fine:['RX-03 / SIGNAL DEGRADING','K-17 / ORIGIN UNCONFIRMED','RELAY 07 / KEEP LISTENING','SR-12 / NOTHING ABANDONED'][n],foot:'DEEP RANGE // RELAY 07'};
  const variant={...th,text,phrases:[(th.phrases&&th.phrases[n])||[heads[n],'']],seed:(th.seed||0)+n};
  const W=ctx.canvas?.width||390,pxH=ctx.canvas?.height||H;
  drawOrbital(ctx,variant,H,'lock',0,W,pxH,W/390,(c,t,g)=>drLockContactScene(c,t,g,n));
}
function drWallpaper(ctx,th,H,mode,idx=0){
  if(mode==='lock'){drOriginalLayoutLock(ctx,th,H,idx);return;}
  const a=drWallTools(ctx,th),{I,B,line,text,rect}=a;
  rect(0,0,390,H,th.colors.ground);
  const scenes=[drWallSweep,drWallSurvey,drWallRelay,drWallDebris],titles=['CONTACT SWEEP','PLANETARY SURVEY','RELAY CHAIN','SALVAGE CORRIDOR'];
  const n=((idx%4)+4)%4,top=H*.58,bottom=H*.88;
  ctx.save();ctx.globalAlpha=.62;scenes[n](ctx,th,top,bottom,true);ctx.restore();
  if(idx>=4){line([[22,top-26],[368,top-26]],hexA(B,.6),.7);for(let i=0;i<38;i++)rect(22+i*9,top-21,4,2+(i*17%13),hexA(I,.22));}
  text('DEEP RANGE / '+titles[n],22,bottom+22,5.5,hexA(I,.65));
  for(let y=0;y<H;y+=3)rect(0,y,390,.35,hexA(I,.02));
}
