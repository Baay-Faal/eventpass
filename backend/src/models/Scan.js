/**
 * Modèle Scan — Historique des tentatives de validation de billets
 * 
 * Chaque fois qu'un agent scanne un QR code, un enregistrement est créé
 * dans cette table, que le scan réussisse ou non.
 * 
 * Cela permet de :
 *   - Tracer les tentatives de fraude (scans invalides répétés)
 *   - Voir l'historique des entrées validées
 *   - Calculer les statistiques de validation en temps réel
 * 
 * Résultats possibles :
 *   SUCCESS      → billet valide, accès autorisé
 *   ALREADY_USED → billet déjà scanné (quelqu'un essaie de rentrer 2 fois)
 *   EXPIRED      → QR code expiré (généré il y a plus de 60 secondes)
 *   INVALID      → signature HMAC invalide (QR falsifié ou screenshot)
 *   CANCELLED    → billet annulé
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scan = sequelize.define('Scan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  result: {
    type: DataTypes.ENUM('SUCCESS', 'ALREADY_USED', 'EXPIRED', 'INVALID', 'CANCELLED'),
    allowNull: false,
  },
  scannedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'scanned_at',
  },
  ticketId: {
    type: DataTypes.UUID,             // Clé étrangère → tickets
    allowNull: false,
    field: 'ticket_id',
  },
  agentId: {
    type: DataTypes.UUID,             // Clé étrangère → users (l'agent qui scanne)
    allowNull: false,
    field: 'agent_id',
  },
}, {
  tableName: 'scans',
});

module.exports = Scan;
