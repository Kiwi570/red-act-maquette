# Red-Act — maquette v4

Maquette du futur site de Red-Act (conseil en communication, rédaction et community management, Hoenheim près de Strasbourg).
Direction artistique « Red, le réseau » : red veut dire réseau en espagnol, et le rouge du drapeau du logo devient un fil qui relie tout le site.

Adresse prévue : https://red-act-maquette.vercel.app

## Pages

| Page | Ouverture | Signature |
|---|---|---|
| Accueil | Chiasme « Savoir faire & faire savoir » croisé par un fil rouge, portrait et numéro dès le premier écran ; bureau du rédacteur et bobine à droite | Filet des vraies références à tirer à la main ; intro du fil qui écrit « Red » puis « Act » et se noue ; six métiers suspendus à un fil comme des épreuves ; index des dix secteurs sur fond encre ; titre « Stéphane Bourhis » écrit au fil ; méthode en quatre nœuds |
| Métiers | Très grand titre, bandeau de brouillons recouvert d'une feuille qui se raye | « Du brouillon au texte » : on raye soi-même le jargon (ou il se raye seul), la phrase claire s'écrit |
| Spécialités | Écran scindé plein cadre, « La tribune » et « et la table » en grand, titre sur une carte qui suit la couture | Séparation à faire glisser ; parcours candidat → mandat tracé au fil ; cave en plein écran ; fin en deux images-boutons (tribune, table) |
| Références (page sombre) | Grand filet de nuit avec les 90 noms | Filtres par secteur qui tirent les nœuds (sélection gardée dans l'adresse) ; liste complète lisible |
| Contact | Carte de visite nouée par le fil rouge, posée sur la rue, numéro en très grand | Rendez-vous en trois étapes, simulé : la demande se plie, se noue et devient le nœud « Vous » du filet |
| 404 | « Le fil est coupé » | |

Partout : un fil rouge court dans la marge et fait un nœud à chaque section ; les voiles entre les pages se tissent en lanières ; les grands titres sont « cousus » à leur arrivée. Le mode calme (lien « Réduire les animations » dans le menu et le pied de page) donne une version complète sans mouvement.

## Informations à fournir par Red-Act (à compléter)

- [ ] Mentions légales : raison sociale, forme juridique, SIRET, directeur de la publication.
- [ ] Hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (adresse relevée le 7 novembre 2026, à reconfirmer sur vercel.com au moment de la mise en ligne).
- [ ] Politique de confidentialité (formulaire de rendez-vous, lettre d'information) : à compléter. Le site actuel indique « ne collecte aucune donnée » alors qu'il propose une inscription à la lettre d'information.
- [ ] Horaires d'ouverture ou de joignabilité (le site actuel n'en donne que sur la page « Red-Act en Alsace » : 7 j/7, 8 h – 18 h, à confirmer).
- [ ] Assurance professionnelle, le cas échéant.
- [ ] Accord des clients cités pour l'affichage de leur nom (les 90 noms sont repris du site actuel, sans logo).
- [ ] Photos réelles de Stéphane Bourhis en situation (rendez-vous, atelier, formation) pour remplacer peu à peu les illustrations générées.
- [ ] Crédits : photo de Stéphane Bourhis (auteur à préciser) ; illustrations générées par IA (Grok), mention « Illustration générée » à garder sur le site final.

## Incohérences relevées sur le site actuel

- Deux numéros : 03 88 18 35 44 (page Contact, retenu ici) et 06 11 32 29 07 (page « Red-Act en Alsace »).
- « Strasbourg » dans les textes, Hoenheim dans l'adresse.
- Valeurs différentes selon les pages : « imagination, complicité, professionnalisme » (retenues) et « imagination, implication, expertise ».
- Pied de page resté à « 2019 » ; formulaire de lettre d'information cassé (`[mc4wp_form]` affiché) ; lien RSS vide.
- Le logo de pied de page du thème est celui d'une autre société (« Invex24 ») : à retirer du site actuel.
- Château de Pommard classé dans deux secteurs des références (gardé une seule fois, dans « Vins et bière »).
- Blog sans dates ; aucune mention légale.

## Choix de contenu

- Aucun fait inventé : textes, noms, chiffres (2004, 90 références, 10 secteurs, 12 000 exemplaires du Passeport Alsacien) viennent du site actuel. Les phrases « brouillon → clair » de la page Métiers sont des exemples de style rédactionnel, pas des citations.
- Aucun élu nommé ; ton neutre sur la communication politique. Images de vin sans étiquette ni personne qui boit (loi Évin).
- Pages non reprises dans la v1 (possibles en v2) : le blog du rédacteur (8 pages, 6 rubriques), la page « Red-Act en Alsace » en alsacien, la page À propos (reprise en section de l'accueil).

## Pistes pour la suite

- Images à régénérer avec Grok (ou à remplacer par de vraies photos) : « Audit en communication » (feuilles aux taches floues), « Concepteur-rédacteur » (liège et fil rouge, effet tableau d'enquête), la salle à bancs de la section politique de Spécialités. Le mur de fiches et la carte aux punaises ne sont plus affichés (fichiers gardés dans `assets/images/grok/`).
- La vraie couverture du Passeport Alsacien, si Red-Act peut la fournir (le carnet est aujourd'hui dessiné, sans logo).
- La page 404 pourrait devenir manipulable (renouer les deux bouts du fil pour revenir à l'accueil).
- La phrase alsacienne « Uff Elsassich – Red-Act, ihre neue Partner. » est reprise telle qu'elle figure sur le site actuel : à faire relire par Red-Act.
- Zone d'intervention écrite partout « Strasbourg et Alsace » (le Grand-Est n'est pas cité par le site actuel) : à confirmer par Red-Act.
- Le portrait de Stéphane Bourhis est légèrement réchauffé pour entrer dans la palette (original dans `_suivi/originaux/`).

## À retirer à la mise en ligne définitive

- La consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`.
- Le formulaire de rendez-vous simulé (à brancher sur un vrai envoi) et les mentions « à compléter ».
- À garder : la mention « Illustration générée » sur les images créées par IA.

## Technique

- Site statique (HTML, CSS, JavaScript), prêt pour Vercel sans étape de construction.
- Les pages sont générées depuis `donnees/` (textes, métiers, références, listes) par `node outils/generer.mjs` : ne jamais modifier les pages `.html` à la main.
- Polices hébergées : Fraunces et Inter Tight (licence SIL OFL, dans `assets/polices/`).
- Audit automatique : `node _audit/audit.mjs` (rapport dans `_audit/rapport/`).
