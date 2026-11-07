/* Page 404 : le fil est coupé. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', partage: false };

export default (c) => html`
<section class="introuvable conteneur" id="debut">
  <div class="introuvable-texte">
    <p class="surtitre tete-suite" data-anime="gsap">404</p>
    <h1 class="titre-souple" data-axe><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('introuvable.titre')}</span></span></h1>
    <p class="tete-suite" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p class="tete-suite" data-anime="gsap">${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}</p>
    <p class="tete-suite" data-anime="gsap" data-info-cle>${c.site.contact.telephone} · ${c.site.contact.email}</p>
  </div>
  ${c.media({ nom: 'grok/page-404', alt: c.s('introuvable.alt'), priorite: true, cadrage: '45% 55%', classe: 'introuvable-media', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-iris-centre data-fx="zoom"' })}
</section>
`;
