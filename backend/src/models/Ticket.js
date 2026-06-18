/**
 * Modèle Ticket — Les billets achetés par les visiteurs
 * 
 * Chaque billet a :
 *   - Un code unique (ex: "EVP-A3F8B2C1") affiché sur le billet
 *   - Un qrSecret : secret individuel utilisé pour signer le QR code HMAC
 *     (chaque billet a son propre secret → impossible de deviner la signature)
 * 
 * Statuts :
 *   VALID     → billet actif, pas encore utilisé
 *   USED      → billet scanné et validé à l'entrée
 *   CANCELLED → billet annulé par le visiteur
 * 
 * Règle métier : max 3 billets par utilisateur par événement
 * (cette règle est vérifiée dans le controller, pas dans le modèle)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                     // Chaque billet a un code unique
  },
  qrSecret: {
    type: DataTypes.STRING,           // Secret HMAC individuel pour ce billet
    allowNull: false,
    field: 'qr_secret',
  },
  status: {
    type: DataTypes.ENUM('VALID', 'USED', 'CANCELLED'),
    defaultValue: 'VALID',
    allowNull: false,
  },
  purchasedAt: {
    type: DataTypes.DATE,             // Date d'achat
    defaultValue: DataTypes.NOW,
    field: 'purchased_at',
  },
  userId: {
    type: DataTypes.UUID,             // Clé étrangère → users (l'acheteur)
    allowNull: false,
    field: 'user_id',
  },
  eventId: {
    type: DataTypes.UUID,             // Clé étrangère → events (l'événement)
    allowNull: false,
    field: 'event_id',
  },
}, {
  tableName: 'tickets',
});

module.exports = Ticket;
