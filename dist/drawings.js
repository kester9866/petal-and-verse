'use strict';
const leaf='<path d="M98 157 Q62 148 61 124 Q89 120 98 157 M98 157 Q84 141 61 124 M102 134 Q137 121 139 104 Q111 107 102 134 M102 134 L139 104"/>';
function flowerDrawing(type,decorative=true){
 let shape='';const stem='<path d="M100 80 Q110 131 98 188"/>'+leaf;
 if(type==='rose'){shape='<path d="M100 87 C68 95 57 67 66 43 C49 32 80 11 100 23 C124 11 144 38 132 54 C141 79 116 98 100 87 Z M68 43 Q86 29 101 41 Q116 23 129 44 M66 59 Q88 56 101 80 Q107 50 132 54 M76 74 Q85 91 101 80 Q126 84 129 66 M83 45 Q93 38 106 47 Q122 43 120 61 Q110 78 101 70 Q82 67 83 45 M91 52 Q111 46 111 58 Q97 67 91 52 M89 88 L96 99 L100 88 L108 98 L112 89"/>'+stem;}
 else if(type==='tulip'){shape='<path d="M67 33 Q64 90 100 96 Q135 83 133 28 Q117 34 114 49 Q104 19 94 31 Q82 53 78 48 L67 33 M78 48 Q81 81 99 94 M114 49 Q117 78 99 94 M100 96 Q111 148 98 188 M100 174 Q60 153 66 107 Q95 124 100 174 M100 159 Q141 137 142 95 Q118 112 100 159"/>';}
 else if(type==='sunflower'||type==='daisy'){const count=type==='sunflower'?15:11;for(let i=0;i<count;i++)shape+=`<ellipse cx="100" cy="34" rx="${type==='sunflower'?7:8}" ry="22" transform="rotate(${i*360/count} 100 65)"/>`;shape+='<circle cx="100" cy="65" r="18"/>';if(type==='sunflower'){for(let x=90;x<=110;x+=5)for(let y=55;y<=75;y+=5)shape+=`<circle cx="${x}" cy="${y}" r=".6"/>`;}shape+=stem;}
 else if(type==='lily'){shape='<path d="M100 79 Q67 79 53 47 Q82 48 100 69 Q91 41 104 15 Q120 42 107 69 Q133 40 153 44 Q139 71 113 78 Q139 87 145 115 Q114 109 104 87 Q101 116 77 128 Q75 102 94 86 Q61 99 46 79 Q72 68 100 79 M100 79 L76 55 M100 79 L106 36 M100 79 L136 55 M100 79 L127 101 M100 79 L83 108 M100 79 L61 79 M100 87 Q111 138 98 188"/>'+leaf+'<circle cx="76" cy="55" r="2"/><circle cx="106" cy="36" r="2"/><circle cx="136" cy="55" r="2"/>';}
 else if(type==='calla'){shape='<path d="M100 100 Q47 69 66 21 Q87 53 127 28 Q150 63 100 100 M100 100 Q78 77 92 60 Q112 44 127 28 M100 83 L101 47 M98 104 Q112 142 98 188 M100 170 Q56 155 64 106 Q93 135 100 170 M101 162 Q137 158 145 128 Q116 133 101 162"/>';}
 else if(type==='bells'){shape='<path d="M97 185 Q102 122 95 39 Q94 20 106 20 M96 164 Q55 155 62 55 Q94 86 96 164 M97 166 Q132 163 142 71 Q103 112 97 166"/>';for(let i=0;i<5;i++){let y=37+i*23;shape+=`<path d="M96 ${y} Q119 ${y-12} 122 ${y+1} M111 ${y+5} Q108 ${y+21} 105 ${y+23} Q119 ${y+31} 137 ${y+20} Q128 ${y+15} 130 ${y+4} Q120 ${y-4} 111 ${y+5} Z"/>`;}}
 else if(type==='lavender'){shape='<path d="M102 188 Q100 123 101 33 M93 157 Q67 135 69 86 M108 149 Q133 117 135 70"/>';for(let i=0;i<8;i++){let y=29+i*11;shape+=`<ellipse cx="${i%2?106:96}" cy="${y}" rx="5" ry="8" transform="rotate(${i%2?35:-35} ${i%2?106:96} ${y})"/>`;}for(let i=0;i<5;i++){let y=67+i*10;shape+=`<ellipse cx="${i%2?72:66}" cy="${y}" rx="4" ry="6" transform="rotate(-25 69 ${y})"/><ellipse cx="${i%2?139:131}" cy="${y-16}" rx="4" ry="6" transform="rotate(30 135 ${y-16})"/>`;}shape+='<path d="M100 174 Q70 164 64 148 Q93 150 100 174 M102 172 Q130 157 133 141 Q107 149 102 172"/>';}
 else if(type==='branch'||type==='freesia'){shape='<path d="M100 188 Q95 132 104 50 M100 150 Q73 129 65 91 M102 125 Q133 105 139 64 M103 88 Q81 72 80 38 M100 164 Q134 148 145 113"/>';const spots=[[104,41],[81,32],[65,83],[139,55],[145,106],[82,111],[122,90],[108,65]];for(let [x,y]of spots){for(let i=0;i<5;i++)shape+=`<ellipse cx="${x}" cy="${y-6}" rx="4" ry="7" transform="rotate(${i*72} ${x} ${y})"/>`;shape+=`<circle cx="${x}" cy="${y}" r="2"/>`;}shape+='<path d="M99 178 Q76 167 72 148 Q93 154 99 178 M102 159 Q124 157 133 140 Q110 140 102 159"/>';}
 else if(type==='star'){shape='<path d="M100 81 Q83 106 60 100 Q66 78 76 68 Q52 56 58 37 Q81 36 91 50 Q99 27 116 23 Q130 41 116 59 Q142 55 151 74 Q138 89 114 78 Q118 103 100 117 Q86 102 100 81 M91 71 L79 56 M100 69 L109 44 M109 72 L132 74 M105 83 L105 99 M92 79 L75 89"/>'+stem;}
 else if(type==='orchid'){shape='<path d="M100 74 Q57 76 54 50 Q55 28 83 46 Q96 51 100 63 Q97 30 114 24 Q135 28 117 59 Q135 33 151 48 Q167 70 114 78 Q138 87 129 108 Q110 116 102 90 Q93 120 74 106 Q67 90 94 79 M94 71 Q107 60 117 73 L110 87 L99 86 Z M104 105 Q111 149 98 188"/>'+leaf;}
 else {for(let ring=0;ring<3;ring++){let n=ring===2?5:9;let rad=ring===0?31:ring===1?20:9;for(let i=0;i<n;i++){let a=i*360/n+ring*18;shape+=`<path d="M100 ${65+rad} Q78 ${65-rad} 94 ${65-rad-13} Q103 ${65-rad-20} 111 ${65-rad-10} Q120 ${65-rad} 100 ${65+rad}" transform="rotate(${a} 100 65)"/>`;}}shape+=stem;}
 if(['rose','sunflower','daisy','lily','carnation','star','camellia','orchid'].includes(type))shape+='<g stroke-width=".55"><path d="M68 128 L80 130 M74 133 L87 135 M82 140 L92 141 M90 146 L96 146 M134 108 L122 111 M129 114 L115 117 M121 120 L109 122"/></g>';
 // Separate compound flower outlines from their stalk before animating them.
 const stalkStart={tulip:'M100 96',lily:'M100 87',calla:'M98 104',orchid:'M104 105'}[type];
 if(stalkStart)shape=shape.replace(/<path d="([^"]+)"\/>/,(_,d)=>{const at=d.indexOf(stalkStart);return at<0?`<path d="${d}"/>`:`<path d="${d.slice(0,at).trim()}"/><path data-stalk="true" d="${d.slice(at)}"/>`;});
 const parts=shape.match(/<g\b[^>]*>[\s\S]*?<\/g>|<(?:path|ellipse|circle)\b[^>]*\/>/g)||[];
 const centre={tulip:[100,96],lily:[100,79],calla:[100,100],star:[100,78],orchid:[104,78],rose:[100,87]}[type]||[100,65];
 const sprig=['bells','lavender','branch','freesia'].includes(type);let petal=0;
 shape=parts.map((part,index)=>{
  const stalk=part.includes('data-stalk')||part===leaf||part.startsWith('<g')||part.startsWith('<path d="M100 80')||(sprig&&(index===0||part.startsWith('<path d="M100 174')||part.startsWith('<path d="M99 178')));
  if(stalk)return `<g class="bloom-stem">${part}</g>`;
  // Outer wrapper preserves each petal's original SVG rotation.
  const origin=sprig?'center bottom':`${((centre[0]-35)/135*100).toFixed(3)}% ${((centre[1]-5)/190*100).toFixed(3)}%`;
  return `<g class="bloom-petal${sprig?' bloom-sprig':''}" style="--petal-delay:${(petal++%9)*14}ms;--petal-origin:${origin}">${part}</g>`;
 }).join('');
 return `<svg viewBox="35 5 135 190" ${decorative?'aria-hidden="true"':'role="img"'}>${shape}</svg>`;
}
document.getElementById('brand-flower').innerHTML=flowerDrawing('daisy');
document.getElementById('daily-art').innerHTML=flowerDrawing('sunflower');

function gardenDrawing(){
 const leaf=(x,y,a,s=1)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0 Q-19 -9 -8 -36 Q14 -19 0 0 Z M0 0 L-8 -36"/><g stroke-width=".55"><path d="M-2 -8 L-10 -13 M-4 -15 L-12 -21 M-5 -22 L-10 -28 M-1 -10 L6 -15 M-3 -18 L3 -23 M-5 -26 L-1 -30"/></g></g>`;
 const bloom=(x,y,size,petals=9)=>{let b=`<g transform="translate(${x} ${y}) scale(${size})" fill="white">`;for(let i=0;i<petals;i++)b+=`<path d="M0 4 C-17 -5 -17 -29 0 -30 C17 -29 17 -5 0 4 Z M0 -6 L0 -23" transform="rotate(${i*360/petals})"/>`;b+='<circle r="8"/><circle r="4"/>';for(let i=0;i<12;i++)b+=`<circle cx="${(6*Math.cos(i*Math.PI/6)).toFixed(2)}" cy="${(6*Math.sin(i*Math.PI/6)).toFixed(2)}" r=".65" fill="#202020"/>`;return b+'</g>';};
 let art='<svg viewBox="0 0 440 470" aria-hidden="true"><path stroke="#b5b5b5" d="M53 439 V195 C53 88 117 27 220 27 C323 27 387 88 387 195 V439 M64 432 V195 C64 95 123 38 220 38 C317 38 376 95 376 195 V432"/><path d="M39 444 C97 368 25 325 61 248 C88 193 61 140 98 98 C132 59 163 39 220 47 M401 445 C343 368 415 325 379 248 C352 193 379 140 342 98 C308 59 277 39 220 47"/>';
 const points=[[49,423,-35],[57,389,47],[58,353,-61],[49,321,25],[48,284,-45],[68,245,59],[72,207,-53],[73,172,36],[85,137,-23],[104,99,54],[139,75,-15],[177,53,61],[218,48,-30]];
 for(const [x,y,a]of points){art+=leaf(x,y,a,.74);art+=leaf(440-x,y,-a,.74);}
 for(const [x,y,s,n]of [[56,349,.55,7],[60,218,.48,9],[103,94,.54,8],[166,53,.42,7],[384,349,.55,7],[380,218,.48,9],[337,94,.54,8],[274,53,.42,7]])art+=bloom(x,y,s,n);
 const plant=(type,x,y,w,h,a)=>`<g transform="rotate(${a} ${x+w/2} ${y+h})">${flowerDrawing(type).replace('<svg viewBox="35 5 135 190" aria-hidden="true">',`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="35 5 135 190">`)}</g>`;
 art+=plant('rose',96,109,149,305,-13)+plant('tulip',220,192,115,223,15)+plant('daisy',217,78,126,287,16)+plant('lavender',109,226,92,190,-24);
 art+='<path d="M142 426 Q212 395 292 428 M124 440 Q220 423 320 440 M164 414 Q157 374 177 349 M300 432 Q307 404 293 384"/>'+leaf(177,349,40,.8)+leaf(294,389,-45,.8);
 art+='<g transform="translate(266 170) rotate(-13)" fill="white"><path d="M0 0 C-11 -30 -31 -28 -25 -10 Q-24 5 -2 6 C-17 8 -17 24 -6 23 Q4 22 3 4 C17 15 31 3 23 -8 Q16 -16 4 0 C8 -32 29 -32 30 -15 Q30 -4 6 3 M0 -1 L5 16 M2 -1 Q-4 -11 -7 -8 M4 0 Q9 -11 12 -9"/><path stroke-width=".55" d="M-3 2 Q-19 -16 -20 -12 M5 2 Q19 -19 23 -15 M-3 8 L-7 17 M8 6 L20 3"/></g>';
 for(const [x,y]of [[137,191],[198,101],[302,303],[108,301],[327,172]])art+=`<path stroke-width=".65" d="M${x-4} ${y}h8 M${x} ${y-4}v8"/>`;
 return art+'</svg>';
}
document.getElementById('hero-bouquet').innerHTML=gardenDrawing();
