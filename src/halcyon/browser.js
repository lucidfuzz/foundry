const HB_IMAGES = {};
let hbExportCache;
function hbExportSprites() {
  if(hbExportCache)return hbExportCache;
  const sprites={};
  for(const [key,img] of Object.entries(HB_IMAGES)){
    const scale=Math.min(1,480/Math.max(img.width,img.height)),c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    sprites[key]=c.toDataURL('image/png').split(',')[1];
  }
  if(!sprites.heart)throw new Error('Wait for Halcyon artwork to load before exporting.');
  return hbExportCache=sprites;
}
// Artwork loads in two tiers: small thumbnails first (theme picker, first paint), then full resolution once Halcyon is open.
const hbTierLoads={}; let hbTier=null;
function hbIsDark(th) {
  const hex=th.colors.ground.replace('#','');
  return hex.length===6 && (.2126*parseInt(hex.slice(0,2),16)+.7152*parseInt(hex.slice(2,4),16)+.0722*parseInt(hex.slice(4,6),16))<95;
}
function hbReady(tier='sheets') {
  return hbTierLoads[tier] ||= artLoad('halcyon',tier).then(sheets=>{
    const K=scriptableKit(PRESETS.halcyon);if(!K)throw new Error('Halcyon renderer could not initialize');
    const map={};
    for(const [key,[sheet,x,y,w,h]] of Object.entries(K.HB_SPRITES)){
      const img=sheets[sheet];if(!img)continue;const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*w));c.height=Math.max(1,Math.round(img.height*h));
      c.getContext('2d').drawImage(img,img.width*x,img.height*y,img.width*w,img.height*h,0,0,c.width,c.height);map[key]=c;
    }
    if(tier==='sheets'||hbTier!=='sheets'){Object.assign(HB_IMAGES,map);hbTier=tier;hbExportCache=null;}
    return map;
  }).catch(e=>{delete hbTierLoads[tier];throw e;});
}
// Redraw whatever is showing Halcyon once a tier of artwork arrives.
function hbArtArrived() {
  const card=document.querySelector('.preset[data-id="halcyon"] canvas');if(card)drawWallpaper(card,PRESETS.halcyon,'lock',0);
  if(frameFor(state.th)==='halcyon')refresh();
}
function hbWarm(full) { hbReady('thumbs').then(hbArtArrived).catch(e=>console.warn(e)); if(full)hbReady('sheets').then(hbArtArrived).catch(e=>{console.warn(e);setStatus('Halcyon artwork could not load. Check your connection and reload.');}); }
// Addresses of the widget crops the iPhone script downloads once and keeps on the phone.
function hbWidgetArt() { return Object.fromEntries(Object.entries(artFor('halcyon','widget')).map(([k,u])=>[k,artURL(u)])); }
const HB_NAMES={status:'Subject Status',shift:'Allocation',solar:'Solar + Atmos',audio:'Audio Channel',transmission:'Transmission',feeds:'Neural Intake',youtube:'Broadcast Intake',instagram:'Peer Observation',oddity:'Affect Register',discord:'Collective',game:'Specimen Vat',tracker:'Distant Observation',dossier:'Target Dossier'};
function hbWidgetList(th,original) {
  const list=original.concat({mode:'tracker',name:'Distant Observation',title:'HB-R / DISTANT OBSERVATION',tap:'Leave as is',desc:'A simulated location array cycling through 36 celestial bodies, vessels and anomalies. Pair with Target Dossier below; both use the same half-hour scan ID.'},{mode:'dossier',name:'Target Dossier',title:'HB-D / TARGET DOSSIER',tap:'Leave as is',desc:'The object identified by Distant Observation, with a unique vector scan and cargo, origin or custody details. Place below the tracker. Fictional survey positions; known planets remain labeled.'});
  return list.map(item=>({...item,name:HB_NAMES[item.mode]||item.name,size:'small, medium or large',
    ...(item.mode==='shift'?{title:'W-02 / ALLOCATION',desc:'Choose an event in Scriptable using allocation_setup. Counts down until it starts, counts up during its scheduled duration, then finds the next occurrence with the same title on that calendar. iOS controls refresh timing.',tap:'Calendar; setup is in Scriptable'}:{}),
    ...(item.mode==='game'?{desc:'An abstract bio-synthetic organism in a containment tube. Charging feeds it and advances growth through five stages; health, traits and history persist. Growth updates when the widget refreshes.'}:{}),
    ...(item.mode==='audio'?{desc:'A regulated corporate radio facade with an abstract growing approval seal. Tap opens your chosen music app or stream. Set it using radio_setup in Scriptable. The broadcast schedule is fiction.'}:{}),
    ...(item.mode==='feeds'?{desc:'Neural interface artwork. The left half opens YouTube and the right half opens Instagram. Small size opens YouTube.'}:{})}));
}
function hbSample(mode,th) {
  const now=new Date(),d={...sampleData(mode,th),mode,now,seed:6};
  if(mode==='status')Object.assign(d,{ev:{title:'Design review',start:new Date(+now+24*60000)},batt:.68});
  if(mode==='shift')d.allocation={title:'Design review',phase:'before',label:'NEXT ALLOCATION IN',start:new Date(+now+24*60000),end:new Date(+now+69*60000),target:new Date(+now+24*60000),note:'Prepared for your participation.',frac:0};
  if(mode==='solar')Object.assign(d,{wx:{temp:th.units==='celsius'?22:72,hi:th.units==='celsius'?24:75,lo:th.units==='celsius'?17:62,cond:'Mostly clear'},daylight:'SUNSET IN 5:12:00',sun:{phase:'day',remaining:312*60000,left:.46},atm:{rh:54,ws:6,uv:3,probs:[5,12,24,42,50,36,22,16,5,20,40,18]}});
  if(mode==='transmission')Object.assign(d,{text:'I ought to be thy Adam, but I am rather the fallen angel.',by:'MARY SHELLEY / FRANKENSTEIN',archival:true});
  if(mode==='game')Object.assign(d,{inp:{charging:true},st:{lot:'HB-2893-14',stage:3,age:46,growth:46,run:1,vseed:2893,nut:74,vit:82,stress:16,traits:['sensory filaments'],hist:[71,74,78,76,82],shist:[30,25,22,18,16],log:[{m:'Specimen requested a name. Request under consideration.'}]}});
  return d;
}
function hbPreviewWidget(item,th) {
  const family=item.family||state.hbSize||(item.mode==='shift'?'small':'medium'),[W,H]=family==='small'?[170,170]:family==='large'?[364,382]:[364,170];
  const K=scriptableKit(th),card=pv('div',`width:${W}px;height:${H}px;border-radius:18px;overflow:hidden;flex:none`);
  if(K){const c=K.artImage(W,H,K.hbPaint,hbSample(item.mode,th));c.style.width=W+'px';c.style.height=H+'px';card.append(c);}
  return {el:card,w:W,h:H};
}
function hbSizeControls() {
  let host=document.getElementById('hb-size-controls');
  if(!host){host=pv('div','display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 18px');host.id='hb-size-controls';document.getElementById('wg-list').before(host);}
  host.hidden=!(hbOn(state.th)||drOn(state.th));host.style.display=host.hidden?'none':'flex';if(host.hidden)return;
  host.replaceChildren();host.append(pv('span','font-size:12px','Sample data · widget size'));
  for(const [value,label] of [['','Suggested'],['small','Small'],['medium','Medium'],['large','Large']]){
    const b=pv('button','',label);b.type='button';b.className='btn';b.setAttribute('aria-pressed',String((state.hbSize||'')===value));b.onclick=()=>{state.hbSize=value;buildWidgetList();};host.append(b);
  }
}
function hbWallpaper(ctx,th,H,mode,idx) {
  const dark=hbIsDark(th),ink=dark?'#F5F7EC':'#073C30',bg=th.colors.ground;
  ctx.fillStyle=bg;ctx.fillRect(0,0,390,H);
  const g=ctx.createRadialGradient(240,H*.49,10,195,H*.52,340);g.addColorStop(0,dark?'#205746':'#FFFFFFC0');g.addColorStop(1,'#FFFFFF00');ctx.fillStyle=g;ctx.fillRect(0,0,390,H);
  const mono=(s,x,y,size=7)=>spaced(ctx,s,x,y,size,th.fonts.mono,400,.08,'left',ink);
  const title=(s,x,y,size=38)=>spaced(ctx,s,x,y,size,th.fonts.display,400,-.02,'left',ink);
  const label=idx%4,art=HB_IMAGES[['heart','tissue','lungs','neural'][label]];
  if(mode==='lock'){
    mono(th.company.toUpperCase(),24,54,10);mono('CONTINUITY SERVICES / '+String((th.phrases&&th.phrases.length>4?idx%th.phrases.length:label)+1).padStart(2,'0'),24,70,6);
    // The system clock/date occupy the upper third; never bake a fake clock into exports.
    const aw=Math.min(316,300*K(th).scale), ah=Math.min(334,aw*(art?art.height/art.width:1)),y=H*.335;
    if(art)ctx.drawImage(art,(390-aw)/2,y,aw,ah);
    const headlines=th.phrases?.[th.phrases.length>4?idx%th.phrases.length:label]||[['A little','more life.'],['Room','to feel.'],['Breathe now.','Pay later.'],['A kinder','second chance.']][label];
    const by=Math.min(H-171,y+ah+47);const fs=Math.min(43,43*342/Math.max(1,...headlines.map(s=>measureSpaced(ctx,s,43,th.fonts.display,400,-.02))));title(headlines[0],24,by,fs);title(headlines[1],24,by+fs,fs);
    seg(ctx,24,by+62,366,by+62,hexA(ink,.4),.7);mono(['CARDIAC LEASE / AUTO-RENEW ON','EMOTIONAL CULTURE / PLAN DEPENDENT','RESPIRATORY FINANCE / TERMS APPLY','CONTINUITY ASSURANCE / UNIT 002'][label],24,by+79,6);
    mono('Biology for a more manageable tomorrow.',24,by+98,6);mono('Property of Halcyon Biofab.',24,by+110,5.5);
  }else{
    // Quiet upper field for actual widgets and icons, with a low-contrast organ behind the lower grid.
    if(art){ctx.globalAlpha=dark?.25:.18;const aw=292,ah=aw*art.height/art.width;ctx.drawImage(art,49,H*.46,aw,ah);ctx.globalAlpha=1;}
    mono(th.company.toUpperCase(),24,H-139,9);mono('A LITTLE MORE LIFE. EVERY DAY.',24,H-122,6);
  }
  [[18,245],[372,245],[18,H-102],[372,H-102]].forEach(([x,y])=>{seg(ctx,x-4,y,x+4,y,hexA(ink,.5),.6);seg(ctx,x,y-4,x,y+4,hexA(ink,.5),.6);});
}
function hbIcon(ctx,th,glyph,code) {
  const dark=hbIsDark(th),ink=dark?'#EFF9EB':'#073C30';
  const g=ctx.createLinearGradient(0,0,1024,1024);g.addColorStop(0,dark?'#164C3D':'#F7FFF8');g.addColorStop(1,dark?'#082F26':'#CEF6E6');ctx.fillStyle=g;ctx.fillRect(0,0,1024,1024);
  ctx.strokeStyle=dark?'#73D8B2':'#65BB9C';ctx.lineWidth=8;ctx.beginPath();ctx.roundRect(26,26,972,972,164);ctx.stroke();
  ctx.fillStyle='#A68AE6';ctx.beginPath();ctx.arc(139,130,28,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(290,200);ctx.scale(18.5,18.5);ctx.fillStyle=ink;ctx.fill(glyph);ctx.restore();
  spaced(ctx,code,512,841,90,th.fonts.mono,400,.12,'center',ink);
  seg(ctx,825,126,850,150,ink,8);seg(ctx,850,150,876,106,ink,8);
}
