# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 16:43:39 · 6 min · 1 page(s) · audit complet ciblé sur / (étapes : fichiers, grille, mesures, films, mouvement, ecran, fluidite, parcours)

## Résumé

- Statut : **tout a tourné, aucun échec**
- Passe : `20261112-153736-complet-cible-partiel` · version ?v=3
- Échecs : **0**
- À regarder : **4**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (52), balayage (1), films d’ouverture (2), films de transition (2), intro accélérable et passable (7), menu (1), clavier (1), liens et boutons (1), liens profonds (14), liens vers la page en cours (1), changements de hauteur (1), mode calme (2), bouton du mode calme (2), parcours du projet (2), fluidité (2), défilement selon l’appareil (5), mouvement (2), effets du plan (11), souris immobile (2)

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

## Passes de cette version (?v=3)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261112-145037-rapide-cible | rapide | /,/metiers,/specialites,/references,/contact | toutes | 5 | 7 | 1 | échecs |
| 20261112-150008-complet | complet | toutes | toutes | 1 | 6 | 1 | échecs |
| 20261112-152611-complet-cible-partiel | complet | / | fichiers, grille, mesures | 0 | 1 | 0 | complet |
| 20261112-153042-complet-cible-partiel | complet | / | fichiers, films, mouvement, fluidite, ecran | 0 | 5 | 0 | complet |
| **20261112-153736-complet-cible-partiel** (celle-ci) | complet | / | fichiers, grille, mesures, films, mouvement, ecran, fluidite, parcours | 0 | 4 | 0 | complet |

## Échecs

Aucun.

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### numéro de version (1)

- **numéro de version** — ?v=3 est celui de la dernière livraison : à changer avant de livrer

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 82 ms (différence 20 %) (films/retour-arrière-1366.png) _(1366×768 retour arrière)_

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/` — écran différent à la même position après rechargement (4.5 %), voir comparaisons/rechargement-*.png _(1366×768)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=3
- Journal v3 : 2 étape(s) notée(s), 35 min de travail pour 95 min de budget, 2 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2360 ms depuis le premier octet
- Ouverture / (390×844) : 2322 ms depuis le premier octet
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Fluidité / 1366×768 (molette) : 3 % d'images lentes sur 348, tâche la plus longue 64 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1453, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
