# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 16:32:49 · 2 min · 1 page(s) · audit complet ciblé sur / (étapes : fichiers, films, mouvement, fluidite, ecran)

## Résumé

- Statut : **tout a tourné, aucun échec**
- Passe : `20261112-153042-complet-cible-partiel` · version ?v=3
- Échecs : **0**
- À regarder : **5**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), films d’ouverture (2), films de transition (2), fluidité (2), défilement selon l’appareil (5), mouvement (2), effets du plan (11), souris immobile (2)

## Passes de cette version (?v=3)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261112-145037-rapide-cible | rapide | /,/metiers,/specialites,/references,/contact | toutes | 5 | 7 | 1 | échecs |
| 20261112-150008-complet | complet | toutes | toutes | 1 | 6 | 1 | échecs |
| 20261112-152611-complet-cible-partiel | complet | / | fichiers, grille, mesures | 0 | 1 | 0 | complet |
| **20261112-153042-complet-cible-partiel** (celle-ci) | complet | / | fichiers, films, mouvement, fluidite, ecran | 0 | 5 | 0 | complet |

## Échecs

Aucun.

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### numéro de version (1)

- **numéro de version** — ?v=3 est celui de la dernière livraison : à changer avant de livrer

### retour arrière : changement brusque (1)

- **retour arrière : changement brusque** — `/` — à 73 ms (différence 20 %) (films/retour-arrière-1366.png) _(1366×768 retour arrière)_

### retour avant : changement brusque (1)

- **retour avant : changement brusque** — `/metiers` — à 72 ms (différence 21 %) (films/retour-avant-1366.png) _(1366×768 retour avant)_

### fluidité (1)

- **fluidité** — `/` — 7 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=3
- Journal v3 : 2 étape(s) notée(s), 35 min de travail pour 95 min de budget, 2 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Ouverture / (1366×768) : 2390 ms depuis le premier octet
- Ouverture / (390×844) : 2391 ms depuis le premier octet
- Tient dans l'écran / : aucune section épinglée ou plein écran.
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1417, tâche la plus longue 0 ms

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
