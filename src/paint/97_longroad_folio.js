// The Long Road / Wayfarer's Folio. Shared browser and native compositions.
const LRF_SPRITES = {
 mark01:['marginalia-ink',0.02209945,0.03314917,0.22790055,0.31307551],
 mark02:['marginalia-ink',0.26519337,0.16298343,0.23204420,0.18508287],
 mark03:['marginalia-ink',0.51104972,0.06721915,0.23895028,0.28453039],
 mark04:['marginalia-ink',0.77486188,0.08471455,0.20787293,0.28268877],
 mark05:['marginalia-ink',0.03176796,0.35727440,0.20925414,0.31860037],
 mark06:['marginalia-ink',0.25759669,0.41436464,0.24240331,0.25230203],
 mark07:['marginalia-ink',0.50621547,0.44290976,0.24309392,0.22928177],
 mark08:['marginalia-ink',0.75966851,0.40976059,0.23135359,0.26243094],
 mark09:['marginalia-ink',0.01588398,0.68416206,0.23273481,0.28176796],
 mark10:['marginalia-ink',0.25828729,0.71178637,0.24171271,0.23756906],
 mark11:['marginalia-ink',0.50828729,0.73664825,0.24171271,0.22467772],
 mark12:['marginalia-ink',0.75897790,0.73941068,0.22790055,0.22191529],
 compass:['equipment-ink',0.01352875,0.01916573,0.22717024,0.47350620],
 journey01:['expedition',0.00976562,0.00455729,0.47460938,0.23763021],
 journey02:['expedition',0.50878906,0.01041667,0.47949219,0.22591146],
 journey03:['expedition',0.01269531,0.25651042,0.47656250,0.22851562],
 journey04:['expedition',0.51855469,0.24479167,0.46386719,0.22981771],
 journey05:['expedition',0.01464844,0.49739583,0.47851562,0.24088542],
 journey06:['expedition',0.51464844,0.47721354,0.47265625,0.24414062],
 journey07:['expedition',0.01757812,0.73828125,0.47363281,0.24869792],
 journey08:['expedition',0.52148438,0.72656250,0.45800781,0.25781250],
 person01:['people',0.02106969,0.04709576,0.22366288,0.29356358], person02:['people',0.28525122,0.04003140,0.18638574,0.30376766], person03:['people',0.50891410,0.04709576,0.21636953,0.29748823], person04:['people',0.75931929,0.03375196,0.21474878,0.30612245],
 person05:['people',0.03322528,0.36420722,0.23176661,0.29905808], person06:['people',0.28606159,0.37127159,0.19935170,0.28963893], person07:['people',0.52188006,0.37833595,0.21880065,0.28178964], person08:['people',0.76823339,0.36656201,0.20988655,0.29591837],
 person09:['people',0.02998379,0.68053375,0.19854133,0.28728414], person10:['people',0.27957861,0.67974882,0.19611021,0.28414443], person11:['people',0.49918963,0.69073783,0.24635332,0.26923077], person12:['people',0.76580227,0.67582418,0.21393841,0.29591837],
 omen01:['omens',0.02831492,0.03591160,0.21063536,0.28453039], omen02:['omens',0.27002762,0.01289134,0.20925414,0.30847145], omen03:['omens',0.50345304,0.03683241,0.22928177,0.28545120], omen04:['omens',0.75759669,0.03867403,0.22444751,0.28360958],
 omen05:['omens',0.01519337,0.37661142,0.23411602,0.26611418], omen06:['omens',0.27624309,0.36372007,0.21063536,0.26887661], omen07:['omens',0.52209945,0.34806630,0.21132597,0.28821363], omen08:['omens',0.75345304,0.35267035,0.23204420,0.28360958],
 omen09:['omens',0.02624309,0.69060773,0.20856354,0.27440147], omen10:['omens',0.26104972,0.66666667,0.22513812,0.28453039], omen11:['omens',0.50828729,0.66666667,0.21823204,0.29558011], omen12:['omens',0.75966851,0.73664825,0.21823204,0.22375691],
 place01:['places',0.00976562,0.09635417,0.48144531,0.18424479],place02:['places',0.51464844,0.08984375,0.47949219,0.19726562],place03:['places',0.00976562,0.42057292,0.48828125,0.17317708],
 place04:['places',0.51464844,0.39583333,0.47949219,0.21289062],place05:['places',0.00976562,0.68815104,0.48925781,0.23632812],place06:['places',0.50488281,0.72005208,0.48925781,0.19335938],
 hourglass:['equipment-ink',0.26606539,0.04284104,0.21984216,0.43179256], sundial:['equipment-ink',0.50901917,0.01691094,0.22209696,0.48365276], letters:['equipment-ink',0.75817362,0.06200676,0.23337091,0.38669673], crier:['equipment-ink',0.01352875,0.53551297,0.22266065,0.40924464],
 terrain01:['maps',0.01497396,0.01171875,0.31640625,0.48242188],
terrain02:['maps',0.34830729,0.04003906,0.30143229,0.44531250],
terrain03:['maps',0.66731771,0.02441406,0.31901042,0.46972656],
terrain04:['maps',0.00846354,0.51074219,0.32096354,0.44921875],
terrain05:['maps',0.34179688,0.50683594,0.31510417,0.46875000],
terrain06:['maps',0.65625000,0.51171875,0.33658854,0.46386719],
 minstrel:['equipment-ink',0.25028185,0.52198422,0.23562570,0.43517475], tavern:['equipment-ink',0.50112740,0.51634724,0.24802706,0.46223224],
 stage01:['stages',0.01171875,0.04557292,0.33105469,0.21289062],
 stage02:['stages',0.34765625,0.07747396,0.32910156,0.17903646],
 stage03:['stages',0.69628906,0.05403646,0.29199219,0.19726562],
 stage04:['stages',0.01171875,0.28841146,0.32714844,0.19986979],
 stage05:['stages',0.35156250,0.32682292,0.36132812,0.16341146],
 stage06:['stages',0.71484375,0.29296875,0.27050781,0.20117188],
 stage07:['stages',0.02832031,0.53776042,0.33203125,0.19270833],
 stage08:['stages',0.38964844,0.53125000,0.25585938,0.20768229],
 stage09:['stages',0.68359375,0.55989583,0.30664062,0.17447917],
 stage10:['stages',0.01269531,0.78059896,0.32910156,0.16536458],
 stage11:['stages',0.34277344,0.78776042,0.30859375,0.15364583],
 stage12:['stages',0.66894531,0.78841146,0.32031250,0.16406250]
};
const LRF_META={status:"Traveller's Ledger",shift:'The Road',solar:'Sun & Sky',audio:'The Minstrel',transmission:'Letters & Omens',feeds:'Crier & Gossip',youtube:'The Playbill',instagram:'The Gallery',discord:'The Tavern',oddity:'Road Omens',game:'The Expedition'};
const LRF_PEOPLE=[
 ['The Baker','Brindle','Mara keeps the first loaf for whoever arrives wet.','Bread before bravery.'],
 ["The Miller's Son",'Hollowmere','Ned has counted every turn of the wheel. Except Sundays.','Flour on both cuffs.'],
 ['Old Maud','Sheepcote Hills','She remembers the bridge before it learned to charge a toll.','Knows the shorter story.'],
 ['A Stranger','The Wending Way','Paid for two suppers. Only one chair was warm.','Name left unrecorded.'],
 ['The Smith','Calder road','Elspeth repairs hinges, buckles and occasionally reputations.','No charge for good advice.'],
 ['The Bard','The Lantern Inn','Tobin knows six ballads and the beginnings of forty others.','Encore paid in pie.'],
 ['The Innkeeper','The Lantern Inn','Hett serves supper until the final lamp goes out.','A room can be found.'],
 ['The Ranger','Ashwood','Rowan returns borrowed arrows. Usually with a warning.','Leave the gate as found.'],
 ['The Knight','Old Tower','Sir Ansel guards a road nobody has attacked for years.','Still polishes the buckle.'],
 ['The Herbalist','Fenwick Marsh','Meryn labels every bundle. The labels are mostly cautions.','Bring your own small jar.'],
 ['The Postal Rider','Pinewatch','Finch can deliver an apology three villages ahead of you.','Ink travels by pony.'],
 ['The Ferryman','The Grey Sound','Ebb remembers every face and none of the unpaid fares.','Exact change preferred.']
];
const LRF_OMENS=[
 ['The backward goose','Someone will owe you bread.','The left boot first','FAIR','3 loaves','4 leagues / no pie'],
 ['The singing kettle',"Expect a letter you will not enjoy.",'A borrowed spoon','MIDDLING','1 cheese','2 leagues / loud bard'],
 ['Three eastward crows','Leave before noon, or not at all.','A red thread','MUDDY','2 apples','6 leagues / best stew'],
 ['The twice-risen loaf','Good fortune, if you share it.','The second apple','FAIR','Plenty','1 league / shut'],
 ['The missing milestone','The road is longer than it says.','A smooth stone','UNCERTAIN','No honey','3 leagues / ghost'],
 ['The embarrassed moon','Keep your plans to yourself.','A quiet whistle','MISTY','Half a loaf','5 leagues / warm beds'],
 ['The reconsidering cat','Take the long way. Trust it.','A bent pin','HAUNTED, MILDLY','1 pear','2 leagues / full pantry'],
 ['The warning boots','Mind the bridges today.','Dry socks','RUTTED','Hard cheese','7 leagues / no roof'],
 ['The borrowed spoon','A favour is coming back round.','Copper change','STONY','3 walnuts','4 leagues / fair ale'],
 ['The apple star','A good thing waits in halves.','A clean knife','WINDY','Dried plums','1 league / open fire'],
 ['The patient lantern','Someone has kept a light for you.','A spare wick','CLEAR','Oat cakes','3 leagues / quiet room'],
 ['The slow letter','The news will keep until supper.','A folded map','SOFT','1 onion','2 leagues / fresh bread']
];
const LRF_PLAYS=[['The Borrowed Crown','Brindle green','A comedy in three apologies'],['The Ferryman Sleeps','Hollowmere quay','A lantern play in two tides'],['A Goose at Court','The Lantern Inn','Four players, one bad goose'],['The Last Toll','Calder Ruins','A tragedy with change returned'],['Maud & the Moon','Sheepcote Hills','A shadow play after supper'],['The Invisible Knight','Old Tower','An epic with very little armour'],['Three Loaves Short','Pinewatch square','Music for the hungry traveller'],['The Witch of No Fixed Home','Ashwood edge','A tale told from both sides'],['A Chair for the Ghost','Fenwick Marsh','An intimate and draughty drama'],['The Whale in the Well','Saltmarsh Reach','A puppet show of doubtful scale'],['A Map of Yesterday','The Wending Way','A pageant that arrives late'],['Home Before Winter','Greyhallow Fells','A ballad for the long descent']];
const LRF_PLACES=['Brindle','The Lantern Inn','Hollowmere','Calder Ruins','Old Tower','Greyhallow Fells'];
const lrfSlot=d=>Math.abs(Math.floor(Number.isFinite(d.seed)?d.seed:+(d.now||new Date())/1800000));
const lrfKey=(prefix,n)=>prefix+String(n%12+1).padStart(2,'0');
function lrfSafe(raw){const k={...raw};k.t=(text,x,y,size,c,o={})=>{const s=String(text),w=o.w||300;raw.t(s,x,y,Math.min(size,w/Math.max(1,s.length*.54)),c,{...o,f:'disp',nofit:true});};k.para=(text,x,y,w,fs,c,max=3,height=70)=>{let lines=[];for(let n=0;n<150;n++){const cap=Math.max(1,Math.floor(w/(fs*.54)));lines=[];let cur='';for(const word of String(text).split(/\s+/)){if(cur&&(cur+' '+word).length>cap){lines.push(cur);cur=word;}else cur+=(cur?' ':'')+word;}if(cur)lines.push(cur);if(lines.length<=max&&lines.every(s=>s.length<=cap)&&(raw.lrfWidget&&fs<10?((lines.length-1)*(fs*1.32+1)+fs*1.45):fs*(lines.length*1.16+.3))<=height)break;fs*=.95;}const step=raw.lrfWidget&&fs<10?fs*1.32+1:fs*1.16;lines.forEach((s,i)=>k.t(s,x,y+i*step,fs,c,{w}));return raw.lrfWidget&&fs<10?(lines.length-1)*step+fs*1.45:lines.length*step;};return k;}

// Reading ink for the wider journal leaves. Small leaves and wallpapers keep their
// approved type. Measure by glyph family rather than shrinking every long caption.
function lrfTextUnits(text){return Array.from(String(text)).reduce((n,c)=>n+(/\s/.test(c)?.27:/[ilI.,'’!:;|]/.test(c)?.29:/[mwMW@%]/.test(c)?.87:/[A-Z0-9]/.test(c)?.62:.49),0);}
function lrfReadingLabel(text,size){const s=String(text);return size<16&&!/^\d/.test(s)&&/[A-Z]{2}/.test(s)&&!/[a-z]/.test(s)&&!/^([IVX]+$|PL\.|FIG\.)/.test(s)?s.toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase()).replace(/([’'])S\b/g,'$1s').replace(/\b(Iv|Xii)\b/g,c=>c.toUpperCase()).replace(/\b(By|The|Of|At|For|In|And|To|A)\b/g,(w,word,offset)=>offset?w.toLowerCase():w):s;}
function lrfReadingKit(raw){
 const k={...raw,lrfReadable:true},ink=c=>c===raw.S?raw.I:c;
 k.t=(text,x,y,size,c,o={})=>{const s=lrfReadingLabel(text,size),w=o.w||300,fs=Math.max(12,Math.min(Math.max(12,size),w/Math.max(1,lrfTextUnits(s))));
  raw.t(s,x,y,fs,ink(c),{...o,f:'disp',nofit:true});};
 k.para=(text,x,y,w,size,c,max=3,height=70)=>{
  let fs=Math.max(12,size),lines=[];
  for(let n=0;n<100;n++){
   lines=[];let line='';for(const word of String(text).split(/\s+/)){const next=line?line+' '+word:word;if(line&&lrfTextUnits(next)*fs>w){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);
   if((lines.length<=max&&(lines.length-1)*fs*1.25+fs*1.45<=height&&lines.every(s=>lrfTextUnits(s)*fs<=w))||fs<=12)break;
   fs=Math.max(12,fs*.97);
  }
  lines.forEach((s,i)=>k.t(s,x,y+i*fs*1.25,fs,ink(c),{w}));return lines.length*fs*1.25;
 };return k;
}
function lrfArt(k,key,x,y,w,h){const im=T.lrfImages&&T.lrfImages[key];if(!im)return false;const ratio=im.size?im.size.width/im.size.height:1,dw=Math.min(w,h*ratio),dh=dw/ratio,xx=x+(w-dw)/2,yy=y+(h-dh)/2;
 const panel=parseInt(String(T.panel||'ffffff').replace('#',''),16),dark=(((panel>>16)&255)*.299+((panel>>8)&255)*.587+(panel&255)*.114)<85;
 // Black heraldic silhouettes need a pale paper leaf in Night Ink.
 if(dark&&key.startsWith('omen'))k.poly([[xx,yy+3],[xx+dw*.29,yy],[xx+dw*.58,yy+2],[xx+dw-2,yy],[xx+dw,yy+dh*.36],[xx+dw-1,yy+dh*.7],[xx+dw-3,yy+dh],[xx+dw*.58,yy+dh-1],[xx+dw*.3,yy+dh+1],[xx,yy+dh-2],[xx+1,yy+dh*.5]],k.a('#e8dfc8',.94));
 lrfArtMargins(k,key,x,y,w,h,dw,dh,xx,yy);if(k.storyMasks)k.storyMasks.push([xx-2,yy-2,dw+4,dh+4]);k.dc.drawImageInRect(im,new Rect(xx,yy,dw,dh));return true;}
function lrfRule(k,x,y,w,c){const pts=[];for(let i=0;i<=12;i++)pts.push([x+i*w/12,y+Math.sin(i*1.8+x)*.32]);k.ln(pts,c||k.ia(.52),.65);}

function lrfHatch(k,x,y,w,h,seed=0){for(let j=0;j<h;j+=4){const dx=(j+seed*3)%9;k.ln([[x+dx,y+j],[x+w,y+j-1]],k.ia(.23),.5);}for(let i=2;i<w;i+=9)k.ln([[x+i,y+h],[x+Math.min(w,i+7),y+Math.max(0,h-12)]],k.ia(.28),.6);}
function lrfRose(k,x,y,r){for(let i=0;i<16;i++){const a=i*Math.PI/8,l=i%2?r*.5:r;k.poly([[x,y],[x+Math.cos(a-.13)*l*.45,y+Math.sin(a-.13)*l*.45],[x+Math.cos(a)*l,y+Math.sin(a)*l]],i%4?k.ia(.38):k.A);};k.circ(x,y,r*.64,null,k.ia(.4),.5);k.circ(x,y,2,k.PN,k.I,.5);}
function lrfSeal(k,x,y,r,letter='L'){const pts=[];for(let i=0;i<64;i++){const a=i*Math.PI/32,rr=r*(1+.045*Math.sin(a*11));pts.push([x+rr*Math.cos(a),y+rr*Math.sin(a)]);}k.poly(pts,k.A);k.circ(x,y,r*.77,null,k.a(T.panel,.7),.6);k.t(letter,x,y-r*.52,r*.85,k.PN,{a:'c',w:r*1.3});}
function lrfMarginal(k,x,y,w,h,seed=0){const words=['entered by candlelight','folio carried north','one penny / paid','a fair copy follows','mended at the inn','ink allowed to dry'];for(let j=0;j<Math.floor(h/14);j++){k.t(words[(seed+j)%words.length],x,y+j*14,7,k.ia(.6),{w});lrfRule(k,x,y+j*14+10,w,k.ia(.28));}}
function lrfFrame(k,W,H,d){
 const n=Object.keys(LRF_META).indexOf(d.mode),s=lrfSlot(d);k.rect(0,0,W,H,k.GR);k.rect(3,3,W-6,H-6,k.PN);
 const edge=[];for(let i=0;i<=30;i++)edge.push([5+Math.sin(i*.7+n)*.7,5+i*(H-10)/30]);k.ln(edge,k.ia(.48),.7);k.ln(edge.map(p=>[W-p[0],p[1]]),k.ia(.34),.5);
 for(let side=0;side<2;side++)for(let i=0;i<7;i++){const xx=14+i*(W-28)/6,yy=side?H-5:5;k.ln([[xx-2,yy],[xx+2,yy+.8]],k.ia(.2),.45);}
 k.t(LRF_META[d.mode],W/2,12,W<200?12:16,(d.headerAlt==null?n%3===1:d.headerAlt)?k.A:k.I,{a:'c',w:W-36});
 lrfRule(k,17,31,W-34,k.a(T.accent,.48));k.poly([[13,28],[16,31],[13,34],[10,31]],k.A);k.poly([[W-13,28],[W-10,31],[W-13,34],[W-16,31]],k.A);
 const rng=k.rng(n+33);for(let i=0;i<W*H/350;i++){const x=10+rng()*(W-20),y=34+rng()*(H-61);k.ln([[x,y],[x+1+rng()*2,y+.5]],k.ia(.045),.4);}
 lrfRule(k,16,H-24,W-32,k.ia(.36));k.t(k.lrfReadable&&d.mode==='game'?'Charge to make camp':d.mode==='status'||d.mode==='shift'||d.mode==='solar'?'a leaf carried along the road':'here begins another tale',16,H-(k.lrfReadable&&d.mode!=='game'?19:20),6.3,k.S,{w:W-54});k.t(String((s%144)+1),W-16,H-(k.lrfReadable&&d.mode!=='game'?19:20),7,k.A,{a:'r',w:28});
}

function lrfHourglass(k,x,y,w,h,f){if(lrfArt(k,'hourglass',x-4,y-5,w+8,h+10))return;const cx=x+w/2,my=y+h/2;for(const xx of[x+5,x+w-5]){k.ln([[xx,y+8],[xx,y+h-8]],k.I,1.2);for(let yy=y+10;yy<y+h-8;yy+=4)k.ln([[xx-1.5,yy],[xx+1.5,yy-1]],k.ia(.35),.5);}for(const yy of[y,y+h-6]){k.rect(x,yy,w,6,k.I);k.rect(x+3,yy+2,w-6,1,k.a(T.panel,.5));}const p=[[x+12,y+9],[x+w-12,y+9],[cx+3,my],[x+w-12,y+h-9],[x+12,y+h-9],[cx-3,my]];k.poly(p,k.ia(.035),k.I,.8);const ff=Math.max(.03,Math.min(.95,f)),ty=y+11+ff*(h/2-13);k.poly([[cx-(w/2-12)*(my-ty)/(h/2-9),ty],[cx+(w/2-12)*(my-ty)/(h/2-9),ty],[cx,my-2]],k.a(T.accent,.6));k.poly([[x+13,y+h-10],[x+w-13,y+h-10],[cx,y+h-10-ff*(h/2-12)]],k.A);for(let yy=my;yy<y+h-16;yy+=4)k.circ(cx,yy,.6,k.A);for(let j=0;j<5;j++)k.ln([[x+16+j*3,y+13],[x+20+j*2,y+22]],k.ia(.23),.4);}
function lrfLute(k,x,y,w,h){if(lrfArt(k,'minstrel',x,y,w,h))return;k.ell(x+w*.4,y+h*.65,w*.25,h*.27,k.ia(.08),k.I,1);for(let j=0;j<8;j++)k.ell(x+w*.4,y+h*.65,w*(.12+j*.015),h*.24,null,k.ia(.3),.5);k.poly([[x+w*.46,y+h*.48],[x+w*.73,y+h*.03],[x+w*.8,y+h*.06],[x+w*.52,y+h*.54]],k.PN,k.I,.9);for(let i=0;i<5;i++)k.ln([[x+w*(.32+i*.03),y+h*.8],[x+w*(.72+i*.012),y+h*.07]],k.ia(.6),.4);lrfRose(k,x+w*.4,y+h*.57,w*.085);}
function lrfStage(k,x,y,w,h,n){if(lrfArt(k,lrfKey('stage',n),x,y,w,h)){return;}k.rect(x,y,w,h,k.ia(.025),k.ia(.55),.6);const mid=x+w/2;k.poly([[x,y],[x+w,y],[x+w-7,y+12],[x+7,y+12]],k.a(T.accent,.13),k.A,.6);for(let j=0;j<4;j++){k.ln([[x+3+j*3,y+3],[x+5+j*2,y+h-9]],k.ia(.45),.6);k.ln([[x+w-3-j*3,y+3],[x+w-5-j*2,y+h-9]],k.ia(.45),.6);}k.rect(x+2,y+h-10,w-4,8,k.ia(.12));for(let i=0;i<w;i+=8)k.ln([[x+i,y+h-9],[x+i+3,y+h-3]],k.ia(.35),.5);
 const kind=n%6;if(kind===0){for(let j=0;j<3;j++){const xx=x+w*.27+j*w*.2;k.rect(xx,y+h*.34,w*.1,h*.49,k.PN,k.I,.6);k.poly([[xx-2,y+h*.34],[xx+w*.05,y+h*.19],[xx+w*.1+2,y+h*.34]],k.A);}}else if(kind===1){for(let j=0;j<4;j++){const pts=[];for(let i=0;i<=40;i++)pts.push([x+20+i*(w-40)/40,y+h*.54+j*6+Math.sin(i*.6+j)*2]);k.ln(pts,k.ia(.4),.5);}k.poly([[mid-22,y+h*.55],[mid+26,y+h*.55],[mid+13,y+h*.7],[mid-13,y+h*.7]],k.I);k.ln([[mid,y+h*.57],[mid,y+h*.2]],k.A,.8);k.poly([[mid+2,y+h*.22],[mid+2,y+h*.52],[mid+25,y+h*.5]],k.PN,k.I,.6);}else if(kind===2){for(let j=0;j<5;j++){const xx=x+25+j*(w-50)/4;k.poly([[xx,y+16],[xx-10,y+h-15],[xx+10,y+h-15]],null,k.ia(.6),.7);for(let q=0;q<8;q++)k.ln([[xx-q,y+30+q*3],[xx+q,y+30+q*3]],k.ia(.4),.5);}}else if(kind===3){k.arc(mid,y+h*.8,w*.26,Math.PI,Math.PI*2,k.I,2);k.arc(mid,y+h*.8,w*.19,Math.PI,Math.PI*2,k.I,.7);for(let j=0;j<8;j++){const xx=x+23+j*(w-46)/7;k.rect(xx,y+h*.74,6,7,k.PN,k.I,.5);}}else if(kind===4){k.circ(mid,y+h*.44,h*.22,k.ia(.1),k.I,.6);for(let i=0;i<12;i++){const a=i*Math.PI/6;k.ln([[mid+Math.cos(a)*h*.25,y+h*.44+Math.sin(a)*h*.25],[mid+Math.cos(a)*h*.31,y+h*.44+Math.sin(a)*h*.31]],k.A,.5);}}else{for(let j=0;j<3;j++){const xx=x+24+j*(w-48)/2;k.poly([[xx-17,y+h*.75],[xx,y+h*.2+j*4],[xx+19,y+h*.75]],k.ia(.045),k.I,.7);lrfHatch(k,xx-7,y+h*.55,16,h*.2,j);}}
 if(n>5){k.ln([[x+20,y+h*.82],[x+w-20,y+h*.82]],k.A,1);for(let j=0;j<4;j++)k.circ(x+30+j*(w-60)/3,y+h*.82,2.2,k.I);} }
function lrfTavern(k,x,y,w,h){if(lrfArt(k,'tavern',x,y,w,h))return;k.rect(x,y,w,h,k.ia(.025),k.I,.8);for(let j=0;j<Math.floor(h/7);j++)lrfRule(k,x+3,y+j*7,w-6,k.ia(.12));k.rect(x+5,y+7,w*.23,h*.23,k.PN,k.I,.8);for(let j=0;j<6;j++)lrfRule(k,x+8,y+10+j*4,w*.18,k.ia(.3));k.rect(x+w*.71,y+5,w*.25,h*.32,k.PN,k.I,.8);for(let j=0;j<7;j++)lrfRule(k,x+w*.72,y+7+j*(h*.3/7),w*.22,k.I);k.rect(x+w*.36,y+h*.24,w*.23,h*.6,k.PN,k.I,1.2);for(let j=0;j<4;j++){const yy=y+h*.32+j*h*.13;for(const xx of[x+w*.29,x+w*.64]){k.rect(xx-3,yy-3,6,6,k.a(T.accent,.17),k.I,.7);k.circ(xx,yy,1,k.A);}k.circ(x+w*.44,yy,2,k.PN,k.A,.6);k.ln([[x+w*.53,yy-2],[x+w*.53,yy+2]],k.I,.6);}k.arc(x+w*.14,y+h*.7,w*.085,0,Math.PI*2,k.I,.8);for(let j=0;j<3;j++)k.circ(x+w*.12+j*3,y+h*.7,1,k.A);k.ln([[x+w*.78,y+h*.6],[x+w*.9,y+h*.85]],k.I,1);k.ln([[x+w*.9,y+h*.6],[x+w*.78,y+h*.85]],k.A,1);}
function lrfLandscape(k,x,y,w,h,kind){const rng=k.rng(kind*37+81),hill=[];for(let i=0;i<=100;i++)hill.push([x+i*w/100,y+h*.5+Math.sin(i*.08+kind)*h*.12+Math.sin(i*.27)*h*.04]);k.poly([[x,y+h],...hill,[x+w,y+h]],k.ia(.035));k.ln(hill,k.I,.8);for(let i=0;i<45;i++){const xx=x+rng()*w,yy=y+h*.6+rng()*h*.32;k.ln([[xx,yy],[Math.min(x+w,xx+3+rng()*6),yy-2]],k.ia(.18),.45);}for(let i=0;i<10;i++){const xx=x+12+i*(w-24)/10,yy=y+h*.43+Math.sin(i+kind)*h*.1;if(kind%3===0)k.poly([[xx-9,yy+10],[xx,yy-20],[xx+12,yy+10]],null,k.I,.7);else if(kind%3===1){k.rect(xx-4,yy,8,12,k.PN,k.I,.6);k.poly([[xx-6,yy],[xx,yy-8],[xx+6,yy]],k.A);}else{k.ell(xx,yy,8,6,null,k.ia(.6),.6);k.ln([[xx,yy],[xx,yy+18]],k.I,.7);}}}
function lrfTimerLayout(W,H){return W<200?{x:79,y:103,w:77,fs:23}:{x:132,y:103,w:218,fs:28};}
function lrfDuration(ms){const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function lrfAstrolabe(k,x,y,r){for(let j=0;j<5;j++)k.circ(x,y,r-j*1.9,null,k.ia(j%2?.3:.7),.5);for(let j=0;j<60;j++){const a=j*Math.PI/30;k.ln([[x+Math.cos(a)*(r-4),y+Math.sin(a)*(r-4)],[x+Math.cos(a)*(r-(j%5?7:11)),y+Math.sin(a)*(r-(j%5?7:11))]],k.I,.5);}lrfRose(k,x,y,r*.64);k.ln([[x-r*.7,y+r*.3],[x+r*.7,y-r*.3]],k.A,1.2);k.circ(x,y,r*.1,k.PN,k.I,.6);}
function lrfPostmark(k,x,y,r){k.circ(x,y,r,null,k.ia(.6),.7);k.circ(x,y,r-3,null,k.ia(.5),.5);k.t('PAID',x,y-4,r*.4,k.A,{a:'c',w:r*1.5});for(let j=-2;j<=2;j++){const p=[];for(let i=0;i<22;i++)p.push([x-r+i*r*2/21,y+j*5+Math.sin(i*.5)]);k.ln(p,k.ia(.18),.5);}}
function lrfWeatherMark(k,x,y,n){if(n===0){k.ell(x,y-3,7,3,null,k.I,.6);for(let j=-1;j<=1;j++)k.ln([[x+j*4,y+2],[x+j*4-2,y+7]],k.A,.7);}else if(n===1){for(let j=0;j<3;j++)k.arc(x,y+j*3,7,0,Math.PI,k.I,.6);}else if(n===2){k.circ(x,y,3,null,k.I,.8);for(let j=0;j<8;j++){const a=j*Math.PI/4;k.ln([[x+5*Math.cos(a),y+5*Math.sin(a)],[x+8*Math.cos(a),y+8*Math.sin(a)]],k.A,.6);}}else if(n===3){k.poly([[x-9,y+5],[x-2,y-6],[x+4,y+5]],null,k.I,.6);k.poly([[x,y+5],[x+6,y-3],[x+11,y+5]],null,k.I,.6);}else if(n===4){k.poly([[x,y-9],[x-5,y+2],[x,y+6],[x+5,y+2]],null,k.I,.7);k.ln([[x,y-5],[x,y+3]],k.A,.6);}else{for(let j=0;j<3;j++){const p=[];for(let i=0;i<17;i++)p.push([x-8+i,y+(j-1)*4+Math.sin(i*.2+j)]);k.ln(p,k.I,.6);}}}
function lrfMap(k,x,y,w,h,n,details=true,labels=true){
 const lands=[['Brindle','Ashwood','Pinewatch'],['The Lantern Inn','Wending Way','Sheepcote'],['Hollowmere','Fenwick Marsh','The ferry'],['Calder Ruins','Old road','East gate'],['Old Tower','Grey Sound','Saltmarsh'],['Greyhallow','High pass','The descent']][n%6];
 lrfBranch(k,x+1,y+5,5,h-10,n);const rng=k.rng(103+n*53),cols=6,rows=4;

 if(n===2||n===4){const water=[];for(let i=0;i<=55;i++)water.push([x+w*.57+Math.sin(i*.14+n)*w*.11,y+i*h/55]);k.poly([[x+w,y],...water,[x+w,y+h]],k.a(T.accent,.06),k.ia(.3),.5);for(let j=0;j<24;j++){const yy=y+7+j*(h-14)/24,xx=x+w*.76+Math.sin(j*.3)*w*.04;lrfRule(k,xx,yy,w*.17,k.ia(.28));}}
 else if(n===1||n===3){const river=[];for(let i=0;i<=80;i++)river.push([x+i*w/80,y+h*.5+Math.sin(i*.09+n)*h*.21]);for(let q=-1;q<=1;q++)k.ln(river.map(p=>[p[0],p[1]+q*2]),k.ia(q?.24:.55),.6);}
 for(let j=0;j<(details?70:24);j++){const xx=x+8+rng()*(w-16),yy=y+12+rng()*(h-24);if(xx>x+w*.55&&(n===2||n===4))continue;if(n===5||j%5===0){const hh=7+rng()*(n===5?17:9);k.poly([[xx-5,yy+3],[xx,yy-hh],[xx+9,yy+4]],k.PN,k.ia(.55),.5);for(let q=0;q<4;q++)k.ln([[xx+q*1.7,yy-hh+q*4],[xx+q*1.7+3,yy+2]],k.ia(.22),.4);}else if(n===0||n===1||n===3){k.poly([[xx,yy-7],[xx-4,yy],[xx-2,yy],[xx-5,yy+4],[xx+5,yy+4],[xx+2,yy],[xx+4,yy]],k.ia(.06),k.ia(.45),.45);k.ln([[xx,yy+4],[xx,yy+7]],k.I,.45);}else lrfRule(k,xx,yy,4+rng()*5,k.ia(.23));}
 const paths=[[[.12,.74],[.38,.48],[.72,.24]],[[.13,.28],[.49,.52],[.83,.77]],[[.12,.2],[.34,.5],[.56,.8]],[[.22,.78],[.49,.34],[.81,.63]],[[.17,.75],[.41,.49],[.3,.17]],[[.14,.82],[.47,.5],[.8,.19]]][n%6];
 for(let q=0;q<2;q++){const a=paths[q],b=paths[q+1];for(let i=0;i<40;i+=2){const t=i/40,tt=(i+1)/40;k.ln([[x+(a[0]+(b[0]-a[0])*t)*w,y+(a[1]+(b[1]-a[1])*t)*h],[x+(a[0]+(b[0]-a[0])*tt)*w,y+(a[1]+(b[1]-a[1])*tt)*h]],k.A,1.4);}}
 paths.forEach((p,i)=>{const xx=x+p[0]*w,yy=y+p[1]*h;k.rect(xx-5,yy-8,10,10,k.PN,k.I,.8);k.poly([[xx-7,yy-8],[xx,yy-15],[xx+7,yy-8]],k.A);k.rect(xx-2,yy-4,3,6,k.I);const labelW=Math.min(w*.38,110),lx=Math.max(x+4,Math.min(x+w-labelW-4,xx-labelW/2));if(labels){k.rect(lx,yy+6,labelW,13,k.PN);k.t(lands[i],lx+labelW/2,yy+7,9,k.I,{w:labelW,a:'c'});}});
 lrfRose(k,x+w-24,y+h-26,15);k.t('N',x+w-24,y+h-50,6,k.A,{a:'c',w:10});if(labels&&h>110)k.t('a survey, not a promise',x+7,y+h-14,6,k.S,{w:w*.58});
}
function lrfPoster(raw,W,H,d){const k=lrfSafe(raw),n=Math.abs(d.index||0)%6,home=d.mode==='home',top=home?177:228,detail=d.knobs?.details!==false;const name=LRF_PLACES[n];
 k.t(home?'A leaf from the wayfarer’s folio':'Surveyed by the Cartographers’ Guild',W/2,top+2,9,k.A,{a:'c',w:W-70});lrfRule(k,30,top+20,W-60);
 if(home){
  k.t(name,W/2,top+34,30,k.I,{a:'c',w:W-70});const y=top+82,ah=174;lrfArt(k,'place0'+(n+1),29,y,W-58,ah);
  k.t(['Where the bread is still warm.','There is a place by the fire.','Every crossing has a story.','Even a ruin can give shelter.','The sea keeps the longer watch.','One more ridge. Then home.'][n],W/2,y+ah+13,13,k.I,{a:'c',w:W-60});
  const my=y+ah+45;lrfMap(k,31,my,205,137,n,detail);lrfMarginal(k,248,my+3,106,76,n);lrfSeal(k,299,my+107,19,'L');k.t('POSTAL RIDERS',299,my+132,6,k.A,{a:'c',w:102});lrfRule(k,31,my+151,W-62);k.t('Go gently. Leave the gate as found.',W/2,my+163,13,k.I,{a:'c',w:W-64});
 }else{
  k.t(name,W/2,top+32,27,k.I,{a:'c',w:W-60});if(!lrfArt(k,'terrain0'+(n+1),30,top+76,W-60,294))lrfMap(k,30,top+76,W-60,294,n,detail);const p=Array.isArray(d.phrase)?d.phrase:[String(d.phrase||'The road goes on')];let yy=top+386;for(const line of p){k.t(d.upper?line.toUpperCase():line,W/2,yy,39,k.I,{a:'c',w:W-60});yy+=42;}lrFlourish(k,76,yy+11,W-152);k.t('A map is only the beginning.',W/2,yy+25,11,k.A,{a:'c',w:W-64});
 }
}
// Revision 2: page-body printing, distinct to each institution.
function lrfBox(k,x,y,w,h,title,red=false){
 if(title){k.t(title,x+2,y+2,7.2,red?k.A:k.I,{w:w-4});lrfRule(k,x+2,y+12,w-4,k.ia(.3));}
 else {k.ln([[x,y+9],[x+1,y+2],[x+9,y]],k.ia(.32),.6);k.ln([[x+w-9,y+h],[x+w-1,y+h-2],[x+w,y+h-9]],k.ia(.32),.6);}
}

function lrfStrip(k,x,y,w,label,seed=0){
 k.t(label,x+w/2,y+1,6.8,k.A,{a:'c',w:w-20});for(const xx of[x+3,x+w-3]){k.ln([[xx-2,y+6],[xx,y+2],[xx+2,y+6]],k.ia(.45),.5);}
}

function lrfRows(k,x,y,w,rows,step=18,fs=8){
 rows.forEach((r,i)=>{const yy=y+i*step;k.t(r[0],x+3,yy+3,fs,k.A,{w:w*.47-6});k.t(r[1],x+w-3,yy+3,fs,k.I,{a:'r',w:w*.51-6});if(i<rows.length-1){for(let q=0;q<3;q++)k.circ(x+w*.49+q*2,yy+step-2,.45,k.ia(.28));}});
}

function lrfFiligree(k,x,y,w,h,seed=0){
 const mode=k.pageMode||'status';
 if(mode==='instagram'){lrfBranch(k,x+3,y+4,5,h-8,seed);lrfBranch(k,x+w-5,y+4,5,h-8,seed+2);}
 else if(mode==='solar'){for(let i=0;i<11;i++){const xx=x+4+(i*31%Math.max(10,w-8)),yy=y+3+(i*17%Math.max(10,h-8));lrfStar(k,xx,yy,1.6+i%3,k.ia(.24));}}
 else if(mode==='audio'){for(let i=0;i<5;i++)lrfRule(k,x,y+h*.25+i*3,w,k.ia(.13));lrfBranch(k,x+2,y+h*.5,5,h*.48,2);}
 else if(mode==='discord'&&!k.journeyDetail){lrfWoods(k,x+5,y+h-3,w*.25,20,2);lrfWoods(k,x+w*.76,y+h-3,w*.22,26,4);}
 else if(mode==='oddity'){for(let i=0;i<6;i++)lrfStar(k,x+4+(i*17%(w-8)),y+4+(i*23%(h-8)),1.8,k.ia(.22));}
 else lrfBranch(k,x+2,y+4,7,h-8,seed);
}

function lrfPlate(k,x,y,w,h,key){if(!lrfArt(k,key,x,y,w,h)){lrfLandscape(k,x,y,w,h,2);k.t('A drawing follows by post',x+w/2,y+h-12,7,k.I,{a:'c',w:w-12});}}

function lrfNewCompass(k,x,y,w,h){if(!lrfArt(k,'compass',x,y,w,h)){lrfAstrolabe(k,x+w/2,y+h/2,Math.min(w,h)*.44);} }
function lrfMusic(k,x,y,w,h,seed=0){
 for(let row=0;row<Math.max(1,Math.floor(h/33));row++){const yy=y+row*33;for(let j=0;j<5;j++)lrfRule(k,x,yy+j*3,w,k.ia(.5));for(let q=0;q<10;q++){const xx=x+7+q*(w-14)/10,ny=yy+((q*3+row+seed)%5)*3;k.ell(xx,ny,2.2,1.3,k.I);k.ln([[xx+1.5,ny],[xx+1.5,ny-7]],k.I,.65);if(q%3===0)k.ln([[xx+1.5,ny-7],[xx+5,ny-5]],k.A,.7);}for(let q=1;q<4;q++)k.ln([[x+q*w/4,yy],[x+q*w/4,yy+12]],k.ia(.8),.6);}
}
function lrfV2Ground(k,W,H,d){
 const n=Object.keys(LRF_META).indexOf(d.mode);for(let y=42;y<H-32;y+=23){const x=n%2?W-9:9;k.ln([[x,y],[x+(n%2?-2:2),y+4],[x,y+8]],k.a(T.accent,.24),.45);}
}

function lrfJourneyKey(st){return 'journey'+String(gVar(st||{},11,4)*2+(st?.camp?2:1)).padStart(2,'0');}
function lrfCompanion(st){return ['travelling alone','with a dog','with a crow','with a donkey','with a cat'][gVar(st||{},13,5)];}
function lrfGameFolio(k,W,H,d){
 const st=d.st||{},small=W<200,big=H>200,camp=!!st.camp,key=lrfJourneyKey(st),name=st.name||'A traveller',place=st.place||'Brindle',food=st.food||0,gold=st.gold||0,hp=st.hp||0;
 if(small){
  lrfPlate(k,16,36,81,69,key);lrfStitch(k,16,36,81,69);lrfBox(k,101,36,53,69,camp?'CAMP':'ROAD',true);
  [['Day',st.day||1],['Miles',st.miles||0],['Health',hp+'/10']].forEach((r,i)=>{k.t(r[0],105,52+i*16,6,k.S,{w:42});k.t(String(r[1]),150,58+i*16,9,k.I,{a:'r',w:41});});
  k.t(name,17,107,12,k.I,{w:136});k.t(place+' / '+(camp?'resting':'walking'),17,123,7,k.A,{w:136});
  lrfStrip(k,17,134,136,'Bread '+food+' / Gold '+gold);
 }else if(!big){
  lrfPlate(k,17,35,135,111,key);lrfStitch(k,17,35,135,111);k.para(name,163,35,183,22,k.I,2,30);k.t(place+' / '+lrfCompanion(st),163,67,12,k.A,{w:183});k.t((camp?'Camp made':'On the road')+' / Day '+(st.day||1)+' / '+(st.miles||0)+' mi',163,83,12,k.I,{w:183});
  for(const [i,label,value]of [[0,'BREAD',food],[1,'GOLD',gold],[2,'HEALTH',hp+'/10']]){const xx=163+i*62;lrfBox(k,xx,97,58,30,label,i===2);k.t(String(value),xx+29,113,14,k.I,{a:'c',w:48});}
  const items=st.items||[],pack=items.join(', ')||'travelling light';k.t('Pack / '+(lrfTextUnits(pack)*12<144?pack:items.length+' possessions'),164,133,12,k.A,{w:181});
 }else{
  lrfPlate(k,18,36,209,153,key);lrfStitch(k,18,36,209,153);lrfStrip(k,22,194,201,camp?'A fire kept / resting':'A footstep / walking');
  lrfBox(k,233,36,113,175,'Travel account',true);
  [['Day',st.day||1],['Miles',st.miles||0],['Bread',food],['Gold',gold],['Health',hp+'/10'],['Best',st.best||0]].forEach((r,i)=>{const yy=51+i*23;k.t(r[0],240,yy,8,k.S,{w:44});k.t(String(r[1]),339,yy+2,13,k.I,{a:'r',w:54});lrfRule(k,238,yy+19,103,k.ia(.36));});
  lrfRule(k,21,244,322,k.ia(.35));k.t(name,20,216,25,k.I,{w:324});k.t(place+' / '+lrfCompanion(st),20,246,10,k.A,{w:324});
  lrfBox(k,20,264,324,45,'POSSESSIONS, WRAPPED AGAIN');const packed=(st.items||[]).join(' / ')||'A little space for what comes next.';
  const packHeight=k.para(packed,26,283,311,12,k.I,2,32);
  const logs=(st.log||[]).slice(-3).reverse();let yy=288+packHeight;
  for(let i=0;i<3;i++){
   const entry=String(logs[i]?.m||logs[i]||['The page is waiting.','Boots drying by the door.','Bread saved for tomorrow.'][i]);
   const lines=Math.ceil(lrfTextUnits(entry)*12/294),height=lines*15;
   if(yy+height>354)break;
   k.t(['I','II','III'][i],22,yy,12,k.A,{w:15});const used=k.para(entry,43,yy,294,12,k.I,lines,height+3);
   const free=294-lrfTextUnits(entry)*12;if(free>45)lrfTrailScene(k,347-free,yy,free-9,11,i+2,i);
   yy+=used+3;
  }
 }
}
// Revision 3: printer's devices, kept within each widget's own page composition.
function lrfPrinterScroll(k,x,y,w,h,seed=0,alpha=.46){
 const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push([x+t*w,y+h*.5+Math.sin(t*Math.PI*4+seed)*h*.2]);}k.ln(p,k.ia(alpha),.65);
 for(let i=3;i<58;i+=4){const [xx,yy]=p[i],sign=i%8===3?-1:1,dx=Math.max(2,Math.min(7,w/15)),dy=h*.33*sign;
  k.poly([[xx,yy],[xx+dx*.1,yy+dy*.8],[xx+dx,yy+dy],[xx+dx*.7,yy+dy*.25]],k.ia(alpha*.25),k.ia(alpha),.5);
  k.ln([[xx,yy],[xx+dx,yy+dy]],k.ia(alpha),.4);
  if(i%12===3)k.circ(xx+dx+1,yy+dy*.7,1,k.a(T.accent,alpha));
 }
}
function lrfGuilloche(k,x,y,w,h,n=0){const p=[];for(let i=0;i<=60;i++)p.push([x+i*w/60,y+h*.5+Math.sin(i*.2+n)*h*.4]);k.ln(p,k.ia(.45),.65);for(let i=3;i<60;i+=9)k.ln([[p[i][0],p[i][1]],[p[i][0]+3,p[i][1]-2]],k.A,.6);}

function lrfInitial(k,x,y,w,h,letter){k.t(letter,x+w/2,y+h*.02,h*.76,k.A,{a:'c',w:w-2});lrfBranch(k,x,y+2,4,h-4,1);}

function lrfStitch(k,x,y,w,h){lrfBranch(k,x+1,y+4,4,h-8,2);k.ln([[x+w-12,y+h],[x+w-3,y+h-2],[x+w,y+h-7]],k.ia(.4),.65);}

function lrfPenwork(k,x,y,w,h,n=0){
 for(let r=0;r<Math.floor(h/5);r++){const yy=y+3+r*5,p=[];for(let i=0;i<Math.floor(w/2);i++){const xx=x+i*2;p.push([xx,yy+Math.sin(i*1.7+r+n)*1.2+Math.sin(i*.33+n)*.7]);}k.ln(p,k.ia(.075),.45);}
}
function lrfPrinterCorner(k,x,y,sx,sy,n=0){k.ln([[x+12*sx,y],[x+3*sx,y+2*sy],[x,y+12*sy]],k.ia(.5),.6);k.ln([[x+3*sx,y+3*sy],[x+7*sx,y+7*sy]],k.A,.6);k.poly([[x+7*sx,y+7*sy],[x+10*sx,y+7*sy],[x+7*sx,y+10*sy]],k.ia(.35));}

function lrfFinePrint(k,W,H,d){
 const small=W<200,big=H>200,m=d.mode;
 if(m==='shift'){lrfWoods(k,21,141,small?47:89,12,3);}
 else if(m==='solar'){for(let i=0;i<3;i++)lrfStar(k,small?151:342,42+i*22,2.5,k.ia(.3));}
 else if(m==='audio'){lrfBranch(k,small?88:164,42,5,95,3);}
 else if(m==='transmission'){lrfBranch(k,20,57,4,big?109:46,1);}
 else if(m==='youtube'){if(!small)lrfBranch(k,351,46,4,82,2);}
 else if(m==='oddity'){lrfBranch(k,small?77:151,54,5,82,1);}
 else if(m==='game'){lrfRoadInk(k,W-10,42,3,H-74,1);}
}


function lrfStar(k,x,y,r,c){k.ln([[x-r,y],[x+r,y]],c||k.A,.6);k.ln([[x,y-r*1.4],[x,y+r*1.4]],c||k.A,.6);}
function lrfBranch(k,x,y,w,h,n=0){const p=[];for(let i=0;i<=30;i++){const t=i/30;p.push([x+w*.5+Math.sin(t*5+n)*w*.35,y+t*h]);}k.ln(p,k.ia(.37),.6);for(let i=2;i<29;i+=4){const [xx,yy]=p[i],side=i%8===2?1:-1;k.poly([[xx,yy],[xx+side*w*.6,yy-3],[xx+side*w*.45,yy+2]],k.ia(.18),k.ia(.4),.4);}}
function lrfWoods(k,x,y,w,h,n=0){if(k.journeyDetail&&lrfArt(k,'mark09',x,y-h,w,h))return;for(let i=0;i<Math.max(2,Math.floor(w/12));i++){const xx=x+5+i*12,hh=h*(.65+((i+n)%3)*.15);k.poly([[xx,y-hh],[xx-4,y-hh*.58],[xx-2,y-hh*.58],[xx-6,y-hh*.23],[xx-3,y-hh*.23],[xx-7,y-3],[xx+7,y-3],[xx+3,y-hh*.23],[xx+6,y-hh*.23],[xx+2,y-hh*.58],[xx+4,y-hh*.58]],k.ia(.15),k.ia(.66),.65);k.ln([[xx,y+1],[xx,y-hh*.8]],k.ia(.7),.7);for(let q=1;q<4;q++)k.ln([[xx,y-hh+q*hh*.22],[xx+q*1.3,y-hh+q*hh*.22+3]],k.ia(.5),.55);}}

function lrfPeaks(k,x,y,w,h,n=0){if(k.journeyDetail&&lrfArt(k,'mark10',x,y-h,w,h))return;for(let i=0;i<Math.max(2,Math.floor(w/24));i++){const xx=x+i*24,hh=h*(.7+(i+n)%3*.12);k.poly([[xx,y],[xx+7,y-hh*.45],[xx+9,y-hh*.39],[xx+13,y-hh],[xx+17,y-hh*.73],[xx+19,y-hh*.78],[xx+29,y]],k.PN,k.ia(.77),.85);k.ln([[xx+13,y-hh],[xx+12,y-hh*.62],[xx+17,y-hh*.39],[xx+14,y]],k.ia(.6),.65);for(let q=0;q<6;q++)k.ln([[xx+17+q*1.5,y-hh*.54+q*hh*.075],[xx+17+q*1.5,y-1]],k.ia(.45),.65);}}

function lrfRoadInk(k,x,y,w,h,n=0){const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push([x+w*.5+Math.sin(t*6+n)*w*.42,y+t*h]);}k.ln(p,k.a(T.accent,.68),.8);for(let i=1;i<60;i+=4)k.ln([[p[i][0]+3,p[i][1]],[p[i+1][0]+3,p[i+1][1]]],k.ia(.6),.7);}

// Revision 5: small remembered places, drawn in the same ink as the folio.
// These are fictional marginalia, independent of real readings and saved game events.
function lrfWaymark(k,x,y,s,kind=0,alpha=.7){
 if(k.journeyDetail&&lrfArt(k,'mark'+String(Math.abs(kind)%8+1).padStart(2,'0'),x-20*s,y-22*s,40*s,44*s))return;
 const pt=p=>[x+p[0]*s,y+p[1]*s],ink=k.ia(alpha),red=k.a(T.accent,alpha),line=(p,c=ink,l=.65)=>k.ln(p.map(pt),c,l),poly=(p,fill=k.PN,c=ink)=>k.poly(p.map(pt),fill,c,.65);
 const ring=(xx,yy,r)=>k.circ(x+xx*s,y+yy*s,r*s,null,ink,.6);
 if(kind===0){ // A crooked village gate.
  poly([[-12,8],[-12,-4],[-5,-4],[-5,8]]);poly([[5,8],[5,-7],[12,-7],[12,8]]);
  poly([[-14,-4],[-9,-13],[-3,-4]],k.a(T.accent,.13));poly([[3,-7],[9,-16],[14,-7]],k.a(T.accent,.13));
  line([[-5,-1],[5,-1],[5,8]]);line([[-3,8],[-3,3],[0,0],[3,3],[3,8]]);
  for(const xx of [-10,-7,7,10])line([[xx,-1],[xx,3]]);line([[9,-16],[9,-21],[16,-19],[9,-17]],red);
  line([[-16,10],[-4,10],[1,12],[17,10]]);
 }else if(kind===1){ // A bridge with an unfinished toll riddle.
  line([[-15,7],[-12,-2],[-6,-6],[5,-6],[12,-2],[16,7]]);line([[-14,4],[-9,-4],[8,-4],[15,4]]);
  line([[-8,7],[-6,0],[-2,-2],[3,-2],[7,1],[9,7]]);
  for(let i=-11;i<=11;i+=4)line([[i,-4],[i,-8]]);
  for(let j=0;j<3;j++)line([[-17,10+j*3],[-8,9+j*3],[1,11+j*3],[9,10+j*3],[17,12+j*3]],k.ia(alpha*.55));
  line([[13,-4],[13,-16],[20,-16],[20,-10],[13,-10]],red);line([[16,-14],[18,-14],[17,-11]],red);
 }else if(kind===2){ // An abandoned watchtower.
  poly([[-6,11],[-5,-15],[-8,-15],[-8,-20],[-4,-20],[-4,-17],[0,-17],[0,-21],[4,-21],[4,-18],[8,-18],[8,-14],[5,-14],[7,11]]);
  line([[-2,-10],[2,-10],[2,-4],[-2,-4],[-2,-10]]);line([[-2,11],[-2,4],[1,2],[4,4],[4,11]],red);
  for(let j=0;j<4;j++)line([[-4,j*5-9],[j%2?3:0,j*5-9]],k.ia(alpha*.6));
  line([[-15,14],[-10,9],[-5,12],[7,11],[12,7],[17,14]]);
 }else if(kind===3){ // The whispering well.
  poly([[-8,4],[-8,11],[8,11],[8,4]],k.PN);line([[-8,4],[-3,1],[6,2],[8,4],[-8,4]]);
  line([[-12,10],[-12,-10],[12,-10],[12,10]]);poly([[-16,-10],[-2,-18],[16,-10]],k.a(T.accent,.12));
  line([[1,-9],[1,3]],red);poly([[-2,1],[-1,5],[4,5],[5,1]],k.PN);ring(-12,-5,2);
  line([[-16,14],[-7,13],[4,15],[17,13]],k.ia(alpha*.55));
 }else if(kind===4){ // A mill along the remembered watercourse.
  poly([[-7,12],[-5,-10],[5,-10],[7,12]]);poly([[-9,-10],[0,-18],[9,-10]],k.a(T.accent,.12));
  for(let j=0;j<4;j++){const a=j*Math.PI/2+.45,c=Math.cos(a),sn=Math.sin(a);line([[0,-5],[c*17,-5+sn*17],[c*17-sn*4,-5+sn*17+c*4],[c*5-sn*3,-5+sn*5+c*3]],ink);}
  ring(0,-5,2);line([[-2,12],[-2,6],[2,6],[2,12]]);line([[-15,14],[-4,13],[7,15],[17,13]],red);
 }else if(kind===5){ // A door that the survey forgot.
  const p=[];for(let i=0;i<=24;i++)p.push([-18+i*1.5,10-Math.sin(i*Math.PI/24)*24]);line(p);
  line([[-5,10],[-5,1],[-2,-4],[2,-4],[6,1],[6,10]],red);line([[-3,10],[-3,1],[0,-2],[4,1],[4,10]]);
  for(let j=0;j<4;j++)line([[-9+j*2,13+j*3],[9+j*2,13+j*3]],k.ia(alpha*.6));
  line([[-13,2],[-10,-2],[-7,-1]]);ring(2,5,.8);
 }else if(kind===6){ // A ferry pulled by one long rope.
  poly([[-15,3],[-9,9],[9,9],[16,2],[-15,3]],k.PN);line([[-8,2],[-6,-5],[8,-5],[10,2]]);
  line([[1,2],[1,-18],[9,-14],[1,-9]],red);line([[-17,-4],[-10,-1],[0,1],[16,-5]],k.ia(alpha*.6));
  for(let j=0;j<3;j++)line([[-19,13+j*3],[-7,11+j*3],[3,14+j*3],[18,12+j*3]],k.ia(alpha*.6));
 }else{ // Three stones, one missing from the map.
  for(let i=0;i<3;i++){const xx=-12+i*12,hh=[10,19,13][i];poly([[xx-3,12],[xx-4,2-hh],[xx, -hh],[xx+4,2-hh],[xx+3,12]]);line([[xx,6-hh],[xx,9]],i===1?red:ink);line([[xx-2,9-hh],[xx+2,7-hh]],red);}
  for(let j=0;j<4;j++)line([[-19+j*3,15+j*2],[11+j*3,15+j*2]],k.ia(alpha*.35));
 }
}
function lrfHill(k,x,y,w,h,alpha=.35){
 const p=[];for(let i=0;i<=24;i++){const t=i/24;p.push([x+t*w,y-Math.sin(t*Math.PI)*h*(.86+.14*Math.sin(t*9))]);}k.ln(p,k.ia(alpha),.55);
 for(let i=2;i<22;i+=2){const [xx,yy]=p[i];k.ln([[xx,yy+2],[xx-2,yy+Math.min(6,h*.3)]],k.ia(alpha*.7),.45);}
}
function lrfPath(k,points,alpha=.6){
 k.ln(points,k.a(T.accent,alpha),.7);
 for(let i=2;i<points.length-1;i+=5){const p=points[i],q=points[i+1];k.ln([[p[0]+2,p[1]+2],[q[0]+2,q[1]+2]],k.ia(alpha*.7),.55);}
}
function lrfBirds(k,x,y,w,h,n=0){
 for(let i=0;i<3+n%3;i++){const xx=x+4+(i*19+n*3)%Math.max(1,w-9),yy=y+4+(i*7+n)%Math.max(1,h-8);k.ln([[xx-3,yy-2],[xx-1,yy-1],[xx,yy+1],[xx+2,yy-2],[xx+4,yy-3]],k.ia(.5),.6);}
}
function lrfReeds(k,x,y,w,h,n=0){
 for(let j=0;j<Math.max(2,w/7);j++){const xx=x+3+j*7,hh=h*(.4+(j+n)%4*.15);k.ln([[xx,y],[xx+1,y-hh]],k.ia(.5),.55);k.ln([[xx,y-1],[xx-3,y-hh*.6]],k.ia(.4),.5);if(j%2)k.ell(xx+1,y-hh,1,2,k.a(T.accent,.35));}
}
function lrfJournalScene(k,x,y,w,h,kind=0,seed=0){
 if(w<12||h<8)return;const n=Math.abs(kind)%8,mark=i=>'mark'+String(i+1).padStart(2,'0');
 const route=[];for(let i=0;i<=40;i++){const t=i/40;route.push([x+2+t*(w-4),y+h*.72+Math.sin(t*6+seed)*Math.min(3,h*.12)+Math.sin(t*19)*.35]);}lrfPath(k,route,.32);
 if(h<24){const count=Math.max(1,Math.floor(w/35)),cw=(w-6)/count;for(let i=0;i<count;i++){const j=(i+seed+n)%4;lrfArt(k,mark(8+j),x+3+i*cw,y+1,cw-5,Math.max(5,h-3));}return;}
 if(h>w*1.15&&h>68){
  lrfArt(k,mark(n),x+2,y+4,w-4,Math.min(w*.9,h*.25));
  lrfArt(k,mark((n+3)%8),x+2,y+h*.6,w-4,Math.min(w*.86,h*.27));
  const trail=[];for(let i=0;i<=36;i++){const t=i/36;trail.push([x+w*.5+Math.sin(t*7+seed)*w*.22,y+4+t*(h-9)]);}lrfPath(k,trail,.28);
  lrfArt(k,mark(8+(seed%4)),x+3,y+h*.36,w-6,h*.15);return;
 }
 const mh=Math.min(h-5,w*.82);lrfArt(k,mark(n),x+3,y+2,w-6,mh);
}
function lrfTrailScene(k,x,y,w,h,kind=0,seed=0){
 if(k.journeyDetail&&T.lrfImages?.mark01){lrfJournalScene(k,x,y,w,h,kind,seed);return;}
 // Fit complete marginal drawings to their allotted space, including stroke and caption.
 // Native DrawContext has no clip transform; transform the recorded primitives instead.
 if(w<12||h<8)return;const ops=[],points=[],pen={...k};
 const box=(a,b,c,d,pad=.4)=>points.push([a-pad,b-pad],[a+c+pad,b+d+pad]);
 for(const name of ['ln','poly','circ','ell','rect','t'])pen[name]=(...a)=>{
  ops.push([name,a]);
  if(name==='ln'||name==='poly'){const pad=(name==='ln'?a[2]:a[3])||.7;for(const p of a[0])box(p[0],p[1],0,0,pad/2);}
  else if(name==='circ')box(a[0]-a[2],a[1]-a[2],a[2]*2,a[2]*2);
  else if(name==='ell')box(a[0]-a[2],a[1]-a[3],a[2]*2,a[3]*2);
  else if(name==='rect')box(a[0],a[1],a[2],a[3]);
  else{const [t,xx,yy,fs,c,o={}]=a,tw=Math.min(o.w||300,String(t).length*fs*.6);box(o.a==='c'?xx-tw/2:o.a==='r'?xx-tw:xx,yy,tw,fs*1.45);}
 };
 lrfTrailSceneInk(pen,x,y,w,h,kind,seed);if(!points.length)return;
 let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;for(const [xx,yy]of points){left=Math.min(left,xx);top=Math.min(top,yy);right=Math.max(right,xx);bottom=Math.max(bottom,yy);}
 const fit=left<x+.5||right>x+w-.5||top<y+.5||bottom>y+h-.5;
 const scale=fit?Math.min(1,(w-1)/(right-left),(h-1)/(bottom-top)):1;
 const dx=fit?Math.max(x+.5,Math.min(left,x+w-.5-(right-left)*scale))-left*scale:0;
 const dy=fit?Math.max(y+.5,Math.min(top,y+h-.5-(bottom-top)*scale))-top*scale:0;
 const pt=p=>[p[0]*scale+dx,p[1]*scale+dy];
 for(const [name,a]of ops){
  if(name==='ln')k.ln(a[0].map(pt),a[1],a[2]*scale);
  else if(name==='poly')k.poly(a[0].map(pt),a[1],a[2],a[3]*scale);
  else if(name==='circ')k.circ(a[0]*scale+dx,a[1]*scale+dy,a[2]*scale,a[3],a[4],a[5]*scale);
  else if(name==='ell')k.ell(a[0]*scale+dx,a[1]*scale+dy,a[2]*scale,a[3]*scale,a[4],a[5],a[6]*scale);
  else if(name==='rect')k.rect(a[0]*scale+dx,a[1]*scale+dy,a[2]*scale,a[3]*scale,a[4],a[5],a[6]*scale);
  else k.t(a[0],a[1]*scale+dx,a[2]*scale+dy,a[3]*scale,a[4],{...a[5],w:(a[5]?.w||300)*scale});
 }
}
function lrfTrailSceneInk(k,x,y,w,h,kind=0,seed=0){
 // Bounded, decorative map fragments; there are no actual coordinates or progress here.
 if(w<12||h<8)return;const n=Math.abs(kind)%8;
 const path=[];for(let i=0;i<=44;i++){const t=i/44;path.push([x+3+t*(w-6),y+h*.66+Math.sin(t*7+seed*.8)*Math.min(5,h*.13)]);}lrfPath(k,path,.44);
 if(h<24){
  for(let i=0;i<Math.floor(w/23);i++){const xx=x+9+i*23+Math.sin(i*1.7+seed)*3,yy=y+h*.31+Math.sin(i*2.3+seed)*1.1;if((i+seed)%5===3)continue;
   if(n===1||n===6){const wave=[];for(let j=0;j<13;j++)wave.push([xx-7+j,yy+Math.sin(j*.55+seed)*1.3]);k.ln(wave,k.ia(.5),.6);k.ln(wave.map(p=>[p[0]+3,p[1]+3]),k.ia(.28),.45);}
   else if(n===2||n===7){k.poly([[xx-2,yy+3],[xx-3,yy-3],[xx+1,yy-4],[xx+3,yy+2]],null,k.ia(.6),.6);k.ln([[xx-6,yy+4],[xx+6,yy+4]],k.ia(.3),.5);}
   else if(n===3){k.ln([[xx,yy+4],[xx,yy-2]],k.ia(.6),.65);k.ell(xx,yy-2,3.5,2.5,null,k.ia(.6),.6);k.circ(xx+1,yy-2,.8,k.a(T.accent,.65));}
   else if(n===4){k.ln([[xx-4,yy+3],[xx-4,yy-1],[xx,yy-4],[xx+4,yy-1],[xx+4,yy+3],[xx-4,yy+3]],k.ia(.6),.65);k.ln([[xx,yy+3],[xx,yy]],k.a(T.accent,.65),.6);}
   else if(n===5){lrfHill(k,xx-7,yy+3,15,5,.55);}
   else{k.ln([[xx-4,yy+2],[xx,yy-3],[xx+4,yy+2]],k.ia(.6),.65);k.ln([[xx-5,yy+4],[xx,yy],[xx+5,yy+4]],k.ia(.45),.55);}
  }return;
 }
 if(h>w*1.15&&h>68){
  const trail=[];for(let i=0;i<=60;i++){const t=i/60;trail.push([x+w*.49+Math.sin(t*8+seed)*w*.24,y+8+t*(h-21)]);}lrfPath(k,trail,.65);
  const s=Math.min(w/58,.68);lrfWaymark(k,x+w*.35,y+h*.25,s,n,.83);lrfWaymark(k,x+w*.64,y+h*.73,s*.78,(n+3)%8,.73);
  lrfHill(k,x+2,y+h*.48,w*.55,h*.08,.55);lrfHill(k,x+w*.42,y+h*.56,w*.55,h*.08,.4);
  if(n%2){lrfReeds(k,x+3,y+h*.87,w*.28,14,seed);lrfReeds(k,x+w*.64,y+h*.47,w*.25,11,seed+1);}
  else{for(let j=0;j<3;j++){const xx=x+4+j*w*.15,yy=y+h*.9;k.ln([[xx,yy],[xx+2,yy-10],[xx+4,yy]],k.ia(.55),.65);k.ln([[xx-1,yy-3],[xx+2,yy-7],[xx+5,yy-3]],k.ia(.45),.55);}}
  lrfBirds(k,x+4,y+3,w-8,Math.min(20,h*.13),seed);
  if(w>44)k.t(['old way','the ford','no bell','speak softly','mill path','knock once','low tide','one missing'][n],x+w/2,y+h-8,5.5,k.S,{a:'c',w:w-5});return;
 }
 const s=Math.min(w/64,h/55,.85),mx=x+w*(.43+(n%3)*.08),my=y+h*.47;
 if(n===0||n===4){lrfHill(k,x+3,y+h*.53,w*.42,h*.18);lrfHill(k,x+w*.55,y+h*.38,w*.4,h*.17);for(let j=0;j<3;j++){const yy=y+h*.8+j*3;k.ln([[x+w*.6,yy],[x+w*.91,yy-3]],k.ia(.24),.5);}lrfBirds(k,x+3,y+1,w*.4,h*.3,seed);}
 else if(n===1||n===6){for(let j=0;j<4;j++){const ps=[];for(let i=0;i<=22;i++)ps.push([x+3+i*(w-6)/22,y+h*.58+j*3+Math.sin(i*.3)*h*.16]);k.ln(ps,k.ia(.25),.5);}lrfReeds(k,x+3,y+h*.86,w*.24,h*.25,seed);lrfReeds(k,x+w*.78,y+h*.65,w*.16,h*.17,seed+1);}
 else if(n===2||n===7){lrfHill(k,x+2,y+h*.48,w*.44,h*.24);lrfHill(k,x+w*.52,y+h*.65,w*.45,h*.3);for(let j=0;j<4;j++){const xx=x+w*.1+j*w*.23,yy=y+h*.86;k.poly([[xx,yy],[xx+2,yy-3],[xx+5,yy-1],[xx+4,yy+1]],null,k.ia(.35),.5);}}
 else if(n===3){for(let j=0;j<4;j++){const xx=x+6+j*(w-12)/4,yy=y+h*.25+(j%2)*h*.12;k.ln([[xx,yy],[xx,yy+8]],k.ia(.4),.5);k.ell(xx,yy,3.5,3,null,k.ia(.4),.5);k.circ(xx+1,yy,1,k.a(T.accent,.4));}}
 else{lrfHill(k,x+2,y+h*.56,w*.44,h*.24);lrfHill(k,x+w*.56,y+h*.62,w*.41,h*.3);lrfBirds(k,x+3,y+3,w*.35,h*.25,seed);}
 lrfWaymark(k,mx,my,s,n,.84);
 for(let j=0;j<4;j++){const yy=y+h*.77+j*2,xx=x+4+(j%2)*2;k.ln([[xx,yy],[xx+w*.2,yy-1]],k.ia(.29),.5);}
 if(w>75&&h>43){const text=['the old gate','a toll in rhyme','no bell at dusk','a whisper returned','the mill remembers','knock only once','a lamp for the ferry','one stone missing'][n];k.t(text,x+w/2,y+h-8,5.7,k.S,{a:'c',w:w-8});}
}
function lrfArtMargins(k,key,x,y,w,h,dw,dh,xx,yy){
 if(!k.journeyDetail)return;let n=Number(key.match(/\d+/)?.[0]||1)-1;
 const type=key.startsWith('stage')?n%8:key.startsWith('person')?[4,6,7,5,2,0,3,5,2,1,0,6][n]:key==='tavern'?3:key.startsWith('omen')?(n+3)%8:0;
 if(!/^(stage|person|omen)/.test(key)&&key!=='tavern')return;
 const side=(w-dw)/2-5;
 if(side>18&&h>42){lrfTrailScene(k,x+1,y+7,side,h-13,type,n);lrfTrailScene(k,xx+dw+4,y+5,side,h-11,(type+3)%8,n+4);}
 // A wide low vignette gains distant sky marks above its own illustration.
 if(yy-y>15&&w>95){lrfBirds(k,x+8,y+3,w*.23,yy-y-4,n);lrfStar(k,x+w-17,y+8,2.8,k.ia(.4));}
}
function lrfJourneyGround(k,W,H,d){
 const small=W<200,big=H>200,n=lrfSlot(d),m=d.mode;
 // Corner tracks differ by department; body fragments below use intentionally free regions.
 const mi=Object.keys(LRF_META).indexOf(m);
 for(const side of [0,1]){const x=side?W-9:9;for(let j=0;j<(big?8:3);j++){const yy=44+j*(big?38:30);k.ln([[x,yy],[x+(side?-2:2),yy+3],[x,yy+6]],k.ia(.28),.5);if((mi+j)%3===0)k.circ(x,yy+10,.7,k.a(T.accent,.4));}}
 if(m==='status'){
  if(!small&&String(d.wx?.cond||'').length<18){lrfTrailScene(k,166,108,70,34,4,2);}
  if(big){lrfTrailScene(k,119,208,93,37,1,3);lrfWaymark(k,177,305,.58,5,.63);lrfBirds(k,132,170,74,23,2);lrfHill(k,25,332,58,13);lrfReeds(k,104,253,28,12,3);lrfWaymark(k,38,192,.4,0,.7);lrfHill(k,141,307,58,11,.5);k.t('A bridge asks a rhyme',117,246,12,k.S,{w:104});k.t('A hidden door',125,327,12,k.S,{w:92});}
 }else if(m==='shift'){
  lrfBirds(k,small?23:20,38,small?44:24,small?17:36,2);
  if(big){lrfTrailScene(k,248,209,91,46,2,1);lrfWaymark(k,40,318,.33,7,.6);}
 }else if(m==='solar'){
  if(small){lrfBirds(k,88,86,63,16,2);}
  else{lrfTrailScene(k,104,57,82,26,6,2);lrfBirds(k,204,40,29,68,4);lrfTrailScene(k,317,53,28,65,7,3);}
  if(big){for(let i=0;i<6;i++)lrfBirds(k,88+(i%3)*110,161+Math.floor(i/3)*70,30,13,i);}
 }else if(m==='audio'){
  if(small){lrfTrailScene(k,22,123,61,18,0,2);}
  else{lrfTrailScene(k,25,132,126,10,0,1);lrfBirds(k,25,41,32,27,1);}
  if(big){for(let i=0;i<3;i++)lrfTrailScene(k,235,181+i*47,104,15,0,i);}
 }else if(m==='transmission'){
  if(big){lrfTrailScene(k,30,328,182,11,1,5);}
 }else if(m==='feeds'){
  // The blank invitation area carries routes to the green and gossip round the well.

 }else if(m==='youtube'){

  if(big){lrfTrailScene(k,25,329,314,9,n%8,n);}
 }else if(m==='instagram'){
  // The quote-tail scene below owns this space; do not add a second map over it.
 }else if(m==='discord'){
  if(small){lrfTrailScene(k,22,125,126,8,3,1);}
 }else if(m==='oddity'){
  if(big){lrfTrailScene(k,22,336,65,15,(n+5)%8,n);lrfTrailScene(k,279,336,60,15,(n+2)%8,n+2);}
 }else if(m==='game'){
  if(small){lrfTrailScene(k,22,143,126,7,2,1);}
  // The wider travel account reserves this strip for readable stock values.
  if(big){lrfTrailScene(k,237,196,104,16,2,1);}
 }
}

// Native-compatible line clipping leaves text, illustration plates and live timer fields clear.
function lrfMarginPen(k,W,H,masks,bounds=[16,36,W-32,H-64]){
 const interval=(p,q,r)=>{let a=0,b=1;const dx=q[0]-p[0],dy=q[1]-p[1];for(const[u,v]of[[-dx,p[0]-r[0]],[dx,r[0]+r[2]-p[0]],[-dy,p[1]-r[1]],[dy,r[1]+r[3]-p[1]]]){if(Math.abs(u)<1e-9){if(v<0)return null;}else{const t=v/u;if(u<0)a=Math.max(a,t);else b=Math.min(b,t);if(a>b)return null;}}return[a,b];};
 return(ps,c,lw=.5)=>{let path=[];const flush=()=>{if(path.length>1)k.ln(path,c,lw);path=[];};
  for(let i=1;i<ps.length;i++){const p=ps[i-1],q=ps[i],bound=interval(p,q,bounds);if(!bound){flush();continue;}let runs=[bound];
   for(const r of masks){const cut=interval(p,q,r);if(!cut)continue;const next=[];for(const[a,b]of runs){if(cut[1]<=a||cut[0]>=b)next.push([a,b]);else{if(a<cut[0])next.push([a,cut[0]]);if(cut[1]<b)next.push([cut[1],b]);}}runs=next;if(!runs.length)break;}
   for(const[a,b]of runs){const start=[p[0]+(q[0]-p[0])*a,p[1]+(q[1]-p[1])*a],end=[p[0]+(q[0]-p[0])*b,p[1]+(q[1]-p[1])*b],last=path[path.length-1];if(last&&Math.hypot(last[0]-start[0],last[1]-start[1])>.01)flush();if(!path.length)path.push(start);path.push(end);if(b<1)flush();}if(!runs.length)flush();
  }flush();
 };
}
function lrfUnwrittenRoads(k,W,H,d){
 const small=W<200,n=Object.keys(LRF_META).indexOf(d.mode),seed=lrfSlot(d)%12,pen=lrfMarginPen(k,W,H,k.storyMasks),faint=k.ia(.19),ink=k.ia(.27),rubric=k.a(T.accent,.25);
 const contour=(cx,cy,rx,ry,count,phase=0)=>{for(let j=0;j<count;j++){const p=[];for(let i=0;i<=70;i++){const a=i*Math.PI*2/70,r=1+.08*Math.sin(a*5+phase)+.04*Math.cos(a*9);p.push([cx+Math.cos(a)*(rx+j*4)*r,cy+Math.sin(a)*(ry+j*3)*r]);}pen(p,j%3?faint:ink,.45);}};
 const road=(x,y,w,h,phase)=>{const p=[];for(let i=0;i<=75;i++){const t=i/75;p.push([x+t*w+Math.sin(t*8+phase)*5,y+t*h+Math.sin(t*5+phase)*9]);}pen(p,rubric,.65);for(let i=2;i<74;i+=5)pen([[p[i][0]+3,p[i][1]+2],[p[i+1][0]+3,p[i+1][1]+2]],ink,.5);};
 const trees=(x,y,w,h,phase)=>{for(let j=0;j<Math.ceil(w/22);j++){const xx=x+8+j*22+Math.sin(j*2+phase)*3,yy=y+Math.sin(j*.7+phase)*h*.28,hh=5+(j+phase)%4,p=[];for(let q=0;q<=28;q++){const a=q*Math.PI*2/28,r=1+.14*Math.sin(q*1.7+phase);p.push([xx+Math.cos(a)*5*r,yy+Math.sin(a)*hh*.6*r]);}pen(p,ink,.5);pen([[xx+1,yy],[xx,yy+hh+4],[xx-2,yy+hh+6]],faint,.5);pen([[xx-3,yy-2],[xx-1,yy],[xx+3,yy-1]],faint,.4);}};
 if(n===0){ // Remnants of strip fields outside the Guild's remembered route.
  for(let j=0;j<(small?4:8);j++){const xx=19+j*(W-35)/(small?4:8),yy=48+(j%3)*17;for(let q=0;q<5;q++)pen([[xx+q*2,yy],[xx+q*2+9,yy+23],[xx+q*2+5,yy+31]],faint,.45);}if(H>200){contour(180,290,29,42,4,2);trees(29,250,155,19,2);}
 }else if(n===1){ // A pass, with contours bending around the reckoning.
  contour(W*.57,H*.57,W*.14,H*.15,8,1);road(20,H-43,W-44,-H*.55,2);
 }else if(n===2){ // Air and water in the almanac margins, not measured chart lines.
  for(let j=0;j<(H>200?15:8);j++){const p=[];for(let i=0;i<=55;i++)p.push([18+i*(W-36)/55,54+j*(H-90)/(H>200?15:8)+Math.sin(i*.16+j*.6)*6+Math.sin(i*.43)*1.3]);pen(p,j%4?faint:ink,.45);}
 }else if(n===3){ // Hills carried between the verses.
  for(let j=0;j<(H>200?8:4);j++){const yy=60+j*(H-88)/(H>200?8:4);for(let q=0;q<3;q++){const p=[];for(let i=0;i<=35;i++)p.push([18+i*(W-36)/35,yy-Math.sin(i*.11+seed+j)*9+q*2.8]);pen(p,faint,.45);}}trees(22,H-45,W-48,9,1);
 }else if(n===4){ // The postal rider's branching tracks.
  road(17,H*.52,W-35,H*.14,1);road(W*.26,41,W*.35,H-81,4);contour(W*.76,H*.67,17,23,5,3);
 }else if(n===5){ // Open-green boundaries and a footpath to the village well.
  for(let side=0;side<(small?1:2);side++){const xx=small?20:20+side*170;road(xx,49,small?125:144,H-96,side+2);for(let j=0;j<5;j++){const yy=53+j*(H-83)/5;pen([[xx,yy],[xx+19,yy-4],[xx+50,yy+8],[xx+65,yy+24],[xx+47,yy+28]],faint,.5);}}
 }else if(n===6){ // A drawn approach to each imagined stage.
  contour(W*.5,H*.37,W*.22,H*.18,6,seed);trees(20,H>200?191:137,W-40,10,seed%4);road(25,H-40,W-54,-H*.39,seed);
 }else if(n===7){ // Local hedges and orchards surrounding the village book.
  for(let j=0;j<(H>200?7:3);j++){const yy=48+j*(H-76)/(H>200?7:3);road(19,yy,W-38,11,seed+j);for(let i=0;i<Math.floor(W/24);i++){const xx=22+i*24+(j%2)*10;const crown=[];for(let q=0;q<=18;q++){const a=q*Math.PI/9,r=1+.16*Math.sin(q*2+i);crown.push([xx+Math.cos(a)*3.7*r,yy-2+Math.sin(a)*4.5*r]);}pen(crown,faint,.5);pen([[xx,yy-2],[xx,yy+7]],ink,.5);}}
 }else if(n===8){ // Every small lane finds the Lantern Inn.
  for(let i=0;i<5;i++){const a=i*1.27;road(W*.48+Math.cos(a)*W*.36,H*.47+Math.sin(a)*H*.3,-Math.cos(a)*W*.3,-Math.sin(a)*H*.23,i);}trees(23,H-46,W-47,12,2);contour(W*.24,H*.7,18,15,4,1);
 }else if(n===9){ // Old Maud's crooked paths and rings of stone.
  for(let j=0;j<3;j++)contour(W*(.25+j*.24),H*(.3+(j%2)*.35),13+j*3,18+j*4,3,seed+j);road(17,H-35,W-40,-H*.6,seed);trees(19,H-51,W-42,9,seed%3);
 }else{ // Faint untravelled country around the actual expedition account.
  contour(W*.72,H*.66,W*.16,H*.12,6,2);road(18,H-43,W-36,-H*.58,3);if(H>200)trees(23,266,W-48,16,2);
 }
}

// Record one composition before drawing it: early roads and rules need the same
// protection as late marginalia. Replay in the original order so paper, ink and
// transparent illustrations retain their layering. No canvas-only clipping API.
function lrfPaint(raw,W,H,d){
 const commands=[],record={...raw,dc:{drawImageInRect:(...args)=>commands.push(['image',args])}};
 for(const name of ['t','ln','poly','rect','circ','ell','arc'])record[name]=(...args)=>commands.push([name,args]);
 const masks=lrfPaintPage(record,W,H,d),pens={};
 // Tiny solid marks are ornament, unlike paper leaves and wax-seal grounds.
 // Keep their ink out of the same reserved areas as the line work.
 const ornamentClear=(x,y,w,h)=>w>12||h>12||!masks.some(r=>x<r[0]+r[2]&&x+w>r[0]&&y<r[1]+r[3]&&y+h>r[1]);
 const stroke=(points,color,width=1)=>{
  if(!color||points.length<2)return;
  if(!pens[width]){const pad=width/2+.35; const clear=masks.map(r=>[r[0]-pad,r[1]-pad,r[2]+pad*2,r[3]+pad*2]);pens[width]=lrfMarginPen(raw,W,H,clear,[0,0,W,H]);}
  pens[width](points,color,width);
 };
 const oval=(x,y,rx,ry,a0=0,a1=Math.PI*2)=>{const points=[];for(let i=0;i<=80;i++){const a=a0+(a1-a0)*i/80;points.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}return points;};
 for(const [name,args]of commands){
  if(name==='image'){raw.dc.drawImageInRect(...args);continue;}
  if(name==='t'){raw.t(...args);continue;}
  if(name==='ln'){stroke(...args);continue;}
  if(name==='arc'){const[x,y,r,a0,a1,c,lw]=args;stroke(oval(x,y,r,r,a0,a1),c,lw);continue;}
  if(name==='poly'){const[p,fill,c,lw]=args,x=Math.min(...p.map(q=>q[0])),y=Math.min(...p.map(q=>q[1])),w=Math.max(...p.map(q=>q[0]))-x,h=Math.max(...p.map(q=>q[1]))-y;if(fill&&ornamentClear(x,y,w,h))raw.poly(p,fill);stroke([...p,p[0]],c,lw);continue;}
  if(name==='rect'){const[x,y,w,h,fill,c,lw]=args;if(fill&&ornamentClear(x,y,w,h))raw.rect(x,y,w,h,fill);stroke([[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],c,lw);continue;}
  if(name==='circ'){const[x,y,r,fill,c,lw]=args;if(fill&&ornamentClear(x-r,y-r,r*2,r*2))raw.circ(x,y,r,fill);stroke(oval(x,y,r,r),c,lw);continue;}
  if(name==='ell'){const[x,y,rx,ry,fill,c,lw]=args;if(fill&&ornamentClear(x-rx,y-ry,rx*2,ry*2))raw.ell(x,y,rx,ry,fill);stroke(oval(x,y,rx,ry),c,lw);}
 }
}
function lrfPaintPage(raw,W,H,d){
 const small=W<200,big=H>200,k=small?lrfSafe({...raw,lrfWidget:true}):lrfReadingKit({...raw,lrfWidget:true}),seed=lrfSlot(d),mode=d.mode; k.pageMode=mode;k.journeyDetail=true;k.storyMasks=[];
 const type=k.t;k.t=(text,x,y,fs,c,o={})=>{const label=small?String(text):lrfReadingLabel(text,fs),limit=o.w||300,size=small?Math.min(fs,limit/Math.max(1,label.length*.54)):Math.max(12,Math.min(Math.max(12,fs),limit/Math.max(1,lrfTextUnits(label)))),tw=Math.min(limit,lrfTextUnits(label)*size*(small?1.3:1.12)),left=o.a==='c'?x-tw/2:o.a==='r'?x-tw:x;k.storyMasks.push([left-3,y-2,tw+6,size*1.5+4]);type(text,x,y,fs,c,o);};
 if(mode==='shift'){const r=lrfTimerLayout(W,H);k.storyMasks.push([r.x-3,r.y-3,r.w+6,r.fs*1.5+6]);}
 if(mode==='solar')k.storyMasks.push([13,(small?108:105)-3,small?144:181,33]);
 lrfFrame(k,W,H,d);lrfV2Ground(k,W,H,d);lrfFinePrint(k,W,H,d);lrfJourneyGround(k,W,H,d);
 if(mode==='status'){
  const x=20,w=small?132:big?211:227;lrfBranch(k,11,40,5,96,1);
  k.t(lrDate(d.now||new Date()),x,37,small?8:10,k.A,{w});const used=k.para(d.ev?d.ev.title:'No appointment on the road.',x,52,w,small?16:22,k.I,3,44);
  if(used<27){k.t('A PROMISE ALONG THE WAY',x+5,85,small?4.8:5.8,k.S,{w:w-14});lrfRule(k,x,94,w,k.ia(.22));}else if(small&&used<39){lrfTrailScene(k,x,91,w-3,7,0,2);}
  k.t(d.ev?shortT(d.ev.start)+' – '+shortT(d.ev.end):'The afternoon remains yours.',x,98,small?7:8,k.A,{w});
  k.t(d.wx?.temp!=null?Math.round(d.wx.temp)+'° / '+lrSky(d.wx.cond):'The sky gives no word.',x,112,small?8:10,k.I,{w:small?84:w});
  k.t(d.batt!=null?'Battery / '+Math.round(d.batt*100)+'%':'Battery / unknown',x,128,8,k.S,{w:small?83:w});
  lrfNewCompass(k,small?111:big?242:260,small?99:38,small?43:big?102:84,small?43:big?85:84);
  if(!small){lrfStrip(k,big?242:254,125,big?102:91,'GUILD / IV');k.t('Wending Way',big?293:300,139,12,k.S,{a:'c',w:102});}
  if(small){lrfRule(k,20,141,132,k.ia(.4));lrfRule(k,20,143,132,k.ia(.2));}
  if(big){
   k.t('From Brindle, by the old north road',22,151,13,k.A,{w:320});
   lrfRoadInk(k,40,176,80,143,2);lrfPeaks(k,120,204,91,36,1);lrfWoods(k,25,244,58,31,2);lrfWoods(k,123,290,75,31,4);
   const stops=[['Brindle',60,183],['The ford',61,232],['Ashwood',55,285],['Northward',40,314]];
   stops.forEach(([name,xx,yy],i)=>{k.poly([[xx-4,yy],[xx,yy-7],[xx+5,yy]],k.PN,k.I,.7);k.t(name,xx+10,yy-2,8,k.I,{w:94});});
   k.t('Notes for the crossing',225,177,9,k.A,{w:115});
   k.para('Take bread. The ferryman knows a song worth hearing.',225,196,113,12,k.I,5,66);
   k.t('Weather, high / low',225,267,7,k.A,{w:114});k.t((d.wx?.hi??'--')+'° / '+(d.wx?.lo??'--')+'°',225,280,17,k.I,{w:113});
   k.para('A red thread marks the road remembered.',225,309,113,12,k.S,3,43);
   k.t('A remembered route / not your location',22,346,12,k.S,{w:320});
  }
 }else if(mode==='shift'){
  const ev=d.ev,target=ev?(ev.active?ev.end:ev.start):null,frac=ev&&ev.active?Math.max(0,Math.min(1,(+(d.now||new Date())-ev.start)/(ev.end-ev.start))):.12;
  const x=small?79:132,w=W-x-15;lrfBox(k,17,38,small?55:101,103);lrfHourglass(k,small?20:29,45,small?48:77,86,frac);
  const used=k.para(ev?ev.title:'At rest.',x,43,w,small?14:22,k.I,3,43);if(used<30)lrfTrailScene(k,x+3,(small?51:47)+used,w-6,Math.max(small?8:6,(small?35:32)-used),7,2);k.t(ev?(ev.active?'UNTIL WE ARRIVE':'UNTIL WE SET OUT'):'NO TIMED APPOINTMENT',x,small?91:85,6.5,k.A,{w});
  if(!d.live)k.t(target?lrfDuration(+target-+(d.now||new Date())):'No sand owed.',x,103,small?22:28,k.I,{w});
  for(let i=0;i<12;i++){const xx=x+i*w/12,yy=140+Math.sin(i*.5);k.ln([[xx,yy],[xx+3,yy-1]],ev?.active&&i<Math.round(frac*12)?k.A:k.ia(.35),.8);}
  if(big){lrfBox(k,20,154,324,41,'HOURS BORROWED, HOURS RETURNED',true);k.t('Take the hour that is given.',27,170,22,k.I,{w:310});
   lrfBox(k,20,204,324,112,'A RECKONING OF THE ROAD');
   const stops=[['Departure','by the glass'],['A short pause','beneath the ash'],['Another turning','after the bridge'],['Bread for later','wrapped twice'],['Arrival','in good time']];
   lrfRoadInk(k,26,222,37,85,1);lrfWoods(k,253,272,76,15,3);lrfPeaks(k,250,310,75,30,2);
   stops.forEach((r,i)=>{const yy=221+i*18,xx=44+Math.sin(i*1.25+1)*16;k.circ(xx,yy+5,2,k.PN,k.A,.7);k.t(r[0],72,yy,12,k.I,{w:95});k.t(r[1],248,yy,12,k.S,{a:'r',w:79});});
   lrfStrip(k,20,325,324,'THE GLASS IS TURNED / THE ROAD CONTINUES');
   k.t('No hour is improved by watching it.',W/2,342,11,k.S,{a:'c',w:W-44});
  }
 }else if(mode==='solar'){
  const sun=d.sun||{},wx=d.wx||{},known=Number.isFinite(sun.remaining),day=sun.phase==='day';
  k.t(known?(day?'DAYLIGHT LEFT':'UNTIL DAWN'):'CLOUDED OVER',16,38,7,k.A,{w:small?87:170});k.t(known&&Number.isFinite(sun.left)?Math.round(sun.left*100)+'%':'--',16,50,small?28:36,k.I,{w:small?75:140});
  lrfFiligree(k,small?96:201,36,small?59:145,69);lrfArt(k,'sundial',small?89:196,38,small?71:150,small?62:77);
  if(!d.live)k.t(known?lrfDuration(sun.remaining):'Sky watch unavailable',16,small?108:105,small?16:18,k.I,{w:small?138:175});
  lrfStrip(k,16,small?86:89,small?69:160,known?(day?'SOL / DAY':'SOL / NIGHT'):'NO REPORT');
  for(let q=0;q<11;q++)k.ln([[18+q*(small?65:156)/10,100],[18+q*(small?65:156)/10,102+(q%5===0?2:0)]],k.ia(.4),.45);
  k.t(wx.temp!=null?Math.round(wx.temp)+'° / '+lrSky(wx.cond):'Weather unavailable',16,133,small?8:10,k.S,{w:W-32});
  if(!small){k.t('THE LAMPLIGHTER’S',272,119,12,k.A,{a:'c',w:150});k.t('ALMANAC / LEAF XII',272,135,12,k.I,{a:'c',w:150});}
  if(big){const a=d.atm||{},vals=[['Rain',a.probs?.length?Math.round(Math.max(...a.probs))+'%':'--'],['Dampness',a.rh!=null?Math.round(a.rh)+'%':'--'],["Sun's sting",a.uv!=null?Math.round(a.uv):'--'],['Far sight',a.vis||'--'],['Dew at',a.dew!=null?a.dew+'°':'--'],['Wind',a.ws!=null?Math.round(a.ws*(T.units==='celsius'?1.609344:1))+(T.units==='celsius'?' km/h':' mph'):'--']];
   vals.forEach(([label,value],i)=>{const xx=18+i%3*110,yy=158+Math.floor(i/3)*70;lrfBox(k,xx,yy,105,65,label,i%3===0);k.t(value,xx+7,yy+19,22,k.I,{w:91});if(String(value).length<5)lrfTrailScene(k,xx+65,yy+17,34,27,[1,6,5,2,3,4][i],i);lrfWeatherMark(k,xx+13,yy+52,i);k.t(['RAIN TABLE','AIR / WATER','SUN TABLE','HORIZON','DEW POINT','WIND TABLE'][i],xx+31,yy+48,5.5,k.S,{w:69});
    for(let j=0;j<13;j++){const a=j*Math.PI/12;k.ln([[xx+13+Math.cos(a)*13,yy+52-Math.sin(a)*13],[xx+13+Math.cos(a)*15,yy+52-Math.sin(a)*15]],k.ia(.4),.5);}
    lrfRule(k,xx+31,yy+59,67,k.ia(.5));});
   lrfBox(k,18,303,325,45,'RAIN ALONG THE WAY / HOURLY CHANCE (%)');const probs=(a.probs||[]).slice(0,12);if(probs.length){const bw=307/probs.length;probs.forEach((v,i)=>{const xx=27+i*bw;k.t(String(Math.round(v)),xx+bw/2,318,6,k.I,{a:'c',w:bw-2});for(let j=0;j<Math.max(1,Math.round(v/15));j++){const dx=(j%3)*3;k.ln([[xx+3+dx,332+Math.floor(j/3)*4],[xx+1+dx,335+Math.floor(j/3)*4]],k.a(T.accent,.65),.7);}});}else k.t('No weather report has arrived.',26,324,10,k.S,{w:307});
  }
 }else if(mode==='audio'){
  lrfBox(k,16,36,small?72:143,106);lrfFiligree(k,19,39,small?66:137,99);lrfLute(k,18,42,small?68:139,89);
  const x=small?94:173,w=W-x-18,line=(C.audio?.lines||['A song for the road'])[seed%(C.audio?.lines?.length||1)];const used=k.para(line,x,40,w,small?17:25,k.I,4,66);if(used<48){k.t('AIR '+String(seed%24+1).padStart(2,'0')+' / ANDANTE',x,48+used,small?5:6,k.S,{w});lrfRule(k,x,60+used,w,k.ia(.25));}if(used<56){lrfBirds(k,x+3,47+used,Math.min(w-5,66),Math.max(9,59-used),seed);if(!small&&used<42)k.t('the hills know the refrain',x,99,6.3,k.S,{w});}lrfMusic(k,x,115,w,25,seed);k.t('Hear a song / Music',x,137,small?6:8,k.A,{w});
  if(big){lrfBox(k,18,154,328,27,'THE LANTERN INN SONGBOOK',true);k.t('Air no. '+String(seed%24+1)+' / for tired feet and unsteady voices',24,169,8,k.I,{w:316});
   for(let row=0;row<3;row++){const yy=192+row*47;lrfInitial(k,18,yy-3,17,33,['I','II','III'][row]);lrfMusic(k,41,yy+6,302,26,seed+row);k.t(['Bread on the table, rain at the door.','Carry the tune where the road bends away.','Leave the last verse for the next one to stay.'][row],41,yy+24,8,k.S,{w:302});}
   lrfRule(k,20,330,324,k.ia(.5));k.t('Finis / repeat if supper is late',182,323,12,k.S,{a:'c',w:260});lrfStrip(k,18,339,328,'APPLAUSE IN LIEU OF PAYMENT / MIND THE BARD');
  }
 }else if(mode==='transmission'){
  const x=16,w=W-32; lrfBox(k,x,37,w,H-68);k.t(d.archival?'COPIED FROM AN OLD BOOK':'CARRIED BY THE POSTAL RIDERS',x+5,39,6.8,k.A,{w:w-26});

  const qh=big?95:46,qy=57,qw=small?w-14:big?w-16:w-87; const used=k.para(d.text||'Every road was once a rumor.',x+8,qy,qw,small?17:big?28:21,k.I,big?4:3,qh);
  const tail=(big?153:104)-(qy+used);if(tail>12){lrfTrailScene(k,x+8,qy+used+3,qw,tail-6,6,seed);}
  k.poly([[W-33,37],[W-17,53],[W-33,53]],k.PN,k.ia(.6),.5);
  if(big){for(let i=0;i<3;i++)lrfRule(k,25,333+i*2,198,k.ia(.3));}
  else if(small){lrfPostmark(k,40,133,10);k.t('BY PONY',88,133,5.5,k.A,{a:'c',w:48});}
  else{lrfPostmark(k,310,66,15);k.t('ONE FAIR COPY',310,132,12,k.S,{a:'c',w:80});}
  const byHeight=k.para(d.by||"THE CARTOGRAPHERS’ GUILD",x+8,big?158:108,small?w-16:big?w-18:w-88,small?6.8:12,k.S,2,30);
  if(!big){lrfArt(k,'letters',small?W-49:W-85,small?120:78,small?30:62,small?24:53);if(!small){if(byHeight<20)lrfTrailScene(k,26,126,W-129,8,6,4);lrfStrip(k,byHeight<20?24:137,133,byHeight<20?W-125:142,byHeight<20?'Postage paid / ink dry':'Postage paid');}}
  if(big){
   lrfStrip(k,24,181,W-48,'BY THE POSTAL RIDERS / A ROAD REMEMBERED');lrfTrailScene(k,27,216,192,59,6,4);lrfWaymark(k,42,227,.43,0,.8);lrfWaymark(k,197,232,.48,2,.8);k.t('Brindle',29,197,12,k.A,{w:72});k.t('Pinewatch',224,197,12,k.A,{a:'r',w:74});k.t('The pony knows the ford.',31,279,12,k.S,{w:181});
   lrfArt(k,'letters',233,205,105,98);lrfPostmark(k,277,311,19);lrfSeal(k,322,319,15,'P');
   lrfBox(k,24,294,199,41,'ON THE REVERSE');k.t('Write home. They worry.',31,311,16,k.I,{w:185});k.t('One fair copy / no forwarding fee',26,341,7,k.S,{w:240});
  }
 }else if(mode==='feeds'){
  const cw=small?W-32:(W-40)/2;for(let side=0;side<(small?1:2);side++){const x=16+side*(cw+8),h=H-69;lrfBox(k,x,37,cw,h,side?'VILLAGE GOSSIP':'TRAVELLING PLAYERS',!!side);
   const used=k.para(side?'A stranger ordered two suppers.':'The show goes on.',x+7,56,cw-14,small?21:big?25:19,k.I,3,big?62:43);
   if(big){for(let q=0;q<22;q++){const xx=x+6+q*(cw-12)/22;side?k.circ(xx,115,1.2,k.ia(.45)):k.rect(xx,111,2,7,k.ia(q%3?.4:.7));}for(let p=0;p<9;p++)k.circ(x+5+p*(cw-10)/8,137,.8,k.ia(.7));}
   else if(used<35){for(let q=0;q<12;q++){const xx=x+8+q*(cw-16)/12;k.rect(xx,65+used,2,2,k.ia(.4));}lrfRule(k,x+8,61+used,cw-16,k.ia(.25));}
   if(!big&&used<34)lrfTrailScene(k,x+8,62+used,cw-16,39-used,side?3:0,side+2);const ys=big?123:small?105:101;lrfStrip(k,x+5,ys,cw-10,side?'HEARD AT THE WELL':'ONE COPPER / ADMIT ONE');
   if(big){const tales=side?[['A door under the hill',5],['Bells under Hollowmere',6]]:[['The Borrowed Crown',0],['Home Before Winter',7]];
    tales.forEach((r,i)=>{const yy=153+i*32;k.t(r[0],x+7,yy,12,k.I,{w:cw-14});});
    lrfArt(k,side?'mark04':'crier',x+22,213,cw-44,105);
    lrfRule(k,x+7,329,cw-14,k.ia(.4));
   }else{k.t(side?'Truth, adjusted in transit':'Seats kept until the bell',x+7,small?120:117,7,k.S,{w:cw-14});
    for(let i=0;i<7;i++)k.ln([[x+cw-35+i*4,134],[x+cw-35+i*4,142]],k.ia(.5),.5);}
   k.t(side?'Open Instagram':'Open YouTube',x+7,big?H-34:small?136:133,8,k.A,{w:cw-14});
  }
 }else if(mode==='youtube'){
  const n=seed%12,p=LRF_PLAYS[n];if(small){lrfStage(k,17,37,W-34,54,n);lrfBirds(k,20,38,28,21,n);k.para(p[0],17,106,W-34,14,k.I,2,26);lrfTrailScene(k,22,132,35,12,(n+2)%8,n);lrfTrailScene(k,113,132,35,12,(n+5)%8,n);k.t('PLAY '+String(n+1).padStart(2,'0'),W/2,134,6.8,k.A,{a:'c',w:45});k.t(p[1],W/2,94,5.8,k.A,{a:'c',w:W-40});}
  else if(!big){lrfStage(k,17,37,158,93,n);lrfPrinterCorner(k,17,37,1,1);lrfPrinterCorner(k,175,130,-1,-1);lrfStrip(k,17,134,158,'TRAVELLING PLAYERS');k.t(p[1],186,37,8,k.A,{w:160});k.para(p[0],186,52,160,22,k.I,3,52);k.para(p[2],186,109,160,9,k.S,2,24);lrfStrip(k,186,134,160,'ADMIT ONE');}
  else{lrfStage(k,18,38,328,148,n);for(const [cx,cy,sx,sy] of [[18,38,1,1],[346,38,-1,1],[18,186,1,-1],[346,186,-1,-1]])lrfPrinterCorner(k,cx,cy,sx,sy);lrfStrip(k,18,188,328,'PLAY '+String(n+1).padStart(2,'0')+' / '+p[1]);const used=k.para(p[0],21,207,322,28,k.I,2,60);if(used<42){lrfTrailScene(k,24,242,316,23,(n+2)%8,n);k.t('One wagon, many tales',182,262,12,k.S,{a:'c',w:300});}
   lrfBox(k,20,278,324,50,'THE COMPANY / EVENING BILL',true);lrfRows(k,24,292,316,[['Presented as',p[2]],['Orchestra','lute, spoon and courage']],18,8);lrfStrip(k,20,342,324,'OPEN YOUTUBE / A PLAY FROM THE ROAD');}
 }else if(mode==='instagram'){
  const count=small?1:big?3:2,cw=(W-32-(count-1)*7)/count;
  for(let i=0;i<count;i++){const n=(seed+i)%12,p=LRF_PEOPLE[n],x=16+i*(cw+7),ph=big?130:70;lrfBox(k,x,37,cw,big?161:103);lrfFiligree(k,x+3,40,cw-6,ph);
   if(n%3===0){for(let j=0;j<15;j++){const yy=42+j*(ph-7)/14;k.poly([[x+5,yy],[x+7,yy+2],[x+5,yy+4],[x+3,yy+2]],k.ia(.4));k.poly([[x+cw-5,yy],[x+cw-7,yy+2],[x+cw-5,yy+4],[x+cw-3,yy+2]],k.ia(.4));}}
   else if(n%3===1){for(let j=0;j<12;j++){const yy=42+j*(ph-9)/11;k.ell(x+6,yy,3,2,null,k.ia(.5),.5);k.ell(x+cw-6,yy,3,2,null,k.ia(.5),.5);}}
   else{lrfPrinterCorner(k,x+3,40,1,1);lrfPrinterCorner(k,x+cw-3,40+ph,-1,-1);}
   k.t('PL. '+String(n+1).padStart(2,'0'),x+9,small?42:37,small?4.5:12,k.A,{w:small?27:42});lrfArt(k,lrfKey('person',n),x+(big?10:4),small?39:53,cw-(big?20:8),small?ph:big?ph-14:ph-14);lrfRule(k,x+4,40+ph,cw-8);k.t(p[0],x+cw/2,44+ph,small?13:big?12:11,k.I,{a:'c',w:cw-6});k.t(p[1],x+cw/2,61+ph,7,k.A,{a:'c',w:cw-8});}
  if(big){const p=LRF_PEOPLE[seed%12];lrfStrip(k,20,208,324,'WITNESS BOOK / NEIGHBOURS, NOT STRANGERS');lrfBox(k,20,223,324,77,'ENTERED IN THE VILLAGE BOOK',true);const used=k.para(p[2],27,240,310,19,k.I,3,56);if(used<43)lrfTrailScene(k,29,241+used,306,Math.min(26,58-used),(seed+4)%8,seed);
   lrfRows(k,20,307,324,[['A familiar detail',p[3]],['Record kept by','the Lantern Inn']],19,9);}
  else{lrfGuilloche(k,20,141,W-40,4,seed);}
 }else if(mode==='discord'){
  if(big){lrfBox(k,18,37,328,204);lrfFiligree(k,21,40,322,198);lrfTavern(k,23,40,318,181);lrfBranch(k,28,55,7,158,4);k.t('A LANTERN IN THE WINDOW',182,225,6,k.A,{a:'c',w:260});k.t('No traveller eats alone.',W/2,246,24,k.I,{a:'c',w:W-40});
   lrfBox(k,20,278,324,68,'THE LANTERN INN / COMMON BOOK',true);lrfRows(k,24,292,316,[['The long table','gossip / a place kept'],['By the hearth','song / supper warm'],['The back room','dice / no IOUs']],17,9);k.t('Open Discord / pull up a chair',21,344,12,k.A,{w:W-42});
  }else if(small){lrfBox(k,16,36,W-32,94);lrfFiligree(k,19,39,W-38,85);lrfTavern(k,19,38,W-38,88);lrfPrinterCorner(k,17,37,1,1);lrfPrinterCorner(k,153,129,-1,-1);k.t('A seat is kept for you.',W/2,135,11,k.I,{a:'c',w:W-34});}
  else{lrfBox(k,16,36,159,108);lrfFiligree(k,19,39,153,102);lrfTavern(k,19,39,153,99);lrfStitch(k,16,36,159,108);k.t('The Lantern Inn',186,38,22,k.I,{w:161});lrfBox(k,185,66,162,78,'OPEN DISCORD / COME IN',true);lrfRows(k,189,82,154,[['Long table','gossip'],['Hearth','song'],['Back room','dice']],19,9);}
 }else if(mode==='oddity'){
  const n=seed%12,o=LRF_OMENS[n],x=small?81:159,w=W-x-17;
  lrfBox(k,16,37,small?59:130,105);lrfFiligree(k,19,40,small?53:124,97);lrfArt(k,lrfKey('omen',n),19,42,small?53:124,88);k.t('FIG. '+String(n+1).padStart(2,'0'),small?45:81,132,6,k.A,{a:'c',w:small?53:124});
  k.t('AN OLD ROAD TALE',x,38,6.2,k.A,{w});const used=k.para(o[0],x,51,w,small?14:24,k.I,3,47);if(used<34){const yy=59+used;lrfTrailScene(k,x,yy,w,Math.min(29,100-yy),(n+3)%8,n);}k.para(o[1],x,103,w,small?9:12,k.S,3,34);
  if(big){lrfStrip(k,20,151,324,'COLLECTED BY THE WAY / NEVER VERIFIED');
   const rr=[['Road said to be',o[3]],['Pantry imagined',o[4]],['The nearest inn',o[5]],['A lucky thing',o[2]]];rr.forEach((r,i)=>{const yy=173+i*35;lrfBox(k,20,yy,324,30);k.t(['I','II','III','IV'][i],31,yy+8,10,k.A,{a:'c',w:19});k.t(r[0],49,yy+1,12,k.A,{w:130});k.t(r[1],337,yy+12,13,k.I,{a:'r',w:124});k.t(['reported','imagined','by hearsay','pocket charm'][i],49,yy+17,6,k.S,{w:103});lrfTrailScene(k,144,yy+1,61,28,(n+i*2)%8,n+i);});
   lrfStrip(k,20,320,324,'OLD MAUD’S MARGINALIA / LEAF '+String(n+1));k.t('Belief is lighter than luggage.',W/2,340,12,k.S,{a:'c',w:176});
  }
 }else if(mode==='game')lrfGameFolio(k,W,H,d);
 lrfUnwrittenRoads(k,W,H,d);
 return k.storyMasks;
}
