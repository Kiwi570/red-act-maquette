# Rapport d’audit

Projet : `red-act-maquette` · 07/11/2026 22:30:31 · 14 min · 3 page(s) · audit standard ciblé sur /,/specialites,/contact

## Résumé

- Échecs : **0**
- À regarder : **1**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (42), balayage (3), films d’ouverture (6), films de transition (6), bords de l’écran (4), intro accélérable et passable (7), menu (1), clavier (3), liens et boutons (3), liens profonds (16), liens vers la page en cours (3), changements de hauteur (3), mode calme (6), bouton du mode calme (2), parcours du projet (2), tient dans l’écran (10), fluidité (6), défilement selon l’appareil (5), mouvement (6), effets du plan (10), souris immobile (3), vitesse (3), captures (1)

## Grille wouahou

| Point | État | Détail |
|---|---|---|
| 1. L’effet signature se manipule | ✓ présent | accueil et 3 autre(s) page(s) |
| 2. L’intro devient la page | ✓ présent | objet d’ouverture sur 5 page(s), versObjet dans l’intro |
| 3. La transition reprend le motif | ✓ présent | voile en trame |
| 4. Un fil conducteur traverse le site | ✓ présent | sur les 5 page(s) |
| 5. La typographie bouge aussi | ✓ présent | sur les 5 page(s) |
| 6. Les scènes épinglées sont des gestes du métier | ✓ présent | geste du métier sur /metiers |
| 7. L’action principale a un retour physique | ✓ présent | sur /contact |

Le script vérifie les marques (`data-grille`, `data-iris-centre`, forme du voile, `versObjet`) ; la force et la justesse de chaque point se jugent sur les captures et les films.

## Échecs

Aucun.

## À regarder

### fluidité (1)

- **fluidité** — `/` — 3 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=2
- Journal v2 : 1 étape(s) notée(s), 4 min de travail pour 40 min de budget, 0 min d’attente de l’utilisateur.
- Audit standard : étapes lourdes sur /, /contact, /specialites.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2777 ms depuis le premier octet
- Ouverture /contact (1366×768) : 2839 ms depuis le premier octet
- film de l'ouverture /contact 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /specialites (1366×768) : 2717 ms depuis le premier octet
- Ouverture / (390×844) : 2753 ms depuis le premier octet
- Ouverture /contact (390×844) : 2846 ms depuis le premier octet
- Ouverture /specialites (390×844) : 2727 ms depuis le premier octet
- Bords de l’écran : 337 images d’intro, 6 de voile et 91 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /contact : aucune section épinglée ou plein écran.
- Fluidité /contact 1366×768 (molette) : 0 % d'images lentes sur 179, tâche la plus longue 0 ms
- Fluidité /specialites 1366×768 (molette) : 2 % d'images lentes sur 312, tâche la plus longue 56 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1452, tâche la plus longue 0 ms
- Fluidité /contact 390×844 (doigt) : 0 % d'images lentes sur 1350, tâche la plus longue 0 ms
- Fluidité /specialites 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Vitesse / : 0.61 s de calcul au chargement (téléphone ralenti).
- Vitesse /contact : 0.43 s de calcul au chargement (téléphone ralenti).
- Vitesse /specialites : 0.38 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
