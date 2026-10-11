# Petal & Verse

A monochrome floral atlas inspired by a secret garden: botanical line drawings, English and French reading modes, and optional Chinese notes.

## Explore

- 188 curated flower entries, representing 185 genera, 73 families and 32 botanical orders.
- Search common names, meanings and Latin names in English, French and Chinese.
- Browse botanical orders → families → genera, with representative species and identification notes.
- Read source-linked cultural associations separately from botanical descriptions.
- Save favourites locally in your browser.
- Keep open flowers on the cards; hover or click for a two-second petal unfolding animation. Reduced-motion preferences are respected.

This is a selected collection of common ornamental, cut and indoor flowers, not a complete world flora. Line drawings are decorative illustrations.

## Run locally

Python 3 is sufficient; there are no application dependencies or installation steps.

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Visit `http://127.0.0.1:8080`. Stop the server with Control+C in its terminal.

## Project files

```text
dist/                    Website HTML, styles, scripts and compiled catalogue
docs/index.html          Standalone HTML, ready for static hosting
catalog-flowers.tsv      Flower names, representative species and trilingual notes
catalog-families.tsv     Order/family relationships and trilingual family traits
catalog-meanings.tsv     Cultural meanings, categories and reference keys
build-catalog.py         Validate and regenerate dist/catalog.js
build-standalone.py      Bundle the website into one HTML file
tests/                   Data and interaction-logic checks
```

## Update the catalogue

The catalogue files are UTF-8, with `|` as the field separator. Regenerate the JavaScript data and standalone page after editing them:

```sh
python3 build-catalog.py
python3 build-standalone.py --output docs/index.html
```

Run the existing data and interaction checks with Node.js:

```sh
npm test
```

The checks cover multilingual search, taxonomy consistency, favourites, pagination, petal morphing and interrupted animation cleanup. Browser visual verification remains a separate check.

## GitHub Pages

The complete site is static. To serve the standalone version, configure GitHub Pages to deploy from the default branch's `/docs` folder. No API keys, server or paid services are needed for this app.

## Français

Un atlas floral en noir et blanc : 188 fiches, des parentés botaniques, des références culturelles et des notes chinoises facultatives. Survolez ou cliquez sur une fleur pour découvrir son animation d’éclosion. Les favoris restent dans votre navigateur.

## 中文说明

这是黑白线描花卉图鉴，正文以英语／法语为主，中文辅助可关闭。收藏保存在当前浏览器中。GitHub 仓库用于保存源码；启用 GitHub Pages 后才会获得网站访问地址。
