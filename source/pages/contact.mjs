/* Contact : ouverture en carte de visite nouée par le fil rouge, posée sur la rue (numéro en très grand), demande de rendez-vous
   en trois étapes (besoin, profil, coordonnées) avec récapitulatif et petit filet : à l'envoi, la fiche se plie,
   un fil la noue et elle file jusqu'au filet, où elle devient le nœud « Vous » (retour physique de l'action).
   Carte schématique du Grand-Est. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-lettre-1168.webp' };

export default (c) => {
  const metiers = c.donnees.metiers;
  const L = c.donnees.listes;
  const besoins = [
    ...metiers.map((m) => ({ v: m.cle, t: m.nom })),
    { v: 'politique', t: c.s('contact.rdv.politique') },
    { v: 'tourisme', t: c.s('contact.rdv.tourisme') },
    { v: 'documentation', t: c.s('contact.rdv.documentation') },
    { v: 'autre', t: c.s('contact.rdv.autre') },
  ];
  return html`
<div class="fil-racine" data-grille="fil">

<section class="tete-contact tete-contact--carte" id="debut" data-fil="gauche">
  <div class="contact-fond">
    ${c.media({ nom: 'grok/contact-rue', alt: c.s('contact.tete.alt'), cadrage: '40% 45%', cadrageMobile: '50% 40%', priorite: true, classe: 'contact-fond-media', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  </div>
  <svg class="contact-fil" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true" data-effet="fil-carte"><path d="M-10 120 C 180 60 320 170 520 96 S 820 40 1010 110"/></svg>
  <div class="conteneur contact-scene">
    <article class="carte-visite" aria-label="${c.s('contact.tete.carte')}" data-effet="carte-nouee">
      <span class="carte-noeud" data-iris-centre="disque" aria-hidden="true"><svg viewBox="0 0 64 64" width="40" height="40"><use href="#noeud"/></svg></span>
      <p class="surtitre tete-suite" data-anime="gsap">${c.t('contact.tete.surtitre')}</p>
      <h1 class="titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('contact.tete.titre')}</span></span></h1>
      <p class="tete-suite masque-ecran-bas" data-anime="gsap">${c.t('contact.tete.texte')}</p>
      <p class="tete-suite" data-anime="gsap"><a class="numero" href="tel:${c.site.contact.telephoneLien}" data-action-principale>${c.site.contact.telephone}</a></p>
      <p class="hero-info tete-suite" data-anime="gsap" data-info-cle>${c.t('contact.tete.info')}</p>
      <p class="tete-contact-liens tete-suite" data-anime="gsap"><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a><a class="lien-fleche" href="#rendez-vous" data-sans-transition>${c.t('contact.tete.rdv')}</a></p>
    </article>
  </div>
</section>

<section class="rdv conteneur" id="rendez-vous" data-fil="droite">
  <div class="rdv-tete">
    <p class="surtitre" data-anime>${c.t('contact.rdv.surtitre')}</p>
    <h2 class="titre-fil" data-titre-fil data-effet="titre-au-fil" data-grille="typo"><span class="visuellement-cache">${c.t('contact.rdv.titre')}</span><svg class="titre-fil-svg" aria-hidden="true" viewBox="0 0 1500 140" preserveAspectRatio="xMinYMid meet"><text x="4" y="108">${c.s('contact.rdv.titre')}</text></svg></h2>
    <p data-anime>${c.t('contact.rdv.deroule')}</p>
  </div>
  <div class="rdv-grille">
    <form class="formulaire" data-formulaire data-etapes action="#" method="post" aria-describedby="rdv-etape">
      <ol class="etapes-barre" aria-hidden="true">
        <li data-etape-pastille="1" class="est-active"><span>1</span> ${c.t('contact.rdv.e1')}</li>
        <li data-etape-pastille="2"><span>2</span> ${c.t('contact.rdv.e2')}</li>
        <li data-etape-pastille="3"><span>3</span> ${c.t('contact.rdv.e3')}</li>
      </ol>
      <p class="visuellement-cache" id="rdv-etape" aria-live="polite" data-etape-annonce>${c.t('contact.rdv.e1')}</p>
      <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape-form" data-etape="1">
          <legend>${c.t('contact.rdv.besoinLegende')}</legend>
          <div class="choix-grille">${besoins.map((b, i) => html`<label class="choix"><input type="radio" name="besoin" value="${b.v}"${i === 0 ? ' required' : ''} data-recap="${b.t}"><span>${b.t}</span></label>`)}</div>
          <p class="champ-erreur" data-erreur-etape hidden>${c.t('contact.rdv.erreurChoix')}</p>
        </fieldset>
        <fieldset class="etape-form" data-etape="2" hidden>
          <legend>${c.t('contact.rdv.profilLegende')}</legend>
          <div class="choix-grille">${L.profils.map((p, i) => html`<label class="choix"><input type="radio" name="profil" value="${p}"${i === 0 ? ' required' : ''} data-recap="${p}"><span>${p}</span></label>`)}</div>
          <p class="champ-erreur" data-erreur-etape hidden>${c.t('contact.rdv.erreurChoix')}</p>
        </fieldset>
        <fieldset class="etape-form" data-etape="3" hidden>
          <legend>${c.t('contact.rdv.e3')}</legend>
          <div class="champs">
            <p class="champ"><label for="f-nom">${c.t('contact.rdv.nom')}</label><input id="f-nom" name="nom" autocomplete="name" required data-recap-champ></p>
            <p class="champ"><label for="f-structure">${c.t('contact.rdv.structure')}</label><input id="f-structure" name="structure" autocomplete="organization" data-recap-champ></p>
            <p class="champ"><label for="f-email">${c.t('contact.rdv.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" required data-recap-champ></p>
            <p class="champ"><label for="f-tel">${c.t('contact.rdv.telephone')}</label><input id="f-tel" name="telephone" type="tel" autocomplete="tel" required data-recap-champ></p>
            <p class="champ champ--large"><label for="f-creneau">${c.t('contact.rdv.creneau')}</label><select id="f-creneau" name="creneau">${L.creneaux.map((x) => html`<option>${x}</option>`)}</select></p>
            <p class="champ champ--large"><label for="f-message">${c.t('contact.rdv.message')}</label><textarea id="f-message" name="message" rows="3"></textarea></p>
          </div>
          <p class="rgpd">${c.t('contact.rdv.rgpd')}</p>
        </fieldset>
      </div>
      <div class="formulaire-actions">
        <button type="button" class="bouton bouton--contour" data-etape-prec hidden>${c.t('contact.rdv.precedent')}</button>
        <button type="button" class="bouton" data-etape-suiv>${c.t('contact.rdv.suivant')}</button>
        <button type="submit" class="bouton" data-grille="retour" data-envoi hidden>${c.t('contact.rdv.envoyer')}</button>
      </div>
      <p class="message-envoi" data-message-envoi data-texte="${c.s('contact.rdv.simule')}" tabindex="-1" hidden></p>
      <p class="message-noue" data-message-noue hidden>${c.t('contact.rdv.noue')} <button type="button" class="lien" data-recommencer>${c.t('contact.rdv.recommencer')}</button></p>
    </form>
    <aside class="recap" data-collant>
      <h3>${c.t('contact.rdv.recap')}</h3>
      <dl class="recap-liste" data-recap-liste><div><dt class="visuellement-cache">${c.t('contact.rdv.e1')}</dt><dd>${c.t('contact.rdv.recapVide')}</dd></div></dl>
      <div class="recap-filet" data-effet="noeud-vous" data-visuel>
        <canvas class="filet" data-filet="" aria-hidden="true" data-audit-ignorer></canvas>
        <span class="filet-noeud filet-noeud--petit" aria-hidden="true"><svg viewBox="0 0 64 64" width="30" height="30"><use href="#noeud"/></svg></span>
      </div>
    </aside>
  </div>
</section>

<section class="acces" id="acces" data-fil="gauche">
  <div class="mots-geants mots-geants--acces" data-fx="mots-geants" aria-hidden="true" data-ruban data-visuel data-audit-ignorer>
    <p data-fx-rangee>${c.t('contact.acces.mots')} ${c.t('contact.acces.mots')} ${c.t('contact.acces.mots')}</p>
  </div>
  <div class="conteneur acces-grille">
    <div>
      <p class="surtitre" data-anime>${c.t('contact.acces.surtitre')}</p>
      <h2 class="titre-souple" data-axe data-anime="lignes">${c.t('contact.acces.titre')}</h2>
      <p data-anime>${c.t('contact.acces.texte')}</p>
      <p data-anime>${c.site.contact.adresse}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p class="mention" data-anime>${c.t('contact.tete.horaires')}</p>
    </div>
    <figure class="carte" data-visuel>
      <svg viewBox="0 0 600 520" role="img" aria-label="${c.s('contact.acces.carte')}" data-fx="trace">
        <path class="carte-region" d="M120 40 L 330 30 L 420 70 L 470 60 L 520 120 L 500 220 L 470 330 L 455 470 L 380 500 L 330 430 L 250 400 L 160 420 L 90 360 L 60 250 L 80 140 Z"/>
        <path class="carte-rhin" data-fx-trait d="M520 120 C 505 170 495 200 488 240 S 470 330 462 380 S 455 450 455 470"/>
        <path class="carte-fil" data-fx-trait d="M168 150 C 240 170 300 200 362 214 M 205 228 C 260 230 320 222 362 214 M 362 214 C 380 260 400 300 410 330 M 410 330 C 420 380 430 410 438 430"/>
        <g class="carte-villes">
          <circle cx="168" cy="150" r="6"/><text x="150" y="138" text-anchor="end">${c.s('contact.acces.metz')}</text>
          <circle cx="205" cy="228" r="6"/><text x="190" y="248" text-anchor="end">${c.s('contact.acces.nancy')}</text>
          <circle cx="410" cy="330" r="6"/><text x="396" y="336" text-anchor="end">${c.s('contact.acces.colmar')}</text>
          <circle cx="438" cy="430" r="6"/><text x="424" y="436" text-anchor="end">${c.s('contact.acces.mulhouse')}</text>
          <circle cx="362" cy="214" r="8" class="carte-strasbourg"/><text x="346" y="240" text-anchor="end" class="carte-fort">${c.s('contact.acces.strasbourg')}</text>
          <circle cx="370" cy="196" r="7" class="carte-hoenheim"/><text x="384" y="186" class="carte-fort carte-rouge">${c.s('contact.acces.hoenheim')}</text>
          <text x="500" y="300" class="carte-rhin-nom" transform="rotate(80 500 300)">${c.s('contact.acces.rhin')}</text>
        </g>
      </svg>
      <figcaption>${c.t('contact.acces.illustratif')}</figcaption>
    </figure>
  </div>
</section>

</div>
`;
};
