from pathlib import Path
import argparse
import re

root=Path(__file__).resolve().parent
dist=root/'dist'
html=(dist/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+(dist/'style.css').read_text()+'\n</style>')
html=html.replace('<link rel="stylesheet" href="bloom-motion.css">','<style>\n'+(dist/'bloom-motion.css').read_text()+'\n</style>')
html=re.sub(r'<script defer src="(?:catalog|drawings|buds|app)\.js"></script>','',html)
script='\n'.join((dist/name).read_text() for name in ['catalog.js','drawings.js','buds.js','app.js'])
assert '</script' not in script.lower()
html=html.replace('</body>','<script>\n'+script+'\n</script>\n</body>')
parser=argparse.ArgumentParser(description='Bundle the floral atlas into a standalone HTML file.')
parser.add_argument('--output',type=Path,default=root.parent/'outputs'/'花间辞.html')
output=parser.parse_args().output
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(html)
assert 'src="app.js"' not in html and 'href="style.css"' not in html
print(str(output),output.stat().st_size,'bytes')
