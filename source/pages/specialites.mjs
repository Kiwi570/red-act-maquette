/* Spécialités : ouverture scindée en deux mondes (la tribune en encre de nuit, la table en grès rose),
   séparés par un fil rouge à faire glisser ; politique et institutionnel (parcours candidat → mandat tracé au fil) ;
   cave en plein écran ; tourisme et gastronomie (titre écrit au fil, vraies références du secteur). */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'specialites', fichier: 'specialites', imagePartage: 'grok/specialite-politique-1168.webp' };

export default (c) => {
  const refs = c.donnees.references;
  const table = refs.filter((s) => s.cle === 'vins' || s.cle === 'gastronomie');
  return html`
<div class="fil-racine" data-grille="fil">

<section class="page-tete tete-spe" id="debut" data-fil="gauche">
  <div class="conteneur tete-spe-texte">
    <div>
      <p class="surtitre tete-suite" data-anime="gsap">${c.t('specialites.tete.surtitre')}</p>
      <h1 class="titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('specialites.tete.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--rouge" data-anime="gsap">${c.t('specialites.tete.titre2')}</span></span></h1>
    </div>
    <div>
      <p class="tete-suite masque-ecran-bas" data-anime="gsap">${c.t('specialites.tete.texte')}</p>
      <p class="hero-actions tete-suite" data-anime="gsap">
        ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('specialites.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <span class="hero-info" data-info-cle>${c.t('specialites.tete.info')}</span>
      </p>
    </div>
  </div>
  <div class="separation" data-separation style="--part:50%">
    <div class="separation-monde separation-monde--table">
      ${c.media({ nom: 'grok/specialites-ouverture-gastronomie', alt: c.s('specialites.tete.altGastronomie'), cadrage: '50% 55%', priorite: true, sizes: '100vw' })}
      <a class="separation-libelle separation-libelle--d" href="#tourisme" data-sans-transition>${c.t('specialites.tete.gastronomie')}</a>
    </div>
    <div class="separation-monde separation-monde--tribune" data-separation-gauche data-effet="separation">
      ${c.media({ nom: 'grok/specialites-ouverture-politique', alt: c.s('specialites.tete.altPolitique'), cadrage: '50% 50%', priorite: true, sizes: '100vw' })}
      <a class="separation-libelle separation-libelle--g" href="#politique" data-sans-transition>${c.t('specialites.tete.politique')}</a>
    </div>
    <div class="separation-fil" data-separation-fil aria-hidden="true"></div>
    <button type="button" class="separation-poignee" role="slider" aria-label="${c.s('specialites.tete.curseur')}" aria-valuemin="15" aria-valuemax="85" aria-valuenow="50" aria-valuetext="50 %" data-separation-poignee data-iris-centre="disque" data-grille="manipuler">
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true"><use href="#noeud"/></svg>
    </button>
    <p class="separation-consigne" aria-hidden="true" data-audit-ignorer>${c.t('specialites.tete.glisser')}</p>
  </div>
</section>

<section class="politique" id="politique" data-fil="droite">
  <div class="conteneur politique-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('specialites.politique.surtitre')}</p>
      <h2 class="politique-titre" data-anime="lettres">${c.t('specialites.politique.titre')}</h2>
      <p data-anime>${c.t('specialites.politique.texte1')}</p>
      <p data-anime>${c.t('specialites.politique.texte2')}</p>
      <p data-anime>${c.lien('contact', { ancre: 'rendez-vous', params: 'besoin=politique', classe: 'bouton', texte: c.t('specialites.politique.action') })}</p>
    </div>
    ${c.media({ nom: 'grok/specialite-politique', alt: c.s('specialites.politique.alt'), cadrage: '40% 50%', classe: 'politique-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="parallaxe"' })}
  </div>
  <div class="conteneur parcours">
    <svg class="parcours-fil" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M10 30 C 140 6, 230 54, 340 30 S 560 6, 670 30 S 880 54, 990 30"/></svg>
    <ol class="parcours-etapes" data-anime="cascade">${c.donnees.listes.etapesPolitique.map((e, i) => html`<li><span class="parcours-noeud" aria-hidden="true"></span><span class="parcours-num">0${i + 1}</span> ${e}</li>`)}</ol>
  </div>
  <div class="conteneur campagne">
    ${c.media({ nom: 'grok/specialites-campagne', alt: c.s('specialites.politique.altCampagne'), cadrage: '30% 50%', classe: 'campagne-media', sizes: '(max-width: 760px) 100vw, 80vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="cave" id="cave" data-fx="plein-ecran" data-plein-ecran>
  <div data-collant>
    ${c.media({ nom: 'grok/specialites-cave', alt: c.s('specialites.cave.alt'), cadrage: '50% 55%', sizes: '100vw' })}
    <p class="alsace-mot alsace-mot--g alsace-mot--clair" data-fx-ecarte="g" aria-hidden="true">${c.t('specialites.cave.gauche')}</p>
    <p class="alsace-mot alsace-mot--d" data-fx-ecarte="d" aria-hidden="true">${c.t('specialites.cave.droite')}</p>
    <h2 class="visuellement-cache">${c.t('specialites.cave.gauche')} ${c.t('specialites.cave.droite')}</h2>
    <p class="alsace-legende" data-fx-apres>${c.t('specialites.cave.legende')}</p>
  </div>
</section>

<section class="tourisme conteneur" id="tourisme" data-fil="gauche">
  <div class="tourisme-tete">
    <p class="surtitre" data-anime>${c.t('specialites.tourisme.surtitre')}</p>
    <h2 class="titre-fil" data-titre-fil data-effet="titre-au-fil" data-grille="typo"><span class="visuellement-cache">${c.t('specialites.tourisme.titre')}</span><svg class="titre-fil-svg" aria-hidden="true" viewBox="0 0 1400 140" preserveAspectRatio="xMinYMid meet"><text x="4" y="108">${c.s('specialites.tourisme.titre')}</text></svg></h2>
    <ul class="pastilles" data-anime="cascade">${c.donnees.listes.domaines.map((d) => html`<li>${d}</li>`)}</ul>
  </div>
  <div class="tourisme-grille">
    ${c.media({ nom: 'grok/specialite-tourisme', alt: c.s('specialites.tourisme.alt'), cadrage: '55% 55%', classe: 'tourisme-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
    <div>
      <p data-anime>${c.t('specialites.tourisme.texte1')}</p>
      <p data-anime>${c.t('specialites.tourisme.texte2')}</p>
      <h3 data-anime>${c.t('specialites.tourisme.clients')}</h3>
      <ul class="clients" data-anime="cascade">${table.flatMap((s) => s.noms).map((n) => html`<li>${n}</li>`)}</ul>
      <p data-anime>${c.lien('contact', { ancre: 'rendez-vous', params: 'besoin=tourisme', classe: 'bouton', texte: c.t('specialites.tourisme.action') })}</p>
    </div>
    ${c.media({ nom: 'grok/specialites-hotellerie', alt: c.s('specialites.tourisme.altTerrasse'), cadrage: '50% 55%', classe: 'tourisme-media tourisme-media--2', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="vitesse" data-fx-force="4"' })}
  </div>
</section>

<section class="fin fin--simple conteneur" id="fin" data-fil="droite">
  ${c.media({ nom: 'grok/accueil-rencontre', alt: c.s('accueil.methode.alt'), cadrage: '55% 55%', classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="zoom"' })}
  <div>
    <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('specialites.fin.titre')}</h2>
    <p data-anime>${c.t('specialites.fin.texte')}</p>
    <p class="fin-actions" data-anime>${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('specialites.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

</div>
`;
};
