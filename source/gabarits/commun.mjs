/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const autres = c.alternatives(cle);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
${autres.length > 1 ? autres.map((a) => html`<link rel="alternate" hreflang="${a.l}" href="${c.abs(a.url)}">\n`) : ''}${autres.length > 1 ? html`<link rel="alternate" hreflang="x-default" href="${c.abs(c.alternatives(cle)[0].url)}">` : ''}
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/images/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="${c.l === 'fr' ? 'fr_FR' : c.l === 'en' ? 'en_GB' : c.l}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function entete(c) {
  const autreLangue = c.alternatives(c.page.cle).filter((a) => a.l !== c.l);
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo.png" alt="" width="46" height="40"><span>${c.site.nom}</span>
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${autreLangue.map((a) => html`<a class="entete-langue" href="${a.url}" hreflang="${a.l}" lang="${a.l}" data-langue="${a.l}" aria-label="${c.s('commun.langueAutre')}">${a.l}</a>`)}
      ${c.site.actionEntete ? html`<a class="bouton" href="${c.url(c.site.actionEntete.page, c.site.actionEntete.ancre || '')}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a>` : ''}
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
      <a class="menu-sansjs" href="#menu" data-menu-lien>${c.t('commun.menu')}</a>
    </div>
  </div>
</header>
<script>/* Avant le premier affichage : rangées de la navigation (même règle que ajusterNav dans assets/js/socle/entete.js)
   et hauteur réelle de l'en-tête, pour que rien ne saute quand le JavaScript du site prend la main. */
(function () {
  var h = document.documentElement, u = document.querySelector('[data-nav] ul'), e = document.querySelector('[data-entete]');
  if (u) {
    var deborde = function () { return u.scrollWidth > u.clientWidth + 1; }, c = deborde();
    if (c && window.matchMedia('(min-width: 900px)').matches) {
      h.classList.add('nav-deux-rangees'); c = deborde();
      if (c) { h.classList.add('nav-deux-lignes'); var a = u.querySelector('a'); c = !a || u.getBoundingClientRect().height > a.getBoundingClientRect().height * 2.5; }
      if (c) h.classList.remove('nav-deux-rangees', 'nav-deux-lignes');
    }
    if (c) h.classList.add('nav-compacte');
  }
  if (e) h.style.setProperty('--entete-h', Math.round(e.getBoundingClientRect().height) + 'px');
})();</script>
<span id="menu-ferme" aria-hidden="true"></span>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <p class="menu-sansjs-fermer"><a href="#menu-ferme">${c.t('commun.fermer')}</a></p>
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
  <p><a class="bouton" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
  <p class="menu-adresse">${c.site.contact.adresse}<br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
  ${autreLangue.map((a) => html`<p><a class="entete-langue" href="${a.url}" hreflang="${a.l}" lang="${a.l}" data-langue="${a.l}">${c.s('commun.langueAutre')}</a></p>`)}
  <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-marque"><img src="/assets/images/logo.png" alt="Red-Act, l'esprit et la lettre" width="92" height="80"></p>
      <p>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p><strong>${c.t('commun.sommaire')}</strong></p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div>
      <p><strong>${c.t('commun.suivre')}</strong></p>
      <ul>${(c.site.reseaux || []).map((r) => html`<li><a href="${r.url}" target="_blank" rel="noopener">${r.nom}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></li>`)}</ul>
      <p><strong>${c.t('commun.confort')}</strong></p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>${c.t('commun.legal')}</p><p>© ${c.site.nom} · ${c.t('commun.devise')}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  ${a ? html`<a class="bouton" href="${c.url(a.page, a.ancre || '')}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>` : ''}
</div>`;
}

/* Voile : sa forme (glisse, iris, vague, rideau) vient de donnees/site.json (formeVoile) ; voir assets/js/socle/voile.js. */
const FORMES_VOILE = ['glisse', 'iris', 'vague', 'rideau', 'trame'];
function voile(c) {
  const forme = FORMES_VOILE.includes(c.site.formeVoile) ? c.site.formeVoile : 'glisse';
  const vagues = forme === 'vague'
    ? html`<svg class="voile-vague voile-vague--haut" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 C 240 20 480 20 720 70 S 1200 130 1440 40 V 120 H 0 Z"/></svg><svg class="voile-vague voile-vague--bas" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 C 240 100 480 100 720 50 S 1200 -10 1440 80 V 0 H 0 Z"/></svg>`
    : '';
  return html`<div data-voile data-forme="${forme}" aria-hidden="true">${vagues}<div class="voile-contenu"><svg class="voile-noeud" viewBox="0 0 64 64" width="56" height="56" aria-hidden="true"><use href="#noeud"/></svg><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="noeud" viewBox="0 0 64 64"><path d="M8 34 C 18 34 22 18 32 18 C 44 18 46 40 32 42 C 20 44 22 24 34 24 C 44 24 48 34 56 34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></symbol></defs></svg>
<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <div class="intro-scene">
  <svg class="intro-mot" viewBox="0 0 640 200" width="640" height="200">
    <path class="intro-fil-entree" d="M-20 150 C 40 150 60 140 80 128" fill="none"/>
    <text class="intro-red" x="78" y="140">${c.t('intro.red')}</text>
    <text class="intro-act" x="372" y="140">${c.t('intro.act')}</text>
  </svg>
  <span class="intro-noeud" data-ouverture-objet><svg viewBox="0 0 64 64" width="64" height="64"><use href="#noeud"/></svg></span>
  </div>
  <p class="ouverture-ligne">${c.t('commun.introLigne')}</p>
</div>
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
