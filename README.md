# 🎲 MultiPoly 2.0

Le plateau culte, refondu de zéro : règles complètes, 9 univers, cartes Pouvoir, parties en ligne fiables.

**Jouer :** ouvre `index.html` (site statique, aucun build) ou la page GitHub Pages du dépôt.

## Modes
- **Partie en ligne** — crée un salon, partage le code (ou le lien `?room=CODE`), ajoute des bots pour compléter la table. L'hôte arbitre la partie ; reprise possible après une coupure, pilote automatique si un joueur s'absente.
- **Partie locale** — 2 à 6 joueurs sur le même appareil, avec ou sans bots (3 personnalités : prudent, équilibré, agressif).

## Règles
Enchères, hypothèques, prison (amende, carte, double), échanges, faillites, cagnotte du parking, construction régulière. Fin de partie rapide par nombre de tours (20 / 30 / 50) ou classique.

**Cartes Pouvoir** (3 max, +1 à chaque passage par Départ) : 🛡️ Bouclier, 🌀 Téléportation, 💸 Racket, 🏗️ Chantier offert, ✊ Grève.

## Univers
Football · Monde · France · Pirates · Cinéma · Jeux vidéo · Espace · Fête foraine · Cuisine du monde

## Structure
```
index.html          coquille et écrans
css/                base.css, tables.css (fonds par univers), game.css
fonts/              Archivo (police variable, embarquée)
js/themes.js        contenu des 9 univers (plateau, pions, cartes)
js/engine.js        moteur de règles (état JSON pur, testable sans navigateur)
js/bots.js          IA des bots (aussi utilisée pour le pilote auto)
js/game-ui.js       plateau, dés 3D, animations, panneaux
js/app.js           accueil, profil, création, salons, contrôleur de partie
js/net.js           transport MQTT (WebSocket)
js/profile.js       profil, XP, emblèmes (clé de stockage conservée)
legacy/index-v1.html  ancienne version, conservée pour mémoire
```
