# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 17:26:09 · 19 min · 6 page(s) · audit standard

## Résumé

- Statut : **INCOMPLET : 1 contrôle(s) requis n’ont pas tourné (voir « Non lancé ») ; ne vaut pas pour une livraison**
- Passe : `20261112-160641-standard` · version ?v=4
- Échecs : **0**
- À regarder : **5**
- Non lancé : **2**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (84), balayage (5), films d’ouverture (10), films de transition (10), bords de l’écran (6), intro accélérable et passable (7), menu (1), clavier (6), liens et boutons (6), liens profonds (16), liens vers la page en cours (5), changements de hauteur (5), mode calme (10), bouton du mode calme (2), tient dans l’écran (5), fluidité (10), défilement selon l’appareil (5), mouvement (10), effets du plan (11), souris immobile (6), vitesse (5), captures (1)

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

Aucun.

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/metiers` — à 80 ms (différence 22 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/references` — écran différent à la même position après rechargement (7.0 %), voir comparaisons/rechargement-references-*.png _(1366×768)_

### fluidité (2)

- **fluidité** — `/` — 3 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_
- **fluidité** — `/references` — 4 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

- **parcours:projet** : page.textContent: Timeout 30000ms exceeded.
- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=4
- Journal v4 : 1 étape(s) notée(s), 13 min de travail pour 40 min de budget, 2 min d’attente de l’utilisateur.
- Audit standard : étapes lourdes sur /, /contact, /metiers, /references, /specialites.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2373 ms depuis le premier octet
- Ouverture /contact (1366×768) : 2386 ms depuis le premier octet
- Ouverture /metiers (1366×768) : 2318 ms depuis le premier octet
- Ouverture /references (1366×768) : 2313 ms depuis le premier octet
- Ouverture /specialites (1366×768) : 2373 ms depuis le premier octet
- Ouverture / (390×844) : 2339 ms depuis le premier octet
- Ouverture /contact (390×844) : 2408 ms depuis le premier octet
- Ouverture /metiers (390×844) : 2355 ms depuis le premier octet
- Ouverture /references (390×844) : 2321 ms depuis le premier octet
- Ouverture /specialites (390×844) : 2357 ms depuis le premier octet
- Bords de l’écran : 441 images d’intro, 10 de voile et 135 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Tient dans l'écran /contact : aucune section épinglée ou plein écran.
- Tient dans l'écran /metiers : aucune section épinglée ou plein écran.
- Tient dans l'écran /references : aucune section épinglée ou plein écran.
- Fluidité /contact 1366×768 (molette) : 1 % d'images lentes sur 181, tâche la plus longue 0 ms
- Fluidité /metiers 1366×768 (molette) : 3 % d'images lentes sur 370, tâche la plus longue 68 ms
- Fluidité /specialites 1366×768 (molette) : 0 % d'images lentes sur 335, tâche la plus longue 0 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1444, tâche la plus longue 0 ms
- Fluidité /contact 390×844 (doigt) : 0 % d'images lentes sur 1344, tâche la plus longue 0 ms
- Fluidité /metiers 390×844 (doigt) : 0 % d'images lentes sur 1335, tâche la plus longue 0 ms
- Fluidité /references 390×844 (doigt) : 0 % d'images lentes sur 1441, tâche la plus longue 0 ms
- Fluidité /specialites 390×844 (doigt) : 0 % d'images lentes sur 1342, tâche la plus longue 0 ms
- Vitesse / : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /contact : 0.46 s de calcul au chargement (téléphone ralenti).
- Vitesse /metiers : 0.45 s de calcul au chargement (téléphone ralenti).
- Vitesse /references : 0.49 s de calcul au chargement (téléphone ralenti).
- Vitesse /specialites : 0.38 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --seulement=fichiers,parcours
```
