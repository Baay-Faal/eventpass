/**
 * Modèle Event — Les événements créés par les organisateurs
 * 
 * Cycle de vie d'un événement :
 *   DRAFT → PUBLISHED → COMPLETED
 *                     → CANCELLED
 * 
 * Un événement en DRAFT est modifiable et invisible pour les visiteurs.
 * Une fois PUBLISHED, il devient visible et les billets sont en vente.
 * Il peut être CANCELLED (annulé) ou passe en COMPLETED après sa date.
 * 
 * Catégories possibles : CONCERT, CONFERENCE, MATCH, SPECTACLE, FESTIVAL, OTHER
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,              // TEXT = texte long (pas de limite de 255 caractères)
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,              // Date et heure de l'événement
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,            // Nom du lieu (ex: "Parc des Princes")
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,            // Adresse complète
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,           // Nombre total de places
    allowNull: false,
    validate: {
      min: 1,                          // Au moins 1 place
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),    // Prix en € (ex: 29.99)
    allowNull: false,
    validate: {
      min: 0,                          // Pas de prix négatif
    },
  },
  image: {
    type: DataTypes.STRING,            // URL de l'image de couverture
    allowNull: true,                   // Optionnel
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'requires_approval',
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'),
    defaultValue: 'DRAFT',            // Un événement commence en brouillon
    allowNull: false,
  },
  organizerId: {
    type: DataTypes.UUID,              // Clé étrangère vers la table users
    allowNull: false,
    field: 'organizer_id',
  },
}, {
  tableName: 'events',
});

module.exports = Event;
