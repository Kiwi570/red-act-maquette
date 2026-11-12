# Rapport d’audit

Projet : `red-act-maquette` · 12/11/2026 17:39:36 · 1 min · 1 page(s) · audit complet ciblé sur / (étapes : fichiers, mesures, ecran)

## Résumé

- Statut : **2 échec(s)**
- Passe : `20261112-163817-complet-cible-partiel` · version ?v=5
- Échecs : **2**
- À regarder : **2**
- Non lancé : **0**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (52), balayage (1)

## Passes de cette version (?v=5)

Chaque passe garde son rapport dans `_audit/passes/` : une relance ciblée ne fait pas disparaître la preuve d’une passe plus large.

| Passe | Niveau | Pages | Étapes | Échecs | À regarder | Non lancé | Statut |
|---|---|---|---|---:|---:|---:|---|
| 20261112-163321-complet-cible-partiel | complet | / | fichiers, mesures, ecran, mouvement, parcours | 2 | 2 | 0 | échecs |
| **20261112-163817-complet-cible-partiel** (celle-ci) | complet | / | fichiers, mesures, ecran | 2 | 2 | 0 | échecs |

## Échecs

### texte coupé (2)

- **texte coupé** — `/` — ul.epreuves-liste > li.epreuve:nth-of-type(6) > a > strong.epreuve-nom « Conseil en communication » — coupé par section#metiers > div.epreuves-collant > div.epreuves-scene:nth-of-type(2) « Illustration générée 01 Rédacteur web Vos sites, b » _(1280×720 normal, 1280×720 sansWebgl)_
- **texte coupé** — `/` — ul.epreuves-liste > li.epreuve:nth-of-type(6) > a > strong.epreuve-nom « Conseil en communication » — coupé par section#metiers > div.epreuves-collant > div.epreuves-scene:nth-of-type(2) « Illustration générée Audit en communication Illust » _(320×568 sansWebgl)_

## À regarder

### « à compléter » visible (1)

- **« à compléter » visible** — `contact.html` — 1 fois hors du pied de page : remplacer par une phrase vraie qui oriente le visiteur (« Tarifs selon la saison, donnés à la réservation ») ou retirer l'élément, et le noter dans la fiche du README (sauf sens propre : « dossier à compléter »)

### journal du projet (1)

- **journal du projet** — aucune entrée pour la version 5 de donnees/site.json

## Non lancé

Tout a été lancé.


## Repères

- Numéro de version des fichiers : ?v=5
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Tient dans l'écran / : aucune section épinglée ou plein écran.

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`


## Relancer seulement ce qui a échoué

Après correction, si elle ne touche que ces pages (sinon, relancer l’audit standard en entier) :

```
node _audit/audit.mjs --complet --pages=/ --seulement=fichiers,mesures
```
