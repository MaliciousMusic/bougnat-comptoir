# Mettre le comptoir en ligne, réservé à l'équipe

Le dépôt est privé, mais une page web en ligne s'ouvre pour qui connaît l'adresse. Deux verrous, l'un ne remplace pas l'autre :

1. **Cloudflare Access** devant la page : elle ne s'affiche qu'après un code reçu par e-mail, et seulement pour les adresses autorisées (François, l'équipe). Un inconnu ne charge même pas le code.
2. **La connexion côté serveur** (avec les vrais modules) : chaque appel de `BB.restoApi` / `BB.fidApi` exige la session de François ; sans elle, le serveur refuse. C'est ce qui protège les données, même si la page fuitait. Le code `2012` de la maquette disparaît à ce moment-là.

## 1. Héberger : Cloudflare Pages (gratuit, accepte les dépôts privés)

GitHub Pages ne publie un dépôt privé qu'avec un compte payant, et la page resterait publique : Cloudflare Pages fait les deux.

1. Compte Cloudflare (gratuit) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → choisir `MaliciousMusic/bougnat-comptoir`.
2. Réglages de build : aucun framework, **build command vide**, **output directory** `/`.
3. Chaque push sur `main` republie. Adresse donnée : `bougnat-comptoir.pages.dev`.
4. Plus tard, domaine du restaurant : **Custom domains** → `comptoir.bougnatburger.fr`.

## 2. Fermer la porte : Cloudflare Access (gratuit jusqu'à 50 personnes)

1. **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**.
2. Domaine : `bougnat-comptoir.pages.dev` (et `*.bougnat-comptoir.pages.dev`, pour les aperçus de branches), puis `comptoir.bougnatburger.fr` quand il existe.
3. Règle : **Allow** → **Emails** → l'adresse de François (et celles de l'équipe).
4. Méthode de connexion : **One-time PIN** (code reçu par e-mail). La session dure 24 h par défaut (réglable jusqu'à un mois, pratique pour la tablette du comptoir).

## 3. Relier le site au comptoir

Le QR code de la carte de fidélité d'un client mène au comptoir. Dans le site, `js/bb-data.js` → `BB.INFO.comptoir` : mettre l'adresse définitive (`https://comptoir.bougnatburger.fr/`), puis `node outils/synchro.mjs` ici.

## 4. Installer sur le téléphone de François

- **Android (conseillé)** : Chrome → l'adresse → se connecter (code par e-mail) → menu ⋮ → **Installer l'application**. Seul Chrome permet l'imprimante Bluetooth.
- **iPhone** : Safari → Partager → **Sur l'écran d'accueil**. Pas d'imprimante Bluetooth (sauf dans l'appli Bluefy).
