/* Accueil de Red-Act, direction « Red, le réseau ».
   Grille wouahou : filet des références à tirer (manipuler), intro du fil qui écrit Red-Act et se noue (versObjet),
   voile en lanières tissées (trame), fil rouge en marge (fil), titres en Fraunces dont l'axe SOFT s'anime et
   titre « Stéphane Bourhis » écrit au fil (typo), chiasme « Savoir faire & faire savoir » croisé par le fil, six métiers suspendus au fil comme des épreuves,
   index des dix secteurs. v3 : sections « Le nom » et « Depuis l'Alsace » retirées (accueil de 13 à 9 écrans). */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1168.webp' };

const nf = (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/[  ]/g, ' ');

/* Noms posés sur les nœuds du filet de l'ouverture : un ou deux par secteur, tels qu'ils figurent sur le site. */
export const NOMS_FILET = ['Wolfberger', 'Électricité de Strasbourg', 'L\'Express', 'Medef', 'Labonal', 'Peugeot Strasbourg',
  'Maison de l\'Alsace', 'Brasserie Météor', 'Groupe ICADE', 'Carré Blanc', 'Made in Alsace', 'Coop Alsace',
  'Château de Pommard', 'Diatem', 'ACTWEB', 'Lucien Doriath', 'Heuft France', 'Dermovitalia', 'Klipfel', 'Adira'];

export default (c) => {
  const refs = c.donnees.references;
  const nbNoms = refs.reduce((n, s) => n + s.noms.length, 0);
  const metiers = c.donnees.metiers;
  const secteurDe = (nom) => (refs.find((s) => s.noms.includes(nom)) || {}).cle || '';
  const filetNoms = NOMS_FILET.map((n) => `${n}~${secteurDe(n)}`);
  const dimPortrait = { largeur: 480, hauteur: 360 };
  return html`
<div class="fil-racine" data-grille="fil">

<section class="hero" id="debut" data-fil="gauche">
  <div class="hero-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre titre-souple" data-axe data-chiasme><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--chiasme" data-anime="gsap"><span class="chi-et">${c.t('accueil.hero.titre2et')}</span> <span class="chi-mot" data-chi="a">${c.t('accueil.hero.titre2a')}</span> <span class="chi-mot" data-chi="b">${c.t('accueil.hero.titre2b')}</span></span></span></h1>
    <svg class="chiasme-fil" aria-hidden="true" data-effet="chiasme" data-superpose data-audit-ignorer><path class="chiasme-fil-ombre" d="M0 0"/><path class="chiasme-fil-trait" d="M0 0"/></svg>
    <p class="hero-intro tete-suite masque-ecran-tres-bas" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="hero-tel">${c.t('accueil.hero.ou')} <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></span>
    </p>
    <p class="hero-signature tete-suite" data-anime="gsap">
      <span class="hero-medaillon" aria-hidden="true"><img src="/assets/images/stephane-bourhis-480.webp" alt="" width="${dimPortrait.largeur}" height="${dimPortrait.hauteur}" loading="eager" decoding="async"></span>
      <span><strong>${c.t('accueil.hero.signatureNom')}</strong>, ${c.t('accueil.hero.signatureRole')}<br><span class="hero-info" data-info-cle>${c.t('accueil.hero.info')}</span></span>
    </p>
  </div>
  <div class="hero-scene" data-grille="manipuler">
    ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '62% 40%', cadrageMobile: '50% 96%', priorite: true, classe: 'hero-media', sizes: '(max-width: 760px) 100vw, 58vw' })}
    <canvas class="filet" data-effet="filet" data-souris data-filet="${filetNoms.join('|')}" role="img" aria-label="${c.s('accueil.hero.filet', { noms: NOMS_FILET.slice(0, 8).join(', ') })}" data-audit-ignorer></canvas>
    <span class="filet-noeud" data-iris-centre="disque" aria-hidden="true"><svg viewBox="0 0 64 64" width="44" height="44"><use href="#noeud"/></svg></span>
    <p class="filet-consigne" aria-hidden="true"><span class="sur-souris">${c.t('accueil.hero.consigne')}</span><span class="sur-tactile">${c.t('accueil.hero.consigneTactile')}</span></p>
  </div>
</section>

<section class="epreuves" id="metiers" data-scene data-fil="gauche">
  <div class="epreuves-collant" data-collant>
    <div class="conteneur epreuves-tete">
      <p class="surtitre">${c.t('accueil.metiers.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.metiers.titre')}</h2>
      <p class="epreuves-consigne masque-ecran-bas">${c.t('accueil.metiers.texte')}</p>
    </div>
    <div class="epreuves-scene" role="region" aria-roledescription="carrousel" aria-label="${c.s('accueil.metiers.region')}">
      <svg class="epreuves-fil" aria-hidden="true" data-audit-ignorer><path class="epreuves-fil-ombre" d="M0 0"/><path class="epreuves-fil-trait" d="M0 0"/></svg>
      <ul class="epreuves-liste" data-epreuves data-effet="epreuves-fil">
        ${metiers.map((m, i) => html`<li class="epreuve" style="--i:${i}" data-epreuve>
          <span class="epreuve-pince" aria-hidden="true"></span>
          <a href="${c.url('metiers', m.cle)}" data-libelle="${c.libelle('metiers')}">
            ${c.media({ nom: m.image, alt: '', classe: 'epreuve-media', sizes: '(max-width: 760px) 46vw, 220px' })}
            <span class="epreuve-num" aria-hidden="true">0${i + 1}</span>
            <strong class="epreuve-nom">${m.nom}</strong>
            <span class="epreuve-court">${m.court}</span>
          </a>
        </li>`)}
      </ul>
    </div>
    <div class="epreuves-commandes">
      <button type="button" class="rond" data-epreuves-prec aria-label="${c.s('accueil.metiers.precedent')}"><span aria-hidden="true">←</span></button>
      <span class="epreuves-etat" data-epreuves-etat aria-live="polite">01 / 06</span>
      <button type="button" class="rond" data-epreuves-suiv aria-label="${c.s('accueil.metiers.suivant')}"><span aria-hidden="true">→</span></button>
      ${c.lien('metiers', { classe: 'lien-fleche', texte: c.t('accueil.metiers.tout') })}
    </div>
  </div>
</section>

<section class="specialites conteneur" id="specialites" data-fil="droite">
  <div class="specialites-tete">
    <p class="surtitre" data-anime>${c.t('accueil.specialites.surtitre')}</p>
    <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.specialites.titre')}</h2>
    <blockquote class="citation" data-anime><p>${c.t('accueil.specialites.citation')}</p></blockquote>
  </div>
  <div class="specialites-grille">
    <article class="spe spe--politique">
      ${c.media({ nom: 'grok/specialites-ouverture-politique', alt: c.s('accueil.specialites.altPolitique'), cadrage: '50% 42%', classe: 'spe-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
      <h3>${c.t('accueil.specialites.politiqueTitre')}</h3>
      <p>${c.t('accueil.specialites.politiqueTexte')}</p>
      ${c.lien('specialites', { ancre: 'politique', classe: 'lien-fleche', texte: c.t('accueil.specialites.voir') })}
    </article>
    <article class="spe spe--tourisme">
      ${c.media({ nom: 'grok/accueil-alsace', alt: c.s('accueil.specialites.altTourisme'), cadrage: '50% 60%', classe: 'spe-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
      <h3>${c.t('accueil.specialites.tourismeTitre')}</h3>
      <p>${c.t('accueil.specialites.tourismeTexte')}</p>
      ${c.lien('specialites', { ancre: 'tourisme', classe: 'lien-fleche', texte: c.t('accueil.specialites.voir') })}
    </article>
  </div>
</section>

<section class="reseau" id="reseau" data-fil="gauche">
  <div class="conteneur reseau-grille">
    <div class="reseau-tete">
      <p class="surtitre" data-anime>${c.t('accueil.reseau.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.reseau.titre')}</h2>
      <p class="reseau-texte" data-anime>${c.t('accueil.reseau.texte')}</p>
      <ul class="chiffres-liste" data-anime="cascade">
        <li><strong class="chiffre">2004</strong> <span>${c.t('accueil.reseau.depuis')}</span></li>
        <li><strong class="chiffre">${nbNoms}</strong> <span>${c.t('accueil.reseau.noms')}</span></li>
        <li><strong class="chiffre">${refs.length}</strong> <span>${c.t('accueil.reseau.secteurs')}</span></li>
        <li><strong class="chiffre">${nf(12000)}</strong> <span>${c.t('accueil.reseau.passeport')}</span></li>
      </ul>
    </div>
    <div class="reseau-index" data-visuel>
      <h3 class="reseau-index-titre" data-anime>${c.t('accueil.reseau.secteursTitre')}</h3>
      <svg class="reseau-fil" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path data-fx-trait d="M-10 40 C 120 10 200 120 320 80 S 520 20 610 110 M -10 200 C 140 160 240 260 360 220 S 520 170 610 250 M -10 340 C 160 300 260 390 380 350 S 540 320 610 380"/></svg>
      <ul class="secteurs-index" data-anime="cascade">
        ${refs.map((s) => html`<li><a href="${c.url('references', '', 'secteur=' + s.cle)}" aria-label="${c.s('accueil.reseau.secteurLien', { nom: s.nom })}">${s.court || s.nom}<sup>${s.noms.length}</sup></a></li>`)}
      </ul>
      <p>${c.lien('references', { classe: 'bouton bouton--clair', texte: c.t('accueil.reseau.voir'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>

<section class="stephane conteneur" id="stephane" data-fil="droite">
  ${c.media({ nom: 'stephane-bourhis', alt: c.s('accueil.stephane.alt'), cadrage: '46% 45%', classe: 'stephane-media', sizes: '(max-width: 760px) 100vw, 42vw', attrs: 'data-anime="rideau"' })}
  <div class="stephane-texte">
    <p class="surtitre" data-anime>${c.t('accueil.stephane.surtitre')}</p>
    <h2 class="titre-fil" data-titre-fil data-effet="titre-au-fil" data-grille="typo"><span class="visuellement-cache">${c.t('accueil.stephane.nom')}</span><svg class="titre-fil-svg" aria-hidden="true" viewBox="0 0 900 140" preserveAspectRatio="xMinYMid meet"><text x="4" y="108">${c.s('accueil.stephane.nom')}</text></svg></h2>
    <p class="stephane-role" data-anime>${c.t('accueil.stephane.role')}</p>
    <p data-anime>${c.t('accueil.stephane.texte1')}</p>
    <p data-anime>${c.t('accueil.stephane.texte2')}</p>
    <p class="valeurs" data-anime>${c.t('accueil.stephane.valeurs')}</p>
    <figure class="alsacien" data-anime>
      <blockquote lang="gsw" data-typo-ignorer><p>${c.s('accueil.stephane.alsacien')}</p></blockquote>
      <figcaption>${c.t('accueil.stephane.alsacienNote')}</figcaption>
    </figure>
  </div>
</section>

<section class="methode" id="methode" data-fil="gauche">
  <div class="conteneur methode-grille">
    <div class="methode-tete">
      <p class="surtitre" data-anime>${c.t('accueil.methode.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.methode.titre')}</h2>
    </div>
    <ol class="etapes" data-anime="cascade" data-visuel>
      ${[1, 2, 3, 4].map((i) => html`<li class="etape">
        <span class="etape-noeud" data-fil-point="0.5 0.5" data-fil-boucle data-fil-sans-perle aria-hidden="true"></span>
        <h3><span class="etape-num">0${i}</span> ${c.t(`accueil.methode.e${i}t`)}</h3>
        <p>${c.t(`accueil.methode.e${i}`)}</p>
      </li>`)}
    </ol>
  </div>
</section>

<section class="fin conteneur" id="fin" data-fil="droite">
  ${c.media({ nom: 'grok/contact-lettre', alt: c.s('accueil.fin.alt'), cadrage: '60% 50%', classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
  <div>
    <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
    <p data-anime>${c.t('accueil.fin.texte')}</p>
    <p class="fin-actions" data-anime>
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('accueil.fin.action'), attrs: 'data-survol="magnetique"' })}
      ${c.lien('contact', { ancre: 'rendez-vous', params: 'besoin=documentation', classe: 'bouton bouton--contour', texte: c.t('accueil.fin.documentation'), attrs: 'data-survol="magnetique"' })}
    </p>
    <p class="fin-appel" data-anime>${c.t('accueil.fin.appel')} <a class="numero numero--fin" href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
  </div>
</section>

</div>
`;
};
