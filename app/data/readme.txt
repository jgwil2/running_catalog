Dans passionrunning/boutique/app/data, tu tapes ‘php datascript.php’ pour avoir ce résultat qui explique les options:

* * *
Script usage:

Arguments: 'php datascript.php data' ou 'php datascript.php seo'

'data' : charger fichier XML, enregistrer son contenu, le convertir en JSON et enregistrer

'seo' : parcourir toutes pages produits avec phantomjs, enregistrer fichiers HTML et fichier sitemap.xml
* * *

Pour mettre à jour le catalogue tu exécutes alors ‘php datascript.php data’, ce qui cherchera le fichier XML et le convertira en JSON. La boutique va maintenant utiliser le nouveau fichier JSON, donc elle est à jour. Puis tu exécutes ‘php datascript.php seo’ pour créer les fichiers HTML qui seront visibles par Google, ainsi que le sitemap.xml. Cette étape va prendre pas mal de temps selon le nombre d'articles dans le catalogue.