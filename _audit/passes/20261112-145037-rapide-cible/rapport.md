# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 16:08:56 · 18 min · 5 page(s) · audit RAPIDE : ne vaut pas pour une livraison ciblé sur /,/metiers,/specialites,/references,/contact

## Résumé

- Statut : **5 échec(s)**
- Passe : `20261112-145037-rapide-cible` · version ?v=3
- Échecs : **5**
- À regarder : **7**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (35), films d’ouverture (10), films de transition (10), bords de l’écran (5), intro accélérable et passable (7), menu (1), clavier (5), liens et boutons (5), liens profonds (16), liens vers la page en cours (5), changements de hauteur (5), mode calme (10), bouton du mode calme (2), parcours du projet (2), tient dans l’écran (2), fluidité (10), défilement selon l’appareil (5), mouvement (10), effets du plan (11), souris immobile (6), vitesse (5), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil et 3 autre(s) page(s) |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 5 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en trame |
| 4. Quelque chose relie les sections et les pages | ✓ présent | sur les 5 page(s) |
| 5. Un titre fait l’événement sur chaque page | ✓ présent | sur les 5 page(s) |
| 6. La scène est un geste du métier | ✓ présent | geste du métier sur /metiers |
| 7. L’action principale a un retour physique | ✓ présent | sur /contact |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

### premier écran : information clé hors de l’écran (1)

- **premier écran : information clé hors de l’écran** — `/` — div.hero-texte:nth-of-type(1) > p.hero-signature.tete-suite:nth-of-type(4) > span:nth-of-type(2) > span.hero-info « Indépendant depuis 2004 · Strasbourg et Alsace » _(320×568 sansJs)_

### fluidité (4)

- **fluidité** — `/` — 40 % d'images de plus de 50 ms, tâche la plus longue 418 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/metiers` — 17 % d'images de plus de 50 ms, tâche la plus longue 219 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/references` — 14 % d'images de plus de 50 ms, tâche la plus longue 253 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/specialites` — 16 % d'images de plus de 50 ms, tâche la plus longue 229 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### grille : objet d’ouverture hors du premier écran (1)

- **grille : objet d’ouverture hors du premier écran** — `/` — 72 × 35 px visibles : l’intro et le voile s’ouvrent depuis le centre de l’écran à cette taille _(390×844)_

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/metiers` — à 63 ms (différence 21 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_

### rechargement au milieu de la page (2)

- **rechargement au milieu de la page** — `/` — écran différent à la même position après rechargement (4.3 %), voir comparaisons/rechargement-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/references` — écran différent à la même position après rechargement (7.2 %), voir comparaisons/rechargement-references-*.png _(1366×768)_

### fluidité (2)

- **fluidité** — `/contact` — 7 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/references` — 8 % d'images de plus de 50 ms _(390×844 défilement au doigt, processeur ralenti 4 fois)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=3
- Journal v3 : 0 étape(s) notée(s), 0 min de travail, 0 min d’attente de l’utilisateur.
- Audit rapide : étapes lourdes sur /, /contact, /metiers, /references, /specialites.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Balayage des largeurs : non fait en audit rapide.
- Ouverture / (1366×768) : 2387 ms depuis le premier octet
- Ouverture /contact (1366×768) : 2378 ms depuis le premier octet
- Ouverture /metiers (1366×768) : 2365 ms depuis le premier octet
- Ouverture /references (1366×768) : 2325 ms depuis le premier octet
- Ouverture /specialites (1366×768) : 2366 ms depuis le premier octet
- Ouverture / (390×844) : 2383 ms depuis le premier octet
- Ouverture /contact (390×844) : 2418 ms depuis le premier octet
- Ouverture /metiers (390×844) : 2355 ms depuis le premier octet
- Ouverture /references (390×844) : 2325 ms depuis le premier octet
- Ouverture /specialites (390×844) : 2351 ms depuis le premier octet
- film de l'ouverture /specialites 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- bords de l’écran /contact 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 396 images d’intro, 10 de voile et 111 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Tient dans l'écran /contact : aucune section épinglée ou plein écran.
- Tient dans l'écran /metiers : aucune section épinglée ou plein écran.
- Tient dans l'écran /references : aucune section épinglée ou plein écran.
- Fluidité / 390×844 (doigt) : 1 % d'images lentes sur 1273, tâche la plus longue 98 ms
- Fluidité /contact 390×844 (doigt) : 0 % d'images lentes sur 1341, tâche la plus longue 0 ms
- Fluidité /metiers 390×844 (doigt) : 0 % d'images lentes sur 1326, tâche la plus longue 0 ms
- Fluidité /specialites 390×844 (doigt) : 1 % d'images lentes sur 1310, tâche la plus longue 72 ms
- Vitesse / : 0.71 s de calcul au chargement (téléphone ralenti).
- Vitesse /contact : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /metiers : 0.56 s de calcul au chargement (téléphone ralenti).
- Vitesse /references : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /specialites : 0.48 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --rapide --pages=/,/metiers,/references,/specialites --seulement=fichiers,mesures,fluidite
```
