/* Parcours propres à Red-Act : filtres des références (sélection dans l'adresse), rendez-vous en trois étapes
   (choix prérempli, envoi qui devient le nœud « Vous »), six métiers en épreuves au fil (flèches), séparation des Spécialités (clavier).
   Chaque problème s'ajoute au rapport : R.echec(controle, detail, { page, taille, selecteur }). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  for (const nomTaille of ['390×844', '1366×768']) {
    const taille = T(nomTaille);

    /* Références : un secteur choisi éteint les autres et se garde dans l'adresse. */
    {
      const { ctx, page } = await contexte({ taille });
      try {
        await page.goto(BASE + '/references', { waitUntil: 'load' });
        await attendrePret(page);
        await page.locator('[data-filtre="vins"]').click();
        await attendre(400);
        const r = await page.evaluate(() => ({
          url: location.search,
          presse: document.querySelector('[data-filtre="vins"]').getAttribute('aria-pressed'),
          eteints: document.querySelectorAll('.secteur.est-eteint').length,
          vins: document.querySelector('[data-secteur="vins"]').classList.contains('est-eteint'),
        }));
        if (!/secteur=vins/.test(r.url)) R.echec('filtres', 'le secteur choisi n’est pas gardé dans l’adresse', { page: '/references', taille: nomTaille });
        if (r.presse !== 'true' || r.eteints !== 9 || r.vins) R.echec('filtres', `filtre « Vins » mal appliqué (${r.eteints} secteurs éteints)`, { page: '/references', taille: nomTaille });
        await page.goto(BASE + '/references?secteur=presse', { waitUntil: 'load' });
        await attendrePret(page);
        const p = await page.evaluate(() => document.querySelector('[data-filtre="presse"]').getAttribute('aria-pressed'));
        if (p !== 'true') R.echec('filtres', 'une adresse avec ?secteur= n’ouvre pas la sélection', { page: '/references', taille: nomTaille });
      } finally { await ctx.close(); }
    }

    /* Contact : bouton contextuel → étape 2 avec le besoin choisi ; envoi → nœud « Vous » ; double clic sans double envoi. */
    {
      const { ctx, page } = await contexte({ taille });
      try {
        await page.goto(BASE + '/contact?besoin=audit', { waitUntil: 'load' });
        await attendrePret(page);
        const depart = await page.evaluate(() => ({
          etape: [...document.querySelectorAll('[data-etape]')].findIndex((e) => !e.hidden) + 1,
          besoin: (document.querySelector('[name="besoin"]:checked') || {}).value,
        }));
        if (depart.etape !== 2 || depart.besoin !== 'audit') R.echec('rendez-vous', `choix prérempli mal appliqué (étape ${depart.etape}, besoin ${depart.besoin})`, { page: '/contact', taille: nomTaille });
        await page.locator('[data-etape-suiv]').click();
        await attendre(300);
        const erreur = await page.isVisible('[data-etape="2"] [data-erreur-etape]');
        if (!erreur) R.echec('rendez-vous', 'aucune erreur quand on passe l’étape 2 sans choisir', { page: '/contact', taille: nomTaille });
        await page.locator('[data-etape="2"] label.choix').first().click();
        await page.locator('[data-etape-suiv]').click();
        await attendre(500);
        await page.fill('#f-nom', 'Essai Audit');
        await page.fill('#f-email', 'pas-une-adresse');
        await page.fill('#f-tel', '06 12 34 56 78');
        await page.locator('[data-envoi]').click();
        await attendre(300);
        const invalide = await page.evaluate(() => document.querySelector('#f-email').getAttribute('aria-invalid'));
        if (invalide !== 'true') R.echec('rendez-vous', 'une adresse e-mail invalide n’est pas signalée', { page: '/contact', taille: nomTaille });
        await page.fill('#f-email', 'essai@exemple.fr');
        await page.locator('[data-envoi]').dblclick();
        await attendre(2600);
        const fin = await page.evaluate(() => ({
          desactive: document.querySelector('[data-envoi]').disabled,
          noue: !document.querySelector('[data-message-noue]').hidden,
          simule: !document.querySelector('[data-message-envoi]').hidden,
          recap: document.querySelector('[data-recap-liste]').textContent,
        }));
        if (!fin.desactive) R.echec('rendez-vous', 'le bouton d’envoi reste actif (double envoi possible)', { page: '/contact', taille: nomTaille });
        if (!fin.noue || !fin.simule) R.echec('rendez-vous', 'pas de message après l’envoi simulé', { page: '/contact', taille: nomTaille });
        if (!/Audit en communication/.test(fin.recap) || !/Essai Audit/.test(fin.recap)) R.echec('rendez-vous', 'récapitulatif incomplet', { page: '/contact', taille: nomTaille });
      } finally { await ctx.close(); }
    }

    /* Accueil : les flèches font glisser le fil des six métiers. */
    {
      const { ctx, page } = await contexte({ taille });
      try {
        await page.goto(BASE + '/#metiers', { waitUntil: 'load' });
        await attendrePret(page);
        await attendre(600);
        const avant = await page.textContent('[data-epreuves-etat]');
        await page.locator('[data-epreuves-suiv]').click();
        await attendre(900);
        const apres = await page.textContent('[data-epreuves-etat]');
        if (avant === apres) R.echec('épreuves', `la flèche « suivant » ne change pas de métier (${avant})`, { page: '/', taille: nomTaille });
      } finally { await ctx.close(); }
    }

    /* Spécialités : la séparation se règle au clavier (rôle slider). */
    {
      const { ctx, page } = await contexte({ taille });
      try {
        await page.goto(BASE + '/specialites', { waitUntil: 'load' });
        await attendrePret(page);
        await page.locator('[data-separation-poignee]').focus();
        const v0 = await page.getAttribute('[data-separation-poignee]', 'aria-valuenow');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        await attendre(200);
        const v1 = await page.getAttribute('[data-separation-poignee]', 'aria-valuenow');
        if (!(+v1 < +v0)) R.echec('separation', `la flèche gauche ne déplace pas la séparation (${v0} → ${v1})`, { page: '/specialites', taille: nomTaille });
      } finally { await ctx.close(); }
    }
  }
  R.ok('parcours du projet');
}
