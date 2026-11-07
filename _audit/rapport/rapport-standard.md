# Rapport d’audit

Projet : `red-act-maquette` · 07/11/2026 21:19:45 · 21 min · 6 page(s) · audit standard

## Résumé

- Échecs : **2**
- À regarder : **2**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (84), balayage (5), films d’ouverture (10), films de transition (10), bords de l’écran (6), intro accélérable et passable (7), menu (1), clavier (6), liens et boutons (6), liens profonds (16), liens vers la page en cours (5), changements de hauteur (5), mode calme (10), bouton du mode calme (2), parcours du projet (2), tient dans l’écran (10), fluidité (10), défilement selon l’appareil (5), mouvement (10), effets du plan (10), souris immobile (6), vitesse (5), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil et 2 autre(s) page(s) |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 5 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en trame |
| 4. Un fil conducteur traverse le site | ✓ présent | sur les 5 page(s) |
| 5. La typographie bouge aussi | ✓ présent | sur les 5 page(s) |
| 6. Les scènes épinglées sont des gestes du métier | ✓ présent | geste du métier sur /metiers |
| 7. L’action principale a un retour physique | ✓ présent | sur /contact |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

### texte coupé (1)

- **texte coupé** — `/` — li.roue-carte:nth-of-type(6) > a > figure.media.roue-media > figcaption.mention-ia « Illustration générée » — coupé par ul.roue-anneau > li.roue-carte:nth-of-type(6) > a > figure.media.roue-media « Illustration générée » _(844×390 normal)_

### section sans visuel (1)

- **section sans visuel** — `/` — section#metiers « Un seul interlocuteur, six métiers Illustration gé » _(844×390 normal)_

## À regarder

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/references` — écran différent à la même position après rechargement (8.1 %), voir comparaisons/rechargement-references-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/references` — 4 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=1
- Journal v1 : 5 étape(s) notée(s), 35 min de travail pour 95 min de budget, 10 min d’attente de l’utilisateur.
- Audit standard : étapes lourdes sur /, /contact, /metiers, /references, /specialites.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2725 ms depuis le premier octet
- Ouverture /contact (1366×768) : 2660 ms depuis le premier octet
- Ouverture /metiers (1366×768) : 2694 ms depuis le premier octet
- Ouverture /references (1366×768) : 2722 ms depuis le premier octet
- Ouverture /specialites (1366×768) : 2761 ms depuis le premier octet
- Ouverture / (390×844) : 2719 ms depuis le premier octet
- Ouverture /contact (390×844) : 2643 ms depuis le premier octet
- film de l'ouverture /contact 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /metiers (390×844) : 2717 ms depuis le premier octet
- film de l'ouverture /metiers 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /references (390×844) : 2673 ms depuis le premier octet
- Ouverture /specialites (390×844) : 2750 ms depuis le premier octet
- film de l'ouverture /specialites 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 533 images d’intro, 13 de voile et 134 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /contact : aucune section épinglée ou plein écran.
- Tient dans l'écran /metiers : aucune section épinglée ou plein écran.
- Tient dans l'écran /references : aucune section épinglée ou plein écran.
- Fluidité / 1366×768 (molette) : 2 % d'images lentes sur 461, tâche la plus longue 61 ms
- Fluidité /contact 1366×768 (molette) : 0 % d'images lentes sur 186, tâche la plus longue 0 ms
- Fluidité /metiers 1366×768 (molette) : 1 % d'images lentes sur 383, tâche la plus longue 60 ms
- Fluidité /specialites 1366×768 (molette) : 0 % d'images lentes sur 332, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1442, tâche la plus longue 0 ms
- Fluidité /contact 390×844 (doigt) : 0 % d'images lentes sur 1338, tâche la plus longue 0 ms
- Fluidité /metiers 390×844 (doigt) : 0 % d'images lentes sur 1344, tâche la plus longue 0 ms
- Fluidité /references 390×844 (doigt) : 0 % d'images lentes sur 1436, tâche la plus longue 0 ms
- Fluidité /specialites 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Vitesse / : 0.84 s de calcul au chargement (téléphone ralenti).
- Vitesse /contact : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /metiers : 0.46 s de calcul au chargement (téléphone ralenti).
- Vitesse /references : 0.50 s de calcul au chargement (téléphone ralenti).
- Vitesse /specialites : 0.48 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --pages=/ --seulement=fichiers,mesures
```
