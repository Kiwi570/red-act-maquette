VERDICT : REFAIRE

Accueil v3 de Red-Act, regardé le 12 novembre 2026. Moyenne : **3,25 / 5**. Le critère 7 est à 2 et la moyenne est sous 3,5, d'où le verdict REFAIRE.
Sources : `_audit/apercu/images-ordinateur.jpg` (6 lignes de 4 images) et `images-telephone.jpg` (3 lignes de 8 images), les films, la planche, `vides.json`, le relevé, l'intention, les planches `recu/` et la vitrine.

| # | Critère | Note | Pourquoi |
|---|---|---|---|
| 1 | Fidélité au vrai lieu et au métier | 3 | On reconnaît Red-Act par les mots : « Red » veut dire réseau, les vrais clients alsaciens sont nommés dans le filet, et on lit 2004, 90, 12 000 et le vrai portrait. Les images, elles, ne le montrent pas : le carnet, le stylo et le café sont génériques (ordinateur, ligne 1, image 3), la terrasse évoque plus la Toscane que l'Alsace (ligne 3, image 3), et la tour des Ponts couverts est coupée du seul vrai portrait (ligne 4, image 3). Rien de faux par rapport au relevé. |
| 2 | Effet signature (5 premières secondes) | 3 | L'idée est propre au client : le fil du drapeau écrit « Red Act » (ligne 1, image 1), puis devient le réseau de ses vrais clients. Mais le rendu fait schéma : environ 25 pastilles blanches et des triangles de traits d'un pixel, sans matière ni ombre, posés sur la photo. Un rond blanc portant le logo cache la bobine d'où le fil devrait sortir (ligne 1, image 3). Sur téléphone, le filet n'occupe qu'une bande en bas du premier écran, et le bouton y masque « Électricité de Strasbourg » (téléphone, ligne 1, images 2 et 3). |
| 3 | Images | 3 | Les images générées sont bien éclairées et vont ensemble (l'enveloppe nouée, ligne 5, image 3), mais elles sont génériques : trois natures mortes papier, stylo et lin crème, et une terrasse qui ne dit pas l'Alsace. Le seul vrai portrait est un selfie au grand angle, recadré serré sur le visage et montré en grand (ligne 4, image 4 ; téléphone, ligne 2, image 6). |
| 4 | Composition et finition | 3 | Un seul langage du haut en bas (crème, rouge, Fraunces, soulignés « cousus »), et la marge de gauche est tenue. Mais la page enchaîne des blocs d'agence attendus : ouverture, carrousel, deux colonnes, bande de chiffres, portrait, quatre colonnes, appel à l'action. Deux défauts de finition : le fil de la marge barre le texte de la méthode (ligne 5, image 2), et les cartes voisines de la roue ne sont que des lamelles vues par la tranche (ligne 2, image 3). |
| 5 | Rythme, sans vides | 4 | Aucun écran presque vide d'après `vides.json` ; l'accueil fait 8,9 écrans sur ordinateur et 10,6 sur téléphone. Un seul temps mort : la roue reste sur 01/06 pendant quatre images de suite, sans qu'on voie un deuxième métier (ligne 2, images 2 à 4, puis ligne 3, image 1 ; téléphone, ligne 1, images 5 à 7). |
| 6 | Typographie et lisibilité | 4 | La Fraunces en grand tient bien : « Savoir faire & faire savoir », les chiffres rouges de la bande sombre (ligne 4, image 2). Mais les noms du filet font environ 11 px sur des pastilles blanches, les cartes voisines de la roue sont illisibles, et le texte gris des quatre étapes est petit. |
| 7 | Niveau par rapport à la vitrine | 2 | Le reste de la page est au niveau de la vitrine, l'ouverture un cran en dessous : coupdefood et nolanis frappent avec un objet net, alors qu'ici la photo disparaît sous un réseau de traits (ligne 1, image 3). Et une ouverture faite de points reliés et nommés reprend l'idée de la constellation d'icc, ce qui coûte un point. |
| 8 | Envie d'agir | 4 | Dès le premier écran : « Prendre rendez-vous », le numéro, et Stéphane Bourhis présenté comme « votre seul interlocuteur » (ligne 1, image 3). Sur téléphone, la barre Appeler / Rendez-vous reste fixe, et la fin est claire (ligne 5, image 3). Mais le bouton de l'ouverture reste petit à côté du filet, qui attire l'œil, et aucun vrai travail écrit ne donne encore envie de franchir le pas. |

## Ce qui doit changer

1. **Le filet de l'ouverture fait schéma, pas fil** (ordinateur, ligne 1, images 2 et 3 ; téléphone, ligne 1, image 4).
   → Il faut un vrai fil qui sort de la bobine rouge de la photo :
   - retirer le rond blanc au logo posé sur la bobine ;
   - un fil de 2 à 3 px, avec un peu de matière et une ombre douce sur les pages du carnet, qui pend entre deux nœuds au lieu de tendre des triangles ;
   - des nœuds à la place des pastilles blanches ;
   - huit à douze vrais noms alsaciens visibles à la fois (Wolfberger, Brasserie Météor, Électricité de Strasbourg, Peugeot Strasbourg, Maison de l'Alsace, L'Express…), les autres n'apparaissant que quand on tire ;
   - sur téléphone : six noms au plus, aucun sous un bouton, et la photo remontée dans le premier écran (la ligne de présentation de Stéphane Bourhis passe dessous).

   Rendu ainsi comme un objet, le filet s'éloigne aussi de la constellation d'icc.
2. **La roue ne tourne pas** : 01/06 tout du long dans les deux films.
   → Pendant que la section reste à l'écran, le défilement doit faire passer les six métiers un par un, de 01 à 06. Il faut aussi ouvrir l'angle pour que les deux voisines se lisent de trois quarts, avec leur titre lisible, au lieu de lamelles par la tranche. La bordure rouge ne reste que sur la carte de face.
3. **Les images ne montrent ni Strasbourg ni le vrai travail.**
   - Recadrer le portrait en largeur pour garder la tour des Ponts couverts, qui est dans la photo d'origine, à droite, et le montrer plus petit (ordinateur, ligne 4, image 3).
   - Remplacer la terrasse « toscane » (ligne 3, image 3) par l'image générée déjà prête du village alsacien dans les vignes à l'aube (`accueil-alsace`, planche Grok).
   - Demander au client une vraie pièce écrite : la couverture et une double page du Passeport Alsacien, à poser à côté du chiffre 12 000.
4. **Le fil de la marge passe sur le texte** : il barre « adaptées à vos rythmes » et « avant de proposer » (ordinateur, ligne 5, image 2).
   → Il ne doit courir que dans les marges et dans les blancs entre les sections. Dans la méthode, il fait une boucle autour de chacun des quatre ronds, puis repart par le bas sans repasser sur les colonnes. Un peu plus épais et avec une ombre légère, il se lira comme le même fil que celui du filet, et non comme une barre de progression.
5. **Le voile vers les autres pages est fait de sept bandes sombres plates qui glissent** (ordinateur, ligne 6, image 2 ; téléphone, ligne 3, image 4). C'est le défaut des persiennes plates jugées « jouet ».
   → À la place, un fil rouge qui traverse l'écran et tire un voile crème d'un seul tenant. Ou bien, si on garde la trame, des lanières qui passent vraiment dessus et dessous comme un tissage, en moins de 0,6 s.

## Ce qui est réussi

- **L'ouverture écrite au fil.** Le fil rouge trace « Red Act » en deux secondes, puis « savoir faire » se retourne en « faire savoir » sous la boucle rouge (ordinateur, ligne 1, images 1 à 3). C'est la vraie accroche du client, dans son rouge, courte et juste.
- **La bande sombre « Ceux qui ont fait confiance »** (ligne 4, image 2) : 2004, 90, 10, 12 000 et les dix secteurs avec leur nombre. Tout y est vrai, et elle donne une respiration nette au milieu de la page.
- **L'action toujours sous la main**, du premier écran jusqu'à « Faisons savoir ce que vous savez faire » et son enveloppe nouée, qui referme le fil (ligne 5, image 3).

## Les trois éléments gardés : réussis ou non

- **Filet des références à tirer** : l'idée est réussie, c'est la meilleure de l'accueil. Le rendu ne l'est pas encore : c'est un schéma de réseau posé sur une photo, pas un fil (point 1).
- **Roue 3D des métiers** : pas réussie en l'état. Elle reste immobile au défilement, on n'y voit qu'un métier sur six et ses voisines sont illisibles. Elle le devient si elle tourne vraiment (point 2).
- **Fil rouge de la marge** : à moitié réussi. Il relie bien les sections, et « Quatre nœuds, un seul fil » est un vrai bon moment. Mais il barre du texte, et ses grandes traversées d'un bord à l'autre font trait égaré (point 4).
