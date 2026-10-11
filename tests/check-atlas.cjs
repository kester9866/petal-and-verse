const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),storage=new Map(),events=new Map();
function element(id){
 if(!elements.has(id)){
  const classes=new Set(),attrs={};
  elements.set(id,{id,innerHTML:'',textContent:'',hidden:false,value:'',open:false,checked:false,scrollTop:0,dataset:{},style:{},attrs,
   classList:{add(c){classes.add(c)},remove(c){classes.delete(c)},toggle(c,yes){yes?classes.add(c):classes.delete(c)},contains(c){return classes.has(c)}},
   setAttribute(k,v){attrs[k]=v},addEventListener(k,v){events.set(id+':'+k,v)},focus(){},querySelector(){return null},querySelectorAll(){return []},contains(){return false},scrollIntoView(){},
   showModal(){this.open=true},close(){this.open=false;events.get(id+':close')?.()},getBoundingClientRect(){return {left:0,right:800,top:0,bottom:800}}});
 }
 return elements.get(id);
}
const html=fs.readFileSync('dist/index.html','utf8');
const textElements=[...html.matchAll(/data-i18n="([^"]+)"/g)].map((m,i)=>{const el=element('translation-'+i);el.dataset.i18n=m[1];return el});
const document={getElementById:element,documentElement:{lang:'en'},body:element('body'),querySelectorAll(q){return q==='[data-i18n]'?textElements:[]},addEventListener(k,v){events.set('document:'+k,v)},activeElement:{tagName:'BODY',matches(){return false}}};
const context=vm.createContext({document,localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},setTimeout(){return 1},clearTimeout(){},navigator:{clipboard:{writeText:async()=>{}}},console,Math,Set,Map});
for(const file of ['catalog.js','drawings.js','buds.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
vm.runInContext(`
 function check(ok,label){if(!ok)throw Error(label);}
 check(flowers.length===188,'188 entries');check(new Set(flowers.map(f=>f.id)).size===188,'Unique identifiers');
 check(new Set(flowers.map(f=>f.genus)).size===185,'185 genera');check(Object.keys(families).length===73,'73 families');check(Object.keys(CATALOG.ordersZh).length===32,'32 orders');
 for(const f of flowers){
  check(f.order===families[f.family].order,'Consistent taxonomy '+f.id);
  check(['en','fr','zh'].every(lang=>f.name[lang]&&f.desc[lang]&&families[f.family].note[lang]&&CATALOG.meanings[f.meaning].text[lang]),'All languages '+f.id);
  check(f.examples.length>0,'Representative species '+f.id);check(f.botanicalSource.startsWith('https://'),'Botanical reference '+f.id);
  check(flowerDrawing(f.type).includes('<svg'),'Drawing '+f.id);
  const m=CATALOG.meanings[f.meaning];check(m.source==='none'||CATALOG.sources[m.source]?.url.startsWith('https://'),'Meaning reference '+f.id);
 }
 for(const family of Object.keys(families))check(flowers.some(f=>f.family===family),'Represented family '+family);
 for(const order of Object.keys(CATALOG.ordersZh))check(flowers.some(f=>f.order===order),'Represented order '+order);
 for(const el of document.querySelectorAll('[data-i18n]'))check(labels[el.dataset.i18n]?.every(Boolean),'UI translations '+el.dataset.i18n);
 check(getFiltered().length===188,'Initial collection');check((grid.innerHTML.match(/class="flower-card"/g)||[]).length===24,'Initial pagination');
 visibleLimit=48;render();check((grid.innerHTML.match(/class="flower-card"/g)||[]).length===48,'More pagination');
 searchValue='向日葵';check(getFiltered().some(f=>f.id==='sunflower'),'Chinese search');
 searchValue='HÉMÉROCALLE';check(getFiltered().some(f=>f.id==='daylily'),'French accent search');
 searchValue='OEILLET';check(getFiltered().some(f=>f.id==='carnation'),'French ligature search');
 searchValue='ŒILLET';check(getFiltered().some(f=>f.id==='carnation'),'Uppercase French ligature search');
 searchValue='Eustoma';check(getFiltered().some(f=>f.id==='eustoma'),'Latin search');
 searchValue='Gentianaceae';check(getFiltered().some(f=>f.id==='eustoma'),'Family search');
 searchValue='balloon flower';check(getFiltered().some(f=>f.id==='balloon-flower'),'English search');
 searchValue='no-such-flower-ever';render();check(grid.hidden&&!document.getElementById('empty').hidden,'Empty state');
 reset();chooseBranch('family','Liliaceae');check(selectedOrder==='Liliales'&&getFiltered().every(f=>f.family==='Liliaceae'),'Family cascade');
 chooseBranch('genus','Platycodon');check(selectedFamily==='Campanulaceae'&&selectedOrder==='Asterales'&&getFiltered().length===1,'Balloon flower classification');
 chooseBranch('genus','Eustoma');check(selectedFamily==='Gentianaceae'&&selectedOrder==='Gentianales','Lisianthus classification');
 reset();activeCategory='purity';check(getFiltered().length>3&&getFiltered().every(f=>CATALOG.meanings[f.meaning].category.includes('purity')),'Meaning category');
 reset();activeCategory='botany';check(getFiltered().every(f=>CATALOG.meanings[f.meaning].source==='none'),'No fabricated meaning');
 reset();toggleSave('rose');onlySaved=true;check(getFiltered().length===1&&getFiltered()[0].id==='rose','Saved filter');toggleSave('rose');check(getFiltered().length===0,'Remove favorite');reset();
 language='fr';applyLanguage();check(document.documentElement.lang==='fr','French document');check(document.getElementById('search').placeholder===labels.searchPlaceholder[1],'French search copy');
 openFlower('eustoma');let detail=document.getElementById('detail-content').innerHTML;check(dialog.open&&detail.includes('Gentianales')&&detail.includes('Gentianaceae')&&detail.includes('Eustoma')&&detail.includes('洋桔梗'),'Trilingual detail');
 check(detail.includes('Espèces et groupes horticoles représentatifs'),'French species heading');
 openFlower('plum-blossom');check(document.getElementById('detail-content').innerHTML.includes(t('noMeaning')),'Unsupported meaning disclosed');
 openFlower('lily');check(document.getElementById('detail-content').innerHTML.includes('gutenberg.org'),'Historical meaning reference');
 showChinese=false;applyLanguage();check(document.body.classList.contains('no-chinese'),'Chinese notes toggle');searchValue='洋桔梗';check(getFiltered().some(f=>f.id==='eustoma'),'Chinese search stays available');
 dialog.close();check(document.body.style.overflow==='','Body scrolling restored');reset();
 check((document.getElementById('taxonomy-tree').innerHTML.match(/class="order-branch"/g)||[]).length===32,'Every order visible');
 check((document.getElementById('taxonomy-tree').innerHTML.match(/class="family-branch"/g)||[]).length===73,'Every family visible');
 check((document.getElementById('taxonomy-tree').innerHTML.match(/class="genus-link"/g)||[]).length===185,'Every genus visible');
`,context);
const css=fs.readFileSync('dist/style.css','utf8');
for(const match of css.matchAll(/#([0-9a-f]{6})\b/gi)){const c=match[1];assert(c.slice(0,2)===c.slice(2,4)&&c.slice(2,4)===c.slice(4,6),'Monochrome '+c)}
assert(!/https?:\/\/.+\.js/.test(html),'No remote scripts');
assert.equal([...html.matchAll(/id="([^"]+)"/g)].length,new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])).size,'Unique DOM IDs');
console.log('PASS: 188 complete trilingual entries; 185 genera, 73 families, 32 orders; taxonomy cascades; English/French/Chinese/Latin search; accents and ligatures; 24/48-entry pagination; source integrity; favorites; French rendering; details; Chinese toggle; SVGs; monochrome palette.');
module.exports={context,elements,events,storage};
