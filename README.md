# Le comptoir du Bougnat Burger

Le panneau de François, **privé**, séparé du site public ([bougnat-burger](https://github.com/MaliciousMusic/bougnat-burger)) : cinq onglets en bas de l'écran, pour un téléphone ou une tablette posée au comptoir. Il s'installe comme une appli (« Comptoir ») depuis le navigateur, sans magasin d'applis.

> **Maquette.** Les données vivent dans le navigateur (`localStorage`) et le code d'accès (`2012`) est écrit dans `admin.js`. Avant de servir avec de vraies données : la connexion de François côté serveur, et la page derrière Cloudflare Access (voir [DEPLOIEMENT.md](DEPLOIEMENT.md)).

## Les onglets

- **Commandes** : chaque commande payée sur le site arrive ici et sonne (puis resonne toutes les 30 s tant que personne ne l'a prise). Nouvelle → En cuisine → Prête (SMS « commande terminée » au client, et son ticket sur le site passe à « Prête ») → Retirée ; ou Annulée (deux touches). « Commande d'essai » en fabrique une. **Coup de feu** : pause des commandes en ligne 20 min, 45 min ou jusqu'à reprise ; le site désactive le paiement et propose d'appeler.
- **Imprimante Bluetooth** (`ad-imprimante.js`) : imprimante thermique BLE qui parle ESC/POS (58 ou 80 mm), par Web Bluetooth (Chrome ou Edge sur Android, Windows, Mac ; sur iPhone, l'appli Bluefy). Chaque nouvelle commande sort en cuisine (réglable) ; un ticket imprimé passe la commande « en cuisine ». Accents retirés à l'impression. « Ticket » montre l'aperçu ; « Imprimer avec le navigateur » sert de secours. ⚠ Les imprimantes en Bluetooth « classique » seul ne sont pas visibles d'une page web : choisir un modèle BLE, ou une imprimante réseau pilotée par le serveur.
- **Réservations** : les demandes du site (Confirmer ou Refuser : SMS au client, réponse en direct sur sa page), les jours avec leurs couverts, midi et soir ; « Noter un appel » ; « Venus » retrouve la carte de fidélité par le numéro et propose de la créditer.
- **Fidélité** : le QR code de la carte d'un client ouvre le comptoir sur `?carte=BB-XXXX-XXXX` (ou bouton « Scanner », ou recherche par téléphone, n° de carte, nom) ; un point par personne, « Annuler le dernier passage », « Remettre » un cadeau.
- **Carte** : prix, « Épuisé aujourd'hui » (revient tout seul le lendemain), « Masqué », allergènes ; tout part en direct sur le site.
- **SMS** : seulement aux clients qui ont coché la case des offres (facultative, sur leur carte de fidélité). Dix modèles prêts avec `{prenom}` et des [crochets] à compléter, ses propres modèles, quatre listes de destinataires, envoi tout de suite ou programmé (une fois, chaque semaine), compteur de SMS (160 caractères, 70 en Unicode), alerte hors des heures conseillées. « STOP au 36xxx » : ⚠ le vrai numéro vient du prestataire SMS. Maquette : un journal montre les SMS « envoyés ».

Le comptoir garde l'écran allumé tant qu'il est déverrouillé et à l'écran (pour que les commandes sonnent).

## Les fichiers

```
index.html              la page : verrou, cinq onglets, icônes
admin.js                la coque : verrou, onglets (BB.ad.module), toast, sons, écran allumé
ad-commandes.js         les commandes, la pause des commandes en ligne
ad-imprimante.js        l'imprimante Bluetooth (ESC/POS) et l'aperçu du ticket
ad-resas.js             les réservations
ad-fidelite.js          les cartes de fidélité (scan, passages, cadeaux)
ad-carte.js             la carte (prix, épuisés, masqués, allergènes)
ad-sms.js               les SMS (modèles, destinataires, programmation, journal)
admin.css               le style du comptoir
manifest.webmanifest    l'appli installable « Comptoir »
commun/                 copie de fichiers du site (styles, polices, icônes, données, API maquette) : ne pas modifier ici
outils/synchro.mjs      recopie commun/ depuis le site et estampille les ?v=
```

Toutes les données passent par `BB.restoApi` et `BB.fidApi` (dans `commun/js/`, écrits dans le site) : leurs en-têtes listent les appels serveur qui les remplaceront.

## Travailler dessus

En développement, le comptoir est rangé dans le dossier `comptoir/` du site (que le dépôt du site ignore) :

```
bougnat-burger/            ← le site (dépôt public)
└── comptoir/              ← ce dépôt (privé)
```

`python tools/dev-server.py 5188` dans le site sert les deux à la même adresse : le site sur `http://localhost:5188/`, le comptoir sur `http://localhost:5188/comptoir/`. Même origine, donc même `localStorage` : une commande passée sur le site sonne au comptoir, comme en vrai.

Après un changement du site (carte, API, styles) : `node outils/synchro.mjs`, puis commit ici.
