#!/usr/bin/env node
// Le comptoir reprend quelques fichiers du site public (styles, polices, icônes, données de la carte, API maquette) :
// ce script les recopie dans commun/, puis estampille les CSS et JS d'index.html (?v=AAAAMMJJhhmmss) pour
// qu'aucun téléphone ne mélange une nouvelle page et d'anciens scripts.
// Usage : node outils/synchro.mjs [chemin du site]   (par défaut : le dossier parent, quand le comptoir est
//         rangé dans comptoir/ du site, comme en développement)
// PROD : les données (carte, commandes, cartes de fidélité) viendront du serveur ; commun/ ne gardera que l'habillage.

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = resolve(process.argv[2] || join(ICI, '..'));
if (!existsSync(join(SITE, 'js', 'bb-data.js'))) {
  console.error(`Site introuvable : ${SITE} (donnez son chemin : node outils/synchro.mjs ../bougnat-burger)`);
  process.exit(1);
}

// ce que le comptoir prend au site, au même chemin relatif (les url(../assets/…) des CSS restent justes)
const COMMUNS = [
  'css/fonts.css', 'css/bougnat.css',
  'assets/fonts', 'assets/icons', 'assets/img/hublot-ciel.svg',
  'js/bb-core.js', 'js/bb-data.js', 'js/bb-hours.js', 'js/bb-fid-api.js', 'js/bb-resto-api.js',
];
const COMMUN = join(ICI, 'commun');
rmSync(COMMUN, { recursive: true, force: true });
for (const p of COMMUNS) {
  const dst = join(COMMUN, p);
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(join(SITE, p), dst, { recursive: true });
}
writeFileSync(join(COMMUN, 'LISEZMOI.txt'), 'Copie de fichiers du site public (bougnat-burger), faite par outils/synchro.mjs : ne pas modifier ici.\n');

// l'estampille
const d = new Date();
const p2 = (n) => String(n).padStart(2, '0');
const v = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}`;
const page = join(ICI, 'index.html');
let n = 0;
const html = readFileSync(page, 'utf8').replace(/(href|src)="((?:commun\/(?:css|js)\/)?[^"?:]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (m, attr, chemin) => { n++; return `${attr}="${chemin}?v=${v}"`; });
writeFileSync(page, html);
console.log(`commun/ recopié depuis ${SITE} · ${n} fichier(s) estampillé(s) v=${v}`);
