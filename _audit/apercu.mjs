#!/usr/bin/env node
/* Aperçu de l'accueil : ce que l'utilisateur verra vraiment en ligne, en mouvement.
   Une capture ne montre ni l'intro, ni le voile, ni une scène qui se construit au défilement : un aperçu en captures
   était validé, puis jugé « trop sage » une fois en ligne (Agence AE, lydiacourtois : une v2 entière chacun).
   Ce script filme la page comme un visiteur qui arrive et la parcourt, sur ordinateur et sur téléphone, et fait une
   planche de captures, avec en tête la vitrine du projet (ou le palmarès des ouvertures de la bibliothèque).

   node _audit/apercu.mjs [--page /] [--vitrine _suivi/vitrine.jpg] [--duree 24]
     --page      page filmée (l'accueil par défaut)
     --vitrine   vitrine du projet (node _biblio/outils/vitrine.mjs), mise en tête de la planche : à dépasser, pas à imiter.
                 Elle remplace le palmarès des ouvertures, qui montrait les six mêmes débuts de site à chaque projet.
     --palmares  ancienne option, encore lue : une planche quelconque mise en tête (la barre à dépasser)
     --duree     durée visée du défilement, en secondes (20 par défaut ; l'intro et les pauses s'ajoutent : 30 à 40 s en tout)
     --racine    racine du site (par défaut le dossier parent de _audit)
     --sortie    dossier de sortie (par défaut _audit/apercu)
   Résultat : accueil-ordinateur.mp4 (1440×900), accueil-telephone.mp4 (390×844, tactile), planche.jpg,
   images-ordinateur.jpg et images-telephone.jpg (32 images réparties sur tout le film, une toutes les 1,5 s au plus, pour le regard du directeur artistique),
   vides.json (écrans presque vides et hauteur de l'accueil en écrans).
   Écrans vides (11 novembre 2026) : sur les Jardins de l'Hacienda, une nappe vide puis un grand aplat brun (v5), une petite
   arche sur un aplat beige (v2), 14 écrans d'accueil pour 8 à 10 prévus. Personne ne l'avait mesuré. Une seconde passe, sans
   film, défile par demi-écran et mesure la part de chaque écran sans rien à voir (aplats, cadres vides) : au-delà de 70 %,
   l'écran est « presque vide », montré sur la planche avec sa position dans la page.
   Les films commencent à l'arrivée sur le site : l'intro y est jouée comme pour un vrai visiteur. Ils finissent par un
   passage de page par le menu (le voile, puis l'arrivée sur la page suivante), capturé sur la planche. */
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync, readdirSync, renameSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { demarrerServeur } from './serveur.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
/* sharp pour mesurer les écrans vides : celui de la machine, sinon celui que _biblio/preparer.mjs a relié ; sans lui, pas de mesure. */
let sharp = null;
for (const m of ['sharp', join(dirname(fileURLToPath(import.meta.url)), '..', '_biblio', 'node_modules', 'sharp')]) { try { sharp = require(m); break; } catch {} }
const ici = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : argv[i + 1]; };
const page0 = opt('page', '/');
const vitrine = opt('vitrine', '');
const palmares = vitrine || opt('palmares', '');
const titreTete = vitrine ? 'Vitrine de ce projet (le niveau à dépasser, jamais l’idée ni la mise en page à reprendre)' : 'Palmarès des ouvertures de la bibliothèque : la barre à dépasser';
const duree = Math.max(8, parseFloat(opt('duree', '20')) || 20);
const SEUIL_VIDE = 0.7;
const racine = resolve(opt('racine', join(ici, '..')));
const sortie = resolve(opt('sortie', join(ici, 'apercu')));
rmSync(sortie, { recursive: true, force: true });
mkdirSync(join(sortie, 'brut'), { recursive: true });
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

const serveur = await demarrerServeur(racine);
const nav = await chromium.launch();
const captures = [];

async function pret(page) {
  try { await page.waitForFunction(() => document.documentElement.classList.contains('pret') || (window.__socle && window.__socle.pret), null, { timeout: 12000 }); }
  catch { await attendre(3000); }
}

async function filmer({ nom, w, h, tactile }) {
  const dossier = join(sortie, 'brut', nom);
  mkdirSync(dossier, { recursive: true });
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: tactile, hasTouch: tactile, locale: 'fr-FR', recordVideo: { dir: dossier, size: { width: w, height: h } } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(String(e).split('\n')[0]));
  const t0 = Date.now();
  await page.goto(serveur.adresse + page0, { waitUntil: 'load' });
  await pret(page);
  const intro = (Date.now() - t0) / 1000;
  await attendre(1400);
  const prendre = async (etiquette) => { const f = join(sortie, `${nom}-${captures.length}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 82 }); captures.push({ f, etiquette: `${nom === 'ordinateur' ? 'Ordinateur 1440×900' : 'Téléphone 390×844'} · ${etiquette}`, nom }); };
  await prendre('arrivée');
  /* Défilement régulier jusqu'en bas, comme un visiteur qui lit vite : molette sur ordinateur, glissé sur téléphone.
     Les sections épinglées consomment du défilement : elles se jouent pendant le film. */
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const pas = tactile ? 48 : 90;
  const n = Math.max(1, Math.ceil(total / pas));
  const delai = Math.min(160, Math.max(25, (duree * 1000) / n));
  const reperes = tactile ? [0.3, 0.6] : [0.25, 0.5, 0.75];
  let k = 0;
  for (let i = 0; i < n; i++) {
    if (tactile) await page.evaluate((p) => scrollBy(0, p), pas); else await page.mouse.wheel(0, pas);
    await attendre(delai);
    if (k < reperes.length && i / n >= reperes[k]) { await attendre(500); await prendre(`${Math.round(reperes[k] * 100)} % de la page`); k++; }
  }
  await attendre(1500);
  /* Fin du film : un passage de page par le menu, pour montrer le voile et l'arrivée sur la page suivante (audit externe du
     10 novembre 2026 : le film s'arrêtait avant toute navigation, le voile n'y figurait jamais). */
  let passage = null;
  try {
    await page.evaluate(() => scrollTo(0, 0)); await attendre(1000);
    if (tactile) { const b = page.locator('[data-menu-bouton]').first(); if ((await b.count()) && (await b.isVisible())) { await b.click({ timeout: 3000 }); await attendre(800); } }
    const lien = await page.evaluateHandle(() => [...document.querySelectorAll('header a[href], nav a[href], [data-menu] a[href]')].find((a) => {
      const r = a.getBoundingClientRect(), u = new URL(a.href, location.href);
      return r.width > 2 && r.height > 2 && r.top >= 0 && r.bottom <= innerHeight && u.origin === location.origin && u.pathname !== location.pathname && !a.target;
    }) || null);
    if (await lien.evaluate((x) => !!x)) {
      const cible = await lien.evaluate((x) => new URL(x.href).pathname);
      await lien.asElement().click({ timeout: 3000 });
      await attendre(700); await prendre(`voile vers ${cible}`);
      await attendre(2200); await prendre(`arrivée sur ${cible}`);
      passage = cible;
    }
  } catch { /* pas de lien de menu visible : le film s'arrête sur l'accueil */ }
  const video = page.video();
  await ctx.close();
  const brut = await video.path();
  const mp4 = join(sortie, `accueil-${nom}.mp4`);
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', brut, '-vf', `scale=${Math.min(w, 1280)}:-2`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
  } catch { renameSync(brut, mp4.replace(/\.mp4$/, '.webm')); }
  return { nom, intro: Math.round(intro * 10) / 10, defilement: Math.round((n * delai) / 100) / 10, passage, erreurs, fichier: existsSync(mp4) ? mp4 : mp4.replace(/\.mp4$/, '.webm') };
}

/* Écrans presque vides : on défile par demi-écran, chaque écran est réduit en niveaux de gris et découpé en cases ; une case
   sans contraste (écart type < 4 sur 255) est vide. L'en-tête et la barre du bas du téléphone ne comptent pas. */
async function mesurerVides({ nom, w, h, tactile }) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: tactile, hasTouch: tactile, locale: 'fr-FR' });
  const page = await ctx.newPage();
  const res = { nom, ecrans: 0, echantillons: 0, vides: [] };
  try {
    await page.goto(serveur.adresse + page0, { waitUntil: 'load' });
    await pret(page); await attendre(1400);
    const { total, haut, bas } = await page.evaluate(() => {
      const fixes = [...document.querySelectorAll('body *')].filter((e) => { const cs = getComputedStyle(e); return (cs.position === 'fixed' || cs.position === 'sticky') && e.offsetWidth > innerWidth * 0.6 && e.offsetHeight < innerHeight * 0.2; });
      let haut = 0, bas = 0;
      for (const e of fixes) { const r = e.getBoundingClientRect(); if (r.top <= 2) haut = Math.max(haut, r.bottom); else if (r.bottom >= innerHeight - 2) bas = Math.max(bas, innerHeight - r.top); }
      return { total: document.documentElement.scrollHeight - innerHeight, haut, bas };
    });
    res.ecrans = Math.round(((total + h) / h) * 10) / 10;
    const L = 160, H = Math.round((L * h) / w), C = 10;
    const y0 = Math.round((haut / h) * H), y1 = H - Math.round((bas / h) * H);
    let y = 0, i = 0;
    while (y <= total + 1 && i < 80) {
      /* Le pied de page (petits textes espacés sur un fond uni) n'est pas un écran vide : sur Hanamizuki, seul faux signal. */
      const pied = await page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('footer, [data-pied]')].map((f) => { const r = f.getBoundingClientRect(); return Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / innerHeight; })));
      const buf = pied > 0.4 ? null : await page.screenshot({ type: 'jpeg', quality: 60 });
      if (buf) {
        const { data } = await sharp(buf).resize(L, H, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
        let cases = 0, vides = 0;
        for (let cy = y0; cy + C <= y1; cy += C) for (let cx = 0; cx + C <= L; cx += C) {
          let s = 0, s2 = 0;
          for (let yy = cy; yy < cy + C; yy++) for (let xx = cx; xx < cx + C; xx++) { const v = data[yy * L + xx]; s += v; s2 += v * v; }
          const n = C * C, ec = Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2));
          cases++; if (ec < 4) vides++;
        }
        const part = cases ? vides / cases : 0;
        res.echantillons++;
        if (part >= SEUIL_VIDE) {
          const f = join(sortie, `vide-${nom}-${i}.jpg`);
          await sharp(buf).resize(tactile ? 260 : 480).jpeg({ quality: 70 }).toFile(f);
          res.vides.push({ position: Math.round((y / Math.max(1, total)) * 100), part: Math.round(part * 100), f });
        }
      }
      const pas = Math.round(h * 0.5);
      if (tactile) await page.evaluate((p) => scrollBy(0, p), pas);
      else for (let k = 0; k < 5; k++) { await page.mouse.wheel(0, pas / 5); await attendre(40); }
      await attendre(450);
      y = await page.evaluate(() => scrollY);
      if (y >= total - 1 && i > 0 && res.dernier === y) break;
      res.dernier = y; i++;
    }
  } finally { delete res.dernier; await ctx.close(); }
  return res;
}

const films = [];
const vides = [];
try {
  films.push(await filmer({ nom: 'ordinateur', w: 1440, h: 900, tactile: false }));
  films.push(await filmer({ nom: 'telephone', w: 390, h: 844, tactile: true }));
  if (sharp) {
    vides.push(await mesurerVides({ nom: 'ordinateur', w: 1440, h: 900, tactile: false }));
    vides.push(await mesurerVides({ nom: 'telephone', w: 390, h: 844, tactile: true }));
  } else console.log('  sharp introuvable : écrans vides non mesurés (lancer node _biblio/preparer.mjs)');

  /* Planche : palmarès en tête (si fourni), puis les captures ordinateur et téléphone. */
  const img = (f) => `data:image/jpeg;base64,${readFileSync(f).toString('base64')}`;
  const ord = captures.filter((c) => c.nom === 'ordinateur'), tel = captures.filter((c) => c.nom === 'telephone');
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:28px;background:#1b1b1b;color:#eee;font:15px/1.4 system-ui,sans-serif;width:1744px}
    h2{font-size:17px;font-weight:600;margin:0 0 10px;color:#fff} section{margin-bottom:26px}
    .r{display:flex;gap:14px;align-items:flex-start} figure{margin:0} figcaption{color:#aaa;font-size:13px;margin-top:6px}
    .o img{width:${Math.floor((1744 - 14 * (ord.length - 1)) / ord.length)}px;display:block;border-radius:6px}
    .t img{height:520px;display:block;border-radius:6px} .p img{width:1744px;display:block;border-radius:6px}</style>
    ${palmares && existsSync(palmares) ? `<section class="p"><h2>${titreTete}</h2><img src="${img(palmares)}"></section>` : ''}
    <section class="o"><h2>Accueil sur ordinateur</h2><div class="r">${ord.map((c) => `<figure><img src="${img(c.f)}"><figcaption>${c.etiquette}</figcaption></figure>`).join('')}</div></section>
    <section class="t"><h2>Accueil sur téléphone</h2><div class="r">${tel.map((c) => `<figure><img src="${img(c.f)}"><figcaption>${c.etiquette}</figcaption></figure>`).join('')}</div></section>
    ${vides.map((v) => `<section class="v"><h2>${v.nom === 'ordinateur' ? 'Ordinateur' : 'Téléphone'} : accueil de ${String(v.ecrans).replace('.', ',')} écrans${v.ecrans > (v.nom === 'ordinateur' ? 10 : 14) ? ' (trop long)' : ''} · ${v.vides.length ? `${v.vides.length} écran(s) presque vide(s) sur ${v.echantillons}` : `aucun écran presque vide sur ${v.echantillons}`}</h2>${v.vides.length ? `<div class="r" style="flex-wrap:wrap">${v.vides.slice(0, 8).map((x) => `<figure><img style="width:${v.nom === 'ordinateur' ? 330 : 150}px;display:block;border-radius:6px;outline:3px solid #e0533d" src="${img(x.f)}"><figcaption>à ${x.position} % de la page · ${x.part} % vide</figcaption></figure>`).join('')}</div>` : ''}</section>`).join('')}`;
  const ctx = await nav.newContext({ viewport: { width: 1800, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.screenshot({ path: join(sortie, 'planche.jpg'), type: 'jpeg', quality: 80, fullPage: true });
  await ctx.close();
} finally {
  await nav.close();
  serveur.fermer && serveur.fermer();
}
rmSync(join(sortie, 'brut'), { recursive: true, force: true });
for (const f of readdirSync(sortie)) if (/^(ordinateur|telephone)-\d+\.jpg$/.test(f) || /^vide-/.test(f)) rmSync(join(sortie, f));
/* Une image du film toutes les 1,5 s, en mosaïque : ce que le regard du directeur artistique lit sans ouvrir la vidéo. */
for (const f of films) {
  if (!/\.mp4$/.test(f.fichier)) continue;
  /* Tout le film tient dans les 32 cases : une image toutes les 1,5 s, ou plus espacées si le film est long (Hanamizuki :
     un film de plus de 48 s perdait sa fin). */
  let fps = 2 / 3;
  try { const d = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f.fichier]).toString()); if (d > 0) fps = Math.min(2 / 3, 31 / d); } catch {}
  try { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', f.fichier, '-vf', `fps=${fps.toFixed(4)},scale=${f.nom === 'ordinateur' ? 480 : 200}:-2,tile=${f.nom === 'ordinateur' ? '4x8' : '8x4'}:padding=6:color=0x1b1b1b`, '-frames:v', '1', '-q:v', '4', join(sortie, `images-${f.nom}.jpg`)]); } catch {}
}
writeFileSync(join(sortie, 'vides.json'), JSON.stringify(vides.map(({ nom, ecrans, echantillons, vides: v }) => ({ nom, ecrans, echantillons, vides: v.map(({ position, part }) => ({ position, part })) })), null, 1));
console.log(`Aperçu de ${page0} · dossier ${sortie}`);
for (const f of films) console.log(`  ${f.nom} : intro ${f.intro} s, défilement ${f.defilement} s, ${f.passage ? `voile vers ${f.passage}` : 'aucun passage de page (pas de lien de menu visible)'} · ${f.fichier.split('/').pop()} (${Math.round(statSync(f.fichier).size / 1024)} Ko)${f.erreurs.length ? ` · erreurs : ${f.erreurs.join(' | ')}` : ''}`);
const nomTete = vitrine ? 'vitrine' : 'palmarès', laTete = vitrine ? 'la vitrine' : 'le palmarès';
console.log(`  planche.jpg${palmares ? (existsSync(palmares) ? ` (avec ${laTete} en tête)` : ` (${nomTete} introuvable : ${palmares})`) : ''}`);
for (const v of vides) {
  const long = v.ecrans > (v.nom === 'ordinateur' ? 10 : 14);
  console.log(`  ${v.nom} : accueil de ${v.ecrans} écrans de défilement, scènes épinglées comprises${long ? ` : A REGARDER, long (${v.nom === 'ordinateur' ? '8 à 10' : '12 à 14'} attendus ; chaque écran doit valoir son défilement)` : ''} · ${v.vides.length ? `A REGARDER : ${v.vides.length} écran(s) presque vide(s) sur ${v.echantillons}, à ${v.vides.map((x) => x.position + ' %').join(', ')} de la page` : `aucun écran presque vide sur ${v.echantillons}`}`);
}
console.log(`  images-ordinateur.jpg, images-telephone.jpg (le film en mosaïque), vides.json`);
console.log(`  À regarder soi-même avant de l’envoyer : l’accueil fait-il au moins aussi fort que ${laTete}, sans lui ressembler ?`);
process.exit(0);
