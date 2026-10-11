import json
from pathlib import Path

p=Path(__file__).resolve().parent
family={}
for row in (p/'catalog-families.tsv').read_text().splitlines():
    key,order,en,fr,zh,nen,nfr,nzh=row.split('|')
    family[key]={'order':order,'name':{'en':en,'fr':fr,'zh':zh},'note':{'en':nen,'fr':nfr,'zh':nzh}}
meanings={}
for row in (p/'catalog-meanings.tsv').read_text().splitlines():
    key,en,fr,zh,category,source=row.split('|')
    meanings[key]={'text':{'en':en,'fr':fr,'zh':zh},'category':category.split(','),'source':source}
flowers=[]
for row in (p/'catalog-flowers.tsv').read_text().splitlines():
    ident,en,fr,zh,genus,fam,examples,type_,meaning,den,dfr,dzh=row.split('|')
    if ident=='gardenia':meaning='gardenia-joy'
    if ident=='bluebell':meaning='bluebell-constancy'
    if ident=='lotus':meaning='lotus-purity'
    assert meaning in meanings,(ident,meaning)
    assert fam in family,(ident,fam)
    flowers.append({'id':ident,'name':{'en':en,'fr':fr,'zh':zh},'genus':genus,'family':fam,'order':family[fam]['order'],'examples':examples.split('; '),'type':type_,'meaning':meaning,'desc':{'en':den,'fr':dfr,'zh':dzh}})
orders_zh={'Rosales':'蔷薇目','Liliales':'百合目','Asparagales':'天门冬目','Asterales':'菊目','Caryophyllales':'石竹目','Lamiales':'唇形目','Ericales':'杜鹃花目','Gentianales':'龙胆目','Ranunculales':'毛茛目','Saxifragales':'虎耳草目','Brassicales':'十字花目','Malvales':'锦葵目','Cornales':'山茱萸目','Fabales':'豆目','Myrtales':'桃金娘目','Malpighiales':'金虎尾目','Boraginales':'紫草目','Alismatales':'泽泻目','Magnoliales':'木兰目','Laurales':'樟目','Proteales':'山龙眼目','Nymphaeales':'睡莲目','Zingiberales':'姜目','Apiales':'伞形目','Dipsacales':'川续断目','Geraniales':'牻牛儿苗目','Solanales':'茄目','Sapindales':'无患子目','Oxalidales':'酢浆草目','Commelinales':'鸭跖草目','Poales':'禾本目','Cucurbitales':'葫芦目'}
assert set(f['order'] for f in flowers)==set(orders_zh)
assert len(set(f['id'] for f in flowers))==len(flowers)
sources={
 'greenaway':{'title':'Language of Flowers · historical lexicon (1884)','url':'https://www.gutenberg.org/files/31591/31591-h/31591-h.htm'},
 'tftd':{'title':'TFTD · contemporary Taiwan florist usage','url':'https://www.flower.org.tw/m/405-1276-39041,c8757.php'},
 'hua':{'title':'Hua.com · contemporary Chinese florist usage','url':'https://m.hua.com/huayu/10810.html'},
 'almanac':{'title':'The Old Farmer’s Almanac · flower symbolism','url':'https://www.almanac.com/flower-meanings-language-flowers'}
}
exceptions={
 'eustoma':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:330227-2',
 'balloon-flower':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:5791-1',
 'stock':'https://www.rhs.org.uk/plants/48284/matthiola-incana/details',
 'daylily':'https://www.rhs.org.uk/plants/8589/hemerocallis/details',
 'lily-valley':'https://www.rhs.org.uk/plants/30579/convallaria/details',
 'bleeding-heart':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:31686-1',
 'bottlebrush':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77108602-1',
 'flowering-maple':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77146519-1',
 'streptocarpus':'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:77117375-1'
}
for f in flowers:f['botanicalSource']=exceptions.get(f['id'],'https://powo.science.kew.org/results?q='+f['genus'])
# Keep the familiar opening collection, then offer the expanded atlas.
opening=['rose','tulip','sunflower','lily','carnation','gypsophila','lavender','eustoma','balloon-flower','freesia','lily-valley','camellia','stock','violet','cosmos','peony','orchid','calla','hyacinth','gerbera','forget-me-not','hydrangea','iris','lotus']
flowers.sort(key=lambda f:(opening.index(f['id']) if f['id'] in opening else len(opening),))
bundle={'flowers':flowers,'families':family,'ordersZh':orders_zh,'meanings':meanings,'sources':sources}
(p/'dist/catalog.js').write_text('const CATALOG = '+json.dumps(bundle,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(flowers),'entries;',len(set(f['genus'] for f in flowers)),'genera;',len(family),'families;',len(orders_zh),'orders.')
