// Civil Defense is an opt-in edition. Shared by the browser and exported widget.
const DZ_META={status:'OPERATOR STATUS',shift:'ACTIVE TIME',solar:'DAYLIGHT WATCH',audio:'BROADCAST',transmission:'PRIORITY SIGNAL',feeds:'RECON FEEDS',youtube:'MONITOR WALL',instagram:'OPERATOR CALLING CARDS',discord:'COMMAND NET',oddity:'OPERATOR EVALUATION',game:'SHELTER 9'};
const DZ_PEOPLE=[['V. SLOAN','REGISTRY','SEALED','OBSERVED'],['R. MOSS','TRIAGE','SEALED','CLEARED'],['L. VALE','INTEGRITY','SEALED','ASSIGNED'],['E. REED','RESERVE','SEALED','REVIEW'],['N. WARD','COMMAND','SEALED','CLEARED'],['I. ASH','NULL INDEX','SEALED','MISSING'],['O. FINCH','CARRIER','SEALED','OBSERVED'],['S. MARSH','CONTAINMENT','SEALED','FLAGGED'],['T. WREN','DOCTRINE','SEALED','ASSIGNED'],['P. LOCKE','PROVISION','SEALED','CLEARED'],['B. PIKE','MAINTENANCE','SEALED','OVERDUE'],['A. FENN','RECORDS','SEALED','REVIEW']];
const DZ_ROOMS=['GATE 09','AIR EXCHANGE','RATION HALL','CISTERN 04','STAIRWELL C','MUSTER ROOM','GENERATOR 02','RECORD VAULT','DECONTAMINATION','SERVICE LIFT','MESS HALL','LOWER ACCESS'];
const DZ_EVAL={tears:['WITHIN TOLERANCE','ELEVATED','NOT OBSERVED','SUSPICIOUSLY ABSENT','AWAITING SAMPLE','FORM NOT SIGNED','RECLASSIFIED AS RAIN','RETENTION ADVISED','APPROVED QUANTITY','SEALED FOR REVIEW'],verdict:['FIT FOR SORTIE','REQUIRES TALKING-TO','RECALIBRATE','EXEMPLARY / REVIEW','STAND BY','REVIEW PENDING','RETURN AFTER REST','REPEAT THE QUESTION','PROVISIONALLY CALM','ASSIGNED TO QUEUE'],notes:['Asked if sirens were necessary.','Hesitated at mandatory.','Requested a window. Denied.','Hummed during briefing. Noted.','Scored well. Too well.','Slept in the simulator. Twice.','Named the simulator.','Asked what drills are for.','Filed a complaint in pencil.','Thanked the empty chair.'],shelter:['S9 / L1 / B04','S9 / L2 / B12','S9 / L3 / B07','S9 / L4 / B02','S9 / L5 / B19','S9 / L1 / B08','S9 / L2 / B01','S9 / L3 / B16','S9 / L4 / B11','S9 / L5 / B03']};
// Revision 5: preserve the institutional identity and noise, diversify the central instrument families.
// The background is another working layer of the terminal, not empty decoration.
// Fictional registers stay visually subordinate to real calendar/weather/device readings.
function dzStatic(k,x,y,w,h,seed,strength=1){
  const rng=k.rng(7907+seed*101);
  for(let yy=y;yy<y+h;yy+=2){k.rect(x,yy,w,.45,k.ia(.055*strength));if(rng()>.61){const xx=x+rng()*w*.75;k.rect(xx,yy,Math.min(w-(xx-x),8+rng()*w*.22),.65,k.a(T.altBg,(.08+rng()*.1)*strength));}}
  for(let i=0;i<w*h/160;i++){const xx=x+rng()*(w-2),yy=y+rng()*(h-1);k.rect(xx,yy,rng()>.87?3:1,.65,k.a(i%7===0?T.accent:T.ink,(.08+rng()*.11)*strength));}
}
function dzRegister(k,x,y,w,h,seed,alpha=.4){
  if(h<5||w<15)return;const words=['0F','A2','09','C1','7E','D0','41','B8'],cols=Math.max(1,Math.floor(w/24)),cw=w/cols;
  for(let j=0;j<Math.floor(h/8);j++)for(let i=0;i<cols;i++){const n=(i*7+j*11+seed)%31,xx=x+i*cw;k.t(words[(i+j+seed)%8]+'.'+String(n).padStart(2,'0'),xx,y+j*8,5.5,k.a(n===0?T.headBg:n%5?T.altBg:T.accent,alpha),{w:cw-2});}
}
function dzSweep(k,x,y,w,h,seed,col=k.A){
  for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=120;i++){let q=i/120,v=Math.sin(q*61+seed+j*.9)*Math.sin(q*17+j)*.13+Math.sin(q*12+seed)*.12;pts.push([x+q*w,y+h*(.5+v+j*.055)]);}k.ln(pts,j===0?col:k.a(T.altBg,.4-j*.08),j===0?.65:.4);}
  for(let i=0;i<9;i++)k.ln([[x+i*w/8,y+h-2],[x+i*w/8,y+h]],k.a(T.altBg,.65),.5);
}
function dzTerminalBed(k,x,y,w,h,seed,kind=0,intensity=1){
  dzStatic(k,x,y,w,h,seed,intensity);
  const rr=k.rng(881+seed*17),cols=3+kind%3,cw=w/cols,rh=22+(kind%4)*4;
  const terms=[['SECTOR','GATE','PERMIT','REVIEW'],['ASSIGN','DUTY','RELEASE','RECALL'],['FILTER','SURFACE','PHASE','CYCLE'],['CARRIER','RECEIVE','BAND','RELAY'],['COPY','ISSUE','RETAIN','ROUTE'],['UPLINK','RECON','DEFER','BUFFER'],['CAMERA','FRAME','SECTOR','LOCK'],['REGISTRY','SEALED','ACCESS','INDEX'],['QUORUM','DECISION','HOLD','OVERRIDE'],['EVAL','RETENTION','FORM','REPEAT'],['GRID','LEVEL','BUNK','RESERVE']][kind%11];
  // Uneven register blocks leave a recognizable analog display texture at phone size.
  for(let j=0;j<Math.floor(h/rh);j++)for(let i=0;i<cols;i++){
    const xx=x+i*cw,yy=y+j*rh,a=(.1+rr()*.13)*intensity;
    if((i*3+j+kind)%4!==0){k.t(terms[(i+j)%4]+' / '+String((seed+i*17+j*7)%997).padStart(3,'0'),xx+3,yy+2,5.5,k.a(T.altBg,a*1.5),{w:cw-7});dzRegister(k,xx+3,yy+10,cw-7,8,seed+i+j,a);}
    k.ln([[xx+2,yy+rh-3],[xx+cw-4,yy+rh-3]],k.a((i+j)%5?T.altBg:T.accent,.12*intensity),.5);
    k.rect(xx,yy+3,1,8+rr()*12,k.a(T.headBg,.18*intensity));
  }
  // Each department has a different ghosted topology beneath its foreground instrument.
  if(kind%4===0){for(let j=0;j<9;j++){const yy=y+h*(.07+j*.105),bend=x+w*(.24+(j%4)*.14);k.ln([[x,yy],[bend,yy],[bend+12,Math.min(y+h-1,yy+12)],[x+w,Math.min(y+h-1,yy+12)]],k.a(j%3?T.altBg:T.accent,.13*intensity),.5);}}
  if(kind%4===1){const cx=x+w*.72,cy=y+h*.45,r=Math.min(w*.26,h*.42);for(let j=0;j<9;j++)k.arc(cx,cy,r*(.24+j*.09),-.9,4.2,k.a(j%3?T.accent:T.altBg,.16*intensity),.55);for(let i=0;i<4;i++)k.ln([[x,y+h*(i+.5)/4],[x+w,y+h*(i+.5)/4]],k.a(T.altBg,.16*intensity),.5);}
  if(kind%4===2){for(let j=0;j<5;j++){const yy=y+h*(.11+j*.17);for(let i=0;i<5;i++){let xx=x+w*i/5;k.rect(xx+3,yy,w/5-6,h*.12,null,k.a(T.altBg,.13*intensity),.5);k.ln([[xx+4,yy+h*.08],[xx+w/5-7,yy+h*.03]],k.a(T.accent,.14*intensity),.5);}}}
  if(kind%4===3){for(let j=0;j<12;j++){const yy=y+(j+.5)*h/12;for(let i=0;i<22;i++){let v=(j*13+i*7+seed)%19;if(v<11)k.rect(x+i*w/22,yy,w/22-2,2,k.a(v<3?T.headBg:T.altBg,.14*intensity));}}}
}
function dzSubpanel(k,x,y,w,h,title,seed,kind=0){
  if(h<15)return;k.rect(x,y,w,h,k.a(T.altBg,.025),k.a(T.altBg,.45),.5);
  k.rect(x,y,2,h,k.a(T.headBg,.72));k.t(title,x+5,y+2,6,k.L,{w:w-10});
  const yy=y+12,hh=h-15;
  if(kind===0)dzRegister(k,x+5,yy,w-10,hh,seed,.6);
  else if(kind===1)dzSweep(k,x+5,yy,w-10,hh,seed,k.a(T.accent,.7));
  else if(kind===2){const rng=k.rng(seed+47),cw=(w-10)/16;for(let i=0;i<16;i++){const v=.12+rng()*.85;k.rect(x+5+i*cw,yy+(1-v)*hh,cw-1,v*hh,i%7===0?k.H:k.a(T.altBg,.6));}}
  else{for(let j=0;j<Math.max(1,Math.floor(hh/7));j++){const ry=yy+j*7;for(let i=0;i<18;i++){let on=(i*3+j*5+seed)%13;k.rect(x+5+i*(w-10)/18,ry,(w-10)/18-1,4,on<4?k.a(T.headBg,.75):k.a(T.altBg,on<9?.6:.15));}}}
}
// Extra readings occupy measured free zones; none substitute for real sensor data.
function dzSecondary(k,W,H,d){
  const s=W<200,b=H>200,seed=dzSlot(d),m=d.mode;
  if(m==='status'){
    if(b){dzRegister(k,178,258,174,15,seed,.65);dzSubpanel(k,175,179,22,73,'ID',seed,3);}
    if(s)dzRegister(k,108,107,48,6,seed,.5);
  }
  if(m==='shift'){
    const l=dzTimerLayout(W,H);if(!s){const xx=b?263:242;dzRegister(k,xx,l.y+8,W-xx-16,16,seed,.42);k.t('RLS / LOCKED',xx,l.y+(b?37:28),6,k.L,{w:W-xx-16});}
    if(b){dzRegister(k,12,177,W-24,6,seed,.45);dzRegister(k,195,306,W-207,7,seed,.55);}
  }
  if(m==='solar'){
    if(!s){dzSubpanel(k,119,49,77,42,'CYCLE / SIM',seed,1);dzRegister(k,204,88,W-216,12,seed,.55);}
    if(b){for(let i=0;i<6;i++)dzRegister(k,18+(i%3)*115,221+Math.floor(i/3)*69,68,7,seed+i,.58);dzRegister(k,12,330,134,13,seed,.5);}
  }
  if(m==='audio'){
    if(!s){dzRegister(k,205,88,W-217,8,seed,.65);dzRegister(k,205,142,W-217,7,seed,.52);}
    if(b)dzRegister(k,12,329,W-24,12,seed,.6);
  }
  if(m==='transmission'){
    if(b)dzRegister(k,12,203,W-24,6,seed,.65);
  }
  if(m==='discord'&&b){dzSubpanel(k,209,151,W-221,49,'DECISION STACK / SIM',seed,3);dzRegister(k,12,331,W-24,9,seed,.58);}
  if(m==='oddity'){
    if(b){dzRegister(k,12,231,W-24,8,seed,.55);dzRegister(k,207,130,W-219,7,seed,.62);}
  }
  if(m==='feeds'&&b){dzSubpanel(k,12,327,166,17,'RECON / DEFERRED / 09',seed,0);dzSubpanel(k,186,327,166,17,'CIVIL / HELD / 03',seed+1,0);}
  if(m==='game'){
    if(!s){dzRegister(k,218,54,W-230,8,seed,.58);}
    if(b){dzRegister(k,12,225,W-24,8,seed,.62);dzRegister(k,12,337,W-24,7,seed,.5);}
  }
}

// Revision 5: each department owns a distinct geometry. Reference images inform grammar, not layouts.
function dzRibbon(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,8);dzAxis(k,x,y,w,h);
  const form=seed%10,rows=h>100?62:40,cols=12;
  const at=(t,u,layer)=>{
    let c;
    if(form===0)c=.5+.22*Math.sin(t*Math.PI*2-.7);
    else if(form===1)c=.5+.17*Math.sin(t*Math.PI*3.2);
    else if(form===2)c=.5+.23*Math.cos(t*Math.PI*1.5+.3);
    else if(form===3)c=.32+t*.30+.13*Math.sin(t*Math.PI*4);
    else if(form===4)c=.5+.23*Math.sin(t*Math.PI*2.5+.8)*Math.sin(t*Math.PI);
    else if(form===5)c=.5+.20*Math.sin(t*Math.PI*4.6+.2);
    else if(form===6)c=.5+.24*Math.sin(t*Math.PI)*Math.cos(t*Math.PI*2);
    else if(form===7)c=.5+.23*Math.sin(t*Math.PI*1.2+2);
    else if(form===8)c=.5+.19*Math.cos(t*Math.PI*5)*(.4+.6*t);
    else c=.28+t*.42+.15*Math.sin(t*Math.PI*2.7);
    const width=(.11+.055*Math.sin(t*8+layer))*Math.cos(t*7+layer*.8);
    return [x+w*(c+u*width+layer*.035),y+4+t*(h-8)];
  };
  for(let z=0;z<3;z++){
    const col=z===0?k.a(T.accent,.9):z===1?k.a(T.altBg,.85):k.ia(.53);
    for(let j=0;j<=cols;j++){let pts=[];for(let i=0;i<=rows;i++)pts.push(at(i/rows,j/cols*2-1,z));k.ln(pts,col,.5);}
    for(let i=0;i<rows;i++){const t=i/rows,pts=[];for(let j=0;j<=cols;j++)pts.push(at(t,j/cols*2-1,z));k.ln(pts,col,.55);if(i%2===0)for(let j=0;j<cols;j++)k.ln([at(t,j/cols*2-1,z),at((i+1)/rows,(j+1)/cols*2-1,z)],k.a(z?T.altBg:T.accent,.4),.4);}
  }
  const yy=y+h*(.25+(seed%4)*.12);k.ln([[x,yy],[x+w,yy]],k.H,.8);k.poly([[x+w-6,yy-3],[x+w,yy],[x+w-6,yy+3]],k.H);
  for(let j=0;j<6;j++){const cy=y+h*(j+.5)/6;k.t(String(100+j*20),x+3,cy-2,5,k.L,{w:22});k.t(['A','B','C','D','E','F'][j],x+w-4,cy-2,5,k.A,{a:'r',w:10});}
}
function dzFan(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,6);const target=[x+w*.8,y+h*.72];
  for(let j=0;j<16;j++){const sy=y+h*(.05+j*.055),pts=[[x,sy],[x+w*(.3+(j%3)*.015),sy],[target[0],target[1]],[x+w,target[1]+(j-8)*h*.008]];k.ln(pts,j===seed%16?k.H:j%4===0?k.A:k.a(T.altBg,.78),j===seed%16?1.3:.7);k.rect(x,sy-1,3,2,j%4?k.L:k.A);if(j%3===0)k.t('L'+String(j+1).padStart(2,'0'),x+w*.04,sy-5,5,k.L,{w:w*.2});}
  k.circ(target[0],target[1],3,null,k.I,.7);for(let i=0;i<10;i++)k.ln([[x+w*i/10,y+h-3],[x+w*i/10,y+h]],k.L,.7);
}
function dzChannelLoom(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,9,8);const nodes=[];
  for(let j=0;j<4;j++)for(let i=0;i<3;i++)nodes.push([x+w*(.12+i*.36),y+h*(.10+j*.25)]);
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if((i*3+j+seed)%5===0){const a=nodes[i],b=nodes[j];k.ln([a,[x+w*.51,a[1]],b],k.a(i%2?T.accent:T.altBg,.55),.5);}
  nodes.forEach(([xx,yy],i)=>{k.rect(xx-4,yy-3,8,6,i===seed%12?k.H:k.a(T.altBg,.12),i%3?k.L:k.A,.6);k.circ(xx,yy,1,i%3?k.L:k.A);});
  k.rect(x+w*.46,y,w*.10,h,k.a(T.headBg,.12),k.H,.6);for(let i=0;i<12;i++)k.rect(x+w*.475,y+i*h/12+1,w*.07,h/20,i%5?k.L:k.H);
}
function dzDutyGates(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,8);
  const bw=w*.31,bh=h*.21,bx=x+w*.05,bus=x+w*.59;
  for(let j=0;j<3;j++){
    const yy=y+h*(.06+j*.32),c=j===2?k.H:k.L;k.poly([[bx,yy],[bx+bw-5,yy],[bx+bw,yy+5],[bx+bw,yy+bh],[bx,yy+bh]],k.a(T.altBg,.12),c,1);
    k.t(['REQUEST','ASSIGNED','RELEASE'][j],bx+3,yy+3,7,c,{w:bw-6,f:'bold'});
    for(let i=0;i<8;i++)k.rect(bx+3+i*(bw-6)/8,yy+bh-5,(bw-9)/8,2,(i+j+seed)%3?k.A:k.H);
    for(let i=0;i<3;i++){const ly=yy+bh*(.30+i*.22);k.ln([[bx+bw,ly],[bus+(i-1)*3,ly],[bus+(i-1)*3,y+h*.50],[x+w*.75,y+h*.50]],k.a(j===2?T.headBg:T.accent,.6),.55);}
  }
  k.rect(x+w*.73,y+h*.36,w*.23,h*.28,k.a(T.headBg,.15),k.H,1);k.t('LOCK',x+w*.845,y+h*.39,8,k.H,{a:'c',w:w*.2,f:'bold'});k.t('09 / SIM',x+w*.845,y+h*.53,5,k.L,{a:'c',w:w*.2});
  for(let j=0;j<11;j++)k.rect(bus-7,y+j*h/11,14,1,j%3?k.a(T.altBg,.4):k.L);
}
function dzWarningField(k,x,y,w,h,seed){
  const cols=h<22?Math.max(7,Math.floor(w/22)):Math.max(4,Math.floor(w/62)),cw=w/cols,rows=h<22?1:Math.max(2,Math.round(h/(cw*.60))),ch=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const cx=x+(i+.5)*cw,cy=y+(j+.5)*ch,id=(i+j*cols+seed)%7,on=id<5,col=on?k.H:k.L;
    // Chamfered interlock tile, deliberately not a franchise warning crest.
    const ww=cw-3,hh=ch-3;k.poly([[cx-ww/2+4,cy-hh/2],[cx+ww/2-4,cy-hh/2],[cx+ww/2,cy],[cx+ww/2-4,cy+hh/2],[cx-ww/2+4,cy+hh/2],[cx-ww/2,cy]],on?col:k.a(T.altBg,.12),col,.7);
    if(h<22){k.t(String(id+11),cx,cy-3,6,on?k.GR:k.L,{a:'c',w:cw-8,f:'bold'});}
    else{const ink=on?k.GR:k.L;k.t(['HOLD','SEAL','RETAIN','CHECK','WAIT','REVIEW','LOCK'][id],cx,cy-hh*.22,Math.min(8,hh*.21),ink,{a:'c',w:ww-12,f:'bold'});k.t('S'+String(i+j*cols+1).padStart(2,'0'),cx,cy+hh*.12,5,ink,{a:'c',w:ww-12});for(let q=0;q<3;q++){k.rect(cx-ww*.32+q*ww*.25,cy+hh*.36,ww*.14,1,ink);}k.ln([[cx-ww*.37,cy-hh*.36],[cx+ww*.37,cy-hh*.36]],ink,.45);}
  }
}
function dzConsensus(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,9);
  const pts=[[.06,.12],[.38,.05],[.89,.17],[.12,.78],[.49,.91],[.90,.76],[.31,.40],[.71,.46],[.51,.63]].map(([a,b])=>[x+a*w,y+b*h]);
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)if((i+j)%3!==0){k.ln([pts[i],pts[j]],k.a((i+j)%5===0?T.accent:T.altBg,.22+(i%3)*.13),.5);}
  [[0,1],[1,2],[2,5],[5,4],[4,3],[3,0],[6,7],[7,8],[8,6]].forEach(([a,b],i)=>k.ln([pts[a],pts[b]],i===seed%9?k.H:k.L,i===seed%9?1.6:1));
  const dept=[['OPS',.01,.03],['AIR',.66,.04],['CIV',.34,.34],['REC',.02,.72],['CMD',.69,.70]],bw=w*.29,bh=h*.23;
  dept.forEach(([l,a,b],i)=>{const xx=x+a*w,yy=y+b*h,col=i===seed%5?k.H:i%2?k.A:k.L;k.poly([[xx+4,yy],[xx+bw-4,yy],[xx+bw,yy+4],[xx+bw,yy+bh-4],[xx+bw-4,yy+bh],[xx,yy+bh],[xx,yy+5]],k.a(T.ground||T.panel,.93),col,1.2);k.rect(xx+3,yy+3,bw-6,Math.min(13,bh*.48),col);k.t(l,xx+5,yy+4,Math.min(11,bh*.32),k.GR,{w:bw-10,f:'bold'});if(bh>21){k.t(i===seed%5?'WITHHELD':'LINK / 0'+(i+1),xx+4,yy+bh-8,5,col,{w:bw-8});}for(let q=0;q<4;q++)k.rect(xx+4+q*(bw-8)/4,yy+bh*.61,(bw-12)/4,1,col);if(bh>40){dzRegister(k,xx+5,yy+19,bw-10,16,i+seed,.55);for(let j=0;j<3;j++)for(let q=0;q<12;q++)k.rect(xx+5+q*(bw-10)/12,yy+bh*.53+j*4,(bw-16)/12,2,(q+j+i)%4?col:k.H);}});
  pts.forEach(([xx,yy],i)=>{k.circ(xx,yy,2,k.GR,i%3?k.L:k.A,.6);});
}
function dzSeal(k,x,y,w,h,id){
  const X=u=>x+w*u,Y=u=>y+h*u,r=Math.min(w,h),c=id%3===0?k.H:id%3===1?k.L:k.A;
  const L=(pts,col=c,l=.8)=>k.ln(pts.map(([u,v])=>[X(u),Y(v)]),col,l),R=(a,b,ww,hh,col=c)=>k.rect(X(a),Y(b),w*ww,h*hh,k.a(T.altBg,.05),col,.7);
  if(h>60){for(let j=0;j<18;j++){const u=.03+j*.055;L([[0,u],[.025,u]],k.L,.6);L([[.975,u],[1,u]],k.A,.6);}dzRegister(k,x+w*.08,y+h*.93,w*.84,h*.07,id,.45);}
  if(id===0){for(let j=0;j<5;j++){let a=.06+j*.17;L([[a,.20],[a+.12,.08],[a+.12,.72],[a,.84],[a,.20]],j%2?k.L:k.A,.9);L([[a,.46],[a+.12,.34]],k.H,1.2);}L([[.04,.93],[.94,.93]],k.L,1);for(let j=0;j<11;j++)L([[.06+j*.08,.87],[.06+j*.08,.98]],k.L,.6);}
  if(id===1){for(let j=0;j<4;j++){const a=.09+j*.22;R(a,.10,.17,.80,j%2?k.H:k.L);L([[a,.50],[a+.17,.50]],k.I);for(let q=0;q<4;q++)R(a+.04,.16+q*.17,.09,.08,k.A);}}
  if(id===2){for(let j=0;j<9;j++){const u=.08+j*.105;L([[.10,u],[.90,1-u]],k.L,.6);L([[u,.10],[1-u,.90]],k.A,.6);}k.rect(X(.42),Y(.40),w*.16,h*.2,null,k.H,1);}
  if(id===3){for(let j=0;j<3;j++)for(let i=0;i<4;i++){R(.06+i*.23,.09+j*.30,.18,.24,(i+j)%4?k.L:k.H);for(let q=0;q<3;q++)L([[.085+i*.23,.145+j*.30+q*.05],[.215+i*.23,.145+j*.30+q*.05]],k.A,.55);}}
  if(id===4){for(let i=0;i<6;i++){let d=i*.013;L([[.07+d,.87],[.07+d,.63+d],[.3+d,.63+d],[.3+d,.40+d],[.59+d,.40+d],[.59+d,.12+d],[.93,.12+d]],i===0?k.L:k.a(T.altBg,.75),i===0?1.4:.55);}L([[.16,.92],[.39,.92],[.39,.68],[.70,.68],[.70,.42],[.92,.42]],k.H,2);for(let j=0;j<6;j++){L([[.10+j*.14,.05],[.10+j*.14,.94]],k.a(T.accent,.35),.5);R(.17+j*.10,.76-j*.08,.065,.055,j%2?k.A:k.H);}}
  if(id===5){for(let j=0;j<5;j++){let a=.08+j*.075;R(a,a,1-a*2,1-a*2,j%2?k.H:k.L);}for(let i=0;i<18;i++){let u=.07+i*.05;L([[u,.05],[u,.17]],i%3?k.L:k.H,.6);L([[u,.83],[u,.95]],i%3?k.L:k.H,.6);}k.rect(X(.37),Y(.37),w*.26,h*.26,k.H);k.ln([[X(.42),Y(.5)],[X(.58),Y(.5)]],k.GR,2);}
  if(id===6){for(let i=0;i<9;i++){let a=.07+i*.038;L([[.5,.04+a],[.95-a,.5],[.5,.96-a],[.05+a,.5],[.5,.04+a]],i%3?k.L:k.A,.65);}L([[.02,.5],[.98,.5]],k.H,1.6);for(let j=0;j<7;j++)R(.17+j*.1,.44,.045,.12,j%2?k.L:k.H);}
  if(id===7){for(let i=0;i<5;i++){k.arc(X(.5),Y(.5),r*(.12+i*.075),-.8,4.7,i%2?k.A:k.L,.8);}for(let j=0;j<12;j++){let a=j*Math.PI/6;k.ln([[X(.5)+Math.cos(a)*r*.36,Y(.5)+Math.sin(a)*r*.36],[X(.5)+Math.cos(a)*r*.46,Y(.5)+Math.sin(a)*r*.46]],k.H,1);}}
  if(id===8){for(let j=0;j<10;j++){let a=.06+j*.046;L([[.06,a],[.50,a+.26],[.94,a],[.94,a+.07],[.50,a+.33],[.06,a+.07]],j%3?k.L:k.A,.6);}L([[.50,.31],[.50,.94]],k.H,1.6);for(let j=0;j<7;j++)L([[.44,.47+j*.066],[.56,.47+j*.066]],k.H,.8);}
  if(id===9){for(let i=0;i<5;i++){let a=.08+i*.17;L([[a,.82],[a,.35],[a+.12,.18],[a+.12,.65],[a,.82]],i%2?k.A:k.L,1);L([[a,.55],[a+.12,.38]],k.H);}}
  if(id===10){for(let j=0;j<3;j++){let cx=X(.23+j*.28),cy=Y(.3+(j%2)*.4);k.hex(cx,cy,r*.2,null,k.L,1);k.hex(cx,cy,r*.12,null,k.A,.8);k.circ(cx,cy,r*.055,k.H);}L([[.08,.88],[.33,.6],[.6,.4],[.93,.08]],k.H,1.2);}
  if(id===11){for(let j=0;j<6;j++){let a=.06+j*.145;R(a,.1+j*.035,.115,.78-j*.045,j%3?k.L:k.H);const n=h>150?18:8;for(let q=0;q<n;q++)L([[a+.02,.18+q*.033+j*.03],[a+.10,.18+q*.033+j*.03]],q%5?k.A:k.H,q%5?.5:1.5);}}
}
function dzCredential(k,x,y,w,h,id){
  const p=DZ_PEOPLE[id%12],code=String(id+1).padStart(2,'0'),tall=h>135;
  k.rect(x,y,w,h,k.a(T.altBg,.055),k.L,.8);k.rect(x,y,3,h,id%3===0?k.H:k.L);
  for(let j=0;j<9;j++){const pts=[];for(let i=0;i<=60;i++){const u=i/60;pts.push([x+5+u*(w-10),y+23+(h-34)*(j+.5)/9+Math.sin(u*24+id+j)*3]);}k.ln(pts,k.a(j%2?T.accent:T.altBg,.13),.45);}
  k.rect(x+5,y+5,w-10,14,id%3===0?k.H:k.L);k.t('OPERATOR / '+code,x+10,y+7,9,k.GR,{w:w-22,f:'bold'});
  k.t(code,x+9,y+22,tall?45:35,k.I,{w:w*.43,f:'disp'});
  dzSeal(k,x+w*.54,y+24,w*.38,tall?45:34,id);
  const ny=y+(tall?78:65);k.t(p[0],x+9,ny,12,k.I,{w:w-18,f:'bold'});k.t(p[1],x+9,ny+15,8,k.L,{w:w-18});
  if(tall){dzSeal(k,x+14,y+117,w-28,105,id);k.t('COMPARTMENT '+(id+10)+' / LEVEL '+['A','B','C'][id%3],x+9,y+104,6,k.L,{w:w-18});dzRegister(k,x+9,y+227,w-18,15,id,.6);k.t('FILE / '+(7301+id*137),x+9,y+246,7,k.L,{w:w-18});k.rect(x+9,y+260,w-18,6,k.a(T.ink,.35));k.rect(x+9+(id%4)*13,y+260,w*.26,6,k.H);}
  k.t('C-'+(id+101)+' / '+p[3],x+9,y+h-23,8,k.L,{w:w-18,f:'bold'});
  for(let j=0;j<Math.floor((w-18)/4);j++)k.rect(x+9+j*4,y+h-8,(j+id)%3===0?2.5:1,4,j%7===0?k.H:k.ia(.55));
}
function dzShelterSection(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,18,8);const levels=3+seed%3,cx=x+w*.53,cy=y+h*.50;
  // Underground stepped service decks around a municipal power trunk, never figures.
  for(let j=0;j<levels;j++){
    const yy=y+4+j*(h-8)/levels,hh=(h-10)/levels,left=.03+(j%3)*.035,right=.67-(j%2)*.055;
    [[left,.37-(j%3)*.035],[right,.96-right]].forEach(([xx,ww],s)=>{const px=x+xx*w,pw=ww*w;k.poly([[px+4,yy],[px+pw,yy],[px+pw,yy+hh-3],[px,yy+hh-3],[px,yy+4]],k.a(T.altBg,.1),s?k.L:k.A,.7);for(let q=0;q<5;q++){const bx=px+4+q*(pw-8)/5;k.rect(bx,yy+3,(pw-16)/5,hh*.38,null,q===j%5?k.H:k.L,.6);k.rect(bx,yy+hh*.62,(pw-16)/5,1.3,q%3?k.L:k.A);}k.ln([[px+pw,yy+hh/2],[cx,yy+hh/2]],k.a(T.altBg,.5),.6);});
  }
  const r=Math.min(w*.10,h*.20);k.rect(cx-r*.7,y+2,r*1.4,h-4,k.a(T.headBg,.13),k.H,.8);
  for(let j=0;j<11;j++){const yy=y+5+j*(h-10)/10;k.ell(cx,yy,r*.7,2,null,j%4?k.L:k.H,.6);}
  k.hex(cx,cy,r,k.GR,k.A,1);k.hex(cx,cy,r*.6,null,k.L,.8);k.circ(cx,cy,Math.max(1,r*.22),k.H);k.ln([[x,y+h-1],[x+w,y+h-1]],k.H,1);
}

function dzSlot(d){return Number.isFinite(d.seed)?Math.abs(Math.floor(d.seed)):Math.floor(+(d.now||new Date())/1800000)}
function dzSafe(raw){
  const k=Object.assign({},raw);
  k.t=(text,x,y,size,color,o={})=>{const s=String(text),f=o.f||'mono',factor=f==='disp'?.68:.61,w=o.w||300;raw.t(s,x,y,Math.min(size,w/Math.max(1,s.length*factor)),color,{...o,nofit:true});};
  k.para=(text,x,y,w,size,color,f='disp',max=3,lh=1.22)=>{let ls;for(let n=0;n<110;n++){const limit=Math.floor(w/(size*(f==='disp'?.68:.61)));ls=[];let line='';for(const word of String(text).split(/\s+/)){if(line&&(line+' '+word).length>limit){ls.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)ls.push(line);if(ls.length<=max&&ls.every(s=>s.length<=limit))break;size*=.96;}ls.forEach((s,i)=>k.t(s,x,y+i*size*lh,size,color,{f,w}));return ls.length*size*lh;};return k;
}
function dzFrame(k,W,H,d){
  k.rect(0,0,W,H,k.GR);const slot=dzSlot(d),kind=Object.keys(DZ_META).indexOf(d.mode);dzTerminalBed(k,8,30,W-16,H-52,slot+kind*19,kind,.85);
  for(let i=0;i<6;i++){k.rect(12+i*7,25,4,.7,i%3?k.L:k.H);k.rect(W-52+i*6,24,3,1,k.a(T.altBg,.6));}
  k.poly([[5,15],[15,5],[W-15,5],[W-5,15],[W-5,H-15],[W-15,H-5],[15,H-5],[5,H-15]],null,k.a(T.altBg,.6),.7);
  k.rect(10,10,30,14,k.H);k.t('D-00',25,12,9,k.I,{a:'c',w:28,f:'bold'});
  k.t(DZ_META[d.mode],47,11,W<200?9:10,k.L,{w:W-60,f:'bold'});
  k.ln([[10,28],[W-10,28]],k.L,.6);
  for(let i=0;i<5;i++){k.rect(W-20-i*4,H-12,2,3,i%3?k.L:k.H)}
  k.t(['status','shift','solar'].includes(d.mode)?'D-00 / PERSONAL TERMINAL':'D-00 / SIMULATED RECORD',12,H-17,7,k.S,{w:W-56});
  for(const x of [2,W-3]){k.rect(x,32,1,17,k.H);k.rect(x,H-49,1,17,k.L);}
}
function dzChip(k,text,x,y,w,c=k.H){k.rect(x,y,w,13,c);k.t(text,x+w/2,y+2,8,k.GR,{w:w-6,a:'c',f:'bold'});}
function dzLabel(k,text,x,y,w,c){k.t(text,x,y,8,c||k.L,{w,f:'bold'});}
function dzRule(k,x,y,w,l,v,c){k.ln([[x,y],[x+w,y]],k.a(T.altBg,.36),.6);k.t(l,x,y+4,8,k.S,{w:w*.53});k.t(v,x+w,y+3,10,c||k.I,{a:'r',w:w*.45,f:'bold'});}
function dzGrid(k,x,y,w,h,nx=10,ny=6){for(let i=0;i<=nx;i++)k.ln([[x+i*w/nx,y],[x+i*w/nx,y+h]],k.a(T.altBg,i%5===0?.28:.1),.5);for(let i=0;i<=ny;i++)k.ln([[x,y+i*h/ny],[x+w,y+i*h/ny]],k.a(T.altBg,i%3===0?.26:.1),.5);}
function dzAxis(k,x,y,w,h){k.ln([[x,y],[x,y+h],[x+w,y+h]],k.L,.8);for(let j=0;j<=8;j++){k.ln([[x-3,y+j*h/8],[x,y+j*h/8]],k.L,.7);k.ln([[x+j*w/8,y+h],[x+j*w/8,y+h+3]],k.L,.7)}}
function dzBand(k,x,y,w,h,n,seed,c){const rng=k.rng(seed+113);for(let i=0;i<n;i++){const v=rng(),xx=x+i*w/n;k.rect(xx,y,w/n-1,h,k.a(T.altBg,.09));k.rect(xx,y+h*(1-v),w/n-1,h*v,i%9===0?k.H:c||k.L);}}
function dzHexField(k,x,y,w,h,seed){const r=Math.min(12,w/13,h/5),dx=r*1.8,dy=r*1.6;for(let j=0;j<Math.floor(h/dy);j++)for(let i=0;i<Math.floor(w/dx)-1;i++){const n=(i*5+j*7+seed)%13,c=n<2?k.H:n<6?k.L:n===8?k.A:k.a(T.altBg,.08);k.hex(x+r+i*dx+(j%2)*dx/2,y+r+j*dy,r*.9,c,k.a(T.altBg,.6),.55);}}
function dzRing(k,x,y,w,h,seed,value,caption){
  const r=Math.min(w,h)*.43,cx=x+w*.5,cy=y+h*.49;
  dzRegister(k,x,y,w,Math.min(h,16),seed,.3);
  for(let q=0;q<5;q++){const yy=y+h*(.23+q*.135);k.ln([[x,yy],[cx-r*.91,yy]],k.a(T.accent,.45),.5);k.ln([[cx+r*.91,yy],[x+w,yy]],k.a(T.altBg,.6),.5);}
  for(let z=0;z<4;z++){const rr=r*(.34+z*.07);k.arc(cx,cy,rr,-1.1,.4,k.a(T.accent,.35),.5);k.arc(cx,cy,rr,2.1,3.6,k.a(T.altBg,.4),.5);}
  for(let i=0;i<96;i++){const a=i*Math.PI/48,b=a+.037,rr=r*(i%8===0?1.07:1);k.ln([[cx+r*.93*Math.cos(a),cy+r*.93*Math.sin(a)],[cx+rr*Math.cos(a),cy+rr*Math.sin(a)]],i%8?k.a(T.altBg,.7):k.I,i%8?.5:1);if(i%8===0&&w>110)k.t(String(i*10),cx+(r+10)*Math.cos(a),cy+(r+10)*Math.sin(a)-3,5.5,k.L,{a:'c',w:19});}
  for(let i=0;i<28;i++){const a=-Math.PI/2+i*Math.PI/14,b=a+.155;k.poly([[cx+r*.84*Math.cos(a),cy+r*.84*Math.sin(a)],[cx+r*.84*Math.cos(b),cy+r*.84*Math.sin(b)],[cx+r*.68*Math.cos(b),cy+r*.68*Math.sin(b)],[cx+r*.68*Math.cos(a),cy+r*.68*Math.sin(a)]],i<18?k.H:i<23?k.L:k.ia(.12));}
  k.circ(cx,cy,r*.64,null,k.ia(.65),.65);k.arc(cx,cy,r*.57,-2.8,1.1,k.A,2);k.arc(cx,cy,r*.51,.2,2.5,k.a(T.altBg,.55),1);
  k.ln([[cx-r*1.08,cy],[cx-r*.9,cy]],k.A,1.2);k.ln([[cx+r*.9,cy],[cx+r*1.08,cy]],k.A,1.2);
  k.t(value||'D-00',cx,cy-r*.28,r*.55,k.I,{a:'c',w:r*1.12,f:'disp'});k.t(caption||'CONDITION',cx,cy+r*.3,6,k.L,{a:'c',w:r*1.1});
  for(let i=0;i<4;i++)k.rect(cx-r*.3+i*r*.2,cy+r*.49,r*.11,1.2,i===seed%4?k.H:k.A);
}
// Phase portrait: an evolving bundle of trajectories, never a pictorial character.
function dzPhase(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,12,6);dzAxis(k,x,y,w,h);dzRegister(k,x+3,y+2,w-6,16,seed,.48);
  for(let q=0;q<4;q++){const pp=[];for(let i=0;i<=80;i++){let u=i/80;pp.push([x+u*w,y+h*(.12+q*.25+.055*Math.sin(u*21+q+seed))]);}k.ln(pp,k.a(q%2?T.accent:T.altBg,.23),.5);}
  for(let j=0;j<7;j++){let yy=y+h*(j+.5)/7;k.t(String(910+j*17+seed),x+3,yy-2,5,k.a(T.altBg,.55),{w:19});}
  for(let j=0;j<6;j++){let pts=[];for(let i=0;i<330;i++){const t=i/329*Math.PI*2*3.7,xx=.5+.36*Math.sin(t*(1+(seed%3)*.012)+j*.1)*(.6+.4*Math.cos(t*.17)),yy=.5+.40*Math.sin(t*2.03+j*.03+seed*.08);pts.push([x+xx*w,y+yy*h]);}k.ln(pts,j===0?k.A:j===5?k.H:k.a(T.altBg,.8-j*.08),j===0?.8:.5);}
  for(let j=1;j<5;j++){const xx=x+w*j/5;for(let z=1;z<4;z++){const yy=y+h*z/4;k.ln([[xx-2,yy],[xx+2,yy]],k.A,.5);k.ln([[xx,yy-2],[xx,yy+2]],k.A,.5)}}
  k.ln([[x+w*.67,y],[x+w*.67,y+h]],k.I,.65);k.rect(x+w*.67-2,y+h*.36-2,4,4,k.H);
}
function dzSpectrum(k,x,y,w,h,seed){
  dzGrid(k,x,y,w,h,16,6);dzRegister(k,x+3,y+2,w-6,16,seed,.55);dzSweep(k,x,y+h*.14,w,h*.55,seed,k.a(T.accent,.4));const n=44,rng=k.rng(seed+24);
  for(let i=0;i<n;i++){const v=(.12+.78*Math.exp(-Math.pow((i-21)/11,2)))*(.6+rng()*.4),xx=x+i*w/n;for(let j=0;j<Math.floor(v*15);j++)k.rect(xx,y+h-(j+1)*h/16,w/n-1.2,h/19,j>11?k.H:j%3?k.L:k.A);k.rect(xx,y+h-v*h-3,w/n-1.2,1,k.I)}
  for(let i=0;i<5;i++){const xx=x+i*w/4;k.ln([[xx,y+h],[xx,y+h+4]],k.L,.7);k.t(String(80+i*5),xx,y+h+6,6,k.L,{a:'c',w:16});}
  const gate=x+w*(.43+(seed%3)*.025);k.ln([[gate,y],[gate,y+h]],k.H,1.2);k.poly([[gate-4,y],[gate+4,y],[gate,y+6]],k.H);
}
function dzPacket(k,x,y,w,h,seed){
  const rows=6,cols=Math.max(18,Math.floor(w/4)),cw=w/cols,ch=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let v=(i*13+j*7+seed*3)%23;k.rect(x+i*cw+.5,y+j*ch+.5,cw-1,ch-1,v<6?k.H:v<15?k.a(T.altBg,.7):v===20?k.A:k.ia(.07));}
  for(let i=0;i<5;i++){let xx=x+w*i/5;k.ln([[xx,y-3],[xx+w/5-2,y-3]],k.L,.5)}
}
// Floor-plan records replace the rejected perspective doodles. Each room family has its own topology.
function dzFacility(k,x,y,w,h,id){
  const X=v=>x+v*w,Y=v=>y+v*h,R=(a,b,c,d,col=k.L)=>{k.rect(X(a),Y(b),c*w,d*h,k.a(T.altBg,.09),col,.7);k.rect(X(a)+2,Y(b)+2,c*w-4,d*h-4,null,k.a(T.altBg,.35),.35)},L=(pts,col=k.L,l=.6)=>k.ln(pts.map(p=>[X(p[0]),Y(p[1])]),col,l);
  dzGrid(k,x,y,w,h,12,7);const variants=id;
  for(let j=0;j<6;j++){let yy=y+h*(j+.5)/6;k.t(String(id*17+j+101),x+2,yy,4.5,k.a(T.altBg,.52),{w:15});k.ln([[x+w*.14,yy+2],[x+w*.9,yy+2]],k.a(T.accent,.13),.5);}
  for(let i=0;i<24;i++)k.rect(x+i*w/24,y+h-1,w/24-1,.6,i%5?k.a(T.altBg,.45):k.A);
  if(variants===0){for(let j=0;j<4;j++){R(.06,.06+j*.22,.35,.17,j===id%4?k.H:k.L);R(.59,.06+j*.22,.35,.17);for(let i=0;i<4;i++){R(.085+i*.075,.09+j*.22,.04,.1);R(.615+i*.075,.09+j*.22,.04,.1)}}R(.45,.02,.1,.95,k.A);for(let j=0;j<9;j++)L([[.43,.08+j*.1],[.57,.08+j*.1]],j%3?k.L:k.H,1);}
  if(variants===1){for(let j=0;j<3;j++)for(let i=0;i<4;i++){const cx=X(.13+i*.245),cy=Y(.17+j*.32),r=Math.min(w*.09,h*.13);k.circ(cx,cy,r,null,k.L,.8);k.circ(cx,cy,r*.7,null,k.ia(.35),.5);for(let q=0;q<4;q++){const a=q*Math.PI/2+id*.2;k.ln([[cx+2*Math.cos(a),cy+2*Math.sin(a)],[cx+r*.8*Math.cos(a+.4),cy+r*.8*Math.sin(a+.4)]],j===1?k.H:k.A,1)}}L([[.02,.49],[.98,.49]],k.L,2);}
  if(variants===2){for(let j=0;j<5;j++){let yy=.08+j*.18;R(.08,yy,.64,.11);for(let i=0;i<11;i++)L([[.1+i*.054,yy+.01],[.1+i*.054,yy+.1]],i===id%11?k.H:k.L,.6)}R(.79,.04,.16,.9,k.A);for(let j=0;j<5;j++)R(.82,.08+j*.18,.1,.07,j%2?k.H:k.L);}
  if(variants===3){for(let j=0;j<2;j++)for(let i=0;i<3;i++){let cx=X(.17+i*.33),cy=Y(.24+j*.51),r=Math.min(w*.14,h*.21);k.hex(cx,cy,r,k.a(T.altBg,.15),k.L,1);k.hex(cx,cy,r*.72,null,k.ia(.5),.5);for(let z=0;z<5;z++)k.ln([[cx-r*.55,cy-r*.4+z*r*.2],[cx+r*.55,cy-r*.4+z*r*.2]],j?k.A:k.H,.6);}L([[.02,.5],[.98,.5]],k.A,1.2);}
  if(variants===4){for(let j=0;j<8;j++){let xx=.06+j*.105,yy=.05+(j%3)*.085;R(xx,yy,.075,.72-(j%3)*.1);for(let z=0;z<6;z++)L([[xx+.01,yy+.07+z*.08],[xx+.065,yy+.07+z*.08]],z===id%6?k.H:k.L,.65);}L([[.02,.86],[.94,.86],[.94,.04]],k.A,2);}
  if(variants===5){for(let j=0;j<5;j++)for(let i=0;i<6;i++){const xx=.04+i*.158,yy=.045+j*.19;R(xx,yy,.125,.145,(i+j)%5===0?k.H:k.L);k.rect(X(xx+.02),Y(yy+.035),w*.07,h*.025,(i*3+j+id)%4?k.a(T.altBg,.45):k.A);L([[xx+.02,yy+.095],[xx+.10,yy+.095]],k.ia(.5),.5);}}
  if(variants===6){for(let j=0;j<3;j++){const xx=.07+j*.31;R(xx,.11,.23,.78);for(let z=0;z<8;z++){R(xx+.045,.15+z*.081,.14,.042,z===3?k.H:k.L);L([[xx+.01,.17+z*.081],[xx+.23,.17+z*.081]],k.ia(.45),.45);}}L([[.01,.06],[.98,.06]],k.A,2);L([[.01,.94],[.98,.94]],k.H,2);}
  if(variants===7){const cx=X(.5),cy=Y(.5),r=Math.min(w*.4,h*.45);for(let q=0;q<4;q++)k.hex(cx,cy,r*(1-q*.19),q===3?k.a(T.headBg,.24):null,q===3?k.H:k.L,.8);for(let i=0;i<12;i++){const a=i*Math.PI/6;const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;k.rect(px-3,py-2,6,4,i%3?k.L:k.A);k.ln([[cx+Math.cos(a)*r*.7,cy+Math.sin(a)*r*.7],[px,py]],k.ia(.5),.5);}L([[0,.5],[.16,.5]],k.A,2);L([[.84,.5],[1,.5]],k.H,2);}
  if(variants===8){for(let j=0;j<4;j++){const xx=.05+j*.235;R(xx,.08,.19,.84);R(xx+.025,.18,.14,.28,k.A);R(xx+.025,.56,.14,.23,k.H);for(let z=0;z<5;z++)L([[xx+.05+z*.021,.2],[xx+.05+z*.021,.44]],k.A,.55);L([[xx-.01,.5],[xx+.20,.5]],k.I,1);}L([[.03,.04],[.97,.04]],k.L,1.5);}
  if(variants===9){R(.32,.03,.37,.94,k.L);R(.38,.32,.25,.34,k.H);for(let j=0;j<12;j++){L([[.04,.06+j*.075],[.27,.06+j*.075]],j%3?k.L:k.A);L([[.74,.06+j*.075],[.97,.06+j*.075]],j%4?k.L:k.H);L([[.34,.05+j*.075],[.37,.05+j*.075]],k.I,.6);}for(let z=0;z<6;z++)L([[.40+z*.04,.05],[.40+z*.04,.30]],k.ia(.7),.6);L([[.5,.7],[.5,.96]],k.A,2);}
  if(variants===10){for(let j=0;j<3;j++)for(let i=0;i<3;i++){const xx=.07+i*.31,yy=.12+j*.3;R(xx,yy,.23,.105);for(let z=0;z<4;z++){R(xx+.015+z*.052,yy-.053,.03,.027,k.A);R(xx+.015+z*.052,yy+.13,.03,.027,k.L)}}L([[.015,.01],[.015,.98],[.98,.98]],k.H,1.5);}
  if(variants===11){R(.04,.06,.92,.86,k.H);R(.21,.13,.58,.72,k.L);R(.29,.21,.42,.56,k.H);for(let j=0;j<8;j++){L([[.06+j*.115,.08],[.06+j*.115,.20]],k.H,1.7);L([[.06+j*.115,.78],[.06+j*.115,.91]],k.H,1.7);}k.poly([[X(.37),Y(.36)],[X(.63),Y(.36)],[X(.63),Y(.64)],[X(.37),Y(.64)]],k.H,k.L,.7);k.t('SEALED',X(.5),Y(.43),Math.min(14,h*.16),k.GR,{a:'c',w:w*.25,f:'bold'});L([[.02,.49],[.27,.49]],k.A,1.4);L([[.72,.49],[.99,.49]],k.A,1.4);}
  for(let i=0;i<4;i++){const xx=X(.05+i*.29);k.ln([[xx,y-2],[xx+5,y-2]],k.I,.6)}
}
function dzOperatorCard(k,x,y,w,h,id){
  const p=DZ_PEOPLE[id%12],code=String(id+1).padStart(2,'0'),tall=h>135;
  k.rect(x,y,w,h,k.a(T.altBg,.045),k.L,.8);k.rect(x,y,3,h,k.H);
  // Security-line guilloche and punched registration distinguish each credential.
  for(let j=0;j<11;j++){const pts=[];for(let q=0;q<=70;q++){const t=q/70;pts.push([x+5+t*(w-10),y+21+(h-36)*(j+.5)/11+Math.sin(t*30+j*.7+id)*3]);}k.ln(pts,k.a(j%3?T.altBg:T.accent,.18),.45);}
  for(let j=0;j<18;j++){const yy=y+22+j*(h-29)/18;k.rect(x+w-7,yy,3,2,(j+id)%4?k.a(T.altBg,.5):k.H);}
  if(tall){dzRegister(k,x+9,y+102,w-24,10,id,.55);dzRegister(k,x+9,y+160,w-24,10,id+4,.6);dzRegister(k,x+9,y+236,w-24,10,id+7,.55);}
  k.rect(x+5,y+5,w-10,14,k.L);k.t('OPERATOR / '+code,x+10,y+7,9,k.GR,{w:w-22,f:'bold'});
  // A typographic access instrument: no portrait, avatar or character glyph.
  k.t(code,x+9,y+21,tall?48:39,k.I,{w:w*.43,f:'disp'});
  k.t('S / 9',x+w*.56,y+27,14,k.L,{w:w*.4,f:'bold'});
  k.t('LEVEL '+['A','B','C'][id%3],x+w*.56,y+46,8,k.L,{w:w*.4});
  for(let j=0;j<4;j++)k.rect(x+w*.56+j*(w*.09),y+61,w*.06,4,(id+j)%3?k.H:k.A);
  const nameY=y+(tall?80:65);k.t(p[0],x+9,nameY,11,k.I,{w:w-18,f:'bold'});k.t(p[1],x+9,nameY+15,9,k.L,{w:w-18});
  if(tall){for(let i=0;i<3;i++){const yy=y+119+i*15;k.t(['FILE','ROUTE','TERM'][i],x+9,yy,7,k.S,{w:35});k.rect(x+47,yy+1,w-59-(i%2)*15,6,i===id%3?k.H:k.ia(.6));}dzRule(k,x+9,y+h-54,w-18,'COMPARTMENT',String(id+10).padStart(2,'0'));if(h>240){k.t('AUTHORIZATION / SEALED',x+9,y+174,8,k.L,{w:w-18});for(let j=0;j<3;j++){k.rect(x+9,y+191+j*14,w-18,10,null,k.a(T.altBg,.45),.6);for(let i=0;i<9;i++)k.rect(x+12+i*(w-25)/9,y+194+j*14,(w-40)/9,4,(i+j+id)%4?k.L:k.H);}}}
  const yy=y+h-23;k.t('C-'+(id+101)+' / '+p[3],x+9,yy,8,k.L,{w:w-18,f:'bold'});
  for(let j=0;j<Math.floor((w-18)/4);j++)k.rect(x+9+j*4,y+h-8,(j+id)%3===0?2.5:1,4,j%7===0?k.H:k.ia(.55));
}
function dzNetwork(k,x,y,w,h,seed){
  const nodes=[['OPS',.03,.02],['AIR',.58,.04],['CIV',.23,.36],['REC',.02,.73],['CMD',.65,.67]],bw=w*.29,bh=h*.22;
  dzGrid(k,x,y,w,h,15,7);dzRegister(k,x+2,y+h*.29,w-4,Math.min(16,h*.18),seed,.5);
  for(let q=0;q<7;q++){const yy=y+h*(q+.5)/7;k.ln([[x,yy],[x+w,yy]],k.a(q%3?T.altBg:T.accent,.21),.5);}
  for(let j=0;j<9;j++)k.rect(x+w*.51,y+j*h/9,2,Math.min(5,h/20),j%3?k.L:k.H);
  [[0,2],[1,2],[2,3],[2,4],[0,3],[1,4]].forEach(([a,b],i)=>{let aa=nodes[a],bb=nodes[b],ax=x+aa[1]*w+bw/2,ay=y+aa[2]*h+bh/2,bx=x+bb[1]*w+bw/2,by=y+bb[2]*h+bh/2;k.ln([[ax,ay],[ax,(ay+by)/2],[bx,(ay+by)/2],[bx,by]],i===seed%6?k.H:k.L,i===seed%6?2:1);});
  nodes.forEach(([label,xx,yy],i)=>{xx=x+xx*w;yy=y+yy*h;const col=i===seed%5?k.H:i%2?k.A:k.L;k.poly([[xx,yy],[xx+bw-5,yy],[xx+bw,yy+5],[xx+bw,yy+bh],[xx+5,yy+bh],[xx,yy+bh-5]],col,k.I,.4);k.t(label,xx+4,yy+3,Math.min(14,bh*.35),k.GR,{w:bw-8,f:'bold'});if(bh>35){for(let j=0;j<3;j++){const ry=yy+21+j*(bh-36)/3;for(let z=0;z<12;z++)k.rect(xx+5+z*(bw-10)/12,ry,(bw-10)/12-1,1.5,k.a(T.ground,(z+i+j)%5===0?.7:.24));}k.ln([[xx+bw*.66,yy+4],[xx+bw*.66,yy+17],[xx+bw-4,yy+17]],k.a(T.ground,.55),.6);}if(bh>18)k.t('0'+(i+1)+' / '+(i===seed%5?'HOLD':'LINK'),xx+4,yy+bh-10,6,k.GR,{w:bw-8});});
}
function dzShelter(k,x,y,w,h,seed){
  const n=3+seed%3;dzGrid(k,x,y,w,h,20,10);dzRegister(k,x+3,y+h*.12,w-6,Math.min(h-10,90),seed,.3);k.stripes(x,y,w,5,k.L,7);
  k.rect(x+w*.43,y+8,w*.1,h-12,k.a(T.headBg,.15),k.H,1);for(let i=0;i<12;i++)k.ln([[x+w*.45,y+10+i*(h-18)/12],[x+w*.51,y+10+i*(h-18)/12]],k.L,.7);
  for(let j=0;j<n;j++){const yy=y+12+j*(h-17)/n,hh=(h-22)/n;for(let s=0;s<2;s++){const xx=x+(s?.58:.04)*w,ww=w*.37;k.rect(xx,yy,ww,hh,k.a(T.altBg,.09),k.L,.7);for(let z=0;z<4;z++){const bx=xx+4+z*(ww-8)/4;k.rect(bx,yy+4,(ww-16)/4,hh*.34,null,k.ia(.65),.6);for(let q=0;q<3;q++)k.ln([[bx+2,yy+6+q*hh*.08],[bx+(ww-16)/4-2,yy+6+q*hh*.08]],s?k.A:k.L,.4);}k.rect(xx+4,yy+hh*.63,ww-8,2,(j+s)%3?k.L:k.H);for(let z=0;z<8;z++)k.rect(xx+4+z*(ww-8)/8,yy+hh-6,2,2,(j+s+z)%4?k.A:k.H);}k.t('L'+(j+1),x+w*.48,yy+hh*.32,6,k.I,{a:'c',w:w*.07});}
}
function dzTimerLayout(W,H){return{x:12,y:H>200?100:W<200?83:88,w:W-24,fs:W<200?27:H>200?47:33}}
function dzWeatherMark(k,x,y,id,wx,a){
  if(id===0||id===4){const v=id===0?wx.temp:a.dew;k.rect(x-3,y-11,6,22,null,k.L,.7);k.circ(x,y+14,4,v!=null?k.H:null,k.L,.6);for(let i=0;i<5;i++)k.ln([[x+5,y-9+i*4],[x+(i%2?8:11),y-9+i*4]],k.L,.6);if(v!=null){const norm=T.units==='celsius'?(v+20)/70:(v+4)/126;k.rect(x-1.5,y+9-20*Math.max(0,Math.min(1,norm)),3,20*Math.max(0,Math.min(1,norm)),k.H);}}
  if(id===1){for(let i=0;i<9;i++)k.rect(x-3,y+14-i*3.3,14,2.1,a.rh!=null&&i/9<a.rh/100?k.A:k.ia(.12));k.ln([[x-7,y-13],[x-7,y+16]],k.L,.7);}
  if(id===2){k.poly([[x+1,y-14],[x+14,y+10],[x-12,y+10]],a.uv>5?k.a(T.headBg,.3):null,k.L,1);k.t(a.uv!=null?'!':'?',x+1,y-5,13,k.H,{a:'c',w:15,f:'bold'});k.t(a.uv==null?'--':a.uv<3?'LOW':a.uv<6?'MOD':'HIGH',x+1,y+13,6,k.L,{a:'c',w:25});}
  if(id===3){for(let i=0;i<5;i++){const yy=y-9+i*6;k.ln([[x-10+i*1.7,yy],[x+14-i*1.7,yy]],a.vis?k.a(T.altBg,1-i*.16):k.ia(.12),1.5);}k.ln([[x-13,y-14],[x-13,y+19]],k.L,.5);}
  if(id===5){k.hex(x,y,13,null,k.L,.7);k.ln([[x,y-16],[x,y+16]],k.ia(.5),.5);k.ln([[x-16,y],[x+16,y]],k.ia(.5),.5);if(a.wd!=null){const an=(a.wd-90)*Math.PI/180;k.ln([[x-8*Math.cos(an),y-8*Math.sin(an)],[x+10*Math.cos(an),y+10*Math.sin(an)]],k.H,1.6);k.circ(x+10*Math.cos(an),y+10*Math.sin(an),2,k.H);}k.t('N',x,y-24,6,k.A,{a:'c',w:10});}
}
function dzDuration(ms){let s=Math.max(0,Math.floor(ms/1000));return[String(Math.floor(s/3600)).padStart(2,'0'),String(Math.floor(s/60)%60).padStart(2,'0'),String(s%60).padStart(2,'0')].join(':')}
function dzScene(k,type,x,y,w,h,seed=0){if(type==='ring')dzRing(k,x,y,w,h,seed);else if(type==='envelope')dzPhase(k,x,y,w,h,seed);else if(type==='radio')dzSpectrum(k,x,y,w,h,seed);else if(type==='switch')dzNetwork(k,x,y,w,h,seed);else if(type==='shelter')dzShelter(k,x,y,w,h,seed);else dzFacility(k,x,y,w,h,({door:0,air:1,ration:2,shutter:3,archive:5})[type]||0);}
function dzPaint(raw,W,H,d){
  const k=dzSafe(raw),small=W<200,big=H>200,seed=dzSlot(d),mode=d.mode;
  dzFrame(k,W,H,d);if(mode==='transmission'){k.rect(10,31,W-20,big?104:96,k.a(T.headBg,.17),k.H,.6);k.stripes(10,31,W-20,3,k.H,8);k.rect(10,big?134:124,W-20,2,k.H);}
  const end=(text,y=H-34)=>{k.stripes(12,y,W-24,3,k.L,6);k.t(text,12,y+5,7,k.L,{w:W-24});};
  if(mode==='status'){
    const wx=d.wx||{},ev=d.ev;dzRing(k,small?7:9,small?33:31,small?87:130,small?81:119,seed,wx.temp!=null?wx.temp+'°':'--',wx.temp!=null?'SURFACE':'NO DATA');
    if(small){k.t('S9',109,34,25,k.L,{w:49,f:'disp'});k.t('RESERVE',106,65,7,k.S,{w:52});k.t(d.batt!=null?pct(d.batt):'--',106,77,19,k.I,{w:52,f:'bold'});k.segs(105,101,53,5,8,d.batt||0,k.A,k.ia(.1),1);k.para(ev?ev.title:'Await further instruction.',12,116,W-24,12,k.I,'disp',2);}
    else{
      const xx=149,ww=W-161;dzChip(k,ev?.active?'DUTY IN PROGRESS':'AWAIT ASSIGNMENT',xx,35,ww,k.H);k.para(ev?ev.title:'Await further instruction.',xx,55,ww,16,k.I,'disp',2);
      k.t(ev?shortT(ev.start)+' / '+shortT(ev.end):'NO CALENDAR ORDER',xx,99,9,k.L,{w:ww});
      const rows=[['FEELS',wx.feels!=null?wx.feels+'°':'--',wx.feels!=null&&wx.hi>wx.lo?(wx.feels-wx.lo)/(wx.hi-wx.lo):0],['RESERVE',d.batt!=null?pct(d.batt):'--',d.batt||0]];rows.forEach(([l,v,f],i)=>{const y=116+i*16;k.t(l,xx,y,8,k.S,{w:48});k.segs(xx+51,y+2,ww-96,5,12,f,i?k.A:k.H,k.ia(.1),1);k.t(v,W-12,y,9,k.I,{w:43,a:'r',f:'bold'});});
      if(big){dzChip(k,'PERIMETER AUTHORITY',12,159,146,k.L);k.t('ACCESS IS CONDITIONAL',W-12,161,8,k.L,{a:'r',w:178});dzHexField(k,12,179,160,87,seed);k.t('09',207,178,50,k.I,{w:130,f:'disp'});k.t('CLEARANCE / REVIEW',197,238,10,k.H,{w:W-211,f:'bold'});dzRule(k,12,277,W-24,'SURFACE CONDITION',wx.cond||'UNAVAILABLE');dzRule(k,12,300,W-24,'HIGH / LOW',wx.hi!=null&&wx.lo!=null?wx.hi+'° / '+wx.lo+'°':'UNAVAILABLE');k.t('Your presence has been recorded.',12,328,14,k.I,{w:W-24,f:'disp'});end('SIM / PERIMETER RECORD. PERSONAL READINGS ABOVE.');}
    }
  }else if(mode==='shift'){
    const ev=d.ev,now=+(d.now||new Date()),target=ev?(ev.active?+ev.end:+ev.start):null;
    k.t(ev?(ev.active?'ACTIVE DUTY / RELEASE IN':'ASSIGNMENT BEGINS IN'):'NO ASSIGNMENT / STAND BY',12,34,9,k.L,{w:W-24,f:'bold'});k.para(ev?ev.title:'Await further instruction.',12,48,W-24,small?12:big?18:14,k.I,'disp',2);
    const l=dzTimerLayout(W,H);k.poly([[10,l.y-3],[W-20,l.y-3],[W-10,l.y+7],[W-10,l.y+l.fs*1.25],[20,l.y+l.fs*1.25],[10,l.y+l.fs*1.25-10]],k.a(T.headBg,.15),k.H,1.5);k.poly([[10,l.y-5],[W-24,l.y-5],[W-12,l.y+4],[10,l.y+4]],k.H);k.poly([[10,l.y+l.fs*1.25-6],[17,l.y+l.fs*1.25],[W-10,l.y+l.fs*1.25],[W-10,l.y+l.fs*1.25+3],[10,l.y+l.fs*1.25+3]],k.H);if(!d.live)k.t(target?dzDuration(target-now):'--:--:--',l.x+3,l.y,l.fs,k.L,{w:l.w-6,f:'bold'});
    const yy=big?164:139,n=small?9:22;for(let i=0;i<n;i++){let lit=ev&&i/n<Math.max(0,(now-ev.start)/(ev.end-ev.start));k.hex(17+i*(W-34)/(n-1),yy,small?5:6,lit?k.H:k.a(T.altBg,.14),k.L,.5)}
    if(big){k.t('AUTHORIZATION SEQUENCE / SIM',12,187,9,k.L,{w:W-24});dzDutyGates(k,13,208,162,100,seed);[['01 / REQUEST','RECEIVED'],['02 / ASSIGN','RECORDED'],['03 / RELEASE','PENDING']].forEach(([a,b],i)=>{k.t(a,195,208+i*33,8,k.L,{w:W-207});k.t(b,195,219+i*33,15,i===2?k.H:k.I,{w:W-207,f:'bold'});});dzRule(k,12,319,W-24,'DUTY WINDOW',ev?shortT(ev.start)+' / '+shortT(ev.end):'UNAVAILABLE');end('NO EARLY WITHDRAWAL / OPERATIONS COPY');}
  }else if(mode==='solar'){
    const sun=d.sun||{},wx=d.wx||{},a=d.atm||{},day=sun.phase==='day';for(let q=0;q<15;q++){const pts=[];for(let i=0;i<=80;i++){const u=i/80;pts.push([12+u*(W-24),47+q*3.2+Math.sin(u*8+q*.11)*6]);}k.ln(pts,k.a(q%3?T.accent:T.altBg,.22),.55);}k.t(sun.phase?(day?'DAYLIGHT REMAINING':'NIGHT CYCLE'):'SOLAR FEED UNAVAILABLE',12,34,8,k.L,{w:W-24});k.t(sun.left!=null?pct(sun.left):'--',12,48,small?35:44,k.I,{w:116,f:'disp'});
    if(!small){k.t(day?'SUNDOWN IN':'DAWN IN',W-12,35,9,k.L,{w:130,a:'r'});k.t(sun.remaining!=null?dzDuration(sun.remaining):'--:--:--',W-12,54,27,k.L,{w:W-144,a:'r',f:'bold'});}
    const yy=small?97:106,bw=W-24;k.rect(12,yy,bw,17,k.a(T.altBg,.12),k.L,.6);if(day&&sun.left!=null)k.stripes(12,yy,bw*(1-sun.left),17,k.H,7);else if(sun.phase==='night')k.stripes(12,yy,bw,17,k.a(T.headBg,.4),7);for(let i=0;i<25;i++)k.ln([[12+bw*i/24,yy+17],[12+bw*i/24,yy+17+(i%6?3:7)]],k.L,.6);const pos=day&&sun.left!=null?Math.max(.02,Math.min(.98,1-sun.left)):null;if(pos!=null){k.hex(12+bw*pos,yy+8.5,8,k.H,k.I,1);k.ln([[12+bw*pos,yy-7],[12+bw*pos,yy]],k.A,1.2)}k.t('0%',12,yy+26,7,k.L,{w:26});k.t('PHASE ELAPSED',W/2,yy+26,7,k.L,{a:'c',w:90});k.t('100%',W-12,yy+26,7,k.L,{a:'r',w:30});
    if(big){const vals=[['SURFACE',wx.temp!=null?wx.temp+'°':'--'],['HUMIDITY',a.rh!=null?a.rh+'%':'--'],['UV INDEX',a.uv!=null?String(a.uv):'--'],['VISIBILITY',a.vis||'--'],['DEW POINT',a.dew!=null?a.dew+'°':'--'],['WIND',a.wind||(a.ws!=null?Math.round(T.units==='celsius'?a.ws*1.609:a.ws)+(T.units==='celsius'?' KM/H':' MPH'):'--')]];k.t('ATMOSPHERIC THREAT MATRIX / LOCAL WEATHER',12,154,9,k.L,{w:W-24});vals.forEach(([label,value],i)=>{const xx=12+(i%3)*115,yy=172+Math.floor(i/3)*69;k.poly([[xx+6,yy],[xx+108,yy],[xx+108,yy+54],[xx+102,yy+60],[xx,yy+60],[xx,yy+6]],k.a(T.altBg,.04),i===0?k.H:k.L,.6);k.t(label,xx+7,yy+5,8,k.L,{w:94});k.t(value,xx+7,yy+23,21,k.I,{w:64,f:'bold'});dzWeatherMark(k,xx+87,yy+34,i,wx,a);});const probs=a.probs||[];k.t('PRECIP / NEXT 12H',12,316,8,k.L,{w:130});probs.slice(0,12).forEach((p,i)=>k.rect(155+i*16,337-Math.max(1,p*.23),12,Math.max(1,p*.23),p>50?k.H:k.L));end(probs.length?'CIVIL DEFENSE / SURFACE WATCH':'FORECAST CHANNEL / NO DATA');}
  }else if(mode==='audio'){
    if(small){dzChip(k,'CIVIL BROADCAST',12,35,W-24,k.L);dzSpectrum(k,12,56,W-24,66,seed);k.t('STAY ON FREQUENCY',12,139,10,k.I,{w:W-24,f:'bold'});}
    else{k.t('STAY ON',205,34,25,k.I,{w:W-217,f:'disp'});k.t('FREQUENCY',205,63,23,k.I,{w:W-217,f:'disp'});dzSpectrum(k,12,40,179,83,seed);dzChip(k,'09 / MORALE',205,103,W-217,k.L);k.t('OPEN YOUTUBE MUSIC',205,127,8,k.A,{w:W-217});
      if(big){k.t('CARRIER ANALYSIS / SYNTHETIC TEST SIGNAL',12,158,9,k.L,{w:W-24});for(let j=0;j<10;j++){const yy=176+j*8;for(let i=0;i<65;i++){const v=Math.sin(i*.31+j*.8)*Math.cos(i*.16-j*.23);if(v>.04)k.rect(12+i*(W-24)/65,yy,4,6,v>.76?k.H:v>.5?k.A:k.a(T.altBg,.2+v*.6));}}dzRule(k,12,264,W-24,'BROADCAST AUTHORITY','CIVIL DEFENSE');dzRule(k,12,286,W-24,'REQUESTS','SUSPENDED',k.H);dzRule(k,12,308,W-24,'SILENCE','ALSO MONITORED');end('RECEIVER SIMULATION / TAP OPENS MUSIC');}
    }
  }else if(mode==='transmission'){
    dzChip(k,d.archival?'ARCHIVE':'BULLETIN',12,35,small?60:77,k.H);if(!small)k.t('COPY '+String(seed%1000).padStart(3,'0')+' / PRIORITY A',W-12,37,8,k.L,{w:190,a:'r'});
    const hh=k.para(d.text||'Remain Calm. Remain Indoors.',12,55,W-24,small?16:big?26:23,k.I,'disp',small?3:2);k.para(d.by||'DIRECTIVE ZERO / CIVIL DEFENSE',12,59+hh,W-24,7,k.S,'mono',1);
    if(!big){dzWarningField(k,12,132,W-24,15,seed);}
    else{k.t('RESTRICTION MAP / ALL SECTORS',12,139,9,k.L,{w:W-24});dzWarningField(k,12,158,W-24,103,seed);k.rect(12,270,W-24,18,k.H);k.t('RECEIPT DOES NOT IMPLY CONSENT',W/2,274,10,k.GR,{a:'c',w:W-34,f:'bold'});dzRule(k,12,299,W-24,'RECEIPT','MANDATORY',k.H);k.t('Unacknowledged does not mean unread.',12,326,15,k.I,{w:W-24,f:'disp'});end('ARCHIVE / DEPARTMENTAL ORDER / RETAIN THIS COPY');}
  }else if(mode==='instagram'){
    const n=small?1:2,cw=small?W-24:(W-32)/2,ch=big?304:118;for(let i=0;i<n;i++)dzCredential(k,12+i*(cw+8),33,cw,ch,(seed+i)%12);if(big)end('RECORDS OFFICE / IDENTITY IS A COMPARTMENT');
  }else if(mode==='youtube'){
    const n=small?1:big?4:2,cols=small?1:2,cw=(W-24-(cols-1)*8)/cols,ch=big?145:117;
    for(let i=0;i<n;i++){const id=(seed+i)%12,xx=12+i%cols*(cw+8),yy=33+Math.floor(i/cols)*154;k.rect(xx,yy,cw,ch,null,k.L,.6);k.rect(xx,yy,cw,15,k.a(T.headBg,.85));k.t('CAM '+String(id+1).padStart(2,'0')+' / FACILITY',xx+4,yy+3,8,k.I,{w:cw-8,f:'bold'});dzFacility(k,xx+5,yy+22,cw-10,ch-47,id);const scan=xx+8+(id%7)*(cw-16)/7;k.ln([[scan,yy+21],[scan,yy+ch-26]],k.a(T.headBg,.75),1);k.ln([[xx+5,yy+21],[xx+15,yy+21],[xx+15,yy+26]],k.I,.6);k.ln([[xx+cw-5,yy+ch-26],[xx+cw-15,yy+ch-26],[xx+cw-15,yy+ch-31]],k.I,.6);k.t(DZ_ROOMS[id],xx+5,yy+ch-19,10,k.L,{w:cw-10,f:'bold'});k.t('SEC '+(id+11)+' / ACCESS SEALED',xx+5,yy+ch-8,5,k.S,{w:cw-10});}if(big)end('ARCHITECTURAL RECORD / FACILITY SCHEMATIC / OPEN YOUTUBE');
  }else if(mode==='discord'){
    if(small){dzConsensus(k,12,36,W-24,91,seed);k.t('COMMAND NET / 09',12,137,11,k.I,{w:W-24,f:'bold'});}
    else{dzConsensus(k,12,35,182,big?165:104,seed);k.t('QUORUM',210,35,23,k.I,{w:W-222,f:'disp'});k.t('WITHHELD',210,64,21,k.H,{w:W-222,f:'disp'});k.t('COMMAND NET / 09',210,98,9,k.L,{w:W-222});k.t('OPEN DISCORD',210,128,9,k.A,{w:W-222});if(big){k.t('FIVE DEPARTMENTS / ONE INSTRUCTION',12,210,9,k.L,{w:W-24});['OPERATIONS','AIR HANDLING','CIVIL DEFENSE','RECORDS','COMMAND'].forEach((name,i)=>{const yy=231+i*20;k.rect(12,yy,25,15,i===seed%5?k.H:k.L);k.t('0'+(i+1),24,yy+2,9,k.GR,{a:'c',w:20,f:'bold'});k.t(name,47,yy+2,10,k.I,{w:132});for(let z=0;z<12;z++)k.rect(194+z*12,yy+3,9,9,(z+i+seed)%7===0?k.H:k.a(T.altBg,(z+i)%3?.48:.15));});end('SIMULATED ROUTING / YOUR PLACE HAS BEEN ASSIGNED');}}
  }else if(mode==='oddity'){
    k.t('FORM OE-09 / OPERATOR ASSESSMENT',12,34,8,k.L,{w:W-24});dzRibbon(k,15,small?53:55,small?W-30:177,big?173:69,seed);
    if(!small){k.t('SYNCHRONIZATION',207,53,8,k.L,{w:W-219});k.t((71+seed%27)+'.'+seed%10+'%',207,66,36,k.I,{w:W-219,f:'disp'});k.t('HESITATIONS / '+seed%8,207,114,9,k.H,{w:W-219});if(big){dzBand(k,207,143,W-219,58,22,seed,k.L);k.t('RESPONSE RETENTION',207,208,8,k.L,{w:W-219});}}
    k.t(DZ_EVAL.verdict[seed%10],12,big?244:134,small?12:14,k.I,{w:W-24,f:'bold'});
    if(big){dzRule(k,12,273,W-24,'TEARS',DZ_EVAL.tears[seed%10]);dzRule(k,12,294,W-24,'ASSIGNED',DZ_EVAL.shelter[seed%10]);k.t(DZ_EVAL.notes[seed%10],12,319,16,k.I,{w:W-24,f:'disp'});end('SIM / EVALUATION COPY / NOT A HEALTH ASSESSMENT');}
  }else if(mode==='feeds'){
    const count=small?1:2,cw=small?W-24:(W-32)/2;
    for(let s=0;s<count;s++){const xx=12+s*(cw+8);dzChip(k,s?'CIVILIAN CHATTER':'VISUAL RECON',xx,34,cw,s?k.L:k.H);const yy=big?56:55,hh=big?139:62;
      if(s)dzChannelLoom(k,xx,yy,cw,hh,seed+71);else dzFan(k,xx,yy,cw,hh,seed);
      k.t(s?'OPEN INSTAGRAM':'OPEN YOUTUBE',xx,big?203:124,9,k.A,{w:cw,f:'bold'});k.t(s?'OBSERVE / COMPARE / COMPLY':'INFORMATION IS AMMUNITION',xx,big?220:141,6,k.L,{w:cw});
      if(big){['ADMITTED','WITHHELD','REVIEW'].forEach((l,i)=>{const y=241+i*29;k.t(l,xx,y,8,k.L,{w:cw*.7});k.t(String((seed*17+i*11+s*7)%96),xx+cw,y,10,k.I,{a:'r',w:30,f:'bold'});k.segs(xx,y+14,cw,5,20,((seed+i*3+s)%10)/10,i===2?k.H:k.L,k.ia(.1),1);});}}
    if(big)end('FEED ACTIVITY / SIMULATED ANALYSIS / TAP A CHANNEL');
  }else if(mode==='game'){
    const st=d.st||{},inp=d.inp||{},v=st.vseed||0;k.t('SHELTER '+(st.shelter||9),12,34,small?19:25,k.I,{w:small?W-24:170,f:'disp'});if(!small){k.t('DAY '+(st.day||1)+' / '+(st.pop??'--')+' ADMITTED',W-12,39,11,k.L,{w:165,a:'r',f:'bold'});}dzShelterSection(k,12,small?61:70,small?W-24:big?W-24:190,big?153:65,v);
    const xx=big||small?12:218,yy=big?239:small?132:72,bw=W-xx-12;[['POWER',st.power,k.A],['FOOD',st.food,k.L],['MORALE',st.morale,k.L],['THREAT',st.threat,k.H]].slice(0,small?1:4).forEach(([l,n,c],i)=>{let y=yy+i*(big?24:18);k.t(l,xx,y,8,k.S,{w:bw*.7});k.t(n==null?'--':String(Math.round(n)),xx+bw,y,10,c,{a:'r',w:35,f:'bold'});k.segs(xx,y+12,bw,4,big?40:18,(n||0)/100,c,k.ia(.1),1);});if(big)end(inp.charging?'GRID RESTORED / CHARGING':'CHARGE THE PHONE TO RESTORE THE GRID');
  }
  dzSecondary(k,W,H,d);
}
function dzPoster(raw,W,H,d){
  const k=dzSafe(raw),home=d.mode==='home',n=d.index||0,kn=d.knobs||{},detail=kn.details!==false,top=home?Math.max(170,H*.205):Math.max(258,H*.305),bottom=H-108,span=bottom-top;
  k.rect(0,0,W,H,k.GR);const x=21,w=W-42;
  if(detail&&kn.texture!==0)dzTerminalBed(k,x-4,top,w+8,span,n+101,home?n+2:n,.9*(kn.texture??1));
  k.t('DIRECTIVE ZERO // OPERATOR TERMINAL',x,home?28:top-23,9,k.L,{w:W-90,f:'bold'});k.t('D-00',W-x,home?28:top-23,10,k.L,{w:45,a:'r',f:'bold'});
  if((kn.glow??1)>0)k.rect(x,top+27,w,span-34,k.a(T.altBg,.035*(kn.glow??1)));if(detail){for(let yy=top;yy<bottom&&kn.texture!==0;yy+=3)k.rect(x-7,yy,w+14,.45,k.ia(.045*(kn.texture??1)));for(let yy=top;yy<bottom;yy+=6){k.ln([[11,yy],[yy%4?14:18,yy]],k.L,.6);k.ln([[W-11,yy],[W-15,yy]],k.L,.6);}}
  k.poly([[x-5,top+8],[x+3,top],[W-x,top],[W-x+5,top+8],[W-x+5,bottom-8],[W-x-3,bottom],[x+3,bottom],[x-5,bottom-8]],null,k.a(T.altBg,.5),.8);
  if(!home){
    dzChip(k,'NOTICE',x,top+6,69,k.H);k.t('REF. D-00 / CYCLE '+(283+n),W-x,top+8,8,k.L,{a:'r',w:225});
    const phrase=d.phrase||['Remain','Calm'],fs=span*.155;k.t(d.upper===false?phrase[0]:phrase[0].toUpperCase(),x,top+29,fs,k.I,{w,f:'disp'});k.t(d.upper===false?phrase[1]:phrase[1].toUpperCase(),x,top+29+fs*1.04,fs,k.I,{w,f:'disp'});
    const yy=top+span*.405;k.rect(x,yy,w,3,k.L);k.rect(x,yy,44,3,k.H);k.t(['ACTIVE TIME REMAINING','AUTHORIZATION PENDING','BLACKOUT SEQUENCE','RECALL WINDOW'][n%4],x,yy+13,10,k.L,{w:230});k.t(['04:59:59','00:09:14','02:18:06','00:31:00'][n%4],x,yy+29,45,k.L,{w:w*.68,f:'bold'});dzHexField(k,W-x-101,yy+13,99,66,n);k.segs(x,yy+86,w,6,34,.73,i=>i>26?k.H:k.L,k.ia(.1),2);
    const gy=yy+114+Math.max(-6,Math.min(6,(kn.shift||0)*.1)),gh=span*.15*Math.max(.75,Math.min(1.12,kn.scale||1));
    if(n%5===0)dzRibbon(k,x+4,gy,w-8,gh,n);else if(n%5===1)dzConsensus(k,x+4,gy,w-8,gh,n);else if(n%5===2)dzWarningField(k,x+4,gy,w-8,gh,n);else if(n%5===3)dzSpectrum(k,x+4,gy,w-8,gh-12,n);else dzFan(k,x+4,gy,w-8,gh,n);
    if(detail){dzRegister(k,x,gy+gh+4,w,8,n,.6);k.t(['SYNCHRONIZATION / TEST RECORD','DEPARTMENTAL CONSENSUS / SIM','SHUTTER INTERLOCK / SIM','RECALL CARRIER / TEST SIGNAL','ACQUISITION / ROUTING SIM'][n%5],x,gy-13,8,k.L,{w});const ry=bottom-57;[['INTERNAL LINK','97.2%'],['REVIEW CLASS','A / 09'],['EXCEPTIONS','00.0%']].forEach(([label,value],i)=>{let xx=x+i*w/3;k.t(label,xx,ry,8,k.S,{w:w/3-6});k.t(value,xx,ry+14,21,i===2?k.H:k.I,{w:w/3-6,f:'bold'});});}
  }else{
    const labels=['PERIMETER AUTHORITY','AIR HANDLING CONTROL','CIVIL ALLOCATION','BROADCAST COMMAND','ACCESS INTERLOCK','RECORDS / SEALED'];
    dzChip(k,'S9 / CONTROL DESK',x,top+7,116,k.H);k.t('09 / '+String(n+1).padStart(2,'0'),W-x,top+8,11,k.L,{w:95,a:'r',f:'bold'});k.t(labels[n%6],x,top+31,23,k.I,{w,f:'disp'});
    const gy=top+80,gh=span*.49,sc=Math.max(.75,Math.min(1.1,kn.scale||1)),gw=Math.min(w-12,(w-25)*sc),xx=(W-gw)/2,yy=gy+Math.max(-7,Math.min(7,(kn.shift||0)*.15));
    if(n%6===0){dzRing(k,xx,yy,gw,gh,n,'D-00','REVIEW PENDING');if(detail){k.t('ANALYSIS',x+2,yy+gh*.33,7,k.L,{w:66});k.t('PENDING',x+2,yy+gh*.33+12,9,k.H,{w:66,f:'bold'});k.t('INTERNAL',W-x-62,yy+gh*.63,7,k.L,{w:66});k.t('ACCESS',W-x-62,yy+gh*.63+12,9,k.H,{w:66,f:'bold'});}}
    else if(n%6===1)dzFacility(k,xx,yy,gw,gh,1);
    else if(n%6===2)dzConsensus(k,xx,yy,gw,gh,n);
    else if(n%6===3)dzSpectrum(k,xx,yy,gw,gh-12,n);
    else if(n%6===4)dzWarningField(k,xx,yy,gw,gh,n);
    else dzSeal(k,xx,yy,gw,gh,11);
    const ay=top+span*.68;k.rect(x,ay,w,17,k.L);k.t(['CLEARANCE IS CONDITIONAL','RECIRCULATION IS MANDATORY','NO UNASSIGNED TIME','STAY ON THIS FREQUENCY','PERMISSION MAY BE REVOKED','RETENTION IS INDEFINITE'][n%6],x+5,ay+3,11,k.GR,{w:w-10,f:'bold'});
    if(detail){dzRegister(k,x,top+59,w,12,n,.64);const values=[['REVIEW / 09','18 OF 19','PENDING'],['FILTER / 03','004 HOURS','OVERDUE'],['CARDS / 144','003 HELD','NO REPLY'],['CARRIER / 09','REQUESTS','SUSPENDED'],['BOLT / 07','OVERRIDE','SEALED'],['FILES / 284','APPEALS','WITHHELD']][n%6];['AUTHORITY','INSTRUCTION','DISPOSITION'].forEach((label,i)=>dzRule(k,x,ay+25+i*24,w,label,values[i],i===2?k.H:k.I));const ly=ay+108,lh=bottom-ly-19;if(lh>12){if(n%6===0)dzHexField(k,x,ly,w,lh,n);else if(n%6===1)dzBand(k,x,ly,w,lh,48,n,k.A);else if(n%6===2){for(let i=0;i<15;i++)k.rect(x+i*w/15,ly,(w-28)/15,lh, i%4?k.a(T.altBg,.24):k.H);}else if(n%6===3)dzPacket(k,x,ly,w,lh,n);else if(n%6===4)dzBand(k,x,ly,w,lh,33,n,k.H);else{for(let i=0;i<6;i++){k.rect(x+i*w/6,ly,w/6-5,lh,null,k.L,.6);k.t('FILE '+(283+n*8+i),x+3+i*w/6,ly+3,7,k.L,{w:w/6-10});}}}}
  }
  k.stripes(x,bottom-9,w,4,k.L,8);k.t('REMAIN CALM. REMAIN INSIDE. / SIMULATED AGENCY DOCUMENT',x,bottom+7,8,k.L,{w});
}
