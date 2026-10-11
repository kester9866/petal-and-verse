'use strict';
const flowers=CATALOG.flowers, families=CATALOG.families;
const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae');
const labels={
navFlowers:['Flowers','Les fleurs'],navBotany:['Botanical branches','Parentés botaniques'],saved:['Saved','Favoris'],
heroEyebrow:['A FIELD GUIDE TO FEELING','UN HERBIER DES ÉMOTIONS'],heroTitle:['Every bloom,\na quiet story.','Chaque fleur,\nune histoire.'],heroDescription:['Follow a petal from its botanical family to the words it has come to carry.','Suivez un pétale, de sa famille botanique aux mots qu’il a appris à porter.'],openAtlas:['Open the atlas','Ouvrir l’atlas'],randomFlower:['Meet a flower','Rencontrer une fleur'],featured:['In the garden','Au jardin'],dailyQuote:['A little light, held in petals.','Un peu de lumière, au creux des pétales.'],
collectionTitle:['Find your kind of bloom.','Trouvez votre fleur.'],collectionHint:['Names, kinships, and meanings.','Noms, parentés et symboles.'],savedOnly:['Saved only','Mes favoris'],order:['Order','Ordre'],family:['Family','Famille'],genus:['Genus','Genre'],reset:['Reset','Réinitialiser'],emptyTitle:['No blooms on this branch yet.','Aucune fleur sur cette branche.'],emptyText:['Try another name or clear your filters.','Essayez un autre nom ou effacez les filtres.'],browseAll:['Browse all flowers ↗','Voir toutes les fleurs ↗'],loadMore:['More blooms ↓','Plus de fleurs ↓'],collectionBottom:['Take your time. Follow a petal.','Prenez votre temps. Suivez un pétale.'],backToAtlas:['Back to the atlas ↑','Retour à l’atlas ↑'],
taxonomyTitle:['One garden. Many kinships.','Un jardin. Mille parentés.'],taxonomyIntro:['Open an order, read a family, then follow a genus into the atlas. These branches cover the common garden, cut and indoor flowers selected for this collection.','Ouvrez un ordre, découvrez une famille, puis suivez un genre dans l’atlas. Ces branches réunissent les fleurs de jardin, de bouquet et d’intérieur choisies pour cette collection.'],orderDefinition:['A broad branch that brings related families together.','Une grande branche réunissant des familles apparentées.'],familyDefinition:['Related genera grouped by shared ancestry and botanical traits.','Des genres liés par leur histoire évolutive et leurs caractères botaniques.'],genusDefinition:['Closely related species. An entry may include several garden forms.','Des espèces proches. Une fiche peut réunir plusieurs formes horticoles.'],
aboutTitle:['Rooted in science.\nWritten in feeling.','Racines scientifiques.\nMots sensibles.'],aboutBotany:['Orders and families follow APG IV; names and garden examples are checked against Kew and RHS references. Botanical classifications can change as research develops.','Les ordres et familles suivent APG IV; noms et exemples horticoles s’appuient sur Kew et la RHS. Les classifications évoluent avec la recherche.'],aboutMeaning:['Flower meanings belong to cultural traditions. We distinguish a historical lexicon from contemporary florist usage, and leave unsupported meanings open.','Le langage des fleurs relève de traditions culturelles. Nous distinguons lexique historique et usages actuels des fleuristes, sans inventer de sens non documenté.'],aboutScope:['Species are representative examples, not exhaustive lists. French texts are translations of the cited traditions. The ink drawings are decorative, rather than identification keys.','Les espèces citées sont des exemples, pas des listes complètes. Les textes français traduisent les traditions citées. Les dessins à l’encre sont décoratifs et ne servent pas à identifier une plante.'],sources:['Read the sources','Consulter les sources'],footer:['A small archive of blooms and belonging.','Un petit recueil de fleurs et de liens.'],readNotes:['Botanical & cultural notes ↗','Notes botaniques et culturelles ↗'],
all:['All blooms','Toutes'],love:['Love','Amour'],gratitude:['Gratitude','Gratitude'],wishes:['Good wishes','Vœux'],memory:['Remembrance','Souvenir'],purity:['Purity','Pureté'],courage:['Courage','Courage'],history:['Historic meanings','Sens historiques'],botany:['Botanical focus','Botanique'],
allOrders:['All orders','Tous les ordres'],allFamilies:['All families','Toutes les familles'],allGenera:['All genera','Tous les genres'],searchPlaceholder:['Name, meaning, or Latin genus…','Nom, symbole ou genre latin…'],searchLabel:['Search in English, French, Chinese or Latin','Rechercher en anglais, français, chinois ou latin'],
entries:['entries','fiches'],genera:['genera','genres'],families:['families','familles'],orders:['orders','ordres'],found:['found','résultats'],shown:['shown','affichées'],of:['of','sur'],browseOrder:['Browse this order ↗','Explorer cet ordre ↗'],browseFamily:['Browse this family ↗','Explorer cette famille ↗'],
botanicalPortrait:['Botanical portrait','Portrait botanique'],examples:['Representative species & garden groups','Espèces et groupes horticoles représentatifs'],meaning:['A cultural association','Une association culturelle'],noMeaning:['No well-supported flower-language association is asserted for this entry. Explore its botanical portrait instead.','Cette fiche ne propose pas de sens floral suffisamment documenté. Elle met en avant le portrait botanique.'],meaningScope:['This common-name association does not apply automatically to every species, colour or cultivar in the genus.','Cette association au nom commun ne s’applique pas automatiquement à chaque espèce, couleur ou cultivar du genre.'],save:['Save this flower','Garder cette fleur'],savedFlower:['In your collection','Dans vos favoris'],copy:['Copy a note','Copier une note'],close:['Close details','Fermer la fiche'],related:['From the same family','De la même famille'],botanicalSource:['Check the botanical name ↗','Vérifier le nom botanique ↗'],meaningSource:['Meaning reference','Source du symbole'],familyPortrait:['Family traits','Caractères de la famille'],
toastSaved:['Added to your collection','Ajoutée à vos favoris'],toastRemoved:['Removed from your collection','Retirée de vos favoris'],toastSession:['Saved for this browsing session','Gardée pour cette session'],toastCopied:['Flower note copied','Note florale copiée'],toastCopyFailed:['Select and copy the text in this flower’s detail','Sélectionnez et copiez le texte de cette fiche'],
sourceGreenaway:['19th-century lexicon · Kate Greenaway','Lexique du XIXe siècle · Kate Greenaway'],sourceTftd:['Contemporary Taiwan florist usage · TFTD','Usage actuel des fleuristes de Taïwan · TFTD'],sourceHua:['Contemporary Chinese florist usage · Hua.com','Usage actuel des fleuristes chinois · Hua.com'],sourceAlmanac:['Flower symbolism · The Old Farmer’s Almanac','Symbolique florale · The Old Farmer’s Almanac']
};
let language='en', showChinese=true, saved=new Set();
try{
 language=localStorage.getItem('petal-language')==='fr'?'fr':'en';
 showChinese=localStorage.getItem('petal-chinese')!=='off';
 const previous=JSON.parse(localStorage.getItem('huajian-favorites')||'[]');
 const migrate=localStorage.getItem('petal-atlas-migrated')!=='yes';
 const remap={'lisianthus':'balloon-flower','violet':'stock','peony':'tree-peony'};
 if(Array.isArray(previous))saved=new Set(previous.map(id=>migrate?(remap[id]||id):id).filter(id=>flowers.some(f=>f.id===id)));
 if(migrate){localStorage.setItem('huajian-favorites',JSON.stringify([...saved]));localStorage.setItem('petal-atlas-migrated','yes');}
}catch{}
const t=key=>(labels[key]||[key,key])[language==='fr'?1:0];
const altLanguage=()=>language==='en'?'fr':'en';
const zh=text=>`<span class="zh-help" lang="zh-CN">${esc(text)}</span>`;
const categories=['all','love','gratitude','wishes','memory','purity','courage','history','botany'];
const sourceLabels={greenaway:'sourceGreenaway',tftd:'sourceTftd',hua:'sourceHua',almanac:'sourceAlmanac'};
let activeCategory='all', onlySaved=false, searchValue='', selectedOrder='',selectedFamily='',selectedGenus='',visibleLimit=24,currentFlower=null,toastTimer;
const grid=$('flower-grid'), dialog=$('flower-dialog');
const BLOOM_DURATION=2000,cardBlooms=new Map();
const searchIndex=new Map(flowers.map(f=>[f.id,normalize([f.id,...Object.values(f.name),f.genus,f.family,f.order,CATALOG.ordersZh[f.order],...Object.values(families[f.family].name),...Object.values(CATALOG.meanings[f.meaning].text),...Object.values(f.desc),...f.examples].join(' '))]));
function getFiltered(){const query=normalize(searchValue.trim());return flowers.filter(f=>(activeCategory==='all'||CATALOG.meanings[f.meaning].category.includes(activeCategory))&&(!onlySaved||saved.has(f.id))&&(!selectedOrder||f.order===selectedOrder)&&(!selectedFamily||f.family===selectedFamily)&&(!selectedGenus||f.genus===selectedGenus)&&searchIndex.get(f.id).includes(query));}
function statistics(){return `${flowers.length} ${t('entries')} · ${new Set(flowers.map(f=>f.genus)).size} ${t('genera')} · ${Object.keys(families).length} ${t('families')} · ${Object.keys(CATALOG.ordersZh).length} ${t('orders')}`;}
function option(value,label,current){return `<option value="${esc(value)}"${value===current?' selected':''}>${esc(label)}</option>`;}
function renderSelectors(){
 const orders=Object.keys(CATALOG.ordersZh).sort();
 $('order-select').innerHTML=option('',t('allOrders'),selectedOrder)+orders.map(o=>option(o,o+(showChinese?' · '+CATALOG.ordersZh[o]:''),selectedOrder)).join('');
 const availableFamilies=Object.keys(families).filter(f=>!selectedOrder||families[f].order===selectedOrder).sort();
 $('family-select').innerHTML=option('',t('allFamilies'),selectedFamily)+availableFamilies.map(f=>option(f,`${f} · ${families[f].name[language]}${showChinese?' / '+families[f].name.zh:''}`,selectedFamily)).join('');
 const genera=[...new Set(flowers.filter(f=>(!selectedOrder||f.order===selectedOrder)&&(!selectedFamily||f.family===selectedFamily)).map(f=>f.genus))].sort();
 $('genus-select').innerHTML=option('',t('allGenera'),selectedGenus)+genera.map(g=>option(g,g,selectedGenus)).join('');
 const context=$('taxonomy-context');context.hidden=!selectedFamily;
 if(selectedFamily){const family=families[selectedFamily];context.innerHTML=`<b>${esc(selectedFamily)} · ${esc(family.name[language])}</b><p>${esc(family.note[language])}</p>${zh(family.name.zh+'：'+family.note.zh)}`;}
}
function card(f){const m=CATALOG.meanings[f.meaning];return `<article class="flower-card"><div class="card-top"><span>${esc(f.family)}</span><button class="favorite-button${saved.has(f.id)?' saved':''}" data-save="${esc(f.id)}" aria-label="${esc((saved.has(f.id)?t('savedFlower'):t('save'))+' · '+f.name[language])}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'♥':'♡'}</button></div><button class="card-open" data-open="${esc(f.id)}"><div class="flower-illustration" aria-hidden="true">${flowerDrawing(f.type)}</div><div class="card-title"><h3>${esc(f.name[language])}</h3><span aria-hidden="true">↗</span></div><p class="alternate-name" lang="${altLanguage()}">${esc(f.name[altLanguage()])}</p>${zh(f.name.zh)}<p class="latin-name">${esc(f.genus)}</p><p class="card-meaning">${esc(m.text[language])}</p>${zh(m.text.zh)}</button></article>`;}
function render(){
 stopCardBlooms();
 renderSelectors();const list=getFiltered(), shown=list.slice(0,visibleLimit);
 $('favorite-count').textContent=saved.size;
 $('collection-view').setAttribute('aria-pressed',String(onlySaved));
 $('filters').innerHTML=categories.map(c=>`<button class="filter-button${activeCategory===c?' active':''}" data-category="${c}" aria-pressed="${activeCategory===c}">${esc(t(c))}</button>`).join('');
 $('results-count').textContent=`${list.length} ${t('found')}`;
 grid.innerHTML=shown.map(card).join('');grid.hidden=!list.length;$('empty').hidden=!!list.length;
 $('load-row').hidden=!list.length;
 $('shown-count').textContent=`${shown.length} ${t('of')} ${list.length} ${t('shown')}`;
 $('load-more').hidden=shown.length>=list.length;
}
function renderTaxonomy(){
 $('taxonomy-stats').textContent=`${Object.keys(CATALOG.ordersZh).length} ${t('orders')} · ${Object.keys(families).length} ${t('families')}`;
 $('taxonomy-tree').innerHTML=Object.keys(CATALOG.ordersZh).sort().map(order=>{
  const familyNames=Object.keys(families).filter(f=>families[f].order===order).sort();
  return `<details class="order-branch"><summary><span><b>${esc(order)}</b>${zh(CATALOG.ordersZh[order])}</span><small>${familyNames.length} ${t('families')} <span class="branch-plus">＋</span></small></summary><div class="order-content"><button class="branch-link" data-order="${order}">${esc(t('browseOrder'))}</button>${familyNames.map(key=>{
   const family=families[key],members=flowers.filter(f=>f.family===key),genera=[...new Set(members.map(f=>f.genus))].sort();
   return `<details class="family-branch"><summary><span><b>${esc(key)}</b> <span>${esc(family.name[language])}</span>${zh(family.name.zh)}</span><small>${genera.length} ${t('genera')} <span class="branch-plus">＋</span></small></summary><div class="family-content"><p>${esc(family.note[language])}</p>${zh(family.note.zh)}<button class="branch-link" data-family="${key}">${esc(t('browseFamily'))}</button><div class="genus-list">${genera.map(g=>{
    const sample=members.find(f=>f.genus===g);return `<button class="genus-link" data-genus="${esc(g)}"><i>${esc(g)}</i><span>${esc(members.filter(f=>f.genus===g).map(f=>f.name[language]).join(' / '))}</span>${zh(members.filter(f=>f.genus===g).map(f=>f.name.zh).join(' / '))}<small class="genus-note">${esc(sample.desc[language])}</small></button>`;
   }).join('')}</div></div></details>`;
  }).join('')}</div></details>`;
 }).join('');
}
function applyLanguage(){
 document.documentElement.lang=language;document.title='Petal & Verse · '+(language==='fr'?'Un atlas floral':'A floral atlas');
 document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=esc(t(el.dataset.i18n)).replace(/\n/g,'<br>');});
 document.body.classList.toggle('no-chinese',!showChinese);
 $('lang-en').setAttribute('aria-pressed',String(language==='en'));$('lang-fr').setAttribute('aria-pressed',String(language==='fr'));$('zh-toggle').checked=showChinese;
 $('hero-alt').textContent=language==='en'?'Chaque fleur, une histoire.':'Every bloom, a quiet story.';$('hero-alt').lang=altLanguage();
 $('search').placeholder=t('searchPlaceholder');$('search').setAttribute('aria-label',t('searchLabel'));
 $('order-select').setAttribute('aria-label',t('order'));$('family-select').setAttribute('aria-label',t('family'));$('genus-select').setAttribute('aria-label',t('genus'));
 $('close-dialog').setAttribute('aria-label',t('close'));$('atlas-stats').textContent=statistics();
 const sunflower=flowers.find(f=>f.id==='sunflower');$('daily-name').textContent=sunflower.name[language];$('daily-meaning').innerHTML=esc(CATALOG.meanings[sunflower.meaning].text[language])+zh(sunflower.name.zh+' · '+CATALOG.meanings[sunflower.meaning].text.zh);
 render();renderTaxonomy();if(currentFlower&&dialog.open)updateDetail();
 try{localStorage.setItem('petal-language',language);localStorage.setItem('petal-chinese',showChinese?'on':'off');}catch{}
}
function reset(){activeCategory='all';onlySaved=false;searchValue='';selectedOrder='';selectedFamily='';selectedGenus='';visibleLimit=24;$('search').value='';render();}
function chooseBranch(rank,value){
 reset();
 if(rank==='order')selectedOrder=value;
 if(rank==='family'){selectedFamily=value;selectedOrder=families[value].order;}
 if(rank==='genus'){const f=flowers.find(f=>f.genus===value);if(!f)return;selectedGenus=value;selectedFamily=f.family;selectedOrder=f.order;}
 if(dialog.open)dialog.close();render();$('collection').scrollIntoView({behavior:'smooth',block:'start'});
}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
function toggleSave(id){
 if(!flowers.some(f=>f.id===id))return;saved.has(id)?saved.delete(id):saved.add(id);let persisted=true;
 try{localStorage.setItem('huajian-favorites',JSON.stringify([...saved]));}catch{persisted=false;}
 const active=document.activeElement,wasSave=active?.matches?.('[data-save]'),wasDetail=wasSave&&dialog.contains(active);render();
 if(currentFlower?.id===id&&dialog.open)updateDetail();
 if(wasSave)(wasDetail?dialog:grid).querySelector(`[data-save="${id}"]`)?.focus();
 toast(saved.has(id)?(persisted?t('toastSaved'):t('toastSession')):t('toastRemoved'));
}
function updateDetail(){
 stopBloom();
 const f=currentFlower;if(!f)return;const family=families[f.family],meaning=CATALOG.meanings[f.meaning],source=CATALOG.sources[meaning.source];
 const ranks=[['order',f.order,CATALOG.ordersZh[f.order]],['family',f.family,family.name.zh],['genus',f.genus,f.name.zh]];
 const related=flowers.filter(other=>other.family===f.family&&other.id!==f.id).slice(0,5);
 $('detail-content').innerHTML=`<div class="detail-layout"><div class="detail-art" aria-hidden="true">${flowerDrawing(f.type)}<p>ILLUSTRATION / À L’ENCRE</p></div><div class="detail-text"><p class="eyebrow">PETAL &amp; VERSE / ${esc(f.order)}</p><h2 id="detail-title">${esc(f.name[language])}</h2><p class="alternate-name" lang="${altLanguage()}">${esc(f.name[altLanguage()])}</p>${zh(f.name.zh)}<dl class="classification">${ranks.map(([rank,value,chinese])=>`<div><dt>${esc(t(rank))}</dt><dd><button data-${rank}="${esc(value)}">${rank==='genus'?'<i>':''}${esc(value)}${rank==='genus'?'</i>':''} ↗</button>${zh(chinese)}</dd></div>`).join('')}</dl><h3 class="detail-subtitle">${esc(t('botanicalPortrait'))}</h3><p class="detail-desc">${esc(f.desc[language])}</p>${zh(f.desc.zh)}<h3 class="detail-subtitle">${esc(t('examples'))}</h3><ul class="species-list">${f.examples.map(s=>`<li><i>${esc(s)}</i></li>`).join('')}</ul>${zh('所列为代表种或园艺类型，不是该属全部物种。')}<h3 class="detail-subtitle">${esc(t('familyPortrait'))} · ${esc(f.family)}</h3><p class="detail-desc">${esc(family.note[language])}</p>${zh(family.note.zh)}<a class="source-link" href="${esc(f.botanicalSource)}" target="_blank" rel="noopener">${esc(t('botanicalSource'))}</a><h3 class="detail-subtitle">${esc(t('meaning'))}</h3><p class="detail-meaning">${esc(meaning.text[language])}</p>${zh(meaning.text.zh)}${source?`<a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener">${esc(t('meaningSource'))}: ${esc(t(sourceLabels[meaning.source]))} ↗</a><p class="detail-note">${esc(t('meaningScope'))}</p>${zh('花语为俗名层面的文化说法，不自动适用于该属的每个种、颜色或品种。')}`:`<p class="detail-note">${esc(t('noMeaning'))}</p>${zh('此条不附会未经可靠出处支持的花语。')}`}<div class="detail-actions"><button class="primary-button" data-save="${esc(f.id)}" aria-pressed="${saved.has(f.id)}">${saved.has(f.id)?'♥':'♡'} ${esc(saved.has(f.id)?t('savedFlower'):t('save'))}</button><button class="secondary-button" id="copy-note">${esc(t('copy'))}</button></div>${related.length?`<h3 class="detail-subtitle">${esc(t('related'))}</h3><div class="related-list">${related.map(r=>`<button data-open="${r.id}">${esc(r.name[language])} ↗</button>`).join('')}</div>`:''}</div></div>`;
}
let bloomFrame=null,bloomFlight=null,bloomAnimation=null,bloomTarget=null,bloomSource=null,bloomSVG=null,bloomType=null;
function bloomPhase(timeline){
 return timeline<.14?1-budEase(timeline/.14):budEase(Math.min(1,(timeline-.14)/.75));
}
function stopCardBloom(cardNode){
 const state=cardBlooms.get(cardNode);if(!state)return;
 if(state.frame!==null)cancelAnimationFrame(state.frame);
 state.layer.remove();state.original.style.opacity='';cardNode.classList.remove('is-hover-bloom');cardBlooms.delete(cardNode);
}
function stopCardBlooms(){for(const cardNode of cardBlooms.keys())stopCardBloom(cardNode);}
function startCardBloom(cardNode){
 if(!cardNode||dialog.open||cardBlooms.has(cardNode)||typeof requestAnimationFrame!=='function')return;
 if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const button=cardNode.querySelector('.card-open'),f=flowers.find(f=>f.id===button?.dataset.open);
 const illustration=cardNode.querySelector('.flower-illustration'),original=illustration?.querySelector('svg');
 if(!f||!original)return;
 const layer=document.createElement('span');layer.className='hover-bloom-layer';layer.setAttribute('aria-hidden','true');layer.innerHTML=buddingDrawing(f.type,1);layer.style.opacity='0';illustration.appendChild(layer);
 const svg=layer.querySelector('svg'),state={layer,svg,original,type:f.type,frame:null,timeline:0};
 cardBlooms.set(cardNode,state);cardNode.classList.add('is-hover-bloom');let started=null;
 const frame=timestamp=>{
  state.frame=null;if(!cardBlooms.has(cardNode))return;
  if(started===null)started=timestamp;
  state.timeline=Math.min(1,(timestamp-started)/BLOOM_DURATION);
  paintBudding(svg,state.type,bloomPhase(state.timeline));
  const coverOpacity=Math.max(0,Math.min(1,1-state.timeline/.08),Math.min(1,(state.timeline-.89)/.11));
  original.style.opacity=String(coverOpacity);layer.style.opacity=String(1-coverOpacity);
  if(state.timeline<1)state.frame=requestAnimationFrame(frame);else stopCardBloom(cardNode);
 };
 state.frame=requestAnimationFrame(frame);
}
function stopBloom(){
 if(bloomFrame!==null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(bloomFrame);bloomFrame=null;
 if(bloomSVG)paintBudding(bloomSVG,bloomType,1);bloomSVG=null;bloomType=null;
 bloomAnimation?.cancel();bloomAnimation=null;
 bloomFlight?.remove();bloomFlight=null;
 if(bloomTarget){bloomTarget.style.visibility='';bloomTarget.style.opacity='';}bloomTarget=null;
 bloomSource?.classList.remove('is-bloom-source');bloomSource=null;
 dialog.classList.remove('is-opening');
}
function inkRect(svg){
 const rect=svg.getBoundingClientRect(),scale=Math.min(rect.width/135,rect.height/190);
 return {left:rect.left+(rect.width-135*scale)/2,top:rect.top+(rect.height-190*scale)/2,width:135*scale,height:190*scale};
}
function animateBloom(sourceRect,sourceCard,startAt=0){
 if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 if(typeof requestAnimationFrame!=='function')return;
 const target=dialog.querySelector('.detail-art svg');if(!target)return;
 dialog.classList.add('is-opening');
 const destination=inkRect(target);
 if(destination.width>0){
  bloomTarget=target;target.style.visibility='hidden';bloomSource=sourceCard;sourceCard?.classList.add('is-bloom-source');
  bloomFlight=document.createElement('div');bloomFlight.className='bloom-flight';bloomFlight.setAttribute('aria-hidden','true');
  Object.assign(bloomFlight.style,{left:destination.left+'px',top:destination.top+'px',width:destination.width+'px',height:destination.height+'px'});
  bloomFlight.innerHTML=buddingDrawing(currentFlower.type,bloomPhase(startAt));dialog.appendChild(bloomFlight);
  if(sourceRect&&sourceRect.width>0&&typeof bloomFlight.animate==='function'){
   const dx=sourceRect.left-destination.left,dy=sourceRect.top-destination.top,scale=sourceRect.width/destination.width;
   bloomAnimation=bloomFlight.animate([
   {transform:`translate(${dx}px,${dy}px) scale(${scale})`,offset:0},
   {transform:`translate(${dx*.34}px,${dy*.34}px) scale(${scale+(1-scale)*.68})`,offset:.48},
   {transform:'translate(0,0) scale(1)',offset:1}
   ],{duration:Math.min(520,BLOOM_DURATION*(1-startAt)),easing:'cubic-bezier(.22,.75,.2,1)',fill:'forwards'});
  }
 }
 if(!bloomFlight){stopBloom();return;}
 bloomSVG=bloomFlight.querySelector('svg');bloomType=currentFlower.type;
 paintBudding(bloomSVG,bloomType,bloomPhase(startAt));
 let started=null;
 const frame=timestamp=>{
  bloomFrame=null;if(!bloomSVG||!dialog.open)return;
  if(started===null)started=timestamp;
  const progress=Math.min(1,startAt+(timestamp-started)/BLOOM_DURATION);
  paintBudding(bloomSVG,bloomType,bloomPhase(progress));
  const reveal=Math.max(0,Math.min(1,(progress-.89)/.11));
  bloomTarget.style.visibility=reveal>0?'':'hidden';bloomTarget.style.opacity=String(reveal);bloomFlight.style.opacity=String(1-reveal);
  if(progress<1)bloomFrame=requestAnimationFrame(frame);else stopBloom();
 };
 bloomFrame=requestAnimationFrame(frame);
}
function openFlower(id,trigger=null){
 const f=flowers.find(f=>f.id===id);if(!f)return;
 const source=trigger?.querySelector('.flower-illustration svg')||trigger?.querySelector('svg');
 const sourceRect=source?inkRect(source):null,sourceCard=trigger?.closest('.flower-card');
 const startAt=cardBlooms.get(sourceCard)?.timeline||0;stopCardBlooms();
 currentFlower=f;updateDetail();if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
 $('close-dialog').focus({preventScroll:true});animateBloom(sourceRect,sourceCard,startAt);
}
async function copyNote(){
 if(!currentFlower)return;const f=currentFlower,m=CATALOG.meanings[f.meaning],source=CATALOG.sources[m.source];
 const note=`${f.name.en} / ${f.name.fr}${showChinese?' / '+f.name.zh:''}\n${f.order} → ${f.family} → ${f.genus}\n${f.desc[language]}${showChinese?'\n'+f.desc.zh:''}\n${m.text[language]}${showChinese?' / '+m.text.zh:''}\n${source?t(sourceLabels[m.source])+'\n'+source.url:t('noMeaning')}\n${f.botanicalSource}\nPetal & Verse`;
 try{await navigator.clipboard.writeText(note);toast(t('toastCopied'));}catch{toast(t('toastCopyFailed'));}
}
document.addEventListener('click',event=>{
 const target=event.target.closest('button');if(!target)return;
 if(target.dataset.save){toggleSave(target.dataset.save);return;}
 if(target.dataset.open){openFlower(target.dataset.open,target);return;}
 if(target.dataset.category){activeCategory=target.dataset.category;visibleLimit=24;render();return;}
 for(const rank of ['order','family','genus'])if(target.dataset[rank]){chooseBranch(rank,target.dataset[rank]);return;}
 if(target.id==='copy-note')copyNote();
});
grid.addEventListener('pointerover',event=>{
 if(event.pointerType==='touch')return;
 const cardNode=event.target.closest('.flower-card');if(!cardNode||cardNode.contains(event.relatedTarget))return;
 startCardBloom(cardNode);
});
grid.addEventListener('pointerout',event=>{
 const cardNode=event.target.closest('.flower-card');if(cardNode&&!cardNode.contains(event.relatedTarget))stopCardBloom(cardNode);
});
grid.addEventListener('focusin',event=>{if(event.target.matches('.card-open'))startCardBloom(event.target.closest('.flower-card'));});
grid.addEventListener('focusout',event=>{const cardNode=event.target.closest('.flower-card');if(cardNode&&!cardNode.contains(event.relatedTarget))stopCardBloom(cardNode);});
$('search').addEventListener('input',event=>{searchValue=event.target.value;visibleLimit=24;render();});
$('order-select').addEventListener('change',event=>{selectedOrder=event.target.value;selectedFamily='';selectedGenus='';visibleLimit=24;render();});
$('family-select').addEventListener('change',event=>{selectedFamily=event.target.value;selectedGenus='';if(selectedFamily)selectedOrder=families[selectedFamily].order;visibleLimit=24;render();});
$('genus-select').addEventListener('change',event=>{selectedGenus=event.target.value;if(selectedGenus){const f=flowers.find(f=>f.genus===selectedGenus);selectedFamily=f.family;selectedOrder=f.order;}visibleLimit=24;render();});
$('collection-view').addEventListener('click',()=>{onlySaved=!onlySaved;visibleLimit=24;render();});
$('favorites-nav').addEventListener('click',()=>{reset();onlySaved=true;render();$('collection').scrollIntoView({behavior:'smooth'});});
$('reset-filters').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
$('load-more').addEventListener('click',()=>{const start=visibleLimit;visibleLimit+=24;render();grid.querySelectorAll('.card-open')[start]?.focus({preventScroll:true});});
$('random-flower').addEventListener('click',()=>openFlower(flowers[Math.floor(Math.random()*flowers.length)].id));
$('lang-en').addEventListener('click',()=>{language='en';applyLanguage();});$('lang-fr').addEventListener('click',()=>{language='fr';applyLanguage();});$('zh-toggle').addEventListener('change',event=>{showChinese=event.target.checked;applyLanguage();});
$('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{stopBloom();document.body.style.overflow='';});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!dialog.open&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){event.preventDefault();$('search').focus();}});
applyLanguage();
