EventPass — Cahier des Charges Technique
Version 1.0 — Document de référence projet

Présentation du projet
EventPass est une plateforme de billetterie en ligne dédiée aux événements culturels et sportifs. Elle permet aux organisateurs de créer et publier des événements, aux visiteurs d'acheter des billets sécurisés, et aux agents d'accueil de valider les entrées via QR code dynamique.

Table des matières
text

1. Vue d'ensemble
2. Rôles et permissions
3. Fonctionnalités par rôle
4. Architecture technique
5. Modèle de données
6. API Endpoints
7. Sécurité des billets (QR dynamique)
8. Design & Interface
9. Bonnes pratiques Git/GitHub
10. Livrables attendus
1. Vue d'ensemble
Contexte
EventPass centralise la gestion d'événements et la billetterie en ligne. Le système couvre l'intégralité du cycle de vie d'un événement : de sa création par l'organisateur jusqu'à la validation des billets à l'entrée par un agent d'accueil.

Périmètre fonctionnel
Module	Description
Authentification	Connexion sécurisée avec gestion des rôles
Gestion des comptes	L'admin crée les comptes organisateurs et agents
Événements	Création, modification, publication par les organisateurs
Billetterie	Achat de billets avec limite de 3 par utilisateur par événement
QR Code	Génération de billets sécurisés avec QR dynamique rotatif
Validation	Scan et validation des billets à l'entrée
Dashboard	Tableau de bord statistique pour les organisateurs
2. Rôles et permissions
Le système repose sur 4 rôles distincts.

Tableau des rôles
Rôle	Création du compte	Description
Admin	Pré-existant (seed en base)	Supervise la plateforme, crée les comptes organisateurs et agents
Organisateur	Créé par l'admin	Crée et publie des événements, suit ses ventes
Visiteur	Inscription libre	Consulte les événements publiés, achète des billets
Agent d'accueil	Créé par l'admin	Valide les billets à l'entrée via scan QR
Matrice des permissions
Action	Admin	Organisateur	Visiteur	Agent
Créer un compte organisateur	✅	❌	❌	❌
Créer un compte agent	✅	❌	❌	❌
Créer un événement	❌	✅	❌	❌
Publier un événement	❌	✅	❌	❌
Consulter les événements publiés	✅	✅	✅	✅
Acheter un billet	❌	❌	✅	❌
Voir ses billets	❌	❌	✅	❌
Valider un billet	❌	❌	❌	✅
Voir le dashboard	❌	✅	❌	❌
Superviser la plateforme	✅	❌	❌	❌
3. Fonctionnalités par rôle
3.1 Admin
Connexion sécurisée (compte pré-créé en base via seed)
Créer un compte organisateur (nom, prénom, email, mot de passe temporaire)
Créer un compte agent d'accueil
Activer / désactiver un compte organisateur ou agent
Visualiser la liste de tous les organisateurs et agents
Accéder aux statistiques globales de la plateforme
3.2 Organisateur
Connexion avec les identifiants fournis par l'admin
Création d'un événement avec les informations suivantes :
text

Titre de l'événement
Description
Catégorie (concert, conférence, match, spectacle, festival, autre)
Date et heure
Lieu (nom de la salle / stade)
Adresse complète
Capacité totale (nombre de places)
Prix du billet (en €)
Image de couverture
Modifier un événement (tant qu'il n'est pas publié)
Publier un événement (le rend visible pour les visiteurs)
Annuler un événement
Consulter la liste de ses événements avec leur statut
Accéder au tableau de bord :
Nombre de billets vendus par événement
Revenus générés
Taux de remplissage
Nombre de validations effectuées à l'entrée
3.3 Visiteur
Inscription libre (nom, prénom, email, mot de passe)
Connexion sécurisée
Consulter la liste des événements publiés
Filtrer les événements par catégorie, date, prix
Rechercher un événement par nom
Consulter la page détail d'un événement
Acheter un ou plusieurs billets pour un événement
text

Règle métier : maximum 3 billets par événement et par utilisateur.
Les billets annulés ne sont pas comptabilisés dans ce quota.
Consulter ses billets avec le QR code associé
Annuler un billet (si l'événement n'a pas encore eu lieu)
3.4 Agent d'accueil
Connexion sécurisée avec les identifiants fournis par l'admin
Accéder à l'interface de scan
Scanner le QR code d'un billet via la caméra
Voir le résultat de la validation en temps réel :
✅ Billet valide → accès autorisé
❌ Billet déjà utilisé → accès refusé
❌ QR code expiré → accès refusé
❌ Billet annulé → accès refusé
❌ QR code invalide → accès refusé
Consulter l'historique des scans de sa session
4. Architecture technique
Stack recommandée
text

BACKEND
───────────────────────────────────────
Runtime         : Node.js
Framework       : Express.js
Base de données : PostgreSQL
ORM             : Prisma
Authentification: JWT (access token + refresh token)
Hashage         : bcrypt
QR Code         : librairie qrcode (génération)
Signature HMAC  : module natif crypto (Node.js)
Validation      : Zod
Upload images   : Multer

FRONTEND
───────────────────────────────────────
Framework       : React (via Vite)
Routing         : React Router v6
State           : Context API ou Zustand
Style           : CSS Modules (pas de framework UI générique)
Icônes          : SVG purs (pas de FontAwesome)
Animations      : Framer Motion (usage subtil)
Scanner QR      : librairie html5-qrcode
Requêtes HTTP   : Axios
Structure des dossiers
text

eventpass/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── ticket.controller.js
│   │   │   └── checkin.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── ticket.routes.js
│   │   │   └── checkin.routes.js
│   │   ├── services/
│   │   │   ├── qrcode.service.js
│   │   │   └── ticket.service.js
│   │   ├── utils/
│   │   │   └── hmac.js
│   │   └── app.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── icons/          ← Fichiers SVG
│   │   ├── components/
│   │   │   ├── common/         ← Button, Input, Badge, Modal
│   │   │   ├── layout/         ← Navbar, Footer
│   │   │   └── features/       ← EventCard, TicketQR, Scanner
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MyTickets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── CheckIn.jsx
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/           ← Appels API centralisés
│   │   ├── styles/
│   │   └── App.jsx
│   ├── .gitignore
│   └── package.json
│
└── README.md
5. Modèle de données
Schéma des entités
text

┌─────────────────────────────────┐
│              USERS              │
├─────────────────────────────────┤
│ id            UUID (PK)         │
│ firstName     String            │
│ lastName      String            │
│ email         String (unique)   │
│ password      String (hashed)   │
│ role          Enum              │
│               ADMIN             │
│               ORGANIZER         │
│               VISITOR           │
│               AGENT             │
│ isActive      Boolean           │
│ createdAt     DateTime          │
│ updatedAt     DateTime          │
└───────────────┬─────────────────┘
                │
                │ 1 organisateur → N événements
                │
┌───────────────▼─────────────────┐
│             EVENTS              │
├─────────────────────────────────┤
│ id            UUID (PK)         │
│ title         String            │
│ description   Text              │
│ category      Enum              │
│               CONCERT           │
│               CONFERENCE        │
│               MATCH             │
│               SPECTACLE         │
│               FESTIVAL          │
│               OTHER             │
│ date          DateTime          │
│ venue         String            │
│ address       String            │
│ capacity      Int               │
│ price         Decimal           │
│ image         String (URL)      │
│ status        Enum              │
│               DRAFT             │
│               PUBLISHED         │
│               CANCELLED         │
│               COMPLETED         │
│ organizerId   UUID (FK → Users) │
│ createdAt     DateTime          │
│ updatedAt     DateTime          │
└───────────────┬─────────────────┘
                │
                │ 1 événement → N tickets
                │
┌───────────────▼─────────────────┐
│            TICKETS              │
├─────────────────────────────────┤
│ id            UUID (PK)         │
│ code          String (unique)   │
│ qrSecret      String            │
│ status        Enum              │
│               VALID             │
│               USED              │
│               CANCELLED         │
│ userId        UUID (FK → Users) │
│ eventId       UUID (FK → Events)│
│ purchasedAt   DateTime          │
│ createdAt     DateTime          │
│ updatedAt     DateTime          │
└───────────────┬─────────────────┘
                │
                │ 1 ticket → N tentatives de scan
                │
┌───────────────▼─────────────────┐
│              SCANS              │
├─────────────────────────────────┤
│ id            UUID (PK)         │
│ ticketId      UUID (FK)         │
│ agentId       UUID (FK → Users) │
│ result        Enum              │
│               SUCCESS           │
│               ALREADY_USED      │
│               EXPIRED           │
│               INVALID           │
│               CANCELLED         │
│ scannedAt     DateTime          │
└─────────────────────────────────┘
6. API Endpoints
Authentification
Méthode	Endpoint	Rôle requis	Description
POST	/api/auth/register	Public	Inscription visiteur
POST	/api/auth/login	Public	Connexion
POST	/api/auth/refresh	Authentifié	Renouveler le token
POST	/api/auth/logout	Authentifié	Déconnexion
Administration
Méthode	Endpoint	Rôle requis	Description
GET	/api/admin/organizers	Admin	Liste des organisateurs
POST	/api/admin/organizers	Admin	Créer un organisateur
PUT	/api/admin/organizers/:id	Admin	Modifier un organisateur
PATCH	/api/admin/organizers/:id/status	Admin	Activer / désactiver
GET	/api/admin/agents	Admin	Liste des agents
POST	/api/admin/agents	Admin	Créer un agent
GET	/api/admin/stats	Admin	Statistiques globales
Événements — Lecture publique
Méthode	Endpoint	Rôle requis	Description
GET	/api/events	Public	Liste des événements publiés
GET	/api/events/:id	Public	Détail d'un événement
GET	/api/events?category=	Public	Filtrer par catégorie
GET	/api/events?search=	Public	Rechercher par nom
GET	/api/events?date=	Public	Filtrer par date
Événements — Gestion organisateur
Méthode	Endpoint	Rôle requis	Description
GET	/api/organizer/events	Organisateur	Mes événements
POST	/api/organizer/events	Organisateur	Créer un événement
PUT	/api/organizer/events/:id	Organisateur	Modifier un événement
PATCH	/api/organizer/events/:id/publish	Organisateur	Publier un événement
PATCH	/api/organizer/events/:id/cancel	Organisateur	Annuler un événement
DELETE	/api/organizer/events/:id	Organisateur	Supprimer (si brouillon)
GET	/api/organizer/events/:id/stats	Organisateur	Statistiques de vente
GET	/api/organizer/dashboard	Organisateur	Tableau de bord global
Billetterie
Méthode	Endpoint	Rôle requis	Description
POST	/api/tickets/purchase	Visiteur	Acheter un ou plusieurs billets
GET	/api/tickets/my-tickets	Visiteur	Mes billets
GET	/api/tickets/:id	Visiteur	Détail d'un billet
GET	/api/tickets/:id/qr	Visiteur	Obtenir le QR dynamique actuel
PATCH	/api/tickets/:id/cancel	Visiteur	Annuler un billet
Validation à l'entrée
Méthode	Endpoint	Rôle requis	Description
POST	/api/checkin/validate	Agent	Valider un QR code scanné
GET	/api/checkin/history	Agent	Historique des scans de la session
GET	/api/checkin/event/:id/stats	Agent	Statistiques en temps réel
7. Sécurité des billets — QR dynamique
Problématique
Un QR code statique peut être copié via screenshot ou photo, ce qui permettrait à plusieurs personnes d'entrer avec le même billet.

Solution retenue : QR rotatif + signature HMAC
Chaque billet génère un QR code qui change toutes les 30 secondes. Ce QR contient une signature cryptographique horodatée. À l'entrée, l'agent scanne le QR et le serveur vérifie que :

text

1. La signature est valide (non falsifiée)
2. Le QR a été généré il y a moins de 60 secondes (non expiré)
3. Le billet n'a pas déjà été utilisé
4. Le billet n'est pas annulé
Format du QR code
text

EVP:{ticketId}:{timestamp}:{signature_HMAC_16_chars}

Exemple :
EVP:a3f8b2c1-9d4e-4f1a-b2c3:1718200000:f3a9c2e1b4d7
Fonctionnement
text

GÉNÉRATION (côté serveur, toutes les 30s)
─────────────────────────────────────────
timestamp  = horodatage Unix actuel
window     = floor(timestamp / 30)
payload    = ticketId + ":" + window
signature  = HMAC-SHA256(payload, QR_SECRET + ticketSecret)[0:16]
qrData     = "EVP:" + ticketId + ":" + timestamp + ":" + signature


VALIDATION (lors du scan)
─────────────────────────
1. Parser le QR → extraire ticketId, timestamp, signature
2. Vérifier que now - timestamp < 60 secondes
3. Recalculer la signature attendue
4. Comparer les signatures
5. Vérifier le statut du billet en base
6. Si tout est valide → marquer le billet "USED"
7. Enregistrer le scan dans la table SCANS
Côté interface (visiteur)
Le QR affiché sur l'interface :

Se rafraîchit automatiquement toutes les 30 secondes
Affiche un compteur de renouvellement visible (ex : "Renouvellement dans 18s")
Comporte une animation de fond en mouvement (bordure animée, indicateur LIVE) qui prouve visuellement que le billet est actif et non une capture d'écran statique
Cette combinaison — QR rotatif + animation live + validation unique en base — constitue la protection effective contre la copie et la fraude.

8. Design & Interface
Références et direction artistique
Le design s'inspire de Nike.com : typographie forte, espaces généreux, palette limitée, animations subtiles et cohérence absolue. L'objectif est une interface perçue comme professionnelle et faite sur mesure, sans aucun élément générique.

Ce qui est explicitement à éviter
text

❌ Dégradés violet-bleu omniprésents
❌ Cards avec ombre excessive et border-radius trop prononcé
❌ Boutons avec gradient
❌ Illustrations vectorielles génériques (type undraw.co)
❌ Titres du type "Welcome to our platform"
❌ Palette trop colorée
❌ Symétrie excessive et compositions trop centrées
❌ Emojis dans les titres et les interfaces
❌ Grilles répétitives icône + titre + texte
❌ Tout ce qui ressemble à un template généré automatiquement
Palette de couleurs
text

Fond principal      #FFFFFF
Fond secondaire     #F5F5F5
Texte principal     #111111
Texte secondaire    #757575
Accent principal    #E63946   (rouge — couleur signature EventPass)
Accent secondaire   #1D3557   (bleu nuit)
Succès              #2D6A4F
Erreur              #D62828
Bordures            #E5E5E5
Typographie
text

Police principale   : Inter (Google Fonts)
Fallback            : Helvetica Neue, Arial, sans-serif

Échelle typographique :
  H1    : 64px / weight 900
  H2    : 48px / weight 800
  H3    : 32px / weight 700
  H4    : 24px / weight 600
  Corps : 16px / weight 400
  Small : 14px / weight 400
  Micro : 12px / weight 500 (labels, badges)
Icônes
Format SVG pur exclusivement
Pas de FontAwesome, pas d'icon font
Sources recommandées : Lucide Icons, Heroicons, Phosphor Icons
Les icônes sont intégrées comme composants React réutilisables
Pages principales
Page	Rôle concerné	Description
Accueil	Tous	Hero section, événements en vedette, catégories
Catalogue événements	Tous	Liste filtrée et paginée des événements publiés
Détail événement	Tous / Visiteur	Informations complètes + bouton d'achat
Connexion	Tous	Formulaire de connexion
Inscription	Visiteur	Formulaire d'inscription
Mes billets	Visiteur	Liste des billets avec QR dynamique
Dashboard organisateur	Organisateur	Statistiques, liste des événements, ventes
Gestion événement	Organisateur	Création et modification d'un événement
Interface de scan	Agent	Caméra + résultat de validation
Panneau admin	Admin	Gestion des organisateurs et agents
9. Bonnes pratiques Git/GitHub
Format des commits (obligatoire)
text

type(scope): description courte en minuscules

Types autorisés :
  feat      → nouvelle fonctionnalité
  fix       → correction de bug
  chore     → configuration, dépendances, outils
  docs      → documentation
  style     → mise en forme (pas de logique)
  refactor  → restructuration sans changement fonctionnel
  test      → ajout ou modification de tests
Exemples de commits attendus
Bash

feat(auth): add user registration with role assignment
feat(auth): implement JWT login and refresh token
feat(events): create organizer event CRUD endpoints
feat(events): add event publication workflow
feat(tickets): implement purchase with 3 tickets per user limit
feat(tickets): generate unique code and QR secret per ticket
feat(qr): add dynamic HMAC-signed QR generation endpoint
feat(checkin): implement ticket validation with expiry check
feat(dashboard): add organizer sales statistics endpoint
docs(readme): add setup instructions and demo accounts
chore: initialize project structure and dependencies
chore(env): add .env.example with required keys
Règles absolues
text

✅ Minimum 10 commits significatifs, bien répartis dans le temps
✅ Un fichier .env.example présent avec toutes les clés (valeurs vides)
✅ Un fichier .gitignore complet dès le premier commit
✅ README complet (voir section suivante)

❌ Aucun commit de type "update files", "fix bug", "wip", "final"
❌ Le dossier node_modules/ ne doit pas apparaître sur GitHub
❌ Le fichier .env ne doit pas apparaître sur GitHub
Contenu du .env.example
env

# Serveur
PORT=
NODE_ENV=

# Base de données
DATABASE_URL=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# QR Code
QR_HMAC_SECRET=

# Upload
UPLOAD_PATH=
10. Livrables attendus
README.md (obligatoire)
Le README doit contenir :

Description
Présentation du projet, fonctionnalités principales, rôles utilisateurs.

Installation
Bash

# Cloner le dépôt
git clone https://github.com/votre-repo/eventpass.git

# Backend
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
Endpoints API
Liste complète des routes avec méthode, chemin, rôle requis et description.

Comptes de démonstration
text

ADMIN
  Email    : admin@eventpass.fr
  Password : Admin1234!

ORGANISATEUR
  Email    : organisateur@eventpass.fr
  Password : Orga1234!

VISITEUR
  Email    : visiteur@eventpass.fr
  Password : Visit1234!

AGENT D'ACCUEIL
  Email    : agent@eventpass.fr
  Password : Agent1234!
Récapitulatif des livrables
text

✅ Dépôt GitHub propre et organisé
✅ Backend fonctionnel (API REST complète)
✅ Frontend connecté à l'API
✅ QR code dynamique opérationnel
✅ Les 4 rôles fonctionnels
✅ Fichier .env.example
✅ Fichier .gitignore
✅ README complet
✅ Minimum 10 commits conventionnels
✅ Aucun fichier sensible ou node_modules sur GitHub