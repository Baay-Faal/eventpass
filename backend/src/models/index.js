/**
 * Index des modèles — Regroupe tous les modèles et définit les relations
 * 
 * Les relations entre tables sont définies ici :
 * 
 *   User (organisateur) ──1:N──▶ Event
 *     → Un organisateur peut créer plusieurs événements
 * 
 *   User (visiteur) ──1:N──▶ Ticket
 *     → Un visiteur peut acheter plusieurs billets
 * 
 *   Event ──1:N──▶ Ticket
 *     → Un événement peut avoir plusieurs billets vendus
 * 
 *   Ticket ──1:N──▶ Scan
 *     → Un billet peut être scanné plusieurs fois (tentatives)
 * 
 *   User (agent) ──1:N──▶ Scan
 *     → Un agent peut effectuer plusieurs scans
 * 
 * Comment importer :
 *   const { User, Event, Ticket, Scan, sequelize } = require('./models');
 */

const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');
const Ticket = require('./Ticket');
const Scan = require('./Scan');
const Category = require('./Category');

// ─── RELATIONS ─────────────────────────────────────────────────────

// Un utilisateur (ORGANIZER) peut créer plusieurs événements
User.hasMany(Event, { foreignKey: 'organizerId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

// Un visiteur achète plusieurs billets
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Un événement a plusieurs billets
Event.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
Ticket.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Un billet peut être scanné plusieurs fois
Ticket.hasMany(Scan, { foreignKey: 'ticketId', as: 'scans' });
Scan.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Un agent effectue plusieurs scans
User.hasMany(Scan, { foreignKey: 'agentId', as: 'scans' });
Scan.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });

module.exports = {
  sequelize,
  User,
  Event,
  Ticket,
  Scan,
  Category,
};
