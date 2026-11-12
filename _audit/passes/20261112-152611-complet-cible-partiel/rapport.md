# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 16:27:28 · 1 min · 1 page(s) · audit complet ciblé sur / (étapes : fichiers, grille, mesures)

## Résumé

- Statut : **tout a tourné, aucun échec**
- Passe : `20261112-152611-complet-cible-partiel` · version ?v=3
- Échecs : **0**
- À regarder : **1**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), grille wouahou (7), mesures (52), balayage (1)

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
| **20261112-152611-complet-cible-partiel** (celle-ci) | complet | / | fichiers, grille, mesures | 0 | 1 | 0 | complet |

## Échecs

Aucun.

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=3
- Journal v3 : 2 étape(s) notée(s), 35 min de travail pour 95 min de budget, 2 min d’attente de l’utilisateur.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
