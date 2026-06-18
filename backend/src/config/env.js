/**
 * Configuration de l'application
 * 
 * Centralise la lecture de TOUTES les variables d'environnement.
 * On importe ce fichier partout où on a besoin d'une config :
 *   const config = require('./config/env');
 *   console.log(config.port); // 3000
 * 
 * Avantages :
 * - Un seul endroit pour voir toutes les variables
 * - Valeurs par défaut si une variable manque
 * - Le serveur refuse de démarrer si une variable critique manque
 */

require('dotenv').config();

const config = {
  // Serveur
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Base de données MySQL (utilisée par Sequelize)
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'EventPass',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  // JWT (JSON Web Tokens) pour l'authentification
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // QR Code — secret pour la signature HMAC
  qrHmacSecret: process.env.QR_HMAC_SECRET,

  // Upload d'images
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
};

// ─── Vérification des variables critiques ──────────────────────────────
// Si une variable essentielle manque, le serveur refuse de démarrer.
// Mieux vaut une erreur claire au lancement qu'un bug mystérieux en prod.

const required = [
  { key: 'JWT_ACCESS_SECRET', value: config.jwt.accessSecret },
  { key: 'JWT_REFRESH_SECRET', value: config.jwt.refreshSecret },
  { key: 'QR_HMAC_SECRET', value: config.qrHmacSecret },
];

for (const { key, value } of required) {
  if (!value) {
    console.error(`❌ Variable d'environnement manquante : ${key}`);
    console.error(`   Vérifiez votre fichier .env`);
    process.exit(1);
  }
}

module.exports = config;
