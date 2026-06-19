# EventPass 🎟️

EventPass est une plateforme de billetterie nouvelle génération conçue pour offrir une expérience premium, sécurisée et fluide. Inspiré par un design "Brutaliste" (forts contrastes, typographie impactante, espaces généreux), EventPass s'adresse aussi bien aux organisateurs d'événements qu'aux festivaliers et agents de sécurité.

## 🚀 Fonctionnalités Clés

La plateforme gère le cycle de vie complet d'un événement à travers 4 rôles distincts :

### 1. Visiteurs (Acheteurs)
- **Catalogue Dynamique** : Exploration d'événements filtrable par catégories.
- **Achat Sécurisé** : Achat fluide (limité à 3 billets max/événement).
- **Billets Anti-Fraude** : QR Code dynamique rotatif (se renouvelle toutes les 60s) stocké sur le compte pour empêcher la revente illégale par capture d'écran.

### 2. Organisateurs
- **Création & Gestion** : Brouillons, publication, édition d'événements avec affiches haute résolution (jusqu'à 20 Mo).
- **Tableau de Bord Financier** : Suivi en temps réel des billets vendus, des revenus générés (XOF) et du taux de scan à l'entrée.

### 3. Agents d'accueil (Sécurité)
- **Scanner Intégré** : Application web permettant d'utiliser la caméra du smartphone pour scanner les QR codes.
- **Validation Temps Réel** : Vérification de la signature cryptographique (HMAC) pour rejeter les faux billets, les billets expirés ou déjà scannés.

### 4. Administrateurs
- **Supervision** : Vue globale sur toutes les statistiques financières de la plateforme.
- **Gestion des Accès** : Création et désactivation (kill switch) des comptes organisateurs et agents.
- **Nomenclature** : Gestion dynamique de la base de données des catégories d'événements.

---

## 🏗️ Architecture & Modélisation (MERISE)

### Architecture Logicielle
L'application repose sur une **Architecture Client-Serveur** standard utilisant le style architectural **REST API** :
- **Frontend (Client)** : Application Single Page (SPA) développée en React, gérant l'état global et la logique d'interface.
- **Backend (Serveur)** : API Node.js/Express structurée selon le pattern **MVC (Modèle-Vue-Contrôleur)** (les vues étant ici remplacées par des réponses JSON pour le client).

### SGBD (Système de Gestion de Base de Données)
EventPass utilise **MySQL** comme SGBD relationnel robuste pour garantir l'intégrité transactionnelle (ACID), notamment lors de l'achat de billets. L'interaction se fait via l'ORM **Sequelize**.

### Modèle Conceptuel des Données (MCD - MERISE)
La base de données est structurée autour de 5 entités principales interconnectées :

1. **USER (Utilisateur)** : Cœur du système (Admin, Organisateur, Visiteur, Agent).
2. **CATEGORY (Catégorie)** : Nomenclature dynamique (gérée par l'admin).
3. **EVENT (Événement)** : Créé par un Organisateur.
4. **TICKET (Billet)** : Acheté par un Visiteur pour un Événement spécifique. Contient le secret cryptographique du QR Code.
5. **SCAN (Scan)** : Historique des validations effectuées par un Agent sur un Billet à l'entrée.

#### Règles de gestion et Cardinalités :
- Un `USER` (Organisateur) peut créer **(0,N)** `EVENT`. Un `EVENT` est créé par **(1,1)** `USER`.
- Un `EVENT` appartient à **(1,1)** `CATEGORY`. Une `CATEGORY` peut contenir **(0,N)** `EVENT`.
- Un `USER` (Visiteur) peut posséder **(0,N)** `TICKET`. Un `TICKET` appartient à **(1,1)** `USER`.
- Un `EVENT` peut émettre **(1,N)** `TICKET`. Un `TICKET` est valide pour **(1,1)** `EVENT`.
- Un `TICKET` peut subir **(0,N)** `SCAN` (tentatives de validation). Un `SCAN` concerne **(1,1)** `TICKET` et est effectué par **(1,1)** `USER` (Agent).

---

## 🛠️ Stack Technique

### Backend (Node.js / Express)
- **Base de données** : MySQL via Sequelize ORM.
- **Sécurité** : JWT (Json Web Token) pour l'authentification et signatures cryptographiques (Crypto) pour les QR Codes.
- **Fichiers** : Multer pour la gestion des uploads d'images.

### Frontend (React / Vite)
- **Styling** : TailwindCSS v4 (Design system personnalisé, Noir/Rouge/Blanc).
- **Animations** : Framer Motion pour des transitions fluides.
- **Composants** : Lucide React (Icônes), React Router DOM (Navigation).
- **Scan QR** : html5-qrcode.

---

## ⚙️ Installation & Démarrage local

Pour lancer ce projet sur votre machine locale, vous devez lancer le backend et le frontend simultanément.

### 1. Prérequis
- **Node.js** (v18 ou supérieur recommandé)
- **MySQL** installé et en cours d'exécution

### 2. Lancer le Backend
Ouvrez un terminal, placez-vous à la racine du projet et exécutez :

```bash
cd backend
npm install
# Configurez votre base de données dans config/database.js ou via .env si configuré
npm run dev
```
*(Le backend tourne par défaut sur `http://localhost:3000`)*

### 3. Lancer le Frontend
Ouvrez un second terminal :

```bash
cd frontend
npm install
npm run dev
```
*(Le frontend est accessible via l'URL locale fournie par Vite, généralement `http://localhost:5173`)*

---

## 🎨 Philosophie Design (UI/UX)
Le design d'EventPass est intentionnellement "Brutaliste" :
- **Typographie** : Utilisation de polices sans-serif géantes (Inter) pour crier l'information.
- **Couleurs** : Palette stricte (Noir #111111, Blanc, Gris, et un Rouge accent #E63946).
- **Formes** : Blocs carrés, bordures épaisses, aucun dégradé, ombres solides très marquées.

---
*Projet développé avec passion pour révolutionner la billetterie.*
