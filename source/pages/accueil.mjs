/* Accueil de Red-Act, direction « Red, le réseau ».
   Grille wouahou : filet des références à tirer (manipuler), intro du fil qui écrit Red-Act et se noue (versObjet),
   voile en lanières tissées (trame), fil rouge en marge (fil), titres en Fraunces dont l'axe SOFT s'anime et
   titre « Stéphane Bourhis » écrit au fil (typo), roue 3D des six métiers, mots géants, Alsace en plein écran. */
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
  return html`
<div class="fil-racine" data-grille="fil">

<section class="hero" id="debut" data-fil="gauche">
  <div class="hero-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre2')}</span></span></h1>
    <p class="hero-intro tete-suite masque-ecran-tres-bas" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions tete-suite" data-anime="gsap">
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="hero-info" data-info-cle>${c.t('accueil.hero.info')}</span>
    </p>
  </div>
  <div class="hero-scene" data-grille="manipuler">
    ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '62% 40%', cadrageMobile: '50% 96%', priorite: true, classe: 'hero-media', sizes: '(max-width: 760px) 100vw, 58vw' })}
    <canvas class="filet" data-effet="filet" data-souris data-filet="${filetNoms.join('|')}" role="img" aria-label="${c.s('accueil.hero.filet', { noms: NOMS_FILET.slice(0, 8).join(', ') })}" data-audit-ignorer></canvas>
    <span class="filet-noeud" data-iris-centre="disque" aria-hidden="true"><svg viewBox="0 0 64 64" width="44" height="44"><use href="#noeud"/></svg></span>
    <p class="filet-consigne" aria-hidden="true"><span class="sur-souris">${c.t('accueil.hero.consigne')}</span><span class="sur-tactile">${c.t('accueil.hero.consigneTactile')}</span></p>
  </div>
</section>

<section class="nom" id="nom" data-fil="droite">
  <div class="conteneur nom-tete">
    <p class="surtitre" data-anime>${c.t('accueil.nom.surtitre')}</p>
    <h2 class="titre-souple" data-axe data-anime="lettres">${c.t('accueil.nom.titre')}</h2>
    <p class="nom-texte" data-anime="mots">${c.t('accueil.nom.texte')}</p>
  </div>
  <div class="mots-geants" data-fx="mots-geants" aria-hidden="true" data-ruban data-visuel data-audit-ignorer>
    <p data-fx-rangee>${c.t('accueil.nom.rangee1')} ${c.t('accueil.nom.rangee1')}</p>
    <p data-fx-rangee data-sens="-1" class="mots-geants--creux">${c.t('accueil.nom.rangee2')} ${c.t('accueil.nom.rangee2')}</p>
  </div>
</section>

<section class="alsace" id="alsace" data-fx="plein-ecran" data-plein-ecran>
  <div data-collant>
    ${c.media({ nom: 'grok/accueil-alsace', alt: c.s('accueil.alsace.alt'), cadrage: '50% 55%', sizes: '100vw' })}
    <p class="alsace-mot alsace-mot--g" data-fx-ecarte="g" aria-hidden="true">${c.t('accueil.alsace.gauche')}</p>
    <p class="alsace-mot alsace-mot--d" data-fx-ecarte="d" aria-hidden="true">${c.t('accueil.alsace.droite')}</p>
    <h2 class="visuellement-cache">${c.t('accueil.alsace.gauche')} ${c.t('accueil.alsace.droite')}</h2>
    <p class="alsace-legende" data-fx-apres>${c.t('accueil.alsace.legende')}</p>
  </div>
</section>

<section class="roue" id="metiers" data-scene data-fil="gauche">
  <div class="roue-collant" data-collant>
    <div class="conteneur roue-tete">
      <p class="surtitre">${c.t('accueil.metiers.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.metiers.titre')}</h2>
      <p class="roue-consigne masque-ecran-bas">${c.t('accueil.metiers.texte')}</p>
    </div>
    <div class="roue-scene" role="region" aria-roledescription="carrousel" aria-label="${c.s('accueil.metiers.region')}">
      <span class="roue-fil" aria-hidden="true"></span>
      <ul class="roue-anneau" data-roue data-effet="roue-metiers">
        ${metiers.map((m, i) => html`<li class="roue-carte" style="--i:${i}" data-roue-carte>
          <a href="${c.url('metiers', m.cle)}" data-libelle="${c.libelle('metiers')}">
            ${c.media({ nom: m.image, alt: '', classe: 'roue-media', sizes: '(max-width: 760px) 60vw, 280px' })}
            <span class="roue-num" aria-hidden="true">0${i + 1}</span>
            <strong class="roue-nom">${m.nom}</strong>
            <span class="roue-court">${m.court}</span>
          </a>
        </li>`)}
      </ul>
    </div>
    <div class="roue-commandes">
      <button type="button" class="rond" data-roue-prec aria-label="${c.s('accueil.metiers.precedent')}"><span aria-hidden="true">←</span></button>
      <span class="roue-etat" data-roue-etat aria-live="polite">01 / 06</span>
      <button type="button" class="rond" data-roue-suiv aria-label="${c.s('accueil.metiers.suivant')}"><span aria-hidden="true">→</span></button>
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
      ${c.media({ nom: 'grok/specialite-politique', alt: c.s('specialites.politique.alt'), cadrage: '40% 50%', classe: 'spe-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
      <h3>${c.t('accueil.specialites.politiqueTitre')}</h3>
      <p>${c.t('accueil.specialites.politiqueTexte')}</p>
      ${c.lien('specialites', { ancre: 'politique', classe: 'lien-fleche', texte: c.t('accueil.specialites.voir') })}
    </article>
    <article class="spe spe--tourisme">
      ${c.media({ nom: 'grok/specialite-tourisme', alt: c.s('specialites.tourisme.alt'), cadrage: '55% 55%', classe: 'spe-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
      <h3>${c.t('accueil.specialites.tourismeTitre')}</h3>
      <p>${c.t('accueil.specialites.tourismeTexte')}</p>
      ${c.lien('specialites', { ancre: 'tourisme', classe: 'lien-fleche', texte: c.t('accueil.specialites.voir') })}
    </article>
  </div>
</section>

<section class="reseau" id="reseau" data-fil="gauche">
  <div class="conteneur reseau-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('accueil.reseau.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('accueil.reseau.titre')}</h2>
      <ul class="chiffres-liste" data-anime="cascade">
        <li><strong class="chiffre">2004</strong> <span>${c.t('accueil.reseau.depuis')}</span></li>
        <li><strong class="chiffre" data-compteur="${nbNoms}">${nbNoms}</strong> <span>${c.t('accueil.reseau.noms')}</span></li>
        <li><strong class="chiffre" data-compteur="${refs.length}">${refs.length}</strong> <span>${c.t('accueil.reseau.secteurs')}</span></li>
        <li><strong class="chiffre">${nf(12000)}</strong> <span>${c.t('accueil.reseau.passeport')}</span></li>
      </ul>
      <p>${c.lien('references', { classe: 'bouton bouton--contour', texte: c.t('accueil.reseau.voir'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'grok/references-atelier', alt: c.s('accueil.reseau.alt'), cadrage: '40% 45%', classe: 'reseau-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
  </div>
  <div class="ruban-section">
    <div class="ruban" id="ruban-noms" data-boucle-css data-ruban><p>${refs.flatMap((s) => s.noms.slice(0, 3)).join(' · ')} · ${refs.flatMap((s) => s.noms.slice(0, 3)).join(' · ')} ·</p></div>
    <button type="button" class="ruban-pause" data-pause-pour="ruban-noms" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
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
      ${c.media({ nom: 'grok/accueil-rencontre', alt: c.s('accueil.methode.alt'), cadrage: '55% 55%', classe: 'methode-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
    </div>
    <ol class="etapes" data-anime="cascade">
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
  </div>
</section>

</div>
`;
};
