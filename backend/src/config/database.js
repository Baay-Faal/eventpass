/**
 * Configuration de la connexion à MySQL via Sequelize
 * 
 * Sequelize a besoin de 4 informations pour se connecter :
 *   - host     : adresse du serveur MySQL (localhost en dev)
 *   - port     : port MySQL (3306 par défaut)
 *   - database : nom de la base de données
 *   - username/password : identifiants MySQL
 * 
 * Options importantes :
 *   - dialect: 'mysql'  → dit à Sequelize qu'on utilise MySQL
 *   - logging: false    → désactive les logs SQL (trop verbeux)
 *   - timestamps: true  → ajoute automatiquement createdAt/updatedAt
 */

const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(
  config.db.name,      // Nom de la base : 'EventPass'
  config.db.user,      // Utilisateur : 'root'
  config.db.password,  // Mot de passe : '' (vide)
  {
    host: config.db.host,       // 'localhost'
    port: config.db.port,       // 3306
    dialect: 'mysql',           // Type de base de données
    logging: false,             // Pas de logs SQL dans la console
    define: {
      timestamps: true,         // Ajoute createdAt et updatedAt automatiquement
      underscored: true,        // Utilise snake_case en base (created_at au lieu de createdAt)
    },
    pool: {
      max: 10,                  // Maximum 10 connexions simultanées
      min: 0,                   // Minimum 0 (ferme les connexions inutilisées)
      acquire: 30000,           // Timeout de 30s pour obtenir une connexion
      idle: 10000,              // Ferme une connexion après 10s d'inactivité
    },
  }
);

module.exports = sequelize;
