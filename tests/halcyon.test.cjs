const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root=require('node:path').join(__dirname,'..');
const paint=fs.readFileSync(root+'/src/halcyon/paint.js','utf8');
const ctx=vm.createContext({Date,console});vm.runInContext(paint+'\nglobalThis.api={hbAllocation,hbDuration,hbSunWindow,HB_SPRITES,HB_META};',ctx);const {hbAllocation:alloc,hbDuration}=ctx.api;
const ev=(title,start,end,cal='work',id='a')=>({title,startDate:new Date(start),endDate:new Date(end),calendar:{identifier:cal},identifier:id});
const selection={title:'Design review',calendar:'work',match:'title'};
const events=[ev('Design review','2026-10-12T10:30:00Z','2026-10-12T11:30:00Z'),ev('Design review','2026-10-19T10:30:00Z','2026-10-19T11:30:00Z','work','b'),ev('Unrelated','2026-10-12T12:00:00Z','2026-10-12T13:00:00Z'),ev('Design review','2026-10-12T12:00:00Z','2026-10-12T13:00:00Z','personal')];
test('Climate daylight accounts for daytime, sunset, overnight and missing solar data',()=>{
  const sun=ctx.api.hbSunWindow,r=[6,30],s=[18,42];
  assert.equal(sun(r,s,12).left,.5);assert.equal(sun(r,s,12).remaining,6);
  assert.equal(sun(r,s,18).phase,'night');assert.equal(sun(r,s,18).remaining,12);
  assert.equal(sun(r,s,4).phase,'night');assert.equal(sun(r,s,30).left,1);
  assert.equal(sun([],[],12),null);assert.equal(sun([NaN],[NaN],12),null);
});
test('Allocation countdown, count-up, then next matching occurrence',()=>{
  const before=alloc(events,selection,new Date('2026-10-12T10:06:00Z'));assert.equal(before.phase,'before');assert.equal(hbDuration(before.target-new Date('2026-10-12T10:06:00Z')),'0:24:00');
  const active=alloc(events,selection,new Date('2026-10-12T10:45:00Z'));assert.equal(active.phase,'active');assert.equal(active.frac,.25);assert.equal(+active.target,+events[0].startDate);
  const after=alloc(events,selection,new Date('2026-10-12T11:30:00Z'));assert.equal(after.phase,'before');assert.equal(+after.target,+events[1].startDate);
});
test('Missing selection and missing recurrence never invent appointments',()=>{assert.equal(alloc(events,null,new Date()).phase,'setup');assert.equal(alloc([],selection,new Date()).phase,'waiting');assert.equal(alloc(events,{...selection,title:'Deleted'},new Date()).phase,'waiting');});
test('Ignore all-day, invalid and zero-duration events; handle an overnight allocation',()=>{
  const overnight=ev('Design review','2026-10-12T23:00:00Z','2026-10-13T02:00:00Z');
  const bad=ev('Design review','invalid','invalid');const zero=ev('Design review','2026-10-13T00:00:00Z','2026-10-13T00:00:00Z');
  const all={...events[0],isAllDay:true};const a=alloc([bad,zero,all,overnight],selection,new Date('2026-10-13T01:00:00Z'));assert.equal(a.phase,'active');assert.equal(a.frac,2/3);
});
test('Calendar dates, including DST offset changes, are authoritative',()=>{
  const list=[ev('Design review','2026-10-31T09:00:00-04:00','2026-10-31T10:00:00-04:00'),ev('Design review','2026-11-01T09:00:00-05:00','2026-11-01T10:00:00-05:00')];
  const a=alloc(list,selection,new Date('2026-10-31T11:00:00-04:00'));assert.equal(a.target.toISOString(),'2026-11-01T14:00:00.000Z');
});
test('Embedded application and exported Scriptable template parse',()=>{
  const h=fs.readFileSync(root+'/index.html','utf8'),tpl=h.match(/<script type="text\/plain" id="tpl">([\s\S]*?)<\/script>/)[1],app=h.slice(h.lastIndexOf('<script>')+8,h.lastIndexOf('</script>'));
  new vm.Script(app);const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;new AsyncFunction(tpl.replace('__THEME__','{}'));
  assert.equal(Object.keys(ctx.api.HB_META).length,12);assert(!h.includes('@@APPLICATION@@'));assert(!tpl.includes('// @halcyon-runtime'));
});
