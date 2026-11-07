# Audits de la v1 (7 novembre 2026)

1. Audit standard n° 1 : 61 échecs (faux positif mailto, images de partage pas encore produites, masques des titres, décors, contrastes, voile).
2. Audit standard n° 2 : 9 échecs (contraste des mots du plein écran, roue sur téléphone à l'horizontale, fil sur les filtres, débordement à 320 px).
3. Audit standard n° 3 (rapport-standard.md) : 2 échecs, roue sur téléphone à l'horizontale (844×390).
4. Passe des formats (--complet --seulement=mesures,ecran, 13 tailles, toutes les pages) : 5 échecs, tous sur l'accueil en 1000×560 sans JavaScript et en mode calme (roue en grille trop large, information clé sous le pli).
5. Audit ciblé final (rapport.md) : --complet --pages=/ --seulement=mesures,ecran,mouvement, 13 tailles, tous les modes : 0 échec.

Non lancé : Safari (WebKit indisponible ici), liste à vérifier sur le Mac dans rapport-standard.md.
