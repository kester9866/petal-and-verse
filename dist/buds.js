'use strict';
// All phases share the same petals. Their curves and angles change around
// fixed attachment points, so the bud opens instead of scaling up.
const budModels=new Map();
const budMix=(a,b,p)=>a+(b-a)*p;
const budEase=p=>p*p*(3-2*p);
function budModel(type){
 if(budModels.has(type))return budModels.get(type);
 const petals=[],centres=[];let stem='';
 const add=(cx,cy,count,length,width,options={})=>{
  const size=options.size||1;
  for(let i=0;i<count;i++){
   const rawAngle=options.angles?options.angles[i]:i*360/count+(options.offset||0);
   const angle=((rawAngle+180)%360+360)%360-180;
   petals.push({cx,cy,angle,closedAngle:(i-(count-1)/2)*2.2,closedLength:(options.closedLength||43)*size,length:length*size,width:width*size,closedWidth:(options.closedWidth||10)*size,delay:(options.delay||0)+i*.008,curl:(options.curl||0)*size});
  }
  centres.push({cx,cy,r:(options.disc||0)*size});
 };
 let cy=82;
 if(type==='tulip'){
  cy=96;add(100,cy,5,63,16,{angles:[-43,43,-23,23,0],closedLength:62,closedWidth:12,delay:.05,curl:3});
 }else if(type==='lily'){
  cy=83;add(100,cy,6,56,15,{closedLength:52,closedWidth:9,curl:9,offset:0});
 }else if(type==='orchid'){
  cy=78;add(100,cy,5,48,24,{angles:[-70,70,-24,24,180],closedLength:49,closedWidth:11,curl:6});
  add(100,cy+4,2,21,13,{angles:[150,210],closedLength:28,delay:.36,closedWidth:7,curl:4});
 }else if(type==='calla'){
  cy=101;add(100,cy,2,68,25,{angles:[-24,17],closedLength:65,closedWidth:14,curl:10,delay:.02});
  centres.push({cx:100,cy:76,r:2});
 }else if(type==='sunflower'||type==='daisy'){
  cy=65;add(100,cy,type==='sunflower'?15:12,type==='sunflower'?45:42,type==='sunflower'?9:8,{closedLength:44,closedWidth:10,disc:type==='sunflower'?17:9});
 }else if(type==='star'){
  cy=75;add(100,cy,5,49,24,{closedLength:48,closedWidth:11,curl:8,offset:0,disc:3});
 }else if(['branch','freesia','bells','lavender'].includes(type)){
  const sites=type==='lavender'?[[100,35,.25],[94,48,.26],[106,59,.27],[96,72,.28],[108,85,.27],[98,98,.27],[70,76,.22],[65,92,.24],[73,105,.25],[132,61,.23],[138,77,.24],[130,91,.25]]:type==='bells'?[[121,43,.44],[123,67,.46],[124,91,.47],[124,116,.46],[123,140,.42]]:[[104,44,.52],[79,65,.42],[65,93,.43],[137,72,.48],[144,119,.46],[82,123,.38]];
  stem='<path d="M100 188 Q101 122 99 27"/>';
  for(const [index,site]of sites.entries()){
   const [x,y,size]=site;stem+=`<path d="M100 ${Math.min(177,y+28)} Q${x} ${y+21} ${x} ${y}"/>`;
   add(x,y,type==='lavender'?3:5,type==='bells'?38:34,type==='bells'?15:16,{size,closedWidth:11,closedLength:38,delay:index*.026,angles:type==='bells'?[135,155,180,205,225]:undefined,disc:type==='bells'?0:3});
  }
 }else{
  // Nested layers give rose-like flowers an opening from the outside inward.
  cy=79;add(100,cy,7,45,23,{closedLength:51,closedWidth:12,curl:8,offset:24});
  add(100,cy,6,31,19,{closedLength:46,closedWidth:10,curl:7,offset:0,delay:.20});
  add(100,cy,5,17,12,{closedLength:35,closedWidth:7,curl:4,offset:30,delay:.36});
 }
 if(!stem)stem=`<path d="M100 ${cy} Q111 139 98 188"/>`;
 stem+='<path d="M100 165 Q65 158 62 125 Q90 130 100 165 M100 165 L62 125 M102 143 Q132 135 140 109 Q112 113 102 143 M102 143 L140 109"/><g stroke-width=".5"><path d="M74 137 L85 140 M80 146 L92 149 M126 119 L115 123 M131 126 L115 131"/></g>';
 const model={petals,centres,stem,cy};budModels.set(type,model);return model;
}
function budPetal(spec,progress){
 const t=budEase(Math.max(0,Math.min(1,(progress-spec.delay)/(1-spec.delay))));
 const l=spec.length,w=spec.width,cl=spec.closedLength,cw=spec.closedWidth;
 const closed=[0,0,-cw*.36,-cl*.26,-cw*.60,-cl*.82,0,-cl,cw*.65,-cl*.83,cw*.37,-cl*.27];
 const opened=[0,0,-w,-l*.24,-w*.94,-l*.89,spec.curl,-l,w*.87,-l*.96,w,-l*.22];
 const angle=budMix(spec.closedAngle,spec.angle,t)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),points=[];
 for(let i=0;i<closed.length;i+=2){const x=budMix(closed[i],opened[i],t),y=budMix(closed[i+1],opened[i+1],t);points.push((spec.cx+x*c-y*s).toFixed(2),(spec.cy+x*s+y*c).toFixed(2));}
 const pair=i=>points.slice(i,i+2).join(' ');
 return {outline:`M${pair(0)} C${pair(2)} ${pair(4)} ${pair(6)} C${pair(8)} ${pair(10)} ${pair(0)} Z`,vein:`M${pair(0)} Q${((+points[0]+ +points[6])*.5).toFixed(2)} ${((+points[1]+ +points[7])*.5).toFixed(2)} ${pair(6)}`};
}
function buddingDrawing(type,progress=0){
 const m=budModel(type),p=Math.max(0,Math.min(1,progress));
 const petals=m.petals.map((spec,i)=>{const d=budPetal(spec,p);return `<g fill="white"><path data-bud-petal="${i}" d="${d.outline}"/><path data-bud-vein="${i}" d="${d.vein}" fill="none" stroke-width=".45" stroke="#777777"/></g>`;}).join('');
 const discs=m.centres.filter(c=>c.r).map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="white"/><circle cx="${c.cx}" cy="${c.cy}" r="${c.r*.55}" stroke-width=".55"/>`).join('');
 return `<svg viewBox="35 5 135 190" aria-hidden="true" data-bud-type="${type}"><g class="bud-stalk">${m.stem}</g>${petals}<g data-bud-centre opacity="${budEase(Math.max(0,(p-.48)/.52)).toFixed(3)}">${discs}</g></svg>`;
}
function paintBudding(svg,type,progress){
 const m=budModel(type),outlines=svg.querySelectorAll('[data-bud-petal]'),veins=svg.querySelectorAll('[data-bud-vein]');
 m.petals.forEach((spec,i)=>{const d=budPetal(spec,progress);outlines[i]?.setAttribute('d',d.outline);veins[i]?.setAttribute('d',d.vein);});
 svg.querySelector('[data-bud-centre]')?.setAttribute('opacity',budEase(Math.max(0,Math.min(1,(progress-.48)/.52))).toFixed(3));
}
