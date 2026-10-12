// Diegetic bureaucracy: fill unused layout regions with fictional corporate records.
// The occupancy map protects variable-length text, live timer bounds and instruments.
// Records are seeded artwork, never claims about a user's health or surveillance.
function hbImmersionBegin(c){
  const {k,W,H}=c,step=2,cols=Math.ceil(W/step),rows=Math.ceil(H/step),mask=new Uint8Array(cols*rows),saved={};
  const reserve=(x,y,w,h,p=2)=>{for(let yy=Math.max(0,Math.floor((y-p)/step));yy<Math.min(rows,Math.ceil((y+h+p)/step));yy++)for(let xx=Math.max(0,Math.floor((x-p)/step));xx<Math.min(cols,Math.ceil((x+w+p)/step));xx++)mask[yy*cols+xx]=1;};
  const wrap=(name,fn)=>{saved[name]=k[name];k[name]=function(...args){fn(...args);return saved[name].apply(k,args);};};
  wrap('t',(s,x,y,fs,col,o={})=>{const estimated=Array.from(String(s)).reduce((n,ch)=>n+(o.f==='disp'?(/[MW@]/.test(ch)?1:/[A-Z]/.test(ch)?.83:/[0-9]/.test(ch)?.72:/\s/.test(ch)?.36:.61):.7),0)*fs;reserve(x,y,Math.min(o.w||320,estimated),fs*1.25,fs>10?2.5:1.5);});
  wrap('rect',(x,y,w,h)=>reserve(x,y,w,h,.8));
  wrap('ln',(pts)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);reserve(Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1);});
  wrap('circ',(x,y,r)=>reserve(x-r,y-r,r*2,r*2,2));
  wrap('ell',(x,y,rx,ry)=>reserve(x-rx,y-ry,rx*2,ry*2,2));
  for(const name of ['grid','specimen','bar']){const original=c[name];c[name]=(...args)=>{const offset=name==='specimen'?1:0;reserve(...args.slice(offset,offset+4),2);return original(...args);};}
  if(c.d.mode==='shift'){const q=hbAllocationLayout(W,H);reserve(q.x,q.y,q.w,q.fs*1.45,2);}
  return {mask,cols,rows,reserve,finish(){for(const [name,fn]of Object.entries(saved))k[name]=fn;}};
}
const HB_RECORDS={
  status:['SUBJECT RECONCILIATION','IDENTITY DRIFT','PERSONHOOD / ON FILE','DUPLICATE SELF / HELD','BODY LEASE / 07','PRESENCE RECEIPT'],
  shift:['TEMPORAL CUSTODY','UNASSIGNED SECONDS','DEVIATION / BILLABLE','FREE WILL / DEFERRED','ATTENDANCE GHOST','MINUTE RECOVERY'],
  solar:['ATMOSPHERIC LICENCE','BREATH ALLOTMENT','AIRBORNE CONSENT','LUNG COMPATIBILITY','SKY ACCESS / LEASED','EXHALATION RETURN'],
  audio:['PACIFICATION INDEX','UNLICENSED SILENCE','LISTENER RESIDUE','MEMORY ATTENUATION','CHANNEL OBEDIENCE','EARPRINT / RETAINED'],
  transmission:['SEMANTIC RESIDUE','AUTHORSHIP ESCROW','THOUGHT CHECKSUM','UNSENT RESPONSE','MEANING / WITHHELD','PHRASE RECALL'],
  feeds:['NEURAL CUSTOMS','FOREIGN THOUGHT','INPUT QUARANTINE','COGNITIVE TARIFF','IDEA OWNERSHIP','PERSONALITY INGRESS'],
  youtube:['ATTENTION RECOVERY','GAZE ALLOTMENT','FRAME COMPLIANCE','BLINK COMPENSATION','CONTENT INOCULATION','RETINAL RECEIPT'],
  instagram:['PEER CALIBRATION','SOCIAL RESIDUE','COMPARISON DEBT','IMAGE CUSTODY','MEMORY LIEN','SELFHOOD RATIO'],
  discord:['COLLECTIVE CENSUS','BELONGING LICENCE','DISSENT LATENCY','CONSENSUS SHADOW','INDIVIDUALITY TAX','UNAPPROVED SOLITUDE'],
  oddity:['AFFECT RECONCILIATION','JOY WITHHOLDING','NOSTALGIA ARREARS','EMOTION INVENTORY','GRIEF EXEMPTION','FEELING ESCROW'],
  game:['MORPHOLOGY REVIEW','AUTONOMY THRESHOLD','TISSUE INVENTORY','NAMING REQUEST / HELD','OWNER RECOGNITION','DREAM DISPOSAL'],
  tracker:['REMOTE CUSTODY','PARALLAX DEBT','RETURN CLASSIFICATION','DISTANCE / PROPRIETARY','UNCLAIMED HORIZON','OBJECT INTENT']
};
// Each department starts with its own instrument, then traverses a nonrepeating set.
const HB_INSTRUMENTS={status:['trend','scatter','flow','matrix','phase','queue','scope','orbit','ledger','contour','gate','envelope'],shift:['queue','gate','phase','trend','flow','matrix','scope','ledger','orbit','scatter','envelope','contour'],solar:['envelope','contour','phase','scatter','trend','scope','matrix','orbit','gate','flow','queue','ledger'],audio:['scope','matrix','envelope','phase','gate','trend','scatter','flow','orbit','contour','queue','ledger'],transmission:['gate','flow','matrix','scope','contour','phase','queue','trend','scatter','envelope','orbit','ledger'],feeds:['phase','scope','flow','contour','scatter','gate','trend','envelope','matrix','queue','ledger','orbit'],youtube:['trend','queue','matrix','gate','scope','flow','phase','scatter','envelope','contour','ledger','orbit'],instagram:['scatter','trend','phase','matrix','queue','scope','contour','gate','flow','envelope','ledger','orbit'],discord:['flow','matrix','queue','scatter','orbit','gate','phase','scope','trend','contour','envelope','ledger'],oddity:['phase','contour','trend','scatter','envelope','flow','queue','gate','scope','matrix','orbit','ledger'],game:['contour','phase','envelope','flow','scope','matrix','scatter','queue','trend','gate','orbit','ledger'],tracker:['orbit','scatter','contour','phase','flow','scope','envelope','matrix','queue','gate','trend','ledger']};
function hbRecordInstrument(c,box,type,label,rnd){
  const {k,p}=c,{x,y,w,h}=box,ink=k.a(p.ink,.8),muted=k.a(p.ink,.37),accent=k.a(p.lilac,.95),paper=k.a(p.bg,1);
  if(w<80)label=label.split(' / ')[0].split(' ').map(s=>s[0]).join('.')+' / '+Math.floor(rnd()*255).toString(16).toUpperCase().padStart(2,'0');
  const t=(s,xx,yy,ww,fs=4.5,col=ink)=>hbFitText(k,s,xx,yy,fs,col,{w:ww,f:'mono'}),line=(pts,col=muted,lw=.5)=>k.ln(pts,col,lw);
  if(h<18){t(label,x,y,w);if(h>=12){const yy=y+9;line([[x,yy],[x+w,yy]]);for(let j=0;j<Math.floor(w/11);j++){const xx=x+j*11;if(type==='gate'||type==='matrix')k.rect(xx,yy-2,3,3,j%3?ink:accent);else line([[xx,yy-2-rnd()*2],[xx,yy+1]],j%4?muted:accent);}}return;}
  t(label,x,y,w);const bx=x+2,by=y+9,bw=w-4,bh=h-11;
  const grid=()=>{for(let j=0;j<=4;j++){const yy=by+bh*j/4;line([[bx,yy],[bx+bw,yy]],k.a(p.ink,.13),.35);}};
  if(type==='ledger'){k.rect(x,y,w,7,ink);t(label,x+2,y+.5,w-4,4.5,paper);for(let j=0;j<Math.floor(bh/7);j++){t(['RETAIN / 07','ESCROW / 31','APPEAL / 00','SEALED / 92'][j%4],bx,by+j*7,bw*.67);line([[bx+bw*.72,by+j*7+3],[bx+bw,by+j*7+3]],j%2?ink:accent,1);}return;}
  if(type==='matrix'){const rows=Math.min(7,Math.max(2,Math.floor(bh/4))),cols=Math.min(35,Math.floor(bw/3));for(let r=0;r<rows;r++)for(let j=0;j<cols;j++){const v=rnd();k.rect(bx+j*bw/cols,by+r*bh/rows,bw/cols-.7,bh/rows-.7,k.a(v>.86?p.lilac:p.ink,.1+v*.65));}return;}
  if(type==='queue'){grid();for(let j=0;j<3;j++){const yy=by+j*bh/3;for(let i=0;i<5;i++){const xx=bx+i*bw/5+rnd()*bw/25,len=bw/5*(.25+rnd()*.55);k.rect(xx,yy+1,len,Math.max(1,bh/3-2),j===1?accent:k.a(p.ink,.27+j*.18));}}line([[bx+bw*.63,by],[bx+bw*.63,by+bh]],ink,.7);return;}
  if(type==='gate'){const pts=[];for(let j=0;j<24;j++){const xx=bx+j*bw/24,v=rnd()>.5?by+1:by+bh-1;pts.push([xx,v],[xx+bw/24,v]);}line(pts,ink,.7);line([[bx,by+bh*.5],[bx+bw,by+bh*.5]],accent,.4);return;}
  if(type==='scatter'){grid();line([[bx,by+bh],[bx+bw,by]],muted);for(let j=0;j<26;j++){const u=rnd(),v=Math.max(.06,Math.min(.94,1-u+(rnd()-.5)*.7));k.circ(bx+u*bw,by+v*bh,j%5===0?1.6:.7,j%5===0?accent:ink);}return;}
  if(type==='flow'){const pts=Array.from({length:9},(_,j)=>[bx+2+(bw-4)*j/8,by+2+(bh-4)*(.15+rnd()*.7)]);pts.forEach((pt,j)=>{if(j)line([pts[j-1],pt],ink,.6);if(j>2)line([pts[j-3],pt]);k.rect(pt[0]-1.3,pt[1]-1.3,2.6,2.6,j%3?paper:accent,ink,.5);});return;}
  if(type==='orbit'){const cx=bx+bw*.46,cy=by+bh/2;for(let j=1;j<4;j++)k.ell(cx,cy,bw*.145*j,bh*.14*j,null,j===2?accent:muted,.5);line([[bx,cy],[bx+bw,cy]]);line([[cx,by],[cx,by+bh]]);k.circ(cx,cy,1.5,ink);for(let j=0;j<3;j++){const a=j*2.1+.6;k.rect(cx+Math.cos(a)*bw*.3-1.5,cy+Math.sin(a)*bh*.28-1.5,3,3,accent,ink,.5);}return;}
  if(type==='phase'){const cx=bx+bw*.28,cy=by+bh/2,rx=Math.min(bw*.22,bh*.75),ry=bh*.43;for(let j=1;j<=3;j++)k.ell(cx,cy,rx*j/3,ry*j/3,null,muted,.4);const pts=[];for(let j=0;j<6;j++){const a=j*Math.PI/3,v=.4+rnd()*.6;pts.push([cx+Math.cos(a)*rx*v,cy+Math.sin(a)*ry*v]);}k.poly(pts,k.a(p.lilac,.23),accent,.8);for(let j=0;j<Math.max(1,Math.floor(bh/7));j++)t(['AXIS 04 / HELD','DRIFT 0.031','EGO / LEASED','REF. 2893'][j%4],bx+bw*.58,by+j*7,bw*.42,4.2);return;}
  if(type==='contour'){for(let j=0;j<7;j++){const pts=[];for(let i=0;i<=32;i++){const u=i/32;pts.push([bx+u*bw,by+bh*(.07+j*.13)+Math.sin(u*9+j*.55)*bh*.07]);}line(pts,j===3?accent:muted,j===3?.8:.45);}return;}
  grid();const curves=type==='scope'?3:type==='envelope'?2:1;
  for(let j=0;j<curves;j++){const pts=[];for(let i=0;i<=50;i++){const u=i/50;let v;if(type==='trend')v=.22+u*.55+(rnd()-.5)*.15;else if(type==='envelope')v=.5+(j?1:-1)*Math.sin(u*Math.PI)*(.2+Math.sin(u*12)*.12);else v=.5+Math.sin(u*(25+j*7)+j)*Math.sin(u*4+j)*.37;pts.push([bx+u*bw,by+bh*Math.max(.03,Math.min(.97,v))]);}line(pts,j?accent:ink,j?.55:.85);if(type==='trend')k.rect(bx+bw-2,pts[pts.length-1][1]-1,2,2,accent);}
}
function hbImmersionFinish(c,state){
  state.finish();const {k,W,H,d,p}=c,{mask,cols,reserve}=state,lex=HB_RECORDS[d.mode]||HB_RECORDS.status;
  const seed=Math.abs(d.seed||0)+Object.keys(HB_RECORDS).indexOf(d.mode)*311,rnd=k.rng(seed+2893),rule=k.a(p.ink,.3);
  // Edge registration and filing rails occupy the space around the primary fields.
  for(let y=27;y<H-23;y+=5){k.ln([[4,y],[y%15===2?9:7,y]],rule,.6);k.rect(W-7,y,2,y%20===7?3:1,k.a(p.lilac,.75));}
  const serial=()=>Math.floor(rnd()*65535).toString(16).toUpperCase().padStart(4,'0');
  let count=0;
  // Greedy largest-empty rectangles. No paint may enter reserved primary content.
  while(count<65){
    let best=null;const heights=new Uint16Array(cols);
    for(let yy=14;yy<Math.floor((H-23)/2);yy++){
      for(let xx=6;xx<Math.floor((W-12)/2);xx++)heights[xx]=mask[yy*cols+xx]?0:heights[xx]+1;
      const stack=[];const end=Math.floor((W-12)/2);
      for(let xx=6;xx<=end;xx++){const height=xx===end?0:heights[xx];let start=xx;while(stack.length&&stack[stack.length-1].h>height){const a=stack.pop(),w=(xx-a.x)*2,h=a.h*2;start=a.x;if(w>=28&&h>=8){const score=w*Math.min(h,56);if(!best||score>best.score)best={x:a.x*2,y:(yy-a.h+1)*2,w,h,score};}}if(!stack.length||stack[stack.length-1].h<height)stack.push({x:start,h:height});}
    }
    if(!best)break;
    const {x,y,w}=best,h=Math.min(best.h,56),i=count++,label=lex[i%lex.length],id=serial();reserve(x,y,w,h,1);
    const types=HB_INSTRUMENTS[d.mode]||HB_INSTRUMENTS.status;
    hbRecordInstrument(c,{x,y,w,h},types[i%types.length],label+(w>130?' / '+id:''),rnd);
  }
}
