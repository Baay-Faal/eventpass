---
marp: true
theme: default
class: invert
paginate: true
style: |
  section {
    background-color: #111111;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  }
  h1, h2, h3 {
    color: #ffffff;
    text-transform: uppercase;
    font-weight: 900;
  }
  strong {
    color: #E63946;
  }
---

# EventPass 🎟️
**La Billetterie Nouvelle Génération**
*La fin du billet papier et de la fraude.*

---

## 🛑 Le Constat & Les Problèmes

Dans le secteur de l'événementiel, plusieurs défis majeurs persistent :

1. **Le Marché Noir & La Fraude** : Revente illégale, faux billets, captures d'écran frauduleuses.
2. **L'Expérience Utilisateur** : Perte du billet papier, anxiété liée à l'authenticité de l'achat.
3. **Le Manque de Contrôle** : Les organisateurs n'ont pas de visibilité en temps réel sur leurs ventes et les scans à l'entrée.

---

## 💡 La Solution : EventPass

Une plateforme complète et sécurisée, conçue avec une approche **"Brutaliste"** pour un impact maximal.

**Notre Promesse :**
- Sécurité cryptographique absolue.
- Fluidité de l'achat jusqu'à l'entrée.
- Maîtrise financière totale pour les organisateurs.

---

## 👤 Rôle 1 : Le Visiteur (Acheteur)

L'expérience d'achat réinventée :

- **Catalogue immersif** avec filtrage dynamique.
- **Achat réglementé** : Limite stricte de 3 billets par événement pour tuer la revente de masse.
- **Le Billet Dynamique** : Fini le PDF. Le QR Code se régénère toutes les **60 secondes**. Une capture d'écran devient inutile.

---

## 👔 Rôle 2 : L'Organisateur

Reprendre le pouvoir sur ses événements :

- **Gestion de bout en bout** : Création, modification (brouillons) et publication d'événements.
- **Maîtrise Financière** : Tableau de bord analytique affichant les revenus en temps réel et le taux de remplissage.
- **Zéro Intermédiaire** : Vente directe et traçabilité de chaque acheteur.

---

## 🛡️ Rôle 3 : L'Agent de Sécurité

La technologie au service de la fluidité :

- **Web App de Scan** : Utilise la caméra du smartphone de l'agent.
- **Validation Instantanée** : Vérification de la signature cryptographique (HMAC) en temps réel.
- **Filtre Anti-Fraude** : Rejette immédiatement les QR codes expirés, les billets déjà scannés ou annulés.

---

## ⚙️ Rôle 4 : L'Administrateur

Le chef d'orchestre de la plateforme :

- **Supervision Globale** : Accès aux statistiques financières macroscopiques.
- **Gestion des Accès** : Création des comptes partenaires et désactivation d'urgence (Kill Switch).
- **Flexibilité** : Gestion dynamique de la base de données (catégories d'événements).

---

## 🏗️ Architecture & Stack Technique

Une infrastructure robuste, moderne et évolutive.

- **Frontend** : React.js (Vite), TailwindCSS v4, Framer Motion.
- **Backend** : Node.js, Express.js.
- **SGBD** : MySQL (via l'ORM Sequelize pour l'intégrité ACID).
- **Sécurité** : JWT (Json Web Token), Bcrypt, module natif `crypto` pour les signatures HMAC.

---

## 🎨 Philosophie Design (UI/UX)

Le design **Brutaliste** inspiré des grandes marques (ex: Nike) :

- **Typographie** : Polices sans-serif massives pour crier l'information.
- **Couleurs** : Contraste extrême (Noir Profond, Blanc pur, Rouge Accent).
- **Simplicité** : Pas de fioritures, pas d'ombres douces. L'interface va droit au but.

---

# Merci ! 🎟️
**EventPass** est prêt à redéfinir les standards de l'industrie événementielle.
