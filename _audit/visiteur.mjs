#!/usr/bin/env node
/* Test « vrai visiteur » : un navigateur que l'agent du test pilote pas à pas, comme un futur client du site.
   Chaque appel repart de la page d'arrivée et rejoue toute la suite de gestes (aucun état gardé entre deux appels) :
   l'agent ajoute un geste, relance, regarde la dernière capture, décide du suivant.

   node _audit/visiteur.mjs --mission prix --taille 390x844 --page / "defiler" "cliquer Tarifs" "capture"
     --mission  nom court de la mission (dossier _audit/visiteur/<mission>-<taille>/)
     --taille   390x844 (téléphone, tactile) ou 1440x900 (ordinateur), ou toute autre taille
     --page     page d'arrivée (/ par défaut)
   Gestes :
     defiler [n]            fait défiler de n écrans (1 par défaut) ; compte n gestes
     remonter [n]           l'inverse
     cliquer <texte>        clique le lien ou le bouton visible dont le texte (ou le nom accessible) contient <texte> ; 1 geste
                            (un élément recouvert ou hors de portée échoue : « inaccessible », comme pour un visiteur)
     menu                   ouvre le menu (bouton Menu) ; 1 geste, 2 si l'en-tête caché doit d'abord revenir
     remplir <champ>=<val>  remplit le champ dont l'étiquette contient <champ> ; 1 geste
     choisir <champ>=<val>  choisit une option dans une liste ; 1 geste
     retour                 page précédente ; 1 geste
     attendre <ms>          attente, sans geste
     capture                capture de l'écran (une capture est aussi faite à l'arrivée et après le dernier geste)
   Après chaque geste, le journal note : adresse, position, titres et boutons visibles dans l'écran, prix et numéros
   visibles, temps écoulé. Résultat : _audit/visiteur/<mission>-<taille>/journal.json et etape-<k>.png ;
   un résumé s'affiche (dernier écran : ce que voit le visiteur). Rien n'est jugé par le script : c'est l'agent
   qui dit si la mission est réussie, en combien de gestes et de secondes, et ce qui l'a gêné. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demarrerServeur } from './serveur.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ici = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); if (i < 0) return d; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const mission = opt('mission', 'mission');
const [w, h] = opt('taille', '390x844').split('x').map(Number);
const depart = opt('page', '/');
const racine = resolve(opt('racine', join(ici, '..')));
const gestes = argv;
const tactile = w < 900;
const sortie = join(ici, 'visiteur', `${mission}-${w}x${h}`);
rmSync(sortie, { recursive: true, force: true });
mkdirSync(sortie, { recursive: true });

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const serveur = await demarrerServeur(racine);
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: tactile, hasTouch: tactile, locale: 'fr-FR' });
const page = await ctx.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(String(e).split('\n')[0]));

async function pret() {
  try { await page.waitForFunction(() => document.documentElement.classList.contains('pret') || (window.__socle && window.__socle.pret), null, { timeout: 9000 }); }
  catch { await attendre(2500); }
  await attendre(500);
}
/* Ce que voit le visiteur : seulement ce qui est dans l'écran. */
const voir = () => page.evaluate(() => {
  const vh = innerHeight, vw = innerWidth;
  const dedans = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const txt = (el) => (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const titres = [...document.querySelectorAll('h1, h2, h3')].filter(dedans).map((x) => `${x.tagName.toLowerCase()} ${txt(x)}`).slice(0, 8);
  const actions = [...document.querySelectorAll('a[href], button, [role="button"], input[type="submit"]')].filter(dedans).map(txt).filter(Boolean);
  const corps = document.body.innerText;
  const prix = [...new Set((corps.match(/\d[\d  .,]*\s?(€|EUR|CHF|\$)/g) || []).map((x) => x.replace(/\s+/g, ' ')))].slice(0, 8);
  const tels = [...new Set((corps.match(/(\+33|0)[1-9](?:[ .]?\d{2}){4}/g) || []))].slice(0, 3);
  /* Prix et numéros réellement dans l'écran : textes visibles qui en contiennent un. */
  const prixVus = [], telsVus = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n && prixVus.length < 6; n = w.nextNode()) {
    const t = n.textContent.replace(/\s+/g, ' ');
    if (!/\d/.test(t) || !n.parentElement || !dedans(n.parentElement)) continue;
    for (const m of t.match(/\d[\d .,]*\s?(€|EUR|CHF|\$)/g) || []) prixVus.push(m.trim());
    for (const m of t.match(/(\+33|0)[1-9](?:[ .]?\d{2}){4}/g) || []) telsVus.push(m);
  }
  return { adresse: location.pathname + location.search + location.hash, y: Math.round(scrollY), hauteurPage: document.documentElement.scrollHeight,
    titres, actions: [...new Set(actions)].slice(0, 14), prixVus: [...new Set(prixVus)], telephonesVus: [...new Set(telsVus)], prixDansLaPage: prix, telephones: tels, menuOuvert: document.documentElement.classList.contains('menu-ouvert') };
});
async function cliquer(texte) {
  const t = texte.toLowerCase();
  const cible = await page.evaluateHandle((t) => {
    const vh = innerHeight;
    const ok = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < vh && s.visibility !== 'hidden' && s.display !== 'none'; };
    const nom = (el) => ((el.innerText || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.value || '')).toLowerCase();
    const els = [...document.querySelectorAll('a[href], button, [role="button"], input[type="submit"], summary, label')].filter((el) => nom(el).includes(t));
    return els.find(ok) || null;
  }, t);
  if (!(await cible.evaluate((x) => !!x))) return `introuvable dans l'écran : « ${texte} »`;
  /* Pas de clic de secours par le code de la page : un élément que Playwright ne peut pas cliquer (recouvert, hors de portée,
     désactivé) est aussi inaccessible pour un visiteur. L'ancien repli element.click() faisait réussir des missions qu'un
     vrai visiteur aurait ratées (audit externe du 10 novembre 2026). */
  try { await cible.asElement().click({ timeout: 5000 }); }
  catch (e) { return `inaccessible : « ${texte} » est dans l'écran mais ne se clique pas (recouvert, hors de portée ou désactivé)`; }
  await page.waitForLoadState('load').catch(() => {});
  await attendre(1600);
  await pret().catch(() => {});
  return 'ok';
}

const journal = [];
const t0 = Date.now();
let nbGestes = 0, k = 0, tempsOutil = 0;
/* Le temps compté est celui du parcours : le relevé de l'écran et les captures faits par l'outil en sont retirés. */
const noter = async (geste, resultat = 'ok', capture = false) => {
  const a = Date.now();
  const secondes = Math.round((a - t0 - tempsOutil) / 100) / 10;
  const vu = await voir();
  const e = { k, geste, resultat, gestes: nbGestes, secondes, ...vu };
  if (capture) { e.capture = `etape-${k}.png`; await page.screenshot({ path: join(sortie, e.capture) }); }
  journal.push(e); k++;
  tempsOutil += Date.now() - a;
};

try {
  await page.goto(serveur.adresse + depart, { waitUntil: 'load' });
  await pret();
  await noter('arrivée', 'ok', true);
  for (const [i, g] of gestes.entries()) {
    const [verbe, ...reste] = g.split(' ');
    const arg = reste.join(' ');
    let r = 'ok';
    if (verbe === 'defiler' || verbe === 'remonter') {
      const n = Math.max(1, parseFloat(arg) || 1);
      for (let j = 0; j < n; j++) {
        if (tactile) await page.evaluate((s) => scrollBy({ top: s * innerHeight * 0.85, behavior: 'smooth' }), verbe === 'defiler' ? 1 : -1);
        else await page.mouse.wheel(0, (verbe === 'defiler' ? 1 : -1) * h * 0.85);
        await attendre(700);
      }
      nbGestes += n;
    } else if (verbe === 'cliquer') { r = await cliquer(arg); nbGestes++; }
    else if (verbe === 'menu') {
      /* Comme un visiteur : si l'en-tête s'est caché en descendant, un petit geste vers le haut le fait revenir. */
      const b = page.locator('[data-menu-bouton]').first();
      if (!(await b.count())) r = 'aucun bouton Menu';
      else {
        /* Faire revenir l'en-tête est un geste de plus. */
        if (!(await b.isVisible()) || !(await b.evaluate((x) => { const q = x.getBoundingClientRect(); return q.bottom > 0 && q.top < innerHeight; }))) { await page.mouse.wheel(0, -160); await attendre(600); nbGestes++; }
        try { await b.click({ timeout: 4000 }); await attendre(700); } catch { r = 'bouton Menu hors de portée (en-tête caché ou bouton masqué)'; }
      }
      nbGestes++;
    }
    else if (verbe === 'remplir' || verbe === 'choisir') {
      const [champ, val] = arg.split('=');
      const el = page.getByLabel(new RegExp(champ, 'i')).first();
      try { if (verbe === 'remplir') await el.fill(val ?? '', { timeout: 4000 }); else await el.selectOption({ label: val }, { timeout: 4000 }); } catch (e) { r = `champ introuvable : « ${champ} »`; }
      nbGestes++;
    } else if (verbe === 'retour') { await page.goBack().catch(() => {}); await attendre(1500); nbGestes++; }
    else if (verbe === 'attendre') await attendre(parseFloat(arg) || 500);
    else if (verbe === 'capture') { await noter('capture', 'ok', true); continue; }
    else r = `geste inconnu : ${verbe}`;
    await noter(g, r, i === gestes.length - 1);
  }
} finally {
  writeFileSync(join(sortie, 'journal.json'), JSON.stringify({ mission, taille: `${w}x${h}`, depart, erreurs, etapes: journal }, null, 1));
  const der = journal[journal.length - 1];
  console.log(`Mission ${mission} · ${w}x${h} · ${nbGestes} geste(s) · ${der ? der.secondes : 0} s · dossier ${sortie}`);
  for (const e of journal) if (e.resultat !== 'ok') console.log(`  ! ${e.geste} : ${e.resultat}`);
  if (der) {
    console.log(`  écran final : ${der.adresse} (y=${der.y})${der.capture ? ` · capture ${der.capture}` : ''}`);
    console.log(`  titres : ${der.titres.join(' | ') || 'aucun'}`);
    console.log(`  actions : ${der.actions.join(' | ') || 'aucune'}`);
    if (der.prixVus.length || der.prixDansLaPage.length) console.log(`  prix dans l’écran : ${der.prixVus.join(' | ') || 'aucun'} · dans la page : ${der.prixDansLaPage.join(' | ')}`);
    if (der.telephonesVus.length) console.log(`  téléphone dans l’écran : ${der.telephonesVus.join(' | ')}`);
  }
  if (erreurs.length) console.log(`  erreurs : ${erreurs.join(' | ')}`);
  await nav.close();
  serveur.fermer && serveur.fermer();
  process.exit(0);
}
