/* Références (seule page sombre) : le grand filet de nuit avec les 90 noms réels, filtres par secteur qui
   allument et tirent les nœuds (sélection gardée dans l'adresse), liste complète lisible, mots géants des noms,
   Passeport Alsacien. Aucun logo de client n'est reproduit. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'references', fichier: 'references', imagePartage: 'grok/references-ouverture-1168.webp' };

const nf = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[  ]/g, ' ');

export default (c) => {
  const refs = c.donnees.references;
  const n = refs.reduce((t, s) => t + s.noms.length, 0);
  const tous = refs.flatMap((s) => s.noms.map((nom) => `${nom}~${s.cle}`));
  return html`
<div class="fil-racine page-nuit" data-grille="fil">

<section class="tete-ref" id="debut" data-fil="gauche">
  <div class="tete-ref-scene" data-grille="manipuler">
    ${c.media({ nom: 'grok/references-ouverture', alt: c.s('references.tete.alt'), cadrage: '60% 60%', cadrageMobile: '50% 70%', priorite: true, classe: 'tete-ref-media', sizes: '100vw' })}
    <canvas class="filet" data-effet="filet-references" data-souris data-filet="${tous.join('|')}" role="img" aria-label="${c.s('references.tete.filet', { n })}" data-audit-ignorer></canvas>
    <span class="filet-noeud" data-iris-centre="disque" aria-hidden="true"><svg viewBox="0 0 64 64" width="44" height="44"><use href="#noeud"/></svg></span>
  </div>
  <div class="conteneur tete-ref-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('references.tete.surtitre')}</p>
    <h1 class="titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('references.tete.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--rouge" data-anime="gsap">${c.t('references.tete.titre2', { n })}</span></span></h1>
    <p class="tete-suite masque-ecran-bas" data-anime="gsap">${c.t('references.tete.texte')}</p>
    <p class="hero-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('references.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="hero-info" data-info-cle>${c.t('references.tete.info', { s: refs.length })}</span>
    </p>
  </div>
  <div class="conteneur filtres-cadre">
    <p class="filtres-titre" id="filtres-titre">${c.t('references.filtres.titre')}</p>
    <ul class="filtres" aria-labelledby="filtres-titre" data-anime="cascade">
      <li><button type="button" class="filtre" data-filtre="" aria-pressed="true">${c.t('references.filtres.tous')} <span>${n}</span></button></li>
      ${refs.map((s) => html`<li><button type="button" class="filtre" data-filtre="${s.cle}" aria-pressed="false">${s.court} <span>${s.noms.length}</span></button></li>`)}
    </ul>
  </div>
</section>

<section class="liste-ref conteneur" id="liste" data-fil="droite">
  <div class="liste-ref-tete">
    <div>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('references.liste.titre')}</h2>
      <p data-anime>${c.t('references.liste.texte')}</p>
    </div>
    <svg class="liste-filet" viewBox="0 0 220 140" aria-hidden="true" data-visuel data-fx="trace"><path data-fx-trait d="M20 110 L70 40 L130 70 L190 24 M70 40 L110 120 L130 70 M110 120 L190 96 L190 24 M20 110 L110 120"/><circle cx="20" cy="110" r="6"/><circle cx="70" cy="40" r="6"/><circle cx="130" cy="70" r="7"/><circle cx="190" cy="24" r="6"/><circle cx="110" cy="120" r="6"/><circle cx="190" cy="96" r="6"/></svg>
  </div>
  <div class="secteurs" data-anime="cascade" aria-live="polite">
    ${refs.map((s) => html`<article class="secteur" data-secteur="${s.cle}" id="secteur-${s.cle}">
      <h3>${s.nom}${s.note ? html` <small>${s.note}</small>` : ''}</h3>
      <ul>${s.noms.map((nom) => html`<li>${nom}</li>`)}</ul>
    </article>`)}
  </div>
</section>

<section class="passeport conteneur" id="passeport" data-fil="droite">
  <div class="passeport-carnet" aria-hidden="true" data-visuel>
    ${[0, 1, 2, 3, 4].map((i) => html`<span class="carnet-page" style="--i:${i}"></span>`)}
    <span class="carnet-couverture" data-effet="carnet"><span>${c.t('references.passeport.titre')}</span></span>
  </div>
  <div>
    <h2 class="titre-fil" data-titre-fil data-effet="titre-au-fil" data-grille="typo"><span class="visuellement-cache">${c.t('references.passeport.titre')}</span><svg class="titre-fil-svg" aria-hidden="true" viewBox="0 0 1300 140" preserveAspectRatio="xMinYMid meet"><text x="4" y="108">${c.s('references.passeport.titre')}</text></svg></h2>
    <p class="passeport-chiffre"><strong class="chiffre">${nf(12000)}</strong> <span>${c.t('references.passeport.unite')}</span></p>
    <p data-anime>${c.t('references.passeport.texte')}</p>
  </div>
</section>

<section class="autres conteneur" id="et-aussi" data-fil="gauche">
  <div class="autres-noeud" aria-hidden="true" data-visuel>
    <svg viewBox="0 0 400 260" data-fx="trace"><path data-fx-trait d="M-10 150 C 70 150 110 60 190 70 C 270 80 260 190 200 190 C 140 190 140 110 210 100 C 290 90 330 160 410 150"/></svg>
  </div>
  <div>
    <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('references.fin.titre')}</h2>
    <p data-anime>${c.t('references.fin.texte')}</p>
    <p class="fin-actions" data-anime>${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--clair', texte: c.t('references.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

</div>
`;
};
