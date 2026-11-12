# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v6 — défilement des six métiers calme et prévisible (12 novembre 2026)

Retour de l'utilisateur sur la v5 : « ça bug le scroll, ça fait n'importe quoi ».

**Accueil : les six métiers**
- **Les six cartes toujours visibles** sur ordinateur et tablette en largeur. Leur largeur s'adapte pour qu'elles tiennent côte à côte : environ 200 px sur un écran de 1440 px. Rien n'entre ni ne sort de l'écran pendant le défilement. Avant, sur un écran courant, une carte disparaissait d'un coup au bord.
- **Défilement moins sensible** : la section se parcourt sur 1,2 écran de défilement au lieu de 0,7. Un coup de molette ne saute plus plusieurs cartes.
- **Défilement continu** : le fil suit le défilement sans se recaler tout seul une fois arrêté. Il ne se pose sur une carte qu'après un geste à la main ou les flèches.
- **Carte en cours** : elle se soulève légèrement, grandit un peu et son nom passe en rouge.
- **Balancement** du fil trois fois plus discret, notamment avec un trackpad.
- **Tailles de texte** proportionnelles à la carte : le nom fait environ 25 px sur un écran de 1440 px.
- **Sur téléphone**, une carte s'efface doucement en approchant du bord au lieu de disparaître d'un coup.

**Technique** : numéro de version des fichiers passé à `?v=6`.

## v5 — épreuves plus grandes et plus lisibles (12 novembre 2026)

Retour de l'utilisateur sur la v4 : les cartes des six métiers étaient un peu petites, et leurs textes beaucoup trop petits.

**Accueil : les six métiers**
- **Les cartes** sont environ 40 % plus larges, par exemple 245 px au lieu de 175 px sur un écran de 1440 px.
- **Les textes** sont plus grands (mesures sur un écran de 1440 px) :
  - le nom du métier passe d'environ 1,3 à 1,6 rem ;
  - la phrase courte, de 0,85 à 1,1 rem ;
  - le numéro, de 0,75 à 0,82 rem.
  - Les cartes voisines sont moins réduites : 93 % de la carte du milieu au lieu de 88 %.
- **Sur un écran d'ordinateur courant**, cinq cartes se lisent à la fois. Le fil ne glisse que de ce qui dépasse, et les cartes remplissent toujours la largeur. Les six restent côte à côte seulement sur un très grand écran.
- **Si la hauteur manque**, la phrase courte des cartes se retire d'abord ; leur largeur ne diminue qu'ensuite.
- **Une carte penchée** qui sortirait de l'écran est cachée, jamais coupée : on tient compte de son encombrement réel.
- **Sur petit téléphone**, le surtitre, la consigne et le lien « Les six métiers en détail » se retirent pour laisser la place à la carte.

**Technique** : numéro de version des fichiers passé à `?v=5`.

## v4 — six métiers « épreuves au fil » et filet fluide (12 novembre 2026)

Retours de l'utilisateur sur la v3 en ligne : la section des six métiers devait être plus fluide et plus aérée, et le filet des références « buggait un peu ».

**Accueil : les six métiers suspendus à un fil, comme des épreuves qui sèchent** (à la place de la roue 3D)
- **Le fil.** Un fil rouge pend en arc à travers la section. Les six cartes y sont accrochées par un nœud et suivent sa pente.
- **Sur grand écran.** Les six cartes se lisent d'un coup, sans aucune déformation. La carte en cours est un peu plus grande et son nom passe en rouge.
- **Le mouvement.** Au défilement, le fil glisse d'une carte à l'autre (01 à 06). On peut aussi l'attraper et le tirer, avec de l'élan, ou utiliser les flèches. Au clavier, la carte qui reçoit le focus vient au milieu.
- **Le balancement.** Le fil se balance selon la vitesse du défilement, puis se calme.
- **Sur téléphone, tablette et écran bas.** Le fil fait glisser une carte à la fois au centre. Une carte qui déborderait est cachée, jamais coupée. Sur écran bas, les cartes se réduisent à la hauteur disponible, avec une image carrée.
- **La section** passe de 2,5 écrans à faire défiler à 1,7, avec de l'air sous le titre.
- **Mode calme et sans JavaScript.** Les six épreuves s'affichent en grille.
- **Une image remplacée.** Celle de « Concepteur-rédacteur » (liège et fil, effet tableau d'enquête) devient celle des papiers et de la bobine. Sur la page Métiers, la section des supports prend l'enveloppe nouée, pour ne pas montrer deux fois la même image.

**Le filet (accueil, Références, Contact)**
- **Le déploiement.** Il se déplie en douceur depuis son nœud, comme une forme qui grandit, en 1,25 s. Avant, tous les nœuds partaient du même point et se démêlaient en rebondissant.
- **Les noms** apparaissent une fois le filet presque ouvert : ils ne s'empilent plus sur le nœud.
- **Le mouvement.** Il est mieux amorti : moins d'oscillations après un geste. Les à-coups du défilement sont plus doux.
- **Références.**
  - Le filet est resserré en entier vers la droite, au lieu de tasser ses nœuds en colonne contre le titre.
  - Son dessin est allégé (un seul trait par fil, moins de pixels à calculer) : il reste fluide avec ses 90 noms.

**Technique** : numéro de version des fichiers passé à `?v=4`.

## v3 — version optimale, après audit complet et analyse approfondie (12 novembre 2026)

Construit en comparant l'archive v2 et la v3, fichier par fichier. Avant les corrections, la v2 a été analysée sous quatre angles :
- un audit des formats, sur 13 tailles d'écran ;
- le regard d'un directeur artistique extérieur sur l'accueil filmé ;
- un regard neuf sur toutes les pages ;
- un test « vrai visiteur », sur téléphone et sur ordinateur.

**Correction importante : le menu sur téléphone**
- Depuis la v1, les liens du menu plein écran s'écrivaient dans la couleur du fond (encre sur encre). Seuls « Accueil » et le bouton d'appel se voyaient.
- Les liens sont maintenant en crème, et la page en cours en rouge clair.
- Le menu donne aussi l'adresse et l'e-mail.

**Accueil : reprise ciblée (le filet, la roue et le fil sont gardés)**
- **Ouverture.**
  - « Savoir faire & faire savoir » est en encre ; seul le « & » est rouge.
  - La deuxième ligne arrive en « & savoir faire ». Un fil rouge, avec son épaisseur et son ombre, entre alors, passe dans le « & », sous « faire » et sur « savoir ». Les deux mots échangent leur place : le savoir-faire devient faire-savoir.
  - Au survol, ou au toucher sur téléphone, les mots se recroisent avec un ressort. Au défilement, le bout du fil se balance.
- **Premier écran.**
  - Le numéro s'affiche à côté du bouton, et un médaillon du vrai portrait accompagne « Stéphane Bourhis, votre seul interlocuteur ».
  - La phrase d'ouverture dit ce qui distingue Red-Act : un seul interlocuteur, six métiers, deux spécialités.
- **Le filet.**
  - Les fils pendent un peu entre les nœuds, avec une ombre et un reflet.
  - Les pastilles blanches deviennent des nœuds rouges.
  - Dix noms se lisent à la fois (six sur téléphone), en plus grand ; les autres apparaissent au survol ou quand on tire.
  - Le disque blanc posé sur la bobine est retiré : le filet part de la vraie bobine de la photo.
- **L'intro** est plus courte : le titre arrive vers 1,4 s au lieu de 1,75 s.
- **La roue des métiers** tourne enfin au fil d'un défilement lent : elle restait sur la première carte, l'arrêt sur une carte compensant le défilement. Elle s'arrête désormais sur une carte une fois le défilement posé.
- **Longueur.** L'accueil passe de 13,3 à 8,9 écrans sur ordinateur, et de 14,2 à 10,6 sur téléphone (mesure de l'aperçu filmé) :
  - les sections « Le nom » (et ses mots géants) et « Depuis l'Alsace » sont retirées ;
  - la roue des métiers est plus courte à faire défiler.
- **Le réseau.**
  - Il passe sur fond encre, avec l'explication du nom (« Red » veut dire réseau) et les quatre chiffres affichés directement.
  - Un index des dix secteurs, avec leur nombre de références, mène chacun à la page Références déjà filtrée.
  - Le mur de fiches façon enquête et le bandeau défilant de noms sont retirés.
- **Les deux spécialités** ont de nouvelles images : le pupitre éclairé pour la tribune, le village alsacien dans les vignes pour la table.
- **La méthode** passe sur fond crème, sans photo ; le fil de la marge descend par les quatre nœuds sans passer sur le texte.
- **La fin** a un titre actif, « Faisons savoir ce que vous savez faire », le numéro en grand et la mention « Tarifs sur devis, après ce premier échange ».
- **Le portrait** de Stéphane Bourhis est montré en entier, en paysage, avec les Ponts couverts. Il est légèrement réchauffé pour entrer dans la palette (original gardé dans `_suivi/originaux/`).

**Métiers**
- **La scène.** La feuille et la colonne montrent toujours le même métier : avant, la feuille avait un métier d'avance. Le métier change quand son titre passe le milieu de l'écran.
- **La rature** se fait plus vite (0,75 s), et la phrase claire apparaît sans attendre.
- **La feuille de l'ouverture** tient entière dans le premier écran, une ligne par jargon.
- **La fin de page** n'a plus d'image en double : la table du métier « Conseil en communication » revenait. Elle mentionne les tarifs sur devis.

**Spécialités**
- La citation politique arrive ligne par ligne : plus de lettres orphelines pendant l'animation.
- Le bloc « carte aux punaises » de la campagne est retiré.
- Les textes repris du site actuel sont réécrits au présent, en phrases complètes.
- La fin de page devient deux images-boutons, « La tribune » et « La table ». Chacune ouvre le formulaire avec ce choix déjà fait.
- « Du chai à la table » est le seul plein écran du site. Ses mots ne sortent plus de l'écran.

**Références**
- **Le filet de l'ouverture** est resserré vers la droite. Avant, une colonne de nœuds se tassait contre le titre.
- **Le bandeau de mots géants** est retiré.
- **Le Passeport Alsacien.**
  - Le carnet ne porte plus le logo de Red-Act : la vraie couverture est inconnue.
  - Le chiffre n'est plus écrit deux fois.
- **La fin de page.**
  - « Et aussi » est retiré : sa phrase sur des clients non cités n'était pas vérifiable.
  - La fin devient « Votre projet, le prochain nœud ? », avec un nœud qui se dessine.

**Contact**
- **Les horaires.** « Horaires : à compléter » devient « Rendez-vous sur demande, par téléphone ou par e-mail ».
- **La carte** montre l'Alsace (Hoenheim, Strasbourg, Colmar, Mulhouse, le Rhin en gris) au lieu d'un Grand-Est approximatif.
- **Le bandeau de mots géants** est retiré.
- **Le formulaire.**
  - L'étape « Vous » devient « Vous êtes… ».
  - Le déroulé annonce « Tarifs sur devis, après un premier échange ».

**Partout**
- **Zone d'intervention.** Elle est écrite « Strasbourg et Alsace » partout : le Grand-Est n'est pas cité par le site actuel.
- **Les bandeaux de mots géants qui défilent** passent de cinq à un : celui des supports, sur Métiers.
- **Un seul rouge d'action.** Sur fond sombre, les boutons sont crème à texte rouge, au lieu de corail.
- **Les titres écrits au fil** se remplissent plus vite, sans état gris prolongé.

**Technique**
- Numéro de version des fichiers passé à `?v=3`.
- Outils d'audit mis à jour, avec le test « vrai visiteur » et l'aperçu filmé.
- Les fichiers de travail (consignes et document Grok, relevé, regards) sont rangés dans `_suivi/`.

## v2 — de « pas mal » à « wouahou » (7 novembre 2026)

Construit en comparant l'archive v1 et la v2, fichier par fichier.

**Spécialités : nouvelle ouverture**
- **L'écran** : il est scindé en plein cadre, sans bandeau de titre au-dessus.
- **Les deux mondes** : chacun porte son mot en très grand, « La tribune » d'un côté, « et la table » de l'autre, avec son lien.
- **Le titre** : « La tribune et la table » et le bouton sont posés sur une carte. Cette carte suit la couture quand on fait glisser la séparation.

**Contact : nouvelle ouverture**
- **La photo** : la rue occupe tout l'écran.
- **La carte de visite** : elle est posée dessus, avec le numéro en très grand, l'adresse et l'e-mail. Le nœud Red-Act la ferme en haut.
- **Le mouvement** : un fil rouge la traverse et se trace à l'arrivée. Au défilement, la carte et le fil se décollent légèrement.

**Métiers : la feuille se raye à la main**
- **Rayer soi-même** : on fait glisser sur la phrase de jargon, à la souris ou au doigt, pour la barrer. La phrase claire s'écrit alors.
- **Sans geste** : la rature se fait seule après un instant.
- **Sur téléphone** : toucher la ligne la raye.

**Accueil : roue des métiers**
- Les cartes sont plus grandes et plus espacées.
- La carte de face est cerclée de rouge.
- Un anneau de fil rouge passe sous la roue.

**Verbes d'action** : tous les boutons principaux disent « Prendre rendez-vous ». Avant, on lisait aussi « Demander un devis », « Parler de votre projet », « de votre campagne », « de votre maison ». Le choix du métier ou de la spécialité reste prérempli.

**Téléphone**
- Les choix du formulaire de rendez-vous passent sur deux colonnes.
- Le pied de page est plus court.

**Technique** : numéro de version des fichiers passé à `?v=2`.

## v1 — la base (7 novembre 2026)

**Direction « Red, le réseau »** : papier crème, encre noire et un seul rouge, celui du drapeau du logo. Les titres sont en Fraunces, avec un axe « souple » animé au défilement ; le texte est en Inter Tight. Les deux polices sont hébergées avec le site.

**Pages** : accueil, Métiers, Spécialités, Références (page sombre), Contact, 404. Chaque page a son ouverture, son fond et sa signature.

**Ce qui relie le site**
- **L'intro** : un fil rouge écrit « Red » puis « Act ». Le trait d'union se serre en nœud, puis glisse jusqu'à l'objet d'ouverture de la page, d'où l'écran s'ouvre.
- **Le voile entre les pages** : sept lanières qui se tissent depuis la ligne du clic, puis se défont sur la page suivante.
- **Le fil conducteur** : un fil rouge court dans la marge de chaque page et fait un nœud à chaque section.
- **Les grands titres** : un point rouge les « coud » à leur arrivée.

**Accueil**
- **Ouverture** : le filet des références, une vingtaine de vrais noms noués sur des fils rouges. On l'attrape, on le tire, il garde son élan. Le survoler allume le secteur d'un nom et tend ses fils.
- **Le nom** : « Red, le réseau. Act, l'action. », avec des mots géants qui filent en sens opposés.
- **L'Alsace** : une photo qui s'ouvre jusqu'au plein écran.
- **Les métiers** : une roue 3D des six métiers, à faire tourner au défilement, à la main ou aux flèches. Elle penche selon la vitesse.
- **Les spécialités** : deux spécialités, avec la citation du site actuel.
- **Le réseau en chiffres** : 2004, 90 références, 10 secteurs, 12 000 exemplaires du Passeport Alsacien. Un ruban de noms défile, avec un bouton pause.
- **Stéphane Bourhis** : son vrai portrait, son nom écrit au fil, les valeurs et la phrase en alsacien.
- **La méthode** : quatre nœuds.
- **La fin de page** : un appel à prendre rendez-vous ou à demander une documentation.

**Métiers**
- **Ouverture** : « Six métiers, une seule plume », sur un bandeau de brouillons recouvert d'une feuille qui se retire au défilement.
- **Scène « Du brouillon au texte »** : une feuille reste à l'écran pendant la lecture. Pour chaque métier, elle barre le jargon au rouge puis le réécrit clair. Sur téléphone, chaque métier porte sa propre rature.
- **Sections suivantes** : « Pour qui », puis « Du print au digital » avec des mots géants.
- **Liens** : chaque métier a son lien vers le rendez-vous, avec ce métier déjà choisi.

**Spécialités**
- **Ouverture** : l'écran est scindé entre la tribune et la table. Un fil rouge les sépare, à faire glisser à la souris, au doigt ou au clavier.
- **Politique** : sur fond de nuit, avec le parcours candidature, campagne, élection, mandat tracé au fil.
- **La cave** : elle s'ouvre en plein écran.
- **Tourisme et gastronomie** : un titre écrit au fil, et les vraies références du secteur des vins et de la table.

**Références**
- **Ouverture** : un grand filet de nuit avec les 90 noms du site actuel.
- **Filtres** : dix secteurs, qui allument et tirent leurs nœuds. La sélection est gardée dans l'adresse.
- **Le reste de la page** : la liste complète lisible, les mots géants des noms, le Passeport Alsacien et « Et aussi ».

**Contact**
- **Ouverture** : le numéro en très grand, au-dessus d'un bandeau de rue.
- **Rendez-vous en trois étapes** : le besoin, le profil, puis les coordonnées. Le récapitulatif est mis à jour en direct, et le choix est déjà fait quand on arrive d'un bouton.
- **L'envoi** : il est simulé. La demande se plie, se noue et file jusqu'au petit filet, où elle devient le nœud « Vous ».
- **La carte** : une carte schématique du Grand-Est.

**Images**
- **Du site actuel** : le logo et le portrait de Stéphane Bourhis.
- **Générées avec Grok** : 30 illustrations, toutes marquées « Illustration générée ».
- **Images de partage** : une image de partage en 1200×630 par page.

**Mise en ligne** : la maquette n'est pas indexée (noindex), elle peut s'afficher dans le module Wix, et les fichiers sont versionnés (`?v=1`).
