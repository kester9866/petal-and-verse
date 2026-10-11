const vm=require('node:vm'),assert=require('node:assert/strict');
const {context,elements}=require('./check-atlas.cjs');
let reduced=false,cancelled=0,removed=0,sequence=0,lastAnimation;
const frames=new Map();
context.matchMedia=()=>({matches:reduced});
context.requestAnimationFrame=callback=>{frames.set(++sequence,callback);return sequence};
context.cancelAnimationFrame=id=>frames.delete(id);
function svg(){const outlines=Array.from({length:64},()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v}})),veins=Array.from({length:64},()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v}}));return {outlines,veins,style:{},animate(){},querySelectorAll(q){return q.includes('vein')?veins:outlines},querySelector(){return {setAttribute(){}}},getBoundingClientRect(){return {left:80,top:100,width:230,height:340}}};}
const target=svg(),overlayNodes=[];
context.document.createElement=()=>{const drawing=svg();return {style:{},innerHTML:'',drawing,setAttribute(){},querySelector(){return drawing},remove(){removed++},animate(keyframes,options){lastAnimation={keyframes,options};return {cancel(){cancelled++}}}}};
const dialog=elements.get('flower-dialog');dialog.querySelector=()=>target;dialog.appendChild=node=>overlayNodes.push(node);
const classes=new Set(),card={classList:{add(c){classes.add(c)},remove(c){classes.delete(c)}}};
context.trigger={querySelector(){return {getBoundingClientRect(){return {left:360,top:500,width:155,height:174}}}},closest(){return card}};
const run=code=>vm.runInContext(code,context);
run("openFlower('rose',trigger)");
assert(dialog.open&&target.style.visibility==='hidden');assert.equal(lastAnimation.options.duration,520);
const flight=overlayNodes.at(-1),closed=flight.drawing.outlines[0].attrs.d;
let frame=frames.get(sequence);frames.delete(sequence);frame(0);
frame=frames.get(sequence);frames.delete(sequence);frame(1000);
const middle=flight.drawing.outlines[0].attrs.d;assert.notEqual(closed,middle,'Petal curves genuinely change');
frame=frames.get(sequence);frames.delete(sequence);frame(2000);
assert.equal(target.style.visibility,'');assert(!dialog.classList.contains('is-opening'));assert.equal(removed,1);
run("openFlower('lily',trigger);openFlower('tulip',trigger)");assert.equal(frames.size,1,'One animation after repeated clicks');assert.equal(cancelled,2);
run('dialog.close()');assert.equal(frames.size,0,'Close cancels all frames');assert.equal(target.style.visibility,'');assert.equal(context.document.body.style.overflow,'');
reduced=true;const previous=overlayNodes.length;
run("openFlower('sunflower',trigger)");assert(dialog.open);assert.equal(overlayNodes.length,previous);assert.equal(frames.size,0);run('dialog.close()');
const types=run('[...new Set(flowers.map(f=>f.type))]');
for(const type of types){
 const model=run(`budModel(${JSON.stringify(type)})`);
 for(const spec of model.petals){
  const a=run(`budPetal(${JSON.stringify(spec)},0)`),b=run(`budPetal(${JSON.stringify(spec)},1)`);
  assert.notEqual(a.outline,b.outline);assert(!/NaN|Infinity/.test(a.outline+b.outline));assert.equal(a.outline.split(' C')[0],b.outline.split(' C')[0],'Petal base remains fixed');assert(spec.angle>=-180&&spec.angle<=180,'No full-turn petal spins');
 }
 assert.notEqual(run(`buddingDrawing(${JSON.stringify(type)},0)`),run(`buddingDrawing(${JSON.stringify(type)},1)`));
}
const rose=run("budModel('rose').petals[0]");
const closedD=run(`budPetal(${JSON.stringify(rose)},0).outline`),openD=run(`budPetal(${JSON.stringify(rose)},1).outline`);
const width=d=>{const pairs=[...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>+m[0]).filter((n,i)=>i%2===0);return Math.max(...pairs)-Math.min(...pairs)};
assert(width(openD)>width(closedD)*2,'Unfolding increases petal spread');
assert(!elements.get('flower-grid').innerHTML.includes('data-bud-type'),'Cards preserve original open illustrations');
assert(elements.get('flower-grid').innerHTML.includes('bloom-petal'),'Original ink artwork restored');
console.log('PASS: true petal-curve morphing, fixed petal roots, wider open petals, 2-second cycle, original open covers, interrupted/closed cleanup, reduced motion, and all illustration types.');
// Hover shares the click timeline, and must release all frames/layers.
reduced=false;
const hoverOriginal=svg(),hoverIllustration={querySelector(){return hoverOriginal},appendChild(node){this.layer=node}};
const hoverClasses=new Set(),hoverCard={classList:{add(c){hoverClasses.add(c)},remove(c){hoverClasses.delete(c)}},querySelector(q){return q==='.card-open'?{dataset:{open:'rose'}}:hoverIllustration}};
context.hoverCard=hoverCard;
run('startCardBloom(hoverCard)');assert.equal(frames.size,1);
frame=frames.get(sequence);frames.delete(sequence);frame(0);
frame=frames.get(sequence);frames.delete(sequence);frame(280);
assert.equal(hoverOriginal.style.opacity,'0','Cover gives way to morphing petals');
assert.equal(run('cardBlooms.get(hoverCard).timeline'),.14);
const hoveredPath=hoverIllustration.layer.drawing.outlines[0].attrs.d;
frame=frames.get(sequence);frames.delete(sequence);frame(1000);
assert.notEqual(hoverIllustration.layer.drawing.outlines[0].attrs.d,hoveredPath);
const hoverSource={querySelector(){return hoverOriginal},closest(){return hoverCard}};context.hoverSource=hoverSource;
run("openFlower('rose',hoverSource)");assert.equal(run('cardBlooms.size'),0);assert.equal(frames.size,1,'Hover yields to one detail animation');
const carriedPath=overlayNodes.at(-1).drawing.outlines[0].attrs.d;
assert.equal(carriedPath,run("budPetal(budModel('rose').petals[0],bloomPhase(.5)).outline"),'Click continues current petal phase');
run('dialog.close();startCardBloom(hoverCard);stopCardBloom(hoverCard)');assert.equal(frames.size,0);assert.equal(hoverOriginal.style.opacity,'');assert(!hoverClasses.has('is-hover-bloom'));
run('startCardBloom(hoverCard)');frame=frames.get(sequence);frames.delete(sequence);frame(0);frame=frames.get(sequence);frames.delete(sequence);frame(2000);
assert.equal(frames.size,0);assert.equal(run('cardBlooms.size'),0);assert.equal(hoverOriginal.style.opacity,'','Hover completion restores cover');
run('startCardBloom(hoverCard);render()');assert.equal(frames.size,0,'Filtering cleans up hover animation');
reduced=true;run('startCardBloom(hoverCard)');assert.equal(frames.size,0);
console.log('PASS: hover contracts/unfolds in place, hover-to-click continuity, pointer-exit cleanup, completion restores original cover, filter cleanup, and reduced-motion hover.');
