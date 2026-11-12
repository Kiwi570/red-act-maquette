#!/usr/bin/env node
/* Esquisses des directions : le haut de l'accueil de chaque direction, en image, AVANT que l'utilisateur choisisse.
   Pourquoi (11 novembre 2026) : sur les Jardins de l'Hacienda, la direction « Les persiennes » a été choisie en 40 secondes
   sur un texte (« persiennes bleues à lames orientables »). Construites, les persiennes étaient des rectangles bleus plats
   posés sur une photo de chaise : un jouet. Sur une image, l'utilisateur l'aurait vu tout de suite.

   Claude écrit, pour chaque direction, une page HTML autonome qui montre seulement le premier écran de l'accueil, au rendu
   final : vraies polices, vraie palette, vraies photos du client (ou l'image Grok prévue, ou un visuel dessiné au même
   niveau de finition), et l'objet signature dessiné tel qu'il sera construit, à l'arrêt. Pas d'animation, pas de menu
   fonctionnel. Les chemins d'images partent de la racine du projet (/recu/…, /assets/…).

   node _audit/esquisses.mjs [--dossier _suivi/esquisses]
     Lit chaque <direction>.html du dossier, le photographie en 1440×900 et en 390×844 (téléphone), et écrit
     <direction>-ordinateur.jpg, <direction>-telephone.jpg et planche.jpg (toutes les directions côte à côte).
     intention.mjs les intègre seul à la planche d'intention (nom du fichier = nom de la direction en minuscules, sans
     accents, mots séparés par des tirets ; ou champ « esquisse » de la direction).
   Une image introuvable ou une erreur de la page est signalée : une esquisse avec un cadre vide ne dit rien. */
import { createRequire } from 'node:module';
import { readdirSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demarrerServeur } from './serveur.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ici = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const racine = resolve(opt('racine', join(ici, '..')));
const dossier = resolve(racine, opt('dossier', '_suivi/esquisses'));
if (!existsSync(dossier)) { console.error(`dossier introuvable : ${dossier} (une page <direction>.html par direction)`); process.exit(1); }
const pages = readdirSync(dossier).filter((f) => f.endsWith('.html')).sort();
if (!pages.length) { console.error(`aucune esquisse dans ${dossier} : une page <direction>.html par direction`); process.exit(1); }
mkdirSync(dossier, { recursive: true });

/* Le serveur de l'audit ne sert pas ce que .vercelignore exclut (_suivi) : ici, un serveur sans exclusion. */
const serveur = await demarrerServeur(racine, { sansExclusions: true });
const nav = await chromium.launch();
const resultats = [];
let problemes = 0;
try {
  for (const f of pages) {
    const nom = basename(f, '.html');
    const rel = '/' + join(dossier, f).slice(racine.length + 1).split('\\').join('/');
    const r = { nom, fichiers: [], soucis: [] };
    for (const [quoi, w, h, tactile] of [['ordinateur', 1440, 900, false], ['telephone', 390, 844, true]]) {
      const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: tactile, hasTouch: tactile, locale: 'fr-FR' });
      const page = await ctx.newPage();
      page.on('pageerror', (e) => r.soucis.push(`${quoi} : erreur ${String(e).split('\n')[0]}`));
      page.on('response', (x) => { if (x.status() >= 400) r.soucis.push(`${quoi} : ${x.status()} ${new URL(x.url()).pathname}`); });
      await page.goto(serveur.adresse + rel, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(900);
      const vides = await page.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.getAttribute('src')));
      for (const v of vides) r.soucis.push(`${quoi} : image non chargée ${v}`);
      const sortie = join(dossier, `${nom}-${quoi}.jpg`);
      await page.screenshot({ path: sortie, type: 'jpeg', quality: 84 });
      r.fichiers.push(sortie);
      await ctx.close();
    }
    r.soucis = [...new Set(r.soucis)];
    problemes += r.soucis.length;
    resultats.push(r);
  }
  /* Planche : une ligne par direction, ordinateur et téléphone côte à côte. */
  const img = (f) => `data:image/jpeg;base64,${readFileSync(f).toString('base64')}`;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:28px;background:#1b1b1b;color:#eee;font:15px/1.4 system-ui,sans-serif;width:1424px}
    section{margin-bottom:28px} h2{font-size:18px;margin:0 0 10px;color:#fff} .r{display:flex;gap:16px;align-items:flex-start}
    .o{width:1120px;border-radius:6px;display:block} .t{width:288px;border-radius:6px;display:block}</style>
    ${resultats.map((r) => `<section><h2>${r.nom.replace(/-/g, ' ')}</h2><div class="r"><img class="o" src="${img(r.fichiers[0])}"><img class="t" src="${img(r.fichiers[1])}"></div></section>`).join('')}`;
  const ctx = await nav.newContext({ viewport: { width: 1480, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.screenshot({ path: join(dossier, 'planche.jpg'), type: 'jpeg', quality: 80, fullPage: true });
  await ctx.close();
} finally {
  await nav.close();
  serveur.fermer && serveur.fermer();
}
console.log(`Esquisses : ${dossier}`);
for (const r of resultats) console.log(`  ${r.nom} : ${r.fichiers.map((f) => basename(f)).join(', ')}${r.soucis.length ? `\n    A REGARDER : ${r.soucis.join(' ; ')}` : ''}`);
console.log(`  planche.jpg (toutes les directions)`);
console.log('  Avant de les montrer : chaque esquisse est-elle au niveau de la vitrine, et faite avec ce qui existe vraiment chez le client ?');
process.exit(problemes ? 3 : 0);
