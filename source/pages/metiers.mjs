/* Métiers : ouverture « Six métiers, une seule plume » sur un bandeau de brouillons recouvert d'une feuille
   qui se raye au défilement ; scène du métier « Du brouillon au texte » (jargon barré au rouge puis réécrit,
   feuille collante qui suit la lecture) ; pour qui ; du print au digital. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'metiers', fichier: 'metiers', imagePartage: 'grok/metiers-ouverture-1168.webp' };

export default (c) => {
  const metiers = c.donnees.metiers;
  return html`
<div class="fil-racine" data-grille="fil">

<section class="page-tete tete-metiers" id="debut" data-fil="gauche">
  <div class="conteneur tete-metiers-texte">
    <p class="surtitre tete-suite" data-anime="gsap">${c.t('metiers.tete.surtitre')}</p>
    <h1 class="tete-geant titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('metiers.tete.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--rouge" data-anime="gsap">${c.t('metiers.tete.titre2')}</span></span></h1>
    <div class="tete-metiers-bas">
      <p class="tete-suite masque-ecran-tres-bas" data-anime="gsap">${c.t('metiers.tete.texte')}</p>
      <p class="hero-actions tete-suite" data-anime="gsap">
        ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('metiers.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <span class="hero-info" data-info-cle>${c.t('metiers.tete.info')}</span>
      </p>
    </div>
  </div>
  <div class="bandeau-brouillon" data-iris-centre>
    ${c.media({ nom: 'grok/metiers-ouverture', alt: c.s('metiers.tete.alt'), cadrage: '50% 50%', cadrageMobile: '50% 60%', priorite: true, classe: 'bandeau-media', sizes: '100vw' })}
    <div class="feuille" data-effet="feuille-brouillon" aria-hidden="true" data-visuel data-audit-ignorer data-superpose>
      <span class="feuille-titre">${c.t('metiers.tete.feuille')}</span>
      ${metiers.map((m) => html`<span class="feuille-ligne"><s>${m.brouillon}</s></span>`)}
    </div>
  </div>
</section>

<section class="brouillon" id="scene" data-scene data-grille="scene" data-fil="droite">
  <div class="conteneur brouillon-tete">
    <p class="surtitre" data-anime>${c.t('metiers.scene.surtitre')}</p>
    <h2 class="titre-souple" data-axe data-anime="lettres">${c.t('metiers.scene.titre')}</h2>
    <p data-anime>${c.t('metiers.scene.texte')}</p>
  </div>
  <div class="conteneur brouillon-grille">
    <div class="brouillon-feuille-cadre" data-collant>
      <div class="brouillon-feuille" data-feuille data-effet="rature" data-grille="typo manipuler" aria-hidden="true" data-visuel>
        <span class="feuille-num" data-feuille-num>01</span>
        <span class="feuille-nom" data-feuille-nom>${metiers[0].nom}</span>
        <span class="feuille-jargon" data-rayer><span data-feuille-jargon>${metiers[0].brouillon}</span><svg class="rature" viewBox="0 0 400 24" preserveAspectRatio="none"><path d="M4 14 C 80 6, 160 20, 240 10 S 360 6, 396 14"/></svg></span>
        <span class="feuille-consigne"><span class="sur-souris">${c.t('metiers.scene.rayer')}</span><span class="sur-tactile">${c.t('metiers.scene.rayerTactile')}</span> <span aria-hidden="true">→</span></span>
        <span class="feuille-clair" data-feuille-clair>${metiers[0].clair}</span>
      </div>
    </div>
    <ol class="brouillon-liste">
      ${metiers.map((m, i) => html`<li class="metier" id="${m.cle}" data-metier="${i}" data-metier-nom="${m.nom}" data-metier-jargon="${m.brouillon}" data-metier-clair="${m.clair}">
        ${c.media({ nom: m.image, alt: m.alt, classe: 'metier-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
        <p class="metier-num" aria-hidden="true">0${i + 1}</p>
        <h3>${m.nom}</h3>
        <p class="metier-rature" data-rayer-ligne><span class="visuellement-cache">${c.t('metiers.scene.barre')}</span><s>${m.brouillon}</s></p>
        <p class="metier-clair">${m.clair}</p>
        <p>${m.texte}</p>
        ${c.lien('contact', { ancre: 'rendez-vous', params: 'besoin=' + m.cle, classe: 'lien-fleche', texte: html`${c.t('metiers.scene.demander')}<span class="visuellement-cache"> : ${m.nom}</span>` })}
      </li>`)}
    </ol>
  </div>
</section>

<section class="pourqui" id="pour-qui" data-fil="gauche">
  <div class="conteneur pourqui-grille">
    ${c.media({ nom: 'grok/metiers-pour-qui', alt: c.s('metiers.pourqui.alt'), cadrage: '45% 55%', classe: 'pourqui-media', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-fx="vitesse" data-fx-force="3"' })}
    <div>
      <p class="surtitre" data-anime>${c.t('metiers.pourqui.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('metiers.pourqui.titre')}</h2>
      <p data-anime>${c.t('metiers.pourqui.texte')}</p>
      <ul class="pastilles" data-anime="cascade">${c.donnees.listes.publics.map((p) => html`<li>${p}</li>`)}</ul>
    </div>
  </div>
</section>

<section class="supports" id="supports" data-fil="droite">
  <div class="mots-geants mots-geants--fin" data-fx="mots-geants" aria-hidden="true" data-ruban data-visuel data-audit-ignorer>
    <p data-fx-rangee>${c.t('metiers.supports.mots')} ${c.t('metiers.supports.mots')} ${c.t('metiers.supports.mots')}</p>
  </div>
  <div class="conteneur supports-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('metiers.supports.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('metiers.supports.titre')}</h2>
      <p data-anime>${c.t('metiers.supports.texte')}</p>
      <ul class="liste-fil" data-anime="cascade">${c.donnees.listes.supports.map((s) => html`<li>${s}</li>`)}</ul>
    </div>
    ${c.media({ nom: 'grok/contact-lettre', alt: c.s('accueil.fin.alt'), cadrage: '60% 50%', classe: 'supports-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
  </div>
</section>

<section class="fin fin--simple conteneur" id="fin" data-fil="gauche">
  ${c.media({ nom: 'grok/accueil-rencontre', alt: c.s('accueil.methode.alt'), cadrage: '55% 55%', classe: 'fin-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
  <div>
    <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('metiers.fin.titre')}</h2>
    <p data-anime>${c.t('metiers.fin.texte')}</p>
    <p class="fin-actions" data-anime>${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('metiers.fin.action'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

</div>
`;
};

