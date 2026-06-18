/**
 * Modèle User — Tous les utilisateurs de la plateforme
 * 
 * Chaque utilisateur a un rôle qui détermine ses permissions :
 *   - ADMIN       : supervise la plateforme, crée les comptes
 *   - ORGANIZER   : crée et publie des événements
 *   - VISITOR     : consulte les événements, achète des billets
 *   - AGENT       : valide les billets à l'entrée via scan QR
 * 
 * Le mot de passe est stocké hashé (bcrypt) — jamais en clair.
 * Le champ isActive permet à l'admin de désactiver un compte.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,              // Identifiant universel unique
    defaultValue: DataTypes.UUIDV4,    // Généré automatiquement
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,                  // Champ obligatoire
    field: 'first_name',              // Nom de la colonne en base
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                      // Deux utilisateurs ne peuvent pas avoir le même email
    validate: {
      isEmail: true,                   // Vérifie que c'est un format email valide
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'ORGANIZER', 'VISITOR', 'AGENT'),
    defaultValue: 'VISITOR',           // Par défaut, un nouvel inscrit est visiteur
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,                // Compte actif par défaut
    field: 'is_active',
  },
}, {
  tableName: 'users',                  // Nom de la table en base de données
});

module.exports = User;
