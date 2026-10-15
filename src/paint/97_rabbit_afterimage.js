const WR_SPRITES = {
 mask: ['mask',0,0,1,1],
 vault: ['vault',0,0,1,1],
 edge: ['edge',0,0,1,1],
 audio: ['audio',0,0,1,1],
 warren: ['warren',0,0,1,1],
 lot01: ['lot01',0,0,1,1],
 lot02: ['lot02',0,0,1,1],
 lot03: ['lot03',0,0,1,1],
 lot04: ['lot04',0,0,1,1],
 lot05: ['lot05',0,0,1,1],
 lot06: ['lot06',0,0,1,1],
 lot07: ['lot07',0,0,1,1],
 lot08: ['lot08',0,0,1,1],
 lot09: ['lot09',0,0,1,1],
 lot10: ['lot10',0,0,1,1],
 lot11: ['lot11',0,0,1,1],
 lot12: ['lot12',0,0,1,1],
 cover: ['cover',0,0,1,1],
 invite: ['invite',0,0,1,1]
};
const WR_ASPECT = {"audio": 1.5, "cover": 1.5, "edge": 1.5, "invite": 0.6666666666666666, "lot01": 1.0, "lot02": 1.0, "lot03": 1.0, "lot04": 1.0, "lot05": 1.0, "lot06": 1.0, "lot07": 1.0, "lot08": 1.0, "lot09": 0.6666666666666666, "lot10": 2.0, "lot11": 0.8002853067047075, "lot12": 1.0, "mask": 1.5, "vault": 1.0, "warren": 1.5};
function wrArt(k,key,x,y,w,h){const im=T.wrImages&&T.wrImages[key];if(!im)return false;const ratio=WR_ASPECT[key]||1,dw=Math.min(w,h*ratio),dh=dw/ratio;k.dc.drawImageInRect(im,new Rect(x+(w-dw)/2,y+(h-dh)/2,dw,dh));return true;}
function wrMask(k,x,y,w,h){if(!wrArt(k,'mask',x,y,w,h))wrMaskVector(k,x,y,w,h);}
// White Rabbit / Afterimage: an opt-in enhancement of the original pearl-and-lilac heist world.
const WR_META={status:'The Job',shift:'Getaway',solar:'Cover Watch',audio:'Getaway Mix',transmission:'Calling Card',feeds:'Two Marks',youtube:'Surveillance Reel',instagram:'The Marks',discord:'The Warren',oddity:'Heist Board',game:'The Long Con'};
const WR_LOTS=[
 ['The Gala Necklace','AUREL / EAST WING','PEARL / OPEN COLLAR','Ownership under revision.'],
 ['The Jeweled Egg','PRIVATE VAULT 03','ENAMEL / CRYSTAL CORE','The original is elsewhere.'],
 ["The Ambassador's Ring",'NIGHT CARRIAGE','PEARL / SIGNET','Diplomatic silence included.'],
 ['The Crown Nobody Wears','THE AUCTION HOUSE','CERAMIC / SWEPT POINTS','Reserve price: discretion.'],
 ['The Clockwork Brooch','GLASS WALK','KINETIC / WINGED PIN','Still moves without permission.'],
 ['The Pearl Compass','THE OBSERVATORY','NACRE / FIELD KEY','Always points away from home.'],
 ['The Seventh Heirloom','LOCATION WITHHELD','CLASSIFICATION DISPUTED','Six witnesses. Seven accounts.'],
 ['The Cut Emerald','SILENT GALLERY','BERYL / STEP CUT','A very expensive vacancy.'],
 ['The Ivory Scepter','WINTER SALON','SYNTHETIC IVORY / INLAY','No sovereign attached.'],
 ['The Glass Tiara','BALCONY 04','OPTICAL GLASS / SHARD SET','Light passes. Title does not.'],
 ['The Lacquer Key','ARCHIVE ANNEX','CARBON / UNIQUE WARD','Every copy is the original.'],
 ['The Folded Seal','THE PRIVATE BOX','FOLDED FOIL / SECRET SEAL','Provenance folded inward.']
];
const WR_VENUES=['AUREL / EAST WING','PRIVATE VAULT 03','NIGHT CARRIAGE','THE AUCTION HOUSE','GLASS WALK','THE OBSERVATORY','LOWER ARCHIVE','WINTER SALON','BALCONY 04','LIFT / SERVICE ONLY','ROOFTOP TRANSFER','SAFEHOUSE / UNLISTED'];
const WR_JOBS=[['THE GALA NECKLACE','EAST WING','VELVET / SILK','A borrowed invitation.'],['THE JEWELED EGG','VAULT 03','CIPHER / GILT','Nothing on the inventory.'],['THE AMBASSADOR RING','NIGHT CARRIAGE','NOCTURNE / SILK','Alibi arrives first.'],['THE CROWN NOBODY WEARS','AUCTION HOUSE','MONOCLE / VELVET','The winning bid was silence.'],['CLOCKWORK BROOCH','GLASS WALK','GILT / CIPHER','One reflection too many.'],['THE PEARL COMPASS','OBSERVATORY','SILK / NOCTURNE','A cloudy ownership history.'],['SEVENTH HEIRLOOM','LOCATION WITHHELD','CELL 07 / SEALED','The seventh copy is missing.'],['THE CUT EMERALD','SILENT GALLERY','VELVET / GILT','The plinth stays.'],['THE IVORY SCEPTER','WINTER SALON','CIPHER / MONOCLE','No throne required.'],['THE GLASS TIARA','BALCONY 04','NOCTURNE / VELVET','Gala dress. Clean hands.']];
function wrSlot(d){return Math.abs(Math.floor(Number.isFinite(d.seed)?d.seed:+(d.now||new Date())/1800000));}
function wrSafe(raw){const k={...raw};k.t=(text,x,y,size,col,o={})=>{const s=String(text),w=o.w||300,f=o.f||'mono';raw.t(s,x,y,Math.min(size,w/Math.max(1,s.length*(f==='disp'?.61:.62))),col,{...o,nofit:true});};k.para=(text,x,y,w,fs,col,f='disp',max=3,lh=1.13,height=Infinity)=>{let ls=[];for(let n=0;n<120;n++){const cap=Math.max(1,Math.floor(w/(fs*(f==='disp'?.61:.62))));ls=[];let cur='';for(const word of String(text).split(/\s+/)){if(cur&&(cur+' '+word).length>cap){ls.push(cur);cur=word;}else cur+=(cur?' ':'')+word;}if(cur)ls.push(cur);if(ls.length<=max&&ls.every(s=>s.length<=cap)&&fs*((ls.length-1)*lh+1.45)<=height)break;fs*=.96;}ls.forEach((s,i)=>k.t(s,x,y+i*fs*lh,fs,col,{f,w}));return ls.length*fs*lh;};return k;}
function wrRound(k,x,y,w,h,r,fill,stroke,lw=.65){const p=new Path(),P=(a,b)=>new Point(a,b);p.move(P(x+r,y));p.addLine(P(x+w-r,y));p.addQuadCurve(P(x+w,y+r),P(x+w,y));p.addLine(P(x+w,y+h-r));p.addQuadCurve(P(x+w-r,y+h),P(x+w,y+h));p.addLine(P(x+r,y+h));p.addQuadCurve(P(x,y+h-r),P(x,y+h));p.addLine(P(x,y+r));p.addQuadCurve(P(x+r,y),P(x,y));p.closeSubpath();if(fill){k.dc.addPath(p);k.dc.setFillColor(fill);k.dc.fillPath();}if(stroke){k.dc.addPath(p);k.dc.setStrokeColor(stroke);k.dc.setLineWidth(lw);k.dc.strokePath();}}
function wrSpace(k,x,y,w,h){const s=Math.min(w,h)/100,ox=x+(w-100*s)/2,oy=y+(h-100*s)/2;return {...k,poly:(ps,f,c,l=.7)=>k.poly(ps.map(p=>[ox+p[0]*s,oy+p[1]*s]),f,c,l*s),ln:(ps,c,l=.7)=>k.ln(ps.map(p=>[ox+p[0]*s,oy+p[1]*s]),c,l*s),circ:(cx,cy,r,f,c,l=.7)=>k.circ(ox+cx*s,oy+cy*s,r*s,f,c,l*s),ell:(cx,cy,rx,ry,f,c,l=.7)=>k.ell(ox+cx*s,oy+cy*s,rx*s,ry*s,f,c,l*s),rect:(xx,yy,ww,hh,f,c,l=.7)=>k.rect(ox+xx*s,oy+yy*s,ww*s,hh*s,f,c,l*s)};}
function wrFoil(k,x,y,w,h,seed=0){for(let i=0;i<60;i++){const q=i/60;k.rect(x+q*w,y,w/60+.1,h,k.a(i%13<2?T.accent:T.headBg,.12+.26*Math.pow(Math.sin(q*Math.PI*3+seed),2)));}for(let j=0;j<4;j++)k.ln([[x,y+h*(j+1)/5],[x+w,y+h*(j+1)/5]],k.ia(.11),.3);}
function wrGuilloche(k,x,y,w,h,seed=0,col){for(let j=0;j<17;j++){const p=[];for(let i=0;i<=120;i++){let a=i/120*Math.PI*2,r=.68+.17*Math.cos(a*(5+seed%4)+j*.12);p.push([x+w/2+Math.cos(a)*w*.47*r*(1-j*.013),y+h/2+Math.sin(a)*h*.47*r*(1-j*.013)]);}k.ln(p,col||k.a(j%3?T.headBg:T.accent,.36),.32);}}
function wrMicro(k,x,y,w,h,seed,kind=0){const words=[['SERIGRAPH','BLIND EMBOSS','FOIL PASS','NO RECORD'],['EXIT SLIP','PUNCHED','RELEASE','DO NOT KEEP'],['EXPOSURE','SHUTTER','COVER','AFTER DARK'],['SIDE A','SILENT CUT','GROOVE','REWIND'],['PRINT RUN','COPYCAT','WATERMARK','SEAL'],['CUSTODY','LOT','RECEIPT','NO OWNER']][kind%6];for(let j=0;j<Math.floor(h/9);j++){const word=words[(j+seed)%4];k.t(word+' / '+String((seed*37+j*19)%997).padStart(3,'0')+'   07-'+String(j+1).padStart(2,'0'),x,y+j*9,4.8,k.ia(.58),{w});} }
function wrSeal(k,x,y,r,n=7){wrGuilloche(k,x-r,y-r,r*2,r*2,n,k.a(T.headBg,.68));k.circ(x,y,r*.65,null,k.ia(.6),.6);k.t(String(n).padStart(2,'0'),x,y-r*.32,r*.56,k.I,{a:'c',w:r,f:'disp'});}

// The illustrated signature uses smooth printed curves, including when hosted art is unavailable.
function wrHeart(k,x,y,r,col){const p=new Path(),P=(a,b)=>new Point(x+a*r,y+b*r);p.move(P(0,.85));p.addQuadCurve(P(-.85,-.12),P(-1.3,-.48));p.addQuadCurve(P(0,-.42),P(-.44,-1.1));p.addQuadCurve(P(.85,-.12),P(.6,-1.1));p.addQuadCurve(P(0,.85),P(.9,.3));k.dc.addPath(p);k.dc.setStrokeColor(col);k.dc.setLineWidth(Math.max(.45,r*.1));k.dc.strokePath();}
function wrGlint(k,x,y,r,col){const p=new Path(),P=(a,b)=>new Point(x+a*r,y+b*r);p.move(P(0,-1.4));p.addQuadCurve(P(.8,0),P(.12,-.1));p.addQuadCurve(P(0,1.4),P(.12,.1));p.addQuadCurve(P(-.8,0),P(-.12,.1));p.addQuadCurve(P(0,-1.4),P(-.12,-.1));p.closeSubpath();k.dc.addPath(p);k.dc.setFillColor(col);k.dc.fillPath();}
function wrPrintPattern(k,x,y,w,h,seed=0){for(let row=0;row<Math.floor(h/24);row++)for(let col=0;col<Math.floor(w/30);col++){const px=x+col*30+(row%2?13:0)+5,py=y+row*24+7;if(px>x+w-4)continue;const n=(row*3+col+seed)%6;if(n===0)wrHeart(k,px,py,2.5,k.a(T.accent,.13));else if(n===3)wrGlint(k,px,py,1.8,k.a(T.headBg,.23));}}

// Pixel serigraphy is decorative print, never invented sensor or progress data.
// Keep the flowing raster illustrations intact; these marks are shared by browser and native widgets.
function wrPixelGlyph(k,name,x,y,p,col){
 const glyphs={heart:['01100110','10011001','10000001','01000010','00100100','00011000'],glint:['0001000','0001000','0011100','1111111','0011100','0001000','0001000'],key:['011100000','110110000','100010000','110111111','011100101'],diamond:['0001000','0010100','0100010','1000001','0100010','0010100','0001000'],arrow:['0001000','0001100','1111110','0001100','0001000'],seal:['1110111','1010101','1110111','0001000','1110111','1010101','1110111']};
 const rows=glyphs[name]||glyphs.glint;rows.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='1')k.rect(x+i*p,y+j*p,p*.84,p*.84,col);});
}
function wrPixelWeave(k,x,y,w,h,seed=0,kind=0,opacity=.48){
 const p=w>240?3:w>110?2.6:1.9,cols=Math.floor(w/p),rows=Math.floor(h/p),bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
  const u=(i+.5)/cols,v=(j+.5)/rows,dx=u-.5,dy=v-.5,phase=(seed%12)*.37;
  let strength=0;
  if(kind===0){const r=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx);strength=Math.max(0,1-Math.abs(r-.39)*14)*(.3+.6*Math.pow(Math.sin(a*3+phase),2));}
  if(kind===1){const q=Math.abs(v-(.88-u*.78));strength=Math.max(0,1-q*8)*(.4+.55*Math.pow(Math.sin(u*10+phase),2));}
  if(kind===2){const q=(i+j*2+seed)%17;strength=(q<4?.55:.12)*(.2+u*.8)*(.4+.6*Math.sin(v*Math.PI));}
  if(kind===3){const track=j%5,phrase=(i*3+Math.floor(j/5)*7+seed)%19;strength=track<2&&phrase<8?.78:track===4?.12:0;}
  if(kind===4){const step=Math.floor(i/4),edge=.18+((step*7+seed)%11)/18;strength=v>edge?Math.min(.85,(v-edge)*2.4):.03;}
  if(kind===5){const r=Math.abs(dx)+Math.abs(dy),band=(Math.floor(r*18)+seed)%5;strength=r<.63&&r>.16?(band<2?.72:.13):0;}
  if(kind===6){const a=Math.abs(v-(.48+Math.sin(u*8+phase)*.27));strength=Math.max(0,1-a*11)*(.3+u*.65);}
  const threshold=(bayer[(i%4)+(j%4)*4]+.5)/16;
  if(strength>threshold){const tint=(i*7+j*3+seed)%19===0?T.accent:T.headBg;k.rect(x+i*p,y+j*p,p*.8,p*.8,k.a(tint,opacity*(.55+.45*strength)));}
 }
}
function wrPunchSlip(k,x,y,w,h,seed=0){
 k.ln([[x,y+h],[x+w,y+h]],k.a(T.headBg,.65),.4);
 const p=2,cols=Math.floor(w/4);for(let i=0;i<cols;i++){k.rect(x+i*4,y,1.1,1.1,k.ia(.3));for(let row=0;row<Math.floor((h-3)/3);row++)if((i*7+row*11+seed)%13<5)k.rect(x+i*4,y+3+row*3,p,p,k.a(row%2?T.accent:T.headBg,row%2?.48:.68));}
}
function wrWidgetPrint(k,W,H,d){
 const small=W<200,big=H>200,seed=wrSlot(d),m=d.mode;
 if(m==='status'){
  wrPixelWeave(k,small?13:12,small?36:36,small?65:125,small?66:96,seed,0,.65);
  wrPunchSlip(k,small?14:17,small?110:123,small?59:112,small?9:7,seed);
  const xx=small?86:145;k.t('BLIND EMBOSS / 07',xx,small?89:97,4.7,k.a(T.ink,.58),{w:small?68:141});
  wrPixelGlyph(k,'key',W-32,small?89:97,.8,k.a(T.accent,.55));
  if(big){wrPunchSlip(k,14,149,122,9,7);k.t('ADMISSION / PERFECT COPY',158,151,5,k.S,{w:190});wrPixelWeave(k,117,218,126,95,seed,5,.35);}
 }
 if(m==='shift'){
  wrPixelWeave(k,14,small?51:45,small?64:126,small?32:big?120:94,seed,1,.7);
  if(!small)k.t('EXIT SLIP / DESTROY AFTER USE',14,36,4.3,k.S,{w:126});
  wrPunchSlip(k,14,small?138:big?174:134,small?142:122,small?5:7,seed+5);
  if(big){wrPixelGlyph(k,'arrow',319,222,2.1,k.a(T.accent,.48));wrPixelWeave(k,244,245,106,88,seed,4,.18);}
 }
 if(m==='solar'){
  wrPixelWeave(k,small?90:151,44,small?65:198,small?61:76,seed,2,.75);
  if(!small){wrPunchSlip(k,151,115,198,7,3);if(big){k.t('EXPOSURE PRINT / LIGHT IS EVIDENCE',14,155,5.3,k.S,{w:336});wrPixelGlyph(k,'diamond',328,152,1.1,k.a(T.accent,.65));}}
 }
 if(m==='audio'){
  wrPixelWeave(k,14,small?39:40,small?142:128,small?63:94,seed,3,.65);
  if(!small)wrPunchSlip(k,17,135,121,7,seed);
  if(big){wrPixelWeave(k,14,204,336,68,seed,3,.7);wrPixelGlyph(k,'glint',322,180,1.5,k.A);}
 }
 if(m==='discord'){
  wrPixelWeave(k,14,40,small?142:158,big?134:80,seed,4,.6);
  if(big){for(let i=0;i<5;i++){const xx=14+i*68;wrPixelGlyph(k,['heart','key','glint','diamond','seal'][i],xx+42,228,1.15,k.a(T.headBg,.7));}}
 }
 if(m==='oddity'){
  wrPixelWeave(k,14,small?49:37,small?57:117,small?60:big?170:104,seed,5,.6);
  if(small)wrPunchSlip(k,14,136,142,7,seed);else{wrPunchSlip(k,147,119,194,4,seed);if(big){wrPunchSlip(k,14,210,336,9,seed);wrPixelWeave(k,246,229,93,90,seed,0,.45);}}
 }
 if(m==='game'){
  const st=d.st||{},heat=Math.max(0,Math.min(100,Number(st.heat)||0)),taken=Math.max(0,Math.min(7,Number(st.taken)||0));
  if(small){wrPixelWeave(k,91,47,64,61,taken,5,.55);for(let i=0;i<28;i++)k.rect(14+i*5,136,3,4,k.a(i/28<heat/100?T.accent:T.headBg,i/28<heat/100?.65:.25));}
  else{for(let i=0;i<7;i++)wrPixelGlyph(k,i<taken?'glint':'diamond',14+i*17,99,.9,k.a(i<taken?T.accent:T.headBg,.7));if(big){wrPixelWeave(k,14,158,336,96,taken,6,.38);for(let i=0;i<42;i++)k.rect(14+i*8,263,5,3,k.a(i/42<heat/100?T.accent:T.headBg,i/42<heat/100?.65:.25));}}
 }
}

// Revision 6: personal print matter. These are ornamental proofs, never sensor readings.
function wrSilkLines(k,x,y,w,h,kind=0,alpha=.43){
 const dept=k.wrDepartment,ink=k.a(T.headBg,alpha),fine=k.a(T.ink,alpha*.35),pink=k.a(T.accent,alpha*.5);
 if(dept==='status'){for(let j=0;j<Math.floor(w/29);j++){const cx=x+14+j*29;for(let z=0;z<5;z++)k.ell(cx,y+h*.5,11-z*1.3,h*(.37-z*.045),null,z%3?ink:fine,.3);k.rect(cx-1,y+h*.44,2,2,pink);}return;}
 if(dept==='shift'){for(let j=0;j<14;j++){const t=j/13;k.ln([[x+w*t,y+h*.85],[x+w*(.25+t*.65),y+h*.12],[x+w*(.4+t*.6),y+h*.85]],j%4?ink:pink,.3);}return;}
 if(dept==='solar'){for(let j=0;j<Math.floor(w/6);j++){const xx=x+j*6;k.poly([[xx,y+h*.8],[xx+2,y+h*.12],[xx+4,y+h*.8]],null,j%5?ink:pink,.3);if(j%4===0)k.rect(xx+1,y+h*.9,1,1,fine);}return;}
 if(dept==='audio'){for(let j=0;j<Math.floor(w/36);j++){const xx=x+17+j*36;for(let z=0;z<5;z++)k.ell(xx,y+h*.5,15-z*2,h*(.43-z*.06),null,z%3?ink:pink,.3);k.circ(xx,y+h*.5,.8,fine);}return;}
 if(dept==='feeds'){for(let j=0;j<Math.floor(w/7);j++){const xx=x+j*7;k.rect(xx,y+1,4,h-2,null,ink,.3);if(j%3)k.rect(xx+1,y+3,1.2,Math.max(1,h-6),j%4?ink:pink);}return;}
 if(dept==='youtube'){for(let j=0;j<Math.floor(w/17);j++){const xx=x+7+j*17;k.ln([[xx-3,y+h*.5],[xx+3,y+h*.5]],ink,.3);k.ln([[xx,y+h*.5-3],[xx,y+h*.5+3]],ink,.3);if(j%3===0)k.circ(xx,y+h*.5,4,null,pink,.3);}return;}
 if(dept==='instagram'){for(let j=0;j<Math.floor(w/23);j++){const xx=x+11+j*23;k.poly([[xx-10,y+h*.5],[xx-5,y+1],[xx+5,y+1],[xx+10,y+h*.5],[xx,y+h-1]],null,ink,.3);k.ln([[xx-5,y+1],[xx,y+h-1],[xx+5,y+1]],fine,.3);k.ln([[xx-10,y+h*.5],[xx+10,y+h*.5]],pink,.3);}return;}
 if(dept==='oddity'){for(let j=0;j<Math.floor(w/14);j++){const xx=x+j*14;k.poly([[xx,y+h-1],[xx+6,y+1],[xx+12,y+h-1]],null,ink,.3);k.ln([[xx+6,y+1],[xx+6,y+h-1]],pink,.3);}return;}
 if(dept==='game'){for(let j=0;j<7;j++){const xx=x+j*w/7;k.rect(xx+2,y+1,w/7-5,h-2,null,ink,.3);k.t(String(j+1).padStart(2,'0'),xx+w/14,y+h*.25,Math.min(6,h*.5),fine,{a:'c',w:w/7-7});}return;}

 for(let j=0;j<18;j++){const ps=[];for(let i=0;i<=68;i++){const t=i/68,v=j/17;
  let py=kind===0?(v*.22+.58*Math.pow(Math.sin(t*Math.PI),2)+.14*t):kind===1?(v*.28+t*.48+.12*Math.sin(t*9+v*2)):kind===2?(.5+(v-.5)*Math.sin(t*Math.PI)*.84):(.18+v*.38+.2*Math.sin(t*7+v));
  ps.push([x+t*w,y+py*h]);}
  k.ln(ps,k.a(j%5?T.headBg:T.accent,alpha*(j%5?1:.5)),.35);
 }
}
function wrFineType(k,text,x,y,w,accent=false){k.t(text,x,y,4.7,accent?k.a(T.accent,.8):k.ia(.55),{w});}
function wrStitch(k,x,y,w,seed=0){for(let i=0;i<w/5;i++){const xx=x+i*5;k.ln([[xx,y],[xx+2,y+2],[xx+4,y]],k.a(i%7?T.headBg:T.accent,.65),.45);if((i+seed)%6===0)k.rect(xx+1,y+4,1,1,k.ia(.36));}}
function wrProofColumns(k,x,y,w,h,kind){const words=[['GUEST COPY','ADMISSION','BLIND FOLD','NO HOST'],['CUT PROOF','SELVEDGE','SOFT EXIT','NO TRACE'],['HALF TONE','PEARL INK','EXPOSURE','AFTERGLOW'],['SIDE B','QUIET PRESS','SOFT REPEAT','NO CREDIT'],['PRINT RUN','COPYRIGHT?','AFTERIMAGE','UNSIGNED'],['CELL POST','RETURNED','FORWARDED','NO ADDRESS']][kind%6];
 const cols=w>200?4:w>100?3:2,cw=w/cols;for(let i=0;i<cols;i++){k.ln([[x+i*cw,y],[x+i*cw,y+h]],k.a(T.headBg,.5),.4);for(let j=0;j<Math.floor(h/8);j++)wrFineType(k,words[(i+j)%4],x+i*cw+3,y+j*8+1,cw-6,(i+j)%5===0);}
}
function wrPaperDetail(k,W,H,d){
 const small=W<200,big=H>200,m=d.mode,seed=wrSlot(d),w=W-28;
 // Each department owns a different ornamental margin and proof rhythm.
 if(m!=='transmission'){
  const style=Object.keys(WR_META).indexOf(m);for(let i=0;i<Math.floor((H-64)/8);i++){const yy=34+i*8;if(style%3===0)k.ln([[8,yy],[10+(i%4),yy+2]],k.a(T.headBg,.65),.45);else if(style%3===1)k.rect(8,yy,1.3,i%3?1.3:4,k.a(T.accent,.28));else k.circ(9,yy,1,null,k.a(T.headBg,.65),.4);k.rect(W-10,yy,1,i%5?1:4,k.ia(.2));}
 }
 if(m==='status'){
  wrSilkLines(k,small?79:144,small?80:80,small?78:204,small?17:24,2,.29);
  if(small){wrFineType(k,'PRIVATE / BY INVITATION',80,117,76);wrStitch(k,15,121,60,1);}
  else{wrFineType(k,'FOLD 01 / PERSONAL COPY',147,119,148);wrStitch(k,267,140,82,2);}
  if(big){wrSilkLines(k,141,148,205,22,0,.6);wrStitch(k,15,189,333,3);wrFineType(k,'A PERFECTLY ORDINARY GUEST.',15,321,230,true);}
 }
 if(m==='shift'){
  if(small){wrSilkLines(k,86,72,69,15,1,.26);}
  else{wrSilkLines(k,158,73,190,big?35:15,1,.3);wrFineType(k,'EXIT COPY / NO FORWARDING ADDRESS',158,big?157:79,190);}
  if(big){wrStitch(k,15,236,334,2);wrFineType(k,'SELVEDGE / LEFT BEHIND',15,228,180,true);wrSilkLines(k,245,322,104,25,2,.55);}
 }
 if(m==='solar'){
  wrSilkLines(k,small?88:150,small?96:big?146:103,small?66:198,small?26:big?17:10,2,.58);
  if(small)wrFineType(k,'EXPOSURE / PEARL PRINT',88,130,68);
  else wrFineType(k,'LIGHT LEAK / PRINT PROOF',151,138,198);
  if(big){wrStitch(k,15,163,334,4);wrSilkLines(k,15,317,334,15,3,.5);}
 }
 if(m==='audio'){
  if(small){wrSilkLines(k,15,87,140,20,2,.6);wrFineType(k,'PRESSED IN SILENCE / 07',16,102,140,true);}
  else{wrSilkLines(k,157,106,191,19,0,.5);wrFineType(k,'NO APPLAUSE / PLEASE',157,140,191);}
  if(big){wrProofColumns(k,15,142,130,18,3);wrSilkLines(k,15,177,334,20,2,.45);wrStitch(k,15,290,334,3);wrStitch(k,15,347,334,7);}
 }
 if(m==='feeds'){
  wrProofColumns(k,15,big?339:small?128:131,w,big?13:16,4);
  if(big){wrSilkLines(k,15,239,161,12,2,.6);wrSilkLines(k,190,239,160,12,0,.6);wrStitch(k,15,270,161,3);wrStitch(k,190,270,160,8);}
 }
 if(m==='youtube'){
  wrStitch(k,15,big?237:123,w,seed);if(!small&&!big)wrFineType(k,'FRAME EDGE / OPTICAL COPY / ARCHIVE 07',15,141,w);
  if(big){wrSilkLines(k,15,285,145,13,1,.6);wrSilkLines(k,193,313,155,13,0,.6);wrStitch(k,15,344,334,11);}
 }
 if(m==='instagram'){
  if(big){wrSilkLines(k,15,216,334,13,2,.6);wrFineType(k,'PROOF OF ABSENCE / FIRST IMPRESSION',15,254,334,true);wrStitch(k,15,282,334,4);wrProofColumns(k,15,307,334,13,4);wrStitch(k,15,347,334,2);}
  else wrFineType(k,'PROVENANCE / CIRCULATING COPY',15,140,w,true);
 }
 if(m==='discord'){
  if(small){wrSilkLines(k,15,118,w,10,0,.4);}
  else{wrStitch(k,184,130,164,7);wrFineType(k,'02 / 04 / 07 / 09 / 11',184,140,165,true);}
  if(big){wrSilkLines(k,181,152,168,35,1,.65);wrProofColumns(k,184,186,164,17,5);wrStitch(k,15,232,334,7);wrSilkLines(k,15,260,150,12,0,.55);wrSilkLines(k,15,291,150,12,2,.55);wrStitch(k,15,323,334,4);}
 }
 if(m==='oddity'){
  if(small)wrSilkLines(k,79,102,76,17,2,.45);
  else{wrSilkLines(k,146,90,202,18,2,.25);wrFineType(k,'COURTESY COPY / DESTROY NOTHING',147,140,203,true);}
  if(big){wrStitch(k,147,204,202,4);wrProofColumns(k,15,214,334,12,0);wrSilkLines(k,222,311,124,20,0,.5);}
 }
 if(m==='game'){
  if(small){wrStitch(k,15,102,63,7);wrFineType(k,'COLLECTOR / CELL 07',15,110,w);}
  else{wrSilkLines(k,144,82,202,21,3,.32);wrFineType(k,'INVENTORY OF BEAUTIFUL ABSENCES',144,100,201);}
  if(big){wrStitch(k,15,289,334,3);wrFineType(k,'PERSONAL LEDGER / SEVEN EMPTY PLACES',15,297,334,true);}
 }
}
// Compact layouts retain complete print fields, with native-compatible cutouts for live text.
// Only the decorative paths are clipped. Readings, art and their layout are untouched.
function wrCompactInk(k,W,masks=[]){
 const interval=(p,q,r)=>{let a=0,b=1;const dx=q[0]-p[0],dy=q[1]-p[1];
  for(const [u,v] of [[-dx,p[0]-r[0]],[dx,r[0]+r[2]-p[0]],[-dy,p[1]-r[1]],[dy,r[1]+r[3]-p[1]]]){
   if(Math.abs(u)<1e-9){if(v<0)return null;}else{const t=v/u;if(u<0)a=Math.max(a,t);else b=Math.min(b,t);if(a>b)return null;}
  }return[a,b];};
 const ln=(ps,col,lw=.4)=>{let path=[];const flush=()=>{if(path.length>1)k.ln(path,col,lw);path=[];};
  for(let i=1;i<ps.length;i++){const p=ps[i-1],q=ps[i],bound=interval(p,q,[14,34,W-28,111]);if(!bound){flush();continue;}
   let runs=[bound];for(const r of masks){const cut=interval(p,q,r);if(!cut)continue;const next=[];for(const [a,b]of runs){if(cut[1]<=a||cut[0]>=b)next.push([a,b]);else{if(a<cut[0])next.push([a,cut[0]]);if(cut[1]<b)next.push([cut[1],b]);}}runs=next;}
   for(const [a,b]of runs){const start=[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a],end=[p[0]+(q[0]-p[0])*b,p[1]+(q[1]-p[1])*b];const last=path[path.length-1];if(last&&Math.hypot(last[0]-start[0],last[1]-start[1])>.01)flush();if(!path.length)path.push(start);path.push(end);if(b<1)flush();}if(!runs.length)flush();
  }flush();};
 return{...k,ln};
}
function wrCompactPrint(k,W,H,d){
 if(H>200)return;
 const s=W<200,m=d.mode,w=W-28,seed=wrSlot(d),masks={
  status:s?[[84,37,74,49],[84,100,73,17],[13,125,143,10]]:[[143,37,208,58],[143,108,208,21],[13,133,338,11]],
  shift:s?[[13,36,143,10],[82,47,76,37],[13,87,144,36],[13,124,143,10]]:[[13,34,128,9],[156,36,194,42],[156,88,194,44],[156,132,194,11]],
  solar:s?[[13,36,144,11],[13,49,78,46],[13,102,144,21],[13,127,74,10]]:[[13,36,338,11],[13,49,127,53],[13,110,139,33],[151,126,200,11]],
  audio:s?[[13,106,144,39]]:[[154,36,197,69],[154,126,197,10]],
  discord:s?[[13,131,144,12]]:[[182,37,168,37],[182,79,168,12],[182,96,168,12],[182,113,168,12]],
  oddity:s?[[13,35,144,11],[77,47,81,53],[13,120,144,12]]:[[145,35,206,11],[145,51,206,55],[145,107,206,10],[145,126,206,10]],
  game:s?[[13,34,144,11],[13,47,78,44],[13,117,144,12]]:[[13,34,338,11],[13,47,118,47],[141,49,210,53],[141,106,210,11]],
  feeds:s?[[13,33,144,12],[13,120,144,24]]:[[13,33,338,12],[13,120,338,24]],
  youtube:s?[[13,34,144,12],[13,128,144,9]]:[[13,34,338,12],[13,128,338,9]],
  instagram:[],transmission:[]
 }[m]||[],p=wrCompactInk(k,W,masks),L=k.a(T.headBg,.58),F=k.a(T.ink,.14),A=k.a(T.accent,.32);
 const box=(x,y,ww,hh,c=L)=>p.ln([[x,y],[x+ww,y],[x+ww,y+hh],[x,y+hh],[x,y]],c,.35);
 const oval=(cx,cy,rx,ry,c=L,phase=0)=>{const ps=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*2;ps.push([cx+Math.cos(a)*rx,cy+Math.sin(a+phase)*ry]);}p.ln(ps,c,.35);};
 if(m==='status'){
  // Admission-paper emboss and the large widget's duplicate watermark.
  for(let j=0;j<7;j++){const z=j*2;box(16+z,39+z,s?61-z*2:119-z*2,96-z*2,j%3?L:F);}
  wrGuilloche(p,s?76:148,68,s?87:205,70,7,k.a(T.headBg,.62));
  for(let j=0;j<8;j++)p.ln([[14,137+j*1.4],[W-14,137+j*1.4]],j%3?L:A,.35);
  for(let j=0;j<10;j++){const xx=15+j*w/10;p.ln([[xx,34],[xx+4,34],[xx+4,38]],F,.4);}
  if(!s)wrFineType(k,'DUPLICATE / VALID',19,114,111);
 }
 if(m==='shift'){
  // Overlapping scored sheets, rather than a generic telemetry trace.
  for(let j=0;j<15;j++){const t=j/14;p.ln([[14,48+t*83],[s?65:112,36+t*10],[s?153:338,136-t*11],[s?44:64,141-t*2],[14,48+t*83]],j%5?L:A,.35);}
  for(let j=0;j<18;j++){const xx=15+j*(s?7.8:7);p.ln([[xx,135],[xx+3,139],[xx+6,135]],F,.4);}
  if(!s)wrFineType(k,'FOLD / LIFT / LET GO',17,123,117,true);
 }
 if(m==='solar'){
  // The crescent's engraved exposure field extends to the margins.
  const cx=s?128:254,cy=78;for(let j=0;j<21;j++)oval(cx,cy,19+j*(s?1.9:3.7),13+j*2.2,j%6?L:A,.18);
  for(let j=0;j<12;j++)p.ln([[14+j*7,93],[18+j*7,99],[14+j*7,105]],F,.4);
  for(let j=0;j<Math.floor(w/9);j++){const xx=15+j*9;box(xx,139,6,5,j%5?L:A);}
  if(!s)wrFineType(k,'OPTICAL PAPER / AFTERGLOW',151,101,198);
 }
 if(m==='audio'){
  // Miniature optical score and cylinder-groove impressions.
  const left=s?14:15,right=s?156:145;for(let j=0;j<11;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([left+t*(right-left),89+Math.sin(t*23)*Math.sin(t*Math.PI)*(9+j*.9)+j*.9]);}p.ln(ps,j%4?L:A,.38);}
  for(let j=0;j<10;j++)oval(s?85:79,72,32+j*3.1,16+j*2.4,j%4?L:F,.25);
  if(!s){for(let j=0;j<7;j++)p.ln([[156,106+j*3],[350,106+j*3]],L,.35);for(let i=0;i<22;i++){const xx=157+i*8.8;p.ln([[xx,109],[xx+4,109],[xx+4,119-(i%3)*3]],i%5?F:A,.55);}}
 }
 if(m==='discord'){
  // Scalloped postal stock and five cancellation impressions.
  for(let j=0;j<6;j++){const xx=17+j*(s?25:28);for(let z=0;z<4;z++)box(xx+z,40+z,s?25-z*2:28-z*2,80-z*2,z%2?L:F);}
  for(let j=0;j<18;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([14+t*w,45+j*5+Math.sin(t*8+j*.18)*(s?6:12)]);}p.ln(ps,j%6?L:A,.34);}
  if(!s){for(let j=0;j<3;j++)oval(331,87+j*17,14,7,F);wrFineType(k,'RECIPIENT PAYS',18,116,142,true);}
 }
 if(m==='oddity'){
  // Letter-fold plan, the numbered invitation's etched paper and perforated leaves.
  const width=s?67:120;for(let j=0;j<12;j++){const z=j*2;p.ln([[16+z,39+z],[16+width-z,39+z],[16+width-z,138-z],[16+z,138-z],[16+z,39+z],[16+width-z,138-z]],j%5?L:F,.35);}
  for(let j=0;j<18;j++){const xx=(s?76:144)+j*(s?4.5:11.4);p.ln([[xx,34],[xx+9,89],[xx,143]],j%6?L:A,.35);}
  if(s){wrGuilloche(p,81,89,73,49,seed,k.a(T.headBg,.52));}else wrFineType(k,'SEALED / PERSONAL / RETURNED UNSIGNED',147,140,200);
 }
 if(m==='game'){
  // Seven-column collector stock; actual counts and heat still come from the saved game.
  const cw=w/7;for(let j=0;j<7;j++){const xx=14+j*cw;box(xx+1,45,cw-2,99,L);for(let z=0;z<10;z++)p.ln([[xx+3,51+z*9],[xx+cw-3,51+z*9]],z%3?F:L,.32);}
  for(let j=0;j<8;j++)p.ln([[14,92+j*1.2],[W-14,92+j*1.2]],j%3?L:A,.35);
  if(s){for(let j=0;j<7;j++)k.rect(16+j*9,94,5,4,null,k.a(T.headBg,.7),.4);}
 }
 if(m==='feeds'){
  // The film and valuation panels have their own internal print, added separately below.
  for(let j=0;j<Math.floor(w/7);j++){const xx=15+j*7;box(xx,115,4,4,j%5?L:A);}
  for(let j=0;j<12;j++)p.ln([[14,35+j*9],[W-14,35+j*9]],F,.3);
 }
 if(m==='youtube'){
  // Optical contact-print edges. These are photographic registration marks, not readings.
  for(let j=0;j<Math.floor(w/9);j++){const xx=14+j*9;box(xx,139,6,5,j%5?L:A);p.ln([[xx,46],[xx+6,46]],F,.6);}
  if(!s){for(let j=0;j<19;j++)p.ln([[201+j*8,125],[205+j*8,128],[201+j*8,131]],L,.4);}
 }
}
function wrCompactPlate(k,n,x,y,w,h){
 // Gem-cut tracing fills the plate without changing its recurring specimen.
 const p=wrCompactInk(k,364,[[x+5,y+h-25,w-10,25]]),L=k.a(T.headBg,.53),F=k.ia(.15),cx=x+w*.5,cy=y+(h-26)*.5;
 for(let j=0;j<10;j++){const rx=w*(.48-j*.016),ry=(h-27)*(.48-j*.016),ps=[];for(let i=0;i<=8;i++){const a=(i/8)*Math.PI*2+n*.14;ps.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}p.ln(ps,j%3?L:F,.34);}
 for(let j=0;j<7;j++){const yy=y+7+j*10;p.ln([[x+9,yy],[x+23,yy],[x+29,yy+5]],F,.4);p.ln([[x+w-9,yy+3],[x+w-21,yy+3],[x+w-26,yy-2]],L,.4);}
}
function wrCardDetail(k,x,y,w,h,seed){
 if(k.wrCompact){
  const small=w<200,cx=x+w*(small?.59:.79),cy=y+h*.67;
  for(let j=0;j<14;j++){const ps=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2,r=1+.13*Math.sin(a*4+j*.07);ps.push([cx+Math.cos(a)*(w*(small?.32:.18)-j*.7)*r,cy+Math.sin(a)*(h*.29-j*.4)*r]);}k.ln(ps,k.a(T.headBg,.19),.35);}
  for(let i=0;i<Math.floor((w-20)/6);i++){const xx=x+10+i*6;k.ln([[xx,y+h-4],[xx+2,y+h-6],[xx+4,y+h-4]],k.a(i%7?T.headBg:T.accent,.5),.4);}
  for(let j=0;j<9;j++)k.rect(x+3,y+9+j*10,1.1,j%3?1.1:4,k.a(T.panel,.34));
 }
 for(let j=0;j<13;j++){const p=[];for(let i=0;i<=100;i++){const t=i/100;p.push([x+8+t*(w-16),y+h*(.53+.14*Math.sin(t*6+j*.11))+j*1.1]);}k.ln(p,k.a(T.headBg,.14+j*.005),.35);}
 if(h>200){wrStitch(k,x+12,y+h-28,w-24,seed);}
}

function wrMaskVector(k,x,y,w,h){const scale=Math.min(w/140,h/80),ox=x+(w-140*scale)/2,oy=y+(h-80*scale)/2,P=(a,b)=>new Point(ox+a*scale,oy+b*scale),p=new Path();
 p.move(P(18,37));for(const [ex,ey,cx,cy]of [[33,27,16,29],[67,5,53,8],[48,28,63,21],[83,17,72,14],[48,36,66,34],[80,40,64,28],[105,43,101,47],[118,36,117,28],[113,49,124,43],[132,67,127,61],[112,61,137,72],[96,56,101,58],[73,52,79,65],[44,51,61,44],[14,69,29,66],[35,49,5,75],[7,57,17,51],[30,42,1,60],[18,37,29,37]])p.addQuadCurve(P(ex,ey),P(cx,cy));p.closeSubpath();k.dc.addPath(p);k.dc.setFillColor(k.PN);k.dc.fillPath();k.dc.addPath(p);k.dc.setStrokeColor(k.a(T.ink,.9));k.dc.setLineWidth(.7*scale);k.dc.strokePath();k.poly([[ox+24*scale,oy+34*scale],[ox+34*scale,oy+31*scale],[ox+29*scale,oy+36*scale]],k.A);for(let i=0;i<3;i++)k.ln([[ox+(25+i*3)*scale,oy+(30-i)*scale],[ox+(24+i*3)*scale,oy+(27-i)*scale]],k.I,.6*scale);wrHeart(k,ox+19*scale,oy+18*scale,3*scale,k.A);wrGlint(k,ox+115*scale,oy+18*scale,4*scale,k.A);}

function wrDial(k,x,y,w,h,n=0){const p=wrSpace(k,x,y,w,h);p.circ(50,50,46,p.PN,p.I,1);for(let r=45;r>=19;r-=3)p.circ(50,50,r,null,p.a(T.ink,r%3?.24:.52),.4);for(let i=0;i<100;i++){const a=i/100*6.283;p.ln([[50+41*Math.cos(a),50+41*Math.sin(a)],[50+(i%10?44:48)*Math.cos(a),50+(i%10?44:48)*Math.sin(a)]],i%10?p.ia(.5):p.A,i%10?.45:1);}for(let j=0;j<3;j++){const a=n*.13+j*2.094,cx=50+23*Math.cos(a),cy=50+23*Math.sin(a);p.circ(cx,cy,11,p.a(T.headBg,.25),p.I,.65);for(let z=0;z<28;z++){const b=z*6.283/28;p.ln([[cx+9*Math.cos(b),cy+9*Math.sin(b)],[cx+12*Math.cos(b),cy+12*Math.sin(b)]],p.I,.45);}p.circ(cx,cy,7,p.PN,p.I,.65);p.circ(cx,cy,3,p.I);p.ln([[cx,cy],[50,50]],p.ia(.6),1.6);p.ln([[cx,cy],[50,50]],p.PN,.5);}p.circ(50,50,10,p.I);p.circ(50,50,6,p.PN);p.circ(50,50,3,p.A);p.poly([[50,0],[46,7],[54,7]],p.A);for(let j=0;j<4;j++){const a=.78+j*1.571;p.circ(50+37*Math.cos(a),50+37*Math.sin(a),1.4,p.I);}k.t('03',x+w/2,y+h*.08,Math.min(w,h)*.05,k.I,{w:w*.18,a:'c'});}
function wrJewel(k,n,x,y,w,h){const p=wrSpace(k,x,y,w,h),I=p.I,A=p.A,L=p.a(T.headBg,.44),P=p.PN;n=n%12;
 const stone=(cx,cy,r)=>{const pts=[[cx-r,cy-r*.3],[cx-r*.55,cy-r],[cx+r*.55,cy-r],[cx+r,cy-r*.3],[cx,cy+r]];p.poly(pts,L,I,.85);p.poly([[cx-r*.55,cy-r],[cx+r*.55,cy-r],[cx,cy+r]],p.a(T.accent,.24),I,.4);p.ln([[cx-r,cy-r*.3],[cx+r,cy-r*.3]],I,.5);p.ln([[cx-r*.55,cy-r],[cx-r*.32,cy-r*.3],[cx,cy+r],[cx+r*.32,cy-r*.3],[cx+r*.55,cy-r]],I,.4);};
 if(n===0){for(let i=0;i<28;i++){const a=.1+Math.PI*1.8*i/27;p.circ(50+34*Math.cos(a),43+29*Math.sin(a),3,P,I,.65);}stone(49,83,11);}
 if(n===1){p.ell(50,47,27,36,P,I,1);p.poly([[46,12],[59,33],[43,46],[62,63],[52,81],[68,62],[51,44],[68,32]],L,I,.65);stone(52,47,17);p.poly([[39,82],[61,82],[65,90],[35,90]],P,I,.8);p.poly([[38,35],[34,30],[34,27],[38,29],[42,27],[42,30]],null,A,.6);}
 if(n===2){p.ell(50,62,24,27,L,I,1);p.ell(50,62,15,18,P,I,.65);p.ell(50,29,24,16,P,I,1);p.poly([[37,29],[63,24],[54,33]],A);for(let i=0;i<3;i++)p.ln([[43+i*5,23],[41+i*5,19]],I,.7);}
 if(n===3){p.poly([[13,32],[28,48],[34,20],[50,39],[65,15],[72,47],[89,28],[80,77],[21,77]],L,I,1.2);p.ell(50,78,30,9,P,I,1);p.ell(50,75,29,7,null,A,.8);for(let i=0;i<7;i++){const xx=24+i*8.7;p.ln([[xx,57],[xx,72]],I,.5);stone(xx,61,3);}for(const [xx,yy]of[[13,31],[34,20],[65,15],[89,28]])p.circ(xx,yy,3,P,I,.7);}
 if(n===4){p.poly([[50,43],[10,16],[19,56],[45,54],[35,83],[50,63],[66,84],[58,54],[81,57],[94,17],[54,42]],P,I,1);p.poly([[14,23],[40,46],[22,47]],L);p.poly([[88,24],[59,47],[77,48]],L);p.ln([[50,29],[50,69]],A,1.4);stone(50,84,7);}
 if(n===5){p.circ(50,44,33,P,I,1);p.circ(50,44,27,L,I,.6);p.poly([[60,17],[57,49],[36,71],[43,40]],A,I,.6);for(let i=0;i<4;i++){const a=i*1.571;p.ln([[50+29*Math.cos(a),44+29*Math.sin(a)],[50+33*Math.cos(a),44+33*Math.sin(a)]],I,1.2);}for(let i=0;i<3;i++)p.circ(41+i*9,86+i%2*4,4,P,I,.7);}
 if(n===6){p.poly([[47,6],[88,34],[70,54],[81,77],[47,96],[13,69],[31,49],[20,27]],L,I,1);p.poly([[47,18],[71,35],[50,51],[64,75],[47,84],[29,69],[48,51],[35,28]],P,I,.7);p.ln([[48,51],[70,54],[81,77]],A,1.2);}
 if(n===7){for(let j=0;j<5;j++){const s=j*4;p.poly([[29+s,10+s],[71-s,10+s],[88-s,27+s],[88-s,73-s],[71-s,90-s],[29+s,90-s],[12+s,73-s],[12+s,27+s]],j===0?L:null,j%2?A:I,.65);}for(const xx of[12,88])p.ln([[xx,27],[50,50],[xx,73]],I,.5);}
 if(n===8){p.poly([[23,90],[19,87],[65,25],[70,28]],P,I,1);for(let i=0;i<12;i++)p.ln([[24+i*3,82-i*4],[30+i*3,82-i*4]],A,.8);stone(73,18,13);p.ell(70,35,11,3,L,I,.8);p.circ(19,90,5,P,I,.8);}
 if(n===9){for(let j=0;j<3;j++){let pts=[];for(let i=0;i<=70;i++){const a=Math.PI+i/70*Math.PI;pts.push([50+(40-j*4)*Math.cos(a),77+(49-j*9)*Math.sin(a)]);}p.ln(pts,I,.8);}for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI;stone(50+38*Math.cos(a),77+47*Math.sin(a),i===4?6:3);}p.ell(50,79,40,5,null,A,1);}
 if(n===10){p.poly([[44,37],[65,26],[73,13],[67,5],[55,7],[48,17],[36,10],[24,14],[21,26],[35,38],[35,88],[59,88],[59,79],[49,79],[49,69],[42,69]],I,I,.7);p.poly([[45,30],[62,20],[63,13],[55,15],[48,24],[37,18],[31,21],[37,29]],P);p.ln([[38,42],[38,83]],A,1.2);}
 if(n===11){p.poly([[12,41],[47,9],[88,35],[73,87],[26,80]],L,I,1);p.poly([[12,41],[57,37],[47,9],[57,37],[88,35],[57,37],[73,87]],P,I,.7);p.ln([[26,80],[57,37],[38,61],[12,41]],I,.8);p.poly([[38,61],[57,37],[55,66]],p.a(T.accent,.36),I,.6);}
 for(let i=0;i<4;i++){const xx=9+i*25;p.ln([[xx,96],[xx+10,96]],p.ia(.25),.35);} }
function wrObjectPlate(k,n,x,y,w,h,caption=true){wrRound(k,x,y,w,h,5,k.a(T.panel,.85),k.a(T.headBg,.85));for(let j=0;j<9;j++){const yy=y+12+j*(h-25)/9;k.ln([[x+4,yy],[x+7+(j%3?0:3),yy]],k.ia(.5),.4);k.ln([[x+w-4,yy],[x+w-7,yy]],k.a(T.accent,.5),.4);}if(k.wrCompact)wrCompactPlate(k,n,x,y,w,h);wrGuilloche(k,x+4,y+4,w-8,h-8,n,k.a(T.headBg,.15));const ih=caption?h-26:h;wrPixelWeave(k,x+8,y+8,w-16,ih-11,n,n%3===0?5:n%3===1?6:0,.52);if(!wrArt(k,'lot'+String(n%12+1).padStart(2,'0'),x+8,y+6,w-16,ih-7))wrJewel(k,n,x+8,y+6,w-16,ih-7);for(const [xx,yy,sx,sy]of[[x+5,y+5,1,1],[x+w-5,y+5,-1,1],[x+5,y+ih-3,1,-1],[x+w-5,y+ih-3,-1,-1]])k.ln([[xx+sx*7,yy],[xx,yy],[xx,yy+sy*7]],k.a(T.accent,.6),.5);if(caption){k.ln([[x+5,y+h-24],[x+w-5,y+h-24]],k.a(T.headBg,.7),.5);k.t('LOT '+String(n+1).padStart(2,'0')+' / DISPUTED',x+7,y+h-20,5.7,k.A,{w:w-14});k.t(WR_LOTS[n%12][0],x+7,y+h-11,8,k.I,{f:'disp',w:w-14});}}
function wrScene(k,n,x,y,w,h){n=n%12;const xx=a=>x+a*w/100,yy=a=>y+a*h/100,ln=(p,c=k.ia(.6),s=.55)=>k.ln(p.map(q=>[xx(q[0]),yy(q[1])]),c,s),rc=(a,b,c,d,col,stroke)=>k.rect(xx(a),yy(b),w*c/100,h*d/100,col,stroke,.55);k.rect(x,y,w,h,k.a(T.headBg,.13),k.ia(.35),.6);if(k.wrCompact){
 for(let j=0;j<Math.floor(w/14);j++){const xx=x+7+j*14;k.ln([[xx,y+10],[xx,y+h-10]],k.a(T.headBg,.48),.3);k.rect(xx-2,y+h-5,4,2,k.a(j%4?T.ink:T.accent,.32));}
 for(let j=0;j<8;j++)k.ln([[x+3,y+10+j*(h-20)/8],[x+w-3,y+10+j*(h-20)/8]],k.ia(.1),.3);
}wrPixelWeave(k,x+3,y+12,w-6,h-24,n,n%2?4:2,.26);
 if(n===0){for(let j=0;j<5;j++){rc(4+j*20,12,10,60,k.PN,k.ia(.4));ln([[j*20,80],[50,58],[100,80]]);}for(let i=0;i<3;i++){rc(21+i*27,57,11,28,k.PN,k.I);wrJewel(k,i,x+w*(.18+i*.27),y+h*.24,w*.17,h*.34);}}
 if(n===1){rc(15,7,70,86,k.PN,k.I);for(let j=0;j<5;j++)rc(20+j*4,12+j*4,60-j*8,76-j*8,null,k.a(T.headBg,.8));wrDial(k,x+w*.3,y+h*.2,w*.4,h*.6,n);for(let j=0;j<4;j++)rc(8,15+j*20,9,8,k.I);}
 if(n===2){for(let i=0;i<4;i++){rc(5+i*24,12,19,27,k.PN,k.I);rc(7+i*24,58,15,26,k.a(T.headBg,.4),k.I);}ln([[0,48],[100,48]]);ln([[0,89],[100,89]]);rc(42,42,16,9,k.I);}
 if(n===3){for(let j=0;j<6;j++){ln([[3,25+j*11],[36,25+j*11],[41,20+j*11]]);ln([[97,25+j*11],[64,25+j*11],[59,20+j*11]]);}rc(39,12,22,16,k.PN,k.I);wrJewel(k,3,x+w*.38,y+h*.07,w*.24,h*.32);ln([[50,35],[50,95]],k.A,.8);}
 if(n===4){for(let j=0;j<8;j++)ln([[j*14,0],[j*14+24,100]],k.ia(.3));for(let j=0;j<5;j++)ln([[0,j*25],[100,j*25]],k.a(T.headBg,.8));ln([[2,80],[37,80],[52,49],[98,49]],k.I,2);}
 if(n===5){for(let j=0;j<9;j++){let pts=[];for(let i=0;i<=50;i++){let a=Math.PI+i/50*Math.PI;pts.push([50+(46-j*3)*Math.cos(a),80+(68-j*4)*Math.sin(a)]);}ln(pts,k.a(j%3?T.headBg:T.ink,.6));}rc(43,50,14,40,k.PN,k.I);}
 if(n===6){for(let j=0;j<4;j++)for(let i=0;i<8;i++){rc(3+i*12,5+j*22,10,18,k.a(T.panel,.7),k.I);rc(6+i*12,9+j*22,4,2,k.ia(.4));}ln([[9,93],[91,93]],k.A,.8);}
 if(n===7){for(let j=0;j<7;j++)ln([[j*8,3],[j*5,90]],k.a(T.headBg,.8));for(let j=0;j<7;j++)ln([[100-j*8,3],[100-j*5,90]],k.a(T.headBg,.8));rc(35,70,30,20,k.PN,k.I);wrJewel(k,8,x+w*.33,y+h*.1,w*.34,h*.6);}
 if(n===8){for(let j=0;j<6;j++)ln([[j*20,40],[j*20,90]],k.I,.8);ln([[0,40],[100,40]],k.I,1.6);for(let j=0;j<8;j++)ln([[0,94-j*3],[100,94-j*3]],k.ia(.25));rc(45,8,22,25,null,k.A);}
 if(n===9){rc(22,2,56,96,k.PN,k.I);for(let j=0;j<12;j++)ln([[26+j*4,5],[26+j*4,95]],k.a(T.headBg,.8));rc(82,31,11,30,k.PN,k.I);for(let j=0;j<4;j++)rc(86,35+j*6,3,2,k.A);ln([[50,0],[50,100]],k.I,1.3);}
 if(n===10){for(let j=0;j<5;j++){rc(3+j*19,43-j%2*25,15,48+j%2*25,k.PN,k.I);for(let i=0;i<7;i++)ln([[5+j*19,48+i*5-j%2*25],[16+j*19,48+i*5-j%2*25]],k.ia(.35));}ln([[0,92],[100,92]],k.A,1);}
 if(n===11){rc(29,5,42,90,k.PN,k.I);rc(34,11,32,80,null,k.ia(.3));rc(55,47,8,3,k.I);wrMask(k,x+w*.38,y+h*.17,w*.24,h*.32);for(let j=0;j<6;j++)ln([[0,12+j*15],[24,12+j*15]]);}
 for(let j=0;j<14;j++){ln([[0,5+j*6.8],[100,5+j*6.8]],k.ia(.07),.4);}for(let j=0;j<6;j++){const bx=7+j*16,by=14+(n*13+j*21)%68;ln([[bx,by],[bx+5,by],[bx+5,by+5]],k.a(T.accent,.6));}for(let j=0;j<9;j++){ln([[3+j*11,91],[3+j*11,96]],k.ia(.5),.5);}k.t('EXPOSURE / '+String(100+n*13)+'   GATE / '+String(n+1).padStart(2,'0'),x+4,y+h-9,4.8,k.I,{w:w-8});
 const beam=[[[3,14],[91,88]],[[1,70],[96,24]],[[13,3],[72,95]]][n%3];ln(beam,k.a(T.accent,.75),.8);for(let i=0;i<6;i++){rc((n*13+i*17)%95,98,.8,1.5,k.I);}k.t('REEL '+String(n+1).padStart(2,'0')+' / RECONSTRUCTION',x+4,y+3,4.9,k.I,{w:w-8});}
function wrExit(k,x,y,w,h,n){n=n%6;k.rect(x,y,w,h,k.a(T.panel,.85),k.a(T.headBg,.8),.7);const variants=[[[.07,.82],[.3,.82],[.3,.55],[.56,.55],[.56,.26],[.88,.26]],[[.12,.13],[.12,.6],[.43,.6],[.43,.83],[.81,.83],[.81,.35]],[[.1,.7],[.35,.7],[.35,.2],[.7,.2],[.7,.55],[.91,.55]],[[.08,.3],[.4,.3],[.4,.78],[.74,.78],[.74,.15],[.9,.15]],[[.1,.82],[.1,.38],[.45,.38],[.45,.65],[.87,.65],[.87,.19]],[[.1,.2],[.7,.2],[.7,.43],[.29,.43],[.29,.8],[.9,.8]]],pts=variants[n];for(let j=0;j<11;j++){const xx=x+w*j/11;k.ln([[xx,y+5],[xx,y+h-5]],k.ia(.1),.4);}for(let j=0;j<6;j++)k.ln([[x+3,y+h*j/6],[x+w-3,y+h*j/6]],k.ia(.1),.4);for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],P=[[x+a[0]*w,y+a[1]*h],[x+b[0]*w,y+b[1]*h]];k.ln(P,k.a(T.headBg,.75),10);k.ln(P,k.PN,7);k.ln(P,k.I,2.2);k.ln(P,k.PN,.7);}for(let j=0;j<4;j++){const yy=y+h*(.13+j*.23);k.ln([[x+3,yy],[x+w-3,yy+h*.1]],k.a(T.accent,.65),.65);k.rect(x+2,yy-1,3,2,k.A);k.rect(x+w-5,yy+h*.1-1,3,2,k.A);}for(let j=0;j<pts.length;j++){const q=pts[j],xx=x+q[0]*w,yy=y+q[1]*h;k.circ(xx,yy,2,j===n?k.A:k.PN,k.I,.5);if(w>150)k.t('D'+(j+1),xx+4,yy-7,4.8,k.S,{w:18});}k.t('ENTRY / '+String(n+1).padStart(2,'0'),x+4,y+h-9,5,k.I,{w:w*.5});k.t('EGRESS',x+w-4,y+3,5,k.A,{a:'r',w:35});}
function wrMusic(k,x,y,w,h,seed){if(wrArt(k,'audio',x,y,w,h))return;const p=wrSpace(k,x,y,w,h);p.rect(6,82,89,5,p.a(T.headBg,.6),p.I,.6);p.poly([[13,69],[23,69],[23,82],[9,82]],p.PN,p.I,.6);p.poly([[75,69],[85,69],[92,82],[75,82]],p.PN,p.I,.6);p.poly([[14,24],[77,24],[89,35],[89,70],[78,79],[14,79]],p.a(T.panel,.9),p.I,1);p.ell(18,51,10,27,p.PN,p.I,.8);p.ell(78,51,10,27,p.a(T.headBg,.5),p.I,.8);for(let i=0;i<35;i++){const xx=21+i*1.6;p.ln([[xx,29],[xx,73]],p.a(i%4?T.headBg:T.ink,.7),.5);for(let j=0;j<8;j++)if((i*7+j*11+seed)%9<3)p.rect(xx,31+j*5,.8,2.1,p.A);}for(let j=0;j<3;j++)p.ell(18,51,3+j*2,12+j*6,null,p.ia(.55),.5);p.ln([[15,18],[82,18],[82,32]],p.I,1.5);p.poly([[79,29],[85,29],[84,37],[80,37]],p.A);p.rect(89,48,8,6,p.I);p.circ(18,51,3,p.I);p.circ(18,51,1.4,p.PN);for(let i=0;i<6;i++)p.rect(28+i*7,84,3,1,p.I);p.ln([[24,94],[90,94]],p.ia(.4),.4);k.t('MASTER / 07',x+w*.23,y+h*.91,Math.min(w,h)*.046,k.I,{w:w*.62});}
function wrNetwork(k,x,y,w,h,seed){const nodes=[[.2,.25],[.75,.17],[.47,.51],[.18,.82],[.8,.8]],names=['CELL 02','CELL 04','CELL 07','CELL 09','CELL 11'];for(let j=0;j<9;j++){k.ln([[x+3,y+6+j*(h-12)/9],[x+w-3,y+6+j*(h-12)/9]],k.ia(.1),.4);}wrGuilloche(k,x,y,w,h,seed,k.a(T.headBg,.2));for(let i=0;i<5;i++){const a=nodes[i],b=nodes[(i+2)%5];k.ln([[x+a[0]*w,y+a[1]*h],[x+(a[0]+b[0])*.5*w+6,y+a[1]*h],[x+b[0]*w,y+b[1]*h]],k.a(T.accent,.6),.8);}nodes.forEach((q,i)=>{const xx=x+q[0]*w,yy=y+q[1]*h,cw=Math.min(49,w*.26);k.rect(xx-cw/2,yy-12,cw,25,i===2?k.I:k.PN,k.I,.7);k.ln([[xx-cw/2,yy-12],[xx,yy],[xx+cw/2,yy-12]],i===2?k.PN:k.a(T.headBg,.9),.8);for(let j=0;j<5;j++)k.rect(xx-cw/2+3+j*3,yy-9,1,2,i===2?k.PN:k.a(T.accent,.5));k.circ(xx+cw/2-5,yy-6,1.4,i===2?k.A:k.a(T.headBg,.8));k.t(names[i],xx,yy+5,5.6,i===2?k.PN:k.I,{a:'c',w:cw-3});});}
function wrRule(k,x,y,w,label,value,col){k.ln([[x,y],[x+w,y]],k.ia(.23),.5);k.t(label,x,y+4,6,k.S,{w:w*.5});k.t(value,x+w,y+3,9,col||k.I,{w:w*.48,a:'r',f:'disp'});}
function wrInvitation(k,n,x,y,w,h){if(wrArt(k,'invite',x,y,w,h)){wrJewel(k,n,x+w*.27,y+h*.28,w*.46,h*.34);k.t('ADMIT / '+String(n+1).padStart(2,'0'),x+w*.5,y+h*.72,Math.min(w,h)*.05,k.a('#2A2340',.9),{a:'c',w:w*.6});return;}const p=wrSpace(k,x,y,w,h),bend=17+n%4*5;p.poly([[10,5],[90-bend,5],[90,bend+5],[90,95],[10,95]],p.PN,p.I,.9);p.poly([[90-bend,5],[90-bend,bend+5],[90,bend+5]],p.a(T.headBg,.55),p.I,.7);for(let i=0;i<6;i++){const yy=48+i*6;p.ln([[18,yy],[82,yy]],p.ia(.3),.4);}for(let j=0;j<15;j++)p.rect(19+j*4.2,83,j%3?1:2,5+(j+n)%4,p.ia(.65));p.rect(10,5,4,90,p.A);const cx=x+w*.5,cy=y+h*.29;wrSeal(k,cx,cy,Math.min(w,h)*.19,n+1);k.t('ADMIT / ONE',cx,y+h*.62,Math.min(w,h)*.06,k.I,{a:'c',w:w*.68});k.t('INVITATION '+String(n+1).padStart(2,'0'),cx,y+h*.72,Math.min(w,h)*.044,k.S,{a:'c',w:w*.72});}
function wrFeedRecord(k,n,x,y,w,h,valuation){k.rect(x,y,w,h,valuation?k.PN:k.I,k.a(T.headBg,.65),.6);if(k.wrCompact){
 const tint=valuation?T.ink:T.panel;for(let j=0;j<12;j++){const yy=y+10+j*(h-20)/12;k.ln([[x+3,yy],[x+w-3,yy]],k.a(tint,.12),.3);}
 if(valuation){for(let j=0;j<10;j++){const t=j/9;k.ln([[x+5+t*(w-10),y+10],[x+w*.5,y+h-4],[x+w-5-t*(w-10),y+10]],k.a(T.headBg,.55),.35);}}
 else{for(let j=0;j<3;j++){const xx=x+9+j*(w-12)/3;k.ln([[xx,y+9],[xx+4,y+9],[xx+4,y+h-9]],k.a(T.panel,.32),.4);}}
}if(valuation){for(let j=0;j<8;j++)k.ln([[x+5,y+10+j*(h-17)/8],[x+w-5,y+10+j*(h-17)/8]],k.ia(.2),.4);for(let j=0;j<5;j++){const xx=x+6+j*(w-12)/5,fh=(.2+((n+j*7)%11)/15)*(h-24);k.rect(xx,y+h-9-fh,(w-17)/5-3,fh,k.a(j%2?T.headBg:T.accent,.2),k.ia(.5),.5);}wrPixelWeave(k,x+5,y+12,w-10,h-24,n,5,.44);k.t('ESTIMATE / WITHHELD',x+5,y+3,4.8,k.I,{w:w-10});}else{const gap=5,fw=(w-20)/3;for(let j=0;j<3;j++){const xx=x+5+j*(fw+gap),yy=y+12;wrRound(k,xx,yy,fw,h-24,2,k.a(T.headBg,.18),k.a(T.panel,.65),.5);for(let z=0;z<6;z++){const by=yy+4+z*(h-34)/6;k.ln([[xx+3,by],[xx+fw-3,by+(j-1)*3]],k.a(T.panel,.3),.4);}wrPixelWeave(k,xx+3,yy+3,fw-6,h-30,n+j,j%2?1:4,.75);const gp=Math.min((fw-10)/9,(h-30)/9);wrPixelGlyph(k,['key','diamond','heart'][j],xx+fw*.5-gp*3.5,yy+(h-24)*.5-gp*3.5,gp,k.a(T.panel,.85));}for(let i=0;i<14;i++){k.rect(x+4+i*(w-8)/14,y+3,3,3,k.PN);k.rect(x+4+i*(w-8)/14,y+h-6,3,3,k.PN);}}}
function wrFrame(k,W,H,d){const n=Object.keys(WR_META).indexOf(d.mode),seed=wrSlot(d);k.rect(0,0,W,H,k.GR);wrRound(k,4,4,W-8,H-8,13,k.a(T.panel,.7),k.a(T.headBg,.95),.7);for(let j=0;j<4;j++)wrRound(k,7+j,30+j,W-14-j*2,H-57-j*2,7,null,k.a(j%2?T.ink:T.headBg,.1),.35);for(let y=34;y<H-22;y+=14)for(let x=12;x<W-10;x+=14)k.rect(x,y,.45,.45,k.ia(.17));wrPrintPattern(k,12,34,W-24,H-61,seed+n);k.rect(10,9,W-20,18,n%3===1?k.a(T.accent,.14):k.a(T.headBg,.32));k.t(String(n+1).padStart(2,'0')+' / '+WR_META[d.mode],17,12,10,k.I,{f:'disp',w:W-62});if(n%3===1)wrHeart(k,W-22,18,4,k.A);else wrGlint(k,W-22,18,3.8,k.A);k.t('CELL 07',12,H-16,5.8,k.S,{w:48});k.t(['status','shift','solar'].includes(d.mode)?'PERSONAL / PRIVATE':'FICTIONAL / NO RECORD',W-12,H-16,5.7,k.S,{a:'r',w:W-74});wrFoil(k,12,H-23,W-24,2,seed+n);}
function wrTimerLayout(W,H){return W<200?{x:15,y:88,w:140,fs:25}:{x:158,y:H>200?111:89,w:190,fs:H>200?37:31};}
function wrTime(ms){const s=Math.max(0,Math.floor(ms/1000));return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':');}
// Revision 5 screen studies: native-compatible abstract print compositions.
// No live data, sensor diagrams, vault dials or security beams. Clock and dock stay clear.
function wrStudyRibbon(k,cx,top,w,h,phase=0,reverse=false){
 const edge=(side,offset=0)=>{const p=[];for(let i=0;i<=140;i++){const t=i/140,ang=t*Math.PI*2.05+phase,xx=cx+Math.sin(ang)*w*.39,yy=top+t*h,dx=Math.cos(ang)*w*.39*Math.PI*2.05,dy=h,len=Math.hypot(dx,dy),taper=.12+.88*Math.pow(Math.sin(t*Math.PI),.7),band=w*.13*taper;p.push([xx+dy/len*(side*band+offset*taper),yy-dx/len*(side*band+offset*taper)]);}return p;};
 const left=edge(-1),right=edge(1);k.poly([...left,...right.slice().reverse()],k.a(T.panel,.95),k.a(T.ink,.4),.6);
 const mid=edge(.3),rim=edge(1);k.poly([...mid,...rim.slice().reverse()],k.a(T.headBg,.55));
 for(let i=0;i<14;i++){const o=-w*.05+i*w*.008;k.ln(edge(reverse?-.15:.15,o),k.a(i%4?T.headBg:T.ink,i%4?.38:.17),.4);}
 const p=edge(1);for(let i=5;i<p.length;i+=7){const [x,y]=p[i];if(i%3===0)wrPixelGlyph(k,'glint',x+6,y-3,.65,k.a(T.accent,.55));else for(let j=0;j<3;j++)k.rect(x+3+j*4,y+j%2*3,1.8,1.8,k.a(T.headBg,.55-j*.12));}
}
function wrStudyShell(k,cx,cy,rx,ry,angle,n){
 const point=(a,r)=>{const v=1+.055*Math.cos(a*3+n),x=Math.cos(a)*rx*v*r,y=Math.sin(a)*ry*v*r;return[cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle)];};
 const outside=[],inside=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;outside.push(point(a,1));inside.push(point(a,.72+.08*Math.sin(a+n)));}
 k.poly([...outside,...inside.reverse()],k.a(T.panel,.88),k.a(T.headBg,.8),.6);
 for(let j=0;j<13;j++){const ps=[];for(let i=0;i<=120;i++)ps.push(point(i/120*Math.PI*2,.74+j*.018));k.ln(ps,k.a(j%5?T.headBg:T.ink,j%5?.4:.2),.35);}
 for(let i=0;i<9;i++){const [x,y]=point(.3+i*.065,1.06);k.rect(x,y,2.2,2.2,k.a(i%4?T.headBg:T.accent,.68));}
}
function wrStudyGrain(k,x,y,w,h,seed){
 for(let j=0;j<Math.floor(h/8);j++)for(let i=0;i<Math.floor(w/8);i++){const xx=x+i*8,yy=y+j*8,n=(i*17+j*13+seed)%29;if(n<3)k.rect(xx,yy,.45,.45,k.ia(.14));if(n===12&&(i+j)%7===0)wrHeart(k,xx,yy,2.1,k.a(T.accent,.16));}
}
function wrPoster(raw,W,H,d){
 const k=wrSafe(raw),home=d.mode==='home',n=d.index%3,top=home?174:223,bottom=H-106,hh=bottom-top,shift=Math.max(-1,Math.min(1,d.knobs?.shift||0)),scale=Math.max(.8,Math.min(1.12,d.knobs?.scale||1));
 const override=!home&&d.index>=3&&d.phrase,cy=top+hh*.44,txt=(s,x,y,fs,c,w,a='l',f='mono')=>{if(override&&fs>=25&&y>bottom-140)return;k.t(s,x,y,fs,c,{w,a,f});};
 if(d.knobs?.details!==false)wrStudyGrain(k,15,top+7,W-30,hh-26,n);
 const artIn=()=>{if(k.dc.x){k.dc.x.save();k.dc.x.translate(W/2,cy+shift*10);k.dc.x.scale(scale,scale);k.dc.x.translate(-W/2,-cy);}},artOut=()=>{if(k.dc.x)k.dc.x.restore();};
 txt('WHITE RABBIT',19,top+3,10,k.I,160,'l','disp');txt(['SILK MEMORY','PEARL DRIFT','LOVE, UNSIGNED'][n],W-19,top+3,5.6,k.A,130,'r');
 if(n===0){
  artIn();wrStudyRibbon(k,home?208:188,top+38,home?285:315,hh*(home?.82:.66),home?1.2:.25);
  if(!home){wrMask(k,46,top+125,298,167);wrPixelWeave(k,31,top+266,298,66,5,6,.38);artOut();txt('Elegance is',33,bottom-126,38,k.I,324,'l','disp');txt('faster than force.',33,bottom-84,32,k.I,324,'l','disp');}
  else{wrMask(k,home?165:100,top+216,home?196:240,116);artOut();txt('We were',29,bottom-126,31,k.I,280,'l','disp');txt('never here.',29,bottom-92,31,k.I,300,'l','disp');}
  txt('A courtesy, not a confession.',21,bottom-20,8,k.I,310,'l','disp');wrHeart(k,346,bottom-39,6,k.a(T.accent,.8));
 }
 if(n===1){
  artIn();const specs=home?[[115,115,117,48,-.6,1],[265,235,105,57,.48,2],[120,344,98,41,-.35,3]]:[[120,100,133,56,-.45,1],[258,182,115,62,.65,2],[145,279,120,45,-.28,3]];
  for(const[xx,yy,rx,ry,a,z]of specs)wrStudyShell(k,xx,top+yy,rx,ry,a,z);
  wrPixelWeave(k,home?177:26,top+(home?330:219),160,88,9,5,.34);
  for(const[xx,yy,r]of[[300,76,4],[72,191,6],[299,307,4]])wrGlint(k,xx,top+yy,r,k.a(T.accent,.8));
  artOut();if(home){txt('Nothing was taken.',31,bottom-94,25,k.I,328,'l','disp');txt('Everything is gone.',31,bottom-65,25,k.I,328,'l','disp');}
  else{txt('What’s yours',27,bottom-119,34,k.I,335,'l','disp');txt('is mine.',27,bottom-80,42,k.I,335,'l','disp');}
  txt('PEARL / PAPER / A QUESTION OF OWNERSHIP',20,bottom-16,5.6,k.S,345);
 }
 if(n===2){
  // Typography becomes an abstract material, with pixel print breaking up the margins.
  artIn();txt('07',home?-7:-13,top+(home?31:23),home?236:257,k.a(T.headBg,.48),415,'l','disp');
  for(let j=0;j<27;j++){const ps=[];for(let i=0;i<=90;i++){const t=i/90;ps.push([389-278*t+Math.sin(t*Math.PI)*(30+j*2.1),top+43+hh*.62*Math.pow(t,1.45)+Math.sin(t*Math.PI)*j*.9]);}k.ln(ps,k.a(j%5?T.headBg:T.accent,j%5?.42:.23),j%5?.4:.65);}
  wrPixelWeave(k,home?35:27,top+179,home?243:306,155,7,4,.4);
  const heartY=top+(home?306:228);for(let j=0;j<5;j++)wrHeart(k,home?99:108,heartY,36+j*7,k.a(j%2?T.headBg:T.accent,j%2?.4:.32));
  wrMask(k,home?141:106,top+(home?286:216),home?217:254,148);
  artOut();txt(home?'Leave only':'Catch me',29,bottom-118,37,k.I,329,'l','disp');txt(home?'a little trace.':'if you can.',29,bottom-79,37,k.I,329,'l','disp');
  txt('WITH COMPLIMENTS / SEVERAL PERFECT ALIBIS',20,bottom-15,5.4,k.S,344);
 }
 if(override)k.para(d.phrase,29,bottom-126,329,34,k.I,'disp',3,1.08,102);
 txt('CELL 07',20,bottom+2,5.5,k.A,75);txt('AFTERIMAGE / PRIVATE PRINT',W-20,bottom+2,5.5,k.S,200,'r');
}

function wrPaint(raw,W,H,d){const k=wrSafe(raw),small=W<200,big=H>200,seed=wrSlot(d),mode=d.mode;k.wrDepartment=mode;k.wrCompact=!big;wrFrame(k,W,H,d);wrCompactPrint(k,W,H,d);wrPaperDetail(k,W,H,d);wrWidgetPrint(k,W,H,d);const x=14,y=35,w=W-28,bottom=H-30;
 if(mode==='status'){const ev=d.ev,wx=d.wx||{};if(!wrArt(k,'vault',small?12:10,small?36:35,small?67:130,small?67:99))wrDial(k,small?12:10,small?36:39,small?67:126,small?67:111,seed);const tx=small?86:145,tw=W-tx-14;k.t(ev?(ev.active?'JOB IN PROGRESS':'NEXT COMMISSION'):'NO COMMISSIONS',tx,39,6,k.A,{w:tw});k.para(ev?ev.title:'Laying low.',tx,51,tw,small?13:18,k.I,'disp',2);k.t(wx.temp==null?'COVER / UNAVAILABLE':wx.temp+'° / '+(wx.cond||''),tx,small?103:110,7,k.S,{w:tw});k.t(d.batt==null?'RESERVE / UNAVAILABLE':'RESERVE '+Math.round(d.batt*100)+'%',x,small?127:135,6.5,k.I,{w:small?142:112});if(!small)k.t(ev?shortT(ev.start)+' — '+shortT(ev.end):'Calendar standing by',W-14,135,8,k.I,{a:'r',w:190});if(big){wrRule(k,x,170,w,'TERMS','Leave only a card.');wrFoil(k,x,198,w,9,seed);wrRound(k,x,214,w,105,4,k.a(T.headBg,.16),k.ia(.3));wrMicro(k,x+7,222,96,88,seed,0);wrGuilloche(k,115,217,130,95,seed);k.t('ADMIT',180,243,10,k.A,{a:'c',w:75});k.t('ONE',180,258,25,k.I,{a:'c',w:75,f:'disp'});k.t('HOST / UNKNOWN',180,296,5.3,k.S,{a:'c',w:92});wrSeal(k,293,261,36,7);k.t('DUPLICATE / VALID',293,306,5,k.S,{a:'c',w:90});k.para('Your invitation is already inside.',x,331,w,18,k.I,'disp',1);} }
 if(mode==='shift'){const ev=d.ev,l=wrTimerLayout(W,H);k.t(ev?(ev.active?'TIME TO THE EXIT':'UNTIL WE MOVE'):'LAYING LOW',small?x:158,38,6.5,k.A,{w:small?w:190});k.para(ev?ev.title:'No timed job scheduled.',small?84:158,49,small?72:190,small?12:big?17:15,k.I,'disp',2);if(small){if(!wrArt(k,'edge',14,52,64,33))wrExit(k,14,52,64,33,seed);}else if(!wrArt(k,'edge',14,40,126,big?129:102))wrExit(k,14,38,126,big?129:102,seed);if(!d.live)k.t(ev?wrTime((ev.active?ev.end:ev.start)-d.now):'--:--:--',l.x,l.y,l.fs,k.I,{w:l.w,f:'disp'});k.t(ev?'LEAVE BY '+shortT(ev.end):'CALENDAR UNAVAILABLE',small?x:158,small?125:big?170:134,6.2,k.S,{w:small?w:190});if(big){wrFoil(k,x,185,w,8,seed);k.t('The exit is part of the invitation.',x,207,21,k.I,{f:'disp',w});wrExit(k,x,245,w*.63,88,seed+2);wrMicro(k,244,245,106,88,seed,1);k.t('ROUTE STUDY / FICTIONAL',x,338,6,k.A,{w});}}
 if(mode==='solar'){const sun=d.sun||{},wx=d.wx||{},atm=d.atm||{};k.t(sun.phase==='day'?'EXPOSED / DAYLIGHT LEFT':sun.phase==='night'?'UNDER COVER OF DARK':'COVER FEED UNAVAILABLE',x,38,6,k.A,{w});k.t(Number.isFinite(sun.left)?Math.round(sun.left*100)+'%':'--',x,51,small?35:42,k.I,{f:'disp',w:small?75:117});const sx=small?91:151,sw=small?62:198;if(!wrArt(k,'cover',sx,44,sw,small?62:76))for(let i=0;i<12;i++){const xx=sx+i*sw/12,hh=(small?61:67)*(1-i*.025);k.poly([[xx,48],[xx+sw/12-2,44],[xx+sw/12-2,44+hh],[xx,48+hh]],k.a(T.ink,.08+i*.025),k.a(T.headBg,.6),.4);k.ln([[xx,48+hh],[xx+sw/12-2,44+hh]],k.A,.65);}if(!d.live)k.t(Number.isFinite(sun.remaining)?wrTime(sun.remaining):'NO SOLAR FIX',x,small?104:112,small?15:18,k.I,{f:'disp',w:small?w:140});k.t(sun.phase==='day'?'UNTIL DARK':sun.phase==='night'?'UNTIL DAWN':'LOCATION / UNAVAILABLE',x,small?128:137,5.9,k.S,{w:small?w:140});if(!small)k.t(wx.temp==null?'WEATHER UNAVAILABLE':wx.temp+'° / '+wx.cond,W-14,128,8,k.I,{a:'r',w:195});if(big){const vals=[['RAIN',atm.probs?.length?Math.max(...atm.probs.filter(Number.isFinite))+'%':'--'],['DAMP',atm.rh==null?'--':atm.rh+'%'],['SUN',atm.uv==null?'--':Math.round(atm.uv)],['SIGHT',atm.vis||'--'],['DEW',atm.dew==null?'--':atm.dew+'°'],['WIND',atm.ws==null?'--':Math.round(atm.ws*(T.units==='celsius'?1.609:1))+(T.units==='celsius'?' KM/H':' MPH')]];vals.forEach(([name,val],i)=>{const xx=x+i%3*114,yy=175+Math.floor(i/3)*76;wrRound(k,xx,yy,108,65,4,k.PN,k.a(T.headBg,.8));k.t(name,xx+7,yy+6,6,k.A,{w:70});k.t(val,xx+7,yy+20,20,k.I,{f:'disp',w:65});wrSilkLines(k,xx+6,yy+49,95,12,i%4,.48);for(let j=0;j<7;j++){const norm=[null,atm.rh==null?null:atm.rh/100,atm.uv==null?null:atm.uv/12,atm.visMi==null?null:atm.visMi/15,atm.dew==null?null:(atm.dew+(T.units==='celsius'?20:4))/(T.units==='celsius'?70:126),atm.ws==null?null:atm.ws/35][i];const height=i===0?(atm.probs?.[j]||0)*.2:norm==null?0:Math.min(24,Math.max(0,norm*24))*(1-j*.055);for(let q=0;q<Math.floor(height/3);q++)k.rect(xx+75+j*3,yy+46-q*3,1.8,1.8,k.a(q%3?T.headBg:T.accent,.68));}});k.t('Visibility is an inconvenience.',x,336,18,k.I,{f:'disp',w});}}
 if(mode==='audio'){if(small){wrMusic(k,x,35,w,76,seed);k.para('Music for a clean getaway.',x,108,w,17,k.I,'disp',2);}else{wrMusic(k,12,35,133,105,seed);k.t('GETAWAY 07 / ENCODED CYLINDER',156,38,6,k.A,{w:194});k.para((C.audio?.lines||AUDIO_LINES)[seed%(C.audio?.lines||AUDIO_LINES).length],156,52,194,21,k.I,'disp',3);k.t('OPEN MUSIC / WHISPER CUT',156,128,6,k.S,{w:194});}if(big){wrFoil(k,x,165,w,9,seed);k.t('PIANO WIRE / OPTICAL SCORE',x,184,6,k.A,{w});for(let j=0;j<5;j++)k.ln([[x,213+j*13],[x+w,213+j*13]],k.ia(.17),.4);for(let j=0;j<8;j++){k.rect(x+j*w/8,201,1,75,k.a(T.headBg,.4));k.t(String(j+1).padStart(2,'0'),x+j*w/8+3,280,4.8,k.S,{w:22});}for(let layer=0;layer<9;layer++){let ps=[];for(let i=0;i<=180;i++){const q=i/180;ps.push([x+q*w,230+Math.sin(q*28+seed*.1)*Math.sin(q*3.1416)*(16+layer*2)+layer*3]);}k.ln(ps,k.a(layer%2?T.accent:T.headBg,.3),.45);}wrRule(k,x,298,w,'MASTER','SILENT CUT / CELL 07');wrRule(k,x,324,w,'REQUESTS','No names on the sleeve.');}}
 if(mode==='transmission'){wrRound(k,x,35,w,bottom-35,6,k.I);wrCardDetail(k,x,35,w,bottom-35,seed);wrPixelWeave(k,small?24:big?35:207,small?111:big?199:59,small?124:big?294:139,small?31:big?119:79,seed,6,.8);for(let i=0;i<(big?28:8);i++)k.rect(W-23,59+i*10,3+(i%3===0?2:0),2,k.a(i%4?T.headBg:T.accent,.46));wrGuilloche(k,x+4,40,w-8,bottom-45,seed,k.a(T.headBg,.24));wrFoil(k,x+7,48,w-14,5,seed);k.t(d.archival?'ARCHIVE / ATTRIBUTED':'WITH COMPLIMENTS / CELL 07',x+10,37,5.5,k.PN,{w:w-20});
 const qx=small?x+9:x+12,qy=small?60:64,qw=small?w-18:big?w-24:176,qh=small?42:big?115:49;
 const used=k.para(d.text||'We were never here.',qx,qy,qw,big?28:small?16:23,k.PN,'disp',big?4:small?4:3,1.13,qh);
 k.para(d.by||'WHITE RABBIT / THE LEGION',qx,qy+used+(small?3:8),qw,small?4.6:6.1,k.a(T.panel,.8),'mono',2);
 wrMask({...k,I:k.PN,PN:k.PN},small?48:big?57:210,small?113:big?204:63,small?77:big?250:134,small?30:big?116:76);
 if(big){k.t('AUTHENTICITY DISPUTED',W/2,326,7,k.PN,{a:'c',w:w-24});k.t('One card. Several perfect alibis.',W/2,340,10,k.PN,{a:'c',f:'disp',w:w-24});}}
 if(mode==='feeds'){const cols=small?1:2,cw=(w-10*(cols-1))/cols;for(let i=0;i<cols;i++){const xx=x+i*(cw+10),cy=big?49:46,ch=big?174:67;k.t(i?'VALUATION / THE MARKS':'CASING / SURVEILLANCE',xx,35,6,k.A,{w:cw});wrFeedRecord(k,seed%12,xx,cy,cw,ch,!!i);k.t(i?'OPEN INSTAGRAM':'OPEN YOUTUBE',xx,cy+ch+9,7,k.I,{w:cw});if(big){wrRule(k,xx,253,cw,i?'CUSTODY':'LOOP',i?'UNCLAIMED':'REHEARSED');wrRule(k,xx,280,cw,i?'PROVENANCE':'WITNESS',i?'REVISED':'NO ONE');wrMicro(k,xx,314,cw,25,seed+i,5);wrFoil(k,xx,303,cw,3,seed+i);}}}
 if(mode==='youtube'){const n=seed%12;k.t(WR_VENUES[n],x,36,7,k.I,{w});wrScene(k,n,x,50,w,big?184:small?69:72);k.t('REEL '+String(n+1).padStart(2,'0')+' / FICTIONAL CASING',x,big?244:130,6,k.A,{w});if(big){for(let j=0;j<18;j++)k.rect(x+j*w/18,257,10,3,k.a(j%3?T.ink:T.accent,.45));wrRule(k,x,270,w,'ANGLE','Nobody was looking.');wrRule(k,x,298,w,'DISPOSITION','Rehearse. Return. Remove.');wrMicro(k,x,328,w,15,seed,5);}}
 if(mode==='instagram'){const count=small?1:big?3:2,cw=(w-(count-1)*8)/count;for(let i=0;i<count;i++)wrObjectPlate(k,(seed+i)%12,x+i*(cw+8),36,cw,big?180:105);if(big){const lot=WR_LOTS[seed%12];k.para(lot[0],x,228,w,25,k.I,'disp',1);wrRule(k,x,264,w,'PROVENANCE',lot[1]);wrRule(k,x,289,w,'MATERIAL',lot[2]);k.para(lot[3],x,324,w,16,k.I,'disp',1);}}
 if(mode==='discord'){if(!wrArt(k,'warren',x,36,small?w:158,big?155:90))wrNetwork(k,x,36,small?w:158,big?155:99,seed);else{for(let i=0;i<5;i++){const xx=x+i*(small?w:158)/5;const pp=big?1.25:small?.65:.95;wrPixelGlyph(k,['heart','key','glint','diamond','seal'][i],xx+3,big?177:126,pp,k.a(i===2?T.accent:T.headBg,.9));k.ln([[xx,big?189:134],[xx+24,big?189:134]],k.a(T.headBg,.35),.4);}}if(small)k.t('Five cells. One alibi.',x,133,9,k.I,{f:'disp',w});else{k.para('The Warren',184,39,165,26,k.I,'disp',2);['# next-job','# fences-and-buyers','# rival-crews'].forEach((s,i)=>k.t(s,184,81+i*17,8,k.I,{w:165}));}if(big){k.t('POSTAGE / RECIPIENT PAYS',x,193,6,k.S,{w});wrFoil(k,x,210,w,10,seed);wrRule(k,x,241,w,'RETURN ADDRESS','Never the same twice.');wrRule(k,x,272,w,'NEW ARRIVAL','A familiar stranger.');wrRule(k,x,303,w,'SAFEHOUSE','Keys already exchanged.');k.t('Anyone can wear the ears.',x,334,16,k.I,{f:'disp',w});}}
 if(mode==='oddity'){const n=seed%10,job=WR_JOBS[n];if(small){k.t('TONIGHT / '+String(n+1).padStart(2,'0'),x,37,6,k.A,{w});wrInvitation(k,n,x,47,57,62);k.para(WR_LOTS[n][0],79,49,77,14,k.I,'disp',3);k.t(job[1],x,122,7,k.I,{w});}else{wrInvitation(k,n,x,36,117,big?171:106);k.t('CONTRACT '+String(n+1).padStart(2,'0')+' / OPEN',147,37,6,k.A,{w:203});k.para(WR_LOTS[n][0],147,53,203,23,k.I,'disp',2);k.t(job[1],147,109,7,k.S,{w:203});k.t(job[2],147,128,6.5,k.I,{w:203});if(big){wrMicro(k,147,155,203,44,n,5);wrExit(k,x,228,190,98,n);wrSeal(k,290,271,42,n+1);k.para(job[3],x,334,w,16,k.I,'disp',1);}}}
 if(mode==='game'){const st=d.st||{},taken=st.taken||0,names=['VELVET','CIPHER','SILK','MONOCLE','NOCTURNE','GILT'],alias=names[gVar(st,54,6)];k.t((d.inp?.charging?'SAFEHOUSE / COOLING':'ON THE JOB')+' / '+alias,x,36,6,k.A,{w});k.t(taken+' / 07',x,49,small?24:30,k.I,{f:'disp',w:small?75:115});k.t('HEIRLOOMS',x,small?80:84,5.6,k.S,{w:110});if(small){wrJewel(k,Math.min(6,taken),90,46,65,60);k.t('HEAT '+Math.round(st.heat||0)+' / CREW '+(st.crew||0),x,119,6.5,k.I,{w});}else{k.para(WR_LOTS[Math.min(6,taken)][0],143,51,207,19,k.I,'disp',2);k.t('HEAT '+Math.round(st.heat||0)+' / INTEL '+(st.intel||0),143,108,7,k.I,{w:207});if(big){wrFoil(k,x,131,w,5,seed);k.t('PRIVATE COLLECTION / ABSENCES CERTIFIED',x,141,5,k.S,{w});}const gy=big?158:116,gh=big?96:25;for(let i=0;i<7;i++){const pw=w/7,xx=x+i*pw;if(big){k.rect(xx+3,gy,pw-6,gh-5,k.a(T.headBg,.13),k.ia(.22),.5);for(let j=0;j<6;j++)k.ln([[xx+5,gy+4+j*14],[xx+pw-5,gy+4+j*14]],k.ia(.12),.4);k.t(String(i+1).padStart(2,'0'),xx+pw/2,gy+gh-16,5,k.S,{a:'c',w:pw-8});}k.rect(xx+3,gy+gh-5,pw-6,5,k.I);if(i<taken){k.rect(xx+7,gy+3,pw-14,gh-11,null,k.a(T.accent,.7),.7);wrPixelGlyph(k,i%2?'glint':'heart',xx+pw/2-(big?4.8:2.5),gy+gh*.46-(big?4:2),big?1.25:.65,k.A);}else wrJewel(k,i,xx+3,gy,pw-6,gh-8);}if(big){wrRule(k,x,274,w,'FENCE LEDGER','$'+(st.loot||0)+'K / FICTIONAL');k.para(st.log?.[0]?.m||'Pressed a fresh calling card.',x,307,w,15,k.I,'disp',2);k.t('CHARGE TO LAY LOW / HEAT COOLS ON REFRESH',x,344,6,k.A,{w});}}}
}
